import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, User } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';

export default function DevSubscriptionToggle() {
  const { subscriptionTier, toggleSubscription, isPremiumTier } = useSubscription();

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-zinc-900 border border-zinc-700 rounded-lg p-3 shadow-lg">
      <div className="flex items-center gap-3">
        <Badge variant={isPremiumTier ? "default" : "secondary"} className="text-xs">
          {isPremiumTier ? (
            <>
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </>
          ) : (
            <>
              <User className="w-3 h-3 mr-1" />
              Free
            </>
          )}
        </Badge>
        
        <Button
          onClick={toggleSubscription}
          size="sm"
          variant="outline"
          className="text-xs h-7 px-2"
        >
          Switch to {isPremiumTier ? 'Free' : 'Premium'}
        </Button>
      </div>
      
      <p className="text-xs text-zinc-500 mt-1">Dev Only - POC Paywall</p>
    </div>
  );
}