import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { useAppContext } from "@/components/shared/AppContextProvider";
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
    setShowEmailModal
  } = useAppContext();

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
        <TransactionsSimulator />
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
    </div>
  );
}