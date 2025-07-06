import React, { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Wallet, ArrowLeftRight, Coins, TrendingUp, DollarSign, TrendingDown, FileText } from "lucide-react";

// Lazy load all simulator components for performance
const WalletSimulator = lazy(() => import("@/components/simulators/WalletSimulator"));
const SafetyTraining = lazy(() => import("@/components/simulators/SafetyTrainingSustainable"));
const TransactionsSimulator = lazy(() => import("@/components/simulators/TransactionsSimulator"));
const TransferSimulator = lazy(() => import("@/components/simulators/TransferSimulator").then(module => ({ default: module.TransferSimulator })));
const HODLSimulator = lazy(() => import("@/components/simulators/HODLSimulator"));
const DCASimulator = lazy(() => import("@/components/simulators/DCASimulator").then(module => ({ default: module.DCASimulator })));
const InflationSimulator = lazy(() => import("@/components/simulators/InflationSimulator"));
const FeesSimulator = lazy(() => import("@/components/simulators/FeesSimulator"));

type SimulationsSubTab = "wallet" | "safety" | "transactions" | "transfer" | "hodl" | "dca" | "inflation" | "fees";

interface SimulatorsPageProps {
  simulationsSubTab: SimulationsSubTab;
  setSimulationsSubTab: (tab: SimulationsSubTab) => void;
  isPremiumTier: boolean;
  securityStage: number;
  setSecurityStage: (stage: number) => void;
  securityScore: number;
  setSecurityScore: (score: number) => void;
  userSecurityAnswers: Record<number, boolean>;
  setUserSecurityAnswers: (answers: Record<number, boolean>) => void;
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
            <SafetyTraining />
          </Suspense>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulator Navigation Tabs */}
      <div className="border-b border-zinc-800">
        <div className="flex flex-wrap gap-2 p-4">
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
            Wallets
          </Button>
          
          <Button
            variant={simulationsSubTab === "transactions" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSimulationsSubTab("transactions")}
            className="text-xs px-3 py-1"
          >
            <Coins className="w-3 h-3 mr-1" />
            Transaction
          </Button>
          
          <Button
            variant={simulationsSubTab === "transfer" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSimulationsSubTab("transfer")}
            className="text-xs px-3 py-1"
          >
            <ArrowLeftRight className="w-3 h-3 mr-1" />
            Settlement
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

      {/* Active Simulator Content */}
      <div className="px-4">
        {renderActiveSimulator()}
      </div>
    </div>
  );
}