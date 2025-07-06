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
import MorePage from "@/pages/MorePage";
import { AppContextProvider } from "@/components/shared/AppContextProvider";
import Onboarding from "@/pages/onboarding";
import About from "@/pages/about";
import NotFound from "@/pages/not-found";
import { AuthPage } from "@/pages/auth";

// Demo mode - simplified for deployment
function AuthGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function OnboardingRedirect() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    try {
      const hasCompletedOnboarding = localStorage.getItem('hodlearn-onboarding-completed');
      
      if (!hasCompletedOnboarding) {
        setLocation('/onboarding');
      }
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
        <Route path="/onboarding">
          <AuthGuard>
            <Onboarding />
          </AuthGuard>
        </Route>
        <Route path="/learn">
          <AuthGuard>
            <LearnPage />
          </AuthGuard>
        </Route>
        <Route path="/money">
          <AuthGuard>
            <FinancePage />
          </AuthGuard>
        </Route>
        <Route path="/simulators">
          <AuthGuard>
            <SimulatorsPage />
          </AuthGuard>
        </Route>
        <Route path="/more">
          <AuthGuard>
            <MorePage />
          </AuthGuard>
        </Route>
        <Route path="/about">
          <AuthGuard>
            <About />
          </AuthGuard>
        </Route>
        <Route path="/">
          <AuthGuard>
            <OnboardingRedirect />
          </AuthGuard>
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
