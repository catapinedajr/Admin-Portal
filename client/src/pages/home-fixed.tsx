import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { 
  Activity, 
  TrendingUp, 
  Calendar, 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  BookOpen, 
  Play, 
  ExternalLink,
  User as UserIcon, 
  Building2, 
  Globe,
  Flag,
  ArrowRight,
  Shield,
  Smartphone,
  Wallet,
  DollarSign,
  Clock,
  ChevronRight,
  Cpu,
  Info,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Gift,
  ShoppingCart,
  Heart,
  Plus,
  Award,
  Users,
  Factory,
  Coins,
  PiggyBank,
  Calculator,
  Gamepad2,
  Lightbulb,
  Brain,
  Rocket,
  Mountain,
  ChartLine,
  Lock
} from "lucide-react";

import { ProgressIndicator, AchievementBadge, LearningAnalytics } from "@/components/ProgressIndicator";
import { AchievementSystem } from "@/components/AchievementSystem";
import DailyQuiz from "@/components/DailyQuiz";
import { AutoGlossary, BitcoinTerm } from "@/components/BitcoinGlossary";

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

  // User Profiles Data for Stories section
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

  // Conviction content data
  const convictionContent = {
    whitepaper: {
      title: "Bitcoin: A Peer-to-Peer Electronic Cash System",
      author: "Satoshi Nakamoto",
      date: "October 31, 2008",
      sections: [
        {
          title: "Abstract", 
          content: "A purely peer-to-peer version of electronic cash would allow online payments to be sent directly from one party to another without going through a financial institution.",
          keyPoints: ["Direct peer-to-peer transactions", "No financial intermediaries", "Electronic cash system"]
        },
        {
          title: "Introduction",
          content: "Commerce on the Internet has come to rely almost exclusively on financial institutions serving as trusted third parties to process electronic payments.",
          keyPoints: ["Internet commerce relies on trusted third parties", "Need for electronic payment system", "Trust-based model has limitations"]
        },
        {
          title: "Transactions", 
          content: "We define an electronic coin as a chain of digital signatures. Each owner transfers the coin to the next by digitally signing a hash of the previous transaction.",
          keyPoints: ["Electronic coins as signature chains", "Digital signatures for ownership", "Transaction verification process"]
        }
      ]
    },
    books: [
      {
        title: "The Bitcoin Standard",
        author: "Saifedean Ammous", 
        difficulty: "Intermediate",
        pages: "304",
        description: "Examines Bitcoin through the lens of Austrian economics and monetary history, arguing why Bitcoin represents the hardest money ever created.",
        keyTopics: ["Monetary history", "Austrian economics", "Sound money principles", "Bitcoin as digital gold"],
        amazonUrl: "https://amzn.to/bitcoin-standard"
      },
      {
        title: "Broken Money", 
        author: "Lyn Alden",
        difficulty: "Beginner-Friendly",
        pages: "352", 
        description: "A comprehensive look at how our monetary system became broken and why Bitcoin offers a solution to restore sound money principles.",
        keyTopics: ["Monetary system problems", "Inflation mechanics", "Bitcoin solutions", "Investment strategies"],
        amazonUrl: "https://amzn.to/broken-money-lyn"
      },
      {
        title: "The Fiat Standard",
        author: "Saifedean Ammous",
        difficulty: "Advanced", 
        pages: "352",
        description: "Analyzes the consequences of abandoning sound money and how fiat currencies have reshaped society, economics, and politics.",
        keyTopics: ["Fiat money consequences", "Economic distortions", "Political implications", "Path to sound money"],
        amazonUrl: "https://amzn.to/fiat-standard"  
      }
    ],
    videos: [
      {
        title: "What is Money?",
        speaker: "Michael Saylor", 
        duration: "1h 23m",
        type: "Educational",
        description: "MicroStrategy CEO Michael Saylor explains the fundamental properties of money and why Bitcoin represents the apex of monetary evolution.",
        url: "https://www.youtube.com/watch?v=money-saylor",
        keyTopics: ["Properties of money", "Monetary evolution", "Bitcoin advantages", "Corporate treasury strategy"]
      },
      {
        title: "The Bitcoin Standard Presentation",
        speaker: "Saifedean Ammous",
        duration: "45m", 
        type: "Conference Talk",
        description: "Author of The Bitcoin Standard presents the key arguments for why Bitcoin represents a return to sound money principles.",
        url: "https://www.youtube.com/watch?v=bitcoin-standard-talk",
        keyTopics: ["Sound money history", "Austrian economics", "Bitcoin vs fiat", "Long-term implications"]
      },
      {
        title: "Bitcoin & The Energy Grid",
        speaker: "Lyn Alden & Troy Cross",
        duration: "1h 15m",
        type: "Technical Discussion", 
        description: "Deep dive into Bitcoin mining's relationship with energy infrastructure and its potential to accelerate renewable energy adoption.",
        url: "https://www.youtube.com/watch?v=bitcoin-energy",
        keyTopics: ["Bitcoin mining energy use", "Grid stabilization", "Renewable energy", "Environmental impact"]
      }
    ]
  };

  // Store products data
  const storeProducts = {
    hardware: [
      {
        name: "Ledger Nano X",
        price: "$149",
        originalPrice: "$179", 
        description: "The most popular hardware wallet with Bluetooth connectivity and support for 5,500+ cryptocurrencies.",
        features: ["Bluetooth connectivity", "Mobile app support", "Supports 5,500+ cryptocurrencies", "Secure Element chip"],
        affiliate_url: "https://shop.ledger.com/?r=btc-journey",
        rating: 4.5,
        reviews: 12500
      },
      {
        name: "Trezor Model T", 
        price: "$219",
        originalPrice: "$269",
        description: "Premium hardware wallet with touchscreen interface and advanced security features for serious Bitcoin holders.",
        features: ["Touchscreen display", "Advanced recovery features", "Open source firmware", "Shamir Backup support"],
        affiliate_url: "https://trezor.io/?offer=btc-journey", 
        rating: 4.7,
        reviews: 8900
      }
    ],
    books: [
      {
        title: "Broken Money",
        author: "Lyn Alden",
        price: "$18",
        originalPrice: "$25", 
        description: "Deep dive into monetary history and Bitcoin's role in fixing our broken financial system.",
        affiliate_url: "https://amzn.to/3broken-money-lyn-alden",
        rating: 4.8,
        reviews: 2100
      },
      {
        title: "The Bitcoin Standard", 
        author: "Saifedean Ammous",
        price: "$16",
        originalPrice: "$22",
        description: "The definitive guide to understanding Bitcoin through Austrian economics and monetary history.",
        affiliate_url: "https://amzn.to/bitcoin-standard-ammous",
        rating: 4.6, 
        reviews: 5400
      },
      {
        title: "The Fiat Standard",
        author: "Saifedean Ammous", 
        price: "$19",
        originalPrice: "$26",
        description: "Analyzes the consequences of fiat money and the path back to sound money principles.",
        affiliate_url: "https://amzn.to/fiat-standard-book",
        rating: 4.5,
        reviews: 1800
      }
    ]
  };

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
                                <Award className="w-4 h-4" />
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

            {/* Other Learn content placeholder */}
            {learnSubTab !== "stories" && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-zinc-400 mb-2">
                  {learnSubTab === "today" && "Today's Learning"}
                  {learnSubTab === "deepdive" && "Deep Dive Content"}
                  {learnSubTab === "reference" && "Reference Materials"}
                </h3>
                <p className="text-zinc-500">Content coming soon...</p>
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
                  variant={practiceSubTab === "hodl" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setPracticeSubTab("hodl")}
                  className="text-xs px-3 py-1"
                >
                  <Mountain className="w-3 h-3 mr-1" />
                  HODL
                </Button>
                <Button
                  variant={practiceSubTab === "dca" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setPracticeSubTab("dca")}
                  className="text-xs px-3 py-1"
                >
                  <Calculator className="w-3 h-3 mr-1" />
                  DCA
                </Button>
              </div>
            </div>

            {/* Practice Content Placeholder */}
            <div className="text-center py-12">
              <Gamepad2 className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-zinc-400 mb-2">
                {practiceSubTab === "safety" && "Bitcoin Safety Training"}
                {practiceSubTab === "hodl" && "HODLing Strategies"}
                {practiceSubTab === "dca" && "Dollar-Cost Averaging"}
              </h3>
              <p className="text-zinc-500">Interactive content coming soon...</p>
            </div>
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
                      {storeProducts.hardware.map((product, index) => (
                        <div key={index} className="border border-zinc-700 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-white">{product.name}</h4>
                            <div className="text-right">
                              <span className="text-orange-400 font-bold">{product.price}</span>
                              <span className="text-zinc-500 text-sm line-through ml-2">{product.originalPrice}</span>
                            </div>
                          </div>
                          <p className="text-zinc-400 text-sm mb-3">{product.description}</p>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-zinc-600'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-zinc-500 text-xs">({product.reviews} reviews)</span>
                          </div>
                          <Button 
                            size="sm" 
                            className="w-full bg-orange-600 hover:bg-orange-700"
                            onClick={() => window.open(product.affiliate_url, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3 mr-2" />
                            Buy Now
                          </Button>
                        </div>
                      ))}
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
                      {storeProducts.books.map((book, index) => (
                        <div key={index} className="border border-zinc-700 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-white">{book.title}</h4>
                            <div className="text-right">
                              <span className="text-orange-400 font-bold">{book.price}</span>
                              <span className="text-zinc-500 text-sm line-through ml-2">{book.originalPrice}</span>
                            </div>
                          </div>
                          <p className="text-zinc-400 text-sm mb-1">by {book.author}</p>
                          <p className="text-zinc-400 text-sm mb-3">{book.description}</p>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3 h-3 ${i < Math.floor(book.rating) ? 'text-yellow-400 fill-current' : 'text-zinc-600'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-zinc-500 text-xs">({book.reviews} reviews)</span>
                          </div>
                          <Button 
                            size="sm" 
                            className="w-full bg-orange-600 hover:bg-orange-700"
                            onClick={() => window.open(book.affiliate_url, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3 mr-2" />
                            Buy Now
                          </Button>
                        </div>
                      ))}
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
                        <Info className="w-6 h-6 text-green-400" />
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