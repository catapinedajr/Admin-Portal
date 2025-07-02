import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { BookOpen, TrendingUp, Calculator, MoreHorizontal } from "lucide-react";

export default function HomeProduction() {
  const { user, isLoading: userLoading } = useAuth();
  
  const { data: nextDay } = useQuery({
    queryKey: ["/api/next-available-day", user?.id],
    enabled: !!user?.id,
  });

  const { data: dayCompleted } = useQuery({
    queryKey: ["/api/day-completed", user?.id, nextDay?.dayIndex],
    enabled: !!user?.id && !!nextDay?.dayIndex,
  });

  const { data: dayMetadata } = useQuery({
    queryKey: ["/api/day-metadata", nextDay?.dayIndex],
    enabled: !!nextDay?.dayIndex,
  });

  if (userLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading your Bitcoin journey...</p>
        </div>
      </div>
    );
  }

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good night";
  };

  const currentDay = nextDay?.dayIndex || 1;
  const progressPercentage = Math.round((currentDay / 180) * 100);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center font-bold text-sm">
              HL
            </div>
            <span className="font-semibold text-lg">HODLearn</span>
          </div>
          <div className="text-sm text-zinc-400">
            {user?.firstName && `${getTimeBasedGreeting()}, ${user.firstName}!`}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            {getTimeBasedGreeting()}{user?.firstName ? `, ${user.firstName}` : ''}!
          </h1>
          <p className="text-xl text-zinc-300">
            Day {currentDay} of your Bitcoin journey
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Your Journey Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-300">180-Day Curriculum</span>
              <span className="text-orange-500 font-semibold">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="text-sm text-zinc-400">
              {dayCompleted ? 
                "Day complete! Come back tomorrow for the next lesson." :
                "Ready to continue learning today?"
              }
            </div>
          </CardContent>
        </Card>

        {/* Today's Learning */}
        {dayMetadata && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-orange-500" />
                Today's Topic
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold text-orange-500">
                {dayMetadata.title}
              </h3>
              <div className="flex gap-4">
                <Link href="/learn" className="flex-1">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    {dayCompleted ? "Review Today's Lesson" : "Start Learning"}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/finance">
            <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center space-y-3">
                <TrendingUp className="w-8 h-8 text-orange-500 mx-auto" />
                <h3 className="font-semibold text-white">Why Bitcoin?</h3>
                <p className="text-sm text-zinc-400">
                  Understand why Bitcoin matters for your financial future
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/simulators">
            <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center space-y-3">
                <Calculator className="w-8 h-8 text-orange-500 mx-auto" />
                <h3 className="font-semibold text-white">Simulators</h3>
                <p className="text-sm text-zinc-400">
                  Practice with safe, interactive Bitcoin tools
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/more">
            <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center space-y-3">
                <MoreHorizontal className="w-8 h-8 text-orange-500 mx-auto" />
                <h3 className="font-semibold text-white">More</h3>
                <p className="text-sm text-zinc-400">
                  Explore additional resources and tools
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}