import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
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
import { AppContextProvider } from "@/components/shared/AppContextProvider";
import Onboarding from "@/pages/onboarding";
import About from "@/pages/about";
import NotFound from "@/pages/not-found";
import { AuthPage } from "@/pages/auth";

// Authentication guard
function AuthGuard({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    const sessionId = localStorage.getItem('hodlearn_session');
    if (!sessionId) {
      setLocation('/auth');
    }
  }, [setLocation]);

  const sessionId = localStorage.getItem('hodlearn_session');
  if (!sessionId) {
    return null; // Will redirect to auth
  }
  
  return <>{children}</>;
}

function OnboardingRedirect() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    try {
      // Check for reset parameter
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('reset-onboarding') === 'true') {
        localStorage.removeItem('hodlearn-onboarding-completed');
        console.log('Onboarding reset via URL parameter');
      }

      const hasCompletedOnboarding = localStorage.getItem('hodlearn-onboarding-completed');
      console.log('Onboarding check - localStorage value:', hasCompletedOnboarding);
      
      if (!hasCompletedOnboarding) {
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
        <Route path="/about" component={About} />
        <Route path="/">
          <AuthGuard><OnboardingRedirect /></AuthGuard>
        </Route>
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
