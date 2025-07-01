import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface SafetyQuestion {
  id: number;
  title: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const safetyQuestions: SafetyQuestion[] = [
  {
    id: 1,
    title: "Phishing Detection",
    question: "You receive an email saying 'Your Bitcoin wallet will be closed in 24 hours unless you verify now.' What should you do?",
    options: [
      "Click the link to verify quickly",
      "Ignore the email - legitimate services don't threaten closure",
      "Forward it to friends to warn them",
      "Reply asking for more information"
    ],
    correctAnswer: 1,
    explanation: "Legitimate Bitcoin services never threaten immediate account closure. This is a classic phishing tactic using urgency and fear."
  },
  {
    id: 2,
    title: "Seed Phrase Security", 
    question: "You just created a Bitcoin wallet. How should you store your 12-word recovery phrase?",
    options: [
      "Take a screenshot and save to cloud",
      "Write it down on paper and store safely",
      "Email it to yourself",
      "Save it in a text file on your computer"
    ],
    correctAnswer: 1,
    explanation: "Writing your seed phrase on paper and storing it in a secure physical location is the safest method. Digital storage can be hacked."
  },
  {
    id: 3,
    title: "Address Verification",
    question: "Before sending Bitcoin, you should always:",
    options: [
      "Send a small test amount first",
      "Double-check the receiving address character by character",
      "Use the same address you used before",
      "Send the full amount to save on fees"
    ],
    correctAnswer: 1,
    explanation: "Always verify the receiving address character by character. One wrong character means your Bitcoin goes to someone else forever."
  },
  {
    id: 4,
    title: "Exchange Security",
    question: "Which is the safest way to buy your first Bitcoin?",
    options: [
      "Buy from a stranger on social media",
      "Use a Bitcoin ATM with cash",
      "Use a local Bitcoin meetup",
      "Use a well-known regulated exchange like Coinbase"
    ],
    correctAnswer: 3,
    explanation: "Well-known regulated exchanges have security measures, insurance, and legal compliance. They're safest for beginners."
  },
  {
    id: 5,
    title: "WiFi Security",
    question: "You're at a coffee shop and want to check your Bitcoin wallet. What should you do?",
    options: [
      "Use the coffee shop's free WiFi",
      "Use your mobile data instead",
      "Check prices only, no transactions",
      "Use a VPN on the coffee shop WiFi"
    ],
    correctAnswer: 1,
    explanation: "Public WiFi can be monitored by attackers. Always use your mobile data for sensitive financial activities."
  },
  {
    id: 6,
    title: "Software Downloads",
    question: "You need to download a Bitcoin wallet. Where should you get it?",
    options: [
      "First result on Google search",
      "Official website of the wallet",
      "Friend's recommendation from a forum",
      "App store search results"
    ],
    correctAnswer: 1,
    explanation: "Always download Bitcoin software from official websites. Fake wallets on app stores and search results can steal your Bitcoin."
  },
  {
    id: 7,
    title: "Social Engineering",
    question: "Someone calls claiming to be from your exchange, asking for your 2FA code. What do you do?",
    options: [
      "Ask them to verify my account details first",
      "Give them the code since they knew my email",
      "Tell them to email me instead",
      "Hang up and call the exchange directly"
    ],
    correctAnswer: 3,
    explanation: "Legitimate exchanges never call asking for 2FA codes. Always hang up and contact them through official channels."
  },
  {
    id: 8,
    title: "Hardware Wallet",
    question: "You want to buy a hardware wallet. What's the SAFEST approach?",
    options: [
      "Buy used on eBay to save money",
      "Buy new from official manufacturer",
      "Buy from Amazon third-party seller",
      "Buy from local computer store"
    ],
    correctAnswer: 1,
    explanation: "Only buy hardware wallets new from official manufacturers. Used or third-party devices could be compromised."
  },
  {
    id: 9,
    title: "Backup Testing",
    question: "You wrote down your seed phrase. How should you verify it's correct?",
    options: [
      "Wait until you need to restore the wallet",
      "Test restore on a separate device or wallet",
      "Take a photo of the seed phrase as backup",
      "Share with trusted family member to verify"
    ],
    correctAnswer: 1,
    explanation: "Always test your backup by restoring it on a separate device. This ensures you wrote it down correctly."
  },
  {
    id: 10,
    title: "Fee Manipulation",
    question: "Your wallet suggests a $200 fee for a $50 Bitcoin transaction, but normal fees are $2. What should you do?",
    options: [
      "Pay the $200 fee since the wallet knows best",
      "Never use this wallet again - it might be malicious",
      "Try sending anyway with the high fee",
      "Ignore the fee warning and send anyway"
    ],
    correctAnswer: 1,
    explanation: "Extremely high fees compared to market rates could indicate a malicious wallet trying to steal your Bitcoin through fees."
  },
  {
    id: 11,
    title: "Recovery Scams",
    question: "You lost access to your wallet. Someone offers to recover it for 50% of the funds. What should you do?",
    options: [
      "Agree since 50% is better than 0%",
      "Ask for references and research the company",
      "Decline and try to recover yourself",
      "Negotiate for a lower percentage"
    ],
    correctAnswer: 2,
    explanation: "Recovery scams are common. If you have your seed phrase, you can recover yourself. If not, those funds are likely lost forever."
  },
  {
    id: 12,
    title: "Private Key Safety",
    question: "What should you NEVER do with your Bitcoin private key?",
    options: [
      "Store it in a bank safe deposit box",
      "Share it with anyone, even family",
      "Write it down on paper",
      "Keep it separate from your computer"
    ],
    correctAnswer: 1,
    explanation: "Your private key gives complete control over your Bitcoin. Never share it with anyone - whoever has it owns your Bitcoin."
  }
];

export default function SafetyQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === safetyQuestions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < safetyQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCompleted(false);
  };

  const question = safetyQuestions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  if (completed) {
    const percentage = Math.round((score / safetyQuestions.length) * 100);
    
    return (
      <Card className="bg-zinc-800 border-zinc-700">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="p-6 rounded-lg border bg-zinc-800/50 border-zinc-700">
              {percentage >= 80 ? (
                <div>
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <h5 className="text-xl font-bold text-white mb-2">Security Expert</h5>
                  <p className="text-zinc-300 mb-3">
                    Score: {score}/{safetyQuestions.length} ({percentage}%) - Your Bitcoin will be safe!
                  </p>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    You've mastered Bitcoin security fundamentals. You can confidently protect your assets.
                  </p>
                </div>
              ) : percentage >= 60 ? (
                <div>
                  <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                  <h5 className="text-xl font-bold text-white mb-2">Need More Practice</h5>
                  <p className="text-zinc-300 mb-3">
                    Score: {score}/{safetyQuestions.length} ({percentage}%) - Study more before risking real Bitcoin
                  </p>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    Review the questions you missed and practice more before using Bitcoin.
                  </p>
                </div>
              ) : (
                <div>
                  <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                  <h5 className="text-xl font-bold text-white mb-2">High Risk</h5>
                  <p className="text-zinc-300 mb-3">
                    Score: {score}/{safetyQuestions.length} ({percentage}%) - Do NOT use Bitcoin yet
                  </p>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    You need to learn much more about Bitcoin security before risking any money.
                  </p>
                </div>
              )}
            </div>
            <Button onClick={resetQuiz} className="bg-orange-600 hover:bg-orange-700">
              Take Quiz Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-800 border-zinc-700">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-semibold text-white">{question.title}</h4>
          <span className="text-sm text-zinc-400">{currentQuestion + 1}/{safetyQuestions.length}</span>
        </div>

        <div className="space-y-4">
          <p className="text-zinc-300">{question.question}</p>

          <div className="space-y-2">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && handleAnswer(index)}
                disabled={showResult}
                className={`w-full p-3 border rounded-lg text-left transition-colors ${
                  showResult
                    ? selectedAnswer === index
                      ? isCorrect
                        ? 'border-green-500 bg-green-500/10 text-green-300'
                        : 'border-red-500 bg-red-500/10 text-red-300'
                      : index === question.correctAnswer
                      ? 'border-green-500 bg-green-500/10 text-green-300'
                      : 'border-zinc-600 text-zinc-400'
                    : selectedAnswer === index
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-zinc-600 hover:border-zinc-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult && (
                    <span>
                      {index === question.correctAnswer ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : selectedAnswer === index ? (
                        <XCircle className="w-4 h-4 text-red-400" />
                      ) : null}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {showResult && (
            <div className="p-4 bg-zinc-900 border border-zinc-600 rounded-lg">
              <p className="text-sm text-zinc-300 mb-2">
                <strong>{isCorrect ? 'Correct!' : 'Incorrect.'}</strong>
              </p>
              <p className="text-sm text-zinc-400">{question.explanation}</p>
              <Button 
                onClick={nextQuestion} 
                className="mt-3 bg-orange-600 hover:bg-orange-700"
              >
                {currentQuestion === safetyQuestions.length - 1 ? 'See Results' : 'Next Question'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}