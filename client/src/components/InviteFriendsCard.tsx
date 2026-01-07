import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Copy, Check, Share2, ArrowRight } from "@/lib/icons";

interface ReferralData {
  code: string;
  shareUrl: string;
  stats: {
    totalReferrals: number;
    totalPointsEarned: number;
    pendingMilestones: number;
  };
}

export function InviteFriendsCard() {
  const [copied, setCopied] = useState(false);
  
  const { data: referralData, isLoading } = useQuery<ReferralData>({
    queryKey: ['/api/referral/my-code'],
    retry: false,
  });

  const handleCopyCode = async () => {
    if (referralData?.code) {
      await navigator.clipboard.writeText(referralData.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (referralData?.shareUrl && navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on HODLearn',
          text: `Learn Bitcoin with me! Use my referral code ${referralData.code} to get bonus points.`,
          url: referralData.shareUrl,
        });
      } catch (err) {
        handleCopyCode();
      }
    } else {
      handleCopyCode();
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-zinc-700 rounded w-1/2"></div>
            <div className="h-10 bg-zinc-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gift className="w-5 h-5 text-orange-500" />
          Invite Friends, Earn Points
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-zinc-400">
          Share your code and you both earn 50 points when they sign up!
        </p>
        
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-zinc-800 rounded-lg p-3 font-mono text-lg text-center text-orange-400 border border-zinc-700">
            {referralData?.code || '---'}
          </div>
          <Button
            onClick={handleCopyCode}
            variant="outline"
            size="icon"
            className="h-12 w-12 border-zinc-700"
            data-testid="button-copy-referral"
          >
            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </Button>
        </div>

        <Button
          onClick={handleShare}
          className="w-full bg-orange-500 hover:bg-orange-600"
          data-testid="button-share-referral"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share with Friends
        </Button>

        {referralData?.stats && referralData.stats.totalReferrals > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-zinc-700/50">
            <div className="text-center">
              <p className="text-lg font-bold text-white">{referralData.stats.totalReferrals}</p>
              <p className="text-xs text-zinc-500">Friends Joined</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-orange-400">{referralData.stats.totalPointsEarned}</p>
              <p className="text-xs text-zinc-500">Points Earned</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ReferralStatsCompact() {
  const [, setLocation] = useLocation();
  
  const { data: referralData, isLoading } = useQuery<ReferralData>({
    queryKey: ['/api/referral/my-code'],
    retry: false,
  });

  if (isLoading) {
    return null;
  }

  const hasReferrals = referralData?.stats && referralData.stats.totalReferrals > 0;

  return (
    <Card 
      className="bg-zinc-800/50 border-zinc-700 cursor-pointer hover:border-orange-500/30 transition-colors"
      onClick={() => setLocation('/')}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Gift className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Invite Friends</p>
              {hasReferrals ? (
                <p className="text-xs text-zinc-400">
                  {referralData.stats.totalReferrals} friends • {referralData.stats.totalPointsEarned} pts earned
                </p>
              ) : (
                <p className="text-xs text-zinc-400">Earn 50 pts per referral</p>
              )}
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-500" />
        </div>
      </CardContent>
    </Card>
  );
}
