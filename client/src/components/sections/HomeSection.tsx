import { Card, CardContent } from "@/components/ui/card";
import { Gamepad2, MoreHorizontal, Zap, TrendingUp, Calendar } from "lucide-react";
import { useLocation } from "wouter";
import type { User } from "@shared/schema";

type MainSection = "home" | "learn" | "money" | "simulations" | "more";

interface HomeProps {
  user: User | undefined;
  currentDayIndex: number;
  dayMetadata: any;
  dailyFacts: any[];
  setActiveSection: (section: MainSection) => void;
}

// Dynamic greeting based on time of day
const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
};

export default function HomeSection({ 
  user, 
  currentDayIndex, 
  dayMetadata, 
  dailyFacts, 
  setActiveSection 
}: HomeProps) {
  const [, setLocation] = useLocation();
  
  return (
    <div className="space-y-8">
      {/* Enhanced Main Learning Card with Split Functionality */}
      <Card className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 border-zinc-800 hover:border-orange-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 overflow-hidden">
        <CardContent className="p-0">
          {/* Top Half - Clickable to Rewards */}
          <div 
            onClick={() => setLocation('/wallet/rewards')}
            className="p-8 pb-4 cursor-pointer hover:bg-zinc-800/30 transition-colors"
          >
            {/* Top Stats Row */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-orange-400 font-semibold">Day {currentDayIndex}</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-800/50 px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400 font-bold">{user?.currentStreak || 0}</span>
                <span className="text-zinc-400 text-sm">streak</span>
              </div>
            </div>

            <div className="space-y-6 text-center">
              {/* Main Title with Icon */}
              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className="p-3 bg-orange-500/10 rounded-full border border-orange-500/20">
                    <Zap className="w-8 h-8 text-orange-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white leading-tight">
                  {dayMetadata?.title || 'Loading...'}
                </h3>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="px-8">
            <div className="border-t border-zinc-700/50"></div>
          </div>

          {/* Bottom Half - Clickable to Learn */}
          <div 
            onClick={() => setActiveSection("learn")}
            className="p-8 pt-4 cursor-pointer hover:bg-zinc-800/30 transition-colors"
          >
            <div className="space-y-6 text-center">
              {/* Today's Preview */}
              {dailyFacts && dailyFacts[0] && (
                <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
                  <div className="flex items-center gap-2 justify-center mb-2">
                    <Calendar className="w-4 h-4 text-orange-400" />
                    <span className="text-orange-400 text-sm font-medium">Today's Focus</span>
                  </div>
                  <p className="text-zinc-300 text-lg">
                    {dailyFacts[0].title}
                  </p>
                </div>
              )}
              
              {/* Progress Motivation */}
              <div className="space-y-2">
                <div className="text-zinc-400 text-sm">
                  {user?.currentStreak === 0 ? "Start your learning journey today" :
                   user?.currentStreak === 1 ? "Great start! Keep the momentum going" :
                   user?.currentStreak && user.currentStreak < 7 ? "Building a solid habit" :
                   user?.currentStreak && user.currentStreak < 30 ? "You're on fire! 🔥" :
                   "Bitcoin conviction master in the making"}
                </div>
              </div>
              
              {/* Enhanced Continue Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click
                  setActiveSection("learn");
                }}
                className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-12 py-4 rounded-lg font-semibold transition-all duration-300 text-lg transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
              >
                <div className="flex items-center gap-2 justify-center">
                  <span>Continue Learning</span>
                  <Zap className="w-5 h-5 group-hover:animate-pulse" />
                </div>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setActiveSection("simulations")}
          className="bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 rounded-lg p-4 text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-5 h-5 text-orange-400" />
            <div>
              <div className="text-white font-medium">Simulators</div>
              <div className="text-zinc-400 text-sm">Practice tools</div>
            </div>
          </div>
        </button>
        
        <button 
          onClick={() => setActiveSection("more")}
          className="bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 rounded-lg p-4 text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <MoreHorizontal className="w-5 h-5 text-orange-400" />
            <div>
              <div className="text-white font-medium">More</div>
              <div className="text-zinc-400 text-sm">Explore</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}