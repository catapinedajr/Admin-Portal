import { Express } from "express";
import { db } from "./db";
import { users, referralCodes, referralEvents, walletEarnings, userWalletProgress } from "@shared/schema";
import { eq, sql, desc, and } from "drizzle-orm";
import { v4 as uuidv4 } from 'uuid';

const REFERRAL_REWARDS = {
  signup: { referrer: 50, referee: 50 },
  streak_7: { referrer: 100, referee: 100 },
  subscription: { referrer: 500, referee: 500 },
};

function generateReferralCode(firstName: string): string {
  const cleanName = firstName.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${cleanName}${randomSuffix}`;
}

export function registerReferralRoutes(app: Express, requireAuth: any) {
  app.get("/api/referral/my-code", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      let user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user[0]) {
        return res.status(404).json({ message: "User not found" });
      }
      
      let referralCode = user[0].referralCode;
      
      if (!referralCode) {
        referralCode = generateReferralCode(user[0].firstName);
        
        let codeExists = await db.select().from(users).where(eq(users.referralCode, referralCode)).limit(1);
        while (codeExists.length > 0) {
          referralCode = generateReferralCode(user[0].firstName);
          codeExists = await db.select().from(users).where(eq(users.referralCode, referralCode)).limit(1);
        }
        
        await db.update(users).set({ referralCode }).where(eq(users.id, userId));
      }
      
      const referrals = await db.select().from(users).where(eq(users.referredByUserId, userId));
      const events = await db.select().from(referralEvents).where(eq(referralEvents.referrerUserId, userId));
      
      const totalPointsEarned = events.reduce((sum, e) => sum + e.referrerPointsAwarded, 0);
      
      res.json({
        code: referralCode,
        shareUrl: `${process.env.APP_URL || 'https://hodlearn.com'}/signup?ref=${referralCode}`,
        stats: {
          totalReferrals: referrals.length,
          totalPointsEarned,
          pendingMilestones: referrals.filter(r => {
            const signupEvent = events.find(e => e.refereeUserId === r.id && e.eventType === 'signup');
            return !signupEvent;
          }).length,
        }
      });
    } catch (error) {
      console.error("Error getting referral code:", error);
      res.status(500).json({ message: "Failed to get referral code" });
    }
  });

  app.get("/api/referral/my-referrals", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      const referrals = await db
        .select({
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          createdAt: users.createdAt,
          currentStreak: users.currentStreak,
        })
        .from(users)
        .where(eq(users.referredByUserId, userId))
        .orderBy(desc(users.createdAt));
      
      const events = await db
        .select()
        .from(referralEvents)
        .where(eq(referralEvents.referrerUserId, userId));
      
      const referralsWithStatus = referrals.map(referral => {
        const referralEvents = events.filter(e => e.refereeUserId === referral.id);
        return {
          ...referral,
          milestones: {
            signup: referralEvents.some(e => e.eventType === 'signup'),
            streak_7: referralEvents.some(e => e.eventType === 'streak_7'),
            subscription: referralEvents.some(e => e.eventType === 'subscription'),
          },
          pointsEarned: referralEvents.reduce((sum, e) => sum + e.referrerPointsAwarded, 0),
        };
      });
      
      res.json({ referrals: referralsWithStatus });
    } catch (error) {
      console.error("Error getting referrals:", error);
      res.status(500).json({ message: "Failed to get referrals" });
    }
  });

  app.post("/api/referral/validate-code", async (req, res) => {
    try {
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({ valid: false, message: "Code is required" });
      }
      
      const referrer = await db.select({
        id: users.id,
        firstName: users.firstName,
      }).from(users).where(eq(users.referralCode, code.toUpperCase())).limit(1);
      
      if (!referrer[0]) {
        return res.json({ valid: false, message: "Invalid referral code" });
      }
      
      res.json({
        valid: true,
        referrerFirstName: referrer[0].firstName,
        message: `You'll both earn ${REFERRAL_REWARDS.signup.referee} points when you sign up!`,
      });
    } catch (error) {
      console.error("Error validating referral code:", error);
      res.status(500).json({ valid: false, message: "Failed to validate code" });
    }
  });

  app.post("/api/referral/apply-code", requireAuth, async (req: any, res) => {
    try {
      const { code } = req.body;
      const userId = req.user.id;
      
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user[0]) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (user[0].referredByUserId) {
        return res.status(400).json({ message: "You've already used a referral code" });
      }
      
      const referrer = await db.select().from(users).where(eq(users.referralCode, code.toUpperCase())).limit(1);
      if (!referrer[0]) {
        return res.status(400).json({ message: "Invalid referral code" });
      }
      
      if (referrer[0].id === userId) {
        return res.status(400).json({ message: "You cannot use your own referral code" });
      }
      
      await db.update(users).set({ referredByUserId: referrer[0].id }).where(eq(users.id, userId));
      
      await db.insert(referralEvents).values({
        referrerUserId: referrer[0].id,
        refereeUserId: userId,
        eventType: 'signup',
        referrerPointsAwarded: REFERRAL_REWARDS.signup.referrer,
        refereePointsAwarded: REFERRAL_REWARDS.signup.referee,
        metadata: { appliedAt: new Date().toISOString() },
      });
      
      res.json({
        success: true,
        message: `You and ${referrer[0].firstName} both earned ${REFERRAL_REWARDS.signup.referee} points!`,
        pointsEarned: REFERRAL_REWARDS.signup.referee,
      });
    } catch (error) {
      console.error("Error applying referral code:", error);
      res.status(500).json({ message: "Failed to apply referral code" });
    }
  });

  app.get("/api/admin/referrals/stats", requireAuth, async (req: any, res) => {
    try {
      const totalReferrals = await db.select({ count: sql<number>`count(*)` }).from(users).where(sql`referred_by_user_id IS NOT NULL`);
      const totalEvents = await db.select({ count: sql<number>`count(*)` }).from(referralEvents);
      const totalPointsAwarded = await db.select({ 
        total: sql<number>`COALESCE(SUM(referrer_points_awarded + referee_points_awarded), 0)` 
      }).from(referralEvents);
      
      const allUsers = await db.select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        referredByUserId: users.referredByUserId,
      }).from(users);
      
      const referrerCounts: Record<number, { userId: number; firstName: string; lastName: string; referralCount: number }> = {};
      for (const user of allUsers) {
        if (user.referredByUserId) {
          const referrer = allUsers.find(u => u.id === user.referredByUserId);
          if (referrer) {
            if (!referrerCounts[referrer.id]) {
              referrerCounts[referrer.id] = {
                userId: referrer.id,
                firstName: referrer.firstName,
                lastName: referrer.lastName,
                referralCount: 0,
              };
            }
            referrerCounts[referrer.id].referralCount++;
          }
        }
      }
      
      const topReferrers = Object.values(referrerCounts)
        .sort((a, b) => b.referralCount - a.referralCount)
        .slice(0, 10);
      
      res.json({
        totalReferrals: Number(totalReferrals[0]?.count || 0),
        totalEvents: Number(totalEvents[0]?.count || 0),
        totalPointsAwarded: Number(totalPointsAwarded[0]?.total || 0),
        topReferrers,
      });
    } catch (error) {
      console.error("Error getting referral stats:", error);
      res.status(500).json({ message: "Failed to get referral stats" });
    }
  });

  app.get("/api/admin/referrals/events", requireAuth, async (req: any, res) => {
    try {
      const events = await db
        .select({
          id: referralEvents.id,
          eventType: referralEvents.eventType,
          referrerPointsAwarded: referralEvents.referrerPointsAwarded,
          refereePointsAwarded: referralEvents.refereePointsAwarded,
          occurredAt: referralEvents.occurredAt,
          referrerUserId: referralEvents.referrerUserId,
          refereeUserId: referralEvents.refereeUserId,
        })
        .from(referralEvents)
        .orderBy(desc(referralEvents.occurredAt))
        .limit(100);
      
      res.json({ events });
    } catch (error) {
      console.error("Error getting referral events:", error);
      res.status(500).json({ message: "Failed to get referral events" });
    }
  });
}
