import React, { useState } from 'react';
import { CheckCircle, XCircle, Shield, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SafetySimulatorProps {
  onComplete: (score: number, totalQuestions: number) => void;
}

const SafetySimulator: React.FC<SafetySimulatorProps> = ({ onComplete }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredStages, setAnsweredStages] = useState<boolean[]>(new Array(12).fill(false));

  const safetySimulations = [
    {
      title: "Phishing Email Detection",
      description: "Identify the suspicious email that could compromise your Bitcoin security.",
      emails: [
        {
          from: "support@blockchain.com",
          subject: "Urgent: Your account will be suspended",
          preview: "Click here to verify your account immediately or lose access forever...",
          isPhishing: true
        },
        {
          from: "newsletter@coindesk.com", 
          subject: "Weekly Bitcoin Market Update",
          preview: "Bitcoin reaches new milestone as institutional adoption grows...",
          isPhishing: false
        },
        {
          from: "security@kraken.com",
          subject: "New login detected from New York",
          preview: "We detected a new login to your account. If this wasn't you, secure your account...",
          isPhishing: false
        }
      ]
    },
    {
      title: "Seed Phrase Storage",
      description: "Choose the SAFEST way to store your 12-word seed phrase.",
      options: [
        { method: "Write on paper, store in fireproof safe", safe: true },
        { method: "Save as photo on your phone", safe: false },
        { method: "Email it to yourself", safe: false },
        { method: "Store in password manager", safe: false }
      ]
    },
    {
      title: "Address Verification", 
      description: "You're sending 0.5 BTC. Which address verification method is most secure?",
      options: [
        { method: "Check first 4 and last 4 characters only", safe: false },
        { method: "Verify the entire address character by character", safe: true },
        { method: "Trust the address if it looks similar", safe: false },
        { method: "Only check the first 8 characters", safe: false }
      ]
    },
    {
      title: "Social Engineering Defense",
      description: "Someone claiming to be from 'Bitcoin Support' calls you. What do you do?",
      options: [
        { method: "Hang up immediately - Bitcoin has no central support", safe: true },
        { method: "Listen to verify if they're legitimate", safe: false },
        { method: "Give partial information to test them", safe: false },
        { method: "Ask for their credentials first", safe: false }
      ]
    },
    {
      title: "Exchange Security",
      description: "What's the BEST practice for storing large amounts of Bitcoin?",
      options: [
        { method: "Keep on exchange for easy trading", safe: false },
        { method: "Use a hardware wallet for long-term storage", safe: true },
        { method: "Split between multiple hot wallets", safe: false },
        { method: "Store on your computer with antivirus", safe: false }
      ]
    },
    {
      title: "Public WiFi Safety",
      description: "You need to check your Bitcoin wallet while on public WiFi. What's safest?",
      options: [
        { method: "Use the public WiFi directly", safe: false },
        { method: "Wait until you have secure internet connection", safe: true },
        { method: "Use your phone's mobile data instead", safe: false },
        { method: "Check quickly and log out fast", safe: false }
      ]
    },
    {
      title: "Software Download Verification",
      description: "You're downloading a Bitcoin wallet. How do you verify it's legitimate?",
      options: [
        { method: "Download from the first Google result", safe: false },
        { method: "Check the official website and verify signatures", safe: true },
        { method: "Download from a crypto news site's recommendation", safe: false },
        { method: "Use the version your friend sent you", safe: false }
      ]
    },
    {
      title: "Backup Testing",
      description: "You've written down your seed phrase. What's the next crucial step?",
      options: [
        { method: "Put it in a safe and forget about it", safe: false },
        { method: "Test the backup by restoring a small amount", safe: true },
        { method: "Make a digital copy as backup", safe: false },
        { method: "Tell someone you trust where it's stored", safe: false }
      ]
    },
    {
      title: "Fee Manipulation Awareness",
      description: "You notice unusually high fees in your wallet. What could this indicate?",
      options: [
        { method: "Network is busy, fees are normal", safe: false },
        { method: "Possible malware manipulating transactions", safe: true },
        { method: "Your wallet needs an update", safe: false },
        { method: "Exchange is charging extra fees", safe: false }
      ]
    },
    {
      title: "Recovery Scam Recognition", 
      description: "You lost access to your wallet. Someone online offers to help recover it for a fee.",
      options: [
        { method: "Pay the fee if they seem knowledgeable", safe: false },
        { method: "Never trust anyone offering recovery services", safe: true },
        { method: "Give them partial information to test them", safe: false },
        { method: "Ask for references from other users", safe: false }
      ]
    },
    {
      title: "Hardware Wallet Safety",
      description: "Your hardware wallet arrives in an opened package. What should you do?",
      options: [
        { method: "Use it anyway if it looks intact", safe: false },
        { method: "Return it and order a new one from manufacturer", safe: true },
        { method: "Test it with small amounts first", safe: false },
        { method: "Contact the seller to complain", safe: false }
      ]
    },
    {
      title: "Two-Factor Authentication",
      description: "What's the MOST secure 2FA method for Bitcoin exchanges?",
      options: [
        { method: "SMS text messages", safe: false },
        { method: "Authenticator app like Google Authenticator", safe: true },
        { method: "Email verification", safe: false },
        { method: "Security questions", safe: false }
      ]
    }
  ];

  const handleOptionSelect = (optionIndex: number) => {
    if (showResult) return;
    setSelectedOption(optionIndex);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    setShowResult(true);
    
    // Check if answer is correct based on the current stage
    let isCorrect = false;
    const currentSimulation = safetySimulations[currentStage];
    
    if (currentStage === 0) {
      // Phishing email - correct if selected email has isPhishing: true
      isCorrect = currentSimulation.emails?.[selectedOption]?.isPhishing === true;
    } else {
      // Multiple choice - correct if selected option has safe: true
      isCorrect = currentSimulation.options?.[selectedOption]?.safe === true;
    }
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    // Mark this stage as answered
    const newAnsweredStages = [...answeredStages];
    newAnsweredStages[currentStage] = true;
    setAnsweredStages(newAnsweredStages);
  };

  const handleNext = () => {
    if (currentStage < safetySimulations.length - 1) {
      setCurrentStage(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      // Complete the simulation
      onComplete(score + (isCurrentAnswerCorrect() ? 1 : 0), safetySimulations.length);
    }
  };

  const isCurrentAnswerCorrect = () => {
    if (selectedOption === null) return false;
    
    const currentSimulation = safetySimulations[currentStage];
    if (currentStage === 0) {
      return currentSimulation.emails?.[selectedOption]?.isPhishing === true;
    } else {
      return currentSimulation.options?.[selectedOption]?.safe === true;
    }
  };

  const currentSimulation = safetySimulations[currentStage];

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-white">{currentSimulation.title}</h3>
          </div>
          <span className="text-xs text-zinc-500">{currentStage + 1}/12</span>
        </div>
        
        <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
          {currentSimulation.description}
        </p>

        {/* Stage 0: Phishing Email Simulation */}
        {currentStage === 0 && (
          <div className="space-y-3 mb-6">
            <div className="p-4 bg-zinc-800 border border-zinc-600 rounded-lg">
              <div className="text-xs text-zinc-500 mb-3">Email Inbox - Which email is dangerous?</div>
              <div className="space-y-2">
                {currentSimulation.emails?.map((email, index) => {
                  const isSelected = selectedOption === index;
                  let bgClass = 'border-zinc-600 hover:border-zinc-500 text-white';
                  let iconElement = null;
                  
                  if (showResult && isSelected) {
                    if (email.isPhishing) {
                      bgClass = 'bg-green-900/30 border-green-700 text-green-100';
                      iconElement = <CheckCircle className="w-4 h-4 text-green-400" />;
                    } else {
                      bgClass = 'bg-red-900/30 border-red-700 text-red-100';
                      iconElement = <XCircle className="w-4 h-4 text-red-400" />;
                    }
                  } else if (isSelected) {
                    bgClass = 'border-orange-500 bg-orange-500/10 text-orange-100';
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(index)}
                      disabled={showResult}
                      className={`w-full p-3 border rounded-lg text-left transition-colors ${bgClass}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-zinc-400 mb-1">From: {email.from}</div>
                          <div className="font-medium text-sm mb-1">{email.subject}</div>
                          <div className="text-xs text-zinc-500 leading-relaxed">{email.preview}</div>
                        </div>
                        {iconElement && (
                          <div className="flex-shrink-0">
                            {iconElement}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Stages 1-11: Multiple Choice Questions */}
        {currentStage > 0 && (
          <div className="space-y-3 mb-6">
            {currentSimulation.options?.map((option, index) => {
              const isSelected = selectedOption === index;
              let bgClass = 'border-zinc-600 hover:border-zinc-500 text-white';
              let iconElement = null;
              
              if (showResult && isSelected) {
                if (option.safe) {
                  bgClass = 'bg-green-900/30 border-green-700 text-green-100';
                  iconElement = <CheckCircle className="w-4 h-4 text-green-400" />;
                } else {
                  bgClass = 'bg-red-900/30 border-red-700 text-red-100';
                  iconElement = <XCircle className="w-4 h-4 text-red-400" />;
                }
              } else if (isSelected) {
                bgClass = 'border-orange-500 bg-orange-500/10 text-orange-100';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={showResult}
                  className={`w-full p-3 border rounded-lg text-left transition-colors ${bgClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full text-sm flex items-center justify-center font-medium ${
                      isSelected
                        ? 'bg-orange-600 text-white'
                        : 'bg-zinc-700 text-zinc-300'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1 text-sm font-medium leading-relaxed">
                      {option.method}
                    </span>
                    {iconElement && (
                      <div className="flex-shrink-0">
                        {iconElement}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!showResult ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50"
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
            >
              {currentStage < safetySimulations.length - 1 ? 'Next Question' : 'Complete Test'}
            </Button>
          )}
        </div>

        {/* Progress indicator */}
        <div className="mt-4 flex gap-1">
          {safetySimulations.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded ${
                index < currentStage
                  ? 'bg-orange-600'
                  : index === currentStage
                    ? 'bg-orange-600/50'
                    : 'bg-zinc-700'
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SafetySimulator;