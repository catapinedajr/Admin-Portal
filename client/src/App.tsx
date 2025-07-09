import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { useEffect, useState } from "react";

import HomePage from "@/pages/HomePage";
import LearnPage from "@/pages/LearnPage";
import FinancePage from "@/pages/FinancePage";
import SimulatorsPage from "@/pages/SimulatorsPage";
import CommunityPage from "@/pages/CommunityPage";
import MorePage from "@/pages/MorePage";
import AccountPage from "@/pages/AccountPage";
import WalletPage from "@/pages/WalletPage";
import WalletRewardsPage from "@/pages/WalletRewardsPage";
import { AppContextProvider } from "@/components/shared/AppContextProvider";
import Onboarding from "@/pages/onboarding";
import About from "@/pages/about";
import NotFound from "@/pages/not-found";
import { AuthPage } from "@/pages/auth";

// Authentication guard
function AuthGuard({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const [hasRedirected, setHasRedirected] = useState(false);
  
  // Check session first before making API calls
  const sessionId = localStorage.getItem('hodlearn_session');
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
    enabled: !!sessionId && !hasRedirected, // Only run query if we have a session
  });
  
  useEffect(() => {
    // If no session ID, redirect immediately
    if (!sessionId && !hasRedirected) {
      setHasRedirected(true);
      setLocation('/auth');
      return;
    }
    
    // If we have session but API fails, also redirect
    if (sessionId && !isLoading && (error || !user) && !hasRedirected) {
      // Clear invalid session
      localStorage.removeItem('hodlearn_session');
      setHasRedirected(true);
      setLocation('/auth');
    }
  }, [sessionId, error, user, isLoading, setLocation, hasRedirected]);

  // Show loading while checking auth
  if (!sessionId || isLoading || hasRedirected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // If we have session and user data, render children
  if (sessionId && user) {
    return <>{children}</>;
  }
  
  return null;
}

function OnboardingRedirect() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    try {
      // Check for reset parameters (debug mode only)
      const urlParams = new URLSearchParams(window.location.search);
      
      if (urlParams.get('debug-onboarding') === 'true') {
        localStorage.removeItem('hodlearn-onboarding-completed');
        console.log('DEBUG: Forced onboarding reset via URL parameter');
      }

      // Note: Removed production fix that was clearing onboarding flags in demo mode

      // Check localStorage for onboarding completion
      const currentOnboardingStatus = localStorage.getItem('hodlearn-onboarding-completed');
      
      // For first-time users (no localStorage flag), show onboarding
      if (!currentOnboardingStatus) {
        console.log('No onboarding completion found - redirecting to onboarding');
        setLocation('/onboarding');
        return;
      }
      
      console.log('Onboarding already completed - staying on home');
    } catch (error) {
      // If localStorage fails in Safari, skip onboarding
      console.warn('Safari localStorage access issue, skipping onboarding:', error);
    }
  }, [setLocation]);

  return <HomePage />;
}

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <AppContextProvider>
      <ScrollToTop />
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/learn" component={LearnPage} />
        <Route path="/money" component={FinancePage} />
        <Route path="/simulators" component={SimulatorsPage} />
        <Route path="/community" component={CommunityPage} />
        <Route path="/more" component={MorePage} />
        <Route path="/account" component={AccountPage} />
        <Route path="/wallet" component={WalletPage} />
        <Route path="/wallet/rewards" component={WalletRewardsPage} />
        <Route path="/about" component={About} />
        <Route path="/" component={OnboardingRedirect} />
        <Route component={NotFound} />
      </Switch>
    </AppContextProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SubscriptionProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </SubscriptionProvider>
    </QueryClientProvider>
  );
}

export default App;
