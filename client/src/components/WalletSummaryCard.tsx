import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp, Award, ChevronRight, Zap, Star, Info } from "@/lib/icons";
import { useLocation } from "wouter";

interface WalletData {
  totalSatoshisEarned: number;
  totalUsdValue: number;
  currentBitcoinPrice: number;
  currentStreakMultiplier: number;
  lastEarningDate: string;
  recentEarnings: any[];
  achievements: any[];
  weeklyEarnings: number;
  monthlyEarnings: number;
}

export default function WalletSummaryCard() {
  const [, setLocation] = useLocation();

  // Get wallet data (demo mode)
  const { data: walletData, isLoading } = useQuery<WalletData>({
    queryKey: ['/api/wallet/dashboard'],
    retry: false,
    refetchOnWindowFocus: false,
  });

  const formatSats = (sats: number) => {
    return sats.toLocaleString();
  };

  const formatBTC = (sats: number) => {
    return (sats / 100000000).toFixed(8);
  };

  const formatUsd = (usd: number) => {
    return usd.toFixed(2);
  };

  const getTodaysEarnings = () => {
    if (!walletData?.recentEarnings) return 0;
    const today = new Date().toISOString().split('T')[0];
    return walletData.recentEarnings
      .filter(earning => earning.date === today)
      .reduce((sum, earning) => sum + earning.satoshisEarned, 0);
  };

  const handleCardClick = () => {
    setLocation('/wallet');
  };

  if (isLoading) {
    return (
      <Card className="w-full cursor-pointer hover:bg-zinc-800/50 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Wallet className="w-5 h-5 text-orange-500" />
              </div>
              <div className="space-y-1">
                <div className="h-4 bg-gray-600 rounded animate-pulse w-24"></div>
                <div className="h-3 bg-gray-700 rounded animate-pulse w-16"></div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!walletData) {
    return (
      <Card className="w-full cursor-pointer hover:bg-zinc-800/50 transition-colors" onClick={handleCardClick}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Wallet className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-300">Bitcoin Learning Wallet</div>
                <div className="text-xs text-gray-500">Start earning satoshis</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const todaysEarnings = getTodaysEarnings();

  return (
    <Card className="w-full cursor-pointer hover:bg-zinc-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 hover:scale-[1.02] group" onClick={handleCardClick}>
      <CardContent className="p-5">
        <div className="space-y-4">
          {/* Header with animated coin and performance highlight */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-xl border border-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                <Wallet className="w-6 h-6 text-orange-500 group-hover:animate-pulse" />
              </div>
              <div>
                <div className="text-sm font-medium text-orange-400 mb-1">Bitcoin Learning Wallet</div>
                <div className="text-xs text-gray-500">Educational Portfolio</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {walletData.achievements.length > 0 && (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs px-2 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  {walletData.achievements.length}
                </Badge>
              )}
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-orange-400 transition-colors" />
            </div>
          </div>

          {/* Performance metrics with dopamine-driven display */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold text-white">
                    {formatSats(walletData.totalSatoshisEarned)}
                  </span>
                  <span className="text-sm text-orange-400 font-medium">sats</span>
                </div>
                <div className="text-sm text-gray-500">
                  ≈ ${formatUsd(walletData.totalUsdValue)}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {formatBTC(walletData.totalSatoshisEarned)} BTC
              </div>
            </div>
            
            {/* Today's performance boost */}
            {todaysEarnings > 0 && (
              <div className="text-right space-y-1">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-green-500 animate-pulse" />
                  <span className="text-green-400 font-semibold">+{formatSats(todaysEarnings)}</span>
                </div>
                <div className="text-xs text-green-500">earned today</div>
              </div>
            )}
          </div>

          {/* Motivation and progress indicator */}
          <div className="space-y-2 pt-2 border-t border-zinc-700/50">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-400">
                Keep learning to stack more sats
              </div>
              <div className="flex items-center gap-1 text-xs text-orange-400">
                <span>View Details</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>

          </div>
        </div>
      </CardContent>
    </Card>
  );
}