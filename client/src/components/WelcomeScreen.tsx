import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown, BookOpen, Brain, Trophy, Compass, Bitcoin, ChevronDown } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  const steps = [
    {
      id: 'intro',
      title: 'Welcome to Your BTC Journey',
      content: 'Everyone goes on their own Bitcoin journey. At first, it seems overwhelming and hard to understand...',
      bgGradient: 'from-slate-900 to-black'
    },
    {
      id: 'problem',
      title: 'The Challenge',
      content: 'Complex terminology, technical concepts, and confusing explanations make Bitcoin feel impossible to learn.',
      bgGradient: 'from-red-950/30 to-black'
    },
    {
      id: 'solution',
      title: 'Why We Built This App',
      content: 'We developed BTC Journey to help you learn Bitcoin in a fun, easy, and digestible way - one step at a time.',
      bgGradient: 'from-orange-950/30 to-black'
    },
    {
      id: 'daily-learning',
      title: 'Your Daily Learning',
      content: 'Each day, discover new Bitcoin facts, complete interactive lessons, and test your knowledge with quizzes.',
      bgGradient: 'from-blue-950/30 to-black',
      features: [
        { icon: <BookOpen className="w-8 h-8" />, label: 'Daily Facts', color: 'bg-blue-600' },
        { icon: <Brain className="w-8 h-8" />, label: 'Lessons', color: 'bg-purple-600' },
        { icon: <Trophy className="w-8 h-8" />, label: 'Quizzes', color: 'bg-green-600' }
      ]
    },
    {
      id: 'explore',
      title: 'Explore at Your Own Pace',
      content: 'Want to dive deeper? Access our comprehensive glossary, simulations, and advanced topics whenever you\'re ready.',
      bgGradient: 'from-purple-950/30 to-black',
      features: [
        { icon: <Compass className="w-8 h-8" />, label: 'Self-Guided', color: 'bg-orange-600' },
        { icon: <Bitcoin className="w-8 h-8" />, label: 'Advanced Topics', color: 'bg-amber-600' }
      ]
    },
    {
      id: 'fork',
      title: 'Choose Your Path',
      content: 'Your Bitcoin journey starts here. Take the path toward understanding, financial sovereignty, and the future of money.',
      bgGradient: 'from-orange-950/40 to-black'
    }
  ];

  useEffect(() => {
    if (!autoScroll) return;
    
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setAutoScroll(false);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [currentStep, autoScroll]);

  const scrollToNext = () => {
    setAutoScroll(false);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-y-auto">
      {/* Header - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-orange-500/20">
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center gap-3">
            <div className="text-orange-400 text-3xl font-bold">₿</div>
            <h1 className="text-2xl font-bold text-white">
              BTC <span className="text-orange-400">Journey</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Road Path Visualization */}
      <div className="fixed left-8 top-20 bottom-8 w-2 z-40">
        <div className="relative h-full">
          {/* Main path line */}
          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-orange-600 via-orange-500 to-orange-400 rounded-full opacity-60" />
          
          {/* Progress indicator */}
          <motion.div
            className="absolute left-0 w-4 h-4 bg-orange-400 rounded-full border-2 border-white shadow-lg -ml-1.5"
            initial={{ top: '0%' }}
            animate={{ top: `${(currentStep / (steps.length - 1)) * 85}%` }}
            transition={{ type: 'spring', damping: 20 }}
          />
          
          {/* Step markers */}
          {steps.map((_, index) => (
            <div
              key={index}
              className={`absolute w-3 h-3 rounded-full -ml-1 transition-all duration-300 ${
                index <= currentStep 
                  ? 'bg-orange-400 scale-110' 
                  : 'bg-gray-600 scale-75'
              }`}
              style={{ top: `${(index / (steps.length - 1)) * 85}%` }}
            />
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="ml-20 pt-24">
        {steps.map((step, index) => (
          <motion.section
            key={step.id}
            className={`min-h-screen flex items-center justify-center relative bg-gradient-to-br ${step.bgGradient}`}
            initial={{ opacity: 0.3 }}
            animate={{ 
              opacity: currentStep === index ? 1 : currentStep > index ? 0.5 : 0.3,
              scale: currentStep === index ? 1 : 0.95
            }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-4xl mx-auto px-8 text-center space-y-8">
              {/* Step number */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600/20 rounded-full border border-orange-500/30">
                <span className="text-orange-300 text-sm font-medium">Step {index + 1} of {steps.length}</span>
              </div>

              {/* Title */}
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {step.title}
              </h2>

              {/* Content */}
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
                {step.content}
              </p>

              {/* Features (for relevant steps) */}
              {step.features && (
                <div className="flex justify-center gap-8 mt-12">
                  {step.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      className="flex flex-col items-center gap-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: currentStep === index ? 1 : 0, y: currentStep === index ? 0 : 20 }}
                      transition={{ delay: 0.3 + featureIndex * 0.1 }}
                    >
                      <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center text-white shadow-lg`}>
                        {feature.icon}
                      </div>
                      <span className="text-gray-400 font-medium">{feature.label}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Fork in the road visual for final step */}
              {step.id === 'fork' && (
                <div className="relative mt-12">
                  <svg className="w-80 h-40 mx-auto" viewBox="0 0 320 160">
                    <defs>
                      <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgb(107 114 128)" />
                        <stop offset="100%" stopColor="rgb(251 146 60)" />
                      </linearGradient>
                    </defs>
                    
                    {/* Main road */}
                    <path
                      d="M 20 140 Q 160 120 200 80"
                      stroke="url(#roadGradient)"
                      strokeWidth="8"
                      fill="none"
                      className="opacity-80"
                    />
                    
                    {/* Bitcoin path */}
                    <path
                      d="M 200 80 Q 240 50 300 20"
                      stroke="rgb(251 146 60)"
                      strokeWidth="10"
                      fill="none"
                      className="animate-pulse"
                    />
                    
                    {/* Alternative path */}
                    <path
                      d="M 200 80 Q 240 110 300 140"
                      stroke="rgb(107 114 128)"
                      strokeWidth="6"
                      fill="none"
                      className="opacity-40"
                    />
                    
                    {/* Bitcoin symbol */}
                    <text x="280" y="30" fill="rgb(251 146 60)" fontSize="20" className="font-bold">₿</text>
                    <text x="290" y="50" fill="rgb(251 146 60)" fontSize="10">Bitcoin</text>
                  </svg>
                </div>
              )}

              {/* Navigation hint for current step */}
              {currentStep === index && index < steps.length - 1 && (
                <motion.div
                  className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
                  onClick={scrollToNext}
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <span className="text-orange-300 text-sm">Continue</span>
                  <ChevronDown className="w-6 h-6 text-orange-400" />
                </motion.div>
              )}

              {/* Final call to action */}
              {currentStep === index && index === steps.length - 1 && (
                <motion.div
                  className="mt-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={onComplete}
                    className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Start Your Bitcoin Journey
                    <ArrowDown className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.section>
        ))}
      </div>

      {/* Progress bar at bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gray-800 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-600 to-orange-400"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>

      {/* Auto-scroll controls */}
      {autoScroll && currentStep < steps.length - 1 && (
        <div className="fixed top-24 right-4 z-50">
          <button
            onClick={() => setAutoScroll(false)}
            className="px-3 py-1 bg-orange-600/80 text-white text-xs rounded-full hover:bg-orange-700 transition-colors"
          >
            Pause Auto-Scroll
          </button>
        </div>
      )}
    </div>
  );
}