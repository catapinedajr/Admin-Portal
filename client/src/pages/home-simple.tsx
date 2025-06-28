import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bitcoin } from "lucide-react";

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-700/50 bg-zinc-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bitcoin className="w-8 h-8 text-orange-500" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  H<span className="text-orange-500">[₿]</span>DLearn
                </h1>
                <p className="text-xs text-zinc-400">Learn • HODL • Repeat</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-zinc-800/50 border-b border-zinc-700/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-center py-4">
            <div className="flex flex-wrap justify-center gap-2 bg-zinc-800/50 rounded-lg p-2">
              {["Learn", "Finance", "Simulators", "More"].map((section) => (
                <Button
                  key={section}
                  variant={activeSection === section.toLowerCase() ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveSection(section.toLowerCase())}
                  className="text-sm px-4 py-2"
                >
                  {section}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Card */}
          <Card className="bg-zinc-800/50 border-zinc-700 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <Bitcoin className="w-8 h-8 text-orange-500" />
                Welcome to HODLearn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-300 text-lg leading-relaxed">
                Your journey to understanding Bitcoin starts here. Learn the fundamentals, 
                explore financial concepts, and practice with our interactive simulators.
              </p>
              <div className="mt-6">
                <Button 
                  size="lg" 
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3"
                >
                  Start Learning
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-zinc-800/50 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Daily Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400">
                  Build knowledge with daily facts, lessons, and quizzes designed for gradual learning.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800/50 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Finance Education</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400">
                  Understand how Bitcoin compares to traditional financial systems.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800/50 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Interactive Simulators</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400">
                  Practice with safe, educational tools that demonstrate Bitcoin concepts.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Status Message */}
          <div className="mt-8 text-center">
            <p className="text-zinc-500">
              Application successfully loaded and running on development server.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}