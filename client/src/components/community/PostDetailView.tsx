import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Heart, MessageSquare, Share, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import type { ForumPostWithStats } from '@shared/schema';

interface PostDetailViewProps {
  post: ForumPostWithStats;
  discussions: any[]; // TODO: Type this properly when we have discussions
  onBack: () => void;
  onLike: (postId: number) => void;
  onReply: (postId: number, content: string) => void;
}

export function PostDetailView({ 
  post, 
  discussions = [], 
  onBack, 
  onLike, 
  onReply 
}: PostDetailViewProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply(post.id, replyContent.trim());
      setReplyContent('');
      setShowReplyForm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to {post.category?.name}
        </Button>
      </div>

      {/* Main post */}
      <Card className="bg-black border-zinc-700/50">
        <div className="p-6">
          {/* Post metadata */}
          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-4 flex-wrap">
            <Badge variant="secondary" className="bg-orange-500/10 text-orange-300 border-orange-500/20">
              {post.category?.name}
            </Badge>
            {post.dayIndex && (
              <Badge variant="outline" className="text-blue-400 border-blue-500/30 bg-blue-500/5">
                Day {post.dayIndex}
              </Badge>
            )}
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-orange-400 font-medium">u/{post.author?.username}</span>
              <span>•</span>
              <Clock className="h-3 w-3" />
              <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
            </div>
          </div>

          {/* Post title */}
          <h1 className="text-2xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Post content */}
          <div className="text-zinc-300 mb-6 prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-base leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* Post actions */}
          <div className="flex items-center gap-4 text-sm text-zinc-400 pb-4 border-b border-zinc-700">
            <Button
              variant="ghost"
              size="sm"
              className={`transition-colors h-10 px-3 ${
                post.userVote?.voteType === 'upvote' 
                  ? 'text-red-400 hover:text-red-300 bg-red-500/10' 
                  : 'text-zinc-400 hover:text-red-400 hover:bg-red-500/10'
              }`}
              onClick={() => onLike(post.id)}
            >
              <Heart className={`h-5 w-5 mr-2 ${post.userVote?.voteType === 'upvote' ? 'fill-current' : ''}`} />
              <span className="font-medium">
                {post.karma || 0} {post.karma === 1 ? 'like' : 'likes'}
              </span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 transition-colors h-10 px-3"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              <span className="font-medium">
                {showReplyForm ? 'Cancel Reply' : 'Reply'}
              </span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 transition-colors h-10 px-3"
            >
              <Share className="h-5 w-5 mr-2" />
              <span>Share</span>
            </Button>
          </div>

          {/* Inline reply form */}
          {showReplyForm && (
            <div className="mt-6 p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
              <div className="text-sm text-zinc-400 mb-3">
                Replying to <span className="text-orange-400">u/{post.author?.username}</span>
              </div>
              <Textarea
                placeholder="Share your thoughts..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="mb-3 bg-zinc-800 border-zinc-600 text-white placeholder-zinc-400 min-h-[120px] resize-none"
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
                  onClick={handleSubmitReply}
                  disabled={!replyContent.trim()}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Post Reply
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Discussions section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            Discussions ({discussions.length})
          </h2>
        </div>

        {discussions.length === 0 ? (
          <Card className="bg-zinc-900/30 border-zinc-700/30 p-8 text-center">
            <div className="text-zinc-400">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No discussions yet</h3>
              <p className="text-sm mb-4">Be the first to share your thoughts on this post!</p>
              <Button
                onClick={() => setShowReplyForm(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Start Discussion
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {discussions.map((discussion, index) => (
              <Card key={index} className="bg-zinc-800/30 border-zinc-700/50 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
                      <span className="text-orange-400 font-medium">u/username</span>
                      <span>•</span>
                      <span>2 minutes ago</span>
                    </div>
                    <div className="text-zinc-300 text-sm">
                      This would be discussion content...
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}