import { useQuery } from "@tanstack/react-query";

interface DashboardData {
  user: {
    id: number;
    username: string;
    currentStreak: number;
    bestStreak: number;
    totalDaysActive: number;
    lastActiveDate?: string;
  };
  currentDayIndex: number;
  dailyFacts: Array<{
    id: number;
    dayId: number;
    title: string;
    content: string;
    icon: string;
    category: string;
    orderIndex: number;
  }>;
  lesson: {
    id: number;
    dayId: number;
    title: string;
    content: string;
    keyTakeaways: string[];
    whyItMatters: string;
    estimatedReadTime: number;
  };
  userQuizData: {
    totalQuizzesTaken: number;
    totalCorrectAnswers: number;
    averageScore: number;
  };
}

export function useDashboard(userId: number = 1) {
  return useQuery<DashboardData>({
    queryKey: ['/api/dashboard', userId],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}