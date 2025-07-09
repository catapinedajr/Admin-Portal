import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, Target, Users, Brain, Bitcoin, Shield, AlertTriangle, TrendingDown, DollarSign } from "@/lib/icons";
import { useLocation } from "wouter";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [currentProblem, setCurrentProblem] = useState(0);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [inflationAmount, setInflationAmount] = useState(1000);

  // Professional static display - no distracting animations

  const handleComplete = () => {
    localStorage.setItem('hodlearn-onboarding-completed', 'true');
    setLocation('/money');
  };

  const handleSkip = () => {
    localStorage.setItem('hodlearn-onboarding-completed', 'true');
    setLocation('/');
  };

  const problems = [
    { 
      icon: TrendingDown, 
      text: "Your savings lose 3-8% yearly to inflation", 
      detail: "What bought groceries for a week now barely covers a day",
      color: "text-red-400",
      bg: "bg-red-500/10 border-red-500/30"
    },
    { 
      icon: DollarSign, 
      text: "Banks print unlimited money", 
      detail: "40% of all dollars were created in the last 4 years",
      color: "text-red-400",
      bg: "bg-red-500/10 border-red-500/30"
    },
    { 
      icon: AlertTriangle, 
      text: "Traditional investments can't keep up", 
      detail: "Stocks, bonds, and real estate lag behind real inflation",
      color: "text-red-400",
      bg: "bg-red-500/10 border-red-500/30"
    }
  ];

  const features = [
    { icon: BookOpen, text: "Daily Bitcoin lessons", benefit: "Learn in 5 minutes daily" },
    { icon: Shield, text: "Security training", benefit: "Protect your Bitcoin safely" },
    { icon: Target, text: "Practice simulators", benefit: "Try everything risk-free" },
    { icon: Users, text: "Community support", benefit: "Learn with others like you" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-orange-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-orange-500/8 rounded-full blur-lg animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-zinc-800/80 backdrop-blur-sm border-zinc-700/50 shadow-2xl">
          <CardContent className="p-6">
            <div className="text-center space-y-6">
              
              {/* Clean logo */}
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Bitcoin className="w-10 h-10 text-orange-500" />
                <div className="text-3xl font-bold text-white">
                  HODLearn
                </div>
              </div>
              
              {/* Professional headline */}
              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-white">
                  Understanding Bitcoin
                </h1>
                <p className="text-lg text-zinc-300">
                  Building conviction takes time and community
                </p>
              </div>
              
              {/* Value proposition */}
              <div className="bg-gradient-to-r from-zinc-800/50 to-zinc-700/50 rounded-xl p-4 border border-zinc-600/50">
                <div className="text-center space-y-2">
                  <div className="text-xl font-semibold text-white">
                    Master Bitcoin in 5 minutes daily
                  </div>
                  <div className="text-sm text-zinc-400">
                    Professional education for serious learners
                  </div>
                </div>
              </div>
              
              {/* Clean feature benefits */}
              <div className="space-y-3">
                <div className="space-y-2">
                  {[
                    { icon: BookOpen, text: "Daily structured lessons", detail: "Progressive curriculum designed by experts" },
                    { icon: Shield, text: "Security best practices", detail: "Learn to protect your Bitcoin safely" },
                    { icon: Target, text: "Hands-on practice", detail: "Risk-free simulators and exercises" }
                  ].map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div
                        key={index}
                        className="p-3 rounded-lg border bg-zinc-800/30 border-zinc-700/50 hover:border-zinc-600/50 transition-colors duration-300"
                      >
                        <div className="flex items-start space-x-3">
                          <Icon className="w-5 h-5 text-orange-400 mt-0.5" />
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-white">
                              {benefit.text}
                            </p>
                            <p className="text-xs text-zinc-400 mt-1">
                              {benefit.detail}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Professional value statement */}
              <div className="bg-gradient-to-r from-orange-900/20 to-orange-800/20 rounded-xl p-4 border border-orange-700/30">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Bitcoin className="w-6 h-6 text-orange-400" />
                    <div className="text-lg font-semibold text-orange-300">
                      Join thousands building Bitcoin knowledge
                    </div>
                  </div>
                  <p className="text-zinc-300 text-sm">
                    Structured learning path designed by industry experts
                  </p>
                </div>
              </div>
              
              {/* Professional action buttons */}
              <div className="space-y-4 pt-4">
                {/* Primary CTA */}
                <Button
                  onClick={handleComplete}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <BookOpen className="w-5 h-5 mr-3" />
                  Start Learning Bitcoin
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
                
                <div className="text-xs text-zinc-400 text-center space-y-1">
                  <p>✓ Free to start • ✓ 5 minutes daily • ✓ No commitment</p>
                  <p className="text-zinc-500">Join professionals building Bitcoin knowledge</p>
                </div>
                
                {/* Subtle secondary action */}
                <button 
                  onClick={handleSkip}
                  className="text-zinc-500 hover:text-zinc-400 text-xs transition-colors duration-200 block mx-auto"
                >
                  Continue browsing
                </button>
              </div>
              
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}