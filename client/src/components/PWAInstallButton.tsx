import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppMode = (window.navigator as any).standalone === true;
    
    if (isInStandaloneMode || isInWebAppMode) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    console.log('HODLearn: Install button clicked');
    console.log('HODLearn: deferredPrompt available:', !!deferredPrompt);
    console.log('HODLearn: isInstallable:', isInstallable);
    console.log('HODLearn: isInstalled:', isInstalled);

    if (!deferredPrompt) {
      console.log('HODLearn: No install prompt available - trying manual instruction');
      alert('To install HODLearn:\n\n1. Click the menu (⋮) in your browser\n2. Look for "Install HODLearn" or "Add to Home Screen"\n3. Click it to install the app\n\nOr try opening in Chrome/Edge on desktop for best results.');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('HODLearn: PWA installation accepted');
      } else {
        console.log('HODLearn: PWA installation dismissed');
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('HODLearn: PWA installation error:', error);
      alert('Installation not available in this browser. Try Chrome or Edge on desktop.');
    }
  };

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // For testing - show button even if not installable (remove this later)

  return (
    <Button
      onClick={handleInstall}
      size="sm"
      variant="outline"
      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-3"
      disabled={!deferredPrompt}
      title={deferredPrompt ? "Install HODLearn app" : "Install not available"}
    >
      <Download className="w-3 h-3 mr-1.5" />
      {deferredPrompt ? "Install" : "Install"}
    </Button>
  );
}