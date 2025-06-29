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
                  H₿
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

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">
            {getGreeting()}! Ready to continue your Bitcoin journey?
          </h2>
          <p className="text-zinc-400">
            {user?.currentStreak ? 
              `You're on a ${user.currentStreak}-day streak. Keep building momentum!` :
              "Take the next step in understanding Bitcoin."
            }
          </p>
        </div>

        {/* Knowledge Accumulation Tracker */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Knowledge Accumulation</h3>
                <p className="text-sm text-zinc-400">Small daily gains compound into mastery</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-400">{completedDays}/30</div>
                <div className="text-xs text-zinc-400">days completed</div>
              </div>
            </div>
            
            {/* Cumulative Learning Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-600/10 rounded-lg border border-blue-600/20">
                <div className="text-2xl font-bold text-blue-400">{completedDays * 1}</div>
                <div className="text-xs text-zinc-400 mt-1">Facts Learned</div>
                <div className="text-xs text-blue-300 mt-1">+1 daily</div>
              </div>
              <div className="text-center p-3 bg-green-600/10 rounded-lg border border-green-600/20">
                <div className="text-2xl font-bold text-green-400">{completedDays * 1}</div>
                <div className="text-xs text-zinc-400 mt-1">Lessons Completed</div>
                <div className="text-xs text-green-300 mt-1">+1 daily</div>
              </div>
              <div className="text-center p-3 bg-purple-600/10 rounded-lg border border-purple-600/20">
                <div className="text-2xl font-bold text-purple-400">{completedDays * 6}</div>
                <div className="text-xs text-zinc-400 mt-1">Questions Answered</div>
                <div className="text-xs text-purple-300 mt-1">+6 daily</div>
              </div>
            </div>

            {/* Progress visualization */}
            <div className="space-y-3">
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Started learning</span>
                <span className="text-orange-400 font-medium">{Math.round(progressPercentage)}% to mastery</span>
                <span className="text-zinc-400">Bitcoin expert</span>
              </div>
            </div>

            {/* Shavings Philosophy */}
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-600/20 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-orange-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white mb-1">
                    {completedDays === 0 ? "Every expert was once a beginner" :
                     completedDays < 7 ? "Small steps, big progress ahead" :
                     completedDays < 14 ? "Momentum building, knowledge growing" :
                     completedDays < 21 ? "Habits forming, understanding deepening" :
                     completedDays < 30 ? "Almost there - expertise within reach" :
                     "Bitcoin mastery achieved through consistency"}
                  </div>
                  <div className="text-xs text-zinc-400">
                    Each day's learning builds on the last - {30 - completedDays} more days to complete mastery
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement badges */}
            {user?.currentStreak && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-800">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-zinc-300">
                  {user.currentStreak >= 7 ? "Week Warrior" : 
                   user.currentStreak >= 3 ? "Momentum Builder" : 
                   "Journey Starter"}
                </span>
                <Badge variant="outline" className="border-yellow-600 text-yellow-400">
                  {user.currentStreak} day streak
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Continue Learning Section */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-400" />
                Continue Your Journey
              </CardTitle>
              <Button 
                onClick={() => setLocation('/learn')}
                size="sm"
                className="bg-orange-500 hover:bg-orange-600"
              >
                Start Day {currentDayIndex}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Today's Preview */}
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-600/20 rounded-lg">
                  <Coins className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">
                    {todaysFact?.title || "Today's Bitcoin Learning"}
                  </h4>
                  <p className="text-zinc-300 text-sm mb-2">
                    {todaysFact?.content?.substring(0, 120)}...
                  </p>
                  <div className="flex items-center gap-4 text-xs text-zinc-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{lesson?.estimatedReadTime || 3} min read</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      <span>Interactive lesson</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning path preview */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-orange-600/10 rounded border border-orange-600/20">
                <div className="font-medium text-orange-300">1. Facts</div>
                <div className="text-zinc-400">Essential knowledge</div>
              </div>
              <div className="text-center p-2 bg-blue-600/10 rounded border border-blue-600/20">
                <div className="font-medium text-blue-300">2. Lesson</div>
                <div className="text-zinc-400">Deep understanding</div>
              </div>
              <div className="text-center p-2 bg-green-600/10 rounded border border-green-600/20">
                <div className="font-medium text-green-300">3. Quiz</div>
                <div className="text-zinc-400">Test knowledge</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Learn Section */}
          <Card 
            className="bg-zinc-900 border-zinc-800 cursor-pointer hover:border-orange-600/50 transition-colors"
            onClick={() => setLocation('/learn')}
          >
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white mb-1">Learn</h3>
              <p className="text-xs text-zinc-400">Daily lessons & reference</p>
            </CardContent>
          </Card>

          {/* Finance Section */}
          <Card 
            className="bg-zinc-900 border-zinc-800 cursor-pointer hover:border-blue-600/50 transition-colors"
            onClick={() => setLocation('/finance')}
          >
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white mb-1">Finance</h3>
              <p className="text-xs text-zinc-400">Why Bitcoin matters</p>
            </CardContent>
          </Card>

          {/* Simulators Section */}
          <Card 
            className="bg-zinc-900 border-zinc-800 cursor-pointer hover:border-green-600/50 transition-colors"
            onClick={() => setLocation('/simulators')}
          >
            <CardContent className="p-4 text-center">
              <Gamepad2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white mb-1">Simulators</h3>
              <p className="text-xs text-zinc-400">Practice safely</p>
            </CardContent>
          </Card>

          {/* More Section */}
          <Card 
            className="bg-zinc-900 border-zinc-800 cursor-pointer hover:border-purple-600/50 transition-colors"
            onClick={() => setLocation('/more')}
          >
            <CardContent className="p-4 text-center">
              <MoreHorizontal className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white mb-1">More</h3>
              <p className="text-xs text-zinc-400">Tools & resources</p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Simulators */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-400" />
              Practice Your Knowledge
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* DCA Simulator */}
            <div 
              className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors"
              onClick={() => setLocation('/simulators/dca')}
            >
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-green-400" />
                <div>
                  <div className="font-medium text-white">DCA Calculator</div>
                  <div className="text-xs text-zinc-400">See dollar-cost averaging results</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </div>

            {/* HODL Simulator */}
            <div 
              className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors"
              onClick={() => setLocation('/simulators/hodl')}
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                <div>
                  <div className="font-medium text-white">HODL Challenge</div>
                  <div className="text-xs text-zinc-400">Test long-term strategies</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </div>

            {/* Security Training */}
            <div 
              className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors"
              onClick={() => setLocation('/simulators/safety')}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="font-medium text-white">Security Training</div>
                  <div className="text-xs text-zinc-400">Learn to stay safe</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </div>
          </CardContent>
        </Card>

        {/* Daily Bitcoin Insight */}
        <Card className="bg-gradient-to-r from-orange-900/20 to-yellow-900/20 border-orange-700/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-600/20 rounded-lg">
                <Coins className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Did you know?</h3>
                <p className="text-zinc-300 text-sm">
                  Bitcoin has a fixed supply of 21 million coins, making it the first truly scarce digital asset in human history.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}