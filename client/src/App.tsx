import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { useEffect, useState } from "react";

import Home from "@/pages/home-new";
import LearnPage from "@/pages/LearnPage";
import FinancePage from "@/pages/FinancePage";
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
        // Check localStorage first (if available)
        let sessionId = null;
        try {
          // Safari-specific localStorage check
          if (typeof localStorage !== 'undefined' && localStorage.getItem) {
            sessionId = localStorage.getItem('hodlearn_session');
          }
        } catch (error) {
          console.error('Safari auth check network error:', error);
          // Continue with auth check via API instead of localStorage
          sessionId = null;
        }
        
        // MOBILE SAFARI FIX: If no session, try API check first
        if (!sessionId) {
          console.log('No session found, trying API user check for mobile compatibility');
          try {
            const response = await fetch('/api/user', {
              method: 'GET',
              credentials: 'include',
              cache: 'no-cache'
            });
            
            if (response.ok) {
              console.log('Mobile API auth successful without localStorage');
              setIsAuthenticated(true);
              return;
            }
          } catch (apiError) {
            console.log('Mobile API auth failed:', apiError);
          }
          
          // No session and no API auth, redirect to auth
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
            credentials: 'include',
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

  // Show loading while checking auth - MOBILE SAFARI COMPATIBLE
  if (isAuthenticated === null) {
    return (
      <div 
        className="min-h-screen bg-zinc-900 flex items-center justify-center"
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex: 9999,
          background: '#18181b'
        }}
      >
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <div className="text-orange-500 text-xl font-bold mb-2">Loading HODLearn...</div>
          <div className="text-gray-400 text-sm">Building your Bitcoin knowledge</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function OnboardingRedirect() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    try {
      // Safe localStorage check for production deployment
      let hasCompletedOnboarding = false;
      if (typeof localStorage !== 'undefined' && localStorage.getItem) {
        hasCompletedOnboarding = localStorage.getItem('hodlearn-onboarding-completed') === 'true';
      }
      
      if (!hasCompletedOnboarding) {
        setLocation('/onboarding');
      }
    } catch (error) {
      console.warn('Onboarding localStorage error, skipping onboarding:', error);
      // Skip onboarding if localStorage fails - go directly to home
    }
  }, [setLocation]);

  try {
    return <Home />;
  } catch (error) {
    console.error('Home component error:', error);
    // Fallback in case Home component fails to render
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">HODLearn</h1>
          <p className="text-zinc-400">Loading your Bitcoin education...</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
          >
            Reload App
          </button>
        </div>
      </div>
    );
  }
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
            <AppContextProvider>
              <Onboarding />
            </AppContextProvider>
          </AuthGuard>
        </Route>
        <Route path="/learn">
          <AuthGuard>
            <AppContextProvider>
              <Home />
            </AppContextProvider>
          </AuthGuard>
        </Route>
        <Route path="/money">
          <AuthGuard>
            <AppContextProvider>
              <Home />
            </AppContextProvider>
          </AuthGuard>
        </Route>
        <Route path="/simulators">
          <AuthGuard>
            <AppContextProvider>
              <Home />
            </AppContextProvider>
          </AuthGuard>
        </Route>
        <Route path="/more">
          <AuthGuard>
            <AppContextProvider>
              <Home />
            </AppContextProvider>
          </AuthGuard>
        </Route>
        <Route path="/about">
          <AuthGuard>
            <AppContextProvider>
              <About />
            </AppContextProvider>
          </AuthGuard>
        </Route>
        <Route path="/">
          <AuthGuard>
            <AppContextProvider>
              <OnboardingRedirect />
            </AppContextProvider>
          </AuthGuard>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  try {
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
  } catch (error) {
    console.error('Critical app error:', error);
    // Ultimate fallback for white screen prevention
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">HODLearn</h1>
          <p className="text-zinc-400">Application Error</p>
          <button 
            onClick={() => window.location.href = '/auth'}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }
}

export default App;
