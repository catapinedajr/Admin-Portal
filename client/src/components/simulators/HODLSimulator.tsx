import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Clock, DollarSign, Calendar, Target, TrendingDown, Star, ChevronDown } from 'lucide-react';

interface HodlInputs {
  initialAmount: number;
  years: number;
  startPrice: number;
  endPrice: number;
  scenario?: string;
  title?: string;
  period?: string;
  description?: string;
}

interface HodlResults {
  initialInvestment: number;
  bitcoinAmount: number;
  startPrice: number;
  endPrice: number;
  currentValue: number;
  totalGain: number;
  percentageReturn: number;
  annualReturn: number;
}

const HODLSimulator: React.FC = () => {
  const [hodlInputs, setHodlInputs] = useState<HodlInputs>({
    initialAmount: 10000,
    years: 4,
    startPrice: 30000,
    endPrice: 95000,
    scenario: '',
    title: '',
    period: '',
    description: ''
  });
  
  const [hodlResults, setHodlResults] = useState<HodlResults | null>(null);

  const calculateHodlStrategy = () => {
    const bitcoinAmount = hodlInputs.initialAmount / hodlInputs.startPrice;
    const currentValue = bitcoinAmount * hodlInputs.endPrice;
    const totalGain = currentValue - hodlInputs.initialAmount;
    const percentageReturn = (totalGain / hodlInputs.initialAmount) * 100;
    const annualReturn = Math.pow(hodlInputs.endPrice / hodlInputs.startPrice, 1/hodlInputs.years) - 1;

    // Validate percentage calculation for accuracy
    const validatedPercentageReturn = Math.round(((hodlInputs.endPrice / hodlInputs.startPrice - 1) * 100) * 10) / 10;
    
    setHodlResults({
      initialInvestment: hodlInputs.initialAmount,
      bitcoinAmount,
      startPrice: hodlInputs.startPrice,
      endPrice: hodlInputs.endPrice,
      currentValue,
      totalGain,
      percentageReturn: validatedPercentageReturn, // Use validated calculation
      annualReturn: annualReturn * 100
    });
  };

  useEffect(() => {
    if (hodlInputs.startPrice > 0 && hodlInputs.endPrice > 0 && hodlInputs.initialAmount > 0) {
      calculateHodlStrategy();
    }
  }, [hodlInputs.startPrice, hodlInputs.endPrice, hodlInputs.initialAmount, hodlInputs.years]);

  return (
    <div className="space-y-6">
      {/* Why HODL Strategy Matters */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
            <h4 className="text-xl font-bold text-white">The Power of Time in Market vs Timing the Market</h4>
          </div>
          
          <div className="space-y-4">
            <p className="text-zinc-300 leading-relaxed">
              Bitcoin's price swings can be extreme - dropping 80% in bear markets and rising 2000% in bull markets. 
              Most people try to time these movements perfectly, but history shows that simply holding through all 
              volatility (HODLing) often produces superior results with less stress and risk.
            </p>
            
            <div className="bg-zinc-800/50 rounded-lg p-4 border-l-4 border-orange-500">
              <p className="text-zinc-300 text-sm">
                <span className="font-semibold text-orange-300">Historical Truth:</span> Even if you bought Bitcoin 
                at the absolute peak of 2017 ($19,783), you would still be profitable today. Meanwhile, traders 
                trying to time the market often buy high, sell low, and miss the biggest gains.
              </p>
            </div>
            
            <div className="space-y-3">
              <h5 className="font-semibold text-white">Real Historical Scenarios You'll Test:</h5>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="font-medium text-white text-sm">COVID Crash</p>
                    <p className="text-zinc-400 text-xs">March 2020 panic buying opportunity</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="font-medium text-white text-sm">Bear Market</p>
                    <p className="text-zinc-400 text-xs">2018-2021 patience test period</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <Star className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="font-medium text-white text-sm">Early Adopter</p>
                    <p className="text-zinc-400 text-xs">2017-2025 ultimate diamond hands</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center pt-2">
              <Button
                onClick={() => {
                  const calculator = document.querySelector('[data-hodl-calculator]');
                  if (calculator) {
                    const rect = calculator.getBoundingClientRect();
                    const headerHeight = 80;
                    window.scrollTo({
                      top: window.pageYOffset + rect.top - headerHeight,
                      behavior: 'smooth'
                    });
                  }
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
              >
                <ChevronDown className="w-4 h-4 mr-2" />
                Test HODL Scenarios
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* HODL Calculator Section */}
      <Card className="bg-zinc-900 border-zinc-800" data-hodl-calculator>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">HODL Calculator</h3>
            <p className="text-zinc-400">See how much your Bitcoin investment would be worth today</p>
          </div>

          {/* Always-Visible Chart Section */}
          <div className="mb-6">
            <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-white font-semibold">Bitcoin Performance Chart</h4>
                <div className="text-xs text-zinc-400">Jan 2017 - Jan 2025</div>
              </div>
              <div className="relative">
                <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 bg-zinc-900/50 rounded overflow-hidden">
                <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                  {/* Grid background */}
                  <defs>
                    <pattern id="grid-hodl-chart" width="32" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 32 0 L 0 0 0 40" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-hodl-chart)" />
                  
                  {/* Static milestone reference lines - always visible */}
                  <line x1="20" y1="40" x2="350" y2="40" stroke="#dc2626" strokeWidth="1.5" opacity="0.8" strokeDasharray="3,3"/>
                  <text x="360" y="44" fill="#dc2626" fontSize="12" opacity="0.9">100x</text>
                  
                  <line x1="20" y1="70" x2="350" y2="70" stroke="#fbbf24" strokeWidth="1.5" opacity="0.8" strokeDasharray="3,3"/>
                  <text x="360" y="74" fill="#fbbf24" fontSize="12" opacity="0.9">10x</text>
                  
                  <line x1="20" y1="105" x2="350" y2="105" stroke="#10b981" strokeWidth="1.5" opacity="0.8" strokeDasharray="3,3"/>
                  <text x="360" y="109" fill="#10b981" fontSize="12" opacity="0.9">5x</text>
                  
                  <line x1="20" y1="135" x2="350" y2="135" stroke="#6366f1" strokeWidth="1.5" opacity="0.8" strokeDasharray="3,3"/>
                  <text x="360" y="139" fill="#6366f1" fontSize="12" opacity="0.9">2x</text>
                  
                  {/* Bitcoin Price Line (realistic exponential growth) */}
                  <path 
                    d="M 20 150 Q 70 145 110 140 Q 160 130 200 115 Q 250 95 300 70 Q 350 45 380 30" 
                    stroke="#f97316" 
                    strokeWidth="3" 
                    fill="none"
                    className="drop-shadow-lg"
                  />
                  
                  {/* Area fill */}
                  <path 
                    d="M 20 150 Q 70 145 110 140 Q 160 130 200 115 Q 250 95 300 70 Q 350 45 380 30 L 380 150 L 20 150 Z" 
                    fill="url(#chartGradient-hodl)"
                    opacity="0.2"
                  />
                  
                  <defs>
                    <linearGradient id="chartGradient-hodl" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.4"/>
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0.1"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Start and end markers */}
                  <circle cx="20" cy="150" r="3" fill="#10b981" stroke="#ffffff" strokeWidth="1"/>
                  <circle cx="380" cy="30" r="4" fill="#f97316" stroke="#ffffff" strokeWidth="2" className="animate-pulse"/>
                  
                  {/* Time labels */}
                  <text x="20" y="175" fill="#9ca3af" fontSize="12" textAnchor="start">2017</text>
                  <text x="200" y="175" fill="#9ca3af" fontSize="12" textAnchor="middle">2021</text>
                  <text x="380" y="175" fill="#9ca3af" fontSize="12" textAnchor="end">2025</text>
                </svg>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Investment Amount</label>
                <div className="grid grid-cols-3 gap-2">
                  {[100, 500, 1000, 5000, 10000, 25000].map((amount) => (
                    <Button
                      key={amount}
                      variant={hodlInputs.initialAmount === amount ? "default" : "outline"}
                      size="sm"
                      onClick={() => setHodlInputs(prev => ({...prev, initialAmount: amount}))}
                      className={`text-xs py-2 ${
                        hodlInputs.initialAmount === amount 
                          ? "bg-orange-600 hover:bg-orange-700 text-white border-orange-600" 
                          : "border-zinc-700 text-zinc-300 hover:border-orange-500 hover:text-orange-300"
                      }`}
                    >
                      ${amount >= 1000 ? `${amount/1000}K` : amount}
                    </Button>
                  ))}
                </div>
                <div className="text-center text-sm text-zinc-400 mt-1">
                  Selected: ${hodlInputs.initialAmount.toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Purchase Date</label>
                <Select
                  value={hodlInputs.scenario}
                  onValueChange={(value) => {
                    const scenarios: { [key: string]: { startPrice: number; endPrice: number; years: number; period: string } } = {
                      'jan2024': { startPrice: 42867, endPrice: 94200, years: 1, period: 'Jan 2024' },
                      'jan2023': { startPrice: 16625, endPrice: 94200, years: 2, period: 'Jan 2023' },
                      'jan2022': { startPrice: 46311, endPrice: 94200, years: 3, period: 'Jan 2022' },
                      'jan2021': { startPrice: 29374, endPrice: 94200, years: 4, period: 'Jan 2021' },
                      'jan2020': { startPrice: 7200, endPrice: 94200, years: 5, period: 'Jan 2020' },
                      'jan2019': { startPrice: 3784, endPrice: 94200, years: 6, period: 'Jan 2019' },
                      'jan2018': { startPrice: 13412, endPrice: 94200, years: 7, period: 'Jan 2018' },
                      'jan2017': { startPrice: 998, endPrice: 94200, years: 8, period: 'Jan 2017' },
                      'jan2016': { startPrice: 434, endPrice: 94200, years: 9, period: 'Jan 2016' },
                      'jan2015': { startPrice: 315, endPrice: 94200, years: 10, period: 'Jan 2015' }
                    };
                    
                    const scenario = scenarios[value];
                    setHodlInputs(prev => ({
                      ...prev,
                      scenario: value,
                      startPrice: scenario.startPrice,
                      endPrice: scenario.endPrice,
                      years: scenario.years,
                      period: scenario.period
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select purchase date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jan2024">Jan 2024 - $42,867</SelectItem>
                    <SelectItem value="jan2023">Jan 2023 - $16,625</SelectItem>
                    <SelectItem value="jan2022">Jan 2022 - $46,311</SelectItem>
                    <SelectItem value="jan2021">Jan 2021 - $29,374</SelectItem>
                    <SelectItem value="jan2020">Jan 2020 - $7,200</SelectItem>
                    <SelectItem value="jan2019">Jan 2019 - $3,784</SelectItem>
                    <SelectItem value="jan2018">Jan 2018 - $13,412</SelectItem>
                    <SelectItem value="jan2017">Jan 2017 - $998</SelectItem>
                    <SelectItem value="jan2016">Jan 2016 - $434</SelectItem>
                    <SelectItem value="jan2015">Jan 2015 - $315</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              {hodlResults && hodlInputs.scenario && (
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3">Your HODL Results</h4>
                  
                  {/* Portfolio Growth Chart */}
                  <div className="mb-4">
                    <div className="w-full h-32 bg-zinc-900/50 rounded overflow-hidden">
                      <svg viewBox="0 0 300 120" className="w-full h-full">
                        {/* Background grid */}
                        <defs>
                          <pattern id="portfolioGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#portfolioGrid)" />
                        
                        {/* Simple growth label for this specific result */}
                        <text 
                          x="150" 
                          y="30" 
                          fill="#f97316" 
                          fontSize="12" 
                          textAnchor="middle" 
                          fontWeight="bold"
                        >
                          {Math.round(hodlResults.currentValue / hodlResults.initialInvestment)}x Growth
                        </text>
                        
                        {/* Growth Line */}
                        {(() => {
                          const points = [];
                          const years = hodlInputs.years;
                          const startValue = hodlResults.initialInvestment;
                          const endValue = hodlResults.currentValue;
                          const steps = Math.max(20, years * 3); // More data points for smoother curves
                          
                          // Fixed scale for maximum visual impact - always show full potential
                          const maxPossibleGrowth = 100; // 10,000% growth for scale reference
                          const currentGrowthRatio = (endValue / startValue);
                          
                          for (let i = 0; i <= steps; i++) {
                            const progress = i / steps;
                            
                            // Simulate realistic Bitcoin growth with dramatic volatility
                            let value;
                            if (hodlInputs.scenario === 'jan2017') {
                              // Jan 2017 to Jan 2025: Realistic Bitcoin journey with major volatility
                              // Starting at ~$850, ending at ~$100,000+ (118x growth)
                              
                              if (progress < 0.1) {
                                // Early 2017: Steady growth (1x to 2x)
                                value = startValue * (1 + progress * 10);
                              } else if (progress < 0.25) {
                                // Mid-Late 2017: Bubble peak (2x to 23x at peak)
                                const bubbleProgress = (progress - 0.1) / 0.15;
                                value = startValue * (2 + bubbleProgress * 21);
                              } else if (progress < 0.4) {
                                // 2018 Crash: Peak to bottom (23x down to 3.5x)
                                const crashProgress = (progress - 0.25) / 0.15;
                                value = startValue * (23 - crashProgress * 19.5);
                              } else if (progress < 0.6) {
                                // 2019-2020: Slow recovery (3.5x to 12x)
                                const recoveryProgress = (progress - 0.4) / 0.2;
                                value = startValue * (3.5 + recoveryProgress * 8.5);
                              } else if (progress < 0.75) {
                                // 2021: Bull run peak (12x to 80x)
                                const bullProgress = (progress - 0.6) / 0.15;
                                value = startValue * (12 + bullProgress * 68);
                              } else if (progress < 0.9) {
                                // 2022: Bear market (80x to 15x)
                                const bearProgress = (progress - 0.75) / 0.15;
                                value = startValue * (80 - bearProgress * 65);
                              } else {
                                // 2023-2025: Recovery to ATH (15x to 118x)
                                const finalProgress = (progress - 0.9) / 0.1;
                                value = startValue * (15 + finalProgress * 103);
                              }
                            } else {
                              // Simpler growth model for other scenarios
                              value = startValue * Math.pow(currentGrowthRatio, progress);
                            }
                            
                            // Scale to chart coordinates
                            const x = 20 + (progress * 260);
                            const maxChartValue = Math.max(endValue, startValue * 10);
                            const y = 100 - ((value / maxChartValue) * 80);
                            
                            points.push(`${x},${y}`);
                          }
                          
                          return (
                            <g>
                              {/* Area fill */}
                              <path
                                d={`M 20,100 L ${points.join(' L ')} L 280,100 Z`}
                                fill="url(#portfolioGradient)"
                                opacity="0.3"
                              />
                              
                              {/* Line */}
                              <path
                                d={`M ${points.join(' L ')}`}
                                stroke="#f97316"
                                strokeWidth="2"
                                fill="none"
                              />
                              
                              {/* Start and end points */}
                              <circle cx="20" cy="100" r="2" fill="#10b981" />
                              <circle cx="280" cy={100 - ((endValue / Math.max(endValue, startValue * 10)) * 80)} r="3" fill="#f97316" className="animate-pulse" />
                            </g>
                          );
                        })()}
                        
                        <defs>
                          <linearGradient id="portfolioGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#f97316" stopOpacity="0.4"/>
                            <stop offset="100%" stopColor="#f97316" stopOpacity="0.1"/>
                          </linearGradient>
                        </defs>
                        
                        {/* Labels */}
                        <text x="20" y="115" fill="#9ca3af" fontSize="10" textAnchor="start">Start</text>
                        <text x="280" y="115" fill="#9ca3af" fontSize="10" textAnchor="end">Now</text>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Initial Investment:</span>
                      <span className="text-white font-mono">${hodlResults.initialInvestment.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Current Value:</span>
                      <span className="text-green-400 font-mono text-lg">${Math.round(hodlResults.currentValue).toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Total Gain:</span>
                      <span className="text-orange-400 font-mono text-lg">+{Math.round(hodlResults.percentageReturn).toLocaleString()}%</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Profit:</span>
                      <span className="text-green-400 font-mono">+${Math.round(hodlResults.totalGain).toLocaleString()}</span>
                    </div>
                    
                    <div className="pt-3 border-t border-zinc-700">
                      <div className="text-center">
                        <div className="text-zinc-300 text-sm">Held for {hodlInputs.years} years</div>
                        <div className="text-orange-300 font-medium">{Math.round(hodlResults.annualReturn)}% annual return</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {!hodlResults && (
                <div className="text-center py-8 text-zinc-400">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select an investment amount and purchase date to see your HODL results</p>
                </div>
              )}
            </div>
          </div>
          </div>
        </CardContent>
      </Card>

      {/* HODL vs Market Timing Educational Section */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
        </CardContent>
      </Card>

      {/* HODL vs Market Timing Educational Section */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-orange-600/20 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Why HODLing Beats Market Timing</h3>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-zinc-300 mb-4">
              Bitcoin's price can swing wildly day-to-day, making it tempting to try "buying low and selling high." 
              But research shows that even professional traders struggle to consistently time the market successfully.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 my-6">
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-red-400" />
                  Market Timing Risks
                </h4>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li>• Missing the biggest up days hurts returns dramatically</li>
                  <li>• Emotional decisions often lead to buying high, selling low</li>
                  <li>• Transaction fees and taxes eat into profits</li>
                  <li>• Requires constant monitoring and stress</li>
                </ul>
              </div>
              
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  HODL Advantages
                </h4>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li>• Captures all up days and compound growth</li>
                  <li>• Removes emotional decision-making</li>
                  <li>• Minimal fees and better tax treatment</li>
                  <li>• Set it and forget it - less stress</li>
                </ul>
              </div>
            </div>
            
            <p className="text-zinc-300">
              The data is clear: Bitcoin's best performing days often happen during the worst market conditions. 
              HODLers who stay invested through volatility capture the full benefit of Bitcoin's long-term growth trajectory.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HODLSimulator;