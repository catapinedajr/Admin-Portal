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

  // Auto-cycle through problems
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProblem((prev) => (prev + 1) % 3);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Auto-cycle through features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Show solution after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSolution(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Show features after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowFeatures(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  // Animate inflation impact
  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setInflationAmount(prev => Math.max(prev - 25, 850));
      }, 150);
      setTimeout(() => clearInterval(interval), 2000);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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
              
              {/* Animated logo with Bitcoin icon */}
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="relative">
                  <Bitcoin className="w-12 h-12 text-orange-500 animate-pulse" />
                  <div className="absolute inset-0 w-12 h-12 bg-orange-500/20 rounded-full animate-ping"></div>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                  HODLearn
                </div>
              </div>
              
              {/* Problem headline */}
              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                  Your Money is Disappearing
                </h1>
                <p className="text-lg text-zinc-300">
                  While you work hard and save responsibly...
                </p>
              </div>
              
              {/* Live inflation demonstration */}
              <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 rounded-xl p-4 border border-red-700/50">
                <div className="flex items-center justify-center space-x-3">
                  <TrendingDown className="w-6 h-6 text-red-400" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">
                      ${inflationAmount.toLocaleString()}
                    </div>
                    <div className="text-xs text-zinc-400">
                      What $1,000 buys vs. 5 years ago
                    </div>
                  </div>
                  <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
                </div>
              </div>
              
              {/* Condensed cycling problem */}
              <div className="space-y-3">
                <div className="space-y-2">
                  {problems.map((problem, index) => {
                    const Icon = problem.icon;
                    const isActive = currentProblem === index;
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border transition-all duration-500 ${
                          isActive 
                            ? `${problem.bg} scale-105` 
                            : 'bg-zinc-800/30 border-zinc-700/50 opacity-60'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-5 h-5 transition-all duration-500 ${
                            isActive ? problem.color : 'text-zinc-500'
                          }`} />
                          <div className="flex-1 text-left">
                            <p className={`text-sm font-medium transition-colors duration-500 ${
                              isActive ? 'text-white' : 'text-zinc-400'
                            }`}>
                              {problem.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Solution reveal */}
              <div className={`transition-all duration-1000 ${showSolution ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="bg-gradient-to-r from-orange-900/30 to-orange-800/30 rounded-xl p-4 border border-orange-700/50">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <Bitcoin className="w-8 h-8 text-orange-400" />
                    <div className="text-xl font-bold text-orange-400">
                      Bitcoin: Your Escape Plan
                    </div>
                  </div>
                  <p className="text-zinc-300 text-sm">
                    Fixed supply. No printing. Digital gold.
                  </p>
                </div>
              </div>
              
              {/* Compact features showcase */}
              <div className={`transition-all duration-1000 delay-500 ${showFeatures ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-zinc-200">Learn Bitcoin the Right Way:</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {features.map((feature, index) => {
                      const Icon = feature.icon;
                      const isActive = currentFeature === index;
                      return (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border transition-all duration-300 ${
                            isActive 
                              ? 'bg-orange-500/20 border-orange-500/50 scale-105' 
                              : 'bg-zinc-800/50 border-zinc-700/50'
                          }`}
                        >
                          <div className="text-center">
                            <Icon className={`w-6 h-6 mx-auto mb-2 transition-colors duration-300 ${
                              isActive ? 'text-orange-400' : 'text-zinc-400'
                            }`} />
                            <p className={`text-xs font-medium transition-colors duration-300 ${
                              isActive ? 'text-orange-300' : 'text-white'
                            }`}>
                              {feature.text}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Enhanced action buttons */}
              <div className="space-y-4 pt-4">
                {/* Primary CTA with animation */}
                <div className="relative">
                  <Button
                    onClick={handleComplete}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Shield className="w-5 h-5 mr-3" />
                    Protect Your Money Now
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                  
                  {/* Pulse effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl opacity-20 animate-ping"></div>
                </div>
                
                <div className="text-xs text-zinc-400 text-center">
                  <p>✓ Free to start • ✓ 5 min daily • ✓ No credit card</p>
                </div>
                
                {/* Subtle secondary action */}
                <button 
                  onClick={handleSkip}
                  className="text-zinc-500 hover:text-zinc-400 text-xs transition-colors duration-200 block mx-auto"
                >
                  Maybe later (your money keeps losing value)
                </button>
              </div>
              
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}