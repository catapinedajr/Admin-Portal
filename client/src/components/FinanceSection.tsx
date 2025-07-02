import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  Bitcoin,
  Banknote,
  Shield,
  Zap
} from "lucide-react";

export default function FinanceSection() {
  const [inflationStep, setInflationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Historical money supply data (simplified for visualization)
  const moneySupplyData = {
    1920: { amount: 27, label: "$27B" },
    1971: { amount: 319, label: "$319B" },
    2000: { amount: 4900, label: "$4.9T" },
    2008: { amount: 8200, label: "$8.2T" },
    2024: { amount: 21000, label: "$21T" }
  };

  const yearButtons = [1920, 1971, 2000, 2008, 2024];

  // Animation steps for purchasing power demonstration
  const purchasingPowerSteps = [
    { year: 1924, amount: 100, description: "Your $100 has full purchasing power" },
    { year: 1950, amount: 48, description: "Inflation reduced value to $48" },
    { year: 1970, amount: 28, description: "Now worth only $28" },
    { year: 1990, amount: 14, description: "Purchasing power down to $14" },
    { year: 2010, amount: 8, description: "Your $100 now buys what $8 bought in 1924" },
    { year: 2024, amount: 4, description: "Today: Only $4 of original purchasing power remains" }
  ];

  // Inflation impact calculator
  const calculateInflationImpact = (principal: number, years: number, rate: number) => {
    return principal * Math.pow(1 + rate/100, years);
  };

  const startPurchasingPowerAnimation = () => {
    setIsAnimating(true);
    setInflationStep(0);
    
    const stepDuration = 2000; // 2 seconds per step
    
    purchasingPowerSteps.forEach((_, index) => {
      setTimeout(() => {
        setInflationStep(index);
        if (index === purchasingPowerSteps.length - 1) {
          setTimeout(() => setIsAnimating(false), stepDuration);
        }
      }, index * stepDuration);
    });
  };

  const currentStep = purchasingPowerSteps[inflationStep];
  const currentMoneySupply = moneySupplyData[selectedYear as keyof typeof moneySupplyData];
  const multiplication = Math.round(currentMoneySupply.amount / moneySupplyData[1920].amount);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">Why Bitcoin?</h2>
        <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
          Discover how traditional money is silently stealing your wealth, and why Bitcoin offers a better path forward.
        </p>
      </div>

      {/* Three Key Facts */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-400">21M</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Fixed Supply</h3>
            <p className="text-zinc-400">Bitcoin has a maximum of 21 million coins. No more can ever be created.</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-400">0%</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Inflation</h3>
            <p className="text-zinc-400">Unlike traditional money, Bitcoin cannot be printed to create inflation.</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Self-Custody</h3>
            <p className="text-zinc-400">You can hold Bitcoin directly without needing a bank or institution.</p>
          </CardContent>
        </Card>
      </div>

      {/* Purchasing Power Erosion Animation */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            Watch Your Money Disappear
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-zinc-400">
            See how $100 from 1924 lost 96% of its purchasing power due to inflation. This isn't theory—it's documented history.
          </p>
          
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="text-6xl font-bold text-green-400 transition-all duration-1000">
                ${currentStep.amount}
              </div>
              <div className="text-lg text-zinc-400 mt-2">
                {currentStep.year} • {currentStep.description}
              </div>
              
              {/* Visual dollar bill that fades */}
              <div className="mt-4">
                <div 
                  className="w-24 h-12 bg-green-600 rounded mx-auto transition-all duration-1000 flex items-center justify-center"
                  style={{ 
                    opacity: currentStep.amount / 100,
                    transform: `scale(${0.3 + (currentStep.amount / 100) * 0.7})`,
                  }}
                >
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            
            <Button 
              onClick={startPurchasingPowerAnimation}
              disabled={isAnimating}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isAnimating ? "Watching Money Disappear..." : "Watch Your Money Disappear"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Historical Money Supply Chart */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Total Supply of Dollars</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-5 gap-2">
            {yearButtons.map((year) => (
              <Button
                key={year}
                variant={selectedYear === year ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedYear(year)}
                className={selectedYear === year 
                  ? "bg-orange-600 hover:bg-orange-700" 
                  : "border-zinc-700 text-zinc-400 hover:text-white"
                }
              >
                {year}
              </Button>
            ))}
          </div>

          <div className="bg-zinc-800/50 p-6 rounded-lg space-y-4">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-orange-400 transition-all duration-700">
                {currentMoneySupply.label}
              </div>
              <div className="text-lg text-zinc-400">
                {multiplication}x more dollars than 1920
              </div>
            </div>

            {/* Simple chart visualization */}
            <div className="relative h-56 bg-zinc-900 rounded-lg p-4">
              <svg viewBox="0 0 400 220" className="w-full h-full">
                {/* Chart line */}
                <path
                  d="M 20 200 Q 100 180 150 120 Q 200 80 300 40 Q 350 20 380 10"
                  stroke="#f97316"
                  strokeWidth="3"
                  fill="none"
                  className="transition-all duration-700"
                />
                
                {/* Data points */}
                {yearButtons.map((year, index) => {
                  const x = 20 + (index * 90);
                  const data = moneySupplyData[year as keyof typeof moneySupplyData];
                  const y = 200 - (data.amount / moneySupplyData[2024].amount * 180);
                  
                  return (
                    <g key={year}>
                      <circle
                        cx={x}
                        cy={y}
                        r={selectedYear === year ? "6" : "4"}
                        fill={selectedYear === year ? "#f97316" : "#zinc-500"}
                        className="transition-all duration-300"
                      />
                      <text
                        x={x}
                        y={215}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#a1a1aa"
                      >
                        {year}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {selectedYear === 1971 && (
              <div className="bg-orange-600/10 p-4 rounded-lg border border-orange-600/20">
                <p className="text-orange-200 text-sm">
                  <strong>Gold Standard Ends:</strong> In 1971, the US stopped backing dollars with gold, 
                  allowing unlimited money printing.
                </p>
              </div>
            )}
          </div>

          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-orange-400">THIS is INFLATION</div>
            <p className="text-zinc-400">
              More money printed = each dollar worth less. Bitcoin's fixed 21M supply protects against this.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Settlement Speed Race */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Settlement Speed: Bitcoin vs Traditional Banking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-red-400">Traditional Banking</h4>
              <div className="bg-red-600/10 p-4 rounded-lg border border-red-600/20">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Domestic Transfer:</span>
                    <span className="text-red-400">1-3 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">International:</span>
                    <span className="text-red-400">3-7 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Weekend/Holiday:</span>
                    <span className="text-red-400">+2-3 days</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-green-400">Bitcoin Network</h4>
              <div className="bg-green-600/10 p-4 rounded-lg border border-green-600/20">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Any Transfer:</span>
                    <span className="text-green-400">~10 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">International:</span>
                    <span className="text-green-400">~10 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">24/7/365:</span>
                    <span className="text-green-400">Always open</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-zinc-400">
              Bitcoin settles payments faster than banks, works weekends, and never takes holidays.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-orange-600/20 to-orange-800/20 border-orange-600/30">
        <CardContent className="p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold text-white">Ready to Learn More?</h3>
          <p className="text-orange-100 text-lg">
            Understanding Bitcoin starts with understanding why traditional money is failing. 
            Take the next step in your journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
            <Button 
              size="lg" 
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => window.location.href = "/learn"}
            >
              Start Learning Bitcoin
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-orange-600 text-orange-400 hover:bg-orange-600/10"
              onClick={() => window.location.href = "/simulators"}
            >
              Try Our Simulators
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}