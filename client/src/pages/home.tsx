import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
  Globe
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatDate, getDayOfWeek, getWeekDates } from "@/lib/utils";
import type { User, DailyFact, Lesson, UserProgress, KnowledgeArea, ConvictionContent, TreasuryCompany, SovereignAdoption } from "@shared/schema";

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
type AdoptionSubTab = "treasury" | "sovereign";

export default function Home() {
  const [activeSection, setActiveSection] = useState<MainSection>("learning");
  const [learningSubTab, setLearningSubTab] = useState<LearningSubTab>("facts");
  const [adoptionSubTab, setAdoptionSubTab] = useState<AdoptionSubTab>("treasury");
  const [currentLessonPage, setCurrentLessonPage] = useState(0);

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
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center bitcoin-glow">
                <Bitcoin className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground glow-text">BitcoinEDU</h1>
                <p className="text-sm text-muted-foreground terminal-text">Daily Bitcoin Education</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground terminal-text">{user?.currentStreak || 0} Day Streak</p>
                <p className="text-xs text-muted-foreground terminal-text">Keep learning!</p>
              </div>
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Section Navigation */}
      <nav className="bg-card border-b border-border relative">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-0">
            <Button
              variant="ghost"
              className={`py-3 flex flex-col items-center space-y-1 rounded-none border-b-3 transition-all ${
                activeSection === "learning" 
                  ? "text-primary border-primary bg-primary/10 font-medium cyber-button" 
                  : "text-muted-foreground border-transparent hover:text-foreground hover:bg-primary/5 hover:border-primary/30"
              }`}
              onClick={() => setActiveSection("learning")}
            >
              <GraduationCap className={`w-4 h-4 ${activeSection === "learning" ? "text-primary glow-text" : ""}`} />
              <span className="text-sm font-medium terminal-text">Learning</span>
            </Button>
            <Button
              variant="ghost"
              className={`py-3 flex flex-col items-center space-y-1 rounded-none border-b-3 transition-all ${
                activeSection === "adoption" 
                  ? "text-primary border-primary bg-primary/10 font-medium cyber-button" 
                  : "text-muted-foreground border-transparent hover:text-foreground hover:bg-primary/5 hover:border-primary/30"
              }`}
              onClick={() => setActiveSection("adoption")}
            >
              <Globe className={`w-4 h-4 ${activeSection === "adoption" ? "text-primary glow-text" : ""}`} />
              <span className="text-sm font-medium terminal-text">Adoption</span>
            </Button>
            <Button
              variant="ghost"
              className={`py-3 flex flex-col items-center space-y-1 rounded-none border-b-3 transition-all ${
                activeSection === "conviction" 
                  ? "text-primary border-primary bg-primary/10 font-medium cyber-button" 
                  : "text-muted-foreground border-transparent hover:text-foreground hover:bg-primary/5 hover:border-primary/30"
              }`}
              onClick={() => setActiveSection("conviction")}
            >
              <Heart className={`w-4 h-4 ${activeSection === "conviction" ? "text-primary glow-text" : ""}`} />
              <span className="text-sm font-medium terminal-text">Conviction</span>
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
                </div>
              )}
            </div>
          </div>
        </nav>
      )}

      <main className="max-w-md mx-auto px-4 pb-6">
        {/* Learning Section */}
        {activeSection === "learning" && (
          <>
            {/* Daily Facts */}
            {learningSubTab === "facts" && (
              <div className="fade-in">
                {/* Daily Progress Banner */}
                <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-6 mt-4 text-primary-foreground border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-medium">Welcome back!</h2>
                      <p className="text-primary-foreground/80 text-sm">Ready for today's Bitcoin knowledge?</p>
                    </div>
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 rounded-full border-4 border-primary-foreground/20"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-primary-foreground border-t-transparent animate-spin"></div>
                      <div className="absolute inset-4 bg-primary-foreground rounded-full flex items-center justify-center">
                        <span className="text-primary text-sm font-bold">
                          {Math.round(((todayProgress?.factsViewed || 0) / Math.max(dailyFacts.length, 1)) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress 
                      value={((todayProgress?.factsViewed || 0) / Math.max(dailyFacts.length, 1)) * 100} 
                      className="h-2 bg-primary-foreground/20" 
                    />
                  </div>
                </div>

                {/* Facts Grid */}
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-medium text-foreground glow-text">Today's Bitcoin Facts</h3>
                  {dailyFacts.map((fact, index) => {
                    const IconComponent = iconMap[fact.icon as keyof typeof iconMap] || Coins;
                    return (
                      <Card key={fact.id} className="cyber-card">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 bitcoin-glow">
                              <IconComponent className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground mb-2 glow-text terminal-text">{fact.title}</h4>
                              <p className="text-sm text-muted-foreground leading-relaxed terminal-text">{fact.content}</p>
                              <div className="flex items-center justify-between mt-4">
                                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                                  {fact.category}
                                </Badge>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="cyber-button border-border hover:bg-primary/10 hover:border-primary/30"
                                >
                                  <ArrowRight className="mr-1 w-3 h-3" />
                                  Learn More
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}

                  {/* Action Buttons */}
                  <div className="flex space-x-3 mt-6">
                    <Button 
                      className="flex-1 bg-primary hover:bg-primary-dark text-primary-foreground"
                      onClick={() => setLearningSubTab("lesson")}
                    >
                      <ArrowRight className="mr-2 w-4 h-4" />
                      Continue to Lesson
                    </Button>
                    <Button variant="outline" size="icon" className="border-border hover:bg-primary/10 hover:border-primary/30">
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
          </>
        )}
      </main>

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