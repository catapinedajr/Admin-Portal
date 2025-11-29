import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Plus, BarChart3, DollarSign, Eye, MousePointerClick, Trash2, Edit, Image, Link, Play, Pause } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  id: number;
  name: string;
  advertiser: string;
  status: string;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string | null;
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
  spend: number;
}

function NewCampaignDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [advertiser, setAdvertiser] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/admin/ads/campaigns', {
        name,
        advertiser,
        budgetCents: (parseInt(budget) || 0) * 100,
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate: endDate || null
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ads/campaigns'] });
      setOpen(false);
      setName("");
      setAdvertiser("");
      setBudget("");
      setStartDate("");
      setEndDate("");
      toast({ title: "Campaign created successfully" });
      onSuccess();
    },
    onError: () => {
      toast({ title: "Failed to create campaign", variant: "destructive" });
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange-500 hover:bg-orange-600" data-testid="button-new-campaign">
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-white">Create Ad Campaign</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <Label className="text-zinc-300">Campaign Name</Label>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Q1 Awareness Campaign"
              className="bg-zinc-800 border-zinc-700 text-white"
              data-testid="input-campaign-name"
            />
          </div>
          <div>
            <Label className="text-zinc-300">Advertiser</Label>
            <Input 
              value={advertiser}
              onChange={(e) => setAdvertiser(e.target.value)}
              placeholder="Company Name"
              className="bg-zinc-800 border-zinc-700 text-white"
              data-testid="input-advertiser"
            />
          </div>
          <div>
            <Label className="text-zinc-300">Budget (USD)</Label>
            <Input 
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="1000"
              className="bg-zinc-800 border-zinc-700 text-white"
              data-testid="input-budget"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-300">Start Date</Label>
              <Input 
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
                data-testid="input-start-date"
              />
            </div>
            <div>
              <Label className="text-zinc-300">End Date (optional)</Label>
              <Input 
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
                data-testid="input-end-date"
              />
            </div>
          </div>
          <Button 
            onClick={() => createMutation.mutate()}
            disabled={!name || !advertiser || createMutation.isPending}
            className="w-full bg-orange-500 hover:bg-orange-600"
            data-testid="button-create-campaign"
          >
            {createMutation.isPending ? "Creating..." : "Create Campaign"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NewCreativeDialog({ campaignId, onSuccess }: { campaignId: number; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [ctaText, setCtaText] = useState("Learn More");
  const [ctaUrl, setCtaUrl] = useState("");
  const [placement, setPlacement] = useState("in_feed");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/admin/ads/creatives', {
        campaignId,
        title,
        description,
        imageUrl: imageUrl || null,
        logoUrl: logoUrl || null,
        ctaText,
        ctaUrl,
        placement
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ads/creatives', campaignId] });
      setOpen(false);
      setTitle("");
      setDescription("");
      setImageUrl("");
      setLogoUrl("");
      setCtaText("Learn More");
      setCtaUrl("");
      toast({ title: "Creative created successfully" });
      onSuccess();
    },
    onError: () => {
      toast({ title: "Failed to create creative", variant: "destructive" });
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10" data-testid="button-new-creative">
          <Image className="w-4 h-4 mr-2" />
          Add Creative
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-700 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Create Ad Creative</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto">
          <div>
            <Label className="text-zinc-300">Headline</Label>
            <Input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Secure Your Bitcoin Today"
              className="bg-zinc-800 border-zinc-700 text-white"
              data-testid="input-creative-title"
            />
          </div>
          <div>
            <Label className="text-zinc-300">Description</Label>
            <Textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Industry-leading cold storage for your BTC..."
              className="bg-zinc-800 border-zinc-700 text-white"
              rows={3}
              data-testid="input-creative-description"
            />
          </div>
          <div>
            <Label className="text-zinc-300">Image URL (optional)</Label>
            <Input 
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="bg-zinc-800 border-zinc-700 text-white"
              data-testid="input-image-url"
            />
          </div>
          <div>
            <Label className="text-zinc-300">Logo URL (optional)</Label>
            <Input 
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="bg-zinc-800 border-zinc-700 text-white"
              data-testid="input-logo-url"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-300">CTA Text</Label>
              <Input 
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="Learn More"
                className="bg-zinc-800 border-zinc-700 text-white"
                data-testid="input-cta-text"
              />
            </div>
            <div>
              <Label className="text-zinc-300">CTA URL</Label>
              <Input 
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                placeholder="https://..."
                className="bg-zinc-800 border-zinc-700 text-white"
                data-testid="input-cta-url"
              />
            </div>
          </div>
          <div>
            <Label className="text-zinc-300">Placement</Label>
            <Select value={placement} onValueChange={setPlacement}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white" data-testid="select-placement">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="in_feed">In-Feed</SelectItem>
                <SelectItem value="sidebar">Sidebar</SelectItem>
                <SelectItem value="banner">Banner</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={() => createMutation.mutate()}
            disabled={!title || !description || !ctaUrl || createMutation.isPending}
            className="w-full bg-orange-500 hover:bg-orange-600"
            data-testid="button-create-creative"
          >
            {createMutation.isPending ? "Creating..." : "Create Creative"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CampaignCard({ campaign, onSelect }: { campaign: Campaign; onSelect: () => void }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const toggleMutation = useMutation({
    mutationFn: async () => {
      const newStatus = campaign.status === 'active' ? 'paused' : 'active';
      return apiRequest('PATCH', `/api/admin/ads/campaigns/${campaign.id}`, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ads/campaigns'] });
      toast({ title: `Campaign ${campaign.status === 'active' ? 'paused' : 'activated'}` });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('DELETE', `/api/admin/ads/campaigns/${campaign.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ads/campaigns'] });
      toast({ title: "Campaign deleted" });
    }
  });

  const spendPercent = campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0;

  return (
    <Card className="bg-zinc-800/50 border-zinc-700 hover:border-zinc-600 transition-colors" data-testid={`card-campaign-${campaign.id}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-white">{campaign.name}</h3>
            <p className="text-sm text-zinc-400">{campaign.advertiser}</p>
          </div>
          <Badge 
            className={campaign.status === 'active' 
              ? 'bg-green-500/20 text-green-400 border-green-500/30' 
              : 'bg-zinc-600/20 text-zinc-400 border-zinc-500/30'
            }
          >
            {campaign.status}
          </Badge>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-xs text-zinc-400 mb-1">
            <span>Budget</span>
            <span>${campaign.spent.toFixed(2)} / ${campaign.budget.toFixed(2)}</span>
          </div>
          <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-500 rounded-full transition-all"
              style={{ width: `${Math.min(spendPercent, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
              onClick={() => toggleMutation.mutate()}
              data-testid={`button-toggle-${campaign.id}`}
            >
              {campaign.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              onClick={() => deleteMutation.mutate()}
              data-testid={`button-delete-${campaign.id}`}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
            onClick={onSelect}
            data-testid={`button-manage-${campaign.id}`}
          >
            Manage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CreativeCard({ creative }: { creative: Creative }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const toggleMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('PATCH', `/api/admin/ads/creatives/${creative.id}`, { isActive: !creative.isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ads/creatives', creative.campaignId] });
      toast({ title: `Creative ${creative.isActive ? 'paused' : 'activated'}` });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('DELETE', `/api/admin/ads/creatives/${creative.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ads/creatives', creative.campaignId] });
      toast({ title: "Creative deleted" });
    }
  });

  return (
    <Card className="bg-zinc-800/30 border-zinc-700" data-testid={`card-creative-${creative.id}`}>
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
              <Badge 
                className={creative.isActive 
                  ? 'bg-green-500/20 text-green-400 border-green-500/30 text-[10px]' 
                  : 'bg-zinc-600/20 text-zinc-400 border-zinc-500/30 text-[10px]'
                }
              >
                {creative.isActive ? 'Active' : 'Paused'}
              </Badge>
            </div>
            <div className="flex gap-2 mt-2">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 px-2 text-xs text-zinc-400 hover:text-white"
                onClick={() => toggleMutation.mutate()}
              >
                {creative.isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 px-2 text-xs text-red-400 hover:text-red-300"
                onClick={() => deleteMutation.mutate()}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CampaignDetail({ campaignId, onBack }: { campaignId: number; onBack: () => void }) {
  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ['/api/admin/ads/campaigns']
  });

  const { data: creatives = [], isLoading: creativesLoading } = useQuery<Creative[]>({
    queryKey: ['/api/admin/ads/creatives', campaignId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/ads/creatives?campaignId=${campaignId}`);
      return res.json();
    }
  });

  const { data: analytics } = useQuery<Analytics>({
    queryKey: ['/api/admin/ads/analytics', campaignId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/ads/analytics?campaignId=${campaignId}`);
      if (!res.ok) return { totalImpressions: 0, totalClicks: 0, ctr: 0, spend: 0 };
      const data = await res.json();
      return {
        totalImpressions: data.summary?.totalImpressions || 0,
        totalClicks: data.summary?.totalClicks || 0,
        ctr: parseFloat(data.summary?.overallCtr) || 0,
        spend: 0
      };
    }
  });

  const campaign = campaigns.find(c => c.id === campaignId);

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
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-zinc-400 hover:text-white"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
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
            <p className="text-2xl font-bold text-white">${campaign.spent.toFixed(2)}</p>
            <p className="text-xs text-zinc-400">Spent</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-white">Creatives</h3>
          <NewCreativeDialog campaignId={campaignId} onSuccess={() => {}} />
        </div>
        
        {creativesLoading ? (
          <div className="text-center py-8 text-zinc-400">Loading creatives...</div>
        ) : creatives.length === 0 ? (
          <Card className="bg-zinc-800/30 border-zinc-700 border-dashed">
            <CardContent className="py-12 text-center">
              <Image className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400 mb-4">No creatives yet</p>
              <NewCreativeDialog campaignId={campaignId} onSuccess={() => {}} />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {creatives.map(creative => (
              <CreativeCard key={creative.id} creative={creative} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminAdsPage() {
  const [, setLocation] = useLocation();
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);

  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ['/api/admin/ads/campaigns']
  });

  const { data: overallAnalytics } = useQuery<Analytics>({
    queryKey: ['/api/admin/ads/analytics'],
    queryFn: async () => {
      const res = await fetch('/api/admin/ads/analytics');
      if (!res.ok) return { totalImpressions: 0, totalClicks: 0, ctr: 0, spend: 0 };
      const data = await res.json();
      return {
        totalImpressions: data.summary?.totalImpressions || 0,
        totalClicks: data.summary?.totalClicks || 0,
        ctr: parseFloat(data.summary?.overallCtr) || 0,
        spend: 0
      };
    }
  });

  return (
    <div className="min-h-screen bg-zinc-900">
      <header className="bg-zinc-800/50 border-b border-zinc-700 px-4 py-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/community')}
            className="text-zinc-400 hover:text-white"
            data-testid="button-back-community"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">Ad Manager</h1>
            <p className="text-sm text-zinc-400">Manage your advertising campaigns</p>
          </div>
        </div>
      </header>

      <main className="p-4 pb-24 max-w-4xl mx-auto">
        {selectedCampaign ? (
          <CampaignDetail 
            campaignId={selectedCampaign} 
            onBack={() => setSelectedCampaign(null)} 
          />
        ) : (
          <Tabs defaultValue="campaigns" className="space-y-4">
            <TabsList className="bg-zinc-800 border border-zinc-700">
              <TabsTrigger 
                value="campaigns" 
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                data-testid="tab-campaigns"
              >
                Campaigns
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                data-testid="tab-analytics"
              >
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="campaigns" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Campaigns</h2>
                <NewCampaignDialog onSuccess={() => {}} />
              </div>

              {isLoading ? (
                <div className="text-center py-12 text-zinc-400">Loading campaigns...</div>
              ) : campaigns.length === 0 ? (
                <Card className="bg-zinc-800/30 border-zinc-700 border-dashed">
                  <CardContent className="py-12 text-center">
                    <BarChart3 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No campaigns yet</h3>
                    <p className="text-zinc-400 mb-4">Create your first ad campaign to start monetizing</p>
                    <NewCampaignDialog onSuccess={() => {}} />
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {campaigns.map(campaign => (
                    <CampaignCard 
                      key={campaign.id} 
                      campaign={campaign} 
                      onSelect={() => setSelectedCampaign(campaign.id)} 
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Overall Analytics</h2>

              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="p-6 text-center">
                    <Eye className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <p className="text-3xl font-bold text-white">{overallAnalytics?.totalImpressions?.toLocaleString() || 0}</p>
                    <p className="text-sm text-zinc-400">Total Impressions</p>
                  </CardContent>
                </Card>
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="p-6 text-center">
                    <MousePointerClick className="w-8 h-8 text-green-400 mx-auto mb-3" />
                    <p className="text-3xl font-bold text-white">{overallAnalytics?.totalClicks?.toLocaleString() || 0}</p>
                    <p className="text-sm text-zinc-400">Total Clicks</p>
                  </CardContent>
                </Card>
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="p-6 text-center">
                    <BarChart3 className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                    <p className="text-3xl font-bold text-white">{(overallAnalytics?.ctr || 0).toFixed(2)}%</p>
                    <p className="text-sm text-zinc-400">Average CTR</p>
                  </CardContent>
                </Card>
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="p-6 text-center">
                    <DollarSign className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                    <p className="text-3xl font-bold text-white">${(overallAnalytics?.spend || 0).toFixed(2)}</p>
                    <p className="text-sm text-zinc-400">Total Revenue</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-zinc-800/30 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Campaign Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  {campaigns.length === 0 ? (
                    <p className="text-zinc-400 text-center py-4">No campaigns to display</p>
                  ) : (
                    <div className="space-y-4">
                      {campaigns.map(campaign => (
                        <div key={campaign.id} className="flex items-center justify-between py-2 border-b border-zinc-700 last:border-0">
                          <div>
                            <p className="text-white font-medium">{campaign.name}</p>
                            <p className="text-xs text-zinc-400">{campaign.advertiser}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white">${campaign.spent.toFixed(2)}</p>
                            <p className="text-xs text-zinc-400">of ${campaign.budget.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
