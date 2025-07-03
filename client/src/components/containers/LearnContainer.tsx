import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  XCircle, 
  Coins,
  Shield,
  Zap,
  Lock,
  Users,
  TrendingUp,
  Globe,
  Clock,
  Award,
  Book,
  Calculator,
  Gem,
  Target,
  Brain,
  Lightbulb,
  Key,
  ArrowRight
} from 'lucide-react';

// Icon mapping for dynamic content
const iconMap = {
  '🪙': Coins,
  '🛡️': Shield,
  '⚡': Zap,
  '🔒': Lock,
  '👥': Users,
  '📈': TrendingUp,
  '🌍': Globe,
  '⏰': Clock,
  '🏆': Award,
  '📚': Book,
  '🧮': Calculator,
  '💎': Gem,
  '🎯': Target,
  '🧠': Brain,
  '💡': Lightbulb,
  '🔑': Key,
  'coins': Coins,
  'shield': Shield,
  'zap': Zap,
  'lock': Lock,
  'users': Users,
  'trending-up': TrendingUp,
  'globe': Globe,
  'clock': Clock,
  'award': Award,
  'book': Book,
  'calculator': Calculator,
  'gem': Gem,
  'target': Target,
  'brain': Brain,
  'lightbulb': Lightbulb,
  'key': Key
};

interface LearnContainerProps {
  currentDayIndex: number;
  userId: number;
  userPremium: boolean;
  learnSubTab: string;
  setLearnSubTab: (tab: string) => void;
}

export default function LearnContainer({ 
  currentDayIndex, 
  userId, 
  userPremium, 
  learnSubTab, 
  setLearnSubTab 
}: LearnContainerProps) {
  const [expandedFacts, setExpandedFacts] = useState<Set<number>>(new Set());
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);

  // API Queries for dynamic content
  const { data: dayMetadata, isLoading: metadataLoading } = useQuery({
    queryKey: ['/api/day-metadata', currentDayIndex],
    enabled: currentDayIndex > 0
  });

  const { data: dailyFacts, isLoading: factsLoading } = useQuery({
    queryKey: ['/api/daily-facts', currentDayIndex],
    enabled: currentDayIndex > 0
  });

  const { data: lesson, isLoading: lessonLoading } = useQuery({
    queryKey: ['/api/lesson', currentDayIndex],
    enabled: currentDayIndex > 0
  });

  const { data: quizQuestions, isLoading: quizLoading } = useQuery({
    queryKey: ['/api/quiz/daily', currentDayIndex],
    enabled: currentDayIndex > 0
  });

  const { data: userAnswers } = useQuery({
    queryKey: ['/api/quiz/answers', userId, new Date().toISOString().split('T')[0]],
    enabled: userId > 0
  });

  // Check if day is locked by subscription
  const isDayLockedBySubscription = !userPremium && currentDayIndex > 7;

  // Toggle fact expansion
  const toggleFactExpansion = (factId: number) => {
    const newExpanded = new Set(expandedFacts);
    if (newExpanded.has(factId)) {
      newExpanded.delete(factId);
    } else {
      newExpanded.add(factId);
    }
    setExpandedFacts(newExpanded);
  };

  // Handle quiz answer selection
  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Submit quiz answers
  const submitQuiz = async () => {
    if (!quizQuestions || Object.keys(selectedAnswers).length !== quizQuestions.length) {
      return;
    }

    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sessionId')}`
        },
        body: JSON.stringify({
          answers: Object.entries(selectedAnswers).map(([questionId, answer]) => ({
            questionId: parseInt(questionId),
            selectedAnswer: answer,
            date: new Date().toISOString().split('T')[0]
          }))
        })
      });

      if (response.ok) {
        setShowResults(true);
      }
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    }
  };

  if (learnSubTab === "today") {
    return (
      <div className="space-y-6">
        {/* Day Header */}
        <div className="text-center space-y-3">
          {metadataLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-32 mx-auto" />
              <Skeleton className="h-10 w-64 mx-auto" />
            </div>
          ) : dayMetadata ? (
            <div className="space-y-3">
              {/* Monthly Theme */}
              <div className="inline-flex items-center px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
                <span className="text-orange-400 text-sm font-medium uppercase tracking-wide">
                  {dayMetadata.theme}
                </span>
              </div>
              
              {/* Daily Topic */}
              <h2 className="text-2xl font-bold text-white leading-tight">
                {dayMetadata.title}
              </h2>
            </div>
          ) : (
            <div className="text-center text-zinc-400">Loading day information...</div>
          )}

          {/* Progress indicator */}
          <div className="text-sm text-zinc-400">
            Day {currentDayIndex} of your Bitcoin journey
          </div>
        </div>

        {/* Subscription Lock */}
        {isDayLockedBySubscription && (
          <Card className="bg-zinc-900 border-orange-500">
            <CardContent className="p-6 text-center">
              <Lock className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Premium Content</h3>
              <p className="text-zinc-300 mb-4">
                Upgrade to continue your Bitcoin journey beyond Day 7
              </p>
              <Button className="bg-orange-500 hover:bg-orange-600">
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Daily Facts */}
        {!isDayLockedBySubscription && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white border-b border-zinc-700 pb-3 mb-6">
                Today's Bitcoin Insights
              </h3>
              
              {factsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              ) : dailyFacts && dailyFacts.length > 0 ? (
                <div className="space-y-4">
                  {dailyFacts.map((fact: any) => {
                    const IconComponent = iconMap[fact.icon as keyof typeof iconMap] || Lightbulb;
                    const isExpanded = expandedFacts.has(fact.id);
                    
                    return (
                      <div key={fact.id} className="border border-zinc-700 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-orange-600/10 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-4 h-4 text-orange-500" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-2">{fact.title}</h4>
                            
                            {fact.diveDeeper && (
                              <button
                                onClick={() => toggleFactExpansion(fact.id)}
                                className="flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
                              >
                                {isExpanded ? 'Show Less' : 'Dive Deeper'}
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            )}
                            
                            {isExpanded && fact.diveDeeper && (
                              <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg space-y-3">
                                <p className="text-zinc-300 text-sm leading-relaxed">
                                  {fact.diveDeeper.explanation}
                                </p>
                                
                                {fact.diveDeeper.examples && (
                                  <div className="space-y-2">
                                    <h5 className="text-orange-300 font-medium text-sm">Examples:</h5>
                                    <ul className="space-y-1">
                                      {JSON.parse(fact.diveDeeper.examples).map((example: string, index: number) => (
                                        <li key={index} className="text-zinc-400 text-sm flex items-start gap-2">
                                          <span className="text-orange-400 mt-0.5">•</span>
                                          {example}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                {fact.diveDeeper.visualDescription && (
                                  <div className="space-y-2">
                                    <h5 className="text-orange-300 font-medium text-sm">Visual Description:</h5>
                                    <p className="text-zinc-400 text-sm">
                                      {fact.diveDeeper.visualDescription}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-zinc-400">No facts available for this day</div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Today's Lesson */}
        {!isDayLockedBySubscription && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Book className="w-5 h-5 text-orange-400" />
                Today's Lesson
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lessonLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : lesson ? (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white">{lesson.title}</h3>
                  
                  <div className="prose prose-zinc prose-invert max-w-none">
                    {lesson.content.split('\n\n').map((paragraph: string, index: number) => (
                      <p key={index} className="text-zinc-300 leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  
                  {lesson.keyTakeaways && (
                    <div className="bg-orange-950/20 border border-orange-800/30 rounded-lg p-4">
                      <h4 className="text-orange-300 font-semibold mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Key Takeaways
                      </h4>
                      <ul className="space-y-2">
                        {JSON.parse(lesson.keyTakeaways).map((takeaway: string, index: number) => (
                          <li key={index} className="text-zinc-300 text-sm flex items-start gap-2">
                            <span className="text-orange-400 mt-0.5">•</span>
                            {takeaway}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {lesson.whyItMatters && (
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                      <h4 className="text-zinc-200 font-semibold mb-2 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        Why It Matters
                      </h4>
                      <p className="text-zinc-300 text-sm leading-relaxed">
                        {lesson.whyItMatters}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-zinc-400">No lesson available for this day</div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Daily Quiz */}
        {!isDayLockedBySubscription && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-orange-400" />
                Knowledge Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quizLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-6 w-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : quizQuestions && quizQuestions.length > 0 ? (
                <div className="space-y-6">
                  {quizQuestions.map((question: any, qIndex: number) => {
                    const userAnswer = userAnswers?.find((a: any) => a.questionId === question.id);
                    const selectedAnswer = selectedAnswers[question.id] || userAnswer?.selectedAnswer;
                    const isCorrect = selectedAnswer === question.correctAnswer;
                    
                    return (
                      <div key={question.id} className="space-y-4">
                        <h4 className="font-semibold text-white">
                          {qIndex + 1}. {question.question}
                        </h4>
                        
                        <div className="grid gap-2">
                          {['A', 'B', 'C', 'D'].map((option) => {
                            const optionText = question[`option${option}`];
                            const isSelected = selectedAnswer === option;
                            const isCorrectOption = question.correctAnswer === option;
                            
                            return (
                              <button
                                key={option}
                                onClick={() => handleAnswerSelect(question.id, option)}
                                disabled={showResults || userAnswer}
                                className={`p-3 rounded-lg border text-left transition-colors ${
                                  isSelected
                                    ? (showResults || userAnswer)
                                      ? isCorrect
                                        ? 'bg-green-900/50 border-green-600 text-green-100'
                                        : 'bg-red-900/50 border-red-600 text-red-100'
                                      : 'bg-orange-900/50 border-orange-600 text-orange-100'
                                    : (showResults || userAnswer) && isCorrectOption
                                      ? 'bg-green-900/30 border-green-700 text-green-200'
                                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-600'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="font-medium">{option}.</span>
                                  <span>{optionText}</span>
                                  {(showResults || userAnswer) && isSelected && (
                                    isCorrect ? <CheckCircle className="w-5 h-5 text-green-400 ml-auto" /> : <XCircle className="w-5 h-5 text-red-400 ml-auto" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        
                        {(showResults || userAnswer) && question.explanation && (
                          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                            <p className="text-zinc-300 text-sm">
                              <strong>Explanation:</strong> {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {!showResults && !userAnswers?.length && (
                    <Button
                      onClick={submitQuiz}
                      disabled={Object.keys(selectedAnswers).length !== quizQuestions.length}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                    >
                      Submit Quiz
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center text-zinc-400">No quiz available for this day</div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Reference Tab
  if (learnSubTab === "reference") {
    return (
      <div className="space-y-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">Bitcoin Glossary</h3>
            <p className="text-zinc-400">
              Reference section will be populated with dynamic glossary content from the database.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="text-center text-zinc-400">
      Select a tab to view content
    </div>
  );
}