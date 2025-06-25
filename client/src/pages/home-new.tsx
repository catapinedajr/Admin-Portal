import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  Flame,
  GraduationCap,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  Share,
  HelpCircle,
  ArrowRight,
  DollarSign,
  Building2,
  AlertTriangle,
  Heart,
  Play,
  Quote,
  ExternalLink,
  Globe,
  LineChart,
  X,
  Home as HomeIcon,
  Users,
  FileText
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatDate, getDayOfWeek, getWeekDates } from "@/lib/utils";
import type { User, DailyFact, Lesson, UserProgress, KnowledgeArea, ConvictionContent, TreasuryCompany, SovereignAdoption } from "@shared/schema";
import DailyQuiz from "@/components/DailyQuiz";

interface NetworkMetric {
  metric: string;
  value: string;
  change24h: string;
  description: string;
  icon: string;
}

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

type MainSection = "learning" | "profiles" | "conviction" | "terms";
type LearningSubTab = "basics" | "lesson" | "progress" | "quiz";
type ProfilesSubTab = "individuals" | "businesses" | "nations";

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
    term: "Public Key",
    definition: "A cryptographic key derived from your private key that others can use to send you Bitcoin."
  },
  {
    term: "Hash Rate",
    definition: "The total computational power securing the Bitcoin network, measured in hashes per second."
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
  },
  {
    term: "Node",
    definition: "A computer that validates transactions and maintains a copy of the entire Bitcoin blockchain."
  },
  {
    term: "Fork",
    definition: "A change to Bitcoin's protocol rules, which can be soft (backward compatible) or hard (not compatible)."
  }
];

const userProfiles = {
  individuals: [
    {
      name: "Sarah Chen",
      title: "Software Engineer",
      story: "Started buying Bitcoin in 2017 to protect savings from inflation. Now uses it for international remittances to family.",
      reason: "Hedge against currency debasement and easier cross-border payments"
    },
    {
      name: "Miguel Rodriguez", 
      title: "Small Business Owner",
      story: "Accepts Bitcoin payments at his restaurant to avoid high credit card fees and attract tech-savvy customers.",
      reason: "Lower transaction fees and financial sovereignty"
    },
    {
      name: "Dr. Amara Okafor",
      title: "Medical Professional",
      story: "Uses Bitcoin to send money to medical charities in countries with unstable banking systems.",
      reason: "Reliable value transfer to underbanked regions"
    }
  ],
  businesses: [
    {
      name: "MicroStrategy",
      industry: "Business Intelligence",
      story: "CEO Michael Saylor led the company to adopt Bitcoin as treasury reserve, buying over 190,000 BTC since 2020.",
      reason: "Corporate treasury strategy and inflation hedge"
    },
    {
      name: "Tesla",
      industry: "Electric Vehicles", 
      story: "Added Bitcoin to balance sheet and briefly accepted it for car purchases before focusing on environmental concerns.",
      reason: "Diversification and innovation in payments"
    },
    {
      name: "Strike",
      industry: "Financial Services",
      story: "Built Lightning Network infrastructure to enable instant, low-cost Bitcoin payments globally.",
      reason: "Revolutionary payment rails and financial inclusion"
    }
  ],
  nations: [
    {
      name: "El Salvador",
      leader: "President Nayib Bukele",
      story: "First country to adopt Bitcoin as legal tender in 2021, aiming to increase financial inclusion and attract investment.",
      reason: "Financial inclusion and economic sovereignty"
    },
    {
      name: "Switzerland",
      approach: "Crypto Valley",
      story: "Created favorable regulations in Zug, becoming a global hub for blockchain companies and Bitcoin adoption.",
      reason: "Innovation leadership and economic development"
    },
    {
      name: "Miami",
      leader: "Mayor Francis Suarez",
      story: "Exploring Bitcoin for city treasury and employee salaries, positioning Miami as a Bitcoin-friendly city.",
      reason: "Economic innovation and talent attraction"
    }
  ]
};

export default function Home() {
  const [activeSection, setActiveSection] = useState<MainSection>("learning");
  const [learningSubTab, setLearningSubTab] = useState<LearningSubTab>("basics");
  const [profilesSubTab, setProfilesSubTab] = useState<ProfilesSubTab>("individuals");
  const [currentLessonPage, setCurrentLessonPage] = useState(0);
  const [showPriceChart, setShowPriceChart] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Splash screen effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Get current date for day-based content
  const currentDate = new Date();
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % 365;

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

  const { data: progressToday } = useQuery({
    queryKey: ['/api/progress/today'],
    queryFn: () => fetch('/api/progress/today').then(res => res.json()) as Promise<UserProgress>
  });

  const { data: knowledgeAreas = [] } = useQuery({
    queryKey: ['/api/knowledge-areas'],
    queryFn: () => fetch('/api/knowledge-areas').then(res => res.json()) as Promise<KnowledgeArea[]>
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
              variant={activeSection === "profiles" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveSection("profiles")}
              className={activeSection === "profiles" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"}
            >
              <Users className="w-4 h-4 mr-2" />
              User Profiles
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

      {activeSection === "profiles" && (
        <div className="bg-zinc-800/30 border-b border-zinc-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-1 py-2">
              <Button
                variant={profilesSubTab === "individuals" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setProfilesSubTab("individuals")}
                className="text-sm"
              >
                <UserIcon className="w-3 h-3 mr-2" />
                Individuals
              </Button>
              <Button
                variant={profilesSubTab === "businesses" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setProfilesSubTab("businesses")}
                className="text-sm"
              >
                <Building2 className="w-3 h-3 mr-2" />
                Businesses
              </Button>
              <Button
                variant={profilesSubTab === "nations" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setProfilesSubTab("nations")}
                className="text-sm"
              >
                <Globe className="w-3 h-3 mr-2" />
                Nations
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

        {/* User Profiles Section */}
        {activeSection === "profiles" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Why People Use Bitcoin</h2>
              <p className="text-zinc-400">Real stories from individuals, businesses, and nations</p>
            </div>
            
            <div className="grid gap-6">
              {userProfiles[profilesSubTab].map((profile, index) => (
                <Card key={index} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{profile.name}</h3>
                          <p className="text-orange-400 text-sm">
                            {profile.title || profile.industry || profile.leader || profile.approach}
                          </p>
                        </div>
                        <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                          {profilesSubTab === "individuals" ? "Individual" : 
                           profilesSubTab === "businesses" ? "Business" : "Nation"}
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