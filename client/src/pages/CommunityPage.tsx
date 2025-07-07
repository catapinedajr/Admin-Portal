import { useState } from "react";
import { useLocation } from "wouter";
import { MessageSquare, Video, Users, BookOpen, Trophy, ArrowRight, Crown, Gem, User as UserIcon } from "@/lib/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import { useSubscription } from "@/contexts/SubscriptionContext";

type CommunitySubTab = "overview" | "forums" | "videos" | "stories";

export default function CommunityPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<CommunitySubTab>("overview");
  const { isPremiumTier, setShowEmailModal } = useSubscription();

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
                  <h1 className="text-xl font-bold">HODLearn</h1>
                  <p className="text-xs text-zinc-400">How-to-learn BTC</p>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
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
              
              {/* Premium Status Indicator */}
              {isPremiumTier ? (
                <div className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500 px-2.5 py-1.5 font-medium rounded flex items-center">
                  <Gem className="w-4 h-4" />
                  <span className="sr-only">Premium</span>
                </div>
              ) : (
                <Button 
                  onClick={() => setShowEmailModal(true)}
                  size="sm"
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5"
                  title="Upgrade to Premium"
                >
                  <Crown className="w-4 h-4" />
                  <span className="sr-only">Upgrade</span>
                </Button>
              )}
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
                variant={activeTab === "overview" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("overview")}
                className="text-xs px-3 py-1"
              >
                <Users className="w-3 h-3 mr-1" />
                Overview
              </Button>
              <Button
                variant={activeTab === "forums" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("forums")}
                className="text-xs px-3 py-1"
              >
                <MessageSquare className="w-3 h-3 mr-1" />
                Forums
              </Button>
              <Button
                variant={activeTab === "videos" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("videos")}
                className="text-xs px-3 py-1"
              >
                <Video className="w-3 h-3 mr-1" />
                Videos
              </Button>
              <Button
                variant={activeTab === "stories" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("stories")}
                className="text-xs px-3 py-1"
              >
                <BookOpen className="w-3 h-3 mr-1" />
                Stories
              </Button>
            </div>
          </div>

          {/* Content */}
          {activeTab === "overview" && <CommunityOverview setActiveTab={setActiveTab} />}
          {activeTab === "forums" && <ForumsSection />}
          {activeTab === "videos" && <VideosSection />}
          {activeTab === "stories" && <StoriesSection />}
        </div>
      </main>

      <BottomNavigation 
        activeSection="community"
        onSectionChange={(section) => {
          if (section === 'home') setLocation('/');
          else if (section === 'learn') setLocation('/learn');
          else if (section === 'money') setLocation('/money');
          else if (section === 'simulators') setLocation('/simulators');
          else if (section === 'more') setLocation('/more');
        }}
      />
    </div>
  );
}

function CommunityOverview({ setActiveTab }: { setActiveTab: (tab: CommunitySubTab) => void }) {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-6">
        <h2 className="text-2xl font-bold mb-3">Welcome to the HODLearn Community</h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Join thousands of Bitcoin learners on their journey to understanding and conviction. 
          Share experiences, ask questions, and learn from others who've walked this path.
        </p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-orange-500 mx-auto mb-2" />
            <div className="text-xl font-bold">2,847</div>
            <div className="text-zinc-400 text-xs">Active Learners</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-6 w-6 text-orange-500 mx-auto mb-2" />
            <div className="text-xl font-bold">12,394</div>
            <div className="text-zinc-400 text-xs">Forum Posts</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-4 text-center">
            <Video className="h-6 w-6 text-orange-500 mx-auto mb-2" />
            <div className="text-xl font-bold">156</div>
            <div className="text-zinc-400 text-xs">Curated Videos</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-4 text-center">
            <Trophy className="h-6 w-6 text-orange-500 mx-auto mb-2" />
            <div className="text-xl font-bold">891</div>
            <div className="text-zinc-400 text-xs">Success Stories</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors cursor-pointer"
          onClick={() => setActiveTab("forums")}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-4 w-4 text-orange-500" />
              Daily Discussions
            </CardTitle>
            <CardDescription className="text-sm">
              Join discussions about today's Bitcoin lesson and ask questions
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="text-xs text-zinc-400">
                Latest: Day 5 - Store of Value
              </div>
              <ArrowRight className="h-3 w-3 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors cursor-pointer"
          onClick={() => setActiveTab("videos")}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Video className="h-4 w-4 text-orange-500" />
              Curated Videos
            </CardTitle>
            <CardDescription className="text-sm">
              Hand-picked YouTube content to deepen your understanding
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="text-xs text-zinc-400">
                Trending: Why Bitcoin Matters
              </div>
              <ArrowRight className="h-3 w-3 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors cursor-pointer"
          onClick={() => setActiveTab("stories")}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-4 w-4 text-orange-500" />
              Success Stories
            </CardTitle>
            <CardDescription className="text-sm">
              Read how others built Bitcoin conviction and overcame challenges
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="text-xs text-zinc-400">
                Latest: From Skeptic to Believer
              </div>
              <ArrowRight className="h-3 w-3 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ForumsSection() {
  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h2 className="text-xl font-bold mb-2">Community Forums</h2>
        <p className="text-zinc-400 text-sm">Connect with fellow Bitcoin learners</p>
      </div>

      {/* Forum Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Getting Started</span>
              <Badge variant="secondary" className="text-xs">1,247 posts</Badge>
            </CardTitle>
            <CardDescription className="text-sm">
              New to Bitcoin? Ask your beginner questions here
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-zinc-400">
              Latest: "Is Bitcoin actually secure?" - 2 hours ago
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Daily Lesson Discussions</span>
              <Badge variant="secondary" className="text-xs">3,891 posts</Badge>
            </CardTitle>
            <CardDescription className="text-sm">
              Discuss today's lesson with other learners
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-zinc-400">
              Latest: "Day 15 - Mining Discussion" - 1 hour ago
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Technical Deep Dives</span>
              <Badge variant="secondary" className="text-xs">567 posts</Badge>
            </CardTitle>
            <CardDescription className="text-sm">
              Advanced Bitcoin topics and technical discussions
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-zinc-400">
              Latest: "Lightning Network routing" - 4 hours ago
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 transition-colors cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Local Meetups</span>
              <Badge variant="secondary" className="text-xs">234 posts</Badge>
            </CardTitle>
            <CardDescription className="text-sm">
              Find and organize Bitcoin meetups in your area
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-zinc-400">
              Latest: "NYC Bitcoin Meetup - Jan 15" - 6 hours ago
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center py-6">
        <Button className="bg-orange-500 hover:bg-orange-600 text-sm px-6">
          Create New Discussion
        </Button>
      </div>
    </div>
  );
}

function VideosSection() {
  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h2 className="text-xl font-bold mb-2">Curated Video Library</h2>
        <p className="text-zinc-400 text-sm">Hand-picked content to enhance your learning</p>
      </div>

      {/* Video Categories */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Badge className="bg-green-600 text-xs">Beginner</Badge>
            Foundation Videos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-zinc-800/50 border-zinc-700">
              <div className="aspect-video bg-zinc-800 rounded-t-lg flex items-center justify-center">
                <Video className="h-8 w-8 text-zinc-600" />
              </div>
              <CardContent className="p-3">
                <h4 className="font-semibold mb-1 text-sm">What is Bitcoin?</h4>
                <p className="text-xs text-zinc-400 mb-2">Andreas Antonopoulos</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">15 min</span>
                  <Badge variant="outline" className="text-xs">Popular</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Badge className="bg-yellow-600 text-xs">Intermediate</Badge>
            Economics & Monetary Theory
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-zinc-800/50 border-zinc-700">
              <div className="aspect-video bg-zinc-800 rounded-t-lg flex items-center justify-center">
                <Video className="h-8 w-8 text-zinc-600" />
              </div>
              <CardContent className="p-3">
                <h4 className="font-semibold mb-1 text-sm">The Fiat Standard</h4>
                <p className="text-xs text-zinc-400 mb-2">Saifedean Ammous</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">45 min</span>
                  <Badge variant="outline" className="text-xs">New</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoriesSection() {
  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h2 className="text-xl font-bold mb-2">Bitcoin Journey Stories</h2>
        <p className="text-zinc-400 text-sm">Real experiences from the community</p>
      </div>

      {/* Story Categories */}
      <div className="space-y-4">
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>From Skeptic to Believer</span>
              <Badge variant="outline" className="text-xs">New</Badge>
            </CardTitle>
            <CardDescription className="text-sm">
              How I went from thinking Bitcoin was a scam to understanding its value
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-zinc-400 mb-3">
              "I remember laughing at my friend when he told me about Bitcoin in 2017. 
              'Digital money that isn't backed by anything?' I thought he was crazy..."
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Posted 2 days ago by @sarah_learns</span>
              <Button variant="ghost" size="sm" className="text-xs px-3 py-1">Read More</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Convincing My Family</span>
              <Badge variant="outline" className="text-xs">Popular</Badge>
            </CardTitle>
            <CardDescription className="text-sm">
              The challenges and breakthroughs of orange-pilling loved ones
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-zinc-400 mb-3">
              "My parents thought I had joined a cult when I started talking about Bitcoin. 
              Here's how I gradually helped them understand..."
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Posted 1 week ago by @mike_hodler</span>
              <Button variant="ghost" size="sm" className="text-xs px-3 py-1">Read More</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center py-6">
        <Button className="bg-orange-500 hover:bg-orange-600 text-sm px-6">
          Share Your Story
        </Button>
      </div>
    </div>
  );
}