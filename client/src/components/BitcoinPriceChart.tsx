import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, TrendingUp } from "@/lib/icons";

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

  // Historical Bitcoin price data (major milestones)
  const historicalData: Record<string, PricePoint[]> = {
    'ALL': [
      { date: '2009-01', price: 0.001 },
      { date: '2010-05', price: 0.01 },
      { date: '2011-06', price: 31 },
      { date: '2012-01', price: 5 },
      { date: '2013-11', price: 1200 },
      { date: '2014-12', price: 315 },
      { date: '2017-12', price: 19783 },
      { date: '2018-12', price: 3200 },
      { date: '2020-03', price: 5000 },
      { date: '2021-11', price: 69000 },
      { date: '2022-12', price: 16500 },
      { date: '2023-12', price: 42000 },
      { date: '2024-03', price: 73000 },
      { date: '2025-01', price: currentPrice }
    ],
    '10Y': [
      { date: '2015-01', price: 315 },
      { date: '2016-01', price: 430 },
      { date: '2017-01', price: 1000 },
      { date: '2017-12', price: 19783 },
      { date: '2018-12', price: 3200 },
      { date: '2019-12', price: 7200 },
      { date: '2020-03', price: 5000 },
      { date: '2020-12', price: 29000 },
      { date: '2021-11', price: 69000 },
      { date: '2022-12', price: 16500 },
      { date: '2023-12', price: 42000 },
      { date: '2024-03', price: 73000 },
      { date: '2025-01', price: currentPrice }
    ],
    '4Y': [
      { date: '2021-01', price: 30000 },
      { date: '2021-04', price: 64000 },
      { date: '2021-11', price: 69000 },
      { date: '2022-06', price: 20000 },
      { date: '2022-12', price: 16500 },
      { date: '2023-06', price: 30000 },
      { date: '2023-12', price: 42000 },
      { date: '2024-03', price: 73000 },
      { date: '2024-09', price: 60000 },
      { date: '2025-01', price: currentPrice }
    ],
    '1Y': [
      { date: '2024-01', price: 42000 },
      { date: '2024-02', price: 50000 },
      { date: '2024-03', price: 73000 },
      { date: '2024-04', price: 65000 },
      { date: '2024-05', price: 68000 },
      { date: '2024-06', price: 62000 },
      { date: '2024-07', price: 66000 },
      { date: '2024-08', price: 58000 },
      { date: '2024-09', price: 60000 },
      { date: '2024-10', price: 68000 },
      { date: '2024-11', price: 95000 },
      { date: '2024-12', price: 98000 },
      { date: '2025-01', price: currentPrice }
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
    
    const width = 800;
    const height = 300;
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
      <DialogContent className="max-w-4xl bg-zinc-900 border-zinc-700">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold text-white flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-orange-500" />
            <span>Bitcoin Price History</span>
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Price and Performance */}
          <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white">
                  ${currentPrice.toLocaleString()}
                </div>
                <div className="text-sm text-zinc-400">Current Price</div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {percentage >= 0 ? '+' : ''}{percentage.toFixed(1)}%
                </div>
                <div className="text-sm text-zinc-400">
                  {selectedTimeframe} Performance
                </div>
              </div>
            </div>
          </div>

          {/* Timeframe Selection */}
          <div className="flex space-x-2">
            {timeframes.map((timeframe) => (
              <Button
                key={timeframe.key}
                variant={selectedTimeframe === timeframe.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe.key)}
                className={`${
                  selectedTimeframe === timeframe.key
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-zinc-800 border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                {timeframe.label}
              </Button>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-zinc-800/30 rounded-xl p-6 border border-zinc-700">
            {isLoading ? (
              <div className="h-80 flex items-center justify-center">
                <div className="text-zinc-400">Loading chart data...</div>
              </div>
            ) : (
              <div className="relative">
                <svg
                  width="100%"
                  height="320"
                  viewBox="0 0 800 320"
                  className="overflow-visible"
                >
                  {/* Grid lines */}
                  <defs>
                    <pattern id="grid" width="80" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 80 0 L 0 0 0 40" fill="none" stroke="rgb(63 63 70)" strokeWidth="0.5" opacity="0.3"/>
                    </pattern>
                  </defs>
                  <rect width="800" height="320" fill="url(#grid)" />
                  
                  {/* Price line */}
                  <path
                    d={createPath()}
                    fill="none"
                    stroke="rgb(249 115 22)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Data points */}
                  {priceData.map((point, index) => {
                    const width = 800;
                    const height = 300;
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
                        r="4"
                        fill="rgb(249 115 22)"
                        className="hover:r-6 transition-all cursor-pointer"
                      >
                        <title>{point.date}: ${point.price.toLocaleString()}</title>
                      </circle>
                    );
                  })}
                  
                  {/* Price labels */}
                  {priceData.length > 0 && (
                    <>
                      <text x="40" y="50" fill="rgb(161 161 170)" fontSize="12" textAnchor="start">
                        {formatPrice(Math.max(...priceData.map(p => p.price)))}
                      </text>
                      <text x="40" y="280" fill="rgb(161 161 170)" fontSize="12" textAnchor="start">
                        {formatPrice(Math.min(...priceData.map(p => p.price)))}
                      </text>
                    </>
                  )}
                </svg>
              </div>
            )}
          </div>

          {/* Key Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
              <div className="text-sm text-zinc-400">Period Start</div>
              <div className="text-lg font-bold text-white">
                {priceData.length > 0 ? formatPrice(priceData[0].price) : '-'}
              </div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
              <div className="text-sm text-zinc-400">Period End</div>
              <div className="text-lg font-bold text-white">
                {priceData.length > 0 ? formatPrice(priceData[priceData.length - 1].price) : '-'}
              </div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
              <div className="text-sm text-zinc-400">Highest</div>
              <div className="text-lg font-bold text-white">
                {priceData.length > 0 ? formatPrice(Math.max(...priceData.map(p => p.price))) : '-'}
              </div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
              <div className="text-sm text-zinc-400">Lowest</div>
              <div className="text-lg font-bold text-white">
                {priceData.length > 0 ? formatPrice(Math.min(...priceData.map(p => p.price))) : '-'}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}