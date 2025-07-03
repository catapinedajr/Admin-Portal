import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { 
  TrendingDown, 
  TrendingUp,
  ArrowRight
} from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";

export default function FinancePage() {
  const [, setLocation] = useLocation();

  // Money supply visualization state
  const [moneySupplyYear, setMoneySupplyYear] = useState(2025);

  // Money Supply Helper Functions
  const getMoneySupplyRaw = (year: number): number => {
    // Authentic M2 Money Supply data (in trillions) - 1920 to 2025
    const dataPoints: { [key: number]: number } = {
      1920: 0.023, 1929: 0.026, 1933: 0.020, 1940: 0.040, 1945: 0.107, 
      1950: 0.117, 1960: 0.167, 1971: 0.583, 1980: 1.600, 1990: 3.200, 
      2000: 4.900, 2008: 7.500, 2010: 8.700, 2015: 12.400, 2020: 15.400, 
      2021: 20.100, 2024: 21.000, 2025: 21.200
    };
    
    // Linear interpolation between known points
    const years = Object.keys(dataPoints).map(Number).sort();
    if (year <= years[0]) return dataPoints[years[0]];
    if (year >= years[years.length - 1]) return dataPoints[years[years.length - 1]];
    
    for (let i = 0; i < years.length - 1; i++) {
      if (year >= years[i] && year <= years[i + 1]) {
        const progress = (year - years[i]) / (years[i + 1] - years[i]);
        return dataPoints[years[i]] + progress * (dataPoints[years[i + 1]] - dataPoints[years[i]]);
      }
    }
    return dataPoints[2025];
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-6xl mx-auto p-4 space-y-8 pb-24">
        {/* Hero Narrative */}
        <Card className="bg-gradient-to-br from-orange-950/30 via-zinc-900 to-red-950/30 border-orange-800/50">
          <CardContent className="p-8">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h2 className="text-4xl font-bold text-white mb-4">
                Your Money Is Being <span className="text-red-400">Silently Stolen</span>
              </h2>
              
              <div className="text-lg text-zinc-300 leading-relaxed space-y-4">
                <p>
                  Every day you wait, your savings lose purchasing power. It's not your fault—the system is rigged. 
                  Central banks print money endlessly, devaluing your hard-earned dollars while the wealthy protect 
                  themselves with assets that can't be printed.
                </p>
                
                <p>
                  <span className="text-orange-400 font-semibold">What cost $1 in 1920 now costs $15.50.</span> Your 
                  great-grandparents could buy a house with one income and still save money. Today, two incomes barely 
                  cover rent. This isn't progress—it's systematic wealth transfer from savers to money printers.
                </p>
                
                <p>
                  But there's an escape route. For the first time in human history, we have <span className="text-orange-400 font-semibold">
                  mathematically perfect money</span> that can't be inflated away. Bitcoin isn't just digital gold—it's 
                  the antidote to monetary debasement.
                </p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3 mt-8">
                <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                  <div className="text-orange-300 font-bold text-xl">21 Million</div>
                  <div className="text-zinc-300 text-sm">Bitcoin's Maximum Supply</div>
                  <div className="text-zinc-400 text-xs mt-1">No central bank can print more</div>
                </div>
                
                <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                  <div className="text-orange-300 font-bold text-xl">0%</div>
                  <div className="text-zinc-300 text-sm">Bitcoin Inflation Rate</div>
                  <div className="text-zinc-400 text-xs mt-1">After all 21M are mined</div>
                </div>
                
                <div className="p-4 bg-orange-950/50 rounded-xl border border-orange-800/50">
                  <div className="text-orange-300 font-bold text-xl">100%</div>
                  <div className="text-orange-400/80 text-sm">You Own Your Bitcoin</div>
                  <div className="text-zinc-400 text-xs mt-1">No bank can freeze it</div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-orange-950/20 rounded-xl border border-orange-800/30">
                <div className="text-orange-300 font-semibold mb-2">
                  Choose: lose to inflation, or learn sound money.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Money Supply Erosion Visualization */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center gap-3 text-xl">
              <TrendingDown className="w-5 h-5 text-orange-400" />
              How Much Money Has Been Printed Over Time
            </CardTitle>
            <p className="text-zinc-400 text-sm">See how the government has created more and more dollars since 1920, making each dollar worth less</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Year Selection Buttons */}
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-orange-400 font-bold text-2xl">{moneySupplyYear}</span>
                <p className="text-zinc-400 text-sm mt-1">Select a year to explore</p>
              </div>
              
              {/* Clean milestone buttons */}
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { year: 1920, label: "'20", desc: "Gold Era" },
                  { year: 1971, label: "'71", desc: "Nixon" },
                  { year: 2000, label: "'00", desc: "Dot-com" },
                  { year: 2008, label: "'08", desc: "Crisis" },
                  { year: 2024, label: "'25", desc: "Today" }
                ].map((milestone) => (
                  <button
                    key={milestone.year}
                    onClick={() => setMoneySupplyYear(milestone.year)}
                    className={`p-2 rounded-md border transition-all duration-200 ${
                      moneySupplyYear === milestone.year
                        ? 'bg-orange-600/20 border-orange-500 text-orange-300'
                        : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
                    }`}
                  >
                    <div className="font-semibold text-sm">{milestone.label}</div>
                    <div className="text-xs opacity-75">{milestone.desc}</div>
                  </button>
                ))}
              </div>

              {/* Key Statistics Display */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-orange-400 transition-all duration-700">
                    ${getMoneySupplyRaw(moneySupplyYear).toFixed(1)}T
                  </div>
                  <div className="text-zinc-400 text-xs">Total Dollars in Circulation</div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-orange-400 transition-all duration-700">
                    {Math.round(getMoneySupplyRaw(moneySupplyYear) / getMoneySupplyRaw(1920))}x
                  </div>
                  <div className="text-zinc-400 text-xs">More Money Since 1920</div>
                </div>
              </div>
            </div>

            {/* Simplified Chart */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-400" />
                Total Supply of Dollars
              </h4>
              <div className="bg-zinc-800/50 rounded-lg p-6">
                <div className="relative h-56 w-full">
                  {/* Clean SVG Chart */}
                  <svg viewBox="0 0 400 220" className="w-full h-full">
                    {/* Simple background */}
                    <rect width="400" height="220" fill="transparent" />
                    
                    {/* X-axis labels */}
                    <text x="50" y="205" fill="#9ca3af" fontSize="10" textAnchor="middle">1920</text>
                    <text x="140" y="205" fill="#9ca3af" fontSize="10" textAnchor="middle">1960</text>
                    <text x="230" y="205" fill="#9ca3af" fontSize="10" textAnchor="middle">1990</text>
                    <text x="320" y="205" fill="#9ca3af" fontSize="10" textAnchor="middle">2010</text>
                    <text x="370" y="205" fill="#9ca3af" fontSize="10" textAnchor="middle">2025</text>
                    
                    {/* Money Supply Growth Line */}
                    <path
                      d="M 50,175 L 80,174 L 110,173 L 140,170 L 170,165 L 200,155 L 230,140 L 260,120 L 290,90 L 320,60 L 350,40 L 370,20"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="3"
                    />
                    
                    {/* Fill area under curve */}
                    <path
                      d="M 50,175 L 80,174 L 110,173 L 140,170 L 170,165 L 200,155 L 230,140 L 260,120 L 290,90 L 320,60 L 350,40 L 370,20 L 370,180 L 50,180 Z"
                      fill="url(#orangeGradient)"
                      opacity="0.3"
                    />
                    
                    {/* Gradient definition */}
                    <defs>
                      <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.6"/>
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0.1"/>
                      </linearGradient>
                    </defs>
                    
                    {/* Gold Standard Line */}
                    <line 
                      x1="140" 
                      y1="20" 
                      x2="140" 
                      y2="175" 
                      stroke="#f97316" 
                      strokeWidth="2" 
                      strokeDasharray="5,5"
                      opacity="0.6"
                    />
                    <text 
                      x="105" 
                      y="15" 
                      fill="#f97316" 
                      fontSize="8" 
                      fontWeight="bold"
                    >
                      Gold Standard Ends
                    </text>
                  </svg>
                </div>
                
                {/* Emphasis Text */}
                <div className="text-center mt-4 p-4 bg-zinc-800/30 rounded-lg border border-orange-400/20">
                  <div className="text-2xl font-bold">
                    <span className="text-zinc-300">THIS is </span>
                    <span className="text-orange-400 tracking-wider">INFLATION</span>
                  </div>
                  <p className="text-zinc-400 text-sm mt-2">
                    More dollars in circulation = each dollar is worth less
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-orange-950/50 to-red-950/50 border-orange-800/50">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold text-white mb-4">Ready to Learn Sound Money?</h3>
            <p className="text-zinc-300 mb-6">
              Discover how Bitcoin protects your wealth from monetary debasement
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => setLocation('/learn')}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Start Learning
              </Button>
              <Button 
                onClick={() => setLocation('/simulators')}
                variant="outline" 
                className="border-orange-500 text-orange-300 hover:bg-orange-950/50"
              >
                Try Simulators
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <BottomNavigation />
    </div>
  );
}