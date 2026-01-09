import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Bell, Send, Smartphone, Users, Plus, Trash2, 
  RefreshCw, AlertCircle, CheckCircle, Clock, TrendingUp
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
  };
  
  const variant = variants[status] || variants.draft;
  
  return (
    <Badge className={`${variant.color} border`}>
      {variant.label}
    </Badge>
  );
}

function PushNotificationsContent() {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    body: '',
    targetAudience: 'all',
  });
  
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery<PushStats>({
    queryKey: ['/api/admin/push-notifications/stats'],
  });
  
  const { data: notifications = [], isLoading: notificationsLoading, refetch: refetchNotifications } = useQuery<PushNotification[]>({
    queryKey: ['/api/admin/push-notifications'],
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
  
  const handleRefresh = () => {
    refetchStats();
    refetchNotifications();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Push Notifications</h1>
          <p className="text-zinc-400 mt-1">Send notifications to mobile app users</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Notification
          </Button>
        </div>
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
