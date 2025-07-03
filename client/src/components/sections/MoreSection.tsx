import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Info, ShoppingCart, Clock, Heart } from "lucide-react";

interface MoreSectionProps {
  moreSubTab: string;
  setMoreSubTab: (tab: string) => void;
}

export default function MoreSection({ moreSubTab, setMoreSubTab }: MoreSectionProps) {
  return (
    <div className="space-y-6">
      {/* More Sub-navigation */}
      <div className="flex justify-center">
        <div className="flex flex-wrap justify-center gap-2 bg-zinc-800/50 rounded-lg p-2">
          <Button
            variant={moreSubTab === "about" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setMoreSubTab("about")}
            className="text-xs px-3 py-1"
          >
            <Info className="w-3 h-3 mr-1" />
            About Us
          </Button>
          <Button
            variant={moreSubTab === "store" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setMoreSubTab("store")}
            className="text-xs px-3 py-1"
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            Store
          </Button>
        </div>
      </div>

      {/* Store Section */}
      {moreSubTab === "store" && (
        <div className="relative space-y-6">
          {/* Coming Soon Watermark Overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-orange-500/20 transform -rotate-12 select-none">
                COMING SOON
              </div>
              <div className="bg-zinc-900/90 rounded-lg p-6 border border-orange-500/30">
                <h4 className="text-2xl font-bold text-orange-400 mb-2">Store Opening Soon</h4>
                <p className="text-zinc-300 max-w-md">
                  We're curating the best Bitcoin hardware, books, and learning resources for you. 
                  Check back soon for exclusive deals!
                </p>
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">Bitcoin Learning Store</h3>
            <p className="text-zinc-400">Essential tools and resources for your Bitcoin journey</p>
          </div>

          {/* Product Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Hardware Wallets */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <h4 className="text-lg font-bold text-white mb-4">Hardware Wallets</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                    <div>
                      <h5 className="font-semibold text-white">Ledger Nano X</h5>
                      <p className="text-sm text-zinc-400">Secure hardware wallet</p>
                    </div>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      $149
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                    <div>
                      <h5 className="font-semibold text-white">Trezor Model T</h5>
                      <p className="text-sm text-zinc-400">Advanced security features</p>
                    </div>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      $219
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Books */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <h4 className="text-lg font-bold text-white mb-4">Essential Reading</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                    <div>
                      <h5 className="font-semibold text-white">Broken Money by Lyn Alden</h5>
                      <p className="text-sm text-zinc-400">Modern monetary analysis</p>
                    </div>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      $25
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                    <div>
                      <h5 className="font-semibold text-white">The Bitcoin Standard</h5>
                      <p className="text-sm text-zinc-400">Bitcoin economics masterpiece</p>
                    </div>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      $20
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Affiliate Disclosure */}
          <div className="text-center">
            <p className="text-xs text-zinc-500">
              We may earn a commission from purchases made through these links. This helps support BTC Journey's educational mission.
            </p>
          </div>
        </div>
      )}

      {/* About Us Section */}
      {moreSubTab === "about" && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">About HODLearn</h3>
            <p className="text-zinc-400">The story behind how to learn Bitcoin</p>
          </div>

          {/* Full About Content */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-2xl mx-auto">
                HL
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xl font-bold">Why HODLearn?</h4>
                <p className="text-zinc-300 leading-relaxed">
                  Bitcoin learning was overwhelming and confusing. We created HODLearn to make it simple, 
                  daily, and accessible for everyone - no technical background required.
                </p>
                
                <p className="text-zinc-300 leading-relaxed">
                  Just like HODLing requires patience, learning Bitcoin takes time. Small daily steps 
                  build real understanding and lasting conviction.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Philosophy Summary */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-orange-400 mt-1" />
                  <div>
                    <h5 className="font-semibold text-white mb-1">Your Pace</h5>
                    <p className="text-sm text-zinc-400">
                      Everyone learns Bitcoin differently. We meet you where you are.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-orange-400 mt-1" />
                  <div>
                    <h5 className="font-semibold text-white mb-1">Built with Care</h5>
                    <p className="text-sm text-zinc-400">
                      Every lesson is written like we're explaining it to our own family.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}