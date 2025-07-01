import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { CheckIcon, XIcon } from 'lucide-react';

interface QuizOption {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: number;
  dayId: number;
  question: string;
  options: QuizOption[];
  explanation: string;
  category: string;
  difficulty: string;
}

interface SubmissionResult {
  questionId: number;
  optionId: number;
  isCorrect: boolean;
  explanation: string;
  selectedText: string;
}

export default function TestQuizV2() {
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [submissionResults, setSubmissionResults] = useState<Record<number, SubmissionResult>>({});

  // Fetch quiz questions using new database-driven API
  const { data: questions, isLoading } = useQuery<QuizQuestion[]>({
    queryKey: ['/api/quiz/questions/1'],
    retry: false,
  });

  // Submit quiz answer using new database-driven API
  const submitMutation = useMutation({
    mutationFn: async ({ questionId, optionId }: { questionId: number; optionId: number }) => {
      const sessionId = localStorage.getItem('sessionId');
      const response = await fetch('/api/quiz/submit-v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionId}`
        },
        body: JSON.stringify({ questionId, optionId })
      });
      
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: (result: SubmissionResult) => {
      setSubmissionResults(prev => ({
        ...prev,
        [result.questionId]: result
      }));
    },
    onError: (error) => {
      console.error('Error submitting quiz answer:', error);
    }
  });

  const handleOptionSelect = (questionId: number, optionId: number) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleSubmitQuestion = (questionId: number) => {
    const selectedOptionId = selectedOptions[questionId];
    if (selectedOptionId) {
      submitMutation.mutate({ questionId, optionId: selectedOptionId });
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading Day 1 quiz questions...</div>;
  }

  if (!questions || questions.length === 0) {
    return <div className="p-4">No quiz questions found for Day 1</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Database-Driven Quiz Test
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Testing new quiz system with boolean validation - eliminates answer bugs
        </p>
      </div>

      {questions.map((question) => {
        const selectedOptionId = selectedOptions[question.id];
        const submissionResult = submissionResults[question.id];
        const isSubmitted = !!submissionResult;

        return (
          <Card key={question.id} className="border-zinc-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg text-zinc-900 dark:text-white">
                Question {question.id}: {question.question}
              </CardTitle>
              <div className="text-sm text-zinc-500 space-x-4">
                <span>Category: {question.category}</span>
                <span>Difficulty: {question.difficulty}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {question.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  const showResult = isSubmitted;
                  
                  let buttonVariant: "default" | "outline" | "destructive" | "secondary" = "outline";
                  let icon = null;
                  
                  if (showResult) {
                    if (isSelected) {
                      if (option.isCorrect) {
                        buttonVariant = "default";
                        icon = <CheckIcon className="w-4 h-4 text-green-600" />;
                      } else {
                        buttonVariant = "destructive";
                        icon = <XIcon className="w-4 h-4 text-red-600" />;
                      }
                    } else if (option.isCorrect && !isSelected) {
                      buttonVariant = "secondary";
                      icon = <CheckIcon className="w-4 h-4 text-green-600" />;
                    }
                  } else if (isSelected) {
                    buttonVariant = "default";
                  }

                  return (
                    <Button
                      key={option.id}
                      variant={buttonVariant}
                      className="justify-start h-auto p-4 text-left"
                      onClick={() => !isSubmitted && handleOptionSelect(question.id, option.id)}
                      disabled={isSubmitted}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{option.text}</span>
                        {icon}
                      </div>
                    </Button>
                  );
                })}
              </div>

              {!isSubmitted && selectedOptionId && (
                <Button
                  onClick={() => handleSubmitQuestion(question.id)}
                  disabled={submitMutation.isPending}
                  className="w-full"
                >
                  {submitMutation.isPending ? 'Submitting...' : 'Submit Answer'}
                </Button>
              )}

              {submissionResult && (
                <div className={`p-4 rounded-lg ${
                  submissionResult.isCorrect 
                    ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {submissionResult.isCorrect ? (
                      <CheckIcon className="w-5 h-5 text-green-600" />
                    ) : (
                      <XIcon className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-medium">
                      {submissionResult.isCorrect ? 'Correct!' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">
                    <strong>Your answer:</strong> {submissionResult.selectedText}
                  </p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-2">
                    <strong>Explanation:</strong> {submissionResult.explanation}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      <div className="text-center text-sm text-zinc-500 mt-8">
        Database-driven quiz system - eliminates number-to-letter conversion bugs
      </div>
    </div>
  );
}