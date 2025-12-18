import { randomUUID } from 'crypto';
import { db } from './db';
import { adminUsers, adminSessions, type AdminUser, type AdminSession, type AdminLoginRequest } from '@shared/schema';
import { eq, lt } from 'drizzle-orm';

export class AdminAuthService {
  async cleanExpiredSessions(): Promise<void> {
    await db.delete(adminSessions).where(lt(adminSessions.expiresAt, new Date()));
  }

  async login(credentials: AdminLoginRequest): Promise<{ admin: AdminUser; sessionId: string } | null> {
    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, credentials.email));

    if (!admin || !admin.isActive) return null;

    const bcrypt = await import('bcryptjs');
    const isPasswordValid = await bcrypt.compare(credentials.password, admin.passwordHash);
    if (!isPasswordValid) return null;

    await db.update(adminUsers)
      .set({ lastLoginAt: new Date() })
      .where(eq(adminUsers.id, admin.id));

    const sessionId = await this.createSession(admin.id);
    
    return { admin, sessionId };
  }

  async createSession(adminId: number): Promise<string> {
    const sessionId = randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours for admin

    await db.insert(adminSessions).values({
      id: sessionId,
      adminId,
      expiresAt,
    });

    return sessionId;
  }

  async getSession(sessionId: string): Promise<AdminSession | null> {
    const [session] = await db
      .select()
      .from(adminSessions)
      .where(eq(adminSessions.id, sessionId));

    if (!session || new Date() > session.expiresAt) {
      if (session) {
        await db.delete(adminSessions).where(eq(adminSessions.id, sessionId));
      }
      return null;
    }

    await db.update(adminSessions)
      .set({ lastUsed: new Date() })
      .where(eq(adminSessions.id, sessionId));

    return session;
  }

  async getAdminFromSession(sessionId: string): Promise<AdminUser | null> {
    const session = await this.getSession(sessionId);
    if (!session) return null;

    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, session.adminId));

    if (!admin || !admin.isActive) return null;

    return admin;
  }

  async logout(sessionId: string): Promise<void> {
    await db.delete(adminSessions).where(eq(adminSessions.id, sessionId));
  }

  async createAdmin(email: string, password: string, firstName: string, lastName: string, role: string = 'admin'): Promise<AdminUser> {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const [admin] = await db
      .insert(adminUsers)
      .values({
        email,
        passwordHash: hashedPassword,
        firstName,
        lastName,
        role,
        isActive: true,
      })
      .returning();

    return admin;
  }
}

export const adminAuthService = new AdminAuthService();
