import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Info, ShoppingCart, Clock, Heart, User, Settings, LogOut } from "lucide-react";

interface MoreSectionProps {
  moreSubTab: string;
  setMoreSubTab: (tab: string) => void;
}

export default function MoreSection({ moreSubTab, setMoreSubTab }: MoreSectionProps) {
  const [, setLocation] = useLocation();
  
  return (
    <div className="space-y-6">
      {/* Account Section */}
      <Card className="bg-zinc-800/50 border-zinc-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-semibold">Account</h3>
          </div>
          <div className="space-y-3">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-700"
              onClick={() => setLocation('/account')}
            >
              <Settings className="w-4 h-4 mr-3" />
              Manage Account
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-700"
              onClick={() => window.location.href = '/api/logout'}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Log Out
            </Button>
          </div>
        </CardContent>
      </Card>

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
        <div className="text-center space-y-6">
          <div className="text-6xl font-bold text-orange-500/20 transform -rotate-12 select-none">
            COMING SOON
          </div>
          <div className="bg-zinc-900 rounded-lg p-8 border border-orange-500/30">
            <h3 className="text-2xl font-bold text-orange-400 mb-4">Store Opening Soon</h3>
            <p className="text-zinc-300 max-w-md mx-auto">
              We're curating the best Bitcoin hardware, books, and learning resources for you. 
              Check back soon for exclusive deals!
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