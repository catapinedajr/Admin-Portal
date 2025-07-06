import React, { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Wallet, ArrowLeftRight, CreditCard, TrendingUp, DollarSign, TrendingDown, FileText } from "lucide-react";

// Direct imports to avoid HMR issues
import WalletSimulator from "@/components/simulators/WalletSimulator";
import SafetyTraining from "@/components/simulators/SafetyTrainingSustainable";
import TransactionsSimulator from "@/components/simulators/TransactionsSimulator";
import { TransferSimulator } from "@/components/simulators/TransferSimulator";
import HODLSimulator from "@/components/simulators/HODLSimulator";
import { DCASimulator } from "@/components/simulators/DCASimulator";
import InflationSimulator from "@/components/simulators/InflationSimulator";
import FeesSimulator from "@/components/simulators/FeesSimulator";

type SimulationsSubTab = "wallet" | "safety" | "transactions" | "transfer" | "hodl" | "dca" | "inflation" | "fees";

interface SimulatorsPageProps {
  simulationsSubTab: SimulationsSubTab;
  setSimulationsSubTab: (tab: SimulationsSubTab) => void;
  isPremiumTier: boolean;
  securityStage: number;
  setSecurityStage: (stage: number) => void;
  securityScore: number;
  setSecurityScore: (score: number) => void;
  userSecurityAnswers: any[];
  setUserSecurityAnswers: (answers: any[]) => void;
}

export default function SimulatorsPage({
  simulationsSubTab,
  setSimulationsSubTab,
  isPremiumTier,
  securityStage,
  setSecurityStage,
  securityScore,
  setSecurityScore,
  userSecurityAnswers,
  setUserSecurityAnswers
}: SimulatorsPageProps) {

  // Loading component for lazy loaded simulators
  const SimulatorLoading = () => (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-orange-500 text-lg font-medium">Loading simulator...</div>
    </div>
  );

  const renderActiveSimulator = () => {
    switch (simulationsSubTab) {
      case "wallet":
        return (
          <Suspense fallback={<SimulatorLoading />}>
            <WalletSimulator />
          </Suspense>
        );
      case "safety":
        return (
          <Suspense fallback={<SimulatorLoading />}>
            <SafetyTraining 
              securityStage={securityStage}
              setSecurityStage={setSecurityStage}
              securityScore={securityScore}
              setSecurityScore={setSecurityScore}
              userSecurityAnswers={userSecurityAnswers}
              setUserSecurityAnswers={setUserSecurityAnswers}
              onCompletion={() => {
                // Simple completion acknowledgment
                alert("🎉 Safety Training Complete!\n\nYou've demonstrated strong Bitcoin security knowledge. These skills will help protect your Bitcoin in the real world.");
              }}
            />
          </Suspense>
        );
      case "transactions":
        return (
          <Suspense fallback={<SimulatorLoading />}>
            <TransactionsSimulator isPremiumTier={isPremiumTier} />
          </Suspense>
        );
      case "transfer":
        return (
          <Suspense fallback={<SimulatorLoading />}>
            <TransferSimulator />
          </Suspense>
        );
      case "hodl":
        return (
          <Suspense fallback={<SimulatorLoading />}>
            <HODLSimulator />
          </Suspense>
        );
      case "dca":
        return (
          <Suspense fallback={<SimulatorLoading />}>
            <DCASimulator />
          </Suspense>
        );
      case "inflation":
        return (
          <Suspense fallback={<SimulatorLoading />}>
            <InflationSimulator />
          </Suspense>
        );
      case "fees":
        return (
          <Suspense fallback={<SimulatorLoading />}>
            <FeesSimulator />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<SimulatorLoading />}>
            <SafetyTraining 
              securityStage={securityStage}
              setSecurityStage={setSecurityStage}
              securityScore={securityScore}
              setSecurityScore={setSecurityScore}
              userSecurityAnswers={userSecurityAnswers}
              setUserSecurityAnswers={setUserSecurityAnswers}
              onCompletion={() => {
                alert("🎉 Safety Training Complete!\n\nYou've demonstrated strong Bitcoin security knowledge. These skills will help protect your Bitcoin in the real world.");
              }}
            />
          </Suspense>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Practice Sub-navigation */}
      {true && (
        <div className="flex justify-center">
          <div className="flex flex-wrap justify-center gap-2 bg-zinc-800/50 rounded-lg p-2">
          <Button
            variant={simulationsSubTab === "safety" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSimulationsSubTab("safety")}
            className="text-xs px-3 py-1"
          >
            <Shield className="w-3 h-3 mr-1" />
            Safety
          </Button>
          <Button
            variant={simulationsSubTab === "wallet" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSimulationsSubTab("wallet")}
            className="text-xs px-3 py-1"
          >
            <Wallet className="w-3 h-3 mr-1" />
            Wallet
          </Button>
          <Button
            variant={simulationsSubTab === "transactions" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSimulationsSubTab("transactions")}
            className="text-xs px-3 py-1"
          >
            <CreditCard className="w-3 h-3 mr-1" />
            Transaction
          </Button>
          <Button
            variant={simulationsSubTab === "transfer" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSimulationsSubTab("transfer")}
            className="text-xs px-3 py-1"
          >
            <ArrowLeftRight className="w-3 h-3 mr-1" />
            Transfer
          </Button>
          <Button
            variant={simulationsSubTab === "hodl" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSimulationsSubTab("hodl")}
            className="text-xs px-3 py-1"
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            HODL
          </Button>
          <Button
            variant={simulationsSubTab === "dca" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSimulationsSubTab("dca")}
            className="text-xs px-3 py-1"
          >
            <DollarSign className="w-3 h-3 mr-1" />
            DCA
          </Button>
          <Button
            variant={simulationsSubTab === "inflation" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSimulationsSubTab("inflation")}
            className="text-xs px-3 py-1"
          >
            <TrendingDown className="w-3 h-3 mr-1" />
            Inflation
          </Button>
          <Button
            variant={simulationsSubTab === "fees" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSimulationsSubTab("fees")}
            className="text-xs px-3 py-1"
          >
            <FileText className="w-3 h-3 mr-1" />
            Fees
          </Button>
        </div>
      </div>
      )}

      {/* Active Simulator Content */}
      {renderActiveSimulator()}
    </div>
  );
}