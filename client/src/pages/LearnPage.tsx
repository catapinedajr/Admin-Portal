import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import BottomNavigation from "@/components/BottomNavigation";
import PWAInstallButton from "@/components/PWAInstallButton";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Crown, Gem } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown,
  ChevronUp,
  Coins,
  Clock,
  CheckCircle,
  Key,
  GraduationCap,
  Brain
} from "lucide-react";
import DailyQuiz from "@/components/DailyQuiz";
import { BitcoinTerm, AutoGlossary } from "@/components/BitcoinGlossary";
import { useAppContext } from "@/components/shared/AppContextProvider";
import { cleanText } from "@/utils/textUtils";
import { iconMap, bitcoinTerms } from "@/constants/appData";

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

function LearnPage() {
  const {
    learnSubTab,
    setLearnSubTab,
    currentDayIndex,
    isDayLockedBySubscription,
    dayCompleted,
    handleQuizCompletion,
    setShowEmailModal,
    dayAccessible,
    dayAccessInfo
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
            
            {/* Progress guidance message */}
            {!dayCompleted ? (
              <p className="text-sm text-orange-400 max-w-md mx-auto">
                Complete the quiz at the bottom to unlock tomorrow's lesson
              </p>
            ) : (
              <p className="text-sm text-green-400 max-w-md mx-auto">
                Day completed! Next lesson available tomorrow
              </p>
            )}
            
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
              {/* Today's Learning Preview */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white border-b border-zinc-700 pb-3 mb-6">Today's Learning Preview</h3>
                  <div className="space-y-4">
                    {dailyFacts && dailyFacts.length > 0 ? (
                      dailyFacts.map((fact: any) => {
                        const IconComponent = iconMap[fact.icon as keyof typeof iconMap] || Coins;
                        
                        return (
                          <div key={fact.id} className="bg-zinc-800/50 rounded-lg overflow-hidden">
                            <div className="flex items-center gap-4 p-4">
                              <div className="p-2 bg-orange-600/20 rounded-lg flex-shrink-0">
                                <IconComponent className="w-5 h-5 text-orange-400" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-white">{fact.title}</h4>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-zinc-400 text-center py-4">Loading today's preview...</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Today's Lesson */}
              {lesson && (
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Lesson Header */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white border-b border-zinc-700 pb-3">Today's Lesson</h3>
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="text-xl font-bold text-white leading-tight flex-1">{lesson.title}</h4>
                          <Badge variant="outline" className="border-zinc-700 text-zinc-400 flex-shrink-0">
                            <Clock className="w-3 h-3 mr-1" />
                            {lesson.estimatedReadTime || 3} min read
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Database-driven Lesson Content */}
                      <div className="prose prose-invert max-w-none space-y-6">
                        <div className="text-zinc-300 leading-relaxed space-y-4 text-base leading-[1.8]">
                          <div>
                            {cleanText(lesson.content)}
                          </div>
                        </div>
                        
                        {/* Database-driven Key Takeaways */}
                        {lesson.keyTakeaways && Array.isArray(lesson.keyTakeaways) && lesson.keyTakeaways.length > 0 && (
                          <div className="my-6">
                            <h5 className="font-medium text-orange-300 mb-3">Key Points</h5>
                            <div className="grid gap-2">
                              {lesson.keyTakeaways.map((point, pointIdx) => (
                                <div key={pointIdx} className="flex items-start gap-2 p-2 bg-orange-600/10 rounded-lg border border-orange-600/20">
                                  <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                                  <span className="text-orange-100 text-sm leading-relaxed">{point}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Why This Matters - Database-driven */}
                      <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700 mt-8">
                        <h4 className="text-white font-semibold mb-6 text-lg">Why This Matters</h4>
                        <div className="text-zinc-300 text-base leading-[1.7]">
                          <div>
                            {cleanText(lesson.whyItMatters || "Understanding these fundamentals helps you make informed decisions about Bitcoin and see why it represents a significant advancement in monetary technology.")}
                          </div>
                        </div>
                      </div>

                    </div>
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
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">Bitcoin Reference Guide</h3>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Essential Bitcoin terminology and concepts. Click on any term to learn more.
            </p>
          </div>

          <Card className="bg-zinc-900/50 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-lg text-white">Bitcoin Glossary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bitcoinTerms.map((termData) => (
                  <div key={termData.term} className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-orange-400 font-medium mb-1">{termData.term}</h4>
                        <p className="text-zinc-300 text-sm leading-relaxed">{termData.definition}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default LearnPageWithLayout;

function LearnPageWithLayout() {
  const [location, setLocation] = useLocation();
  const { isPremiumTier } = useSubscription();
  const [showEmailModal, setShowEmailModal] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setLocation('/')}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-sm">
                  HL
                </div>
                <div>
                  <h1 className="text-xl font-bold">HODLearn</h1>
                  <p className="text-xs text-zinc-400">How-to-learn BTC</p>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              {/* PWA Install Button */}
              <PWAInstallButton />
              
              {/* Premium Status Indicator */}
              {isPremiumTier ? (
                <div className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500 px-2.5 py-1.5 font-medium rounded flex items-center">
                  <Gem className="w-4 h-4" />
                  <span className="sr-only">Premium</span>
                </div>
              ) : (
                <Button 
                  onClick={() => setShowEmailModal(true)}
                  size="sm"
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5"
                  title="Upgrade to Premium"
                >
                  <Crown className="w-4 h-4" />
                  <span className="sr-only">Upgrade</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <LearnPage />
      </main>

      <BottomNavigation 
        activeSection="learn"
        onSectionChange={(section) => {
          if (section === 'home') setLocation('/');
          else if (section === 'money') setLocation('/money');
          else if (section === 'simulators') setLocation('/simulators');
          else if (section === 'more') setLocation('/more');
        }}
      />
    </div>
  );
}