import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomeSimple() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="p-4 max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="text-orange-500 font-bold text-xl">HL</div>
            <span className="text-zinc-400 text-sm">How-to-learn BTC</span>
          </div>
          <div className="text-zinc-400 text-sm">
            HODLearn App
          </div>
        </header>

        {/* Main Content */}
        <main className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">
              Welcome to HODLearn
            </h1>
            <p className="text-zinc-400">
              Your Bitcoin education journey starts here
            </p>
          </div>

          {/* Learning Card */}
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold text-white">
                  Ready to Learn Bitcoin?
                </h2>
                <p className="text-zinc-300">
                  Start your educational journey with daily lessons and interactive content.
                </p>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Begin Learning
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Daily Lessons
                </h3>
                <p className="text-zinc-400">
                  Learn Bitcoin fundamentals through structured daily content
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Interactive Simulators
                </h3>
                <p className="text-zinc-400">
                  Practice Bitcoin concepts with hands-on simulation tools
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}