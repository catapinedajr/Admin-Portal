import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Check } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if user has already installed PWA
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
  });

  // Mutation to award PWA installation bonus
  const awardPWABonus = useMutation({
    mutationFn: () => apiRequest('/api/wallet/pwa-bonus', 'POST'),
    onSuccess: (data) => {
      toast({
        title: '🎉 PWA Installation Bonus!',
        description: (
          <div className="space-y-2 text-sm leading-relaxed">
            <div className="text-lg font-bold text-green-400">
              +10,000 points added to your wallet!
            </div>
            <div className="text-zinc-300">
              HODLearn is now installed on your home screen.
            </div>
            <div className="text-zinc-400">
              Bonus value: $1.18 at current Bitcoin price
            </div>
          </div>
        ),
        duration: 8000,
      });
      
      // Invalidate wallet and user data to refresh
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
  });

  useEffect(() => {
    // Check if user already received PWA bonus
    if (user && 'pwaInstalledAt' in user && user.pwaInstalledAt) {
      setIsInstalled(true);
      return;
    }

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      // Award bonus if not already awarded
      if (!user || !('pwaInstalledAt' in user) || !user.pwaInstalledAt) {
        awardPWABonus.mutate();
      }
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      // Award the 10,000 points bonus
      awardPWABonus.mutate();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [user, awardPWABonus]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Show detailed manual installation instructions for Safari/unsupported browsers
      toast({
        title: '🎉 Install HODLearn & Earn 10,000 Points!',
        description: (
          <div className="space-y-3 text-sm leading-relaxed">
            <div>
              <strong className="text-orange-400">iOS Safari:</strong>
              <br />
              1. Tap Share button (box with arrow)
              <br />
              2. Scroll down → "Add to Home Screen"
              <br />
              3. Tap "Add" to install
            </div>
            
            <div>
              <strong className="text-orange-400">Chrome/Edge:</strong>
              <br />
              1. Tap menu (3 dots)
              <br />
              2. Select "Install app"
              <br />
              3. Confirm installation
            </div>
            
            <div className="pt-2 border-t border-zinc-600">
              <strong className="text-green-400">Reward:</strong> Get instant 10,000 points bonus ($1.18 value) added to your wallet when installation is complete!
            </div>
          </div>
        ),
        duration: 20000,
      });
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        // Installation will be detected by 'appinstalled' event
      }
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  // Don't show button if already installed
  if (isInstalled || (user && 'pwaInstalledAt' in user && user.pwaInstalledAt)) {
    return null;
  }

  return (
    <Button 
      onClick={handleInstallClick}
      size="sm"
      className="bg-orange-500 hover:bg-orange-600 text-white border-orange-600 hover:border-orange-700 px-2.5 py-1.5 animate-pulse hover:animate-none relative overflow-hidden"
      title="Download to Home Screen - Get 10,000 points bonus ($1.18 value)!"
    >
      {/* Flashing effect overlay */}
      <div className="absolute inset-0 bg-orange-300 opacity-30 animate-ping"></div>
      
      <Download className="w-4 h-4 relative z-10" />
      <span className="sr-only">Download to Home Screen - Get 10,000 points bonus!</span>
    </Button>
  );
}