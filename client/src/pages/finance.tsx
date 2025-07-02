import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Calculator, BarChart3 } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";

export default function Finance() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 p-4">
        <h1 className="text-2xl font-bold">Why Bitcoin?</h1>
        <p className="text-zinc-400 mt-1">
          Understand why Bitcoin matters in today's economy
        </p>
      </header>

      <main className="p-4 pb-20">
        <div className="space-y-6">
          {/* Introduction */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">The Silent Theft</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                Every day, your money loses value. Not because you're spending it, but because governments print more of it. This is inflation - a hidden tax that takes your purchasing power without you noticing.
              </p>
              <p className="text-zinc-400">
                Bitcoin offers a different approach: fixed supply, no printing, and true ownership of your wealth.
              </p>
            </CardContent>
          </Card>

          {/* Key Problems */}
          <div className="grid gap-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-6 h-6 text-red-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-zinc-200 mb-2">Inflation Erodes Savings</h3>
                    <p className="text-zinc-400 text-sm">
                      The dollar has lost 96% of its purchasing power since 1913. What cost $1 then costs $33 today.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Calculator className="w-6 h-6 text-red-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-zinc-200 mb-2">Hidden Banking Fees</h3>
                    <p className="text-zinc-400 text-sm">
                      Wire transfers, international payments, and account maintenance fees drain your wealth.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-6 h-6 text-red-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-zinc-200 mb-2">Slow Settlement</h3>
                    <p className="text-zinc-400 text-sm">
                      Bank transfers take 3-5 days. International payments can take weeks.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bitcoin Solution */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 text-orange-500">The Bitcoin Solution</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-3"></div>
                  <div>
                    <h4 className="font-semibold text-zinc-200">Fixed Supply</h4>
                    <p className="text-zinc-400 text-sm">Only 21 million Bitcoin will ever exist. No printing, no inflation.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-3"></div>
                  <div>
                    <h4 className="font-semibold text-zinc-200">Fast & Cheap</h4>
                    <p className="text-zinc-400 text-sm">Send money anywhere in the world in minutes, not days.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-3"></div>
                  <div>
                    <h4 className="font-semibold text-zinc-200">True Ownership</h4>
                    <p className="text-zinc-400 text-sm">Your Bitcoin, your keys, your control. No bank required.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-orange-600/10 to-orange-500/10 border-orange-600/30">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Ready to Learn More?</h3>
              <p className="text-zinc-400 mb-4">
                Understanding Bitcoin takes time. Start your journey with our structured daily lessons.
              </p>
              <div className="text-orange-500 font-medium">
                Explore our Learn section to begin
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}