import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { useEffect, useState } from "react";

import Home from "@/pages/home-new";
import FinancePageUltraSimple from "@/pages/FinancePageUltraSimple";
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
        // Check localStorage first (if available)
        let sessionId = null;
        try {
          // Safari-specific localStorage check
          if (typeof localStorage !== 'undefined' && localStorage.getItem) {
            sessionId = localStorage.getItem('hodlearn_session');
          }
        } catch (error) {
          console.warn('Safari localStorage access issue:', error);
          // If localStorage is completely unavailable, redirect to auth
          setIsAuthenticated(false);
          setLocation('/auth');
          return;
        }
        
        if (!sessionId) {
          // No session found, redirect to auth
          setIsAuthenticated(false);
          setLocation('/auth');
          return;
        }
        
        // Validate session with server with Safari-compatible fetch
        try {
          const response = await fetch('/api/user', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${sessionId}`,
              'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            cache: 'no-cache'
          });
          
          if (response.ok) {
            // Session is valid
            setIsAuthenticated(true);
          } else {
            // Session invalid, clear storage and redirect
            console.warn('Session validation failed:', response.status);
            try {
              if (typeof localStorage !== 'undefined') {
                localStorage.removeItem('hodlearn_session');
                localStorage.removeItem('hodlearn_user');
              }
            } catch (error) {
              console.warn('Error clearing Safari localStorage:', error);
            }
            setIsAuthenticated(false);
            setLocation('/auth');
          }
        } catch (error) {
          console.error('Safari auth check network error:', error);
          setIsAuthenticated(false);
          setLocation('/auth');
        }
      } catch (error) {
        console.error('Safari auth guard error:', error);
        setIsAuthenticated(false);
        setLocation('/auth');
      }
    }
    
    // Add small delay for Safari to ensure DOM is ready
    const timeoutId = setTimeout(checkAuth, 50);
    return () => clearTimeout(timeoutId);
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

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('hodlearn-onboarding-completed');
    
    if (!hasCompletedOnboarding) {
      setLocation('/onboarding');
    }
  }, [setLocation]);

  return <Home />;
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
    <>
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
            <Home />
          </AuthGuard>
        </Route>
        <Route path="/money">
          <FinancePageUltraSimple />
        </Route>
        <Route path="/simulators">
          <AuthGuard>
            <Home />
          </AuthGuard>
        </Route>
        <Route path="/more">
          <AuthGuard>
            <Home />
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
    </>
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
