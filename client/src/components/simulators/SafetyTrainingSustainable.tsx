import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, XCircle, Mail, Eye, EyeOff } from 'lucide-react';

interface SafetyTrainingProps {
  securityStage: number;
  setSecurityStage: (stage: number) => void;
  securityScore: number;
  setSecurityScore: (score: number) => void;
  userSecurityAnswers: { [key: number]: number };
  setUserSecurityAnswers: (answers: { [key: number]: number }) => void;
  onCompletion: () => void;
}

// Comprehensive 12-Stage Bitcoin Security Training extracted from main app
const safetySimulations = [
  {
    stage: "Phishing Detection",
    title: "Spot the Phishing Email",
    description: "Can you identify the dangerous email that's trying to steal your Bitcoin?",
    emails: [
      {
        from: "security@binance.com",
        subject: "Account Security Alert - Action Required",
        preview: "We noticed unusual activity on your account. Click here to verify your identity immediately or your account will be suspended.",
        isPhishing: true,
        redFlags: ["Urgency tactics", "Suspicious domain", "Threatening suspension"]
      },
      {
        from: "noreply@coinbase.com", 
        subject: "Your Weekly Portfolio Summary",
        preview: "Here's your portfolio performance for the week ending January 27, 2025. Your Bitcoin holdings are up 3.2%.",
        isPhishing: false,
        redFlags: []
      },
      {
        from: "support@electrum.org",
        subject: "Critical Security Update Required",
        preview: "Download our urgent security patch at electrum-update[.]net to protect your wallet from new vulnerabilities.",
        isPhishing: true,
        redFlags: ["Fake domain", "Malicious download link", "Impersonation"]
      }
    ]
  },
  {
    stage: "Seed Phrase Security",
    title: "Protect Your Seed Phrase",
    description: "You just generated a new Bitcoin wallet. Where should you store your 12-word recovery phrase?",
    scenario: "apple bacon chair dog eagle five grape happy ice jelly king lemon",
    options: [
      {
        method: "Screenshot on phone",
        safe: false
      },
      {
        method: "Write on paper, store in safe",
        safe: true
      },
      {
        method: "Save in password manager",
        safe: true
      },
      {
        method: "Memorize only",
        safe: false
      }
    ]
  },
  {
    stage: "Address Verification", 
    title: "🎯 Verify Bitcoin Address",
    description: "Compare these two addresses carefully before sending:",
    copied: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    displayed: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0w1h",
    options: [
      { text: "Addresses match exactly", correct: false },
      { text: "Addresses are different", correct: true },
      { text: "Close enough", correct: false },
      { text: "First 10 characters match", correct: false }
    ]
  },
  {
    stage: "Scam Recognition",
    title: "🚨 Spot the Bitcoin Scam", 
    description: "Click on the legitimate (safe) message - avoid the scams!",
    scenarios: [
      {
        message: "Elon Musk is giving away Bitcoin! Send 0.1 BTC to get 1 BTC back! Limited time offer!",
        isScam: true,
        tactics: ["Impersonation", "Too good to be true", "Urgency", "Upfront payment required"]
      },
      {
        message: "Your local Bitcoin meetup is next Thursday at 7 PM. Bring questions and let's learn together!",
        isScam: false,
        tactics: []
      },
      {
        message: "I'm a prince who needs help moving my Bitcoin fortune. I'll share 50% if you help with transaction fees.",
        isScam: true,
        tactics: ["Classic advance fee fraud", "Unrealistic returns", "Emotional manipulation"]
      }
    ],
    explanation: "The Bitcoin meetup message is legitimate and safe - it's just an educational gathering. The other two are classic scams: the 'Elon giveaway' uses celebrity impersonation and impossible returns, while the 'prince' message is a traditional advance fee fraud adapted for Bitcoin."
  },
  {
    stage: "Exchange Security",
    title: "🏪 Exchange Safety Check",
    description: "You want to buy Bitcoin. Which exchange should you choose?",
    options: [
      {
        method: "Brand new exchange offering 50% signup bonus",
        safe: false
      },
      {
        method: "Well-known exchange like Coinbase or Kraken",
        safe: true
      },
      {
        method: "Random exchange found through Google ads",
        safe: false
      },
      {
        method: "Exchange recommended in a Telegram group",
        safe: false
      }
    ]
  },
  {
    stage: "WiFi Security",
    title: "📶 Public WiFi Warning",
    description: "You're at a coffee shop and want to check your Bitcoin wallet. What should you do?",
    options: [
      {
        method: "Connect to free public WiFi and log in normally",
        safe: false
      },
      {
        method: "Use your phone's mobile data instead",
        safe: true
      },
      {
        method: "Use public WiFi but only check prices, not access wallet",
        safe: true
      },
      {
        method: "Connect through a VPN on public WiFi",
        safe: true
      }
    ]
  },
  {
    stage: "Software Downloads",
    title: "💾 Safe Wallet Downloads",
    description: "You need to download a Bitcoin wallet. Where should you get it?",
    options: [
      {
        method: "Google search and click the first result",
        safe: false
      },
      {
        method: "Official website directly (electrum.org, bitcoin.org)",
        safe: true
      },
      {
        method: "Download from a Bitcoin forum recommendation",
        safe: false
      },
      {
        method: "Official app store or Google Play Store",
        safe: true
      }
    ]
  },
  {
    stage: "Social Engineering",
    title: "🎭 Social Engineering Defense",
    description: "Someone calls claiming to be from your exchange, asking for your 2FA code. What do you do?",
    options: [
      {
        method: "Give them the code since they knew my email",
        safe: false
      },
      {
        method: "Hang up and call the exchange directly",
        safe: true
      },
      {
        method: "Ask them to verify my account details first",
        safe: false
      },
      {
        method: "Tell them to email me instead",
        safe: false
      }
    ]
  },
  {
    stage: "Hardware Wallet",
    title: "🔧 Hardware Wallet Safety",
    description: "You want to buy a hardware wallet for storing Bitcoin. What's the SAFEST approach?",
    options: [
      {
        method: "Buy used on eBay to save money",
        safe: false
      },
      {
        method: "Buy new directly from the official manufacturer website",
        safe: true
      },
      {
        method: "Buy from Amazon third-party seller",
        safe: false
      },
      {
        method: "Buy from local computer store",
        safe: false
      }
    ]
  },
  {
    stage: "Backup Testing",
    title: "💾 Backup Verification",
    description: "You wrote down your seed phrase. How should you verify it's correct?",
    options: [
      {
        method: "Wait until you need to restore the wallet",
        safe: false
      },
      {
        method: "Test restore on a separate device or wallet",
        safe: true
      },
      {
        method: "Take a photo of the seed phrase as backup",
        safe: false
      },
      {
        method: "Share with trusted family member to verify",
        safe: false
      }
    ]
  },
  {
    stage: "Transaction Fees",
    title: "💰 Fee Manipulation",
    description: "You're sending $50 worth of Bitcoin. Your wallet suggests a $200 fee, but you checked other sources and normal fees are $2. What should you do?",
    options: [
      {
        method: "Pay the $200 fee since the wallet knows best",
        safe: false
      },
      {
        method: "Never use this wallet again - it might be malicious",
        safe: true
      },
      {
        method: "Try sending anyway with the high fee",
        safe: false
      },
      {
        method: "Ignore the fee warning and send anyway",
        safe: false
      }
    ]
  },
  {
    stage: "Recovery Scams", 
    title: "🔍 Recovery Service Warning",
    description: "You lost access to your wallet. Someone offers to recover it for 50% of the funds. What should you do?",
    options: [
      {
        method: "Agree since 50% is better than 0%",
        safe: false
      },
      {
        method: "Ask for references and research the company",
        safe: false
      },
      {
        method: "Decline and try to recover yourself",
        safe: true
      },
      {
        method: "Negotiate for a lower percentage",
        safe: false
      }
    ]
  }
];

export default function SafetyTrainingSustainable({
  securityStage,
  setSecurityStage,
  securityScore,
  setSecurityScore,
  userSecurityAnswers,
  setUserSecurityAnswers,
  onCompletion
}: SafetyTrainingProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSeed, setShowSeed] = useState(false);

  const handleStartQuiz = () => {
    setHasStarted(true);
    setCurrentQuestionIndex(0);
    setSecurityScore(0);
    setUserSecurityAnswers({});
    setSecurityStage(0); // Start the security stage
  };

  const handleSafetyAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setShowResult(true);
    
    // Calculate score based on stage with comprehensive validation
    let correct = false;
    const simulation = safetySimulations[securityStage];
    
    if (!simulation) {
      console.error(`Invalid stage: ${securityStage}`);
      return;
    }
    
    try {
      switch (securityStage) {
        case 0: // Phishing Detection
          if (simulation.emails && simulation.emails[optionIndex]) {
            correct = simulation.emails[optionIndex].isPhishing === true;
          }
          break;
          
        case 2: // Address Verification
          if (simulation.options && simulation.options[optionIndex]) {
            const option = simulation.options[optionIndex];
            correct = 'correct' in option ? option.correct === true : false;
          }
          break;
          
        case 3: // Scam Recognition
          if (simulation.scenarios && simulation.scenarios[optionIndex]) {
            correct = simulation.scenarios[optionIndex].isScam === false;
          }
          break;
          
        case 1:  // Seed Phrase Security
        case 4:  // Exchange Security  
        case 5:  // WiFi Security
        case 6:  // Software Downloads
        case 7:  // Social Engineering
        case 8:  // Hardware Wallet
        case 9:  // Backup Testing
        case 10: // Transaction Fees
        case 11: // Recovery Scams
          if (simulation.options && simulation.options[optionIndex]) {
            const option = simulation.options[optionIndex];
            correct = 'safe' in option ? option.safe === true : false;
          }
          break;
          
        default:
          console.error(`Unhandled stage: ${securityStage}`);
          break;
      }
      
    } catch (error) {
      console.error('Safety simulation validation error:', error, simulation);
      correct = false;
    }
    
    if (correct) setSecurityScore(prev => prev + 1);
  };

  const nextSafetyStage = () => {
    if (securityStage < safetySimulations.length - 1) {
      setSecurityStage(securityStage + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setSecurityStage(999); // Completion indicator
      onCompletion();
    }
  };

  const resetSafetySimulator = () => {
    setSecurityStage(0);
    setSecurityScore(0);
    setSelectedOption(null);
    setShowResult(false);
    setHasStarted(false);
  };

  // Introduction screen
  if (!hasStarted) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Bitcoin Security Training Center</h3>
          <p className="text-zinc-400">Master essential security skills to protect your Bitcoin from real-world threats</p>
        </div>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Shield className="w-16 h-16 text-orange-500 mx-auto" />
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-white">Comprehensive Security Assessment</h4>
                <p className="text-zinc-400">
                  Test your knowledge across 12 critical security scenarios including phishing detection, 
                  seed phrase protection, address verification, and scam recognition.
                </p>
              </div>
              
              <div className="bg-zinc-700/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-300">Total Scenarios:</span>
                  <span className="text-orange-400 font-medium">12</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-300">Estimated Time:</span>
                  <span className="text-orange-400 font-medium">5-10 minutes</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-300">Required Score:</span>
                  <span className="text-orange-400 font-medium">Pass all scenarios</span>
                </div>
              </div>

              <Button 
                onClick={handleStartQuiz}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                Begin Security Training
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Completion screen
  if (securityStage === 999) {
    const scorePercentage = Math.round((securityScore / safetySimulations.length) * 100);
    const isPassing = scorePercentage >= 75;

    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
            isPassing ? 'bg-green-600' : 'bg-red-600'
          }`}>
            {isPassing ? <CheckCircle className="w-8 h-8 text-white" /> : <XCircle className="w-8 h-8 text-white" />}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">
              {isPassing ? 'Security Training Complete!' : 'Training Complete - Review Needed'}
            </h3>
            <p className="text-zinc-400">
              You scored {securityScore} out of {safetySimulations.length} ({scorePercentage}%)
            </p>
          </div>
        </div>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardContent className="p-6 text-center space-y-4">
            {isPassing ? (
              <div className="space-y-3">
                <p className="text-green-400 font-medium">
                  Excellent! You've demonstrated strong Bitcoin security knowledge.
                </p>
                <p className="text-zinc-300 text-sm">
                  These skills will help protect your Bitcoin in the real world. 
                  Remember to stay vigilant and keep learning about new threats.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-red-400 font-medium">
                  Consider reviewing Bitcoin security best practices and retaking the training.
                </p>
                <p className="text-zinc-300 text-sm">
                  Strong security knowledge is essential for protecting your Bitcoin safely.
                </p>
              </div>
            )}
            
            <Button 
              onClick={resetSafetySimulator}
              variant="outline"
              className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
            >
              Take Training Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main quiz interface
  const currentSimulation = safetySimulations[securityStage];
  if (!currentSimulation) return null;

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Bitcoin Security Training</h3>
        <Badge variant="secondary" className="bg-zinc-700 text-zinc-300">
          {securityStage + 1} / {safetySimulations.length}
        </Badge>
      </div>

      {/* Current simulation */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h4 className="text-lg font-semibold text-white">{currentSimulation.title}</h4>
              <p className="text-zinc-400">{currentSimulation.description}</p>
            </div>

            {/* Render based on simulation type */}
            {securityStage === 0 && currentSimulation.emails && (
              <div className="space-y-3">
                <p className="text-sm text-zinc-400 text-center">Choose the safe email to proceed:</p>
                {currentSimulation.emails.map((email, index) => (
                  <button
                    key={index}
                    onClick={() => handleSafetyAnswer(index)}
                    disabled={showResult}
                    className={`w-full p-4 border rounded-lg text-left transition-colors ${
                      selectedOption === index 
                        ? 'border-orange-500 bg-orange-500/10' 
                        : 'border-zinc-600 hover:border-zinc-500'
                    } ${showResult && selectedOption === index ? 
                      (!email.isPhishing ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10') : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-orange-400" />
                      <span className="text-orange-300 text-sm font-medium">{email.from}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-white font-medium text-sm">{email.subject}</div>
                      <div className="text-zinc-400 text-xs">{email.preview}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {securityStage === 1 && currentSimulation.scenario && (
              <div className="space-y-4">
                <div className="bg-zinc-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-zinc-300 text-sm">Your seed phrase:</span>
                    <button
                      onClick={() => setShowSeed(!showSeed)}
                      className="text-orange-400 hover:text-orange-300"
                    >
                      {showSeed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="font-mono text-orange-300 text-sm">
                    {showSeed ? currentSimulation.scenario : '•••• •••• •••• •••• •••• •••• •••• •••• •••• •••• •••• ••••'}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {currentSimulation.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSafetyAnswer(index)}
                      disabled={showResult}
                      className={`w-full p-3 border rounded-lg text-left transition-colors ${
                        selectedOption === index 
                          ? 'border-orange-500 bg-orange-500/10' 
                          : 'border-zinc-600 hover:border-zinc-500'
                      } ${showResult && selectedOption === index ? 
                        (option.safe ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10') : ''
                      }`}
                    >
                      <div className="text-zinc-300 text-sm">{option.method}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {securityStage === 2 && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="bg-zinc-700/50 rounded-lg p-3">
                    <div className="text-zinc-400 text-xs mb-1">What you copied:</div>
                    <div className="font-mono text-green-400 text-sm break-all">{currentSimulation.copied}</div>
                  </div>
                  <div className="bg-zinc-700/50 rounded-lg p-3">
                    <div className="text-zinc-400 text-xs mb-1">What's displayed on screen:</div>
                    <div className="font-mono text-orange-400 text-sm break-all">{currentSimulation.displayed}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {currentSimulation.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSafetyAnswer(index)}
                      disabled={showResult}
                      className={`w-full p-3 border rounded-lg text-left transition-colors ${
                        selectedOption === index 
                          ? 'border-orange-500 bg-orange-500/10' 
                          : 'border-zinc-600 hover:border-zinc-500'
                      } ${showResult && selectedOption === index ? 
                        (option.correct ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10') : ''
                      }`}
                    >
                      <div className="text-zinc-300 text-sm">{option.text}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {securityStage === 3 && currentSimulation.scenarios && (
              <div className="space-y-3">
                <p className="text-sm text-zinc-400 text-center">Choose the SAFE message:</p>
                {currentSimulation.scenarios.map((scenario, index) => (
                  <button
                    key={index}
                    onClick={() => handleSafetyAnswer(index)}
                    disabled={showResult}
                    className={`w-full p-4 border rounded-lg text-left transition-colors ${
                      selectedOption === index 
                        ? 'border-orange-500 bg-orange-500/10' 
                        : 'border-zinc-600 hover:border-zinc-500'
                    } ${showResult && selectedOption === index ? 
                      (!scenario.isScam ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10') : ''
                    }`}
                  >
                    <div className="text-zinc-300 text-sm">{scenario.message}</div>
                  </button>
                ))}
              </div>
            )}

            {(securityStage >= 4) && currentSimulation.options && (
              <div className="space-y-2">
                {currentSimulation.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSafetyAnswer(index)}
                    disabled={showResult}
                    className={`w-full p-3 border rounded-lg text-left transition-colors ${
                      selectedOption === index 
                        ? 'border-orange-500 bg-orange-500/10' 
                        : 'border-zinc-600 hover:border-zinc-500'
                    } ${showResult && selectedOption === index ? 
                      (option.safe ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10') : ''
                    }`}
                  >
                    <div className="text-zinc-300 text-sm">{option.method}</div>
                  </button>
                ))}
              </div>
            )}

            {showResult && (
              <div className="pt-4 border-t border-zinc-700">
                <Button 
                  onClick={nextSafetyStage}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {securityStage < safetySimulations.length - 1 ? 'Next Scenario' : 'Complete Quiz'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}