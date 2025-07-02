import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Gamepad2, 
  Calculator, 
  TrendingUp, 
  Shield, 
  Zap, 
  ArrowRight 
} from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";

export default function Simulators() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 p-4">
        <h1 className="text-2xl font-bold">Bitcoin Simulators</h1>
        <p className="text-zinc-400 mt-1">
          Practice Bitcoin concepts in a safe environment
        </p>
      </header>

      <main className="p-4 pb-20">
        <div className="space-y-6">
          {/* Introduction */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Practice Makes Perfect</h2>
              <p className="text-zinc-300 leading-relaxed">
                Learn Bitcoin concepts through interactive simulations. No real money involved - just safe practice to build your understanding and confidence.
              </p>
            </CardContent>
          </Card>

          {/* Simulators Grid */}
          <div className="grid gap-4">
            <Card className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-zinc-200 mb-2">HODL Simulator</h3>
                    <p className="text-zinc-400 text-sm mb-3">
                      Experience different Bitcoin market scenarios and see how holding compares to traditional investments.
                    </p>
                    <Button size="sm" variant="outline" className="text-orange-500 border-orange-600/30">
                      Try HODL Challenge <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-zinc-200 mb-2">DCA Calculator</h3>
                    <p className="text-zinc-400 text-sm mb-3">
                      Explore dollar-cost averaging strategies with historical Bitcoin price data.
                    </p>
                    <Button size="sm" variant="outline" className="text-orange-500 border-orange-600/30">
                      Calculate Returns <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-zinc-200 mb-2">Transaction Simulator</h3>
                    <p className="text-zinc-400 text-sm mb-3">
                      Practice sending Bitcoin transactions with realistic fee calculations and timing.
                    </p>
                    <Button size="sm" variant="outline" className="text-orange-500 border-orange-600/30">
                      Practice Sending <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-zinc-200 mb-2">Security Training</h3>
                    <p className="text-zinc-400 text-sm mb-3">
                      Test your Bitcoin security knowledge with real-world scenarios and threats.
                    </p>
                    <Button size="sm" variant="outline" className="text-orange-500 border-orange-600/30">
                      Test Security Skills <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Educational Note */}
          <Card className="bg-gradient-to-r from-blue-600/10 to-blue-500/10 border-blue-600/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Gamepad2 className="w-6 h-6 text-blue-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-200 mb-2">Safe Learning Environment</h3>
                  <p className="text-blue-300/80 text-sm">
                    All simulators use test data and safe examples. No real Bitcoin or money is used in these educational tools.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}