import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Play,
  ShoppingCart,
  Quote,
  ExternalLink,
  Globe,
  Users,
  FileText,
  Calendar,
  Flag,
  Network,
  ArrowRight,
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
  Brain
} from "lucide-react";
import type { User, DailyFact, Lesson, UserProgress, ConvictionContent } from "@shared/schema";
import DailyQuiz from "@/components/DailyQuiz";
import { BitcoinTerm, AutoGlossary } from "@/components/BitcoinGlossary";
import { useToast } from "@/hooks/use-toast";
import { ProgressIndicator, AchievementBadge, LearningAnalytics } from "@/components/ProgressIndicator";
import AchievementSystem from "@/components/AchievementSystem";

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
          <Badge className={`text-sm ${scorePercentage >= 80 ? 'bg-green-600' : scorePercentage >= 60 ? 'bg-orange-600' : 'bg-red-600'}`}>
            {scorePercentage >= 80 ? 'Excellent!' : scorePercentage >= 60 ? 'Good Job!' : 'Keep Learning!'}
          </Badge>
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={index} className="border border-zinc-700 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-2">
                {selectedAnswers[index] === question.correctAnswer ? (
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                ) : (
                  <Target className="w-5 h-5 text-red-400 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-white font-medium mb-2">{question.question}</p>
                  <p className="text-sm text-zinc-400 mb-2">
                    Your answer: {question.options[selectedAnswers[index]]}
                  </p>
                  {selectedAnswers[index] !== question.correctAnswer && (
                    <p className="text-sm text-green-400 mb-2">
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



type MainSection = "learn" | "finance" | "simulations" | "more";
type LearnSubTab = "today" | "reference";
type SimulationsSubTab = "safety" | "transactions" | "hodl" | "dca" | "inflation";
type MoreSubTab = "store";

export default function Home() {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<MainSection>("learn");
  const [learnSubTab, setLearnSubTab] = useState<LearnSubTab>("today");
  const [simulationsSubTab, setSimulationsSubTab] = useState<SimulationsSubTab>("safety");
  const [moreSubTab, setMoreSubTab] = useState<MoreSubTab>("store");
  
  // Day navigation for testing generated content (defaulting to Month 1 range)
  const [testDayOverride, setTestDayOverride] = useState<number | null>(0);
  const naturalDayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % 30; // Range 0-29 (0-based)
  const currentDayIndex = testDayOverride !== null ? testDayOverride : naturalDayIndex;

  const [convictionSubTab, setConvictionSubTab] = useState<"whitepaper" | "books" | "videos">("whitepaper");
  const [showSplash, setShowSplash] = useState(true);
  const [expandedFacts, setExpandedFacts] = useState<Set<number>>(new Set());
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [safetyQuizScore, setSafetyQuizScore] = useState<number>(0);
  
  // Finance section interactive states
  const [inflationAmount, setInflationAmount] = useState<string>("10000");
  const [inflationYears, setInflationYears] = useState<number>(10);
  const [inflationRate, setInflationRate] = useState<number>(3.0);
  const [inflationSliderYear, setInflationSliderYear] = useState<number>(0);
  const [transferCount, setTransferCount] = useState<string>("2");
  const [transferAmount, setTransferAmount] = useState<string>("1000");
  const [speedRaceActive, setSpeedRaceActive] = useState<boolean>(false);
  const [settlementProgress, setSettlementProgress] = useState({ traditional: 0, bitcoin: 0 });
  const [animationActive, setAnimationActive] = useState(false);
  const [inflationSimActive, setInflationSimActive] = useState(false);
  const [inflationProgress, setInflationProgress] = useState(0); // 0-6 representing years 0,1,5,10,15,20,25
  
  // Money Supply Visualization State
  const [moneySupplyYear, setMoneySupplyYear] = useState(2024);

  // Money Supply Helper Functions
  const getMoneySupplyRaw = (year: number): number => {
    // Authentic M2 Money Supply data (in trillions) - 1920 to 2024
    const dataPoints: { [key: number]: number } = {
      1920: 0.023, 1929: 0.026, 1933: 0.020, 1940: 0.040, 1945: 0.107, 
      1950: 0.117, 1960: 0.167, 1971: 0.583, 1980: 1.600, 1990: 3.200, 
      2000: 4.900, 2008: 7.500, 2010: 8.700, 2015: 12.400, 2020: 15.400, 
      2021: 20.100, 2024: 21.000
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
    return dataPoints[2024];
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

  // Calculate purchasing power percentage based on CPI data
  const getPurchasingPowerPercentage = (year: number): number => {
    // Using authentic CPI data to calculate purchasing power
    // 1920 baseline = 100% purchasing power
    const cpiData: { [key: number]: number } = {
      1920: 20.0, 1930: 16.7, 1940: 14.0, 1950: 24.1, 1960: 29.6,
      1971: 40.5, 1980: 82.4, 1990: 130.7, 2000: 172.2, 2008: 215.3,
      2010: 218.1, 2015: 237.0, 2020: 258.8, 2021: 271.0, 2022: 292.7,
      2023: 307.0, 2024: 310.3
    };
    
    const years = Object.keys(cpiData).map(Number).sort();
    let currentCPI = cpiData[1920]; // default to 1920
    
    if (year <= years[0]) {
      currentCPI = cpiData[years[0]];
    } else if (year >= years[years.length - 1]) {
      currentCPI = cpiData[years[years.length - 1]];
    } else {
      for (let i = 0; i < years.length - 1; i++) {
        if (year >= years[i] && year <= years[i + 1]) {
          const progress = (year - years[i]) / (years[i + 1] - years[i]);
          currentCPI = cpiData[years[i]] + progress * (cpiData[years[i + 1]] - cpiData[years[i]]);
          break;
        }
      }
    }
    
    // Calculate purchasing power: (1920 CPI / current CPI) * 100
    return (cpiData[1920] / currentCPI) * 100;
  };

  // Settlement Animation Logic
  const startSettlementAnimation = () => {
    setSpeedRaceActive(true);
    setAnimationActive(true);
    setSettlementProgress({ traditional: 0, bitcoin: 0 });

    // Bitcoin animation: completes all 4 steps in 10 seconds (out of 30)
    const bitcoinSteps = [
      { step: 1, delay: 1000 },   // Step 1 at 1 second
      { step: 2, delay: 2000 },   // Step 2 at 2 seconds  
      { step: 3, delay: 8000 },   // Step 3 at 8 seconds (mining)
      { step: 4, delay: 10000 }   // Step 4 at 10 seconds (complete)
    ];

    // Traditional banking: only gets to step 2 in 30 seconds (stuck in compliance)
    const traditionalSteps = [
      { step: 1, delay: 5000 },   // Step 1 at 5 seconds (branch visit)
      { step: 2, delay: 15000 }   // Step 2 at 15 seconds (still in compliance)
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

    // End animation after 30 seconds
    setTimeout(() => {
      setAnimationActive(false);
    }, 30000);
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
  
  const toggleFactExpansion = (factId: number) => {
    const newExpanded = new Set(expandedFacts);
    if (newExpanded.has(factId)) {
      newExpanded.delete(factId);
    } else {
      newExpanded.add(factId);
    }
    setExpandedFacts(newExpanded);
  };

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
            <rect x="20" y="20" width="60" height="40" rx="8" fill="#3b82f6" opacity="0.3" stroke="#3b82f6"/>
            <text x="50" y="45" text-anchor="middle" fill="#3b82f6" fontSize="12">Your Wallet</text>
            <rect x="220" y="20" width="60" height="40" rx="8" fill="#10b981" opacity="0.3" stroke="#10b981"/>
            <text x="250" y="45" text-anchor="middle" fill="#10b981" fontSize="12">Friend's Wallet</text>
            <path d="M 80 40 Q 150 20 220 40" stroke="#f59e0b" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)"/>
            <text x="150" y="35" text-anchor="middle" fill="#f59e0b" fontSize="11">Direct Transfer</text>
            <circle cx="150" cy="80" r="25" fill="#6366f1" opacity="0.2" stroke="#6366f1"/>
            <text x="150" y="85" text-anchor="middle" fill="#6366f1" fontSize="10">Bitcoin Network</text>
            <defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b"/></marker></defs>
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
            <rect x="20" y="20" width="50" height="30" rx="4" fill="#ef4444" opacity="0.3" stroke="#ef4444"/>
            <text x="45" y="38" text-anchor="middle" fill="#ef4444" fontSize="10">Miner 1</text>
            <rect x="90" y="20" width="50" height="30" rx="4" fill="#f59e0b" opacity="0.3" stroke="#f59e0b"/>
            <text x="115" y="38" text-anchor="middle" fill="#f59e0b" fontSize="10">Miner 2</text>
            <rect x="160" y="20" width="50" height="30" rx="4" fill="#10b981" opacity="0.3" stroke="#10b981"/>
            <text x="185" y="38" text-anchor="middle" fill="#10b981" fontSize="10">Winner!</text>
            <rect x="230" y="20" width="50" height="30" rx="4" fill="#6b7280" opacity="0.3" stroke="#6b7280"/>
            <text x="255" y="38" text-anchor="middle" fill="#6b7280" fontSize="10">Miner N</text>
            <rect x="120" y="80" width="80" height="40" rx="8" fill="#3b82f6" opacity="0.3" stroke="#3b82f6"/>
            <text x="160" y="105" text-anchor="middle" fill="#3b82f6" fontSize="12">New Block Added</text>
            <path d="M 185 50 L 180 80" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrowhead2)"/>
            <defs><marker id="arrowhead2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#10b981"/></marker></defs>
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
    // Split by **bold** markers and render appropriately
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) => {
      // Even indices are regular text, odd indices are bold text
      if (index % 2 === 0) {
        return part;
      } else {
        return <strong key={index} className="font-semibold text-white">{part}</strong>;
      }
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
        const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
        return [
          {
            title: "Core Concepts",
            paragraphs: paragraphs,
            keyPoints: [
              "Bitcoin operates on revolutionary principles",
              "Decentralization provides unprecedented financial freedom", 
              "Cryptographic security ensures your funds remain safe",
              "Global accessibility opens new possibilities for financial inclusion"
            ]
          }
        ];
    }
  }

  const getLessonTakeaways = (lessonTitle: string): string[] => {
    const takeaways: Record<string, string[]> = {
      "Bitcoin vs Traditional Money: Why It Matters": [
        "**Fiat currencies** are backed only by government promises and consistently lose purchasing power through inflation by design",
        "**Central authorities** can freeze accounts, reverse transactions, and exclude people from the financial system at will", 
        "**Bitcoin's fixed supply** of 21 million coins protects against monetary debasement and provides predictable scarcity",
        "**Permissionless access** means anyone with internet can participate in Bitcoin without needing approval from banks or governments",
        "**Financial sovereignty** returns control of money to individuals, protecting against institutional failure and political interference"
      ],
      "Understanding Bitcoin: Digital Money": [
        "Bitcoin is the first successful peer-to-peer digital cash system that works without banks or central authorities",
        "Cryptographic signatures ensure only you can spend your Bitcoin, providing security without revealing private keys",
        "Bitcoin operates 24/7 globally, making it accessible to anyone with internet access regardless of location or banking status",
        "The decentralized network means no single entity can control, freeze, or reverse your transactions"
      ],
      "Bitcoin Mining: Securing the Network": [
        "Mining is a competitive process where computers solve puzzles to add new blocks and earn Bitcoin rewards",
        "Energy consumption directly correlates with network security - more energy makes Bitcoin harder to attack",
        "Difficulty adjustment every 2016 blocks ensures consistent 10-minute block times regardless of mining participation",
        "The economic incentives align miners' interests with network security, creating a robust and self-sustaining system"
      ],
      "Digital Scarcity: Fixed Supply": [
        "Bitcoin's 21 million coin limit is hardcoded and cannot be changed, creating true digital scarcity",
        "Halving events every 4 years reduce new Bitcoin creation, increasing scarcity over time",
        "Unlike fiat currencies, Bitcoin cannot be inflated away by central banks or governments",
        "Digital scarcity combined with increasing demand creates long-term value preservation potential"
      ],
      "Decentralized Network: No Central Control": [
        "Thousands of independent nodes worldwide maintain identical copies of Bitcoin's transaction history",
        "No single entity can shut down or control the Bitcoin network due to its distributed nature",
        "Consensus rules are enforced by mathematics and network agreement, not human authority",
        "Decentralization provides censorship resistance and financial sovereignty to users globally"
      ]
    };
    return takeaways[lessonTitle] || [
      "This topic introduces fundamental concepts essential for understanding Bitcoin",
      "Real-world applications demonstrate practical value and utility",
      "Understanding this concept helps build comprehensive Bitcoin knowledge",
      "These principles contribute to Bitcoin's unique properties and advantages"
    ];
  };

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
          "2024: Reward dropped from 6.25 BTC to 3.125 BTC per block"
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
    return deepDives[factTitle];
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
      notification.className = 'fixed top-4 right-4 bg-green-800 text-green-100 px-4 py-2 rounded-lg text-sm z-50 transition-opacity';
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

  // Multi-stage Safety Simulation Data
  const safetySimulations = [
    {
      stage: "Phishing Detection",
      title: "🎣 Spot the Phishing Email",
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
      title: "🔐 Protect Your Seed Phrase",
      description: "You just generated a new Bitcoin wallet. Where should you store your 12-word recovery phrase?",
      scenario: "apple bacon chair dog eagle five grape happy ice jelly king lemon",
      options: [
        {
          method: "Screenshot on phone",
          security: "Very Dangerous",
          explanation: "Photos can be backed up to cloud, hacked, or seen by others. Never store seed phrases digitally.",
          safe: false
        },
        {
          method: "Write on paper, store in safe",
          security: "Very Safe", 
          explanation: "Physical storage offline is the gold standard. Keep multiple copies in secure locations.",
          safe: true
        },
        {
          method: "Save in password manager",
          security: "Risky",
          explanation: "Digital storage creates attack vectors. Password managers can be breached or corrupted.",
          safe: false
        },
        {
          method: "Memorize only",
          security: "Dangerous",
          explanation: "Memory fails. You could forget it or be unable to access it if something happens to you.",
          safe: false
        }
      ]
    },
    {
      stage: "Address Verification", 
      title: "🎯 Verify Bitcoin Address",
      description: "You're about to send 0.5 BTC. Check if this address matches what you copied:",
      copied: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      displayed: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      options: [
        { text: "Addresses match - Safe to send", correct: true },
        { text: "Close enough - Send anyway", correct: false },
        { text: "First 10 characters match - Good enough", correct: false },
        { text: "Let me double-check character by character", correct: true }
      ]
    },
    {
      stage: "Scam Recognition",
      title: "🚨 Spot the Bitcoin Scam", 
      description: "Which of these messages is definitely a scam?",
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
      ]
    }
  ];

  const currentSimulation = safetySimulations[safetyStage];

  const handleSafetyAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setShowResult(true);
    
    // Calculate score based on stage
    let correct = false;
    if (safetyStage === 0) { // Phishing
      correct = currentSimulation.emails[optionIndex].isPhishing;
    } else if (safetyStage === 1) { // Seed phrase  
      correct = currentSimulation.options[optionIndex].safe;
    } else if (safetyStage === 2) { // Address verification
      correct = currentSimulation.options[optionIndex].correct;
    } else if (safetyStage === 3) { // Scam recognition
      correct = currentSimulation.scenarios[optionIndex].isScam;
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
  const { data: dailyFacts } = useQuery({
    queryKey: ['/api/daily-facts', currentDayIndex],
    queryFn: () => fetch(`/api/daily-facts/${currentDayIndex}`).then(res => res.json()),
  });

  const { data: lesson } = useQuery({
    queryKey: ['/api/lesson', currentDayIndex], 
    queryFn: () => fetch(`/api/lesson/${currentDayIndex}`).then(res => res.json()),
  });

  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  });

  // Hide splash screen after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Splash Screen
  if (showSplash) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-6">
              <Coins className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -inset-4 bg-orange-400/20 rounded-full animate-ping"></div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white">BTC Journey</h1>
            <p className="text-zinc-400">Loading your conviction...</p>
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
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">HODLearn</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center py-4">
            <div className="flex space-x-1 bg-zinc-800/50 rounded-lg p-1">
              <Button
                variant={activeSection === "learn" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveSection("learn")}
                className="text-sm px-4 py-2"
              >
                Learn
              </Button>

              <Button
                variant={activeSection === "finance" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveSection("finance")}
                className="text-sm px-4 py-2"
              >
                Why BTC
              </Button>

              <Button
                variant={activeSection === "simulations" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveSection("simulations")}
                className="text-sm px-4 py-2"
              >
                Simulators
              </Button>
              <Button
                variant={activeSection === "more" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveSection("more")}
                className="text-sm px-4 py-2"
              >
                More
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {activeSection === "learn" && "Build Your Bitcoin Foundation"}
            {activeSection === "finance" && "Why Bitcoin Matters"}
            {activeSection === "simulations" && "Practice Bitcoin Concepts"}
            {activeSection === "more" && "Discover More About Bitcoin"}
          </h2>
          <p className="text-zinc-400">
            {activeSection === "learn" && "Learn the fundamentals and understand why Bitcoin matters"}
            {activeSection === "finance" && "Discover why Bitcoin is the future of money and finance"}
            {activeSection === "simulations" && "Interactive simulations to deepen your understanding"}
            {activeSection === "more" && "Resources and tools to support your Bitcoin journey"}
          </p>
        </div>

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

            {/* Day Navigation Controls for Testing Generated Content */}
            {learnSubTab === "today" && (
              <div className="flex justify-center">
                <div className="flex items-center gap-3 bg-zinc-800/30 rounded-lg p-3 border border-zinc-700">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTestDayOverride(prev => Math.max(1, (prev || currentDayIndex) - 1))}
                    className="text-xs px-2 py-1"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    Prev Day
                  </Button>
                  
                  <div className="text-center">
                    <div className="text-xs text-zinc-400">Testing Day</div>
                    <div className="text-sm font-medium text-white">{currentDayIndex}</div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTestDayOverride(prev => Math.min(30, (prev || currentDayIndex) + 1))}
                    className="text-xs px-2 py-1"
                  >
                    Next Day
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTestDayOverride(naturalDayIndex)}
                    className="text-xs px-2 py-1 text-orange-400 hover:text-orange-300"
                  >
                    Reset to Today
                  </Button>
                </div>
              </div>
            )}

            {/* Today's Learning */}
            {learnSubTab === "today" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">Today's Bitcoin Learning</h3>
                  <p className="text-zinc-400">Daily facts, lessons, and knowledge tests</p>
                </div>

                {/* Daily Facts */}
                {dailyFacts && Array.isArray(dailyFacts) && dailyFacts.length > 0 && (
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-white mb-4">Essential Bitcoin Facts</h3>
                      <div className="space-y-4">
                        {(dailyFacts as DailyFact[]).map((fact: DailyFact) => {
                          const IconComponent = iconMap[fact.icon as keyof typeof iconMap] || Coins;
                          const deepDive = fact.diveDeeper || getFactDeepDive(fact.title);
                          const isExpanded = expandedFacts.has(fact.id);
                          
                          return (
                            <div key={fact.id} className="bg-zinc-800/50 rounded-lg overflow-hidden">
                              <div className="flex items-start gap-4 p-4">
                                <div className="p-2 bg-orange-600/20 rounded-lg">
                                  <IconComponent className="w-5 h-5 text-orange-400" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-white">{fact.title}</h4>
                                    {deepDive && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleFactExpansion(fact.id)}
                                        className="text-orange-400 hover:text-orange-300 px-2"
                                      >
                                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        Dive Deeper
                                      </Button>
                                    )}
                                  </div>
                                  <p className="text-zinc-300 text-sm">{fact.content}</p>
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
                                          <li key={idx} className="text-zinc-300 text-sm flex items-start gap-2">
                                            <span className="text-orange-400 mt-1">•</span>
                                            <span>{example}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    
                                    <div>
                                      <h5 className="font-medium text-orange-300 mb-2">Key Takeaways</h5>
                                      <div className="grid gap-2">
                                        {deepDive.keyTakeaways.map((takeaway, idx) => (
                                          <div key={idx} className="flex items-start gap-2 p-2 bg-orange-600/10 rounded-lg border border-orange-600/20">
                                            <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                                            <span className="text-orange-100 text-sm">{takeaway}</span>
                                          </div>
                                        ))}
                                      </div>
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

                {/* Enhanced Daily Lesson */}
                {lesson && (
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {/* Lesson Header */}
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-white">{(lesson as Lesson).title}</h3>
                          <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                            <Clock className="w-3 h-3 mr-1" />
                            {(lesson as Lesson).estimatedReadTime || '8'} min read
                          </Badge>
                        </div>
                        
                        {/* Expanded Lesson Content */}
                        <div className="prose prose-invert max-w-none space-y-10">
                          {getExpandedLessonContent((lesson as Lesson).title, (lesson as Lesson).content).map((section, idx) => (
                            <div key={idx} className="space-y-6">
                              <h4 className="text-xl font-semibold text-white border-l-4 border-orange-500 pl-4 mb-6">
                                {section.title}
                              </h4>
                              
                              <div className="space-y-6 text-zinc-300 leading-relaxed text-base">
                                {section.paragraphs.map((paragraph, pIdx) => (
                                  <p key={pIdx} className="text-zinc-300 leading-[1.8] text-base mb-4">
                                    {cleanText(paragraph)}
                                  </p>
                                ))}
                              </div>
                              
                              {section.keyPoints && (
                                <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-6 my-6">
                                  <h5 className="text-blue-400 font-medium mb-4 text-base">Key Points:</h5>
                                  <ul className="space-y-3">
                                    {section.keyPoints.map((point, pointIdx) => (
                                      <li key={pointIdx} className="flex items-start gap-3 text-zinc-300 leading-[1.7]">
                                        <span className="text-blue-400 mt-1 text-lg">•</span>
                                        <span className="text-base">{cleanText(point)}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {section.realWorldExample && (
                                <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-6 my-6">
                                  <h5 className="text-green-400 font-medium mb-3 text-base">Real-World Application:</h5>
                                  <p className="text-zinc-300 text-base leading-[1.7]">{cleanText(section.realWorldExample)}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Essential Takeaways */}
                        <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700 mt-8">
                          <h4 className="text-white font-semibold mb-6 text-lg">Why This Matters</h4>
                          <div className="space-y-4">
                            {getLessonTakeaways((lesson as Lesson).title).map((takeaway, idx) => (
                              <div key={idx} className="flex items-start gap-4">
                                <CheckCircle className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                                <span className="text-zinc-300 text-base leading-[1.7]">{cleanText(takeaway)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Daily Quiz */}
                <div data-testid="daily-quiz">
                  <DailyQuiz dayIndex={currentDayIndex} />
                </div>
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
        {activeSection === "finance" && (
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
                    <div className="p-4 bg-green-950/50 rounded-xl border border-green-800/50">
                      <div className="text-green-300 font-bold text-xl">21 Million</div>
                      <div className="text-green-400/80 text-sm">Bitcoin's Maximum Supply</div>
                      <div className="text-zinc-400 text-xs mt-1">No central bank can print more</div>
                    </div>
                    
                    <div className="p-4 bg-blue-950/50 rounded-xl border border-blue-800/50">
                      <div className="text-blue-300 font-bold text-xl">0%</div>
                      <div className="text-blue-400/80 text-sm">Bitcoin Inflation Rate</div>
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
                      The choice is yours:
                    </div>
                    <div className="text-zinc-300">
                      Keep letting inflation slowly drain your wealth, or learn about the money that can't be manipulated. 
                      The calculators below show you exactly what you're losing—and what you could gain.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Money Supply Erosion Visualization */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-3 text-xl">
                  <TrendingDown className="w-5 h-5 text-red-400" />
                  Watch Your Money Lose Value in Real Time
                </CardTitle>
                <p className="text-zinc-400 text-sm">Interactive timeline showing how money printing destroys purchasing power since 1971</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Year Slider Control */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300 font-medium">Select Year:</span>
                    <span className="text-orange-400 font-bold text-lg">{moneySupplyYear}</span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="1920"
                      max="2024"
                      value={moneySupplyYear}
                      onChange={(e) => setMoneySupplyYear(parseInt(e.target.value))}
                      className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #f97316 0%, #f97316 ${((moneySupplyYear - 1920) / (2024 - 1920)) * 100}%, #374151 ${((moneySupplyYear - 1920) / (2024 - 1920)) * 100}%, #374151 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-zinc-500">
                      <span>1920 (Gold Standard)</span>
                      <span>2024 (Today)</span>
                    </div>
                  </div>

                  {/* Purchasing Power Display - Moved Here */}
                  <div className="bg-zinc-800/50 rounded-lg p-3 mt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-zinc-300 text-sm">$1 from 1920 = </span>
                      <span className="text-red-400 font-bold">
                        ${(1 / getPurchasingPowerRaw(moneySupplyYear)).toFixed(2)} today
                      </span>
                    </div>
                    <div className="w-full bg-zinc-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-red-400 to-red-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.round((1 - getPurchasingPowerRaw(moneySupplyYear)) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-zinc-400 mt-1">
                      {Math.round((1 - getPurchasingPowerRaw(moneySupplyYear)) * 100)}% of purchasing power lost since 1920
                    </div>
                  </div>
                </div>

                {/* Money Supply Growth Chart */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-red-400" />
                    M2 Money Supply: 104 Years of Monetary History (1920-2024)
                  </h4>
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <div className="relative h-64 w-full">
                      {/* SVG Chart */}
                      <svg viewBox="0 0 400 200" className="w-full h-full">
                        {/* Grid Lines */}
                        <defs>
                          <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
                          </pattern>
                        </defs>
                        <rect width="400" height="200" fill="url(#grid)" />
                        
                        {/* Y-axis labels */}
                        <text x="10" y="15" fill="#9ca3af" fontSize="10">$21T</text>
                        <text x="10" y="55" fill="#9ca3af" fontSize="10">$15T</text>
                        <text x="10" y="95" fill="#9ca3af" fontSize="10">$10T</text>
                        <text x="10" y="135" fill="#9ca3af" fontSize="10">$5T</text>
                        <text x="10" y="175" fill="#9ca3af" fontSize="10">$0</text>
                        
                        {/* X-axis labels - Evenly spaced per year for dramatic accuracy */}
                        <text x="50" y="195" fill="#9ca3af" fontSize="10">1920</text>
                        <text x="173" y="195" fill="#9ca3af" fontSize="10">1960</text>
                        <text x="295" y="195" fill="#9ca3af" fontSize="10">2000</text>
                        <text x="370" y="195" fill="#9ca3af" fontSize="10">2024</text>
                        
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
                              { year: 2024, m2: 21.000 }   // Current ($21T)
                            ];
                            
                            return m2Data.map((point, index) => {
                              // Linear time positioning: 3.077px per year (320px / 104 years)
                              const x = 50 + ((point.year - 1920) / 104) * 320;
                              const y = 175 - ((point.m2 - 0.023) / (21.0 - 0.023)) * 155;
                              return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                            }).join(' ');
                          })()}
                          fill="none"
                          stroke="#ef4444"
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
                          fill="url(#redGradient)"
                          opacity="0.3"
                        />
                        
                        {/* Gradient definition */}
                        <defs>
                          <linearGradient id="redGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6"/>
                            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1"/>
                          </linearGradient>
                        </defs>
                        
                        {/* Gold Standard Line - Behind other elements */}
                        <g>
                          {(() => {
                            const nixonYear = 1971;
                            const nixonX = 50 + ((nixonYear - 1920) / 104) * 320;
                            return (
                              <g>
                                <line 
                                  x1={nixonX} 
                                  y1="20" 
                                  x2={nixonX} 
                                  y2="175" 
                                  stroke="#fbbf24" 
                                  strokeWidth="2" 
                                  strokeDasharray="5,5"
                                  opacity="0.6"
                                />
                                <text 
                                  x={nixonX - 35} 
                                  y="15" 
                                  fill="#fbbf24" 
                                  fontSize="8" 
                                  fontWeight="bold"
                                >
                                  Gold Standard Ends
                                </text>
                              </g>
                            );
                          })()}
                        </g>

                        {/* Historical Event Markers */}
                        <g>
                          {(() => {
                            const events = [
                              { year: 1945, m2: 0.107, label: "WWII", sublabel: "Post-War", labelX: 80, labelY: 130 },
                              { year: 2008, m2: 7.500, label: "Financial Crisis", sublabel: "2008", labelX: 240, labelY: 90 },
                              { year: 2020, m2: 15.400, label: "COVID", sublabel: "Money Printing", labelX: 260, labelY: 30 }
                            ];
                            
                            return events.map((event, index) => {
                              // Linear time positioning: 3.077px per year (320px / 104 years)
                              const chartX = 50 + ((event.year - 1920) / 104) * 320;
                              
                              // Calculate Y position: chart height=155, spanning 0.023-21.0 trillions
                              const chartY = 175 - ((event.m2 - 0.023) / (21.0 - 0.023)) * 155;
                              
                              return (
                                <g key={index}>
                                  {/* Connection line from chart point to label */}
                                  <line 
                                    x1={chartX} 
                                    y1={chartY} 
                                    x2={event.labelX + 40} 
                                    y2={event.labelY + 12} 
                                    stroke="#64748b" 
                                    strokeWidth="1" 
                                    strokeDasharray="3,2"
                                    opacity="0.5"
                                  />
                                  
                                  {/* Chart point marker */}
                                  <circle cx={chartX} cy={chartY} r="3" fill="#dc2626" stroke="#ffffff" strokeWidth="1"/>
                                  
                                  {/* Compact label background */}
                                  <rect 
                                    x={event.labelX} 
                                    y={event.labelY} 
                                    width="80" 
                                    height="24" 
                                    fill="rgba(0,0,0,0.85)" 
                                    stroke="#64748b"
                                    strokeWidth="1"
                                    rx="3"
                                  />
                                  
                                  {/* Event title */}
                                  <text 
                                    x={event.labelX + 40} 
                                    y={event.labelY + 10} 
                                    fill="#ffffff" 
                                    fontSize="9" 
                                    fontWeight="600"
                                    textAnchor="middle"
                                  >
                                    {event.label}
                                  </text>
                                  
                                  {/* Subtitle */}
                                  <text 
                                    x={event.labelX + 40} 
                                    y={event.labelY + 20} 
                                    fill="#94a3b8" 
                                    fontSize="7" 
                                    fontWeight="normal"
                                    textAnchor="middle"
                                  >
                                    {event.sublabel}
                                  </text>
                                </g>
                              );
                            });
                          })()}
                          
                          {/* Current year indicator */}
                          <line 
                            x1={50 + ((moneySupplyYear - 1920) / 104) * 320} 
                            y1="10" 
                            x2={50 + ((moneySupplyYear - 1920) / 104) * 320} 
                            y2="180" 
                            stroke="#f97316" 
                            strokeWidth="2" 
                            strokeDasharray="4,4"
                          />
                          <circle 
                            cx={50 + ((moneySupplyYear - 1920) / (2024 - 1920)) * 320} 
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
                    
                    {/* Current Values Display */}
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-red-400 font-bold text-xl">${getMoneySupplyForYear(moneySupplyYear)}T</div>
                        <div className="text-zinc-400 text-sm">Money Supply in {moneySupplyYear}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-red-400 font-bold text-xl">{getMoneySupplyMultiplier(moneySupplyYear)}x</div>
                        <div className="text-zinc-400 text-sm">Growth Since 1971</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Realistic Fading Dollar Visualization */}
                <div className="space-y-2">
                  <h4 className="text-white font-semibold flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-orange-400" />
                    Watch Your Dollar Disappear: {moneySupplyYear}
                  </h4>
                  
                  <div className="bg-gradient-to-r from-red-950/30 to-orange-950/30 rounded-lg p-4 border border-red-800/30">
                    <div className="flex items-center gap-6">
                      {/* Realistic Dollar Bill */}
                      <div className="flex-shrink-0">
                        <svg 
                          width="120" 
                          height="50" 
                          viewBox="0 0 300 125" 
                          className="mx-auto"
                          style={{ 
                            opacity: getPurchasingPowerPercentage(moneySupplyYear) / 100,
                            filter: `saturate(${getPurchasingPowerPercentage(moneySupplyYear) / 100})`
                          }}
                        >
                          {/* Base Paper with Subtle Texture */}
                          <defs>
                            <pattern id="paperTexture" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                              <rect width="4" height="4" fill="#89BE6C"/>
                              <circle cx="2" cy="2" r="0.2" fill="#7BA862" opacity="0.3"/>
                            </pattern>
                            <radialGradient id="billGradient" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#8BC46F"/>
                              <stop offset="100%" stopColor="#6B9B4F"/>
                            </radialGradient>
                          </defs>
                          
                          {/* Dollar Bill Base with Gradient */}
                          <rect x="5" y="5" width="290" height="115" rx="8" fill="url(#billGradient)" stroke="#2F4A1A" strokeWidth="2"/>
                          <rect x="5" y="5" width="290" height="115" rx="8" fill="url(#paperTexture)" opacity="0.4"/>
                          
                          {/* Ornate Corner Decorations */}
                          <g fill="none" stroke="#1F3510" strokeWidth="1.5" opacity="0.8">
                            <path d="M15,15 Q25,15 25,25 Q25,15 35,15" strokeLinecap="round"/>
                            <path d="M265,15 Q275,15 275,25 Q275,15 285,15" strokeLinecap="round"/>
                            <path d="M15,105 Q25,105 25,95 Q25,105 35,105" strokeLinecap="round"/>
                            <path d="M265,105 Q275,105 275,95 Q275,105 285,105" strokeLinecap="round"/>
                          </g>
                          
                          {/* Washington Portrait Oval */}
                          <ellipse cx="75" cy="62.5" rx="28" ry="35" fill="#1F3510" opacity="0.2"/>
                          <ellipse cx="75" cy="62.5" rx="25" ry="32" fill="none" stroke="#1F3510" strokeWidth="2"/>
                          
                          {/* Portrait Details */}
                          <circle cx="75" cy="55" r="8" fill="#1F3510" opacity="0.3"/>
                          <rect x="67" y="65" width="16" height="12" rx="2" fill="#1F3510" opacity="0.2"/>
                          <text x="75" y="48" textAnchor="middle" fontSize="6" fill="#0F1F08" fontWeight="bold">G.W.</text>
                          <text x="75" y="85" textAnchor="middle" fontSize="5" fill="#0F1F08">1732-1799</text>
                          
                          {/* Federal Reserve Seal (Right) */}
                          <circle cx="225" cy="62.5" r="20" fill="none" stroke="#1F3510" strokeWidth="2"/>
                          <circle cx="225" cy="62.5" r="15" fill="#1F3510" opacity="0.1"/>
                          <text x="225" y="58" textAnchor="middle" fontSize="8" fill="#0F1F08" fontWeight="bold">FED</text>
                          <text x="225" y="68" textAnchor="middle" fontSize="6" fill="#0F1F08">RES</text>
                          
                          {/* Main Text - Top */}
                          <text x="150" y="25" textAnchor="middle" fontSize="8" fill="#0F1F08" fontWeight="bold" letterSpacing="1">
                            THE UNITED STATES OF AMERICA
                          </text>
                          
                          {/* Federal Reserve Note */}
                          <text x="150" y="35" textAnchor="middle" fontSize="5" fill="#0F1F08">
                            FEDERAL RESERVE NOTE
                          </text>
                          
                          {/* Large ONE DOLLAR */}
                          <text x="150" y="55" textAnchor="middle" fontSize="14" fill="#0F1F08" fontWeight="bold" letterSpacing="2">
                            ONE
                          </text>
                          <text x="150" y="70" textAnchor="middle" fontSize="14" fill="#0F1F08" fontWeight="bold" letterSpacing="2">
                            DOLLAR
                          </text>
                          
                          {/* Series and Signatures */}
                          <text x="150" y="85" textAnchor="middle" fontSize="4" fill="#0F1F08">
                            SERIES 1920
                          </text>
                          <text x="120" y="95" textAnchor="middle" fontSize="3" fill="#0F1F08">
                            SECRETARY OF THE TREASURY
                          </text>
                          <text x="180" y="95" textAnchor="middle" fontSize="3" fill="#0F1F08">
                            TREASURER OF THE UNITED STATES
                          </text>
                          
                          {/* Corner 1's with Ornate Design */}
                          <g fill="#0F1F08">
                            <text x="30" y="35" textAnchor="middle" fontSize="16" fontWeight="bold">1</text>
                            <text x="30" y="45" textAnchor="middle" fontSize="4">ONE</text>
                            <text x="270" y="85" textAnchor="middle" fontSize="16" fontWeight="bold">1</text>
                            <text x="270" y="95" textAnchor="middle" fontSize="4">ONE</text>
                          </g>
                          
                          {/* Serial Numbers */}
                          <text x="50" y="15" textAnchor="start" fontSize="4" fill="#0F1F08" fontFamily="monospace">
                            A12345678A
                          </text>
                          <text x="250" y="110" textAnchor="end" fontSize="4" fill="#0F1F08" fontFamily="monospace">
                            A12345678A
                          </text>
                          
                          {/* Micro-printing Security Features */}
                          <text x="150" y="105" textAnchor="middle" fontSize="2" fill="#0F1F08" opacity="0.6">
                            THE UNITED STATES OF AMERICA • ONE DOLLAR • THE UNITED STATES OF AMERICA
                          </text>
                          
                          {/* Decorative Flourishes */}
                          <g fill="none" stroke="#1F3510" strokeWidth="0.8" opacity="0.6">
                            <path d="M110,40 Q120,35 130,40 Q140,45 150,40" strokeLinecap="round"/>
                            <path d="M110,75 Q120,80 130,75 Q140,70 150,75" strokeLinecap="round"/>
                          </g>
                        </svg>
                        <div className="mt-1 text-zinc-300 text-xs text-center">Your 1920 Dollar</div>
                      </div>

                      {/* Current Value Data */}
                      <div className="flex-1">
                        <div className="text-orange-400 font-bold text-2xl">
                          ${(getPurchasingPowerPercentage(moneySupplyYear) / 100).toFixed(2)}
                        </div>
                        <div className="text-zinc-300 text-sm mt-1">
                          {getPurchasingPowerPercentage(moneySupplyYear).toFixed(1)}% purchasing power left
                        </div>
                        <div className="text-zinc-500 text-xs mt-2">
                          {moneySupplyYear === 1920 ? "Full purchasing power" : 
                           moneySupplyYear >= 2020 ? "Buys a few cents worth of goods" :
                           moneySupplyYear >= 1980 ? "Buys about a quarter's worth" :
                           "Still retains significant value"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bitcoin Contrast */}
                <div className="bg-gradient-to-r from-orange-950/30 to-yellow-950/30 rounded-xl p-6 border border-orange-800/30">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className="p-2 bg-orange-600/20 rounded-lg">
                        <Shield className="w-6 h-6 text-orange-400" />
                      </div>
                      <h4 className="text-white font-bold text-lg">Bitcoin: Fixed Forever at 21 Million</h4>
                    </div>
                    <p className="text-zinc-300 max-w-2xl mx-auto">
                      While governments have created {getMoneySupplyForYear(moneySupplyYear)} trillion dollars since 1971, 
                      Bitcoin's supply is mathematically limited to 21 million coins. No government, bank, or corporation 
                      can print more Bitcoin. <span className="text-orange-400 font-semibold">This is why Bitcoin protects your purchasing power.</span>
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-red-300">US Dollar: ∞ Supply</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-orange-300">Bitcoin: 21M Fixed</span>
                      </div>
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
                  Your Money Is Disappearing
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
                      Watch Your Money Disappear
                    </Button>
                  </div>
                )}

                {/* Always show simulation results once started */}
                {(inflationSimActive || inflationProgress > 0) && (
                  <div className="space-y-4">
                    {inflationSimActive && (
                      <div className="text-center">
                        <p className="text-zinc-400 text-sm">
                          Watching your money's buying power shrink...
                        </p>
                      </div>
                    )}
                    
                    {/* Compact Year Timeline */}
                    <div className="grid gap-1 md:grid-cols-2 lg:grid-cols-3">
                      {[
                        { step: 0, year: "Today", value: 25000, purchasingPower: 100, loss: "$0" },
                        { step: 1, year: "Year 1", value: 24250, purchasingPower: 97, loss: "$750" },
                        { step: 2, year: "Year 5", value: 21562, purchasingPower: 86, loss: "$3,438" },
                        { step: 3, year: "Year 10", value: 18584, purchasingPower: 74, loss: "$6,416" },
                        { step: 4, year: "Year 15", value: 16023, purchasingPower: 64, loss: "$8,977" },
                        { step: 5, year: "Year 20", value: 13807, purchasingPower: 55, loss: "$11,193" },
                        { step: 6, year: "Year 25", value: 11903, purchasingPower: 48, loss: "$13,097" }
                      ].map(({ step, year, value, purchasingPower, loss }) => {
                        const isActive = inflationProgress >= step;
                        const isCurrentStep = inflationProgress === step && inflationSimActive;
                        
                        return (
                          <div key={step} className={`relative px-2 py-1 rounded border transition-all duration-500 overflow-hidden ${
                            isActive 
                              ? step === 0 ? 'bg-green-800/30 border-green-600/50' : 'bg-red-800/30 border-red-600/50'
                              : 'bg-zinc-800 border-zinc-700'
                          }`}>
                            {/* Visual decay bar overlay */}
                            <div 
                              className={`absolute inset-0 transition-all duration-1000 ${
                                isActive 
                                  ? step === 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                                  : 'bg-transparent'
                              }`}
                              style={{ 
                                width: isActive ? `${purchasingPower}%` : '0%',
                                transformOrigin: 'left'
                              }}
                            ></div>
                            
                            <div className="relative text-center space-y-0.5">
                              <div className={`font-bold text-xs transition-colors duration-500 ${
                                isActive 
                                  ? step === 0 ? 'text-green-400' : 'text-red-400' 
                                  : 'text-zinc-400'
                              }`}>
                                {year}
                              </div>
                              <div className={`text-sm font-bold transition-colors duration-500 ${
                                isActive 
                                  ? step === 0 ? 'text-green-300' : 'text-red-300'
                                  : 'text-zinc-500'
                              }`}>
                                ${value.toLocaleString()}
                              </div>
                              <div className={`text-xs transition-colors duration-500 ${
                                isActive 
                                  ? step === 0 ? 'text-green-400' : 'text-red-400'
                                  : 'text-zinc-500'
                              }`}>
                                {purchasingPower}% power
                              </div>
                              {step > 0 && (
                                <div className={`text-xs transition-colors duration-500 ${
                                  isActive ? 'text-red-300' : 'text-zinc-600'
                                }`}>
                                  Lost {loss}
                                </div>
                              )}
                            </div>
                            
                            {isCurrentStep && (
                              <div className="relative mt-2 flex items-center justify-center gap-2 text-red-400 text-xs">
                                <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
                                Losing value...
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Simple Results Summary */}
                    {inflationProgress >= 6 && (
                      <div className="p-4 bg-gradient-to-r from-red-950/40 to-orange-950/40 rounded-xl border border-red-800/50">
                        <div className="text-center space-y-3">
                          <div className="text-red-300 font-bold text-lg">The Result After 25 Years:</div>
                          
                          <div className="text-zinc-300 text-lg leading-relaxed">
                            Your <span className="text-orange-400 font-bold">$25,000</span> now buys what 
                            <span className="text-red-400 font-bold"> $11,903</span> used to buy.
                            <br />
                            <span className="text-red-400 font-bold">You lost over half your wealth</span> to inflation.
                          </div>
                          
                          <div className="text-orange-400 font-medium mt-3">
                            Bitcoin has a fixed supply of 21 million - no inflation possible.
                          </div>

                          {!inflationSimActive && (
                            <Button 
                              onClick={startInflationSimulation}
                              className="mt-4 bg-orange-600 hover:bg-orange-700"
                            >
                              Watch Again
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Banking Story Transition */}
            <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800/50">
              <h3 className="text-xl font-bold mb-4 text-orange-400">The Banking Racket: Death by a Thousand Cuts</h3>
              <div className="space-y-4 text-zinc-300 leading-relaxed">
                <p>
                  While inflation slowly erodes your wealth, banks extract value through direct fees. Every international transfer, 
                  currency exchange, and wire payment becomes a profit center for financial institutions. They've built an entire 
                  business model around being the middleman in your financial life.
                </p>
                <p>
                  A typical international wire transfer costs $25-50 in fees, plus hidden currency exchange markups of 3-5%. 
                  Sending $1,000 to family abroad? You'll pay $50+ in fees and lose another $30-50 to poor exchange rates. 
                  That's nearly 10% of your money disappearing into bank profits.
                </p>
                <p>
                  Bitcoin eliminates the middleman entirely. Your transaction goes directly to the recipient, anywhere in the world, 
                  for a few dollars in network fees. No wire transfer departments, no currency exchange desks, no "business day" delays.
                </p>
                <p className="text-orange-300 font-medium">
                  Calculate exactly how much banks are stealing from you every year:
                </p>
              </div>
            </div>



            {/* Problem/Solution Comparison Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: "💸",
                  problem: "Inflation Destroys Savings",
                  solution: "Fixed 21M Supply",
                  desc: "Math-enforced scarcity",
                  color: "red"
                },
                {
                  icon: "🏦",
                  problem: "Banks Control Money",
                  solution: "You Control Keys",
                  desc: "True ownership",
                  color: "blue"
                },
                {
                  icon: "🚫",
                  problem: "2B People Excluded",
                  solution: "Internet = Access",
                  desc: "Global participation",
                  color: "purple"
                },
                {
                  icon: "⏰",
                  problem: "3-5 Day Settlements",
                  solution: "10-60 Minute Finality",
                  desc: "24/7 settlement",
                  color: "yellow"
                }
              ].map((item, index) => (
                <Card key={index} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:transform hover:scale-105">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="text-3xl">{item.icon}</div>
                      <div className="space-y-2">
                        <div className="text-red-300 font-semibold text-sm">{item.problem}</div>
                        <div className="w-full h-px bg-zinc-700"></div>
                        <div className="text-green-300 font-semibold text-sm">{item.solution}</div>
                        <div className="text-zinc-400 text-xs">{item.desc}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Speed Story Transition */}
            <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800/50">
              <h3 className="text-xl font-bold mb-4 text-orange-400">The Time Tax: When "Business Days" Cost You Money</h3>
              <div className="space-y-4 text-zinc-300 leading-relaxed">
                <p>
                  Your money sits frozen in banking limbo for days, sometimes weeks. A simple transfer from one account to another 
                  requires multiple intermediary banks, clearing houses, and "business day" delays. Each institution adds time, 
                  fees, and risk to your transaction.
                </p>
                <p>
                  Meanwhile, that money generates interest for banks while earning nothing for you. A $10,000 wire transfer 
                  sitting in banking purgatory for 5 days represents $14 in lost opportunity cost at current rates. 
                  Multiply this across millions of transactions, and you see the scale of value extraction.
                </p>
                <p>
                  Bitcoin operates 24/7/365. No lunch breaks, no holidays, no "business hours." Your transaction settles based 
                  on mathematics, not banker availability. What takes banks 3-5 days happens in minutes on the Bitcoin network.
                </p>
                <p className="text-orange-300 font-medium">
                  Watch how Bitcoin makes traditional banking look like dial-up internet:
                </p>
              </div>
            </div>

            {/* Settlement Workflow Visualization */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-3 text-xl">
                  <Clock className="w-5 h-5 text-orange-400" />
                  Settlement Journey: Traditional vs Bitcoin
                </CardTitle>
                <p className="text-zinc-400 text-sm">Watch $50,000 travel from New York to London - see the complexity difference</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {!speedRaceActive && (
                  <div className="text-center space-y-4">
                    <div className="p-6 bg-zinc-800 rounded-lg border border-zinc-700">
                      <h3 className="text-lg font-medium text-white mb-3">Settlement Scenario</h3>
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
                      Start Live Settlement Race (30s)
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
                                📍 Visit Bank Branch
                              </span>
                            </div>
                            <div className={`text-xs transition-colors duration-500 ${
                              settlementProgress.traditional >= 1 ? 'text-red-300' : 'text-zinc-500'
                            }`}>
                              Fill out forms • Show ID • Get approval
                            </div>
                            {settlementProgress.traditional === 1 && animationActive && (
                              <div className="mt-2 flex items-center gap-2 text-red-400 text-xs">
                                <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
                                Processing...
                              </div>
                            )}
                          </div>

                          {/* Bitcoin Step 1 */}
                          <div className={`p-3 rounded-lg border transition-all duration-500 ${
                            settlementProgress.bitcoin >= 1 
                              ? 'bg-green-800/30 border-green-600/50' 
                              : 'bg-zinc-800 border-zinc-700'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-500 ${
                                settlementProgress.bitcoin >= 1 ? 'bg-green-500' : 'bg-zinc-600'
                              }`}>
                                {settlementProgress.bitcoin >= 1 ? '✓' : '1'}
                              </div>
                              <span className={`font-medium text-sm transition-colors duration-500 ${
                                settlementProgress.bitcoin >= 1 ? 'text-green-200' : 'text-zinc-400'
                              }`}>
                                📱 Create & Sign Transfer
                              </span>
                            </div>
                            <div className={`text-xs transition-colors duration-500 ${
                              settlementProgress.bitcoin >= 1 ? 'text-green-300' : 'text-zinc-500'
                            }`}>
                              Open app • Enter address • Approve with password
                            </div>
                            {settlementProgress.bitcoin === 1 && animationActive && (
                              <div className="mt-2 flex items-center gap-2 text-green-400 text-xs">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                Processing...
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
                                🏢 Security Checks
                              </span>
                            </div>
                            <div className={`text-xs transition-colors duration-500 ${
                              settlementProgress.traditional >= 2 ? 'text-red-300' : 'text-zinc-500'
                            }`}>
                              Background checks • Paperwork • Risk review
                            </div>
                            {settlementProgress.traditional === 2 && animationActive && (
                              <div className="mt-2 flex items-center gap-2 text-red-400 text-xs">
                                <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
                                Still processing...
                              </div>
                            )}
                          </div>

                          {/* Bitcoin Step 2 */}
                          <div className={`p-3 rounded-lg border transition-all duration-500 ${
                            settlementProgress.bitcoin >= 2 
                              ? 'bg-green-800/30 border-green-600/50' 
                              : 'bg-zinc-800 border-zinc-700'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-500 ${
                                settlementProgress.bitcoin >= 2 ? 'bg-green-500' : 'bg-zinc-600'
                              }`}>
                                {settlementProgress.bitcoin >= 2 ? '✓' : '2'}
                              </div>
                              <span className={`font-medium text-sm transition-colors duration-500 ${
                                settlementProgress.bitcoin >= 2 ? 'text-green-200' : 'text-zinc-400'
                              }`}>
                                🌐 Send to Bitcoin Network
                              </span>
                            </div>
                            <div className={`text-xs transition-colors duration-500 ${
                              settlementProgress.bitcoin >= 2 ? 'text-green-300' : 'text-zinc-500'
                            }`}>
                              Instantly shared with computers worldwide
                            </div>
                            {settlementProgress.bitcoin === 2 && animationActive && (
                              <div className="mt-2 flex items-center gap-2 text-green-400 text-xs">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                Broadcasting...
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
                                🌐 Send Through Partner Banks
                              </span>
                            </div>
                            <div className={`text-xs transition-colors duration-500 ${
                              settlementProgress.traditional >= 3 ? 'text-red-300' : 'text-zinc-500'
                            }`}>
                              Route through multiple banks • More checks
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
                                ⚡ Network Confirms Transfer
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
                                ✅ Transfer Complete
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
                                🏦 Final Bank Approval
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
                          <span className="text-orange-400 font-medium">This is why Bitcoin is the future of money.</span>
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
            {/* Practice Sub-navigation */}
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
                  variant={simulationsSubTab === "transactions" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSimulationsSubTab("transactions")}
                  className="text-xs px-3 py-1"
                >
                  <CreditCard className="w-3 h-3 mr-1" />
                  Transactions
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
              </div>
            </div>

            {/* Safety Training */}
            {simulationsSubTab === "safety" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">Bitcoin Security Best Practices</h3>
                  <p className="text-zinc-400">Learn essential security measures to protect your Bitcoin</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-600/20 rounded-lg">
                            <Shield className="w-6 h-6 text-green-400" />
                          </div>
                          <h4 className="text-lg font-bold text-white">Wallet Security Rules</h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-white text-sm font-medium">Never share your private keys</p>
                              <p className="text-zinc-400 text-xs">Anyone with your private key can steal your Bitcoin</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-white text-sm font-medium">Use hardware wallets for large amounts</p>
                              <p className="text-zinc-400 text-xs">Hardware wallets keep keys offline and secure</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-white text-sm font-medium">Write down your seed phrase</p>
                              <p className="text-zinc-400 text-xs">Store backup in a safe, physical location</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-600/20 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-red-400" />
                          </div>
                          <h4 className="text-lg font-bold text-white">Common Scams to Avoid</h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-white text-sm font-medium">Fake websites and apps</p>
                              <p className="text-zinc-400 text-xs">Always verify URLs and download from official sources</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-white text-sm font-medium">Phishing emails</p>
                              <p className="text-zinc-400 text-xs">Never click links asking for private keys or passwords</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-white text-sm font-medium">Too-good-to-be-true offers</p>
                              <p className="text-zinc-400 text-xs">No legitimate service promises guaranteed returns</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Interactive Wallet Explorer */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-bold text-white mb-4">Interactive Wallet Explorer</h4>
                    <p className="text-zinc-400 text-sm mb-6">Click on any wallet type to learn detailed information</p>
                    
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
                                  <h6 className="font-medium text-green-300">Advantages</h6>
                                  <ul className="space-y-1">
                                    {selectedWallet.pros.map((pro, idx) => (
                                      <li key={idx} className="text-zinc-300 text-sm flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
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

                {/* Interactive Safety Quiz */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-bold text-white mb-4">Test Your Security Knowledge</h4>
                    <div className="space-y-6">
                      {safetyQuestions.map((q, index) => (
                        <div key={index} className="space-y-3">
                          <h5 className="font-medium text-white">{index + 1}. {q.question}</h5>
                          <div className="grid gap-2">
                            {q.options.map((option, optIndex) => (
                              <Button
                                key={optIndex}
                                variant={safetyQuizScore > index && optIndex === q.correct ? "default" : "outline"}
                                className={`justify-start text-left ${
                                  safetyQuizScore > index 
                                    ? optIndex === q.correct 
                                      ? "bg-green-600 border-green-500 text-white" 
                                      : "border-zinc-700 text-zinc-400"
                                    : "border-zinc-700 text-zinc-300 hover:border-orange-500"
                                }`}
                                onClick={() => {
                                  if (safetyQuizScore === index && optIndex === q.correct) {
                                    setSafetyQuizScore(index + 1);
                                  }
                                }}
                                disabled={safetyQuizScore > index}
                              >
                                {String.fromCharCode(65 + optIndex)}. {option}
                              </Button>
                            ))}
                          </div>
                          {safetyQuizScore > index && (
                            <div className="p-3 bg-green-600/10 border border-green-600/20 rounded-lg">
                              <p className="text-green-300 text-sm font-medium">Correct!</p>
                              <p className="text-green-100 text-sm">{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      ))}
                      {safetyQuizScore === safetyQuestions.length && (
                        <div className="p-4 bg-green-600/20 border border-green-500 rounded-lg text-center">
                          <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                          <h5 className="font-bold text-green-300 mb-1">Perfect Score! 🎉</h5>
                          <p className="text-green-100 text-sm">You've mastered Bitcoin security basics. Your funds will be safe!</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Transaction Simulator */}
            {simulationsSubTab === "transactions" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">Interactive Bitcoin Transaction Builder</h3>
                  <p className="text-zinc-400">Build and customize a Bitcoin transaction step-by-step</p>
                </div>

                {/* Interactive Transaction Builder */}
                <Card className="bg-zinc-900 border-zinc-800">
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

            {/* Compact HODL Challenge Simulator */}
            {simulationsSubTab === "hodl" && (
              <div className="space-y-6">
                {/* HODL Calculator Section */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-white mb-2">HODL Calculator</h3>
                      <p className="text-zinc-400">See how much your Bitcoin investment would be worth today</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Input Section */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white font-medium mb-2">Investment Amount</label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 pointer-events-none text-lg">$</div>
                            <input
                              type="text"
                              value={hodlInputs.initialAmount.toLocaleString()}
                              onChange={(e) => {
                                const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                const amount = parseInt(numericValue) || 0;
                                setHodlInputs(prev => ({...prev, initialAmount: amount}));
                              }}
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-8 pr-4 py-3 text-white font-mono text-lg"
                              placeholder="Enter amount"
                            />
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
                              <div className="h-32 relative">
                                <svg width="100%" height="100%" className="overflow-visible">
                                  {/* Chart Background Grid */}
                                  <defs>
                                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
                                    </pattern>
                                  </defs>
                                  <rect width="100%" height="100%" fill="url(#grid)" />
                                  
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
                                      
                                      const yPosition = 115 - ((logValue - logStartValue) / (logMaxValue - logStartValue)) * 105;
                                      
                                      points.push({
                                        x: (progress * 280) + 10,
                                        y: Math.max(10, Math.min(115, yPosition)), // Keep within bounds
                                        value
                                      });
                                    }
                                    
                                    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                                    
                                    // Show consistent milestone markers for all scenarios
                                    const keyMilestones = [
                                      { label: '10x', multiplier: 10 },
                                      { label: '50x', multiplier: 50 },
                                      { label: '100x', multiplier: 100 }
                                    ];
                                    
                                    return (
                                      <>
                                        {/* Background grid for reference */}
                                        <defs>
                                          <pattern id="compoundGrid" width="35" height="25" patternUnits="userSpaceOnUse">
                                            <path d="M 35 0 L 0 0 0 25" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.2"/>
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
                                          const y = 115 - ((logMilestone - logStartValue) / (logMaxValue - logStartValue)) * 105;
                                          
                                          return (
                                            <g key={milestone.label}>
                                              <line x1="10" y1={y} x2="290" y2={y} stroke="#fbbf24" strokeWidth="1" opacity="0.3" strokeDasharray="2,2"/>
                                              <text x="295" y={y + 3} fill="#fbbf24" fontSize="8" opacity="0.7">{milestone.label}</text>
                                            </g>
                                          );
                                        })}
                                        
                                        {/* Area fill for dramatic effect */}
                                        <path
                                          d={`${pathData} L ${points[points.length - 1].x} 115 L 10 115 Z`}
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
                                        <circle cx={points[0].x} cy={points[0].y} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="2" opacity="0.9" />
                                        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="5" fill="#f97316" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />
                                        
                                        {/* Time progression labels */}
                                        <text x="10" y="135" fill="#9ca3af" fontSize="9" fontWeight="500" textAnchor="start">
                                          {hodlInputs.period}
                                        </text>
                                        <text x="150" y="135" fill="#9ca3af" fontSize="8" textAnchor="middle">
                                          {years > 3 ? `${Math.floor(years/2)} years` : ''}
                                        </text>
                                        <text x="290" y="135" fill="#9ca3af" fontSize="9" fontWeight="500" textAnchor="end">
                                          Jan 2025
                                        </text>
                                        
                                        {/* Growth percentage indicator */}
                                        <text x="150" y="20" fill="#f97316" fontSize="12" fontWeight="bold" textAnchor="middle">
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
                <Card className="bg-gradient-to-r from-orange-900/20 to-yellow-900/20 border-orange-800/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Why HODLing Beats Market Timing</h3>
                    </div>
                    
                    <div className="prose prose-invert max-w-none">
                      <p className="text-zinc-300 mb-4">
                        Bitcoin's price can swing wildly day-to-day, making it tempting to try "buying low and selling high." 
                        However, research consistently shows that <strong className="text-orange-400">time in the market beats timing the market</strong>.
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-4">
                        <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-4">
                          <h4 className="text-red-400 font-semibold mb-2">❌ Market Timing Problems</h4>
                          <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• Missing the best days hurts returns dramatically</li>
                            <li>• Emotional decisions during volatility</li>
                            <li>• Trading fees eat into profits</li>
                            <li>• Tax implications on short-term gains</li>
                            <li>• Stress and time consumption</li>
                          </ul>
                        </div>
                        
                        <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-4">
                          <h4 className="text-green-400 font-semibold mb-2">✅ HODLing Benefits</h4>
                          <ul className="text-zinc-300 text-sm space-y-1">
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
            {simulationsSubTab === "dca" && (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold text-white">DCA Calculator</h3>
                  <p className="text-zinc-400 text-sm">Configure your strategy and see real Bitcoin performance</p>
                </div>

                {/* Compact Input Controls */}
                <Card className="bg-zinc-900 border-zinc-800">
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

                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-zinc-400 text-xs flex items-center">
                        <Info className="w-3 h-3 mr-1" />
                        Continuous DCA to January 2025
                      </p>
                      <Button 
                        onClick={calculateDcaStrategy}
                        className="bg-orange-600 hover:bg-orange-700 text-sm px-4 py-2"
                      >
                        <Calculator className="w-3 h-3 mr-1" />
                        Calculate
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Results Display */}
                {dcaResults && (
                  <>
                    {/* Compact Results */}
                    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                      <Card className="bg-blue-900/20 border-blue-800">
                        <CardContent className="p-3 text-center">
                          <DollarSign className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                          <h5 className="font-medium text-white mb-1 text-xs">Invested</h5>
                          <p className="text-blue-400 font-bold">${Math.round(dcaResults.totalInvested).toLocaleString()}</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-orange-900/20 border-orange-800">
                        <CardContent className="p-3 text-center">
                          <Coins className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                          <h5 className="font-medium text-white mb-1 text-xs">Bitcoin</h5>
                          <p className="text-orange-400 font-bold">{dcaResults.totalBitcoin.toLocaleString('en-US', {maximumFractionDigits: 4, minimumFractionDigits: 4})} BTC</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-green-900/20 border-green-800">
                        <CardContent className="p-3 text-center">
                          <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
                          <h5 className="font-medium text-white mb-1 text-xs">Value</h5>
                          <p className="text-green-400 font-bold">${Math.round(dcaResults.currentValue).toLocaleString()}</p>
                        </CardContent>
                      </Card>
                      
                      <Card className={`border ${dcaResults.totalGain >= 0 ? 'bg-green-900/20 border-green-800' : 'bg-red-900/20 border-red-800'}`}>
                        <CardContent className="p-3 text-center">
                          {dcaResults.totalGain >= 0 ? 
                            <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" /> :
                            <TrendingDown className="w-5 h-5 text-red-400 mx-auto mb-1" />
                          }
                          <h5 className="font-medium text-white mb-1 text-xs">Return</h5>
                          <p className={`font-bold ${dcaResults.totalGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {dcaResults.percentageReturn >= 0 ? '+' : ''}{Math.round(dcaResults.percentageReturn)}%
                          </p>
                        </CardContent>
                      </Card>
                    </div>

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
                          <div className="p-4 bg-green-600/10 border border-green-600/20 rounded-lg">
                            <h5 className="font-medium text-green-300 mb-3 flex items-center gap-2">
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
                          <div className="p-4 bg-orange-600/10 border border-orange-600/20 rounded-lg">
                            <h5 className="font-medium text-orange-300 mb-3 flex items-center gap-2">
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
                    <Card className="bg-blue-900/20 border-blue-800">
                      <CardContent className="p-6">
                        <h4 className="text-lg font-bold text-blue-300 mb-4">📚 DCA Education</h4>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <h5 className="font-medium text-blue-200 mb-2">Why DCA Works</h5>
                            <ul className="space-y-1 text-zinc-300 text-sm">
                              <li>• <strong>Volatility smoothing:</strong> Reduces impact of price swings</li>
                              <li>• <strong>Lower average cost:</strong> Buys more when prices are low</li>
                              <li>• <strong>Emotion-free:</strong> Removes timing and FOMO decisions</li>
                              <li>• <strong>Accessibility:</strong> Start with any amount you can afford</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-blue-200 mb-2">Key Insights</h5>
                            <ul className="space-y-1 text-zinc-300 text-sm">
                              <li>• Time in market beats timing the market</li>
                              <li>• Consistency builds wealth over time</li>
                              <li>• Market dips become buying opportunities</li>
                              <li>• Reduces risk of buying at the peak</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-blue-800/30 rounded-lg">
                          <p className="text-blue-200 text-sm">
                            <GraduationCap className="w-4 h-4 inline mr-1" />
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
            {simulationsSubTab === "inflation" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">💸 Interactive Inflation Destroyer</h3>
                  <p className="text-zinc-400">Watch your money vanish in real-time as you move through the years</p>
                </div>

                {/* Streamlined Control Center */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="space-y-8">
                      {/* All Controls in One Row */}
                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Money Amount Slider */}
                        <div className="space-y-3">
                          <label className="block text-white font-bold text-center">
                            Your Money: ${parseFloat(inflationAmount).toLocaleString() || '10,000'}
                          </label>
                          <input
                            type="range"
                            min="1000"
                            max="100000"
                            step="1000"
                            value={inflationAmount}
                            onChange={(e) => setInflationAmount(e.target.value)}
                            className="w-full h-4 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, #22c55e 0%, #f97316 50%, #ef4444 100%)`
                            }}
                          />
                          <div className="flex justify-between text-xs text-zinc-400">
                            <span>$1K</span>
                            <span>$50K</span>
                            <span>$100K</span>
                          </div>
                        </div>

                        {/* Inflation Rate Slider */}
                        <div className="space-y-3">
                          <label className="block text-white font-bold text-center">
                            Annual Inflation: {inflationRate}%
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="20"
                            step="0.5"
                            value={inflationRate}
                            onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                            className="w-full h-4 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, #22c55e 0%, #f97316 ${(inflationRate / 20) * 100}%, #ef4444 100%)`
                            }}
                          />
                          <div className="flex justify-between text-xs text-zinc-400">
                            <span>1% Low</span>
                            <span>10% High</span>
                            <span>20% Crisis</span>
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
                                #22c55e 0%, 
                                #f97316 ${(inflationSliderYear / 30) * 50}%, 
                                #ef4444 ${(inflationSliderYear / 30) * 100}%, 
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
                      Real History: How $10,000 Lost 87% of Its Power (1970-2024)
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
                          <text x="360" y="155" fill="#9ca3af" fontSize="9">2024</text>
                          
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



          </div>
        )}
      </main>
    </div>
  );
}
