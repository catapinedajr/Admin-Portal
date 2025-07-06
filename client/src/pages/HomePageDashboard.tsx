import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import BottomNavigation from "@/components/BottomNavigation";
import HomeSection from "@/components/sections/HomeSection";
import Header from "@/components/Header";
import { useSubscription } from "@/contexts/SubscriptionContext";

export default function HomePageDashboard() {
  const [, setLocation] = useLocation();
  const { isPremiumTier } = useSubscription();

  // Get current day from API - lightweight version
  const { data: nextDayData } = useQuery({
    queryKey: ['/api/next-available-day', 1],
    queryFn: () => fetch('/api/next-available-day/1').then(res => res.json())
  });

  const currentDayIndex = nextDayData?.dayIndex || 1;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header 
        isPremiumTier={isPremiumTier}
        onUpgradeClick={() => {
          // Handle upgrade logic if needed
        }}
      />
      
      {/* Main Content - Just the Home Dashboard */}
      <main className="pt-16 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <HomeSection 
            currentDayIndex={currentDayIndex}
            onNavigateToLearn={() => setLocation('/learn')}
          />
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeSection="home"
        onSectionChange={(section) => {
          if (section === 'learn') setLocation('/learn');
          else if (section === 'money') setLocation('/money');
          else if (section === 'simulators') setLocation('/simulators');
          else if (section === 'more') setLocation('/more');
        }}
      />
    </div>
  );
}