import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Coins, 
  Wallet,
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
  Gem,
  User as UserIcon,
  BookOpen,
  Users,
  Brain,
  Flame,
  Gift,
  MessageSquare
} from "@/lib/icons";
import { ReferralStatsCompact } from "@/components/InviteFriendsCard";
import { useLocation } from "wouter";
import BottomNavigation from "@/components/BottomNavigation";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { PWAInstallButton } from "@/components/PWAInstallButton";

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
  const [location, setLocation] = useLocation();
  const [showSatsEducation, setShowSatsEducation] = useState(false);
  const [activeTab, setActiveTab] = useState<'wallet' | 'rewards'>('wallet');
  const { isPremiumTier, setShowEmailModal } = useSubscription();

  // Check URL and URL parameters for tab selection
  useEffect(() => {
    // Check if we're on the rewards route
    if (location.includes('/wallet/rewards')) {
      setActiveTab('rewards');
    } else {
      // Check URL parameters for tab selection
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam === 'rewards') {
        setActiveTab('rewards');
      }
    }
  }, [location]);

  // Get wallet data (demo mode)
  const { data: walletData, isLoading } = useQuery<WalletData>({
    queryKey: ['/api/wallet/dashboard'],
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Get leaderboard position
  const { data: leaderboardPosition } = useQuery<{ rank: number | null; totalSatoshis: number; periodName: string }>({
    queryKey: ['/api/leaderboard/my-position'],
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Get reward configuration for display
  const { data: rewardConfig } = useQuery<Record<string, { satoshis: number; description: string; dailyLimit: number | null }>>({
    queryKey: ['/api/rewards/config'],
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Helper to get reward amount from config with fallback
  const getRewardAmount = (type: string, fallback: number) => {
    return rewardConfig?.[type]?.satoshis ?? fallback;
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
      case 'quiz_perfect':
        return 'Perfect Quiz';
      case 'lesson_complete':
        return 'Lesson Complete';
      case 'daily_complete':
        return 'Daily Complete';
      case 'streak_bonus':
        return 'Streak Bonus';
      case 'streak_7':
        return '7-Day Streak';
      case 'streak_30':
        return '30-Day Streak';
      case 'streak_100':
        return '100-Day Streak';
      case 'streak_365':
        return '365-Day Streak';
      case 'referral_signup':
        return 'Referral Signup';
      case 'referral_verified':
        return 'Referral Verified';
      case 'referral_active':
        return 'Referral Active';
      case 'forum_post':
        return 'Forum Post';
      case 'forum_upvote':
        return 'Upvote Received';
      case 'admin_bonus':
        return 'Bonus Reward';
      case 'leaderboard_prize':
        return 'Leaderboard Prize';
      default:
        return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
  };

  const getEarningTypeIcon = (type: string) => {
    if (type.startsWith('quiz')) {
      return <CheckCircle className="w-4 h-4 text-blue-500" />;
    }
    if (type.startsWith('streak') || type === 'daily_complete') {
      return <Zap className="w-4 h-4 text-orange-500" />;
    }
    if (type.startsWith('referral')) {
      return <Users className="w-4 h-4 text-green-500" />;
    }
    if (type.startsWith('forum')) {
      return <MessageSquare className="w-4 h-4 text-purple-500" />;
    }
    if (type === 'admin_bonus') {
      return <Gift className="w-4 h-4 text-yellow-500" />;
    }
    if (type === 'leaderboard_prize') {
      return <Trophy className="w-4 h-4 text-orange-500" />;
    }
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const getEarningTypeBgColor = (type: string) => {
    if (type.startsWith('quiz')) return 'bg-blue-500/20';
    if (type.startsWith('streak') || type === 'daily_complete') return 'bg-orange-500/20';
    if (type.startsWith('referral')) return 'bg-green-500/20';
    if (type.startsWith('forum')) return 'bg-purple-500/20';
    if (type === 'admin_bonus') return 'bg-yellow-500/20';
    if (type === 'leaderboard_prize') return 'bg-orange-500/20';
    return 'bg-green-500/20';
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
                    <h1 className="text-xl font-bold">HODLearn™</h1>
                    <p className="text-xs text-zinc-400">How-to-Learn BTC</p>
                  </div>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-2">
                {/* PWA Install Button */}
                <PWAInstallButton />
                
                {/* Wallet Button */}
                <Button 
                  onClick={() => setLocation('/wallet')}
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white border border-orange-500 hover:border-orange-600 px-2.5 py-1.5"
                  title="HODLearn Points"
                >
                  <Coins className="w-4 h-4" />
                  <span className="sr-only">Wallet</span>
                </Button>

                {/* Account Button */}
                <Button 
                  onClick={() => setLocation('/account')}
                  size="sm"
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5"
                  title="Account Settings"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="sr-only">Account</span>
                </Button>
              </div>
            </div>
          </div>
        </header>


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
              <h1 className="text-xl font-semibold">HODLearn Points</h1>
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
                    <h1 className="text-xl font-bold">HODLearn™</h1>
                    <p className="text-xs text-zinc-400">How-to-Learn BTC</p>
                  </div>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-2">
                {/* PWA Install Button */}
                <PWAInstallButton />
                
                {/* Wallet Button */}
                <Button 
                  onClick={() => setLocation('/wallet')}
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white border border-orange-500 hover:border-orange-600 px-2.5 py-1.5"
                  title="HODLearn Points"
                >
                  <Coins className="w-4 h-4" />
                  <span className="sr-only">Wallet</span>
                </Button>

                {/* Account Button */}
                <Button 
                  onClick={() => setLocation('/account')}
                  size="sm"
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5"
                  title="Account Settings"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="sr-only">Account</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

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
              <h1 className="text-xl font-semibold">HODLearn Points</h1>
            </div>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-orange-500/20 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Coins className="w-8 h-8 text-orange-500" />
                </div>
                <h2 className="text-lg font-semibold mb-2">Start Your Bitcoin Journey</h2>
                <p className="text-gray-400 mb-4">
                  Complete lessons and answer quiz questions to earn HODLearn Points and track your progress.
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
                  <p className="text-xs text-zinc-400">How-to-Learn BTC</p>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              {/* PWA Install Button */}
              <PWAInstallButton />
              
              {/* Account Button */}
              <Button 
                onClick={() => setLocation('/account')}
                size="sm"
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5"
                title="Account Settings"
              >
                <UserIcon className="w-4 h-4" />
                <span className="sr-only">Account</span>
              </Button>

              {/* Wallet Button */}
              <Button 
                onClick={() => setLocation('/wallet')}
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white border border-orange-500 hover:border-orange-600 px-2.5 py-1.5"
                title="HODLearn Points"
              >
                <Wallet className="w-4 h-4" />
                <span className="sr-only">Wallet</span>
              </Button>


            </div>
          </div>
        </div>
      </header>

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
            <h1 className="text-xl font-semibold">HODLearn Points</h1>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex space-x-1 bg-zinc-800/50 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('wallet')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'wallet'
                  ? 'bg-orange-500 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
              }`}
            >
              <Coins className="w-4 h-4" />
              Balance
            </button>
            <button
              onClick={() => setActiveTab('rewards')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'rewards'
                  ? 'bg-orange-500 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Rewards
            </button>
          </div>

          {/* Conditional Content Based on Active Tab */}
          {activeTab === 'wallet' ? (
            <>
              {/* Balance Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="p-4 bg-orange-500/20 rounded-lg w-16 h-16 mx-auto flex items-center justify-center">
              <Coins className="w-8 h-8 text-orange-500" />
            </div>
            
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">
                {formatSats(walletData.totalSatoshisEarned)} <span className="text-orange-400">points</span>
              </div>
              <div className="text-lg text-gray-300">
                = {formatBTC(walletData.totalSatoshisEarned)} BTC
              </div>
              <div className="text-sm text-gray-400">
                ≈ ${formatUsd(walletData.totalUsdValue)} USD
              </div>
            </div>

            {/* Educational explainer about HODLearn Points */}
            <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <p className="text-xs text-zinc-400 text-center">
                HODLearn Points are pegged to Bitcoin's price so you can learn to think in Bitcoin's native unit.
              </p>
              <p className="text-xs text-zinc-500 text-center mt-1 italic">
                Note: These are educational rewards for tracking progress, not real cryptocurrency.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSatsEducation(!showSatsEducation)}
              className="text-xs gap-1"
            >
              <Info className="w-3 h-3" />
              How do points work?
            </Button>

            {showSatsEducation && (
              <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg text-left">
                <h3 className="font-semibold mb-2">Understanding HODLearn Points</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>• HODLearn Points track your learning progress</p>
                  <p>• Points are pegged to Bitcoin's smallest unit (satoshis)</p>
                  <p>• 1 Bitcoin = 100,000,000 satoshis</p>
                  <p>• This helps you learn to think in Bitcoin terms</p>
                  <p>• Your {formatSats(walletData.totalSatoshisEarned)} points = {formatBTC(walletData.totalSatoshisEarned)} BTC equivalent</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Rank Badge */}
      {leaderboardPosition && leaderboardPosition.rank && (
        <Card 
          className="cursor-pointer hover:border-orange-500/50 transition-colors bg-gradient-to-r from-orange-500/10 to-zinc-800 border-orange-500/20"
          onClick={() => setLocation('/community?tab=leaderboard')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Trophy className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Your Rank</p>
                  <p className="text-xl font-bold text-white">#{leaderboardPosition.rank}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-500">{leaderboardPosition.periodName || 'Current Period'}</p>
                <p className="text-sm text-orange-400 font-medium">View Rankings →</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                {formatSats(walletData.weeklyEarnings)} points
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
                {formatSats(walletData.monthlyEarnings)} points
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
              <p className="text-sm">Complete lessons to start earning points</p>
            </div>
          ) : (
            <div className="space-y-3">
              {walletData.recentEarnings.slice(0, 10).map((earning, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 ${getEarningTypeBgColor(earning.earningType)} rounded-lg`}>
                      {getEarningTypeIcon(earning.earningType)}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{getEarningTypeDisplay(earning.earningType)}</div>
                      <div className="text-xs text-gray-400">{earning.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-500">
                      +{formatSats(earning.satoshisEarned)} points
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
              <div className="text-sm text-gray-400">Your points at current price</div>
              <div className="text-lg font-semibold text-orange-500">
                ${formatUsd(walletData.totalUsdValue)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invite Friends - Compact link to Home */}
      <ReferralStatsCompact />

              {/* Call to Action */}
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Keep Learning, Keep Earning</h3>
                  <p className="text-gray-400 mb-4 text-sm">
                    Complete daily lessons and quizzes to earn more HODLearn Points and build your Bitcoin knowledge.
                  </p>
                  <Button onClick={() => setLocation('/learn')} className="bg-orange-500 hover:bg-orange-600">
                    Continue Learning
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            /* Rewards Tab Content */
            <div className="space-y-6">
              {/* How to Earn Points */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-orange-500" />
                    How to Earn Points
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    {/* Quiz Questions */}
                    <div className="flex items-start gap-3 p-4 bg-zinc-800/50 rounded-lg">
                      <div className="p-2 bg-blue-500/20 rounded-lg shrink-0">
                        <Brain className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm mb-1">Answer Quiz Questions</div>
                        <div className="text-xs text-gray-400 mb-2">Test your Bitcoin knowledge</div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{formatSats(getRewardAmount('quiz_correct', 100))} points per correct answer</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Perfect Quiz */}
                    <div className="flex items-start gap-3 p-4 bg-zinc-800/50 rounded-lg">
                      <div className="p-2 bg-green-500/20 rounded-lg shrink-0">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm mb-1">Perfect Quiz Score</div>
                        <div className="text-xs text-gray-400 mb-2">Get all answers right</div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{formatSats(getRewardAmount('quiz_perfect', 500))} points bonus</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Daily Complete */}
                    <div className="flex items-start gap-3 p-4 bg-zinc-800/50 rounded-lg">
                      <div className="p-2 bg-orange-500/20 rounded-lg shrink-0">
                        <Zap className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm mb-1">Complete Daily Lesson</div>
                        <div className="text-xs text-gray-400 mb-2">Finish the full day's content</div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{formatSats(getRewardAmount('daily_complete', 1000))} points completion bonus</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Streak Bonuses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    Streak Bonuses
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    {/* 7 Day Streak */}
                    <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                          <Calendar className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">7-Day Streak</div>
                          <div className="text-xs text-gray-400">Complete 7 days in a row</div>
                        </div>
                      </div>
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/20">
                        {formatSats(getRewardAmount('streak_7', 2000))} points
                      </Badge>
                    </div>

                    {/* 30 Day Streak */}
                    <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Trophy className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">30-Day Streak</div>
                          <div className="text-xs text-gray-400">Complete a full month</div>
                        </div>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/20">
                        {formatSats(getRewardAmount('streak_30', 10000))} points
                      </Badge>
                    </div>

                    {/* 100 Day Streak */}
                    <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <Trophy className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">100-Day Streak</div>
                          <div className="text-xs text-gray-400">Reach 100 consecutive days</div>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/20">
                        {formatSats(getRewardAmount('streak_100', 50000))} points
                      </Badge>
                    </div>

                    {/* 365 Day Streak */}
                    <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <Crown className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">365-Day Streak</div>
                          <div className="text-xs text-gray-400">Master level achievement</div>
                        </div>
                      </div>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/20">
                        {formatSats(getRewardAmount('streak_365', 100000))} points
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Why Points are Pegged to Bitcoin */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-orange-500" />
                    Why Points Track Bitcoin?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm text-gray-300">
                    <p>• <strong>Learn Bitcoin thinking:</strong> Points are pegged to satoshis (Bitcoin's smallest unit)</p>
                    <p>• <strong>Psychological advantage:</strong> Earning thousands feels better than earning 0.00001</p>
                    <p>• <strong>Real-world prep:</strong> When you buy real Bitcoin, you'll already think in sats</p>
                    <p>• <strong>Precision:</strong> No decimal confusion - whole numbers only</p>
                  </div>
                  
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-1">Remember</div>
                      <div className="font-semibold">1 Bitcoin = 100,000,000 satoshis</div>
                      <div className="text-xs text-gray-400 mt-1">Just like 1 dollar = 100 cents</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Call to Action */}
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Ready to Start Earning?</h3>
                  <p className="text-gray-400 mb-4 text-sm">
                    Complete your first lesson and quiz to earn your first HODLearn Points.
                  </p>
                  <Button onClick={() => setLocation('/learn')} className="bg-orange-500 hover:bg-orange-600">
                    Start Learning Today
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
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