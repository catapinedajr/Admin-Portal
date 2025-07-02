import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowRight, Clock, Users, Target, Heart } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-bold">
              HL
            </div>
            <div>
              <h1 className="text-2xl font-bold">About HODLearn</h1>
              <p className="text-zinc-400">The story behind how to learn Bitcoin</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* We Were You */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-orange-600/20 rounded-lg">
                <Heart className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">We Were You</h2>
                <p className="text-zinc-400">Confused and overwhelmed by Bitcoin</p>
              </div>
            </div>
            
            <div className="space-y-3 text-zinc-300 leading-relaxed">
              <p>
                Three years ago, we were staring at Bitcoin articles at 2 AM, completely lost. Every explanation felt like it was written for computer experts. We wanted to understand this thing everyone said was changing money forever, but felt like idiots every time someone mentioned "mining" or "wallets."
              </p>
              
              <p>
                We watched Bitcoin go from $20,000 to $60,000 while sitting on the sidelines, too confused and scared to do anything. Every time we tried to learn, we'd quit after 10 minutes feeling overwhelmed.
              </p>
              
              <p>
                Sound familiar? That exact frustration - feeling left behind while something important was happening - that's what drove us to figure this out.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* The Breakthrough */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-orange-600/20 rounded-lg">
                <Target className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">The Breakthrough</h2>
                <p className="text-zinc-400">Learning Bitcoin is like learning to drive</p>
              </div>
            </div>
            
            <div className="space-y-3 text-zinc-300 leading-relaxed">
              <p>
                The breakthrough came after years of struggling. One of our founders finally "got" Bitcoin - not from any single article or video, but from spending just 10 minutes every single day reading about it. After 18 months of this daily habit, something clicked. The pieces finally fit together.
              </p>
              
              <p>
                That's when we realized the secret wasn't finding the "perfect" explanation. It was consistency. Daily learning, even just a few minutes, slowly built real understanding over time. That moment of clarity - that's why we decided to start this app.
              </p>
              
              <div className="bg-orange-600/10 p-3 rounded-lg border border-orange-600/20">
                <p className="text-sm text-orange-200">
                  <strong>The realization:</strong> Bitcoin clicked not because of one great lesson, but because of hundreds of small daily moments that built on each other.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why We Built This */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-orange-600/20 rounded-lg">
                <Users className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Why We Built This</h2>
                <p className="text-zinc-400">Make Bitcoin learning feel normal</p>
              </div>
            </div>
            
            <div className="space-y-3 text-zinc-300 leading-relaxed">
              <p>
                We built HODLearn for teachers, parents, students, and anyone who feels left behind by complicated Bitcoin explanations. You don't need to be technical. You just need to be curious.
              </p>
              
              <p>
                Every lesson is written like we're explaining it to our own family. Take your time. Learn at your pace. Build real understanding that no one can shake.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => setLocation('/learn')}
                  className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
                >
                  Start Your Journey
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setLocation('/simulators')}
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  Try the Simulators
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
      
      {/* Bottom padding to accommodate navigation */}
      <div className="h-20"></div>
    </div>
  );
}