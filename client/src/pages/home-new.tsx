import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PWAInstallButton from "@/components/PWAInstallButton";
import { 
  Bitcoin, 
  Lightbulb, 
  BookOpen, 
  TrendingUp, 
  User as UserIcon, 
  Coins, 
  Box, 
  Shield, 
  KeyRound,
  Gem,
  Zap,
  GraduationCap,
  HelpCircle,
  DollarSign,
  AlertTriangle,
  Heart,
  Plus,
  Crown,
  Play,
  ShoppingCart,
  Quote,
  ExternalLink,
  Globe,
  Smartphone,
  Monitor,
  HardDrive,
  Users,
  FileText,
  Calendar,
  Flag,
  Network,
  ArrowRight,
  ArrowLeftRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  BarChart3,
  Clock,
  CreditCard,
  Building2,
  Lock,
  Wallet,
  RefreshCw,
  Eye,
  ArrowLeft,
  Calculator,
  Info,
  TrendingDown,
  Target,
  Star,
  Brain,
  Key,
  Gamepad2,
  MoreHorizontal
} from "lucide-react";
import type { User, UserProgress, ConvictionContent } from "@shared/schema";

// Temporary interface for database-driven lesson content
interface LessonWithKeyTakeaways {
  id: number;
  dayId: number;
  title: string;
  content: string;
  keyTakeaways: string[];
  whyItMatters?: string;
  estimatedReadTime: number;
  createdAt: string;
}
import DailyQuiz from "@/components/DailyQuiz";
import { BitcoinTerm, AutoGlossary } from "@/components/BitcoinGlossary";
import { useToast } from "@/hooks/use-toast";
import { ProgressIndicator, AchievementBadge, LearningAnalytics } from "@/components/ProgressIndicator";
import AchievementSystem from "@/components/AchievementSystem";
import { useSubscription } from "@/contexts/SubscriptionContext";
import LockedContent from "@/components/LockedContent";
// Removed UpgradeModal import - now using inline upgrade cards
import DevSubscriptionToggle from "@/components/DevSubscriptionToggle";
import BottomNavigation from "@/components/BottomNavigation";
import LearnPage from "@/pages/LearnPage";
import FinancePage from "@/pages/FinancePage";
import SafetyTraining from "@/components/simulators/SafetyTrainingSustainable";
import TransactionsSimulator from "@/components/simulators/TransactionsSimulator";
import { TransferSimulator } from "@/components/simulators/TransferSimulator";
import WalletSimulator from "@/components/simulators/WalletSimulator";
import HODLSimulator from "@/components/simulators/HODLSimulator";
import { DCASimulator } from "@/components/simulators/DCASimulator";
import EmailCollectionModal from "@/components/EmailCollectionModal";
import { ConsistencyCalendar } from "@/components/ConsistencyCalendar";

import HomeSection from "@/components/sections/HomeSection";
import MoreSection from "@/components/sections/MoreSection";
import { iconMap, bitcoinTerms, seedPhraseScenarios } from "@/constants/appData";
import WeeklyQuiz from "@/components/WeeklyQuiz";
import { cleanText, getExpandedLessonContent } from "@/utils/textUtils";











type MainSection = "home" | "learn" | "money" | "simulations" | "more";
type LearnSubTab = "today" | "reference";
type SimulationsSubTab = "wallet" | "safety" | "transactions" | "transfer" | "hodl" | "dca" | "inflation" | "fees";
type MoreSubTab = "store" | "about";

export default function Home() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isPremiumTier, setSubscriptionTier } = useSubscription();
  const [location, setLocation] = useLocation();
  
  // Determine active section from URL
  const getActiveSectionFromPath = (path: string): MainSection => {
    if (path === '/' || path === '') return 'home';
    if (path.includes('/learn')) return 'learn';
    if (path.includes('/money')) return 'money';
    if (path.includes('/simulators')) return 'simulations';
    if (path.includes('/more')) return 'more';
    return 'home'; // default to home instead of learn
  };
  
  // Determine simulator sub-tab from URL
  const getSimulatorSubTabFromPath = (path: string): SimulationsSubTab => {
    if (path.includes('/simulators/dca')) return 'dca';
    if (path.includes('/simulators/hodl')) return 'hodl';
    if (path.includes('/simulators/safety')) return 'safety';
    if (path.includes('/simulators/wallet')) return 'wallet';
    if (path.includes('/simulators/transactions')) return 'transactions';
    if (path.includes('/simulators/transfer')) return 'transfer';
    if (path.includes('/simulators/inflation')) return 'inflation';
    if (path.includes('/simulators/fees')) return 'fees';
    return 'safety'; // default
  };
  
  const [activeSection, setActiveSection] = useState<MainSection>(getActiveSectionFromPath(location));
  const [learnSubTab, setLearnSubTab] = useState<LearnSubTab>("today");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [simulationsSubTab, setSimulationsSubTab] = useState<SimulationsSubTab>(getSimulatorSubTabFromPath(location));
  const [moreSubTab, setMoreSubTab] = useState<MoreSubTab>("about");
  // Removed floating modal state - now using inline upgrade cards
  
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
  
  // Day access control queries
  const { data: dayAccessible = false } = useQuery({
    queryKey: ['/api/day-access', 1, currentDayIndex], // userId=1 (default user)
    queryFn: () => fetch(`/api/day-access/1/${currentDayIndex}`).then(res => res.json())
  });

  // Check if day is locked by subscription tier (Days 1-7 free, 8+ premium)
  const isDayLockedBySubscription = currentDayIndex > 7 && !isPremiumTier;
  
  // Check day access info for waiting period restrictions
  const { data: dayAccessInfo } = useQuery({
    queryKey: ['/api/day-access-info', 1, currentDayIndex],
    queryFn: () => fetch(`/api/day-access-info/1/${currentDayIndex}`).then(res => res.json()),
    refetchInterval: isDayLockedBySubscription ? false : 60000, // Refresh every minute if not locked by subscription
  });
  
  const { data: dayCompleted = false } = useQuery({
    queryKey: ['/api/day-completed', 1, currentDayIndex],
    queryFn: () => fetch(`/api/day-completed/1/${currentDayIndex}`).then(res => res.json())
  });
  
  const { data: nextAvailableDayResponse } = useQuery({
    queryKey: ['/api/next-available-day', 1],
    queryFn: () => fetch('/api/next-available-day/1').then(res => res.json())
  });
  
  const nextAvailableDay = nextAvailableDayResponse?.dayIndex ?? 1;

  // Mark day as completed mutation
  const markDayCompletedMutation = useMutation({
    mutationFn: (dayIndex: number) => 
      fetch('/api/mark-day-completed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1, dayIndex })
      }),
    onSuccess: () => {
      // Invalidate relevant queries to refresh access data
      queryClient.invalidateQueries({ queryKey: ['/api/day-access'] });
      queryClient.invalidateQueries({ queryKey: ['/api/day-completed'] });
      queryClient.invalidateQueries({ queryKey: ['/api/next-available-day'] });
      toast({
        title: "Day Complete!",
        description: "Great progress! Come back tomorrow for the next lesson.",
        duration: 2500, // 2.5 seconds
      });
    }
  });

  // Stable callback for quiz completion to prevent infinite loops
  const handleQuizCompletion = useCallback(() => {
    markDayCompletedMutation.mutate(currentDayIndex);
  }, [markDayCompletedMutation, currentDayIndex]);

  const [convictionSubTab, setConvictionSubTab] = useState<"whitepaper" | "books" | "videos">("whitepaper");
  const [showSplash, setShowSplash] = useState(false);

  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [safetyQuizScore, setSafetyQuizScore] = useState<number>(0);
  
  // Security Test State
  const [securityTestStage, setSecurityTestStage] = useState<number>(0);
  const [securityScore, setSecurityScore] = useState<number>(0);
  const [securityStage, setSecurityStage] = useState<number>(1);
  const [userSecurityAnswers, setUserSecurityAnswers] = useState<Record<number, boolean>>({});
  const [selectedSecurityAnswer, setSelectedSecurityAnswer] = useState<number | null>(null);
  const [showSecurityFeedback, setShowSecurityFeedback] = useState<boolean>(false);
  const [isSecurityAnswerCorrect, setIsSecurityAnswerCorrect] = useState<boolean>(false);
  const [securityAnswerSubmitted, setSecurityAnswerSubmitted] = useState<boolean>(false);
  
  // Security Test Handler Functions
  const handleSecurityAnswer = (selectedIndex: number) => {
    if (securityAnswerSubmitted) return;
    
    setSelectedSecurityAnswer(selectedIndex);
    
    // Define correct answers for each scenario (0-based index)
    const correctAnswers: { [key: number]: number } = {
      1: 2, 2: 1, 3: 1, 4: 2, 5: 0, 6: 1, 7: 1, 8: 1, 
      9: 3, 10: 2, 11: 2, 12: 2, 13: 2, 14: 1, 15: 2, 16: 2
    };
    
    const correctIndex = correctAnswers[securityTestStage] || 0;
    const isCorrect = selectedIndex === correctIndex;
    
    // Immediately show feedback
    setIsSecurityAnswerCorrect(isCorrect);
    setShowSecurityFeedback(true);
    setSecurityAnswerSubmitted(true);
    
    // Update score
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
        ? "Correct! 100% returns in a week is impossible and a classic Ponzi scheme red flag."
        : "Promising to double money in a week is a classic Ponzi scheme. No legitimate investment offers 100% weekly returns.",
      13: isCorrect
        ? "Excellent! Hardware wallets should never come with pre-generated seed phrases. This is a major red flag indicating tampering or counterfeiting. Return it immediately and order from official sources."
        : "Danger! Pre-generated seed phrases mean someone else controls your Bitcoin. Legitimate hardware wallets generate seed phrases fresh during setup, never include them pre-written.",
      14: isCorrect
        ? "Correct! Clipboard malware is extremely common and specifically targets Bitcoin addresses. Always double-check addresses character by character before sending."
        : "This was likely clipboard malware that replaced the Bitcoin address while copying. Always verify the full address after pasting - clipboard attacks are very common.",
      15: isCorrect
        ? "Perfect! Bitcoin has no customer support because it's decentralized. Anyone calling claiming to be Bitcoin support is a scammer trying to steal your seed phrase."
        : "That was a social engineering scam! Bitcoin has no central authority or customer support. Never give your seed phrase to anyone claiming to help - they're trying to steal your Bitcoin.",
      16: isCorrect
        ? "Smart approach! Researching apps on official Bitcoin websites like bitcoin.org helps you identify legitimate wallets and avoid fake apps designed to steal your funds."
        : "Don't rely on app store ratings alone - scammers manipulate them. Always verify wallet apps through official Bitcoin websites before downloading to avoid fake malware-infected versions."
    };
    return explanations[stage as keyof typeof explanations] || "Invalid question.";
  };
  
  // Finance section interactive states
  const [inflationAmount, setInflationAmount] = useState<string>("10000");
  const [inflationYears, setInflationYears] = useState<number>(10);
  const [inflationRate, setInflationRate] = useState<number>(3.0);
  
  // Banking Fees Calculator State
  const [monthlyFee, setMonthlyFee] = useState<string>("12");
  const [wireTransfers, setWireTransfers] = useState<string>("1");
  const [atmWithdrawals, setAtmWithdrawals] = useState<string>("4");
  const [atmFees, setAtmFees] = useState<string>("4");
  const [overdraftFees, setOverdraftFees] = useState<string>("0");
  const [internationalFees, setInternationalFees] = useState<string>("500");
  const [paperFees, setPaperFees] = useState<string>("5");
  const [creditCardFees, setCreditCardFees] = useState<string>("95");
  const [inflationSliderYear, setInflationSliderYear] = useState<number>(0);
  const [transferCount, setTransferCount] = useState<string>("2");
  const [transferAmount, setTransferAmount] = useState<string>("1000");
  const [speedRaceActive, setSpeedRaceActive] = useState<boolean>(false);
  const [animationActive, setAnimationActive] = useState(false);
  const [inflationSimActive, setInflationSimActive] = useState(false);
  const [inflationProgress, setInflationProgress] = useState(0); // 0-6 representing years 0,1,5,10,15,20,25
  const [settlementProgress, setSettlementProgress] = useState<{traditional: number; bitcoin: number}>({ traditional: 0, bitcoin: 0 });
  
  // Seed Phrase Recovery Simulator State
  const [seedPhraseActive, setSeedPhraseActive] = useState(false);
  const [seedPhraseScenario, setSeedPhraseScenario] = useState(0);
  const [seedPhraseProgress, setSeedPhraseProgress] = useState(0);
  const [enteredWords, setEnteredWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [recoveryComplete, setRecoveryComplete] = useState(false);
  const [showSeedHints, setShowSeedHints] = useState(false);
  
  // Money Supply Visualization State
  const [moneySupplyYear, setMoneySupplyYear] = useState(2025);

  // Money Supply Helper Functions
  const getMoneySupplyRaw = (year: number): number => {
    // Authentic M2 Money Supply data (in trillions) - 1920 to 2025
    const dataPoints: { [key: number]: number } = {
      1920: 0.023, 1929: 0.026, 1933: 0.020, 1940: 0.040, 1945: 0.107, 
      1950: 0.117, 1960: 0.167, 1971: 0.583, 1980: 1.600, 1990: 3.200, 
      2000: 4.900, 2008: 7.500, 2010: 8.700, 2015: 12.400, 2020: 15.400, 
      2021: 20.100, 2024: 21.000, 2025: 21.200
    };
    
    // Linear interpolation between known points
    const years = Object.keys(dataPoints).map(Number).sort();
    if (year <= years[0]) return dataPoints[years[0]];
    if (year >= years[years.length - 1]) return dataPoints[years[years.length - 1]];
    
    for (let i = 0; i < years.length - 1; i++) {
      if (year >= years[i] && year <= years[i + 1]) {
        const progress = (year - years[i]) / (years[i + 1] - years[i]);
        return dataPoints[years[i]] + progress * (dataPoints[years[i + 1]] - dataPoints[years[i]]);
      }
    }
    return dataPoints[2025];
  };

  const getMoneySupplyForYear = (year: number): string => {
    return getMoneySupplyRaw(year).toFixed(1);
  };

  const getMoneySupplyMultiplier = (year: number): string => {
    return (getMoneySupplyRaw(year) / 0.023).toFixed(0);
  };

  const getPurchasingPowerRaw = (year: number): number => {
    // What $1 from 1920 is worth today (inverse of cumulative inflation)
    const dataPoints: { [key: number]: number } = {
      1920: 1.00, 1929: 1.00, 1933: 1.25, 1940: 0.90, 1945: 0.70,
      1950: 0.60, 1960: 0.50, 1971: 0.35, 1980: 0.20, 1990: 0.15,
      2000: 0.10, 2008: 0.08, 2010: 0.07, 2015: 0.065, 2020: 0.065,
      2021: 0.060, 2024: 0.065
    };
    
    const years = Object.keys(dataPoints).map(Number).sort();
    if (year <= years[0]) return dataPoints[years[0]];
    if (year >= years[years.length - 1]) return dataPoints[years[years.length - 1]];
    
    for (let i = 0; i < years.length - 1; i++) {
      if (year >= years[i] && year <= years[i + 1]) {
        const progress = (year - years[i]) / (years[i + 1] - years[i]);
        return dataPoints[years[i]] + progress * (dataPoints[years[i + 1]] - dataPoints[years[i]]);
      }
    }
    return dataPoints[2024];
  };



  const getHousePriceForYear = (year: number): number => {
    // Median home prices in the US - authentic historical data
    const dataPoints: { [key: number]: number } = {
      1920: 3200, 1930: 3900, 1940: 2900, 1950: 7400, 1960: 11900,
      1971: 25200, 1980: 64600, 1990: 122900, 2000: 169000, 2008: 247900,
      2010: 221800, 2015: 293400, 2020: 347500, 2021: 408800, 2022: 428700,
      2023: 436800, 2024: 442600
    };
    
    const years = Object.keys(dataPoints).map(Number).sort();
    if (year <= years[0]) return dataPoints[years[0]];
    if (year >= years[years.length - 1]) return dataPoints[years[years.length - 1]];
    
    for (let i = 0; i < years.length - 1; i++) {
      if (year >= years[i] && year <= years[i + 1]) {
        const progress = (year - years[i]) / (years[i + 1] - years[i]);
        return Math.round(dataPoints[years[i]] + progress * (dataPoints[years[i + 1]] - dataPoints[years[i]]));
      }
    }
    return dataPoints[2024];
  };

  const getMilkPriceForYear = (year: number): string => {
    // Average price per gallon of milk - authentic historical data
    const dataPoints: { [key: number]: number } = {
      1920: 0.56, 1930: 0.46, 1940: 0.52, 1950: 0.82, 1960: 0.97,
      1971: 1.18, 1980: 2.16, 1990: 2.78, 2000: 2.97, 2008: 3.87,
      2010: 3.26, 2015: 3.41, 2020: 3.54, 2021: 3.69, 2022: 4.33,
      2023: 3.91, 2024: 3.99
    };
    
    const years = Object.keys(dataPoints).map(Number).sort();
    if (year <= years[0]) return dataPoints[years[0]].toFixed(2);
    if (year >= years[years.length - 1]) return dataPoints[years[years.length - 1]].toFixed(2);
    
    for (let i = 0; i < years.length - 1; i++) {
      if (year >= years[i] && year <= years[i + 1]) {
        const progress = (year - years[i]) / (years[i + 1] - years[i]);
        const price = dataPoints[years[i]] + progress * (dataPoints[years[i + 1]] - dataPoints[years[i]]);
        return price.toFixed(2);
      }
    }
    return dataPoints[2024].toFixed(2);
  };

  const getGasPriceForYear = (year: number): string => {
    // Average price per gallon of gasoline - authentic historical data
    const dataPoints: { [key: number]: number } = {
      1920: 0.30, 1930: 0.20, 1940: 0.18, 1950: 0.27, 1960: 0.31,
      1971: 0.36, 1980: 1.19, 1990: 1.34, 2000: 1.51, 2008: 3.27,
      2010: 2.79, 2015: 2.43, 2020: 2.17, 2021: 3.01, 2022: 3.95,
      2023: 3.52, 2024: 3.38
    };
    
    const years = Object.keys(dataPoints).map(Number).sort();
    if (year <= years[0]) return dataPoints[years[0]].toFixed(2);
    if (year >= years[years.length - 1]) return dataPoints[years[years.length - 1]].toFixed(2);
    
    for (let i = 0; i < years.length - 1; i++) {
      if (year >= years[i] && year <= years[i + 1]) {
        const progress = (year - years[i]) / (years[i + 1] - years[i]);
        const price = dataPoints[years[i]] + progress * (dataPoints[years[i + 1]] - dataPoints[years[i]]);
        return price.toFixed(2);
      }
    }
    return dataPoints[2024].toFixed(2);
  };



  // Settlement Animation Logic
  const startSettlementAnimation = () => {
    setSpeedRaceActive(true);
    setAnimationActive(true);
    setSettlementProgress({ traditional: 0, bitcoin: 0 });

    // Bitcoin animation: completes all 4 steps in 18 seconds (20% slower for better visibility)
    const bitcoinSteps = [
      { step: 1, delay: 2400 },   // Step 1 at 2.4 seconds (transaction creation)
      { step: 2, delay: 6000 },   // Step 2 at 6 seconds (network broadcast)
      { step: 3, delay: 14400 },  // Step 3 at 14.4 seconds (mining consensus)
      { step: 4, delay: 18000 }   // Step 4 at 18 seconds (final settlement)
    ];

    // Traditional banking: takes much longer with realistic banking delays
    const traditionalSteps = [
      { step: 1, delay: 8000 },   // Step 1 at 8 seconds (bank visit takes longer)
      { step: 2, delay: 20000 },  // Step 2 at 20 seconds (compliance review)
      { step: 3, delay: 44000 },  // Step 3 at 44 seconds (SWIFT processing)
      { step: 4, delay: 70000 },  // Step 4 at 70 seconds (intermediary banks)
      { step: 5, delay: 86000 }   // Step 5 at 86 seconds (final settlement)
    ];

    // Animate Bitcoin steps
    bitcoinSteps.forEach(({ step, delay }) => {
      setTimeout(() => {
        setSettlementProgress(prev => ({ ...prev, bitcoin: step }));
      }, delay);
    });

    // Animate Traditional steps  
    traditionalSteps.forEach(({ step, delay }) => {
      setTimeout(() => {
        setSettlementProgress(prev => ({ ...prev, traditional: step }));
      }, delay);
    });

    // End animation after 90 seconds
    setTimeout(() => {
      setAnimationActive(false);
    }, 90000);
  };

  const resetSettlementAnimation = () => {
    setSpeedRaceActive(false);
    setAnimationActive(false);
    setSettlementProgress({ traditional: 0, bitcoin: 0 });
  };

  // Inflation Simulation Logic  
  const startInflationSimulation = () => {
    setInflationSimActive(true);
    setInflationProgress(0);

    // Animate through years: 0 -> 1yr -> 5yr -> 10yr -> 15yr -> 20yr -> 25yr (2x faster)
    const timePoints = [
      { step: 1, delay: 800 },    // 1 year at 0.8 seconds
      { step: 2, delay: 1600 },   // 5 years at 1.6 seconds  
      { step: 3, delay: 2400 },   // 10 years at 2.4 seconds
      { step: 4, delay: 3200 },   // 15 years at 3.2 seconds
      { step: 5, delay: 4000 },   // 20 years at 4 seconds
      { step: 6, delay: 4800 }    // 25 years at 4.8 seconds
    ];

    timePoints.forEach(({ step, delay }) => {
      setTimeout(() => {
        setInflationProgress(step);
      }, delay);
    });

    // End simulation after 6 seconds (2x faster)
    setTimeout(() => {
      setInflationSimActive(false);
    }, 6000);
  };

  const resetInflationSimulation = () => {
    setInflationSimActive(false);
    setInflationProgress(0);
  };
  const [transactionInputs, setTransactionInputs] = useState({
    fromAddress: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    toAddress: "",
    amount: "0.001",
    feeRate: "standard"
  });
  const [transactionState, setTransactionState] = useState<"building" | "preview" | "signing" | "broadcasting" | "confirming" | "confirmed">("building");
  const [showTransactionApproval, setShowTransactionApproval] = useState(false);
  const [confirmationCount, setConfirmationCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(45);
  const [transactionJourney, setTransactionJourney] = useState<"broadcast" | "mempool" | "confirming" | "settled">("broadcast");
  const [transactionId, setTransactionId] = useState("");

  // Fee options with realistic data
  const feeOptions = {
    slow: { rate: "1-3", cost: "0.00001", time: "60+ min", priority: "Low Priority", satsPerByte: 2 },
    standard: { rate: "4-8", cost: "0.00004", time: "10-30 min", priority: "Standard", satsPerByte: 6 },
    fast: { rate: "9-15", cost: "0.00008", time: "1-10 min", priority: "High Priority", satsPerByte: 12 }
  };
  
  // Enhanced HODL Calculator State
  const [hodlInputs, setHodlInputs] = useState<{
    initialAmount: number;
    years: number;
    startPrice: number;
    endPrice: number;
    scenario?: string;
    title?: string;
    period?: string;
    description?: string;
  }>({
    initialAmount: 10000,
    years: 4,
    startPrice: 30000,
    endPrice: 95000,
    scenario: '',
    title: '',
    period: '',
    description: ''
  });
  const [hodlResults, setHodlResults] = useState<any>(null);

  // DCA Calculator State
  const [dcaInputs, setDcaInputs] = useState({
    monthlyAmount: 100,
    frequency: 'monthly' as 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly',
    duration: 12, // months
    startDate: '2023-01-01'
  });
  const [dcaResults, setDcaResults] = useState<{
    totalInvested: number;
    totalBitcoin: number;
    averagePrice: number;
    currentValue: number;
    totalGain: number;
    percentageReturn: number;
    duration: number;
    purchases?: Array<{
      index: number;
      timeProgress: number;
      price: number;
      amount: number;
      bitcoinPurchased: number;
      totalInvested: number;
      totalBitcoin: number;
      runningAvgCost: number;
    }>;
  } | null>(null);
  


  const getLessonObjectives = (lessonTitle: string): string[] => {
    const objectives: Record<string, string[]> = {
      "Understanding Bitcoin: Digital Money": [
        "How Bitcoin functions as peer-to-peer digital cash",
        "Why Bitcoin doesn't need banks or intermediaries",
        "The role of cryptography in securing transactions",
        "How the blockchain maintains transaction history"
      ],
      "Bitcoin Mining: Securing the Network": [
        "How mining secures the Bitcoin network",
        "The relationship between energy and security",
        "How mining difficulty adjusts automatically",
        "Why miners are incentivized to be honest"
      ],
      "Digital Scarcity: Fixed Supply": [
        "Why Bitcoin has a 21 million coin limit",
        "How scarcity creates digital value",
        "The halving mechanism and its effects",
        "Comparing Bitcoin to traditional money printing"
      ],
      "Decentralized Network: No Central Control": [
        "How thousands of nodes work together",
        "Why decentralization prevents censorship",
        "The consensus mechanism explained",
        "Benefits of peer-to-peer architecture"
      ]
    };
    return objectives[lessonTitle] || [
      "Core concepts of this Bitcoin topic",
      "Real-world applications and examples",
      "How this connects to the broader ecosystem",
      "Practical implications for users"
    ];
  };

  const getLessonOverview = (lessonTitle: string): string => {
    const overviews: Record<string, string> = {
      "Understanding Bitcoin: Digital Money": "Bitcoin revolutionized money by creating the first successful digital currency that works without banks, governments, or any central authority. It's like having digital cash that you can send to anyone, anywhere, instantly.",
      "Bitcoin Mining: Securing the Network": "Mining is Bitcoin's security system - a global network of computers competing to validate transactions and secure the blockchain. It's like having millions of digital guards protecting every Bitcoin transaction.",
      "Digital Scarcity: Fixed Supply": "For the first time in history, we have truly scarce digital money. Bitcoin's 21 million coin limit is hardcoded into the system, creating digital scarcity similar to gold but with the benefits of digital technology.",
      "Decentralized Network: No Central Control": "Bitcoin operates on a network of thousands of independent computers worldwide. No single entity controls it, making it resistant to censorship, seizure, and manipulation by governments or corporations."
    };
    return overviews[lessonTitle] || "This lesson explores fundamental Bitcoin concepts that form the foundation of understanding cryptocurrency and blockchain technology.";
  };

  const getLessonSections = (lessonTitle: string, content: string) => {
    const sections: Record<string, any[]> = {
      "Understanding Bitcoin: Digital Money": [
        {
          title: "What Makes Bitcoin Different?",
          content: "Unlike traditional digital payments that require banks to verify and process transactions, Bitcoin uses a decentralized network where thousands of computers work together to validate payments. This means no single entity can control, freeze, or reverse your transactions.",
          example: "In 2021, El Salvador's President Nayib Bukele sent $30 worth of Bitcoin to students across the country in under 10 minutes - something that would have taken days through traditional banking and cost $15+ in fees per transaction.",
          checkpoint: "Can you explain why Bitcoin transactions don't need banks to work?",
          diagram: `<svg width="300" height="120" viewBox="0 0 300 120" className="mx-auto">
            <rect x="20" y="20" width="60" height="40" rx="8" fill="#f97316" opacity="0.3" stroke="#f97316"/>
            <text x="50" y="45" text-anchor="middle" fill="#f97316" fontSize="12">Your Wallet</text>
            <rect x="220" y="20" width="60" height="40" rx="8" fill="#f97316" opacity="0.3" stroke="#f97316"/>
            <text x="250" y="45" text-anchor="middle" fill="#f97316" fontSize="12">Friend's Wallet</text>
            <path d="M 80 40 Q 150 20 220 40" stroke="#f97316" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)"/>
            <text x="150" y="35" text-anchor="middle" fill="#f97316" fontSize="11">Direct Transfer</text>
            <circle cx="150" cy="80" r="25" fill="#f97316" opacity="0.2" stroke="#f97316"/>
            <text x="150" y="85" text-anchor="middle" fill="#f97316" fontSize="10">Bitcoin Network</text>
            <defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#f97316"/></marker></defs>
          </svg>`,
          diagramCaption: "Bitcoin enables direct peer-to-peer transactions without intermediaries"
        },
        {
          title: "Cryptographic Security",
          content: "Bitcoin uses advanced cryptography to secure transactions. Each payment is digitally signed with your private key, proving you own the Bitcoin you're sending. The network verifies these signatures without revealing your private key, ensuring only you can spend your Bitcoin.",
          example: "In 2022, when Canada froze bank accounts during the Freedom Convoy protests, Bitcoin donations continued flowing to protesters because no government can freeze or control Bitcoin private keys - only the holder of the private key can access those funds.",
          checkpoint: "Why is it important that only you know your private key?"
        },
        {
          title: "Global Accessibility",
          content: "Bitcoin works the same way everywhere in the world, 24/7/365. There are no business hours, no geographic restrictions, and no permission needed. Anyone with internet access can send or receive Bitcoin, making it truly borderless money.",
          example: "During Ukraine's 2022 conflict, when traditional payment systems were disrupted, Bitcoin donations reached defenders within hours while bank transfers were impossible. Ukrainian officials received over $100 million in Bitcoin donations because the network operates regardless of physical infrastructure damage.",
          checkpoint: "How does Bitcoin's global accessibility benefit people in countries with limited banking infrastructure?"
        }
      ],
      "Bitcoin Mining: Securing the Network": [
        {
          title: "How Mining Works",
          content: "Mining is like a global lottery where computers compete to solve complex mathematical puzzles. The winner gets to add the next block of transactions to the blockchain and receives newly created Bitcoin as a reward. This process occurs approximately every 10 minutes.",
          example: "Imagine millions of computers worldwide racing to solve the same puzzle. The first to solve it gets to write the next page in Bitcoin's transaction book and earns 3.125 Bitcoin (worth over $200,000 at current prices) as a reward.",
          checkpoint: "Why do you think miners are willing to spend electricity to solve these puzzles?",
          diagram: `<svg width="320" height="140" viewBox="0 0 320 140" className="mx-auto">
            <rect x="20" y="20" width="50" height="30" rx="4" fill="#f97316" opacity="0.3" stroke="#f97316"/>
            <text x="45" y="38" text-anchor="middle" fill="#f97316" fontSize="10">Miner 1</text>
            <rect x="90" y="20" width="50" height="30" rx="4" fill="#f97316" opacity="0.3" stroke="#f97316"/>
            <text x="115" y="38" text-anchor="middle" fill="#f97316" fontSize="10">Miner 2</text>
            <rect x="160" y="20" width="50" height="30" rx="4" fill="#f97316" opacity="0.3" stroke="#f97316"/>
            <text x="185" y="38" text-anchor="middle" fill="#f97316" fontSize="10">Winner!</text>
            <rect x="230" y="20" width="50" height="30" rx="4" fill="#6b7280" opacity="0.3" stroke="#6b7280"/>
            <text x="255" y="38" text-anchor="middle" fill="#6b7280" fontSize="10">Miner N</text>
            <rect x="120" y="80" width="80" height="40" rx="8" fill="#f97316" opacity="0.3" stroke="#f97316"/>
            <text x="160" y="105" text-anchor="middle" fill="#f97316" fontSize="12">New Block Added</text>
            <path d="M 185 50 L 180 80" stroke="#f97316" strokeWidth="3" markerEnd="url(#arrowhead2)"/>
            <defs><marker id="arrowhead2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#f97316"/></marker></defs>
          </svg>`,
          diagramCaption: "Miners compete to solve puzzles and add new blocks to the blockchain"
        },
        {
          title: "Energy and Security",
          content: "The energy miners use to solve puzzles is what makes Bitcoin secure. The more energy (hash power) protecting the network, the more expensive it becomes for anyone to attack it. This energy expenditure creates an economic barrier that protects all Bitcoin users.",
          example: "It would cost billions of dollars in electricity and specialized equipment to attempt to attack Bitcoin for even one hour. This makes Bitcoin one of the most secure payment networks ever created, protected by more computing power than the world's top supercomputers combined.",
          checkpoint: "How does energy consumption contribute to Bitcoin's security?"
        },
        {
          title: "Difficulty Adjustment",
          content: "Bitcoin automatically adjusts how hard the mining puzzles are every 2016 blocks (about two weeks) to maintain a consistent 10-minute block time. If more miners join, puzzles get harder. If miners leave, puzzles get easier. This keeps Bitcoin running smoothly regardless of how many miners participate.",
          example: "When Bitcoin's price rises and more miners join the network, the system automatically makes the puzzles harder to solve, ensuring blocks still come every 10 minutes instead of faster. This self-regulating mechanism has worked flawlessly for over 15 years.",
          checkpoint: "Why is it important for Bitcoin blocks to come every 10 minutes rather than randomly?"
        }
      ]
    };
    
    return sections[lessonTitle] || [
      {
        title: "Understanding the Basics",
        content: content || "This lesson covers fundamental concepts that are essential for understanding Bitcoin and cryptocurrency technology.",
        example: "Real-world applications demonstrate how these concepts work in practice.",
        checkpoint: "Can you explain the main concept in your own words?"
      }
    ];
  };

  // Helper function to clean markdown formatting




  const getLessonTakeaways = (lessonTitle: string): string[] => {
    const takeaways: Record<string, string[]> = {
      "Bitcoin vs Traditional Money: Why It Matters": [
        "**Regular money** is backed only by government promises and loses buying power over time through money printing",
        "**Banks and governments** can freeze accounts, reverse payments, and cut people off from money systems anytime", 
        "**Bitcoin's fixed supply** of 21 million coins protects against money printing and keeps it rare",
        "**Open access** means anyone with internet can use Bitcoin without asking banks or governments for permission",
        "**Control over your money** returns power to individuals, protecting against bank failures and political control"
      ],
      "Understanding Bitcoin: Digital Money": [
        "Bitcoin is the first successful person-to-person digital cash system that works without banks or middlemen",
        "Secret codes ensure only you can spend your Bitcoin, providing security without revealing your private information",
        "Bitcoin operates 24/7 worldwide, making it accessible to anyone with internet regardless of location or bank account",
        "The spread-out network means no single company or government can control, freeze, or reverse your payments"
      ],
      "Bitcoin Mining: Securing the Network": [
        "Mining is a race where computers solve puzzles to add new blocks and earn Bitcoin rewards",
        "Energy use directly connects to network security - more energy makes Bitcoin harder to attack",
        "Difficulty changes every 2016 blocks to keep consistent 10-minute block times no matter how many miners join",
        "The reward system encourages miners to protect the network, creating a strong and self-running system"
      ],
      "Digital Scarcity: Fixed Supply": [
        "Bitcoin's 21 million coin limit is built-in and cannot be changed, creating true digital rarity",
        "Halving events every 4 years reduce new Bitcoin creation, making it more rare over time",
        "Unlike regular money, Bitcoin cannot be printed away by banks or governments",
        "Digital rarity combined with growing demand creates long-term value protection potential"
      ],
      "Decentralized Network: No Central Control": [
        "Thousands of independent computers worldwide keep identical copies of Bitcoin's payment history",
        "No single company can shut down or control the Bitcoin network because it's spread out everywhere",
        "Network rules are enforced by math and computer agreement, not human authority",
        "Spreading out control provides protection from censorship and gives users control over their money globally"
      ]
    };
    return takeaways[lessonTitle] || [
      "This topic introduces basic ideas you need to understand Bitcoin",
      "Real-world examples show practical value and how people actually use it",
      "Understanding this concept helps build complete Bitcoin knowledge",
      "These ideas contribute to Bitcoin's special features and advantages"
    ];
  };

  // All diveDeeper content is now centralized in storage - no frontend fallback needed
  const getFactDeepDive = (factTitle: string) => {
    const deepDives: Record<string, {
      explanation: string;
      examples: string[];
      visualDescription: string;
      keyTakeaways: string[];
    }> = {
      "What is Bitcoin?": {
        explanation: "Bitcoin is a revolutionary peer-to-peer electronic cash system that allows online payments to be sent directly between parties without going through a financial institution. It operates on a decentralized network maintained by thousands of computers worldwide.",
        examples: [
          "Send money anywhere in the world 24/7 without banks",
          "No central authority can freeze or confiscate your Bitcoin",
          "Every transaction is recorded on a public, unchangeable ledger",
          "Uses cryptographic proof instead of trust in institutions"
        ],
        visualDescription: "Imagine a global digital cash system where every transaction is like writing in an unchangeable public notebook that thousands of people verify and keep copies of.",
        keyTakeaways: [
          "First successful digital currency without central control",
          "Operates 24/7 globally without intermediaries",
          "Transactions are irreversible and transparent",
          "Powered by mathematical proof rather than institutional trust"
        ]
      },
      "Halving Events": {
        explanation: "Bitcoin halving is a pre-programmed event that occurs approximately every 4 years (210,000 blocks) where the reward for mining new blocks is cut in half. This reduces the rate at which new bitcoins enter circulation.",
        examples: [
          "2012: Reward dropped from 50 BTC to 25 BTC per block",
          "2016: Reward dropped from 25 BTC to 12.5 BTC per block", 
          "2020: Reward dropped from 12.5 BTC to 6.25 BTC per block",
          "2024: Reward dropped from 6.25 BTC to 3.125 BTC per block (most recent)"
        ],
        visualDescription: "Imagine a giant digital clock counting down blocks. Every 210,000 blocks, an automated mechanism literally cuts the mining reward in half, like a factory automatically reducing production.",
        keyTakeaways: [
          "Reduces new Bitcoin supply entering the market",
          "Creates predictable scarcity timeline",
          "Often correlates with price increases due to supply shock",
          "Demonstrates Bitcoin's deflationary monetary policy"
        ]
      },


      "Decentralized Currency": {
        explanation: "Unlike traditional currencies controlled by governments and central banks, Bitcoin operates without any central authority. The network rules are enforced by mathematics and consensus among participants.",
        examples: [
          "No central bank can print more bitcoins",
          "No government can shut down the Bitcoin network",
          "Monetary policy is transparent and unchangeable",
          "Works the same way in every country"
        ],
        visualDescription: "Imagine money that operates like the internet - no single entity controls it, yet it works reliably through agreed-upon rules that everyone follows.",
        keyTakeaways: [
          "No central authority controls Bitcoin",
          "Monetary policy is fixed and transparent",
          "Resistant to government interference",
          "Global currency with consistent rules everywhere"
        ]
      },
      "Bitcoin Mining": {
        explanation: "Mining is the process by which new bitcoins are created and transactions are verified. Miners use computational power to solve complex mathematical puzzles, securing the network and earning bitcoin rewards.",
        examples: [
          "Miners compete to solve cryptographic puzzles",
          "Winner gets to add the next block and earn rewards",
          "Mining difficulty adjusts every 2016 blocks",
          "Energy consumption secures the network"
        ],
        visualDescription: "Think of mining like a global lottery where millions of computers race to solve a puzzle. The winner gets to write the next page in Bitcoin's ledger and receives newly created bitcoins as a prize.",
        keyTakeaways: [
          "Mining secures the Bitcoin network",
          "Provides economic incentives for network participation", 
          "Creates new bitcoins according to a fixed schedule",
          "Difficulty adjusts to maintain 10-minute block times"
        ]
      },
      "Store of Value": {
        explanation: "Bitcoin serves as digital gold - a way to preserve wealth over time. Its fixed supply and decentralized nature make it resistant to inflation and monetary debasement by central authorities.",
        examples: [
          "Limited supply of 21 million coins maximum",
          "Cannot be inflated away by governments",
          "Portable across borders without confiscation risk",
          "Divisible into 100 million satoshis per bitcoin"
        ],
        visualDescription: "Imagine digital gold that you can carry in your phone, send across the world instantly, and that no government can print more of or confiscate.",
        keyTakeaways: [
          "Fixed supply creates scarcity like precious metals",
          "Immune to monetary inflation",
          "Portable and divisible digital asset",
          "Censorship-resistant wealth preservation"
        ]
      },
      "Blockchain Technology": {
        explanation: "The blockchain is Bitcoin's underlying technology - a chain of blocks containing transaction data, linked and secured using cryptography. Each block references the previous one, creating an unchangeable history.",
        examples: [
          "Each block contains a hash of the previous block",
          "Tampering with any block breaks the chain",
          "All nodes verify the complete chain",
          "Longest valid chain is accepted as truth"
        ],
        visualDescription: "Picture a chain where each link contains transaction records and is mathematically connected to the previous link. Breaking any link would be obvious to everyone watching.",
        keyTakeaways: [
          "Creates immutable transaction history",
          "Uses cryptographic hashing for security",
          "Distributed across thousands of nodes",
          "Transparent and verifiable by anyone"
        ]
      },
      "Why Bitcoin Matters": {
        explanation: "Bitcoin represents the first time in history that individuals can have complete sovereignty over their money without relying on banks, governments, or any third parties. It provides financial freedom through mathematical certainty rather than institutional trust.",
        examples: [
          "Send money internationally without bank approval or fees",
          "Store wealth without risk of account freezing or seizure",
          "Access financial services without meeting banking requirements",
          "Preserve purchasing power against currency debasement"
        ],
        visualDescription: "Imagine carrying a bank in your pocket that works everywhere, never closes, can't be shut down by authorities, and gives you complete control over every transaction.",
        keyTakeaways: [
          "Financial sovereignty independent of institutions",
          "Censorship-resistant money for global freedom",
          "Accessible to anyone with internet connection",
          "Protection against monetary inflation and debasement"
        ]
      },
      "The Blockchain": {
        explanation: "A blockchain is a distributed ledger that maintains a continuously growing list of records (blocks) that are linked and secured using cryptography. Each block contains transaction data, a timestamp, and a cryptographic hash of the previous block, creating an unchangeable chain of transaction history.",
        examples: [
          "Every 10 minutes, a new block is added to the chain",
          "Each block references the previous block's hash",
          "Thousands of computers worldwide maintain identical copies",
          "Tampering with any block would break the entire chain"
        ],
        visualDescription: "Picture a digital ledger book where each page (block) is numbered and contains a unique fingerprint of the previous page. Changing any page would immediately reveal the tampering to everyone holding a copy.",
        keyTakeaways: [
          "Creates permanent, unchangeable transaction records",
          "Distributed across thousands of computers globally",
          "Uses cryptographic hashing for security",
          "Forms the foundation of Bitcoin's trustless system"
        ]
      },
      "Peer-to-Peer Network": {
        explanation: "Bitcoin operates on a peer-to-peer network where participants (nodes) connect directly with each other without intermediaries. This creates a resilient, decentralized system where no single point of failure can bring down the entire network.",
        examples: [
          "Over 15,000 nodes worldwide verify transactions",
          "No central server that can be shut down",
          "Each node maintains a complete copy of the blockchain",
          "Transactions propagate through the network in seconds"
        ],
        visualDescription: "Imagine a global web where every computer talks directly to others, sharing information instantly. No central hub exists - if some computers go offline, the network continues operating seamlessly.",
        keyTakeaways: [
          "Eliminates single points of failure",
          "Resistant to censorship and shutdowns",
          "Enables direct value transfer between users",
          "Creates trustless interaction through consensus"
        ]
      },
      "Cryptographic Security": {
        explanation: "Bitcoin uses advanced cryptographic techniques including SHA-256 hashing and elliptic curve digital signatures to secure transactions. These mathematical proofs make it computationally impossible to forge transactions or double-spend bitcoins.",
        examples: [
          "Private keys use 256-bit cryptography",
          "Each transaction has a unique digital signature",
          "Hash functions create unique 'fingerprints' for blocks",
          "Breaking Bitcoin's crypto would require more energy than the sun produces"
        ],
        visualDescription: "Think of cryptography as unbreakable mathematical locks. Your private key is the only key that can unlock your bitcoins, and the math behind it is so complex that even all the world's computers working together couldn't crack it.",
        keyTakeaways: [
          "Uses military-grade cryptographic security",
          "Mathematically impossible to counterfeit",
          "Each transaction is cryptographically signed",
          "Security increases with network growth"
        ]
      },
      "Inflation Protection": {
        explanation: "Bitcoin's fixed supply of 21 million coins provides protection against monetary inflation. Unlike fiat currencies that central banks can print indefinitely, Bitcoin's monetary policy is set in code and cannot be changed, preserving purchasing power over time.",
        examples: [
          "US dollar lost 96% of value since 1913 due to printing",
          "Bitcoin supply increases predictably and will cap at 21M",
          "Venezuelan bolívar lost 99% value in recent hyperinflation",
          "Bitcoin holders preserve wealth during currency crises"
        ],
        visualDescription: "Imagine a currency where the total amount is written in stone and can never be changed. While governments print more money and dilute value, Bitcoin remains mathematically scarce forever.",
        keyTakeaways: [
          "Fixed supply prevents monetary debasement",
          "Shields wealth from central bank policies",
          "Predictable monetary policy built into code",
          "Historical hedge against currency crises"
        ]
      },
      "24/7 Global Access": {
        explanation: "Bitcoin operates 24/7/365 without holidays, weekends, or banking hours. The network never sleeps, allowing instant global transactions at any time. This provides unprecedented access to financial services regardless of geography or time zones.",
        examples: [
          "Send money to Japan at 3 AM on Christmas",
          "Receive payments during bank holidays",
          "Access your funds from anywhere with internet",
          "No waiting for Monday morning to open accounts"
        ],
        visualDescription: "Picture a global ATM that's always open, in every country, that speaks every language and never closes for maintenance or holidays. That's Bitcoin's accessibility.",
        keyTakeaways: [
          "Never closes or goes offline",
          "Global access from any internet connection",
          "No geographical restrictions or borders",
          "Immediate settlement without waiting periods"
        ]
      },
      "No Censorship": {
        explanation: "Bitcoin transactions cannot be censored, reversed, or blocked by any authority. Once a transaction is included in the blockchain, it becomes permanent and irreversible. This provides true financial sovereignty and protection from authoritarian control.",
        examples: [
          "Journalists receiving donations in restrictive countries",
          "Protesters fundraising despite government opposition",
          "Businesses operating despite payment processor bans",
          "Individuals preserving wealth during capital controls"
        ],
        visualDescription: "Imagine money that works like cash but digitally - no one can stop you from spending it, no authority can freeze it, and no intermediary can block your transactions.",
        keyTakeaways: [
          "Transactions cannot be reversed or blocked",
          "No central authority can freeze accounts",
          "Enables free speech through financial freedom",
          "Protects against authoritarian monetary control"
        ]
      },
      "Proof of Work": {
        explanation: "Proof of Work is Bitcoin's consensus mechanism where miners compete to solve computational puzzles, proving they've expended real energy. This creates objective consensus without requiring trust in any central authority, making the network extremely secure.",
        examples: [
          "Miners spend electricity to earn the right to add blocks",
          "Network automatically adjusts difficulty every 2016 blocks",
          "Attacking Bitcoin would cost billions in energy",
          "More mining power means more network security"
        ],
        visualDescription: "Think of Proof of Work like a global lottery where buying tickets costs real electricity. The more tickets (computational work) you buy, the better chance of winning, but everyone can verify the winner is legitimate.",
        keyTakeaways: [
          "Secures network through energy expenditure",
          "Creates objective consensus without trust",
          "Makes attacks prohibitively expensive",
          "Difficulty adjusts to maintain security"
        ]
      },
      "Network Difficulty": {
        explanation: "Bitcoin's network difficulty automatically adjusts every 2,016 blocks (approximately two weeks) to maintain a consistent 10-minute average block time. This self-regulating mechanism ensures Bitcoin's predictable supply schedule regardless of mining participation.",
        examples: [
          "If more miners join, difficulty increases to slow down blocks",
          "If miners leave, difficulty decreases to speed up blocks",
          "Maintains 10-minute average regardless of hash rate",
          "Ensures predictable 21 million coin supply schedule"
        ],
        visualDescription: "Imagine a smart puzzle that automatically becomes harder when more people are solving it and easier when fewer people participate, always keeping the solution time at exactly 10 minutes.",
        keyTakeaways: [
          "Automatically maintains 10-minute block times",
          "Adjusts every 2,016 blocks (~2 weeks)",
          "Ensures predictable Bitcoin issuance",
          "Self-regulates regardless of mining participation"
        ]
      },
      "Bitcoin Wallets": {
        explanation: "Bitcoin wallets don't actually store Bitcoin - they store the private keys that control your Bitcoin on the blockchain. Think of wallets as key managers that prove ownership and enable spending of your Bitcoin.",
        examples: [
          "Hardware wallets store keys offline for security",
          "Mobile wallets enable convenient daily transactions",
          "Paper wallets are physical printouts of private keys",
          "Multi-signature wallets require multiple keys to spend"
        ],
        visualDescription: "A Bitcoin wallet is like a digital keychain that holds the cryptographic keys to your Bitcoin safe deposit boxes on the blockchain. The Bitcoin stays in the boxes; the wallet just holds your keys.",
        keyTakeaways: [
          "Wallets store private keys, not Bitcoin itself",
          "Different wallet types serve different security needs",
          "Private key ownership equals Bitcoin ownership",
          "Multiple wallet options provide flexibility"
        ]
      },
      "Private Keys": {
        explanation: "Private keys are secret 256-bit numbers that mathematically control your Bitcoin. They generate public keys and addresses, enable transaction signing, and provide ultimate ownership proof. Losing private keys means losing Bitcoin forever.",
        examples: [
          "Each private key controls specific Bitcoin addresses",
          "Private keys create unforgeable digital signatures",
          "Lost keys mean permanently lost Bitcoin",
          "12-24 word seed phrases back up private keys"
        ],
        visualDescription: "Think of a private key as the master key to an unbreakable digital safe. Anyone with this key can open the safe and take everything inside, but without it, the contents are lost forever.",
        keyTakeaways: [
          "Private keys provide absolute Bitcoin control",
          "Losing keys means losing Bitcoin permanently",
          "Never share private keys with anyone",
          "Secure backup is essential for recovery"
        ]
      },
      "Not Your Keys, Not Your Coins": {
        explanation: "This fundamental Bitcoin principle means that without controlling the private keys, you don't truly own your Bitcoin. Exchanges, custodial services, and third parties that hold your keys can freeze, seize, or lose your Bitcoin.",
        examples: [
          "Exchange bankruptcies resulting in lost customer funds",
          "Governments seizing exchange-held Bitcoin",
          "Frozen accounts preventing Bitcoin access",
          "Self-custody providing true ownership"
        ],
        visualDescription: "It's like keeping your gold in someone else's vault versus your own safe. You might have a receipt saying it's yours, but until you control the keys to your own safe, you're trusting others with your wealth.",
        keyTakeaways: [
          "True ownership requires private key control",
          "Third-party custody introduces counterparty risk",
          "Self-custody provides maximum security",
          "Exchanges are for trading, not long-term storage"
        ]
      },
      "How Transactions Work": {
        explanation: "Bitcoin transactions transfer value by spending previous transaction outputs. Each transaction is digitally signed with private keys, broadcast to the network, verified by nodes, and permanently recorded on the blockchain by miners.",
        examples: [
          "Alice signs a transaction spending her Bitcoin to Bob",
          "Network nodes verify Alice owns the Bitcoin",
          "Miners include the transaction in a new block",
          "Transaction becomes permanent after confirmation"
        ],
        visualDescription: "Imagine writing a digital check that instantly proves you have the money, can't be forged, and gets recorded in a global ledger that everyone can verify but no one can change.",
        keyTakeaways: [
          "Transactions transfer ownership through digital signatures",
          "Network verification ensures validity",
          "Blockchain provides permanent transaction record",
          "Process eliminates need for trusted intermediaries"
        ]
      },
      "Transaction Fees": {
        explanation: "Bitcoin transaction fees compensate miners for including transactions in blocks. Users can choose fee levels - higher fees get faster confirmation during busy periods, while lower fees may take longer but cost less.",
        examples: [
          "High fees during network congestion ensure fast confirmation",
          "Low fees during quiet periods save money",
          "Fee markets create economic efficiency",
          "Lightning Network enables ultra-low fee transactions"
        ],
        visualDescription: "Think of transaction fees like express mail pricing - you can pay more for faster delivery or pay less and wait longer. The network automatically processes highest-fee transactions first.",
        keyTakeaways: [
          "Fees incentivize miners to process transactions",
          "Users control fee levels based on urgency",
          "Fee markets create network efficiency",
          "Higher fees generally mean faster confirmation"
        ]
      },
      "Confirmation Times": {
        explanation: "Bitcoin confirmations represent how many blocks have been added after your transaction's block. Each confirmation exponentially reduces the risk of transaction reversal, with 6 confirmations considered fully secure for large amounts.",
        examples: [
          "1 confirmation: Transaction in latest block",
          "3 confirmations: Very unlikely to reverse",
          "6 confirmations: Considered fully final",
          "Zero-confirmation: Transaction broadcast but not mined"
        ],
        visualDescription: "Imagine each confirmation as another layer of concrete poured over your transaction. After 6 layers, it would take enormous effort to dig it up and change it.",
        keyTakeaways: [
          "More confirmations mean higher security",
          "6 confirmations considered fully secure",
          "Confirmation time varies with network congestion",
          "Large amounts should wait for multiple confirmations"
        ]
      },
      "Bitcoin Halving": {
        explanation: "Every 210,000 blocks (approximately 4 years), Bitcoin's mining reward is cut in half. This programmed scarcity reduces new Bitcoin supply over time, making existing Bitcoin more scarce and potentially more valuable.",
        examples: [
          "2009-2012: 50 BTC reward per block",
          "2012-2016: 25 BTC reward per block",
          "2016-2020: 12.5 BTC reward per block",
          "2020-2024: 6.25 BTC reward per block"
        ],
        visualDescription: "Imagine a gold mine that automatically produces half as much gold every four years. As production slows, existing gold becomes increasingly rare and valuable.",
        keyTakeaways: [
          "Occurs every 210,000 blocks (~4 years)",
          "Reduces new Bitcoin supply by 50%",
          "Creates increasing scarcity over time",
          "Built into Bitcoin's code and unchangeable"
        ]
      },
      "Fixed Supply Schedule": {
        explanation: "Bitcoin's monetary policy is completely predictable and unchangeable. New bitcoins are created on a fixed schedule that will result in exactly 21 million total bitcoins by approximately 2140, after which no new bitcoins will ever be created.",
        examples: [
          "Current supply increases by ~6.25 BTC every 10 minutes",
          "Supply growth rate decreases with each halving",
          "Final bitcoin will be mined around year 2140",
          "No central authority can change this schedule"
        ],
        visualDescription: "Picture a vending machine programmed to release coins on a fixed schedule that slows down over time until it's completely empty. No one can reprogram it or add more coins - ever.",
        keyTakeaways: [
          "Exactly 21 million bitcoins will ever exist",
          "Supply schedule is coded and unchangeable",
          "Predictable scarcity increases over time",
          "No inflation possible after 2140"
        ]
      },
      "Fiat Currency Problems": {
        explanation: "Fiat currencies are backed only by government decree and can be printed infinitely, leading to inflation and currency debasement. Historical data shows all fiat currencies eventually lose significant value or collapse entirely.",
        examples: [
          "US dollar lost 96% purchasing power since 1913",
          "Weimar Germany hyperinflation destroyed savings",
          "Venezuelan bolívar lost 99% value in recent years",
          "Over 3,000 fiat currencies have failed throughout history"
        ],
        visualDescription: "Imagine a currency where the government can photocopy money whenever it wants. Each copy reduces the value of every existing bill in your wallet.",
        keyTakeaways: [
          "Fiat currencies inevitably lose purchasing power",
          "Inflation is a hidden tax on savers",
          "Money printing benefits insiders at public expense",
          "Historical precedent shows fiat currencies fail"
        ]
      },
      "Digital Scarcity": {
        explanation: "Bitcoin achieves true digital scarcity for the first time in history. Unlike digital files that can be copied endlessly, Bitcoin uses cryptographic proof and network consensus to ensure each bitcoin exists only once and cannot be duplicated.",
        examples: [
          "Music files can be copied infinitely without cost",
          "Bitcoin transactions require cryptographic proof",
          "Double-spending is mathematically impossible",
          "Network consensus prevents counterfeiting"
        ],
        visualDescription: "Imagine digital gold that can't be photocopied, duplicated, or faked - each piece is unique and verifiable, just like physical scarcity but in the digital realm.",
        keyTakeaways: [
          "First solution to digital scarcity problem",
          "Uses cryptography to prevent duplication",
          "Network consensus ensures authenticity",
          "Creates genuine digital property rights"
        ]
      },
      "Banking Intermediaries": {
        explanation: "Traditional banking systems require trusted intermediaries who can freeze accounts, reverse transactions, and impose restrictions. Bitcoin eliminates intermediaries through cryptographic proof, giving users direct control over their money.",
        examples: [
          "Banks can freeze accounts without notice",
          "Payment processors can deny transactions",
          "International transfers require multiple intermediaries",
          "Bitcoin enables direct peer-to-peer transfers"
        ],
        visualDescription: "Imagine being able to hand cash directly to someone on the other side of the world instantly, without any bank, government, or company being able to stop or monitor the transaction.",
        keyTakeaways: [
          "Eliminates need for trusted third parties",
          "Users maintain direct control over funds",
          "Reduces counterparty risk and fees",
          "Enables true peer-to-peer transactions"
        ]
      },
      "Lightning Network": {
        explanation: "The Lightning Network is Bitcoin's layer-2 scaling solution that enables instant, low-cost transactions by creating payment channels between users. It maintains Bitcoin's security while dramatically improving transaction speed and reducing fees.",
        examples: [
          "Instant micropayments for streaming content",
          "Coffee purchases with sub-penny fees",
          "Cross-border remittances in seconds",
          "Gaming and social media tipping"
        ],
        visualDescription: "Imagine Bitcoin as a settlement layer like the banking system, and Lightning as cash transactions - instant, private, and cheap for daily use, but backed by the security of the main network.",
        keyTakeaways: [
          "Enables instant Bitcoin transactions",
          "Dramatically reduces transaction fees",
          "Maintains Bitcoin's security properties",
          "Unlocks Bitcoin for daily commerce"
        ]
      },
      "Financial Sovereignty": {
        explanation: "Bitcoin provides true financial sovereignty - complete control over your money without relying on banks, governments, or any third parties. Your private keys give you absolute ownership and the ability to transact freely.",
        examples: [
          "Access your money 24/7 without bank approval",
          "Send money internationally without restrictions",
          "Protect savings from currency devaluation",
          "Maintain privacy in financial transactions"
        ],
        visualDescription: "Imagine being your own bank - you control every aspect of your money, from storage to spending, without needing anyone's permission or facing any restrictions.",
        keyTakeaways: [
          "Complete control over personal finances",
          "Independence from traditional banking",
          "Protection from monetary authoritarianism",
          "True ownership through private keys"
        ]
      }
    };
    return undefined; // Content now comes from storage only
  };

  const toggleTopicExpansion = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const updateTransactionInput = (field: string, value: string) => {
    setTransactionInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTransactionFee = () => {
    const currentFee = getCurrentFee();
    return currentFee.cost;
  };

  const simulatePasteFromClipboard = () => {
    const clipboardSources = [
      { source: "Mobile Wallet", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" },
      { source: "Hardware Wallet", address: "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4" },
      { source: "Exchange Withdrawal", address: "bc1qrp33g8q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3" },
      { source: "Lightning Address", address: "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy" },
      { source: "Friend's Wallet", address: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2" }
    ];
    const randomClipboard = clipboardSources[Math.floor(Math.random() * clipboardSources.length)];
    
    // Simulate realistic paste behavior with brief delay
    setTimeout(() => {
      setTransactionInputs(prev => ({ ...prev, toAddress: randomClipboard.address }));
      // Show a brief toast-like notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-orange-800 text-orange-100 px-4 py-2 rounded-lg text-sm z-50 transition-opacity';
      notification.textContent = `Pasted from ${randomClipboard.source}`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 2000);
    }, 100);
  };

  const generateTransactionId = () => {
    return Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
  };

  const proceedToPreview = () => {
    setTransactionState("preview");
  };

  const startSigning = () => {
    // Validate that To Address is filled before proceeding
    if (!transactionInputs.toAddress || transactionInputs.toAddress.trim() === '') {
      toast({
        title: "Missing Required Information",
        description: "Please enter a Bitcoin address in the 'To Address' field before signing the transaction.",
        variant: "destructive",
      });
      return;
    }
    
    setTransactionState("signing");
    setShowTransactionApproval(true);
  };

  const cancelTransaction = () => {
    setTransactionState("building");
    setShowTransactionApproval(false);
    setConfirmationCount(0);
    setTimeRemaining(120);
    setTransactionId("");
  };

  const getCurrentFee = () => {
    const fee = feeOptions[transactionInputs.feeRate as keyof typeof feeOptions];
    return fee || feeOptions.standard;
  };

  const getTransactionTotal = () => {
    const amount = parseFloat(transactionInputs.amount) || 0;
    const fee = parseFloat(getCurrentFee().cost) || 0;
    return (amount + fee).toFixed(8);
  };

  const getUSDValue = (btcAmount: string) => {
    const amount = parseFloat(btcAmount) || 0;
    return (amount * 95000).toFixed(2);
  };

  const approveTransaction = () => {
    setShowTransactionApproval(false);
    setTransactionState("broadcasting");
    setTransactionId(generateTransactionId());
    setTransactionJourney("broadcast");
    
    // Step 1: Broadcasting to network (3 seconds)
    setTimeout(() => {
      setTransactionJourney("mempool");
      
      // Step 2: Mempool queue (5 seconds)
      setTimeout(() => {
        setTransactionState("confirming");
        setTransactionJourney("confirming");
        setConfirmationCount(0);
        setTimeRemaining(45);
        
        // Step 3: Confirmation progression (37 seconds total)
        const confirmationInterval = setInterval(() => {
          setConfirmationCount(prev => {
            const newCount = prev + 1;
            if (newCount >= 6) {
              clearInterval(confirmationInterval);
              // Step 4: Final settlement
              setTimeout(() => {
                setTransactionJourney("settled");
                setTransactionState("confirmed");
                
                // Reset after showing final confirmation
                setTimeout(() => {
                  setTransactionState("building");
                  setConfirmationCount(0);
                  setTimeRemaining(45);
                  setTransactionId("");
                  setTransactionJourney("broadcast");
                }, 5000);
              }, 1000);
            }
            return newCount;
          });
          
          setTimeRemaining(prev => Math.max(0, prev - 6));
        }, 6000); // New confirmation every 6 seconds (6x6=36 seconds)
        
      }, 5000);
    }, 3000);
  };

  const calculateHodlStrategy = () => {
    const bitcoinAmount = hodlInputs.initialAmount / hodlInputs.startPrice;
    const currentValue = bitcoinAmount * hodlInputs.endPrice;
    const totalGain = currentValue - hodlInputs.initialAmount;
    const percentageReturn = (totalGain / hodlInputs.initialAmount) * 100;
    const annualReturn = Math.pow(hodlInputs.endPrice / hodlInputs.startPrice, 1/hodlInputs.years) - 1;



    // Validate percentage calculation for accuracy
    const validatedPercentageReturn = Math.round(((hodlInputs.endPrice / hodlInputs.startPrice - 1) * 100) * 10) / 10;
    

    
    setHodlResults({
      initialInvestment: hodlInputs.initialAmount,
      bitcoinAmount,
      startPrice: hodlInputs.startPrice,
      endPrice: hodlInputs.endPrice,
      currentValue,
      totalGain,
      percentageReturn: validatedPercentageReturn, // Use validated calculation
      annualReturn: annualReturn * 100
    });
  };

  const calculateDcaStrategy = () => {
    const { monthlyAmount, frequency, startDate } = dcaInputs;
    
    // Validate inputs
    const validAmount = Number(monthlyAmount) || 100;
    if (!startDate || !frequency) return;
    
    // Calculate duration from start date to January 2025 (present)
    const startDateObj = new Date(startDate);
    const endDate = new Date('2025-01-27'); // Current date
    const durationYears = Math.max(0.1, (endDate.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
    
    // Calculate frequency multiplier and total purchases
    const frequencyMap = { 
      daily: 365, 
      weekly: 52, 
      biweekly: 26, 
      monthly: 12, 
      quarterly: 4 
    };
    const purchasesPerYear = frequencyMap[frequency];
    const totalPurchases = Math.max(1, Math.floor(durationYears * purchasesPerYear));
    
    // Fix purchase amount calculation - validAmount should be what they invest per frequency period
    const purchaseAmount = validAmount; // Simple: whatever amount they specify, they invest that often at the chosen frequency
    
    // Get historically accurate Bitcoin prices for January each year
    const getStartingPrice = (startDate: string) => {
      if (startDate.includes('2009-01')) return 0.001; // Bitcoin launch - first recorded price
      if (startDate.includes('2010-01')) return 0.10;  // Very early adoption
      if (startDate.includes('2011-01')) return 0.30;  // Before $1 breakthrough
      if (startDate.includes('2012-01')) return 5.00;  // Recovery from 2011 crash
      if (startDate.includes('2013-01')) return 13.00; // Start of first major bull run
      if (startDate.includes('2014-01')) return 732;   // Coming off 2013 peak
      if (startDate.includes('2015-01')) return 315;   // Bear market after Mt. Gox
      if (startDate.includes('2016-01')) return 430;   // Slow recovery begins
      if (startDate.includes('2017-01')) return 1000;  // Watershed year beginning
      if (startDate.includes('2018-01')) return 14000; // Near 2017 peak of $20k
      if (startDate.includes('2019-01')) return 3700;  // Deep bear market bottom
      if (startDate.includes('2020-01')) return 7200;  // Pre-COVID institutional adoption
      if (startDate.includes('2021-01')) return 29000; // Bull run in progress
      if (startDate.includes('2022-01')) return 47000; // Near all-time highs
      if (startDate.includes('2023-01')) return 16530; // Recovery from 2022 crash
      if (startDate.includes('2024-01')) return 42000; // ETF approval momentum
      return 35000; // Default fallback
    };
    
    const startingPrice = Math.max(0.001, getStartingPrice(startDate)); // Minimum price protection
    const purchases = [];
    let totalInvested = 0;
    let totalBitcoin = 0;
    
    // Use current Bitcoin price (January 2025)
    const currentBitcoinPrice = 95000; // Current Bitcoin price January 2025
    
    // Calculate mathematically accurate growth rate with safety checks
    const totalGrowthRatio = currentBitcoinPrice / startingPrice;
    const annualGrowthRate = Math.max(1, Math.pow(totalGrowthRatio, 1/durationYears)); // Ensure positive growth
    
    // Generate Bitcoin price progression with simple, reliable calculation
    for (let i = 0; i < totalPurchases; i++) {
      const timeProgress = totalPurchases > 1 ? i / (totalPurchases - 1) : 0;
      
      // Simple exponential growth from start price to current price
      const priceAtTime = startingPrice * Math.pow(currentBitcoinPrice / startingPrice, timeProgress);
      
      // Add modest volatility (±15%) for realism, but keep it stable for consistent results
      const volatilityFactor = 0.9 + (Math.sin(i * 0.5) * 0.2); // Deterministic volatility based on purchase index
      const currentPrice = Math.max(startingPrice * 0.1, priceAtTime * volatilityFactor);
      
      const bitcoinPurchased = purchaseAmount / currentPrice;
      
      totalInvested += purchaseAmount;
      totalBitcoin += bitcoinPurchased;
      
      purchases.push({
        index: i,
        timeProgress,
        price: Math.round(currentPrice),
        amount: purchaseAmount,
        bitcoinPurchased,
        totalInvested,
        totalBitcoin,
        runningAvgCost: totalInvested / totalBitcoin
      });
    }
    
    const averagePrice = totalBitcoin > 0 ? totalInvested / totalBitcoin : 0;
    const currentValue = totalBitcoin * currentBitcoinPrice;
    const totalGain = currentValue - totalInvested;
    const percentageReturn = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;
    
    // Calculations complete
    
    setDcaResults({
      totalInvested,
      totalBitcoin,
      averagePrice,
      currentValue,
      totalGain,
      percentageReturn,
      duration: durationYears,
      purchases // Include purchase data for accurate charting
    });
  };

  // Auto-calculate DCA results when inputs change
  useEffect(() => {
    calculateDcaStrategy();
  }, [dcaInputs.monthlyAmount, dcaInputs.frequency, dcaInputs.startDate]);

  // Auto-calculate HODL results when inputs change
  useEffect(() => {
    if (hodlInputs.startPrice && hodlInputs.endPrice && hodlInputs.initialAmount) {
      calculateHodlStrategy();
    }
  }, [hodlInputs.startPrice, hodlInputs.endPrice, hodlInputs.initialAmount, hodlInputs.years]);

  const [selectedWalletType, setSelectedWalletType] = useState<string | null>(null);
  
  // Safety Simulator State
  const [safetyStage, setSafetyStage] = useState(0);
  const [safetyScore, setSafetyScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [safetyCompleted, setSafetyCompleted] = useState(false);

  // Comprehensive 12-Stage Safety Simulation Data
  const safetySimulations = [
    {
      stage: "Phishing Detection",
      title: "Spot the Phishing Email",
      description: "Can you identify the dangerous email that's trying to steal your Bitcoin?",
      emails: [
        {
          from: "security@binance.com",
          subject: "Account Security Alert - Action Required",
          preview: "We noticed unusual activity on your account. Click here to verify your identity immediately or your account will be suspended.",
          isPhishing: true,
          redFlags: ["Urgency tactics", "Suspicious domain", "Threatening suspension"]
        },
        {
          from: "noreply@coinbase.com", 
          subject: "Your Weekly Portfolio Summary",
          preview: "Here's your portfolio performance for the week ending January 27, 2025. Your Bitcoin holdings are up 3.2%.",
          isPhishing: false,
          redFlags: []
        },
        {
          from: "support@electrum.org",
          subject: "Critical Security Update Required",
          preview: "Download our urgent security patch at electrum-update[.]net to protect your wallet from new vulnerabilities.",
          isPhishing: true,
          redFlags: ["Fake domain", "Malicious download link", "Impersonation"]
        }
      ]
    },
    {
      stage: "Seed Phrase Security",
      title: "Protect Your Seed Phrase",
      description: "You just generated a new Bitcoin wallet. Where should you store your 12-word recovery phrase?",
      scenario: "apple bacon chair dog eagle five grape happy ice jelly king lemon",
      options: [
        {
          method: "Screenshot on phone",
          safe: false
        },
        {
          method: "Write on paper, store in safe",
          safe: true
        },
        {
          method: "Save in password manager",
          safe: true
        },
        {
          method: "Memorize only",
          safe: false
        }
      ]
    },
    {
      stage: "Address Verification", 
      title: "🎯 Verify Bitcoin Address",
      description: "Compare these two addresses carefully before sending:",
      copied: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      displayed: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0w1h",
      options: [
        { text: "Addresses match exactly", correct: false },
        { text: "Addresses are different", correct: true },
        { text: "Close enough", correct: false },
        { text: "First 10 characters match", correct: false }
      ]
    },
    {
      stage: "Scam Recognition",
      title: "🚨 Spot the Bitcoin Scam", 
      description: "Click on the legitimate (safe) message - avoid the scams!",
      scenarios: [
        {
          message: "Elon Musk is giving away Bitcoin! Send 0.1 BTC to get 1 BTC back! Limited time offer!",
          isScam: true,
          tactics: ["Impersonation", "Too good to be true", "Urgency", "Upfront payment required"]
        },
        {
          message: "Your local Bitcoin meetup is next Thursday at 7 PM. Bring questions and let's learn together!",
          isScam: false,
          tactics: []
        },
        {
          message: "I'm a prince who needs help moving my Bitcoin fortune. I'll share 50% if you help with transaction fees.",
          isScam: true,
          tactics: ["Classic advance fee fraud", "Unrealistic returns", "Emotional manipulation"]
        }
      ],
      explanation: "The Bitcoin meetup message is legitimate and safe - it's just an educational gathering. The other two are classic scams: the 'Elon giveaway' uses celebrity impersonation and impossible returns, while the 'prince' message is a traditional advance fee fraud adapted for Bitcoin."
    },
    {
      stage: "Exchange Security",
      title: "🏪 Exchange Safety Check",
      description: "You want to buy Bitcoin. Which exchange should you choose?",
      options: [
        {
          method: "Brand new exchange offering 50% signup bonus",
          safe: false
        },
        {
          method: "Well-known exchange like Coinbase or Kraken",
          safe: true
        },
        {
          method: "Random exchange found through Google ads",
          safe: false
        },
        {
          method: "Exchange recommended in a Telegram group",
          safe: false
        }
      ]
    },
    {
      stage: "WiFi Security",
      title: "📶 Public WiFi Warning",
      description: "You're at a coffee shop and want to check your Bitcoin wallet. What should you do?",
      options: [
        {
          method: "Connect to free public WiFi and log in normally",
          safe: false
        },
        {
          method: "Use your phone's mobile data instead",
          safe: true
        },
        {
          method: "Use public WiFi but only check prices, not access wallet",
          safe: true
        },
        {
          method: "Connect through a VPN on public WiFi",
          safe: true
        }
      ]
    },
    {
      stage: "Software Downloads",
      title: "💾 Safe Wallet Downloads",
      description: "You need to download a Bitcoin wallet. Where should you get it?",
      options: [
        {
          method: "Google search and click the first result",
          safe: false
        },
        {
          method: "Official website directly (electrum.org, bitcoin.org)",
          safe: true
        },
        {
          method: "Download from a Bitcoin forum recommendation",
          safe: false
        },
        {
          method: "Official app store or Google Play Store",
          safe: true
        }
      ]
    },
    {
      stage: "Social Engineering",
      title: "🎭 Social Engineering Defense",
      description: "Someone calls claiming to be from your exchange, asking for your 2FA code. What do you do?",
      options: [
        {
          method: "Give them the code since they knew my email",
          safe: false
        },
        {
          method: "Hang up and call the exchange directly",
          safe: true
        },
        {
          method: "Ask them to verify my account details first",
          safe: false
        },
        {
          method: "Tell them to email me instead",
          safe: false
        }
      ]
    },
    {
      stage: "Hardware Wallet",
      title: "🔧 Hardware Wallet Safety",
      description: "You want to buy a hardware wallet for storing Bitcoin. What's the SAFEST approach?",
      options: [
        {
          method: "Buy used on eBay to save money",
          safe: false
        },
        {
          method: "Buy new directly from the official manufacturer website",
          safe: true
        },
        {
          method: "Buy from Amazon third-party seller",
          safe: false
        },
        {
          method: "Buy from local computer store",
          safe: false
        }
      ]
    },
    {
      stage: "Backup Testing",
      title: "💾 Backup Verification",
      description: "You wrote down your seed phrase. How should you verify it's correct?",
      options: [
        {
          method: "Wait until you need to restore the wallet",
          safe: false
        },
        {
          method: "Test restore on a separate device or wallet",
          safe: true
        },
        {
          method: "Take a photo of the seed phrase as backup",
          safe: false
        },
        {
          method: "Share with trusted family member to verify",
          safe: false
        }
      ]
    },
    {
      stage: "Transaction Fees",
      title: "💰 Fee Manipulation",
      description: "You're sending $50 worth of Bitcoin. Your wallet suggests a $200 fee, but you checked other sources and normal fees are $2. What should you do?",
      options: [
        {
          method: "Pay the $200 fee since the wallet knows best",
          safe: false
        },
        {
          method: "Never use this wallet again - it might be malicious",
          safe: true
        },
        {
          method: "Try sending anyway with the high fee",
          safe: false
        },
        {
          method: "Ignore the fee warning and send anyway",
          safe: false
        }
      ]
    },
    {
      stage: "Recovery Scams", 
      title: "🔍 Recovery Service Warning",
      description: "You lost access to your wallet. Someone offers to recover it for 50% of the funds. What should you do?",
      options: [
        {
          method: "Agree since 50% is better than 0%",
          safe: false
        },
        {
          method: "Ask for references and research the company",
          safe: false
        },
        {
          method: "Decline and try to recover yourself",
          safe: true
        },
        {
          method: "Negotiate for a lower percentage",
          safe: false
        }
      ]
    }
  ];

  const currentSimulation = safetySimulations[safetyStage];

  const handleSafetyAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setShowResult(true);
    
    // Calculate score based on stage with comprehensive validation
    let correct = false;
    const simulation = safetySimulations[safetyStage];
    
    if (!simulation) {
      console.error(`Invalid stage: ${safetyStage}`);
      return;
    }
    
    try {
      switch (safetyStage) {
        case 0: // Phishing Detection
          if (simulation.emails && simulation.emails[optionIndex]) {
            correct = simulation.emails[optionIndex].isPhishing === true;
          }
          break;
          
        case 2: // Address Verification
          if (simulation.options && simulation.options[optionIndex]) {
            const option = simulation.options[optionIndex];
            correct = 'correct' in option ? option.correct === true : false;
          }
          break;
          
        case 3: // Scam Recognition
          if (simulation.scenarios && simulation.scenarios[optionIndex]) {
            correct = simulation.scenarios[optionIndex].isScam === false;
          }
          break;
          
        case 1:  // Seed Phrase Security
        case 4:  // Exchange Security  
        case 5:  // WiFi Security
        case 6:  // Software Downloads
        case 7:  // Social Engineering
        case 8:  // Hardware Wallet
        case 9:  // Backup Testing
        case 10: // Transaction Fees
        case 11: // Recovery Scams
          if (simulation.options && simulation.options[optionIndex]) {
            const option = simulation.options[optionIndex];
            correct = 'safe' in option ? option.safe === true : false;
          }
          break;
          
        default:
          console.error(`Unhandled stage: ${safetyStage}`);
          break;
      }
      
    } catch (error) {
      console.error('Safety simulation validation error:', error, simulation);
      correct = false;
    }
    
    if (correct) setSafetyScore(prev => prev + 1);
  };

  const nextSafetyStage = () => {
    if (safetyStage < safetySimulations.length - 1) {
      setSafetyStage(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setSafetyCompleted(true);
    }
  };

  const resetSafetySimulator = () => {
    setSafetyStage(0);
    setSafetyScore(0);
    setSelectedOption(null);
    setShowResult(false);
    setSafetyCompleted(false);
  };
  
  const safetyQuestions = [
    {
      question: "What should you NEVER share with anyone?",
      options: ["Your Bitcoin address", "Your private key", "Your transaction history", "Your wallet software"],
      correct: 1,
      explanation: "Your private key gives complete control over your Bitcoin. Never share it with anyone."
    },
    {
      question: "What's the safest way to store large amounts of Bitcoin?",
      options: ["Mobile wallet", "Exchange", "Hardware wallet", "Web wallet"],
      correct: 2,
      explanation: "Hardware wallets keep your private keys offline and are the most secure for large amounts."
    },
    {
      question: "How should you backup your seed phrase?",
      options: ["Take a photo", "Save in cloud storage", "Write on paper", "Email to yourself"],
      correct: 2,
      explanation: "Write your seed phrase on paper and store it in a secure physical location."
    },
    {
      question: "How many words are typically in a Bitcoin seed phrase?",
      options: ["8 words", "12 or 24 words", "16 words", "32 words"],
      correct: 1,
      explanation: "Most Bitcoin wallets use either 12 or 24-word seed phrases following the BIP39 standard."
    },
    {
      question: "What does 'Not your keys, not your coins' mean?",
      options: ["Hardware is expensive", "Exchanges are unsafe", "Self-custody gives you control", "Bitcoin is complicated"],
      correct: 2,
      explanation: "If you don't control the private keys, you don't truly own the Bitcoin. Self-custody means you control your keys."
    },
    {
      question: "What is a 'hot wallet'?",
      options: ["A wallet that's overheating", "A wallet connected to internet", "A popular wallet brand", "A wallet with high fees"],
      correct: 1,
      explanation: "A hot wallet is connected to the internet, making it convenient but potentially less secure than cold storage."
    },
    {
      question: "What is the biggest risk of keeping Bitcoin on an exchange?",
      options: ["High fees", "Slow transactions", "Exchange could be hacked or fail", "Limited features"],
      correct: 2,
      explanation: "Exchanges can be hacked, go bankrupt, or freeze accounts. You don't control the private keys when using exchanges."
    }
  ];

  const walletTypes = [
    {
      name: "Hardware Wallet",
      security: "Highest",
      convenience: "Medium",
      cost: "$50-200",
      bestFor: "Long-term storage (HODLing)",
      pros: ["Private keys never touch internet", "Immune to computer viruses", "Physical transaction confirmation", "Backup seed phrase"],
      cons: ["Initial cost", "Can be lost/damaged", "Less convenient for daily use"],
      examples: ["Ledger Nano X", "Trezor Model T", "Coldcard"],
      description: "Physical devices that store private keys offline. Most secure option for large amounts."
    },
    {
      name: "Mobile Wallet",
      security: "Medium",
      convenience: "Highest", 
      cost: "Free",
      bestFor: "Daily transactions and small amounts",
      pros: ["Always with you", "Easy to use", "Quick payments", "QR code scanning"],
      cons: ["Vulnerable to phone theft", "App could have bugs", "Limited backup options"],
      examples: ["Blue Wallet", "Electrum Mobile", "Phoenix"],
      description: "Apps on your smartphone for convenient Bitcoin payments and small amount storage."
    },
    {
      name: "Desktop Wallet",
      security: "Medium-High",
      convenience: "Medium",
      cost: "Free",
      bestFor: "Regular use with moderate security",
      pros: ["Full control of keys", "Advanced features", "No third party dependence", "Good privacy"],
      cons: ["Computer viruses risk", "Requires backups", "Technical knowledge needed"],
      examples: ["Electrum", "Bitcoin Core", "Sparrow"],
      description: "Software installed on your computer giving you full control over your Bitcoin."
    },
    {
      name: "Exchange Wallet",
      security: "Lowest",
      convenience: "High",
      cost: "Free (but not your keys)",
      bestFor: "Trading only, not storage",
      pros: ["Easy to get started", "No technical knowledge needed", "Built-in buying/selling"],
      cons: ["Not your keys, not your coins", "Can be hacked", "Account can be frozen", "No privacy"],
      examples: ["Coinbase", "Binance", "Kraken"],
      description: "Wallets provided by exchanges. Convenient but you don't control the private keys."
    }
  ];

  // API Queries - using currentDayIndex for testing
  const { data: dayMetadata } = useQuery({
    queryKey: ['/api/day-metadata', currentDayIndex],
    queryFn: () => fetch(`/api/day-metadata/${currentDayIndex}`).then(res => res.json()),
  });

  const { data: dailyFacts } = useQuery({
    queryKey: ['/api/daily-facts', currentDayIndex],
    queryFn: () => fetch(`/api/daily-facts/${currentDayIndex}`).then(res => res.json()),
  });

  const { data: lesson } = useQuery({
    queryKey: ['/api/lesson', currentDayIndex], 
    queryFn: async () => {
      const response = await fetch(`/api/lesson/${currentDayIndex}`);
      if (!response.ok) {
        return null; // Return null for missing lessons instead of throwing error
      }
      return response.json();
    },
  });

  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ['/api/user'],
  });

  // Show splash screen during initial loading or when explicitly requested
  useEffect(() => {
    if (userLoading) {
      setShowSplash(true);
    } else {
      // Keep splash for minimum 1 second for branding, then hide
      const timer = setTimeout(() => setShowSplash(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [userLoading]);



  // Splash Screen
  if (showSplash) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-6 transform rotate-3 animate-pulse">
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-white">HL</span>
              </div>
            </div>
            <div className="absolute -inset-6 bg-orange-400/15 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-white">HODLearn</h1>
            <p className="text-zinc-400 text-lg">Loading your conviction</p>
            <div className="flex justify-center">
              <div className="text-xs text-zinc-500 bg-zinc-800/50 px-3 py-1 rounded-full">
                Learn • HODL • Repeat
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
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
                  <h1 className="text-xl font-bold">HODLearn</h1>
                  <p className="text-xs text-zinc-400">How-to-learn BTC</p>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              {/* PWA Install Button */}
              <PWAInstallButton />
              
              {/* Premium Status Indicator */}
              {isPremiumTier ? (
                <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500 px-2.5 py-1.5 font-medium">
                  <Gem className="w-4 h-4" />
                  <span className="sr-only">Premium</span>
                </Badge>
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



      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Home Section */}
        {activeSection === "home" && (
          <HomeSection 
            user={user}
            currentDayIndex={currentDayIndex}
            dayMetadata={dayMetadata}
            dailyFacts={dailyFacts}
            setActiveSection={setActiveSection}
          />
        )}

        {/* Learn Section - Extracted to LearnPage.tsx */}
        {activeSection === "learn" && (
          <LearnPage />
        )}

        {/* Finance Section - Extracted to FinancePage.tsx */}
        {activeSection === "money" && (
          <FinancePage />
        )}

        {/* Practice Section */}
        {activeSection === "simulations" && (
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
                        • 7 Interactive Security Tests
                        • Real Phishing Examples  
                        • Best Practice Checklist
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
                        <CreditCard className="w-6 h-6 text-orange-400" />
                        <h4 className="font-semibold text-white">Transaction Builder</h4>
                      </div>
                      <p className="text-zinc-400 text-sm mb-3">
                        Build, sign, and broadcast Bitcoin transactions with real-time confirmation tracking.
                      </p>
                      <div className="text-xs text-zinc-500">
                        • Step-by-step Transaction Building
                        • Fee Selection & Optimization
                        • Hardware Wallet Simulation
                      </div>
                    </CardContent>
                  </Card>

                  {/* HODL Strategy Preview */}
                  <Card className="bg-zinc-900/50 border-zinc-700 opacity-60 relative">
                    <div className="absolute top-2 right-2">
                      <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded">Premium</div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <TrendingUp className="w-6 h-6 text-orange-400" />
                        <h4 className="font-semibold text-white">HODL Challenge</h4>
                      </div>
                      <p className="text-zinc-400 text-sm mb-3">
                        Compare Bitcoin holding strategies across real historical periods vs traditional assets.
                      </p>
                      <div className="text-xs text-zinc-500">
                        • 3 Historical Scenarios
                        • Real Market Data
                        • Multi-Asset Comparisons
                      </div>
                    </CardContent>
                  </Card>

                  {/* DCA Calculator Preview */}
                  <Card className="bg-zinc-900/50 border-zinc-700 opacity-60 relative">
                    <div className="absolute top-2 right-2">
                      <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded">Premium</div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <BarChart3 className="w-6 h-6 text-orange-400" />
                        <h4 className="font-semibold text-white">DCA Calculator</h4>
                      </div>
                      <p className="text-zinc-400 text-sm mb-3">
                        Backtest Dollar-Cost Averaging strategies with authentic Bitcoin price history.
                      </p>
                      <div className="text-xs text-zinc-500">
                        • 15+ Years Historical Data
                        • Customizable Frequency
                        • Visual Performance Charts
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
                        • Real-time Animations
                        • 50+ Years Historical Data
                        • Visual Money Destruction
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
                        • Weekend Banking Delays
                        • Real Fee Calculations
                        • Side-by-Side Comparison
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center">
                  <Button 
                    onClick={() => setShowEmailModal(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                  >
                    Unlock All 6 Simulators - FREE
                  </Button>
                </div>
              </div>
            )}

            {/* Practice Sub-navigation - Only show for premium users */}
            {isPremiumTier && (
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
                  Transactions
                </Button>
                <Button
                  variant={simulationsSubTab === "transfer" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSimulationsSubTab("transfer")}
                  className="text-xs px-3 py-1"
                >
                  <ArrowRight className="w-3 h-3 mr-1" />
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
                  <BarChart3 className="w-3 h-3 mr-1" />
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

            {/* Wallet Explorer - Extracted to WalletSimulator component */}
            {simulationsSubTab === "wallet" && (
              <WalletSimulator />
            )}

            {/* OLD WALLET SECTION - TO BE REMOVED */}
            {false && isPremiumTier && simulationsSubTab === "wallet" && (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold text-white">Interactive Wallet Explorer</h3>
                  <p className="text-zinc-400">Understand Bitcoin wallets and choose the right storage solution for your needs</p>
                </div>

                {/* Why Wallet Choice Matters Introduction */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-orange-600/20 rounded-lg">
                        <Wallet className="w-6 h-6 text-orange-400" />
                      </div>
                      <h4 className="text-xl font-bold text-white">Your Wallet Choice Shapes Your Bitcoin Experience</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-zinc-300 leading-relaxed">
                        Your Bitcoin wallet is more than just storage - it's your gateway to financial sovereignty. 
                        Unlike traditional banks that hold your money, Bitcoin wallets give you direct control over your private keys, 
                        making you the sole owner of your wealth.
                      </p>
                      
                      <div className="bg-zinc-800/50 rounded-lg p-4 border-l-4 border-orange-500">
                        <p className="text-zinc-300 text-sm">
                          <span className="font-semibold text-orange-300">Complete Learning Path:</span> This page covers everything you need to master Bitcoin wallets - 
                          from choosing the right type for your needs to practicing emergency recovery scenarios that could save your Bitcoin.
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-semibold text-white">What You'll Master Here:</h5>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <Smartphone className="w-5 h-5 text-orange-400" />
                            <div>
                              <p className="font-medium text-white text-sm">Wallet Type Comparison</p>
                              <p className="text-zinc-400 text-xs">Mobile, desktop, hardware, and exchange wallets</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <Shield className="w-5 h-5 text-orange-400" />
                            <div>
                              <p className="font-medium text-white text-sm">Security Best Practices</p>
                              <p className="text-zinc-400 text-xs">Protect your Bitcoin from common threats</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <KeyRound className="w-5 h-5 text-orange-400" />
                            <div>
                              <p className="font-medium text-white text-sm">Recovery Simulation</p>
                              <p className="text-zinc-400 text-xs">Practice wallet recovery in emergency scenarios</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <Target className="w-5 h-5 text-orange-400" />
                            <div>
                              <p className="font-medium text-white text-sm">Use Case Guidance</p>
                              <p className="text-zinc-400 text-xs">Find the perfect wallet for your Bitcoin amount</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                          onClick={() => {
                            const explorer = document.querySelector('[data-wallet-explorer]');
                            if (explorer) {
                              explorer.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 flex-1"
                        >
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Explore Wallet Types
                        </Button>
                        <Button
                          onClick={() => {
                            const simulator = document.querySelector('[data-seed-phrase-simulator]');
                            if (simulator) {
                              simulator.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          variant="outline"
                          className="border-orange-600 text-orange-300 hover:bg-orange-600/10 px-6 py-2 flex-1"
                        >
                          <KeyRound className="w-4 h-4 mr-2" />
                          Practice Recovery
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Wallet Definition */}
                <Card className="bg-zinc-900 border-zinc-800" data-wallet-explorer>
                  <CardContent className="p-6">
                    <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 mb-6">
                      <p className="text-zinc-300 text-sm leading-relaxed mb-3">
                        <span className="font-semibold text-white">Bitcoin wallets</span> are software or hardware tools that store your private keys—the secret codes that prove you own your Bitcoin. Unlike a physical wallet that holds cash, Bitcoin wallets don't actually store Bitcoin itself. Instead, they manage the cryptographic keys that give you access to your Bitcoin on the blockchain.
                      </p>
                      <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                        <span className="font-semibold text-orange-300">Why this matters:</span> Your choice of wallet directly impacts your security, convenience, and true ownership of Bitcoin. Different wallet types offer different trade-offs between security and ease of use, making it crucial to understand your options before storing any Bitcoin.
                      </p>
                      <div className="flex justify-center">
                        <Button
                          onClick={() => setActiveSection('more')}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 text-sm"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Shop Recommended Hardware Wallets
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-zinc-400 text-sm mb-6">Click on any wallet type below to learn detailed information</p>
                    
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 mb-6">
                      {walletTypes.map((wallet, index) => (
                        <Button
                          key={index}
                          variant={selectedWalletType === wallet.name ? "default" : "outline"}
                          className={`p-4 h-auto flex-col items-start ${
                            selectedWalletType === wallet.name 
                              ? "bg-orange-600 border-orange-500 text-white" 
                              : "border-zinc-700 text-zinc-300 hover:border-orange-500"
                          }`}
                          onClick={() => setSelectedWalletType(wallet.name)}
                        >
                          <div className="w-full text-left">
                            <h5 className="font-medium mb-1">{wallet.name}</h5>
                            <p className="text-xs opacity-80">Security: {wallet.security}</p>
                            <p className="text-xs opacity-80">Cost: {wallet.cost}</p>
                          </div>
                        </Button>
                      ))}
                    </div>

                    {/* Detailed Wallet Information */}
                    {selectedWalletType && (
                      <div className="space-y-4 border-t border-zinc-700 pt-4">
                        {(() => {
                          const selectedWallet = walletTypes.find(w => w.name === selectedWalletType)!;
                          return (
                            <div className="space-y-4">
                              <div className="bg-zinc-800/50 rounded-lg p-4">
                                <h5 className="font-medium text-white mb-2">{selectedWallet.name} Overview</h5>
                                <p className="text-zinc-300 text-sm mb-3">{selectedWallet.description}</p>
                                
                                <div className="grid gap-3 md:grid-cols-3 mb-4">
                                  <div className="text-center">
                                    <p className="text-zinc-400 text-xs">Security Level</p>
                                    <p className={`font-medium ${
                                      selectedWallet.security === "Highest" ? "text-green-400" :
                                      selectedWallet.security === "Medium-High" ? "text-blue-400" :
                                      selectedWallet.security === "Medium" ? "text-yellow-400" : "text-red-400"
                                    }`}>{selectedWallet.security}</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-zinc-400 text-xs">Convenience</p>
                                    <p className={`font-medium ${
                                      selectedWallet.convenience === "Highest" ? "text-green-400" :
                                      selectedWallet.convenience === "High" ? "text-blue-400" :
                                      selectedWallet.convenience === "Medium" ? "text-yellow-400" : "text-red-400"
                                    }`}>{selectedWallet.convenience}</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-zinc-400 text-xs">Typical Cost</p>
                                    <p className="text-white font-medium">{selectedWallet.cost}</p>
                                  </div>
                                </div>
                                
                                <div className="bg-orange-600/10 border border-orange-600/20 rounded-lg p-3 mb-3">
                                  <p className="text-orange-300 text-sm font-medium">Best For: {selectedWallet.bestFor}</p>
                                </div>
                              </div>

                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                  <h6 className="font-medium text-orange-300">Advantages</h6>
                                  <ul className="space-y-1">
                                    {selectedWallet.pros.map((pro, idx) => (
                                      <li key={idx} className="text-zinc-300 text-sm flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                                        <span>{pro}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <div className="space-y-2">
                                  <h6 className="font-medium text-red-300">Considerations</h6>
                                  <ul className="space-y-1">
                                    {selectedWallet.cons.map((con, idx) => (
                                      <li key={idx} className="text-zinc-300 text-sm flex items-start gap-2">
                                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                        <span>{con}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h6 className="font-medium text-blue-300">Popular Examples</h6>
                                <div className="flex flex-wrap gap-2">
                                  {selectedWallet.examples.map((example, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-blue-600/20 border border-blue-600/30 rounded-full text-blue-200 text-sm">
                                      {example}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                    
                    {!selectedWalletType && (
                      <div className="text-center p-8 border border-zinc-700 rounded-lg border-dashed">
                        <Wallet className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                        <p className="text-zinc-400">Select a wallet type above to see detailed information</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Seed Phrase Recovery Simulator */}
                <Card className="bg-zinc-900 border-zinc-800" data-seed-phrase-simulator>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-orange-600/20 rounded-lg">
                        <KeyRound className="w-6 h-6 text-orange-400" />
                      </div>
                      <h4 className="text-xl font-bold text-white">Seed Phrase Recovery Simulator</h4>
                    </div>
                    
                    <p className="text-zinc-400 mb-4">
                      Practice recovering wallets in emergency scenarios using the safe practice word "hodlearn" for every position. Experience the recovery process without any security risk.
                    </p>

                    <div className="bg-orange-950/40 rounded-lg p-4 border border-orange-800/50 mb-6">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-orange-300 font-medium text-sm mb-2">⚠️ SAFE PRACTICE SIMULATION</p>
                          <div className="text-zinc-300 text-sm space-y-1">
                            <p>• Type "hodlearn" for every word position - completely safe practice word</p>
                            <p>• No real wallet data is collected or stored</p>
                            <p>• NEVER enter your real seed phrase anywhere online</p>
                            <p>• Real recovery should only be done in secure, offline environments</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {!seedPhraseActive ? (
                      <div className="space-y-6">
                        <div className="bg-red-950/40 rounded-lg p-4 border border-red-800/50">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-red-300 font-medium text-sm mb-2">Critical Skill</p>
                              <p className="text-zinc-300 text-sm leading-relaxed">
                                Wallet recovery is the most important Bitcoin skill. If you lose access to your wallet and don't know how to recover it using your seed phrase, your Bitcoin could be lost forever.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                          {seedPhraseScenarios.map((scenario, index) => (
                            <div 
                              key={scenario.id}
                              className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 hover:border-orange-500/50 transition-colors"
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <div className={`px-2 py-1 rounded text-xs font-medium ${
                                  scenario.difficulty === 'Beginner' ? 'bg-green-800/30 text-green-300' :
                                  scenario.difficulty === 'Intermediate' ? 'bg-yellow-800/30 text-yellow-300' :
                                  'bg-red-800/30 text-red-300'
                                }`}>
                                  {scenario.difficulty}
                                </div>
                                <div className="text-zinc-400 text-xs">
                                  {scenario.seedPhrase.length} words
                                </div>
                              </div>
                              
                              <h5 className="font-semibold text-white text-sm mb-2">{scenario.title}</h5>
                              <p className="text-zinc-400 text-xs mb-3 leading-relaxed">{scenario.description}</p>
                              
                              <div className="bg-zinc-900/50 rounded p-3 mb-3">
                                <p className="text-zinc-300 text-xs leading-relaxed">{scenario.context}</p>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="text-zinc-400 text-xs">
                                  ⏱️ {Math.floor(scenario.timeLimit / 60)}:{(scenario.timeLimit % 60).toString().padStart(2, '0')} limit
                                </div>
                                <Button
                                  onClick={() => {
                                    setSeedPhraseScenario(index);
                                    setSeedPhraseActive(true);
                                    setSeedPhraseProgress(0);
                                    setEnteredWords([]);
                                    setCurrentWordIndex(0);
                                    setRecoveryComplete(false);
                                    setShowSeedHints(false);
                                  }}
                                  className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 text-xs"
                                >
                                  Start Recovery
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-zinc-800/50 rounded-lg p-4">
                          <h5 className="font-semibold text-white text-sm mb-3">What You'll Learn</h5>
                          <div className="grid gap-2 sm:grid-cols-2">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                              <span className="text-zinc-300 text-sm">Seed phrase entry under pressure</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                              <span className="text-zinc-300 text-sm">Word order importance</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                              <span className="text-zinc-300 text-sm">Time management during recovery</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                              <span className="text-zinc-300 text-sm">Different seed phrase lengths</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Recovery Progress Header */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="font-semibold text-white">
                              {seedPhraseScenarios[seedPhraseScenario].title}
                            </h5>
                            <Button
                              onClick={() => {
                                setSeedPhraseActive(false);
                                setSeedPhraseProgress(0);
                                setEnteredWords([]);
                                setCurrentWordIndex(0);
                                setRecoveryComplete(false);
                              }}
                              variant="ghost"
                              size="sm"
                              className="text-zinc-400 hover:text-white"
                            >
                              ✕ Exit
                            </Button>
                          </div>
                          
                          <div className="bg-zinc-800/50 rounded-lg p-3">
                            <p className="text-zinc-300 text-sm leading-relaxed">
                              {seedPhraseScenarios[seedPhraseScenario].context}
                            </p>
                          </div>

                          {/* Progress Indicator */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400 text-sm">Recovery Progress</span>
                              <span className="text-zinc-400 text-sm">
                                {enteredWords.length}/{seedPhraseScenarios[seedPhraseScenario].seedPhrase.length} words
                              </span>
                            </div>
                            <div className="w-full bg-zinc-700 rounded-full h-2">
                              <div 
                                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${(enteredWords.length / seedPhraseScenarios[seedPhraseScenario].seedPhrase.length) * 100}%` 
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {!recoveryComplete ? (
                          <div className="space-y-6">
                            {/* Current Word Input */}
                            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                              <div className="mb-3">
                                <label className="text-white font-medium text-sm mb-2 block">
                                  Enter word #{currentWordIndex + 1}
                                </label>
                                <input
                                  type="text"
                                  placeholder="Type the next word from your seed phrase..."
                                  className="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-3 py-2 text-white placeholder-zinc-400 focus:border-orange-500 focus:outline-none"
                                  value={enteredWords[currentWordIndex] || ''}
                                  onChange={(e) => {
                                    const newWords = [...enteredWords];
                                    newWords[currentWordIndex] = e.target.value.toLowerCase().trim();
                                    setEnteredWords(newWords);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      const currentWord = enteredWords[currentWordIndex]?.toLowerCase().trim();
                                      const correctWord = seedPhraseScenarios[seedPhraseScenario].seedPhrase[currentWordIndex];
                                      
                                      if (currentWord === correctWord) {
                                        if (currentWordIndex === seedPhraseScenarios[seedPhraseScenario].seedPhrase.length - 1) {
                                          setRecoveryComplete(true);
                                        } else {
                                          setCurrentWordIndex(currentWordIndex + 1);
                                        }
                                      }
                                    }
                                  }}
                                />
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <Button
                                  onClick={() => {
                                    const currentWord = enteredWords[currentWordIndex]?.toLowerCase().trim();
                                    const correctWord = seedPhraseScenarios[seedPhraseScenario].seedPhrase[currentWordIndex];
                                    
                                    if (currentWord === correctWord) {
                                      if (currentWordIndex === seedPhraseScenarios[seedPhraseScenario].seedPhrase.length - 1) {
                                        setRecoveryComplete(true);
                                      } else {
                                        setCurrentWordIndex(currentWordIndex + 1);
                                      }
                                    }
                                  }}
                                  className="bg-orange-600 hover:bg-orange-700 text-white"
                                  disabled={!enteredWords[currentWordIndex]?.trim()}
                                >
                                  {currentWordIndex === seedPhraseScenarios[seedPhraseScenario].seedPhrase.length - 1 ? 'Complete Recovery' : 'Next Word'}
                                </Button>
                                
                                <Button
                                  onClick={() => setShowSeedHints(!showSeedHints)}
                                  variant="outline"
                                  className="border-zinc-600 text-zinc-300 hover:border-orange-500"
                                >
                                  {showSeedHints ? 'Hide' : 'Show'} Hints
                                </Button>
                              </div>
                            </div>

                            {/* Hints Panel */}
                            {showSeedHints && (
                              <div className="bg-blue-950/40 rounded-lg p-4 border border-blue-800/50">
                                <h6 className="font-medium text-blue-300 mb-3">Recovery Hints</h6>
                                <div className="space-y-2">
                                  {seedPhraseScenarios[seedPhraseScenario].hints.map((hint, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                                      <p className="text-blue-200 text-sm">{hint}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Progress Display */}
                            <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
                              {seedPhraseScenarios[seedPhraseScenario].seedPhrase.map((word, index) => (
                                <div
                                  key={index}
                                  className={`p-2 rounded border text-center ${
                                    index < enteredWords.length && enteredWords[index] === word
                                      ? 'bg-green-800/30 border-green-600/50 text-green-300'
                                      : index === currentWordIndex
                                      ? 'bg-orange-800/30 border-orange-600/50 text-orange-300'
                                      : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                                  }`}
                                >
                                  <div className="text-xs font-medium">
                                    {index < enteredWords.length && enteredWords[index] === word
                                      ? word
                                      : index === currentWordIndex
                                      ? '?'
                                      : `#${index + 1}`
                                    }
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          /* Recovery Complete */
                          <div className="space-y-6">
                            <div className="text-center space-y-4">
                              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                              </div>
                              <h5 className="font-bold text-green-400 text-lg">Wallet Recovery Successful! 🎉</h5>
                              <p className="text-zinc-300">
                                You've successfully recovered your wallet and regained access to your Bitcoin.
                              </p>
                            </div>

                            <div className="bg-green-950/40 rounded-lg p-4 border border-green-800/50">
                              <h6 className="font-medium text-green-300 mb-3">What Happened</h6>
                              <div className="space-y-2 text-green-200 text-sm">
                                <p>✅ Seed phrase entered correctly in proper order</p>
                                <p>✅ Wallet restored with full transaction history</p>
                                <p>✅ Bitcoin balance and addresses recovered</p>
                                <p>✅ You maintained control of your funds through the emergency</p>
                              </div>
                            </div>

                            <div className="flex justify-center gap-3">
                              <Button
                                onClick={() => {
                                  setSeedPhraseActive(false);
                                  setSeedPhraseProgress(0);
                                  setEnteredWords([]);
                                  setCurrentWordIndex(0);
                                  setRecoveryComplete(false);
                                }}
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                              >
                                Try Another Scenario
                              </Button>
                              <Button
                                onClick={() => {
                                  // Navigate to safety section for more security training
                                  setSimulationsSubTab("safety");
                                }}
                                variant="outline"
                                className="border-zinc-600 text-zinc-300 hover:border-orange-500"
                              >
                                Security Training
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Safety Training - Extracted to SafetyTraining component */}
            {isPremiumTier && simulationsSubTab === "safety" && (
              <SafetyTraining
                securityStage={securityStage}
                setSecurityStage={setSecurityStage}
                securityScore={securityScore}
                setSecurityScore={setSecurityScore}
                userSecurityAnswers={userSecurityAnswers}
                setUserSecurityAnswers={setUserSecurityAnswers}
              />
            )}

            {/* Transaction Simulator - Only show for premium users */}
            {simulationsSubTab === "transactions" && (
              <TransactionsSimulator 
                isPremiumTier={isPremiumTier}
              />
            )}

            {/* Transfer Speed Simulator */}
            {isPremiumTier && simulationsSubTab === "transfer" && (
              <TransferSimulator />
            )}

            {/* HODL Simulator - Extracted to HODLSimulator component */}
            {simulationsSubTab === "hodl" && (
              <HODLSimulator />
            )}

            {/* OLD HODL SECTION - TO BE REMOVED */}
            {false && isPremiumTier && simulationsSubTab === "hodl" && (
              <div className="space-y-6">
                {/* Why HODL Strategy Matters */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-orange-600/20 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-orange-400" />
                      </div>
                      <h4 className="text-xl font-bold text-white">The Power of Time in Market vs Timing the Market</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-zinc-300 leading-relaxed">
                        Bitcoin's price swings can be extreme - dropping 80% in bear markets and rising 2000% in bull markets. 
                        Most people try to time these movements perfectly, but history shows that simply holding through all 
                        volatility (HODLing) often produces superior results with less stress and risk.
                      </p>
                      
                      <div className="bg-zinc-800/50 rounded-lg p-4 border-l-4 border-orange-500">
                        <p className="text-zinc-300 text-sm">
                          <span className="font-semibold text-orange-300">Historical Truth:</span> Even if you bought Bitcoin 
                          at the absolute peak of 2017 ($19,783), you would still be profitable today. Meanwhile, traders 
                          trying to time the market often buy high, sell low, and miss the biggest gains.
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-semibold text-white">Real Historical Scenarios You'll Test:</h5>
                        <div className="grid gap-3 sm:grid-cols-3">
                          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <Calendar className="w-5 h-5 text-red-400" />
                            <div>
                              <p className="font-medium text-white text-sm">COVID Crash</p>
                              <p className="text-zinc-400 text-xs">March 2020 panic buying opportunity</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <TrendingDown className="w-5 h-5 text-yellow-400" />
                            <div>
                              <p className="font-medium text-white text-sm">Bear Market</p>
                              <p className="text-zinc-400 text-xs">2018-2021 patience test period</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <Star className="w-5 h-5 text-purple-400" />
                            <div>
                              <p className="font-medium text-white text-sm">Early Adopter</p>
                              <p className="text-zinc-400 text-xs">2017-2025 ultimate diamond hands</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center pt-2">
                        <Button
                          onClick={() => {
                            const calculator = document.querySelector('[data-hodl-calculator]');
                            if (calculator) {
                              calculator.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
                        >
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Test HODL Scenarios
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* HODL Calculator Section */}
                <Card className="bg-zinc-900 border-zinc-800" data-hodl-calculator>
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-white mb-2">HODL Calculator</h3>
                      <p className="text-zinc-400">See how much your Bitcoin investment would be worth today</p>
                    </div>

                    {/* Always-Visible Chart Section */}
                    <div className="mb-6">
                      <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-white font-semibold">Bitcoin Performance Chart</h4>
                          <div className="text-xs text-zinc-400">Jan 2017 - Jan 2025</div>
                        </div>
                        <div className="relative">
                          <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 bg-zinc-900/50 rounded overflow-hidden">
                            <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                              {/* Grid background */}
                              <defs>
                                <pattern id="grid-hodl-chart" width="32" height="40" patternUnits="userSpaceOnUse">
                                  <path d="M 32 0 L 0 0 0 40" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
                                </pattern>
                              </defs>
                              <rect width="100%" height="100%" fill="url(#grid-hodl-chart)" />
                              
                              {/* 2x Market Line */}
                              <line x1="20" y1="140" x2="350" y2="140" stroke="#6366f1" strokeWidth="1" opacity="0.6" strokeDasharray="3,3"/>
                              <text x="360" y="144" fill="#6366f1" fontSize="12" opacity="0.8">2x</text>
                              
                              {/* 5x Market Line */}
                              <line x1="20" y1="120" x2="350" y2="120" stroke="#10b981" strokeWidth="1" opacity="0.6" strokeDasharray="3,3"/>
                              <text x="360" y="124" fill="#10b981" fontSize="12" opacity="0.8">5x</text>
                              
                              {/* 10x Market Line */}
                              <line x1="20" y1="80" x2="350" y2="80" stroke="#fbbf24" strokeWidth="1" opacity="0.6" strokeDasharray="3,3"/>
                              <text x="360" y="84" fill="#fbbf24" fontSize="12" opacity="0.8">10x</text>
                              
                              {/* 100x Market Line */}
                              <line x1="20" y1="40" x2="350" y2="40" stroke="#dc2626" strokeWidth="1" opacity="0.6" strokeDasharray="3,3"/>
                              <text x="360" y="44" fill="#dc2626" fontSize="12" opacity="0.8">100x</text>
                              
                              {/* Bitcoin Price Line (realistic exponential growth) */}
                              <path 
                                d="M 20 150 Q 70 145 110 140 Q 160 130 200 115 Q 250 95 300 70 Q 350 45 380 30" 
                                stroke="#f97316" 
                                strokeWidth="3" 
                                fill="none"
                                className="drop-shadow-lg"
                              />
                              
                              {/* Area fill */}
                              <path 
                                d="M 20 150 Q 70 145 110 140 Q 160 130 200 115 Q 250 95 300 70 Q 350 45 380 30 L 380 150 L 20 150 Z" 
                                fill="url(#chartGradient-hodl)"
                                opacity="0.2"
                              />
                              
                              <defs>
                                <linearGradient id="chartGradient-hodl" x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.4"/>
                                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.1"/>
                                </linearGradient>
                              </defs>
                              
                              {/* Start and end markers */}
                              <circle cx="20" cy="150" r="3" fill="#10b981" stroke="#ffffff" strokeWidth="1"/>
                              <circle cx="380" cy="30" r="4" fill="#f97316" stroke="#ffffff" strokeWidth="2" className="animate-pulse"/>
                              
                              {/* Time labels */}
                              <text x="20" y="175" fill="#9ca3af" fontSize="12" textAnchor="start">2017</text>
                              <text x="200" y="175" fill="#9ca3af" fontSize="12" textAnchor="middle">2021</text>
                              <text x="380" y="175" fill="#9ca3af" fontSize="12" textAnchor="end">2025</text>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Input Section */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white font-medium mb-2">Investment Amount</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[100, 500, 1000, 5000, 10000, 25000].map((amount) => (
                              <Button
                                key={amount}
                                variant={hodlInputs.initialAmount === amount ? "default" : "outline"}
                                size="sm"
                                onClick={() => setHodlInputs(prev => ({...prev, initialAmount: amount}))}
                                className={`text-xs py-2 ${
                                  hodlInputs.initialAmount === amount 
                                    ? "bg-orange-600 hover:bg-orange-700 text-white border-orange-600" 
                                    : "border-zinc-700 text-zinc-300 hover:border-orange-500 hover:text-orange-300"
                                }`}
                              >
                                ${amount >= 1000 ? `${amount/1000}K` : amount}
                              </Button>
                            ))}
                          </div>
                          <div className="text-center text-sm text-zinc-400 mt-1">
                            Selected: ${hodlInputs.initialAmount.toLocaleString()}
                          </div>
                        </div>

                        <div>
                          <label className="block text-white font-medium mb-2">Purchase Date</label>
                          <Select
                            value={hodlInputs.scenario}
                            onValueChange={(value) => {
                              const scenarios: { [key: string]: { startPrice: number; endPrice: number; years: number; period: string } } = {
                                'jan2024': { startPrice: 42867, endPrice: 94200, years: 1, period: 'Jan 2024' },
                                'jan2023': { startPrice: 16625, endPrice: 94200, years: 2, period: 'Jan 2023' },
                                'jan2022': { startPrice: 46311, endPrice: 94200, years: 3, period: 'Jan 2022' },
                                'jan2021': { startPrice: 29374, endPrice: 94200, years: 4, period: 'Jan 2021' },
                                'jan2020': { startPrice: 7200, endPrice: 94200, years: 5, period: 'Jan 2020' },
                                'jan2019': { startPrice: 3784, endPrice: 94200, years: 6, period: 'Jan 2019' },
                                'jan2018': { startPrice: 13412, endPrice: 94200, years: 7, period: 'Jan 2018' },
                                'jan2017': { startPrice: 998, endPrice: 94200, years: 8, period: 'Jan 2017' },
                                'jan2016': { startPrice: 434, endPrice: 94200, years: 9, period: 'Jan 2016' },
                                'jan2015': { startPrice: 315, endPrice: 94200, years: 10, period: 'Jan 2015' }
                              };
                              
                              const scenario = scenarios[value];
                              setHodlInputs(prev => ({
                                ...prev,
                                scenario: value,
                                startPrice: scenario.startPrice,
                                endPrice: scenario.endPrice,
                                years: scenario.years,
                                period: scenario.period
                              }));
                            }}
                          >
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectValue placeholder="Select purchase date" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700">
                              <SelectItem value="jan2024">January 2024 ($42,867)</SelectItem>
                              <SelectItem value="jan2023">January 2023 ($16,625)</SelectItem>
                              <SelectItem value="jan2022">January 2022 ($46,311)</SelectItem>
                              <SelectItem value="jan2021">January 2021 ($29,374)</SelectItem>
                              <SelectItem value="jan2020">January 2020 ($7,200)</SelectItem>
                              <SelectItem value="jan2019">January 2019 ($3,784)</SelectItem>
                              <SelectItem value="jan2018">January 2018 ($13,412)</SelectItem>
                              <SelectItem value="jan2017">January 2017 ($998)</SelectItem>
                              <SelectItem value="jan2016">January 2016 ($434)</SelectItem>
                              <SelectItem value="jan2015">January 2015 ($315)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Results Section */}
                      <div className="space-y-4">
                        {hodlResults && hodlInputs.scenario && (
                          <div className="bg-zinc-800/50 rounded-lg p-4">
                            <h4 className="text-white font-semibold mb-3">Your HODL Results</h4>
                            
                            {/* Growth Chart */}
                            <div className="mb-4 p-3 bg-zinc-900/50 rounded-lg">
                              <div className="text-xs text-zinc-400 mb-2">Portfolio Growth Over Time</div>
                              <div className="h-48 sm:h-56 md:h-64 lg:h-72 relative">
                                <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                                  {/* Chart Background Grid */}
                                  <defs>
                                    <pattern id="grid-portfolio" width="40" height="20" patternUnits="userSpaceOnUse">
                                      <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
                                    </pattern>
                                  </defs>
                                  <rect width="100%" height="100%" fill="url(#grid-portfolio)" />
                                  
                                  {/* Growth Line */}
                                  {(() => {
                                    const points = [];
                                    const years = hodlInputs.years;
                                    const startValue = hodlResults.initialInvestment;
                                    const endValue = hodlResults.currentValue;
                                    const steps = Math.max(20, years * 3); // More data points for smoother curves
                                    
                                    // Fixed scale for maximum visual impact - always show full potential
                                    const maxPossibleGrowth = 100; // 10,000% growth for scale reference
                                    const currentGrowthRatio = (endValue / startValue);
                                    
                                    for (let i = 0; i <= steps; i++) {
                                      const progress = i / steps;
                                      
                                      // Simulate realistic Bitcoin growth with dramatic volatility
                                      let value;
                                      if (hodlInputs.scenario === 'jan2017') {
                                        // Early adopter with realistic major volatility events
                                        const baseGrowth = Math.pow(currentGrowthRatio, progress);
                                        let volatilityMultiplier = 1;
                                        
                                        // Major market events with smoother transitions
                                        if (progress < 0.12) {
                                          // Early 2017 growth
                                          volatilityMultiplier = 1 + progress * 8;
                                        } else if (progress < 0.25) {
                                          // Mid 2017 bubble
                                          volatilityMultiplier = 2 + (progress - 0.12) * 40;
                                        } else if (progress < 0.35) {
                                          // Late 2017 peak then crash
                                          volatilityMultiplier = 7 - (progress - 0.25) * 15;
                                        } else if (progress < 0.5) {
                                          // 2018 bear market
                                          volatilityMultiplier = 0.8 + (progress - 0.35) * 0.5;
                                        } else {
                                          // Gradual recovery and exponential growth
                                          const recoveryProgress = (progress - 0.5) / 0.5;
                                          volatilityMultiplier = 1 + recoveryProgress * (currentGrowthRatio - 1);
                                        }
                                        
                                        value = startValue * volatilityMultiplier;
                                      } else if (hodlInputs.scenario === 'jan2020') {
                                        // COVID crash and recovery - dramatic dip then exponential recovery
                                        if (progress < 0.15) {
                                          value = startValue * (1 - 0.6 * (progress / 0.15)); // 60% crash
                                        } else if (progress < 0.4) {
                                          const recoveryProgress = (progress - 0.15) / 0.25;
                                          value = startValue * (0.4 + recoveryProgress * 1.6); // Recovery to 2x
                                        } else {
                                          const growthProgress = (progress - 0.4) / 0.6;
                                          value = startValue * (2 + growthProgress * (currentGrowthRatio - 2));
                                        }
                                      } else if (years >= 5) {
                                        // Long-term exponential with realistic volatility - ensure full growth is reached
                                        const baseGrowth = Math.pow(currentGrowthRatio, progress);
                                        const volatility = 1 + 0.3 * Math.sin(progress * 8) * (1 - progress * 0.4);
                                        value = startValue * baseGrowth * Math.max(0.3, volatility);
                                      } else {
                                        // Shorter term with more moderate growth
                                        const baseGrowth = Math.pow(currentGrowthRatio, progress);
                                        const volatility = 1 + 0.2 * Math.sin(progress * 6) * (1 - progress * 0.2);
                                        value = startValue * baseGrowth * Math.max(0.5, volatility);
                                      }
                                      
                                      // Ensure the final value always reaches the correct target
                                      if (progress >= 0.98) {
                                        value = startValue * currentGrowthRatio;
                                      }
                                      
                                      // Use logarithmic scale for better visual impact of compounding
                                      const logStartValue = Math.log(startValue);
                                      const logValue = Math.log(Math.max(value, startValue * 0.1)); // Prevent negative logs
                                      const logMaxValue = Math.log(startValue * maxPossibleGrowth);
                                      
                                      const yPosition = 164 - ((logValue - logStartValue) / (logMaxValue - logStartValue)) * 150;
                                      
                                      points.push({
                                        x: (progress * 380) + 10,
                                        y: Math.max(14, Math.min(164, yPosition)), // Keep within bounds
                                        value
                                      });
                                    }
                                    
                                    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                                    
                                    // Show consistent milestone markers for all scenarios
                                    const keyMilestones = [
                                      { label: '2x', multiplier: 2, color: '#6366f1' },
                                      { label: '5x', multiplier: 5, color: '#10b981' },
                                      { label: '10x', multiplier: 10, color: '#fbbf24' },
                                      { label: '100x', multiplier: 100, color: '#dc2626' }
                                    ];
                                    
                                    return (
                                      <>
                                        {/* Background grid for reference */}
                                        <defs>
                                          <pattern id="compoundGrid" width="48" height="16" patternUnits="userSpaceOnUse">
                                            <path d="M 48 0 L 0 0 0 16" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.2"/>
                                          </pattern>
                                          <linearGradient id="dramaticGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#f97316" stopOpacity="0.4"/>
                                            <stop offset="100%" stopColor="#f97316" stopOpacity="0.1"/>
                                          </linearGradient>
                                        </defs>
                                        <rect width="100%" height="100%" fill="url(#compoundGrid)" />
                                        
                                        {/* Milestone reference lines */}
                                        {keyMilestones.map((milestone, index) => {
                                          const logMilestone = Math.log(startValue * milestone.multiplier);
                                          const logStartValue = Math.log(startValue);
                                          const logMaxValue = Math.log(startValue * maxPossibleGrowth);
                                          const y = 164 - ((logMilestone - logStartValue) / (logMaxValue - logStartValue)) * 150;
                                          
                                          return (
                                            <g key={milestone.label}>
                                              <line x1="10" y1={y} x2="390" y2={y} stroke={milestone.color} strokeWidth="1" opacity="0.6" strokeDasharray="3,3"/>
                                              <text x="395" y={y + 3} fill={milestone.color} fontSize="12" opacity="0.8">{milestone.label}</text>
                                            </g>
                                          );
                                        })}
                                        
                                        {/* Area fill for dramatic effect */}
                                        <path
                                          d={`${pathData} L ${points[points.length - 1].x} 164 L 10 164 Z`}
                                          fill="url(#dramaticGradient)"
                                          opacity="0.3"
                                        />
                                        
                                        {/* Main growth line with enhanced styling */}
                                        <path
                                          d={pathData}
                                          stroke="#f97316"
                                          strokeWidth="3"
                                          fill="none"
                                          className="drop-shadow-lg"
                                          filter="url(#glow)"
                                        />
                                        
                                        {/* Glow effect for dramatic impact */}
                                        <defs>
                                          <filter id="glow">
                                            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                            <feMerge> 
                                              <feMergeNode in="coloredBlur"/>
                                              <feMergeNode in="SourceGraphic"/>
                                            </feMerge>
                                          </filter>
                                        </defs>
                                        
                                        {/* Enhanced start and end points */}
                                        <circle cx={points[0].x} cy={points[0].y} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1" opacity="0.9" />
                                        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="5" fill="#f97316" stroke="#ffffff" strokeWidth="1" className="animate-pulse" />
                                        
                                        {/* Time progression labels */}
                                        <text x="10" y="185" fill="#9ca3af" fontSize="12" fontWeight="500" textAnchor="start">
                                          {hodlInputs.period}
                                        </text>
                                        <text x="200" y="185" fill="#9ca3af" fontSize="12" textAnchor="middle">
                                          {years > 3 ? `${Math.floor(years/2)} years` : ''}
                                        </text>
                                        <text x="390" y="185" fill="#9ca3af" fontSize="12" fontWeight="500" textAnchor="end">
                                          Jan 2025
                                        </text>
                                        
                                        {/* Growth percentage indicator */}
                                        <text x="200" y="25" fill="#f97316" fontSize="12" fontWeight="bold" textAnchor="middle">
                                          +{((currentGrowthRatio - 1) * 100).toLocaleString('en-US', {maximumFractionDigits: 0})}% Growth
                                        </text>
                                      </>
                                    );
                                  })()}
                                </svg>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-zinc-400">Initial Investment:</span>
                                <span className="text-white font-mono">${hodlResults.initialInvestment.toLocaleString()}</span>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <span className="text-zinc-400">Current Value:</span>
                                <span className="text-green-400 font-mono text-lg">${hodlResults.currentValue.toLocaleString()}</span>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <span className="text-zinc-400">Total Gain:</span>
                                <span className="text-orange-400 font-mono text-lg">+{hodlResults.percentageReturn.toLocaleString('en-US', {maximumFractionDigits: 1})}%</span>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <span className="text-zinc-400">Profit:</span>
                                <span className="text-green-400 font-mono">+${hodlResults.totalGain.toLocaleString()}</span>
                              </div>
                              
                              <div className="pt-3 border-t border-zinc-700">
                                <div className="text-center">
                                  <div className="text-zinc-300 text-sm">Held for {hodlInputs.years} years</div>
                                  <div className="text-orange-300 font-medium">{hodlResults.annualReturn.toFixed(1)}% annual return</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {!hodlResults && (
                          <div className="text-center py-8 text-zinc-400">
                            <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Select an investment amount and purchase date to see your HODL results</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* HODL vs Market Timing Educational Section */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-orange-600/20 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-orange-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Why HODLing Beats Market Timing</h3>
                    </div>
                    
                    <div className="prose prose-invert max-w-none">
                      <p className="text-zinc-300 mb-4">
                        Bitcoin's price can swing wildly day-to-day, making it tempting to try "buying low and selling high." 
                        However, research consistently shows that <strong className="text-orange-400">time in the market beats timing the market</strong>.
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-4">
                        <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                          <h4 className="text-zinc-300 font-semibold mb-2">Market Timing Problems</h4>
                          <ul className="text-zinc-400 text-sm space-y-1">
                            <li>• Missing the best days hurts returns dramatically</li>
                            <li>• Emotional decisions during volatility</li>
                            <li>• Trading fees eat into profits</li>
                            <li>• Tax implications on short-term gains</li>
                            <li>• Stress and time consumption</li>
                          </ul>
                        </div>
                        
                        <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                          <h4 className="text-zinc-300 font-semibold mb-2">HODLing Benefits</h4>
                          <ul className="text-zinc-400 text-sm space-y-1">
                            <li>• Captures all market growth over time</li>
                            <li>• Reduces emotional trading mistakes</li>
                            <li>• Lower fees and tax advantages</li>
                            <li>• Compound growth over years</li>
                            <li>• Peace of mind and simplicity</li>
                          </ul>
                        </div>
                      </div>
                      
                      <p className="text-orange-300 font-medium text-center">
                        <strong>Key Insight:</strong> Even if you bought Bitcoin at its previous all-time high in 2017, 
                        holding until today would have resulted in massive gains. Patience pays off.
                      </p>
                    </div>
                  </CardContent>
                </Card>

              </div>
            )}

            {/* DCA Calculator - Extracted to DCASimulator component */}
            {simulationsSubTab === "dca" && (
              <DCASimulator />
            )}

            {/* OLD DCA CALCULATOR - TO BE REMOVED */}
            {false && isPremiumTier && simulationsSubTab === "dca" && (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold text-white">DCA Calculator</h3>
                  <p className="text-zinc-400 text-sm">Configure your strategy and see real Bitcoin performance</p>
                </div>

                {/* Why DCA Strategy Matters */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-orange-600/20 rounded-lg">
                        <BarChart3 className="w-6 h-6 text-orange-400" />
                      </div>
                      <h4 className="text-xl font-bold text-white">Remove Emotion and Timing Risk from Investing</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-zinc-300 leading-relaxed">
                        Dollar-Cost Averaging (DCA) is the simplest investment strategy that removes the impossible task of timing markets. 
                        By investing the same amount regularly regardless of price, you automatically buy more Bitcoin when it's cheap 
                        and less when it's expensive, smoothing out volatility over time.
                      </p>
                      
                      <div className="bg-zinc-800/50 rounded-lg p-4 border-l-4 border-orange-500">
                        <p className="text-zinc-300 text-sm">
                          <span className="font-semibold text-orange-300">Historical Advantage:</span> DCA strategies have consistently 
                          outperformed lump-sum investing for Bitcoin because they reduce the risk of buying at peak prices. 
                          Even during volatile periods, consistent buying builds wealth systematically.
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-semibold text-white">Test Real Historical Scenarios:</h5>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <Calculator className="w-5 h-5 text-orange-400" />
                            <div>
                              <p className="font-medium text-white text-sm">Investment Amounts</p>
                              <p className="text-zinc-400 text-xs">$25 to $10,000 per period</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <Clock className="w-5 h-5 text-orange-400" />
                            <div>
                              <p className="font-medium text-white text-sm">Frequencies</p>
                              <p className="text-zinc-400 text-xs">Daily, weekly, monthly, quarterly</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <Calendar className="w-5 h-5 text-orange-400" />
                            <div>
                              <p className="font-medium text-white text-sm">Time Periods</p>
                              <p className="text-zinc-400 text-xs">3 months to 10 years</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-orange-400" />
                            <div>
                              <p className="font-medium text-white text-sm">Real Data</p>
                              <p className="text-zinc-400 text-xs">Authentic Bitcoin price history</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center pt-2">
                        <Button
                          onClick={() => {
                            const calculator = document.querySelector('[data-dca-calculator]');
                            if (calculator) {
                              const rect = calculator.getBoundingClientRect();
                              const viewportHeight = window.innerHeight;
                              const elementHeight = rect.height;
                              
                              // Calculate ideal position: center the calculator with enough room for dropdowns
                              const idealTop = (viewportHeight - elementHeight) / 3; // Position in upper third
                              const scrollTarget = window.pageYOffset + rect.top - idealTop;
                              
                              window.scrollTo({
                                top: Math.max(0, scrollTarget), // Prevent negative scroll
                                behavior: 'smooth'
                              });
                            }
                          }}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
                        >
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Start DCA Analysis
                        </Button>
                      </div>

                    </div>
                  </CardContent>
                </Card>

                {/* Compact Input Controls */}
                <Card className="bg-zinc-900 border-zinc-800" data-dca-calculator>
                  <CardContent className="p-4">
                    <div className="grid gap-3 grid-cols-3">
                      {/* Investment Amount */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-white">Amount</label>
                        <Select 
                          value={dcaInputs.monthlyAmount.toString()} 
                          onValueChange={(value) => setDcaInputs(prev => ({ ...prev, monthlyAmount: Number(value) }))}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectValue placeholder="Select amount" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700">
                            <SelectItem value="25">$25</SelectItem>
                            <SelectItem value="50">$50</SelectItem>
                            <SelectItem value="75">$75</SelectItem>
                            <SelectItem value="100">$100</SelectItem>
                            <SelectItem value="150">$150</SelectItem>
                            <SelectItem value="200">$200</SelectItem>
                            <SelectItem value="250">$250</SelectItem>
                            <SelectItem value="300">$300</SelectItem>
                            <SelectItem value="400">$400</SelectItem>
                            <SelectItem value="500">$500</SelectItem>
                            <SelectItem value="750">$750</SelectItem>
                            <SelectItem value="1000">$1,000</SelectItem>
                            <SelectItem value="1500">$1,500</SelectItem>
                            <SelectItem value="2000">$2,000</SelectItem>
                            <SelectItem value="2500">$2,500</SelectItem>
                            <SelectItem value="5000">$5,000</SelectItem>
                            <SelectItem value="10000">$10,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Frequency */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-white">Frequency</label>
                        <Select 
                          value={dcaInputs.frequency} 
                          onValueChange={(value) => setDcaInputs(prev => ({ ...prev, frequency: value as any }))}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700">
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="biweekly">Bi-weekly (Every 2 weeks)</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly (Every 3 months)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Start Date - calculates to present */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-white">Started DCA</label>
                        <Select 
                          value={dcaInputs.startDate} 
                          onValueChange={(value) => setDcaInputs(prev => ({ ...prev, startDate: value }))}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectValue placeholder="Select start date" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700">
                            <SelectItem value="2009-01-01">Jan 2009</SelectItem>
                            <SelectItem value="2010-01-01">Jan 2010</SelectItem>
                            <SelectItem value="2011-01-01">Jan 2011</SelectItem>
                            <SelectItem value="2012-01-01">Jan 2012</SelectItem>
                            <SelectItem value="2013-01-01">Jan 2013</SelectItem>
                            <SelectItem value="2014-01-01">Jan 2014</SelectItem>
                            <SelectItem value="2015-01-01">Jan 2015</SelectItem>
                            <SelectItem value="2016-01-01">Jan 2016</SelectItem>
                            <SelectItem value="2017-01-01">Jan 2017</SelectItem>
                            <SelectItem value="2018-01-01">Jan 2018</SelectItem>
                            <SelectItem value="2019-01-01">Jan 2019</SelectItem>
                            <SelectItem value="2020-01-01">Jan 2020</SelectItem>
                            <SelectItem value="2021-01-01">Jan 2021</SelectItem>
                            <SelectItem value="2022-01-01">Jan 2022</SelectItem>
                            <SelectItem value="2023-01-01">Jan 2023</SelectItem>
                            <SelectItem value="2024-01-01">Jan 2024</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-zinc-400 text-xs flex items-center">
                        <Info className="w-3 h-3 mr-1" />
                        Continuous DCA to January 2025
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Results Display */}
                {dcaResults && (
                  <>


                    {/* Interactive Price Chart Visualization */}
                    <Card className="bg-zinc-900 border-zinc-800">
                      <CardContent className="p-6">
                        <h4 className="text-lg font-bold text-white mb-4">DCA Performance Visualization</h4>
                        
                        {/* Simulated Price Chart with Purchase Points */}
                        <div className="space-y-4">
                          <div className="h-64 bg-zinc-800/50 rounded-lg p-4 relative overflow-hidden">
                            <div className="absolute inset-0 p-4">
                              {/* Simplified Y-axis labels */}
                              <div className="absolute left-2 top-4 text-zinc-500 text-xs">
                                High
                              </div>
                              <div className="absolute left-2 bottom-12 text-zinc-500 text-xs">
                                Low
                              </div>
                              
                              {/* Simplified X-axis labels */}
                              <div className="absolute bottom-4 left-8 text-zinc-500 text-xs">
                                Start
                              </div>
                              <div className="absolute bottom-4 right-8 text-zinc-500 text-xs">
                                Now
                              </div>
                              
                              {/* Accurate DCA Chart using real purchase data */}
                              <svg className="w-full h-full" viewBox="0 0 400 200">
                                {dcaResults?.purchases && (() => {
                                  const purchases = dcaResults.purchases;
                                  const chartWidth = 360;
                                  const chartHeight = 160;
                                  
                                  // Find price range for proper scaling
                                  const minPrice = Math.min(...purchases.map(p => p.price));
                                  const maxPrice = Math.max(...purchases.map(p => p.price));
                                  const priceRange = maxPrice - minPrice;
                                  
                                  // Find average cost range
                                  const minAvg = Math.min(...purchases.map(p => p.runningAvgCost));
                                  const maxAvg = Math.max(...purchases.map(p => p.runningAvgCost));
                                  
                                  // Calculate positions for each data point
                                  const dataPoints = purchases.map((purchase, index) => {
                                    const x = 20 + (index / (purchases.length - 1)) * chartWidth;
                                    const priceY = 180 - ((purchase.price - minPrice) / priceRange) * chartHeight;
                                    const avgY = 180 - ((purchase.runningAvgCost - minPrice) / priceRange) * chartHeight;
                                    
                                    return {
                                      x,
                                      priceY,
                                      avgY,
                                      price: purchase.price,
                                      avgCost: purchase.runningAvgCost
                                    };
                                  });
                                  
                                  return (
                                    <>
                                      {/* Grid lines */}
                                      <defs>
                                        <pattern id="dcaGrid" width="40" height="30" patternUnits="userSpaceOnUse">
                                          <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.2"/>
                                        </pattern>
                                      </defs>
                                      <rect width="100%" height="100%" fill="url(#dcaGrid)" />
                                      
                                      {/* Bitcoin price line (orange - actual market prices) */}
                                      <path
                                        d={dataPoints.map((point, i) => 
                                          `${i === 0 ? 'M' : 'L'} ${point.x},${point.priceY}`
                                        ).join(' ')}
                                        stroke="#f97316"
                                        strokeWidth="3"
                                        fill="none"
                                        className="drop-shadow-sm"
                                      />
                                      
                                      {/* DCA running average cost line (blue - your evolving average) */}
                                      <path
                                        d={dataPoints.map((point, i) => 
                                          `${i === 0 ? 'M' : 'L'} ${point.x},${point.avgY}`
                                        ).join(' ')}
                                        stroke="#3b82f6"
                                        strokeWidth="2"
                                        strokeDasharray="6,4"
                                        fill="none"
                                        opacity="0.9"
                                      />
                                      
                                      {/* Purchase points (green dots at actual buy prices) */}
                                      {dataPoints.map((point, i) => (
                                        <g key={i}>
                                          <circle
                                            cx={point.x}
                                            cy={point.priceY}
                                            r="4"
                                            fill="#22c55e"
                                            stroke="#1f2937"
                                            strokeWidth="1"
                                            className="drop-shadow-sm"
                                          />
                                        </g>
                                      ))}
                                      

                                    </>
                                  );
                                })()}
                                
                                {!dcaResults?.purchases && (
                                  <text x="200" y="100" textAnchor="middle" fill="#9ca3af" fontSize="14">
                                    Click "Calculate DCA" to see chart
                                  </text>
                                )}
                              </svg>
                              
                              {/* Simplified Legend */}
                              <div className="absolute bottom-2 left-4 flex gap-3 text-xs">
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-0.5 bg-orange-500"></div>
                                  <span className="text-zinc-500">Price</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-zinc-500">Buys</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-0.5 bg-blue-500 border-dashed"></div>
                                  <span className="text-zinc-500">Avg</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-center p-3 bg-blue-900/20 rounded-lg">
                            <p className="text-blue-300 text-sm">
                              <Info className="w-4 h-4 inline mr-1" />
                              Your average purchase price: <span className="font-medium">${Math.round(dcaResults.averagePrice).toLocaleString()}</span> 
                              {' '}vs current Bitcoin price: <span className="font-medium">$50,000</span>
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Strategy Comparison */}
                    <Card className="bg-zinc-900 border-zinc-800">
                      <CardContent className="p-6">
                        <h4 className="text-lg font-bold text-white mb-4">Strategy Comparison</h4>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          {/* DCA Strategy */}
                          <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                            <h5 className="font-medium text-zinc-300 mb-3 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4" />
                              Dollar-Cost Averaging
                            </h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Strategy</span>
                                <span className="text-white">${dcaInputs.monthlyAmount} {dcaInputs.frequency}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Total Invested</span>
                                <span className="text-white">${dcaResults.totalInvested.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Bitcoin Acquired</span>
                                <span className="text-white">{dcaResults.totalBitcoin.toLocaleString('en-US', {maximumFractionDigits: 6, minimumFractionDigits: 4})} BTC</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Average Price</span>
                                <span className="text-white">${Math.round(dcaResults.averagePrice).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between font-medium">
                                <span className="text-zinc-300">Current Value</span>
                                <span className="text-green-400">${Math.round(dcaResults.currentValue).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Lump Sum Comparison */}
                          <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                            <h5 className="font-medium text-zinc-300 mb-3 flex items-center gap-2">
                              <Zap className="w-4 h-4" />
                              Lump Sum (Start Date)
                            </h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Strategy</span>
                                <span className="text-white">All at once</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Total Invested</span>
                                <span className="text-white">${dcaResults.totalInvested.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Bitcoin Acquired</span>
                                <span className="text-white">{Math.round((dcaResults.totalInvested / (dcaResults.averagePrice * 0.7)) * 100000000).toLocaleString()} sats</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Purchase Price</span>
                                <span className="text-white">${Math.round(dcaResults.averagePrice * 0.7).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between font-medium">
                                <span className="text-zinc-300">Current Value</span>
                                <span className="text-orange-400">${Math.round((dcaResults.totalInvested / (dcaResults.averagePrice * 0.7)) * 50000).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Educational Insights */}
                    <Card className="bg-zinc-900 border-zinc-800">
                      <CardContent className="p-6">
                        <h4 className="text-lg font-bold text-zinc-300 mb-4">DCA Education</h4>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <h5 className="font-medium text-zinc-300 mb-2">Why DCA Works</h5>
                            <ul className="space-y-1 text-zinc-300 text-sm">
                              <li>• <strong>Volatility smoothing:</strong> Reduces impact of price swings</li>
                              <li>• <strong>Lower average cost:</strong> Buys more when prices are low</li>
                              <li>• <strong>Emotion-free:</strong> Removes timing and FOMO decisions</li>
                              <li>• <strong>Accessibility:</strong> Start with any amount you can afford</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-zinc-300 mb-2">Key Insights</h5>
                            <ul className="space-y-1 text-zinc-300 text-sm">
                              <li>• Time in market beats timing the market</li>
                              <li>• Consistency builds wealth over time</li>
                              <li>• Market dips become buying opportunities</li>
                              <li>• Reduces risk of buying at the peak</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-orange-600/20 rounded-lg border border-orange-500/30">
                          <p className="text-orange-200 text-sm">
                            <GraduationCap className="w-4 h-4 inline mr-1 text-orange-300" />
                            <strong>Pro Tip:</strong> The best DCA strategy is one you can stick to consistently. 
                            Start with an amount that won't strain your budget and increase it as your income grows.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            )}

            {/* Interactive Inflation Simulator - Redesigned */}
            {isPremiumTier && simulationsSubTab === "inflation" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">Interactive Inflation Destroyer</h3>
                  <p className="text-zinc-400">Watch your money vanish in real-time as you move through the years</p>
                </div>

                {/* Why Understanding Inflation Matters */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-orange-600/20 rounded-lg">
                        <TrendingDown className="w-6 h-6 text-orange-400" />
                      </div>
                      <h4 className="text-xl font-bold text-white">The Silent Wealth Destroyer Working Against You</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-zinc-300 leading-relaxed">
                        Inflation is the hidden tax that quietly steals your purchasing power every single day. While you sleep, 
                        your savings lose value as governments print more money, diluting what you've worked hard to earn. 
                        Most people don't realize how devastating this compound erosion becomes over time.
                      </p>
                      
                      <div className="bg-zinc-800/50 rounded-lg p-4 border-l-4 border-orange-500">
                        <p className="text-zinc-300 text-sm">
                          <span className="font-semibold text-orange-300">Shocking Reality:</span> Since 1970, the US dollar has lost 
                          87% of its purchasing power. What cost $100 in 1970 now costs $770. Your grandfather's dollar had 8 times 
                          more buying power than yours today.
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-semibold text-white">Interactive Features You'll Experience:</h5>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <DollarSign className="w-5 h-5 text-green-400" />
                            <div>
                              <p className="font-medium text-white text-sm">Real-Time Erosion</p>
                              <p className="text-zinc-400 text-xs">Watch money disappear as years pass</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <BarChart3 className="w-5 h-5 text-yellow-400" />
                            <div>
                              <p className="font-medium text-white text-sm">Historical Chart</p>
                              <p className="text-zinc-400 text-xs">50+ years of authentic data</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <Calendar className="w-5 h-5 text-blue-400" />
                            <div>
                              <p className="font-medium text-white text-sm">Key Events</p>
                              <p className="text-zinc-400 text-xs">Nixon Shock, financial crises</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <Target className="w-5 h-5 text-orange-400" />
                            <div>
                              <p className="font-medium text-white text-sm">Fed Target</p>
                              <p className="text-zinc-400 text-xs">2% annual theft by design</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center pt-2">
                        <Button
                          onClick={() => {
                            const simulator = document.querySelector('[data-inflation-simulator]');
                            if (simulator) {
                              simulator.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
                        >
                          <ChevronDown className="w-4 h-4 mr-2" />
                          See Inflation's Damage
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Streamlined Control Center */}
                <Card className="bg-zinc-900 border-zinc-800" data-inflation-simulator>
                  <CardContent className="p-6">
                    <div className="space-y-8">
                      {/* All Controls in One Row */}
                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Money Amount Buttons */}
                        <div className="space-y-3">
                          <label className="block text-white font-bold text-center">
                            Your Money: ${parseFloat(inflationAmount).toLocaleString() || '10,000'}
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[1000, 5000, 10000, 25000, 50000, 100000].map((amount) => (
                              <Button
                                key={amount}
                                variant={inflationAmount === amount.toString() ? "default" : "outline"}
                                size="sm"
                                onClick={() => setInflationAmount(amount.toString())}
                                className={`text-xs py-2 ${
                                  inflationAmount === amount.toString() 
                                    ? "bg-orange-600 hover:bg-orange-700 text-white border-orange-600" 
                                    : "border-zinc-700 text-zinc-300 hover:border-orange-500 hover:text-orange-300"
                                }`}
                              >
                                ${amount >= 1000 ? `${amount/1000}K` : amount}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Inflation Rate Selector Cards */}
                        <div className="space-y-3">
                          <label className="block text-white font-bold text-center">
                            Annual Inflation Rate: {inflationRate}%
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              {
                                rate: 2,
                                title: "Fed Target",
                                description: "Government's 'ideal' inflation rate",
                                color: "blue",
                                period: "Policy Goal"
                              },
                              {
                                rate: 4,
                                title: "Moderate Rise",
                                description: "Economic heating up phase",
                                color: "yellow",
                                period: "Growth Period"
                              },
                              {
                                rate: 8.5,
                                title: "Recent Peak",
                                description: "COVID money printing aftermath",
                                color: "orange",
                                period: "2022-2024"
                              },
                              {
                                rate: 15,
                                title: "Crisis Level",
                                description: "Economic emergency territory",
                                color: "red",
                                period: "1970s-1980s"
                              }
                            ].map((scenario) => (
                              <div
                                key={scenario.rate}
                                onClick={() => setInflationRate(scenario.rate)}
                                className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                  inflationRate === scenario.rate
                                    ? `border-orange-500 bg-orange-600/20 shadow-lg shadow-orange-500/20`
                                    : `border-zinc-700 bg-zinc-800/50 hover:border-orange-400 hover:bg-orange-600/10`
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`font-bold text-lg ${
                                    scenario.color === 'blue' ? 'text-blue-400' :
                                    scenario.color === 'yellow' ? 'text-yellow-400' :
                                    scenario.color === 'orange' ? 'text-orange-400' :
                                    'text-red-400'
                                  }`}>
                                    {scenario.rate}%
                                  </span>
                                  <span className="text-xs text-zinc-400">{scenario.period}</span>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-white text-sm font-medium">{scenario.title}</p>
                                  <p className="text-zinc-400 text-xs leading-tight">{scenario.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Time Travel Slider - Main Interactive Element */}
                      <div className="space-y-4">
                        <div className="text-center space-y-2">
                          <h4 className="text-xl font-bold text-white">
                            ⏰ Time Travel: Year {inflationSliderYear}
                            {inflationSliderYear === 0 ? " (Today)" : ` (${inflationSliderYear} years from now)`}
                          </h4>
                          <p className="text-zinc-400 text-sm">
                            Drag the slider to watch inflation destroy your purchasing power
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          <input
                            type="range"
                            min="0"
                            max="30"
                            step="1"
                            value={inflationSliderYear}
                            onChange={(e) => setInflationSliderYear(parseInt(e.target.value))}
                            className="w-full h-6 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, 
                                #f97316 0%, 
                                #ea580c ${(inflationSliderYear / 30) * 100}%, 
                                #374151 ${(inflationSliderYear / 30) * 100}%, 
                                #374151 100%)`
                            }}
                          />
                          <div className="flex justify-between text-xs text-zinc-400">
                            <span>🟢 Today</span>
                            <span>🟠 15 Years</span>
                            <span>🔴 30 Years</span>
                          </div>
                        </div>
                      </div>

                      {/* Dynamic Visual Impact Display */}
                      <div className="bg-zinc-800/50 rounded-lg p-6">
                        <div className="grid gap-6 md:grid-cols-2">
                          {/* Animated Money Visualization */}
                          <div className="text-center space-y-4">
                            {(() => {
                              const currentAmount = parseFloat(inflationAmount) || 10000;
                              const futureValue = currentAmount / Math.pow(1 + inflationRate / 100, inflationSliderYear);
                              const fadeOpacity = Math.max(0.1, futureValue / currentAmount);
                              const remainingPercentage = (futureValue / currentAmount) * 100;
                              
                              return (
                                <>
                                  {/* Dollar Bill with Fade and Scale Effect */}
                                  <div 
                                    className="inline-block transition-all duration-700 ease-out transform"
                                    style={{ 
                                      opacity: fadeOpacity,
                                      transform: `scale(${0.5 + fadeOpacity * 0.5}) rotate(${(1 - fadeOpacity) * 15}deg)`
                                    }}
                                  >
                                    <svg width="200" height="80" className="drop-shadow-lg">
                                      <rect x="5" y="5" width="190" height="70" 
                                            fill="#1f2937" stroke="#22c55e" strokeWidth="2" rx="6"/>
                                      <text x="100" y="50" textAnchor="middle" 
                                            fill="#22c55e" fontSize="28" fontWeight="bold">$</text>
                                      <text x="100" y="20" textAnchor="middle" 
                                            fill="#22c55e" fontSize="6">FEDERAL RESERVE</text>
                                      <text x="100" y="70" textAnchor="middle" 
                                            fill="#22c55e" fontSize="6">UNITED STATES</text>
                                    </svg>
                                  </div>
                                  
                                  {/* Purchasing Power Display */}
                                  <div className="space-y-2">
                                    <div className="text-3xl font-bold">
                                      <span className={remainingPercentage > 50 ? "text-green-400" : 
                                                     remainingPercentage > 25 ? "text-orange-400" : "text-red-400"}>
                                        ${futureValue.toLocaleString('en-US', {maximumFractionDigits: 0})}
                                      </span>
                                    </div>
                                    <div className="text-sm text-zinc-300">
                                      {remainingPercentage.toFixed(1)}% purchasing power remaining
                                    </div>
                                    <div className="text-xs font-semibold">
                                      <span className={remainingPercentage > 80 ? "text-green-400" : 
                                                     remainingPercentage > 60 ? "text-yellow-400" :
                                                     remainingPercentage > 40 ? "text-orange-400" :
                                                     remainingPercentage > 20 ? "text-red-400" : "text-red-500"}>
                                        {inflationSliderYear === 0 ? "💪 Full Strength" : 
                                         remainingPercentage > 80 ? "💚 Still Strong" :
                                         remainingPercentage > 60 ? "⚠️ Weakening" :
                                         remainingPercentage > 40 ? "📉 Major Loss" :
                                         remainingPercentage > 20 ? "💸 Severely Damaged" :
                                         "💀 Nearly Worthless"}
                                      </span>
                                    </div>
                                  </div>
                                </>
                              );
                            })()}
                          </div>

                          {/* Real-World Price Impact */}
                          <div className="space-y-3">
                            <h5 className="text-white font-bold text-center mb-4">
                              What You Can Actually Buy
                            </h5>
                            {(() => {
                              const currentAmount = parseFloat(inflationAmount) || 10000;
                              const futureValue = currentAmount / Math.pow(1 + inflationRate / 100, inflationSliderYear);
                              
                              const examples = [
                                { icon: "🏠", item: "Rent", price: 2000, unit: "/mo" },
                                { icon: "🥛", item: "Milk", price: 4.50, unit: "/gal" },
                                { icon: "🥚", item: "Eggs", price: 3.50, unit: "/doz" },
                                { icon: "⛽", item: "Gas", price: 3.50, unit: "/gal" }
                              ];
                              
                              return examples.map((example, i) => {
                                const todayQuantity = Math.floor(currentAmount / example.price);
                                const futureQuantity = Math.floor(futureValue / example.price);
                                const lost = todayQuantity - futureQuantity;
                                
                                return (
                                  <div key={i} className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg transition-all duration-500">
                                    <div className="flex items-center gap-3">
                                      <span className="text-xl">{example.icon}</span>
                                      <span className="text-zinc-300 text-sm font-medium">{example.item}</span>
                                    </div>
                                    <div className="text-right space-y-1">
                                      <div className="text-sm font-bold">
                                        <span className={inflationSliderYear === 0 ? "text-green-400" : "text-orange-400"}>
                                          {(inflationSliderYear === 0 ? todayQuantity : futureQuantity).toLocaleString()}
                                        </span>
                                        <span className="text-zinc-500 text-xs ml-1">{example.unit}</span>
                                      </div>
                                      {inflationSliderYear > 0 && lost > 0 && (
                                        <div className="text-xs text-red-400 font-medium">
                                          -{lost.toLocaleString()} lost
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Simplified Historical Context Chart */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-bold text-white mb-4 text-center">
                      Real History: How $10,000 Lost 87% of Its Power (1970-2025)
                    </h4>
                    
                    <div className="bg-zinc-800/50 rounded-lg p-4">
                      <div className="relative h-48 w-full">
                        <svg viewBox="0 0 400 160" className="w-full h-full">
                          {/* Simple Grid */}
                          <defs>
                            <pattern id="simpleGrid" width="50" height="20" patternUnits="userSpaceOnUse">
                              <path d="M 50 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
                            </pattern>
                          </defs>
                          <rect width="400" height="160" fill="url(#simpleGrid)" />
                          
                          {/* Y-axis */}
                          <text x="15" y="15" fill="#9ca3af" fontSize="9">$10K</text>
                          <text x="15" y="85" fill="#9ca3af" fontSize="9">$5K</text>
                          <text x="15" y="155" fill="#9ca3af" fontSize="9">$0</text>
                          
                          {/* X-axis */}
                          <text x="60" y="155" fill="#9ca3af" fontSize="9">1970</text>
                          <text x="170" y="155" fill="#9ca3af" fontSize="9">1990</text>
                          <text x="280" y="155" fill="#9ca3af" fontSize="9">2010</text>
                          <text x="360" y="155" fill="#9ca3af" fontSize="9">2025</text>
                          
                          {/* Simplified Decline Line */}
                          <path
                            d="M 60,20 L 120,35 L 170,70 L 220,85 L 280,105 L 340,125 L 380,140"
                            stroke="#ef4444"
                            strokeWidth="4"
                            fill="none"
                            className="drop-shadow-sm"
                          />
                          
                          {/* Key Events - Simplified with animations */}
                          <circle cx="65" cy="25" r="4" fill="#f97316" className="animate-pulse"/>
                          <text x="70" y="15" fill="#f97316" fontSize="8" fontWeight="bold">Nixon</text>
                          
                          <circle cx="175" cy="70" r="4" fill="#ef4444" className="animate-pulse"/>
                          <text x="180" y="60" fill="#ef4444" fontSize="8" fontWeight="bold">80s Crisis</text>
                          
                          <circle cx="285" cy="105" r="4" fill="#dc2626" className="animate-pulse"/>
                          <text x="290" y="95" fill="#dc2626" fontSize="8" fontWeight="bold">2008 QE</text>
                          
                          <circle cx="375" cy="135" r="4" fill="#991b1b" className="animate-pulse"/>
                          <text x="320" y="125" fill="#991b1b" fontSize="8" fontWeight="bold">COVID Print</text>
                        </svg>
                      </div>
                      
                      <div className="mt-4 text-center">
                        <p className="text-zinc-400 text-sm">
                          <span className="text-orange-400 font-bold">87% purchasing power lost</span> through monetary debasement
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Banking Fees vs Bitcoin Fees Simulator */}
            {isPremiumTier && simulationsSubTab === "fees" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">Banking Fees Calculator</h3>
                  <p className="text-zinc-400">See how much traditional banking really costs vs Bitcoin</p>
                </div>

                {/* Introduction Card */}
                <Card className="bg-gradient-to-r from-zinc-900 to-zinc-800 border-zinc-700">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <FileText className="w-8 h-8 text-orange-400 mt-1" />
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-lg font-bold text-white">The Hidden Cost of Traditional Banking</h4>
                        <p className="text-zinc-300 leading-relaxed">
                          Most people don't realize how much they pay in banking fees each year. The average American spends <span className="text-orange-400 font-semibold">$329 annually</span> on various banking fees, but heavy users of premium services can pay <span className="text-orange-400 font-semibold">thousands more</span>.
                        </p>
                        <p className="text-zinc-300 leading-relaxed">
                          This calculator helps you discover your real banking costs across all fee categories: account maintenance, wire transfers, ATM penalties, overdraft charges, international fees, paper statements, and credit card annual fees.
                        </p>
                        <div className="bg-zinc-800 rounded-lg p-4 border-l-4 border-orange-400">
                          <p className="text-zinc-200 text-sm font-medium">
                            💡 <span className="text-orange-400">Pro Tip:</span> Bitcoin eliminates most of these fees entirely. Compare your current banking costs to see potential annual savings with Bitcoin's transparent, low-cost network.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Interactive Fee Calculator */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* User Input Controls */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white">Monthly Account Fees</label>
                          <Select value={monthlyFee} onValueChange={setMonthlyFee}>
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700">
                              <SelectItem value="0">$0 (Online/Credit Union)</SelectItem>
                              <SelectItem value="12">$12 (Basic Checking)</SelectItem>
                              <SelectItem value="25">$25 (Premium Account)</SelectItem>
                              <SelectItem value="35">$35 (Premium Plus)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white">Wire Transfers per Month</label>
                          <Select value={wireTransfers} onValueChange={setWireTransfers}>
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700">
                              <SelectItem value="0">0 transfers</SelectItem>
                              <SelectItem value="1">1 transfer</SelectItem>
                              <SelectItem value="2">2 transfers</SelectItem>
                              <SelectItem value="4">4 transfers</SelectItem>
                              <SelectItem value="8">8 transfers</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white">ATM Usage (Out-of-Network)</label>
                          <Select value={atmFees} onValueChange={setAtmFees}>
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700">
                              <SelectItem value="0">0 times per month</SelectItem>
                              <SelectItem value="2">2 times per month</SelectItem>
                              <SelectItem value="4">4 times per month</SelectItem>
                              <SelectItem value="8">8 times per month</SelectItem>
                              <SelectItem value="15">15 times per month</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white">Overdraft Incidents</label>
                          <Select value={overdraftFees} onValueChange={setOverdraftFees}>
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700">
                              <SelectItem value="0">Never</SelectItem>
                              <SelectItem value="1">1 per month</SelectItem>
                              <SelectItem value="2">2 per month</SelectItem>
                              <SelectItem value="3">3 per month</SelectItem>
                              <SelectItem value="6">6 per month</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white">International Transactions</label>
                          <Select value={internationalFees} onValueChange={setInternationalFees}>
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700">
                              <SelectItem value="0">None</SelectItem>
                              <SelectItem value="200">$200 per month</SelectItem>
                              <SelectItem value="500">$500 per month</SelectItem>
                              <SelectItem value="1000">$1,000 per month</SelectItem>
                              <SelectItem value="2000">$2,000 per month</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white">Paper Statements & Checks</label>
                          <Select value={paperFees} onValueChange={setPaperFees}>
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700">
                              <SelectItem value="0">All digital</SelectItem>
                              <SelectItem value="5">Paper statements</SelectItem>
                              <SelectItem value="15">Paper + check orders</SelectItem>
                              <SelectItem value="25">Full paper service</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white">Credit Card Annual Fees</label>
                          <Select value={creditCardFees} onValueChange={setCreditCardFees}>
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700">
                              <SelectItem value="0">No annual fee cards</SelectItem>
                              <SelectItem value="95">$95 (Basic rewards card)</SelectItem>
                              <SelectItem value="250">$250 (Premium travel card)</SelectItem>
                              <SelectItem value="450">$450 (Chase Sapphire Reserve)</SelectItem>
                              <SelectItem value="550">$550 (Platinum Card)</SelectItem>
                              <SelectItem value="695">$695 (Business Platinum)</SelectItem>
                              <SelectItem value="950">$950 (Multiple premium cards)</SelectItem>
                              <SelectItem value="1500">$1,500 (Heavy credit card user)</SelectItem>
                              <SelectItem value="2500">$2,500+ (Credit card maximalist)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white">ATM Withdrawals per Month</label>
                          <Select value={atmWithdrawals} onValueChange={setAtmWithdrawals}>
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700">
                              <SelectItem value="0">0 withdrawals</SelectItem>
                              <SelectItem value="4">4 withdrawals</SelectItem>
                              <SelectItem value="8">8 withdrawals</SelectItem>
                              <SelectItem value="12">12 withdrawals</SelectItem>
                              <SelectItem value="20">20+ withdrawals</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white">Overdraft Fees per Month</label>
                          <Select value={overdraftFees} onValueChange={setOverdraftFees}>
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700">
                              <SelectItem value="0">0 overdrafts</SelectItem>
                              <SelectItem value="1">1 overdraft</SelectItem>
                              <SelectItem value="2">2 overdrafts</SelectItem>
                              <SelectItem value="3">3+ overdrafts</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Results Comparison */}
                      <div className="grid gap-4 md:grid-cols-2">
                        {/* Traditional Banking Costs */}
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Building2 className="w-5 h-5 text-red-400" />
                            <h4 className="font-semibold text-white">Traditional Banking</h4>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Monthly Account:</span>
                              <span className="text-white">${monthlyFee}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Wire Transfers:</span>
                              <span className="text-white">${parseInt(wireTransfers) * 25}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">ATM Fees (Out-of-Network):</span>
                              <span className="text-white">${parseInt(atmFees) * 4.75}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Overdraft Penalties:</span>
                              <span className="text-white">${parseInt(overdraftFees) * 35}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">International Fees (3%):</span>
                              <span className="text-white">${Math.round(parseInt(internationalFees) * 0.03)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Paper Statements/Checks:</span>
                              <span className="text-white">${paperFees}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Credit Card Annual Fee:</span>
                              <span className="text-white">${Math.round(parseInt(creditCardFees) / 12)}</span>
                            </div>
                            <hr className="border-red-500/30" />
                            <div className="flex justify-between font-semibold">
                              <span className="text-white">Monthly Total:</span>
                              <span className="text-red-400">${Math.round(
                                parseInt(monthlyFee) + 
                                parseInt(wireTransfers) * 25 + 
                                parseInt(atmFees) * 4.75 + 
                                parseInt(overdraftFees) * 35 +
                                parseInt(internationalFees) * 0.03 +
                                parseInt(paperFees) +
                                parseInt(creditCardFees) / 12
                              )}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                              <span className="text-white">Annual Cost:</span>
                              <span className="text-red-400">${Math.round(
                                (parseInt(monthlyFee) + 
                                parseInt(wireTransfers) * 25 + 
                                parseInt(atmFees) * 4.75 + 
                                parseInt(overdraftFees) * 35 +
                                parseInt(internationalFees) * 0.03 +
                                parseInt(paperFees)) * 12 +
                                parseInt(creditCardFees)
                              )}</span>
                            </div>
                          </div>
                        </div>

                        {/* Bitcoin Costs */}
                        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Bitcoin className="w-5 h-5 text-orange-400" />
                            <h4 className="font-semibold text-white">Bitcoin Network</h4>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Wallet Fees:</span>
                              <span className="text-white">$0</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">On-Chain Transfers:</span>
                              <span className="text-white">${parseInt(wireTransfers) * 2}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Lightning Payments:</span>
                              <span className="text-white">${(parseInt(atmFees) * 0.01).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Overdrafts/Penalties:</span>
                              <span className="text-white">$0</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">International (Same Rate):</span>
                              <span className="text-white">$0</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Paper Statements:</span>
                              <span className="text-white">$0</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Annual Fees:</span>
                              <span className="text-white">$0</span>
                            </div>
                            <hr className="border-orange-500/30" />
                            <div className="flex justify-between font-semibold">
                              <span className="text-white">Monthly Total:</span>
                              <span className="text-orange-400">${Math.round(parseInt(wireTransfers) * 2 + parseInt(atmFees) * 0.01)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                              <span className="text-white">Annual Cost:</span>
                              <span className="text-orange-400">${Math.round((parseInt(wireTransfers) * 2 + parseInt(atmFees) * 0.01) * 12)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Savings Summary */}
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                        <h4 className="font-bold text-white mb-2">Your Annual Savings with Bitcoin</h4>
                        <div className="text-3xl font-bold text-green-400">
                          ${(() => {
                            const bankingTotal = Math.round(
                              (parseInt(monthlyFee) + 
                              parseInt(wireTransfers) * 25 + 
                              parseInt(atmFees) * 4.75 + 
                              parseInt(overdraftFees) * 35 +
                              parseInt(internationalFees) * 0.03 +
                              parseInt(paperFees)) * 12 +
                              parseInt(creditCardFees)
                            );
                            const bitcoinTotal = Math.round((parseInt(wireTransfers) * 2 + parseInt(atmFees) * 0.01) * 12);
                            return bankingTotal - bitcoinTotal;
                          })()}
                        </div>
                        <p className="text-zinc-400 text-sm mt-2">
                          That's {(() => {
                            const bankingTotal = Math.round(
                              (parseInt(monthlyFee) + 
                              parseInt(wireTransfers) * 25 + 
                              parseInt(atmFees) * 4.75 + 
                              parseInt(overdraftFees) * 35 +
                              parseInt(internationalFees) * 0.03 +
                              parseInt(paperFees)) * 12 +
                              parseInt(creditCardFees)
                            );
                            const bitcoinTotal = Math.round((parseInt(wireTransfers) * 2 + parseInt(atmFees) * 0.01) * 12);
                            const savings = bankingTotal - bitcoinTotal;
                            return bankingTotal > 0 ? Math.round((savings / bankingTotal) * 100) : 0;
                          })()}% savings per year
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* More section */}
            {activeSection === "more" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">More Tools & Resources</h3>
                  <p className="text-zinc-400">Additional Bitcoin tools and resources</p>
                </div>

                {/* Banking Fees Calculator Section */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-bold text-white mb-4">Banking Fees Calculator</h4>
                    <div className="space-y-4">
                      <p className="text-zinc-300">
                        Average American pays $329 per year in banking fees. See how much banks are costing you compared to Bitcoin.
                      </p>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="bg-zinc-800 p-4 rounded-lg">
                          <h5 className="font-semibold text-red-400 mb-2">Traditional Banking Fees</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-zinc-300">Monthly maintenance:</span>
                              <span className="text-red-400">$15/month</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-300">ATM fees:</span>
                              <span className="text-red-400">$4.75/use</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-300">Wire transfer:</span>
                              <span className="text-red-400">$25-50/wire</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-300">Overdraft:</span>
                              <span className="text-red-400">$35/overdraft</span>
                            </div>
                            <div className="flex justify-between border-t border-zinc-700 pt-2">
                              <span className="text-zinc-300 font-bold">Annual average:</span>
                              <span className="text-red-400 font-bold">$329/year</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-zinc-800 p-4 rounded-lg">
                          <h5 className="font-semibold text-orange-400 mb-2">Bitcoin Network Costs</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-zinc-300">Account maintenance:</span>
                              <span className="text-green-400">$0</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-300">Balance checks:</span>
                              <span className="text-green-400">$0</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-300">Network fee:</span>
                              <span className="text-orange-400">$1-5/transaction</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-300">Overdraft protection:</span>
                              <span className="text-green-400">Impossible</span>
                            </div>
                            <div className="flex justify-between border-t border-zinc-700 pt-2">
                              <span className="text-zinc-300 font-bold">Annual average:</span>
                              <span className="text-green-400 font-bold">$20-50/year</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="bg-orange-600/20 p-4 rounded-lg border border-orange-600/30">
                          <h5 className="text-orange-400 font-bold text-lg mb-1">You could save $280-310 per year</h5>
                          <p className="text-orange-300 text-sm">That's enough for a hardware wallet and a nice dinner!</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>
            )}
          </div>
        )}

        {/* More Section */}
        {activeSection === "more" && (
          <MoreSection 
            moreSubTab={moreSubTab}
            setMoreSubTab={setMoreSubTab}
          />
        )}
      </main>
      
      {/* Development Tools - Hidden for deployment */}
      
      {/* Removed floating upgrade modal - now using inline upgrade cards */}

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeSection={activeSection}
        onSectionChange={(section) => {
          // Map navigation section names to MainSection type
          let mappedSection: MainSection;
          if (section === 'simulators') mappedSection = 'simulations';
          else mappedSection = section as MainSection;
          
          setActiveSection(mappedSection);
          if (section === 'learn') setLocation('/learn');
          else if (section === 'money') setLocation('/money');
          else if (section === 'simulators') setLocation('/simulators');
          else if (section === 'more') setLocation('/more');
        }}
      />

      {/* Email Collection Modal */}
      <EmailCollectionModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        trigger="simulator"
        lockedFeature="Premium Simulators"
      />
      
      {/* Bottom padding to accommodate navigation */}
      <div className="h-20"></div>
    </div>
  );
}
