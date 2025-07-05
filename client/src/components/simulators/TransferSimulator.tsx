import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Building2, Bitcoin, Globe, Calendar, ChevronDown, Zap } from "lucide-react";

export function TransferSimulator() {
  const [speedRaceActive, setSpeedRaceActive] = useState(false);
  const [animationActive, setAnimationActive] = useState(false);
  const [settlementProgress, setSettlementProgress] = useState({
    traditional: 0,
    bitcoin: 0
  });

  const startSettlementAnimation = () => {
    setSpeedRaceActive(true);
    setAnimationActive(true);
    setSettlementProgress({ traditional: 0, bitcoin: 0 });

    // Bitcoin animation: completes all 4 steps in 18 seconds (exact original timing)
    const bitcoinSteps = [
      { step: 1, delay: 2400 },   // Step 1 at 2.4 seconds (transaction creation)
      { step: 2, delay: 6000 },   // Step 2 at 6 seconds (network broadcast)
      { step: 3, delay: 14400 },  // Step 3 at 14.4 seconds (mining consensus)
      { step: 4, delay: 18000 }   // Step 4 at 18 seconds (final settlement)
    ];

    // Traditional banking: takes much longer with realistic banking delays
    const traditionalSteps = [
      { step: 1, delay: 8000 },   // Step 1 at 8 seconds (bank visit takes longer)
      { step: 2, delay: 20000 },  // Step 2 at 20 seconds (compliance review)
      { step: 3, delay: 44000 },  // Step 3 at 44 seconds (SWIFT processing)
      { step: 4, delay: 70000 },  // Step 4 at 70 seconds (intermediary banks)
      { step: 5, delay: 86000 }   // Step 5 at 86 seconds (final settlement)
    ];

    // Animate Bitcoin steps
    bitcoinSteps.forEach(({ step, delay }) => {
      setTimeout(() => {
        setSettlementProgress(prev => ({ ...prev, bitcoin: step }));
      }, delay);
    });

    // Animate Traditional steps  
    traditionalSteps.forEach(({ step, delay }) => {
      setTimeout(() => {
        setSettlementProgress(prev => ({ ...prev, traditional: step }));
      }, delay);
    });
    
    // End animation after traditional completes
    setTimeout(() => {
      setAnimationActive(false);
    }, 10000);
  };

  const resetSettlementAnimation = () => {
    setSpeedRaceActive(false);
    setAnimationActive(false);
    setSettlementProgress({ traditional: 0, bitcoin: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-white">Transfer Settlement Simulator</h3>
        <p className="text-zinc-400">Experience the dramatic difference between traditional banking and Bitcoin transfers</p>
      </div>

      {/* Why Transfer Speed Matters */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
            <h4 className="text-xl font-bold text-white">Why Traditional Banking Settlement Is Broken</h4>
          </div>
          
          <div className="space-y-4">
            <p className="text-zinc-300 leading-relaxed">
              Traditional banking transforms a simple transfer into a complex multi-institution relay race that takes days to complete. 
              Your money passes through correspondent banks, clearing houses, and SWIFT networks - each adding delays, fees, and points of failure. 
              Bitcoin eliminates all intermediaries with direct, cryptographic settlement that works the same way globally.
            </p>
            
            <div className="bg-zinc-800/50 rounded-lg p-4 border-l-4 border-orange-500">
              <p className="text-zinc-300 text-sm">
                <span className="font-semibold text-orange-300">The Settlement Reality:</span> International transfers require 5-7 banks to coordinate, 
                each charging fees and adding delays. Bitcoin settles peer-to-peer in 10 minutes with mathematical certainty, 
                regardless of amount, distance, or time zone. No banks, no intermediaries, no delays.
              </p>
            </div>
            
            <div className="space-y-3">
              <h5 className="font-semibold text-white">Settlement Comparison You'll Experience:</h5>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <Building2 className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="font-medium text-white text-sm">Traditional Banking</p>
                    <p className="text-zinc-400 text-xs">3-5 days, $15-50 fees, business hours only</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <Bitcoin className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="font-medium text-white text-sm">Bitcoin Network</p>
                    <p className="text-zinc-400 text-xs">10 minutes, $1-5 fees, 24/7/365</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <Globe className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="font-medium text-white text-sm">International Transfers</p>
                    <p className="text-zinc-400 text-xs">Same speed globally with Bitcoin</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="font-medium text-white text-sm">Weekend Testing</p>
                    <p className="text-zinc-400 text-xs">See banking's weekend blackout</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center pt-2">
              <Button
                onClick={() => {
                  // Scroll to the interactive section
                  document.querySelector('[data-transfer-simulator]')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 text-sm"
              >
                <ChevronDown className="w-4 h-4 mr-2" />
                Experience Transfer Speeds
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settlement Workflow Visualization */}
      <Card className="bg-zinc-900 border-zinc-800" data-transfer-simulator>
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center gap-3 text-xl">
            <Clock className="w-5 h-5 text-orange-400" />
            Interactive Transfer Race
          </CardTitle>
          <p className="text-zinc-400 text-sm">Watch $50,000 travel from New York to London - see the complexity difference</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!speedRaceActive && (
            <div className="text-center space-y-4">
              <div className="p-6 bg-zinc-800 rounded-lg border border-zinc-700">
                <h3 className="text-lg font-medium text-white mb-3">Transfer Scenario</h3>
                <p className="text-zinc-300 mb-4">
                  Your business needs to send <span className="text-orange-400 font-bold">$50,000</span> from 
                  Chase Bank (New York) to Wells Fargo (London) for an urgent deal.
                </p>
                <p className="text-zinc-400 text-sm">
                  Compare how traditional banking vs Bitcoin handles this international transfer.
                </p>
              </div>
              <Button 
                onClick={startSettlementAnimation}
                className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-lg font-medium"
              >
                Initiate Transfer Race
              </Button>
            </div>
          )}

          {speedRaceActive && (
            <div className="space-y-6">
              <div className="text-center">
                <Button 
                  onClick={resetSettlementAnimation}
                  className="bg-orange-600 hover:bg-orange-700"
                  disabled={animationActive}
                >
                  {animationActive ? "Animation Running..." : "Reset Journey"}
                </Button>
                {animationActive && (
                  <p className="text-zinc-400 text-sm mt-2">
                    Watch Bitcoin complete while traditional banking gets stuck...
                  </p>
                )}
              </div>
              
              {/* Compact Side-by-Side Settlement Race */}
              <div className="space-y-4">
                
                {/* Headers */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-red-950/30 rounded-lg border border-red-800/30">
                    <Building2 className="w-5 h-5 text-red-400" />
                    <div>
                      <div className="text-red-300 font-bold text-sm">Traditional Banking</div>
                      <div className="text-zinc-400 text-xs">Complex, slow, expensive</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-950/30 rounded-lg border border-green-800/30">
                    <Zap className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="text-green-300 font-bold text-sm">Bitcoin Network</div>
                      <div className="text-zinc-400 text-xs">Simple, fast, global</div>
                    </div>
                  </div>
                </div>

                {/* Processing Steps - Side by Side */}
                <div className="space-y-3">
                  
                  {/* Step 1 Comparison */}
                  <div className="grid grid-cols-2 gap-4 relative">
                    {/* Traditional Step 1 */}
                    <div className={`p-3 rounded-lg border transition-all duration-500 relative ${
                      settlementProgress.traditional >= 1 
                        ? 'bg-red-800/30 border-red-600/50' 
                        : 'bg-zinc-800 border-zinc-700'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          settlementProgress.traditional >= 1 ? 'bg-red-600 text-white' : 'bg-zinc-600 text-zinc-400'
                        }`}>1</div>
                        <div className="text-white font-medium text-sm">Visit Bank Branch</div>
                      </div>
                      <div className="text-zinc-400 text-xs leading-relaxed min-h-[40px]">
                        Fill out international wire forms, provide recipient details, wait in line, 
                        pay upfront fees, get tracking number
                      </div>
                      
                      {/* Vertical Flow Arrow */}
                      <div className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
                        settlementProgress.traditional >= 1 ? 'opacity-100' : 'opacity-30'
                      }`}>
                        <div className={`w-0.5 h-4 ${settlementProgress.traditional >= 1 ? 'bg-red-400' : 'bg-zinc-600'}`}></div>
                        <div className={`w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent ${
                          settlementProgress.traditional >= 1 ? 'border-t-red-400' : 'border-t-zinc-600'
                        }`}></div>
                      </div>
                    </div>
                    
                    {/* Bitcoin Step 1 */}
                    <div className={`p-3 rounded-lg border transition-all duration-500 relative ${
                      settlementProgress.bitcoin >= 1 
                        ? 'bg-green-800/30 border-green-600/50' 
                        : 'bg-zinc-800 border-zinc-700'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          settlementProgress.bitcoin >= 1 ? 'bg-green-600 text-white' : 'bg-zinc-600 text-zinc-400'
                        }`}>1</div>
                        <div className="text-white font-medium text-sm">Create Transaction</div>
                      </div>
                      <div className="text-zinc-400 text-xs leading-relaxed min-h-[40px]">
                        Open wallet app, enter recipient address, specify amount, 
                        sign with private key - takes 30 seconds
                      </div>
                      
                      {/* Vertical Flow Arrow */}
                      <div className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
                        settlementProgress.bitcoin >= 1 ? 'opacity-100' : 'opacity-30'
                      }`}>
                        <div className={`w-0.5 h-4 ${settlementProgress.bitcoin >= 1 ? 'bg-green-400' : 'bg-zinc-600'}`}></div>
                        <div className={`w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent ${
                          settlementProgress.bitcoin >= 1 ? 'border-t-green-400' : 'border-t-zinc-600'
                        }`}></div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 Comparison */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Traditional Step 2 */}
                    <div className={`p-3 rounded-lg border transition-all duration-500 relative ${
                      settlementProgress.traditional >= 2 
                        ? 'bg-red-800/30 border-red-600/50' 
                        : 'bg-zinc-800 border-zinc-700'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          settlementProgress.traditional >= 2 ? 'bg-red-600 text-white' : 'bg-zinc-600 text-zinc-400'
                        }`}>2</div>
                        <div className="text-white font-medium text-sm">Compliance Review</div>
                      </div>
                      <div className="text-zinc-400 text-xs leading-relaxed min-h-[120px]">
                        Bank reviews for anti-money laundering, checks sanctions lists, 
                        verifies business purpose, contacts correspondent banks. 
                        Can take hours to days depending on amount and destination.
                        
                        {settlementProgress.traditional >= 2 && (
                          <div className="mt-3 space-y-2">
                            <div className="text-red-300 text-xs font-medium">Compliance Checkpoints:</div>
                            <div className="grid grid-cols-2 gap-1">
                              {['AML Check', 'KYC Review', 'Sanctions List', 'Purpose Verify', 'Amount Review', 'Risk Score'].map((check, i) => (
                                <div key={i} className="text-red-200 text-xs bg-red-900/30 rounded px-1 py-0.5">
                                  ✓ {check}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Bitcoin Step 2 */}
                    <div className={`p-3 rounded-lg border transition-all duration-500 ${
                      settlementProgress.bitcoin >= 2 
                        ? 'bg-green-800/30 border-green-600/50' 
                        : 'bg-zinc-800 border-zinc-700'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          settlementProgress.bitcoin >= 2 ? 'bg-green-600 text-white' : 'bg-zinc-600 text-zinc-400'
                        }`}>2</div>
                        <div className="text-white font-medium text-sm">Broadcast to Network</div>
                      </div>
                      <div className="text-zinc-400 text-xs leading-relaxed min-h-[120px]">
                        Transaction immediately broadcasts to 10,000+ Bitcoin nodes globally. 
                        No compliance review needed - network validates cryptographically.
                        
                        {settlementProgress.bitcoin >= 2 && (
                          <div className="mt-3 space-y-2">
                            <div className="text-green-300 text-xs font-medium">Network Status:</div>
                            <div className="space-y-1">
                              <div className="text-green-200 text-xs">✓ Broadcasting to nodes worldwide</div>
                              <div className="text-green-200 text-xs">✓ Mempool inclusion confirmed</div>
                              <div className="text-green-200 text-xs">✓ Fee priority: Standard ($3.50)</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Step 3 Comparison */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Traditional Step 3 */}
                    <div className={`p-3 rounded-lg border transition-all duration-500 ${
                      settlementProgress.traditional >= 3 
                        ? 'bg-red-800/30 border-red-600/50' 
                        : 'bg-zinc-800 border-zinc-700'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          settlementProgress.traditional >= 3 ? 'bg-red-600 text-white' : 'bg-zinc-600 text-zinc-400'
                        }`}>3</div>
                        <div className="text-white font-medium text-sm">SWIFT Network</div>
                      </div>
                      <div className="text-zinc-400 text-xs leading-relaxed min-h-[40px]">
                        Message routes through SWIFT network to recipient bank, 
                        each step requiring manual confirmation
                      </div>
                    </div>
                    
                    {/* Bitcoin Step 3 */}
                    <div className={`p-3 rounded-lg border transition-all duration-500 ${
                      settlementProgress.bitcoin >= 3 
                        ? 'bg-green-800/30 border-green-600/50' 
                        : 'bg-zinc-800 border-zinc-700'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          settlementProgress.bitcoin >= 3 ? 'bg-green-600 text-white' : 'bg-zinc-600 text-zinc-400'
                        }`}>3</div>
                        <div className="text-white font-medium text-sm">Mining & Consensus</div>
                      </div>
                      <div className="text-zinc-400 text-xs leading-relaxed min-h-[40px]">
                        Miners compete to include transaction in block, 
                        proof-of-work consensus validates globally
                      </div>
                    </div>
                  </div>

                  {/* Step 4 Comparison */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Traditional Step 4 */}
                    <div className={`p-3 rounded-lg border transition-all duration-500 ${
                      settlementProgress.traditional >= 4 
                        ? 'bg-red-800/30 border-red-600/50' 
                        : 'bg-zinc-800 border-zinc-700'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          settlementProgress.traditional >= 4 ? 'bg-red-600 text-white' : 'bg-zinc-600 text-zinc-400'
                        }`}>4</div>
                        <div className="text-white font-medium text-sm">Intermediary Routing</div>
                      </div>
                      <div className="text-zinc-400 text-xs leading-relaxed min-h-[40px]">
                        Funds move through intermediary banks, 
                        each verifying and processing
                      </div>
                    </div>
                    
                    {/* Bitcoin Step 4 */}
                    <div className={`p-3 rounded-lg border transition-all duration-500 ${
                      settlementProgress.bitcoin >= 4 
                        ? 'bg-green-800/30 border-green-600/50' 
                        : 'bg-zinc-800 border-zinc-700'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          settlementProgress.bitcoin >= 4 ? 'bg-green-600 text-white' : 'bg-zinc-600 text-zinc-400'
                        }`}>4</div>
                        <div className="text-white font-medium text-sm">Final Settlement</div>
                      </div>
                      <div className="text-zinc-400 text-xs leading-relaxed min-h-[40px]">
                        Transaction permanently recorded on blockchain, 
                        funds immediately available to recipient
                      </div>
                    </div>
                  </div>

                  {/* Step 5 - Only Traditional */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Traditional Step 5 */}
                    <div className={`p-3 rounded-lg border transition-all duration-500 ${
                      settlementProgress.traditional >= 5 
                        ? 'bg-red-800/30 border-red-600/50' 
                        : 'bg-zinc-800 border-zinc-700'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          settlementProgress.traditional >= 5 ? 'bg-red-600 text-white' : 'bg-zinc-600 text-zinc-400'
                        }`}>5</div>
                        <div className="text-white font-medium text-sm">Final Settlement</div>
                      </div>
                      <div className="text-zinc-400 text-xs leading-relaxed min-h-[40px]">
                        Recipient bank finally credits account, 
                        funds become available
                      </div>
                    </div>
                    
                    {/* Bitcoin - Empty Step 5 */}
                    <div className="p-3 rounded-lg border bg-zinc-800 border-zinc-700 opacity-30">
                      <div className="text-center py-4">
                        <div className="text-zinc-500 text-sm">No Step 5 Needed</div>
                        <div className="text-zinc-600 text-xs mt-1">Bitcoin settled in 4 steps</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Status Summary */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-red-950/40 rounded-lg border border-red-800/50">
                    <div className="text-center space-y-2">
                      <div className="text-red-400 font-bold text-lg">
                        {settlementProgress.traditional === 0 && "Waiting..."}
                        {settlementProgress.traditional === 1 && "At Bank Branch"}
                        {settlementProgress.traditional === 2 && "Stuck in Compliance"}
                        {settlementProgress.traditional === 3 && "SWIFT Routing"}
                        {settlementProgress.traditional === 4 && "Intermediary Processing"}
                        {settlementProgress.traditional === 5 && "Finally Complete"}
                      </div>
                      <div className="text-zinc-400 text-xs">
                        Step {settlementProgress.traditional}/5 • Traditional Banking
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-zinc-700 rounded-full h-2 mt-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(settlementProgress.traditional / 5) * 100}%` }}
                        ></div>
                      </div>
                      
                      {/* Dynamic Timing and Costs */}
                      <div className="space-y-1 text-xs">
                        <div className="text-red-300 font-medium">
                          {settlementProgress.traditional <= 2 && "Estimated: 3-5 business days"}
                          {settlementProgress.traditional === 3 && "Processing through 4 banks..."}
                          {settlementProgress.traditional === 4 && "Final bank coordination..."}
                          {settlementProgress.traditional === 5 && "Total time: 3-5 business days"}
                        </div>
                        <div className="text-red-400">
                          Current fees: ${(25 + Math.max(0, settlementProgress.traditional - 1) * 10).toFixed(0)}
                        </div>
                        <div className="text-zinc-500">
                          Banks involved: {Math.min(settlementProgress.traditional + 1, 4)}/4
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-950/40 rounded-lg border border-green-800/50">
                    <div className="text-center space-y-2">
                      <div className="text-green-400 font-bold text-lg">
                        {settlementProgress.bitcoin === 0 && "Ready"}
                        {settlementProgress.bitcoin === 1 && "Creating Transaction"}
                        {settlementProgress.bitcoin === 2 && "Broadcasting Globally"}
                        {settlementProgress.bitcoin === 3 && "Network Consensus"}
                        {settlementProgress.bitcoin === 4 && "✅ SETTLED!"}
                      </div>
                      <div className="text-zinc-400 text-xs">
                        Step {settlementProgress.bitcoin}/4 • Bitcoin Network
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-zinc-700 rounded-full h-2 mt-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(settlementProgress.bitcoin / 4) * 100}%` }}
                        ></div>
                      </div>
                      
                      {/* Dynamic Information */}
                      <div className="space-y-1 text-xs">
                        <div className="text-green-300 font-medium">
                          {settlementProgress.bitcoin === 0 && "Ready to start"}
                          {settlementProgress.bitcoin === 1 && "Signing with private key..."}
                          {settlementProgress.bitcoin === 2 && "Reaching 10,000+ nodes..."}
                          {settlementProgress.bitcoin === 3 && "6 confirmations incoming..."}
                          {settlementProgress.bitcoin === 4 && "Total time: ~10 minutes"}
                        </div>
                        <div className="text-green-400">
                          Fixed fee: $3.50
                        </div>
                        <div className="text-zinc-500">
                          Intermediaries: 0 (Direct)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Educational Summary Card */}
              <div className="p-6 bg-gradient-to-r from-blue-950/30 to-orange-950/30 rounded-xl border border-orange-800/30">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-orange-300 font-bold text-xl mb-2">Key Learning Points</div>
                    <div className="text-zinc-400 text-sm">Understanding Settlement Systems</div>
                  </div>
                  
                  {/* Comparison Stats */}
                  <div className="grid gap-4 md:grid-cols-3 text-center">
                    <div className="p-4 bg-zinc-800 rounded-lg">
                      <div className="text-green-400 font-bold text-2xl">432x</div>
                      <div className="text-zinc-300 text-sm">Faster Settlement</div>
                      <div className="text-zinc-500 text-xs">Days vs Minutes</div>
                    </div>
                    <div className="p-4 bg-zinc-800 rounded-lg">
                      <div className="text-green-400 font-bold text-2xl">93%</div>
                      <div className="text-zinc-300 text-sm">Lower Fees</div>
                      <div className="text-zinc-500 text-xs">$3.50 vs $65+</div>
                    </div>
                    <div className="p-4 bg-zinc-800 rounded-lg">
                      <div className="text-green-400 font-bold text-2xl">0</div>
                      <div className="text-zinc-300 text-sm">Intermediaries</div>
                      <div className="text-zinc-500 text-xs">Direct vs 4+ Banks</div>
                    </div>
                  </div>
                  
                  {/* Educational Points */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-orange-300 font-semibold text-sm">Traditional Banking Problems:</h4>
                      <ul className="space-y-2 text-zinc-300 text-sm">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Multiple compliance checkpoints create delays</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>SWIFT network requires 4+ bank intermediaries</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Each bank adds fees and processing time</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Human approval needed at every step</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-green-300 font-semibold text-sm">Bitcoin's Advantages:</h4>
                      <ul className="space-y-2 text-zinc-300 text-sm">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Direct peer-to-peer transfer (no middlemen)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Global network validates automatically</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Fixed, transparent fees ($3-5 typical)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Works 24/7/365 without bank hours</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Bottom Line */}
                  <div className="bg-zinc-800/50 rounded-lg p-4 border-l-4 border-orange-500">
                    <div className="text-zinc-300 leading-relaxed text-center">
                      <span className="font-semibold text-orange-300">Bottom Line:</span> Traditional banking transforms 
                      a simple transfer into a complex relay race involving multiple institutions, compliance checks, and 
                      days of delays. Bitcoin eliminates this entirely with direct, cryptographic settlement that works 
                      instantly across any distance. <span className="text-orange-400 font-medium">This is why Bitcoin 
                      represents the future of global money movement.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}