import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-white">About HODLearn</h3>
        <p className="text-zinc-400">Why we built this</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="space-y-4 text-zinc-300 leading-relaxed text-center">
            <p>
              Bitcoin felt overwhelming at first. So I took it <span className="text-orange-400 font-medium">one small step at a time</span>. 
              Every day, just a little bit more.
            </p>
            
            <p>
              Slowly, those small daily steps built <span className="text-orange-400 font-medium">genuine understanding and conviction</span>. 
              Not because someone told me what to think, but because I built the knowledge myself.
            </p>
            
            <p className="text-zinc-400 text-sm">
              If this approach worked for me, it can work for you too.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}