import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Clock, Building, Shield, Globe } from 'lucide-react';

export const WhyBTCSection: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Money Supply Data
  const moneySupplyData = {
    1920: { amount: 27, multiplier: 1 },
    1971: { amount: 630, multiplier: 23 },
    2000: { amount: 4900, multiplier: 181 },
    2008: { amount: 8200, multiplier: 304 },
    2024: { amount: 21000, multiplier: 777 }
  };

  // Purchasing Power Animation
  const startPurchasingPowerAnimation = () => {
    setIsAnimating(true);
    setAnimationStep(0);
    
    const steps = [
      { year: 1971, power: 100, message: "Your $100 has full purchasing power" },
      { year: 1980, power: 55, message: "Inflation cuts your money's value in half" },
      { year: 1990, power: 35, message: "Two decades of steady decline" },
      { year: 2000, power: 25, message: "The dollar keeps weakening" },
      { year: 2010, power: 18, message: "Financial crisis accelerates decline" },
      { year: 2020, power: 15, message: "Money printing reaches extreme levels" },
      { year: 2024, power: 13, message: "Your original $100 now buys what $13 bought in 1971" }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setAnimationStep(currentStep);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => setIsAnimating(false), 2000);
      }
    }, 1500);
  };

  const animationData = [
    { year: 1971, power: 100, message: "Your $100 has full purchasing power" },
    { year: 1980, power: 55, message: "Inflation cuts your money's value in half" },
    { year: 1990, power: 35, message: "Two decades of steady decline" },
    { year: 2000, power: 25, message: "The dollar keeps weakening" },
    { year: 2010, power: 18, message: "Financial crisis accelerates decline" },
    { year: 2020, power: 15, message: "Money printing reaches extreme levels" },
    { year: 2024, power: 13, message: "Your original $100 now buys what $13 bought in 1971" }
  ];

  const currentAnimation = animationData[animationStep] || animationData[0];

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-orange-400 mb-2">Why Bitcoin Matters</h1>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
            Your money is being silently stolen through inflation. Bitcoin offers a way out.
          </p>
        </div>

        {/* Opening Facts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">21M</div>
              <p className="text-zinc-300">Bitcoin's Maximum Supply</p>
              <p className="text-sm text-zinc-400 mt-2">Forever. No exceptions.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">0%</div>
              <p className="text-zinc-300">Bitcoin Inflation Rate</p>
              <p className="text-sm text-zinc-400 mt-2">After 2140, no new Bitcoin created</p>
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">100%</div>
              <p className="text-zinc-300">Your Bitcoin Ownership</p>
              <p className="text-sm text-zinc-400 mt-2">No bank. No government. Just you.</p>
            </CardContent>
          </Card>
        </div>

        {/* Money Supply Visualization */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Total Supply of Dollars</CardTitle>
            <p className="text-zinc-400 text-center">Watch how the money supply exploded over time</p>
          </CardHeader>
          <CardContent className="p-6">
            {/* Year Selector */}
            <div className="flex justify-center gap-2 mb-8 flex-wrap">
              {Object.keys(moneySupplyData).map((year) => (
                <Button
                  key={year}
                  onClick={() => setSelectedYear(parseInt(year))}
                  variant={selectedYear === parseInt(year) ? "default" : "outline"}
                  className={`px-4 py-2 transition-all duration-700 ${
                    selectedYear === parseInt(year) 
                      ? "bg-orange-500 hover:bg-orange-600 text-white" 
                      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-600"
                  }`}
                >
                  {year}
                </Button>
              ))}
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-zinc-900 border-zinc-600">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-2 transition-all duration-700">
                    ${moneySupplyData[selectedYear as keyof typeof moneySupplyData].amount.toLocaleString()}B
                  </div>
                  <p className="text-zinc-300">Total Dollar Supply</p>
                  <p className="text-sm text-zinc-400 mt-2">in {selectedYear}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-900 border-zinc-600">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2 transition-all duration-700">
                    {moneySupplyData[selectedYear as keyof typeof moneySupplyData].multiplier}x
                  </div>
                  <p className="text-zinc-300">Money Creation</p>
                  <p className="text-sm text-zinc-400 mt-2">since 1920</p>
                </CardContent>
              </Card>
            </div>

            {/* Chart */}
            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="h-56 relative">
                <svg viewBox="0 0 400 220" className="w-full h-full">
                  {/* Chart line */}
                  <path
                    d="M 20 200 L 80 180 L 160 120 L 240 80 L 380 20"
                    stroke="#f97316"
                    strokeWidth="3"
                    fill="none"
                    className="transition-all duration-700"
                  />
                  
                  {/* Data points */}
                  {Object.entries(moneySupplyData).map(([year, data], index) => {
                    const x = 20 + (index * 90);
                    const y = 200 - (data.amount / 21000) * 180;
                    const isSelected = selectedYear === parseInt(year);
                    
                    return (
                      <g key={year}>
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? "6" : "4"}
                          fill={isSelected ? "#f97316" : "#71717a"}
                          className="transition-all duration-700"
                        />
                        <text
                          x={x}
                          y={y - 15}
                          textAnchor="middle"
                          className={`text-xs transition-all duration-700 ${
                            isSelected ? "fill-orange-400 font-bold" : "fill-zinc-400"
                          }`}
                        >
                          {year}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Bitcoin line */}
                  <line
                    x1="20"
                    y1="200"
                    x2="380"
                    y2="200"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  <text x="200" y="215" textAnchor="middle" className="text-xs fill-blue-400">
                    Bitcoin: 21M Forever
                  </text>
                </svg>
              </div>
            </div>

            {/* Emphasis */}
            <div className="text-center mt-6 p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <p className="text-2xl font-bold text-orange-400 mb-2">THIS is INFLATION</p>
              <p className="text-zinc-300">
                When governments print more money, your savings lose purchasing power.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Purchasing Power Erosion */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Your Money is Disappearing</CardTitle>
            <p className="text-zinc-400 text-center">See how $100 from 1971 lost its value over time</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center space-y-6">
              <Button 
                onClick={startPurchasingPowerAnimation}
                disabled={isAnimating}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold"
              >
                {isAnimating ? "Watching Your Money Disappear..." : "Watch Your Money Disappear"}
              </Button>
              
              {isAnimating && (
                <div className="space-y-4">
                  <div className="text-6xl font-bold text-center transition-all duration-1000">
                    💵
                    <div 
                      className="inline-block transition-all duration-1000"
                      style={{ 
                        opacity: currentAnimation.power / 100,
                        transform: `scale(${currentAnimation.power / 100})`,
                        filter: `brightness(${currentAnimation.power / 100})`
                      }}
                    >
                      $100
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400 mb-2">
                      {currentAnimation.year}
                    </div>
                    <div className="text-xl text-zinc-300 mb-2">
                      Purchasing Power: ${currentAnimation.power}
                    </div>
                    <div className="text-zinc-400 max-w-md mx-auto">
                      {currentAnimation.message}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bitcoin Solution */}
        <Card className="bg-gradient-to-br from-orange-500/10 to-zinc-800 border-orange-500/20">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-orange-400">Bitcoin: The Solution</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Fixed Supply</h3>
                <p className="text-zinc-300">
                  Bitcoin has a maximum supply of 21 million coins. No government, bank, or individual can create more.
                </p>
                
                <h3 className="text-xl font-bold text-white">Digital Scarcity</h3>
                <p className="text-zinc-300">
                  For the first time in history, we have truly scarce digital money that can't be debased.
                </p>
                
                <h3 className="text-xl font-bold text-white">Self-Custody</h3>
                <p className="text-zinc-300">
                  You control your Bitcoin directly. No bank can freeze your account or seize your funds.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Global Access</h3>
                <p className="text-zinc-300">
                  Send Bitcoin anywhere in the world, 24/7, without asking permission from any institution.
                </p>
                
                <h3 className="text-xl font-bold text-white">Transparent</h3>
                <p className="text-zinc-300">
                  Every Bitcoin transaction is recorded on a public ledger that anyone can verify.
                </p>
                
                <h3 className="text-xl font-bold text-white">Decentralized</h3>
                <p className="text-zinc-300">
                  No single point of failure. Bitcoin runs on thousands of computers worldwide.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold text-orange-400 mb-4">Ready to Learn More?</h2>
            <p className="text-xl text-zinc-300 mb-6 max-w-2xl mx-auto">
              Understanding Bitcoin starts with understanding why traditional money is broken. 
              Start your Bitcoin education journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
                onClick={() => window.location.hash = '#learn'}
              >
                Start Learning Bitcoin
              </Button>
              <Button 
                variant="outline"
                className="border-zinc-600 text-zinc-300 hover:bg-zinc-700 px-8 py-3 text-lg"
                onClick={() => window.location.hash = '#simulators'}
              >
                Try Bitcoin Simulators
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};