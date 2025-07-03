import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Bitcoin, Clock, Target, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";

export default function OnboardingProposal1() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();

  const handleComplete = () => {
    localStorage.setItem('hodlearn-onboarding-completed', 'true');
    setLocation('/');
  };

  const handleSkip = () => {
    localStorage.setItem('hodlearn-onboarding-completed', 'true');
    setLocation('/');
  };

  const totalSteps = 4;

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

            {/* Step 1: The Problem */}
            {step === 1 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto">
                  <Target className="w-8 h-8 text-red-400" />
                </div>
                
                <h1 className="text-3xl font-bold text-white">
                  Bitcoin Learning is Broken
                </h1>
                
                <div className="space-y-4 text-lg text-zinc-300 max-w-lg mx-auto">
                  <p>Most people try to learn Bitcoin in a weekend and give up overwhelmed.</p>
                  <p>YouTube rabbit holes, confusing articles, and technical jargon everywhere.</p>
                  <p className="text-orange-400 font-semibold">
                    There had to be a better way.
                  </p>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2: The Solution */}
            {step === 2 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto">
                  <Bitcoin className="w-8 h-8 text-orange-400" />
                </div>
                
                <h1 className="text-3xl font-bold text-white">
                  Meet HODLearn
                </h1>
                
                <div className="space-y-4 text-lg text-zinc-300 max-w-lg mx-auto">
                  <p>
                    <span className="text-orange-400 font-semibold">HODL</span> = Hold On for Dear Life
                  </p>
                  <p>
                    <span className="text-orange-400 font-semibold">HODLearn</span> = How to Learn (the patient way)
                  </p>
                  <p>
                    Just like Bitcoin rewards patient holding, Bitcoin knowledge rewards patient learning.
                  </p>
                </div>

                <Button
                  onClick={() => setStep(3)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
                >
                  I get it <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 3: The Method */}
            {step === 3 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8 text-blue-400" />
                </div>
                
                <h1 className="text-3xl font-bold text-white">
                  Our 180-Day Method
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-400 mb-2">3</div>
                    <div className="text-zinc-300">Daily insights</div>
                    <div className="text-sm text-zinc-400">Bite-sized facts</div>
                  </div>
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-400 mb-2">1</div>
                    <div className="text-zinc-300">Short lesson</div>
                    <div className="text-sm text-zinc-400">3-minute stories</div>
                  </div>
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-400 mb-2">5</div>
                    <div className="text-zinc-300">Quiz questions</div>
                    <div className="text-sm text-zinc-400">Test understanding</div>
                  </div>
                </div>

                <p className="text-zinc-300 mt-6">
                  No rushing. No overwhelm. Just steady progress building real Bitcoin conviction.
                </p>

                <Button
                  onClick={() => setStep(4)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
                >
                  Ready to start <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 4: The Journey */}
            {step === 4 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
                
                <h1 className="text-3xl font-bold text-white">
                  Your Bitcoin Journey Starts Today
                </h1>
                
                <div className="bg-zinc-800/50 rounded-lg p-6 space-y-4">
                  <div className="text-zinc-300">
                    <span className="text-orange-400 font-semibold">Month 1:</span> Why Bitcoin matters
                  </div>
                  <div className="text-zinc-300">
                    <span className="text-orange-400 font-semibold">Month 2-3:</span> How money works
                  </div>
                  <div className="text-zinc-300">
                    <span className="text-orange-400 font-semibold">Month 4-6:</span> Bitcoin mastery
                  </div>
                </div>

                <p className="text-lg text-zinc-300">
                  By day 180, you'll understand Bitcoin better than 99% of people.
                </p>

                <div className="space-y-3">
                  <Button
                    onClick={handleComplete}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg font-semibold"
                  >
                    Begin Your Journey
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  
                  <button 
                    onClick={handleSkip}
                    className="text-zinc-400 hover:text-zinc-300 text-sm underline"
                  >
                    Skip introduction
                  </button>
                </div>
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}