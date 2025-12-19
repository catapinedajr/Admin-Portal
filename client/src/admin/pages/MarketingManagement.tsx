import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Plus, BarChart3, DollarSign, Eye, MousePointerClick, 
  Trash2, Play, Pause, Building2, FileText, Receipt,
  ArrowLeft, Image, ChevronRight, TrendingUp, Send, Check
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "../components/AdminLayout";

function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  
  const { data: adminUser, isLoading, error } = useQuery<{ id: number }>({
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
  return <>{children}</>;
}

interface Client {
  id: number;
  companyName: string;
  contactName: string;
  email: string;
  phone: string | null;
  website: string | null;
  industry: string | null;
  companyType: string | null;
  taxId: string | null;
  paymentTerms: string | null;
  billingStreet: string | null;
  billingCity: string | null;
  billingState: string | null;
  billingZip: string | null;
  billingCountry: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
}

interface Campaign {
  id: number;
  name: string;
  advertiser: string;
  clientId: number | null;
  status: string;
  budgetCents: number;
  spentCents: number;
  startDate: string;
  endDate: string | null;
  targetImpressions: number | null;
  feeType: string;
  agreedRateCents: number | null;
  revenueSharePercent: number | null;
  paymentStatus: string;
  invoiceReference: string | null;
  paidAmountCents: number;
}

interface Creative {
  id: number;
  campaignId: number;
  title: string;
  description: string;
  imageUrl: string | null;
  logoUrl: string | null;
  ctaText: string;
  ctaUrl: string;
  placement: string;
  isActive: boolean;
}

interface Analytics {
  totalImpressions: number;
  totalClicks: number;
  ctr: number;
}

function ClientCard({ client, onSelect }: { client: Client; onSelect: () => void }) {
  return (
    <Card 
      className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 cursor-pointer transition-all"
      onClick={onSelect}
      data-testid={`card-client-${client.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{client.companyName}</h3>
              <p className="text-sm text-zinc-400">{client.contactName}</p>
            </div>
          </div>
          <Badge className={
            client.status === 'active' 
              ? 'bg-green-500/20 text-green-400 border-green-500/30'
              : 'bg-zinc-600/20 text-zinc-400 border-zinc-500/30'
          }>
            {client.status}
          </Badge>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-zinc-500">{client.industry || 'No industry'}</span>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </div>
      </CardContent>
    </Card>
  );
}

function NewClientDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    industry: "",
    companyType: "",
    taxId: "",
    paymentTerms: "",
    billingStreet: "",
    billingCity: "",
    billingState: "",
    billingZip: "",
    billingCountry: "",
    notes: "",
  });

  const resetForm = () => {
    setFormData({
      companyName: "", contactName: "", email: "", phone: "", website: "",
      industry: "", companyType: "", taxId: "", paymentTerms: "",
      billingStreet: "", billingCity: "", billingState: "", billingZip: "", billingCountry: "",
      notes: "",
    });
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/marketing/clients", formData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/marketing/clients"] });
      toast({ title: "Client created successfully" });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create client", description: error.message, variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-orange-500" />
            Add New Client
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Add a new advertising client with complete business details
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-zinc-300 border-b border-zinc-700 pb-2">Company Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Company Name *</Label>
                <Input
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="Bitcoin Hardware Co."
                  data-testid="input-company-name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Website</Label>
                <Input
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="https://company.com"
                  data-testid="input-website"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Company Type</Label>
                <Select value={formData.companyType} onValueChange={(v) => setFormData({ ...formData, companyType: v })}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white" data-testid="select-company-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="startup">Startup</SelectItem>
                    <SelectItem value="smb">Small/Medium Business</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="agency">Agency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Industry</Label>
                <Select value={formData.industry} onValueChange={(v) => setFormData({ ...formData, industry: v })}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white" data-testid="select-industry">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="hardware_wallet">Hardware Wallet</SelectItem>
                    <SelectItem value="exchange">Exchange</SelectItem>
                    <SelectItem value="custody">Custody</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="mining">Mining</SelectItem>
                    <SelectItem value="software">Software</SelectItem>
                    <SelectItem value="fintech">Fintech</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-zinc-300 border-b border-zinc-700 pb-2">Primary Contact</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Contact Name *</Label>
                <Input
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="John Smith"
                  data-testid="input-contact-name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="john@company.com"
                  data-testid="input-client-email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="+1 555 123 4567"
                data-testid="input-phone"
              />
            </div>
          </div>

          {/* Billing Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-zinc-300 border-b border-zinc-700 pb-2">Billing Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Tax ID / VAT Number</Label>
                <Input
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="XX-XXXXXXX"
                  data-testid="input-tax-id"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Payment Terms</Label>
                <Select value={formData.paymentTerms} onValueChange={(v) => setFormData({ ...formData, paymentTerms: v })}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white" data-testid="select-payment-terms">
                    <SelectValue placeholder="Select terms" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
                    <SelectItem value="net_15">Net 15</SelectItem>
                    <SelectItem value="net_30">Net 30</SelectItem>
                    <SelectItem value="net_60">Net 60</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Street Address</Label>
              <Input
                value={formData.billingStreet}
                onChange={(e) => setFormData({ ...formData, billingStreet: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="123 Main Street, Suite 100"
                data-testid="input-billing-street"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">City</Label>
                <Input
                  value={formData.billingCity}
                  onChange={(e) => setFormData({ ...formData, billingCity: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="San Francisco"
                  data-testid="input-billing-city"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">State / Province</Label>
                <Input
                  value={formData.billingState}
                  onChange={(e) => setFormData({ ...formData, billingState: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="CA"
                  data-testid="input-billing-state"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">ZIP / Postal Code</Label>
                <Input
                  value={formData.billingZip}
                  onChange={(e) => setFormData({ ...formData, billingZip: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="94102"
                  data-testid="input-billing-zip"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Country</Label>
                <Input
                  value={formData.billingCountry}
                  onChange={(e) => setFormData({ ...formData, billingCountry: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="United States"
                  data-testid="input-billing-country"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-zinc-300">Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Additional notes about this client..."
              rows={2}
              data-testid="input-notes"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-zinc-700 text-zinc-300">
              Cancel
            </Button>
            <Button
              onClick={() => createMutation.mutate()}
              disabled={!formData.companyName || !formData.contactName || !formData.email || createMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600"
              data-testid="button-create-client"
            >
              {createMutation.isPending ? "Creating..." : "Create Client"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ClientsTab() {
  const [showNewClient, setShowNewClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["/api/admin/marketing/clients"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/marketing/clients");
      return res.json();
    },
  });

  if (selectedClient) {
    return <ClientDetail client={selectedClient} onBack={() => setSelectedClient(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Advertising Clients</h2>
          <p className="text-sm text-zinc-400">Manage your advertising partners</p>
        </div>
        <Button onClick={() => setShowNewClient(true)} className="bg-orange-500 hover:bg-orange-600" data-testid="button-add-client">
          <Plus className="w-4 h-4 mr-2" /> Add Client
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : clients.length === 0 ? (
        <Card className="bg-zinc-800/30 border-zinc-700 border-dashed">
          <CardContent className="py-12 text-center">
            <Building2 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No clients yet</h3>
            <p className="text-zinc-400 mb-4">Add your first advertising client to get started</p>
            <Button onClick={() => setShowNewClient(true)} className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" /> Add First Client
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <ClientCard key={client.id} client={client} onSelect={() => setSelectedClient(client)} />
          ))}
        </div>
      )}

      <NewClientDialog open={showNewClient} onOpenChange={setShowNewClient} />
    </div>
  );
}

function ClientDetail({ client, onBack }: { client: Client; onBack: () => void }) {
  const { toast } = useToast();
  
  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ["/api/admin/marketing/campaigns", client.id],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/admin/marketing/campaigns?clientId=${client.id}`);
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", `/api/admin/marketing/clients/${client.id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/marketing/clients"] });
      toast({ title: "Client deleted" });
      onBack();
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="text-zinc-400 hover:text-white" data-testid="button-back">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">{client.companyName}</h2>
          <p className="text-sm text-zinc-400">{client.contactName} · {client.email}</p>
        </div>
        <Button
          variant="outline"
          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
          onClick={() => deleteMutation.mutate()}
          data-testid="button-delete-client"
        >
          <Trash2 className="w-4 h-4 mr-2" /> Delete
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-4 text-center">
            <FileText className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{campaigns.length}</p>
            <p className="text-xs text-zinc-400">Total Campaigns</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{campaigns.filter(c => c.status === 'active').length}</p>
            <p className="text-xs text-zinc-400">Active Campaigns</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              ${(campaigns.reduce((sum, c) => sum + (c.spentCents || 0), 0) / 100).toFixed(2)}
            </p>
            <p className="text-xs text-zinc-400">Total Spent</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="font-semibold text-white mb-4">Campaigns</h3>
        {campaigns.length === 0 ? (
          <Card className="bg-zinc-800/30 border-zinc-700 border-dashed">
            <CardContent className="py-8 text-center">
              <p className="text-zinc-400">No campaigns for this client yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-white">{campaign.name}</h4>
                      <p className="text-sm text-zinc-400">
                        ${(campaign.spentCents / 100).toFixed(2)} / ${(campaign.budgetCents / 100).toFixed(2)} budget
                      </p>
                    </div>
                    <Badge className={campaign.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-600/20 text-zinc-400'}>
                      {campaign.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CampaignsTab() {
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const { toast } = useToast();

  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/admin/marketing/campaigns"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/marketing/campaigns");
      return res.json();
    },
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/admin/marketing/clients"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/marketing/clients");
      return res.json();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const newStatus = status === 'active' ? 'paused' : 'active';
      return apiRequest("PATCH", `/api/admin/marketing/campaigns/${id}`, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/marketing/campaigns"] });
      toast({ title: "Campaign status updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/marketing/campaigns/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/marketing/campaigns"] });
      toast({ title: "Campaign deleted" });
    },
  });

  if (selectedCampaign) {
    return <CampaignDetail campaignId={selectedCampaign} onBack={() => setSelectedCampaign(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Ad Campaigns</h2>
          <p className="text-sm text-zinc-400">Manage advertising campaigns</p>
        </div>
        <Button onClick={() => setShowNewCampaign(true)} className="bg-orange-500 hover:bg-orange-600" data-testid="button-new-campaign">
          <Plus className="w-4 h-4 mr-2" /> New Campaign
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : campaigns.length === 0 ? (
        <Card className="bg-zinc-800/30 border-zinc-700 border-dashed">
          <CardContent className="py-12 text-center">
            <BarChart3 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No campaigns yet</h3>
            <p className="text-zinc-400 mb-4">Create your first ad campaign</p>
            <Button onClick={() => setShowNewCampaign(true)} className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" /> Create Campaign
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="bg-zinc-800/50 border-zinc-700" data-testid={`card-campaign-${campaign.id}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{campaign.name}</h3>
                    <p className="text-sm text-zinc-400">{campaign.advertiser}</p>
                  </div>
                  <Badge className={campaign.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-600/20 text-zinc-400'}>
                    {campaign.status}
                  </Badge>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-zinc-400 mb-1">
                    <span>Budget</span>
                    <span>${(campaign.spentCents / 100).toFixed(2)} / ${(campaign.budgetCents / 100).toFixed(2)}</span>
                  </div>
                  <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${Math.min((campaign.spentCents / campaign.budgetCents) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-zinc-600 text-zinc-300"
                      onClick={() => toggleMutation.mutate({ id: campaign.id, status: campaign.status })}
                    >
                      {campaign.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500/30 text-red-400"
                      onClick={() => deleteMutation.mutate(campaign.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-orange-500/30 text-orange-400"
                    onClick={() => setSelectedCampaign(campaign.id)}
                  >
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <NewCampaignDialog open={showNewCampaign} onOpenChange={setShowNewCampaign} clients={clients} />
    </div>
  );
}

function NewCampaignDialog({ open, onOpenChange, clients }: { open: boolean; onOpenChange: (open: boolean) => void; clients: Client[] }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    advertiser: "",
    clientId: "",
    budget: "",
    startDate: "",
    endDate: "",
    targetImpressions: "",
    feeType: "cpc",
    agreedRate: "",
    revenueSharePercent: "",
    paymentStatus: "pending",
    invoiceReference: "",
  });

  const resetForm = () => {
    setFormData({
      name: "", advertiser: "", clientId: "", budget: "", startDate: "", endDate: "",
      targetImpressions: "", feeType: "cpc", agreedRate: "", revenueSharePercent: "",
      paymentStatus: "pending", invoiceReference: "",
    });
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/marketing/campaigns", {
        name: formData.name,
        advertiser: formData.advertiser,
        clientId: formData.clientId ? parseInt(formData.clientId) : null,
        budgetCents: (parseFloat(formData.budget) || 0) * 100,
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        endDate: formData.endDate || null,
        targetImpressions: formData.targetImpressions ? parseInt(formData.targetImpressions) : null,
        feeType: formData.feeType,
        agreedRateCents: formData.agreedRate ? Math.round(parseFloat(formData.agreedRate) * 100) : null,
        revenueSharePercent: formData.revenueSharePercent ? parseInt(formData.revenueSharePercent) : null,
        paymentStatus: formData.paymentStatus,
        invoiceReference: formData.invoiceReference || null,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/marketing/campaigns"] });
      toast({ title: "Campaign created successfully" });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create campaign", description: error.message, variant: "destructive" });
    },
  });

  const getFeeLabel = () => {
    switch (formData.feeType) {
      case 'cpc': return 'Cost per Click (USD)';
      case 'cpm': return 'Cost per 1000 Impressions (USD)';
      case 'flat_fee': return 'Flat Fee Amount (USD)';
      case 'monthly_retainer': return 'Monthly Retainer (USD)';
      case 'revenue_share': return 'Revenue Share %';
      default: return 'Rate (USD)';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Create Ad Campaign</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Set up a new advertising campaign with pricing and payment terms
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-zinc-300 border-b border-zinc-700 pb-2">Campaign Details</h4>
            <div className="space-y-2">
              <Label className="text-zinc-300">Campaign Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="Q1 Awareness Campaign"
                data-testid="input-campaign-name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Advertiser *</Label>
                <Input
                  value={formData.advertiser}
                  onChange={(e) => setFormData({ ...formData, advertiser: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="Company Name"
                  data-testid="input-advertiser"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Client</Label>
                <Select value={formData.clientId} onValueChange={(v) => setFormData({ ...formData, clientId: v })}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white" data-testid="select-client">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>{client.companyName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Start Date</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  data-testid="input-start-date"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  data-testid="input-end-date"
                />
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-zinc-300 border-b border-zinc-700 pb-2">Pricing & Fee Structure</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Fee Type *</Label>
                <Select value={formData.feeType} onValueChange={(v) => setFormData({ ...formData, feeType: v })}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white" data-testid="select-fee-type">
                    <SelectValue placeholder="Select fee type" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="cpc">Cost per Click (CPC)</SelectItem>
                    <SelectItem value="cpm">Cost per 1000 Impressions (CPM)</SelectItem>
                    <SelectItem value="flat_fee">Flat Fee</SelectItem>
                    <SelectItem value="monthly_retainer">Monthly Retainer</SelectItem>
                    <SelectItem value="revenue_share">Revenue Share</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">{getFeeLabel()}</Label>
                {formData.feeType === 'revenue_share' ? (
                  <Input
                    type="number"
                    value={formData.revenueSharePercent}
                    onChange={(e) => setFormData({ ...formData, revenueSharePercent: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="e.g., 15"
                    data-testid="input-revenue-share"
                  />
                ) : (
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.agreedRate}
                    onChange={(e) => setFormData({ ...formData, agreedRate: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder={formData.feeType === 'cpc' ? '0.50' : formData.feeType === 'cpm' ? '5.00' : '1000'}
                    data-testid="input-agreed-rate"
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Total Budget (USD)</Label>
                <Input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="1000"
                  data-testid="input-budget"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Target Impressions</Label>
                <Input
                  type="number"
                  value={formData.targetImpressions}
                  onChange={(e) => setFormData({ ...formData, targetImpressions: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="10000"
                  data-testid="input-target-impressions"
                />
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-zinc-300 border-b border-zinc-700 pb-2">Payment Status</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Payment Status</Label>
                <Select value={formData.paymentStatus} onValueChange={(v) => setFormData({ ...formData, paymentStatus: v })}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white" data-testid="select-payment-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="invoiced">Invoiced</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Invoice Reference</Label>
                <Input
                  value={formData.invoiceReference}
                  onChange={(e) => setFormData({ ...formData, invoiceReference: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="INV-2024-001"
                  data-testid="input-invoice-reference"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-zinc-700 text-zinc-300">
              Cancel
            </Button>
            <Button
              onClick={() => createMutation.mutate()}
              disabled={!formData.name || !formData.advertiser || createMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600"
              data-testid="button-create-campaign"
            >
              {createMutation.isPending ? "Creating..." : "Create Campaign"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CampaignDetail({ campaignId, onBack }: { campaignId: number; onBack: () => void }) {
  const { toast } = useToast();
  const [showNewCreative, setShowNewCreative] = useState(false);

  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ["/api/admin/marketing/campaigns"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/marketing/campaigns");
      return res.json();
    },
  });

  const { data: creatives = [], isLoading: creativesLoading } = useQuery<Creative[]>({
    queryKey: ["/api/admin/marketing/creatives", campaignId],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/admin/marketing/creatives?campaignId=${campaignId}`);
      return res.json();
    },
  });

  const { data: analytics } = useQuery<Analytics>({
    queryKey: ["/api/admin/marketing/analytics", campaignId],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/admin/marketing/analytics?campaignId=${campaignId}`);
      return res.json();
    },
  });

  const campaign = campaigns.find((c) => c.id === campaignId);

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">Campaign not found</p>
        <Button onClick={onBack} variant="outline" className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="text-zinc-400 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div>
          <h2 className="text-xl font-bold text-white">{campaign.name}</h2>
          <p className="text-sm text-zinc-400">{campaign.advertiser}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-4 text-center">
            <Eye className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{analytics?.totalImpressions?.toLocaleString() || 0}</p>
            <p className="text-xs text-zinc-400">Impressions</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-4 text-center">
            <MousePointerClick className="w-5 h-5 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{analytics?.totalClicks?.toLocaleString() || 0}</p>
            <p className="text-xs text-zinc-400">Clicks</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-5 h-5 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{(analytics?.ctr || 0).toFixed(2)}%</p>
            <p className="text-xs text-zinc-400">CTR</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">${(campaign.spentCents / 100).toFixed(2)}</p>
            <p className="text-xs text-zinc-400">Spent</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-white">Creatives</h3>
          <Button onClick={() => setShowNewCreative(true)} variant="outline" className="border-orange-500/30 text-orange-400">
            <Image className="w-4 h-4 mr-2" /> Add Creative
          </Button>
        </div>

        {creativesLoading ? (
          <div className="text-center py-8 text-zinc-400">Loading creatives...</div>
        ) : creatives.length === 0 ? (
          <Card className="bg-zinc-800/30 border-zinc-700 border-dashed">
            <CardContent className="py-12 text-center">
              <Image className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400 mb-4">No creatives yet</p>
              <Button onClick={() => setShowNewCreative(true)} variant="outline" className="border-orange-500/30 text-orange-400">
                <Image className="w-4 h-4 mr-2" /> Add Creative
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {creatives.map((creative) => (
              <CreativeCard key={creative.id} creative={creative} />
            ))}
          </div>
        )}
      </div>

      <NewCreativeDialog open={showNewCreative} onOpenChange={setShowNewCreative} campaignId={campaignId} />
    </div>
  );
}

function CreativeCard({ creative }: { creative: Creative }) {
  const { toast } = useToast();

  const toggleMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PATCH", `/api/admin/marketing/creatives/${creative.id}`, { isActive: !creative.isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/marketing/creatives", creative.campaignId] });
      toast({ title: `Creative ${creative.isActive ? 'paused' : 'activated'}` });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/admin/marketing/creatives/${creative.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/marketing/creatives", creative.campaignId] });
      toast({ title: "Creative deleted" });
    },
  });

  return (
    <Card className="bg-zinc-800/30 border-zinc-700">
      <CardContent className="p-3">
        <div className="flex gap-3">
          {creative.imageUrl ? (
            <div className="w-20 h-14 rounded overflow-hidden bg-zinc-700 flex-shrink-0">
              <img src={creative.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-20 h-14 rounded bg-zinc-700 flex items-center justify-center flex-shrink-0">
              <Image className="w-6 h-6 text-zinc-500" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="min-w-0">
                <h4 className="font-medium text-white text-sm truncate">{creative.title}</h4>
                <p className="text-xs text-zinc-400 truncate">{creative.description}</p>
              </div>
              <Badge className={creative.isActive ? 'bg-green-500/20 text-green-400 text-[10px]' : 'bg-zinc-600/20 text-zinc-400 text-[10px]'}>
                {creative.isActive ? 'Active' : 'Paused'}
              </Badge>
            </div>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-zinc-400" onClick={() => toggleMutation.mutate()}>
                {creative.isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </Button>
              <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-red-400" onClick={() => deleteMutation.mutate()}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NewCreativeDialog({ open, onOpenChange, campaignId }: { open: boolean; onOpenChange: (open: boolean) => void; campaignId: number }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    logoUrl: "",
    ctaText: "Learn More",
    ctaUrl: "",
    placement: "in_feed",
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/marketing/creatives", {
        campaignId,
        ...formData,
        imageUrl: formData.imageUrl || null,
        logoUrl: formData.logoUrl || null,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/marketing/creatives", campaignId] });
      toast({ title: "Creative created successfully" });
      onOpenChange(false);
      setFormData({ title: "", description: "", imageUrl: "", logoUrl: "", ctaText: "Learn More", ctaUrl: "", placement: "in_feed" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create creative", description: error.message, variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Create Ad Creative</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            <Label className="text-zinc-300">Headline *</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Secure Your Bitcoin Today"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Description *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Industry-leading cold storage for your BTC..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Image URL</Label>
              <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Logo URL</Label>
              <Input
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">CTA Text</Label>
              <Input
                value={formData.ctaText}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="Learn More"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">CTA URL *</Label>
              <Input
                value={formData.ctaUrl}
                onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Placement</Label>
            <Select value={formData.placement} onValueChange={(v) => setFormData({ ...formData, placement: v })}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="in_feed">In-Feed (Community)</SelectItem>
                <SelectItem value="sidebar">Sidebar</SelectItem>
                <SelectItem value="banner">Banner</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-zinc-700 text-zinc-300">
              Cancel
            </Button>
            <Button
              onClick={() => createMutation.mutate()}
              disabled={!formData.title || !formData.description || !formData.ctaUrl || createMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {createMutation.isPending ? "Creating..." : "Create Creative"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PerformanceTab() {
  const { data: analytics } = useQuery<{ 
    totalImpressions: number; 
    totalClicks: number; 
    ctr: number; 
    totalBudgetCents: number;
    totalSpentCents: number;
    budgetPacing: number;
    totalCampaigns: number;
    activeCampaigns: number;
    campaigns: any[] 
  }>({
    queryKey: ["/api/admin/marketing/analytics"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/marketing/analytics");
      return res.json();
    },
  });

  const formatCurrency = (cents: number) => `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const pacingColor = (pacing: number) => {
    if (pacing < 80) return 'text-yellow-400';
    if (pacing > 100) return 'text-red-400';
    return 'text-green-400';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Performance Overview</h2>
        <p className="text-sm text-zinc-400">Real-time metrics across all campaigns</p>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-6 text-center">
            <Eye className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-white">{analytics?.totalImpressions?.toLocaleString() || 0}</p>
            <p className="text-sm text-zinc-400">Total Impressions</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-6 text-center">
            <MousePointerClick className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-white">{analytics?.totalClicks?.toLocaleString() || 0}</p>
            <p className="text-sm text-zinc-400">Total Clicks</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-8 h-8 text-orange-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-white">{(analytics?.ctr || 0).toFixed(2)}%</p>
            <p className="text-sm text-zinc-400">Overall CTR</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-white">{analytics?.activeCampaigns || 0}</p>
            <p className="text-sm text-zinc-400">Active Campaigns</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget & Spend KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-white">{formatCurrency(analytics?.totalBudgetCents || 0)}</p>
            <p className="text-sm text-zinc-400">Total Budget</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-orange-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-white">{formatCurrency(analytics?.totalSpentCents || 0)}</p>
            <p className="text-sm text-zinc-400">Total Spent</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <p className={`text-3xl font-bold ${pacingColor(analytics?.budgetPacing || 0)}`}>
              {(analytics?.budgetPacing || 0).toFixed(1)}%
            </p>
            <p className="text-sm text-zinc-400">Budget Pacing</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-white">
              {formatCurrency((analytics?.totalBudgetCents || 0) - (analytics?.totalSpentCents || 0))}
            </p>
            <p className="text-sm text-zinc-400">Remaining Budget</p>
          </CardContent>
        </Card>
      </div>

      {analytics?.campaigns && analytics.campaigns.length > 0 && (
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white">Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.campaigns.map((campaign: any) => (
                <div key={campaign.id} className="p-4 bg-zinc-900/50 rounded-lg space-y-3" data-testid={`campaign-perf-${campaign.id}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{campaign.name}</p>
                      <p className="text-sm text-zinc-400">{campaign.advertiser}</p>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <div className="text-center">
                        <p className="text-white font-medium">{campaign.impressions?.toLocaleString() || 0}</p>
                        <p className="text-zinc-500">Impr.</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white font-medium">{campaign.clicks?.toLocaleString() || 0}</p>
                        <p className="text-zinc-500">Clicks</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white font-medium">{(campaign.ctr || 0).toFixed(2)}%</p>
                        <p className="text-zinc-500">CTR</p>
                      </div>
                    </div>
                  </div>
                  {/* Budget Pacing Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400">
                        Spent: {formatCurrency(campaign.spentCents || 0)} / {formatCurrency(campaign.budgetCents || 0)}
                      </span>
                      <span className={pacingColor(campaign.budgetPacing || 0)}>
                        {(campaign.budgetPacing || 0).toFixed(1)}% pacing
                      </span>
                    </div>
                    <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          (campaign.budgetPacing || 0) < 80 ? 'bg-yellow-500' :
                          (campaign.budgetPacing || 0) > 100 ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(campaign.budgetPacing || 0, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface Invoice {
  id: number;
  clientId: number;
  campaignId: number | null;
  invoiceNumber: string;
  amountUsd: string;
  status: string;
  dueDate: string | null;
  paidAt: string | null;
  notes: string | null;
  createdAt: string;
}

function InvoicesTab() {
  const { toast } = useToast();
  const [showNewInvoice, setShowNewInvoice] = useState(false);

  const { data: invoices = [], isLoading } = useQuery<Invoice[]>({
    queryKey: ["/api/admin/marketing/invoices"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/marketing/invoices");
      return res.json();
    },
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/admin/marketing/clients"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/marketing/clients");
      return res.json();
    },
  });

  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return client?.companyName || 'Unknown Client';
  };

  const markPaidMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("PATCH", `/api/admin/marketing/invoices/${id}`, { status: 'paid' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/marketing/invoices"] });
      toast({ title: "Invoice marked as paid" });
    },
  });

  const sendInvoiceMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("PATCH", `/api/admin/marketing/invoices/${id}`, { status: 'sent' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/marketing/invoices"] });
      toast({ title: "Invoice status updated to sent" });
    },
  });

  const statusColors: Record<string, string> = {
    draft: 'bg-zinc-600/20 text-zinc-400 border-zinc-500/30',
    sent: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    paid: 'bg-green-500/20 text-green-400 border-green-500/30',
    overdue: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + parseFloat(i.amountUsd || '0'), 0);
  const pendingRevenue = invoices.filter(i => i.status === 'sent').reduce((sum, i) => sum + parseFloat(i.amountUsd || '0'), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Invoices</h2>
          <p className="text-sm text-zinc-400">Manage client billing and payments</p>
        </div>
        <Button onClick={() => setShowNewInvoice(true)} className="bg-orange-500 hover:bg-orange-600" data-testid="button-new-invoice">
          <Plus className="w-4 h-4 mr-2" /> Create Invoice
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-4 text-center">
            <Receipt className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{invoices.length}</p>
            <p className="text-xs text-zinc-400">Total Invoices</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">${totalRevenue.toFixed(2)}</p>
            <p className="text-xs text-zinc-400">Collected Revenue</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">${pendingRevenue.toFixed(2)}</p>
            <p className="text-xs text-zinc-400">Pending Revenue</p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : invoices.length === 0 ? (
        <Card className="bg-zinc-800/30 border-zinc-700 border-dashed">
          <CardContent className="py-12 text-center">
            <Receipt className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No invoices yet</h3>
            <p className="text-zinc-400 mb-4">Create your first invoice to start billing clients</p>
            <Button onClick={() => setShowNewInvoice(true)} className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" /> Create Invoice
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-700">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="p-4 flex items-center justify-between" data-testid={`invoice-${invoice.id}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-zinc-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-zinc-400">{getClientName(invoice.clientId)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-white">${parseFloat(invoice.amountUsd).toFixed(2)}</p>
                      {invoice.dueDate && (
                        <p className="text-xs text-zinc-500">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                      )}
                    </div>
                    <Badge className={statusColors[invoice.status] || statusColors.draft}>
                      {invoice.status}
                    </Badge>
                    <div className="flex gap-1">
                      {invoice.status === 'draft' && (
                        <Button size="sm" variant="ghost" className="text-blue-400" onClick={() => sendInvoiceMutation.mutate(invoice.id)}>
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
                      {(invoice.status === 'sent' || invoice.status === 'draft') && (
                        <Button size="sm" variant="ghost" className="text-green-400" onClick={() => markPaidMutation.mutate(invoice.id)}>
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <NewInvoiceDialog open={showNewInvoice} onOpenChange={setShowNewInvoice} clients={clients} />
    </div>
  );
}

function NewInvoiceDialog({ open, onOpenChange, clients }: { open: boolean; onOpenChange: (open: boolean) => void; clients: Client[] }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    clientId: "",
    amount: "",
    dueDate: "",
    notes: "",
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/marketing/invoices", {
        clientId: parseInt(formData.clientId),
        amountUsd: formData.amount,
        dueDate: formData.dueDate || null,
        notes: formData.notes || null,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/marketing/invoices"] });
      toast({ title: "Invoice created successfully" });
      onOpenChange(false);
      setFormData({ clientId: "", amount: "", dueDate: "", notes: "" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create invoice", description: error.message, variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-orange-500" />
            Create Invoice
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label className="text-zinc-300">Client *</Label>
            <Select value={formData.clientId} onValueChange={(v) => setFormData({ ...formData, clientId: v })}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id.toString()}>{client.companyName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Amount (USD) *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="1000.00"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Due Date</Label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Invoice details or notes..."
              rows={2}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-zinc-700 text-zinc-300">
              Cancel
            </Button>
            <Button
              onClick={() => createMutation.mutate()}
              disabled={!formData.clientId || !formData.amount || createMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {createMutation.isPending ? "Creating..." : "Create Invoice"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function MarketingManagement() {
  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Marketing</h1>
            <p className="text-zinc-400">Manage advertising clients, campaigns, and performance</p>
          </div>

          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="bg-zinc-800 border-zinc-700">
              <TabsTrigger value="performance" className="data-[state=active]:bg-orange-500">
                <BarChart3 className="w-4 h-4 mr-2" /> Performance
              </TabsTrigger>
              <TabsTrigger value="clients" className="data-[state=active]:bg-orange-500">
                <Building2 className="w-4 h-4 mr-2" /> Clients
              </TabsTrigger>
              <TabsTrigger value="campaigns" className="data-[state=active]:bg-orange-500">
                <FileText className="w-4 h-4 mr-2" /> Campaigns
              </TabsTrigger>
              <TabsTrigger value="invoices" className="data-[state=active]:bg-orange-500">
                <Receipt className="w-4 h-4 mr-2" /> Invoices
              </TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="mt-6">
              <PerformanceTab />
            </TabsContent>

            <TabsContent value="clients" className="mt-6">
              <ClientsTab />
            </TabsContent>

            <TabsContent value="campaigns" className="mt-6">
              <CampaignsTab />
            </TabsContent>

            <TabsContent value="invoices" className="mt-6">
              <InvoicesTab />
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}
