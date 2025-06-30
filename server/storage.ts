import { 
  users, 
  userProgress, 
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
  type User, 
  type InsertUser, 
  type UserProgress,
  type InsertUserProgress,
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
  type InsertUserQuizAnswer
} from "@shared/schema";

import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Content Day methods
  getContentDay(dayIndex: number): Promise<ContentDay | undefined>;
  getAllContentDays(): Promise<ContentDay[]>;
  createContentDay(day: InsertContentDay): Promise<ContentDay>;
  updateContentDayApproval(dayIndex: number, isApproved: boolean): Promise<ContentDay | undefined>;

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

  async updateContentDayApproval(dayIndex: number, isApproved: boolean): Promise<ContentDay | undefined> {
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
      .where(eq(userQuizAnswers.userId, userId))
      .where(eq(userQuizAnswers.date, date));
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
}

export const storage = new DatabaseStorage();