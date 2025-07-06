import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { 
  Bitcoin, 
  Lightbulb, 
  BookOpen, 
  TrendingUp, 
  User as UserIcon,
  Crown,
  Gem,
  Plus
} from "lucide-react";
import PWAInstallButton from "@/components/PWAInstallButton";

export default function HomePage() {
  const [, setLocation] = useLocation();
  
  // Get user data for personalized welcome
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  });

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good night";
  };

  const greeting = user?.firstName 
    ? `${getTimeBasedGreeting()}, ${user.firstName}!`
    : getTimeBasedGreeting();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="bg-zinc-900/50 border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bitcoin className="w-8 h-8 text-orange-500" />
            <div>
              <h1 className="text-xl font-bold">HODLearn</h1>
              <p className="text-xs text-zinc-400">Build Bitcoin conviction through daily learning</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <PWAInstallButton />
            <Badge variant="outline" className="text-orange-500 border-orange-500/30">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{greeting}</h2>
          <p className="text-xl text-zinc-300 mb-2">Understanding Bitcoin takes time</p>
          <p className="text-xl text-zinc-300 mb-2">Building conviction takes consistency</p>
          <p className="text-xl text-orange-500 font-semibold">This is HODLearn</p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card 
            className="bg-zinc-900/50 border-zinc-800 hover:border-orange-500/50 transition-colors cursor-pointer"
            onClick={() => setLocation('/learn')}
          >
            <CardHeader className="text-center">
              <BookOpen className="w-12 h-12 text-orange-500 mx-auto mb-2" />
              <CardTitle className="text-white">Learn Today</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-zinc-400 text-sm">Daily facts, lessons, and quizzes to build your Bitcoin foundation</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-zinc-900/50 border-zinc-800 hover:border-orange-500/50 transition-colors cursor-pointer"
            onClick={() => setLocation('/money')}
          >
            <CardHeader className="text-center">
              <TrendingUp className="w-12 h-12 text-orange-500 mx-auto mb-2" />
              <CardTitle className="text-white">Money & Finance</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-zinc-400 text-sm">Understand inflation, settlement, and why Bitcoin fixes money</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-zinc-900/50 border-zinc-800 hover:border-orange-500/50 transition-colors cursor-pointer"
            onClick={() => setLocation('/simulators')}
          >
            <CardHeader className="text-center">
              <Lightbulb className="w-12 h-12 text-orange-500 mx-auto mb-2" />
              <CardTitle className="text-white">Practice & Simulate</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-zinc-400 text-sm">Interactive simulators for safety, wallets, and Bitcoin strategies</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-zinc-900/50 border-zinc-800 hover:border-orange-500/50 transition-colors cursor-pointer"
            onClick={() => setLocation('/more')}
          >
            <CardHeader className="text-center">
              <UserIcon className="w-12 h-12 text-orange-500 mx-auto mb-2" />
              <CardTitle className="text-white">More Resources</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-zinc-400 text-sm">Community stories, recommended books, and additional tools</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        {user && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-orange-500">{user.currentStreak || 0}</div>
                <div className="text-zinc-400">Current Streak</div>
              </CardContent>
            </Card>
            
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-orange-500">{user.longestStreak || 0}</div>
                <div className="text-zinc-400">Longest Streak</div>
              </CardContent>
            </Card>
            
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-orange-500">{user.completedLessons || 0}</div>
                <div className="text-zinc-400">Lessons Completed</div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}