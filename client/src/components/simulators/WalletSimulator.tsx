import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Wallet, 
  Smartphone, 
  Shield, 
  KeyRound, 
  Target,
  ChevronDown,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { useAppContext } from "@/components/shared/AppContextProvider";
import { seedPhraseScenarios } from "@/constants/appData";

interface WalletType {
  name: string;
  security: string;
  convenience: string;
  cost: string;
  bestFor: string;
  pros: string[];
  cons: string[];
  examples: string[];
  description: string;
}

const walletTypes: WalletType[] = [
  {
    name: "Hardware Wallet",
    security: "Highest",
    convenience: "Medium",
    cost: "$50-200",
    bestFor: "Long-term storage (HODLing)",
    pros: ["Private keys never touch internet", "Immune to computer viruses", "Physical transaction confirmation", "Backup seed phrase"],
    cons: ["Initial cost", "Can be lost/damaged", "Less convenient for daily use"],
    examples: ["Ledger Nano X", "Trezor Model T", "Coldcard"],
    description: "Physical devices that store private keys offline. Most secure option for large amounts."
  },
  {
    name: "Mobile Wallet",
    security: "Medium",
    convenience: "Highest", 
    cost: "Free",
    bestFor: "Daily transactions and small amounts",
    pros: ["Always with you", "Easy to use", "Quick payments", "QR code scanning"],
    cons: ["Vulnerable to phone theft", "App could have bugs", "Limited backup options"],
    examples: ["Blue Wallet", "Electrum Mobile", "Phoenix"],
    description: "Apps on your smartphone for convenient Bitcoin payments and small amount storage."
  },
  {
    name: "Desktop Wallet",
    security: "Medium-High",
    convenience: "Medium",
    cost: "Free",
    bestFor: "Regular use with moderate security",
    pros: ["Full control of keys", "Advanced features", "No third party dependence", "Good privacy"],
    cons: ["Computer viruses risk", "Requires backups", "Technical knowledge needed"],
    examples: ["Electrum", "Bitcoin Core", "Sparrow"],
    description: "Software installed on your computer giving you full control over your Bitcoin."
  },
  {
    name: "Exchange Wallet",
    security: "Lowest",
    convenience: "High",
    cost: "Free (but not your keys)",
    bestFor: "Trading only, not storage",
    pros: ["Easy to get started", "No technical knowledge needed", "Built-in buying/selling"],
    cons: ["Not your keys, not your coins", "Can be hacked", "Account can be frozen", "No privacy"],
    examples: ["Coinbase", "Binance", "Kraken"],
    description: "Wallets provided by exchanges. Convenient but you don't control the private keys."
  }
];

export default function WalletSimulator() {
  const { isPremiumTier, setActiveSection } = useAppContext();
  const [selectedWalletType, setSelectedWalletType] = useState<string | null>(null);
  
  // Seed Phrase Recovery Simulator State
  const [seedPhraseActive, setSeedPhraseActive] = useState(false);
  const [seedPhraseScenario, setSeedPhraseScenario] = useState(0);
  const [seedPhraseProgress, setSeedPhraseProgress] = useState(0);
  const [enteredWords, setEnteredWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [recoveryComplete, setRecoveryComplete] = useState(false);

  if (!isPremiumTier) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Interactive Wallet Explorer</h3>
          <p className="text-zinc-400">Understanding Bitcoin wallets is essential for security</p>
        </div>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-8 text-center">
            <Wallet className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-white mb-2">Premium Feature</h4>
            <p className="text-zinc-400 mb-6">
              The Interactive Wallet Explorer helps you choose the right wallet type and practice emergency recovery scenarios.
            </p>
            <Button
              onClick={() => setActiveSection("home")}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Upgrade to Access
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Interactive Wallet Explorer</h3>
        <p className="text-zinc-400">Understand Bitcoin wallets and choose the right storage solution for your needs</p>
      </div>

      {/* Why Wallet Choice Matters Introduction */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <Wallet className="w-6 h-6 text-orange-400" />
            </div>
            <h4 className="text-xl font-bold text-white">Your Wallet Choice Shapes Your Bitcoin Experience</h4>
          </div>
          
          <div className="space-y-4">
            <p className="text-zinc-300 leading-relaxed">
              Your Bitcoin wallet is more than just storage - it's your gateway to financial sovereignty. 
              Unlike traditional banks that hold your money, Bitcoin wallets give you direct control over your private keys, 
              making you the sole owner of your wealth.
            </p>
            
            <div className="bg-zinc-800/50 rounded-lg p-4 border-l-4 border-orange-500">
              <p className="text-zinc-300 text-sm">
                <span className="font-semibold text-orange-300">Complete Learning Path:</span> This page covers everything you need to master Bitcoin wallets - 
                from choosing the right type for your needs to practicing emergency recovery scenarios that could save your Bitcoin.
              </p>
            </div>
            
            <div className="space-y-3">
              <h5 className="font-semibold text-white">What You'll Master Here:</h5>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <Smartphone className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="font-medium text-white text-sm">Wallet Type Comparison</p>
                    <p className="text-zinc-400 text-xs">Mobile, desktop, hardware, and exchange wallets</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <Shield className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="font-medium text-white text-sm">Security Best Practices</p>
                    <p className="text-zinc-400 text-xs">Protect your Bitcoin from common threats</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <KeyRound className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="font-medium text-white text-sm">Recovery Simulation</p>
                    <p className="text-zinc-400 text-xs">Practice wallet recovery in emergency scenarios</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <Target className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="font-medium text-white text-sm">Use Case Guidance</p>
                    <p className="text-zinc-400 text-xs">Find the perfect wallet for your Bitcoin amount</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={() => {
                  const explorer = document.querySelector('[data-wallet-explorer]');
                  if (explorer) {
                    explorer.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 flex-1"
              >
                <ChevronDown className="w-4 h-4 mr-2" />
                Explore Wallet Types
              </Button>
              <Button
                onClick={() => {
                  const simulator = document.querySelector('[data-seed-phrase-simulator]');
                  if (simulator) {
                    simulator.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                variant="outline"
                className="border-orange-600 text-orange-300 hover:bg-orange-600/10 px-6 py-2 flex-1"
              >
                <KeyRound className="w-4 h-4 mr-2" />
                Practice Recovery
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Definition */}
      <Card className="bg-zinc-900 border-zinc-800" data-wallet-explorer>
        <CardContent className="p-6">
          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 mb-6">
            <p className="text-zinc-300 text-sm leading-relaxed mb-3">
              <span className="font-semibold text-white">Bitcoin wallets</span> are software or hardware tools that store your private keys—the secret codes that prove you own your Bitcoin. Unlike a physical wallet that holds cash, Bitcoin wallets don't actually store Bitcoin itself. Instead, they manage the cryptographic keys that give you access to your Bitcoin on the blockchain.
            </p>
            <p className="text-zinc-300 text-sm leading-relaxed mb-4">
              <span className="font-semibold text-orange-300">Why this matters:</span> Your choice of wallet directly impacts your security, convenience, and true ownership of Bitcoin. Different wallet types offer different trade-offs between security and ease of use, making it crucial to understand your options before storing any Bitcoin.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={() => setActiveSection('more')}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 text-sm"
              >
                <Shield className="w-4 h-4 mr-2" />
                Shop Recommended Hardware Wallets
              </Button>
            </div>
          </div>
          
          <p className="text-zinc-400 text-sm mb-6">Click on any wallet type below to learn detailed information</p>
          
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {walletTypes.map((wallet, index) => (
              <Button
                key={index}
                variant={selectedWalletType === wallet.name ? "default" : "outline"}
                className={`p-4 h-auto flex-col items-start ${
                  selectedWalletType === wallet.name 
                    ? "bg-orange-600 border-orange-500 text-white" 
                    : "border-zinc-700 text-zinc-300 hover:border-orange-500"
                }`}
                onClick={() => setSelectedWalletType(wallet.name)}
              >
                <div className="w-full text-left">
                  <h5 className="font-medium mb-1">{wallet.name}</h5>
                  <p className="text-xs opacity-80">Security: {wallet.security}</p>
                  <p className="text-xs opacity-80">Cost: {wallet.cost}</p>
                </div>
              </Button>
            ))}
          </div>

          {/* Detailed Wallet Information */}
          {selectedWalletType && (() => {
            const selectedWallet = walletTypes.find(w => w.name === selectedWalletType)!;
            return (
              <div className="space-y-4 border-t border-zinc-700 pt-4">
                <div className="space-y-4">
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <h5 className="font-medium text-white mb-2">{selectedWallet.name} Overview</h5>
                    <p className="text-zinc-300 text-sm mb-3">{selectedWallet.description}</p>
                    
                    <div className="grid gap-3 md:grid-cols-3 mb-4">
                      <div className="text-center p-3 bg-zinc-800/30 rounded-lg">
                        <p className="text-zinc-400 text-xs mb-1">Security Level</p>
                        <p className="text-white font-medium">{selectedWallet.security}</p>
                      </div>
                      <div className="text-center p-3 bg-zinc-800/30 rounded-lg">
                        <p className="text-zinc-400 text-xs mb-1">Convenience</p>
                        <p className="text-white font-medium">{selectedWallet.convenience}</p>
                      </div>
                      <div className="text-center p-3 bg-zinc-800/30 rounded-lg">
                        <p className="text-zinc-400 text-xs mb-1">Cost</p>
                        <p className="text-white font-medium">{selectedWallet.cost}</p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-950/30 rounded-lg p-3 border border-blue-800/30 mb-4">
                      <p className="text-blue-200 text-sm">
                        <span className="font-medium">Best for:</span> {selectedWallet.bestFor}
                      </p>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <h6 className="font-medium text-green-300">Advantages</h6>
                        <ul className="space-y-1">
                          {selectedWallet.pros.map((pro, idx) => (
                            <li key={idx} className="text-zinc-300 text-sm flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h6 className="font-medium text-red-300">Considerations</h6>
                        <ul className="space-y-1">
                          {selectedWallet.cons.map((con, idx) => (
                            <li key={idx} className="text-zinc-300 text-sm flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h6 className="font-medium text-blue-300">Popular Examples</h6>
                      <div className="flex flex-wrap gap-2">
                        {selectedWallet.examples.map((example, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-600/20 border border-blue-600/30 rounded-full text-blue-200 text-sm">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
          
          {!selectedWalletType && (
            <div className="text-center p-8 border border-zinc-700 rounded-lg border-dashed">
              <Wallet className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400">Select a wallet type above to see detailed information</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seed Phrase Recovery Simulator */}
      <Card className="bg-zinc-900 border-zinc-800" data-seed-phrase-simulator>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <KeyRound className="w-6 h-6 text-orange-400" />
            </div>
            <h4 className="text-xl font-bold text-white">Seed Phrase Recovery Simulator</h4>
          </div>
          
          <p className="text-zinc-400 mb-4">
            Practice recovering wallets in emergency scenarios using the safe practice word "hodlearn" for every position. Experience the recovery process without any security risk.
          </p>

          <div className="bg-orange-950/40 rounded-lg p-4 border border-orange-800/50 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-orange-300" />
              <span className="font-medium text-orange-200">Completely Safe Practice Environment</span>
            </div>
            <p className="text-orange-100 text-sm leading-relaxed">
              This simulator uses "hodlearn" as the practice word for all positions. No real seed phrases or Bitcoin are involved - this is purely educational training for emergency wallet recovery scenarios.
            </p>
          </div>

          {!seedPhraseActive ? (
            <div className="space-y-4">
              <h5 className="font-semibold text-white mb-4">Choose Your Recovery Scenario</h5>
              
              {seedPhraseScenarios.map((scenario, index) => (
                <div 
                  key={scenario.id}
                  className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 hover:border-orange-500/50 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      scenario.difficulty === 'Beginner' ? 'bg-green-800/30 text-green-300' :
                      scenario.difficulty === 'Intermediate' ? 'bg-yellow-800/30 text-yellow-300' :
                      'bg-red-800/30 text-red-300'
                    }`}>
                      {scenario.difficulty}
                    </div>
                    <div className="text-zinc-400 text-xs">
                      {scenario.seedPhrase.length} words
                    </div>
                  </div>
                  
                  <h5 className="font-semibold text-white text-sm mb-2">{scenario.title}</h5>
                  <p className="text-zinc-400 text-xs mb-3 leading-relaxed">{scenario.description}</p>
                  
                  <div className="bg-zinc-900/50 rounded p-3 mb-3">
                    <p className="text-zinc-300 text-xs leading-relaxed">{scenario.context}</p>
                  </div>
                  
                  <Button
                    onClick={() => {
                      setSeedPhraseScenario(index);
                      setSeedPhraseActive(true);
                      setSeedPhraseProgress(0);
                      setEnteredWords([]);
                      setCurrentWordIndex(0);
                      setRecoveryComplete(false);
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-4 py-2"
                  >
                    Start Recovery Simulation
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Recovery Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-white text-lg">
                    {seedPhraseScenarios[seedPhraseScenario].title}
                  </h5>
                  <Button
                    onClick={() => {
                      setSeedPhraseActive(false);
                      setSeedPhraseProgress(0);
                      setEnteredWords([]);
                      setCurrentWordIndex(0);
                      setRecoveryComplete(false);
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-white"
                  >
                    ✕ Exit
                  </Button>
                </div>
                
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    {seedPhraseScenarios[seedPhraseScenario].context}
                  </p>
                </div>

                {/* Progress Indicator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-sm">Recovery Progress</span>
                    <span className="text-zinc-400 text-sm">
                      {enteredWords.length}/{seedPhraseScenarios[seedPhraseScenario].seedPhrase.length} words
                    </span>
                  </div>
                  <div className="w-full bg-zinc-700 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(enteredWords.length / seedPhraseScenarios[seedPhraseScenario].seedPhrase.length) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>

              {!recoveryComplete ? (
                <div className="space-y-6">
                  {/* Current Word Input */}
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                    <div className="mb-3">
                      <label className="text-white font-medium text-sm mb-2 block">
                        Enter word #{currentWordIndex + 1}
                      </label>
                      <input
                        type="text"
                        placeholder="Type the next word from your seed phrase..."
                        className="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-3 py-2 text-white placeholder-zinc-400 focus:border-orange-500 focus:outline-none"
                        value={enteredWords[currentWordIndex] || ''}
                        onChange={(e) => {
                          const newWords = [...enteredWords];
                          newWords[currentWordIndex] = e.target.value.toLowerCase().trim();
                          setEnteredWords(newWords);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const currentWord = enteredWords[currentWordIndex]?.toLowerCase().trim();
                            const correctWord = seedPhraseScenarios[seedPhraseScenario].seedPhrase[currentWordIndex];
                            
                            if (currentWord === correctWord) {
                              if (currentWordIndex === seedPhraseScenarios[seedPhraseScenario].seedPhrase.length - 1) {
                                setRecoveryComplete(true);
                              } else {
                                setCurrentWordIndex(currentWordIndex + 1);
                              }
                            }
                          }
                        }}
                      />
                    </div>
                    
                    <div className="text-xs text-zinc-400">
                      💡 Hint: {seedPhraseScenarios[seedPhraseScenario].hints[0]}
                    </div>
                  </div>

                  {/* Visual Seed Phrase Progress Grid */}
                  <div className="space-y-3">
                    <h6 className="font-medium text-white">Recovery Progress</h6>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {seedPhraseScenarios[seedPhraseScenario].seedPhrase.map((word, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded border text-center ${
                            index < enteredWords.length && enteredWords[index] === word
                              ? 'bg-green-800/30 border-green-600/50 text-green-300'
                              : index === currentWordIndex
                              ? 'bg-orange-800/30 border-orange-600/50 text-orange-300'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                          }`}
                        >
                          <div className="text-xs font-medium">
                            {index < enteredWords.length && enteredWords[index] === word
                              ? word
                              : index === currentWordIndex
                              ? '?'
                              : `#${index + 1}`
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Recovery Complete */
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h5 className="font-bold text-green-400 text-lg">Wallet Recovery Successful! 🎉</h5>
                    <p className="text-zinc-300">
                      You've successfully recovered your wallet and regained access to your Bitcoin.
                    </p>
                  </div>

                  <div className="bg-green-950/40 rounded-lg p-4 border border-green-800/50">
                    <h6 className="font-medium text-green-300 mb-3">What Happened</h6>
                    <div className="space-y-2 text-green-200 text-sm">
                      <p>✅ Seed phrase entered correctly in proper order</p>
                      <p>✅ Wallet restored with full transaction history</p>
                      <p>✅ Bitcoin balance and addresses recovered</p>
                      <p>✅ You maintained control of your funds through the emergency</p>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3">
                    <Button
                      onClick={() => {
                        setSeedPhraseActive(false);
                        setSeedPhraseProgress(0);
                        setEnteredWords([]);
                        setCurrentWordIndex(0);
                        setRecoveryComplete(false);
                      }}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      Try Another Scenario
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}