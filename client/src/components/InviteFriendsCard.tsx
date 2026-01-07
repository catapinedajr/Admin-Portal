import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
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
      try {
        await navigator.clipboard.writeText(referralData.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        console.log('Clipboard API not available in this context - will work on HTTPS');
      }
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
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleCopyCode();
        }
      }
    } else {
      handleCopyCode();
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-black border border-zinc-700/50">
        <CardContent className="p-4">
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-9 h-9 bg-zinc-700 rounded-lg"></div>
            <div className="flex-1 h-10 bg-zinc-700 rounded"></div>
            <div className="w-12 h-12 bg-zinc-700 rounded"></div>
            <div className="w-12 h-12 bg-zinc-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black border border-zinc-700/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-orange-500/20 rounded-lg shrink-0">
            <Gift className="w-5 h-5 text-orange-500" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white">Invite Friends, Earn Points</p>
            <p className="text-xs text-zinc-400">Share & you both earn 50 points!</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-zinc-800 rounded-lg px-4 py-3 font-mono text-lg text-orange-400 border border-zinc-700">
            {referralData?.code || '---'}
          </div>
          <Button
            onClick={handleCopyCode}
            variant="outline"
            size="icon"
            className="h-12 w-12 border-zinc-700 hover:bg-zinc-700 hover:border-orange-500/50"
            data-testid="button-copy-referral"
          >
            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </Button>
          <Button
            onClick={handleShare}
            size="icon"
            className="h-12 w-12 bg-orange-500 hover:bg-orange-600"
            data-testid="button-share-referral"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {referralData?.stats && referralData.stats.totalReferrals > 0 && (
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-700/50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{referralData.stats.totalReferrals}</span>
              <span className="text-xs text-zinc-500">friends joined</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-orange-400">{referralData.stats.totalPointsEarned}</span>
              <span className="text-xs text-zinc-500">pts earned</span>
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
