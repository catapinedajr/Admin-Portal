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

          {/* Simple Streak Display */}
          <div className="text-center space-y-2 mb-8">
            <div className="text-orange-400 text-2xl font-bold">
              {user?.currentStreak || 0} day streak
            </div>
            <div className="text-zinc-400 text-sm">
              Keep the habit strong
            </div>
          </div>

          {/* Enhanced Main Learning Card - Mobile Optimized */}
          <Card className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-800/50 border-zinc-700 hover:border-orange-500/30 transition-all duration-300">
            <CardContent className="p-5">
              {/* Day Indicator Only */}
              <div className="flex justify-center items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-orange-400 font-semibold text-sm">Day {currentDayIndex}</span>
                </div>
              </div>

              <div className="space-y-4 text-center">
                {/* Main Title with Icon */}
                <div className="space-y-2">
                  <div className="flex justify-center">
                    <div className="p-2 bg-orange-500/10 rounded-full border border-orange-500/20">
                      <MessageSquare className="w-5 h-5 text-orange-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-tight">
                    {dayMetadata?.title || 'Loading today\'s lesson...'}
                  </h3>
                </div>
                
                {/* Today's Preview - Compact */}
                {dailyFacts && dailyFacts[0] && (
                  <div className="bg-zinc-800/30 rounded-lg p-3 border border-zinc-700/50">
                    <div className="flex items-center gap-1 justify-center mb-1">
                      <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                      <span className="text-orange-400 text-xs font-medium">Today's Focus</span>
                    </div>
                    <p className="text-zinc-300 text-sm">
                      {dailyFacts[0].title}
                    </p>
                  </div>
                )}
                
                {/* Progress Motivation - Compact */}
                <div className="text-zinc-400 text-xs">
                  {user?.currentStreak === 0 ? "Start your learning journey today" :
                   user?.currentStreak === 1 ? "Great start! Keep going" :
                   user?.currentStreak && user.currentStreak < 7 ? "Building a solid habit" :
                   user?.currentStreak && user.currentStreak < 30 ? "You're on fire! 🔥" :
                   "Bitcoin conviction master in the making"}
                </div>
                
                {/* Enhanced Continue Button - Compact */}
                <Button 
                  onClick={() => setLocation('/learn')}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                >
                  Continue Learning →
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Access Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Finance/Money Card */}
            <Card className="bg-gradient-to-br from-zinc-800 to-zinc-800/50 border-zinc-700 hover:border-zinc-600 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium text-white">Why Bitcoin?</span>
                </div>
                <p className="text-xs text-zinc-400 mb-3">
                  See how inflation affects your money
                </p>
                <Button 
                  onClick={() => setLocation('/money')}
                  size="sm"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Explore
                </Button>
              </CardContent>
            </Card>

            {/* Simulators Card */}
            <Card className="bg-gradient-to-br from-zinc-800 to-zinc-800/50 border-zinc-700 hover:border-zinc-600 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Gamepad2 className="w-4 h-4 text-zinc-300" />
                  <span className="text-sm font-medium text-white">Practice</span>
                </div>
                <p className="text-xs text-zinc-400 mb-3">
                  Safe hands-on Bitcoin experience
                </p>
                <Button 
                  onClick={() => setLocation('/simulators')}
                  size="sm"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Try Now
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Community Quick Link */}
          <Card className="bg-zinc-800/30 border-zinc-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-orange-400" />
                  <div>
                    <h3 className="text-sm font-medium text-white">Join the Community</h3>
                    <p className="text-xs text-zinc-400">Connect with other learners</p>
                  </div>
                </div>
                <Button 
                  onClick={() => setLocation('/community')}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4"
                >
                  Join
                </Button>
              </div>
            </CardContent>
          </Card>
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