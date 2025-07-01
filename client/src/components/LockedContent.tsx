import { ReactNode, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import EmailCollectionModal from './EmailCollectionModal';

interface LockedContentProps {
  children: ReactNode;
  isLocked: boolean;
  type: 'day' | 'simulator' | 'feature';
  featureName?: string;
  blurContent?: boolean;
  showPreview?: boolean;
}

export default function LockedContent({ 
  children, 
  isLocked, 
  type, 
  featureName,
  blurContent = true,
  showPreview = true 
}: LockedContentProps) {
  const { isPremiumTier } = useSubscription();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // If user has premium access, show content normally
  if (isPremiumTier || !isLocked) {
    return <>{children}</>;
  }

  const getLockedContent = () => {
    switch (type) {
      case 'day':
        return {
          title: "Day Locked",
          description: "Complete the previous days or upgrade to premium to access this content.",
          icon: <Lock className="w-6 h-6" />,
          buttonText: "Upgrade to Continue"
        };
      case 'simulator':
        return {
          title: `${featureName || 'Simulator'} - Premium Only`,
          description: "Unlock this advanced simulator with premium access.",
          icon: <Crown className="w-6 h-6" />,
          buttonText: "Unlock Simulator"
        };
      case 'feature':
        return {
          title: `${featureName || 'Feature'} - Premium Only`,
          description: "This feature requires a premium subscription.",
          icon: <Crown className="w-6 h-6" />,
          buttonText: "Upgrade Now"
        };
      default:
        return {
          title: "Premium Content",
          description: "This content requires a premium subscription.",
          icon: <Lock className="w-6 h-6" />,
          buttonText: "Upgrade"
        };
    }
  };

  const lockedInfo = getLockedContent();

  return (
    <>
      <div className="relative">
        {/* Show preview content grayed out to tease users */}
        {showPreview && (
          <div className="opacity-30 pointer-events-none grayscale">
            {children}
          </div>
        )}
        
        {/* Compact overlay that doesn't completely hide content */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="text-center space-y-3 p-6 bg-zinc-900/95 rounded-lg border border-orange-500/30 max-w-sm">
            <div className="flex items-center justify-center space-x-2">
              <Crown className="w-5 h-5 text-orange-400" />
              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                Premium
              </Badge>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white">
                {lockedInfo.title}
              </h3>
              <p className="text-sm text-zinc-300">
                {lockedInfo.description}
              </p>
            </div>

            <Button 
              onClick={() => setShowUpgradeModal(true)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium"
            >
              {lockedInfo.buttonText}
            </Button>
            
            <p className="text-xs text-zinc-500">
              Free for a limited time
            </p>
          </div>
        </div>
      </div>

      {/* Email Collection Modal */}
      <EmailCollectionModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger={type === 'day' ? 'day-limit' : type === 'simulator' ? 'simulator' : 'feature'}
        lockedFeature={featureName}
      />
    </>
  );
}