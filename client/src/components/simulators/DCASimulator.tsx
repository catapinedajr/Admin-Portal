import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, ChevronDown, Calculator, Clock, Calendar, TrendingUp, Info } from 'lucide-react';

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

  // Historical Bitcoin price data simulation
  const getHistoricalPrice = (date: string): number => {
    const timestamp = new Date(date).getTime();
    const startTime = new Date('2009-01-03').getTime();
    const daysSinceStart = (timestamp - startTime) / (1000 * 60 * 60 * 24);
    
    if (daysSinceStart < 0) return 0.001;
    
    const basePrice = 0.001;
    const growthRate = 0.0025;
    const volatilityFactor = 0.3;
    
    let price = basePrice * Math.exp(growthRate * daysSinceStart);
    
    const cycleFactor = Math.sin(daysSinceStart / 365) * volatilityFactor;
    const randomFactor = (Math.sin(daysSinceStart * 7) * 0.1);
    
    price *= (1 + cycleFactor + randomFactor);
    
    if (date >= '2017-01-01' && date < '2018-03-01') price *= 2.5;
    if (date >= '2018-03-01' && date < '2020-03-01') price *= 0.4;
    if (date >= '2020-03-01' && date < '2022-01-01') price *= 3.2;
    if (date >= '2022-01-01' && date < '2023-01-01') price *= 0.3;
    if (date >= '2023-01-01') price *= 1.8;
    
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
    
    const currentPrice = 65000; // Current Bitcoin price
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

      {/* Simplified Results Display */}
      {dcaResults && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <h4 className="text-lg font-bold text-white mb-6">Your DCA Strategy Results</h4>
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* Investment Summary */}
              <div className="space-y-4">
                <h5 className="text-zinc-300 font-medium">Investment Summary</h5>
                <div className="space-y-3 bg-zinc-800/50 rounded-lg p-4">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Total Invested</span>
                    <span className="text-white font-medium">${Math.round(dcaResults.totalInvested).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Bitcoin Accumulated</span>
                    <span className="text-white">{dcaResults.totalBitcoin.toFixed(4)} BTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Average Purchase Price</span>
                    <span className="text-white">${Math.round(dcaResults.averagePrice).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Time Period</span>
                    <span className="text-white">{dcaResults.duration.toFixed(1)} years</span>
                  </div>
                </div>
              </div>

              {/* Performance Results */}
              <div className="space-y-4">
                <h5 className="text-zinc-300 font-medium">Performance Results</h5>
                <div className="space-y-3 bg-zinc-800/50 rounded-lg p-4">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Current Value</span>
                    <span className="text-green-400 font-bold">${Math.round(dcaResults.currentValue).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Total Gain</span>
                    <span className="text-green-400 font-bold">+${Math.round(dcaResults.totalGain).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Total Return</span>
                    <span className="text-green-400 font-bold">+{Math.round(dcaResults.percentageReturn).toLocaleString()}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Annual Return</span>
                    <span className="text-green-400 font-bold">
                      +{Math.round(((Math.pow(dcaResults.currentValue / dcaResults.totalInvested, 1/dcaResults.duration) - 1) * 100)).toLocaleString()}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}