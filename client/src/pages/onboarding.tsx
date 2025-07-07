import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, Target, Clock, Users, Brain, Bitcoin } from "@/lib/icons";
import { useLocation } from "wouter";

export default function Onboarding() {
  const [, setLocation] = useLocation();

  const handleComplete = () => {
    localStorage.setItem('hodlearn-onboarding-completed', 'true');
    setLocation('/money');
  };

  const handleSkip = () => {
    localStorage.setItem('hodlearn-onboarding-completed', 'true');
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-8">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Welcome to HODLearn</h1>
              <p className="text-zinc-300 text-lg">
                Learn • <span className="text-orange-500">HODL</span> • Repeat
              </p>
            </div>

            {/* Ultra-simplified onboarding */}
            <div className="space-y-8 text-center">
              
              {/* Core message */}
              <div className="space-y-3">
                <Bitcoin className="w-16 h-16 text-orange-500 mx-auto" />
                <p className="text-zinc-300 text-lg leading-relaxed max-w-lg mx-auto">
                  Learn Bitcoin step by step with daily lessons and safe practice tools
                </p>
              </div>
              
              {/* Simple action */}
              <div className="space-y-4">
                <Button
                  onClick={handleComplete}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg font-semibold"
                >
                  Start Learning
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <button 
                  onClick={handleSkip}
                  className="block text-zinc-400 hover:text-zinc-300 text-sm underline mx-auto"
                >
                  Skip intro
                </button>
              </div>
              
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}