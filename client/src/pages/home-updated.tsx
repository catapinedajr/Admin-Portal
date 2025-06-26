import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
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
  Clock,
  Star,
  Trophy,
  Target,
  Flame,
  Crown,
  Lock,
  ShoppingCart,
  Package
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
type LearnSubTab = "basics" | "lesson" | "quiz" | "explore" | "disruption" | "terms";
type PracticeSubTab = "mining" | "transactions" | "hodl" | "dca" | "halving";
type MoreSubTab = "stories" | "conviction" | "store";
type DisruptionSubTab = "problems" | "solutions" | "comparison" | "future";
type StoriesSubTab = "individuals" | "businesses" | "nations";
type ConvictionSubTab = "whitepaper" | "videos";

// Affiliate store products for revenue generation
interface StoreProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  category: "books" | "hardware" | "courses" | "tools";
  affiliateLink: string;
  image: string;
  rating: number;
  reviews: number;
  features: string[];
  bestseller?: boolean;
}

// User progression and gamification
interface UserLevel {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  color: string;
  icon: React.ReactNode;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  xp: number;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface UserStats {
  xp: number;
  level: UserLevel;
  currentStreak: number;
  longestStreak: number;
  lessonsCompleted: number;
  quizScore: number;
  timeSpent: number; // minutes
  achievementsUnlocked: number;
  subscriptionTier: 'free' | 'premium' | 'premium_plus';
}

const userLevels: UserLevel[] = [
  { level: 1, title: "Bitcoin Curious", minXP: 0, maxXP: 100, color: "zinc", icon: <Bitcoin className="w-4 h-4" /> },
  { level: 2, title: "Satoshi Student", minXP: 100, maxXP: 300, color: "orange", icon: <GraduationCap className="w-4 h-4" /> },
  { level: 3, title: "Crypto Cadet", minXP: 300, maxXP: 600, color: "yellow", icon: <Shield className="w-4 h-4" /> },
  { level: 4, title: "Blockchain Builder", minXP: 600, maxXP: 1000, color: "blue", icon: <Box className="w-4 h-4" /> },
  { level: 5, title: "Digital Pioneer", minXP: 1000, maxXP: 1500, color: "purple", icon: <Zap className="w-4 h-4" /> },
  { level: 6, title: "Bitcoin Expert", minXP: 1500, maxXP: 2500, color: "green", icon: <Trophy className="w-4 h-4" /> },
  { level: 7, title: "Crypto Master", minXP: 2500, maxXP: 5000, color: "red", icon: <Crown className="w-4 h-4" /> },
];

const achievements: Achievement[] = [
  { id: "first_lesson", title: "First Steps", description: "Complete your first lesson", icon: <BookOpen className="w-4 h-4" />, xp: 25, unlocked: true },
  { id: "week_streak", title: "Week Warrior", description: "Maintain a 7-day learning streak", icon: <Flame className="w-4 h-4" />, xp: 100, unlocked: true },
  { id: "quiz_master", title: "Quiz Master", description: "Score 90%+ on 5 quizzes", icon: <Target className="w-4 h-4" />, xp: 150, unlocked: false, progress: 3, maxProgress: 5 },
  { id: "explorer", title: "Bitcoin Explorer", description: "Complete all foundation topics", icon: <Globe className="w-4 h-4" />, xp: 200, unlocked: false, progress: 3, maxProgress: 6 },
  { id: "simulator", title: "Hands-on Learner", description: "Try all simulation tools", icon: <BarChart3 className="w-4 h-4" />, xp: 75, unlocked: false, progress: 2, maxProgress: 5 },
  { id: "conviction", title: "True Believer", description: "Read the Bitcoin whitepaper", icon: <Heart className="w-4 h-4" />, xp: 300, unlocked: false },
];

const subscriptionTiers = {
  free: {
    name: "Explorer",
    price: "$0",
    period: "forever",
    features: [
      "3 daily facts per day",
      "1 lesson per week", 
      "Basic quiz questions",
      "Community access",
      "Achievement tracking"
    ],
    limits: {
      dailyFacts: 3,
      weeklyLessons: 1,
      simulators: 1,
      premium: false
    }
  },
  premium: {
    name: "Scholar",
    price: "$9.99",
    period: "month",
    features: [
      "Unlimited daily content",
      "All lessons & deep dives",
      "Advanced simulations",
      "Progress analytics",
      "Priority support",
      "Exclusive content"
    ],
    limits: {
      dailyFacts: -1, // unlimited
      weeklyLessons: -1,
      simulators: -1,
      premium: true
    }
  },
  premium_plus: {
    name: "Master",
    price: "$19.99", 
    period: "month",
    features: [
      "Everything in Scholar",
      "1-on-1 expert sessions",
      "Custom learning paths",
      "Advanced portfolio tools",
      "Early access features",
      "Certificate program"
    ],
    limits: {
      dailyFacts: -1,
      weeklyLessons: -1,
      simulators: -1,
      premium: true,
      expertSessions: true
    }
  }
};

const storeProducts: StoreProduct[] = [
  // Books
  {
    id: "bitcoin-standard",
    name: "The Bitcoin Standard",
    description: "The definitive guide to Bitcoin's economics and history by Saifedean Ammous",
    price: "$16.99",
    originalPrice: "$24.99",
    category: "books",
    affiliateLink: "https://amazon.com/affiliate/bitcoin-standard",
    image: "/api/placeholder/300/400",
    rating: 4.8,
    reviews: 2847,
    features: ["Economic principles", "Historical context", "Sound money theory"],
    bestseller: true
  },
  {
    id: "mastering-bitcoin",
    name: "Mastering Bitcoin",
    description: "Technical deep dive into Bitcoin programming by Andreas Antonopoulos",
    price: "$29.99",
    originalPrice: "$39.99",
    category: "books",
    affiliateLink: "https://amazon.com/affiliate/mastering-bitcoin",
    image: "/api/placeholder/300/400",
    rating: 4.7,
    reviews: 1523,
    features: ["Programming guide", "Technical concepts", "Developer focused"]
  },
  {
    id: "layered-money",
    name: "Layered Money",
    description: "From Gold and Dollars to Bitcoin and Central Bank Digital Currencies",
    price: "$18.99",
    originalPrice: "$26.99",
    category: "books",
    affiliateLink: "https://amazon.com/affiliate/layered-money",
    image: "/api/placeholder/300/400",
    rating: 4.6,
    reviews: 892,
    features: ["Monetary evolution", "CBDC analysis", "Financial history"]
  },
  
  // Hardware Wallets
  {
    id: "ledger-nano-x",
    name: "Ledger Nano X",
    description: "Premium hardware wallet with Bluetooth connectivity and mobile support",
    price: "$149.00",
    originalPrice: "$179.00",
    category: "hardware",
    affiliateLink: "https://ledger.com/affiliate/nano-x",
    image: "/api/placeholder/300/400",
    rating: 4.6,
    reviews: 8934,
    features: ["Bluetooth support", "100+ cryptocurrencies", "Mobile app"],
    bestseller: true
  },
  {
    id: "trezor-model-t",
    name: "Trezor Model T",
    description: "Advanced hardware wallet with touchscreen and comprehensive security features",
    price: "$219.00",
    category: "hardware",
    affiliateLink: "https://trezor.io/affiliate/model-t",
    image: "/api/placeholder/300/400",
    rating: 4.7,
    reviews: 5621,
    features: ["Touchscreen", "Advanced security", "Open source"]
  },
  {
    id: "coldcard-mk4",
    name: "Coldcard Mk4",
    description: "Bitcoin-only hardware wallet with advanced security features",
    price: "$169.00",
    category: "hardware",
    affiliateLink: "https://coldcard.com/affiliate/mk4",
    image: "/api/placeholder/300/400",
    rating: 4.8,
    reviews: 3247,
    features: ["Bitcoin-only", "Air-gapped", "Advanced security"]
  },
  
  // Courses
  {
    id: "bitcoin-mastery",
    name: "Bitcoin Mastery Course",
    description: "Complete video course covering Bitcoin from basics to advanced concepts",
    price: "$199.00",
    originalPrice: "$299.00",
    category: "courses",
    affiliateLink: "https://bitcoinmastery.com/affiliate",
    image: "/api/placeholder/300/400",
    rating: 4.9,
    reviews: 756,
    features: ["20+ hours video", "Expert instructors", "Certificate included"]
  },
  
  // Tools
  {
    id: "casa-node",
    name: "Casa Bitcoin Node",
    description: "Plug-and-play Bitcoin full node for enhanced privacy and security",
    price: "$399.00",
    category: "tools",
    affiliateLink: "https://casa.io/affiliate/node",
    image: "/api/placeholder/300/400",
    rating: 4.5,
    reviews: 234,
    features: ["Full node", "Enhanced privacy", "Easy setup"]
  }
];

export default function Home() {
  const [activeSection, setActiveSection] = useState<MainSection>("learn");
  const [learnSubTab, setLearnSubTab] = useState<LearnSubTab>("basics");
  const [practiceSubTab, setPracticeSubTab] = useState<PracticeSubTab>("mining");
  const [moreSubTab, setMoreSubTab] = useState<MoreSubTab>("stories");
  const [disruptionSubTab, setDisruptionSubTab] = useState<DisruptionSubTab>("problems");
  const [storiesSubTab, setStoriesSubTab] = useState<StoriesSubTab>("individuals");
  const [convictionSubTab, setConvictionSubTab] = useState<ConvictionSubTab>("whitepaper");
  const [expandedTopics, setExpandedTopics] = useState<Set<number>>(new Set());
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Mock user stats (would come from backend in real app)
  const [userStats, setUserStats] = useState<UserStats>({
    xp: 450,
    level: userLevels.find(l => 450 >= l.minXP && 450 < l.maxXP) || userLevels[0],
    currentStreak: 7,
    longestStreak: 12,
    lessonsCompleted: 15,
    quizScore: 85,
    timeSpent: 240,
    achievementsUnlocked: 8,
    subscriptionTier: 'free'
  });

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

  const { data: bitcoinPrice } = useQuery({
    queryKey: ['/api/bitcoin-price'],
    queryFn: () => fetch('/api/bitcoin-price').then(res => res.json()),
    refetchInterval: 30000
  });

  const filteredProducts = selectedCategory === "all" 
    ? storeProducts 
    : storeProducts.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-orange-400 text-xl font-bold">₿</div>
              <h1 className="text-lg font-semibold text-white"><span className="text-orange-400">Journey</span></h1>
            </div>
            
            <div className="flex items-center gap-2">
              {/* User Progress Display */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProgressModal(true)}
                className="hidden sm:flex items-center gap-2 text-xs px-2 py-1 hover:bg-zinc-800"
              >
                <div className="flex items-center gap-1">
                  {userStats.level.icon}
                  <span className="text-orange-400">{userStats.level.title}</span>
                </div>
                <div className="w-16 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-400 transition-all duration-300"
                    style={{ 
                      width: `${((userStats.xp - userStats.level.minXP) / (userStats.level.maxXP - userStats.level.minXP)) * 100}%` 
                    }}
                  />
                </div>
                <span className="text-zinc-400">{userStats.xp} XP</span>
              </Button>
              
              {/* Streak Counter */}
              <div className="flex items-center gap-1 text-xs px-2 py-1 bg-zinc-800 rounded">
                <Flame className="w-3 h-3 text-orange-500" />
                <span className="text-orange-400">{userStats.currentStreak}</span>
              </div>
              
              {/* Subscription Badge */}
              {userStats.subscriptionTier === 'free' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUpgradeModal(true)}
                  className="text-xs px-2 py-1 border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                >
                  Upgrade
                </Button>
              )}
              
              {userStats.subscriptionTier !== 'free' && (
                <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs px-2 py-1">
                  {subscriptionTiers[userStats.subscriptionTier].name}
                </Badge>
              )}
              
              <Button
                variant="ghost"
                size="sm"
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
              variant={activeSection === "learn" ? "default" : "ghost"}
              size="lg"
              onClick={() => setActiveSection("learn")}
              className={`${activeSection === "learn" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"} px-6 py-3`}
            >
              <GraduationCap className="w-5 h-5 mr-2" />
              Learn
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
              variant={activeSection === "more" ? "default" : "ghost"}
              size="lg"
              onClick={() => setActiveSection("more")}
              className={`${activeSection === "more" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"} px-6 py-3`}
            >
              <Heart className="w-5 h-5 mr-2" />
              More
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
                variant={learnSubTab === "basics" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setLearnSubTab("basics")}
                className="text-xs px-2 py-1"
              >
                <Lightbulb className="w-3 h-3 mr-1" />
                Facts
              </Button>
              <Button
                variant={learnSubTab === "lesson" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setLearnSubTab("lesson")}
                className="text-xs px-2 py-1"
              >
                <BookOpen className="w-3 h-3 mr-1" />
                Lesson
              </Button>
              <Button
                variant={learnSubTab === "quiz" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setLearnSubTab("quiz")}
                className="text-xs px-2 py-1"
              >
                <HelpCircle className="w-3 h-3 mr-1" />
                Quiz
              </Button>
              <Button
                variant={learnSubTab === "explore" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setLearnSubTab("explore")}
                className="text-xs px-2 py-1"
              >
                <Globe className="w-3 h-3 mr-1" />
                Explore
              </Button>
              <Button
                variant={learnSubTab === "disruption" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setLearnSubTab("disruption")}
                className="text-xs px-2 py-1"
              >
                <AlertTriangle className="w-3 h-3 mr-1" />
                Why Bitcoin
              </Button>
              <Button
                variant={learnSubTab === "terms" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setLearnSubTab("terms")}
                className="text-xs px-2 py-1"
              >
                <FileText className="w-3 h-3 mr-1" />
                Glossary
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
                variant={moreSubTab === "stories" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setMoreSubTab("stories")}
                className="text-xs px-2 py-1"
              >
                <Users className="w-3 h-3 mr-1" />
                Stories
              </Button>
              <Button
                variant={moreSubTab === "conviction" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setMoreSubTab("conviction")}
                className="text-xs px-2 py-1"
              >
                <Heart className="w-3 h-3 mr-1" />
                Conviction
              </Button>
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
        {/* Learn Section */}
        {activeSection === "learn" && (
          <div className="space-y-6">
            {learnSubTab === "basics" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Daily Bitcoin Facts</h2>
                  <p className="text-zinc-400">Learn something new about Bitcoin every day</p>
                </div>
                
                <div className="grid gap-4">
                  {dailyFacts.map((fact, index) => {
                    const IconComponent = iconMap[fact.icon as keyof typeof iconMap] || Lightbulb;
                    const isExpanded = expandedTopics.has(index);
                    const isLocked = userStats.subscriptionTier === 'free' && index >= subscriptionTiers.free.limits.dailyFacts;
                    
                    if (isLocked) {
                      return (
                        <Card key={fact.id} className="bg-zinc-900/50 border-zinc-800 relative overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-10 h-10 bg-zinc-600/10 rounded-lg flex items-center justify-center">
                                <Lock className="w-5 h-5 text-zinc-500" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-zinc-400 mb-2">Premium Content</h3>
                                <p className="text-zinc-500 leading-relaxed">Unlock unlimited daily facts with premium subscription</p>
                                <Button
                                  size="sm"
                                  onClick={() => setShowUpgradeModal(true)}
                                  className="mt-3 bg-orange-600 hover:bg-orange-700 text-white"
                                >
                                  <Crown className="w-4 h-4 mr-1" />
                                  Upgrade to Premium
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    }
                    
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
                              
                              <div className="flex items-center justify-between mt-3">
                                <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                                  {fact.category}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newExpanded = new Set(expandedTopics);
                                    if (isExpanded) {
                                      newExpanded.delete(index);
                                    } else {
                                      newExpanded.add(index);
                                    }
                                    setExpandedTopics(newExpanded);
                                  }}
                                  className="text-orange-400 hover:text-orange-300 hover:bg-orange-400/10"
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronUp className="w-4 h-4 mr-1" />
                                      Less Detail
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="w-4 h-4 mr-1" />
                                      Dive Deeper
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {learnSubTab === "quiz" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Daily Quiz</h2>
                  <p className="text-zinc-400">Test your Bitcoin knowledge</p>
                </div>
                <DailyQuiz />
              </div>
            )}
          </div>
        )}

        {/* More Section - Store Implementation */}
        {activeSection === "more" && moreSubTab === "store" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">₿ Journey Store</h2>
              <p className="text-zinc-400">Essential tools and resources for your Bitcoin journey</p>
            </div>

            {/* Category Filter */}
            <div className="flex justify-center">
              <div className="flex items-center gap-2 bg-zinc-800/50 p-1 rounded-lg">
                {["all", "books", "hardware", "courses", "tools"].map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`text-xs px-3 py-1 ${
                      selectedCategory === category ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Product Image Placeholder */}
                      <div className="w-full h-48 bg-zinc-800 rounded-lg flex items-center justify-center">
                        <Package className="w-12 h-12 text-zinc-600" />
                      </div>
                      
                      {/* Product Info */}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-white text-lg">{product.name}</h3>
                          {product.bestseller && (
                            <Badge className="bg-orange-600 text-white text-xs">Bestseller</Badge>
                          )}
                        </div>
                        
                        <p className="text-zinc-400 text-sm">{product.description}</p>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating) ? "text-yellow-500 fill-current" : "text-zinc-600"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-zinc-400">
                            {product.rating} ({product.reviews.toLocaleString()} reviews)
                          </span>
                        </div>
                        
                        {/* Features */}
                        <div className="space-y-1">
                          {product.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-zinc-400">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              {feature}
                            </div>
                          ))}
                        </div>
                        
                        {/* Price and CTA */}
                        <div className="pt-2 border-t border-zinc-800">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-orange-400">{product.price}</span>
                              {product.originalPrice && (
                                <span className="text-sm text-zinc-500 line-through">{product.originalPrice}</span>
                              )}
                            </div>
                            <Button
                              size="sm"
                              className="bg-orange-600 hover:bg-orange-700 text-white"
                              onClick={() => window.open(product.affiliateLink, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Buy Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Affiliate Disclosure */}
            <div className="mt-8 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <p className="text-xs text-zinc-500 leading-relaxed">
                <strong className="text-zinc-400">Affiliate Disclosure:</strong> ₿ Journey may earn commissions from purchases made through affiliate links. 
                This helps support the development of free educational content while maintaining our editorial independence. 
                We only recommend products we genuinely believe will benefit your Bitcoin journey.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* User Progress Modal */}
      <Dialog open={showProgressModal} onOpenChange={setShowProgressModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-orange-400">Your Bitcoin Journey Progress</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Level Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {userStats.level.icon}
                  <h3 className="text-lg font-semibold">{userStats.level.title}</h3>
                  <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                    Level {userStats.level.level}
                  </Badge>
                </div>
                <span className="text-zinc-400">{userStats.xp} / {userStats.level.maxXP} XP</span>
              </div>
              <Progress 
                value={((userStats.xp - userStats.level.minXP) / (userStats.level.maxXP - userStats.level.minXP)) * 100} 
                className="h-3 bg-zinc-800"
              />
              <p className="text-sm text-zinc-400">
                {userStats.level.maxXP - userStats.xp} XP until next level
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
                <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-400">{userStats.currentStreak}</div>
                <div className="text-sm text-zinc-400">Day Streak</div>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
                <BookOpen className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-400">{userStats.lessonsCompleted}</div>
                <div className="text-sm text-zinc-400">Lessons</div>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
                <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">{userStats.quizScore}%</div>
                <div className="text-sm text-zinc-400">Quiz Score</div>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
                <Clock className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-400">{Math.floor(userStats.timeSpent / 60)}h</div>
                <div className="text-sm text-zinc-400">Time Spent</div>
              </div>
            </div>

            {/* Achievements */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Achievements</h3>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      achievement.unlocked 
                        ? 'bg-green-900/20 border border-green-800/50' 
                        : 'bg-zinc-800/30 border border-zinc-700/50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      achievement.unlocked ? 'bg-green-600/20' : 'bg-zinc-700'
                    }`}>
                      {achievement.unlocked ? achievement.icon : <Lock className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-medium ${
                          achievement.unlocked ? 'text-green-400' : 'text-zinc-400'
                        }`}>
                          {achievement.title}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          +{achievement.xp} XP
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-500">{achievement.description}</p>
                      {achievement.progress !== undefined && !achievement.unlocked && (
                        <div className="mt-1">
                          <Progress 
                            value={(achievement.progress / achievement.maxProgress!) * 100} 
                            className="h-1 bg-zinc-700"
                          />
                          <span className="text-xs text-zinc-500">
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-orange-400">Upgrade Your Bitcoin Journey</DialogTitle>
            <p className="text-zinc-400">Unlock premium features and accelerate your learning</p>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(subscriptionTiers).map(([tierKey, tier]) => (
              <div
                key={tierKey}
                className={`border rounded-lg p-6 space-y-4 ${
                  tierKey === 'premium' 
                    ? 'border-orange-500 bg-orange-500/5' 
                    : tierKey === 'premium_plus'
                    ? 'border-purple-500 bg-purple-500/5'
                    : 'border-zinc-700 bg-zinc-800/50'
                }`}
              >
                <div className="text-center">
                  {tierKey === 'premium' && <Crown className="w-8 h-8 text-orange-500 mx-auto mb-2" />}
                  {tierKey === 'premium_plus' && <Trophy className="w-8 h-8 text-purple-500 mx-auto mb-2" />}
                  {tierKey === 'free' && <Bitcoin className="w-8 h-8 text-zinc-500 mx-auto mb-2" />}
                  
                  <h3 className="text-xl font-bold">{tier.name}</h3>
                  <div className="text-3xl font-bold">
                    {tier.price}
                    {tier.period !== 'forever' && (
                      <span className="text-lg text-zinc-400">/{tier.period}</span>
                    )}
                  </div>
                  
                  {tierKey === 'premium' && (
                    <Badge className="bg-orange-600 text-white">Most Popular</Badge>
                  )}
                  {tierKey === 'premium_plus' && (
                    <Badge className="bg-purple-600 text-white">Best Value</Badge>
                  )}
                </div>

                <ul className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    tierKey === 'premium'
                      ? 'bg-orange-600 hover:bg-orange-700'
                      : tierKey === 'premium_plus'
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-zinc-700 hover:bg-zinc-600'
                  }`}
                  disabled={userStats.subscriptionTier === tierKey}
                >
                  {userStats.subscriptionTier === tierKey 
                    ? 'Current Plan' 
                    : tierKey === 'free' 
                    ? 'Current Plan'
                    : 'Upgrade Now'
                  }
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h4 className="font-semibold text-orange-400 mb-2">Why Upgrade?</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Unlimited Learning:</strong> Access all daily content, lessons, and simulations without restrictions
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Advanced Analytics:</strong> Track your progress with detailed insights and personalized recommendations
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Expert Sessions:</strong> 1-on-1 guidance from Bitcoin educators and industry professionals
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Early Access:</strong> Be first to try new features and educational content
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center text-sm text-zinc-500">
              30-day money-back guarantee • Cancel anytime • Secure payment processing
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}