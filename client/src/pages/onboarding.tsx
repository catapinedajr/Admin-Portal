import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, Target, Clock, Users, Brain, Bitcoin, Zap, TrendingUp, Award } from "@/lib/icons";
import { useLocation } from "wouter";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [showStats, setShowStats] = useState(false);

  // Auto-cycle through features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Show stats after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowStats(true), 3000);
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

  const features = [
    { icon: BookOpen, text: "Daily Lessons", color: "text-orange-400" },
    { icon: Target, text: "Safe Practice", color: "text-orange-400" },
    { icon: Users, text: "Community", color: "text-orange-400" },
    { icon: Brain, text: "Expert Videos", color: "text-orange-400" }
  ];

  const stats = [
    { icon: Zap, value: "5 min", label: "Daily commitment" },
    { icon: TrendingUp, value: "180", label: "Days of content" },
    { icon: Award, value: "Free", label: "No cost to start" }
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-orange-400/5 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-orange-300/5 rounded-full blur-md animate-pulse delay-2000"></div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <Card className="bg-zinc-900/90 backdrop-blur-lg border-zinc-800/50 shadow-2xl">
          <CardContent className="p-10">
            
            {/* Animated Header */}
            <div className="text-center mb-10">
              {/* Animated Logo */}
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-4 transform hover:scale-110 transition-transform duration-300 animate-pulse">
                  <Bitcoin className="w-10 h-10 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-6 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                Welcome to HODLearn
              </h1>
              
              {/* Enhanced tagline with gradient */}
              <div className="text-xl space-y-3">
                <div className="text-zinc-300">Understanding Bitcoin takes time</div>
                <div className="text-zinc-300">Building conviction takes community</div>
                <div className="text-transparent bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text font-bold text-2xl">
                  This is HODLearn
                </div>
              </div>
            </div>

            {/* Dynamic Features Section */}
            <div className="space-y-10 text-center">
              
              {/* Animated feature showcase */}
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold text-white mb-6">Everything you need to master Bitcoin</h2>
                
                {/* Auto-cycling features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    const isActive = currentFeature === index;
                    
                    return (
                      <div 
                        key={index}
                        className={`p-4 rounded-xl border transition-all duration-500 ${
                          isActive 
                            ? 'bg-orange-500/20 border-orange-500/50 scale-105 shadow-lg shadow-orange-500/25' 
                            : 'bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600'
                        }`}
                      >
                        <Icon className={`w-8 h-8 mx-auto mb-3 transition-all duration-500 ${
                          isActive ? 'text-orange-400 scale-110' : 'text-zinc-400'
                        }`} />
                        <p className={`text-sm font-medium transition-colors duration-500 ${
                          isActive ? 'text-orange-300' : 'text-zinc-300'
                        }`}>
                          {feature.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
                
                {/* Progress indicators for features */}
                <div className="flex justify-center space-x-2">
                  {features.map((_, index) => (
                    <div 
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentFeature === index ? 'bg-orange-500 scale-125' : 'bg-zinc-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Animated stats reveal */}
              <div className={`transition-all duration-1000 ${showStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="bg-gradient-to-r from-zinc-800/50 to-zinc-700/50 rounded-2xl p-6 border border-zinc-700/50">
                  <div className="grid grid-cols-3 gap-6">
                    {stats.map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <div key={index} className="text-center">
                          <Icon className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                          <div className="text-sm text-zinc-400">{stat.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Enhanced action buttons */}
              <div className="space-y-6 pt-4">
                {/* Primary CTA with animation */}
                <div className="relative">
                  <Button
                    onClick={handleComplete}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-4 text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Zap className="w-6 h-6 mr-3" />
                    Start Your Bitcoin Journey
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                  
                  {/* Pulse effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl opacity-20 animate-ping"></div>
                </div>
                
                {/* Subtle secondary action */}
                <button 
                  onClick={handleSkip}
                  className="text-zinc-500 hover:text-zinc-400 text-sm transition-colors duration-200"
                >
                  Skip for now
                </button>
              </div>
              
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}