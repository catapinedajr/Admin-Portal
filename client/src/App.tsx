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

import { AppContextProvider } from "@/components/shared/AppContextProvider";
import Onboarding from "@/pages/onboarding";
import About from "@/pages/about";
import NotFound from "@/pages/not-found";
import { AuthPage } from "@/pages/auth";
import { TermsPage } from "@/pages/terms";
import { PrivacyPage } from "@/pages/privacy";

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
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
          <div className="text-zinc-400">Loading...</div>
        </div>
      </div>
    );
  }

  // If we have session and user data, render children
  if (sessionId && user) {
    return <>{children}</>;
  }
  
  return null;
}

function NewUserRedirect() {
  const [, setLocation] = useLocation();
  
  // Get user's current day progress
  const { data: nextAvailableDay, isLoading: dayLoading } = useQuery({
    queryKey: ['/api/next-available-day', 1],
    retry: false,
  });

  useEffect(() => {
    if (dayLoading) return;
    
    try {
      // Check localStorage for first-time user status
      const hasVisited = localStorage.getItem('hodlearn-has-visited');
      
      // Only redirect to Money page if:
      // 1. First-time visitor AND 
      // 2. On Day 1 (hasn't progressed past the first day)
      if (!hasVisited && nextAvailableDay?.dayIndex === 1) {
        localStorage.setItem('hodlearn-has-visited', 'true');
        setLocation('/money');
        return;
      }
      
    } catch (error) {
      // If localStorage fails in Safari, just show home page
    }
  }, [setLocation, nextAvailableDay, dayLoading]);

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
        <Route path="/terms" component={TermsPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/learn" component={LearnPage} />
        <Route path="/money" component={FinancePage} />
        <Route path="/simulators" component={SimulatorsPage} />
        <Route path="/community" component={CommunityPage} />
        <Route path="/more" component={MorePage} />
        <Route path="/account" component={AccountPage} />
        <Route path="/wallet" component={WalletPage} />
        <Route path="/wallet/rewards" component={WalletPage} />

        <Route path="/about" component={About} />
        <Route path="/" component={NewUserRedirect} />
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
