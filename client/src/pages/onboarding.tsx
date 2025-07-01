import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Bitcoin, Target, Brain, Shield, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);

  const handleStartLearning = () => {
    localStorage.setItem('hodlearn-onboarding-completed', 'true');
    setLocation('/finance');
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleStartLearning();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('hodlearn-onboarding-completed', 'true');
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Step 1: The Problem */}
        {currentStep === 1 && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-8 text-center">
              <div className="mb-8">
                <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-12 h-12 text-red-400" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  Your Money is Disappearing
                </h1>
                <p className="text-zinc-400 text-lg">
                  While you sleep, governments print more money. Your savings lose value every day.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <div className="text-red-400 font-semibold">96% of your purchasing power</div>
                  <div className="text-zinc-300">lost since 1913</div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <div className="text-red-400 font-semibold">40% of all dollars</div>
                  <div className="text-zinc-300">printed in the last 4 years</div>
                </div>
              </div>

              <p className="text-zinc-300 mb-8">
                Most people feel helpless. They don't understand why everything costs more every year.
              </p>

              <Button onClick={handleNext} className="w-full bg-orange-600 hover:bg-orange-700">
                There's a Better Way <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: The Solution */}
        {currentStep === 2 && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-8 text-center">
              <div className="mb-8">
                <div className="w-24 h-24 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bitcoin className="w-12 h-12 text-orange-400" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  Bitcoin: Money They Can't Print
                </h1>
                <p className="text-zinc-400 text-lg">
                  21 million Bitcoin. Forever. No exceptions. No exceptions.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <div className="text-orange-400 font-semibold">+21,000,000% gain</div>
                  <div className="text-zinc-300">for early believers (2010-2024)</div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <div className="text-orange-400 font-semibold">Digital gold</div>
                  <div className="text-zinc-300">that you can actually use</div>
                </div>
              </div>

              <p className="text-zinc-300 mb-8">
                But here's the problem: Bitcoin seems complicated, risky, and confusing.
                <br />
                <strong className="text-white">That's where we come in.</strong>
              </p>

              <Button onClick={handleNext} className="w-full bg-orange-600 hover:bg-orange-700">
                Show Me How <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: HODLearn Brand Definition */}
        {currentStep === 3 && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-12 h-12 text-orange-400" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  This is HODLearn
                </h1>
                <p className="text-orange-400 text-xl font-semibold">
                  Bitcoin education without the noise
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-zinc-800/50 rounded-lg p-6">
                  <Brain className="w-8 h-8 text-orange-400 mb-4" />
                  <h3 className="text-white font-semibold mb-2">8th Grade Simple</h3>
                  <p className="text-zinc-300 text-sm">No confusing jargon. Real-world examples. Anyone can understand.</p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-6">
                  <Shield className="w-8 h-8 text-orange-400 mb-4" />
                  <h3 className="text-white font-semibold mb-2">Anti-Hype Zone</h3>
                  <p className="text-zinc-300 text-sm">No get-rich-quick promises. Just solid Bitcoin fundamentals.</p>
                </div>
              </div>

              <div className="bg-orange-600/10 border border-orange-600/20 rounded-lg p-6 mb-8">
                <h3 className="text-orange-400 font-semibold mb-3">What makes us different:</h3>
                <ul className="space-y-2 text-zinc-300">
                  <li>• 5 minutes daily (not 5 hours)</li>
                  <li>• Focus on WHY Bitcoin matters (not just how it works)</li>
                  <li>• Build conviction through consistency</li>
                  <li>• Safe practice environment (no real money needed)</li>
                </ul>
              </div>

              <div className="text-center">
                <p className="text-zinc-400 mb-6">
                  Ready to understand what everyone's talking about?
                </p>
                <Button onClick={handleStartLearning} className="w-full bg-orange-600 hover:bg-orange-700">
                  Start Your Bitcoin Journey <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress dots and skip */}
        <div className="flex justify-between items-center mt-6">
          <Button variant="ghost" onClick={handleSkip} className="text-zinc-500 hover:text-zinc-300">
            Skip intro
          </Button>
          <div className="flex space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full ${
                  step === currentStep ? 'bg-orange-400' : 'bg-zinc-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
                  step === currentStep ? 'bg-orange-400' : 'bg-zinc-700'
                }`}
              />
            ))}
          </div>
        </div>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleStartLearning}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg font-semibold"
              >
                Start Learning
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <button 
                onClick={handleSkip}
                className="text-zinc-400 hover:text-zinc-300 text-sm underline"
              >
                Skip to dashboard
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}