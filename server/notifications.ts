import webpush from 'web-push';
import { storage } from './storage';

// Generate VAPID keys (in production, these should be environment variables)
const VAPID_KEYS = {
  publicKey: 'BJU0vW5KYGvPnPVF7Q5B-YjIo8NCnkR2Z4T8J-0YIK5zVfWnI2-I5-fDV1HQT4G8YGW5YkQe7Zh1v2VXMXYg5r8',
  privateKey: 'PVYSyJzLqO8pZqV0e7GhV7UjNMZsQwXnOhGfY3kQT4I'
};

webpush.setVapidDetails(
  'mailto:support@hodlearn.app',
  VAPID_KEYS.publicKey,
  VAPID_KEYS.privateKey
);

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
}

export class NotificationService {
  static getVapidPublicKey(): string {
    return VAPID_KEYS.publicKey;
  }

  static async subscribeUser(userId: number, subscription: PushSubscriptionJSON): Promise<void> {
    try {
      // Store subscription in database
      await storage.createPushSubscription({
        userId,
        endpoint: subscription.endpoint || '',
        p256dhKey: subscription.keys?.p256dh || '',
        authKey: subscription.keys?.auth || '',
        isActive: true,
      });
    } catch (error) {
      console.error('Error storing push subscription:', error);
      throw error;
    }
  }

  static async unsubscribeUser(userId: number): Promise<void> {
    try {
      await storage.deletePushSubscriptionsByUserId(userId);
    } catch (error) {
      console.error('Error removing push subscriptions:', error);
      throw error;
    }
  }

  static async sendNotificationToUser(userId: number, payload: NotificationPayload): Promise<void> {
    try {
      const subscriptions = await storage.getPushSubscriptionsByUserId(userId);
      
      const sendPromises = subscriptions.map(async (sub) => {
        try {
          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dhKey,
              auth: sub.authKey,
            },
          };

          await webpush.sendNotification(
            pushSubscription,
            JSON.stringify(payload)
          );

          // Update last used timestamp
          await storage.updatePushSubscriptionLastUsed(sub.id);
        } catch (error) {
          console.error(`Failed to send notification to subscription ${sub.id}:`, error);
          // If subscription is invalid, mark as inactive
          if (error instanceof Error && error.message.includes('410')) {
            await storage.deletePushSubscriptionsByUserId(userId);
          }
        }
      });

      await Promise.allSettled(sendPromises);
    } catch (error) {
      console.error('Error sending notifications:', error);
      throw error;
    }
  }

  static async sendDailyReminder(userId: number, dayNumber: number): Promise<void> {
    const payload: NotificationPayload = {
      title: 'Your Bitcoin lesson is ready! 🧡',
      body: `Day ${dayNumber} of your Bitcoin journey awaits. Keep building your conviction!`,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      data: {
        type: 'daily_reminder',
        dayNumber,
        url: '/learn',
      },
    };

    await this.sendNotificationToUser(userId, payload);
  }

  static async sendStreakAlert(userId: number, streakCount: number): Promise<void> {
    const payload: NotificationPayload = {
      title: `Don't break your ${streakCount}-day streak! 🔥`,
      body: 'Your Bitcoin learning streak is at risk. Complete today\'s lesson to keep it going!',
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      data: {
        type: 'streak_alert',
        streakCount,
        url: '/learn',
      },
    };

    await this.sendNotificationToUser(userId, payload);
  }

  static async sendMotivationalMessage(userId: number, message: string): Promise<void> {
    const payload: NotificationPayload = {
      title: 'HODLearn Motivation',
      body: message,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      data: {
        type: 'motivation',
        url: '/',
      },
    };

    await this.sendNotificationToUser(userId, payload);
  }

  static async broadcastToAllUsers(payload: NotificationPayload): Promise<void> {
    try {
      const allSubscriptions = await storage.getAllActivePushSubscriptions();
      
      const sendPromises = allSubscriptions.map(async (sub) => {
        try {
          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dhKey,
              auth: sub.authKey,
            },
          };

          await webpush.sendNotification(
            pushSubscription,
            JSON.stringify(payload)
          );

          await storage.updatePushSubscriptionLastUsed(sub.id);
        } catch (error) {
          console.error(`Failed to send broadcast to subscription ${sub.id}:`, error);
          if (error instanceof Error && error.message.includes('410')) {
            await storage.deletePushSubscriptionsByUserId(sub.userId);
          }
        }
      });

      await Promise.allSettled(sendPromises);
    } catch (error) {
      console.error('Error broadcasting notifications:', error);
      throw error;
    }
  }
}

export default NotificationService;