import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Coins, 
  TrendingUp, 
  Award, 
  Calendar, 
  Clock, 
  Target, 
  Info,
  ArrowLeft,
  Star,
  CheckCircle,
  Trophy,
  Zap,
  Crown,
  Gem
} from "@/lib/icons";
import { useLocation } from "wouter";
import BottomNavigation from "@/components/BottomNavigation";
import BitcoinPriceDisplay from "@/components/BitcoinPriceDisplay";
import { useSubscription } from "@/contexts/SubscriptionContext";

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

export default function WalletPage() {
  const [, setLocation] = useLocation();
  const [showSatsEducation, setShowSatsEducation] = useState(false);
  const { isPremiumTier, setShowEmailModal } = useSubscription();

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'first_sats':
        return <Star className="w-4 h-4 text-yellow-500" />;
      case 'streak':
        return <Zap className="w-4 h-4 text-blue-500" />;
      case 'milestone':
        return <Trophy className="w-4 h-4 text-purple-500" />;
      default:
        return <Award className="w-4 h-4 text-orange-500" />;
    }
  };

  const getEarningTypeDisplay = (type: string) => {
    switch (type) {
      case 'quiz_correct':
        return 'Quiz Answer';
      case 'lesson_complete':
        return 'Lesson Complete';
      case 'streak_bonus':
        return 'Streak Bonus';
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900">
        {/* Header */}
        <header className="border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-lg sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div 
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setLocation('/')}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-sm">
                    HL
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">HODLearn</h1>
                    <p className="text-xs text-zinc-400">How-to-learn BTC</p>
                  </div>
                </div>
              </div>

              {/* Bitcoin Price Display */}
              <div className="hidden md:block">
                <BitcoinPriceDisplay />
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-2">
                {/* Wallet Button */}
                <Button 
                  onClick={() => setLocation('/wallet')}
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white border border-orange-500 hover:border-orange-600 px-2.5 py-1.5"
                  title="Bitcoin Learning Wallet"
                >
                  <Coins className="w-4 h-4" />
                  <span className="sr-only">Wallet</span>
                </Button>

                {/* Premium Status Indicator */}
                {isPremiumTier ? (
                  <div className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500 px-2.5 py-1.5 font-medium rounded flex items-center">
                    <Gem className="w-4 h-4" />
                    <span className="sr-only">Premium</span>
                  </div>
                ) : (
                  <Button 
                    onClick={() => setShowEmailModal(true)}
                    size="sm"
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5"
                    title="Upgrade to Premium"
                  >
                    <Crown className="w-4 h-4" />
                    <span className="sr-only">Upgrade</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Bitcoin Price Display */}
        <div className="md:hidden bg-zinc-800/50 border-b border-zinc-700/50">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <BitcoinPriceDisplay />
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-4 py-6 pb-24">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/')}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-xl font-semibold">Bitcoin Learning Wallet</h1>
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-8 bg-gray-600 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2"></div>
                    <div className="h-4 bg-gray-700 rounded animate-pulse w-1/3"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <BottomNavigation 
          activeSection="home"
          onSectionChange={(section) => {
            if (section === 'home') setLocation('/');
            else if (section === 'learn') setLocation('/learn');
            else if (section === 'money') setLocation('/money');
            else if (section === 'simulators') setLocation('/simulators');
            else if (section === 'community') setLocation('/community');
            else if (section === 'more') setLocation('/more');
          }}
        />
      </div>
    );
  }

  if (!walletData) {
    return (
      <div className="min-h-screen bg-zinc-900">
        {/* Header */}
        <header className="border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-lg sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div 
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setLocation('/')}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-sm">
                    HL
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">HODLearn</h1>
                    <p className="text-xs text-zinc-400">How-to-learn BTC</p>
                  </div>
                </div>
              </div>

              {/* Bitcoin Price Display */}
              <div className="hidden md:block">
                <BitcoinPriceDisplay />
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-2">
                {/* Wallet Button */}
                <Button 
                  onClick={() => setLocation('/wallet')}
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white border border-orange-500 hover:border-orange-600 px-2.5 py-1.5"
                  title="Bitcoin Learning Wallet"
                >
                  <Coins className="w-4 h-4" />
                  <span className="sr-only">Wallet</span>
                </Button>

                {/* Premium Status Indicator */}
                {isPremiumTier ? (
                  <div className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500 px-2.5 py-1.5 font-medium rounded flex items-center">
                    <Gem className="w-4 h-4" />
                    <span className="sr-only">Premium</span>
                  </div>
                ) : (
                  <Button 
                    onClick={() => setShowEmailModal(true)}
                    size="sm"
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5"
                    title="Upgrade to Premium"
                  >
                    <Crown className="w-4 h-4" />
                    <span className="sr-only">Upgrade</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Bitcoin Price Display */}
        <div className="md:hidden bg-zinc-800/50 border-b border-zinc-700/50">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <BitcoinPriceDisplay />
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-4 py-6 pb-24">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/')}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-xl font-semibold">Bitcoin Learning Wallet</h1>
            </div>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-orange-500/20 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Coins className="w-8 h-8 text-orange-500" />
                </div>
                <h2 className="text-lg font-semibold mb-2">Start Your Bitcoin Journey</h2>
                <p className="text-gray-400 mb-4">
                  Complete lessons and answer quiz questions to earn satoshis and track your progress.
                </p>
                <Button onClick={() => setLocation('/learn')} className="bg-orange-500 hover:bg-orange-600">
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>

        <BottomNavigation 
          activeSection="home"
          onSectionChange={(section) => {
            if (section === 'home') setLocation('/');
            else if (section === 'learn') setLocation('/learn');
            else if (section === 'money') setLocation('/money');
            else if (section === 'simulators') setLocation('/simulators');
            else if (section === 'community') setLocation('/community');
            else if (section === 'more') setLocation('/more');
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setLocation('/')}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-sm">
                  HL
                </div>
                <div>
                  <h1 className="text-xl font-bold">HODLearn</h1>
                  <p className="text-xs text-zinc-400">How-to-learn BTC</p>
                </div>
              </div>
            </div>

            {/* Bitcoin Price Display */}
            <div className="hidden md:block">
              <BitcoinPriceDisplay />
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              {/* Wallet Button */}
              <Button 
                onClick={() => setLocation('/wallet')}
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white border border-orange-500 hover:border-orange-600 px-2.5 py-1.5"
                title="Bitcoin Learning Wallet"
              >
                <Coins className="w-4 h-4" />
                <span className="sr-only">Wallet</span>
              </Button>

              {/* Premium Status Indicator */}
              {isPremiumTier ? (
                <div className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500 px-2.5 py-1.5 font-medium rounded flex items-center">
                  <Gem className="w-4 h-4" />
                  <span className="sr-only">Premium</span>
                </div>
              ) : (
                <Button 
                  onClick={() => setShowEmailModal(true)}
                  size="sm"
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5"
                  title="Upgrade to Premium"
                >
                  <Crown className="w-4 h-4" />
                  <span className="sr-only">Upgrade</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bitcoin Price Display */}
      <div className="md:hidden bg-zinc-800/50 border-b border-zinc-700/50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <BitcoinPriceDisplay />
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6 pb-24">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/')}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-semibold">Bitcoin Learning Wallet</h1>
          </div>

      {/* Balance Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="p-4 bg-orange-500/20 rounded-lg w-16 h-16 mx-auto flex items-center justify-center">
              <Coins className="w-8 h-8 text-orange-500" />
            </div>
            
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">
                {formatSats(walletData.totalSatoshisEarned)} sats
              </div>
              <div className="text-lg text-gray-300">
                = {formatBTC(walletData.totalSatoshisEarned)} BTC
              </div>
              <div className="text-sm text-gray-400">
                ≈ ${formatUsd(walletData.totalUsdValue)} USD
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSatsEducation(!showSatsEducation)}
              className="text-xs gap-1"
            >
              <Info className="w-3 h-3" />
              Why think in sats?
            </Button>

            {showSatsEducation && (
              <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg text-left">
                <h3 className="font-semibold mb-2">Understanding Bitcoin Units</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>• 1 Bitcoin = 100,000,000 satoshis (sats)</p>
                  <p>• Satoshis are Bitcoin's smallest unit</p>
                  <p>• Like cents to dollars, sats to Bitcoin</p>
                  <p>• As Bitcoin grows, thinking in sats becomes natural</p>
                  <p>• Your {formatSats(walletData.totalSatoshisEarned)} sats = {formatBTC(walletData.totalSatoshisEarned)} BTC</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">This Week</span>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold">
                {formatSats(walletData.weeklyEarnings)} sats
              </div>
              <div className="text-xs text-gray-400">
                = {formatBTC(walletData.weeklyEarnings)} BTC
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">This Month</span>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold">
                {formatSats(walletData.monthlyEarnings)} sats
              </div>
              <div className="text-xs text-gray-400">
                = {formatBTC(walletData.monthlyEarnings)} BTC
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      {walletData.achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {walletData.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    {getAchievementIcon(achievement.achievementType)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{achievement.title}</div>
                    <div className="text-xs text-gray-400">{achievement.description}</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(achievement.unlockedAt)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {walletData.recentEarnings.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Target className="w-8 h-8 mx-auto mb-2" />
              <p>No earnings yet</p>
              <p className="text-sm">Complete lessons to start earning satoshis</p>
            </div>
          ) : (
            <div className="space-y-3">
              {walletData.recentEarnings.slice(0, 10).map((earning, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{getEarningTypeDisplay(earning.earningType)}</div>
                      <div className="text-xs text-gray-400">{earning.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-500">
                      +{formatSats(earning.satoshisEarned)} sats
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatDate(earning.earnedAt)} • {formatTime(earning.earnedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bitcoin Price Context */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Current Bitcoin Price</div>
              <div className="text-lg font-semibold">
                ${walletData.currentBitcoinPrice.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Your sats at current price</div>
              <div className="text-lg font-semibold text-orange-500">
                ${formatUsd(walletData.totalUsdValue)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

          {/* Call to Action */}
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Keep Learning, Keep Earning</h3>
              <p className="text-gray-400 mb-4 text-sm">
                Complete daily lessons and quizzes to earn more satoshis and build your Bitcoin knowledge.
              </p>
              <Button onClick={() => setLocation('/learn')} className="bg-orange-500 hover:bg-orange-600">
                Continue Learning
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNavigation 
        activeSection="home"
        onSectionChange={(section) => {
          if (section === 'home') setLocation('/');
          else if (section === 'learn') setLocation('/learn');
          else if (section === 'money') setLocation('/money');
          else if (section === 'simulators') setLocation('/simulators');
          else if (section === 'community') setLocation('/community');
          else if (section === 'more') setLocation('/more');
        }}
      />
    </div>
  );
}