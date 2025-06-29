import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowRight, Clock, Users, Target, Heart } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-bold">
              HL
            </div>
            <div>
              <h1 className="text-2xl font-bold">About HODLearn</h1>
              <p className="text-zinc-400">The story behind how to learn Bitcoin</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Origin Story */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-orange-600/20 rounded-lg">
                <Heart className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Why We Built HODLearn</h2>
                <p className="text-zinc-400">A personal journey from confusion to conviction</p>
              </div>
            </div>
            
            <div className="space-y-4 text-zinc-300 leading-relaxed">
              <p>
                Three years ago, we were those people staring at Bitcoin charts at 2 AM, completely overwhelmed. 
                Every article felt like it was written for computer scientists. Every explanation assumed we already 
                knew what a "hash" was. We wanted to understand this technology that everyone said would change the 
                world, but felt like we needed a PhD just to get started.
              </p>
              
              <p>
                After months of jumping between YouTube videos, Reddit threads, and technical whitepapers, we realized 
                the problem wasn't us - it was how Bitcoin education was being taught. Everything was either too basic 
                ("Bitcoin is digital money!") or impossibly technical (cryptographic proofs and Byzantine fault tolerance).
              </p>
              
              <p>
                The turning point came when we started treating Bitcoin learning like learning to drive. You don't 
                start by rebuilding an engine - you start with the basics, practice in a safe environment, and 
                gradually build confidence. That's when HODLearn was born.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* HODL Philosophy */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-orange-600/20 rounded-lg">
                <Target className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">From HODL to HODLearn</h2>
                <p className="text-zinc-400">Why patience and conviction go hand in hand</p>
              </div>
            </div>
            
            <div className="space-y-4 text-zinc-300 leading-relaxed">
              <p>
                HODL started as a typo in a Bitcoin forum, but it became something much deeper - the discipline 
                to hold through uncertainty, to resist panic, to trust the long-term process even when things get 
                volatile. We realized that learning Bitcoin requires the exact same mindset.
              </p>
              
              <p>
                Just like HODLing Bitcoin requires patience and conviction, learning Bitcoin can't be rushed. 
                You can't cram your way to real understanding. True conviction comes from taking time to really 
                grasp why Bitcoin matters - not just memorizing facts, but building your own personal understanding.
              </p>
              
              <div className="bg-zinc-800/50 p-4 rounded-lg border-l-4 border-orange-500">
                <p className="font-medium text-white mb-2">What is Conviction?</p>
                <p className="text-sm text-zinc-400">
                  Conviction isn't blind faith - it's deep understanding earned through your own research and learning. 
                  When you truly understand why Bitcoin's 21 million supply matters, or how proof-of-work creates security, 
                  that knowledge becomes unshakeable. No one can give you conviction; you have to build it yourself.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Philosophy */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-orange-600/20 rounded-lg">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">The Daily Learning Philosophy</h2>
                <p className="text-zinc-400">Small steps, compound understanding</p>
              </div>
            </div>
            
            <div className="space-y-4 text-zinc-300 leading-relaxed">
              <p>
                We built HODLearn around this truth: real conviction comes from consistent, small efforts over time. 
                Just 5-10 minutes a day, every day, compounds into deep understanding. Like dollar-cost averaging 
                but for knowledge - steady accumulation that smooths out the complexity.
              </p>
              
              <p>
                Everyone's Bitcoin journey is different. Some start curious about technology, others worried about 
                inflation, others seeking financial freedom. There's no "right" pace or path. Our job isn't to rush 
                you - it's to meet you wherever you are and help you build understanding that makes sense for your life.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="bg-zinc-800/30 p-4 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Your Pace</h4>
                  <p className="text-sm text-zinc-400">
                    Learn at the speed that works for your life. No pressure, no deadlines.
                  </p>
                </div>
                <div className="bg-zinc-800/30 p-4 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Your Path</h4>
                  <p className="text-sm text-zinc-400">
                    Everyone starts from different places. We meet you where you are.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mission & Values */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-orange-600/20 rounded-lg">
                <Users className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Built for Real People</h2>
                <p className="text-zinc-400">Not crypto experts or computer scientists</p>
              </div>
            </div>
            
            <div className="space-y-4 text-zinc-300 leading-relaxed">
              <p>
                We built HODLearn for everyone who's ever felt intimidated by Bitcoin education. For the teacher 
                who wants to understand what her students are talking about. For the parent worried about their 
                kids and crypto. For anyone who knows Bitcoin matters but doesn't know where to start.
              </p>
              
              <p>
                Whether you're a teacher, parent, retiree, or student, the tools work the same way. Small daily 
                steps, your own pace, building conviction through understanding. We designed this to be usable 
                by anyone - no technical background required.
              </p>
              
              <p>
                This isn't just a business for us - it's personal. We remember the frustration, the confusion, 
                the feeling of being left behind. That's why every lesson is written like we're explaining it 
                to our own family.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => setLocation('/learn')}
                  className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
                >
                  Start Your Journey
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setLocation('/simulators')}
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  Try the Simulators
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
      
      {/* Bottom padding to accommodate navigation */}
      <div className="h-20"></div>
    </div>
  );
}