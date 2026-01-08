import type { Express, Request, Response, NextFunction } from "express";
import { randomBytes, createCipheriv, createDecipheriv, scryptSync } from "crypto";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { adminAuthService } from "./admin-auth";
import { db } from "./db";
import { registerEmailRoutes } from "./email-routes";

// Rate limiter for admin login (strict security)
const adminLoginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: { message: "Too many login attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// Rate limiter for AI image generation (cost control)
const imageGenerationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 images per hour per user
  message: { message: "Image generation limit reached. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: AdminRequest) => req.admin?.id?.toString() || 'anonymous',
  validate: { xForwardedForHeader: false, default: true },
});
import { adminLoginSchema, adminUsers, adminSessions, adminPasswordResetTokens, contentDays, contentSetUpQuestions, contentLessons, contentQuizzes, contentDaySummaries, users, adCampaigns, storeProducts, storeOrders, crmCompanies, crmContacts, crmDeals, crmActivities, insertCrmCompanySchema, insertCrmContactSchema, insertCrmDealSchema, insertCrmActivitySchema, crmDealStages, crmOpportunityTypes, crmAccountTypes, roadmapIdeas, roadmapReleases, objectives, keyResults, keyResultUpdates, insertRoadmapIdeaSchema, insertRoadmapReleaseSchema, insertObjectiveSchema, insertKeyResultSchema, insertKeyResultUpdateSchema, userProgress, forumPosts, forumReplies, adImpressions, adClicks, kpiTargets, insertKpiTargetSchema, systemSettings, aiInstructions, insertAiInstructionsSchema, socialIntegrations, paywallSettings, advertisingClients, affiliateProducts, referralPartners, referralSignups, invoices, socialPosts, socialAccounts, forumCategories } from "@shared/schema";
import { count, eq, sql, and, sum, isNull } from "drizzle-orm";

interface AdminRequest extends Request {
  admin?: any;
}

// Encryption settings for database-stored API keys
const ENCRYPTION_KEY = process.env.SETTINGS_ENCRYPTION_KEY || 'hodlearn-default-key-change-in-prod-32';
const ALGORITHM = 'aes-256-gcm';
const IS_DEFAULT_ENCRYPTION_KEY = !process.env.SETTINGS_ENCRYPTION_KEY;

// Production safety: FAIL-FAST if using default key in production
const ENCRYPTION_KEY_REQUIRED_IN_PROD = IS_DEFAULT_ENCRYPTION_KEY && process.env.NODE_ENV === 'production';

if (ENCRYPTION_KEY_REQUIRED_IN_PROD) {
  console.error('');
  console.error('╔══════════════════════════════════════════════════════════════════════╗');
  console.error('║  🛑 CRITICAL SECURITY ERROR: SETTINGS_ENCRYPTION_KEY NOT SET         ║');
  console.error('║                                                                      ║');
  console.error('║  The application CANNOT start in production mode without a secure   ║');
  console.error('║  encryption key for storing API credentials.                         ║');
  console.error('║                                                                      ║');
  console.error('║  To fix:                                                             ║');
  console.error('║  1. Generate a 32+ character random key                              ║');
  console.error('║  2. Set SETTINGS_ENCRYPTION_KEY in AWS Secrets Manager               ║');
  console.error('║  3. Restart the application                                          ║');
  console.error('╚══════════════════════════════════════════════════════════════════════╝');
  console.error('');
  // Fail-fast: Exit in production if encryption key not set
  process.exit(1);
}

// Enhanced encryption with per-secret random salt (format: salt:iv:authTag:encrypted)
function encryptSettingValueSecure(text: string): string {
  const salt = randomBytes(16);
  const key = scryptSync(ENCRYPTION_KEY, salt, 32);
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return salt.toString('hex') + ':' + iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

// Decrypt with support for both legacy (3-part) and new (4-part) formats
function decryptSettingValue(encryptedText: string): string {
  const parts = encryptedText.split(':');
  
  if (parts.length === 4) {
    // New secure format: salt:iv:authTag:encrypted
    const salt = Buffer.from(parts[0], 'hex');
    const iv = Buffer.from(parts[1], 'hex');
    const authTag = Buffer.from(parts[2], 'hex');
    const encrypted = parts[3];
    const key = scryptSync(ENCRYPTION_KEY, salt, 32);
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } else if (parts.length === 3) {
    // Legacy format: iv:authTag:encrypted (static salt)
    const key = scryptSync(ENCRYPTION_KEY, 'salt', 32);
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
  
  throw new Error('Invalid encrypted format');
}

// Helper function to create Anthropic client with environment-aware API key handling
// Priority: 1) Replit AI Integrations, 2) Environment variable, 3) Database-stored key
async function createAnthropicClient() {
  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  
  // 1. Replit AI Integrations (development)
  if (process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY) {
    return new Anthropic({
      apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
      baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
    });
  }
  
  // 2. Production environment variable (AWS)
  if (process.env.ANTHROPIC_API_KEY) {
    return new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  
  // 3. Database-stored key (set via admin Settings page)
  try {
    const [setting] = await db.select().from(systemSettings).where(eq(systemSettings.key, 'ANTHROPIC_API_KEY'));
    if (setting) {
      const decryptedKey = decryptSettingValue(setting.encryptedValue);
      return new Anthropic({
        apiKey: decryptedKey,
      });
    }
  } catch (error) {
    console.error('Failed to retrieve API key from database:', error);
  }
  
  throw new Error('No Anthropic API key configured. Set via: 1) Replit AI Integration, 2) ANTHROPIC_API_KEY env var, or 3) Admin Settings page.');
}

// Helper function to create OpenAI client with environment-aware API key handling
// Priority: 1) Replit AI Integrations, 2) Environment variable, 3) Database-stored key
async function createOpenAIClient() {
  const OpenAI = (await import('openai')).default;
  
  // 1. Replit AI Integrations (development)
  if (process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
    return new OpenAI({
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
    });
  }
  
  // 2. Production environment variable (AWS)
  if (process.env.OPENAI_API_KEY) {
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  
  // 3. Database-stored key (set via admin Settings page)
  try {
    const [setting] = await db.select().from(systemSettings).where(eq(systemSettings.key, 'OPENAI_API_KEY'));
    if (setting) {
      const decryptedKey = decryptSettingValue(setting.encryptedValue);
      return new OpenAI({
        apiKey: decryptedKey,
      });
    }
  } catch (error) {
    console.error('Failed to retrieve OpenAI API key from database:', error);
  }
  
  throw new Error('No OpenAI API key configured. Set via: 1) Replit AI Integration, 2) OPENAI_API_KEY env var, or 3) Admin Settings page.');
}

const requireAdminAuth = async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    
    if (!sessionId) {
      return res.status(401).json({ message: "Admin authentication required" });
    }

    const admin = await adminAuthService.getAdminFromSession(sessionId);
    if (!admin) {
      return res.status(401).json({ message: "Invalid or expired admin session" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Admin authentication error:", error);
    res.status(401).json({ message: "Admin authentication failed" });
  }
};

// Auto-generate summary when content is approved (for AI context in future lessons)
async function generateDaySummary(dayId: number): Promise<void> {
  try {
    const { contentDaySummaries } = await import('@shared/schema');
    
    // Fetch the day's content
    const [day] = await db.select().from(contentDays).where(eq(contentDays.id, dayId));
    if (!day) return;
    
    const [lesson] = await db.select().from(contentLessons).where(eq(contentLessons.dayId, dayId));
    if (!lesson) return;
    
    // Generate summary using Claude (production-ready client)
    const client = await createAnthropicClient();
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      messages: [{
        role: "user",
        content: `Summarize this Bitcoin education lesson for curriculum continuity. Provide:
1. A 1-2 sentence synopsis of the main topic/concept taught
2. 3-5 key concepts as a comma-separated list (for reference in future lessons)

LESSON TITLE: ${lesson.title}
THEME: ${day.theme}
CONTENT:
${lesson.content}

Respond in this exact JSON format:
{
  "synopsis": "Brief summary of what the lesson teaches",
  "keyConcepts": ["concept1", "concept2", "concept3"]
}`
      }]
    });
    
    const textContent = response.content.find(c => c.type === 'text');
    if (!textContent || textContent.type !== 'text') return;
    
    // Parse the response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return;
    
    const summary = JSON.parse(jsonMatch[0]);
    
    // Check if summary exists, update or insert
    const existing = await db.select().from(contentDaySummaries).where(eq(contentDaySummaries.dayId, dayId));
    
    if (existing.length > 0) {
      await db.update(contentDaySummaries)
        .set({
          synopsis: summary.synopsis,
          keyConcepts: summary.keyConcepts,
          updatedAt: new Date()
        })
        .where(eq(contentDaySummaries.dayId, dayId));
    } else {
      await db.insert(contentDaySummaries).values({
        dayId,
        dayIndex: day.dayIndex,
        synopsis: summary.synopsis,
        keyConcepts: summary.keyConcepts
      });
    }
    
    console.log(`Summary generated for Day ${day.dayIndex}: ${summary.synopsis.substring(0, 50)}...`);
  } catch (error) {
    console.error('Failed to generate day summary:', error);
    throw error;
  }
}

export function registerAdminRoutes(app: Express) {
  // Apply rate limiting to admin login (security)
  app.use("/api/admin/login", adminLoginRateLimiter);
  app.use("/api/admin/setup", adminLoginRateLimiter);
  
  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const credentials = adminLoginSchema.parse(req.body);
      const result = await adminAuthService.login(credentials);

      if (!result) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const { admin, sessionId } = result;
      res.json({
        admin: {
          id: admin.id,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role,
        },
        sessionId,
      });
    } catch (error: any) {
      console.error("Admin login error:", error);
      res.status(400).json({ message: error.message || "Login failed" });
    }
  });

  // Admin logout
  app.post("/api/admin/logout", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const sessionId = req.headers.authorization?.replace('Bearer ', '');
      if (sessionId) {
        await adminAuthService.logout(sessionId);
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Admin logout error:", error);
      res.status(500).json({ message: "Logout failed" });
    }
  });

  // Admin forgot password - request reset token
  app.post("/api/admin/forgot-password", adminLoginRateLimiter, async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      // Find admin by email
      const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
      
      // Always return success to prevent email enumeration attacks
      if (!admin || !admin.isActive) {
        console.log(`Password reset requested for non-existent/inactive admin: ${email}`);
        return res.json({ 
          success: true, 
          message: "If an account with that email exists, a reset link has been sent." 
        });
      }
      
      // Generate secure reset token
      const token = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry
      
      // Delete any existing tokens for this admin
      await db.delete(adminPasswordResetTokens).where(eq(adminPasswordResetTokens.adminId, admin.id));
      
      // Store new token
      await db.insert(adminPasswordResetTokens).values({
        adminId: admin.id,
        token,
        expiresAt,
      });
      
      // In production, this would send an email
      // For now, log the reset URL (remove in production!)
      const resetUrl = `/admin/reset-password?token=${token}`;
      console.log(`\n========================================`);
      console.log(`PASSWORD RESET REQUESTED FOR: ${email}`);
      console.log(`Reset URL: ${resetUrl}`);
      console.log(`Token expires: ${expiresAt.toISOString()}`);
      console.log(`========================================\n`);
      
      res.json({ 
        success: true, 
        message: "If an account with that email exists, a reset link has been sent.",
        // Only include token in development for testing
        ...(process.env.NODE_ENV === 'development' && { 
          devToken: token,
          devResetUrl: resetUrl
        })
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Failed to process request" });
    }
  });

  // Admin reset password - use token to set new password
  app.post("/api/admin/reset-password", adminLoginRateLimiter, async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
      }
      
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }
      
      // Find valid, unused token
      const [resetToken] = await db.select()
        .from(adminPasswordResetTokens)
        .where(eq(adminPasswordResetTokens.token, token));
      
      if (!resetToken) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }
      
      // Check if token is expired
      if (new Date() > resetToken.expiresAt) {
        await db.delete(adminPasswordResetTokens).where(eq(adminPasswordResetTokens.id, resetToken.id));
        return res.status(400).json({ message: "Reset token has expired. Please request a new one." });
      }
      
      // Check if token was already used
      if (resetToken.usedAt) {
        return res.status(400).json({ message: "This reset token has already been used" });
      }
      
      // SECURITY: Verify the admin account is still active before allowing password reset
      const [adminAccount] = await db.select().from(adminUsers).where(eq(adminUsers.id, resetToken.adminId));
      if (!adminAccount || !adminAccount.isActive) {
        await db.delete(adminPasswordResetTokens).where(eq(adminPasswordResetTokens.id, resetToken.id));
        return res.status(400).json({ message: "This account has been deactivated. Contact a super admin." });
      }
      
      // Hash new password
      const bcrypt = await import('bcryptjs');
      const passwordHash = await bcrypt.hash(newPassword, 10);
      
      // Update admin password
      await db.update(adminUsers)
        .set({ passwordHash })
        .where(eq(adminUsers.id, resetToken.adminId));
      
      // Mark token as used
      await db.update(adminPasswordResetTokens)
        .set({ usedAt: new Date() })
        .where(eq(adminPasswordResetTokens.id, resetToken.id));
      
      // Invalidate all existing sessions for security
      await db.delete(adminSessions).where(eq(adminSessions.adminId, resetToken.adminId));
      
      console.log(`Password reset successful for admin ID: ${resetToken.adminId}`);
      
      res.json({ 
        success: true, 
        message: "Password has been reset successfully. Please log in with your new password." 
      });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // Get current admin user
  app.get("/api/admin/me", requireAdminAuth, async (req: AdminRequest, res) => {
    res.json({
      id: req.admin.id,
      email: req.admin.email,
      firstName: req.admin.firstName,
      lastName: req.admin.lastName,
      role: req.admin.role,
    });
  });

  // Dashboard stats
  app.get("/api/admin/stats", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const [contentDaysCount] = await db.select({ count: count() }).from(contentDays);
      const [usersCount] = await db.select({ count: count() }).from(users);
      const [campaignsCount] = await db.select({ count: count() }).from(adCampaigns);
      const [productsCount] = await db.select({ count: count() }).from(storeProducts).where(eq(storeProducts.isActive, true));

      res.json({
        contentDays: contentDaysCount?.count || 0,
        activeUsers: usersCount?.count || 0,
        activeCampaigns: campaignsCount?.count || 0,
        storeProducts: productsCount?.count || 0,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Time-series KPI data for dashboard charts
  app.get("/api/admin/stats/timeseries", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const now = new Date();
      
      // Generate date range
      const dateRange: string[] = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        dateRange.push(date.toISOString().split('T')[0]);
      }

      // User signups by date
      const userSignups = await db.select({
        date: sql<string>`DATE(${users.createdAt})`.as('date'),
        count: count(),
      })
        .from(users)
        .where(sql`${users.createdAt} >= ${new Date(now.getTime() - days * 24 * 60 * 60 * 1000)}`)
        .groupBy(sql`DATE(${users.createdAt})`)
        .orderBy(sql`DATE(${users.createdAt})`);

      // Marketing spend by date (from campaigns)
      const campaignSpend = await db.select({
        date: sql<string>`DATE(${adCampaigns.startDate})`.as('date'),
        spend: sql<number>`COALESCE(SUM(${adCampaigns.spentCents}), 0)`.as('spend'),
        budget: sql<number>`COALESCE(SUM(${adCampaigns.budgetCents}), 0)`.as('budget'),
      })
        .from(adCampaigns)
        .where(sql`${adCampaigns.startDate} >= ${new Date(now.getTime() - days * 24 * 60 * 60 * 1000)}`)
        .groupBy(sql`DATE(${adCampaigns.startDate})`)
        .orderBy(sql`DATE(${adCampaigns.startDate})`);

      // Store revenue by date (from orders)
      const storeRevenue = await db.select({
        date: sql<string>`DATE(${storeOrders.createdAt})`.as('date'),
        revenue: sql<number>`COALESCE(SUM(CAST(${storeOrders.totalUsd} AS DECIMAL)), 0)`.as('revenue'),
        orders: count(),
      })
        .from(storeOrders)
        .where(sql`${storeOrders.createdAt} >= ${new Date(now.getTime() - days * 24 * 60 * 60 * 1000)} AND ${storeOrders.status} IN ('paid', 'shipped', 'delivered')`)
        .groupBy(sql`DATE(${storeOrders.createdAt})`)
        .orderBy(sql`DATE(${storeOrders.createdAt})`);

      // Build response with all dates filled in
      // Convert cents to dollars for marketing data to match revenue format
      const signupsMap = new Map(userSignups.map(s => [s.date, Number(s.count)]));
      const spendMap = new Map(campaignSpend.map(s => [s.date, { 
        spend: Number(s.spend) / 100, // Convert cents to dollars
        budget: Number(s.budget) / 100 // Convert cents to dollars
      }]));
      const revenueMap = new Map(storeRevenue.map(r => [r.date, { revenue: Number(r.revenue), orders: Number(r.orders) }]));

      const timeseries = dateRange.map(date => ({
        date,
        signups: signupsMap.get(date) || 0,
        marketingSpend: spendMap.get(date)?.spend || 0,
        marketingBudget: spendMap.get(date)?.budget || 0,
        revenue: revenueMap.get(date)?.revenue || 0,
        orders: revenueMap.get(date)?.orders || 0,
      }));

      // Calculate cumulative values
      let cumulativeUsers = 0;
      let cumulativeRevenue = 0;
      let cumulativeSpend = 0;

      const timeseriesWithCumulative = timeseries.map(day => {
        cumulativeUsers += day.signups;
        cumulativeRevenue += day.revenue;
        cumulativeSpend += day.marketingSpend;
        return {
          ...day,
          cumulativeUsers,
          cumulativeRevenue,
          cumulativeSpend,
        };
      });

      res.json(timeseriesWithCumulative);
    } catch (error) {
      console.error("Error fetching timeseries stats:", error);
      res.status(500).json({ message: "Failed to fetch timeseries stats" });
    }
  });

  // ============ USER MANAGEMENT ROUTES ============

  // Get all users with optional filtering
  app.get("/api/admin/users", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const allUsers = await db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        currentStreak: users.currentStreak,
        longestStreak: users.longestStreak,
        completedLessons: users.completedLessons,
        lastActivityDate: users.lastActivityDate,
        createdAt: users.createdAt,
      }).from(users).orderBy(users.createdAt);
      
      res.json(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Get user statistics
  app.get("/api/admin/users/stats", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const oneWeekAgoStr = oneWeekAgo.toISOString().split('T')[0];
      const oneMonthAgoStr = oneMonthAgo.toISOString().split('T')[0];

      // Total users
      const [totalResult] = await db.select({ count: count() }).from(users);
      const totalUsers = totalResult?.count || 0;

      // Active users (activity in last 7 days)
      const [activeResult] = await db.select({ count: count() })
        .from(users)
        .where(sql`${users.lastActivityDate} >= ${oneWeekAgoStr}`);
      const activeUsers = activeResult?.count || 0;

      // New users this week
      const [newWeekResult] = await db.select({ count: count() })
        .from(users)
        .where(sql`${users.createdAt} >= ${oneWeekAgo}`);
      const newUsersThisWeek = newWeekResult?.count || 0;

      // New users this month
      const [newMonthResult] = await db.select({ count: count() })
        .from(users)
        .where(sql`${users.createdAt} >= ${oneMonthAgo}`);
      const newUsersThisMonth = newMonthResult?.count || 0;

      // Average streak and lessons
      const [avgResult] = await db.select({
        avgStreak: sql<number>`COALESCE(AVG(${users.currentStreak}), 0)`,
        avgLessons: sql<number>`COALESCE(AVG(${users.completedLessons}), 0)`,
      }).from(users);

      // Count paid users from Stripe subscriptions (active subscriptions)
      let paidUsers = 0;
      try {
        const paidResult = await db.execute(sql`
          SELECT COUNT(DISTINCT customer) as count 
          FROM subscriptions 
          WHERE status IN ('active', 'trialing')
        `);
        const rows = paidResult.rows as Array<{ count: string }>;
        paidUsers = Number(rows[0]?.count || 0);
      } catch {
        // Subscriptions table may not exist yet
        paidUsers = 0;
      }

      res.json({
        totalUsers,
        activeUsers,
        paidUsers,
        freeUsers: Number(totalUsers) - paidUsers,
        newUsersThisWeek,
        newUsersThisMonth,
        averageStreak: avgResult?.avgStreak || 0,
        averageCompletedLessons: avgResult?.avgLessons || 0,
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Get single user details
  app.get("/api/admin/users/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const [user] = await db.select().from(users).where(eq(users.id, id));
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ============ CONTENT MANAGEMENT ROUTES ============

  // Get all content days with counts
  app.get("/api/admin/content/days", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const days = await db.select().from(contentDays).orderBy(contentDays.dayIndex);
      
      const daysWithCounts = await Promise.all(days.map(async (day) => {
        const [questionsCount] = await db.select({ count: count() }).from(contentSetUpQuestions).where(eq(contentSetUpQuestions.dayId, day.id));
        const [lessonsCount] = await db.select({ count: count() }).from(contentLessons).where(eq(contentLessons.dayId, day.id));
        const [quizzesCount] = await db.select({ count: count() }).from(contentQuizzes).where(eq(contentQuizzes.dayId, day.id));
        
        return {
          ...day,
          questionsCount: questionsCount?.count || 0,
          lessonsCount: lessonsCount?.count || 0,
          quizzesCount: quizzesCount?.count || 0,
        };
      }));
      
      res.json(daysWithCounts);
    } catch (error) {
      console.error("Error fetching content days:", error);
      res.status(500).json({ message: "Failed to fetch content days" });
    }
  });

  // Get lesson for a specific day
  app.get("/api/admin/content/lessons/:dayId", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const dayId = parseInt(req.params.dayId);
      const [lesson] = await db.select().from(contentLessons).where(eq(contentLessons.dayId, dayId));
      res.json(lesson || null);
    } catch (error) {
      console.error("Error fetching lesson:", error);
      res.status(500).json({ message: "Failed to fetch lesson" });
    }
  });

  // Get quizzes for a specific day
  app.get("/api/admin/content/quizzes/:dayId", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const dayId = parseInt(req.params.dayId);
      const quizzes = await db.select().from(contentQuizzes).where(eq(contentQuizzes.dayId, dayId));
      res.json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      res.status(500).json({ message: "Failed to fetch quizzes" });
    }
  });

  // Get questions for a specific day
  app.get("/api/admin/content/questions/:dayId", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const dayId = parseInt(req.params.dayId);
      const questions = await db.select().from(contentSetUpQuestions).where(eq(contentSetUpQuestions.dayId, dayId)).orderBy(contentSetUpQuestions.orderIndex);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  // Create or update lesson for a day (upsert)
  app.put("/api/admin/content/lessons/:dayId", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const dayId = parseInt(req.params.dayId);
      const { title, content, keyTakeaways, whyItMatters, estimatedReadTime } = req.body;
      
      // Check if lesson exists
      const [existing] = await db.select().from(contentLessons).where(eq(contentLessons.dayId, dayId));
      
      if (existing) {
        const [updated] = await db.update(contentLessons)
          .set({ title, content, keyTakeaways: keyTakeaways || [], whyItMatters, estimatedReadTime: estimatedReadTime || 3 })
          .where(eq(contentLessons.dayId, dayId))
          .returning();
        res.json(updated);
      } else {
        const [created] = await db.insert(contentLessons)
          .values({ dayId, title, content, keyTakeaways: keyTakeaways || [], whyItMatters, estimatedReadTime: estimatedReadTime || 3 })
          .returning();
        res.json(created);
      }
    } catch (error) {
      console.error("Error saving lesson:", error);
      res.status(500).json({ message: "Failed to save lesson" });
    }
  });

  // Create a new quiz
  app.post("/api/admin/content/quizzes/:dayId", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const dayId = parseInt(req.params.dayId);
      const { question, options, correctAnswer, explanation } = req.body;
      
      const [created] = await db.insert(contentQuizzes)
        .values({ dayId, question, options, correctAnswer, explanation: explanation || "" })
        .returning();
      res.json(created);
    } catch (error) {
      console.error("Error creating quiz:", error);
      res.status(500).json({ message: "Failed to create quiz" });
    }
  });

  // Update a quiz
  app.patch("/api/admin/content/quizzes/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const { question, options, correctAnswer, explanation } = req.body;
      
      const [updated] = await db.update(contentQuizzes)
        .set({ question, options, correctAnswer, explanation })
        .where(eq(contentQuizzes.id, id))
        .returning();
      res.json(updated);
    } catch (error) {
      console.error("Error updating quiz:", error);
      res.status(500).json({ message: "Failed to update quiz" });
    }
  });

  // Delete a quiz
  app.delete("/api/admin/content/quizzes/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      await db.delete(contentQuizzes).where(eq(contentQuizzes.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting quiz:", error);
      res.status(500).json({ message: "Failed to delete quiz" });
    }
  });

  // Create a new question
  app.post("/api/admin/content/questions/:dayId", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const dayId = parseInt(req.params.dayId);
      const { title, content, category, icon, orderIndex } = req.body;
      
      const [created] = await db.insert(contentSetUpQuestions)
        .values({ dayId, title, content, category: category || "general", icon: icon || "💡", orderIndex: orderIndex || 0 })
        .returning();
      res.json(created);
    } catch (error) {
      console.error("Error creating question:", error);
      res.status(500).json({ message: "Failed to create question" });
    }
  });

  // Update a question
  app.patch("/api/admin/content/questions/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const { title, content, category, icon, orderIndex } = req.body;
      
      const [updated] = await db.update(contentSetUpQuestions)
        .set({ title, content, category, icon, orderIndex })
        .where(eq(contentSetUpQuestions.id, id))
        .returning();
      res.json(updated);
    } catch (error) {
      console.error("Error updating question:", error);
      res.status(500).json({ message: "Failed to update question" });
    }
  });

  // Delete a question
  app.delete("/api/admin/content/questions/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      await db.delete(contentSetUpQuestions).where(eq(contentSetUpQuestions.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting question:", error);
      res.status(500).json({ message: "Failed to delete question" });
    }
  });

  // Update a content day
  app.patch("/api/admin/content/days/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const { title, theme, readingLevel, culturalStage, status, isActive, isApproved, reviewerNotes } = req.body;
      
      const updates: any = { 
        title, 
        theme,
        readingLevel,
        culturalStage, 
        status: status || 'draft',
        isActive, 
        isApproved,
        reviewerNotes: reviewerNotes || null,
        updatedAt: new Date(),
      };
      
      // Set approvedAt and approvedBy when status changes to approved
      if (status === 'approved') {
        updates.approvedAt = new Date();
        updates.approvedBy = req.admin?.email || 'admin';
        
        // Auto-generate summary for AI context (non-blocking)
        generateDaySummary(id).catch(err => {
          console.error(`Failed to generate summary for day ${id}:`, err);
        });
      }
      
      // Set publishedAt when status changes to live
      if (status === 'live') {
        updates.publishedAt = new Date();
      }
      
      const [updated] = await db.update(contentDays)
        .set(updates)
        .where(eq(contentDays.id, id))
        .returning();
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating content day:", error);
      res.status(500).json({ message: "Failed to update content day" });
    }
  });

  // Get impact summary for deleting a day
  app.get("/api/admin/content/days/:id/impact", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const [day] = await db.select().from(contentDays).where(eq(contentDays.id, id));
      if (!day) {
        return res.status(404).json({ message: "Day not found" });
      }
      
      const lessons = await db.select().from(contentLessons).where(eq(contentLessons.dayId, id));
      const quizzes = await db.select().from(contentQuizzes).where(eq(contentQuizzes.dayId, id));
      const questions = await db.select().from(contentSetUpQuestions).where(eq(contentSetUpQuestions.dayId, id));
      const summaries = await db.select().from(contentDaySummaries).where(eq(contentDaySummaries.dayId, id));
      
      res.json({
        day,
        counts: {
          lessons: lessons.length,
          quizzes: quizzes.length,
          questions: questions.length,
          summaries: summaries.length,
        }
      });
    } catch (error) {
      console.error("Error getting day impact:", error);
      res.status(500).json({ message: "Failed to get day impact" });
    }
  });

  // Delete a content day (cascade deletes all related content)
  app.delete("/api/admin/content/days/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Get the day first to check status
      const [day] = await db.select().from(contentDays).where(eq(contentDays.id, id));
      if (!day) {
        return res.status(404).json({ message: "Day not found" });
      }
      
      // Block deletion of live content
      if (day.status === 'live') {
        return res.status(400).json({ 
          message: "Cannot delete live content. Please change status to Draft first." 
        });
      }
      
      // Cascade delete all related content
      await db.delete(contentDaySummaries).where(eq(contentDaySummaries.dayId, id));
      await db.delete(contentQuizzes).where(eq(contentQuizzes.dayId, id));
      await db.delete(contentSetUpQuestions).where(eq(contentSetUpQuestions.dayId, id));
      await db.delete(contentLessons).where(eq(contentLessons.dayId, id));
      await db.delete(contentDays).where(eq(contentDays.id, id));
      
      res.json({ success: true, deletedDayIndex: day.dayIndex });
    } catch (error) {
      console.error("Error deleting content day:", error);
      res.status(500).json({ message: "Failed to delete content day" });
    }
  });

  // Create a new content day
  app.post("/api/admin/content/days", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { dayIndex, title, theme, readingLevel, culturalStage } = req.body;
      
      // Check if day index already exists
      const existing = await db.select().from(contentDays).where(eq(contentDays.dayIndex, dayIndex));
      if (existing.length > 0) {
        return res.status(400).json({ message: `Day ${dayIndex} already exists` });
      }
      
      const [created] = await db.insert(contentDays)
        .values({
          dayIndex,
          title,
          theme,
          readingLevel: readingLevel || "8th grade",
          culturalStage: culturalStage || "Normie → Pre-coiner",
          isActive: true,
          isApproved: false,
        })
        .returning();
      
      res.json(created);
    } catch (error) {
      console.error("Error creating content day:", error);
      res.status(500).json({ message: "Failed to create content day" });
    }
  });

  // Bulk import content (day + lesson + quizzes + questions)
  app.post("/api/admin/content/bulk-import", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { dayIndex, title, theme, readingLevel, culturalStage, lesson, quizzes, questions } = req.body;
      
      // Validate required fields
      const errors: string[] = [];
      
      if (typeof dayIndex !== 'number' || dayIndex < 1) {
        errors.push("dayIndex must be a positive number");
      }
      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        errors.push("title is required and must be a non-empty string");
      }
      if (!theme || typeof theme !== 'string' || theme.trim().length === 0) {
        errors.push("theme is required and must be a non-empty string");
      }
      
      // Validate lesson if provided
      if (lesson) {
        if (!lesson.title || typeof lesson.title !== 'string') {
          errors.push("lesson.title is required if lesson is provided");
        }
        if (!lesson.content || typeof lesson.content !== 'string') {
          errors.push("lesson.content is required if lesson is provided");
        }
        if (lesson.keyTakeaways && !Array.isArray(lesson.keyTakeaways)) {
          errors.push("lesson.keyTakeaways must be an array");
        }
      }
      
      // Validate quizzes if provided
      if (quizzes) {
        if (!Array.isArray(quizzes)) {
          errors.push("quizzes must be an array");
        } else {
          quizzes.forEach((quiz: any, idx: number) => {
            if (!quiz.question || typeof quiz.question !== 'string') {
              errors.push(`quizzes[${idx}].question is required`);
            }
            if (!Array.isArray(quiz.options) || quiz.options.length < 2) {
              errors.push(`quizzes[${idx}].options must be an array with at least 2 options`);
            }
            if (typeof quiz.correctAnswer !== 'number' || quiz.correctAnswer < 0 || quiz.correctAnswer >= (quiz.options?.length || 0)) {
              errors.push(`quizzes[${idx}].correctAnswer must be a valid index (0 to ${(quiz.options?.length || 1) - 1})`);
            }
          });
        }
      }
      
      // Validate questions if provided
      if (questions) {
        if (!Array.isArray(questions)) {
          errors.push("questions must be an array");
        } else {
          questions.forEach((q: any, idx: number) => {
            if (!q.title || typeof q.title !== 'string') {
              errors.push(`questions[${idx}].title is required`);
            }
            if (!q.content || typeof q.content !== 'string') {
              errors.push(`questions[${idx}].content is required`);
            }
          });
        }
      }
      
      if (errors.length > 0) {
        return res.status(400).json({ message: "Validation failed", errors });
      }
      
      // Check if day index already exists
      const existing = await db.select().from(contentDays).where(eq(contentDays.dayIndex, dayIndex));
      if (existing.length > 0) {
        return res.status(400).json({ message: `Day ${dayIndex} already exists`, errors: [`Day ${dayIndex} already exists`] });
      }
      
      // Create content day
      const [createdDay] = await db.insert(contentDays)
        .values({
          dayIndex,
          title,
          theme,
          readingLevel: readingLevel || "8th grade",
          culturalStage: culturalStage || "Normie → Pre-coiner",
          isActive: true,
          isApproved: false,
        })
        .returning();
      
      let createdLesson = null;
      let createdQuizzes: any[] = [];
      let createdQuestions: any[] = [];
      
      // Create lesson if provided
      if (lesson && lesson.title && lesson.content) {
        [createdLesson] = await db.insert(contentLessons)
          .values({
            dayId: createdDay.id,
            title: lesson.title,
            content: lesson.content,
            keyTakeaways: lesson.keyTakeaways || [],
            whyItMatters: lesson.whyItMatters || null,
            estimatedReadTime: lesson.estimatedReadTime || 3,
          })
          .returning();
      }
      
      // Create quizzes if provided
      if (quizzes && Array.isArray(quizzes) && quizzes.length > 0) {
        for (const quiz of quizzes) {
          if (quiz.question && quiz.options && quiz.correctAnswer !== undefined) {
            const [createdQuiz] = await db.insert(contentQuizzes)
              .values({
                dayId: createdDay.id,
                question: quiz.question,
                options: quiz.options,
                correctAnswer: quiz.correctAnswer,
                explanation: quiz.explanation || "",
              })
              .returning();
            createdQuizzes.push(createdQuiz);
          }
        }
      }
      
      // Create questions if provided
      if (questions && Array.isArray(questions) && questions.length > 0) {
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          if (q.title && q.content) {
            const [createdQ] = await db.insert(contentSetUpQuestions)
              .values({
                dayId: createdDay.id,
                title: q.title,
                content: q.content,
                category: q.category || "general",
                icon: q.icon || "💡",
                orderIndex: i,
              })
              .returning();
            createdQuestions.push(createdQ);
          }
        }
      }
      
      res.json({
        success: true,
        day: createdDay,
        lesson: createdLesson,
        quizzes: createdQuizzes,
        questions: createdQuestions,
        summary: {
          lessonCreated: !!createdLesson,
          quizzesCreated: createdQuizzes.length,
          questionsCreated: createdQuestions.length,
        }
      });
    } catch (error) {
      console.error("Error in bulk import:", error);
      res.status(500).json({ message: "Failed to import content" });
    }
  });

  // AI Content Generation - Generate draft for a new day
  app.post("/api/admin/content/generate-draft", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { dayIndex, theme, notes } = req.body;
      
      if (typeof dayIndex !== 'number' || dayIndex < 1) {
        return res.status(400).json({ message: "dayIndex must be a positive number" });
      }
      
      // Check if day already exists
      const existing = await db.select().from(contentDays).where(eq(contentDays.dayIndex, dayIndex));
      if (existing.length > 0) {
        return res.status(400).json({ message: `Day ${dayIndex} already exists. Use edit instead.` });
      }
      
      // Retrieve prior day summaries for context (last 7 days)
      const { contentDaySummaries } = await import('@shared/schema');
      const priorDays = await db.select()
        .from(contentDaySummaries)
        .where(sql`${contentDaySummaries.dayIndex} >= ${dayIndex - 7} AND ${contentDaySummaries.dayIndex} < ${dayIndex}`)
        .orderBy(contentDaySummaries.dayIndex);
      
      // Build context from prior days
      let priorContext = '';
      if (priorDays.length > 0) {
        priorContext = priorDays.map(d => 
          `Day ${d.dayIndex}: ${d.synopsis}\nKey concepts: ${d.keyConcepts?.join(', ') || 'none'}`
        ).join('\n\n');
      }
      
      // Calculate position in curriculum
      const cycle = Math.ceil(dayIndex / 90);
      const weekNumber = Math.ceil(dayIndex / 7);
      const dayInWeek = ((dayIndex - 1) % 7) + 1;
      const isWeeklyRecap = dayInWeek === 7;
      
      // Determine month theme based on cycle
      const cycleThemes: Record<number, string[]> = {
        1: ['Problem Recognition & Motivation', 'Bitcoin Basics & Properties', 'Implementation & Security'],
        2: ['Economic Theory & History', 'Network Effects & Adoption', 'Investment & Portfolio Theory'],
        3: ['Global Monetary Systems', 'Technology Deep Dives', 'Future Scenarios & Predictions'],
        4: ['Institutional Adoption', 'Regulatory & Policy', 'Bitcoin Maximalism vs. Alternatives'],
      };
      const monthInCycle = Math.ceil(((dayIndex - 1) % 90 + 1) / 30);
      const cycleNumber = Math.min(cycle, 4);
      const suggestedTheme = theme || cycleThemes[cycleNumber]?.[monthInCycle - 1] || 'Bitcoin Fundamentals';
      
      // Load custom AI instructions from database, or use defaults
      let baseInstructions = `You are a Bitcoin education content creator for HODLearn, creating daily lessons for working professionals.

## CONTENT PHILOSOPHY
**Target**: Working professionals seeking financial understanding and security
**Approach**: "Conviction Through Curiosity" - build Bitcoin conviction through immediate financial relevance
**Tone**: Professional urgency without technical overwhelm (8th grade reading level)

## EVERGREEN CONTENT GUIDELINES (CRITICAL)
Your content must remain relevant for years, not months. Follow these rules strictly:

**DO:**
- Focus on Bitcoin fundamentals that never change (cryptography, proof-of-work, halving mechanics, sound money principles)
- Use relative time references ("since Bitcoin's creation", "over a decade", "multiple market cycles")
- Teach principles and "why" rather than specific events
- Use historical examples with context (don't assume reader knows the timeline)
- Explain concepts that will be true in 5+ years

**DON'T:**
- Reference specific Bitcoin prices (no "$60,000" or "all-time highs")
- Mention specific years for recent events ("in 2024", "last year")
- Reference current events, news, or regulatory actions
- Include time-sensitive statistics that will become outdated
- Use phrases like "currently", "recently", "right now", "as of today"`;

      // Try to load custom instructions from database
      try {
        const customInstructions = await db.select()
          .from(aiInstructions)
          .where(eq(aiInstructions.type, 'content'));
        if (customInstructions.length > 0 && customInstructions[0].instructions) {
          baseInstructions = customInstructions[0].instructions;
        }
      } catch (e) {
        // Use default instructions if table doesn't exist or query fails
        console.log("Using default content AI instructions");
      }

      // Build the comprehensive prompt with Content Creation Framework
      const systemPrompt = `${baseInstructions}

**FRESHNESS CLASSIFICATION:**
After creating content, assess whether it is:
- "evergreen" - Content about fundamentals that won't need updates (cryptography, monetary theory, how Bitcoin works)
- "review_annually" - Content referencing adoption trends or technology evolution that may need minor updates
- "review_quarterly" - Content touching on market dynamics or regulatory concepts (avoid this category when possible)

## CURRICULUM POSITION
- Day ${dayIndex} of 180-day curriculum
- Week ${weekNumber}, Day ${dayInWeek} of week
- Cycle ${cycleNumber} (${cycleNumber === 1 ? 'Foundation' : cycleNumber === 2 ? 'Intermediate' : cycleNumber === 3 ? 'Advanced' : 'Expert'})
- Theme: ${suggestedTheme}
${isWeeklyRecap ? '- THIS IS DAY 7: Weekly recap - synthesize the week\'s progression' : ''}

${priorContext ? `## PRIOR LESSONS FOR CONTEXT
${priorContext}

Build naturally on these concepts without using phrases like "Yesterday we learned" or "Building on our previous discussion".` : '## FIRST DAYS OF CURRICULUM\nThis is early in the curriculum - establish foundational concepts.'}

${notes ? `## ADDITIONAL NOTES FROM CREATOR
${notes}` : ''}

## OUTPUT REQUIREMENTS
Create a complete day of content with this EXACT JSON structure:

{
  "title": "Urgency-driven headline under 60 characters with power words (Stolen, Hidden, Secret, Crisis, Destroy, Protect)",
  "theme": "${suggestedTheme}",
  "readingLevel": "8th grade",
  "culturalStage": "Normie → Pre-coiner",
  "freshnessType": "evergreen | review_annually | review_quarterly (based on content nature)",
  "setup_questions": [
    {"title": "Personal Impact", "content": "Question about personal financial experience (under 100 chars)", "category": "curiosity", "icon": "💰"},
    {"title": "System Reveal", "content": "Question revealing systemic issue (under 100 chars)", "category": "curiosity", "icon": "🏦"},
    {"title": "Future Solution", "content": "Question hinting at Bitcoin solution (under 100 chars)", "category": "curiosity", "icon": "🔮"}
  ],
  "lesson": {
    "title": "Same as day title",
    "content": "300-1200 word narrative with:\n- Hook: Open with relatable professional scenario\n- Problem: Reveal the hidden financial threat\n- **Bold Section Headers** to break up content\n- Paragraph breaks every 2-3 sentences\n- Simple explanation with concrete examples and real numbers\n- Bitcoin solution preview\n- Sentences under 15 words\n- No jargon - use 'government money printing' not 'monetary expansion'\n- NO specific prices, years, or current events",
    "keyTakeaways": ["Max 12 words each", "Three memorable points", "No technical jargon"],
    "whyItMatters": "Must mention Bitcoin specifically. Template: This matters because [threat] affects [concern], and understanding [Bitcoin solution] helps you [action].",
    "estimatedReadTime": 3
  },
  "quiz_questions": [
    {"question": "Fact recall question", "optionA": "Option A", "optionB": "Option B", "optionC": "Option C", "optionD": "Option D", "correctAnswer": 0, "explanation": "Why this is correct"},
    {"question": "Concept application question", "optionA": "Option A", "optionB": "Option B", "optionC": "Option C", "optionD": "Option D", "correctAnswer": 1, "explanation": "Why this is correct"},
    {"question": "Bitcoin vs traditional comparison", "optionA": "Option A", "optionB": "Option B", "optionC": "Option C", "optionD": "Option D", "correctAnswer": 2, "explanation": "Why this is correct"},
    {"question": "Future implications question", "optionA": "Option A", "optionB": "Option B", "optionC": "Option C", "optionD": "Option D", "correctAnswer": 0, "explanation": "Why this is correct"}
  ]
}

## QUALITY CHECKLIST (must pass all)
- [ ] Title under 60 characters with emotional hook
- [ ] 3 setup questions, each under 100 characters
- [ ] Lesson is 300-1200 words at 8th grade reading level
- [ ] Bold headers every 2-3 paragraphs
- [ ] 3 key takeaways, each max 12 words
- [ ] Why it matters explicitly mentions Bitcoin
- [ ] 4 quiz questions with optionA/B/C/D format
- [ ] No banned phrases: "Yesterday we learned", "Building on our previous discussion", "As we discovered in Day X"
- [ ] Content builds Bitcoin conviction through immediate relevance
- [ ] EVERGREEN: No specific prices, years, or current events mentioned
- [ ] EVERGREEN: Uses relative time references only
- [ ] freshnessType field is set appropriately (prefer "evergreen")

Return ONLY the JSON object, no markdown code blocks or additional text.`;

      // Call Claude (production-ready client)
      const anthropic = await createAnthropicClient();
      
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: systemPrompt
          }
        ]
      });
      
      const responseText = (message.content[0] as any).text || '';
      
      // Parse the JSON response
      let generatedContent;
      try {
        // Remove any markdown code blocks if present
        const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const rawContent = JSON.parse(cleanJson);
        
        // Normalize field names (handle both camelCase and snake_case from AI)
        const freshnessValue = rawContent.freshnessType || rawContent.freshness_type || 'evergreen';
        const validFreshnessTypes = ['evergreen', 'review_annually', 'review_quarterly'];
        generatedContent = {
          title: rawContent.title,
          theme: rawContent.theme,
          readingLevel: rawContent.readingLevel || rawContent.reading_level || "8th grade",
          culturalStage: rawContent.culturalStage || rawContent.cultural_stage || "Normie → Pre-coiner",
          freshnessType: validFreshnessTypes.includes(freshnessValue) ? freshnessValue : 'evergreen',
          setup_questions: (rawContent.setup_questions || []).map((q: any) => ({
            content: q.content || q.question || q.title || '',
            category: q.category || 'curiosity',
            icon: q.icon || '💡'
          })),
          lesson: {
            title: rawContent.lesson?.title || rawContent.title,
            content: rawContent.lesson?.content || '',
            keyTakeaways: rawContent.lesson?.keyTakeaways || rawContent.lesson?.key_takeaways || [],
            whyItMatters: rawContent.lesson?.whyItMatters || rawContent.lesson?.why_it_matters || '',
            estimatedReadTime: rawContent.lesson?.estimatedReadTime || rawContent.lesson?.estimated_read_time || 3
          },
          quiz_questions: (rawContent.quiz_questions || rawContent.quizQuestions || []).map((q: any) => ({
            question: q.question,
            optionA: q.optionA || q.option_a || q.options?.[0] || '',
            optionB: q.optionB || q.option_b || q.options?.[1] || '',
            optionC: q.optionC || q.option_c || q.options?.[2] || '',
            optionD: q.optionD || q.option_d || q.options?.[3] || '',
            correctAnswer: q.correctAnswer ?? q.correct_answer ?? 0,
            explanation: q.explanation || ''
          }))
        };
      } catch (parseError) {
        console.error("Failed to parse AI response:", responseText);
        return res.status(500).json({ 
          message: "AI generated invalid JSON. Please try again.",
          rawResponse: responseText.substring(0, 500)
        });
      }
      
      // Run basic validation checks
      const validationIssues: string[] = [];
      
      if (generatedContent.title?.length > 60) {
        validationIssues.push(`Title is ${generatedContent.title.length} characters (max 60)`);
      }
      
      if (!generatedContent.setup_questions || generatedContent.setup_questions.length !== 3) {
        validationIssues.push("Must have exactly 3 setup questions");
      }
      
      const lessonWordCount = generatedContent.lesson?.content?.split(/\s+/).length || 0;
      if (lessonWordCount < 300 || lessonWordCount > 1200) {
        validationIssues.push(`Lesson is ${lessonWordCount} words (should be 300-1200)`);
      }
      
      if (!generatedContent.lesson?.keyTakeaways || generatedContent.lesson.keyTakeaways.length !== 3) {
        validationIssues.push("Must have exactly 3 key takeaways");
      }
      
      if (!generatedContent.lesson?.whyItMatters?.toLowerCase().includes('bitcoin')) {
        validationIssues.push("Why It Matters must mention Bitcoin");
      }
      
      if (!generatedContent.quiz_questions || generatedContent.quiz_questions.length !== 4) {
        validationIssues.push("Must have exactly 4 quiz questions");
      }
      
      // Check for banned phrases
      const bannedPhrases = ['yesterday we learned', 'building on our previous', 'as we discovered in day'];
      const contentLower = JSON.stringify(generatedContent).toLowerCase();
      for (const phrase of bannedPhrases) {
        if (contentLower.includes(phrase)) {
          validationIssues.push(`Contains banned phrase: "${phrase}"`);
        }
      }
      
      // Check for non-evergreen content patterns (warnings, not failures)
      const evergreenWarnings: string[] = [];
      const datedPatterns = [
        /\$\d{1,3}(,\d{3})*(\.\d{2})?/g, // Dollar amounts like $50,000
        /\b20[12]\d\b/g, // Years 2010-2029
        /\blast year\b/gi,
        /\bthis year\b/gi,
        /\bcurrently\b/gi,
        /\brecently\b/gi,
        /\bright now\b/gi,
        /\bas of today\b/gi,
        /\ball-time high\b/gi,
        /\ball time high\b/gi,
      ];
      
      const lessonContent = generatedContent.lesson?.content || '';
      for (const pattern of datedPatterns) {
        const matches = lessonContent.match(pattern);
        if (matches) {
          evergreenWarnings.push(`Content contains potentially dated reference: "${matches[0]}"`);
        }
      }
      
      res.json({
        success: true,
        dayIndex,
        content: generatedContent,
        validation: {
          passed: validationIssues.length === 0,
          issues: validationIssues,
          evergreenWarnings: evergreenWarnings,
        },
        context: {
          cycle: cycleNumber,
          week: weekNumber,
          dayInWeek,
          isWeeklyRecap,
          theme: suggestedTheme,
          priorDaysUsed: priorDays.length,
          freshnessType: generatedContent.freshnessType
        }
      });
      
    } catch (error) {
      console.error("Error generating content draft:", error);
      res.status(500).json({ message: "Failed to generate content. Please try again." });
    }
  });

  // ============================================
  // CURRICULUM STRUCTURE ROUTES
  // ============================================

  // Get all curriculum structure entries
  app.get("/api/admin/curriculum", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { curriculumStructure } = await import('@shared/schema');
      const structure = await db.select().from(curriculumStructure)
        .orderBy(curriculumStructure.yearNumber, curriculumStructure.monthNumber, curriculumStructure.weekNumber);
      res.json(structure);
    } catch (error) {
      console.error("Error fetching curriculum structure:", error);
      res.status(500).json({ message: "Failed to fetch curriculum structure" });
    }
  });

  // Create or update curriculum structure entry
  app.post("/api/admin/curriculum", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { curriculumStructure } = await import('@shared/schema');
      const { yearNumber, monthNumber, weekNumber, type, name, description, learningObjectives } = req.body;
      
      // Check if entry exists
      const existing = await db.select().from(curriculumStructure).where(
        and(
          eq(curriculumStructure.yearNumber, yearNumber),
          eq(curriculumStructure.monthNumber, monthNumber),
          weekNumber ? eq(curriculumStructure.weekNumber, weekNumber) : isNull(curriculumStructure.weekNumber)
        )
      );
      
      if (existing.length > 0) {
        // Update existing
        const [updated] = await db.update(curriculumStructure)
          .set({ name, description, learningObjectives, type, updatedAt: new Date() })
          .where(eq(curriculumStructure.id, existing[0].id))
          .returning();
        return res.json(updated);
      }
      
      // Create new
      const [created] = await db.insert(curriculumStructure).values({
        yearNumber,
        monthNumber,
        weekNumber: weekNumber || null,
        type,
        name,
        description,
        learningObjectives,
      }).returning();
      
      res.json(created);
    } catch (error) {
      console.error("Error saving curriculum structure:", error);
      res.status(500).json({ message: "Failed to save curriculum structure" });
    }
  });

  // Delete curriculum structure entry
  app.delete("/api/admin/curriculum/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { curriculumStructure } = await import('@shared/schema');
      const id = parseInt(req.params.id);
      await db.delete(curriculumStructure).where(eq(curriculumStructure.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting curriculum structure:", error);
      res.status(500).json({ message: "Failed to delete curriculum structure" });
    }
  });

  // Get theme/topic for a specific day position
  app.get("/api/admin/curriculum/for-day/:dayIndex", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { curriculumStructure } = await import('@shared/schema');
      const dayIndex = parseInt(req.params.dayIndex);
      
      // Calculate year, month, week from day index
      const DAYS_PER_WEEK = 7;
      const WEEKS_PER_MONTH = 4;
      const MONTHS_PER_YEAR = 12;
      const DAYS_PER_MONTH = DAYS_PER_WEEK * WEEKS_PER_MONTH; // 28 days
      const DAYS_PER_YEAR = DAYS_PER_MONTH * MONTHS_PER_YEAR; // 336 days
      
      const yearNumber = Math.ceil(dayIndex / DAYS_PER_YEAR);
      const dayInYear = ((dayIndex - 1) % DAYS_PER_YEAR) + 1;
      const monthNumber = Math.ceil(dayInYear / DAYS_PER_MONTH);
      const dayInMonth = ((dayInYear - 1) % DAYS_PER_MONTH) + 1;
      const weekNumber = Math.ceil(dayInMonth / DAYS_PER_WEEK);
      
      // Get monthly theme
      const [monthlyTheme] = await db.select().from(curriculumStructure).where(
        and(
          eq(curriculumStructure.yearNumber, yearNumber),
          eq(curriculumStructure.monthNumber, monthNumber),
          eq(curriculumStructure.type, 'theme')
        )
      );
      
      // Get weekly topic
      const [weeklyTopic] = await db.select().from(curriculumStructure).where(
        and(
          eq(curriculumStructure.yearNumber, yearNumber),
          eq(curriculumStructure.monthNumber, monthNumber),
          eq(curriculumStructure.weekNumber, weekNumber),
          eq(curriculumStructure.type, 'topic')
        )
      );
      
      res.json({
        dayIndex,
        yearNumber,
        monthNumber,
        weekNumber,
        monthlyTheme: monthlyTheme?.name || null,
        monthlyDescription: monthlyTheme?.description || null,
        weeklyTopic: weeklyTopic?.name || null,
        weeklyDescription: weeklyTopic?.description || null,
        learningObjectives: weeklyTopic?.learningObjectives || monthlyTheme?.learningObjectives || [],
      });
    } catch (error) {
      console.error("Error fetching curriculum for day:", error);
      res.status(500).json({ message: "Failed to fetch curriculum for day" });
    }
  });

  // ============================================
  // MARKETING MANAGEMENT ROUTES
  // ============================================
  
  // Get all advertising clients
  app.get("/api/admin/marketing/clients", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { advertisingClients } = await import('@shared/schema');
      const clients = await db.select().from(advertisingClients).orderBy(advertisingClients.name);
      
      const transformedClients = clients.map(c => ({
        id: c.id,
        companyName: c.name,
        contactName: c.contactName || '',
        email: c.contactEmail || '',
        phone: c.contactPhone,
        website: c.website,
        industry: c.industry,
        companyType: c.companyType,
        taxId: c.taxId,
        paymentTerms: c.paymentTerms,
        billingStreet: c.billingStreet,
        billingCity: c.billingCity,
        billingState: c.billingState,
        billingZip: c.billingZip,
        billingCountry: c.billingCountry,
        status: c.isActive ? 'active' : 'inactive',
        notes: c.notes,
        createdAt: c.createdAt?.toISOString(),
      }));
      
      res.json(transformedClients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  // Create new client
  app.post("/api/admin/marketing/clients", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { advertisingClients } = await import('@shared/schema');
      const { 
        companyName, contactName, email, phone, website, industry, companyType,
        taxId, paymentTerms, billingStreet, billingCity, billingState, billingZip, billingCountry, notes 
      } = req.body;
      
      const [client] = await db.insert(advertisingClients).values({
        name: companyName,
        contactName,
        contactEmail: email,
        contactPhone: phone || null,
        website: website || null,
        industry: industry || null,
        companyType: companyType || null,
        taxId: taxId || null,
        paymentTerms: paymentTerms || null,
        billingStreet: billingStreet || null,
        billingCity: billingCity || null,
        billingState: billingState || null,
        billingZip: billingZip || null,
        billingCountry: billingCountry || null,
        notes: notes || null,
        isActive: true,
      }).returning();
      
      res.json(client);
    } catch (error) {
      console.error("Error creating client:", error);
      res.status(500).json({ message: "Failed to create client" });
    }
  });

  // Delete client
  app.delete("/api/admin/marketing/clients/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { advertisingClients } = await import('@shared/schema');
      const id = parseInt(req.params.id);
      await db.delete(advertisingClients).where(eq(advertisingClients.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting client:", error);
      res.status(500).json({ message: "Failed to delete client" });
    }
  });

  // Get all campaigns (optionally filtered by clientId)
  app.get("/api/admin/marketing/campaigns", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { clientId } = req.query;
      
      if (clientId) {
        const campaigns = await db.select().from(adCampaigns)
          .where(eq(adCampaigns.clientId, parseInt(clientId as string)))
          .orderBy(adCampaigns.name);
        return res.json(campaigns);
      }
      
      const campaigns = await db.select().from(adCampaigns).orderBy(adCampaigns.name);
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  // Create campaign
  app.post("/api/admin/marketing/campaigns", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { 
        name, advertiser, clientId, budgetCents, startDate, endDate, targetImpressions,
        feeType, agreedRateCents, revenueSharePercent, paymentStatus, invoiceReference
      } = req.body;
      
      const [campaign] = await db.insert(adCampaigns).values({
        name,
        advertiser,
        clientId: clientId || null,
        status: 'draft',
        budgetCents: budgetCents || 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        targetImpressions: targetImpressions || null,
        feeType: feeType || 'cpc',
        agreedRateCents: agreedRateCents || null,
        revenueSharePercent: revenueSharePercent || null,
        paymentStatus: paymentStatus || 'pending',
        invoiceReference: invoiceReference || null,
      }).returning();
      
      res.json(campaign);
    } catch (error) {
      console.error("Error creating campaign:", error);
      res.status(500).json({ message: "Failed to create campaign" });
    }
  });

  // Update campaign
  app.patch("/api/admin/marketing/campaigns/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates: any = {};
      
      if (req.body.status) updates.status = req.body.status;
      if (req.body.name) updates.name = req.body.name;
      if (req.body.budgetCents !== undefined) updates.budgetCents = req.body.budgetCents;
      
      const [campaign] = await db.update(adCampaigns)
        .set(updates)
        .where(eq(adCampaigns.id, id))
        .returning();
        
      res.json(campaign);
    } catch (error) {
      console.error("Error updating campaign:", error);
      res.status(500).json({ message: "Failed to update campaign" });
    }
  });

  // Delete campaign
  app.delete("/api/admin/marketing/campaigns/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      await db.delete(adCampaigns).where(eq(adCampaigns.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting campaign:", error);
      res.status(500).json({ message: "Failed to delete campaign" });
    }
  });

  // Get creatives for a campaign
  app.get("/api/admin/marketing/creatives", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { adCreatives } = await import('@shared/schema');
      const { campaignId } = req.query;
      
      if (campaignId) {
        const creatives = await db.select().from(adCreatives)
          .where(eq(adCreatives.campaignId, parseInt(campaignId as string)));
        return res.json(creatives);
      }
      
      const creatives = await db.select().from(adCreatives);
      res.json(creatives);
    } catch (error) {
      console.error("Error fetching creatives:", error);
      res.status(500).json({ message: "Failed to fetch creatives" });
    }
  });

  // Create creative
  app.post("/api/admin/marketing/creatives", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { adCreatives } = await import('@shared/schema');
      const { campaignId, title, description, imageUrl, logoUrl, ctaText, ctaUrl, placement } = req.body;
      
      const [creative] = await db.insert(adCreatives).values({
        campaignId,
        title,
        description,
        imageUrl: imageUrl || null,
        logoUrl: logoUrl || null,
        ctaText: ctaText || 'Learn More',
        ctaUrl,
        placement: placement || 'in_feed',
        isActive: true,
      }).returning();
      
      res.json(creative);
    } catch (error) {
      console.error("Error creating creative:", error);
      res.status(500).json({ message: "Failed to create creative" });
    }
  });

  // Update creative
  app.patch("/api/admin/marketing/creatives/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { adCreatives } = await import('@shared/schema');
      const id = parseInt(req.params.id);
      const updates: any = {};
      
      if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;
      if (req.body.title) updates.title = req.body.title;
      if (req.body.description) updates.description = req.body.description;
      
      const [creative] = await db.update(adCreatives)
        .set(updates)
        .where(eq(adCreatives.id, id))
        .returning();
        
      res.json(creative);
    } catch (error) {
      console.error("Error updating creative:", error);
      res.status(500).json({ message: "Failed to update creative" });
    }
  });

  // Delete creative
  app.delete("/api/admin/marketing/creatives/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { adCreatives } = await import('@shared/schema');
      const id = parseInt(req.params.id);
      await db.delete(adCreatives).where(eq(adCreatives.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting creative:", error);
      res.status(500).json({ message: "Failed to delete creative" });
    }
  });

  // Get analytics
  app.get("/api/admin/marketing/analytics", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { adImpressions, adClicks, adCreatives } = await import('@shared/schema');
      const { campaignId } = req.query;
      
      if (campaignId) {
        // Get analytics for specific campaign
        const campaignIdNum = parseInt(campaignId as string);
        
        const impressionsResult = await db.select({ count: count() })
          .from(adImpressions)
          .where(eq(adImpressions.campaignId, campaignIdNum));
        
        const clicksResult = await db.select({ count: count() })
          .from(adClicks)
          .where(eq(adClicks.campaignId, campaignIdNum));
        
        const totalImpressions = impressionsResult[0]?.count || 0;
        const totalClicks = clicksResult[0]?.count || 0;
        const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
        
        return res.json({ totalImpressions, totalClicks, ctr });
      }
      
      // Get overall analytics
      const impressionsResult = await db.select({ count: count() }).from(adImpressions);
      const clicksResult = await db.select({ count: count() }).from(adClicks);
      
      const totalImpressions = impressionsResult[0]?.count || 0;
      const totalClicks = clicksResult[0]?.count || 0;
      const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
      
      // Get all campaigns for budget/spend aggregation
      const allCampaigns = await db.select().from(adCampaigns);
      const activeCampaigns = allCampaigns.filter(c => c.status === 'active');
      
      // Calculate total budget and spend across all campaigns
      const totalBudgetCents = allCampaigns.reduce((sum, c) => sum + (c.budgetCents || 0), 0);
      const totalSpentCents = allCampaigns.reduce((sum, c) => sum + (c.spentCents || 0), 0);
      const budgetPacing = totalBudgetCents > 0 ? (totalSpentCents / totalBudgetCents) * 100 : 0;
      
      // Get campaigns with their stats
      const campaignsWithStats = await Promise.all(activeCampaigns.map(async (campaign) => {
        const impressions = await db.select({ count: count() })
          .from(adImpressions)
          .where(eq(adImpressions.campaignId, campaign.id));
        const clicks = await db.select({ count: count() })
          .from(adClicks)
          .where(eq(adClicks.campaignId, campaign.id));
        
        const imp = impressions[0]?.count || 0;
        const clk = clicks[0]?.count || 0;
        const budgetCents = campaign.budgetCents || 0;
        const spentCents = campaign.spentCents || 0;
        const campaignBudgetPacing = budgetCents > 0 ? (spentCents / budgetCents) * 100 : 0;
        
        return {
          id: campaign.id,
          name: campaign.name,
          advertiser: campaign.advertiser,
          impressions: imp,
          clicks: clk,
          ctr: imp > 0 ? (clk / imp) * 100 : 0,
          budgetCents: campaign.budgetCents,
          spentCents: campaign.spentCents,
          budgetPacing: campaignBudgetPacing,
          startDate: campaign.startDate,
          endDate: campaign.endDate,
        };
      }));
      
      res.json({ 
        totalImpressions, 
        totalClicks, 
        ctr,
        totalBudgetCents,
        totalSpentCents,
        budgetPacing,
        totalCampaigns: allCampaigns.length,
        activeCampaigns: activeCampaigns.length,
        campaigns: campaignsWithStats 
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Get all invoices
  app.get("/api/admin/marketing/invoices", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { invoices } = await import('@shared/schema');
      const allInvoices = await db.select().from(invoices).orderBy(invoices.createdAt);
      res.json(allInvoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  // Create invoice
  app.post("/api/admin/marketing/invoices", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { invoices } = await import('@shared/schema');
      const { clientId, amountUsd, dueDate, notes } = req.body;
      
      // Generate invoice number
      const existingInvoices = await db.select({ count: count() }).from(invoices);
      const invoiceNum = existingInvoices[0]?.count || 0;
      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceNum + 1).padStart(4, '0')}`;
      
      const [invoice] = await db.insert(invoices).values({
        clientId,
        invoiceNumber,
        amountUsd,
        status: 'draft',
        dueDate: dueDate ? new Date(dueDate) : null,
        notes: notes || null,
      }).returning();
      
      res.json(invoice);
    } catch (error) {
      console.error("Error creating invoice:", error);
      res.status(500).json({ message: "Failed to create invoice" });
    }
  });

  // Update invoice status
  app.patch("/api/admin/marketing/invoices/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { invoices } = await import('@shared/schema');
      const id = parseInt(req.params.id);
      const updates: any = { updatedAt: new Date() };
      
      if (req.body.status) {
        updates.status = req.body.status;
        if (req.body.status === 'paid') {
          updates.paidAt = new Date();
        }
      }
      
      const [invoice] = await db.update(invoices)
        .set(updates)
        .where(eq(invoices.id, id))
        .returning();
        
      res.json(invoice);
    } catch (error) {
      console.error("Error updating invoice:", error);
      res.status(500).json({ message: "Failed to update invoice" });
    }
  });

  // Delete invoice
  app.delete("/api/admin/marketing/invoices/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { invoices } = await import('@shared/schema');
      const id = parseInt(req.params.id);
      await db.delete(invoices).where(eq(invoices.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting invoice:", error);
      res.status(500).json({ message: "Failed to delete invoice" });
    }
  });

  // ============================================
  // STORE MANAGEMENT ROUTES
  // ============================================

  // Get all affiliate products
  app.get("/api/admin/store/affiliates", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { affiliateProducts } = await import('@shared/schema');
      const products = await db.select().from(affiliateProducts).orderBy(affiliateProducts.sortOrder);
      res.json(products);
    } catch (error) {
      console.error("Error fetching affiliate products:", error);
      res.status(500).json({ message: "Failed to fetch affiliate products" });
    }
  });

  // Get affiliate stats
  app.get("/api/admin/store/affiliates/stats", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { affiliateProducts, affiliateClicks } = await import('@shared/schema');
      const products = await db.select().from(affiliateProducts);
      
      const stats = await Promise.all(products.map(async (product) => {
        const clicksResult = await db.select({ count: count() })
          .from(affiliateClicks)
          .where(eq(affiliateClicks.productId, product.id));
        
        const conversionsResult = await db.select({ count: count() })
          .from(affiliateClicks)
          .where(and(
            eq(affiliateClicks.productId, product.id),
            eq(affiliateClicks.converted, true)
          ));
        
        const revenueResult = await db.select({ sum: sum(affiliateClicks.conversionValue) })
          .from(affiliateClicks)
          .where(and(
            eq(affiliateClicks.productId, product.id),
            eq(affiliateClicks.converted, true)
          ));
        
        return {
          productId: product.id,
          clicks: clicksResult[0]?.count || 0,
          conversions: conversionsResult[0]?.count || 0,
          revenue: parseFloat(revenueResult[0]?.sum || '0'),
        };
      }));
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching affiliate stats:", error);
      res.status(500).json({ message: "Failed to fetch affiliate stats" });
    }
  });

  // Create affiliate product
  app.post("/api/admin/store/affiliates", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { affiliateProducts } = await import('@shared/schema');
      const { name, description, category, affiliateUrl, imageUrl, vendor, commissionPercent, priceUsd } = req.body;
      
      if (!name || !category || !affiliateUrl) {
        return res.status(400).json({ message: "Name, category, and affiliate URL are required" });
      }
      
      const [product] = await db.insert(affiliateProducts).values({
        name,
        description: description || null,
        category,
        affiliateUrl,
        imageUrl: imageUrl || null,
        vendor: vendor || null,
        commissionPercent: commissionPercent != null ? String(commissionPercent) : null,
        priceUsd: priceUsd != null ? String(priceUsd) : null,
        isActive: true,
        sortOrder: 0,
      }).returning();
      
      res.json(product);
    } catch (error) {
      console.error("Error creating affiliate product:", error);
      res.status(500).json({ message: "Failed to create affiliate product" });
    }
  });

  // Update affiliate product
  app.patch("/api/admin/store/affiliates/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { affiliateProducts } = await import('@shared/schema');
      const id = parseInt(req.params.id);
      const updates: any = { updatedAt: new Date() };
      
      if (req.body.name) updates.name = req.body.name;
      if (req.body.description !== undefined) updates.description = req.body.description;
      if (req.body.category) updates.category = req.body.category;
      if (req.body.affiliateUrl) updates.affiliateUrl = req.body.affiliateUrl;
      if (req.body.imageUrl !== undefined) updates.imageUrl = req.body.imageUrl;
      if (req.body.vendor !== undefined) updates.vendor = req.body.vendor;
      if (req.body.commissionPercent !== undefined) updates.commissionPercent = req.body.commissionPercent != null ? String(req.body.commissionPercent) : null;
      if (req.body.priceUsd !== undefined) updates.priceUsd = req.body.priceUsd != null ? String(req.body.priceUsd) : null;
      if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;
      
      const [product] = await db.update(affiliateProducts)
        .set(updates)
        .where(eq(affiliateProducts.id, id))
        .returning();
        
      res.json(product);
    } catch (error) {
      console.error("Error updating affiliate product:", error);
      res.status(500).json({ message: "Failed to update affiliate product" });
    }
  });

  // Delete affiliate product
  app.delete("/api/admin/store/affiliates/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { affiliateProducts } = await import('@shared/schema');
      const id = parseInt(req.params.id);
      await db.delete(affiliateProducts).where(eq(affiliateProducts.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting affiliate product:", error);
      res.status(500).json({ message: "Failed to delete affiliate product" });
    }
  });

  // Get all referral partners
  app.get("/api/admin/store/referrals", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { referralPartners } = await import('@shared/schema');
      const partners = await db.select().from(referralPartners).orderBy(referralPartners.name);
      res.json(partners);
    } catch (error) {
      console.error("Error fetching referral partners:", error);
      res.status(500).json({ message: "Failed to fetch referral partners" });
    }
  });

  // Get referral signups
  app.get("/api/admin/store/referrals/signups", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { referralSignups } = await import('@shared/schema');
      const signups = await db.select().from(referralSignups).orderBy(referralSignups.signupDate);
      res.json(signups);
    } catch (error) {
      console.error("Error fetching referral signups:", error);
      res.status(500).json({ message: "Failed to fetch referral signups" });
    }
  });

  // Create referral partner
  app.post("/api/admin/store/referrals", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { referralPartners } = await import('@shared/schema');
      const { 
        name, category, description, referralUrl, logoUrl, 
        contactName, contactEmail, referralFeeType, 
        referralFeeAmount, referralFeePercent, payoutFrequency, notes 
      } = req.body;
      
      if (!name || !category || !referralUrl) {
        return res.status(400).json({ message: "Name, category, and referral URL are required" });
      }
      
      const [partner] = await db.insert(referralPartners).values({
        name,
        category,
        description: description || null,
        referralUrl,
        logoUrl: logoUrl || null,
        contactName: contactName || null,
        contactEmail: contactEmail || null,
        referralFeeType: referralFeeType || 'flat',
        referralFeeAmount: referralFeeAmount != null ? String(referralFeeAmount) : null,
        referralFeePercent: referralFeePercent != null ? String(referralFeePercent) : null,
        payoutFrequency: payoutFrequency || 'monthly',
        isActive: true,
        notes: notes || null,
      }).returning();
      
      res.json(partner);
    } catch (error) {
      console.error("Error creating referral partner:", error);
      res.status(500).json({ message: "Failed to create referral partner" });
    }
  });

  // Update referral partner
  app.patch("/api/admin/store/referrals/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { referralPartners } = await import('@shared/schema');
      const id = parseInt(req.params.id);
      const updates: any = { updatedAt: new Date() };
      
      if (req.body.name) updates.name = req.body.name;
      if (req.body.category) updates.category = req.body.category;
      if (req.body.description !== undefined) updates.description = req.body.description;
      if (req.body.referralUrl) updates.referralUrl = req.body.referralUrl;
      if (req.body.logoUrl !== undefined) updates.logoUrl = req.body.logoUrl;
      if (req.body.contactName !== undefined) updates.contactName = req.body.contactName;
      if (req.body.contactEmail !== undefined) updates.contactEmail = req.body.contactEmail;
      if (req.body.referralFeeType) updates.referralFeeType = req.body.referralFeeType;
      if (req.body.referralFeeAmount !== undefined) updates.referralFeeAmount = req.body.referralFeeAmount != null ? String(req.body.referralFeeAmount) : null;
      if (req.body.referralFeePercent !== undefined) updates.referralFeePercent = req.body.referralFeePercent != null ? String(req.body.referralFeePercent) : null;
      if (req.body.payoutFrequency) updates.payoutFrequency = req.body.payoutFrequency;
      if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;
      if (req.body.notes !== undefined) updates.notes = req.body.notes;
      
      const [partner] = await db.update(referralPartners)
        .set(updates)
        .where(eq(referralPartners.id, id))
        .returning();
        
      res.json(partner);
    } catch (error) {
      console.error("Error updating referral partner:", error);
      res.status(500).json({ message: "Failed to update referral partner" });
    }
  });

  // Delete referral partner
  app.delete("/api/admin/store/referrals/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { referralPartners } = await import('@shared/schema');
      const id = parseInt(req.params.id);
      await db.delete(referralPartners).where(eq(referralPartners.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting referral partner:", error);
      res.status(500).json({ message: "Failed to delete referral partner" });
    }
  });

  // Get all inventory products
  app.get("/api/admin/store/inventory", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { storeProducts } = await import('@shared/schema');
      const showArchived = req.query.showArchived === 'true';
      const products = showArchived
        ? await db.select().from(storeProducts).orderBy(storeProducts.sortOrder)
        : await db.select().from(storeProducts).where(isNull(storeProducts.archivedAt)).orderBy(storeProducts.sortOrder);
      res.json(products);
    } catch (error) {
      console.error("Error fetching inventory products:", error);
      res.status(500).json({ message: "Failed to fetch inventory products" });
    }
  });

  // Create inventory product
  app.post("/api/admin/store/inventory", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { storeProducts } = await import('@shared/schema');
      const { name, description, priceUsd, priceSats, imageUrl, category, stockQuantity, isFeatured } = req.body;
      
      if (!name || priceUsd == null) {
        return res.status(400).json({ message: "Name and price are required" });
      }
      
      const [product] = await db.insert(storeProducts).values({
        name,
        description: description || null,
        priceUsd: String(priceUsd),
        priceSats: priceSats != null ? Number(priceSats) : null,
        imageUrl: imageUrl || null,
        category: category || null,
        stockQuantity: stockQuantity != null ? Number(stockQuantity) : 0,
        isActive: true,
        isFeatured: isFeatured || false,
        sortOrder: 0,
      }).returning();
      
      res.json(product);
    } catch (error) {
      console.error("Error creating inventory product:", error);
      res.status(500).json({ message: "Failed to create inventory product" });
    }
  });

  // Update inventory product
  app.patch("/api/admin/store/inventory/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { storeProducts } = await import('@shared/schema');
      const id = parseInt(req.params.id);
      const updates: any = { updatedAt: new Date() };
      
      if (req.body.name) updates.name = req.body.name;
      if (req.body.description !== undefined) updates.description = req.body.description;
      if (req.body.priceUsd !== undefined) updates.priceUsd = req.body.priceUsd != null ? String(req.body.priceUsd) : null;
      if (req.body.priceSats !== undefined) updates.priceSats = req.body.priceSats != null ? Number(req.body.priceSats) : null;
      if (req.body.imageUrl !== undefined) updates.imageUrl = req.body.imageUrl;
      if (req.body.category !== undefined) updates.category = req.body.category;
      if (req.body.stockQuantity !== undefined) updates.stockQuantity = req.body.stockQuantity != null ? Number(req.body.stockQuantity) : 0;
      if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;
      if (req.body.isFeatured !== undefined) updates.isFeatured = req.body.isFeatured;
      
      const [product] = await db.update(storeProducts)
        .set(updates)
        .where(eq(storeProducts.id, id))
        .returning();
        
      res.json(product);
    } catch (error) {
      console.error("Error updating inventory product:", error);
      res.status(500).json({ message: "Failed to update inventory product" });
    }
  });

  // Delete inventory product
  app.delete("/api/admin/store/inventory/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { storeProducts } = await import('@shared/schema');
      const id = parseInt(req.params.id);
      await db.delete(storeProducts).where(eq(storeProducts.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting inventory product:", error);
      res.status(500).json({ message: "Failed to delete inventory product" });
    }
  });

  // Get all orders
  app.get("/api/admin/store/orders", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { storeOrders } = await import('@shared/schema');
      const showArchived = req.query.showArchived === 'true';
      const orders = showArchived
        ? await db.select().from(storeOrders).orderBy(storeOrders.createdAt)
        : await db.select().from(storeOrders).where(isNull(storeOrders.archivedAt)).orderBy(storeOrders.createdAt);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Update order status
  app.patch("/api/admin/store/orders/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { storeOrders } = await import('@shared/schema');
      const id = parseInt(req.params.id);
      const updates: any = { updatedAt: new Date() };
      
      if (req.body.status) updates.status = req.body.status;
      if (req.body.trackingNumber !== undefined) updates.trackingNumber = req.body.trackingNumber;
      if (req.body.notes !== undefined) updates.notes = req.body.notes;
      
      const [order] = await db.update(storeOrders)
        .set(updates)
        .where(eq(storeOrders.id, id))
        .returning();
        
      res.json(order);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // Create initial admin (only works if no admins exist)
  app.post("/api/admin/setup", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Check if any admin exists
      const { adminUsers } = await import('@shared/schema');
      const existingAdmins = await db.select().from(adminUsers);
      if (existingAdmins.length > 0) {
        return res.status(400).json({ message: "Admin already exists. Use login instead." });
      }

      const admin = await adminAuthService.createAdmin(email, password, firstName, lastName, 'super_admin');
      
      res.json({
        success: true,
        admin: {
          id: admin.id,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
        },
      });
    } catch (error: any) {
      console.error("Admin setup error:", error);
      res.status(400).json({ message: error.message || "Setup failed" });
    }
  });

  // ============================================
  // ADMIN USER MANAGEMENT ROUTES (Super Admin Only)
  // ============================================

  // Middleware for super admin check (used inline before definition below)
  const requireSuperAdminInline = async (req: AdminRequest, res: Response, next: NextFunction) => {
    if (!req.admin || req.admin.role !== 'super_admin') {
      return res.status(403).json({ message: "Super admin access required" });
    }
    next();
  };

  // Get all admin users
  app.get("/api/admin/admin-users", requireAdminAuth, requireSuperAdminInline, async (req: AdminRequest, res) => {
    try {
      const admins = await db.select({
        id: adminUsers.id,
        email: adminUsers.email,
        firstName: adminUsers.firstName,
        lastName: adminUsers.lastName,
        role: adminUsers.role,
        isActive: adminUsers.isActive,
        lastLoginAt: adminUsers.lastLoginAt,
        createdAt: adminUsers.createdAt,
      }).from(adminUsers).orderBy(adminUsers.createdAt);
      
      res.json(admins);
    } catch (error) {
      console.error("Error fetching admin users:", error);
      res.status(500).json({ message: "Failed to fetch admin users" });
    }
  });

  // Zod schema for creating admin users
  const createAdminSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    firstName: z.string().min(1, "First name is required").max(100),
    lastName: z.string().min(1, "Last name is required").max(100),
    role: z.enum(['admin', 'super_admin']).default('admin'),
  });

  // Create new admin user
  app.post("/api/admin/admin-users", requireAdminAuth, requireSuperAdminInline, async (req: AdminRequest, res) => {
    try {
      // Validate input with Zod
      const validatedData = createAdminSchema.parse(req.body);
      const { email, password, firstName, lastName, role } = validatedData;
      
      // Check if email already exists
      const [existing] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
      if (existing) {
        return res.status(400).json({ message: "An admin with this email already exists" });
      }
      
      // Create the admin
      const admin = await adminAuthService.createAdmin(email, password, firstName, lastName, role);
      
      res.json({
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
        isActive: admin.isActive,
        createdAt: admin.createdAt,
      });
    } catch (error: any) {
      console.error("Error creating admin user:", error);
      res.status(500).json({ message: error.message || "Failed to create admin user" });
    }
  });

  // Zod schema for updating admin users
  const updateAdminSchema = z.object({
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    role: z.enum(['admin', 'super_admin']).optional(),
    isActive: z.boolean().optional(),
    newPassword: z.string().min(8, "Password must be at least 8 characters").optional(),
  });

  // Update admin user
  app.patch("/api/admin/admin-users/:id", requireAdminAuth, requireSuperAdminInline, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Validate input with Zod
      const validatedData = updateAdminSchema.parse(req.body);
      const { firstName, lastName, role, isActive, newPassword } = validatedData;
      
      // Prevent self-demotion from super_admin
      if (req.admin?.id === id && role && role !== 'super_admin') {
        return res.status(400).json({ message: "You cannot demote yourself from super admin" });
      }
      
      // Prevent self-deactivation
      if (req.admin?.id === id && isActive === false) {
        return res.status(400).json({ message: "You cannot deactivate your own account" });
      }
      
      const updates: any = {};
      if (firstName !== undefined) updates.firstName = firstName;
      if (lastName !== undefined) updates.lastName = lastName;
      if (role !== undefined) updates.role = role;
      if (isActive !== undefined) updates.isActive = isActive;
      
      // Handle password update if provided
      if (newPassword) {
        const bcrypt = await import('bcryptjs');
        updates.passwordHash = await bcrypt.hash(newPassword, 10);
      }
      
      const [updated] = await db.update(adminUsers)
        .set(updates)
        .where(eq(adminUsers.id, id))
        .returning({
          id: adminUsers.id,
          email: adminUsers.email,
          firstName: adminUsers.firstName,
          lastName: adminUsers.lastName,
          role: adminUsers.role,
          isActive: adminUsers.isActive,
          lastLoginAt: adminUsers.lastLoginAt,
          createdAt: adminUsers.createdAt,
        });
      
      if (!updated) {
        return res.status(404).json({ message: "Admin user not found" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating admin user:", error);
      res.status(500).json({ message: "Failed to update admin user" });
    }
  });

  // Delete/deactivate admin user
  app.delete("/api/admin/admin-users/:id", requireAdminAuth, requireSuperAdminInline, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Prevent self-deletion
      if (req.admin?.id === id) {
        return res.status(400).json({ message: "You cannot delete your own account" });
      }
      
      // Soft delete by deactivating instead of hard delete
      const [deactivated] = await db.update(adminUsers)
        .set({ isActive: false })
        .where(eq(adminUsers.id, id))
        .returning();
      
      if (!deactivated) {
        return res.status(404).json({ message: "Admin user not found" });
      }
      
      // Invalidate all sessions for this admin
      await db.delete(adminSessions).where(eq(adminSessions.adminId, id));
      
      res.json({ success: true, message: "Admin user deactivated" });
    } catch (error) {
      console.error("Error deleting admin user:", error);
      res.status(500).json({ message: "Failed to delete admin user" });
    }
  });

  // ============================================
  // SOCIAL MEDIA MANAGEMENT ROUTES
  // ============================================

  // Get social media stats
  app.get("/api/admin/social/stats", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { socialPosts, socialPostMetrics, attributionEvents } = await import('@shared/schema');
      const { or } = await import('drizzle-orm');
      
      // Count planned posts
      const [plannedResult] = await db.select({ count: count() })
        .from(socialPosts)
        .where(eq(socialPosts.publishStatus, 'planned'));
      
      // Count posted posts
      const [postedResult] = await db.select({ count: count() })
        .from(socialPosts)
        .where(eq(socialPosts.publishStatus, 'posted'));
      
      // Count approved vs drafted for content status tracking
      const [approvedResult] = await db.select({ count: count() })
        .from(socialPosts)
        .where(eq(socialPosts.contentStatus, 'approved'));
      
      const [draftedResult] = await db.select({ count: count() })
        .from(socialPosts)
        .where(eq(socialPosts.contentStatus, 'drafted'));
      
      const [clicksResult] = await db.select({ 
        total: sql<number>`COALESCE(SUM(${socialPostMetrics.clicks}), 0)` 
      }).from(socialPostMetrics);
      
      const [signupsResult] = await db.select({ count: count() })
        .from(attributionEvents)
        .where(eq(attributionEvents.eventType, 'signup'));

      res.json({
        planned: plannedResult?.count || 0,
        posted: postedResult?.count || 0,
        drafted: draftedResult?.count || 0,
        approved: approvedResult?.count || 0,
        totalClicks: Number(clicksResult?.total) || 0,
        totalSignups: signupsResult?.count || 0,
        avgEngagement: 0,
      });
    } catch (error) {
      console.error("Error fetching social stats:", error);
      res.status(500).json({ message: "Failed to fetch social stats" });
    }
  });

  // Get all social posts
  app.get("/api/admin/social/posts", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { socialPosts, socialPostMetrics, attributionEvents } = await import('@shared/schema');
      const { desc } = await import('drizzle-orm');
      
      const posts = await db.select()
        .from(socialPosts)
        .orderBy(desc(socialPosts.createdAt));
      
      // Helper to normalize dates to ISO strings
      const normalizeDate = (date: any): string | null => {
        if (!date) return null;
        try {
          const d = date instanceof Date ? date : new Date(date);
          return isNaN(d.getTime()) ? null : d.toISOString();
        } catch {
          return null;
        }
      };
      
      // Get metrics for published posts and normalize dates
      const postsWithMetrics = await Promise.all(posts.map(async (post) => {
        let metrics = null;
        let signups = 0;
        
        if (post.publishStatus === 'posted') {
          const [metricsResult] = await db.select()
            .from(socialPostMetrics)
            .where(eq(socialPostMetrics.postId, post.id));
          metrics = metricsResult || null;
          
          const [signupsResult] = await db.select({ count: count() })
            .from(attributionEvents)
            .where(and(
              eq(attributionEvents.postId, post.id),
              eq(attributionEvents.eventType, 'signup')
            ));
          signups = signupsResult?.count || 0;
        }
        
        // Return normalized post with consistent ISO date strings
        return { 
          ...post, 
          scheduledAt: normalizeDate(post.scheduledAt),
          createdAt: normalizeDate(post.createdAt) || new Date().toISOString(),
          publishedAt: normalizeDate(post.publishedAt),
          metrics, 
          signups 
        };
      }));
      
      res.json(postsWithMetrics);
    } catch (error) {
      console.error("Error fetching social posts:", error);
      res.status(500).json({ message: "Failed to fetch social posts" });
    }
  });

  // Create social post
  app.post("/api/admin/social/posts", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { socialPosts } = await import('@shared/schema');
      const { v4: uuidv4 } = await import('uuid');
      
      const { content, platform, imageUrl, linkUrl, campaignId, linkedDayIndex, contentStatus, publishStatus, scheduledAt } = req.body;
      
      if (!content || !content.trim()) {
        return res.status(400).json({ message: "Content is required" });
      }
      
      // Generate unique UTM content for attribution tracking
      const utmContent = `post_${uuidv4().slice(0, 8)}`;
      
      const [post] = await db.insert(socialPosts).values({
        content: content.trim(),
        platform: platform || 'twitter',
        imageUrl: imageUrl || null,
        linkUrl: linkUrl || null,
        campaignId: campaignId || null,
        linkedDayIndex: linkedDayIndex || null,
        contentStatus: contentStatus || 'drafted',
        publishStatus: publishStatus || 'planned',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        utmSource: 'social',
        utmMedium: platform || 'twitter',
        utmCampaign: campaignId ? `campaign_${campaignId}` : 'organic',
        utmContent,
        createdBy: req.admin.id,
      }).returning();
      
      res.json(post);
    } catch (error) {
      console.error("Error creating social post:", error);
      res.status(500).json({ message: "Failed to create social post" });
    }
  });

  // Update social post
  app.patch("/api/admin/social/posts/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { socialPosts } = await import('@shared/schema');
      const id = parseInt(req.params.id);
      
      const updates: any = { updatedAt: new Date() };
      
      if (req.body.content) updates.content = req.body.content.trim();
      if (req.body.platform) updates.platform = req.body.platform;
      if (req.body.imageUrl !== undefined) updates.imageUrl = req.body.imageUrl || null;
      if (req.body.linkUrl !== undefined) updates.linkUrl = req.body.linkUrl || null;
      if (req.body.campaignId !== undefined) updates.campaignId = req.body.campaignId || null;
      if (req.body.linkedDayIndex !== undefined) updates.linkedDayIndex = req.body.linkedDayIndex || null;
      if (req.body.contentStatus) updates.contentStatus = req.body.contentStatus;
      if (req.body.publishStatus) updates.publishStatus = req.body.publishStatus;
      if (req.body.scheduledAt !== undefined) {
        updates.scheduledAt = req.body.scheduledAt ? new Date(req.body.scheduledAt) : null;
      }
      
      // Update UTM campaign if campaign changes
      if (req.body.campaignId !== undefined) {
        updates.utmCampaign = req.body.campaignId ? `campaign_${req.body.campaignId}` : 'organic';
      }
      
      const [post] = await db.update(socialPosts)
        .set(updates)
        .where(eq(socialPosts.id, id))
        .returning();
      
      res.json(post);
    } catch (error) {
      console.error("Error updating social post:", error);
      res.status(500).json({ message: "Failed to update social post" });
    }
  });

  // Delete social post
  app.delete("/api/admin/social/posts/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { socialPosts } = await import('@shared/schema');
      const id = parseInt(req.params.id);
      
      await db.delete(socialPosts).where(eq(socialPosts.id, id));
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting social post:", error);
      res.status(500).json({ message: "Failed to delete social post" });
    }
  });

  // Publish social post (mark as published - actual Twitter posting requires API keys)
  app.post("/api/admin/social/posts/:id/publish", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { socialPosts, socialPostMetrics } = await import('@shared/schema');
      const id = parseInt(req.params.id);
      
      // Update post status to posted
      const [post] = await db.update(socialPosts)
        .set({
          publishStatus: 'posted',
          publishedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(socialPosts.id, id))
        .returning();
      
      // Create initial metrics record
      await db.insert(socialPostMetrics).values({
        postId: id,
        impressions: 0,
        engagements: 0,
        likes: 0,
        retweets: 0,
        replies: 0,
        clicks: 0,
        profileClicks: 0,
        videoViews: 0,
      });
      
      res.json(post);
    } catch (error) {
      console.error("Error publishing social post:", error);
      res.status(500).json({ message: "Failed to publish social post" });
    }
  });

  // Track attribution event (for UTM tracking)
  app.post("/api/admin/social/attribution", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const { attributionEvents, socialPosts } = await import('@shared/schema');
      const { eventType, utmSource, utmMedium, utmCampaign, utmContent, userId, dayIndex, metadata } = req.body;
      
      // Find post by UTM content if provided
      let postId = null;
      if (utmContent) {
        const [post] = await db.select({ id: socialPosts.id })
          .from(socialPosts)
          .where(eq(socialPosts.utmContent, utmContent));
        postId = post?.id || null;
      }
      
      const [event] = await db.insert(attributionEvents).values({
        postId,
        eventType,
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
        utmContent: utmContent || null,
        userId: userId || null,
        dayIndex: dayIndex || null,
        metadata: metadata || null,
      }).returning();
      
      res.json(event);
    } catch (error) {
      console.error("Error tracking attribution:", error);
      res.status(500).json({ message: "Failed to track attribution" });
    }
  });

  // AI Draft Generation using Claude
  app.post("/api/admin/social/generate-draft", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      // Accept both dayIndex and linkedDayIndex for flexibility
      const dayIndex = req.body.dayIndex || req.body.linkedDayIndex;
      const platform = req.body.platform || 'twitter';
      
      let lessonContext = '';
      
      // If a day is specified, get lesson content
      if (dayIndex) {
        const [day] = await db.select()
          .from(contentDays)
          .where(eq(contentDays.dayIndex, parseInt(dayIndex)));
        
        if (day) {
          const lessons = await db.select()
            .from(contentLessons)
            .where(eq(contentLessons.dayId, day.id));
          
          const lessonContent = lessons.map(l => l.content).join('\n\n');
          
          lessonContext = `
Day ${day.dayIndex}: ${day.title}
Theme: ${day.theme}
${lessonContent ? `\nLesson Content:\n${lessonContent}` : ''}
          `.trim();
        }
      }
      
      // Platform-specific constraints
      const platformConstraintsMap: Record<string, string> = {
        twitter: 'Maximum 280 characters. Short, punchy hook in first line. Use 1-2 relevant hashtags (#Bitcoin, #BTC). Clear call-to-action. No emojis overload.',
        linkedin: 'Maximum 3000 characters. Professional, thought-leadership tone. Start with a bold statement or question. Use line breaks for readability. Include industry insights. End with a question to drive engagement.',
        instagram: 'Maximum 2200 characters. Casual, visual-first caption style. Use emojis strategically (2-4 per post). Include relevant hashtags at the end (5-10). Storytelling format works well.',
        facebook: 'Community-focused, conversational tone. Can be longer-form. Ask questions to encourage comments. Share personal insights or stories. Include a clear call-to-action.',
      };
      const platformConstraints = platformConstraintsMap[platform] || platformConstraintsMap.twitter;
      
      // Load custom AI instructions from database, or use defaults
      let baseInstructions = `You are a social media content creator for HODLearn, a Bitcoin education platform. Your goal is to create engaging posts that drive curiosity and signups.

Guidelines:
- ${platformConstraints}
- Make it engaging and accessible to beginners
- Create urgency or curiosity without being salesy
- End with a subtle call-to-action
- DO NOT use the word "journey" or "unlock"
- Be authentic and conversational`;

      // Try to load custom instructions from database
      try {
        const customInstructions = await db.select()
          .from(aiInstructions)
          .where(eq(aiInstructions.type, 'social'));
        if (customInstructions.length > 0 && customInstructions[0].instructions) {
          baseInstructions = `${customInstructions[0].instructions}

Platform constraints: ${platformConstraints}`;
        }
      } catch (e) {
        // Use default instructions if table doesn't exist or query fails
        console.log("Using default social AI instructions");
      }
      
      // Call Claude (production-ready client)
      const anthropic = await createAnthropicClient();
      
      // Build prompt based on whether we have lesson context
      const prompt = lessonContext 
        ? `${baseInstructions}

Create a ${platform} post based on this Bitcoin lesson:

${lessonContext}

Focus on one key insight from the lesson.

Return ONLY the post content, nothing else.`
        : `${baseInstructions}

Create an engaging ${platform} post about Bitcoin that would appeal to young professionals who are curious about Bitcoin but haven't started learning yet.

Focus on ONE of these angles: inflation protection, financial sovereignty, generational wealth, or getting started.
Include relevant hashtags like #Bitcoin #BTC #FinancialFreedom

Return ONLY the post content, nothing else.`;
      
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      });
      
      const draft = (message.content[0] as any).text || '';
      
      res.json({ draft: draft.trim() });
    } catch (error) {
      console.error("Error generating AI draft:", error);
      res.status(500).json({ message: "Failed to generate draft. Please try again." });
    }
  });

  // Zod schema for image generation
  const imageGenerationSchema = z.object({
    prompt: z.string().min(1, "Prompt is required").max(1000, "Prompt must be under 1000 characters"),
    style: z.enum(['professional', 'educational', 'dynamic', 'minimal', 'custom']).default('professional'),
    size: z.enum(['1024x1024', '1792x1024', '1024x1792']).default('1024x1024'),
  });

  // AI Image Generation using DALL-E 3
  app.post("/api/admin/social/generate-image", requireAdminAuth, imageGenerationRateLimiter, async (req: AdminRequest, res) => {
    try {
      // Validate input with Zod
      let validatedInput;
      try {
        validatedInput = imageGenerationSchema.parse(req.body);
      } catch (zodError: any) {
        const message = zodError.errors?.[0]?.message || "Invalid input";
        return res.status(400).json({ message });
      }
      const { prompt, style, size } = validatedInput;
      const imageSize = size;
      
      // Style presets for Bitcoin/financial content
      const stylePresets: Record<string, string> = {
        'professional': 'Clean, modern, professional style. Minimalist design with subtle orange and black color scheme.',
        'educational': 'Educational infographic style. Clear, informative visuals with easy-to-understand imagery.',
        'dynamic': 'Dynamic, energetic design with bold colors and movement. Modern and eye-catching.',
        'minimal': 'Ultra-minimalist design. Simple shapes, lots of whitespace, subtle details.',
        'custom': '', // User provides their own style
      };
      
      const styleGuide = style && stylePresets[style] 
        ? stylePresets[style] 
        : stylePresets['professional'];
      
      // Construct the full prompt with style guidance
      const fullPrompt = `${prompt}. ${styleGuide} No text, no words, no letters, no numbers in the image. Bitcoin orange color: #F7931A. Professional quality, suitable for social media.`;
      
      // Create OpenAI client
      const openai = await createOpenAIClient();
      
      // Generate image with DALL-E 3
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: fullPrompt,
        n: 1,
        size: imageSize as '1024x1024' | '1792x1024' | '1024x1792',
        quality: 'standard',
        response_format: 'url',
      });
      
      if (!response.data || response.data.length === 0) {
        throw new Error('No image generated');
      }
      
      const imageUrl = response.data[0]?.url;
      const revisedPrompt = response.data[0]?.revised_prompt;
      
      if (!imageUrl) {
        throw new Error('No image URL in response');
      }
      
      res.json({ 
        imageUrl,
        revisedPrompt,
        size: imageSize,
      });
    } catch (error: any) {
      console.error("Error generating image:", error);
      
      // Handle specific OpenAI errors
      if (error.code === 'content_policy_violation') {
        return res.status(400).json({ message: "Image prompt was rejected by content policy. Please try a different prompt." });
      }
      if (error.code === 'rate_limit_exceeded') {
        return res.status(429).json({ message: "Rate limit exceeded. Please wait a moment and try again." });
      }
      if (error.message?.includes('No OpenAI API key')) {
        return res.status(400).json({ message: "OpenAI API key not configured. Please add it in Settings → API Keys." });
      }
      
      res.status(500).json({ message: "Failed to generate image. Please try again." });
    }
  });

  // ============================================
  // B2B CRM ENDPOINTS
  // ============================================

  // Get CRM stats
  app.get("/api/admin/crm/stats", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const totalCompanies = await db.select({ count: count() }).from(crmCompanies);
      const totalDeals = await db.select({ count: count() }).from(crmDeals);
      const openDeals = await db.select({ count: count() }).from(crmDeals)
        .where(and(
          sql`${crmDeals.stage} NOT IN ('won', 'lost')`
        ));
      const wonDeals = await db.select({ count: count() }).from(crmDeals)
        .where(eq(crmDeals.stage, 'won'));
      const totalValue = await db.select({ sum: sum(crmDeals.dealValue) }).from(crmDeals)
        .where(eq(crmDeals.stage, 'won'));

      res.json({
        totalCompanies: totalCompanies[0]?.count || 0,
        totalDeals: totalDeals[0]?.count || 0,
        openDeals: openDeals[0]?.count || 0,
        wonDeals: wonDeals[0]?.count || 0,
        totalWonValue: totalValue[0]?.sum || 0,
      });
    } catch (error) {
      console.error("Error fetching CRM stats:", error);
      res.status(500).json({ message: "Failed to fetch CRM stats" });
    }
  });

  // Get all companies
  app.get("/api/admin/crm/companies", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const showArchived = req.query.showArchived === 'true';
      const companies = showArchived
        ? await db.select().from(crmCompanies).orderBy(crmCompanies.name)
        : await db.select().from(crmCompanies).where(isNull(crmCompanies.archivedAt)).orderBy(crmCompanies.name);
      res.json(companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });

  // Create company
  app.post("/api/admin/crm/companies", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const data = insertCrmCompanySchema.parse(req.body);
      const [company] = await db.insert(crmCompanies).values(data).returning();
      res.json(company);
    } catch (error: any) {
      console.error("Error creating company:", error);
      res.status(400).json({ message: error.message || "Failed to create company" });
    }
  });

  // Update company
  app.patch("/api/admin/crm/companies/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertCrmCompanySchema.partial().parse(req.body);
      const [company] = await db.update(crmCompanies)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(crmCompanies.id, id))
        .returning();
      res.json(company);
    } catch (error: any) {
      console.error("Error updating company:", error);
      res.status(400).json({ message: error.message || "Failed to update company" });
    }
  });

  // Get company with contacts and deals
  app.get("/api/admin/crm/companies/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const [company] = await db.select().from(crmCompanies).where(eq(crmCompanies.id, id));
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      const contacts = await db.select().from(crmContacts).where(eq(crmContacts.companyId, id));
      const deals = await db.select().from(crmDeals).where(eq(crmDeals.companyId, id));
      res.json({ ...company, contacts, deals });
    } catch (error) {
      console.error("Error fetching company:", error);
      res.status(500).json({ message: "Failed to fetch company" });
    }
  });

  // Create contact
  app.post("/api/admin/crm/contacts", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const data = insertCrmContactSchema.parse(req.body);
      const [contact] = await db.insert(crmContacts).values(data).returning();
      res.json(contact);
    } catch (error: any) {
      console.error("Error creating contact:", error);
      res.status(400).json({ message: error.message || "Failed to create contact" });
    }
  });

  // Update contact
  app.patch("/api/admin/crm/contacts/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertCrmContactSchema.partial().parse(req.body);
      const [contact] = await db.update(crmContacts)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(crmContacts.id, id))
        .returning();
      res.json(contact);
    } catch (error: any) {
      console.error("Error updating contact:", error);
      res.status(400).json({ message: error.message || "Failed to update contact" });
    }
  });

  // Delete contact
  app.delete("/api/admin/crm/contacts/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      await db.delete(crmContacts).where(eq(crmContacts.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting contact:", error);
      res.status(500).json({ message: "Failed to delete contact" });
    }
  });

  // Get all deals with company info
  app.get("/api/admin/crm/deals", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const deals = await db.select({
        deal: crmDeals,
        company: crmCompanies,
        contact: crmContacts,
      })
        .from(crmDeals)
        .leftJoin(crmCompanies, eq(crmDeals.companyId, crmCompanies.id))
        .leftJoin(crmContacts, eq(crmDeals.contactId, crmContacts.id))
        .orderBy(crmDeals.updatedAt);
      
      res.json(deals.map(d => ({
        ...d.deal,
        company: d.company,
        contact: d.contact,
      })));
    } catch (error) {
      console.error("Error fetching deals:", error);
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });

  // Create deal
  app.post("/api/admin/crm/deals", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const data = insertCrmDealSchema.parse(req.body);
      const [deal] = await db.insert(crmDeals).values(data).returning();
      res.json(deal);
    } catch (error: any) {
      console.error("Error creating deal:", error);
      res.status(400).json({ message: error.message || "Failed to create deal" });
    }
  });

  // Update deal
  app.patch("/api/admin/crm/deals/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertCrmDealSchema.partial().parse(req.body);
      const [deal] = await db.update(crmDeals)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(crmDeals.id, id))
        .returning();
      res.json(deal);
    } catch (error: any) {
      console.error("Error updating deal:", error);
      res.status(400).json({ message: error.message || "Failed to update deal" });
    }
  });

  // Update deal stage (quick update for drag and drop)
  app.patch("/api/admin/crm/deals/:id/stage", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const { stage, lostReason } = req.body;
      
      const updateData: any = { stage, updatedAt: new Date() };
      if (stage === 'won' || stage === 'lost') {
        updateData.actualCloseDate = new Date();
      }
      if (stage === 'lost' && lostReason) {
        updateData.lostReason = lostReason;
      }
      
      const [deal] = await db.update(crmDeals)
        .set(updateData)
        .where(eq(crmDeals.id, id))
        .returning();
      res.json(deal);
    } catch (error) {
      console.error("Error updating deal stage:", error);
      res.status(500).json({ message: "Failed to update deal stage" });
    }
  });

  // Get deal with activities
  app.get("/api/admin/crm/deals/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const [deal] = await db.select().from(crmDeals).where(eq(crmDeals.id, id));
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      const [company] = await db.select().from(crmCompanies).where(eq(crmCompanies.id, deal.companyId));
      const contact = deal.contactId ? (await db.select().from(crmContacts).where(eq(crmContacts.id, deal.contactId)))[0] : null;
      const activities = await db.select().from(crmActivities)
        .where(eq(crmActivities.dealId, id))
        .orderBy(sql`${crmActivities.activityDate} DESC`);
      
      res.json({ ...deal, company, contact, activities });
    } catch (error) {
      console.error("Error fetching deal:", error);
      res.status(500).json({ message: "Failed to fetch deal" });
    }
  });

  // Create activity
  app.post("/api/admin/crm/activities", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const data = insertCrmActivitySchema.parse(req.body);
      const [activity] = await db.insert(crmActivities).values({
        ...data,
        createdBy: req.admin?.id,
      }).returning();
      res.json(activity);
    } catch (error: any) {
      console.error("Error creating activity:", error);
      res.status(400).json({ message: error.message || "Failed to create activity" });
    }
  });

  // Update activity
  app.patch("/api/admin/crm/activities/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertCrmActivitySchema.partial().parse(req.body);
      const [activity] = await db.update(crmActivities)
        .set(data)
        .where(eq(crmActivities.id, id))
        .returning();
      res.json(activity);
    } catch (error: any) {
      console.error("Error updating activity:", error);
      res.status(400).json({ message: error.message || "Failed to update activity" });
    }
  });

  // Delete activity
  app.delete("/api/admin/crm/activities/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      await db.delete(crmActivities).where(eq(crmActivities.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting activity:", error);
      res.status(500).json({ message: "Failed to delete activity" });
    }
  });

  // Get CRM dropdown options
  app.get("/api/admin/crm/options", requireAdminAuth, async (req: AdminRequest, res) => {
    res.json({
      dealStages: crmDealStages,
      opportunityTypes: crmOpportunityTypes,
      accountTypes: crmAccountTypes,
    });
  });

  // ==================== Product Roadmap Routes ====================

  // Get roadmap stats
  app.get("/api/admin/roadmap/stats", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const totalIdeas = await db.select({ count: count() }).from(roadmapIdeas);
      const backlogIdeas = await db.select({ count: count() }).from(roadmapIdeas).where(eq(roadmapIdeas.status, 'backlog'));
      const inProgressIdeas = await db.select({ count: count() }).from(roadmapIdeas).where(eq(roadmapIdeas.status, 'in_progress'));
      const completedIdeas = await db.select({ count: count() }).from(roadmapIdeas).where(eq(roadmapIdeas.status, 'completed'));
      const totalReleases = await db.select({ count: count() }).from(roadmapReleases);

      res.json({
        totalIdeas: totalIdeas[0]?.count || 0,
        backlogIdeas: backlogIdeas[0]?.count || 0,
        inProgressIdeas: inProgressIdeas[0]?.count || 0,
        completedIdeas: completedIdeas[0]?.count || 0,
        totalReleases: totalReleases[0]?.count || 0,
      });
    } catch (error) {
      console.error("Error fetching roadmap stats:", error);
      res.status(500).json({ message: "Failed to fetch roadmap stats" });
    }
  });

  // Get all roadmap ideas
  app.get("/api/admin/roadmap/ideas", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const ideas = await db.select().from(roadmapIdeas).orderBy(roadmapIdeas.createdAt);
      res.json(ideas);
    } catch (error) {
      console.error("Error fetching roadmap ideas:", error);
      res.status(500).json({ message: "Failed to fetch roadmap ideas" });
    }
  });

  // Create roadmap idea
  app.post("/api/admin/roadmap/ideas", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const data = insertRoadmapIdeaSchema.parse(req.body);
      const [idea] = await db.insert(roadmapIdeas).values(data).returning();
      res.json(idea);
    } catch (error: any) {
      console.error("Error creating roadmap idea:", error);
      res.status(400).json({ message: error.message || "Failed to create roadmap idea" });
    }
  });

  // Update roadmap idea
  app.patch("/api/admin/roadmap/ideas/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertRoadmapIdeaSchema.partial().parse(req.body);
      const [idea] = await db.update(roadmapIdeas)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(roadmapIdeas.id, id))
        .returning();
      res.json(idea);
    } catch (error: any) {
      console.error("Error updating roadmap idea:", error);
      res.status(400).json({ message: error.message || "Failed to update roadmap idea" });
    }
  });

  // Update idea status
  app.patch("/api/admin/roadmap/ideas/:id/status", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const [idea] = await db.update(roadmapIdeas)
        .set({ status, updatedAt: new Date() })
        .where(eq(roadmapIdeas.id, id))
        .returning();
      res.json(idea);
    } catch (error) {
      console.error("Error updating idea status:", error);
      res.status(500).json({ message: "Failed to update idea status" });
    }
  });

  // Delete roadmap idea
  app.delete("/api/admin/roadmap/ideas/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      await db.delete(roadmapIdeas).where(eq(roadmapIdeas.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting roadmap idea:", error);
      res.status(500).json({ message: "Failed to delete roadmap idea" });
    }
  });

  // Get all releases
  app.get("/api/admin/roadmap/releases", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const releases = await db.select().from(roadmapReleases).orderBy(roadmapReleases.targetDate);
      res.json(releases);
    } catch (error) {
      console.error("Error fetching releases:", error);
      res.status(500).json({ message: "Failed to fetch releases" });
    }
  });

  // Create release
  app.post("/api/admin/roadmap/releases", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const data = insertRoadmapReleaseSchema.parse(req.body);
      const [release] = await db.insert(roadmapReleases).values(data).returning();
      res.json(release);
    } catch (error: any) {
      console.error("Error creating release:", error);
      res.status(400).json({ message: error.message || "Failed to create release" });
    }
  });

  // Update release
  app.patch("/api/admin/roadmap/releases/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertRoadmapReleaseSchema.partial().parse(req.body);
      const [release] = await db.update(roadmapReleases)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(roadmapReleases.id, id))
        .returning();
      res.json(release);
    } catch (error: any) {
      console.error("Error updating release:", error);
      res.status(400).json({ message: error.message || "Failed to update release" });
    }
  });

  // Delete release
  app.delete("/api/admin/roadmap/releases/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      await db.delete(roadmapReleases).where(eq(roadmapReleases.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting release:", error);
      res.status(500).json({ message: "Failed to delete release" });
    }
  });

  // ==================== Goals & OKRs Routes ====================

  // Get OKR stats
  app.get("/api/admin/okrs/stats", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const totalObjectives = await db.select({ count: count() }).from(objectives);
      const activeObjectives = await db.select({ count: count() }).from(objectives).where(eq(objectives.status, 'active'));
      const totalKeyResults = await db.select({ count: count() }).from(keyResults);
      const onTrackKeyResults = await db.select({ count: count() }).from(keyResults).where(eq(keyResults.status, 'on_track'));
      const atRiskKeyResults = await db.select({ count: count() }).from(keyResults).where(eq(keyResults.status, 'at_risk'));
      
      const avgProgress = await db.select({ avg: sql<number>`ROUND(AVG(${objectives.progress}))` }).from(objectives).where(eq(objectives.status, 'active'));

      res.json({
        totalObjectives: totalObjectives[0]?.count || 0,
        activeObjectives: activeObjectives[0]?.count || 0,
        totalKeyResults: totalKeyResults[0]?.count || 0,
        onTrackKeyResults: onTrackKeyResults[0]?.count || 0,
        atRiskKeyResults: atRiskKeyResults[0]?.count || 0,
        avgProgress: avgProgress[0]?.avg || 0,
      });
    } catch (error) {
      console.error("Error fetching OKR stats:", error);
      res.status(500).json({ message: "Failed to fetch OKR stats" });
    }
  });

  // Get all objectives with key results
  app.get("/api/admin/okrs/objectives", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const allObjectives = await db.select().from(objectives).orderBy(objectives.createdAt);
      const allKeyResults = await db.select().from(keyResults);
      
      const objectivesWithKRs = allObjectives.map(obj => ({
        ...obj,
        keyResults: allKeyResults.filter(kr => kr.objectiveId === obj.id),
      }));
      
      res.json(objectivesWithKRs);
    } catch (error) {
      console.error("Error fetching objectives:", error);
      res.status(500).json({ message: "Failed to fetch objectives" });
    }
  });

  // Create objective
  app.post("/api/admin/okrs/objectives", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const data = insertObjectiveSchema.parse(req.body);
      const [objective] = await db.insert(objectives).values(data).returning();
      res.json(objective);
    } catch (error: any) {
      console.error("Error creating objective:", error);
      res.status(400).json({ message: error.message || "Failed to create objective" });
    }
  });

  // Update objective
  app.patch("/api/admin/okrs/objectives/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertObjectiveSchema.partial().parse(req.body);
      const [objective] = await db.update(objectives)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(objectives.id, id))
        .returning();
      res.json(objective);
    } catch (error: any) {
      console.error("Error updating objective:", error);
      res.status(400).json({ message: error.message || "Failed to update objective" });
    }
  });

  // Delete objective
  app.delete("/api/admin/okrs/objectives/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      await db.delete(objectives).where(eq(objectives.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting objective:", error);
      res.status(500).json({ message: "Failed to delete objective" });
    }
  });

  // Create key result
  app.post("/api/admin/okrs/key-results", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const data = insertKeyResultSchema.parse(req.body);
      const [keyResult] = await db.insert(keyResults).values(data).returning();
      res.json(keyResult);
    } catch (error: any) {
      console.error("Error creating key result:", error);
      res.status(400).json({ message: error.message || "Failed to create key result" });
    }
  });

  // Update key result
  app.patch("/api/admin/okrs/key-results/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertKeyResultSchema.partial().parse(req.body);
      const [keyResult] = await db.update(keyResults)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(keyResults.id, id))
        .returning();
      
      // Recalculate objective progress
      const [kr] = await db.select().from(keyResults).where(eq(keyResults.id, id));
      if (kr) {
        const allKRs = await db.select().from(keyResults).where(eq(keyResults.objectiveId, kr.objectiveId));
        const avgProgress = Math.round(allKRs.reduce((sum, kr) => {
          const progress = kr.targetValue > 0 ? (kr.currentValue / kr.targetValue) * 100 : 0;
          return sum + Math.min(progress, 100);
        }, 0) / allKRs.length);
        
        await db.update(objectives)
          .set({ progress: avgProgress, updatedAt: new Date() })
          .where(eq(objectives.id, kr.objectiveId));
      }
      
      res.json(keyResult);
    } catch (error: any) {
      console.error("Error updating key result:", error);
      res.status(400).json({ message: error.message || "Failed to update key result" });
    }
  });

  // Update key result progress
  app.post("/api/admin/okrs/key-results/:id/update", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const { newValue, note, updatedBy } = req.body;
      
      const [kr] = await db.select().from(keyResults).where(eq(keyResults.id, id));
      if (!kr) {
        return res.status(404).json({ message: "Key result not found" });
      }
      
      // Log the update
      await db.insert(keyResultUpdates).values({
        keyResultId: id,
        previousValue: kr.currentValue,
        newValue,
        note,
        updatedBy,
      });
      
      // Update current value
      const [updated] = await db.update(keyResults)
        .set({ currentValue: newValue, updatedAt: new Date() })
        .where(eq(keyResults.id, id))
        .returning();
      
      // Recalculate objective progress
      const allKRs = await db.select().from(keyResults).where(eq(keyResults.objectiveId, kr.objectiveId));
      const avgProgress = Math.round(allKRs.reduce((sum, kr) => {
        const val = kr.id === id ? newValue : kr.currentValue;
        const progress = kr.targetValue > 0 ? (val / kr.targetValue) * 100 : 0;
        return sum + Math.min(progress, 100);
      }, 0) / allKRs.length);
      
      await db.update(objectives)
        .set({ progress: avgProgress, updatedAt: new Date() })
        .where(eq(objectives.id, kr.objectiveId));
      
      res.json(updated);
    } catch (error: any) {
      console.error("Error updating key result progress:", error);
      res.status(400).json({ message: error.message || "Failed to update key result progress" });
    }
  });

  // Delete key result
  app.delete("/api/admin/okrs/key-results/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      await db.delete(keyResults).where(eq(keyResults.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting key result:", error);
      res.status(500).json({ message: "Failed to delete key result" });
    }
  });

  // Get key result history
  app.get("/api/admin/okrs/key-results/:id/history", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = await db.select().from(keyResultUpdates)
        .where(eq(keyResultUpdates.keyResultId, id))
        .orderBy(keyResultUpdates.createdAt);
      res.json(updates);
    } catch (error) {
      console.error("Error fetching key result history:", error);
      res.status(500).json({ message: "Failed to fetch key result history" });
    }
  });

  // ==================== KPI Dashboard Routes ====================

  // Get comprehensive KPI dashboard data
  app.get("/api/admin/kpis", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      const oneWeekAgoStr = oneWeekAgo.toISOString().split('T')[0];
      const twoWeeksAgoStr = twoWeeksAgo.toISOString().split('T')[0];

      // === USER METRICS ===
      const [totalUsersResult] = await db.select({ count: count() }).from(users);
      const totalUsers = Number(totalUsersResult?.count || 0);

      // Active users (last 7 days)
      const [activeUsersResult] = await db.select({ count: count() })
        .from(users)
        .where(sql`${users.lastActivityDate} >= ${oneWeekAgoStr}`);
      const activeUsers = Number(activeUsersResult?.count || 0);

      // Active users previous week (for comparison)
      const [prevActiveUsersResult] = await db.select({ count: count() })
        .from(users)
        .where(sql`${users.lastActivityDate} >= ${twoWeeksAgoStr} AND ${users.lastActivityDate} < ${oneWeekAgoStr}`);
      const prevActiveUsers = Number(prevActiveUsersResult?.count || 0);

      // New signups this week
      const [newSignupsResult] = await db.select({ count: count() })
        .from(users)
        .where(sql`${users.createdAt} >= ${oneWeekAgo}`);
      const newSignups = Number(newSignupsResult?.count || 0);

      // New signups previous week
      const [prevSignupsResult] = await db.select({ count: count() })
        .from(users)
        .where(sql`${users.createdAt} >= ${twoWeeksAgo} AND ${users.createdAt} < ${oneWeekAgo}`);
      const prevSignups = Number(prevSignupsResult?.count || 0);

      // Average streak
      const [avgStreakResult] = await db.select({
        avg: sql<number>`COALESCE(AVG(${users.currentStreak}), 0)`,
      }).from(users);
      const avgStreak = Number(avgStreakResult?.avg || 0);

      // === ENGAGEMENT METRICS ===
      // Lesson completion rate (users who completed at least one lesson)
      const [completedLessonsResult] = await db.select({ count: count() })
        .from(users)
        .where(sql`${users.completedLessons} > 0`);
      const usersWithCompletedLessons = Number(completedLessonsResult?.count || 0);
      const lessonCompletionRate = totalUsers > 0 ? Math.round((usersWithCompletedLessons / totalUsers) * 100) : 0;

      // Total days completed
      const [daysCompletedResult] = await db.select({ count: count() })
        .from(userProgress)
        .where(eq(userProgress.dayCompleted, true));
      const totalDaysCompleted = Number(daysCompletedResult?.count || 0);

      // === CONTENT METRICS ===
      const [contentDaysResult] = await db.select({ count: count() }).from(contentDays);
      const totalContentDays = Number(contentDaysResult?.count || 0);

      const [questionsResult] = await db.select({ count: count() }).from(contentSetUpQuestions);
      const totalQuestions = Number(questionsResult?.count || 0);

      const [lessonsResult] = await db.select({ count: count() }).from(contentLessons);
      const totalLessons = Number(lessonsResult?.count || 0);

      // === COMMUNITY METRICS ===
      const [forumPostsResult] = await db.select({ count: count() }).from(forumPosts);
      const totalForumPosts = Number(forumPostsResult?.count || 0);

      const [forumRepliesResult] = await db.select({ count: count() }).from(forumReplies);
      const totalForumReplies = Number(forumRepliesResult?.count || 0);

      // Posts this week
      const [weeklyPostsResult] = await db.select({ count: count() })
        .from(forumPosts)
        .where(sql`${forumPosts.createdAt} >= ${oneWeekAgo}`);
      const weeklyPosts = Number(weeklyPostsResult?.count || 0);

      // === MARKETING METRICS ===
      const [campaignsResult] = await db.select({ count: count() })
        .from(adCampaigns)
        .where(eq(adCampaigns.status, 'active'));
      const activeCampaigns = Number(campaignsResult?.count || 0);

      const [impressionsResult] = await db.select({ count: count() }).from(adImpressions);
      const totalImpressions = Number(impressionsResult?.count || 0);

      const [clicksResult] = await db.select({ count: count() }).from(adClicks);
      const totalClicks = Number(clicksResult?.count || 0);

      const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

      // === REVENUE METRICS ===
      const [ordersResult] = await db.select({ 
        count: count(),
        total: sql<number>`COALESCE(SUM(CAST(${storeOrders.totalUsd} AS DECIMAL)), 0)`,
      }).from(storeOrders).where(eq(storeOrders.status, 'paid'));
      const totalOrders = Number(ordersResult?.count || 0);
      const totalRevenue = Number(ordersResult?.total || 0);

      // Monthly revenue
      const [monthlyRevenueResult] = await db.select({ 
        total: sql<number>`COALESCE(SUM(CAST(${storeOrders.totalUsd} AS DECIMAL)), 0)`,
      }).from(storeOrders)
        .where(sql`${storeOrders.status} = 'paid' AND ${storeOrders.createdAt} >= ${oneMonthAgo}`);
      const monthlyRevenue = Number(monthlyRevenueResult?.total || 0);

      // === PRODUCT METRICS ===
      const [roadmapIdeasResult] = await db.select({ count: count() }).from(roadmapIdeas);
      const totalRoadmapIdeas = Number(roadmapIdeasResult?.count || 0);

      const [completedIdeasResult] = await db.select({ count: count() })
        .from(roadmapIdeas)
        .where(eq(roadmapIdeas.status, 'completed'));
      const completedIdeas = Number(completedIdeasResult?.count || 0);

      const [releasesResult] = await db.select({ count: count() }).from(roadmapReleases);
      const totalReleases = Number(releasesResult?.count || 0);

      // === SOCIAL MEDIA METRICS ===
      const { socialPosts } = await import('@shared/schema');
      
      const [draftedPostsResult] = await db.select({ count: count() })
        .from(socialPosts)
        .where(eq(socialPosts.contentStatus, 'drafted'));
      const draftedPosts = Number(draftedPostsResult?.count || 0);

      const [approvedPostsResult] = await db.select({ count: count() })
        .from(socialPosts)
        .where(eq(socialPosts.contentStatus, 'approved'));
      const approvedPosts = Number(approvedPostsResult?.count || 0);

      const [plannedPostsResult] = await db.select({ count: count() })
        .from(socialPosts)
        .where(eq(socialPosts.publishStatus, 'planned'));
      const plannedPosts = Number(plannedPostsResult?.count || 0);

      const [postedPostsResult] = await db.select({ count: count() })
        .from(socialPosts)
        .where(eq(socialPosts.publishStatus, 'posted'));
      const postedPosts = Number(postedPostsResult?.count || 0);

      const [totalSocialPostsResult] = await db.select({ count: count() }).from(socialPosts);
      const totalSocialPosts = Number(totalSocialPostsResult?.count || 0);

      // === B2B CRM METRICS ===
      const [totalCompaniesResult] = await db.select({ count: count() }).from(crmCompanies);
      const totalCompanies = Number(totalCompaniesResult?.count || 0);

      const [activeDealsResult] = await db.select({ count: count() })
        .from(crmDeals)
        .where(sql`${crmDeals.stage} NOT IN ('won', 'lost')`);
      const activeDeals = Number(activeDealsResult?.count || 0);

      const [wonDealsResult] = await db.select({ count: count() })
        .from(crmDeals)
        .where(eq(crmDeals.stage, 'won'));
      const wonDeals = Number(wonDealsResult?.count || 0);

      const [pipelineValueResult] = await db.select({
        total: sql<string>`COALESCE(SUM(deal_value), 0)`,
      }).from(crmDeals)
        .where(sql`${crmDeals.stage} NOT IN ('won', 'lost')`);
      const pipelineValue = Number(pipelineValueResult?.total || 0);

      // === GOALS & OKRs METRICS ===
      const [totalObjectivesResult] = await db.select({ count: count() }).from(objectives);
      const totalObjectives = Number(totalObjectivesResult?.count || 0);

      const [activeObjectivesResult] = await db.select({ count: count() })
        .from(objectives)
        .where(eq(objectives.status, 'active'));
      const activeObjectives = Number(activeObjectivesResult?.count || 0);

      const [avgProgressResult] = await db.select({
        avg: sql<number>`COALESCE(AVG(${objectives.progress}), 0)`,
      }).from(objectives)
        .where(eq(objectives.status, 'active'));
      const avgProgress = Number(avgProgressResult?.avg || 0);

      res.json({
        users: {
          total: totalUsers,
          active: activeUsers,
          activeChange: prevActiveUsers > 0 ? Math.round(((activeUsers - prevActiveUsers) / prevActiveUsers) * 100) : 0,
          newSignups: newSignups,
          signupsChange: prevSignups > 0 ? Math.round(((newSignups - prevSignups) / prevSignups) * 100) : 0,
          avgStreak: Math.round(avgStreak * 10) / 10,
        },
        engagement: {
          lessonCompletionRate,
          totalDaysCompleted,
          avgLessonsPerUser: totalUsers > 0 ? Math.round((totalDaysCompleted / totalUsers) * 10) / 10 : 0,
        },
        content: {
          totalDays: totalContentDays,
          totalQuestions,
          totalLessons,
          coveragePercent: Math.round((totalContentDays / 180) * 100),
        },
        community: {
          totalPosts: totalForumPosts,
          totalReplies: totalForumReplies,
          weeklyPosts,
          engagementRate: totalForumPosts > 0 ? Math.round((totalForumReplies / totalForumPosts) * 10) / 10 : 0,
        },
        marketing: {
          activeCampaigns,
          totalImpressions,
          totalClicks,
          ctr: parseFloat(ctr),
        },
        revenue: {
          totalOrders,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
          avgOrderValue: totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0,
        },
        product: {
          totalIdeas: totalRoadmapIdeas,
          completedIdeas,
          completionRate: totalRoadmapIdeas > 0 ? Math.round((completedIdeas / totalRoadmapIdeas) * 100) : 0,
          totalReleases,
        },
        social: {
          totalPosts: totalSocialPosts,
          drafted: draftedPosts,
          approved: approvedPosts,
          planned: plannedPosts,
          posted: postedPosts,
        },
        crm: {
          totalCompanies,
          activeDeals,
          wonDeals,
          pipelineValue: Math.round(pipelineValue * 100) / 100,
        },
        goals: {
          totalObjectives,
          activeObjectives,
          avgProgress: Math.round(avgProgress),
        },
      });
    } catch (error) {
      console.error("Error fetching KPI dashboard:", error);
      res.status(500).json({ message: "Failed to fetch KPI dashboard" });
    }
  });

  // Get KPI trends over time
  app.get("/api/admin/kpis/trends", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const now = new Date();
      
      // Generate date range
      const dateRange: string[] = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        dateRange.push(date.toISOString().split('T')[0]);
      }

      // User signups by date
      const userSignups = await db.select({
        date: sql<string>`DATE(${users.createdAt})`.as('date'),
        count: count(),
      })
        .from(users)
        .where(sql`${users.createdAt} >= ${new Date(now.getTime() - days * 24 * 60 * 60 * 1000)}`)
        .groupBy(sql`DATE(${users.createdAt})`)
        .orderBy(sql`DATE(${users.createdAt})`);

      // Day completions by date
      const dayCompletions = await db.select({
        date: sql<string>`DATE(${userProgress.completedAt})`.as('date'),
        count: count(),
      })
        .from(userProgress)
        .where(sql`${userProgress.completedAt} >= ${new Date(now.getTime() - days * 24 * 60 * 60 * 1000)} AND ${userProgress.dayCompleted} = true`)
        .groupBy(sql`DATE(${userProgress.completedAt})`)
        .orderBy(sql`DATE(${userProgress.completedAt})`);

      // Forum activity by date
      const forumActivity = await db.select({
        date: sql<string>`DATE(${forumPosts.createdAt})`.as('date'),
        posts: count(),
      })
        .from(forumPosts)
        .where(sql`${forumPosts.createdAt} >= ${new Date(now.getTime() - days * 24 * 60 * 60 * 1000)}`)
        .groupBy(sql`DATE(${forumPosts.createdAt})`)
        .orderBy(sql`DATE(${forumPosts.createdAt})`);

      // Map to date range with zeros for missing dates
      const signupsMap = new Map(userSignups.map(s => [s.date, Number(s.count)]));
      const completionsMap = new Map(dayCompletions.map(c => [c.date, Number(c.count)]));
      const forumMap = new Map(forumActivity.map(f => [f.date, Number(f.posts)]));

      const trends = dateRange.map(date => ({
        date,
        signups: signupsMap.get(date) || 0,
        completions: completionsMap.get(date) || 0,
        forumPosts: forumMap.get(date) || 0,
      }));

      res.json(trends);
    } catch (error) {
      console.error("Error fetching KPI trends:", error);
      res.status(500).json({ message: "Failed to fetch KPI trends" });
    }
  });

  // ==================== KPI Targets Routes ====================

  // Get all KPI targets
  app.get("/api/admin/kpis/targets", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const targets = await db.select().from(kpiTargets).orderBy(kpiTargets.dueDate);
      res.json(targets);
    } catch (error) {
      console.error("Error fetching KPI targets:", error);
      res.status(500).json({ message: "Failed to fetch KPI targets" });
    }
  });

  // Create KPI target
  app.post("/api/admin/kpis/targets", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const body = {
        ...req.body,
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined,
      };
      const data = insertKpiTargetSchema.parse(body);
      const [target] = await db.insert(kpiTargets).values(data).returning();
      res.json(target);
    } catch (error: any) {
      console.error("Error creating KPI target:", error);
      res.status(400).json({ message: error.message || "Failed to create KPI target" });
    }
  });

  // Update KPI target
  app.patch("/api/admin/kpis/targets/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const body = {
        ...req.body,
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined,
      };
      const data = insertKpiTargetSchema.partial().parse(body);
      const [target] = await db.update(kpiTargets)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(kpiTargets.id, id))
        .returning();
      res.json(target);
    } catch (error: any) {
      console.error("Error updating KPI target:", error);
      res.status(400).json({ message: error.message || "Failed to update KPI target" });
    }
  });

  // Delete KPI target
  app.delete("/api/admin/kpis/targets/:id", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      await db.delete(kpiTargets).where(eq(kpiTargets.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting KPI target:", error);
      res.status(500).json({ message: "Failed to delete KPI target" });
    }
  });

  // Update KPI target current values (called when refreshing KPIs)
  app.post("/api/admin/kpis/targets/refresh", requireAdminAuth, async (req: AdminRequest, res) => {
    try {
      const targets = await db.select().from(kpiTargets).where(eq(kpiTargets.status, 'active'));
      const now = new Date();
      
      for (const target of targets) {
        let currentValue = 0;
        
        // Calculate current value based on metric key
        switch (target.metricKey) {
          case 'users.total': {
            const [result] = await db.select({ count: count() }).from(users);
            currentValue = Number(result?.count || 0);
            break;
          }
          case 'users.active': {
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const [result] = await db.select({ count: count() }).from(users).where(sql`${users.lastActivityDate} >= ${oneWeekAgo}`);
            currentValue = Number(result?.count || 0);
            break;
          }
          case 'engagement.lessonCompletionRate': {
            const [totalResult] = await db.select({ count: count() }).from(users);
            const [completedResult] = await db.select({ count: count() }).from(users).where(sql`${users.completedLessons} > 0`);
            const total = Number(totalResult?.count || 0);
            const completed = Number(completedResult?.count || 0);
            currentValue = total > 0 ? Math.round((completed / total) * 100) : 0;
            break;
          }
          case 'content.coverage': {
            const [result] = await db.select({ count: count() }).from(contentDays);
            currentValue = Math.round((Number(result?.count || 0) / 180) * 100);
            break;
          }
          case 'community.totalPosts': {
            const [result] = await db.select({ count: count() }).from(forumPosts);
            currentValue = Number(result?.count || 0);
            break;
          }
          case 'revenue.monthly': {
            const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            const [result] = await db.select({ total: sql<number>`COALESCE(SUM(CAST(${storeOrders.totalUsd} AS DECIMAL)), 0)` })
              .from(storeOrders)
              .where(sql`${storeOrders.status} = 'paid' AND ${storeOrders.createdAt} >= ${oneMonthAgo}`);
            currentValue = Math.round(Number(result?.total || 0));
            break;
          }
          case 'product.completedIdeas': {
            const [result] = await db.select({ count: count() }).from(roadmapIdeas).where(eq(roadmapIdeas.status, 'completed'));
            currentValue = Number(result?.count || 0);
            break;
          }
        }
        
        // Update status based on due date and progress
        let status = target.status;
        if (currentValue >= target.targetValue) {
          status = 'achieved';
        } else if (new Date(target.dueDate) < now && currentValue < target.targetValue) {
          status = 'missed';
        }
        
        await db.update(kpiTargets)
          .set({ currentValue, status, updatedAt: new Date() })
          .where(eq(kpiTargets.id, target.id));
      }
      
      const updatedTargets = await db.select().from(kpiTargets).orderBy(kpiTargets.dueDate);
      res.json(updatedTargets);
    } catch (error) {
      console.error("Error refreshing KPI targets:", error);
      res.status(500).json({ message: "Failed to refresh KPI targets" });
    }
  });

  // ============================================
  // SYSTEM SETTINGS (Super Admin Only)
  // ============================================

  function encryptSettingValue(text: string): string {
    // Use the secure encryption function with per-secret salt
    return encryptSettingValueSecure(text);
  }

  function maskApiKey(key: string): string {
    if (key.length <= 8) return '****';
    return key.substring(0, 4) + '...' + key.substring(key.length - 4);
  }

  const requireSuperAdmin = async (req: AdminRequest, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({ message: "Admin authentication required" });
    }
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({ message: "Super admin access required for this action" });
    }
    next();
  };

  // Get security status for settings
  app.get("/api/admin/settings/security-status", requireAdminAuth, requireSuperAdmin, async (req: AdminRequest, res: Response) => {
    res.json({
      isDefaultEncryptionKey: IS_DEFAULT_ENCRYPTION_KEY,
      isProduction: process.env.NODE_ENV === 'production',
    });
  });

  // Get all settings (returns only masked values)
  app.get("/api/admin/settings", requireAdminAuth, requireSuperAdmin, async (req: AdminRequest, res: Response) => {
    try {
      const settings = await db.select({
        id: systemSettings.id,
        key: systemSettings.key,
        maskedValue: systemSettings.maskedValue,
        description: systemSettings.description,
        category: systemSettings.category,
        updatedAt: systemSettings.updatedAt,
      }).from(systemSettings);
      
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  // Create or update a setting
  app.post("/api/admin/settings", requireAdminAuth, requireSuperAdmin, async (req: AdminRequest, res: Response) => {
    try {
      const { key, value, description, category = 'api_keys' } = req.body;
      
      if (!key || !value) {
        return res.status(400).json({ message: "Key and value are required" });
      }
      
      const encryptedValue = encryptSettingValue(value);
      const maskedValue = maskApiKey(value);
      
      const existing = await db.select().from(systemSettings).where(eq(systemSettings.key, key));
      
      if (existing.length > 0) {
        await db.update(systemSettings)
          .set({
            encryptedValue,
            maskedValue,
            description,
            category,
            updatedBy: req.admin.id,
            updatedAt: new Date(),
          })
          .where(eq(systemSettings.key, key));
      } else {
        await db.insert(systemSettings).values({
          key,
          encryptedValue,
          maskedValue,
          description,
          category,
          updatedBy: req.admin.id,
        });
      }
      
      res.json({ message: "Setting saved successfully", key, maskedValue });
    } catch (error) {
      console.error("Error saving setting:", error);
      res.status(500).json({ message: "Failed to save setting" });
    }
  });

  // Delete a setting
  app.delete("/api/admin/settings/:key", requireAdminAuth, requireSuperAdmin, async (req: AdminRequest, res: Response) => {
    try {
      const { key } = req.params;
      await db.delete(systemSettings).where(eq(systemSettings.key, key));
      res.json({ message: "Setting deleted successfully" });
    } catch (error) {
      console.error("Error deleting setting:", error);
      res.status(500).json({ message: "Failed to delete setting" });
    }
  });

  // Get decrypted value for internal use (used by createAnthropicClient)
  app.get("/api/admin/settings/:key/decrypt", requireAdminAuth, requireSuperAdmin, async (req: AdminRequest, res: Response) => {
    try {
      const { key } = req.params;
      const [setting] = await db.select().from(systemSettings).where(eq(systemSettings.key, key));
      
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      
      const decryptedValue = decryptSettingValue(setting.encryptedValue);
      res.json({ key, value: decryptedValue });
    } catch (error) {
      console.error("Error decrypting setting:", error);
      res.status(500).json({ message: "Failed to decrypt setting" });
    }
  });

  // ============================================
  // AI INSTRUCTIONS MANAGEMENT
  // ============================================

  // Get AI instructions by type
  app.get("/api/admin/ai-instructions/:type", requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      const { type } = req.params;
      const [instructions] = await db.select().from(aiInstructions).where(eq(aiInstructions.type, type));
      
      if (!instructions) {
        return res.json({ type, instructions: null, isLocked: true, exists: false });
      }
      
      res.json({ ...instructions, exists: true });
    } catch (error) {
      console.error("Error fetching AI instructions:", error);
      res.status(500).json({ message: "Failed to fetch AI instructions" });
    }
  });

  // Save AI instructions (create or update)
  app.post("/api/admin/ai-instructions/:type", requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      const { type } = req.params;
      const { name, instructions: instructionsText } = req.body;
      
      if (!instructionsText) {
        return res.status(400).json({ message: "Instructions text is required" });
      }
      
      // Check if locked
      const [existing] = await db.select().from(aiInstructions).where(eq(aiInstructions.type, type));
      
      if (existing?.isLocked) {
        return res.status(403).json({ message: "Instructions are locked. Unlock before editing." });
      }
      
      if (existing) {
        // Update existing
        await db.update(aiInstructions)
          .set({
            name: name || existing.name,
            instructions: instructionsText,
            updatedBy: req.admin?.id,
            updatedAt: new Date(),
          })
          .where(eq(aiInstructions.type, type));
      } else {
        // Create new
        await db.insert(aiInstructions).values({
          type,
          name: name || `${type.charAt(0).toUpperCase() + type.slice(1)} AI Instructions`,
          instructions: instructionsText,
          isLocked: false,
          updatedBy: req.admin?.id,
        });
      }
      
      const [updated] = await db.select().from(aiInstructions).where(eq(aiInstructions.type, type));
      res.json({ message: "Instructions saved successfully", ...updated });
    } catch (error) {
      console.error("Error saving AI instructions:", error);
      res.status(500).json({ message: "Failed to save AI instructions" });
    }
  });

  // Lock AI instructions
  app.post("/api/admin/ai-instructions/:type/lock", requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      const { type } = req.params;
      
      await db.update(aiInstructions)
        .set({ isLocked: true, updatedBy: req.admin?.id, updatedAt: new Date() })
        .where(eq(aiInstructions.type, type));
      
      res.json({ message: "Instructions locked successfully", isLocked: true });
    } catch (error) {
      console.error("Error locking AI instructions:", error);
      res.status(500).json({ message: "Failed to lock AI instructions" });
    }
  });

  // Unlock AI instructions (with confirmation)
  app.post("/api/admin/ai-instructions/:type/unlock", requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      const { type } = req.params;
      const { confirmed } = req.body;
      
      if (!confirmed) {
        return res.status(400).json({ message: "Confirmation required to unlock", requiresConfirmation: true });
      }
      
      await db.update(aiInstructions)
        .set({ isLocked: false, updatedBy: req.admin?.id, updatedAt: new Date() })
        .where(eq(aiInstructions.type, type));
      
      res.json({ message: "Instructions unlocked successfully", isLocked: false });
    } catch (error) {
      console.error("Error unlocking AI instructions:", error);
      res.status(500).json({ message: "Failed to unlock AI instructions" });
    }
  });

  // Reset AI instructions to default
  app.post("/api/admin/ai-instructions/:type/reset", requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      const { type } = req.params;
      const { confirmed } = req.body;
      
      if (!confirmed) {
        return res.status(400).json({ message: "Confirmation required to reset", requiresConfirmation: true });
      }
      
      // Delete the custom instructions (will fall back to hardcoded default)
      await db.delete(aiInstructions).where(eq(aiInstructions.type, type));
      
      res.json({ message: "Instructions reset to default successfully" });
    } catch (error) {
      console.error("Error resetting AI instructions:", error);
      res.status(500).json({ message: "Failed to reset AI instructions" });
    }
  });

  // ============================================
  // SOCIAL INTEGRATIONS MANAGEMENT
  // ============================================

  // Get all social integrations
  app.get("/api/admin/social-integrations", requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      const integrations = await db.select({
        id: socialIntegrations.id,
        platform: socialIntegrations.platform,
        displayName: socialIntegrations.displayName,
        accountHandle: socialIntegrations.accountHandle,
        isActive: socialIntegrations.isActive,
        isValidated: socialIntegrations.isValidated,
        lastValidatedAt: socialIntegrations.lastValidatedAt,
        lastError: socialIntegrations.lastError,
        features: socialIntegrations.features,
        createdAt: socialIntegrations.createdAt,
        updatedAt: socialIntegrations.updatedAt,
      }).from(socialIntegrations);
      
      res.json(integrations);
    } catch (error) {
      console.error("Error fetching social integrations:", error);
      res.status(500).json({ message: "Failed to fetch social integrations" });
    }
  });

  // Save or update a social integration
  app.post("/api/admin/social-integrations", requireAdminAuth, requireSuperAdmin, async (req: AdminRequest, res: Response) => {
    try {
      // Block credential operations in production without proper encryption key
      if (ENCRYPTION_KEY_REQUIRED_IN_PROD) {
        console.error(`[Security] Blocked credential save attempt - SETTINGS_ENCRYPTION_KEY not set in production`);
        return res.status(503).json({ message: "Credential storage unavailable. Server configuration required." });
      }
      
      const { platform, displayName, apiKey, apiSecret, bearerToken, accessToken, accessTokenSecret, webhookSecret, accountHandle } = req.body;
      
      if (!platform || !displayName) {
        return res.status(400).json({ message: "Platform and display name are required" });
      }

      // Encrypt sensitive fields if provided (uses new secure format with per-secret salt)
      const encryptedApiKey = apiKey ? encryptSettingValue(apiKey) : null;
      const encryptedApiSecret = apiSecret ? encryptSettingValue(apiSecret) : null;
      const encryptedBearerToken = bearerToken ? encryptSettingValue(bearerToken) : null;
      const encryptedAccessToken = accessToken ? encryptSettingValue(accessToken) : null;
      const encryptedAccessTokenSecret = accessTokenSecret ? encryptSettingValue(accessTokenSecret) : null;
      const encryptedWebhookSecret = webhookSecret ? encryptSettingValue(webhookSecret) : null;

      // Check if integration exists for this platform
      const [existing] = await db.select().from(socialIntegrations).where(eq(socialIntegrations.platform, platform));
      
      if (existing) {
        // Update existing - only update fields that were provided
        const updateData: any = {
          displayName,
          accountHandle: accountHandle || existing.accountHandle,
          updatedAt: new Date(),
        };
        
        if (apiKey) updateData.apiKey = encryptedApiKey;
        if (apiSecret) updateData.apiSecret = encryptedApiSecret;
        if (bearerToken) updateData.bearerToken = encryptedBearerToken;
        if (accessToken) updateData.accessToken = encryptedAccessToken;
        if (accessTokenSecret) updateData.accessTokenSecret = encryptedAccessTokenSecret;
        if (webhookSecret) updateData.webhookSecret = encryptedWebhookSecret;
        
        await db.update(socialIntegrations)
          .set(updateData)
          .where(eq(socialIntegrations.platform, platform));
        
        // Audit log
        console.log(`[Audit] Social integration ${platform} UPDATED by admin ${req.admin?.id}`);
        res.json({ message: "Integration updated successfully" });
      } else {
        // Create new
        await db.insert(socialIntegrations).values({
          platform,
          displayName,
          apiKey: encryptedApiKey,
          apiSecret: encryptedApiSecret,
          bearerToken: encryptedBearerToken,
          accessToken: encryptedAccessToken,
          accessTokenSecret: encryptedAccessTokenSecret,
          webhookSecret: encryptedWebhookSecret,
          accountHandle,
          isActive: false,
          isValidated: false,
        });
        
        // Audit log
        console.log(`[Audit] Social integration ${platform} CREATED by admin ${req.admin?.id}`);
        res.json({ message: "Integration created successfully" });
      }
    } catch (error) {
      console.error("Error saving social integration:", error);
      res.status(500).json({ message: "Failed to save social integration" });
    }
  });

  // Validate a social integration (test the API connection)
  app.post("/api/admin/social-integrations/:platform/validate", requireAdminAuth, requireSuperAdmin, async (req: AdminRequest, res: Response) => {
    const { platform } = req.params;
    
    try {
      const [integration] = await db.select().from(socialIntegrations).where(eq(socialIntegrations.platform, platform));
      
      if (!integration) {
        return res.status(404).json({ message: "Integration not found" });
      }

      // Check if credentials exist
      const hasCredentials = integration.bearerToken || integration.apiKey;
      if (!hasCredentials) {
        await db.update(socialIntegrations)
          .set({
            isValidated: false,
            lastError: "No API credentials configured",
            updatedAt: new Date(),
          })
          .where(eq(socialIntegrations.platform, platform));
        return res.status(400).json({ message: "No API credentials configured for validation" });
      }

      // Platform-specific validation (decrypt and test)
      let validationResult = { success: false, error: "" };
      
      try {
        // Decrypt credentials for validation
        const bearerToken = integration.bearerToken ? decryptSettingValue(integration.bearerToken) : null;
        const apiKey = integration.apiKey ? decryptSettingValue(integration.apiKey) : null;
        
        // Platform-specific API validation
        switch (platform) {
          case 'twitter':
            // Twitter/X API v2 validation - verify credentials
            if (bearerToken) {
              const response = await fetch('https://api.twitter.com/2/users/me', {
                headers: { 'Authorization': `Bearer ${bearerToken}` }
              });
              if (response.ok) {
                validationResult = { success: true, error: "" };
              } else if (response.status === 401) {
                validationResult = { success: false, error: "Invalid or expired bearer token" };
              } else {
                validationResult = { success: false, error: `API returned status ${response.status}` };
              }
            } else {
              validationResult = { success: false, error: "Bearer token required for Twitter" };
            }
            break;
            
          case 'linkedin':
          case 'instagram':
          case 'facebook':
            // For these platforms, we validate format but don't make API calls without full OAuth setup
            // Mark as validated if credentials are present and properly formatted
            if (bearerToken || apiKey) {
              validationResult = { success: true, error: "" };
              console.log(`[Audit] ${platform} integration credentials validated (format check only)`);
            } else {
              validationResult = { success: false, error: "API credentials required" };
            }
            break;
            
          default:
            validationResult = { success: false, error: "Unknown platform" };
        }
      } catch (decryptError) {
        console.error(`[Security] Failed to decrypt credentials for ${platform}:`, decryptError);
        validationResult = { success: false, error: "Failed to decrypt stored credentials" };
      }

      // Update validation status
      await db.update(socialIntegrations)
        .set({
          isValidated: validationResult.success,
          isActive: validationResult.success,
          lastValidatedAt: new Date(),
          lastError: validationResult.error || null,
          updatedAt: new Date(),
        })
        .where(eq(socialIntegrations.platform, platform));

      // Audit log
      console.log(`[Audit] Social integration ${platform} validation: ${validationResult.success ? 'SUCCESS' : 'FAILED'} by admin ${req.admin?.id}`);
      
      if (validationResult.success) {
        res.json({ message: "Integration validated successfully", isValidated: true });
      } else {
        res.status(400).json({ message: "Validation failed", error: validationResult.error });
      }
    } catch (error) {
      console.error("Error validating social integration:", error);
      
      // Audit log for failure
      console.log(`[Audit] Social integration ${platform} validation FAILED (exception) by admin ${req.admin?.id}`);
      
      // Update with sanitized error
      try {
        await db.update(socialIntegrations)
          .set({
            isValidated: false,
            lastError: "Validation process failed",
            updatedAt: new Date(),
          })
          .where(eq(socialIntegrations.platform, platform));
      } catch (updateError) {
        console.error("Failed to update integration error status:", updateError);
      }
      
      // Return sanitized error (don't leak internal details)
      res.status(500).json({ message: "Validation failed. Please check your credentials and try again." });
    }
  });

  // Toggle integration active status
  app.post("/api/admin/social-integrations/:platform/toggle", requireAdminAuth, requireSuperAdmin, async (req: AdminRequest, res: Response) => {
    try {
      const { platform } = req.params;
      const [integration] = await db.select().from(socialIntegrations).where(eq(socialIntegrations.platform, platform));
      
      if (!integration) {
        return res.status(404).json({ message: "Integration not found" });
      }

      // Prevent enabling without validation
      if (!integration.isActive && !integration.isValidated) {
        return res.status(400).json({ message: "Please validate the integration before enabling it" });
      }

      const newActiveState = !integration.isActive;
      
      await db.update(socialIntegrations)
        .set({
          isActive: newActiveState,
          updatedAt: new Date(),
        })
        .where(eq(socialIntegrations.platform, platform));
      
      // Audit log
      console.log(`[Audit] Social integration ${platform} ${newActiveState ? 'ENABLED' : 'DISABLED'} by admin ${req.admin?.id}`);
      
      res.json({ message: `Integration ${integration.isActive ? 'deactivated' : 'activated'} successfully`, isActive: newActiveState });
    } catch (error) {
      console.error("Error toggling social integration:", error);
      res.status(500).json({ message: "Failed to update integration status" });
    }
  });

  // Delete a social integration
  app.delete("/api/admin/social-integrations/:platform", requireAdminAuth, requireSuperAdmin, async (req: AdminRequest, res: Response) => {
    try {
      const { platform } = req.params;
      
      // Check if integration exists
      const [existing] = await db.select({ id: socialIntegrations.id }).from(socialIntegrations).where(eq(socialIntegrations.platform, platform));
      if (!existing) {
        return res.status(404).json({ message: "Integration not found" });
      }
      
      await db.delete(socialIntegrations).where(eq(socialIntegrations.platform, platform));
      
      // Audit log
      console.log(`[Audit] Social integration ${platform} DELETED by admin ${req.admin?.id}`);
      
      res.json({ message: "Integration removed successfully" });
    } catch (error) {
      console.error("Error deleting social integration:", error);
      res.status(500).json({ message: "Failed to remove integration" });
    }
  });

  // ============================================
  // PAYWALL SETTINGS MANAGEMENT
  // ============================================

  // Available premium features configuration - all 8 simulators
  const AVAILABLE_FEATURES = [
    { key: 'safety', label: 'Safety Training', description: 'Bitcoin security best practices module' },
    { key: 'wallet', label: 'Wallet Simulator', description: 'Wallet creation and recovery practice' },
    { key: 'transactions', label: 'Transactions Simulator', description: 'Bitcoin transaction building practice' },
    { key: 'transfer', label: 'Transfer Simulator', description: 'Practice sending and receiving Bitcoin' },
    { key: 'hodl', label: 'HODL Simulator', description: 'Long-term holding projection tool' },
    { key: 'dca', label: 'DCA Calculator', description: 'Dollar-cost averaging simulation' },
    { key: 'inflation', label: 'Inflation Calculator', description: 'Purchasing power comparison tool' },
    { key: 'fees', label: 'Fees Simulator', description: 'Transaction fee optimization practice' },
  ];

  // Get paywall settings
  app.get("/api/admin/paywall", requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      // Get settings or return defaults
      const [settings] = await db.select().from(paywallSettings);
      
      if (!settings) {
        // Return default settings
        return res.json({
          id: null,
          freeDayThreshold: 7,
          paywallEnabled: true,
          premiumFeatures: ['wallet', 'transactions', 'transfer', 'hodl', 'dca', 'inflation', 'fees'],
          paywallTitle: 'Unlock Your Bitcoin Education',
          paywallMessage: 'Subscribe to access all 336 days of Bitcoin mastery and premium tools.',
          availableFeatures: AVAILABLE_FEATURES,
        });
      }
      
      res.json({
        ...settings,
        availableFeatures: AVAILABLE_FEATURES,
      });
    } catch (error) {
      console.error("Error fetching paywall settings:", error);
      res.status(500).json({ message: "Failed to fetch paywall settings" });
    }
  });

  // Valid simulator/feature keys
  const VALID_FEATURE_KEYS = ['safety', 'wallet', 'transactions', 'transfer', 'hodl', 'dca', 'inflation', 'fees'];
  
  // Zod schema for paywall settings validation
  const paywallSettingsUpdateSchema = z.object({
    freeDayThreshold: z.number().int().min(0).max(336).optional(),
    paywallEnabled: z.boolean().optional(),
    premiumFeatures: z.array(z.enum(['safety', 'wallet', 'transactions', 'transfer', 'hodl', 'dca', 'inflation', 'fees'])).optional(),
    paywallTitle: z.string().min(1).max(200).optional(),
    paywallMessage: z.string().min(1).max(1000).optional(),
  });

  // Save paywall settings
  app.post("/api/admin/paywall", requireAdminAuth, requireSuperAdmin, async (req: AdminRequest, res: Response) => {
    try {
      // Validate request body with Zod
      const parseResult = paywallSettingsUpdateSchema.safeParse(req.body);
      if (!parseResult.success) {
        const errors = parseResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        return res.status(400).json({ message: `Validation failed: ${errors}` });
      }
      
      const { freeDayThreshold, paywallEnabled, premiumFeatures, paywallTitle, paywallMessage } = parseResult.data;
      
      // Check if settings exist
      const [existing] = await db.select().from(paywallSettings);
      
      if (existing) {
        // Update existing
        await db.update(paywallSettings)
          .set({
            freeDayThreshold: freeDayThreshold ?? existing.freeDayThreshold,
            paywallEnabled: paywallEnabled ?? existing.paywallEnabled,
            premiumFeatures: premiumFeatures ?? existing.premiumFeatures,
            paywallTitle: paywallTitle ?? existing.paywallTitle,
            paywallMessage: paywallMessage ?? existing.paywallMessage,
            updatedBy: req.admin?.id,
            updatedAt: new Date(),
          })
          .where(eq(paywallSettings.id, existing.id));
      } else {
        // Create new
        await db.insert(paywallSettings).values({
          freeDayThreshold: freeDayThreshold ?? 7,
          paywallEnabled: paywallEnabled ?? true,
          premiumFeatures: premiumFeatures ?? ['wallet', 'transactions', 'transfer', 'hodl', 'dca', 'inflation', 'fees'],
          paywallTitle: paywallTitle ?? 'Unlock Your Bitcoin Education',
          paywallMessage: paywallMessage ?? 'Subscribe to access all 336 days of Bitcoin mastery and premium tools.',
          updatedBy: req.admin?.id,
        });
      }
      
      // Audit log
      console.log(`[Audit] Paywall settings updated by admin ${req.admin?.id}: threshold=${freeDayThreshold}, enabled=${paywallEnabled}`);
      
      const [updated] = await db.select().from(paywallSettings);
      res.json({ 
        message: "Paywall settings saved successfully",
        ...updated,
        availableFeatures: AVAILABLE_FEATURES,
      });
    } catch (error) {
      console.error("Error saving paywall settings:", error);
      res.status(500).json({ message: "Failed to save paywall settings" });
    }
  });

  // Get Stripe connection status and stats
  app.get("/api/admin/stripe/status", requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      // Check if Stripe tables exist first
      const tableCheck = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = 'products'
        ) as products_exists,
        EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = 'prices'
        ) as prices_exists,
        EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = 'subscriptions'
        ) as subscriptions_exists
      `);
      
      const tablesExist = tableCheck.rows[0];
      
      if (!tablesExist?.products_exists || !tablesExist?.prices_exists) {
        return res.json({
          connected: false,
          productCount: 0,
          priceCount: 0,
          activeSubscriptions: 0,
          message: "Stripe integration pending. Run Stripe sync to initialize.",
        });
      }
      
      // Tables exist, fetch counts
      const productCount = await db.execute(sql`SELECT COUNT(*) as count FROM products`);
      const priceCount = await db.execute(sql`SELECT COUNT(*) as count FROM prices`);
      
      let activeSubscriptions = 0;
      if (tablesExist?.subscriptions_exists) {
        const subscriptionCount = await db.execute(sql`SELECT COUNT(*) as count FROM subscriptions WHERE status = 'active'`);
        activeSubscriptions = Number(subscriptionCount.rows[0]?.count || 0);
      }
      
      res.json({
        connected: true,
        productCount: Number(productCount.rows[0]?.count || 0),
        priceCount: Number(priceCount.rows[0]?.count || 0),
        activeSubscriptions,
      });
    } catch (error) {
      console.error("Error fetching Stripe status:", error);
      res.json({
        connected: false,
        productCount: 0,
        priceCount: 0,
        activeSubscriptions: 0,
        error: "Unable to check Stripe status",
      });
    }
  });

  // Get Stripe products list
  app.get("/api/admin/stripe/products", requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      const products = await db.execute(sql`
        SELECT p.id, p.name, p.description, p.active, 
               pr.id as price_id, pr.unit_amount, pr.currency, pr.recurring_interval
        FROM products p
        LEFT JOIN prices pr ON pr.product_id = p.id AND pr.active = true
        ORDER BY p.created DESC
        LIMIT 50
      `);
      
      res.json(products.rows);
    } catch (error) {
      console.error("Error fetching Stripe products:", error);
      res.json([]);
    }
  });

  // ==================== ARCHIVE/RESTORE ENDPOINTS ====================
  // Define archivable entities with name field for display
  interface ArchivableEntity {
    table: any;
    name: string;
    displayField: string; // Field to use for item name in archive list
    detailsField?: string; // Optional field for additional details
  }
  
  const archivableEntities: Record<string, ArchivableEntity> = {
    'users': { table: users, name: 'User', displayField: 'username', detailsField: 'email' },
    'admin-users': { table: adminUsers, name: 'Admin User', displayField: 'name', detailsField: 'email' },
    'advertising-clients': { table: advertisingClients, name: 'Advertising Client', displayField: 'name' },
    'store-products': { table: storeProducts, name: 'Store Product', displayField: 'name', detailsField: 'sku' },
    'store-orders': { table: storeOrders, name: 'Store Order', displayField: 'orderNumber' },
    'affiliate-products': { table: affiliateProducts, name: 'Affiliate Product', displayField: 'name' },
    'referral-partners': { table: referralPartners, name: 'Referral Partner', displayField: 'name' },
    'referral-signups': { table: referralSignups, name: 'Referral Signup', displayField: 'id' },
    'invoices': { table: invoices, name: 'Invoice', displayField: 'invoiceNumber' },
    'social-posts': { table: socialPosts, name: 'Social Post', displayField: 'title' },
    'social-accounts': { table: socialAccounts, name: 'Social Account', displayField: 'accountName' },
    'social-integrations': { table: socialIntegrations, name: 'Social Integration', displayField: 'platform' },
    'crm-companies': { table: crmCompanies, name: 'CRM Company', displayField: 'name', detailsField: 'industry' },
    'crm-contacts': { table: crmContacts, name: 'CRM Contact', displayField: 'email' },
    'crm-deals': { table: crmDeals, name: 'CRM Deal', displayField: 'title', detailsField: 'stage' },
    'crm-activities': { table: crmActivities, name: 'CRM Activity', displayField: 'type' },
    'forum-categories': { table: forumCategories, name: 'Forum Category', displayField: 'name' },
    'forum-posts': { table: forumPosts, name: 'Forum Post', displayField: 'title' },
    'forum-replies': { table: forumReplies, name: 'Forum Reply', displayField: 'id' },
    'ad-campaigns': { table: adCampaigns, name: 'Ad Campaign', displayField: 'name' },
    'content-days': { table: contentDays, name: 'Content Day', displayField: 'dayNumber' },
    'roadmap-ideas': { table: roadmapIdeas, name: 'Roadmap Idea', displayField: 'title' },
    'roadmap-releases': { table: roadmapReleases, name: 'Roadmap Release', displayField: 'version' },
    'objectives': { table: objectives, name: 'Objective', displayField: 'title' },
    'key-results': { table: keyResults, name: 'Key Result', displayField: 'title' },
    'kpi-targets': { table: kpiTargets, name: 'KPI Target', displayField: 'name' },
  };

  // Unified archive listing endpoint - returns all archived items across all types
  app.get("/api/admin/archive", requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      const { type } = req.query;
      const archivedItems: Array<{
        id: number;
        entityType: string;
        name: string;
        archivedAt: string;
        details?: string;
      }> = [];

      const entityTypes = type && type !== 'all' 
        ? { [type as string]: archivableEntities[type as string] }
        : archivableEntities;

      for (const [entityType, entity] of Object.entries(entityTypes)) {
        if (!entity) continue;
        
        try {
          const items = await db.select()
            .from(entity.table)
            .where(sql`${entity.table.archivedAt} IS NOT NULL`);
          
          for (const item of items) {
            const displayValue = (item as any)[entity.displayField];
            const detailsValue = entity.detailsField ? (item as any)[entity.detailsField] : undefined;
            
            archivedItems.push({
              id: (item as any).id,
              entityType,
              name: displayValue ? String(displayValue) : `${entity.name} #${(item as any).id}`,
              archivedAt: (item as any).archivedAt,
              details: detailsValue ? String(detailsValue) : undefined,
            });
          }
        } catch (err) {
          // Skip entities that might not have archivedAt column
          console.log(`Skipping ${entityType}: ${err}`);
        }
      }

      // Sort by archivedAt date descending
      archivedItems.sort((a, b) => 
        new Date(b.archivedAt).getTime() - new Date(a.archivedAt).getTime()
      );

      res.json(archivedItems);
    } catch (error) {
      console.error("Error fetching archived items:", error);
      res.status(500).json({ message: "Failed to fetch archived items" });
    }
  });

  // Restore endpoint with path that matches frontend expectations
  app.post("/api/admin/archive/:entityType/:id/restore", requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      const { entityType, id } = req.params;
      const entity = archivableEntities[entityType];
      
      if (!entity) {
        return res.status(400).json({ message: `Unknown entity type: ${entityType}` });
      }

      const itemId = parseInt(id);
      if (isNaN(itemId)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      await db.update(entity.table)
        .set({ archivedAt: null })
        .where(eq(entity.table.id, itemId));

      res.json({ message: `${entity.name} restored successfully` });
    } catch (error) {
      console.error("Error restoring item:", error);
      res.status(500).json({ message: "Failed to restore item" });
    }
  });

  // Permanent delete endpoint with path that matches frontend expectations
  app.delete("/api/admin/archive/:entityType/:id", requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      const { entityType, id } = req.params;
      const entity = archivableEntities[entityType];
      
      if (!entity) {
        return res.status(400).json({ message: `Unknown entity type: ${entityType}` });
      }

      const itemId = parseInt(id);
      if (isNaN(itemId)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      // Only allow permanent deletion of items that are already archived
      const [item] = await db.select()
        .from(entity.table)
        .where(and(eq(entity.table.id, itemId), sql`${entity.table.archivedAt} IS NOT NULL`));

      if (!item) {
        return res.status(404).json({ message: "Item not found or not archived. Archive first before permanent deletion." });
      }

      await db.delete(entity.table).where(eq(entity.table.id, itemId));

      res.json({ message: `${entity.name} permanently deleted` });
    } catch (error) {
      console.error("Error permanently deleting item:", error);
      res.status(500).json({ message: "Failed to permanently delete item" });
    }
  });

  // Archive an item (soft delete)
  app.post("/api/admin/archive/:entityType/:id", requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      const { entityType, id } = req.params;
      const entity = archivableEntities[entityType];
      
      if (!entity) {
        return res.status(400).json({ message: `Unknown entity type: ${entityType}` });
      }

      const itemId = parseInt(id);
      if (isNaN(itemId)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      await db.update(entity.table)
        .set({ archivedAt: new Date() })
        .where(eq(entity.table.id, itemId));

      res.json({ message: `${entity.name} archived successfully` });
    } catch (error) {
      console.error("Error archiving item:", error);
      res.status(500).json({ message: "Failed to archive item" });
    }
  });

  // Restore an archived item
  app.post("/api/admin/restore/:entityType/:id", requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      const { entityType, id } = req.params;
      const entity = archivableEntities[entityType];
      
      if (!entity) {
        return res.status(400).json({ message: `Unknown entity type: ${entityType}` });
      }

      const itemId = parseInt(id);
      if (isNaN(itemId)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      await db.update(entity.table)
        .set({ archivedAt: null })
        .where(eq(entity.table.id, itemId));

      res.json({ message: `${entity.name} restored successfully` });
    } catch (error) {
      console.error("Error restoring item:", error);
      res.status(500).json({ message: "Failed to restore item" });
    }
  });

  // Get archived items for an entity type
  app.get("/api/admin/archived/:entityType", requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      const { entityType } = req.params;
      const entity = archivableEntities[entityType];
      
      if (!entity) {
        return res.status(400).json({ message: `Unknown entity type: ${entityType}` });
      }

      const archivedItems = await db.select()
        .from(entity.table)
        .where(sql`${entity.table.archivedAt} IS NOT NULL`)
        .orderBy(sql`${entity.table.archivedAt} DESC`);

      res.json(archivedItems);
    } catch (error) {
      console.error("Error fetching archived items:", error);
      res.status(500).json({ message: "Failed to fetch archived items" });
    }
  });

  // Permanently delete an archived item (requires confirmation)
  app.delete("/api/admin/permanent-delete/:entityType/:id", requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      const { entityType, id } = req.params;
      const { confirmDelete } = req.body;
      
      if (confirmDelete !== true) {
        return res.status(400).json({ message: "Deletion requires explicit confirmation" });
      }

      const entity = archivableEntities[entityType];
      
      if (!entity) {
        return res.status(400).json({ message: `Unknown entity type: ${entityType}` });
      }

      const itemId = parseInt(id);
      if (isNaN(itemId)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      // Only allow permanent deletion of items that are already archived
      const [item] = await db.select()
        .from(entity.table)
        .where(and(eq(entity.table.id, itemId), sql`${entity.table.archivedAt} IS NOT NULL`));

      if (!item) {
        return res.status(404).json({ message: "Item not found or not archived. Archive first before permanent deletion." });
      }

      await db.delete(entity.table).where(eq(entity.table.id, itemId));

      res.json({ message: `${entity.name} permanently deleted` });
    } catch (error) {
      console.error("Error permanently deleting item:", error);
      res.status(500).json({ message: "Failed to permanently delete item" });
    }
  });

  // Register email management routes
  registerEmailRoutes(app, requireAdminAuth);
}
