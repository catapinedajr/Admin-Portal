import { db } from "./db";
import { 
  forumCategories, forumPosts, forumReplies, curatedVideos, successStories, userVideoEngagement,
  forumVotes, userKarma, forumPostStats, forumReplyStats, users, videoCategories, videoSubcategories,
  type ForumPostWithStats, type ForumReplyWithStats, type VideoWithCategory, type FeaturedStory,
  type InsertForumVote, type InsertUserKarma, type InsertForumPostStats, type InsertForumReplyStats
} from "@shared/schema";
import { eq, desc, sql, and, isNull, count } from "drizzle-orm";

export interface ICommunityStorage {
  // Enhanced forum operations with Reddit-style features
  getForumCategories(): Promise<any[]>;
  getForumPostsWithStats(categoryId?: number, sortBy?: string, userId?: number): Promise<ForumPostWithStats[]>;
  createForumPost(post: any): Promise<any>;
  
  // Reddit-style voting system
  voteOnPost(userId: number, postId: number, voteType: 'upvote' | 'downvote'): Promise<void>;
  voteOnReply(userId: number, replyId: number, voteType: 'upvote' | 'downvote'): Promise<void>;
  getUserVote(userId: number, postId?: number, replyId?: number): Promise<any>;
  
  // Threaded replies with Reddit-style features
  getThreadedReplies(postId: number, userId?: number): Promise<ForumReplyWithStats[]>;
  createReply(reply: any): Promise<any>;
  
  // Karma system
  getUserKarma(userId: number): Promise<any>;
  updateUserKarma(userId: number, karmaChange: number, type: 'post' | 'comment' | 'awarded'): Promise<void>;
  
  // Enhanced video operations
  getVideosWithCategories(filters?: any): Promise<VideoWithCategory[]>;
  getVideoCategories(): Promise<any[]>;
  submitCommunityVideo(video: any): Promise<any>;
  voteOnVideo(userId: number, videoId: number, score: number): Promise<void>;
  
  // Enhanced success stories
  getFeaturedStories(): Promise<FeaturedStory[]>;
  createSuccessStory(story: any): Promise<any>;
  featureStory(storyId: number, featuredBy: number, adminNotes?: string): Promise<void>;
}

export class CommunityStorage implements ICommunityStorage {
  async getForumCategories() {
    return await db.select().from(forumCategories)
      .where(eq(forumCategories.isActive, true))
      .orderBy(forumCategories.sortOrder);
  }
  
  async getForumPostsWithStats(categoryId?: number, sortBy = 'new', userId?: number): Promise<ForumPostWithStats[]> {
    const query = db
      .select({
        post: forumPosts,
        stats: forumPostStats,
        author: {
          id: users.id,
          username: users.username
        },
        category: forumCategories
      })
      .from(forumPosts)
      .leftJoin(forumPostStats, eq(forumPosts.id, forumPostStats.postId))
      .leftJoin(users, eq(forumPosts.userId, users.id))
      .leftJoin(forumCategories, eq(forumPosts.categoryId, forumCategories.id));

    if (categoryId) {
      query.where(eq(forumPosts.categoryId, categoryId));
    }

    // Apply sorting
    switch (sortBy) {
      case 'hot':
        query.orderBy(desc(forumPostStats.hotScore));
        break;
      case 'top':
        query.orderBy(desc(sql`${forumPostStats.upvotes} - ${forumPostStats.downvotes}`));
        break;
      default: // 'new'
        query.orderBy(desc(forumPosts.createdAt));
    }

    const results = await query;
    
    // Get user votes if userId provided
    const postsWithStats = await Promise.all(results.map(async (result) => {
      let userVote = null;
      if (userId) {
        const vote = await this.getUserVote(userId, result.post.id);
        userVote = vote;
      }
      
      const karma = (result.stats?.upvotes || 0) - (result.stats?.downvotes || 0);
      
      return {
        ...result.post,
        stats: result.stats || { upvotes: 0, downvotes: 0, hotScore: 0, controversyScore: 0 },
        author: result.author,
        category: result.category,
        userVote,
        karma
      } as ForumPostWithStats;
    }));
    
    return postsWithStats;
  }
  
  async createForumPost(post: any) {
    const [newPost] = await db.insert(forumPosts).values(post).returning();
    
    // Initialize post stats
    await db.insert(forumPostStats).values({
      postId: newPost.id,
      upvotes: 0,
      downvotes: 0,
      hotScore: '0',
      controversyScore: '0'
    });
    
    return newPost;
  }
  
  // Reddit-style voting system
  async voteOnPost(userId: number, postId: number, voteType: 'upvote' | 'downvote') {
    // Check for existing vote
    const existingVote = await db
      .select()
      .from(forumVotes)
      .where(and(eq(forumVotes.userId, userId), eq(forumVotes.postId, postId)))
      .limit(1);
    
    if (existingVote.length > 0) {
      // Update existing vote
      await db
        .update(forumVotes)
        .set({ voteType })
        .where(and(eq(forumVotes.userId, userId), eq(forumVotes.postId, postId)));
    } else {
      // Create new vote
      await db.insert(forumVotes).values({
        userId,
        postId,
        replyId: null,
        voteType
      });
    }
    
    // Update post stats
    await this.updatePostStats(postId);
  }
  
  async voteOnReply(userId: number, replyId: number, voteType: 'upvote' | 'downvote') {
    // Check for existing vote
    const existingVote = await db
      .select()
      .from(forumVotes)
      .where(and(eq(forumVotes.userId, userId), eq(forumVotes.replyId, replyId)))
      .limit(1);
    
    if (existingVote.length > 0) {
      // Update existing vote
      await db
        .update(forumVotes)
        .set({ voteType })
        .where(and(eq(forumVotes.userId, userId), eq(forumVotes.replyId, replyId)));
    } else {
      // Create new vote
      await db.insert(forumVotes).values({
        userId,
        postId: null,
        replyId,
        voteType
      });
    }
    
    // Update reply stats
    await this.updateReplyStats(replyId);
  }
  
  async getUserVote(userId: number, postId?: number, replyId?: number) {
    const conditions = [eq(forumVotes.userId, userId)];
    
    if (postId) {
      conditions.push(eq(forumVotes.postId, postId));
    }
    if (replyId) {
      conditions.push(eq(forumVotes.replyId, replyId));
    }
    
    const vote = await db
      .select()
      .from(forumVotes)
      .where(and(...conditions))
      .limit(1);
    
    return vote[0] || null;
  }
  
  private async updatePostStats(postId: number) {
    const votes = await db
      .select({ voteType: forumVotes.voteType })
      .from(forumVotes)
      .where(eq(forumVotes.postId, postId));
    
    const upvotes = votes.filter(v => v.voteType === 'upvote').length;
    const downvotes = votes.filter(v => v.voteType === 'downvote').length;
    
    // Simple hot score algorithm (can be enhanced)
    const score = upvotes - downvotes;
    const hotScore = score / Math.pow((Date.now() - new Date().getTime()) / (1000 * 60 * 60) + 2, 1.8);
    
    await db
      .update(forumPostStats)
      .set({ 
        upvotes, 
        downvotes, 
        hotScore: hotScore.toString(),
        controversyScore: (Math.min(upvotes, downvotes) / Math.max(upvotes + downvotes, 1)).toString()
      })
      .where(eq(forumPostStats.postId, postId));
  }
  
  private async updateReplyStats(replyId: number) {
    const votes = await db
      .select({ voteType: forumVotes.voteType })
      .from(forumVotes)
      .where(eq(forumVotes.replyId, replyId));
    
    const upvotes = votes.filter(v => v.voteType === 'upvote').length;
    const downvotes = votes.filter(v => v.voteType === 'downvote').length;
    
    await db
      .update(forumReplyStats)
      .set({ upvotes, downvotes })
      .where(eq(forumReplyStats.replyId, replyId));
  }
  
  // Threaded replies system
  async getThreadedReplies(postId: number, userId?: number): Promise<ForumReplyWithStats[]> {
    const query = db
      .select({
        reply: forumReplies,
        stats: forumReplyStats,
        author: {
          id: users.id,
          username: users.username
        }
      })
      .from(forumReplies)
      .leftJoin(forumReplyStats, eq(forumReplies.id, forumReplyStats.replyId))
      .leftJoin(users, eq(forumReplies.userId, users.id))
      .where(eq(forumReplies.postId, postId))
      .orderBy(desc(sql`${forumReplyStats.upvotes} - ${forumReplyStats.downvotes}`));

    const results = await query;
    
    // Build threaded structure with user votes
    const repliesWithStats = await Promise.all(results.map(async (result) => {
      let userVote = null;
      if (userId) {
        const vote = await this.getUserVote(userId, undefined, result.reply.id);
        userVote = vote;
      }
      
      const karma = (result.stats?.upvotes || 0) - (result.stats?.downvotes || 0);
      
      return {
        ...result.reply,
        stats: result.stats || { upvotes: 0, downvotes: 0, depth: 0, childCount: 0 },
        author: result.author,
        userVote,
        karma,
        children: [] // Can be populated with nested replies
      } as ForumReplyWithStats;
    }));
    
    return repliesWithStats;
  }
  
  async createReply(reply: any) {
    const [newReply] = await db.insert(forumReplies).values(reply).returning();
    
    // Initialize reply stats
    await db.insert(forumReplyStats).values({
      replyId: newReply.id,
      parentReplyId: reply.parentReplyId || null,
      depth: reply.depth || 0,
      upvotes: 0,
      downvotes: 0,
      childCount: 0
    });
    
    return newReply;
  }
  
  // Karma system
  async getUserKarma(userId: number) {
    const karma = await db
      .select()
      .from(userKarma)
      .where(eq(userKarma.userId, userId))
      .limit(1);
    
    if (karma.length === 0) {
      // Initialize karma for new user
      const [newKarma] = await db.insert(userKarma).values({
        userId,
        totalKarma: 0,
        postKarma: 0,
        commentKarma: 0,
        awardedKarma: 0
      }).returning();
      return newKarma;
    }
    
    return karma[0];
  }
  
  async updateUserKarma(userId: number, karmaChange: number, type: 'post' | 'comment' | 'awarded') {
    const currentKarma = await this.getUserKarma(userId);
    
    const updates: any = {
      totalKarma: currentKarma.totalKarma + karmaChange
    };
    
    switch (type) {
      case 'post':
        updates.postKarma = currentKarma.postKarma + karmaChange;
        break;
      case 'comment':
        updates.commentKarma = currentKarma.commentKarma + karmaChange;
        break;
      case 'awarded':
        updates.awardedKarma = currentKarma.awardedKarma + karmaChange;
        break;
    }
    
    await db
      .update(userKarma)
      .set(updates)
      .where(eq(userKarma.userId, userId));
  }
  
  // Enhanced video operations
  async getVideosWithCategories(filters?: any): Promise<VideoWithCategory[]> {
    const query = db
      .select({
        video: curatedVideos,
        category: videoCategories,
        subcategory: videoSubcategories,
        submittedByUser: {
          id: users.id,
          username: users.username
        }
      })
      .from(curatedVideos)
      .leftJoin(videoCategories, eq(curatedVideos.categoryId, videoCategories.id))
      .leftJoin(videoSubcategories, eq(curatedVideos.subcategoryId, videoSubcategories.id))
      .leftJoin(users, eq(curatedVideos.submittedBy, users.id))
      .orderBy(desc(curatedVideos.createdAt));

    const results = await query;
    
    return results.map(result => ({
      ...result.video,
      category: result.category,
      subcategory: result.subcategory,
      submittedByUser: result.submittedByUser
    })) as VideoWithCategory[];
  }
  
  async getVideoCategories() {
    return await db.select().from(videoCategories).orderBy(videoCategories.sortOrder);
  }
  
  async submitCommunityVideo(video: any) {
    const [newVideo] = await db.insert(curatedVideos).values({
      ...video,
      isRecent: true,
      isCommunityPick: false,
      communityScore: 0
    }).returning();
    
    return newVideo;
  }
  
  async voteOnVideo(userId: number, videoId: number, score: number) {
    // Update community score for video
    await db
      .update(curatedVideos)
      .set({
        communityScore: sql`${curatedVideos.communityScore} + ${score}`
      })
      .where(eq(curatedVideos.id, videoId));
  }
  
  // Enhanced success stories
  async getFeaturedStories(): Promise<FeaturedStory[]> {
    const query = db
      .select({
        story: successStories,
        author: {
          id: users.id,
          username: users.username
        },
        feature: storyFeatures
      })
      .from(successStories)
      .leftJoin(users, eq(successStories.userId, users.id))
      .leftJoin(storyFeatures, eq(successStories.id, storyFeatures.storyId))
      .where(eq(successStories.isApproved, true))
      .orderBy(desc(storyFeatures.displayOrder), desc(successStories.createdAt));

    const results = await query;
    
    return results.map(result => ({
      ...result.story,
      author: result.author,
      feature: result.feature
    })) as FeaturedStory[];
  }
  
  async featureStory(storyId: number, featuredBy: number, adminNotes?: string) {
    await db.insert(storyFeatures).values({
      storyId,
      featuredBy,
      adminNotes,
      displayOrder: 0,
      isActive: true
    });
    
    // Mark story as featured
    await db
      .update(successStories)
      .set({ isFeature: true })
      .where(eq(successStories.id, storyId));
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