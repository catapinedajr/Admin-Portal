import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Brain, Trophy, ChevronLeft, ChevronRight, AlertCircle, RotateCcw } from "@/lib/icons";
import { apiRequest } from "@/lib/queryClient";
import SatsRewardAnimation from "@/components/animations/SatsRewardAnimation";

interface QuizQuestion {
  id: number;
  dayIndex: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string;
  category: string;
  difficulty: string;
}

interface QuizAnswer {
  id: number;
  userId: number;
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
  answeredAt: string;
  date: string;
  explanation?: string;
}

interface QuizScore {
  correct: number;
  total: number;
  percentage: number;
}

interface DailyQuizProps {
  dayIndex: number;
  onCompletion?: () => void; // Callback when quiz is completed successfully
  onEarning?: (sats: number) => void; // Callback when user earns satoshis
  dayCompleted?: boolean; // Whether the day is already completed
}

export default function DailyQuiz({ dayIndex, onCompletion, onEarning, dayCompleted = false }: DailyQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, QuizAnswer>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSatsAnimation, setShowSatsAnimation] = useState(false);
  const [animationSatsAmount, setAnimationSatsAmount] = useState(0);
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  const queryClient = useQueryClient();
  const completionTriggeredRef = useRef(false);
  
  const today = new Date().toISOString().split('T')[0];
  
  // Get authenticated user
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
  });
  
  const userId = user?.id || 1; // Fallback to user ID 1 for testing

  // Fetch quiz questions for today
  const { data: questions = [], isLoading: loadingQuestions, error: questionsError } = useQuery({
    queryKey: ['/api/quiz/daily', dayIndex],
    queryFn: async () => {
      const res = await fetch(`/api/quiz/daily/${dayIndex}`);
      if (!res.ok) {
        throw new Error(`Failed to load quiz questions: ${res.status}`);
      }
      return res.json() as Promise<QuizQuestion[]>;
    },
    retry: 3,
    retryDelay: 1000,
    enabled: true // Allow quiz questions to load without authentication for testing
  });

  // Fetch user's previous answers for today
  const { data: userAnswers = [] } = useQuery({
    queryKey: ['/api/quiz/answers', userId, today],
    queryFn: () => {
      const sessionId = localStorage.getItem('hodlearn_session');
      const headers: Record<string, string> = {};
      
      if (sessionId) {
        headers['Authorization'] = `Bearer ${sessionId}`;
      }
      
      return fetch(`/api/quiz/answers/${userId}/${today}`, { 
        headers,
        credentials: 'same-origin' 
      }).then(res => res.json()) as Promise<QuizAnswer[]>;
    }
  });

  // Fetch quiz score for today
  const { data: score } = useQuery({
    queryKey: ['/api/quiz/score', userId, today, dayIndex],
    queryFn: () => {
      const sessionId = localStorage.getItem('hodlearn_session');
      const headers: Record<string, string> = {};
      
      if (sessionId) {
        headers['Authorization'] = `Bearer ${sessionId}`;
      }
      
      return fetch(`/api/quiz/score/${userId}/${today}?dayIndex=${dayIndex}`, { 
        headers,
        credentials: 'same-origin' 
      }).then(res => res.json()) as Promise<QuizScore>;
    },
    enabled: userAnswers.length > 0
  });

  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: async (answer: { questionId: number; selectedAnswer: string; date: string }) => {
      try {
        const sessionId = localStorage.getItem('hodlearn_session');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        
        if (sessionId) {
          headers['Authorization'] = `Bearer ${sessionId}`;
        }
        
        const response = await fetch('/api/quiz/submit', {
          method: 'POST',
          headers,
          body: JSON.stringify(answer),
          credentials: 'same-origin'
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to submit answer (${response.status}): ${errorText}`);
        }
        
        return await response.json() as QuizAnswer;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      setSubmittedAnswers(prev => ({
        ...prev,
        [variables.questionId]: data
      }));
      
      // Trigger earning animation if answer is correct
      if (data.isCorrect) {
        const satsEarned = 100; // Award 100 satoshis for correct answer
        setAnimationSatsAmount(satsEarned);
        setShowSatsAnimation(true);
        
        if (onEarning) {
          onEarning(satsEarned);
        }
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/quiz/answers', userId, today] });
      queryClient.invalidateQueries({ queryKey: ['/api/quiz/score', userId, today] });
    },
    onError: (error) => {
      // Note: We could add toast notification here if needed
    },
    retry: 2,
    retryDelay: 1000
  });

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = userAnswers.some(answer => answer.questionId === currentQuestion?.id);
  const userAnswer = userAnswers.find(answer => answer.questionId === currentQuestion?.id);

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitAnswer = () => {
    if (!currentQuestion || !selectedAnswers[currentQuestion.id]) return;

    submitAnswerMutation.mutate({
      questionId: currentQuestion.id,
      selectedAnswer: selectedAnswers[currentQuestion.id],
      date: today
    });
  };



  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz is complete - check if all questions answered and trigger completion if needed
      if (userAnswers.length === questions.length && onCompletion && !completionTriggeredRef.current && !dayCompleted) {
        completionTriggeredRef.current = true;
        onCompletion();
      }
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Check for quiz completion when all questions are answered
  useEffect(() => {
    if (questions.length > 0 && userAnswers.length === questions.length && onCompletion && !completionTriggeredRef.current && !dayCompleted) {
      // All questions answered, trigger completion callback only if day is not already completed
      completionTriggeredRef.current = true;
      
      // Show dramatic completion animation
      setShowCompletionAnimation(true);
      
      onCompletion();
    }
  }, [questions.length, userAnswers.length, onCompletion, dayCompleted]);

  // Reset completion tracking when dayIndex changes
  useEffect(() => {
    completionTriggeredRef.current = false;
  }, [dayIndex]);

  // Auto-dismiss completion animation
  useEffect(() => {
    if (showCompletionAnimation) {
      const timer = setTimeout(() => {
        setShowCompletionAnimation(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showCompletionAnimation]);

  if (loadingQuestions) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-zinc-800 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-zinc-800 rounded w-1/2 mx-auto"></div>
              <div className="space-y-2">
                <div className="h-10 bg-zinc-800 rounded"></div>
                <div className="h-10 bg-zinc-800 rounded"></div>
                <div className="h-10 bg-zinc-800 rounded"></div>
                <div className="h-10 bg-zinc-800 rounded"></div>
              </div>
            </div>
            <p className="text-zinc-400 text-sm">Loading your Conviction in Bitcoin</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (questionsError) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold text-white mb-2">Quiz Unavailable</h3>
          <p className="text-zinc-400 mb-4">
            There was an issue loading today's quiz questions. This usually resolves quickly.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </CardContent>
      </Card>
    );
  }

  // No questions available
  if (!questions.length) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6 text-center">
          <Brain className="w-12 h-12 mx-auto mb-4 text-zinc-500" />
          <h3 className="text-lg font-semibold text-white mb-2">Quiz Not Ready</h3>
          <p className="text-zinc-400">Quiz questions for Day {dayIndex} are being prepared.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Compact Quiz Score */}
      {score && score.total > 0 && (
        <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-800/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-white text-sm font-medium">
              {score.correct}/{score.total} correct ({score.percentage}%)
            </span>
          </div>
          <Badge variant={score.percentage >= 70 ? "default" : "secondary"} className="bg-green-900 text-green-100 text-xs">
            {score.percentage >= 70 ? "Great!" : "Keep Learning"}
          </Badge>
        </div>
      )}

      {/* Compact Quiz Question */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-4 space-y-4">
          {/* Quiz Header - Compact */}
          <div className="flex items-center justify-between pb-2 border-b border-zinc-700">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-orange-500" />
              <span className="text-white font-medium text-sm">Question {currentQuestionIndex + 1} of {questions.length}</span>
            </div>
            <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs">
              {currentQuestion?.difficulty}
            </Badge>
          </div>

          {currentQuestion && (
            <>
              <div className="space-y-3">
                <h3 className="text-base font-medium text-white leading-snug">
                  {currentQuestion.question}
                </h3>
                
                <div className="space-y-2">
                  {['A', 'B', 'C', 'D'].map((option) => {
                    const optionText = currentQuestion[`option${option}` as keyof QuizQuestion] as string;
                    const isSelected = selectedAnswers[currentQuestion.id] === option;
                    const isCorrectAnswer = currentQuestion.correctAnswer === option;
                    const isUserSelectedAnswer = userAnswer && userAnswer.selectedAnswer === option;
                    const wasAnsweredCorrectly = userAnswer?.isCorrect && isUserSelectedAnswer;
                    const wasAnsweredIncorrectly = userAnswer && !userAnswer.isCorrect && isUserSelectedAnswer;
                    
                    return (
                      <button
                        key={option}
                        onClick={() => !isAnswered && handleAnswerSelect(currentQuestion.id, option)}
                        disabled={isAnswered}
                        className={`
                          w-full p-3 text-left rounded-lg border transition-all text-sm
                          ${isAnswered 
                            ? isCorrectAnswer 
                              ? 'bg-green-900/30 border-green-700 text-green-100'
                              : wasAnsweredIncorrectly
                                ? 'bg-red-900/30 border-red-700 text-red-100'
                                : 'bg-zinc-800/50 border-zinc-700 text-zinc-400'
                            : isSelected
                              ? 'bg-orange-900/30 border-orange-600 text-orange-100'
                              : 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`flex-shrink-0 w-5 h-5 rounded-full text-xs flex items-center justify-center font-medium ${
                            isAnswered && isCorrectAnswer 
                              ? 'bg-green-600 text-white' 
                              : isAnswered && wasAnsweredIncorrectly
                                ? 'bg-red-600 text-white'
                                : 'bg-zinc-700 text-zinc-300'
                          }`}>
                            {option}
                          </span>
                          <span className="flex-1 leading-tight">{optionText}</span>
                          {isAnswered && isCorrectAnswer && (
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          )}
                          {isAnswered && wasAnsweredIncorrectly && (
                            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Compact Answer Feedback */}
              {userAnswer && (
                <div className={`p-3 rounded-lg border ${
                  userAnswer.isCorrect 
                    ? 'bg-green-900/20 border-green-800/50' 
                    : 'bg-orange-900/20 border-orange-800/50'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {userAnswer.isCorrect ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <h4 className="font-medium text-green-100 text-sm">Correct!</h4>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-orange-400" />
                        <h4 className="font-medium text-orange-100 text-sm">Not quite right</h4>
                      </>
                    )}
                  </div>
                  
                  {/* Compact Explanation */}
                  <div className={`border-t pt-2 ${
                    userAnswer.isCorrect ? 'border-green-700/50' : 'border-orange-700/50'
                  }`}>
                    <p className={`text-xs leading-relaxed ${
                      userAnswer.isCorrect ? 'text-green-200' : 'text-zinc-300'
                    }`}>
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              )}

              {/* Compact Action buttons */}
              <div className="flex items-center justify-between pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  Previous
                </Button>

                <div className="flex gap-2">
                  {!isAnswered ? (
                    <Button
                      size="sm"
                      onClick={handleSubmitAnswer}
                      disabled={!selectedAnswers[currentQuestion.id] || submitAnswerMutation.isPending}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4"
                    >
                      {submitAnswerMutation.isPending ? "Submitting..." : "Submit"}
                    </Button>
                  ) : (
                    <>
                      {currentQuestionIndex < questions.length - 1 ? (
                        <Button
                          size="sm"
                          onClick={nextQuestion}
                          className="bg-green-600 hover:bg-green-700 text-white px-4"
                        >
                          Next →
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-900/30 border border-green-700 rounded-lg">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          <span className="text-green-300 font-medium text-sm">Complete!</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Progress indicator */}
      <div className="flex gap-2 justify-center">
        {questions.map((_, index) => {
          const isAnswered = userAnswers.some(answer => answer.questionId === questions[index].id);
          const isCurrent = index === currentQuestionIndex;
          
          return (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                isCurrent 
                  ? 'bg-orange-500'
                  : isAnswered
                    ? 'bg-green-500'
                    : 'bg-zinc-700'
              }`}
            />
          );
        })}
      </div>

      {/* Sats Reward Animation */}
      <SatsRewardAnimation 
        isActive={showSatsAnimation}
        satsAmount={animationSatsAmount}
        onComplete={() => setShowSatsAnimation(false)}
      />

      {/* Quiz Completion Animation - Coin Shower */}
      {showCompletionAnimation && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 bg-black/50 animate-fade-in" />
          
          {/* Falling coins shower */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 animate-coin-fall"
              style={{
                left: `${20 + i * 15}%`,
                animationDelay: `${i * 200}ms`,
              }}
            >
              <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-full p-2 shadow-lg">
                <div className="text-white text-xs font-bold text-center w-6 h-6 flex items-center justify-center">
                  100
                </div>
              </div>
            </div>
          ))}
          
          {/* Main completion message */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gradient-to-br from-green-900 to-green-800 p-8 rounded-xl border border-green-700 text-center max-w-sm mx-4 animate-scale-in">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
              <h3 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h3>
              <p className="text-green-200 mb-4">
                Well done! You've earned {questions.length * 100} HODLearn Points!
              </p>
              <div className="text-green-300 text-sm">
                Your Bitcoin conviction is growing!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}