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
  ChevronUp
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

type MainSection = "learning" | "btcaction" | "conviction" | "terms";
type LearningSubTab = "basics" | "lesson" | "progress" | "quiz" | "explore";
type BtcActionSubTab = "individuals" | "businesses" | "nations";

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

export default function Home() {
  const [activeSection, setActiveSection] = useState<MainSection>("learning");
  const [learningSubTab, setLearningSubTab] = useState<LearningSubTab>("basics");
  const [btcActionSubTab, setBtcActionSubTab] = useState<BtcActionSubTab>("individuals");
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
            <Bitcoin className="w-12 h-12 text-orange-500 animate-pulse" />
            <h1 className="text-4xl font-bold text-white">Bitcoin Edu</h1>
          </div>
          <p className="text-zinc-400 text-lg">Learn Bitcoin. Build conviction. Stack sats.</p>
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
              <Bitcoin className="w-6 h-6 text-orange-500" />
              <h1 className="text-lg font-semibold text-white">Bitcoin Education</h1>
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
          <div className="flex items-center gap-1 py-2">
            <Button
              variant={activeSection === "learning" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveSection("learning")}
              className={activeSection === "learning" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"}
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Learning
            </Button>
            <Button
              variant={activeSection === "btcaction" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveSection("btcaction")}
              className={activeSection === "btcaction" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"}
            >
              <Users className="w-4 h-4 mr-2" />
              BTC In Action
            </Button>
            <Button
              variant={activeSection === "conviction" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveSection("conviction")}
              className={activeSection === "conviction" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"}
            >
              <Heart className="w-4 h-4 mr-2" />
              Conviction
            </Button>
            <Button
              variant={activeSection === "terms" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveSection("terms")}
              className={activeSection === "terms" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"}
            >
              <FileText className="w-4 h-4 mr-2" />
              Bitcoin Terms
            </Button>
          </div>
        </div>
      </nav>

      {/* Sub Navigation */}
      {activeSection === "learning" && (
        <div className="bg-zinc-800/30 border-b border-zinc-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-1 py-2">
              <Button
                variant={learningSubTab === "basics" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setLearningSubTab("basics")}
                className="text-sm"
              >
                <Lightbulb className="w-3 h-3 mr-2" />
                Daily Facts
              </Button>
              <Button
                variant={learningSubTab === "lesson" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setLearningSubTab("lesson")}
                className="text-sm"
              >
                <BookOpen className="w-3 h-3 mr-2" />
                Lesson
              </Button>
              <Button
                variant={learningSubTab === "quiz" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setLearningSubTab("quiz")}
                className="text-sm"
              >
                <HelpCircle className="w-3 h-3 mr-2" />
                Quiz
              </Button>
              <Button
                variant={learningSubTab === "explore" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setLearningSubTab("explore")}
                className="text-sm"
              >
                <Globe className="w-3 h-3 mr-2" />
                Explore
              </Button>
              <Button
                variant={learningSubTab === "progress" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setLearningSubTab("progress")}
                className="text-sm"
              >
                <TrendingUp className="w-3 h-3 mr-2" />
                Progress
              </Button>
            </div>
          </div>
        </div>
      )}



      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Learning Section */}
        {activeSection === "learning" && (
          <div className="space-y-6">
            {learningSubTab === "basics" && (
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

            {learningSubTab === "lesson" && lesson && (
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

            {learningSubTab === "quiz" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Daily Quiz</h2>
                  <p className="text-zinc-400">Test your Bitcoin knowledge</p>
                </div>
                <DailyQuiz />
              </div>
            )}

            {learningSubTab === "explore" && (
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

            {learningSubTab === "progress" && (
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
        {activeSection === "btcaction" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Bitcoin In Action</h2>
              <p className="text-zinc-400">Real stories from individuals, businesses, and nations</p>
            </div>
            
            <div className="flex space-x-2 mb-4 justify-center">
              <Button
                variant={btcActionSubTab === "individuals" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setBtcActionSubTab("individuals")}
                className="text-sm"
              >
                <UserIcon className="w-3 h-3 mr-2" />
                Individuals
              </Button>
              <Button
                variant={btcActionSubTab === "businesses" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setBtcActionSubTab("businesses")}
                className="text-sm"
              >
                <Building2 className="w-3 h-3 mr-2" />
                Businesses
              </Button>
              <Button
                variant={btcActionSubTab === "nations" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setBtcActionSubTab("nations")}
                className="text-sm"
              >
                <Flag className="w-3 h-3 mr-2" />
                Nations
              </Button>
            </div>
            
            <div className="grid gap-6">
              {userProfiles[btcActionSubTab].map((profile, index) => (
                <Card key={index} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{profile.name}</h3>
                          <p className="text-orange-400 text-sm">{profile.role}</p>
                        </div>
                        <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                          {btcActionSubTab === "individuals" ? "Individual" : 
                           btcActionSubTab === "businesses" ? "Business" : "Nation"}
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
        {activeSection === "conviction" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Conviction Center</h2>
              <p className="text-zinc-400">Wisdom from Bitcoin leaders and advocates</p>
            </div>
            
            <div className="grid gap-4">
              {convictionContent.map((content, index) => (
                <Card key={content.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        {content.type === "quote" ? (
                          <Quote className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                        ) : (
                          <Play className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-2">{content.title}</h3>
                          <p className="text-zinc-300 leading-relaxed mb-3">{content.content}</p>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-zinc-400">
                              <span className="font-medium text-orange-400">{content.author}</span>
                              {content.source && <span> • {content.source}</span>}
                            </div>
                            {content.videoUrl && (
                              <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Watch
                              </Button>
                            )}
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

        {/* Bitcoin Terms Section */}
        {activeSection === "terms" && (
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