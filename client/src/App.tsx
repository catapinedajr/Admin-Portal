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

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        // Simplified Safari-compatible authentication
        const response = await fetch('/api/user', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-cache'
        });
        
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setLocation('/auth');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setLocation('/auth');
      }
    }
    
    checkAuth();
  }, [setLocation]);

  // Show loading while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-orange-500 text-xl font-bold">
          Loading HODLearn...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function OnboardingRedirect() {
  const [, setLocation] = useLocation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      try {
        const hasCompletedOnboarding = localStorage.getItem('hodlearn-onboarding-completed');
        
        if (!hasCompletedOnboarding) {
          // Auto-complete onboarding for deployment users
          localStorage.setItem('hodlearn-onboarding-completed', 'true');
        }
        setIsReady(true);
      } catch (error) {
        // If localStorage fails, just continue to HomePage
        console.warn('LocalStorage access failed, continuing to app:', error);
        setIsReady(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [setLocation]);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-orange-500 text-xl font-bold">
          Loading HODLearn...
        </div>
      </div>
    );
  }

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
        <Route path="/" component={() => (
          <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
            <div className="text-orange-500 text-xl font-bold">
              Root URL Test - Working!
            </div>
          </div>
        )} />
        <Route path="*">
          <AuthGuard>
            <HomePage />
          </AuthGuard>
        </Route>
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
