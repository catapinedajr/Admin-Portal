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
  const [isClicked, setIsClicked] = useState(false);

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
    setIsClicked(true);
    console.log('HODLearn: Install button clicked');
    console.log('HODLearn: deferredPrompt available:', !!deferredPrompt);
    console.log('HODLearn: isInstallable:', isInstallable);
    console.log('HODLearn: isInstalled:', isInstalled);
    console.log('HODLearn: User Agent:', navigator.userAgent);

    if (!deferredPrompt) {
      console.log('HODLearn: No install prompt available - checking browser install options');
      
      // Reset click state after showing alert
      setTimeout(() => setIsClicked(false), 100);
      
      // Check if we're on mobile or desktop and provide appropriate instructions
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isChrome = /Chrome/i.test(navigator.userAgent);
      const isFirefox = /Firefox/i.test(navigator.userAgent);
      const isSafari = /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);
      
      let instructions = 'To install HODLearn:\n\n';
      
      if (isMobile) {
        if (isChrome) {
          instructions += '1. Tap the menu (⋮) → "Add to Home Screen"\n2. Tap "Install" or "Add"';
        } else if (isSafari) {
          instructions += '1. Tap the Share button (□↗)\n2. Scroll down → "Add to Home Screen"\n3. Tap "Add"';
        } else {
          instructions += '1. Look for "Add to Home Screen" in your browser menu\n2. Tap to install';
        }
      } else {
        if (isChrome) {
          instructions += '1. Click the menu (⋮) → "Install HODLearn"\n2. Or look for the install icon in the address bar';
        } else if (isFirefox) {
          instructions += '1. Visit us a few more times and Firefox will offer installation\n2. Or bookmark us for easy access';
        } else {
          instructions += '1. Try opening in Chrome or Edge for best install experience\n2. Look for "Install app" in the browser menu';
        }
      }
      
      alert(instructions);
      return;
    }

    try {
      console.log('HODLearn: Attempting to show install prompt...');
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('HODLearn: User choice:', outcome);
      
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
    } finally {
      setIsClicked(false);
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
      disabled={isClicked}
      title={deferredPrompt ? "Install HODLearn app" : "Manual install available"}
    >
      <Download className="w-3 h-3 mr-1.5" />
      {isClicked ? "..." : "Install"}
    </Button>
  );
}