import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import BottomNavigation from "@/components/BottomNavigation";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Crown, Gem, Gamepad2, MoreHorizontal, User as UserIcon, Users, MessageSquare, TrendingUp, ArrowRight, Shield, TrendingDown, Award } from "@/lib/icons";
import BitcoinPriceDisplay from "@/components/BitcoinPriceDisplay";
import WalletDisplay from "@/components/WalletDisplay";
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

            {/* Bitcoin Price Display */}
            <div className="hidden md:block">
              <BitcoinPriceDisplay />
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

      {/* Mobile Bitcoin Price Display */}
      <div className="md:hidden bg-zinc-800/50 border-b border-zinc-700/50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <BitcoinPriceDisplay />
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6 pb-32">
        <div className="space-y-8">
          {/* Welcome Header - Time-based greeting */}
          <div className="text-center space-y-6">
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
            
            {/* Brand Tagline */}
            <div className="space-y-2">
              <p className="text-lg text-zinc-300">Understanding Bitcoin takes time</p>
              <p className="text-lg text-zinc-300">Building conviction takes community</p>
              <p className="text-lg font-semibold text-orange-400">This is HODLearn</p>
            </div>
          </div>

          {/* OPTION 1: Linear Progress Bar Style */}
          {false && (
          <Card className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/80 border border-zinc-700/40">
            <CardContent className="p-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">Learning Progress</h3>
                    <p className="text-zinc-400 text-sm">Day {user?.currentStreak || 0} of your Bitcoin journey</p>
                  </div>
                  <div className="text-right">
                    <div className="text-orange-400 font-bold text-lg">{user?.currentStreak || 0}</div>
                    <div className="text-zinc-500 text-xs">Days</div>
                  </div>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((user?.currentStreak || 0) * 3.33, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Start</span>
                  <span>30 Days</span>
                </div>
              </div>
            </CardContent>
          </Card>
          )}

          {/* OPTION 2: Stats Dashboard Style */}
          {true && (
          <Card className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/80 border border-zinc-700/40">
            <CardContent className="p-5">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-orange-400 font-bold text-2xl">{user?.currentStreak || 0}</div>
                  <div className="text-zinc-400 text-xs uppercase tracking-wider">Current Streak</div>
                </div>
                <div className="text-center border-l border-r border-zinc-700/50">
                  <div className="text-white font-bold text-2xl">{Math.ceil((user?.currentStreak || 0) / 7)}</div>
                  <div className="text-zinc-400 text-xs uppercase tracking-wider">Weeks Active</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-2xl">{currentDayIndex}</div>
                  <div className="text-zinc-400 text-xs uppercase tracking-wider">Current Day</div>
                </div>
              </div>
            </CardContent>
          </Card>
          )}

          {/* OPTION 3: Minimalist Badge Style */}
          {false && (
          <Card className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/80 border border-zinc-700/40">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 flex items-center justify-center">
                    <span className="text-orange-400 font-bold">{user?.currentStreak || 0}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Day {user?.currentStreak || 0} Streak</h3>
                    <p className="text-zinc-400 text-sm">Building conviction takes consistency</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-orange-400 text-sm font-medium">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
          )}

          {/* Main Learning Card - Streamlined */}
          <Card className="bg-gradient-to-br from-zinc-900/95 to-zinc-800/90 border border-zinc-700/50 hover:border-orange-500/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {dayMetadata?.title || 'Loading today\'s lesson...'}
                    </h3>
                    <p className="text-zinc-400 text-sm">Day {currentDayIndex} • Bitcoin Education</p>
                  </div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                </div>
                
                {dailyFacts && dailyFacts[0] && (
                  <div className="bg-zinc-800/50 rounded-lg p-4 border-l-2 border-orange-500">
                    <p className="text-zinc-200 font-medium">
                      {dailyFacts[0].title}
                    </p>
                  </div>
                )}
                
                <Button 
                  onClick={() => setLocation('/learn')}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                >
                  Continue Learning
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Grid - Streamlined */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-zinc-900/80 border border-zinc-700/40 hover:border-orange-500/30 transition-colors group">
              <CardContent className="p-4 text-center">
                <Shield className="w-5 h-5 text-zinc-400 group-hover:text-orange-400 mx-auto mb-2 transition-colors" />
                <h5 className="text-white font-medium text-sm mb-1">Security</h5>
                <p className="text-zinc-500 text-xs mb-3">Practice safe habits</p>
                <Button 
                  onClick={() => setLocation('/simulators')}
                  size="sm"
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-600 text-xs py-1.5"
                >
                  Train
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/80 border border-zinc-700/40 hover:border-orange-500/30 transition-colors group">
              <CardContent className="p-4 text-center">
                <TrendingDown className="w-5 h-5 text-zinc-400 group-hover:text-orange-400 mx-auto mb-2 transition-colors" />
                <h5 className="text-white font-medium text-sm mb-1">Why Bitcoin</h5>
                <p className="text-zinc-500 text-xs mb-3">Inflation impact</p>
                <Button 
                  onClick={() => setLocation('/money')}
                  size="sm"
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-600 text-xs py-1.5"
                >
                  Explore
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/80 border border-zinc-700/40 hover:border-zinc-600/50 transition-colors group">
              <CardContent className="p-4 text-center">
                <Users className="w-5 h-5 text-zinc-400 mx-auto mb-2 transition-colors" />
                <h5 className="text-white font-medium text-sm mb-1">Community</h5>
                <p className="text-zinc-500 text-xs mb-3">Connect & learn</p>
                <Button 
                  onClick={() => setLocation('/community')}
                  size="sm"
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-600 text-xs py-1.5"
                >
                  Join
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Bitcoin Learning Wallet */}
          <WalletDisplay />

          {/* Achievement Badge - Compact */}
          {(user?.currentStreak || 0) >= 7 && (
            <Card className="bg-gradient-to-r from-zinc-900/80 to-zinc-800/70 border border-orange-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                      <Award className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                      <h5 className="text-white font-medium">
                        {(user?.currentStreak || 0) >= 30 ? "Bitcoin Expert" :
                         (user?.currentStreak || 0) >= 14 ? "Dedicated Learner" : "Consistent Student"}
                      </h5>
                      <p className="text-zinc-400 text-xs">
                        {(user?.currentStreak || 0) >= 30 ? "Exceptional commitment" :
                         (user?.currentStreak || 0) >= 14 ? "Strong foundation building" : 
                         "Developing consistency"}
                      </p>
                    </div>
                  </div>
                  <span className="text-orange-400 font-semibold">{user?.currentStreak || 0} days</span>
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