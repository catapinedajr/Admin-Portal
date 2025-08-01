import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { PipProvider } from "@/hooks/usePipVideo";
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

// Authentication guard - Safari compatible
function AuthGuard({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  
  // Safari localStorage compatibility check
  let sessionId = null;
  try {
    sessionId = localStorage.getItem('hodlearn_session');
  } catch (error) {
    console.warn('localStorage not available in Safari private mode');
  }
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
    enabled: sessionChecked && !!sessionId && !hasRedirected,
    // Fallback for demo sessions
    queryFn: async () => {
      if (sessionId && sessionId.startsWith('demo-session-')) {
        return {
          id: 1,
          username: 'demo-user',
          email: 'demo@hodlearn.com',
          currentStreak: 1,
          longestStreak: 1,
          completedLessons: 0
        };
      }
      // Regular API call for real sessions
      const response = await fetch('/api/user');
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    }
  });
  
  useEffect(() => {
    // Set sessionChecked after component mounts (Safari compatibility)
    setSessionChecked(true);
    
    // If no session ID or localStorage fails, redirect to auth
    if (!sessionId && !hasRedirected) {
      setHasRedirected(true);
      setLocation('/auth');
      return;
    }
    
    // If we have session but API fails, also redirect
    if (sessionId && !isLoading && (error || !user) && !hasRedirected && sessionChecked) {
      // Clear invalid session
      try {
        localStorage.removeItem('hodlearn_session');
      } catch (e) {
        // Ignore if localStorage is not available
      }
      setHasRedirected(true);
      setLocation('/auth');
    }
  }, [sessionId, error, user, isLoading, setLocation, hasRedirected, sessionChecked]);

  // Show loading while checking auth or if redirecting
  if (!sessionChecked || isLoading || hasRedirected || (!sessionId && !hasRedirected)) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
          <div className="text-zinc-400">
            {!sessionChecked ? 'Initializing...' : hasRedirected ? 'Redirecting...' : 'Loading...'}
          </div>
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
      if (!hasVisited && nextAvailableDay && typeof nextAvailableDay === 'object' && 'dayIndex' in nextAvailableDay && nextAvailableDay.dayIndex === 1) {
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
        <Route path="/about" component={About} />
        
        {/* Protected routes wrapped with AuthGuard */}
        <Route path="/learn">
          <AuthGuard><LearnPage /></AuthGuard>
        </Route>
        <Route path="/money">
          <AuthGuard><FinancePage /></AuthGuard>
        </Route>
        <Route path="/simulators">
          <AuthGuard><SimulatorsPage /></AuthGuard>
        </Route>
        <Route path="/community">
          <AuthGuard><CommunityPage /></AuthGuard>
        </Route>
        <Route path="/more">
          <AuthGuard><MorePage /></AuthGuard>
        </Route>
        <Route path="/account">
          <AuthGuard><AccountPage /></AuthGuard>
        </Route>
        <Route path="/wallet">
          <AuthGuard><WalletPage /></AuthGuard>
        </Route>
        <Route path="/wallet/rewards">
          <AuthGuard><WalletPage /></AuthGuard>
        </Route>

        <Route path="/">
          <AuthGuard><NewUserRedirect /></AuthGuard>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </AppContextProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SubscriptionProvider>
          <PipProvider>
            <Router />
            <Toaster />
          </PipProvider>
        </SubscriptionProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
