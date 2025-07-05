import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Target
} from "lucide-react";

interface SafetyTrainingProps {
  securityStage: number;
  setSecurityStage: (stage: number) => void;
  securityScore: number;
  setSecurityScore: (score: number) => void;
  userSecurityAnswers: Record<number, boolean>;
  setUserSecurityAnswers: (answers: Record<number, boolean>) => void;
}

// Sustainable Security Scenarios - Self-contained and maintainable
interface SecurityScenario {
  id: number;
  title: string;
  description: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  visualAid?: React.ReactNode;
}

const securityScenarios: SecurityScenario[] = [
  {
    id: 1,
    title: "Phishing Email Detection",
    description: "Identifying legitimate vs fraudulent emails",
    question: "You receive this email claiming to be from Coinbase. What should you do?",
    visualAid: (
      <div className="bg-zinc-800 rounded-lg p-4 mb-4 border border-zinc-600">
        <div className="bg-white rounded-lg p-4 text-black">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
            <div className="w-6 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">C</div>
            <span className="font-semibold">Coinbase Security</span>
            <span className="text-gray-500 text-sm">&lt;security@coinbase-verify.net&gt;</span>
          </div>
          <div className="space-y-3">
            <p className="font-semibold">Urgent: Account Verification Required</p>
            <p className="text-sm">Your account has been temporarily restricted due to unusual activity. Please verify your account immediately to restore access.</p>
            <div className="bg-blue-600 text-white px-4 py-2 rounded text-center font-semibold cursor-pointer hover:bg-blue-700">
              Verify Account Now
            </div>
            <p className="text-xs text-gray-500">If you don't verify within 24 hours, your account will be permanently suspended.</p>
          </div>
        </div>
        <div className="mt-2 text-xs text-red-400">
          ⚠️ Notice the suspicious sender domain: "coinbase-verify.net" (not coinbase.com)
        </div>
      </div>
    ),
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
    question: "Compare these Bitcoin addresses carefully. Are they identical?",
    visualAid: (
      <div className="space-y-4">
        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-600">
          <div className="space-y-3">
            <div>
              <p className="text-zinc-400 text-xs mb-2">Address you copied:</p>
              <div className="bg-zinc-800/50 rounded border border-zinc-600 p-3">
                <p className="text-zinc-300 font-mono text-sm break-all">
                  bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                </p>
              </div>
            </div>
            
            <div>
              <p className="text-zinc-400 text-xs mb-2">Address displayed in your wallet:</p>
              <div className="bg-zinc-800/50 rounded border border-zinc-600 p-3">
                <p className="text-zinc-300 font-mono text-sm break-all">
                  bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0w1h
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-xs text-orange-400 bg-orange-950/30 rounded p-2 border border-orange-800/50">
          💡 Look carefully - compare every character to ensure they match exactly
        </div>
      </div>
    ),
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
  }
];

export default function SafetyTraining({
  securityStage,
  setSecurityStage,
  securityScore,
  setSecurityScore,
  userSecurityAnswers,
  setUserSecurityAnswers
}: SafetyTrainingProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const currentScenario = securityScenarios[currentQuestionIndex];
  const totalQuestions = securityScenarios.length;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === currentScenario.correctIndex;
    setIsAnswerCorrect(isCorrect);
    setShowFeedback(true);
    
    // Update score and answers tracking
    if (isCorrect) {
      setSecurityScore(securityScore + 1);
    }
    
    const newAnswers = { ...userSecurityAnswers };
    newAnswers[currentQuestionIndex + 1] = isCorrect;
    setUserSecurityAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsAnswerCorrect(false);
    } else {
      // Quiz complete - show results
      setSecurityStage(999); // Use 999 to indicate completion
    }
  };

  const handleStartQuiz = () => {
    setHasStarted(true);
    setCurrentQuestionIndex(0);
    setSecurityScore(0);
    setUserSecurityAnswers({});
  };

  // Introduction screen
  if (!hasStarted) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Bitcoin Security Training Center</h3>
          <p className="text-zinc-400">Master essential security skills to protect your Bitcoin from real-world threats</p>
        </div>

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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-400 mb-2">$2.1B</div>
                  <div className="text-sm text-zinc-400">Stolen through social engineering in 2023</div>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-400 mb-2">135%</div>
                  <div className="text-sm text-zinc-400">Increase in crypto-draining malware</div>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400 mb-2">20%</div>
                  <div className="text-sm text-zinc-400">Of all Bitcoin may be lost forever</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-600/20 rounded-lg">
                <Target className="w-6 h-6 text-orange-400" />
              </div>
              <h4 className="text-lg font-bold text-white">What You'll Master Here</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-zinc-300 text-sm">Phishing email detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-zinc-300 text-sm">Secure seed phrase storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-zinc-300 text-sm">Address verification skills</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-zinc-300 text-sm">Scam recognition tactics</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-zinc-300 text-sm">Public WiFi safety</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-zinc-300 text-sm">Hardware wallet best practices</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-zinc-300 text-sm">Social engineering defense</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-zinc-300 text-sm">Exchange security practices</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            onClick={handleStartQuiz}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg"
          >
            Begin Security Training
          </Button>
        </div>
      </div>
    );
  }

  // Quiz completion screen
  if (securityStage === 999) {
    const percentage = Math.round((securityScore / totalQuestions) * 100);
    
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="w-8 h-8 text-orange-400" />
            <h3 className="text-2xl font-bold text-white">Security Training Complete!</h3>
          </div>
          
          <div className="text-6xl font-bold text-orange-400 mb-2">
            {percentage}%
          </div>
          <p className="text-zinc-400">
            You scored {securityScore} out of {totalQuestions} questions correctly
          </p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <h4 className="text-lg font-bold text-white mb-4">Your Security Level</h4>
            <div className="space-y-3">
              {percentage >= 90 && (
                <div className="p-4 bg-green-950/50 border border-green-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="font-semibold text-green-400">Bitcoin Security Expert</span>
                  </div>
                  <p className="text-green-300 text-sm">
                    Excellent! You demonstrate advanced understanding of Bitcoin security. You're well-prepared to safely store and transact with Bitcoin.
                  </p>
                </div>
              )}
              
              {percentage >= 70 && percentage < 90 && (
                <div className="p-4 bg-orange-950/50 border border-orange-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-orange-400" />
                    <span className="font-semibold text-orange-400">Security Conscious</span>
                  </div>
                  <p className="text-orange-300 text-sm">
                    Good work! You understand most security fundamentals. Review the areas you missed to strengthen your Bitcoin security knowledge.
                  </p>
                </div>
              )}
              
              {percentage < 70 && (
                <div className="p-4 bg-red-950/50 border border-red-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <span className="font-semibold text-red-400">Security Risk</span>
                  </div>
                  <p className="text-red-300 text-sm">
                    Important: You need more security knowledge before handling Bitcoin. Review the training materials and retake this assessment.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            onClick={() => {
              setHasStarted(false);
              setSecurityStage(0);
              setCurrentQuestionIndex(0);
              setSelectedAnswer(null);
              setShowFeedback(false);
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
          >
            Retake Training
          </Button>
        </div>
      </div>
    );
  }

  // Quiz question screen
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-white">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </h4>
        <div className="text-sm text-zinc-400">
          Score: {securityScore}/{currentQuestionIndex}
        </div>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h5 className="text-lg font-semibold text-white">{currentScenario.title}</h5>
              <p className="text-zinc-400 text-sm">{currentScenario.description}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-zinc-300 text-base">{currentScenario.question}</p>
            
            {currentScenario.visualAid && (
              <div className="my-4">
                {currentScenario.visualAid}
              </div>
            )}
            
            <div className="space-y-2">
              {currentScenario.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showFeedback}
                  className={`w-full p-3 text-left rounded border transition-colors ${
                    selectedAnswer === index 
                      ? showFeedback
                        ? index === currentScenario.correctIndex
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-red-500 bg-red-500/10'
                        : 'border-orange-500 bg-orange-500/10'
                      : showFeedback && index === currentScenario.correctIndex
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-zinc-600 hover:border-zinc-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">{option}</span>
                    {showFeedback && (
                      <>
                        {index === currentScenario.correctIndex && (
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        )}
                        {selectedAnswer === index && index !== currentScenario.correctIndex && (
                          <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        )}
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {showFeedback && (
              <div className={`p-4 rounded-lg border ${
                isAnswerCorrect 
                  ? 'bg-green-950/50 border-green-800' 
                  : 'bg-red-950/50 border-red-800'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {isAnswerCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className={`font-semibold ${
                    isAnswerCorrect ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isAnswerCorrect ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                <p className={`text-sm ${
                  isAnswerCorrect ? 'text-green-300' : 'text-red-300'
                }`}>
                  {currentScenario.explanation}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {showFeedback && (
        <div className="text-center">
          <Button 
            onClick={handleNextQuestion}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
          >
            {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'View Results'}
          </Button>
        </div>
      )}
    </div>
  );
}