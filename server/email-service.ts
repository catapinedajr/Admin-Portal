import { db } from "./db";
import { emailSendLog, emailAutomations, users, systemSettings } from "@shared/schema";
import { eq, sql } from "drizzle-orm";
import { randomBytes, createCipheriv, createDecipheriv, scryptSync } from "crypto";

const APP_NAME = "HODLearn";
const ALGORITHM = 'aes-256-gcm';
const ENCRYPTION_KEY = process.env.SETTINGS_ENCRYPTION_KEY || 'hodlearn-default-key-change-in-prod-32';

// Decrypt setting value from database
function decryptSettingValue(encryptedText: string): string {
  const parts = encryptedText.split(':');
  if (parts.length === 4) {
    // New format: salt:iv:authTag:encrypted
    const [saltHex, ivHex, authTagHex, encrypted] = parts;
    const salt = Buffer.from(saltHex, 'hex');
    const key = scryptSync(ENCRYPTION_KEY, salt, 32);
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
  // Legacy format: iv:authTag:encrypted
  const [ivHex, authTagHex, encrypted] = parts;
  const key = scryptSync(ENCRYPTION_KEY, 'salt', 32);
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Get email configuration - checks database first, then environment variables
async function getEmailConfig(): Promise<{ apiKey: string | null; fromEmail: string }> {
  try {
    // Check database for stored API key
    const [resendSetting] = await db.select()
      .from(systemSettings)
      .where(eq(systemSettings.key, "RESEND_API_KEY"))
      .limit(1);
    
    const [fromEmailSetting] = await db.select()
      .from(systemSettings)
      .where(eq(systemSettings.key, "FROM_EMAIL"))
      .limit(1);

    let apiKey = null;
    if (resendSetting?.encryptedValue) {
      try {
        apiKey = decryptSettingValue(resendSetting.encryptedValue);
      } catch (e) {
        console.error("[Email Service] Failed to decrypt stored API key, falling back to env var");
      }
    }

    // Fall back to environment variable
    if (!apiKey) {
      apiKey = process.env.RESEND_API_KEY || null;
    }

    // Get from email - check DB first, then env, then default
    let fromEmail = "noreply@hodlearn.com";
    if (fromEmailSetting?.encryptedValue) {
      try {
        fromEmail = decryptSettingValue(fromEmailSetting.encryptedValue);
      } catch (e) {
        // Use env or default
      }
    }
    if (fromEmail === "noreply@hodlearn.com" && process.env.FROM_EMAIL) {
      fromEmail = process.env.FROM_EMAIL;
    }

    return { apiKey, fromEmail };
  } catch (error) {
    // If database query fails, fall back to env vars
    return {
      apiKey: process.env.RESEND_API_KEY || null,
      fromEmail: process.env.FROM_EMAIL || "noreply@hodlearn.com",
    };
  }
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  userId?: number;
  campaignId?: number;
  automationId?: number;
}

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const { to, subject, html, text, userId, campaignId, automationId } = options;

  // Log the email attempt
  const [logEntry] = await db.insert(emailSendLog).values({
    email: to,
    subject,
    userId,
    campaignId,
    automationId,
    status: "pending",
  }).returning();

  // Get email configuration (checks database first, then env vars)
  const { apiKey, fromEmail } = await getEmailConfig();

  // Check if Resend is configured
  if (!apiKey) {
    console.log(`[Email Service] RESEND_API_KEY not configured. Email to ${to} logged but not sent.`);
    await db.update(emailSendLog)
      .set({ 
        status: "failed", 
        errorMessage: "RESEND_API_KEY not configured" 
      })
      .where(eq(emailSendLog.id, logEntry.id));
    
    return {
      success: false,
      error: "Email service not configured. Add RESEND_API_KEY in Settings to enable sending.",
    };
  }

  try {
    // Send via Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${APP_NAME} <${fromEmail}>`,
        to: [to],
        subject,
        html,
        text,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to send email");
    }

    // Update log with success
    await db.update(emailSendLog)
      .set({ 
        status: "sent", 
        resendMessageId: result.id,
        sentAt: new Date(),
      })
      .where(eq(emailSendLog.id, logEntry.id));

    // Update automation stats if applicable
    if (automationId) {
      await db.update(emailAutomations)
        .set({ 
          sentCount: sql`${emailAutomations.sentCount} + 1`,
          lastSentAt: new Date(),
        })
        .where(eq(emailAutomations.id, automationId));
    }

    return {
      success: true,
      messageId: result.id,
    };

  } catch (error: any) {
    console.error(`[Email Service] Failed to send email to ${to}:`, error.message);
    
    await db.update(emailSendLog)
      .set({ 
        status: "failed", 
        errorMessage: error.message,
      })
      .where(eq(emailSendLog.id, logEntry.id));

    return {
      success: false,
      error: error.message,
    };
  }
}

// Send welcome email to new user
export async function sendWelcomeEmail(userId: number, email: string, firstName: string): Promise<SendEmailResult> {
  // Check if welcome automation is enabled
  const [automation] = await db.select()
    .from(emailAutomations)
    .where(eq(emailAutomations.triggerType, "welcome"))
    .limit(1);

  if (!automation?.isEnabled) {
    console.log(`[Email Service] Welcome automation is disabled. Skipping email for ${email}`);
    return { success: false, error: "Welcome automation is disabled" };
  }

  // Get the template content (would be from template if linked)
  const subject = "Welcome to HODLearn! 🟠";
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #18181b; color: #fafafa; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="color: #f97316; margin: 0;">🟠 HODLearn</h1>
    </div>
    
    <h2 style="color: #fafafa; margin-bottom: 16px;">Welcome, ${firstName}!</h2>
    
    <p style="color: #a1a1aa; line-height: 1.6;">
      You've taken the first step toward Bitcoin mastery. We're excited to have you join thousands of learners building their conviction through daily education.
    </p>
    
    <p style="color: #a1a1aa; line-height: 1.6;">
      <strong style="color: #fafafa;">Here's what you can expect:</strong>
    </p>
    
    <ul style="color: #a1a1aa; line-height: 1.8;">
      <li>📚 Daily lessons designed to fit your schedule</li>
      <li>🎯 Interactive quizzes to test your knowledge</li>
      <li>💰 Earn HODLearn Points as you progress</li>
      <li>🔥 Build streaks to stay motivated</li>
    </ul>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${process.env.APP_URL || 'https://hodlearn.com'}" 
         style="background-color: #f97316; color: #18181b; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
        Start Learning Today
      </a>
    </div>
    
    <p style="color: #71717a; font-size: 14px; margin-top: 32px;">
      Questions? Just reply to this email - we're here to help.
    </p>
    
    <hr style="border: none; border-top: 1px solid #27272a; margin: 32px 0;">
    
    <p style="color: #52525b; font-size: 12px; text-align: center;">
      © ${new Date().getFullYear()} HODLearn. All rights reserved.
    </p>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
    userId,
    automationId: automation.id,
  });
}

// Check if email service is configured
export async function isEmailServiceConfigured(): Promise<boolean> {
  const { apiKey } = await getEmailConfig();
  return !!apiKey;
}

// Get email service status
export async function getEmailServiceStatus() {
  const { apiKey, fromEmail } = await getEmailConfig();
  return {
    configured: !!apiKey,
    fromEmail,
    provider: "Resend",
    source: apiKey ? (process.env.RESEND_API_KEY ? "environment" : "database") : "not_configured",
  };
}
