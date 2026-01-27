import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Plus, Building2, Users, DollarSign, TrendingUp,
  Archive, Edit2, Phone, Mail, ChevronRight, GripVertical,
  Calendar, MessageSquare, CheckCircle, Clock, Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "../components/AdminLayout";
import { AdminAuthGuard } from "../components/AdminAuthGuard";

interface CrmCompany {
  id: number;
  name: string;
  website: string | null;
  industry: string | null;
  employeeCount: string | null;
  accountType: string;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  notes: string | null;
  isActive: boolean;
}

interface CrmContact {
  id: number;
  companyId: number;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  isPrimary: boolean;
}

interface CrmDeal {
  id: number;
  companyId: number;
  contactId: number | null;
  title: string;
  opportunityType: string;
  stage: string;
  dealValue: string | null;
  currency: string;
  contractLength: number | null;
  expectedUsers: number | null;
  probability: number | null;
  expectedCloseDate: string | null;
  actualCloseDate: string | null;
  lostReason: string | null;
  notes: string | null;
  company?: CrmCompany;
  contact?: CrmContact;
}

interface CrmActivity {
  id: number;
  dealId: number;
  activityType: string;
  subject: string;
  description: string | null;
  activityDate: string;
  dueDate: string | null;
  isCompleted: boolean;
}

interface CrmStats {
  totalCompanies: number;
  totalDeals: number;
  openDeals: number;
  wonDeals: number;
  totalWonValue: string;
}

const DEAL_STAGES = [
  { value: 'lead', label: 'Lead', color: 'bg-zinc-600' },
  { value: 'qualified', label: 'Qualified', color: 'bg-blue-600' },
  { value: 'demo', label: 'Demo', color: 'bg-purple-600' },
  { value: 'proposal', label: 'Proposal', color: 'bg-yellow-600' },
  { value: 'negotiation', label: 'Negotiation', color: 'bg-orange-600' },
  { value: 'won', label: 'Won', color: 'bg-green-600' },
  { value: 'lost', label: 'Lost', color: 'bg-red-600' },
];

const OPPORTUNITY_TYPES = [
  { value: 'enterprise_license', label: 'Enterprise License' },
  { value: 'team_subscription', label: 'Team Subscription' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'reseller', label: 'Reseller' },
];

const ACCOUNT_TYPES = [
  { value: 'hr_benefit', label: 'HR Benefit' },
  { value: 'financial_services', label: 'Financial Services Bundle' },
  { value: 'academic_education', label: 'Academic/Education' },
  { value: 'municipal_government', label: 'Municipal/Government' },
  { value: 'other', label: 'Other' },
];

const ACTIVITY_TYPES = [
  { value: 'call', label: 'Call', icon: Phone },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'meeting', label: 'Meeting', icon: Users },
  { value: 'demo', label: 'Demo', icon: Target },
  { value: 'note', label: 'Note', icon: MessageSquare },
  { value: 'task', label: 'Task', icon: CheckCircle },
];

function CRMManagementContent() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pipeline");
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);
  const [showDealDetailModal, setShowDealDetailModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CrmCompany | null>(null);
  const [editingDeal, setEditingDeal] = useState<CrmDeal | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<CrmDeal | null>(null);
  const [selectedDealActivities, setSelectedDealActivities] = useState<CrmActivity[]>([]);

  const [filterOpportunityType, setFilterOpportunityType] = useState<string>("all");
  const [filterAccountType, setFilterAccountType] = useState<string>("all");

  const [companyForm, setCompanyForm] = useState({
    name: '',
    website: '',
    industry: '',
    employeeCount: '',
    accountType: 'other',
    city: '',
    state: '',
    country: '',
    notes: '',
  });

  const [dealForm, setDealForm] = useState({
    companyId: '',
    contactId: '',
    title: '',
    opportunityType: 'enterprise_license',
    stage: 'lead',
    dealValue: '',
    contractLength: '',
    expectedUsers: '',
    probability: '0',
    expectedCloseDate: '',
    notes: '',
  });

  const [activityForm, setActivityForm] = useState({
    activityType: 'note',
    subject: '',
    description: '',
  });

  const { data: stats } = useQuery<CrmStats>({
    queryKey: ["/api/admin/crm/stats"],
  });

  const { data: companies = [] } = useQuery<CrmCompany[]>({
    queryKey: ["/api/admin/crm/companies"],
  });

  const { data: deals = [] } = useQuery<CrmDeal[]>({
    queryKey: ["/api/admin/crm/deals"],
  });

  const createCompanyMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/crm/companies", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/crm/companies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/crm/stats"] });
      setShowCompanyModal(false);
      resetCompanyForm();
      toast({ title: "Company created successfully" });
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest("PATCH", `/api/admin/crm/companies/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/crm/companies"] });
      setShowCompanyModal(false);
      setEditingCompany(null);
      resetCompanyForm();
      toast({ title: "Company updated successfully" });
    },
  });

  const archiveCompanyMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/admin/archive/crm-companies/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/crm/companies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/crm/stats"] });
      setShowCompanyModal(false);
      setEditingCompany(null);
      toast({ title: "Company archived", description: "It can be restored from the archive anytime." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to archive company.", variant: "destructive" });
    },
  });

  const archiveDealMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/admin/archive/crm-deals/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/crm/deals"] });
      setShowDealModal(false);
      setEditingDeal(null);
      toast({ title: "Deal archived", description: "It can be restored from the archive anytime." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to archive deal.", variant: "destructive" });
    },
  });

  const createDealMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/crm/deals", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/crm/deals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/crm/stats"] });
      setShowDealModal(false);
      resetDealForm();
      toast({ title: "Deal created successfully" });
    },
  });

  const updateDealMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest("PATCH", `/api/admin/crm/deals/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/crm/deals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/crm/stats"] });
      setShowDealModal(false);
      setEditingDeal(null);
      resetDealForm();
      toast({ title: "Deal updated successfully" });
    },
  });

  const updateDealStageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: number; stage: string }) => 
      apiRequest("PATCH", `/api/admin/crm/deals/${id}/stage`, { stage }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/crm/deals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/crm/stats"] });
    },
  });

  const createActivityMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/crm/activities", data),
    onSuccess: () => {
      if (selectedDeal) {
        fetchDealDetails(selectedDeal.id);
      }
      setActivityForm({ activityType: 'note', subject: '', description: '' });
      toast({ title: "Activity added successfully" });
    },
  });

  const resetCompanyForm = () => {
    setCompanyForm({
      name: '', website: '', industry: '', employeeCount: '',
      accountType: 'other', city: '', state: '', country: '', notes: '',
    });
  };

  const resetDealForm = () => {
    setDealForm({
      companyId: '', contactId: '', title: '', opportunityType: 'enterprise_license',
      stage: 'lead', dealValue: '', contractLength: '', expectedUsers: '',
      probability: '0', expectedCloseDate: '', notes: '',
    });
  };

  const fetchDealDetails = async (dealId: number) => {
    const sessionId = localStorage.getItem("admin_session");
    const response = await fetch(`/api/admin/crm/deals/${dealId}`, {
      headers: { Authorization: `Bearer ${sessionId}` },
    });
    const data = await response.json();
    setSelectedDeal(data);
    setSelectedDealActivities(data.activities || []);
  };

  const openDealDetail = (deal: CrmDeal) => {
    fetchDealDetails(deal.id);
    setShowDealDetailModal(true);
  };

  const openEditCompany = (company: CrmCompany) => {
    setEditingCompany(company);
    setCompanyForm({
      name: company.name,
      website: company.website || '',
      industry: company.industry || '',
      employeeCount: company.employeeCount || '',
      accountType: company.accountType,
      city: company.city || '',
      state: company.state || '',
      country: company.country || '',
      notes: company.notes || '',
    });
    setShowCompanyModal(true);
  };

  const openEditDeal = (deal: CrmDeal) => {
    setEditingDeal(deal);
    setDealForm({
      companyId: deal.companyId.toString(),
      contactId: deal.contactId?.toString() || '',
      title: deal.title,
      opportunityType: deal.opportunityType,
      stage: deal.stage,
      dealValue: deal.dealValue || '',
      contractLength: deal.contractLength?.toString() || '',
      expectedUsers: deal.expectedUsers?.toString() || '',
      probability: deal.probability?.toString() || '0',
      expectedCloseDate: deal.expectedCloseDate?.split('T')[0] || '',
      notes: deal.notes || '',
    });
    setShowDealModal(true);
  };

  const handleCompanySubmit = () => {
    const data = {
      ...companyForm,
      website: companyForm.website || null,
      industry: companyForm.industry || null,
      employeeCount: companyForm.employeeCount || null,
      city: companyForm.city || null,
      state: companyForm.state || null,
      country: companyForm.country || null,
      notes: companyForm.notes || null,
    };

    if (editingCompany) {
      updateCompanyMutation.mutate({ id: editingCompany.id, data });
    } else {
      createCompanyMutation.mutate(data);
    }
  };

  const handleDealSubmit = () => {
    const data = {
      companyId: parseInt(dealForm.companyId),
      contactId: dealForm.contactId ? parseInt(dealForm.contactId) : null,
      title: dealForm.title,
      opportunityType: dealForm.opportunityType,
      stage: dealForm.stage,
      dealValue: dealForm.dealValue || null,
      contractLength: dealForm.contractLength ? parseInt(dealForm.contractLength) : null,
      expectedUsers: dealForm.expectedUsers ? parseInt(dealForm.expectedUsers) : null,
      probability: parseInt(dealForm.probability),
      expectedCloseDate: dealForm.expectedCloseDate || null,
      notes: dealForm.notes || null,
    };

    if (editingDeal) {
      updateDealMutation.mutate({ id: editingDeal.id, data });
    } else {
      createDealMutation.mutate(data);
    }
  };

  const handleAddActivity = () => {
    if (!selectedDeal || !activityForm.subject) return;
    createActivityMutation.mutate({
      dealId: selectedDeal.id,
      activityType: activityForm.activityType,
      subject: activityForm.subject,
      description: activityForm.description || null,
      activityDate: new Date().toISOString(),
    });
  };

  const filteredDeals = deals.filter(deal => {
    if (filterOpportunityType !== 'all' && deal.opportunityType !== filterOpportunityType) return false;
    if (filterAccountType !== 'all' && deal.company?.accountType !== filterAccountType) return false;
    return true;
  });

  const getStageDeals = (stage: string) => filteredDeals.filter(d => d.stage === stage);
  const getStageValue = (stage: string) => {
    return getStageDeals(stage).reduce((sum, d) => sum + parseFloat(d.dealValue || '0'), 0);
  };

  const formatCurrency = (value: string | number | null) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (!num) return '$0';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">B2B CRM</h1>
            <p className="text-zinc-400 mt-1">Manage company relationships and sales pipeline</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => { resetCompanyForm(); setEditingCompany(null); setShowCompanyModal(true); }}
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              data-testid="button-add-company"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Add Company
            </Button>
            <Button 
              onClick={() => { resetDealForm(); setEditingDeal(null); setShowDealModal(true); }}
              className="bg-orange-500 hover:bg-orange-600"
              data-testid="button-add-deal"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Deal
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Building2 className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats?.totalCompanies || 0}</p>
                  <p className="text-sm text-zinc-400">Companies</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Target className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats?.openDeals || 0}</p>
                  <p className="text-sm text-zinc-400">Open Deals</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats?.wonDeals || 0}</p>
                  <p className="text-sm text-zinc-400">Won Deals</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <DollarSign className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{formatCurrency(stats?.totalWonValue || 0)}</p>
                  <p className="text-sm text-zinc-400">Won Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="pipeline" className="data-[state=active]:bg-zinc-800">
              Pipeline
            </TabsTrigger>
            <TabsTrigger value="companies" className="data-[state=active]:bg-zinc-800">
              Companies
            </TabsTrigger>
            <TabsTrigger value="deals" className="data-[state=active]:bg-zinc-800">
              All Deals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pipeline" className="mt-4">
            <div className="flex items-center gap-4 mb-4 p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
              <span className="text-sm text-zinc-400">Filters:</span>
              <Select value={filterOpportunityType} onValueChange={setFilterOpportunityType}>
                <SelectTrigger className="w-48 bg-zinc-800 border-zinc-700 text-white" data-testid="filter-opportunity-type">
                  <SelectValue placeholder="Opportunity Type" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="all">All Opportunity Types</SelectItem>
                  {OPPORTUNITY_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterAccountType} onValueChange={setFilterAccountType}>
                <SelectTrigger className="w-48 bg-zinc-800 border-zinc-700 text-white" data-testid="filter-account-type">
                  <SelectValue placeholder="Account Type" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="all">All Account Types</SelectItem>
                  {ACCOUNT_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(filterOpportunityType !== 'all' || filterAccountType !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setFilterOpportunityType('all'); setFilterAccountType('all'); }}
                  className="text-zinc-400 hover:text-white"
                  data-testid="button-clear-filters"
                >
                  Clear Filters
                </Button>
              )}
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {DEAL_STAGES.filter(s => s.value !== 'won' && s.value !== 'lost').map(stage => (
                <div key={stage.value} className="flex-shrink-0 w-72">
                  <div className={`${stage.color} rounded-t-lg px-3 py-2`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">{stage.label}</span>
                      <span className="text-sm text-white/80">
                        {getStageDeals(stage.value).length} deals
                      </span>
                    </div>
                    <p className="text-sm text-white/70 mt-1">
                      {formatCurrency(getStageValue(stage.value))}
                    </p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 border-t-0 rounded-b-lg p-2 min-h-[400px] space-y-2">
                    {getStageDeals(stage.value).map(deal => (
                      <Card 
                        key={deal.id}
                        className="bg-zinc-800 border-zinc-700 cursor-pointer hover:border-orange-500/50 transition-colors"
                        onClick={() => openDealDetail(deal)}
                        data-testid={`deal-card-${deal.id}`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-white truncate">{deal.title}</h4>
                              <p className="text-sm text-zinc-400 truncate">{deal.company?.name}</p>
                            </div>
                            {deal.dealValue && (
                              <Badge variant="outline" className="text-green-400 border-green-400/50 shrink-0">
                                {formatCurrency(deal.dealValue)}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {OPPORTUNITY_TYPES.find(t => t.value === deal.opportunityType)?.label}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex-shrink-0 w-72">
                <div className="bg-green-600 rounded-t-lg px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">Won</span>
                    <span className="text-sm text-white/80">{getStageDeals('won').length}</span>
                  </div>
                  <p className="text-sm text-white/70 mt-1">{formatCurrency(getStageValue('won'))}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 border-t-0 rounded-b-lg p-2 min-h-[400px] space-y-2">
                  {getStageDeals('won').slice(0, 5).map(deal => (
                    <div key={deal.id} className="text-sm p-2 bg-zinc-800 rounded">
                      <p className="text-white truncate">{deal.title}</p>
                      <p className="text-green-400">{formatCurrency(deal.dealValue)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 w-72">
                <div className="bg-red-600 rounded-t-lg px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">Lost</span>
                    <span className="text-sm text-white/80">{getStageDeals('lost').length}</span>
                  </div>
                  <p className="text-sm text-white/70 mt-1">{formatCurrency(getStageValue('lost'))}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 border-t-0 rounded-b-lg p-2 min-h-[400px] space-y-2">
                  {getStageDeals('lost').slice(0, 5).map(deal => (
                    <div key={deal.id} className="text-sm p-2 bg-zinc-800 rounded">
                      <p className="text-white truncate">{deal.title}</p>
                      <p className="text-zinc-400 text-xs">{deal.lostReason || 'No reason specified'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="companies" className="mt-4">
            <div className="grid gap-4">
              {companies.map(company => (
                <Card key={company.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-zinc-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{company.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {company.industry && (
                              <Badge variant="secondary" className="text-xs">{company.industry}</Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {ACCOUNT_TYPES.find(t => t.value === company.accountType)?.label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditCompany(company)}
                          className="text-zinc-400 hover:text-white"
                          data-testid={`edit-company-${company.id}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <ChevronRight className="w-5 h-5 text-zinc-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {companies.length === 0 && (
                <div className="text-center py-12 text-zinc-500">
                  <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No companies yet. Add your first company to get started.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="deals" className="mt-4">
            <div className="space-y-3">
              {deals.map(deal => (
                <Card 
                  key={deal.id} 
                  className="bg-zinc-900 border-zinc-800 cursor-pointer hover:border-zinc-700"
                  onClick={() => openDealDetail(deal)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-semibold text-white">{deal.title}</h3>
                          <p className="text-sm text-zinc-400">{deal.company?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={DEAL_STAGES.find(s => s.value === deal.stage)?.color}>
                          {DEAL_STAGES.find(s => s.value === deal.stage)?.label}
                        </Badge>
                        {deal.dealValue && (
                          <span className="text-green-400 font-semibold">{formatCurrency(deal.dealValue)}</span>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); openEditDeal(deal); }}
                          className="text-zinc-400 hover:text-white"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {deals.length === 0 && (
                <div className="text-center py-12 text-zinc-500">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No deals yet. Create your first deal to start tracking.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showCompanyModal} onOpenChange={setShowCompanyModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingCompany ? 'Edit Company' : 'Add Company'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-zinc-300">Company Name *</Label>
              <Input
                value={companyForm.name}
                onChange={(e) => setCompanyForm(f => ({ ...f, name: e.target.value }))}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="Acme Corporation"
                data-testid="input-company-name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-300">Account Type *</Label>
                <Select 
                  value={companyForm.accountType} 
                  onValueChange={(v) => setCompanyForm(f => ({ ...f, accountType: v }))}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {ACCOUNT_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-zinc-300">Industry</Label>
                <Input
                  value={companyForm.industry}
                  onChange={(e) => setCompanyForm(f => ({ ...f, industry: e.target.value }))}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="Technology"
                />
              </div>
            </div>
            <div>
              <Label className="text-zinc-300">Website</Label>
              <Input
                value={companyForm.website}
                onChange={(e) => setCompanyForm(f => ({ ...f, website: e.target.value }))}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="https://example.com"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-zinc-300">City</Label>
                <Input
                  value={companyForm.city}
                  onChange={(e) => setCompanyForm(f => ({ ...f, city: e.target.value }))}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-zinc-300">State</Label>
                <Input
                  value={companyForm.state}
                  onChange={(e) => setCompanyForm(f => ({ ...f, state: e.target.value }))}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Country</Label>
                <Input
                  value={companyForm.country}
                  onChange={(e) => setCompanyForm(f => ({ ...f, country: e.target.value }))}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-zinc-300">Notes</Label>
              <Textarea
                value={companyForm.notes}
                onChange={(e) => setCompanyForm(f => ({ ...f, notes: e.target.value }))}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                rows={3}
              />
            </div>
            <div className="flex justify-between gap-2">
              <div>
                {editingCompany && (
                  <Button 
                    variant="outline"
                    onClick={() => archiveCompanyMutation.mutate(editingCompany.id)}
                    disabled={archiveCompanyMutation.isPending}
                    className="border-orange-500/50 text-orange-400 hover:bg-orange-500/20"
                    data-testid="button-archive-company"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setShowCompanyModal(false)}>Cancel</Button>
                <Button 
                  onClick={handleCompanySubmit}
                  disabled={!companyForm.name || createCompanyMutation.isPending || updateCompanyMutation.isPending}
                  className="bg-orange-500 hover:bg-orange-600"
                  data-testid="button-save-company"
                >
                  {editingCompany ? 'Update' : 'Create'} Company
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDealModal} onOpenChange={setShowDealModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingDeal ? 'Edit Deal' : 'New Deal'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <Label className="text-zinc-300">Deal Title *</Label>
              <Input
                value={dealForm.title}
                onChange={(e) => setDealForm(f => ({ ...f, title: e.target.value }))}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="Enterprise License - Q1 2025"
                data-testid="input-deal-title"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Company *</Label>
              <Select 
                value={dealForm.companyId} 
                onValueChange={(v) => setDealForm(f => ({ ...f, companyId: v }))}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-1">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  {companies.map(company => (
                    <SelectItem key={company.id} value={company.id.toString()}>{company.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-300">Opportunity Type</Label>
                <Select 
                  value={dealForm.opportunityType} 
                  onValueChange={(v) => setDealForm(f => ({ ...f, opportunityType: v }))}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {OPPORTUNITY_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-zinc-300">Stage</Label>
                <Select 
                  value={dealForm.stage} 
                  onValueChange={(v) => setDealForm(f => ({ ...f, stage: v }))}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {DEAL_STAGES.map(stage => (
                      <SelectItem key={stage.value} value={stage.value}>{stage.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-300">Deal Value ($)</Label>
                <Input
                  type="number"
                  value={dealForm.dealValue}
                  onChange={(e) => setDealForm(f => ({ ...f, dealValue: e.target.value }))}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="10000"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Contract Length (months)</Label>
                <Input
                  type="number"
                  value={dealForm.contractLength}
                  onChange={(e) => setDealForm(f => ({ ...f, contractLength: e.target.value }))}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="12"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-300">Expected Users</Label>
                <Input
                  type="number"
                  value={dealForm.expectedUsers}
                  onChange={(e) => setDealForm(f => ({ ...f, expectedUsers: e.target.value }))}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="100"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Expected Close Date</Label>
                <Input
                  type="date"
                  value={dealForm.expectedCloseDate}
                  onChange={(e) => setDealForm(f => ({ ...f, expectedCloseDate: e.target.value }))}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-zinc-300">Notes</Label>
              <Textarea
                value={dealForm.notes}
                onChange={(e) => setDealForm(f => ({ ...f, notes: e.target.value }))}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                rows={3}
              />
            </div>
            <div className="flex justify-between gap-2">
              <div>
                {editingDeal && (
                  <Button 
                    variant="outline"
                    onClick={() => archiveDealMutation.mutate(editingDeal.id)}
                    disabled={archiveDealMutation.isPending}
                    className="border-orange-500/50 text-orange-400 hover:bg-orange-500/20"
                    data-testid="button-archive-deal"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setShowDealModal(false)}>Cancel</Button>
                <Button 
                  onClick={handleDealSubmit}
                  disabled={!dealForm.title || !dealForm.companyId || createDealMutation.isPending || updateDealMutation.isPending}
                  className="bg-orange-500 hover:bg-orange-600"
                  data-testid="button-save-deal"
                >
                  {editingDeal ? 'Update' : 'Create'} Deal
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDealDetailModal} onOpenChange={setShowDealDetailModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-white">{selectedDeal?.title}</DialogTitle>
          </DialogHeader>
          {selectedDeal && (
            <div className="space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-zinc-400">Company</p>
                  <p className="text-white">{selectedDeal.company?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Stage</p>
                  <Badge className={DEAL_STAGES.find(s => s.value === selectedDeal.stage)?.color}>
                    {DEAL_STAGES.find(s => s.value === selectedDeal.stage)?.label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Deal Value</p>
                  <p className="text-white font-semibold">{formatCurrency(selectedDeal.dealValue)}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Opportunity Type</p>
                  <p className="text-white">
                    {OPPORTUNITY_TYPES.find(t => t.value === selectedDeal.opportunityType)?.label}
                  </p>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-white">Move Stage</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {DEAL_STAGES.map(stage => (
                    <Button
                      key={stage.value}
                      variant={selectedDeal.stage === stage.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        updateDealStageMutation.mutate({ id: selectedDeal.id, stage: stage.value });
                        setSelectedDeal({ ...selectedDeal, stage: stage.value });
                      }}
                      className={selectedDeal.stage === stage.value ? stage.color : ''}
                    >
                      {stage.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4">
                <h4 className="font-medium text-white mb-3">Activity Log</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedDealActivities.map(activity => (
                    <div key={activity.id} className="p-3 bg-zinc-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {ACTIVITY_TYPES.find(t => t.value === activity.activityType)?.label}
                        </Badge>
                        <span className="text-xs text-zinc-500">
                          {new Date(activity.activityDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-white text-sm">{activity.subject}</p>
                      {activity.description && (
                        <p className="text-zinc-400 text-sm mt-1">{activity.description}</p>
                      )}
                    </div>
                  ))}
                  {selectedDealActivities.length === 0 && (
                    <p className="text-zinc-500 text-sm">No activities logged yet.</p>
                  )}
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4">
                <h4 className="font-medium text-white mb-3">Add Activity</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Select 
                      value={activityForm.activityType} 
                      onValueChange={(v) => setActivityForm(f => ({ ...f, activityType: v }))}
                    >
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        {ACTIVITY_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={activityForm.subject}
                      onChange={(e) => setActivityForm(f => ({ ...f, subject: e.target.value }))}
                      className="bg-zinc-800 border-zinc-700 text-white"
                      placeholder="Subject"
                    />
                  </div>
                  <Textarea
                    value={activityForm.description}
                    onChange={(e) => setActivityForm(f => ({ ...f, description: e.target.value }))}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="Details (optional)"
                    rows={2}
                  />
                  <Button 
                    onClick={handleAddActivity}
                    disabled={!activityForm.subject || createActivityMutation.isPending}
                    className="bg-orange-500 hover:bg-orange-600"
                    data-testid="button-add-activity"
                  >
                    Add Activity
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

export default function CRMManagement() {
  return (
    <AdminAuthGuard>
      <CRMManagementContent />
    </AdminAuthGuard>
  );
}
