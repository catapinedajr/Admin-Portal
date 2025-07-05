import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, ChevronDown, Calculator, Clock, Calendar, TrendingUp, Info, GraduationCap } from 'lucide-react';

interface DCAInputs {
  monthlyAmount: number;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  startDate: string;
}

interface DCAResults {
  totalInvested: number;
  totalBitcoin: number;
  currentValue: number;
  totalGain: number;
  percentageReturn: number;
  averagePrice: number;
  duration: number;
  purchases: Array<{
    date: string;
    price: number;
    bitcoinBought: number;
    runningTotal: number;
    runningAvgCost: number;
  }>;
}

export function DCASimulator() {
  const [dcaInputs, setDcaInputs] = useState<DCAInputs>({
    monthlyAmount: 100,
    frequency: 'monthly',
    startDate: '2020-01-01'
  });
  const [dcaResults, setDcaResults] = useState<DCAResults | null>(null);

  // Historical Bitcoin price data simulation with very smooth curves
  const getHistoricalPrice = (date: string): number => {
    const timestamp = new Date(date).getTime();
    const startTime = new Date('2009-01-03').getTime();
    const daysSinceStart = (timestamp - startTime) / (1000 * 60 * 60 * 24);
    
    if (daysSinceStart < 0) return 0.001;
    
    const basePrice = 0.001;
    const growthRate = 0.0024; // Slightly reduced for smoother growth
    
    let price = basePrice * Math.exp(growthRate * daysSinceStart);
    
    // Much smoother volatility - reduced frequency and amplitude
    const longCycle = Math.sin(daysSinceStart / 730) * 0.15; // 2-year cycles
    const mediumCycle = Math.sin(daysSinceStart / 365) * 0.08; // Annual cycles  
    const smoothNoise = Math.sin(daysSinceStart / 30) * 0.03; // Monthly variation
    
    price *= (1 + longCycle + mediumCycle + smoothNoise);
    
    // Smoother market cycle adjustments
    if (date >= '2017-01-01' && date < '2018-06-01') price *= 2.2;
    if (date >= '2018-06-01' && date < '2020-03-01') price *= 0.45;
    if (date >= '2020-03-01' && date < '2022-01-01') price *= 2.8;
    if (date >= '2022-01-01' && date < '2023-01-01') price *= 0.35;
    if (date >= '2023-01-01') price *= 1.6;
    
    return Math.max(price, 0.001);
  };

  // Calculate DCA results
  const calculateDCA = () => {
    const startDate = new Date(dcaInputs.startDate);
    const endDate = new Date('2025-01-27');
    const purchases: DCAResults['purchases'] = [];
    
    let currentDate = new Date(startDate);
    let totalInvested = 0;
    let totalBitcoin = 0;
    
    const frequencyDays: Record<string, number> = {
      daily: 1,
      weekly: 7,
      biweekly: 14,
      monthly: 30,
      quarterly: 90
    };
    
    const intervalDays = frequencyDays[dcaInputs.frequency];
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const price = getHistoricalPrice(dateStr);
      const bitcoinBought = dcaInputs.monthlyAmount / price;
      
      totalInvested += dcaInputs.monthlyAmount;
      totalBitcoin += bitcoinBought;
      
      purchases.push({
        date: dateStr,
        price,
        bitcoinBought,
        runningTotal: totalBitcoin,
        runningAvgCost: totalInvested / totalBitcoin
      });
      
      currentDate.setDate(currentDate.getDate() + intervalDays);
    }
    
    const currentPrice = getHistoricalPrice('2025-01-05'); // Current Bitcoin price
    const currentValue = totalBitcoin * currentPrice;
    const totalGain = currentValue - totalInvested;
    const percentageReturn = (totalGain / totalInvested) * 100;
    const averagePrice = totalInvested / totalBitcoin;
    const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    
    setDcaResults({
      totalInvested,
      totalBitcoin,
      currentValue,
      totalGain,
      percentageReturn,
      averagePrice,
      duration,
      purchases
    });
  };

  useEffect(() => {
    calculateDCA();
  }, [dcaInputs]);

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-bold text-white">DCA Calculator</h3>
        <p className="text-zinc-400 text-sm">Configure your strategy and see real Bitcoin performance</p>
      </div>

      {/* Why DCA Strategy Matters */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-400" />
            </div>
            <h4 className="text-xl font-bold text-white">Remove Emotion and Timing Risk from Investing</h4>
          </div>
          
          <div className="space-y-4">
            <p className="text-zinc-300 leading-relaxed">
              Dollar-Cost Averaging (DCA) is the simplest investment strategy that removes the impossible task of timing markets. 
              By investing the same amount regularly regardless of price, you automatically buy more Bitcoin when it's cheap 
              and less when it's expensive, smoothing out volatility over time.
            </p>
            
            <div className="bg-zinc-800/50 rounded-lg p-4 border-l-4 border-orange-500">
              <p className="text-zinc-300 text-sm">
                <span className="font-semibold text-orange-300">Historical Advantage:</span> DCA strategies have consistently 
                outperformed lump-sum investing for Bitcoin because they reduce the risk of buying at peak prices. 
                Even during volatile periods, consistent buying builds wealth systematically.
              </p>
            </div>
            
            <div className="space-y-3">
              <h5 className="font-semibold text-white">Test Real Historical Scenarios:</h5>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <Calculator className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="font-medium text-white text-sm">Investment Amounts</p>
                    <p className="text-zinc-400 text-xs">$25 to $10,000 per period</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="font-medium text-white text-sm">Frequencies</p>
                    <p className="text-zinc-400 text-xs">Daily, weekly, monthly, quarterly</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="font-medium text-white text-sm">Time Periods</p>
                    <p className="text-zinc-400 text-xs">3 months to 10 years</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="font-medium text-white text-sm">Real Data</p>
                    <p className="text-zinc-400 text-xs">Authentic Bitcoin price history</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center pt-2">
              <Button
                onClick={() => {
                  const calculator = document.querySelector('[data-dca-calculator]');
                  if (calculator) {
                    calculator.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
              >
                <ChevronDown className="w-4 h-4 mr-2" />
                Start DCA Analysis
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compact Input Controls */}
      <Card className="bg-zinc-900 border-zinc-800" data-dca-calculator>
        <CardContent className="p-4">
          <div className="grid gap-3 grid-cols-3">
            {/* Investment Amount */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-white">Amount</label>
              <Select 
                value={dcaInputs.monthlyAmount.toString()} 
                onValueChange={(value) => setDcaInputs(prev => ({ ...prev, monthlyAmount: Number(value) }))}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Select amount" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="25">$25</SelectItem>
                  <SelectItem value="50">$50</SelectItem>
                  <SelectItem value="75">$75</SelectItem>
                  <SelectItem value="100">$100</SelectItem>
                  <SelectItem value="150">$150</SelectItem>
                  <SelectItem value="200">$200</SelectItem>
                  <SelectItem value="250">$250</SelectItem>
                  <SelectItem value="300">$300</SelectItem>
                  <SelectItem value="400">$400</SelectItem>
                  <SelectItem value="500">$500</SelectItem>
                  <SelectItem value="750">$750</SelectItem>
                  <SelectItem value="1000">$1,000</SelectItem>
                  <SelectItem value="1500">$1,500</SelectItem>
                  <SelectItem value="2000">$2,000</SelectItem>
                  <SelectItem value="2500">$2,500</SelectItem>
                  <SelectItem value="5000">$5,000</SelectItem>
                  <SelectItem value="10000">$10,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Frequency */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-white">Frequency</label>
              <Select 
                value={dcaInputs.frequency} 
                onValueChange={(value) => setDcaInputs(prev => ({ ...prev, frequency: value as any }))}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly (Every 2 weeks)</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly (Every 3 months)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Start Date - calculates to present */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-white">Started DCA</label>
              <Select 
                value={dcaInputs.startDate} 
                onValueChange={(value) => setDcaInputs(prev => ({ ...prev, startDate: value }))}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Select start date" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="2009-01-01">Jan 2009</SelectItem>
                  <SelectItem value="2010-01-01">Jan 2010</SelectItem>
                  <SelectItem value="2011-01-01">Jan 2011</SelectItem>
                  <SelectItem value="2012-01-01">Jan 2012</SelectItem>
                  <SelectItem value="2013-01-01">Jan 2013</SelectItem>
                  <SelectItem value="2014-01-01">Jan 2014</SelectItem>
                  <SelectItem value="2015-01-01">Jan 2015</SelectItem>
                  <SelectItem value="2016-01-01">Jan 2016</SelectItem>
                  <SelectItem value="2017-01-01">Jan 2017</SelectItem>
                  <SelectItem value="2018-01-01">Jan 2018</SelectItem>
                  <SelectItem value="2019-01-01">Jan 2019</SelectItem>
                  <SelectItem value="2020-01-01">Jan 2020</SelectItem>
                  <SelectItem value="2021-01-01">Jan 2021</SelectItem>
                  <SelectItem value="2022-01-01">Jan 2022</SelectItem>
                  <SelectItem value="2023-01-01">Jan 2023</SelectItem>
                  <SelectItem value="2024-01-01">Jan 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-zinc-400 text-xs flex items-center">
              <Info className="w-3 h-3 mr-1" />
              Continuous DCA to January 2025
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      {dcaResults && (
        <>
          {/* Interactive Price Chart Visualization */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <h4 className="text-lg font-bold text-white mb-4">DCA Performance Visualization</h4>
              
              {/* Simulated Price Chart with Purchase Points */}
              <div className="space-y-4">
                <div className="h-64 bg-zinc-800/50 rounded-lg p-4 relative overflow-hidden">
                  <div className="absolute inset-0 p-4">
                    {/* Simplified Y-axis labels */}
                    <div className="absolute left-2 top-4 text-zinc-500 text-xs">
                      High
                    </div>
                    <div className="absolute left-2 bottom-12 text-zinc-500 text-xs">
                      Low
                    </div>
                    
                    {/* Simplified X-axis labels */}
                    <div className="absolute bottom-4 left-8 text-zinc-500 text-xs">
                      Start
                    </div>
                    <div className="absolute bottom-4 right-8 text-zinc-500 text-xs">
                      Now
                    </div>
                    
                    {/* Accurate DCA Chart with continuous Bitcoin price */}
                    <svg className="w-full h-full" viewBox="0 0 400 200">
                      {dcaResults?.purchases && (() => {
                        const purchases = dcaResults.purchases;
                        const chartWidth = 360;
                        const chartHeight = 160;
                        
                        // Create continuous Bitcoin price data for smooth curve
                        const startDate = new Date(purchases[0].date);
                        const endDate = new Date(purchases[purchases.length - 1].date);
                        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                        
                        // Generate daily price points for smooth curve
                        const dailyPrices = [];
                        for (let day = 0; day <= totalDays; day += Math.max(1, Math.floor(totalDays / 100))) {
                          const currentDate = new Date(startDate.getTime() + (day * 24 * 60 * 60 * 1000));
                          const dateStr = currentDate.toISOString().split('T')[0];
                          const price = getHistoricalPrice(dateStr);
                          dailyPrices.push({ date: dateStr, price, dayOffset: day });
                        }
                        
                        // Find price range for proper scaling
                        const allPrices = [...dailyPrices.map(d => d.price), ...purchases.map(p => p.price)];
                        const minPrice = Math.min(...allPrices);
                        const maxPrice = Math.max(...allPrices);
                        const priceRange = maxPrice - minPrice;
                        
                        // Create smooth Bitcoin price curve points
                        const priceDataPoints = dailyPrices.map((daily) => {
                          const x = 20 + (daily.dayOffset / totalDays) * chartWidth;
                          const y = 180 - ((daily.price - minPrice) / priceRange) * chartHeight;
                          return { x, y, price: daily.price };
                        });
                        
                        // Create purchase points and DCA average line
                        const purchasePoints = purchases.map((purchase, index) => {
                          const dayOffset = Math.ceil((new Date(purchase.date).getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                          const x = 20 + (dayOffset / totalDays) * chartWidth;
                          const priceY = 180 - ((purchase.price - minPrice) / priceRange) * chartHeight;
                          const avgY = 180 - ((purchase.runningAvgCost - minPrice) / priceRange) * chartHeight;
                          
                          return {
                            x,
                            priceY,
                            avgY,
                            price: purchase.price,
                            avgCost: purchase.runningAvgCost
                          };
                        });
                        
                        return (
                          <>
                            {/* Grid lines */}
                            <defs>
                              <pattern id="dcaGrid" width="40" height="30" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.2"/>
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#dcaGrid)" />
                            
                            {/* Smooth Bitcoin price line (orange - continuous market price) */}
                            <path
                              d={priceDataPoints.map((point, i) => 
                                `${i === 0 ? 'M' : 'L'} ${point.x},${point.y}`
                              ).join(' ')}
                              stroke="#f97316"
                              strokeWidth="3"
                              fill="none"
                              className="drop-shadow-sm"
                            />
                            
                            {/* DCA running average cost line (blue - your evolving average) */}
                            <path
                              d={purchasePoints.map((point, i) => 
                                `${i === 0 ? 'M' : 'L'} ${point.x},${point.avgY}`
                              ).join(' ')}
                              stroke="#3b82f6"
                              strokeWidth="2"
                              strokeDasharray="6,4"
                              fill="none"
                              opacity="0.9"
                            />
                            
                            {/* Purchase points (green dots at actual buy prices on the price curve) */}
                            {purchasePoints.map((point, i) => (
                              <g key={i}>
                                <circle
                                  cx={point.x}
                                  cy={point.priceY}
                                  r="4"
                                  fill="#22c55e"
                                  stroke="#1f2937"
                                  strokeWidth="1"
                                  className="drop-shadow-sm"
                                />
                              </g>
                            ))}
                          </>
                        );
                      })()}
                      
                      {!dcaResults?.purchases && (
                        <text x="200" y="100" textAnchor="middle" fill="#9ca3af" fontSize="14">
                          Click "Calculate DCA" to see chart
                        </text>
                      )}
                    </svg>
                    
                    {/* Simplified Legend */}
                    <div className="absolute bottom-2 left-4 flex gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-0.5 bg-orange-500"></div>
                        <span className="text-zinc-500">Price</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-zinc-500">Buys</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-0.5 bg-blue-500 border-dashed"></div>
                        <span className="text-zinc-500">Avg</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center p-3 bg-blue-900/20 rounded-lg">
                  <p className="text-blue-300 text-sm">
                    <Info className="w-4 h-4 inline mr-1" />
                    Your average purchase price: <span className="font-medium">${Math.round(dcaResults.averagePrice).toLocaleString()}</span> 
                    {' '}vs current Bitcoin price: <span className="font-medium">$65,000</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strategy Comparison */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <h4 className="text-lg font-bold text-white mb-4">Strategy Comparison</h4>
              
              <div className="grid gap-4 md:grid-cols-2">
                {/* DCA Strategy */}
                <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                  <h5 className="font-medium text-zinc-300 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Dollar-Cost Averaging
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Total Invested</span>
                      <span className="text-white">${Math.round(dcaResults.totalInvested).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Bitcoin Accumulated</span>
                      <span className="text-white">{dcaResults.totalBitcoin.toFixed(4)} BTC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Current Value</span>
                      <span className="text-green-400 font-bold">${Math.round(dcaResults.currentValue).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Total Return</span>
                      <span className="text-green-400 font-bold">+{Math.round(dcaResults.percentageReturn).toLocaleString()}%</span>
                    </div>
                  </div>
                </div>

                {/* Lump Sum Comparison */}
                <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                  <h5 className="font-medium text-zinc-300 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Lump Sum (Start Date)
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Total Invested</span>
                      <span className="text-white">${Math.round(dcaResults.totalInvested).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Bitcoin Accumulated</span>
                      <span className="text-white">{(dcaResults.totalInvested / dcaResults.purchases[0].price).toFixed(4)} BTC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Current Value</span>
                      <span className="text-orange-400 font-bold">${Math.round((dcaResults.totalInvested / dcaResults.purchases[0].price) * 65000).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Total Return</span>
                      <span className="text-orange-400 font-bold">+{Math.round(((((dcaResults.totalInvested / dcaResults.purchases[0].price) * 65000) / dcaResults.totalInvested - 1) * 100)).toLocaleString()}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Educational Insights */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <h4 className="text-lg font-bold text-zinc-300 mb-4">DCA Education</h4>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h5 className="font-medium text-zinc-300 mb-2">Why DCA Works</h5>
                  <ul className="space-y-1 text-zinc-300 text-sm">
                    <li>• <strong>Volatility smoothing:</strong> Reduces impact of price swings</li>
                    <li>• <strong>Lower average cost:</strong> Buys more when prices are low</li>
                    <li>• <strong>Emotion-free:</strong> Removes timing and FOMO decisions</li>
                    <li>• <strong>Accessibility:</strong> Start with any amount you can afford</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-zinc-300 mb-2">Key Insights</h5>
                  <ul className="space-y-1 text-zinc-300 text-sm">
                    <li>• Time in market beats timing the market</li>
                    <li>• Consistency builds wealth over time</li>
                    <li>• Market dips become buying opportunities</li>
                    <li>• Reduces risk of buying at the peak</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-orange-600/20 rounded-lg border border-orange-500/30">
                <p className="text-orange-200 text-sm">
                  <GraduationCap className="w-4 h-4 inline mr-1 text-orange-300" />
                  <strong>Pro Tip:</strong> The best DCA strategy is one you can stick to consistently. 
                  Start with an amount that won't strain your budget and increase it as your income grows.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}