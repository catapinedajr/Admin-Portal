import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "../components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  BookOpen, 
  MessageSquare, 
  DollarSign, 
  Target,
  Zap,
  BarChart3,
  Activity,
  Megaphone,
  ShoppingCart,
  Loader2,
  RefreshCw,
  Plus,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Trash2,
  Edit2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useState } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { KpiTarget } from "@shared/schema";

interface KPIData {
  users: {
    total: number;
    active: number;
    activeChange: number;
    newSignups: number;
    signupsChange: number;
    avgStreak: number;
  };
  engagement: {
    lessonCompletionRate: number;
    totalDaysCompleted: number;
    avgLessonsPerUser: number;
  };
  content: {
    totalDays: number;
    totalQuestions: number;
    totalLessons: number;
    coveragePercent: number;
  };
  community: {
    totalPosts: number;
    totalReplies: number;
    weeklyPosts: number;
    engagementRate: number;
  };
  marketing: {
    activeCampaigns: number;
    totalImpressions: number;
    totalClicks: number;
    ctr: number;
  };
  revenue: {
    totalOrders: number;
    totalRevenue: number;
    monthlyRevenue: number;
    avgOrderValue: number;
  };
  product: {
    totalIdeas: number;
    completedIdeas: number;
    completionRate: number;
    totalReleases: number;
  };
}

interface TrendData {
  date: string;
  signups: number;
  completions: number;
  forumPosts: number;
}

const METRIC_OPTIONS = [
  { key: 'users.total', name: 'Total Users', category: 'users', unit: 'users' },
  { key: 'users.active', name: 'Active Users (7d)', category: 'users', unit: 'users' },
  { key: 'engagement.lessonCompletionRate', name: 'Lesson Completion Rate', category: 'engagement', unit: '%' },
  { key: 'content.coverage', name: 'Content Coverage', category: 'content', unit: '%' },
  { key: 'community.totalPosts', name: 'Community Posts', category: 'community', unit: 'posts' },
  { key: 'revenue.monthly', name: 'Monthly Revenue', category: 'revenue', unit: '$' },
  { key: 'product.completedIdeas', name: 'Completed Ideas', category: 'product', unit: 'ideas' },
];

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

  const selectedMetric = METRIC_OPTIONS.find(m => m.key === metricKey);

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
                {METRIC_OPTIONS.map(option => (
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
            {selectedMetric && (
              <p className="text-xs text-zinc-500">
                Target in {selectedMetric.unit}
              </p>
            )}
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

function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const { data: admin, isLoading } = useQuery({
    queryKey: ["/api/admin/me"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!admin) {
    setLocation("/admin/login");
    return null;
  }

  return <>{children}</>;
}

function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  suffix = "",
  description 
}: { 
  title: string; 
  value: number | string; 
  change?: number; 
  icon: any; 
  suffix?: string;
  description?: string;
}) {
  const isPositive = change !== undefined && change >= 0;
  
  return (
    <Card className="bg-zinc-900 border-zinc-800" data-testid={`metric-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400">{title}</CardTitle>
        <Icon className="h-4 w-4 text-orange-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </div>
        {change !== undefined && (
          <p className={`text-xs flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {isPositive ? '+' : ''}{change}% vs last week
          </p>
        )}
        {description && (
          <p className="text-xs text-zinc-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

function KPIDashboardContent() {
  const [trendDays, setTrendDays] = useState(30);

  const { data: kpis, isLoading: kpisLoading, refetch: refetchKpis } = useQuery<KPIData>({
    queryKey: ["/api/admin/kpis"],
    refetchInterval: 60000,
  });

  const { data: trends, isLoading: trendsLoading } = useQuery<TrendData[]>({
    queryKey: ["/api/admin/kpis/trends", trendDays],
  });

  const { data: targets, isLoading: targetsLoading, refetch: refetchTargets } = useQuery<KpiTarget[]>({
    queryKey: ["/api/admin/kpis/targets"],
  });

  const refreshTargetsMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/kpis/targets/refresh"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/kpis/targets"] });
      toast({ title: "Targets refreshed with latest values" });
    },
  });

  const { toast } = useToast();

  if (kpisLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white" data-testid="heading-kpi-dashboard">KPI Dashboard</h1>
            <p className="text-zinc-400">Real-time metrics from your database</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetchKpis()}
            className="border-zinc-700 text-zinc-400 hover:text-white"
            data-testid="button-refresh-kpis"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="targets" data-testid="tab-targets">Targets</TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-users">Users</TabsTrigger>
            <TabsTrigger value="engagement" data-testid="tab-engagement">Engagement</TabsTrigger>
            <TabsTrigger value="business" data-testid="tab-business">Business</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                title="Total Users" 
                value={kpis?.users.total || 0} 
                icon={Users} 
              />
              <MetricCard 
                title="Active Users (7d)" 
                value={kpis?.users.active || 0} 
                change={kpis?.users.activeChange}
                icon={Activity} 
              />
              <MetricCard 
                title="New Signups" 
                value={kpis?.users.newSignups || 0} 
                change={kpis?.users.signupsChange}
                icon={TrendingUp} 
              />
              <MetricCard 
                title="Avg Streak" 
                value={kpis?.users.avgStreak || 0} 
                suffix=" days"
                icon={Zap} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                title="Lesson Completion" 
                value={kpis?.engagement.lessonCompletionRate || 0} 
                suffix="%"
                icon={BookOpen}
                description="Users who completed 1+ lessons"
              />
              <MetricCard 
                title="Community Posts" 
                value={kpis?.community.totalPosts || 0} 
                icon={MessageSquare}
                description={`${kpis?.community.weeklyPosts || 0} this week`}
              />
              <MetricCard 
                title="Monthly Revenue" 
                value={`$${kpis?.revenue.monthlyRevenue?.toFixed(2) || '0.00'}`} 
                icon={DollarSign} 
              />
              <MetricCard 
                title="Content Coverage" 
                value={kpis?.content.coveragePercent || 0} 
                suffix="%"
                icon={Target}
                description={`${kpis?.content.totalDays || 0}/180 days`}
              />
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Activity Trends</CardTitle>
                <CardDescription>Daily signups, completions, and community activity</CardDescription>
              </CardHeader>
              <CardContent>
                {trendsLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={trends || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#71717a" 
                        fontSize={12}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis stroke="#71717a" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="signups" stroke="#f97316" fill="#f9731633" name="Signups" />
                      <Area type="monotone" dataKey="completions" stroke="#22c55e" fill="#22c55e33" name="Day Completions" />
                      <Area type="monotone" dataKey="forumPosts" stroke="#3b82f6" fill="#3b82f633" name="Forum Posts" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
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
                  {targets.filter(t => t.status === 'active').map(target => (
                    <TargetCard key={target.id} target={target} onRefresh={() => refetchTargets()} />
                  ))}
                </div>

                {targets.filter(t => t.status !== 'active').length > 0 && (
                  <>
                    <h3 className="text-md font-medium text-zinc-400 mt-6">Completed & Archived</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {targets.filter(t => t.status !== 'active').map(target => (
                        <TargetCard key={target.id} target={target} onRefresh={() => refetchTargets()} />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-12 text-center">
                  <Target className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No targets set</h3>
                  <p className="text-zinc-400 mb-4">Create your first KPI target to start tracking progress toward your goals.</p>
                  <CreateTargetDialog onCreated={() => refreshTargetsMutation.mutate()} />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <MetricCard 
                title="Total Users" 
                value={kpis?.users.total || 0} 
                icon={Users} 
              />
              <MetricCard 
                title="Active Users (7d)" 
                value={kpis?.users.active || 0} 
                change={kpis?.users.activeChange}
                icon={Activity} 
              />
              <MetricCard 
                title="New Signups This Week" 
                value={kpis?.users.newSignups || 0} 
                change={kpis?.users.signupsChange}
                icon={TrendingUp} 
              />
              <MetricCard 
                title="Average Streak" 
                value={kpis?.users.avgStreak || 0} 
                suffix=" days"
                icon={Zap} 
              />
              <MetricCard 
                title="Activation Rate" 
                value={kpis?.engagement.lessonCompletionRate || 0} 
                suffix="%"
                icon={Target}
                description="Users who started learning"
              />
              <MetricCard 
                title="Avg Lessons/User" 
                value={kpis?.engagement.avgLessonsPerUser || 0} 
                icon={BookOpen} 
              />
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">User Retention Indicators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Active Rate</span>
                    <span className="text-white">
                      {kpis?.users.total ? Math.round((kpis.users.active / kpis.users.total) * 100) : 0}%
                    </span>
                  </div>
                  <Progress 
                    value={kpis?.users.total ? (kpis.users.active / kpis.users.total) * 100 : 0} 
                    className="h-2 bg-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Lesson Completion Rate</span>
                    <span className="text-white">{kpis?.engagement.lessonCompletionRate || 0}%</span>
                  </div>
                  <Progress 
                    value={kpis?.engagement.lessonCompletionRate || 0} 
                    className="h-2 bg-zinc-800"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <MetricCard 
                title="Total Days Completed" 
                value={kpis?.engagement.totalDaysCompleted || 0} 
                icon={BookOpen} 
              />
              <MetricCard 
                title="Lesson Completion Rate" 
                value={kpis?.engagement.lessonCompletionRate || 0} 
                suffix="%"
                icon={Target} 
              />
              <MetricCard 
                title="Avg Lessons Per User" 
                value={kpis?.engagement.avgLessonsPerUser || 0} 
                icon={BarChart3} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Community Engagement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{kpis?.community.totalPosts || 0}</div>
                      <div className="text-sm text-zinc-400">Total Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{kpis?.community.totalReplies || 0}</div>
                      <div className="text-sm text-zinc-400">Total Replies</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-zinc-800">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Weekly Posts</span>
                      <span className="text-lg font-semibold text-orange-500">{kpis?.community.weeklyPosts || 0}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-zinc-400">Engagement Rate</span>
                      <span className="text-lg font-semibold text-orange-500">{kpis?.community.engagementRate || 0}x</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Content Coverage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-500">{kpis?.content.coveragePercent || 0}%</div>
                    <div className="text-sm text-zinc-400">of 180-day curriculum</div>
                  </div>
                  <Progress 
                    value={kpis?.content.coveragePercent || 0} 
                    className="h-3 bg-zinc-800"
                  />
                  <div className="grid grid-cols-3 gap-2 text-center pt-4">
                    <div>
                      <div className="text-xl font-bold text-white">{kpis?.content.totalDays || 0}</div>
                      <div className="text-xs text-zinc-400">Days</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">{kpis?.content.totalLessons || 0}</div>
                      <div className="text-xs text-zinc-400">Lessons</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">{kpis?.content.totalQuestions || 0}</div>
                      <div className="text-xs text-zinc-400">Questions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                title="Total Revenue" 
                value={`$${kpis?.revenue.totalRevenue?.toFixed(2) || '0.00'}`} 
                icon={DollarSign} 
              />
              <MetricCard 
                title="Monthly Revenue" 
                value={`$${kpis?.revenue.monthlyRevenue?.toFixed(2) || '0.00'}`} 
                icon={DollarSign} 
              />
              <MetricCard 
                title="Total Orders" 
                value={kpis?.revenue.totalOrders || 0} 
                icon={ShoppingCart} 
              />
              <MetricCard 
                title="Avg Order Value" 
                value={`$${kpis?.revenue.avgOrderValue?.toFixed(2) || '0.00'}`} 
                icon={BarChart3} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Marketing Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{kpis?.marketing.activeCampaigns || 0}</div>
                      <div className="text-sm text-zinc-400">Active Campaigns</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-500">{kpis?.marketing.ctr || 0}%</div>
                      <div className="text-sm text-zinc-400">Click-Through Rate</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-zinc-800 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-zinc-400">Total Impressions</div>
                      <div className="text-xl font-bold text-white">{(kpis?.marketing.totalImpressions || 0).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-zinc-400">Total Clicks</div>
                      <div className="text-xl font-bold text-white">{(kpis?.marketing.totalClicks || 0).toLocaleString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Product Development</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{kpis?.product.totalIdeas || 0}</div>
                      <div className="text-sm text-zinc-400">Total Ideas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-500">{kpis?.product.completedIdeas || 0}</div>
                      <div className="text-sm text-zinc-400">Completed</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-zinc-800">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Completion Rate</span>
                      <span className="text-lg font-semibold text-white">{kpis?.product.completionRate || 0}%</span>
                    </div>
                    <Progress 
                      value={kpis?.product.completionRate || 0} 
                      className="h-2 bg-zinc-800 mt-2"
                    />
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-zinc-400">Total Releases</span>
                      <span className="text-lg font-semibold text-orange-500">{kpis?.product.totalReleases || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

export default function KPIDashboard() {
  return (
    <AdminAuthGuard>
      <KPIDashboardContent />
    </AdminAuthGuard>
  );
}
