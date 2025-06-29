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

  // Calculate progress percentage (out of 30 days)
  const progressPercentage = Math.min(((currentDayIndex - 1) / 30) * 100, 100);
  const completedDays = currentDayIndex - 1;

  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

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
              `${user.currentStreak}-day streak active. Keep building momentum!` :
              "Ready to continue your Bitcoin journey?"
            }
          </p>
        </div>

        {/* Today's Focus */}
        <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center space-y-8">
              <div>
                <h3 className="text-3xl font-bold text-white mb-3">Day {completedDays + 1} of 30</h3>
                <p className="text-lg text-zinc-300">Continue building your Bitcoin knowledge</p>
              </div>
              
              {/* Clean progress circle */}
              <div className="flex justify-center">
                <div className="w-40 h-40 relative">
                  <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="rgb(39 39 42)"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="rgb(249 115 22)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - progressPercentage / 100)}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-400">{Math.round(progressPercentage)}%</div>
                      <div className="text-sm text-zinc-400">Complete</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Simple stats */}
              <div className="flex justify-center gap-12">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{completedDays * 3}</div>
                  <div className="text-zinc-400">Facts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{completedDays}</div>
                  <div className="text-zinc-400">Lessons</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{completedDays * 6}</div>
                  <div className="text-zinc-400">Quizzes</div>
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
                <h3 className="text-xl font-bold text-white mb-2">Ready for Day {currentDayIndex}?</h3>
                <p className="text-zinc-400">3 facts • 1 lesson • 6 quiz questions</p>
              </div>
              
              <Button 
                onClick={() => setLocation('/learn')}
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3"
              >
                Start Learning
              </Button>
            </div>
          </CardContent>
        </Card>

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