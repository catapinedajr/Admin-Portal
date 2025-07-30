import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import BottomNavigation from "@/components/BottomNavigation";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Crown, Gem, Gamepad2, MoreHorizontal, User as UserIcon, Users, MessageSquare, TrendingUp, ArrowRight, Shield, TrendingDown, Award, Coins, Wallet } from "@/lib/icons";
import BitcoinPriceDisplay from "@/components/BitcoinPriceDisplay";
import WalletDisplay from "@/components/WalletDisplay";
import WalletSummaryCard from "@/components/WalletSummaryCard";
import HomeSection from "@/components/sections/HomeSection";
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
                  <h1 className="text-xl font-bold">HODLearn™</h1>
                  <p className="text-xs text-zinc-400">How-to-learn BTC</p>
                </div>
              </div>
            </div>

            {/* Centered Bitcoin Price Display */}
            <div className="hidden md:flex justify-center flex-1">
              <BitcoinPriceDisplay />
            </div>

            {/* Right spacer to balance layout */}
            <div className="hidden md:block w-[200px]"></div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              {/* Wallet Button */}
              <Button 
                onClick={() => setLocation('/wallet')}
                size="sm"
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5"
                title="Bitcoin Learning Wallet"
              >
                <Wallet className="w-4 h-4" />
                <span className="sr-only">Wallet</span>
              </Button>

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
        <div className="space-y-4">

          {/* Bitcoin Learning Wallet Summary */}
          <WalletSummaryCard />

          {/* Home Learning Cards */}
          <HomeSection 
            user={user}
            currentDayIndex={currentDayIndex}
            dayMetadata={dayMetadata}
            dailyFacts={dailyFacts}
            setActiveSection={setActiveSection}
          />

          {/* Quick Actions Grid - Streamlined with Streak Achievement Style */}
          <div className="grid grid-cols-3 gap-3">
            <Card 
              className="bg-zinc-900/50 border border-zinc-700/50 hover:bg-zinc-800/50 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10 hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
              onClick={() => setLocation('/simulators')}
            >
              <CardContent className="p-4 text-center">
                <div className="p-2 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-xl border border-orange-500/20 group-hover:scale-110 transition-transform duration-300 w-fit mx-auto mb-3">
                  <Shield className="w-5 h-5 text-orange-500 group-hover:animate-pulse" />
                </div>
                <h5 className="text-white font-medium text-sm mb-1">Security</h5>
                <p className="text-zinc-500 text-xs mb-3">Practice safe habits</p>
                <div className="text-orange-400 text-xs font-medium group-hover:text-orange-300 transition-colors">
                  Train Now →
                </div>
              </CardContent>
            </Card>

            <Card 
              className="bg-zinc-900/50 border border-zinc-700/50 hover:bg-zinc-800/50 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10 hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
              onClick={() => setLocation('/money')}
            >
              <CardContent className="p-4 text-center">
                <div className="p-2 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-xl border border-orange-500/20 group-hover:scale-110 transition-transform duration-300 w-fit mx-auto mb-3">
                  <TrendingDown className="w-5 h-5 text-orange-500 group-hover:animate-pulse" />
                </div>
                <h5 className="text-white font-medium text-sm mb-1">Why Bitcoin</h5>
                <p className="text-zinc-500 text-xs mb-3">Inflation impact</p>
                <div className="text-orange-400 text-xs font-medium group-hover:text-orange-300 transition-colors">
                  Explore →
                </div>
              </CardContent>
            </Card>

            <Card 
              className="bg-zinc-900/50 border border-zinc-700/50 hover:bg-zinc-800/50 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10 hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
              onClick={() => setLocation('/community')}
            >
              <CardContent className="p-4 text-center">
                <div className="p-2 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-xl border border-orange-500/20 group-hover:scale-110 transition-transform duration-300 w-fit mx-auto mb-3">
                  <Users className="w-5 h-5 text-orange-500 group-hover:animate-pulse" />
                </div>
                <h5 className="text-white font-medium text-sm mb-1">Community</h5>
                <p className="text-zinc-500 text-xs mb-3">Connect & learn</p>
                <div className="text-orange-400 text-xs font-medium group-hover:text-orange-300 transition-colors">
                  Join →
                </div>
              </CardContent>
            </Card>
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