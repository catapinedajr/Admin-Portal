import { useAuth } from "@/hooks/useAuth";
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Emergency production fallback - minimal working version
export default function ProductionSafeHome() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-orange-400 font-bold text-xl">HL</div>
              <span className="text-zinc-400 text-sm">How-to-learn BTC</span>
            </div>
            <div className="text-sm text-zinc-400">
              Welcome, {user?.firstName || 'Bitcoin Learner'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-400 mb-4">
            Production Mode - HODLearn
          </h1>
          <p className="text-zinc-300 mb-6">
            Your Bitcoin learning journey continues here
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-orange-400">Daily Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-300 mb-4">
                Continue your Bitcoin education with today's lesson
              </p>
              <Button 
                onClick={() => setLocation('/learn')}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Start Learning
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-orange-400">About Bitcoin</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-300 mb-4">
                Learn why Bitcoin matters for your financial future
              </p>
              <Button 
                onClick={() => setLocation('/money')}
                variant="outline"
                className="border-orange-600 text-orange-400 hover:bg-orange-600"
              >
                Why Bitcoin?
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-orange-400">Practice Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-300 mb-4">
                Interactive simulators for hands-on learning
              </p>
              <Button 
                onClick={() => setLocation('/simulators')}
                variant="outline"
                className="border-orange-600 text-orange-400 hover:bg-orange-600"
              >
                Try Simulators
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-orange-400">More Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-300 mb-4">
                Books, tools, and additional learning materials
              </p>
              <Button 
                onClick={() => setLocation('/more')}
                variant="outline"
                className="border-orange-600 text-orange-400 hover:bg-orange-600"
              >
                Explore More
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Diagnostic Link */}
        <div className="text-center mt-8">
          <Button 
            onClick={() => setLocation('/diagnostic')}
            variant="ghost"
            className="text-zinc-500 hover:text-zinc-300"
          >
            System Diagnostic
          </Button>
        </div>
      </main>
    </div>
  );
}