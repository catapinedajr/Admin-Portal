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
  Building2,
  Lock,
  Wallet
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
        explanation: "Bitcoin halving is a pre-programmed event that occurs approximately every 4 years (210,000 blocks) where the reward for mining new blocks is cut in half.",
        examples: [
          "2012: Reward dropped from 50 BTC to 25 BTC per block",
          "2016: Reward dropped from 25 BTC to 12.5 BTC per block", 
          "2020: Reward dropped from 12.5 BTC to 6.25 BTC per block",
          "2024: Reward dropped from 6.25 BTC to 3.125 BTC per block"
        ],
        visualDescription: "Imagine a giant digital clock counting down blocks. Every 210,000 blocks, an automated mechanism literally cuts the mining reward in half.",
        keyTakeaways: [
          "Reduces new Bitcoin supply entering the market",
          "Creates predictable scarcity timeline",
          "Often correlates with price increases due to supply shock",
          "Demonstrates Bitcoin's deflationary monetary policy"
        ]
      },
      "Digital Scarcity": {
        explanation: "Before Bitcoin, digital items could be copied infinitely at zero cost. Bitcoin solved the 'double-spending problem' using cryptographic proof and network consensus.",
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
      }
    };
    return deepDives[factTitle];
  };

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
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-600/20 rounded-lg">
                            <Network className="w-6 h-6 text-orange-400" />
                          </div>
                          <h4 className="text-lg font-bold text-white">Lightning Network</h4>
                        </div>
                        <p className="text-zinc-300 text-sm">
                          A "layer 2" payment protocol that operates on top of Bitcoin. It enables fast, low-cost transactions by creating payment channels between users.
                        </p>
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
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-600/20 rounded-lg">
                            <Lock className="w-6 h-6 text-blue-400" />
                          </div>
                          <h4 className="text-lg font-bold text-white">Digital Signatures</h4>
                        </div>
                        <p className="text-zinc-300 text-sm">
                          Cryptographic proof that a transaction was created by the owner of a private key, without revealing the private key itself.
                        </p>
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
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-600/20 rounded-lg">
                            <Zap className="w-6 h-6 text-green-400" />
                          </div>
                          <h4 className="text-lg font-bold text-white">Proof of Work</h4>
                        </div>
                        <p className="text-zinc-300 text-sm">
                          The consensus mechanism that secures Bitcoin. Miners compete to solve computational puzzles, with the winner adding the next block to the blockchain.
                        </p>
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
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-600/20 rounded-lg">
                            <Coins className="w-6 h-6 text-purple-400" />
                          </div>
                          <h4 className="text-lg font-bold text-white">Fixed Supply</h4>
                        </div>
                        <p className="text-zinc-300 text-sm">
                          Bitcoin has a maximum supply of 21 million coins, hardcoded into the protocol. This scarcity model is fundamental to Bitcoin's value proposition.
                        </p>
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

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-bold text-white mb-4">Wallet Type Comparison</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-zinc-700">
                            <th className="text-left text-white p-2">Wallet Type</th>
                            <th className="text-left text-white p-2">Security</th>
                            <th className="text-left text-white p-2">Convenience</th>
                            <th className="text-left text-white p-2">Best For</th>
                          </tr>
                        </thead>
                        <tbody className="text-zinc-300">
                          <tr className="border-b border-zinc-800">
                            <td className="p-2 font-medium">Hardware Wallet</td>
                            <td className="p-2 text-green-400">Highest</td>
                            <td className="p-2 text-yellow-400">Medium</td>
                            <td className="p-2">Long-term storage</td>
                          </tr>
                          <tr className="border-b border-zinc-800">
                            <td className="p-2 font-medium">Mobile Wallet</td>
                            <td className="p-2 text-yellow-400">Medium</td>
                            <td className="p-2 text-green-400">Highest</td>
                            <td className="p-2">Daily transactions</td>
                          </tr>
                          <tr className="border-b border-zinc-800">
                            <td className="p-2 font-medium">Exchange</td>
                            <td className="p-2 text-red-400">Lowest</td>
                            <td className="p-2 text-green-400">Highest</td>
                            <td className="p-2">Trading only</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Transaction Simulator */}
            {practiceSubTab === "transactions" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">Bitcoin Transaction Builder</h3>
                  <p className="text-zinc-400">Learn how Bitcoin transactions work by building one step-by-step</p>
                </div>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
                          <Wallet className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                          <h5 className="font-medium text-white mb-1">From Address</h5>
                          <p className="text-zinc-400 text-xs">1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa</p>
                        </div>
                        <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
                          <ArrowRight className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                          <h5 className="font-medium text-white mb-1">Amount</h5>
                          <p className="text-zinc-400 text-xs">0.001 BTC</p>
                        </div>
                        <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
                          <UserIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
                          <h5 className="font-medium text-white mb-1">To Address</h5>
                          <p className="text-zinc-400 text-xs">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h5 className="font-medium text-white">Transaction Details</h5>
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="p-3 bg-zinc-800/30 rounded-lg">
                            <p className="text-zinc-400 text-sm">Network Fee</p>
                            <p className="text-white font-medium">0.00002 BTC (~$1.30)</p>
                          </div>
                          <div className="p-3 bg-zinc-800/30 rounded-lg">
                            <p className="text-zinc-400 text-sm">Confirmation Time</p>
                            <p className="text-white font-medium">~10 minutes</p>
                          </div>
                          <div className="p-3 bg-zinc-800/30 rounded-lg">
                            <p className="text-zinc-400 text-sm">Transaction Size</p>
                            <p className="text-white font-medium">226 bytes</p>
                          </div>
                          <div className="p-3 bg-zinc-800/30 rounded-lg">
                            <p className="text-zinc-400 text-sm">Fee Rate</p>
                            <p className="text-white font-medium">5.75 sat/vB</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-orange-600/10 border border-orange-600/20 rounded-lg">
                        <h5 className="font-medium text-orange-300 mb-2">How This Transaction Works:</h5>
                        <ol className="space-y-1 text-zinc-300 text-sm">
                          <li>1. Your wallet creates a transaction spending unspent outputs</li>
                          <li>2. The transaction is signed with your private key</li>
                          <li>3. It's broadcast to the Bitcoin network</li>
                          <li>4. Miners include it in a block and confirm it</li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* HODL Strategy */}
            {practiceSubTab === "hodl" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">HODLing vs Trading Comparison</h3>
                  <p className="text-zinc-400">Compare long-term holding against active trading strategies</p>
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

            {/* DCA Strategy */}
            {practiceSubTab === "dca" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">Dollar-Cost Averaging Calculator</h3>
                  <p className="text-zinc-400">See how consistent investing smooths out market volatility</p>
                </div>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <h4 className="text-lg font-bold text-white">DCA Simulation Results</h4>
                      
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
                          <DollarSign className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                          <h5 className="font-medium text-white mb-1">Monthly Investment</h5>
                          <p className="text-blue-400 font-bold text-lg">$100</p>
                        </div>
                        <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
                          <Calendar className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                          <h5 className="font-medium text-white mb-1">Time Period</h5>
                          <p className="text-orange-400 font-bold text-lg">24 Months</p>
                        </div>
                        <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
                          <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                          <h5 className="font-medium text-white mb-1">Total Invested</h5>
                          <p className="text-green-400 font-bold text-lg">$2,400</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h5 className="font-medium text-white">Results Comparison</h5>
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="p-4 bg-green-600/10 border border-green-600/20 rounded-lg">
                            <h6 className="font-medium text-green-300 mb-2">DCA Strategy</h6>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Bitcoin Acquired</span>
                                <span className="text-white">0.0856 BTC</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Average Price</span>
                                <span className="text-white">$28,037</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Current Value</span>
                                <span className="text-green-400 font-medium">$4,280</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Total Return</span>
                                <span className="text-green-400 font-medium">+78.3%</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-lg">
                            <h6 className="font-medium text-red-300 mb-2">Lump Sum (Month 1)</h6>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Bitcoin Acquired</span>
                                <span className="text-white">0.1200 BTC</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Purchase Price</span>
                                <span className="text-white">$20,000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Current Value</span>
                                <span className="text-red-400 font-medium">$6,000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Total Return</span>
                                <span className="text-red-400 font-medium">+150%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                        <h5 className="font-medium text-blue-300 mb-2">DCA Benefits:</h5>
                        <ul className="space-y-1 text-zinc-300 text-sm">
                          <li>• Reduces impact of volatility through averaging</li>
                          <li>• Makes investing accessible with smaller amounts</li>
                          <li>• Removes emotion and timing from investment decisions</li>
                          <li>• Builds discipline through consistent investing</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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