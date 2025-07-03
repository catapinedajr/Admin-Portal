import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  TrendingUp, 
  Gamepad2, 
  MoreHorizontal,
  Coins,
  Calendar,
  Target,
  Award,
  ChevronRight,
  Zap,
  Shield,
  Calculator,
  Play,
  Clock
} from "lucide-react";
import { useLocation } from "wouter";
import BottomNavigation from "@/components/BottomNavigation";

interface User {
  id: number;
  username: string;
  currentStreak: number;
  longestStreak: number;
  completedLessons: number;
  lastActivityDate: string;
}

interface DailyContentFact {
  id: number;
  dayId: number;
  title: string;
  content: string;
  icon: string;
  category: string;
}

interface ContentLesson {
  id: number;
  dayId: number;
  title: string;
  content: string;
  keyTakeaways: string[];
  whyItMatters: string;
  estimatedReadTime: number;
}

export default function HomeDashboard() {
  const [, setLocation] = useLocation();

  // Fetch user data
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  // Get current day
  const { data: nextDay } = useQuery<{ dayIndex: number }>({
    queryKey: ["/api/next-available-day", user?.id || 1],
    enabled: !!user,
  });

  const currentDayIndex = nextDay?.dayIndex || 1;

  // Fetch today's content preview
  const { data: dailyFacts } = useQuery<DailyContentFact[]>({
    queryKey: ["/api/daily-facts", currentDayIndex],
  });

  const { data: lesson } = useQuery<ContentLesson>({
    queryKey: ["/api/lesson", currentDayIndex],
  });

  const completedDays = currentDayIndex - 1;

  // Fetch quiz completion data for more accurate tracking
  const { data: userQuizData } = useQuery<{
    totalQuizzesTaken: number;
    totalCorrectAnswers: number;
    averageScore: number;
  }>({
    queryKey: ["/api/user-quiz-stats", user?.id || 1],
    enabled: !!user,
  });

  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Calculate weekly progress
  const getCurrentWeek = (dayIndex: number) => Math.ceil(dayIndex / 7);
  const getDayInWeek = (dayIndex: number) => ((dayIndex - 1) % 7) + 1;
  const currentWeek = getCurrentWeek(currentDayIndex);
  const dayInWeek = getDayInWeek(currentDayIndex);
  const weeklyProgress = Math.round((dayInWeek / 7) * 100);

  const todaysFact = dailyFacts?.[0];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-sm">
                  HL
                </div>
                <div>
                  <h1 className="text-xl font-bold">HODLearn</h1>
                  <p className="text-xs text-zinc-400">How-to-learn BTC</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Calendar className="w-4 h-4" />
              <span>Day {currentDayIndex}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {getGreeting()}{user?.username && user.username !== 'default_user' ? `, ${user.username}` : ''}
          </h2>
          <p className="text-xl text-zinc-300 font-medium">
            {user?.currentStreak ? 
              `${user.currentStreak}-day learning streak. Keep the habit strong!` :
              "Ready to start building your learning habit?"
            }
          </p>
        </div>

        {/* Today's Focus */}
        <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center space-y-8">
              <div>
                <h3 className="text-3xl font-bold text-white mb-3">Day {currentDayIndex}</h3>
                <p className="text-lg text-zinc-300">
                  {completedDays === 0 
                    ? "Start building your daily learning habit"
                    : `${completedDays} consecutive day${completedDays === 1 ? '' : 's'} of learning`
                  }
                </p>
              </div>
              
              {/* Weekly Progress */}
              <div className="space-y-4">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-white mb-2">Week {currentWeek} Progress</h4>
                  <p className="text-zinc-400 text-sm mb-3">Day {dayInWeek} of 7 this week</p>
                </div>
                <div className="max-w-md mx-auto">
                  <Progress value={weeklyProgress} className="h-3" />
                  <div className="flex justify-between text-sm text-zinc-400 mt-2">
                    <span>Day 1</span>
                    <span className="font-medium text-orange-400">Day {dayInWeek}</span>
                    <span>Day 7</span>
                  </div>
                </div>
              </div>

              {/* Journey consistency metrics */}
              <div className="flex justify-center gap-16">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{completedDays}</div>
                  <div className="text-zinc-400">Days Learning</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{user?.currentStreak || 0}</div>
                  <div className="text-zinc-400">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{user?.longestStreak || 0}</div>
                  <div className="text-zinc-400">Best Streak</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Start Today's Learning */}
        <Card className="bg-zinc-900 border-zinc-800 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Continue Your Learning Habit</h3>
                <p className="text-zinc-400">Discipline builds conviction • Day {currentDayIndex} awaits</p>
              </div>
              
              <Button 
                onClick={() => setLocation('/learn')}
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3"
              >
                Keep Going
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Habit Building Quote */}
        {(user?.currentStreak ?? 0) > 0 && (
          <Card className="bg-orange-500/10 border-orange-500/20 shadow-lg">
            <CardContent className="p-6 text-center">
              <p className="text-orange-200 italic mb-2">
                "Small daily improvements over time lead to stunning results."
              </p>
              <p className="text-orange-300 text-sm">
                {user.currentStreak} day{user.currentStreak === 1 ? '' : 's'} of consistent learning 🔥
              </p>
            </CardContent>
          </Card>
        )}

        {/* Explore Sections */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Explore HODLearn</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Card 
              className="bg-zinc-900 border-zinc-800 cursor-pointer hover:border-orange-600/30 transition-all hover:shadow-lg"
              onClick={() => setLocation('/money')}
            >
              <CardContent className="p-6 text-center">
                <Coins className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-1">Why Bitcoin</h4>
                <p className="text-sm text-zinc-400">Understand the problem Bitcoin solves</p>
              </CardContent>
            </Card>

            <Card 
              className="bg-zinc-900 border-zinc-800 cursor-pointer hover:border-orange-600/30 transition-all hover:shadow-lg"
              onClick={() => setLocation('/simulators')}
            >
              <CardContent className="p-6 text-center">
                <Gamepad2 className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-1">Simulators</h4>
                <p className="text-sm text-zinc-400">Practice in a safe environment</p>
              </CardContent>
            </Card>
          </div>
        </div>


      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeSection="home" />
      
      {/* Bottom padding to accommodate navigation */}
      <div className="h-20"></div>
    </div>
  );
}