import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  BookOpen, 
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Brain,
  Key
} from "lucide-react";
import DailyQuiz from "@/components/DailyQuiz";
import { BitcoinTerm, AutoGlossary } from "@/components/BitcoinGlossary";
import { useAppContext } from "@/components/shared/AppContextProvider";
import { cleanText, getExpandedLessonContent } from "@/utils/textUtils";

// Temporary interface for database-driven lesson content
interface LessonWithKeyTakeaways {
  id: number;
  dayId: number;
  title: string;
  content: string;
  keyTakeaways: string[];
  whyItMatters?: string;
  estimatedReadTime: number;
  createdAt: string;
}

export default function LearnPage() {
  const {
    learnSubTab,
    setLearnSubTab,
    currentDayIndex,
    dayAccessible,
    isDayLockedBySubscription,
    dayAccessInfo,
    dayCompleted,
    nextAvailableDay,
    handleQuizCompletion,
    expandedTopics,
    setExpandedTopics,
    isPremiumTier,
    setShowEmailModal
  } = useAppContext();

  // Local state for expandable content
  const [expandedFacts, setExpandedFacts] = useState<Set<number>>(new Set());

  // Get day metadata
  const { data: dayMetadata } = useQuery({
    queryKey: ['/api/day-metadata', currentDayIndex],
    queryFn: () => fetch(`/api/day-metadata/${currentDayIndex}`).then(res => res.json())
  });

  // Get lesson data
  const { data: lesson, isLoading: lessonLoading } = useQuery<LessonWithKeyTakeaways>({
    queryKey: ['/api/lesson', currentDayIndex],
    queryFn: () => fetch(`/api/lesson/${currentDayIndex}`).then(res => res.json())
  });

  // Get daily facts
  const { data: dailyFacts } = useQuery({
    queryKey: ['/api/daily-facts', currentDayIndex],
    queryFn: () => fetch(`/api/daily-facts/${currentDayIndex}`).then(res => res.json())
  });

  // Get dive deeper content for facts
  const { data: diveDeeperContent = [] } = useQuery({
    queryKey: ['/api/dive-deeper', currentDayIndex],
    queryFn: () => fetch(`/api/dive-deeper/${currentDayIndex}`).then(res => res.json())
  });

  // Helper function to get time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good evening";
  };

  // Helper function to get user's first name
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
    queryFn: () => fetch('/api/user').then(res => res.json())
  });

  const getPersonalizedGreeting = () => {
    const timeGreeting = getTimeBasedGreeting();
    if (user?.firstName) {
      return `${timeGreeting}, ${user.firstName}!`;
    }
    return `${timeGreeting}!`;
  };

  // Helper function to get motivational message based on streak
  const getMotivationalMessage = () => {
    if (dayCompleted) {
      return "Excellent work today! Come back tomorrow to continue your Bitcoin journey.";
    }
    
    const completedDays = currentDayIndex - 1;
    
    if (completedDays === 0) {
      return "Every Bitcoin journey begins with a single step. Take your time!";
    } else if (completedDays < 7) {
      return "Building momentum on your journey. Consistency is key!";
    } else if (completedDays < 30) {
      return "Steady progress along your Bitcoin path. You're doing great!";
    } else {
      return "A remarkable journey of Bitcoin discovery. Keep going!";
    }
  };

  const toggleFactExpansion = (factId: number) => {
    const newExpanded = new Set(expandedFacts);
    if (newExpanded.has(factId)) {
      newExpanded.delete(factId);
    } else {
      newExpanded.add(factId);
    }
    setExpandedFacts(newExpanded);
  };

  const getDiveDeeperForFact = (factTitle: string) => {
    return diveDeeperContent.find((content: any) => 
      content.factTitle === factTitle
    );
  };

  return (
    <div className="space-y-6">
      {/* Learn Sub-navigation */}
      <div className="flex justify-center">
        <div className="flex flex-wrap justify-center gap-2 bg-zinc-800/50 rounded-lg p-2">
          <Button
            variant={learnSubTab === "today" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setLearnSubTab("today")}
            className="text-xs px-3 py-1"
          >
            Today
          </Button>

          <Button
            variant={learnSubTab === "reference" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setLearnSubTab("reference")}
            className="text-xs px-3 py-1"
          >
            Reference
          </Button>
        </div>
      </div>

      {/* Today's Learning */}
      {learnSubTab === "today" && (
        <div className="space-y-6">
          <div className="text-center space-y-3">
            {/* Streamlined Header with Better Hierarchy */}
            {dayMetadata && (
              <div className="space-y-3">
                {/* Monthly Theme - Subtle Badge */}
                <div className="inline-flex items-center px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
                  <span className="text-orange-400 text-lg font-semibold uppercase tracking-wide">
                    {dayMetadata.theme}
                  </span>
                </div>
                
                {/* Daily Topic - Main Title */}
                <h2 className="text-2xl font-bold text-white leading-tight">
                  {dayMetadata.title}
                </h2>
              </div>
            )}
          </div>

          {/* Progress Indicator - Minimal and Habit-focused */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
              <span className="text-base font-medium text-zinc-300">
                Day {currentDayIndex} of your Bitcoin journey
              </span>
            </div>
            
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              {getMotivationalMessage()}
            </p>
          </div>

          {/* Content Gating Logic */}
          {isDayLockedBySubscription ? (
            <Card className="bg-gradient-to-br from-orange-950/30 via-zinc-900 to-amber-950/30 border-orange-500/30">
              <CardContent className="p-8 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-4">
                  <Key className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Premium Content</h3>
                <p className="text-zinc-300 max-w-md mx-auto">
                  Day {currentDayIndex} and beyond are part of our premium curriculum. Upgrade to continue your Bitcoin education journey.
                </p>
                <Button 
                  onClick={() => setShowEmailModal(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2"
                >
                  Upgrade to Premium
                </Button>
              </CardContent>
            </Card>
          ) : !dayAccessible && dayAccessInfo && !dayAccessInfo.canAccess ? (
            <Card className="bg-gradient-to-br from-blue-950/30 via-zinc-900 to-purple-950/30 border-blue-500/30">
              <CardContent className="p-8 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
                  <Brain className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Available Tomorrow</h3>
                <p className="text-zinc-300 max-w-md mx-auto">
                  Good learning takes time to absorb. Day {currentDayIndex} will be available tomorrow. 
                  Keep up the great habit-building!
                </p>
                <div className="text-sm text-zinc-400">
                  Building conviction requires patience and consistency
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Today's Bitcoin Insights */}
              <Card className="bg-zinc-900/50 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-orange-500" />
                    Today's Bitcoin Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dailyFacts && dailyFacts.length > 0 ? (
                    dailyFacts.map((fact: any, index: number) => {
                      const diveDeeper = getDiveDeeperForFact(fact.title);
                      const isExpanded = expandedFacts.has(fact.id);
                      
                      return (
                        <div key={fact.id} className="border border-zinc-700 rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-white text-base mb-2">{fact.title}</h4>
                              <p className="text-zinc-300 text-sm leading-relaxed">{fact.content}</p>
                            </div>
                          </div>
                          
                          {diveDeeper && (
                            <div className="space-y-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFactExpansion(fact.id)}
                                className="text-orange-400 hover:text-orange-300 p-0 h-auto font-normal text-sm"
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="w-4 h-4 mr-1" />
                                    Show Less
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-4 h-4 mr-1" />
                                    Dive Deeper
                                  </>
                                )}
                              </Button>
                              
                              {isExpanded && (
                                <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3 border-l-2 border-orange-500/50">
                                  <div className="space-y-3">
                                    <div>
                                      <h5 className="font-medium text-zinc-200 mb-2">Explanation</h5>
                                      <p className="text-zinc-300 text-sm leading-relaxed">{diveDeeper.explanation}</p>
                                    </div>
                                    
                                    {diveDeeper.examples && (
                                      <div>
                                        <h5 className="font-medium text-zinc-200 mb-2">Examples</h5>
                                        <p className="text-zinc-300 text-sm leading-relaxed">{diveDeeper.examples}</p>
                                      </div>
                                    )}
                                    
                                    {diveDeeper.visualDescription && (
                                      <div>
                                        <h5 className="font-medium text-zinc-200 mb-2">Visual Description</h5>
                                        <p className="text-zinc-300 text-sm leading-relaxed">{diveDeeper.visualDescription}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-zinc-400 text-center py-4">Loading today's insights...</p>
                  )}
                </CardContent>
              </Card>

              {/* Today's Lesson */}
              {lesson && (
                <Card className="bg-zinc-900/50 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-xl text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-orange-500" />
                      Today's Lesson
                    </CardTitle>
                    {lesson.estimatedReadTime && (
                      <p className="text-sm text-zinc-400">
                        {lesson.estimatedReadTime} minute read
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="prose prose-invert max-w-none">
                      <div className="space-y-4">
                        {getExpandedLessonContent(lesson.title, lesson.content).map((section, index: number) => (
                          <div key={index} className="space-y-4">
                            <h5 className="text-orange-400 font-semibold text-lg">{section.title}</h5>
                            {section.paragraphs.map((paragraph, pIndex) => (
                              <p key={pIndex} className="text-zinc-300 leading-relaxed text-base">
                                {cleanText(paragraph)}
                              </p>
                            ))}
                            {section.keyPoints && section.keyPoints.length > 0 && (
                              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                                <ul className="space-y-2">
                                  {section.keyPoints.map((point, kIndex) => (
                                    <li key={kIndex} className="text-orange-200 text-sm flex items-baseline gap-2">
                                      <span className="text-orange-500 text-xs">●</span>
                                      {point}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {section.realWorldExample && (
                              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                                <p className="text-blue-200 text-sm font-medium mb-2">Real-World Example:</p>
                                <p className="text-blue-100 text-sm">{section.realWorldExample}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                        <h4 className="font-semibold text-orange-400 mb-3 flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          Key Takeaways
                        </h4>
                        <ul className="space-y-2">
                          {lesson.keyTakeaways.map((takeaway: string, index: number) => (
                            <li key={index} className="flex items-baseline gap-2 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0 mt-2"></div>
                              <span className="text-zinc-300 leading-relaxed">{takeaway}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {lesson.whyItMatters && (
                      <div className="bg-zinc-800/50 border border-zinc-600 rounded-lg p-4">
                        <h4 className="font-semibold text-zinc-200 mb-2">Why It Matters</h4>
                        <p className="text-zinc-300 text-sm leading-relaxed">{lesson.whyItMatters}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Daily Quiz */}
              <Card className="bg-zinc-900/50 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-orange-500" />
                    Knowledge Check
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DailyQuiz
                    dayIndex={currentDayIndex}
                    onCompletion={handleQuizCompletion}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Reference Tab */}
      {learnSubTab === "reference" && (
        <div className="space-y-6">
          <Card className="bg-zinc-900/50 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">Bitcoin Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-zinc-300">
                <p>Bitcoin glossary and reference content will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}