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
      if (!dayIndex || !title || !theme) {
        return res.status(400).json({ message: "Missing required fields: dayIndex, title, theme" });
      }
      
      // Check if day index already exists
      const existing = await db.select().from(contentDays).where(eq(contentDays.dayIndex, dayIndex));
      if (existing.length > 0) {
        return res.status(400).json({ message: `Day ${dayIndex} already exists` });
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
