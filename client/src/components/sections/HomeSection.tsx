import { Card, CardContent } from "@/components/ui/card";
import { Gamepad2, MoreHorizontal } from "lucide-react";
import type { User } from "@shared/schema";

interface HomeProps {
  user: User | undefined;
  currentDayIndex: number;
  dayMetadata: any;
  dailyFacts: any[];
  setActiveSection: (section: string) => void;
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
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">
          {getTimeBasedGreeting()}{user?.firstName ? `, ${user.firstName}` : ''}!
        </h1>
      </div>

      {/* Simple Streak Display */}
      <div className="text-center space-y-2 mb-8">
        <div className="text-orange-400 text-2xl font-bold">
          {user?.currentStreak || 0} day streak
        </div>
        <div className="text-zinc-400 text-sm">
          Keep the habit strong
        </div>
      </div>

      {/* Main Learning Card */}
      <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-colors">
        <CardContent className="p-8">
          <div className="space-y-6 text-center">
            {/* Day indicator at top */}
            <div className="text-sm text-zinc-400">
              Day {currentDayIndex} of your Bitcoin journey
            </div>
            
            {/* Title */}
            <h3 className="text-2xl font-bold text-white">
              {dayMetadata?.title || 'Loading...'}
            </h3>
            
            {/* Subtitle - first daily fact */}
            {dailyFacts && dailyFacts[0] && (
              <p className="text-zinc-300">
                {dailyFacts[0].title}
              </p>
            )}
            
            {/* Continue button */}
            <button 
              onClick={() => setActiveSection("learn")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 rounded-lg font-medium transition-colors text-lg"
            >
              Continue Learning
            </button>
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