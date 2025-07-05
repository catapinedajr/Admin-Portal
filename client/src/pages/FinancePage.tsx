import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  Shield, 
  Clock, 
  Calculator,
  Zap,
  Home,
  Coffee,
  Car
} from "lucide-react";
import { useAppContext } from "@/components/shared/AppContextProvider";

export default function FinancePage() {
  const {
    activeSection,
    setActiveSection,
    inflationAmount,
    setInflationAmount,
    inflationRate,
    setInflationRate,
    inflationTimeFrame,
    setInflationTimeFrame,
    moneySupplyYear,
    setMoneySupplyYear,
    isAnimating,
    setIsAnimating,
    animationStep,
    setAnimationStep
  } = useAppContext();

  // Inflation calculation
  const calculateInflationImpact = () => {
    const rate = inflationRate / 100;
    const futureValue = inflationAmount * Math.pow(1 + rate, inflationTimeFrame);
    const purchasing = inflationAmount / Math.pow(1 + rate, inflationTimeFrame);
    return {
      futureValue,
      purchasingPower: purchasing,
      valueDestroyed: inflationAmount - purchasing
    };
  };

  const inflationResult = calculateInflationImpact();

  // Money supply data helper functions
  const getMoneySupplyRaw = (year: number) => {
    const m2Data: { [key: number]: number } = {
      1920: 0.023, 1971: 0.583, 2000: 4.9, 2008: 7.5, 2024: 21.0
    };
    
    if (m2Data[year]) return m2Data[year];
    
    const years = Object.keys(m2Data).map(Number).sort();
    let lower = years[0];
    let upper = years[years.length - 1];
    
    for (let i = 0; i < years.length - 1; i++) {
      if (year >= years[i] && year <= years[i + 1]) {
        lower = years[i];
        upper = years[i + 1];
        break;
      }
    }
    
    const ratio = (year - lower) / (upper - lower);
    return m2Data[lower] + (m2Data[upper] - m2Data[lower]) * ratio;
  };

  const startAnimation = () => {
    setIsAnimating(true);
    setAnimationStep(0);
    
    const totalSteps = 12;
    const stepDuration = 1000; // 1 second per step
    
    const animateStep = (step: number) => {
      if (step <= totalSteps) {
        setAnimationStep(step);
        setTimeout(() => animateStep(step + 1), stepDuration);
      } else {
        setIsAnimating(false);
      }
    };
    
    animateStep(1);
  };

  const getCurrentValue = () => {
    if (!isAnimating) return inflationAmount;
    
    const totalSteps = 12;
    const valuePerStep = inflationResult.valueDestroyed / totalSteps;
    const currentLoss = valuePerStep * animationStep;
    
    return Math.max(inflationAmount - currentLoss, inflationResult.purchasingPower);
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
                Every day you wait, your savings lose value. It's not your fault—the system is rigged. 
                The government prints money endlessly, making each dollar worth less while the wealthy protect 
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
                the solution to making each dollar worth less.
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
                <div className="text-zinc-300 text-sm">Your Financial Control</div>
                <div className="text-zinc-400 text-xs mt-1">No banks, no intermediaries</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Inflation Calculator */}
      <Card className="bg-zinc-900/50 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-red-500" />
            Watch Your Money Disappear
          </CardTitle>
          <p className="text-zinc-400">See how inflation silently steals your purchasing power</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Amount Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-300">Your Savings Amount</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[1000, 5000, 10000, 25000, 50000, 100000].map((amount) => (
                <Button
                  key={amount}
                  variant={inflationAmount === amount ? "secondary" : "outline"}
                  onClick={() => setInflationAmount(amount)}
                  className="h-12 text-sm font-medium"
                >
                  ${amount.toLocaleString()}
                </Button>
              ))}
            </div>
          </div>

          {/* Inflation Rate Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-300">Inflation Scenario</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { rate: 2, label: "Fed Target", desc: "Official 2% goal", color: "zinc" },
                { rate: 4, label: "Moderate Rise", desc: "Economic uncertainty", color: "yellow" },
                { rate: 8.5, label: "Recent Peak", desc: "2022 inflation high", color: "orange" },
                { rate: 15, label: "Crisis Level", desc: "1980s-style crisis", color: "red" }
              ].map((scenario) => (
                <Button
                  key={scenario.rate}
                  variant={inflationRate === scenario.rate ? "secondary" : "outline"}
                  onClick={() => setInflationRate(scenario.rate)}
                  className={`h-16 flex flex-col p-3 text-left ${
                    inflationRate === scenario.rate 
                      ? `bg-${scenario.color}-900/50 border-${scenario.color}-600` 
                      : `border-${scenario.color}-800/50 hover:bg-${scenario.color}-900/20`
                  }`}
                >
                  <div className="font-medium text-sm">{scenario.label}</div>
                  <div className="text-xs opacity-75">{scenario.desc}</div>
                  <div className="font-bold text-orange-400">{scenario.rate}%</div>
                </Button>
              ))}
            </div>
          </div>

          {/* Time Frame */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-300">Time Period (years)</label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 20, 30].map((years) => (
                <Button
                  key={years}
                  variant={inflationTimeFrame === years ? "secondary" : "outline"}
                  onClick={() => setInflationTimeFrame(years)}
                  className="h-12"
                >
                  {years} years
                </Button>
              ))}
            </div>
          </div>

          {/* Animation and Results */}
          <div className="bg-zinc-800/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-white">
                  ${getCurrentValue().toLocaleString()}
                </div>
                <div className="text-sm text-zinc-400">Current Purchasing Power</div>
              </div>
              
              <div className="text-right space-y-1">
                <div className="text-lg font-bold text-red-400">
                  -${inflationResult.valueDestroyed.toLocaleString()}
                </div>
                <div className="text-sm text-zinc-400">Value Destroyed</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-zinc-400">
                <span>Purchasing Power</span>
                <span>{Math.round((inflationResult.purchasingPower / inflationAmount) * 100)}% remaining</span>
              </div>
              <Progress 
                value={isAnimating 
                  ? Math.max((getCurrentValue() / inflationAmount) * 100, (inflationResult.purchasingPower / inflationAmount) * 100)
                  : (inflationResult.purchasingPower / inflationAmount) * 100
                }
                className="h-3"
              />
            </div>

            <Button 
              onClick={startAnimation}
              disabled={isAnimating}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {isAnimating ? "Watching Money Disappear..." : "Watch Your Money Disappear"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Historical Money Supply Chart */}
      <Card className="bg-zinc-900/50 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-orange-500" />
            The Money Printing Machine
          </CardTitle>
          <p className="text-zinc-400">100+ years of endless dollar creation</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Year Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-300">Select Historical Period</label>
            <div className="grid grid-cols-5 gap-2">
              {[1920, 1971, 2000, 2008, 2024].map((year) => (
                <Button
                  key={year}
                  variant={moneySupplyYear === year ? "secondary" : "outline"}
                  onClick={() => setMoneySupplyYear(year)}
                  className="h-12 text-sm font-medium"
                >
                  {year}
                </Button>
              ))}
            </div>
          </div>

          {/* Key Statistics Display */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-orange-400 transition-all duration-700">
                ${getMoneySupplyRaw(moneySupplyYear)}T
              </div>
              <div className="text-zinc-400 text-xs">Total Dollars in Circulation</div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-orange-400 transition-all duration-700">
                {Math.round(getMoneySupplyRaw(moneySupplyYear) / getMoneySupplyRaw(1920))}x
              </div>
              <div className="text-zinc-400 text-xs">More Money Since 1920</div>
            </div>
          </div>

          {/* Simplified Chart */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              Total Supply of Dollars
            </h4>
            <div className="bg-zinc-800/50 rounded-lg p-6">
              <div className="relative h-56 w-full">
                {/* Clean SVG Chart */}
                <svg viewBox="0 0 400 220" className="w-full h-full">
                  {/* Simple background */}
                  <rect width="400" height="220" fill="transparent" />
                  
                  {/* Y-axis labels */}
                  <text x="10" y="15" fill="#9ca3af" fontSize="10">$21.2T</text>
                  <text x="10" y="55" fill="#9ca3af" fontSize="10">$15T</text>
                  <text x="10" y="95" fill="#9ca3af" fontSize="10">$10T</text>
                  <text x="10" y="135" fill="#9ca3af" fontSize="10">$5T</text>
                  <text x="10" y="175" fill="#9ca3af" fontSize="10">$0</text>
                  
                  {/* X-axis labels */}
                  <text x="50" y="205" fill="#9ca3af" fontSize="10" textAnchor="middle">1920</text>
                  <text x="140" y="205" fill="#9ca3af" fontSize="10" textAnchor="middle">1960</text>
                  <text x="230" y="205" fill="#9ca3af" fontSize="10" textAnchor="middle">1990</text>
                  <text x="320" y="205" fill="#9ca3af" fontSize="10" textAnchor="middle">2010</text>
                  <text x="370" y="205" fill="#9ca3af" fontSize="10" textAnchor="middle">2025</text>
                  
                  {/* Money Supply Growth Line */}
                  <path
                    d={(() => {
                      const m2Data = [
                        { year: 1920, m2: 0.023 }, { year: 1929, m2: 0.026 }, { year: 1933, m2: 0.020 },
                        { year: 1940, m2: 0.040 }, { year: 1945, m2: 0.107 }, { year: 1950, m2: 0.117 },
                        { year: 1960, m2: 0.167 }, { year: 1971, m2: 0.583 }, { year: 1980, m2: 1.600 },
                        { year: 1990, m2: 3.200 }, { year: 2000, m2: 4.900 }, { year: 2008, m2: 7.500 },
                        { year: 2010, m2: 8.700 }, { year: 2015, m2: 12.400 }, { year: 2020, m2: 15.400 },
                        { year: 2021, m2: 20.100 }, { year: 2024, m2: 21.000 }, { year: 2025, m2: 21.200 }
                      ];
                      
                      return m2Data.map((point, index) => {
                        const x = 50 + ((point.year - 1920) / 105) * 320;
                        const y = 175 - ((point.m2 - 0.023) / (21.2 - 0.023)) * 155;
                        return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                      }).join(' ');
                    })()}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="3"
                  />
                  
                  {/* Gold Standard End Marker */}
                  <line x1="190" y1="20" x2="190" y2="185" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4,4" />
                  <rect x="120" y="30" width="100" height="30" fill="#1e293b" stroke="#fbbf24" strokeWidth="1" rx="4" />
                  <text x="170" y="42" fill="#fbbf24" fontSize="9" textAnchor="middle" fontWeight="bold">Gold Standard</text>
                  <text x="170" y="52" fill="#9ca3af" fontSize="8" textAnchor="middle">Ends (1971)</text>
                </svg>
              </div>
              
              <div className="mt-4 text-center">
                <div className="text-orange-400 font-bold text-lg">THIS is INFLATION</div>
                <div className="text-zinc-400 text-sm">More money = less value per dollar</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-br from-orange-950/50 via-zinc-900 to-orange-950/30 border-orange-700/50">
        <CardContent className="p-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h3 className="text-3xl font-bold text-white">
              Stop Being a Victim of the System
            </h3>
            
            <p className="text-lg text-zinc-300 leading-relaxed">
              Every day you keep your wealth in depreciating dollars, you're voluntarily participating in your own 
              financial destruction. The wealthy understand this—that's why they hold assets, not cash.
            </p>
            
            <p className="text-lg text-zinc-300 leading-relaxed">
              Bitcoin gives you the same protection they have, but better. No storage costs, no maintenance, 
              no counterparty risk. Just mathematically guaranteed scarcity in your pocket.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg"
                onClick={() => setActiveSection("learn")}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-medium h-auto"
              >
                Learn How Bitcoin Works
              </Button>
              <Button 
                size="lg"
                onClick={() => setActiveSection("simulations")}
                variant="outline"
                className="border-orange-600 text-orange-400 hover:bg-orange-600/20 px-8 py-4 text-lg font-medium h-auto"
              >
                Practice with Simulators
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}