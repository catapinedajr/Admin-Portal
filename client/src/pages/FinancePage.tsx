import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import BottomNavigation from "@/components/BottomNavigation";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Crown, Gem, User as UserIcon, Wallet, TrendingUp, TrendingDown, DollarSign, AlertTriangle, Shield, Clock, Calculator, Zap, Home, Coffee, Car, Building2 } from "@/lib/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/components/shared/AppContextProvider";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import EmailCollectionModal from "@/components/EmailCollectionModal";

// Counter animation component
function AnimatedCounter({ target, duration = 2000, suffix = "", className = "" }: { target: number; duration?: number; suffix?: string; className?: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const startValue = 0;
    const endValue = target;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut);
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, target, duration]);

  return (
    <span ref={counterRef} className={className || "text-green-400"}>
      {target >= 0 ? '+' : ''}{count.toLocaleString()}{suffix}
    </span>
  );
}

function FinancePage() {
  const {
    activeSection,
    setActiveSection,
    moneySupplyYear,
    setMoneySupplyYear,
    inflationSimActive,
    setInflationSimActive,
    inflationProgress,
    setInflationProgress,
    speedRaceActive,
    setSpeedRaceActive,
    animationActive,
    setAnimationActive,
    settlementProgress,
    setSettlementProgress,
    showEmailModal,
    setShowEmailModal,
    setLocation
  } = useAppContext();

  const [isAnimating, setIsAnimating] = useState(false);
  const [flashingYear, setFlashingYear] = useState<number | null>(null);
  const [shakingContainer, setShakingContainer] = useState(false);
  const [shakingInflation, setShakingInflation] = useState(false);
  
  // Adoption animation state
  const [adoptionAnimationActive, setAdoptionAnimationActive] = useState(false);
  const [adoptionAnimationRunning, setAdoptionAnimationRunning] = useState(false);
  const [adoptionProgress, setAdoptionProgress] = useState(0);

  // User data query
  const { data: user } = useQuery<User>({
    queryKey: ['/api/user'],
  });

  const isPremiumTier = false; // Simplified for now since no subscription tier in schema

  // Money supply data helper functions
  const getMoneySupplyRaw = (year: number) => {
    const m2Data: { [key: number]: number } = {
      1920: 0.023, 1971: 0.583, 2000: 4.9, 2008: 7.5, 2024: 21.0, 2025: 21.2
    };
    
    if (m2Data[year]) return m2Data[year];
    
    const years = Object.keys(m2Data).map(Number).sort();
    let lower = years[0];
    let upper = years[years.length - 1];
    
    for (let i = 0; i < years.length - 1; i++) {
      if (year >= years[i] && year <= years[i + 1]) {
        lower = years[i];
        upper = years[i + 1];
        break;
      }
    }
    
    const lowerValue = m2Data[lower];
    const upperValue = m2Data[upper];
    const ratio = (year - lower) / (upper - lower);
    
    return lowerValue + (upperValue - lowerValue) * ratio;
  };

  // Animation functions
  const startInflationSimulation = () => {
    setInflationSimActive(true);
    setInflationProgress(0);

    // Animate through years: 0 -> 1yr -> 5yr -> 10yr -> 15yr -> 20yr -> 25yr (optimized timing)
    const timePoints = [
      { step: 1, delay: 800 },    // 1 year at 0.8 seconds
      { step: 2, delay: 1600 },   // 5 years at 1.6 seconds  
      { step: 3, delay: 2400 },   // 10 years at 2.4 seconds
      { step: 4, delay: 3200 },   // 15 years at 3.2 seconds
      { step: 5, delay: 4000 },   // 20 years at 4 seconds
      { step: 6, delay: 4800 }    // 25 years at 4.8 seconds
    ];

    timePoints.forEach(({ step, delay }) => {
      setTimeout(() => {
        setInflationProgress(step);
        
        // Remove shake effects from inflation animation per user request
      }, delay);
    });

    // End simulation after 6 seconds
    setTimeout(() => {
      setInflationSimActive(false);
    }, 6000);
  };

  const startSettlementAnimation = () => {
    setSpeedRaceActive(true);
    setAnimationActive(true);
    setSettlementProgress({ traditional: 0, bitcoin: 0 });

    // Bitcoin animation: completes all 4 steps in 18 seconds (20% slower for better visibility)
    const bitcoinSteps = [
      { step: 1, delay: 2400 },   // Step 1 at 2.4 seconds (transaction creation)
      { step: 2, delay: 6000 },   // Step 2 at 6 seconds (network broadcast)
      { step: 3, delay: 14400 },  // Step 3 at 14.4 seconds (mining consensus)
      { step: 4, delay: 18000 }   // Step 4 at 18 seconds (final settlement)
    ];

    // Traditional banking: takes much longer with realistic banking delays
    const traditionalSteps = [
      { step: 1, delay: 8000 },   // Step 1 at 8 seconds (bank visit takes longer)
      { step: 2, delay: 20000 },  // Step 2 at 20 seconds (compliance review)
      { step: 3, delay: 44000 },  // Step 3 at 44 seconds (SWIFT processing)
      { step: 4, delay: 70000 },  // Step 4 at 70 seconds (intermediary banks)
      { step: 5, delay: 86000 }   // Step 5 at 86 seconds (final settlement)
    ];

    // Animate Bitcoin steps
    bitcoinSteps.forEach(({ step, delay }) => {
      setTimeout(() => {
        setSettlementProgress((prev: { traditional: number; bitcoin: number }) => ({ ...prev, bitcoin: step }));
      }, delay);
    });

    // Animate Traditional steps  
    traditionalSteps.forEach(({ step, delay }) => {
      setTimeout(() => {
        setSettlementProgress((prev: { traditional: number; bitcoin: number }) => ({ ...prev, traditional: step }));
      }, delay);
    });

    // End animation after 90 seconds
    setTimeout(() => {
      setAnimationActive(false);
    }, 90000);
  };

  const resetSettlementAnimation = () => {
    setAnimationActive(false);
    setSettlementProgress({ traditional: 0, bitcoin: 0 });
  };

  // Adoption animation functions
  const startAdoptionAnimation = () => {
    setAdoptionAnimationActive(true);
    setAdoptionAnimationRunning(true);
    setAdoptionProgress(0);

    // Step-by-step story animation with fast timing for 2-second attention spans
    const adoptionSteps = [
      { step: 1, delay: 800 },    // Internet 2000 "too late" moment at 0.8 seconds
      { step: 2, delay: 2000 },   // What actually happened next at 2 seconds  
      { step: 3, delay: 3500 }    // Bitcoin today parallel at 3.5 seconds
    ];

    adoptionSteps.forEach(({ step, delay }) => {
      setTimeout(() => {
        setAdoptionProgress(step);
      }, delay);
    });

    // Stop animation running indicator after 4.5 seconds
    setTimeout(() => {
      setAdoptionAnimationRunning(false);
    }, 4500);
  };

  const resetAdoptionAnimation = () => {
    setAdoptionAnimationRunning(false);
    setAdoptionProgress(0);
  };

  return (
    <div className="space-y-8 text-white">
      <main className="space-y-8">
        {/* Hero Narrative - Professional but Engaging */}
        <Card className="bg-gradient-to-br from-orange-950/20 via-zinc-900 to-zinc-800 border-orange-800/30">
          <CardContent className="p-8">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              {/* Dopamine-Driven Hook */}
              <div className="mb-8">
                <h1 className="text-5xl font-black text-white mb-4 tracking-tight">
                  While You Lost Money, Bitcoin Made <AnimatedCounter target={12275} suffix="%" />
                </h1>
                <p className="text-xl text-zinc-300 leading-relaxed">
                  Bitcoin is the new hurdle rate—it doesn't just beat inflation, it crushes every traditional investment.
                </p>
              </div>

              {/* Performance Comparison */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-red-900/20 p-4 rounded-xl border border-red-600/30">
                  <div className="text-red-400 font-bold text-lg">Cash Savings</div>
                  <div className="text-zinc-300 text-sm">10-year return</div>
                  <div className="text-red-300 text-xl font-bold">
                    <AnimatedCounter target={-25} suffix="%" className="text-red-300" />
                  </div>
                  <div className="text-zinc-400 text-xs">Lost to inflation</div>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700">
                  <div className="text-zinc-400 font-bold text-lg">S&P 500</div>
                  <div className="text-zinc-300 text-sm">10-year return</div>
                  <div className="text-zinc-300 text-xl font-bold">
                    <AnimatedCounter target={299} suffix="%" className="text-zinc-300" />
                  </div>
                  <div className="text-zinc-400 text-xs">Traditional best</div>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700">
                  <div className="text-yellow-400 font-bold text-lg">Gold</div>
                  <div className="text-zinc-300 text-sm">10-year return</div>
                  <div className="text-yellow-300 text-xl font-bold">
                    <AnimatedCounter target={120} suffix="%" className="text-zinc-300" />
                  </div>
                  <div className="text-zinc-400 text-xs">Store of value</div>
                </div>
                <div className="bg-gradient-to-br from-orange-600/20 to-green-600/20 p-4 rounded-xl border border-orange-500/50">
                  <div className="text-orange-400 font-bold text-lg">Bitcoin</div>
                  <div className="text-zinc-300 text-sm">10-year return</div>
                  <div className="text-green-400 text-xl font-bold">
                    <AnimatedCounter target={12275} suffix="%" className="text-green-400" />
                  </div>
                  <div className="text-orange-300 text-xs">New standard</div>
                </div>
              </div>

              {/* You're Not Too Late Message - Balanced Enhancement */}
              <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/30 p-5 rounded-xl border border-green-400/50 mb-6 shadow-lg">
                <div className="text-center space-y-3">
                  <h3 className="text-2xl font-bold text-green-300">
                    You're Not Too Late
                  </h3>
                  <div className="bg-zinc-800/50 rounded-lg p-3 border border-orange-400/30">
                    <p className="text-xl font-bold text-orange-400">
                      Less than 5% of people own Bitcoin
                    </p>
                    <p className="text-sm text-green-300 mt-1">
                      You're still in the early adoption phase
                    </p>
                  </div>
                </div>
              </div>

              {/* The Revelation */}
              <div className="bg-gradient-to-r from-orange-950/30 to-zinc-800/50 p-6 rounded-xl border border-orange-600/30">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Why does Bitcoin outperform everything by 10x?
                </h3>
                <p className="text-lg text-zinc-300 mb-6">
                  The answer lies in understanding what governments have been doing to money for decades.
                </p>
                <div className="flex justify-center">
                  <Button 
                    onClick={() => {
                      const element = document.getElementById('money-supply-section');
                      if (element) {
                        const headerOffset = 80; // Account for fixed header
                        const elementPosition = element.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        
                        window.scrollTo({
                          top: offsetPosition,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3 rounded-lg text-lg"
                  >
                    What They Aren't Telling You
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Money Supply Erosion Visualization */}
        <Card id="money-supply-section" className={`bg-zinc-900 border-zinc-800 transition-all duration-500 ease-out ${
          isAnimating && flashingYear && [1971, 2000, 2008, 2020].includes(flashingYear) 
            ? 'shadow-[0_0_40px_rgba(239,68,68,0.8)] border-red-400 border-2 scale-[1.01]' 
            : ''
        } ${shakingContainer ? 'animate-crisis-shake' : ''}`}>
          <CardHeader className="pb-4">
            {/* Dopamine-Driven Hook */}
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2 text-center">
                Money Supply Explosion:
              </h2>
              <div className="text-4xl md:text-5xl font-black text-center">
                <span className="text-white">$23B → $</span><AnimatedCounter target={21} suffix="T" className="text-red-400" />
              </div>
              <p className="text-xl text-zinc-300 mb-4">
                That's a <AnimatedCounter target={922} suffix="x" className="text-red-400" /> increase since 1920
              </p>
              <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4 inline-block">
                <div className="text-red-300 font-bold text-lg">
                  Shocking fact: <AnimatedCounter target={29} suffix="%" className="text-red-400" /> of money supply created during COVID response (2020-2022)
                </div>
              </div>
            </div>

          </CardHeader>
          <CardContent className="space-y-6 relative">
            {/* Crisis Warning Overlay - Dramatic effects */}
            {isAnimating && flashingYear && [1971, 2000, 2008, 2020].includes(flashingYear) && (
              <>
                <div className="absolute inset-0 bg-red-500/15 rounded-lg pointer-events-none animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-400/10 rounded-lg pointer-events-none animate-pulse" />
                <div className="absolute top-2 left-2 right-2 bg-red-500/20 h-1 rounded-full animate-pulse" />
                <div className="absolute bottom-2 left-2 right-2 bg-red-500/20 h-1 rounded-full animate-pulse" />
              </>
            )}
            
            {/* Animation Controls */}
            <div className="space-y-4">
              {/* Watch Money Get Printed Button */}
              <div className="text-center">
                <Button
                  onClick={() => {
                    if (isAnimating) return; // Prevent multiple animations
                    
                    // Scroll to optimal viewing position for animation
                    const animationButton = document.querySelector('#money-supply-section .space-y-4');
                    if (animationButton) {
                      const headerOffset = 60; // Account for header + some breathing room
                      const elementPosition = animationButton.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                      
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                    }
                    
                    // Create smooth year-by-year animation over 6 seconds
                    const totalYears = 2025 - 1920; // 105 years
                    const totalDuration = 6000; // 6 seconds
                    const baseInterval = totalDuration / totalYears; // ~57ms per year
                    
                    const timeline: { year: number; duration: number; flash: boolean }[] = [];
                    for (let year = 1920; year <= 2025; year++) {
                      const isFlashYear = [1971, 2000, 2008, 2020].includes(year);
                      timeline.push({
                        year: year,
                        duration: isFlashYear ? baseInterval * 8 : baseInterval, // Crisis years pause 8x longer for maximum drama
                        flash: isFlashYear
                      });
                    }
                    
                    let index = 0;
                    setIsAnimating(true);
                    setMoneySupplyYear(1920);
                    
                    const smoothAnimate = () => {
                      if (index < timeline.length) {
                        const step = timeline[index];
                        setMoneySupplyYear(step.year);
                        
                        // Flash milestone button at key moments with longer duration for dopamine impact
                        if (step.flash) {
                          setFlashingYear(step.year);
                          
                          // Add tactile feedback for iPhone users on crisis years - visual shake effect
                          setShakingContainer(true);
                          setTimeout(() => setShakingContainer(false), 300); // Quick shake duration
                          
                          setTimeout(() => setFlashingYear(null), Math.min(step.duration - 50, 800)); // Longer flash for crisis moments
                        }
                        
                        index++;
                        setTimeout(smoothAnimate, step.duration);
                      } else {
                        setIsAnimating(false);
                      }
                    };
                    
                    setTimeout(smoothAnimate, 200);
                  }}
                  disabled={isAnimating}
                  className={`font-bold px-8 py-3 rounded-lg text-lg transition-all ${
                    isAnimating 
                      ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {isAnimating ? 'Printing Money...' : 'Watch Money Get Printed'}
                </Button>
              </div>
              
              {/* Year Display - Now below button */}
              <div className="text-center">
                <span className="text-orange-400 font-bold text-3xl">{moneySupplyYear}</span>
              </div>
              
              {/* Visual timeline indicators */}
              <div className="grid grid-cols-6 gap-1.5">
                {[
                  { year: 1920, label: "'20", desc: "Gold Era" },
                  { year: 1971, label: "'71", desc: "Nixon" },
                  { year: 2000, label: "'00", desc: "Dot-com" },
                  { year: 2008, label: "'08", desc: "Crisis" },
                  { year: 2020, label: "'20", desc: "COVID" },
                  { year: 2025, label: "'25", desc: "Today" }
                ].map((milestone) => (
                  <button
                    key={milestone.year}
                    onClick={() => !isAnimating && setMoneySupplyYear(milestone.year)}
                    disabled={isAnimating}
                    className={`p-2 rounded-md border transition-all duration-300 text-xs ${
                      flashingYear === milestone.year
                        ? 'bg-red-600/40 border-red-400 text-red-200 animate-pulse scale-110'
                        : moneySupplyYear === milestone.year
                        ? 'bg-orange-600/20 border-orange-500 text-orange-300'
                        : isAnimating
                        ? 'bg-zinc-800/30 border-zinc-700/50 text-zinc-500 cursor-not-allowed'
                        : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300 cursor-pointer'
                    }`}
                  >
                    <div className="font-semibold">{milestone.label}</div>
                    <div className="text-xs opacity-75">{milestone.desc}</div>
                  </button>
                ))}
              </div>

              {/* Key Statistics Display */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-zinc-800/50 rounded-lg p-3 text-center border border-zinc-700">
                  <div className={`text-xl font-bold transition-all duration-500 ${
                    isAnimating ? 'text-red-400 scale-110' : 'text-orange-400'
                  }`}>
                    ${getMoneySupplyRaw(moneySupplyYear).toFixed(1)}T
                  </div>
                  <div className="text-zinc-400 text-xs">Total Dollars in Circulation</div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3 text-center border border-zinc-700">
                  <div className={`text-xl font-bold transition-all duration-500 ${
                    isAnimating ? 'text-red-400 scale-110' : 'text-orange-400'
                  }`}>
                    {Math.round(getMoneySupplyRaw(moneySupplyYear) / getMoneySupplyRaw(1920))}x
                  </div>
                  <div className="text-zinc-400 text-xs">More Money Since 1920</div>
                </div>
              </div>
            </div>

            {/* Chart and emphasis text */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-400" />
                Total Supply of Dollars
              </h4>
              <div className="bg-zinc-800/50 rounded-lg p-6">
                <div className="relative h-48 w-full">
                  <svg viewBox="0 0 400 220" className="w-full h-full">
                    <rect width="400" height="220" fill="transparent" />
                    
                    <text x="10" y="15" fill="#9ca3af" fontSize="10">$21.2T</text>
                    <text x="10" y="55" fill="#9ca3af" fontSize="10">$15T</text>
                    <text x="10" y="95" fill="#9ca3af" fontSize="10">$10T</text>
                    <text x="10" y="135" fill="#9ca3af" fontSize="10">$5T</text>
                    <text x="10" y="175" fill="#9ca3af" fontSize="10">$0</text>
                    
                    <text x="50" y="205" fill="#9ca3af" fontSize="10" textAnchor="middle">1920</text>
                    <text x="140" y="205" fill="#9ca3af" fontSize="10" textAnchor="middle">1960</text>
                    <text x="230" y="205" fill="#9ca3af" fontSize="10" textAnchor="middle">1990</text>
                    <text x="320" y="205" fill="#9ca3af" fontSize="10" textAnchor="middle">2010</text>
                    <text x="370" y="205" fill="#9ca3af" fontSize="10" textAnchor="middle">2025</text>
                    
                    <defs>
                      <clipPath id="progressClip">
                        <rect 
                          x="0" 
                          y="0" 
                          width={50 + ((moneySupplyYear - 1920) / 105) * 320} 
                          height="220"
                          className="transition-all duration-700 ease-out"
                        />
                      </clipPath>
                    </defs>

                    <path
                      d={(() => {
                        // Real M2 data points matching original implementation
                        const m2Data = [
                          { year: 1920, m2: 0.023 },   // Gold Standard era ($23B)
                          { year: 1929, m2: 0.026 },   // Pre-Depression ($26B)
                          { year: 1933, m2: 0.020 },   // Depression low ($20B)
                          { year: 1940, m2: 0.040 },   // Pre-WWII ($40B)
                          { year: 1945, m2: 0.107 },   // Post-WWII expansion ($107B)
                          { year: 1950, m2: 0.117 },   // Korean War ($117B)
                          { year: 1960, m2: 0.167 },   // 60s growth ($167B)
                          { year: 1971, m2: 0.583 },   // Nixon Shock baseline ($583B)
                          { year: 1980, m2: 1.600 },   // Early 80s ($1.6T)
                          { year: 1990, m2: 3.200 },   // 90s expansion ($3.2T)
                          { year: 2000, m2: 4.900 },   // Dot-com era ($4.9T)
                          { year: 2008, m2: 7.500 },   // Pre-crisis ($7.5T)
                          { year: 2010, m2: 8.700 },   // Post-crisis QE1 ($8.7T)
                          { year: 2015, m2: 12.400 },  // QE era ($12.4T)
                          { year: 2020, m2: 15.400 },  // Pre-COVID ($15.4T)
                          { year: 2021, m2: 20.100 },  // COVID peak ($20.1T)
                          { year: 2024, m2: 21.000 },  // 2024 ($21T)
                          { year: 2025, m2: 21.200 }   // Current estimate ($21.2T)
                        ];
                        
                        return m2Data.map((point, index) => {
                          // Linear time positioning: 3.048px per year (320px / 105 years)
                          const x = 50 + ((point.year - 1920) / 105) * 320;
                          const y = 175 - ((point.m2 - 0.023) / (21.2 - 0.023)) * 155;
                          return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                        }).join(' ');
                      })()}
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="3"
                      clipPath="url(#progressClip)"
                    />
                    
                    <defs>
                      <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.6"/>
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0.1"/>
                      </linearGradient>
                    </defs>
                    
                    <path
                      d={(() => {
                        // Same M2 data for fill area
                        const m2Data = [
                          { year: 1920, m2: 0.023 },   // Gold Standard era ($23B)
                          { year: 1929, m2: 0.026 },   // Pre-Depression ($26B)
                          { year: 1933, m2: 0.020 },   // Depression low ($20B)
                          { year: 1940, m2: 0.040 },   // Pre-WWII ($40B)
                          { year: 1945, m2: 0.107 },   // Post-WWII expansion ($107B)
                          { year: 1950, m2: 0.117 },   // Korean War ($117B)
                          { year: 1960, m2: 0.167 },   // 60s growth ($167B)
                          { year: 1971, m2: 0.583 },   // Nixon Shock baseline ($583B)
                          { year: 1980, m2: 1.600 },   // Early 80s ($1.6T)
                          { year: 1990, m2: 3.200 },   // 90s expansion ($3.2T)
                          { year: 2000, m2: 4.900 },   // Dot-com era ($4.9T)
                          { year: 2008, m2: 7.500 },   // Pre-crisis ($7.5T)
                          { year: 2010, m2: 8.700 },   // Post-crisis QE1 ($8.7T)
                          { year: 2015, m2: 12.400 },  // QE era ($12.4T)
                          { year: 2020, m2: 15.400 },  // Pre-COVID ($15.4T)
                          { year: 2021, m2: 20.100 },  // COVID peak ($20.1T)
                          { year: 2024, m2: 21.000 },  // 2024 ($21T)
                          { year: 2025, m2: 21.200 }   // Current estimate ($21.2T)
                        ];
                        
                        const linePath = m2Data.map((point, index) => {
                          const x = 50 + ((point.year - 1920) / 105) * 320;
                          const y = 175 - ((point.m2 - 0.023) / (21.2 - 0.023)) * 155;
                          return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                        }).join(' ');
                        
                        // Close the path to create fill area
                        const lastX = 50 + ((2025 - 1920) / 105) * 320;
                        return `${linePath} L ${lastX},180 L 50,180 Z`;
                      })()}
                      fill="url(#orangeGradient)"
                      opacity="0.3"
                      clipPath="url(#progressClip)"
                    />
                    
                    <line 
                      x1={50 + ((1971 - 1920) / 105) * 320} 
                      y1="20" 
                      x2={50 + ((1971 - 1920) / 105) * 320} 
                      y2="175" 
                      stroke="#f97316" 
                      strokeWidth="2" 
                      strokeDasharray="5,5"
                      opacity="0.6"
                    />
                    <text 
                      x={50 + ((1971 - 1920) / 105) * 320 - 35} 
                      y="15" 
                      fill="#f97316" 
                      fontSize="8" 
                      fontWeight="bold"
                    >
                      Gold Standard Ends
                    </text>

                    <line 
                      x1={50 + ((moneySupplyYear - 1920) / 105) * 320} 
                      y1="10" 
                      x2={50 + ((moneySupplyYear - 1920) / 105) * 320} 
                      y2="180" 
                      stroke="#f97316" 
                      strokeWidth="2" 
                      strokeDasharray="4,4"
                    />
                    <circle 
                      cx={50 + ((moneySupplyYear - 1920) / (2025 - 1920)) * 320} 
                      cy={175 - ((getMoneySupplyRaw(moneySupplyYear) - 0.023) / (21.0 - 0.023)) * 155} 
                      r="5" 
                      fill="#f97316" 
                      stroke="#ffffff" 
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                
                {/* Hidden until animation completes - dramatic reveal */}
                <div className={`text-center mt-4 p-4 bg-zinc-800/30 rounded-lg border border-orange-400/20 transition-all duration-700 ${
                  !isAnimating && moneySupplyYear === 2025 
                    ? 'opacity-100 scale-100 transform translate-y-0' 
                    : 'opacity-0 scale-95 transform translate-y-4 pointer-events-none'
                }`}>
                  <div className="text-2xl font-bold">
                    <span className="text-zinc-300">THIS is </span>
                    <span className="text-orange-400 tracking-wider animate-pulse">INFLATION</span>
                  </div>
                  <p className="text-zinc-400 text-sm mt-2">
                    More dollars in circulation = each dollar is worth less
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purchasing Power Erosion Simulator */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center gap-3 text-xl">
              <TrendingDown className="w-5 h-5 text-orange-400" />
              Let's See What This Is Doing to Your Money
            </CardTitle>
            <p className="text-zinc-400 text-sm">See how $25,000 loses buying power over time</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {!inflationSimActive && inflationProgress === 0 && (
              <div className="text-center space-y-4">
                <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                  <p className="text-zinc-300 mb-3">
                    You saved <span className="text-orange-400 font-bold">$25,000</span>. 
                    Watch what happens to your money's buying power over 25 years.
                  </p>
                  <p className="text-zinc-400 text-sm">
                    This is what inflation does to your savings.
                  </p>
                </div>
                <Button 
                  onClick={startInflationSimulation}
                  className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-lg font-medium"
                >
                  Watch What Happens
                </Button>
              </div>
            )}

            {/* Conservative Savings vs Bitcoin Comparison */}
            {(inflationSimActive || inflationProgress > 0) && (
              <div className="space-y-4">
                {/* Narrative Introduction */}
                <div className="text-center space-y-2">
                  <p className="text-zinc-300 text-sm font-medium">
                    The Tale of Two Strategies
                  </p>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Your $25,000 faces two very different futures. Traditional savings slowly loses buying power to inflation, 
                    while Bitcoin has historically averaged over 100% annual growth. We're using a very conservative 25% growth rate below:
                  </p>
                </div>
                
                {/* Compact Racing Animation */}
                <div className="space-y-2">
                  {[
                    { step: 0, year: "Today", savings: 25000, btc: 25000, narrative: "Both start equal" },
                    { step: 1, year: "5 years", savings: 21562, btc: 76294, narrative: "Conservative 25% growth" },
                    { step: 2, year: "10 years", savings: 18584, btc: 232831, narrative: "Compound growth builds" },
                    { step: 3, year: "20 years", savings: 15342, btc: 2183468, narrative: "Two decades of growth" },
                    { step: 4, year: "25 years", savings: 13670, btc: 6781371, narrative: "Long-term holder rewards" }
                  ].map(({ step, year, savings, btc, narrative }) => {
                    const isActive = inflationProgress >= step;
                    
                    return (
                      <div key={step} className={`grid grid-cols-3 gap-2 p-2 rounded transition-all duration-700 ${
                        isActive ? 'bg-zinc-800/50' : 'bg-zinc-900/30'
                      }`}>
                        {/* Year Label */}
                        <div className={`text-sm font-medium flex items-center ${
                          isActive ? 'text-zinc-200' : 'text-zinc-500'
                        }`}>
                          {year}
                        </div>
                        
                        {/* Savings Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className={isActive ? 'text-red-300' : 'text-zinc-500'}>Savings</span>
                            <span className={isActive ? 'text-red-200 font-bold' : 'text-zinc-500'}>
                              ${savings.toLocaleString()}
                            </span>
                          </div>
                          <div className="bg-zinc-700 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${
                                isActive ? 'bg-red-500' : 'bg-zinc-600'
                              }`}
                              style={{ width: isActive ? `${(savings/25000)*100}%` : '100%' }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Bitcoin Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className={isActive ? 'text-orange-300' : 'text-zinc-500'}>Bitcoin</span>
                            <span className={isActive ? 'text-orange-200 font-bold' : 'text-zinc-500'}>
                              ${btc >= 1000000 ? `${(btc/1000000).toFixed(1)}M` : btc.toLocaleString()}
                            </span>
                          </div>
                          <div className="bg-zinc-700 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${
                                isActive ? 'bg-orange-500' : 'bg-zinc-600'
                              }`}
                              style={{ width: isActive ? `${Math.min((btc/2750000)*100, 100)}%` : '0%' }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Historical Performance Summary */}
                {inflationProgress >= 5 && (
                  <div className="space-y-3 p-4 bg-zinc-800/30 rounded-lg border border-orange-400/20">
                    <div className="text-center">
                      <div className="text-white font-bold text-sm mb-2">Two Different Approaches to Money</div>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="text-center">
                          <div className="text-red-400 font-medium">Traditional Savings</div>
                          <div className="text-red-300 text-lg font-bold animate-pulse">$13,670</div>
                          <div className="text-red-400 animate-pulse">Lost 45% to inflation</div>
                        </div>
                        <div className="text-center">
                          <div className="text-orange-400 font-medium">Conservative Bitcoin</div>
                          <div className="text-orange-300 text-lg font-bold animate-pulse">$6.8M</div>
                          <div className="text-orange-400 animate-pulse">271x growth (25% annual)</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center pt-2 border-t border-zinc-700/50">
                      <p className="text-zinc-400 text-xs leading-relaxed">
                        <span className="text-white font-medium">The Traditional Story:</span> For decades, saving money in banks was considered safe and responsible. 
                        But inflation quietly erodes purchasing power - what costs $1 today will cost more tomorrow.
                      </p>
                      <p className="text-zinc-400 text-xs leading-relaxed mt-2">
                        <span className="text-orange-400 font-medium">The Alternative Story:</span> Bitcoin offers a different approach with mathematically limited supply. 
                        While volatile and speculative, some see it as a hedge against currency debasement. 
                        Past performance doesn't guarantee future results.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instant "Too Late" Visual Story */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              "Too Late" Moments That Made Millionaires
            </CardTitle>
            <p className="text-zinc-400 text-xs">When people said "I missed it" but the biggest gains were still ahead</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {!adoptionAnimationActive && (
              <div className="text-center space-y-3">
                <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                  <p className="text-zinc-300 text-base font-bold mb-2">
                    <span className="text-orange-400">"Am I too late for Bitcoin?"</span>
                  </p>
                  <p className="text-zinc-400 text-sm">
                    Here's what happened to the last people who thought they were "too late"...
                  </p>
                </div>
                <Button 
                  onClick={startAdoptionAnimation}
                  className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-lg font-bold"
                >
                  Show Me The Truth
                </Button>
              </div>
            )}

            {adoptionAnimationActive && (
              <div className="space-y-4">
                <div className="text-center">
                  <Button 
                    onClick={resetAdoptionAnimation}
                    className="bg-orange-600 hover:bg-orange-700 text-sm"
                    disabled={adoptionAnimationRunning}
                    size="sm"
                  >
                    {adoptionAnimationRunning ? "Loading..." : "Reset"}
                  </Button>
                </div>
                
                {/* Super Simple Visual Story - 3 Big Cards */}
                <div className="space-y-3">
                  
                  {/* Step 1: The "Too Late" Moment */}
                  {adoptionProgress >= 1 && (
                    <div className="bg-red-900/30 border-2 border-red-500 rounded-xl p-6 animate-fade-in">
                      <div className="text-center space-y-2">
                        <div className="text-4xl font-black text-red-400">2000</div>
                        <div className="text-xl font-bold text-white">Internet had 400M users</div>
                        <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                          "TOO LATE FOR INTERNET!"
                        </div>
                        <div className="text-red-300 text-sm">Everyone said the boom was over</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 2: What Actually Happened */}
                  {adoptionProgress >= 2 && (
                    <div className="bg-green-900/30 border-2 border-green-500 rounded-xl p-6 animate-fade-in">
                      <div className="text-center space-y-3">
                        <div className="text-4xl font-black text-green-400">2024</div>
                        <div className="text-xl font-bold text-white">Internet now has 5.2B users</div>
                        <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                          +1,200% GROWTH AFTER "TOO LATE"
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                          <div className="bg-zinc-800 p-2 rounded text-white">Google</div>
                          <div className="bg-zinc-800 p-2 rounded text-white">Facebook</div>
                          <div className="bg-zinc-800 p-2 rounded text-white">iPhone</div>
                        </div>
                        <div className="text-green-300 text-sm">All created AFTER the "too late" moment</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 3: Bitcoin Today */}
                  {adoptionProgress >= 3 && (
                    <div className="bg-orange-900/30 border-2 border-orange-500 rounded-xl p-6 animate-fade-in">
                      <div className="text-center space-y-2">
                        <div className="text-4xl font-black text-orange-400">2024</div>
                        <div className="text-xl font-bold text-white">Bitcoin has 200M users</div>
                        <div className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                          SAME EXACT SPOT AS INTERNET 2000
                        </div>
                        <div className="text-orange-300 text-lg font-bold mt-3">
                          You're NOT too late. You're perfectly timed.
                        </div>
                      </div>
                    </div>
                  )}
                  
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-950/50 to-amber-950/50 border-orange-800/50">
          <CardContent className="p-8 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <h3 className="text-3xl font-bold text-white">Ready to Learn How Bitcoin Works?</h3>
              <p className="text-zinc-300 text-lg">
                Start with daily lessons, practice with real simulations, and understand why Bitcoin represents 
                the future of money. Your financial education begins here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setLocation("/learn")}
                  className="bg-orange-600 hover:bg-orange-700 px-8 py-4 text-lg font-medium h-auto"
                >
                  Start Daily Bitcoin Lessons
                </Button>
                <Button 
                  onClick={() => setLocation("/simulators")}
                  variant="outline"
                  className="border-orange-600 text-orange-400 hover:bg-orange-600/20 px-8 py-4 text-lg font-medium h-auto"
                >
                  Practice with Simulators
                </Button>
                <Button 
                  onClick={() => setLocation("/community")}
                  variant="outline"
                  className="border-zinc-600 text-zinc-300 hover:bg-zinc-600/20 px-8 py-4 text-lg font-medium h-auto"
                >
                  Join the Community
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Email Collection Modal */}
      <EmailCollectionModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        trigger="feature"
        lockedFeature="Finance Analysis"
      />
      
      {/* Bottom padding to accommodate navigation */}
      <div className="h-20"></div>
    </div>
  );
}

function FinancePageWithLayout() {
  const [location, setLocation] = useLocation();
  const { isPremiumTier } = useSubscription();
  const [showEmailModal, setShowEmailModal] = useState(false);

  return (
    <div className="bg-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setLocation('/')}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-sm">
                  HL
                </div>
                <div>
                  <h1 className="text-xl font-bold">HODLearn™</h1>
                  <p className="text-xs text-zinc-400">How-to-learn BTC</p>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              {/* Wallet Button */}
              <Button 
                onClick={() => setLocation('/wallet')}
                size="sm"
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5"
                title="Learning Wallet"
              >
                <Wallet className="w-4 h-4" />
                <span className="sr-only">Wallet</span>
              </Button>
              
              {/* Account Button */}
              <Button 
                onClick={() => setLocation('/account')}
                size="sm"
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-2.5 py-1.5"
                title="Account Settings"
              >
                <UserIcon className="w-4 h-4" />
                <span className="sr-only">Account</span>
              </Button>
              

            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 pb-5">
        <FinancePage />
      </main>

      <BottomNavigation 
        activeSection="money"
        onSectionChange={(section) => {
          if (section === 'home') setLocation('/');
          else if (section === 'learn') setLocation('/learn');
          else if (section === 'simulators') setLocation('/simulators');
          else if (section === 'more') setLocation('/more');
        }}
      />
    </div>
  );
}

export default FinancePageWithLayout;