import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Target, Trophy, Star } from "@/lib/icons";
import type { User } from "@shared/schema";

export default function StreakCounter() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/user'],
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <div className="space-y-1">
                <div className="h-4 bg-gray-600 rounded animate-pulse w-24"></div>
                <div className="h-3 bg-gray-700 rounded animate-pulse w-16"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return null;
  }

  const currentStreak = user.currentStreak || 0;
  const bestStreak = user.bestStreak || 0;

  // Calculate next milestone and progress
  const getNextMilestone = (streak: number) => {
    if (streak < 7) return { target: 7, reward: "2,000 points", icon: Target };
    if (streak < 30) return { target: 30, reward: "10,000 points", icon: Star };
    if (streak < 365) return { target: 365, reward: "100,000 points", icon: Trophy };
    return { target: 365, reward: "Ultimate HODLer", icon: Trophy };
  };

  const nextMilestone = getNextMilestone(currentStreak);
  const progressToNext = currentStreak >= 365 ? 100 : (currentStreak / nextMilestone.target) * 100;
  const daysToNext = currentStreak >= 365 ? 0 : nextMilestone.target - currentStreak;

  const getMilestoneMarkers = () => {
    const markers = [
      { position: (7 / 365) * 100, label: "7d", reward: "2K", reached: currentStreak >= 7 },
      { position: (30 / 365) * 100, label: "30d", reward: "10K", reached: currentStreak >= 30 },
      { position: (365 / 365) * 100, label: "1yr", reward: "100K", reached: currentStreak >= 365 }
    ];
    return markers;
  };

  return (
    <Card className="w-full border border-zinc-700/50 bg-zinc-800/30">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500/20 to-red-500/10 rounded-lg border border-orange-500/30">
                <Flame className={`w-5 h-5 ${currentStreak > 0 ? 'text-orange-500 animate-pulse' : 'text-gray-500'}`} />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Learning Streak</div>
                <div className="text-xs text-gray-400">Consistency builds conviction</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-400">{currentStreak}</div>
              <div className="text-xs text-gray-500">
                {currentStreak === 1 ? 'day' : 'days'}
              </div>
            </div>
          </div>

          {/* Progress Bar with Milestones */}
          <div className="space-y-2">
            <div className="relative">
              {/* Background bar */}
              <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
                {/* Progress fill */}
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progressToNext, 100)}%` }}
                />
              </div>
              
              {/* Milestone markers */}
              {getMilestoneMarkers().map((marker, index) => (
                <div 
                  key={index}
                  className="absolute top-0 transform -translate-x-1/2"
                  style={{ left: `${marker.position}%` }}
                >
                  <div className={`w-3 h-3 rounded-full border-2 ${
                    marker.reached 
                      ? 'bg-orange-500 border-orange-400' 
                      : 'bg-zinc-700 border-zinc-600'
                  } -mt-0.5`} />
                  <div className="text-xs text-center mt-1 min-w-max">
                    <div className={`font-medium ${marker.reached ? 'text-orange-400' : 'text-gray-500'}`}>
                      {marker.label}
                    </div>
                    <div className={`text-xs ${marker.reached ? 'text-orange-300' : 'text-gray-600'}`}>
                      {marker.reward}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next milestone info */}
          {currentStreak < 365 && (
            <div className="flex items-center justify-between pt-2 border-t border-zinc-700/50">
              <div className="flex items-center gap-2">
                <nextMilestone.icon className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-gray-400">
                  Next reward: <span className="text-orange-400 font-medium">{nextMilestone.reward}</span>
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {daysToNext} {daysToNext === 1 ? 'day' : 'days'} to go
              </div>
            </div>
          )}

          {/* Best streak badge */}
          {bestStreak > currentStreak && (
            <div className="flex items-center justify-center pt-1">
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                <Trophy className="w-3 h-3 mr-1" />
                Best: {bestStreak} days
              </Badge>
            </div>
          )}

          {/* Achievement message */}
          {currentStreak >= 365 && (
            <div className="text-center py-2">
              <div className="text-orange-400 font-medium text-sm animate-pulse">
                🏆 Ultimate HODLer Achieved! 🏆
              </div>
              <div className="text-xs text-gray-400 mt-1">
                You've mastered Bitcoin learning consistency
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}