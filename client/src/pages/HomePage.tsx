import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import HomeSection from "@/components/sections/HomeSection";
import BottomNavigation from "@/components/BottomNavigation";
import { useSubscription } from "@/contexts/SubscriptionContext";
import PWAInstallButton from "@/components/PWAInstallButton";
import { Crown, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
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
              {/* PWA Install Button */}
              <PWAInstallButton />
              
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
          {/* Welcome Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-white">
              Welcome to HODLearn!
            </h1>
            <p className="text-zinc-400 text-lg">
              Understanding Bitcoin takes time, Building conviction takes consistency
            </p>
          </div>

          {/* Quick Navigation Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => setLocation('/learn')}
              className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg p-6 cursor-pointer transition-colors"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">📚</div>
                <h3 className="font-semibold text-white">Learn Today</h3>
                <p className="text-sm text-zinc-400">Start your Bitcoin journey</p>
              </div>
            </div>
            
            <div 
              onClick={() => setLocation('/money')}
              className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg p-6 cursor-pointer transition-colors"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">💰</div>
                <h3 className="font-semibold text-white">Money & Finance</h3>
                <p className="text-sm text-zinc-400">Understand traditional finance</p>
              </div>
            </div>
            
            <div 
              onClick={() => setLocation('/simulators')}
              className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg p-6 cursor-pointer transition-colors"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🎮</div>
                <h3 className="font-semibold text-white">Simulators</h3>
                <p className="text-sm text-zinc-400">Interactive Bitcoin tools</p>
              </div>
            </div>
            
            <div 
              onClick={() => setLocation('/more')}
              className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg p-6 cursor-pointer transition-colors"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🔗</div>
                <h3 className="font-semibold text-white">More</h3>
                <p className="text-sm text-zinc-400">Resources and tools</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation 
        activeSection="home"
        onSectionChange={(section) => {
          if (section === 'learn') setLocation('/learn');
          else if (section === 'money') setLocation('/money');
          else if (section === 'simulators') setLocation('/simulators');
          else if (section === 'more') setLocation('/more');
        }}
      />
    </div>
  );
}