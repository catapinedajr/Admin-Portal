import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Zap, Rocket, Lightbulb, Flame, Play, X, PictureInPicture, Maximize2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { usePipVideo } from '@/hooks/usePipVideo';

interface VideoPlayerProps {
  videoId: string;
  title: string;
  creator: string;
  duration: string;
  note: string;
  isOpen: boolean;
  onClose: () => void;
}

interface VideoReaction {
  type: 'mind_blown' | 'rocket' | 'lightbulb' | 'fire';
  count: number;
  userReacted: boolean;
}

interface VideoComment {
  id: number;
  content: string;
  timestamp?: number;
  username: string;
  createdAt: string;
  likeCount: number;
  userLiked: boolean;
}

interface VideoStats {
  totalViews: number;
  completionCount: number;
  completionRate: number;
  totalReactions: number;
  totalComments: number;
}

export function VideoPlayer({ videoId, title, creator, duration, note, isOpen, onClose }: VideoPlayerProps) {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [rewardEarned, setRewardEarned] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { setPipVideo } = usePipVideo();

  // Fetch video stats
  const { data: stats } = useQuery<VideoStats>({
    queryKey: [`/api/videos/${videoId}/stats`],
    enabled: isOpen,
  });

  // Fetch video reactions
  const { data: reactions } = useQuery<VideoReaction[]>({
    queryKey: [`/api/videos/${videoId}/reactions`],
    enabled: isOpen,
  });

  // Fetch video comments - always load when dialog is open
  const { data: comments } = useQuery<VideoComment[]>({
    queryKey: [`/api/videos/${videoId}/comments`],
    enabled: isOpen,
  });

  // Track video progress
  const trackProgressMutation = useMutation({
    mutationFn: async (progressData: { videoId: string; progress: number; completed: boolean }) => {
      return apiRequest('POST', '/api/videos/progress', progressData);
    },
    onSuccess: (data: any) => {
      if (data?.rewardEarned > 0) {
        setRewardEarned(data.rewardEarned);
        toast({
          title: "🎉 Video Completed!",
          description: `You earned ${data.rewardEarned} sats for completing this video!`,
          className: "bg-orange-500/20 border-orange-500/30",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/wallet/dashboard'] });
      }
    },
  });

  // Add reaction
  const addReactionMutation = useMutation({
    mutationFn: async (reactionType: string) => {
      return apiRequest('POST', '/api/videos/reactions', { videoId, reactionType });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/videos/${videoId}/reactions`] });
      queryClient.invalidateQueries({ queryKey: [`/api/videos/${videoId}/stats`] });
    },
  });

  // Add comment
  const addCommentMutation = useMutation({
    mutationFn: async (commentData: { content: string; timestamp?: number }) => {
      return apiRequest('POST', '/api/videos/comments', { videoId, ...commentData });
    },
    onSuccess: () => {
      setNewComment('');
      queryClient.invalidateQueries({ queryKey: [`/api/videos/${videoId}/comments`] });
      queryClient.invalidateQueries({ queryKey: [`/api/videos/${videoId}/stats`] });
      toast({
        title: "Comment added!",
        description: "You earned 25 sats for engaging with the community!",
      });
    },
  });

  // Like comment
  const likeCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      return apiRequest('POST', '/api/videos/comments/like', { commentId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/videos/${videoId}/comments`] });
    },
  });

  // Simulate progress tracking (in real implementation, this would come from YouTube API)
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + 1, 100);
        
        // Mark as completed at 90% progress
        if (newProgress >= 90 && !isCompleted) {
          setIsCompleted(true);
          trackProgressMutation.mutate({
            videoId,
            progress: newProgress,
            completed: true,
          });
        } else if (newProgress > prev) {
          trackProgressMutation.mutate({
            videoId,
            progress: newProgress,
            completed: false,
          });
        }
        
        return newProgress;
      });
    }, 2000); // Update every 2 seconds for demo

    return () => clearInterval(interval);
  }, [isOpen, isCompleted, videoId]);

  const handleReaction = (type: string) => {
    addReactionMutation.mutate(type);
    toast({
      title: "Reaction added!",
      description: "You earned 10 sats for reacting!",
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addCommentMutation.mutate({ content: newComment });
  };

  const togglePip = () => {
    // Set up global PIP video
    setPipVideo({
      videoId,
      title,
      creator,
      duration,
      note,
      progress,
      onClose: () => {
        onClose();
      }
    });
    // Close the main dialog to allow navigation
    onClose();
  };

  const reactionIcons = {
    mind_blown: { icon: Zap, label: "Mind Blown", color: "text-purple-400" },
    rocket: { icon: Rocket, label: "To the Moon", color: "text-orange-400" },
    lightbulb: { icon: Lightbulb, label: "Light Bulb", color: "text-yellow-400" },
    fire: { icon: Flame, label: "This is Fire", color: "text-red-400" },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl w-[95vw] h-[95vh] bg-zinc-900 border-zinc-700 p-0 overflow-hidden">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Video Section */}
          <div className="flex-1 flex flex-col">
            <DialogHeader className="p-3 lg:p-4 border-b border-zinc-700">
              <div className="flex items-start justify-between gap-2">
                <div className="flex gap-2 flex-shrink-0">
                  <Button size="sm" variant="ghost" onClick={onClose} className="bg-zinc-800 hover:bg-zinc-700">
                    <X className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={togglePip} className="flex items-center justify-center gap-1 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/50">
                    <PictureInPicture className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs">Float</span>
                  </Button>
                </div>
                <div className="flex-1 min-w-0 text-center">
                  <DialogTitle className="text-lg lg:text-xl line-clamp-2">{title}</DialogTitle>
                  <p className="text-zinc-400 text-sm">{creator} • {duration}</p>
                </div>
                <div className="w-20"></div> {/* Spacer for balance */}
              </div>
            </DialogHeader>

            {/* Video Player */}
            <div className="aspect-video bg-black flex-shrink-0">
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; encrypted-media"
              />
            </div>

            {/* Simple Reactions Bar */}
            <div className="p-3 lg:p-4 border-b border-zinc-700">
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  {reactions?.slice(0, 2).map((reaction) => {
                    const ReactionIcon = reactionIcons[reaction.type].icon;
                    return (
                      <Button
                        key={reaction.type}
                        size="sm"
                        variant={reaction.userReacted ? "secondary" : "ghost"}
                        onClick={() => handleReaction(reaction.type)}
                        className="flex items-center gap-2"
                      >
                        <ReactionIcon className={`w-4 h-4 ${reactionIcons[reaction.type].color}`} />
                        <span className="text-sm">{reaction.count}</span>
                      </Button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2">
                  {isCompleted && <span className="text-green-400 text-sm">✅ Completed</span>}
                  {rewardEarned > 0 && (
                    <span className="text-orange-400 text-sm">⚡ +{rewardEarned} sats</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section - Full Height */}
          <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-zinc-700 flex flex-col h-full">
            {/* Comments Header */}
            <div className="p-4 border-b border-zinc-700 flex-shrink-0">
              <h3 className="font-medium text-lg">Comments</h3>
              {stats && (
                <p className="text-sm text-zinc-400 mt-1">{stats.totalComments} comments</p>
              )}
            </div>

            {/* Add Comment */}
            <div className="p-4 border-b border-zinc-700 flex-shrink-0">
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-3 min-h-[100px] bg-zinc-800 border-zinc-600 resize-none"
              />
              <Button
                size="sm"
                onClick={handleAddComment}
                disabled={!newComment.trim() || addCommentMutation.isPending}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                {addCommentMutation.isPending ? "Posting..." : "Add Comment (+25 sats)"}
              </Button>
            </div>

            {/* Comments List - Maximum Space */}
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-4" 
              style={{
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'thin',
                height: '0' // Forces flex-1 to work properly
              }}
            >
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                <Card key={comment.id} className="bg-zinc-800/30 border-zinc-700">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium">{comment.username}</span>
                      <span className="text-xs text-zinc-400">
                        {new Date(comment.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-300 mb-2">{comment.content}</p>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => likeCommentMutation.mutate(comment.id)}
                        disabled={likeCommentMutation.isPending}
                        className="h-6 px-2 text-xs"
                      >
                        <Heart className={`w-3 h-3 mr-1 ${comment.userLiked ? 'fill-red-500 text-red-500' : ''}`} />
                        {comment.likeCount}
                      </Button>
                      {comment.timestamp && (
                        <span className="text-xs text-zinc-500">
                          @{Math.floor(comment.timestamp / 60)}:{(comment.timestamp % 60).toString().padStart(2, '0')}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
                ))
              ) : (
                <div className="text-center text-zinc-400 py-8">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        </div>
        </DialogContent>
      </Dialog>
  );
}