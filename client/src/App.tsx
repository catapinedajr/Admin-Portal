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
import AdminAdsPage from "@/pages/AdminAdsPage";
import LandingPage from "@/pages/LandingPage";

import AdminLoginPage from "@/admin/pages/AdminLoginPage";
import ContentManagement from "@/admin/pages/ContentManagement";
import MarketingManagement from "@/admin/pages/MarketingManagement";
import StoreManagement from "@/admin/pages/StoreManagement";
import UsersManagement from "@/admin/pages/UsersManagement";
import AdminUsersManagement from "@/admin/pages/AdminUsersManagement";
import SocialMediaHub from "@/admin/pages/SocialMediaHub";
import CRMManagement from "@/admin/pages/CRMManagement";
import RoadmapManagement from "@/admin/pages/RoadmapManagement";
import GoalsManagement from "@/admin/pages/GoalsManagement";
import KPIDashboard from "@/admin/pages/KPIDashboard";
import IntegrationsManagement from "@/admin/pages/IntegrationsManagement";
import RevenueControls from "@/admin/pages/RevenueControls";
import DataGovernance from "@/admin/pages/DataGovernance";

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
    // If no session ID, redirect to landing page
    if (!sessionId && !hasRedirected) {
      setHasRedirected(true);
      setLocation('/landing');
      return;
    }
    
    // If we have session but API fails, also redirect to landing
    if (sessionId && !isLoading && (error || !user) && !hasRedirected) {
      // Clear invalid session
      localStorage.removeItem('hodlearn_session');
      setHasRedirected(true);
      setLocation('/landing');
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
  const { data: nextAvailableDay, isLoading: dayLoading } = useQuery<{ dayIndex: number }>({
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
        <Route path="/landing" component={LandingPage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/learn" component={LearnPage} />
        <Route path="/money" component={FinancePage} />
        <Route path="/simulators" component={SimulatorsPage} />
        <Route path="/community" component={CommunityPage} />
        <Route path="/admin/login" component={AdminLoginPage} />
        <Route path="/admin/content" component={ContentManagement} />
        <Route path="/admin/marketing" component={MarketingManagement} />
        <Route path="/admin/store" component={StoreManagement} />
        <Route path="/admin/users" component={UsersManagement} />
        <Route path="/admin/social" component={SocialMediaHub} />
        <Route path="/admin/crm" component={CRMManagement} />
        <Route path="/admin/roadmap" component={RoadmapManagement} />
        <Route path="/admin/goals" component={GoalsManagement} />
        <Route path="/admin/okrs" component={GoalsManagement} />
        <Route path="/admin/kpis" component={KPIDashboard} />
        <Route path="/admin/team" component={AdminUsersManagement} />
        <Route path="/admin/integrations" component={IntegrationsManagement} />
        <Route path="/admin/revenue" component={RevenueControls} />
        <Route path="/admin/data-governance" component={DataGovernance} />
        <Route path="/admin" component={KPIDashboard} />
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
