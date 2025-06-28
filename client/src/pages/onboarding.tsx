import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Bitcoin, BookOpen, Calculator, TrendingUp, Zap, Shield, Users } from "lucide-react";
import { useLocation } from "wouter";

const onboardingSteps = [
  {
    id: 1,
    title: "Learning Bitcoin, One Day at a Time",
    subtitle: "How we learned Bitcoin—and how you can too",
    content: (
      <div className="space-y-8 text-center">
        <div className="w-20 h-20 bg-orange-100/10 rounded-full flex items-center justify-center mx-auto">
          <Bitcoin className="w-10 h-10 text-orange-300" />
        </div>
        <div className="space-y-6 max-w-md mx-auto">
          <p className="text-zinc-200 text-lg leading-relaxed">
            When we first discovered Bitcoin, it felt impossible to understand.
          </p>
          <p className="text-zinc-300 leading-relaxed">
            The technology seemed complex. The economics were confusing. 
            We felt overwhelmed by all the information.
          </p>
          <div className="bg-zinc-800/30 rounded-lg p-6 border border-zinc-700/50">
            <p className="text-orange-200 leading-relaxed">
              So we decided to learn just a little bit each day. 
              One concept at a time. No pressure, no rush.
            </p>
          </div>
          <p className="text-zinc-400 text-sm">
            That simple approach changed everything.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "The Power of Small, Daily Steps",
    subtitle: "What we discovered changed everything",
    content: (
      <div className="space-y-8 text-center">
        <div className="space-y-6 max-w-lg mx-auto">
          <p className="text-zinc-200 text-lg leading-relaxed">
            After months of chipping away at Bitcoin knowledge, something magical happened.
          </p>
          <p className="text-zinc-300 leading-relaxed">
            The pieces started connecting. Concepts that once felt impossible 
            became clear. We began to understand not just what Bitcoin is, 
            but why it matters.
          </p>
          <div className="bg-green-900/20 rounded-lg p-6 border border-green-700/30">
            <p className="text-green-200 leading-relaxed">
              "Just a few minutes a day. That's all it took. 
              No cramming, no stress. Just consistent, gentle progress."
            </p>
          </div>
          <p className="text-zinc-300 leading-relaxed">
            This experience inspired us to create HODLearn—combining Bitcoin's 
            "HODL" spirit of resilience with "how to learn" simplicity.
          </p>
          <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-700/30">
            <p className="text-orange-200 text-sm leading-relaxed">
              Like HODLing through market storms, learning Bitcoin requires 
              patience and persistence. But just as HODLers are rewarded, 
              steady learners gain deep understanding.
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "How It Works",
    subtitle: "Your gentle path to Bitcoin understanding",
    content: (
      <div className="space-y-8 text-center">
        <div className="space-y-6 max-w-md mx-auto">
          <p className="text-zinc-200 text-lg leading-relaxed">
            HODLearn follows the same approach that worked for us.
          </p>
          <p className="text-zinc-300 leading-relaxed">
            Each day, you'll get one simple fact, one short lesson, 
            and a quick quiz. No overwhelm, no pressure.
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-8 py-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-300 text-lg font-medium">∼</span>
            </div>
            <p className="text-blue-200 text-sm">Few mins</p>
          </div>
          <div className="text-zinc-500">→</div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-300 text-lg font-medium">1</span>
            </div>
            <p className="text-green-200 text-sm">Concept</p>
          </div>
          <div className="text-zinc-500">→</div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-orange-300 text-lg font-medium">∞</span>
            </div>
            <p className="text-orange-200 text-sm">Understanding</p>
          </div>
        </div>

        <div className="bg-zinc-800/30 rounded-lg p-6 border border-zinc-700/50 max-w-lg mx-auto">
          <p className="text-zinc-200 leading-relaxed">
            Just like drops of water can carve through stone, 
            small daily lessons will build deep understanding over time.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "You Can Do This",
    subtitle: "Every expert started exactly where you are now",
    content: (
      <div className="space-y-8 text-center">
        <div className="space-y-6 max-w-lg mx-auto">
          <p className="text-zinc-200 text-lg leading-relaxed">
            The same way we learned Bitcoin is the same way you can learn it.
          </p>
          <p className="text-zinc-300 leading-relaxed">
            You don't need a background in technology or finance. 
            You don't need to be good at math. You just need to be curious 
            and willing to spend a few minutes each day learning.
          </p>
          <div className="bg-blue-900/20 rounded-lg p-6 border border-blue-700/30">
            <p className="text-blue-200 leading-relaxed">
              "The best time to plant a tree was 20 years ago. 
              The second best time is now."
            </p>
          </div>
          <p className="text-zinc-300 leading-relaxed">
            Every day you wait is another day you could have been 
            chipping away at understanding Bitcoin. But today, 
            you can start that journey.
          </p>
          <p className="text-orange-200 text-sm">
            We believe in you, even if you don't believe in yourself yet.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "Ready to Begin?",
    subtitle: "Your Bitcoin learning journey starts with a single step",
    content: (
      <div className="text-center space-y-8">
        <div className="w-24 h-24 bg-orange-100/10 rounded-full flex items-center justify-center mx-auto">
          <Bitcoin className="w-12 h-12 text-orange-300" />
        </div>
        <div className="space-y-6 max-w-md mx-auto">
          <p className="text-zinc-200 text-xl leading-relaxed">
            Your journey to understanding Bitcoin begins now.
          </p>
          <p className="text-zinc-300 leading-relaxed">
            Take it one day at a time. Be patient with yourself. 
            Trust the process. Before you know it, Bitcoin will make sense.
          </p>
          <div className="bg-green-900/20 rounded-lg p-6 border border-green-700/30">
            <p className="text-green-200 leading-relaxed text-lg">
              Welcome to HODLearn.
            </p>
            <p className="text-zinc-300 text-sm mt-2">
              We're here to guide you every step of the way.
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