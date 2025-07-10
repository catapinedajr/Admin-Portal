import React, { useState, lazy, Suspense } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Crown, Gem, User as UserIcon, Lock, Shield, Wallet, ArrowLeftRight, Coins, TrendingUp, DollarSign, TrendingDown, FileText } from "@/lib/icons";
import { Card, CardContent } from "@/components/ui/card";

// Lazy load all simulator components for performance
const WalletSimulator = lazy(() => import("@/components/simulators/WalletSimulator"));
const SafetyTraining = lazy(() => import("@/components/simulators/SafetyTraining"));
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
  
  // Use subscription context for paywall
  const { isPremiumTier, canAccessSimulator, setSubscriptionTier } = useSubscription();
  
  // Use props if provided, otherwise use internal state
  const simulationsSubTab = props.simulationsSubTab ?? internalSimulationsSubTab;
  const setSimulationsSubTab = props.setSimulationsSubTab ?? setInternalSimulationsSubTab;
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
    }
  };

  // Check if current simulator is locked for free users
  const isCurrentSimulatorLocked = !isPremiumTier && !canAccessSimulator(simulationsSubTab);

  return (
    <div className="space-y-6 pb-24">


      {/* Floating Paywall Overlay - Appears over the cards */}
      {isCurrentSimulatorLocked && (
        <div className="fixed top-16 left-0 right-0 bottom-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-zinc-900/95 border-orange-500/30 max-w-lg w-full">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Premium Simulators
              </h3>
              <p className="text-zinc-400 mb-4">
                Unlock all 6 interactive Bitcoin education tools. Perfect your Bitcoin knowledge with hands-on practice.
              </p>
              
              {/* Premium Features List */}
              <div className="text-left mb-6 space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  <span className="text-zinc-300">Wallet Explorer & Recovery Practice</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  <span className="text-zinc-300">Transaction Builder & Fee Optimization</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  <span className="text-zinc-300">HODL vs Traditional Assets Comparison</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  <span className="text-zinc-300">DCA Strategy Backtesting</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  <span className="text-zinc-300">Transfer Speed Race Simulation</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  <span className="text-zinc-300">Safe Practice Environment (No Real Money)</span>
                </div>
              </div>
              <Button 
                onClick={() => setSubscriptionTier('premium')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold w-full"
              >
                Continue Free - Limited Time
              </Button>
              <p className="text-xs text-zinc-500 mt-3">
                Free during beta testing
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Simulator Sub-navigation - Centered like Learn page */}
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

      {/* Active Simulator Content - only if not locked */}
      {!isCurrentSimulatorLocked && (
        <div className="px-4">
          {renderActiveSimulator()}
        </div>
      )}
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
                  <p className="text-xs text-zinc-400">How-to-learn BTC</p>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
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
              
              {/* Premium Status Indicator */}
              {isPremiumTier ? (
                <div className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500 px-2.5 py-1.5 font-medium rounded flex items-center">
                  <Gem className="w-4 h-4" />
                  <span className="sr-only">Premium</span>
                </div>
              ) : (
                <Button 
                  onClick={() => setShowEmailModal(true)}
                  size="sm"
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5"
                  title="Upgrade to Premium"
                >
                  <Crown className="w-4 h-4" />
                  <span className="sr-only">Upgrade</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 pb-24">
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