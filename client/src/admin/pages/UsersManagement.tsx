import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Users, UserCheck, UserX, Crown, Clock, TrendingUp,
  Search, Filter, ChevronRight, Calendar, Activity,
  Mail, Award, Flame, BookOpen, Archive, Gift, Share2
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  currentStreak: number;
  longestStreak: number;
  completedLessons: number;
  lastActivityDate: string | null;
  createdAt: string;
  subscriptionStatus?: string;
  subscriptionTier?: string;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  paidUsers: number;
  freeUsers: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  averageStreak: number;
  averageCompletedLessons: number;
}

function StatsCard({ title, value, subtitle, icon: Icon, trend }: { 
  title: string; 
  value: string | number; 
  subtitle?: string;
  icon: any;
  trend?: { value: number; positive: boolean };
}) {
  return (
    <Card className="bg-zinc-800/50 border-zinc-700">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-zinc-400">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
            {subtitle && <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>}
            {trend && (
              <div className={`flex items-center gap-1 mt-1 text-xs ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
                <TrendingUp className={`w-3 h-3 ${!trend.positive && 'rotate-180'}`} />
                <span>{trend.positive ? '+' : ''}{trend.value}% from last week</span>
              </div>
            )}
          </div>
          <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-orange-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UserCard({ user, onSelect }: { user: User; onSelect: () => void }) {
  const isActive = user.lastActivityDate && 
    new Date(user.lastActivityDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const isPaid = user.subscriptionStatus === 'active';
  
  return (
    <Card 
      className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 cursor-pointer transition-all"
      onClick={onSelect}
      data-testid={`card-user-${user.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center text-sm font-medium text-white">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div>
              <h3 className="font-semibold text-white">{user.firstName} {user.lastName}</h3>
              <p className="text-sm text-zinc-400">@{user.username}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {isPaid && (
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                <Crown className="w-3 h-3 mr-1" />
                Pro
              </Badge>
            )}
            <Badge className={
              isActive 
                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                : 'bg-zinc-600/20 text-zinc-400 border-zinc-500/30'
            }>
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-1 text-zinc-400">
            <Flame className="w-3 h-3 text-orange-500" />
            <span>{user.currentStreak} day streak</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-400">
            <BookOpen className="w-3 h-3 text-blue-400" />
            <span>{user.completedLessons} lessons</span>
          </div>
          <div className="flex items-center justify-end text-zinc-500">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UserDetailDialog({ user, open, onOpenChange }: { 
  user: User | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  
  const archiveUserMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/admin/archive/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users/stats"] });
      onOpenChange(false);
      toast({ title: "User archived", description: "User can be restored from the archive anytime." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to archive user.", variant: "destructive" });
    },
  });
  
  if (!user) return null;
  
  const isActive = user.lastActivityDate && 
    new Date(user.lastActivityDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const isPaid = user.subscriptionStatus === 'active';
  const createdDate = new Date(user.createdAt).toLocaleDateString();
  const lastActive = user.lastActivityDate 
    ? new Date(user.lastActivityDate).toLocaleDateString() 
    : 'Never';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-3">
            <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center text-lg font-medium text-white">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                {user.firstName} {user.lastName}
                {isPaid && (
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                    <Crown className="w-3 h-3 mr-1" />
                    Pro
                  </Badge>
                )}
              </div>
              <p className="text-sm text-zinc-400 font-normal">@{user.username}</p>
            </div>
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            User details and learning progress
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
                <Mail className="w-4 h-4" />
                Email
              </div>
              <p className="text-white text-sm truncate">{user.email}</p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
                <Activity className="w-4 h-4" />
                Status
              </div>
              <Badge className={
                isActive 
                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                  : 'bg-zinc-600/20 text-zinc-400 border-zinc-500/30'
              }>
                {isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
                <Calendar className="w-4 h-4" />
                Joined
              </div>
              <p className="text-white text-sm">{createdDate}</p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
                <Clock className="w-4 h-4" />
                Last Active
              </div>
              <p className="text-white text-sm">{lastActive}</p>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-4">
            <h4 className="text-sm font-medium text-zinc-300 mb-3">Learning Progress</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  Current Streak
                </div>
                <p className="text-2xl font-bold text-white">{user.currentStreak} <span className="text-sm text-zinc-400 font-normal">days</span></p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
                  <Award className="w-4 h-4 text-yellow-500" />
                  Longest Streak
                </div>
                <p className="text-2xl font-bold text-white">{user.longestStreak} <span className="text-sm text-zinc-400 font-normal">days</span></p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-3 col-span-2">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  Completed Lessons
                </div>
                <p className="text-2xl font-bold text-white">{user.completedLessons}</p>
              </div>
            </div>
          </div>

          {user.subscriptionTier && (
            <div className="border-t border-zinc-800 pt-4">
              <h4 className="text-sm font-medium text-zinc-300 mb-3">Subscription</h4>
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{user.subscriptionTier}</p>
                    <p className="text-sm text-zinc-400">Status: {user.subscriptionStatus}</p>
                  </div>
                  <Badge className={
                    user.subscriptionStatus === 'active'
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }>
                    {user.subscriptionStatus}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          
          <div className="border-t border-zinc-800 pt-4">
            <Button 
              variant="outline"
              onClick={() => archiveUserMutation.mutate(user.id)}
              disabled={archiveUserMutation.isPending}
              className="w-full border-orange-500/50 text-orange-400 hover:bg-orange-500/20"
              data-testid="button-archive-user"
            >
              <Archive className="w-4 h-4 mr-2" />
              Archive User
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ReferralStats {
  totalReferrals: number;
  totalEvents: number;
  totalPointsAwarded: number;
  topReferrers: Array<{
    userId: number;
    firstName: string;
    lastName: string;
    referralCount: number;
  }>;
}

interface ReferralEvent {
  id: number;
  eventType: string;
  referrerPointsAwarded: number;
  refereePointsAwarded: number;
  occurredAt: string;
  referrerUserId: number;
  refereeUserId: number;
}

export default function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'referrals'>('users');

  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: stats } = useQuery<UserStats>({
    queryKey: ["/api/admin/users/stats"],
  });

  const { data: referralStats } = useQuery<ReferralStats>({
    queryKey: ["/api/admin/referrals/stats"],
    enabled: activeTab === 'referrals',
  });

  const { data: referralEventsData } = useQuery<{ events: ReferralEvent[] }>({
    queryKey: ["/api/admin/referrals/events"],
    enabled: activeTab === 'referrals',
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const isActive = user.lastActivityDate && 
      new Date(user.lastActivityDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && isActive) ||
      (statusFilter === "inactive" && !isActive);
    
    const isPaid = user.subscriptionStatus === 'active';
    const matchesTier = tierFilter === "all" ||
      (tierFilter === "paid" && isPaid) ||
      (tierFilter === "free" && !isPaid);

    return matchesSearch && matchesStatus && matchesTier;
  });

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setDetailOpen(true);
  };

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Users</h1>
              <p className="text-zinc-400">Manage and monitor your user base</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'users' | 'referrals')}>
            <TabsList className="bg-zinc-800 border-zinc-700">
              <TabsTrigger value="users" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
                <Users className="w-4 h-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="referrals" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
                <Gift className="w-4 h-4 mr-2" />
                Referrals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard 
              title="Total Users" 
              value={stats?.totalUsers || 0}
              icon={Users}
            />
            <StatsCard 
              title="Active Users" 
              value={stats?.activeUsers || 0}
              subtitle="Last 7 days"
              icon={UserCheck}
            />
            <StatsCard 
              title="Paid Users" 
              value={stats?.paidUsers || 0}
              icon={Crown}
            />
            <StatsCard 
              title="New This Week" 
              value={stats?.newUsersThisWeek || 0}
              icon={TrendingUp}
            />
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard 
              title="Free Users" 
              value={stats?.freeUsers || 0}
              icon={UserX}
            />
            <StatsCard 
              title="New This Month" 
              value={stats?.newUsersThisMonth || 0}
              icon={Calendar}
            />
            <StatsCard 
              title="Avg Streak" 
              value={typeof stats?.averageStreak === 'number' ? stats.averageStreak.toFixed(1) : (parseFloat(String(stats?.averageStreak || '0')).toFixed(1) || '0')}
              subtitle="days"
              icon={Flame}
            />
            <StatsCard 
              title="Avg Lessons" 
              value={typeof stats?.averageCompletedLessons === 'number' ? stats.averageCompletedLessons.toFixed(1) : (parseFloat(String(stats?.averageCompletedLessons || '0')).toFixed(1) || '0')}
              subtitle="per user"
              icon={BookOpen}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                placeholder="Search users by name, email, or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                data-testid="input-search-users"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] bg-zinc-800 border-zinc-700 text-white" data-testid="select-status-filter">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-[150px] bg-zinc-800 border-zinc-700 text-white" data-testid="select-tier-filter">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="free">Free</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* User List */}
          {usersLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <Card className="bg-zinc-800/50 border-zinc-700">
              <CardContent className="py-12 text-center">
                <Users className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No users found</h3>
                <p className="text-zinc-400">
                  {searchQuery || statusFilter !== "all" || tierFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Users will appear here once they sign up"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredUsers.map((user) => (
                <UserCard 
                  key={user.id} 
                  user={user} 
                  onSelect={() => handleSelectUser(user)}
                />
              ))}
            </div>
          )}

          {/* Results count */}
          {!usersLoading && filteredUsers.length > 0 && (
            <p className="text-sm text-zinc-500 text-center">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          )}
            </TabsContent>

            <TabsContent value="referrals" className="mt-6 space-y-6">
              {/* Referral Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard 
                  title="Total Referrals" 
                  value={referralStats?.totalReferrals || 0}
                  icon={Share2}
                />
                <StatsCard 
                  title="Milestone Events" 
                  value={referralStats?.totalEvents || 0}
                  icon={Award}
                />
                <StatsCard 
                  title="Points Awarded" 
                  value={(referralStats?.totalPointsAwarded || 0).toLocaleString()}
                  icon={Gift}
                />
                <StatsCard 
                  title="Top Referrers" 
                  value={referralStats?.topReferrers?.length || 0}
                  icon={Crown}
                />
              </div>

              {/* Top Referrers */}
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Crown className="w-5 h-5 text-orange-500" />
                    Top Referrers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {referralStats?.topReferrers?.length ? (
                    <div className="space-y-3">
                      {referralStats.topReferrers.map((referrer, index) => (
                        <div key={referrer.userId} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                              index === 1 ? 'bg-zinc-400/20 text-zinc-300' :
                              index === 2 ? 'bg-orange-700/20 text-orange-600' :
                              'bg-zinc-700/50 text-zinc-400'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-white font-medium">{referrer.firstName} {referrer.lastName}</p>
                            </div>
                          </div>
                          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                            {referrer.referralCount} referrals
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-zinc-500">
                      <Share2 className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
                      <p>No referrals yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Referral Events */}
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-orange-500" />
                    Recent Referral Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {referralEventsData?.events?.length ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {referralEventsData.events.slice(0, 20).map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              event.eventType === 'signup' ? 'bg-green-500/20' :
                              event.eventType === 'streak_7' ? 'bg-orange-500/20' :
                              'bg-blue-500/20'
                            }`}>
                              {event.eventType === 'signup' ? <UserCheck className="w-4 h-4 text-green-500" /> :
                               event.eventType === 'streak_7' ? <Flame className="w-4 h-4 text-orange-500" /> :
                               <Crown className="w-4 h-4 text-blue-500" />}
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium capitalize">
                                {event.eventType.replace('_', ' ')} Milestone
                              </p>
                              <p className="text-xs text-zinc-500">
                                {new Date(event.occurredAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-orange-400 text-sm font-medium">
                              +{event.referrerPointsAwarded + event.refereePointsAwarded} pts
                            </p>
                            <p className="text-xs text-zinc-500">total awarded</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-zinc-500">
                      <Activity className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
                      <p>No referral activity yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <UserDetailDialog 
          user={selectedUser}
          open={detailOpen}
          onOpenChange={setDetailOpen}
        />
      </AdminLayout>
    </AdminAuthGuard>
  );
}
