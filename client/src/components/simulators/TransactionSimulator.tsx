import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Copy, 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertTriangle 
} from "lucide-react";

interface TransactionSimulatorProps {
  transactionInputs: any;
  updateTransactionInput: (field: string, value: any) => void;
  simulatePasteFromClipboard: () => void;
  getUSDValue: (btcAmount: number) => string;
  calculateTransactionFee: () => number;
  getCurrentFee: () => number;
  getTransactionTotal: () => number;
  transactionState: string;
  proceedToPreview: () => void;
  feeOptions: any[];
  setTransactionInputs: (updater: (prev: any) => any) => void;
  setTransactionState: (state: string) => void;
  startSigning: () => void;
  transactionJourney: any;
  confirmationCount: number;
  timeRemaining: string;
  transactionId: string;
  showTransactionApproval: boolean;
  setShowTransactionApproval: (show: boolean) => void;
  approveTransaction: () => void;
}

export default function TransactionSimulator({
  transactionInputs,
  updateTransactionInput,
  simulatePasteFromClipboard,
  getUSDValue,
  calculateTransactionFee,
  getCurrentFee,
  getTransactionTotal,
  transactionState,
  proceedToPreview,
  feeOptions,
  setTransactionInputs,
  setTransactionState,
  startSigning,
  transactionJourney,
  confirmationCount,
  timeRemaining,
  transactionId,
  showTransactionApproval,
  setShowTransactionApproval,
  approveTransaction,
}: TransactionSimulatorProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-600/20 rounded-lg">
            <Send className="w-6 h-6 text-orange-400" />
          </div>
          <h4 className="text-xl font-bold text-white">Bitcoin Transaction Simulator</h4>
        </div>

        <div className="space-y-6">
          {/* Building Phase */}
          {transactionState === 'building' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Amount (BTC)
                </label>
                <input
                  type="number"
                  step="0.00000001"
                  min="0"
                  max="1"
                  value={transactionInputs.amount}
                  onChange={(e) => updateTransactionInput('amount', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                  placeholder="0.00000000"
                />
                <div className="text-xs text-zinc-500 mt-1">
                  ≈ ${getUSDValue(transactionInputs.amount)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Recipient Address
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={transactionInputs.recipientAddress}
                    onChange={(e) => updateTransactionInput('recipientAddress', e.target.value)}
                    className="flex-1 min-w-0 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-mono text-sm"
                    placeholder="Enter Bitcoin address..."
                  />
                  <Button
                    onClick={simulatePasteFromClipboard}
                    variant="outline"
                    size="sm"
                    className="shrink-0 min-w-0"
                  >
                    <Copy className="w-4 h-4" />
                    Paste
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={transactionInputs.description}
                  onChange={(e) => updateTransactionInput('description', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                  placeholder="What's this payment for?"
                />
              </div>

              <div className="pt-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Amount:</span>
                  <span className="text-white">{transactionInputs.amount} BTC (${getUSDValue(transactionInputs.amount)})</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-zinc-400">Network Fee:</span>
                  <span className="text-white">{calculateTransactionFee()} BTC (${getUSDValue(calculateTransactionFee())})</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1 pt-2 border-t border-zinc-700">
                  <span className="text-zinc-300 font-medium">Total:</span>
                  <span className="text-white font-medium">{getTransactionTotal()} BTC (${getUSDValue(getTransactionTotal())})</span>
                </div>
              </div>

              <Button
                onClick={proceedToPreview}
                disabled={!transactionInputs.amount || !transactionInputs.recipientAddress}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Review Transaction
              </Button>
            </div>
          )}

          {/* Preview Phase */}
          {transactionState === 'preview' && (
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <h5 className="font-semibold text-white mb-3">Transaction Preview</h5>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">To:</span>
                    <span className="text-white font-mono text-xs">{transactionInputs.recipientAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Amount:</span>
                    <span className="text-white">{transactionInputs.amount} BTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">USD Value:</span>
                    <span className="text-white">${getUSDValue(transactionInputs.amount)}</span>
                  </div>
                  {transactionInputs.description && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Description:</span>
                      <span className="text-white">{transactionInputs.description}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">
                  Choose Transaction Fee Priority
                </label>
                <div className="space-y-2">
                  {feeOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setTransactionInputs(prev => ({ ...prev, feeRate: option.rate }))}
                      className={`w-full p-3 rounded-lg border text-left transition-colors ${
                        transactionInputs.feeRate === option.rate
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-white font-medium">{option.name}</div>
                          <div className="text-zinc-400 text-sm">{option.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white">{option.fee} BTC</div>
                          <div className="text-zinc-400 text-sm">${getUSDValue(option.fee)}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Amount:</span>
                  <span className="text-white">{transactionInputs.amount} BTC (${getUSDValue(transactionInputs.amount)})</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-zinc-400">Network Fee:</span>
                  <span className="text-white">{getCurrentFee()} BTC (${getUSDValue(getCurrentFee())})</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1 pt-2 border-t border-zinc-700">
                  <span className="text-zinc-300 font-medium">Total:</span>
                  <span className="text-white font-medium">{getTransactionTotal()} BTC (${getUSDValue(getTransactionTotal())})</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setTransactionState('building')}
                  variant="outline"
                  className="flex-1"
                >
                  Back to Edit
                </Button>
                <Button
                  onClick={startSigning}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                >
                  Sign Transaction
                </Button>
              </div>
            </div>
          )}

          {/* Signing Phase */}
          {transactionState === 'signing' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-orange-400" />
                </div>
                <h5 className="text-lg font-semibold text-white mb-2">
                  {transactionJourney.step === 'hardware_confirm' ? 'Hardware Wallet Confirmation' :
                   transactionJourney.step === 'pin_entry' ? 'Enter PIN' :
                   transactionJourney.step === 'review_display' ? 'Review on Device' :
                   transactionJourney.step === 'final_confirm' ? 'Final Confirmation' :
                   'Preparing Transaction'}
                </p>
                <p className="text-zinc-400 text-sm">
                  {transactionJourney.step === 'hardware_confirm' ? 'Connect and unlock your hardware wallet' :
                   transactionJourney.step === 'pin_entry' ? 'Enter your PIN on the hardware wallet' :
                   transactionJourney.step === 'review_display' ? 'Review transaction details on your device screen' :
                   transactionJourney.step === 'final_confirm' ? 'Press the confirm button on your hardware wallet' :
                   'Initializing secure signing process...'}
                </p>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-zinc-300">
                    Step {transactionJourney.currentStep} of {transactionJourney.totalSteps}
                  </span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(transactionJourney.currentStep / transactionJourney.totalSteps) * 100}%` }}
                  ></div>
                </div>
              </div>

              {transactionJourney.step === 'complete' && (
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="text-green-400 font-medium">Transaction Signed Successfully!</p>
                  <p className="text-zinc-400 text-sm mt-1">Broadcasting to Bitcoin network...</p>
                </div>
              )}
            </div>
          )}

          {/* Broadcasting Phase */}
          {transactionState === 'broadcasting' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-blue-400" />
                </div>
                <h5 className="text-lg font-semibold text-white mb-2">Broadcasting Transaction</h5>
                <p className="text-zinc-400 text-sm">Sending your transaction to the Bitcoin network...</p>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-300">Network Propagation</span>
                  <span className="text-sm text-zinc-400">~10 seconds</span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>

              <div className="text-center">
                <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-zinc-400 text-sm mt-2">Please wait...</p>
              </div>
            </div>
          )}

          {/* Confirming Phase */}
          {transactionState === 'confirming' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h5 className="text-lg font-semibold text-white mb-2">Transaction Broadcast!</h5>
                <p className="text-zinc-400 text-sm">Waiting for network confirmations...</p>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-white">Confirmations</span>
                  <Badge variant={confirmationCount >= 6 ? "default" : "secondary"}>
                    {confirmationCount}/6
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        i < confirmationCount ? 'bg-green-500' : 
                        i === confirmationCount ? 'bg-orange-500 animate-pulse' : 'bg-zinc-600'
                      }`}></div>
                      <span className={`text-sm ${
                        i < confirmationCount ? 'text-green-400' : 
                        i === confirmationCount ? 'text-orange-400' : 'text-zinc-500'
                      }`}>
                        Confirmation {i + 1}
                        {i === confirmationCount && confirmationCount < 6 && (
                          <span className="ml-2 text-zinc-400">({timeRemaining})</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-zinc-300">Transaction ID:</span>
                  <Button variant="ghost" size="sm" className="h-auto p-0 text-orange-400 hover:text-orange-300">
                    <Copy className="w-3 h-3 mr-1" />
                    {transactionId}
                  </Button>
                </div>
                <p className="text-xs text-zinc-500">
                  You can track this transaction on any Bitcoin block explorer
                </p>
              </div>

              {confirmationCount >= 6 && (
                <div className="text-center p-4 bg-green-900/20 border border-green-700 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-green-400 font-medium">Transaction Confirmed!</p>
                  <p className="text-zinc-400 text-sm mt-1">Your Bitcoin has been successfully sent</p>
                </div>
              )}
            </div>
          )}

          {/* Complete Phase */}
          {transactionState === 'complete' && (
            <div className="space-y-4">
              <div className="text-center p-6 bg-green-900/20 border border-green-700 rounded-lg">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h5 className="text-xl font-semibold text-green-400 mb-2">Transaction Complete!</h5>
                <p className="text-zinc-300 mb-4">
                  Your Bitcoin has been successfully sent and confirmed by the network.
                </p>
                
                <div className="bg-zinc-800 rounded-lg p-4 text-left">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Amount Sent:</span>
                      <span className="text-white">{transactionInputs.amount} BTC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Network Fee:</span>
                      <span className="text-white">{getCurrentFee()} BTC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Total Cost:</span>
                      <span className="text-white">{getTransactionTotal()} BTC</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-zinc-700">
                      <span className="text-zinc-400">Transaction ID:</span>
                      <span className="text-orange-400 font-mono text-xs">{transactionId}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setTransactionState('building')}
                variant="outline"
                className="w-full"
              >
                Send Another Transaction
              </Button>
            </div>
          )}
        </div>

        {/* Hardware Wallet Approval Modal */}
        {showTransactionApproval && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 max-w-md mx-4">
              <div className="text-center mb-4">
                <Shield className="w-12 h-12 text-orange-400 mx-auto mb-3" />
                <h5 className="text-lg font-semibold text-white">Hardware Wallet Required</h5>
                <p className="text-zinc-400 text-sm mt-2">
                  Review the transaction details on your hardware wallet screen and confirm to proceed.
                </p>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4 mb-4">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Amount:</span>
                    <span className="text-white">{transactionInputs.amount} BTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">To:</span>
                    <span className="text-white font-mono text-xs">{transactionInputs.recipientAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Fee:</span>
                    <span className="text-white">{calculateTransactionFee()} BTC</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-zinc-700">
                    <span className="text-zinc-400">Total:</span>
                    <span className="text-white font-medium">{getTransactionTotal()} BTC</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowTransactionApproval(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={approveTransaction}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </div>

              <div className="mt-4 p-3 bg-orange-900/20 border border-orange-700 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-orange-400 text-xs font-medium">Educational Simulator</p>
                    <p className="text-orange-300 text-xs mt-1">
                      This is a safe learning environment. No real Bitcoin will be sent.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}