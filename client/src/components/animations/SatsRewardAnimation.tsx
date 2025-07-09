import { useEffect, useState } from "react";
import { Coins } from "@/lib/icons";

interface SatsRewardAnimationProps {
  isActive: boolean;
  satsAmount: number;
  onComplete?: () => void;
}

interface FloatingSat {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  delay: number;
  rotation: number;
  scale: number;
}

export default function SatsRewardAnimation({ isActive, satsAmount, onComplete }: SatsRewardAnimationProps) {
  const [sats, setSats] = useState<FloatingSat[]>([]);
  const [showBurst, setShowBurst] = useState(false);

  useEffect(() => {
    if (isActive) {
      // Create multiple floating sats with random trajectories
      const newSats: FloatingSat[] = [];
      const satCount = Math.min(12, Math.max(6, Math.floor(satsAmount / 20))); // 6-12 sats based on amount
      
      for (let i = 0; i < satCount; i++) {
        newSats.push({
          id: i,
          startX: Math.random() * window.innerWidth,
          startY: window.innerHeight * 0.7, // Start from bottom area
          targetX: Math.random() * window.innerWidth,
          targetY: -100, // Float up and out of view
          delay: Math.random() * 500, // Stagger the animations
          rotation: Math.random() * 360,
          scale: 0.8 + Math.random() * 0.4, // Random size between 0.8x and 1.2x
        });
      }
      
      setSats(newSats);
      setShowBurst(true);
      
      // Clean up after animation completes
      const timer = setTimeout(() => {
        setSats([]);
        setShowBurst(false);
        if (onComplete) onComplete();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, satsAmount, onComplete]);

  if (!isActive || !showBurst) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Central burst effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Main reward burst */}
          <div className="animate-ping absolute -inset-4 bg-orange-500/30 rounded-full scale-150"></div>
          <div className="animate-pulse absolute -inset-2 bg-orange-400/40 rounded-full"></div>
          
          {/* Central text */}
          <div className="relative bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-xl font-bold text-xl shadow-2xl animate-bounce">
            +{satsAmount} sats
          </div>
        </div>
      </div>

      {/* Floating sats */}
      {sats.map((sat) => (
        <div
          key={sat.id}
          className="absolute"
          style={{
            left: sat.startX,
            top: sat.startY,
            transform: `scale(${sat.scale}) rotate(${sat.rotation}deg)`,
            animationDelay: `${sat.delay}ms`,
          }}
        >
          <div
            className="animate-float-up-out"
            style={{
              '--target-x': `${sat.targetX - sat.startX}px`,
              '--target-y': `${sat.targetY - sat.startY}px`,
            } as React.CSSProperties}
          >
            <Coins className="w-8 h-8 text-orange-400 animate-spin" />
          </div>
        </div>
      ))}

      {/* Sparkle effects */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute animate-sparkle"
            style={{
              left: `${20 + (i * 10)}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 100}ms`,
            }}
          >
            <div className="w-2 h-2 bg-yellow-300 rounded-full shadow-lg animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Success message overlay */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl animate-scale-in font-bold text-2xl text-center">
          🎉 Correct Answer!
        </div>
      </div>
    </div>
  );
}