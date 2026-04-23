import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { useEffect } from "react";

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
import EmailManagement from "@/admin/pages/EmailManagement";
import PointsManagement from "@/admin/pages/PointsManagement";
import CommunityModeration from "@/admin/pages/CommunityModeration";
import PushNotifications from "@/admin/pages/PushNotifications";
import Resources from "@/admin/pages/Resources";

import { AppContextProvider } from "@/components/shared/AppContextProvider";
import { TermsPage } from "@/pages/terms";
import { PrivacyPage } from "@/pages/privacy";

function RedirectToAdmin() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation('/admin/');
  }, [setLocation]);

  return null;
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
        <Route path="/terms" component={TermsPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/policy" component={PrivacyPage} />
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
        <Route path="/admin/email" component={EmailManagement} />
        <Route path="/admin/points" component={PointsManagement} />
        <Route path="/admin/community" component={CommunityModeration} />
        <Route path="/admin/push-notifications" component={PushNotifications} />
        <Route path="/admin/resources" component={Resources} />
        <Route path="/admin/" component={KPIDashboard} />
        <Route path="/admin" component={KPIDashboard} />
        <Route path="/admin/:rest*" component={KPIDashboard} />
        <Route component={RedirectToAdmin} />
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
