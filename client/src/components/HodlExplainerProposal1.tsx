import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, TrendingUp, Brain, Heart } from "lucide-react";

interface HodlExplainerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HodlExplainerProposal1({ isOpen, onClose }: HodlExplainerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <Card className="bg-zinc-900 border-zinc-700 w-full max-w-lg">
        <CardContent className="p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-orange-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                What Does HODL Mean?
              </h2>
              <p className="text-zinc-400">
                The philosophy that inspired HODLearn
              </p>
            </div>

            {/* HODL Explanation */}
            <div className="bg-zinc-800/50 rounded-lg p-5 space-y-3">
              <h3 className="text-lg font-semibold text-orange-400">
                In the Bitcoin Community:
              </h3>
              <p className="text-zinc-300">
                <span className="font-semibold text-white">HODL</span> means "Hold On for Dear Life" - 
                the strategy of buying Bitcoin and holding it long-term, regardless of market ups and downs.
              </p>
              <p className="text-zinc-300">
                HODLers believe that patience and conviction in Bitcoin's long-term value 
                beats trying to time the market.
              </p>
            </div>

            {/* Connection to Learning */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Brain className="w-6 h-6 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">HODLearn = How to Learn</h4>
                  <p className="text-zinc-300 text-sm">
                    Just like HODLing requires patience, real Bitcoin understanding takes time to build.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Heart className="w-6 h-6 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Building Conviction</h4>
                  <p className="text-zinc-300 text-sm">
                    We help you develop the deep understanding that creates lasting conviction in Bitcoin's mission.
                  </p>
                </div>
              </div>
            </div>

            {/* Mission Statement */}
            <div className="bg-orange-900/20 border border-orange-800 rounded-lg p-4 text-center">
              <p className="text-orange-300 font-medium">
                "HODLearn teaches you how to learn Bitcoin the healthy way - 
                building sustainable knowledge that creates unshakeable conviction."
              </p>
            </div>

            <Button
              onClick={onClose}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              Continue Learning
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}