import type { Express } from "express";
import { storage } from "./storage";
import { z } from "zod";

// Wallet earning schema for validation
const walletEarningSchema = z.object({
  dayIndex: z.number(),
  earningType: z.enum(['quiz_correct', 'quiz_perfect', 'lesson_complete', 'streak_bonus']),
  satoshisEarned: z.number().min(1),
  bitcoinPriceUsd: z.number().min(0),
  description: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const walletAchievementSchema = z.object({
  achievementType: z.string(),
  title: z.string(),
  description: z.string(),
  iconName: z.string(),
  satoshisThreshold: z.number().optional(),
  usdValueThreshold: z.number().optional(),
});

// Demo user middleware for wallet routes
function setDefaultUser(req: any, res: any, next: any) {
  req.user = { id: 1 };
  next();
}

export function registerWalletRoutes(app: Express, requireAuth: any) {
  // Get user's wallet progress
  app.get("/api/wallet/progress", setDefaultUser, async (req: any, res) => {
    try {
      const wallet = await storage.getUserWalletProgress(req.user.id);
      const currentBitcoinPrice = await getCurrentBitcoinPrice();
      const { totalSats, totalUsdValue } = await storage.getTotalEarningsValue(req.user.id, currentBitcoinPrice);
      
      res.json({
        totalSatoshisEarned: totalSats,
        totalUsdValue,
        currentBitcoinPrice,
        currentStreakMultiplier: wallet?.currentStreakMultiplier || 1.0,
        lastEarningDate: wallet?.lastEarningDate
      });
    } catch (error) {
      console.error("Error fetching wallet progress:", error);
      res.status(500).json({ message: "Failed to get wallet progress" });
    }
  });

  // Get user's wallet earnings history
  app.get("/api/wallet/earnings", setDefaultUser, async (req: any, res) => {
    try {
      const earnings = await storage.getUserWalletEarnings(req.user.id);
      res.json(earnings);
    } catch (error) {
      console.error("Error fetching wallet earnings:", error);
      res.status(500).json({ message: "Failed to get wallet earnings" });
    }
  });

  // Get user's wallet earnings for a specific day
  app.get("/api/wallet/earnings/:dayIndex", setDefaultUser, async (req: any, res) => {
    try {
      const dayIndex = parseInt(req.params.dayIndex);
      const earnings = await storage.getUserWalletEarningsByDay(req.user.id, dayIndex);
      res.json(earnings);
    } catch (error) {
      console.error("Error fetching daily wallet earnings:", error);
      res.status(500).json({ message: "Failed to get daily wallet earnings" });
    }
  });

  // Add a new wallet earning (called when user completes activities)
  app.post("/api/wallet/earn", setDefaultUser, async (req: any, res) => {
    try {
      const earningData = walletEarningSchema.parse(req.body);
      const currentBitcoinPrice = await getCurrentBitcoinPrice();
      
      // Calculate USD value at time of earning
      const usdValueAtEarning = (earningData.satoshisEarned / 100000000) * currentBitcoinPrice;
      
      const earning = await storage.addWalletEarning({
        userId: req.user.id,
        dayIndex: earningData.dayIndex,
        earningType: earningData.earningType,
        satoshisEarned: earningData.satoshisEarned,
        streakMultiplier: "1.00",
        bitcoinPriceUsd: currentBitcoinPrice.toString(),
        usdValueAtEarning: usdValueAtEarning.toString(),
        description: earningData.description,
        date: earningData.date
      });

      // Check for achievements
      await checkForAchievements(req.user.id, earning.satoshisEarned);

      res.json({
        earning,
        message: `Earned ${earningData.satoshisEarned} sats!`,
        usdValue: usdValueAtEarning
      });
    } catch (error) {
      console.error("Error adding wallet earning:", error);
      res.status(500).json({ message: "Failed to add wallet earning" });
    }
  });

  // Get user's wallet achievements
  app.get("/api/wallet/achievements", setDefaultUser, async (req: any, res) => {
    try {
      const achievements = await storage.getUserWalletAchievements(req.user.id);
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching wallet achievements:", error);
      res.status(500).json({ message: "Failed to get wallet achievements" });
    }
  });

  // Get wallet dashboard data (combined endpoint for efficiency)
  app.get("/api/wallet/dashboard", setDefaultUser, async (req: any, res) => {
    try {
      const currentBitcoinPrice = await getCurrentBitcoinPrice();
      const wallet = await storage.getUserWalletProgress(req.user.id);
      const { totalSats, totalUsdValue } = await storage.getTotalEarningsValue(req.user.id, currentBitcoinPrice);
      const recentEarnings = await storage.getUserWalletEarnings(req.user.id);
      const achievements = await storage.getUserWalletAchievements(req.user.id);
      
      res.json({
        totalSatoshisEarned: totalSats,
        totalUsdValue,
        currentBitcoinPrice,
        currentStreakMultiplier: wallet?.currentStreakMultiplier || 1.0,
        lastEarningDate: wallet?.lastEarningDate,
        recentEarnings: recentEarnings.slice(0, 10), // Last 10 earnings
        achievements,
        weeklyEarnings: getWeeklyEarnings(recentEarnings),
        monthlyEarnings: getMonthlyEarnings(recentEarnings)
      });
    } catch (error) {
      console.error("Error fetching wallet dashboard:", error);
      res.status(500).json({ message: "Failed to get wallet dashboard" });
    }
  });
}

// Helper function to get current Bitcoin price
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
  return 109000; // Fallback price
}

// Helper function to check for achievements
async function checkForAchievements(userId: number, newSatsEarned: number): Promise<void> {
  try {
    const wallet = await storage.getUserWalletProgress(userId);
    const totalSats = wallet?.totalSatoshisEarned || 0;
    const currentBitcoinPrice = await getCurrentBitcoinPrice();
    const totalUsdValue = (totalSats / 100000000) * currentBitcoinPrice;

    // Achievement thresholds
    const achievements = [
      { type: 'first_sats', threshold: 1, title: 'First Sats Earned!', description: 'You earned your first satoshis from learning!', icon: 'star' },
      { type: 'first_1000_sats', threshold: 1000, title: 'Satoshi Stacker', description: 'Earned your first 1,000 satoshis!', icon: 'coins' },
      { type: 'first_10000_sats', threshold: 10000, title: 'Ten Thousand Club', description: 'Reached 10,000 satoshis earned!', icon: 'trophy' },
      { type: 'coffee_money', usdThreshold: 5, title: 'Coffee Money', description: 'Your knowledge is worth a cup of coffee!', icon: 'coffee' },
      { type: 'pizza_money', usdThreshold: 20, title: 'Pizza Money', description: 'Your Bitcoin knowledge could buy a pizza!', icon: 'pizza' },
      { type: 'dinner_money', usdThreshold: 50, title: 'Dinner Money', description: 'Your learning earned you a nice dinner!', icon: 'utensils' },
    ];

    // Check existing achievements to avoid duplicates
    const existingAchievements = await storage.getUserWalletAchievements(userId);
    const existingTypes = existingAchievements.map(a => a.achievementType);

    for (const achievement of achievements) {
      if (existingTypes.includes(achievement.type)) continue;

      const qualifies = achievement.threshold 
        ? totalSats >= achievement.threshold
        : achievement.usdThreshold && totalUsdValue >= achievement.usdThreshold;

      if (qualifies) {
        await storage.unlockWalletAchievement({
          userId,
          achievementType: achievement.type,
          title: achievement.title,
          description: achievement.description,
          iconName: achievement.icon,
          satoshisThreshold: achievement.threshold,
          usdValueThreshold: achievement.usdThreshold,
          isNotified: false
        });
      }
    }
  } catch (error) {
    console.error("Error checking achievements:", error);
  }
}

// Helper function to calculate weekly earnings
function getWeeklyEarnings(earnings: any[]): number {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  return earnings
    .filter(earning => new Date(earning.earnedAt) >= oneWeekAgo)
    .reduce((total, earning) => total + earning.satoshisEarned, 0);
}

// Helper function to calculate monthly earnings
function getMonthlyEarnings(earnings: any[]): number {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  return earnings
    .filter(earning => new Date(earning.earnedAt) >= oneMonthAgo)
    .reduce((total, earning) => total + earning.satoshisEarned, 0);
}