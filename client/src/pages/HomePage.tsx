import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import BottomNavigation from "@/components/BottomNavigation";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Crown, Gem, Gamepad2, MoreHorizontal, User as UserIcon, Users, MessageSquare, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { User } from "@shared/schema";

export default function HomePage() {
  const [location, setLocation] = useLocation();
  const { isPremiumTier } = useSubscription();
  const [showEmailModal, setShowEmailModal] = useState(false);
  
  // Day navigation for development testing
  const [testDayOverride, setTestDayOverride] = useState<number | null>(null);
  
  // Get current day from API - only load when on home page
  const { data: nextDayData } = useQuery({
    queryKey: ['/api/next-available-day', 1],
    queryFn: () => fetch('/api/next-available-day/1').then(res => res.json())
  });
  
  const currentDayIndex = testDayOverride || nextDayData?.dayIndex || 1;
  
  // Home-specific API calls
  const { data: dayMetadata } = useQuery({
    queryKey: ['/api/day-metadata', currentDayIndex],
    queryFn: () => fetch(`/api/day-metadata/${currentDayIndex}`).then(res => res.json())
  });

  const { data: dailyFacts } = useQuery({
    queryKey: ['/api/daily-facts', currentDayIndex],
    queryFn: () => fetch(`/api/daily-facts/${currentDayIndex}`).then(res => res.json())
  });

  const { data: user } = useQuery<User>({
    queryKey: ['/api/user']
  });

  const setActiveSection = (section: "home" | "learn" | "money" | "simulations" | "more") => {
    if (section === "learn") setLocation("/learn");
    else if (section === "money") setLocation("/money");
    else if (section === "simulations") setLocation("/simulators");
    else if (section === "more") setLocation("/more");
    else setLocation("/");
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setLocation('/')}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-sm">
                  HL
                </div>
                <div>
                  <h1 className="text-xl font-bold">HODLearn</h1>
                  <p className="text-xs text-zinc-400">How-to-learn BTC</p>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              {/* Account Button */}
              <Button 
                onClick={() => setLocation('/account')}
                size="sm"
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5"
                title="Account Settings"
              >
                <UserIcon className="w-4 h-4" />
                <span className="sr-only">Account</span>
              </Button>
              
              {/* Premium Status Indicator */}
              {isPremiumTier ? (
                <div className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500 px-2.5 py-1.5 font-medium rounded flex items-center">
                  <Gem className="w-4 h-4" />
                  <span className="sr-only">Premium</span>
                </div>
              ) : (
                <Button 
                  onClick={() => setShowEmailModal(true)}
                  size="sm"
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5"
                  title="Upgrade to Premium"
                >
                  <Crown className="w-4 h-4" />
                  <span className="sr-only">Upgrade</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 pb-24">
        <div className="space-y-8">
          {/* Welcome Header - Time-based greeting */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-white">
              {(() => {
                const hour = new Date().getHours();
                let greeting = "Good morning";
                if (hour >= 12 && hour < 17) greeting = "Good afternoon";
                else if (hour >= 17 && hour < 21) greeting = "Good evening";
                else if (hour >= 21) greeting = "Good night";
                return greeting + (user?.firstName ? `, ${user.firstName}` : '') + '!';
              })()}
            </h1>
          </div>

          {/* Activity Progress Tracking - Apple Watch Style */}
          <div className="relative">
            <Card className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-800/50 border-zinc-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  {/* Progress Rings */}
                  <div className="flex items-center gap-6">
                    <div className="relative w-16 h-16">
                      {/* Daily Ring */}
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="26" fill="none" stroke="#27272a" strokeWidth="4"/>
                        <circle 
                          cx="32" cy="32" r="26" fill="none" 
                          stroke="#f97316" strokeWidth="4"
                          strokeDasharray={`${(user?.currentStreak || 0) > 0 ? 163 : 0} 163`}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      {/* Weekly Ring */}
                      <svg className="absolute inset-0 w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                        <circle 
                          cx="32" cy="32" r="22" fill="none" 
                          stroke="#22c55e" strokeWidth="3"
                          strokeDasharray={`${Math.min(((user?.currentStreak || 0) % 7) / 7, 1) * 138} 138`}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      {/* Monthly Ring */}
                      <svg className="absolute inset-0 w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                        <circle 
                          cx="32" cy="32" r="18" fill="none" 
                          stroke="#06b6d4" strokeWidth="2"
                          strokeDasharray={`${Math.min(((user?.currentStreak || 0) % 30) / 30, 1) * 113} 113`}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      {/* Center streak number */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-orange-400 font-bold text-lg">{user?.currentStreak || 0}</span>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="space-y-1">
                      <div className="text-white font-semibold">Activity Rings</div>
                      <div className="space-y-0.5 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-zinc-300">Daily: {user?.currentStreak || 0} day streak</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-zinc-300">Weekly: {Math.ceil((user?.currentStreak || 0) / 7)} weeks</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                          <span className="text-zinc-300">Monthly: {Math.ceil((user?.currentStreak || 0) / 30)} months</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Achievement Badge */}
                  <div className="text-right">
                    {(user?.currentStreak || 0) >= 7 && (
                      <div className="inline-flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1 animate-pulse">
                        <Crown className="w-3 h-3 text-orange-400" />
                        <span className="text-orange-400 text-xs font-medium">
                          {(user?.currentStreak || 0) >= 30 ? "Master" : 
                           (user?.currentStreak || 0) >= 14 ? "Expert" : "Committed"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Learning Focus */}
          <Card className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-800/50 border-zinc-700 hover:border-orange-500/30 transition-all duration-300 overflow-hidden">
            <CardContent className="p-0">
              {/* Floating Background Elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500/5 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-orange-500/3 rounded-full blur-2xl"></div>
              </div>
              
              <div className="relative p-6">
                {/* Day Indicator */}
                <div className="flex justify-center items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-orange-400 font-semibold text-sm">Day {currentDayIndex}</span>
                  </div>
                </div>

                <div className="space-y-4 text-center">
                  {/* Main Title with Icon */}
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <div className="p-3 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-full border border-orange-500/30 shadow-lg shadow-orange-500/10">
                        <MessageSquare className="w-6 h-6 text-orange-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {dayMetadata?.title || 'Loading today\'s lesson...'}
                    </h3>
                  </div>
                  
                  {/* Today's Preview - Enhanced */}
                  {dailyFacts && dailyFacts[0] && (
                    <div className="bg-gradient-to-r from-zinc-800/40 to-zinc-700/20 rounded-lg p-4 border border-zinc-700/50 backdrop-blur-sm">
                      <div className="flex items-center gap-2 justify-center mb-2">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></div>
                        <span className="text-orange-400 text-sm font-medium">Today's Focus</span>
                      </div>
                      <p className="text-zinc-200 text-sm font-medium">
                        {dailyFacts[0].title}
                      </p>
                    </div>
                  )}
                  
                  {/* Progress Motivation - Enhanced */}
                  <div className="text-zinc-400 text-sm">
                    {user?.currentStreak === 0 ? "🚀 Start your Bitcoin journey today" :
                     user?.currentStreak === 1 ? "✨ Great start! Keep going" :
                     user?.currentStreak && user.currentStreak < 7 ? "💪 Building a solid habit" :
                     user?.currentStreak && user.currentStreak < 30 ? "🔥 You're on fire!" :
                     "🏆 Bitcoin conviction master in the making"}
                  </div>
                  
                  {/* Enhanced Continue Button */}
                  <Button 
                    onClick={() => setLocation('/learn')}
                    className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 hover:from-orange-700 hover:via-orange-600 hover:to-orange-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Continue Learning →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Simulator of the Day */}
          <Card className="bg-gradient-to-br from-emerald-900/20 via-zinc-800 to-zinc-800/50 border-emerald-700/30 hover:border-emerald-500/50 transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold text-sm">Simulator of the Day</span>
                </div>
                <div className="text-xs text-zinc-400">Interactive</div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-white font-semibold">Safety Training Center</h4>
                <p className="text-zinc-300 text-sm">
                  Test your Bitcoin security knowledge with 12 real-world scenarios. Master the skills to protect your digital assets.
                </p>
                
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    <div className="w-6 h-6 bg-orange-500 rounded-full border-2 border-zinc-800 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">1</span>
                    </div>
                    <div className="w-6 h-6 bg-emerald-500 rounded-full border-2 border-zinc-800 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">2</span>
                    </div>
                    <div className="w-6 h-6 bg-cyan-500 rounded-full border-2 border-zinc-800 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">3</span>
                    </div>
                    <div className="w-6 h-6 bg-zinc-600 rounded-full border-2 border-zinc-800 flex items-center justify-center">
                      <span className="text-xs text-white">+9</span>
                    </div>
                  </div>
                  <span className="text-zinc-400 text-xs">12 scenarios</span>
                </div>
                
                <Button 
                  onClick={() => setLocation('/simulators')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition-all duration-300"
                >
                  Start Security Training
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Quick Access Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Finance/Money Card - Enhanced */}
            <Card className="bg-gradient-to-br from-zinc-800 to-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-all duration-300 group">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                    <TrendingUp className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="text-sm font-medium text-white">Why Bitcoin?</span>
                </div>
                <p className="text-xs text-zinc-400 mb-3">
                  Watch inflation destroy your money
                </p>
                <Button 
                  onClick={() => setLocation('/money')}
                  className="w-full bg-orange-600/80 hover:bg-orange-600 text-white text-xs font-medium py-2 rounded-lg transition-all duration-300"
                >
                  Explore Impact →
                </Button>
              </CardContent>
            </Card>

            {/* Community Card - Enhanced */}
            <Card className="bg-gradient-to-br from-zinc-800 to-zinc-800/50 border-zinc-700 hover:border-blue-500/50 transition-all duration-300 group">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-white">Community</span>
                </div>
                <p className="text-xs text-zinc-400 mb-3">
                  Connect with fellow learners
                </p>
                <Button 
                  onClick={() => setLocation('/community')}
                  className="w-full bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-medium py-2 rounded-lg transition-all duration-300"
                >
                  Join Discussion →
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Achievement Showcase */}
          {(user?.currentStreak || 0) >= 3 && (
            <Card className="bg-gradient-to-br from-purple-900/20 via-zinc-800 to-zinc-800/50 border-purple-700/30 animate-pulse">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-400 font-semibold">Recent Achievement</span>
                  </div>
                  <div className="text-xs text-zinc-400">Unlocked!</div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-white font-semibold">
                    {(user?.currentStreak || 0) >= 30 ? "🏆 Bitcoin Master" :
                     (user?.currentStreak || 0) >= 14 ? "🥇 Dedicated Learner" :
                     (user?.currentStreak || 0) >= 7 ? "⭐ Week Warrior" : "🎯 Consistent Student"}
                  </h4>
                  <p className="text-zinc-300 text-sm">
                    {(user?.currentStreak || 0) >= 30 ? "You've maintained learning for a full month! Your Bitcoin knowledge is truly exceptional." :
                     (user?.currentStreak || 0) >= 14 ? "Two weeks of consistent learning! You're building serious Bitcoin conviction." :
                     (user?.currentStreak || 0) >= 7 ? "A full week of Bitcoin education! Your commitment is paying off." : 
                     "Keep up the momentum! Consistency builds conviction."}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Progress</span>
                    <span className="text-purple-400 font-medium">{user?.currentStreak || 0} days strong</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <BottomNavigation 
        activeSection="home"
        onSectionChange={(section) => {
          if (section === 'learn') setLocation('/learn');
          else if (section === 'money') setLocation('/money');
          else if (section === 'simulators') setLocation('/simulators');
          else if (section === 'community') setLocation('/community');
          else if (section === 'more') setLocation('/more');
        }}
      />
    </div>
  );
}