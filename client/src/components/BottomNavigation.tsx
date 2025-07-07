import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, GraduationCap, Coins, Gamepad2, Users, MoreHorizontal } from "lucide-react";

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
      label: 'Simulators',
      icon: Gamepad2,
      path: '/simulators'
    },
    {
      id: 'community',
      label: 'Community',
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
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 safe-area-pb z-50">
      <div className="grid grid-cols-6 gap-0 px-4 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(item.id, item.path)}
              title={item.label}
              className={`flex items-center justify-center h-auto p-4 w-full ${
                isActive 
                  ? 'text-orange-400 bg-orange-400/10' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-14 h-14" />
              <span className="sr-only">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}