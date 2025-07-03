import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, AlertTriangle, ArrowRight, Play, ArrowLeft } from "lucide-react";

export default function MoneySection() {
  const [currentYearIndex, setCurrentYearIndex] = useState(4); // Default to 2024
  const [isPurchasingPowerAnimating, setIsPurchasingPowerAnimating] = useState(false);
  const [currentPowerValue, setCurrentPowerValue] = useState(100);

  // Money supply milestones
  const milestones = [
    { year: "1920", amount: "31.8B", multiplier: "1x" },
    { year: "1971", amount: "631B", multiplier: "20x" },
    { year: "2000", amount: "4.9T", multiplier: "154x" },
    { year: "2008", amount: "8.2T", multiplier: "258x" },
    { year: "2024", amount: "21.0T", multiplier: "660x" }
  ];

  const currentMilestone = milestones[currentYearIndex];

  const startPurchasingPowerAnimation = () => {
    if (isPurchasingPowerAnimating) return;
    
    setIsPurchasingPowerAnimating(true);
    setCurrentPowerValue(100);
    
    const duration = 12000; // 12 seconds
    const steps = 120; // 120 steps for smooth animation
    const interval = duration / steps;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      // Exponential decay curve for realistic purchasing power loss
      const newValue = 100 * Math.pow(0.04, progress); // Ends at ~4% (96% loss)
      setCurrentPowerValue(Math.max(4, newValue));
      
      if (step >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setIsPurchasingPowerAnimating(false);
          setCurrentPowerValue(100);
        }, 2000);
      }
    }, interval);
  };

  return (
    <div className="space-y-8">
      {/* Hero Narrative */}
      <Card className="bg-gradient-to-br from-orange-950/30 via-zinc-900 to-red-950/30 border-orange-800/50">
        <CardContent className="p-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold text-white mb-4">
              Your Money Is Being <span className="text-red-400">Silently Stolen</span>
            </h2>
            
            <div className="text-lg text-zinc-300 leading-relaxed space-y-4">
              <p>
                Every day you wait, your savings lose purchasing power. It's not your fault—the system is rigged. 
                Central banks print money endlessly, devaluing your hard-earned dollars while the wealthy protect 
                themselves with assets that can't be printed.
              </p>
              
              <p>
                <span className="text-orange-400 font-semibold">What cost $1 in 1920 now costs $15.50.</span> Your 
                great-grandparents could buy a house with one income and still save money. Today, two incomes barely 
                cover rent. This isn't progress—it's systematic wealth transfer from savers to money printers.
              </p>
              
              <p>
                But there's an escape route. For the first time in human history, we have <span className="text-orange-400 font-semibold">
                mathematically perfect money</span> that can't be inflated away. Bitcoin isn't just digital gold—it's 
                the antidote to monetary debasement.
              </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3 mt-8">
              <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                <div className="text-orange-300 font-bold text-xl">21 Million</div>
                <div className="text-zinc-300 text-sm">Bitcoin's Maximum Supply</div>
                <div className="text-zinc-400 text-xs mt-1">No central bank can print more</div>
              </div>
              
              <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                <div className="text-orange-300 font-bold text-xl">0%</div>
                <div className="text-zinc-300 text-sm">Bitcoin Inflation Rate</div>
                <div className="text-zinc-400 text-xs mt-1">After all 21M are mined</div>
              </div>
              
              <div className="p-4 bg-orange-950/50 rounded-xl border border-orange-800/50">
                <div className="text-orange-300 font-bold text-xl">100%</div>
                <div className="text-orange-400/80 text-sm">You Own Your Bitcoin</div>
                <div className="text-zinc-400 text-xs mt-1">No bank can freeze it</div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-orange-950/20 rounded-xl border border-orange-800/30">
              <div className="text-orange-300 font-semibold text-lg mb-2">
                Ready to Protect Your Wealth?
              </div>
              <div className="text-zinc-300 text-sm mb-4">
                Learn how Bitcoin shields you from monetary manipulation. Start with our beginner-friendly lessons.
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button 
                  onClick={() => window.location.href = '/learn'}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Start Learning Bitcoin
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  onClick={() => window.location.href = '/simulators'}
                  variant="outline" 
                  className="border-orange-600 text-orange-300 hover:bg-orange-950/50"
                >
                  Try Our Simulators
                  <Play className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchasing Power Erosion Animation */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Watch Your <span className="text-red-400">Purchasing Power</span> Disappear
              </h3>
              <p className="text-zinc-400 mb-6">
                See how inflation silently steals your wealth over a typical career
              </p>
              
              <Button 
                onClick={startPurchasingPowerAnimation}
                disabled={isPurchasingPowerAnimating}
                className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-3"
              >
                {isPurchasingPowerAnimating ? "Watching Money Disappear..." : "Watch Your Money Disappear"}
                <TrendingUp className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            <div className="relative bg-zinc-800 rounded-xl p-8">
              <div className="text-center space-y-4">
                <div className="text-6xl">💵</div>
                
                <div className={`text-4xl font-bold transition-all duration-300 ${
                  currentPowerValue < 50 ? 'text-red-400' : 
                  currentPowerValue < 80 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  ${currentPowerValue.toFixed(0)}
                </div>
                
                <div className="text-zinc-300">Purchasing Power</div>
                
                <div className="w-full bg-zinc-700 rounded-full h-4 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-200 ${
                      currentPowerValue < 50 ? 'bg-red-500' : 
                      currentPowerValue < 80 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${currentPowerValue}%` }}
                  />
                </div>
                
                <div className="text-sm text-zinc-400">
                  {isPurchasingPowerAnimating ? (
                    <>Over a 40-year career, inflation quietly steals {(100 - currentPowerValue).toFixed(0)}% of your money's value</>
                  ) : (
                    "Click above to see inflation's devastating impact over time"
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Money Supply Growth Chart */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Total Supply of Dollars</h3>
              <p className="text-zinc-400">
                Watch how money printing has exploded since 1971
              </p>
            </div>
            
            {/* Year Navigation */}
            <div className="flex justify-center gap-2 mb-8">
              {milestones.map((milestone, index) => (
                <Button
                  key={milestone.year}
                  variant={currentYearIndex === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentYearIndex(index)}
                  className={currentYearIndex === index ? 
                    "bg-orange-600 hover:bg-orange-700 text-white" : 
                    "border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                  }
                >
                  {milestone.year}
                </Button>
              ))}
            </div>
            
            {/* Statistics Display */}
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <div className="bg-zinc-800 rounded-xl p-6">
                <div className="text-orange-400 text-3xl font-bold">${currentMilestone.amount}</div>
                <div className="text-zinc-300 text-lg">Total Dollars in {currentMilestone.year}</div>
                <div className="text-zinc-400 text-sm mt-1">
                  {currentMilestone.multiplier} increase since 1920
                </div>
              </div>
              
              <div className="bg-zinc-800 rounded-xl p-6">
                <div className="text-orange-400 text-3xl font-bold">21M</div>
                <div className="text-zinc-300 text-lg">Bitcoin Maximum Supply</div>
                <div className="text-zinc-400 text-sm mt-1">
                  Fixed forever by mathematics
                </div>
              </div>
            </div>
            
            {/* Chart */}
            <div className="bg-zinc-800 rounded-xl p-6">
              <div className="h-56 relative">
                <svg viewBox="0 0 400 220" className="w-full h-full">
                  {/* Chart line showing exponential growth */}
                  <path
                    d="M 50 180 Q 100 175 150 170 Q 200 150 250 120 Q 300 80 350 40"
                    stroke="#f97316"
                    strokeWidth="3"
                    fill="none"
                  />
                  
                  {/* Data points */}
                  {milestones.map((milestone, index) => {
                    const x = 50 + (index * 75);
                    const y = 180 - (index * 35);
                    const isSelected = currentYearIndex === index;
                    
                    return (
                      <g key={milestone.year}>
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? "8" : "5"}
                          fill={isSelected ? "#f97316" : "#fbbf24"}
                          className="cursor-pointer transition-all duration-300"
                          onClick={() => setCurrentYearIndex(index)}
                        />
                        <text
                          x={x}
                          y={y + 25}
                          textAnchor="middle"
                          className="fill-zinc-300 text-xs"
                          fontSize="12"
                        >
                          {milestone.year}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Gold Standard End Marker */}
                  <g>
                    <line x1="125" y1="40" x2="125" y2="180" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
                    <text x="125" y="35" textAnchor="middle" className="fill-red-400 text-xs" fontSize="10">
                      Gold Standard Ends
                    </text>
                  </g>
                </svg>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <div className="text-orange-400 text-xl font-bold mb-2">THIS is INFLATION</div>
              <p className="text-zinc-400 text-sm">
                When money supply grows faster than economic output, your purchasing power shrinks
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problem Solution Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Traditional Problems */}
        <Card className="bg-gradient-to-br from-red-950/30 to-zinc-900 border-red-800/50">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-red-300">The Traditional Money Problem</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-red-950/20 rounded-lg border-l-4 border-red-600">
                <h4 className="font-semibold text-red-300 mb-2">Endless Money Printing</h4>
                <p className="text-zinc-300 text-sm">
                  Central banks create money out of thin air, diluting your savings' purchasing power every single day.
                </p>
              </div>
              
              <div className="p-4 bg-red-950/20 rounded-lg border-l-4 border-red-600">
                <h4 className="font-semibold text-red-300 mb-2">Your Money Isn't Really Yours</h4>
                <p className="text-zinc-300 text-sm">
                  Banks can freeze accounts, governments can seize assets, and payment processors can ban transactions.
                </p>
              </div>
              
              <div className="p-4 bg-red-950/20 rounded-lg border-l-4 border-red-600">
                <h4 className="font-semibold text-red-300 mb-2">Slow, Expensive Transfers</h4>
                <p className="text-zinc-300 text-sm">
                  Bank wires take days, cost $25-50, and don't work weekends. International transfers are even worse.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bitcoin Solutions */}
        <Card className="bg-gradient-to-br from-orange-950/30 to-zinc-900 border-orange-800/50">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="w-8 h-8 text-orange-400 mx-auto mb-2">₿</div>
              <h3 className="text-xl font-bold text-orange-300">The Bitcoin Solution</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-orange-950/20 rounded-lg border-l-4 border-orange-600">
                <h4 className="font-semibold text-orange-300 mb-2">Fixed Supply Forever</h4>
                <p className="text-zinc-300 text-sm">
                  Only 21 million Bitcoin will ever exist. No central authority can print more, protecting your purchasing power.
                </p>
              </div>
              
              <div className="p-4 bg-orange-950/20 rounded-lg border-l-4 border-orange-600">
                <h4 className="font-semibold text-orange-300 mb-2">True Ownership</h4>
                <p className="text-zinc-300 text-sm">
                  Your Bitcoin is secured by mathematics, not institutions. No one can freeze, seize, or control your money.
                </p>
              </div>
              
              <div className="p-4 bg-orange-950/20 rounded-lg border-l-4 border-orange-600">
                <h4 className="font-semibold text-orange-300 mb-2">Fast, Global Payments</h4>
                <p className="text-zinc-300 text-sm">
                  Send Bitcoin anywhere in the world in minutes, 24/7/365, for fees under $1. No banks needed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-orange-950/30 to-yellow-950/30 border-orange-800/50">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold text-white">
              Ready to Escape the System?
            </h3>
            
            <p className="text-zinc-300 max-w-2xl mx-auto">
              Bitcoin isn't just an investment—it's a financial revolution. Join millions who've discovered 
              the freedom of sound money that can't be manipulated by governments or central banks.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/learn'}
                className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-3"
              >
                Start Your Bitcoin Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                onClick={() => window.location.href = '/simulators'}
                variant="outline"
                className="border-orange-600 text-orange-300 hover:bg-orange-950/50 text-lg px-8 py-3"
              >
                Practice with Simulators
                <Play className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}