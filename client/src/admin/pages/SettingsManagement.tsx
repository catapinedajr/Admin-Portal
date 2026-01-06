import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Settings, Key, Shield, AlertTriangle, Check, Eye, EyeOff, Plus, Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

interface SystemSetting {
  id: number;
  key: string;
  maskedValue: string;
  description: string | null;
  category: string;
  updatedAt: string;
}

const API_KEY_PRESETS = [
  { key: 'ANTHROPIC_API_KEY', description: 'Anthropic Claude API key for AI content generation' },
  { key: 'STRIPE_SECRET_KEY', description: 'Stripe secret key for payment processing' },
  { key: 'STRIPE_WEBHOOK_SECRET', description: 'Stripe webhook signing secret' },
];

export default function SettingsManagement() {
  return (
    <AdminAuthGuard>
      <AdminLayout>
        <SettingsContent />
      </AdminLayout>
    </AdminAuthGuard>
  );
}

function SettingsContent() {
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [settingToDelete, setSettingToDelete] = useState<string | null>(null);
  const [showValue, setShowValue] = useState(false);
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    description: '',
  });

  const { data: settings = [], isLoading } = useQuery<SystemSetting[]>({
    queryKey: ["/api/admin/settings"],
  });

  const saveMutation = useMutation({
    mutationFn: async (data: { key: string; value: string; description: string }) => {
      return apiRequest('POST', '/api/admin/settings', data);
    },
    onSuccess: () => {
      toast({ title: "Setting saved", description: "API key has been securely stored." });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      setAddDialogOpen(false);
      setFormData({ key: '', value: '', description: '' });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error saving setting", 
        description: error.message || "Failed to save API key",
        variant: "destructive"
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (key: string) => {
      return apiRequest('DELETE', `/api/admin/settings/${key}`);
    },
    onSuccess: () => {
      toast({ title: "Setting deleted", description: "API key has been removed." });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      setDeleteDialogOpen(false);
      setSettingToDelete(null);
    },
    onError: (error: any) => {
      toast({ 
        title: "Error deleting setting", 
        description: error.message || "Failed to delete API key",
        variant: "destructive"
      });
    },
  });

  const handleSave = () => {
    if (!formData.key || !formData.value) {
      toast({ 
        title: "Validation error", 
        description: "Key name and value are required",
        variant: "destructive"
      });
      return;
    }
    saveMutation.mutate(formData);
  };

  const handlePresetSelect = (preset: typeof API_KEY_PRESETS[0]) => {
    setFormData({
      key: preset.key,
      value: '',
      description: preset.description,
    });
  };

  const handleDelete = (key: string) => {
    setSettingToDelete(key);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (settingToDelete) {
      deleteMutation.mutate(settingToDelete);
    }
  };

  const existingKeys = settings.map(s => s.key);
  const availablePresets = API_KEY_PRESETS.filter(p => !existingKeys.includes(p.key));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-orange-500" />
            System Settings
          </h1>
          <p className="text-zinc-400 mt-1">Manage API keys and system configuration</p>
        </div>
        <Button 
          onClick={() => setAddDialogOpen(true)} 
          className="bg-orange-500 hover:bg-orange-600"
          data-testid="button-add-setting"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add API Key
        </Button>
      </div>

      <Card className="bg-zinc-800/30 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-500" />
            Security Notice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 text-sm text-zinc-400">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
            <div>
              <p className="mb-2">
                API keys are encrypted using AES-256-GCM before storage. Only masked values are displayed in the UI.
              </p>
              <p>
                For production environments, set <code className="bg-zinc-700 px-1 rounded">SETTINGS_ENCRYPTION_KEY</code> environment 
                variable with a strong 32+ character secret.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-800/50 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-orange-500" />
            Configured API Keys
          </CardTitle>
          <CardDescription className="text-zinc-400">
            {settings.length} key{settings.length !== 1 ? 's' : ''} configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : settings.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              <Key className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No API keys configured yet</p>
              <p className="text-sm mt-1">Click "Add API Key" to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {settings.map((setting) => (
                <div 
                  key={setting.id}
                  className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg border border-zinc-700"
                  data-testid={`setting-row-${setting.key}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <code className="text-orange-400 font-mono text-sm">{setting.key}</code>
                      <span className="text-zinc-600">|</span>
                      <span className="text-zinc-500 font-mono text-sm">{setting.maskedValue}</span>
                    </div>
                    {setting.description && (
                      <p className="text-sm text-zinc-500 mt-1">{setting.description}</p>
                    )}
                    <p className="text-xs text-zinc-600 mt-1">
                      Updated: {new Date(setting.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData({
                          key: setting.key,
                          value: '',
                          description: setting.description || '',
                        });
                        setAddDialogOpen(true);
                      }}
                      className="border-zinc-600 hover:border-orange-500"
                      data-testid={`button-update-${setting.key}`}
                    >
                      Update
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(setting.key)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      data-testid={`button-delete-${setting.key}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {formData.key ? `Update ${formData.key}` : 'Add API Key'}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Enter your API key. It will be encrypted before storage.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {availablePresets.length > 0 && !formData.key && (
              <div>
                <Label className="text-zinc-400 text-sm">Quick Add</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {availablePresets.map((preset) => (
                    <Button
                      key={preset.key}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePresetSelect(preset)}
                      className="border-zinc-600 hover:border-orange-500 text-xs"
                      data-testid={`button-preset-${preset.key}`}
                    >
                      {preset.key}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="key" className="text-zinc-300">Key Name</Label>
              <Input
                id="key"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_') })}
                placeholder="e.g., ANTHROPIC_API_KEY"
                className="bg-zinc-800 border-zinc-600 text-white font-mono"
                disabled={!!existingKeys.includes(formData.key)}
                data-testid="input-setting-key"
              />
            </div>
            
            <div>
              <Label htmlFor="value" className="text-zinc-300">Value</Label>
              <div className="relative">
                <Input
                  id="value"
                  type={showValue ? 'text' : 'password'}
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="Enter API key value..."
                  className="bg-zinc-800 border-zinc-600 text-white font-mono pr-10"
                  data-testid="input-setting-value"
                />
                <button
                  type="button"
                  onClick={() => setShowValue(!showValue)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showValue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description" className="text-zinc-300">Description (optional)</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What is this key used for?"
                className="bg-zinc-800 border-zinc-600 text-white"
                data-testid="input-setting-description"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => {
                setAddDialogOpen(false);
                setFormData({ key: '', value: '', description: '' });
              }}
              className="text-zinc-400"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600"
              data-testid="button-save-setting"
            >
              {saveMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete API Key?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to delete <code className="text-orange-400">{settingToDelete}</code>?
              This action cannot be undone and may break functionality that depends on this key.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-600 text-white hover:bg-zinc-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
