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
  RefreshCw,
  Send,
  Building2,
  Handshake,
  Flag,
  Rocket,
  Trophy,
  Sparkles,
  PenSquare,
  FileText,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useState } from "react";
import { Link, useLocation } from "wouter";

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
  social: {
    totalPosts: number;
    drafted: number;
    approved: number;
    planned: number;
    posted: number;
  };
  crm: {
    totalCompanies: number;
    activeDeals: number;
    wonDeals: number;
    pipelineValue: number;
  };
  goals: {
    totalObjectives: number;
    activeObjectives: number;
    avgProgress: number;
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

function HeroMetric({ 
  title, 
  value, 
  change, 
  icon: Icon,
  color = "orange",
  sparklineData
}: { 
  title: string; 
  value: number | string; 
  change?: number;
  icon: any;
  color?: "orange" | "green" | "blue" | "purple";
  sparklineData?: number[];
}) {
  const isPositive = change !== undefined && change >= 0;
  const colorClasses = {
    orange: "from-orange-500/20 to-transparent border-orange-500/30 text-orange-500",
    green: "from-green-500/20 to-transparent border-green-500/30 text-green-500",
    blue: "from-blue-500/20 to-transparent border-blue-500/30 text-blue-500",
    purple: "from-purple-500/20 to-transparent border-purple-500/30 text-purple-500"
  };
  const iconColors = { orange: "text-orange-500", green: "text-green-500", blue: "text-blue-500", purple: "text-purple-500" };

  return (
    <Card className={`bg-gradient-to-br ${colorClasses[color]} border relative overflow-hidden`} data-testid={`hero-metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-zinc-400">{title}</p>
            <div className="text-4xl font-bold text-white tracking-tight">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            {change !== undefined && (
              <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>{isPositive ? '+' : ''}{change}% this week</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-zinc-800/50 ${iconColors[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {sparklineData && sparklineData.length > 0 && (
          <div className="mt-4 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData.map((v, i) => ({ value: v, index: i }))}>
                <defs>
                  <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color === 'orange' ? '#f97316' : color === 'green' ? '#22c55e' : color === 'blue' ? '#3b82f6' : '#a855f7'} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={color === 'orange' ? '#f97316' : color === 'green' ? '#22c55e' : color === 'blue' ? '#3b82f6' : '#a855f7'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke={color === 'orange' ? '#f97316' : color === 'green' ? '#22c55e' : color === 'blue' ? '#3b82f6' : '#a855f7'} fill={`url(#gradient-${color})`} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CircularProgress({ value, size = 120, label, sublabel, id }: { value: number; size?: number; label: string; sublabel?: string; id?: string }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(value, 100) / 100) * circumference;
  const gradientId = id || `progressGradient-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="flex flex-col items-center justify-center" data-testid={`circular-progress-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fb923c" />
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

function QuickActions() {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2 text-lg">
          <Rocket className="h-5 w-5 text-orange-500" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/admin/marketing" className="block">
            <div className="w-full h-auto py-3 flex flex-col items-center gap-2 border border-zinc-700 rounded-md hover:border-orange-500/50 hover:bg-orange-500/10 transition-colors cursor-pointer" data-testid="quick-action-campaign">
              <Megaphone className="h-5 w-5 text-orange-400" />
              <span className="text-xs text-zinc-300">Add Campaign</span>
            </div>
          </Link>
          <Link href="/admin/social" className="block">
            <div className="w-full h-auto py-3 flex flex-col items-center gap-2 border border-zinc-700 rounded-md hover:border-blue-500/50 hover:bg-blue-500/10 transition-colors cursor-pointer" data-testid="quick-action-post">
              <PenSquare className="h-5 w-5 text-blue-400" />
              <span className="text-xs text-zinc-300">Schedule Post</span>
            </div>
          </Link>
          <Link href="/admin/crm" className="block">
            <div className="w-full h-auto py-3 flex flex-col items-center gap-2 border border-zinc-700 rounded-md hover:border-green-500/50 hover:bg-green-500/10 transition-colors cursor-pointer" data-testid="quick-action-deal">
              <Handshake className="h-5 w-5 text-green-400" />
              <span className="text-xs text-zinc-300">Log Deal</span>
            </div>
          </Link>
          <Link href="/admin/content" className="block">
            <div className="w-full h-auto py-3 flex flex-col items-center gap-2 border border-zinc-700 rounded-md hover:border-purple-500/50 hover:bg-purple-500/10 transition-colors cursor-pointer" data-testid="quick-action-content">
              <FileText className="h-5 w-5 text-purple-400" />
              <span className="text-xs text-zinc-300">Create Content</span>
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function WeeklyWins({ kpis }: { kpis: KPIData | undefined }) {
  const wins = [];
  
  if (kpis?.users.newSignups && kpis.users.newSignups > 0) {
    wins.push({ icon: UserPlus, text: `${kpis.users.newSignups} new users joined this week`, color: "text-green-400" });
  }
  if (kpis?.users.signupsChange && kpis.users.signupsChange > 0) {
    wins.push({ icon: TrendingUp, text: `User signups up ${kpis.users.signupsChange}% vs last week`, color: "text-blue-400" });
  }
  if (kpis?.community.weeklyPosts && kpis.community.weeklyPosts > 0) {
    wins.push({ icon: MessageSquare, text: `${kpis.community.weeklyPosts} community posts this week`, color: "text-purple-400" });
  }
  if (kpis?.crm?.wonDeals && kpis.crm.wonDeals > 0) {
    wins.push({ icon: Trophy, text: `${kpis.crm.wonDeals} deals closed won`, color: "text-orange-400" });
  }
  if (kpis?.social?.posted && kpis.social.posted > 0) {
    wins.push({ icon: Send, text: `${kpis.social.posted} social posts published`, color: "text-blue-400" });
  }
  
  if (wins.length === 0) {
    wins.push({ icon: Sparkles, text: "Keep pushing - your wins are coming!", color: "text-zinc-400" });
  }

  return (
    <Card className="bg-gradient-to-br from-orange-500/10 via-zinc-900 to-zinc-900 border-orange-500/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-orange-500" />
          This Week's Wins
          <Sparkles className="h-4 w-4 text-orange-400 ml-auto" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {wins.slice(0, 4).map((win, idx) => (
            <div key={idx} className="flex items-center gap-3 text-sm">
              <div className={`p-1.5 rounded-lg bg-zinc-800/50 ${win.color}`}>
                <win.icon className="h-4 w-4" />
              </div>
              <span className="text-zinc-300">{win.text}</span>
            </div>
          ))}
        </div>
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
            <h1 className="text-3xl font-bold text-white" data-testid="heading-dashboard">Dashboard</h1>
            <p className="text-zinc-400">Your business at a glance</p>
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
            {/* Hero Metrics - Large, prominent KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <HeroMetric 
                title="Total Users" 
                value={kpis?.users.total || 0} 
                change={kpis?.users.signupsChange}
                icon={Users}
                color="orange"
                sparklineData={trends?.map(t => t.signups) || []}
              />
              <HeroMetric 
                title="Monthly Revenue" 
                value={`$${(kpis?.revenue.monthlyRevenue || 0).toLocaleString()}`}
                icon={DollarSign}
                color="green"
              />
              <HeroMetric 
                title="Active Users" 
                value={kpis?.users.active || 0} 
                change={kpis?.users.activeChange}
                icon={Activity}
                color="blue"
              />
              <HeroMetric 
                title="Pipeline Value" 
                value={`$${(kpis?.crm?.pipelineValue || 0).toLocaleString()}`}
                icon={Handshake}
                color="purple"
              />
            </div>

            {/* Quick Actions + Weekly Wins Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <QuickActions />
              <WeeklyWins kpis={kpis} />
            </div>

            {/* Progress Rings + Additional Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg">Key Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <CircularProgress 
                      value={kpis?.content.coveragePercent || 0} 
                      size={100} 
                      label="Content"
                      sublabel={`${kpis?.content.totalDays || 0}/180 days`}
                    />
                    <CircularProgress 
                      value={kpis?.engagement.lessonCompletionRate || 0} 
                      size={100} 
                      label="Completion"
                      sublabel="Users learning"
                    />
                    <CircularProgress 
                      value={kpis?.goals?.avgProgress || 0} 
                      size={100} 
                      label="OKRs"
                      sublabel={`${kpis?.goals?.activeObjectives || 0} active`}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Send className="h-5 w-5 text-blue-400" />
                    Social Pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <div className="text-2xl font-bold text-zinc-400">{kpis?.social?.drafted || 0}</div>
                      <div className="text-xs text-zinc-500">Drafted</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-400">{kpis?.social?.approved || 0}</div>
                      <div className="text-xs text-zinc-500">Approved</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-400">{kpis?.social?.planned || 0}</div>
                      <div className="text-xs text-zinc-500">Planned</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">{kpis?.social?.posted || 0}</div>
                      <div className="text-xs text-zinc-500">Posted</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-orange-400" />
                    B2B Sales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Companies</span>
                      <span className="text-xl font-bold text-white">{kpis?.crm?.totalCompanies || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Active Deals</span>
                      <span className="text-xl font-bold text-blue-400">{kpis?.crm?.activeDeals || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Won</span>
                      <span className="text-xl font-bold text-green-400">{kpis?.crm?.wonDeals || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard 
                title="Avg Streak" 
                value={kpis?.users.avgStreak || 0} 
                suffix=" days"
                icon={Zap} 
              />
              <MetricCard 
                title="Community Posts" 
                value={kpis?.community.totalPosts || 0} 
                icon={MessageSquare}
                description={`${kpis?.community.weeklyPosts || 0} this week`}
              />
              <MetricCard 
                title="Active Campaigns" 
                value={kpis?.marketing.activeCampaigns || 0} 
                icon={Megaphone}
                description={`${((kpis?.marketing.ctr || 0)).toFixed(1)}% CTR`}
              />
              <MetricCard 
                title="Product Ideas" 
                value={kpis?.product.totalIdeas || 0} 
                icon={Rocket}
                description={`${kpis?.product.completedIdeas || 0} completed`}
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

            {/* Social Media & B2B CRM Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Send className="h-5 w-5 text-blue-400" />
                    Social Media Pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-zinc-400">{kpis?.social?.drafted || 0}</div>
                      <div className="text-sm text-zinc-500">Drafted</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400">{kpis?.social?.approved || 0}</div>
                      <div className="text-sm text-zinc-500">Approved</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-zinc-800 grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{kpis?.social?.planned || 0}</div>
                      <div className="text-sm text-zinc-500">Planned</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{kpis?.social?.posted || 0}</div>
                      <div className="text-sm text-zinc-500">Posted</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-orange-400" />
                    B2B Sales Pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{kpis?.crm?.totalCompanies || 0}</div>
                      <div className="text-sm text-zinc-400">Companies</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">{kpis?.crm?.activeDeals || 0}</div>
                      <div className="text-sm text-zinc-400">Active Deals</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-zinc-800">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Pipeline Value</span>
                      <span className="text-xl font-bold text-green-400">${(kpis?.crm?.pipelineValue || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-zinc-400">Deals Won</span>
                      <span className="text-lg font-semibold text-orange-500">{kpis?.crm?.wonDeals || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Flag className="h-5 w-5 text-purple-400" />
                    Goals & OKRs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{kpis?.goals?.totalObjectives || 0}</div>
                      <div className="text-sm text-zinc-400">Total Objectives</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">{kpis?.goals?.activeObjectives || 0}</div>
                      <div className="text-sm text-zinc-400">Active</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-zinc-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-zinc-400">Avg Progress</span>
                      <span className="text-lg font-semibold text-white">{kpis?.goals?.avgProgress || 0}%</span>
                    </div>
                    <Progress 
                      value={kpis?.goals?.avgProgress || 0} 
                      className="h-2 bg-zinc-800"
                    />
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
