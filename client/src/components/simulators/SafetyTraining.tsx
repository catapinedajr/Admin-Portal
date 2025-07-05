import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Target,
  ChevronDown,
  Mail,
  Copy
} from "lucide-react";

interface SafetyTrainingProps {
  securityStage: number;
  setSecurityStage: (stage: number) => void;
  securityScore: number;
  setSecurityScore: (score: number) => void;
  userSecurityAnswers: Record<number, boolean>;
  setUserSecurityAnswers: (answers: Record<number, boolean>) => void;
}

export default function SafetyTraining({
  securityStage,
  setSecurityStage,
  securityScore,
  setSecurityScore,
  userSecurityAnswers,
  setUserSecurityAnswers
}: SafetyTrainingProps) {
  const [safetyStage, setSafetyStage] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Complete original safety simulations data structure
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

  const currentSimulation = safetySimulations[safetyStage];

  const handleSafetyAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setShowResult(true);
    
    // Calculate score based on stage with comprehensive validation
    let correct = false;
    const simulation = safetySimulations[safetyStage];
    
    if (!simulation) {
      console.error(`Invalid stage: ${safetyStage}`);
      return;
    }
    
    try {
      switch (safetyStage) {
        case 0: // Phishing Detection
          if (simulation.emails && simulation.emails[optionIndex]) {
            correct = simulation.emails[optionIndex].isPhishing === false;
          }
          break;
          
        case 2: // Address Verification
          if (simulation.options && simulation.options[optionIndex]) {
            correct = simulation.options[optionIndex].correct === true;
          }
          break;
          
        case 3: // Scam Recognition
          if (simulation.scenarios && simulation.scenarios[optionIndex]) {
            correct = simulation.scenarios[optionIndex].isScam === false;
          }
          break;
          
        default: // Options-based simulations (stages 1, 4-11)
          if (simulation.options && simulation.options[optionIndex]) {
            correct = simulation.options[optionIndex].safe === true;
          }
          break;
      }
    } catch (error) {
      console.error(`Error calculating score for stage ${safetyStage}:`, error);
    }
    
    if (correct) {
      setSecurityScore(prev => prev + 1);
    }
    
    // Auto-advance after delay
    setTimeout(() => {
      if (safetyStage < 11) {
        setSafetyStage(prev => prev + 1);
        setSelectedOption(null);
        setShowResult(false);
      } else {
        // Show final results
        setSafetyStage(12);
      }
    }, 3000);
  };

  // Results screen
  if (safetyStage === 12) {
    const percentage = Math.round((securityScore / 12) * 100);
    
    return (
      <div className="space-y-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Shield className="w-10 h-10 text-orange-400" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">Security Assessment Complete</h3>
            
            <div className="text-6xl font-bold text-orange-400 mb-2">{percentage}%</div>
            <div className="text-zinc-400 mb-6">
              Safe Decisions: {securityScore}/12
            </div>

            <div className="space-y-4 text-left max-w-2xl mx-auto">
              <div className="p-4 bg-zinc-800 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Your Security Level:</h4>
                <div className="text-zinc-300">
                  {securityScore >= 11 && "🎯 Security Master - Outstanding! You navigated dangerous situations like a pro. Your Bitcoin would be safe in the real world."}
                  {securityScore >= 8 && securityScore < 11 && "🛡️ Security Conscious - Good awareness but room for improvement. Review the scenarios you missed."}
                  {securityScore >= 5 && securityScore < 8 && "⚠️ Security Student - Basic knowledge present. Continue learning to protect your Bitcoin properly."}
                  {securityScore < 5 && "🚨 Security Risk - Important gaps in knowledge detected. Study security fundamentals before using Bitcoin."}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center mt-8">
              <Button
                onClick={() => {
                  setSafetyStage(0);
                  setSecurityScore(0);
                  setSelectedOption(null);
                  setShowResult(false);
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Retake Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentSimulation) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
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
                    <p className="text-zinc-400 text-xs">Test your skills with 12 real-world scenarios</p>
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
                <ChevronDown className="w-4 h-4 mr-2" />
                Skip to Security Simulator
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Essential Bitcoin Security Guidelines */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <Shield className="w-6 h-6 text-orange-400" />
            </div>
            <h4 className="text-xl font-bold text-white">Essential Bitcoin Security Guidelines</h4>
          </div>

          <div className="space-y-6">
            {/* Private Key Security Fundamentals */}
            <div className="space-y-3">
              <h5 className="font-semibold text-white text-lg">Private Key Security Fundamentals</h5>
              <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Never share your private keys or seed phrases with anyone - not even support staff</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Store seed phrases physically on paper or metal - never digitally or in photos</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Screenshots of seed phrases can be stolen by malware or cloud backups</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Private keys control your Bitcoin - losing them means losing your funds permanently</span>
                </div>
              </div>
            </div>

            {/* Exchange Safety Guidelines */}
            <div className="space-y-3">
              <h5 className="font-semibold text-white text-lg">Exchange Safety Guidelines</h5>
              <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Remember: Not your keys, not your coins - withdraw Bitcoin to your own wallet</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Research exchange security history and reputation before using</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Watch for exit scam warning signs: withdrawal delays, lack of communication</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Understand withdrawal limits and verification requirements before depositing</span>
                </div>
              </div>
            </div>

            {/* Social Engineering Awareness */}
            <div className="space-y-3">
              <h5 className="font-semibold text-white text-lg">Social Engineering Awareness</h5>
              <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Fake giveaway scams: No legitimate person gives away Bitcoin for free</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Impersonation attacks: Verify identities through official channels</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Urgency tactics: Scammers create false deadlines to pressure quick decisions</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Take time to research and verify before making Bitcoin transactions</span>
                </div>
              </div>
            </div>

            {/* Network Security Basics */}
            <div className="space-y-3">
              <h5 className="font-semibold text-white text-lg">Network Security Basics</h5>
              <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Avoid accessing Bitcoin wallets on public WiFi networks</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Use VPN when accessing Bitcoin services on untrusted networks</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Enable two-factor authentication and keep backup codes secure</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Type wallet URLs directly - avoid clicking suspicious links</span>
                </div>
              </div>
            </div>

            {/* Hardware Wallet Best Practices */}
            <div className="space-y-3">
              <h5 className="font-semibold text-white text-lg">Hardware Wallet Best Practices</h5>
              <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Use hardware wallets for storing larger Bitcoin amounts long-term</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Buy hardware wallets directly from manufacturers or authorized dealers</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Initialize with fresh seed phrase - never use pre-generated seeds</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Test recovery process with small amounts before storing large funds</span>
                </div>
              </div>
            </div>

            {/* Software Security Essentials */}
            <div className="space-y-3">
              <h5 className="font-semibold text-white text-lg">Software Security Essentials</h5>
              <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Keep wallet software updated to latest security patches</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Verify software downloads using digital signatures when available</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Avoid counterfeit wallet apps - download from official sources only</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Use dedicated computer for Bitcoin operations when handling large amounts</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Safety Skills Test */}
      <Card id="safety-skills-test" className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <Shield className="w-6 h-6 text-orange-400" />
            </div>
            <h4 className="text-xl font-bold text-white">Test Your Security Skills</h4>
          </div>

          {/* Progress indicators */}
          <div className="flex justify-between items-center mb-4">
            <h6 className="font-semibold text-white text-sm sm:text-base">{currentSimulation.title}</h6>
            <span className="text-xs text-zinc-500">{safetyStage + 1}/12</span>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-1">
              {safetySimulations.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    index < safetyStage ? 'bg-orange-500' : 
                    index === safetyStage ? 'bg-orange-500' : 'bg-zinc-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <p className="text-zinc-400 text-xs sm:text-sm mb-4 leading-relaxed">{currentSimulation.description}</p>

          {/* Current Simulation */}
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-4 sm:p-6">
              
              {/* Phishing Email Simulation */}
              {safetyStage === 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="w-4 h-4 text-zinc-400" />
                    <span className="text-zinc-300 text-sm">Choose the SAFE email (not phishing):</span>
                  </div>
                  <div className="space-y-2">
                    {currentSimulation.emails?.map((email, index) => (
                      <button
                        key={index}
                        onClick={() => handleSafetyAnswer(index)}
                        disabled={showResult}
                        className={`w-full p-2 sm:p-3 border rounded-lg text-left transition-colors ${
                          selectedOption === index 
                            ? 'border-orange-500 bg-orange-500/10' 
                            : 'border-zinc-600 hover:border-zinc-500'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-white text-xs sm:text-sm font-medium truncate mr-2">{email.from}</span>
                          <span className="text-zinc-500 text-xs shrink-0">Today</span>
                        </div>
                        <div className="text-white text-xs sm:text-sm mb-1 line-clamp-1">{email.subject}</div>
                        <div className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">{email.preview}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Seed Phrase Simulation */}
              {safetyStage === 1 && (
                <div className="space-y-4">
                  <div className="bg-zinc-900 p-3 rounded border border-zinc-600">
                    <div className="text-orange-300 text-xs mb-2">Your Recovery Phrase:</div>
                    <div className="text-white text-sm font-mono">{currentSimulation.scenario}</div>
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
                        }`}
                      >
                        <div className="text-orange-300 text-xs sm:text-sm">
                          {option.method}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Address Verification Simulation */}
              {safetyStage === 2 && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="bg-zinc-900 p-3 rounded border border-zinc-600">
                      <div className="flex items-center gap-2 mb-2">
                        <Copy className="w-4 h-4 text-zinc-400" />
                        <span className="text-orange-300 text-xs">Copied to clipboard:</span>
                      </div>
                      <div className="text-white text-sm font-mono break-all">{currentSimulation.copied}</div>
                    </div>
                    <div className="bg-zinc-900 p-3 rounded border border-zinc-600">
                      <div className="text-orange-300 text-xs mb-2">Displayed on screen:</div>
                      <div className="text-white text-sm font-mono break-all">{currentSimulation.displayed}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {currentSimulation.options?.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleSafetyAnswer(index)}
                        disabled={showResult}
                        className={`w-full p-2 sm:p-3 border rounded-lg text-left transition-colors ${
                          selectedOption === index 
                            ? 'border-orange-500 bg-orange-500/10' 
                            : 'border-zinc-600 hover:border-zinc-500'
                        }`}
                      >
                        <div className="text-orange-300 text-xs sm:text-sm">
                          {option.text}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Scam Recognition Simulation */}
              {safetyStage === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {currentSimulation.scenarios?.map((scenario, index) => (
                      <button
                        key={index}
                        onClick={() => handleSafetyAnswer(index)}
                        disabled={showResult}
                        className={`w-full p-3 border rounded-lg text-left transition-colors ${
                          selectedOption === index 
                            ? 'border-orange-500 bg-orange-500/10' 
                            : 'border-zinc-600 hover:border-zinc-500'
                        }`}
                      >
                        <div className="text-white text-xs sm:text-sm leading-relaxed">
                          "{scenario.message}"
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Generic Options-based Simulations (stages 4-11) */}
              {safetyStage >= 4 && safetyStage <= 11 && (
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
                      }`}
                    >
                      <div className="text-orange-300 text-xs sm:text-sm">
                        {option.method}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Result Display */}
              {showResult && selectedOption !== null && (
                <div className="mt-4 p-3 bg-zinc-900 rounded border border-zinc-600">
                  <div className="flex items-center gap-2 mb-2">
                    {(() => {
                      let correct = false;
                      switch (safetyStage) {
                        case 0:
                          correct = currentSimulation.emails?.[selectedOption]?.isPhishing === false;
                          break;
                        case 2:
                          correct = currentSimulation.options?.[selectedOption]?.correct === true;
                          break;
                        case 3:
                          correct = currentSimulation.scenarios?.[selectedOption]?.isScam === false;
                          break;
                        default:
                          correct = currentSimulation.options?.[selectedOption]?.safe === true;
                          break;
                      }
                      return correct ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      );
                    })()}
                    <span className="font-semibold text-white">
                      {(() => {
                        let correct = false;
                        switch (safetyStage) {
                          case 0:
                            correct = currentSimulation.emails?.[selectedOption]?.isPhishing === false;
                            break;
                          case 2:
                            correct = currentSimulation.options?.[selectedOption]?.correct === true;
                            break;
                          case 3:
                            correct = currentSimulation.scenarios?.[selectedOption]?.isScam === false;
                            break;
                          default:
                            correct = currentSimulation.options?.[selectedOption]?.safe === true;
                            break;
                        }
                        return correct ? "Correct!" : "Incorrect";
                      })()}
                    </span>
                  </div>
                  
                  {/* Stage-specific risk explanations */}
                  {safetyStage === 0 && selectedOption !== null && currentSimulation.emails?.[selectedOption]?.isPhishing && (
                    <div className="text-red-200 text-xs mt-2">
                      <strong>Risk:</strong> You would click a phishing link. This could steal your login credentials and empty your Bitcoin wallet.
                    </div>
                  )}
                  {safetyStage === 1 && selectedOption !== null && !currentSimulation.options?.[selectedOption]?.safe && (
                    <div className="text-red-200 text-xs mt-2">
                      <strong>Risk:</strong> You would store your seed phrase insecurely. Hackers could steal it and access all your Bitcoin.
                    </div>
                  )}
                  {safetyStage === 9 && (
                    <div className="text-red-200 text-xs mt-2">
                      <strong>Risk:</strong> You would pay $200 for a $2 transaction. This wallet is likely stealing from you.
                    </div>
                  )}
                  {safetyStage === 10 && (
                    <div className="text-red-200 text-xs mt-2">
                      <strong>Risk:</strong> You would pay $200 for a $2 transaction. This wallet is likely stealing from you.
                    </div>
                  )}
                  {safetyStage === 11 && (
                    <div className="text-red-200 text-xs mt-2">
                      <strong>Risk:</strong> You would give scammers 50% of your Bitcoin for "help" you don't actually need.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}