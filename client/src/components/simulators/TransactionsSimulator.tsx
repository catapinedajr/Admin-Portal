import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard,
  Eye,
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronDown,
  ArrowLeft
} from "lucide-react";

interface TransactionsSimulatorProps {
  isPremiumTier: boolean;
}

export default function TransactionsSimulator({ isPremiumTier }: TransactionsSimulatorProps) {
  const { toast } = useToast();
  
  const [transactionInputs, setTransactionInputs] = useState({
    fromAddress: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    toAddress: "",
    amount: "0.001",
    feeRate: "standard"
  });
  const [transactionState, setTransactionState] = useState<"building" | "preview" | "signing" | "broadcasting" | "confirming" | "confirmed">("building");
  const [showTransactionApproval, setShowTransactionApproval] = useState(false);
  const [confirmationCount, setConfirmationCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(45);
  const [transactionJourney, setTransactionJourney] = useState<"broadcast" | "mempool" | "confirming" | "settled">("broadcast");
  const [transactionId, setTransactionId] = useState("");

  // Fee options with realistic data
  const feeOptions = {
    slow: { rate: "1-3", cost: "0.00001", time: "60+ min", priority: "Low Priority", satsPerByte: 2 },
    standard: { rate: "4-8", cost: "0.00004", time: "10-30 min", priority: "Standard", satsPerByte: 6 },
    fast: { rate: "9-15", cost: "0.00008", time: "1-10 min", priority: "High Priority", satsPerByte: 12 }
  };

  const updateTransactionInput = (field: string, value: string) => {
    setTransactionInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTransactionFee = () => {
    const currentFee = getCurrentFee();
    return currentFee.cost;
  };

  const simulatePasteFromClipboard = () => {
    const clipboardSources = [
      { source: "Mobile Wallet", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" },
      { source: "Hardware Wallet", address: "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4" },
      { source: "Exchange Withdrawal", address: "bc1qrp33g8q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3" },
      { source: "Lightning Address", address: "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy" },
      { source: "Friend's Wallet", address: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2" }
    ];
    const randomClipboard = clipboardSources[Math.floor(Math.random() * clipboardSources.length)];
    
    setTimeout(() => {
      setTransactionInputs(prev => ({ ...prev, toAddress: randomClipboard.address }));
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-orange-800 text-orange-100 px-4 py-2 rounded-lg text-sm z-50 transition-opacity';
      notification.textContent = `Pasted from ${randomClipboard.source}`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 2000);
    }, 100);
  };

  const generateTransactionId = () => {
    return Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
  };

  const proceedToPreview = () => {
    setTransactionState("preview");
  };

  const startSigning = () => {
    if (!transactionInputs.toAddress || transactionInputs.toAddress.trim() === '') {
      toast({
        title: "Missing Required Information",
        description: "Please enter a Bitcoin address in the 'To Address' field before signing the transaction.",
        variant: "destructive",
      });
      return;
    }
    
    setTransactionState("signing");
    setShowTransactionApproval(true);
  };

  const getCurrentFee = () => {
    const fee = feeOptions[transactionInputs.feeRate as keyof typeof feeOptions];
    return fee || feeOptions.standard;
  };

  const getTransactionTotal = () => {
    const amount = parseFloat(transactionInputs.amount) || 0;
    const fee = parseFloat(getCurrentFee().cost) || 0;
    return (amount + fee).toFixed(8);
  };

  const getUSDValue = (btcAmount: string) => {
    const amount = parseFloat(btcAmount) || 0;
    return (amount * 95000).toFixed(2);
  };

  const approveTransaction = () => {
    setShowTransactionApproval(false);
    setTransactionState("broadcasting");
    setTransactionId(generateTransactionId());
    setTransactionJourney("broadcast");
    
    setTimeout(() => {
      setTransactionJourney("mempool");
      
      setTimeout(() => {
        setTransactionState("confirming");
        setTransactionJourney("confirming");
        setConfirmationCount(0);
        setTimeRemaining(45);
        
        const confirmationInterval = setInterval(() => {
          setConfirmationCount(prev => {
            const newCount = prev + 1;
            if (newCount >= 6) {
              clearInterval(confirmationInterval);
              setTimeout(() => {
                setTransactionState("confirmed");
                setTransactionJourney("settled");
              }, 1000);
            }
            return newCount;
          });
        }, 6000);
        
        const timerInterval = setInterval(() => {
          setTimeRemaining(prev => {
            if (prev <= 1) {
              clearInterval(timerInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
      }, 5000);
    }, 3000);
  };

  if (!isPremiumTier) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-white">Interactive Bitcoin Transaction Builder</h3>
        <p className="text-zinc-400">Build and customize a Bitcoin transaction step-by-step</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <CreditCard className="w-6 h-6 text-orange-400" />
            </div>
            <h4 className="text-xl font-bold text-white">Master Bitcoin Transactions Without Risk</h4>
          </div>
          
          <div className="space-y-4">
            <p className="text-zinc-300 leading-relaxed">
              Bitcoin transactions are permanent and irreversible - there's no "undo" button or customer service to call. 
              Understanding how transactions work before sending real Bitcoin is crucial for avoiding costly mistakes 
              that could result in lost funds forever.
            </p>
            
            <div className="bg-zinc-800/50 rounded-lg p-4 border-l-4 border-orange-500">
              <p className="text-zinc-300 text-sm">
                <span className="font-semibold text-orange-300">Safe Learning:</span> This simulator uses fake addresses 
                and amounts so you can practice building transactions safely. Learn the entire process from address 
                generation to confirmation tracking without any financial risk.
              </p>
            </div>
            
            <div className="space-y-3">
              <h5 className="font-semibold text-white">Transaction Journey You'll Experience:</h5>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                  <div>
                    <p className="font-medium text-white text-sm">Build Transaction</p>
                    <p className="text-zinc-400 text-xs">Set recipient address and amount</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                  <div>
                    <p className="font-medium text-white text-sm">Choose Fees</p>
                    <p className="text-zinc-400 text-xs">Select transaction speed priority</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                  <div>
                    <p className="font-medium text-white text-sm">Sign & Broadcast</p>
                    <p className="text-zinc-400 text-xs">Authorize and send to network</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
                  <div>
                    <p className="font-medium text-white text-sm">Track Confirmations</p>
                    <p className="text-zinc-400 text-xs">Watch transaction get confirmed</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center pt-2">
              <Button
                onClick={() => {
                  const builder = document.querySelector('[data-transaction-builder]');
                  if (builder) {
                    builder.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
              >
                <ChevronDown className="w-4 h-4 mr-2" />
                Start Building Transaction
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800" data-transaction-builder>
        <CardContent className="p-6">
          <h4 className="text-lg font-bold text-white mb-4">Build Your Transaction</h4>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">From Address</label>
                <input
                  type="text"
                  value={transactionInputs.fromAddress}
                  onChange={(e) => updateTransactionInput('fromAddress', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:border-orange-500 focus:outline-none"
                  placeholder="Your Bitcoin address"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">To Address</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={transactionInputs.toAddress}
                    onChange={(e) => updateTransactionInput('toAddress', e.target.value)}
                    className="flex-1 min-w-0 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:border-orange-500 focus:outline-none"
                    placeholder="Click Paste to add recipient address"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={simulatePasteFromClipboard}
                    className="border-zinc-700 text-zinc-300 hover:border-orange-500 hover:text-orange-400 text-xs px-2 py-2 shrink-0"
                    title="Paste from clipboard"
                  >
                    📋
                  </Button>
                </div>
                {!transactionInputs.toAddress && (
                  <p className="text-zinc-500 text-xs">Click the paste button to simulate adding a recipient address</p>
                )}
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Amount (BTC)</label>
                  <input
                    type="number"
                    step="0.00000001"
                    value={transactionInputs.amount}
                    onChange={(e) => updateTransactionInput('amount', e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:border-orange-500 focus:outline-none"
                    placeholder="0.001"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">USD Value</label>
                  <div className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-green-400 text-sm">
                    ${getUSDValue(transactionInputs.amount)}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-zinc-800/30 rounded-lg">
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Amount:</span>
                  <span className="text-white font-mono">{transactionInputs.amount} BTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Network Fee:</span>
                  <span className="text-white font-mono">{calculateTransactionFee()} BTC</span>
                </div>
                <div className="flex justify-between border-t border-zinc-700 pt-2">
                  <span className="text-zinc-300 font-medium">Total:</span>
                  <span className="text-orange-400 font-mono">{(parseFloat(transactionInputs.amount) + parseFloat(calculateTransactionFee())).toFixed(8)} BTC</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {transactionState === "building" && (
                <Button 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={proceedToPreview}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Review Transaction
                </Button>
              )}

              {transactionState === "preview" && (
                <div className="space-y-4">
                  <Card className="bg-zinc-800 border-zinc-700">
                    <CardContent className="p-4">
                      <h5 className="font-bold text-white mb-3 flex items-center">
                        <Eye className="w-5 h-5 mr-2 text-blue-400" />
                        Transaction Preview
                      </h5>
                      
                      <div className="space-y-2 mb-4">
                        <label className="text-sm font-medium text-zinc-300">Fee Priority</label>
                        <div className="grid gap-1">
                          {Object.entries(feeOptions).map(([key, option]) => (
                            <div
                              key={key}
                              className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                                transactionInputs.feeRate === key
                                  ? 'bg-orange-600/20 border-orange-500'
                                  : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600'
                              }`}
                              onClick={() => setTransactionInputs(prev => ({ ...prev, feeRate: key }))}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-white text-sm">{option.priority} • {option.time}</span>
                                <span className="text-orange-400 font-mono text-sm">{option.cost} BTC</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-zinc-900/50 rounded-lg space-y-2">
                        <h6 className="font-medium text-white">Transaction Summary</h6>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Amount:</span>
                            <div className="text-right">
                              <div className="text-white font-mono">{transactionInputs.amount} BTC</div>
                              <div className="text-zinc-500 text-xs">${getUSDValue(transactionInputs.amount)}</div>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Network Fee:</span>
                            <div className="text-right">
                              <div className="text-white font-mono">{getCurrentFee().cost} BTC</div>
                              <div className="text-zinc-500 text-xs">${getUSDValue(getCurrentFee().cost)}</div>
                            </div>
                          </div>
                          <div className="border-t border-zinc-700 pt-2 flex justify-between font-medium">
                            <span className="text-zinc-300">Total:</span>
                            <div className="text-right">
                              <div className="text-orange-400 font-mono">{getTransactionTotal()} BTC</div>
                              <div className="text-green-400 text-xs">${getUSDValue(getTransactionTotal())}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-4">
                        <Button
                          variant="outline"
                          className="flex-1 border-zinc-700 text-zinc-300"
                          onClick={() => setTransactionState("building")}
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back
                        </Button>
                        <Button
                          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                          onClick={startSigning}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Sign Transaction
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {showTransactionApproval && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 max-w-md w-full">
            <h4 className="text-lg font-bold text-white mb-4">Confirm Transaction</h4>
            <div className="space-y-4">
              <div className="p-4 bg-zinc-800/50 rounded-lg">
                <h5 className="font-medium text-white mb-3">Transaction Details</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">From:</span>
                    <span className="text-white font-mono">{transactionInputs.fromAddress.slice(0, 15)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">To:</span>
                    <span className="text-white font-mono">
                      {transactionInputs.toAddress ? 
                        `${transactionInputs.toAddress.slice(0, 15)}...` : 
                        'No address set'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Amount:</span>
                    <div className="text-right">
                      <div className="text-white">{transactionInputs.amount} BTC</div>
                      <div className="text-zinc-500 text-xs">${getUSDValue(transactionInputs.amount)}</div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Fee:</span>
                    <div className="text-right">
                      <div className="text-white">{calculateTransactionFee()} BTC</div>
                      <div className="text-zinc-500 text-xs">${getUSDValue(calculateTransactionFee())}</div>
                    </div>
                  </div>
                  <div className="border-t border-zinc-700 pt-2 flex justify-between font-medium">
                    <span className="text-zinc-300">Total:</span>
                    <div className="text-right">
                      <div className="text-white">{getTransactionTotal()} BTC</div>
                      <div className="text-zinc-400 text-xs">${getUSDValue(getTransactionTotal())}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-orange-600/10 border border-orange-600/20 rounded-lg">
                <p className="text-orange-200 text-sm">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  This is a simulation. No real Bitcoin will be sent.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-zinc-700 text-zinc-300 hover:border-zinc-600"
                  onClick={() => {
                    setShowTransactionApproval(false);
                    setTransactionState("building");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={approveTransaction}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}