import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
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
