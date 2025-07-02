import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProgressStep {
  id: string;
  title: string;
  status: "completed" | "current" | "pending";
  estimatedTime?: string;
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  currentStep: string;
  completedSteps: string[];
  className?: string;
}

export function ProgressIndicator({ steps, currentStep, completedSteps, className = "" }: ProgressIndicatorProps) {
  const completedCount = completedSteps.length;
  const totalSteps = steps.length;
  const progressPercentage = (completedCount / totalSteps) * 100;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Overall Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white">Learning Progress</span>
          <span className="text-sm text-zinc-400">{completedCount} of {totalSteps} completed</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Step-by-Step Progress */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isPending = !isCompleted && !isCurrent;

          return (
            <div key={step.id} className="flex items-center gap-3">
              {/* Step Icon */}
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : isCurrent ? (
                  <div className="w-5 h-5 rounded-full border-2 border-orange-400 bg-orange-400/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-orange-400" />
                  </div>
                ) : (
                  <Circle className="w-5 h-5 text-zinc-600" />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${
                    isCompleted ? "text-green-400" : 
                    isCurrent ? "text-orange-400" : 
                    "text-zinc-500"
                  }`}>
                    {step.title}
                  </span>
                  
                  {step.estimatedTime && (
                    <Badge variant="outline" className={`text-xs ${
                      isCompleted ? "border-green-600 text-green-400" :
                      isCurrent ? "border-orange-600 text-orange-400" :
                      "border-zinc-700 text-zinc-500"
                    }`}>
                      <Clock className="w-3 h-3 mr-1" />
                      {step.estimatedTime}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Step Number */}
              <div className={`text-xs font-medium px-2 py-1 rounded ${
                isCompleted ? "bg-green-600/20 text-green-400" :
                isCurrent ? "bg-orange-600/20 text-orange-400" :
                "bg-zinc-800 text-zinc-500"
              }`}>
                {index + 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Achievement Badge Component
interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  className?: string;
}

export function AchievementBadge({ title, description, icon, unlocked, className = "" }: AchievementBadgeProps) {
  return (
    <div className={`relative overflow-hidden rounded-lg border p-4 transition-all ${
      unlocked 
        ? "bg-gradient-to-r from-orange-600/20 to-yellow-600/20 border-orange-600/50 shadow-lg shadow-orange-600/10" 
        : "bg-zinc-900/50 border-zinc-800 opacity-60"
    } ${className}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${
          unlocked 
            ? "bg-orange-600/30 text-orange-400" 
            : "bg-zinc-800 text-zinc-600"
        }`}>
          {icon}
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold ${unlocked ? "text-white" : "text-zinc-500"}`}>
            {title}
          </h4>
          <p className={`text-sm ${unlocked ? "text-zinc-300" : "text-zinc-600"}`}>
            {description}
          </p>
        </div>
        {unlocked && (
          <CheckCircle className="w-5 h-5 text-green-400" />
        )}
      </div>
      
      {unlocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-full animate-pulse" />
      )}
    </div>
  );
}

// Learning Analytics Component
interface LearningAnalyticsProps {
  totalTimeSpent: number; // in minutes
  conceptsMastered: number;
  currentStreak: number;
  longestStreak: number;
  averageQuizScore: number;
  className?: string;
}

export function LearningAnalytics({ 
  totalTimeSpent, 
  conceptsMastered, 
  currentStreak, 
  longestStreak, 
  averageQuizScore,
  className = "" 
}: LearningAnalyticsProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const analytics = [
    {
      label: "Learning Time",
      value: formatTime(totalTimeSpent),
      icon: <Clock className="w-4 h-4" />,
      color: "blue"
    },
    {
      label: "Concepts Mastered",
      value: conceptsMastered.toString(),
      icon: <CheckCircle className="w-4 h-4" />,
      color: "green"
    },
    {
      label: "Current Streak",
      value: `${currentStreak} days`,
      icon: <div className="w-4 h-4 bg-orange-400 rounded-full" />,
      color: "orange"
    },
    {
      label: "Best Streak",
      value: `${longestStreak} days`,
      icon: <div className="w-4 h-4 bg-yellow-400 rounded-full" />,
      color: "yellow"
    },
    {
      label: "Quiz Average",
      value: `${averageQuizScore}%`,
      icon: <div className="w-4 h-4 bg-purple-400 rounded-full" />,
      color: "purple"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue": return "text-blue-400 bg-blue-600/20";
      case "green": return "text-green-400 bg-green-600/20";
      case "orange": return "text-orange-400 bg-orange-600/20";
      case "yellow": return "text-yellow-400 bg-yellow-600/20";
      case "purple": return "text-purple-400 bg-purple-600/20";
      default: return "text-zinc-400 bg-zinc-600/20";
    }
  };

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-5 gap-4 ${className}`}>
      {analytics.map((stat, index) => (
        <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-1 rounded ${getColorClasses(stat.color)}`}>
              {stat.icon}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-zinc-400">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}