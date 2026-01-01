import { useEffect, useState } from "react";
import { Coins } from "@/lib/icons";

interface SatsRewardAnimationProps {
  isActive: boolean;
  satsAmount: number;
  onComplete?: () => void;
}

export default function SatsRewardAnimation({ isActive, satsAmount, onComplete }: SatsRewardAnimationProps) {
  const [showDrop, setShowDrop] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShowDrop(true);
      
      // Coin drop animation duration
      const timer = setTimeout(() => {
        setShowDrop(false);
        if (onComplete) onComplete();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive || !showDrop) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="relative">
        {/* Single coin drops from top and bounces */}
        <div className="animate-coin-drop">
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-full p-3 shadow-lg">
            <Coins className="w-6 h-6 text-white" />
          </div>
        </div>
        
        {/* Reward text appears with bounce */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 animate-bounce-in">
          <div className="text-lg font-bold text-orange-400 whitespace-nowrap">
            +{satsAmount} points
          </div>
        </div>
      </div>
    </div>
  );
}