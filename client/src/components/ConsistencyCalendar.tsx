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
        
        if (totalCompleted === 3) completedDays++;
        
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
                <div key={i} className="flex justify-between items-center">
                  <div className="h-3 bg-zinc-700 rounded w-20"></div>
                  <div className="flex gap-1">
                    {[...Array(7)].map((_, j) => (
                      <div key={j} className="w-3 h-3 bg-zinc-700 rounded-full"></div>
                    ))}
                  </div>
                  <div className="h-3 bg-zinc-700 rounded w-12"></div>
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
            <div key={weekIndex} className="flex items-center justify-between">
              {/* Week Label */}
              <div className="text-zinc-400 text-sm font-medium w-20">
                {week.weekLabel}
              </div>
              
              {/* Daily Dots */}
              <div className="flex gap-1.5">
                {week.days.map((day, dayIndex) => (
                  <div key={dayIndex} className="flex flex-col items-center gap-0.5">
                    {/* Three small dots for lesson, quiz, practice */}
                    <div className="flex gap-0.5">
                      {/* Lesson dot */}
                      <div 
                        className={`w-1.5 h-1.5 rounded-full ${
                          day.lessonCompleted ? 'bg-orange-500' : 'bg-zinc-600'
                        }`}
                        title="Lesson"
                      />
                      {/* Quiz dot */}
                      <div 
                        className={`w-1.5 h-1.5 rounded-full ${
                          day.quizCompleted ? 'bg-orange-500' : 'bg-zinc-600'
                        }`}
                        title="Quiz"
                      />
                      {/* Practice dot */}
                      <div 
                        className={`w-1.5 h-1.5 rounded-full ${
                          day.practiceCompleted ? 'bg-orange-500' : 'bg-zinc-600'
                        }`}
                        title="Practice"
                      />
                    </div>
                    
                    {/* Day abbreviation */}
                    <div className="text-zinc-500 text-xs">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'][day.dayOfWeek]}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Completion Summary */}
              <div className="text-zinc-400 text-sm w-12 text-right">
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