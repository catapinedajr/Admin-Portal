import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Calendar, CheckCircle, ArrowRight } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import DailyQuiz from "@/components/DailyQuiz";
import type { User } from "@shared/schema";

export default function Learn() {
  const [activeTab, setActiveTab] = useState("today");
  
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const { data: nextDay } = useQuery({
    queryKey: ["/api/next-available-day", user?.id],
    enabled: !!user?.id,
  });

  const currentDay = (nextDay as any)?.dayIndex || 1;

  const { data: dayMetadata } = useQuery({
    queryKey: ["/api/day-metadata", currentDay],
  });

  const { data: dailyFacts } = useQuery({
    queryKey: ["/api/daily-facts", currentDay],
  });

  const { data: lesson } = useQuery({
    queryKey: ["/api/lesson", currentDay],
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Learn Bitcoin</h1>
          <Badge variant="outline" className="border-orange-600 text-orange-400">
            Day {currentDay}
          </Badge>
        </div>
        <p className="text-zinc-400 mt-1">
          Day {currentDay} of your Bitcoin journey
        </p>
      </header>

      {/* Tab Navigation */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="flex overflow-x-auto p-4 gap-2">
          <Button
            variant={activeTab === "today" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("today")}
            className="whitespace-nowrap"
          >
            Today
          </Button>
          <Button
            variant={activeTab === "reference" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("reference")}
            className="whitespace-nowrap"
          >
            Reference
          </Button>
        </div>
      </div>

      <main className="p-4 pb-20">
        {activeTab === "today" && (
          <div className="space-y-6">
            {/* Today's Topic */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  {(dayMetadata as any)?.title || "Today's Topic"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400 mb-4">
                  Ready to continue your Bitcoin learning journey? Let's dive into today's lesson.
                </p>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Start Today's Lesson
                </Button>
              </CardContent>
            </Card>

            {/* Daily Facts Preview */}
            {dailyFacts && Array.isArray(dailyFacts) && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Today's Bitcoin Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dailyFacts.slice(0, 3).map((fact: any, index: number) => (
                      <div key={fact.id} className="flex items-start gap-3 p-3 bg-zinc-800/50 rounded-lg">
                        <div className="w-6 h-6 bg-orange-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-orange-400 text-xs font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-zinc-200">{fact.title}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Today's Quiz */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Knowledge Check</CardTitle>
              </CardHeader>
              <CardContent>
                <DailyQuiz dayIndex={currentDay} />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "reference" && (
          <div className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-zinc-400 mb-2">
                  Reference Materials
                </h3>
                <p className="text-zinc-500">Bitcoin glossary and reference materials coming soon...</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}