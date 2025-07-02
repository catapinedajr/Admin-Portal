import { 
  users, 
  userProgress, 
  dailyActivities,
  simulatorCompletions,
  knowledgeAreas,
  convictionContent,
  treasuryCompanies,
  sovereignAdoption,
  bitcoinPrice,
  userQuizAnswers,
  contentDays,
  contentSetUpQuestions,
  contentLessons,
  contentQuizzes,
  contentMetadata,
  emailCollections,
  sessions,
  passwordResetTokens,
  quizQuestions,
  quizOptions,
  safetyScenarios,
  safetyOptions,
  safetyAttempts,
  type User, 
  type InsertUser, 
  type UserProgress,
  type InsertUserProgress,
  type DailyActivity,
  type InsertDailyActivity,
  type SimulatorCompletion,
  type InsertSimulatorCompletion,
  type ContentDay,
  type InsertContentDay,
  type ContentSetUpQuestion,
  type InsertContentSetUpQuestion,
  type ContentLesson,
  type InsertContentLesson,
  type ContentQuiz,
  type InsertContentQuiz,
  type ContentMetadata,
  type InsertContentMetadata,
  type DailyContentSetUpQuestion,
  type DailyContentComplete,
  type KnowledgeArea,
  type InsertKnowledgeArea,
  type ConvictionContent,
  type InsertConvictionContent,
  type TreasuryCompany,
  type InsertTreasuryCompany,
  type SovereignAdoption,
  type InsertSovereignAdoption,
  type BitcoinPrice,
  type InsertBitcoinPrice,
  type UserQuizAnswer,
  type InsertUserQuizAnswer,
  type EmailCollection,
  type InsertEmailCollection,
  type Session,
  type InsertSession,
  type PasswordResetToken,
  type InsertPasswordResetToken,
  type RegisterRequest,
  type LoginRequest,
  type QuizQuestion,
  type InsertQuizQuestion,
  type QuizOption,
  type InsertQuizOption,
  type SafetyScenario,
  type InsertSafetyScenario,
  type SafetyOption,
  type InsertSafetyOption,
  type SafetyAttempt,
  type InsertSafetyAttempt
} from "@shared/schema";

import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Authentication methods
  registerUser(userData: RegisterRequest): Promise<User>;
  loginUser(credentials: LoginRequest): Promise<User | null>;
  createSession(sessionData: InsertSession): Promise<Session>;
  getSession(sessionId: string): Promise<Session | undefined>;
  deleteSession(sessionId: string): Promise<void>;
  cleanupExpiredSessions(): Promise<void>;

  // Password reset methods
  createPasswordResetToken(tokenData: InsertPasswordResetToken): Promise<PasswordResetToken>;
  getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined>;
  markPasswordResetTokenUsed(token: string): Promise<void>;
  cleanupExpiredResetTokens(): Promise<void>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUserPassword(userId: number, hashedPassword: string): Promise<void>;

  // Content Day methods
  getContentDay(dayIndex: number): Promise<ContentDay | undefined>;
  getAllContentDays(): Promise<ContentDay[]>;
  createContentDay(day: InsertContentDay): Promise<ContentDay>;
  updateContentDayApproval(dayIndex: number, isApproved: boolean | null): Promise<ContentDay | undefined>;

  // Content Set Up Questions methods
  getContentSetUpQuestions(dayIndex: number): Promise<DailyContentSetUpQuestion[]>;
  getAllContentSetUpQuestions(): Promise<ContentSetUpQuestion[]>;
  createContentSetUpQuestion(question: InsertContentSetUpQuestion): Promise<ContentSetUpQuestion>;

  // Content Lessons methods
  getContentLesson(dayIndex: number): Promise<ContentLesson | undefined>;
  getAllContentLessons(): Promise<ContentLesson[]>;
  createContentLesson(lesson: InsertContentLesson): Promise<ContentLesson>;

  // Content Quiz methods
  getContentQuizzes(dayIndex: number): Promise<ContentQuiz[]>;
  getAllContentQuizzes(): Promise<ContentQuiz[]>;
  createContentQuiz(quiz: InsertContentQuiz): Promise<ContentQuiz>;

  // User progress methods
  getUserProgress(userId: number, date: string): Promise<UserProgress | undefined>;
  getUserProgressByDay(userId: number, dayIndex: number): Promise<UserProgress | undefined>;
  getUserProgressForWeek(userId: number, startDate: string): Promise<UserProgress[]>;
  createOrUpdateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  
  // Day completion and access control methods
  isDayCompleted(userId: number, dayIndex: number): Promise<boolean>;
  markDayCompleted(userId: number, dayIndex: number): Promise<void>;
  getNextAvailableDay(userId: number): Promise<number>;
  canAccessDay(userId: number, dayIndex: number): Promise<boolean>;
  getCompletedDays(userId: number): Promise<number[]>;

  // Daily Activity methods for consistency tracking
  getDailyActivity(userId: number, date: string): Promise<DailyActivity | undefined>;
  createOrUpdateDailyActivity(activity: InsertDailyActivity): Promise<DailyActivity>;
  getUserActivitiesForWeeks(userId: number, weeks: number): Promise<DailyActivity[]>;
  markLessonCompleted(userId: number, date: string): Promise<void>;
  markQuizCompleted(userId: number, date: string): Promise<void>;
  markPracticeCompleted(userId: number, date: string): Promise<void>;

  // Knowledge areas methods
  getKnowledgeAreas(): Promise<KnowledgeArea[]>;
  updateKnowledgeAreaProgress(areaId: number, completedLessons: number): Promise<void>;

  // Conviction content methods
  getConvictionContent(dayIndex: number): Promise<ConvictionContent[]>;
  getAllConvictionContent(): Promise<ConvictionContent[]>;
  createConvictionContent(content: InsertConvictionContent): Promise<ConvictionContent>;

  // Treasury companies methods
  getTreasuryCompanies(): Promise<TreasuryCompany[]>;
  createTreasuryCompany(company: InsertTreasuryCompany): Promise<TreasuryCompany>;

  // Sovereign adoption methods
  getSovereignAdoptions(): Promise<SovereignAdoption[]>;
  createSovereignAdoption(adoption: InsertSovereignAdoption): Promise<SovereignAdoption>;

  // Bitcoin price methods
  getLatestBitcoinPrice(): Promise<BitcoinPrice | undefined>;
  createBitcoinPrice(price: InsertBitcoinPrice): Promise<BitcoinPrice>;

  // Quiz answers methods
  getUserQuizAnswers(userId: number, date: string): Promise<UserQuizAnswer[]>;
  saveQuizAnswer(answer: InsertUserQuizAnswer): Promise<UserQuizAnswer>;
  getUserQuizStatistics(userId: number): Promise<{ totalQuizzesTaken: number; totalCorrectAnswers: number; averageScore: number }>;

  // Simulator completion methods
  getUserSimulatorCompletions(userId: number, month: string): Promise<SimulatorCompletion[]>;
  markSimulatorCompleted(userId: number, simulatorType: string, month: string): Promise<SimulatorCompletion>;

  // Email collection methods
  saveEmailCollection(emailData: InsertEmailCollection): Promise<EmailCollection>;

  // New database-driven quiz methods - eliminates answer validation bugs
  getQuizQuestions(dayId: number): Promise<(QuizQuestion & { options: QuizOption[] })[]>;
  getQuizQuestion(questionId: number): Promise<(QuizQuestion & { options: QuizOption[] }) | undefined>;
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;
  createQuizOption(option: InsertQuizOption): Promise<QuizOption>;

  // Safety simulator methods - replaces hardcoded scenarios
  getSafetyScenarios(): Promise<(SafetyScenario & { options: SafetyOption[] })[]>;
  getSafetyScenario(scenarioId: number): Promise<(SafetyScenario & { options: SafetyOption[] }) | undefined>;
  createSafetyScenario(scenario: InsertSafetyScenario): Promise<SafetyScenario>;
  createSafetyOption(option: InsertSafetyOption): Promise<SafetyOption>;
  recordSafetyAttempt(attempt: InsertSafetyAttempt): Promise<SafetyAttempt>;
  getUserSafetyAttempts(userId: number): Promise<SafetyAttempt[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Authentication methods
  async registerUser(userData: RegisterRequest): Promise<User> {
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
        currentStreak: 0,
        longestStreak: 0,
        completedLessons: 0,
        lastActivityDate: null
      })
      .returning();
    return user;
  }

  async loginUser(credentials: LoginRequest): Promise<User | null> {
    const user = await this.getUserByUsername(credentials.username);
    if (!user) return null;

    const bcrypt = await import('bcryptjs');
    const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
    if (!isPasswordValid) return null;

    return user;
  }

  async createSession(sessionData: InsertSession): Promise<Session> {
    const [session] = await db
      .insert(sessions)
      .values(sessionData)
      .returning();
    return session;
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId));
    return session || undefined;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }

  async cleanupExpiredSessions(): Promise<void> {
    await db.delete(sessions).where(sql`${sessions.expiresAt} < NOW()`);
  }

  // Password reset methods
  async createPasswordResetToken(tokenData: InsertPasswordResetToken): Promise<PasswordResetToken> {
    const [token] = await db
      .insert(passwordResetTokens)
      .values(tokenData)
      .returning();
    return token;
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));
    return resetToken || undefined;
  }

  async markPasswordResetTokenUsed(token: string): Promise<void> {
    await db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.token, token));
  }

  async cleanupExpiredResetTokens(): Promise<void> {
    await db.delete(passwordResetTokens).where(sql`${passwordResetTokens.expiresAt} < NOW()`);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async updateUserPassword(userId: number, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ passwordHash: hashedPassword })
      .where(eq(users.id, userId));
  }

  // Content Day methods
  async getContentDay(dayIndex: number): Promise<ContentDay | undefined> {
    const [day] = await db.select().from(contentDays).where(eq(contentDays.dayIndex, dayIndex));
    return day || undefined;
  }

  async getAllContentDays(): Promise<ContentDay[]> {
    return await db.select().from(contentDays).orderBy(contentDays.dayIndex);
  }

  async createContentDay(day: InsertContentDay): Promise<ContentDay> {
    const [result] = await db.insert(contentDays).values(day).returning();
    return result;
  }

  async updateContentDayApproval(dayIndex: number, isApproved: boolean | null): Promise<ContentDay | undefined> {
    const [result] = await db.update(contentDays)
      .set({ isApproved, updatedAt: new Date() })
      .where(eq(contentDays.dayIndex, dayIndex))
      .returning();
    return result || undefined;
  }

  // Content Set Up Questions methods
  async getContentSetUpQuestions(dayIndex: number): Promise<DailyContentSetUpQuestion[]> {
    const day = await this.getContentDay(dayIndex);
    if (!day) return [];

    return await db.select().from(contentSetUpQuestions).where(eq(contentSetUpQuestions.dayId, day.id)).orderBy(contentSetUpQuestions.orderIndex);
  }

  async getAllContentSetUpQuestions(): Promise<ContentSetUpQuestion[]> {
    return await db.select().from(contentSetUpQuestions).orderBy(contentSetUpQuestions.dayId, contentSetUpQuestions.orderIndex);
  }

  async createContentSetUpQuestion(question: InsertContentSetUpQuestion): Promise<ContentSetUpQuestion> {
    const [result] = await db.insert(contentSetUpQuestions).values(question).returning();
    return result;
  }

  // Content Lessons methods
  async getContentLesson(dayIndex: number): Promise<ContentLesson | undefined> {
    const day = await this.getContentDay(dayIndex);
    if (!day) return undefined;

    const [lesson] = await db.select().from(contentLessons).where(eq(contentLessons.dayId, day.id));
    return lesson || undefined;
  }

  async getAllContentLessons(): Promise<ContentLesson[]> {
    return await db.select().from(contentLessons).orderBy(contentLessons.dayId);
  }

  async createContentLesson(lesson: InsertContentLesson): Promise<ContentLesson> {
    const [result] = await db.insert(contentLessons).values([lesson]).returning();
    return result;
  }

  // Content Quiz methods
  async getContentQuizzes(dayIndex: number): Promise<ContentQuiz[]> {
    const day = await this.getContentDay(dayIndex);
    if (!day) return [];

    return await db.select().from(contentQuizzes).where(eq(contentQuizzes.dayId, day.id)).orderBy(contentQuizzes.orderIndex);
  }

  async getAllContentQuizzes(): Promise<ContentQuiz[]> {
    return await db.select().from(contentQuizzes).orderBy(contentQuizzes.dayId, contentQuizzes.orderIndex);
  }

  async createContentQuiz(quiz: InsertContentQuiz): Promise<ContentQuiz> {
    const [result] = await db.insert(contentQuizzes).values([quiz]).returning();
    return result;
  }

  // User progress methods
  async getUserProgress(userId: number, date: string): Promise<UserProgress | undefined> {
    const [progress] = await db.select().from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.date, date)));
    return progress || undefined;
  }

  async getUserProgressByDay(userId: number, dayIndex: number): Promise<UserProgress | undefined> {
    const [progress] = await db.select().from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.dayIndex, dayIndex)));
    return progress || undefined;
  }

  async getUserProgressForWeek(userId: number, startDate: string): Promise<UserProgress[]> {
    // This would need date range logic for a week
    return [];
  }

  async createOrUpdateUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const existing = await this.getUserProgress(progress.userId, progress.date);
    
    if (existing) {
      // Update existing
      const [updated] = await db.update(userProgress)
        .set(progress)
        .where(eq(userProgress.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new
      const [created] = await db.insert(userProgress).values(progress).returning();
      return created;
    }
  }

  // Day completion methods
  async isDayCompleted(userId: number, dayIndex: number): Promise<boolean> {
    const progress = await this.getUserProgressByDay(userId, dayIndex);
    return progress?.dayCompleted || false;
  }

  async markDayCompleted(userId: number, dayIndex: number): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    await this.createOrUpdateUserProgress({
      userId,
      date: today,
      dayIndex,
      factsViewed: 3,
      lessonCompleted: true,
      quizCompleted: true,
      dayCompleted: true,
      progressPercentage: 100
    });
  }

  async getNextAvailableDay(userId: number): Promise<number> {
    // For now, return day 1 - could be made more sophisticated later
    return 1;
  }

  async canAccessDay(userId: number, dayIndex: number): Promise<boolean> {
    // Must be positive day index
    if (dayIndex < 1) return false;
    
    // Check if content exists for this day by checking content_days table
    const hasContent = await db.select({ id: contentDays.id })
      .from(contentDays)
      .where(eq(contentDays.dayIndex, dayIndex))
      .limit(1);
    
    return hasContent.length > 0;
  }

  async getCompletedDays(userId: number): Promise<number[]> {
    const completed = await db.select({ dayIndex: userProgress.dayIndex })
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .where(eq(userProgress.dayCompleted, true));
    
    return completed.map(p => p.dayIndex);
  }

  // Knowledge areas methods
  async getKnowledgeAreas(): Promise<KnowledgeArea[]> {
    return await db.select().from(knowledgeAreas);
  }

  async updateKnowledgeAreaProgress(areaId: number, completedLessons: number): Promise<void> {
    await db.update(knowledgeAreas)
      .set({ completedLessons })
      .where(eq(knowledgeAreas.id, areaId));
  }

  // Conviction content methods
  async getConvictionContent(dayIndex: number): Promise<ConvictionContent[]> {
    return await db.select().from(convictionContent).where(eq(convictionContent.dayIndex, dayIndex));
  }

  async getAllConvictionContent(): Promise<ConvictionContent[]> {
    return await db.select().from(convictionContent);
  }

  async createConvictionContent(content: InsertConvictionContent): Promise<ConvictionContent> {
    const [result] = await db.insert(convictionContent).values(content).returning();
    return result;
  }

  // Treasury companies methods
  async getTreasuryCompanies(): Promise<TreasuryCompany[]> {
    return await db.select().from(treasuryCompanies);
  }

  async createTreasuryCompany(company: InsertTreasuryCompany): Promise<TreasuryCompany> {
    const [result] = await db.insert(treasuryCompanies).values(company).returning();
    return result;
  }

  // Sovereign adoption methods
  async getSovereignAdoptions(): Promise<SovereignAdoption[]> {
    return await db.select().from(sovereignAdoption);
  }

  async createSovereignAdoption(adoption: InsertSovereignAdoption): Promise<SovereignAdoption> {
    const [result] = await db.insert(sovereignAdoption).values(adoption).returning();
    return result;
  }

  // Bitcoin price methods
  async getLatestBitcoinPrice(): Promise<BitcoinPrice | undefined> {
    const [price] = await db.select().from(bitcoinPrice).orderBy(bitcoinPrice.timestamp).limit(1);
    return price || undefined;
  }

  async createBitcoinPrice(price: InsertBitcoinPrice): Promise<BitcoinPrice> {
    const [result] = await db.insert(bitcoinPrice).values(price).returning();
    return result;
  }

  // Quiz answers methods
  async getUserQuizAnswers(userId: number, date: string): Promise<UserQuizAnswer[]> {
    return await db.select().from(userQuizAnswers)
      .where(and(
        eq(userQuizAnswers.userId, userId),
        eq(userQuizAnswers.date, date)
      ));
  }

  async saveQuizAnswer(answer: InsertUserQuizAnswer): Promise<UserQuizAnswer> {
    const [result] = await db.insert(userQuizAnswers).values(answer).returning();
    return result;
  }

  async getAllQuizQuestions(): Promise<ContentQuiz[]> {
    return await db.select().from(contentQuizzes);
  }

  async submitQuizAnswer(userId: number, questionId: number, selectedAnswer: string, isCorrect: boolean): Promise<UserQuizAnswer> {
    // Use PostgreSQL UPSERT to prevent duplicates
    const date = new Date().toISOString().split('T')[0];
    const { pool } = await import("./db");
    
    // First, create unique constraint if it doesn't exist
    try {
      await pool.query(`
        ALTER TABLE user_quiz_answers 
        ADD CONSTRAINT unique_user_question_date 
        UNIQUE (user_id, question_id, date)
      `);
    } catch (e) {
      // Constraint already exists, ignore error
    }
    
    // Use UPSERT to either insert new or update existing
    const upsertQuery = `
      INSERT INTO user_quiz_answers (user_id, question_id, selected_answer, is_correct, date)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id, question_id, date)
      DO UPDATE SET 
        selected_answer = EXCLUDED.selected_answer,
        is_correct = EXCLUDED.is_correct,
        answered_at = NOW()
      RETURNING id, user_id as "userId", question_id as "questionId", selected_answer as "selectedAnswer", 
                is_correct as "isCorrect", answered_at as "answeredAt", date
    `;
    
    const result = await pool.query(upsertQuery, [userId, questionId, selectedAnswer, isCorrect, date]);
    return result.rows[0] as UserQuizAnswer;
  }

  async getUserQuizScore(userId: number, dayIndex: number): Promise<{ correct: number; total: number }> {
    // Get all questions for the specific day
    const questions = await this.getContentQuizzes(dayIndex);
    
    // Get user answers for today and filter to this day's questions only
    const today = new Date().toISOString().split('T')[0];
    
    // Filter answers to only those for this day's questions
    const allAnswers = await db.select()
      .from(userQuizAnswers)
      .where(and(
        eq(userQuizAnswers.userId, userId),
        eq(userQuizAnswers.date, today)
      ));
    
    // Filter to only answers for this day's questions
    const questionIds = questions.map(q => q.id);
    const dayAnswers = allAnswers.filter(a => questionIds.includes(a.questionId));
    
    const correct = dayAnswers.filter(a => a.isCorrect).length;
    return { correct, total: questions.length };
  }

  async getUserQuizStatistics(userId: number): Promise<{ totalQuizzesTaken: number; totalCorrectAnswers: number; averageScore: number }> {
    // Get all quiz answers for the user
    const allAnswers = await db.select()
      .from(userQuizAnswers)
      .where(eq(userQuizAnswers.userId, userId));
    
    if (allAnswers.length === 0) {
      return {
        totalQuizzesTaken: 0,
        totalCorrectAnswers: 0,
        averageScore: 0
      };
    }
    
    const totalQuizzesTaken = allAnswers.length;
    const totalCorrectAnswers = allAnswers.filter(a => a.isCorrect).length;
    const averageScore = (totalCorrectAnswers / totalQuizzesTaken) * 100;
    
    return {
      totalQuizzesTaken,
      totalCorrectAnswers,
      averageScore: Math.round(averageScore)
    };
  }

  async saveEmailCollection(emailData: InsertEmailCollection): Promise<EmailCollection> {
    const [result] = await db
      .insert(emailCollections)
      .values(emailData)
      .returning();
    return result;
  }

  // Daily Activity methods for consistency tracking
  async getDailyActivity(userId: number, date: string): Promise<DailyActivity | undefined> {
    const [activity] = await db.select().from(dailyActivities)
      .where(and(eq(dailyActivities.userId, userId), eq(dailyActivities.date, date)));
    return activity || undefined;
  }

  async createOrUpdateDailyActivity(activity: InsertDailyActivity): Promise<DailyActivity> {
    const existing = await this.getDailyActivity(activity.userId, activity.date);
    
    if (existing) {
      // Update existing
      const [updated] = await db.update(dailyActivities)
        .set({
          ...activity,
          updatedAt: new Date()
        })
        .where(and(
          eq(dailyActivities.userId, activity.userId),
          eq(dailyActivities.date, activity.date)
        ))
        .returning();
      return updated;
    } else {
      // Create new
      const [created] = await db.insert(dailyActivities).values(activity).returning();
      return created;
    }
  }

  async getUserActivitiesForWeeks(userId: number, weeks: number): Promise<DailyActivity[]> {
    const weeksAgo = new Date();
    weeksAgo.setDate(weeksAgo.getDate() - (weeks * 7));
    const startDate = weeksAgo.toISOString().split('T')[0];

    return await db.select().from(dailyActivities)
      .where(and(
        eq(dailyActivities.userId, userId),
        sql`${dailyActivities.date} >= ${startDate}`
      ))
      .orderBy(dailyActivities.date);
  }

  async markLessonCompleted(userId: number, date: string): Promise<void> {
    await this.createOrUpdateDailyActivity({
      userId,
      date,
      lessonCompleted: true,
      quizCompleted: false,
      practiceCompleted: false
    });
  }

  async markQuizCompleted(userId: number, date: string): Promise<void> {
    const existing = await this.getDailyActivity(userId, date);
    await this.createOrUpdateDailyActivity({
      userId,
      date,
      lessonCompleted: existing?.lessonCompleted || false,
      quizCompleted: true,
      practiceCompleted: existing?.practiceCompleted || false
    });
  }

  async markPracticeCompleted(userId: number, date: string): Promise<void> {
    const existing = await this.getDailyActivity(userId, date);
    await this.createOrUpdateDailyActivity({
      userId,
      date,
      lessonCompleted: existing?.lessonCompleted || false,
      quizCompleted: existing?.quizCompleted || false,
      practiceCompleted: true
    });
  }

  // Simulator completion methods
  async getUserSimulatorCompletions(userId: number, month: string): Promise<SimulatorCompletion[]> {
    return await db
      .select()
      .from(simulatorCompletions)
      .where(
        and(
          eq(simulatorCompletions.userId, userId),
          eq(simulatorCompletions.completedMonth, month)
        )
      );
  }

  async markSimulatorCompleted(userId: number, simulatorType: string, month: string): Promise<SimulatorCompletion> {
    const [completion] = await db
      .insert(simulatorCompletions)
      .values({
        userId,
        simulatorType,
        completedMonth: month,
      })
      .onConflictDoNothing()
      .returning();
    
    if (!completion) {
      // Return existing completion if conflict occurred
      const [existing] = await db
        .select()
        .from(simulatorCompletions)
        .where(
          and(
            eq(simulatorCompletions.userId, userId),
            eq(simulatorCompletions.simulatorType, simulatorType),
            eq(simulatorCompletions.completedMonth, month)
          )
        );
      return existing;
    }
    
    return completion;
  }

  // New database-driven quiz methods - eliminates answer validation bugs
  async getQuizQuestions(dayId: number): Promise<(QuizQuestion & { options: QuizOption[] })[]> {
    const questions = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.dayId, dayId))
      .orderBy(quizQuestions.orderIndex);

    const questionsWithOptions = await Promise.all(
      questions.map(async (question) => {
        const options = await db
          .select()
          .from(quizOptions)
          .where(eq(quizOptions.questionId, question.id))
          .orderBy(quizOptions.orderIndex);
        
        return { ...question, options };
      })
    );

    return questionsWithOptions;
  }

  async getQuizQuestion(questionId: number): Promise<(QuizQuestion & { options: QuizOption[] }) | undefined> {
    const [question] = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.id, questionId));

    if (!question) return undefined;

    const options = await db
      .select()
      .from(quizOptions)
      .where(eq(quizOptions.questionId, questionId))
      .orderBy(quizOptions.orderIndex);

    return { ...question, options };
  }

  async createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion> {
    const [created] = await db
      .insert(quizQuestions)
      .values(question)
      .returning();
    return created;
  }

  async createQuizOption(option: InsertQuizOption): Promise<QuizOption> {
    const [created] = await db
      .insert(quizOptions)
      .values(option)
      .returning();
    return created;
  }

  // Safety simulator methods - replaces hardcoded scenarios
  async getSafetyScenarios(): Promise<(SafetyScenario & { options: SafetyOption[] })[]> {
    const scenarios = await db
      .select()
      .from(safetyScenarios)
      .orderBy(safetyScenarios.stageNumber);

    const scenariosWithOptions = await Promise.all(
      scenarios.map(async (scenario) => {
        const options = await db
          .select()
          .from(safetyOptions)
          .where(eq(safetyOptions.scenarioId, scenario.id))
          .orderBy(safetyOptions.orderIndex);
        
        return { ...scenario, options };
      })
    );

    return scenariosWithOptions;
  }

  async getSafetyScenario(id: number): Promise<SafetyScenario | undefined> {
    const [scenario] = await db
      .select()
      .from(safetyScenarios)
      .where(eq(safetyScenarios.id, id));
    return scenario;
  }

  async getSafetyOption(id: number): Promise<SafetyOption | undefined> {
    const [option] = await db
      .select()
      .from(safetyOptions)
      .where(eq(safetyOptions.id, id));
    return option;
  }

  async getSafetyScenarioWithOptions(scenarioId: number): Promise<(SafetyScenario & { options: SafetyOption[] }) | undefined> {
    const [scenario] = await db
      .select()
      .from(safetyScenarios)
      .where(eq(safetyScenarios.id, scenarioId));

    if (!scenario) return undefined;

    const options = await db
      .select()
      .from(safetyOptions)
      .where(eq(safetyOptions.scenarioId, scenarioId))
      .orderBy(safetyOptions.orderIndex);

    return { ...scenario, options };
  }

  async createSafetyScenario(scenario: InsertSafetyScenario): Promise<SafetyScenario> {
    const [created] = await db
      .insert(safetyScenarios)
      .values(scenario)
      .returning();
    return created;
  }

  async createSafetyOption(option: InsertSafetyOption): Promise<SafetyOption> {
    const [created] = await db
      .insert(safetyOptions)
      .values(option)
      .returning();
    return created;
  }

  async recordSafetyAttempt(attempt: InsertSafetyAttempt): Promise<SafetyAttempt> {
    const [created] = await db
      .insert(safetyAttempts)
      .values(attempt)
      .returning();
    return created;
  }

  async getUserSafetyAttempts(userId: number): Promise<SafetyAttempt[]> {
    return await db
      .select()
      .from(safetyAttempts)
      .where(eq(safetyAttempts.userId, userId))
      .orderBy(safetyAttempts.attemptedAt);
  }
}

export const storage = new DatabaseStorage();