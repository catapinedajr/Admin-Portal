import type { Express, Request, Response, NextFunction } from "express";
import { adminAuthService } from "./admin-auth";
import { db } from "./db";
import { adminLoginSchema, contentDays, contentSetUpQuestions, contentLessons, contentQuizzes, users, adCampaigns, storeProducts, storeOrders } from "@shared/schema";
import { count, eq, sql, and, sum } from "drizzle-orm";

interface AdminRequest extends Request {
  admin?: any;
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

export function registerAdminRoutes(app: Express) {
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

      res.json({
        totalUsers,
        activeUsers,
        paidUsers: 0, // Placeholder until Stripe integration
        freeUsers: totalUsers, // All users are free until Stripe
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
        industry: null,
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
      const { companyName, contactName, email, phone, industry, notes } = req.body;
      
      const [client] = await db.insert(advertisingClients).values({
        name: companyName,
        contactName,
        contactEmail: email,
        contactPhone: phone || null,
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
      const { name, advertiser, clientId, budgetCents, startDate, endDate, targetImpressions } = req.body;
      
      const [campaign] = await db.insert(adCampaigns).values({
        name,
        advertiser,
        clientId: clientId || null,
        status: 'draft',
        budgetCents: budgetCents || 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        targetImpressions: targetImpressions || null,
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
      const products = await db.select().from(storeProducts).orderBy(storeProducts.sortOrder);
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
      const orders = await db.select().from(storeOrders).orderBy(storeOrders.createdAt);
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
}
