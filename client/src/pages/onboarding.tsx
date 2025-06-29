import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Bitcoin, BookOpen, Calculator, TrendingUp, Zap, Shield, Users } from "lucide-react";
import { useLocation } from "wouter";

const onboardingSteps = [
  {
    id: 1,
    title: "Bitcoin Is Getting Mainstream",
    subtitle: "You're running out of time to learn before everyone else",
    content: (
      <div className="space-y-4 text-center">
        <div className="w-16 h-16 bg-orange-100/10 rounded-full flex items-center justify-center mx-auto">
          <TrendingUp className="w-8 h-8 text-orange-300" />
        </div>
        <div className="space-y-4">
          <p className="text-zinc-200 text-lg font-medium">
            Bitcoin just hit a new all-time high. Again.
          </p>
          <p className="text-zinc-300">
            Major companies are buying Bitcoin. Countries are making it legal tender. Your friends are asking questions you can't answer.
          </p>
          <div className="bg-red-900/20 rounded-lg p-4 border border-red-700/30">
            <p className="text-red-200 font-medium">
              ⚠️ You're being left behind
            </p>
            <p className="text-red-300 text-sm mt-1">
              While everyone else learns Bitcoin, you're still confused
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Finally Understand Bitcoin",
    subtitle: "In just 5 minutes per day",
    content: (
      <div className="space-y-4 text-center">
        <div className="w-16 h-16 bg-blue-100/10 rounded-full flex items-center justify-center mx-auto">
          <Zap className="w-8 h-8 text-blue-300" />
        </div>
        <div className="space-y-4">
          <p className="text-zinc-200 text-lg font-medium">
            Stop feeling stupid about Bitcoin
          </p>
          <p className="text-zinc-300">
            Learn Bitcoin the smart way: bite-sized daily lessons that actually make sense.
          </p>
          <div className="bg-green-900/20 rounded-lg p-4 border border-green-700/30">
            <p className="text-green-200 font-medium">✓ Simple daily facts</p>
            <p className="text-green-200 font-medium">✓ Real-world examples</p>
            <p className="text-green-200 font-medium">✓ No confusing jargon</p>
          </div>
          <p className="text-orange-200 text-sm font-medium">
            Join thousands already learning with HODLearn
          </p>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Start Your Free Week Today",
    subtitle: "See results in 7 days or get your money back",
    content: (
      <div className="space-y-4 text-center">
        <div className="w-16 h-16 bg-green-100/10 rounded-full flex items-center justify-center mx-auto">
          <Shield className="w-8 h-8 text-green-300" />
        </div>
        <div className="space-y-4">
          <p className="text-zinc-200 text-lg font-medium">
            7 days free. No credit card required.
          </p>
          <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-700/30">
            <p className="text-orange-200 font-medium">🔥 Limited Time Offer</p>
            <p className="text-orange-300 text-sm">
              First 100 people get premium access for life at 50% off
            </p>
            <p className="text-orange-400 text-xs">
              87 spots remaining
            </p>
          </div>
          <p className="text-zinc-300 text-sm">
            Try it risk-free. Cancel anytime. Most people see results by day 3.
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