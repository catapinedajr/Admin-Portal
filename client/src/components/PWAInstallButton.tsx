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
        description: `+10,000 sats added to your wallet!`,
        duration: 5000,
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
      // Award the 10,000 sats bonus
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
      // Show manual installation instructions for Safari/unsupported browsers
      toast({
        title: 'Install HODLearn',
        description: 'Tap the Share button, then "Add to Home Screen"',
        duration: 8000,
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
      title="Download to Home Screen - Get 10,000 sats bonus!"
    >
      {/* Flashing effect overlay */}
      <div className="absolute inset-0 bg-orange-300 opacity-30 animate-ping"></div>
      
      <Download className="w-4 h-4 relative z-10" />
      <span className="sr-only">Download to Home Screen</span>
    </Button>
  );
}