import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1Y' | '4Y' | '10Y' | 'ALL'>('10Y');
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

  // Create SVG path for mobile chart
  const createMobilePath = () => {
    if (priceData.length < 2) return '';
    
    const width = 800;
    const height = 600;
    const padding = 20;
    
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
      <DialogContent className="max-w-none w-full h-full bg-black border-none p-0 m-0 rounded-none [&>button]:hidden">
        <DialogTitle className="sr-only">Bitcoin Price Chart</DialogTitle>
        <DialogDescription className="sr-only">Historical Bitcoin price data with multiple timeframes</DialogDescription>
        <div className="flex flex-col h-full">
          {/* Header - Robinhood style */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/50">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">₿</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Bitcoin</h2>
                <p className="text-xs text-zinc-400">BTC Price History</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Price Display - Robinhood style */}
          <div className="px-4 py-3 bg-zinc-900/50">
            <div className="flex items-baseline justify-between mb-1">
              <div className="text-3xl font-bold text-white">
                ${currentPrice.toLocaleString()}
              </div>
              <div className={`text-lg font-semibold ${percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {percentage >= 0 ? '+' : ''}{percentage.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
              </div>
            </div>
            <div className="text-sm text-zinc-400">
              {selectedTimeframe} Performance
            </div>
          </div>

          {/* Chart - Maximized height for mobile */}
          <div className="flex-1 bg-black px-1 py-0">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-zinc-400">Loading...</div>
              </div>
            ) : (
              <div className="relative h-full">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 800 600"
                  className="overflow-visible"
                >
                  {/* Minimal grid for mobile */}
                  <defs>
                    <pattern id="mobileGrid" width="100" height="60" patternUnits="userSpaceOnUse">
                      <path d="M 100 0 L 0 0 0 60" fill="none" stroke="rgb(63 63 70)" strokeWidth="0.3" opacity="0.15"/>
                    </pattern>
                    <linearGradient id="mobilePriceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: 'rgb(249 115 22)', stopOpacity: 0.4 }} />
                      <stop offset="100%" style={{ stopColor: 'rgb(249 115 22)', stopOpacity: 0.02 }} />
                    </linearGradient>
                  </defs>
                  <rect width="800" height="600" fill="url(#mobileGrid)" />
                  
                  {/* Area under the curve */}
                  <path
                    d={createMobilePath() + ' L 780,580 L 20,580 Z'}
                    fill="url(#mobilePriceGradient)"
                  />
                  
                  {/* Price line - thicker for mobile */}
                  <path
                    d={createMobilePath()}
                    fill="none"
                    stroke="rgb(249 115 22)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Chart title overlay */}
                  <text x="400" y="50" fill="rgb(161 161 170)" fontSize="20" textAnchor="middle" fontWeight="500" fontStyle="italic">
                    "When in doubt, zoom out"
                  </text>
                  
                  {/* Price labels - mobile optimized */}
                  {priceData.length > 0 && (
                    <>
                      <text x="30" y="80" fill="rgb(161 161 170)" fontSize="14" textAnchor="start">
                        {formatPrice(Math.max(...priceData.map(p => p.price)))}
                      </text>
                      <text x="30" y="570" fill="rgb(161 161 170)" fontSize="14" textAnchor="start">
                        {formatPrice(Math.min(...priceData.map(p => p.price)))}
                      </text>
                    </>
                  )}
                </svg>
              </div>
            )}
          </div>

          {/* Timeframe Selection - Robinhood style */}
          <div className="px-4 py-2 border-t border-zinc-800/50">
            <div className="flex justify-center space-x-1">
              {timeframes.map((timeframe) => (
                <Button
                  key={timeframe.key}
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTimeframe(timeframe.key)}
                  className={`${
                    selectedTimeframe === timeframe.key
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  } px-4 py-2 text-sm font-medium min-w-0 flex-1`}
                >
                  {timeframe.key}
                </Button>
              ))}
            </div>
          </div>

          {/* Stats - Clean footer */}
          <div className="px-4 py-3 border-t border-zinc-800/50 bg-zinc-900/30">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-xs text-zinc-400 mb-1">Period Start</div>
                <div className="text-sm font-semibold text-white">
                  {priceData.length > 0 ? formatPrice(priceData[0].price) : '-'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-zinc-400 mb-1">All-Time High</div>
                <div className="text-sm font-semibold text-green-400">
                  {priceData.length > 0 ? formatPrice(Math.max(...priceData.map(p => p.price))) : '-'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}