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



export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
  dayIndex: integer("day_index").notNull(), // which day of curriculum this represents
  factsViewed: integer("facts_viewed").notNull().default(0),
  lessonCompleted: boolean("lesson_completed").notNull().default(false),
  quizCompleted: boolean("quiz_completed").notNull().default(false),
  dayCompleted: boolean("day_completed").notNull().default(false), // all activities finished
  completedAt: timestamp("completed_at"), // when day was fully completed
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

export const userQuizAnswers = pgTable("user_quiz_answers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  questionId: integer("question_id").notNull(),
  selectedAnswer: text("selected_answer").notNull(), // 'A', 'B', 'C', or 'D'
  isCorrect: boolean("is_correct").notNull(),
  answeredAt: timestamp("answered_at").defaultNow().notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
});

// New Content Management Tables for 180-day curriculum
export const contentDays = pgTable("content_days", {
  id: serial("id").primaryKey(),
  dayIndex: integer("day_index").notNull().unique(),
  title: text("title").notNull(),
  readingLevel: text("reading_level").notNull(), // "9th grade", "10th grade", etc.
  culturalStage: text("cultural_stage").notNull(), // "Normie → Pre-coiner", etc.
  theme: text("theme").notNull(), // "Bitcoin basics", "Austrian economics", etc.
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const contentFacts = pgTable("content_facts", {
  id: serial("id").primaryKey(),
  dayId: integer("day_id").notNull().references(() => contentDays.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull(),
  orderIndex: integer("order_index").notNull().default(0), // for multiple facts per day
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const contentDiveDeeper = pgTable("content_dive_deeper", {
  id: serial("id").primaryKey(),
  factId: integer("fact_id").notNull().references(() => contentFacts.id, { onDelete: "cascade" }),
  dayId: integer("day_id").notNull().references(() => contentDays.id),
  explanation: text("explanation").notNull(),
  examples: json("examples").$type<string[]>().notNull(),
  visualDescription: text("visual_description").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const contentLessons = pgTable("content_lessons", {
  id: serial("id").primaryKey(),
  dayId: integer("day_id").notNull().references(() => contentDays.id),
  title: text("title").notNull(),
  content: text("content").notNull(), // Main narrative lesson content
  keyTakeaways: json("key_takeaways").$type<string[]>().notNull(),
  whyItMatters: text("why_it_matters"), // "Why This Matters" section content
  estimatedReadTime: integer("estimated_read_time").notNull().default(3), // minutes
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const contentQuizzes = pgTable("content_quizzes", {
  id: serial("id").primaryKey(),
  dayId: integer("day_id").notNull().references(() => contentDays.id),
  question: text("question").notNull(),
  options: json("options").$type<string[]>().notNull(),
  correctAnswer: integer("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  orderIndex: integer("order_index").notNull().default(0), // for multiple questions per day
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const contentMetadata = pgTable("content_metadata", {
  id: serial("id").primaryKey(),
  dayId: integer("day_id").notNull().references(() => contentDays.id),
  generationPrompt: text("generation_prompt"), // Store the prompt used to generate this content
  generationDate: timestamp("generation_date"),
  qualityScore: integer("quality_score"), // 1-10 rating for content quality
  reviewStatus: text("review_status").notNull().default("pending"), // pending, approved, needs_revision
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const contentGenerationSteps = pgTable("content_generation_steps", {
  id: serial("id").primaryKey(),
  stepNumber: varchar("step_number", { length: 10 }).notNull(),
  stepName: varchar("step_name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").array(),
  qualityGates: text("quality_gates").array(),
  outputs: text("outputs").array(),
  estimatedTimeMinutes: integer("estimated_time_minutes"),
  dependencies: varchar("dependencies", { length: 50 }).array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
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

export const insertUserQuizAnswerSchema = createInsertSchema(userQuizAnswers).omit({
  id: true,
  answeredAt: true,
});

// Insert schemas for new content tables
export const insertContentDaySchema = createInsertSchema(contentDays).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContentFactSchema = createInsertSchema(contentFacts).omit({
  id: true,
  createdAt: true,
});

export const insertContentDiveDeeperSchema = createInsertSchema(contentDiveDeeper).omit({
  id: true,
  createdAt: true,
});

export const insertContentLessonSchema = createInsertSchema(contentLessons).omit({
  id: true,
  createdAt: true,
});

export const insertContentQuizSchema = createInsertSchema(contentQuizzes).omit({
  id: true,
  createdAt: true,
});

export const insertContentMetadataSchema = createInsertSchema(contentMetadata).omit({
  id: true,
  createdAt: true,
});

export const insertContentGenerationStepsSchema = createInsertSchema(contentGenerationSteps).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
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
export type UserQuizAnswer = typeof userQuizAnswers.$inferSelect;
export type InsertUserQuizAnswer = z.infer<typeof insertUserQuizAnswerSchema>;

// Types for new content tables
export type ContentDay = typeof contentDays.$inferSelect;
export type InsertContentDay = z.infer<typeof insertContentDaySchema>;
export type ContentFact = typeof contentFacts.$inferSelect;
export type InsertContentFact = z.infer<typeof insertContentFactSchema>;
export type ContentDiveDeeper = typeof contentDiveDeeper.$inferSelect;
export type InsertContentDiveDeeper = z.infer<typeof insertContentDiveDeeperSchema>;
export type ContentLesson = typeof contentLessons.$inferSelect;
export type InsertContentLesson = z.infer<typeof insertContentLessonSchema>;
export type ContentQuiz = typeof contentQuizzes.$inferSelect;
export type InsertContentQuiz = z.infer<typeof insertContentQuizSchema>;
export type ContentMetadata = typeof contentMetadata.$inferSelect;
export type InsertContentMetadata = z.infer<typeof insertContentMetadataSchema>;
export type ContentGenerationSteps = typeof contentGenerationSteps.$inferSelect;
export type InsertContentGenerationSteps = z.infer<typeof insertContentGenerationStepsSchema>;

// Enhanced content types for API responses
export type DailyContentFact = ContentFact & {
  diveDeeper?: ContentDiveDeeper | null;
};

export type DailyContentComplete = {
  day: ContentDay;
  facts: DailyContentFact[];
  lesson: ContentLesson | null;
  quizzes: ContentQuiz[];
  metadata: ContentMetadata | null;
};
