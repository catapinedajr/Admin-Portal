import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  AlertTriangle, 
  Shield, 
  Clock, 
  Calculator,
  Zap,
  Home,
  Coffee,
  Car,
  Crown,
  Gem,
  User as UserIcon
} from "lucide-react";
import { useAppContext } from "@/components/shared/AppContextProvider";
import { useQuery } from "@tanstack/react-query";
import PWAInstallButton from "@/components/PWAInstallButton";
import BottomNavigation from '@/components/BottomNavigation';
import EmailCollectionModal from '@/components/EmailCollectionModal';
import type { User } from '@shared/schema';

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
    setAnimationStep,
    showEmailModal,
    setShowEmailModal,
    setLocation
  } = useAppContext();

  // User data query
  const { data: user } = useQuery<User>({
    queryKey: ['/api/user'],
  });

  const isPremiumTier = false; // Simplified for now since no subscription tier in schema

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
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setLocation('/')}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-sm">
                  HL
                </div>
                <div>
                  <h1 className="text-xl font-bold">HODLearn</h1>
                  <p className="text-xs text-zinc-400">How-to-learn BTC</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <PWAInstallButton />
              
              {/* Premium Status / Upgrade Button */}
              {isPremiumTier ? (
                <div className="flex items-center gap-2 bg-orange-600/20 px-3 py-2 rounded-lg border border-orange-600/30">
                  <Crown className="w-4 h-4 text-orange-400" />
                  <span className="text-orange-300 text-sm font-medium">Premium</span>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setShowEmailModal(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white gap-2"
                >
                  <Gem className="w-4 h-4" />
                  <span className="sr-only">Upgrade to Premium</span>
                </Button>
              )}
              
              {/* User Profile */}
              <div className="flex items-center gap-2 text-zinc-400">
                <UserIcon className="w-5 h-5" />
                <span className="text-sm">{user?.username || 'User'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
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
                  
                  {/* X-axis labels - Evenly spaced per year for dramatic accuracy */}
                  <text x="50" y="205" fill="#9ca3af" fontSize="10" textAnchor="middle">1920</text>
                  <text x="140" y="205" fill="#9ca3af" fontSize="10" textAnchor="middle">1960</text>
                  <text x="230" y="205" fill="#9ca3af" fontSize="10" textAnchor="middle">1990</text>
                  <text x="320" y="205" fill="#9ca3af" fontSize="10" textAnchor="middle">2010</text>
                  <text x="370" y="205" fill="#9ca3af" fontSize="10" textAnchor="middle">2025</text>
                  
                  {/* Money Supply Growth Line - Using Real Federal Reserve Data */}
                  <path
                    d={(() => {
                      // Real M2 data points (in billions then trillions): Year -> M2 Value
                      const m2Data = [
                        { year: 1920, m2: 0.023 },   // Gold Standard era ($23B)
                        { year: 1929, m2: 0.026 },   // Pre-Depression ($26B)
                        { year: 1933, m2: 0.020 },   // Depression low ($20B)
                        { year: 1940, m2: 0.040 },   // Pre-WWII ($40B)
                        { year: 1945, m2: 0.107 },   // Post-WWII expansion ($107B)
                        { year: 1950, m2: 0.117 },   // Korean War ($117B)
                        { year: 1960, m2: 0.167 },   // 60s growth ($167B)
                        { year: 1971, m2: 0.583 },   // Nixon Shock baseline ($583B)
                        { year: 1980, m2: 1.600 },   // Early 80s ($1.6T)
                        { year: 1990, m2: 3.200 },   // 90s expansion ($3.2T)
                        { year: 2000, m2: 4.900 },   // Dot-com era ($4.9T)
                        { year: 2008, m2: 7.500 },   // Pre-crisis ($7.5T)
                        { year: 2010, m2: 8.700 },   // Post-crisis QE1 ($8.7T)
                        { year: 2015, m2: 12.400 },  // QE era ($12.4T)
                        { year: 2020, m2: 15.400 },  // Pre-COVID ($15.4T)
                        { year: 2021, m2: 20.100 },  // COVID peak ($20.1T)
                        { year: 2024, m2: 21.000 },  // 2024 ($21T)
                        { year: 2025, m2: 21.200 }   // Current estimate ($21.2T)
                      ];
                      
                      return m2Data.map((point, index) => {
                        // Linear time positioning: 3.048px per year (320px / 105 years)
                        const x = 50 + ((point.year - 1920) / 105) * 320;
                        const y = 175 - ((point.m2 - 0.023) / (21.2 - 0.023)) * 155;
                        return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                      }).join(' ');
                    })()}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="3"
                  />
                  
                  {/* Fill area under curve */}
                  <path
                    d={(() => {
                      const m2Data = [
                        { year: 1920, m2: 0.023 }, { year: 1929, m2: 0.026 }, { year: 1933, m2: 0.020 },
                        { year: 1940, m2: 0.040 }, { year: 1945, m2: 0.107 }, { year: 1950, m2: 0.117 },
                        { year: 1960, m2: 0.167 }, { year: 1971, m2: 0.583 }, { year: 1980, m2: 1.600 },
                        { year: 1990, m2: 3.200 }, { year: 2000, m2: 4.900 }, { year: 2008, m2: 7.500 },
                        { year: 2010, m2: 8.700 }, { year: 2015, m2: 12.400 }, { year: 2020, m2: 15.400 },
                        { year: 2021, m2: 20.100 }, { year: 2024, m2: 21.000 }
                      ];
                      
                      const pathData = m2Data.map((point, index) => {
                        // Linear time positioning: 3.077px per year (320px / 104 years)
                        const x = 50 + ((point.year - 1920) / 104) * 320;
                        const y = 175 - ((point.m2 - 0.023) / (21.0 - 0.023)) * 155;
                        return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                      }).join(' ');
                      
                      return `${pathData} L 370,180 L 50,180 Z`;
                    })()}
                    fill="url(#orangeGradient)"
                    opacity="0.3"
                  />
                  
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.6"/>
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0.1"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Gold Standard Line */}
                  <g>
                    {(() => {
                      const nixonYear = 1971;
                      const nixonX = 50 + ((nixonYear - 1920) / 105) * 320;
                      return (
                        <g>
                          <line 
                            x1={nixonX} 
                            y1="20" 
                            x2={nixonX} 
                            y2="175" 
                            stroke="#f97316" 
                            strokeWidth="2" 
                            strokeDasharray="5,5"
                            opacity="0.6"
                          />
                          <text 
                            x={nixonX - 35} 
                            y="15" 
                            fill="#f97316" 
                            fontSize="8" 
                            fontWeight="bold"
                          >
                            Gold Standard Ends
                          </text>
                        </g>
                      );
                    })()}
                  </g>

                  {/* Current year indicator */}
                  <g>
                    <line 
                      x1={50 + ((moneySupplyYear - 1920) / 105) * 320} 
                      y1="10" 
                      x2={50 + ((moneySupplyYear - 1920) / 105) * 320} 
                      y2="180" 
                      stroke="#f97316" 
                      strokeWidth="2" 
                      strokeDasharray="4,4"
                    />
                    <circle 
                      cx={50 + ((moneySupplyYear - 1920) / (2025 - 1920)) * 320} 
                      cy={(() => {
                        // Get the actual M2 value for the selected year
                        const currentM2 = getMoneySupplyRaw(moneySupplyYear);
                        
                        // Convert to Y coordinate using same formula as line chart (1920-2024 range)
                        return 175 - ((currentM2 - 0.023) / (21.0 - 0.023)) * 155;
                      })()} 
                      r="5" 
                      fill="#f97316" 
                      stroke="#ffffff" 
                      strokeWidth="2"
                    />
                  </g>
                </svg>
              </div>
              
              {/* Emphasis Text */}
              <div className="text-center mt-4 p-4 bg-zinc-800/30 rounded-lg border border-orange-400/20">
                <div className="text-2xl font-bold">
                  <span className="text-zinc-300">THIS is </span>
                  <span className="text-orange-400 tracking-wider">INFLATION</span>
                </div>
                <p className="text-zinc-400 text-sm mt-2">
                  More dollars in circulation = each dollar is worth less
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeSection={activeSection}
        onSectionChange={(section) => {
          let mappedSection: any;
          if (section === 'simulators') mappedSection = 'simulations';
          else mappedSection = section;
          
          setActiveSection(mappedSection);
          if (section === 'learn') setLocation('/learn');
          else if (section === 'money') setLocation('/money');
          else if (section === 'simulators') setLocation('/simulators');
          else if (section === 'more') setLocation('/more');
        }}
      />

      {/* Email Collection Modal */}
      <EmailCollectionModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        trigger="feature"
        lockedFeature="Finance Analysis"
      />
      
      {/* Bottom padding to accommodate navigation */}
      <div className="h-20"></div>
    </div>
  );
}