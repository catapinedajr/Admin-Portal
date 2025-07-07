import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-bold">
              HL
            </div>
            <div>
              <h1 className="text-2xl font-bold">About HODLearn</h1>
              <p className="text-zinc-400">Learn Bitcoin at your own pace</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-2xl mx-auto">
              HL
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Why HODLearn?</h2>
              <p className="text-zinc-300 leading-relaxed">
                Bitcoin learning was overwhelming and confusing. We created HODLearn to make it simple, 
                daily, and accessible for everyone - no technical background required.
              </p>
              
              <p className="text-zinc-300 leading-relaxed">
                Just like HODLing requires patience, learning Bitcoin takes time. Small daily steps 
                build real understanding and lasting conviction.
              </p>
            </div>

            <div className="pt-4">
              <Button 
                onClick={() => setLocation('/')}
                className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2 mx-auto"
              >
                Start Learning
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}