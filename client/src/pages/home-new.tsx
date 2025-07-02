import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PWAInstallButton from "@/components/PWAInstallButton";
import FinanceSection from "@/components/FinanceSection";
import SimulatorsSection from "@/components/SimulatorsSection";
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
import { MonthlySimulatorTracker } from "@/components/MonthlySimulatorTracker";

// Weekly Quiz Component
interface WeeklyQuizProps {
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
  weekNumber: number;
}

function WeeklyQuiz({ questions, weekNumber }: WeeklyQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    if (submitted) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setSubmitted(true);
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setSubmitted(false);
  };

  const correctAnswers = selectedAnswers.filter((answer, index) => 
    answer === questions[index]?.correctAnswer
  ).length;

  const scorePercentage = Math.round((correctAnswers / questions.length) * 100);

  if (showResults) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h4 className="text-xl font-bold text-white mb-2">Quiz Complete!</h4>
          <div className="text-2xl font-bold text-orange-400 mb-4">
            {correctAnswers}/{questions.length} ({scorePercentage}%)
          </div>
          <Badge className={`text-sm ${scorePercentage >= 80 ? 'bg-orange-600' : scorePercentage >= 60 ? 'bg-orange-600/70' : 'bg-zinc-600'}`}>
            {scorePercentage >= 80 ? 'Excellent!' : scorePercentage >= 60 ? 'Good Job!' : 'Keep Learning!'}
          </Badge>
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={index} className="border border-zinc-700 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-2">
                {selectedAnswers[index] === question.correctAnswer ? (
                  <CheckCircle className="w-5 h-5 text-orange-400 mt-0.5" />
                ) : (
                  <Target className="w-5 h-5 text-orange-400 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-white font-medium mb-2">{question.question}</p>
                  <p className="text-sm text-zinc-400 mb-2">
                    Your answer: {question.options[selectedAnswers[index]]}
                  </p>
                  {selectedAnswers[index] !== question.correctAnswer && (
                    <p className="text-sm text-orange-400 mb-2">
                      Correct answer: {question.options[question.correctAnswer]}
                    </p>
                  )}
                  <p className="text-sm text-zinc-300">{question.explanation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={resetQuiz} className="w-full">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retake Quiz
        </Button>
      </div>
    );
  }

  const question = questions[currentQuestion];
  if (!question) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm text-zinc-400">
          Question {currentQuestion + 1} of {questions.length}
        </span>
        <div className="w-32 bg-zinc-700 rounded-full h-2">
          <div 
            className="bg-orange-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-white mb-4">{question.question}</h4>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedAnswers[currentQuestion] === index
                  ? 'border-orange-400 bg-orange-400/10 text-white'
                  : 'border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-orange-400 bg-orange-400'
                    : 'border-zinc-600'
                }`}>
                  {selectedAnswers[currentQuestion] === index && (
                    <div className="w-3 h-3 bg-white rounded-full" />
                  )}
                </div>
                <span className="flex-1">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button 
          onClick={prevQuestion} 
          disabled={currentQuestion === 0}
          variant="outline"
        >
          Previous
        </Button>
        <Button 
          onClick={nextQuestion}
          disabled={selectedAnswers[currentQuestion] === undefined}
          className="bg-orange-500 hover:bg-orange-600"
        >
          {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </div>
    </div>
  );
}

const iconMap = {
  coins: Coins,
  cube: Box,
  "shield-alt": Shield,
  "user-secret": KeyRound,
  gem: Gem,
  zap: Zap,
  "graduation-cap": GraduationCap,
  "help-circle": HelpCircle,
  "dollar-sign": DollarSign,
  building: Building2,
  "alert-triangle": AlertTriangle,
};

const bitcoinTerms = [
  {
    term: "Bitcoin",
    definition: "A peer-to-peer electronic cash system that enables direct transactions without intermediaries like banks."
  },
  {
    term: "Blockchain",
    definition: "A distributed ledger technology that records transactions in blocks linked together chronologically."
  },
  {
    term: "Mining",
    definition: "The process of validating transactions and securing the Bitcoin network while earning new bitcoins as rewards."
  },
  {
    term: "Wallet",
    definition: "Software or hardware that stores your private keys and allows you to send and receive Bitcoin."
  },
  {
    term: "Private Key",
    definition: "A secret number that proves ownership of Bitcoin and allows you to spend it. Never share this with anyone."
  },
  {
    term: "Satoshi",
    definition: "The smallest unit of Bitcoin, named after its creator. One Bitcoin equals 100 million satoshis."
  },
  {
    term: "Halving",
    definition: "An event every 4 years where the mining reward is cut in half, reducing new Bitcoin creation."
  },
  {
    term: "HODL",
    definition: "A misspelling of 'hold' that became a strategy of keeping Bitcoin long-term regardless of price swings."
  }
];

// Seed Phrase Recovery Scenarios
const seedPhraseScenarios = [
  {
    id: 1,
    title: "Phone Replacement Emergency",
    description: "Your phone broke and you need to restore your mobile wallet on a new device.",
    difficulty: "Beginner",
    seedPhrase: Array(12).fill("hodlearn"),
    context: "You had $200 worth of Bitcoin in your mobile wallet for daily spending. Your phone screen cracked completely and won't turn on.",
    timeLimit: 300, // 5 minutes
    hints: [
      "This is a practice simulation - type 'hodlearn' for each word",
      "Seed phrases must be entered in exact order",
      "In real life, each word would be different and from the BIP39 wordlist"
    ]
  },
  {
    id: 2,
    title: "Computer Crash Recovery",
    description: "Your laptop died and you need to recover your desktop wallet to access your Bitcoin.",
    difficulty: "Intermediate",
    seedPhrase: Array(16).fill("hodlearn"),
    context: "Your desktop wallet held your main Bitcoin savings ($5,000). The hard drive failed completely but you have your seed phrase backup.",
    timeLimit: 420, // 7 minutes
    hints: [
      "This is a practice simulation - type 'hodlearn' for each word",
      "This is a 16-word seed phrase",
      "Order matters - one wrong position fails recovery in real scenarios"
    ]
  },
  {
    id: 3,
    title: "Hardware Wallet Reset",
    description: "Your hardware wallet was reset after too many wrong PIN attempts. Recover using seed phrase.",
    difficulty: "Advanced",
    seedPhrase: Array(24).fill("hodlearn"),
    context: "Your hardware wallet contains your long-term Bitcoin holdings ($25,000). Someone tried to access it and triggered the reset.",
    timeLimit: 600, // 10 minutes
    hints: [
      "This is a practice simulation - type 'hodlearn' for each word",
      "This is a 24-word seed phrase",
      "In real wallets, the last word contains a checksum for validation"
    ]
  }
];



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
    onSuccess: (_, dayIndex) => {
      // Invalidate relevant queries to refresh access data
      queryClient.invalidateQueries({ queryKey: ['/api/day-access'] });
      queryClient.invalidateQueries({ queryKey: ['/api/day-completed'] });
      queryClient.invalidateQueries({ queryKey: ['/api/next-available-day'] });
      
      // Only show completion notification if not already shown for this day
      if (!completionNotificationsShown.has(dayIndex)) {
        setCompletionNotificationsShown(prev => new Set([...prev, dayIndex]));
        toast({
          title: "Day Complete!",
          description: "Great progress! Come back tomorrow for the next lesson.",
        });
      }
    }
  });

  // Stable callback for quiz completion to prevent infinite loops
  const handleQuizCompletion = useCallback(() => {
    markDayCompletedMutation.mutate(currentDayIndex);
  }, [markDayCompletedMutation, currentDayIndex]);

  // Reset completion notifications when the calendar day changes
  useEffect(() => {
    setCompletionNotificationsShown(new Set());
  }, [currentDayIndex]);

  const [convictionSubTab, setConvictionSubTab] = useState<"whitepaper" | "books" | "videos">("whitepaper");
  const [showSplash, setShowSplash] = useState(false);
  const [expandedFacts, setExpandedFacts] = useState<Set<number>>(new Set());
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [safetyQuizScore, setSafetyQuizScore] = useState<number>(0);
  
  // Track completion notifications shown for each day to prevent duplicates
  const [completionNotificationsShown, setCompletionNotificationsShown] = useState<Set<number>>(new Set());
  
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
  
  const toggleFactExpansion = useCallback((factId: number) => {
    setExpandedFacts(prevExpanded => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(factId)) {
        newExpanded.delete(factId);
      } else {
        newExpanded.add(factId);
      }
      return newExpanded;
    });
  }, []);

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
  function cleanText(text: string): React.ReactNode {
    // First split by paragraphs (double line breaks), then handle bold formatting within each paragraph
    const paragraphs = text.split(/\n\s*\n/);
    
    return paragraphs.map((paragraph, paragraphIndex) => {
      if (!paragraph.trim()) return null;
      
      // Split by **bold** markers and render appropriately
      const parts = paragraph.split(/\*\*(.*?)\*\*/g);
      const formattedContent = parts.map((part, index) => {
        // Even indices are regular text, odd indices are bold text
        if (index % 2 === 0) {
          return part;
        } else {
          return <strong key={index} className="font-semibold text-white">{part}</strong>;
        }
      });
      
      return (
        <p key={paragraphIndex} className="mb-4 last:mb-0">
          {formattedContent}
        </p>
      );
    });
  }

  // Helper function for expanded lesson content
  function getExpandedLessonContent(title: string, content: string): Array<{
    title: string;
    paragraphs: string[];
    keyPoints?: string[];
    realWorldExample?: string;
  }> {
    switch (title) {
      case "Bitcoin vs Traditional Money: Why It Matters":
        return [
          {
            title: "The Problems with Fiat Currency",
            paragraphs: [
              "Since 1971, when President Nixon ended the gold standard, most world currencies became 'fiat' money - backed only by government promises rather than tangible assets like gold. This fundamental shift has created several critical problems that affect everyone's financial security.",
              "The most obvious problem is inflation by design. Governments can create new money at will, which reduces the purchasing power of existing money. The US dollar has lost over 85% of its value since 1971, meaning what cost $1 then requires about $6.50 today.",
              "Beyond inflation, fiat systems concentrate enormous power in the hands of central authorities. Banks and governments can freeze your accounts without warning, reverse your transactions, control who can send or receive money, and devalue your savings through unlimited money printing. This level of control gives them unprecedented power over your financial life."
            ],
            keyPoints: [
              "Fiat currencies have no backing beyond government decree since 1971",
              "Inflation is built into the system - governments profit from printing money", 
              "Central authorities control who can access and use financial services",
              "The purchasing power of fiat money consistently declines over time"
            ],
            realWorldExample: "In 2022, Canadian authorities froze bank accounts of Freedom Convoy protesters and their supporters, demonstrating how easily centralized financial systems can be weaponized against citizens."
          },
          {
            title: "Bitcoin's Revolutionary Solutions",
            paragraphs: [
              "Bitcoin addresses each of these fundamental flaws through its innovative design. Most importantly, it has a fixed supply schedule - only 21 million bitcoins will ever exist, with this limit enforced by mathematics rather than political promises.",
              "Unlike fiat systems, Bitcoin is permissionless. You don't need permission from any bank, government, or institution to send Bitcoin anywhere in the world, receive Bitcoin from anyone, store Bitcoin without account minimums, or participate regardless of location or citizenship.",
              "Bitcoin transactions are also censorship resistant. The network operates according to mathematical rules, not human discretion, making it immune to political interference."
            ],
            keyPoints: [
              "Fixed 21 million coin limit prevents monetary debasement",
              "No gatekeepers - anyone can participate without permission",
              "Transactions cannot be censored or reversed by authorities",
              "Global monetary system with identical rules everywhere"
            ],
            realWorldExample: "During Ukraine's conflict in 2022, when traditional payment systems were disrupted, Bitcoin donations continued flowing to defenders because the network operates regardless of political borders or infrastructure damage."
          },
          {
            title: "The Path to Financial Sovereignty",
            paragraphs: [
              "Bitcoin represents more than just a new type of money - it's a return to individual financial sovereignty. For the first time in generations, people can store and transfer value without depending on institutions that may not have their best interests in mind.",
              "This shift is particularly important for the 2 billion people worldwide who lack access to traditional banking services. Bitcoin provides them with a path to participate in the global economy, the ability to save for the future, and direct peer-to-peer transactions with anyone, anywhere.",
              "Even for those with access to traditional banking, Bitcoin offers protection against monetary debasement through inflation, capital controls and currency restrictions, institutional failure and bank collapses, and government interference in personal finances."
            ],
            keyPoints: [
              "True ownership - you control your funds without intermediaries",
              "Global accessibility breaks down financial barriers",
              "Protection against monetary manipulation and political interference",
              "Financial inclusion for the unbanked and underbanked worldwide"
            ],
            realWorldExample: "In countries like Argentina and Turkey, where local currencies have lost significant value, citizens increasingly turn to Bitcoin as a way to preserve their wealth and protect against hyperinflation."
          }
        ];
      case "Bitcoin as Digital Gold: Store of Value":
        return [
          {
            title: "The Search for Perfect Money",
            paragraphs: [
              "Throughout history, humans have searched for the perfect form of money. We've used seashells, cattle, salt, and precious metals. Each had strengths and weaknesses. Gold emerged as the winner for thousands of years because it was scarce, durable, and couldn't be counterfeited easily.",
              "But gold had problems. It was heavy to transport, difficult to divide precisely, and expensive to store securely. As societies grew more complex and global, these limitations became serious obstacles. Banks emerged partly to solve these problems, but they introduced new risks - counterparty risk, theft, and the need to trust institutions.",
              "For the first time in human history, Bitcoin combines the best properties of gold with the convenience of digital technology. It's as scarce as gold but infinitely more portable. It's as durable as gold but easier to store securely. It maintains value like gold but can be transmitted instantly across the globe."
            ],
            keyPoints: [
              "Gold served as money for millennia due to its scarcity and durability",
              "Physical gold has limitations: weight, divisibility, storage costs",
              "Bitcoin captures gold's benefits while eliminating its drawbacks",
              "Digital scarcity creates 'digital gold' for the internet age"
            ]
          },
          {
            title: "Why Scarcity Matters",
            paragraphs: [
              "Imagine you're collecting baseball cards, and suddenly the card company announces they'll print unlimited copies of every card. What happens to the value of your collection? It plummets to zero. Scarcity is what gives anything its value - when something becomes abundant, its value disappears.",
              "This is exactly what's happening to traditional currencies. Central banks around the world are printing money at unprecedented rates. In 2020 alone, the US Federal Reserve created more dollars than existed in the entire history of the United States prior to that year. This massive money printing dilutes the value of every dollar you hold.",
              "Bitcoin is different. Its scarcity is not based on government promises or mining difficulty - it's hardcoded into the protocol itself. The 21 million coin limit cannot be changed without unanimous agreement from the entire network, which is practically impossible. This makes Bitcoin more scarce than gold, which continues to be mined and added to the supply."
            ],
            keyPoints: [
              "Scarcity is fundamental to value - abundance destroys worth",
              "Central banks are printing money at unprecedented rates",
              "Bitcoin's 21 million limit is mathematically enforced",
              "More predictably scarce than gold or any other asset"
            ]
          },
          {
            title: "Store of Value Across Time",
            paragraphs: [
              "The ultimate test of money is whether it preserves purchasing power over time. Your great-grandparents could buy a house for $3,000 and a car for $500. Those weren't different times - that was the purchasing power of money before decades of currency debasement.",
              "Gold has maintained purchasing power remarkably well over centuries. An ounce of gold could buy a good suit of clothes in Roman times, just as it can today. But gold's performance has been inconsistent in modern times, partly due to government intervention and the complexity of storage and transport.",
              "Bitcoin, despite its volatility, has shown remarkable long-term value preservation. Anyone who bought Bitcoin and held it for four years or more has never lost money. As more people recognize Bitcoin's properties as digital gold, its price stability is likely to improve while maintaining its long-term value appreciation."
            ],
            keyPoints: [
              "Good money preserves purchasing power across decades",
              "Gold maintained value for centuries but has modern limitations",
              "Bitcoin's long-term holders have never lost money",
              "Growing recognition as 'digital gold' increases stability"
            ]
          }
        ];
      case "Understanding Bitcoin: Digital Money":
        return [
          {
            title: "What Makes Bitcoin Revolutionary",
            paragraphs: [
              "Bitcoin represents the first successful implementation of decentralized digital money. Unlike traditional digital payments that require banks, credit card companies, or payment processors to verify and complete transactions, Bitcoin operates on a peer-to-peer network where thousands of computers worldwide work together to validate payments.",
              "This fundamental difference means that no single entity can control, freeze, or reverse your Bitcoin transactions. When you send Bitcoin, you're not asking permission from a bank or waiting for business hours - you're participating in a global financial network that operates 24/7/365.",
              "The implications are profound: Bitcoin provides financial sovereignty, meaning you have complete control over your money without depending on traditional financial institutions."
            ],
            keyPoints: [
              "No central authority controls Bitcoin - it's truly decentralized",
              "Transactions are verified by network consensus, not banks",
              "You maintain complete control over your funds",
              "The network operates globally without business hours or restrictions"
            ]
          },
          {
            title: "Cryptographic Security That You Can Trust",
            paragraphs: [
              "Bitcoin's security model relies on advanced cryptography that has been battle-tested for over a decade. Every Bitcoin transaction is protected by the same cryptographic principles used by banks, governments, and militaries worldwide.",
              "When you own Bitcoin, you control a private key - essentially a secret number that proves ownership of your Bitcoin. This private key generates a unique digital signature for each transaction, proving you authorized the payment without revealing the key itself.",
              "The beauty of this system is that the Bitcoin network can verify your signature is authentic without ever seeing your private key. This means only you can spend your Bitcoin, even if the entire world can see the transaction on the blockchain."
            ],
            keyPoints: [
              "Private keys provide mathematical proof of ownership",
              "Digital signatures prove authorization without revealing secrets",
              "Cryptographic security has never been broken in Bitcoin's history",
              "Your Bitcoin is secured by the same cryptography protecting national secrets"
            ]
          },
          {
            title: "Global Money That Never Sleeps", 
            paragraphs: [
              "Bitcoin operates as truly global money, working identically everywhere in the world without borders, time zones, or currency conversions. Whether you're in New York or Nigeria, Tokyo or Toronto, Bitcoin functions the same way with the same level of security and accessibility.",
              "Traditional international payments can take days, cost significant fees, and require multiple intermediaries. Bitcoin transactions typically confirm within 10-60 minutes regardless of distance, with fees that are often a fraction of traditional wire transfers.",
              "This global accessibility becomes crucial during emergencies, political upheaval, or in regions with limited banking infrastructure. Bitcoin provides a financial lifeline when traditional systems fail or are inaccessible."
            ],
            keyPoints: [
              "Bitcoin works identically worldwide - no currency conversion needed",
              "Transactions process 24/7 regardless of holidays or business hours", 
              "Lower fees compared to international wire transfers",
              "No permission required from banks or governments to transact"
            ]
          }
        ];
      default:
        // Split content by double line breaks to preserve formatting
        const paragraphs = (content || '').split('\n\n').filter(p => p.trim().length > 0);
        return [
          {
            title: "Core Concepts",
            paragraphs: paragraphs,
            keyPoints: [
              "Bitcoin works in a completely new way",
              "No single control gives people freedom over their money", 
              "Strong security keeps your money safe",
              "Anyone with internet can use it anywhere in the world"
            ]
          }
        ];
    }
  }

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



  // Dynamic greeting based on time of day
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good night";
  };



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
          <div className="space-y-8">
            {/* Welcome Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">
                {getTimeBasedGreeting()}{user?.firstName ? `, ${user.firstName}` : ''}!
              </h1>
            </div>

            {/* Simple Streak Display */}
            <div className="text-center space-y-2 mb-8">
              <div className="text-orange-400 text-2xl font-bold">
                {user?.currentStreak || 0} day streak
              </div>
              <div className="text-zinc-400 text-sm">
                Keep the habit strong
              </div>
            </div>

            {/* Main Learning Card */}
            <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-colors">
              <CardContent className="p-8">
                <div className="space-y-6 text-center">
                  {/* Day indicator at top */}
                  <div className="text-sm text-zinc-400">
                    Day {currentDayIndex} of your Bitcoin journey
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white">
                    {dayMetadata?.title || 'Loading...'}
                  </h3>
                  
                  {/* Subtitle - first daily fact */}
                  {dailyFacts && dailyFacts[0] && (
                    <p className="text-zinc-300">
                      {dailyFacts[0].title}
                    </p>
                  )}
                  
                  {/* Continue button */}
                  <button 
                    onClick={() => setActiveSection("learn")}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 rounded-lg font-medium transition-colors text-lg"
                  >
                    Continue Learning
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Access */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setActiveSection("simulations")}
                className="bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 rounded-lg p-4 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Gamepad2 className="w-5 h-5 text-orange-400" />
                  <div>
                    <div className="text-white font-medium">Simulators</div>
                    <div className="text-zinc-400 text-sm">Practice tools</div>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => setActiveSection("more")}
                className="bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 rounded-lg p-4 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MoreHorizontal className="w-5 h-5 text-orange-400" />
                  <div>
                    <div className="text-white font-medium">More</div>
                    <div className="text-zinc-400 text-sm">Explore</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
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
            {false && learnSubTab === "today" && (
              <div className="flex justify-center">
                <div className="flex items-center gap-3 bg-zinc-800/50 rounded-lg p-3 border border-zinc-600">
                  <span className="text-xs text-zinc-400 font-medium">DEV CONTROL:</span>
                  
                  {/* Day Navigation */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTestDayOverride(Math.max(1, currentDayIndex - 1))}
                      disabled={currentDayIndex <= 1}
                      className="text-xs px-2 py-1"
                    >
                      ←
                    </Button>
                    
                    <span className="text-xs text-white px-2 font-medium">
                      Day {currentDayIndex}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTestDayOverride(Math.min(90, currentDayIndex + 1))}
                      disabled={currentDayIndex >= 90}
                      className="text-xs px-2 py-1"
                    >
                      →
                    </Button>
                  </div>

                  {/* Approval Status Display */}
                  <div className="flex items-center gap-2 border-l border-zinc-600 pl-3">
                    <span className="text-sm text-zinc-300 font-medium">Status:</span>
                    <span className={`text-sm font-bold px-3 py-1 rounded-md border ${
                      dayMetadata?.isApproved === true 
                        ? 'bg-green-900/50 text-green-300 border-green-600' 
                        : dayMetadata?.isApproved === false 
                          ? 'bg-red-900/50 text-red-300 border-red-600' 
                          : 'bg-yellow-900/50 text-yellow-300 border-yellow-600'
                    }`}>
                      {dayMetadata?.isApproved === true ? 'APPROVED' : dayMetadata?.isApproved === false ? 'NEEDS FIXING' : 'PENDING'}
                    </span>
                    
                    {/* Quick Action Buttons */}
                    <div className="flex gap-1">
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          const button = e.currentTarget;
                          button.disabled = true;
                          try {
                            const response = await fetch(`/api/content-day/${currentDayIndex}/approval`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ isApproved: false })
                            });
                            if (response.ok) {
                              await queryClient.invalidateQueries({ queryKey: ['/api/day-metadata', currentDayIndex] });
                            }
                          } catch (error) {
                            console.error('Error updating approval:', error);
                          } finally {
                            button.disabled = false;
                          }
                        }}
                        className="text-xs px-2 py-1 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-colors disabled:opacity-50"
                        title="Mark as needs fixing"
                      >
                        Needs Fix
                      </button>
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          const button = e.currentTarget;
                          button.disabled = true;
                          try {
                            const response = await fetch(`/api/content-day/${currentDayIndex}/approval`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ isApproved: null })
                            });
                            if (response.ok) {
                              await queryClient.invalidateQueries({ queryKey: ['/api/day-metadata', currentDayIndex] });
                            }
                          } catch (error) {
                            console.error('Error updating approval:', error);
                          } finally {
                            button.disabled = false;
                          }
                        }}
                        className="text-xs px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded hover:bg-yellow-600/30 transition-colors disabled:opacity-50"
                        title="Mark as pending"
                      >
                        Pending
                      </button>
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          const button = e.currentTarget;
                          button.disabled = true;
                          try {
                            const response = await fetch(`/api/content-day/${currentDayIndex}/approval`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ isApproved: true })
                            });
                            if (response.ok) {
                              await queryClient.invalidateQueries({ queryKey: ['/api/day-metadata', currentDayIndex] });
                            }
                          } catch (error) {
                            console.error('Error updating approval:', error);
                          } finally {
                            button.disabled = false;
                          }
                        }}
                        className="text-xs px-2 py-1 bg-green-600/20 text-green-400 rounded hover:bg-green-600/30 transition-colors disabled:opacity-50"
                        title="Mark as approved"
                      >
                        Approve
                      </button>
                    </div>
                  </div>

                  {/* Reset Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTestDayOverride(null)}
                    className="text-xs px-2 py-1 text-orange-400 hover:text-orange-300 border-l border-zinc-600 pl-3"
                  >
                    Today
                  </Button>
                </div>
              </div>
            )}

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
                          const deepDive = fact.diveDeeper; // Only use storage data - no frontend fallback
                          const isExpanded = expandedFacts.has(fact.id);
                          

                          

                          

                          
                          return (
                            <div key={fact.id} className="bg-zinc-800/50 rounded-lg overflow-hidden">
                              <div className="flex items-center gap-4 p-4">
                                <div className="p-2 bg-orange-600/20 rounded-lg flex-shrink-0">
                                  <IconComponent className="w-5 h-5 text-orange-400" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-white">{fact.title}</h4>
                                  
                                  {deepDive && (
                                    <div className="flex justify-end">
                                      <button
                                        onClick={() => toggleFactExpansion(fact.id)}
                                        className="text-orange-400 hover:text-orange-300 text-sm flex items-center gap-1 transition-colors"
                                      >
                                        <span>Dive Deeper</span>
                                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {isExpanded && deepDive && (
                                <div className="border-t border-zinc-700 p-4 bg-zinc-900/50">
                                  <div className="space-y-4">
                                    <div>
                                      <h5 className="font-medium text-orange-300 mb-2">Deep Explanation</h5>
                                      <p className="text-zinc-300 text-sm leading-relaxed">{deepDive.explanation}</p>
                                    </div>
                                    
                                    <div>
                                      <h5 className="font-medium text-orange-300 mb-2">Visual Description</h5>
                                      <p className="text-zinc-300 text-sm italic">{deepDive.visualDescription}</p>
                                    </div>
                                    
                                    <div>
                                      <h5 className="font-medium text-orange-300 mb-2">Real Examples</h5>
                                      <ul className="space-y-1">
                                        {deepDive.examples.map((example, idx) => (
                                          <li key={idx} className="text-zinc-300 text-sm flex items-baseline gap-2">
                                            <span className="text-orange-400 text-sm">•</span>
                                            <span>{example}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    

                                  </div>
                                </div>
                              )}
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
          <FinanceSection />
        )}

        {/* Simulators Section */}
        {activeSection === "simulations" && (
          <SimulatorsSection />
        )}

        {/* Previous Finance Section - Now Removed to reduce file size */}
        {false && activeSection === "money" && (
          <div className="space-y-8">
            {/* Hero Narrative */}
            <Card className="bg-gradient-to-br from-orange-950/30 via-zinc-900 to-red-950/30 border-orange-800/50">
              <CardContent className="p-8">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    The Hidden Tax <span className="text-red-400">Eating Your Savings</span>
                  </h2>
                  
                  <div className="text-lg text-zinc-300 leading-relaxed space-y-4">
                    <p>
                      Every year, your money buys less than it did the year before. This isn't an accident—it's how the current money system works.
                    </p>
                    
                    <p>
                      <span className="text-orange-400 font-semibold">What cost $1 in 1920 now costs $15.50.</span> Your great-grandparents could buy a house with one income. Today, two incomes barely cover rent.
                    </p>
                    
                    <p>
                      The reason? Central banks can print unlimited money, making each dollar worth less over time.
                    </p>
                    
                    <p>
                      But what if there was <span className="text-orange-400 font-semibold">money that couldn't be printed?</span> For the first time in history, Bitcoin offers mathematically limited supply—only 21 million will ever exist.
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
                  
                  <div className="mt-8 p-6 bg-orange-950/20 rounded-xl border border-orange-800/30">
                    <div className="text-orange-300 font-semibold text-lg mb-2">
                      Ready to understand the difference?
                    </div>
                    <div className="text-zinc-300">
                      The tools below show you exactly how inflation works and why Bitcoin offers an alternative. 
                      No complicated math—just clear examples you can explore at your own pace.
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
                        Your $25,000 faces two very different futures. Bitcoin averaged 155% annual growth over the last 5 years (2019-2024), 
                        but let's be conservative and see what happens with just 25% annual growth going forward:
                      </p>
                    </div>
                    
                    {/* Compact Racing Animation */}
                    <div className="space-y-2">
                      {[
                        { step: 0, year: "Today", savings: 25000, btc: 25000, narrative: "Both start equal" },
                        { step: 1, year: "2 years", savings: 23523, btc: 39063, narrative: "Conservative growth begins" },
                        { step: 2, year: "5 years", savings: 21467, btc: 76294, narrative: "Scarcity effect emerges" },
                        { step: 3, year: "10 years", savings: 18435, btc: 232831, narrative: "Fixed supply advantage" },
                        { step: 4, year: "15 years", savings: 15825, btc: 710543, narrative: "Compound growth accelerates" },
                        { step: 5, year: "20 years", savings: 13595, btc: 2168405, narrative: "Exponential effect builds" },
                        { step: 6, year: "25 years", savings: 11675, btc: 6617445, narrative: "Long-term scarcity rewards" }
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
                                  style={{ width: isActive ? `${
                                    btc <= 50000 ? (btc/50000) * 20 :
                                    btc <= 250000 ? 20 + ((btc-50000)/200000) * 25 :
                                    btc <= 1000000 ? 45 + ((btc-250000)/750000) * 25 :
                                    btc <= 3000000 ? 70 + ((btc-1000000)/2000000) * 20 :
                                    90 + ((btc-3000000)/4000000) * 10
                                  }%` : '0%' }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Historical Performance Summary */}
                    {inflationProgress >= 6 && (
                      <div className="space-y-3 p-4 bg-zinc-800/30 rounded-lg border border-orange-400/20">
                        <div className="text-center">
                          <div className="text-orange-400 font-bold text-sm mb-2">The 25-Year Conservative Projection</div>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="text-center">
                              <div className="text-red-400 font-medium">Traditional Savings</div>
                              <div className="text-red-300 text-lg font-bold">$11,675</div>
                              <div className="text-red-400">Lost 53% to inflation (3% per year)</div>
                            </div>
                            <div className="text-center">
                              <div className="text-orange-400 font-medium">Conservative Bitcoin</div>
                              <div className="text-orange-300 text-lg font-bold">$6.6M</div>
                              <div className="text-orange-400">264x growth<br/>(25% per year)</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center pt-2 border-t border-zinc-700/50">
                          <p className="text-zinc-400 text-xs leading-relaxed">
                            Conservative projection using <span className="text-orange-400 font-medium">25% annual growth</span> despite Bitcoin's 155% historical rate (2019-2024). 
                            While past performance doesn't guarantee future results, Bitcoin's fixed supply and growing adoption 
                            create structural advantages over inflating fiat currencies.
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
              <h3 className="text-2xl font-bold mb-6 text-orange-400 text-center">Ready to Start Learning?</h3>
              <div className="space-y-6 text-zinc-300 leading-relaxed max-w-4xl mx-auto">
                <p className="text-lg">
                  You've seen how traditional finance works differently than most people realize. Inflation quietly erodes purchasing power. 
                  International transfers take days and cost fees. Banking operates on schedules that don't match our global economy.
                </p>
                <p>
                  Bitcoin offers a completely different approach. Fixed supply instead of endless printing. Direct peer-to-peer transfers 
                  without intermediaries. A system that runs 24/7 without holidays or "business hours."
                </p>
                <p>
                  This isn't about getting rich quick—it's about understanding a technology that's reshaping how money works. Major institutions, 
                  governments, and millions of individuals worldwide are studying and adopting Bitcoin for good reasons.
                </p>
                <p>
                  The best part? You can learn at your own pace, with no pressure and no risk. Start with the basics, practice with safe 
                  simulations, and build genuine understanding of this fascinating technology.
                </p>
                <p className="text-orange-300 font-medium text-lg text-center">
                  Your journey to understanding Bitcoin starts with curiosity, not urgency. Every question you have is valid, 
                  and every step forward builds real knowledge.
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

        {/* Simulators Section - Now using component */}
        {activeSection === "simulations" && <SimulatorsSection />}

        {/* Old Simulators Section removed to reduce file size */}
        {/* More Section */}
        {activeSection === "more" && (
          <div className="space-y-6">
            {/* More Sub-navigation */}
            <div className="flex justify-center">
              <div className="flex flex-wrap justify-center gap-2 bg-zinc-800/50 rounded-lg p-2">
                <Button
                  variant={moreSubTab === "about" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setMoreSubTab("about")}
                  className="text-xs px-3 py-1"
                >
                  <Info className="w-3 h-3 mr-1" />
                  About Us
                </Button>
                <Button
                  variant={moreSubTab === "store" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setMoreSubTab("store")}
                  className="text-xs px-3 py-1"
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Store
                </Button>
              </div>
            </div>

            {/* Store Section */}
            {moreSubTab === "store" && (
              <div className="relative space-y-6">
                {/* Coming Soon Watermark Overlay */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                  <div className="text-center space-y-4">
                    <div className="text-6xl font-bold text-orange-500/20 transform -rotate-12 select-none">
                      COMING SOON
                    </div>
                    <div className="bg-zinc-900/90 rounded-lg p-6 border border-orange-500/30">
                      <h4 className="text-2xl font-bold text-orange-400 mb-2">Store Opening Soon</h4>
                      <p className="text-zinc-300 max-w-md">
                        We're curating the best Bitcoin hardware, books, and learning resources for you. 
                        Check back soon for exclusive deals!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">Bitcoin Learning Store</h3>
                  <p className="text-zinc-400">Essential tools and resources for your Bitcoin journey</p>
                </div>

                {/* Product Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Hardware Wallets */}
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <h4 className="text-lg font-bold text-white mb-4">Hardware Wallets</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                          <div>
                            <h5 className="font-semibold text-white">Ledger Nano X</h5>
                            <p className="text-sm text-zinc-400">Secure hardware wallet</p>
                          </div>
                          <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                            $149
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                          <div>
                            <h5 className="font-semibold text-white">Trezor Model T</h5>
                            <p className="text-sm text-zinc-400">Advanced security features</p>
                          </div>
                          <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                            $219
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Books */}
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <h4 className="text-lg font-bold text-white mb-4">Essential Reading</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                          <div>
                            <h5 className="font-semibold text-white">Broken Money by Lyn Alden</h5>
                            <p className="text-sm text-zinc-400">Modern monetary analysis</p>
                          </div>
                          <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                            $25
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                          <div>
                            <h5 className="font-semibold text-white">The Bitcoin Standard</h5>
                            <p className="text-sm text-zinc-400">Bitcoin economics masterpiece</p>
                          </div>
                          <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                            $20
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Affiliate Disclosure */}
                <div className="text-center">
                  <p className="text-xs text-zinc-500">
                    We may earn a commission from purchases made through these links. This helps support BTC Journey's educational mission.
                  </p>
                </div>
              </div>
            )}

            {/* About Us Section */}
            {moreSubTab === "about" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">About HODLearn</h3>
                  <p className="text-zinc-400">The story behind how to learn Bitcoin</p>
                </div>

                {/* Navigation to full About page */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-2xl mx-auto">
                        HL
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">Learn Our Story</h4>
                        <p className="text-zinc-300 mb-4">
                          Discover how HODLearn connects the patience of HODLing with the journey of learning Bitcoin. 
                          From overwhelmed beginners to building conviction through understanding.
                        </p>
                        <Button 
                          onClick={() => window.location.href = '/about'}
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          Read Our Full Story
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Philosophy Summary */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-orange-400 mt-1" />
                        <div>
                          <h5 className="font-semibold text-white mb-1">Your Pace</h5>
                          <p className="text-sm text-zinc-400">
                            Everyone learns Bitcoin differently. We meet you where you are.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Heart className="w-5 h-5 text-orange-400 mt-1" />
                        <div>
                          <h5 className="font-semibold text-white mb-1">Built with Care</h5>
                          <p className="text-sm text-zinc-400">
                            Every lesson is written like we're explaining it to our own family.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      
      {/* Development Tools - Hidden for deployment */}
      {false && <DevSubscriptionToggle />}
      
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
