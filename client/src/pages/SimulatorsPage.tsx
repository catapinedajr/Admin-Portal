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
      {/* Simulators Preview for Free Users */}
      {!isPremiumTier && (
        <div className="space-y-6">
          <Card className="bg-zinc-900/95 border-orange-500/20">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Premium Simulators
              </h3>
              <p className="text-zinc-400 mb-4">
                Interactive Bitcoin simulations available to premium users. See what you're missing below!
              </p>
              <Button 
                onClick={() => setShowEmailModal(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8"
              >
                Unlock All Simulators - FREE
              </Button>
              <p className="text-xs text-zinc-500 mt-3">
                Free for a limited time
              </p>
            </CardContent>
          </Card>

          {/* Preview Cards showing what simulators are available */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Wallet Safety Preview */}
            <Card className="bg-zinc-900/50 border-zinc-700 opacity-60 relative">
              <div className="absolute top-2 right-2">
                <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded">Premium</div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="w-6 h-6 text-orange-400" />
                  <h4 className="font-semibold text-white">Wallet Safety</h4>
                </div>
                <p className="text-zinc-400 text-sm mb-3">
                  Learn to identify phishing emails, secure seed phrases, and protect your Bitcoin from common scams.
                </p>
                <div className="text-xs text-zinc-500">
                  • 7 Interactive Security Tests<br/>
                  • Real Phishing Examples<br/>
                  • Best Practice Guides
                </div>
              </CardContent>
            </Card>

            {/* Settlement Simulator Preview */}
            <Card className="bg-zinc-900/50 border-zinc-700 opacity-60 relative">
              <div className="absolute top-2 right-2">
                <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded">Premium</div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Clock className="w-6 h-6 text-orange-400" />
                  <h4 className="font-semibold text-white">Settlement Race</h4>
                </div>
                <p className="text-zinc-400 text-sm mb-3">
                  Compare traditional banking delays vs Bitcoin's 24/7 instant settlement.
                </p>
                <div className="text-xs text-zinc-500">
                  • Weekend Banking Delays<br/>
                  • Real Fee Calculations<br/>
                  • Side-by-Side Comparison
                </div>
              </CardContent>
            </Card>

            {/* Inflation Simulator Preview */}
            <Card className="bg-zinc-900/50 border-zinc-700 opacity-60 relative">
              <div className="absolute top-2 right-2">
                <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded">Premium</div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <TrendingDown className="w-6 h-6 text-orange-400" />
                  <h4 className="font-semibold text-white">Inflation Destroyer</h4>
                </div>
                <p className="text-zinc-400 text-sm mb-3">
                  Watch money lose value in real-time with interactive inflation visualization.
                </p>
                <div className="text-xs text-zinc-500">
                  • Real-time Animations<br/>
                  • 50+ Years Historical Data<br/>
                  • Purchasing Power Destruction
                </div>
              </CardContent>
            </Card>

            {/* HODL Simulator Preview */}
            <Card className="bg-zinc-900/50 border-zinc-700 opacity-60 relative">
              <div className="absolute top-2 right-2">
                <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded">Premium</div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <TrendingUp className="w-6 h-6 text-orange-400" />
                  <h4 className="font-semibold text-white">HODL Strategy</h4>
                </div>
                <p className="text-zinc-400 text-sm mb-3">
                  Simulate long-term Bitcoin holding strategies with real historical data.
                </p>
                <div className="text-xs text-zinc-500">
                  • Historical Performance<br/>
                  • Growth Visualization<br/>
                  • Multiple Time Frames
                </div>
              </CardContent>
            </Card>

            {/* DCA Simulator Preview */}
            <Card className="bg-zinc-900/50 border-zinc-700 opacity-60 relative">
              <div className="absolute top-2 right-2">
                <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded">Premium</div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Calendar className="w-6 h-6 text-orange-400" />
                  <h4 className="font-semibold text-white">DCA Calculator</h4>
                </div>
                <p className="text-zinc-400 text-sm mb-3">
                  Calculate dollar-cost averaging returns with customizable schedules.
                </p>
                <div className="text-xs text-zinc-500">
                  • Weekly/Monthly Options<br/>
                  • Real Price History<br/>
                  • Performance Charts
                </div>
              </CardContent>
            </Card>

            {/* Transaction Builder Preview */}
            <Card className="bg-zinc-900/50 border-zinc-700 opacity-60 relative">
              <div className="absolute top-2 right-2">
                <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded">Premium</div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Zap className="w-6 h-6 text-orange-400" />
                  <h4 className="font-semibold text-white">Transaction Builder</h4>
                </div>
                <p className="text-zinc-400 text-sm mb-3">
                  Build and track Bitcoin transactions through the confirmation process.
                </p>
                <div className="text-xs text-zinc-500">
                  • Interactive Building<br/>
                  • Real-time Confirmation<br/>
                  • Educational Journey
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              onClick={() => setShowEmailModal(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8"
            >
              Get Full Access - FREE
            </Button>
          </div>
        </div>
      )}

      {/* Premium Simulators Navigation */}
      {isPremiumTier && (
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            { id: 'wallet', label: 'Wallet' },
            { id: 'safety', label: 'Safety' },
            { id: 'transactions', label: 'Transactions' },
            { id: 'transfer', label: 'Transfer' },
            { id: 'hodl', label: 'HODL' },
            { id: 'dca', label: 'DCA' },
            { id: 'inflation', label: 'Inflation' },
            { id: 'fees', label: 'Fees' }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={simulationsSubTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setSimulationsSubTab(tab.id as any)}
              className={simulationsSubTab === tab.id 
                ? "bg-orange-500 hover:bg-orange-600 text-white" 
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }
            >
              {tab.label}
            </Button>
          ))}
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