import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Plus, Target, TrendingUp, CheckCircle, AlertTriangle,
  Edit2, Trash2, ChevronDown, ChevronRight, BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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

interface KeyResult {
  id: number;
  objectiveId: number;
  title: string;
  description: string | null;
  metricType: string;
  targetValue: number;
  currentValue: number;
  unit: string | null;
  status: string;
  createdAt: string;
}

interface Objective {
  id: number;
  title: string;
  description: string | null;
  category: string;
  timeframe: string;
  quarter: string | null;
  year: number | null;
  status: string;
  progress: number;
  ownerId: string | null;
  ownerName: string | null;
  keyResults: KeyResult[];
  createdAt: string;
}

interface OKRStats {
  totalObjectives: number;
  activeObjectives: number;
  totalKeyResults: number;
  onTrackKeyResults: number;
  atRiskKeyResults: number;
  avgProgress: number;
}

const OBJECTIVE_CATEGORIES = [
  { value: 'company', label: 'Company-wide' },
  { value: 'product', label: 'Product' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'growth', label: 'Growth' },
  { value: 'operations', label: 'Operations' },
  { value: 'content', label: 'Content' },
];

const TIMEFRAMES = [
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annual', label: 'Annual' },
  { value: 'monthly', label: 'Monthly' },
];

const QUARTERS = [
  { value: 'Q1', label: 'Q1 (Jan-Mar)' },
  { value: 'Q2', label: 'Q2 (Apr-Jun)' },
  { value: 'Q3', label: 'Q3 (Jul-Sep)' },
  { value: 'Q4', label: 'Q4 (Oct-Dec)' },
];

const KR_STATUSES = [
  { value: 'on_track', label: 'On Track', color: 'bg-green-600' },
  { value: 'at_risk', label: 'At Risk', color: 'bg-yellow-600' },
  { value: 'behind', label: 'Behind', color: 'bg-red-600' },
  { value: 'completed', label: 'Completed', color: 'bg-blue-600' },
];

const METRIC_TYPES = [
  { value: 'percentage', label: 'Percentage' },
  { value: 'number', label: 'Number' },
  { value: 'currency', label: 'Currency' },
  { value: 'boolean', label: 'Yes/No' },
];

function OKRManagementContent() {
  const { toast } = useToast();
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [showKRModal, setShowKRModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingObjective, setEditingObjective] = useState<Objective | null>(null);
  const [editingKR, setEditingKR] = useState<KeyResult | null>(null);
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<number | null>(null);
  const [updatingKR, setUpdatingKR] = useState<KeyResult | null>(null);
  const [expandedObjectives, setExpandedObjectives] = useState<Set<number>>(new Set());
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const currentYear = new Date().getFullYear();
  const currentQuarter = `Q${Math.ceil((new Date().getMonth() + 1) / 3)}`;

  const [objectiveForm, setObjectiveForm] = useState({
    title: '',
    description: '',
    category: 'company',
    timeframe: 'quarterly',
    quarter: currentQuarter,
    year: currentYear,
    status: 'active',
    ownerName: '',
  });

  const [krForm, setKRForm] = useState({
    objectiveId: 0,
    title: '',
    description: '',
    metricType: 'percentage',
    targetValue: 100,
    currentValue: 0,
    unit: '',
    status: 'on_track',
  });

  const [updateForm, setUpdateForm] = useState({
    newValue: 0,
    note: '',
  });

  const { data: stats } = useQuery<OKRStats>({
    queryKey: ["/api/admin/okrs/stats"],
  });

  const { data: objectives = [] } = useQuery<Objective[]>({
    queryKey: ["/api/admin/okrs/objectives"],
  });

  const createObjectiveMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/okrs/objectives", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/okrs/objectives"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/okrs/stats"] });
      setShowObjectiveModal(false);
      resetObjectiveForm();
      toast({ title: "Objective created successfully" });
    },
  });

  const updateObjectiveMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiRequest("PATCH", `/api/admin/okrs/objectives/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/okrs/objectives"] });
      setShowObjectiveModal(false);
      setEditingObjective(null);
      resetObjectiveForm();
      toast({ title: "Objective updated successfully" });
    },
  });

  const deleteObjectiveMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/okrs/objectives/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/okrs/objectives"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/okrs/stats"] });
      toast({ title: "Objective deleted" });
    },
  });

  const createKRMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/okrs/key-results", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/okrs/objectives"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/okrs/stats"] });
      setShowKRModal(false);
      resetKRForm();
      toast({ title: "Key Result created successfully" });
    },
  });

  const updateKRMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiRequest("PATCH", `/api/admin/okrs/key-results/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/okrs/objectives"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/okrs/stats"] });
      setShowKRModal(false);
      setEditingKR(null);
      resetKRForm();
      toast({ title: "Key Result updated successfully" });
    },
  });

  const updateKRProgressMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiRequest("POST", `/api/admin/okrs/key-results/${id}/update`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/okrs/objectives"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/okrs/stats"] });
      setShowUpdateModal(false);
      setUpdatingKR(null);
      setUpdateForm({ newValue: 0, note: '' });
      toast({ title: "Progress updated successfully" });
    },
  });

  const deleteKRMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/okrs/key-results/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/okrs/objectives"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/okrs/stats"] });
      toast({ title: "Key Result deleted" });
    },
  });

  const resetObjectiveForm = () => {
    setObjectiveForm({
      title: '', description: '', category: 'company', timeframe: 'quarterly',
      quarter: currentQuarter, year: currentYear, status: 'active', ownerName: '',
    });
  };

  const resetKRForm = () => {
    setKRForm({
      objectiveId: 0, title: '', description: '', metricType: 'percentage',
      targetValue: 100, currentValue: 0, unit: '', status: 'on_track',
    });
  };

  const openEditObjective = (obj: Objective) => {
    setEditingObjective(obj);
    setObjectiveForm({
      title: obj.title,
      description: obj.description || '',
      category: obj.category,
      timeframe: obj.timeframe,
      quarter: obj.quarter || currentQuarter,
      year: obj.year || currentYear,
      status: obj.status,
      ownerName: obj.ownerName || '',
    });
    setShowObjectiveModal(true);
  };

  const openAddKR = (objectiveId: number) => {
    setSelectedObjectiveId(objectiveId);
    setKRForm({ ...krForm, objectiveId });
    setEditingKR(null);
    setShowKRModal(true);
  };

  const openEditKR = (kr: KeyResult) => {
    setEditingKR(kr);
    setKRForm({
      objectiveId: kr.objectiveId,
      title: kr.title,
      description: kr.description || '',
      metricType: kr.metricType,
      targetValue: kr.targetValue,
      currentValue: kr.currentValue,
      unit: kr.unit || '',
      status: kr.status,
    });
    setShowKRModal(true);
  };

  const openUpdateKR = (kr: KeyResult) => {
    setUpdatingKR(kr);
    setUpdateForm({ newValue: kr.currentValue, note: '' });
    setShowUpdateModal(true);
  };

  const handleObjectiveSubmit = () => {
    const data = {
      ...objectiveForm,
      description: objectiveForm.description || null,
      quarter: objectiveForm.timeframe === 'quarterly' ? objectiveForm.quarter : null,
      year: objectiveForm.year || null,
      ownerName: objectiveForm.ownerName || null,
    };

    if (editingObjective) {
      updateObjectiveMutation.mutate({ id: editingObjective.id, data });
    } else {
      createObjectiveMutation.mutate(data);
    }
  };

  const handleKRSubmit = () => {
    const data = {
      ...krForm,
      description: krForm.description || null,
      unit: krForm.unit || null,
    };

    if (editingKR) {
      updateKRMutation.mutate({ id: editingKR.id, data });
    } else {
      createKRMutation.mutate(data);
    }
  };

  const handleUpdateSubmit = () => {
    if (!updatingKR) return;
    updateKRProgressMutation.mutate({
      id: updatingKR.id,
      data: {
        newValue: updateForm.newValue,
        note: updateForm.note || null,
        updatedBy: 'Admin',
      },
    });
  };

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedObjectives);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedObjectives(newExpanded);
  };

  const filteredObjectives = objectives.filter(obj => {
    if (filterCategory !== 'all' && obj.category !== filterCategory) return false;
    if (filterStatus !== 'all' && obj.status !== filterStatus) return false;
    return true;
  });

  const getProgressColor = (progress: number) => {
    if (progress >= 70) return 'bg-green-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getKRProgress = (kr: KeyResult) => {
    if (kr.targetValue === 0) return 0;
    return Math.min(Math.round((kr.currentValue / kr.targetValue) * 100), 100);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Goals & OKRs</h1>
            <p className="text-zinc-400 mt-1">Track objectives and key results</p>
          </div>
          <Button
            onClick={() => { resetObjectiveForm(); setEditingObjective(null); setShowObjectiveModal(true); }}
            className="bg-orange-500 hover:bg-orange-600"
            data-testid="button-add-objective"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Objective
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Target className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats?.totalObjectives || 0}</p>
                  <p className="text-sm text-zinc-400">Objectives</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats?.activeObjectives || 0}</p>
                  <p className="text-sm text-zinc-400">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats?.totalKeyResults || 0}</p>
                  <p className="text-sm text-zinc-400">Key Results</p>
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
                  <p className="text-2xl font-bold text-white">{stats?.onTrackKeyResults || 0}</p>
                  <p className="text-sm text-zinc-400">On Track</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats?.atRiskKeyResults || 0}</p>
                  <p className="text-sm text-zinc-400">At Risk</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-cyan-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats?.avgProgress || 0}%</p>
                  <p className="text-sm text-zinc-400">Avg Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-4 p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
          <span className="text-sm text-zinc-400">Filters:</span>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40 bg-zinc-800 border-zinc-700 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="all">All Categories</SelectItem>
              {OBJECTIVE_CATEGORIES.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 bg-zinc-800 border-zinc-700 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
          {(filterCategory !== 'all' || filterStatus !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setFilterCategory('all'); setFilterStatus('all'); }}
              className="text-zinc-400 hover:text-white"
            >
              Clear Filters
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {filteredObjectives.map(objective => (
            <Collapsible
              key={objective.id}
              open={expandedObjectives.has(objective.id)}
              onOpenChange={() => toggleExpanded(objective.id)}
            >
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4">
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 text-left">
                        <div className="mt-1">
                          {expandedObjectives.has(objective.id) ? (
                            <ChevronDown className="w-5 h-5 text-zinc-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-zinc-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white">{objective.title}</h3>
                            <Badge variant="secondary">
                              {OBJECTIVE_CATEGORIES.find(c => c.value === objective.category)?.label}
                            </Badge>
                            {objective.quarter && objective.year && (
                              <Badge variant="outline" className="text-zinc-400">
                                {objective.quarter} {objective.year}
                              </Badge>
                            )}
                          </div>
                          {objective.description && (
                            <p className="text-sm text-zinc-400 mb-2">{objective.description}</p>
                          )}
                          <div className="flex items-center gap-4">
                            <div className="flex-1 max-w-xs">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-zinc-400">Progress</span>
                                <span className="text-white font-medium">{objective.progress}%</span>
                              </div>
                              <Progress value={objective.progress} className={`h-2 ${getProgressColor(objective.progress)}`} />
                            </div>
                            <span className="text-sm text-zinc-500">
                              {objective.keyResults?.length || 0} Key Results
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openAddKR(objective.id)}
                          className="text-orange-400 hover:text-orange-300"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add KR
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditObjective(objective)}
                          className="text-zinc-400 hover:text-white"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteObjectiveMutation.mutate(objective.id)}
                          className="text-zinc-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="mt-4 ml-8 space-y-3">
                      {objective.keyResults?.map(kr => (
                        <div
                          key={kr.id}
                          className="p-3 bg-zinc-800 rounded-lg border border-zinc-700"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium text-white">{kr.title}</h4>
                                <Badge className={KR_STATUSES.find(s => s.value === kr.status)?.color}>
                                  {KR_STATUSES.find(s => s.value === kr.status)?.label}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex-1 max-w-sm">
                                  <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-zinc-400">
                                      {kr.currentValue} / {kr.targetValue} {kr.unit || ''}
                                    </span>
                                    <span className="text-white font-medium">{getKRProgress(kr)}%</span>
                                  </div>
                                  <Progress value={getKRProgress(kr)} className="h-2" />
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openUpdateKR(kr)}
                                className="text-green-400 hover:text-green-300"
                              >
                                <TrendingUp className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditKR(kr)}
                                className="text-zinc-400 hover:text-white"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteKRMutation.mutate(kr.id)}
                                className="text-zinc-400 hover:text-red-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {(!objective.keyResults || objective.keyResults.length === 0) && (
                        <p className="text-sm text-zinc-500 py-2">No key results yet. Add your first key result to track progress.</p>
                      )}
                    </div>
                  </CollapsibleContent>
                </CardContent>
              </Card>
            </Collapsible>
          ))}
          
          {filteredObjectives.length === 0 && (
            <div className="text-center py-12 text-zinc-500">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No objectives yet. Create your first objective to start tracking goals.</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showObjectiveModal} onOpenChange={setShowObjectiveModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingObjective ? 'Edit Objective' : 'New Objective'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-zinc-300">Objective Title *</Label>
              <Input
                value={objectiveForm.title}
                onChange={(e) => setObjectiveForm(f => ({ ...f, title: e.target.value }))}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="e.g., Increase user engagement"
                data-testid="input-objective-title"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Description</Label>
              <Textarea
                value={objectiveForm.description}
                onChange={(e) => setObjectiveForm(f => ({ ...f, description: e.target.value }))}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-300">Category</Label>
                <Select value={objectiveForm.category} onValueChange={(v) => setObjectiveForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {OBJECTIVE_CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-zinc-300">Timeframe</Label>
                <Select value={objectiveForm.timeframe} onValueChange={(v) => setObjectiveForm(f => ({ ...f, timeframe: v }))}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {TIMEFRAMES.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {objectiveForm.timeframe === 'quarterly' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-zinc-300">Quarter</Label>
                  <Select value={objectiveForm.quarter} onValueChange={(v) => setObjectiveForm(f => ({ ...f, quarter: v }))}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {QUARTERS.map(q => (
                        <SelectItem key={q.value} value={q.value}>{q.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-zinc-300">Year</Label>
                  <Input
                    type="number"
                    value={objectiveForm.year}
                    onChange={(e) => setObjectiveForm(f => ({ ...f, year: parseInt(e.target.value) }))}
                    className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  />
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-300">Status</Label>
                <Select value={objectiveForm.status} onValueChange={(v) => setObjectiveForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-zinc-300">Owner</Label>
                <Input
                  value={objectiveForm.ownerName}
                  onChange={(e) => setObjectiveForm(f => ({ ...f, ownerName: e.target.value }))}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="Team or person"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setShowObjectiveModal(false)}>Cancel</Button>
              <Button
                onClick={handleObjectiveSubmit}
                disabled={!objectiveForm.title || createObjectiveMutation.isPending || updateObjectiveMutation.isPending}
                className="bg-orange-500 hover:bg-orange-600"
                data-testid="button-save-objective"
              >
                {editingObjective ? 'Update' : 'Create'} Objective
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showKRModal} onOpenChange={setShowKRModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingKR ? 'Edit Key Result' : 'New Key Result'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-zinc-300">Key Result Title *</Label>
              <Input
                value={krForm.title}
                onChange={(e) => setKRForm(f => ({ ...f, title: e.target.value }))}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="e.g., Achieve 10,000 daily active users"
                data-testid="input-kr-title"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Description</Label>
              <Textarea
                value={krForm.description}
                onChange={(e) => setKRForm(f => ({ ...f, description: e.target.value }))}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-300">Metric Type</Label>
                <Select value={krForm.metricType} onValueChange={(v) => setKRForm(f => ({ ...f, metricType: v }))}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {METRIC_TYPES.map(m => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-zinc-300">Unit (optional)</Label>
                <Input
                  value={krForm.unit}
                  onChange={(e) => setKRForm(f => ({ ...f, unit: e.target.value }))}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="e.g., users, %, $"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-300">Target Value *</Label>
                <Input
                  type="number"
                  value={krForm.targetValue}
                  onChange={(e) => setKRForm(f => ({ ...f, targetValue: parseInt(e.target.value) || 0 }))}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Current Value</Label>
                <Input
                  type="number"
                  value={krForm.currentValue}
                  onChange={(e) => setKRForm(f => ({ ...f, currentValue: parseInt(e.target.value) || 0 }))}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-zinc-300">Status</Label>
              <Select value={krForm.status} onValueChange={(v) => setKRForm(f => ({ ...f, status: v }))}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  {KR_STATUSES.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setShowKRModal(false)}>Cancel</Button>
              <Button
                onClick={handleKRSubmit}
                disabled={!krForm.title || createKRMutation.isPending || updateKRMutation.isPending}
                className="bg-orange-500 hover:bg-orange-600"
                data-testid="button-save-kr"
              >
                {editingKR ? 'Update' : 'Create'} Key Result
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Update Progress</DialogTitle>
          </DialogHeader>
          {updatingKR && (
            <div className="space-y-4">
              <p className="text-sm text-zinc-400">{updatingKR.title}</p>
              <div>
                <Label className="text-zinc-300">
                  New Value (Current: {updatingKR.currentValue} / Target: {updatingKR.targetValue})
                </Label>
                <Input
                  type="number"
                  value={updateForm.newValue}
                  onChange={(e) => setUpdateForm(f => ({ ...f, newValue: parseInt(e.target.value) || 0 }))}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Note (optional)</Label>
                <Textarea
                  value={updateForm.note}
                  onChange={(e) => setUpdateForm(f => ({ ...f, note: e.target.value }))}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  rows={2}
                  placeholder="What changed?"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setShowUpdateModal(false)}>Cancel</Button>
                <Button
                  onClick={handleUpdateSubmit}
                  disabled={updateKRProgressMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Update Progress
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

export default function OKRManagement() {
  return (
    <AdminAuthGuard>
      <OKRManagementContent />
    </AdminAuthGuard>
  );
}
