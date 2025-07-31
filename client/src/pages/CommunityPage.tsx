import React, { useState } from "react";
import { useLocation } from "wouter";
import { MessageSquare, Video, Users, BookOpen, Trophy, ArrowRight, Crown, Gem, User as UserIcon, Wallet } from "@/lib/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type CommunitySubTab = "daily" | "videos" | "stories";

export default function CommunityPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<CommunitySubTab>("daily");
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
            <div className="flex flex-wrap justify-center gap-2 bg-zinc-800/50 rounded-lg p-2">
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
          {activeTab === "videos" && <VideosSection />}
          {activeTab === "stories" && <StoriesSection />}
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

// Simple Daily Discussion Component - Focused on current day's lesson
function DailyDiscussionSection() {
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();

  // Get user's current day
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  });

  const { data: nextDay } = useQuery({
    queryKey: ['/api/next-available-day', user?.id],
    enabled: !!user?.id,
  });

  const currentDay = nextDay?.dayIndex || 1;

  // Get today's lesson info
  const { data: dayMetadata } = useQuery({
    queryKey: ['/api/day-metadata', currentDay],
  });

  // Simple discussion posts for today
  const { data: discussions = [], isLoading } = useQuery({
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
        <h2 className="text-2xl font-bold mb-2">Day {currentDay} Discussion</h2>
        <p className="text-zinc-400 text-sm mb-1">{dayMetadata?.title}</p>
        <p className="text-xs text-zinc-500">Share thoughts, ask questions, help others understand</p>
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
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Expert Videos</h2>
        <p className="text-zinc-400 text-sm">Curated Bitcoin education from industry experts</p>
      </div>
      
      <div className="text-center py-12 text-zinc-400">
        <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
        <p className="text-sm">Expert Bitcoin education videos</p>
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