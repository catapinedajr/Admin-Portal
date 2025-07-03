import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bitcoin, Lightbulb, Shield, Calculator } from "lucide-react";

type MainSection = "home" | "learn" | "money" | "simulations" | "more";

export default function HomeMinimal() {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  
  // Determine active section from URL
  const getActiveSectionFromPath = (path: string): MainSection => {
    if (path === '/' || path === '') return 'home';
    if (path.includes('/learn')) return 'learn';
    if (path.includes('/money')) return 'money';
    if (path.includes('/simulators')) return 'simulations';
    if (path.includes('/more')) return 'more';
    return 'home';
  };
  
  const [activeSection, setActiveSection] = useState<MainSection>(getActiveSectionFromPath(location));

  // Update URL when section changes
  useEffect(() => {
    const newPath = activeSection === 'home' ? '/' : `/${activeSection}`;
    if (location !== newPath) {
      setLocation(newPath);
    }
  }, [activeSection, setLocation, location]);

  // Simplified - no user data dependency for now

  // Time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good night";
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Header */}
      <header className="bg-zinc-800/50 border-b border-zinc-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-orange-500 font-bold text-xl">HL</div>
              <span className="text-zinc-400 text-sm">How-to-learn BTC</span>
            </div>
            <div className="text-zinc-400 text-sm">
              Guest
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-zinc-800/30 border-b border-zinc-700">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-center space-x-6">
            {(['home', 'learn', 'money', 'simulations', 'more'] as const).map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section
                    ? 'bg-orange-600 text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-700'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Home Section */}
        {activeSection === "home" && (
          <div className="space-y-8">
            {/* Welcome Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">
                {getTimeBasedGreeting()}!
              </h1>
            </div>

            {/* Simple Streak Display */}
            <div className="text-center space-y-2 mb-8">
              <div className="text-orange-400 text-2xl font-bold">
                0 day streak
              </div>
              <div className="text-zinc-400 text-sm">
                Keep the habit strong
              </div>
            </div>

            {/* Main Learning Card */}
            <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-colors">
              <CardContent className="p-8">
                <div className="space-y-6 text-center">
                  <div className="text-sm text-zinc-400">
                    Day 1 of your Bitcoin journey
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white">
                    Welcome to Bitcoin Learning
                  </h3>
                  
                  <p className="text-zinc-300">
                    Start your educational journey today
                  </p>
                  
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
                  <Calculator className="w-5 h-5 text-orange-400" />
                  <div>
                    <div className="text-white font-medium">Simulators</div>
                    <div className="text-zinc-400 text-sm">Practice tools</div>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => setActiveSection("money")}
                className="bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 rounded-lg p-4 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Bitcoin className="w-5 h-5 text-orange-400" />
                  <div>
                    <div className="text-white font-medium">Why BTC</div>
                    <div className="text-zinc-400 text-sm">Learn the basics</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Learn Section */}
        {activeSection === "learn" && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Daily Learning</h2>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Lightbulb className="w-6 h-6 text-orange-400" />
                      <h3 className="text-lg font-semibold text-white">Today's Lesson</h3>
                    </div>
                    <p className="text-zinc-300">
                      Welcome to your Bitcoin learning journey. Each day we'll explore new concepts to build your understanding.
                    </p>
                    <Button 
                      onClick={() => toast({ title: "Lesson completed!", description: "Great progress today." })}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Start Today's Lesson
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Other sections */}
        {activeSection === "money" && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">Why Bitcoin Matters</h2>
            <p className="text-zinc-400">Learn about Bitcoin's importance in the modern financial system.</p>
          </div>
        )}

        {activeSection === "simulations" && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">Practice Simulators</h2>
            <p className="text-zinc-400">Interactive tools to practice Bitcoin concepts safely.</p>
          </div>
        )}

        {activeSection === "more" && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">Additional Resources</h2>
            <p className="text-zinc-400">More tools and resources for your Bitcoin journey.</p>
          </div>
        )}
      </main>
    </div>
  );
}