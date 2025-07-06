import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/contexts/SubscriptionContext";

// Types for the application
type MainSection = "home" | "learn" | "money" | "simulations" | "more";
type LearnSubTab = "today" | "reference";
type SimulationsSubTab = "wallet" | "safety" | "transactions" | "transfer" | "hodl" | "dca" | "inflation" | "fees";
type MoreSubTab = "store" | "about";

// Context interface containing all shared state and functions
interface AppContextType {
  // Navigation state
  activeSection: MainSection;
  setActiveSection: (section: MainSection) => void;
  learnSubTab: LearnSubTab;
  setLearnSubTab: (tab: LearnSubTab) => void;
  simulationsSubTab: SimulationsSubTab;
  setSimulationsSubTab: (tab: SimulationsSubTab) => void;
  moreSubTab: MoreSubTab;
  setMoreSubTab: (tab: MoreSubTab) => void;
  
  // Modal state
  showEmailModal: boolean;
  setShowEmailModal: (show: boolean) => void;
  
  // Day navigation and testing
  testDayOverride: number | null;
  setTestDayOverride: (day: number | null) => void;
  currentDayIndex: number;
  
  // Day access queries and data
  dayAccessible: boolean;
  isDayLockedBySubscription: boolean;
  dayAccessInfo: any;
  dayCompleted: boolean;
  nextAvailableDay: number;
  
  // Quiz completion handler
  handleQuizCompletion: () => void;
  
  // Security test state
  securityTestStage: number;
  setSecurityTestStage: (stage: number) => void;
  securityScore: number;
  setSecurityScore: (score: number) => void;
  selectedSecurityAnswer: number | null;
  setSelectedSecurityAnswer: (answer: number | null) => void;
  showSecurityFeedback: boolean;
  setShowSecurityFeedback: (show: boolean) => void;
  isSecurityAnswerCorrect: boolean;
  setIsSecurityAnswerCorrect: (correct: boolean) => void;
  securityAnswerSubmitted: boolean;
  setSecurityAnswerSubmitted: (submitted: boolean) => void;
  handleSecurityAnswer: (selectedIndex: number) => void;
  getSecurityExplanation: (stage: number, isCorrect: boolean) => string;
  
  // Finance/inflation state
  inflationAmount: number;
  setInflationAmount: (amount: number) => void;
  inflationRate: number;
  setInflationRate: (rate: number) => void;
  inflationTimeFrame: number;
  setInflationTimeFrame: (timeFrame: number) => void;
  moneySupplyYear: number;
  setMoneySupplyYear: (year: number) => void;
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
  animationStep: number;
  setAnimationStep: (step: number) => void;
  
  // Finance animations
  inflationSimActive: boolean;
  setInflationSimActive: (active: boolean) => void;
  inflationProgress: number;
  setInflationProgress: (progress: number) => void;
  speedRaceActive: boolean;
  setSpeedRaceActive: (active: boolean) => void;
  animationActive: boolean;
  setAnimationActive: (active: boolean) => void;
  settlementProgress: { traditional: number; bitcoin: number };
  setSettlementProgress: (progress: { traditional: number; bitcoin: number }) => void;
  
  // Other state
  expandedTopics: Set<string>;
  setExpandedTopics: (topics: Set<string>) => void;
  safetyQuizScore: number;
  setSafetyQuizScore: (score: number) => void;
  convictionSubTab: "whitepaper" | "books" | "videos";
  setConvictionSubTab: (tab: "whitepaper" | "books" | "videos") => void;
  showSplash: boolean;
  setShowSplash: (show: boolean) => void;
  
  // Utilities
  toast: any;
  queryClient: any;
  isPremiumTier: boolean;
  setSubscriptionTier: (tier: any) => void;
  location: string;
  setLocation: (location: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isPremiumTier, setSubscriptionTier } = useSubscription();
  const [location, setLocation] = useLocation();
  
  // Navigation state
  const getActiveSectionFromPath = (path: string): MainSection => {
    if (path === '/' || path === '') return 'home';
    if (path.includes('/learn')) return 'learn';
    if (path.includes('/money')) return 'money';
    if (path.includes('/simulators')) return 'simulations';
    if (path.includes('/more')) return 'more';
    return 'home';
  };
  
  const getSimulatorSubTabFromPath = (path: string): SimulationsSubTab => {
    if (path.includes('/simulators/dca')) return 'dca';
    if (path.includes('/simulators/hodl')) return 'hodl';
    if (path.includes('/simulators/safety')) return 'safety';
    if (path.includes('/simulators/wallet')) return 'wallet';
    if (path.includes('/simulators/transactions')) return 'transactions';
    if (path.includes('/simulators/transfer')) return 'transfer';
    if (path.includes('/simulators/inflation')) return 'inflation';
    if (path.includes('/simulators/fees')) return 'fees';
    return 'safety';
  };
  
  const [activeSection, setActiveSection] = useState<MainSection>(getActiveSectionFromPath(location));
  const [learnSubTab, setLearnSubTab] = useState<LearnSubTab>("today");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [simulationsSubTab, setSimulationsSubTab] = useState<SimulationsSubTab>(getSimulatorSubTabFromPath(location));
  const [moreSubTab, setMoreSubTab] = useState<MoreSubTab>("about");
  
  // Update active section and sub-tabs when URL changes
  useEffect(() => {
    setActiveSection(getActiveSectionFromPath(location));
    if (location.includes('/simulators')) {
      setSimulationsSubTab(getSimulatorSubTabFromPath(location));
    }
  }, [location]);
  
  // Day navigation for development testing
  const [testDayOverride, setTestDayOverride] = useState<number | null>(null);
  
  // Get current day from API
  const { data: nextDayData } = useQuery({
    queryKey: ['/api/next-available-day', 1],
    queryFn: () => fetch('/api/next-available-day/1').then(res => res.json())
  });
  
  const currentDayIndex = testDayOverride || nextDayData?.dayIndex || 1;
  
  // Day access control queries - only load when needed for learn section
  const { data: dayAccessible = false } = useQuery({
    queryKey: ['/api/day-access', 1, currentDayIndex],
    queryFn: () => fetch(`/api/day-access/1/${currentDayIndex}`).then(res => res.json()),
    enabled: activeSection === "learn" || activeSection === "home"
  });

  const isDayLockedBySubscription = currentDayIndex > 7 && !isPremiumTier;
  
  const { data: dayAccessInfo } = useQuery({
    queryKey: ['/api/day-access-info', 1, currentDayIndex],
    queryFn: () => fetch(`/api/day-access-info/1/${currentDayIndex}`).then(res => res.json()),
    refetchInterval: isDayLockedBySubscription ? false : 60000,
    enabled: activeSection === "learn" || activeSection === "home"
  });
  
  const { data: dayCompleted = false } = useQuery({
    queryKey: ['/api/day-completed', 1, currentDayIndex],
    queryFn: () => fetch(`/api/day-completed/1/${currentDayIndex}`).then(res => res.json()),
    enabled: activeSection === "learn" || activeSection === "home"
  });
  
  const nextAvailableDay = nextDayData?.dayIndex ?? 1;

  // Mark day as completed mutation
  const markDayCompletedMutation = useMutation({
    mutationFn: (dayIndex: number) => 
      fetch('/api/mark-day-completed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1, dayIndex })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/day-access'] });
      queryClient.invalidateQueries({ queryKey: ['/api/day-completed'] });
      queryClient.invalidateQueries({ queryKey: ['/api/next-available-day'] });
      toast({
        title: "Day Complete!",
        description: "Great progress! Come back tomorrow for the next lesson.",
        duration: 2500,
      });
    }
  });

  const handleQuizCompletion = useCallback(() => {
    markDayCompletedMutation.mutate(currentDayIndex);
  }, [markDayCompletedMutation, currentDayIndex]);

  // Finance/inflation state
  const [inflationAmount, setInflationAmount] = useState<number>(10000);
  const [inflationRate, setInflationRate] = useState<number>(2);
  const [inflationTimeFrame, setInflationTimeFrame] = useState<number>(10);
  const [moneySupplyYear, setMoneySupplyYear] = useState<number>(2025);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [animationStep, setAnimationStep] = useState<number>(0);
  
  // Finance animations
  const [inflationSimActive, setInflationSimActive] = useState<boolean>(false);
  const [inflationProgress, setInflationProgress] = useState<number>(0);
  const [speedRaceActive, setSpeedRaceActive] = useState<boolean>(false);
  const [animationActive, setAnimationActive] = useState<boolean>(false);
  const [settlementProgress, setSettlementProgress] = useState<{ traditional: number; bitcoin: number }>({ traditional: 0, bitcoin: 0 });
  
  // Other state
  const [convictionSubTab, setConvictionSubTab] = useState<"whitepaper" | "books" | "videos">("whitepaper");
  const [showSplash, setShowSplash] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [safetyQuizScore, setSafetyQuizScore] = useState<number>(0);
  
  // Security Test State
  const [securityTestStage, setSecurityTestStage] = useState<number>(0);
  const [securityScore, setSecurityScore] = useState<number>(0);
  const [selectedSecurityAnswer, setSelectedSecurityAnswer] = useState<number | null>(null);
  const [showSecurityFeedback, setShowSecurityFeedback] = useState<boolean>(false);
  const [isSecurityAnswerCorrect, setIsSecurityAnswerCorrect] = useState<boolean>(false);
  const [securityAnswerSubmitted, setSecurityAnswerSubmitted] = useState<boolean>(false);
  
  // Security Test Handler Functions
  const handleSecurityAnswer = (selectedIndex: number) => {
    if (securityAnswerSubmitted) return;
    
    setSelectedSecurityAnswer(selectedIndex);
    
    const correctAnswers: { [key: number]: number } = {
      1: 2, 2: 1, 3: 1, 4: 2, 5: 0, 6: 1, 7: 1, 8: 1, 
      9: 3, 10: 2, 11: 2, 12: 2, 13: 2, 14: 1, 15: 2, 16: 2
    };
    
    const correctIndex = correctAnswers[securityTestStage] || 0;
    const isCorrect = selectedIndex === correctIndex;
    
    setIsSecurityAnswerCorrect(isCorrect);
    setShowSecurityFeedback(true);
    setSecurityAnswerSubmitted(true);
    
    if (isCorrect) {
      setSecurityScore(securityScore + 1);
    }
  };

  const getSecurityExplanation = (stage: number, isCorrect: boolean): string => {
    const explanations = {
      1: isCorrect 
        ? "Smart move! You recognized the scam. Bitcoin has no central authority or customer support - anyone claiming to represent 'Bitcoin' is lying. Your 0.5 BTC stays safe."
        : "Oh no! That email was a phishing attempt. The domain, urgency tactics, and fake Bitcoin support claims are classic scammer tricks. Your Bitcoin could have been stolen.",
      2: isCorrect
        ? "Excellent choice! Your paper backup in a fireproof safe protects your 2.5 BTC from hackers, device failures, and fires. You're prepared for any scenario."
        : "Risky decision! Digital storage can be hacked, corrupted, or accessed by others. Your 2.5 BTC could disappear if those files are compromised or lost.",
      3: isCorrect
        ? "Smart choice! You spotted the critical difference: your partner sent '0wlh' (with lowercase L) but your wallet shows '0w1h' (with number 1). Address poisoning attacks change just one character to steal funds. Your $60,000 stays safe."
        : "Disaster! You missed the subtle but critical difference: partner's address ends in '0wlh' (lowercase L) but wallet shows '0w1h' (number 1). This address substitution attack would have sent $60,000 to a scammer forever.",
      4: isCorrect
        ? "Perfect! You hung up on a scammer. Bitcoin has no customer support because it's decentralized. Your 1.2 BTC remains secure because you recognized the social engineering attempt."
        : "Danger! That was a social engineering scam. Bitcoin has no customer support team. Anyone asking for your seed phrase is trying to steal your 1.2 BTC.",
      5: isCorrect
        ? "Correct! Hardware wallets provide the best security for long-term storage while keeping some on exchange for convenience."
        : "Exchanges can be hacked or go bankrupt. Move most funds to a hardware wallet for long-term security.",
      6: isCorrect
        ? "Correct! Mobile data is much safer than public WiFi which can be monitored or compromised."
        : "Public WiFi can be monitored or compromised. Use mobile data or a trusted VPN when checking sensitive accounts.",
      7: isCorrect
        ? "Correct! Only download from official project websites to avoid malware-infected fake wallets."
        : "Fake wallet software with malware is common. Only download from official project websites, never third-party sites.",
      8: isCorrect
        ? "Correct! Buy new from the manufacturer to ensure the device hasn't been tampered with."
        : "Used or third-party hardware wallets could be compromised. Always buy new directly from the manufacturer.",
      9: isCorrect
        ? "Smart! Testing backup restoration before using the wallet ensures your seed phrase works correctly. Many people skip this step and lose everything when they need recovery."
        : "Dangerous! You should test your backup by completely wiping and restoring the wallet before using it. A broken backup means lost Bitcoin forever.",
      10: isCorrect
        ? "Extremely high fees ($50 for $100) suggest your wallet may be compromised or configured incorrectly."
        : "Normal Bitcoin fees are much lower. A 50% fee suggests your wallet is compromised or misconfigured.",
      11: isCorrect
        ? "Exactly right! All Bitcoin recovery services are scams. Only you can recover your Bitcoin using your seed phrase. No one else can help you - that's how Bitcoin is designed."
        : "All Bitcoin recovery services are scams! Only you can recover your Bitcoin with your seed phrase. If you don't have your seed phrase, your Bitcoin is permanently lost.",
      12: isCorrect
        ? "Good! KYC exchanges can freeze funds or report to authorities. Non-KYC methods protect your privacy."
        : "KYC exchanges can freeze funds and report to authorities. For privacy, consider non-KYC options."
    };
    
    return explanations[stage as keyof typeof explanations] || "Good choice!";
  };

  const contextValue: AppContextType = {
    // Navigation state
    activeSection,
    setActiveSection,
    learnSubTab,
    setLearnSubTab,
    simulationsSubTab,
    setSimulationsSubTab,
    moreSubTab,
    setMoreSubTab,
    
    // Modal state
    showEmailModal,
    setShowEmailModal,
    
    // Day navigation
    testDayOverride,
    setTestDayOverride,
    currentDayIndex,
    
    // Day access data
    dayAccessible,
    isDayLockedBySubscription,
    dayAccessInfo,
    dayCompleted,
    nextAvailableDay,
    
    // Quiz completion
    handleQuizCompletion,
    
    // Security test state
    securityTestStage,
    setSecurityTestStage,
    securityScore,
    setSecurityScore,
    selectedSecurityAnswer,
    setSelectedSecurityAnswer,
    showSecurityFeedback,
    setShowSecurityFeedback,
    isSecurityAnswerCorrect,
    setIsSecurityAnswerCorrect,
    securityAnswerSubmitted,
    setSecurityAnswerSubmitted,
    handleSecurityAnswer,
    getSecurityExplanation,
    
    // Finance/inflation state
    inflationAmount,
    setInflationAmount,
    inflationRate,
    setInflationRate,
    inflationTimeFrame,
    setInflationTimeFrame,
    moneySupplyYear,
    setMoneySupplyYear,
    isAnimating,
    setIsAnimating,
    animationStep,
    setAnimationStep,
    
    // Finance animations
    inflationSimActive,
    setInflationSimActive,
    inflationProgress,
    setInflationProgress,
    speedRaceActive,
    setSpeedRaceActive,
    animationActive,
    setAnimationActive,
    settlementProgress,
    setSettlementProgress,
    
    // Other state
    expandedTopics,
    setExpandedTopics,
    safetyQuizScore,
    setSafetyQuizScore,
    convictionSubTab,
    setConvictionSubTab,
    showSplash,
    setShowSplash,
    
    // Utilities
    toast,
    queryClient,
    isPremiumTier,
    setSubscriptionTier,
    location,
    setLocation,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;