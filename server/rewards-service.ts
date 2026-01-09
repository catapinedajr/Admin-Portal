import { db } from "./db";
import { 
  rewardConfig, 
  walletEarnings, 
  userWalletProgress,
  leaderboardPeriods,
  leaderboardEntries,
  users
} from "@shared/schema";
import { eq, and, gte, lte, isNull, desc, asc, sql } from "drizzle-orm";

export type RewardType = 
  | 'quiz_correct' 
  | 'quiz_perfect' 
  | 'daily_complete'
  | 'streak_7' 
  | 'streak_30' 
  | 'streak_100' 
  | 'streak_365'
  | 'referral_signup'
  | 'referral_streak_7'
  | 'referral_subscription'
  | 'community_post'
  | 'community_upvote'
  | 'community_helpful'
  | 'first_lesson'
  | 'profile_complete'
  | 'email_verified';

interface RewardResult {
  success: boolean;
  satoshisEarned: number;
  usdValue: number;
  message: string;
  earningId?: number;
}

async function getCurrentBitcoinPrice(): Promise<number> {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    if (response.ok) {
      const data = await response.json();
      return data.bitcoin.usd;
    }
  } catch (error) {
    console.error("Error fetching Bitcoin price:", error);
  }
  return 109000;
}

export async function getRewardConfig(rewardType: RewardType) {
  const [config] = await db
    .select()
    .from(rewardConfig)
    .where(and(
      eq(rewardConfig.rewardType, rewardType),
      eq(rewardConfig.isActive, true)
    ))
    .limit(1);
  return config;
}

export async function getActiveRewardConfigs() {
  return db
    .select()
    .from(rewardConfig)
    .where(eq(rewardConfig.isActive, true))
    .orderBy(asc(rewardConfig.sortOrder));
}

async function checkDailyLimit(userId: number, rewardType: string, maxPerDay: number | null): Promise<boolean> {
  if (!maxPerDay) return true;
  
  const today = new Date().toISOString().split('T')[0];
  const todayStart = new Date(today);
  const todayEnd = new Date(today);
  todayEnd.setDate(todayEnd.getDate() + 1);
  
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(walletEarnings)
    .where(and(
      eq(walletEarnings.userId, userId),
      eq(walletEarnings.earningType, rewardType),
      gte(walletEarnings.earnedAt, todayStart),
      lte(walletEarnings.earnedAt, todayEnd)
    ));
  
  return (result?.count || 0) < maxPerDay;
}

async function getUserStreakMultiplier(userId: number): Promise<number> {
  const [progress] = await db
    .select({ currentStreakMultiplier: userWalletProgress.currentStreakMultiplier })
    .from(userWalletProgress)
    .where(eq(userWalletProgress.userId, userId))
    .limit(1);
  
  return parseFloat(progress?.currentStreakMultiplier || "1.0");
}

export async function awardPoints(
  userId: number,
  rewardType: RewardType,
  options?: {
    dayIndex?: number;
    description?: string;
    skipDailyCheck?: boolean;
  }
): Promise<RewardResult> {
  const config = await getRewardConfig(rewardType);
  
  if (!config) {
    return {
      success: false,
      satoshisEarned: 0,
      usdValue: 0,
      message: `Reward type ${rewardType} not found or inactive`
    };
  }
  
  if (!options?.skipDailyCheck) {
    const withinLimit = await checkDailyLimit(userId, rewardType, config.maxPerDay);
    if (!withinLimit) {
      return {
        success: false,
        satoshisEarned: 0,
        usdValue: 0,
        message: `Daily limit reached for ${config.displayName}`
      };
    }
  }
  
  let satoshisEarned = config.baseSatoshis;
  let streakMultiplier = 1.0;
  
  if (config.multiplierEligible) {
    streakMultiplier = await getUserStreakMultiplier(userId);
    satoshisEarned = Math.floor(config.baseSatoshis * streakMultiplier);
  }
  
  const bitcoinPrice = await getCurrentBitcoinPrice();
  const usdValue = (satoshisEarned / 100000000) * bitcoinPrice;
  const today = new Date().toISOString().split('T')[0];
  
  const [earning] = await db
    .insert(walletEarnings)
    .values({
      userId,
      dayIndex: options?.dayIndex || 0,
      earningType: rewardType,
      satoshisEarned,
      streakMultiplier: streakMultiplier.toFixed(2),
      bitcoinPriceUsd: bitcoinPrice.toString(),
      usdValueAtEarning: usdValue.toFixed(6),
      description: options?.description || config.displayName,
      date: today,
    })
    .returning();
  
  await updateWalletProgress(userId, satoshisEarned);
  
  return {
    success: true,
    satoshisEarned,
    usdValue,
    message: `Earned ${satoshisEarned} sats for ${config.displayName}!`,
    earningId: earning.id
  };
}

async function updateWalletProgress(userId: number, satoshisEarned: number): Promise<void> {
  const [existing] = await db
    .select()
    .from(userWalletProgress)
    .where(eq(userWalletProgress.userId, userId))
    .limit(1);
  
  if (existing) {
    await db
      .update(userWalletProgress)
      .set({
        totalSatoshisEarned: existing.totalSatoshisEarned + satoshisEarned,
        lastEarningDate: new Date().toISOString().split('T')[0],
        updatedAt: new Date(),
      })
      .where(eq(userWalletProgress.userId, userId));
  } else {
    await db
      .insert(userWalletProgress)
      .values({
        userId,
        totalSatoshisEarned: satoshisEarned,
        currentStreakMultiplier: "1.00",
        lastEarningDate: new Date().toISOString().split('T')[0],
      });
  }
}

export async function checkAndAwardStreakMilestones(userId: number, streakDays: number): Promise<RewardResult[]> {
  const results: RewardResult[] = [];
  
  const milestones: { days: number; rewardType: RewardType }[] = [
    { days: 7, rewardType: 'streak_7' },
    { days: 30, rewardType: 'streak_30' },
    { days: 100, rewardType: 'streak_100' },
    { days: 365, rewardType: 'streak_365' },
  ];
  
  for (const milestone of milestones) {
    if (streakDays === milestone.days) {
      const result = await awardPoints(userId, milestone.rewardType, {
        description: `${milestone.days}-day streak milestone!`,
        skipDailyCheck: true
      });
      results.push(result);
    }
  }
  
  return results;
}

export async function getUserLeaderboardPosition(userId: number, periodId?: number): Promise<{
  rank: number | null;
  totalSatoshis: number;
  periodName: string;
  nearbyUsers: Array<{ 
    rank: number; 
    userId: number;
    username: string; 
    displayName: string | null;
    avatarUrl: string | null;
    totalSatoshis: number; 
    streakDays: number;
    quizzesCompleted: number;
    isCurrentUser: boolean;
  }>;
}> {
  let activePeriodId = periodId;
  let periodName = 'Current Period';
  
  if (!activePeriodId) {
    const [activePeriod] = await db
      .select()
      .from(leaderboardPeriods)
      .where(eq(leaderboardPeriods.isActive, true))
      .orderBy(desc(leaderboardPeriods.startDate))
      .limit(1);
    
    if (!activePeriod) {
      return { rank: null, totalSatoshis: 0, periodName, nearbyUsers: [] };
    }
    activePeriodId = activePeriod.id;
    periodName = activePeriod.name;
  } else {
    const [period] = await db.select().from(leaderboardPeriods).where(eq(leaderboardPeriods.id, periodId)).limit(1);
    if (period) periodName = period.name;
  }
  
  const [userEntry] = await db
    .select()
    .from(leaderboardEntries)
    .where(and(
      eq(leaderboardEntries.periodId, activePeriodId),
      eq(leaderboardEntries.userId, userId)
    ))
    .limit(1);
  
  if (!userEntry) {
    const topEntries = await db
      .select({
        rank: leaderboardEntries.rank,
        userId: leaderboardEntries.userId,
        totalSatoshis: leaderboardEntries.totalSatoshis,
        username: users.username,
        streakDays: users.currentStreak,
        quizzesCompleted: users.completedLessons,
      })
      .from(leaderboardEntries)
      .innerJoin(users, eq(users.id, leaderboardEntries.userId))
      .where(eq(leaderboardEntries.periodId, activePeriodId))
      .orderBy(asc(leaderboardEntries.rank))
      .limit(10);
    
    return {
      rank: null,
      totalSatoshis: 0,
      periodName,
      nearbyUsers: topEntries.map(e => ({
        rank: e.rank,
        userId: e.userId,
        username: e.username,
        displayName: null,
        avatarUrl: null,
        totalSatoshis: e.totalSatoshis,
        streakDays: e.streakDays,
        quizzesCompleted: e.quizzesCompleted,
        isCurrentUser: false
      }))
    };
  }
  
  const nearbyEntries = await db
    .select({
      rank: leaderboardEntries.rank,
      userId: leaderboardEntries.userId,
      totalSatoshis: leaderboardEntries.totalSatoshis,
      username: users.username,
      streakDays: users.currentStreak,
      quizzesCompleted: users.completedLessons,
    })
    .from(leaderboardEntries)
    .innerJoin(users, eq(users.id, leaderboardEntries.userId))
    .where(and(
      eq(leaderboardEntries.periodId, activePeriodId),
      gte(leaderboardEntries.rank, Math.max(1, userEntry.rank - 2)),
      lte(leaderboardEntries.rank, userEntry.rank + 2)
    ))
    .orderBy(asc(leaderboardEntries.rank));
  
  return {
    rank: userEntry.rank,
    totalSatoshis: userEntry.totalSatoshis,
    periodName,
    nearbyUsers: nearbyEntries.map(e => ({
      rank: e.rank,
      userId: e.userId,
      username: e.username,
      displayName: null,
      avatarUrl: null,
      totalSatoshis: e.totalSatoshis,
      streakDays: e.streakDays,
      quizzesCompleted: e.quizzesCompleted,
      isCurrentUser: e.userId === userId
    }))
  };
}

export async function getLeaderboardRankings(periodId: number, limit: number = 20, currentUserId?: number): Promise<Array<{
  rank: number;
  userId: number;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  totalSatoshis: number;
  learningSatoshis: number;
  streakSatoshis: number;
  referralSatoshis: number;
  communitySatoshis: number;
  streakDays: number;
  quizzesCompleted: number;
  isCurrentUser: boolean;
}>> {
  const entries = await db
    .select({
      rank: leaderboardEntries.rank,
      userId: leaderboardEntries.userId,
      username: users.username,
      totalSatoshis: leaderboardEntries.totalSatoshis,
      learningSatoshis: leaderboardEntries.learningSatoshis,
      streakSatoshis: leaderboardEntries.streakSatoshis,
      referralSatoshis: leaderboardEntries.referralSatoshis,
      communitySatoshis: leaderboardEntries.communitySatoshis,
      streakDays: users.currentStreak,
      quizzesCompleted: users.completedLessons,
    })
    .from(leaderboardEntries)
    .innerJoin(users, eq(users.id, leaderboardEntries.userId))
    .where(eq(leaderboardEntries.periodId, periodId))
    .orderBy(asc(leaderboardEntries.rank))
    .limit(limit);
  
  return entries.map(e => ({
    ...e,
    displayName: null,
    avatarUrl: null,
    isCurrentUser: currentUserId ? e.userId === currentUserId : false
  }));
}

export async function getActiveLeaderboardPeriods() {
  return db
    .select()
    .from(leaderboardPeriods)
    .where(eq(leaderboardPeriods.isActive, true))
    .orderBy(desc(leaderboardPeriods.startDate));
}
