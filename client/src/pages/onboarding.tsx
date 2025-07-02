import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Bitcoin } from "lucide-react";
import { useLocation } from "wouter";

export default function Onboarding() {
  const [, setLocation] = useLocation();

  const handleStartLearning = () => {
    localStorage.setItem('hodlearn-onboarding-completed', 'true');
    setLocation('/money');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-8 text-center">
            {/* HODLearn Logo */}
            <div className="mb-10">
              <div className="w-20 h-20 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bitcoin className="w-10 h-10 text-orange-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">
                Ready to Start Your Bitcoin Journey?
              </h1>
              <p className="text-zinc-400 text-lg">
                Learn Bitcoin fundamentals through daily lessons designed for complete beginners.
              </p>
            </div>

            {/* Simple Value Proposition */}
            <div className="mb-10">
              <div className="bg-zinc-800/50 rounded-lg p-6 space-y-3">
                <div className="text-zinc-300">Understanding Bitcoin takes time</div>
                <div className="text-zinc-300">Building conviction takes consistency</div>
                <div className="text-orange-400 font-semibold">This is HODLearn</div>
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleStartLearning}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg font-semibold"
            >
              Begin Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}