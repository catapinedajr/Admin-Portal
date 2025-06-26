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
  Building2,
  AlertTriangle,
  Heart,
  Play,
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
  Clock
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
      role: "Software Engineer",
      story: "Started buying Bitcoin in 2017 to protect savings from inflation. Now uses it for international remittances to family.",
      reason: "Hedge against currency debasement and easier cross-border payments"
    },
    {
      name: "Miguel Rodriguez", 
      role: "Small Business Owner",
      story: "Accepts Bitcoin payments at his restaurant to avoid high credit card fees and attract tech-savvy customers.",
      reason: "Lower transaction fees and financial sovereignty"
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

type MainSection = "foundation" | "practice" | "inspiration";
type FoundationSubTab = "today" | "explore" | "disruption" | "glossary";
type PracticeSubTab = "mining" | "transactions" | "hodl" | "dca" | "halving";
type InspirationSubTab = "stories" | "conviction";
type DisruptionSubTab = "problems" | "solutions" | "comparison" | "future";
type StoriesSubTab = "individuals" | "businesses" | "nations";
type ConvictionSubTab = "whitepaper" | "books" | "videos";

export default function Home() {
  const [activeSection, setActiveSection] = useState<MainSection>("foundation");
  const [foundationSubTab, setFoundationSubTab] = useState<FoundationSubTab>("today");
  const [practiceSubTab, setPracticeSubTab] = useState<PracticeSubTab>("mining");
  const [inspirationSubTab, setInspirationSubTab] = useState<InspirationSubTab>("stories");
  const [disruptionSubTab, setDisruptionSubTab] = useState<DisruptionSubTab>("problems");
  const [storiesSubTab, setStoriesSubTab] = useState<StoriesSubTab>("individuals");
  const [convictionSubTab, setConvictionSubTab] = useState<ConvictionSubTab>("whitepaper");
  const [showPriceChart, setShowPriceChart] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [expandedFacts, setExpandedFacts] = useState<Set<number>>(new Set());
  const [simulatorInputs, setSimulatorInputs] = useState({
    mining: { hashRate: 100, electricityCost: 0.12, bitcoinPrice: 100000 },
    dca: { monthlyAmount: 100, duration: 12, startPrice: 50000 },
    hodl: { initialAmount: 1000, years: 4, strategy: 'hodl' as 'hodl' | 'trading' }
  });

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

  const calculateHODL = (initialAmount: number, years: number, strategy: 'hodl' | 'trading') => {
    const startPrice = 30000;
    const initialBtc = initialAmount / startPrice;
    
    if (strategy === 'hodl') {
      const finalPrice = startPrice * Math.pow(1.5, years); // 50% annual growth
      const finalValue = initialBtc * finalPrice;
      const totalReturn = finalValue - initialAmount;
      const returnPercentage = (totalReturn / initialAmount) * 100;
      
      return {
        strategy: 'HODLing',
        initialBtc: initialBtc.toFixed(6),
        finalValue: finalValue.toFixed(2),
        totalReturn: totalReturn.toFixed(2),
        returnPercentage: returnPercentage.toFixed(1),
        trades: 0,
        fees: 0
      };
    } else {
      // Simulate trading with fees and taxes
      const grossReturn = initialAmount * Math.pow(1.5, years);
      const tradingFees = grossReturn * 0.05; // 5% in fees
      const taxes = (grossReturn - initialAmount) * 0.25; // 25% capital gains
      const finalValue = grossReturn - tradingFees - taxes;
      const totalReturn = finalValue - initialAmount;
      const returnPercentage = (totalReturn / initialAmount) * 100;
      
      return {
        strategy: 'Active Trading',
        initialBtc: initialBtc.toFixed(6),
        finalValue: finalValue.toFixed(2),
        totalReturn: totalReturn.toFixed(2),
        returnPercentage: returnPercentage.toFixed(1),
        trades: years * 12,
        fees: tradingFees.toFixed(2)
      };
    }
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
                <h1 className="text-sm sm:text-lg font-bold text-white truncate">Bitcoin Education</h1>
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
              variant={activeSection === "foundation" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveSection("foundation")}
              className={`${activeSection === "foundation" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"} px-3 sm:px-4 py-2 text-sm sm:text-base min-w-0 flex-shrink-0`}
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
              variant={activeSection === "inspiration" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveSection("inspiration")}
              className={`${activeSection === "inspiration" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"} px-3 sm:px-4 py-2 text-sm sm:text-base min-w-0 flex-shrink-0`}
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="whitespace-nowrap">Inspo</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Sub Navigation */}
      {activeSection === "foundation" && (
        <div className="bg-zinc-800/30 border-b border-zinc-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-center gap-1 py-2 flex-wrap">
              <Button
                variant={foundationSubTab === "today" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFoundationSubTab("today")}
                className="text-xs px-2 py-1"
              >
                <Calendar className="w-3 h-3 mr-1" />
                Today
              </Button>
              <Button
                variant={foundationSubTab === "explore" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFoundationSubTab("explore")}
                className="text-xs px-2 py-1"
              >
                <Globe className="w-3 h-3 mr-1" />
                Explore
              </Button>
              <Button
                variant={foundationSubTab === "disruption" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFoundationSubTab("disruption")}
                className="text-xs px-2 py-1"
              >
                <AlertTriangle className="w-3 h-3 mr-1" />
                Why Bitcoin
              </Button>
              <Button
                variant={foundationSubTab === "terms" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFoundationSubTab("terms")}
                className="text-xs px-2 py-1"
              >
                <FileText className="w-3 h-3 mr-1" />
                Glossary
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
                variant={practiceSubTab === "mining" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setPracticeSubTab("mining")}
                className="text-xs px-2 py-1"
              >
                <Zap className="w-3 h-3 mr-1" />
                Mining
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
                <Shield className="w-3 h-3 mr-1" />
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
              <Button
                variant={practiceSubTab === "halving" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setPracticeSubTab("halving")}
                className="text-xs px-2 py-1"
              >
                <Gem className="w-3 h-3 mr-1" />
                Halving
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeSection === "inspiration" && (
        <div className="bg-zinc-800/30 border-b border-zinc-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-center gap-1 py-2 flex-wrap">
              <Button
                variant={inspirationSubTab === "stories" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setInspirationSubTab("stories")}
                className="text-xs px-2 py-1"
              >
                <Users className="w-3 h-3 mr-1" />
                Stories
              </Button>
              <Button
                variant={inspirationSubTab === "conviction" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setInspirationSubTab("conviction")}
                className="text-xs px-2 py-1"
              >
                <Heart className="w-3 h-3 mr-1" />
                Conviction
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {activeSection === "foundation" && "Build Your Bitcoin Foundation"}
            {activeSection === "practice" && "Practice Bitcoin Concepts"}
            {activeSection === "inspiration" && "Find Your Bitcoin Inspiration"}
          </h2>
          <p className="text-zinc-400">
            {activeSection === "foundation" && "Learn the fundamentals and understand why Bitcoin matters"}
            {activeSection === "practice" && "Interactive simulations to deepen your understanding"}
            {activeSection === "inspiration" && "Real stories and conviction-building content"}
          </p>
        </div>

        {/* Foundation Section */}
        {activeSection === "foundation" && (
          <div className="space-y-6">
            {foundationSubTab === "today" && (
              <div className="space-y-6">
                {/* Today's Learning Header */}
                <div className="text-center space-y-2 mb-6">
                  <h2 className="text-2xl font-bold text-white">Today's Bitcoin Learning</h2>
                  <p className="text-zinc-400">Complete your daily facts, lesson, and quiz to build your <BitcoinTerm term="Bitcoin">Bitcoin</BitcoinTerm> conviction</p>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <Badge variant="outline" className="border-orange-600 text-orange-400">
                      <Calendar className="w-3 h-3 mr-1" />
                      Day {new Date().getDate()}
                    </Badge>
                    <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                      Streak: {user?.currentStreak || 0} days
                    </Badge>
                  </div>
                </div>

                {/* Learning Progress Indicator */}
                <ProgressIndicator
                  steps={[
                    { id: "facts", title: "Daily Facts", status: "completed", estimatedTime: "2 min" },
                    { id: "lesson", title: "Today's Lesson", status: "current", estimatedTime: "5 min" },
                    { id: "quiz", title: "Knowledge Quiz", status: "pending", estimatedTime: "3 min" }
                  ]}
                  currentStep="lesson"
                  completedSteps={["facts"]}
                  className="mb-6"
                />

                {/* Learning Analytics */}
                <LearningAnalytics
                  totalTimeSpent={120}
                  conceptsMastered={15}
                  currentStreak={user?.currentStreak || 0}
                  longestStreak={user?.longestStreak || 0}
                  averageQuizScore={85}
                  className="mb-6"
                />

                {/* Recent Achievement */}
                {user?.currentStreak && user.currentStreak >= 7 && (
                  <AchievementBadge
                    title="Dedicated Learner"
                    description="You've maintained a 7-day learning streak!"
                    icon={<CheckCircle className="w-5 h-5" />}
                    unlocked={true}
                    className="mb-6"
                  />
                )}

                {/* Daily Facts Section */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-orange-600/20 rounded-lg">
                        <Lightbulb className="w-5 h-5 text-orange-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Daily Facts</h3>
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

                {/* Daily Lesson Section */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-600/20 rounded-lg">
                        <BookOpen className="w-5 h-5 text-blue-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Today's Lesson</h3>
                      {lesson && (
                        <Badge variant="outline" className="border-blue-600 text-blue-400 text-xs">
                          {lesson.estimatedReadTime} read
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

                {/* Daily Quiz Section */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-600/20 rounded-lg">
                        <HelpCircle className="w-5 h-5 text-green-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Daily Quiz</h3>
                      <Badge variant="outline" className="border-green-600 text-green-400 text-xs">
                        Test your knowledge
                      </Badge>
                    </div>
                    <DailyQuiz />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Explore Section */}
            {foundationSubTab === "explore" && (
              <div className="grid gap-6">
                {[
                  {
                    title: "Blockchain Technology",
                    description: "Deep dive into how blockchain works, including cryptographic hashing, merkle trees, and consensus mechanisms.",
                    topics: ["Cryptographic Hashing", "Merkle Trees", "Consensus Mechanisms", "Block Structure"],
                    difficulty: "Advanced",
                    icon: <Network className="w-8 h-8 text-blue-400" />
                  },
                  {
                    title: "Proof of Work",
                    description: "Understanding Bitcoin's security model through computational proof and mining economics.",
                    topics: ["Mining Process", "Difficulty Adjustment", "Energy Usage", "Security Guarantees"],
                    difficulty: "Intermediate",
                    icon: <Zap className="w-8 h-8 text-yellow-400" />
                  },
                  {
                    title: "Digital Signatures",
                    description: "How Bitcoin ensures transaction authenticity through elliptic curve cryptography.",
                    topics: ["ECDSA", "Public Key Cryptography", "Transaction Signing", "Key Management"],
                    difficulty: "Advanced",
                    icon: <Shield className="w-8 h-8 text-green-400" />
                  },
                  {
                    title: "Lightning Network",
                    description: "Bitcoin's layer 2 scaling solution for instant, low-cost payments.",
                    topics: ["Payment Channels", "Routing", "Liquidity", "Channel Management"],
                    difficulty: "Advanced",
                    icon: <Zap className="w-8 h-8 text-purple-400" />
                  },
                  {
                    title: "Fixed Supply",
                    description: "Why Bitcoin's 21 million coin limit makes it unique among monetary systems.",
                    topics: ["Halving Events", "Issuance Schedule", "Scarcity Economics", "Monetary Policy"],
                    difficulty: "Beginner",
                    icon: <Gem className="w-8 h-8 text-orange-400" />
                  }
                ].map((topic, index) => (
                  <Card key={index} className="bg-zinc-900 border-zinc-800">
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
                          <div className="space-y-2">
                            <div className="text-zinc-400 text-sm font-medium">Key Topics:</div>
                            <div className="flex flex-wrap gap-2">
                              {topic.topics.map((topicItem, topicIndex) => (
                                <Badge key={topicIndex} variant="secondary" className="bg-zinc-800 text-zinc-300">
                                  {topicItem}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {foundationSubTab === "disruption" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Financial Disruption</h2>
                  <p className="text-zinc-400">How Bitcoin is transforming the global financial system</p>
                </div>
                
                <div className="flex space-x-2 mb-6 justify-center flex-wrap gap-2">
                  <Button
                    variant={disruptionSubTab === "problems" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setDisruptionSubTab("problems")}
                    className="text-sm"
                  >
                    <AlertTriangle className="w-3 h-3 mr-2" />
                    Problems
                  </Button>
                  <Button
                    variant={disruptionSubTab === "solutions" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setDisruptionSubTab("solutions")}
                    className="text-sm"
                  >
                    <CheckCircle className="w-3 h-3 mr-2" />
                    Solutions
                  </Button>
                  <Button
                    variant={disruptionSubTab === "comparison" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setDisruptionSubTab("comparison")}
                    className="text-sm"
                  >
                    <BarChart3 className="w-3 h-3 mr-2" />
                    Compare
                  </Button>
                  <Button
                    variant={disruptionSubTab === "future" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setDisruptionSubTab("future")}
                    className="text-sm"
                  >
                    <Clock className="w-3 h-3 mr-2" />
                    Future
                  </Button>
                </div>

                {disruptionSubTab === "problems" && (
                  <div className="grid gap-6">
                    {traditionalFinanceProblems.problems.map((problem, index) => (
                      <Card key={index} className="bg-zinc-900 border-zinc-800">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="text-3xl">{problem.icon}</div>
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-white mb-2">{problem.title}</h4>
                              <p className="text-zinc-300 mb-3">{problem.description}</p>
                              <div className="space-y-2">
                                <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-3">
                                  <div className="text-red-300 font-medium text-sm mb-1">Impact</div>
                                  <div className="text-red-200 text-sm">{problem.impact}</div>
                                </div>
                                <div className="bg-zinc-800 rounded-lg p-3">
                                  <div className="text-zinc-400 font-medium text-sm mb-1">Real Example</div>
                                  <div className="text-zinc-300 text-sm">{problem.example}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {disruptionSubTab === "solutions" && (
                  <div className="grid gap-6">
                    {traditionalFinanceProblems.solutions.map((solution, index) => (
                      <Card key={index} className="bg-zinc-900 border-zinc-800">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-6 h-6 text-green-400" />
                              <h4 className="text-lg font-bold text-white">{solution.solution}</h4>
                            </div>
                            
                            <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-3">
                              <div className="text-red-300 font-medium text-sm mb-1">Traditional Problem</div>
                              <div className="text-red-200 text-sm">{solution.problem}</div>
                            </div>
                            
                            <p className="text-zinc-300">{solution.description}</p>
                            
                            <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-3">
                              <div className="text-green-300 font-medium text-sm mb-1">Bitcoin Benefit</div>
                              <div className="text-green-200 text-sm">{solution.benefit}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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

            {foundationSubTab === "terms" && (
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
          </div>
        )}

        {/* Practice Section */}
        {activeSection === "practice" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Practice Bitcoin Concepts</h2>
              <p className="text-zinc-400">Interactive simulations to deepen your understanding</p>
            </div>

            {practiceSubTab === "mining" && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-orange-600/20 rounded-lg">
                        <Zap className="w-8 h-8 text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">Bitcoin Mining Calculator</h3>
                        <p className="text-zinc-300 mb-4">Calculate mining profitability based on hash rate, electricity costs, and Bitcoin price</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-white font-semibold">Mining Parameters</h4>
                        
                        <div>
                          <label className="text-zinc-300 text-sm block mb-2">Hash Rate (TH/s)</label>
                          <input
                            type="number"
                            value={simulatorInputs.mining.hashRate}
                            onChange={(e) => setSimulatorInputs(prev => ({
                              ...prev,
                              mining: { ...prev.mining, hashRate: Number(e.target.value) }
                            }))}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="text-zinc-300 text-sm block mb-2">Electricity Cost ($/kWh)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={simulatorInputs.mining.electricityCost}
                            onChange={(e) => setSimulatorInputs(prev => ({
                              ...prev,
                              mining: { ...prev.mining, electricityCost: Number(e.target.value) }
                            }))}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="text-zinc-300 text-sm block mb-2">Bitcoin Price ($)</label>
                          <input
                            type="number"
                            value={simulatorInputs.mining.bitcoinPrice}
                            onChange={(e) => setSimulatorInputs(prev => ({
                              ...prev,
                              mining: { ...prev.mining, bitcoinPrice: Number(e.target.value) }
                            }))}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-white font-semibold">Profitability Results</h4>
                        {(() => {
                          const results = calculateMiningProfitability(
                            simulatorInputs.mining.hashRate,
                            simulatorInputs.mining.electricityCost,
                            simulatorInputs.mining.bitcoinPrice
                          );
                          return (
                            <div className="space-y-3">
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">Daily Bitcoin Earned</div>
                                <div className="text-orange-400 font-mono">{results.dailyBtc} BTC</div>
                              </div>
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">Daily Revenue</div>
                                <div className="text-green-400 font-mono">${results.dailyRevenue}</div>
                              </div>
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">Daily Electricity Cost</div>
                                <div className="text-red-400 font-mono">${results.dailyElectricityCost}</div>
                              </div>
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">Daily Profit</div>
                                <div className={`font-mono ${Number(results.dailyProfit) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  ${results.dailyProfit}
                                </div>
                              </div>
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">Monthly Profit</div>
                                <div className={`font-mono ${Number(results.monthlyProfit) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  ${results.monthlyProfit}
                                </div>
                              </div>
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">Profit Margin</div>
                                <div className="text-blue-400 font-mono">{results.profitMargin}%</div>
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
                          <label className="text-zinc-300 text-sm block mb-2">Strategy</label>
                          <select
                            value={simulatorInputs.hodl.strategy}
                            onChange={(e) => setSimulatorInputs(prev => ({
                              ...prev,
                              hodl: { ...prev.hodl, strategy: e.target.value as 'hodl' | 'trading' }
                            }))}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                          >
                            <option value="hodl">HODL (Hold)</option>
                            <option value="trading">Active Trading</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-white font-semibold">Strategy Results</h4>
                        {(() => {
                          const results = calculateHODL(
                            simulatorInputs.hodl.initialAmount,
                            simulatorInputs.hodl.years,
                            simulatorInputs.hodl.strategy
                          );
                          return (
                            <div className="space-y-3">
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">Strategy</div>
                                <div className="text-purple-400 font-mono">{results.strategy}</div>
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
                              {Number(results.fees) > 0 && (
                                <div className="bg-zinc-800 rounded-lg p-3">
                                  <div className="text-zinc-400 text-sm">Trading Fees & Taxes</div>
                                  <div className="text-red-400 font-mono">${results.fees}</div>
                                </div>
                              )}
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">Number of Trades</div>
                                <div className="text-blue-400 font-mono">{results.trades}</div>
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

        {/* Inspiration Section */}
        {activeSection === "inspiration" && (
          <div className="space-y-6">
            {inspirationSubTab === "stories" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Bitcoin Stories</h2>
                  <p className="text-zinc-400">Real stories from Bitcoin users around the world</p>
                </div>
                
                <div className="flex space-x-2 mb-6 justify-center flex-wrap gap-2">
                  <Button
                    variant={storiesSubTab === "individuals" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setStoriesSubTab("individuals")}
                    className="text-sm"
                  >
                    <UserIcon className="w-3 h-3 mr-2" />
                    Individuals
                  </Button>
                  <Button
                    variant={storiesSubTab === "businesses" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setStoriesSubTab("businesses")}
                    className="text-sm"
                  >
                    <Building2 className="w-3 h-3 mr-2" />
                    Businesses
                  </Button>
                  <Button
                    variant={storiesSubTab === "nations" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setStoriesSubTab("nations")}
                    className="text-sm"
                  >
                    <Flag className="w-3 h-3 mr-2" />
                    Nations
                  </Button>
                </div>

                <div className="grid gap-6">
                  {userProfiles[storiesSubTab].map((profile, index) => (
                    <Card key={index} className="bg-zinc-900 border-zinc-800">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-600/20 rounded-lg">
                              {storiesSubTab === "individuals" && <UserIcon className="w-8 h-8 text-blue-400" />}
                              {storiesSubTab === "businesses" && <Building2 className="w-8 h-8 text-blue-400" />}
                              {storiesSubTab === "nations" && <Flag className="w-8 h-8 text-blue-400" />}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white">{profile.name}</h3>
                              <p className="text-blue-400 font-medium">{profile.role}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-white font-medium mb-2">Story</h4>
                              <p className="text-zinc-300">{profile.story}</p>
                            </div>
                            
                            <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-4">
                              <h4 className="text-green-300 font-medium mb-2">Why Bitcoin?</h4>
                              <p className="text-green-200 text-sm">{profile.reason}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {inspirationSubTab === "conviction" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Build Your Conviction</h2>
                  <p className="text-zinc-400">Resources to strengthen your Bitcoin understanding</p>
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

                {convictionSubTab === "books" && (
                  <div className="grid gap-6">
                    {convictionContent.books.map((book, index) => (
                      <Card key={index} className="bg-zinc-900 border-zinc-800">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-xl font-bold text-white">{book.title}</h3>
                                <p className="text-zinc-400">by {book.author}</p>
                              </div>
                              <div className="text-right">
                                <Badge 
                                  variant="outline" 
                                  className={`${
                                    book.difficulty === "Beginner" ? "border-green-600 text-green-400" :
                                    book.difficulty === "Intermediate" ? "border-yellow-600 text-yellow-400" :
                                    "border-red-600 text-red-400"
                                  }`}
                                >
                                  {book.difficulty}
                                </Badge>
                                <p className="text-zinc-500 text-sm mt-1">{book.pages} pages</p>
                              </div>
                            </div>
                            
                            <p className="text-zinc-300">{book.description}</p>
                            
                            <div className="space-y-2">
                              <div className="text-zinc-400 text-sm font-medium">Key Topics:</div>
                              <div className="flex flex-wrap gap-2">
                                {book.keyTopics.map((topic, topicIndex) => (
                                  <Badge key={topicIndex} variant="secondary" className="bg-zinc-800 text-zinc-300">
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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