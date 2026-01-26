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

// Notification Scheduler - Automated template-based notifications

import { notificationTemplates, automatedNotificationLog, userProgress, contentDays, contentSetUpQuestions } from '@shared/schema';
import { desc } from 'drizzle-orm';

export interface SchedulerUserContext {
  userId: number;
  firstName: string;
  currentStreak: number;
  currentDay: number;
  lastActivityDate: string | null;
  notificationsEnabled: boolean;
  notificationTime: string;
  quietHoursStart: number | null;
  quietHoursEnd: number | null;
  timezone: string;
}

export async function getEligibleUsersForNotification(category: string): Promise<SchedulerUserContext[]> {
  const now = new Date();

  const allUsers = await db.select({
    id: users.id,
    firstName: users.firstName,
    currentStreak: users.currentStreak,
    lastActivityDate: users.lastActivityDate,
    notificationsEnabled: users.notificationsEnabled,
    notificationTime: users.notificationTime,
    quietHoursStart: users.quietHoursStart,
    quietHoursEnd: users.quietHoursEnd,
    timezone: users.timezone,
  })
  .from(users)
  .where(eq(users.notificationsEnabled, true));

  const userContexts: SchedulerUserContext[] = [];

  for (const user of allUsers) {
    const progress = await db.select()
      .from(userProgress)
      .where(eq(userProgress.userId, user.id))
      .orderBy(desc(userProgress.dayIndex))
      .limit(1);

    const currentStreak = user.currentStreak || 0;
    const currentDay = progress[0]?.dayIndex || 1;
    const lastActivityDate = user.lastActivityDate || null;

    let eligible = false;
    let daysSinceActive = 0;
    
    if (lastActivityDate) {
      const lastActive = new Date(lastActivityDate);
      daysSinceActive = (now.getTime() - lastActive.getTime()) / (24 * 60 * 60 * 1000);
    }

    switch (category) {
      case 'morning_spark':
        eligible = true;
        break;
      case 'streak_coach':
        eligible = currentStreak > 0;
        break;
      case 'reengagement_soft':
        eligible = daysSinceActive >= 3 && daysSinceActive < 7;
        break;
      case 'reengagement_medium':
        eligible = daysSinceActive >= 7 && daysSinceActive < 14;
        break;
      case 'reengagement_hard':
        eligible = daysSinceActive >= 14;
        break;
      case 'price_alert':
        eligible = true;
        break;
      case 'milestone':
        eligible = currentDay % 7 === 0 || [30, 60, 90, 180, 336].includes(currentDay);
        break;
      default:
        eligible = true;
    }

    if (eligible) {
      userContexts.push({
        userId: user.id,
        firstName: user.firstName || 'Learner',
        currentStreak,
        currentDay,
        lastActivityDate,
        notificationsEnabled: user.notificationsEnabled ?? true,
        notificationTime: user.notificationTime || 'morning',
        quietHoursStart: user.quietHoursStart || null,
        quietHoursEnd: user.quietHoursEnd || null,
        timezone: user.timezone || 'America/New_York',
      });
    }
  }

  return userContexts;
}

export function renderTemplate(template: string, context: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return context[key] || match;
  });
}

export async function sendScheduledNotification(
  templateId: number,
  userId: number,
  context: Record<string, string>
): Promise<{ success: boolean; error?: string }> {
  const template = await db.select()
    .from(notificationTemplates)
    .where(eq(notificationTemplates.id, templateId))
    .limit(1);

  if (!template[0] || template[0].status !== 'approved') {
    return { success: false, error: 'Template not found or not approved' };
  }

  const renderedTitle = renderTemplate(template[0].title, context);
  const renderedBody = renderTemplate(template[0].body, context);

  const result = await sendNotificationToUser(userId, {
    title: renderedTitle,
    body: renderedBody,
    data: { templateId, category: template[0].category },
  });

  await db.insert(automatedNotificationLog).values({
    templateId,
    userId,
    category: template[0].category,
    renderedTitle,
    renderedBody,
    deliveryStatus: result.sent > 0 ? 'sent' : 'failed',
    sentAt: new Date(),
  });

  return { success: result.sent > 0 };
}

export async function runScheduledNotificationBatch(category: string): Promise<{
  processed: number;
  sent: number;
  failed: number;
}> {
  const approvedTemplates = await db.select()
    .from(notificationTemplates)
    .where(and(
      eq(notificationTemplates.category, category),
      eq(notificationTemplates.status, 'approved')
    ));

  if (approvedTemplates.length === 0) {
    return { processed: 0, sent: 0, failed: 0 };
  }

  const eligibleUsers = await getEligibleUsersForNotification(category);
  let sent = 0;
  let failed = 0;

  for (const user of eligibleUsers) {
    const template = approvedTemplates[Math.floor(Math.random() * approvedTemplates.length)];
    
    const todaysLesson = await db.select()
      .from(contentDays)
      .where(eq(contentDays.dayIndex, user.currentDay))
      .limit(1);

    const context = {
      firstName: user.firstName,
      currentStreak: String(user.currentStreak),
      dayNumber: String(user.currentDay),
      lessonTitle: todaysLesson[0]?.title || 'Your Next Bitcoin Lesson',
      btcPrice: '$97,250', // This would be fetched from CoinGecko in production
    };

    const result = await sendScheduledNotification(template.id, user.userId, context);
    
    if (result.success) {
      sent++;
    } else {
      failed++;
    }
  }

  return { processed: eligibleUsers.length, sent, failed };
}

export async function getAutomatedNotificationStats(): Promise<{
  totalSent: number;
  last24Hours: number;
  byCategory: Record<string, number>;
}> {
  const allLogs = await db.select().from(automatedNotificationLog);
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const byCategory: Record<string, number> = {};
  let last24Hours = 0;
  
  for (const log of allLogs) {
    if (log.category) {
      byCategory[log.category] = (byCategory[log.category] || 0) + 1;
    }
    if (new Date(log.sentAt!) > oneDayAgo) {
      last24Hours++;
    }
  }
  
  return {
    totalSent: allLogs.filter(l => l.deliveryStatus === 'sent').length,
    last24Hours,
    byCategory,
  };
}

// ============================================
// SET UP QUESTIONS NOTIFICATION SYSTEM
// Hybrid approach: Questions for active users, Templates for lapsed users
// ============================================

export interface SetUpQuestionNotificationConfig {
  morningTime: string;  // e.g., "08:00"
  noonTime: string;     // e.g., "12:00"
  eveningTime: string;  // e.g., "18:00"
  enabled: boolean;
}

export interface SetUpQuestion {
  id: number;
  title: string;
  content: string;
  category: string;
  icon: string;
  orderIndex: number;
}

export async function getSetUpQuestionsForDay(dayIndex: number): Promise<SetUpQuestion[]> {
  const day = await db.select()
    .from(contentDays)
    .where(eq(contentDays.dayIndex, dayIndex))
    .limit(1);
  
  if (!day[0]) {
    return [];
  }

  const questions = await db.select()
    .from(contentSetUpQuestions)
    .where(and(
      eq(contentSetUpQuestions.dayId, day[0].id),
      sql`${contentSetUpQuestions.archivedAt} IS NULL`
    ))
    .orderBy(contentSetUpQuestions.orderIndex);

  return questions.map(q => ({
    id: q.id,
    title: q.title,
    content: q.content,
    category: q.category,
    icon: q.icon,
    orderIndex: q.orderIndex,
  }));
}

export async function getActiveUsersForQuestionNotifications(): Promise<SchedulerUserContext[]> {
  const now = new Date();

  const allUsers = await db.select({
    id: users.id,
    firstName: users.firstName,
    currentStreak: users.currentStreak,
    lastActivityDate: users.lastActivityDate,
    notificationsEnabled: users.notificationsEnabled,
    notificationTime: users.notificationTime,
    quietHoursStart: users.quietHoursStart,
    quietHoursEnd: users.quietHoursEnd,
    timezone: users.timezone,
  })
  .from(users)
  .where(eq(users.notificationsEnabled, true));

  const userContexts: SchedulerUserContext[] = [];

  for (const user of allUsers) {
    const progress = await db.select()
      .from(userProgress)
      .where(eq(userProgress.userId, user.id))
      .orderBy(desc(userProgress.dayIndex))
      .limit(1);

    const currentDay = progress[0]?.dayIndex || 1;
    const lastActivityDate = user.lastActivityDate || null;

    let daysSinceActive = 0;
    if (lastActivityDate) {
      const lastActive = new Date(lastActivityDate);
      daysSinceActive = (now.getTime() - lastActive.getTime()) / (24 * 60 * 60 * 1000);
    }

    // Only include ACTIVE users (idle < 7 days) for question notifications
    // Lapsed users (7+ days) get template-based re-engagement notifications
    if (daysSinceActive < 7) {
      userContexts.push({
        userId: user.id,
        firstName: user.firstName || 'Learner',
        currentStreak: user.currentStreak || 0,
        currentDay,
        lastActivityDate,
        notificationsEnabled: user.notificationsEnabled ?? true,
        notificationTime: user.notificationTime || 'morning',
        quietHoursStart: user.quietHoursStart || null,
        quietHoursEnd: user.quietHoursEnd || null,
        timezone: user.timezone || 'America/New_York',
      });
    }
  }

  return userContexts;
}

export type QuestionSlot = 'morning' | 'noon' | 'evening';

export async function sendSetUpQuestionNotification(
  userId: number,
  firstName: string,
  question: SetUpQuestion,
  dayIndex: number,
  slot: QuestionSlot
): Promise<{ success: boolean; error?: string }> {
  // Format the notification - question title as notification title, content as body
  const title = question.title;
  const body = question.content.length > 150 
    ? question.content.substring(0, 147) + '...' 
    : question.content;

  const result = await sendNotificationToUser(userId, {
    title,
    body,
    data: { 
      type: 'setup_question',
      questionId: question.id,
      dayIndex,
      slot,
      category: question.category,
    },
  });

  // Log the notification
  await db.insert(automatedNotificationLog).values({
    userId,
    category: `setup_question_${slot}`,
    renderedTitle: title,
    renderedBody: body,
    deliveryStatus: result.sent > 0 ? 'sent' : 'failed',
    sentAt: new Date(),
    questionId: question.id,
  });

  return { success: result.sent > 0 };
}

export async function runSetUpQuestionBatch(slot: QuestionSlot): Promise<{
  processed: number;
  sent: number;
  failed: number;
  questionsUsed: number;
}> {
  const activeUsers = await getActiveUsersForQuestionNotifications();
  
  let sent = 0;
  let failed = 0;
  const questionsUsed = new Set<number>();

  for (const user of activeUsers) {
    const questions = await getSetUpQuestionsForDay(user.currentDay);
    
    if (questions.length === 0) {
      continue;
    }

    // Map slot to question index (morning=0, noon=1, evening=2)
    const slotIndex = slot === 'morning' ? 0 : slot === 'noon' ? 1 : 2;
    const question = questions[slotIndex] || questions[0]; // Fallback to first if fewer than 3

    if (question) {
      questionsUsed.add(question.id);
      const result = await sendSetUpQuestionNotification(
        user.userId,
        user.firstName,
        question,
        user.currentDay,
        slot
      );

      if (result.success) {
        sent++;
      } else {
        failed++;
      }
    }
  }

  return { 
    processed: activeUsers.length, 
    sent, 
    failed, 
    questionsUsed: questionsUsed.size 
  };
}

export async function runHybridNotificationScheduler(slot: QuestionSlot): Promise<{
  activeUsers: { processed: number; sent: number; failed: number };
  lapsedUsers: { processed: number; sent: number; failed: number };
}> {
  // Run set up questions for active users
  const activeResult = await runSetUpQuestionBatch(slot);

  // Run template-based re-engagement for lapsed users (7+ days)
  // Only run re-engagement during morning slot to avoid spam
  let lapsedResult = { processed: 0, sent: 0, failed: 0 };
  
  if (slot === 'morning') {
    // Soft re-engagement (3-7 days)
    const softResult = await runScheduledNotificationBatch('reengagement_soft');
    
    // Medium re-engagement (7-14 days)  
    const mediumResult = await runScheduledNotificationBatch('reengagement_medium');
    
    // Hard re-engagement (14+ days)
    const hardResult = await runScheduledNotificationBatch('reengagement_hard');
    
    lapsedResult = {
      processed: softResult.processed + mediumResult.processed + hardResult.processed,
      sent: softResult.sent + mediumResult.sent + hardResult.sent,
      failed: softResult.failed + mediumResult.failed + hardResult.failed,
    };
  }

  return { activeUsers: activeResult, lapsedUsers: lapsedResult };
}

export async function previewQuestionsForDay(dayIndex: number): Promise<{
  dayIndex: number;
  dayTitle: string;
  questions: { slot: QuestionSlot; title: string; content: string; category: string }[];
}> {
  const day = await db.select()
    .from(contentDays)
    .where(eq(contentDays.dayIndex, dayIndex))
    .limit(1);

  if (!day[0]) {
    return { dayIndex, dayTitle: 'Day not found', questions: [] };
  }

  const questions = await getSetUpQuestionsForDay(dayIndex);
  const slots: QuestionSlot[] = ['morning', 'noon', 'evening'];

  return {
    dayIndex,
    dayTitle: day[0].title,
    questions: questions.slice(0, 3).map((q, i) => ({
      slot: slots[i] || 'morning',
      title: q.title,
      content: q.content,
      category: q.category,
    })),
  };
}
