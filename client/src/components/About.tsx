import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, BookOpen } from "lucide-react";

export default function About() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-white">About HODLearn</h3>
        <p className="text-zinc-400">Why we built this learning platform</p>
      </div>

      {/* Creator's Journey */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-white mb-3">A Personal Journey</h4>
            </div>
            
            <div className="space-y-3 text-zinc-300 leading-relaxed">
              <p>
                Bitcoin felt overwhelming at first. The technical jargon, the complex economics, the endless debates - it was hard to know where to start or who to trust.
              </p>
              
              <p>
                So I took it <span className="text-orange-400 font-medium">one small step at a time</span>. Every day, I'd learn just a little bit more. I'd read one article, watch one video, ask one question.
              </p>
              
              <p>
                Slowly, those small daily steps built something powerful: <span className="text-orange-400 font-medium">genuine understanding and conviction</span>. Not because someone told me what to think, but because I built the knowledge myself, piece by piece.
              </p>
              
              <p>
                That's when I realized - if this approach worked for me, it could work for others too. That's why we built HODLearn.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Philosophy */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <BookOpen className="w-6 h-6 text-orange-400 mt-1" />
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-white">Our Approach</h4>
              <p className="text-zinc-300 leading-relaxed">
                We believe in the power of <span className="text-orange-400 font-medium">consistent, small steps</span>. 
                No rushed decisions, no overwhelming information dumps. Just clear, accessible lessons 
                that build on each other, day by day.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                Because true conviction isn't built overnight - it's built through understanding. 
                And understanding comes from taking the time to learn properly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}