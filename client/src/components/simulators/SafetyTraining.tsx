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
  const [showResults, setShowResults] = useState(false);

  const securityScenarios = [
    {
      id: 1,
      title: "Phishing Email Detection",
      scenario: "You receive an email claiming to be from Coinbase saying 'Urgent: Verify your account within 24 hours or your funds will be frozen.' The email has a link to 'coinbase-security.net'.",
      options: [
        { text: "Click the link immediately to secure my account", safe: false },
        { text: "Delete the email and log into Coinbase directly through my browser", safe: true },
        { text: "Forward the email to friends to warn them", safe: false },
        { text: "Reply asking for more verification", safe: false }
      ],
      explanation: "Real companies never ask you to verify accounts through email links. Always access your accounts directly through official websites or apps."
    },
    {
      id: 2,
      title: "Seed Phrase Storage",
      scenario: "You just set up a new Bitcoin wallet and need to store your 24-word seed phrase safely. What's the most secure approach?",
      options: [
        { text: "Take a photo and store it in my phone's cloud backup", safe: false },
        { text: "Write it on paper and store in a fireproof safe", safe: true },
        { text: "Save it in a password-protected document on my computer", safe: false },
        { text: "Email it to myself for safekeeping", safe: false }
      ],
      explanation: "Physical storage is safest. Digital storage risks theft through malware, cloud breaches, or computer failures."
    },
    // Add remaining 10 scenarios...
    {
      id: 12,
      title: "Recovery Scam Recognition",
      scenario: "Someone contacts you claiming they can recover your lost Bitcoin for a 50% fee upfront, showing 'proof' of previous successful recoveries.",
      options: [
        { text: "Pay the fee since they seem legitimate", safe: false },
        { text: "Ask for references from previous clients", safe: false },
        { text: "Recognize this as a scam and ignore it", safe: true },
        { text: "Negotiate a lower fee", safe: false }
      ],
      explanation: "Lost Bitcoin cannot be recovered by third parties. These are always scams designed to steal more money."
    }
  ];

  const currentScenario = securityScenarios.find(s => s.id === securityStage);

  const handleAnswer = (scenarioId: number, isCorrect: boolean) => {
    const newAnswers = { ...userSecurityAnswers, [scenarioId]: isCorrect };
    setUserSecurityAnswers(newAnswers);
    
    if (isCorrect) {
      setSecurityScore(securityScore + 1);
    }
    
    // Auto-advance after short delay
    setTimeout(() => {
      if (securityStage < 12) {
        setSecurityStage(securityStage + 1);
      } else {
        setShowResults(true);
      }
    }, 2000);
  };

  // Results screen
  if (showResults) {
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
              You answered {securityScore} out of 12 questions correctly
            </div>

            <div className="space-y-4 text-left max-w-2xl mx-auto">
              <div className="p-4 bg-zinc-800 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Your Security Level:</h4>
                <div className="text-zinc-300">
                  {percentage >= 90 && "🎯 Security Expert - You have excellent Bitcoin security knowledge"}
                  {percentage >= 75 && percentage < 90 && "🛡️ Security Conscious - Good knowledge with room for improvement"}
                  {percentage >= 60 && percentage < 75 && "⚠️ Security Aware - Basic knowledge, continue learning"}
                  {percentage < 60 && "🚨 Security Risk - Important to strengthen your Bitcoin security knowledge"}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center mt-8">
              <Button
                onClick={() => {
                  setSecurityStage(1);
                  setSecurityScore(0);
                  setUserSecurityAnswers({});
                  setShowResults(false);
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

  if (!currentScenario) return null;

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

          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-6">
            <Badge variant="outline" className="text-orange-400 border-orange-500">
              Question {securityStage} of 12
            </Badge>
            <div className="text-zinc-400 text-sm">
              Score: {securityScore}/{securityStage - 1}
            </div>
          </div>

          {/* Current Question */}
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-white mb-4">{currentScenario.title}</h4>
              
              <div className="bg-zinc-900 p-4 rounded-lg mb-6">
                <p className="text-zinc-300">{currentScenario.scenario}</p>
              </div>

              <div className="space-y-3">
                {currentScenario.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(currentScenario.id, option.safe)}
                    variant="outline"
                    className="w-full text-left justify-start p-4 h-auto whitespace-normal border-zinc-600 hover:border-orange-500"
                    disabled={userSecurityAnswers[currentScenario.id] !== undefined}
                  >
                    <span className="mr-3 text-orange-400">{String.fromCharCode(65 + index)}.</span>
                    {option.text}
                  </Button>
                ))}
              </div>

              {userSecurityAnswers[currentScenario.id] !== undefined && (
                <div className="mt-6 p-4 bg-zinc-900 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {userSecurityAnswers[currentScenario.id] ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className="font-semibold text-white">
                      {userSecurityAnswers[currentScenario.id] ? "Correct!" : "Incorrect"}
                    </span>
                  </div>
                  <p className="text-zinc-300 text-sm">{currentScenario.explanation}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}