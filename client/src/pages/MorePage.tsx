import React, { useState } from "react";
import { useLocation } from "wouter";
import MoreSection from "@/components/sections/MoreSection";
import BottomNavigation from "@/components/BottomNavigation";
import PWAInstallButton from "@/components/PWAInstallButton";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Crown, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";

type MoreSubTab = "store" | "conviction";

export default function MorePage() {
  const [location, setLocation] = useLocation();
  const { isPremiumTier } = useSubscription();
  const [moreSubTab, setMoreSubTab] = useState<MoreSubTab>("store");
  const [showEmailModal, setShowEmailModal] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">₿</span>
            </div>
            <h1 className="text-xl font-bold text-white">HODLearn</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <PWAInstallButton />
            
            {isPremiumTier ? (
              <div className="flex items-center space-x-1 text-orange-400 text-sm font-medium">
                <Crown className="w-4 h-4" />
                <span className="hidden sm:inline">Premium</span>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEmailModal(true)}
                className="text-orange-400 hover:text-orange-300 text-sm"
              >
                <Gem className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Upgrade</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <MoreSection 
          moreSubTab={moreSubTab}
          setMoreSubTab={setMoreSubTab}
        />
      </main>

      <BottomNavigation 
        activeSection="more"
        onSectionChange={(section) => {
          if (section === 'home') setLocation('/');
          else if (section === 'learn') setLocation('/learn');
          else if (section === 'money') setLocation('/money');
          else if (section === 'simulators') setLocation('/simulators');
        }}
      />
    </div>
  );
}