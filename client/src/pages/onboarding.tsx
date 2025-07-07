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
              <div className="text-lg space-y-2">
                <div className="text-zinc-300">Understanding Bitcoin takes time</div>
                <div className="text-zinc-300">Building conviction takes community</div>
                <div className="text-orange-400 font-semibold text-xl">This is HODLearn</div>
              </div>
            </div>

            {/* Ultra-simplified onboarding */}
            <div className="space-y-8 text-center">
              
              {/* Core message */}
              <div className="space-y-6">
                <p className="text-zinc-300 text-lg leading-relaxed max-w-lg mx-auto">
                  Learn Bitcoin step by step with daily lessons, safe practice tools, and community forums where you can discuss and grow together
                </p>
                
                {/* Feature icons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="space-y-2">
                    <BookOpen className="w-6 h-6 text-blue-400 mx-auto" />
                    <p className="text-zinc-300 text-sm">Daily Lessons</p>
                  </div>
                  <div className="space-y-2">
                    <Target className="w-6 h-6 text-green-400 mx-auto" />
                    <p className="text-zinc-300 text-sm">Safe Practice</p>
                  </div>
                  <div className="space-y-2">
                    <Users className="w-6 h-6 text-purple-400 mx-auto" />
                    <p className="text-zinc-300 text-sm">Community</p>
                  </div>
                  <div className="space-y-2">
                    <Brain className="w-6 h-6 text-orange-400 mx-auto" />
                    <p className="text-zinc-300 text-sm">Expert Videos</p>
                  </div>
                </div>
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