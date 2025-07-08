import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Target,
  ChevronDown
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
  const [securityTestStage, setSecurityTestStage] = useState(0);
  const [selectedSecurityAnswer, setSelectedSecurityAnswer] = useState<number | null>(null);
  const [showSecurityFeedback, setShowSecurityFeedback] = useState(false);
  const [securityAnswerSubmitted, setSecurityAnswerSubmitted] = useState(false);
  const [isSecurityAnswerCorrect, setIsSecurityAnswerCorrect] = useState(false);

  // Self-contained security scenarios - sustainable long-term design
  const securityScenarios = [
    {
      id: 1,
      title: "Phishing Email Detection",
      description: "Identifying legitimate vs fraudulent emails",
      question: "You receive an email claiming to be from Coinbase asking you to verify your account. What should you do?",
      options: [
        "Click the link and enter your login details",
        "Forward the email to friends for their opinion",
        "Go directly to Coinbase website and check your account",
        "Reply with your account information"
      ],
      correctIndex: 2,
      explanation: "Always navigate directly to the official website rather than clicking email links. Legitimate companies never ask for credentials via email."
    },
    {
      id: 2,
      title: "Seed Phrase Storage",
      description: "Proper backup and storage methods",
      question: "What's the safest way to store your 12-word recovery phrase?",
      options: [
        "Take a photo and store it in Google Photos",
        "Write it on paper and store in a safe place",
        "Save it in a text file on your computer",
        "Email it to yourself for backup"
      ],
      correctIndex: 1,
      explanation: "Physical paper storage in a secure location is safest. Digital storage creates hacking risks, and cloud storage can be compromised."
    },
    {
      id: 3,
      title: "Address Verification",
      description: "Ensuring payment accuracy",
      question: "Before sending Bitcoin, you should:",
      options: [
        "Send a small test amount first",
        "Verify every character of the receiving address",
        "Only check the first and last 4 characters",
        "Trust the address if it looks similar"
      ],
      correctIndex: 1,
      explanation: "Bitcoin transactions are irreversible. Every single character must match exactly - one wrong character sends funds to the wrong address forever."
    },
    {
      id: 4,
      title: "Scam Recognition",
      description: "Identifying legitimate vs fraudulent opportunities",
      question: "Which message is legitimate and safe to trust?",
      options: [
        "Elon Musk Bitcoin giveaway requiring BTC deposit",
        "Prince offering Bitcoin fortune sharing opportunity",
        "Local Bitcoin meetup invitation for learning",
        "Urgent wallet verification requiring private keys"
      ],
      correctIndex: 2,
      explanation: "Educational meetups are legitimate community events. All others are common scam patterns - no one gives away free Bitcoin or needs your private keys."
    },
    {
      id: 5,
      title: "Public WiFi Security",
      description: "Safe practices on untrusted networks",
      question: "You're at a coffee shop and want to check your Bitcoin wallet. What's the safest approach?",
      options: [
        "Use your mobile data instead of public WiFi",
        "Connect to any WiFi and check quickly",
        "Use the coffee shop's guest WiFi",
        "Ask other customers for the WiFi password"
      ],
      correctIndex: 0,
      explanation: "Public WiFi networks can be monitored or compromised. Always use your cellular data for financial activities when possible."
    },
    {
      id: 6,
      title: "Hardware Wallet Safety",
      description: "Secure hardware wallet practices",
      question: "When buying a hardware wallet, you should:",
      options: [
        "Buy from any online marketplace for best price",
        "Purchase directly from manufacturer or authorized dealer",
        "Buy a used one to save money",
        "Get one that comes pre-configured"
      ],
      correctIndex: 1,
      explanation: "Only buy from official sources to avoid tampered devices. Used or pre-configured wallets may have compromised security."
    },
    {
      id: 7,
      title: "Social Engineering Defense", 
      description: "Recognizing manipulation tactics",
      question: "Someone calls claiming to be from your bank, asking for your Bitcoin wallet details to 'help secure your account'. You should:",
      options: [
        "Provide the information since they called you",
        "Hang up and call your bank directly using official numbers",
        "Ask them to call back later",
        "Give partial information to verify they're legitimate"
      ],
      correctIndex: 1,
      explanation: "Banks never ask for Bitcoin wallet information. Always hang up and call official numbers to verify any unexpected contact."
    },
    {
      id: 8,
      title: "Exchange Security",
      description: "Safe exchange practices",
      question: "What's the best practice for using cryptocurrency exchanges?",
      options: [
        "Keep all your Bitcoin on the exchange for easy trading",
        "Use the same password across multiple exchanges",
        "Enable 2FA and withdraw funds to your personal wallet",
        "Share your account with trusted friends"
      ],
      correctIndex: 2,
      explanation: "Exchanges can be hacked or go offline. Enable 2FA for security and withdraw to your personal wallet for long-term storage."
    },
    {
      id: 9,
      title: "Hardware Wallet Purchase",
      description: "Buying secure hardware wallets",
      question: "When buying a hardware wallet, you should:",
      options: [
        "Buy from any online marketplace for best price",
        "Purchase used one to save money",
        "Get one that comes pre-configured",
        "Buy directly from manufacturer or authorized dealer"
      ],
      correctIndex: 3,
      explanation: "Only buy from official sources to avoid tampered devices. Used or pre-configured wallets may have compromised security."
    },
    {
      id: 10,
      title: "Backup Testing",
      description: "Verifying recovery phrase works",
      question: "You've written down your seed phrase. How do you verify it's correct?",
      options: [
        "Trust that you wrote it correctly",
        "Test recovery with small amount first",
        "Ask someone else to check your writing",
        "Wait until you need to use it"
      ],
      correctIndex: 1,
      explanation: "Testing recovery with small amounts ensures your backup works. Many people lose Bitcoin with untested backup phrases."
    },
    {
      id: 11,
      title: "Fee Manipulation Detection",
      description: "Recognizing malicious wallet behavior",
      question: "Your wallet suggests a $200 fee for sending $50 worth of Bitcoin. Normal fees are around $2. What's your response?",
      options: [
        "Pay the fee - wallet knows best",
        "Try different wallet immediately",
        "Ignore warning and send anyway",
        "Use different wallet app"
      ],
      correctIndex: 1,
      explanation: "Excessive fees indicate wallet malware. Legitimate wallets suggest normal fees - this wallet is trying to steal through fees."
    },
    {
      id: 12,
      title: "Recovery Scam Recognition",
      description: "Identifying fraudulent recovery services",
      question: "You lost access to your Bitcoin wallet. Someone offers to recover it for 50% of the funds. What do you do?",
      options: [
        "Pay them - 50% is better than nothing",
        "Negotiate for lower percentage",
        "Avoid - likely a scam",
        "Ask for references first"
      ],
      correctIndex: 2,
      explanation: "Most recovery services are scams promising impossible results. Legitimate recovery is extremely rare and expensive."
    },
    {
      id: 13,
      title: "Privacy Protection",
      description: "Protecting financial privacy",
      question: "A friend asks for your Bitcoin wallet address to 'see how much you have'. Do you share it?",
      options: [
        "Sure - friends should trust each other",
        "Share but ask them not to check balance",
        "No - wallet addresses reveal balance",
        "Only share one address, not all"
      ],
      correctIndex: 2,
      explanation: "Sharing wallet addresses lets anyone see your Bitcoin balance and transaction history on the blockchain."
    },
    {
      id: 14,
      title: "Market Volatility Response",
      description: "Handling Bitcoin price crashes",
      question: "Bitcoin crashes 30% in one day. You're down $2,000. What's your move?",
      options: [
        "Panic sell to prevent more losses",
        "Hold and ignore short-term volatility",
        "Sell half to reduce risk",
        "Buy more while price is lower"
      ],
      correctIndex: 1,
      explanation: "Bitcoin historically recovers from crashes and reaches new highs. Patient holders typically see better long-term returns."
    },
    {
      id: 15,
      title: "Investment Research",
      description: "Evaluating cryptocurrency investments",
      question: "A YouTube influencer promotes a 'guaranteed 100x' cryptocurrency. Should you invest?",
      options: [
        "Invest immediately - 100x sounds amazing",
        "Research independently first",
        "Invest small amount to test",
        "Follow the influencer's advice"
      ],
      correctIndex: 1,
      explanation: "Independent research protects you from paid promotions and biased advice that could lose you money on bad investments."
    },
    {
      id: 16,
      title: "App Store Safety",
      description: "Downloading legitimate wallet apps",
      question: "You want to download a Bitcoin wallet app on your phone. Where's the safest place?",
      options: [
        "Download from first Google result",
        "Use Bitcoin forum link",
        "Official app store only",
        "Download from crypto news website"
      ],
      correctIndex: 2,
      explanation: "Official app stores have security screening. Fake Bitcoin wallet apps from other sources have stolen millions."
    }
  ];

  const handleSecurityAnswer = (selectedIndex: number) => {
    if (securityAnswerSubmitted) return;
    
    setSelectedSecurityAnswer(selectedIndex);
    
    const currentScenario = securityScenarios[securityTestStage - 1];
    const isCorrect = selectedIndex === currentScenario.correctIndex;
    
    // Immediately show feedback
    setIsSecurityAnswerCorrect(isCorrect);
    setShowSecurityFeedback(true);
    setSecurityAnswerSubmitted(true);
    
    // Update score
    if (isCorrect) {
      setSecurityScore(securityScore + 1);
    }
  };

  const getSecurityExplanation = (stage: number, isCorrect: boolean): string => {
    const currentScenario = securityScenarios[stage - 1];
    if (currentScenario) {
      return currentScenario.explanation;
    }
    return "Good choice!";
  };

  // Introduction screen (stage 0)
  if (securityTestStage === 0) {
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
                      <p className="text-zinc-400 text-xs">Test your skills with 16 real-world scenarios</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center pt-2">
                <Button
                  onClick={() => {
                    const simulator = document.getElementById('safety-skills-test');
                    if (simulator) {
                      const rect = simulator.getBoundingClientRect();
                      const headerHeight = 80;
                      window.scrollTo({
                        top: window.pageYOffset + rect.top - headerHeight,
                        behavior: 'smooth'
                      });
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
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-zinc-300 text-sm">Keep wallet software updated to latest security patches</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-zinc-300 text-sm">Verify software downloads using digital signatures when available</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-zinc-300 text-sm">Avoid counterfeit wallet apps - download from official sources only</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
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

            <div className="space-y-3">
              <h5 className="font-semibold text-white">Ready to Test Your Skills?</h5>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <Shield className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="font-medium text-white text-sm">16 Immersive Scenarios</p>
                    <p className="text-zinc-400 text-xs">Real-world decision making with consequences</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <Target className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="font-medium text-white text-sm">Learn from Outcomes</p>
                    <p className="text-zinc-400 text-xs">See realistic consequences of your choices</p>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-zinc-400 mb-4">
                • 16 immersive scenarios<br/>
                • Real-world decision making<br/>
                • See consequences of your choices<br/>
                • Learn from realistic outcomes
              </div>
            </div>
            
            <div className="flex justify-center pt-2">
              <Button
                onClick={() => {
                  setSecurityTestStage(1);
                  // Scroll to ensure content is visible below header
                  setTimeout(() => {
                    const simulator = document.getElementById('safety-skills-test');
                    if (simulator) {
                      const rect = simulator.getBoundingClientRect();
                      const headerHeight = 80;
                      window.scrollTo({
                        top: window.pageYOffset + rect.top - headerHeight,
                        behavior: 'smooth'
                      });
                    }
                  }, 100);
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
              >
                Begin Simulation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Results screen (stage 17)
  if (securityTestStage === 17) {
    const percentage = Math.round((securityScore / 16) * 100);
    
    return (
      <div className="text-center space-y-6">
        <div className="p-6 rounded-lg border border-zinc-700 bg-zinc-800/50">
          {securityScore >= 14 ? (
            <div>
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Security Master</h4>
              <p className="text-zinc-300 mb-3">
                Safe Decisions: {securityScore}/16 ({percentage}%)
              </p>
              <p className="text-zinc-300 text-sm">
                Outstanding! You navigated dangerous situations like a pro. Your Bitcoin would be safe in the real world.
              </p>
            </div>
          ) : securityScore >= 11 ? (
            <div>
              <Shield className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Security Conscious</h4>
              <p className="text-zinc-300 mb-3">
                Safe Decisions: {securityScore}/16 ({percentage}%)
              </p>
              <p className="text-zinc-300 text-sm">
                Good security awareness! You avoided most threats but review the scenarios you missed.
              </p>
            </div>
          ) : securityScore >= 8 ? (
            <div>
              <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Security Student</h4>
              <p className="text-zinc-300 mb-3">
                Safe Decisions: {securityScore}/16 ({percentage}%)
              </p>
              <p className="text-zinc-300 text-sm">
                Basic security knowledge present. Study the failed scenarios before using Bitcoin with real money.
              </p>
            </div>
          ) : (
            <div>
              <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Security Risk</h4>
              <p className="text-zinc-300 mb-3">
                Safe Decisions: {securityScore}/16 ({percentage}%)
              </p>
              <p className="text-zinc-300 text-sm">
                Important security gaps detected. Study Bitcoin security fundamentals before using Bitcoin with real money.
              </p>
            </div>
          )}
          
          <div className="flex gap-3 justify-center mt-6">
            <Button
              onClick={() => {
                setSecurityTestStage(0);
                setSecurityScore(0);
                setSelectedSecurityAnswer(null);
                setShowSecurityFeedback(false);
                setSecurityAnswerSubmitted(false);
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Retake Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Simulation scenarios (stages 1-16)
  if (securityTestStage > 0 && securityTestStage <= 16) {
    return (
      <div className="space-y-4">
        {/* Progress Header */}
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold text-white">
            Scenario {securityTestStage} of 16
          </h4>
          <div className="text-sm text-zinc-400">
            Safe Choices: {securityScore}/{securityTestStage - 1}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-700 rounded-full h-2">
          <div 
            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(securityTestStage / 16) * 100}%` }}
          />
        </div>

        {/* Current Question */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardContent className="p-6">
            {/* Scenario 1: The Urgent Email */}
            {securityTestStage === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <span className="text-orange-400 text-sm">📧</span>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-white">The Urgent Email</h5>
                    <p className="text-zinc-400 text-sm">Monday morning, 8:47 AM</p>
                  </div>
                </div>
                
                <div className="p-4 bg-zinc-900/50 rounded border border-zinc-600">
                  <p className="text-zinc-300 mb-3">
                    You're checking emails over coffee when this message catches your attention:
                  </p>
                  <div className="p-3 bg-red-950/30 rounded border border-red-800/50">
                    <div className="text-sm space-y-1">
                      <div><strong className="text-red-400">From:</strong> security@bitcoin-wallet.com</div>
                      <div><strong className="text-red-400">Subject:</strong> URGENT: Verify Your Wallet Now</div>
                      <div className="text-zinc-300 mt-2 text-xs">
                        "Your Bitcoin wallet has been compromised. Unauthorized access detected. 
                        Click here immediately to secure your funds: bitcoin-security-check.net/verify"
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-zinc-300 text-sm">
                  Your heart rate increases. You have 0.5 BTC in your wallet. What do you do?
                </p>

                <div className="space-y-2">
                  {[
                    'Click the link immediately - my Bitcoin could be stolen!',
                    'Check the sender domain more carefully first',
                    'Ignore it - Bitcoin has no customer support team',
                    'Forward it to friends to warn them'
                  ].map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSecurityAnswer(index)}
                      disabled={securityAnswerSubmitted}
                      className={`w-full p-3 text-left rounded border transition-colors ${
                        selectedSecurityAnswer === index 
                          ? 'border-orange-500 bg-orange-500/10' 
                          : 'border-zinc-600 hover:border-zinc-500'
                      }`}
                    >
                      <span className="text-white text-sm">{option}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Scenario 2: New Wallet Setup */}
            {securityTestStage === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <span className="text-orange-400 text-sm">🔐</span>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-white">New Wallet Setup</h5>
                    <p className="text-zinc-400 text-sm">Your first hardware wallet</p>
                  </div>
                </div>
                
                <div className="p-4 bg-zinc-900/50 rounded border border-zinc-600">
                  <p className="text-zinc-300 mb-3">
                    Congratulations! Your new hardware wallet has generated your recovery phrase. 
                    The device shows these 12 words on screen:
                  </p>
                  <div className="p-3 bg-green-950/30 rounded border border-green-800/50">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      <div className="bg-zinc-800/50 rounded px-1.5 py-1 text-center">
                        <span className="text-green-400 text-xs font-mono">1. mountain</span>
                      </div>
                      <div className="bg-zinc-800/50 rounded px-1.5 py-1 text-center">
                        <span className="text-green-400 text-xs font-mono">2. forest</span>
                      </div>
                      <div className="bg-zinc-800/50 rounded px-1.5 py-1 text-center">
                        <span className="text-green-400 text-xs font-mono">3. library</span>
                      </div>
                      <div className="bg-zinc-800/50 rounded px-1.5 py-1 text-center">
                        <span className="text-green-400 text-xs font-mono">4. ocean</span>
                      </div>
                      <div className="bg-zinc-800/50 rounded px-1.5 py-1 text-center">
                        <span className="text-green-400 text-xs font-mono">5. sunset</span>
                      </div>
                      <div className="bg-zinc-800/50 rounded px-1.5 py-1 text-center">
                        <span className="text-green-400 text-xs font-mono">6. garden</span>
                      </div>
                      <div className="bg-zinc-800/50 rounded px-1.5 py-1 text-center">
                        <span className="text-green-400 text-xs font-mono">7. whisper</span>
                      </div>
                      <div className="bg-zinc-800/50 rounded px-1.5 py-1 text-center">
                        <span className="text-green-400 text-xs font-mono">8. thunder</span>
                      </div>
                      <div className="bg-zinc-800/50 rounded px-1.5 py-1 text-center">
                        <span className="text-green-400 text-xs font-mono">9. crystal</span>
                      </div>
                      <div className="bg-zinc-800/50 rounded px-1.5 py-1 text-center">
                        <span className="text-green-400 text-xs font-mono">10. journey</span>
                      </div>
                      <div className="bg-zinc-800/50 rounded px-1.5 py-1 text-center">
                        <span className="text-green-400 text-xs font-mono">11. freedom</span>
                      </div>
                      <div className="bg-zinc-800/50 rounded px-1.5 py-1 text-center">
                        <span className="text-green-400 text-xs font-mono">12. wisdom</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-zinc-300 text-sm">
                  The manual warns: "Store your recovery phrase safely - this controls your Bitcoin forever!" What's your storage plan?
                </p>

                <div className="space-y-2">
                  {[
                    'Take a screenshot for convenience',
                    'Write on paper and store in safe',
                    'Memorize it - no physical trace',
                    'Save in my password manager'
                  ].map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSecurityAnswer(index)}
                      disabled={securityAnswerSubmitted}
                      className={`w-full p-3 text-left rounded border transition-colors ${
                        selectedSecurityAnswer === index 
                          ? 'border-orange-500 bg-orange-500/10' 
                          : 'border-zinc-600 hover:border-zinc-500'
                      }`}
                    >
                      <span className="text-white text-sm">{option}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Scenario 3: Address Verification */}
            {securityTestStage === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <span className="text-orange-400 text-sm">🎯</span>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-white">{securityScenarios[2].title}</h5>
                    <p className="text-zinc-400 text-sm">{securityScenarios[2].description}</p>
                  </div>
                </div>
                
                <div className="p-4 bg-zinc-900/50 rounded border border-zinc-600">
                  <p className="text-zinc-300 mb-3">
                    {securityScenarios[2].question}
                  </p>
                </div>

                <div className="space-y-2">
                  {securityScenarios[2].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSecurityAnswer(index)}
                      disabled={securityAnswerSubmitted}
                      className={`w-full p-3 text-left rounded border transition-colors ${
                        selectedSecurityAnswer === index 
                          ? 'border-orange-500 bg-orange-500/10' 
                          : 'border-zinc-600 hover:border-zinc-500'
                      }`}
                    >
                      <span className="text-white text-sm">{option}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Scenario 4: Scam Recognition */}
            {securityTestStage === 4 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <span className="text-orange-400 text-sm">🚨</span>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-white">{securityScenarios[3].title}</h5>
                    <p className="text-zinc-400 text-sm">{securityScenarios[3].description}</p>
                  </div>
                </div>
                
                <div className="p-4 bg-zinc-900/50 rounded border border-zinc-600">
                  <p className="text-zinc-300 mb-3">
                    {securityScenarios[3].question}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-zinc-800/50 rounded border border-zinc-600">
                      <p className="text-zinc-300 text-sm">
                        "Elon Musk is giving away Bitcoin! Send 0.1 BTC to get 1 BTC back! Limited time offer!"
                      </p>
                    </div>
                    
                    <div className="p-3 bg-zinc-800/50 rounded border border-zinc-600">
                      <p className="text-zinc-300 text-sm">
                        "I'm a prince who needs help moving my Bitcoin fortune. I'll share 50% if you help with transaction fees."
                      </p>
                    </div>
                    
                    <div className="p-3 bg-zinc-800/50 rounded border border-zinc-600">
                      <p className="text-zinc-300 text-sm">
                        "Your local Bitcoin meetup is next Thursday at 7 PM. Bring questions and let's learn together!"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {securityScenarios[3].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSecurityAnswer(index)}
                      disabled={securityAnswerSubmitted}
                      className={`w-full p-3 text-left rounded border transition-colors ${
                        selectedSecurityAnswer === index 
                          ? 'border-orange-500 bg-orange-500/10' 
                          : 'border-zinc-600 hover:border-zinc-500'
                      }`}
                    >
                      <span className="text-white text-sm">{option}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Scenarios 5-16: Using unified securityScenarios array */}
            {securityTestStage >= 5 && securityTestStage <= 16 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <span className="text-orange-400 text-sm">⚠️</span>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-white">{securityScenarios[securityTestStage - 1].title}</h5>
                    <p className="text-zinc-400 text-sm">{securityScenarios[securityTestStage - 1].description}</p>
                  </div>
                </div>
                
                <div className="p-4 bg-zinc-900/50 rounded border border-zinc-600">
                  <p className="text-zinc-300 mb-3">
                    {securityScenarios[securityTestStage - 1].question}
                  </p>
                </div>

                <div className="space-y-2">
                  {securityScenarios[securityTestStage - 1].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSecurityAnswer(index)}
                      disabled={securityAnswerSubmitted}
                      className={`w-full p-3 text-left rounded border transition-colors ${
                        selectedSecurityAnswer === index 
                          ? 'border-orange-500 bg-orange-500/10' 
                          : 'border-zinc-600 hover:border-zinc-500'
                      }`}
                    >
                      <span className="text-white text-sm">{option}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}



            {/* Answer Feedback */}
            {showSecurityFeedback && (
              <div className="mt-4 p-4 rounded border bg-zinc-800/50 border-zinc-700">
                <div className="flex items-center gap-2 mb-2">
                  {isSecurityAnswerCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✗</span>
                    </div>
                  )}
                  <span className="text-white font-medium">
                    {isSecurityAnswerCorrect ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-zinc-300 text-sm">
                  {getSecurityExplanation(securityTestStage, isSecurityAnswerCorrect)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Button */}
        {showSecurityFeedback && (
          <div className="flex justify-center">
            <Button
              onClick={() => {
                if (securityTestStage < 16) {
                  setSecurityTestStage(securityTestStage + 1);
                  setSelectedSecurityAnswer(null);
                  setShowSecurityFeedback(false);
                  setSecurityAnswerSubmitted(false);
                } else {
                  setSecurityTestStage(17); // Show results
                }
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {securityTestStage < 16 ? 'Next Question' : 'View Results'}
            </Button>
          </div>
        )}
      </div>
    );
  }

  return null;
}