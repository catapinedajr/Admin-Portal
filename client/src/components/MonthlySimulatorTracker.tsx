import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Diamond, ArrowDown, Clock, Shield, Check } from "lucide-react";

interface SimulatorCompletion {
  simulatorType: string;
  completed: boolean;
  completedAt?: string;
}

interface MonthlySimulatorTrackerProps {
  userId: number;
}

const simulators = [
  { type: 'dca', name: 'DCA', icon: TrendingUp },
  { type: 'hodl', name: 'HODL', icon: Diamond },
  { type: 'inflation', name: 'Inflation', icon: ArrowDown },
  { type: 'settlement', name: 'Settlement', icon: Clock },
  { type: 'security', name: 'Security', icon: Shield }
];

export function MonthlySimulatorTracker({ userId }: MonthlySimulatorTrackerProps) {
  const currentMonth = new Date().toLocaleString('default', { month: 'short', year: 'numeric' });
  
  const { data: completions = [], isLoading } = useQuery({
    queryKey: ['/api/simulator-completions', userId, 'monthly'],
    queryFn: async () => {
      const response = await fetch(`/api/simulator-completions/${userId}/monthly`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch simulator completions');
      const data = await response.json();
      // Ensure we always return an array
      return Array.isArray(data) ? data : [];
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-zinc-700 rounded mb-4"></div>
            <div className="flex items-start justify-between">
              <div className="h-3 bg-zinc-700 rounded w-20 flex items-start pt-0.5"></div>
              <div className="flex gap-2">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 bg-zinc-700 rounded-md"></div>
                    <div className="h-2 bg-zinc-700 rounded w-8"></div>
                  </div>
                ))}
              </div>
              <div className="h-3 bg-zinc-700 rounded w-12 flex items-start justify-end pt-0.5"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Create completion map for current month
  const completionMap = new Map<string, boolean>();
  if (Array.isArray(completions)) {
    completions.forEach((completion: SimulatorCompletion) => {
      completionMap.set(completion.simulatorType, completion.completed);
    });
  }

  const completedCount = simulators.filter(sim => completionMap.get(sim.type)).length;

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-white border-b border-zinc-700 pb-3 mb-4">
          Monthly Simulator Practice
        </h3>
        
        <div className="flex items-start justify-between">
          {/* Month Label */}
          <div className="text-zinc-400 text-sm font-medium w-20 flex items-start pt-0.5">
            {currentMonth}
          </div>
          
          {/* Simulator Icons */}
          <div className="flex gap-2">
            {simulators.map((simulator) => {
              const isCompleted = completionMap.get(simulator.type) || false;
              const IconComponent = simulator.icon;
              
              return (
                <div key={simulator.type} className="flex flex-col items-center gap-1">
                  <div 
                    className={`w-8 h-8 rounded-md border-2 flex items-center justify-center transition-colors ${
                      isCompleted 
                        ? 'bg-orange-500 border-orange-500' 
                        : 'bg-zinc-800 border-zinc-600 hover:border-zinc-500'
                    }`}
                    title={`${simulator.name} Simulator ${isCompleted ? 'completed' : 'not completed'} this month`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <IconComponent className="w-4 h-4 text-zinc-400" />
                    )}
                  </div>
                  
                  {/* Simulator name */}
                  <div className="text-zinc-500 text-xs">
                    {simulator.name}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Completion Summary */}
          <div className="text-zinc-400 text-sm w-12 text-right flex items-start justify-end pt-0.5">
            {completedCount}/5
          </div>
        </div>
      </CardContent>
    </Card>
  );
}