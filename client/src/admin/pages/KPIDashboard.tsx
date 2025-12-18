import { useQuery } from "@tanstack/react-query";
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
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useState } from "react";
import { useLocation } from "wouter";

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
