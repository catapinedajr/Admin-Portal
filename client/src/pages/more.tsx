import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  ShoppingCart, 
  Info, 
  ExternalLink,
  ArrowRight,
  Shield,
  Globe
} from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { useLocation } from "wouter";

export default function More() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 p-4">
        <h1 className="text-2xl font-bold">More</h1>
        <p className="text-zinc-400 mt-1">
          Additional tools and resources for your Bitcoin journey
        </p>
      </header>

      <main className="p-4 pb-20">
        <div className="space-y-6">
          {/* Tools & Resources */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-300">Tools & Resources</h2>
            
            <Card className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800/50 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-orange-500" />
                    <div>
                      <h3 className="font-semibold text-zinc-200">Bitcoin Glossary</h3>
                      <p className="text-zinc-400 text-sm">Essential Bitcoin terms and definitions</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-zinc-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800/50 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-orange-500" />
                    <div>
                      <h3 className="font-semibold text-zinc-200">Security Guide</h3>
                      <p className="text-zinc-400 text-sm">Learn how to keep your Bitcoin safe</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-zinc-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Store */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-300">Recommended Products</h2>
            
            <Card className="bg-zinc-900 border-zinc-800 relative overflow-hidden">
              {/* Coming Soon Overlay */}
              <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="text-center">
                  <ShoppingCart className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                  <h3 className="text-xl font-bold text-orange-500 mb-1">Coming Soon</h3>
                  <p className="text-zinc-400 text-sm">Bitcoin hardware and book recommendations</p>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-orange-500" />
                  <div>
                    <h3 className="font-semibold text-zinc-200">Bitcoin Store</h3>
                    <p className="text-zinc-400 text-sm">Hardware wallets, books, and educational materials</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-300">Information</h2>
            
            <Card 
              className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800/50 transition-colors cursor-pointer"
              onClick={() => setLocation("/about")}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Info className="w-6 h-6 text-orange-500" />
                    <div>
                      <h3 className="font-semibold text-zinc-200">About HODLearn</h3>
                      <p className="text-zinc-400 text-sm">Our story and mission</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-zinc-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800/50 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-6 h-6 text-orange-500" />
                    <div>
                      <h3 className="font-semibold text-zinc-200">Support</h3>
                      <p className="text-zinc-400 text-sm">Get help and contact us</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-zinc-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Educational Notice */}
          <Card className="bg-gradient-to-r from-blue-600/10 to-blue-500/10 border-blue-600/30">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="font-semibold text-blue-200 mb-2">Educational Purpose</h3>
                <p className="text-blue-300/80 text-sm">
                  HODLearn is for educational purposes only. Not financial advice. Always do your own research.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}