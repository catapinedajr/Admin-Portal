import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SubscriptionTier = 'free' | 'premium';

interface SubscriptionContextType {
  subscriptionTier: SubscriptionTier;
  setSubscriptionTier: (tier: SubscriptionTier) => void;
  isFreeTier: boolean;
  isPremiumTier: boolean;
  canAccessDay: (dayIndex: number) => boolean;
  canAccessSimulator: (simulatorId: string) => boolean;
  toggleSubscription: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const FREE_TIER_MAX_DAY = 0; // Only day 0 is free (1 day total) - for testing email collection

const FREE_TIER_SIMULATORS = [
  'inflation', // Basic inflation calculator
  'dca' // Basic DCA calculator
];

const PREMIUM_SIMULATORS = [
  'transaction', // Transaction builder
  'hodl', // HODL strategy comparison
  'settlement', // Settlement speed comparison
  'mining' // Mining economics (if we had it)
];

interface SubscriptionProviderProps {
  children: ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const [subscriptionTier, setSubscriptionTierState] = useState<SubscriptionTier>('free');

  // Load subscription state from localStorage on mount
  useEffect(() => {
    const savedTier = localStorage.getItem('hodlearn_subscription_tier') as SubscriptionTier;
    if (savedTier === 'free' || savedTier === 'premium') {
      setSubscriptionTierState(savedTier);
    }
  }, []);

  // Save subscription state to localStorage when it changes
  const setSubscriptionTier = (tier: SubscriptionTier) => {
    setSubscriptionTierState(tier);
    localStorage.setItem('hodlearn_subscription_tier', tier);
  };

  const toggleSubscription = () => {
    const newTier = subscriptionTier === 'free' ? 'premium' : 'free';
    setSubscriptionTier(newTier);
  };

  const canAccessDay = (dayIndex: number): boolean => {
    if (subscriptionTier === 'premium') return true;
    return dayIndex <= FREE_TIER_MAX_DAY;
  };

  const canAccessSimulator = (simulatorId: string): boolean => {
    if (subscriptionTier === 'premium') return true;
    return FREE_TIER_SIMULATORS.includes(simulatorId);
  };

  const contextValue: SubscriptionContextType = {
    subscriptionTier,
    setSubscriptionTier,
    isFreeTier: subscriptionTier === 'free',
    isPremiumTier: subscriptionTier === 'premium',
    canAccessDay,
    canAccessSimulator,
    toggleSubscription
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription(): SubscriptionContextType {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}