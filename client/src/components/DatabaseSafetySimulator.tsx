import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Shield, Trophy, AlertTriangle } from "lucide-react";

interface SafetyOption {
  id: number;
  optionText: string;
  isCorrect: boolean;
  explanation: string;
  orderIndex: number;
}

interface SafetyScenario {
  id: number;
  stageNumber: number;
  title: string;
  description: string;
  scenarioType: string;
  options: SafetyOption[];
}

interface SafetyResult {
  scenarioId: number;
  optionId: number;
  isCorrect: boolean;
  explanation: string;
  selectedText: string;
}

export default function DatabaseSafetySimulator() {
  const [currentStage, setCurrentStage] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<Record<number, SafetyResult>>({});
  const [completed, setCompleted] = useState(false);

  // Fetch safety scenarios from database
  const { data: scenarios = [], isLoading } = useQuery<SafetyScenario[]>({
    queryKey: ['/api/safety/scenarios'],
    retry: false,
  });

  // Submit safety answer using database-driven API
  const submitMutation = useMutation({
    mutationFn: async ({ scenarioId, optionId }: { scenarioId: number; optionId: number }) => {
      const sessionId = localStorage.getItem('sessionId');
      const response = await fetch('/api/safety/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionId}`
        },
        body: JSON.stringify({ scenarioId, optionId })
      });
      
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: (result: SafetyResult) => {
      setResults(prev => ({
        ...prev,
        [result.scenarioId]: result
      }));
      setShowResult(true);
      if (result.isCorrect) {
        setScore(prev => prev + 1);
      }
    },
    onError: (error) => {
      console.error('Error submitting safety answer:', error);
    }
  });

  const currentScenario = scenarios[currentStage];

  const handleOptionSelect = (optionId: number) => {
    if (showResult) return;
    setSelectedOption(optionId);
  };

  const handleSubmit = () => {
    if (selectedOption === null || !currentScenario) return;
    
    console.log('🛡️ DATABASE Safety Simulator - Submitting:', {
      scenarioId: currentScenario.id,
      optionId: selectedOption,
      stage: currentStage + 1
    });
    
    submitMutation.mutate({
      scenarioId: currentScenario.id,
      optionId: selectedOption
    });
  };

  const handleNext = () => {
    if (currentStage < scenarios.length - 1) {
      setCurrentStage(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setCompleted(true);
    }
  };

  const resetSimulator = () => {
    setCurrentStage(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setResults({});
    setCompleted(false);
  };

  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-orange-400 animate-pulse" />
            <h4 className="text-xl font-bold text-white">Loading Database Safety Simulator...</h4>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (scenarios.length === 0) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-orange-400" />
            <h4 className="text-xl font-bold text-white">Database Safety Simulator</h4>
          </div>
          <p className="text-zinc-400">No safety scenarios available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-600/20 rounded-lg">
            <Shield className="w-6 h-6 text-orange-400" />
          </div>
          <h4 className="text-xl font-bold text-white">Database Safety Simulator</h4>
          <Badge variant="outline" className="bg-green-600/20 text-green-400 border-green-600">
            NEW - Database Driven
          </Badge>
        </div>
        <p className="text-zinc-400 mb-6">
          Test with proper boolean validation! No more index conversion bugs.
        </p>

        {!completed ? (
          <div className="space-y-6">
            {/* Progress */}
            <div className="flex items-center gap-3 mb-4">
              <h5 className="font-semibold text-white">Stage {currentStage + 1} of {scenarios.length}</h5>
              <Badge variant="secondary">{score}/{currentStage + (showResult ? 1 : 0)} correct</Badge>
            </div>

            {/* Current Scenario */}
            {currentScenario && (
              <div className="space-y-4">
                <div>
                  <h6 className="text-lg font-semibold text-white mb-2">{currentScenario.title}</h6>
                  <p className="text-zinc-300 mb-4">{currentScenario.description}</p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {currentScenario.options.map((option) => {
                    const isSelected = selectedOption === option.id;
                    const result = results[currentScenario.id];
                    const isCorrect = option.isCorrect;
                    const showCorrect = showResult && isCorrect;
                    const showIncorrect = showResult && isSelected && !isCorrect;

                    return (
                      <button
                        key={option.id}
                        onClick={() => handleOptionSelect(option.id)}
                        disabled={showResult}
                        className={`w-full p-4 border rounded-lg text-left transition-colors ${
                          showCorrect
                            ? 'border-green-500 bg-green-500/20'
                            : showIncorrect
                            ? 'border-red-500 bg-red-500/20'
                            : isSelected
                            ? 'border-orange-500 bg-orange-500/10'
                            : 'border-zinc-600 hover:border-zinc-500'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-zinc-300 mt-1">
                            {String.fromCharCode(65 + option.orderIndex)}. {/* A, B, C, D */}
                          </div>
                          <div className="flex-1">
                            <p className="text-white">{option.optionText}</p>
                          </div>
                          {showResult && (
                            <div className="ml-2">
                              {isCorrect ? (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              ) : isSelected ? (
                                <XCircle className="w-5 h-5 text-red-400" />
                              ) : null}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Result Explanation */}
                {showResult && results[currentScenario.id] && (
                  <div className="p-4 bg-zinc-800 rounded-lg">
                    <p className="text-zinc-300">{results[currentScenario.id].explanation}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {!showResult ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={selectedOption === null || submitMutation.isPending}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      {submitMutation.isPending ? 'Checking...' : 'Submit Answer'}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      {currentStage < scenarios.length - 1 ? 'Next Scenario' : 'Complete Test'}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Final Results */
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              {score === scenarios.length ? (
                <Trophy className="w-16 h-16 text-yellow-400" />
              ) : score >= scenarios.length * 0.8 ? (
                <CheckCircle className="w-16 h-16 text-green-400" />
              ) : (
                <AlertTriangle className="w-16 h-16 text-orange-400" />
              )}
            </div>
            <div>
              <h5 className="text-xl font-bold text-white mb-2">
                {score === scenarios.length ? 'Perfect!' : score >= scenarios.length * 0.8 ? 'Well Done!' : 'Keep Learning!'}
              </h5>
              <p className="text-zinc-300 mb-4">
                Final Score: {score}/{scenarios.length} ({Math.round((score/scenarios.length)*100)}%)
              </p>
            </div>
            <Button
              onClick={resetSimulator}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}