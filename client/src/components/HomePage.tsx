import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  BookOpen, 
  TrendingUp,
  Zap,
  ArrowRight,
  Calendar,
  Flag
} from "lucide-react";

export default function HomePage() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
  });

  const { data: nextDay } = useQuery({
    queryKey: ["/api/next-available-day", user?.id],
    enabled: !!user?.id,
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const getTimeBasedGreeting = (time: Date) => {
    const hour = time.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";  
    if (hour < 21) return "Good evening";
    return "Good night";
  };

  const getPersonalizedWelcome = () => {
    const greeting = getTimeBasedGreeting(currentTime);
    if (user?.firstName) {
      return `${greeting}, ${user.firstName}!`;
    }
    return `${greeting}!`;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              HL
            </div>
            <div>
              <div className="font-bold text-lg text-zinc-900 dark:text-zinc-100">HODLearn</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">How-to-learn BTC</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            {getPersonalizedWelcome()}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Ready to continue your Bitcoin journey?
          </p>
        </div>

        {/* Progress Section */}
        {nextDay && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                <span>Your Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    Day {nextDay.dayIndex}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    of your Bitcoin journey
                  </div>
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Continue Learning
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Access Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <span>Learn</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Daily Bitcoin lessons and facts
              </p>
              <Button variant="outline" className="w-full">
                Start Learning
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-purple-500" />
                <span>Simulators</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Practice with interactive tools
              </p>
              <Button variant="outline" className="w-full">
                Explore Tools
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Daily Insight */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <span>Today's Insight</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-700 dark:text-zinc-300 italic">
              "The best time to plant a tree was 20 years ago. The second best time is now. 
              The same is true for learning about Bitcoin."
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}