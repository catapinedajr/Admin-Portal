import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Shield, Check, Loader2, CreditCard, Lock, Unlock, DollarSign, Sparkles, 
  Calculator, TrendingUp, ShieldCheck, Gauge, Wallet, ArrowLeftRight, Coins, FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import AdminLayout from "../components/AdminLayout";

function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  
  const { data: adminUser, isLoading, error } = useQuery<{ id: number; role: string }>({
    queryKey: ["/api/admin/me"],
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && (error || !adminUser)) {
      setLocation('/admin/login');
    }
  }, [isLoading, error, adminUser, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!adminUser) return null;
  
  if (adminUser.role !== 'super_admin') {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="bg-zinc-800/50 border-zinc-700 max-w-md">
            <CardContent className="p-8 text-center">
              <Shield className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
              <p className="text-zinc-400">
                This page is only accessible to Super Administrators. 
                Contact your system administrator if you need access.
              </p>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }
  
  return <>{children}</>;
}

interface PaywallSettings {
  isPaywallEnabled: boolean;
  freeTrialDays: number;
  freeLessonsLimit: number;
  premiumFeatures: string[];
  availableFeatures: { key: string; label: string; description: string }[];
}

const FEATURE_ICONS: Record<string, any> = {
  'dca_calculator': Calculator,
  'hodl_simulator': TrendingUp,
  'transaction_simulator': ArrowLeftRight,
  'inflation_calculator': Coins,
  'security_training': ShieldCheck,
  'advanced_quizzes': FileText,
  'community_forums': DollarSign,
  'portfolio_tracker': Wallet,
  'price_alerts': Gauge,
};

export default function RevenueControls() {
  return (
    <AdminAuthGuard>
      <AdminLayout>
        <PaywallSection />
      </AdminLayout>
    </AdminAuthGuard>
  );
}

function PaywallSection() {
  const { toast } = useToast();
  const [hasChanges, setHasChanges] = useState(false);

  const { data: settings, isLoading } = useQuery<PaywallSettings>({
    queryKey: ["/api/admin/paywall-settings"],
  });

  const [localSettings, setLocalSettings] = useState<PaywallSettings>({
    isPaywallEnabled: false,
    freeTrialDays: 7,
    freeLessonsLimit: 5,
    premiumFeatures: [],
    availableFeatures: [],
  });

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<PaywallSettings>) => {
      return apiRequest('PATCH', '/api/admin/paywall-settings', data);
    },
    onSuccess: () => {
      toast({ title: "Settings saved", description: "Paywall configuration updated successfully." });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/paywall-settings"] });
      setHasChanges(false);
    },
    onError: (error: any) => {
      toast({ 
        title: "Error saving settings", 
        description: error.message || "Failed to save paywall settings",
        variant: "destructive"
      });
    },
  });

  const handleChange = <K extends keyof PaywallSettings>(key: K, value: PaywallSettings[K]) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const toggleFeature = (featureKey: string) => {
    const current = localSettings.premiumFeatures || [];
    const updated = current.includes(featureKey)
      ? current.filter(f => f !== featureKey)
      : [...current, featureKey];
    handleChange('premiumFeatures', updated);
  };

  const handleSave = () => {
    saveMutation.mutate({
      isPaywallEnabled: localSettings.isPaywallEnabled,
      freeTrialDays: localSettings.freeTrialDays,
      freeLessonsLimit: localSettings.freeLessonsLimit,
      premiumFeatures: localSettings.premiumFeatures,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Revenue Controls</h1>
          <p className="text-zinc-400">Manage subscriptions, paywall settings, and premium features</p>
        </div>
      </div>

      <Card className="bg-zinc-800/30 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-orange-500" />
            Paywall Configuration
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Control access to premium content and features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg border border-zinc-700">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${localSettings.isPaywallEnabled ? 'bg-orange-500/20' : 'bg-zinc-800'}`}>
                {localSettings.isPaywallEnabled ? (
                  <Lock className="w-5 h-5 text-orange-400" />
                ) : (
                  <Unlock className="w-5 h-5 text-zinc-500" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-white">Enable Paywall</h4>
                <p className="text-sm text-zinc-500">
                  {localSettings.isPaywallEnabled 
                    ? 'Premium content requires subscription'
                    : 'All content is freely accessible'
                  }
                </p>
              </div>
            </div>
            <Switch
              checked={localSettings.isPaywallEnabled}
              onCheckedChange={(checked) => handleChange('isPaywallEnabled', checked)}
              data-testid="switch-paywall-enabled"
            />
          </div>

          {localSettings.isPaywallEnabled && (
            <>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="text-zinc-300">Free Trial Duration</Label>
                    <span className="text-orange-400 font-medium">{localSettings.freeTrialDays} days</span>
                  </div>
                  <Slider
                    value={[localSettings.freeTrialDays]}
                    onValueChange={([value]) => handleChange('freeTrialDays', value)}
                    min={0}
                    max={30}
                    step={1}
                    className="w-full"
                    data-testid="slider-free-trial"
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Number of days new users can access premium content for free
                  </p>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="text-zinc-300">Free Lessons Limit</Label>
                    <span className="text-orange-400 font-medium">{localSettings.freeLessonsLimit} lessons</span>
                  </div>
                  <Slider
                    value={[localSettings.freeLessonsLimit]}
                    onValueChange={([value]) => handleChange('freeLessonsLimit', value)}
                    min={0}
                    max={50}
                    step={1}
                    className="w-full"
                    data-testid="slider-free-lessons"
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Number of lessons available without subscription (after trial)
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="bg-zinc-800/30 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            Premium Features
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Select which tools and simulators require a subscription
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {localSettings.availableFeatures?.map((feature) => {
              const isPremium = localSettings.premiumFeatures?.includes(feature.key);
              const Icon = FEATURE_ICONS[feature.key] || Sparkles;
              
              return (
                <div
                  key={feature.key}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer ${
                    isPremium 
                      ? 'bg-orange-500/10 border-orange-500/50' 
                      : 'bg-zinc-900/50 border-zinc-700 hover:border-zinc-600'
                  }`}
                  onClick={() => toggleFeature(feature.key)}
                  data-testid={`feature-toggle-${feature.key}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isPremium ? 'bg-orange-500/20' : 'bg-zinc-800'}`}>
                      <Icon className={`w-5 h-5 ${isPremium ? 'text-orange-400' : 'text-zinc-500'}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{feature.label}</h4>
                      <p className="text-xs text-zinc-500">{feature.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isPremium ? (
                      <Lock className="w-4 h-4 text-orange-400" />
                    ) : (
                      <Unlock className="w-4 h-4 text-zinc-500" />
                    )}
                    <Switch
                      checked={isPremium}
                      onCheckedChange={() => toggleFeature(feature.key)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {hasChanges && (
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="bg-orange-500 hover:bg-orange-600"
            data-testid="button-save-paywall"
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Check className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}
