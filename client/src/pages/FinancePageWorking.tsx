import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import BottomNavigation from "@/components/BottomNavigation";

export default function FinancePageWorking() {
  const [, setLocation] = useLocation();
  
  // Inflation calculator state
  const [inflationAmount, setInflationAmount] = useState(10000);
  const [inflationRate, setInflationRate] = useState(4);
  const [inflationYears, setInflationYears] = useState(10);

  // Simple inflation calculation
  const calculateInflation = (amount: number, rate: number, years: number) => {
    return amount * Math.pow((1 + rate / 100), years);
  };

  const futureValue = calculateInflation(inflationAmount, inflationRate, inflationYears);
  const purchasingPowerLoss = futureValue - inflationAmount;

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-6xl mx-auto p-4 space-y-8 pb-24">
        {/* Hero Section */}
        <Card className="bg-gradient-to-br from-orange-950/30 via-zinc-900 to-red-950/30 border-orange-800/50">
          <CardContent className="p-8">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h2 className="text-4xl font-bold text-white mb-4">
                Your Money Is Being <span className="text-red-400">Silently Stolen</span>
              </h2>
              
              <p className="text-zinc-300 text-lg mb-6">
                Every year, inflation quietly erodes your purchasing power. What cost $1 in 1920 now costs over $15. 
                But there's a solution that can't be printed away.
              </p>

              {/* Key Facts Grid */}
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
                  <div className="text-orange-300 font-bold text-xl">You Control It</div>
                  <div className="text-zinc-300 text-sm">Self-Custody</div>
                  <div className="text-zinc-400 text-xs mt-1">No bank can freeze your Bitcoin</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inflation Calculator */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Inflation Erosion Calculator</h3>
            <p className="text-zinc-300 mb-6">
              See how inflation destroys your purchasing power over time. This is why Bitcoin matters.
            </p>
            
            <div className="space-y-6">
              {/* Amount Selection */}
              <div>
                <label className="block text-zinc-300 mb-3 font-medium">Starting Amount</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {[1000, 5000, 10000, 25000, 50000, 100000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setInflationAmount(amount)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        inflationAmount === amount
                          ? 'bg-orange-600 border-orange-500 text-white'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      ${amount.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inflation Rate Selection */}
              <div>
                <label className="block text-zinc-300 mb-3 font-medium">Annual Inflation Rate</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { rate: 2, label: "Fed Target (2%)", desc: "Official target rate" },
                    { rate: 4, label: "Moderate (4%)", desc: "Common real rate" },
                    { rate: 8.5, label: "Recent Peak (8.5%)", desc: "2022 inflation spike" },
                    { rate: 15, label: "Crisis Level (15%)", desc: "1979-80 peak rate" }
                  ].map((option) => (
                    <button
                      key={option.rate}
                      onClick={() => setInflationRate(option.rate)}
                      className={`p-4 rounded-lg border text-left transition-colors ${
                        inflationRate === option.rate
                          ? 'bg-orange-600/20 border-orange-500 text-white'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-zinc-400 mt-1">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Period */}
              <div>
                <label className="block text-zinc-300 mb-3 font-medium">Time Period: {inflationYears} years</label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={inflationYears}
                  onChange={(e) => setInflationYears(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-zinc-400 mt-1">
                  <span>1 year</span>
                  <span>15 years</span>
                  <span>30 years</span>
                </div>
              </div>

              {/* Results */}
              <div className="p-6 bg-gradient-to-r from-red-950/50 to-orange-950/50 rounded-lg border border-red-800/50">
                <h4 className="text-xl font-bold text-white mb-4">The Damage After {inflationYears} Years</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-300">Your ${inflationAmount.toLocaleString()} would need to be:</span>
                    <span className="text-2xl font-bold text-red-400">
                      ${Math.round(futureValue).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-300">Purchasing power lost:</span>
                    <span className="text-xl font-bold text-red-300">
                      ${Math.round(purchasingPowerLoss).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-red-800/50">
                    <span className="text-zinc-300">Inflation rate used:</span>
                    <span className="text-lg font-bold text-orange-400">{inflationRate}% annually</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-zinc-900/50 rounded border border-zinc-700/50">
                  <p className="text-zinc-300 text-sm">
                    <span className="text-orange-400 font-semibold">Bitcoin's Response:</span> With a fixed supply of 21 million coins, 
                    Bitcoin cannot be inflated away by central banks. Your purchasing power is protected by mathematics, not promises.
                  </p>
                </div>
              </div>

              {/* Historical Context */}
              <Card className="bg-zinc-800/50 border-zinc-700/50">
                <CardContent className="p-6">
                  <h4 className="text-lg font-bold text-white mb-3">Historical Reality</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-300">$1 in 1920 equals today:</span>
                      <span className="text-orange-400 font-bold">$15.50</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-300">Purchasing power lost:</span>
                      <span className="text-red-400 font-bold">93.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-300">Money supply growth since 1971:</span>
                      <span className="text-red-400 font-bold">3,600%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border-orange-700/50">
          <CardContent className="p-6 text-center">
            <h4 className="text-xl font-bold text-white mb-2">
              This Is Why Bitcoin Matters
            </h4>
            <p className="text-zinc-300 mb-4">
              Bitcoin's fixed 21 million supply means it can't be inflated away like fiat currency. 
              Learn how to protect your wealth from this silent destruction.
            </p>
            <Button 
              onClick={() => setLocation('/learn')}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Start Learning Bitcoin
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <BottomNavigation />
    </div>
  );
}