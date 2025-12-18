import type { Express, Request, Response, NextFunction } from "express";
import { adminAuthService } from "./admin-auth";
import { db } from "./db";
import { adminLoginSchema, contentDays, users, adCampaigns, storeProducts } from "@shared/schema";
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
