import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingDown, TrendingUp, BarChart3 } from '@/lib/icons';

interface TabbedStrategyComparisonProps {
  inflationSimActive: boolean;
  inflationProgress: number;
  startInflationSimulation: () => void;
}

export function TabbedStrategyComparison({ 
  inflationSimActive, 
  inflationProgress, 
  startInflationSimulation 
}: TabbedStrategyComparisonProps) {
  const [activeTab, setActiveTab] = useState<'cash-vs-inflation' | 'traditional-vs-bitcoin' | 'all-three'>('cash-vs-inflation');

  const tabs = [
    { id: 'cash-vs-inflation', label: 'Cash vs Inflation', icon: TrendingDown },
    { id: 'traditional-vs-bitcoin', label: 'Traditional vs Bitcoin', icon: TrendingUp },
    { id: 'all-three', label: 'All Three Strategies', icon: BarChart3 }
  ];

  const cashVsInflationData = [
    { step: 0, year: "Today", cash: 25000, narrative: "Starting point" },
    { step: 1, year: "5 years", cash: 21562, narrative: "Inflation takes hold" },
    { step: 2, year: "10 years", cash: 18584, narrative: "Purchasing power drops" },
    { step: 3, year: "20 years", cash: 15342, narrative: "Significant erosion" },
    { step: 4, year: "25 years", cash: 13670, narrative: "45% purchasing power lost" }
  ];

  const traditionalVsBitcoinData = [
    { step: 0, year: "Today", traditional: 25000, btc: 25000, narrative: "Both start equal" },
    { step: 1, year: "5 years", traditional: 35051, btc: 76294, narrative: "Bitcoin pulls ahead" },
    { step: 2, year: "10 years", traditional: 49099, btc: 232831, narrative: "Exponential divergence" },
    { step: 3, year: "20 years", traditional: 96590, btc: 2183468, narrative: "Orders of magnitude difference" },
    { step: 4, year: "25 years", traditional: 135263, btc: 6781371, narrative: "Bitcoin dominates" }
  ];

  const allThreeData = [
    { step: 0, year: "Today", cash: 25000, traditional: 25000, btc: 25000, narrative: "All start equal" },
    { step: 1, year: "5 years", cash: 21562, traditional: 35051, btc: 76294, narrative: "Early divergence" },
    { step: 2, year: "10 years", cash: 18584, traditional: 49099, btc: 232831, narrative: "Compound growth builds" },
    { step: 3, year: "20 years", cash: 15342, traditional: 96590, btc: 2183468, narrative: "Two decades of growth" },
    { step: 4, year: "25 years", cash: 13670, traditional: 135263, btc: 6781371, narrative: "Long-term holder rewards" }
  ];

  const renderCashVsInflation = () => (
    <div className="space-y-3">
      {cashVsInflationData.map(({ step, year, cash, narrative }) => {
        const isActive = inflationProgress >= step;
        
        return (
          <div key={step} className={`grid grid-cols-3 gap-3 p-3 rounded transition-all duration-700 ${
            isActive ? 'bg-zinc-800/50' : 'bg-zinc-900/30'
          }`}>
            <div className={`text-sm font-medium flex items-center ${
              isActive ? 'text-zinc-200' : 'text-zinc-500'
            }`}>
              {year}
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className={isActive ? 'text-red-300' : 'text-zinc-500'}>Cash Value</span>
                <span className={isActive ? 'text-red-200 font-bold' : 'text-zinc-500'}>
                  ${cash.toLocaleString()}
                </span>
              </div>
              <div className="bg-zinc-700 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    isActive ? 'bg-red-500' : 'bg-zinc-600'
                  }`}
                  style={{ width: isActive ? `${(cash/25000)*100}%` : '100%' }}
                />
              </div>
            </div>
            
            <div className={`text-xs flex items-center ${
              isActive ? 'text-zinc-300' : 'text-zinc-500'
            }`}>
              {narrative}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderTraditionalVsBitcoin = () => (
    <div className="space-y-3">
      {traditionalVsBitcoinData.map(({ step, year, traditional, btc, narrative }) => {
        const isActive = inflationProgress >= step;
        
        return (
          <div key={step} className={`grid grid-cols-4 gap-2 p-3 rounded transition-all duration-700 ${
            isActive ? 'bg-zinc-800/50' : 'bg-zinc-900/30'
          }`}>
            <div className={`text-sm font-medium flex items-center ${
              isActive ? 'text-zinc-200' : 'text-zinc-500'
            }`}>
              {year}
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className={isActive ? 'text-blue-300' : 'text-zinc-500'}>S&P 500</span>
                <span className={isActive ? 'text-blue-200 font-bold' : 'text-zinc-500'}>
                  ${traditional >= 100000 ? `${(traditional/1000).toFixed(0)}K` : traditional.toLocaleString()}
                </span>
              </div>
              <div className="bg-zinc-700 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    isActive ? 'bg-blue-500' : 'bg-zinc-600'
                  }`}
                  style={{ width: isActive ? `${Math.min((traditional/250000)*100, 100)}%` : '0%' }}
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className={isActive ? 'text-orange-300' : 'text-zinc-500'}>Bitcoin</span>
                <span className={isActive ? 'text-orange-200 font-bold' : 'text-zinc-500'}>
                  ${btc >= 1000000 ? `${(btc/1000000).toFixed(1)}M` : btc.toLocaleString()}
                </span>
              </div>
              <div className="bg-zinc-700 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    isActive ? 'bg-orange-500' : 'bg-zinc-600'
                  }`}
                  style={{ width: isActive ? `${Math.min((btc/2750000)*100, 100)}%` : '0%' }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderAllThree = () => (
    <div className="space-y-3">
      {allThreeData.map(({ step, year, cash, traditional, btc, narrative }) => {
        const isActive = inflationProgress >= step;
        
        return (
          <div key={step} className={`grid grid-cols-5 gap-2 p-2 rounded transition-all duration-700 ${
            isActive ? 'bg-zinc-800/50' : 'bg-zinc-900/30'
          }`}>
            <div className={`text-sm font-medium flex items-center ${
              isActive ? 'text-zinc-200' : 'text-zinc-500'
            }`}>
              {year}
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className={isActive ? 'text-red-300' : 'text-zinc-500'}>Cash</span>
                <span className={isActive ? 'text-red-200 font-bold' : 'text-zinc-500'}>
                  ${cash >= 1000 ? `${(cash/1000).toFixed(0)}K` : cash.toLocaleString()}
                </span>
              </div>
              <div className="bg-zinc-700 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    isActive ? 'bg-red-500' : 'bg-zinc-600'
                  }`}
                  style={{ width: isActive ? `${(cash/25000)*100}%` : '100%' }}
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className={isActive ? 'text-blue-300' : 'text-zinc-500'}>S&P</span>
                <span className={isActive ? 'text-blue-200 font-bold' : 'text-zinc-500'}>
                  ${traditional >= 100000 ? `${(traditional/1000).toFixed(0)}K` : traditional.toLocaleString()}
                </span>
              </div>
              <div className="bg-zinc-700 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    isActive ? 'bg-blue-500' : 'bg-zinc-600'
                  }`}
                  style={{ width: isActive ? `${Math.min((traditional/250000)*100, 100)}%` : '0%' }}
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className={isActive ? 'text-orange-300' : 'text-zinc-500'}>BTC</span>
                <span className={isActive ? 'text-orange-200 font-bold' : 'text-zinc-500'}>
                  ${btc >= 1000000 ? `${(btc/1000000).toFixed(1)}M` : btc.toLocaleString()}
                </span>
              </div>
              <div className="bg-zinc-700 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    isActive ? 'bg-orange-500' : 'bg-zinc-600'
                  }`}
                  style={{ width: isActive ? `${Math.min((btc/2750000)*100, 100)}%` : '0%' }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-3 text-xl">
          <TrendingDown className="w-5 h-5 text-orange-400" />
          Let's See What This Is Doing to Your Money
        </CardTitle>
        <p className="text-zinc-400 text-sm">Compare different investment strategies over 25 years</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {!inflationSimActive && inflationProgress === 0 && (
          <div className="text-center space-y-4">
            <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700">
              <p className="text-zinc-300 mb-3">
                You saved <span className="text-orange-400 font-bold">$25,000</span>. 
                Explore different strategies and see what happens over 25 years.
              </p>
              <p className="text-zinc-400 text-sm">
                Use tabs to explore different comparisons.
              </p>
            </div>
            <Button 
              onClick={startInflationSimulation}
              className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-lg font-medium"
            >
              Start Strategy Comparison
            </Button>
          </div>
        )}

        {(inflationSimActive || inflationProgress > 0) && (
          <div className="space-y-4">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-zinc-800/50 p-1 rounded-lg">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-orange-600 text-white shadow-lg'
                        : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-700/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
              {activeTab === 'cash-vs-inflation' && (
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <p className="text-zinc-300 text-sm font-medium">Cash vs Inflation</p>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      Watch how cash slowly loses purchasing power to inflation over time.
                    </p>
                  </div>
                  {renderCashVsInflation()}
                </div>
              )}

              {activeTab === 'traditional-vs-bitcoin' && (
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <p className="text-zinc-300 text-sm font-medium">Traditional vs Bitcoin</p>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      Compare S&P 500 steady growth against Bitcoin's exponential potential.
                    </p>
                  </div>
                  {renderTraditionalVsBitcoin()}
                </div>
              )}

              {activeTab === 'all-three' && (
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <p className="text-zinc-300 text-sm font-medium">All Three Strategies</p>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      See the complete picture: cash, traditional investments, and Bitcoin side by side.
                    </p>
                  </div>
                  {renderAllThree()}
                </div>
              )}
            </div>

            {/* Results Summary */}
            {inflationProgress >= 5 && (
              <div className="p-4 bg-zinc-800/30 rounded-lg border border-orange-400/20">
                <div className="text-center">
                  <div className="text-white font-bold text-sm mb-2">
                    {activeTab === 'cash-vs-inflation' ? 'Inflation Impact' : 
                     activeTab === 'traditional-vs-bitcoin' ? 'Investment Comparison' : 
                     'Three Strategy Comparison'}
                  </div>
                  
                  {activeTab === 'cash-vs-inflation' && (
                    <div className="text-center">
                      <div className="text-red-400 font-medium">Cash Savings</div>
                      <div className="text-red-300 text-lg font-bold">$13,670</div>
                      <div className="text-red-400">Lost 45% to inflation</div>
                    </div>
                  )}

                  {activeTab === 'traditional-vs-bitcoin' && (
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="text-center">
                        <div className="text-blue-400 font-medium">S&P 500</div>
                        <div className="text-blue-300 text-lg font-bold">$135K</div>
                        <div className="text-blue-400">5.4x growth</div>
                      </div>
                      <div className="text-center">
                        <div className="text-orange-400 font-medium">Bitcoin</div>
                        <div className="text-orange-300 text-lg font-bold">$6.8M</div>
                        <div className="text-orange-400">271x growth</div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'all-three' && (
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="text-center">
                        <div className="text-red-400 font-medium">Cash</div>
                        <div className="text-red-300 text-lg font-bold">$13,670</div>
                        <div className="text-red-400">-45%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-400 font-medium">S&P 500</div>
                        <div className="text-blue-300 text-lg font-bold">$135K</div>
                        <div className="text-blue-400">5.4x</div>
                      </div>
                      <div className="text-center">
                        <div className="text-orange-400 font-medium">Bitcoin</div>
                        <div className="text-orange-300 text-lg font-bold">$6.8M</div>
                        <div className="text-orange-400">271x</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}