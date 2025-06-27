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
  Calculator,
  RefreshCw,
  Lock,
  Wallet,
  Info,
  Star,
  Brain,
  X
} from "lucide-react";
import type { User, DailyFact, Lesson, UserProgress, ConvictionContent } from "@shared/schema";
import DailyQuiz from "@/components/DailyQuiz";
import { BitcoinTerm, AutoGlossary } from "@/components/BitcoinGlossary";
import { ProgressIndicator, AchievementBadge, LearningAnalytics } from "@/components/ProgressIndicator";
import AchievementSystem from "@/components/AchievementSystem";

type MainSection = "learn" | "simulations" | "more";
type LearnSubTab = "today" | "reference" | "appendix";
type SimulationsSubTab = "safety" | "transactions" | "hodl" | "dca";
type MoreSubTab = "store";

function Home() {
  const [activeSection, setActiveSection] = useState<MainSection>("learn");
  const [learnSubTab, setLearnSubTab] = useState<LearnSubTab>("today");
  const [simulationsSubTab, setSimulationsSubTab] = useState<SimulationsSubTab>("safety");
  const [moreSubTab, setMoreSubTab] = useState<MoreSubTab>("store");

  const [showSplash, setShowSplash] = useState(true);
  const [expandedFacts, setExpandedFacts] = useState<Set<number>>(new Set());
  const [selectedAppendixLesson, setSelectedAppendixLesson] = useState<any>(null);

  // Original simulator state management
  const [simulatorInputs, setSimulatorInputs] = useState({
    dca: {
      monthlyAmount: 100,
      duration: 24,
      startPrice: 30000
    },
    investment: 1000,
    years: 4,
    tradingFeePercent: 2
  });

  const [hodlResults, setHodlResults] = useState<any>(null);

  // Calculate DCA with realistic data
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

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Helper function to expand lesson content  
  const getExpandedLessonContent = (title: string, content: string) => {
    const sections = content.split('\n\n').filter(section => section.trim());
    
    return sections.map(section => {
      const lines = section.split('\n');
      const sectionTitle = lines[0];
      const paragraphs = lines.slice(1).join('\n').split('\n').filter(p => p.trim());
      
      return {
        title: sectionTitle,
        paragraphs: paragraphs
      };
    });
  };

  if (showSplash) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">₿</div>
          <div className="text-xl font-medium text-white">Loading your Conviction</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-orange-500 text-2xl font-bold">₿</div>
              <div className="text-white font-semibold">BTC Journey</div>
            </div>
            
            <div className="text-xs text-zinc-400 text-center">
              <div>Educational content only</div>
              <div>Not financial advice</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <div className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="px-4 py-3">
          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center gap-1 bg-zinc-800/50 rounded-lg p-1">
              <Button
                variant={activeSection === "learn" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveSection("learn")}
                className="text-xs px-3 py-1 h-8"
              >
                <BookOpen className="w-3 h-3 mr-1" />
                Learn
              </Button>
              <Button
                variant={activeSection === "simulations" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveSection("simulations")}
                className="text-xs px-3 py-1 h-8"
              >
                <Calculator className="w-3 h-3 mr-1" />
                Simulations
              </Button>
              <Button
                variant={activeSection === "more" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveSection("more")}
                className="text-xs px-3 py-1 h-8"
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                More
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="px-4 py-6 max-w-4xl mx-auto">
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
                  <Calendar className="w-3 h-3 mr-1" />
                  Today
                </Button>
                <Button
                  variant={learnSubTab === "reference" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setLearnSubTab("reference")}
                  className="text-xs px-3 py-1"
                >
                  <BookOpen className="w-3 h-3 mr-1" />
                  Glossary
                </Button>
                <Button
                  variant={learnSubTab === "appendix" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setLearnSubTab("appendix")}
                  className="text-xs px-3 py-1"
                >
                  <FileText className="w-3 h-3 mr-1" />
                  Appendix
                </Button>
              </div>
            </div>

            {/* Today Section */}
            {learnSubTab === "today" && (
              <div className="space-y-6">
                {/* Progress Rings */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <h2 className="text-lg font-semibold text-white">Today's Progress</h2>
                      <div className="flex justify-center items-center space-x-8">
                        <div className="flex flex-col items-center">
                          <div className="relative w-16 h-16">
                            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#374151"
                                strokeWidth="2"
                              />
                              <path
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#f97316"
                                strokeWidth="2"
                                strokeDasharray="75, 100"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-semibold text-white">75%</span>
                            </div>
                          </div>
                          <span className="text-xs text-zinc-400 mt-1">Facts</span>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <div className="relative w-20 h-20">
                            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#374151"
                                strokeWidth="3"
                              />
                              <path
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#eab308"
                                strokeWidth="3"
                                strokeDasharray="50, 100"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-sm font-bold text-white">50%</div>
                                <div className="text-xs text-zinc-400">Lesson</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <div className="relative w-16 h-16">
                            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#374151"
                                strokeWidth="2"
                              />
                              <path
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#22c55e"
                                strokeWidth="2"
                                strokeDasharray="0, 100"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-semibold text-white">0%</span>
                            </div>
                          </div>
                          <span className="text-xs text-zinc-400 mt-1">Quiz</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-center items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-zinc-400">Streak: <span className="text-white font-medium">{user?.currentStreak || 0} days</span></span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Daily Facts */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Essential Facts</h3>
                    <div className="space-y-4">
                      {dailyFacts.map((fact, index) => (
                        <div key={fact.id} className="border border-zinc-700 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-white">{fact.title}</h4>
                            <Badge variant="outline" className="border-zinc-600 text-zinc-300 text-xs">
                              {fact.category}
                            </Badge>
                          </div>
                          <p className="text-zinc-300 text-sm mb-3">{fact.content}</p>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newExpanded = new Set(expandedFacts);
                              if (newExpanded.has(index)) {
                                newExpanded.delete(index);
                              } else {
                                newExpanded.add(index);
                              }
                              setExpandedFacts(newExpanded);
                            }}
                            className="text-orange-400 hover:text-orange-300 text-xs p-0 h-auto"
                          >
                            {expandedFacts.has(index) ? (
                              <>
                                <ChevronUp className="w-3 h-3 mr-1" />
                                Show Less
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3 h-3 mr-1" />
                                Dive Deeper
                              </>
                            )}
                          </Button>

                          {expandedFacts.has(index) && (
                            <div className="mt-4 pt-4 border-t border-zinc-700 space-y-3">
                              <div>
                                <h5 className="font-medium text-white text-sm mb-2">Detailed Explanation</h5>
                                <p className="text-zinc-300 text-sm">
                                  This fact represents a fundamental principle in understanding money and Bitcoin. 
                                  The concept builds upon centuries of monetary theory and practice.
                                </p>
                              </div>
                              
                              <div>
                                <h5 className="font-medium text-white text-sm mb-2">Real-World Example</h5>
                                <p className="text-zinc-300 text-sm">
                                  Consider how central banks create money through monetary policy. 
                                  This differs significantly from Bitcoin's predetermined supply schedule.
                                </p>
                              </div>
                              
                              <div>
                                <h5 className="font-medium text-white text-sm mb-2">Key Takeaway</h5>
                                <p className="text-zinc-300 text-sm font-medium">
                                  Understanding these fundamentals helps you make informed decisions about your financial future.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Lesson Section */}
                {lesson && (
                  <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="text-center space-y-2">
                          <h3 className="text-xl font-bold text-white">{lesson.title}</h3>
                          <p className="text-zinc-400">{lesson.summary}</p>
                          <div className="flex justify-center items-center space-x-4 text-sm">
                            <Badge variant="outline" className="border-zinc-600 text-zinc-300">
                              <Clock className="w-3 h-3 mr-1" />
                              {lesson.estimatedReadTime} min read
                            </Badge>
                          </div>
                        </div>

                        <div className="prose prose-invert max-w-none">
                          <div className="space-y-6">
                            {getExpandedLessonContent(lesson.title, lesson.content).map((section, idx) => (
                              <div key={idx} className="space-y-4">
                                <h4 className="text-lg font-semibold text-white border-l-4 border-orange-500 pl-4">
                                  {section.title}
                                </h4>
                                <div className="text-zinc-300 leading-relaxed space-y-4">
                                  {section.paragraphs.map((paragraph, pIdx) => (
                                    <p key={pIdx}>{paragraph}</p>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Daily Quiz */}
                <DailyQuiz />
              </div>
            )}

            {/* Reference Section */}
            {learnSubTab === "reference" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Bitcoin Glossary</h2>
                  <p className="text-zinc-400">Essential terms and concepts for understanding Bitcoin</p>
                </div>

                <div className="grid gap-6">
                  <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Core Concepts</h3>
                      <div className="grid gap-4">
                        <div className="border border-zinc-700 rounded-lg p-4">
                          <h4 className="font-semibold text-orange-400 mb-2">Bitcoin (BTC)</h4>
                          <p className="text-zinc-300 text-sm">Decentralized digital currency that operates without a central authority, using cryptographic proof instead of trust.</p>
                        </div>
                        <div className="border border-zinc-700 rounded-lg p-4">
                          <h4 className="font-semibold text-orange-400 mb-2">Blockchain</h4>
                          <p className="text-zinc-300 text-sm">A distributed ledger technology that maintains a continuously growing list of records, called blocks, linked and secured using cryptography.</p>
                        </div>
                        <div className="border border-zinc-700 rounded-lg p-4">
                          <h4 className="font-semibold text-orange-400 mb-2">Satoshi</h4>
                          <p className="text-zinc-300 text-sm">The smallest unit of Bitcoin, named after Bitcoin's creator. One Bitcoin equals 100,000,000 satoshis.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Appendix Section */}
            {learnSubTab === "appendix" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Learning Appendix</h2>
                  <p className="text-zinc-400">Review completed daily lessons and topics</p>
                </div>

                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Completed Daily Lessons</h3>
                    <div className="grid gap-3">
                      {lesson && (
                        <div 
                          className="border border-zinc-700 rounded-lg p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors"
                          onClick={() => setSelectedAppendixLesson(lesson)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-white mb-1">{lesson.title}</h4>
                              <p className="text-zinc-400 text-sm">{lesson.summary}</p>
                            </div>
                            <Badge variant="outline" className="border-green-600 text-green-400 ml-4">
                              ✓ Completed
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Lesson Modal */}
                {selectedAppendixLesson && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="bg-zinc-900 border-zinc-800 max-w-4xl max-h-[80vh] overflow-y-auto w-full">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-white">{selectedAppendixLesson.title}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedAppendixLesson(null)}
                            className="text-zinc-400 hover:text-white"
                          >
                            <X className="w-5 h-5" />
                          </Button>
                        </div>
                        
                        <div className="prose prose-invert max-w-none">
                          <div className="space-y-6">
                            {getExpandedLessonContent(selectedAppendixLesson.title, selectedAppendixLesson.content).map((section, idx) => (
                              <div key={idx} className="space-y-4">
                                <h4 className="text-lg font-semibold text-white border-l-4 border-orange-500 pl-4">
                                  {section.title}
                                </h4>
                                <div className="text-zinc-300 leading-relaxed space-y-4">
                                  {section.paragraphs.map((paragraph, pIdx) => (
                                    <p key={pIdx}>{paragraph}</p>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Simulations Section */}
        {activeSection === "simulations" && (
          <div className="space-y-6">
            {/* Simulations Sub-navigation */}
            <div className="flex justify-center">
              <div className="flex flex-wrap justify-center gap-2 bg-zinc-800/50 rounded-lg p-2">
                <Button
                  variant={simulationsSubTab === "safety" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSimulationsSubTab("safety")}
                  className="text-xs px-3 py-1"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Safety
                </Button>
                <Button
                  variant={simulationsSubTab === "transactions" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSimulationsSubTab("transactions")}
                  className="text-xs px-3 py-1"
                >
                  <CreditCard className="w-3 h-3 mr-1" />
                  Transactions
                </Button>
                <Button
                  variant={simulationsSubTab === "hodl" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSimulationsSubTab("hodl")}
                  className="text-xs px-3 py-1"
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  HODL vs Trading
                </Button>
                <Button
                  variant={simulationsSubTab === "dca" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSimulationsSubTab("dca")}
                  className="text-xs px-3 py-1"
                >
                  <Calculator className="w-3 h-3 mr-1" />
                  DCA
                </Button>
              </div>
            </div>

            {/* Safety Section */}
            {simulationsSubTab === "safety" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">Bitcoin Wallet Safety</h3>
                  <p className="text-zinc-400">Learn essential security practices to protect your Bitcoin</p>
                </div>

                {/* Safety Rules */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-orange-500" />
                      Golden Rules of Bitcoin Security
                    </h4>
                    <div className="space-y-4">
                      {[
                        "Never share your private keys or seed phrases with anyone",
                        "Always verify receiving addresses before sending Bitcoin",
                        "Use hardware wallets for significant amounts",
                        "Keep multiple secure backups of your seed phrase",
                        "Never store large amounts on exchanges long-term",
                        "Double-check all transaction details before confirming",
                        "Be wary of phishing attempts and fake websites"
                      ].map((rule, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-zinc-300">{rule}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Interactive Wallet Explorer */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Wallet className="w-5 h-5 mr-2 text-orange-500" />
                      Interactive Wallet Explorer
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          type: "Hardware Wallet",
                          icon: <Lock className="w-6 h-6" />,
                          pros: ["Highest security", "Private keys never online", "Resistant to malware"],
                          cons: ["Higher cost", "Can be lost/damaged", "Learning curve"],
                          examples: ["Ledger Nano X", "Trezor Model T", "Coldcard"]
                        },
                        {
                          type: "Mobile Wallet",
                          icon: <CreditCard className="w-6 h-6" />,
                          pros: ["Convenient for daily use", "Easy to use", "Quick transactions"],
                          cons: ["Connected to internet", "Phone security risks", "Limited amounts"],
                          examples: ["Blue Wallet", "Phoenix", "Muun"]
                        },
                        {
                          type: "Desktop Wallet",
                          icon: <Building2 className="w-6 h-6" />,
                          pros: ["Full control", "Advanced features", "Better for larger amounts"],
                          cons: ["Computer security risks", "Less convenient", "Backup complexity"],
                          examples: ["Electrum", "Bitcoin Core", "Sparrow"]
                        },
                        {
                          type: "Exchange Wallet",
                          icon: <Globe className="w-6 h-6" />,
                          pros: ["Easy to start", "Built-in trading", "User-friendly"],
                          cons: ["Not your keys", "Centralized risk", "Regulatory risk"],
                          examples: ["Coinbase", "Kraken", "Binance"]
                        }
                      ].map((wallet, idx) => (
                        <div key={idx} className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                          <div className="flex items-center space-x-2">
                            <div className="text-orange-500">{wallet.icon}</div>
                            <h5 className="font-semibold text-white">{wallet.type}</h5>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-green-400 font-medium">Pros:</span>
                              <ul className="text-zinc-300 ml-4 list-disc">
                                {wallet.pros.map((pro, pIdx) => (
                                  <li key={pIdx}>{pro}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <span className="text-red-400 font-medium">Cons:</span>
                              <ul className="text-zinc-300 ml-4 list-disc">
                                {wallet.cons.map((con, cIdx) => (
                                  <li key={cIdx}>{con}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <span className="text-blue-400 font-medium">Examples:</span>
                              <div className="text-zinc-300 ml-2">
                                {wallet.examples.join(", ")}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Transaction Builder */}
            {simulationsSubTab === "transactions" && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-600/20 rounded-lg">
                        <ArrowRight className="w-8 h-8 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">Bitcoin Transaction Builder</h3>
                        <p className="text-zinc-300 mb-4">Create and broadcast a Bitcoin transaction step by step</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-white font-semibold">Transaction Details</h4>
                        
                        <div>
                          <label className="text-zinc-300 text-sm block mb-2">From Address</label>
                          <div className="bg-zinc-800 rounded px-3 py-2 text-white font-mono text-sm">
                            bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-zinc-300 text-sm block mb-2">To Address</label>
                          <input
                            type="text"
                            placeholder="Enter Bitcoin address..."
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="text-zinc-300 text-sm block mb-2">Amount (BTC)</label>
                          <input
                            type="number"
                            step="0.00000001"
                            placeholder="0.00100000"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="text-zinc-300 text-sm block mb-2">Fee Priority</label>
                          <select className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white">
                            <option>Low (1-2 hours) - 5 sat/vB</option>
                            <option>Medium (30 min) - 20 sat/vB</option>
                            <option>High (10 min) - 50 sat/vB</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-white font-semibold">Transaction Summary</h4>
                        <div className="bg-zinc-800 rounded-lg p-4 space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Amount:</span>
                            <span className="text-white">0.00100000 BTC</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Network Fee:</span>
                            <span className="text-white">0.00002000 BTC</span>
                          </div>
                          <div className="border-t border-zinc-700 pt-2 flex justify-between font-medium">
                            <span className="text-zinc-400">Total:</span>
                            <span className="text-white">0.00102000 BTC</span>
                          </div>
                        </div>
                        
                        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-lg py-2 font-medium transition-colors">
                          Sign & Broadcast Transaction
                        </button>
                        
                        <div className="text-xs text-zinc-400 space-y-1">
                          <p>• This is a simulation for educational purposes</p>
                          <p>• Real transactions require actual Bitcoin and wallet software</p>
                          <p>• Always verify addresses before sending</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* HODL vs Trading */}
            {simulationsSubTab === "hodl" && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-purple-600/20 rounded-lg">
                        <TrendingUp className="w-8 h-8 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">HODLing vs Trading Strategy</h3>
                        <p className="text-zinc-300 mb-4">Compare the long-term HODLing strategy with active trading to see the power of patience</p>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Initial Investment ($)</label>
                            <input
                              type="number"
                              value={simulatorInputs.investment}
                              onChange={(e) => setSimulatorInputs(prev => ({...prev, investment: parseFloat(e.target.value) || 0}))}
                              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:ring-orange-500 focus:border-orange-500"
                              placeholder="10000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Holding Period (years)</label>
                            <input
                              type="number"
                              value={simulatorInputs.years}
                              onChange={(e) => setSimulatorInputs(prev => ({...prev, years: parseInt(e.target.value) || 1}))}
                              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:ring-orange-500 focus:border-orange-500"
                              placeholder="4"
                            />
                          </div>
                        </div>

                        <div className="text-center">
                          <button
                            onClick={() => {
                              const results = calculateHODL(
                                simulatorInputs.investment,
                                simulatorInputs.years,
                                simulatorInputs.tradingFeePercent
                              );
                              setHodlResults(results);
                            }}
                            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                          >
                            Calculate HODL Strategy
                          </button>
                        </div>

                        {hodlResults && (
                          <div className="bg-zinc-800 rounded-lg p-6 space-y-4">
                            <h4 className="text-lg font-semibold text-white">Results</h4>
                            <div className="grid md:grid-cols-3 gap-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-400">
                                  ${hodlResults.finalValue}
                                </div>
                                <div className="text-sm text-zinc-400">HODL Final Value</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-400">
                                  +{hodlResults.returnPercentage}%
                                </div>
                                <div className="text-sm text-zinc-400">Total Return</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-orange-400">
                                  ${hodlResults.savingsComparison.btcAdvantage}
                                </div>
                                <div className="text-sm text-zinc-400">vs Traditional Savings</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* DCA Calculator */}
            {simulationsSubTab === "dca" && (
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
                                <div className="text-zinc-400 text-sm">Average Price</div>
                                <div className="text-white font-mono">${results.averagePrice}</div>
                              </div>
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">Current Value</div>
                                <div className="text-green-400 font-mono">${results.finalValue}</div>
                              </div>
                              <div className="bg-zinc-800 rounded-lg p-3">
                                <div className="text-zinc-400 text-sm">Total Return</div>
                                <div className="text-green-400 font-mono">+{results.returnPercentage}%</div>
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
          </div>
        )}

        {/* More Section */}
        {activeSection === "more" && (
          <div className="space-y-6">
            {/* More Sub-navigation */}
            <div className="flex justify-center">
              <div className="flex flex-wrap justify-center gap-2 bg-zinc-800/50 rounded-lg p-2">
                <Button
                  variant={moreSubTab === "store" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setMoreSubTab("store")}
                  className="text-xs px-3 py-1"
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Store
                </Button>
              </div>
            </div>

            {/* Store Section */}
            {moreSubTab === "store" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">Bitcoin Learning Store</h3>
                  <p className="text-zinc-400">Essential tools and books for your Bitcoin journey</p>
                </div>

                {/* Affiliate Disclosure */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-zinc-300">
                        <p className="font-medium text-white mb-1">Affiliate Disclosure</p>
                        <p>This page contains affiliate links. When you purchase through these links, you support our educational mission at no extra cost to you. We only recommend products we genuinely believe will help your Bitcoin journey.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Hardware Wallets */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Lock className="w-5 h-5 mr-2 text-orange-500" />
                      Hardware Wallets
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-white">Ledger Nano X</h5>
                          <Badge variant="secondary">$149</Badge>
                        </div>
                        <p className="text-sm text-zinc-300">
                          The most popular hardware wallet with Bluetooth connectivity and support for over 5,500 cryptocurrencies.
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-zinc-300">Bluetooth enabled</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-zinc-300">Mobile app support</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-zinc-300">Secure chip technology</span>
                          </div>
                        </div>
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Shop Ledger Nano X
                        </Button>
                      </div>

                      <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-white">Trezor Model T</h5>
                          <Badge variant="secondary">$219</Badge>
                        </div>
                        <p className="text-sm text-zinc-300">
                          Advanced hardware wallet with touchscreen interface and comprehensive security features.
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-zinc-300">Color touchscreen</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-zinc-300">Open-source firmware</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-zinc-300">Advanced recovery features</span>
                          </div>
                        </div>
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Shop Trezor Model T
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Essential Books */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-orange-500" />
                      Essential Bitcoin Books
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-white">Broken Money</h5>
                          <Badge variant="secondary">$25</Badge>
                        </div>
                        <p className="text-xs text-zinc-400">by Lyn Alden</p>
                        <p className="text-sm text-zinc-300">
                          A comprehensive analysis of monetary systems and why they fail, leading to Bitcoin as a solution.
                        </p>
                        <div className="flex items-center space-x-2 text-sm">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-zinc-300">Beginner Friendly</span>
                        </div>
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Buy on Amazon
                        </Button>
                      </div>

                      <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-white">The Bitcoin Standard</h5>
                          <Badge variant="secondary">$20</Badge>
                        </div>
                        <p className="text-xs text-zinc-400">by Saifedean Ammous</p>
                        <p className="text-sm text-zinc-300">
                          The definitive guide to Bitcoin's economic properties and monetary theory.
                        </p>
                        <div className="flex items-center space-x-2 text-sm">
                          <Brain className="w-4 h-4 text-blue-500" />
                          <span className="text-zinc-300">Intermediate</span>
                        </div>
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Buy on Amazon
                        </Button>
                      </div>

                      <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-white">The Fiat Standard</h5>
                          <Badge variant="secondary">$22</Badge>
                        </div>
                        <p className="text-xs text-zinc-400">by Saifedean Ammous</p>
                        <p className="text-sm text-zinc-300">
                          A critical examination of government money and its effects on society.
                        </p>
                        <div className="flex items-center space-x-2 text-sm">
                          <Brain className="w-4 h-4 text-blue-500" />
                          <span className="text-zinc-300">Advanced</span>
                        </div>
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Buy on Amazon
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;