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

const iconMap = {
  coins: Coins,
  cube: Box,
  "shield-alt": Shield,
  "user-secret": KeyRound,
  gem: Gem,
  bolt: Zap,
  "dollar-sign": DollarSign,
  building: Building2,
  "alert-triangle": AlertTriangle,
};

type MainSection = "foundation" | "practice" | "inspiration";
type FoundationSubTab = "basics" | "lesson" | "quiz" | "explore" | "disruption" | "terms";
type PracticeSubTab = "mining" | "transactions" | "hodl" | "dca" | "halving";
type InspirationSubTab = "stories" | "conviction";
type DisruptionSubTab = "problems" | "solutions" | "comparison" | "future";
type StoriesSubTab = "individuals" | "businesses" | "nations";
type ConvictionSubTab = "whitepaper" | "books" | "videos";

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
      name: "MicroStrategy",
      role: "Business Intelligence",
      story: "CEO Michael Saylor led the company to adopt Bitcoin as treasury reserve, buying over 190,000 BTC since 2020.",
      reason: "Corporate treasury strategy and inflation hedge"
    },
    {
      name: "Tesla",
      role: "Electric Vehicles", 
      story: "Added Bitcoin to balance sheet and briefly accepted it for car purchases before focusing on environmental concerns.",
      reason: "Diversification and innovation in payments"
    },
    {
      name: "Strike",
      role: "Financial Services",
      story: "Built Lightning Network infrastructure to enable instant, low-cost Bitcoin payments globally.",
      reason: "Revolutionary payment rails and financial inclusion"
    }
  ],
  nations: [
    {
      name: "El Salvador",
      role: "President Nayib Bukele",
      story: "First country to adopt Bitcoin as legal tender in 2021, aiming to increase financial inclusion and attract investment.",
      reason: "Financial inclusion and economic sovereignty"
    },
    {
      name: "Switzerland",
      role: "Crypto Valley Initiative",
      story: "Created favorable regulations in Zug, becoming a global hub for blockchain companies and Bitcoin adoption.",
      reason: "Innovation leadership and economic development"
    },
    {
      name: "Miami",
      role: "Mayor Francis Suarez",
      story: "Exploring Bitcoin for city treasury and employee salaries, positioning Miami as a Bitcoin-friendly city.",
      reason: "Economic innovation and talent attraction"
    }
  ]
};

const explorationTopics = [
  {
    id: 1,
    title: "What is a Blockchain?",
    description: "Understanding the distributed ledger technology that powers Bitcoin",
    content: `A blockchain is like a digital ledger that's shared across thousands of computers worldwide. Instead of one central authority keeping records, everyone has a copy.

## How It Works

Think of it like a notebook that gets photocopied and distributed to thousands of people. When someone wants to add a new page:

1. **Proposal**: They announce what they want to write
2. **Verification**: The majority checks if it's valid
3. **Addition**: If approved, everyone adds the same page
4. **Synchronization**: All notebooks stay identical

## Key Properties

**Immutable**: Once written, pages can't be changed without everyone noticing
**Transparent**: Everyone can read the entire history
**Decentralized**: No single person controls the notebook
**Secure**: Cryptography ensures only valid entries are accepted`,
    visualAid: "blockchain-structure",
    category: "Technology"
  },
  {
    id: 2,
    title: "What is Proof of Work?",
    description: "The energy-intensive process that secures the Bitcoin network",
    content: `Proof of Work is Bitcoin's security mechanism. Imagine a massive, ongoing puzzle competition where participants (miners) compete to solve complex mathematical problems.

## The Process

**1. Transaction Collection**: Miners gather pending transactions
**2. Puzzle Solving**: They compete to solve a cryptographic puzzle
**3. Winner Selection**: First to solve broadcasts their solution
**4. Verification**: Others quickly check if the solution is correct
**5. Block Addition**: The winner adds transactions to the blockchain

## Why Energy?

The energy expenditure isn't wasteful—it's the security feature. Just like a bank vault requires significant resources to build and maintain, Bitcoin's security requires computational work.

**Energy → Security → Trust → Value**

The more energy securing the network, the more expensive it becomes to attack, making Bitcoin more secure and trustworthy.`,
    visualAid: "proof-of-work",
    category: "Mining"
  },
  {
    id: 3,
    title: "Digital Signatures",
    description: "How Bitcoin ensures only you can spend your coins",
    content: `Digital signatures are Bitcoin's way of proving ownership without revealing secrets. It's like having a unique, unforgeable signature that only you can create.

## The Magic

**Private Key**: Your secret signing pen (never share this!)
**Public Key**: Your signature verification stamp (safe to share)
**Digital Signature**: Proof you authorized a transaction

## How It Works

1. **Sign**: Use your private key to "sign" a transaction
2. **Broadcast**: Send the signed transaction to the network  
3. **Verify**: Others use your public key to confirm your signature
4. **Execute**: If valid, the transaction processes

## Security

Even if someone sees your signature on a transaction, they can't forge your signature for a different transaction. Each signature is unique to both your private key and the specific transaction data.`,
    visualAid: "digital-signatures",
    category: "Cryptography"
  },
  {
    id: 4,
    title: "The Lightning Network",
    description: "Bitcoin's layer 2 solution for instant, low-cost payments",
    content: `The Lightning Network is like opening a tab at your favorite coffee shop, but for Bitcoin. Instead of paying on-chain for every coffee, you open a payment channel and settle the final amount later.

## How It Works

**1. Channel Opening**: Two parties lock Bitcoin in a shared address
**2. Off-Chain Transactions**: Exchange signed IOUs instantly
**3. Channel Closing**: Final settlement publishes net result to blockchain

## Network Effects

Multiple channels create a network where you can pay anyone through connected paths, even without direct channels.

**Alice ↔ Bob ↔ Carol ↔ Dave**

Alice can pay Dave by routing through Bob and Carol, with cryptographic guarantees ensuring security.

## Benefits

✓ **Instant**: Payments in milliseconds
✓ **Cheap**: Fees measured in satoshis  
✓ **Private**: Individual payments aren't publicly recorded
✓ **Scalable**: Millions of transactions per second possible`,
    visualAid: "lightning-network",
    category: "Scaling"
  },
  {
    id: 5,
    title: "Bitcoin's Fixed Supply",
    description: "Why 21 million Bitcoin is a feature, not a limitation",
    content: `Unlike traditional currencies that can be printed endlessly, Bitcoin has a hard cap of 21 million coins. This scarcity is programmed into the code and cannot be changed.

## The Halving Schedule

Every 210,000 blocks (roughly 4 years), the mining reward cuts in half:

**2009-2012**: 50 BTC per block
**2012-2016**: 25 BTC per block  
**2016-2020**: 12.5 BTC per block
**2020-2024**: 6.25 BTC per block
**2024-2028**: 3.125 BTC per block

## Why This Matters

**Predictable Supply**: No surprises or inflation shocks
**Digital Scarcity**: First time in history we have provably scarce digital asset
**Store of Value**: Scarcity + utility = potential value preservation

## Economic Impact

As new Bitcoin creation slows, existing coins become more valuable if demand remains constant or grows. This encourages long-term thinking over short-term consumption.`,
    visualAid: "bitcoin-supply",
    category: "Economics"
  }
];

const convictionResources = {
  whitepaper: {
    title: "Bitcoin: A Peer-to-Peer Electronic Cash System",
    author: "Satoshi Nakamoto",
    date: "October 31, 2008",
    url: "https://bitcoin.org/bitcoin.pdf",
    summary: "The original Bitcoin white paper that started it all. In just 9 pages, Satoshi Nakamoto outlined a revolutionary peer-to-peer electronic cash system that would eliminate the need for trusted third parties. The paper introduces the concepts of digital signatures, proof-of-work, and the longest chain rule that form the foundation of Bitcoin.",
    keyPoints: [
      "Introduces the double-spending problem and its solution",
      "Explains proof-of-work consensus mechanism",
      "Details the structure of transactions and blocks",
      "Describes the incentive system for miners",
      "Calculates the probability of successful attacks",
      "Outlines simplified payment verification (SPV)"
    ]
  },
  books: [
    {
      title: "The Bitcoin Standard",
      author: "Saifedean Ammous",
      year: "2018",
      description: "A comprehensive examination of Bitcoin's role as sound money and its potential to replace fiat currencies. Ammous explores the history of money, the properties of sound money, and why Bitcoin represents the best form of money humanity has ever had.",
      keyTopics: ["Monetary history", "Sound money properties", "Austrian economics", "Time preference"],
      difficulty: "Intermediate"
    },
    {
      title: "Mastering Bitcoin",
      author: "Andreas M. Antonopoulos",
      year: "2017",
      description: "The definitive technical guide to Bitcoin. Antonopoulos provides deep technical insights into how Bitcoin works, from basic concepts to advanced topics like payment channels and security.",
      keyTopics: ["Technical implementation", "Cryptography", "Network protocol", "Programming"],
      difficulty: "Advanced"
    },
    {
      title: "The Bullish Case for Bitcoin",
      author: "Vijay Boyapati",
      year: "2019",
      description: "Originally an article that became a book, this work presents the investment thesis for Bitcoin. Boyapati explains why Bitcoin is the ultimate store of value and compares it to gold and other assets.",
      keyTopics: ["Store of value", "Monetary properties", "Investment thesis", "Market dynamics"],
      difficulty: "Beginner"
    },
    {
      title: "Sovereignty Through Mathematics",
      author: "Knut Svanholm",
      year: "2019",
      description: "A philosophical exploration of Bitcoin's implications for individual sovereignty. Svanholm argues that Bitcoin represents true freedom through mathematical certainty rather than political promises.",
      keyTopics: ["Individual sovereignty", "Philosophy", "Freedom", "Mathematical certainty"],
      difficulty: "Intermediate"
    },
    {
      title: "The Fiat Standard",
      author: "Saifedean Ammous",
      year: "2021",
      description: "The follow-up to The Bitcoin Standard, examining the flaws of the current fiat monetary system and how it has corrupted various aspects of modern life, from academia to agriculture.",
      keyTopics: ["Fiat currency critique", "Central banking", "Economic distortions", "Government overreach"],
      difficulty: "Intermediate"
    },
    {
      title: "Check Your Financial Privilege",
      author: "Alex Gladstein",
      year: "2022",
      description: "Gladstein explores how Bitcoin serves as a tool for financial freedom, particularly for people living under authoritarian regimes or in countries with unstable currencies.",
      keyTopics: ["Human rights", "Financial freedom", "Authoritarianism", "Global perspective"],
      difficulty: "Beginner"
    }
  ],
  videos: [
    {
      title: "Bitcoin: The End of Money as We Know It",
      creator: "Torsten Hoffmann",
      year: "2015",
      duration: "60 minutes",
      type: "Documentary",
      description: "A comprehensive documentary exploring the history of money, the problems with the current financial system, and how Bitcoin offers a solution.",
      url: "https://www.youtube.com/watch?v=lUF6klWuB38"
    },
    {
      title: "The Stories We Tell About Money",
      creator: "Andreas Antonopoulos",
      year: "2019",
      duration: "20 minutes",
      type: "Talk",
      description: "Antonopoulos explains how our stories about money shape our understanding and why Bitcoin represents a new narrative about what money can be.",
      url: "https://www.youtube.com/watch?v=ONvg9SbauMg"
    },
    {
      title: "Bitcoin and Human Rights",
      creator: "Alex Gladstein",
      year: "2021",
      duration: "45 minutes",
      type: "Presentation",
      description: "Gladstein presents compelling cases of how Bitcoin is being used by people living under oppressive regimes to preserve their wealth and freedom.",
      url: "https://www.youtube.com/watch?v=xLYYh4aPXAM"
    },
    {
      title: "Michael Saylor on Bitcoin",
      creator: "Lex Fridman Podcast",
      year: "2021",
      duration: "180 minutes",
      type: "Interview",
      description: "MicroStrategy CEO Michael Saylor explains his company's Bitcoin strategy and why he believes Bitcoin is the future of money and energy.",
      url: "https://www.youtube.com/watch?v=mC43pZkpTec"
    },
    {
      title: "The Bitcoin Standard Explained",
      creator: "What Bitcoin Did",
      year: "2020",
      duration: "90 minutes",
      type: "Interview",
      description: "Author Saifedean Ammous discusses the key concepts from his book 'The Bitcoin Standard' and explains why Bitcoin is superior money.",
      url: "https://www.youtube.com/watch?v=Zbm772vF-5M"
    },
    {
      title: "How Bitcoin Fixes This",
      creator: "Jimmy Song",
      year: "2020",
      duration: "30 minutes",
      type: "Educational",
      description: "Developer and educator Jimmy Song explains how Bitcoin addresses various problems in the current financial system.",
      url: "https://www.youtube.com/watch?v=la0qLnpCjjE"
    },
    {
      title: "Bitcoin vs Gold Debate",
      creator: "Peter Schiff vs Erik Voorhees",
      year: "2020",
      duration: "60 minutes",
      type: "Debate",
      description: "A classic debate between gold advocate Peter Schiff and Bitcoin advocate Erik Voorhees about which is the better store of value.",
      url: "https://www.youtube.com/watch?v=q8R71_tYkfk"
    },
    {
      title: "The Network State",
      creator: "Balaji Srinivasan",
      year: "2022",
      duration: "120 minutes",
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

export default function Home() {
  const [activeSection, setActiveSection] = useState<MainSection>("foundation");
  const [foundationSubTab, setFoundationSubTab] = useState<FoundationSubTab>("basics");
  const [practiceSubTab, setPracticeSubTab] = useState<PracticeSubTab>("mining");
  const [inspirationSubTab, setInspirationSubTab] = useState<InspirationSubTab>("stories");
  const [disruptionSubTab, setDisruptionSubTab] = useState<DisruptionSubTab>("problems");
  const [storiesSubTab, setStoriesSubTab] = useState<StoriesSubTab>("individuals");
  const [convictionSubTab, setConvictionSubTab] = useState<ConvictionSubTab>("whitepaper");
  const [showPriceChart, setShowPriceChart] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<Set<number>>(new Set());

  // Splash screen effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // API Queries
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
    queryFn: () => fetch('/api/user').then(res => res.json()) as Promise<User>
  });

  const { data: dailyFacts = [] } = useQuery({
    queryKey: ['/api/daily-facts'],
    queryFn: () => fetch('/api/daily-facts').then(res => res.json()) as Promise<DailyFact[]>
  });

  const { data: lesson } = useQuery({
    queryKey: ['/api/lesson'],
    queryFn: () => fetch('/api/lesson').then(res => res.json()) as Promise<Lesson>
  });

  const { data: convictionContent = [] } = useQuery({
    queryKey: ['/api/conviction-content'],
    queryFn: () => fetch('/api/conviction-content').then(res => res.json()) as Promise<ConvictionContent[]>
  });

  const { data: bitcoinPrice } = useQuery({
    queryKey: ['/api/bitcoin-price'],
    queryFn: () => fetch('/api/bitcoin-price').then(res => res.json()),
    refetchInterval: 30000
  });

  // Splash Screen
  if (showSplash) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="flex items-center justify-center gap-3">
            <div className="text-orange-400 text-5xl font-bold">₿</div>
            <h1 className="text-4xl font-bold text-white">BTC <span className="text-orange-400">Journey</span></h1>
          </div>
          <p className="text-zinc-400 text-lg">Loading your Bitcoin Journey</p>
          <div className="w-64 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-orange-400 text-xl font-bold">₿</div>
              <h1 className="text-lg font-semibold text-white">BTC <span className="text-orange-400">Journey</span></h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPriceChart(!showPriceChart)}
                className="text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <Bitcoin className="w-4 h-4 mr-1" />
                <span className="text-sm font-mono">
                  ${bitcoinPrice?.priceUsd ? Number(bitcoinPrice.priceUsd).toLocaleString() : '...'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <nav className="bg-zinc-900/50 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center gap-8 py-3">
            <Button
              variant={activeSection === "foundation" ? "default" : "ghost"}
              size="lg"
              onClick={() => setActiveSection("foundation")}
              className={`${activeSection === "foundation" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"} px-6 py-3`}
            >
              <GraduationCap className="w-5 h-5 mr-2" />
              Foundation
            </Button>
            <Button
              variant={activeSection === "practice" ? "default" : "ghost"}
              size="lg"
              onClick={() => setActiveSection("practice")}
              className={`${activeSection === "practice" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"} px-6 py-3`}
            >
              <Zap className="w-5 h-5 mr-2" />
              Practice
            </Button>
            <Button
              variant={activeSection === "inspiration" ? "default" : "ghost"}
              size="lg"
              onClick={() => setActiveSection("inspiration")}
              className={`${activeSection === "inspiration" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"} px-6 py-3`}
            >
              <Heart className="w-5 h-5 mr-2" />
              Inspiration
            </Button>
          </div>
        </div>
      </nav>

      {/* Sub Navigation */}
      {activeSection === "foundation" && (
        <div className="bg-zinc-800/30 border-b border-zinc-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-1 py-2 flex-wrap">
              <Button
                variant={foundationSubTab === "basics" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFoundationSubTab("basics")}
                className="text-xs px-2 py-1"
              >
                <Lightbulb className="w-3 h-3 mr-1" />
                Facts
              </Button>
              <Button
                variant={foundationSubTab === "lesson" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFoundationSubTab("lesson")}
                className="text-xs px-2 py-1"
              >
                <BookOpen className="w-3 h-3 mr-1" />
                Lesson
              </Button>
              <Button
                variant={foundationSubTab === "quiz" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFoundationSubTab("quiz")}
                className="text-xs px-2 py-1"
              >
                <HelpCircle className="w-3 h-3 mr-1" />
                Quiz
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
                Terms
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeSection === "practice" && (
        <div className="bg-zinc-800/30 border-b border-zinc-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-1 py-2 flex-wrap">
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
            <div className="flex items-center gap-1 py-2 flex-wrap">
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
        {/* Foundation Section */}
        {activeSection === "foundation" && (
          <div className="space-y-6">
            {foundationSubTab === "basics" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Daily Bitcoin Facts</h2>
                  <p className="text-zinc-400">Learn something new about Bitcoin every day</p>
                </div>
                
                <div className="grid gap-4">
                  {dailyFacts.map((fact, index) => {
                    const IconComponent = iconMap[fact.icon as keyof typeof iconMap] || Lightbulb;
                    return (
                      <Card key={fact.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-orange-600/10 rounded-lg flex items-center justify-center">
                              <IconComponent className="w-5 h-5 text-orange-500" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-white mb-2">{fact.title}</h3>
                              <p className="text-zinc-300 leading-relaxed">{fact.content}</p>
                              <Badge variant="outline" className="mt-3 border-zinc-700 text-zinc-400">
                                {fact.category}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {foundationSubTab === "lesson" && lesson && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Today's Lesson</h2>
                  <p className="text-zinc-400">Deep dive into Bitcoin concepts</p>
                </div>
                
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-white">{lesson.title}</h3>
                        <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                          {lesson.estimatedReadTime} min read
                        </Badge>
                      </div>
                      <div className="prose prose-invert max-w-none">
                        {lesson.content.split('\n').map((paragraph, index) => (
                          <p key={index} className="text-zinc-300 leading-relaxed mb-4">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {foundationSubTab === "quiz" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Daily Quiz</h2>
                  <p className="text-zinc-400">Test your Bitcoin knowledge</p>
                </div>
                <DailyQuiz />
              </div>
            )}

            {foundationSubTab === "explore" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Explore Bitcoin</h2>
                  <p className="text-zinc-400">Advanced topics for deeper understanding</p>
                </div>
                
                <div className="grid gap-6">
                  {explorationTopics.map((topic) => (
                    <Card key={topic.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className="p-2 bg-orange-600/20 rounded-lg">
                                  {topic.category === "Technology" && <Network className="w-5 h-5 text-orange-400" />}
                                  {topic.category === "Mining" && <Zap className="w-5 h-5 text-orange-400" />}
                                  {topic.category === "Cryptography" && <Shield className="w-5 h-5 text-orange-400" />}
                                  {topic.category === "Scaling" && <Globe className="w-5 h-5 text-orange-400" />}
                                  {topic.category === "Economics" && <TrendingUp className="w-5 h-5 text-orange-400" />}
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-white">{topic.title}</h3>
                                  <p className="text-zinc-400 text-sm">{topic.description}</p>
                                </div>
                              </div>
                              <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                                {topic.category}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)}
                              className="text-zinc-400 hover:text-white"
                            >
                              {selectedTopic === topic.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </Button>
                          </div>
                          
                          {selectedTopic === topic.id && (
                            <div className="space-y-4 pt-4 border-t border-zinc-800">
                              {/* Visual Aid Component */}
                              <div className="bg-zinc-800 rounded-lg p-4">
                                {topic.visualAid === "blockchain-structure" && (
                                  <div className="space-y-4">
                                    <h4 className="text-white font-medium">Blockchain Structure</h4>
                                    <div className="flex items-center space-x-2 overflow-x-auto">
                                      {[1, 2, 3, 4].map((block) => (
                                        <div key={block} className="flex items-center">
                                          <div className="bg-orange-600/20 border border-orange-600/40 rounded-lg p-3 min-w-[80px]">
                                            <div className="text-xs text-orange-400 text-center">Block {block}</div>
                                            <div className="text-xs text-zinc-400 text-center mt-1">Hash: {block}abc...</div>
                                          </div>
                                          {block < 4 && <ArrowRight className="w-4 h-4 text-zinc-600 mx-1" />}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {topic.visualAid === "proof-of-work" && (
                                  <div className="space-y-4">
                                    <h4 className="text-white font-medium">Proof of Work Process</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                      <div className="text-center space-y-2">
                                        <div className="bg-blue-600/20 p-3 rounded-lg">
                                          <FileText className="w-6 h-6 text-blue-400 mx-auto" />
                                        </div>
                                        <div className="text-xs text-zinc-400">Collect Transactions</div>
                                      </div>
                                      <div className="text-center space-y-2">
                                        <div className="bg-yellow-600/20 p-3 rounded-lg">
                                          <Zap className="w-6 h-6 text-yellow-400 mx-auto" />
                                        </div>
                                        <div className="text-xs text-zinc-400">Solve Puzzle</div>
                                      </div>
                                      <div className="text-center space-y-2">
                                        <div className="bg-green-600/20 p-3 rounded-lg">
                                          <Shield className="w-6 h-6 text-green-400 mx-auto" />
                                        </div>
                                        <div className="text-xs text-zinc-400">Verify Solution</div>
                                      </div>
                                      <div className="text-center space-y-2">
                                        <div className="bg-purple-600/20 p-3 rounded-lg">
                                          <Gem className="w-6 h-6 text-purple-400 mx-auto" />
                                        </div>
                                        <div className="text-xs text-zinc-400">Add Block</div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {topic.visualAid === "digital-signatures" && (
                                  <div className="space-y-4">
                                    <h4 className="text-white font-medium">Digital Signature Flow</h4>
                                    <div className="flex items-center justify-between">
                                      <div className="text-center">
                                        <div className="bg-red-600/20 p-3 rounded-lg mb-2">
                                          <KeyRound className="w-6 h-6 text-red-400 mx-auto" />
                                        </div>
                                        <div className="text-xs text-zinc-400">Private Key</div>
                                        <div className="text-xs text-red-400">(Secret)</div>
                                      </div>
                                      <ArrowRight className="w-4 h-4 text-zinc-600" />
                                      <div className="text-center">
                                        <div className="bg-orange-600/20 p-3 rounded-lg mb-2">
                                          <FileText className="w-6 h-6 text-orange-400 mx-auto" />
                                        </div>
                                        <div className="text-xs text-zinc-400">Sign Transaction</div>
                                      </div>
                                      <ArrowRight className="w-4 h-4 text-zinc-600" />
                                      <div className="text-center">
                                        <div className="bg-green-600/20 p-3 rounded-lg mb-2">
                                          <Shield className="w-6 h-6 text-green-400 mx-auto" />
                                        </div>
                                        <div className="text-xs text-zinc-400">Public Verification</div>
                                        <div className="text-xs text-green-400">(Safe to Share)</div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {topic.visualAid === "lightning-network" && (
                                  <div className="space-y-4">
                                    <h4 className="text-white font-medium">Lightning Network</h4>
                                    <div className="flex items-center justify-center space-x-4">
                                      <div className="text-center">
                                        <div className="bg-blue-600/20 p-2 rounded-full mb-1">
                                          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                        </div>
                                        <div className="text-xs text-zinc-400">Alice</div>
                                      </div>
                                      <div className="flex-1 border-t-2 border-dashed border-zinc-600 relative">
                                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-zinc-900 px-2">
                                          <Zap className="w-4 h-4 text-yellow-400" />
                                        </div>
                                      </div>
                                      <div className="text-center">
                                        <div className="bg-green-600/20 p-2 rounded-full mb-1">
                                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                        </div>
                                        <div className="text-xs text-zinc-400">Bob</div>
                                      </div>
                                      <div className="flex-1 border-t-2 border-dashed border-zinc-600 relative">
                                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-zinc-900 px-2">
                                          <Zap className="w-4 h-4 text-yellow-400" />
                                        </div>
                                      </div>
                                      <div className="text-center">
                                        <div className="bg-purple-600/20 p-2 rounded-full mb-1">
                                          <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                                        </div>
                                        <div className="text-xs text-zinc-400">Carol</div>
                                      </div>
                                    </div>
                                    <div className="text-center text-xs text-zinc-400">Instant payments through connected channels</div>
                                  </div>
                                )}
                                
                                {topic.visualAid === "bitcoin-supply" && (
                                  <div className="space-y-4">
                                    <h4 className="text-white font-medium">Bitcoin Halving Schedule</h4>
                                    <div className="space-y-2">
                                      {[
                                        { period: "2009-2012", reward: "50 BTC", width: 100 },
                                        { period: "2012-2016", reward: "25 BTC", width: 50 },
                                        { period: "2016-2020", reward: "12.5 BTC", width: 25 },
                                        { period: "2020-2024", reward: "6.25 BTC", width: 12.5 },
                                        { period: "2024-2028", reward: "3.125 BTC", width: 6.25 }
                                      ].map((halving, index) => (
                                        <div key={index} className="flex items-center space-x-4">
                                          <div className="text-xs text-zinc-400 w-20">{halving.period}</div>
                                          <div className="h-4 bg-zinc-700 rounded flex-1 relative overflow-hidden">
                                            <div className="h-full bg-orange-600/60 rounded transition-all duration-1000" style={{ width: `${halving.width}%` }}></div>
                                          </div>
                                          <div className="text-xs text-zinc-400 w-16">{halving.reward}</div>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="text-center text-xs text-zinc-400">Supply decreases over time → Increased scarcity</div>
                                  </div>
                                )}
                              </div>
                              
                              {/* Content */}
                              <div className="prose prose-invert max-w-none">
                                <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
                                  {topic.content}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {foundationSubTab === "terms" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Your Progress</h2>
                  <p className="text-zinc-400">Track your Bitcoin learning journey</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="text-center space-y-2">
                        <div className="text-2xl font-bold text-white">{user?.currentStreak || 0}</div>
                        <div className="text-sm text-zinc-400">Day Streak</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="text-center space-y-2">
                        <div className="text-2xl font-bold text-white">{user?.completedLessons || 0}</div>
                        <div className="text-sm text-zinc-400">Lessons Completed</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="text-center space-y-2">
                        <div className="text-2xl font-bold text-white">{user?.longestStreak || 0}</div>
                        <div className="text-sm text-zinc-400">Longest Streak</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}

        {/* BTC In Action Section */}
        {activeSection === "inspiration" && inspirationSubTab === "stories" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Bitcoin In Action</h2>
              <p className="text-zinc-400">Real stories from individuals, businesses, and nations</p>
            </div>
            
            <div className="flex space-x-2 mb-4 justify-center">
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
                <Card key={index} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{profile.name}</h3>
                          <p className="text-orange-400 text-sm">{profile.role}</p>
                        </div>
                        <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                          {storiesSubTab === "individuals" ? "Individual" : 
                           storiesSubTab === "businesses" ? "Business" : "Nation"}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-zinc-300 mb-1">Story</h4>
                          <p className="text-zinc-400 text-sm leading-relaxed">{profile.story}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-zinc-300 mb-1">Why Bitcoin?</h4>
                          <p className="text-green-400 text-sm font-medium">{profile.reason}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Conviction Section */}
        {activeSection === "inspiration" && inspirationSubTab === "conviction" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Conviction Center</h2>
              <p className="text-zinc-400">Essential resources to deepen your Bitcoin understanding</p>
            </div>
            
            <div className="flex space-x-2 mb-6 justify-center">
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
                Books & Articles
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
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-orange-600/20 rounded-lg">
                          <FileText className="w-8 h-8 text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">{convictionResources.whitepaper.title}</h3>
                          <div className="flex items-center gap-4 mb-3 text-sm text-zinc-400">
                            <span>By <span className="text-orange-400 font-medium">{convictionResources.whitepaper.author}</span></span>
                            <span>•</span>
                            <span>{convictionResources.whitepaper.date}</span>
                          </div>
                          <p className="text-zinc-300 leading-relaxed mb-4">{convictionResources.whitepaper.summary}</p>
                          
                          <div className="space-y-3">
                            <h4 className="text-white font-medium">Key Points Covered:</h4>
                            <ul className="space-y-2">
                              {convictionResources.whitepaper.keyPoints.map((point, index) => (
                                <li key={index} className="flex items-start gap-2 text-zinc-300 text-sm">
                                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="mt-6">
                            <Button 
                              className="bg-orange-600 hover:bg-orange-700 text-white"
                              onClick={() => window.open(convictionResources.whitepaper.url, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Read the White Paper
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {convictionSubTab === "books" && (
              <div className="space-y-6">
                <div className="grid gap-6">
                  {convictionResources.books.map((book, index) => (
                    <Card key={index} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-600/20 rounded-lg">
                              <BookOpen className="w-6 h-6 text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-lg font-bold text-white">{book.title}</h3>
                                  <p className="text-orange-400 text-sm">by {book.author} • {book.year}</p>
                                </div>
                                <Badge 
                                  variant="outline" 
                                  className={`border-zinc-700 ${
                                    book.difficulty === "Beginner" ? "text-green-400" :
                                    book.difficulty === "Intermediate" ? "text-yellow-400" : "text-red-400"
                                  }`}
                                >
                                  {book.difficulty}
                                </Badge>
                              </div>
                              
                              <p className="text-zinc-300 leading-relaxed mb-4">{book.description}</p>
                              
                              <div className="space-y-2">
                                <h4 className="text-white font-medium text-sm">Key Topics:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {book.keyTopics.map((topic, topicIndex) => (
                                    <span 
                                      key={topicIndex}
                                      className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded"
                                    >
                                      {topic}
                                    </span>
                                  ))}
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

            {convictionSubTab === "videos" && (
              <div className="space-y-6">
                <div className="grid gap-6">
                  {convictionResources.videos.map((video, index) => (
                    <Card key={index} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-red-600/20 rounded-lg">
                              <Play className="w-6 h-6 text-red-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-lg font-bold text-white">{video.title}</h3>
                                  <p className="text-orange-400 text-sm">by {video.creator} • {video.year}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                                    {video.type}
                                  </Badge>
                                  <span className="text-zinc-400 text-sm">{video.duration}</span>
                                </div>
                              </div>
                              
                              <p className="text-zinc-300 leading-relaxed mb-4">{video.description}</p>
                              
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                                onClick={() => window.open(video.url, '_blank')}
                              >
                                <ExternalLink className="w-3 h-3 mr-2" />
                                Watch Video
                              </Button>
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
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Simulation Center</h2>
              <p className="text-zinc-400">Interactive simulations to deepen your Bitcoin understanding</p>
            </div>
            
            <div className="flex space-x-2 mb-6 justify-center flex-wrap gap-2">
              <Button
                variant={practiceSubTab === "mining" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setPracticeSubTab("mining")}
                className="text-sm"
              >
                <Zap className="w-3 h-3 mr-2" />
                Mining
              </Button>
              <Button
                variant={practiceSubTab === "transactions" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setPracticeSubTab("transactions")}
                className="text-sm"
              >
                <ArrowRight className="w-3 h-3 mr-2" />
                Transactions
              </Button>
              <Button
                variant={practiceSubTab === "hodl" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setPracticeSubTab("hodl")}
                className="text-sm"
              >
                <Shield className="w-3 h-3 mr-2" />
                HODLing
              </Button>
              <Button
                variant={practiceSubTab === "dca" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setPracticeSubTab("dca")}
                className="text-sm"
              >
                <TrendingUp className="w-3 h-3 mr-2" />
                DCA
              </Button>
              <Button
                variant={practiceSubTab === "halving" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setPracticeSubTab("halving")}
                className="text-sm"
              >
                <Gem className="w-3 h-3 mr-2" />
                Halving
              </Button>
            </div>

            {practiceSubTab === "mining" && (
              <div className="space-y-6">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-yellow-600/20 rounded-lg">
                          <Zap className="w-8 h-8 text-yellow-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">{simulations.mining.title}</h3>
                          <p className="text-zinc-300 mb-4">{simulations.mining.description}</p>
                          <div className="flex items-center gap-4 mb-4">
                            <Badge variant="outline" className="border-zinc-700 text-yellow-400">
                              {simulations.mining.difficulty}
                            </Badge>
                            <span className="text-zinc-400 text-sm">{simulations.mining.estimatedTime}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-white font-medium">Mining Setup</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-zinc-300 text-sm block mb-1">Hash Rate (TH/s)</label>
                              <div className="bg-zinc-800 rounded px-3 py-2 text-white">100</div>
                            </div>
                            <div>
                              <label className="text-zinc-300 text-sm block mb-1">Power Consumption (W)</label>
                              <div className="bg-zinc-800 rounded px-3 py-2 text-white">3,250</div>
                            </div>
                            <div>
                              <label className="text-zinc-300 text-sm block mb-1">Electricity Cost ($/kWh)</label>
                              <div className="bg-zinc-800 rounded px-3 py-2 text-white">0.12</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-white font-medium">Mining Results</h4>
                          <div className="bg-zinc-800 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Daily Revenue:</span>
                              <span className="text-green-400">$15.40</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Daily Electricity:</span>
                              <span className="text-red-400">-$9.36</span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span className="text-white">Daily Profit:</span>
                              <span className="text-orange-400">$6.04</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Breakeven Time:</span>
                              <span className="text-zinc-300">~18 months</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
                        <h4 className="text-blue-300 font-medium mb-2">Learning Point</h4>
                        <p className="text-blue-200 text-sm">Mining profitability depends on hash rate, electricity costs, and Bitcoin price. The network difficulty adjusts every 2016 blocks to maintain ~10 minute block times.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {practiceSubTab === "transactions" && (
              <div className="space-y-6">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-green-600/20 rounded-lg">
                          <ArrowRight className="w-8 h-8 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">{simulations.transactions.title}</h3>
                          <p className="text-zinc-300 mb-4">{simulations.transactions.description}</p>
                          <div className="flex items-center gap-4 mb-4">
                            <Badge variant="outline" className="border-zinc-700 text-red-400">
                              {simulations.transactions.difficulty}
                            </Badge>
                            <span className="text-zinc-400 text-sm">{simulations.transactions.estimatedTime}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-white font-medium">Transaction Components</h4>
                        <div className="grid gap-4">
                          <div className="bg-zinc-800 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-zinc-300">Input (From)</span>
                              <span className="text-orange-400 text-sm">1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa</span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-zinc-300">Amount</span>
                              <span className="text-white">0.01 BTC</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-300">Fee</span>
                              <span className="text-yellow-400">2,500 sats</span>
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <ArrowRight className="w-6 h-6 text-zinc-600 mx-auto" />
                          </div>
                          
                          <div className="bg-zinc-800 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-zinc-300">Output (To)</span>
                              <span className="text-orange-400 text-sm">3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-300">Amount Received</span>
                              <span className="text-green-400">0.00997500 BTC</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-4">
                        <h4 className="text-green-300 font-medium mb-2">Learning Point</h4>
                        <p className="text-green-200 text-sm">Bitcoin transactions consist of inputs and outputs. Fees incentivize miners to include your transaction in the next block. Higher fees = faster confirmation.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {practiceSubTab === "hodl" && (
              <div className="space-y-6">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-purple-600/20 rounded-lg">
                          <Shield className="w-8 h-8 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">{simulations.hodl.title}</h3>
                          <p className="text-zinc-300 mb-4">{simulations.hodl.description}</p>
                          <div className="flex items-center gap-4 mb-4">
                            <Badge variant="outline" className="border-zinc-700 text-green-400">
                              {simulations.hodl.difficulty}
                            </Badge>
                            <span className="text-zinc-400 text-sm">{simulations.hodl.estimatedTime}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-white font-medium">HODL Strategy A: Early Adopter</h4>
                          <div className="bg-zinc-800 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Initial Investment (2017):</span>
                              <span className="text-white">$1,000</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Bitcoin Price:</span>
                              <span className="text-zinc-300">$1,000</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Bitcoin Acquired:</span>
                              <span className="text-orange-400">1.0 BTC</span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span className="text-white">Current Value:</span>
                              <span className="text-green-400">~$100,000</span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span className="text-white">Return:</span>
                              <span className="text-green-400">+9,900%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-white font-medium">HODL Strategy B: Recent Adopter</h4>
                          <div className="bg-zinc-800 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Initial Investment (2022):</span>
                              <span className="text-white">$1,000</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Bitcoin Price:</span>
                              <span className="text-zinc-300">$50,000</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Bitcoin Acquired:</span>
                              <span className="text-orange-400">0.02 BTC</span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span className="text-white">Current Value:</span>
                              <span className="text-green-400">~$2,000</span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span className="text-white">Return:</span>
                              <span className="text-green-400">+100%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-purple-600/10 border border-purple-600/20 rounded-lg p-4">
                        <h4 className="text-purple-300 font-medium mb-2">Learning Point</h4>
                        <p className="text-purple-200 text-sm">HODLing (Hold On for Dear Life) emphasizes long-term conviction over short-term trading. Time in the market beats timing the market, but past performance doesn't guarantee future results.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {practiceSubTab === "dca" && (
              <div className="space-y-6">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-600/20 rounded-lg">
                          <TrendingUp className="w-8 h-8 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">{simulations.dca.title}</h3>
                          <p className="text-zinc-300 mb-4">{simulations.dca.description}</p>
                          <div className="flex items-center gap-4 mb-4">
                            <Badge variant="outline" className="border-zinc-700 text-green-400">
                              {simulations.dca.difficulty}
                            </Badge>
                            <span className="text-zinc-400 text-sm">{simulations.dca.estimatedTime}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-white font-medium">DCA Simulation: $100/month for 2 years</h4>
                        <div className="grid gap-4">
                          <div className="bg-zinc-800 rounded-lg p-4">
                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div className="font-medium text-zinc-400">Month</div>
                              <div className="font-medium text-zinc-400">Price</div>
                              <div className="font-medium text-zinc-400">BTC Bought</div>
                              <div className="font-medium text-zinc-400">Total BTC</div>
                              
                              <div className="text-zinc-300">Jan 2023</div>
                              <div className="text-zinc-300">$16,500</div>
                              <div className="text-orange-400">0.00606 BTC</div>
                              <div className="text-orange-400">0.00606</div>
                              
                              <div className="text-zinc-300">Jul 2023</div>
                              <div className="text-zinc-300">$30,000</div>
                              <div className="text-orange-400">0.00333 BTC</div>
                              <div className="text-orange-400">0.03939</div>
                              
                              <div className="text-zinc-300">Dec 2024</div>
                              <div className="text-zinc-300">$100,000</div>
                              <div className="text-orange-400">0.00100 BTC</div>
                              <div className="text-orange-400">0.06239</div>
                            </div>
                          </div>
                          
                          <div className="bg-zinc-800 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Total Invested:</span>
                              <span className="text-white">$2,400</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Total Bitcoin:</span>
                              <span className="text-orange-400">0.06239 BTC</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Average Price:</span>
                              <span className="text-zinc-300">$38,461</span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span className="text-white">Current Value:</span>
                              <span className="text-green-400">$6,239</span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span className="text-white">Total Return:</span>
                              <span className="text-green-400">+160%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
                        <h4 className="text-blue-300 font-medium mb-2">Learning Point</h4>
                        <p className="text-blue-200 text-sm">Dollar-Cost Averaging reduces the impact of volatility by spreading purchases over time. You buy more when prices are low and less when prices are high, smoothing out your average cost.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {practiceSubTab === "halving" && (
              <div className="space-y-6">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-orange-600/20 rounded-lg">
                          <Gem className="w-8 h-8 text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">{simulations.halving.title}</h3>
                          <p className="text-zinc-300 mb-4">{simulations.halving.description}</p>
                          <div className="flex items-center gap-4 mb-4">
                            <Badge variant="outline" className="border-zinc-700 text-yellow-400">
                              {simulations.halving.difficulty}
                            </Badge>
                            <span className="text-zinc-400 text-sm">{simulations.halving.estimatedTime}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-white font-medium">Halving Timeline & Impact</h4>
                        <div className="space-y-3">
                          {[
                            { period: "2016-2020", reward: "12.5 BTC", price: "$650 → $29,000", increase: "+4,365%" },
                            { period: "2020-2024", reward: "6.25 BTC", price: "$8,600 → $100,000", increase: "+1,063%" },
                            { period: "2024-2028", reward: "3.125 BTC", price: "$67,000 → $???", increase: "???" }
                          ].map((halving, index) => (
                            <div key={index} className="bg-zinc-800 rounded-lg p-4">
                              <div className="grid md:grid-cols-4 gap-4 items-center">
                                <div>
                                  <div className="text-zinc-400 text-sm">Period</div>
                                  <div className="text-white font-medium">{halving.period}</div>
                                </div>
                                <div>
                                  <div className="text-zinc-400 text-sm">Block Reward</div>
                                  <div className="text-orange-400 font-medium">{halving.reward}</div>
                                </div>
                                <div>
                                  <div className="text-zinc-400 text-sm">Price Range</div>
                                  <div className="text-zinc-300 font-medium">{halving.price}</div>
                                </div>
                                <div>
                                  <div className="text-zinc-400 text-sm">Cycle Increase</div>
                                  <div className="text-green-400 font-medium">{halving.increase}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-orange-600/10 border border-orange-600/20 rounded-lg p-4">
                        <h4 className="text-orange-300 font-medium mb-2">Learning Point</h4>
                        <p className="text-orange-200 text-sm">Bitcoin halving reduces new supply by 50% every ~4 years. Historically, this supply shock has led to significant price increases, though past performance doesn't guarantee future results.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Disruption Section */}
        {activeSection === "foundation" && foundationSubTab === "disruption" && (
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
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">Traditional Finance Problems</h3>
                  <p className="text-zinc-400">Understanding what's broken in today's financial system</p>
                </div>
                
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
              </div>
            )}

            {disruptionSubTab === "solutions" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">Bitcoin Solutions</h3>
                  <p className="text-zinc-400">How Bitcoin fixes each traditional finance problem</p>
                </div>
                
                <div className="grid gap-6">
                  {traditionalFinanceProblems.solutions.map((solution, index) => (
                    <Card key={index} className="bg-zinc-900 border-zinc-800">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-600/20 rounded-lg">
                              <AlertTriangle className="w-5 h-5 text-red-400" />
                            </div>
                            <div className="flex-1">
                              <div className="text-red-300 font-medium">{solution.problem}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <ArrowRight className="w-6 h-6 text-zinc-600" />
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-600/20 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            </div>
                            <div className="flex-1">
                              <div className="text-green-300 font-medium mb-2">{solution.solution}</div>
                              <div className="text-zinc-300 text-sm mb-2">{solution.description}</div>
                              <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-3">
                                <div className="text-green-300 font-medium text-sm mb-1">Benefit</div>
                                <div className="text-green-200 text-sm">{solution.benefit}</div>
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

            {disruptionSubTab === "comparison" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">Side-by-Side Comparison</h3>
                  <p className="text-zinc-400">Traditional finance vs Bitcoin - see the difference</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <h4 className="text-lg font-bold text-red-300">{traditionalFinanceProblems.comparison.traditional.title}</h4>
                      </div>
                      <div className="space-y-3">
                        {traditionalFinanceProblems.comparison.traditional.characteristics.map((char, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-red-600/10 border border-red-600/20 rounded-lg">
                            <span className="text-zinc-400 font-medium">{char.aspect}</span>
                            <span className="text-red-300 text-sm">{char.value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <h4 className="text-lg font-bold text-green-300">{traditionalFinanceProblems.comparison.bitcoin.title}</h4>
                      </div>
                      <div className="space-y-3">
                        {traditionalFinanceProblems.comparison.bitcoin.characteristics.map((char, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-green-600/10 border border-green-600/20 rounded-lg">
                            <span className="text-zinc-400 font-medium">{char.aspect}</span>
                            <span className="text-green-300 text-sm">{char.value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="bg-orange-600/10 border border-orange-600/20 rounded-lg p-6">
                  <h4 className="text-orange-300 font-bold mb-3">Key Takeaway</h4>
                  <p className="text-orange-200">Bitcoin isn't just another payment method - it's a complete reimagining of money that puts control back in your hands. Every aspect of traditional finance that frustrates you has a Bitcoin solution.</p>
                </div>
              </div>
            )}

            {disruptionSubTab === "future" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">The Bitcoin Future</h3>
                  <p className="text-zinc-400">Timeline of how Bitcoin will reshape global finance</p>
                </div>
                
                <div className="space-y-6">
                  {traditionalFinanceProblems.future.map((phase, index) => (
                    <Card key={index} className="bg-zinc-900 border-zinc-800">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-600/20 rounded-lg">
                              <Clock className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-white">{phase.timeframe}</h4>
                            </div>
                          </div>
                          
                          <div className="grid gap-3">
                            {phase.developments.map((development, devIndex) => (
                              <div key={devIndex} className="flex items-start gap-3 p-3 bg-zinc-800 rounded-lg">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                <div className="text-zinc-300">{development}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="bg-gradient-to-r from-orange-600/20 to-yellow-600/20 border border-orange-600/30 rounded-lg p-6">
                  <h4 className="text-orange-300 font-bold mb-3">The Bottom Line</h4>
                  <p className="text-orange-200 mb-3">We're witnessing the largest monetary revolution in human history. Bitcoin isn't competing with traditional finance - it's replacing it.</p>
                  <p className="text-orange-200">The question isn't IF this will happen, but WHEN. Those who understand and adopt Bitcoin early will benefit most from this historic transition.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bitcoin Terms Section */}
        {activeSection === "foundation" && foundationSubTab === "terms" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Bitcoin Terms</h2>
              <p className="text-zinc-400">Essential vocabulary for understanding Bitcoin</p>
            </div>
            
            <div className="grid gap-4">
              {bitcoinTerms.map((term, index) => (
                <Card key={index} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-orange-400">{term.term}</h3>
                      <p className="text-zinc-300 leading-relaxed">{term.definition}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Simplified Price Chart Modal */}
        <Dialog open={showPriceChart} onOpenChange={setShowPriceChart}>
          <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Bitcoin className="w-5 h-5 text-orange-500" />
                Bitcoin Information
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-white">
                  ${bitcoinPrice?.priceUsd ? Number(bitcoinPrice.priceUsd).toLocaleString() : 'Loading...'}
                </div>
                <p className="text-zinc-400">Current Bitcoin Price (USD)</p>
              </div>
              
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">What is Bitcoin?</h4>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  Bitcoin is digital money that operates on a decentralized network. Unlike traditional currencies, 
                  it's not controlled by any government or bank. Bitcoin is designed to be a store of value and 
                  medium of exchange for the digital age.
                </p>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4">
                <h4 className="text-blue-100 font-medium mb-2">Learning Focus</h4>
                <p className="text-blue-200 text-sm leading-relaxed">
                  This app focuses on education, not trading. Bitcoin's price changes daily, but understanding 
                  its technology and long-term potential is more important than short-term price movements.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Shortened Disclaimer */}
        <div className="mt-8 p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
          <p className="text-xs text-zinc-500 leading-relaxed">
            <strong className="text-zinc-400">Educational Only:</strong> This content is for learning purposes and not financial advice. 
            Bitcoin investments are volatile and speculative. Always research thoroughly and consult professionals before making financial decisions.
          </p>
        </div>
      </main>
    </div>
  );
}