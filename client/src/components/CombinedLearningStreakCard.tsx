import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { 
  Flame, 
  Trophy, 
  Target, 
  Zap, 
  Crown,
  ChevronRight,
  Star,
  ArrowRight,
  TrendingUp
} from "@/lib/icons";
import type { User } from "@shared/schema";

interface WalletData {
  totalSatoshisEarned: number;
  totalUsdValue: number;
  currentBitcoinPrice: number;
  currentStreakMultiplier: number;
  lastEarningDate: string;
  recentEarnings: any[];
  achievements: any[];
  weeklyEarnings: number;
  monthlyEarnings: number;
  currentStreak?: number;
  bestStreak?: number;
}

interface CombinedLearningStreakCardProps {
  currentDayIndex: number;
  dayMetadata?: { title: string };
  dailyFacts?: Array<{ title: string }>;
}

export default function CombinedLearningStreakCard({ 
  currentDayIndex, 
  dayMetadata, 
  dailyFacts 
}: CombinedLearningStreakCardProps) {
  const [, setLocation] = useLocation();

  // Get wallet data for streak information
  const { data: walletData, isLoading } = useQuery<WalletData>({
    queryKey: ['/api/wallet/dashboard'],
    retry: false,
    refetchOnWindowFocus: false,
  });

  const { data: user } = useQuery<User>({
    queryKey: ['/api/user']
  });

  // Calculate current streak
  const currentStreak = walletData?.currentStreak || 0;
  const bestStreak = walletData?.bestStreak || Math.max(currentStreak, 3);

  // Define milestone markers with rewards
  const milestones = [
    { days: 7, reward: "2,000 sats", icon: Star, color: "text-blue-400", bgColor: "bg-blue-500/20", borderColor: "border-blue-500/30" },
    { days: 30, reward: "10,000 sats", icon: Trophy, color: "text-purple-400", bgColor: "bg-purple-500/20", borderColor: "border-purple-500/30" },
    { days: 365, reward: "100,000 sats", icon: Crown, color: "text-yellow-400", bgColor: "bg-yellow-500/20", borderColor: "border-yellow-500/30" }
  ];

  // Find next milestone
  const nextMilestone = milestones.find(m => m.days > currentStreak);
  const completedMilestones = milestones.filter(m => m.days <= currentStreak);

  const handleStreakClick = () => {
    setLocation('/wallet/rewards');
  };

  const handleContinueLearning = () => {
    setLocation('/learn');
  };

  if (isLoading) {
    return (
      <Card className="w-full border border-zinc-700/50 bg-gradient-to-br from-zinc-900/95 to-zinc-800/90">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-600 rounded animate-pulse w-32"></div>
                  <div className="h-3 bg-gray-700 rounded animate-pulse w-20"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border border-zinc-700/50 bg-gradient-to-br from-zinc-900/95 to-zinc-800/90 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Top Section - Streak Info and Day Progress */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Streak Display */}
              <div 
                className="flex items-center gap-3 cursor-pointer hover:bg-zinc-800/50 rounded-lg p-2 -m-2 transition-colors group"
                onClick={handleStreakClick}
              >
                <div className="p-3 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-xl border border-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Flame className="w-6 h-6 text-orange-500 group-hover:animate-pulse" />
                </div>
                <div>
                  <div className="text-sm font-medium text-orange-400 mb-1">
                    {currentStreak} day streak
                  </div>
                  <div className="text-xs text-gray-500">
                    {completedMilestones.length > 0 ? `${completedMilestones.length} milestones earned` : 'Daily learning rewards'}
                  </div>
                </div>
              </div>
            </div>

            {/* Day Indicator and Badge */}
            <div className="flex items-center gap-3">
              {completedMilestones.length > 0 && (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs px-2 py-1">
                  <Trophy className="w-3 h-3 mr-1" />
                  {completedMilestones.length}
                </Badge>
              )}
              <div className="flex items-center gap-2 bg-zinc-800/50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-orange-400 font-semibold text-sm">Day {currentDayIndex}</span>
              </div>
            </div>
          </div>

          {/* Learning Content Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                {dayMetadata?.title || 'Loading today\'s lesson...'}
              </h3>
              <p className="text-zinc-400 text-sm">Day {currentDayIndex} • Bitcoin Education</p>
            </div>
            
            {dailyFacts && dailyFacts[0] && (
              <div className="bg-zinc-800/50 rounded-lg p-4 border-l-2 border-orange-500">
                <p className="text-zinc-200 font-medium">
                  {dailyFacts[0].title}
                </p>
              </div>
            )}
          </div>

          {/* Milestone Progress - Compact Row */}
          {currentStreak > 0 && (
            <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/30">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs text-gray-400">Achievement progress</div>
                <div 
                  className="text-xs text-orange-400 cursor-pointer hover:text-orange-300 transition-colors flex items-center gap-1"
                  onClick={handleStreakClick}
                >
                  View all rewards <ChevronRight className="w-3 h-3" />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {milestones.map((milestone, index) => {
                  const isCompleted = currentStreak >= milestone.days;
                  const isNext = !isCompleted && (nextMilestone?.days === milestone.days);
                  const Icon = milestone.icon;
                  
                  return (
                    <div 
                      key={milestone.days}
                      className={`
                        relative p-2 rounded-lg border transition-all duration-300 text-center
                        ${isCompleted 
                          ? `${milestone.bgColor} ${milestone.borderColor}` 
                          : isNext 
                            ? 'bg-zinc-700/50 border-orange-500/30' 
                            : 'bg-zinc-800/30 border-zinc-700/30'
                        }
                      `}
                    >
                      <Icon className={`w-3 h-3 mx-auto mb-1 ${isCompleted ? milestone.color : isNext ? 'text-orange-400' : 'text-gray-500'}`} />
                      <div className={`text-xs font-medium ${isCompleted ? 'text-white' : isNext ? 'text-orange-300' : 'text-gray-400'}`}>
                        {milestone.days}d
                      </div>
                      
                      {/* Completion indicator */}
                      {isCompleted && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Next milestone message */}
              {nextMilestone && (
                <div className="mt-3 text-center text-xs text-gray-400">
                  <span className="text-orange-400 font-medium">
                    {nextMilestone.days - currentStreak} days
                  </span> until {nextMilestone.reward}
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <Button 
            onClick={handleContinueLearning}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            Continue Learning
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}