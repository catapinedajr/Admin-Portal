import type { Express, Request, Response, NextFunction } from "express";
import { adminAuthService } from "./admin-auth";
import { db } from "./db";
import { adminLoginSchema, contentDays, contentSetUpQuestions, contentLessons, contentQuizzes, users, adCampaigns, storeProducts } from "@shared/schema";
import { count, eq, sql } from "drizzle-orm";

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
      const { title, theme, readingLevel, culturalStage, isActive, isApproved } = req.body;
      
      const [updated] = await db.update(contentDays)
        .set({ 
          title, 
          theme,
          readingLevel,
          culturalStage, 
          isActive, 
          isApproved,
          updatedAt: new Date(),
        })
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
      
      // Get campaigns with their stats
      const campaigns = await db.select().from(adCampaigns).where(eq(adCampaigns.status, 'active'));
      const campaignsWithStats = await Promise.all(campaigns.map(async (campaign) => {
        const impressions = await db.select({ count: count() })
          .from(adImpressions)
          .where(eq(adImpressions.campaignId, campaign.id));
        const clicks = await db.select({ count: count() })
          .from(adClicks)
          .where(eq(adClicks.campaignId, campaign.id));
        
        const imp = impressions[0]?.count || 0;
        const clk = clicks[0]?.count || 0;
        
        return {
          id: campaign.id,
          name: campaign.name,
          advertiser: campaign.advertiser,
          impressions: imp,
          clicks: clk,
          ctr: imp > 0 ? (clk / imp) * 100 : 0,
        };
      }));
      
      res.json({ 
        totalImpressions, 
        totalClicks, 
        ctr,
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
