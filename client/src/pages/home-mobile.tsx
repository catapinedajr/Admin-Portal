import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Bitcoin, 
  Lightbulb, 
  BookOpen, 
  TrendingUp,
  GraduationCap,
  Clock,
  Calendar,
  Target
} from "lucide-react";

// Mobile-optimized home component
export default function MobileHome() {
  const [, setLocation] = useLocation();
  const [currentDay, setCurrentDay] = useState(1);
  const [user, setUser] = useState(null);

  // Simple data fetching without complex hooks
  useEffect(() => {
    async function loadData() {
      try {
        // Get user data
        const userResponse = await fetch('/api/user', { credentials: 'include' });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }

        // Get current day
        const dayResponse = await fetch('/api/next-available-day/1', { credentials: 'include' });
        if (dayResponse.ok) {
          const dayData = await dayResponse.json();
          setCurrentDay(dayData.dayIndex || 1);
        }
      } catch (error) {
        console.log('Data loading error (non-critical):', error);
      }
    }

    loadData();
  }, []);

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
      {/* Simple Header */}
      <div className="bg-zinc-800 border-b border-zinc-700 p-4">
        <div className="flex items-center justify-center space-x-3">
          <Bitcoin className="h-8 w-8 text-orange-500" />
          <h1 className="text-2xl font-bold">HODLearn</h1>
        </div>
      </div>

      <div className="p-6">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">{greeting}</h2>
          <p className="text-gray-400">Building Bitcoin knowledge daily</p>
        </div>

        {/* Progress Dashboard */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <div className="text-3xl font-bold">Day {currentDay}</div>
              <div className="text-gray-400">Your Bitcoin Learning Journey</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation */}
        <div className="space-y-4 mb-8">
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-6">
              <button 
                onClick={() => setLocation('/learn')}
                className="w-full text-left flex items-center space-x-4"
              >
                <BookOpen className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-xl font-semibold">Today's Learning</div>
                  <div className="text-gray-400">Continue your Bitcoin education</div>
                </div>
              </button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-6">
              <button 
                onClick={() => setLocation('/simulators')}
                className="w-full text-left flex items-center space-x-4"
              >
                <GraduationCap className="h-8 w-8 text-purple-500" />
                <div>
                  <div className="text-xl font-semibold">Practice Center</div>
                  <div className="text-gray-400">Interactive Bitcoin simulations</div>
                </div>
              </button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-6">
              <button 
                onClick={() => setLocation('/money')}
                className="w-full text-left flex items-center space-x-4"
              >
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-xl font-semibold">Money & Finance</div>
                  <div className="text-gray-400">Understanding inflation & Bitcoin</div>
                </div>
              </button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-6">
              <button 
                onClick={() => setLocation('/more')}
                className="w-full text-left flex items-center space-x-4"
              >
                <Lightbulb className="h-8 w-8 text-yellow-500" />
                <div>
                  <div className="text-xl font-semibold">Resources & More</div>
                  <div className="text-gray-400">Books, videos, inspiration</div>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Primary Action */}
        <div className="text-center mb-8">
          <Button 
            onClick={() => setLocation('/learn')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold w-full"
          >
            Start Day {currentDay}
          </Button>
        </div>

        {/* Brand Message */}
        <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-6 text-center">
          <div className="text-gray-300 text-lg mb-2">
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