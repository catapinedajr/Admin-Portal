import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, TrendingUp, Clock, Award } from 'lucide-react';
import { ForumPost } from './ForumPost';
import { CreatePostModal } from './CreatePostModal';
import type { ForumPostWithStats, ForumCategory } from '@shared/schema';

interface ForumThreadListProps {
  category: ForumCategory;
  posts: ForumPostWithStats[];
  onBack: () => void;
  onPostClick: (post: ForumPostWithStats) => void;
  onLike: (postId: number) => void;
  onReply: (postId: number, content: string) => void;
  onCreatePost: (post: { title: string; content: string; categoryId: number; dayIndex?: number }) => void;
  onSortChange: (sortBy: string) => void;
  currentSort: string;
}

export function ForumThreadList({ 
  category, 
  posts, 
  onBack, 
  onPostClick,
  onLike,
  onReply, 
  onCreatePost,
  onSortChange,
  currentSort 
}: ForumThreadListProps) {
  const [showCreatePost, setShowCreatePost] = useState(false);
  
  // Check if this is the Daily Lesson Discussions category
  const isDailyLessonsCategory = category.name === "Daily Lesson Discussions";
  
  // For Daily Lesson Discussions, group by user's current day
  const userCurrentDay = 1; // TODO: Get from user context
  const currentDayPosts = isDailyLessonsCategory 
    ? posts.filter(post => post.dayIndex === userCurrentDay)
    : [];
  const otherPosts = isDailyLessonsCategory 
    ? posts.filter(post => !post.dayIndex || post.dayIndex !== userCurrentDay)
    : posts;
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Forums
        </Button>
      </div>
      
      {/* Simplified category header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">{category.name}</h1>
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <span>{category.postCount} posts</span>
            {isDailyLessonsCategory && (
              <>
                <span>•</span>
                <span className="text-orange-400">Day-specific discussions</span>
              </>
            )}
          </div>
        </div>
        
        <Button
          onClick={() => setShowCreatePost(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>
      
      {/* Simple day grouping for Daily Lesson Discussions */}
      {isDailyLessonsCategory && currentDayPosts.length > 0 && (
        <Card className="bg-blue-900/20 border-blue-500/30 p-4">
          <h3 className="text-sm font-medium text-blue-300 mb-3">
            📚 Your Day ({userCurrentDay}) - {currentDayPosts.length} discussions
          </h3>
          <div className="space-y-3">
            {currentDayPosts.map((post) => (
              <div key={post.id} onClick={() => onPostClick(post)} className="cursor-pointer">
                <ForumPost
                  post={post}
                  onLike={onLike}
                  onReply={onReply}
                  compact={true}
                />
              </div>
            ))}
          </div>
        </Card>
      )}
      
      {/* Simplified sort tabs */}
      <Tabs value={currentSort} onValueChange={onSortChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-zinc-900/50 border border-zinc-700/50">
          <TabsTrigger 
            value="hot" 
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Hot
          </TabsTrigger>
          <TabsTrigger 
            value="new"
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            New
          </TabsTrigger>
          <TabsTrigger 
            value="top"
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Top
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={currentSort} className="mt-4">
          {/* Posts list */}
          <div className="space-y-3">
            {/* Show other day posts or all posts if not daily lessons category */}
            {isDailyLessonsCategory && otherPosts.length > 0 && (
              <>
                <h3 className="text-sm font-medium text-zinc-400 mb-3 border-b border-zinc-700 pb-2">
                  Other Days - {otherPosts.length} discussions
                </h3>
                {otherPosts.map((post) => (
                  <div key={post.id} onClick={() => onPostClick(post)} className="cursor-pointer">
                    <ForumPost
                      post={post}
                      onLike={onLike}
                      onReply={onReply}
                      compact={true}
                    />
                  </div>
                ))}
              </>
            )}
            
            {!isDailyLessonsCategory && posts.length > 0 && (
              posts.map((post) => (
                <div key={post.id} onClick={() => onPostClick(post)} className="cursor-pointer">
                  <ForumPost
                    post={post}
                    onLike={onLike}
                    onReply={onReply}
                    compact={true}
                  />
                </div>
              ))
            )}
            
            {posts.length === 0 && (
              <Card className="bg-zinc-900/30 border-zinc-700/30 p-8 text-center">
                <div className="text-zinc-400 mb-4">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                  <p className="text-sm">Be the first to start a discussion in this category!</p>
                </div>
                <Button
                  onClick={() => setShowCreatePost(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create First Post
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Create post modal */}
      {showCreatePost && (
        <CreatePostModal
          categoryId={category.id}
          categoryName={category.name}
          userCurrentDay={userCurrentDay}
          onClose={() => setShowCreatePost(false)}
          onCreatePost={async (postData) => {
            await onCreatePost(postData);
            setShowCreatePost(false);
          }}
        />
      )}
    </div>
  );
}