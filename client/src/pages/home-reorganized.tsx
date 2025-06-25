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
  zap: Zap,
  "graduation-cap": GraduationCap,
  "help-circle": HelpCircle,
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

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-600 rounded-lg">
                <Bitcoin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Bitcoin Education</h1>
                <p className="text-xs text-zinc-400">Build your conviction</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPriceChart(!showPriceChart)}
                className="text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <Bitcoin className="w-4 h-4 mr-1" />
                <span className="text-sm font-mono">
                  $100,000
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
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {activeSection === "foundation" && "Build Your Bitcoin Foundation"}
            {activeSection === "practice" && "Practice Bitcoin Concepts"}
            {activeSection === "inspiration" && "Find Your Bitcoin Inspiration"}
          </h2>
          <p className="text-zinc-400">
            {activeSection === "foundation" && "Learn the fundamentals and understand why Bitcoin matters"}
            {activeSection === "practice" && "Interactive simulations to deepen your understanding"}
            {activeSection === "inspiration" && "Real stories and conviction-building content"}
          </p>
        </div>

        <div className="grid gap-6">
          {activeSection === "foundation" && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  {foundationSubTab === "basics" && "Daily Bitcoin Facts"}
                  {foundationSubTab === "lesson" && "Today's Lesson"}
                  {foundationSubTab === "quiz" && "Test Your Knowledge"}
                  {foundationSubTab === "explore" && "Advanced Topics"}
                  {foundationSubTab === "disruption" && "Financial Disruption"}
                  {foundationSubTab === "terms" && "Bitcoin Terms"}
                </h3>
                <p className="text-zinc-300">
                  This section contains educational content based on the selected tab.
                </p>
              </CardContent>
            </Card>
          )}

          {activeSection === "practice" && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  {practiceSubTab === "mining" && "Bitcoin Mining Simulator"}
                  {practiceSubTab === "transactions" && "Transaction Builder"}
                  {practiceSubTab === "hodl" && "HODLing Strategy"}
                  {practiceSubTab === "dca" && "Dollar-Cost Averaging"}
                  {practiceSubTab === "halving" && "Halving Impact"}
                </h3>
                <p className="text-zinc-300">
                  Interactive simulation based on the selected practice area.
                </p>
              </CardContent>
            </Card>
          )}

          {activeSection === "inspiration" && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  {inspirationSubTab === "stories" && "Bitcoin Stories"}
                  {inspirationSubTab === "conviction" && "Build Conviction"}
                </h3>
                <p className="text-zinc-300">
                  {inspirationSubTab === "stories" && "Real stories from Bitcoin users around the world"}
                  {inspirationSubTab === "conviction" && "Resources to strengthen your Bitcoin conviction"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}