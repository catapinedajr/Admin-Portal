import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Plus, Target, TrendingUp, CheckCircle, AlertTriangle,
  Edit2, Trash2, ChevronDown, ChevronRight, BarChart3,
  Calendar, Clock, Loader2, RefreshCw, CheckCircle2,
  XCircle, AlertCircle, TrendingDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "../components/AdminLayout";
import type { KpiTarget } from "@shared/schema";

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

const TARGET_METRIC_OPTIONS = [
  { key: 'users.total', name: 'Total Users', category: 'users', unit: 'users' },
  { key: 'users.active', name: 'Active Users (7d)', category: 'users', unit: 'users' },
  { key: 'engagement.lessonCompletionRate', name: 'Lesson Completion Rate', category: 'engagement', unit: '%' },
  { key: 'content.coverage', name: 'Content Coverage', category: 'content', unit: '%' },
  { key: 'community.totalPosts', name: 'Community Posts', category: 'community', unit: 'posts' },
  { key: 'revenue.monthly', name: 'Monthly Revenue', category: 'revenue', unit: '$' },
  { key: 'product.completedIdeas', name: 'Completed Ideas', category: 'product', unit: 'ideas' },
];

function CircularProgress({ value, size = 120, label, sublabel, color = "orange" }: { 
  value: number; 
  size?: number; 
  label: string; 
  sublabel?: string;
  color?: "orange" | "green" | "blue" | "purple";
}) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(value, 100) / 100) * circumference;
  const gradientId = `progressGradient-${label.toLowerCase().replace(/\s+/g, '-')}-${color}`;
  
  const colors = {
    orange: { start: "#f97316", end: "#fb923c" },
    green: { start: "#22c55e", end: "#4ade80" },
    blue: { start: "#3b82f6", end: "#60a5fa" },
    purple: { start: "#a855f7", end: "#c084fc" },
  };

  return (
    <div className="flex flex-col items-center justify-center" data-testid={`circular-progress-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors[color].start} />
              <stop offset="100%" stopColor={colors[color].end} />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#27272a"
            strokeWidth="8"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{Math.round(value)}%</span>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-white">{label}</p>
      {sublabel && <p className="text-xs text-zinc-500">{sublabel}</p>}
    </div>
  );
}

function TargetCard({ target, onRefresh }: { target: KpiTarget; onRefresh: () => void }) {
  const { toast } = useToast();
  const progress = target.targetValue > 0 ? Math.min((target.currentValue / target.targetValue) * 100, 100) : 0;
  const dueDate = new Date(target.dueDate);
  const now = new Date();
  const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysUntilDue < 0 && target.status === 'active';
  
  const deleteMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", `/api/admin/kpis/targets/${target.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/kpis/targets"] });
      toast({ title: "Target deleted" });
    },
  });

  const getStatusIcon = () => {
    switch (target.status) {
      case 'achieved': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'missed': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'cancelled': return <AlertCircle className="h-5 w-5 text-zinc-500" />;
      default: return isOverdue ? <AlertCircle className="h-5 w-5 text-yellow-500" /> : <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (target.status) {
      case 'achieved': return 'border-green-500/30 bg-green-500/5';
      case 'missed': return 'border-red-500/30 bg-red-500/5';
      case 'cancelled': return 'border-zinc-500/30 bg-zinc-500/5';
      default: return isOverdue ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-zinc-800 bg-zinc-900';
    }
  };

  return (
    <Card className={`${getStatusColor()} transition-all`} data-testid={`target-card-${target.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <div>
              <h3 className="font-medium text-white">{target.metricName}</h3>
              <p className="text-xs text-zinc-500 capitalize">{target.category}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-500 hover:text-red-500"
            onClick={() => deleteMutation.mutate()}
            data-testid={`button-delete-target-${target.id}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-2xl font-bold text-white">
                {target.unit === '$' ? '$' : ''}{target.currentValue.toLocaleString()}{target.unit === '%' ? '%' : ''}
              </div>
              <div className="text-sm text-zinc-400">
                of {target.unit === '$' ? '$' : ''}{target.targetValue.toLocaleString()}{target.unit === '%' ? '%' : ''} target
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-orange-500">{Math.round(progress)}%</div>
            </div>
          </div>
          
          <Progress value={progress} className="h-2 bg-zinc-800" />
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-zinc-400">
              <Calendar className="h-3 w-3" />
              Due: {dueDate.toLocaleDateString()}
            </div>
            {target.status === 'active' && (
              <span className={daysUntilDue < 0 ? 'text-red-400' : daysUntilDue < 7 ? 'text-yellow-400' : 'text-zinc-400'}>
                {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days left`}
              </span>
            )}
            {target.status !== 'active' && (
              <span className={`capitalize ${target.status === 'achieved' ? 'text-green-400' : 'text-red-400'}`}>
                {target.status}
              </span>
            )}
          </div>
          
          {target.notes && (
            <p className="text-xs text-zinc-500 pt-2 border-t border-zinc-800">{target.notes}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CreateTargetDialog({ onCreated }: { onCreated: () => void }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [metricKey, setMetricKey] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const selectedMetric = TARGET_METRIC_OPTIONS.find(m => m.key === metricKey);

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/kpis/targets", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/kpis/targets"] });
      toast({ title: "Target created successfully" });
      setOpen(false);
      setMetricKey('');
      setTargetValue('');
      setDueDate('');
      setNotes('');
      onCreated();
    },
    onError: (error: any) => {
      toast({ title: "Failed to create target", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = () => {
    if (!metricKey || !targetValue || !dueDate) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    createMutation.mutate({
      metricKey,
      metricName: selectedMetric?.name || metricKey,
      category: selectedMetric?.category || 'general',
      targetValue: parseInt(targetValue),
      unit: selectedMetric?.unit || '',
      dueDate: new Date(dueDate).toISOString(),
      notes: notes || null,
      status: 'active',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange-500 hover:bg-orange-600" data-testid="button-create-target">
          <Plus className="h-4 w-4 mr-2" />
          Set New Target
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-white">Set KPI Target</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-zinc-300">Metric</Label>
            <Select value={metricKey} onValueChange={setMetricKey}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white" data-testid="select-metric">
                <SelectValue placeholder="Select a metric" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {TARGET_METRIC_OPTIONS.map(option => (
                  <SelectItem key={option.key} value={option.key} className="text-white">
                    {option.name} ({option.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Target Value</Label>
            <Input
              type="number"
              placeholder={selectedMetric?.unit === '%' ? 'e.g., 80' : 'e.g., 500'}
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              data-testid="input-target-value"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Due Date</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              data-testid="input-due-date"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Notes (optional)</Label>
            <Textarea
              placeholder="Add any context or notes about this target..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              data-testid="input-target-notes"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="border-zinc-700 text-zinc-300">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={createMutation.isPending}
            className="bg-orange-500 hover:bg-orange-600"
            data-testid="button-save-target"
          >
            {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Create Target
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function GoalsManagementContent() {
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

  const { data: targets = [], isLoading: targetsLoading, refetch: refetchTargets } = useQuery<KpiTarget[]>({
    queryKey: ["/api/admin/kpis/targets"],
  });

  const refreshTargetsMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/kpis/targets/refresh"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/kpis/targets"] });
      toast({ title: "Targets refreshed with latest values" });
    },
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

  const activeTargets = targets.filter(t => t.status === 'active');
  const completedTargets = targets.filter(t => t.status !== 'active');
  const avgTargetProgress = activeTargets.length > 0 
    ? activeTargets.reduce((sum, t) => sum + (t.targetValue > 0 ? Math.min((t.currentValue / t.targetValue) * 100, 100) : 0), 0) / activeTargets.length
    : 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Goals</h1>
          <p className="text-zinc-400 mt-1">Set objectives and track progress toward your targets</p>
        </div>

        <Tabs defaultValue="objectives" className="space-y-6">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="objectives" data-testid="tab-objectives">Objectives</TabsTrigger>
            <TabsTrigger value="targets" data-testid="tab-targets">KPI Targets</TabsTrigger>
            <TabsTrigger value="progress" data-testid="tab-progress">Progress View</TabsTrigger>
          </TabsList>

          <TabsContent value="objectives" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 flex-1">
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
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 p-3 bg-zinc-900 border border-zinc-800 rounded-lg flex-1">
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
              <Button
                onClick={() => { resetObjectiveForm(); setEditingObjective(null); setShowObjectiveModal(true); }}
                className="bg-orange-500 hover:bg-orange-600"
                data-testid="button-add-objective"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Objective
              </Button>
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
                                    <div className="flex-1 max-w-xs">
                                      <Progress value={getKRProgress(kr)} className="h-1.5" />
                                    </div>
                                    <span className="text-sm text-zinc-400">
                                      {kr.currentValue} / {kr.targetValue} {kr.unit}
                                    </span>
                                    <span className="text-sm font-medium text-orange-400">
                                      {getKRProgress(kr)}%
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openUpdateKR(kr)}
                                    className="text-green-400 hover:text-green-300 h-8 px-2"
                                  >
                                    <TrendingUp className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditKR(kr)}
                                    className="text-zinc-400 hover:text-white h-8 px-2"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteKRMutation.mutate(kr.id)}
                                    className="text-zinc-400 hover:text-red-400 h-8 px-2"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                          {(!objective.keyResults || objective.keyResults.length === 0) && (
                            <p className="text-sm text-zinc-500 italic">No key results yet. Add one to track progress.</p>
                          )}
                        </div>
                      </CollapsibleContent>
                    </CardContent>
                  </Card>
                </Collapsible>
              ))}

              {filteredObjectives.length === 0 && (
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-8 text-center">
                    <Target className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-400">No objectives found. Create your first objective to get started.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="targets" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">KPI Targets</h2>
                <p className="text-sm text-zinc-400">Set measurable goals with deadlines and track progress</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refreshTargetsMutation.mutate()}
                  disabled={refreshTargetsMutation.isPending}
                  className="border-zinc-700 text-zinc-400 hover:text-white"
                  data-testid="button-refresh-targets"
                >
                  {refreshTargetsMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Sync Values
                </Button>
                <CreateTargetDialog onCreated={() => refreshTargetsMutation.mutate()} />
              </div>
            </div>

            {targetsLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
              </div>
            ) : targets && targets.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeTargets.map(target => (
                    <TargetCard key={target.id} target={target} onRefresh={() => refetchTargets()} />
                  ))}
                </div>

                {completedTargets.length > 0 && (
                  <>
                    <h3 className="text-md font-medium text-zinc-400 mt-6">Completed & Archived</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {completedTargets.map(target => (
                        <TargetCard key={target.id} target={target} onRefresh={() => refetchTargets()} />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-8 text-center">
                  <Target className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-400 mb-4">No targets set yet. Create your first KPI target to track metrics.</p>
                  <CreateTargetDialog onCreated={() => refreshTargetsMutation.mutate()} />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Progress Overview</CardTitle>
                <CardDescription>Visual summary of all objectives and targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-4">
                  <CircularProgress 
                    value={stats?.avgProgress || 0} 
                    size={140} 
                    label="OKR Progress"
                    sublabel={`${stats?.activeObjectives || 0} active objectives`}
                    color="orange"
                  />
                  <CircularProgress 
                    value={avgTargetProgress} 
                    size={140} 
                    label="Target Progress"
                    sublabel={`${activeTargets.length} active targets`}
                    color="blue"
                  />
                  <CircularProgress 
                    value={stats?.totalKeyResults ? ((stats?.onTrackKeyResults || 0) / stats.totalKeyResults) * 100 : 0} 
                    size={140} 
                    label="On Track"
                    sublabel={`${stats?.onTrackKeyResults || 0} of ${stats?.totalKeyResults || 0} KRs`}
                    color="green"
                  />
                  <CircularProgress 
                    value={targets.length ? (completedTargets.filter(t => t.status === 'achieved').length / targets.length) * 100 : 0} 
                    size={140} 
                    label="Targets Achieved"
                    sublabel={`${completedTargets.filter(t => t.status === 'achieved').length} of ${targets.length}`}
                    color="purple"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange-500" />
                    Active Objectives
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {objectives.filter(o => o.status === 'active').slice(0, 5).map(obj => (
                    <div key={obj.id} className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white truncate">{obj.title}</p>
                        <p className="text-xs text-zinc-500">{obj.keyResults?.length || 0} key results</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={obj.progress} className="w-20 h-2" />
                        <span className="text-sm font-medium text-orange-400 w-12 text-right">{obj.progress}%</span>
                      </div>
                    </div>
                  ))}
                  {objectives.filter(o => o.status === 'active').length === 0 && (
                    <p className="text-sm text-zinc-500 text-center py-4">No active objectives</p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Active Targets
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeTargets.slice(0, 5).map(target => {
                    const progress = target.targetValue > 0 ? Math.min((target.currentValue / target.targetValue) * 100, 100) : 0;
                    return (
                      <div key={target.id} className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white truncate">{target.metricName}</p>
                          <p className="text-xs text-zinc-500">{target.currentValue.toLocaleString()} / {target.targetValue.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={progress} className="w-20 h-2" />
                          <span className="text-sm font-medium text-blue-400 w-12 text-right">{Math.round(progress)}%</span>
                        </div>
                      </div>
                    );
                  })}
                  {activeTargets.length === 0 && (
                    <p className="text-sm text-zinc-500 text-center py-4">No active targets</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

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
      </div>
    </AdminLayout>
  );
}

export default function GoalsManagement() {
  return (
    <AdminAuthGuard>
      <GoalsManagementContent />
    </AdminAuthGuard>
  );
}
