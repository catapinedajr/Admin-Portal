import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bell, BellOff, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface NotificationPermissionProps {
  userId: number;
}

export default function NotificationPermission({ userId }: NotificationPermissionProps) {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
      checkSubscriptionStatus();
    }
  }, []);

  const checkSubscriptionStatus = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } catch (error) {
        console.error('Error checking subscription status:', error);
      }
    }
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Not Supported",
        description: "Push notifications are not supported in this browser.",
        variant: "destructive",
      });
      return;
    }

    if (permissionStatus === 'denied') {
      setShowModal(true);
      return;
    }

    setIsLoading(true);

    try {
      const newPermission = await Notification.requestPermission();
      setPermissionStatus(newPermission);

      if (newPermission === 'granted') {
        await subscribeUser();
        toast({
          title: "Notifications Enabled!",
          description: "You'll now receive daily learning reminders and streak alerts.",
        });
      } else {
        toast({
          title: "Notifications Disabled",
          description: "You can enable them later in your browser settings.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      toast({
        title: "Error",
        description: "Failed to enable notifications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeUser = async () => {
    if (!('serviceWorker' in navigator && 'PushManager' in window)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Get VAPID public key from server
      const vapidResponse = await fetch('/api/notifications/vapid-key');
      const { publicKey } = await vapidResponse.json();
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey,
      });

      // Send subscription to server
      const authKey = localStorage.getItem('sessionId');
      
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authKey}`,
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
        }),
      });

      setIsSubscribed(true);
    } catch (error) {
      console.error('Error subscribing user:', error);
      throw error;
    }
  };

  const unsubscribeUser = async () => {
    if (!('serviceWorker' in navigator && 'PushManager' in window)) {
      return;
    }

    setIsLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        
        // Remove subscription from server
        const authKey = localStorage.getItem('sessionId');
        
        await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authKey}`,
          },
          body: JSON.stringify({ userId }),
        });

        setIsSubscribed(false);
        toast({
          title: "Notifications Disabled",
          description: "You will no longer receive push notifications.",
        });
      }
    } catch (error) {
      console.error('Error unsubscribing user:', error);
      toast({
        title: "Error",
        description: "Failed to disable notifications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonContent = () => {
    if (permissionStatus === 'granted' && isSubscribed) {
      return {
        icon: <Bell className="w-4 h-4" />,
        text: "Notifications On",
        variant: "default" as const,
        onClick: unsubscribeUser,
      };
    } else if (permissionStatus === 'granted' && !isSubscribed) {
      return {
        icon: <BellOff className="w-4 h-4" />,
        text: "Enable Notifications",
        variant: "outline" as const,
        onClick: subscribeUser,
      };
    } else {
      return {
        icon: <Bell className="w-4 h-4" />,
        text: "Enable Notifications",
        variant: "outline" as const,
        onClick: requestPermission,
      };
    }
  };

  const buttonContent = getButtonContent();

  if (!('Notification' in window)) {
    return null;
  }

  return (
    <>
      <Button
        onClick={buttonContent.onClick}
        variant={buttonContent.variant}
        size="sm"
        disabled={isLoading}
        className="gap-2"
      >
        {buttonContent.icon}
        {isLoading ? "Loading..." : buttonContent.text}
      </Button>

      {/* Manual enablement modal for denied permissions */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <BellOff className="w-5 h-5 text-orange-500" />
              Enable Notifications
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-white mb-2">
                Notifications are currently blocked
              </div>
              <div className="text-sm text-zinc-400">
                To receive daily learning reminders, you'll need to enable notifications in your browser settings.
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-zinc-800 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div>
                  <div className="font-medium text-white mb-1">Click the lock icon</div>
                  <div className="text-sm text-zinc-400">
                    Look for the lock icon in your browser's address bar
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-zinc-800 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div>
                  <div className="font-medium text-white mb-1">Change notifications to "Allow"</div>
                  <div className="text-sm text-zinc-400">
                    Select "Allow" for notifications and refresh the page
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
              <div className="text-orange-400 font-medium text-sm mb-1">
                Why enable notifications?
              </div>
              <div className="text-zinc-300 text-sm">
                Get daily reminders for your Bitcoin lessons and maintain your learning streak!
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={() => setShowModal(false)}
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