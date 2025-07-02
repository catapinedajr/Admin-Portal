import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingDown, DollarSign, Calendar, ArrowRight } from "lucide-react";

export default function Finance() {
  // Money supply visualization state
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  // Money supply data for different years
  const moneySupplyData = {
    1924: { amount: 27000000000, label: "$27B" },
    1971: { amount: 700000000000, label: "$700B" },  
    2000: { amount: 4900000000000, label: "$4.9T" },
    2008: { amount: 8200000000000, label: "$8.2T" },
    2024: { amount: 21000000000000, label: "$21T" }
  };

  const startAnimation = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setAnimationStep(0);
    
    let currentAmount = 100000; // Starting with $100,000
    let step = 0;
    
    const interval = setInterval(() => {
      step++;
      // Lose about 3.2% purchasing power per year on average
      currentAmount = currentAmount * 0.968;
      setAnimationStep(currentAmount);
      
      if (step >= 25) { // 25 steps = roughly 25 years of erosion
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 480); // 480ms per step = 12 second total animation
  };

  const getCurrentData = () => moneySupplyData[selectedYear as keyof typeof moneySupplyData];
  const getMultiplier = () => Math.round(moneySupplyData[selectedYear as keyof typeof moneySupplyData].amount / moneySupplyData[1924].amount);

  return (
    <div className="space-y-8">
      {/* Hero Narrative */}
      <Card className="bg-gradient-to-br from-orange-950/30 via-zinc-900 to-red-950/30 border-orange-800/50">
        <CardContent className="p-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold text-white mb-4">
              The Hidden Tax <span className="text-red-400">Eating Your Savings</span>
            </h2>
            
            <div className="text-lg text-zinc-300 leading-relaxed space-y-4">
              <p>
                Every year, your money buys less than it did the year before. This isn't an accident—it's how the current money system works.
              </p>
              
              <p>
                <span className="text-orange-400 font-semibold">What cost $1 in 1920 now costs $15.50.</span> Your great-grandparents could buy a house with one income. Today, two incomes barely cover rent.
              </p>
              
              <p>
                The reason? Central banks can print unlimited money, making each dollar worth less over time.
              </p>
              
              <p>
                But what if there was <span className="text-orange-400 font-semibold">money that couldn't be printed?</span> For the first time in history, Bitcoin offers mathematically limited supply—only 21 million will ever exist.
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
                Ready to understand the difference?
              </div>
              <div className="text-zinc-300">
                The tools below show you exactly how inflation works and why Bitcoin offers an alternative. 
                No complicated math—just clear examples you can explore at your own pace.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Money Supply Erosion Visualization */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center gap-3 text-xl">
            <TrendingDown className="w-5 h-5 text-orange-400" />
            Watch Your Money Disappear
          </CardTitle>
          <p className="text-zinc-400 text-sm">
            See how $100,000 in purchasing power shrinks over 25 years of inflation
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="relative">
              {/* Dollar Bill Visualization */}
              <div 
                className={`mx-auto transition-all duration-700 ease-out ${
                  isAnimating 
                    ? `scale-${Math.max(30, Math.round((animationStep / 100000) * 100))} opacity-${Math.max(20, Math.round((animationStep / 100000) * 100))} rotate-${Math.round((100000 - animationStep) / 5000)}` 
                    : 'scale-100 opacity-100 rotate-0'
                }`}
                style={{
                  transform: isAnimating 
                    ? `scale(${Math.max(0.3, animationStep / 100000)}) rotate(${Math.round((100000 - animationStep) / 1000)}deg)`
                    : 'scale(1) rotate(0deg)',
                  opacity: isAnimating ? Math.max(0.2, animationStep / 100000) : 1
                }}
              >
                <div className="w-32 h-16 bg-gradient-to-r from-green-700 to-green-600 rounded-lg border-2 border-green-500 flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
              </div>
              
              {/* Value Display */}
              <div className="mt-4 space-y-2">
                <div className="text-3xl font-bold text-white">
                  ${isAnimating ? Math.round(animationStep).toLocaleString() : '100,000'}
                </div>
                <div className="text-zinc-400 text-sm">
                  {isAnimating ? 'Purchasing Power After Inflation' : 'Starting Amount'}
                </div>
              </div>
            </div>

            <Button 
              onClick={startAnimation}
              disabled={isAnimating}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
            >
              {isAnimating ? 'Inflating Away...' : 'Watch Your Money Disappear'}
            </Button>
            
            {animationStep > 0 && animationStep < 100000 && (
              <div className="p-4 bg-red-950/30 border border-red-800/50 rounded-lg">
                <p className="text-red-300 font-semibold">
                  You've lost ${(100000 - Math.round(animationStep)).toLocaleString()} in purchasing power!
                </p>
                <p className="text-zinc-400 text-sm mt-1">
                  This is how traditional money loses value over time through inflation.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Money Supply Chart */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-xl">Total Supply of Dollars</CardTitle>
          <p className="text-zinc-400 text-sm">
            See how money printing has accelerated over the past century
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Year Selection */}
          <div className="flex flex-wrap justify-center gap-2">
            {Object.keys(moneySupplyData).map((year) => (
              <Button
                key={year}
                variant={selectedYear === parseInt(year) ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedYear(parseInt(year))}
                className={selectedYear === parseInt(year) 
                  ? "bg-orange-600 hover:bg-orange-700 text-white" 
                  : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                }
              >
                {year}
              </Button>
            ))}
          </div>

          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-6 bg-zinc-800/50 rounded-xl border border-zinc-700/50 text-center">
              <div className="text-orange-300 font-bold text-3xl mb-2">
                {getCurrentData().label}
              </div>
              <div className="text-zinc-300 text-lg font-medium mb-1">
                Dollar Supply in {selectedYear}
              </div>
              <div className="text-zinc-400 text-sm">
                {getMultiplier()}x more dollars than 1924
              </div>
            </div>
            
            <div className="p-6 bg-orange-950/30 rounded-xl border border-orange-800/50 text-center">
              <div className="text-orange-300 font-bold text-3xl mb-2">
                21M
              </div>
              <div className="text-orange-400/80 text-lg font-medium mb-1">
                Bitcoin Maximum Supply
              </div>
              <div className="text-zinc-400 text-sm">
                Never changes, can't be printed
              </div>
            </div>
          </div>

          {/* Chart Visualization */}
          <div className="bg-zinc-800/30 p-4 rounded-xl">
            <div className="h-56 relative">
              <svg viewBox="0 0 400 220" className="w-full h-full">
                {/* Money supply line */}
                <polyline
                  points="40,180 100,160 180,120 280,80 360,40"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="3"
                  className="transition-all duration-700"
                />
                
                {/* Data points */}
                {[
                  { x: 40, y: 180, year: '1924', amount: '$27B' },
                  { x: 100, y: 160, year: '1971', amount: '$700B' },
                  { x: 180, y: 120, year: '2000', amount: '$4.9T' },
                  { x: 280, y: 80, year: '2008', amount: '$8.2T' },
                  { x: 360, y: 40, year: '2024', amount: '$21T' }
                ].map((point, index) => (
                  <g key={index}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="4"
                      fill="#f97316"
                      className={selectedYear === parseInt(point.year) ? "opacity-100" : "opacity-60"}
                    />
                    <text
                      x={point.x}
                      y={point.y - 10}
                      textAnchor="middle"
                      fontSize="12"
                      fill="#e4e4e7"
                      className={selectedYear === parseInt(point.year) ? "font-bold" : ""}
                    >
                      {point.amount}
                    </text>
                  </g>
                ))}

                {/* X-axis labels */}
                <text x="40" y="200" textAnchor="middle" fontSize="12" fill="#a1a1aa">1924</text>
                <text x="100" y="200" textAnchor="middle" fontSize="12" fill="#a1a1aa">1971</text>
                <text x="180" y="200" textAnchor="middle" fontSize="12" fill="#a1a1aa">2000</text>
                <text x="280" y="200" textAnchor="middle" fontSize="12" fill="#a1a1aa">2008</text>
                <text x="360" y="200" textAnchor="middle" fontSize="12" fill="#a1a1aa">2024</text>

                {/* Gold Standard marker (1971) */}
                {selectedYear >= 1971 && (
                  <g>
                    <line x1="100" y1="20" x2="100" y2="180" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
                    <rect x="50" y="15" width="100" height="30" fill="#1f2937" stroke="#fbbf24" strokeWidth="1" rx="4" />
                    <text x="100" y="35" textAnchor="middle" fontSize="12" fill="#fbbf24">Gold Standard Ends</text>
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Emphasis Text */}
          <div className="text-center p-6 bg-orange-950/20 rounded-xl border border-orange-800/30">
            <div className="text-orange-300 font-bold text-2xl mb-2">
              THIS is INFLATION
            </div>
            <div className="text-zinc-300">
              When governments print more money, each dollar becomes worth less. 
              Bitcoin's 21 million limit means no one can print more to devalue your savings.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-br from-orange-950/40 via-zinc-900 to-orange-950/40 border-orange-800/50">
        <CardContent className="p-8 text-center space-y-6">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Learn How Bitcoin Works?
          </h3>
          
          <div className="text-zinc-300 text-lg leading-relaxed max-w-2xl mx-auto">
            <p>
              Understanding the problem is just the first step. Now discover how Bitcoin's technology 
              creates truly scarce digital money for the first time in history.
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 mt-8 max-w-2xl mx-auto">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white p-4 h-auto">
              <div className="text-left">
                <div className="font-semibold mb-1">Start Learning</div>
                <div className="text-sm opacity-90">Daily Bitcoin lessons</div>
              </div>
              <ArrowRight className="w-5 h-5 ml-auto" />
            </Button>
            
            <Button variant="outline" className="border-orange-600 text-orange-400 hover:bg-orange-950/30 p-4 h-auto">
              <div className="text-left">
                <div className="font-semibold mb-1">Try Simulators</div>
                <div className="text-sm opacity-90">Interactive tools</div>
              </div>
              <ArrowRight className="w-5 h-5 ml-auto" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}