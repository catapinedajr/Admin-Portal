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
              <div className="flex items-center justify-center gap-2 mb-4">
                <Bitcoin className="h-8 w-8 text-orange-500" />
                <h1 className="text-3xl font-bold text-white">Welcome to HODLearn</h1>
              </div>
              <p className="text-zinc-300 text-lg">
                Learn • <span className="text-orange-500">HODL</span> • Repeat
              </p>
            </div>

            {/* Single-page onboarding content */}
            <div className="space-y-8">
              
              {/* Story section */}
              <div className="bg-zinc-800/50 rounded-lg p-6 text-center">
                <div className="text-lg space-y-2">
                  <div className="text-zinc-300">Understanding Bitcoin takes time</div>
                  <div className="text-zinc-300">Building conviction takes consistency</div>
                  <div className="text-orange-400 font-semibold text-xl">This is HODLearn</div>
                </div>
                <p className="text-zinc-400 mt-4 text-sm">
                  We learned Bitcoin by chipping away slowly, day by day. The same way you HODL through market storms, 
                  you learn through daily persistence. No overwhelm, just steady progress.
                </p>
              </div>
              
              {/* Features grid */}
              <div>
                <h2 className="text-xl font-semibold text-white text-center mb-6">What You'll Experience</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-800/30 rounded-lg p-5 border border-zinc-700">
                    <BookOpen className="w-8 h-8 text-blue-400 mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">Daily Facts & Lessons</h3>
                    <p className="text-zinc-300 text-sm">
                      3 daily facts → deep dive lesson → knowledge quiz. Built for busy people, designed for retention.
                    </p>
                  </div>
                  
                  <div className="bg-zinc-800/30 rounded-lg p-5 border border-zinc-700">
                    <Target className="w-8 h-8 text-green-400 mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">Safe Practice Environment</h3>
                    <p className="text-zinc-300 text-sm">
                      Interactive simulators with no real money. Practice wallets, transactions, and security - risk-free.
                    </p>
                  </div>
                  
                  <div className="bg-zinc-800/30 rounded-lg p-5 border border-zinc-700">
                    <Brain className="w-8 h-8 text-purple-400 mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">9th Grade Language</h3>
                    <p className="text-zinc-300 text-sm">
                      No technical jargon. Everyday analogies. Maximum 15 words per sentence. Anyone can understand.
                    </p>
                  </div>
                  
                  <div className="bg-zinc-800/30 rounded-lg p-5 border border-zinc-700">
                    <Clock className="w-8 h-8 text-orange-400 mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">Few Minutes Daily</h3>
                    <p className="text-zinc-300 text-sm">
                      No pressure, no deadlines. Learn at your own pace. Consistency beats intensity every time.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Call to action */}
              <div className="bg-gradient-to-r from-orange-600/20 to-yellow-600/20 rounded-lg p-6 border border-orange-500/30 text-center">
                <h3 className="text-xl font-semibold text-white mb-2">First Stop: Why Bitcoin?</h3>
                <p className="text-zinc-300 mb-6">
                  We'll start by showing you the problems Bitcoin solves - from inflation to banking delays. 
                  Understanding the "why" builds the foundation for everything else.
                </p>
                
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