import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import type { ForumPostWithStats } from '@shared/schema';

interface ForumPostProps {
  post: ForumPostWithStats;
  onVote: (postId: number, voteType: 'upvote' | 'downvote') => void;
  onReply: (postId: number) => void;
  compact?: boolean;
}

export function ForumPost({ post, onVote, onReply, compact = false }: ForumPostProps) {
  const [isExpanded, setIsExpanded] = useState(!compact);
  
  const handleVote = (voteType: 'upvote' | 'downvote') => {
    onVote(post.id, voteType);
  };
  
  const isUpvoted = post.userVote?.voteType === 'upvote';
  const isDownvoted = post.userVote?.voteType === 'downvote';
  
  return (
    <Card className="bg-zinc-900/50 border-zinc-700/50 hover:border-orange-500/30 transition-all duration-300">
      <div className="flex gap-3 p-4">
        {/* Reddit-style voting column */}
        <div className="flex flex-col items-center gap-1 min-w-[40px]">
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${
              isUpvoted 
                ? 'text-orange-500 hover:text-orange-400' 
                : 'text-zinc-400 hover:text-orange-500'
            }`}
            onClick={() => handleVote('upvote')}
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
          
          <span className={`text-sm font-medium ${
            post.karma > 0 ? 'text-orange-500' : 
            post.karma < 0 ? 'text-red-500' : 
            'text-zinc-400'
          }`}>
            {post.karma}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${
              isDownvoted 
                ? 'text-red-500 hover:text-red-400' 
                : 'text-zinc-400 hover:text-red-500'
            }`}
            onClick={() => handleVote('downvote')}
          >
            <ChevronDown className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Post content */}
        <div className="flex-1 min-w-0">
          {/* Post header */}
          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
            <Badge variant="secondary" className="bg-orange-500/10 text-orange-300 border-orange-500/20">
              {post.category?.name}
            </Badge>
            <span>Posted by</span>
            <span className="text-orange-400 hover:text-orange-300 cursor-pointer">
              u/{post.author?.username}
            </span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
            {post.isSticky && (
              <Badge variant="outline" className="text-green-400 border-green-400/50">
                Pinned
              </Badge>
            )}
          </div>
          
          {/* Post title */}
          <h3 className={`font-semibold text-white mb-2 hover:text-orange-300 cursor-pointer transition-colors ${
            compact ? 'text-base' : 'text-lg'
          }`}>
            {post.title}
          </h3>
          
          {/* Post content */}
          {(!compact || isExpanded) && (
            <div className="text-zinc-300 mb-4 prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap">{post.content}</div>
            </div>
          )}
          
          {/* Post actions */}
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 transition-colors h-8 px-2"
              onClick={() => onReply(post.id)}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.replyCount} {post.replyCount === 1 ? 'comment' : 'comments'}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 transition-colors h-8 px-2"
            >
              <Share className="h-4 w-4 mr-1" />
              Share
            </Button>
            
            {compact && !isExpanded && (
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-orange-400 transition-colors h-8 px-2"
                onClick={() => setIsExpanded(true)}
              >
                Read more
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 transition-colors h-8 px-2 ml-auto"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Day index link if applicable */}
          {post.dayIndex && (
            <div className="mt-3 pt-3 border-t border-zinc-700/50">
              <Badge variant="outline" className="text-orange-400 border-orange-500/30">
                Related to Day {post.dayIndex}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}