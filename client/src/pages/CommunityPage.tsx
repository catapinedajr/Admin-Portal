import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { MessageSquare, Video, ArrowBigUp, MessageCircle, Clock, TrendingUp, Flame, Plus, User as UserIcon, Wallet, Send, ChevronDown, ChevronUp, ExternalLink, Megaphone, Filter, Image, Link2, X, Loader2, Share2, ArrowLeft, Reply, Trophy, Medal, Crown, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import BottomNavigation from "@/components/BottomNavigation";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from "@/lib/queryClient";

type CommunityTab = "forums" | "videos" | "leaderboard";
type ForumFilter = "new" | "hot" | "trending";

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function YouTubeEmbed({ videoId, title }: { videoId: string; title?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  if (isPlaying) {
    return (
      <div 
        className="relative w-full aspect-video rounded-lg overflow-hidden bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title || "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  return (
    <div 
      className="relative w-full aspect-video rounded-lg overflow-hidden bg-zinc-900 cursor-pointer group"
      onClick={(e) => {
        e.stopPropagation();
        setIsPlaying(true);
      }}
    >
      <img 
        src={thumbnailUrl}
        alt={title || "Video thumbnail"}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-white ml-1" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-xs text-white flex items-center gap-1">
        <Video className="w-3 h-3" />
        YouTube
      </div>
    </div>
  );
}

interface SponsoredPost {
  id: number | string;
  campaignId?: number;
  advertiser: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  imageUrl?: string;
  logoUrl?: string;
  category?: string;
  placement?: string;
}

const FALLBACK_ADS: SponsoredPost[] = [
  {
    id: "fallback-1",
    advertiser: "Trezor",
    title: "Secure Your Bitcoin with Hardware Wallets",
    description: "Industry-leading cold storage for your BTC. Take full control of your private keys.",
    ctaText: "Learn More",
    ctaUrl: "https://trezor.io",
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop",
    logoUrl: "",
    category: "Security"
  },
  {
    id: "fallback-2", 
    advertiser: "Swan Bitcoin",
    title: "Stack Sats Automatically",
    description: "Set up recurring Bitcoin purchases. Dollar-cost averaging made simple.",
    ctaText: "Start Stacking",
    ctaUrl: "https://swanbitcoin.com",
    imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=200&fit=crop",
    logoUrl: "",
    category: "Getting Started"
  },
  {
    id: "fallback-3",
    advertiser: "Unchained Capital",
    title: "Bitcoin-Backed Loans",
    description: "Access liquidity without selling your BTC. Collaborative custody solutions.",
    ctaText: "Explore Options",
    ctaUrl: "https://unchained.com",
    imageUrl: "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=200&fit=crop",
    logoUrl: "",
    category: "Finance"
  }
];

const AD_INSERTION_INTERVAL = 5;

function getSessionId() {
  let sessionId = sessionStorage.getItem('ad_session_id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem('ad_session_id', sessionId);
  }
  return sessionId;
}

export default function CommunityPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<CommunityTab>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam === 'leaderboard' || tabParam === 'videos' || tabParam === 'forums') {
      return tabParam as CommunityTab;
    }
    return "forums";
  });

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
        <div className="space-y-4">
          {/* Community Tagline */}
          <p className="text-center text-sm text-zinc-500 tracking-wide">
            Conviction in Community
          </p>

          {/* Tab Navigation */}
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-2 bg-zinc-800/50 rounded-lg p-1.5 max-w-md mx-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("forums")}
                className={`text-sm px-3 py-2 ${activeTab === "forums" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "text-zinc-400 hover:text-white"}`}
                data-testid="button-tab-forums"
              >
                <MessageSquare className="w-4 h-4 mr-1.5" />
                Forums
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("videos")}
                className={`text-sm px-3 py-2 ${activeTab === "videos" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "text-zinc-400 hover:text-white"}`}
                data-testid="button-tab-videos"
              >
                <Video className="w-4 h-4 mr-1.5" />
                Videos
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("leaderboard")}
                className={`text-sm px-3 py-2 ${activeTab === "leaderboard" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "text-zinc-400 hover:text-white"}`}
                data-testid="button-tab-leaderboard"
              >
                <Trophy className="w-4 h-4 mr-1.5" />
                Rankings
              </Button>
            </div>
          </div>

          {activeTab === "forums" && <ForumsSection />}
          {activeTab === "videos" && <VideosSection />}
          {activeTab === "leaderboard" && <LeaderboardSection />}
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
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/community/forum-categories'],
  });

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['/api/community/forum-posts', filter, selectedCategory, selectedTag],
    queryFn: async () => {
      let url = `/api/community/forum-posts?sortBy=${filter}`;
      if (selectedCategory) url += `&categoryId=${selectedCategory}`;
      if (selectedTag) url += `&flair=${selectedTag}`;
      const res = await fetch(url);
      return res.json();
    }
  });

  const { data: userKarma } = useQuery({
    queryKey: ['/api/community/karma', 1],
  });

  const { data: activeAds = [] } = useQuery<SponsoredPost[]>({
    queryKey: ['/api/ads/active'],
    queryFn: async () => {
      const res = await fetch('/api/ads/active?placement=in_feed');
      if (!res.ok) return [];
      return res.json();
    }
  });

  const adsToShow = activeAds.length > 0 ? activeAds : FALLBACK_ADS;

  if (selectedPost) {
    return (
      <PostDetailView 
        postId={selectedPost} 
        onBack={() => setSelectedPost(null)} 
      />
    );
  }

  return (
    <div className="space-y-3">
      {/* Full-width filter bar */}
      <div className="flex items-center justify-between gap-3 bg-zinc-800/30 rounded-xl p-2 border border-zinc-700/50">
        {/* Left side: Sort buttons */}
        <div className="flex items-center gap-1 bg-zinc-800/80 rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilter("hot")}
            className={`text-xs h-8 px-3 gap-1.5 ${filter === "hot" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "text-zinc-400 hover:text-white"}`}
            data-testid="button-filter-hot"
          >
            <Flame className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hot</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilter("new")}
            className={`text-xs h-8 px-3 gap-1.5 ${filter === "new" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "text-zinc-400 hover:text-white"}`}
            data-testid="button-filter-new"
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilter("trending")}
            className={`text-xs h-8 px-3 gap-1.5 ${filter === "trending" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "text-zinc-400 hover:text-white"}`}
            data-testid="button-filter-trending"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Top</span>
          </Button>
        </div>

        {/* Center: Filter dropdowns */}
        <div className="flex items-center gap-2 flex-1 justify-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className={`text-xs h-8 px-3 ${selectedCategory !== undefined ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "border-zinc-600 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300"}`}
                data-testid="button-filter-topics"
              >
                <Filter className="w-3.5 h-3.5 mr-1.5" />
                <span className="truncate max-w-[70px] sm:max-w-[100px]">
                  {selectedCategory === undefined 
                    ? "All Topics" 
                    : categories.find((c: any) => c.id === selectedCategory)?.name || "Topics"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1 bg-zinc-800 border-zinc-700" align="center">
              <div className="flex flex-col">
                <Button
                  variant={selectedCategory === undefined ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(undefined)}
                  className="justify-start text-xs h-8"
                  data-testid="button-category-all"
                >
                  All Topics
                </Button>
                {categories.map((cat: any) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                    className="justify-start text-xs h-8"
                    data-testid={`button-category-${cat.slug}`}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className={`text-xs h-8 px-3 ${selectedTag ? getTagStyle(selectedTag) : "border-zinc-600 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300"}`}
                data-testid="button-filter-tag"
              >
                <span className="truncate max-w-[50px] sm:max-w-[80px]">
                  {selectedTag 
                    ? selectedTag.charAt(0).toUpperCase() + selectedTag.slice(1)
                    : "Tag"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-1 bg-zinc-800 border-zinc-700" align="center">
              <div className="flex flex-col">
                <Button
                  variant={selectedTag === undefined ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedTag(undefined)}
                  className="justify-start text-xs h-8"
                  data-testid="button-tag-all"
                >
                  All Tags
                </Button>
                {TAG_OPTIONS.map((t) => (
                  <Button
                    key={t.value}
                    variant={selectedTag === t.value ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedTag(t.value)}
                    className="justify-start text-xs h-8"
                    data-testid={`button-tag-${t.value}`}
                  >
                    <span className={`w-2 h-2 rounded-full mr-2 ${t.color}`} />
                    {t.label}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Right side: Karma + Create */}
        <div className="flex items-center gap-2">
          {userKarma && (
            <Badge variant="outline" className="text-orange-400 border-orange-500/30 bg-orange-500/10 text-xs px-2 h-8 flex items-center">
              {userKarma.totalKarma || 0}
            </Badge>
          )}
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 h-8 px-3 gap-1.5" data-testid="button-create-post">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Post</span>
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

      {isLoading ? (
        <div>
          {[1, 2, 3].map(i => (
            <div key={i} className={`animate-pulse ${i < 3 ? 'border-b border-zinc-800' : ''}`}>
              <div className="px-4 py-3 space-y-2">
                <div className="h-3 bg-zinc-800 rounded w-1/3" />
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-zinc-800 rounded w-1/2" />
              </div>
              <div className="flex gap-2 px-2 pb-2">
                <div className="h-9 w-16 bg-zinc-800 rounded-full" />
                <div className="h-9 w-14 bg-zinc-800 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="py-12 text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
          <p className="text-zinc-400">No posts yet. Be the first to start a discussion!</p>
        </div>
      ) : (
        <div>
          {posts.map((post: any, index: number) => {
            const elements = [];
            const isLastPost = index === posts.length - 1;
            
            elements.push(
              <PostCard 
                key={post.id} 
                post={post} 
                onClick={() => setSelectedPost(post.id)}
                isLast={isLastPost && adsToShow.length === 0}
              />
            );
            
            if ((index + 1) % AD_INSERTION_INTERVAL === 0 && index < posts.length - 1 && adsToShow.length > 0) {
              const adIndex = Math.floor(index / AD_INSERTION_INTERVAL) % adsToShow.length;
              elements.push(
                <SponsoredPostCard 
                  key={`ad-after-${post.id}`}
                  ad={adsToShow[adIndex]}
                />
              );
            }
            
            return elements;
          })}
        </div>
      )}
    </div>
  );
}

function getTagStyle(tag: string) {
  const styles: Record<string, string> = {
    discussion: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    question: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    video: 'bg-red-500/20 text-red-400 border-red-500/30',
    article: 'bg-green-500/20 text-green-400 border-green-500/30',
    meme: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    security: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    news: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    chart: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  };
  return styles[tag] || 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
}

function PostCard({ post, onClick, isLast }: { post: any; onClick: () => void; isLast?: boolean }) {
  const queryClient = useQueryClient();
  
  const upvoteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', `/api/community/forum-posts/${post.id}/upvote`, { bitcoinPriceUsd: 100000 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community/forum-posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/community/karma'] });
    }
  });

  const hasVoted = !!post.userVote;
  const upvotes = post.stats?.upvotes || post.karma || 0;
  const timeAgo = formatTimeAgo(post.createdAt);
  const linkPreview = post.linkPreview as LinkPreview | null;
  const youtubeId = post.linkUrl ? extractYouTubeId(post.linkUrl) : null;
  const hasMedia = post.imageUrl || youtubeId || linkPreview?.image;

  return (
    <div 
      className={`cursor-pointer hover:bg-zinc-800/20 transition-colors ${!isLast ? 'border-b border-zinc-800' : ''}`}
      data-testid={`card-post-${post.id}`}
    >
      <div className="px-4 py-3" onClick={onClick}>
        <div className="flex items-center gap-1.5 mb-1.5 text-xs text-zinc-500">
          {post.flair && (
            <Badge variant="outline" className={`text-[10px] py-0 px-1.5 h-4 ${getTagStyle(post.flair)}`}>
              {post.flair.charAt(0).toUpperCase() + post.flair.slice(1)}
            </Badge>
          )}
          {post.category && (
            <span className="text-zinc-500">{post.category.name}</span>
          )}
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400">{post.author?.username || 'Anonymous'}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-500">{timeAgo}</span>
        </div>
        
        <h3 className="font-medium text-white text-[15px] leading-snug line-clamp-2">{post.title}</h3>
        
        {post.content && !hasMedia && (
          <p className="text-sm text-zinc-400 line-clamp-3 mt-1">{post.content}</p>
        )}

        {post.imageUrl && (
          <div className="mt-3">
            <img 
              src={post.imageUrl} 
              alt="" 
              className="w-full aspect-video object-cover rounded-lg"
              onError={(e) => e.currentTarget.style.display = 'none'}
            />
          </div>
        )}

        {youtubeId && !post.imageUrl && (
          <div className="mt-3">
            <YouTubeEmbed videoId={youtubeId} title={post.title} />
          </div>
        )}

        {linkPreview && !post.imageUrl && !youtubeId && (
          <div className="mt-3 rounded-lg border border-zinc-700/50 overflow-hidden bg-zinc-800/30">
            {linkPreview.image && (
              <img 
                src={linkPreview.image} 
                alt="" 
                className="w-full aspect-video object-cover"
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
            )}
            <div className="p-2.5">
              <p className="text-[11px] text-zinc-500 truncate">{linkPreview.siteName}</p>
              <p className="text-sm font-medium text-zinc-300 line-clamp-2">{linkPreview.title}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 px-2 pb-2">
        <Button
          variant="ghost"
          size="sm"
          className={`h-9 px-3 gap-1.5 rounded-full ${hasVoted ? 'text-orange-500 bg-orange-500/10' : 'text-zinc-400 hover:text-orange-400 hover:bg-zinc-800'}`}
          disabled={hasVoted || upvoteMutation.isPending}
          onClick={(e) => {
            e.stopPropagation();
            if (!hasVoted) upvoteMutation.mutate();
          }}
          data-testid={`button-upvote-${post.id}`}
        >
          <ArrowBigUp className={`w-5 h-5 ${hasVoted ? 'fill-orange-500' : ''}`} />
          <span className="text-sm font-medium">{upvotes}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-3 gap-1.5 rounded-full text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800"
          onClick={onClick}
          data-testid={`button-comments-${post.id}`}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">{post.replyCount || 0}</span>
        </Button>

        {post.linkUrl && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-3 gap-1.5 rounded-full text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800"
            onClick={(e) => {
              e.stopPropagation();
              window.open(post.linkUrl, '_blank');
            }}
            data-testid={`button-link-${post.id}`}
          >
            <Link2 className="w-4 h-4" />
            <span className="text-sm">Link</span>
          </Button>
        )}
      </div>
    </div>
  );
}

function SponsoredPostCard({ ad }: { ad: SponsoredPost }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const hasTrackedImpression = useRef(false);
  
  useEffect(() => {
    if (!cardRef.current || hasTrackedImpression.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTrackedImpression.current) {
            hasTrackedImpression.current = true;
            
            if (typeof ad.id === 'number' && ad.campaignId) {
              fetch('/api/ads/impression', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  creativeId: ad.id,
                  campaignId: ad.campaignId,
                  placement: ad.placement || 'in_feed',
                  sessionId: getSessionId()
                })
              }).catch(console.error);
            }
          }
        });
      },
      { threshold: 0.5 }
    );
    
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [ad]);

  const handleClick = () => {
    if (typeof ad.id === 'number' && ad.campaignId) {
      fetch('/api/ads/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creativeId: ad.id,
          campaignId: ad.campaignId,
          sessionId: getSessionId()
        })
      }).catch(console.error);
    }
    window.open(ad.ctaUrl, '_blank');
  };

  return (
    <div 
      ref={cardRef}
      className="border-b border-zinc-800 border-l-2 border-l-orange-500 bg-gradient-to-br from-orange-950/20 via-orange-900/10 to-transparent relative overflow-hidden"
      data-testid={`card-sponsored-${ad.id}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent pointer-events-none" />
      
      <div className="px-4 py-3 relative">
        <div className="flex items-center gap-2 mb-2">
          {ad.logoUrl && (
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
              <img src={ad.logoUrl} alt={ad.advertiser} className="w-6 h-6 object-contain" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs">
              <Badge className="bg-orange-500 text-white border-0 text-[10px] py-0 px-1.5 h-4 font-medium">
                Promoted
              </Badge>
              <span className="text-zinc-300 font-medium truncate">{ad.advertiser}</span>
            </div>
            {ad.category && (
              <span className="text-[11px] text-zinc-500">{ad.category}</span>
            )}
          </div>
        </div>
        
        <h3 className="font-semibold text-white text-[15px] leading-snug">{ad.title}</h3>
        <p className="text-sm text-zinc-400 line-clamp-2 mt-1">{ad.description}</p>

        {ad.imageUrl && (
          <div className="mt-3 rounded-lg overflow-hidden ring-1 ring-orange-500/20">
            <img 
              src={ad.imageUrl} 
              alt={ad.title}
              className="w-full aspect-video object-cover"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 px-3 pb-3 relative">
        <Button
          size="sm"
          className="h-9 px-4 gap-1.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-medium"
          onClick={handleClick}
          data-testid={`button-cta-${ad.id}`}
        >
          {ad.ctaText}
          <ExternalLink className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

function PostDetailView({ postId, onBack }: { postId: number; onBack: () => void }) {
  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ['/api/community/forum-posts', postId],
    queryFn: async () => {
      const res = await fetch(`/api/community/forum-posts/${postId}`);
      if (!res.ok) throw new Error('Post not found');
      return res.json();
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
      return apiRequest('POST', `/api/community/forum-posts/${postId}/replies`, { 
        content: replyContent,
        parentReplyId: replyingTo 
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
      return apiRequest('POST', `/api/community/forum-posts/${postId}/upvote`, { bitcoinPriceUsd: 100000 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community/forum-posts'] });
    }
  });

  if (postLoading) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={onBack} className="text-zinc-400">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800/50 animate-pulse">
          <div className="px-4 py-3 space-y-2">
            <div className="h-3 bg-zinc-800 rounded w-1/3" />
            <div className="h-5 bg-zinc-800 rounded w-3/4" />
            <div className="h-20 bg-zinc-800 rounded w-full" />
          </div>
          <div className="flex gap-2 px-2 pb-2">
            <div className="h-9 w-16 bg-zinc-800 rounded-full" />
            <div className="h-9 w-14 bg-zinc-800 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  const hasVoted = !!post?.userVote;
  const upvotes = post?.stats?.upvotes || post?.karma || 0;
  const linkPreview = post?.linkPreview as LinkPreview | null;
  const youtubeId = post?.linkUrl ? extractYouTubeId(post.linkUrl) : null;

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack} className="text-zinc-400 hover:text-white" data-testid="button-back">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="bg-zinc-900/50 rounded-xl border border-zinc-800/50">
        <div className="px-4 py-3">
          <div className="flex items-center gap-1.5 mb-2 text-xs text-zinc-500">
            {post?.flair && (
              <Badge variant="outline" className={`text-[10px] py-0 px-1.5 h-4 ${getTagStyle(post.flair)}`}>
                {post.flair.charAt(0).toUpperCase() + post.flair.slice(1)}
              </Badge>
            )}
            {post?.category && (
              <span className="text-zinc-500">{post.category.name}</span>
            )}
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">{post?.author?.username || 'Anonymous'}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-500">{formatTimeAgo(post?.createdAt)}</span>
          </div>
          
          <h2 className="text-lg font-semibold text-white mb-2">{post?.title}</h2>
          
          {post?.content && (
            <p className="text-zinc-300 whitespace-pre-wrap text-sm leading-relaxed">{post?.content}</p>
          )}

          {post?.imageUrl && (
            <div className="mt-3">
              <img 
                src={post.imageUrl} 
                alt="" 
                className="w-full aspect-video object-cover rounded-lg"
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
            </div>
          )}

          {youtubeId && !post?.imageUrl && (
            <div className="mt-3">
              <YouTubeEmbed videoId={youtubeId} title={post?.title} />
            </div>
          )}

          {linkPreview && !post?.imageUrl && !youtubeId && (
            <a 
              href={post?.linkUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block mt-3 rounded-lg border border-zinc-700/50 overflow-hidden bg-zinc-800/30 hover:border-zinc-600 transition-colors"
            >
              {linkPreview.image && (
                <img 
                  src={linkPreview.image} 
                  alt="" 
                  className="w-full aspect-video object-cover"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              )}
              <div className="p-2.5">
                <p className="text-[11px] text-zinc-500 flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  {linkPreview.siteName}
                </p>
                <p className="text-sm font-medium text-zinc-200 line-clamp-2">{linkPreview.title}</p>
                {linkPreview.description && (
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{linkPreview.description}</p>
                )}
              </div>
            </a>
          )}
        </div>

        <div className="flex items-center gap-1 px-2 pb-2 border-b border-zinc-800">
          <Button
            variant="ghost"
            size="sm"
            className={`h-9 px-3 gap-1.5 rounded-full ${hasVoted ? 'text-orange-500 bg-orange-500/10' : 'text-zinc-400 hover:text-orange-400 hover:bg-zinc-800'}`}
            onClick={(e) => {
              e.stopPropagation();
              if (!hasVoted) upvotePostMutation.mutate();
            }}
            disabled={hasVoted || upvotePostMutation.isPending}
            data-testid="button-upvote-post"
          >
            <ArrowBigUp className={`w-5 h-5 ${hasVoted ? 'fill-orange-500' : ''}`} />
            <span className="text-sm font-medium">{upvotes}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-3 gap-1.5 rounded-full text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">{replies.length}</span>
          </Button>

          {post?.linkUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 gap-1.5 rounded-full text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800"
              onClick={(e) => {
                e.stopPropagation();
                window.open(post.linkUrl, '_blank');
              }}
            >
              <Link2 className="w-4 h-4" />
              <span className="text-sm">Link</span>
            </Button>
          )}
        </div>
      </div>

      <div className="bg-zinc-900/50 rounded-xl border border-zinc-800/50 p-4">
        {replyingTo && (
          <div className="flex items-center gap-2 mb-2 text-xs text-zinc-500">
            <Reply className="w-3 h-3" />
            <span>Replying to comment</span>
            <Button variant="ghost" size="sm" className="h-5 px-1.5 text-xs text-zinc-400" onClick={() => setReplyingTo(null)}>
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}
        <textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder={replyingTo ? "Write a reply..." : "What are your thoughts?"}
          className="w-full p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-sm resize-none focus:outline-none focus:border-orange-500/50 transition-colors placeholder:text-zinc-500"
          rows={3}
          data-testid="input-reply"
        />
        <div className="flex justify-end mt-2">
          <Button 
            onClick={() => replyMutation.mutate()}
            disabled={!replyContent.trim() || replyMutation.isPending}
            className="bg-orange-500 hover:bg-orange-600 h-9 px-4 rounded-full"
            data-testid="button-submit-reply"
          >
            <Send className="w-4 h-4 mr-2" />
            {replyMutation.isPending ? 'Posting...' : 'Reply'}
          </Button>
        </div>
      </div>

      <div className="space-y-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-zinc-400">
            {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
          </h3>
        </div>
        
        {repliesLoading ? (
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800/50 animate-pulse p-4 space-y-2">
            <div className="h-3 bg-zinc-800 rounded w-1/4" />
            <div className="h-4 bg-zinc-800 rounded w-3/4" />
          </div>
        ) : replies.length === 0 ? (
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800/50 py-8 text-center text-zinc-500">
            No replies yet. Be the first to respond!
          </div>
        ) : (
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800/50 overflow-hidden">
            {replies.map((reply: any, index: number) => (
              <ReplyCard 
                key={reply.id} 
                reply={reply} 
                onReply={() => setReplyingTo(reply.id)}
                postId={postId}
                isLast={index === replies.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ReplyCard({ reply, onReply, postId, isLast }: { reply: any; onReply: () => void; postId: number; isLast?: boolean }) {
  const queryClient = useQueryClient();
  
  const upvoteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', `/api/community/forum-replies/${reply.id}/upvote`, { bitcoinPriceUsd: 100000 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community/forum-posts', postId, 'replies'] });
    }
  });

  const hasVoted = !!reply.userVote;
  const upvotes = reply.stats?.upvotes || reply.karma || 0;
  const depth = reply.stats?.depth || 0;

  return (
    <div 
      className={`${!isLast ? 'border-b border-zinc-800' : ''}`}
      style={{ marginLeft: `${Math.min(depth * 16, 48)}px` }}
      data-testid={`card-reply-${reply.id}`}
    >
      <div className="px-4 py-3">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
          <span className="font-medium text-zinc-400">{reply.author?.username || 'Anonymous'}</span>
          <span className="text-zinc-600">•</span>
          <span>{formatTimeAgo(reply.createdAt)}</span>
        </div>
        
        <p className="text-sm text-zinc-300 leading-relaxed">{reply.content}</p>
      </div>
      
      <div className="flex items-center gap-1 px-2 pb-2">
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 px-2.5 gap-1 rounded-full text-xs ${hasVoted ? 'text-orange-500 bg-orange-500/10' : 'text-zinc-500 hover:text-orange-400 hover:bg-zinc-800'}`}
          onClick={() => !hasVoted && upvoteMutation.mutate()}
          disabled={hasVoted || upvoteMutation.isPending}
          data-testid={`button-upvote-reply-${reply.id}`}
        >
          <ArrowBigUp className={`w-4 h-4 ${hasVoted ? 'fill-orange-500' : ''}`} />
          <span>{upvotes}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2.5 gap-1 rounded-full text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
          onClick={onReply}
        >
          <Reply className="w-3.5 h-3.5" />
          Reply
        </Button>
      </div>
    </div>
  );
}

const TAG_OPTIONS = [
  { value: 'discussion', label: 'Discussion', color: 'bg-blue-500' },
  { value: 'question', label: 'Question', color: 'bg-purple-500' },
  { value: 'video', label: 'Video', color: 'bg-red-500' },
  { value: 'article', label: 'Article', color: 'bg-green-500' },
  { value: 'meme', label: 'Meme', color: 'bg-yellow-500' },
  { value: 'security', label: 'Security', color: 'bg-orange-500' },
  { value: 'news', label: 'News', color: 'bg-cyan-500' },
  { value: 'chart', label: 'Chart', color: 'bg-pink-500' },
];

interface LinkPreview {
  type: string;
  title: string;
  description: string;
  image: string;
  siteName: string;
  videoId?: string;
}

function CreatePostForm({ categories, onSuccess }: { categories: any[]; onSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkPreview, setLinkPreview] = useState<LinkPreview | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);

  const fetchLinkPreview = async (url: string) => {
    if (!url.trim()) {
      setLinkPreview(null);
      return;
    }
    setIsLoadingPreview(true);
    try {
      const response = await fetch('/api/community/link-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      if (response.ok) {
        const preview = await response.json();
        setLinkPreview(preview);
        if (preview.type === 'video' && !tag) {
          setTag('video');
        } else if (preview.type === 'article' && !tag) {
          setTag('article');
        }
      }
    } catch (error) {
      console.error('Failed to fetch link preview:', error);
    }
    setIsLoadingPreview(false);
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/community/forum-posts', { 
        title, 
        content, 
        categoryId: parseInt(categoryId),
        flair: tag || null,
        imageUrl: imageUrl || null,
        linkUrl: linkUrl || null,
        linkPreview: linkPreview || null
      });
    },
    onSuccess
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="bg-zinc-800 border-zinc-700 flex-1" data-testid="select-category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            {categories.map((cat: any) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={tag} onValueChange={setTag}>
          <SelectTrigger className="bg-zinc-800 border-zinc-700 w-32" data-testid="select-tag">
            <SelectValue placeholder="Tag" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            {TAG_OPTIONS.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${t.color}`} />
                  {t.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
        rows={3}
        data-testid="input-content"
      />

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => { setShowImageInput(!showImageInput); if (showImageInput) setImageUrl(''); }}
          className={`text-xs ${showImageInput ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "border-zinc-600 text-zinc-300"}`}
          data-testid="button-add-image"
        >
          <Image className="w-3 h-3 mr-1" />
          Image
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => { setShowLinkInput(!showLinkInput); if (showLinkInput) { setLinkUrl(''); setLinkPreview(null); } }}
          className={`text-xs ${showLinkInput ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "border-zinc-600 text-zinc-300"}`}
          data-testid="button-add-link"
        >
          <Link2 className="w-3 h-3 mr-1" />
          Link
        </Button>
      </div>

      {showImageInput && (
        <div className="relative">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Paste image URL (e.g., https://imgur.com/...)"
            className="w-full p-3 pr-10 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 text-sm"
            data-testid="input-image-url"
          />
          {imageUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-8 w-8 p-0"
              onClick={() => setImageUrl('')}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          {imageUrl && (
            <div className="mt-2 rounded-lg overflow-hidden border border-zinc-700">
              <img src={imageUrl} alt="Preview" className="w-full max-h-48 object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
            </div>
          )}
        </div>
      )}

      {showLinkInput && (
        <div className="space-y-2">
          <div className="relative">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onBlur={() => fetchLinkPreview(linkUrl)}
              placeholder="Paste article or YouTube URL"
              className="w-full p-3 pr-10 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 text-sm"
              data-testid="input-link-url"
            />
            {isLoadingPreview && (
              <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-zinc-500" />
            )}
          </div>
          
          {linkPreview && (
            <div className="rounded-lg border border-zinc-700 overflow-hidden bg-zinc-800/50">
              {linkPreview.image && (
                <img src={linkPreview.image} alt="" className="w-full h-32 object-cover" />
              )}
              <div className="p-3">
                <p className="text-xs text-zinc-500 mb-1">{linkPreview.siteName}</p>
                <p className="font-medium text-sm text-zinc-200 line-clamp-2">{linkPreview.title}</p>
                {linkPreview.description && (
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{linkPreview.description}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

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
          {videoCategories[activeCategory].videos.map((video, index) => {
            const videoId = extractYouTubeId(video.url);
            return (
              <Card 
                key={index} 
                className="bg-zinc-800/30 border-zinc-700 overflow-hidden"
                data-testid={`card-video-${index}`}
              >
                {videoId && (
                  <YouTubeEmbed videoId={videoId} title={video.title} />
                )}
                <CardContent className="p-4">
                  <h4 className="font-semibold text-white mb-1 line-clamp-2">
                    {video.title}
                  </h4>
                  <p className="text-zinc-400 text-sm mb-2">
                    {video.creator} • {video.duration}
                  </p>
                  <div className="bg-zinc-900/50 p-2 rounded text-xs text-zinc-300 italic">
                    "{video.note}"
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface LeaderboardPeriod {
  id: number;
  name: string;
  type: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  prizePool: number | null;
  prizeDescription: string | null;
}

interface LeaderboardRanking {
  rank: number;
  userId: number;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  totalSatoshis: number;
  streakDays: number;
  quizzesCompleted: number;
  isCurrentUser?: boolean;
}

interface UserPosition {
  rank: number | null;
  totalSatoshis: number;
  nearbyUsers: LeaderboardRanking[];
  periodName: string;
}

function LeaderboardSection() {
  const [selectedPeriodId, setSelectedPeriodId] = useState<number | null>(null);

  const { data: periods = [], isLoading: periodsLoading } = useQuery<LeaderboardPeriod[]>({
    queryKey: ['/api/leaderboard/periods'],
  });

  const activePeriod = periods.find(p => p.isActive) || periods[0];
  const currentPeriodId = selectedPeriodId || activePeriod?.id;

  const { data: rankings = [], isLoading: rankingsLoading } = useQuery<LeaderboardRanking[]>({
    queryKey: ['/api/leaderboard', currentPeriodId, 'rankings'],
    queryFn: async () => {
      if (!currentPeriodId) return [];
      const res = await fetch(`/api/leaderboard/${currentPeriodId}/rankings?limit=50`);
      return res.json();
    },
    enabled: !!currentPeriodId,
  });

  const { data: myPosition } = useQuery<UserPosition>({
    queryKey: ['/api/leaderboard/my-position', currentPeriodId],
    queryFn: async () => {
      const url = currentPeriodId 
        ? `/api/leaderboard/my-position?periodId=${currentPeriodId}`
        : '/api/leaderboard/my-position';
      const res = await fetch(url);
      return res.json();
    },
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-zinc-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-zinc-400 font-bold">{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border-yellow-500/30";
    if (rank === 2) return "bg-gradient-to-r from-zinc-400/20 to-zinc-500/10 border-zinc-400/30";
    if (rank === 3) return "bg-gradient-to-r from-amber-600/20 to-orange-600/10 border-amber-600/30";
    return "bg-zinc-800/30 border-zinc-700/50";
  };

  const formatSats = (sats: number) => {
    if (sats >= 1000000) return `${(sats / 1000000).toFixed(2)}M`;
    if (sats >= 1000) return `${(sats / 1000).toFixed(1)}K`;
    return sats.toString();
  };

  if (periodsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      {periods.length > 1 && (
        <div className="flex justify-center">
          <Select
            value={currentPeriodId?.toString() || ""}
            onValueChange={(v) => setSelectedPeriodId(parseInt(v))}
          >
            <SelectTrigger className="w-64 bg-zinc-800 border-zinc-700">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              {periods.map((period) => (
                <SelectItem key={period.id} value={period.id.toString()}>
                  {period.name} {period.isActive && "(Active)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Prize Pool Banner */}
      {activePeriod?.prizePool && (
        <Card className="bg-gradient-to-r from-orange-500/20 to-amber-500/10 border-orange-500/30">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-orange-400" />
              <span className="text-lg font-bold text-orange-400">
                {formatSats(activePeriod.prizePool)} sats Prize Pool
              </span>
            </div>
            {activePeriod.prizeDescription && (
              <p className="text-sm text-zinc-300">{activePeriod.prizeDescription}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Your Position Card */}
      {myPosition && myPosition.rank && (
        <Card className="bg-gradient-to-r from-orange-500/10 to-zinc-800 border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Your Rank</p>
                  <p className="text-2xl font-bold text-white">#{myPosition.rank}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-zinc-400">Total Earned</p>
                <p className="text-xl font-bold text-orange-400">{formatSats(myPosition.totalSatoshis)} sats</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rankings List */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-orange-400" />
          Top Learners
        </h3>
        
        {rankingsLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
          </div>
        ) : rankings.length === 0 ? (
          <Card className="bg-zinc-800/30 border-zinc-700">
            <CardContent className="p-8 text-center">
              <Trophy className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400">No rankings yet. Be the first to earn sats!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {rankings.map((user) => (
              <Card 
                key={user.userId} 
                className={`border transition-all ${getRankBg(user.rank)} ${user.isCurrentUser ? 'ring-2 ring-orange-500/50' : ''}`}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    {/* Rank */}
                    <div className="w-8 flex-shrink-0 flex justify-center">
                      {getRankIcon(user.rank)}
                    </div>
                    
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-5 h-5 text-zinc-400" />
                      )}
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">
                        {user.displayName || user.username}
                        {user.isCurrentUser && <span className="text-orange-400 text-xs ml-2">(You)</span>}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-400" />
                          {user.streakDays}d streak
                        </span>
                        <span>{user.quizzesCompleted} quizzes</span>
                      </div>
                    </div>
                    
                    {/* Sats */}
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-orange-400">{formatSats(user.totalSatoshis)}</p>
                      <p className="text-xs text-zinc-500">sats</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Nearby Competitors */}
      {myPosition?.nearbyUsers && myPosition.nearbyUsers.length > 0 && myPosition.rank && myPosition.rank > 10 && (
        <div className="space-y-2 mt-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            Your Competition
          </h3>
          <p className="text-sm text-zinc-400 mb-3">Learners ranked near you</p>
          <div className="space-y-2">
            {myPosition.nearbyUsers.map((user) => (
              <Card 
                key={user.userId} 
                className={`border transition-all ${user.isCurrentUser ? 'bg-orange-500/10 border-orange-500/30 ring-2 ring-orange-500/50' : 'bg-zinc-800/30 border-zinc-700/50'}`}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-center font-bold text-zinc-400">#{user.rank}</span>
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-4 h-4 text-zinc-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">
                        {user.displayName || user.username}
                        {user.isCurrentUser && <span className="text-orange-400 text-xs ml-2">(You)</span>}
                      </p>
                    </div>
                    <p className="font-bold text-orange-400">{formatSats(user.totalSatoshis)} sats</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
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
