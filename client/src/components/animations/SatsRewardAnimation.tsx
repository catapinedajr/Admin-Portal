import { useEffect, useState } from "react";
import { Coins } from "@/lib/icons";

interface SatsRewardAnimationProps {
  isActive: boolean;
  satsAmount: number;
  onComplete?: () => void;
}

export default function SatsRewardAnimation({ isActive, satsAmount, onComplete }: SatsRewardAnimationProps) {
  const [showBurst, setShowBurst] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShowBurst(true);
      
      // Quick cleanup after brief animation
      const timer = setTimeout(() => {
        setShowBurst(false);
        if (onComplete) onComplete();
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive || !showBurst) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Simple burst effect */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          {/* Quick pulse */}
          <div className="absolute inset-0 bg-orange-500/30 rounded-full w-16 h-16 animate-ping" />
          
          {/* Success message */}
          <div className="relative bg-gradient-to-r from-orange-600 to-orange-500 text-white px-3 py-1 rounded-lg shadow-lg animate-scale-in text-sm">
            <div className="flex items-center gap-1">
              <Coins className="w-3 h-3" />
              <span className="font-medium">+{satsAmount}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Minimal floating coins */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-float-up-out"
          style={{
            '--target-x': `${(i - 1) * 30}px`,
            '--target-y': `-80px`,
            animationDelay: `${i * 100}ms`,
          } as React.CSSProperties}
        >
          <Coins className="w-3 h-3 text-orange-400" />
        </div>
      ))}
    </div>
  );
}