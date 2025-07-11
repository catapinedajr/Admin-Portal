import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import BottomNavigation from "@/components/BottomNavigation";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Crown, Gem, User as UserIcon, ChevronDown, ChevronUp, Wallet, Clock, CheckCircle, Key, GraduationCap, Brain, TrendingUp, Zap, Award, Sparkles, Trophy, Coins } from "@/lib/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DailyQuiz from "@/components/DailyQuiz";
import { BitcoinTerm, AutoGlossary } from "@/components/BitcoinGlossary";
import { useAppContext } from "@/components/shared/AppContextProvider";
import { cleanText } from "@/utils/textUtils";
import { iconMap, bitcoinTerms } from "@/constants/appData";
import { queryClient } from "@/lib/queryClient";
import HODLearnCard from "@/components/HODLearnCard";
import "../styles/reading-enhancement.css";

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
    dayAccessInfo,
    setTestDayOverride
  } = useAppContext();

  // Animation state for earning satoshis
  const [showEarningAnimation, setShowEarningAnimation] = useState(false);
  const [earnedSats, setEarnedSats] = useState(0);
  
  // Reading enhancement state
  const [activeReadingParagraph, setActiveReadingParagraph] = useState<number | null>(null);
  const lessonContentRef = useRef<HTMLDivElement>(null);

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



  // Helper function to get time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good evening";
  };

  // Reading enhancement effect - tracks paragraph visibility
  useEffect(() => {
    if (!lesson) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px', // Trigger when paragraph is in center 60% of viewport
      threshold: 0.8
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const paragraphIndex = parseInt(entry.target.getAttribute('data-paragraph') || '0');
        
        if (entry.isIntersecting) {
          setActiveReadingParagraph(paragraphIndex);
          
          // Add reading-mode class to content container
          const contentContainer = entry.target.closest('.lesson-content');
          if (contentContainer) {
            contentContainer.classList.add('reading-mode');
          }
        }
      });
    }, observerOptions);

    // Observe all lesson paragraphs
    const paragraphs = document.querySelectorAll('.lesson-paragraph');
    paragraphs.forEach((p) => observer.observe(p));

    return () => {
      observer.disconnect();
    };
  }, [lesson]);

  // Update paragraph highlighting based on active reading position
  useEffect(() => {
    const paragraphs = document.querySelectorAll('.lesson-paragraph');
    paragraphs.forEach((p, index) => {
      if (index === activeReadingParagraph) {
        p.classList.add('in-view');
      } else {
        p.classList.remove('in-view');
      }
    });
  }, [activeReadingParagraph]);

  // Helper function to get user's first name
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
    queryFn: () => fetch('/api/user').then(res => res.json())
  });

  // Get quiz score for today to determine completion status
  const today = new Date().toISOString().split('T')[0];
  const userId = user?.id || 1; // Fallback to user ID 1 for testing
  const { data: quizScore } = useQuery({
    queryKey: ['/api/quiz/score', userId, today],
    queryFn: () => {
      const sessionId = localStorage.getItem('hodlearn_session');
      return fetch(`/api/quiz/score/${userId}/${today}?dayIndex=${currentDayIndex}`, {
        headers: sessionId ? { 'Authorization': `Bearer ${sessionId}` } : {}
      }).then(res => {
        if (!res.ok) return null;
        return res.json();
      });
    },
    retry: false
  });

  // Check if quiz is completed (based on actual quiz score data)
  const isQuizCompleted = quizScore && quizScore.total > 0;

  // Get wallet data for learning progress (demo mode)
  const { data: walletData } = useQuery({
    queryKey: ['/api/wallet/progress'],
    retry: false,
    refetchOnWindowFocus: false,
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
    if (isQuizCompleted) {
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



  // Animation function to trigger earning satoshis
  const triggerEarningAnimation = async (sats: number) => {
    setEarnedSats(sats);
    setShowEarningAnimation(true);
    
    // Make API call to record earning (demo mode - no auth needed)
    try {
      const today = new Date().toISOString().split('T')[0];
      
      await fetch('/api/wallet/earn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayIndex: currentDayIndex,
          earningType: 'quiz_correct',
          satoshisEarned: sats,
          bitcoinPriceUsd: 109256, // Will be updated with real price from API
          description: `Correct answer on Day ${currentDayIndex} quiz`,
          date: today
        }),
        credentials: 'same-origin'
      });
      
      // Refresh wallet data after earning
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/progress'] });
    } catch (error) {
      console.error('Failed to record earning:', error);
    }
    
    // Hide the animation after 3 seconds
    setTimeout(() => {
      setShowEarningAnimation(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 pb-24">
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
        <div className="space-y-4">
          <div className="text-center space-y-3">
            {/* Streamlined Header with Better Hierarchy */}
            {dayMetadata && (
              <div className="space-y-3">
                {/* Monthly Theme - Simple Badge with Subtle Completion State */}
                <div className={`inline-flex items-center gap-2 px-3 py-1 border rounded-full transition-colors duration-300 ${
                  isQuizCompleted 
                    ? 'bg-green-500/10 border-green-500/20' 
                    : 'bg-orange-500/10 border-orange-500/20'
                }`}>
                  {isQuizCompleted && <Trophy className="w-4 h-4 text-green-400" />}
                  <span className={`text-lg font-semibold uppercase tracking-wide ${
                    isQuizCompleted ? 'text-green-400' : 'text-orange-400'
                  }`}>
                    {isQuizCompleted ? 'DAY COMPLETED' : dayMetadata.theme}
                  </span>
                </div>
                
                {/* Daily Topic - Main Title */}
                <h2 className="text-2xl font-bold text-white leading-tight">
                  {dayMetadata.title}
                </h2>
              </div>
            )}
          </div>

          {/* Progress Indicator - Compact */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-800/50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
              <span className="text-sm font-medium text-zinc-300">
                Day {currentDayIndex} of your Bitcoin journey
              </span>
            </div>
            
            {/* Dev Day Toggle - Hidden in normal use */}
            {process.env.NODE_ENV === 'development' && (
              <div className="flex justify-center">
                <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900/50 rounded text-xs">
                  <span className="text-zinc-500">Dev:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newDay = Math.max(1, currentDayIndex - 1);
                      setTestDayOverride(newDay);
                    }}
                    className="h-6 w-6 p-0 text-[10px] hover:bg-orange-500/20"
                    disabled={currentDayIndex <= 1}
                  >
                    ←
                  </Button>
                  <span className="text-orange-400 font-medium min-w-[2rem] text-center">
                    Day {currentDayIndex}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newDay = Math.min(30, currentDayIndex + 1);
                      setTestDayOverride(newDay);
                    }}
                    className="h-6 w-6 p-0 text-[10px] hover:bg-orange-500/20"
                    disabled={currentDayIndex >= 30}
                  >
                    →
                  </Button>
                </div>
              </div>
            )}
          </div>
            
          {/* Compact Progress guidance message */}
          <div className="text-center">
            {!isQuizCompleted ? (
              <p className="text-xs text-orange-400 max-w-md mx-auto">
                Complete the quiz to unlock tomorrow's lesson
              </p>
            ) : (
              <p className="text-xs text-green-400 max-w-md mx-auto">
                Day completed! Next lesson available tomorrow
              </p>
            )}
          </div>

          {/* Learning Progress Wallet Display */}
          {walletData && (
            <div className="relative">
              {/* Main Wallet Card */}
              <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/20 mx-auto max-w-md">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Title */}
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-orange-400">Your Learning Progress</h3>
                      <p className="text-xs text-zinc-500">Satoshis earned from daily lessons</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                          <Wallet className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-orange-400">
                            {walletData.totalSatoshisEarned?.toLocaleString() || 0} sats
                          </div>
                          <div className="text-xs text-zinc-400">
                            ≈ ${(walletData.totalUsdValue || 0).toFixed(2)} USD
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-orange-400">
                          <Zap className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {walletData.currentStreakMultiplier || 1}x
                          </span>
                        </div>
                        <div className="text-xs text-zinc-500">multiplier</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating Earning Animation */}
              {showEarningAnimation && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="animate-bounce">
                    <div className="flex items-center gap-2 bg-green-500/90 text-white px-3 py-2 rounded-full shadow-lg">
                      <Sparkles className="w-4 h-4" />
                      <span className="font-bold">+{earnedSats} sats!</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

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
              {/* Today's Learning Preview - Using HODLearn Card Format */}
              <HODLearnCard variant="interactive">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-6">Today's Learning Preview</h3>
                  <div className="space-y-4">
                    {dailyFacts && dailyFacts.length > 0 ? (
                      dailyFacts.map((fact: any, index: number) => {
                        // Check if this section is completed based on user progress
                        const isCompleted = quizScore && quizScore.total > 0;
                        
                        return (
                          <div key={fact.id} className={`rounded-lg overflow-hidden transition-all duration-300 ${
                            isCompleted 
                              ? "bg-zinc-800/70 border border-orange-400/40" 
                              : "bg-zinc-800/50 border border-zinc-700/50"
                          }`}>
                            <div className="flex items-center gap-4 p-4">
                              <div className={`p-2 rounded-lg flex-shrink-0 transition-all duration-300 ${
                                isCompleted ? "bg-orange-500/30" : "bg-orange-600/20"
                              }`}>
                                <Coins className={`w-5 h-5 transition-all duration-300 ${
                                  isCompleted ? "text-orange-300" : "text-orange-400"
                                }`} />
                              </div>
                              <div className="flex-1">
                                <h4 className={`font-semibold transition-all duration-300 ${
                                  isCompleted ? "text-orange-100" : "text-white"
                                }`}>{fact.title}</h4>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-zinc-400 text-center py-4">Loading today's preview...</p>
                    )}
                  </div>
                </div>
              </HODLearnCard>

              {/* Today's Lesson - Using HODLearn Card Format */}
              {lesson && (
                <HODLearnCard variant="interactive">
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
                    
                    {/* Database-driven Lesson Content with Reading Enhancement */}
                    <div className="prose prose-invert max-w-none space-y-6">
                      <div className="lesson-content text-zinc-300 leading-relaxed space-y-4 text-base leading-[1.8]">
                        {lesson.content && lesson.content.split(/\n\s*\n/).filter(p => p.trim()).map((paragraph, index) => {
                          // Handle bold formatting within paragraphs
                          const parts = paragraph.split(/\*\*(.*?)\*\*/g);
                          const formattedContent = parts.map((part, partIndex) => {
                            if (partIndex % 2 === 0) {
                              return part;
                            } else {
                              return <strong key={partIndex} className="font-semibold text-white">{part}</strong>;
                            }
                          });
                          
                          return (
                            <p 
                              key={index} 
                              className="lesson-paragraph transition-all duration-500 ease-out p-3 rounded-lg border border-transparent hover:border-orange-500/20 hover:bg-orange-500/5 hover:shadow-lg hover:shadow-orange-500/10 hover:scale-[1.01] cursor-pointer"
                              onClick={() => {
                                // Smooth scroll to center this paragraph
                                const element = document.querySelector(`[data-paragraph="${index}"]`);
                                if (element) {
                                  element.scrollIntoView({ 
                                    behavior: 'smooth', 
                                    block: 'center' 
                                  });
                                }
                              }}
                              data-paragraph={index}
                            >
                              {formattedContent}
                            </p>
                          );
                        })}
                      </div>
                      
                      {/* Database-driven Key Takeaways - Simple and Clean */}
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
                        {(lesson.whyItMatters || "Understanding these fundamentals helps you make informed decisions about Bitcoin and see why it represents a significant advancement in monetary technology.").split(/\*\*(.*?)\*\*/g).map((part, index) => {
                          if (index % 2 === 0) {
                            return <span key={index}>{part}</span>;
                          } else {
                            return <strong key={index} className="font-semibold text-white">{part}</strong>;
                          }
                        })}
                      </div>
                    </div>

                  </div>
                </HODLearnCard>
              )}

              {/* Daily Quiz - Using HODLearn Card Format */}
              <HODLearnCard variant="interactive">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xl text-white font-semibold flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-orange-500" />
                      Knowledge Check
                    </div>
                    {isQuizCompleted && (
                      <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                        <Trophy className="w-3 h-3" />
                        COMPLETED
                      </div>
                    )}
                  </div>
                  
                  {/* Simple Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-zinc-400">
                      <span>Daily Challenge</span>
                      <span>100 sats per correct answer</span>
                    </div>
                    <div className="w-full bg-zinc-700 rounded-full h-1">
                      <div 
                        className="h-full bg-orange-500 rounded-full transition-all duration-300" 
                        style={{ width: isQuizCompleted ? '100%' : '25%' }}
                      ></div>
                    </div>
                  </div>

                  <DailyQuiz
                    dayIndex={currentDayIndex}
                    onCompletion={handleQuizCompletion}
                    onEarning={triggerEarningAnimation}
                    dayCompleted={dayCompleted}
                  />
                </div>
              </HODLearnCard>
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
                  <h1 className="text-xl font-bold">HODLearn™</h1>
                  <p className="text-xs text-zinc-400">How-to-learn BTC</p>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              {/* Wallet Button */}
              <Button 
                onClick={() => setLocation('/wallet')}
                size="sm"
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5"
                title="Learning Wallet"
              >
                <Wallet className="w-4 h-4" />
                <span className="sr-only">Wallet</span>
              </Button>
              
              {/* Account Button */}
              <Button 
                onClick={() => setLocation('/account')}
                size="sm"
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5"
                title="Account Settings"
              >
                <UserIcon className="w-4 h-4" />
                <span className="sr-only">Account</span>
              </Button>
              

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