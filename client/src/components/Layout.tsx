import React from "react";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bitcoin, 
  Crown,
  Gem,
  BookOpen,
  TrendingUp,
  Lightbulb,
  UserIcon,
  Home as HomeIcon
} from "lucide-react";
import PWAInstallButton from "@/components/PWAInstallButton";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location, setLocation] = useLocation();

  const getActiveSection = () => {
    if (location === '/' || location === '') return 'home';
    if (location.includes('/learn')) return 'learn';
    if (location.includes('/money')) return 'money';
    if (location.includes('/simulators')) return 'simulators';
    if (location.includes('/more')) return 'more';
    return 'home';
  };

  const activeSection = getActiveSection();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="bg-zinc-900/50 border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bitcoin className="w-8 h-8 text-orange-500" />
            <div>
              <h1 className="text-xl font-bold">HODLearn</h1>
              <p className="text-xs text-zinc-400">Build Bitcoin conviction through daily learning</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <PWAInstallButton />
            <Badge variant="outline" className="text-orange-500 border-orange-500/30">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-zinc-900/30 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 py-3">
            <Button
              variant={activeSection === "home" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setLocation('/')}
              className="text-xs px-4 py-2"
            >
              <HomeIcon className="w-4 h-4 mr-2" />
              Home
            </Button>
            
            <Button
              variant={activeSection === "learn" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setLocation('/learn')}
              className="text-xs px-4 py-2"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Learn
            </Button>
            
            <Button
              variant={activeSection === "money" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setLocation('/money')}
              className="text-xs px-4 py-2"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Money
            </Button>
            
            <Button
              variant={activeSection === "simulators" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setLocation('/simulators')}
              className="text-xs px-4 py-2"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Practice
            </Button>
            
            <Button
              variant={activeSection === "more" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setLocation('/more')}
              className="text-xs px-4 py-2"
            >
              <UserIcon className="w-4 h-4 mr-2" />
              More
            </Button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="max-w-6xl mx-auto">
        {children}
      </main>

      {/* Bottom padding for mobile navigation */}
      <div className="h-20"></div>
    </div>
  );
}