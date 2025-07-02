import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { useEffect, useState } from "react";
import ProductionSafeHome from "@/components/ProductionSafeHome";
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
      // DEVELOPMENT MODE: Auto-login test user for immediate preview access
      if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
        // Create a test user session for development
        const testUser = {
          id: 1,
          username: 'test_user',
          email: 'test@example.com',
          firstName: 'Bitcoin',
          lastName: 'Learner',
          currentStreak: 1,
          bestStreak: 3,
          totalDaysLearning: 5
        };
        const testSession = 'dev_session_' + Date.now();
        
        localStorage.setItem('hodlearn_user', JSON.stringify(testUser));
        localStorage.setItem('hodlearn_session', testSession);
        setIsAuthenticated(true);
        return;
      }
      
      // Production mode: redirect to auth
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
              <ProductionSafeHome />
            </ErrorBoundary>
          </AuthGuard>
        </Route>
        <Route path="/money">
          <AuthGuard>
            <ErrorBoundary>
              <ProductionSafeHome />
            </ErrorBoundary>
          </AuthGuard>
        </Route>
        <Route path="/simulators">
          <AuthGuard>
            <ErrorBoundary>
              <ProductionSafeHome />
            </ErrorBoundary>
          </AuthGuard>
        </Route>
        <Route path="/more">
          <AuthGuard>
            <ErrorBoundary>
              <ProductionSafeHome />
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
            <ErrorBoundary>
              <ProductionSafeHome />
            </ErrorBoundary>
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
