import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  CheckCircle, 
  XCircle
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
        { text: "Memorize all 24 words and don't write them down", safe: false }
      ],
      explanation: "Physical storage (paper/metal) in a secure location is best. Digital storage creates hacking risks, and memory alone is unreliable."
    },
    {
      id: 3,
      title: "Bitcoin Address Verification",
      scenario: "You're about to send $5,000 worth of Bitcoin. How should you verify the receiving address?",
      options: [
        { text: "Copy-paste the address from the email and send immediately", safe: false },
        { text: "Check the first and last 4 characters, that's enough", safe: false },
        { text: "Verify every character of the address matches exactly", safe: true },
        { text: "Send a small test amount first to any similar-looking address", safe: false }
      ],
      explanation: "Always verify the complete address character by character. Malware can modify clipboard contents, changing addresses when you copy-paste."
    },
    {
      id: 4,
      title: "Social Engineering Recognition", 
      scenario: "Someone calls claiming to be from your Bitcoin exchange's security team. They know your username and ask for your 2FA code to 'verify your identity for suspicious activity.'",
      options: [
        { text: "Provide the 2FA code since they knew my username", safe: false },
        { text: "Hang up and contact the exchange directly through official channels", safe: true },
        { text: "Ask them to verify other account details first", safe: false },
        { text: "Give them my password instead of the 2FA code", safe: false }
      ],
      explanation: "Legitimate companies never ask for 2FA codes or passwords over the phone. Scammers often have some account details from data breaches."
    },
    {
      id: 5,
      title: "Exchange Security",
      scenario: "You want to store $50,000 worth of Bitcoin on an exchange for easy trading. What's the safest approach?",
      options: [
        { text: "Keep it all on the exchange for convenience", safe: false },
        { text: "Store only what I need for active trading, withdraw the rest", safe: true },
        { text: "Split it between 3 different exchanges", safe: false },
        { text: "Keep it on the exchange but turn off 2FA for faster access", safe: false }
      ],
      explanation: "Keep minimal amounts on exchanges. They're targets for hackers and can freeze accounts. Store long-term holdings in personal wallets."
    },
    {
      id: 6,
      title: "Public WiFi Risk",
      scenario: "You're at a coffee shop and need to check your Bitcoin balance. The free WiFi requires no password. What should you do?",
      options: [
        { text: "Connect to the free WiFi and check my wallet quickly", safe: false },
        { text: "Use my phone's data connection instead", safe: true },
        { text: "Connect to WiFi but only check read-only addresses", safe: false },
        { text: "Use the WiFi but log out immediately after", safe: false }
      ],
      explanation: "Public WiFi can be monitored or compromised. Use cellular data or a VPN for any Bitcoin-related activities."
    },
    {
      id: 7,
      title: "Software Download Verification",
      scenario: "You want to download a Bitcoin wallet. You find the software on multiple websites. How do you ensure you get the legitimate version?",
      options: [
        { text: "Download from the first search result on Google", safe: false },
        { text: "Download only from the official project website and verify signatures", safe: true },
        { text: "Download from a trusted friend's USB drive", safe: false },
        { text: "Use any version as long as it has good reviews", safe: false }
      ],
      explanation: "Only download from official sources and verify cryptographic signatures when possible. Fake wallet software can steal your funds."
    },
    {
      id: 8,
      title: "Social Engineering Defense",
      scenario: "You post about Bitcoin on social media. A 'crypto expert' messages you offering to help maximize your returns through a 'guaranteed investment opportunity.'",
      options: [
        { text: "Share my portfolio details to get personalized advice", safe: false },
        { text: "Ignore the message completely", safe: true },
        { text: "Ask for references from other successful clients", safe: false },
        { text: "Send a small amount first to test their service", safe: false }
      ],
      explanation: "Unsolicited investment advice is always a scam. Legitimate advisors don't cold-message people on social media promising guaranteed returns."
    },
    {
      id: 9,
      title: "Hardware Wallet Safety",
      scenario: "You want to buy a hardware wallet for maximum security. What's the safest purchasing approach?",
      options: [
        { text: "Buy new from the official manufacturer's website", safe: true },
        { text: "Buy a used one from eBay to save money", safe: false },
        { text: "Buy from a local computer store", safe: false },
        { text: "Accept a pre-configured one from a Bitcoin meetup", safe: false }
      ],
      explanation: "Only buy new hardware wallets directly from manufacturers. Used or third-party devices could be compromised with malicious firmware."
    },
    {
      id: 10,
      title: "Backup Testing",
      scenario: "You've written down your seed phrase backup. What's the best way to verify it works before putting significant funds on the wallet?",
      options: [
        { text: "Assume it's correct if I wrote it carefully", safe: false },
        { text: "Test recovery with the wallet empty, then fund it", safe: true },
        { text: "Send a large amount first, then test recovery", safe: false },
        { text: "Have a friend verify I wrote it down correctly", safe: false }
      ],
      explanation: "Always test wallet recovery with small amounts first. This ensures your backup works before committing significant funds."
    },
    {
      id: 11,
      title: "Fee Manipulation Detection",
      scenario: "You're sending Bitcoin and your wallet suggests a $200 fee for a $100 transaction. What should you do?",
      options: [
        { text: "Pay the fee since the wallet knows best", safe: false },
        { text: "Check current network fees and adjust accordingly", safe: true },
        { text: "Cancel and try again later hoping fees decrease", safe: false },
        { text: "Use a different wallet that charges less", safe: false }
      ],
      explanation: "Wallets can have bugs or malicious code that suggests excessive fees. Always verify current network conditions and fee recommendations."
    },
    {
      id: 12,
      title: "Recovery Scam Recognition",
      scenario: "You lost access to your wallet and find a 'Bitcoin recovery service' online that promises to recover your funds for a 50% fee paid upfront.",
      options: [
        { text: "Pay the fee since 50% is better than losing everything", safe: false },
        { text: "Recognize this as a scam and avoid paying anything", safe: true },
        { text: "Negotiate for a lower upfront fee", safe: false },
        { text: "Ask for guarantees before paying", safe: false }
      ],
      explanation: "Legitimate recovery only works if you have your seed phrase or private keys. Services asking for upfront fees are always scams."
    }
  ];

  const handleAnswer = (scenarioId: number, selectedAnswer: boolean) => {
    const newAnswers = { ...userSecurityAnswers, [scenarioId]: selectedAnswer };
    setUserSecurityAnswers(newAnswers);

    if (selectedAnswer) {
      setSecurityScore(securityScore + 1);
    }

    if (scenarioId < 12) {
      setSecurityStage(scenarioId + 1);
    } else {
      setShowResults(true);
    }
  };

  const currentScenario = securityScenarios.find(s => s.id === securityStage);
  const percentage = Math.round((securityScore / 12) * 100);

  if (showResults) {
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
      {/* Progress Indicator */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-orange-400 border-orange-500">
          Question {securityStage} of 12
        </Badge>
        <div className="text-zinc-400 text-sm">
          Score: {securityScore}/{securityStage - 1}
        </div>
      </div>

      {/* Current Question */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-white mb-4">{currentScenario.title}</h4>
          
          <div className="bg-zinc-800 p-4 rounded-lg mb-6">
            <p className="text-zinc-300">{currentScenario.scenario}</p>
          </div>

          <div className="space-y-3">
            {currentScenario.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(currentScenario.id, option.safe)}
                variant="outline"
                className="w-full text-left justify-start p-4 h-auto whitespace-normal border-zinc-700 hover:border-orange-500"
              >
                <span className="mr-3 text-orange-400">{String.fromCharCode(65 + index)}.</span>
                {option.text}
              </Button>
            ))}
          </div>

          {userSecurityAnswers[currentScenario.id] !== undefined && (
            <div className="mt-6 p-4 bg-zinc-800 rounded-lg">
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
    </div>
  );
}