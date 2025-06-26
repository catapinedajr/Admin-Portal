import { pgTable, text, serial, integer, boolean, timestamp, json, decimal, date, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  completedLessons: integer("completed_lessons").notNull().default(0),
  lastActivityDate: text("last_activity_date"), // YYYY-MM-DD format
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const dailyFacts = pgTable("daily_facts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull(),
  dayIndex: integer("day_index").notNull(), // 0-based index for cycling through facts
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary").notNull(),
  estimatedReadTime: integer("estimated_read_time").notNull(), // in minutes
  dayIndex: integer("day_index").notNull(),
  imageUrl: text("image_url"),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
  factsViewed: integer("facts_viewed").notNull().default(0),
  lessonCompleted: boolean("lesson_completed").notNull().default(false),
  progressPercentage: integer("progress_percentage").notNull().default(0),
});

export const knowledgeAreas = pgTable("knowledge_areas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  completedLessons: integer("completed_lessons").notNull().default(0),
  totalLessons: integer("total_lessons").notNull(),
});

export const convictionContent = pgTable("conviction_content", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'quote' or 'video'
  title: text("title").notNull(),
  content: text("content").notNull(), // quote text or video description
  author: text("author").notNull(), // quote author or speaker name
  source: text("source"), // publication/event name
  videoUrl: text("video_url"), // YouTube/video URL for video type
  thumbnailUrl: text("thumbnail_url"), // video thumbnail
  dayIndex: integer("day_index").notNull(),
  featured: boolean("featured").notNull().default(false), // for highlighting important content
});

export const treasuryCompanies = pgTable("treasury_companies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  ticker: varchar("ticker", { length: 10 }),
  industry: varchar("industry", { length: 100 }).notNull(),
  bitcoinHoldings: decimal("bitcoin_holdings", { precision: 15, scale: 8 }).notNull(),
  marketValue: decimal("market_value", { precision: 20, scale: 2 }),
  acquisitionDate: date("acquisition_date"),
  announcementDate: date("announcement_date").notNull(),
  website: varchar("website", { length: 500 }),
  description: text("description"),
  ceoName: varchar("ceo_name", { length: 255 }),
  country: varchar("country", { length: 100 }).notNull(),
  isPublic: boolean("is_public").default(true),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const sovereignAdoption = pgTable("sovereign_adoption", {
  id: serial("id").primaryKey(),
  entityName: varchar("entity_name", { length: 255 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }).notNull(), // "country", "state", "province", "city"
  adoptionType: varchar("adoption_type", { length: 100 }).notNull(), // "legal_tender", "treasury_reserve", "mining_friendly", "regulatory_clarity"
  bitcoinHoldings: decimal("bitcoin_holdings", { precision: 15, scale: 8 }),
  population: integer("population"),
  announcementDate: date("announcement_date").notNull(),
  implementationDate: date("implementation_date"),
  description: text("description").notNull(),
  keyOfficials: varchar("key_officials", { length: 500 }),
  gdp: decimal("gdp", { precision: 20, scale: 2 }),
  currency: varchar("currency", { length: 10 }),
  region: varchar("region", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(), // "active", "proposed", "suspended"
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const bitcoinPrice = pgTable("bitcoin_price", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  priceUsd: decimal("price_usd", { precision: 12, scale: 2 }).notNull(),
  marketCap: decimal("market_cap", { precision: 20, scale: 2 }),
  volume24h: decimal("volume_24h", { precision: 20, scale: 2 }),
  change24h: decimal("change_24h", { precision: 5, scale: 2 }),
  change7d: decimal("change_7d", { precision: 5, scale: 2 }),
  dominance: decimal("dominance", { precision: 5, scale: 2 }),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  dayIndex: integer("day_index").notNull(),
  question: text("question").notNull(),
  optionA: text("option_a").notNull(),
  optionB: text("option_b").notNull(),
  optionC: text("option_c").notNull(),
  optionD: text("option_d").notNull(),
  correctAnswer: text("correct_answer").notNull(), // 'A', 'B', 'C', or 'D'
  explanation: text("explanation").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(), // 'beginner', 'intermediate', 'advanced'
});

export const userQuizAnswers = pgTable("user_quiz_answers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  questionId: integer("question_id").notNull(),
  selectedAnswer: text("selected_answer").notNull(), // 'A', 'B', 'C', or 'D'
  isCorrect: boolean("is_correct").notNull(),
  answeredAt: timestamp("answered_at").defaultNow().notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
});

export const deepDiveTopics = pgTable("deep_dive_topics", {
  id: serial("id").primaryKey(),
  weekIndex: integer("week_index").notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 1-7 (Monday to Sunday)
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  estimatedReadTime: text("estimated_read_time").notNull(),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  category: text("category").notNull(),
  content: text("content").notNull(),
  keyTakeaways: text("key_takeaways").array().notNull(),
  furtherReading: text("further_reading").array().notNull(),
  prerequisiteKnowledge: text("prerequisite_knowledge").array().notNull(),
  learningObjectives: text("learning_objectives").array().notNull(),
  practicalExercises: text("practical_exercises").array().notNull(),
  isPremium: boolean("is_premium").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertDailyFactSchema = createInsertSchema(dailyFacts).omit({
  id: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
});

export const insertKnowledgeAreaSchema = createInsertSchema(knowledgeAreas).omit({
  id: true,
});

export const insertConvictionContentSchema = createInsertSchema(convictionContent).omit({
  id: true,
});

export const insertTreasuryCompanySchema = createInsertSchema(treasuryCompanies).omit({
  id: true,
  lastUpdated: true,
});

export const insertSovereignAdoptionSchema = createInsertSchema(sovereignAdoption).omit({
  id: true,
  lastUpdated: true,
});

export const insertBitcoinPriceSchema = createInsertSchema(bitcoinPrice).omit({
  id: true,
  timestamp: true,
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({
  id: true,
});

export const insertUserQuizAnswerSchema = createInsertSchema(userQuizAnswers).omit({
  id: true,
  answeredAt: true,
});

export const insertDeepDiveTopicSchema = createInsertSchema(deepDiveTopics).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type DailyFact = typeof dailyFacts.$inferSelect;
export type InsertDailyFact = z.infer<typeof insertDailyFactSchema>;
export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type KnowledgeArea = typeof knowledgeAreas.$inferSelect;
export type InsertKnowledgeArea = z.infer<typeof insertKnowledgeAreaSchema>;
export type ConvictionContent = typeof convictionContent.$inferSelect;
export type InsertConvictionContent = z.infer<typeof insertConvictionContentSchema>;
export type TreasuryCompany = typeof treasuryCompanies.$inferSelect;
export type InsertTreasuryCompany = z.infer<typeof insertTreasuryCompanySchema>;
export type SovereignAdoption = typeof sovereignAdoption.$inferSelect;
export type InsertSovereignAdoption = z.infer<typeof insertSovereignAdoptionSchema>;
export type BitcoinPrice = typeof bitcoinPrice.$inferSelect;
export type InsertBitcoinPrice = z.infer<typeof insertBitcoinPriceSchema>;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type UserQuizAnswer = typeof userQuizAnswers.$inferSelect;
export type InsertUserQuizAnswer = z.infer<typeof insertUserQuizAnswerSchema>;
export type DeepDiveTopic = typeof deepDiveTopics.$inferSelect;
export type InsertDeepDiveTopic = z.infer<typeof insertDeepDiveTopicSchema>;
