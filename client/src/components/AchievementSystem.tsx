import { useState, useEffect } from "react";
import { AchievementBadge } from "@/components/ProgressIndicator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Target, 
  Zap, 
  BookOpen, 
  Brain, 
  Shield, 
  Coins, 
  TrendingUp,
  Award,
  Star
} from "@/lib/icons";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: "learning" | "engagement" | "mastery" | "exploration";
  requirement: {
    type: "streak" | "quiz_score" | "concepts_learned" | "time_spent" | "sections_completed";
    value: number;
  };
  points: number;
  unlocked: boolean;
}

interface UserStats {
  currentStreak: number;
  longestStreak: number;
  averageQuizScore: number;
  conceptsLearned: number;
  timeSpent: number; // minutes
  sectionsCompleted: string[];
  totalQuizzesTaken: number;
  perfectQuizzes: number;
}

const achievementDefinitions: Omit<Achievement, 'unlocked'>[] = [
  // Learning Achievements
  {
    id: "first_steps",
    title: "First Steps",
    description: "Complete your first daily learning session",
    icon: <BookOpen className="w-5 h-5" />,
    category: "learning",
    requirement: { type: "sections_completed", value: 1 },
    points: 10
  },
  {
    id: "dedicated_learner",
    title: "Dedicated Learner",
    description: "Maintain a 7-day learning streak",
    icon: <Target className="w-5 h-5" />,
    category: "engagement",
    requirement: { type: "streak", value: 7 },
    points: 50
  },
  {
    id: "bitcoin_explorer",
    title: "Bitcoin Explorer",
    description: "Complete all sections in the Explore area",
    icon: <Shield className="w-5 h-5" />,
    category: "exploration",
    requirement: { type: "sections_completed", value: 5 },
    points: 75
  },
  {
    id: "quiz_master",
    title: "Quiz Master",
    description: "Achieve 90% average on daily quizzes",
    icon: <Brain className="w-5 h-5" />,
    category: "mastery",
    requirement: { type: "quiz_score", value: 90 },
    points: 100
  },
  {
    id: "satoshi_student",
    title: "Satoshi Student",
    description: "Learn 25 Bitcoin concepts",
    icon: <Coins className="w-5 h-5" />,
    category: "learning",
    requirement: { type: "concepts_learned", value: 25 },
    points: 80
  },
  {
    id: "time_investor",
    title: "Time Investor",
    description: "Spend 5 hours learning about Bitcoin",
    icon: <TrendingUp className="w-5 h-5" />,
    category: "engagement",
    requirement: { type: "time_spent", value: 300 },
    points: 60
  },
  {
    id: "consistency_king",
    title: "Consistency King",
    description: "Maintain a 30-day learning streak",
    icon: <Trophy className="w-5 h-5" />,
    category: "engagement",
    requirement: { type: "streak", value: 30 },
    points: 200
  },
  {
    id: "perfectionist",
    title: "Perfectionist",
    description: "Score 100% on 5 different quizzes",
    icon: <Star className="w-5 h-5" />,
    category: "mastery",
    requirement: { type: "concepts_learned", value: 50 }, // Placeholder logic
    points: 150
  },
  {
    id: "bitcoin_scholar",
    title: "Bitcoin Scholar",
    description: "Master 50 Bitcoin concepts",
    icon: <Award className="w-5 h-5" />,
    category: "mastery",
    requirement: { type: "concepts_learned", value: 50 },
    points: 250
  },
  {
    id: "lightning_learner",
    title: "Lightning Learner",
    description: "Complete daily learning in under 15 minutes",
    icon: <Zap className="w-5 h-5" />,
    category: "engagement",
    requirement: { type: "time_spent", value: 15 },
    points: 40
  }
];

interface AchievementSystemProps {
  userStats: UserStats;
  className?: string;
}

export function AchievementSystem({ userStats, className = "" }: AchievementSystemProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<Achievement[]>([]);

  useEffect(() => {
    const updatedAchievements = achievementDefinitions.map(achievement => ({
      ...achievement,
      unlocked: checkAchievementUnlocked(achievement, userStats)
    }));

    // Check for newly unlocked achievements
    const newlyUnlocked = updatedAchievements.filter(
      achievement => achievement.unlocked && 
      !achievements.find(a => a.id === achievement.id && a.unlocked)
    );

    setAchievements(updatedAchievements);
    
    if (newlyUnlocked.length > 0) {
      setRecentlyUnlocked(newlyUnlocked);
      // Clear the notification after 5 seconds
      setTimeout(() => setRecentlyUnlocked([]), 5000);
    }
  }, [userStats]);

  const checkAchievementUnlocked = (achievement: Omit<Achievement, 'unlocked'>, stats: UserStats): boolean => {
    const { type, value } = achievement.requirement;
    
    switch (type) {
      case "streak":
        return stats.currentStreak >= value;
      case "quiz_score":
        return stats.averageQuizScore >= value;
      case "concepts_learned":
        return stats.conceptsLearned >= value;
      case "time_spent":
        return stats.timeSpent >= value;
      case "sections_completed":
        return stats.sectionsCompleted.length >= value;
      default:
        return false;
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);
  const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "learning": return "bg-blue-600/20 text-blue-400 border-blue-600/50";
      case "engagement": return "bg-green-600/20 text-green-400 border-green-600/50";
      case "mastery": return "bg-purple-600/20 text-purple-400 border-purple-600/50";
      case "exploration": return "bg-orange-600/20 text-orange-400 border-orange-600/50";
      default: return "bg-zinc-600/20 text-zinc-400 border-zinc-600/50";
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Achievement Summary */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Your Achievements</h3>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-orange-600 text-orange-400">
                <Trophy className="w-3 h-3 mr-1" />
                {totalPoints} points
              </Badge>
              <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                {unlockedAchievements.length} / {achievements.length} unlocked
              </Badge>
            </div>
          </div>
          
          {/* Progress bar for overall achievement completion */}
          <div className="w-full bg-zinc-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-600 to-yellow-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedAchievements.length / achievements.length) * 100}%` }}
            />
          </div>
          <p className="text-sm text-zinc-400 mt-2">
            {Math.round((unlockedAchievements.length / achievements.length) * 100)}% complete
          </p>
        </CardContent>
      </Card>

      {/* Recently Unlocked Achievements */}
      {recentlyUnlocked.length > 0 && (
        <Card className="bg-gradient-to-r from-orange-900/50 to-yellow-900/50 border-orange-600/50">
          <CardContent className="p-6">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Achievement Unlocked!
            </h4>
            <div className="grid gap-3">
              {recentlyUnlocked.map(achievement => (
                <AchievementBadge
                  key={achievement.id}
                  title={achievement.title}
                  description={achievement.description}
                  icon={achievement.icon}
                  unlocked={true}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievement Categories */}
      <div className="grid gap-6">
        {["learning", "engagement", "mastery", "exploration"].map(category => {
          const categoryAchievements = achievements.filter(a => a.category === category);
          const categoryUnlocked = categoryAchievements.filter(a => a.unlocked).length;
          
          return (
            <Card key={category} className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white capitalize">{category}</h4>
                  <Badge variant="outline" className={getCategoryColor(category)}>
                    {categoryUnlocked} / {categoryAchievements.length}
                  </Badge>
                </div>
                
                <div className="grid gap-3">
                  {categoryAchievements.map(achievement => (
                    <AchievementBadge
                      key={achievement.id}
                      title={achievement.title}
                      description={achievement.description}
                      icon={achievement.icon}
                      unlocked={achievement.unlocked}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default AchievementSystem;