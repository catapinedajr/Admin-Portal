import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp, Award, ChevronRight, Zap, Star, Trophy, ArrowUp, ArrowDown, Minus } from "@/lib/icons";
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

interface LeaderboardPosition {
  rank: number | null;
  totalSatoshis: number;
  percentile: number | null;
  totalParticipants: number;
  periodName: string | null;
  nearbyUsers: {
    rank: number;
    userId: number;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
    totalSatoshis: number;
    isCurrentUser: boolean;
  }[];
}

export default function WalletSummaryCard() {
  const [, setLocation] = useLocation();

  // Get wallet data (demo mode)
  const { data: walletData, isLoading } = useQuery<WalletData>({
    queryKey: ['/api/wallet/dashboard'],
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Get leaderboard position for rivalry strip
  const { data: leaderboardPosition } = useQuery<LeaderboardPosition>({
    queryKey: ['/api/leaderboard/my-position'],
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Find the next rival (person ahead of current user)
  const getNextRival = () => {
    if (!leaderboardPosition?.nearbyUsers || !leaderboardPosition.rank) return null;
    return leaderboardPosition.nearbyUsers.find(
      u => !u.isCurrentUser && u.rank < leaderboardPosition.rank!
    );
  };

  // Calculate sats needed to catch next rival
  const getSatsToNextRival = () => {
    const rival = getNextRival();
    if (!rival || !leaderboardPosition) return null;
    return rival.totalSatoshis - leaderboardPosition.totalSatoshis;
  };

  const handleRivalryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocation('/community?tab=leaderboard');
  };

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
      <Card className="w-full cursor-pointer bg-black hover:bg-zinc-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 hover:scale-[1.02] group border border-zinc-700/50 hover:border-orange-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-xl border border-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                <Wallet className="w-5 h-5 text-orange-500 group-hover:animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="h-4 bg-gray-600 rounded animate-pulse w-24"></div>
                <div className="h-3 bg-gray-700 rounded animate-pulse w-16"></div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-orange-400 transition-colors" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!walletData) {
    return (
      <Card className="w-full cursor-pointer bg-black hover:bg-zinc-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 hover:scale-[1.02] group border border-zinc-700/50 hover:border-orange-500/30" onClick={handleCardClick}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-xl border border-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                <Wallet className="w-6 h-6 text-orange-500 group-hover:animate-pulse" />
              </div>
              <div>
                <div className="text-sm font-medium text-orange-400">HODLearn Points</div>
                <div className="text-xs text-gray-500">Start earning points</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-orange-400 transition-colors" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const todaysEarnings = getTodaysEarnings();

  const nextRival = getNextRival();
  const satsToRival = getSatsToNextRival();

  return (
    <Card className="w-full cursor-pointer bg-black hover:bg-zinc-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 hover:scale-[1.02] group border border-zinc-700/50 hover:border-orange-500/30 overflow-hidden" onClick={handleCardClick}>
      {/* Rivalry Strip - Competitive leaderboard teaser */}
      {leaderboardPosition?.rank && (
        <div 
          className="bg-gradient-to-r from-orange-500/20 via-amber-500/15 to-orange-500/20 border-b border-orange-500/30 px-4 py-2 hover:from-orange-500/30 hover:via-amber-500/25 hover:to-orange-500/30 transition-all cursor-pointer"
          onClick={handleRivalryClick}
        >
          <div className="flex items-center justify-between">
            {/* Rank display */}
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-semibold text-white">
                #{leaderboardPosition.rank}
              </span>
              {leaderboardPosition.percentile && leaderboardPosition.percentile <= 10 && (
                <Badge className="bg-orange-500/30 text-orange-300 border-orange-500/40 text-xs px-1.5 py-0">
                  Top {leaderboardPosition.percentile}%
                </Badge>
              )}
            </div>

            {/* Next rival info */}
            {nextRival && satsToRival !== null && (
              <div className="flex items-center gap-2 text-xs">
                {nextRival.avatarUrl ? (
                  <img 
                    src={nextRival.avatarUrl} 
                    alt="" 
                    className="w-5 h-5 rounded-full border border-orange-500/40"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-zinc-700 border border-orange-500/40 flex items-center justify-center text-xs text-zinc-400">
                    {(nextRival.displayName || nextRival.username).charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-zinc-400">
                  <span className="text-orange-300 font-medium">{satsToRival.toLocaleString()}</span> to catch #{nextRival.rank}
                </span>
              </div>
            )}

            {/* Fallback: show total participants */}
            {!nextRival && leaderboardPosition.rank === 1 && (
              <div className="flex items-center gap-1 text-xs text-orange-300">
                <Star className="w-3 h-3" />
                <span>Leading!</span>
              </div>
            )}

            <ChevronRight className="w-4 h-4 text-orange-400/60" />
          </div>
        </div>
      )}

      <CardContent className="p-5">
        <div className="space-y-4">
          {/* Header with animated coin and performance highlight */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-xl border border-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                <Wallet className="w-6 h-6 text-orange-500 group-hover:animate-pulse" />
              </div>
              <div>
                <div className="text-sm font-medium text-orange-400 mb-1">HODLearn Points</div>
                <div className="text-xs text-gray-500">1 point = 1 satoshi (pegged to BTC)</div>
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
                  <span className="text-sm text-orange-400 font-medium">points</span>
                </div>
                <div className="text-sm text-gray-500">
                  ≈ ${formatUsd(walletData.totalUsdValue)}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                = {formatBTC(walletData.totalSatoshisEarned)} BTC equivalent
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
                Educational rewards for tracking your progress
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