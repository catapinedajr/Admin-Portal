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
  ExternalLink
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatDate, getDayOfWeek, getWeekDates } from "@/lib/utils";
import type { User, DailyFact, Lesson, UserProgress, KnowledgeArea, ConvictionContent } from "@shared/schema";

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

type TabType = "facts" | "lesson" | "progress" | "conviction";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("facts");
  const [currentLessonPage, setCurrentLessonPage] = useState(0);

  // Queries
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

  // Mutations
  const updateProgressMutation = useMutation({
    mutationFn: async (data: { factsViewed?: number; lessonCompleted?: boolean }) => {
      const response = await apiRequest("POST", "/api/progress", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress/today"] });
      queryClient.invalidateQueries({ queryKey: ["/api/progress/week"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });

  const completeLessonMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/lesson/complete", {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress/today"] });
      queryClient.invalidateQueries({ queryKey: ["/api/progress/week"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/knowledge-areas"] });
    },
  });

  const handleFactView = () => {
    const newFactsViewed = Math.min(3, (todayProgress?.factsViewed || 0) + 1);
    updateProgressMutation.mutate({ factsViewed: newFactsViewed });
  };

  const handleCompleteLesson = () => {
    completeLessonMutation.mutate();
  };

  const handleLearnMore = (factId: number) => {
    handleFactView();
    // Could expand this to show detailed fact modal or navigate to expanded view
  };

  const nextLessonPage = () => {
    setCurrentLessonPage(prev => Math.min(2, prev + 1));
  };

  const prevLessonPage = () => {
    setCurrentLessonPage(prev => Math.max(0, prev - 1));
  };

  // Get current lesson page content
  const getLessonPageContent = () => {
    if (!lesson) return null;
    
    const lessonPages = [
      {
        title: lesson.title,
        content: lesson.content
      },
      {
        title: "Understanding Bitcoin Mining",
        content: `Bitcoin mining is the process by which new bitcoins are created and transactions are verified and added to the blockchain ledger. This process is crucial for maintaining the security and integrity of the Bitcoin network.

The Mining Process:
Miners use specialized computer hardware to solve complex mathematical problems. These problems require significant computational power and energy to solve, but the solutions can be quickly verified by other network participants.

Why Mining Matters:
1. Transaction Verification: Miners confirm that transactions are legitimate
2. Network Security: The computational work makes the network resistant to attacks
3. New Bitcoin Creation: Successful miners are rewarded with newly created bitcoins
4. Decentralization: Anyone can participate in mining, keeping the network distributed

The mining process ensures that Bitcoin remains secure, decentralized, and trustworthy without requiring a central authority.`
      },
      {
        title: "The Economics of Mining",
        content: `Bitcoin mining operates on economic incentives that ensure network security while creating new bitcoins according to a predictable schedule.

Mining Rewards:
Miners receive two types of rewards for their work:
- Block Reward: New bitcoins created with each block (currently 6.25 BTC)
- Transaction Fees: Fees paid by users for including their transactions

The Halving Event:
Every 210,000 blocks (approximately 4 years), the block reward is cut in half. This ensures Bitcoin's maximum supply will never exceed 21 million coins.

Mining Difficulty:
The network automatically adjusts mining difficulty every 2,016 blocks to maintain an average block time of 10 minutes, regardless of how many miners participate.

Energy and Sustainability:
While mining consumes energy, it increasingly uses renewable sources and provides economic incentives for developing efficient energy infrastructure.`
      }
    ];

    return lessonPages[currentLessonPage] || lessonPages[0];
  };

  const progressPercentage = todayProgress?.progressPercentage || 0;
  const currentDate = formatDate(new Date());

  // Get week dates for progress chart
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  const weekDates = getWeekDates(monday);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Bitcoin className="text-primary-foreground w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-medium text-foreground">BitcoinEdu</h1>
                <p className="text-sm text-muted-foreground">Daily Learning</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-lg font-medium text-primary">{user?.currentStreak || 0}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
              <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full">
                <UserIcon className="text-muted-foreground w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-card border-b border-border relative">
        <div className="max-w-md mx-auto">
          <div className="flex">
            <Button
              variant="ghost"
              className={`flex-1 py-3 flex flex-col items-center space-y-1 rounded-none border-b-3 transition-all ${
                activeTab === "facts" 
                  ? "text-primary border-primary bg-primary/10 font-medium" 
                  : "text-muted-foreground border-transparent hover:text-foreground hover:bg-primary/5 hover:border-primary/30"
              }`}
              onClick={() => setActiveTab("facts")}
            >
              <Lightbulb className={`w-4 h-4 ${activeTab === "facts" ? "text-primary" : ""}`} />
              <span className="text-xs font-medium">Facts</span>
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 py-3 flex flex-col items-center space-y-1 rounded-none border-b-3 transition-all ${
                activeTab === "lesson" 
                  ? "text-primary border-primary bg-primary/10 font-medium" 
                  : "text-muted-foreground border-transparent hover:text-foreground hover:bg-primary/5 hover:border-primary/30"
              }`}
              onClick={() => setActiveTab("lesson")}
            >
              <BookOpen className={`w-4 h-4 ${activeTab === "lesson" ? "text-primary" : ""}`} />
              <span className="text-xs font-medium">Lesson</span>
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 py-3 flex flex-col items-center space-y-1 rounded-none border-b-3 transition-all ${
                activeTab === "conviction" 
                  ? "text-primary border-primary bg-primary/10 font-medium" 
                  : "text-muted-foreground border-transparent hover:text-foreground hover:bg-primary/5 hover:border-primary/30"
              }`}
              onClick={() => setActiveTab("conviction")}
            >
              <Heart className={`w-4 h-4 ${activeTab === "conviction" ? "text-primary" : ""}`} />
              <span className="text-xs font-medium">Conviction</span>
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 py-3 flex flex-col items-center space-y-1 rounded-none border-b-3 transition-all ${
                activeTab === "progress" 
                  ? "text-primary border-primary bg-primary/10 font-medium" 
                  : "text-muted-foreground border-transparent hover:text-foreground hover:bg-primary/5 hover:border-primary/30"
              }`}
              onClick={() => setActiveTab("progress")}
            >
              <TrendingUp className={`w-4 h-4 ${activeTab === "progress" ? "text-primary" : ""}`} />
              <span className="text-xs font-medium">Progress</span>
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 pb-6">
        {/* Today's Facts Tab */}
        {activeTab === "facts" && (
          <div className="fade-in">
            {/* Daily Progress Banner */}
            <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-6 mt-4 text-primary-foreground border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium">Welcome back!</h2>
                  <p className="text-primary-foreground/80 text-sm">Ready for today's Bitcoin knowledge?</p>
                </div>
                <div className="relative w-16 h-16">
                  <svg className="progress-circle w-16 h-16" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
                    <circle 
                      cx="18" 
                      cy="18" 
                      r="16" 
                      fill="none" 
                      stroke="white" 
                      strokeWidth="2" 
                      strokeDasharray={`${progressPercentage} ${100 - progressPercentage}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-primary-foreground">
                    {progressPercentage}%
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Date and Facts Counter */}
            <div className="flex items-center justify-between mt-6 mb-4">
              <div>
                <h3 className="text-lg font-medium text-foreground">Today's Facts</h3>
                <p className="text-sm text-muted-foreground">{currentDate}</p>
              </div>
              <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                {dailyFacts.length} New Facts
              </Badge>
            </div>

            {/* Fact Cards */}
            {dailyFacts.map((fact) => {
              const IconComponent = iconMap[fact.icon as keyof typeof iconMap] || Coins;
              const isTraditionalFinance = fact.category === "TraditionalFinance";
              return (
                <Card key={fact.id} className="mb-4 card-hover border border-border bg-card hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isTraditionalFinance 
                          ? "bg-orange-500/10 border border-orange-500/20" 
                          : "bg-primary/10 border border-primary/20"
                      }`}>
                        <IconComponent className={`w-5 h-5 ${
                          isTraditionalFinance ? "text-orange-400" : "text-primary"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-2">{fact.title}</h4>
                        <p className="text-muted-foreground leading-relaxed">{fact.content}</p>
                        <div className="flex items-center justify-between mt-4">
                          <Badge variant="secondary" className={`text-xs ${
                            isTraditionalFinance 
                              ? "bg-orange-500/10 text-orange-400 border-orange-500/20" 
                              : "bg-primary/10 text-primary border-primary/20"
                          }`}>
                            #{fact.category}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-primary hover:text-primary/80 hover:bg-primary/10"
                            onClick={() => handleLearnMore(fact.id)}
                          >
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
                onClick={() => setActiveTab("lesson")}
              >
                <ArrowRight className="mr-2 w-4 h-4" />
                Continue to Lesson
              </Button>
              <Button variant="outline" size="icon" className="border-border hover:bg-primary/10 hover:border-primary/30">
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Daily Lesson Tab */}
        {activeTab === "lesson" && lesson && (
          <div className="fade-in">
            {/* Lesson Header */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-foreground">Today's Lesson</h3>
                  <p className="text-sm text-muted-foreground">
                    Lesson {user?.completedLessons || 15} of 100
                  </p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {lesson.estimatedReadTime} min read
                </Badge>
              </div>

              {/* Lesson Progress */}
              <Card className="mb-6 border border-border bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Lesson Progress</span>
                    <span className="text-sm text-primary">
                      {todayProgress?.lessonCompleted ? 100 : 15}%
                    </span>
                  </div>
                  <Progress value={todayProgress?.lessonCompleted ? 100 : 15} className="h-2" />
                </CardContent>
              </Card>
            </div>

            {/* Lesson Content Card */}
            <Card className="border border-border bg-card">
              <CardContent className="p-6">
                {lesson.imageUrl && (
                  <div className="mb-6">
                    <img 
                      src={lesson.imageUrl}
                      alt={lesson.title}
                      className="w-full h-48 object-cover rounded-lg border border-border"
                    />
                  </div>
                )}
                
                <h2 className="text-xl font-medium text-foreground mb-4">
                  {getLessonPageContent()?.title || lesson.title}
                </h2>
                
                <div className="prose text-muted-foreground leading-relaxed space-y-4">
                  {(getLessonPageContent()?.content || lesson.content).split('\n\n').map((paragraph, index) => (
                    <p key={index} className="whitespace-pre-line">{paragraph}</p>
                  ))}
                </div>

                {/* Lesson Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground hover:text-foreground"
                    onClick={prevLessonPage}
                    disabled={currentLessonPage === 0}
                  >
                    <ChevronLeft className="mr-2 w-4 h-4" />
                    Previous
                  </Button>
                  <div className="flex space-x-2">
                    {[0, 1, 2].map((page) => (
                      <span 
                        key={page}
                        className={`w-2 h-2 rounded-full ${
                          currentLessonPage === page ? "bg-primary" : "bg-muted"
                        }`}
                      ></span>
                    ))}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary font-medium hover:text-primary/80"
                    onClick={nextLessonPage}
                    disabled={currentLessonPage === 2}
                  >
                    Next
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

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
        )}

        {/* Conviction Center Tab */}
        {activeTab === "conviction" && (
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

            {/* Quotes Section */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-foreground mb-4 flex items-center gap-2">
                <Quote className="w-4 h-4 text-primary" />
                Today's Wisdom
              </h4>
              
              {convictionContent
                .filter(content => content.type === "quote")
                .map((quote) => (
                  <Card key={quote.id} className={`mb-4 border transition-colors ${
                    quote.featured 
                      ? "border-primary/30 bg-primary/5" 
                      : "border-border bg-card hover:border-primary/20"
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          quote.featured 
                            ? "bg-primary/20 border border-primary/30" 
                            : "bg-muted"
                        }`}>
                          <Quote className={`w-4 h-4 ${quote.featured ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                        <div className="flex-1">
                          <blockquote className="text-foreground italic leading-relaxed mb-3 text-base">
                            "{quote.content}"
                          </blockquote>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-foreground text-sm">{quote.author}</p>
                              {quote.source && (
                                <p className="text-xs text-muted-foreground">{quote.source}</p>
                              )}
                            </div>
                            {quote.featured && (
                              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {/* Video Section */}
            {convictionContent
              .filter(content => content.type === "video")
              .map((video) => (
                <div key={video.id} className="mb-6">
                  <h4 className="text-md font-medium text-foreground mb-4 flex items-center gap-2">
                    <Play className="w-4 h-4 text-primary" />
                    Today's Video
                  </h4>
                  
                  <Card className="border border-primary/30 bg-primary/5">
                    <CardContent className="p-0">
                      {video.thumbnailUrl && (
                        <div className="relative">
                          <img 
                            src={video.thumbnailUrl} 
                            alt={video.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-t-lg">
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                              <Play className="w-6 h-6 text-primary-foreground ml-1" />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-6">
                        <h5 className="font-medium text-foreground mb-2">{video.title}</h5>
                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                          {video.content}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground text-sm">{video.author}</p>
                            {video.source && (
                              <p className="text-xs text-muted-foreground">{video.source}</p>
                            )}
                          </div>
                          
                          {video.videoUrl && (
                            <Button 
                              className="bg-primary hover:bg-primary-dark text-primary-foreground"
                              onClick={() => window.open(video.videoUrl!, '_blank')}
                            >
                              <ExternalLink className="mr-2 w-4 h-4" />
                              Watch Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}

            {/* Daily Conviction Builder */}
            <Card className="border border-border bg-card">
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

        {/* Progress Tab */}
        {activeTab === "progress" && (
          <div className="fade-in">
            {/* Overall Progress */}
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-6 mt-6 text-primary-foreground border border-primary/20">
              <h3 className="text-lg font-medium mb-4">Your Learning Journey</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{user?.completedLessons || 15}</div>
                  <div className="text-primary-foreground/80 text-sm">Lessons Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{user?.currentStreak || 7}</div>
                  <div className="text-primary-foreground/80 text-sm">Day Streak</div>
                </div>
              </div>
            </div>

            {/* Weekly Progress */}
            <Card className="mt-6 border border-border bg-card">
              <CardContent className="p-6">
                <h4 className="font-medium text-foreground mb-4">This Week's Activity</h4>
                <div className="flex justify-between items-end space-x-2">
                  {weekDates.map((date, index) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const dayProgress = weekProgress.find(p => p.date === dateStr);
                    const isToday = dateStr === new Date().toISOString().split('T')[0];
                    const progressHeight = dayProgress ? `${dayProgress.progressPercentage}%` : '0%';
                    
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div className="w-8 h-12 bg-muted rounded-md mb-2 relative overflow-hidden">
                          <div 
                            className={`absolute bottom-0 w-full ${isToday ? 'bg-primary pulse-animation' : 'bg-green-500'}`}
                            style={{ height: progressHeight }}
                          />
                        </div>
                        <span className={`text-xs ${isToday ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                          {getDayOfWeek(date)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Achievement Badges */}
            <Card className="mt-6 material-shadow-1">
              <CardContent className="p-6">
                <h4 className="font-medium text-foreground mb-4">Achievements</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Flame className="text-secondary w-5 h-5" />
                    </div>
                    <div className="text-xs text-muted-foreground">7-Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <GraduationCap className="text-primary w-5 h-5" />
                    </div>
                    <div className="text-xs text-muted-foreground">Quick Learner</div>
                  </div>
                  <div className="text-center opacity-50">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="text-muted-foreground w-5 h-5" />
                    </div>
                    <div className="text-xs text-muted-foreground">30-Day Master</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Categories */}
            <Card className="mt-6 material-shadow-1">
              <CardContent className="p-6">
                <h4 className="font-medium text-foreground mb-4">Knowledge Areas</h4>
                <div className="space-y-4">
                  {knowledgeAreas.map((area) => {
                    const IconComponent = iconMap[area.icon as keyof typeof iconMap] || Coins;
                    const percentage = Math.round((area.completedLessons / area.totalLessons) * 100);
                    
                    return (
                      <div key={area.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                            <IconComponent className="text-secondary w-4 h-4" />
                          </div>
                          <span className="text-sm text-foreground">{area.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={percentage} className="w-16 h-2" />
                          <span className="text-xs text-muted-foreground">{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
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
