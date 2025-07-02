import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, Target, CheckCircle } from "lucide-react";

interface SafetySimulatorProps {
  isPremiumTier: boolean;
}

export default function SafetySimulator({ isPremiumTier }: SafetySimulatorProps) {
  // Safety Simulator State
  const [safetyStage, setSafetyStage] = useState(0);
  const [safetyScore, setSafetyScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [safetyCompleted, setSafetyCompleted] = useState(false);

  // Comprehensive 12-Stage Safety Simulation Data
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
          safe: false
        },
        {
          from: "noreply@coinbase.com",
          subject: "Weekly Portfolio Summary",
          preview: "Your portfolio has increased by 5.2% this week. View your detailed performance report in your dashboard.",
          safe: true
        }
      ]
    },
    {
      stage: "Seed Phrase Storage",
      title: "Where Should You Store Your Seed Phrase?",
      description: "Your 12-word seed phrase is the master key to your Bitcoin. Choose the safest storage method.",
      options: [
        { text: "Write it on paper and store in a fireproof safe", safe: true },
        { text: "Save it in a password manager", safe: false },
        { text: "Store it in your email drafts", safe: false },
        { text: "Memorize it and don't write it down", safe: false }
      ]
    },
    {
      stage: "Address Verification",
      title: "Double-Check This Bitcoin Address",
      description: "You're about to send 0.5 BTC to this address. What should you verify?",
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      options: [
        { text: "Check the first 4 characters match what you copied", safe: false },
        { text: "Verify the entire address character by character", safe: true },
        { text: "Just check it looks like a Bitcoin address", safe: false },
        { text: "Send a small test amount first", safe: true }
      ]
    },
    {
      stage: "Scam Recognition",
      title: "Bitcoin Doubling Offer",
      description: "Someone messages you: 'Send me 1 BTC and I'll send you back 2 BTC within 24 hours!' What do you do?",
      options: [
        { text: "Send a small amount to test if it's real", safe: false },
        { text: "Ask for proof before sending anything", safe: false },
        { text: "Block them immediately - this is a scam", safe: true },
        { text: "Research the person online first", safe: false }
      ]
    },
    {
      stage: "Social Engineering",
      title: "Urgent Phone Call",
      description: "Someone calls claiming to be from your exchange, saying your account is compromised and they need your login details to secure it. What's your response?",
      options: [
        { text: "Give them the info - they sound official", safe: false },
        { text: "Hang up and call the exchange directly", safe: true },
        { text: "Ask them to verify your identity first", safe: false },
        { text: "Give partial information to test them", safe: false }
      ]
    },
    {
      stage: "Hardware Wallet Safety",
      title: "Buying a Hardware Wallet",
      description: "You want to buy a hardware wallet for maximum security. What's the safest approach?",
      options: [
        { text: "Buy new from official manufacturer", safe: true },
        { text: "Buy used from local computer store", safe: false },
        { text: "Buy from Amazon marketplace seller", safe: false },
        { text: "Accept one as a gift from a friend", safe: false }
      ]
    },
    {
      stage: "Backup Testing",
      title: "Testing Your Backup",
      description: "You've written down your seed phrase. What's the best way to verify it's correct?",
      options: [
        { text: "Wait until you lose your wallet to test it", safe: false },
        { text: "Test restore on the same device immediately", safe: false },
        { text: "Test restore on a different device with small amounts", safe: true },
        { text: "Never test it - that's risky", safe: false }
      ]
    }
  ];

  const currentSimulation = safetySimulations[safetyStage];

  const handleSafetyAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setShowResult(true);
    
    const simulation = safetySimulations[safetyStage];
    if (!simulation) {
      console.error(`Invalid stage: ${safetyStage}`);
      return;
    }

    let isCorrect = false;
    switch (safetyStage) {
      case 0: // Phishing Detection
        isCorrect = simulation.emails?.[optionIndex]?.safe === true;
        break;
      case 1: // Seed Phrase Storage
      case 2: // Address Verification
      case 3: // Scam Recognition
      case 4: // Social Engineering
      case 5: // Hardware Wallet Safety
      case 6: // Backup Testing
        isCorrect = simulation.options?.[optionIndex]?.safe === true;
        break;
      default:
        console.error(`Unhandled stage: ${safetyStage}`);
        break;
    }

    if (isCorrect) {
      setSafetyScore(prev => prev + 1);
    }
  };

  const nextSafetyStage = () => {
    if (safetyStage < safetySimulations.length - 1) {
      setSafetyStage(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setSafetyCompleted(true);
    }
  };

  const resetSafetyTest = () => {
    setSafetyStage(0);
    setSafetyScore(0);
    setSelectedOption(null);
    setShowResult(false);
    setSafetyCompleted(false);
  };

  if (!isPremiumTier) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Bitcoin Security Training Center</h3>
        <p className="text-zinc-400">Master essential security skills to protect your Bitcoin from real-world threats</p>
      </div>

      {/* Why Safety Matters Introduction */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-600/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h4 className="text-xl font-bold text-white">Why Bitcoin Security Matters</h4>
          </div>
          
          <div className="space-y-4">
            <p className="text-zinc-300 leading-relaxed">
              Bitcoin puts you in complete control of your money, but with great power comes great responsibility. 
              Unlike traditional banking where you can call customer service to recover lost funds, Bitcoin transactions 
              are irreversible and there's no central authority to help if you make a mistake.
            </p>
            
            <div className="bg-zinc-800/50 rounded-lg p-4 border-l-4 border-orange-500">
              <p className="text-zinc-300 text-sm">
                <span className="font-semibold text-orange-300">Critical Fact:</span> Over $2.1 billion in cryptocurrency 
                was lost to scams and hacks in 2024. The good news? Nearly all of these losses were preventable with proper security knowledge.
              </p>
            </div>
            
            <div className="space-y-3">
              <h5 className="font-semibold text-white">What You'll Find Below:</h5>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <Shield className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="font-medium text-white text-sm">Security Essentials</p>
                    <p className="text-zinc-400 text-xs">Complete guide covering all security fundamentals</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <Target className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="font-medium text-white text-sm">Security Simulator</p>
                    <p className="text-zinc-400 text-xs">Test your skills with 7 real-world scenarios</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center pt-2">
              <Button
                onClick={() => {
                  const simulator = document.getElementById('safety-skills-test');
                  if (simulator) {
                    simulator.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
              >
                <Target className="w-4 h-4 mr-2" />
                Test Your Security Skills
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Security Skills Test */}
      <Card id="safety-skills-test" className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-4 sm:p-6">
          {!safetyCompleted ? (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h5 className="font-semibold text-white">Scenario {safetyStage + 1} of {safetySimulations.length}</h5>
                  <p className="text-zinc-400 text-sm">Bitcoin Security Training</p>
                </div>
                <div className="flex gap-1">
                  {safetySimulations.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index < safetyStage 
                          ? 'bg-green-500' 
                          : index === safetyStage 
                            ? 'bg-orange-500' 
                            : 'bg-zinc-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h6 className="font-semibold text-white text-sm sm:text-base">{safetySimulations[safetyStage]?.title}</h6>
                </div>
                <div>
                  <p className="text-zinc-400 text-xs sm:text-sm mb-4 leading-relaxed">{safetySimulations[safetyStage]?.description}</p>
                  
                  {safetyStage === 0 && currentSimulation.emails && (
                    <div className="space-y-3">
                      {currentSimulation.emails.map((email, index) => (
                        <button
                          key={index}
                          onClick={() => handleSafetyAnswer(index)}
                          disabled={showResult}
                          className={`w-full text-left p-3 sm:p-4 border-2 rounded-lg transition-all ${
                            selectedOption === index
                              ? showResult
                                ? email.safe
                                  ? 'border-green-500 bg-green-500/10'
                                  : 'border-red-500 bg-red-500/10'
                                : 'border-orange-500 bg-orange-500/10'
                              : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/30'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <span className="text-zinc-300 text-xs sm:text-sm">From: {email.from}</span>
                              {showResult && selectedOption === index && (
                                <span className={`text-xs px-2 py-1 rounded ${
                                  email.safe ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                }`}>
                                  {email.safe ? 'SAFE' : 'DANGEROUS'}
                                </span>
                              )}
                            </div>
                            <div className="text-white text-sm sm:text-base font-medium">{email.subject}</div>
                            <div className="text-zinc-400 text-xs sm:text-sm">{email.preview}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {safetyStage > 0 && currentSimulation.options && (
                    <div className="space-y-3">
                      {currentSimulation.address && (
                        <div className="bg-zinc-800/50 p-3 rounded-lg mb-4">
                          <p className="text-zinc-300 text-xs sm:text-sm mb-2">Bitcoin Address:</p>
                          <code className="text-orange-400 text-xs sm:text-sm break-all">{currentSimulation.address}</code>
                        </div>
                      )}
                      
                      {currentSimulation.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleSafetyAnswer(index)}
                          disabled={showResult}
                          className={`w-full text-left p-3 sm:p-4 border-2 rounded-lg transition-all ${
                            selectedOption === index
                              ? showResult
                                ? option.safe
                                  ? 'border-green-500 bg-green-500/10'
                                  : 'border-red-500 bg-red-500/10'
                                : 'border-orange-500 bg-orange-500/10'
                              : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/30'
                          }`}
                        >
                          <span className="text-white text-sm sm:text-base">{option.text}</span>
                          {showResult && selectedOption === index && (
                            <span className={`ml-2 text-xs px-2 py-1 rounded ${
                              option.safe ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {option.safe ? 'CORRECT' : 'INCORRECT'}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {showResult && (
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={nextSafetyStage}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
                  >
                    {safetyStage < safetySimulations.length - 1 ? 'Next Scenario' : 'View Results'}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-400" />
              </div>
              
              <div>
                <h4 className="text-2xl font-bold text-white mb-2">Security Assessment Complete!</h4>
                <p className="text-zinc-400">You've completed the Bitcoin Security Training</p>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-6">
                <div className="text-3xl font-bold text-orange-400 mb-2">
                  {safetyScore}/{safetySimulations.length}
                </div>
                <div className="text-lg text-white mb-1">
                  {Math.round((safetyScore / safetySimulations.length) * 100)}% Security Knowledge
                </div>
                <div className="text-sm text-zinc-400">
                  {safetyScore === safetySimulations.length ? 
                    "Perfect! You're well-prepared to secure your Bitcoin." :
                    safetyScore >= Math.floor(safetySimulations.length * 0.7) ?
                    "Good knowledge! Review the areas you missed." :
                    "Keep learning! Bitcoin security requires constant vigilance."
                  }
                </div>
              </div>

              <Button
                onClick={resetSafetyTest}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
              >
                Retake Assessment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}