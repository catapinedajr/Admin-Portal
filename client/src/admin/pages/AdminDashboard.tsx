import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Megaphone, ShoppingBag, Users, ChevronRight, TrendingUp, DollarSign, UserPlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
} from "recharts";

interface TimeseriesData {
  date: string;
  signups: number;
  marketingSpend: number;
  marketingBudget: number;
  revenue: number;
  orders: number;
  cumulativeUsers: number;
  cumulativeRevenue: number;
  cumulativeSpend: number;
}

function StatsCard({ title, value, icon: Icon, description, trend }: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  trend?: { value: number; positive: boolean };
}) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400">{title}</CardTitle>
        <Icon className="w-4 h-4 text-zinc-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        {description && (
          <p className="text-xs text-zinc-500 mt-1">{description}</p>
        )}
        {trend && (
          <p className={`text-xs mt-1 ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.positive ? '+' : ''}{trend.value}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDollars(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [timeRange, setTimeRange] = useState("30");
  
  // Get admin user from localStorage instead of API
  const getAdminUser = () => {
    try {
      const adminUser = localStorage.getItem("admin_user");
      return adminUser ? JSON.parse(adminUser) : null;
    } catch {
      return null;
    }
  };

  const adminUser = getAdminUser();
  
  const { data: stats } = useQuery<{ contentDays: number; activeUsers: number; activeCampaigns: number; storeProducts: number }>({
    queryKey: ["/api/admin/stats"],
    enabled: !!adminUser,
  });

  const { data: timeseries = [] } = useQuery<TimeseriesData[]>({
    queryKey: ["/api/admin/stats/timeseries", { days: timeRange }],
    enabled: !!adminUser,
  });

  useEffect(() => {
    if (!authLoading && (authError || !adminUser)) {
      setLocation('/admin/login');
    }
  }, [authLoading, authError, adminUser, setLocation]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!adminUser) {
    return null;
  }

  const totalSignups = timeseries.reduce((sum, d) => sum + d.signups, 0);
  const totalRevenue = timeseries.reduce((sum, d) => sum + d.revenue, 0);
  const totalSpend = timeseries.reduce((sum, d) => sum + d.marketingSpend, 0);
  const totalBudget = timeseries.reduce((sum, d) => sum + d.marketingBudget, 0);
  const totalOrders = timeseries.reduce((sum, d) => sum + d.orders, 0);
  const budgetPacing = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-zinc-400">Overview of HODLearn operations</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px] bg-zinc-800 border-zinc-700 text-white" data-testid="select-time-range">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Content Days"
            value={stats?.contentDays || 0}
            icon={BookOpen}
            description="Total curriculum days"
          />
          <StatsCard
            title="Active Users"
            value={stats?.activeUsers || 0}
            icon={Users}
            description="Registered users"
          />
          <StatsCard
            title="Active Campaigns"
            value={stats?.activeCampaigns || 0}
            icon={Megaphone}
            description="Running ad campaigns"
          />
          <StatsCard
            title="Store Products"
            value={stats?.storeProducts || 0}
            icon={ShoppingBag}
            description="Products in store"
          />
        </div>

        {/* Period Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title={`New Signups (${timeRange}d)`}
            value={totalSignups}
            icon={UserPlus}
          />
          <StatsCard
            title={`Revenue (${timeRange}d)`}
            value={formatDollars(totalRevenue)}
            icon={DollarSign}
          />
          <StatsCard
            title={`Marketing Spend (${timeRange}d)`}
            value={formatDollars(totalSpend)}
            icon={Megaphone}
            description={totalBudget > 0 ? `${budgetPacing.toFixed(0)}% of ${formatDollars(totalBudget)} budget` : undefined}
          />
          <StatsCard
            title={`Orders (${timeRange}d)`}
            value={totalOrders}
            icon={ShoppingBag}
          />
        </div>

        {/* User Signups Chart */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-orange-500" />
              User Signups Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeseries}>
                  <defs>
                    <linearGradient id="signupsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#f97316' }}
                    labelFormatter={formatDate}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="signups" 
                    stroke="#f97316" 
                    fillOpacity={1} 
                    fill="url(#signupsGradient)" 
                    name="New Users"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue vs Marketing Spend Chart */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Revenue vs Marketing Spend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeseries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="#9ca3af" 
                    fontSize={12}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#9ca3af" 
                    fontSize={12}
                    tickFormatter={(v) => formatDollars(v)}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                    labelFormatter={formatDate}
                    formatter={(value: number, name: string) => {
                      return [formatDollars(value), name];
                    }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    dot={false}
                    name="Revenue"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="marketingSpend" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={false}
                    name="Marketing Spend"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="marketingBudget" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Marketing Budget"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Cumulative Growth Chart */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-500" />
              Cumulative Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeseries}>
                  <defs>
                    <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="#9ca3af" 
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#9ca3af" 
                    fontSize={12}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                    labelFormatter={formatDate}
                  />
                  <Legend />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="cumulativeUsers" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#usersGradient)" 
                    name="Total Users"
                  />
                  <Area 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="cumulativeRevenue" 
                    stroke="#22c55e" 
                    fillOpacity={1} 
                    fill="url(#revenueGradient)" 
                    name="Total Revenue ($)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Daily Orders Chart */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-500" />
              Daily Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeseries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                    labelFormatter={formatDate}
                  />
                  <Bar 
                    dataKey="orders" 
                    fill="#a855f7" 
                    radius={[4, 4, 0, 0]}
                    name="Orders"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/admin/users">
            <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-colors cursor-pointer" data-testid="card-manage-users">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Users</h3>
                    <p className="text-sm text-zinc-400">Manage users</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-500" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/content">
            <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-colors cursor-pointer" data-testid="card-manage-content">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Content</h3>
                    <p className="text-sm text-zinc-400">Manage curriculum</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-500" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/marketing">
            <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-colors cursor-pointer" data-testid="card-marketing">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Megaphone className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Marketing</h3>
                    <p className="text-sm text-zinc-400">Ad campaigns</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-500" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/store">
            <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-colors cursor-pointer" data-testid="card-store">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Store</h3>
                    <p className="text-sm text-zinc-400">Products & orders</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-500" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
