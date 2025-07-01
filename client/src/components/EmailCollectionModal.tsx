import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, X } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface EmailCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: 'day-limit' | 'simulator' | 'feature';
  lockedFeature?: string;
}

export default function EmailCollectionModal({ 
  isOpen, 
  onClose, 
  trigger = 'day-limit', 
  lockedFeature
}: EmailCollectionModalProps) {
  const { setSubscriptionTier } = useSubscription();

  const getTriggerContent = () => {
    switch (trigger) {
      case 'day-limit':
        return {
          title: "Continue Your Bitcoin Journey",
          subtitle: "You've completed the free 7-day introduction!",
          description: "Get instant access to the complete 30-day curriculum plus all premium features."
        };
      case 'simulator':
        return {
          title: `Unlock ${lockedFeature || 'Premium Simulator'}`,
          subtitle: "This advanced tool is available instantly",
          description: "Access professional-grade Bitcoin simulations and analysis tools right now."
        };
      case 'feature':
        return {
          title: "Premium Feature",
          subtitle: `${lockedFeature || 'This feature'} is available now`,
          description: "Unlock all advanced features and complete your Bitcoin education journey."
        };
      default:
        return {
          title: "Unlock Premium Access",
          subtitle: "Get instant access to everything",
          description: "Access all content, simulators, and advanced features immediately."
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

          {/* Simple Upgrade Button */}
          <Button 
            onClick={() => {
              // Grant premium access immediately 
              setSubscriptionTier('premium');
              onClose();
            }}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3"
          >
            Upgrade Now
          </Button>

          {/* Trust Signals */}
          <div className="bg-zinc-800 rounded-lg p-4 border border-green-500/20">
            <div className="text-center space-y-2">
              <Badge className="bg-green-500 text-white">Free for Limited Time</Badge>
              <div className="space-y-1 text-xs text-zinc-400">
                <p>✓ Instant access to all content</p>
                <p>✓ Complete 180-day Bitcoin curriculum</p>
                <p>✓ All interactive simulators</p>
                <p>✓ Advanced security training</p>
              </div>
            </div>
          </div>

          {/* Skip Option */}
          <Button 
            onClick={onClose} 
            variant="ghost" 
            className="w-full text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4 mr-2" />
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}