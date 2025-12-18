import { useQuery } from "@tanstack/react-query";
import AdminLayout from "../components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  DollarSign, 
  Activity,
  Megaphone,
  Loader2,
  RefreshCw,
  Send,
  Building2,
  Handshake,
  Rocket,
  Trophy,
  Sparkles,
  PenSquare,
  FileText,
  UserPlus,
  GraduationCap,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useEffect } from "react";
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

  useEffect(() => {
    if (!isLoading && !admin) {
      setLocation("/admin/login");
    }
  }, [admin, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return <>{children}</>;
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

function OperationalHealth({ kpis }: { kpis: KPIData | undefined }) {
  const stats = [
    {
      label: "Lesson Completion",
      value: `${kpis?.engagement?.lessonCompletionRate || 0}%`,
      icon: GraduationCap,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      link: "/admin/content"
    },
    {
      label: "Active Campaigns",
      value: kpis?.marketing?.activeCampaigns || 0,
      subValue: `${(kpis?.marketing?.ctr || 0).toFixed(1)}% CTR`,
      icon: Megaphone,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      link: "/admin/marketing"
    },
    {
      label: "Community Engagement",
      value: `${kpis?.community?.engagementRate || 0}%`,
      subValue: `${kpis?.community?.totalPosts || 0} posts`,
      icon: MessageSquare,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      link: "/admin/content"
    },
    {
      label: "Goals Progress",
      value: `${kpis?.goals?.avgProgress || 0}%`,
      subValue: `${kpis?.goals?.activeObjectives || 0} active`,
      icon: Target,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      link: "/admin/goals"
    }
  ];

  return (
    <Card className="bg-zinc-900/50 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Operational Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.link}>
              <div 
                className={`p-3 rounded-lg ${stat.bgColor} hover:brightness-110 transition-all cursor-pointer group`}
                data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-xs text-zinc-400 group-hover:text-zinc-300">{stat.label}</span>
                </div>
                <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                {stat.subValue && (
                  <div className="text-xs text-zinc-500">{stat.subValue}</div>
                )}
              </div>
            </Link>
          ))}
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
  const { data: kpis, isLoading: kpisLoading, refetch: refetchKpis } = useQuery<KPIData>({
    queryKey: ["/api/admin/kpis"],
    refetchInterval: 60000,
  });

  const { data: trends, isLoading: trendsLoading } = useQuery<TrendData[]>({
    queryKey: ["/api/admin/kpis/trends", 30],
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

        {/* Operational Health - Compact operational metrics */}
        <OperationalHealth kpis={kpis} />

        {/* Quick Actions + Weekly Wins Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <QuickActions />
          <WeeklyWins kpis={kpis} />
        </div>

        {/* Activity Trends Chart */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Activity Trends</CardTitle>
            <CardDescription>Daily signups, completions, and community activity (30 days)</CardDescription>
          </CardHeader>
          <CardContent>
            {trendsLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
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
