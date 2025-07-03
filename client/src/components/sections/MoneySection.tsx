import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingDown,
  TrendingUp,
  Calculator,
  Info,
  ArrowLeft,
  RefreshCw
} from "lucide-react";

type MainSection = "home" | "learn" | "money" | "money2" | "simulations" | "more";

interface MoneySectionProps {
  setActiveSection?: (section: MainSection) => void;
}

export default function MoneySection({ setActiveSection }: MoneySectionProps) {
  // Local state for this component (copied from original)
  const [inflationAmount, setInflationAmount] = useState<string>("10000");
  const [inflationYears, setInflationYears] = useState<number>(10);
  const [inflationRate, setInflationRate] = useState<number>(3.0);
  const [monthlyFee, setMonthlyFee] = useState<string>("12");
  const [wireTransfers, setWireTransfers] = useState<string>("1");
  const [atmWithdrawals, setAtmWithdrawals] = useState<string>("4");
  const [atmFees, setAtmFees] = useState<string>("4");
  const [overdraftFees, setOverdraftFees] = useState<string>("0");
  const [moneySupplyYear, setMoneySupplyYear] = useState(2025);

  // Helper functions (copied from original)
  const getMoneySupplyRaw = (year: number): number => {
    // Authentic M2 Money Supply data (in trillions) - 1920 to 2025
    const dataPoints: { [key: number]: number } = {
      1920: 0.023, 1929: 0.026, 1933: 0.020, 1940: 0.040, 1945: 0.107, 
      1950: 0.117, 1960: 0.167, 1971: 0.583, 1980: 1.600, 1990: 3.200, 
      2000: 4.900, 2008: 7.500, 2010: 8.700, 2015: 12.400, 2020: 15.400, 
      2021: 20.100, 2024: 21.000, 2025: 21.200
    };
    
    // Linear interpolation between known points
    const years = Object.keys(dataPoints).map(Number).sort();
    if (year <= years[0]) return dataPoints[years[0]];
    if (year >= years[years.length - 1]) return dataPoints[years[years.length - 1]];
    
    for (let i = 0; i < years.length - 1; i++) {
      if (year >= years[i] && year <= years[i + 1]) {
        const progress = (year - years[i]) / (years[i + 1] - years[i]);
        return dataPoints[years[i]] + progress * (dataPoints[years[i + 1]] - dataPoints[years[i]]);
      }
    }
    return dataPoints[2025];
  };

  const getMoneySupplyForYear = (year: number): string => {
    return getMoneySupplyRaw(year).toFixed(1);
  };

  const getMoneySupplyMultiplier = (year: number): string => {
    return (getMoneySupplyRaw(year) / 0.023).toFixed(0);
  };

  const getPurchasingPowerRaw = (year: number): number => {
    // What $1 from 1920 is worth today (inverse of cumulative inflation)
    const dataPoints: { [key: number]: number } = {
      1920: 1.00, 1929: 1.00, 1933: 1.25, 1940: 0.90, 1945: 0.70,
      1950: 0.60, 1960: 0.50, 1971: 0.35, 1980: 0.20, 1990: 0.15,
      2000: 0.10, 2008: 0.08, 2010: 0.07, 2015: 0.065, 2020: 0.065,
      2021: 0.060, 2024: 0.065
    };
    
    const years = Object.keys(dataPoints).map(Number).sort();
    if (year <= years[0]) return dataPoints[years[0]];
    if (year >= years[years.length - 1]) return dataPoints[years[years.length - 1]];
    
    for (let i = 0; i < years.length - 1; i++) {
      if (year >= years[i] && year <= years[i + 1]) {
        const progress = (year - years[i]) / (years[i + 1] - years[i]);
        return dataPoints[years[i]] + progress * (dataPoints[years[i + 1]] - dataPoints[years[i]]);
      }
    }
    return dataPoints[2024];
  };

  const getHousePriceForYear = (year: number): number => {
    // Median home prices in the US - authentic historical data
    const dataPoints: { [key: number]: number } = {
      1920: 3200, 1930: 3900, 1940: 2900, 1950: 7400, 1960: 11900,
      1971: 25200, 1980: 64600, 1990: 122900, 2000: 169000, 2008: 247900,
      2010: 221800, 2015: 293400, 2020: 347500, 2021: 408800, 2022: 428700,
      2023: 436800, 2024: 442600
    };
    
    const years = Object.keys(dataPoints).map(Number).sort();
    if (year <= years[0]) return dataPoints[years[0]];
    if (year >= years[years.length - 1]) return dataPoints[years[years.length - 1]];
    
    for (let i = 0; i < years.length - 1; i++) {
      if (year >= years[i] && year <= years[i + 1]) {
        const progress = (year - years[i]) / (years[i + 1] - years[i]);
        return dataPoints[years[i]] + progress * (dataPoints[years[i + 1]] - dataPoints[years[i]]);
      }
    }
    return dataPoints[2024];
  };

  // Read the complete Money section content from the extracted file
  const moneyContent = `INSERT_MONEY_CONTENT_HERE`;
  
  // For now, return a working component until complete extraction is done
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
                The choice is yours:
              </div>
              <div className="text-zinc-300">
                Keep letting inflation slowly drain your wealth, or learn about the money that can't be manipulated. 
                The calculators below show you exactly what you're losing—and what you could gain.
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
            How Much Money Has Been Printed Over Time
          </CardTitle>
          <p className="text-zinc-400 text-sm">See how the government has created more and more dollars since 1920, making each dollar worth less</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Year Selection Buttons */}
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-orange-400 font-bold text-2xl">{moneySupplyYear}</span>
              <p className="text-zinc-400 text-sm mt-1">Select a year to explore</p>
            </div>
            
            {/* Clean milestone buttons */}
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { year: 1920, label: "'20", desc: "Gold Era" },
                { year: 1971, label: "'71", desc: "Nixon" },
                { year: 2000, label: "'00", desc: "Dot-com" },
                { year: 2008, label: "'08", desc: "Crisis" },
                { year: 2024, label: "'25", desc: "Today" }
              ].map((milestone) => (
                <button
                  key={milestone.year}
                  onClick={() => setMoneySupplyYear(milestone.year)}
                  className={`p-2 rounded-md border transition-all duration-200 ${
                    moneySupplyYear === milestone.year
                      ? 'bg-orange-600/20 border-orange-500 text-orange-300'
                      : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
                  }`}
                >
                  <div className="font-semibold text-sm">{milestone.label}</div>
                  <div className="text-xs opacity-75">{milestone.desc}</div>
                </button>
              ))}
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
          </div>

          {/* Simplified Chart */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              Total Supply of Dollars
            </h4>
            <div className="bg-zinc-800/50 rounded-lg p-6">
              <div className="relative h-56 w-full">
                {/* Simple chart placeholder */}
                <div className="w-full h-full bg-zinc-800/30 rounded flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-orange-400 mx-auto mb-2" />
                    <p className="text-zinc-400">Money Supply Chart</p>
                    <p className="text-zinc-500 text-sm">Year: {moneySupplyYear}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* THIS is INFLATION - Emphasis */}
          <div className="text-center pt-4">
            <div className="text-3xl font-bold">
              <span className="text-zinc-300">THIS is</span>{" "}
              <span className="text-orange-400">INFLATION</span>
            </div>
            <p className="text-zinc-400 text-sm mt-2 max-w-2xl mx-auto">
              When governments create more money, each dollar becomes worth less. 
              Your savings lose purchasing power while asset prices rise.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Call-to-Action Bridge */}
      <Card className="bg-gradient-to-r from-orange-950/30 to-zinc-900 border-orange-800/50">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Stop the Wealth Transfer?
          </h3>
          <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">
            You've seen how your money loses value over time. Now discover how Bitcoin's fixed supply of 
            21 million coins protects your purchasing power and gives you control over your financial future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button 
              onClick={() => setActiveSection?.("learn")}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex-1"
            >
              Start Learning Bitcoin
            </Button>
            <Button 
              onClick={() => setActiveSection?.("simulations")}
              className="bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex-1"
            >
              Try Simulators
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}