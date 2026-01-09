import { SNSClient, PublishCommand, CreatePlatformEndpointCommand, DeleteEndpointCommand, SetEndpointAttributesCommand } from '@aws-sdk/client-sns';
import { db } from './db';
import { deviceTokens, pushNotifications, users } from '@shared/schema';
import { eq, inArray, and, sql } from 'drizzle-orm';

const snsClient = new SNSClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

const IOS_PLATFORM_ARN = process.env.AWS_SNS_IOS_PLATFORM_ARN;
const ANDROID_PLATFORM_ARN = process.env.AWS_SNS_ANDROID_PLATFORM_ARN;

export interface DeviceTokenData {
  userId: number;
  token: string;
  platform: 'ios' | 'android';
  deviceId?: string;
  appVersion?: string;
  osVersion?: string;
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  badge?: number;
  sound?: string;
}

async function createOrUpdatePlatformEndpoint(token: string, platform: 'ios' | 'android'): Promise<string | null> {
  const platformArn = platform === 'ios' ? IOS_PLATFORM_ARN : ANDROID_PLATFORM_ARN;
  
  if (!platformArn) {
    console.warn(`SNS platform ARN not configured for ${platform}`);
    return null;
  }

  try {
    const command = new CreatePlatformEndpointCommand({
      PlatformApplicationArn: platformArn,
      Token: token,
    });

    const response = await snsClient.send(command);
    return response.EndpointArn || null;
  } catch (error: any) {
    if (error.name === 'InvalidParameterException' && error.message?.includes('already exists')) {
      const match = error.message.match(/Endpoint (arn:aws:sns:[^:]+:[^:]+:endpoint\/[^\s]+)/);
      if (match) {
        const existingArn = match[1];
        await snsClient.send(new SetEndpointAttributesCommand({
          EndpointArn: existingArn,
          Attributes: { Token: token, Enabled: 'true' },
        }));
        return existingArn;
      }
    }
    console.error('Error creating platform endpoint:', error);
    return null;
  }
}

export async function registerDeviceToken(data: DeviceTokenData): Promise<{ success: boolean; endpointArn?: string }> {
  const endpointArn = await createOrUpdatePlatformEndpoint(data.token, data.platform);
  
  const existingToken = await db.select()
    .from(deviceTokens)
    .where(and(
      eq(deviceTokens.userId, data.userId),
      eq(deviceTokens.token, data.token)
    ))
    .limit(1);

  if (existingToken.length > 0) {
    await db.update(deviceTokens)
      .set({
        platform: data.platform,
        deviceId: data.deviceId,
        appVersion: data.appVersion,
        osVersion: data.osVersion,
        isActive: true,
        lastUsedAt: new Date(),
      })
      .where(eq(deviceTokens.id, existingToken[0].id));
  } else {
    await db.insert(deviceTokens).values({
      userId: data.userId,
      token: data.token,
      platform: data.platform,
      deviceId: data.deviceId,
      appVersion: data.appVersion,
      osVersion: data.osVersion,
    });
  }

  return { success: true, endpointArn: endpointArn || undefined };
}

export async function unregisterDeviceToken(userId: number, token: string): Promise<void> {
  await db.update(deviceTokens)
    .set({ isActive: false })
    .where(and(
      eq(deviceTokens.userId, userId),
      eq(deviceTokens.token, token)
    ));
}

export async function sendPushNotification(
  token: string,
  platform: 'ios' | 'android',
  payload: PushNotificationPayload
): Promise<boolean> {
  try {
    const endpointArn = await createOrUpdatePlatformEndpoint(token, platform);
    
    if (!endpointArn) {
      console.warn(`Could not create endpoint for token`);
      return false;
    }

    let message: string;
    
    if (platform === 'ios') {
      message = JSON.stringify({
        APNS: JSON.stringify({
          aps: {
            alert: {
              title: payload.title,
              body: payload.body,
            },
            badge: payload.badge,
            sound: payload.sound || 'default',
          },
          ...payload.data,
        }),
      });
    } else {
      message = JSON.stringify({
        GCM: JSON.stringify({
          notification: {
            title: payload.title,
            body: payload.body,
          },
          data: payload.data || {},
        }),
      });
    }

    const command = new PublishCommand({
      TargetArn: endpointArn,
      Message: message,
      MessageStructure: 'json',
    });

    await snsClient.send(command);
    return true;
  } catch (error) {
    console.error('Failed to send push notification:', error);
    return false;
  }
}

export async function sendBulkNotification(
  notificationId: number
): Promise<{ sent: number; failed: number }> {
  const [notification] = await db.select()
    .from(pushNotifications)
    .where(eq(pushNotifications.id, notificationId));

  if (!notification) {
    throw new Error('Notification not found');
  }

  await db.update(pushNotifications)
    .set({ status: 'sending', updatedAt: new Date() })
    .where(eq(pushNotifications.id, notificationId));

  let tokensQuery = db.select()
    .from(deviceTokens)
    .where(eq(deviceTokens.isActive, true));

  if (notification.targetAudience === 'ios') {
    tokensQuery = tokensQuery.where(eq(deviceTokens.platform, 'ios')) as any;
  } else if (notification.targetAudience === 'android') {
    tokensQuery = tokensQuery.where(eq(deviceTokens.platform, 'android')) as any;
  } else if (notification.targetAudience === 'specific_users' && notification.targetUserIds) {
    tokensQuery = tokensQuery.where(inArray(deviceTokens.userId, notification.targetUserIds)) as any;
  }

  const tokens = await tokensQuery;

  let sent = 0;
  let failed = 0;

  const payload: PushNotificationPayload = {
    title: notification.title,
    body: notification.body,
    data: (notification.data as Record<string, any>) || undefined,
  };

  for (const token of tokens) {
    const success = await sendPushNotification(
      token.token,
      token.platform as 'ios' | 'android',
      payload
    );
    
    if (success) {
      sent++;
    } else {
      failed++;
      await db.update(deviceTokens)
        .set({ isActive: false })
        .where(eq(deviceTokens.id, token.id));
    }
  }

  await db.update(pushNotifications)
    .set({
      status: failed === tokens.length ? 'failed' : 'sent',
      sentAt: new Date(),
      sentCount: sent,
      failedCount: failed,
      updatedAt: new Date(),
    })
    .where(eq(pushNotifications.id, notificationId));

  return { sent, failed };
}

export async function sendNotificationToUser(
  userId: number,
  payload: PushNotificationPayload
): Promise<{ sent: number; failed: number }> {
  const tokens = await db.select()
    .from(deviceTokens)
    .where(and(
      eq(deviceTokens.userId, userId),
      eq(deviceTokens.isActive, true)
    ));

  let sent = 0;
  let failed = 0;

  for (const token of tokens) {
    const success = await sendPushNotification(
      token.token,
      token.platform as 'ios' | 'android',
      payload
    );
    
    if (success) {
      sent++;
    } else {
      failed++;
    }
  }

  return { sent, failed };
}

export function isSNSConfigured(): boolean {
  return !!(process.env.AWS_ACCESS_KEY_ID && 
    process.env.AWS_SECRET_ACCESS_KEY && 
    (process.env.AWS_SNS_IOS_PLATFORM_ARN || process.env.AWS_SNS_ANDROID_PLATFORM_ARN));
}

export async function getDeviceTokenStats(): Promise<{
  total: number;
  ios: number;
  android: number;
  active: number;
}> {
  const allTokens = await db.select().from(deviceTokens);
  
  return {
    total: allTokens.length,
    ios: allTokens.filter(t => t.platform === 'ios').length,
    android: allTokens.filter(t => t.platform === 'android').length,
    active: allTokens.filter(t => t.isActive).length,
  };
}
