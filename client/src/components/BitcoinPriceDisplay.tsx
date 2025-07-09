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
    <div className="text-center space-y-3">
      {/* First Row: BTC Price and Satoshi Value */}
      <div className="flex items-center justify-center gap-6">
        {/* Current Price */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">₿</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-xl">
              ${priceData.price.toLocaleString()}
            </span>
            <span className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{priceData.change24h.toFixed(1)}% today
            </span>
          </div>
        </div>

        {/* Satoshi Value */}
        <div className="flex flex-col items-center bg-zinc-800/50 rounded-lg px-4 py-2 border border-zinc-700">
          <span className="text-zinc-400 text-xs uppercase tracking-wide">1 Satoshi</span>
          <span className="text-white font-mono font-bold text-lg">${satoshiValue}</span>
        </div>
      </div>

      {/* Second Row: Historical Performance with Animations */}
      <div className="flex items-center justify-center gap-4">
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-lg px-4 py-2 hover:bg-green-500/30 transition-all duration-300 cursor-pointer">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400 animate-pulse" />
            <div className="text-center">
              <div className="text-green-400 font-bold text-lg">+{priceData.performance.oneYear.toLocaleString()}%</div>
              <div className="text-zinc-400 text-xs">1 year</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-lg px-4 py-2 hover:bg-green-500/30 transition-all duration-300 cursor-pointer">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400 animate-pulse" />
            <div className="text-center">
              <div className="text-green-400 font-bold text-lg">+{priceData.performance.fourYear.toLocaleString()}%</div>
              <div className="text-zinc-400 text-xs">4 years</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-lg px-4 py-2 hover:bg-green-500/30 transition-all duration-300 cursor-pointer">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400 animate-pulse" />
            <div className="text-center">
              <div className="text-green-400 font-bold text-xl">+{priceData.performance.tenYear.toLocaleString()}%</div>
              <div className="text-zinc-400 text-xs">10 years</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}