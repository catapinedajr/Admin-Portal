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
    <div className="flex items-center gap-4 text-sm">
      {/* Current Price */}
      <div className="flex items-center gap-2">
        <span className="text-orange-500 font-semibold">₿</span>
        <span className="text-white font-bold">
          ${priceData.price.toLocaleString()}
        </span>
        <span className={`text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{priceData.change24h.toFixed(1)}%
        </span>
      </div>

      {/* Satoshi Value */}
      <div className="text-zinc-400">
        <span className="text-xs">1 sat = </span>
        <span className="text-white font-mono">${satoshiValue}</span>
      </div>

      {/* Historical Performance */}
      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-green-400" />
          <span className="text-green-400 font-medium">
            +{priceData.performance.oneYear}% 1yr
          </span>
        </div>
        <div className="text-zinc-500">|</div>
        <div className="text-green-400 font-medium">
          +{priceData.performance.fourYear}% 4yr
        </div>
        <div className="text-zinc-500">|</div>
        <div className="text-green-400 font-medium">
          +{priceData.performance.tenYear}% 10yr
        </div>
      </div>
    </div>
  );
}