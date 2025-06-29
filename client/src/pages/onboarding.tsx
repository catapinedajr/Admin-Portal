import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Bitcoin, BookOpen, Calculator, TrendingUp, Zap, Shield, Users } from "lucide-react";
import { useLocation } from "wouter";

const onboardingSteps = [
  {
    id: 1,
    title: "Welcome to HODLearn",
    subtitle: "Your personal Bitcoin education journey begins here",
    content: (
      <div className="space-y-6 text-center">
        <div className="w-20 h-20 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto">
          <Bitcoin className="w-10 h-10 text-orange-400" />
        </div>
        <div className="space-y-4">
          <p className="text-zinc-200 text-xl">
            Learn Bitcoin fundamentals through daily lessons designed for beginners.
          </p>
          <p className="text-zinc-400 text-lg">
            Join thousands of learners building Bitcoin knowledge one day at a time.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "How HODLearn Works",
    subtitle: "Simple daily learning that builds lasting knowledge",
    content: (
      <div className="space-y-6 text-center">
        <div className="w-20 h-20 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto">
          <BookOpen className="w-10 h-10 text-orange-400" />
        </div>
        <div className="space-y-5">
          <p className="text-zinc-200 text-xl">
            Each day includes essential facts, detailed lessons, and practice simulations.
          </p>
          <div className="bg-zinc-800/50 rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-3 text-left">
              <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
              <span className="text-zinc-300">Daily Bitcoin facts with deeper explanations</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
              <span className="text-zinc-300">Interactive lessons with real-world examples</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
              <span className="text-zinc-300">Safe practice environments with no real money</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Start Your Journey",
    subtitle: "Begin building Bitcoin knowledge today",
    content: (
      <div className="space-y-6 text-center">
        <div className="w-20 h-20 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto">
          <TrendingUp className="w-10 h-10 text-orange-400" />
        </div>
        <div className="space-y-4">
          <p className="text-zinc-200 text-xl">
            Ready to understand what Bitcoin is really about?
          </p>
          <p className="text-zinc-400 text-lg">
            Your 30-day structured learning experience starts now.
          </p>
          <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-700/30">
            <p className="text-orange-200 font-medium">
              Take your time. Learn at your own pace.
            </p>
          </div>
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
      localStorage.setItem('hodlearn-onboarding-completed', 'true');
      setLocation('/');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('hodlearn-onboarding-completed', 'true');
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
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-3">
                {currentStepData?.title}
              </h1>
              <p className="text-zinc-400 text-base">
                {currentStepData?.subtitle}
              </p>
            </div>

            <div className="mb-8">
              {currentStepData?.content}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-4 py-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <div className="flex gap-2">
                {onboardingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index + 1 <= currentStep ? 'bg-orange-600' : 'bg-zinc-700'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={handleNext}
                className="bg-orange-600 hover:bg-orange-700 px-6 py-2 font-semibold"
              >
                {currentStep === onboardingSteps.length ? 'Begin Learning' : 'Continue'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}