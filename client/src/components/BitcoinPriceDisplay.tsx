import React, { useState, useEffect } from "react";
import { TrendingUp } from "@/lib/icons";

interface BitcoinPriceData {
  price: number;
  change24h: number;
  performance: {
    oneYear: number;
    fourYear: number;
    tenYear: number;
  };
}

export default function BitcoinPriceDisplay() {
  const [priceData, setPriceData] = useState<BitcoinPriceData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBitcoinPrice = async () => {
    try {
      const response = await fetch('/api/bitcoin-price');
      const data = await response.json();
      setPriceData(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch Bitcoin price:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBitcoinPrice();
    
    // Update every 60 seconds
    const interval = setInterval(fetchBitcoinPrice, 60000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading || !priceData) {
    return (
      <div className="flex items-center gap-4 text-zinc-400">
        <div className="animate-pulse">Loading BTC price...</div>
      </div>
    );
  }

  const satoshiValue = (priceData.price / 100000000).toFixed(6);
  const isPositive = priceData.change24h > 0;

  return (
    <div className="flex items-center justify-between w-full max-w-md">
      {/* Bitcoin Icon and Price */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xs">₿</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-sm">
            ${priceData.price.toLocaleString()}
          </span>
          <span className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{priceData.change24h.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Compact Performance Indicators - Using full space */}
      <div className="flex items-center gap-1.5">
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-lg px-2.5 py-1">
          <div className="text-center">
            <div className="text-green-400 font-bold text-[10px]">+{priceData.performance.oneYear.toLocaleString()}%</div>
            <div className="text-zinc-500 text-[8px]">1yr</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-lg px-2.5 py-1">
          <div className="text-center">
            <div className="text-green-400 font-bold text-[10px]">+{priceData.performance.fourYear.toLocaleString()}%</div>
            <div className="text-zinc-500 text-[8px]">4yr</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-lg px-2.5 py-1">
          <div className="text-center">
            <div className="text-green-400 font-bold text-[10px]">+{priceData.performance.tenYear.toLocaleString()}%</div>
            <div className="text-zinc-500 text-[8px]">10yr</div>
          </div>
        </div>
      </div>
    </div>
  );
}