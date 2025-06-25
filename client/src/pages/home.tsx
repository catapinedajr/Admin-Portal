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
  AlertTriangle
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatDate, getDayOfWeek, getWeekDates } from "@/lib/utils";
import type { User, DailyFact, Lesson, UserProgress, KnowledgeArea } from "@shared/schema";

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

type TabType = "facts" | "lesson" | "progress";

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
      <header className="bg-card shadow-lg sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <Bitcoin className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-medium text-foreground">BitcoinEdu</h1>
                <p className="text-sm text-muted-foreground">Daily Learning</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-lg font-medium text-secondary">{user?.currentStreak || 0}</div>
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
      <nav className="bg-card shadow-sm relative">
        <div className="max-w-md mx-auto">
          <div className="flex">
            <Button
              variant="ghost"
              className={`flex-1 py-4 flex flex-col items-center space-y-1 rounded-none border-b-2 ${
                activeTab === "facts" 
                  ? "text-primary border-primary" 
                  : "text-muted-foreground border-transparent"
              }`}
              onClick={() => setActiveTab("facts")}
            >
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm">Today's Facts</span>
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 py-4 flex flex-col items-center space-y-1 rounded-none border-b-2 ${
                activeTab === "lesson" 
                  ? "text-primary border-primary" 
                  : "text-muted-foreground border-transparent"
              }`}
              onClick={() => setActiveTab("lesson")}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">Daily Lesson</span>
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 py-4 flex flex-col items-center space-y-1 rounded-none border-b-2 ${
                activeTab === "progress" 
                  ? "text-primary border-primary" 
                  : "text-muted-foreground border-transparent"
              }`}
              onClick={() => setActiveTab("progress")}
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Progress</span>
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 pb-6">
        {/* Today's Facts Tab */}
        {activeTab === "facts" && (
          <div className="fade-in">
            {/* Daily Progress Banner */}
            <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-6 mt-4 text-white material-shadow-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium">Welcome back!</h2>
                  <p className="text-blue-100 text-sm">Ready for today's Bitcoin knowledge?</p>
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
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
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
              return (
                <Card key={fact.id} className="mb-4 card-hover material-shadow-1">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <IconComponent className="text-secondary w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-2">{fact.title}</h4>
                        <p className="text-muted-foreground leading-relaxed">{fact.content}</p>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-xs text-muted-foreground">#{fact.category}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-primary hover:text-primary-dark"
                            onClick={handleFactView}
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
                className="flex-1 bg-primary hover:bg-primary-dark text-white material-shadow-2"
                onClick={() => setActiveTab("lesson")}
              >
                <ArrowRight className="mr-2 w-4 h-4" />
                Continue to Lesson
              </Button>
              <Button variant="outline" size="icon" className="material-shadow-1">
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
              <Card className="mb-6 material-shadow-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Lesson Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {todayProgress?.lessonCompleted ? 100 : 15}%
                    </span>
                  </div>
                  <Progress value={todayProgress?.lessonCompleted ? 100 : 15} className="h-2" />
                </CardContent>
              </Card>
            </div>

            {/* Lesson Content Card */}
            <Card className="material-shadow-1">
              <CardContent className="p-6">
                {lesson.imageUrl && (
                  <div className="mb-6">
                    <img 
                      src={lesson.imageUrl}
                      alt={lesson.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <h2 className="text-xl font-medium text-foreground mb-4">{lesson.title}</h2>
                
                <div className="prose text-muted-foreground leading-relaxed space-y-4">
                  {lesson.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="whitespace-pre-line">{paragraph}</p>
                  ))}
                </div>

                {/* Lesson Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <ChevronLeft className="mr-2 w-4 h-4" />
                    Previous
                  </Button>
                  <div className="flex space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span className="w-2 h-2 bg-muted rounded-full"></span>
                    <span className="w-2 h-2 bg-muted rounded-full"></span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary font-medium">
                    Next
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Complete Lesson Button */}
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white material-shadow-2 mt-6"
              onClick={handleCompleteLesson}
              disabled={todayProgress?.lessonCompleted || completeLessonMutation.isPending}
            >
              <Check className="mr-2 w-4 h-4" />
              {todayProgress?.lessonCompleted ? "Lesson Completed" : "Mark as Complete"}
            </Button>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === "progress" && (
          <div className="fade-in">
            {/* Overall Progress */}
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-6 mt-6 text-white material-shadow-2">
              <h3 className="text-lg font-medium mb-4">Your Learning Journey</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{user?.completedLessons || 15}</div>
                  <div className="text-blue-100 text-sm">Lessons Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{user?.currentStreak || 7}</div>
                  <div className="text-blue-100 text-sm">Day Streak</div>
                </div>
              </div>
            </div>

            {/* Weekly Progress */}
            <Card className="mt-6 material-shadow-1">
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
