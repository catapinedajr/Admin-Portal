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

  const { data: user } = useQuery<User>({
    queryKey: ['/api/user'],
  });





  // Splash Screen
  if (showSplash) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-6 transform rotate-3">
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-white">BTC</span>
              </div>
            </div>
            <div className="absolute -inset-4 bg-orange-400/20 rounded-full animate-ping"></div>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-white">BTC Journey</h1>
            <p className="text-zinc-400 text-lg">Building your Bitcoin knowledge...</p>
            <div className="flex justify-center">
              <div className="text-xs text-zinc-500 bg-zinc-800/50 px-3 py-1 rounded-full">
                Learn • Grow • Succeed
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



        {/* Learn Section */}
        {activeSection === "learn" && (
          <div className="space-y-6">
            {/* Learn Sub-navigation */}
            <div className="flex justify-center">
              <div className="flex flex-wrap justify-center gap-2 bg-zinc-800/50 rounded-lg p-2">
                <Button
                  variant={learnSubTab === "today" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setLearnSubTab("today")}
                  className="text-xs px-3 py-1"
                >
                  Today
                </Button>



                <Button
                  variant={learnSubTab === "reference" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setLearnSubTab("reference")}
                  className="text-xs px-3 py-1"
                >
                  Reference
                </Button>

              </div>
            </div>






            {/* Development Content Management Navigation - Hidden for deployment */}

            {/* Today's Learning */}
            {learnSubTab === "today" && (
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  {/* Streamlined Header with Better Hierarchy */}
                  {dayMetadata && (
                    <div className="space-y-3">
                      {/* Monthly Theme - Subtle Badge */}
                      <div className="inline-flex items-center px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
                        <span className="text-orange-400 text-sm font-medium uppercase tracking-wide">
                          {dayMetadata.theme}
                        </span>
                      </div>
                      
                      {/* Daily Topic - Main Title */}
                      <h2 className="text-2xl font-bold text-white leading-tight">
                        {dayMetadata.title}
                      </h2>
                    </div>
                  )}
                </div>



                {/* Paywall Check */}
                {isDayLockedBySubscription && (
                  <Card className="bg-zinc-900/95 border-orange-500/20">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        Day {currentDayIndex + 1} - Premium Content
                      </h3>
                      <p className="text-zinc-400 mb-4">
                        You've completed the free 7-day introduction! Continue with premium access to unlock the complete 30-day Bitcoin curriculum.
                      </p>
                      <Button 
                        onClick={() => {
                          // Direct upgrade action instead of modal
                          setTimeout(() => {
                            setSubscriptionTier('premium');
                          }, 1000);
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                      >
                        Continue Free - Limited Time
                      </Button>
                      <p className="text-xs text-zinc-500 mt-3">
                        Free for a limited timeuring beta testing
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Daily Facts - Only show if not locked by subscription */}
                {!isDayLockedBySubscription && dailyFacts && Array.isArray(dailyFacts) && dailyFacts.length > 0 && (
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-white border-b border-zinc-700 pb-3 mb-6">Today's Learning Preview</h3>
                      <div className="space-y-4">
                        {(dailyFacts as any[]).map((fact: any) => {
                          const IconComponent = iconMap[fact.icon as keyof typeof iconMap] || Coins;

                          

                          

                          

                          
                          return (
                            <div key={fact.id} className="bg-zinc-800/50 rounded-lg overflow-hidden">
                              <div className="flex items-center gap-4 p-4">
                                <div className="p-2 bg-orange-600/20 rounded-lg flex-shrink-0">
                                  <IconComponent className="w-5 h-5 text-orange-400" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-white">{fact.title}</h4>

                                </div>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* No Lesson Available Message */}
                {!isDayLockedBySubscription && !lesson && (
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <h3 className="text-xl font-bold text-white">Content Coming Soon</h3>
                        <p className="text-zinc-400">Lesson content for Day {currentDayIndex} is not yet available. Please check back later or navigate to a different day.</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Enhanced Daily Lesson - Only show if not locked by subscription */}
                {!isDayLockedBySubscription && lesson && (
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {/* Lesson Header */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-bold text-white border-b border-zinc-700 pb-3">Today's Lesson</h3>
                          <div className="flex items-start justify-between gap-4">
                            <h4 className="text-xl font-bold text-white leading-tight flex-1">{(lesson as LessonWithKeyTakeaways).title}</h4>
                            <Badge variant="outline" className="border-zinc-700 text-zinc-400 flex-shrink-0">
                              <Clock className="w-3 h-3 mr-1" />
                              {(lesson as LessonWithKeyTakeaways).estimatedReadTime || 3} min read
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Database-driven Lesson Content */}
                        <div className="prose prose-invert max-w-none space-y-6">
                          <div className="text-zinc-300 leading-relaxed space-y-4 text-base leading-[1.8]">
                            <div>
                              {cleanText((lesson as LessonWithKeyTakeaways).content)}
                            </div>
                          </div>
                          

                          {/* Database-driven Key Takeaways */}
                          {(lesson as LessonWithKeyTakeaways).keyTakeaways && Array.isArray((lesson as LessonWithKeyTakeaways).keyTakeaways) && (lesson as LessonWithKeyTakeaways).keyTakeaways.length > 0 && (
                            <div className="my-6">
                              <h5 className="font-medium text-orange-300 mb-3">Key Points</h5>
                              <div className="grid gap-2">
                                {(lesson as LessonWithKeyTakeaways).keyTakeaways.map((point, pointIdx) => (
                                  <div key={pointIdx} className="flex items-start gap-2 p-2 bg-orange-600/10 rounded-lg border border-orange-600/20">
                                    <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-orange-100 text-sm leading-relaxed">{point}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Why This Matters - Database-driven */}
                        <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700 mt-8">
                          <h4 className="text-white font-semibold mb-6 text-lg">Why This Matters</h4>
                          <div className="text-zinc-300 text-base leading-[1.7]">
                            <div>
                              {cleanText((lesson as LessonWithKeyTakeaways).whyItMatters || "Understanding these fundamentals helps you make informed decisions about Bitcoin and see why it represents a significant advancement in monetary technology.")}
                            </div>
                          </div>
                        </div>

                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Daily Quiz - Only show if not locked by subscription */}
                {!isDayLockedBySubscription && (
                  <div data-testid="daily-quiz">
                    <DailyQuiz 
                      dayIndex={currentDayIndex} 
                      onCompletion={handleQuizCompletion}
                    />
                  </div>
                )}
              </div>
            )}






            {/* Reference Section */}
            {learnSubTab === "reference" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">Bitcoin Reference Guide</h3>
                  <p className="text-zinc-400">Essential terminology and concepts for understanding Bitcoin</p>
                </div>

                {/* Glossary Categories */}
                <div className="grid gap-6">
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Coins className="w-5 h-5 text-orange-400" />
                        Core Concepts
                      </h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {bitcoinTerms.slice(0, 4).map((term, index) => (
                          <div key={index} className="p-3 bg-zinc-800/50 rounded-lg">
                            <h5 className="font-semibold text-orange-300 mb-1">{term.term}</h5>
                            <p className="text-zinc-300 text-sm">{term.definition}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-400" />
                        Security & Storage
                      </h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {bitcoinTerms.slice(4, 8).map((term, index) => (
                          <div key={index} className="p-3 bg-zinc-800/50 rounded-lg">
                            <h5 className="font-semibold text-blue-300 mb-1">{term.term}</h5>
                            <p className="text-zinc-300 text-sm">{term.definition}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Bitcoin Whitepaper Section */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-600/20 rounded-lg">
                          <FileText className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white">Bitcoin Whitepaper</h4>
                          <p className="text-zinc-400 text-sm">Original paper by Satoshi Nakamoto (October 31, 2008)</p>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-zinc-800/50 rounded-lg border-l-4 border-orange-500">
                        <h5 className="font-semibold text-orange-300 mb-2">Abstract</h5>
                        <p className="text-zinc-300 text-sm italic leading-relaxed">
                          "A purely peer-to-peer version of electronic cash would allow online payments to be sent directly from one party to another without going through a financial institution."
                        </p>
                      </div>
                      
                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="p-3 bg-zinc-800/30 rounded-lg text-center">
                          <FileText className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                          <h6 className="font-medium text-white text-sm">9 Pages</h6>
                          <p className="text-zinc-400 text-xs">Original length</p>
                        </div>
                        <div className="p-3 bg-zinc-800/30 rounded-lg text-center">
                          <Calendar className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                          <h6 className="font-medium text-white text-sm">2008</h6>
                          <p className="text-zinc-400 text-xs">Publication year</p>
                        </div>
                        <div className="p-3 bg-zinc-800/30 rounded-lg text-center">
                          <Users className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                          <h6 className="font-medium text-white text-sm">Satoshi</h6>
                          <p className="text-zinc-400 text-xs">Anonymous author</p>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.open('https://bitcoin.org/bitcoin.pdf', '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Read Full Whitepaper
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Finance Section */}
        {activeSection === "money" && (
          <div className="space-y-8">
            {/* Hero Narrative */}
            <Card className="bg-gradient-to-br from-orange-950/30 via-zinc-900 to-red-950/30 border-orange-800/50">
              <CardContent className="p-8">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Your Money Is Being <span className="text-red-400">Silently Stolen</span>
                  </h2>
                  
                  <div className="text-lg text-zinc-300 leading-relaxed space-y-4">
                    <p>
                      Every day you wait, your savings lose purchasing power. It's not your fault—the system is rigged. 
                      Central banks print money endlessly, devaluing your hard-earned dollars while the wealthy protect 
                      themselves with assets that can't be printed.
                    </p>
                    
                    <p>
                      <span className="text-orange-400 font-semibold">What cost $1 in 1920 now costs $15.50.</span> Your 
                      great-grandparents could buy a house with one income and still save money. Today, two incomes barely 
                      cover rent. This isn't progress—it's systematic wealth transfer from savers to money printers.
                    </p>
                    
                    <p>
                      But there's an escape route. For the first time in human history, we have <span className="text-orange-400 font-semibold">
                      mathematically perfect money</span> that can't be inflated away. Bitcoin isn't just digital gold—it's 
                      the antidote to monetary debasement.
                    </p>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-3 mt-8">
                    <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                      <div className="text-orange-300 font-bold text-xl">21 Million</div>
                      <div className="text-zinc-300 text-sm">Bitcoin's Maximum Supply</div>
                      <div className="text-zinc-400 text-xs mt-1">No central bank can print more</div>
                    </div>
                    
                    <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                      <div className="text-orange-300 font-bold text-xl">0%</div>
                      <div className="text-zinc-300 text-sm">Bitcoin Inflation Rate</div>
                      <div className="text-zinc-400 text-xs mt-1">After all 21M are mined</div>
                    </div>
                    
                    <div className="p-4 bg-orange-950/50 rounded-xl border border-orange-800/50">
                      <div className="text-orange-300 font-bold text-xl">100%</div>
                      <div className="text-orange-400/80 text-sm">You Own Your Bitcoin</div>
                      <div className="text-zinc-400 text-xs mt-1">No bank can freeze it</div>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-orange-950/20 rounded-xl border border-orange-800/30">
                    <div className="text-orange-300 font-semibold mb-2">
                      Choose: lose to inflation, or learn sound money.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Money Supply Erosion Visualization */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-3 text-xl">
                  <TrendingDown className="w-5 h-5 text-orange-400" />
                  How Much Money Has Been Printed Over Time
                </CardTitle>
                <p className="text-zinc-400 text-sm">See how the government has created more and more dollars since 1920, making each dollar worth less</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Year Selection Buttons */}
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-orange-400 font-bold text-2xl">{moneySupplyYear}</span>
                    <p className="text-zinc-400 text-sm mt-1">Select a year to explore</p>
                  </div>
                  
                  {/* Clean milestone buttons */}
                  <div className="grid grid-cols-5 gap-1.5">
                    {[
                      { year: 1920, label: "'20", desc: "Gold Era" },
                      { year: 1971, label: "'71", desc: "Nixon" },
                      { year: 2000, label: "'00", desc: "Dot-com" },
                      { year: 2008, label: "'08", desc: "Crisis" },
                      { year: 2024, label: "'25", desc: "Today" }
                    ].map((milestone) => (
                      <button
                        key={milestone.year}
                        onClick={() => setMoneySupplyYear(milestone.year)}
                        className={`p-2 rounded-md border transition-all duration-200 ${
                          moneySupplyYear === milestone.year
                            ? 'bg-orange-600/20 border-orange-500 text-orange-300'
                            : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
                        }`}
                      >
                        <div className="font-semibold text-sm">{milestone.label}</div>
                        <div className="text-xs opacity-75">{milestone.desc}</div>
                      </button>
                    ))}
                  </div>

                  {/* Key Statistics Display */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-orange-400 transition-all duration-700">
                        ${getMoneySupplyRaw(moneySupplyYear)}T
                      </div>
                      <div className="text-zinc-400 text-xs">Total Dollars in Circulation</div>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-orange-400 transition-all duration-700">
                        {Math.round(getMoneySupplyRaw(moneySupplyYear) / getMoneySupplyRaw(1920))}x
                      </div>
                      <div className="text-zinc-400 text-xs">More Money Since 1920</div>
                    </div>
                  </div>
                </div>

                {/* Simplified Chart */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-orange-400" />
                    Total Supply of Dollars
                  </h4>
                  <div className="bg-zinc-800/50 rounded-lg p-6">
                    <div className="relative h-56 w-full">
                      {/* Clean SVG Chart */}
                      <svg viewBox="0 0 400 220" className="w-full h-full">
                        {/* Simple background */}
                        <rect width="400" height="220" fill="transparent" />
                        
                        {/* Y-axis labels */}
                        <text x="10" y="15" fill="#9ca3af" fontSize="10">$21.2T</text>
                        <text x="10" y="55" fill="#9ca3af" fontSize="10">$15T</text>
                        <text x="10" y="95" fill="#9ca3af" fontSize="10">$10T</text>
                        <text x="10" y="135" fill="#9ca3af" fontSize="10">$5T</text>
                        <text x="10" y="175" fill="#9ca3af" fontSize="10">$0</text>
                        
                        {/* X-axis labels - Evenly spaced per year for dramatic accuracy */}
                        <text x="50" y="205" fill="#9ca3af" fontSize="10" textAnchor="middle">1920</text>
                        <text x="140" y="205" fill="#9ca3af" fontSize="10" textAnchor="middle">1960</text>
                        <text x="230" y="205" fill="#9ca3af" fontSize="10" textAnchor="middle">1990</text>
                        <text x="320" y="205" fill="#9ca3af" fontSize="10" textAnchor="middle">2010</text>
                        <text x="370" y="205" fill="#9ca3af" fontSize="10" textAnchor="middle">2025</text>
                        
                        {/* Money Supply Growth Line - Using Real Federal Reserve Data */}
                        <path
                          d={(() => {
                            // Real M2 data points (in billions then trillions): Year -> M2 Value
                            const m2Data = [
                              { year: 1920, m2: 0.023 },   // Gold Standard era ($23B)
                              { year: 1929, m2: 0.026 },   // Pre-Depression ($26B)
                              { year: 1933, m2: 0.020 },   // Depression low ($20B)
                              { year: 1940, m2: 0.040 },   // Pre-WWII ($40B)
                              { year: 1945, m2: 0.107 },   // Post-WWII expansion ($107B)
                              { year: 1950, m2: 0.117 },   // Korean War ($117B)
                              { year: 1960, m2: 0.167 },   // 60s growth ($167B)
                              { year: 1971, m2: 0.583 },   // Nixon Shock baseline ($583B)
                              { year: 1980, m2: 1.600 },   // Early 80s ($1.6T)
                              { year: 1990, m2: 3.200 },   // 90s expansion ($3.2T)
                              { year: 2000, m2: 4.900 },   // Dot-com era ($4.9T)
                              { year: 2008, m2: 7.500 },   // Pre-crisis ($7.5T)
                              { year: 2010, m2: 8.700 },   // Post-crisis QE1 ($8.7T)
                              { year: 2015, m2: 12.400 },  // QE era ($12.4T)
                              { year: 2020, m2: 15.400 },  // Pre-COVID ($15.4T)
                              { year: 2021, m2: 20.100 },  // COVID peak ($20.1T)
                              { year: 2024, m2: 21.000 },  // 2024 ($21T)
                              { year: 2025, m2: 21.200 }   // Current estimate ($21.2T)
                            ];
                            
                            return m2Data.map((point, index) => {
                              // Linear time positioning: 3.048px per year (320px / 105 years)
                              const x = 50 + ((point.year - 1920) / 105) * 320;
                              const y = 175 - ((point.m2 - 0.023) / (21.2 - 0.023)) * 155;
                              return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                            }).join(' ');
                          })()}
                          fill="none"
                          stroke="#f97316"
                          strokeWidth="3"
                        />
                        
                        {/* Fill area under curve */}
                        <path
                          d={(() => {
                            const m2Data = [
                              { year: 1920, m2: 0.023 }, { year: 1929, m2: 0.026 }, { year: 1933, m2: 0.020 },
                              { year: 1940, m2: 0.040 }, { year: 1945, m2: 0.107 }, { year: 1950, m2: 0.117 },
                              { year: 1960, m2: 0.167 }, { year: 1971, m2: 0.583 }, { year: 1980, m2: 1.600 },
                              { year: 1990, m2: 3.200 }, { year: 2000, m2: 4.900 }, { year: 2008, m2: 7.500 },
                              { year: 2010, m2: 8.700 }, { year: 2015, m2: 12.400 }, { year: 2020, m2: 15.400 },
                              { year: 2021, m2: 20.100 }, { year: 2024, m2: 21.000 }
                            ];
                            
                            const pathData = m2Data.map((point, index) => {
                              // Linear time positioning: 3.077px per year (320px / 104 years)
                              const x = 50 + ((point.year - 1920) / 104) * 320;
                              const y = 175 - ((point.m2 - 0.023) / (21.0 - 0.023)) * 155;
                              return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                            }).join(' ');
                            
                            return `${pathData} L 370,180 L 50,180 Z`;
                          })()}
                          fill="url(#orangeGradient)"
                          opacity="0.3"
                        />
                        
                        {/* Gradient definition */}
                        <defs>
                          <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#f97316" stopOpacity="0.6"/>
                            <stop offset="100%" stopColor="#f97316" stopOpacity="0.1"/>
                          </linearGradient>
                        </defs>
                        
                        {/* Gold Standard Line */}
                        <g>
                          {(() => {
                            const nixonYear = 1971;
                            const nixonX = 50 + ((nixonYear - 1920) / 105) * 320;
                            return (
                              <g>
                                <line 
                                  x1={nixonX} 
                                  y1="20" 
                                  x2={nixonX} 
                                  y2="175" 
                                  stroke="#f97316" 
                                  strokeWidth="2" 
                                  strokeDasharray="5,5"
                                  opacity="0.6"
                                />
                                <text 
                                  x={nixonX - 35} 
                                  y="15" 
                                  fill="#f97316" 
                                  fontSize="8" 
                                  fontWeight="bold"
                                >
                                  Gold Standard Ends
                                </text>
                              </g>
                            );
                          })()}
                        </g>

                        {/* Current year indicator */}
                        <g>
                          <line 
                            x1={50 + ((moneySupplyYear - 1920) / 105) * 320} 
                            y1="10" 
                            x2={50 + ((moneySupplyYear - 1920) / 105) * 320} 
                            y2="180" 
                            stroke="#f97316" 
                            strokeWidth="2" 
                            strokeDasharray="4,4"
                          />
                          <circle 
                            cx={50 + ((moneySupplyYear - 1920) / (2025 - 1920)) * 320} 
                            cy={(() => {
                              // Get the actual M2 value for the selected year
                              const currentM2 = getMoneySupplyRaw(moneySupplyYear);
                              
                              // Convert to Y coordinate using same formula as line chart (1920-2024 range)
                              return 175 - ((currentM2 - 0.023) / (21.0 - 0.023)) * 155;
                            })()} 
                            r="5" 
                            fill="#f97316" 
                            stroke="#ffffff" 
                            strokeWidth="2"
                          />
                        </g>
                        

                        
                      </svg>
                    </div>
                    
                    {/* Emphasis Text */}
                    <div className="text-center mt-4 p-4 bg-zinc-800/30 rounded-lg border border-orange-400/20">
                      <div className="text-2xl font-bold">
                        <span className="text-zinc-300">THIS is </span>
                        <span className="text-orange-400 tracking-wider">INFLATION</span>
                      </div>
                      <p className="text-zinc-400 text-sm mt-2">
                        More dollars in circulation = each dollar is worth less
                      </p>
                    </div>

                  </div>
                </div>


              </CardContent>
            </Card>

            {/* Purchasing Power Erosion Simulator */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-3 text-xl">
                  <TrendingDown className="w-5 h-5 text-orange-400" />
                  Let's See What This Is Doing to Your Money
                </CardTitle>
                <p className="text-zinc-400 text-sm">See how $25,000 loses buying power over time</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {!inflationSimActive && inflationProgress === 0 && (
                  <div className="text-center space-y-4">
                    <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                      <p className="text-zinc-300 mb-3">
                        You saved <span className="text-orange-400 font-bold">$25,000</span>. 
                        Watch what happens to your money's buying power over 25 years.
                      </p>
                      <p className="text-zinc-400 text-sm">
                        This is what inflation does to your savings.
                      </p>
                    </div>
                    <Button 
                      onClick={startInflationSimulation}
                      className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-lg font-medium"
                    >
                      Show Me the Impact
                    </Button>
                  </div>
                )}

                {/* Conservative Savings vs Bitcoin Comparison */}
                {(inflationSimActive || inflationProgress > 0) && (
                  <div className="space-y-4">
                    {/* Narrative Introduction */}
                    <div className="text-center space-y-2">
                      <p className="text-zinc-300 text-sm font-medium">
                        The Tale of Two Strategies
                      </p>
                      <p className="text-zinc-400 text-xs leading-relaxed">
                        Your $25,000 faces two very different futures. Traditional savings slowly loses buying power to inflation, 
                        while Bitcoin has historically averaged over 100% annual growth. We're using a very conservative 25% growth rate below:
                      </p>
                    </div>
                    
                    {/* Compact Racing Animation */}
                    <div className="space-y-2">
                      {[
                        { step: 0, year: "Today", savings: 25000, btc: 25000, narrative: "Both start equal" },
                        { step: 1, year: "5 years", savings: 21562, btc: 76294, narrative: "Conservative 25% growth" },
                        { step: 2, year: "10 years", savings: 18584, btc: 232831, narrative: "Compound growth builds" },
                        { step: 3, year: "20 years", savings: 15342, btc: 2183468, narrative: "Two decades of growth" },
                        { step: 4, year: "25 years", savings: 13670, btc: 6781371, narrative: "Long-term holder rewards" }
                      ].map(({ step, year, savings, btc, narrative }) => {
                        const isActive = inflationProgress >= step;
                        
                        return (
                          <div key={step} className={`grid grid-cols-3 gap-2 p-2 rounded transition-all duration-700 ${
                            isActive ? 'bg-zinc-800/50' : 'bg-zinc-900/30'
                          }`}>
                            {/* Year Label */}
                            <div className={`text-sm font-medium flex items-center ${
                              isActive ? 'text-zinc-200' : 'text-zinc-500'
                            }`}>
                              {year}
                            </div>
                            
                            {/* Savings Bar */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className={isActive ? 'text-red-300' : 'text-zinc-500'}>Savings</span>
                                <span className={isActive ? 'text-red-200 font-bold' : 'text-zinc-500'}>
                                  ${savings.toLocaleString()}
                                </span>
                              </div>
                              <div className="bg-zinc-700 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-1000 ${
                                    isActive ? 'bg-red-500' : 'bg-zinc-600'
                                  }`}
                                  style={{ width: isActive ? `${(savings/25000)*100}%` : '100%' }}
                                ></div>
                              </div>
                            </div>
                            
                            {/* Bitcoin Bar */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className={isActive ? 'text-orange-300' : 'text-zinc-500'}>Bitcoin</span>
                                <span className={isActive ? 'text-orange-200 font-bold' : 'text-zinc-500'}>
                                  ${btc >= 1000000 ? `${(btc/1000000).toFixed(1)}M` : btc.toLocaleString()}
                                </span>
                              </div>
                              <div className="bg-zinc-700 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-1000 ${
                                    isActive ? 'bg-orange-500' : 'bg-zinc-600'
                                  }`}
                                  style={{ width: isActive ? `${Math.min((btc/2750000)*100, 100)}%` : '0%' }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Historical Performance Summary */}
                    {inflationProgress >= 5 && (
                      <div className="space-y-3 p-4 bg-zinc-800/30 rounded-lg border border-orange-400/20">
                        <div className="text-center">
                          <div className="text-orange-400 font-bold text-sm mb-2">Conservative 25% Growth Projection</div>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="text-center">
                              <div className="text-red-400 font-medium">Traditional Savings</div>
                              <div className="text-red-300 text-lg font-bold">$13,670</div>
                              <div className="text-red-400">Lost 45% to inflation</div>
                            </div>
                            <div className="text-center">
                              <div className="text-orange-400 font-medium">Conservative Bitcoin</div>
                              <div className="text-orange-300 text-lg font-bold">$6.8M</div>
                              <div className="text-orange-400">271x growth (25% annual)</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center pt-2 border-t border-zinc-700/50">
                          <p className="text-zinc-400 text-xs leading-relaxed">
                            Using a very conservative <span className="text-orange-400 font-medium">25% annual growth rate</span> compared to Bitcoin's historical 100%+ average. 
                            Past performance doesn't guarantee future results, but Bitcoin's fixed supply creates structural advantages over inflation.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>



            {/* Settlement Workflow Visualization */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-3 text-xl">
                  <Clock className="w-5 h-5 text-orange-400" />
                  Plus, it's faster and you stay in control
                </CardTitle>
                <p className="text-zinc-400 text-sm">Watch $50,000 travel from New York to London - see the complexity difference</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {!speedRaceActive && (
                  <div className="text-center space-y-4">
                    <div className="p-6 bg-zinc-800 rounded-lg border border-zinc-700">
                      <h3 className="text-lg font-medium text-white mb-3">Transfer Scenario</h3>
                      <p className="text-zinc-300 mb-4">
                        Your business needs to send <span className="text-orange-400 font-bold">$50,000</span> from 
                        Chase Bank (New York) to Wells Fargo (London) for an urgent deal.
                      </p>
                      <p className="text-zinc-400 text-sm">
                        Compare how traditional banking vs Bitcoin handles this international transfer.
                      </p>
                    </div>
                    <Button 
                      onClick={startSettlementAnimation}
                      className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-lg font-medium"
                    >
                      Initiate Transfer Race
                    </Button>
                  </div>
                )}

                {speedRaceActive && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <Button 
                        onClick={resetSettlementAnimation}
                        className="bg-orange-600 hover:bg-orange-700"
                        disabled={animationActive}
                      >
                        {animationActive ? "Animation Running..." : "Reset Journey"}
                      </Button>
                      {animationActive && (
                        <p className="text-zinc-400 text-sm mt-2">
                          Watch Bitcoin complete while traditional banking gets stuck...
                        </p>
                      )}
                    </div>
                    
                    {/* Compact Side-by-Side Settlement Race */}
                    <div className="space-y-4">
                      
                      {/* Headers */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-red-950/30 rounded-lg border border-red-800/30">
                          <Building2 className="w-5 h-5 text-red-400" />
                          <div>
                            <div className="text-red-300 font-bold text-sm">Traditional Banking</div>
                            <div className="text-zinc-400 text-xs">Complex, slow, expensive</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-green-950/30 rounded-lg border border-green-800/30">
                          <Zap className="w-5 h-5 text-green-400" />
                          <div>
                            <div className="text-green-300 font-bold text-sm">Bitcoin Network</div>
                            <div className="text-zinc-400 text-xs">Simple, fast, global</div>
                          </div>
                        </div>
                      </div>

                      {/* Processing Steps - Side by Side */}
                      <div className="space-y-3">
                        
                        {/* Step 1 Comparison */}
                        <div className="grid grid-cols-2 gap-4">
                          {/* Traditional Step 1 */}
                          <div className={`p-3 rounded-lg border transition-all duration-500 ${
                            settlementProgress.traditional >= 1 
                              ? 'bg-red-800/30 border-red-600/50' 
                              : 'bg-zinc-800 border-zinc-700'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-500 ${
                                settlementProgress.traditional >= 1 ? 'bg-red-500' : 'bg-zinc-600'
                              }`}>
                                {settlementProgress.traditional >= 1 ? '✓' : '1'}
                              </div>
                              <span className={`font-medium text-sm transition-colors duration-500 ${
                                settlementProgress.traditional >= 1 ? 'text-red-200' : 'text-zinc-400'
                              }`}>
                                Bank processes
                              </span>
                            </div>
                            <div className={`text-xs transition-colors duration-500 ${
                              settlementProgress.traditional >= 1 ? 'text-red-300' : 'text-zinc-500'
                            }`}>
                              Submitting paperwork and security checks
                            </div>
                            {settlementProgress.traditional === 1 && animationActive && (
                              <div className="mt-2 flex items-center gap-2 text-red-400 text-xs">
                                <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
                                Processing...
                              </div>
                            )}
                          </div>

                          {/* Bitcoin Step 1 - Enlarged */}
                          <div className={`p-4 rounded-lg border transition-all duration-500 min-h-[120px] ${
                            settlementProgress.bitcoin >= 1 
                              ? 'bg-green-800/30 border-green-600/50' 
                              : 'bg-zinc-800 border-zinc-700'
                          }`}>
                            <div className="flex items-center gap-2 mb-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-500 ${
                                settlementProgress.bitcoin >= 1 ? 'bg-green-500' : 'bg-zinc-600'
                              }`}>
                                {settlementProgress.bitcoin >= 1 ? '✓' : '1'}
                              </div>
                              <span className={`font-medium text-sm transition-colors duration-500 ${
                                settlementProgress.bitcoin >= 1 ? 'text-green-200' : 'text-zinc-400'
                              }`}>
                                Broadcast to Network
                              </span>
                            </div>
                            <div className={`text-xs mb-3 transition-colors duration-500 ${
                              settlementProgress.bitcoin >= 1 ? 'text-green-300' : 'text-zinc-500'
                            }`}>
                              Instantly broadcast to global network
                            </div>
                            {settlementProgress.bitcoin >= 1 && (
                              <div className="mt-2 flex items-center gap-2 text-green-400 text-xs bg-green-900/30 rounded px-2 py-1">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                ✅ Transaction globally visible
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Step 2 Comparison */}
                        <div className="grid grid-cols-2 gap-4">
                          {/* Traditional Step 2 */}
                          <div className={`p-3 rounded-lg border transition-all duration-500 ${
                            settlementProgress.traditional >= 2 
                              ? 'bg-red-800/30 border-red-600/50' 
                              : 'bg-zinc-800 border-zinc-700'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-500 ${
                                settlementProgress.traditional >= 2 ? 'bg-red-500' : 'bg-zinc-600'
                              }`}>
                                {settlementProgress.traditional >= 2 ? '✓' : '2'}
                              </div>
                              <span className={`font-medium text-sm transition-colors duration-500 ${
                                settlementProgress.traditional >= 2 ? 'text-red-200' : 'text-zinc-400'
                              }`}>
                                Waits for business day
                              </span>
                            </div>
                            <div className={`text-xs transition-colors duration-500 ${
                              settlementProgress.traditional >= 2 ? 'text-red-300' : 'text-zinc-500'
                            }`}>
                              Weekend delays and business hours only
                            </div>
                            {settlementProgress.traditional === 2 && animationActive && (
                              <div className="mt-2 flex items-center gap-2 text-red-400 text-xs">
                                <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
                                Waiting for Monday...
                              </div>
                            )}
                          </div>

                          {/* Bitcoin Step 2 - Double Height with Always Visible Miners */}
                          <div className={`p-4 rounded-lg border transition-all duration-500 min-h-[160px] ${
                            settlementProgress.bitcoin >= 2 
                              ? 'bg-green-800/30 border-green-600/50' 
                              : 'bg-zinc-800 border-zinc-700'
                          }`}>
                            <div className="flex items-center gap-2 mb-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-500 ${
                                settlementProgress.bitcoin >= 2 ? 'bg-green-500' : 'bg-zinc-600'
                              }`}>
                                {settlementProgress.bitcoin >= 2 ? '✓' : '2'}
                              </div>
                              <span className={`font-medium text-sm transition-colors duration-500 ${
                                settlementProgress.bitcoin >= 2 ? 'text-green-200' : 'text-zinc-400'
                              }`}>
                                Network Consensus
                              </span>
                            </div>
                            <div className={`text-xs mb-3 transition-colors duration-500 ${
                              settlementProgress.bitcoin >= 2 ? 'text-green-300' : 'text-zinc-500'
                            }`}>
                              Global miners validate transaction
                            </div>
                            
                            {/* Always Visible Miner Consensus Animation */}
                            {settlementProgress.bitcoin >= 2 && (
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-green-400 text-xs">
                                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                  Consensus achieved - transfer confirmed
                                </div>
                                
                                {/* Miner Grid - Always Visible */}
                                <div className="grid grid-cols-3 gap-1.5">
                                  {[1, 2, 3, 4, 5, 6].map((miner) => (
                                    <div
                                      key={miner}
                                      className="flex items-center gap-1 text-[10px] text-green-400 transition-all duration-300"
                                    >
                                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                      <span>Miner {miner}</span>
                                      <span className="text-green-400">✓</span>
                                    </div>
                                  ))}
                                </div>
                                
                                <div className="text-green-300 text-xs font-medium bg-green-900/30 rounded px-2 py-1">
                                  ✅ 6/6 global confirmations received
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Step 3 Comparison */}
                        <div className="grid grid-cols-2 gap-4">
                          {/* Traditional Step 3 */}
                          <div className={`p-3 rounded-lg border transition-all duration-500 ${
                            settlementProgress.traditional >= 3 
                              ? 'bg-red-800/30 border-red-600/50' 
                              : 'bg-zinc-800 border-zinc-700'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-500 ${
                                settlementProgress.traditional >= 3 ? 'bg-red-500' : 'bg-zinc-600'
                              }`}>
                                {settlementProgress.traditional >= 3 ? '✓' : '3'}
                              </div>
                              <span className={`font-medium text-sm transition-colors duration-500 ${
                                settlementProgress.traditional >= 3 ? 'text-red-200' : 'text-zinc-400'
                              }`}>
                                Still processing...
                              </span>
                            </div>
                            <div className={`text-xs transition-colors duration-500 ${
                              settlementProgress.traditional >= 3 ? 'text-red-300' : 'text-zinc-500'
                            }`}>
                              Multiple bank approvals needed
                            </div>
                          </div>

                          {/* Bitcoin Step 3 */}
                          <div className={`p-3 rounded-lg border transition-all duration-500 ${
                            settlementProgress.bitcoin >= 3 
                              ? 'bg-green-800/30 border-green-600/50' 
                              : 'bg-zinc-800 border-zinc-700'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-500 ${
                                settlementProgress.bitcoin >= 3 ? 'bg-green-500' : 'bg-zinc-600'
                              }`}>
                                {settlementProgress.bitcoin >= 3 ? '✓' : '3'}
                              </div>
                              <span className={`font-medium text-sm transition-colors duration-500 ${
                                settlementProgress.bitcoin >= 3 ? 'text-green-200' : 'text-zinc-400'
                              }`}>
                                Network Confirms Transfer
                              </span>
                            </div>
                            <div className={`text-xs transition-colors duration-500 ${
                              settlementProgress.bitcoin >= 3 ? 'text-green-300' : 'text-zinc-500'
                            }`}>
                              Network checks transfer • Adds to ledger
                            </div>
                            {settlementProgress.bitcoin === 3 && animationActive && (
                              <div className="mt-2 flex items-center gap-2 text-green-400 text-xs">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                Mining...
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Step 4 Comparison */}
                        <div className="grid grid-cols-2 gap-4">
                          {/* Traditional Step 4 */}
                          <div className={`p-3 rounded-lg border transition-all duration-500 ${
                            settlementProgress.traditional >= 4 
                              ? 'bg-red-800/30 border-red-600/50' 
                              : 'bg-zinc-800 border-zinc-700'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-500 ${
                                settlementProgress.traditional >= 4 ? 'bg-red-500' : 'bg-zinc-600'
                              }`}>
                                {settlementProgress.traditional >= 4 ? '✓' : '4'}
                              </div>
                              <span className={`font-medium text-sm transition-colors duration-500 ${
                                settlementProgress.traditional >= 4 ? 'text-red-200' : 'text-zinc-400'
                              }`}>
                                🏛 Government Bank Processing
                              </span>
                            </div>
                            <div className={`text-xs transition-colors duration-500 ${
                              settlementProgress.traditional >= 4 ? 'text-red-300' : 'text-zinc-500'
                            }`}>
                              Central bank approval • Currency exchange
                            </div>
                          </div>

                          {/* Bitcoin Step 4 */}
                          <div className={`p-3 rounded-lg border transition-all duration-500 ${
                            settlementProgress.bitcoin >= 4 
                              ? 'bg-green-800/30 border-green-600/50' 
                              : 'bg-zinc-800 border-zinc-700'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-500 ${
                                settlementProgress.bitcoin >= 4 ? 'bg-green-500' : 'bg-zinc-600'
                              }`}>
                                {settlementProgress.bitcoin >= 4 ? '✅' : '4'}
                              </div>
                              <span className={`font-medium text-sm transition-colors duration-500 ${
                                settlementProgress.bitcoin >= 4 ? 'text-green-200' : 'text-zinc-400'
                              }`}>
                                Transfer Complete
                              </span>
                            </div>
                            <div className={`text-xs transition-colors duration-500 ${
                              settlementProgress.bitcoin >= 4 ? 'text-green-300' : 'text-zinc-500'
                            }`}>
                              Money arrives • Permanent • Cannot be reversed
                            </div>
                            {settlementProgress.bitcoin === 4 && (
                              <div className="mt-2 flex items-center gap-2 text-green-400 text-xs font-medium">
                                🎉 Bitcoin transfer complete!
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Step 5 - Only Traditional Banking */}
                        <div className="grid grid-cols-2 gap-4">
                          {/* Traditional Step 5 */}
                          <div className={`p-3 rounded-lg border transition-all duration-500 ${
                            settlementProgress.traditional >= 5 
                              ? 'bg-red-800/30 border-red-600/50' 
                              : 'bg-zinc-800 border-zinc-700'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-500 ${
                                settlementProgress.traditional >= 5 ? 'bg-red-500' : 'bg-zinc-600'
                              }`}>
                                {settlementProgress.traditional >= 5 ? '✓' : '5'}
                              </div>
                              <span className={`font-medium text-sm transition-colors duration-500 ${
                                settlementProgress.traditional >= 5 ? 'text-red-200' : 'text-zinc-400'
                              }`}>
                                Final Bank Approval
                              </span>
                            </div>
                            <div className={`text-xs transition-colors duration-500 ${
                              settlementProgress.traditional >= 5 ? 'text-red-300' : 'text-zinc-500'
                            }`}>
                              Receiving bank review • Add money to account
                            </div>
                          </div>

                          {/* Bitcoin - Empty space (no 5th step needed) */}
                          <div></div>
                        </div>
                      </div>

                      {/* Status Summary */}
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="p-4 bg-red-950/40 rounded-lg border border-red-800/50">
                          <div className="text-center">
                            <div className="text-red-400 font-bold text-lg">
                              {settlementProgress.traditional === 0 && "Waiting..."}
                              {settlementProgress.traditional === 1 && "At Bank Branch"}
                              {settlementProgress.traditional === 2 && "Stuck in Compliance"}
                              {settlementProgress.traditional >= 3 && settlementProgress.traditional < 5 && "Still Processing..."}
                              {settlementProgress.traditional === 5 && "Finally Complete"}
                            </div>
                            <div className="text-zinc-400 text-xs mt-1">
                              Step {settlementProgress.traditional}/5 • Traditional Banking
                            </div>
                            <div className="text-red-300 text-xs mt-2 font-medium">
                              {settlementProgress.traditional === 2 && "Estimated: 3-5 business days"}
                              {settlementProgress.traditional === 5 && "Total time: 3-5 business days"}
                              {settlementProgress.traditional > 0 && settlementProgress.traditional < 2 && "Estimated: 3-5 business days"}
                              {settlementProgress.traditional > 2 && settlementProgress.traditional < 5 && "Estimated: 3-5 business days"}
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-green-950/40 rounded-lg border border-green-800/50">
                          <div className="text-center">
                            <div className="text-green-400 font-bold text-lg">
                              {settlementProgress.bitcoin === 0 && "Ready"}
                              {settlementProgress.bitcoin === 1 && "Creating..."}
                              {settlementProgress.bitcoin === 2 && "Broadcasting..."}
                              {settlementProgress.bitcoin === 3 && "Mining..."}
                              {settlementProgress.bitcoin === 4 && "✅ COMPLETE!"}
                            </div>
                            <div className="text-zinc-400 text-xs mt-1">
                              Step {settlementProgress.bitcoin}/4 • Bitcoin Network
                            </div>
                            <div className="text-green-300 text-xs mt-2 font-medium">
                              {settlementProgress.bitcoin === 4 && "Total time: ~10 minutes"}
                              {settlementProgress.bitcoin > 0 && settlementProgress.bitcoin < 4 && "Estimated: ~10 minutes"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Final Comparison */}
                    <div className="p-6 bg-gradient-to-r from-green-950/30 to-orange-950/30 rounded-xl border border-green-800/30">
                      <div className="text-center space-y-4">
                        <div className="text-orange-300 font-bold text-xl">The Difference is Clear</div>
                        
                        <div className="grid gap-4 md:grid-cols-3 text-center">
                          <div className="p-4 bg-zinc-800 rounded-lg">
                            <div className="text-green-400 font-bold text-2xl">432x</div>
                            <div className="text-zinc-300 text-sm">Faster Settlement</div>
                            <div className="text-zinc-500 text-xs">Days vs Minutes</div>
                          </div>
                          <div className="p-4 bg-zinc-800 rounded-lg">
                            <div className="text-green-400 font-bold text-2xl">93%</div>
                            <div className="text-zinc-300 text-sm">Lower Fees</div>
                            <div className="text-zinc-500 text-xs">$2-5 vs $45-75</div>
                          </div>
                          <div className="p-4 bg-zinc-800 rounded-lg">
                            <div className="text-green-400 font-bold text-2xl">0</div>
                            <div className="text-zinc-300 text-sm">Intermediaries</div>
                            <div className="text-zinc-500 text-xs">Direct vs 5+ Banks</div>
                          </div>
                        </div>
                        
                        <div className="text-zinc-300 leading-relaxed max-w-2xl mx-auto">
                          Traditional banking turns a simple transfer into a 5-institution relay race spanning days. 
                          Bitcoin eliminates all intermediaries with direct, cryptographic settlement in minutes. 
                          <span className="text-orange-400 font-medium">This is another reason why Bitcoin is the future of money.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>



            {/* Conclusion & Call to Action */}
            <div className="bg-zinc-900/50 rounded-lg p-8 border border-zinc-800/50">
              <h3 className="text-2xl font-bold mb-6 text-orange-400 text-center">The Choice Is Yours</h3>
              <div className="space-y-6 text-zinc-300 leading-relaxed max-w-4xl mx-auto">
                <p className="text-lg">
                  You've seen the math. Every day you hold dollars, you lose purchasing power to inflation. Every international 
                  transfer bleeds money to banking fees. Every "business day" delay costs you opportunity and freedom.
                </p>
                <p>
                  Bitcoin isn't just an investment—it's a complete financial system upgrade. Fixed supply instead of endless printing. 
                  Direct peer-to-peer transfers instead of middleman extraction. Mathematical certainty instead of central bank promises.
                </p>
                <p>
                  The wealthy already know this. Major corporations hold Bitcoin on their balance sheets. Entire nations have made 
                  it legal tender. Smart money is moving first, as it always does.
                </p>
                <p className="text-orange-300 font-medium text-lg text-center">
                  Your financial future depends on understanding this technology. The question isn't whether Bitcoin will succeed—
                  it's whether you'll learn about it before it's too late to matter.
                </p>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-orange-950/50 to-amber-950/50 border-orange-800/50">
              <CardContent className="p-8 text-center">
                <div className="max-w-2xl mx-auto space-y-6">
                  <h3 className="text-3xl font-bold text-white">Ready to Learn How Bitcoin Works?</h3>
                  <p className="text-zinc-300 text-lg">
                    Start with daily lessons, practice with real simulations, and understand why Bitcoin represents 
                    the future of money. Your financial education begins here.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={() => setActiveSection("learn")}
                      className="bg-orange-600 hover:bg-orange-700 px-8 py-4 text-lg font-medium h-auto"
                    >
                      Start Daily Bitcoin Lessons
                    </Button>
                    <Button 
                      onClick={() => setActiveSection("simulations")}
                      variant="outline"
                      className="border-orange-600 text-orange-400 hover:bg-orange-600/20 px-8 py-4 text-lg font-medium h-auto"
                    >
                      Practice with Simulators
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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

            {/* Wallet Explorer - Only show for premium users */}
            {isPremiumTier && simulationsSubTab === "wallet" && (
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

            {/* Safety Training - Only show for premium users */}
            {isPremiumTier && simulationsSubTab === "safety" && (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold text-white">Bitcoin Security Training Center</h3>
                  <p className="text-zinc-400">Master essential security skills to protect your Bitcoin from real-world threats</p>
                </div>

                {/* Why Safety Matters Introduction */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-red-600/20 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                      </div>
                      <h4 className="text-xl font-bold text-white">Why Bitcoin Security Matters</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-zinc-300 leading-relaxed">
                        Bitcoin puts you in complete control of your money, but with great power comes great responsibility. 
                        Unlike traditional banking where you can call customer service to recover lost funds, Bitcoin transactions 
                        are irreversible and there's no central authority to help if you make a mistake.
                      </p>
                      
                      <div className="bg-zinc-800/50 rounded-lg p-4 border-l-4 border-orange-500">
                        <p className="text-zinc-300 text-sm">
                          <span className="font-semibold text-orange-300">Critical Fact:</span> Over $2.1 billion in cryptocurrency 
                          was lost to scams and hacks in 2024. The good news? Nearly all of these losses were preventable with proper security knowledge.
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-semibold text-white">What You'll Find Below:</h5>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <Shield className="w-5 h-5 text-orange-400" />
                            <div>
                              <p className="font-medium text-white text-sm">Security Essentials</p>
                              <p className="text-zinc-400 text-xs">Complete guide covering all security fundamentals</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <Target className="w-5 h-5 text-orange-400" />
                            <div>
                              <p className="font-medium text-white text-sm">Security Simulator</p>
                              <p className="text-zinc-400 text-xs">Test your skills with 12 real-world scenarios</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center pt-2">
                        <Button
                          onClick={() => {
                            const simulator = document.getElementById('safety-skills-test');
                            if (simulator) {
                              simulator.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
                        >
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Skip to Security Simulator
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Essential Bitcoin Security Guidelines */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-orange-600/20 rounded-lg">
                        <Shield className="w-6 h-6 text-orange-400" />
                      </div>
                      <h4 className="text-xl font-bold text-white">Essential Bitcoin Security Guidelines</h4>
                    </div>

                    <div className="space-y-6">
                      {/* Private Key Security Fundamentals */}
                      <div className="space-y-3">
                        <h5 className="font-semibold text-white text-lg">Private Key Security Fundamentals</h5>
                        <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300 text-sm">Never share your private keys or seed phrases with anyone - not even support staff</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300 text-sm">Store seed phrases physically on paper or metal - never digitally or in photos</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300 text-sm">Screenshots of seed phrases can be stolen by malware or cloud backups</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300 text-sm">Private keys control your Bitcoin - losing them means losing your funds permanently</span>
                          </div>
                        </div>
                      </div>

                      {/* Exchange Safety Guidelines */}
                      <div className="space-y-3">
                        <h5 className="font-semibold text-white text-lg">Exchange Safety Guidelines</h5>
                        <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300 text-sm">Remember: Not your keys, not your coins - withdraw Bitcoin to your own wallet</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300 text-sm">Research exchange security history and reputation before using</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300 text-sm">Watch for exit scam warning signs: withdrawal delays, lack of communication</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300 text-sm">Understand withdrawal limits and verification requirements before depositing</span>
                          </div>
                        </div>
                      </div>

                      {/* Social Engineering Awareness */}
                      <div className="space-y-3">
                        <h5 className="font-semibold text-white text-lg">Social Engineering Awareness</h5>
                        <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300 text-sm">Fake giveaway scams: No legitimate person gives away Bitcoin for free</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300 text-sm">Impersonation attacks: Verify identities through official channels</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300 text-sm">Urgency tactics: Scammers create false deadlines to pressure quick decisions</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300 text-sm">Take time to research and verify before making Bitcoin transactions</span>
                          </div>
                        </div>
                      </div>

                      {/* Network Security Basics */}
                      <div className="space-y-3">
                        <h5 className="font-semibold text-white text-lg">Network Security Basics</h5>
                        <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300 text-sm">Avoid accessing Bitcoin wallets on public WiFi networks</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300 text-sm">Use VPN when accessing Bitcoin services on untrusted networks</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300 text-sm">Enable two-factor authentication and keep backup codes secure</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300 text-sm">Type wallet URLs directly - avoid clicking suspicious links</span>
                          </div>
                        </div>
                      </div>

                      {/* Hardware Wallet Best Practices */}
                      <div className="space-y-3">
                        <h5 className="font-semibold text-white text-lg">Hardware Wallet Best Practices</h5>
                        <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300 text-sm">Use hardware wallets for storing larger Bitcoin amounts long-term</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300 text-sm">Buy hardware wallets directly from manufacturers or authorized dealers</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300 text-sm">Initialize with fresh seed phrase - never use pre-generated seeds</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300 text-sm">Test recovery process with small amounts before storing large funds</span>
                          </div>
                          
                          <div className="flex justify-center mt-4 pt-3 border-t border-zinc-700">
                            <Button
                              onClick={() => setSimulationsSubTab("wallet")}
                              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 text-sm"
                            >
                              <Wallet className="w-4 h-4 mr-2" />
                              Wallet Simulator
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Software Security Essentials */}
                      <div className="space-y-3">
                        <h5 className="font-semibold text-white text-lg">Software Security Essentials</h5>
                        <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300 text-sm">Keep wallet software updated to latest security patches</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300 text-sm">Verify software downloads using digital signatures when available</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300 text-sm">Avoid counterfeit wallet apps - download from official sources only</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300 text-sm">Use dedicated computer for Bitcoin operations when handling large amounts</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>







                {/* Interactive Safety Skills Test */}
                <Card id="safety-skills-test" className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    {/* Content temporarily removed for approval */}
                    {/* Safety simulator functionality temporarily disabled */}
                    {false && !safetyCompleted ? (
                      <div className="space-y-6">
                        {/* Progress Indicator */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-3">
                            <h5 className="font-semibold text-white">Scenario {safetyStage + 1} of {safetySimulations.length}</h5>
                            <Badge variant="secondary">{safetyScore}/{safetyStage} correct</Badge>
                          </div>
                          <div className="flex flex-wrap gap-1 max-w-full">
                            {safetySimulations.map((_, index) => (
                              <div
                                key={index}
                                className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                  index < safetyStage ? 'bg-orange-500' : 
                                  index === safetyStage ? 'bg-orange-500' : 'bg-zinc-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Current Simulation */}
                        <Card className="bg-zinc-800 border-zinc-700">
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex justify-between items-center mb-3">
                              <h6 className="font-semibold text-white text-sm sm:text-base">{safetySimulations[safetyStage]?.title}</h6>
                              <span className="text-xs text-zinc-500">{safetyStage + 1}/12</span>
                            </div>
                            <p className="text-zinc-400 text-xs sm:text-sm mb-4 leading-relaxed">{safetySimulations[safetyStage]?.description}</p>

                            {/* Phishing Email Simulation */}
                            {safetyStage === 0 && (
                              <div className="space-y-3">
                                <div className="p-3 sm:p-4 bg-zinc-900 border border-zinc-600 rounded-lg">
                                  <div className="text-xs text-zinc-500 mb-3">Email Inbox - Which email is dangerous?</div>
                                  <div className="space-y-2">
                                    {safetySimulations[0]?.emails?.map((email, index) => (
                                      <button
                                        key={index}
                                        onClick={() => setSelectedOption(index)}
                                        className={`w-full p-2 sm:p-3 border rounded-lg text-left transition-colors ${
                                          selectedOption === index 
                                            ? 'border-orange-500 bg-orange-500/10' 
                                            : 'border-zinc-600 hover:border-zinc-500'
                                        }`}
                                      >
                                        <div className="flex justify-between items-start mb-1">
                                          <span className="text-white text-xs sm:text-sm font-medium truncate mr-2">{email.from}</span>
                                          <span className="text-zinc-500 text-xs shrink-0">Today</span>
                                        </div>
                                        <div className="text-white text-xs sm:text-sm mb-1 line-clamp-1">{email.subject}</div>
                                        <div className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">{email.preview}</div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Seed Phrase Storage Simulation */}
                            {safetyStage === 1 && (
                              <div className="space-y-3">
                                <div className="p-3 sm:p-4 bg-zinc-900 border border-zinc-600 rounded-lg">
                                  <div className="text-sm sm:text-base text-zinc-300 mb-3">
                                    You just received your 12-word seed phrase. Where should you store it?
                                  </div>
                                  <div className="p-2 sm:p-3 bg-zinc-800 rounded border border-dashed border-zinc-500 mb-3">
                                    <div className="text-xs text-zinc-500 mb-2">Your Seed Phrase:</div>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 text-xs text-orange-300 font-mono">
                                      <div className="p-1 bg-zinc-700/50 rounded text-center">1. abandon</div>
                                      <div className="p-1 bg-zinc-700/50 rounded text-center">2. ability</div>
                                      <div className="p-1 bg-zinc-700/50 rounded text-center">3. able</div>
                                      <div className="p-1 bg-zinc-700/50 rounded text-center">4. about</div>
                                      <div className="p-1 bg-zinc-700/50 rounded text-center">5. above</div>
                                      <div className="p-1 bg-zinc-700/50 rounded text-center">6. absent</div>
                                      <div className="p-1 bg-zinc-700/50 rounded text-center">7. absorb</div>
                                      <div className="p-1 bg-zinc-700/50 rounded text-center">8. abstract</div>
                                      <div className="p-1 bg-zinc-700/50 rounded text-center">9. absurd</div>
                                      <div className="p-1 bg-zinc-700/50 rounded text-center">10. abuse</div>
                                      <div className="p-1 bg-zinc-700/50 rounded text-center">11. access</div>
                                      <div className="p-1 bg-zinc-700/50 rounded text-center">12. accident</div>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    {safetySimulations[1]?.options?.map((option, index) => (
                                      <button
                                        key={index}
                                        onClick={() => setSelectedOption(index)}
                                        className={`w-full p-2 sm:p-3 border rounded-lg text-left transition-colors ${
                                          selectedOption === index 
                                            ? 'border-orange-500 bg-orange-500/10' 
                                            : 'border-zinc-600 hover:border-zinc-500'
                                        }`}
                                      >
                                        <div className="text-white text-xs sm:text-sm font-medium">
                                          {'method' in option ? option.method : 'Option'}
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Address Verification Simulation */}
                            {safetyStage === 2 && (
                              <div className="space-y-3">
                                <div className="p-3 sm:p-4 bg-zinc-900 border border-zinc-600 rounded-lg">
                                  <div className="space-y-3">
                                    <div>
                                      <div className="text-sm sm:text-base text-zinc-300 mb-2">
                                        Address you copied from your friend:
                                      </div>
                                      <div className="text-green-300 font-mono text-xs break-all bg-zinc-800 p-2 rounded border border-green-700/50">
                                        {safetySimulations[2]?.copied}
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <div className="text-sm sm:text-base text-zinc-300 mb-2">
                                        Address your wallet is showing:
                                      </div>
                                      <div className="text-red-300 font-mono text-xs break-all bg-zinc-800 p-2 rounded border border-red-700/50">
                                        {safetySimulations[2]?.displayed}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-2 mt-3">
                                    {safetySimulations[2]?.options?.map((option, index) => (
                                      <button
                                        key={index}
                                        onClick={() => setSelectedOption(index)}
                                        className={`w-full p-2 sm:p-3 border rounded-lg text-left transition-colors ${
                                          selectedOption === index 
                                            ? 'border-orange-500 bg-orange-500/10' 
                                            : 'border-zinc-600 hover:border-zinc-500'
                                        }`}
                                      >
                                        <div className="text-orange-300 text-xs sm:text-sm">
                                          {'text' in option ? option.text : 'Option'}
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Scam Recognition Simulation */}
                            {safetyStage === 3 && (
                              <div className="space-y-3">
                                <div className="p-3 sm:p-4 bg-zinc-900 border border-zinc-600 rounded-lg">
                                  <div className="text-sm sm:text-base text-zinc-300 mb-3">
                                    Which message is legitimate and safe? Click on the safe message (avoid the two scams):
                                  </div>
                                  <div className="space-y-2">
                                    {safetySimulations[3]?.scenarios?.map((scenario, index) => (
                                      <button
                                        key={index}
                                        onClick={() => setSelectedOption(index)}
                                        className={`w-full p-3 border rounded-lg text-left transition-colors ${
                                          selectedOption === index 
                                            ? 'border-orange-500 bg-orange-500/10' 
                                            : 'border-zinc-600 hover:border-zinc-500'
                                        }`}
                                      >
                                        <div className="text-white text-xs sm:text-sm leading-relaxed">
                                          "{scenario.message}"
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Generic Options-based Simulations (stages 4-11) */}
                            {safetyStage >= 4 && safetyStage <= 11 && (
                              <div className="space-y-3">
                                <div className="p-3 sm:p-4 bg-zinc-900 border border-zinc-600 rounded-lg">
                                  {safetyStage === 4 && (
                                    <div className="text-sm sm:text-base text-zinc-300 mb-3">
                                      You want to buy Bitcoin for the first time. Choose the safest approach:
                                    </div>
                                  )}
                                  {safetyStage === 5 && (
                                    <div className="text-sm sm:text-base text-zinc-300 mb-3">
                                      You're at a coffee shop and want to check your Bitcoin wallet:
                                    </div>
                                  )}
                                  {safetyStage === 6 && (
                                    <div className="text-sm sm:text-base text-zinc-300 mb-3">
                                      You need to download a Bitcoin wallet. Where do you get it?
                                    </div>
                                  )}
                                  {safetyStage === 7 && (
                                    <div className="text-sm sm:text-base text-zinc-300 mb-3">
                                      Someone calls claiming to be from your exchange, asking for your 2FA code:
                                    </div>
                                  )}
                                  {safetyStage === 8 && (
                                    <div className="text-sm sm:text-base text-zinc-300 mb-3">
                                      You wrote down your seed phrase. How should you verify it's correct?
                                    </div>
                                  )}
                                  {safetyStage === 9 && (
                                    <div className="text-sm sm:text-base text-zinc-300 mb-3">
                                      You're sending $50 worth of Bitcoin. Your wallet suggests a $200 fee, but you checked other sources and normal fees are $2. What should you do?
                                    </div>
                                  )}
                                  {safetyStage === 10 && (
                                    <div className="text-sm sm:text-base text-zinc-300 mb-3">
                                      Your wallet suggests a $200 fee for a $50 Bitcoin transaction. What should you do?
                                    </div>
                                  )}
                                  {safetyStage === 11 && (
                                    <div className="text-sm sm:text-base text-zinc-300 mb-3">
                                      You lost access to your wallet. Someone offers to recover it for 50% of the funds:
                                    </div>
                                  )}
                                  <div className="space-y-2">
                                    {currentSimulation?.options?.map((option, index) => (
                                      <button
                                        key={index}
                                        onClick={() => setSelectedOption(index)}
                                        className={`w-full p-2 sm:p-3 border rounded-lg text-left transition-colors ${
                                          selectedOption === index 
                                            ? 'border-orange-500 bg-orange-500/10' 
                                            : 'border-zinc-600 hover:border-zinc-500'
                                        }`}
                                      >
                                        <div className="text-white text-xs sm:text-sm font-medium leading-relaxed">
                                          {'method' in option ? option.method : 'Option'}
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3">
                              <Button
                                onClick={() => {
                                  if (selectedOption !== null) {
                                    handleSafetyAnswer(selectedOption);
                                  }
                                }}
                                disabled={selectedOption === null || showResult}
                                className="bg-orange-600 hover:bg-orange-700 text-sm py-2 px-4"
                              >
                                Submit Answer
                              </Button>
                              
                              {showResult && (
                                <Button
                                  onClick={nextSafetyStage}
                                  variant="outline"
                                  className="border-zinc-600 text-sm py-2 px-4"
                                >
                                  {safetyStage < safetySimulations.length - 1 ? 'Next Scenario' : 'Finish Test'}
                                </Button>
                              )}
                            </div>

                            {/* Result Feedback */}
                            {showResult && (
                              <div className={`mt-3 p-3 sm:p-4 rounded-lg border ${
                                safetyScore > safetyStage ? 'bg-green-900/20 border-green-700' : 'bg-red-900/20 border-red-700'
                              }`}>
                                {safetyScore > safetyStage ? (
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                                      <span className="text-green-300 font-medium text-sm">Correct!</span>
                                    </div>
                                    <p className="text-green-100 text-xs sm:text-sm leading-relaxed mb-3">
                                      {safetySimulations[safetyStage]?.explanation || 'Good job identifying the security threat!'}
                                    </p>
                                    
                                    {/* Educational Explanations for Correct Answers */}
                                    {safetyStage === 0 && (
                                      <div className="text-green-200 text-xs mt-2">
                                        <strong>Why:</strong> Phishing emails copy real designs but use fake domains. Always check the sender's email address carefully.
                                      </div>
                                    )}
                                    {safetyStage === 1 && (
                                      <div className="text-green-200 text-xs mt-2">
                                        <strong>Why:</strong> Never share your seed phrase with anyone. Real support never asks for it. This is the #1 way Bitcoin gets stolen.
                                      </div>
                                    )}
                                    {safetyStage === 2 && (
                                      <div className="space-y-2">
                                        <div className="text-green-200 text-xs font-medium">The difference was subtle but critical:</div>
                                        <div className="text-xs font-mono bg-black/30 p-2 rounded">
                                          <div>Copied: ...w<span className="bg-green-500 text-black px-1">l</span>h</div>
                                          <div>Wallet: ...w<span className="bg-red-500 text-white px-1">1</span>h</div>
                                        </div>
                                        <div className="text-green-200 text-xs">
                                          Malware changed "l" to "1" - this attack steals millions annually.
                                        </div>
                                      </div>
                                    )}
                                    {safetyStage === 4 && (
                                      <div className="text-green-200 text-xs mt-2">
                                        <strong>Why:</strong> Public WiFi can be monitored. Use your phone's data or VPN for sensitive Bitcoin activities.
                                      </div>
                                    )}
                                    {safetyStage === 5 && (
                                      <div className="text-green-200 text-xs mt-2">
                                        <strong>Why:</strong> Only download wallets from official sources. Fake wallets steal your Bitcoin immediately.
                                      </div>
                                    )}
                                    {safetyStage === 6 && (
                                      <div className="text-green-200 text-xs mt-2">
                                        <strong>Why:</strong> Scammers impersonate celebrities and officials. Real Bitcoin giveaways don't exist.
                                      </div>
                                    )}
                                    {safetyStage === 7 && (
                                      <div className="text-green-200 text-xs mt-2">
                                        <strong>Why:</strong> Used hardware wallets could be tampered with. Always buy new from official manufacturers.
                                      </div>
                                    )}
                                    {safetyStage === 8 && (
                                      <div className="text-green-200 text-xs mt-2">
                                        <strong>Why:</strong> Test your backup by restoring it on another device. Unreadable backups = lost Bitcoin.
                                      </div>
                                    )}
                                    {safetyStage === 9 && (
                                      <div className="text-green-200 text-xs mt-2">
                                        <strong>Why:</strong> 100x higher fees suggests malicious software. Normal fees are $1-5, not $200.
                                      </div>
                                    )}
                                    {safetyStage === 10 && (
                                      <div className="text-green-200 text-xs mt-2">
                                        <strong>Why:</strong> 100x higher fees suggests malicious software. Normal fees are $1-5, not $200.
                                      </div>
                                    )}
                                    {safetyStage === 11 && (
                                      <div className="text-green-200 text-xs mt-2">
                                        <strong>Why:</strong> Recovery services are usually scams. If you have your seed phrase, you can recover yourself.
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                                      <span className="text-red-300 font-medium text-sm">Be Careful!</span>
                                    </div>
                                    <p className="text-red-100 text-xs sm:text-sm leading-relaxed mb-3">
                                      {safetySimulations[safetyStage]?.explanation || 'This could have put your Bitcoin at risk. Review the training materials above.'}
                                    </p>
                                    
                                    {/* Educational Explanations for Wrong Answers */}
                                    {safetyStage === 0 && (
                                      <div className="text-red-200 text-xs mt-2">
                                        <strong>Risk:</strong> You would have entered your login details on a fake site, giving attackers full account access.
                                      </div>
                                    )}
                                    {safetyStage === 1 && (
                                      <div className="text-red-200 text-xs mt-2">
                                        <strong>Risk:</strong> Sharing your seed phrase = instant Bitcoin theft. This is how most people lose their coins.
                                      </div>
                                    )}
                                    {safetyStage === 2 && (
                                      <div className="space-y-2">
                                        <div className="text-red-200 text-xs font-medium">Here's what you missed:</div>
                                        <div className="text-xs font-mono bg-black/30 p-2 rounded">
                                          <div>Copied: ...w<span className="bg-yellow-500 text-black px-1">l</span>h</div>
                                          <div>Wallet: ...w<span className="bg-yellow-500 text-black px-1">1</span>h</div>
                                        </div>
                                        <div className="text-red-200 text-xs">
                                          Your Bitcoin would be stolen! Always verify every character.
                                        </div>
                                      </div>
                                    )}
                                    {safetyStage === 4 && (
                                      <div className="text-red-200 text-xs mt-2">
                                        <strong>Risk:</strong> Public WiFi can be monitored. Attackers could see your private keys or passwords.
                                      </div>
                                    )}
                                    {safetyStage === 5 && (
                                      <div className="text-red-200 text-xs mt-2">
                                        <strong>Risk:</strong> Fake wallets immediately steal your Bitcoin. Only use official sources like company websites.
                                      </div>
                                    )}
                                    {safetyStage === 6 && (
                                      <div className="text-red-200 text-xs mt-2">
                                        <strong>Risk:</strong> You would send Bitcoin to scammers. No legitimate person gives away free Bitcoin.
                                      </div>
                                    )}
                                    {safetyStage === 7 && (
                                      <div className="text-red-200 text-xs mt-2">
                                        <strong>Risk:</strong> Used devices could have hidden malware to steal your Bitcoin. Always buy new.
                                      </div>
                                    )}
                                    {safetyStage === 8 && (
                                      <div className="text-red-200 text-xs mt-2">
                                        <strong>Risk:</strong> If your backup doesn't work, your Bitcoin is gone forever. Always test it first.
                                      </div>
                                    )}
                                    {safetyStage === 9 && (
                                      <div className="text-red-200 text-xs mt-2">
                                        <strong>Risk:</strong> You would pay $200 for a $2 transaction. This wallet is likely stealing from you.
                                      </div>
                                    )}
                                    {safetyStage === 10 && (
                                      <div className="text-red-200 text-xs mt-2">
                                        <strong>Risk:</strong> You would pay $200 for a $2 transaction. This wallet is likely stealing from you.
                                      </div>
                                    )}
                                    {safetyStage === 11 && (
                                      <div className="text-red-200 text-xs mt-2">
                                        <strong>Risk:</strong> You would give scammers 50% of your Bitcoin for "help" you don't actually need.
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      /* Security Skills Test */
                      <div className="space-y-6">
                        {/* Simulation Introduction */}
                        {securityTestStage === 0 && (
                          <div className="text-center space-y-4">
                            <div className="p-6 rounded-lg border border-zinc-700 bg-zinc-800/50">
                              <Shield className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                              <h4 className="text-xl font-bold text-white mb-2">Bitcoin Security Simulator</h4>
                              <p className="text-zinc-300 mb-4">
                                Experience real Bitcoin security scenarios and see the consequences of your decisions. 
                                Navigate through 16 authentic situations that Bitcoin users face daily.
                              </p>
                              <div className="text-sm text-zinc-400 mb-4">
                                • 16 immersive scenarios
                                • Real-world decision making
                                • See consequences of your choices
                                • Learn from realistic outcomes
                              </div>
                              <Button 
                                onClick={() => setSecurityTestStage(1)}
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                              >
                                Begin Simulation
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Simulation Scenarios */}
                        {securityTestStage > 0 && securityTestStage <= 16 && (
                          <div className="space-y-4">
                            {/* Progress Header */}
                            <div className="flex justify-between items-center">
                              <h4 className="text-lg font-semibold text-white">
                                Scenario {securityTestStage} of 16
                              </h4>
                              <div className="text-sm text-zinc-400">
                                Safe Choices: {securityScore}/{securityTestStage - 1}
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-zinc-700 rounded-full h-2">
                              <div 
                                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(securityTestStage / 16) * 100}%` }}
                              />
                            </div>

                            {/* Current Question */}
                            <Card className="bg-zinc-800 border-zinc-700">
                              <CardContent className="p-6">
                                {securityTestStage === 1 && (
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                                        <span className="text-orange-400 text-sm">📧</span>
                                      </div>
                                      <div>
                                        <h5 className="text-lg font-semibold text-white">The Urgent Email</h5>
                                        <p className="text-zinc-400 text-sm">Monday morning, 8:47 AM</p>
                                      </div>
                                    </div>
                                    
                                    <div className="p-4 bg-zinc-900/50 rounded border border-zinc-600">
                                      <p className="text-zinc-300 mb-3">
                                        You're checking emails over coffee when this message catches your attention:
                                      </p>
                                      <div className="p-3 bg-red-950/30 rounded border border-red-800/50">
                                        <div className="text-sm space-y-1">
                                          <div><strong className="text-red-400">From:</strong> security@bitcoin-wallet.com</div>
                                          <div><strong className="text-red-400">Subject:</strong> URGENT: Verify Your Wallet Now</div>
                                          <div className="text-zinc-300 mt-2 text-xs">
                                            "Your Bitcoin wallet has been compromised. Unauthorized access detected. 
                                            Click here immediately to secure your funds: bitcoin-security-check.net/verify"
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <p className="text-zinc-300 text-sm">
                                      Your heart rate increases. You have 0.5 BTC in your wallet. What do you do?
                                    </p>

                                    <div className="space-y-2">
                                      {[
                                        'Click the link immediately - my Bitcoin could be stolen!',
                                        'Check the sender domain more carefully first',
                                        'Ignore it - Bitcoin has no customer support team',
                                        'Forward it to friends to warn them'
                                      ].map((option, index) => (
                                        <button
                                          key={index}
                                          onClick={() => handleSecurityAnswer(index)}
                                          disabled={securityAnswerSubmitted}
                                          className={`w-full p-3 text-left rounded border transition-colors ${
                                            selectedSecurityAnswer === index 
                                              ? 'border-orange-500 bg-orange-500/10' 
                                              : 'border-zinc-600 hover:border-zinc-500'
                                          }`}
                                        >
                                          <span className="text-white text-sm">{option}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {securityTestStage === 2 && (
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                                        <span className="text-orange-400 text-sm">🔐</span>
                                      </div>
                                      <div>
                                        <h5 className="text-lg font-semibold text-white">New Wallet Setup</h5>
                                        <p className="text-zinc-400 text-sm">Your first hardware wallet</p>
                                      </div>
                                    </div>
                                    
                                    <div className="p-4 bg-zinc-900/50 rounded border border-zinc-600">
                                      <p className="text-zinc-300 mb-3">
                                        Congratulations! Your new hardware wallet has generated your recovery phrase. 
                                        The device shows these 12 words on screen:
                                      </p>
                                      <div className="p-3 bg-green-950/30 rounded border border-green-800/50">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                                          <div className="bg-zinc-800/50 rounded px-1.5 py-1 text-center">
                                            <span className="text-green-400 text-xs font-mono">1. mountain</span>
                                          </div>
                                          <div className="bg-zinc-800/50 rounded px-1.5 py-1 text-center">
                                            <span className="text-green-400 text-xs font-mono">2. forest</span>
                                          </div>
                                          <div className="bg-zinc-800/50 rounded px-1.5 py-1 text-center">
                                            <span className="text-green-400 text-xs font-mono">3. library</span>
                                          </div>
                                          <div className="bg-zinc-800/50 rounded px-1.5 py-1 text-center">
                                            <span className="text-green-400 text-xs font-mono">4. ocean</span>
                                          </div>
                                          <div className="bg-zinc-800/50 rounded px-1.5 py-1 text-center">
                                            <span className="text-green-400 text-xs font-mono">5. sunset</span>
                                          </div>
                                          <div className="bg-zinc-800/50 rounded px-1.5 py-1 text-center">
                                            <span className="text-green-400 text-xs font-mono">6. garden</span>
                                          </div>
                                          <div className="bg-zinc-800/50 rounded px-1.5 py-1 text-center">
                                            <span className="text-green-400 text-xs font-mono">7. whisper</span>
                                          </div>
                                          <div className="bg-zinc-800/50 rounded px-1.5 py-1 text-center">
                                            <span className="text-green-400 text-xs font-mono">8. thunder</span>
                                          </div>
                                          <div className="bg-zinc-800/50 rounded px-1.5 py-1 text-center">
                                            <span className="text-green-400 text-xs font-mono">9. crystal</span>
                                          </div>
                                          <div className="bg-zinc-800/50 rounded px-1.5 py-1 text-center">
                                            <span className="text-green-400 text-xs font-mono">10. journey</span>
                                          </div>
                                          <div className="bg-zinc-800/50 rounded px-1.5 py-1 text-center">
                                            <span className="text-green-400 text-xs font-mono">11. freedom</span>
                                          </div>
                                          <div className="bg-zinc-800/50 rounded px-1.5 py-1 text-center">
                                            <span className="text-green-400 text-xs font-mono">12. wisdom</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <p className="text-zinc-300 text-sm">
                                      These words are your master key to 2.5 BTC. If lost, your Bitcoin is gone forever. How do you store them?
                                    </p>

                                    <div className="space-y-2">
                                      {[
                                        'Quick screenshot - easy and accessible',
                                        'Write on paper, store in fireproof safe',
                                        'Save in Google Drive for backup',
                                        'Email them to myself for safekeeping'
                                      ].map((option, index) => (
                                        <button
                                          key={index}
                                          onClick={() => handleSecurityAnswer(index)}
                                          disabled={securityAnswerSubmitted}
                                          className={`w-full p-3 text-left rounded border transition-colors ${
                                            selectedSecurityAnswer === index 
                                              ? 'border-orange-500 bg-orange-500/10' 
                                              : 'border-zinc-600 hover:border-zinc-500'
                                          }`}
                                        >
                                          <span className="text-white text-sm">{option}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {securityTestStage === 3 && (
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                                        <span className="text-orange-400 text-sm">💰</span>
                                      </div>
                                      <div>
                                        <h5 className="text-lg font-semibold text-white">The Big Transfer</h5>
                                        <p className="text-zinc-400 text-sm">Friday evening, sending to business partner</p>
                                      </div>
                                    </div>
                                    
                                    <div className="p-4 bg-zinc-900/50 rounded border border-zinc-600">
                                      <p className="text-zinc-300 mb-3">
                                        You're sending 1.5 BTC ($60,000) to your business partner for a deal. They texted you their address. 
                                        Your wallet shows the destination after you pasted it.
                                      </p>
                                      
                                      <div className="space-y-3">
                                        <div className="p-3 bg-blue-950/30 rounded border border-blue-800/50">
                                          <div className="text-xs text-blue-400 mb-1">PARTNER'S TEXT MESSAGE:</div>
                                          <div className="font-mono text-xs text-blue-300 break-all">
                                            bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0w<span className="bg-blue-500 text-white px-1 rounded">lh</span>
                                          </div>
                                        </div>
                                        
                                        <div className="p-3 bg-green-950/30 rounded border border-green-800/50">
                                          <div className="text-xs text-green-400 mb-1">YOUR WALLET SHOWS:</div>
                                          <div className="font-mono text-xs text-green-300 break-all">
                                            bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0w<span className="bg-red-500 text-white px-1 rounded">1h</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <p className="text-zinc-300 text-sm">
                                      Something feels off, but you're in a hurry. What do you notice?
                                    </p>

                                    <div className="space-y-2">
                                      {[
                                        'The addresses are identical - send the payment',
                                        'The addresses are different - don\'t send anything',
                                        'Close enough - the difference doesn\'t matter',
                                        'First 20 characters match - that\'s sufficient verification'
                                      ].map((option, index) => (
                                        <button
                                          key={index}
                                          onClick={() => handleSecurityAnswer(index)}
                                          disabled={securityAnswerSubmitted}
                                          className={`w-full p-3 text-left rounded border transition-colors ${
                                            selectedSecurityAnswer === index 
                                              ? 'border-orange-500 bg-orange-500/10' 
                                              : 'border-zinc-600 hover:border-zinc-500'
                                          }`}
                                        >
                                          <span className="text-white text-sm">{option}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {securityTestStage === 4 && (
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                                        <span className="text-orange-400 text-sm">📞</span>
                                      </div>
                                      <div>
                                        <h5 className="text-lg font-semibold text-white">The Unexpected Call</h5>
                                        <p className="text-zinc-400 text-sm">Wednesday, 2:34 PM</p>
                                      </div>
                                    </div>
                                    
                                    <div className="p-4 bg-zinc-900/50 rounded border border-zinc-600">
                                      <p className="text-zinc-300 mb-3">
                                        Your phone rings. The caller ID shows a professional number. A friendly voice says:
                                      </p>
                                      <div className="p-3 bg-blue-950/30 rounded border border-blue-800/50">
                                        <div className="text-sm italic text-blue-300">
                                          "Hello! This is Alex from Bitcoin Security Services. We've detected suspicious activity 
                                          on your wallet address. To secure your funds, I need to verify your recovery phrase. 
                                          Can you read me your 12 words so we can activate enhanced protection?"
                                        </div>
                                      </div>
                                      <p className="text-zinc-400 text-xs mt-2">
                                        They sound professional and know you have Bitcoin. Your wallet contains 1.2 BTC.
                                      </p>
                                    </div>

                                    <p className="text-zinc-300 text-sm">
                                      This sounds urgent and legitimate. What's your response?
                                    </p>

                                    <div className="space-y-2">
                                      {[
                                        'Give them the words - they sound official',
                                        'Ask for their company credentials and website',
                                        'Hang up immediately - Bitcoin has no support team',
                                        'Give them half the words to test if they\'re real'
                                      ].map((option, index) => (
                                        <button
                                          key={index}
                                          onClick={() => handleSecurityAnswer(index)}
                                          disabled={securityAnswerSubmitted}
                                          className={`w-full p-3 text-left rounded border transition-colors ${
                                            selectedSecurityAnswer === index 
                                              ? 'border-orange-500 bg-orange-500/10' 
                                              : 'border-zinc-600 hover:border-zinc-500'
                                          }`}
                                        >
                                          <span className="text-white text-sm">{option}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {securityTestStage === 5 && (
                                  <div className="space-y-4">
                                    <h5 className="text-lg font-semibold text-white">Exchange Safety</h5>
                                    <p className="text-zinc-300">
                                      You have 5 BTC on Coinbase. What's the safest long-term strategy?
                                    </p>
                                    <div className="space-y-2">
                                      {['Move most to a hardware wallet, keep some for trading', 'Keep it all on Coinbase for convenience', 'Split across multiple exchanges', 'Convert to stablecoins'].map((option, index) => (
                                        <button
                                          key={index}
                                          onClick={() => handleSecurityAnswer(index)}
                                          disabled={securityAnswerSubmitted}
                                          className={`w-full p-3 text-left rounded border transition-colors ${
                                            selectedSecurityAnswer === index 
                                              ? 'border-orange-500 bg-orange-500/10' 
                                              : 'border-zinc-600 hover:border-zinc-500'
                                          }`}
                                        >
                                          <span className="text-white text-sm">{option}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {securityTestStage === 6 && (
                                  <div className="space-y-4">
                                    <h5 className="text-lg font-semibold text-white">Public WiFi Risks</h5>
                                    <p className="text-zinc-300">
                                      You need to check your Bitcoin balance at a coffee shop. What's safest?
                                    </p>
                                    <div className="space-y-2">
                                      {['Use the coffee shop WiFi directly', 'Use your phone\'s mobile data instead', 'Use WiFi but log out immediately', 'Use WiFi with a VPN'].map((option, index) => (
                                        <button
                                          key={index}
                                          onClick={() => handleSecurityAnswer(index)}
                                          disabled={securityAnswerSubmitted}
                                          className={`w-full p-3 text-left rounded border transition-colors ${
                                            selectedSecurityAnswer === index 
                                              ? 'border-orange-500 bg-orange-500/10' 
                                              : 'border-zinc-600 hover:border-zinc-500'
                                          }`}
                                        >
                                          <span className="text-white text-sm">{option}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {securityTestStage === 7 && (
                                  <div className="space-y-4">
                                    <h5 className="text-lg font-semibold text-white">Software Downloads</h5>
                                    <p className="text-zinc-300">
                                      Where should you download Bitcoin wallet software?
                                    </p>
                                    <div className="space-y-2">
                                      {[
                                        'Any crypto website (cryptowallets.com, bitcoindownloads.net)',
                                        'Official websites only (bitcoin.org, metamask.io)',
                                        'Download sites (download.com, softonic.com)',
                                        'First Google result (bitcoin-wallet-download.org)'
                                      ].map((option, index) => (
                                        <button
                                          key={index}
                                          onClick={() => handleSecurityAnswer(index)}
                                          disabled={securityAnswerSubmitted}
                                          className={`w-full p-3 text-left rounded border transition-colors ${
                                            selectedSecurityAnswer === index 
                                              ? 'border-orange-500 bg-orange-500/10' 
                                              : 'border-zinc-600 hover:border-zinc-500'
                                          }`}
                                        >
                                          <span className="text-white text-sm">{option}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {securityTestStage === 8 && (
                                  <div className="space-y-4">
                                    <h5 className="text-lg font-semibold text-white">Hardware Wallet Purchase</h5>
                                    <p className="text-zinc-300">
                                      What's the safest way to buy a hardware wallet?
                                    </p>
                                    <div className="space-y-2">
                                      {['Buy used from eBay for cheaper price', 'Buy new from official manufacturer', 'Buy from Amazon marketplace', 'Buy from local computer store'].map((option, index) => (
                                        <button
                                          key={index}
                                          onClick={() => handleSecurityAnswer(index)}
                                          disabled={securityAnswerSubmitted}
                                          className={`w-full p-3 text-left rounded border transition-colors ${
                                            selectedSecurityAnswer === index 
                                              ? 'border-orange-500 bg-orange-500/10' 
                                              : 'border-zinc-600 hover:border-zinc-500'
                                          }`}
                                        >
                                          <span className="text-white text-sm">{option}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {securityTestStage === 9 && (
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                                        <span className="text-orange-400 text-sm">🔧</span>
                                      </div>
                                      <div>
                                        <h5 className="text-lg font-semibold text-white">Backup Validation</h5>
                                        <p className="text-zinc-400 text-sm">Just finished writing down your seed phrase</p>
                                      </div>
                                    </div>
                                    
                                    <div className="p-4 bg-zinc-900/50 rounded border border-zinc-600">
                                      <p className="text-zinc-300 mb-3">
                                        You've carefully written down your 12-word seed phrase on paper. Your hardware wallet 
                                        is ready to receive Bitcoin, and you're excited to start using it.
                                      </p>
                                      <p className="text-zinc-300 text-sm">
                                        Before sending any Bitcoin to this wallet, what's the most important step?
                                      </p>
                                    </div>

                                    <div className="space-y-2">
                                      {[
                                        'Wait a month to make sure the paper doesn\'t fade',
                                        'Start using it immediately - you wrote it down correctly',
                                        'Store the paper safely and assume it works',
                                        'Test the backup by wiping and restoring the entire wallet'
                                      ].map((option, index) => (
                                        <button
                                          key={index}
                                          onClick={() => handleSecurityAnswer(index)}
                                          disabled={securityAnswerSubmitted}
                                          className={`w-full p-3 text-left rounded border transition-colors ${
                                            selectedSecurityAnswer === index 
                                              ? 'border-orange-500 bg-orange-500/10' 
                                              : 'border-zinc-600 hover:border-zinc-500'
                                          }`}
                                        >
                                          <span className="text-white text-sm">{option}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {securityTestStage === 10 && (
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                                        <span className="text-orange-400 text-sm">💸</span>
                                      </div>
                                      <div>
                                        <h5 className="text-lg font-semibold text-white">Suspicious Fees</h5>
                                        <p className="text-zinc-400 text-sm">Making a routine payment</p>
                                      </div>
                                    </div>
                                    
                                    <div className="p-4 bg-zinc-900/50 rounded border border-zinc-600">
                                      <p className="text-zinc-300 mb-3">
                                        You're trying to send $100 worth of Bitcoin to pay for something. Your wallet shows the transaction details:
                                      </p>
                                      <div className="p-3 bg-red-950/30 rounded border border-red-800/50">
                                        <div className="text-sm space-y-1">
                                          <div className="text-white"><strong>Amount:</strong> $100.00</div>
                                          <div className="text-red-400"><strong>Network Fee:</strong> $47.50</div>
                                          <div className="text-white"><strong>Total:</strong> $147.50</div>
                                        </div>
                                      </div>
                                      <p className="text-zinc-400 text-xs mt-2">
                                        This fee seems unusually high. Normal Bitcoin fees are typically $1-5.
                                      </p>
                                    </div>

                                    <p className="text-zinc-300 text-sm">
                                      What's your immediate response to this suspicious fee?
                                    </p>

                                    <div className="space-y-2">
                                      {[
                                        'Pay it anyway - fees fluctuate',
                                        'Wait a few hours for fees to normalize', 
                                        'Stop using this wallet immediately - possible malware',
                                        'Try lowering the priority to reduce fees'
                                      ].map((option, index) => (
                                        <button
                                          key={index}
                                          onClick={() => handleSecurityAnswer(index)}
                                          disabled={securityAnswerSubmitted}
                                          className={`w-full p-3 text-left rounded border transition-colors ${
                                            selectedSecurityAnswer === index 
                                              ? 'border-orange-500 bg-orange-500/10' 
                                              : 'border-zinc-600 hover:border-zinc-500'
                                          }`}
                                        >
                                          <span className="text-white text-sm">{option}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {securityTestStage === 11 && (
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                                        <span className="text-orange-400 text-sm">🎣</span>
                                      </div>
                                      <div>
                                        <h5 className="text-lg font-semibold text-white">Recovery Scam</h5>
                                        <p className="text-zinc-400 text-sm">Lost access to your Bitcoin</p>
                                      </div>
                                    </div>
                                    
                                    <div className="p-4 bg-zinc-900/50 rounded border border-zinc-600">
                                      <p className="text-zinc-300 mb-3">
                                        Your computer crashed and you lost access to your Bitcoin wallet. You're panicking because 
                                        you think you might have lost 2.5 BTC forever.
                                      </p>
                                      <div className="p-3 bg-blue-950/30 rounded border border-blue-800/50">
                                        <div className="text-sm">
                                          <div className="text-blue-400 font-medium mb-1">Email from "BitcoinRecovery.com":</div>
                                          <div className="text-zinc-300 text-xs">
                                            "We specialize in recovering lost Bitcoin. Our experts can restore your wallet 
                                            for just 30% of the recovered amount. We've helped thousands of people get their Bitcoin back!"
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <p className="text-zinc-300 text-sm">
                                      What's the truth about Bitcoin "recovery services"?
                                    </p>

                                    <div className="space-y-2">
                                      {[
                                        'They\'re legitimate - 30% is reasonable for expert help',
                                        'Shop around for a better rate - try to negotiate lower',
                                        'All Bitcoin recovery services are scams - only you can recover with your seed phrase',
                                        'Ask for proof of their previous successful recoveries'
                                      ].map((option, index) => (
                                        <button
                                          key={index}
                                          onClick={() => handleSecurityAnswer(index)}
                                          disabled={securityAnswerSubmitted}
                                          className={`w-full p-3 text-left rounded border transition-colors ${
                                            selectedSecurityAnswer === index 
                                              ? 'border-orange-500 bg-orange-500/10' 
                                              : 'border-zinc-600 hover:border-zinc-500'
                                          }`}
                                        >
                                          <span className="text-white text-sm">{option}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {securityTestStage === 12 && (
                                  <div className="space-y-4">
                                    <h5 className="text-lg font-semibold text-white">Investment Scams</h5>
                                    <p className="text-zinc-300">
                                      A friend asks to borrow 0.5 BTC and promises to return 1 BTC next week. What do you do?
                                    </p>
                                    <div className="space-y-2">
                                      {['Lend it - friends are trustworthy', 'Ask for collateral first', 'Politely decline - sounds too good to be true', 'Lend half to test'].map((option, index) => (
                                        <button
                                          key={index}
                                          onClick={() => handleSecurityAnswer(index)}
                                          disabled={securityAnswerSubmitted}
                                          className={`w-full p-3 text-left rounded border transition-colors ${
                                            selectedSecurityAnswer === index 
                                              ? 'border-orange-500 bg-orange-500/10' 
                                              : 'border-zinc-600 hover:border-zinc-500'
                                          }`}
                                        >
                                          <span className="text-white text-sm">{option}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {securityTestStage === 13 && (
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                                        <span className="text-orange-400 text-sm">📦</span>
                                      </div>
                                      <div>
                                        <h5 className="text-lg font-semibold text-white">Hardware Wallet Delivery</h5>
                                        <p className="text-zinc-400 text-sm">New device arrives at your door</p>
                                      </div>
                                    </div>
                                    
                                    <div className="p-4 bg-zinc-900/50 rounded border border-zinc-600">
                                      <p className="text-zinc-300 mb-3">
                                        Your new hardware wallet arrives, but when you open the box, there's a small note that says 
                                        "For your convenience, we've already generated your seed phrase. Use this to get started quickly!"
                                      </p>
                                      <div className="p-3 bg-red-950/30 rounded border border-red-800/50">
                                        <div className="text-sm">
                                          <div className="text-red-400 font-medium mb-1">Pre-written seed phrase included:</div>
                                          <div className="text-zinc-300 text-xs font-mono">
                                            "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <p className="text-zinc-300 text-sm">
                                      What do you do with this hardware wallet?
                                    </p>

                                    <div className="space-y-2">
                                      {[
                                        'Contact the company to verify if this is normal',
                                        'Use the provided seed phrase - it saves time',
                                        'Return it immediately - this is a tampered device',
                                        'Generate a new seed phrase but keep the old one as backup'
                                      ].map((option, index) => (
                                        <button
                                          key={index}
                                          onClick={() => handleSecurityAnswer(index)}
                                          disabled={securityAnswerSubmitted}
                                          className={`w-full p-3 text-left rounded border transition-colors ${
                                            selectedSecurityAnswer === index 
                                              ? 'border-orange-500 bg-orange-500/10' 
                                              : 'border-zinc-600 hover:border-zinc-500'
                                          }`}
                                        >
                                          <span className="text-white text-sm">{option}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {securityTestStage === 14 && (
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                                        <span className="text-orange-400 text-sm">📋</span>
                                      </div>
                                      <div>
                                        <h5 className="text-lg font-semibold text-white">The Copy-Paste Attack</h5>
                                        <p className="text-zinc-400 text-sm">Sending Bitcoin to a friend</p>
                                      </div>
                                    </div>
                                    
                                    <div className="p-4 bg-zinc-900/50 rounded border border-zinc-600">
                                      <p className="text-zinc-300 mb-3">
                                        You're sending 0.2 BTC to your friend. You copy their Bitcoin address from their text message, 
                                        then paste it into your wallet. But something looks wrong...
                                      </p>
                                      
                                      <div className="space-y-3">
                                        <div className="p-3 bg-blue-950/30 rounded border border-blue-800/50">
                                          <div className="text-xs text-blue-400 mb-1">FRIEND'S TEXT MESSAGE:</div>
                                          <div className="font-mono text-xs text-blue-300 break-all">
                                            bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                                          </div>
                                        </div>
                                        
                                        <div className="p-3 bg-red-950/30 rounded border border-red-800/50">
                                          <div className="text-xs text-red-400 mb-1">WHAT YOU PASTED IN YOUR WALLET:</div>
                                          <div className="font-mono text-xs text-red-300 break-all">
                                            bc1qhacker123456789abcdefghijklmnopqrstuvwx
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <p className="text-zinc-300 text-sm">
                                      What most likely happened to your computer?
                                    </p>

                                    <div className="space-y-2">
                                      {[
                                        'Your friend sent the wrong address by mistake',
                                        'Your clipboard was infected with address-replacing malware',
                                        'You copied the wrong text from the message',
                                        'The wallet software has a display bug'
                                      ].map((option, index) => (
                                        <button
                                          key={index}
                                          onClick={() => handleSecurityAnswer(index)}
                                          disabled={securityAnswerSubmitted}
                                          className={`w-full p-3 text-left rounded border transition-colors ${
                                            selectedSecurityAnswer === index 
                                              ? 'border-orange-500 bg-orange-500/10' 
                                              : 'border-zinc-600 hover:border-zinc-500'
                                          }`}
                                        >
                                          <span className="text-white text-sm">{option}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {securityTestStage === 15 && (
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                                        <span className="text-orange-400 text-sm">☎️</span>
                                      </div>
                                      <div>
                                        <h5 className="text-lg font-semibold text-white">The Support Call</h5>
                                        <p className="text-zinc-400 text-sm">Unexpected phone call</p>
                                      </div>
                                    </div>
                                    
                                    <div className="p-4 bg-zinc-900/50 rounded border border-zinc-600">
                                      <p className="text-zinc-300 mb-3">
                                        Your phone rings. The caller says: "Hello, this is Bitcoin Technical Support. 
                                        We've detected suspicious activity on your wallet and need to secure your funds immediately."
                                      </p>
                                      <div className="p-3 bg-red-950/30 rounded border border-red-800/50">
                                        <div className="text-sm">
                                          <div className="text-red-400 font-medium mb-1">Caller continues:</div>
                                          <div className="text-zinc-300 text-xs">
                                            "To protect your Bitcoin, we need you to read us your 12-word recovery phrase. 
                                            This will allow us to secure your wallet before the hackers can access it. 
                                            Please hurry - your Bitcoin could be stolen at any moment!"
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <p className="text-zinc-300 text-sm">
                                      What's the correct response to this caller?
                                    </p>

                                    <div className="space-y-2">
                                      {[
                                        'Give them the seed phrase - they\'re trying to help',
                                        'Ask for their employee ID and company verification first',
                                        'Hang up immediately - Bitcoin has no customer support',
                                        'Ask them to call back later when you have more time'
                                      ].map((option, index) => (
                                        <button
                                          key={index}
                                          onClick={() => handleSecurityAnswer(index)}
                                          disabled={securityAnswerSubmitted}
                                          className={`w-full p-3 text-left rounded border transition-colors ${
                                            selectedSecurityAnswer === index 
                                              ? 'border-orange-500 bg-orange-500/10' 
                                              : 'border-zinc-600 hover:border-zinc-500'
                                          }`}
                                        >
                                          <span className="text-white text-sm">{option}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {securityTestStage === 16 && (
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                                        <span className="text-orange-400 text-sm">📱</span>
                                      </div>
                                      <div>
                                        <h5 className="text-lg font-semibold text-white">App Store Trap</h5>
                                        <p className="text-zinc-400 text-sm">Downloading your first wallet</p>
                                      </div>
                                    </div>
                                    
                                    <div className="p-4 bg-zinc-900/50 rounded border border-zinc-600">
                                      <p className="text-zinc-300 mb-3">
                                        You're new to Bitcoin and search "Bitcoin wallet" in your phone's app store. 
                                        You see several options and need to choose wisely.
                                      </p>
                                      
                                      <div className="space-y-3">
                                        <div className="p-3 bg-zinc-800/50 rounded border border-zinc-600">
                                          <div className="text-sm">
                                            <div className="text-white font-medium mb-1">App Option A: "Bitcoin Wallet"</div>
                                            <div className="text-zinc-400 text-xs">
                                              • 2.1M downloads • 4.8 stars • By "Bitcoin Foundation Inc"
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <div className="p-3 bg-zinc-800/50 rounded border border-zinc-600">
                                          <div className="text-sm">
                                            <div className="text-white font-medium mb-1">App Option B: "BitCoin Wallet Pro"</div>
                                            <div className="text-zinc-400 text-xs">
                                              • 150k downloads • 4.9 stars • By "CryptoSafe Solutions"
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <p className="text-zinc-300 text-sm">
                                      Which app would be the safer choice?
                                    </p>

                                    <div className="space-y-2">
                                      {[
                                        'App B - higher star rating means better quality',
                                        'App A - more downloads means more trusted',
                                        'Research both apps on official Bitcoin websites first',
                                        'Download both and compare features'
                                      ].map((option, index) => (
                                        <button
                                          key={index}
                                          onClick={() => handleSecurityAnswer(index)}
                                          disabled={securityAnswerSubmitted}
                                          className={`w-full p-3 text-left rounded border transition-colors ${
                                            selectedSecurityAnswer === index 
                                              ? 'border-orange-500 bg-orange-500/10' 
                                              : 'border-zinc-600 hover:border-zinc-500'
                                          }`}
                                        >
                                          <span className="text-white text-sm">{option}</span>
                                        </button>
                                      ))}
                                    </div>


                                  </div>
                                )}

                                {/* Answer Feedback */}
                                {showSecurityFeedback && (
                                  <div className="mt-4 p-4 rounded border bg-zinc-800/50 border-zinc-700">
                                    <div className="flex items-center gap-2 mb-2">
                                      {isSecurityAnswerCorrect ? (
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                      ) : (
                                        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                                          <span className="text-white text-xs font-bold">✗</span>
                                        </div>
                                      )}
                                      <span className="text-white font-medium">
                                        {isSecurityAnswerCorrect ? 'Correct!' : 'Incorrect'}
                                      </span>
                                    </div>
                                    <p className="text-zinc-300 text-sm">
                                      {getSecurityExplanation(securityTestStage, isSecurityAnswerCorrect)}
                                    </p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>

                            {/* Next Button */}
                            {showSecurityFeedback && (
                              <div className="flex justify-center">
                                <Button
                                  onClick={() => {
                                    if (securityTestStage < 16) {
                                      setSecurityTestStage(securityTestStage + 1);
                                      setSelectedSecurityAnswer(null);
                                      setShowSecurityFeedback(false);
                                      setSecurityAnswerSubmitted(false);
                                    } else {
                                      setSecurityTestStage(17); // Show results
                                    }
                                  }}
                                  className="bg-orange-600 hover:bg-orange-700 text-white"
                                >
                                  {securityTestStage < 16 ? 'Next Question' : 'View Results'}
                                </Button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Simulation Results */}
                        {securityTestStage === 17 && (
                          <div className="text-center space-y-6">
                            <div className="p-6 rounded-lg border border-zinc-700 bg-zinc-800/50">
                              {securityScore >= 14 ? (
                                <div>
                                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                                  <h4 className="text-xl font-bold text-white mb-2">Security Master</h4>
                                  <p className="text-zinc-300 mb-3">
                                    Safe Decisions: {securityScore}/16 ({Math.round((securityScore/16)*100)}%)
                                  </p>
                                  <p className="text-zinc-300 text-sm">
                                    Outstanding! You navigated dangerous situations like a pro. Your Bitcoin would be safe in the real world.
                                  </p>
                                </div>
                              ) : securityScore >= 11 ? (
                                <div>
                                  <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                                  <h4 className="text-xl font-bold text-white mb-2">Good Security Instincts</h4>
                                  <p className="text-zinc-300 mb-3">
                                    Safe Decisions: {securityScore}/16 ({Math.round((securityScore/16)*100)}%)
                                  </p>
                                  <p className="text-zinc-300 text-sm">
                                    You avoided most traps! Review the scenarios you missed - those situations could cost you Bitcoin.
                                  </p>
                                </div>
                              ) : (
                                <div>
                                  <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                                  <h4 className="text-xl font-bold text-white mb-2">High Risk Profile</h4>
                                  <p className="text-zinc-300 mb-3">
                                    Safe Decisions: {securityScore}/16 ({Math.round((securityScore/16)*100)}%)
                                  </p>
                                  <p className="text-zinc-300 text-sm">
                                    You fell for several scams in this simulation. Study Bitcoin security before risking real money.
                                  </p>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex justify-center space-x-4">
                              <Button
                                onClick={() => {
                                  setSecurityTestStage(0);
                                  setSecurityScore(0);
                                  setSelectedSecurityAnswer(null);
                                  setShowSecurityFeedback(false);
                                }}
                                variant="outline"
                                className="border-zinc-600 text-white"
                              >
                                Run New Simulation
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

            {/* Transaction Simulator - Only show for premium users */}
            {isPremiumTier && simulationsSubTab === "transactions" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">Interactive Bitcoin Transaction Builder</h3>
                  <p className="text-zinc-400">Build and customize a Bitcoin transaction step-by-step</p>
                </div>

                {/* Why Transaction Understanding Matters */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-orange-600/20 rounded-lg">
                        <CreditCard className="w-6 h-6 text-orange-400" />
                      </div>
                      <h4 className="text-xl font-bold text-white">Master Bitcoin Transactions Without Risk</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-zinc-300 leading-relaxed">
                        Bitcoin transactions are permanent and irreversible - there's no "undo" button or customer service to call. 
                        Understanding how transactions work before sending real Bitcoin is crucial for avoiding costly mistakes 
                        that could result in lost funds forever.
                      </p>
                      
                      <div className="bg-zinc-800/50 rounded-lg p-4 border-l-4 border-orange-500">
                        <p className="text-zinc-300 text-sm">
                          <span className="font-semibold text-orange-300">Safe Learning:</span> This simulator uses fake addresses 
                          and amounts so you can practice building transactions safely. Learn the entire process from address 
                          generation to confirmation tracking without any financial risk.
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-semibold text-white">Transaction Journey You'll Experience:</h5>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                            <div>
                              <p className="font-medium text-white text-sm">Build Transaction</p>
                              <p className="text-zinc-400 text-xs">Set recipient address and amount</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                            <div>
                              <p className="font-medium text-white text-sm">Choose Fees</p>
                              <p className="text-zinc-400 text-xs">Select transaction speed priority</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                            <div>
                              <p className="font-medium text-white text-sm">Sign & Broadcast</p>
                              <p className="text-zinc-400 text-xs">Authorize and send to network</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
                            <div>
                              <p className="font-medium text-white text-sm">Track Confirmations</p>
                              <p className="text-zinc-400 text-xs">Watch transaction get confirmed</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center pt-2">
                        <Button
                          onClick={() => {
                            const builder = document.querySelector('[data-transaction-builder]');
                            if (builder) {
                              builder.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
                        >
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Start Building Transaction
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Interactive Transaction Builder */}
                <Card className="bg-zinc-900 border-zinc-800" data-transaction-builder>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-bold text-white mb-4">Build Your Transaction</h4>
                    <div className="space-y-6">
                      {/* Input Fields */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white">From Address</label>
                          <input
                            type="text"
                            value={transactionInputs.fromAddress}
                            onChange={(e) => updateTransactionInput('fromAddress', e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:border-orange-500 focus:outline-none"
                            placeholder="Your Bitcoin address"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white">To Address</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={transactionInputs.toAddress}
                              onChange={(e) => updateTransactionInput('toAddress', e.target.value)}
                              className="flex-1 min-w-0 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:border-orange-500 focus:outline-none"
                              placeholder="Click Paste to add recipient address"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={simulatePasteFromClipboard}
                              className="border-zinc-700 text-zinc-300 hover:border-orange-500 hover:text-orange-400 text-xs px-2 py-2 shrink-0"
                              title="Paste from clipboard"
                            >
                              📋
                            </Button>
                          </div>
                          {!transactionInputs.toAddress && (
                            <p className="text-zinc-500 text-xs">Click the paste button to simulate adding a recipient address</p>
                          )}
                        </div>
                        
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white">Amount (BTC)</label>
                            <input
                              type="number"
                              step="0.00000001"
                              value={transactionInputs.amount}
                              onChange={(e) => updateTransactionInput('amount', e.target.value)}
                              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:border-orange-500 focus:outline-none"
                              placeholder="0.001"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white">USD Value</label>
                            <div className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-green-400 text-sm">
                              ${getUSDValue(transactionInputs.amount)}
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Transaction Summary (Compact) */}
                      <div className="p-3 bg-zinc-800/30 rounded-lg">
                        <div className="grid gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Amount:</span>
                            <span className="text-white font-mono">{transactionInputs.amount} BTC</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Network Fee:</span>
                            <span className="text-white font-mono">{calculateTransactionFee()} BTC</span>
                          </div>
                          <div className="flex justify-between border-t border-zinc-700 pt-2">
                            <span className="text-zinc-300 font-medium">Total:</span>
                            <span className="text-orange-400 font-mono">{(parseFloat(transactionInputs.amount) + parseFloat(calculateTransactionFee())).toFixed(8)} BTC</span>
                          </div>
                        </div>
                      </div>

                      {/* Transaction Status and Controls */}
                      <div className="space-y-4">
                        {transactionState === "building" && (
                          <Button 
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                            onClick={proceedToPreview}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Review Transaction
                          </Button>
                        )}

                        {transactionState === "preview" && (
                          <div className="space-y-4">
                            <Card className="bg-zinc-800 border-zinc-700">
                              <CardContent className="p-4">
                                <h5 className="font-bold text-white mb-3 flex items-center">
                                  <Eye className="w-5 h-5 mr-2 text-blue-400" />
                                  Transaction Preview
                                </h5>
                                
                                {/* Fee Priority Selection (Compact) */}
                                <div className="space-y-2 mb-4">
                                  <label className="text-sm font-medium text-zinc-300">Fee Priority</label>
                                  <div className="grid gap-1">
                                    {Object.entries(feeOptions).map(([key, option]) => (
                                      <div
                                        key={key}
                                        className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                                          transactionInputs.feeRate === key
                                            ? 'bg-orange-600/20 border-orange-500'
                                            : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600'
                                        }`}
                                        onClick={() => setTransactionInputs(prev => ({ ...prev, feeRate: key }))}
                                      >
                                        <div className="flex justify-between items-center">
                                          <span className="text-white text-sm">{option.priority} • {option.time}</span>
                                          <span className="text-orange-400 font-mono text-sm">{option.cost} BTC</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Transaction Summary */}
                                <div className="p-4 bg-zinc-900/50 rounded-lg space-y-2">
                                  <h6 className="font-medium text-white">Transaction Summary</h6>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-zinc-400">Amount:</span>
                                      <div className="text-right">
                                        <div className="text-white font-mono">{transactionInputs.amount} BTC</div>
                                        <div className="text-zinc-500 text-xs">${getUSDValue(transactionInputs.amount)}</div>
                                      </div>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-zinc-400">Network Fee:</span>
                                      <div className="text-right">
                                        <div className="text-white font-mono">{getCurrentFee().cost} BTC</div>
                                        <div className="text-zinc-500 text-xs">${getUSDValue(getCurrentFee().cost)}</div>
                                      </div>
                                    </div>
                                    <div className="border-t border-zinc-700 pt-2 flex justify-between font-medium">
                                      <span className="text-zinc-300">Total:</span>
                                      <div className="text-right">
                                        <div className="text-orange-400 font-mono">{getTransactionTotal()} BTC</div>
                                        <div className="text-green-400 text-xs">${getUSDValue(getTransactionTotal())}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-3 mt-4">
                                  <Button
                                    variant="outline"
                                    className="flex-1 border-zinc-700 text-zinc-300"
                                    onClick={() => setTransactionState("building")}
                                  >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                  </Button>
                                  <Button
                                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                                    onClick={startSigning}
                                  >
                                    <Shield className="w-4 h-4 mr-2" />
                                    Sign Transaction
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}

                        {transactionState === "broadcasting" && (
                          <Card className="bg-blue-900/20 border-blue-800">
                            <CardContent className="p-4">
                              <h5 className="font-bold text-blue-300 mb-4 text-center">Transaction Journey</h5>
                              
                              {/* Journey Progress Indicator */}
                              <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between">
                                  <div className={`flex items-center gap-2 ${transactionJourney === "broadcast" ? "text-blue-300" : "text-green-400"}`}>
                                    <div className={`w-3 h-3 rounded-full ${transactionJourney === "broadcast" ? "bg-blue-400 animate-pulse" : "bg-green-400"}`}></div>
                                    <span className="text-sm font-medium">Broadcasting to Network</span>
                                  </div>
                                  {transactionJourney !== "broadcast" && <CheckCircle className="w-4 h-4 text-green-400" />}
                                </div>
                                
                                <div className={`flex items-center gap-2 ${transactionJourney === "mempool" ? "text-yellow-300" : transactionJourney === "broadcast" ? "text-zinc-500" : "text-green-400"}`}>
                                  <div className={`w-3 h-3 rounded-full ${transactionJourney === "mempool" ? "bg-yellow-400 animate-pulse" : transactionJourney === "broadcast" ? "bg-zinc-600" : "bg-green-400"}`}></div>
                                  <span className="text-sm font-medium">Mempool Queue</span>
                                  {transactionJourney === "mempool" && <span className="text-xs text-yellow-200">(Waiting for miner selection)</span>}
                                </div>
                                
                                <div className={`flex items-center gap-2 ${transactionJourney === "confirming" ? "text-yellow-300" : ["broadcast", "mempool"].includes(transactionJourney) ? "text-zinc-500" : "text-green-400"}`}>
                                  <div className={`w-3 h-3 rounded-full ${transactionJourney === "confirming" ? "bg-yellow-400 animate-pulse" : ["broadcast", "mempool"].includes(transactionJourney) ? "bg-zinc-600" : "bg-green-400"}`}></div>
                                  <span className="text-sm font-medium">Block Confirmation</span>
                                  {transactionJourney === "confirming" && <span className="text-xs text-yellow-200">({confirmationCount}/6)</span>}
                                </div>
                                
                                <div className={`flex items-center gap-2 ${transactionJourney === "settled" ? "text-green-300" : "text-zinc-500"}`}>
                                  <div className={`w-3 h-3 rounded-full ${transactionJourney === "settled" ? "bg-green-400" : "bg-zinc-600"}`}></div>
                                  <span className="text-sm font-medium">Final Settlement</span>
                                </div>
                              </div>

                              {transactionId && (
                                <div className="text-xs text-blue-200 font-mono bg-blue-900/30 p-2 rounded mb-3 break-all">
                                  TxID: {transactionId}
                                </div>
                              )}
                              
                              <div className="text-center">
                                <div className="animate-spin w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                                <p className="text-blue-100 text-sm">
                                  {transactionJourney === "broadcast" && "Broadcasting to Bitcoin network..."}
                                  {transactionJourney === "mempool" && "Transaction queued in mempool, awaiting miner selection..."}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {transactionState === "confirming" && (
                          <Card className="bg-yellow-900/20 border-yellow-800">
                            <CardContent className="p-4">
                              <h5 className="font-bold text-yellow-300 mb-4 text-center">Transaction Journey - Block Confirmation</h5>

                              {/* Journey Progress */}
                              <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-green-400">
                                  <CheckCircle className="w-4 h-4" />
                                  <span className="text-sm">✓ Broadcast to Network</span>
                                </div>
                                <div className="flex items-center gap-2 text-green-400">
                                  <CheckCircle className="w-4 h-4" />
                                  <span className="text-sm">✓ Mempool Queue</span>
                                </div>
                                <div className="flex items-center gap-2 text-yellow-300">
                                  <Clock className="w-4 h-4 animate-pulse" />
                                  <span className="text-sm font-medium">🔄 Block Confirmation ({confirmationCount}/6)</span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-500">
                                  <div className="w-4 h-4 rounded-full bg-zinc-600"></div>
                                  <span className="text-sm">Final Settlement</span>
                                </div>
                              </div>

                              {/* Confirmation Progress */}
                              <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                  <span className="text-yellow-200">Confirmations: {confirmationCount}/6</span>
                                  <span className="text-yellow-200">Time remaining: ~{timeRemaining}s</span>
                                </div>
                                
                                <div className="w-full bg-yellow-900/30 rounded-full h-3">
                                  <div 
                                    className="bg-yellow-400 h-3 rounded-full transition-all duration-1000"
                                    style={{ width: `${(confirmationCount / 6) * 100}%` }}
                                  ></div>
                                </div>

                                <div className="grid grid-cols-6 gap-1">
                                  {[...Array(6)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`h-4 rounded-sm transition-colors flex items-center justify-center text-xs font-bold ${
                                        i < confirmationCount 
                                          ? 'bg-yellow-400 text-yellow-900' 
                                          : 'bg-yellow-900/50 text-yellow-600'
                                      }`}
                                    >
                                      {i < confirmationCount ? '✓' : i + 1}
                                    </div>
                                  ))}
                                </div>

                                {transactionId && (
                                  <div className="text-xs text-yellow-200 font-mono bg-yellow-900/30 p-2 rounded break-all">
                                    TxID: {transactionId}
                                  </div>
                                )}
                                
                                {/* Educational Content Based on Confirmation Count */}
                                <div className="text-xs bg-blue-900/30 p-3 rounded border border-blue-800/50">
                                  <div className="font-medium text-blue-300 mb-2">🎓 What's happening now:</div>
                                  <div className="text-blue-200">
                                    {confirmationCount === 0 && "Your transaction is waiting in the mempool - a pool of unconfirmed transactions that miners are selecting from."}
                                    {confirmationCount === 1 && "First confirmation! A miner has included your transaction in a block. This provides basic security against double-spending."}
                                    {confirmationCount === 2 && "Second confirmation means another block was added on top. Your transaction is becoming more secure with each block."}
                                    {confirmationCount === 3 && "Three confirmations! Most merchants accept payments at this point as the chance of reversal is extremely low."}
                                    {confirmationCount === 4 && "Four confirmations provide institutional-grade security. Large exchanges often require this many confirmations."}
                                    {confirmationCount === 5 && "Five confirmations! Your transaction is now extremely secure. The computational cost to reverse it would be enormous."}
                                    {confirmationCount === 6 && "Six confirmations is considered fully settled! Your Bitcoin is now permanently and irreversibly transferred."}
                                  </div>
                                </div>
                                
                                <div className="text-xs text-yellow-300 bg-yellow-900/20 p-2 rounded">
                                  <AlertTriangle className="w-3 h-3 inline mr-1" />
                                  Real Bitcoin transactions typically take 10-60 minutes. This simulation runs in 45 seconds for educational purposes.
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {transactionState === "confirmed" && (
                          <Card className="bg-green-900/20 border-green-800">
                            <CardContent className="p-4">
                              <div className="text-center mb-4">
                                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                                <h5 className="font-bold text-green-300 mb-2 text-lg">Transaction Complete!</h5>
                                <p className="text-green-100 text-sm">Journey complete - {transactionInputs.amount} BTC successfully transferred</p>
                              </div>

                              {/* Complete Journey Overview */}
                              <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-green-400">
                                  <CheckCircle className="w-4 h-4" />
                                  <span className="text-sm">✓ Broadcast to Network</span>
                                  <span className="text-xs text-green-300 ml-auto">3s</span>
                                </div>
                                <div className="flex items-center gap-2 text-green-400">
                                  <CheckCircle className="w-4 h-4" />
                                  <span className="text-sm">✓ Mempool Queue</span>
                                  <span className="text-xs text-green-300 ml-auto">5s</span>
                                </div>
                                <div className="flex items-center gap-2 text-green-400">
                                  <CheckCircle className="w-4 h-4" />
                                  <span className="text-sm">✓ Block Confirmation (6/6)</span>
                                  <span className="text-xs text-green-300 ml-auto">36s</span>
                                </div>
                                <div className="flex items-center gap-2 text-green-400">
                                  <CheckCircle className="w-4 h-4" />
                                  <span className="text-sm font-medium">✓ Final Settlement</span>
                                  <span className="text-xs text-green-300 ml-auto">1s</span>
                                </div>
                              </div>
                              
                              <div className="space-y-2 text-xs">
                                <div className="bg-green-900/30 p-3 rounded">
                                  <p className="text-green-200 font-mono break-all">Final TxID: {transactionId}</p>
                                </div>
                                <div className="text-xs text-green-300 bg-green-900/20 p-2 rounded">
                                  ✅ Transaction is now irreversible and permanently recorded on the Bitcoin blockchain.
                                </div>
                                <div className="text-xs text-green-200 bg-green-900/10 p-2 rounded">
                                  🎓 You've experienced the complete Bitcoin transaction lifecycle! In reality, this process typically takes 10-60 minutes depending on network congestion and fee paid.
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>

                      {/* Transaction Approval Modal */}
                      {showTransactionApproval && (
                        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                          <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 max-w-md w-full">
                            <h4 className="text-lg font-bold text-white mb-4">Confirm Transaction</h4>
                            <div className="space-y-4">
                              <div className="p-4 bg-zinc-800/50 rounded-lg">
                                <h5 className="font-medium text-white mb-3">Transaction Details</h5>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-zinc-400">From:</span>
                                    <span className="text-white font-mono">{transactionInputs.fromAddress.slice(0, 15)}...</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-400">To:</span>
                                    <span className="text-white font-mono">
                                      {transactionInputs.toAddress ? 
                                        `${transactionInputs.toAddress.slice(0, 15)}...` : 
                                        'No address set'
                                      }
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-400">Amount:</span>
                                    <div className="text-right">
                                      <div className="text-orange-400 font-medium">{transactionInputs.amount} BTC</div>
                                      <div className="text-zinc-500 text-xs">${getUSDValue(transactionInputs.amount)}</div>
                                    </div>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-400">Fee:</span>
                                    <div className="text-right">
                                      <div className="text-white">{calculateTransactionFee()} BTC</div>
                                      <div className="text-zinc-500 text-xs">${getUSDValue(calculateTransactionFee())}</div>
                                    </div>
                                  </div>
                                  <div className="border-t border-zinc-700 pt-2 flex justify-between font-medium">
                                    <span className="text-zinc-300">Total:</span>
                                    <div className="text-right">
                                      <div className="text-white">{getTransactionTotal()} BTC</div>
                                      <div className="text-zinc-400 text-xs">${getUSDValue(getTransactionTotal())}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="p-3 bg-orange-600/10 border border-orange-600/20 rounded-lg">
                                <p className="text-orange-200 text-sm">
                                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                                  This is a simulation. No real Bitcoin will be sent.
                                </p>
                              </div>

                              <div className="flex gap-3">
                                <Button
                                  variant="outline"
                                  className="flex-1 border-zinc-700 text-zinc-300 hover:border-zinc-600"
                                  onClick={() => {
                                    setShowTransactionApproval(false);
                                    setTransactionState("building");
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                                  onClick={approveTransaction}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Transfer Speed Simulator */}
            {isPremiumTier && simulationsSubTab === "transfer" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">Transfer Settlement Simulator</h3>
                  <p className="text-zinc-400">Experience the dramatic difference between traditional banking and Bitcoin transfers</p>
                </div>

                {/* Why Transfer Speed Matters */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-orange-600/20 rounded-lg">
                        <Clock className="w-6 h-6 text-orange-400" />
                      </div>
                      <h4 className="text-xl font-bold text-white">Why Traditional Banking Settlement Is Broken</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-zinc-300 leading-relaxed">
                        Traditional banking transforms a simple transfer into a complex multi-institution relay race that takes days to complete. 
                        Your money passes through correspondent banks, clearing houses, and SWIFT networks - each adding delays, fees, and points of failure. 
                        Bitcoin eliminates all intermediaries with direct, cryptographic settlement that works the same way globally.
                      </p>
                      
                      <div className="bg-zinc-800/50 rounded-lg p-4 border-l-4 border-orange-500">
                        <p className="text-zinc-300 text-sm">
                          <span className="font-semibold text-orange-300">The Settlement Reality:</span> International transfers require 5-7 banks to coordinate, 
                          each charging fees and adding delays. Bitcoin settles peer-to-peer in 10 minutes with mathematical certainty, 
                          regardless of amount, distance, or time zone. No banks, no intermediaries, no delays.
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-semibold text-white">Settlement Comparison You'll Experience:</h5>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <Building2 className="w-5 h-5 text-red-400" />
                            <div>
                              <p className="font-medium text-white text-sm">Traditional Banking</p>
                              <p className="text-zinc-400 text-xs">3-5 days, $15-50 fees, business hours only</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <Bitcoin className="w-5 h-5 text-orange-400" />
                            <div>
                              <p className="font-medium text-white text-sm">Bitcoin Network</p>
                              <p className="text-zinc-400 text-xs">10 minutes, $1-5 fees, 24/7/365</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <Globe className="w-5 h-5 text-orange-400" />
                            <div>
                              <p className="font-medium text-white text-sm">International Transfers</p>
                              <p className="text-zinc-400 text-xs">Same speed globally with Bitcoin</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <Calendar className="w-5 h-5 text-orange-400" />
                            <div>
                              <p className="font-medium text-white text-sm">Weekend Testing</p>
                              <p className="text-zinc-400 text-xs">See banking's weekend blackout</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center pt-2">
                        <Button
                          onClick={() => {
                            // Scroll to the interactive section
                            document.querySelector('[data-transfer-simulator]')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 text-sm"
                        >
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Experience Transfer Speeds
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Settlement Workflow Visualization */}
                <Card className="bg-zinc-900 border-zinc-800" data-transfer-simulator>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-white flex items-center gap-3 text-xl">
                      <Clock className="w-5 h-5 text-orange-400" />
                      Interactive Transfer Race
                    </CardTitle>
                    <p className="text-zinc-400 text-sm">Watch $50,000 travel from New York to London - see the complexity difference</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {!speedRaceActive && (
                      <div className="text-center space-y-4">
                        <div className="p-6 bg-zinc-800 rounded-lg border border-zinc-700">
                          <h3 className="text-lg font-medium text-white mb-3">Transfer Scenario</h3>
                          <p className="text-zinc-300 mb-4">
                            Your business needs to send <span className="text-orange-400 font-bold">$50,000</span> from 
                            Chase Bank (New York) to Wells Fargo (London) for an urgent deal.
                          </p>
                          <p className="text-zinc-400 text-sm">
                            Compare how traditional banking vs Bitcoin handles this international transfer.
                          </p>
                        </div>
                        <Button 
                          onClick={startSettlementAnimation}
                          className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-lg font-medium"
                        >
                          Initiate Transfer Race
                        </Button>
                      </div>
                    )}

                    {speedRaceActive && (
                      <div className="space-y-6">
                        <div className="text-center">
                          <Button 
                            onClick={resetSettlementAnimation}
                            className="bg-orange-600 hover:bg-orange-700"
                            disabled={animationActive}
                          >
                            {animationActive ? "Animation Running..." : "Reset Journey"}
                          </Button>
                          {animationActive && (
                            <p className="text-zinc-400 text-sm mt-2">
                              Watch Bitcoin complete while traditional banking gets stuck...
                            </p>
                          )}
                        </div>
                        
                        {/* Compact Side-by-Side Settlement Race */}
                        <div className="space-y-4">
                          
                          {/* Headers */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-red-950/30 rounded-lg border border-red-800/30">
                              <Building2 className="w-5 h-5 text-red-400" />
                              <div>
                                <div className="text-red-300 font-bold text-sm">Traditional Banking</div>
                                <div className="text-zinc-400 text-xs">Complex, slow, expensive</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-green-950/30 rounded-lg border border-green-800/30">
                              <Zap className="w-5 h-5 text-green-400" />
                              <div>
                                <div className="text-green-300 font-bold text-sm">Bitcoin Network</div>
                                <div className="text-zinc-400 text-xs">Simple, fast, global</div>
                              </div>
                            </div>
                          </div>

                          {/* Processing Steps - Side by Side */}
                          <div className="space-y-3">
                            
                            {/* Step 1 Comparison */}
                            <div className="grid grid-cols-2 gap-4 relative">
                              {/* Traditional Step 1 */}
                              <div className={`p-3 rounded-lg border transition-all duration-500 relative ${
                                settlementProgress.traditional >= 1 
                                  ? 'bg-red-800/30 border-red-600/50' 
                                  : 'bg-zinc-800 border-zinc-700'
                              }`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    settlementProgress.traditional >= 1 ? 'bg-red-600 text-white' : 'bg-zinc-600 text-zinc-400'
                                  }`}>1</div>
                                  <div className="text-white font-medium text-sm">Visit Bank Branch</div>
                                </div>
                                <div className="text-zinc-400 text-xs leading-relaxed min-h-[40px]">
                                  Fill out international wire forms, provide recipient details, wait in line, 
                                  pay upfront fees, get tracking number
                                </div>
                                
                                {/* Vertical Flow Arrow */}
                                <div className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
                                  settlementProgress.traditional >= 1 ? 'opacity-100' : 'opacity-30'
                                }`}>
                                  <div className={`w-0.5 h-4 ${settlementProgress.traditional >= 1 ? 'bg-red-400' : 'bg-zinc-600'}`}></div>
                                  <div className={`w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent ${
                                    settlementProgress.traditional >= 1 ? 'border-t-red-400' : 'border-t-zinc-600'
                                  }`}></div>
                                </div>
                              </div>
                              
                              {/* Bitcoin Step 1 */}
                              <div className={`p-3 rounded-lg border transition-all duration-500 relative ${
                                settlementProgress.bitcoin >= 1 
                                  ? 'bg-green-800/30 border-green-600/50' 
                                  : 'bg-zinc-800 border-zinc-700'
                              }`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    settlementProgress.bitcoin >= 1 ? 'bg-green-600 text-white' : 'bg-zinc-600 text-zinc-400'
                                  }`}>1</div>
                                  <div className="text-white font-medium text-sm">Create Transaction</div>
                                </div>
                                <div className="text-zinc-400 text-xs leading-relaxed min-h-[40px]">
                                  Open wallet app, enter recipient address, specify amount, 
                                  sign with private key - takes 30 seconds
                                </div>
                                
                                {/* Vertical Flow Arrow */}
                                <div className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
                                  settlementProgress.bitcoin >= 1 ? 'opacity-100' : 'opacity-30'
                                }`}>
                                  <div className={`w-0.5 h-4 ${settlementProgress.bitcoin >= 1 ? 'bg-green-400' : 'bg-zinc-600'}`}></div>
                                  <div className={`w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent ${
                                    settlementProgress.bitcoin >= 1 ? 'border-t-green-400' : 'border-t-zinc-600'
                                  }`}></div>
                                </div>
                              </div>
                            </div>

                            {/* Step 2 Comparison */}
                            <div className="grid grid-cols-2 gap-4">
                              {/* Traditional Step 2 */}
                              <div className={`p-3 rounded-lg border transition-all duration-500 relative ${
                                settlementProgress.traditional >= 2 
                                  ? 'bg-red-800/30 border-red-600/50' 
                                  : 'bg-zinc-800 border-zinc-700'
                              }`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    settlementProgress.traditional >= 2 ? 'bg-red-600 text-white' : 'bg-zinc-600 text-zinc-400'
                                  }`}>2</div>
                                  <div className="text-white font-medium text-sm">Compliance Review</div>
                                </div>
                                <div className="text-zinc-400 text-xs leading-relaxed min-h-[120px]">
                                  Bank reviews for anti-money laundering, checks sanctions lists, 
                                  verifies business purpose, contacts correspondent banks. 
                                  Can take hours to days depending on amount and destination.
                                  
                                  {settlementProgress.traditional >= 2 && (
                                    <div className="mt-3 space-y-2">
                                      <div className="text-red-300 text-xs font-medium">Compliance Checkpoints:</div>
                                      <div className="grid grid-cols-2 gap-1">
                                        {['AML Check', 'KYC Review', 'Sanctions List', 'Purpose Verify', 'Amount Review', 'Risk Score'].map((check, i) => (
                                          <div 
                                            key={check}
                                            className={`text-center p-1 rounded text-xs transition-all duration-500 ${
                                              settlementProgress.traditional >= 3 && i < 4
                                                ? 'bg-red-600/50 text-red-200' 
                                                : 'bg-zinc-700/50 text-zinc-400'
                                            }`}
                                          >
                                            {check}
                                            <div className="text-xs">
                                              {settlementProgress.traditional >= 3 && i < 4 ? '✓' : '⏳'}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="text-red-400 text-xs mt-2">
                                        Fee accumulating: ${(25 + (settlementProgress.traditional - 1) * 8).toFixed(0)}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Bitcoin Step 2 */}
                              <div className={`p-3 rounded-lg border transition-all duration-500 ${
                                settlementProgress.bitcoin >= 2 
                                  ? 'bg-green-800/30 border-green-600/50' 
                                  : 'bg-zinc-800 border-zinc-700'
                              }`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    settlementProgress.bitcoin >= 2 ? 'bg-green-600 text-white' : 'bg-zinc-600 text-zinc-400'
                                  }`}>2</div>
                                  <div className="text-white font-medium text-sm">Network Broadcast</div>
                                </div>
                                <div className="text-zinc-400 text-xs leading-relaxed min-h-[120px]">
                                  Transaction instantly broadcasts to thousands of nodes worldwide. 
                                  Network validates signatures and balances in seconds. 
                                  No human approval needed.
                                  
                                  {settlementProgress.bitcoin >= 2 && (
                                    <div className="mt-3 space-y-2">
                                      <div className="text-green-300 text-xs font-medium">Live Network Consensus:</div>
                                      <div className="grid grid-cols-3 gap-1">
                                        {[1,2,3,4,5,6].map((miner, index) => {
                                          // Calculate if this miner should be active based on animation timing
                                          const isActive = settlementProgress.bitcoin >= 3;
                                          const shouldAnimate = settlementProgress.bitcoin === 2 || settlementProgress.bitcoin === 3;
                                          
                                          return (
                                            <div 
                                              key={miner}
                                              className={`text-center p-1 rounded text-xs transition-all duration-500 ${
                                                isActive
                                                  ? 'bg-green-600/50 text-green-200 border border-green-400/30' 
                                                  : 'bg-orange-600/50 text-orange-200'
                                              }`}
                                              style={{ 
                                                transitionDelay: shouldAnimate ? `${index * 200}ms` : '0ms',
                                                animation: isActive ? `pulse 2s infinite ${index * 0.3}s` : 'none'
                                              }}
                                            >
                                              M{miner}
                                              <div className="text-xs">
                                                {isActive ? '✓' : '⚡'}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                      <div className="text-green-400 text-xs mt-2">
                                        {settlementProgress.bitcoin >= 3 
                                          ? "6/6 miners confirmed - Transaction validated!" 
                                          : "Waiting for network consensus..."
                                        }
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Step 3 Comparison */}
                            <div className="grid grid-cols-2 gap-4">
                              {/* Traditional Step 3 */}
                              <div className={`p-3 rounded-lg border transition-all duration-500 ${
                                settlementProgress.traditional >= 3 
                                  ? 'bg-red-800/30 border-red-600/50' 
                                  : 'bg-zinc-800 border-zinc-700'
                              }`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    settlementProgress.traditional >= 3 ? 'bg-red-600 text-white' : 'bg-zinc-600 text-zinc-400'
                                  }`}>3</div>
                                  <div className="text-white font-medium text-sm">SWIFT Processing</div>
                                </div>
                                <div className="text-zinc-400 text-xs leading-relaxed min-h-[40px]">
                                  Message routed through multiple correspondent banks, 
                                  each adding delays and fees
                                  
                                  {settlementProgress.traditional >= 3 && (
                                    <div className="mt-3 space-y-2">
                                      <div className="text-red-300 text-xs font-medium">SWIFT Network Route:</div>
                                      <div className="space-y-1">
                                        <div className="grid grid-cols-2 gap-1 text-xs">
                                          {['Chase', 'JPM London', 'Barclays', 'Wells Fargo'].map((bank, i) => (
                                            <div 
                                              key={bank}
                                              className={`px-1.5 py-1 rounded text-center text-xs transition-all duration-700 ${
                                                settlementProgress.traditional >= 4 && i < 3
                                                  ? 'bg-red-600/30 text-red-200 border border-red-600/50' 
                                                  : 'bg-zinc-700/30 text-zinc-400 border border-zinc-600/30'
                                              }`}
                                            >
                                              {bank}
                                            </div>
                                          ))}
                                        </div>
                                        <div className="text-center text-zinc-500 text-xs">
                                          {settlementProgress.traditional >= 4 ? "Routing through network" : "Banks preparing routing"}
                                        </div>
                                      </div>
                                      <div className="text-red-400 text-xs">
                                        Total fees: ${(45 + (settlementProgress.traditional - 2) * 12).toFixed(0)}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Bitcoin Step 3 */}
                              <div className={`p-3 rounded-lg border transition-all duration-500 ${
                                settlementProgress.bitcoin >= 3 
                                  ? 'bg-green-800/30 border-green-600/50' 
                                  : 'bg-zinc-800 border-zinc-700'
                              }`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    settlementProgress.bitcoin >= 3 ? 'bg-green-600 text-white' : 'bg-zinc-600 text-zinc-400'
                                  }`}>3</div>
                                  <div className="text-white font-medium text-sm">Mining & Confirmation</div>
                                </div>
                                <div className="text-zinc-400 text-xs leading-relaxed min-h-[40px]">
                                  Miners compete to include transaction in next block, 
                                  proof-of-work secures the network
                                </div>
                              </div>
                            </div>

                            {/* Step 4 Comparison */}
                            <div className="grid grid-cols-2 gap-4">
                              {/* Traditional Step 4 */}
                              <div className={`p-3 rounded-lg border transition-all duration-500 ${
                                settlementProgress.traditional >= 4 
                                  ? 'bg-red-800/30 border-red-600/50' 
                                  : 'bg-zinc-800 border-zinc-700'
                              }`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    settlementProgress.traditional >= 4 ? 'bg-red-600 text-white' : 'bg-zinc-600 text-zinc-400'
                                  }`}>4</div>
                                  <div className="text-white font-medium text-sm">Intermediary Routing</div>
                                </div>
                                <div className="text-zinc-400 text-xs leading-relaxed min-h-[40px]">
                                  Funds move through intermediary banks, 
                                  each verifying and processing
                                </div>
                              </div>
                              
                              {/* Bitcoin Step 4 */}
                              <div className={`p-3 rounded-lg border transition-all duration-500 ${
                                settlementProgress.bitcoin >= 4 
                                  ? 'bg-green-800/30 border-green-600/50' 
                                  : 'bg-zinc-800 border-zinc-700'
                              }`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    settlementProgress.bitcoin >= 4 ? 'bg-green-600 text-white' : 'bg-zinc-600 text-zinc-400'
                                  }`}>4</div>
                                  <div className="text-white font-medium text-sm">Final Settlement</div>
                                </div>
                                <div className="text-zinc-400 text-xs leading-relaxed min-h-[40px]">
                                  Transaction permanently recorded on blockchain, 
                                  funds immediately available to recipient
                                </div>
                              </div>
                            </div>

                            {/* Step 5 - Only Traditional */}
                            <div className="grid grid-cols-2 gap-4">
                              {/* Traditional Step 5 */}
                              <div className={`p-3 rounded-lg border transition-all duration-500 ${
                                settlementProgress.traditional >= 5 
                                  ? 'bg-red-800/30 border-red-600/50' 
                                  : 'bg-zinc-800 border-zinc-700'
                              }`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    settlementProgress.traditional >= 5 ? 'bg-red-600 text-white' : 'bg-zinc-600 text-zinc-400'
                                  }`}>5</div>
                                  <div className="text-white font-medium text-sm">Final Settlement</div>
                                </div>
                                <div className="text-zinc-400 text-xs leading-relaxed min-h-[40px]">
                                  Recipient bank finally credits account, 
                                  funds become available
                                </div>
                              </div>
                              
                              {/* Bitcoin - Empty Step 5 */}
                              <div className="p-3 rounded-lg border bg-zinc-800 border-zinc-700 opacity-30">
                                <div className="text-center py-4">
                                  <div className="text-zinc-500 text-sm">No Step 5 Needed</div>
                                  <div className="text-zinc-600 text-xs mt-1">Bitcoin settled in 4 steps</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Enhanced Status Summary */}
                          <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="p-4 bg-red-950/40 rounded-lg border border-red-800/50">
                              <div className="text-center space-y-2">
                                <div className="text-red-400 font-bold text-lg">
                                  {settlementProgress.traditional === 0 && "Waiting..."}
                                  {settlementProgress.traditional === 1 && "At Bank Branch"}
                                  {settlementProgress.traditional === 2 && "Stuck in Compliance"}
                                  {settlementProgress.traditional === 3 && "SWIFT Routing"}
                                  {settlementProgress.traditional === 4 && "Intermediary Processing"}
                                  {settlementProgress.traditional === 5 && "Finally Complete"}
                                </div>
                                <div className="text-zinc-400 text-xs">
                                  Step {settlementProgress.traditional}/5 • Traditional Banking
                                </div>
                                
                                {/* Progress Bar */}
                                <div className="w-full bg-zinc-700 rounded-full h-2 mt-2">
                                  <div 
                                    className="bg-red-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${(settlementProgress.traditional / 5) * 100}%` }}
                                  ></div>
                                </div>
                                
                                {/* Dynamic Timing and Costs */}
                                <div className="space-y-1 text-xs">
                                  <div className="text-red-300 font-medium">
                                    {settlementProgress.traditional <= 2 && "Estimated: 3-5 business days"}
                                    {settlementProgress.traditional === 3 && "Processing through 4 banks..."}
                                    {settlementProgress.traditional === 4 && "Final bank coordination..."}
                                    {settlementProgress.traditional === 5 && "Total time: 3-5 business days"}
                                  </div>
                                  <div className="text-red-400">
                                    Current fees: ${(25 + Math.max(0, settlementProgress.traditional - 1) * 10).toFixed(0)}
                                  </div>
                                  <div className="text-zinc-500">
                                    Banks involved: {Math.min(settlementProgress.traditional + 1, 4)}/4
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-4 bg-green-950/40 rounded-lg border border-green-800/50">
                              <div className="text-center space-y-2">
                                <div className="text-green-400 font-bold text-lg">
                                  {settlementProgress.bitcoin === 0 && "Ready"}
                                  {settlementProgress.bitcoin === 1 && "Creating Transaction"}
                                  {settlementProgress.bitcoin === 2 && "Broadcasting Globally"}
                                  {settlementProgress.bitcoin === 3 && "Network Consensus"}
                                  {settlementProgress.bitcoin === 4 && "✅ SETTLED!"}
                                </div>
                                <div className="text-zinc-400 text-xs">
                                  Step {settlementProgress.bitcoin}/4 • Bitcoin Network
                                </div>
                                
                                {/* Progress Bar */}
                                <div className="w-full bg-zinc-700 rounded-full h-2 mt-2">
                                  <div 
                                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${(settlementProgress.bitcoin / 4) * 100}%` }}
                                  ></div>
                                </div>
                                
                                {/* Dynamic Information */}
                                <div className="space-y-1 text-xs">
                                  <div className="text-green-300 font-medium">
                                    {settlementProgress.bitcoin === 0 && "Ready to start"}
                                    {settlementProgress.bitcoin === 1 && "Signing with private key..."}
                                    {settlementProgress.bitcoin === 2 && "Reaching 10,000+ nodes..."}
                                    {settlementProgress.bitcoin === 3 && "6 confirmations incoming..."}
                                    {settlementProgress.bitcoin === 4 && "Total time: ~10 minutes"}
                                  </div>
                                  <div className="text-green-400">
                                    Fixed fee: $3.50
                                  </div>
                                  <div className="text-zinc-500">
                                    Intermediaries: 0 (Direct)
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Educational Summary Card */}
                        <div className="p-6 bg-gradient-to-r from-blue-950/30 to-orange-950/30 rounded-xl border border-orange-800/30">
                          <div className="space-y-6">
                            <div className="text-center">
                              <div className="text-orange-300 font-bold text-xl mb-2">Key Learning Points</div>
                              <div className="text-zinc-400 text-sm">Understanding Settlement Systems</div>
                            </div>
                            
                            {/* Comparison Stats */}
                            <div className="grid gap-4 md:grid-cols-3 text-center">
                              <div className="p-4 bg-zinc-800 rounded-lg">
                                <div className="text-green-400 font-bold text-2xl">432x</div>
                                <div className="text-zinc-300 text-sm">Faster Settlement</div>
                                <div className="text-zinc-500 text-xs">Days vs Minutes</div>
                              </div>
                              <div className="p-4 bg-zinc-800 rounded-lg">
                                <div className="text-green-400 font-bold text-2xl">93%</div>
                                <div className="text-zinc-300 text-sm">Lower Fees</div>
                                <div className="text-zinc-500 text-xs">$3.50 vs $65+</div>
                              </div>
                              <div className="p-4 bg-zinc-800 rounded-lg">
                                <div className="text-green-400 font-bold text-2xl">0</div>
                                <div className="text-zinc-300 text-sm">Intermediaries</div>
                                <div className="text-zinc-500 text-xs">Direct vs 4+ Banks</div>
                              </div>
                            </div>
                            
                            {/* Educational Points */}
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <h4 className="text-orange-300 font-semibold text-sm">Traditional Banking Problems:</h4>
                                <ul className="space-y-2 text-zinc-300 text-sm">
                                  <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Multiple compliance checkpoints create delays</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>SWIFT network requires 4+ bank intermediaries</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Each bank adds fees and processing time</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Human approval needed at every step</span>
                                  </li>
                                </ul>
                              </div>
                              
                              <div className="space-y-3">
                                <h4 className="text-green-300 font-semibold text-sm">Bitcoin's Advantages:</h4>
                                <ul className="space-y-2 text-zinc-300 text-sm">
                                  <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Direct peer-to-peer transfer (no middlemen)</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Global network validates automatically</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Fixed, transparent fees ($3-5 typical)</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Works 24/7/365 without bank hours</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            
                            {/* Bottom Line */}
                            <div className="bg-zinc-800/50 rounded-lg p-4 border-l-4 border-orange-500">
                              <div className="text-zinc-300 leading-relaxed text-center">
                                <span className="font-semibold text-orange-300">Bottom Line:</span> Traditional banking transforms 
                                a simple transfer into a complex relay race involving multiple institutions, compliance checks, and 
                                days of delays. Bitcoin eliminates this entirely with direct, cryptographic settlement that works 
                                instantly across any distance. <span className="text-orange-400 font-medium">This is why Bitcoin 
                                represents the future of global money movement.</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Compact HODL Challenge Simulator */}
            {isPremiumTier && simulationsSubTab === "hodl" && (
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

            {/* Interactive DCA Calculator */}
            {isPremiumTier && simulationsSubTab === "dca" && (
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
                              calculator.scrollIntoView({ behavior: 'smooth' });
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
