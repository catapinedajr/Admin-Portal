import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Bitcoin } from "lucide-react";
import { useLocation } from "wouter";

export default function Onboarding() {
  const [, setLocation] = useLocation();

  const handleStartLearning = () => {
    localStorage.setItem('hodlearn-onboarding-completed', 'true');
    setLocation('/money');
  };

  const handleSkip = () => {
    localStorage.setItem('hodlearn-onboarding-completed', 'true');
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-8 text-center">
            {/* HODLearn Logo */}
            <div className="mb-8">
              <div className="w-24 h-24 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bitcoin className="w-12 h-12 text-orange-400" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Welcome to HODLearn
              </h1>
              <p className="text-zinc-400 text-lg">
                Learn Bitcoin through daily bite-sized lessons
              </p>
            </div>

            {/* Value Proposition */}
            <div className="space-y-6 mb-8">
              <div className="bg-zinc-800/50 rounded-lg p-6">
                <div className="text-lg space-y-2">
                  <div className="text-zinc-300">Understanding Bitcoin takes time</div>
                  <div className="text-zinc-300">Building conviction takes discipline</div>
                  <div className="text-orange-400 font-semibold text-xl">This is HODLearn</div>
                </div>
              </div>
              
              <p className="text-zinc-300 text-base">
                Start your Bitcoin journey with simple daily lessons. 
                Build knowledge step by step at your own pace.
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