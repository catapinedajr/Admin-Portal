import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import BottomNavigation from "@/components/BottomNavigation";

export default function FinancePageSimple() {
  const [, setLocation] = useLocation();
  const [inflationAmount, setInflationAmount] = useState(10000);
  const [inflationRate, setInflationRate] = useState(4);

  // Simple inflation calculation
  const calculateInflation = (amount: number, rate: number, years: number) => {
    return amount * Math.pow((1 + rate / 100), years);
  };

  const currentValue = calculateInflation(inflationAmount, inflationRate, 10);
  const purchasingPower = inflationAmount / currentValue * inflationAmount;

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-6xl mx-auto p-4 space-y-8 pb-24">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-8">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">
              Why Bitcoin Matters: Finance
            </h1>
            
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-zinc-800 rounded-xl">
                  <div className="text-orange-300 font-bold text-xl">21 Million</div>
                  <div className="text-zinc-300 text-sm">Bitcoin's Maximum Supply</div>
                  <div className="text-zinc-400 text-xs mt-1">No central bank can print more</div>
                </div>
                
                <div className="p-4 bg-zinc-800 rounded-xl">
                  <div className="text-orange-300 font-bold text-xl">0%</div>
                  <div className="text-zinc-300 text-sm">Bitcoin Inflation Rate</div>
                  <div className="text-zinc-400 text-xs mt-1">After all 21M are mined</div>
                </div>
                
                <div className="p-4 bg-orange-950/50 rounded-xl border border-orange-800">
                  <div className="text-orange-300 font-bold text-xl">You Control It</div>
                  <div className="text-zinc-300 text-sm">Self-Custody</div>
                  <div className="text-zinc-400 text-xs mt-1">No bank can freeze your Bitcoin</div>
                </div>
              </div>

              {/* Simple Inflation Calculator */}
              <Card className="bg-zinc-800 border-zinc-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Inflation Calculator</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-zinc-300 mb-2">Amount ($)</label>
                      <input
                        type="number"
                        value={inflationAmount}
                        onChange={(e) => setInflationAmount(Number(e.target.value))}
                        className="w-full p-3 bg-zinc-700 text-white rounded-lg border border-zinc-600"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-zinc-300 mb-2">Inflation Rate (%)</label>
                      <input
                        type="number"
                        value={inflationRate}
                        onChange={(e) => setInflationRate(Number(e.target.value))}
                        className="w-full p-3 bg-zinc-700 text-white rounded-lg border border-zinc-600"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-red-950/50 rounded-lg border border-red-800">
                    <div className="text-white">
                      <div className="text-lg">After 10 years at {inflationRate}% inflation:</div>
                      <div className="text-2xl font-bold text-red-400">
                        Your ${inflationAmount.toLocaleString()} would cost ${Math.round(currentValue).toLocaleString()}
                      </div>
                      <div className="text-red-300 mt-2">
                        Purchasing power lost: ${Math.round(currentValue - inflationAmount).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
          </CardContent>
        </Card>
      </div>
      
      <BottomNavigation />
    </div>
  );
}