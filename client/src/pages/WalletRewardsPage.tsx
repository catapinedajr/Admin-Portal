import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  Flame,
  Plus,
  AlertTriangle,
  Shield,
  Users,
  Brain
} from "@/lib/icons";
import { useLocation } from "wouter";
import BottomNavigation from "@/components/BottomNavigation";
import { useSubscription } from "@/contexts/SubscriptionContext";
import type { User } from "@shared/schema";

export default function WalletRewardsPage() {
  const [, setLocation] = useLocation();
  const { isPremiumTier, setShowEmailModal } = useSubscription();

  // Get user data for streak information
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/user'],
    retry: false,
    refetchOnWindowFocus: false,
  });

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

              {/* Header Actions */}
              <div className="flex items-center gap-2">
                {/* Back Button */}
                <Button 
                  onClick={() => setLocation('/wallet')}
                  size="sm"
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5"
                  title="Back to Wallet"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="sr-only">Back</span>
                </Button>

                {/* Wallet Button */}
                <Button 
                  onClick={() => setLocation('/wallet')}
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white border border-orange-500 hover:border-orange-600 px-2.5 py-1.5"
                  title="Bitcoin Learning Wallet"
                >
                  <Wallet className="w-4 h-4" />
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

        <main className="max-w-6xl mx-auto px-4 py-6 pb-32">
          <div className="space-y-6">
            {/* Loading Content */}
            <div className="space-y-4">
              <div className="h-8 bg-zinc-700 rounded animate-pulse w-64"></div>
              <div className="h-4 bg-zinc-800 rounded animate-pulse w-96"></div>
            </div>
          </div>
        </main>

        <BottomNavigation 
          activeSection="more"
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

  const currentStreak = user?.currentStreak || 0;
  const bestStreak = user?.bestStreak || 0;

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

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              {/* Back Button */}
              <Button 
                onClick={() => setLocation('/wallet')}
                size="sm"
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5"
                title="Back to Wallet"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="sr-only">Back</span>
              </Button>

              {/* Wallet Button */}
              <Button 
                onClick={() => setLocation('/wallet')}
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white border border-orange-500 hover:border-orange-600 px-2.5 py-1.5"
                title="Bitcoin Learning Wallet"
              >
                <Wallet className="w-4 h-4" />
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

      <main className="max-w-6xl mx-auto px-4 py-6 pb-32">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Coins className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">How to Stack Sats</h1>
                <p className="text-zinc-400">Learn how HODLearn's reward system works</p>
              </div>
            </div>
          </div>

          {/* Earning Structure */}
          <Card className="border border-zinc-700/50 bg-zinc-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="w-5 h-5 text-orange-500" />
                How You Earn Satoshis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Per Question Rewards */}
              <div className="space-y-4">
                <h3 className="font-semibold text-white">Quiz Rewards</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="bg-zinc-700/30 rounded-lg p-4 border border-zinc-600/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-zinc-300">Per Correct Answer</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        100 sats
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Get immediate reward for each question you answer correctly
                    </p>
                  </div>
                  
                  <div className="bg-zinc-700/30 rounded-lg p-4 border border-zinc-600/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-zinc-300">Quiz Completion Bonus</span>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        500 sats
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Extra bonus for finishing the entire daily quiz
                    </p>
                  </div>
                </div>
              </div>

              {/* Example Calculation */}
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <h4 className="font-medium text-orange-300 mb-2">Example Daily Earnings</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">4 correct answers × 100 sats</span>
                    <span className="text-white">400 sats</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">Quiz completion bonus</span>
                    <span className="text-white">500 sats</span>
                  </div>
                  <Separator className="bg-zinc-600" />
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-orange-300">Total daily earnings</span>
                    <span className="text-orange-400">900 sats</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Streak Bonuses */}
          <Card className="border border-zinc-700/50 bg-zinc-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Flame className="w-5 h-5 text-orange-500" />
                Streak Milestone Bonuses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-zinc-400 text-sm">
                Maintain your learning streak to unlock bigger rewards at major milestones:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-zinc-700/30 rounded-lg border border-zinc-600/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${currentStreak >= 7 ? 'bg-orange-500' : 'bg-zinc-600'}`} />
                    <div>
                      <span className="font-medium text-white">7-Day Streak</span>
                      <p className="text-xs text-zinc-400">Complete one week of learning</p>
                    </div>
                  </div>
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                    2,000 sats
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-700/30 rounded-lg border border-zinc-600/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${currentStreak >= 30 ? 'bg-orange-500' : 'bg-zinc-600'}`} />
                    <div>
                      <span className="font-medium text-white">30-Day Streak</span>
                      <p className="text-xs text-zinc-400">One month of consistent learning</p>
                    </div>
                  </div>
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                    10,000 sats
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-700/30 rounded-lg border border-zinc-600/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${currentStreak >= 365 ? 'bg-orange-500' : 'bg-zinc-600'}`} />
                    <div>
                      <span className="font-medium text-white">365-Day Streak</span>
                      <p className="text-xs text-zinc-400">Full year of Bitcoin education</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    100,000 sats
                  </Badge>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-300 font-medium">Your Current Progress</span>
                </div>
                <p className="text-sm text-zinc-300">
                  Current streak: <span className="text-orange-400 font-semibold">{currentStreak} days</span>
                  {bestStreak > currentStreak && (
                    <span className="text-zinc-400"> • Best: {bestStreak} days</span>
                  )}
                </p>
                {currentStreak < 7 && (
                  <p className="text-xs text-blue-300 mt-1">
                    Just {7 - currentStreak} more days until your first milestone bonus!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Future Rewards */}
          <Card className="border border-zinc-700/50 bg-zinc-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Plus className="w-5 h-5 text-orange-500" />
                Additional Ways to Earn (Coming Soon)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="bg-zinc-700/20 rounded-lg p-4 border border-zinc-600/30 opacity-60">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-zinc-400" />
                    <span className="text-zinc-300 font-medium">Simulator Practice</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Earn sats for completing Bitcoin security training and wallet simulations
                  </p>
                </div>

                <div className="bg-zinc-700/20 rounded-lg p-4 border border-zinc-600/30 opacity-60">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-zinc-400" />
                    <span className="text-zinc-300 font-medium">Community Posts</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Share insights and help other learners in the community forums
                  </p>
                </div>

                <div className="bg-zinc-700/20 rounded-lg p-4 border border-zinc-600/30 opacity-60">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-zinc-400" />
                    <span className="text-zinc-300 font-medium">Referral Bonuses</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Invite friends to join and earn bonus sats when they start learning
                  </p>
                </div>

                <div className="bg-zinc-700/20 rounded-lg p-4 border border-zinc-600/30 opacity-60">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-zinc-400" />
                    <span className="text-zinc-300 font-medium">Achievement Badges</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Complete learning milestones and collect special achievement rewards
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Educational Content */}
          <Card className="border border-zinc-700/50 bg-zinc-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="w-5 h-5 text-orange-500" />
                Why Think in Sats?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-zinc-300 text-sm leading-relaxed">
                Satoshis (sats) are the smallest unit of Bitcoin. Just like cents to dollars, 
                thinking in sats helps you understand Bitcoin's true divisibility and future potential.
              </p>
              
              <div className="bg-zinc-700/30 rounded-lg p-4 border border-zinc-600/50">
                <h4 className="font-medium text-white mb-2">Bitcoin Unit Hierarchy</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">1 Bitcoin (BTC)</span>
                    <span className="text-orange-400">100,000,000 sats</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">Your earned sats</span>
                    <span className="text-white">Building your Bitcoin future</span>
                  </div>
                </div>
              </div>

              <p className="text-zinc-400 text-xs">
                As Bitcoin grows in value, thinking in sats now prepares you for a future where 
                whole bitcoins might be too valuable for everyday transactions. Start stacking sats today!
              </p>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-orange-600/5">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-white mb-2">Ready to Start Earning?</h3>
              <p className="text-zinc-300 mb-4 text-sm">
                Head back to today's lesson and start building your Bitcoin knowledge while stacking sats.
              </p>
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={() => setLocation('/learn')} 
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Start Learning
                </Button>
                <Button 
                  onClick={() => setLocation('/wallet')} 
                  variant="outline"
                  className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Wallet
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNavigation 
        activeSection="more"
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