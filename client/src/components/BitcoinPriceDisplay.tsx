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
    <div className="flex items-center gap-3">
      {/* Bitcoin Icon */}
      <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-sm">₿</span>
      </div>
      
      {/* Price and Change */}
      <div className="flex flex-col">
        <span className="text-white font-bold text-lg">
          ${priceData.price.toLocaleString()}
        </span>
        <span className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{priceData.change24h.toFixed(1)}% today
        </span>
      </div>
    </div>
  );
}