import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share, Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppMode = (window.navigator as any).standalone === true;
    
    if (isInStandaloneMode || isInWebAppMode) {
      setIsInstalled(true);
      return;
    }

    // Safari on iOS doesn't support beforeinstallprompt, so we check for Safari specifically
    const isSafari = /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isSafari && isIOS) {
      // For Safari on iOS, we can't auto-trigger install but we can always show the button
      setIsInstallable(true);
    }

    // Listen for beforeinstallprompt event (Chrome/Android)
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

    if (!deferredPrompt) {
      
      // Reset click state after showing alert
      setTimeout(() => setIsClicked(false), 100);
      
      // Check if we're on Safari iOS and show modal instead of alert
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isChrome = /Chrome/i.test(navigator.userAgent);
      const isFirefox = /Firefox/i.test(navigator.userAgent);
      const isSafari = /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);
      
      if (isMobile && isSafari) {
        // Show modal for Safari iOS instead of alert
        setShowInstallModal(true);
        return;
      }
      
      // For other browsers, use alert with instructions
      let instructions = 'To install HODLearn:\n\n';
      
      if (isMobile) {
        if (isChrome) {
          instructions += '1. Tap the menu (⋮) → "Add to Home Screen"\n2. Tap "Install" or "Add"';
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
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      
      if (outcome === 'accepted') {
      } else {
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
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
    <>
      <Button
        onClick={handleInstall}
        size="sm"
        variant="outline"
        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5"
        disabled={isClicked}
        title={deferredPrompt ? "Install HODLearn app" : "Manual install available"}
      >
        <Download className="w-4 h-4" />
        <span className="sr-only">Install</span>
      </Button>

      {/* Safari iOS Install Modal */}
      <Dialog open={showInstallModal} onOpenChange={setShowInstallModal}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-orange-500" />
              Install HODLearn App
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-white mb-2">
                Get the full app experience!
              </div>
              <div className="text-sm text-zinc-400">
                Install HODLearn on your home screen for faster access and a native app feel
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-zinc-800 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div>
                  <div className="font-medium text-white mb-1">Tap the Share button</div>
                  <div className="text-sm text-zinc-400 flex items-center gap-1">
                    Look for <Share className="w-4 h-4" /> at the bottom of Safari
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-zinc-800 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div>
                  <div className="font-medium text-white mb-1">Find "Add to Home Screen"</div>
                  <div className="text-sm text-zinc-400 flex items-center gap-1">
                    Scroll down in the share menu and tap <Plus className="w-4 h-4" /> "Add to Home Screen"
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-zinc-800 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <div>
                  <div className="font-medium text-white mb-1">Complete installation</div>
                  <div className="text-sm text-zinc-400">
                    Tap "Add" in the top right corner to finish
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
              <div className="text-orange-400 font-medium text-sm mb-1">
                After installation:
              </div>
              <div className="text-zinc-300 text-sm">
                HODLearn will appear on your home screen with its own icon. Tap it for a clean, full-screen app experience without browser bars!
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={() => setShowInstallModal(false)}
              variant="outline" 
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border-zinc-700"
            >
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}