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

    </div>
  );
}
