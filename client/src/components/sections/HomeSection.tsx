import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Flame, 
  Trophy, 
  Zap, 
  Crown,
  ChevronRight,
  Star,
  ArrowRight,
  BookOpen
} from "@/lib/icons";
import type { User } from "@shared/schema";

type MainSection = "home" | "learn" | "money" | "simulations" | "more";

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

interface HomeProps {
  user: User | undefined;
  currentDayIndex: number;
  dayMetadata: any;
  dailyFacts: any[];
  setActiveSection: (section: MainSection) => void;
}

export default function HomeSection({ 
  user, 
  currentDayIndex, 
  dayMetadata, 
  dailyFacts, 
  setActiveSection 
}: HomeProps) {
  const [, setLocation] = useLocation();

  // Get wallet data for streak information
  const { data: walletData, isLoading } = useQuery<WalletData>({
    queryKey: ['/api/v1/wallet/dashboard'],
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Calculate current streak
  const currentStreak = walletData?.currentStreak || 0;
  const bestStreak = walletData?.bestStreak || Math.max(currentStreak, 3);

  // Define milestone markers with rewards
  const milestones = [
    { days: 7, reward: "2,000 points", icon: Star, color: "text-blue-400", bgColor: "bg-blue-500/20", borderColor: "border-blue-500/30" },
    { days: 30, reward: "10,000 points", icon: Trophy, color: "text-purple-400", bgColor: "bg-purple-500/20", borderColor: "border-purple-500/30" },
    { days: 365, reward: "100,000 points", icon: Crown, color: "text-yellow-400", bgColor: "bg-yellow-500/20", borderColor: "border-yellow-500/30" }
  ];

  // Find next milestone
  const nextMilestone = milestones.find(m => m.days > currentStreak);
  const completedMilestones = milestones.filter(m => m.days <= currentStreak);
  
  return (
    <div className="space-y-4">
      {/* Top Card - Rewards/Streak Section */}
      <Card 
        onClick={() => setLocation('/wallet/rewards')}
        className="w-full cursor-pointer hover:bg-zinc-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 hover:scale-[1.02] group border border-zinc-700/50 hover:border-orange-500/30"
      >
        <CardContent className="p-5">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-xl border border-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Flame className="w-6 h-6 text-orange-500 group-hover:animate-pulse" />
                </div>
                <div>
                  <div className="text-sm font-medium text-orange-400 mb-1">Streak Achievements</div>
                  <div className="text-xs text-gray-500">Daily learning rewards</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {completedMilestones.length > 0 && (
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs px-2 py-1">
                    <Trophy className="w-3 h-3 mr-1" />
                    {completedMilestones.length}
                  </Badge>
                )}
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-orange-400 transition-colors" />
              </div>
            </div>

            {/* Current Streak Display */}
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium text-white">Current Streak</span>
                </div>
                <div className="text-2xl font-bold text-orange-400">
                  {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
                </div>
              </div>

              {/* Milestone Progress Markers */}
              <div className="space-y-3">
                <div className="text-xs text-gray-400 mb-2">Achievement milestones</div>
                <div className="grid grid-cols-3 gap-2">
                  {milestones.map((milestone, index) => {
                    const isCompleted = currentStreak >= milestone.days;
                    const isNext = !isCompleted && (nextMilestone?.days === milestone.days);
                    const Icon = milestone.icon;
                    
                    return (
                      <div 
                        key={milestone.days}
                        className={`
                          relative p-3 rounded-lg border transition-all duration-300
                          ${isCompleted 
                            ? `${milestone.bgColor} ${milestone.borderColor} scale-105` 
                            : isNext 
                              ? 'bg-zinc-700/50 border-orange-500/30 animate-pulse' 
                              : 'bg-zinc-800/30 border-zinc-700/30'
                          }
                        `}
                      >
                        <div className="text-center space-y-1">
                          <Icon className={`w-4 h-4 mx-auto ${isCompleted ? milestone.color : isNext ? 'text-orange-400' : 'text-gray-500'}`} />
                          <div className={`text-xs font-medium ${isCompleted ? 'text-white' : isNext ? 'text-orange-300' : 'text-gray-400'}`}>
                            {milestone.days} days
                          </div>
                          <div className={`text-xs ${isCompleted ? milestone.color : isNext ? 'text-orange-400' : 'text-gray-500'}`}>
                            {milestone.reward}
                          </div>
                        </div>
                        
                        {/* Completion indicator */}
                        {isCompleted && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                        )}

                        {/* Next milestone glow */}
                        {isNext && (
                          <div className="absolute inset-0 rounded-lg bg-orange-500/20 animate-pulse"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Progress message */}
              <div className="mt-3 text-center">
                {nextMilestone ? (
                  <div className="text-xs text-gray-400">
                    <span className="text-orange-400 font-medium">
                      {nextMilestone.days - currentStreak} days
                    </span> until next reward ({nextMilestone.reward})
                  </div>
                ) : (
                  <div className="text-xs text-yellow-400 font-medium">
                    🎉 All milestones completed! Keep the streak going!
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Card - Learning Section */}
      <Card 
        onClick={() => setActiveSection("learn")}
        className="w-full cursor-pointer hover:bg-zinc-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 hover:scale-[1.02] group border border-zinc-700/50 hover:border-orange-500/30"
      >
        <CardContent className="p-5">
          <div className="space-y-4">
            {/* Today's Learning Header */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-lg border border-orange-500/20">
                <BookOpen className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-orange-400">Today's Learning</div>
                <div className="text-xs text-gray-500">Day {currentDayIndex} • Bitcoin Education</div>
              </div>
            </div>

            {/* Learning Content */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-sm">
                {dayMetadata?.title || 'Loading today\'s lesson...'}
              </h4>
              
              {dailyFacts && dailyFacts[0] && (
                <div className="bg-zinc-800/30 rounded-lg p-3 border-l-2 border-orange-500">
                  <p className="text-zinc-300 text-xs font-medium">
                    {dailyFacts[0].title}
                  </p>
                </div>
              )}
              
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("learn");
                }}
                size="sm"
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-medium py-2 text-sm transition-all duration-300 flex items-center justify-center gap-2"
              >
                Continue Learning
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>


    </div>
  );
}