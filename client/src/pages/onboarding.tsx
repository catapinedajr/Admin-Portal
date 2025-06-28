import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Bitcoin, BookOpen, Calculator, TrendingUp, Zap, Shield, Users } from "lucide-react";
import { useLocation } from "wouter";

const onboardingSteps = [
  {
    id: 1,
    title: "Welcome to HODLearn",
    subtitle: "Your journey to Bitcoin understanding starts here",
    content: (
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto">
          <Bitcoin className="w-10 h-10 text-orange-400" />
        </div>
        <div className="space-y-4">
          <p className="text-zinc-300 text-lg leading-relaxed">
            Bitcoin isn't just digital money—it's a completely new way to think about value, freedom, and the future of finance.
          </p>
          <p className="text-zinc-400">
            We'll guide you through everything step by step, from basic concepts to real-world applications.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Why Bitcoin Matters",
    subtitle: "Understanding the problem Bitcoin solves",
    content: (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-red-950/30 border border-red-800/50 rounded-lg p-4">
            <h4 className="text-red-300 font-semibold mb-2">Traditional Money Problems</h4>
            <ul className="text-zinc-300 text-sm space-y-1">
              <li>• Governments print money endlessly</li>
              <li>• Your savings lose buying power</li>
              <li>• Banks control your money</li>
              <li>• High fees and slow transfers</li>
            </ul>
          </div>
          <div className="bg-green-950/30 border border-green-800/50 rounded-lg p-4">
            <h4 className="text-green-300 font-semibold mb-2">Bitcoin Solutions</h4>
            <ul className="text-zinc-300 text-sm space-y-1">
              <li>• Fixed supply of 21 million coins</li>
              <li>• Protects your purchasing power</li>
              <li>• You control your own money</li>
              <li>• Low fees, fast global transfers</li>
            </ul>
          </div>
        </div>
        <p className="text-zinc-400 text-center">
          Bitcoin gives you financial sovereignty for the first time in history.
        </p>
      </div>
    )
  },
  {
    id: 3,
    title: "How HODLearn Works",
    subtitle: "Your personalized Bitcoin education experience",
    content: (
      <div className="space-y-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-lg">
            <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">Daily Learning</h4>
              <p className="text-zinc-400 text-sm">New facts, lessons, and quizzes every day to build your knowledge</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-lg">
            <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">Interactive Simulators</h4>
              <p className="text-zinc-400 text-sm">Practice with real scenarios—transactions, investing, and security</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-lg">
            <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">Real-World Context</h4>
              <p className="text-zinc-400 text-sm">See how Bitcoin compares to traditional finance with live data</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Your Learning Path",
    subtitle: "Build knowledge progressively over time",
    content: (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">1</span>
              </div>
              <span className="text-green-400 text-sm mt-1">Basics</span>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-400" />
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">2</span>
              </div>
              <span className="text-blue-400 text-sm mt-1">Practice</span>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-400" />
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">3</span>
              </div>
              <span className="text-orange-400 text-sm mt-1">Master</span>
            </div>
          </div>
        </div>
        
        <div className="bg-zinc-800/30 rounded-lg p-6 text-center">
          <h4 className="text-white font-semibold mb-2">Start with just 5 minutes a day</h4>
          <p className="text-zinc-400 text-sm">
            Consistent daily learning beats cramming. We'll help you build a Bitcoin education habit that sticks.
          </p>
        </div>
        
        <div className="grid gap-3 md:grid-cols-3 text-center">
          <div className="p-3 bg-zinc-800/50 rounded-lg">
            <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-yellow-300 font-medium text-sm">Quick Facts</div>
          </div>
          <div className="p-3 bg-zinc-800/50 rounded-lg">
            <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-blue-300 font-medium text-sm">Security Tips</div>
          </div>
          <div className="p-3 bg-zinc-800/50 rounded-lg">
            <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-green-300 font-medium text-sm">Real Stories</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "Ready to Begin?",
    subtitle: "Your Bitcoin education journey starts now",
    content: (
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto">
          <Bitcoin className="w-10 h-10 text-orange-400" />
        </div>
        <div className="space-y-4">
          <p className="text-zinc-300 text-lg">
            You're about to join millions of people who've discovered financial freedom through Bitcoin.
          </p>
          <div className="bg-orange-950/30 border border-orange-800/50 rounded-lg p-4">
            <p className="text-orange-300 font-medium">Remember:</p>
            <p className="text-zinc-400 text-sm mt-1">
              This is education, not investment advice. Take your time, ask questions, and learn at your own pace.
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
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
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
              <h1 className="text-3xl font-bold text-white mb-2">
                {currentStepData?.title}
              </h1>
              <p className="text-zinc-400">
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
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex gap-2">
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
                className="bg-orange-600 hover:bg-orange-700"
              >
                {currentStep === onboardingSteps.length ? 'Start Learning' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}