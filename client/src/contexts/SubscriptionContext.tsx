import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';

export type SubscriptionTier = 'free' | 'premium';

interface PaywallConfig {
  freeDayThreshold: number;
  paywallEnabled: boolean;
  premiumFeatures: string[];
  paywallTitle: string;
  paywallMessage: string;
}

interface SubscriptionContextType {
  subscriptionTier: SubscriptionTier;
  setSubscriptionTier: (tier: SubscriptionTier) => void;
  isFreeTier: boolean;
  isPremiumTier: boolean;
  canAccessDay: (dayIndex: number) => boolean;
  canAccessSimulator: (simulatorId: string) => boolean;
  toggleSubscription: () => void;
  paywallConfig: PaywallConfig | null;
  isPaywallConfigLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const DEFAULT_PAYWALL_CONFIG: PaywallConfig = {
  freeDayThreshold: 7,
  paywallEnabled: true,
  premiumFeatures: ['wallet', 'transactions', 'transfer', 'hodl', 'dca', 'inflation', 'fees'],
  paywallTitle: 'Unlock Your Bitcoin Education',
  paywallMessage: 'Subscribe to access all 336 days of Bitcoin mastery and premium tools.',
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const [subscriptionTier, setSubscriptionTierState] = useState<SubscriptionTier>('free');

  const { data: paywallConfig, isLoading: isPaywallConfigLoading } = useQuery<PaywallConfig>({
    queryKey: ['/api/paywall-config'],
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const effectiveConfig = paywallConfig || DEFAULT_PAYWALL_CONFIG;

  useEffect(() => {
    const savedTier = localStorage.getItem('hodlearn_subscription_tier') as SubscriptionTier;
    if (savedTier && (savedTier === 'free' || savedTier === 'premium')) {
      setSubscriptionTierState(savedTier);
    } else {
      setSubscriptionTierState('free');
    }
  }, []);

  const setSubscriptionTier = (tier: SubscriptionTier) => {
    setSubscriptionTierState(tier);
    localStorage.setItem('hodlearn_subscription_tier', tier);
  };

  const toggleSubscription = () => {
    const newTier = subscriptionTier === 'free' ? 'premium' : 'free';
    setSubscriptionTier(newTier);
  };

  const canAccessDay = (dayIndex: number): boolean => {
    if (!effectiveConfig.paywallEnabled) return true;
    if (subscriptionTier === 'premium') return true;
    return dayIndex <= effectiveConfig.freeDayThreshold;
  };

  const canAccessSimulator = (simulatorId: string): boolean => {
    if (!effectiveConfig.paywallEnabled) return true;
    if (subscriptionTier === 'premium') return true;
    return !effectiveConfig.premiumFeatures.includes(simulatorId);
  };

  const contextValue: SubscriptionContextType = {
    subscriptionTier,
    setSubscriptionTier,
    isFreeTier: subscriptionTier === 'free',
    isPremiumTier: subscriptionTier === 'premium',
    canAccessDay,
    canAccessSimulator,
    toggleSubscription,
    paywallConfig: effectiveConfig,
    isPaywallConfigLoading,
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
