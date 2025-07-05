import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  Calendar, 
  TrendingDown, 
  Star,
  ChevronDown
} from "lucide-react";

export default function HODLSimulator() {
  // Premium access - handled by parent component
  const isPremiumTier = true; // Assuming premium access for simulator

  // HODL Calculator State
  const [hodlInputs, setHodlInputs] = useState({
    initialAmount: 1000,
    scenario: 'jan2020',
    startPrice: 7200,
    endPrice: 94200,
    years: 5
  });

  const [hodlResults, setHodlResults] = useState<any>(null);

  // HODL calculation function
  const calculateHodlStrategy = () => {
    const { initialAmount, startPrice, endPrice, years } = hodlInputs;
    
    if (!initialAmount || !startPrice || !endPrice) return;

    const bitcoinPurchased = initialAmount / startPrice;
    const currentValue = bitcoinPurchased * endPrice;
    const totalGain = currentValue - initialAmount;
    const percentageReturn = ((endPrice / startPrice - 1) * 100);

    // Traditional investment comparisons
    const spReturn = years <= 5 ? 0.45 : years <= 7 ? 0.35 : 1.80; // Period-specific S&P 500 returns
    const spValue = initialAmount * (1 + spReturn);
    const realEstateReturn = years * 0.07;
    const realEstateValue = initialAmount * (1 + realEstateReturn);
    const goldReturn = years * 0.03;
    const goldValue = initialAmount * (1 + goldReturn);
    const savingsReturn = years * 0.01;
    const savingsValue = initialAmount * (1 + savingsReturn);

    setHodlResults({
      bitcoinPurchased,
      currentValue,
      totalGain,
      percentageReturn,
      traditional: {
        sp500: { value: spValue, return: spReturn * 100 },
        realEstate: { value: realEstateValue, return: realEstateReturn * 100 },
        gold: { value: goldValue, return: goldReturn * 100 },
        savings: { value: savingsValue, return: savingsReturn * 100 }
      }
    });
  };

  // Auto-calculate when inputs change
  useEffect(() => {
    if (hodlInputs.startPrice && hodlInputs.endPrice && hodlInputs.initialAmount) {
      calculateHodlStrategy();
    }
  }, [hodlInputs.startPrice, hodlInputs.endPrice, hodlInputs.initialAmount, hodlInputs.years]);

  if (!isPremiumTier) {
    return (
      <div className="text-center p-8 space-y-4">
        <TrendingUp className="w-16 h-16 text-zinc-600 mx-auto" />
        <h3 className="text-xl font-bold text-white">HODL Strategy Simulator</h3>
        <p className="text-zinc-400 mb-6">
          Test historical Bitcoin HODL scenarios and compare with traditional investments.
        </p>
        <Button
          onClick={() => window.location.href = "/"}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          Upgrade to Access
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Why HODL Strategy Matters */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
            <h4 className="text-xl font-bold text-white">The Power of Time in Market vs Timing the Market</h4>
          </div>
          
          <div className="space-y-4">
            <p className="text-zinc-300 leading-relaxed">
              Bitcoin's price swings can be extreme - dropping 80% in bear markets and rising 2000% in bull markets. 
              Most people try to time these movements perfectly, but history shows that simply holding through all 
              volatility (HODLing) often produces superior results with less stress and risk.
            </p>
            
            <div className="bg-zinc-800/50 rounded-lg p-4 border-l-4 border-orange-500">
              <p className="text-zinc-300 text-sm">
                <span className="font-semibold text-orange-300">Historical Truth:</span> Even if you bought Bitcoin 
                at the absolute peak of 2017 ($19,783), you would still be profitable today. Meanwhile, traders 
                trying to time the market often buy high, sell low, and miss the biggest gains.
              </p>
            </div>
            
            <div className="space-y-3">
              <h5 className="font-semibold text-white">Real Historical Scenarios You'll Test:</h5>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="font-medium text-white text-sm">COVID Crash</p>
                    <p className="text-zinc-400 text-xs">March 2020 panic buying opportunity</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="font-medium text-white text-sm">Bear Market</p>
                    <p className="text-zinc-400 text-xs">2018-2021 patience test period</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <Star className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="font-medium text-white text-sm">Early Adopter</p>
                    <p className="text-zinc-400 text-xs">2017-2025 ultimate diamond hands</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center pt-2">
              <Button
                onClick={() => {
                  const calculator = document.querySelector('[data-hodl-calculator]');
                  if (calculator) {
                    calculator.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
              >
                <ChevronDown className="w-4 h-4 mr-2" />
                Test HODL Scenarios
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* HODL Calculator Section */}
      <Card className="bg-zinc-900 border-zinc-800" data-hodl-calculator>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">HODL Calculator</h3>
            <p className="text-zinc-400">See how much your Bitcoin investment would be worth today</p>
          </div>

          {/* Always-Visible Chart Section */}
          <div className="mb-6">
            <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-white font-semibold">Bitcoin Performance Chart</h4>
                <div className="text-xs text-zinc-400">Jan 2017 - Jan 2025</div>
              </div>
              <div className="relative">
                <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 bg-zinc-900/50 rounded overflow-hidden">
                  <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                    {/* Grid background */}
                    <defs>
                      <pattern id="grid-hodl-chart" width="32" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 32 0 L 0 0 0 40" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-hodl-chart)" />
                    
                    {/* Bitcoin performance line (simplified representative path) */}
                    <path
                      d="M 10 180 L 50 170 L 90 160 L 130 140 L 170 30 L 210 120 L 250 70 L 290 50 L 330 35 L 370 20"
                      stroke="#f97316"
                      strokeWidth="3"
                      fill="none"
                      className="drop-shadow-lg"
                    />
                    
                    {/* Milestone labels */}
                    <text x="380" y="25" fill="#f97316" fontSize="12">$94K</text>
                    <text x="380" y="75" fill="#9ca3af" fontSize="12">$50K</text>
                    <text x="380" y="125" fill="#9ca3af" fontSize="12">$20K</text>
                    <text x="380" y="175" fill="#9ca3af" fontSize="12">$1K</text>
                    
                    {/* Time labels */}
                    <text x="10" y="195" fill="#9ca3af" fontSize="12">2017</text>
                    <text x="180" y="195" fill="#9ca3af" fontSize="12">2021</text>
                    <text x="370" y="195" fill="#9ca3af" fontSize="12">2025</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Investment Amount</label>
                <div className="grid grid-cols-3 gap-2">
                  {[100, 500, 1000, 5000, 10000, 25000].map((amount) => (
                    <Button
                      key={amount}
                      variant={hodlInputs.initialAmount === amount ? "default" : "outline"}
                      size="sm"
                      onClick={() => setHodlInputs(prev => ({...prev, initialAmount: amount}))}
                      className={`text-xs py-2 ${
                        hodlInputs.initialAmount === amount 
                          ? "bg-orange-600 hover:bg-orange-700 text-white border-orange-600" 
                          : "border-zinc-700 text-zinc-300 hover:border-orange-500 hover:text-orange-300"
                      }`}
                    >
                      ${amount >= 1000 ? `${amount/1000}K` : amount}
                    </Button>
                  ))}
                </div>
                <div className="text-center text-sm text-zinc-400 mt-1">
                  Selected: ${hodlInputs.initialAmount.toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Purchase Date</label>
                <Select
                  value={hodlInputs.scenario}
                  onValueChange={(value) => {
                    const scenarios: { [key: string]: { startPrice: number; endPrice: number; years: number; period: string } } = {
                      'jan2024': { startPrice: 42867, endPrice: 94200, years: 1, period: 'Jan 2024' },
                      'jan2023': { startPrice: 16625, endPrice: 94200, years: 2, period: 'Jan 2023' },
                      'jan2022': { startPrice: 46311, endPrice: 94200, years: 3, period: 'Jan 2022' },
                      'jan2021': { startPrice: 29374, endPrice: 94200, years: 4, period: 'Jan 2021' },
                      'jan2020': { startPrice: 7200, endPrice: 94200, years: 5, period: 'Jan 2020' },
                      'jan2019': { startPrice: 3784, endPrice: 94200, years: 6, period: 'Jan 2019' },
                      'jan2018': { startPrice: 13412, endPrice: 94200, years: 7, period: 'Jan 2018' },
                      'jan2017': { startPrice: 998, endPrice: 94200, years: 8, period: 'Jan 2017' },
                      'jan2016': { startPrice: 434, endPrice: 94200, years: 9, period: 'Jan 2016' },
                      'jan2015': { startPrice: 315, endPrice: 94200, years: 10, period: 'Jan 2015' }
                    };
                    
                    const scenario = scenarios[value];
                    setHodlInputs(prev => ({
                      ...prev,
                      scenario: value,
                      startPrice: scenario.startPrice,
                      endPrice: scenario.endPrice,
                      years: scenario.years
                    }));
                  }}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Select purchase date" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="jan2024">Jan 2024 (1 year holding)</SelectItem>
                    <SelectItem value="jan2023">Jan 2023 (2 years holding)</SelectItem>
                    <SelectItem value="jan2022">Jan 2022 (3 years holding)</SelectItem>
                    <SelectItem value="jan2021">Jan 2021 (4 years holding)</SelectItem>
                    <SelectItem value="jan2020">Jan 2020 (5 years holding)</SelectItem>
                    <SelectItem value="jan2019">Jan 2019 (6 years holding)</SelectItem>
                    <SelectItem value="jan2018">Jan 2018 (7 years holding)</SelectItem>
                    <SelectItem value="jan2017">Jan 2017 (8 years holding)</SelectItem>
                    <SelectItem value="jan2016">Jan 2016 (9 years holding)</SelectItem>
                    <SelectItem value="jan2015">Jan 2015 (10 years holding)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                <div className="text-xs text-zinc-400 space-y-1">
                  <p>Purchase Price: ${hodlInputs.startPrice.toLocaleString()}</p>
                  <p>Current Price: ${hodlInputs.endPrice.toLocaleString()}</p>
                  <p>Holding Period: {hodlInputs.years} years</p>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              {hodlResults ? (
                <>
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                    <h5 className="text-white font-semibold mb-3">Your HODL Results</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Initial Investment:</span>
                        <span className="text-white">${hodlInputs.initialAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Bitcoin Purchased:</span>
                        <span className="text-white">{hodlResults.bitcoinPurchased.toFixed(4)} BTC</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Current Value:</span>
                        <span className="text-orange-400 font-bold">${hodlResults.currentValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Total Gain:</span>
                        <span className="text-green-400 font-bold">+${hodlResults.totalGain.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Return:</span>
                        <span className="text-green-400 font-bold">+{hodlResults.percentageReturn.toLocaleString()}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Traditional Investment Comparison */}
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                    <h5 className="text-white font-semibold mb-3">vs Traditional Investments</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-zinc-900/50 rounded">
                        <p className="text-zinc-400 text-xs">S&P 500</p>
                        <p className="text-white font-medium">${hodlResults.traditional.sp500.value.toLocaleString()}</p>
                        <p className="text-zinc-400 text-xs">+{hodlResults.traditional.sp500.return.toFixed(1)}%</p>
                      </div>
                      <div className="text-center p-3 bg-zinc-900/50 rounded">
                        <p className="text-zinc-400 text-xs">Real Estate</p>
                        <p className="text-white font-medium">${hodlResults.traditional.realEstate.value.toLocaleString()}</p>
                        <p className="text-zinc-400 text-xs">+{hodlResults.traditional.realEstate.return.toFixed(1)}%</p>
                      </div>
                      <div className="text-center p-3 bg-zinc-900/50 rounded">
                        <p className="text-zinc-400 text-xs">Gold</p>
                        <p className="text-white font-medium">${hodlResults.traditional.gold.value.toLocaleString()}</p>
                        <p className="text-zinc-400 text-xs">+{hodlResults.traditional.gold.return.toFixed(1)}%</p>
                      </div>
                      <div className="text-center p-3 bg-zinc-900/50 rounded">
                        <p className="text-zinc-400 text-xs">Savings</p>
                        <p className="text-white font-medium">${hodlResults.traditional.savings.value.toLocaleString()}</p>
                        <p className="text-zinc-400 text-xs">+{hodlResults.traditional.savings.return.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center p-8 border border-zinc-700 rounded-lg border-dashed">
                  <TrendingUp className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-400">Select an investment amount and purchase date to see your HODL results</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}