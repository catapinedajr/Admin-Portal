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
      {/* Simulator Navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setSimulationsSubTab("wallet")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            simulationsSubTab === "wallet"
              ? "bg-orange-500 text-white"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          Wallet Safety
        </button>
        <button
          onClick={() => setSimulationsSubTab("transactions")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            simulationsSubTab === "transactions"
              ? "bg-orange-500 text-white"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          Transaction Builder
        </button>
        <button
          onClick={() => setSimulationsSubTab("hodl")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            simulationsSubTab === "hodl"
              ? "bg-orange-500 text-white"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          HODL Strategy
        </button>
        <button
          onClick={() => setSimulationsSubTab("dca")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            simulationsSubTab === "dca"
              ? "bg-orange-500 text-white"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          DCA Calculator
        </button>
        <button
          onClick={() => setSimulationsSubTab("fees")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            simulationsSubTab === "fees"
              ? "bg-orange-500 text-white"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          Fee Simulator
        </button>
      </div>

      {/* Wallet Simulator */}
      {simulationsSubTab === "wallet" && <WalletSimulator />}

      {/* Safety Training */}
      {simulationsSubTab === "safety" && <SafetyTrainingSustainable />}

      {/* Transactions Simulator */}
      {simulationsSubTab === "transactions" && <TransactionsSimulator isPremiumTier={true} />}

      {/* Transfer Speed Simulator */}
      {simulationsSubTab === "transfer" && <TransferSimulator />}

      {/* HODL Simulator */}
      {simulationsSubTab === "hodl" && <HODLSimulator />}

      {/* DCA Simulator */}
      {simulationsSubTab === "dca" && <DCASimulator />}

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
