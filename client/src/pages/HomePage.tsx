import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { 
  BookOpen, 
  TrendingUp, 
  User as UserIcon,
  Lightbulb,
  Coins,
  Calendar,
  Clock,
  CheckCircle,
  Target,
  Flame,
  Trophy,
  PlayCircle,
  Brain,
  Star,
  ArrowRight,
  BarChart3,
  GraduationCap
} from "lucide-react";
import { useAppContext } from "@/components/shared/AppContextProvider";
import type { User } from "@shared/schema";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { isPremiumTier, setShowEmailModal } = useAppContext();
  
  // Get user data for personalized dashboard
  const { data: user } = useQuery<User>({
    queryKey: ['/api/user'],
  });

  // Get user progress data
  const { data: userProgress } = useQuery({
    queryKey: ['/api/user-progress', user?.id],
    enabled: !!user?.id,
  });

  // Get next available day
  const { data: nextDay } = useQuery({
    queryKey: ['/api/next-available-day', user?.id],
    enabled: !!user?.id,
  });

  // Get completed days count
  const { data: completedDaysData } = useQuery({
    queryKey: ['/api/completed-days-count', user?.id],
    enabled: !!user?.id,
  });

  // Get current day content for preview
  const { data: dayMetadata } = useQuery({
    queryKey: ['/api/day-metadata', currentDay],
    enabled: !!currentDay && currentDay > 0,
  });

  const { data: dailyFacts } = useQuery({
    queryKey: ['/api/daily-facts', currentDay],
    enabled: !!currentDay && currentDay > 0,
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

  const completedDays = completedDaysData?.count || 0;
  const currentDay = nextDay?.dayIndex || 1;
  const progressPercentage = Math.round((completedDays / 180) * 100);
  
  // Calculate streak
  const currentStreak = userProgress?.currentStreak || 0;
  const bestStreak = userProgress?.bestStreak || 0;

  const getStreakMessage = () => {
    if (currentStreak === 0) return "Start your learning journey today";
    if (currentStreak < 3) return "Keep the momentum going";
    if (currentStreak < 7) return "Building a strong habit";
    if (currentStreak < 14) return "Discipline builds conviction";
    if (currentStreak < 30) return "You're developing real discipline";
    return "Bitcoin conviction through daily learning";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-white">{greeting}</h2>
        <div className="space-y-2">
          <p className="text-xl text-zinc-300">Understanding Bitcoin takes time</p>
          <p className="text-xl text-zinc-300">Building conviction takes discipline</p>
          <p className="text-xl text-orange-500 font-semibold">This is HODLearn</p>
        </div>
      </div>

      {/* Learning Streak Widget */}
      <Card className="bg-zinc-900/50 border-zinc-800 max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Learning Streak</h3>
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-zinc-400">Current</span>
              <span className="text-lg font-bold text-orange-500">{currentStreak} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-zinc-400">Best</span>
              <span className="text-lg font-bold text-white">{bestStreak} days</span>
            </div>
            <p className="text-xs text-zinc-500 mt-2">{getStreakMessage()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Today's Learning Card */}
      <Card className="bg-gradient-to-r from-orange-900/20 to-zinc-900/50 border-orange-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Day {currentDay}: {dayMetadata?.title || "Bitcoin Learning"}
                </h3>
                <p className="text-sm text-zinc-400">
                  {dailyFacts?.[0]?.title || "Continue your Bitcoin education"}
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setLocation('/learn')}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Start Learning
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-orange-500" />
              <span className="text-zinc-300">Daily Facts</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-orange-500" />
              <span className="text-zinc-300">Lesson Content</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-orange-500" />
              <span className="text-zinc-300">Knowledge Quiz</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="bg-zinc-900/50 border-zinc-800 hover:border-orange-500/50 transition-colors cursor-pointer"
          onClick={() => setLocation('/learn')}
        >
          <CardHeader className="text-center">
            <BookOpen className="w-12 h-12 text-orange-500 mx-auto mb-2" />
            <CardTitle className="text-white">Learn Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-400 text-sm text-center">
              Daily Bitcoin facts, lessons, and quizzes
            </p>
          </CardContent>
        </Card>

        <Card 
          className="bg-zinc-900/50 border-zinc-800 hover:border-orange-500/50 transition-colors cursor-pointer"
          onClick={() => setLocation('/money')}
        >
          <CardHeader className="text-center">
            <TrendingUp className="w-12 h-12 text-orange-500 mx-auto mb-2" />
            <CardTitle className="text-white">Money</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-400 text-sm text-center">
              Learn about inflation and financial systems
            </p>
          </CardContent>
        </Card>

        <Card 
          className="bg-zinc-900/50 border-zinc-800 hover:border-orange-500/50 transition-colors cursor-pointer"
          onClick={() => setLocation('/simulators')}
        >
          <CardHeader className="text-center">
            <Lightbulb className="w-12 h-12 text-orange-500 mx-auto mb-2" />
            <CardTitle className="text-white">Simulators</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-400 text-sm text-center">
              Interactive Bitcoin learning simulations
            </p>
            {!isPremiumTier && (
              <Badge className="mt-2 w-full bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                Premium Feature
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card 
          className="bg-zinc-900/50 border-zinc-800 hover:border-orange-500/50 transition-colors cursor-pointer"
          onClick={() => setLocation('/more')}
        >
          <CardHeader className="text-center">
            <UserIcon className="w-12 h-12 text-orange-500 mx-auto mb-2" />
            <CardTitle className="text-white">More</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-400 text-sm text-center">
              Stories, glossary, and additional resources
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Premium Upgrade Section */}
      {!isPremiumTier && (
        <Card className="bg-gradient-to-r from-orange-950/30 to-zinc-900/50 border-orange-500/30">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Unlock Premium Features</h3>
              <p className="text-zinc-300">
                Get access to interactive simulators, advanced tracking, and exclusive content
              </p>
              <Button 
                onClick={() => setShowEmailModal(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8"
              >
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}