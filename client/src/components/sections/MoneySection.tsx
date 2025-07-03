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

interface MoneySectionProps {
  setActiveSection?: (section: string) => void;
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

      {/* Placeholder for complete Money section - Working on 945-line extraction */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-orange-400">Complete Money Section Extraction In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-zinc-300">
              The Money section is being extracted from home-new.tsx to this component.
              This will reduce the main file from 527KB to under 500KB for deployment.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-zinc-400 text-sm">Extracting 945 lines of Money section content...</span>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <p className="text-orange-300 font-semibold mb-2">Progress:</p>
              <p className="text-zinc-400 text-sm">✅ Routing fixed - Money 2 navigation working</p>
              <p className="text-zinc-400 text-sm">✅ Component structure ready</p>
              <p className="text-zinc-400 text-sm">✅ Helper functions extracted</p>
              <p className="text-zinc-400 text-sm">🔄 Content extraction in progress</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}