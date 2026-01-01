import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, Award, Zap } from 'lucide-react';

interface WalletData {
  totalSatoshisEarned: number;
  totalUsdValue: number;
  currentBitcoinPrice: number;
  currentStreakMultiplier: number;
  lastEarningDate: string;
  recentEarnings: WalletEarning[];
  achievements: WalletAchievement[];
  weeklyEarnings: number;
  monthlyEarnings: number;
}

interface WalletEarning {
  id: number;
  dayIndex: number;
  earningType: string;
  satoshisEarned: number;
  description: string;
  earnedAt: string;
}

interface WalletAchievement {
  id: number;
  achievementType: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt: string;
}

export default function WalletDisplay() {
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Use wallet dashboard endpoint directly (demo mode)
  const { data: walletData, isLoading, error } = useQuery<WalletData>({
    queryKey: ['/api/wallet/dashboard'],
    retry: false,
    refetchOnWindowFocus: false,
  });

  const earnSatsMutation = useMutation({
    mutationFn: (earningData: {
      dayIndex: number;
      earningType: string;
      satoshisEarned: number;
      description: string;
      date: string;
    }) => apiRequest('/api/wallet/earn', {
      method: 'POST',
      body: JSON.stringify(earningData),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/dashboard'] });
    },
  });

  const handleTestEarning = () => {
    const today = new Date().toISOString().split('T')[0];
    earnSatsMutation.mutate({
      dayIndex: 1,
      earningType: 'quiz_correct',
      satoshisEarned: 100,
      description: 'Test earning from quiz',
      date: today,
    });
  };



  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-orange-500" />
            HODLearn Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-orange-500" />
            HODLearn Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-red-500">
            Error loading wallet data
          </p>
          <Button 
            onClick={handleTestEarning}
            className="w-full mt-4"
            disabled={earnSatsMutation.isPending}
          >
            Test Earning +100 points
          </Button>
        </CardContent>
      </Card>
    );
  }

  const formatSats = (sats: number) => {
    return sats.toLocaleString();
  };

  const formatUsd = (usd: number) => {
    return usd.toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Main Wallet Balance */}
      <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-6 h-6" />
            HODLearn Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-3xl font-bold">
                {formatSats(walletData?.totalSatoshisEarned || 0)} points
              </div>
              <div className="text-orange-100">
                ≈ ${formatUsd(walletData?.totalUsdValue || 0)} USD
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                BTC: ${walletData?.currentBitcoinPrice.toLocaleString()}
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                {walletData?.currentStreakMultiplier}x multiplier
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earning Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {formatSats(walletData?.weeklyEarnings || 0)}
            </div>
            <div className="text-sm text-muted-foreground">points earned</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {formatSats(walletData?.monthlyEarnings || 0)}
            </div>
            <div className="text-sm text-muted-foreground">points earned</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Earnings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {walletData?.recentEarnings?.length ? (
              walletData.recentEarnings.map((earning) => (
                <div key={earning.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">+{formatSats(earning.satoshisEarned)} points</div>
                    <div className="text-sm text-muted-foreground">
                      {earning.description || earning.earningType}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      Day {earning.dayIndex}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(earning.earnedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-4">
                No earnings yet. Complete quizzes to earn points!
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {walletData?.achievements?.length ? (
              walletData.achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{achievement.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {achievement.description}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-4">
                No achievements yet. Keep learning to unlock rewards!
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Button */}
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="pt-6">
          <Button 
            onClick={handleTestEarning}
            className="w-full"
            disabled={earnSatsMutation.isPending}
          >
            {earnSatsMutation.isPending ? 'Earning...' : 'Test Earning +100 points'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}