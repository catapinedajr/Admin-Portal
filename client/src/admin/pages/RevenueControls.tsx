import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Shield, Check, Loader2, CreditCard, Lock, Unlock, Sparkles,
  ShieldCheck, Wallet, ArrowLeftRight, Coins, Calculator, TrendingUp, Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import AdminLayout from "../components/AdminLayout";

function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  
  const { data: adminUser, isLoading, error } = useQuery<{ id: number; userType: string }>({
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
  
  if (adminUser.userType !== 'SUPER_ADMIN') {
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
  id: number | null;
  freeDayThreshold: number;
  paywallEnabled: boolean;
  premiumFeatures: string[];
  paywallTitle: string;
  paywallMessage: string;
  availableFeatures: { key: string; label: string; description: string }[];
}

const FEATURE_ICONS: Record<string, any> = {
  'safety': ShieldCheck,
  'wallet': Wallet,
  'transactions': ArrowLeftRight,
  'transfer': Zap,
  'hodl': TrendingUp,
  'dca': Calculator,
  'inflation': Coins,
  'fees': Sparkles,
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
    queryKey: ["/api/admin/paywall"],
  });

  const [localSettings, setLocalSettings] = useState<PaywallSettings>({
    id: null,
    freeDayThreshold: 7,
    paywallEnabled: true,
    premiumFeatures: [],
    paywallTitle: 'Unlock Your Bitcoin Education',
    paywallMessage: 'Subscribe to access all 336 days of Bitcoin mastery and premium tools.',
    availableFeatures: [],
  });

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<PaywallSettings>) => {
      return apiRequest('POST', '/api/admin/paywall', data);
    },
    onSuccess: () => {
      toast({ title: "Settings saved", description: "Paywall configuration updated successfully." });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/paywall"] });
      queryClient.invalidateQueries({ queryKey: ["/api/paywall-config"] });
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
      freeDayThreshold: localSettings.freeDayThreshold,
      paywallEnabled: localSettings.paywallEnabled,
      premiumFeatures: localSettings.premiumFeatures,
      paywallTitle: localSettings.paywallTitle,
      paywallMessage: localSettings.paywallMessage,
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
          <h1 className="text-2xl font-bold text-white">Paywall Settings</h1>
          <p className="text-zinc-400">Control access to premium content and subscription features</p>
        </div>
        {hasChanges && (
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
        )}
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
              <div className={`p-2 rounded-lg ${localSettings.paywallEnabled ? 'bg-orange-500/20' : 'bg-zinc-800'}`}>
                {localSettings.paywallEnabled ? (
                  <Lock className="w-5 h-5 text-orange-400" />
                ) : (
                  <Unlock className="w-5 h-5 text-zinc-500" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-white">Enable Paywall</h4>
                <p className="text-sm text-zinc-500">
                  {localSettings.paywallEnabled 
                    ? 'Premium content requires subscription after free days'
                    : 'All content is freely accessible'
                  }
                </p>
              </div>
            </div>
            <Switch
              checked={localSettings.paywallEnabled}
              onCheckedChange={(checked) => handleChange('paywallEnabled', checked)}
              data-testid="switch-paywall-enabled"
            />
          </div>

          {localSettings.paywallEnabled && (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-zinc-300">Free Days Before Paywall</Label>
                  <span className="text-orange-400 font-medium">{localSettings.freeDayThreshold} days</span>
                </div>
                <Slider
                  value={[localSettings.freeDayThreshold]}
                  onValueChange={([value]) => handleChange('freeDayThreshold', value)}
                  min={0}
                  max={30}
                  step={1}
                  className="w-full"
                  data-testid="slider-free-days"
                />
                <p className="text-xs text-zinc-500 mt-1">
                  Number of days new users can access content for free before seeing the paywall
                </p>
              </div>

              <div>
                <Label htmlFor="paywallTitle" className="text-zinc-300">Paywall Title</Label>
                <Input
                  id="paywallTitle"
                  value={localSettings.paywallTitle}
                  onChange={(e) => handleChange('paywallTitle', e.target.value)}
                  className="bg-zinc-800 border-zinc-600 text-white mt-2"
                  placeholder="Enter paywall title"
                  data-testid="input-paywall-title"
                />
              </div>

              <div>
                <Label htmlFor="paywallMessage" className="text-zinc-300">Paywall Message</Label>
                <Textarea
                  id="paywallMessage"
                  value={localSettings.paywallMessage}
                  onChange={(e) => handleChange('paywallMessage', e.target.value)}
                  className="bg-zinc-800 border-zinc-600 text-white mt-2 min-h-[80px]"
                  placeholder="Enter the message shown to users when they hit the paywall"
                  data-testid="input-paywall-message"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-zinc-800/30 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            Premium Simulators
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Select which simulators require a subscription to access
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
          
          {(!localSettings.availableFeatures || localSettings.availableFeatures.length === 0) && (
            <div className="text-center py-8 text-zinc-500">
              <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No simulators configured</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
