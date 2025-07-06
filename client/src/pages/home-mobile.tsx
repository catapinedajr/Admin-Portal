import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bitcoin, 
  Lightbulb, 
  BookOpen, 
  TrendingUp,
  GraduationCap,
  BarChart3,
  Clock
} from "lucide-react";

// Lightweight mobile-optimized home component
export default function MobileHome() {
  const [, setLocation] = useLocation();

  // Minimal data fetching for mobile performance
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  });

  const { data: nextDayData } = useQuery({
    queryKey: ['/api/next-available-day', 1],
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
    <div className="min-h-screen bg-zinc-900 text-white p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Bitcoin className="h-8 w-8 text-orange-500" />
            <h1 className="text-2xl font-bold">HODLearn</h1>
          </div>
        </div>
        
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold mb-2">{greeting}</h2>
          <p className="text-gray-400">Your Bitcoin education journey</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-zinc-800 border-zinc-700">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-orange-500 mx-auto mb-2" />
            <div className="text-lg font-bold">Day {currentDay}</div>
            <div className="text-sm text-gray-400">Current Progress</div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-800 border-zinc-700">
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <div className="text-lg font-bold">Learning</div>
            <div className="text-sm text-gray-400">Building Conviction</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Navigation */}
      <div className="space-y-4">
        <Card className="bg-zinc-800 border-zinc-700 hover:bg-zinc-750 transition-colors">
          <CardContent className="p-4">
            <button 
              onClick={() => setLocation('/learn')}
              className="w-full text-left flex items-center space-x-3"
            >
              <BookOpen className="h-6 w-6 text-blue-500" />
              <div>
                <div className="font-semibold">Today's Learning</div>
                <div className="text-sm text-gray-400">Continue your Bitcoin education</div>
              </div>
            </button>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700 hover:bg-zinc-750 transition-colors">
          <CardContent className="p-4">
            <button 
              onClick={() => setLocation('/simulators')}
              className="w-full text-left flex items-center space-x-3"
            >
              <GraduationCap className="h-6 w-6 text-purple-500" />
              <div>
                <div className="font-semibold">Practice Simulators</div>
                <div className="text-sm text-gray-400">Interactive Bitcoin learning</div>
              </div>
            </button>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700 hover:bg-zinc-750 transition-colors">
          <CardContent className="p-4">
            <button 
              onClick={() => setLocation('/money')}
              className="w-full text-left flex items-center space-x-3"
            >
              <TrendingUp className="h-6 w-6 text-green-500" />
              <div>
                <div className="font-semibold">Money & Finance</div>
                <div className="text-sm text-gray-400">Understanding inflation & Bitcoin</div>
              </div>
            </button>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700 hover:bg-zinc-750 transition-colors">
          <CardContent className="p-4">
            <button 
              onClick={() => setLocation('/more')}
              className="w-full text-left flex items-center space-x-3"
            >
              <Lightbulb className="h-6 w-6 text-yellow-500" />
              <div>
                <div className="font-semibold">More Resources</div>
                <div className="text-sm text-gray-400">Books, videos, and inspiration</div>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="mt-8 text-center">
        <Button 
          onClick={() => setLocation('/learn')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
        >
          Start Learning Today
        </Button>
      </div>

      {/* Motivational Quote */}
      <div className="mt-6 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
        <div className="text-center text-gray-300 italic">
          "Understanding Bitcoin takes time, Building conviction takes consistency"
        </div>
        <div className="text-center text-orange-500 font-semibold mt-2">
          This is HODLearn
        </div>
      </div>
    </div>
  );
}