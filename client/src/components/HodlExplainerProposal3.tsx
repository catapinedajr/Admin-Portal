import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Bitcoin, GraduationCap } from "lucide-react";

interface HodlExplainerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HodlExplainerProposal3({ isOpen, onClose }: HodlExplainerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <Card className="bg-zinc-900 border-zinc-700 w-full max-w-sm">
        <CardContent className="p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="space-y-5 text-center">
            {/* Logo */}
            <div className="text-2xl font-bold text-white">
              H<span className="inline-block w-5 h-5 bg-orange-500 rounded-full mx-1"></span>DLearn
            </div>

            {/* Simple Explanation */}
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <div className="flex flex-col items-center space-y-1">
                  <Bitcoin className="w-8 h-8 text-orange-400" />
                  <span className="text-xs text-zinc-400">Bitcoin</span>
                </div>
                <span className="text-zinc-500">+</span>
                <div className="flex flex-col items-center space-y-1">
                  <GraduationCap className="w-8 h-8 text-blue-400" />
                  <span className="text-xs text-zinc-400">Learning</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-white font-medium text-sm mb-1">HODL</p>
                  <p className="text-zinc-300 text-xs">Hold Bitcoin long-term with patience</p>
                </div>
                
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-white font-medium text-sm mb-1">HODLearn</p>
                  <p className="text-zinc-300 text-xs">Learn Bitcoin sustainably with patience</p>
                </div>
              </div>
            </div>

            {/* Core Message */}
            <div className="bg-orange-900/20 border border-orange-800 rounded-lg p-4">
              <p className="text-orange-300 text-sm font-medium leading-relaxed">
                We help you build the deep conviction that makes HODLing natural—
                through steady, sustainable learning.
              </p>
            </div>

            <Button
              onClick={onClose}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm py-2"
            >
              Got it
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}