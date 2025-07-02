import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Heart, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-white">About HODLearn</h3>
        <p className="text-zinc-400">The story behind how to learn Bitcoin</p>
      </div>

      {/* Navigation to full About page */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-2xl mx-auto">
              HL
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-2">Learn Our Story</h4>
              <p className="text-zinc-300 mb-4">
                Discover how HODLearn connects the patience of HODLing with the journey of learning Bitcoin. 
                From overwhelmed beginners to building conviction through understanding.
              </p>
              <Button 
                onClick={() => window.location.href = '/about'}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Read Our Full Story
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Philosophy Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-orange-400 mt-1" />
              <div>
                <h5 className="font-semibold text-white mb-1">Your Pace</h5>
                <p className="text-sm text-zinc-400">
                  Everyone learns Bitcoin differently. We meet you where you are.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-orange-400 mt-1" />
              <div>
                <h5 className="font-semibold text-white mb-1">Built with Care</h5>
                <p className="text-sm text-zinc-400">
                  Every lesson is written like we're explaining it to our own family.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}