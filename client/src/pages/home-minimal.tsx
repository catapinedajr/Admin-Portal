import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Bitcoin, BookOpen, Calculator, Info } from 'lucide-react';

export default function HomeMinimal() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bitcoin className="w-10 h-10 text-orange-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">HODLearn</h1>
          <p className="text-zinc-400 text-lg">Your Bitcoin Learning Journey</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Card className="bg-zinc-800 border-zinc-700 hover:border-orange-500/50 transition-colors">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Learn</h3>
              <p className="text-zinc-400 text-sm mb-4">Daily Bitcoin lessons</p>
              <Button 
                onClick={() => setLocation('/learn')}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Start Learning
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800 border-zinc-700 hover:border-orange-500/50 transition-colors">
            <CardContent className="p-6 text-center">
              <Calculator className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Simulators</h3>
              <p className="text-zinc-400 text-sm mb-4">Practice safely</p>
              <Button 
                onClick={() => setLocation('/simulators')}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Try Simulators
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800 border-zinc-700 hover:border-orange-500/50 transition-colors">
            <CardContent className="p-6 text-center">
              <Bitcoin className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Why Bitcoin</h3>
              <p className="text-zinc-400 text-sm mb-4">Understand the basics</p>
              <Button 
                onClick={() => setLocation('/money')}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Learn Why
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800 border-zinc-700 hover:border-orange-500/50 transition-colors">
            <CardContent className="p-6 text-center">
              <Info className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">About</h3>
              <p className="text-zinc-400 text-sm mb-4">Our story</p>
              <Button 
                onClick={() => setLocation('/about')}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Read More
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Temporary Notice */}
        <Card className="bg-orange-900/20 border-orange-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-orange-200 text-sm">
              Welcome to HODLearn! Use the navigation above to access all features.
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}