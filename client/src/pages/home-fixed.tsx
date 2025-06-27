// Fixed version of just the Finance section
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingDown, 
  Shield,
  DollarSign,
  TrendingUp
} from "lucide-react";

interface FinanceSectionProps {
  setActiveSection: (section: "learn" | "finance" | "simulations" | "more") => void;
}

export function FinanceSection({ setActiveSection }: FinanceSectionProps) {
  return (
    <div className="space-y-8">
      {/* Opening Hook */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">
                Your Money is Being Stolen
              </h2>
              <p className="text-zinc-300 text-lg max-w-3xl mx-auto leading-relaxed">
                Every day you wait, your savings lose purchasing power. It's not your fault—the system is rigged. 
                Central banks print money endlessly, devaluing your hard-earned dollars while the wealthy protect 
                themselves with assets that can't be printed.
              </p>
            </div>
            
            {/* Simplified Facts Grid */}
            <div className="grid gap-4 md:grid-cols-3 mt-8">
              <div className="p-4 bg-green-950/50 rounded-xl border border-green-800/50">
                <div className="text-green-300 font-bold text-xl">21 Million</div>
                <div className="text-green-400/80 text-sm">Bitcoin's Fixed Supply</div>
                <div className="text-zinc-400 text-xs mt-1">No central bank can print more</div>
              </div>
              
              <div className="p-4 bg-blue-950/50 rounded-xl border border-blue-800/50">
                <div className="text-blue-300 font-bold text-xl">100%</div>
                <div className="text-blue-400/80 text-sm">You Own Your Bitcoin</div>
                <div className="text-zinc-400 text-xs mt-1">No bank can freeze it</div>
              </div>
              
              <div className="p-4 bg-orange-900/40 rounded-xl border border-orange-600/50">
                <div className="text-orange-200 font-bold text-xl">Global</div>
                <div className="text-orange-300/90 text-sm">24/7 Access</div>
                <div className="text-zinc-400 text-xs mt-1">Send anywhere, anytime</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simplified Money Supply Impact */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center gap-3 text-xl">
            <TrendingDown className="w-5 h-5 text-red-400" />
            The Money Printing Explosion
          </CardTitle>
          <p className="text-zinc-400 text-sm">How abandoning the gold standard destroyed your purchasing power</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* 1971 Gold Standard Era */}
            <div className="p-6 bg-green-950/30 rounded-xl border border-green-800/50">
              <div className="text-center space-y-4">
                <div className="text-green-300 font-bold text-lg">1971: Gold Standard</div>
                <div className="space-y-2">
                  <div className="text-green-200 text-4xl font-bold">$583B</div>
                  <div className="text-zinc-300 text-sm">Total US money supply</div>
                </div>
                <div className="text-zinc-400 text-xs p-3 bg-zinc-800/50 rounded-lg">
                  Money backed by gold. Limited printing.
                </div>
              </div>
            </div>

            {/* 2024 Fiat Era */}
            <div className="p-6 bg-red-950/30 rounded-xl border border-red-800/50">
              <div className="text-center space-y-4">
                <div className="text-red-300 font-bold text-lg">2024: Fiat Money</div>
                <div className="space-y-2">
                  <div className="text-red-200 text-4xl font-bold">$21T</div>
                  <div className="text-zinc-300 text-sm">Total US money supply</div>
                </div>
                <div className="text-zinc-400 text-xs p-3 bg-zinc-800/50 rounded-lg">
                  Money created from nothing. Unlimited printing.
                </div>
              </div>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="p-6 bg-zinc-800 rounded-xl">
            <div className="text-center space-y-4">
              <div className="text-orange-300 font-bold text-xl">The Devastating Result</div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-orange-200 font-bold text-2xl">36x</div>
                  <div className="text-zinc-400 text-sm">Money supply growth</div>
                </div>
                <div className="text-center">
                  <div className="text-orange-200 font-bold text-2xl">96%</div>
                  <div className="text-zinc-400 text-sm">Purchasing power lost</div>
                </div>
                <div className="text-center">
                  <div className="text-orange-200 font-bold text-2xl">$25.43</div>
                  <div className="text-zinc-400 text-sm">What $1 from 1971 costs today</div>
                </div>
              </div>
              <div className="text-zinc-300 text-sm max-w-2xl mx-auto pt-4 border-t border-zinc-700">
                This is why your money buys less every year. This is why you need Bitcoin.
              </div>
            </div>
          </div>

          {/* CTA after shocking stats */}
          <div className="text-center">
            <button 
              onClick={() => setActiveSection("learn")}
              className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
            >
              Learn How Bitcoin Fixes This
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Simplified Bank Comparison */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center gap-3 text-xl">
            <TrendingDown className="w-5 h-5 text-red-400" />
            Why Banks Love Inflation
          </CardTitle>
          <p className="text-zinc-400 text-sm">You lose, they profit</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Your Savings */}
            <div className="p-6 bg-red-950/30 rounded-xl border border-red-800/50">
              <div className="text-center space-y-4">
                <div className="text-red-300 font-bold text-lg">Your Savings Account</div>
                <div className="space-y-3">
                  <div className="text-red-200 text-4xl font-bold">$25,000</div>
                  <div className="text-zinc-300 text-sm">What you save today</div>
                  <div className="border-t border-red-800/50 pt-3">
                    <div className="text-red-200 text-2xl font-bold">$13,000</div>
                    <div className="text-zinc-400 text-xs">Buying power in 20 years</div>
                  </div>
                </div>
                <div className="text-zinc-400 text-xs p-3 bg-zinc-800/50 rounded-lg">
                  Your money loses value while you sleep
                </div>
              </div>
            </div>

            {/* Bank Profits */}
            <div className="p-6 bg-green-950/30 rounded-xl border border-green-800/50">
              <div className="text-center space-y-4">
                <div className="text-green-300 font-bold text-lg">Bank's Profit</div>
                <div className="space-y-3">
                  <div className="text-green-200 text-4xl font-bold">$25,000</div>
                  <div className="text-zinc-300 text-sm">What they lend at 7%</div>
                  <div className="border-t border-green-800/50 pt-3">
                    <div className="text-green-200 text-2xl font-bold">$97,000</div>
                    <div className="text-zinc-400 text-xs">What they collect in 20 years</div>
                  </div>
                </div>
                <div className="text-zinc-400 text-xs p-3 bg-zinc-800/50 rounded-lg">
                  They profit while paying you 0.5%
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Line */}
          <div className="p-6 bg-zinc-800 rounded-xl text-center">
            <div className="text-orange-300 font-bold text-xl mb-3">The System is Rigged</div>
            <div className="text-zinc-300 text-sm max-w-2xl mx-auto">
              Banks pay you pennies while lending your money for massive profits. 
              Bitcoin gives you control of your money and a hedge against inflation.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final CTA */}
      <Card className="bg-gradient-to-r from-orange-950/30 to-zinc-900 border-orange-800/50">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Ready to Master Bitcoin?</h3>
              <p className="text-zinc-300 max-w-2xl mx-auto">
                Join thousands of people transforming their financial future with our comprehensive Bitcoin education program.
              </p>
            </div>

            {/* What's Included */}
            <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
              <div className="p-4 bg-zinc-800/50 rounded-lg">
                <div className="text-orange-400 font-bold text-lg mb-2">📚 Daily Lessons</div>
                <div className="text-zinc-300 text-sm">
                  5-minute lessons every day, building from basics to advanced concepts with progress tracking
                </div>
              </div>
              <div className="p-4 bg-zinc-800/50 rounded-lg">
                <div className="text-orange-400 font-bold text-lg mb-2">⚡ Interactive Simulators</div>
                <div className="text-zinc-300 text-sm">
                  Practice with DCA calculators, transaction builders, and realistic trading scenarios
                </div>
              </div>
              <div className="p-4 bg-zinc-800/50 rounded-lg">
                <div className="text-orange-400 font-bold text-lg mb-2">🎯 Personal Progress</div>
                <div className="text-zinc-300 text-sm">
                  Track your learning streak, quiz scores, and knowledge mastery across all Bitcoin topics
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="space-y-4">
              <div className="text-orange-300 font-medium">Join 12,847 people already learning</div>
              <div className="flex justify-center items-center gap-8 text-zinc-400 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>4.9/5 rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>89% completion rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>No ads, ever</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setActiveSection("learn")}
                className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors text-lg"
              >
                Start Free Today
              </button>
              <button 
                onClick={() => setActiveSection("simulations")}
                className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg border border-zinc-600 transition-colors"
              >
                Try Simulators
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}