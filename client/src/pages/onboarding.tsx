import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Bitcoin, BookOpen, Target, TrendingUp, Users, Brain } from "lucide-react";
import { useLocation } from "wouter";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();

  const handleComplete = () => {
    localStorage.setItem('hodlearn-onboarding-completed', 'true');
    setLocation('/money');
  };

  const handleSkip = () => {
    localStorage.setItem('hodlearn-onboarding-completed', 'true');
    setLocation('/');
  };

  const totalSteps = 3;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-8">
            
            {/* Progress indicator */}
            <div className="flex justify-center mb-8">
              <div className="flex space-x-2">
                {Array.from({length: totalSteps}, (_, i) => (
                  <div 
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i + 1 <= step ? 'bg-orange-500' : 'bg-zinc-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Step 1: Welcome */}
            {step === 1 && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto">
                  <Bitcoin className="w-10 h-10 text-orange-400" />
                </div>
                
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Welcome to HODLearn
                  </h1>
                  <p className="text-zinc-400">
                    Your journey to Bitcoin mastery starts here
                  </p>
                </div>
                
                <div className="bg-zinc-800/50 rounded-lg p-6">
                  <div className="text-lg space-y-2">
                    <div className="text-zinc-300">Understanding Bitcoin takes time</div>
                    <div className="text-zinc-300">Building conviction takes consistency</div>
                    <div className="text-orange-400 font-semibold text-xl">This is HODLearn</div>
                  </div>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
                >
                  Tell me more <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2: Why HODLearn Works */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Why HODLearn Works
                  </h1>
                  <p className="text-zinc-400">
                    Built different from day one
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-800/30 rounded-lg p-5 border border-zinc-700">
                    <BookOpen className="w-8 h-8 text-blue-400 mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">Structured Curriculum</h3>
                    <p className="text-zinc-300 text-sm">
                      180 days of carefully sequenced lessons. No random articles or confusing rabbit holes.
                    </p>
                  </div>
                  
                  <div className="bg-zinc-800/30 rounded-lg p-5 border border-zinc-700">
                    <Target className="w-8 h-8 text-green-400 mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">Beginner-Friendly</h3>
                    <p className="text-zinc-300 text-sm">
                      Start with zero Bitcoin knowledge. Written at 9th grade level with everyday analogies.
                    </p>
                  </div>
                  
                  <div className="bg-zinc-800/30 rounded-lg p-5 border border-zinc-700">
                    <Brain className="w-8 h-8 text-purple-400 mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">Practical Learning</h3>
                    <p className="text-zinc-300 text-sm">
                      Interactive simulators, security training, and real-world scenarios. No theory-only education.
                    </p>
                  </div>
                  
                  <div className="bg-zinc-800/30 rounded-lg p-5 border border-zinc-700">
                    <Users className="w-8 h-8 text-orange-400 mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">Habit Building</h3>
                    <p className="text-zinc-300 text-sm">
                      Daily 5-minute sessions that build lasting knowledge and conviction through consistency.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="border-zinc-700 hover:bg-zinc-800"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-8"
                  >
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Ready to Start */}
            {step === 3 && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="w-10 h-10 text-green-400" />
                </div>
                
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Ready to Start?
                  </h1>
                  <p className="text-zinc-400">
                    Your Bitcoin education begins with understanding why it matters
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-orange-600/20 to-yellow-600/20 rounded-lg p-6 border border-orange-500/30">
                  <h3 className="text-xl font-semibold text-white mb-2">First Stop: Why Bitcoin?</h3>
                  <p className="text-zinc-300">
                    We'll start by showing you the problems Bitcoin solves - from inflation to banking delays. 
                    Understanding the "why" builds the foundation for everything else.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleComplete}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg font-semibold"
                  >
                    Start Learning
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={() => setStep(2)}
                      variant="outline"
                      size="sm"
                      className="border-zinc-700 hover:bg-zinc-800"
                    >
                      Back
                    </Button>
                    <button 
                      onClick={handleSkip}
                      className="text-zinc-400 hover:text-zinc-300 text-sm underline px-4 py-2"
                    >
                      Skip to dashboard
                    </button>
                  </div>
                </div>
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}