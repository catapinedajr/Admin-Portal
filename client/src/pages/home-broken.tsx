import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
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
  X
} from "lucide-react";
import type { User, DailyFact, Lesson, UserProgress, ConvictionContent } from "@shared/schema";
import DailyQuiz from "@/components/DailyQuiz";
import { BitcoinTerm, AutoGlossary } from "@/components/BitcoinGlossary";
import { ProgressIndicator, AchievementBadge, LearningAnalytics } from "@/components/ProgressIndicator";
import AchievementSystem from "@/components/AchievementSystem";

function Home() {
  // Original simulator state management
  const [simulatorInputs, setSimulatorInputs] = useState({
    dca: {
      monthlyAmount: 100,
      duration: 24,
      startPrice: 30000
    },
    hodl: {
      initialAmount: 1000,
      years: 4,
      tradingFeePercent: 2
    },
    investment: 1000,
    years: 4,
    tradingFeePercent: 2
  });

  const [hodlResults, setHodlResults] = useState<any>(null);

  // Calculate DCA with realistic data
  const calculateDCA = (monthlyAmount: number, duration: number, startPrice: number) => {
    let totalInvested = 0;
    let totalBtc = 0;
    const purchases = [];
    
    for (let month = 0; month < duration; month++) {
      // Simulate price volatility (simplified)
      const priceVariation = Math.sin(month * 0.5) * 0.2 + (Math.random() - 0.5) * 0.4;
      const currentPrice = startPrice * (1 + priceVariation);
      const btcPurchased = monthlyAmount / currentPrice;
      
      totalInvested += monthlyAmount;
      totalBtc += btcPurchased;
      
      purchases.push({
        month: month + 1,
        price: currentPrice.toFixed(0),
        btcPurchased: btcPurchased.toFixed(6),
        totalBtc: totalBtc.toFixed(6)
      });
    }
    
    const finalPrice = startPrice * 1.8; // Assume 80% growth over period
    const finalValue = totalBtc * finalPrice;
    const totalReturn = finalValue - totalInvested;
    const returnPercentage = (totalReturn / totalInvested) * 100;
    
    return {
      totalInvested: totalInvested.toFixed(2),
      totalBtc: totalBtc.toFixed(6),
      finalValue: finalValue.toFixed(2),
      totalReturn: totalReturn.toFixed(2),
      returnPercentage: returnPercentage.toFixed(1),
      averagePrice: (totalInvested / totalBtc).toFixed(0),
      purchases: purchases.slice(-6) // Show last 6 months
    };
  };

  // Calculate HODL vs Trading comparison
  const calculateHODL = (investment: number, years: number, tradingFeePercent: number) => {
    const startPrice = 30000;
    const initialBtc = investment / startPrice;
    const btcGrowthRate = 0.55; // 55% average annual growth
    
    const finalPrice = startPrice * Math.pow(1 + btcGrowthRate, years);
    const finalValue = initialBtc * finalPrice;
    const totalReturn = finalValue - investment;
    const returnPercentage = (totalReturn / investment) * 100;
    
    // Compare with traditional savings (2% annual)
    const savingsValue = investment * Math.pow(1.02, years);
    const savingsReturn = savingsValue - investment;
    
    return {
      strategy: 'HODLing (Long-term Savings)',
      initialBtc: initialBtc.toFixed(6),
      finalValue: finalValue.toFixed(2),
      totalReturn: totalReturn.toFixed(2),
      returnPercentage: returnPercentage.toFixed(1),
      savingsComparison: {
        traditionalSavings: savingsValue.toFixed(2),
        traditionalReturn: savingsReturn.toFixed(2),
        btcAdvantage: (finalValue - savingsValue).toFixed(2)
      },
      volatilityImpact: 'medium',
      timeHorizon: years
    };
  };

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



type MainSection = "learn" | "simulations" | "more";
type LearnSubTab = "today" | "reference" | "appendix";
type SimulationsSubTab = "safety" | "transactions" | "hodl" | "dca";
type MoreSubTab = "store";

function Home() {
  const [activeSection, setActiveSection] = useState<MainSection>("learn");
  const [learnSubTab, setLearnSubTab] = useState<LearnSubTab>("today");
  const [simulationsSubTab, setSimulationsSubTab] = useState<SimulationsSubTab>("safety");
  const [moreSubTab, setMoreSubTab] = useState<MoreSubTab>("store");

  const [convictionSubTab, setConvictionSubTab] = useState<"whitepaper" | "books" | "videos">("whitepaper");
  const [showSplash, setShowSplash] = useState(true);
  const [expandedFacts, setExpandedFacts] = useState<Set<number>>(new Set());
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [safetyQuizScore, setSafetyQuizScore] = useState<number>(0);
  const [transactionInputs, setTransactionInputs] = useState({
    fromAddress: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    toAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    amount: "0.001",
    feeRate: "standard"
  });
  const [transactionState, setTransactionState] = useState<"building" | "preview" | "signing" | "broadcasting" | "confirming" | "confirmed">("building");
  const [showTransactionApproval, setShowTransactionApproval] = useState(false);
  const [confirmationCount, setConfirmationCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(45);
  const [transactionJourney, setTransactionJourney] = useState<"broadcast" | "mempool" | "confirming" | "settled">("broadcast");
  const [transactionId, setTransactionId] = useState("");

  // Appendix state
  const [selectedAppendixLesson, setSelectedAppendixLesson] = useState<any>(null);

  // Fee options with realistic data
  const feeOptions = {
    slow: { rate: "1-3", cost: "0.00001", time: "60+ min", priority: "Low Priority", satsPerByte: 2 },
    standard: { rate: "4-8", cost: "0.00004", time: "10-30 min", priority: "Standard", satsPerByte: 6 },
    fast: { rate: "9-15", cost: "0.00008", time: "1-10 min", priority: "High Priority", satsPerByte: 12 }
  };
  
  // HODL Calculator State
  const [hodlInputs, setHodlInputs] = useState({
    initialAmount: 10000,
    years: 4,
    startPrice: 30000,
    endPrice: 95000
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

  // Appendix helper functions
  const getCompletedDailyLessons = () => {
    // For now, return lessons from previous days (simulating completed progress)
    // In a real app, this would come from user progress data
    const currentDay = getCurrentDayIndex();
    const completedLessons = [];
    
    // Show lessons from the last 7 days as "completed"
    for (let i = Math.max(1, currentDay - 7); i < currentDay; i++) {
      completedLessons.push({
        dayIndex: i,
        title: `Day ${i} Lesson`,
        content: `Bitcoin educational content for day ${i}`,
        estimatedReadTime: 8
      });
    }
    
    return completedLessons;
  };

  const getCompletedWeeklyTopics = () => {
    // For now, return previous weeks as completed
    // In a real app, this would come from user progress data
    const currentWeek = Math.ceil(getCurrentDayIndex() / 7);
    const completedTopics = [];
    
    // Show previous weeks as completed
    for (let i = Math.max(1, currentWeek - 2); i < currentWeek; i++) {
      if (i === 1) {
        completedTopics.push({
          weekNumber: 1,
          title: "Austrian Economics & Sound Money",
          content: "Deep dive into economic principles behind Bitcoin",
          difficulty: "Intermediate",
          category: "Economics",
          estimatedReadTime: 65
        });
      } else if (i === 2) {
        completedTopics.push({
          weekNumber: 2,
          title: "Bitcoin Mining & Network Security",
          content: "Understanding proof-of-work and mining economics",
          difficulty: "Advanced",
          category: "Technical",
          estimatedReadTime: 70
        });
      }
    }
    
    return completedTopics;
  };

  const openAppendixLesson = (lesson: any) => {
    setSelectedAppendixLesson(lesson);
  };

  const getCurrentDayIndex = () => {
    const startDate = new Date('2024-01-01');
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays % 365;
  };
  
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
      case "What Is Money Really? - Day 1":
        return [
          {
            title: "The Coincidence of Wants Problem",
            paragraphs: [
              "Before money existed, people had to rely on direct barter - trading one good directly for another. This created a massive problem called the 'coincidence of wants' - you needed to find someone who not only had what you wanted, but also wanted exactly what you had to offer.",
              "Imagine you're a farmer with extra apples who needs shoes. In a barter system, you'd have to find a shoemaker who specifically wants apples at the exact same time you need shoes. If the shoemaker wants grain instead, you're stuck - you'd have to find someone willing to trade grain for apples, then trade that grain to the shoemaker.",
              "This problem becomes exponentially worse as communities grow larger and more specialized. In a village of 100 people with different skills and needs, the chances of finding perfect trading matches become incredibly slim, severely limiting economic growth and cooperation."
            ],
            keyPoints: [
              "Barter requires perfect matching of wants between two parties",
              "Complex chains of trades become necessary for simple exchanges", 
              "Economic growth is severely limited without a common medium",
              "Specialization becomes nearly impossible in pure barter systems"
            ],
            realWorldExample: "During economic crises when currency systems fail, communities often revert to barter. In Argentina's 2001 crisis, people traded professional services for food, but these exchanges were incredibly inefficient and limited economic recovery."
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
      "What Is Money Really? - Day 1": [
        "**Money solves the coincidence of wants problem** by eliminating the need to find someone who has what you want AND wants what you have",
        "**Community agreement** is the foundation of all money systems - value comes from shared trust that others will accept it",
        "**Medium of exchange** allows people to trade indirectly, dramatically expanding economic possibilities beyond simple barter",
        "**Store of value** enables people to save their economic output today and spend it later, making long-term planning possible",
        "**Unit of account** provides a standard way to measure and compare the value of different goods and services"
      ],
      "Medium of Exchange - Day 2": [
        "**Direct trade limitations** make complex economies impossible without a commonly accepted medium of exchange",
        "**Network effects** make money more valuable as more people accept it, creating powerful adoption incentives",
        "**Reduced transaction costs** from using money instead of barter enables specialization and economic growth",
        "**Market expansion** occurs when money allows people to trade with strangers and across great distances"
      ],
      "Inflation - Day 3": [
        "**Purchasing power erosion** occurs when the money supply grows faster than economic output, making each unit worth less",
        "**Wealth redistribution** happens through inflation as asset owners benefit while savers and wage earners lose purchasing power",
        "**Economic distortion** results from inflation as it encourages immediate spending over saving and long-term investment",
        "**Hidden taxation** occurs when governments finance spending through money creation rather than explicit taxes"
      ],
      "Gold and Scarcity - Day 4": [
        "**Natural scarcity** makes gold valuable because it cannot be created artificially, maintaining consistent supply constraints",
        "**Historical reliability** demonstrates that gold has maintained value across civilizations and millennia",
        "**Physical properties** like durability, divisibility, and portability make gold practical for monetary use",
        "**Scarcity premium** means slight supply increases have minimal impact on gold's value due to massive existing stockpiles"
      ],
      "Central Control of Money - Day 5": [
        "**Centralized issuance** means modern money supply is controlled by government institutions rather than natural constraints",
        "**Policy influence** allows central banks to expand or contract money supply based on economic and political considerations",
        "**Exclusion risk** exists when central authorities can freeze accounts or deny access to the monetary system",
        "**Single point of failure** creates systemic risk when central monetary authorities make poor decisions"
      ],
      "Unit of Account - Day 6": [
        "**Economic calculation** becomes possible when all goods can be priced in terms of a single monetary unit",
        "**Price comparison** is simplified when everything uses the same unit of account for measuring value",
        "**Contract enforcement** relies on stable units of account for long-term agreements and planning",
        "**Planning facilitation** enables businesses and individuals to make informed decisions about future resource allocation"
      ],
      "Trust in Money Systems - Day 7": [
        "**Community consensus** is required for any money system to function, regardless of its underlying technology",
        "**Institutional trust** varies across different money systems, from government backing to mathematical algorithms",
        "**Network effects** strengthen money as more people accept and use it, creating positive feedback loops",
        "**Trust evolution** shows how monetary systems change as communities update their shared beliefs about value"
      ]
    };
    return takeaways[lessonTitle] || [
      "This topic introduces fundamental concepts essential for understanding money and monetary systems",
      "Real-world applications demonstrate practical importance in daily economic life",
      "Understanding this concept helps build comprehensive knowledge of how economies function",
      "These principles contribute to informed decision-making about personal finances and economic policy"
    ];
  };

  const getFactDeepDive = (factTitle: string) => {
    const deepDives: Record<string, {
      explanation: string;
      examples: string[];
      visualDescription: string;
      keyTakeaways: string[];
    }> = {
      "What Is Money?": {
        explanation: "Money is any item or system that a community agrees has value and can be exchanged for goods and services. Throughout history, societies have used everything from seashells to gold to paper bills as money. The key is community agreement and trust that others will accept it.",
        examples: [
          "Ancient civilizations used salt, cattle, and grain as money",
          "Island societies used large stone wheels or rare shells",
          "Gold became popular because it's scarce, durable, and portable",
          "Paper money works because governments guarantee its value"
        ],
        visualDescription: "Imagine money as a shared language that lets people communicate value. Just like everyone agrees what words mean, communities agree what has value for trade.",
        keyTakeaways: [
          "Money is based on community agreement and trust",
          "It solves the problem of trading without perfect coincidence of wants",
          "Different societies have used many different forms of money",
          "The best money shares certain properties like scarcity and durability"
        ]
      },
      "Medium of Exchange": {
        explanation: "A medium of exchange eliminates the need for barter by providing something everyone will accept in trade. Instead of trading apples for shoes directly, you can sell apples for money, then use that money to buy shoes from anyone who accepts it.",
        examples: [
          "You sell your artwork for dollars, then use dollars to buy groceries",
          "A farmer sells wheat for money, then buys tools with that money",
          "Without money, the farmer would need to find someone who wants wheat AND has tools to trade",
          "Money breaks complex multi-party trades into simple two-party exchanges"
        ],
        visualDescription: "Think of money as a universal translator for value. Just as a translator helps people who speak different languages communicate, money helps people who produce different things trade with each other.",
        keyTakeaways: [
          "Eliminates the need for perfect coincidence of wants in trading",
          "Makes complex economic systems possible",
          "Must be widely accepted to function effectively",
          "Enables specialization by making trade efficient"
        ]
      },
      "Store of Value": {
        explanation: "A store of value allows you to save your purchasing power for the future. Good money holds its value over time, so the work you do today can benefit you tomorrow, next month, or next year.",
        examples: [
          "You work overtime this month and save money for a vacation next year",
          "A farmer saves money from harvest season to buy seeds for next year",
          "Your grandmother saved money in a bank account for decades",
          "People buy gold during uncertain times to preserve wealth"
        ],
        visualDescription: "Imagine money as a time machine for your work. It lets you capture the value of work you do today and transport it to the future when you need it.",
        keyTakeaways: [
          "Enables people to save for future needs and goals",
          "Must maintain value over time to function properly",
          "Poor stores of value lose purchasing power through inflation",
          "Essential for long-term planning and investment"
        ]
      },
      "Inflation": {
        explanation: "Inflation occurs when the money supply increases faster than economic growth, causing each unit of money to buy less over time. When governments print more money, it dilutes the value of existing money, like adding water to soup - you get more volume but less flavor per spoonful.",
        examples: [
          "In the 1970s, coffee cost 25 cents - today it costs $3 or more",
          "Your grandfather could buy a house for $20,000 - today it costs $400,000",
          "Venezuela printed so much money that people used wheelbarrows to carry cash",
          "Germany's 1920s hyperinflation made money so worthless people used it as wallpaper"
        ],
        visualDescription: "Picture inflation like a leak in your savings bucket. Even if you're not spending money, its purchasing power slowly drips away as prices rise around you.",
        keyTakeaways: [
          "Erodes the purchasing power of saved money over time",
          "Caused by increasing money supply faster than economic growth",
          "Hurts savers and people on fixed incomes the most",
          "Can become extreme hyperinflation in worst cases"
        ]
      },
      "Central Control": {
        explanation: "Traditional money systems are controlled by central authorities like governments and central banks who can change the rules, print more money, freeze accounts, or stop transactions. This centralized control means your money's value and accessibility depends on their decisions.",
        examples: [
          "The Federal Reserve can print trillions of dollars during crises",
          "Banks can freeze your account if they suspect unusual activity",
          "Governments can seize assets or block international transfers",
          "Currency controls can prevent people from exchanging their money"
        ],
        visualDescription: "Imagine your money as being stored in someone else's house. You might think it's yours, but the house owner can change the locks, limit your access, or even take some of it whenever they want.",
        keyTakeaways: [
          "Central authorities have ultimate control over traditional money",
          "They can inflate away value by printing more money",
          "Your access to your own money depends on their permission",
          "This creates dependency and systemic risk for users"
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
      "Unit of Account": {
        explanation: "A unit of account provides a standard way to measure and compare the value of different goods and services. It's like having a universal ruler for value that everyone understands and can use.",
        examples: [
          "Instead of remembering that 1 cow = 10 chickens = 100 apples, you can price everything in dollars",
          "Businesses can compare profits across different product lines using the same currency",
          "You can budget and plan by knowing rent costs $1,000 and groceries cost $200 per month",
          "International trade becomes easier when everyone uses recognized currency values"
        ],
        visualDescription: "Think of money as a measuring tape for value. Just as we use inches or centimeters to measure length, we use dollars or other currencies to measure economic value.",
        keyTakeaways: [
          "Simplifies complex value comparisons",
          "Enables accounting, budgeting, and financial planning",
          "Must be stable and widely understood to work effectively",
          "Essential for business operations and economic calculation"
        ]
      },
      "Trust & Agreement": {
        explanation: "Money is fundamentally a social technology based on shared belief and trust. Throughout history, communities have agreed that certain objects have value and can be used for trade, from shells to gold to digital numbers.",
        examples: [
          "Pacific islanders used large stone wheels as money because the community agreed they had value",
          "Gold became popular worldwide because many cultures independently recognized its properties",
          "Modern paper money works because governments back it and people trust the system",
          "Credit cards work because merchants trust the bank will process the payment"
        ],
        visualDescription: "Imagine money as a social contract written in the language of trust. Everyone signs this invisible agreement that certain things have value and can be exchanged.",
        keyTakeaways: [
          "All money systems require community agreement to function",
          "Trust can be built through scarcity, backing, or institutional guarantees",
          "When trust breaks down, money systems can collapse rapidly",
          "New forms of money must establish trust to gain adoption"
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

    setHodlResults({
      initialInvestment: hodlInputs.initialAmount,
      bitcoinAmount,
      startPrice: hodlInputs.startPrice,
      endPrice: hodlInputs.endPrice,
      currentValue,
      totalGain,
      percentageReturn,
      annualReturn: annualReturn * 100
    });
  };

  const calculateDcaStrategy = () => {
    const { monthlyAmount, frequency, duration, startDate } = dcaInputs;
    
    // Calculate frequency multiplier and total purchases
    const frequencyMap = { 
      daily: 365, 
      weekly: 52, 
      biweekly: 26, 
      monthly: 12, 
      quarterly: 4 
    };
    const purchasesPerYear = frequencyMap[frequency];
    const totalPurchases = Math.floor((duration / 12) * purchasesPerYear);
    const purchaseAmount = frequency === 'daily' ? monthlyAmount * 12 / 365 : 
                          frequency === 'weekly' ? monthlyAmount * 12 / 52 : 
                          frequency === 'biweekly' ? monthlyAmount * 12 / 26 : 
                          frequency === 'quarterly' ? monthlyAmount * 3 :
                          monthlyAmount;
    
    // Get historical starting price based on date
    const getStartingPrice = (startDate: string) => {
      if (startDate.includes('2019-01')) return 3500;
      if (startDate.includes('2019-07')) return 10000;
      if (startDate.includes('2020-01')) return 7200;
      if (startDate.includes('2020-03')) return 5000;
      if (startDate.includes('2020-07')) return 9000;
      if (startDate.includes('2020-10')) return 11000;
      if (startDate.includes('2021-01')) return 30000;
      if (startDate.includes('2021-05')) return 58000;
      if (startDate.includes('2021-07')) return 30000;
      if (startDate.includes('2021-10')) return 45000;
      if (startDate.includes('2022-01')) return 47000;
      if (startDate.includes('2022-06')) return 30000;
      if (startDate.includes('2022-11')) return 16000;
      if (startDate.includes('2023-01')) return 16500;
      if (startDate.includes('2023-06')) return 25000;
      if (startDate.includes('2023-10')) return 35000;
      if (startDate.includes('2024-01')) return 42000;
      if (startDate.includes('2024-06')) return 65000;
      return 35000; // Default
    };
    
    const startingPrice = getStartingPrice(startDate);
    const purchases = [];
    let totalInvested = 0;
    let totalBitcoin = 0;
    
    // Generate realistic Bitcoin price progression and track each purchase
    for (let i = 0; i < totalPurchases; i++) {
      const timeProgress = i / Math.max(totalPurchases - 1, 1);
      
      // Realistic Bitcoin price evolution over time
      const longTermGrowth = Math.pow(1.15, timeProgress * (duration / 12)); // 15% annual growth trend
      const marketCycles = 1 + Math.sin(timeProgress * 4 * Math.PI) * 0.3; // Market cycles
      const volatility = 1 + (Math.random() - 0.5) * 0.4; // ±20% volatility
      const crashRecovery = timeProgress < 0.3 ? (0.7 + timeProgress * 1.0) : 1; // Early period recovery
      
      const currentPrice = Math.max(1000, startingPrice * longTermGrowth * marketCycles * volatility * crashRecovery);
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
    
    const averagePrice = totalInvested / totalBitcoin;
    const currentBitcoinPrice = 50000; // Current market price
    const currentValue = totalBitcoin * currentBitcoinPrice;
    const totalGain = currentValue - totalInvested;
    const percentageReturn = (totalGain / totalInvested) * 100;
    
    setDcaResults({
      totalInvested,
      totalBitcoin,
      averagePrice,
      currentValue,
      totalGain,
      percentageReturn,
      duration,
      purchases // Include purchase data for accurate charting
    });
  };

  const [selectedWalletType, setSelectedWalletType] = useState<string | null>(null);
  
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

  // API Queries
  const { data: dailyFacts } = useQuery({
    queryKey: ['/api/daily-facts'],
  });

  const { data: lesson } = useQuery({
    queryKey: ['/api/lesson'],
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
              <h1 className="text-xl font-bold text-white">BTC Journey</h1>
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
                variant={activeSection === "simulations" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveSection("simulations")}
                className="text-sm px-4 py-2"
              >
                Simulations
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
            {activeSection === "simulations" && "Practice Bitcoin Concepts"}
            {activeSection === "more" && "Discover More About Bitcoin"}
          </h2>
          <p className="text-zinc-400">
            {activeSection === "learn" && "Learn the fundamentals and understand why Bitcoin matters"}
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

                <Button
                  variant={learnSubTab === "appendix" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setLearnSubTab("appendix")}
                  className="text-xs px-3 py-1"
                >
                  <BookOpen className="w-3 h-3 mr-1" />
                  Appendix
                </Button>

              </div>
            </div>

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
                          const deepDive = getFactDeepDive(fact.title);
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
                  <DailyQuiz />
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

            {/* Appendix Section */}
            {learnSubTab === "appendix" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">Learning Archive</h3>
                  <p className="text-zinc-400">Review your completed daily lessons</p>
                </div>

                {/* Daily Lessons Archive */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <BookOpen className="w-6 h-6 text-orange-400" />
                        <h4 className="text-lg font-bold text-white">Completed Daily Lessons</h4>
                      </div>
                      
                      <div className="grid gap-4">
                        {getCompletedDailyLessons().map((lesson, index) => (
                          <div 
                            key={index}
                            className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-orange-500/50 transition-colors cursor-pointer"
                            onClick={() => openAppendixLesson(lesson)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-semibold text-white mb-1">{lesson.title}</h5>
                                <p className="text-zinc-400 text-sm">Day {lesson.dayIndex} • {lesson.estimatedReadTime} min read</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="border-green-600 text-green-400">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Completed
                                </Badge>
                                <ChevronRight className="w-4 h-4 text-zinc-400" />
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {getCompletedDailyLessons().length === 0 && (
                          <div className="text-center py-8">
                            <BookOpen className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                            <p className="text-zinc-500">No completed daily lessons yet</p>
                            <p className="text-zinc-600 text-sm">Complete today's lesson to see it here</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Modal for viewing appendix content */}
                {selectedAppendixLesson && (
                  <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <Card className="bg-zinc-900 border-zinc-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white">{selectedAppendixLesson.title}</h3>
                            <p className="text-zinc-400 text-sm">
                              Day {selectedAppendixLesson.dayIndex} • {selectedAppendixLesson.estimatedReadTime} min read
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedAppendixLesson(null)}
                            className="text-zinc-400 hover:text-white"
                          >
                            <X className="w-5 h-5" />
                          </Button>
                        </div>
                        
                        <div className="prose prose-invert max-w-none">
                          <div className="space-y-6">
                            {getExpandedLessonContent(selectedAppendixLesson.title, selectedAppendixLesson.content).map((section, idx) => (
                              <div key={idx} className="space-y-4">
                                <h4 className="text-lg font-semibold text-white border-l-4 border-orange-500 pl-4">
                                  {section.title}
                                </h4>
                                <div className="text-zinc-300 leading-relaxed space-y-4">
                                  {section.paragraphs.map((paragraph, pIdx) => (
                                    <p key={pIdx}>{paragraph}</p>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Simulations Section */}
        {activeSection === "simulations" && (
          <div className="space-y-6">
            {/* Simulations Sub-navigation */}
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
                  HODL vs Trading
                </Button>
                <Button
                  variant={simulationsSubTab === "dca" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSimulationsSubTab("dca")}
                  className="text-xs px-3 py-1"
                >
                  <Calculator className="w-3 h-3 mr-1" />
                  DCA
                </Button>
              </div>
            </div>

            {/* Safety Section */}
            {simulationsSubTab === "safety" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">Bitcoin Wallet Safety</h3>
                  <p className="text-zinc-400">Learn essential security practices to protect your Bitcoin</p>
                </div>

                {/* Safety Rules */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-orange-500" />
                      Golden Rules of Bitcoin Security
                    </h4>
                    <div className="space-y-4">
                      {[
                        "Never share your private keys or seed phrases with anyone",
                        "Always verify receiving addresses before sending Bitcoin",
                        "Use hardware wallets for significant amounts",
                        "Keep multiple secure backups of your seed phrase",
                        "Never store large amounts on exchanges long-term",
                        "Double-check all transaction details before confirming",
                        "Be wary of phishing attempts and fake websites"
                      ].map((rule, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-zinc-300">{rule}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Interactive Wallet Explorer */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Wallet className="w-5 h-5 mr-2 text-orange-500" />
                      Interactive Wallet Explorer
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          type: "Hardware Wallet",
                          icon: <Lock className="w-6 h-6" />,
                          pros: ["Highest security", "Private keys never online", "Resistant to malware"],
                          cons: ["Higher cost", "Can be lost/damaged", "Learning curve"],
                          examples: ["Ledger Nano X", "Trezor Model T", "Coldcard"]
                        },
                        {
                          type: "Mobile Wallet",
                          icon: <CreditCard className="w-6 h-6" />,
                          pros: ["Convenient for daily use", "Easy to use", "Quick transactions"],
                          cons: ["Connected to internet", "Phone security risks", "Limited amounts"],
                          examples: ["Blue Wallet", "Phoenix", "Muun"]
                        },
                        {
                          type: "Desktop Wallet",
                          icon: <Building2 className="w-6 h-6" />,
                          pros: ["Full control", "Advanced features", "Better for larger amounts"],
                          cons: ["Computer security risks", "Less convenient", "Backup complexity"],
                          examples: ["Electrum", "Bitcoin Core", "Sparrow"]
                        },
                        {
                          type: "Exchange Wallet",
                          icon: <Globe className="w-6 h-6" />,
                          pros: ["Easy to start", "Built-in trading", "User-friendly"],
                          cons: ["Not your keys", "Centralized risk", "Regulatory risk"],
                          examples: ["Coinbase", "Kraken", "Binance"]
                        }
                      ].map((wallet, idx) => (
                        <div key={idx} className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                          <div className="flex items-center space-x-2">
                            <div className="text-orange-500">{wallet.icon}</div>
                            <h5 className="font-semibold text-white">{wallet.type}</h5>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-green-400 font-medium">Pros:</span>
                              <ul className="text-zinc-300 ml-4 list-disc">
                                {wallet.pros.map((pro, pIdx) => (
                                  <li key={pIdx}>{pro}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <span className="text-red-400 font-medium">Cons:</span>
                              <ul className="text-zinc-300 ml-4 list-disc">
                                {wallet.cons.map((con, cIdx) => (
                                  <li key={cIdx}>{con}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <span className="text-blue-400 font-medium">Examples:</span>
                              <div className="text-zinc-300 ml-2">
                                {wallet.examples.join(", ")}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Transaction Builder */}
            {simulationsSubTab === "transactions" && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-600/20 rounded-lg">
                        <ArrowRight className="w-8 h-8 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">Bitcoin Transaction Builder</h3>
                        <p className="text-zinc-300 mb-4">Create and broadcast a Bitcoin transaction step by step</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-white font-semibold">Transaction Details</h4>
                        
                        <div>
                          <label className="text-zinc-300 text-sm block mb-2">From Address</label>
                          <div className="bg-zinc-800 rounded px-3 py-2 text-white font-mono text-sm">
                            bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-zinc-300 text-sm block mb-2">To Address</label>
                          <input
                            type="text"
                            placeholder="Enter Bitcoin address..."
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="text-zinc-300 text-sm block mb-2">Amount (BTC)</label>
                          <input
                            type="number"
                            step="0.00000001"
                            placeholder="0.00100000"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="text-zinc-300 text-sm block mb-2">Fee Priority</label>
                          <select className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white">
                            <option>Low (1-2 hours) - 5 sat/vB</option>
                            <option>Medium (30 min) - 20 sat/vB</option>
                            <option>High (10 min) - 50 sat/vB</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-white font-semibold">Transaction Summary</h4>
                        <div className="bg-zinc-800 rounded-lg p-4 space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Amount:</span>
                            <span className="text-white">0.00100000 BTC</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Network Fee:</span>
                            <span className="text-white">0.00002000 BTC</span>
                          </div>
                          <div className="border-t border-zinc-700 pt-2 flex justify-between font-medium">
                            <span className="text-zinc-400">Total:</span>
                            <span className="text-white">0.00102000 BTC</span>
                          </div>
                        </div>
                        
                        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-lg py-2 font-medium transition-colors">
                          Sign & Broadcast Transaction
                        </button>
                        
                        <div className="text-xs text-zinc-400 space-y-1">
                          <p>• This is a simulation for educational purposes</p>
                          <p>• Real transactions require actual Bitcoin and wallet software</p>
                          <p>• Always verify addresses before sending</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* HODL vs Trading */}
            {simulationsSubTab === "hodl" && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-purple-600/20 rounded-lg">
                        <TrendingUp className="w-8 h-8 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">HODLing vs Trading Strategy</h3>
                        <p className="text-zinc-300 mb-4">Compare the long-term HODLing strategy with active trading to see the power of patience</p>
                        {/* HODLing Strategy Simulator */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Initial Investment ($)</label>
                            <input
                              type="number"
                              value={simulatorInputs.investment}
                              onChange={(e) => setSimulatorInputs(prev => ({...prev, investment: parseFloat(e.target.value) || 0}))}
                              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:ring-orange-500 focus:border-orange-500"
                              placeholder="10000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Holding Period (years)</label>
                            <input
                              type="number"
                              value={simulatorInputs.years}
                              onChange={(e) => setSimulatorInputs(prev => ({...prev, years: parseInt(e.target.value) || 1}))}
                              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:ring-orange-500 focus:border-orange-500"
                              placeholder="4"
                            />
                          </div>
                        </div>

                        <div className="text-center">
                          <button
                            onClick={() => {
                              const results = calculateHODL(
                                simulatorInputs.investment,
                                simulatorInputs.years,
                                simulatorInputs.tradingFeePercent
                              );
                              setHodlResults(results);
                            }}
                            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                          >
                            Calculate HODL Strategy
                          </button>
                        </div>

                        {hodlResults && (
                          <div className="bg-zinc-800 rounded-lg p-6 space-y-4">
                            <h4 className="text-lg font-semibold text-white">Results</h4>
                            <div className="grid md:grid-cols-3 gap-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-400">
                                  ${hodlResults.finalValue}
                                </div>
                                <div className="text-sm text-zinc-400">HODL Final Value</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-400">
                                  +{hodlResults.returnPercentage}%
                                </div>
                                <div className="text-sm text-zinc-400">Total Return</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-orange-400">
                                  ${hodlResults.savingsComparison.btcAdvantage}
                                </div>
                                <div className="text-sm text-zinc-400">vs Traditional Savings</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* DCA Calculator */}
            {simulationsSubTab === "dca" && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-600/20 rounded-lg">
                        <TrendingUp className="w-8 h-8 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">Dollar-Cost Averaging Calculator</h3>
                        <p className="text-zinc-300 mb-4">Simulate regular Bitcoin purchases over time to see the power of consistent investing</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-white font-semibold">DCA Parameters</h4>
                        
                        <div>
                          <label className="text-zinc-300 text-sm block mb-2">Monthly Investment ($)</label>
                          <input
                            type="number"
                            value={simulatorInputs.dca.monthlyAmount}
                            onChange={(e) => setSimulatorInputs(prev => ({
                              ...prev,
                              dca: { ...prev.dca, monthlyAmount: Number(e.target.value) }
                            }))}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="text-zinc-300 text-sm block mb-2">Duration (Months)</label>
                          <input
                            type="number"
                            value={simulatorInputs.dca.duration}
                            onChange={(e) => setSimulatorInputs(prev => ({
                              ...prev,
                              dca: { ...prev.dca, duration: Number(e.target.value) }
                            }))}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="text-zinc-300 text-sm block mb-2">Starting Bitcoin Price ($)</label>
                          <input
                            type="number"
                            value={simulatorInputs.dca.startPrice}
                            onChange={(e) => setSimulatorInputs(prev => ({
                              ...prev,
                              dca: { ...prev.dca, startPrice: Number(e.target.value) }
                            }))}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-white font-semibold">DCA Results</h4>
                        {(() => {
                          const results = calculateDCA(
                            simulatorInputs.dca.monthlyAmount,
                            simulatorInputs.dca.duration,
                            simulatorInputs.dca.startPrice
                          );
                          return (
                            <div className="space-y-3">
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">Total Invested</div>
                                <div className="text-blue-400 font-mono">${results.totalInvested}</div>
                              </div>
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">Bitcoin Accumulated</div>
                                <div className="text-orange-400 font-mono">{results.totalBtc} BTC</div>
                              </div>
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">Average Price</div>
                                <div className="text-white font-mono">${results.averagePrice}</div>
                              </div>
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">Current Value</div>
                                <div className="text-green-400 font-mono">${results.finalValue}</div>
                              </div>
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">Total Return</div>
                                <div className="text-green-400 font-mono">+{results.returnPercentage}%</div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* More Section */}
        {activeSection === "more" && (
          <div className="space-y-6">
            {/* More Sub-navigation */}
            <div className="flex justify-center">
              <div className="flex flex-wrap justify-center gap-2 bg-zinc-800/50 rounded-lg p-2">
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
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">Bitcoin Learning Store</h3>
                  <p className="text-zinc-400">Essential tools and books for your Bitcoin journey</p>
                </div>

                {/* Affiliate Disclosure */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-zinc-300">
                        <p className="font-medium text-white mb-1">Affiliate Disclosure</p>
                        <p>This page contains affiliate links. When you purchase through these links, you support our educational mission at no extra cost to you. We only recommend products we genuinely believe will help your Bitcoin journey.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Hardware Wallets */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Lock className="w-5 h-5 mr-2 text-orange-500" />
                      Hardware Wallets
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-white">Ledger Nano X</h5>
                          <Badge variant="secondary">$149</Badge>
                        </div>
                        <p className="text-sm text-zinc-300">
                          The most popular hardware wallet with Bluetooth connectivity and support for over 5,500 cryptocurrencies.
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-zinc-300">Bluetooth enabled</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-zinc-300">Mobile app support</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-zinc-300">Secure chip technology</span>
                          </div>
                        </div>
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Shop Ledger Nano X
                        </Button>
                      </div>

                      <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-white">Trezor Model T</h5>
                          <Badge variant="secondary">$219</Badge>
                        </div>
                        <p className="text-sm text-zinc-300">
                          Advanced hardware wallet with touchscreen interface and comprehensive security features.
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-zinc-300">Color touchscreen</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-zinc-300">Open-source firmware</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-zinc-300">Advanced recovery features</span>
                          </div>
                        </div>
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Shop Trezor Model T
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Essential Books */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-orange-500" />
                      Essential Bitcoin Books
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-white">Broken Money</h5>
                          <Badge variant="secondary">$25</Badge>
                        </div>
                        <p className="text-xs text-zinc-400">by Lyn Alden</p>
                        <p className="text-sm text-zinc-300">
                          A comprehensive analysis of monetary systems and why they fail, leading to Bitcoin as a solution.
                        </p>
                        <div className="flex items-center space-x-2 text-sm">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-zinc-300">Beginner Friendly</span>
                        </div>
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Buy on Amazon
                        </Button>
                      </div>

                      <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-white">The Bitcoin Standard</h5>
                          <Badge variant="secondary">$20</Badge>
                        </div>
                        <p className="text-xs text-zinc-400">by Saifedean Ammous</p>
                        <p className="text-sm text-zinc-300">
                          The definitive guide to Bitcoin's economic properties and monetary theory.
                        </p>
                        <div className="flex items-center space-x-2 text-sm">
                          <Brain className="w-4 h-4 text-blue-500" />
                          <span className="text-zinc-300">Intermediate</span>
                        </div>
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Buy on Amazon
                        </Button>
                      </div>

                      <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-white">The Fiat Standard</h5>
                          <Badge variant="secondary">$22</Badge>
                        </div>
                        <p className="text-xs text-zinc-400">by Saifedean Ammous</p>
                        <p className="text-sm text-zinc-300">
                          A critical examination of government money and its effects on society.
                        </p>
                        <div className="flex items-center space-x-2 text-sm">
                          <Brain className="w-4 h-4 text-blue-500" />
                          <span className="text-zinc-300">Advanced</span>
                        </div>
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Buy on Amazon
                        </Button>
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

export default Home;
