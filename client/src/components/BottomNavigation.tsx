import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, GraduationCap, Coins, Gamepad2, Users, MoreHorizontal } from "@/lib/icons";

interface BottomNavigationProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export default function BottomNavigation({ activeSection, onSectionChange }: BottomNavigationProps) {
  const [location, setLocation] = useLocation();

  const handleNavigation = (section: string, path: string) => {
    // Always use direct navigation for consistency

    setLocation(path);
    if (onSectionChange) {
      onSectionChange(section);
    }
  };

  const getActiveSection = () => {
    if (activeSection) return activeSection;
    if (location === '/') return 'home';
    if (location.startsWith('/learn')) return 'learn';
    if (location.startsWith('/money')) return 'money';
    if (location.startsWith('/simulators')) return 'simulators';
    if (location.startsWith('/community')) return 'community';
    if (location.startsWith('/more') || location.startsWith('/about')) return 'more';
    return 'home';
  };

  const currentSection = getActiveSection();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/'
    },
    {
      id: 'learn',
      label: 'Learn',
      icon: GraduationCap,
      path: '/learn'
    },
    {
      id: 'money',
      label: 'Money',
      icon: Coins,
      path: '/money'
    },
    {
      id: 'simulators',
      label: 'Practice',
      icon: Gamepad2,
      path: '/simulators'
    },
    {
      id: 'community',
      label: 'Connect',
      icon: Users,
      path: '/community'
    },
    {
      id: 'more',
      label: 'More',
      icon: MoreHorizontal,
      path: '/more'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/98 backdrop-blur-md border-t border-zinc-700/50 z-50 pb-safe">
      <div className="grid grid-cols-6 gap-1 px-3 py-4 pb-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id, item.path)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200 min-h-[72px] ${
                isActive 
                  ? 'text-orange-400 bg-orange-500/15 scale-105 shadow-lg shadow-orange-500/10' 
                  : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/40 active:scale-95'
              }`}
              aria-label={item.label}
            >
              <Icon className="w-7 h-7" />
              <span className="text-xs font-medium leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}