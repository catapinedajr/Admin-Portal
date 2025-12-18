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
      const { title, theme, isActive, isApproved } = req.body;
      
      const [updated] = await db.update(contentDays)
        .set({ 
          title, 
          theme, 
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
