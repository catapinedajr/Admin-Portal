import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Zap, Rocket, Lightbulb, Flame, Play, X, PictureInPicture, Maximize2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

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
  const [isPip, setIsPip] = useState(false);
  const [rewardEarned, setRewardEarned] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  // Fetch video comments
  const { data: comments } = useQuery<VideoComment[]>({
    queryKey: [`/api/videos/${videoId}/comments`],
    enabled: isOpen && showComments,
  });

  // Track video progress
  const trackProgressMutation = useMutation({
    mutationFn: async (progressData: { videoId: string; progress: number; completed: boolean }) => {
      return apiRequest('/api/videos/progress', 'POST', progressData);
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
      return apiRequest('/api/videos/reactions', 'POST', { videoId, reactionType });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/videos/${videoId}/reactions`] });
      queryClient.invalidateQueries({ queryKey: [`/api/videos/${videoId}/stats`] });
    },
  });

  // Add comment
  const addCommentMutation = useMutation({
    mutationFn: async (commentData: { content: string; timestamp?: number }) => {
      return apiRequest('/api/videos/comments', 'POST', { videoId, ...commentData });
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
      return apiRequest('/api/videos/comments/like', 'POST', { commentId });
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
    setIsPip(!isPip);
  };

  const reactionIcons = {
    mind_blown: { icon: Zap, label: "Mind Blown", color: "text-purple-400" },
    rocket: { icon: Rocket, label: "To the Moon", color: "text-orange-400" },
    lightbulb: { icon: Lightbulb, label: "Light Bulb", color: "text-yellow-400" },
    fire: { icon: Flame, label: "This is Fire", color: "text-red-400" },
  };

  if (isPip) {
    return (
      <div className="fixed bottom-4 right-4 w-80 h-48 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl z-50 overflow-hidden">
        <div className="relative h-32">
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; encrypted-media"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => setIsPip(false)} className="h-6 w-6 p-0 bg-black/50 hover:bg-black/70">
              <Maximize2 className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onClose} className="h-6 w-6 p-0 bg-black/50 hover:bg-black/70">
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <div className="p-2">
          <h4 className="text-sm font-medium text-white truncate">{title}</h4>
          <p className="text-xs text-zinc-400">{creator} • {Math.round(progress)}% watched</p>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] bg-zinc-900 border-zinc-700 p-0 overflow-hidden">
        <div className="flex h-full">
          {/* Video Section */}
          <div className="flex-1">
            <DialogHeader className="p-4 border-b border-zinc-700">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl">{title}</DialogTitle>
                  <p className="text-zinc-400 text-sm">{creator} • {duration}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={togglePip}>
                    <PictureInPicture className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={onClose}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </DialogHeader>

            {/* Video Player */}
            <div className="aspect-video bg-black">
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; encrypted-media"
              />
            </div>

            {/* Progress & Reactions */}
            <div className="p-4 border-b border-zinc-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm text-zinc-400">Progress: {Math.round(progress)}%</span>
                    {isCompleted && <span className="text-green-400 text-sm">✅ Completed</span>}
                    {rewardEarned > 0 && (
                      <span className="text-orange-400 text-sm">⚡ +{rewardEarned} sats</span>
                    )}
                  </div>
                  <div className="w-full bg-zinc-700 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Reactions */}
              <div className="flex items-center gap-4">
                {reactions?.map((reaction) => {
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
                      <span>{reaction.count}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Personal Note */}
            <div className="p-4 bg-zinc-800/50 border-b border-zinc-700">
              <h4 className="text-sm font-medium mb-2">Why I chose this video:</h4>
              <p className="text-sm text-zinc-300 italic">"{note}"</p>
            </div>
          </div>

          {/* Comments Sidebar */}
          <div className="w-80 border-l border-zinc-700 flex flex-col">
            <div className="p-4 border-b border-zinc-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Discussion</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowComments(!showComments)}
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
              {stats && (
                <div className="text-xs text-zinc-400 space-y-1">
                  <div>{stats.totalViews} views • {stats.completionCount} completed</div>
                  <div>{stats.completionRate}% completion rate</div>
                </div>
              )}
            </div>

            {/* Add Comment */}
            <div className="p-4 border-b border-zinc-700">
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-2 min-h-[80px] bg-zinc-800 border-zinc-600"
              />
              <Button
                size="sm"
                onClick={handleAddComment}
                disabled={!newComment.trim() || addCommentMutation.isPending}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                Add Comment (+25 sats)
              </Button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments?.map((comment) => (
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
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}