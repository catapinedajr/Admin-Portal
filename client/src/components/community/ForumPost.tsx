import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Share, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import type { ForumPostWithStats } from '@shared/schema';

interface ForumPostProps {
  post: ForumPostWithStats;
  onReply: (postId: number, content: string) => void;
  onLike: (postId: number) => void;
  compact?: boolean;
}

export function ForumPost({ post, onReply, onLike, compact = false }: ForumPostProps) {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  
  return (
    <Card className="bg-black border-zinc-700/50 hover:bg-zinc-800/50 hover:border-orange-500/30 hover:scale-[1.02] transition-all duration-300 group">
      <div className="p-4 sm:p-6">
        {/* Post content */}
        <div className="flex-1 min-w-0">
          {/* iPhone-optimized post header */}
          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-3 flex-wrap">
            <Badge variant="secondary" className="bg-orange-500/10 text-orange-300 border-orange-500/20 text-xs px-2 py-1">
              {post.category?.name}
            </Badge>
            {post.dayIndex && (
              <Badge variant="outline" className="text-blue-400 border-blue-500/30 bg-blue-500/5 text-xs px-2 py-1">
                Day {post.dayIndex}
              </Badge>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs">by</span>
              <span className="text-orange-400 hover:text-orange-300 cursor-pointer text-sm font-medium">
                u/{post.author?.username}
              </span>
              <span className="text-xs">•</span>
              <span className="text-xs">{formatDistanceToNow(new Date(post.createdAt))} ago</span>
            </div>
            {post.isSticky && (
              <Badge variant="outline" className="text-green-400 border-green-400/50 text-xs">
                Pinned
              </Badge>
            )}
          </div>
          
          {/* iPhone-optimized post title */}
          <h3 className={`font-bold text-white mb-3 hover:text-orange-300 cursor-pointer transition-colors leading-snug ${
            compact ? 'text-lg' : 'text-xl'
          }`}>
            {post.title}
          </h3>
          
          {/* iPhone-optimized post content */}
          {(!compact || isExpanded) && (
            <div className="text-zinc-300 mb-4 prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-base leading-relaxed">{post.content}</div>
            </div>
          )}
          
          {/* iPhone-optimized post actions */}
          <div className="flex items-center gap-3 text-sm text-zinc-400 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              className={`transition-colors h-10 px-3 touch-manipulation ${
                post.userVote?.voteType === 'upvote' 
                  ? 'text-red-400 hover:text-red-300 bg-red-500/10' 
                  : 'text-zinc-400 hover:text-red-400 hover:bg-red-500/10'
              }`}
              onClick={() => onLike(post.id)}
            >
              <Heart className={`h-5 w-5 mr-2 ${post.userVote?.voteType === 'upvote' ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">
                {post.karma || 0} {post.karma === 1 ? 'like' : 'likes'}
              </span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 transition-colors h-10 px-3 touch-manipulation"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">
                {showReplyForm ? 'Cancel' : 'Reply'}
              </span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 transition-colors h-10 px-3 touch-manipulation"
            >
              <Share className="h-5 w-5 mr-2" />
              <span className="text-sm">Share</span>
            </Button>
            
            {compact && !isExpanded && (
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-orange-400 transition-colors h-10 px-3 touch-manipulation"
                onClick={() => setIsExpanded(true)}
              >
                <span className="text-sm">Read more</span>
              </Button>
            )}
          </div>
          
          {/* Inline reply form */}
          {showReplyForm && (
            <div className="mt-4 p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
              <Textarea
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="mb-3 bg-zinc-800 border-zinc-600 text-white placeholder-zinc-400 min-h-[100px] resize-none"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyContent('');
                  }}
                  className="text-zinc-400 hover:text-zinc-300"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    if (replyContent.trim()) {
                      onReply(post.id, replyContent.trim());
                      setReplyContent('');
                      setShowReplyForm(false);
                    }
                  }}
                  disabled={!replyContent.trim()}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Reply
                </Button>
              </div>
            </div>
          )}
          

        </div>
      </div>
    </Card>
  );
}