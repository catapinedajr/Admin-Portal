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
      <header className="border-b border-zinc-800 bg-black/50 backdrop-blur-lg sticky top-0 z-50">
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

          {/* Main Learning Card */}
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-zinc-400">Day {currentDayIndex}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {dayMetadata?.title || 'Loading today\'s lesson...'}
                  </h3>
                  <p className="text-zinc-400 text-sm mb-4">
                    Today's Bitcoin learning journey continues
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => setLocation('/learn')}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                Continue Learning
              </Button>
            </CardContent>
          </Card>

          {/* Community Activity Teaser */}
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium text-white">Community Activity</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-orange-400">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></div>
                  Live
                </div>
              </div>
              
              <div className="space-y-3">
                {/* Latest Discussion */}
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-3.5 h-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-300 truncate">
                      "Just started my Bitcoin journey - any tips for beginners?"
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-zinc-500">Posted 12 min ago</span>
                      <span className="text-xs text-orange-400">5 replies</span>
                    </div>
                  </div>
                </div>

                {/* Community Stats */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-700">
                  <div className="flex items-center gap-4 text-xs text-zinc-400">
                    <span>24 active discussions</span>
                    <span>156 videos watched this week</span>
                  </div>
                  <Button 
                    onClick={() => setLocation('/community')}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1"
                  >
                    Join
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons - Updated with Community */}
          <div className="grid grid-cols-3 gap-3">
            <Button 
              onClick={() => setLocation('/simulators')}
              className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 py-3 flex flex-col items-center gap-1"
            >
              <Gamepad2 className="w-4 h-4" />
              <span className="text-xs">Simulators</span>
            </Button>
            <Button 
              onClick={() => setLocation('/community')}
              className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 py-3 flex flex-col items-center gap-1"
            >
              <Users className="w-4 h-4" />
              <span className="text-xs">Community</span>
            </Button>
            <Button 
              onClick={() => setLocation('/more')}
              className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 py-3 flex flex-col items-center gap-1"
            >
              <MoreHorizontal className="w-4 h-4" />
              <span className="text-xs">More</span>
            </Button>
          </div>
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