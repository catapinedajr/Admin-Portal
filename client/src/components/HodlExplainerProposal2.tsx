import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Bitcoin, ArrowRight, Zap } from "lucide-react";

interface HodlExplainerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HodlExplainerProposal2({ isOpen, onClose }: HodlExplainerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <Card className="bg-zinc-900 border-zinc-700 w-full max-w-md">
        <CardContent className="p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="space-y-5">
            {/* Logo and Brand */}
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-3">
                H<span className="inline-block w-6 h-6 bg-orange-500 rounded-full mx-1"></span>DLearn
              </div>
              <p className="text-zinc-400 text-sm">
                Where patience meets learning
              </p>
            </div>

            {/* Two Column Explanation */}
            <div className="space-y-4">
              <div className="bg-zinc-800/40 rounded-lg p-4 border-l-4 border-orange-500">
                <div className="flex items-center space-x-2 mb-2">
                  <Bitcoin className="w-5 h-5 text-orange-400" />
                  <h3 className="font-semibold text-white">HODL</h3>
                </div>
                <p className="text-zinc-300 text-sm">
                  Bitcoin's philosophy: Hold long-term through market storms. 
                  Patience builds wealth.
                </p>
              </div>

              <div className="flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-zinc-500" />
              </div>

              <div className="bg-zinc-800/40 rounded-lg p-4 border-l-4 border-blue-500">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold text-white">HODLearn</h3>
                </div>
                <p className="text-zinc-300 text-sm">
                  Our philosophy: Learn steadily through knowledge storms. 
                  Patience builds conviction.
                </p>
              </div>
            </div>

            {/* The Connection */}
            <div className="bg-gradient-to-r from-orange-900/20 to-blue-900/20 rounded-lg p-4 text-center">
              <p className="text-zinc-200 font-medium mb-2">
                The Connection
              </p>
              <p className="text-zinc-300 text-sm leading-relaxed">
                True Bitcoin conviction comes from understanding, not hype. 
                We teach you <span className="text-orange-400 font-semibold">how to learn</span> Bitcoin 
                sustainably—building lasting knowledge that creates unshakeable belief.
              </p>
            </div>

            {/* CTA */}
            <Button
              onClick={onClose}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              Continue Your Journey
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}