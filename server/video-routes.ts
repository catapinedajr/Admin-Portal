import type { Express } from "express";
import { db } from "./db";
import { 
  userVideoEngagement, 
  videoReactions, 
  videoComments, 
  videoCommentLikes, 
  videoStats,
  walletEarnings,
  userWalletProgress,
  users
} from "@shared/schema";
import { eq, and, desc, count, avg, sum } from "drizzle-orm";

export function registerVideoRoutes(app: Express, authMiddleware?: any) {
  
  // Track video progress and award completion rewards
  app.post('/api/videos/progress', authMiddleware, async (req: any, res) => {
    try {
      const userId = req.user?.id;

      const { videoId, progress, completed } = req.body;

      // Check if engagement record exists
      const existing = await db
        .select()
        .from(userVideoEngagement)
        .where(and(
          eq(userVideoEngagement.userId, userId),
          eq(userVideoEngagement.videoId, videoId)
        ))
        .limit(1);

      let rewardEarned = 0;

      if (existing.length === 0) {
        // Create new engagement record
        await db.insert(userVideoEngagement).values({
          userId,
          videoId,
          progressPercent: progress,
          completed,
          completedAt: completed ? new Date() : null,
          rewardEarned: completed ? 100 : 0, // 100 sats for completion
          totalWatchTime: Math.floor(progress * 3), // Estimate watch time
          lastPosition: Math.floor(progress * 180), // Estimate position
        });

        if (completed) {
          rewardEarned = 100;
          
          // Add wallet earning record
          await db.insert(walletEarnings).values({
            userId,
            dayIndex: 1, // Default to day 1 for now
            earningType: 'video_completion',
            satoshisEarned: 100,
            streakMultiplier: "1.00",
            bitcoinPriceUsd: "116000.00", // Current BTC price
            usdValueAtEarning: "0.00116000",
            description: `Completed video: ${videoId}`,
            date: new Date().toISOString().split('T')[0],
          });

          // Update user wallet progress
          const currentWallet = await db
            .select()
            .from(userWalletProgress)
            .where(eq(userWalletProgress.userId, userId))
            .limit(1);

          if (currentWallet.length === 0) {
            await db.insert(userWalletProgress).values({
              userId,
              totalSatoshisEarned: 100,
              currentStreakMultiplier: "1.00",
              lastEarningDate: new Date().toISOString().split('T')[0],
            });
          } else {
            await db
              .update(userWalletProgress)
              .set({
                totalSatoshisEarned: currentWallet[0].totalSatoshisEarned + 100,
                lastEarningDate: new Date().toISOString().split('T')[0],
              })
              .where(eq(userWalletProgress.userId, userId));
          }
        }
      } else {
        // Update existing record
        const wasCompleted = existing[0].completed;
        
        await db
          .update(userVideoEngagement)
          .set({
            progressPercent: Math.max(progress, existing[0].progressPercent),
            completed: completed || existing[0].completed,
            completedAt: completed && !wasCompleted ? new Date() : existing[0].completedAt,
            rewardEarned: completed && !wasCompleted ? existing[0].rewardEarned + 100 : existing[0].rewardEarned,
            totalWatchTime: existing[0].totalWatchTime + Math.floor(progress * 2),
            lastPosition: Math.floor(progress * 180),
          })
          .where(eq(userVideoEngagement.id, existing[0].id));

        if (completed && !wasCompleted) {
          rewardEarned = 100;
          
          // Add completion reward
          await db.insert(walletEarnings).values({
            userId,
            dayIndex: 1,
            earningType: 'video_completion',
            satoshisEarned: 100,
            streakMultiplier: "1.00",
            bitcoinPriceUsd: "116000.00",
            usdValueAtEarning: "0.00116000",
            description: `Completed video: ${videoId}`,
            date: new Date().toISOString().split('T')[0],
          });

          // Update wallet
          const currentWallet = await db
            .select()
            .from(userWalletProgress)
            .where(eq(userWalletProgress.userId, userId))
            .limit(1);

          if (currentWallet.length > 0) {
            await db
              .update(userWalletProgress)
              .set({
                totalSatoshisEarned: currentWallet[0].totalSatoshisEarned + 100,
              })
              .where(eq(userWalletProgress.userId, userId));
          }
        }
      }

      // Update video stats - temporarily disabled due to SQL error
      // await updateVideoStats(videoId);

      res.json({ 
        success: true, 
        progress, 
        completed, 
        rewardEarned 
      });
    } catch (error) {
      console.error('Error tracking video progress:', error);
      res.status(500).json({ message: 'Failed to track progress' });
    }
  });

  // Get video stats
  app.get('/api/videos/:videoId/stats', async (req, res) => {
    try {
      const { videoId } = req.params;
      
      const stats = await db
        .select()
        .from(videoStats)
        .where(eq(videoStats.videoId, videoId))
        .limit(1);

      if (stats.length === 0) {
        // Initialize stats if they don't exist
        await db.insert(videoStats).values({
          videoId,
          totalViews: 0,
          uniqueViewers: 0,
          completionCount: 0,
          averageWatchTime: 0,
          completionRate: 0,
          totalReactions: 0,
          totalComments: 0,
          trending: false,
        });

        return res.json({
          totalViews: 0,
          completionCount: 0,
          completionRate: 0,
          totalReactions: 0,
          totalComments: 0
        });
      }

      res.json(stats[0]);
    } catch (error) {
      console.error('Error fetching video stats:', error);
      res.status(500).json({ message: 'Failed to fetch stats' });
    }
  });

  // Add video reaction
  app.post('/api/videos/reactions', authMiddleware, async (req: any, res) => {
    try {
      const userId = req.user?.id;

      const { videoId, reactionType } = req.body;

      // Check if user already reacted
      const existing = await db
        .select()
        .from(videoReactions)
        .where(and(
          eq(videoReactions.userId, userId),
          eq(videoReactions.videoId, videoId),
          eq(videoReactions.reactionType, reactionType)
        ))
        .limit(1);

      if (existing.length === 0) {
        // Add new reaction
        await db.insert(videoReactions).values({
          userId,
          videoId,
          reactionType,
        });

        // Award engagement points
        await db.insert(walletEarnings).values({
          userId,
          dayIndex: 1,
          earningType: 'video_engagement',
          satoshisEarned: 10,
          streakMultiplier: "1.00",
          bitcoinPriceUsd: "116000.00",
          usdValueAtEarning: "0.00001160",
          description: `Reacted to video: ${reactionType}`,
          date: new Date().toISOString().split('T')[0],
        });

        // Update wallet
        const currentWallet = await db
          .select()
          .from(userWalletProgress)
          .where(eq(userWalletProgress.userId, userId))
          .limit(1);

        if (currentWallet.length > 0) {
          await db
            .update(userWalletProgress)
            .set({
              totalSatoshisEarned: currentWallet[0].totalSatoshisEarned + 10,
            })
            .where(eq(userWalletProgress.userId, userId));
        }

        // await updateVideoStats(videoId);
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error adding reaction:', error);
      res.status(500).json({ message: 'Failed to add reaction' });
    }
  });

  // Get video reactions
  app.get('/api/videos/:videoId/reactions', (req: any, res: any, next: any) => {
    // Try to get user if authenticated, but don't require auth
    if (authMiddleware && req.user) {
      authMiddleware(req, res, next);
    } else {
      req.user = { id: 1 }; // Default user for demo
      next();
    }
  }, async (req: any, res) => {
    try {
      const { videoId } = req.params;
      const userId = req.user?.id;

      const reactions = await db
        .select({
          reactionType: videoReactions.reactionType,
          count: count(),
        })
        .from(videoReactions)
        .where(eq(videoReactions.videoId, videoId))
        .groupBy(videoReactions.reactionType);

      // Check user's reactions if logged in
      let userReactions: string[] = [];
      if (userId) {
        const userReactionData = await db
          .select({ reactionType: videoReactions.reactionType })
          .from(videoReactions)
          .where(and(
            eq(videoReactions.videoId, videoId),
            eq(videoReactions.userId, userId)
          ));
        
        userReactions = userReactionData.map(r => r.reactionType);
      }

      const formattedReactions = reactions.map(r => ({
        type: r.reactionType,
        count: r.count,
        userReacted: userReactions.includes(r.reactionType)
      }));

      // Ensure all reaction types are present
      const allReactionTypes = ['mind_blown', 'rocket', 'lightbulb', 'fire'];
      const result = allReactionTypes.map(type => {
        const existing = formattedReactions.find(r => r.type === type);
        return existing || { 
          type, 
          count: 0, 
          userReacted: false 
        };
      });

      res.json(result);
    } catch (error) {
      console.error('Error fetching reactions:', error);
      res.status(500).json({ message: 'Failed to fetch reactions' });
    }
  });

  // Add video comment
  app.post('/api/videos/comments', authMiddleware, async (req: any, res) => {
    try {
      const userId = req.user?.id;

      const { videoId, content, timestamp } = req.body;

      await db.insert(videoComments).values({
        userId,
        videoId,
        content,
        timestamp: timestamp || null,
        likeCount: 0,
      });

      // Award comment points
      await db.insert(walletEarnings).values({
        userId,
        dayIndex: 1,
        earningType: 'video_engagement',
        satoshisEarned: 25,
        streakMultiplier: "1.00",
        bitcoinPriceUsd: "116000.00",
        usdValueAtEarning: "0.00002900",
        description: `Commented on video: ${videoId}`,
        date: new Date().toISOString().split('T')[0],
      });

      // Update wallet
      const currentWallet = await db
        .select()
        .from(userWalletProgress)
        .where(eq(userWalletProgress.userId, userId))
        .limit(1);

      if (currentWallet.length > 0) {
        await db
          .update(userWalletProgress)
          .set({
            totalSatoshisEarned: currentWallet[0].totalSatoshisEarned + 25,
          })
          .where(eq(userWalletProgress.userId, userId));
      }

      // await updateVideoStats(videoId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ message: 'Failed to add comment' });
    }
  });

  // Get video comments
  app.get('/api/videos/:videoId/comments', (req: any, res: any, next: any) => {
    // Try to get user if authenticated, but don't require auth
    if (authMiddleware && req.user) {
      authMiddleware(req, res, next);
    } else {
      req.user = { id: 1 }; // Default user for demo
      next();
    }
  }, async (req: any, res) => {
    try {
      const { videoId } = req.params;
      const userId = req.user?.id;

      const comments = await db
        .select({
          id: videoComments.id,
          content: videoComments.content,
          timestamp: videoComments.timestamp,
          likeCount: videoComments.likeCount,
          createdAt: videoComments.createdAt,
          username: users.username,
        })
        .from(videoComments)
        .leftJoin(users, eq(videoComments.userId, users.id))
        .where(and(
          eq(videoComments.videoId, videoId),
          eq(videoComments.isDeleted, false)
        ))
        .orderBy(desc(videoComments.createdAt));

      // Check which comments user has liked
      let userLikes: number[] = [];
      if (userId) {
        const likes = await db
          .select({ commentId: videoCommentLikes.commentId })
          .from(videoCommentLikes)
          .where(eq(videoCommentLikes.userId, userId));
        userLikes = likes.map(l => l.commentId);
      }

      const result = comments.map(comment => ({
        ...comment,
        userLiked: userLikes.includes(comment.id)
      }));

      res.json(result);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ message: 'Failed to fetch comments' });
    }
  });

  // Like comment
  app.post('/api/videos/comments/like', authMiddleware, async (req: any, res) => {
    try {
      const userId = req.user?.id;

      const { commentId } = req.body;

      // Check if already liked
      const existing = await db
        .select()
        .from(videoCommentLikes)
        .where(and(
          eq(videoCommentLikes.userId, userId),
          eq(videoCommentLikes.commentId, commentId)
        ))
        .limit(1);

      if (existing.length === 0) {
        // Add like
        await db.insert(videoCommentLikes).values({
          userId,
          commentId,
        });

        // Update comment like count - fetch current count first
        const comment = await db
          .select({ likeCount: videoComments.likeCount })
          .from(videoComments)
          .where(eq(videoComments.id, commentId))
          .limit(1);
        
        if (comment.length > 0) {
          await db
            .update(videoComments)
            .set({
              likeCount: comment[0].likeCount + 1,
            })
            .where(eq(videoComments.id, commentId));
        }
      } else {
        // Remove like
        await db
          .delete(videoCommentLikes)
          .where(eq(videoCommentLikes.id, existing[0].id));

        // Update comment like count - fetch current count first
        const comment = await db
          .select({ likeCount: videoComments.likeCount })
          .from(videoComments)
          .where(eq(videoComments.id, commentId))
          .limit(1);
        
        if (comment.length > 0) {
          await db
            .update(videoComments)
            .set({
              likeCount: Math.max(0, comment[0].likeCount - 1),
            })
            .where(eq(videoComments.id, commentId));
        }
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error liking comment:', error);
      res.status(500).json({ message: 'Failed to like comment' });
    }
  });
}

async function updateVideoStats(videoId: string) {
  try {
    // Simplified stats update - basic count only
    const viewCount = await db
      .select({ count: count() })
      .from(userVideoEngagement)
      .where(eq(userVideoEngagement.videoId, videoId));

    const completionCount = await db
      .select({ count: count() })
      .from(userVideoEngagement)
      .where(and(eq(userVideoEngagement.videoId, videoId), eq(userVideoEngagement.completed, true)));

    const reactionCount = await db
      .select({ count: count() })
      .from(videoReactions)
      .where(eq(videoReactions.videoId, videoId));

    const commentCount = await db
      .select({ count: count() })
      .from(videoComments)
      .where(and(
        eq(videoComments.videoId, videoId),
        eq(videoComments.isDeleted, false)
      ));

    const totalViews = viewCount[0]?.count || 0;
    const completions = completionCount[0]?.count || 0;
    const completionRate = totalViews > 0 ? Math.round((completions / totalViews) * 100) : 0;

    // Update or insert stats
    await db
      .insert(videoStats)
      .values({
        videoId,
        totalViews,
        uniqueViewers: totalViews,
        completionCount: completions,
        averageWatchTime: 0, // Simplified for now
        completionRate,
        totalReactions: reactionCount[0]?.count || 0,
        totalComments: commentCount[0]?.count || 0,
        trending: completions > 10,
      })
      .onConflictDoUpdate({
        target: videoStats.videoId,
        set: {
          totalViews,
          uniqueViewers: totalViews,
          completionCount: completions,
          completionRate,
          totalReactions: reactionCount[0]?.count || 0,
          totalComments: commentCount[0]?.count || 0,
          trending: completions > 10,
          lastUpdated: new Date(),
        },
      });
  } catch (error) {
    console.error('Error updating video stats:', error);
  }
}