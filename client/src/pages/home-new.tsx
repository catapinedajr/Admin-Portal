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
  TrendingDown
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
      role: "Software Engineer & Bitcoin HODLer",
      story: "Started buying Bitcoin in 2018 after realizing traditional savings accounts weren't keeping up with inflation. Now uses Bitcoin as her primary savings vehicle and has built a substantial position through consistent dollar-cost averaging.",
      reason: "Bitcoin gives me control over my money and protects my purchasing power better than any bank ever could."
    },
    {
      name: "Marcus Rodriguez", 
      role: "Small Business Owner",
      story: "Owns a coffee shop in Miami and started accepting Bitcoin payments in 2021. Now keeps 30% of business reserves in Bitcoin and has seen significant growth in his savings despite economic uncertainty.",
      reason: "Bitcoin allows me to serve customers globally and protects my business from currency debasement."
    },
    {
      name: "Elena Petrov",
      role: "Teacher & DCA Investor", 
      story: "A high school mathematics teacher who began learning about Bitcoin during the 2020 pandemic. She now dedicates $200 monthly to Bitcoin purchases and teaches her students about digital currency concepts.",
      reason: "Bitcoin represents financial education and freedom - something I want to pass on to the next generation."
    }
  ],
  businesses: [
    {
      name: "MicroStrategy", 
      role: "Business Intelligence Company",
      story: "Led by Michael Saylor, MicroStrategy was the first major public company to adopt Bitcoin as its primary treasury reserve asset. They've accumulated over 130,000 Bitcoin since 2020, fundamentally changing how corporations think about cash management.",
      reason: "Bitcoin is superior to cash as a store of value and provides shareholders with exposure to the digital transformation of the global economy."
    },
    {
      name: "Tesla",
      role: "Electric Vehicle Manufacturer", 
      story: "Under Elon Musk's leadership, Tesla invested $1.5 billion in Bitcoin in early 2021 and briefly accepted Bitcoin payments for vehicles. Though they scaled back vehicle purchases due to environmental concerns, they maintained their Bitcoin holdings.",
      reason: "Bitcoin diversifies our cash position and provides long-term value storage as we transition to sustainable energy."
    },
    {
      name: "Strike",
      role: "Bitcoin Payment Platform",
      story: "Founded by Jack Mallers, Strike built the Lightning Network infrastructure that enabled El Salvador's Bitcoin adoption. They've revolutionized cross-border payments by using Bitcoin rails to settle transactions instantly and cheaply.",
      reason: "Bitcoin's Lightning Network enables instant, low-cost global payments that traditional banking simply cannot match."
    }
  ],
  nations: [
    {
      name: "El Salvador",
      role: "First Nation to Adopt Bitcoin as Legal Tender",
      story: "Under President Nayib Bukele's leadership, El Salvador became the first country to make Bitcoin legal tender in September 2021. They've purchased over 2,600 Bitcoin for their national treasury and built Bitcoin education programs for citizens.",
      reason: "Bitcoin provides financial inclusion for our unbanked population and reduces our dependence on the US dollar."
    },
    {
      name: "Central African Republic", 
      role: "Second Country to Adopt Bitcoin",
      story: "Following El Salvador's lead, CAR adopted Bitcoin as legal tender in 2022. Despite economic challenges, they've embraced Bitcoin as a tool for financial sovereignty and to attract international investment in their resource-rich economy.",
      reason: "Bitcoin offers us monetary independence and connects our economy directly to the global digital financial system."
    },
    {
      name: "Miami, Florida",
      role: "Bitcoin-Friendly City",
      story: "Mayor Francis Suarez has transformed Miami into America's Bitcoin capital, exploring Bitcoin for city finances, hosting major Bitcoin conferences, and attracting crypto companies with progressive policies. Miami was among the first cities to explore paying employees in Bitcoin.",
      reason: "Bitcoin positions Miami as the financial technology capital of America and attracts innovative businesses to our city."
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
      "Digital Scarcity": {
        explanation: "Before Bitcoin, digital items could be copied infinitely at zero cost. Bitcoin solved the 'double-spending problem' using cryptographic proof and network consensus, creating true digital scarcity.",
        examples: [
          "Only 21 million bitcoins will ever exist (hardcoded limit)",
          "Digital files can be copied, but Bitcoin cannot be duplicated",
          "Each bitcoin exists as unique blockchain entry",
          "Scarcity is enforced by mathematics and consensus"
        ],
        visualDescription: "Think of Bitcoin like rare digital trading cards that cannot be photocopied. The blockchain acts like an unchangeable ledger that tracks who owns each unique card.",
        keyTakeaways: [
          "First truly scarce digital asset in history",
          "Scarcity is mathematically guaranteed",
          "Cannot be inflated away by central authorities",
          "Digital scarcity enables digital value storage"
        ]
      },
      "Peer-to-Peer Network": {
        explanation: "Bitcoin operates on a decentralized network where thousands of computers (nodes) work together to validate transactions and maintain the blockchain without any central authority controlling the system.",
        examples: [
          "Over 15,000 nodes worldwide verify transactions",
          "No single point of failure or control",
          "Network becomes stronger as more nodes join",
          "Anyone can run a node and participate in consensus"
        ],
        visualDescription: "Picture a massive web of interconnected computers around the world, each keeping an identical copy of Bitcoin's transaction history and working together like a global verification system.",
        keyTakeaways: [
          "Decentralized network with no central authority",
          "Thousands of nodes provide security and redundancy",
          "Permissionless participation strengthens the network",
          "Resilient against censorship and shutdowns"
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
    
    // Simulate historical Bitcoin prices with realistic volatility based on actual market history
    const getPriceDataForPeriod = (startDate: string) => {
      if (startDate.includes('2019-01')) return { basePrice: 3500, volatility: 0.4, trend: 2.5 };
      if (startDate.includes('2019-07')) return { basePrice: 10000, volatility: 0.3, trend: 1.2 };
      if (startDate.includes('2020-01')) return { basePrice: 7200, volatility: 0.5, trend: 6.0 };
      if (startDate.includes('2020-03')) return { basePrice: 5000, volatility: 0.8, trend: 8.0 };
      if (startDate.includes('2020-07')) return { basePrice: 9000, volatility: 0.4, trend: 5.0 };
      if (startDate.includes('2020-10')) return { basePrice: 11000, volatility: 0.3, trend: 3.5 };
      if (startDate.includes('2021-01')) return { basePrice: 30000, volatility: 0.4, trend: 2.2 };
      if (startDate.includes('2021-05')) return { basePrice: 58000, volatility: 0.6, trend: -0.5 };
      if (startDate.includes('2021-07')) return { basePrice: 30000, volatility: 0.5, trend: 2.0 };
      if (startDate.includes('2021-10')) return { basePrice: 45000, volatility: 0.3, trend: 1.5 };
      if (startDate.includes('2022-01')) return { basePrice: 47000, volatility: 0.4, trend: -1.8 };
      if (startDate.includes('2022-06')) return { basePrice: 30000, volatility: 0.5, trend: -1.2 };
      if (startDate.includes('2022-11')) return { basePrice: 16000, volatility: 0.6, trend: 0.8 };
      if (startDate.includes('2023-01')) return { basePrice: 16500, volatility: 0.4, trend: 2.5 };
      if (startDate.includes('2023-06')) return { basePrice: 25000, volatility: 0.3, trend: 1.8 };
      if (startDate.includes('2023-10')) return { basePrice: 35000, volatility: 0.4, trend: 2.2 };
      if (startDate.includes('2024-01')) return { basePrice: 42000, volatility: 0.3, trend: 1.5 };
      if (startDate.includes('2024-06')) return { basePrice: 65000, volatility: 0.2, trend: 0.8 };
      return { basePrice: 35000, volatility: 0.3, trend: 1.5 }; // Default
    };
    
    const { basePrice, volatility: baseVolatility, trend: overallTrend } = getPriceDataForPeriod(startDate);
    
    let totalInvested = 0;
    let totalBitcoin = 0;
    
    // Simulate DCA purchases with varying Bitcoin prices
    for (let i = 0; i < totalPurchases; i++) {
      const timeProgress = i / Math.max(totalPurchases - 1, 1);
      
      // Apply realistic Bitcoin price volatility with market-specific patterns
      const volatilityFactor = 1 + Math.sin(timeProgress * Math.PI * 6) * baseVolatility; // Market cycles
      const trendFactor = 1 + (timeProgress * overallTrend / 100); // Historical trend
      const randomFactor = 0.7 + Math.random() * 0.6; // ±30% random variation
      const currentPrice = Math.max(1000, basePrice * trendFactor * volatilityFactor * randomFactor);
      
      const bitcoinPurchased = purchaseAmount / currentPrice;
      totalInvested += purchaseAmount;
      totalBitcoin += bitcoinPurchased;
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
      duration
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
                variant={activeSection === "practice" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveSection("practice")}
                className="text-sm px-4 py-2"
              >
                Practice
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
                  variant={learnSubTab === "deepdive" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setLearnSubTab("deepdive")}
                  className="text-xs px-3 py-1"
                >
                  Deep Dive
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
                  variant={learnSubTab === "stories" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setLearnSubTab("stories")}
                  className="text-xs px-3 py-1"
                >
                  Stories
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

                {/* Daily Lesson */}
                {lesson && (
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-white mb-4">Today's Lesson</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-white mb-2">{(lesson as Lesson).title}</h4>
                          <p className="text-zinc-300">{(lesson as Lesson).content}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <Clock className="w-4 h-4" />
                          <span>{(lesson as Lesson).estimatedReadTime || '5'} min read</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Daily Quiz */}
                <DailyQuiz />
              </div>
            )}

            {/* Stories Content */}
            {learnSubTab === "stories" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">Real Bitcoin Stories</h3>
                  <p className="text-zinc-400">See how individuals, businesses, and nations are using Bitcoin</p>
                </div>

                {/* Stories Sub-navigation */}
                <div className="flex justify-center">
                  <div className="flex space-x-2 mb-6 justify-center flex-wrap gap-2">
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
                            <div className="p-3 bg-orange-600/20 rounded-lg">
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
                            
                            <div className="bg-orange-600/10 border border-orange-600/20 rounded-lg p-4">
                              <h4 className="text-orange-300 font-medium mb-2 flex items-center gap-2">
                                <Quote className="w-4 h-4" />
                                Why Bitcoin?
                              </h4>
                              <p className="text-orange-100 text-sm italic">"{profile.reason}"</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Deep Dive Section */}
            {learnSubTab === "deepdive" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">Advanced Bitcoin Concepts</h3>
                  <p className="text-zinc-400">Explore complex topics with detailed explanations and interactive elements</p>
                </div>

                {/* Advanced Topics Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-600/20 rounded-lg">
                              <Network className="w-6 h-6 text-orange-400" />
                            </div>
                            <h4 className="text-lg font-bold text-white">Lightning Network</h4>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTopicExpansion("lightning")}
                            className="text-orange-400 hover:text-orange-300"
                          >
                            {expandedTopics.has("lightning") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                        </div>
                        <p className="text-zinc-300 text-sm">
                          A "layer 2" payment protocol that operates on top of Bitcoin. It enables fast, low-cost transactions by creating payment channels between users.
                        </p>
                        {expandedTopics.has("lightning") && (
                          <div className="space-y-4 border-t border-zinc-700 pt-4">
                            <div className="space-y-2">
                              <h5 className="font-medium text-orange-300">How It Works:</h5>
                              <ul className="space-y-2 text-sm text-zinc-300">
                                <li className="flex items-start gap-2">
                                  <span className="text-orange-400 mt-1">1.</span>
                                  <span>Two parties open a payment channel by creating a multi-signature Bitcoin transaction</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-orange-400 mt-1">2.</span>
                                  <span>They can now send unlimited payments to each other instantly and privately</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-orange-400 mt-1">3.</span>
                                  <span>Payments can route through multiple channels to reach anyone on the network</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-orange-400 mt-1">4.</span>
                                  <span>Channel is closed by broadcasting the final state to the Bitcoin blockchain</span>
                                </li>
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-medium text-orange-300">Real-World Benefits:</h5>
                              <div className="grid gap-2">
                                <div className="p-2 bg-orange-600/10 rounded border border-orange-600/20 text-sm text-orange-100">
                                  <span className="font-medium">Instant Coffee Purchase:</span> Buy coffee with Bitcoin instantly instead of waiting 10+ minutes for confirmation
                                </div>
                                <div className="p-2 bg-orange-600/10 rounded border border-orange-600/20 text-sm text-orange-100">
                                  <span className="font-medium">Micropayments:</span> Pay fractions of a cent for content, impossible with traditional payment systems
                                </div>
                                <div className="p-2 bg-orange-600/10 rounded border border-orange-600/20 text-sm text-orange-100">
                                  <span className="font-medium">Privacy:</span> Lightning transactions don't reveal details to the entire blockchain
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="space-y-2">
                          <h5 className="font-medium text-orange-300">Key Features:</h5>
                          <ul className="space-y-1 text-sm text-zinc-400">
                            <li>• Instant payments</li>
                            <li>• Minimal fees (fractions of a cent)</li>
                            <li>• Micropayment capability</li>
                            <li>• Enhanced privacy</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600/20 rounded-lg">
                              <Lock className="w-6 h-6 text-blue-400" />
                            </div>
                            <h4 className="text-lg font-bold text-white">Digital Signatures</h4>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTopicExpansion("signatures")}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            {expandedTopics.has("signatures") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                        </div>
                        <p className="text-zinc-300 text-sm">
                          Cryptographic proof that a transaction was created by the owner of a private key, without revealing the private key itself.
                        </p>
                        {expandedTopics.has("signatures") && (
                          <div className="space-y-4 border-t border-zinc-700 pt-4">
                            <div className="space-y-2">
                              <h5 className="font-medium text-blue-300">Mathematical Foundation:</h5>
                              <div className="p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                                <p className="text-blue-100 text-sm">Bitcoin uses Elliptic Curve Digital Signature Algorithm (ECDSA) with the secp256k1 curve, the same cryptography that secures online banking and military communications.</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-medium text-blue-300">Step-by-Step Process:</h5>
                              <ol className="space-y-2 text-sm text-zinc-300">
                                <li className="flex items-start gap-2">
                                  <span className="text-blue-400 mt-1">1.</span>
                                  <span>Your wallet creates a transaction hash (summary) of the transaction data</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-blue-400 mt-1">2.</span>
                                  <span>Your private key mathematically transforms this hash into a unique signature</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-blue-400 mt-1">3.</span>
                                  <span>The signature is attached to the transaction and broadcast to the network</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-blue-400 mt-1">4.</span>
                                  <span>Network nodes use your public key to verify the signature matches the transaction</span>
                                </li>
                              </ol>
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-medium text-blue-300">Why It's Secure:</h5>
                              <div className="grid gap-2">
                                <div className="p-2 bg-blue-600/10 rounded border border-blue-600/20 text-sm text-blue-100">
                                  <span className="font-medium">One-Way Math:</span> Easy to create signature from private key, virtually impossible to reverse
                                </div>
                                <div className="p-2 bg-blue-600/10 rounded border border-blue-600/20 text-sm text-blue-100">
                                  <span className="font-medium">Unique Per Transaction:</span> Each signature is specific to that exact transaction data
                                </div>
                                <div className="p-2 bg-blue-600/10 rounded border border-blue-600/20 text-sm text-blue-100">
                                  <span className="font-medium">Public Verification:</span> Anyone can verify signatures without accessing private keys
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="space-y-2">
                          <h5 className="font-medium text-blue-300">How It Works:</h5>
                          <ul className="space-y-1 text-sm text-zinc-400">
                            <li>• Private key creates signature</li>
                            <li>• Public key verifies signature</li>
                            <li>• Mathematically impossible to forge</li>
                            <li>• Proves ownership without revealing secrets</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-600/20 rounded-lg">
                              <Zap className="w-6 h-6 text-green-400" />
                            </div>
                            <h4 className="text-lg font-bold text-white">Proof of Work</h4>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTopicExpansion("proofofwork")}
                            className="text-green-400 hover:text-green-300"
                          >
                            {expandedTopics.has("proofofwork") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                        </div>
                        <p className="text-zinc-300 text-sm">
                          The consensus mechanism that secures Bitcoin. Miners compete to solve computational puzzles, with the winner adding the next block to the blockchain.
                        </p>
                        {expandedTopics.has("proofofwork") && (
                          <div className="space-y-4 border-t border-zinc-700 pt-4">
                            <div className="space-y-2">
                              <h5 className="font-medium text-green-300">Mining Process Explained:</h5>
                              <ol className="space-y-2 text-sm text-zinc-300">
                                <li className="flex items-start gap-2">
                                  <span className="text-green-400 mt-1">1.</span>
                                  <span>Miners collect pending transactions into a block template</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-green-400 mt-1">2.</span>
                                  <span>They try billions of different "nonce" numbers to find a valid block hash</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-green-400 mt-1">3.</span>
                                  <span>The hash must start with a specific number of zeros (difficulty target)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-green-400 mt-1">4.</span>
                                  <span>First miner to find valid hash broadcasts the block and earns rewards</span>
                                </li>
                              </ol>
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-medium text-green-300">Energy & Security Trade-off:</h5>
                              <div className="p-3 bg-green-600/10 border border-green-600/20 rounded-lg">
                                <p className="text-green-100 text-sm">Bitcoin's energy consumption is a feature, not a bug. The more energy spent securing the network, the more expensive it becomes to attack. This creates the strongest form of digital security ever invented.</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-medium text-green-300">Real-World Scale:</h5>
                              <div className="grid gap-2">
                                <div className="p-2 bg-green-600/10 rounded border border-green-600/20 text-sm text-green-100">
                                  <span className="font-medium">Network Hashrate:</span> ~450 exahashes per second (450,000,000,000,000,000,000)
                                </div>
                                <div className="p-2 bg-green-600/10 rounded border border-green-600/20 text-sm text-green-100">
                                  <span className="font-medium">Attack Cost:</span> Would require $20+ billion in hardware and massive electricity
                                </div>
                                <div className="p-2 bg-green-600/10 rounded border border-green-600/20 text-sm text-green-100">
                                  <span className="font-medium">Global Mining:</span> Distributed across every continent, impossible to shut down
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="space-y-2">
                          <h5 className="font-medium text-green-300">Security Benefits:</h5>
                          <ul className="space-y-1 text-sm text-zinc-400">
                            <li>• Immutable transaction history</li>
                            <li>• Decentralized consensus</li>
                            <li>• Attack resistance grows with network</li>
                            <li>• No central point of failure</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-600/20 rounded-lg">
                              <Coins className="w-6 h-6 text-purple-400" />
                            </div>
                            <h4 className="text-lg font-bold text-white">Fixed Supply</h4>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTopicExpansion("fixedsupply")}
                            className="text-purple-400 hover:text-purple-300"
                          >
                            {expandedTopics.has("fixedsupply") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                        </div>
                        <p className="text-zinc-300 text-sm">
                          Bitcoin has a maximum supply of 21 million coins, hardcoded into the protocol. This scarcity model is fundamental to Bitcoin's value proposition.
                        </p>
                        {expandedTopics.has("fixedsupply") && (
                          <div className="space-y-4 border-t border-zinc-700 pt-4">
                            <div className="space-y-2">
                              <h5 className="font-medium text-purple-300">Mathematical Certainty:</h5>
                              <div className="p-3 bg-purple-600/10 border border-purple-600/20 rounded-lg">
                                <p className="text-purple-100 text-sm">The 21 million limit is hardcoded into Bitcoin's software. Changing it would require consensus from the entire network - practically impossible since it would devalue everyone's holdings.</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-medium text-purple-300">Supply Timeline:</h5>
                              <div className="grid gap-2">
                                <div className="p-2 bg-purple-600/10 rounded border border-purple-600/20 text-sm text-purple-100">
                                  <span className="font-medium">2009-2012:</span> 50 BTC per block (10.5 million total)
                                </div>
                                <div className="p-2 bg-purple-600/10 rounded border border-purple-600/20 text-sm text-purple-100">
                                  <span className="font-medium">2012-2016:</span> 25 BTC per block (5.25 million total)
                                </div>
                                <div className="p-2 bg-purple-600/10 rounded border border-purple-600/20 text-sm text-purple-100">
                                  <span className="font-medium">2016-2020:</span> 12.5 BTC per block (2.625 million total)
                                </div>
                                <div className="p-2 bg-purple-600/10 rounded border border-purple-600/20 text-sm text-purple-100">
                                  <span className="font-medium">2020-2024:</span> 6.25 BTC per block (1.3125 million total)
                                </div>
                                <div className="p-2 bg-purple-600/10 rounded border border-purple-600/20 text-sm text-purple-100">
                                  <span className="font-medium">2024-2028:</span> 3.125 BTC per block (0.65625 million total)
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-medium text-purple-300">Scarcity vs. Fiat Money:</h5>
                              <div className="grid gap-2 md:grid-cols-2">
                                <div className="p-3 bg-purple-600/10 border border-purple-600/20 rounded-lg">
                                  <h6 className="font-medium text-purple-300 mb-1">Bitcoin</h6>
                                  <ul className="text-xs text-purple-100 space-y-1">
                                    <li>• Fixed 21 million maximum</li>
                                    <li>• Decreasing inflation rate</li>
                                    <li>• No central authority can print more</li>
                                  </ul>
                                </div>
                                <div className="p-3 bg-red-600/10 border border-red-600/20 rounded-lg">
                                  <h6 className="font-medium text-red-300 mb-1">Fiat Money</h6>
                                  <ul className="text-xs text-red-100 space-y-1">
                                    <li>• Unlimited supply potential</li>
                                    <li>• Central banks print at will</li>
                                    <li>• Average 2-8% annual inflation</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="space-y-2">
                          <h5 className="font-medium text-purple-300">Supply Schedule:</h5>
                          <ul className="space-y-1 text-sm text-zinc-400">
                            <li>• ~19.8 million already mined</li>
                            <li>• Halving every 4 years</li>
                            <li>• Final coin mined ~2140</li>
                            <li>• Deflationary monetary policy</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Additional Deep Dive Topics - Row 2 */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Why Bitcoin */}
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-600/20 rounded-lg">
                              <Heart className="w-6 h-6 text-orange-400" />
                            </div>
                            <h4 className="text-lg font-bold text-white">Why Bitcoin Matters</h4>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTopicExpansion("whybitcoin")}
                            className="text-orange-400 hover:text-orange-300"
                          >
                            {expandedTopics.has("whybitcoin") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                        </div>
                        <p className="text-zinc-300 text-sm">
                          Bitcoin represents the first successful attempt to create digital money without relying on trusted third parties, offering financial sovereignty to individuals worldwide.
                        </p>
                        {expandedTopics.has("whybitcoin") && (
                          <div className="space-y-4 border-t border-zinc-700 pt-4">
                            <div className="space-y-2">
                              <h5 className="font-medium text-orange-300">Historical Context:</h5>
                              <div className="p-3 bg-orange-600/10 border border-orange-600/20 rounded-lg">
                                <p className="text-orange-100 text-sm">For the first time in history, you can store and transfer value without permission from banks, governments, or payment processors. This is as revolutionary as the internet was for information.</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-medium text-orange-300">Global Problems Bitcoin Solves:</h5>
                              <div className="grid gap-2">
                                <div className="p-2 bg-orange-600/10 rounded border border-orange-600/20 text-sm text-orange-100">
                                  <span className="font-medium">Banking the Unbanked:</span> 1.7 billion people worldwide lack bank access
                                </div>
                                <div className="p-2 bg-orange-600/10 rounded border border-orange-600/20 text-sm text-orange-100">
                                  <span className="font-medium">Remittance Costs:</span> Sending money across borders costs 6-15% in fees
                                </div>
                                <div className="p-2 bg-orange-600/10 rounded border border-orange-600/20 text-sm text-orange-100">
                                  <span className="font-medium">Monetary Debasement:</span> Fiat currencies lose 95%+ value over 100 years
                                </div>
                                <div className="p-2 bg-orange-600/10 rounded border border-orange-600/20 text-sm text-orange-100">
                                  <span className="font-medium">Financial Censorship:</span> Governments can freeze accounts and block payments
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-medium text-orange-300">Bitcoin's Unique Properties:</h5>
                              <ul className="space-y-1 text-sm text-zinc-300">
                                <li className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                                  <span><strong>Permissionless:</strong> No ID, credit check, or approval needed</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                                  <span><strong>Borderless:</strong> Works the same worldwide, 24/7/365</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                                  <span><strong>Censorship-resistant:</strong> No single entity can stop transactions</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                                  <span><strong>Programmable:</strong> Smart contracts and automation possible</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Blockchain Technology */}
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-cyan-600/20 rounded-lg">
                              <Box className="w-6 h-6 text-cyan-400" />
                            </div>
                            <h4 className="text-lg font-bold text-white">Blockchain Architecture</h4>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTopicExpansion("blockchain")}
                            className="text-cyan-400 hover:text-cyan-300"
                          >
                            {expandedTopics.has("blockchain") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                        </div>
                        <p className="text-zinc-300 text-sm">
                          A blockchain is a distributed ledger that maintains a continuously growing list of records (blocks) linked using cryptography.
                        </p>
                        {expandedTopics.has("blockchain") && (
                          <div className="space-y-4 border-t border-zinc-700 pt-4">
                            <div className="space-y-2">
                              <h5 className="font-medium text-cyan-300">Block Structure:</h5>
                              <div className="grid gap-2">
                                <div className="p-2 bg-cyan-600/10 rounded border border-cyan-600/20 text-sm text-cyan-100">
                                  <span className="font-medium">Block Header:</span> Contains metadata and links to previous block
                                </div>
                                <div className="p-2 bg-cyan-600/10 rounded border border-cyan-600/20 text-sm text-cyan-100">
                                  <span className="font-medium">Merkle Tree Root:</span> Efficiently summarizes all transactions in the block
                                </div>
                                <div className="p-2 bg-cyan-600/10 rounded border border-cyan-600/20 text-sm text-cyan-100">
                                  <span className="font-medium">Transactions:</span> Up to ~3,000 individual payment records
                                </div>
                                <div className="p-2 bg-cyan-600/10 rounded border border-cyan-600/20 text-sm text-cyan-100">
                                  <span className="font-medium">Nonce:</span> Random number that makes the block hash valid
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-medium text-cyan-300">Immutability Guarantee:</h5>
                              <div className="p-3 bg-cyan-600/10 border border-cyan-600/20 rounded-lg">
                                <p className="text-cyan-100 text-sm">Each block references the previous block's hash. Changing any past transaction would change its block hash, breaking the chain and alerting the entire network to the tampering attempt.</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-medium text-cyan-300">Global Verification:</h5>
                              <ul className="space-y-1 text-sm text-zinc-300">
                                <li className="flex items-start gap-2">
                                  <span className="text-cyan-400 mt-1">•</span>
                                  <span>15,000+ nodes worldwide maintain identical copies</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-cyan-400 mt-1">•</span>
                                  <span>Each transaction verified by mathematical consensus</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-cyan-400 mt-1">•</span>
                                  <span>No central database or single point of failure</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bitcoin vs Gold */}
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-600/20 rounded-lg">
                              <Gem className="w-6 h-6 text-yellow-400" />
                            </div>
                            <h4 className="text-lg font-bold text-white">Digital Gold Properties</h4>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTopicExpansion("digitalgold")}
                            className="text-yellow-400 hover:text-yellow-300"
                          >
                            {expandedTopics.has("digitalgold") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                        </div>
                        <p className="text-zinc-300 text-sm">
                          Bitcoin improves on gold's monetary properties while maintaining its scarcity and store of value characteristics.
                        </p>
                        {expandedTopics.has("digitalgold") && (
                          <div className="space-y-4 border-t border-zinc-700 pt-4">
                            <div className="space-y-2">
                              <h5 className="font-medium text-yellow-300">Property Comparison:</h5>
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr className="border-b border-zinc-700">
                                      <th className="text-left text-white p-2">Property</th>
                                      <th className="text-left text-yellow-400 p-2">Bitcoin</th>
                                      <th className="text-left text-yellow-600 p-2">Gold</th>
                                    </tr>
                                  </thead>
                                  <tbody className="text-zinc-300">
                                    <tr className="border-b border-zinc-800">
                                      <td className="p-2 font-medium">Scarcity</td>
                                      <td className="p-2 text-green-400">21M maximum</td>
                                      <td className="p-2 text-yellow-400">Unknown reserves</td>
                                    </tr>
                                    <tr className="border-b border-zinc-800">
                                      <td className="p-2 font-medium">Portability</td>
                                      <td className="p-2 text-green-400">Instant worldwide</td>
                                      <td className="p-2 text-red-400">Heavy, slow</td>
                                    </tr>
                                    <tr className="border-b border-zinc-800">
                                      <td className="p-2 font-medium">Divisibility</td>
                                      <td className="p-2 text-green-400">8 decimal places</td>
                                      <td className="p-2 text-yellow-400">Physical limits</td>
                                    </tr>
                                    <tr className="border-b border-zinc-800">
                                      <td className="p-2 font-medium">Verification</td>
                                      <td className="p-2 text-green-400">Mathematical proof</td>
                                      <td className="p-2 text-red-400">Requires testing</td>
                                    </tr>
                                    <tr className="border-b border-zinc-800">
                                      <td className="p-2 font-medium">Storage</td>
                                      <td className="p-2 text-green-400">Free (digital)</td>
                                      <td className="p-2 text-red-400">Expensive vaults</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-medium text-yellow-300">Why "Digital Gold":</h5>
                              <div className="grid gap-2">
                                <div className="p-2 bg-yellow-600/10 rounded border border-yellow-600/20 text-sm text-yellow-100">
                                  <span className="font-medium">Store of Value:</span> Maintains purchasing power over time
                                </div>
                                <div className="p-2 bg-yellow-600/10 rounded border border-yellow-600/20 text-sm text-yellow-100">
                                  <span className="font-medium">Inflation Hedge:</span> Fixed supply protects against currency debasement
                                </div>
                                <div className="p-2 bg-yellow-600/10 rounded border border-yellow-600/20 text-sm text-yellow-100">
                                  <span className="font-medium">Portfolio Diversification:</span> Uncorrelated with traditional assets
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Financial Sovereignty */}
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-600/20 rounded-lg">
                              <KeyRound className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h4 className="text-lg font-bold text-white">Financial Sovereignty</h4>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTopicExpansion("sovereignty")}
                            className="text-emerald-400 hover:text-emerald-300"
                          >
                            {expandedTopics.has("sovereignty") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                        </div>
                        <p className="text-zinc-300 text-sm">
                          Bitcoin enables individual financial sovereignty - the ability to have full control over your money without relying on permission from institutions.
                        </p>
                        {expandedTopics.has("sovereignty") && (
                          <div className="space-y-4 border-t border-zinc-700 pt-4">
                            <div className="space-y-2">
                              <h5 className="font-medium text-emerald-300">Self-Custody Benefits:</h5>
                              <ul className="space-y-1 text-sm text-zinc-300">
                                <li className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                  <span><strong>Be Your Own Bank:</strong> Complete control over your savings</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                  <span><strong>No Counterparty Risk:</strong> Your money can't be lent out or frozen</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                  <span><strong>Global Access:</strong> Your wallet works anywhere with internet</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                  <span><strong>Privacy:</strong> No need to share personal information</span>
                                </li>
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-medium text-emerald-300">Traditional Finance vs Bitcoin:</h5>
                              <div className="grid gap-2 md:grid-cols-2">
                                <div className="p-3 bg-red-600/10 border border-red-600/20 rounded-lg">
                                  <h6 className="font-medium text-red-300 mb-1">Traditional Banking</h6>
                                  <ul className="text-xs text-red-100 space-y-1">
                                    <li>• Banks can freeze your account</li>
                                    <li>• Government can seize funds</li>
                                    <li>• Requires ID and credit checks</li>
                                    <li>• Limited by business hours</li>
                                    <li>• High fees for international transfers</li>
                                  </ul>
                                </div>
                                <div className="p-3 bg-emerald-600/10 border border-emerald-600/20 rounded-lg">
                                  <h6 className="font-medium text-emerald-300 mb-1">Bitcoin Self-Custody</h6>
                                  <ul className="text-xs text-emerald-100 space-y-1">
                                    <li>• Only you control your private keys</li>
                                    <li>• No permission needed to transact</li>
                                    <li>• Pseudonymous transactions</li>
                                    <li>• Works 24/7 globally</li>
                                    <li>• Low fees for any amount</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
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

        {/* Practice Section */}
        {activeSection === "practice" && (
          <div className="space-y-6">
            {/* Practice Sub-navigation */}
            <div className="flex justify-center">
              <div className="flex flex-wrap justify-center gap-2 bg-zinc-800/50 rounded-lg p-2">
                <Button
                  variant={practiceSubTab === "safety" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setPracticeSubTab("safety")}
                  className="text-xs px-3 py-1"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Safety
                </Button>
                <Button
                  variant={practiceSubTab === "transactions" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setPracticeSubTab("transactions")}
                  className="text-xs px-3 py-1"
                >
                  <CreditCard className="w-3 h-3 mr-1" />
                  Transactions
                </Button>
                <Button
                  variant={practiceSubTab === "hodl" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setPracticeSubTab("hodl")}
                  className="text-xs px-3 py-1"
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  HODL
                </Button>
                <Button
                  variant={practiceSubTab === "dca" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setPracticeSubTab("dca")}
                  className="text-xs px-3 py-1"
                >
                  <BarChart3 className="w-3 h-3 mr-1" />
                  DCA
                </Button>
              </div>
            </div>

            {/* Safety Training */}
            {practiceSubTab === "safety" && (
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
            {practiceSubTab === "transactions" && (
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
                              className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:border-orange-500 focus:outline-none"
                              placeholder="Recipient's Bitcoin address"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={simulatePasteFromClipboard}
                              className="border-zinc-700 text-zinc-300 hover:border-orange-500 hover:text-orange-400 text-xs px-3 whitespace-nowrap"
                              title="Paste from clipboard"
                            >
                              📋 Paste
                            </Button>
                          </div>
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

                      {/* Visual Transaction Flow */}
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
                          <Wallet className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                          <h5 className="font-medium text-white mb-1">From</h5>
                          <p className="text-zinc-400 text-xs break-all">{transactionInputs.fromAddress.slice(0, 20)}...</p>
                        </div>
                        <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
                          <ArrowRight className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                          <h5 className="font-medium text-white mb-1">Amount</h5>
                          <p className="text-orange-400 font-medium">{transactionInputs.amount} BTC</p>
                        </div>
                        <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
                          <UserIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
                          <h5 className="font-medium text-white mb-1">To</h5>
                          <p className="text-zinc-400 text-xs break-all">{transactionInputs.toAddress.slice(0, 20)}...</p>
                        </div>
                      </div>

                      {/* Calculated Transaction Details */}
                      <div className="space-y-4">
                        <h5 className="font-medium text-white">Calculated Transaction Details</h5>
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="p-3 bg-zinc-800/30 rounded-lg">
                            <p className="text-zinc-400 text-sm">Network Fee</p>
                            <p className="text-white font-medium">{calculateTransactionFee()} BTC</p>
                          </div>
                          <div className="p-3 bg-zinc-800/30 rounded-lg">
                            <p className="text-zinc-400 text-sm">Total Cost</p>
                            <p className="text-white font-medium">{(parseFloat(transactionInputs.amount) + parseFloat(calculateTransactionFee())).toFixed(8)} BTC</p>
                          </div>
                          <div className="p-3 bg-zinc-800/30 rounded-lg">
                            <p className="text-zinc-400 text-sm">Transaction Size</p>
                            <p className="text-white font-medium">226 bytes</p>
                          </div>
                          <div className="p-3 bg-zinc-800/30 rounded-lg">
                            <p className="text-zinc-400 text-sm">Confirmation Time</p>
                            <p className="text-white font-medium">
                              {parseFloat(transactionInputs.feeRate) > 10 ? "~10 min" : 
                               parseFloat(transactionInputs.feeRate) > 5 ? "~20 min" : "30+ min"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Fee Rate Guide */}
                      <div className="p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                        <h5 className="font-medium text-blue-300 mb-2">Fee Rate Guide:</h5>
                        <div className="grid gap-2 md:grid-cols-3 text-sm">
                          <div className="p-2 bg-red-600/10 rounded border border-red-600/20">
                            <span className="text-red-300 font-medium">1-4 sat/vB:</span>
                            <span className="text-red-100"> Slow (30+ min)</span>
                          </div>
                          <div className="p-2 bg-yellow-600/10 rounded border border-yellow-600/20">
                            <span className="text-yellow-300 font-medium">5-10 sat/vB:</span>
                            <span className="text-yellow-100"> Medium (10-20 min)</span>
                          </div>
                          <div className="p-2 bg-green-600/10 rounded border border-green-600/20">
                            <span className="text-green-300 font-medium">10+ sat/vB:</span>
                            <span className="text-green-100"> Fast (~10 min)</span>
                          </div>
                        </div>
                      </div>

                      {/* Transaction Steps */}
                      <div className="p-4 bg-orange-600/10 border border-orange-600/20 rounded-lg">
                        <h5 className="font-medium text-orange-300 mb-2">How This Transaction Works:</h5>
                        <ol className="space-y-2 text-zinc-300 text-sm">
                          <li className="flex items-start gap-2">
                            <span className="text-orange-400 font-medium mt-1">1.</span>
                            <span>Your wallet selects unspent transaction outputs (UTXOs) that total at least {transactionInputs.amount} BTC</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-400 font-medium mt-1">2.</span>
                            <span>A transaction is created specifying inputs, outputs, and fee of {calculateTransactionFee()} BTC</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-400 font-medium mt-1">3.</span>
                            <span>Your private key creates a digital signature proving ownership of the inputs</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-400 font-medium mt-1">4.</span>
                            <span>The signed transaction is broadcast to the Bitcoin network for validation</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-400 font-medium mt-1">5.</span>
                            <span>Miners include it in a block, and it gets {parseFloat(transactionInputs.feeRate) > 10 ? "fast" : "standard"} confirmation</span>
                          </li>
                        </ol>
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
                                
                                {/* Fee Priority Selection */}
                                <div className="space-y-3 mb-4">
                                  <label className="text-sm font-medium text-zinc-300">Fee Priority</label>
                                  <div className="grid gap-2">
                                    {Object.entries(feeOptions).map(([key, option]) => (
                                      <div
                                        key={key}
                                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                          transactionInputs.feeRate === key
                                            ? 'bg-orange-600/20 border-orange-500'
                                            : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600'
                                        }`}
                                        onClick={() => setTransactionInputs(prev => ({ ...prev, feeRate: key }))}
                                      >
                                        <div className="flex justify-between items-center">
                                          <div>
                                            <p className="text-white font-medium">{option.priority}</p>
                                            <p className="text-zinc-400 text-xs">{option.rate} sat/vB • {option.time} confirmation time estimate</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-orange-400 font-mono">{option.cost} BTC</p>
                                            <p className="text-zinc-500 text-xs">${getUSDValue(option.cost)}</p>
                                          </div>
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
                                    <span className="text-white font-mono">{transactionInputs.toAddress.slice(0, 15)}...</span>
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

            {/* HODL Strategy */}
            {practiceSubTab === "hodl" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">Interactive HODL Calculator</h3>
                  <p className="text-zinc-400">Explore the power of long-term holding with adjustable parameters</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="bg-green-900/20 border-green-800">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-600/20 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-green-400" />
                          </div>
                          <h4 className="text-lg font-bold text-white">HODL Strategy</h4>
                        </div>
                        <div className="space-y-3">
                          <div className="p-3 bg-green-800/20 rounded-lg">
                            <p className="text-green-300 font-medium text-sm">$10,000 Initial Investment</p>
                            <p className="text-green-200 text-xs">Held for 4 years (2020-2024)</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-zinc-400 text-sm">Final Value</span>
                              <span className="text-green-400 font-medium">$28,500</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400 text-sm">Total Return</span>
                              <span className="text-green-400 font-medium">+185%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400 text-sm">Trading Fees</span>
                              <span className="text-green-400 font-medium">$25</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400 text-sm">Tax Liability</span>
                              <span className="text-green-400 font-medium">$3,700</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-red-900/20 border-red-800">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-600/20 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-red-400" />
                          </div>
                          <h4 className="text-lg font-bold text-white">Active Trading</h4>
                        </div>
                        <div className="space-y-3">
                          <div className="p-3 bg-red-800/20 rounded-lg">
                            <p className="text-red-300 font-medium text-sm">$10,000 Initial Investment</p>
                            <p className="text-red-200 text-xs">50 trades over 4 years</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-zinc-400 text-sm">Final Value</span>
                              <span className="text-red-400 font-medium">$18,200</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400 text-sm">Total Return</span>
                              <span className="text-red-400 font-medium">+82%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400 text-sm">Trading Fees</span>
                              <span className="text-red-400 font-medium">$1,250</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400 text-sm">Tax Liability</span>
                              <span className="text-red-400 font-medium">$2,460</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-bold text-white mb-4">Key Insights</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <h5 className="font-medium text-green-300">HODL Advantages</h5>
                        <ul className="space-y-1 text-zinc-300 text-sm">
                          <li>• Lower fees and taxes</li>
                          <li>• Reduced stress and time commitment</li>
                          <li>• Benefits from long-term appreciation</li>
                          <li>• No emotional trading decisions</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-red-300">Trading Challenges</h5>
                        <ul className="space-y-1 text-zinc-300 text-sm">
                          <li>• High fees compound over time</li>
                          <li>• Short-term gains taxed as income</li>
                          <li>• Difficult to time markets consistently</li>
                          <li>• Emotional decision making</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Interactive DCA Calculator */}
            {practiceSubTab === "dca" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">Interactive DCA Calculator</h3>
                  <p className="text-zinc-400">Configure your strategy and see how dollar-cost averaging performs with real Bitcoin price history</p>
                </div>

                {/* Input Controls */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-bold text-white mb-4">Configure Your DCA Strategy</h4>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {/* Investment Amount */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-white">Monthly Investment Amount</label>
                        <Select 
                          value={dcaInputs.monthlyAmount.toString()} 
                          onValueChange={(value) => setDcaInputs(prev => ({ ...prev, monthlyAmount: Number(value) }))}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectValue placeholder="Select amount" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700">
                            <SelectItem value="25">$25/month</SelectItem>
                            <SelectItem value="50">$50/month</SelectItem>
                            <SelectItem value="75">$75/month</SelectItem>
                            <SelectItem value="100">$100/month</SelectItem>
                            <SelectItem value="150">$150/month</SelectItem>
                            <SelectItem value="200">$200/month</SelectItem>
                            <SelectItem value="250">$250/month</SelectItem>
                            <SelectItem value="300">$300/month</SelectItem>
                            <SelectItem value="400">$400/month</SelectItem>
                            <SelectItem value="500">$500/month</SelectItem>
                            <SelectItem value="750">$750/month</SelectItem>
                            <SelectItem value="1000">$1,000/month</SelectItem>
                            <SelectItem value="1500">$1,500/month</SelectItem>
                            <SelectItem value="2000">$2,000/month</SelectItem>
                            <SelectItem value="2500">$2,500/month</SelectItem>
                            <SelectItem value="5000">$5,000/month</SelectItem>
                            <SelectItem value="10000">$10,000/month</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Frequency */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-white">Purchase Frequency</label>
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

                      {/* Time Period */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-white">Investment Duration</label>
                        <Select 
                          value={dcaInputs.duration.toString()} 
                          onValueChange={(value) => setDcaInputs(prev => ({ ...prev, duration: Number(value) }))}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700">
                            <SelectItem value="3">3 months</SelectItem>
                            <SelectItem value="6">6 months</SelectItem>
                            <SelectItem value="9">9 months</SelectItem>
                            <SelectItem value="12">1 year</SelectItem>
                            <SelectItem value="18">1.5 years</SelectItem>
                            <SelectItem value="24">2 years</SelectItem>
                            <SelectItem value="30">2.5 years</SelectItem>
                            <SelectItem value="36">3 years</SelectItem>
                            <SelectItem value="48">4 years</SelectItem>
                            <SelectItem value="60">5 years</SelectItem>
                            <SelectItem value="84">7 years</SelectItem>
                            <SelectItem value="120">10 years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Start Date */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-white">Historical Start Date</label>
                        <Select 
                          value={dcaInputs.startDate} 
                          onValueChange={(value) => setDcaInputs(prev => ({ ...prev, startDate: value }))}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectValue placeholder="Select start date" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700">
                            <SelectItem value="2019-01-01">Jan 2019 (Post-Crash Recovery)</SelectItem>
                            <SelectItem value="2019-07-01">Jul 2019 (Mid-Year Rally)</SelectItem>
                            <SelectItem value="2020-01-01">Jan 2020 (Pre-Pandemic)</SelectItem>
                            <SelectItem value="2020-03-01">Mar 2020 (COVID Crash)</SelectItem>
                            <SelectItem value="2020-07-01">Jul 2020 (Recovery Begin)</SelectItem>
                            <SelectItem value="2020-10-01">Oct 2020 (Institutional Wave)</SelectItem>
                            <SelectItem value="2021-01-01">Jan 2021 (Bull Run Start)</SelectItem>
                            <SelectItem value="2021-05-01">May 2021 (Peak & Crash)</SelectItem>
                            <SelectItem value="2021-07-01">Jul 2021 (Summer Lows)</SelectItem>
                            <SelectItem value="2021-10-01">Oct 2021 (ATH Approach)</SelectItem>
                            <SelectItem value="2022-01-01">Jan 2022 (Bear Market Start)</SelectItem>
                            <SelectItem value="2022-06-01">Jun 2022 (Deep Bear)</SelectItem>
                            <SelectItem value="2022-11-01">Nov 2022 (FTX Collapse)</SelectItem>
                            <SelectItem value="2023-01-01">Jan 2023 (Bear Bottom)</SelectItem>
                            <SelectItem value="2023-06-01">Jun 2023 (Recovery Start)</SelectItem>
                            <SelectItem value="2023-10-01">Oct 2023 (ETF Anticipation)</SelectItem>
                            <SelectItem value="2024-01-01">Jan 2024 (ETF Approval)</SelectItem>
                            <SelectItem value="2024-06-01">Jun 2024 (Recent Past)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                      <p className="text-zinc-400 text-xs">
                        <Info className="w-3 h-3 inline mr-1" />
                        This simulation uses historically-accurate Bitcoin price data and volatility patterns. 
                        Results will vary on each calculation to simulate real market conditions.
                      </p>
                    </div>

                    <Button 
                      onClick={calculateDcaStrategy}
                      className="w-full mt-6 bg-orange-600 hover:bg-orange-700"
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculate DCA Performance
                    </Button>
                  </CardContent>
                </Card>

                {/* Results Display */}
                {dcaResults && (
                  <>
                    {/* Summary Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card className="bg-blue-900/20 border-blue-800">
                        <CardContent className="p-4 text-center">
                          <DollarSign className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                          <h5 className="font-medium text-white mb-1">Total Invested</h5>
                          <p className="text-blue-400 font-bold text-lg">${dcaResults.totalInvested.toLocaleString()}</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-orange-900/20 border-orange-800">
                        <CardContent className="p-4 text-center">
                          <Coins className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                          <h5 className="font-medium text-white mb-1">Bitcoin Accumulated</h5>
                          <p className="text-orange-400 font-bold text-lg">{dcaResults.totalBitcoin.toFixed(6)} BTC</p>
                          <p className="text-zinc-400 text-xs">{(dcaResults.totalBitcoin * 100000000).toFixed(0)} sats</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-green-900/20 border-green-800">
                        <CardContent className="p-4 text-center">
                          <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                          <h5 className="font-medium text-white mb-1">Current Value</h5>
                          <p className="text-green-400 font-bold text-lg">${dcaResults.currentValue.toLocaleString()}</p>
                        </CardContent>
                      </Card>
                      
                      <Card className={`border ${dcaResults.totalGain >= 0 ? 'bg-green-900/20 border-green-800' : 'bg-red-900/20 border-red-800'}`}>
                        <CardContent className="p-4 text-center">
                          {dcaResults.totalGain >= 0 ? 
                            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" /> :
                            <TrendingDown className="w-8 h-8 text-red-400 mx-auto mb-2" />
                          }
                          <h5 className="font-medium text-white mb-1">Total Return</h5>
                          <p className={`font-bold text-lg ${dcaResults.totalGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {dcaResults.percentageReturn >= 0 ? '+' : ''}{dcaResults.percentageReturn.toFixed(1)}%
                          </p>
                          <p className={`text-xs ${dcaResults.totalGain >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                            ${dcaResults.totalGain >= 0 ? '+' : ''}{dcaResults.totalGain.toLocaleString()}
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
                              {/* Y-axis labels */}
                              <div className="absolute left-2 top-4 text-zinc-400 text-xs">
                                $100k
                              </div>
                              <div className="absolute left-2 top-1/2 text-zinc-400 text-xs">
                                $50k
                              </div>
                              <div className="absolute left-2 bottom-8 text-zinc-400 text-xs">
                                $10k
                              </div>
                              
                              {/* Simulated Bitcoin price line */}
                              <svg className="w-full h-full" viewBox="0 0 400 200">
                                {/* Price curve - simulated historical data */}
                                <path
                                  d="M 20 160 Q 80 140 120 100 Q 160 80 200 120 Q 240 140 280 90 Q 320 70 360 60"
                                  stroke="#f97316"
                                  strokeWidth="3"
                                  fill="none"
                                  className="drop-shadow-sm"
                                />
                                
                                {/* DCA purchase points */}
                                {Array.from({ length: Math.min(dcaResults.duration, 12) }, (_, i) => {
                                  const x = 20 + (i * 340 / Math.max(dcaResults.duration - 1, 1));
                                  const y = 160 - (Math.random() * 80 + 40); // Simulated varying prices
                                  return (
                                    <g key={i}>
                                      <circle
                                        cx={x}
                                        cy={y}
                                        r="4"
                                        fill="#22c55e"
                                        className="drop-shadow-sm"
                                      />
                                      <circle
                                        cx={x}
                                        cy={y}
                                        r="8"
                                        fill="#22c55e"
                                        fillOpacity="0.3"
                                        className="animate-pulse"
                                      />
                                    </g>
                                  );
                                })}
                                
                                {/* Average cost line */}
                                <line
                                  x1="20"
                                  y1="100"
                                  x2="360"
                                  y2="100"
                                  stroke="#3b82f6"
                                  strokeWidth="2"
                                  strokeDasharray="5,5"
                                  opacity="0.8"
                                />
                              </svg>
                              
                              {/* Legend */}
                              <div className="absolute bottom-2 left-4 flex gap-4 text-xs">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-0.5 bg-orange-500"></div>
                                  <span className="text-zinc-400">Bitcoin Price</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                  <span className="text-zinc-400">DCA Purchases</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-0.5 bg-blue-500 border-dashed"></div>
                                  <span className="text-zinc-400">Average Cost</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-center p-3 bg-blue-900/20 rounded-lg">
                            <p className="text-blue-300 text-sm">
                              <Info className="w-4 h-4 inline mr-1" />
                              Your average purchase price: <span className="font-medium">${dcaResults.averagePrice.toLocaleString()}</span> 
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
                                <span className="text-white">{dcaResults.totalBitcoin.toFixed(6)} BTC</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Average Price</span>
                                <span className="text-white">${dcaResults.averagePrice.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between font-medium">
                                <span className="text-zinc-300">Current Value</span>
                                <span className="text-green-400">${dcaResults.currentValue.toLocaleString()}</span>
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
                                <span className="text-white">{(dcaResults.totalInvested / (dcaResults.averagePrice * 0.7)).toFixed(6)} BTC</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Purchase Price</span>
                                <span className="text-white">${(dcaResults.averagePrice * 0.7).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between font-medium">
                                <span className="text-zinc-300">Current Value</span>
                                <span className="text-orange-400">${((dcaResults.totalInvested / (dcaResults.averagePrice * 0.7)) * 50000).toLocaleString()}</span>
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
          </div>
        )}

        {/* More Section - Store Only */}
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
                        <p className="text-zinc-400 text-sm mb-3">Bluetooth-enabled hardware wallet with mobile app support.</p>
                        <Button 
                          size="sm" 
                          className="w-full bg-orange-600 hover:bg-orange-700"
                          onClick={() => window.open('https://shop.ledger.com/?r=btc-journey', '_blank')}
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
                        <p className="text-zinc-400 text-sm mb-3">Premium hardware wallet with touchscreen interface.</p>
                        <Button 
                          size="sm" 
                          className="w-full bg-orange-600 hover:bg-orange-700"
                          onClick={() => window.open('https://trezor.io/?offer=btc-journey', '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-2" />
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Essential Books */}
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
                        <p className="text-zinc-400 text-sm mb-3">Deep dive into monetary history and Bitcoin's role.</p>
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
                          <span className="text-orange-400 font-bold">$16</span>
                        </div>
                        <p className="text-zinc-400 text-sm mb-1">by Saifedean Ammous</p>
                        <p className="text-zinc-400 text-sm mb-3">The definitive guide to understanding Bitcoin.</p>
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

              {/* Affiliate Disclosure */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-600/20 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-green-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Affiliate Disclosure</h3>
                    </div>
                    
                    <div className="space-y-3 text-sm text-zinc-400">
                      <p>
                        BTC Journey may receive commissions when you purchase products through our affiliate links. 
                        This helps support our educational mission.
                      </p>
                      <p>
                        We only recommend products we genuinely believe in and that align with Bitcoin's principles 
                        of self-sovereignty and security.
                      </p>
                      <p className="text-green-400 font-medium">
                        Your purchase price remains the same, and you help support Bitcoin education.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}