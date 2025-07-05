import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Building2, Bitcoin } from "lucide-react";

export default function FeesSimulator() {
  // Banking Fees Calculator State
  const [monthlyFee, setMonthlyFee] = useState<string>("12");
  const [wireTransfers, setWireTransfers] = useState<string>("1");
  const [atmWithdrawals, setAtmWithdrawals] = useState<string>("4");
  const [atmFees, setAtmFees] = useState<string>("2");
  const [overdraftFees, setOverdraftFees] = useState<string>("1");
  const [internationalFees, setInternationalFees] = useState<string>("500");
  const [paperFees, setPaperFees] = useState<string>("5");
  const [creditCardFees, setCreditCardFees] = useState<string>("95");

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-white">Banking Fees Calculator</h3>
        <p className="text-zinc-400">See how much traditional banking really costs vs Bitcoin</p>
      </div>

      {/* Introduction Card */}
      <Card className="bg-gradient-to-r from-zinc-900 to-zinc-800 border-zinc-700">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <FileText className="w-8 h-8 text-orange-400 mt-1" />
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-white">The Hidden Cost of Traditional Banking</h4>
              <p className="text-zinc-300 leading-relaxed">
                Most people don't realize how much they pay in banking fees each year. The average American spends <span className="text-orange-400 font-semibold">$329 annually</span> on various banking fees, but heavy users of premium services can pay <span className="text-orange-400 font-semibold">thousands more</span>.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                This calculator helps you discover your real banking costs across all fee categories: account maintenance, wire transfers, ATM penalties, overdraft charges, international fees, paper statements, and credit card annual fees.
              </p>
              <div className="bg-zinc-800 rounded-lg p-4 border-l-4 border-orange-400">
                <p className="text-zinc-200 text-sm font-medium">
                  💡 <span className="text-orange-400">Pro Tip:</span> Bitcoin eliminates most of these fees entirely. Compare your current banking costs to see potential annual savings with Bitcoin's transparent, low-cost network.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Fee Calculator */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* User Input Controls */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Monthly Account Fees</label>
                <Select value={monthlyFee} onValueChange={setMonthlyFee}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="0">$0 (Online/Credit Union)</SelectItem>
                    <SelectItem value="12">$12 (Basic Checking)</SelectItem>
                    <SelectItem value="25">$25 (Premium Account)</SelectItem>
                    <SelectItem value="35">$35 (Premium Plus)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Wire Transfers per Month</label>
                <Select value={wireTransfers} onValueChange={setWireTransfers}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="0">0 transfers</SelectItem>
                    <SelectItem value="1">1 transfer</SelectItem>
                    <SelectItem value="2">2 transfers</SelectItem>
                    <SelectItem value="4">4 transfers</SelectItem>
                    <SelectItem value="8">8 transfers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">ATM Usage (Out-of-Network)</label>
                <Select value={atmFees} onValueChange={setAtmFees}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="0">0 times per month</SelectItem>
                    <SelectItem value="2">2 times per month</SelectItem>
                    <SelectItem value="4">4 times per month</SelectItem>
                    <SelectItem value="8">8 times per month</SelectItem>
                    <SelectItem value="15">15 times per month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Overdraft Incidents</label>
                <Select value={overdraftFees} onValueChange={setOverdraftFees}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="0">Never</SelectItem>
                    <SelectItem value="1">1 per month</SelectItem>
                    <SelectItem value="2">2 per month</SelectItem>
                    <SelectItem value="3">3 per month</SelectItem>
                    <SelectItem value="6">6 per month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">International Transactions</label>
                <Select value={internationalFees} onValueChange={setInternationalFees}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="0">None</SelectItem>
                    <SelectItem value="200">$200 per month</SelectItem>
                    <SelectItem value="500">$500 per month</SelectItem>
                    <SelectItem value="1000">$1,000 per month</SelectItem>
                    <SelectItem value="2000">$2,000 per month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Paper Statements & Checks</label>
                <Select value={paperFees} onValueChange={setPaperFees}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="0">All digital</SelectItem>
                    <SelectItem value="5">Paper statements</SelectItem>
                    <SelectItem value="15">Paper + check orders</SelectItem>
                    <SelectItem value="25">Full paper service</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Credit Card Annual Fees</label>
                <Select value={creditCardFees} onValueChange={setCreditCardFees}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="0">No annual fee cards</SelectItem>
                    <SelectItem value="95">$95 (Basic rewards card)</SelectItem>
                    <SelectItem value="250">$250 (Premium travel card)</SelectItem>
                    <SelectItem value="450">$450 (Chase Sapphire Reserve)</SelectItem>
                    <SelectItem value="550">$550 (Platinum Card)</SelectItem>
                    <SelectItem value="695">$695 (Business Platinum)</SelectItem>
                    <SelectItem value="950">$950 (Multiple premium cards)</SelectItem>
                    <SelectItem value="1500">$1,500 (Heavy credit card user)</SelectItem>
                    <SelectItem value="2500">$2,500+ (Credit card maximalist)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Overdraft Fees per Month</label>
                <Select value={overdraftFees} onValueChange={setOverdraftFees}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="0">0 overdrafts</SelectItem>
                    <SelectItem value="1">1 overdraft</SelectItem>
                    <SelectItem value="2">2 overdrafts</SelectItem>
                    <SelectItem value="3">3+ overdrafts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Comparison */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Traditional Banking Costs */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Building2 className="w-5 h-5 text-red-400" />
                  <h4 className="font-semibold text-white">Traditional Banking</h4>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Monthly Account:</span>
                    <span className="text-white">${monthlyFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Wire Transfers:</span>
                    <span className="text-white">${parseInt(wireTransfers) * 25}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">ATM Fees (Out-of-Network):</span>
                    <span className="text-white">${parseInt(atmFees) * 4.75}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Overdraft Penalties:</span>
                    <span className="text-white">${parseInt(overdraftFees) * 35}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">International Fees (3%):</span>
                    <span className="text-white">${Math.round(parseInt(internationalFees) * 0.03)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Paper Statements/Checks:</span>
                    <span className="text-white">${paperFees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Credit Card Annual Fee:</span>
                    <span className="text-white">${Math.round(parseInt(creditCardFees) / 12)}</span>
                  </div>
                  <hr className="border-red-500/30" />
                  <div className="flex justify-between font-semibold">
                    <span className="text-white">Monthly Total:</span>
                    <span className="text-red-400">${Math.round(
                      parseInt(monthlyFee) + 
                      parseInt(wireTransfers) * 25 + 
                      parseInt(atmFees) * 4.75 + 
                      parseInt(overdraftFees) * 35 +
                      parseInt(internationalFees) * 0.03 +
                      parseInt(paperFees) +
                      parseInt(creditCardFees) / 12
                    )}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-white">Annual Cost:</span>
                    <span className="text-red-400">${Math.round(
                      (parseInt(monthlyFee) + 
                      parseInt(wireTransfers) * 25 + 
                      parseInt(atmFees) * 4.75 + 
                      parseInt(overdraftFees) * 35 +
                      parseInt(internationalFees) * 0.03 +
                      parseInt(paperFees)) * 12 +
                      parseInt(creditCardFees)
                    )}</span>
                  </div>
                </div>
              </div>

              {/* Bitcoin Costs */}
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Bitcoin className="w-5 h-5 text-orange-400" />
                  <h4 className="font-semibold text-white">Bitcoin Network</h4>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Wallet Fees:</span>
                    <span className="text-white">$0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">On-Chain Transfers:</span>
                    <span className="text-white">${parseInt(wireTransfers) * 2}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Lightning Payments:</span>
                    <span className="text-white">${(parseInt(atmFees) * 0.01).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Overdrafts/Penalties:</span>
                    <span className="text-white">$0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">International (Same Rate):</span>
                    <span className="text-white">$0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Paper Statements:</span>
                    <span className="text-white">$0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Annual Fees:</span>
                    <span className="text-white">$0</span>
                  </div>
                  <hr className="border-orange-500/30" />
                  <div className="flex justify-between font-semibold">
                    <span className="text-white">Monthly Total:</span>
                    <span className="text-orange-400">${Math.round(parseInt(wireTransfers) * 2 + parseInt(atmFees) * 0.01)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-white">Annual Cost:</span>
                    <span className="text-orange-400">${Math.round((parseInt(wireTransfers) * 2 + parseInt(atmFees) * 0.01) * 12)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Savings Summary */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
              <h4 className="font-bold text-white mb-2">Your Annual Savings with Bitcoin</h4>
              <div className="text-3xl font-bold text-green-400">
                ${(() => {
                  const bankingTotal = Math.round(
                    (parseInt(monthlyFee) + 
                    parseInt(wireTransfers) * 25 + 
                    parseInt(atmFees) * 4.75 + 
                    parseInt(overdraftFees) * 35 +
                    parseInt(internationalFees) * 0.03 +
                    parseInt(paperFees)) * 12 +
                    parseInt(creditCardFees)
                  );
                  const bitcoinTotal = Math.round((parseInt(wireTransfers) * 2 + parseInt(atmFees) * 0.01) * 12);
                  return bankingTotal - bitcoinTotal;
                })()}
              </div>
              <p className="text-zinc-400 text-sm mt-2">
                That's {(() => {
                  const bankingTotal = Math.round(
                    (parseInt(monthlyFee) + 
                    parseInt(wireTransfers) * 25 + 
                    parseInt(atmFees) * 4.75 + 
                    parseInt(overdraftFees) * 35 +
                    parseInt(internationalFees) * 0.03 +
                    parseInt(paperFees)) * 12 +
                    parseInt(creditCardFees)
                  );
                  const bitcoinTotal = Math.round((parseInt(wireTransfers) * 2 + parseInt(atmFees) * 0.01) * 12);
                  const savings = bankingTotal - bitcoinTotal;
                  return bankingTotal > 0 ? Math.round((savings / bankingTotal) * 100) : 0;
                })()}% savings per year
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}