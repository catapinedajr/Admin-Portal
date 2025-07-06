import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Shield, Clock, TrendingDown, TrendingUp, Wallet, Globe, Calendar, Gamepad2, Zap } from "lucide-react";
import { useAppContext } from "@/components/shared/AppContextProvider";
import EmailCollectionModal from "@/components/EmailCollectionModal";
import { useState } from "react";
import WalletSimulator from "@/components/simulators/WalletSimulator";
import SafetyTrainingSustainable from "@/components/simulators/SafetyTrainingSustainable";
import TransactionsSimulator from "@/components/simulators/TransactionsSimulator";
import { TransferSimulator } from "@/components/simulators/TransferSimulator";
import HODLSimulator from "@/components/simulators/HODLSimulator";
import { DCASimulator } from "@/components/simulators/DCASimulator";
import InflationSimulator from "@/components/simulators/InflationSimulator";
import FeesSimulator from "@/components/simulators/FeesSimulator";

export default function SimulatorsPage() {
  const { 
    simulationsSubTab, 
    setSimulationsSubTab,
    isPremiumTier,
  } = useAppContext();
  
  const [showEmailModal, setShowEmailModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Centered Paywall for Free Users */}
      {!isPremiumTier && (
        <div className="min-h-screen flex items-center justify-center p-4 -mt-6">
          <div className="bg-zinc-900/95 border border-orange-500/20 rounded-2xl max-w-2xl w-full">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calculator className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                Unlock Premium Simulators
              </h2>
              
              <p className="text-xl text-zinc-300 mb-8">
                Get hands-on Bitcoin education with interactive simulations
              </p>
              
              {/* Key Benefits */}
              <div className="grid md:grid-cols-2 gap-4 mb-8 text-left">
                <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Shield className="w-5 h-5 text-orange-400 mr-2" />
                    <h4 className="text-white font-semibold">Security Training</h4>
                  </div>
                  <p className="text-zinc-400 text-sm">Learn to spot scams and protect your Bitcoin with real phishing examples</p>
                </div>
                
                <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="w-5 h-5 text-orange-400 mr-2" />
                    <h4 className="text-white font-semibold">Strategy Backtesting</h4>
                  </div>
                  <p className="text-zinc-400 text-sm">Test HODL vs DCA strategies with real historical Bitcoin data</p>
                </div>
                
                <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Clock className="w-5 h-5 text-orange-400 mr-2" />
                    <h4 className="text-white font-semibold">Settlement Racing</h4>
                  </div>
                  <p className="text-zinc-400 text-sm">Compare Bitcoin vs traditional banking speeds side-by-side</p>
                </div>
                
                <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Zap className="w-5 h-5 text-orange-400 mr-2" />
                    <h4 className="text-white font-semibold">Transaction Building</h4>
                  </div>
                  <p className="text-zinc-400 text-sm">Build and track Bitcoin transactions through network confirmation</p>
                </div>
              </div>
              
              {/* What You Get */}
              <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-white mb-4">What You Get (FREE During Beta)</h3>
                <div className="text-left space-y-2 text-zinc-300">
                  <div className="flex items-center">
                    <span className="text-orange-400 mr-2">✓</span>
                    <span>6 Interactive Bitcoin Simulators</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-orange-400 mr-2">✓</span>
                    <span>Real-time Market Data Integration</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-orange-400 mr-2">✓</span>
                    <span>Historical Performance Backtesting</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-orange-400 mr-2">✓</span>
                    <span>Security Best Practices Training</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-orange-400 mr-2">✓</span>
                    <span>Educational Visual Guides</span>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => setShowEmailModal(true)}
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 text-lg font-semibold rounded-xl mb-4"
              >
                Get Full Access - FREE
              </Button>
              
              <p className="text-sm text-zinc-500">
                Free during beta • No credit card required • Instant access
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Simulator */}
      {isPremiumTier && simulationsSubTab === "wallet" && (
        <WalletSimulator />
      )}

      {/* Safety Training */}
      {isPremiumTier && simulationsSubTab === "safety" && (
        <SafetyTrainingSustainable />
      )}

      {/* Transactions Simulator */}
      {isPremiumTier && simulationsSubTab === "transactions" && (
        <TransactionsSimulator isPremiumTier={isPremiumTier} />
      )}

      {/* Transfer Speed Simulator */}
      {isPremiumTier && simulationsSubTab === "transfer" && (
        <TransferSimulator />
      )}

      {/* HODL Simulator */}
      {isPremiumTier && simulationsSubTab === "hodl" && (
        <HODLSimulator />
      )}

      {/* DCA Simulator */}
      {isPremiumTier && simulationsSubTab === "dca" && (
        <DCASimulator />
      )}

      {/* Inflation Simulator */}
      {isPremiumTier && simulationsSubTab === "inflation" && (
        <InflationSimulator />
      )}

      {/* Banking Fees vs Bitcoin Fees Simulator */}
      {isPremiumTier && simulationsSubTab === "fees" && (
        <FeesSimulator />
      )}

      {/* Email Collection Modal */}
      <EmailCollectionModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        trigger="feature"
        lockedFeature="Premium Simulators"
      />
    </div>
  );
}
