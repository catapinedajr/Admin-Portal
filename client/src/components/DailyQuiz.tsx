import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Brain, Trophy } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

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
}

export default function DailyQuiz({ dayIndex, onCompletion }: DailyQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, QuizAnswer>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const queryClient = useQueryClient();
  const completionTriggeredRef = useRef(false);
  
  const today = new Date().toISOString().split('T')[0];
  const userId = 1; // Default user

  // Fetch quiz questions for today
  const { data: questions = [], isLoading: loadingQuestions } = useQuery({
    queryKey: ['/api/quiz/daily', dayIndex],
    queryFn: () => fetch(`/api/quiz/daily/${dayIndex}`).then(res => res.json()) as Promise<QuizQuestion[]>
  });

  // Fetch user's previous answers for today
  const { data: userAnswers = [] } = useQuery({
    queryKey: ['/api/quiz/answers', userId, today],
    queryFn: () => fetch(`/api/quiz/answers/${userId}/${today}`).then(res => res.json()) as Promise<QuizAnswer[]>
  });

  // Fetch quiz score for today
  const { data: score } = useQuery({
    queryKey: ['/api/quiz/score', userId, today],
    queryFn: () => fetch(`/api/quiz/score/${userId}/${today}`).then(res => res.json()) as Promise<QuizScore>,
    enabled: userAnswers.length > 0
  });

  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: async (answer: { userId: number; questionId: number; selectedAnswer: string; date: string }) => {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answer),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json() as QuizAnswer;
    },
    onSuccess: (data, variables) => {
      setSubmittedAnswers(prev => ({
        ...prev,
        [variables.questionId]: data
      }));
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/quiz/answers', userId, today] });
      queryClient.invalidateQueries({ queryKey: ['/api/quiz/score', userId, today] });
    },
    onError: (error) => {
      console.error('Failed to submit answer:', error);
    }
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
      userId,
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
      if (userAnswers.length === questions.length && onCompletion && !completionTriggeredRef.current) {
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
    if (questions.length > 0 && userAnswers.length === questions.length && onCompletion && !completionTriggeredRef.current) {
      // All questions answered, trigger completion callback
      completionTriggeredRef.current = true;
      onCompletion();
    }
  }, [questions.length, userAnswers.length, onCompletion]);

  // Reset completion tracking when dayIndex changes
  useEffect(() => {
    completionTriggeredRef.current = false;
  }, [dayIndex]);

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

  if (!questions.length) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6 text-center">
          <Brain className="w-12 h-12 mx-auto mb-4 text-zinc-500" />
          <p className="text-zinc-400">No quiz questions available for today.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quiz Score Summary */}
      {score && score.total > 0 && (
        <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-800/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <div>
                  <h3 className="text-white font-semibold">Today's Quiz Score</h3>
                  <p className="text-zinc-400 text-sm">
                    {score.correct} out of {score.total} correct ({score.percentage}%)
                  </p>
                </div>
              </div>
              <Badge variant={score.percentage >= 70 ? "default" : "secondary"} className="bg-green-900 text-green-100">
                {score.percentage >= 70 ? "Great!" : "Keep Learning"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quiz Question */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-orange-500" />
              Daily Quiz
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-zinc-700 text-zinc-300">
                {currentQuestion?.difficulty}
              </Badge>
              <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                {currentQuestionIndex + 1} of {questions.length}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentQuestion && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">
                  {currentQuestion.question}
                </h3>
                
                <div className="space-y-3">
                  {['A', 'B', 'C', 'D'].map((option) => {
                    const optionText = currentQuestion[`option${option}` as keyof QuizQuestion] as string;
                    const isSelected = selectedAnswers[currentQuestion.id] === option;
                    const isCorrect = userAnswer?.isCorrect && userAnswer.selectedAnswer === option;
                    const isIncorrect = userAnswer && !userAnswer.isCorrect && userAnswer.selectedAnswer === option;
                    const isCorrectAnswer = isAnswered && currentQuestion.correctAnswer === option;
                    
                    return (
                      <button
                        key={option}
                        onClick={() => !isAnswered && handleAnswerSelect(currentQuestion.id, option)}
                        disabled={isAnswered}
                        className={`
                          w-full p-4 text-left rounded-lg border transition-all
                          ${isAnswered 
                            ? isCorrectAnswer 
                              ? 'bg-green-900/30 border-green-700 text-green-100'
                              : isIncorrect
                                ? 'bg-red-900/30 border-red-700 text-red-100'
                                : 'bg-zinc-800/50 border-zinc-700 text-zinc-400'
                            : isSelected
                              ? 'bg-orange-900/30 border-orange-600 text-orange-100'
                              : 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-700 text-zinc-300 text-sm flex items-center justify-center font-medium">
                            {option}
                          </span>
                          <span className="flex-1">{optionText}</span>
                          {isAnswered && (
                            <div className="flex-shrink-0">
                              {isCorrectAnswer && <CheckCircle className="w-5 h-5 text-green-500" />}
                              {isIncorrect && <XCircle className="w-5 h-5 text-red-500" />}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Explanation (shown after answering) */}
              {userAnswer && (
                <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-800/50">
                  <h4 className="font-medium text-blue-100 mb-2">Explanation</h4>
                  <p className="text-blue-200 text-sm">{currentQuestion.explanation}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={prevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  Previous
                </Button>

                <div className="flex gap-3">
                  {!isAnswered ? (
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={!selectedAnswers[currentQuestion.id] || submitAnswerMutation.isPending}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-6"
                    >
                      {submitAnswerMutation.isPending ? "Submitting..." : "Submit Answer"}
                    </Button>
                  ) : (
                    <>
                      {currentQuestionIndex < questions.length - 1 ? (
                        <Button
                          onClick={nextQuestion}
                          className="bg-green-600 hover:bg-green-700 text-white px-6"
                        >
                          Next Question →
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-700 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-green-300 font-medium">Quiz Complete!</span>
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
    </div>
  );
}