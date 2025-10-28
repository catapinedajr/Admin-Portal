import React, { useState } from "react";
import { useLocation } from "wouter";
import { MessageSquare, Video, Users, BookOpen, Trophy, ArrowRight, Crown, Gem, User as UserIcon, Wallet } from "@/lib/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Play } from 'lucide-react';

type CommunitySubTab = "daily" | "reddit" | "videos" | "stories";

export default function CommunityPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<CommunitySubTab>("reddit");
  const { isPremiumTier } = useSubscription();

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header - Consistent with HomePage */}
      <header className="border-b border-zinc-800 bg-black/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setLocation('/')}
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

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              {/* Wallet Button */}
              <Button 
                onClick={() => setLocation('/wallet')}
                size="sm"
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5"
                title="Learning Wallet"
              >
                <Wallet className="w-4 h-4" />
                <span className="sr-only">Wallet</span>
              </Button>
              
              {/* Account Button */}
              <Button 
                onClick={() => setLocation('/account')}
                size="sm"
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5"
                title="Account Settings"
              >
                <UserIcon className="w-4 h-4" />
                <span className="sr-only">Account</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 pb-24">
        <div className="space-y-6">
          {/* Community Sub-navigation - Consistent with Learn and Simulators */}
          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-2 bg-zinc-800/50 rounded-lg p-2 max-w-sm mx-auto">
              <Button
                variant={activeTab === "reddit" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("reddit")}
                className="text-xs px-3 py-1"
              >
                <Users className="w-3 h-3 mr-1" />
                Reddit
              </Button>
              <Button
                variant={activeTab === "daily" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("daily")}
                className="text-xs px-3 py-1"
              >
                <MessageSquare className="w-3 h-3 mr-1" />
                Daily Discussion
              </Button>
              <Button
                variant={activeTab === "videos" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("videos")}
                className="text-xs px-3 py-1"
              >
                <Video className="w-3 h-3 mr-1" />
                Expert Videos
              </Button>
              <Button
                variant={activeTab === "stories" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("stories")}
                className="text-xs px-3 py-1"
              >
                <Trophy className="w-3 h-3 mr-1" />
                Success Stories
              </Button>
            </div>
          </div>

          {/* Content */}
          {activeTab === "daily" && <DailyDiscussionSection />}
          {activeTab === "reddit" && <RedditSection />}
          {activeTab === "videos" && <VideosSection />}
          {activeTab === "stories" && <StoriesSection />}
        </div>
      </main>

      <BottomNavigation 
        activeSection="community" 
        onSectionChange={(section: string) => {
          if (section === "home") setLocation('/');
          else if (section === "learn") setLocation('/learn');
          else if (section === "simulators") setLocation('/simulators');
          else if (section === "money") setLocation('/money');
          else if (section === "community") setLocation('/community');
        }}
      />
    </div>
  );
}

// Simple Daily Discussion Component - Focused on current day's lesson
function DailyDiscussionSection() {
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();

  // Get user's current day
  const { data: user } = useQuery<any>({
    queryKey: ['/api/user'],
  });

  const { data: nextDay } = useQuery<any>({
    queryKey: ['/api/next-available-day', user?.id],
    enabled: !!user?.id,
  });

  const currentDay = nextDay?.dayIndex || 1;

  // Get today's lesson info
  const { data: dayMetadata } = useQuery<any>({
    queryKey: ['/api/day-metadata', currentDay],
  });

  // Simple discussion posts for today
  const { data: discussions = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/daily-discussions', currentDay],
  });

  // Post new comment mutation
  const postMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch('/api/daily-discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayIndex: currentDay, content })
      });
      if (!response.ok) throw new Error('Failed to post');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/daily-discussions', currentDay] });
      setNewComment("");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      postMutation.mutate(newComment.trim());
    }
  };

  return (
    <div className="space-y-6">
      {/* Today's Discussion Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Day {currentDay} Quick Reflection</h2>
        <p className="text-zinc-400 text-sm mb-1">{dayMetadata?.title}</p>
        <p className="text-xs text-zinc-500">Quick thoughts on today's lesson</p>
      </div>

      {/* Post New Comment */}
      <Card className="bg-zinc-800/50 border-zinc-700">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What did you think about today's lesson?"
              className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-sm resize-none focus:outline-none focus:border-orange-500 transition-colors"
              rows={3}
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={!newComment.trim() || postMutation.isPending}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm"
              >
                {postMutation.isPending ? 'Posting...' : 'Share Thought'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Discussion Thread */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-zinc-400">Loading discussion...</div>
        ) : discussions.length === 0 ? (
          <div className="text-center py-8 text-zinc-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No discussion yet for Day {currentDay}</p>
            <p className="text-xs mt-1">Be the first to share your thoughts!</p>
          </div>
        ) : (
          discussions.map((discussion: any) => (
            <Card key={discussion.id} className="bg-zinc-800/30 border-zinc-700">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <span className="text-orange-500 text-sm font-medium">
                      {discussion.username?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm">{discussion.username || 'Anonymous'}</span>
                      <span className="text-xs text-zinc-500">
                        {new Date(discussion.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed">{discussion.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Simplified Videos Section
function VideosSection() {
  type VideoCategory = "foundation" | "economics" | "technical" | "realworld";
  const [activeCategory, setActiveCategory] = useState<VideoCategory>("foundation");
  const [selectedVideo, setSelectedVideo] = useState<{
    id: string;
    title: string;
    creator: string;
    duration: string;
    note: string;
  } | null>(null);
  
  const videoCategories: Record<VideoCategory, {
    title: string;
    description: string;
    videos: Array<{
      title: string;
      creator: string;
      duration: string;
      note: string;
      videoId: string;
    }>;
  }> = {
    foundation: {
      title: "🔰 Foundation Level",
      description: "Getting Started & Core Concepts",
      videos: [
        {
          title: "Introduction to Bitcoin",
          creator: "Andreas Antonopoulos",
          duration: "30 mins",
          note: "This is where my journey started - perfect entry point",
          videoId: "l1si5ZWLgy0"
        },
        {
          title: "Bitcoin on Lex Fridman",
          creator: "Michael Saylor",
          duration: "20 min segments",
          note: "4-hour masterclass broken into digestible parts",
          videoId: "mC43pZkpTec"
        },
        {
          title: "What is Money? (Part 1)",
          creator: "Saifedean Ammous",
          duration: "25 mins",
          note: "Essential economic foundation before diving into Bitcoin",
          videoId: "1WBrdLQhUrg"
        },
        {
          title: "21 Lessons Introduction",
          creator: "Gigi",
          duration: "20 mins",
          note: "Philosophy meets practicality - changed my perspective",
          videoId: "F-EHF8oFyLE"
        },
        {
          title: "Bitcoin vs Banks",
          creator: "Andreas Antonopoulos",
          duration: "15 mins",
          note: "Why the traditional system is broken",
          videoId: "LgI0liAee4s"
        },
        {
          title: "Bitcoin for Beginners",
          creator: "Preston Pysh",
          duration: "25 mins",
          note: "Investment thesis made simple",
          videoId: "Zbm772vF-5M"
        },
        {
          title: "Deflationary World Intro",
          creator: "Jeff Booth",
          duration: "20 mins",
          note: "Mind-bending perspective on future economics",
          videoId: "O3hq2vIhtz8"
        },
        {
          title: "Financial Freedom Basics",
          creator: "Alex Gladstein",
          duration: "18 mins",
          note: "Real-world impact beyond investment",
          videoId: "xLYYh4aPXAM"
        }
      ]
    },
    economics: {
      title: "📈 Economics & Macro",
      description: "Understanding the Why",
      videos: [
        {
          title: "What is Money? Episode 1",
          creator: "Saylor & Breedlove",
          duration: "45 mins",
          note: "Deep dive that solidified my conviction",
          videoId: "Vp7Q_3E_gzU"
        },
        {
          title: "Bitcoin vs Gold",
          creator: "Lyn Alden",
          duration: "30 mins",
          note: "Best comparison of store of value assets",
          videoId: "VdPkpxmN9g4"
        },
        {
          title: "The Bitcoin Standard Key Chapter",
          creator: "Saifedean Ammous",
          duration: "35 mins",
          note: "Economic theory meets Bitcoin reality",
          videoId: "Zbm772vF-5M"
        },
        {
          title: "AI, Deflation, and Bitcoin",
          creator: "Jeff Booth",
          duration: "25 mins",
          note: "Future economics explained brilliantly",
          videoId: "O3hq2vIhtz8"
        },
        {
          title: "Inflation Hedge Thesis",
          creator: "Preston Pysh",
          duration: "20 mins",
          note: "Why Bitcoin wins against money printing",
          videoId: "Zbm772vF-5M"
        },
        {
          title: "Bitcoin in Changing World Order",
          creator: "Ray Dalio",
          duration: "15 mins",
          note: "Traditional finance acknowledging Bitcoin",
          videoId: "Nu4lHaSh7D4"
        },
        {
          title: "Volatility as Feature",
          creator: "Anthony Pompliano",
          duration: "25 mins",
          note: "Reframes risk vs opportunity perfectly",
          videoId: "KzpQR2r5sJE"
        },
        {
          title: "IMF and Bitcoin",
          creator: "Alex Gladstein",
          duration: "30 mins",
          note: "Eye-opening global financial system critique",
          videoId: "xLYYh4aPXAM"
        }
      ]
    },
    technical: {
      title: "⚡ Technical & Advanced",
      description: "How Bitcoin Works",
      videos: [
        {
          title: "How Bitcoin Works",
          creator: "Andreas Antonopoulos",
          duration: "40 mins",
          note: "Technical concepts made accessible",
          videoId: "l1si5ZWLgy0"
        },
        {
          title: "Lightning Network Explained",
          creator: "Andreas Antonopoulos",
          duration: "25 mins",
          note: "Scaling solution that makes sense",
          videoId: "rrr_zPmEiME"
        },
        {
          title: "Self-Custody Basics",
          creator: "Andreas Antonopoulos",
          duration: "20 mins",
          note: "Not your keys, not your Bitcoin - essential",
          videoId: "F12lpqnug-0"
        },
        {
          title: "Proof of Work vs Proof of Stake",
          creator: "Gigi",
          duration: "30 mins",
          note: "Why energy 'waste' is actually security",
          videoId: "F-EHF8oFyLE"
        },
        {
          title: "Corporate Bitcoin Strategy",
          creator: "Michael Saylor",
          duration: "35 mins",
          note: "How companies adopt Bitcoin treasury",
          videoId: "mC43pZkpTec"
        },
        {
          title: "Bitcoin Mining Reality",
          creator: "Andreas Antonopoulos",
          duration: "25 mins",
          note: "Dispels environmental myths with facts",
          videoId: "2T0OUIW89II"
        },
        {
          title: "DCA Strategy Deep Dive",
          creator: "Preston Pysh",
          duration: "20 mins",
          note: "Practical investment approach that works",
          videoId: "Zbm772vF-5M"
        },
        {
          title: "Fiat Standard Problems",
          creator: "Saifedean Ammous",
          duration: "30 mins",
          note: "Why the current system fails everyone",
          videoId: "1WBrdLQhUrg"
        }
      ]
    },
    realworld: {
      title: "🌍 Real World & Future",
      description: "Bitcoin in Practice",
      videos: [
        {
          title: "Bitcoin in El Salvador",
          creator: "Alex Gladstein",
          duration: "25 mins",
          note: "Nation-state adoption lessons learned",
          videoId: "xLYYh4aPXAM"
        },
        {
          title: "Institutional Adoption Wave",
          creator: "Michael Saylor",
          duration: "20 mins",
          note: "Why corporations choose Bitcoin",
          videoId: "mC43pZkpTec"
        },
        {
          title: "Hyper-Bitcoinized World",
          creator: "Jeff Booth",
          duration: "30 mins",
          note: "What happens when Bitcoin wins",
          videoId: "O3hq2vIhtz8"
        },
        {
          title: "Bitcoin Culture & Community",
          creator: "Gigi",
          duration: "15 mins",
          note: "Why Bitcoiners think differently",
          videoId: "F-EHF8oFyLE"
        },
        {
          title: "Bitcoin Privacy",
          creator: "Andreas Antonopoulos",
          duration: "25 mins",
          note: "Financial privacy in digital age",
          videoId: "l1si5ZWLgy0"
        },
        {
          title: "Bitcoin 2030 Predictions",
          creator: "Multi-Expert Panel",
          duration: "45 mins",
          note: "Combined wisdom of top voices",
          videoId: "Nu4lHaSh7D4"
        }
      ]
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Expert Videos</h2>
        <p className="text-zinc-400 text-sm">30 essential Bitcoin videos curated from my personal learning journey</p>
      </div>

      {/* Category Navigation */}
      <div className="flex justify-center">
        <div className="flex flex-wrap justify-center gap-2 bg-zinc-800/50 rounded-lg p-2 max-w-2xl">
          {Object.entries(videoCategories).map(([key, category]) => (
            <Button
              key={key}
              variant={activeCategory === key ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveCategory(key as VideoCategory)}
              className="text-xs px-3 py-1.5"
            >
              {category.title}
            </Button>
          ))}
        </div>
      </div>

      {/* Category Content */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-1">{videoCategories[activeCategory].title}</h3>
          <p className="text-zinc-400 text-sm">{videoCategories[activeCategory].description}</p>
        </div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {videoCategories[activeCategory].videos.map((video, index) => (
            <Card key={index} className="bg-zinc-900/50 border-zinc-800 hover:border-orange-500/30 transition-all duration-300 group cursor-pointer overflow-hidden"
              onClick={() => setSelectedVideo({
                id: video.videoId,
                title: video.title,
                creator: video.creator,
                duration: video.duration,
                note: video.note
              })}>
              <CardContent className="p-0">
                {/* Video Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden">
                  <img 
                    src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback to medium quality thumbnail if maxres doesn't exist
                      const target = e.target as HTMLImageElement;
                      target.src = `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-orange-500/90 hover:bg-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    </div>
                  </div>
                </div>
                
                {/* Video Details */}
                <div className="p-4">
                  <h4 className="font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
                    {video.title}
                  </h4>
                  <p className="text-sm text-zinc-400 mb-3">
                    by {video.creator}
                  </p>
                  <div className="bg-zinc-900/50 p-2 rounded text-xs text-zinc-300 italic">
                    "{video.note}"
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Learning Path Guide */}
        <Card className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-orange-500/20 mt-8">
          <CardContent className="p-6 text-center">
            <h4 className="font-semibold mb-2">Recommended Learning Path</h4>
            <p className="text-sm text-zinc-400 mb-4">
              Start with Foundation → Progress to Economics → Advance to Technical → Finish with Real World
            </p>
            <p className="text-xs text-orange-400">
              These are the exact videos that built my Bitcoin conviction. Each one chosen for maximum learning impact.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          videoId={selectedVideo.id}
          title={selectedVideo.title}
          creator={selectedVideo.creator}
          duration={selectedVideo.duration}
          note={selectedVideo.note}
          isOpen={true}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}

// Reddit Community Section
function RedditSection() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Reddit Community</h2>
        <p className="text-zinc-400 text-sm">Join our Bitcoin learning community on Reddit</p>
      </div>
      
      {/* Reddit Community Card */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-orange-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Users className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Join Our Reddit Community</h3>
          <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto leading-relaxed">
            Connect with Bitcoin learners worldwide for deeper discussions, debates, and community support. 
            Share insights, ask questions, and learn from others on their Bitcoin journey.
          </p>
          <Button 
            onClick={() => window.open('#', '_blank')} // Link will be updated when Reddit group is created
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-base"
          >
            <Users className="w-5 h-5 mr-2" />
            Join Reddit Group
          </Button>
          <p className="text-xs text-zinc-500 mt-3">Opens in new tab • Free to join</p>
        </CardContent>
      </Card>

      {/* Benefits */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-zinc-800/30 border-zinc-700">
          <CardContent className="p-4 text-center">
            <MessageSquare className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <h4 className="font-medium mb-1">Deep Discussions</h4>
            <p className="text-xs text-zinc-400">Threaded conversations and debates</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-800/30 border-zinc-700">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <h4 className="font-medium mb-1">Global Community</h4>
            <p className="text-xs text-zinc-400">Connect with learners worldwide</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-800/30 border-zinc-700">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <h4 className="font-medium mb-1">Share Success</h4>
            <p className="text-xs text-zinc-400">Celebrate Bitcoin milestones</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Simplified Stories Section
function StoriesSection() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Success Stories</h2>
        <p className="text-zinc-400 text-sm">Real stories from HODLearn graduates</p>
      </div>
      
      <div className="text-center py-12 text-zinc-400">
        <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
        <p className="text-sm">Success stories from Bitcoin learners</p>
      </div>
    </div>
  );
}