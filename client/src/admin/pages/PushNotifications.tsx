import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Bell, Send, Smartphone, Users, Plus, Trash2, 
  RefreshCw, AlertCircle, CheckCircle, Clock, TrendingUp,
  FileText, Sparkles, Edit, Eye, Copy
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface PushStats {
  total: number;
  ios: number;
  android: number;
  active: number;
  snsConfigured: boolean;
  recentNotifications: number;
}

interface PushNotification {
  id: number;
  title: string;
  body: string;
  data: any;
  targetAudience: string;
  targetUserIds: number[] | null;
  status: string;
  scheduledFor: string | null;
  sentAt: string | null;
  sentCount: number;
  failedCount: number;
  createdBy: number | null;
  createdAt: string;
  updatedAt: string;
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { color: string; label: string }> = {
    draft: { color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30', label: 'Draft' },
    scheduled: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Scheduled' },
    sending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Sending' },
    sent: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Sent' },
    failed: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Failed' },
    approved: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Approved' },
    archived: { color: 'bg-zinc-600/20 text-zinc-500 border-zinc-600/30', label: 'Archived' },
  };
  
  const variant = variants[status] || variants.draft;
  
  return (
    <Badge className={`${variant.color} border`}>
      {variant.label}
    </Badge>
  );
}

interface NotificationTemplate {
  id: number;
  name: string;
  category: string;
  title: string;
  body: string;
  placeholders: string[] | null;
  status: string;
  priority: number;
  minStreakDays: number | null;
  maxStreakDays: number | null;
  stuckTier: string | null;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  { value: 'morning_spark', label: 'Morning Spark', description: 'Daily lesson teaser sent each morning' },
  { value: 'streak_coach', label: 'Streak Coach', description: 'Motivation for users with active streaks' },
  { value: 'reengagement_soft', label: 'Re-engage (3-7 days)', description: 'Gentle nudge for users idle 3-7 days' },
  { value: 'reengagement_medium', label: 'Re-engage (7-14 days)', description: 'Stronger message for users idle 7-14 days' },
  { value: 'reengagement_hard', label: 'Re-engage (14+ days)', description: 'Last-chance message for users idle 14+ days' },
  { value: 'price_alert', label: 'Price Alert', description: 'BTC price movements tied to education' },
  { value: 'milestone', label: 'Milestone', description: 'Achievement and learning milestone celebrations' },
];

const PLACEHOLDERS = [
  { name: 'firstName', description: "User's first name" },
  { name: 'currentStreak', description: 'Current streak in days' },
  { name: 'lessonTitle', description: 'Current lesson title' },
  { name: 'btcPrice', description: 'Current Bitcoin price' },
  { name: 'dayNumber', description: 'Curriculum day number' },
];

interface QuestionPreview {
  dayIndex: number;
  dayTitle: string;
  questions: Array<{
    slot: 'morning' | 'noon' | 'evening';
    title: string;
    content: string;
    category: string;
  }>;
}

interface ActiveUsersResponse {
  count: number;
  users: Array<{
    userId: number;
    firstName: string;
    currentDay: number;
    currentStreak: number;
  }>;
}

interface HybridResult {
  activeUsers: { processed: number; sent: number; failed: number };
  lapsedUsers: { processed: number; sent: number; failed: number };
}

function QuestionSchedulerTab() {
  const { toast } = useToast();
  const [previewDay, setPreviewDay] = useState('1');
  const [selectedSlot, setSelectedSlot] = useState<'morning' | 'noon' | 'evening'>('morning');

  const { data: activeUsersData, isLoading: activeUsersLoading, refetch: refetchActiveUsers } = useQuery<ActiveUsersResponse>({
    queryKey: ['/api/admin/notification-scheduler/active-users-count'],
  });

  const { data: previewData, isLoading: previewLoading, refetch: refetchPreview } = useQuery<QuestionPreview>({
    queryKey: [`/api/admin/notification-scheduler/preview-questions/${previewDay}`],
    enabled: !!previewDay,
  });

  const runHybridMutation = useMutation({
    mutationFn: async (slot: 'morning' | 'noon' | 'evening') => {
      return apiRequest('POST', '/api/admin/notification-scheduler/run-hybrid', { slot });
    },
    onSuccess: async (response: Response) => {
      const result: HybridResult = await response.json();
      toast({ 
        title: "Hybrid Scheduler Complete",
        description: `Active: ${result.activeUsers.sent}/${result.activeUsers.processed} sent. Lapsed: ${result.lapsedUsers.sent}/${result.lapsedUsers.processed} sent.`
      });
      refetchActiveUsers();
    },
    onError: () => {
      toast({ title: "Failed to run scheduler", variant: "destructive" });
    },
  });

  const runQuestionsMutation = useMutation({
    mutationFn: async (slot: 'morning' | 'noon' | 'evening') => {
      return apiRequest('POST', '/api/admin/notification-scheduler/run-questions', { slot });
    },
    onSuccess: async (response: Response) => {
      const result = await response.json();
      toast({ 
        title: "Questions Sent",
        description: `${result.sent}/${result.processed} notifications sent`
      });
      refetchActiveUsers();
    },
    onError: () => {
      toast({ title: "Failed to send questions", variant: "destructive" });
    },
  });

  const slotInfo = {
    morning: { label: 'Morning (8am)', icon: '☀️', description: 'First question of the day' },
    noon: { label: 'Noon (12pm)', icon: '🌤️', description: 'Midday check-in question' },
    evening: { label: 'Evening (6pm)', icon: '🌙', description: 'End of day question' },
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border-orange-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-orange-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-400">Hybrid Notification System</h3>
              <p className="text-zinc-400 text-sm mt-1">
                Send the 3 daily set-up questions to active users at 3 times per day. 
                Lapsed users (7+ days inactive) receive re-engagement templates instead.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-400">Active Users</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {activeUsersLoading ? '...' : activeUsersData?.count || 0}
                </p>
                <p className="text-xs text-zinc-500 mt-1">Idle less than 7 days</p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-500/20 text-green-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-400">Notifications/Day</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {activeUsersLoading ? '...' : (activeUsersData?.count || 0) * 3}
                </p>
                <p className="text-xs text-zinc-500 mt-1">3 questions × active users</p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-500/20 text-orange-400">
                <Bell className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-400">Time Slots</p>
                <p className="text-2xl font-bold text-white mt-1">3</p>
                <p className="text-xs text-zinc-500 mt-1">8am, 12pm, 6pm</p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500/20 text-blue-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-800/50 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Preview Questions by Day
          </CardTitle>
          <CardDescription>
            See which set-up questions will be sent for any curriculum day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Label className="text-zinc-400">Day:</Label>
              <Input
                type="number"
                min={1}
                max={336}
                value={previewDay}
                onChange={(e) => setPreviewDay(e.target.value)}
                className="w-20 bg-zinc-900 border-zinc-700"
              />
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => refetchPreview()}
              disabled={previewLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${previewLoading ? 'animate-spin' : ''}`} />
              Preview
            </Button>
          </div>

          {previewData && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-zinc-400">Day {previewData.dayIndex}:</span>
                <span className="text-white font-medium">{previewData.dayTitle}</span>
              </div>
              
              {previewData.questions.length > 0 ? (
                <div className="grid gap-3">
                  {previewData.questions.map((q, i) => (
                    <div key={i} className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-700">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{slotInfo[q.slot].icon}</span>
                        <span className="text-sm font-medium text-zinc-300">{slotInfo[q.slot].label}</span>
                        <Badge className="bg-zinc-700 text-xs">{q.category}</Badge>
                      </div>
                      <p className="text-orange-400 font-medium">{q.title}</p>
                      <p className="text-zinc-400 text-sm mt-1">{q.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-zinc-900/30 rounded-lg border border-zinc-700 text-center">
                  <AlertCircle className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
                  <p className="text-zinc-400">No set-up questions found for this day</p>
                  <p className="text-zinc-500 text-sm mt-1">Add questions in Content Management</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-zinc-800/50 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Send className="w-5 h-5" />
            Manual Trigger
          </CardTitle>
          <CardDescription>
            Manually send question notifications for a specific time slot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['morning', 'noon', 'evening'] as const).map(slot => (
              <div key={slot} className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{slotInfo[slot].icon}</span>
                  <div>
                    <p className="font-medium text-white">{slotInfo[slot].label}</p>
                    <p className="text-xs text-zinc-500">{slotInfo[slot].description}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => runQuestionsMutation.mutate(slot)}
                    disabled={runQuestionsMutation.isPending}
                  >
                    Questions Only
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() => runHybridMutation.mutate(slot)}
                    disabled={runHybridMutation.isPending}
                  >
                    Full Hybrid
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-4">
            "Questions Only" sends set-up questions to active users. 
            "Full Hybrid" also sends re-engagement templates to lapsed users (morning slot only).
          </p>
        </CardContent>
      </Card>

      {activeUsersData && activeUsersData.users.length > 0 && (
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white text-base">Sample Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {activeUsersData.users.map(user => (
                <div key={user.userId} className="p-2 bg-zinc-900/50 rounded border border-zinc-700 text-center">
                  <p className="text-white text-sm font-medium">{user.firstName}</p>
                  <p className="text-xs text-zinc-500">Day {user.currentDay}</p>
                  <p className="text-xs text-orange-400">{user.currentStreak}🔥</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PushNotificationsContent() {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [newNotification, setNewNotification] = useState({
    title: '',
    body: '',
    targetAudience: 'all',
  });
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: 'morning_spark',
    title: '',
    body: '',
    status: 'draft',
  });
  const [generateCategory, setGenerateCategory] = useState('morning_spark');
  const [generateContext, setGenerateContext] = useState('');
  
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery<PushStats>({
    queryKey: ['/api/admin/push-notifications/stats'],
  });
  
  const { data: notifications = [], isLoading: notificationsLoading, refetch: refetchNotifications } = useQuery<PushNotification[]>({
    queryKey: ['/api/admin/push-notifications'],
  });
  
  const { data: templates = [], isLoading: templatesLoading, refetch: refetchTemplates } = useQuery<NotificationTemplate[]>({
    queryKey: ['/api/admin/notification-templates'],
  });
  
  const createMutation = useMutation({
    mutationFn: async (data: typeof newNotification) => {
      return apiRequest('POST', '/api/admin/push-notifications', data);
    },
    onSuccess: () => {
      toast({ title: "Notification created" });
      setShowCreateDialog(false);
      setNewNotification({ title: '', body: '', targetAudience: 'all' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/push-notifications'] });
    },
    onError: () => {
      toast({ title: "Failed to create notification", variant: "destructive" });
    },
  });
  
  const sendMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('POST', `/api/admin/push-notifications/${id}/send`);
    },
    onSuccess: (response: any) => {
      toast({ title: `Sent to ${response.sent} devices` });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/push-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/push-notifications/stats'] });
    },
    onError: () => {
      toast({ title: "Failed to send notification", variant: "destructive" });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/admin/push-notifications/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Notification deleted" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/push-notifications'] });
    },
    onError: () => {
      toast({ title: "Failed to delete notification", variant: "destructive" });
    },
  });
  
  const createTemplateMutation = useMutation({
    mutationFn: async (data: typeof newTemplate) => {
      return apiRequest('POST', '/api/admin/notification-templates', data);
    },
    onSuccess: () => {
      toast({ title: "Template created" });
      setShowTemplateDialog(false);
      setNewTemplate({ name: '', category: 'morning_spark', title: '', body: '', status: 'draft' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notification-templates'] });
    },
    onError: () => {
      toast({ title: "Failed to create template", variant: "destructive" });
    },
  });
  
  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<typeof newTemplate>) => {
      return apiRequest('PATCH', `/api/admin/notification-templates/${id}`, data);
    },
    onSuccess: () => {
      toast({ title: "Template updated" });
      setEditingTemplate(null);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notification-templates'] });
    },
    onError: () => {
      toast({ title: "Failed to update template", variant: "destructive" });
    },
  });
  
  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/admin/notification-templates/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Template deleted" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notification-templates'] });
    },
    onError: () => {
      toast({ title: "Failed to delete template", variant: "destructive" });
    },
  });
  
  const generateMutation = useMutation({
    mutationFn: async (data: { category: string; context?: string }) => {
      return apiRequest('POST', '/api/admin/notification-templates/generate', data);
    },
    onSuccess: (response: any) => {
      toast({ title: `Generated ${response.templates?.length || 0} templates` });
      setShowGenerateDialog(false);
    },
    onError: () => {
      toast({ title: "Failed to generate templates", variant: "destructive" });
    },
  });
  
  const handleRefresh = () => {
    refetchStats();
    refetchNotifications();
    refetchTemplates();
  };
  
  const handleSaveGeneratedTemplate = async (template: { name: string; title: string; body: string; placeholders: string[] }) => {
    await createTemplateMutation.mutateAsync({
      name: template.name,
      category: generateCategory,
      title: template.title,
      body: template.body,
      status: 'draft',
    });
  };
  
  const getCategoryLabel = (category: string) => {
    return CATEGORIES.find(c => c.value === category)?.label || category;
  };
  
  const renderPlaceholderPreview = (text: string) => {
    return text.replace(/\{\{(\w+)\}\}/g, (match, name) => {
      const examples: Record<string, string> = {
        firstName: 'Alex',
        currentStreak: '14',
        lessonTitle: 'Why Bitcoin Matters',
        btcPrice: '$97,250',
        dayNumber: '23',
      };
      return examples[name] || match;
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Push Notifications</h1>
          <p className="text-zinc-400 mt-1">Send notifications and manage automated templates</p>
        </div>
        <Button variant="outline" onClick={handleRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <Tabs defaultValue="send" className="w-full">
        <TabsList className="bg-zinc-800/50 border border-zinc-700 p-1 mb-6">
          <TabsTrigger value="send" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            <Send className="w-4 h-4 mr-2" />
            Send
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            <FileText className="w-4 h-4 mr-2" />
            Templates ({templates.length})
          </TabsTrigger>
          <TabsTrigger value="questions" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            <Sparkles className="w-4 h-4 mr-2" />
            Question Scheduler
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="send" className="space-y-6">
          <div className="flex justify-end">
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Notification
            </Button>
          </div>
          
          {!stats?.snsConfigured && (
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-400">AWS SNS Not Configured</h3>
              <p className="text-zinc-400 text-sm mt-1">
                To send push notifications, configure these environment variables:
              </p>
              <ul className="text-zinc-500 text-sm mt-2 space-y-1">
                <li>AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY</li>
                <li>AWS_SNS_IOS_PLATFORM_ARN (for iOS via APNs)</li>
                <li>AWS_SNS_ANDROID_PLATFORM_ARN (for Android via FCM)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-400">Total Devices</p>
                <p className="text-2xl font-bold text-white mt-1">{stats?.total || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500/20 text-blue-400">
                <Smartphone className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-400">iOS Devices</p>
                <p className="text-2xl font-bold text-white mt-1">{stats?.ios || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-zinc-500/20 text-zinc-400">
                <Smartphone className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-400">Android Devices</p>
                <p className="text-2xl font-bold text-white mt-1">{stats?.android || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-500/20 text-green-400">
                <Smartphone className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-400">Active Tokens</p>
                <p className="text-2xl font-bold text-white mt-1">{stats?.active || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-500/20 text-orange-400">
                <Bell className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-zinc-800/50 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white">Notification History</CardTitle>
          <CardDescription>All push notifications sent from this admin portal</CardDescription>
        </CardHeader>
        <CardContent>
          {notificationsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 mx-auto text-zinc-600 mb-4" />
              <h3 className="text-lg font-semibold text-white">No Notifications Yet</h3>
              <p className="text-zinc-400 mt-1">Create your first push notification to engage users</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map(notification => (
                <Card key={notification.id} className="bg-zinc-900/50 border-zinc-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-white">{notification.title}</h3>
                          <StatusBadge status={notification.status} />
                          <Badge className="bg-zinc-700">{notification.targetAudience}</Badge>
                        </div>
                        <p className="text-zinc-400 text-sm line-clamp-2">{notification.body}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                          <span>{new Date(notification.createdAt).toLocaleString()}</span>
                          {notification.sentCount > 0 && (
                            <span className="text-green-400">
                              <CheckCircle className="w-3 h-3 inline mr-1" />
                              {notification.sentCount} sent
                            </span>
                          )}
                          {notification.failedCount > 0 && (
                            <span className="text-red-400">
                              {notification.failedCount} failed
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {notification.status === 'draft' && (
                          <Button 
                            size="sm" 
                            className="bg-orange-500 hover:bg-orange-600"
                            onClick={() => sendMutation.mutate(notification.id)}
                            disabled={sendMutation.isPending || !stats?.snsConfigured}
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Send
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-400"
                          onClick={() => deleteMutation.mutate(notification.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-zinc-400">Reusable templates for automated notifications</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowGenerateDialog(true)}>
                <Sparkles className="w-4 h-4 mr-2" />
                AI Generate
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setShowTemplateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </Button>
            </div>
          </div>
          
          <div className="grid gap-4">
            {CATEGORIES.map(category => {
              const categoryTemplates = templates.filter(t => t.category === category.value);
              if (categoryTemplates.length === 0) return null;
              
              return (
                <Card key={category.value} className="bg-zinc-800/50 border-zinc-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-white flex items-center gap-2">
                      {category.label}
                      <Badge className="bg-zinc-700 text-xs">{categoryTemplates.length}</Badge>
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {categoryTemplates.map(template => (
                      <div key={template.id} className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-700">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-white text-sm">{template.name}</span>
                              <StatusBadge status={template.status} />
                            </div>
                            <p className="text-orange-400 text-sm font-medium">{template.title}</p>
                            <p className="text-zinc-400 text-xs mt-1 line-clamp-2">{template.body}</p>
                            <div className="mt-2 p-2 bg-zinc-800 rounded text-xs">
                              <p className="text-zinc-500 mb-1">Preview:</p>
                              <p className="text-green-400">{renderPlaceholderPreview(template.title)}</p>
                              <p className="text-zinc-300">{renderPlaceholderPreview(template.body)}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => updateTemplateMutation.mutate({ 
                                id: template.id, 
                                status: template.status === 'approved' ? 'draft' : 'approved' 
                              })}
                            >
                              {template.status === 'approved' ? 'Unapprove' : 'Approve'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-red-400"
                              onClick={() => deleteTemplateMutation.mutate(template.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
            
            {templates.length === 0 && (
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="py-12 text-center">
                  <FileText className="w-12 h-12 mx-auto text-zinc-600 mb-4" />
                  <h3 className="text-lg font-semibold text-white">No Templates Yet</h3>
                  <p className="text-zinc-400 mt-1">Create templates for automated notifications</p>
                  <div className="flex gap-2 justify-center mt-4">
                    <Button variant="outline" onClick={() => setShowGenerateDialog(true)}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Generate
                    </Button>
                    <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setShowTemplateDialog(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Manually
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <QuestionSchedulerTab />
        </TabsContent>
      </Tabs>
      
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-zinc-900 border-zinc-700">
          <DialogHeader>
            <DialogTitle className="text-white">Create Push Notification</DialogTitle>
            <DialogDescription>
              Compose a notification to send to mobile app users
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-zinc-400">Title</Label>
              <Input
                value={newNotification.title}
                onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                placeholder="Notification title"
                className="bg-zinc-800 border-zinc-700 mt-1"
              />
            </div>
            <div>
              <Label className="text-zinc-400">Body</Label>
              <Textarea
                value={newNotification.body}
                onChange={(e) => setNewNotification({ ...newNotification, body: e.target.value })}
                placeholder="Notification message..."
                className="bg-zinc-800 border-zinc-700 mt-1"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-zinc-400">Target Audience</Label>
              <Select 
                value={newNotification.targetAudience} 
                onValueChange={(value) => setNewNotification({ ...newNotification, targetAudience: value })}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="ios">iOS Only</SelectItem>
                  <SelectItem value="android">Android Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => createMutation.mutate(newNotification)}
              disabled={!newNotification.title || !newNotification.body || createMutation.isPending}
            >
              Create Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="bg-zinc-900 border-zinc-700">
          <DialogHeader>
            <DialogTitle className="text-white">Create Template</DialogTitle>
            <DialogDescription>
              Create a reusable notification template with placeholders
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-zinc-400">Template Name</Label>
              <Input
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                placeholder="e.g., Morning Spark - Price Hook"
                className="bg-zinc-800 border-zinc-700 mt-1"
              />
            </div>
            <div>
              <Label className="text-zinc-400">Category</Label>
              <Select 
                value={newTemplate.category} 
                onValueChange={(value) => setNewTemplate({ ...newTemplate, category: value })}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-zinc-400">Title (with placeholders)</Label>
              <Input
                value={newTemplate.title}
                onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                placeholder="e.g., Hey {{firstName}}, your streak is on fire!"
                className="bg-zinc-800 border-zinc-700 mt-1"
              />
            </div>
            <div>
              <Label className="text-zinc-400">Body (with placeholders)</Label>
              <Textarea
                value={newTemplate.body}
                onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                placeholder="e.g., Day {{dayNumber}} awaits - {{lessonTitle}}"
                className="bg-zinc-800 border-zinc-700 mt-1"
                rows={3}
              />
            </div>
            <div className="p-3 bg-zinc-800 rounded-lg">
              <p className="text-xs text-zinc-500 mb-2">Available placeholders:</p>
              <div className="flex flex-wrap gap-2">
                {PLACEHOLDERS.map(p => (
                  <Badge key={p.name} className="bg-zinc-700 text-xs cursor-pointer" 
                    onClick={() => setNewTemplate({ ...newTemplate, body: newTemplate.body + `{{${p.name}}}` })}>
                    {`{{${p.name}}}`}
                  </Badge>
                ))}
              </div>
            </div>
            {(newTemplate.title || newTemplate.body) && (
              <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <p className="text-xs text-zinc-500 mb-1">Preview:</p>
                <p className="text-green-400 text-sm">{renderPlaceholderPreview(newTemplate.title)}</p>
                <p className="text-zinc-300 text-sm">{renderPlaceholderPreview(newTemplate.body)}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowTemplateDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => createTemplateMutation.mutate(newTemplate)}
              disabled={!newTemplate.name || !newTemplate.title || !newTemplate.body || createTemplateMutation.isPending}
            >
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent className="bg-zinc-900 border-zinc-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-400" />
              AI Generate Templates
            </DialogTitle>
            <DialogDescription>
              Use AI to draft notification templates - you'll review and save the ones you like
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-zinc-400">Category</Label>
              <Select value={generateCategory} onValueChange={setGenerateCategory}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-zinc-400">Additional Context (optional)</Label>
              <Textarea
                value={generateContext}
                onChange={(e) => setGenerateContext(e.target.value)}
                placeholder="e.g., Focus on scarcity messaging, or emphasize price momentum"
                className="bg-zinc-800 border-zinc-700 mt-1"
                rows={2}
              />
            </div>
            
            {generateMutation.data?.templates && (
              <div className="space-y-3 mt-4">
                <p className="text-sm text-zinc-400">Generated templates - click to save:</p>
                {generateMutation.data.templates.map((t: any, i: number) => (
                  <div key={i} className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{t.name}</p>
                        <p className="text-orange-400 text-sm mt-1">{t.title}</p>
                        <p className="text-zinc-400 text-xs mt-1">{t.body}</p>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleSaveGeneratedTemplate(t)}
                        disabled={createTemplateMutation.isPending}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => {
              setShowGenerateDialog(false);
              generateMutation.reset();
            }}>
              Close
            </Button>
            <Button 
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => generateMutation.mutate({ category: generateCategory, context: generateContext })}
              disabled={generateMutation.isPending}
            >
              {generateMutation.isPending ? 'Generating...' : 'Generate 3 Templates'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function PushNotifications() {
  return (
    <AdminAuthGuard>
      <AdminLayout>
        <PushNotificationsContent />
      </AdminLayout>
    </AdminAuthGuard>
  );
}
