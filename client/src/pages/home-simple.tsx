import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  TrendingUp, 
  Gamepad2,
  BarChart3,
  ArrowRight,
  Target,
  Zap
} from "lucide-react";
import type { User } from "@shared/schema";
import BottomNavigation from "@/components/BottomNavigation";
import HomeHeader from "@/components/home/HomeHeader";
import { useSubscription } from "@/contexts/SubscriptionContext";

export default function Home() {
  const [, setLocation] = useLocation();
  const subscriptionContext = useSubscription();
  const isPremium = false; // Simplified for now
  
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const { data: userProgress } = useQuery({
    queryKey: ["/api/user-progress", user?.id],
    enabled: !!user?.id,
  });

  const { data: nextDay } = useQuery({
    queryKey: ["/api/next-available-day", user?.id],
    enabled: !!user?.id,
  });

  if (userLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading your Bitcoin journey...</p>
        </div>
      </div>
    );
  }

  // const isPremium = subscription?.tier === 'premium';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <HomeHeader user={user} isPremium={isPremium} />
      
      <main className="p-4 pb-20">
        {/* Quick Progress Overview */}
        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Your Progress</h2>
              <Badge variant="outline" className="border-orange-600 text-orange-400">
                Day {(nextDay as any)?.dayIndex || 1}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {(userProgress as any)?.currentStreak || 0}
                </div>
                <p className="text-sm text-zinc-400">Current Streak</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {(userProgress as any)?.bestStreak || 0}
                </div>
                <p className="text-sm text-zinc-400">Best Streak</p>
              </div>
            </div>

            <Button 
              onClick={() => setLocation("/learn")}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              Continue Learning
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors"
            onClick={() => setLocation("/learn")}
          >
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Learn</h3>
              <p className="text-xs text-zinc-400">Daily Bitcoin lessons</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors"
            onClick={() => setLocation("/finance")}
          >
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Why BTC</h3>
              <p className="text-xs text-zinc-400">See why Bitcoin matters</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors"
            onClick={() => setLocation("/simulators")}
          >
            <CardContent className="p-4 text-center">
              <Gamepad2 className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Simulators</h3>
              <p className="text-xs text-zinc-400">Practice Bitcoin concepts</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-zinc-900 border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors"
            onClick={() => setLocation("/more")}
          >
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">More</h3>
              <p className="text-xs text-zinc-400">Tools & resources</p>
            </CardContent>
          </Card>
        </div>

        {/* Daily Motivation */}
        <Card className="bg-zinc-900 border-zinc-800 mt-6">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-orange-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Today's Focus</h3>
            <p className="text-zinc-400 text-sm mb-4">
              Every Bitcoin journey begins with a single step. Keep building your understanding, one day at a time.
            </p>
            <div className="flex items-center justify-center gap-2 text-orange-500">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Consistency builds conviction</span>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
}