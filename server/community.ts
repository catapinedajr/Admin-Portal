import { db } from "./db";
import { forumCategories, forumPosts, forumReplies, curatedVideos, successStories, userVideoEngagement } from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";

export interface ICommunityStorage {
  // Forum operations
  getForumCategories(): Promise<any[]>;
  getForumPosts(categoryId?: number): Promise<any[]>;
  createForumPost(post: any): Promise<any>;
  
  // Video operations
  getCuratedVideos(difficulty?: string, category?: string): Promise<any[]>;
  recordVideoView(userId: number, videoId: number, progressPercent: number): Promise<void>;
  
  // Success stories
  getSuccessStories(isApproved?: boolean): Promise<any[]>;
  createSuccessStory(story: any): Promise<any>;
}

export class CommunityStorage implements ICommunityStorage {
  async getForumCategories() {
    return await db.select().from(forumCategories).where(eq(forumCategories.isActive, true));
  }
  
  async getForumPosts(categoryId?: number) {
    const query = db.select().from(forumPosts).orderBy(desc(forumPosts.createdAt));
    
    if (categoryId) {
      return await query.where(eq(forumPosts.categoryId, categoryId));
    }
    
    return await query;
  }
  
  async createForumPost(post: any) {
    const [newPost] = await db.insert(forumPosts).values(post).returning();
    return newPost;
  }
  
  async getCuratedVideos(difficulty?: string, category?: string) {
    let query = db.select().from(curatedVideos).orderBy(desc(curatedVideos.createdAt));
    
    if (difficulty || category) {
      const conditions = [];
      if (difficulty) conditions.push(eq(curatedVideos.difficulty, difficulty));
      if (category) conditions.push(eq(curatedVideos.category, category));
      
      return await query.where(sql`${conditions.join(' AND ')}`);
    }
    
    return await query;
  }
  
  async recordVideoView(userId: number, videoId: number, progressPercent: number) {
    await db.insert(userVideoEngagement).values({
      userId,
      videoId,
      progressPercent
    });
  }
  
  async getSuccessStories(isApproved = true) {
    return await db.select()
      .from(successStories)
      .where(eq(successStories.isApproved, isApproved))
      .orderBy(desc(successStories.createdAt));
  }
  
  async createSuccessStory(story: any) {
    const [newStory] = await db.insert(successStories).values(story).returning();
    return newStory;
  }
}

export const communityStorage = new CommunityStorage();