import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  X
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatDate, getDayOfWeek, getWeekDates } from "@/lib/utils";
import type { User, DailyFact, Lesson, UserProgress, KnowledgeArea, ConvictionContent, TreasuryCompany, SovereignAdoption } from "@shared/schema";

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

type MainSection = "learning" | "adoption" | "conviction";
type LearningSubTab = "facts" | "lesson" | "progress";
type AdoptionSubTab = "treasury" | "sovereign" | "network";

export default function Home() {
  const [activeSection, setActiveSection] = useState<MainSection>("learning");
  const [learningSubTab, setLearningSubTab] = useState<LearningSubTab>("facts");
  const [adoptionSubTab, setAdoptionSubTab] = useState<AdoptionSubTab>("treasury");
  const [currentLessonPage, setCurrentLessonPage] = useState(0);
  const [showPriceChart, setShowPriceChart] = useState(false);

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const { data: dailyFacts = [] } = useQuery<DailyFact[]>({
    queryKey: ["/api/daily-facts"],
  });

  const { data: lesson } = useQuery<Lesson>({
    queryKey: ["/api/lesson"],
  });

  const { data: todayProgress } = useQuery<UserProgress>({
    queryKey: ["/api/progress/today"],
  });

  const { data: weekProgress = [] } = useQuery<UserProgress[]>({
    queryKey: ["/api/progress/week"],
  });

  const { data: knowledgeAreas = [] } = useQuery<KnowledgeArea[]>({
    queryKey: ["/api/knowledge-areas"],
  });

  const { data: convictionContent = [] } = useQuery<ConvictionContent[]>({
    queryKey: ["/api/conviction-content"],
  });

  const { data: treasuryCompanies = [] } = useQuery<TreasuryCompany[]>({
    queryKey: ["/api/treasury-companies"],
  });

  const { data: sovereignAdoptions = [] } = useQuery<SovereignAdoption[]>({
    queryKey: ["/api/sovereign-adoption"],
  });

  const { data: bitcoinPrice } = useQuery<{
    id: number;
    timestamp: Date;
    priceUsd: string;
    marketCap: string;
    volume24h: string;
    change24h: string;
    change7d: string;
    dominance: string;
  }>({
    queryKey: ["/api/bitcoin-price"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: priceHistory = [] } = useQuery<Array<{
    timestamp: Date;
    priceUsd: string;
    change24h: string;
  }>>({
    queryKey: ["/api/bitcoin-price/history"],
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const completeLessonMutation = useMutation({
    mutationFn: () => apiRequest("/api/progress/complete-lesson", "POST"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress/today"] });
      queryClient.invalidateQueries({ queryKey: ["/api/progress/week"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });

  const handleCompleteLesson = () => {
    if (!todayProgress?.lessonCompleted) {
      completeLessonMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Bitcoin className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">BitcoinEDU</h1>
                <p className="text-sm text-muted-foreground">Daily Bitcoin Education</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Bitcoin Price Tracker */}
              {bitcoinPrice && (
                <Button
                  variant="ghost"
                  className="cyber-button p-2 border border-border hover:bg-primary/5"
                  onClick={() => setShowPriceChart(true)}
                >
                  <div className="flex items-center space-x-2">
                    <Bitcoin className="w-4 h-4 text-primary" />
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        ${parseFloat(bitcoinPrice.priceUsd).toLocaleString()}
                      </p>
                      <p className={`text-xs ${
                        parseFloat(bitcoinPrice.change24h) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {parseFloat(bitcoinPrice.change24h) >= 0 ? '+' : ''}{bitcoinPrice.change24h}%
                      </p>
                    </div>
                    <LineChart className="w-3 h-3 text-muted-foreground" />
                  </div>
                </Button>
              )}
              
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user?.currentStreak || 0} Day Streak</p>
                <p className="text-xs text-muted-foreground">Keep learning!</p>
              </div>
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Section Navigation */}
      <nav className="bg-muted/50 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-0">
            <Button
              variant="ghost"
              className={`py-3 flex flex-col items-center space-y-1 rounded-none border-b-2 transition-all ${
                activeSection === "learning" 
                  ? "text-primary border-primary bg-primary/5 font-medium" 
                  : "text-muted-foreground border-transparent hover:text-foreground hover:bg-primary/5"
              }`}
              onClick={() => setActiveSection("learning")}
            >
              <GraduationCap className="w-4 h-4" />
              <span className="text-sm font-medium">Learning</span>
            </Button>
            <Button
              variant="ghost"
              className={`py-3 flex flex-col items-center space-y-1 rounded-none border-b-2 transition-all ${
                activeSection === "adoption" 
                  ? "text-primary border-primary bg-primary/5 font-medium" 
                  : "text-muted-foreground border-transparent hover:text-foreground hover:bg-primary/5"
              }`}
              onClick={() => setActiveSection("adoption")}
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">Adoption</span>
            </Button>
            <Button
              variant="ghost"
              className={`py-3 flex flex-col items-center space-y-1 rounded-none border-b-2 transition-all ${
                activeSection === "conviction" 
                  ? "text-primary border-primary bg-primary/5 font-medium" 
                  : "text-muted-foreground border-transparent hover:text-foreground hover:bg-primary/5"
              }`}
              onClick={() => setActiveSection("conviction")}
            >
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">Conviction</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Sub-section Navigation */}
      {(activeSection === "learning" || activeSection === "adoption") && (
        <nav className="bg-muted/30 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center">
              {activeSection === "learning" && (
                <div className="flex">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-4 py-2 text-xs rounded-none border-b-2 transition-all ${
                      learningSubTab === "facts" 
                        ? "text-primary border-primary bg-primary/5 font-medium" 
                        : "text-muted-foreground border-transparent hover:text-foreground hover:bg-primary/5"
                    }`}
                    onClick={() => setLearningSubTab("facts")}
                  >
                    <Lightbulb className="w-3 h-3 mr-1" />
                    Facts
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-4 py-2 text-xs rounded-none border-b-2 transition-all ${
                      learningSubTab === "lesson" 
                        ? "text-primary border-primary bg-primary/5 font-medium" 
                        : "text-muted-foreground border-transparent hover:text-foreground hover:bg-primary/5"
                    }`}
                    onClick={() => setLearningSubTab("lesson")}
                  >
                    <BookOpen className="w-3 h-3 mr-1" />
                    Lessons
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-4 py-2 text-xs rounded-none border-b-2 transition-all ${
                      learningSubTab === "progress" 
                        ? "text-primary border-primary bg-primary/5 font-medium" 
                        : "text-muted-foreground border-transparent hover:text-foreground hover:bg-primary/5"
                    }`}
                    onClick={() => setLearningSubTab("progress")}
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Progress
                  </Button>
                </div>
              )}
              {activeSection === "adoption" && (
                <div className="flex">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-4 py-2 text-xs rounded-none border-b-2 transition-all ${
                      adoptionSubTab === "treasury" 
                        ? "text-primary border-primary bg-primary/5 font-medium" 
                        : "text-muted-foreground border-transparent hover:text-foreground hover:bg-primary/5"
                    }`}
                    onClick={() => setAdoptionSubTab("treasury")}
                  >
                    <Building2 className="w-3 h-3 mr-1" />
                    Treasury Companies
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-4 py-2 text-xs rounded-none border-b-2 transition-all ${
                      adoptionSubTab === "sovereign" 
                        ? "text-primary border-primary bg-primary/5 font-medium" 
                        : "text-muted-foreground border-transparent hover:text-foreground hover:bg-primary/5"
                    }`}
                    onClick={() => setAdoptionSubTab("sovereign")}
                  >
                    <Star className="w-3 h-3 mr-1" />
                    Nations
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-4 py-2 text-xs rounded-none border-b-2 transition-all ${
                      adoptionSubTab === "network" 
                        ? "text-primary border-primary bg-primary/5 font-medium" 
                        : "text-muted-foreground border-transparent hover:text-foreground hover:bg-primary/5"
                    }`}
                    onClick={() => setAdoptionSubTab("network")}
                  >
                    <LineChart className="w-3 h-3 mr-1" />
                    Network
                  </Button>
                </div>
              )}
            </div>
          </div>
        </nav>
      )}

      <main className="max-w-2xl mx-auto px-4 py-4">
        {/* Learning Section */}
        {activeSection === "learning" && (
          <>
            {/* Daily Facts */}
            {learningSubTab === "facts" && (
              <div className="fade-in">
                {/* Daily Progress Banner */}
                <div className="bg-primary rounded-lg p-4 mt-4 text-primary-foreground">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">Welcome back!</h2>
                      <p className="text-primary-foreground/80 text-sm">Ready for today's Bitcoin knowledge?</p>
                    </div>
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 rounded-full border-2 border-primary-foreground/20"></div>
                      <div className="absolute inset-0 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin"></div>
                      <div className="absolute inset-2 bg-primary-foreground rounded-full flex items-center justify-center">
                        <span className="text-primary text-xs font-bold">
                          {Math.round(((todayProgress?.factsViewed || 0) / Math.max(dailyFacts.length, 1)) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Progress 
                      value={((todayProgress?.factsViewed || 0) / Math.max(dailyFacts.length, 1)) * 100} 
                      className="h-2 bg-primary-foreground/20" 
                    />
                    <p className="text-primary-foreground/80 text-xs mt-1">
                      {todayProgress?.factsViewed || 0} of {dailyFacts.length} facts learned today
                    </p>
                  </div>
                </div>

                {/* Facts Grid */}
                <div className="mt-4 space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">Today's Bitcoin Facts</h3>
                  {dailyFacts.map((fact, index) => {
                    const IconComponent = iconMap[fact.icon as keyof typeof iconMap] || Coins;
                    
                    return (
                      <Card key={fact.id} className="cyber-card">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <IconComponent className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground mb-2">{fact.title}</h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">{fact.content}</p>
                              <div className="flex items-center justify-between mt-3">
                                <Badge className="badge-soft text-xs">
                                  {fact.category}
                                </Badge>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="cyber-button"
                                >
                                  Learn More
                                  <ArrowRight className="ml-1 w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}

                  {/* Action Buttons */}
                  <div className="flex space-x-3 mt-4">
                    <Button 
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={() => setLearningSubTab("lesson")}
                    >
                      <ArrowRight className="mr-2 w-4 h-4" />
                      Continue to Lesson
                    </Button>
                    <Button variant="outline" size="icon" className="border-border hover:bg-primary/10">
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Daily Lesson */}
            {learningSubTab === "lesson" && lesson && (
              <div className="fade-in">
                {/* Lesson Header */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-foreground glow-text">{lesson.title}</h3>
                      <p className="text-sm text-muted-foreground terminal-text">
                        Estimated reading time: {lesson.estimatedReadTime || 5} minutes
                      </p>
                    </div>
                    <Badge variant={todayProgress?.lessonCompleted ? "default" : "outline"} className="bg-primary/10 text-primary border-primary/20">
                      {todayProgress?.lessonCompleted ? "Completed" : "In Progress"}
                    </Badge>
                  </div>

                  {/* Lesson Content */}
                  <Card className="cyber-card">
                    <CardContent className="p-6">
                      <div className="prose prose-sm max-w-none text-foreground">
                        <div className="whitespace-pre-wrap terminal-text">{lesson.content}</div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Lesson Summary */}
                  {lesson.summary && (
                    <Card className="cyber-card mt-4">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-foreground mb-2 glow-text">Key Takeaways</h4>
                        <p className="text-sm text-muted-foreground terminal-text">{lesson.summary}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Complete Lesson Button */}
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white mt-6"
                    onClick={handleCompleteLesson}
                    disabled={todayProgress?.lessonCompleted || completeLessonMutation.isPending}
                  >
                    <Check className="mr-2 w-4 h-4" />
                    {todayProgress?.lessonCompleted ? "Lesson Completed" : "Mark as Complete"}
                  </Button>
                </div>
              </div>
            )}

            {/* Progress Tab */}
            {learningSubTab === "progress" && (
              <div className="fade-in">
                <div className="mt-6 mb-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-foreground flex items-center justify-center gap-2 glow-text">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Learning Progress
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 terminal-text">
                      Track your Bitcoin education journey
                    </p>
                  </div>
                </div>
                {/* Progress content will go here */}
              </div>
            )}
          </>
        )}

        {/* Conviction Center Section */}
        {activeSection === "conviction" && (
          <div className="fade-in">
            {/* Header */}
            <div className="mt-6 mb-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-foreground flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Conviction Center
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Daily inspiration to strengthen your Bitcoin conviction
                </p>
              </div>
            </div>

            {/* Conviction Content Grid */}
            <div className="grid gap-4">
              {convictionContent.map((content) => (
                <Card key={content.id} className="cyber-card">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {content.type === 'quote' ? 'Quote' : 'Video'}
                        </Badge>
                        {content.author && (
                          <span className="text-sm text-muted-foreground terminal-text">by {content.author}</span>
                        )}
                      </div>
                      <h4 className="font-medium text-foreground glow-text terminal-text">{content.title}</h4>
                    </div>

                    {content.type === 'quote' ? (
                      <div className="relative">
                        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
                        <blockquote className="text-foreground italic pl-6 border-l-4 border-primary/30 terminal-text">
                          {content.content}
                        </blockquote>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground terminal-text">{content.content}</p>
                        {content.videoUrl && (
                          <Button 
                            variant="outline" 
                            className="w-full cyber-button border-border hover:bg-primary/10 hover:border-primary/30"
                            onClick={() => window.open(content.videoUrl!, '_blank')}
                          >
                            <Play className="mr-2 w-4 h-4" />
                            Watch Video
                          </Button>
                        )}
                      </div>
                    )}


                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary Card */}
            <Card className="cyber-card mt-6">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-medium text-foreground">Building Conviction Daily</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Knowledge and conviction grow stronger with each passing day. Stay the course.
                  </p>
                </div>
                
                <div className="flex justify-center space-x-3">
                  <Button variant="outline" size="sm" className="border-border hover:bg-primary/10 hover:border-primary/30">
                    <Share className="mr-2 w-4 h-4" />
                    Share Quote
                  </Button>
                  <Button variant="outline" size="sm" className="border-border hover:bg-primary/10 hover:border-primary/30">
                    <Star className="mr-2 w-4 h-4" />
                    Save Favorite
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Adoption Section */}
        {activeSection === "adoption" && (
          <>
            {/* Treasury Companies */}
            {adoptionSubTab === "treasury" && (
              <div className="fade-in">
                {/* Header */}
                <div className="mt-6 mb-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-foreground flex items-center justify-center gap-2 glow-text">
                      <Building2 className="w-5 h-5 text-primary" />
                      Bitcoin Treasury Companies
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 terminal-text">
                      Corporate Bitcoin holdings and adoption tracker
                    </p>
                  </div>
                </div>

                {/* Treasury Companies Grid */}
                <div className="grid gap-4">
                  {treasuryCompanies.map((company) => (
                    <Card key={company.id} className="cyber-card">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-medium text-foreground terminal-text text-lg glow-text">
                              {company.name}
                              {company.ticker && (
                                <span className="text-sm text-primary ml-2">({company.ticker})</span>
                              )}
                            </h4>
                            <p className="text-sm text-muted-foreground terminal-text">{company.industry}</p>
                          </div>
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            {company.country}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="terminal-header p-3 rounded">
                            <p className="text-xs text-muted-foreground terminal-text">Bitcoin Holdings</p>
                            <p className="text-lg font-medium text-primary glow-text">
                              {parseFloat(company.bitcoinHoldings).toLocaleString()} BTC
                            </p>
                          </div>
                          <div className="terminal-header p-3 rounded">
                            <p className="text-xs text-muted-foreground terminal-text">Market Value</p>
                            <p className="text-lg font-medium text-primary glow-text">
                              ${company.marketValue ? (parseFloat(company.marketValue) / 1000000).toFixed(0) + 'M' : 'N/A'}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground terminal-text">CEO:</span>
                            <span className="text-sm text-foreground terminal-text">{company.ceoName || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground terminal-text">Announced:</span>
                            <span className="text-sm text-foreground terminal-text">
                              {new Date(company.announcementDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed mb-4 terminal-text">
                          {company.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${company.isPublic ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                            <span className="text-xs text-muted-foreground terminal-text">
                              {company.isPublic ? 'Public Company' : 'Private Company'}
                            </span>
                          </div>
                          {company.website && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="cyber-button border-border hover:bg-primary/10 hover:border-primary/30"
                              onClick={() => window.open(company.website!, '_blank')}
                            >
                              <ExternalLink className="mr-2 w-3 h-3" />
                              Website
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Summary Card */}
                <Card className="cyber-card mt-6">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 bitcoin-glow">
                        <Bitcoin className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-medium text-foreground glow-text">Corporate Bitcoin Adoption</h4>
                      <p className="text-sm text-muted-foreground mt-2 terminal-text">
                        Total Holdings: {treasuryCompanies.reduce((sum, company) => sum + parseFloat(company.bitcoinHoldings), 0).toLocaleString()} BTC
                      </p>
                    </div>
                    
                    <div className="flex justify-center space-x-3">
                      <Button variant="outline" size="sm" className="cyber-button border-border hover:bg-primary/10 hover:border-primary/30">
                        <TrendingUp className="mr-2 w-4 h-4" />
                        View Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Sovereign Adoption */}
            {adoptionSubTab === "sovereign" && (
              <div className="fade-in">
                {/* Header */}
                <div className="mt-6 mb-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-foreground flex items-center justify-center gap-2 glow-text">
                      <Star className="w-5 h-5 text-primary" />
                      Bitcoin Nation Adoption
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 terminal-text">
                      Sovereign states and government Bitcoin adoption
                    </p>
                  </div>
                </div>

                {/* Sovereign Adoption Grid */}
                <div className="grid gap-4">
                  {sovereignAdoptions.map((adoption) => (
                    <Card key={adoption.id} className="cyber-card">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-medium text-foreground terminal-text text-lg glow-text">
                              {adoption.entityName}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                {adoption.entityType}
                              </Badge>
                              <Badge 
                                variant={adoption.status === 'active' ? 'default' : 'secondary'}
                                className={adoption.status === 'active' 
                                  ? "bg-green-500/10 text-green-400 border-green-500/20" 
                                  : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                }
                              >
                                {adoption.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground terminal-text">{adoption.region}</p>
                            {adoption.population && (
                              <p className="text-xs text-muted-foreground terminal-text">
                                Pop: {(adoption.population / 1000000).toFixed(1)}M
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-foreground mb-2 terminal-text">Adoption Type</h5>
                          <Badge 
                            variant="outline" 
                            className="bg-primary/10 text-primary border-primary/30 mb-2"
                          >
                            {adoption.adoptionType.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>

                        {adoption.bitcoinHoldings && (
                          <div className="terminal-header p-3 rounded mb-4">
                            <p className="text-xs text-muted-foreground terminal-text">Bitcoin Holdings</p>
                            <p className="text-lg font-medium text-primary glow-text">
                              {parseFloat(adoption.bitcoinHoldings).toLocaleString()} BTC
                            </p>
                          </div>
                        )}

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground terminal-text">Announced:</span>
                            <span className="text-sm text-foreground terminal-text">
                              {new Date(adoption.announcementDate).toLocaleDateString()}
                            </span>
                          </div>
                          {adoption.implementationDate && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground terminal-text">Implemented:</span>
                              <span className="text-sm text-foreground terminal-text">
                                {new Date(adoption.implementationDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {adoption.keyOfficials && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground terminal-text">Key Officials:</span>
                              <span className="text-sm text-foreground terminal-text">{adoption.keyOfficials}</span>
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed terminal-text">
                          {adoption.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Summary Card */}
                <Card className="cyber-card mt-6">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 bitcoin-glow">
                        <Star className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-medium text-foreground glow-text">Global Bitcoin Adoption</h4>
                      <p className="text-sm text-muted-foreground mt-2 terminal-text">
                        {sovereignAdoptions.filter(a => a.status === 'active').length} Active Jurisdictions
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="terminal-header p-3 rounded">
                        <p className="text-xs text-muted-foreground terminal-text">Legal Tender</p>
                        <p className="text-lg font-medium text-primary glow-text">
                          {sovereignAdoptions.filter(a => a.adoptionType === 'legal_tender').length}
                        </p>
                      </div>
                      <div className="terminal-header p-3 rounded">
                        <p className="text-xs text-muted-foreground terminal-text">Mining Friendly</p>
                        <p className="text-lg font-medium text-primary glow-text">
                          {sovereignAdoptions.filter(a => a.adoptionType === 'mining_friendly').length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Network Adoption */}
            {adoptionSubTab === "network" && (
              <div className="fade-in">
                {/* Header */}
                <div className="mt-6 mb-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-foreground flex items-center justify-center gap-2 glow-text">
                      <LineChart className="w-5 h-5 text-primary" />
                      Bitcoin Network Adoption
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 terminal-text">
                      On-chain metrics showing real Bitcoin network growth and usage
                    </p>
                  </div>
                </div>

                {/* Network Metrics */}
                <NetworkMetricsDisplay />
              </div>
            )}
          </>
        )}
      </main>

      {/* Bitcoin Price Chart Modal */}
      <Dialog open={showPriceChart} onOpenChange={setShowPriceChart}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Bitcoin className="w-5 h-5 text-primary" />
              <span>Bitcoin Price Chart</span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={() => setShowPriceChart(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {bitcoinPrice && (
            <div className="space-y-6">
              {/* Price Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="cyber-card p-4">
                  <p className="text-sm text-muted-foreground">Current Price</p>
                  <p className="text-2xl font-bold text-primary">
                    ${parseFloat(bitcoinPrice.priceUsd).toLocaleString()}
                  </p>
                </div>
                <div className="cyber-card p-4">
                  <p className="text-sm text-muted-foreground">24h Change</p>
                  <p className={`text-xl font-semibold ${
                    parseFloat(bitcoinPrice.change24h) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {parseFloat(bitcoinPrice.change24h) >= 0 ? '+' : ''}{bitcoinPrice.change24h}%
                  </p>
                </div>
                <div className="cyber-card p-4">
                  <p className="text-sm text-muted-foreground">Market Cap</p>
                  <p className="text-xl font-semibold text-foreground">
                    ${(parseFloat(bitcoinPrice.marketCap) / 1000000000).toFixed(1)}B
                  </p>
                </div>
                <div className="cyber-card p-4">
                  <p className="text-sm text-muted-foreground">24h Volume</p>
                  <p className="text-xl font-semibold text-foreground">
                    ${(parseFloat(bitcoinPrice.volume24h) / 1000000000).toFixed(1)}B
                  </p>
                </div>
              </div>

              {/* Simple Price Chart */}
              <div className="cyber-card p-6">
                <h3 className="text-lg font-semibold mb-4">24 Hour Price Trend</h3>
                <div className="h-64 flex items-end space-x-1">
                  {priceHistory.slice(-24).map((point, index) => {
                    const height = ((parseFloat(point.priceUsd) - 65000) / 5000) * 100;
                    const isPositive = parseFloat(point.change24h) >= 0;
                    return (
                      <div
                        key={index}
                        className={`flex-1 rounded-t transition-all hover:opacity-80 ${
                          isPositive ? 'bg-green-400' : 'bg-red-400'
                        }`}
                        style={{ height: `${Math.max(10, Math.min(100, height))}%` }}
                        title={`$${parseFloat(point.priceUsd).toLocaleString()}`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>24h ago</span>
                  <span>Now</span>
                </div>
              </div>

              {/* Market Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="cyber-card p-4">
                  <h4 className="font-semibold mb-2">Market Dominance</h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${bitcoinPrice.dominance}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{bitcoinPrice.dominance}%</span>
                  </div>
                </div>
                <div className="cyber-card p-4">
                  <h4 className="font-semibold mb-2">7 Day Change</h4>
                  <p className={`text-lg font-semibold ${
                    parseFloat(bitcoinPrice.change7d) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {parseFloat(bitcoinPrice.change7d) >= 0 ? '+' : ''}{bitcoinPrice.change7d}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Floating Action Button */}
      <Button 
        className="fixed bottom-6 right-6 w-14 h-14 bg-secondary hover:bg-secondary-dark text-white rounded-full material-shadow-3"
        size="icon"
      >
        <HelpCircle className="w-5 h-5" />
      </Button>
    </div>
  );
}

// Network Metrics Display Component
function NetworkMetricsDisplay() {
  const { data: networkMetrics, isLoading } = useQuery<NetworkMetric[]>({
    queryKey: ["/api/network-metrics"],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="cyber-card">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metrics = networkMetrics || [];

  return (
    <>
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="cyber-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center bitcoin-glow">
                    {metric.icon === 'users' && <UserIcon className="w-4 h-4 text-primary" />}
                    {metric.icon === 'trending-up' && <TrendingUp className="w-4 h-4 text-primary" />}
                    {metric.icon === 'zap' && <Zap className="w-4 h-4 text-primary" />}
                    {metric.icon === 'coins' && <Coins className="w-4 h-4 text-primary" />}
                    {metric.icon === 'shield' && <Shield className="w-4 h-4 text-primary" />}
                    {metric.icon === 'globe' && <Globe className="w-4 h-4 text-primary" />}
                  </div>
                  <h4 className="font-medium text-foreground terminal-text">{metric.metric}</h4>
                </div>
                <Badge 
                  variant={metric.change24h.startsWith('+') ? 'default' : 'secondary'}
                  className={metric.change24h.startsWith('+') 
                    ? "bg-green-500/10 text-green-400 border-green-500/20" 
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                  }
                >
                  {metric.change24h}
                </Badge>
              </div>
              
              <div className="mb-4">
                <p className="text-2xl font-bold text-primary glow-text mb-1">
                  {metric.value}
                </p>
                <p className="text-sm text-muted-foreground terminal-text">
                  {metric.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      <Card className="cyber-card mt-6">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 bitcoin-glow">
              <LineChart className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-medium text-foreground glow-text">Network Growth Summary</h4>
            <p className="text-sm text-muted-foreground mt-2 terminal-text">
              Bitcoin network showing strong adoption metrics across all indicators
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="terminal-header p-3 rounded">
              <p className="text-xs text-muted-foreground terminal-text">Overall Health</p>
              <p className="text-lg font-medium text-green-400 glow-text">Strong</p>
            </div>
            <div className="terminal-header p-3 rounded">
              <p className="text-xs text-muted-foreground terminal-text">Adoption Trend</p>
              <p className="text-lg font-medium text-primary glow-text">Growing</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}