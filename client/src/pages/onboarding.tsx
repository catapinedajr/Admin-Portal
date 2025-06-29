import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Bitcoin, BookOpen, Calculator, TrendingUp, Zap, Shield, Users } from "lucide-react";
import { useLocation } from "wouter";

const onboardingSteps = [
  {
    id: 1,
    title: "Ready to Start Your Bitcoin Journey?",
    subtitle: "Every expert was once a beginner",
    content: (
      <div className="space-y-4 text-center">
        <div className="w-16 h-16 bg-orange-100/10 rounded-full flex items-center justify-center mx-auto">
          <Bitcoin className="w-8 h-8 text-orange-300" />
        </div>
        <div className="space-y-4">
          <p className="text-zinc-200 text-lg font-medium">
            Bitcoin seems complicated, but every journey starts with a single step.
          </p>
          <p className="text-zinc-300">
            Major companies, countries, and millions of people have embarked on their Bitcoin journey. Now it's your turn to discover what Bitcoin is really about.
          </p>
          <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-700/30">
            <p className="text-orange-200 font-medium">
              🚀 Your journey starts here
            </p>
            <p className="text-orange-300 text-sm mt-1">
              Take the first step toward understanding the future of money
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Your Personal Bitcoin Guide",
    subtitle: "Learn step by step, at your own pace",
    content: (
      <div className="space-y-4 text-center">
        <div className="w-16 h-16 bg-blue-100/10 rounded-full flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8 text-blue-300" />
        </div>
        <div className="space-y-4">
          <p className="text-zinc-200 text-lg font-medium">
            We'll guide you through your Bitcoin journey, one day at a time
          </p>
          <p className="text-zinc-300">
            Each day brings new insights: daily facts, deep-dive lessons, and practice simulations that build your Bitcoin knowledge naturally.
          </p>
          <div className="bg-green-900/20 rounded-lg p-4 border border-green-700/30">
            <p className="text-green-200 font-medium">✓ Daily facts to spark curiosity</p>
            <p className="text-green-200 font-medium">✓ Lessons with real examples</p>
            <p className="text-green-200 font-medium">✓ Safe practice environments</p>
          </div>
          <p className="text-orange-200 text-sm font-medium">
            Join your Bitcoin journey with BTC Journey
          </p>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Begin Your Journey Today",
    subtitle: "Every step forward is progress",
    content: (
      <div className="space-y-4 text-center">
        <div className="w-16 h-16 bg-green-100/10 rounded-full flex items-center justify-center mx-auto">
          <Users className="w-8 h-8 text-green-300" />
        </div>
        <div className="space-y-4">
          <p className="text-zinc-200 text-lg font-medium">
            You're not alone on this journey. Join thousands of others discovering Bitcoin.
          </p>
          <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700/30">
            <p className="text-blue-200 font-medium">🎯 Your journey includes:</p>
            <p className="text-blue-300 text-sm">
              • 30 days of structured learning content
            </p>
            <p className="text-blue-300 text-sm">
              • Interactive simulators for safe practice
            </p>
            <p className="text-blue-300 text-sm">
              • A glossary to demystify Bitcoin terms
            </p>
          </div>
          <p className="text-zinc-300 text-sm">
            Take it one day at a time. There's no rush, only progress.
          </p>
        </div>
      </div>
    )
  }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [, setLocation] = useLocation();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark onboarding as completed and redirect to main app
      localStorage.setItem('btcjourney-onboarding-completed', 'true');
      setLocation('/');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('btcjourney-onboarding-completed', 'true');
    setLocation('/');
  };

  const currentStepData = onboardingSteps.find(step => step.id === currentStep);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-zinc-400 text-sm">Step {currentStep} of {onboardingSteps.length}</span>
            <button 
              onClick={handleSkip}
              className="text-zinc-400 hover:text-zinc-300 text-sm underline"
            >
              Skip
            </button>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2">
            <div 
              className="bg-orange-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / onboardingSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">
                {currentStepData?.title}
              </h1>
              <p className="text-zinc-400 text-sm">
                {currentStepData?.subtitle}
              </p>
            </div>

            <div className="mb-6">
              {currentStepData?.content}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-sm px-3 py-2"
                size="sm"
              >
                <ArrowLeft className="w-3 h-3 mr-1" />
                Back
              </Button>

              <div className="flex gap-1">
                {onboardingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index + 1 <= currentStep ? 'bg-orange-600' : 'bg-zinc-700'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={handleNext}
                className="bg-orange-600 hover:bg-orange-700 text-sm px-4 py-2 font-bold"
                size="sm"
              >
                {currentStep === onboardingSteps.length ? 'Start Now!' : 'Next'}
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}