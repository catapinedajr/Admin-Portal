import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, TrendingUp, Bitcoin } from "@/lib/icons";

interface PricePoint {
  date: string;
  price: number;
}

interface BitcoinPriceChartProps {
  isOpen: boolean;
  onClose: () => void;
  currentPrice: number;
}

export default function BitcoinPriceChart({ isOpen, onClose, currentPrice }: BitcoinPriceChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1Y' | '4Y' | '10Y' | 'ALL'>('1Y');
  const [priceData, setPriceData] = useState<PricePoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Historical Bitcoin price data with much higher resolution and accuracy
  const historicalData: Record<string, PricePoint[]> = {
    'ALL': [
      { date: '2009-01', price: 0.001 },
      { date: '2009-10', price: 0.001 },
      { date: '2010-05', price: 0.01 },
      { date: '2010-07', price: 0.05 },
      { date: '2010-11', price: 0.5 },
      { date: '2011-02', price: 1 },
      { date: '2011-04', price: 1.5 },
      { date: '2011-06', price: 31 },
      { date: '2011-11', price: 3 },
      { date: '2012-01', price: 5 },
      { date: '2012-11', price: 12 },
      { date: '2013-01', price: 13 },
      { date: '2013-04', price: 266 },
      { date: '2013-07', price: 100 },
      { date: '2013-11', price: 1200 },
      { date: '2014-01', price: 800 },
      { date: '2014-04', price: 400 },
      { date: '2014-12', price: 315 },
      { date: '2015-01', price: 200 },
      { date: '2015-08', price: 250 },
      { date: '2016-01', price: 430 },
      { date: '2016-06', price: 650 },
      { date: '2017-01', price: 1000 },
      { date: '2017-05', price: 2800 },
      { date: '2017-09', price: 5000 },
      { date: '2017-12', price: 19783 },
      { date: '2018-02', price: 8000 },
      { date: '2018-06', price: 6000 },
      { date: '2018-12', price: 3200 },
      { date: '2019-04', price: 5000 },
      { date: '2019-06', price: 11000 },
      { date: '2019-12', price: 7200 },
      { date: '2020-03', price: 5000 },
      { date: '2020-05', price: 9000 },
      { date: '2020-08', price: 12000 },
      { date: '2020-12', price: 29000 },
      { date: '2021-04', price: 64000 },
      { date: '2021-07', price: 32000 },
      { date: '2021-11', price: 69000 },
      { date: '2022-01', price: 42000 },
      { date: '2022-06', price: 20000 },
      { date: '2022-12', price: 16500 },
      { date: '2023-03', price: 28000 },
      { date: '2023-06', price: 30000 },
      { date: '2023-10', price: 35000 },
      { date: '2023-12', price: 42000 },
      { date: '2024-03', price: 73000 },
      { date: '2024-06', price: 62000 },
      { date: '2024-09', price: 60000 },
      { date: '2024-11', price: 95000 },
      { date: '2024-12', price: 98000 },
      { date: '2025-01', price: currentPrice }
    ],
    '10Y': [
      { date: '2015-01', price: 200 },
      { date: '2015-08', price: 250 },
      { date: '2016-01', price: 430 },
      { date: '2016-06', price: 650 },
      { date: '2017-01', price: 1000 },
      { date: '2017-05', price: 2800 },
      { date: '2017-09', price: 5000 },
      { date: '2017-12', price: 19783 },
      { date: '2018-02', price: 8000 },
      { date: '2018-06', price: 6000 },
      { date: '2018-12', price: 3200 },
      { date: '2019-04', price: 5000 },
      { date: '2019-06', price: 11000 },
      { date: '2019-12', price: 7200 },
      { date: '2020-03', price: 5000 },
      { date: '2020-05', price: 9000 },
      { date: '2020-08', price: 12000 },
      { date: '2020-12', price: 29000 },
      { date: '2021-04', price: 64000 },
      { date: '2021-07', price: 32000 },
      { date: '2021-11', price: 69000 },
      { date: '2022-01', price: 42000 },
      { date: '2022-06', price: 20000 },
      { date: '2022-12', price: 16500 },
      { date: '2023-03', price: 28000 },
      { date: '2023-06', price: 30000 },
      { date: '2023-10', price: 35000 },
      { date: '2023-12', price: 42000 },
      { date: '2024-03', price: 73000 },
      { date: '2024-06', price: 62000 },
      { date: '2024-09', price: 60000 },
      { date: '2024-11', price: 95000 },
      { date: '2024-12', price: 98000 },
      { date: '2025-01', price: currentPrice }
    ],
    '4Y': [
      { date: '2021-01', price: 30000 },
      { date: '2021-02', price: 45000 },
      { date: '2021-04', price: 64000 },
      { date: '2021-05', price: 35000 },
      { date: '2021-07', price: 32000 },
      { date: '2021-09', price: 45000 },
      { date: '2021-11', price: 69000 },
      { date: '2022-01', price: 42000 },
      { date: '2022-03', price: 45000 },
      { date: '2022-06', price: 20000 },
      { date: '2022-09', price: 18000 },
      { date: '2022-12', price: 16500 },
      { date: '2023-01', price: 23000 },
      { date: '2023-03', price: 28000 },
      { date: '2023-06', price: 30000 },
      { date: '2023-09', price: 26000 },
      { date: '2023-10', price: 35000 },
      { date: '2023-12', price: 42000 },
      { date: '2024-01', price: 42000 },
      { date: '2024-03', price: 73000 },
      { date: '2024-04', price: 65000 },
      { date: '2024-06', price: 62000 },
      { date: '2024-07', price: 66000 },
      { date: '2024-08', price: 58000 },
      { date: '2024-09', price: 60000 },
      { date: '2024-10', price: 68000 },
      { date: '2024-11', price: 95000 },
      { date: '2024-12', price: 98000 },
      { date: '2025-01', price: currentPrice }
    ],
    '1Y': [
      { date: '2024-01-01', price: 42000 },
      { date: '2024-01-15', price: 43000 },
      { date: '2024-02-01', price: 50000 },
      { date: '2024-02-15', price: 52000 },
      { date: '2024-03-01', price: 62000 },
      { date: '2024-03-15', price: 73000 },
      { date: '2024-04-01', price: 71000 },
      { date: '2024-04-15', price: 65000 },
      { date: '2024-05-01', price: 68000 },
      { date: '2024-05-15', price: 67000 },
      { date: '2024-06-01', price: 62000 },
      { date: '2024-06-15', price: 65000 },
      { date: '2024-07-01', price: 66000 },
      { date: '2024-07-15', price: 65000 },
      { date: '2024-08-01', price: 58000 },
      { date: '2024-08-15', price: 59000 },
      { date: '2024-09-01', price: 60000 },
      { date: '2024-09-15', price: 63000 },
      { date: '2024-10-01', price: 68000 },
      { date: '2024-10-15', price: 67000 },
      { date: '2024-11-01', price: 73000 },
      { date: '2024-11-15', price: 95000 },
      { date: '2024-12-01', price: 98000 },
      { date: '2024-12-15', price: 105000 },
      { date: '2025-01-01', price: currentPrice }
    ]
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Simulate loading time for realistic feel
      setTimeout(() => {
        setPriceData(historicalData[selectedTimeframe]);
        setIsLoading(false);
      }, 300);
    }
  }, [selectedTimeframe, isOpen, currentPrice]);

  const formatPrice = (price: number) => {
    if (price < 1) return `$${price.toFixed(3)}`;
    if (price < 1000) return `$${price.toFixed(0)}`;
    return `$${(price / 1000).toFixed(0)}K`;
  };

  const getPerformanceData = () => {
    if (priceData.length < 2) return { change: 0, percentage: 0 };
    const firstPrice = priceData[0].price;
    const lastPrice = priceData[priceData.length - 1].price;
    const change = lastPrice - firstPrice;
    const percentage = ((lastPrice - firstPrice) / firstPrice) * 100;
    return { change, percentage };
  };

  const { change, percentage } = getPerformanceData();

  // Create SVG path for the price chart
  const createPath = () => {
    if (priceData.length < 2) return '';
    
    const width = 1200;
    const height = 600;
    const padding = 40;
    
    const minPrice = Math.min(...priceData.map(p => p.price));
    const maxPrice = Math.max(...priceData.map(p => p.price));
    const priceRange = maxPrice - minPrice;
    
    const points = priceData.map((point, index) => {
      const x = padding + (index / (priceData.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((point.price - minPrice) / priceRange) * (height - 2 * padding);
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  const timeframes = [
    { key: '1Y' as const, label: '1 Year' },
    { key: '4Y' as const, label: '4 Years' },
    { key: '10Y' as const, label: '10 Years' },
    { key: 'ALL' as const, label: 'All Time' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] h-[95vh] bg-zinc-900 border-zinc-700 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">₿</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Bitcoin Price History</h2>
                <p className="text-sm text-zinc-400">Long-term perspective on Bitcoin's price evolution</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 space-y-6">
            {/* Current Price and Performance */}
            <div className="bg-zinc-800/30 rounded-xl p-6 border border-zinc-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold text-white">
                    ${currentPrice.toLocaleString()}
                  </div>
                  <div className="text-sm text-zinc-400 mt-1">Current Bitcoin Price</div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {percentage >= 0 ? '+' : ''}{percentage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-zinc-400 mt-1">
                    {selectedTimeframe} Performance
                  </div>
                </div>
              </div>
            </div>

            {/* Timeframe Selection */}
            <div className="flex justify-center space-x-3">
              {timeframes.map((timeframe) => (
                <Button
                  key={timeframe.key}
                  variant={selectedTimeframe === timeframe.key ? "default" : "outline"}
                  size="lg"
                  onClick={() => setSelectedTimeframe(timeframe.key)}
                  className={`${
                    selectedTimeframe === timeframe.key
                      ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg'
                      : 'bg-zinc-800 border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                  } px-8 py-3 text-lg font-medium`}
                >
                  {timeframe.label}
                </Button>
              ))}
            </div>

            {/* Chart */}
            <div className="bg-zinc-800/20 rounded-xl p-6 border border-zinc-700 flex-1">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-zinc-400 text-lg">Loading chart data...</div>
                </div>
              ) : (
                <div className="relative h-full">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 1200 600"
                    className="overflow-visible"
                  >
                    {/* Grid lines */}
                    <defs>
                      <pattern id="grid" width="60" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 30" fill="none" stroke="rgb(63 63 70)" strokeWidth="0.5" opacity="0.2"/>
                      </pattern>
                      <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: 'rgb(249 115 22)', stopOpacity: 0.3 }} />
                        <stop offset="100%" style={{ stopColor: 'rgb(249 115 22)', stopOpacity: 0.05 }} />
                      </linearGradient>
                    </defs>
                    <rect width="1200" height="600" fill="url(#grid)" />
                    
                    {/* Area under the curve */}
                    <path
                      d={createPath() + ' L 1160,560 L 40,560 Z'}
                      fill="url(#priceGradient)"
                    />
                    
                    {/* Price line */}
                    <path
                      d={createPath()}
                      fill="none"
                      stroke="rgb(249 115 22)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="drop-shadow(0 0 8px rgba(249, 115, 22, 0.3))"
                    />
                    
                    {/* Data points */}
                    {priceData.map((point, index) => {
                      const width = 1200;
                      const height = 600;
                      const padding = 40;
                      const minPrice = Math.min(...priceData.map(p => p.price));
                      const maxPrice = Math.max(...priceData.map(p => p.price));
                      const priceRange = maxPrice - minPrice;
                      
                      const x = padding + (index / (priceData.length - 1)) * (width - 2 * padding);
                      const y = height - padding - ((point.price - minPrice) / priceRange) * (height - 2 * padding);
                      
                      return (
                        <circle
                          key={index}
                          cx={x}
                          cy={y}
                          r="5"
                          fill="rgb(249 115 22)"
                          stroke="white"
                          strokeWidth="2"
                          className="hover:r-8 transition-all cursor-pointer"
                          filter="drop-shadow(0 0 4px rgba(249, 115, 22, 0.4))"
                        >
                          <title>{point.date}: ${point.price.toLocaleString()}</title>
                        </circle>
                      );
                    })}
                    
                    {/* Price labels with better formatting */}
                    {priceData.length > 0 && (
                      <>
                        <text x="50" y="70" fill="rgb(161 161 170)" fontSize="14" textAnchor="start" fontWeight="500">
                          {formatPrice(Math.max(...priceData.map(p => p.price)))}
                        </text>
                        <text x="50" y="540" fill="rgb(161 161 170)" fontSize="14" textAnchor="start" fontWeight="500">
                          {formatPrice(Math.min(...priceData.map(p => p.price)))}
                        </text>
                        
                        {/* Time axis labels */}
                        {priceData.length > 2 && (
                          <>
                            <text x="60" y="580" fill="rgb(161 161 170)" fontSize="12" textAnchor="start">
                              {priceData[0].date}
                            </text>
                            <text x="1140" y="580" fill="rgb(161 161 170)" fontSize="12" textAnchor="end">
                              {priceData[priceData.length - 1].date}
                            </text>
                          </>
                        )}
                      </>
                    )}
                  </svg>
                </div>
              )}
            </div>

            {/* Key Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-800/40 rounded-lg p-4 border border-zinc-700">
                <div className="text-sm text-zinc-400 mb-1">Period Start</div>
                <div className="text-xl font-bold text-white">
                  {priceData.length > 0 ? formatPrice(priceData[0].price) : '-'}
                </div>
              </div>
              <div className="bg-zinc-800/40 rounded-lg p-4 border border-zinc-700">
                <div className="text-sm text-zinc-400 mb-1">Current Price</div>
                <div className="text-xl font-bold text-white">
                  {priceData.length > 0 ? formatPrice(priceData[priceData.length - 1].price) : '-'}
                </div>
              </div>
              <div className="bg-zinc-800/40 rounded-lg p-4 border border-zinc-700">
                <div className="text-sm text-zinc-400 mb-1">All-Time High</div>
                <div className="text-xl font-bold text-green-400">
                  {priceData.length > 0 ? formatPrice(Math.max(...priceData.map(p => p.price))) : '-'}
                </div>
              </div>
              <div className="bg-zinc-800/40 rounded-lg p-4 border border-zinc-700">
                <div className="text-sm text-zinc-400 mb-1">Period Low</div>
                <div className="text-xl font-bold text-red-400">
                  {priceData.length > 0 ? formatPrice(Math.min(...priceData.map(p => p.price))) : '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-zinc-700 bg-zinc-800/30">
            <div className="flex items-center justify-center">
              <p className="text-zinc-400 text-sm font-medium italic">
                "When in doubt, zoom out"
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}