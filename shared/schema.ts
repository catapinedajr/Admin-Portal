import { pgTable, text, serial, integer, boolean, timestamp, json, decimal, date, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  completedLessons: integer("completed_lessons").notNull().default(0),
  lastActivityDate: text("last_activity_date"), // YYYY-MM-DD format
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Clean session management with automatic cleanup
export const userSessions = pgTable("user_sessions", {
  id: text("id").primaryKey(), // UUID
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp("expires_at").notNull(),
  lastUsed: timestamp("last_used").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Simple password reset tokens
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Community forum categories
export const forumCategories = pgTable("forum_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  postCount: integer("post_count").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Forum posts
export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  dayIndex: integer("day_index"), // Link to specific curriculum day if applicable
  isSticky: boolean("is_sticky").notNull().default(false),
  isLocked: boolean("is_locked").notNull().default(false),
  replyCount: integer("reply_count").notNull().default(0),
  lastReplyAt: timestamp("last_reply_at"),
  lastReplyUserId: integer("last_reply_user_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Forum post replies
export const forumReplies = pgTable("forum_replies", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  isDeleted: boolean("is_deleted").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Curated video content
export const curatedVideos = pgTable("curated_videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  youtubeId: text("youtube_id").notNull().unique(),
  channelName: text("channel_name").notNull(),
  duration: integer("duration"), // in seconds
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  category: text("category").notNull(), // economics, technical, stories, news
  tags: text("tags").array(), // searchable tags
  isPopular: boolean("is_popular").notNull().default(false),
  isTrending: boolean("is_trending").notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// User video engagement
export const userVideoEngagement = pgTable("user_video_engagement", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  videoId: integer("video_id").notNull(),
  watchedAt: timestamp("watched_at").notNull().defaultNow(),
  progressPercent: integer("progress_percent").notNull().default(0), // 0-100
});

// Success stories
export const successStories = pgTable("success_stories", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isApproved: boolean("is_approved").notNull().default(false),
  isFeature: boolean("is_featured").notNull().default(false),
  likeCount: integer("like_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
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

// Daily activity tracking for consistency calendar
export const dailyActivities = pgTable("daily_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
  lessonCompleted: boolean("lesson_completed").notNull().default(false),
  quizCompleted: boolean("quiz_completed").notNull().default(false),
  practiceCompleted: boolean("practice_completed").notNull().default(false), // simulator or safety training
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const simulatorCompletions = pgTable("simulator_completions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  simulatorType: text("simulator_type").notNull(), // 'dca', 'hodl', 'inflation', 'settlement', 'security'
  completedMonth: text("completed_month").notNull(), // YYYY-MM format
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  // Unique constraint: one completion per user per simulator per month
  index("unique_user_simulator_month").on(table.userId, table.simulatorType, table.completedMonth),
]);

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
  isApproved: boolean("is_approved").notNull().default(false), // for content approval tracking
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const contentSetUpQuestions = pgTable("content_set_up_questions", {
  id: serial("id").primaryKey(),
  dayId: integer("day_id").notNull().references(() => contentDays.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull(),
  orderIndex: integer("order_index").notNull().default(0), // for multiple questions per day
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

export const insertUserSessionSchema = createInsertSchema(userSessions).omit({
  createdAt: true,
  lastUsed: true,
});

// Authentication schemas
export const loginSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(100),
});

export const registerSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(100),
  email: z.string().email(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().uuid(),
  newPassword: z.string().min(6).max(100),
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

export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({
  id: true,
  createdAt: true,
  usedAt: true,
});

// Insert schemas for new content tables
export const insertContentDaySchema = createInsertSchema(contentDays).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContentSetUpQuestionSchema = createInsertSchema(contentSetUpQuestions).omit({
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

// Email collection table for progressive access
export const emailCollections = pgTable("email_collections", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  email: varchar("email", { length: 255 }).notNull(),
  trigger: varchar("trigger", { length: 50 }), // 'day-limit', 'simulator', 'feature'
  lockedFeature: varchar("locked_feature", { length: 100 }),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEmailCollectionSchema = createInsertSchema(emailCollections).omit({
  id: true,
  createdAt: true,
});

// Bitcoin Learning Wallet System
export const userWalletProgress = pgTable("user_wallet_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  totalSatoshisEarned: integer("total_satoshis_earned").notNull().default(0),
  currentStreakMultiplier: decimal("current_streak_multiplier", { precision: 3, scale: 2 }).notNull().default("1.00"),
  lastEarningDate: text("last_earning_date"), // YYYY-MM-DD format
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const walletEarnings = pgTable("wallet_earnings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  dayIndex: integer("day_index").notNull(), // Which day of curriculum
  earningType: text("earning_type").notNull(), // 'quiz_question', 'quiz_completion', 'streak_7', 'streak_30', 'streak_365', 'simulator', 'community'
  satoshisEarned: integer("satoshis_earned").notNull(),
  streakMultiplier: decimal("streak_multiplier", { precision: 3, scale: 2 }).notNull().default("1.00"),
  bitcoinPriceUsd: decimal("bitcoin_price_usd", { precision: 10, scale: 2 }).notNull(), // Price at time of earning
  usdValueAtEarning: decimal("usd_value_at_earning", { precision: 10, scale: 8 }).notNull(),
  description: text("description"), // "Correct answer: Question 3", "Quiz completed perfectly", "7-day streak bonus", etc.
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
  date: text("date").notNull(), // YYYY-MM-DD format
});

export const walletAchievements = pgTable("wallet_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  achievementType: text("achievement_type").notNull(), // 'first_1000_sats', 'perfect_week', 'coffee_money', etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconName: text("icon_name").notNull(), // Lucide icon name
  satoshisThreshold: integer("satoshis_threshold"), // Required sats for achievement
  usdValueThreshold: decimal("usd_value_threshold", { precision: 10, scale: 2 }), // Required USD value
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
  isNotified: boolean("is_notified").notNull().default(false),
});

// Streak rewards tracking for recurring bonuses
export const streakRewards = pgTable("streak_rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  streakType: text("streak_type").notNull(), // '7_day', '30_day', '365_day'
  streakLength: integer("streak_length").notNull(), // Current streak length when earned
  satoshisEarned: integer("satoshis_earned").notNull(),
  streakNumber: integer("streak_number").notNull().default(1), // 1st 7-day streak, 2nd 7-day streak, etc.
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
  date: text("date").notNull(), // YYYY-MM-DD format
});

// Streak insurance system - spend sats to protect streaks
export const streakInsurance = pgTable("streak_insurance", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  streakLength: integer("streak_length").notNull(), // Streak length when insurance purchased
  satoshisCost: integer("satoshis_cost").notNull().default(1000), // Cost to purchase insurance
  isUsed: boolean("is_used").notNull().default(false), // Whether insurance was claimed
  usedAt: timestamp("used_at"), // When insurance was used
  expiresAt: timestamp("expires_at").notNull(), // 24-hour expiration
  purchasedAt: timestamp("purchased_at").notNull().defaultNow(),
  date: text("date").notNull(), // YYYY-MM-DD format
});

export const insertUserWalletProgressSchema = createInsertSchema(userWalletProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWalletEarningSchema = createInsertSchema(walletEarnings).omit({
  id: true,
  earnedAt: true,
});

export const insertWalletAchievementSchema = createInsertSchema(walletAchievements).omit({
  id: true,
  unlockedAt: true,
});

export const insertStreakRewardSchema = createInsertSchema(streakRewards).omit({
  id: true,
  earnedAt: true,
});

export const insertStreakInsuranceSchema = createInsertSchema(streakInsurance).omit({
  id: true,
  purchasedAt: true,
});

export type EmailCollection = typeof emailCollections.$inferSelect;
export type InsertEmailCollection = z.infer<typeof insertEmailCollectionSchema>;
export type UserWalletProgress = typeof userWalletProgress.$inferSelect;
export type InsertUserWalletProgress = z.infer<typeof insertUserWalletProgressSchema>;
export type WalletEarning = typeof walletEarnings.$inferSelect;
export type InsertWalletEarning = z.infer<typeof insertWalletEarningSchema>;
export type WalletAchievement = typeof walletAchievements.$inferSelect;
export type InsertWalletAchievement = z.infer<typeof insertWalletAchievementSchema>;
export type StreakReward = typeof streakRewards.$inferSelect;
export type InsertStreakReward = z.infer<typeof insertStreakRewardSchema>;
export type StreakInsurance = typeof streakInsurance.$inferSelect;
export type InsertStreakInsurance = z.infer<typeof insertStreakInsuranceSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;
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
export type ContentSetUpQuestion = typeof contentSetUpQuestions.$inferSelect;
export type InsertContentSetUpQuestion = z.infer<typeof insertContentSetUpQuestionSchema>;

export type ContentLesson = typeof contentLessons.$inferSelect;
export type InsertContentLesson = z.infer<typeof insertContentLessonSchema>;
export type ContentQuiz = typeof contentQuizzes.$inferSelect;
export type InsertContentQuiz = z.infer<typeof insertContentQuizSchema>;
export type ContentMetadata = typeof contentMetadata.$inferSelect;
export type InsertContentMetadata = z.infer<typeof insertContentMetadataSchema>;
export type ContentGenerationSteps = typeof contentGenerationSteps.$inferSelect;
export type InsertContentGenerationSteps = z.infer<typeof insertContentGenerationStepsSchema>;

// Enhanced content types for API responses
export type DailyContentSetUpQuestion = ContentSetUpQuestion;

export type DailyContentComplete = {
  day: ContentDay;
  setUpQuestions: DailyContentSetUpQuestion[];
  lesson: ContentLesson | null;
  quizzes: ContentQuiz[];
  metadata: ContentMetadata | null;
};

// Daily Activities schema and types
export const insertDailyActivitySchema = createInsertSchema(dailyActivities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type DailyActivity = typeof dailyActivities.$inferSelect;
export type InsertDailyActivity = z.infer<typeof insertDailyActivitySchema>;

// Simulator Completions schema and types
export const insertSimulatorCompletionSchema = createInsertSchema(simulatorCompletions).omit({
  id: true,
  createdAt: true,
});

export type SimulatorCompletion = typeof simulatorCompletions.$inferSelect;
export type InsertSimulatorCompletion = z.infer<typeof insertSimulatorCompletionSchema>;
