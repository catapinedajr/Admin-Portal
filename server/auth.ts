import { randomUUID } from 'crypto';
import { db } from './db';
import { users, userSessions, passwordResetTokens, type User, type UserSession, type InsertUserSession, type LoginRequest, type RegisterRequest } from '@shared/schema';
import { eq, and, lt } from 'drizzle-orm';

export class AuthService {
  // Clean expired sessions periodically
  async cleanExpiredSessions(): Promise<void> {
    await db.delete(userSessions).where(lt(userSessions.expiresAt, new Date()));
  }

  // Register new user
  async register(userData: RegisterRequest): Promise<{ user: User; sessionId: string }> {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const [user] = await db
      .insert(users)
      .values({
        username: userData.username,
        passwordHash: hashedPassword,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      })
      .returning();

    // Create session
    const sessionId = await this.createSession(user.id);
    
    return { user, sessionId };
  }

  // Login user
  async login(credentials: LoginRequest): Promise<{ user: User; sessionId: string } | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, credentials.username));

    if (!user) return null;

    const bcrypt = await import('bcryptjs');
    const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
    if (!isPasswordValid) return null;

    // Create session
    const sessionId = await this.createSession(user.id);
    
    return { user, sessionId };
  }

  // Create session
  async createSession(userId: number): Promise<string> {
    const sessionId = randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.insert(userSessions).values({
      id: sessionId,
      userId,
      expiresAt,
    });

    return sessionId;
  }

  // Get session
  async getSession(sessionId: string): Promise<UserSession | null> {
    const [session] = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.id, sessionId));

    if (!session || new Date() > session.expiresAt) {
      // Clean up expired session
      if (session) {
        await db.delete(userSessions).where(eq(userSessions.id, sessionId));
      }
      return null;
    }

    // Update last used timestamp
    await db
      .update(userSessions)
      .set({ lastUsed: new Date() })
      .where(eq(userSessions.id, sessionId));

    return session;
  }

  // Get user from session
  async getUserFromSession(sessionId: string): Promise<User | null> {
    const session = await this.getSession(sessionId);
    if (!session) return null;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId));

    return user || null;
  }

  // Logout (delete session)
  async logout(sessionId: string): Promise<void> {
    await db.delete(userSessions).where(eq(userSessions.id, sessionId));
  }

  // Get user by ID
  async getUserById(userId: number): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    return user || null;
  }

  // Get user by username
  async getUserByUsername(username: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    return user || null;
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    return user || null;
  }

  // Create password reset token
  async createPasswordResetToken(userId: number): Promise<string> {
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.insert(passwordResetTokens).values({
      userId,
      token,
      expiresAt,
    });

    return token;
  }

  // Verify and use reset token
  async usePasswordResetToken(token: string, newPassword: string): Promise<boolean> {
    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(and(
        eq(passwordResetTokens.token, token),
        eq(passwordResetTokens.usedAt, null as any)
      ));

    if (!resetToken || new Date() > resetToken.expiresAt) {
      return false;
    }

    // Hash new password
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await db
      .update(users)
      .set({ passwordHash: hashedPassword })
      .where(eq(users.id, resetToken.userId));

    // Mark token as used
    await db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.id, resetToken.id));

    return true;
  }
}

export const authService = new AuthService();