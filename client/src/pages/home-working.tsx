import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  CheckCircle,
  BarChart3,
  Clock,
  CreditCard,
  Building2
} from "lucide-react";
import type { User, DailyFact, Lesson, UserProgress, ConvictionContent } from "@shared/schema";
import DailyQuiz from "@/components/DailyQuiz";
import { BitcoinTerm, AutoGlossary } from "@/components/BitcoinGlossary";
import { ProgressIndicator, AchievementBadge, LearningAnalytics } from "@/components/ProgressIndicator";
import AchievementSystem from "@/components/AchievementSystem";

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

const userProfiles = {
  individuals: [
    {
      name: "Sarah Chen",
      role: "Software Engineer, San Francisco",
      story: "Sarah's Bitcoin journey began in 2017 during a late-night coding session when she stumbled upon the Bitcoin whitepaper. As a software engineer, she immediately grasped the elegance of the peer-to-peer electronic cash system. What started as intellectual curiosity became a financial lifeline when her grandmother in rural China needed medical care. Traditional wire transfers took 5-7 days and cost $45 in fees for a $500 transfer. With Bitcoin, Sarah could send money in minutes for under $2. 'I realized this wasn't just code - it was freedom,' she recalls. Today, Sarah dollar-cost averages $200 monthly into Bitcoin and has helped onboard her entire extended family. When COVID lockdowns hit and her salary was cut 30%, her Bitcoin holdings provided the financial cushion she needed. She's now building Bitcoin payment solutions at her startup, combining her technical skills with her passion for financial sovereignty.",
      reason: "Protection against inflation, instant global payments, and building the future of money"
    },
    {
      name: "Miguel Rodriguez", 
      role: "Restaurant Owner, Austin",
      story: "Miguel built his taco truck empire from nothing, but credit card fees were eating 3-4% of every transaction. 'I was essentially giving away free tacos to Visa,' he laughs. After attending a Bitcoin meetup in 2020, Miguel became the first food truck in Austin to accept Lightning payments. The results were immediate: zero chargebacks, 1% processing fees, and settlement in minutes instead of days. Word spread quickly through the Bitcoin community, and his trucks became gathering spots for local Bitcoiners. During the 2021 Texas winter storm that knocked out power grids, Miguel's truck was one of the few businesses still operating because Bitcoin transactions worked even when traditional payment systems failed. He now owns three locations, has hired 15 employees, and estimates Bitcoin adoption has increased his profit margins by 4%. 'Bitcoin didn't just save my business - it made my business anti-fragile,' Miguel explains while showing off his new Lightning Network point-of-sale system.",
      reason: "Lower fees, faster settlement, protection from chargebacks, and building a stronger business"
    },
    {
      name: "Dr. Amara Okafor",
      role: "Medical Professional",
      story: "Uses Bitcoin to send money to medical charities in countries with unstable banking systems.",
      reason: "Reliable value transfer to underbanked regions"
    }
  ],
  businesses: [
    {
      name: "Tesla",
      role: "Electric Vehicle Manufacturer",
      story: "Added $1.5 billion in Bitcoin to treasury in 2021, briefly accepted Bitcoin payments for vehicles.",
      reason: "Treasury diversification and hedge against fiat currency inflation"
    },
    {
      name: "Block (formerly Square)",
      role: "Financial Services Company",
      story: "Integrated Bitcoin into Cash App, purchased Bitcoin for corporate treasury, and invested in Bitcoin development.",
      reason: "Believes Bitcoin will become the internet's native currency"
    },
    {
      name: "MicroStrategy",
      role: "Business Intelligence Company",
      story: "Converted entire corporate treasury to Bitcoin, now holds over 190,000 BTC worth billions.",
      reason: "Bitcoin as superior store of value compared to cash reserves"
    }
  ],
  nations: [
    {
      name: "El Salvador",
      role: "Central American Nation",
      story: "First country to adopt Bitcoin as legal tender in 2021, built Bitcoin City powered by volcanic energy.",
      reason: "Financial inclusion and reduced reliance on US dollar remittances"
    },
    {
      name: "Central African Republic",
      role: "African Nation",
      story: "Second country to adopt Bitcoin as legal tender, launched Sango cryptocurrency project.",
      reason: "Economic development and reduced dependency on traditional banking"
    },
    {
      name: "Miami, Florida",
      role: "US City Government",
      story: "Explored paying city employees in Bitcoin, invested city funds in Bitcoin, and promoted crypto innovation.",
      reason: "Attract tech talent and position as cryptocurrency hub"
    }
  ]
};

const convictionContent = {
  quotes: [
    {
      text: "Bitcoin is a technological tour de force.",
      author: "Bill Gates",
      role: "Microsoft Co-founder",
      context: "Acknowledging Bitcoin's technical innovation despite regulatory concerns"
    },
    {
      text: "I think Bitcoin is digital gold.",
      author: "Chamath Palihapitiya",
      role: "Venture Capitalist",
      context: "Comparing Bitcoin's store of value properties to gold"
    },
    {
      text: "Bitcoin empowers people to be their own bank.",
      author: "Andreas Antonopoulos",
      role: "Bitcoin Educator",
      context: "Explaining Bitcoin's potential for financial sovereignty"
    }
  ],
  books: [
    {
      title: "The Bitcoin Standard",
      author: "Saifedean Ammous",
      difficulty: "Intermediate",
      pages: 286,
      description: "Explores Bitcoin's role as sound money and its potential to replace fiat currencies.",
      keyTopics: ["Monetary history", "Sound money principles", "Bitcoin economics"]
    },
    {
      title: "Mastering Bitcoin",
      author: "Andreas Antonopoulos", 
      difficulty: "Advanced",
      pages: 415,
      description: "Technical deep-dive into Bitcoin's underlying technology and cryptographic principles.",
      keyTopics: ["Cryptography", "Blockchain technology", "Bitcoin protocol"]
    },
    {
      title: "The Bullish Case for Bitcoin",
      author: "Vijay Boyapati",
      difficulty: "Beginner",
      pages: 68,
      description: "Concise explanation of why Bitcoin could become the world's reserve currency.",
      keyTopics: ["Store of value", "Monetary properties", "Investment thesis"]
    }
  ],
  videos: [
    {
      title: "Bitcoin: The End of Money as We Know It",
      speaker: "Documentary",
      duration: "60 minutes",
      type: "Documentary",
      description: "Comprehensive overview of money's evolution and Bitcoin's revolutionary potential.",
      url: "https://www.youtube.com/watch?v=lUF6klWuB38"
    },
    {
      title: "Why Bitcoin Matters",
      speaker: "Andreas Antonopoulos",
      duration: "45 minutes", 
      type: "Educational Talk",
      description: "Foundational explanation of Bitcoin's importance for financial freedom and inclusion.",
      url: "https://www.youtube.com/watch?v=q0XxsabgJEI"
    },
    {
      title: "The Network State",
      speaker: "Balaji Srinivasan",
      duration: "90 minutes",
      type: "Presentation",
      description: "Balaji explores how Bitcoin and crypto enable new forms of governance and social organization beyond traditional nation-states.",
      url: "https://www.youtube.com/watch?v=P6vYyqHG_Po"
    }
  ]
};

const simulations = {
  mining: {
    title: "Bitcoin Mining Simulator",
    description: "Experience the economics of Bitcoin mining with different hardware and electricity costs",
    difficulty: "Intermediate",
    estimatedTime: "10-15 minutes"
  },
  transactions: {
    title: "Transaction Builder",
    description: "Build and broadcast Bitcoin transactions, understand fees and confirmations",
    difficulty: "Advanced", 
    estimatedTime: "15-20 minutes"
  },
  hodl: {
    title: "HODLing Strategy",
    description: "Compare different Bitcoin accumulation and holding strategies over time",
    difficulty: "Beginner",
    estimatedTime: "5-10 minutes"
  },
  dca: {
    title: "Dollar-Cost Averaging",
    description: "Simulate regular Bitcoin purchases and see the impact of timing vs. consistency",
    difficulty: "Beginner",
    estimatedTime: "10-15 minutes"
  },
  halving: {
    title: "Halving Impact",
    description: "Explore how Bitcoin halving events affect supply, mining rewards, and price dynamics",
    difficulty: "Intermediate",
    estimatedTime: "10-15 minutes"
  }
};

const traditionalFinanceProblems = {
  problems: [
    {
      title: "Central Bank Money Printing",
      description: "Central banks can create unlimited money, diluting your savings",
      impact: "Since 1971, the US dollar has lost 85% of its purchasing power",
      example: "The Fed printed 40% of all dollars in existence during 2020-2021",
      icon: "💰"
    },
    {
      title: "Banking Hours & Holidays",
      description: "Banks control when you can access YOUR money",
      impact: "No transactions on weekends, holidays, or after business hours",
      example: "Try sending money internationally on a Sunday - impossible",
      icon: "🏦"
    },
    {
      title: "High Transaction Fees",
      description: "Banks charge fees for using your own money",
      impact: "International transfers cost $15-50 and take 3-5 business days",
      example: "Western Union charges up to 10% for remittances",
      icon: "💸"
    },
    {
      title: "Account Freezing",
      description: "Governments and banks can freeze your accounts instantly",
      impact: "Your money becomes inaccessible without legal recourse",
      example: "Canadian truckers had accounts frozen during 2022 protests",
      icon: "🔒"
    },
    {
      title: "Inflation Tax",
      description: "Hidden tax through currency debasement",
      impact: "Your purchasing power decreases even while saving",
      example: "A $100 grocery bill in 2000 costs $175 today",
      icon: "📉"
    },
    {
      title: "Exclusion from System",
      description: "2 billion people worldwide have no access to banking",
      impact: "Unable to save, invest, or participate in global economy",
      example: "Requires documentation, credit history, minimum balances",
      icon: "🚫"
    }
  ],
  solutions: [
    {
      problem: "Central Bank Money Printing",
      solution: "Fixed Supply Cap",
      description: "Bitcoin has a hard limit of 21 million coins - no one can print more",
      benefit: "Your Bitcoin percentage of total supply never decreases"
    },
    {
      problem: "Banking Hours & Holidays",
      solution: "24/7/365 Operation",
      description: "Bitcoin network never sleeps - transactions any time, anywhere",
      benefit: "Send money globally on Christmas morning if you want"
    },
    {
      problem: "High Transaction Fees",
      solution: "Low-Cost Transactions",
      description: "Bitcoin transactions cost $1-5, Lightning Network costs pennies",
      benefit: "Send $1 million for the same fee as sending $10"
    },
    {
      problem: "Account Freezing",
      solution: "Self-Custody",
      description: "You control your private keys, no one can freeze your Bitcoin",
      benefit: "Truly own your money - 'Not your keys, not your coins'"
    },
    {
      problem: "Inflation Tax",
      solution: "Deflationary Money",
      description: "Bitcoin becomes more scarce over time due to halving events",
      benefit: "Store of value that appreciates instead of depreciates"
    },
    {
      problem: "Exclusion from System",
      solution: "Permissionless Access",
      description: "Anyone with internet can use Bitcoin - no banks required",
      benefit: "Financial inclusion for everyone, everywhere"
    }
  ],
  comparison: {
    traditional: {
      title: "Traditional Finance",
      characteristics: [
        { aspect: "Control", value: "Central banks & governments", negative: true },
        { aspect: "Supply", value: "Unlimited money printing", negative: true },
        { aspect: "Access", value: "Banking hours only", negative: true },
        { aspect: "Fees", value: "$15-50 international transfers", negative: true },
        { aspect: "Speed", value: "3-5 business days", negative: true },
        { aspect: "Censorship", value: "Accounts can be frozen", negative: true },
        { aspect: "Inclusion", value: "2B people excluded", negative: true },
        { aspect: "Transparency", value: "Opaque operations", negative: true }
      ]
    },
    bitcoin: {
      title: "Bitcoin",
      characteristics: [
        { aspect: "Control", value: "You control your money", negative: false },
        { aspect: "Supply", value: "Fixed 21 million cap", negative: false },
        { aspect: "Access", value: "24/7/365 availability", negative: false },
        { aspect: "Fees", value: "$1-5 any amount", negative: false },
        { aspect: "Speed", value: "10 minutes to 1 hour", negative: false },
        { aspect: "Censorship", value: "Censorship resistant", negative: false },
        { aspect: "Inclusion", value: "Open to everyone", negative: false },
        { aspect: "Transparency", value: "Fully auditable blockchain", negative: false }
      ]
    }
  },
  future: [
    {
      timeframe: "2024-2026",
      developments: [
        "More countries adopt Bitcoin as legal tender (following El Salvador)",
        "Major corporations add Bitcoin to treasury reserves",
        "Bitcoin ETFs bring institutional investment",
        "Lightning Network scales to millions of users"
      ]
    },
    {
      timeframe: "2026-2030", 
      developments: [
        "Central Bank Digital Currencies (CBDCs) increase surveillance concerns",
        "Bitcoin becomes global reserve asset alongside gold",
        "Hyperinflation in fiat currencies drives Bitcoin adoption",
        "Bitcoin becomes standard for international trade settlements"
      ]
    },
    {
      timeframe: "2030+",
      developments: [
        "Bitcoin standard emerges as dominant monetary system",
        "Traditional banks adapt or become obsolete",
        "Financial sovereignty becomes basic human right",
        "Global economic inequality decreases through Bitcoin access"
      ]
    }
  ]
};

type MainSection = "learn" | "practice" | "more";
type LearnSubTab = "today" | "deepdive" | "reference" | "stories";
type PracticeSubTab = "safety" | "transactions" | "hodl" | "dca";
type MoreSubTab = "store";

export default function Home() {
  const [activeSection, setActiveSection] = useState<MainSection>("learn");
  const [learnSubTab, setLearnSubTab] = useState<LearnSubTab>("today");
  const [practiceSubTab, setPracticeSubTab] = useState<PracticeSubTab>("safety");
  const [moreSubTab, setMoreSubTab] = useState<MoreSubTab>("store");
  const [storiesSubTab, setStoriesSubTab] = useState<"individuals" | "businesses" | "nations">("individuals");
  const [convictionSubTab, setConvictionSubTab] = useState<"whitepaper" | "books" | "videos">("whitepaper");
  const [txStatus, setTxStatus] = useState('preview');
  const [currentStep, setCurrentStep] = useState(0);

  const [showPriceChart, setShowPriceChart] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [expandedFacts, setExpandedFacts] = useState<Set<number>>(new Set());
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [simulatorInputs, setSimulatorInputs] = useState({
    dca: { monthlyAmount: 100, duration: 24, startPrice: 50000 },
    hodl: { initialAmount: 5000, years: 4, volatilityLevel: 'medium' as 'low' | 'medium' | 'high' },
    transaction: { amount: 0.001, feeLevel: 'medium' as 'low' | 'medium' | 'high' },
    safety: { walletType: 'hardware' as 'exchange' | 'hot' | 'hardware', amount: 1000 },
    investment: 10000,
    years: 4,
    tradingFeePercent: 0.25
  });
  
  const [hodlResults, setHodlResults] = useState<any>(null);
  const [dcaResults, setDcaResults] = useState<any>(null);





  const toggleFactExpansion = (factId: number) => {
    const newExpanded = new Set(expandedFacts);
    if (newExpanded.has(factId)) {
      newExpanded.delete(factId);
    } else {
      newExpanded.add(factId);
    }
    setExpandedFacts(newExpanded);
  };

  const getFactDeepDive = (factTitle: string) => {
    const deepDives: Record<string, {
      explanation: string;
      examples: string[];
      visualDescription: string;
      keyTakeaways: string[];
    }> = {
      "Halving Events": {
        explanation: "Bitcoin halving is a pre-programmed event that occurs approximately every 4 years (210,000 blocks) where the reward for mining new blocks is cut in half. This mechanism ensures Bitcoin's scarcity and controls inflation. The halving is hardcoded into Bitcoin's protocol and cannot be changed without consensus from the entire network.",
        examples: [
          "2012: Reward dropped from 50 BTC to 25 BTC per block",
          "2016: Reward dropped from 25 BTC to 12.5 BTC per block", 
          "2020: Reward dropped from 12.5 BTC to 6.25 BTC per block",
          "2024: Reward dropped from 6.25 BTC to 3.125 BTC per block"
        ],
        visualDescription: "Imagine a giant digital clock counting down blocks. Every 210,000 blocks, an automated mechanism literally cuts the mining reward in half - like a vending machine that suddenly starts giving half portions while keeping the same price.",
        keyTakeaways: [
          "Reduces new Bitcoin supply entering the market",
          "Creates predictable scarcity timeline",
          "Often correlates with price increases due to supply shock",
          "Demonstrates Bitcoin's deflationary monetary policy"
        ]
      },
      "Energy Security": {
        explanation: "Bitcoin mining requires significant energy to secure the network through proof-of-work. This energy consumption isn't waste - it's the cost of running the world's most secure financial network without any central authority. The energy creates an economic incentive structure that makes attacking Bitcoin prohibitively expensive.",
        examples: [
          "Bitcoin network uses ~150 TWh annually (similar to Argentina)",
          "Miners increasingly use renewable energy sources (>50% renewable)",
          "Stranded energy (unused power) becomes economically viable through mining",
          "Energy usage scales with network value, not transaction volume"
        ],
        visualDescription: "Picture a fortress protected by an army of guards working 24/7. The energy cost is like paying these guards - the more valuable what's inside, the more security you need. Bitcoin's 'guards' are computers solving mathematical puzzles that become harder as more guards join.",
        keyTakeaways: [
          "Energy secures $1+ trillion in Bitcoin value",
          "Incentivizes renewable energy development",
          "Cost of attack grows with network security",
          "Energy use is transparent and auditable"
        ]
      },
      "Digital Scarcity": {
        explanation: "Before Bitcoin, digital items could be copied infinitely at zero cost. Bitcoin solved the 'double-spending problem' using cryptographic proof and network consensus, creating the first truly scarce digital asset. Each bitcoin exists as a unique entry on the blockchain that cannot be duplicated or counterfeited.",
        examples: [
          "Only 21 million bitcoins will ever exist (hardcoded limit)",
          "Each satoshi (0.00000001 BTC) is uniquely traceable",
          "Lost bitcoins are permanently removed from circulation",
          "No central authority can create more bitcoins"
        ],
        visualDescription: "Think of digital gold bars that can't be melted down and recast. Each bitcoin is like a unique serial number in a global ledger that everyone can verify but no one can forge. It's impossible to photocopy a bitcoin just like you can't photocopy a real diamond.",
        keyTakeaways: [
          "First solution to digital scarcity problem",
          "Mathematically enforced supply cap",
          "Cannot be inflated away by governments",
          "Scarcity increases as adoption grows"
        ]
      }
    };

    return deepDives[factTitle] || {
      explanation: "This fact represents a fundamental aspect of Bitcoin's design and operation that distinguishes it from traditional financial systems.",
      examples: ["Bitcoin operates 24/7 without holidays", "No single point of failure", "Transparent and auditable"],
      visualDescription: "Imagine a system that combines the transparency of a glass house with the security of a bank vault.",
      keyTakeaways: ["Decentralized operation", "Cryptographic security", "Global accessibility"]
    };
  };

  const calculateMiningProfitability = (hashRate: number, electricityCost: number, bitcoinPrice: number) => {
    const dailyBtc = (hashRate * 0.00000005) * 24; // Simplified calculation
    const dailyRevenue = dailyBtc * bitcoinPrice;
    const dailyElectricityCost = (hashRate * 0.0015) * electricityCost * 24; // ~1.5kW per 100 TH/s
    const dailyProfit = dailyRevenue - dailyElectricityCost;
    const monthlyProfit = dailyProfit * 30;
    const yearlyProfit = dailyProfit * 365;
    
    return {
      dailyBtc: dailyBtc.toFixed(8),
      dailyRevenue: dailyRevenue.toFixed(2),
      dailyElectricityCost: dailyElectricityCost.toFixed(2),
      dailyProfit: dailyProfit.toFixed(2),
      monthlyProfit: monthlyProfit.toFixed(2),
      yearlyProfit: yearlyProfit.toFixed(2),
      profitMargin: ((dailyProfit / dailyRevenue) * 100).toFixed(1)
    };
  };

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

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    queryFn: () => fetch("/api/user").then(res => res.json()) as Promise<User>
  });

  const { data: dailyFacts = [] } = useQuery({
    queryKey: ["/api/daily-facts"],
    queryFn: () => fetch("/api/daily-facts").then(res => res.json()) as Promise<DailyFact[]>
  });

  const { data: lesson } = useQuery({
    queryKey: ["/api/lesson"],
    queryFn: () => fetch("/api/lesson").then(res => res.json()) as Promise<Lesson>
  });

  const { data: conviction = [] } = useQuery({
    queryKey: ["/api/conviction-content"],
    queryFn: () => fetch("/api/conviction-content").then(res => res.json()) as Promise<ConvictionContent[]>
  });

  const { data: bitcoinPrice } = useQuery({
    queryKey: ["/api/bitcoin-price"],
    queryFn: () => fetch("/api/bitcoin-price").then(res => res.json()),
    refetchInterval: 30000
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="p-4 bg-orange-600 rounded-full inline-block animate-pulse">
            <Bitcoin className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Loading your Conviction</h1>
          <p className="text-zinc-400">Building the future of money</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="p-1.5 sm:p-2 bg-orange-600 rounded-lg flex-shrink-0">
                <Bitcoin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg font-bold text-white truncate">BTC Journey</h1>
                <p className="text-xs text-zinc-400 hidden sm:block">Build your conviction</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPriceChart(!showPriceChart)}
                className="text-zinc-400 hover:text-white hover:bg-zinc-800 px-2 sm:px-3"
              >
                <Bitcoin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="text-xs sm:text-sm font-mono">
                  ${bitcoinPrice?.priceUsd ? Number(bitcoinPrice.priceUsd).toLocaleString() : '...'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <nav className="bg-zinc-900/50 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 py-2 sm:py-3">
            <Button
              variant={activeSection === "learn" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveSection("learn")}
              className={`${activeSection === "learn" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"} px-3 sm:px-4 py-2 text-sm sm:text-base min-w-0 flex-shrink-0`}
            >
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="whitespace-nowrap">Learn</span>
            </Button>
            <Button
              variant={activeSection === "practice" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveSection("practice")}
              className={`${activeSection === "practice" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"} px-3 sm:px-4 py-2 text-sm sm:text-base min-w-0 flex-shrink-0`}
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="whitespace-nowrap">Practice</span>
            </Button>
            <Button
              variant={activeSection === "more" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveSection("more")}
              className={`${activeSection === "more" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"} px-3 sm:px-4 py-2 text-sm sm:text-base min-w-0 flex-shrink-0`}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="whitespace-nowrap">More</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Sub Navigation */}
      {activeSection === "learn" && (
        <div className="bg-zinc-800/30 border-b border-zinc-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-center gap-1 py-2 flex-wrap">
              <Button
                variant={learnSubTab === "today" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setLearnSubTab("today")}
                className="text-xs px-2 py-1"
              >
                <Calendar className="w-3 h-3 mr-1" />
                Today
              </Button>
              <Button
                variant={learnSubTab === "deepdive" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setLearnSubTab("deepdive")}
                className="text-xs px-2 py-1"
              >
                <Globe className="w-3 h-3 mr-1" />
                Deep Dive
              </Button>
              <Button
                variant={learnSubTab === "reference" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setLearnSubTab("reference")}
                className="text-xs px-2 py-1"
              >
                <FileText className="w-3 h-3 mr-1" />
                Reference
              </Button>
              <Button
                variant={learnSubTab === "stories" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setLearnSubTab("stories")}
                className="text-xs px-2 py-1"
              >
                <UserIcon className="w-3 h-3 mr-1" />
                Stories
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeSection === "practice" && (
        <div className="bg-zinc-800/30 border-b border-zinc-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-center gap-1 py-2 flex-wrap">
              <Button
                variant={practiceSubTab === "safety" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setPracticeSubTab("safety")}
                className="text-xs px-2 py-1"
              >
                <Shield className="w-3 h-3 mr-1" />
                Wallet Safety
              </Button>
              <Button
                variant={practiceSubTab === "transactions" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setPracticeSubTab("transactions")}
                className="text-xs px-2 py-1"
              >
                <ArrowRight className="w-3 h-3 mr-1" />
                Transactions
              </Button>
              <Button
                variant={practiceSubTab === "hodl" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setPracticeSubTab("hodl")}
                className="text-xs px-2 py-1"
              >
                <Gem className="w-3 h-3 mr-1" />
                HODLing
              </Button>
              <Button
                variant={practiceSubTab === "dca" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setPracticeSubTab("dca")}
                className="text-xs px-2 py-1"
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                DCA
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeSection === "more" && (
        <div className="bg-zinc-800/30 border-b border-zinc-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-center gap-1 py-2 flex-wrap">
              <Button
                variant={moreSubTab === "store" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setMoreSubTab("store")}
                className="text-xs px-2 py-1"
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                Store
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {activeSection === "learn" && "Build Your Bitcoin Foundation"}
            {activeSection === "practice" && "Practice Bitcoin Concepts"}
            {activeSection === "more" && "Discover More About Bitcoin"}
          </h2>
          <p className="text-zinc-400">
            {activeSection === "learn" && "Learn the fundamentals and understand why Bitcoin matters"}
            {activeSection === "practice" && "Interactive simulations to deepen your understanding"}
            {activeSection === "more" && "Real stories and conviction-building content"}
          </p>
        </div>

        {/* Learn Section */}
        {activeSection === "learn" && (
          <div className="space-y-6">
            {learnSubTab === "today" && (
              <div className="space-y-6">
                {/* Apple Activity-Inspired Condensed Header */}
                <Card className="bg-zinc-900 border-zinc-800 mb-6">
                  <CardContent className="p-6">
                    {/* Header Section */}
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-white mb-1">Today's Journey</h2>
                      <p className="text-zinc-400 mb-4">Build Bitcoin knowledge step by step</p>
                      
                      {/* Today's Goal */}
                      <div className="bg-gradient-to-r from-orange-600/20 to-yellow-600/20 border border-orange-600/30 rounded-lg p-3 max-w-md mx-auto">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <Gem className="w-3 h-3 text-orange-400" />
                          <span className="text-orange-300 font-medium text-sm">Today's Goal</span>
                        </div>
                        <p className="text-zinc-300 text-xs leading-relaxed">
                          Understand how <BitcoinTerm term="Bitcoin">Bitcoin</BitcoinTerm> works as digital money and why it's different from traditional currencies
                        </p>
                      </div>
                    </div>

                    {/* Activity Rings & Progress Section */}
                    <div className="flex items-center justify-center gap-8 mb-6">
                      {/* Activity Rings */}
                      <div className="relative">
                        <svg className="w-24 h-24 transform -rotate-90">
                          {/* Background circles */}
                          <circle cx="48" cy="48" r="38" stroke="rgb(39, 39, 42)" strokeWidth="4" fill="none" />
                          <circle cx="48" cy="48" r="30" stroke="rgb(39, 39, 42)" strokeWidth="3" fill="none" />
                          <circle cx="48" cy="48" r="22" stroke="rgb(39, 39, 42)" strokeWidth="3" fill="none" />
                          
                          {/* Progress circles - Facts (Green, Outer) */}
                          <circle 
                            cx="48" cy="48" r="38" 
                            stroke="rgb(34, 197, 94)" 
                            strokeWidth="4" 
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${239 * 0.85} ${239 * 0.15}`}
                            className="transition-all duration-1000"
                          />
                          {/* Lesson (Blue, Middle) */}
                          <circle 
                            cx="48" cy="48" r="30" 
                            stroke="rgb(59, 130, 246)" 
                            strokeWidth="3" 
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${188 * 0.75} ${188 * 0.25}`}
                            className="transition-all duration-1000"
                          />
                          {/* Quiz (Purple, Inner) */}
                          <circle 
                            cx="48" cy="48" r="22" 
                            stroke="rgb(168, 85, 247)" 
                            strokeWidth="3" 
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${138 * 1.0} ${138 * 0.0}`}
                            className="transition-all duration-1000"
                          />
                        </svg>
                        
                        {/* Center streak display */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{user?.currentStreak || 0}</div>
                          </div>
                        </div>
                      </div>

                      {/* Ring Labels & Stats */}
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-green-500 flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-zinc-300 font-medium">Today's Bitcoin Facts</span>
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-green-400" />
                                <span className="text-xs text-green-400 font-semibold">85%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-blue-500 flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-zinc-300 font-medium">Today's Lesson</span>
                              <div className="flex items-center gap-1">
                                <Play className="w-3 h-3 text-blue-400" />
                                <span className="text-xs text-blue-400 font-semibold">75%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-purple-500 flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-zinc-300 font-medium">Knowledge Test</span>
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-purple-400" />
                                <span className="text-xs text-purple-400 font-semibold">100%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats & Continue Action */}
                    <div className="border-t border-zinc-800 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-zinc-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-orange-400" />
                            <span>Day {((new Date().getTime() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24)) % 190 + 1 | 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-400" />
                            <span>~10 min total</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <GraduationCap className="w-3 h-3 text-green-400" />
                            <span>Beginner</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <ArrowRight className="w-4 h-4 text-orange-400" />
                            <span className="text-sm text-zinc-300">Continue learning</span>
                          </div>
                          <Badge variant="outline" className="border-orange-600 text-orange-400 text-xs">
                            87% complete
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats & Motivation */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-zinc-400 text-sm">Learning Streak</p>
                          <p className="text-2xl font-bold text-orange-400">{user?.currentStreak || 0} days</p>
                        </div>
                        <div className="p-3 bg-orange-600/20 rounded-lg">
                          <Zap className="w-6 h-6 text-orange-400" />
                        </div>
                      </div>
                      {user?.currentStreak && user.currentStreak >= 7 && (
                        <div className="mt-2 text-xs text-green-400">🔥 On fire! Keep it up!</div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-zinc-400 text-sm">Bitcoin Knowledge</p>
                          <p className="text-2xl font-bold text-blue-400">Beginner</p>
                        </div>
                        <div className="p-3 bg-blue-600/20 rounded-lg">
                          <GraduationCap className="w-6 h-6 text-blue-400" />
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-zinc-400">Complete 7 days to advance</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Step 1: Essential Bitcoin Facts */}
                <Card className="bg-zinc-900 border-zinc-800 border-l-4 border-l-green-600">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">1</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Today's Bitcoin Facts</h3>
                          <p className="text-zinc-400 text-sm">Build your foundation with core concepts</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-green-600 text-green-400">
                        2-3 min read
                      </Badge>
                    </div>
                    <div className="grid gap-4">
                      {dailyFacts.map((fact, index) => (
                        <div key={index} className="bg-zinc-800/50 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-orange-600/20 rounded-lg flex-shrink-0">
                              {(() => {
                                const IconComponent = iconMap[fact.icon as keyof typeof iconMap];
                                return IconComponent ? <IconComponent className="w-5 h-5 text-orange-400" /> : null;
                              })()}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white mb-1">{fact.title}</h4>
                              <p className="text-zinc-300 text-sm mb-2">
                                <AutoGlossary>{fact.content}</AutoGlossary>
                              </p>
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="border-orange-600 text-orange-400 text-xs">
                                  {fact.category}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleFactExpansion(index)}
                                  className="text-orange-400 hover:text-orange-300 hover:bg-orange-600/20 text-xs"
                                >
                                  {expandedFacts.has(index) ? (
                                    <>
                                      <ChevronUp className="w-3 h-3 mr-1" />
                                      Less
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="w-3 h-3 mr-1" />
                                      More
                                    </>
                                  )}
                                </Button>
                              </div>
                              
                              {expandedFacts.has(index) && (
                                <div className="mt-4 pt-4 border-t border-zinc-700">
                                  {(() => {
                                    const deepDive = getFactDeepDive(fact.title);
                                    return (
                                      <div className="space-y-3">
                                        <div className="bg-orange-600/10 border border-orange-600/20 rounded-lg p-3">
                                          <h5 className="text-orange-400 font-medium text-sm mb-2">Detailed Explanation</h5>
                                          <p className="text-zinc-300 text-sm">{deepDive.explanation}</p>
                                        </div>
                                        
                                        <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-3">
                                          <h5 className="text-blue-400 font-medium text-sm mb-2">Visual Description</h5>
                                          <p className="text-zinc-300 text-sm">{deepDive.visualDescription}</p>
                                        </div>
                                        
                                        <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-3">
                                          <h5 className="text-green-400 font-medium text-sm mb-2">Real Examples</h5>
                                          <ul className="text-zinc-300 text-sm space-y-1">
                                            {deepDive.examples.map((example, idx) => (
                                              <li key={idx} className="flex items-start gap-2">
                                                <span className="text-green-400 mt-1">•</span>
                                                {example}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                        
                                        <div className="bg-purple-600/10 border border-purple-600/20 rounded-lg p-3">
                                          <h5 className="text-purple-400 font-medium text-sm mb-2">Key Takeaways</h5>
                                          <ul className="text-zinc-300 text-sm space-y-1">
                                            {deepDive.keyTakeaways.map((takeaway, idx) => (
                                              <li key={idx} className="flex items-start gap-2">
                                                <CheckCircle className="w-3 h-3 text-purple-400 mt-1 flex-shrink-0" />
                                                {takeaway}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Step 2: Deep Dive Lesson */}
                <Card className="bg-zinc-900 border-zinc-800 border-l-4 border-l-blue-600">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">2</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Today's Lesson</h3>
                          <p className="text-zinc-400 text-sm">Connect the concepts and see how it all works</p>
                        </div>
                      </div>
                      {lesson && (
                        <Badge variant="outline" className="border-blue-600 text-blue-400">
                          {lesson.estimatedReadTime} • Step 2
                        </Badge>
                      )}
                    </div>
                    {lesson ? (
                      <div className="space-y-4">
                        <h4 className="text-xl font-bold text-white">{lesson.title}</h4>
                        <p className="text-zinc-300 leading-relaxed">
                          <AutoGlossary>{lesson.content}</AutoGlossary>
                        </p>
                        
                        {/* Why This Matters Section */}
                        <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-4">
                          <h5 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            Why This Matters Today
                          </h5>
                          <p className="text-zinc-300 text-sm">
                            Understanding <BitcoinTerm term="mining">Bitcoin mining</BitcoinTerm> is crucial because it's the backbone of <BitcoinTerm term="Bitcoin">Bitcoin's</BitcoinTerm> security. 
                            Every transaction you make is protected by this global network of <BitcoinTerm term="miners">miners</BitcoinTerm> who compete to validate transactions 
                            and secure the <BitcoinTerm term="blockchain">blockchain</BitcoinTerm>. This process makes Bitcoin truly <BitcoinTerm term="decentralized">decentralized</BitcoinTerm> 
                            and resistant to control by any single entity.
                          </p>
                        </div>
                        
                        <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
                          <h5 className="text-blue-400 font-medium mb-2">Summary</h5>
                          <p className="text-zinc-300 text-sm">
                            <AutoGlossary>{lesson.summary}</AutoGlossary>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-zinc-500">Loading today's lesson...</p>
                    )}
                  </CardContent>
                </Card>

                {/* Step 3: Knowledge Test */}
                <Card className="bg-zinc-900 border-zinc-800 border-l-4 border-l-purple-600">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">3</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Test Your Knowledge</h3>
                          <p className="text-zinc-400 text-sm">Confirm your understanding with interactive questions</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-purple-600 text-purple-400">
                        2-3 min • Final Step
                      </Badge>
                    </div>

                    {/* Learning objective for quiz */}
                    <div className="bg-purple-600/10 border border-purple-600/20 rounded-lg p-4 mb-6">
                      <h4 className="text-purple-300 font-medium mb-2 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        What You'll Prove
                      </h4>
                      <ul className="text-zinc-300 text-sm space-y-1">
                        <li>• You understand what Bitcoin is and how it's different</li>
                        <li>• You can explain key Bitcoin concepts in your own words</li>
                        <li>• You're ready to explore more advanced topics</li>
                      </ul>
                    </div>

                    <DailyQuiz />

                    {/* Completion celebration */}
                    <div className="mt-6 pt-4 border-t border-zinc-700">
                      <div className="text-center space-y-3">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-600/30 rounded-full">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-green-300 font-medium text-sm">Journey Complete for Today!</span>
                        </div>
                        <p className="text-zinc-400 text-sm">
                          Come back tomorrow to continue building your Bitcoin knowledge
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Legacy Facts Section (kept for transition) */}
            {learnSubTab === "today" && false && (
              <div className="grid gap-6">
                {dailyFacts.map((fact, index) => (
                  <Card key={index} className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-orange-600/20 rounded-lg">
                          {(() => {
                            const IconComponent = iconMap[fact.icon as keyof typeof iconMap];
                            return IconComponent ? <IconComponent className="w-8 h-8 text-orange-400" /> : null;
                          })()}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">{fact.title}</h3>
                          <p className="text-zinc-300 mb-4">{fact.content}</p>
                          
                          <div className="flex items-center gap-3 mb-4">
                            <Badge variant="outline" className="border-orange-600 text-orange-400">
                              {fact.category}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFactExpansion(index)}
                              className="text-orange-400 hover:text-orange-300 hover:bg-orange-600/20 p-2"
                            >
                              {expandedFacts.has(index) ? (
                                <>
                                  <ChevronUp className="w-4 h-4 mr-1" />
                                  Show Less
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4 mr-1" />
                                  Dive Deeper
                                </>
                              )}
                            </Button>
                          </div>

                          {expandedFacts.has(index) && (
                            <div className="space-y-4 mt-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                              {(() => {
                                const deepDive = getFactDeepDive(fact.title);
                                return (
                                  <>
                                    <div>
                                      <h4 className="text-orange-300 font-semibold mb-2 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        Deep Explanation
                                      </h4>
                                      <p className="text-zinc-300 text-sm leading-relaxed">{deepDive.explanation}</p>
                                    </div>

                                    <div>
                                      <h4 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
                                        <Lightbulb className="w-4 h-4" />
                                        Visual Understanding
                                      </h4>
                                      <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-3">
                                        <p className="text-blue-200 text-sm italic">{deepDive.visualDescription}</p>
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="text-green-300 font-semibold mb-2 flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Real Examples
                                      </h4>
                                      <div className="space-y-2">
                                        {deepDive.examples.map((example, exampleIndex) => (
                                          <div key={exampleIndex} className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                            <span className="text-green-200 text-sm">{example}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="text-purple-300 font-semibold mb-2 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" />
                                        Key Takeaways
                                      </h4>
                                      <div className="grid gap-2">
                                        {deepDive.keyTakeaways.map((takeaway, takeawayIndex) => (
                                          <div key={takeawayIndex} className="bg-purple-600/10 border border-purple-600/20 rounded-lg p-2">
                                            <span className="text-purple-200 text-sm font-medium">{takeaway}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {false && lesson && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-white">{lesson.title}</h2>
                      <Badge variant="outline" className="border-blue-600 text-blue-400">
                        {lesson.estimatedReadTime} min read
                      </Badge>
                    </div>
                    <div className="text-zinc-300 prose prose-invert max-w-none">
                      {lesson.content.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                    <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
                      <h4 className="text-blue-300 font-medium mb-2">Key Takeaway</h4>
                      <p className="text-blue-200 text-sm">{lesson.summary}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {learnSubTab === "reference" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Bitcoin Reference Guide</h2>
                  <p className="text-zinc-400">Essential terms, concepts, and the Bitcoin whitepaper</p>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Glossary Card */}
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-8 h-8 text-orange-400" />
                        <div>
                          <h3 className="text-xl font-bold text-white">Bitcoin Glossary</h3>
                          <p className="text-zinc-400">80+ essential Bitcoin terms</p>
                        </div>
                      </div>
                      <p className="text-zinc-300 mb-4">
                        Comprehensive definitions for all Bitcoin terminology, organized by category with interactive tooltips throughout the app.
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-orange-300">• Core Concepts</div>
                        <div className="text-blue-300">• Wallets & Security</div>
                        <div className="text-green-300">• Network & Mining</div>
                        <div className="text-purple-300">• Economics</div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Whitepaper Card */}
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <BookOpen className="w-8 h-8 text-orange-400" />
                        <div>
                          <h3 className="text-xl font-bold text-white">Bitcoin Whitepaper</h3>
                          <p className="text-zinc-400">Satoshi's original vision</p>
                        </div>
                      </div>
                      <p className="text-zinc-300 mb-4">
                        The foundational document that started it all. Read Satoshi Nakamoto's original Bitcoin paper with interactive explanations.
                      </p>
                      <div className="text-sm text-zinc-400">
                        Published October 31, 2008 • 9 pages • Revolutionary
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Reference */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Quick Reference</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-orange-300 font-medium">Key Numbers</h4>
                        <div className="text-sm text-zinc-300 space-y-1">
                          <div>• 21 million BTC max supply</div>
                          <div>• 10 minute block time</div>
                          <div>• 4 year halving cycle</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-blue-300 font-medium">Important Dates</h4>
                        <div className="text-sm text-zinc-300 space-y-1">
                          <div>• 2008: Whitepaper published</div>
                          <div>• 2009: Genesis block mined</div>
                          <div>• 2010: First transaction</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-green-300 font-medium">Core Principles</h4>
                        <div className="text-sm text-zinc-300 space-y-1">
                          <div>• Decentralization</div>
                          <div>• Proof of Work</div>
                          <div>• Digital scarcity</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {learnSubTab === "deepdive" && !selectedTopic && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Deep Dive Topics</h2>
                  <p className="text-zinc-400">Explore comprehensive lessons on advanced Bitcoin concepts</p>
                </div>
                
                <div className="grid gap-4">
                  {[
                    {
                    id: "whybtc",
                    title: "Why BTC and not Crypto?",
                    description: "Understanding why Bitcoin stands apart from the thousands of other cryptocurrencies and digital assets.",
                    topics: ["Network Effect", "Proof of Work Security", "Decentralization", "Store of Value"],
                    difficulty: "Beginner",
                    icon: <Gem className="w-8 h-8 text-orange-400" />,
                    content: "Bitcoin is fundamentally different from other cryptocurrencies due to its unique combination of properties. Unlike altcoins that often focus on features like smart contracts or faster transactions, Bitcoin prioritizes security, decentralization, and monetary soundness above all else.\n\nBitcoin has the strongest network effect - it's the most recognized, widely adopted, and liquid cryptocurrency. Its proof-of-work consensus mechanism provides unmatched security through energy expenditure, making it nearly impossible to attack or manipulate.\n\nMost importantly, Bitcoin has no central authority, founder, or company controlling it. It operates as pure digital money with a fixed supply cap of 21 million coins, making it the hardest money ever created."
                  },
                  {
                    id: "settlement",
                    title: "T+1 vs BTC Settlement",
                    description: "Comparing traditional financial settlement times with Bitcoin's instant final settlement.",
                    topics: ["Settlement Risk", "Counterparty Risk", "24/7 Operations", "Global Access"],
                    difficulty: "Beginner",
                    icon: <Clock className="w-8 h-8 text-blue-400" />,
                    content: "Traditional financial systems operate on T+1 (trade date plus one day) or even T+2 settlement, meaning your transaction isn't truly final for days. During this time, you face counterparty risk - the possibility that the other party won't fulfill their obligation.\n\nBitcoin transactions achieve final settlement in 10 minutes on average, with additional confirmations providing exponentially increasing security. There's no counterparty risk because the transaction is cryptographically secured and recorded on an immutable ledger.\n\nWhile traditional markets close on weekends and holidays, Bitcoin operates 24/7/365, allowing instant global value transfer at any time. This represents a fundamental improvement in how money moves."
                  },
                  {
                    id: "safety",
                    title: "Bitcoin Safety & Security",
                    description: "Essential security practices for safely storing and using Bitcoin without losing your funds.",
                    topics: ["Private Key Management", "Hardware Wallets", "Backup Strategies", "Common Scams"],
                    difficulty: "Beginner",
                    icon: <Shield className="w-8 h-8 text-green-400" />,
                    content: "Bitcoin security is entirely about controlling your private keys. 'Not your keys, not your coins' is the fundamental rule. Never share your private keys or seed phrases with anyone, and never store them digitally where they can be hacked.\n\nHardware wallets provide the best security by keeping your private keys offline. Always verify your seed phrase backup and test recovery before storing significant amounts. Use multiple backups stored in different secure locations.\n\nCommon scams include fake exchanges, phishing websites, and social engineering attacks. Always verify website URLs, never respond to unsolicited messages asking for your keys, and be extremely cautious of 'investment opportunities' promising guaranteed returns."
                  },
                  {
                    id: "hodl",
                    title: "Why HODL?",
                    description: "The investment philosophy behind holding Bitcoin long-term instead of trading.",
                    topics: ["Time Preference", "Volatility Management", "Dollar-Cost Averaging", "Wealth Preservation"],
                    difficulty: "Beginner",
                    icon: <TrendingUp className="w-8 h-8 text-purple-400" />,
                    content: "HODL (Hold On for Dear Life) represents a low time preference approach to Bitcoin investment. Rather than trying to time markets, HODLers focus on Bitcoin's long-term value proposition as digital gold and a hedge against monetary debasement.\n\nShort-term Bitcoin price movements are highly volatile and unpredictable. Professional traders often lose money trying to time markets. HODLing removes the stress and complexity of trading while allowing you to benefit from Bitcoin's long-term adoption trend.\n\nDollar-cost averaging (DCA) combined with HODLing helps smooth out volatility by buying consistently over time. This strategy has historically rewarded patient investors who understand Bitcoin's role as a superior store of value."
                  },
                  {
                    id: "wallets",
                    title: "Understanding Exchanges and Wallets",
                    description: "Key differences between custodial exchanges and self-custody wallets for Bitcoin storage.",
                    topics: ["Custodial vs Non-Custodial", "Exchange Risks", "Wallet Types", "Best Practices"],
                    difficulty: "Beginner",
                    icon: <CreditCard className="w-8 h-8 text-yellow-400" />,
                    content: "Exchanges are custodial services that hold your Bitcoin for you, similar to banks holding your dollars. While convenient for trading, they introduce counterparty risk - the exchange could be hacked, go bankrupt, or freeze your account.\n\nSelf-custody wallets give you direct control of your private keys. Software wallets (mobile/desktop apps) offer convenience, while hardware wallets provide maximum security by keeping keys offline. Paper wallets store keys on physical paper.\n\nBest practice is to use exchanges only for buying/selling, then immediately withdraw to your own wallet. For large amounts, hardware wallets are essential. Always research exchange reputation, security measures, and regulatory compliance before trusting them with your funds."
                  },
                  {
                    id: "blockchain",
                    title: "Blockchain Technology",
                    description: "Deep dive into how blockchain works, including cryptographic hashing, merkle trees, and consensus mechanisms.",
                    topics: ["Cryptographic Hashing", "Merkle Trees", "Consensus Mechanisms", "Block Structure"],
                    difficulty: "Advanced",
                    icon: <Network className="w-8 h-8 text-blue-400" />,
                    content: "Bitcoin's blockchain is a distributed ledger that maintains a continuously growing list of records (blocks) linked using cryptography. Each block contains a cryptographic hash of the previous block, timestamp, and transaction data.\n\nSHA-256 hashing ensures data integrity - any change to transaction data produces a completely different hash. Merkle trees efficiently summarize all transactions in a block, allowing quick verification without downloading the entire block.\n\nThe proof-of-work consensus mechanism ensures all network participants agree on transaction history without requiring trust in a central authority. Miners compete to solve cryptographic puzzles, with the winning miner adding the next block to the chain."
                  },
                  {
                    id: "mining",
                    title: "Proof of Work Mining",
                    description: "Understanding Bitcoin's security model through computational proof and mining economics.",
                    topics: ["Mining Process", "Difficulty Adjustment", "Energy Usage", "Security Guarantees"],
                    difficulty: "Intermediate",
                    icon: <Zap className="w-8 h-8 text-yellow-400" />,
                    content: "Bitcoin miners compete to solve cryptographic puzzles by finding a nonce that produces a hash with a specific number of leading zeros. This requires significant computational work, proving that energy was expended to secure the network.\n\nThe difficulty adjusts every 2016 blocks (approximately 2 weeks) to maintain a 10-minute average block time regardless of total network hash rate. This elegant mechanism ensures consistent block production as mining power fluctuates.\n\nEnergy consumption is a feature, not a bug - it makes Bitcoin attacks prohibitively expensive. The energy secures a monetary network worth over $1 trillion, comparable to the energy costs of traditional banking systems."
                  },
                  {
                    id: "cryptography",
                    title: "Digital Signatures & Cryptography",
                    description: "How Bitcoin ensures transaction authenticity through elliptic curve cryptography.",
                    topics: ["ECDSA", "Public Key Cryptography", "Transaction Signing", "Key Management"],
                    difficulty: "Advanced",
                    icon: <Shield className="w-8 h-8 text-green-400" />,
                    content: "Bitcoin uses Elliptic Curve Digital Signature Algorithm (ECDSA) to prove ownership of funds without revealing private keys. Your private key generates a unique public key, which creates your Bitcoin address.\n\nWhen spending Bitcoin, you create a digital signature using your private key. Anyone can verify this signature using your public key, proving you authorized the transaction without exposing sensitive information.\n\nThis cryptographic system enables trustless transactions - no need to trust the other party or a third-party intermediary. The mathematics guarantees that only the private key holder can create valid signatures for their Bitcoin."
                  },
                  {
                    id: "lightning",
                    title: "Lightning Network Scaling",
                    description: "Bitcoin's layer 2 scaling solution for instant, low-cost payments.",
                    topics: ["Payment Channels", "Routing", "Liquidity", "Channel Management"],
                    difficulty: "Advanced",
                    icon: <Zap className="w-8 h-8 text-purple-400" />,
                    content: "The Lightning Network enables near-instant Bitcoin transactions by creating payment channels between parties. Instead of broadcasting every transaction to the blockchain, parties can transact privately and only settle the final balance on-chain.\n\nPayments can route through multiple channels, allowing you to pay anyone on the network even without a direct channel. This creates a network effect where more participants increase connectivity and reduce routing costs.\n\nLightning preserves Bitcoin's core properties while enabling microtransactions and improved privacy. It represents Bitcoin's path to global payment adoption without compromising the base layer's security and decentralization."
                  },
                  {
                    id: "supply",
                    title: "Bitcoin's Fixed Supply",
                    description: "Why Bitcoin's 21 million coin limit makes it unique among monetary systems.",
                    topics: ["Halving Events", "Issuance Schedule", "Scarcity Economics", "Monetary Policy"],
                    difficulty: "Beginner",
                    icon: <Gem className="w-8 h-8 text-orange-400" />,
                    content: "Bitcoin's monetary policy is coded into the protocol: only 21 million Bitcoin will ever exist. New Bitcoin is created through mining rewards that halve every 210,000 blocks (approximately 4 years), creating a predictable, disinflationary issuance schedule.\n\nThis fixed supply makes Bitcoin fundamentally different from fiat currencies, which can be printed without limit. As demand increases while supply remains capped, Bitcoin naturally appreciates in value over time.\n\nThe halving events reduce the rate of new Bitcoin creation, making existing Bitcoin more scarce. This scheduled scarcity, combined with growing adoption, creates powerful economic incentives for long-term value appreciation."
                  },
                  {
                    id: "economics",
                    title: "Bitcoin Economics & Incentives",
                    description: "Understanding the economic game theory that makes Bitcoin work without central control.",
                    topics: ["Game Theory", "Economic Incentives", "Network Effects", "Adoption Curves"],
                    difficulty: "Intermediate",
                    icon: <BarChart3 className="w-8 h-8 text-green-400" />,
                    content: "Bitcoin's genius lies in aligning individual incentives with network security. Miners are rewarded for honest behavior and penalized for attacks through economic incentives rather than regulations or trust.\n\nNetwork effects make Bitcoin more valuable as more people use it. Each new user, merchant, or developer adds value to the entire network, creating a positive feedback loop that strengthens Bitcoin's position as digital money.\n\nThe adoption curve follows a predictable pattern: early adopters understand Bitcoin's technology, followed by investors recognizing its store of value properties, then mainstream adoption as it becomes easier to use and more widely accepted."
                  },
                  {
                    id: "banking",
                    title: "Bitcoin vs Traditional Banking",
                    description: "Comparing Bitcoin's peer-to-peer system with traditional financial intermediaries.",
                    topics: ["Intermediary Removal", "Censorship Resistance", "Global Access", "Permissionless Innovation"],
                    difficulty: "Beginner",
                    icon: <Building2 className="w-8 h-8 text-red-400" />,
                    content: "Traditional banking requires trusted intermediaries for every transaction - banks, payment processors, and clearinghouses all take fees and add delays. Bitcoin enables direct peer-to-peer transactions without intermediaries.\n\nBanks can freeze accounts, reverse transactions, or deny service based on their policies or government pressure. Bitcoin transactions are censorship-resistant - no one can stop you from sending or receiving Bitcoin if you control your private keys.\n\nBitcoin provides financial services to anyone with internet access, regardless of location, credit history, or documentation. This financial inclusion is especially powerful for the unbanked population in developing countries."
                  }
                ].map((topic, index) => (
                  <Card key={index} className="bg-zinc-900 border-zinc-800 hover:border-orange-600/50 transition-colors cursor-pointer" onClick={() => topic.id && setSelectedTopic(topic.id)}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-zinc-800 rounded-lg">
                          {topic.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-white">{topic.title}</h3>
                            <Badge 
                              variant="outline" 
                              className={`${
                                topic.difficulty === "Beginner" ? "border-green-600 text-green-400" :
                                topic.difficulty === "Intermediate" ? "border-yellow-600 text-yellow-400" :
                                "border-red-600 text-red-400"
                              }`}
                            >
                              {topic.difficulty}
                            </Badge>
                          </div>
                          <p className="text-zinc-300 mb-4">{topic.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {topic.topics.slice(0, 2).map((topicItem, topicIndex) => (
                                <Badge key={topicIndex} variant="secondary" className="bg-zinc-800 text-zinc-300 text-xs">
                                  {topicItem}
                                </Badge>
                              ))}
                              {topic.topics.length > 2 && (
                                <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 text-xs">
                                  +{topic.topics.length - 2} more
                                </Badge>
                              )}
                            </div>
                            <ArrowRight className="w-4 h-4 text-orange-400" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                </div>
              </div>
            )}

            {/* Selected Topic Detail View */}
            {learnSubTab === "deepdive" && selectedTopic && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedTopic(null)}
                    className="text-orange-400 hover:text-orange-300"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                    Back to Topics
                  </Button>
                </div>

                {(() => {
                  const topicContent = {
                    "whybtc": {
                      title: "Why BTC and not Crypto?",
                      subtitle: "Understanding Bitcoin's unique position in the cryptocurrency landscape",
                      content: `Bitcoin stands alone among thousands of cryptocurrencies for several critical reasons that make it fundamentally different from "crypto" as a category.

**Network Effects and First-Mover Advantage**
Bitcoin was the first successful cryptocurrency, launched in 2009. This head start has created powerful network effects - the more people use Bitcoin, the more valuable it becomes. Like the internet or telephone networks, Bitcoin's utility grows exponentially with adoption.

**True Decentralization**
Most cryptocurrencies are controlled by teams, companies, or foundations. Bitcoin has no central authority, CEO, or marketing department. Its creator, Satoshi Nakamoto, disappeared in 2011, leaving Bitcoin to operate as a truly decentralized network.

**Proven Security**
Bitcoin has operated continuously for over 15 years without a single hack of its base protocol. Its blockchain has never been successfully attacked, making it the most secure digital asset in existence.

**Digital Scarcity**
While other cryptocurrencies can increase their supply or change their rules, Bitcoin's 21 million coin limit is mathematically enforced. This makes it the first truly scarce digital asset in human history.

**Store of Value Properties**
Bitcoin focuses on being digital money and a store of value. Most other cryptocurrencies try to do many things (smart contracts, gaming, DeFi) but often sacrifice security and decentralization for features.`,
                      keyPoints: [
                        "Bitcoin is the most decentralized cryptocurrency with no central authority",
                        "15+ years of perfect uptime and security prove its resilience",
                        "Network effects make Bitcoin increasingly valuable as adoption grows",
                        "Fixed supply of 21 million coins creates true digital scarcity",
                        "Focus on money rather than features makes Bitcoin more reliable"
                      ]
                    },
                    "settlement": {
                      title: "T+1 vs BTC Settlement",
                      subtitle: "Comparing traditional finance settlement with Bitcoin's instant finality",
                      content: `Traditional financial systems operate on outdated settlement cycles that create inefficiency, risk, and delays. Bitcoin represents a revolutionary improvement in how value transfers are settled.

**Traditional T+1 Settlement**
In traditional finance, T+1 means "trade date plus one day." When you buy stocks, it takes one full business day for the trade to actually settle and for you to truly own the shares. This delay creates counterparty risk and ties up capital.

**The Hidden Costs of Delayed Settlement**
During the T+1 period, neither party truly owns the asset. Banks and brokers must hold collateral to cover potential defaults. This system requires massive amounts of capital sitting idle and creates systemic risk.

**Bitcoin's Revolutionary 10-Minute Settlement**
Bitcoin transactions settle approximately every 10 minutes when a new block is mined. Once your transaction is included in a block and confirmed, the transfer is final and irreversible. No waiting periods, no counterparty risk.

**True 24/7 Global Settlement**
Unlike traditional markets that close on weekends and holidays, Bitcoin operates 24/7/365. You can send value anywhere in the world at any time, and settlement happens on Bitcoin's schedule, not a bank's.

**Elimination of Intermediaries**
Bitcoin removes the need for clearinghouses, settlement banks, and custodians. You can directly own and transfer Bitcoin without relying on third parties to hold or move your assets.`,
                      keyPoints: [
                        "Traditional T+1 settlement creates delays and counterparty risk",
                        "Bitcoin settles transactions in ~10 minutes with mathematical finality",
                        "24/7 operation means no weekend or holiday delays",
                        "Direct ownership eliminates need for intermediary institutions",
                        "Faster settlement reduces capital requirements and systemic risk"
                      ]
                    },
                    "safety": {
                      title: "Bitcoin Safety & Security",
                      subtitle: "Essential practices for protecting your Bitcoin holdings",
                      content: `Bitcoin security is fundamentally different from traditional banking because you become your own bank. This gives you complete control but also complete responsibility for your funds.

**Private Keys: Your Digital Ownership**
Your Bitcoin is controlled by private keys - long strings of random numbers. Whoever controls the private keys controls the Bitcoin. Unlike bank accounts, there's no customer service to call if you lose access.

**Hardware Wallets: Maximum Security**
Hardware wallets like Ledger or Trezor store your private keys offline on dedicated devices. Even if your computer is compromised, your Bitcoin remains safe because the keys never leave the hardware device.

**Seed Phrases: Your Backup Plan**
When you create a wallet, you receive a 12 or 24-word seed phrase. This is your master backup - it can restore all your Bitcoin if your wallet is lost or damaged. Store it securely offline and never share it.

**Hot vs Cold Storage**
Hot wallets are connected to the internet for convenience but are more vulnerable. Cold storage keeps your keys completely offline. Most serious Bitcoin holders use cold storage for long-term savings and hot wallets for spending money.

**Common Security Mistakes to Avoid**
Never store Bitcoin on exchanges long-term, don't take photos of your seed phrase, avoid sharing wallet details online, and be wary of phishing attempts that try to steal your credentials.`,
                      keyPoints: [
                        "Private keys are the only way to control your Bitcoin",
                        "Hardware wallets provide the highest level of security",
                        "Seed phrases are your ultimate backup - store them safely offline",
                        "Use cold storage for savings, hot wallets for spending",
                        "Never store large amounts on exchanges or share sensitive information"
                      ]
                    },
                    "hodl": {
                      title: "Why HODL?",
                      subtitle: "Understanding the long-term investment philosophy behind Bitcoin",
                      content: `HODL (originally a misspelling of "hold") has become Bitcoin's core investment philosophy. It represents a fundamental shift from trading to long-term value accumulation based on Bitcoin's unique properties.

**Time Preference and Delayed Gratification**
HODLing is about lowering your time preference - choosing future wealth over immediate consumption. Bitcoin rewards patience because its supply is fixed while demand continues growing globally.

**Volatility is Feature, Not Bug**
Bitcoin's price volatility scares many investors, but HODLers understand that volatility decreases over longer time horizons. What matters isn't daily price movements but Bitcoin's long-term adoption trajectory.

**Network Effects Compound Over Time**
As more people, companies, and countries adopt Bitcoin, its utility and value increase exponentially. HODLers position themselves to benefit from this long-term network growth rather than trying to time short-term movements.

**Avoiding Trading Mistakes**
Studies show that most traders lose money trying to time the market. HODLing removes the emotional pressure to buy and sell at the right moments, reducing costly psychological mistakes.

**Bitcoin as Savings Technology**
Traditional savings accounts lose purchasing power to inflation. Bitcoin offers an alternative savings technology that has historically preserved and grown wealth over multi-year periods, despite short-term volatility.

**The Four-Year Cycle**
Bitcoin follows roughly four-year cycles related to its halving events. HODLers use this pattern to think in multi-year timeframes rather than daily or monthly price action.`,
                      keyPoints: [
                        "HODL represents long-term thinking over short-term trading",
                        "Bitcoin's volatility decreases over longer time periods",
                        "Network effects compound as global adoption increases",
                        "Most traders lose money - HODLing avoids timing mistakes",
                        "Bitcoin serves as superior savings technology vs traditional accounts"
                      ]
                    },
                    "wallets": {
                      title: "Understanding Exchanges and Wallets",
                      subtitle: "The critical difference between custody and self-custody",
                      content: `Understanding the difference between exchanges and wallets is crucial for Bitcoin security and ownership. The choice between them determines whether you truly own your Bitcoin or just have an IOU.

**Exchanges: Convenient but Custodial**
Cryptocurrency exchanges like Coinbase or Binance are convenient for buying Bitcoin, but they hold your Bitcoin in their wallets. You don't control the private keys, so you don't technically own the Bitcoin - you own a promise from the exchange.

**The "Not Your Keys, Not Your Coins" Principle**
This fundamental Bitcoin principle means that without private key control, you're trusting a third party with your money. Exchanges can freeze accounts, get hacked, or go bankrupt, potentially losing your Bitcoin forever.

**Self-Custody Wallets: True Ownership**
Wallets like Electrum, BlueWallet, or hardware wallets give you control of your private keys. This means you truly own your Bitcoin and can access it anytime without permission from any company or government.

**Hot Wallets vs Cold Storage**
Hot wallets are connected to the internet for convenience but carry security risks. Cold storage (hardware wallets or paper wallets) keeps your keys offline for maximum security but requires more steps for transactions.

**When to Use Each Option**
Use exchanges for buying/selling and small amounts for convenience. Use self-custody wallets for your long-term savings. Think of exchanges like carrying cash in your pocket - convenient but limited. Self-custody is like a safe at home.

**The Learning Curve Investment**
Self-custody requires learning new skills, but it's an investment in your financial sovereignty. Start with small amounts while learning, then gradually move to self-custody as you become comfortable.`,
                      keyPoints: [
                        "Exchanges hold your Bitcoin - you only have an IOU from them",
                        "Self-custody wallets give you true ownership via private keys",
                        "Use exchanges for trading, wallets for long-term storage",
                        "Hot wallets for convenience, cold storage for security",
                        "Learning self-custody is an investment in financial independence"
                      ]
                    },
                    "blockchain": {
                      title: "Blockchain Technology",
                      subtitle: "Deep dive into how blockchain works and ensures security",
                      content: `Bitcoin's blockchain is a revolutionary data structure that maintains a distributed ledger of all transactions without requiring trust in a central authority.

**What is a Blockchain?**
A blockchain is a chain of blocks, where each block contains a list of transactions. Blocks are linked together using cryptographic hashes, creating an immutable record that cannot be altered without detection.

**Cryptographic Hashing with SHA-256**
Bitcoin uses SHA-256 hashing to create unique digital fingerprints for each block. Any change to transaction data produces a completely different hash, making tampering immediately obvious to the network.

**Merkle Trees for Efficiency**
Bitcoin organizes transactions in each block using Merkle trees - a binary tree structure that allows efficient verification of any transaction without downloading the entire block. This enables lightweight clients to verify payments securely.

**Consensus Through Proof of Work**
The blockchain maintains consensus through proof of work mining. Miners compete to solve cryptographic puzzles, and the network accepts the longest valid chain as the truth. This prevents double-spending without central authority.

**Immutability Through Cryptographic Links**
Each block references the hash of the previous block, creating a chain where changing any historical transaction would require recalculating all subsequent blocks - computationally impossible due to the network's collective hash power.

**Distributed Network Security**
Bitcoin's blockchain is replicated across thousands of nodes worldwide. This distribution means there's no single point of failure, and the network remains operational even if many nodes go offline.`,
                      keyPoints: [
                        "Blockchain links blocks using cryptographic hashes for immutability",
                        "SHA-256 hashing creates unique fingerprints that detect any tampering",
                        "Merkle trees enable efficient transaction verification",
                        "Proof of work consensus eliminates need for central authority",
                        "Distributed across thousands of nodes prevents single points of failure"
                      ]
                    },
                    "mining": {
                      title: "Proof of Work Mining",
                      subtitle: "Understanding Bitcoin's security model through computational proof",
                      content: `Bitcoin mining is the process that secures the network and processes transactions. It's called "mining" because it releases new Bitcoin into circulation, similar to mining gold from the earth.

**The Mining Process**
Miners collect pending transactions into blocks and compete to solve a cryptographic puzzle. This puzzle requires finding a number (nonce) that, when combined with block data, produces a hash with a specific number of leading zeros.

**Difficulty Adjustment Mechanism**
Every 2016 blocks (approximately 2 weeks), Bitcoin automatically adjusts the mining difficulty to maintain a 10-minute average block time. If more miners join, difficulty increases. If miners leave, it decreases.

**Energy as Security**
The energy consumed in mining isn't waste - it's the cost of security. The more energy required to mine Bitcoin, the more expensive it becomes to attack the network. This energy creates Bitcoin's digital scarcity.

**Mining Economics and Incentives**
Miners are rewarded with newly minted Bitcoin plus transaction fees. This economic incentive ensures miners act honestly - attacking the network would be more expensive than supporting it.

**Hash Rate and Network Security**
Hash rate measures the total computational power securing Bitcoin. Higher hash rates mean greater security. Bitcoin's hash rate has grown exponentially, making it the most secure computer network ever created.

**The Halving Schedule**
Every 210,000 blocks (roughly 4 years), the mining reward halves. This programmed scarcity ensures Bitcoin's 21 million coin limit while gradually transitioning from inflation rewards to transaction fee incentives.`,
                      keyPoints: [
                        "Mining secures the network through computational proof of work",
                        "Difficulty adjusts automatically to maintain 10-minute block times",
                        "Energy consumption directly correlates to network security",
                        "Economic incentives align miner behavior with network health",
                        "Halving events gradually reduce inflation toward zero"
                      ]
                    },
                    "cryptography": {
                      title: "Digital Signatures & Cryptography",
                      subtitle: "How Bitcoin ensures transaction authenticity without revealing secrets",
                      content: `Bitcoin uses advanced cryptography to enable secure transactions between strangers without requiring trust or revealing sensitive information.

**Public-Key Cryptography Basics**
Bitcoin uses elliptic curve cryptography where each user has a private key (secret) and a public key (shareable). The private key can generate the public key, but the reverse is computationally impossible.

**Elliptic Curve Digital Signature Algorithm (ECDSA)**
When you send Bitcoin, you create a digital signature using your private key and the transaction details. This signature proves you authorized the transaction without revealing your private key.

**Address Generation Process**
Your Bitcoin address is derived from your public key through multiple hashing functions. This creates a shorter, more user-friendly identifier while maintaining security through one-way mathematical functions.

**Transaction Signing and Verification**
Every Bitcoin transaction includes digital signatures that can be verified by anyone using the sender's public key. This proves the transaction was authorized by the private key holder without exposing the private key.

**Cryptographic Security Assumptions**
Bitcoin's security relies on the discrete logarithm problem for elliptic curves being computationally infeasible. Even with quantum computers, breaking Bitcoin's cryptography would require machines far beyond current capabilities.

**Hash Functions and Data Integrity**
Bitcoin uses cryptographic hash functions (SHA-256) to create transaction IDs and link blocks. These functions are one-way, meaning you can't reverse them to find the original input, ensuring data integrity.`,
                      keyPoints: [
                        "Private keys enable spending, public keys enable verification",
                        "ECDSA allows proving authorization without revealing secrets",
                        "Bitcoin addresses are hashed public keys for user convenience",
                        "Digital signatures provide mathematical proof of transaction validity",
                        "Cryptographic assumptions ensure security against current and future attacks"
                      ]
                    },
                    "lightning": {
                      title: "Lightning Network Scaling",
                      subtitle: "Bitcoin's layer 2 solution for instant, low-cost payments",
                      content: `The Lightning Network is Bitcoin's solution for scaling to billions of users while maintaining the base layer's security and decentralization properties.

**Payment Channels Concept**
Lightning works by creating payment channels between two parties. They lock Bitcoin in a multi-signature address and can transact privately off-chain, only settling the final balance on Bitcoin's blockchain.

**Network Routing and Connectivity**
You don't need direct channels with everyone. Lightning routes payments through intermediate nodes, creating a network effect where connectivity improves as more participants join.

**Instant Settlement Benefits**
Lightning transactions settle instantly because they don't wait for blockchain confirmation. This enables micropayments, streaming money, and real-time value transfer previously impossible with traditional Bitcoin transactions.

**Liquidity and Channel Management**
Channels require liquidity on both sides to route payments in both directions. This creates a new economy of liquidity providers who earn fees for enabling payments across the network.

**Security Model and Trade-offs**
Lightning inherits Bitcoin's security while adding convenience. Channels are secured by Bitcoin's blockchain - if someone tries to cheat, the honest party can claim all channel funds using Bitcoin's smart contract capabilities.

**Scaling Without Compromise**
Lightning enables millions of transactions per second without increasing Bitcoin's base layer requirements. This preserves Bitcoin's decentralization while enabling global payment adoption.

**Privacy Improvements**
Lightning transactions are private by default. Only the sender, receiver, and routing nodes know payment details. This provides better privacy than on-chain Bitcoin transactions.`,
                      keyPoints: [
                        "Payment channels enable instant Bitcoin transactions off-chain",
                        "Network routing connects users without direct channel relationships",
                        "Micropayments become economical with minimal fees",
                        "Bitcoin's security protects Lightning channels from fraud",
                        "Scales to millions of transactions while preserving decentralization"
                      ]
                    },
                    "supply": {
                      title: "Bitcoin's Fixed Supply",
                      subtitle: "Why 21 million coins creates unprecedented digital scarcity",
                      content: `Bitcoin's fixed supply of 21 million coins represents a fundamental breakthrough in digital scarcity, creating the first truly limited digital asset in human history.

**The 21 Million Limit**
Bitcoin's protocol enforces a hard cap of 21 million coins. This limit is mathematically guaranteed by the code and cannot be changed without consensus from the entire network - something economically unlikely since it would devalue everyone's holdings.

**Programmed Issuance Schedule**
New Bitcoin is created through mining rewards that start at 50 BTC per block and halve every 210,000 blocks (approximately 4 years). This creates a predictable, disinflationary monetary policy coded into the protocol.

**Halving Events and Scarcity**
Each halving reduces the rate of new Bitcoin creation by 50%. This scheduled scarcity creates supply shocks that have historically driven price appreciation as demand continues growing while supply growth slows.

**Digital Scarcity vs Physical Assets**
Unlike gold or other scarce resources, Bitcoin's scarcity is mathematically provable and impossible to circumvent. You can't discover new Bitcoin deposits or increase production - the rules are fixed permanently.

**Monetary Policy Comparison**
Fiat currencies can be printed without limit, leading to inflation and wealth confiscation. Bitcoin's fixed supply makes it deflationary by design - as adoption grows, each unit becomes more valuable rather than less.

**Economic Incentives and HODLing**
Fixed supply creates powerful economic incentives for long-term holding. Unlike currencies that lose value over time, Bitcoin rewards patience and savings, encouraging low time preference behavior.

**Unit of Account Evolution**
As Bitcoin becomes scarcer, smaller units become more valuable. This drives the adoption of satoshis (1/100,000,000 BTC) as the standard unit, similar to how we measure gold in grams rather than kilograms.`,
                      keyPoints: [
                        "21 million coin limit is mathematically enforced by the protocol",
                        "Halving events create scheduled scarcity every four years",
                        "Digital scarcity is provable and impossible to circumvent",
                        "Fixed supply rewards saving rather than punishing it",
                        "Deflationary design contrasts sharply with inflationary fiat currencies"
                      ]
                    },
                    "economics": {
                      title: "Bitcoin Economics & Incentives",
                      subtitle: "Game theory that makes Bitcoin work without central control",
                      content: `Bitcoin's genius lies in its economic design that aligns individual incentives with network security and growth, creating a self-reinforcing system that strengthens over time.

**Game Theory and Nash Equilibrium**
Bitcoin creates a Nash equilibrium where the most profitable strategy for each participant (miners, users, developers) is to act honestly and support the network. Attacking Bitcoin costs more than supporting it.

**Miners' Economic Incentives**
Miners invest in expensive hardware and electricity to earn Bitcoin rewards. This investment aligns them with Bitcoin's success - if they attack the network, they destroy the value of their own rewards and equipment.

**Network Effects and Metcalfe's Law**
Bitcoin's value increases exponentially with the number of users (following Metcalfe's Law). Each new user, merchant, or service provider adds value to the entire network, creating positive feedback loops.

**Stock-to-Flow and Scarcity Value**
Bitcoin's stock-to-flow ratio (total supply divided by annual production) increases over time due to halvings. This growing scarcity, combined with increasing demand, creates upward pressure on price.

**Lindy Effect and Time Preference**
The longer Bitcoin survives, the longer it's expected to survive (Lindy Effect). This encourages long-term thinking and lower time preference behavior among participants.

**Adoption Curves and Network Growth**
Bitcoin follows predictable adoption curves seen in previous technologies. Early adopters understand the technology, followed by investors recognizing value, then mainstream adoption as usability improves.

**Economic Sovereignty Benefits**
Bitcoin enables individuals to opt out of traditional monetary systems. This creates economic incentives for adoption in countries with high inflation, capital controls, or political instability.

**Fee Market Development**
As block rewards decrease through halvings, transaction fees become increasingly important for miner incentives. This creates a fee market that ensures long-term network security.`,
                      keyPoints: [
                        "Game theory aligns individual incentives with network security",
                        "Network effects make Bitcoin more valuable as adoption grows",
                        "Stock-to-flow dynamics create increasing scarcity over time",
                        "Lindy Effect strengthens confidence as Bitcoin ages",
                        "Fee markets ensure long-term miner incentives beyond block rewards"
                      ]
                    },
                    "banking": {
                      title: "Bitcoin vs Traditional Banking",
                      subtitle: "Comparing peer-to-peer money with intermediary-based finance",
                      content: `Bitcoin represents a fundamental shift from intermediary-based finance to peer-to-peer value transfer, eliminating many problems inherent in traditional banking.

**Intermediary Removal Benefits**
Traditional payments require multiple intermediaries: banks, payment processors, clearinghouses, and correspondent banks. Each adds fees, delays, and potential failure points. Bitcoin enables direct peer-to-peer transactions.

**24/7 Global Operation**
Banks operate on business hours and close on weekends and holidays. Bitcoin operates 24/7/365, allowing global commerce to continue regardless of local banking schedules or time zones.

**Censorship Resistance**
Banks can freeze accounts, reverse transactions, or deny service based on policies or government pressure. Bitcoin transactions are censorship-resistant - no one can prevent you from sending or receiving Bitcoin.

**Financial Inclusion**
Traditional banking requires documentation, credit history, and minimum balances that exclude billions globally. Bitcoin only requires internet access, providing financial services to the unbanked.

**Permissionless Innovation**
Building on traditional banking requires regulatory approval and partnerships with existing institutions. Bitcoin enables permissionless innovation - anyone can build services without asking permission.

**Settlement Speed Comparison**
Bank wire transfers can take days and only work during business hours. Bitcoin transactions settle in minutes regardless of amount, distance, or time of day.

**Cost Structure Differences**
Traditional banking has high infrastructure costs passed to customers through fees. Bitcoin's decentralized structure eliminates many overhead costs, enabling lower-cost financial services.

**Sovereignty and Self-Custody**
Banks hold your money and can restrict access. Bitcoin enables true ownership where you control your funds directly through private keys, eliminating counterparty risk.`,
                      keyPoints: [
                        "Eliminates intermediaries and their associated fees and delays",
                        "Operates 24/7 globally without banking hour restrictions",
                        "Provides censorship-resistant transactions and financial sovereignty",
                        "Enables financial inclusion for the globally unbanked",
                        "Allows permissionless innovation without regulatory approval"
                      ]
                    }
                  };

                  const content = topicContent[selectedTopic as keyof typeof topicContent];
                  if (!content) return null;

                  return (
                    <Card className="bg-zinc-900 border-zinc-800">
                      <CardContent className="p-8">
                        <div className="space-y-6">
                          <div className="text-center space-y-2">
                            <h2 className="text-3xl font-bold text-white">{content.title}</h2>
                            <p className="text-zinc-400 text-lg">{content.subtitle}</p>
                          </div>

                          <div className="prose prose-zinc prose-invert max-w-none">
                            <div className="text-zinc-300 leading-relaxed whitespace-pre-line">
                              <AutoGlossary>{content.content}</AutoGlossary>
                            </div>
                          </div>

                          <div className="bg-orange-600/10 border border-orange-600/20 rounded-lg p-6">
                            <h4 className="text-orange-300 font-bold mb-4 flex items-center gap-2">
                              <CheckCircle className="w-5 h-5" />
                              Key Takeaways
                            </h4>
                            <ul className="space-y-3">
                              {content.keyPoints.map((point, index) => (
                                <li key={index} className="flex items-start gap-3 text-zinc-300">
                                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                            <Button 
                              variant="ghost" 
                              onClick={() => setSelectedTopic(null)}
                              className="text-orange-400 hover:text-orange-300"
                            >
                              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                              Back to All Topics
                            </Button>
                            <Badge variant="outline" className="border-green-600 text-green-400">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Lesson Complete
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })()}
              </div>
            )}

            {activeSection === "finance" && (
              <div className="space-y-8">
                {/* Opening Hook */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold text-white">
                          Your Money is Being Stolen
                        </h2>
                        <p className="text-zinc-300 text-lg max-w-3xl mx-auto leading-relaxed">
                          Every day you wait, your savings lose purchasing power. It's not your fault—the system is rigged. 
                          Central banks print money endlessly, devaluing your hard-earned dollars while the wealthy protect 
                          themselves with assets that can't be printed.
                        </p>
                      </div>
                      
                      {/* Simplified Facts Grid */}
                      <div className="grid gap-4 md:grid-cols-3 mt-8">
                        <div className="p-4 bg-green-950/50 rounded-xl border border-green-800/50">
                          <div className="text-green-300 font-bold text-xl">21 Million</div>
                          <div className="text-green-400/80 text-sm">Bitcoin's Fixed Supply</div>
                          <div className="text-zinc-400 text-xs mt-1">No central bank can print more</div>
                        </div>
                        
                        <div className="p-4 bg-blue-950/50 rounded-xl border border-blue-800/50">
                          <div className="text-blue-300 font-bold text-xl">100%</div>
                          <div className="text-blue-400/80 text-sm">You Own Your Bitcoin</div>
                          <div className="text-zinc-400 text-xs mt-1">No bank can freeze it</div>
                        </div>
                        
                        <div className="p-4 bg-orange-900/40 rounded-xl border border-orange-600/50">
                          <div className="text-orange-200 font-bold text-xl">Global</div>
                          <div className="text-orange-300/90 text-sm">24/7 Access</div>
                          <div className="text-zinc-400 text-xs mt-1">Send anywhere, anytime</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Simplified Money Supply Impact */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="space-y-6 p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* 1971 Gold Standard Era */}
                      <div className="p-6 bg-green-950/30 rounded-xl border border-green-800/50">
                        <div className="text-center space-y-4">
                          <div className="text-green-300 font-bold text-lg">1971: Gold Standard</div>
                          <div className="space-y-2">
                            <div className="text-green-200 text-4xl font-bold">$583B</div>
                            <div className="text-zinc-300 text-sm">Total US money supply</div>
                          </div>
                          <div className="text-zinc-400 text-xs p-3 bg-zinc-800/50 rounded-lg">
                            Money backed by gold. Limited printing.
                          </div>
                        </div>
                      </div>

                      {/* 2024 Fiat Era */}
                      <div className="p-6 bg-red-950/30 rounded-xl border border-red-800/50">
                        <div className="text-center space-y-4">
                          <div className="text-red-300 font-bold text-lg">2024: Fiat Money</div>
                          <div className="space-y-2">
                            <div className="text-red-200 text-4xl font-bold">$21T</div>
                            <div className="text-zinc-300 text-sm">Total US money supply</div>
                          </div>
                          <div className="text-zinc-400 text-xs p-3 bg-zinc-800/50 rounded-lg">
                            Money created from nothing. Unlimited printing.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Impact Stats */}
                    <div className="p-6 bg-zinc-800 rounded-xl">
                      <div className="text-center space-y-4">
                        <div className="text-orange-300 font-bold text-xl">The Devastating Result</div>
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="text-center">
                            <div className="text-orange-200 font-bold text-2xl">36x</div>
                            <div className="text-zinc-400 text-sm">Money supply growth</div>
                          </div>
                          <div className="text-center">
                            <div className="text-orange-200 font-bold text-2xl">96%</div>
                            <div className="text-zinc-400 text-sm">Purchasing power lost</div>
                          </div>
                          <div className="text-center">
                            <div className="text-orange-200 font-bold text-2xl">$25.43</div>
                            <div className="text-zinc-400 text-sm">What $1 from 1971 costs today</div>
                          </div>
                        </div>
                        <div className="text-zinc-300 text-sm max-w-2xl mx-auto pt-4 border-t border-zinc-700">
                          This is why your money buys less every year. This is why you need Bitcoin.
                        </div>
                      </div>
                    </div>

                    {/* CTA after shocking stats */}
                    <div className="text-center">
                      <button 
                        onClick={() => setActiveSection("learn")}
                        className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
                      >
                        Learn How Bitcoin Fixes This
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

                {disruptionSubTab === "comparison" && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-zinc-900 border-zinc-800">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                          {traditionalFinanceProblems.comparison.traditional.title}
                        </h3>
                        <div className="space-y-3">
                          {traditionalFinanceProblems.comparison.traditional.characteristics.map((char, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-zinc-800 rounded-lg">
                              <span className="text-zinc-300 font-medium">{char.aspect}</span>
                              <span className="text-red-300 text-sm">{char.value}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-zinc-900 border-zinc-800">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <div className="w-4 h-4 bg-orange-600 rounded-full"></div>
                          {traditionalFinanceProblems.comparison.bitcoin.title}
                        </h3>
                        <div className="space-y-3">
                          {traditionalFinanceProblems.comparison.bitcoin.characteristics.map((char, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-zinc-800 rounded-lg">
                              <span className="text-zinc-300 font-medium">{char.aspect}</span>
                              <span className="text-green-300 text-sm">{char.value}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {disruptionSubTab === "future" && (
                  <div className="space-y-6">
                    {traditionalFinanceProblems.future.map((period, index) => (
                      <Card key={index} className="bg-zinc-900 border-zinc-800">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <Clock className="w-6 h-6 text-blue-400" />
                              <h4 className="text-xl font-bold text-white">{period.timeframe}</h4>
                            </div>
                            
                            <div className="grid gap-3">
                              {period.developments.map((development, devIndex) => (
                                <div key={devIndex} className="flex items-start gap-3 p-3 bg-zinc-800 rounded-lg">
                                  <ArrowRight className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-zinc-300">{development}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {false && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Bitcoin Glossary</h2>
                  <p className="text-zinc-400">Essential terminology for understanding Bitcoin and cryptocurrency</p>
                </div>

                {/* Core Concepts */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
                      <Bitcoin className="w-5 h-5" />
                      Core Bitcoin Concepts
                    </h3>
                    <div className="grid gap-4">
                      <div>
                        <h4 className="text-white font-semibold mb-1"><BitcoinTerm term="Bitcoin">Bitcoin</BitcoinTerm></h4>
                        <p className="text-zinc-300 text-sm">A decentralized digital currency that operates on a peer-to-peer network without banks or governments, using cryptography for security.</p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1"><BitcoinTerm term="blockchain">Blockchain</BitcoinTerm></h4>
                        <p className="text-zinc-300 text-sm">A distributed ledger that records all Bitcoin transactions in chronological order, secured by cryptography and maintained by thousands of computers worldwide.</p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1"><BitcoinTerm term="cryptocurrency">Cryptocurrency</BitcoinTerm></h4>
                        <p className="text-zinc-300 text-sm">Digital or virtual currency secured by cryptography, making it nearly impossible to counterfeit or double-spend.</p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1"><BitcoinTerm term="satoshi">Satoshi</BitcoinTerm></h4>
                        <p className="text-zinc-300 text-sm">The smallest unit of Bitcoin (0.00000001 BTC). Named after Bitcoin's creator, like cents to dollars.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Wallets & Security */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Wallets & Security
                    </h3>
                    <div className="grid gap-4">
                      <div>
                        <h4 className="text-white font-semibold mb-1"><BitcoinTerm term="wallet">Wallet</BitcoinTerm></h4>
                        <p className="text-zinc-300 text-sm">Software or hardware that stores your Bitcoin private keys and allows you to send and receive Bitcoin.</p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1"><BitcoinTerm term="private key">Private Key</BitcoinTerm></h4>
                        <p className="text-zinc-300 text-sm">A secret code that grants access to Bitcoin in a wallet. Like a password, it must be kept secure and never shared.</p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1"><BitcoinTerm term="seed phrase">Seed Phrase</BitcoinTerm></h4>
                        <p className="text-zinc-300 text-sm">12-24 words that can restore your entire Bitcoin wallet. Must be kept secret and backed up safely.</p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1"><BitcoinTerm term="cold storage">Cold Storage</BitcoinTerm></h4>
                        <p className="text-zinc-300 text-sm">Keeping Bitcoin private keys completely offline (like on a hardware wallet) to protect from online threats.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Network & Mining */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                      <Network className="w-5 h-5" />
                      Network & Mining
                    </h3>
                    <div className="grid gap-4">
                      <div>
                        <h4 className="text-white font-semibold mb-1"><BitcoinTerm term="mining">Mining</BitcoinTerm></h4>
                        <p className="text-zinc-300 text-sm">The process of using computer power to secure the Bitcoin network, validate transactions, and solve computational puzzles for rewards.</p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1"><BitcoinTerm term="node">Node</BitcoinTerm></h4>
                        <p className="text-zinc-300 text-sm">A computer that maintains a copy of the Bitcoin blockchain and helps validate transactions across the network.</p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1"><BitcoinTerm term="proof of work">Proof of Work</BitcoinTerm></h4>
                        <p className="text-zinc-300 text-sm">Bitcoin's security mechanism where miners compete to solve mathematical puzzles, proving they've invested computational energy.</p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1"><BitcoinTerm term="halving">Halving</BitcoinTerm></h4>
                        <p className="text-zinc-300 text-sm">An event reducing mining reward by half, occurs approximately every 4 years to control Bitcoin supply.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Transactions */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                      <ArrowRight className="w-5 h-5" />
                      Transactions & Blocks
                    </h3>
                    <div className="grid gap-4">
                      <div>
                        <h4 className="text-white font-semibold mb-1"><BitcoinTerm term="transaction">Transaction</BitcoinTerm></h4>
                        <p className="text-zinc-300 text-sm">A transfer of Bitcoin from one address to another, recorded permanently on the blockchain.</p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1"><BitcoinTerm term="block">Block</BitcoinTerm></h4>
                        <p className="text-zinc-300 text-sm">A group of transactions bundled together and added to the blockchain approximately every 10 minutes.</p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1"><BitcoinTerm term="confirmation">Confirmation</BitcoinTerm></h4>
                        <p className="text-zinc-300 text-sm">When a transaction is included in a block and added to the blockchain. More confirmations mean more security.</p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1"><BitcoinTerm term="fee">Fee</BitcoinTerm></h4>
                        <p className="text-zinc-300 text-sm">A small amount paid to miners to prioritize including your transaction in the next block.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Economics & Investment */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Economics & Investment
                    </h3>
                    <div className="grid gap-4">
                      <div>
                        <h4 className="text-white font-semibold mb-1"><BitcoinTerm term="HODL">HODL</BitcoinTerm></h4>
                        <p className="text-zinc-300 text-sm">A misspelling of 'hold' that became popular Bitcoin slang, meaning to keep Bitcoin long-term rather than selling.</p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1"><BitcoinTerm term="DCA">DCA (Dollar-Cost Averaging)</BitcoinTerm></h4>
                        <p className="text-zinc-300 text-sm">Investment strategy of buying fixed dollar amounts regularly regardless of price.</p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1"><BitcoinTerm term="volatility">Volatility</BitcoinTerm></h4>
                        <p className="text-zinc-300 text-sm">How much Bitcoin's price fluctuates. High volatility means large price swings up and down.</p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1"><BitcoinTerm term="store of value">Store of Value</BitcoinTerm></h4>
                        <p className="text-zinc-300 text-sm">An asset that maintains its worth over time. Bitcoin is often called 'digital gold' for this property.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Properties */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Key Properties
                    </h3>
                    <div className="grid gap-4">
                      <div>
                        <h4 className="text-white font-semibold mb-1"><BitcoinTerm term="decentralized">Decentralized</BitcoinTerm></h4>
                        <p className="text-zinc-300 text-sm">No single point of control. Bitcoin operates across thousands of computers worldwide with no central authority.</p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1"><BitcoinTerm term="trustless">Trustless</BitcoinTerm></h4>
                        <p className="text-zinc-300 text-sm">System that works without requiring trust in any central authority or counterparty.</p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1"><BitcoinTerm term="permissionless">Permissionless</BitcoinTerm></h4>
                        <p className="text-zinc-300 text-sm">Anyone can use Bitcoin without asking permission from any authority.</p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1"><BitcoinTerm term="immutable">Immutable</BitcoinTerm></h4>
                        <p className="text-zinc-300 text-sm">Cannot be changed or altered. Bitcoin transaction history is immutable once confirmed.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-orange-600/10 border border-orange-600/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-orange-400 mt-0.5" />
                    <div>
                      <h4 className="text-orange-300 font-medium mb-2">Interactive Glossary</h4>
                      <p className="text-orange-200 text-sm">
                        Throughout this app, Bitcoin terms are highlighted with dotted underlines. Hover over any highlighted term to see its definition instantly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {learnSubTab === "stories" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Real Bitcoin Stories</h2>
                  <p className="text-zinc-400">Discover why real people, businesses, and nations choose Bitcoin</p>
                </div>

                {/* Category Navigation */}
                <div className="bg-zinc-800/30 rounded-lg p-1 flex justify-center">
                  <div className="flex gap-1">
                    <Button
                      variant={storiesSubTab === "individuals" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setStoriesSubTab("individuals")}
                      className="text-xs px-3 py-1"
                    >
                      <UserIcon className="w-3 h-3 mr-1" />
                      Individuals
                    </Button>
                    <Button
                      variant={storiesSubTab === "businesses" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setStoriesSubTab("businesses")}
                      className="text-xs px-3 py-1"
                    >
                      <Building2 className="w-3 h-3 mr-1" />
                      Businesses
                    </Button>
                    <Button
                      variant={storiesSubTab === "nations" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setStoriesSubTab("nations")}
                      className="text-xs px-3 py-1"
                    >
                      <Globe className="w-3 h-3 mr-1" />
                      Nations
                    </Button>
                  </div>
                </div>

                {/* Stories Content */}
                <div className="grid gap-6">
                  {userProfiles[storiesSubTab].map((profile, index) => (
                    <Card key={index} className="bg-zinc-900 border-zinc-800">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-orange-600/20 rounded-lg flex-shrink-0">
                              {storiesSubTab === "individuals" && <UserIcon className="w-8 h-8 text-orange-400" />}
                              {storiesSubTab === "businesses" && <Building2 className="w-8 h-8 text-orange-400" />}
                              {storiesSubTab === "nations" && <Globe className="w-8 h-8 text-orange-400" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold text-white">{profile.name}</h3>
                              <p className="text-orange-400 font-medium">{profile.role}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <p className="text-zinc-300 leading-relaxed">{profile.story}</p>
                            
                            <div className="bg-zinc-800/50 rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-orange-600/20 rounded-lg flex-shrink-0">
                                  <Lightbulb className="w-5 h-5 text-orange-400" />
                                </div>
                                <div>
                                  <h4 className="text-orange-300 font-medium mb-1">Why Bitcoin?</h4>
                                  <p className="text-orange-200 text-sm">{profile.reason}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Practice Section */}
        {activeSection === "practice" && (
          <div className="space-y-6">

            {practiceSubTab === "safety" && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-600/20 rounded-lg">
                        <Shield className="w-8 h-8 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">Wallet Safety Simulator</h3>
                        <p className="text-zinc-300 mb-4">Learn how different wallet types protect your Bitcoin and practice secure storage</p>
                      </div>
                    </div>
                    
                    <div className="grid gap-6">
                      <div className="space-y-4">
                        <h4 className="text-white font-semibold">Choose Your Wallet Type</h4>
                        
                        <div className="grid gap-4">
                          {['exchange', 'hot', 'hardware'].map((type) => (
                            <Card 
                              key={type}
                              className={`cursor-pointer transition-all ${
                                simulatorInputs.safety.walletType === type 
                                  ? 'bg-green-600/20 border-green-600' 
                                  : 'bg-zinc-800 border-zinc-700 hover:border-zinc-600'
                              }`}
                              onClick={() => setSimulatorInputs(prev => ({
                                ...prev,
                                safety: { ...prev.safety, walletType: type as 'exchange' | 'hot' | 'hardware' }
                              }))}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <div className={`p-2 rounded-lg ${
                                    type === 'exchange' ? 'bg-red-600/20' :
                                    type === 'hot' ? 'bg-yellow-600/20' : 'bg-green-600/20'
                                  }`}>
                                    {type === 'exchange' && <Building2 className="w-5 h-5 text-red-400" />}
                                    {type === 'hot' && <Globe className="w-5 h-5 text-yellow-400" />}
                                    {type === 'hardware' && <Shield className="w-5 h-5 text-green-400" />}
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="text-white font-medium">
                                      {type === 'exchange' && 'Exchange Wallet (Coinbase, Binance)'}
                                      {type === 'hot' && 'Hot Wallet (Mobile/Desktop App)'}
                                      {type === 'hardware' && 'Hardware Wallet (Ledger, Trezor)'}
                                    </h5>
                                    <p className="text-zinc-400 text-sm mt-1">
                                      {type === 'exchange' && 'Convenient but you don\'t control your keys. Exchange holds your Bitcoin.'}
                                      {type === 'hot' && 'You control keys but connected to internet. Good for small amounts.'}
                                      {type === 'hardware' && 'Maximum security. Keys stored offline on dedicated device.'}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <span className="text-xs font-medium">Security Level:</span>
                                      <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((level) => (
                                          <div
                                            key={level}
                                            className={`w-2 h-2 rounded-full ${
                                              level <= (type === 'exchange' ? 2 : type === 'hot' ? 3 : 5)
                                                ? (type === 'exchange' ? 'bg-red-400' : type === 'hot' ? 'bg-yellow-400' : 'bg-green-400')
                                                : 'bg-zinc-600'
                                            }`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-white font-semibold">Security Assessment</h4>
                        {(() => {
                          const walletType = simulatorInputs.safety.walletType;
                          const risks = {
                            exchange: [
                              'Exchange can freeze your account',
                              'Exchange could get hacked',
                              'Exchange could go bankrupt',
                              'You don\'t own the private keys',
                              'Withdrawal limits and delays'
                            ],
                            hot: [
                              'Device could get malware/virus',
                              'Private keys stored on internet-connected device',
                              'Risk of phishing attacks',
                              'Backup seed phrase could be compromised'
                            ],
                            hardware: [
                              'Physical device could be lost or damaged',
                              'Need to secure backup seed phrase',
                              'Less convenient for frequent transactions'
                            ]
                          };
                          
                          const benefits = {
                            exchange: [
                              'Very convenient to use',
                              'Easy to buy/sell Bitcoin',
                              'No need to manage keys',
                              'Customer support available'
                            ],
                            hot: [
                              'You control your private keys',
                              'Quick access for transactions',
                              'Good balance of security and convenience',
                              'Can use anywhere with internet'
                            ],
                            hardware: [
                              'Maximum security for Bitcoin storage',
                              'Private keys never touch the internet',
                              'Protection against malware and hacking',
                              'Long-term cold storage solution'
                            ]
                          };
                          
                          return (
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-4">
                                <h5 className="text-red-300 font-medium mb-3 flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4" />
                                  Risks
                                </h5>
                                <ul className="space-y-2">
                                  {risks[walletType].map((risk, index) => (
                                    <li key={index} className="text-red-200 text-sm flex items-start gap-2">
                                      <div className="w-1 h-1 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                                      {risk}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-4">
                                <h5 className="text-green-300 font-medium mb-3 flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4" />
                                  Benefits
                                </h5>
                                <ul className="space-y-2">
                                  {benefits[walletType].map((benefit, index) => (
                                    <li key={index} className="text-green-200 text-sm flex items-start gap-2">
                                      <div className="w-1 h-1 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                                      {benefit}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                      
                      <div className="bg-orange-600/10 border border-orange-600/20 rounded-lg p-4">
                        <h5 className="text-orange-300 font-medium mb-3">Best Practice Recommendation</h5>
                        <p className="text-orange-200 text-sm leading-relaxed">
                          {simulatorInputs.safety.walletType === 'exchange' && 
                            "For beginners: Start with small amounts on exchanges to learn, but move to self-custody as you accumulate more Bitcoin. Never store large amounts long-term on exchanges."
                          }
                          {simulatorInputs.safety.walletType === 'hot' && 
                            "Good middle ground: Use hot wallets for spending money (like a checking account) but move larger savings to hardware wallets for long-term storage."
                          }
                          {simulatorInputs.safety.walletType === 'hardware' && 
                            "Excellent choice for savings: Hardware wallets are the gold standard for Bitcoin storage. Always buy directly from manufacturers and verify the device hasn't been tampered with."
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {practiceSubTab === "transactions" && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-600/20 rounded-lg">
                        <ArrowRight className="w-8 h-8 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">Transaction Simulator</h3>
                        <p className="text-zinc-300 mb-4">Practice sending Bitcoin transactions and understand fees, confirmations, and security</p>
                      </div>
                    </div>
                    
                    <div className="grid gap-6">
                      <div className="space-y-4">
                        <h4 className="text-white font-semibold">Transaction Setup</h4>
                        
                        <div className="grid gap-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-zinc-300 text-sm block mb-2">Amount to Send (BTC)</label>
                              <input
                                type="number"
                                step="0.00001"
                                value={simulatorInputs.transaction.amount}
                                onChange={(e) => setSimulatorInputs(prev => ({
                                  ...prev,
                                  transaction: { ...prev.transaction, amount: Number(e.target.value) }
                                }))}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                              />
                            </div>
                            
                            <div>
                              <label className="text-zinc-300 text-sm block mb-2">Fee Priority</label>
                              <select
                                value={simulatorInputs.transaction.feeLevel}
                                onChange={(e) => setSimulatorInputs(prev => ({
                                  ...prev,
                                  transaction: { ...prev.transaction, feeLevel: e.target.value as 'low' | 'medium' | 'high' }
                                }))}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                              >
                                <option value="low">Low (1-3 hours)</option>
                                <option value="medium">Medium (10-30 minutes)</option>
                                <option value="high">High (Next block ~10 min)</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <h5 className="text-white font-medium">Wallet Addresses</h5>
                            <div className="grid gap-3">
                              <div className="bg-zinc-800 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-zinc-400 text-sm">From (Your Wallet)</span>
                                  <span className="text-green-400 text-xs bg-green-600/20 px-2 py-1 rounded">Verified</span>
                                </div>
                                <div className="font-mono text-sm text-white break-all">
                                  bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                                </div>
                                <div className="text-zinc-400 text-xs mt-1">Balance: 0.15420000 BTC</div>
                              </div>
                              
                              <div className="bg-zinc-800 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-zinc-400 text-sm">To (Recipient)</span>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="h-6 text-xs border-zinc-600"
                                    onClick={() => {
                                      const addresses = [
                                        "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
                                        "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
                                        "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                                      ];
                                      const randomAddr = addresses[Math.floor(Math.random() * addresses.length)];
                                      document.getElementById('recipient-addr').textContent = randomAddr;
                                    }}
                                  >
                                    Generate
                                  </Button>
                                </div>
                                <div id="recipient-addr" className="font-mono text-sm text-white break-all">
                                  3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy
                                </div>
                                <div className="text-zinc-400 text-xs mt-1">Click Generate to simulate different addresses</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-white font-semibold">Transaction Preview & Signing</h4>
                        <div className="bg-zinc-800 rounded-lg p-4 space-y-4">
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <div className="text-zinc-400 text-sm">Sending</div>
                              <div className="text-orange-400 font-mono">{simulatorInputs.transaction.amount} BTC</div>
                            </div>
                            <div>
                              <div className="text-zinc-400 text-sm">Network Fee</div>
                              <div className="text-yellow-400 font-mono">
                                {(() => {
                                  const feeRates = { low: 5, medium: 15, high: 30 };
                                  const feeSats = feeRates[simulatorInputs.transaction.feeLevel] * 250;
                                  return `${feeSats} sats (~$${(feeSats / 100000000 * 100000).toFixed(2)})`;
                                })()}
                              </div>
                            </div>
                            <div>
                              <div className="text-zinc-400 text-sm">Expected Time</div>
                              <div className="text-green-400 font-mono">
                                {(() => {
                                  const times = { low: "1-3 hours", medium: "10-30 minutes", high: "~10 minutes" };
                                  return times[simulatorInputs.transaction.feeLevel];
                                })()}
                              </div>
                            </div>
                          </div>
                          
                          {txStatus === 'preview' && (
                            <div className="space-y-4">
                              <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
                                <h5 className="text-blue-300 font-medium mb-2">Transaction Summary</h5>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-zinc-400">Total Amount:</span>
                                    <span className="text-white font-mono">{(simulatorInputs.transaction.amount + 0.00001).toFixed(8)} BTC</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-400">Remaining Balance:</span>
                                    <span className="text-white font-mono">{(0.154 - simulatorInputs.transaction.amount).toFixed(8)} BTC</span>
                                  </div>
                                </div>
                              </div>
                              
                              <Button 
                                onClick={() => {
                                  setTxStatus('signing');
                                  setCurrentStep(0);
                                  setTimeout(() => setCurrentStep(1), 1000);
                                  setTimeout(() => setCurrentStep(2), 2500);
                                  setTimeout(() => setCurrentStep(3), 4000);
                                  setTimeout(() => setCurrentStep(4), 6000);
                                  setTimeout(() => setTxStatus('completed'), 8000);
                                }}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                                disabled={simulatorInputs.transaction.amount <= 0 || simulatorInputs.transaction.amount > 0.154}
                              >
                                <ArrowRight className="w-4 h-4 mr-2" />
                                Sign & Send Transaction
                              </Button>
                            </div>
                          )}
                          
                          {txStatus === 'signing' && (
                            <div className="space-y-4">
                              <div className="bg-orange-600/10 border border-orange-600/20 rounded-lg p-4">
                                <h5 className="text-orange-300 font-medium mb-3 flex items-center gap-2">
                                  <ArrowRight className="w-4 h-4" />
                                  Wallet Signing Process
                                </h5>
                                <div className="space-y-3">
                                  {[
                                    { step: 0, label: "Creating transaction", desc: "Building transaction with inputs and outputs" },
                                    { step: 1, label: "Hardware wallet confirmation", desc: "Verify transaction details on device screen" },
                                    { step: 2, label: "Signing with private key", desc: "Cryptographically signing transaction" },
                                    { step: 3, label: "Broadcasting to network", desc: "Sending to Bitcoin mempool" },
                                    { step: 4, label: "Waiting for confirmation", desc: "Transaction included in block" }
                                  ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                        currentStep > item.step ? 'bg-green-600 text-white' :
                                        currentStep === item.step ? 'bg-orange-600 text-white animate-pulse' :
                                        'bg-zinc-600 text-zinc-400'
                                      }`}>
                                        {currentStep > item.step ? '✓' : index + 1}
                                      </div>
                                      <div>
                                        <div className={`text-sm font-medium ${
                                          currentStep >= item.step ? 'text-white' : 'text-zinc-400'
                                        }`}>
                                          {item.label}
                                        </div>
                                        <div className={`text-xs ${
                                          currentStep >= item.step ? 'text-zinc-300' : 'text-zinc-500'
                                        }`}>
                                          {item.desc}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {txStatus === 'completed' && (
                            <div className="space-y-4">
                              <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-4">
                                <h5 className="text-green-300 font-medium mb-3 flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4" />
                                  Transaction Confirmed!
                                </h5>
                                <div className="space-y-3">
                                  <div className="bg-zinc-900 rounded p-3">
                                    <div className="text-zinc-400 text-xs mb-1">Transaction ID (TXID)</div>
                                    <div className="font-mono text-xs text-white break-all">
                                      a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <div className="text-zinc-400">Block Height</div>
                                      <div className="text-white font-mono">867,420</div>
                                    </div>
                                    <div>
                                      <div className="text-zinc-400">Confirmations</div>
                                      <div className="text-green-400 font-mono">1/6</div>
                                    </div>
                                  </div>
                                  <div className="text-xs text-zinc-400">
                                    Transaction is now permanently recorded on the Bitcoin blockchain. 
                                    6 confirmations recommended for large amounts.
                                  </div>
                                </div>
                              </div>
                              
                              <Button 
                                onClick={() => {
                                  setTxStatus('preview');
                                  setCurrentStep(0);
                                }}
                                variant="outline"
                                className="w-full border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                              >
                                Try Another Transaction
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="border-t border-zinc-700 pt-4">
                        <h5 className="text-white font-medium mb-2">Transaction Journey</h5>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                            <div>
                              <div className="text-white text-sm font-medium">Broadcast to Network</div>
                              <div className="text-zinc-400 text-xs">Your transaction is sent to Bitcoin nodes worldwide</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                            <div>
                              <div className="text-white text-sm font-medium">Mempool Queue</div>
                              <div className="text-zinc-400 text-xs">Waits with other transactions to be included in a block</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                            <div>
                              <div className="text-white text-sm font-medium">Block Confirmation</div>
                              <div className="text-zinc-400 text-xs">Miner includes your transaction in the next block</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>
                            <div>
                              <div className="text-white text-sm font-medium">Final Settlement</div>
                              <div className="text-zinc-400 text-xs">Transaction is permanently recorded on the blockchain</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {practiceSubTab === "hodl" && (
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
                                  ${hodlResults.hodlValue.toLocaleString()}
                                </div>
                                <div className="text-sm text-zinc-400">HODL Strategy</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-red-400">
                                  ${hodlResults.tradingValue.toLocaleString()}
                                </div>
                                <div className="text-sm text-zinc-400">Active Trading</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-orange-400">
                                  +{hodlResults.hodlAdvantage.toFixed(0)}%
                                </div>
                                <div className="text-sm text-zinc-400">HODL Advantage</div>
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

            {practiceSubTab === "dca" && (
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
                                <div className="text-zinc-400 text-sm">Average Purchase Price</div>
                                <div className="text-purple-400 font-mono">${results.averagePrice}</div>
                              </div>
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">Final Portfolio Value</div>
                                <div className="text-green-400 font-mono">${results.finalValue}</div>
                              </div>
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">Total Return</div>
                                <div className={`font-mono ${Number(results.totalReturn) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  ${results.totalReturn} ({results.returnPercentage}%)
                                </div>
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

            {practiceSubTab === "hodl" && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-purple-600/20 rounded-lg">
                        <Gem className="w-8 h-8 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">HODLing vs Trading Strategy</h3>
                        <p className="text-zinc-300 mb-4">Compare the long-term results of holding Bitcoin versus active trading</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-white font-semibold">Strategy Parameters</h4>
                        
                        <div>
                          <label className="text-zinc-300 text-sm block mb-2">Initial Investment ($)</label>
                          <input
                            type="number"
                            value={simulatorInputs.hodl.initialAmount}
                            onChange={(e) => setSimulatorInputs(prev => ({
                              ...prev,
                              hodl: { ...prev.hodl, initialAmount: Number(e.target.value) }
                            }))}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="text-zinc-300 text-sm block mb-2">Time Period (Years)</label>
                          <input
                            type="number"
                            value={simulatorInputs.hodl.years}
                            onChange={(e) => setSimulatorInputs(prev => ({
                              ...prev,
                              hodl: { ...prev.hodl, years: Number(e.target.value) }
                            }))}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="text-zinc-300 text-sm block mb-2">Market Volatility Level</label>
                          <select
                            value={simulatorInputs.hodl.volatilityLevel}
                            onChange={(e) => setSimulatorInputs(prev => ({
                              ...prev,
                              hodl: { ...prev.hodl, volatilityLevel: e.target.value as 'low' | 'medium' | 'high' }
                            }))}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                          >
                            <option value="low">Low Volatility Period</option>
                            <option value="medium">Medium Volatility Period</option>
                            <option value="high">High Volatility Period</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-white font-semibold">Strategy Results</h4>
                        {(() => {
                          const results = calculateHODL(
                            Number(simulatorInputs.hodl.initialAmount),
                            Number(simulatorInputs.hodl.years),
                            0.25
                          );
                          return (
                            <div className="space-y-3">
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">Strategy</div>
                                <div className="text-purple-400 font-mono">{results.strategy}</div>
                              </div>
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">Bitcoin Accumulated</div>
                                <div className="text-orange-400 font-mono">{results.initialBtc} BTC</div>
                              </div>
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">Final Portfolio Value</div>
                                <div className="text-green-400 font-mono">${results.finalValue}</div>
                              </div>
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">Total Return</div>
                                <div className="text-blue-400 font-mono">+{results.returnPercentage}%</div>
                              </div>
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">vs Traditional Savings (2%)</div>
                                <div className="text-yellow-400 font-mono">${results.savingsComparison.traditionalSavings}</div>
                                <div className="text-green-300 text-xs">BTC Advantage: +${results.savingsComparison.btcAdvantage}</div>
                              </div>
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">Bitcoin Acquired</div>
                                <div className="text-orange-400 font-mono">{results.initialBtc} BTC</div>
                              </div>
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">Final Value</div>
                                <div className="text-green-400 font-mono">${results.finalValue}</div>
                              </div>
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">Total Return</div>
                                <div className={`font-mono ${Number(results.totalReturn) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  ${results.totalReturn} ({results.returnPercentage}%)
                                </div>
                              </div>
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">Volatility Impact</div>
                                <div className="text-yellow-400 font-mono capitalize">{results.volatilityImpact}</div>
                              </div>
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">Time Horizon</div>
                                <div className="text-blue-400 font-mono">{results.timeHorizon} years</div>
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

            {practiceSubTab === "safety" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Wallet Safety Guide</h2>
                  <p className="text-zinc-400">Essential security practices to protect your Bitcoin</p>
                </div>

                {/* Private Key Security */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                      <KeyRound className="w-5 h-5" />
                      Private Key Security
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-4">
                        <h4 className="text-red-300 font-medium mb-3">⚠️ Critical Rules</h4>
                        <ul className="space-y-2 text-red-200 text-sm">
                          <li>• <BitcoinTerm term="private key">Never share your private keys</BitcoinTerm> with anyone, ever</li>
                          <li>• <BitcoinTerm term="seed phrase">Never enter your seed phrase</BitcoinTerm> on any website or app</li>
                          <li>• Never store private keys in cloud storage or email</li>
                          <li>• Never take photos of your seed phrase</li>
                          <li>• Not your keys, not your coins - always control your own keys</li>
                        </ul>
                      </div>

                      <div className="grid gap-4">
                        <div className="border border-zinc-700 rounded-lg p-4">
                          <h4 className="text-white font-semibold mb-2">✅ Secure Storage Methods</h4>
                          <ul className="space-y-2 text-zinc-300 text-sm">
                            <li>• Write <BitcoinTerm term="seed phrase">seed phrases</BitcoinTerm> on metal backup plates</li>
                            <li>• Use multiple physical locations for backups</li>
                            <li>• Consider <BitcoinTerm term="multisig">multisig</BitcoinTerm> wallets for large amounts</li>
                            <li>• Use <BitcoinTerm term="cold storage">hardware wallets</BitcoinTerm> for long-term storage</li>
                          </ul>
                        </div>

                        <div className="border border-zinc-700 rounded-lg p-4">
                          <h4 className="text-white font-semibold mb-2">❌ What NOT to Do</h4>
                          <ul className="space-y-2 text-zinc-300 text-sm">
                            <li>• Don't use brain wallets or simple passphrases</li>
                            <li>• Don't generate keys on internet-connected devices</li>
                            <li>• Don't use wallets from unknown developers</li>
                            <li>• Don't store large amounts on <BitcoinTerm term="exchange">exchanges</BitcoinTerm></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Wallet Types */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Wallet Types & Security Levels
                    </h3>
                    <div className="grid gap-4">
                      <div className="border border-green-600/30 bg-green-600/5 rounded-lg p-4">
                        <h4 className="text-green-300 font-semibold mb-2">🔒 Hardware Wallets (Most Secure)</h4>
                        <p className="text-zinc-300 text-sm mb-2">Physical devices that store private keys offline</p>
                        <ul className="space-y-1 text-zinc-400 text-sm">
                          <li>• Examples: Ledger, Trezor, Coldcard</li>
                          <li>• Best for: Long-term storage, large amounts</li>
                          <li>• Pros: Offline storage, immune to malware</li>
                          <li>• Cons: Cost, learning curve</li>
                        </ul>
                      </div>

                      <div className="border border-yellow-600/30 bg-yellow-600/5 rounded-lg p-4">
                        <h4 className="text-yellow-300 font-semibold mb-2">📱 Mobile Wallets (Medium Security)</h4>
                        <p className="text-zinc-300 text-sm mb-2">Apps on your smartphone for daily use</p>
                        <ul className="space-y-1 text-zinc-400 text-sm">
                          <li>• Examples: Blue Wallet, Electrum, Phoenix</li>
                          <li>• Best for: Small amounts, daily transactions</li>
                          <li>• Pros: Convenient, quick access</li>
                          <li>• Cons: Online, vulnerable to phone theft</li>
                        </ul>
                      </div>

                      <div className="border border-red-600/30 bg-red-600/5 rounded-lg p-4">
                        <h4 className="text-red-300 font-semibold mb-2">🌐 Exchange Wallets (Least Secure)</h4>
                        <p className="text-zinc-300 text-sm mb-2">Wallets controlled by cryptocurrency exchanges</p>
                        <ul className="space-y-1 text-zinc-400 text-sm">
                          <li>• Examples: Coinbase, Binance, Kraken</li>
                          <li>• Best for: Active trading only</li>
                          <li>• Pros: Easy to use, integrated trading</li>
                          <li>• Cons: You don't control keys, hacking risk</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Common Scams */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Common Bitcoin Scams to Avoid
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-orange-600/10 border border-orange-600/20 rounded-lg p-4">
                        <h4 className="text-orange-300 font-medium mb-3">🎣 Phishing Attacks</h4>
                        <p className="text-orange-200 text-sm mb-2">Fake websites and emails trying to steal your credentials</p>
                        <ul className="space-y-1 text-orange-200 text-sm">
                          <li>• Always double-check website URLs</li>
                          <li>• Bookmark legitimate wallet sites</li>
                          <li>• Never click links in suspicious emails</li>
                          <li>• Look for HTTPS and correct spelling</li>
                        </ul>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="border border-zinc-700 rounded-lg p-4">
                          <h4 className="text-white font-semibold mb-2">💰 Fake Giveaways</h4>
                          <p className="text-zinc-300 text-sm">
                            "Send 1 BTC, get 2 BTC back!" - These are always scams. No legitimate person or company gives away free Bitcoin.
                          </p>
                        </div>

                        <div className="border border-zinc-700 rounded-lg p-4">
                          <h4 className="text-white font-semibold mb-2">💕 Romance Scams</h4>
                          <p className="text-zinc-300 text-sm">
                            Online dating profiles that eventually ask for Bitcoin. Real relationships don't involve cryptocurrency demands.
                          </p>
                        </div>

                        <div className="border border-zinc-700 rounded-lg p-4">
                          <h4 className="text-white font-semibold mb-2">🏦 Fake Support</h4>
                          <p className="text-zinc-300 text-sm">
                            Scammers impersonating wallet or exchange support. Real support never asks for private keys or seed phrases.
                          </p>
                        </div>

                        <div className="border border-zinc-700 rounded-lg p-4">
                          <h4 className="text-white font-semibold mb-2">💎 Ponzi Schemes</h4>
                          <p className="text-zinc-300 text-sm">
                            "Guaranteed returns" or "Bitcoin doubling" programs. Legitimate investments carry risk and don't guarantee profits.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Checklist */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Bitcoin Security Checklist
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="text-white font-semibold">Wallet Security</h4>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-zinc-300">
                            <input type="checkbox" className="rounded border-zinc-600 bg-zinc-800" />
                            <span className="text-sm">Using a reputable wallet</span>
                          </label>
                          <label className="flex items-center gap-2 text-zinc-300">
                            <input type="checkbox" className="rounded border-zinc-600 bg-zinc-800" />
                            <span className="text-sm">Backed up seed phrase securely</span>
                          </label>
                          <label className="flex items-center gap-2 text-zinc-300">
                            <input type="checkbox" className="rounded border-zinc-600 bg-zinc-800" />
                            <span className="text-sm">Using strong, unique passwords</span>
                          </label>
                          <label className="flex items-center gap-2 text-zinc-300">
                            <input type="checkbox" className="rounded border-zinc-600 bg-zinc-800" />
                            <span className="text-sm">Enabled 2FA where possible</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-white font-semibold">General Security</h4>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-zinc-300">
                            <input type="checkbox" className="rounded border-zinc-600 bg-zinc-800" />
                            <span className="text-sm">Keep software updated</span>
                          </label>
                          <label className="flex items-center gap-2 text-zinc-300">
                            <input type="checkbox" className="rounded border-zinc-600 bg-zinc-800" />
                            <span className="text-sm">Using secure internet connections</span>
                          </label>
                          <label className="flex items-center gap-2 text-zinc-300">
                            <input type="checkbox" className="rounded border-zinc-600 bg-zinc-800" />
                            <span className="text-sm">Never sharing private information</span>
                          </label>
                          <label className="flex items-center gap-2 text-zinc-300">
                            <input type="checkbox" className="rounded border-zinc-600 bg-zinc-800" />
                            <span className="text-sm">Verifying all transactions</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-blue-300 font-medium mb-2">Remember: You Are Your Own Bank</h4>
                      <p className="text-blue-200 text-sm">
                        With Bitcoin, you have complete control over your money, but that also means complete responsibility for its security. Take time to learn proper security practices - your future self will thank you.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(practiceSubTab === "transactions" || practiceSubTab === "halving") && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-orange-600/20 rounded-lg">
                        <Zap className="w-8 h-8 text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {practiceSubTab === "transactions" ? "Transaction Builder" : "Halving Impact Simulator"}
                        </h3>
                        <p className="text-zinc-300 mb-4">
                          {practiceSubTab === "transactions" 
                            ? "Build and understand Bitcoin transactions with fees and confirmations" 
                            : "Explore how Bitcoin halving events affect supply and mining rewards"
                          }
                        </p>
                        <div className="flex items-center gap-4 mb-4">
                          <Badge variant="outline" className="border-zinc-700 text-orange-400">
                            {practiceSubTab === "transactions" ? "Advanced" : "Intermediate"}
                          </Badge>
                          <span className="text-zinc-400 text-sm">
                            {practiceSubTab === "transactions" ? "15-20 minutes" : "10-15 minutes"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
                      <p className="text-blue-200 text-sm">
                        Advanced {practiceSubTab === "transactions" ? "transaction building" : "halving impact"} simulator 
                        coming soon with interactive blockchain visualizations and real network data.
                      </p>
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

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Bitcoin Store</h2>
              <p className="text-zinc-400">Essential hardware, books, and gear for your Bitcoin journey</p>
            </div>
                
                {/* Store Categories */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  
                  {/* Hardware Wallets */}
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-600/20 rounded-lg">
                            <Shield className="w-6 h-6 text-orange-400" />
                          </div>
                          <h3 className="text-lg font-bold text-white">Hardware Wallets</h3>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="border border-zinc-700 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-white">Ledger Nano X</h4>
                              <span className="text-orange-400 font-bold">$149</span>
                            </div>
                            <p className="text-zinc-400 text-sm mb-3">Bluetooth-enabled hardware wallet with mobile app support. Store 100+ cryptocurrencies securely.</p>
                            <Button 
                              size="sm" 
                              className="w-full bg-orange-600 hover:bg-orange-700"
                              onClick={() => window.open('https://shop.ledger.com/products/ledger-nano-x?r=btcjourney', '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-2" />
                              Buy Now
                            </Button>
                          </div>
                          
                          <div className="border border-zinc-700 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-white">Trezor Model T</h4>
                              <span className="text-orange-400 font-bold">$219</span>
                            </div>
                            <p className="text-zinc-400 text-sm mb-3">Premium hardware wallet with touchscreen interface. Open-source and highly secure.</p>
                            <Button 
                              size="sm" 
                              className="w-full bg-orange-600 hover:bg-orange-700"
                              onClick={() => window.open('https://trezor.io/trezor-model-t?offer_id=35&aff_id=10388', '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-2" />
                              Buy Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Books */}
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-600/20 rounded-lg">
                            <BookOpen className="w-6 h-6 text-blue-400" />
                          </div>
                          <h3 className="text-lg font-bold text-white">Essential Books</h3>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="border border-zinc-700 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-white">Broken Money</h4>
                              <span className="text-orange-400 font-bold">$18</span>
                            </div>
                            <p className="text-zinc-400 text-sm mb-1">by Lyn Alden</p>
                            <p className="text-zinc-400 text-sm mb-3">Deep dive into monetary history and Bitcoin's role in fixing our broken financial system.</p>
                            <Button 
                              size="sm" 
                              className="w-full bg-orange-600 hover:bg-orange-700"
                              onClick={() => window.open('https://amzn.to/3broken-money-lyn-alden', '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-2" />
                              Buy Now
                            </Button>
                          </div>
                          
                          <div className="border border-zinc-700 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-white">The Bitcoin Standard</h4>
                              <span className="text-orange-400 font-bold">$15</span>
                            </div>
                            <p className="text-zinc-400 text-sm mb-1">by Saifedean Ammous</p>
                            <p className="text-zinc-400 text-sm mb-3">The definitive book on Bitcoin's economic properties and sound money principles.</p>
                            <Button 
                              size="sm" 
                              className="w-full bg-orange-600 hover:bg-orange-700"
                              onClick={() => window.open('https://amzn.to/bitcoin-standard-ammous', '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-2" />
                              Buy Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Merchandise & Gear */}
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-600/20 rounded-lg">
                            <ShoppingCart className="w-6 h-6 text-green-400" />
                          </div>
                          <h3 className="text-lg font-bold text-white">Bitcoin Gear</h3>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="border border-zinc-700 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-white">Bitcoin Logo T-Shirt</h4>
                              <span className="text-orange-400 font-bold">$25</span>
                            </div>
                            <p className="text-zinc-400 text-sm mb-3">Premium cotton tee with classic Bitcoin logo. Available in multiple colors and sizes.</p>
                            <Button 
                              size="sm" 
                              className="w-full bg-orange-600 hover:bg-orange-700"
                              onClick={() => window.open('https://shop.bitcoin.com/btc-t-shirt?ref=btcjourney', '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-2" />
                              Buy Now
                            </Button>
                          </div>
                          
                          <div className="border border-zinc-700 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-white">Cold Storage Kit</h4>
                              <span className="text-orange-400 font-bold">$39</span>
                            </div>
                            <p className="text-zinc-400 text-sm mb-3">Complete kit for offline Bitcoin storage with steel plates and engraving tools.</p>
                            <Button 
                              size="sm" 
                              className="w-full bg-orange-600 hover:bg-orange-700"
                              onClick={() => window.open('https://coldbitcoin.com/storage-kit?affiliate=btcjourney', '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-2" />
                              Buy Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Affiliate Disclosure */}
                <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 text-center">
                  <p className="text-zinc-400 text-sm">
                    <AlertTriangle className="w-4 h-4 inline mr-2" />
                    As an Amazon Associate and affiliate partner, BTC Journey earns from qualifying purchases. This helps support our educational mission while providing you with the best Bitcoin resources.
                  </p>
                </div>
                
                <div className="flex space-x-2 mb-6 justify-center flex-wrap gap-2">
                  <Button
                    variant={convictionSubTab === "whitepaper" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setConvictionSubTab("whitepaper")}
                    className="text-sm"
                  >
                    <FileText className="w-3 h-3 mr-2" />
                    White Paper
                  </Button>
                  <Button
                    variant={convictionSubTab === "books" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setConvictionSubTab("books")}
                    className="text-sm"
                  >
                    <BookOpen className="w-3 h-3 mr-2" />
                    Books
                  </Button>
                  <Button
                    variant={convictionSubTab === "videos" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setConvictionSubTab("videos")}
                    className="text-sm"
                  >
                    <Play className="w-3 h-3 mr-2" />
                    Videos
                  </Button>
                </div>

                {convictionSubTab === "whitepaper" && (
                  <div className="space-y-6">
                    <Card className="bg-zinc-900 border-zinc-800">
                      <CardContent className="p-6">
                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-600/20 rounded-lg">
                              <FileText className="w-8 h-8 text-orange-400" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">Bitcoin: A Peer-to-Peer Electronic Cash System</h3>
                              <p className="text-zinc-400">By Satoshi Nakamoto • October 31, 2008</p>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <p className="text-zinc-300">
                              <AutoGlossary>The original Bitcoin white paper that started the cryptocurrency revolution. This foundational document outlines the design of a purely peer-to-peer version of electronic cash.</AutoGlossary>
                            </p>
                            
                            <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
                              <h4 className="text-blue-300 font-medium mb-3">Abstract</h4>
                              <p className="text-blue-200 text-sm leading-relaxed">
                                <AutoGlossary>A purely peer-to-peer version of electronic cash would allow online payments to be sent directly from one party to another without going through a financial institution. Digital signatures provide part of the solution, but the main benefits are lost if a trusted third party is still required to prevent double-spending. We propose a solution to the double-spending problem using a peer-to-peer network.</AutoGlossary>
                              </p>
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-white font-semibold">1. Introduction</h4>
                              <p className="text-zinc-300 text-sm leading-relaxed">
                                <AutoGlossary>Commerce on the Internet has come to rely almost exclusively on financial institutions serving as trusted third parties to process electronic payments. While the system works well enough for most transactions, it still suffers from the inherent weaknesses of the trust based model. Completely non-reversible transactions are not really possible, since financial institutions cannot avoid mediating disputes.</AutoGlossary>
                              </p>
                              <p className="text-zinc-300 text-sm leading-relaxed">
                                <AutoGlossary>What is needed is an electronic payment system based on cryptographic proof instead of trust, allowing any two willing parties to transact directly with each other without the need for a trusted third party. Transactions that are computationally impractical to reverse would protect sellers from fraud, and routine escrow mechanisms could easily be implemented to protect buyers.</AutoGlossary>
                              </p>
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-white font-semibold">2. Transactions</h4>
                              <p className="text-zinc-300 text-sm leading-relaxed">
                                <AutoGlossary>We define an electronic coin as a chain of digital signatures. Each owner transfers the coin to the next by digitally signing a hash of the previous transaction and the public key of the next owner and adding these to the end of the coin. A payee can verify the signatures to verify the chain of ownership.</AutoGlossary>
                              </p>
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-white font-semibold">3. Timestamp Server</h4>
                              <p className="text-zinc-300 text-sm leading-relaxed">
                                <AutoGlossary>The solution we propose begins with a timestamp server. A timestamp server works by taking a hash of a block of items to be timestamped and widely publishing the hash. The timestamp proves that the data must have existed at the time, obviously, in order to get into the hash.</AutoGlossary>
                              </p>
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-white font-semibold">4. Proof-of-Work</h4>
                              <p className="text-zinc-300 text-sm leading-relaxed">
                                <AutoGlossary>To implement a distributed timestamp server on a peer-to-peer basis, we will need to use a proof-of-work system similar to Adam Back's Hashcash, rather than newspaper or Usenet posts. The proof-of-work involves scanning for a value that when hashed, such as with SHA-256, the hash begins with a number of zero bits.</AutoGlossary>
                              </p>
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-white font-semibold">5. Network</h4>
                              <p className="text-zinc-300 text-sm leading-relaxed">
                                <AutoGlossary>The steps to run the network are as follows: 1) New transactions are broadcast to all nodes. 2) Each node collects new transactions into a block. 3) Each node works on finding a difficult proof-of-work for its block. 4) When a node finds a proof-of-work, it broadcasts the block to all nodes. 5) Nodes accept the block only if all transactions in it are valid and not already spent. 6) Nodes express their acceptance of the block by working on creating the next block in the chain, using the hash of the accepted block as the previous hash.</AutoGlossary>
                              </p>
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-white font-semibold">6. Incentive</h4>
                              <p className="text-zinc-300 text-sm leading-relaxed">
                                <AutoGlossary>By convention, the first transaction in a block is a special transaction that starts a new coin owned by the creator of the block. This adds an incentive for nodes to support the network, and provides a way to initially distribute coins into circulation, since there is no central authority to issue them.</AutoGlossary>
                              </p>
                            </div>

                            <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-4">
                              <h4 className="text-green-300 font-medium mb-3">Key Innovations</h4>
                              <ul className="space-y-2 text-green-200 text-sm">
                                <li>• <BitcoinTerm term="peer-to-peer">Peer-to-peer</BitcoinTerm> electronic cash without financial institutions</li>
                                <li>• <BitcoinTerm term="digital signature">Digital signatures</BitcoinTerm> for secure ownership transfers</li>
                                <li>• <BitcoinTerm term="proof of work">Proof-of-work</BitcoinTerm> to prevent <BitcoinTerm term="double spending">double-spending</BitcoinTerm></li>
                                <li>• <BitcoinTerm term="consensus">Consensus</BitcoinTerm> through the longest chain of blocks</li>
                                <li>• Economic incentives for <BitcoinTerm term="miners">miners</BitcoinTerm> to secure the network</li>
                              </ul>
                            </div>

                            <div className="bg-orange-600/10 border border-orange-600/20 rounded-lg p-4">
                              <h4 className="text-orange-300 font-medium mb-3">Historical Significance</h4>
                              <p className="text-orange-200 text-sm">
                                This 9-page document solved the decades-old computer science problem of achieving consensus in a distributed system without a central authority. It launched the <BitcoinTerm term="cryptocurrency">cryptocurrency</BitcoinTerm> revolution and created the foundation for <BitcoinTerm term="decentralized">decentralized</BitcoinTerm> digital money.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {false && (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-bold text-white">BTC Journey Store</h2>
                      <p className="text-zinc-400">Essential Bitcoin books and hardware for your journey</p>
                    </div>

                    {/* Hardware Wallets */}
                    <Card className="bg-zinc-900 border-zinc-800">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
                          <Shield className="w-5 h-5" />
                          Hardware Wallets - Secure Your Bitcoin
                        </h3>
                        <div className="grid gap-6">
                          <div className="border border-zinc-700 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="text-white font-semibold text-lg">Ledger Nano X</h4>
                                <p className="text-zinc-400">Industry-leading hardware wallet</p>
                              </div>
                              <div className="text-right">
                                <p className="text-orange-400 font-bold text-lg">$149</p>
                                <p className="text-zinc-500 text-sm">Free shipping</p>
                              </div>
                            </div>
                            <p className="text-zinc-300 mb-4">Bluetooth-enabled hardware wallet supporting 5,500+ cryptocurrencies. Secure chip technology and mobile app integration.</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge variant="secondary" className="bg-green-600/20 text-green-400">Bluetooth</Badge>
                              <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">Mobile App</Badge>
                              <Badge variant="secondary" className="bg-purple-600/20 text-purple-400">5,500+ Coins</Badge>
                            </div>
                            <Button className="w-full bg-orange-600 hover:bg-orange-700">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Buy on Ledger (Affiliate Link)
                            </Button>
                          </div>

                          <div className="border border-zinc-700 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="text-white font-semibold text-lg">Trezor Model T</h4>
                                <p className="text-zinc-400">Touchscreen hardware wallet</p>
                              </div>
                              <div className="text-right">
                                <p className="text-orange-400 font-bold text-lg">$219</p>
                                <p className="text-zinc-500 text-sm">Free shipping</p>
                              </div>
                            </div>
                            <p className="text-zinc-300 mb-4">Premium hardware wallet with color touchscreen. Open-source firmware and advanced security features.</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge variant="secondary" className="bg-green-600/20 text-green-400">Touchscreen</Badge>
                              <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">Open Source</Badge>
                              <Badge variant="secondary" className="bg-purple-600/20 text-purple-400">1,000+ Coins</Badge>
                            </div>
                            <Button className="w-full bg-orange-600 hover:bg-orange-700">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Buy on Trezor (Affiliate Link)
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Essential Books */}
                    <Card className="bg-zinc-900 border-zinc-800">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                          <BookOpen className="w-5 h-5" />
                          Essential Bitcoin Books
                        </h3>
                        <div className="grid gap-6">
                          <div className="border border-zinc-700 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="text-white font-semibold text-lg">Broken Money by Lyn Alden</h4>
                                <p className="text-zinc-400">Why Our Financial System is Failing Us</p>
                              </div>
                              <div className="text-right">
                                <p className="text-orange-400 font-bold text-lg">$24.99</p>
                                <Badge variant="outline" className="border-green-600 text-green-400 mt-1">Beginner</Badge>
                              </div>
                            </div>
                            <p className="text-zinc-300 mb-4">Comprehensive analysis of monetary history and why Bitcoin represents a return to sound money principles. Perfect for understanding the "why" behind Bitcoin.</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">Monetary History</Badge>
                              <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">Economics</Badge>
                              <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">Sound Money</Badge>
                            </div>
                            <Button className="w-full bg-orange-600 hover:bg-orange-700">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Buy on Amazon (Affiliate Link)
                            </Button>
                          </div>

                          <div className="border border-zinc-700 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="text-white font-semibold text-lg">The Bitcoin Standard by Saifedean Ammous</h4>
                                <p className="text-zinc-400">The Decentralized Alternative to Central Banking</p>
                              </div>
                              <div className="text-right">
                                <p className="text-orange-400 font-bold text-lg">$19.99</p>
                                <Badge variant="outline" className="border-yellow-600 text-yellow-400 mt-1">Intermediate</Badge>
                              </div>
                            </div>
                            <p className="text-zinc-300 mb-4">Classic introduction to Bitcoin's economic properties and historical context of money. Essential reading for understanding Bitcoin as digital gold.</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">Austrian Economics</Badge>
                              <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">Store of Value</Badge>
                              <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">History</Badge>
                            </div>
                            <Button className="w-full bg-orange-600 hover:bg-orange-700">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Buy on Amazon (Affiliate Link)
                            </Button>
                          </div>

                          <div className="border border-zinc-700 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="text-white font-semibold text-lg">The Fiat Standard by Saifedean Ammous</h4>
                                <p className="text-zinc-400">The Debt Slavery Alternative to Human Civilization</p>
                              </div>
                              <div className="text-right">
                                <p className="text-orange-400 font-bold text-lg">$22.99</p>
                                <Badge variant="outline" className="border-red-600 text-red-400 mt-1">Advanced</Badge>
                              </div>
                            </div>
                            <p className="text-zinc-300 mb-4">Deep dive into the problems with the current fiat monetary system and how it affects society, culture, and human flourishing.</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">Fiat Problems</Badge>
                              <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">Society</Badge>
                              <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">Civilization</Badge>
                            </div>
                            <Button className="w-full bg-orange-600 hover:bg-orange-700">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Buy on Amazon (Affiliate Link)
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="bg-orange-600/10 border border-orange-600/20 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-orange-400 mt-0.5" />
                        <div>
                          <h4 className="text-orange-300 font-medium mb-2">Affiliate Disclosure</h4>
                          <p className="text-orange-200 text-sm">
                            As an Amazon Associate and affiliate partner, BTC Journey earns from qualifying purchases. This helps support our educational mission while providing you with the best Bitcoin resources.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {convictionSubTab === "videos" && (
                  <div className="grid gap-6">
                    {convictionContent.videos.map((video, index) => (
                      <Card key={index} className="bg-zinc-900 border-zinc-800">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-red-600/20 rounded-lg">
                                <Play className="w-8 h-8 text-red-400" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-white">{video.title}</h3>
                                <p className="text-zinc-400">{video.speaker} • {video.duration}</p>
                                <Badge variant="outline" className="border-zinc-700 text-zinc-400 mt-2">
                                  {video.type}
                                </Badge>
                              </div>
                            </div>
                            
                            <p className="text-zinc-300">{video.description}</p>
                            
                            <Button variant="outline" className="w-full" asChild>
                              <a href={video.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Watch Video
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}