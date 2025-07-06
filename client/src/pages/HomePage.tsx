import { useQuery } from "@tanstack/react-query";
import HomeSection from "@/components/sections/HomeSection";
import type { User } from "@shared/schema";

interface HomePageProps {
  currentDayIndex: number;
  dayMetadata: any;
  dailyFacts: any[];
  setActiveSection: (section: "home" | "learn" | "money" | "simulations" | "more") => void;
}

export default function HomePage({ 
  currentDayIndex, 
  dayMetadata, 
  dailyFacts, 
  setActiveSection 
}: HomePageProps) {
  const { data: user } = useQuery<User>({
    queryKey: ['/api/user'],
  });

  return (
    <HomeSection 
      user={user}
      currentDayIndex={currentDayIndex}
      dayMetadata={dayMetadata}
      dailyFacts={dailyFacts}
      setActiveSection={setActiveSection}
    />
  );
}