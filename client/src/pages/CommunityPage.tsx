import { useState } from "react";
import { useLocation } from "wouter";
import { MessageSquare, Video, Users, BookOpen, Trophy, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";

type CommunitySubTab = "overview" | "forums" | "videos" | "stories";

export default function CommunityPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<CommunitySubTab>("overview");

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-orange-500">Community</h1>
              <p className="text-zinc-400 text-sm">Connect, learn, and grow together</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={activeTab === "overview" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("overview")}
                className={activeTab === "overview" ? "bg-orange-500 hover:bg-orange-600" : ""}
              >
                Overview
              </Button>
              <Button
                variant={activeTab === "forums" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("forums")}
                className={activeTab === "forums" ? "bg-orange-500 hover:bg-orange-600" : ""}
              >
                Forums
              </Button>
              <Button
                variant={activeTab === "videos" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("videos")}
                className={activeTab === "videos" ? "bg-orange-500 hover:bg-orange-600" : ""}
              >
                Videos
              </Button>
              <Button
                variant={activeTab === "stories" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("stories")}
                className={activeTab === "stories" ? "bg-orange-500 hover:bg-orange-600" : ""}
              >
                Stories
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === "overview" && <CommunityOverview setActiveTab={setActiveTab} />}
        {activeTab === "forums" && <ForumsSection />}
        {activeTab === "videos" && <VideosSection />}
        {activeTab === "stories" && <StoriesSection />}
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
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold mb-4">Welcome to the HODLearn Community</h2>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Join thousands of Bitcoin learners on their journey to understanding and conviction. 
          Share experiences, ask questions, and learn from others who've walked this path.
        </p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">2,847</div>
            <div className="text-zinc-400 text-sm">Active Learners</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">12,394</div>
            <div className="text-zinc-400 text-sm">Forum Posts</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6 text-center">
            <Video className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">156</div>
            <div className="text-zinc-400 text-sm">Curated Videos</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6 text-center">
            <Trophy className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">891</div>
            <div className="text-zinc-400 text-sm">Success Stories</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-colors cursor-pointer"
          onClick={() => setActiveTab("forums")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-orange-500" />
              Daily Discussions
            </CardTitle>
            <CardDescription>
              Join discussions about today's Bitcoin lesson and ask questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-zinc-400">
                Latest: Day 5 - Store of Value
              </div>
              <ArrowRight className="h-4 w-4 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-colors cursor-pointer"
          onClick={() => setActiveTab("videos")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-orange-500" />
              Curated Videos
            </CardTitle>
            <CardDescription>
              Hand-picked YouTube content to deepen your understanding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-zinc-400">
                Trending: Why Bitcoin Matters
              </div>
              <ArrowRight className="h-4 w-4 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-colors cursor-pointer"
          onClick={() => setActiveTab("stories")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-orange-500" />
              Success Stories
            </CardTitle>
            <CardDescription>
              Read how others built Bitcoin conviction and overcame challenges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-zinc-400">
                Latest: From Skeptic to Believer
              </div>
              <ArrowRight className="h-4 w-4 text-orange-500" />
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
      <div className="text-center py-6">
        <h2 className="text-2xl font-bold mb-2">Community Forums</h2>
        <p className="text-zinc-400">Connect with fellow Bitcoin learners</p>
      </div>

      {/* Forum Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Getting Started</span>
              <Badge variant="secondary">1,247 posts</Badge>
            </CardTitle>
            <CardDescription>
              New to Bitcoin? Ask your beginner questions here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-zinc-400">
              Latest: "Is Bitcoin actually secure?" - 2 hours ago
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Daily Lesson Discussions</span>
              <Badge variant="secondary">3,891 posts</Badge>
            </CardTitle>
            <CardDescription>
              Discuss today's lesson with other learners
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-zinc-400">
              Latest: "Day 15 - Mining Discussion" - 1 hour ago
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Technical Deep Dives</span>
              <Badge variant="secondary">567 posts</Badge>
            </CardTitle>
            <CardDescription>
              Advanced Bitcoin topics and technical discussions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-zinc-400">
              Latest: "Lightning Network routing" - 4 hours ago
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Local Meetups</span>
              <Badge variant="secondary">234 posts</Badge>
            </CardTitle>
            <CardDescription>
              Find and organize Bitcoin meetups in your area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-zinc-400">
              Latest: "NYC Bitcoin Meetup - Jan 15" - 6 hours ago
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center py-8">
        <Button className="bg-orange-500 hover:bg-orange-600">
          Create New Discussion
        </Button>
      </div>
    </div>
  );
}

function VideosSection() {
  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h2 className="text-2xl font-bold mb-2">Curated Video Library</h2>
        <p className="text-zinc-400">Hand-picked content to enhance your learning</p>
      </div>

      {/* Video Categories */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Badge className="bg-green-600">Beginner</Badge>
            Foundation Videos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Video cards would go here */}
            <Card className="bg-zinc-900 border-zinc-800">
              <div className="aspect-video bg-zinc-800 rounded-t-lg flex items-center justify-center">
                <Video className="h-12 w-12 text-zinc-600" />
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">What is Bitcoin?</h4>
                <p className="text-sm text-zinc-400 mb-2">Andreas Antonopoulos</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">15 min</span>
                  <Badge variant="outline" className="text-xs">Popular</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Badge className="bg-yellow-600">Intermediate</Badge>
            Economics & Monetary Theory
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <div className="aspect-video bg-zinc-800 rounded-t-lg flex items-center justify-center">
                <Video className="h-12 w-12 text-zinc-600" />
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">The Fiat Standard</h4>
                <p className="text-sm text-zinc-400 mb-2">Saifedean Ammous</p>
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
      <div className="text-center py-6">
        <h2 className="text-2xl font-bold mb-2">Bitcoin Journey Stories</h2>
        <p className="text-zinc-400">Real experiences from the community</p>
      </div>

      {/* Story Categories */}
      <div className="space-y-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>From Skeptic to Believer</span>
              <Badge variant="outline">New</Badge>
            </CardTitle>
            <CardDescription>
              How I went from thinking Bitcoin was a scam to understanding its value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-400 mb-3">
              "I remember laughing at my friend when he told me about Bitcoin in 2017. 
              'Digital money that isn't backed by anything?' I thought he was crazy..."
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Posted 2 days ago by @sarah_learns</span>
              <Button variant="ghost" size="sm">Read More</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Convincing My Family</span>
              <Badge variant="outline">Popular</Badge>
            </CardTitle>
            <CardDescription>
              The challenges and breakthroughs of orange-pilling loved ones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-400 mb-3">
              "My parents thought I had joined a cult when I started talking about Bitcoin. 
              Here's how I gradually helped them understand..."
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Posted 1 week ago by @mike_hodler</span>
              <Button variant="ghost" size="sm">Read More</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center py-8">
        <Button className="bg-orange-500 hover:bg-orange-600">
          Share Your Story
        </Button>
      </div>
    </div>
  );
}