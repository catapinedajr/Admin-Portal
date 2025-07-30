import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, TrendingUp, Clock, Award } from 'lucide-react';
import { ForumPost } from './ForumPost';
// import { CreatePostModal } from './CreatePostModal';
import type { ForumPostWithStats, ForumCategory } from '@shared/schema';

interface ForumThreadListProps {
  category: ForumCategory;
  posts: ForumPostWithStats[];
  onBack: () => void;
  onVote: (postId: number, voteType: 'upvote' | 'downvote') => void;
  onReply: (postId: number) => void;
  onCreatePost: (post: { title: string; content: string; categoryId: number; dayIndex?: number }) => void;
  onSortChange: (sortBy: string) => void;
  currentSort: string;
}

export function ForumThreadList({ 
  category, 
  posts, 
  onBack, 
  onVote, 
  onReply, 
  onCreatePost,
  onSortChange,
  currentSort 
}: ForumThreadListProps) {
  const [showCreatePost, setShowCreatePost] = useState(false);
  
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
      
      {/* Category info */}
      <Card className="bg-zinc-900/50 border-zinc-700/50 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{category.name}</h1>
            {category.description && (
              <p className="text-zinc-400 mb-3">{category.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-zinc-500">
              <span>{category.postCount} posts</span>
              <span>•</span>
              <span>Active community</span>
            </div>
          </div>
          
          <Button
            onClick={() => setShowCreatePost(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Post
          </Button>
        </div>
      </Card>
      
      {/* Sort tabs */}
      <Tabs value={currentSort} onValueChange={onSortChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-zinc-900/50 border border-zinc-700/50">
          <TabsTrigger 
            value="hot" 
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Hot
          </TabsTrigger>
          <TabsTrigger 
            value="new"
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <Clock className="h-4 w-4 mr-1" />
            New
          </TabsTrigger>
          <TabsTrigger 
            value="top"
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <Award className="h-4 w-4 mr-1" />
            Top
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={currentSort} className="mt-4">
          {/* Posts list */}
          <div className="space-y-3">
            {posts.length === 0 ? (
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
            ) : (
              posts.map((post) => (
                <ForumPost
                  key={post.id}
                  post={post}
                  onVote={onVote}
                  onReply={onReply}
                  compact={true}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Community guidelines */}
      {posts.length > 0 && (
        <Card className="bg-zinc-900/30 border-zinc-700/30 p-4">
          <h3 className="text-sm font-medium text-orange-400 mb-2">Community Guidelines</h3>
          <ul className="text-xs text-zinc-500 space-y-1">
            <li>• Be respectful and constructive in your discussions</li>
            <li>• Share accurate information and cite sources when possible</li>
            <li>• Help newcomers learn about Bitcoin</li>
            <li>• No financial advice - only educational content</li>
          </ul>
        </Card>
      )}
      
      {/* Create post modal - temporarily disabled */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Create Post</h3>
            <p className="text-zinc-400 mb-4">Post creation feature coming soon!</p>
            <Button onClick={() => setShowCreatePost(false)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}