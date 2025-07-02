import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { useEffect, useState } from "react";
import HomeDashboard from "@/pages/home-dashboard";
import Home from "@/pages/home-new";
import Onboarding from "@/pages/onboarding";
import About from "@/pages/about";
import NotFound from "@/pages/not-found";
import { AuthPage } from "@/pages/auth";
import Diagnostic from "@/pages/diagnostic";
import ErrorBoundary from "@/components/ErrorBoundary";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for authentication
    const sessionId = localStorage.getItem('hodlearn_session');
    const user = localStorage.getItem('hodlearn_user');
    
    if (!sessionId || !user) {
      // Not authenticated, redirect to auth
      setLocation('/auth');
      return;
    }
    
    // User is authenticated
    setIsAuthenticated(true);
  }, [setLocation]);

  // Show loading while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-orange-500">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}

function OnboardingRedirect() {
  const [, setLocation] = useLocation();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    try {
      const hasCompletedOnboarding = localStorage.getItem('hodlearn-onboarding-completed');
      
      // If no onboarding status, mark as completed for existing users and continue
      if (!hasCompletedOnboarding) {
        // For existing authenticated users, skip onboarding
        localStorage.setItem('hodlearn-onboarding-completed', 'true');
      }
      
      setIsCheckingOnboarding(false);
    } catch (error) {
      console.error('Onboarding check failed:', error);
      // Fallback: mark onboarding as complete and continue
      localStorage.setItem('hodlearn-onboarding-completed', 'true');
      setIsCheckingOnboarding(false);
    }
  }, [setLocation]);

  // Show loading while checking onboarding
  if (isCheckingOnboarding) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-orange-500">Loading your Bitcoin journey...</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Home />
    </ErrorBoundary>
  );
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
            <ErrorBoundary>
              <Home />
            </ErrorBoundary>
          </AuthGuard>
        </Route>
        <Route path="/money">
          <AuthGuard>
            <ErrorBoundary>
              <Home />
            </ErrorBoundary>
          </AuthGuard>
        </Route>
        <Route path="/simulators">
          <AuthGuard>
            <ErrorBoundary>
              <Home />
            </ErrorBoundary>
          </AuthGuard>
        </Route>
        <Route path="/more">
          <AuthGuard>
            <ErrorBoundary>
              <Home />
            </ErrorBoundary>
          </AuthGuard>
        </Route>
        <Route path="/about">
          <AuthGuard>
            <About />
          </AuthGuard>
        </Route>
        <Route path="/diagnostic" component={Diagnostic} />
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
