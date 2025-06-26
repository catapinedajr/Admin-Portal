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

type MainSection = "foundation" | "practice" | "inspiration";
type FoundationSubTab = "today" | "explore" | "disruption" | "terms";
type PracticeSubTab = "dca" | "hodl" | "transactions" | "safety" | "mining" | "halving";
type InspirationSubTab = "stories" | "conviction" | "store";
type DisruptionSubTab = "problems" | "solutions" | "comparison" | "future";
type StoriesSubTab = "individuals" | "businesses" | "nations";
type ConvictionSubTab = "whitepaper" | "videos";

export default function Home() {
  const [activeSection, setActiveSection] = useState<MainSection>("foundation");
  const [foundationSubTab, setFoundationSubTab] = useState<FoundationSubTab>("today");
  const [practiceSubTab, setPracticeSubTab] = useState<PracticeSubTab>("dca");
  const [inspirationSubTab, setInspirationSubTab] = useState<InspirationSubTab>("stories");
  const [disruptionSubTab, setDisruptionSubTab] = useState<DisruptionSubTab>("problems");
  const [storiesSubTab, setStoriesSubTab] = useState<StoriesSubTab>("individuals");
  const [convictionSubTab, setConvictionSubTab] = useState<ConvictionSubTab>("whitepaper");
  const [showSplash, setShowSplash] = useState(true);

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
      <div className="border-b border-zinc-800 bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-600 rounded-lg">
                <Bitcoin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">BTC Journey</h1>
                <p className="text-xs text-zinc-400">Bitcoin Education & Insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-zinc-800 bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center">
            <div className="flex space-x-1 p-2">
              <Button
                variant={activeSection === "foundation" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveSection("foundation")}
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
                variant={activeSection === "inspiration" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveSection("inspiration")}
                className="text-sm px-4 py-2"
              >
                More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Inspiration Section */}
        {activeSection === "inspiration" && (
          <div className="space-y-6">
            {/* Sub Navigation */}
            <div className="flex justify-center space-x-2 flex-wrap gap-2">
              <Button
                variant={inspirationSubTab === "stories" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setInspirationSubTab("stories")}
                className="text-sm"
              >
                <Users className="w-3 h-3 mr-2" />
                Stories
              </Button>
              <Button
                variant={inspirationSubTab === "conviction" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setInspirationSubTab("conviction")}
                className="text-sm"
              >
                <Heart className="w-3 h-3 mr-2" />
                Conviction
              </Button>
              <Button
                variant={inspirationSubTab === "store" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setInspirationSubTab("store")}
                className="text-sm"
              >
                <Shield className="w-3 h-3 mr-2" />
                Store
              </Button>
            </div>

            {/* Store Section */}
            {inspirationSubTab === "store" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">BTC Journey Store</h2>
                  <p className="text-zinc-400">Essential Bitcoin books and hardware for your journey</p>
                  <div className="bg-orange-600/10 border border-orange-600/20 rounded-lg p-4 mt-4">
                    <p className="text-orange-200 text-sm">
                      <span className="font-medium">Affiliate Disclosure:</span> We earn commissions from qualifying purchases. This helps fund our educational content at no extra cost to you.
                    </p>
                  </div>
                </div>

                {/* Hardware Wallets */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Hardware Wallets - Secure Your Bitcoin
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        {
                          name: "Ledger Nano X",
                          price: "$149.00",
                          description: "Bluetooth-enabled hardware wallet with mobile app support. Store 100+ cryptocurrencies securely.",
                          features: ["Bluetooth connectivity", "Mobile app support", "100+ crypto support", "Secure chip technology"],
                          affiliate: "https://shop.ledger.com/products/ledger-nano-x"
                        },
                        {
                          name: "Trezor Model T",
                          price: "$219.00", 
                          description: "Premium hardware wallet with touchscreen interface and advanced security features.",
                          features: ["Touchscreen display", "Password manager", "U2F authentication", "Open source"],
                          affiliate: "https://trezor.io/trezor-model-t"
                        },
                        {
                          name: "Coldcard Mk4",
                          price: "$149.00",
                          description: "Bitcoin-only hardware wallet focused on maximum security and air-gapped operation.",
                          features: ["Bitcoin-only design", "Air-gapped operation", "Secure element", "Open source"],
                          affiliate: "https://coldcard.com/"
                        },
                        {
                          name: "BitBox02",
                          price: "$109.00",
                          description: "Swiss-made hardware wallet with dual-chip architecture and backup on microSD.",
                          features: ["Dual-chip security", "MicroSD backup", "Swiss engineering", "Compact design"],
                          affiliate: "https://shiftcrypto.shop/"
                        }
                      ].map((wallet, index) => (
                        <Card key={index} className="bg-zinc-800 border-zinc-700 hover:border-orange-600/50 transition-colors">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <h4 className="font-semibold text-white">{wallet.name}</h4>
                                <span className="text-orange-400 font-bold">{wallet.price}</span>
                              </div>
                              <p className="text-zinc-300 text-sm">{wallet.description}</p>
                              <ul className="space-y-1">
                                {wallet.features.map((feature, i) => (
                                  <li key={i} className="text-zinc-400 text-xs flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                              <Button 
                                size="sm" 
                                className="w-full bg-orange-600 hover:bg-orange-700"
                                asChild
                              >
                                <a href={wallet.affiliate} target="_blank" rel="noopener noreferrer">
                                  Shop Now
                                </a>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Essential Books */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Essential Bitcoin Books
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        {
                          title: "Broken Money",
                          author: "Lyn Alden",
                          price: "$24.99",
                          description: "How our financial system is failing us and how we can make it better. A comprehensive analysis of monetary systems and Bitcoin's role in fixing them.",
                          difficulty: "Intermediate",
                          affiliate: "https://www.amazon.com/dp/1736202804"
                        },
                        {
                          title: "The Big Print",
                          author: "Lyn Alden",
                          price: "$15.99",
                          description: "A detailed exploration of how money printing affects the economy and why Bitcoin offers a superior alternative.",
                          difficulty: "Intermediate",
                          affiliate: "https://www.amazon.com/dp/B0CQRK9QT8"
                        },
                        {
                          title: "The Bitcoin Standard",
                          author: "Saifedean Ammous",
                          price: "$16.99",
                          description: "The decentralized alternative to central banking. Explores Bitcoin as a store of value and its potential to become the new global reserve currency.",
                          difficulty: "Intermediate",
                          affiliate: "https://www.amazon.com/dp/1119473861"
                        },
                        {
                          title: "The Fiat Standard",
                          author: "Saifedean Ammous", 
                          price: "$18.99",
                          description: "The debt slavery alternative to human civilization. A critique of the current fiat monetary system.",
                          difficulty: "Advanced",
                          affiliate: "https://www.amazon.com/dp/1544526474"
                        },
                        {
                          title: "Layered Money",
                          author: "Nik Bhatia",
                          price: "$19.99",
                          description: "From gold and dollars to Bitcoin and central bank digital currencies. Explores the evolution of money through different layers.",
                          difficulty: "Intermediate",
                          affiliate: "https://www.amazon.com/dp/154450145X"
                        },
                        {
                          title: "The Price of Tomorrow",
                          author: "Jeff Booth",
                          price: "$17.99",
                          description: "Why deflation is the key to an abundant future. Examines how technology creates deflationary pressure.",
                          difficulty: "Beginner",
                          affiliate: "https://www.amazon.com/dp/1999257405"
                        },
                        {
                          title: "Thank God for Bitcoin",
                          author: "Jimmy Song",
                          price: "$44.99",
                          description: "The creation, corruption and redemption of money. A philosophical and theological perspective on Bitcoin.",
                          difficulty: "Intermediate",
                          affiliate: "https://www.amazon.com/dp/1641991216"
                        }
                      ].map((book, index) => (
                        <Card key={index} className="bg-zinc-800 border-zinc-700 hover:border-orange-600/50 transition-colors">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div>
                                <h4 className="font-semibold text-white text-sm">{book.title}</h4>
                                <p className="text-zinc-400 text-xs">by {book.author}</p>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs mt-1 ${
                                    book.difficulty === "Beginner" 
                                      ? "border-green-600 text-green-400" 
                                      : book.difficulty === "Intermediate"
                                      ? "border-yellow-600 text-yellow-400"
                                      : "border-red-600 text-red-400"
                                  }`}
                                >
                                  {book.difficulty}
                                </Badge>
                              </div>
                              <p className="text-zinc-300 text-xs">{book.description}</p>
                              <div className="flex justify-between items-center">
                                <span className="text-orange-400 font-bold text-sm">{book.price}</span>
                                <Button 
                                  size="sm" 
                                  className="bg-orange-600 hover:bg-orange-700 text-xs px-3 py-1"
                                  asChild
                                >
                                  <a href={book.affiliate} target="_blank" rel="noopener noreferrer">
                                    Buy Book
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Stories Section */}
            {inspirationSubTab === "stories" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Bitcoin In Action</h2>
                  <p className="text-zinc-400">Real stories from people using Bitcoin worldwide</p>
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
                  {/* Stories content would go here */}
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <p className="text-zinc-400 text-center">Stories content coming soon...</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Conviction Section */}
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
                          <div className="text-center space-y-4">
                            <div className="p-4 bg-orange-600/10 rounded-lg inline-block">
                              <FileText className="w-12 h-12 text-orange-400" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-white">Bitcoin: A Peer-to-Peer Electronic Cash System</h3>
                              <p className="text-zinc-400">By Satoshi Nakamoto • October 31, 2008</p>
                            </div>
                          </div>

                          <div className="bg-orange-600/10 border border-orange-600/20 rounded-lg p-4">
                            <h4 className="text-orange-300 font-medium mb-3">Original Abstract</h4>
                            <p className="text-orange-200 text-sm italic">
                              "A purely peer-to-peer version of electronic cash would allow online payments to be sent directly from one party to another without going through a financial institution. Digital signatures provide part of the solution, but the main benefits are lost if a trusted third party is still required to prevent double-spending. We propose a solution to the double-spending problem using a peer-to-peer network."
                            </p>
                          </div>

                          <div className="space-y-6">
                            <div className="space-y-4">
                              <h4 className="text-white font-semibold">1. Introduction</h4>
                              <p className="text-zinc-300 text-sm leading-relaxed">
                                <AutoGlossary>Commerce on the Internet has come to rely almost exclusively on financial institutions serving as trusted third parties to process electronic payments. While the system works well enough for most transactions, it still suffers from the inherent weaknesses of the trust based model.</AutoGlossary>
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

                {convictionSubTab === "videos" && (
                  <div className="grid gap-6">
                    <Card className="bg-zinc-900 border-zinc-800">
                      <CardContent className="p-6">
                        <p className="text-zinc-400 text-center">Video content coming soon...</p>
                      </CardContent>
                    </Card>
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