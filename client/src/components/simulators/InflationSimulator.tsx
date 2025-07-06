import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function InflationSimulator() {
  const [inflationAmount, setInflationAmount] = useState<string>("10000");
  const [inflationRate, setInflationRate] = useState<number>(3.0);
  const [inflationSliderYear, setInflationSliderYear] = useState<number>(0);

  return (
    <div className="space-y-6">
      {/* Main Page Title */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-xl font-bold text-white">Inflation Impact Simulator</h1>
        <p className="text-zinc-400 text-lg">Watch how inflation erodes your purchasing power over time</p>
      </div>

      {/* Streamlined Control Center */}
      <Card className="bg-zinc-900 border-zinc-800" data-inflation-simulator>
        <CardContent className="p-6">
          <div className="space-y-8">
            {/* All Controls in One Row */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Money Amount Buttons */}
              <div className="space-y-3">
                <label className="block text-white font-bold text-center">
                  Your Money: ${parseFloat(inflationAmount).toLocaleString() || '10,000'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1000, 5000, 10000, 25000, 50000, 100000].map((amount) => (
                    <Button
                      key={amount}
                      variant={inflationAmount === amount.toString() ? "default" : "outline"}
                      size="sm"
                      onClick={() => setInflationAmount(amount.toString())}
                      className={`text-xs py-2 ${
                        inflationAmount === amount.toString() 
                          ? "bg-orange-600 hover:bg-orange-700 text-white border-orange-600" 
                          : "border-zinc-700 text-zinc-300 hover:border-orange-500 hover:text-orange-300"
                      }`}
                    >
                      ${amount >= 1000 ? `${amount/1000}K` : amount}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Inflation Rate Selector Cards */}
              <div className="space-y-3">
                <label className="block text-white font-bold text-center">
                  Annual Inflation Rate: {inflationRate}%
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      rate: 2,
                      title: "Fed Target",
                      description: "Government's 'ideal' inflation rate",
                      color: "blue",
                      period: "Policy Goal"
                    },
                    {
                      rate: 4,
                      title: "Moderate Rise",
                      description: "Economic heating up phase",
                      color: "yellow",
                      period: "Growth Period"
                    },
                    {
                      rate: 8.5,
                      title: "Recent Peak",
                      description: "COVID money printing aftermath",
                      color: "orange",
                      period: "2022-2024"
                    },
                    {
                      rate: 15,
                      title: "Crisis Level",
                      description: "Economic emergency territory",
                      color: "red",
                      period: "1970s-1980s"
                    }
                  ].map((scenario) => (
                    <div
                      key={scenario.rate}
                      onClick={() => setInflationRate(scenario.rate)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        inflationRate === scenario.rate
                          ? `border-orange-500 bg-orange-600/20 shadow-lg shadow-orange-500/20`
                          : `border-zinc-700 bg-zinc-800/50 hover:border-orange-400 hover:bg-orange-600/10`
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold text-lg ${
                          scenario.color === 'blue' ? 'text-blue-400' :
                          scenario.color === 'yellow' ? 'text-yellow-400' :
                          scenario.color === 'orange' ? 'text-orange-400' :
                          'text-red-400'
                        }`}>
                          {scenario.rate}%
                        </span>
                        <span className="text-xs text-zinc-400">{scenario.period}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-white text-sm font-medium">{scenario.title}</p>
                        <p className="text-zinc-400 text-xs leading-tight">{scenario.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Time Travel Slider - Main Interactive Element */}
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h4 className="text-xl font-bold text-white">
                  ⏰ Time Travel: Year {inflationSliderYear}
                  {inflationSliderYear === 0 ? " (Today)" : ` (${inflationSliderYear} years from now)`}
                </h4>
                <p className="text-zinc-400 text-sm">
                  Drag the slider to watch inflation destroy your purchasing power
                </p>
              </div>
              
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={inflationSliderYear}
                  onChange={(e) => setInflationSliderYear(parseInt(e.target.value))}
                  className="w-full h-6 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, 
                      #f97316 0%, 
                      #ea580c ${(inflationSliderYear / 30) * 100}%, 
                      #374151 ${(inflationSliderYear / 30) * 100}%, 
                      #374151 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>🟢 Today</span>
                  <span>🟠 15 Years</span>
                  <span>🔴 30 Years</span>
                </div>
              </div>
            </div>

            {/* Dynamic Visual Impact Display */}
            <div className="bg-zinc-800/50 rounded-lg p-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Animated Money Visualization */}
                <div className="text-center space-y-4">
                  {(() => {
                    const currentAmount = parseFloat(inflationAmount) || 10000;
                    const futureValue = currentAmount / Math.pow(1 + inflationRate / 100, inflationSliderYear);
                    const fadeOpacity = Math.max(0.1, futureValue / currentAmount);
                    const remainingPercentage = (futureValue / currentAmount) * 100;
                    
                    return (
                      <>
                        {/* Dollar Bill with Fade and Scale Effect */}
                        <div 
                          className="inline-block transition-all duration-700 ease-out transform"
                          style={{ 
                            opacity: fadeOpacity,
                            transform: `scale(${0.5 + fadeOpacity * 0.5}) rotate(${(1 - fadeOpacity) * 15}deg)`
                          }}
                        >
                          <svg width="200" height="80" className="drop-shadow-lg">
                            <rect x="5" y="5" width="190" height="70" 
                                  fill="#1f2937" stroke="#22c55e" strokeWidth="2" rx="6"/>
                            <text x="100" y="50" textAnchor="middle" 
                                  fill="#22c55e" fontSize="28" fontWeight="bold">$</text>
                            <text x="100" y="20" textAnchor="middle" 
                                  fill="#22c55e" fontSize="6">FEDERAL RESERVE</text>
                            <text x="100" y="70" textAnchor="middle" 
                                  fill="#22c55e" fontSize="6">UNITED STATES</text>
                          </svg>
                        </div>
                        
                        {/* Purchasing Power Display */}
                        <div className="space-y-2">
                          <div className="text-3xl font-bold">
                            <span className={remainingPercentage > 50 ? "text-green-400" : 
                                           remainingPercentage > 25 ? "text-orange-400" : "text-red-400"}>
                              ${futureValue.toLocaleString('en-US', {maximumFractionDigits: 0})}
                            </span>
                          </div>
                          <div className="text-sm text-zinc-300">
                            {remainingPercentage.toFixed(1)}% purchasing power remaining
                          </div>
                          <div className="text-xs font-semibold">
                            <span className={remainingPercentage > 80 ? "text-green-400" : 
                                           remainingPercentage > 60 ? "text-yellow-400" :
                                           remainingPercentage > 40 ? "text-orange-400" :
                                           remainingPercentage > 20 ? "text-red-400" : "text-red-500"}>
                              {inflationSliderYear === 0 ? "💪 Full Strength" : 
                               remainingPercentage > 80 ? "💚 Still Strong" :
                               remainingPercentage > 60 ? "⚠️ Weakening" :
                               remainingPercentage > 40 ? "📉 Major Loss" :
                               remainingPercentage > 20 ? "💸 Severely Damaged" :
                               "💀 Nearly Worthless"}
                            </span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Real-World Price Impact */}
                <div className="space-y-3">
                  <h5 className="text-white font-bold text-center mb-4">
                    What You Can Actually Buy
                  </h5>
                  {(() => {
                    const currentAmount = parseFloat(inflationAmount) || 10000;
                    const futureValue = currentAmount / Math.pow(1 + inflationRate / 100, inflationSliderYear);
                    
                    const examples = [
                      { icon: "🏠", item: "Rent", price: 2000, unit: "/mo" },
                      { icon: "🥛", item: "Milk", price: 4.50, unit: "/gal" },
                      { icon: "🥚", item: "Eggs", price: 3.50, unit: "/doz" },
                      { icon: "⛽", item: "Gas", price: 3.50, unit: "/gal" }
                    ];
                    
                    return examples.map((example, i) => {
                      const todayQuantity = Math.floor(currentAmount / example.price);
                      const futureQuantity = Math.floor(futureValue / example.price);
                      const lost = todayQuantity - futureQuantity;
                      
                      return (
                        <div key={i} className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg transition-all duration-500">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{example.icon}</span>
                            <span className="text-zinc-300 text-sm font-medium">{example.item}</span>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="text-sm font-bold">
                              <span className={inflationSliderYear === 0 ? "text-green-400" : "text-orange-400"}>
                                {(inflationSliderYear === 0 ? todayQuantity : futureQuantity).toLocaleString()}
                              </span>
                              <span className="text-zinc-500 text-xs ml-1">{example.unit}</span>
                            </div>
                            {inflationSliderYear > 0 && lost > 0 && (
                              <div className="text-xs text-red-400 font-medium">
                                -{lost.toLocaleString()} lost
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simplified Historical Context Chart */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <h4 className="text-lg font-bold text-white mb-4 text-center">
            Real History: How $10,000 Lost 87% of Its Power (1970-2025)
          </h4>
          
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="relative h-48 w-full">
              <svg viewBox="0 0 400 160" className="w-full h-full">
                {/* Simple Grid */}
                <defs>
                  <pattern id="simpleGrid" width="50" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
                  </pattern>
                </defs>
                <rect width="400" height="160" fill="url(#simpleGrid)" />
                
                {/* Y-axis */}
                <text x="15" y="15" fill="#9ca3af" fontSize="9">$10K</text>
                <text x="15" y="85" fill="#9ca3af" fontSize="9">$5K</text>
                <text x="15" y="155" fill="#9ca3af" fontSize="9">$0</text>
                
                {/* X-axis */}
                <text x="60" y="155" fill="#9ca3af" fontSize="9">1970</text>
                <text x="170" y="155" fill="#9ca3af" fontSize="9">1990</text>
                <text x="280" y="155" fill="#9ca3af" fontSize="9">2010</text>
                <text x="360" y="155" fill="#9ca3af" fontSize="9">2025</text>
                
                {/* Simplified Decline Line */}
                <path
                  d="M 60,20 L 120,35 L 170,70 L 220,85 L 280,105 L 340,125 L 380,140"
                  stroke="#ef4444"
                  strokeWidth="4"
                  fill="none"
                  className="drop-shadow-sm"
                />
                
                {/* Key Events - Simplified with animations */}
                <circle cx="65" cy="25" r="4" fill="#f97316" className="animate-pulse"/>
                <text x="70" y="15" fill="#f97316" fontSize="8" fontWeight="bold">Nixon</text>
                
                <circle cx="175" cy="70" r="4" fill="#ef4444" className="animate-pulse"/>
                <text x="180" y="60" fill="#ef4444" fontSize="8" fontWeight="bold">80s Crisis</text>
                
                <circle cx="285" cy="105" r="4" fill="#dc2626" className="animate-pulse"/>
                <text x="290" y="95" fill="#dc2626" fontSize="8" fontWeight="bold">2008 QE</text>
                
                <circle cx="375" cy="135" r="4" fill="#991b1b" className="animate-pulse"/>
                <text x="320" y="125" fill="#991b1b" fontSize="8" fontWeight="bold">COVID Print</text>
              </svg>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-zinc-400 text-sm">
                <span className="text-orange-400 font-bold">87% purchasing power lost</span> through monetary debasement
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}