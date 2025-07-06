import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PWAInstallButton from "@/components/PWAInstallButton";
import { 
  Bitcoin, 
  Lightbulb, 
  BookOpen, 
  TrendingUp,
  GraduationCap,
  BarChart3,
  Clock,
  Calendar,
  Target,
  Crown,
  Gem,
  Plus
} from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

// Mobile-optimized home component with identical UX
export default function MobileHome() {
  const [, setLocation] = useLocation();
  const { isPremiumTier } = useSubscription();

  // Essential data fetching for home dashboard
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  });

  const { data: nextDayData } = useQuery({
    queryKey: ['/api/next-available-day', 1],
  });

  // Get user progress data
  const { data: dayCompleted = false } = useQuery({
    queryKey: ['/api/day-completed', 1, nextDayData?.dayIndex || 1],
    enabled: !!nextDayData?.dayIndex,
  });

  const currentDay = nextDayData?.dayIndex || 1;

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good night";
  };

  const userName = user?.firstName || "";
  const greeting = userName ? `${getTimeBasedGreeting()}, ${userName}!` : getTimeBasedGreeting();

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Header with navigation */}
      <div className="bg-zinc-800 border-b border-zinc-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bitcoin className="h-8 w-8 text-orange-500" />
              <h1 className="text-xl font-bold">HODLearn</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <PWAInstallButton />
              {isPremiumTier ? (
                <div className="flex items-center space-x-1 bg-orange-500 text-white px-2 py-1 rounded text-xs">
                  <Crown className="h-3 w-3" />
                  <span>Premium</span>
                </div>
              ) : (
                <button
                  onClick={() => setLocation('/more')}
                  className="flex items-center space-x-1 bg-zinc-700 hover:bg-zinc-600 text-white px-2 py-1 rounded text-xs transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  <span>Upgrade</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">{greeting}</h2>
          <p className="text-gray-400">Building Bitcoin knowledge daily</p>
        </div>

        {/* Progress Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-orange-500 mx-auto mb-3" />
              <div className="text-2xl font-bold">Day {currentDay}</div>
              <div className="text-sm text-gray-400">Current Learning Day</div>
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <div className="text-2xl font-bold">{dayCompleted ? "Complete" : "Active"}</div>
              <div className="text-sm text-gray-400">Today's Status</div>
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <div className="text-2xl font-bold">180</div>
              <div className="text-sm text-gray-400">Day Journey</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-zinc-800 border-zinc-700 hover:bg-zinc-750 transition-colors group cursor-pointer">
            <CardContent className="p-6">
              <button 
                onClick={() => setLocation('/learn')}
                className="w-full text-left"
              >
                <div className="flex items-center space-x-4 mb-3">
                  <BookOpen className="h-8 w-8 text-blue-500 group-hover:text-blue-400 transition-colors" />
                  <div>
                    <div className="text-lg font-semibold">Today's Learning</div>
                    <div className="text-sm text-gray-400">Day {currentDay} • {dayCompleted ? "Complete" : "Available"}</div>
                  </div>
                </div>
                <div className="text-gray-300 text-sm">
                  Continue your Bitcoin education journey with today's lesson, facts, and quiz.
                </div>
              </button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800 border-zinc-700 hover:bg-zinc-750 transition-colors group cursor-pointer">
            <CardContent className="p-6">
              <button 
                onClick={() => setLocation('/simulators')}
                className="w-full text-left"
              >
                <div className="flex items-center space-x-4 mb-3">
                  <GraduationCap className="h-8 w-8 text-purple-500 group-hover:text-purple-400 transition-colors" />
                  <div>
                    <div className="text-lg font-semibold">Practice Center</div>
                    <div className="text-sm text-gray-400">Interactive Simulators</div>
                  </div>
                </div>
                <div className="text-gray-300 text-sm">
                  Hands-on Bitcoin simulations: wallets, transactions, safety training.
                </div>
              </button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800 border-zinc-700 hover:bg-zinc-750 transition-colors group cursor-pointer">
            <CardContent className="p-6">
              <button 
                onClick={() => setLocation('/money')}
                className="w-full text-left"
              >
                <div className="flex items-center space-x-4 mb-3">
                  <TrendingUp className="h-8 w-8 text-green-500 group-hover:text-green-400 transition-colors" />
                  <div>
                    <div className="text-lg font-semibold">Money & Finance</div>
                    <div className="text-sm text-gray-400">Understanding Economics</div>
                  </div>
                </div>
                <div className="text-gray-300 text-sm">
                  Explore inflation, money supply, and why Bitcoin matters for your future.
                </div>
              </button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800 border-zinc-700 hover:bg-zinc-750 transition-colors group cursor-pointer">
            <CardContent className="p-6">
              <button 
                onClick={() => setLocation('/more')}
                className="w-full text-left"
              >
                <div className="flex items-center space-x-4 mb-3">
                  <Lightbulb className="h-8 w-8 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
                  <div>
                    <div className="text-lg font-semibold">Resources & More</div>
                    <div className="text-sm text-gray-400">Books, Videos, Inspiration</div>
                  </div>
                </div>
                <div className="text-gray-300 text-sm">
                  Deep dive into Bitcoin literature, thought leaders, and conviction building.
                </div>
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Primary Action */}
        <div className="text-center mb-8">
          <Button 
            onClick={() => setLocation('/learn')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold"
          >
            {dayCompleted ? `Continue to Day ${currentDay + 1}` : `Start Day ${currentDay}`}
          </Button>
        </div>

        {/* Brand Message */}
        <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-lg border border-zinc-600 p-6 text-center">
          <div className="text-gray-300 text-lg leading-relaxed mb-2">
            Understanding Bitcoin takes time,<br />
            Building conviction takes consistency
          </div>
          <div className="text-orange-500 font-bold text-xl">
            This is HODLearn
          </div>
        </div>
      </div>
    </div>
  );
}