import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Bitcoin, BookOpen, Target, Users, Shield, Brain } from "lucide-react";
import { useLocation } from "wouter";

export default function OnboardingProposal2() {
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

            {/* Step 1: What is HODLearn */}
            {step === 1 && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto">
                  <Bitcoin className="w-10 h-10 text-orange-400" />
                </div>
                
                <h1 className="text-4xl font-bold text-white mb-4">
                  H<span className="text-orange-400">⬤</span>DLearn
                </h1>
                
                <div className="bg-zinc-800/50 rounded-lg p-6 space-y-3">
                  <div className="text-xl text-zinc-300">
                    <span className="text-orange-400 font-semibold">HODL</span> = Bitcoin's philosophy of patient holding
                  </div>
                  <div className="text-xl text-zinc-300">
                    <span className="text-orange-400 font-semibold">HODLearn</span> = Patient learning that builds real conviction
                  </div>
                </div>
                
                <p className="text-lg text-zinc-300 max-w-lg mx-auto">
                  The only Bitcoin education platform designed for busy people who want to truly understand Bitcoin, not just trade it.
                </p>

                <Button
                  onClick={() => setStep(2)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg"
                >
                  What makes us different? <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2: What makes us different */}
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

                <div className="text-center">
                  <Button
                    onClick={() => setStep(3)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
                  >
                    Show me how it works <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: How it works */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Your Daily Learning Flow
                  </h1>
                  <p className="text-zinc-400">
                    Just 5 minutes a day builds Bitcoin mastery
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 bg-zinc-800/30 rounded-lg p-4">
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <h3 className="text-white font-semibold">Read 3 Daily Insights</h3>
                      <p className="text-zinc-400 text-sm">Quick Bitcoin facts that build your foundation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 bg-zinc-800/30 rounded-lg p-4">
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <h3 className="text-white font-semibold">Learn Through Stories</h3>
                      <p className="text-zinc-400 text-sm">3-minute lessons that make complex topics simple</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 bg-zinc-800/30 rounded-lg p-4">
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <h3 className="text-white font-semibold">Test Your Knowledge</h3>
                      <p className="text-zinc-400 text-sm">5 questions that reinforce what you learned</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 bg-zinc-800/30 rounded-lg p-4">
                    <div className="w-8 h-8 bg-zinc-600 text-white rounded-full flex items-center justify-center font-bold">+</div>
                    <div>
                      <h3 className="text-white font-semibold">Practice & Explore (Optional)</h3>
                      <p className="text-zinc-400 text-sm">Simulators, security training, and deep dives when you have time</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-900/20 border border-orange-800 rounded-lg p-4 text-center">
                  <Shield className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <p className="text-orange-300 font-semibold mb-1">Safe Learning Environment</p>
                  <p className="text-zinc-300 text-sm">No real money involved. Just knowledge building at your own pace.</p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleComplete}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg font-semibold"
                  >
                    Start Day 1 of 180
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  
                  <button 
                    onClick={handleSkip}
                    className="w-full text-zinc-400 hover:text-zinc-300 text-sm underline"
                  >
                    Skip to dashboard
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