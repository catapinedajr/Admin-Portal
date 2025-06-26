import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
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
  Star,
  Crown,
  Lock,
  ShoppingCart,
  Calculator,
  TrendingDown,
  Clock,
  Target,
  ArrowUp,
  ArrowDown,
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

type MainSection = "learn" | "practice" | "more";
type LearnSubTab = "today" | "explore" | "disruption" | "glossary";
type PracticeSubTab = "mining" | "transactions" | "hodl" | "dca" | "halving";
type MoreSubTab = "stories" | "conviction" | "store";
type StoriesSubTab = "individuals" | "businesses" | "nations";
type ConvictionSubTab = "quotes" | "whitepaper" | "books" | "videos";
type UserTier = "explorer" | "scholar" | "master";

interface UserSubscription {
  tier: UserTier;
  xp: number;
  level: number;
  achievements: string[];
  dailyFactsViewed: number;
  lessonsThisWeek: number;
}

const userSubscription: UserSubscription = {
  tier: "explorer", // Free tier
  xp: 150,
  level: 2,
  achievements: ["first_login", "first_quiz"],
  dailyFactsViewed: 2, // Used 2 out of 3 free facts today
  lessonsThisWeek: 0 // Used 0 out of 1 free lesson this week
};

const subscriptionTiers = {
  explorer: { name: "Explorer", price: "$0", factLimit: 3, lessonLimit: 1, features: ["3 daily facts", "1 lesson/week", "Basic progress tracking"] },
  scholar: { name: "Scholar", price: "$9.99", factLimit: 10, lessonLimit: 7, features: ["10 daily facts", "Unlimited lessons", "Advanced analytics", "Premium simulators"] },
  master: { name: "Master", price: "$19.99", factLimit: -1, lessonLimit: -1, features: ["Unlimited everything", "Exclusive content", "1-on-1 coaching", "Early access"] }
};

const factCategories = [
  { id: "basics", name: "Bitcoin Basics", icon: "📚", color: "bg-blue-500" },
  { id: "use-case", name: "Use Cases", icon: "💡", color: "bg-green-500" },
  { id: "traditional-finance", name: "Traditional Finance", icon: "🏦", color: "bg-red-500" },
  { id: "technical", name: "Technical", icon: "⚙️", color: "bg-purple-500" },
  { id: "adoption", name: "Adoption", icon: "🌍", color: "bg-orange-500" }
];

const convictionContent = {
  quotes: [
    {
      quote: "Bitcoin is a remarkable cryptographic achievement, and the ability to create something that is not duplicable in the digital world has enormous value.",
      author: "Eric Schmidt",
      role: "Former Google CEO",
      context: "Speaking about Bitcoin's technological breakthrough"
    },
    {
      quote: "I think Bitcoin is the beginning of something great: a currency without a government, something necessary and imperative.",
      author: "Nassim Nicholas Taleb", 
      role: "Author of 'The Black Swan'",
      context: "On Bitcoin's potential to reshape money"
    }
  ],
  books: [
    {
      title: "The Bitcoin Standard",
      author: "Saifedean Ammous",
      difficulty: "Beginner",
      description: "Essential reading on Bitcoin's role as sound money",
      affiliateLink: "https://amazon.com/bitcoin-standard",
      price: "$24.99"
    },
    {
      title: "Mastering Bitcoin",
      author: "Andreas Antonopoulos", 
      difficulty: "Advanced",
      description: "Technical deep-dive into Bitcoin's inner workings",
      affiliateLink: "https://amazon.com/mastering-bitcoin",
      price: "$39.99"
    }
  ],
  videos: [
    {
      title: "What is Money? (Bitcoin Explained)",
      creator: "Michael Saylor",
      duration: "45 min",
      description: "MicroStrategy CEO explains Bitcoin as digital property",
      url: "https://youtube.com/watch?v=example1"
    },
    {
      title: "The Case for Bitcoin",
      creator: "Cathie Wood",
      duration: "30 min", 
      description: "ARK Invest CEO on Bitcoin's disruptive potential",
      url: "https://youtube.com/watch?v=example2"
    }
  ]
};

const storeItems = {
  books: [
    {
      title: "The Bitcoin Standard",
      author: "Saifedean Ammous",
      price: "$24.99",
      image: "📖",
      affiliateLink: "https://amazon.com/bitcoin-standard",
      description: "The foundational book on Bitcoin as sound money"
    },
    {
      title: "The Fiat Standard", 
      author: "Saifedean Ammous",
      price: "$26.99",
      image: "📚",
      affiliateLink: "https://amazon.com/fiat-standard",
      description: "Understanding the problems with fiat currency"
    }
  ],
  hardware: [
    {
      name: "Ledger Nano X",
      price: "$149",
      image: "🔐",
      affiliateLink: "https://ledger.com/nano-x",
      description: "Premium hardware wallet for Bitcoin security"
    },
    {
      name: "Trezor Model T",
      price: "$219", 
      image: "🛡️",
      affiliateLink: "https://trezor.io/model-t",
      description: "Advanced hardware wallet with touchscreen"
    }
  ],
  courses: [
    {
      title: "Bitcoin Fundamentals",
      instructor: "Princeton University",
      price: "$99",
      image: "🎓",
      affiliateLink: "https://coursera.org/bitcoin-fundamentals",
      description: "Academic approach to cryptocurrency and blockchain"
    },
    {
      title: "Bitcoin Trading Masterclass",
      instructor: "Coin Bureau",
      price: "$199",
      image: "📈",
      affiliateLink: "https://coinbureau.com/trading-course",
      description: "Professional trading strategies and risk management"
    }
  ]
};

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
    }
  ],
  businesses: [
    {
      name: "MicroStrategy",
      role: "Business Intelligence Company",
      story: "Converted corporate treasury to Bitcoin as inflation hedge. Now holds over 130,000 BTC worth billions.",
      reason: "Treasury reserve asset and store of value strategy"
    },
    {
      name: "Strike",
      role: "Payment Platform",
      story: "Built Lightning Network payment infrastructure enabling instant, low-cost Bitcoin transactions globally.",
      reason: "Modernizing payment rails with Bitcoin technology"
    }
  ],
  nations: [
    {
      name: "El Salvador",
      role: "Central American Nation",
      story: "First country to adopt Bitcoin as legal tender in 2021. Uses Bitcoin for remittances and tourism.",
      reason: "Financial inclusion and reduced dependence on US dollar"
    },
    {
      name: "Central African Republic",
      role: "African Nation", 
      story: "Second country to adopt Bitcoin as legal tender. Launched Sango cryptocurrency project.",
      reason: "Economic modernization and attracting crypto investment"
    }
  ]
};

export default function Home() {
  const [activeSection, setActiveSection] = useState<MainSection>("learn");
  const [learnSubTab, setLearnSubTab] = useState<LearnSubTab>("today");
  const [practiceSubTab, setPracticeSubTab] = useState<PracticeSubTab>("mining");
  const [moreSubTab, setMoreSubTab] = useState<MoreSubTab>("stories");
  const [storiesSubTab, setStoriesSubTab] = useState<StoriesSubTab>("individuals");
  const [convictionSubTab, setConvictionSubTab] = useState<ConvictionSubTab>("quotes");
  const [expandedFacts, setExpandedFacts] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showPriceChart, setShowPriceChart] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // Mining calculator state
  const [hashRate, setHashRate] = useState(100);
  const [electricityCost, setElectricityCost] = useState(0.12);
  const [powerConsumption, setPowerConsumption] = useState(3000);
  
  // DCA calculator state
  const [dcaAmount, setDcaAmount] = useState(100);
  const [dcaFrequency, setDcaFrequency] = useState("weekly");
  const [dcaPeriod, setDcaPeriod] = useState(12);

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"]
  });

  const { data: dailyFacts = [] } = useQuery<DailyFact[]>({
    queryKey: ["/api/daily-facts"]
  });

  const { data: lesson } = useQuery<Lesson>({
    queryKey: ["/api/lesson"]
  });

  const { data: progress } = useQuery<UserProgress>({
    queryKey: ["/api/progress/today"]
  });

  const { data: convictionQuotes = [] } = useQuery<ConvictionContent[]>({
    queryKey: ["/api/conviction-content"]
  });

  const { data: bitcoinPrice } = useQuery({
    queryKey: ["/api/bitcoin-price"],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const filteredFacts = selectedCategory === "all" 
    ? dailyFacts 
    : dailyFacts.filter(fact => fact.category === selectedCategory);

  const toggleFactExpansion = (factId: number) => {
    const newExpanded = new Set(expandedFacts);
    if (newExpanded.has(factId)) {
      newExpanded.delete(factId);
    } else {
      newExpanded.add(factId);
    }
    setExpandedFacts(newExpanded);
  };

  const checkSubscriptionLimit = (type: 'fact' | 'lesson') => {
    const tier = subscriptionTiers[userSubscription.tier];
    if (type === 'fact') {
      return tier.factLimit === -1 || userSubscription.dailyFactsViewed < tier.factLimit;
    } else {
      return tier.lessonLimit === -1 || userSubscription.lessonsThisWeek < tier.lessonLimit;
    }
  };

  const showUpgradePrompt = (feature: string) => {
    setShowUpgradeModal(true);
  };

  const calculateMiningProfit = () => {
    const bitcoinPerDay = (hashRate * 1e12 * 6.25) / (200 * 1e18) * 144; // Simplified calculation
    const currentPrice = (bitcoinPrice as any)?.price || 50000;
    const revenuePerDay = bitcoinPerDay * currentPrice;
    const electricityCostPerDay = (powerConsumption / 1000) * 24 * electricityCost;
    return revenuePerDay - electricityCostPerDay;
  };

  const calculateDCA = () => {
    const periods = dcaFrequency === "weekly" ? dcaPeriod * 4 : dcaPeriod;
    const totalInvested = dcaAmount * periods;
    const avgPrice = 45000; // Simplified average
    const bitcoinAccumulated = totalInvested / avgPrice;
    const currentPrice = (bitcoinPrice as any)?.price || 50000;
    const currentValue = bitcoinAccumulated * currentPrice;
    return { totalInvested, bitcoinAccumulated, currentValue, profit: currentValue - totalInvested };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white">
      {/* Header */}
      <header className="bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Bitcoin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                ₿ Journey
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-zinc-800 rounded-full px-3 py-1">
                <Crown className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium">{subscriptionTiers[userSubscription.tier].name}</span>
                <Badge variant="secondary" className="text-xs">Level {userSubscription.level}</Badge>
              </div>
              
              {bitcoinPrice && (bitcoinPrice as any).price && (
                <div className="text-sm text-zinc-400">
                  <span className="text-orange-400 font-mono">${(bitcoinPrice as any).price.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <nav className="bg-zinc-900/50 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center gap-1 py-2 flex-wrap">
            <Button
              variant={activeSection === "learn" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveSection("learn")}
              className={`${activeSection === "learn" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"} rounded-full px-4 py-2`}
            >
              <GraduationCap className="w-4 h-4 mr-1" />
              Learn
            </Button>
            <Button
              variant={activeSection === "practice" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveSection("practice")}
              className={`${activeSection === "practice" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"} rounded-full px-4 py-2`}
            >
              <Zap className="w-4 h-4 mr-1" />
              Practice
            </Button>
            <Button
              variant={activeSection === "more" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveSection("more")}
              className={`${activeSection === "more" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"} rounded-full px-4 py-2`}
            >
              <Heart className="w-4 h-4 mr-1" />
              More
            </Button>
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        
        {/* Learn Section */}
        {activeSection === "learn" && (
          <div className="space-y-6">
            {/* Learn Sub Navigation */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={learnSubTab === "today" ? "default" : "outline"}
                size="sm"
                onClick={() => setLearnSubTab("today")}
                className={learnSubTab === "today" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"}
              >
                Today
              </Button>
              <Button
                variant={learnSubTab === "explore" ? "default" : "outline"}
                size="sm"
                onClick={() => setLearnSubTab("explore")}
                className={learnSubTab === "explore" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"}
              >
                Explore
              </Button>
              <Button
                variant={learnSubTab === "disruption" ? "default" : "outline"}
                size="sm"
                onClick={() => setLearnSubTab("disruption")}
                className={learnSubTab === "disruption" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"}
              >
                Disruption
              </Button>
              <Button
                variant={learnSubTab === "glossary" ? "default" : "outline"}
                size="sm"
                onClick={() => setLearnSubTab("glossary")}
                className={learnSubTab === "glossary" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"}
              >
                Glossary
              </Button>
            </div>

            {/* Today Tab - Daily Facts, Lesson, Quiz */}
            {learnSubTab === "today" && (
              <div className="space-y-8">
                {/* Daily Facts */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Daily Facts</h2>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-orange-400 border-orange-400">
                        {userSubscription.dailyFactsViewed}/{subscriptionTiers[userSubscription.tier].factLimit === -1 ? "∞" : subscriptionTiers[userSubscription.tier].factLimit} today
                      </Badge>
                      {!checkSubscriptionLimit('fact') && (
                        <Button size="sm" variant="outline" onClick={() => showUpgradePrompt('facts')} className="text-orange-400 border-orange-400">
                          Upgrade
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCategory === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory("all")}
                      className={selectedCategory === "all" ? "bg-orange-600 text-white" : ""}
                    >
                      All
                    </Button>
                    {factCategories.map(category => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className={selectedCategory === category.id ? "bg-orange-600 text-white" : ""}
                      >
                        {category.icon} {category.name}
                      </Button>
                    ))}
                  </div>

                  <div className="grid gap-4">
                    {filteredFacts.map((fact, index) => {
                      const isLocked = !checkSubscriptionLimit('fact') && index >= subscriptionTiers[userSubscription.tier].factLimit;
                      const isExpanded = expandedFacts.has(fact.id);
                      
                      return (
                        <Card key={fact.id} className={`bg-zinc-800/50 border-zinc-700 ${isLocked ? 'opacity-50' : ''}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-orange-400">{fact.title}</h3>
                              {isLocked && <Lock className="w-4 h-4 text-orange-400" />}
                            </div>
                            <p className="text-zinc-300 mb-3">{fact.content}</p>
                            
                            {!isLocked && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFactExpansion(fact.id)}
                                className="text-orange-400 hover:text-orange-300"
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="w-4 h-4 mr-1" />
                                    Less
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-4 h-4 mr-1" />
                                    Dive Deeper
                                  </>
                                )}
                              </Button>
                            )}
                            
                            {isExpanded && (
                              <div className="mt-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-700">
                                <h4 className="font-semibold text-orange-400 mb-2">Deep Dive</h4>
                                <p className="text-zinc-300 mb-3">
                                  {fact.title === "What is Bitcoin?" && "Bitcoin represents the first successful implementation of digital scarcity. Unlike traditional digital files that can be copied infinitely, Bitcoin uses cryptographic proof to ensure each unit can only exist in one place at one time. This breakthrough enables true digital ownership without requiring trust in central authorities."}
                                  {fact.title === "Why Bitcoin Matters" && "Bitcoin's importance extends beyond just being digital money. It's a neutral monetary network that operates independently of any government or corporation. This neutrality makes it valuable for preserving wealth, conducting censorship-resistant transactions, and providing financial services to the unbanked."}
                                  {fact.title === "How Bitcoin Works" && "Bitcoin's security comes from a network of thousands of computers (nodes) that maintain identical copies of the transaction ledger. When someone sends Bitcoin, the transaction is broadcast to the network and included in a block by miners who compete to solve cryptographic puzzles. This process ensures no single entity can control or manipulate the system."}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-zinc-400">
                                  <Lightbulb className="w-3 h-3" />
                                  <span>Key insight: This foundational concept builds toward understanding Bitcoin's role in the future of money.</span>
                                </div>
                              </div>
                            )}
                            
                            {isLocked && (
                              <div className="mt-3 p-3 bg-zinc-900/50 rounded-lg border border-orange-400/20">
                                <p className="text-sm text-zinc-400">Upgrade to Scholar ($9.99/month) to access more daily facts and dive deeper content.</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Daily Lesson */}
                {lesson && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">Today's Lesson</h2>
                      <Badge variant="outline" className="text-orange-400 border-orange-400">
                        {userSubscription.lessonsThisWeek}/{subscriptionTiers[userSubscription.tier].lessonLimit === -1 ? "∞" : subscriptionTiers[userSubscription.tier].lessonLimit} this week
                      </Badge>
                    </div>
                    
                    {checkSubscriptionLimit('lesson') ? (
                      <Card className="bg-zinc-800/50 border-zinc-700">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <BookOpen className="w-8 h-8 text-orange-400 mt-1" />
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold mb-2">{lesson.title}</h3>
                              <p className="text-zinc-300 mb-4">{lesson.summary}</p>
                              <div className="flex items-center gap-4 text-sm text-zinc-400 mb-4">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {lesson.estimatedReadTime}
                                </span>
                                <Badge variant="secondary">Beginner</Badge>
                              </div>
                              <div className="prose prose-invert prose-orange max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="bg-zinc-800/50 border-zinc-700 opacity-50">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold">{lesson.title}</h3>
                            <Lock className="w-5 h-5 text-orange-400" />
                          </div>
                          <p className="text-zinc-400 mb-4">You've reached your weekly lesson limit on the Explorer plan.</p>
                          <Button onClick={() => showUpgradePrompt('lesson')} className="bg-orange-600 hover:bg-orange-700">
                            Upgrade to Scholar - $9.99/month
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* Daily Quiz */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Daily Quiz</h2>
                  <DailyQuiz />
                </div>
              </div>
            )}

            {/* Other Learn tabs would go here... */}
            {learnSubTab === "glossary" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Bitcoin Glossary</h2>
                <div className="grid gap-4">
                  {[
                    { term: "Bitcoin", definition: "A peer-to-peer electronic cash system enabling direct transactions without intermediaries." },
                    { term: "Blockchain", definition: "A distributed ledger technology recording transactions in chronologically linked blocks." },
                    { term: "Mining", definition: "The process of validating transactions and securing the network while earning Bitcoin rewards." },
                    { term: "Wallet", definition: "Software or hardware storing private keys to send and receive Bitcoin." },
                    { term: "Private Key", definition: "A secret number proving Bitcoin ownership. Never share with anyone." },
                    { term: "Halving", definition: "Event every 4 years reducing mining rewards by half, limiting Bitcoin supply." },
                    { term: "HODL", definition: "Strategy of holding Bitcoin long-term regardless of price volatility." },
                    { term: "Satoshi", definition: "Smallest Bitcoin unit. One Bitcoin equals 100 million satoshis." }
                  ].map((item, index) => (
                    <Card key={index} className="bg-zinc-800/50 border-zinc-700">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-orange-400 mb-2">{item.term}</h3>
                        <p className="text-zinc-300">{item.definition}</p>
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
            <h2 className="text-2xl font-bold">Interactive Simulators</h2>
            
            {/* Practice Sub Navigation */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={practiceSubTab === "mining" ? "default" : "outline"}
                size="sm"
                onClick={() => setPracticeSubTab("mining")}
                className={practiceSubTab === "mining" ? "bg-orange-600 text-white" : ""}
              >
                <Zap className="w-4 h-4 mr-1" />
                Mining
              </Button>
              <Button
                variant={practiceSubTab === "dca" ? "default" : "outline"}
                size="sm"
                onClick={() => setPracticeSubTab("dca")}
                className={practiceSubTab === "dca" ? "bg-orange-600 text-white" : ""}
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                DCA
              </Button>
              <Button
                variant={practiceSubTab === "hodl" ? "default" : "outline"}
                size="sm"
                onClick={() => setPracticeSubTab("hodl")}
                className={practiceSubTab === "hodl" ? "bg-orange-600 text-white" : ""}
              >
                <Target className="w-4 h-4 mr-1" />
                HODLing
              </Button>
            </div>

            {/* Mining Calculator */}
            {practiceSubTab === "mining" && (
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-orange-400" />
                    Bitcoin Mining Profitability Calculator
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Hash Rate (TH/s)</label>
                        <Input
                          type="number"
                          value={hashRate}
                          onChange={(e) => setHashRate(Number(e.target.value))}
                          className="bg-zinc-900 border-zinc-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Power Consumption (W)</label>
                        <Input
                          type="number"
                          value={powerConsumption}
                          onChange={(e) => setPowerConsumption(Number(e.target.value))}
                          className="bg-zinc-900 border-zinc-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Electricity Cost ($/kWh)</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={electricityCost}
                          onChange={(e) => setElectricityCost(Number(e.target.value))}
                          className="bg-zinc-900 border-zinc-700"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-zinc-900/50 rounded-lg">
                        <h4 className="font-semibold text-orange-400 mb-2">Daily Profit</h4>
                        <p className="text-2xl font-bold text-green-400">
                          ${calculateMiningProfit().toFixed(2)}
                        </p>
                      </div>
                      <div className="p-4 bg-zinc-900/50 rounded-lg">
                        <h4 className="font-semibold text-orange-400 mb-2">Monthly Profit</h4>
                        <p className="text-xl font-bold text-green-400">
                          ${(calculateMiningProfit() * 30).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-xs text-zinc-400">
                        <p>* Estimates based on current network difficulty and Bitcoin price</p>
                        <p>* Results may vary with market conditions</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* DCA Calculator */}
            {practiceSubTab === "dca" && (
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                    Dollar-Cost Averaging Calculator
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Investment Amount ($)</label>
                        <Input
                          type="number"
                          value={dcaAmount}
                          onChange={(e) => setDcaAmount(Number(e.target.value))}
                          className="bg-zinc-900 border-zinc-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Frequency</label>
                        <select
                          value={dcaFrequency}
                          onChange={(e) => setDcaFrequency(e.target.value)}
                          className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded"
                        >
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Period (months)</label>
                        <Input
                          type="number"
                          value={dcaPeriod}
                          onChange={(e) => setDcaPeriod(Number(e.target.value))}
                          className="bg-zinc-900 border-zinc-700"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {(() => {
                        const results = calculateDCA();
                        return (
                          <>
                            <div className="p-4 bg-zinc-900/50 rounded-lg">
                              <h4 className="font-semibold text-orange-400 mb-2">Total Invested</h4>
                              <p className="text-xl font-bold">${results.totalInvested.toLocaleString()}</p>
                            </div>
                            <div className="p-4 bg-zinc-900/50 rounded-lg">
                              <h4 className="font-semibold text-orange-400 mb-2">Bitcoin Accumulated</h4>
                              <p className="text-xl font-bold">{results.bitcoinAccumulated.toFixed(6)} BTC</p>
                            </div>
                            <div className="p-4 bg-zinc-900/50 rounded-lg">
                              <h4 className="font-semibold text-orange-400 mb-2">Current Value</h4>
                              <p className="text-xl font-bold text-green-400">${results.currentValue.toLocaleString()}</p>
                            </div>
                            <div className="p-4 bg-zinc-900/50 rounded-lg">
                              <h4 className="font-semibold text-orange-400 mb-2">Profit/Loss</h4>
                              <p className={`text-xl font-bold ${results.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                ${results.profit.toLocaleString()}
                              </p>
                            </div>
                          </>
                        );
                      })()}
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
            {/* More Sub Navigation */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={moreSubTab === "stories" ? "default" : "outline"}
                size="sm"
                onClick={() => setMoreSubTab("stories")}
                className={moreSubTab === "stories" ? "bg-orange-600 text-white" : ""}
              >
                <Users className="w-4 h-4 mr-1" />
                Stories
              </Button>
              <Button
                variant={moreSubTab === "conviction" ? "default" : "outline"}
                size="sm"
                onClick={() => setMoreSubTab("conviction")}
                className={moreSubTab === "conviction" ? "bg-orange-600 text-white" : ""}
              >
                <Heart className="w-4 h-4 mr-1" />
                Conviction
              </Button>
              <Button
                variant={moreSubTab === "store" ? "default" : "outline"}
                size="sm"
                onClick={() => setMoreSubTab("store")}
                className={moreSubTab === "store" ? "bg-orange-600 text-white" : ""}
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Store
              </Button>
            </div>

            {/* Stories Section */}
            {moreSubTab === "stories" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Bitcoin Stories</h2>
                
                {/* Stories Sub Navigation */}
                <div className="flex gap-2 justify-center">
                  <Button
                    variant={storiesSubTab === "individuals" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStoriesSubTab("individuals")}
                    className={storiesSubTab === "individuals" ? "bg-orange-600 text-white" : ""}
                  >
                    Individuals
                  </Button>
                  <Button
                    variant={storiesSubTab === "businesses" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStoriesSubTab("businesses")}
                    className={storiesSubTab === "businesses" ? "bg-orange-600 text-white" : ""}
                  >
                    Businesses
                  </Button>
                  <Button
                    variant={storiesSubTab === "nations" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStoriesSubTab("nations")}
                    className={storiesSubTab === "nations" ? "bg-orange-600 text-white" : ""}
                  >
                    Nations
                  </Button>
                </div>

                <div className="grid gap-4">
                  {userProfiles[storiesSubTab].map((profile, index) => (
                    <Card key={index} className="bg-zinc-800/50 border-zinc-700">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <UserIcon className="w-8 h-8 text-orange-400 mt-1" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{profile.name}</h3>
                            <p className="text-sm text-orange-400 mb-2">{profile.role}</p>
                            <p className="text-zinc-300 mb-3">{profile.story}</p>
                            <p className="text-sm text-zinc-400 italic">"{profile.reason}"</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Conviction Section */}
            {moreSubTab === "conviction" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Conviction Center</h2>
                
                {/* Conviction Sub Navigation */}
                <div className="flex gap-2 justify-center">
                  <Button
                    variant={convictionSubTab === "quotes" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setConvictionSubTab("quotes")}
                    className={convictionSubTab === "quotes" ? "bg-orange-600 text-white" : ""}
                  >
                    <Quote className="w-4 h-4 mr-1" />
                    Quotes
                  </Button>
                  <Button
                    variant={convictionSubTab === "books" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setConvictionSubTab("books")}
                    className={convictionSubTab === "books" ? "bg-orange-600 text-white" : ""}
                  >
                    <BookOpen className="w-4 h-4 mr-1" />
                    Books
                  </Button>
                  <Button
                    variant={convictionSubTab === "videos" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setConvictionSubTab("videos")}
                    className={convictionSubTab === "videos" ? "bg-orange-600 text-white" : ""}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Videos
                  </Button>
                </div>

                {/* Quotes */}
                {convictionSubTab === "quotes" && (
                  <div className="grid gap-4">
                    {convictionContent.quotes.map((item, index) => (
                      <Card key={index} className="bg-zinc-800/50 border-zinc-700">
                        <CardContent className="p-6">
                          <Quote className="w-8 h-8 text-orange-400 mb-4" />
                          <blockquote className="text-lg italic text-zinc-300 mb-4">
                            "{item.quote}"
                          </blockquote>
                          <div className="text-right">
                            <p className="font-semibold text-orange-400">— {item.author}</p>
                            <p className="text-sm text-zinc-400">{item.role}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Books */}
                {convictionSubTab === "books" && (
                  <div className="grid gap-4">
                    {convictionContent.books.map((book, index) => (
                      <Card key={index} className="bg-zinc-800/50 border-zinc-700">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <BookOpen className="w-8 h-8 text-orange-400 mt-1" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-white">{book.title}</h3>
                              <p className="text-orange-400 text-sm">by {book.author}</p>
                              <Badge variant="secondary" className="mt-1 mb-2">{book.difficulty}</Badge>
                              <p className="text-zinc-300 mb-3">{book.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold text-green-400">{book.price}</span>
                                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                                  <ExternalLink className="w-4 h-4 mr-1" />
                                  Buy Now
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Videos */}
                {convictionSubTab === "videos" && (
                  <div className="grid gap-4">
                    {convictionContent.videos.map((video, index) => (
                      <Card key={index} className="bg-zinc-800/50 border-zinc-700">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <Play className="w-8 h-8 text-orange-400 mt-1" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-white">{video.title}</h3>
                              <p className="text-orange-400 text-sm">by {video.creator}</p>
                              <Badge variant="secondary" className="mt-1 mb-2">{video.duration}</Badge>
                              <p className="text-zinc-300 mb-3">{video.description}</p>
                              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                                <Play className="w-4 h-4 mr-1" />
                                Watch Now
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Store Section */}
            {moreSubTab === "store" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Bitcoin Store</h2>
                <p className="text-zinc-400">Curated Bitcoin books, hardware, and courses. Affiliate links support ₿ Journey development.</p>
                
                {/* Books */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">📚 Essential Books</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {storeItems.books.map((item, index) => (
                      <Card key={index} className="bg-zinc-800/50 border-zinc-700">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="text-4xl">{item.image}</div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white">{item.title}</h4>
                              <p className="text-orange-400 text-sm">by {item.author}</p>
                              <p className="text-zinc-300 text-sm mt-1 mb-3">{item.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold text-green-400">{item.price}</span>
                                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                                  <ShoppingCart className="w-4 h-4 mr-1" />
                                  Buy
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Hardware */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">🔐 Hardware Wallets</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {storeItems.hardware.map((item, index) => (
                      <Card key={index} className="bg-zinc-800/50 border-zinc-700">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="text-4xl">{item.image}</div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white">{item.name}</h4>
                              <p className="text-zinc-300 text-sm mt-1 mb-3">{item.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold text-green-400">{item.price}</span>
                                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                                  <ShoppingCart className="w-4 h-4 mr-1" />
                                  Buy
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Courses */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">🎓 Educational Courses</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {storeItems.courses.map((item, index) => (
                      <Card key={index} className="bg-zinc-800/50 border-zinc-700">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="text-4xl">{item.image}</div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white">{item.title}</h4>
                              <p className="text-orange-400 text-sm">by {item.instructor}</p>
                              <p className="text-zinc-300 text-sm mt-1 mb-3">{item.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold text-green-400">{item.price}</span>
                                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                                  <ShoppingCart className="w-4 h-4 mr-1" />
                                  Enroll
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-orange-400">Upgrade Your Journey</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-zinc-300">
              Unlock unlimited access to all Bitcoin education content, advanced simulators, and premium features.
            </p>
            
            <div className="grid gap-3">
              {Object.entries(subscriptionTiers).map(([key, tier]) => (
                <Card key={key} className={`bg-zinc-800/50 border-zinc-700 ${key === 'scholar' ? 'border-orange-400' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{tier.name}</h3>
                      <span className="text-lg font-bold text-orange-400">{tier.price}</span>
                    </div>
                    <ul className="text-sm text-zinc-300 space-y-1">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {key !== 'explorer' && (
                      <Button className="w-full mt-3 bg-orange-600 hover:bg-orange-700">
                        Choose {tier.name}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Financial Disclaimer */}
      <footer className="bg-zinc-900/80 border-t border-zinc-800 py-4">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs text-zinc-500">
            ₿ Journey is for educational purposes only. Not financial advice. Bitcoin investments carry risk.
          </p>
        </div>
      </footer>
    </div>
  );
}