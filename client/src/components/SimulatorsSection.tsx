import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  Calculator, 
  DollarSign, 
  Clock,
  Zap,
  Shield,
  ArrowRight,
  BarChart3,
  Coins,
  Bitcoin
} from "lucide-react";

export default function SimulatorsSection() {
  // DCA Calculator State
  const [dcaAmount, setDcaAmount] = useState(1000);
  const [dcaFrequency, setDcaFrequency] = useState("monthly");
  const [dcaTimeframe, setDcaTimeframe] = useState("2years");
  const [dcaStartDate, setDcaStartDate] = useState("2023-01");

  // HODL Simulator State
  const [hodlScenario, setHodlScenario] = useState("covid");
  const [hodlAmount, setHodlAmount] = useState(5000);

  // Inflation Simulator State
  const [inflationAmount, setInflationAmount] = useState(10000);
  const [inflationYears, setInflationYears] = useState(10);
  const [inflationRate, setInflationRate] = useState(2);

  // Settlement Simulator State
  const [settlementAmount, setSettlementAmount] = useState(1000);
  const [settlementDestination, setSettlementDestination] = useState("international");
  const [settlementDay, setSettlementDay] = useState("friday");

  // DCA Calculator Logic
  const dcaAmountOptions = [100, 250, 500, 1000, 2500, 5000];
  const dcaTimeframes = {
    "1year": 12,
    "2years": 24,
    "3years": 36,
    "5years": 60
  };

  const calculateDCA = () => {
    const months = dcaTimeframes[dcaTimeframe as keyof typeof dcaTimeframes];
    const totalInvested = dcaAmount * months;
    
    // Simplified Bitcoin price model (for demonstration)
    const averageGrowth = 0.15; // 15% monthly average (simplified)
    const finalValue = totalInvested * Math.pow(1 + averageGrowth, months / 12);
    const gainPercent = ((finalValue - totalInvested) / totalInvested * 100);
    
    return {
      totalInvested,
      finalValue,
      gainPercent
    };
  };

  // HODL Simulator Logic
  const hodlScenarios = {
    covid: {
      name: "COVID Crash",
      startPrice: 3800,
      endPrice: 69000,
      period: "Mar 2020 - Nov 2021",
      stressLevel: "Market Crash"
    },
    bear: {
      name: "Bear Market",
      startPrice: 69000,
      endPrice: 42000,
      period: "Nov 2021 - Jan 2025",
      stressLevel: "Bear Market"
    },
    early: {
      name: "Early Days",
      startPrice: 1000,
      endPrice: 42000,
      period: "Jan 2017 - Jan 2025",
      stressLevel: "Early Days"
    }
  };

  const calculateHODL = () => {
    const scenario = hodlScenarios[hodlScenario as keyof typeof hodlScenarios];
    const btcBought = hodlAmount / scenario.startPrice;
    const finalValue = btcBought * scenario.endPrice;
    const gainPercent = ((finalValue - hodlAmount) / hodlAmount * 100);
    
    // Traditional investments comparison
    const sp500Return = hodlScenario === "covid" ? 1.45 : hodlScenario === "bear" ? 1.35 : 2.8;
    const sp500Value = hodlAmount * sp500Return;
    const realEstateValue = hodlAmount * (hodlScenario === "covid" ? 1.25 : hodlScenario === "bear" ? 1.20 : 2.2);
    
    return {
      btcValue: finalValue,
      btcGain: gainPercent,
      sp500Value,
      realEstateValue,
      scenario
    };
  };

  // Inflation Calculator Logic
  const inflationRateOptions = [
    { value: 2, label: "Fed Target (2%)", description: "Official inflation target" },
    { value: 4, label: "Moderate Rise (4%)", description: "Elevated but manageable" },
    { value: 8.5, label: "Recent Peak (8.5%)", description: "2022 inflation high" },
    { value: 15, label: "Crisis Level (15%)", description: "1980s inflation crisis" }
  ];

  const calculateInflationImpact = () => {
    const realValue = inflationAmount / Math.pow(1 + inflationRate/100, inflationYears);
    const lostValue = inflationAmount - realValue;
    const lostPercent = (lostValue / inflationAmount) * 100;
    
    return {
      realValue,
      lostValue,
      lostPercent
    };
  };

  // Settlement Calculator Logic
  const calculateSettlement = () => {
    const isWeekend = settlementDay === "friday" || settlementDay === "saturday";
    const isInternational = settlementDestination === "international";
    
    // Traditional banking delays
    let bankingDays = isInternational ? 5 : 2;
    if (isWeekend) bankingDays += 2;
    
    // Bitcoin is always ~10 minutes
    const bitcoinMinutes = 10;
    
    // Cost calculations
    const bankingFees = isInternational ? settlementAmount * 0.05 : settlementAmount * 0.02; // 5% international, 2% domestic
    const bitcoinFees = settlementAmount * 0.001; // 0.1% Bitcoin fee
    
    return {
      bankingDays,
      bitcoinMinutes,
      bankingFees,
      bitcoinFees,
      savings: bankingFees - bitcoinFees,
      savingsPercent: ((bankingFees - bitcoinFees) / bankingFees) * 100
    };
  };

  const dcaResults = calculateDCA();
  const hodlResults = calculateHODL();
  const inflationResults = calculateInflationImpact();
  const settlementResults = calculateSettlement();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">Bitcoin Simulators</h2>
        <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
          Explore Bitcoin's potential with interactive calculators and real-world scenarios.
        </p>
      </div>

      {/* DCA Calculator */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-400" />
            Dollar-Cost Averaging Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Investment Amount</label>
              <div className="grid grid-cols-2 gap-2">
                {dcaAmountOptions.map((amount) => (
                  <Button
                    key={amount}
                    variant={dcaAmount === amount ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDcaAmount(amount)}
                    className={dcaAmount === amount 
                      ? "bg-orange-600 hover:bg-orange-700" 
                      : "border-zinc-700 text-zinc-400 hover:text-white"
                    }
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Frequency</label>
              <Select value={dcaFrequency} onValueChange={setDcaFrequency}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Time Period</label>
              <Select value={dcaTimeframe} onValueChange={setDcaTimeframe}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="1year">1 Year</SelectItem>
                  <SelectItem value="2years">2 Years</SelectItem>
                  <SelectItem value="3years">3 Years</SelectItem>
                  <SelectItem value="5years">5 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-zinc-800/50 p-6 rounded-lg">
            <h4 className="font-semibold text-white mb-4">DCA Strategy Results</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  ${dcaResults.totalInvested.toLocaleString()}
                </div>
                <div className="text-zinc-400">Total Invested</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  ${dcaResults.finalValue.toLocaleString()}
                </div>
                <div className="text-zinc-400">
                  Estimated Value (+{dcaResults.gainPercent.toFixed(0)}%)
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* HODL Simulator */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            HODL Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Investment Amount</label>
              <div className="grid grid-cols-3 gap-2">
                {[1000, 5000, 10000, 25000, 50000, 100000].map((amount) => (
                  <Button
                    key={amount}
                    variant={hodlAmount === amount ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHodlAmount(amount)}
                    className={hodlAmount === amount 
                      ? "bg-orange-600 hover:bg-orange-700" 
                      : "border-zinc-700 text-zinc-400 hover:text-white"
                    }
                  >
                    ${amount >= 1000 ? `${amount/1000}K` : amount}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Historical Scenario</label>
              <div className="space-y-2">
                {Object.entries(hodlScenarios).map(([key, scenario]) => (
                  <Button
                    key={key}
                    variant={hodlScenario === key ? "default" : "outline"}
                    onClick={() => setHodlScenario(key)}
                    className={`w-full justify-start ${hodlScenario === key 
                      ? "bg-orange-600 hover:bg-orange-700" 
                      : "border-zinc-700 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium">{scenario.name}</div>
                      <div className="text-xs opacity-70">{scenario.period}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-zinc-800/50 p-6 rounded-lg">
            <h4 className="font-semibold text-white mb-4">Investment Comparison</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-600/10 p-4 rounded-lg border border-orange-600/20">
                <div className="text-orange-400 font-medium">Bitcoin</div>
                <div className="text-2xl font-bold text-white">
                  ${hodlResults.btcValue.toLocaleString()}
                </div>
                <div className="text-orange-300">
                  +{hodlResults.btcGain.toFixed(0)}%
                </div>
              </div>
              <div className="bg-blue-600/10 p-4 rounded-lg border border-blue-600/20">
                <div className="text-blue-400 font-medium">S&P 500</div>
                <div className="text-2xl font-bold text-white">
                  ${hodlResults.sp500Value.toLocaleString()}
                </div>
                <div className="text-blue-300">
                  +{(((hodlResults.sp500Value - hodlAmount) / hodlAmount) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inflation Simulator */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-red-400" />
            Inflation Impact Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Starting Amount</label>
              <div className="grid grid-cols-3 gap-2">
                {[1000, 5000, 10000, 25000, 50000, 100000].map((amount) => (
                  <Button
                    key={amount}
                    variant={inflationAmount === amount ? "default" : "outline"}
                    size="sm"
                    onClick={() => setInflationAmount(amount)}
                    className={inflationAmount === amount 
                      ? "bg-orange-600 hover:bg-orange-700" 
                      : "border-zinc-700 text-zinc-400 hover:text-white"
                    }
                  >
                    ${amount >= 1000 ? `${amount/1000}K` : amount}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Inflation Rate</label>
              <div className="space-y-2">
                {inflationRateOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={inflationRate === option.value ? "default" : "outline"}
                    onClick={() => setInflationRate(option.value)}
                    className={`w-full justify-start ${inflationRate === option.value 
                      ? "bg-orange-600 hover:bg-orange-700" 
                      : "border-zinc-700 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs opacity-70">{option.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-zinc-800/50 p-6 rounded-lg">
            <h4 className="font-semibold text-white mb-4">Purchasing Power After {inflationYears} Years</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-white">
                  ${inflationResults.realValue.toLocaleString()}
                </div>
                <div className="text-zinc-400">Real Purchasing Power</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">
                  -${inflationResults.lostValue.toLocaleString()}
                </div>
                <div className="text-zinc-400">Value Lost to Inflation</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">
                  -{inflationResults.lostPercent.toFixed(1)}%
                </div>
                <div className="text-zinc-400">Percentage Lost</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settlement Simulator */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            Settlement Speed & Cost
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Amount</label>
              <Select value={settlementAmount.toString()} onValueChange={(value) => setSettlementAmount(Number(value))}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="100">$100</SelectItem>
                  <SelectItem value="500">$500</SelectItem>
                  <SelectItem value="1000">$1,000</SelectItem>
                  <SelectItem value="5000">$5,000</SelectItem>
                  <SelectItem value="10000">$10,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Destination</label>
              <Select value={settlementDestination} onValueChange={setSettlementDestination}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="domestic">Domestic</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Day of Week</label>
              <Select value={settlementDay} onValueChange={setSettlementDay}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                  <SelectItem value="saturday">Saturday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-600/10 p-6 rounded-lg border border-red-600/20">
              <h4 className="font-semibold text-red-400 mb-4">Traditional Banking</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Settlement Time:</span>
                  <span className="text-red-400 font-medium">{settlementResults.bankingDays} business days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Fees:</span>
                  <span className="text-red-400 font-medium">${settlementResults.bankingFees.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-600/10 p-6 rounded-lg border border-green-600/20">
              <h4 className="font-semibold text-green-400 mb-4">Bitcoin Network</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Settlement Time:</span>
                  <span className="text-green-400 font-medium">~{settlementResults.bitcoinMinutes} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Fees:</span>
                  <span className="text-green-400 font-medium">${settlementResults.bitcoinFees.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-600/10 p-4 rounded-lg border border-orange-600/20 text-center">
            <div className="text-orange-300 font-medium">
              Bitcoin saves you ${settlementResults.savings.toFixed(2)} ({settlementResults.savingsPercent.toFixed(0)}% less fees)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-orange-600/20 to-orange-800/20 border-orange-600/30">
        <CardContent className="p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold text-white">Ready to Start Your Bitcoin Journey?</h3>
          <p className="text-orange-100 text-lg">
            These simulations show Bitcoin's potential. Now learn how to get started safely.
          </p>
          <Button 
            size="lg" 
            className="bg-orange-600 hover:bg-orange-700 text-white"
            onClick={() => window.location.href = "/learn"}
          >
            Begin Learning
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}