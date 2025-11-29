import { useState } from "react";
import { useLocation } from "wouter";
import { MessageSquare, Video, ArrowBigUp, MessageCircle, Clock, TrendingUp, Flame, Plus, User as UserIcon, Wallet, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BottomNavigation from "@/components/BottomNavigation";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from "@/lib/queryClient";

type CommunityTab = "forums" | "videos";
type ForumFilter = "new" | "hot" | "trending";

export default function CommunityPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<CommunityTab>("forums");

  return (
    <div className="min-h-screen bg-zinc-900">
      <header className="border-b border-zinc-800 bg-black/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setLocation('/')}
              data-testid="link-home"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-sm">
                  HL
                </div>
                <div>
                  <h1 className="text-xl font-bold">HODLearn™</h1>
                  <p className="text-xs text-zinc-400">How-to-learn BTC</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setLocation('/wallet')}
                size="sm"
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5"
                data-testid="button-wallet"
              >
                <Wallet className="w-4 h-4" />
              </Button>
              
              <Button 
                onClick={() => setLocation('/account')}
                size="sm"
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5"
                data-testid="button-account"
              >
                <UserIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 pb-24">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-2 bg-zinc-800/50 rounded-lg p-2 max-w-xs mx-auto">
              <Button
                variant={activeTab === "forums" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("forums")}
                className="text-sm px-4 py-2"
                data-testid="button-tab-forums"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Forums
              </Button>
              <Button
                variant={activeTab === "videos" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("videos")}
                className="text-sm px-4 py-2"
                data-testid="button-tab-videos"
              >
                <Video className="w-4 h-4 mr-2" />
                Expert Videos
              </Button>
            </div>
          </div>

          {activeTab === "forums" && <ForumsSection />}
          {activeTab === "videos" && <VideosSection />}
        </div>
      </main>

      <BottomNavigation 
        currentSection="connect" 
        setCurrentSection={(section) => {
          if (section === "home") setLocation('/');
          else if (section === "learn") setLocation('/learn');
          else if (section === "simulators") setLocation('/simulators');
          else if (section === "money") setLocation('/money');
          else if (section === "connect") setLocation('/community');
        }}
      />
    </div>
  );
}

function ForumsSection() {
  const [filter, setFilter] = useState<ForumFilter>("hot");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/community/forum-categories'],
  });

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['/api/community/forum-posts', filter, selectedCategory],
    queryFn: async () => {
      let url = `/api/community/forum-posts?sortBy=${filter}`;
      if (selectedCategory) url += `&categoryId=${selectedCategory}`;
      const res = await fetch(url);
      return res.json();
    }
  });

  const { data: userKarma } = useQuery({
    queryKey: ['/api/community/karma', 1],
  });

  if (selectedPost) {
    return (
      <PostDetailView 
        postId={selectedPost} 
        onBack={() => setSelectedPost(null)} 
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={filter === "hot" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter("hot")}
            className="text-xs"
            data-testid="button-filter-hot"
          >
            <Flame className="w-3 h-3 mr-1" />
            Hot
          </Button>
          <Button
            variant={filter === "new" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter("new")}
            className="text-xs"
            data-testid="button-filter-new"
          >
            <Clock className="w-3 h-3 mr-1" />
            New
          </Button>
          <Button
            variant={filter === "trending" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter("trending")}
            className="text-xs"
            data-testid="button-filter-trending"
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            Trending
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {userKarma && (
            <Badge variant="outline" className="text-orange-400 border-orange-400/30">
              {userKarma.totalKarma || 0} karma
            </Badge>
          )}
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600" data-testid="button-create-post">
                <Plus className="w-4 h-4 mr-1" />
                Post
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-700">
              <DialogHeader>
                <DialogTitle>Create a Post</DialogTitle>
              </DialogHeader>
              <CreatePostForm 
                categories={categories} 
                onSuccess={() => {
                  setIsCreateOpen(false);
                  queryClient.invalidateQueries({ queryKey: ['/api/community/forum-posts'] });
                }} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedCategory === undefined ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setSelectedCategory(undefined)}
          className="text-xs"
          data-testid="button-category-all"
        >
          All
        </Button>
        {categories.map((cat: any) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSelectedCategory(cat.id)}
            className="text-xs"
            data-testid={`button-category-${cat.slug}`}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="bg-zinc-800/30 border-zinc-700 animate-pulse">
              <CardContent className="p-4 h-24" />
            </Card>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Card className="bg-zinc-800/30 border-zinc-700">
          <CardContent className="p-8 text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
            <p className="text-zinc-400">No posts yet. Be the first to start a discussion!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {posts.map((post: any) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onClick={() => setSelectedPost(post.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PostCard({ post, onClick }: { post: any; onClick: () => void }) {
  const queryClient = useQueryClient();
  
  const upvoteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/community/forum-posts/${post.id}/upvote`, {
        method: 'POST',
        body: JSON.stringify({ bitcoinPriceUsd: 100000 }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community/forum-posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/community/karma'] });
    }
  });

  const hasVoted = !!post.userVote;
  const upvotes = post.stats?.upvotes || post.karma || 0;
  const timeAgo = formatTimeAgo(post.createdAt);

  return (
    <Card 
      className="bg-zinc-800/30 border-zinc-700 hover:border-zinc-600 transition-colors cursor-pointer"
      data-testid={`card-post-${post.id}`}
    >
      <CardContent className="p-0">
        <div className="flex">
          <div 
            className="flex flex-col items-center py-3 px-3 bg-zinc-800/50 rounded-l-lg"
            onClick={(e) => {
              e.stopPropagation();
              if (!hasVoted) upvoteMutation.mutate();
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              className={`p-1 h-auto ${hasVoted ? 'text-orange-500' : 'text-zinc-400 hover:text-orange-400'}`}
              disabled={hasVoted || upvoteMutation.isPending}
              data-testid={`button-upvote-${post.id}`}
            >
              <ArrowBigUp className={`w-5 h-5 ${hasVoted ? 'fill-orange-500' : ''}`} />
            </Button>
            <span className={`text-sm font-medium ${hasVoted ? 'text-orange-500' : 'text-zinc-300'}`}>
              {upvotes}
            </span>
          </div>

          <div className="flex-1 p-3" onClick={onClick}>
            <div className="flex items-center gap-2 mb-1 text-xs text-zinc-500">
              {post.category && (
                <Badge variant="outline" className="text-xs py-0">
                  {post.category.name}
                </Badge>
              )}
              <span>Posted by {post.author?.username || 'Anonymous'}</span>
              <span>•</span>
              <span>{timeAgo}</span>
            </div>
            
            <h3 className="font-semibold text-white mb-1 line-clamp-2">{post.title}</h3>
            
            {post.content && (
              <p className="text-sm text-zinc-400 line-clamp-2">{post.content}</p>
            )}

            <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                {post.replyCount || 0} replies
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PostDetailView({ postId, onBack }: { postId: number; onBack: () => void }) {
  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ['/api/community/forum-posts', postId, 'detail'],
    queryFn: async () => {
      const res = await fetch(`/api/community/forum-posts?postId=${postId}`);
      const posts = await res.json();
      return posts[0];
    }
  });

  const { data: replies = [], isLoading: repliesLoading } = useQuery({
    queryKey: ['/api/community/forum-posts', postId, 'replies'],
    queryFn: async () => {
      const res = await fetch(`/api/community/forum-posts/${postId}/replies`);
      return res.json();
    }
  });

  const replyMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/community/forum-posts/${postId}/replies`, {
        method: 'POST',
        body: JSON.stringify({ 
          content: replyContent,
          parentReplyId: replyingTo 
        }),
      });
    },
    onSuccess: () => {
      setReplyContent("");
      setReplyingTo(null);
      queryClient.invalidateQueries({ queryKey: ['/api/community/forum-posts', postId, 'replies'] });
    }
  });

  const upvotePostMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/community/forum-posts/${postId}/upvote`, {
        method: 'POST',
        body: JSON.stringify({ bitcoinPriceUsd: 100000 }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community/forum-posts'] });
    }
  });

  if (postLoading) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <Card className="bg-zinc-800/30 border-zinc-700 animate-pulse">
          <CardContent className="p-6 h-48" />
        </Card>
      </div>
    );
  }

  const hasVoted = !!post?.userVote;
  const upvotes = post?.stats?.upvotes || post?.karma || 0;

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack} data-testid="button-back">
        ← Back to forums
      </Button>

      <Card className="bg-zinc-800/30 border-zinc-700">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="sm"
                className={`p-1 h-auto ${hasVoted ? 'text-orange-500' : 'text-zinc-400 hover:text-orange-400'}`}
                onClick={() => !hasVoted && upvotePostMutation.mutate()}
                disabled={hasVoted || upvotePostMutation.isPending}
                data-testid="button-upvote-post"
              >
                <ArrowBigUp className={`w-6 h-6 ${hasVoted ? 'fill-orange-500' : ''}`} />
              </Button>
              <span className={`text-lg font-bold ${hasVoted ? 'text-orange-500' : 'text-zinc-300'}`}>
                {upvotes}
              </span>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 text-xs text-zinc-500">
                {post?.category && (
                  <Badge variant="outline">{post.category.name}</Badge>
                )}
                <span>Posted by {post?.author?.username || 'Anonymous'}</span>
                <span>•</span>
                <span>{formatTimeAgo(post?.createdAt)}</span>
              </div>
              
              <h2 className="text-xl font-bold mb-3">{post?.title}</h2>
              <p className="text-zinc-300 whitespace-pre-wrap">{post?.content}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-800/50 border-zinc-700">
        <CardContent className="p-4">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder={replyingTo ? "Write a reply..." : "What are your thoughts?"}
            className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-sm resize-none focus:outline-none focus:border-orange-500 transition-colors"
            rows={3}
            data-testid="input-reply"
          />
          <div className="flex justify-between items-center mt-2">
            {replyingTo && (
              <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                Cancel reply
              </Button>
            )}
            <div className="ml-auto">
              <Button 
                onClick={() => replyMutation.mutate()}
                disabled={!replyContent.trim() || replyMutation.isPending}
                className="bg-orange-500 hover:bg-orange-600"
                data-testid="button-submit-reply"
              >
                <Send className="w-4 h-4 mr-2" />
                {replyMutation.isPending ? 'Posting...' : 'Reply'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-zinc-400">
          {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
        </h3>
        
        {repliesLoading ? (
          <Card className="bg-zinc-800/30 border-zinc-700 animate-pulse">
            <CardContent className="p-4 h-20" />
          </Card>
        ) : replies.length === 0 ? (
          <Card className="bg-zinc-800/30 border-zinc-700">
            <CardContent className="p-6 text-center text-zinc-500">
              No replies yet. Be the first to respond!
            </CardContent>
          </Card>
        ) : (
          replies.map((reply: any) => (
            <ReplyCard 
              key={reply.id} 
              reply={reply} 
              onReply={() => setReplyingTo(reply.id)}
              postId={postId}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ReplyCard({ reply, onReply, postId }: { reply: any; onReply: () => void; postId: number }) {
  const queryClient = useQueryClient();
  
  const upvoteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/community/forum-replies/${reply.id}/upvote`, {
        method: 'POST',
        body: JSON.stringify({ bitcoinPriceUsd: 100000 }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community/forum-posts', postId, 'replies'] });
    }
  });

  const hasVoted = !!reply.userVote;
  const upvotes = reply.stats?.upvotes || reply.karma || 0;
  const depth = reply.stats?.depth || 0;

  return (
    <Card 
      className="bg-zinc-800/20 border-zinc-700/50"
      style={{ marginLeft: `${Math.min(depth * 20, 60)}px` }}
      data-testid={`card-reply-${reply.id}`}
    >
      <CardContent className="p-3">
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="sm"
              className={`p-0.5 h-auto ${hasVoted ? 'text-orange-500' : 'text-zinc-500 hover:text-orange-400'}`}
              onClick={() => !hasVoted && upvoteMutation.mutate()}
              disabled={hasVoted || upvoteMutation.isPending}
              data-testid={`button-upvote-reply-${reply.id}`}
            >
              <ArrowBigUp className={`w-4 h-4 ${hasVoted ? 'fill-orange-500' : ''}`} />
            </Button>
            <span className={`text-xs ${hasVoted ? 'text-orange-500' : 'text-zinc-400'}`}>
              {upvotes}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
              <span className="font-medium text-zinc-400">{reply.author?.username || 'Anonymous'}</span>
              <span>•</span>
              <span>{formatTimeAgo(reply.createdAt)}</span>
            </div>
            
            <p className="text-sm text-zinc-300">{reply.content}</p>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-zinc-500 hover:text-zinc-300 mt-1 p-0 h-auto"
              onClick={onReply}
            >
              Reply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CreatePostForm({ categories, onSuccess }: { categories: any[]; onSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");

  const createMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/community/forum-posts', {
        method: 'POST',
        body: JSON.stringify({ 
          title, 
          content, 
          categoryId: parseInt(categoryId) 
        }),
      });
    },
    onSuccess
  });

  return (
    <div className="space-y-4">
      <Select value={categoryId} onValueChange={setCategoryId}>
        <SelectTrigger className="bg-zinc-800 border-zinc-700" data-testid="select-category">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-zinc-700">
          {categories.map((cat: any) => (
            <SelectItem key={cat.id} value={cat.id.toString()}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500"
        data-testid="input-title"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind? (optional)"
        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg resize-none focus:outline-none focus:border-orange-500"
        rows={5}
        data-testid="input-content"
      />

      <Button 
        onClick={() => createMutation.mutate()}
        disabled={!title.trim() || !categoryId || createMutation.isPending}
        className="w-full bg-orange-500 hover:bg-orange-600"
        data-testid="button-submit-post"
      >
        {createMutation.isPending ? 'Creating...' : 'Create Post'}
      </Button>
    </div>
  );
}

function VideosSection() {
  const [activeCategory, setActiveCategory] = useState("foundation");
  
  const videoCategories: Record<string, { title: string; description: string; videos: Array<{ title: string; creator: string; duration: string; note: string; url: string }> }> = {
    foundation: {
      title: "Foundation Level",
      description: "Getting Started & Core Concepts",
      videos: [
        {
          title: "Introduction to Bitcoin",
          creator: "Andreas Antonopoulos",
          duration: "30 mins",
          note: "This is where my journey started - perfect entry point",
          url: "https://www.youtube.com/watch?v=l1si5ZWLgy0"
        },
        {
          title: "Bitcoin on Lex Fridman",
          creator: "Michael Saylor",
          duration: "20 min segments",
          note: "4-hour masterclass broken into digestible parts",
          url: "https://www.youtube.com/watch?v=mC43pZkpTec"
        },
        {
          title: "What is Money? (Part 1)",
          creator: "Saifedean Ammous",
          duration: "25 mins",
          note: "Essential economic foundation before diving into Bitcoin",
          url: "https://www.youtube.com/watch?v=1WBrdLQhUrg"
        },
        {
          title: "21 Lessons Introduction",
          creator: "Gigi",
          duration: "20 mins",
          note: "Philosophy meets practicality - changed my perspective",
          url: "https://www.youtube.com/watch?v=F-EHF8oFyLE"
        }
      ]
    },
    economics: {
      title: "Economics & Macro",
      description: "Understanding the Why",
      videos: [
        {
          title: "What is Money? Episode 1",
          creator: "Saylor & Breedlove",
          duration: "45 mins",
          note: "Deep dive that solidified my conviction",
          url: "https://www.youtube.com/watch?v=Vp7Q_3E_gzU"
        },
        {
          title: "Bitcoin vs Gold",
          creator: "Lyn Alden",
          duration: "30 mins",
          note: "Best comparison of store of value assets",
          url: "https://www.youtube.com/watch?v=VdPkpxmN9g4"
        },
        {
          title: "AI, Deflation, and Bitcoin",
          creator: "Jeff Booth",
          duration: "25 mins",
          note: "Future economics explained brilliantly",
          url: "https://www.youtube.com/watch?v=O3hq2vIhtz8"
        }
      ]
    },
    technical: {
      title: "Technical & Advanced",
      description: "How Bitcoin Works",
      videos: [
        {
          title: "How Bitcoin Works",
          creator: "Andreas Antonopoulos",
          duration: "40 mins",
          note: "Technical concepts made accessible",
          url: "https://www.youtube.com/watch?v=l1si5ZWLgy0"
        },
        {
          title: "Lightning Network Explained",
          creator: "Andreas Antonopoulos",
          duration: "25 mins",
          note: "Scaling solution that makes sense",
          url: "https://www.youtube.com/watch?v=rrr_zPmEiME"
        },
        {
          title: "Self-Custody Basics",
          creator: "Andreas Antonopoulos",
          duration: "20 mins",
          note: "Not your keys, not your Bitcoin - essential",
          url: "https://www.youtube.com/watch?v=F12lpqnug-0"
        }
      ]
    },
    realworld: {
      title: "Real World & Future",
      description: "Bitcoin in Practice",
      videos: [
        {
          title: "Bitcoin in El Salvador",
          creator: "Alex Gladstein",
          duration: "25 mins",
          note: "Nation-state adoption lessons learned",
          url: "https://www.youtube.com/watch?v=xLYYh4aPXAM"
        },
        {
          title: "Hyper-Bitcoinized World",
          creator: "Jeff Booth",
          duration: "30 mins",
          note: "What happens when Bitcoin wins",
          url: "https://www.youtube.com/watch?v=O3hq2vIhtz8"
        }
      ]
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Expert Videos</h2>
        <p className="text-zinc-400 text-sm">Curated Bitcoin education from trusted voices</p>
      </div>

      <div className="flex justify-center">
        <div className="flex flex-wrap justify-center gap-2 bg-zinc-800/50 rounded-lg p-2 max-w-2xl">
          {Object.entries(videoCategories).map(([key, category]) => (
            <Button
              key={key}
              variant={activeCategory === key ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveCategory(key)}
              className="text-xs px-3 py-1.5"
              data-testid={`button-video-category-${key}`}
            >
              {category.title}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-1">{videoCategories[activeCategory].title}</h3>
          <p className="text-zinc-400 text-sm">{videoCategories[activeCategory].description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {videoCategories[activeCategory].videos.map((video, index) => (
            <Card 
              key={index} 
              className="bg-zinc-800/30 border-zinc-700 hover:border-orange-500/30 hover:bg-zinc-800/50 transition-all duration-300 cursor-pointer group"
              data-testid={`card-video-${index}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Video className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white group-hover:text-orange-400 transition-colors mb-1 line-clamp-2">
                      {video.title}
                    </h4>
                    <p className="text-zinc-400 text-sm mb-2">
                      {video.creator} • {video.duration}
                    </p>
                    <div className="bg-zinc-900/50 p-2 rounded text-xs text-zinc-300 italic mb-3">
                      "{video.note}"
                    </div>
                    <Button 
                      onClick={() => window.open(video.url, '_blank')}
                      size="sm"
                      className="bg-orange-500/20 hover:bg-orange-500 text-orange-400 hover:text-white border border-orange-500/30 hover:border-orange-500 text-xs px-3 py-1"
                      data-testid={`button-watch-${index}`}
                    >
                      Watch Video
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return past.toLocaleDateString();
}
