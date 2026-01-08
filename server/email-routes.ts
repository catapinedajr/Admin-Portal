import { Express } from "express";
import { db } from "./db";
import { 
  emailTemplates, emailCampaigns, emailAutomations, emailSendLog, users,
  insertEmailTemplateSchema, insertEmailCampaignSchema, insertEmailAutomationSchema
} from "@shared/schema";
import { eq, desc, sql, and, isNull, gte, lte, count } from "drizzle-orm";
import { sendEmail, getEmailServiceStatus } from "./email-service";
import Anthropic from "@anthropic-ai/sdk";

export function registerEmailRoutes(app: Express, requireAdminAuth: any) {
  
  // ==================== EMAIL SERVICE STATUS ====================
  
  app.get("/api/admin/email/status", requireAdminAuth, async (req, res) => {
    try {
      const status = getEmailServiceStatus();
      res.json(status);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== EMAIL TEMPLATES ====================
  
  app.get("/api/admin/email/templates", requireAdminAuth, async (req, res) => {
    try {
      const templates = await db.select()
        .from(emailTemplates)
        .where(isNull(emailTemplates.archivedAt))
        .orderBy(desc(emailTemplates.createdAt));
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/email/templates/:id", requireAdminAuth, async (req, res) => {
    try {
      const [template] = await db.select()
        .from(emailTemplates)
        .where(eq(emailTemplates.id, parseInt(req.params.id)))
        .limit(1);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/email/templates", requireAdminAuth, async (req: any, res) => {
    try {
      const validatedData = insertEmailTemplateSchema.parse(req.body);
      const [template] = await db.insert(emailTemplates)
        .values({
          ...validatedData,
          createdBy: req.admin?.id,
          updatedBy: req.admin?.id,
        })
        .returning();
      res.json(template);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/admin/email/templates/:id", requireAdminAuth, async (req: any, res) => {
    try {
      const [template] = await db.update(emailTemplates)
        .set({
          ...req.body,
          updatedBy: req.admin?.id,
          updatedAt: new Date(),
        })
        .where(eq(emailTemplates.id, parseInt(req.params.id)))
        .returning();
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/admin/email/templates/:id", requireAdminAuth, async (req, res) => {
    try {
      const [template] = await db.update(emailTemplates)
        .set({ archivedAt: new Date() })
        .where(eq(emailTemplates.id, parseInt(req.params.id)))
        .returning();
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json({ message: "Template archived" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== EMAIL CAMPAIGNS ====================
  
  app.get("/api/admin/email/campaigns", requireAdminAuth, async (req, res) => {
    try {
      const campaigns = await db.select()
        .from(emailCampaigns)
        .orderBy(desc(emailCampaigns.createdAt));
      res.json(campaigns);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/email/campaigns/:id", requireAdminAuth, async (req, res) => {
    try {
      const [campaign] = await db.select()
        .from(emailCampaigns)
        .where(eq(emailCampaigns.id, parseInt(req.params.id)))
        .limit(1);
      
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/email/campaigns", requireAdminAuth, async (req: any, res) => {
    try {
      const validatedData = insertEmailCampaignSchema.parse(req.body);
      const [campaign] = await db.insert(emailCampaigns)
        .values({
          ...validatedData,
          createdBy: req.admin?.id,
        })
        .returning();
      res.json(campaign);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/admin/email/campaigns/:id", requireAdminAuth, async (req: any, res) => {
    try {
      const [campaign] = await db.update(emailCampaigns)
        .set({
          ...req.body,
          updatedAt: new Date(),
        })
        .where(eq(emailCampaigns.id, parseInt(req.params.id)))
        .returning();
      
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Send campaign to target audience
  app.post("/api/admin/email/campaigns/:id/send", requireAdminAuth, async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const [campaign] = await db.select()
        .from(emailCampaigns)
        .where(eq(emailCampaigns.id, campaignId))
        .limit(1);
      
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      if (campaign.status === "sent" || campaign.status === "sending") {
        return res.status(400).json({ message: "Campaign already sent or in progress" });
      }

      // Get target users based on audience
      let targetUsers = await db.select({ id: users.id, email: users.email })
        .from(users)
        .where(isNull(users.archivedAt));

      // Filter by audience type
      if (campaign.targetAudience === "active") {
        // Active in last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        targetUsers = targetUsers.filter(u => u.email);
      }

      // Update campaign status
      await db.update(emailCampaigns)
        .set({ 
          status: "sending",
          recipientCount: targetUsers.length,
        })
        .where(eq(emailCampaigns.id, campaignId));

      // Send emails (in background for large lists)
      let sentCount = 0;
      for (const user of targetUsers) {
        if (user.email) {
          const result = await sendEmail({
            to: user.email,
            subject: campaign.subject,
            html: campaign.htmlContent,
            text: campaign.textContent || undefined,
            userId: user.id,
            campaignId,
          });
          if (result.success) sentCount++;
        }
      }

      // Update campaign with final stats
      await db.update(emailCampaigns)
        .set({ 
          status: "sent",
          sentCount,
          sentAt: new Date(),
        })
        .where(eq(emailCampaigns.id, campaignId));

      res.json({ 
        message: `Campaign sent to ${sentCount} recipients`,
        sentCount,
        recipientCount: targetUsers.length,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== EMAIL AUTOMATIONS ====================
  
  app.get("/api/admin/email/automations", requireAdminAuth, async (req, res) => {
    try {
      const automations = await db.select()
        .from(emailAutomations)
        .orderBy(emailAutomations.triggerType);
      res.json(automations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/email/automations", requireAdminAuth, async (req: any, res) => {
    try {
      const [automation] = await db.insert(emailAutomations)
        .values({
          ...req.body,
          createdBy: req.admin?.id,
          updatedBy: req.admin?.id,
        })
        .returning();
      res.json(automation);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/admin/email/automations/:id", requireAdminAuth, async (req: any, res) => {
    try {
      const [automation] = await db.update(emailAutomations)
        .set({
          ...req.body,
          updatedBy: req.admin?.id,
          updatedAt: new Date(),
        })
        .where(eq(emailAutomations.id, parseInt(req.params.id)))
        .returning();
      
      if (!automation) {
        return res.status(404).json({ message: "Automation not found" });
      }
      res.json(automation);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/admin/email/automations/:id", requireAdminAuth, async (req: any, res) => {
    try {
      const [automation] = await db.delete(emailAutomations)
        .where(eq(emailAutomations.id, parseInt(req.params.id)))
        .returning();
      
      if (!automation) {
        return res.status(404).json({ message: "Automation not found" });
      }
      res.json({ message: "Automation deleted" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ==================== EMAIL SEND LOG ====================
  
  app.get("/api/admin/email/logs", requireAdminAuth, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const logs = await db.select()
        .from(emailSendLog)
        .orderBy(desc(emailSendLog.createdAt))
        .limit(limit)
        .offset(offset);
      
      const [{ total }] = await db.select({ total: count() }).from(emailSendLog);
      
      res.json({ logs, total });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== AI EMAIL GENERATION ====================
  
  app.post("/api/admin/email/generate", requireAdminAuth, async (req, res) => {
    try {
      const { purpose, tone, keyPoints, templateType } = req.body;

      const apiKey = process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ message: "Anthropic API key not configured" });
      }

      const anthropic = new Anthropic({ apiKey });

      const prompt = `You are an email copywriter for HODLearn, a Bitcoin education app that's the "Duolingo of Bitcoin." 

Generate a professional email with the following requirements:
- Purpose: ${purpose}
- Tone: ${tone || "friendly and professional"}
- Template type: ${templateType || "general"}
${keyPoints ? `- Key points to include: ${keyPoints}` : ""}

The email should:
1. Have a compelling subject line
2. Use the HODLearn brand voice (educational, encouraging, Bitcoin-focused)
3. Include a clear call-to-action
4. Be mobile-friendly (short paragraphs)
5. Use the orange/dark color scheme in any styling

Return a JSON object with:
{
  "subject": "The email subject line",
  "html": "The full HTML email content with inline styles",
  "text": "Plain text version of the email"
}

Make the HTML email visually appealing with:
- Dark background (#18181b)
- White text (#fafafa)
- Orange accents (#f97316)
- Clean, modern styling`;

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      });

      const content = response.content[0];
      if (content.type !== "text") {
        throw new Error("Unexpected response type");
      }

      // Parse the JSON from the response
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Failed to parse AI response");
      }

      const emailContent = JSON.parse(jsonMatch[0]);
      res.json(emailContent);
    } catch (error: any) {
      console.error("AI email generation error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== EMAIL STATS ====================
  
  app.get("/api/admin/email/stats", requireAdminAuth, async (req, res) => {
    try {
      const status = getEmailServiceStatus();
      
      const [{ totalSent }] = await db.select({ 
        totalSent: count() 
      }).from(emailSendLog).where(eq(emailSendLog.status, "sent"));
      
      const [{ totalFailed }] = await db.select({ 
        totalFailed: count() 
      }).from(emailSendLog).where(eq(emailSendLog.status, "failed"));
      
      const [{ totalTemplates }] = await db.select({ 
        totalTemplates: count() 
      }).from(emailTemplates).where(isNull(emailTemplates.archivedAt));
      
      const [{ totalCampaigns }] = await db.select({ 
        totalCampaigns: count() 
      }).from(emailCampaigns);

      const automations = await db.select().from(emailAutomations);
      const enabledAutomations = automations.filter(a => a.isEnabled).length;

      res.json({
        serviceStatus: status,
        stats: {
          totalSent,
          totalFailed,
          totalTemplates,
          totalCampaigns,
          enabledAutomations,
          totalAutomations: automations.length,
        },
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
}
