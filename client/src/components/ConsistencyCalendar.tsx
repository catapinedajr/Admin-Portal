import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { type DailyActivity } from "@shared/schema";

interface ConsistencyCalendarProps {
  userId: number;
}

interface WeekData {
  weekLabel: string;
  days: DayData[];
  completedDays: number;
  totalDays: number;
}

interface DayData {
  date: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  lessonCompleted: boolean;
  quizCompleted: boolean;
  practiceCompleted: boolean;
  totalCompleted: number;
}

export function ConsistencyCalendar({ userId }: ConsistencyCalendarProps) {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["/api/activities", userId, "calendar"],
    queryFn: async () => {
      const response = await fetch(`/api/activities/${userId}/calendar?weeks=3`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch activities');
      return response.json() as Promise<DailyActivity[]>;
    },
  });

  // Calculate current streak
  const calculateCurrentStreak = (activities: DailyActivity[]): number => {
    if (!activities.length) return 0;
    
    const sortedActivities = [...activities].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let currentDate = new Date(today);
    
    for (let i = 0; i < 30; i++) { // Check last 30 days max
      const dateStr = currentDate.toISOString().split('T')[0];
      const activity = sortedActivities.find(a => a.date === dateStr);
      
      if (activity && activity.lessonCompleted) {
        streak++;
      } else if (dateStr === today) {
        // Skip today if no activity yet
      } else {
        break;
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  };

  // Process activities into weekly data
  const processWeeklyData = (activities: DailyActivity[]): WeekData[] => {
    const weeks: WeekData[] = [];
    const today = new Date();
    
    // Create activity lookup map
    const activityMap = new Map(activities.map(a => [a.date, a]));
    
    // Generate 3 weeks of data
    for (let weekOffset = 0; weekOffset < 3; weekOffset++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (weekOffset * 7) - today.getDay()); // Start of week (Sunday)
      
      const weekLabel = weekOffset === 0 ? "This Week" : 
                       weekOffset === 1 ? "Last Week" : 
                       "2 Weeks Ago";
      
      const days: DayData[] = [];
      let completedDays = 0;
      
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + dayOffset);
        const dateStr = date.toISOString().split('T')[0];
        
        const activity = activityMap.get(dateStr);
        const lessonCompleted = activity?.lessonCompleted || false;
        const quizCompleted = activity?.quizCompleted || false;
        const practiceCompleted = activity?.practiceCompleted || false;
        
        const totalCompleted = [lessonCompleted, quizCompleted, practiceCompleted]
          .filter(Boolean).length;
        
        if (lessonCompleted) completedDays++; // Count day as complete if lesson is done
        
        days.push({
          date: dateStr,
          dayOfWeek: dayOffset,
          lessonCompleted,
          quizCompleted,
          practiceCompleted,
          totalCompleted
        });
      }
      
      weeks.push({
        weekLabel,
        days,
        completedDays,
        totalDays: 7
      });
    }
    
    return weeks;
  };

  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-zinc-700 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start justify-between">
                  <div className="h-3 bg-zinc-700 rounded w-20 flex items-start pt-0.5"></div>
                  <div className="flex gap-1.5">
                    {[...Array(7)].map((_, j) => (
                      <div key={j} className="w-6 h-6 bg-zinc-700 rounded-md"></div>
                    ))}
                  </div>
                  <div className="h-3 bg-zinc-700 rounded w-12 flex items-start justify-end pt-0.5"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const weeks = processWeeklyData(activities);
  const currentStreak = calculateCurrentStreak(activities);

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-white border-b border-zinc-700 pb-3 mb-4">
          Consistency Tracker
        </h3>
        
        <div className="space-y-4">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex items-start justify-between">
              {/* Week Label - aligned with boxes */}
              <div className="text-zinc-400 text-sm font-medium w-20 flex items-start pt-0.5">
                {week.weekLabel}
              </div>
              
              {/* Daily Boxes */}
              <div className="flex gap-1.5">
                {week.days.map((day, dayIndex) => {
                  // Consider day complete if at least lesson is done (main learning activity)
                  const isCompleted = day.lessonCompleted;
                  
                  return (
                    <div key={dayIndex} className="flex flex-col items-center gap-1">
                      {/* Single completion box */}
                      <div 
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                          isCompleted 
                            ? 'bg-orange-500 border-orange-500' 
                            : 'bg-zinc-800 border-zinc-600 hover:border-zinc-500'
                        }`}
                        title={isCompleted ? 'Day completed' : 'Not completed'}
                      >
                        {isCompleted && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      
                      {/* Day abbreviation */}
                      <div className="text-zinc-500 text-xs">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'][day.dayOfWeek]}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Completion Summary - aligned with boxes */}
              <div className="text-zinc-400 text-sm w-12 text-right flex items-start justify-end pt-0.5">
                {week.completedDays}/7
              </div>
            </div>
          ))}
        </div>
        
        {/* Current Streak */}
        <div className="mt-4 pt-4 border-t border-zinc-700">
          <div className="text-center">
            <span className="text-zinc-400 text-sm">Current streak: </span>
            <span className="text-orange-400 font-semibold">
              {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}