import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, Crown, X } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface EmailCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: 'day-limit' | 'simulator' | 'feature';
  lockedFeature?: string;
  onEmailSubmitted?: (email: string) => void;
}

export default function EmailCollectionModal({ 
  isOpen, 
  onClose, 
  trigger = 'day-limit', 
  lockedFeature,
  onEmailSubmitted 
}: EmailCollectionModalProps) {
  const { setSubscriptionTier } = useSubscription();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    setIsSubmitting(true);
    
    try {
      // Submit email to backend
      const response = await fetch('/api/collect-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          trigger,
          lockedFeature,
          timestamp: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        setEmailSubmitted(true);
        onEmailSubmitted?.(email);
        
        // Grant access after email collection
        setTimeout(() => {
          setSubscriptionTier('premium');
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to submit email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (emailSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-xl font-bold text-green-400">Welcome to Premium!</DialogTitle>
            <p className="text-zinc-400">Unlocking your access now...</p>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-zinc-300 mb-4">
              Thank you! You now have full access to all HODLearn features.
            </p>
            <div className="animate-pulse text-orange-400">
              Activating premium access...
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold">{content.title}</DialogTitle>
          <p className="text-zinc-400">{content.subtitle}</p>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-center text-zinc-300">{content.description}</p>

          {/* Email Collection Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                required
              />
              <p className="text-xs text-zinc-500">
                We'll send you updates about new Bitcoin education content and features.
              </p>
            </div>

            <Button 
              type="submit"
              disabled={isSubmitting || !email || !email.includes('@')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isSubmitting ? "Unlocking Access..." : "Get Instant Access - Free"}
            </Button>
          </form>

          {/* Trust Signals */}
          <div className="bg-zinc-800 rounded-lg p-4 border border-green-500/20">
            <div className="text-center space-y-2">
              <Badge className="bg-green-500 text-white">No Payment Required</Badge>
              <div className="space-y-1 text-xs text-zinc-400">
                <p>✓ Instant access to all content</p>
                <p>✓ Complete 30-day Bitcoin curriculum</p>
                <p>✓ All interactive simulators</p>
                <p>✓ No credit card needed</p>
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