import { ReactNode, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import UpgradeModal from './UpgradeModal';

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
  showPreview = false 
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
          description: "This advanced simulator is available to premium users.",
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
        {/* Show blurred/preview content if requested */}
        {showPreview && (
          <div className={`${blurContent ? 'blur-sm pointer-events-none' : ''}`}>
            {children}
          </div>
        )}
        
        {/* Overlay */}
        <Card className="bg-zinc-900/95 border-zinc-800 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              {/* Premium Badge */}
              <Badge className="bg-orange-500 text-white px-3 py-1">
                <Crown className="w-4 h-4 mr-1" />
                Premium
              </Badge>

              {/* Icon */}
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
                {lockedInfo.icon}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">
                  {lockedInfo.title}
                </h3>
                <p className="text-zinc-400 text-sm max-w-sm">
                  {lockedInfo.description}
                </p>
              </div>

              {/* Upgrade Button */}
              <Button 
                onClick={() => setShowUpgradeModal(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6"
              >
                {lockedInfo.buttonText}
              </Button>

              {/* Pricing hint */}
              <p className="text-xs text-zinc-500">
                Starting at $9.99/month • Cancel anytime
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger={type === 'day' ? 'day-limit' : type === 'simulator' ? 'simulator' : 'feature'}
        lockedFeature={featureName}
      />
    </>
  );
}