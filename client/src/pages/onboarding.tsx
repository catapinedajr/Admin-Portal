import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Bitcoin, BookOpen, Target, Clock, Users, Brain } from "lucide-react";
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

            {/* Simplified single-section onboarding */}
            <div className="space-y-6">
              
              {/* Main story */}
              <div className="text-center space-y-4">
                <div className="text-lg space-y-2">
                  <div className="text-zinc-300">Understanding Bitcoin takes time</div>
                  <div className="text-zinc-300">Building conviction takes community</div>
                  <div className="text-orange-400 font-semibold text-xl">This is HODLearn</div>
                </div>
                <p className="text-zinc-400 text-base max-w-2xl mx-auto">
                  We learned Bitcoin by chipping away slowly, day by day. Now you can too - with daily lessons, 
                  safe practice simulators, community discussions, and curated videos from Bitcoin experts.
                </p>
              </div>
              
              {/* Simple feature highlights */}
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
              
              {/* Call to action */}
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-r from-orange-600/20 to-yellow-600/20 rounded-lg p-4 border border-orange-500/30">
                  <p className="text-zinc-300 text-sm">
                    Start with the problems Bitcoin solves, then learn how it works.
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
                  
                  <button 
                    onClick={handleSkip}
                    className="text-zinc-400 hover:text-zinc-300 text-sm underline px-4 py-2"
                  >
                    Skip to dashboard
                  </button>
                </div>
              </div>
              
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}