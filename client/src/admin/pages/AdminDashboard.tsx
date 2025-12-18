import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Megaphone, ShoppingBag, Users } from "lucide-react";

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

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  
  // Check admin auth
  const { data: adminUser, isLoading: authLoading, error: authError } = useQuery<{ id: number; email: string; firstName: string; lastName: string }>({
    queryKey: ["/api/admin/me"],
    retry: false,
  });
  
  const { data: stats } = useQuery<{ contentDays: number; activeUsers: number; activeCampaigns: number; storeProducts: number }>({
    queryKey: ["/api/admin/stats"],
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-400">Overview of HODLearn operations</p>
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Manage Content</h3>
                  <p className="text-sm text-zinc-400">Edit curriculum days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Megaphone className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Marketing</h3>
                  <p className="text-sm text-zinc-400">Manage ad campaigns</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Store</h3>
                  <p className="text-sm text-zinc-400">Manage products</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-zinc-400 text-sm">
              Activity feed will appear here once the system is in use.
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
