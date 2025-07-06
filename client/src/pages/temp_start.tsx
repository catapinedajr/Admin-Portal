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
