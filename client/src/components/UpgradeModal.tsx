import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, X } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: 'day-limit' | 'simulator' | 'feature';
  lockedFeature?: string;
}

export default function UpgradeModal({ isOpen, onClose, trigger = 'day-limit', lockedFeature }: UpgradeModalProps) {
  const { setSubscriptionTier } = useSubscription();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    
    // Simulate upgrade process
    setTimeout(() => {
      setSubscriptionTier('premium');
      setIsUpgrading(false);
      onClose();
    }, 2000);
  };

  const getTriggerContent = () => {
    switch (trigger) {
      case 'day-limit':
        return {
          title: "Continue Your Bitcoin Journey",
          subtitle: "You've completed the free 7-day introduction!",
          description: "Continue with 23 more days of advanced Bitcoin education, interactive simulators, and exclusive content - free during our beta period."
        };
      case 'simulator':
        return {
          title: `Unlock ${lockedFeature || 'Premium Simulator'}`,
          subtitle: "This advanced tool is for premium users",
          description: "Get hands-on experience with professional-grade Bitcoin simulations and analysis tools."
        };
      case 'feature':
        return {
          title: "Premium Feature",
          subtitle: `${lockedFeature || 'This feature'} requires premium access`,
          description: "Unlock all advanced features and complete your Bitcoin education journey."
        };
      default:
        return {
          title: "Upgrade to Premium",
          subtitle: "Unlock the complete HODLearn experience",
          description: "Access all content, simulators, and advanced features."
        };
    }
  };

  const content = getTriggerContent();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold">{content.title}</DialogTitle>
          <p className="text-zinc-400">{content.subtitle}</p>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-center text-zinc-300">{content.description}</p>

          {/* Pricing Card */}
          <div className="bg-zinc-800 rounded-lg p-6 border border-green-500/20">
            <div className="text-center">
              <Badge className="bg-green-500 text-white mb-3">Free Beta Access</Badge>
              <div className="text-3xl font-bold text-white line-through text-zinc-500">$9.99</div>
              <div className="text-2xl font-bold text-green-500">FREE</div>
              <div className="text-zinc-400 text-sm">during beta testing</div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">30-day complete Bitcoin curriculum</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">All interactive simulators</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">Weekly deep-dive content</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">Progress tracking & achievements</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleUpgrade} 
              disabled={isUpgrading}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              {isUpgrading ? "Activating..." : "Continue Learning - FREE"}
            </Button>
            
            <Button 
              onClick={onClose} 
              variant="ghost" 
              className="w-full text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4 mr-2" />
              Maybe Later
            </Button>
          </div>

          {/* Trust Signals */}
          <div className="text-center text-xs text-zinc-500 space-y-1">
            <p>🔒 No payment required during beta</p>
            <p>Join early adopters testing HODLearn</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}