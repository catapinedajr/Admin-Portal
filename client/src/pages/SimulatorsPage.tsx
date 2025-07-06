import React, { useState, lazy, Suspense } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import PWAInstallButton from "@/components/PWAInstallButton";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Crown, Gem } from "lucide-react";
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
  simulationsSubTab?: SimulationsSubTab;
  setSimulationsSubTab?: (tab: SimulationsSubTab) => void;
  isPremiumTier?: boolean;
  securityStage?: number;
  setSecurityStage?: (stage: number) => void;
  securityScore?: number;
  setSecurityScore?: (score: number) => void;
  userSecurityAnswers?: Record<number, boolean>;
  setUserSecurityAnswers?: (answers: Record<number, boolean>) => void;
}

function SimulatorsPage(props: SimulatorsPageProps = {}) {
  // Create internal state when props aren't provided (standalone mode)
  const [internalSimulationsSubTab, setInternalSimulationsSubTab] = useState<SimulationsSubTab>("safety");
  const [internalSecurityStage, setInternalSecurityStage] = useState(1);
  const [internalSecurityScore, setInternalSecurityScore] = useState(0);
  const [internalUserSecurityAnswers, setInternalUserSecurityAnswers] = useState<Record<number, boolean>>({});
  
  // Use props if provided, otherwise use internal state
  const simulationsSubTab = props.simulationsSubTab ?? internalSimulationsSubTab;
  const setSimulationsSubTab = props.setSimulationsSubTab ?? setInternalSimulationsSubTab;
  const isPremiumTier = props.isPremiumTier ?? true; // Default to premium for standalone
  const securityStage = props.securityStage ?? internalSecurityStage;
  const setSecurityStage = props.setSecurityStage ?? setInternalSecurityStage;
  const securityScore = props.securityScore ?? internalSecurityScore;
  const setSecurityScore = props.setSecurityScore ?? setInternalSecurityScore;
  const userSecurityAnswers = props.userSecurityAnswers ?? internalUserSecurityAnswers;
  const setUserSecurityAnswers = props.setUserSecurityAnswers ?? setInternalUserSecurityAnswers;

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

function SimulatorsPageWithLayout() {
  const [location, setLocation] = useLocation();
  const { isPremiumTier } = useSubscription();
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
        <SimulatorsPage />
      </main>

      <BottomNavigation 
        activeSection="simulators"
        onSectionChange={(section) => {
          if (section === 'home') setLocation('/');
          else if (section === 'learn') setLocation('/learn');
          else if (section === 'money') setLocation('/money');
          else if (section === 'more') setLocation('/more');
        }}
      />
    </div>
  );
}

export default SimulatorsPageWithLayout;