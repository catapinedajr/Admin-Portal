import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, TrendingUp, Award, ChevronRight } from "@/lib/icons";
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
                <Coins className="w-5 h-5 text-orange-500" />
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
                <Coins className="w-5 h-5 text-orange-500" />
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
    <Card className="w-full cursor-pointer hover:bg-zinc-800/50 transition-colors" onClick={handleCardClick}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Coins className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-white">
                  {formatSats(walletData.totalSatoshisEarned)} sats
                </span>
                <span className="text-xs text-gray-500">
                  = {formatBTC(walletData.totalSatoshisEarned)} BTC
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>${formatUsd(walletData.totalUsdValue)}</span>
                {todaysEarnings > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-green-500">+{formatSats(todaysEarnings)} today</span>
                    </div>
                  </>
                )}
                {walletData.achievements.length > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Award className="w-3 h-3 text-yellow-500" />
                      <span className="text-yellow-500">{walletData.achievements.length}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </div>
      </CardContent>
    </Card>
  );
}