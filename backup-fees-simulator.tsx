// BACKUP: Banking Fees vs Bitcoin Fees Simulator
// Extracted from home-new.tsx on July 3, 2025
// Lines 8435-8774 (340 lines)
// Can be restored later if needed

            {/* Banking Fees vs Bitcoin Fees Simulator */}
            {isPremiumTier && simulationsSubTab === "fees" && (
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
                          <label className="text-sm font-medium text-white">ATM Withdrawals per Month</label>
                          <Select value={atmWithdrawals} onValueChange={setAtmWithdrawals}>
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700">
                              <SelectItem value="0">0 withdrawals</SelectItem>
                              <SelectItem value="4">4 withdrawals</SelectItem>
                              <SelectItem value="8">8 withdrawals</SelectItem>
                              <SelectItem value="12">12 withdrawals</SelectItem>
                              <SelectItem value="20">20+ withdrawals</SelectItem>
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
                                parseInt(paperFees) +
                                parseInt(creditCardFees) / 12) * 12
                              ).toLocaleString()}</span>
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
                              <span className="text-zinc-400">Account Maintenance:</span>
                              <span className="text-green-400">$0</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Network Transfers:</span>
                              <span className="text-white">$2-$15</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">ATM Alternative:</span>
                              <span className="text-green-400">$0</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Overdraft Risk:</span>
                              <span className="text-green-400">Impossible</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">International Fees:</span>
                              <span className="text-green-400">$0</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Paper Processing:</span>
                              <span className="text-green-400">$0</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Annual Account Fee:</span>
                              <span className="text-green-400">$0</span>
                            </div>
                            <hr className="border-orange-500/30" />
                            <div className="flex justify-between font-semibold">
                              <span className="text-white">Monthly Total:</span>
                              <span className="text-orange-400">$6-45*</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                              <span className="text-white">Annual Cost:</span>
                              <span className="text-orange-400">$72-540*</span>
                            </div>
                            <p className="text-xs text-zinc-500 mt-2">
                              *Depends on transaction frequency
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Savings Analysis */}
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <TrendingUp className="w-5 h-5 text-green-400" />
                          <h4 className="font-semibold text-white">Potential Annual Savings</h4>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">
                              ${Math.max(0, Math.round(
                                (parseInt(monthlyFee) + 
                                parseInt(wireTransfers) * 25 + 
                                parseInt(atmFees) * 4.75 + 
                                parseInt(overdraftFees) * 35 +
                                parseInt(internationalFees) * 0.03 +
                                parseInt(paperFees) +
                                parseInt(creditCardFees) / 12) * 12 - 540
                              )).toLocaleString()}
                            </div>
                            <div className="text-sm text-zinc-400">Maximum Savings</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">
                              ${Math.max(0, Math.round(
                                (parseInt(monthlyFee) + 
                                parseInt(wireTransfers) * 25 + 
                                parseInt(atmFees) * 4.75 + 
                                parseInt(overdraftFees) * 35 +
                                parseInt(internationalFees) * 0.03 +
                                parseInt(paperFees) +
                                parseInt(creditCardFees) / 12) * 12 - 306
                              )).toLocaleString()}
                            </div>
                            <div className="text-sm text-zinc-400">Conservative Estimate</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-400">
                              {Math.max(0, Math.round(
                                ((parseInt(monthlyFee) + 
                                parseInt(wireTransfers) * 25 + 
                                parseInt(atmFees) * 4.75 + 
                                parseInt(overdraftFees) * 35 +
                                parseInt(internationalFees) * 0.03 +
                                parseInt(paperFees) +
                                parseInt(creditCardFees) / 12) * 12 - 306) /
                                ((parseInt(monthlyFee) + 
                                parseInt(wireTransfers) * 25 + 
                                parseInt(atmFees) * 4.75 + 
                                parseInt(overdraftFees) * 35 +
                                parseInt(internationalFees) * 0.03 +
                                parseInt(paperFees) +
                                parseInt(creditCardFees) / 12) * 12) * 100
                              ))}%
                            </div>
                            <div className="text-sm text-zinc-400">Savings Percentage</div>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-zinc-800 rounded-lg">
                          <p className="text-sm text-zinc-300">
                            <strong className="text-orange-400">Educational Note:</strong> Bitcoin transaction fees vary based on network congestion and priority. 
                            During busy periods, fees may be higher, but Bitcoin still eliminates most traditional banking fees entirely.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}