import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { 
  TrendingDown, 
  TrendingUp,
  ArrowRight,
  DollarSign,
  BarChart3
} from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";

export default function FinancePage() {
  const [, setLocation] = useLocation();

  // Money supply visualization state
  const [moneySupplyYear, setMoneySupplyYear] = useState(2025);
  
  // Inflation calculator state
  const [inflationAmount, setInflationAmount] = useState("10000");
  const [inflationRate, setInflationRate] = useState(4);
  const [inflationSliderYear, setInflationSliderYear] = useState(10);

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

  const getMoneySupplyForYear = (year: number): string => {
    return getMoneySupplyRaw(year).toFixed(1);
  };

  const getMoneySupplyMultiplier = (year: number): string => {
    return (getMoneySupplyRaw(year) / 0.023).toFixed(0);
  };

  const getPurchasingPowerRaw = (year: number): number => {
    // What $1 from 1920 is worth today (inverse of cumulative inflation)
    const dataPoints: { [key: number]: number } = {
      1920: 1.00, 1929: 1.00, 1933: 1.25, 1940: 0.90, 1945: 0.70,
      1950: 0.60, 1960: 0.50, 1971: 0.35, 1980: 0.20, 1990: 0.15,
      2000: 0.10, 2008: 0.08, 2010: 0.07, 2015: 0.065, 2020: 0.065,
      2021: 0.060, 2024: 0.065
    };
    
    const years = Object.keys(dataPoints).map(Number).sort();
    if (year <= years[0]) return dataPoints[years[0]];
    if (year >= years[years.length - 1]) return dataPoints[years[years.length - 1]];
    
    for (let i = 0; i < years.length - 1; i++) {
      if (year >= years[i] && year <= years[i + 1]) {
        const progress = (year - years[i]) / (years[i + 1] - years[i]);
        return dataPoints[years[i]] + progress * (dataPoints[years[i + 1]] - dataPoints[years[i]]);
      }
    }
    return dataPoints[2024];
  };

  const getHousePriceForYear = (year: number): number => {
    // Median home prices in the US - authentic historical data
    const dataPoints: { [key: number]: number } = {
      1920: 3200, 1930: 3900, 1940: 2900, 1950: 7400, 1960: 11900,
      1971: 25200, 1980: 64600, 1990: 122900, 2000: 169000, 2008: 247900,
      2010: 221800, 2015: 293400, 2020: 347500, 2021: 408800, 2022: 428700,
      2023: 436800, 2024: 442600
    };
    
    const years = Object.keys(dataPoints).map(Number).sort();
    if (year <= years[0]) return dataPoints[years[0]];
    if (year >= years[years.length - 1]) return dataPoints[years[years.length - 1]];
    
    for (let i = 0; i < years.length - 1; i++) {
      if (year >= years[i] && year <= years[i + 1]) {
        const progress = (year - years[i]) / (years[i + 1] - years[i]);
        return Math.round(dataPoints[years[i]] + progress * (dataPoints[years[i + 1]] - dataPoints[years[i]]));
      }
    }
    return dataPoints[2024];
  };

  const getMilkPriceForYear = (year: number): string => {
    // Average price per gallon of milk - authentic historical data
    const dataPoints: { [key: number]: number } = {
      1920: 0.56, 1930: 0.46, 1940: 0.52, 1950: 0.82, 1960: 0.97,
      1971: 1.18, 1980: 2.16, 1990: 2.78, 2000: 2.97, 2008: 3.87,
      2010: 3.26, 2015: 3.41, 2020: 3.54, 2021: 3.69, 2022: 4.33,
      2023: 4.05, 2024: 3.99
    };
    
    const years = Object.keys(dataPoints).map(Number).sort();
    if (year <= years[0]) return dataPoints[years[0]].toFixed(2);
    if (year >= years[years.length - 1]) return dataPoints[years[years.length - 1]].toFixed(2);
    
    for (let i = 0; i < years.length - 1; i++) {
      if (year >= years[i] && year <= years[i + 1]) {
        const progress = (year - years[i]) / (years[i + 1] - years[i]);
        const price = dataPoints[years[i]] + progress * (dataPoints[years[i + 1]] - dataPoints[years[i]]);
        return price.toFixed(2);
      }
    }
    return dataPoints[2024].toFixed(2);
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

        {/* Interactive Inflation Simulator */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="text-center space-y-2 mb-8">
              <h3 className="text-xl font-bold text-white">Interactive Inflation Destroyer</h3>
              <p className="text-zinc-400">Watch your money vanish in real-time as you move through the years</p>
            </div>

            <div className="space-y-8">
              {/* All Controls in One Row */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Money Amount Buttons */}
                <div className="space-y-3">
                  <label className="block text-white font-bold text-center">
                    Your Money: ${parseFloat(inflationAmount).toLocaleString() || '10,000'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1000, 5000, 10000, 25000, 50000, 100000].map((amount) => (
                      <Button
                        key={amount}
                        variant={inflationAmount === amount.toString() ? "default" : "outline"}
                        size="sm"
                        onClick={() => setInflationAmount(amount.toString())}
                        className={`text-xs py-2 ${
                          inflationAmount === amount.toString() 
                            ? "bg-orange-600 hover:bg-orange-700 text-white border-orange-600" 
                            : "border-zinc-700 text-zinc-300 hover:border-orange-500 hover:text-orange-300"
                        }`}
                      >
                        ${amount >= 1000 ? `${amount/1000}K` : amount}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Inflation Rate Selector Cards */}
                <div className="space-y-3">
                  <label className="block text-white font-bold text-center">
                    Annual Inflation Rate: {inflationRate}%
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        rate: 2,
                        title: "Fed Target",
                        description: "Government's 'ideal' inflation rate",
                        color: "blue",
                      },
                      {
                        rate: 4,
                        title: "Moderate Rise",
                        description: "Common in developing economies",
                        color: "yellow",
                      },
                      {
                        rate: 8.5,
                        title: "Recent Peak",
                        description: "US peak in June 2022",
                        color: "red",
                      },
                      {
                        rate: 15,
                        title: "Crisis Level",
                        description: "1980 peak under Carter",
                        color: "red",
                      }
                    ].map((scenario) => (
                      <Button
                        key={scenario.rate}
                        variant="outline"
                        onClick={() => setInflationRate(scenario.rate)}
                        className={`p-3 h-auto text-left ${
                          inflationRate === scenario.rate
                            ? "border-orange-500 bg-orange-500/10"
                            : "border-zinc-700 hover:border-orange-400"
                        }`}
                      >
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-white text-sm">{scenario.title}</span>
                            <span className="text-orange-300 font-bold text-sm">{scenario.rate}%</span>
                          </div>
                          <p className="text-zinc-400 text-xs leading-tight">{scenario.description}</p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Time Slider */}
              <div className="space-y-4">
                <label className="block text-white font-bold text-center">
                  Years of Inflation: {inflationSliderYear} years
                </label>
                <div className="px-4">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={inflationSliderYear}
                    onChange={(e) => setInflationSliderYear(parseInt(e.target.value))}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-zinc-400 mt-2">
                    <span>1 year</span>
                    <span>15 years</span>
                    <span>30 years</span>
                  </div>
                </div>
              </div>

              {/* Results Display */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-zinc-800 border-zinc-700">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-white mb-2">Original Amount</h4>
                    <p className="text-2xl font-bold text-green-400">
                      ${parseFloat(inflationAmount).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-800 border-zinc-700">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-white mb-2">Value After {inflationSliderYear} Years</h4>
                    <p className="text-2xl font-bold text-red-400">
                      ${Math.round(parseFloat(inflationAmount) / Math.pow(1 + inflationRate/100, inflationSliderYear)).toLocaleString()}
                    </p>
                    <p className="text-sm text-zinc-400 mt-1">
                      Lost: ${(parseFloat(inflationAmount) - Math.round(parseFloat(inflationAmount) / Math.pow(1 + inflationRate/100, inflationSliderYear))).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Historical Chart */}
              <Card className="bg-zinc-800 border-zinc-700">
                <CardContent className="p-4">
                  <h4 className="font-bold text-white mb-4">US Inflation Rate History (1970-2024)</h4>
                  <div className="h-40 bg-zinc-900 rounded-lg p-4">
                    <svg viewBox="0 0 400 120" className="w-full h-full">
                      {/* Grid lines */}
                      <defs>
                        <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="400" height="120" fill="url(#grid)" />
                      
                      {/* Inflation rate line */}
                      <path
                        d="M 20,60 L 40,40 L 60,30 L 80,25 L 100,35 L 120,45 L 140,65 L 160,55 L 180,70 L 200,75 L 220,80 L 240,85 L 260,88 L 280,90 L 300,85 L 320,75 L 340,60 L 360,45 L 380,55"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="2"
                      />
                      
                      {/* Key events markers */}
                      <circle cx="100" cy="35" r="3" fill="#ef4444" />
                      <text x="100" y="25" textAnchor="middle" fill="#ef4444" fontSize="8">1979-80</text>
                      <text x="100" y="15" textAnchor="middle" fill="#ef4444" fontSize="6">14.8%</text>
                      
                      <circle cx="340" cy="60" r="3" fill="#eab308" />
                      <text x="340" y="50" textAnchor="middle" fill="#eab308" fontSize="8">2022</text>
                      <text x="340" y="40" textAnchor="middle" fill="#eab308" fontSize="6">8.5%</text>
                    </svg>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400 mt-2">
                    <span>1970</span>
                    <span>1990</span>
                    <span>2010</span>
                    <span>2024</span>
                  </div>
                </CardContent>
              </Card>

              {/* Call to Action */}
              <Card className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border-orange-700/50">
                <CardContent className="p-6 text-center">
                  <h4 className="text-xl font-bold text-white mb-2">
                    This Is Why Bitcoin Matters
                  </h4>
                  <p className="text-zinc-300 mb-4">
                    Bitcoin's fixed 21 million supply means it can't be inflated away like fiat currency. 
                    Learn how to protect your wealth from this silent destruction.
                  </p>
                  <Button 
                    onClick={() => setLocation('/learn')}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Start Learning Bitcoin
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <BottomNavigation />
    </div>
  );
}