import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, AlertTriangle } from "lucide-react";

interface SafetyQuizSectionProps {
  safetyStage: number;
  setSafetyStage: (stage: number) => void;
  safetyAnswers: { [key: number]: string };
  setSafetyAnswers: (answers: { [key: number]: string }) => void;
  safetyResults: { [key: number]: boolean };
  setSafetyResults: (results: { [key: number]: boolean }) => void;
}

const safetySimulations = [
  {
    title: "Phishing Email Detection",
    description: "You receive an urgent email about your Bitcoin wallet. Can you spot the red flags?",
    emails: [
      {
        from: "security@blockchain.com",
        subject: "URGENT: Verify Your Wallet Immediately",
        preview: "Your wallet will be suspended in 24 hours unless you verify...",
        isPhishing: true
      },
      {
        from: "noreply@ledger.com",
        subject: "Order Confirmation #12345",
        preview: "Thank you for your recent purchase. Your order has been...",
        isPhishing: false
      },
      {
        from: "support@bitcoin-wallet.net",
        subject: "Suspicious Activity Detected - Click Here Now",
        preview: "We've detected unusual activity. Click to secure your account...",
        isPhishing: true
      }
    ]
  },
  {
    title: "Bitcoin Address Verification",
    description: "You're about to send Bitcoin. Which address format is suspicious?",
    addresses: [
      { address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", safe: true, type: "Legacy" },
      { address: "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4", safe: true, type: "Bech32" },
      { address: "13UwLLHjFqK2JaQZXVh8bNfZhKp8YrKoL", safe: false, type: "Suspicious" }
    ]
  },
  {
    title: "Seed Phrase Storage",
    description: "How should you store your 12-word recovery phrase?",
    options: [
      { text: "Screenshot on phone", safe: false },
      { text: "Write on paper, store securely", safe: true },
      { text: "Save in cloud notes", safe: false },
      { text: "Email to yourself", safe: false }
    ]
  },
  {
    title: "Social Engineering Recognition",
    description: "Someone calls claiming to be from your exchange. What's the safest response?",
    scenarios: [
      { text: "Provide account details to verify", safe: false },
      { text: "Hang up and call official number", safe: true },
      { text: "Ask for their employee ID", safe: false },
      { text: "Transfer funds to 'secure wallet'", safe: false }
    ]
  },
  {
    title: "Public WiFi Safety",
    description: "You need to check your Bitcoin wallet while on public WiFi. What's safest?",
    options: [
      { text: "Use mobile data instead", safe: true },
      { text: "Connect and check quickly", safe: false },
      { text: "Use a VPN first", safe: true },
      { text: "Only view, don't transact", safe: false }
    ]
  },
  {
    title: "Software Download Safety",
    description: "You need wallet software. Where should you download it?",
    sources: [
      { text: "Official website only", safe: true },
      { text: "First Google search result", safe: false },
      { text: "Third-party download site", safe: false },
      { text: "Friend's USB drive", safe: false }
    ]
  },
  {
    title: "Social Engineering Defense",
    description: "A 'Bitcoin expert' offers to help you trade. What's the red flag?",
    offers: [
      { text: "Asks for your private keys", safe: false },
      { text: "Wants to teach strategies", safe: true },
      { text: "Guarantees 50% returns", safe: false },
      { text: "Requests upfront payment", safe: false }
    ]
  },
  {
    title: "Hardware Wallet Safety",
    description: "You're buying a hardware wallet. What's the safest approach?",
    options: [
      { text: "Buy new from manufacturer", safe: true },
      { text: "Buy from local computer store", safe: false },
      { text: "Buy used from marketplace", safe: false },
      { text: "Borrow from friend", safe: false }
    ]
  },
  {
    title: "Backup Testing",
    description: "When should you test your seed phrase recovery?",
    timing: [
      { text: "Never test it", safe: false },
      { text: "Before storing large amounts", safe: true },
      { text: "Only when wallet breaks", safe: false },
      { text: "Once a year maximum", safe: false }
    ]
  },
  {
    title: "Fee Manipulation Detection",
    description: "Your wallet suggests a $50 fee for a $20 transaction. What do you do?",
    actions: [
      { text: "Pay the high fee quickly", safe: false },
      { text: "Check multiple fee estimators", safe: true },
      { text: "Use a different wallet", safe: false },
      { text: "Cancel the transaction", safe: true }
    ]
  },
  {
    title: "Recovery Scam Recognition",
    description: "You lost your wallet. Someone offers to help recover it for 50% of funds. This is:",
    assessment: [
      { text: "A fair deal for the service", safe: false },
      { text: "Likely a scam", safe: true },
      { text: "Worth trying if desperate", safe: false },
      { text: "Standard recovery pricing", safe: false }
    ]
  },
  {
    title: "Multi-Signature Understanding",
    description: "A 2-of-3 multisig wallet means:",
    definitions: [
      { text: "You need 2 out of 3 signatures to spend", safe: true },
      { text: "The wallet has 3 separate coins", safe: false },
      { text: "You can make 3 transactions per day", safe: false },
      { text: "3 people share one private key", safe: false }
    ]
  }
];

export default function SafetyQuizSection({
  safetyStage,
  setSafetyStage,
  safetyAnswers,
  setSafetyAnswers,
  safetyResults,
  setSafetyResults
}: SafetyQuizSectionProps) {
  const currentStage = safetySimulations[safetyStage];
  
  const handleAnswer = (answer: string, isCorrect: boolean) => {
    setSafetyAnswers({ ...safetyAnswers, [safetyStage]: answer });
    setSafetyResults({ ...safetyResults, [safetyStage]: isCorrect });
    
    if (safetyStage < safetySimulations.length - 1) {
      setTimeout(() => setSafetyStage(safetyStage + 1), 1000);
    }
  };

  const getScore = () => {
    const correct = Object.values(safetyResults).filter(Boolean).length;
    const total = Object.keys(safetyResults).length;
    return { correct, total, percentage: Math.round((correct / total) * 100) };
  };

  const isCompleted = Object.keys(safetyResults).length === safetySimulations.length;

  if (isCompleted) {
    const score = getScore();
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-400" />
            Bitcoin Security Assessment Complete
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-white">{score.percentage}%</div>
            <div className="text-zinc-300">
              {score.correct} out of {score.total} security questions correct
            </div>
            
            <div className="space-y-2">
              {score.percentage >= 90 && (
                <div className="text-green-400 font-medium">
                  🛡️ Bitcoin Security Expert - You're ready to protect your Bitcoin!
                </div>
              )}
              {score.percentage >= 70 && score.percentage < 90 && (
                <div className="text-orange-400 font-medium">
                  ⚠️ Good Security Awareness - Review the areas you missed
                </div>
              )}
              {score.percentage < 70 && (
                <div className="text-red-400 font-medium">
                  🚨 Security Gaps Detected - Study Bitcoin security before holding large amounts
                </div>
              )}
            </div>
            
            <Button
              onClick={() => {
                setSafetyStage(0);
                setSafetyAnswers({});
                setSafetyResults({});
              }}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Retake Security Test
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-3">
          <Shield className="w-5 h-5 text-orange-400" />
          Bitcoin Security Training
        </CardTitle>
        <p className="text-zinc-400 text-sm">Test your Bitcoin security knowledge with real-world scenarios</p>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-3">
          <h6 className="font-semibold text-white text-sm sm:text-base">{currentStage?.title}</h6>
          <span className="text-xs text-zinc-500">{safetyStage + 1}/12</span>
        </div>
        <p className="text-zinc-400 text-xs sm:text-sm mb-4">{currentStage?.description}</p>

        {/* Render different question types based on stage */}
        {safetyStage === 0 && currentStage.emails && (
          <div className="space-y-3">
            {currentStage.emails.map((email, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(email.from, !email.isPhishing)}
                className="w-full p-3 text-left bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-600 transition-colors"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-white text-xs sm:text-sm font-medium truncate mr-2">{email.from}</span>
                  <span className="text-zinc-500 text-xs shrink-0">Today</span>
                </div>
                <div className="text-white text-xs sm:text-sm mb-1">{email.subject}</div>
                <div className="text-zinc-400 text-xs">{email.preview}</div>
              </button>
            ))}
          </div>
        )}

        {safetyStage === 1 && currentStage.addresses && (
          <div className="space-y-3">
            {currentStage.addresses.map((addr, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(addr.address, addr.safe)}
                className="w-full p-3 text-left bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-600 transition-colors"
              >
                <div className="font-mono text-xs text-white break-all mb-1">{addr.address}</div>
                <div className="text-zinc-400 text-xs">{addr.type} Address Format</div>
              </button>
            ))}
          </div>
        )}

        {/* Generic options handler for stages 2+ */}
        {safetyStage >= 2 && (
          <div className="space-y-3">
            {(currentStage.options || currentStage.scenarios || currentStage.sources || 
              currentStage.offers || currentStage.timing || currentStage.actions ||
              currentStage.assessment || currentStage.definitions)?.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option.text, option.safe)}
                className="w-full p-3 text-left bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-600 transition-colors"
              >
                <div className="text-white text-sm">{option.text}</div>
              </button>
            ))}
          </div>
        )}

        {safetyAnswers[safetyStage] && (
          <div className="mt-4 p-3 rounded-lg border flex items-center gap-2">
            {safetyResults[safetyStage] ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">Correct! Good security awareness.</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-medium">Incorrect. This could put your Bitcoin at risk.</span>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}