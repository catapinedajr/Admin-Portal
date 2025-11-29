import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { MessageSquare, Video, ArrowBigUp, MessageCircle, Clock, TrendingUp, Flame, Plus, User as UserIcon, Wallet, Send, ChevronDown, ChevronUp, ExternalLink, Megaphone, Filter, Image, Link2, X, Loader2, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import BottomNavigation from "@/components/BottomNavigation";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from "@/lib/queryClient";

type CommunityTab = "forums" | "videos";
type ForumFilter = "new" | "hot" | "trending";

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
  const [selectedFlair, setSelectedFlair] = useState<string | undefined>(undefined);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/community/forum-categories'],
  });

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['/api/community/forum-posts', filter, selectedCategory, selectedFlair],
    queryFn: async () => {
      let url = `/api/community/forum-posts?sortBy=${filter}`;
      if (selectedCategory) url += `&categoryId=${selectedCategory}`;
      if (selectedFlair) url += `&flair=${selectedFlair}`;
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
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs border-zinc-700 bg-zinc-800 hover:bg-zinc-700 px-2 shrink-0"
                data-testid="button-filter-topics"
              >
                <Filter className="w-3 h-3" />
                <span className="ml-1 truncate max-w-[80px]">
                  {selectedCategory === undefined 
                    ? "All" 
                    : categories.find((c: any) => c.id === selectedCategory)?.name || "Filter"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1 bg-zinc-800 border-zinc-700" align="start">
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
                className={`text-xs border-zinc-700 bg-zinc-800 hover:bg-zinc-700 px-2 shrink-0 ${selectedFlair ? getFlairStyle(selectedFlair) : ''}`}
                data-testid="button-filter-flair"
              >
                <span className="truncate max-w-[60px]">
                  {selectedFlair 
                    ? selectedFlair.charAt(0).toUpperCase() + selectedFlair.slice(1)
                    : "Flair"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-1 bg-zinc-800 border-zinc-700" align="start">
              <div className="flex flex-col">
                <Button
                  variant={selectedFlair === undefined ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedFlair(undefined)}
                  className="justify-start text-xs h-8"
                  data-testid="button-flair-all"
                >
                  All Flair
                </Button>
                {FLAIR_OPTIONS.map((f) => (
                  <Button
                    key={f.value}
                    variant={selectedFlair === f.value ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedFlair(f.value)}
                    className="justify-start text-xs h-8"
                    data-testid={`button-flair-${f.value}`}
                  >
                    <span className={`w-2 h-2 rounded-full mr-2 ${f.color}`} />
                    {f.label}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <div className="flex items-center gap-0.5 bg-zinc-800/50 rounded-lg p-0.5">
            <Button
              variant={filter === "hot" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter("hot")}
              className="text-xs h-7 px-2"
              data-testid="button-filter-hot"
            >
              <Flame className="w-3 h-3" />
            </Button>
            <Button
              variant={filter === "new" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter("new")}
              className="text-xs h-7 px-2"
              data-testid="button-filter-new"
            >
              <Clock className="w-3 h-3" />
            </Button>
            <Button
              variant={filter === "trending" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter("trending")}
              className="text-xs h-7 px-2"
              data-testid="button-filter-trending"
            >
              <TrendingUp className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {userKarma && (
            <Badge variant="outline" className="text-orange-400 border-orange-400/30 text-xs px-1.5">
              {userKarma.totalKarma || 0}
            </Badge>
          )}
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 h-7 px-2" data-testid="button-create-post">
                <Plus className="w-4 h-4" />
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
          {posts.map((post: any, index: number) => {
            const elements = [];
            
            elements.push(
              <PostCard 
                key={post.id} 
                post={post} 
                onClick={() => setSelectedPost(post.id)}
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

function getFlairStyle(flair: string) {
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
  return styles[flair] || 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
}

function PostCard({ post, onClick }: { post: any; onClick: () => void }) {
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
  const hasMedia = post.imageUrl || linkPreview?.image;

  return (
    <Card 
      className="bg-zinc-800/30 border-zinc-700 hover:border-zinc-600 transition-colors cursor-pointer overflow-hidden"
      data-testid={`card-post-${post.id}`}
    >
      <CardContent className="p-0">
        <div className="flex">
          <div 
            className="flex flex-col items-center py-3 px-3 bg-zinc-800/50"
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

          <div className="flex-1 min-w-0" onClick={onClick}>
            <div className="p-3 pb-2">
              <div className="flex items-center gap-2 mb-1 text-xs text-zinc-500 flex-wrap">
                {post.flair && (
                  <Badge variant="outline" className={`text-xs py-0 px-1.5 ${getFlairStyle(post.flair)}`}>
                    {post.flair.charAt(0).toUpperCase() + post.flair.slice(1)}
                  </Badge>
                )}
                {post.category && (
                  <Badge variant="outline" className="text-xs py-0 border-zinc-600">
                    {post.category.name}
                  </Badge>
                )}
                <span className="truncate">by {post.author?.username || 'Anonymous'}</span>
                <span>•</span>
                <span>{timeAgo}</span>
              </div>
              
              <h3 className="font-semibold text-white mb-1 line-clamp-2">{post.title}</h3>
              
              {post.content && !hasMedia && (
                <p className="text-sm text-zinc-400 line-clamp-2">{post.content}</p>
              )}
            </div>

            {post.imageUrl && (
              <div className="px-3 pb-2">
                <img 
                  src={post.imageUrl} 
                  alt="" 
                  className="w-full max-h-64 object-cover rounded-lg"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              </div>
            )}

            {linkPreview && !post.imageUrl && (
              <div className="mx-3 mb-2 rounded-lg border border-zinc-700 overflow-hidden bg-zinc-800/50">
                <div className="flex">
                  {linkPreview.image && (
                    <img 
                      src={linkPreview.image} 
                      alt="" 
                      className="w-24 h-20 object-cover flex-shrink-0"
                      onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                  )}
                  <div className="p-2 min-w-0 flex-1">
                    <p className="text-xs text-zinc-500 truncate">{linkPreview.siteName}</p>
                    <p className="text-sm font-medium text-zinc-300 line-clamp-2">{linkPreview.title}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 px-3 pb-3 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                {post.replyCount || 0}
              </span>
              {post.linkUrl && (
                <span className="flex items-center gap-1">
                  <Link2 className="w-3 h-3" />
                  Link
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
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
    <Card 
      ref={cardRef}
      className="bg-gradient-to-r from-zinc-800/50 to-zinc-800/30 border-zinc-700 border-l-2 border-l-orange-500/50 overflow-hidden"
      data-testid={`card-sponsored-${ad.id}`}
    >
      <CardContent className="p-0">
        {ad.imageUrl && (
          <div className="relative h-32 w-full">
            <img 
              src={ad.imageUrl} 
              alt={ad.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 to-transparent" />
            <Badge className="absolute top-2 left-2 bg-orange-500/90 text-white border-0 text-[10px] px-1.5 py-0">
              Sponsored
            </Badge>
          </div>
        )}
        
        <div className="flex">
          {!ad.imageUrl && (
            <div className="flex flex-col items-center justify-center py-3 px-3 bg-zinc-800/30 rounded-l-lg">
              {ad.logoUrl ? (
                <img src={ad.logoUrl} alt={ad.advertiser} className="w-8 h-8 rounded object-contain" />
              ) : (
                <Megaphone className="w-5 h-5 text-orange-400/70" />
              )}
            </div>
          )}

          <div className="flex-1 p-3">
            <div className="flex items-center gap-2 mb-1 text-xs">
              {!ad.imageUrl && (
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px] px-1.5 py-0">
                  Sponsored
                </Badge>
              )}
              {ad.logoUrl && ad.imageUrl && (
                <img src={ad.logoUrl} alt={ad.advertiser} className="w-4 h-4 rounded object-contain" />
              )}
              <span className="text-zinc-500">{ad.advertiser}</span>
              {ad.category && (
                <>
                  <span className="text-zinc-600">•</span>
                  <Badge variant="outline" className="text-xs py-0 text-zinc-500">
                    {ad.category}
                  </Badge>
                </>
              )}
            </div>
            
            <h3 className="font-semibold text-white mb-1">{ad.title}</h3>
            <p className="text-sm text-zinc-400 mb-2">{ad.description}</p>

            <Button
              size="sm"
              variant="outline"
              className="text-xs border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
              onClick={handleClick}
              data-testid={`button-cta-${ad.id}`}
            >
              {ad.ctaText}
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
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
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <Card className="bg-zinc-800/30 border-zinc-700 animate-pulse">
          <CardContent className="p-6 h-48" />
        </Card>
      </div>
    );
  }

  const hasVoted = !!post?.userVote;
  const upvotes = post?.stats?.upvotes || post?.karma || 0;
  const linkPreview = post?.linkPreview as LinkPreview | null;

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
              <div className="flex items-center gap-2 mb-2 text-xs text-zinc-500 flex-wrap">
                {post?.flair && (
                  <Badge variant="outline" className={`text-xs py-0 px-1.5 ${getFlairStyle(post.flair)}`}>
                    {post.flair.charAt(0).toUpperCase() + post.flair.slice(1)}
                  </Badge>
                )}
                {post?.category && (
                  <Badge variant="outline" className="border-zinc-600">{post.category.name}</Badge>
                )}
                <span>Posted by {post?.author?.username || 'Anonymous'}</span>
                <span>•</span>
                <span>{formatTimeAgo(post?.createdAt)}</span>
              </div>
              
              <h2 className="text-xl font-bold mb-3">{post?.title}</h2>
              
              {post?.content && (
                <p className="text-zinc-300 whitespace-pre-wrap mb-4">{post?.content}</p>
              )}

              {post?.imageUrl && (
                <div className="mb-4">
                  <img 
                    src={post.imageUrl} 
                    alt="" 
                    className="w-full max-h-96 object-contain rounded-lg bg-zinc-900"
                    onError={(e) => e.currentTarget.style.display = 'none'}
                  />
                </div>
              )}

              {linkPreview && (
                <a 
                  href={post?.linkUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block mb-4 rounded-lg border border-zinc-700 overflow-hidden bg-zinc-800/50 hover:border-zinc-600 transition-colors"
                >
                  {linkPreview.image && (
                    <img 
                      src={linkPreview.image} 
                      alt="" 
                      className="w-full h-48 object-cover"
                      onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                  )}
                  <div className="p-3">
                    <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      {linkPreview.siteName}
                    </p>
                    <p className="font-medium text-zinc-200">{linkPreview.title}</p>
                    {linkPreview.description && (
                      <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{linkPreview.description}</p>
                    )}
                  </div>
                </a>
              )}
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

const FLAIR_OPTIONS = [
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
  const [flair, setFlair] = useState<string>("");
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
        if (preview.type === 'video' && !flair) {
          setFlair('video');
        } else if (preview.type === 'article' && !flair) {
          setFlair('article');
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
        flair: flair || null,
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

        <Select value={flair} onValueChange={setFlair}>
          <SelectTrigger className="bg-zinc-800 border-zinc-700 w-32" data-testid="select-flair">
            <SelectValue placeholder="Flair" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            {FLAIR_OPTIONS.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${f.color}`} />
                  {f.label}
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
          variant={showImageInput ? "secondary" : "outline"}
          size="sm"
          onClick={() => { setShowImageInput(!showImageInput); if (showImageInput) setImageUrl(''); }}
          className="text-xs"
          data-testid="button-add-image"
        >
          <Image className="w-3 h-3 mr-1" />
          Image
        </Button>
        <Button
          type="button"
          variant={showLinkInput ? "secondary" : "outline"}
          size="sm"
          onClick={() => { setShowLinkInput(!showLinkInput); if (showLinkInput) { setLinkUrl(''); setLinkPreview(null); } }}
          className="text-xs"
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
