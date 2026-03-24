import React, { useState } from "react";
import { useLocation } from "wouter";
import MoreSection from "@/components/sections/MoreSection";
import BottomNavigation from "@/components/BottomNavigation";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Crown, Gem, User as UserIcon, Wallet } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { PWAInstallButton } from "@/components/PWAInstallButton";

type MoreSubTab = "store" | "conviction";

export default function MorePage() {
  const [location, setLocation] = useLocation();
  const { isPremiumTier } = useSubscription();
  const [moreSubTab, setMoreSubTab] = useState<MoreSubTab>("store");
  const [showEmailModal, setShowEmailModal] = useState(false);

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
                  <h1 className="text-xl font-bold">HODLearn™</h1>
                  <p className="text-xs text-zinc-400">How-to-Learn BTC</p>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              {/* PWA Install Button */}
              <PWAInstallButton />
              
              {/* Wallet Button */}
              <Button 
                onClick={() => setLocation('/wallet')}
                size="sm"
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5"
                title="Learning Wallet"
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

      <main className="max-w-6xl mx-auto px-4 py-6 pb-24">
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