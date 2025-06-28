import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Bitcoin, BookOpen, Calculator, TrendingUp, Zap, Shield, Users } from "lucide-react";
import { useLocation } from "wouter";

const onboardingSteps = [
  {
    id: 1,
    title: "The Problem: Bitcoin Can Feel Like Too Much",
    subtitle: "You're not alone if you feel overwhelmed—we understand",
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bitcoin className="w-8 h-8 text-orange-400" />
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-zinc-300 leading-relaxed">
            We know Bitcoin's promise—fighting inflation, owning your finances, breaking free from centralized control—sounds incredible, 
            but it's also intimidating.
          </p>
          <p className="text-zinc-300 leading-relaxed">
            Over 9 out of 10 people feel paralyzed by complex jargon, tech hurdles, and the fear of making costly mistakes. 
            You're not alone if you're anxious about losing money, feeling left behind, or navigating the hype.
          </p>
          <div className="bg-zinc-800/50 rounded-lg p-4 border-l-4 border-orange-600">
            <p className="text-orange-300 font-medium text-sm">
              Starting with Bitcoin can feel overwhelming, and that's okay.
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Our Solution: HODLearn's Caring Guidance",
    subtitle: "We make Bitcoin learning gentle, private, and stress-free",
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-zinc-300 leading-relaxed">
            HODLearn, inspired by Bitcoin's "HODL" resilience and "how to learn" simplicity, is here to ease your way.
          </p>
          <p className="text-zinc-300 leading-relaxed">
            We deliver daily facts, short lessons, and quick quizzes to keep you moving forward, plus safe simulations 
            to practice transactions, DCA, and HODL strategies.
          </p>
        </div>
        
        <div className="bg-green-950/30 border border-green-800/50 rounded-lg p-4">
          <h4 className="text-green-300 font-semibold mb-3">Why HODLearn Works</h4>
          <div className="space-y-2 text-zinc-300 text-sm">
            <div>• <strong>Daily Encouragement:</strong> Facts, lessons, and quizzes make progress feel doable</div>
            <div>• <strong>Safe Exploration:</strong> Simulations for transactions, DCA, and HODL build skills</div>
            <div>• <strong>Inflation Shield:</strong> Learn Bitcoin's protection for your hard-earned money</div>
            <div>• <strong>No Pressure:</strong> Private learning, free from noise or comparison</div>
          </div>
        </div>
        
        <p className="text-orange-300 text-center font-medium">
          It's private, self-paced learning designed to lift your confidence, not add stress.
        </p>
      </div>
    )
  },
  {
    id: 3,
    title: "Your Journey, Your Pace",
    subtitle: "We meet you exactly where you are right now",
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-zinc-300 leading-relaxed">
            Whether you're worried about shrinking savings or dreaming of financial freedom, HODLearn meets you right where you are.
          </p>
          <p className="text-zinc-300 leading-relaxed">
            With daily support and hands-on practice, you'll learn without fear or judgment, growing at a speed that feels comfortable for you.
          </p>
        </div>
        
        <div className="grid gap-4">
          <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-lg border-l-4 border-blue-600">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">Gentle Daily Steps</h4>
              <p className="text-zinc-400 text-sm">Just 5 minutes a day with bite-sized facts and lessons</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-lg border-l-4 border-green-600">
            <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">Safe Practice Space</h4>
              <p className="text-zinc-400 text-sm">Risk-free simulations to build confidence before real decisions</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-lg border-l-4 border-orange-600">
            <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">You're Not Alone</h4>
              <p className="text-zinc-400 text-sm">Caring guidance every step without pressure or judgment</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "How You'll Learn With Us",
    subtitle: "Simple daily habits that build real understanding",
    content: (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">5</span>
              </div>
              <span className="text-green-400 text-sm mt-1">Minutes</span>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-400" />
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">1</span>
              </div>
              <span className="text-blue-400 text-sm mt-1">Day</span>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-400" />
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">∞</span>
              </div>
              <span className="text-orange-400 text-sm mt-1">Confidence</span>
            </div>
          </div>
        </div>
        
        <div className="bg-green-950/30 border border-green-800/50 rounded-lg p-6 text-center">
          <h4 className="text-green-300 font-semibold mb-2">Start with just 5 minutes a day</h4>
          <p className="text-zinc-300 text-sm leading-relaxed">
            Consistent daily learning beats cramming. Small steps every day build lasting confidence 
            without the overwhelm that stops most people.
          </p>
        </div>
        
        <div className="grid gap-3 md:grid-cols-3 text-center">
          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-yellow-300 font-medium text-sm mb-1">Daily Facts</div>
            <div className="text-zinc-400 text-xs">Bite-sized learning</div>
          </div>
          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <Calculator className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-blue-300 font-medium text-sm mb-1">Safe Practice</div>
            <div className="text-zinc-400 text-xs">Risk-free simulations</div>
          </div>
          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-green-300 font-medium text-sm mb-1">Real Context</div>
            <div className="text-zinc-400 text-xs">Why Bitcoin matters</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "Take a Small Step Today",
    subtitle: "You don't have to face Bitcoin alone—we're here to help",
    content: (
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto">
          <Bitcoin className="w-10 h-10 text-orange-400" />
        </div>
        <div className="space-y-4">
          <p className="text-zinc-300 text-lg leading-relaxed">
            You don't have to face Bitcoin alone. HODLearn is your partner, helping you embrace financial empowerment 
            with clarity and care, one gentle step at a time.
          </p>
          <div className="bg-orange-950/30 border border-orange-800/50 rounded-lg p-4">
            <p className="text-orange-300 font-medium mb-2">You're Ready to Start</p>
            <p className="text-zinc-300 text-sm leading-relaxed">
              This is education designed to build your confidence, not investment advice that creates pressure. 
              Learn at your own pace, ask questions, and celebrate small wins.
            </p>
          </div>
          <div className="bg-green-950/30 border border-green-800/50 rounded-lg p-4">
            <p className="text-green-300 font-medium text-sm">
              Remember: Every expert was once a beginner who felt overwhelmed too.
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