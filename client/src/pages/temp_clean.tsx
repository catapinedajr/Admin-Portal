            {simulationsSubTab === "safety" && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">Wallet Safety Center</h3>
                  <p className="text-zinc-400">Learn essential Bitcoin security practices</p>
                </div>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="text-lg font-bold text-white">Security Fundamentals</h4>
                        <div className="grid gap-4">
                          <div className="p-4 bg-zinc-800/50 rounded-lg">
                            <h5 className="font-medium text-orange-400 mb-2">✓ Never Share Your Seed Phrase</h5>
                            <p className="text-zinc-300 text-sm">Your 12-24 word seed phrase is your master key. Never type it online or share with anyone.</p>
                          </div>
                          <div className="p-4 bg-zinc-800/50 rounded-lg">
                            <h5 className="font-medium text-orange-400 mb-2">✓ Use Hardware Wallets</h5>
                            <p className="text-zinc-300 text-sm">Keep large amounts in offline hardware wallets like Ledger or Trezor for maximum security.</p>
                          </div>
                          <div className="p-4 bg-zinc-800/50 rounded-lg">
                            <h5 className="font-medium text-orange-400 mb-2">✓ Verify Addresses</h5>
                            <p className="text-zinc-300 text-sm">Always double-check receiving addresses before sending Bitcoin. Transactions cannot be reversed.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {simulationsSubTab === "hodl" && (