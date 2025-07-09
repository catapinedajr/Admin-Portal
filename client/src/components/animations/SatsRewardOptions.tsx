import React, { useState, useEffect } from 'react';
import { Zap, Coins, TrendingUp } from '@/lib/icons';

interface SatsRewardOptionsProps {
  amount: number;
  onComplete: () => void;
  variant: 'instant' | 'bounce' | 'cascade';
}

export const SatsRewardOptions: React.FC<SatsRewardOptionsProps> = ({ 
  amount, 
  onComplete, 
  variant 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const duration = variant === 'instant' ? 400 : variant === 'bounce' ? 600 : 1000;
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, duration);
    return () => clearTimeout(timer);
  }, [onComplete, variant]);

  if (!isVisible) return null;

  // Option 1: Instant Flash (400ms)
  if (variant === 'instant') {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="animate-ping bg-orange-500/20 rounded-full p-16">
          <div className="bg-orange-500 rounded-full p-4 animate-pulse">
            <Zap className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="absolute text-center">
          <div className="text-2xl font-bold text-orange-400 animate-bounce">
            +{amount} sats
          </div>
        </div>
      </div>
    );
  }

  // Option 2: Satisfying Bounce (600ms)
  if (variant === 'bounce') {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="animate-scale-bounce bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full p-6 shadow-lg">
          <Coins className="w-10 h-10 text-white animate-spin-slow" />
        </div>
        <div className="absolute mt-20 text-center">
          <div className="text-xl font-bold text-orange-400 animate-bounce-subtle">
            +{amount} sats earned
          </div>
          <div className="text-sm text-orange-300 animate-fade-in-delayed">
            ≈ ${((amount / 100000000) * 109000).toFixed(4)}
          </div>
        </div>
      </div>
    );
  }

  // Option 3: Elegant Cascade (1000ms)
  if (variant === 'cascade') {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="relative">
          {/* Main coin */}
          <div className="animate-float-in bg-gradient-to-br from-orange-400 to-orange-600 rounded-full p-6 shadow-2xl">
            <TrendingUp className="w-12 h-12 text-white" />
          </div>
          
          {/* Floating mini coins */}
          <div className="absolute -top-4 -left-4 animate-float-left bg-orange-400 rounded-full p-2">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <div className="absolute -top-4 -right-4 animate-float-right bg-orange-400 rounded-full p-2">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <div className="absolute -bottom-4 left-0 animate-float-up bg-orange-400 rounded-full p-2">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
        
        <div className="absolute mt-24 text-center">
          <div className="text-2xl font-bold text-orange-400 animate-type-in">
            +{amount} satoshis
          </div>
          <div className="text-lg text-orange-300 animate-fade-in-delayed">
            Building conviction
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SatsRewardOptions;