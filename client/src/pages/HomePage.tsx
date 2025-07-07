import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import BottomNavigation from "@/components/BottomNavigation";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Crown, Gem, Gamepad2, MoreHorizontal, User as UserIcon, Users, MessageSquare, TrendingUp, ArrowRight, Shield, TrendingDown, Award } from "lucide-react";
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

          {/* Activity Dashboard - Professional */}
          <Card className="bg-gradient-to-r from-zinc-900/90 via-zinc-800 to-zinc-900/90 border border-zinc-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  {/* Minimalist Progress Indicator */}
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-orange-400 font-bold text-lg leading-none">{user?.currentStreak || 0}</div>
                        <div className="text-zinc-500 text-xs uppercase tracking-wider">Days</div>
                      </div>
                    </div>
                    <div className="absolute -inset-1">
                      <div 
                        className="w-16 h-16 rounded-full border-2 border-transparent bg-gradient-to-r from-orange-500 to-orange-600"
                        style={{
                          background: `conic-gradient(from 0deg, #f97316 0deg, #f97316 ${Math.min((user?.currentStreak || 0) * 12, 360)}deg, #27272a ${Math.min((user?.currentStreak || 0) * 12, 360)}deg)`
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Clean Stats */}
                  <div className="space-y-3">
                    <div>
                      <div className="text-white font-semibold text-lg">Learning Streak</div>
                      <div className="text-zinc-400 text-sm">Building conviction takes consistency</div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
                        <span className="text-zinc-300">{user?.currentStreak || 0} consecutive days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-zinc-600 rounded-full"></div>
                        <span className="text-zinc-400">{Math.ceil((user?.currentStreak || 0) / 7)} weeks active</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 bg-zinc-800/80 border border-zinc-700 rounded-lg px-3 py-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-zinc-300 text-sm font-medium">Active Learner</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Focus - Clean Professional */}
          <Card className="bg-gradient-to-br from-zinc-900/95 to-zinc-800/80 border border-zinc-700/50 hover:border-orange-500/40 transition-all duration-500 backdrop-blur-sm">
            <CardContent className="p-8">
              {/* Clean Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20 flex items-center justify-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Today's Learning</h3>
                    <p className="text-zinc-400 text-sm">Day {currentDayIndex} of your Bitcoin education</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-orange-400 text-sm font-medium">Active</div>
                  <div className="text-zinc-500 text-xs">In Progress</div>
                </div>
              </div>

              {/* Content Preview */}
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-white leading-tight">
                  {dayMetadata?.title || 'Loading today\'s lesson...'}
                </h4>
                
                {dailyFacts && dailyFacts[0] && (
                  <div className="bg-zinc-800/40 rounded-xl p-4 border border-zinc-700/30">
                    <div className="flex items-start gap-3">
                      <div className="w-1 h-12 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full mt-1"></div>
                      <div>
                        <div className="text-orange-400 text-xs font-medium uppercase tracking-wider mb-1">Key Focus</div>
                        <p className="text-zinc-200 font-medium">
                          {dailyFacts[0].title}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Professional Motivation */}
                <div className="flex items-center justify-between py-4 border-t border-zinc-700/30">
                  <div className="text-zinc-400">
                    {user?.currentStreak === 0 ? "Begin your Bitcoin education journey" :
                     user?.currentStreak === 1 ? "Building momentum with consistent learning" :
                     user?.currentStreak && user.currentStreak < 7 ? "Developing strong learning habits" :
                     user?.currentStreak && user.currentStreak < 30 ? "Exceptional commitment to Bitcoin education" :
                     "Advanced Bitcoin knowledge development"}
                  </div>
                  <ArrowRight className="w-4 h-4 text-orange-400" />
                </div>
                
                {/* Sleek Continue Button */}
                <Button 
                  onClick={() => setLocation('/learn')}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 hover:translate-y-[-1px]"
                >
                  Continue Learning
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Featured Simulator - Professional */}
          <Card className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/80 border border-zinc-700/50 hover:border-zinc-600/70 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Featured Practice</h4>
                    <p className="text-zinc-400 text-sm">Interactive security training</p>
                  </div>
                </div>
                <div className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded-md">
                  Recommended
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h5 className="text-white font-medium mb-2">Bitcoin Security Assessment</h5>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Master essential security practices through 12 real-world scenarios. Build the knowledge to protect your digital assets with confidence.
                  </p>
                </div>
                
                <div className="flex items-center justify-between py-3 border-t border-zinc-700/30">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-zinc-400 text-sm">12 scenarios</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-zinc-600 rounded-full"></div>
                      <span className="text-zinc-400 text-sm">5-10 minutes</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-500" />
                </div>
                
                <Button 
                  onClick={() => setLocation('/simulators')}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 hover:border-zinc-500 text-white font-medium py-3 rounded-lg transition-all duration-300"
                >
                  Begin Security Training
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Access Grid - Sleek */}
          <div className="grid grid-cols-2 gap-4">
            {/* Finance Analysis */}
            <Card className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/60 border border-zinc-700/50 hover:border-orange-500/30 transition-all duration-300 group backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center group-hover:border-orange-500/30 transition-colors">
                      <TrendingDown className="w-4 h-4 text-zinc-400 group-hover:text-orange-400 transition-colors" />
                    </div>
                    <div>
                      <h5 className="text-white font-medium">Inflation Impact</h5>
                      <p className="text-zinc-500 text-xs">Financial analysis</p>
                    </div>
                  </div>
                  <p className="text-zinc-400 text-sm">
                    Explore how monetary policy affects your purchasing power
                  </p>
                  <Button 
                    onClick={() => setLocation('/money')}
                    variant="outline"
                    className="w-full border-zinc-600 hover:border-orange-500/50 text-zinc-300 hover:text-white bg-transparent hover:bg-orange-500/5 transition-all duration-300"
                  >
                    Analyze Impact
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Community Hub */}
            <Card className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/60 border border-zinc-700/50 hover:border-zinc-600/70 transition-all duration-300 group backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center group-hover:border-zinc-600 transition-colors">
                      <Users className="w-4 h-4 text-zinc-400 transition-colors" />
                    </div>
                    <div>
                      <h5 className="text-white font-medium">Community</h5>
                      <p className="text-zinc-500 text-xs">Discussion hub</p>
                    </div>
                  </div>
                  <p className="text-zinc-400 text-sm">
                    Connect with fellow Bitcoin learners and share insights
                  </p>
                  <Button 
                    onClick={() => setLocation('/community')}
                    variant="outline"
                    className="w-full border-zinc-600 hover:border-zinc-500 text-zinc-300 hover:text-white bg-transparent hover:bg-zinc-700/50 transition-all duration-300"
                  >
                    Join Discussion
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievement Display - Clean */}
          {(user?.currentStreak || 0) >= 7 && (
            <Card className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/80 border border-zinc-700/40 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20 flex items-center justify-center">
                      <Award className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h5 className="text-white font-semibold">
                        {(user?.currentStreak || 0) >= 30 ? "Bitcoin Expert" :
                         (user?.currentStreak || 0) >= 14 ? "Dedicated Learner" : "Consistent Student"}
                      </h5>
                      <p className="text-zinc-400 text-sm">
                        {(user?.currentStreak || 0) >= 30 ? "Exceptional commitment to Bitcoin education" :
                         (user?.currentStreak || 0) >= 14 ? "Building strong Bitcoin knowledge foundation" : 
                         "Developing consistent learning habits"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-orange-400 font-semibold">{user?.currentStreak || 0}</div>
                    <div className="text-zinc-500 text-xs">Day streak</div>
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