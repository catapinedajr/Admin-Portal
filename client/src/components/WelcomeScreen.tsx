import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown, BookOpen, Brain, Trophy, Compass, Bitcoin, Sparkles, Star, TrendingUp } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  const steps = [
    {
      id: 'intro',
      title: 'Welcome to Your Bitcoin Journey',
      subtitle: 'Transform Confusion into Clarity',
      content: 'Every Bitcoin expert started exactly where you are now. What seems impossibly complex today becomes beautifully simple tomorrow.',
      accentColor: 'purple',
      gradient: 'from-purple-900/40 via-blue-900/30 to-black'
    },
    {
      id: 'problem',
      title: 'The Bitcoin Learning Challenge',
      subtitle: 'Why Traditional Approaches Fail',
      content: 'Dense whitepapers, technical jargon, and fragmented information create barriers instead of bridges to understanding.',
      accentColor: 'red',
      gradient: 'from-red-900/40 via-orange-900/30 to-black'
    },
    {
      id: 'solution',
      title: 'Our Revolutionary Approach',
      subtitle: 'Designed by Experts, Built for Beginners',
      content: '₿ Journey transforms complex Bitcoin concepts into engaging, bite-sized lessons that build real understanding.',
      accentColor: 'emerald',
      gradient: 'from-emerald-900/40 via-teal-900/30 to-black'
    },
    {
      id: 'daily-learning',
      title: 'Your Personalized Learning Experience',
      subtitle: 'Progress at Your Perfect Pace',
      content: 'Discover curated insights, master key concepts, and validate your knowledge through our scientifically-designed learning system.',
      accentColor: 'blue',
      gradient: 'from-blue-900/40 via-indigo-900/30 to-black',
      features: [
        { icon: <Sparkles className="w-7 h-7" />, label: 'Daily Insights', color: 'bg-gradient-to-r from-blue-500 to-blue-600', description: 'Curated facts' },
        { icon: <Brain className="w-7 h-7" />, label: 'Deep Lessons', color: 'bg-gradient-to-r from-purple-500 to-purple-600', description: 'Expert explanations' },
        { icon: <Trophy className="w-7 h-7" />, label: 'Smart Quizzes', color: 'bg-gradient-to-r from-green-500 to-green-600', description: 'Test mastery' }
      ]
    },
    {
      id: 'explore',
      title: 'Unlimited Exploration',
      subtitle: 'Advanced Tools for Serious Learners',
      content: 'Access professional-grade simulations, comprehensive glossaries, and cutting-edge analysis tools that power your Bitcoin expertise.',
      accentColor: 'orange',
      gradient: 'from-orange-900/40 via-amber-900/30 to-black',
      features: [
        { icon: <TrendingUp className="w-7 h-7" />, label: 'Live Simulations', color: 'bg-gradient-to-r from-orange-500 to-orange-600', description: 'Interactive models' },
        { icon: <Star className="w-7 h-7" />, label: 'Expert Content', color: 'bg-gradient-to-r from-amber-500 to-amber-600', description: 'Premium insights' }
      ]
    },
    {
      id: 'fork',
      title: 'Your Bitcoin Future Awaits',
      subtitle: 'Choose Your Destiny',
      content: 'This is where your transformation begins. Step onto the golden path toward Bitcoin mastery and financial sovereignty.',
      accentColor: 'yellow',
      gradient: 'from-yellow-900/40 via-orange-900/30 to-black'
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
    }, 6000);

    return () => clearTimeout(timer);
  }, [currentStep, autoScroll]);

  const scrollToNext = () => {
    setAutoScroll(false);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStepProgress = () => {
    return (
      <div className="flex justify-center mb-16">
        <div className="flex items-center gap-4">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === currentStep
                  ? 'w-12 bg-gradient-to-r from-orange-400 to-yellow-400'
                  : index < currentStep
                  ? 'w-8 bg-green-400'
                  : 'w-6 bg-gray-600'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Premium background effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/20 via-blue-950/10 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,146,60,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.05),transparent_50%)]" />
      </div>

      {/* Header - Premium Design */}
      <motion.div 
        className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-orange-500/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex items-center justify-center py-6">
          <motion.div 
            className="flex items-center gap-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.div 
              className="text-orange-400 text-4xl font-bold"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              ₿
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent">
              Journey
            </h1>
          </motion.div>
        </div>
      </motion.div>

      {/* Content Sections */}
      <div className="relative z-10 pt-24">
        <AnimatePresence mode="wait">
          <motion.section
            key={currentStep}
            className={`min-h-screen flex flex-col justify-center relative px-8 bg-gradient-to-br ${steps[currentStep].gradient}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Simple Step Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {renderStepProgress()}
            </motion.div>
            
            <div className="max-w-5xl mx-auto text-center space-y-8">
              {/* Premium step indicator */}
              <motion.div 
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-600/20 to-purple-600/20 rounded-full border border-orange-500/30 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span className="text-orange-200 font-medium">Step {currentStep + 1} of {steps.length}</span>
              </motion.div>

              {/* Premium Title */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent leading-tight">
                  {steps[currentStep].title}
                </h2>
                <h3 className="text-xl md:text-2xl text-orange-300/80 font-medium">
                  {steps[currentStep].subtitle}
                </h3>
              </motion.div>

              {/* Premium Content */}
              <motion.p 
                className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                {steps[currentStep].content}
              </motion.p>

              {/* Premium Features */}
              {steps[currentStep].features && (
                <motion.div 
                  className="grid md:grid-cols-3 gap-8 mt-16"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  {steps[currentStep].features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      className="group relative"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2 + featureIndex * 0.1, duration: 0.6 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="relative p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl border border-orange-500/20 backdrop-blur-sm group-hover:border-orange-400/40 transition-all duration-300">
                        <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-2xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                          {feature.icon}
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">{feature.label}</h4>
                        <p className="text-gray-400 text-sm">{feature.description}</p>
                        
                        {/* Premium glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Premium Navigation */}
              <motion.div
                className="flex justify-center mt-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                {currentStep < steps.length - 1 ? (
                  <motion.button
                    onClick={scrollToNext}
                    className="group relative px-12 py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold rounded-full shadow-2xl transition-all duration-300 overflow-hidden"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      Continue Your Journey
                      <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={onComplete}
                    className="group relative px-16 py-6 bg-gradient-to-r from-green-600 via-orange-500 to-yellow-500 hover:from-green-500 hover:via-orange-400 hover:to-yellow-400 text-white font-bold text-xl rounded-full shadow-2xl transition-all duration-500 overflow-hidden"
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 }}
                  >
                    <span className="relative z-10 flex items-center gap-4">
                      <Sparkles className="w-6 h-6" />
                      Begin Your Bitcoin Journey
                      <Sparkles className="w-6 h-6" />
                    </span>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                      style={{ opacity: 0.3 }}
                    />
                  </motion.button>
                )}
              </motion.div>
            </div>
          </motion.section>
        </AnimatePresence>
      </div>

      {/* Premium Progress Indicator */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40">
        <div className="flex flex-col gap-4 p-4 bg-black/40 backdrop-blur-lg rounded-2xl border border-orange-500/20">
          {steps.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setCurrentStep(index);
                setAutoScroll(false);
              }}
              className={`w-4 h-4 rounded-full transition-all duration-500 relative ${
                index === currentStep
                  ? 'bg-gradient-to-r from-orange-400 to-yellow-400 scale-150 shadow-lg shadow-orange-400/50'
                  : index < currentStep
                  ? 'bg-gradient-to-r from-green-400 to-emerald-400 scale-125'
                  : 'bg-gray-600 scale-75 hover:scale-100'
              }`}
              whileHover={{ scale: index === currentStep ? 1.6 : 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {index === currentStep && (
                <motion.div
                  className="absolute inset-0 bg-orange-400 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Premium Auto-scroll Control */}
      {autoScroll && currentStep < steps.length - 1 && (
        <motion.div 
          className="fixed top-32 right-8 z-50"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2 }}
        >
          <button
            onClick={() => setAutoScroll(false)}
            className="group px-4 py-2 bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-lg text-white text-sm rounded-full border border-gray-600/50 hover:border-orange-400/50 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 bg-orange-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
              Auto-advancing... Click to pause
            </span>
          </button>
        </motion.div>
      )}
    </div>
  );
}