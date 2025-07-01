// Temporarily disabled during notification system debugging
// This is a stub file to prevent import errors

export function useSubscription() {
  return {
    subscriptionTier: 'free',
    isPremiumTier: false,
    setSubscriptionTier: (tier: string) => {},
    toggleSubscription: () => {}
  };
}

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}