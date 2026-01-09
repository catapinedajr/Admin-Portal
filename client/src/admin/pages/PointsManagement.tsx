import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Coins, Trophy, Award, Users, Settings, 
  Plus, Edit2, Gift, CheckCircle, Clock,
  TrendingUp, Crown, Zap, Calculator, Loader2, RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
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

interface RewardConfig {
  id: number;
  rewardType: string;
  displayName: string;
  description: string | null;
  category: string;
  baseSatoshis: number;
  multiplierEligible: boolean;
  maxPerDay: number | null;
  isActive: boolean;
  sortOrder: number;
  iconName: string | null;
}

interface LeaderboardPeriod {
  id: number;
  name: string;
  periodType: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  hasPrizes: boolean;
  prizeDescription: string | null;
  prizeConfig: { positions: { rank: number; prize: string; value?: number }[] } | null;
  campaignTag: string | null;
}

interface LeaderboardEntry {
  id: number;
  periodId: number;
  userId: number;
  totalSatoshis: number;
  rank: number;
  learningSatoshis: number;
  streakSatoshis: number;
  referralSatoshis: number;
  communitySatoshis: number;
  prizeWon: string | null;
  prizeApproved: boolean;
  prizeDelivered: boolean;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

interface RewardStats {
  totalSatoshisEarned: number;
  totalEarnings: number;
  topEarners: { userId: number; username: string; totalSatoshis: number }[];
  earningsByType: { earningType: string; totalSatoshis: number; count: number }[];
}

const CATEGORY_COLORS: Record<string, string> = {
  learning: "bg-blue-500/20 text-blue-400",
  streak: "bg-orange-500/20 text-orange-400",
  referral: "bg-green-500/20 text-green-400",
  community: "bg-purple-500/20 text-purple-400",
  bonus: "bg-yellow-500/20 text-yellow-400",
};

const PERIOD_TYPES = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "custom", label: "Custom" },
];

function formatSats(sats: number): string {
  if (sats >= 1000000) return `${(sats / 1000000).toFixed(2)}M`;
  if (sats >= 1000) return `${(sats / 1000).toFixed(1)}K`;
  return sats.toString();
}

function PointsManagementContent() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [editingConfig, setEditingConfig] = useState<RewardConfig | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [leaderboardDialogOpen, setLeaderboardDialogOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<LeaderboardPeriod | null>(null);
  const [viewingEntries, setViewingEntries] = useState(false);

  const [newPeriod, setNewPeriod] = useState({
    name: "",
    periodType: "weekly",
    startDate: "",
    endDate: "",
    hasPrizes: false,
    prizeDescription: "",
    campaignTag: "",
    prizeTiers: [
      { rank: 1, prize: "", value: 0 },
      { rank: 2, prize: "", value: 0 },
      { rank: 3, prize: "", value: 0 },
    ] as { rank: number; prize: string; value: number }[],
  });

  // Manual award state
  const [manualAwardOpen, setManualAwardOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<{ id: number; username: string; email: string } | null>(null);
  const [awardAmount, setAwardAmount] = useState("");
  const [awardReason, setAwardReason] = useState("");

  // User search query
  const { data: searchResults = [] } = useQuery<{ id: number; username: string; email: string; displayName: string | null }[]>({
    queryKey: ["/api/admin/users/search", userSearchQuery],
    queryFn: () => fetch(`/api/admin/users/search?q=${encodeURIComponent(userSearchQuery)}`).then(r => r.json()),
    enabled: userSearchQuery.length >= 2,
  });

  const { data: rewardConfigs = [], isLoading: configsLoading } = useQuery<RewardConfig[]>({
    queryKey: ["/api/admin/rewards/config"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<RewardStats>({
    queryKey: ["/api/admin/rewards/stats"],
  });

  const { data: leaderboards = [], isLoading: leaderboardsLoading } = useQuery<LeaderboardPeriod[]>({
    queryKey: ["/api/admin/leaderboards"],
  });

  const { data: entries = [], isLoading: entriesLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/admin/leaderboards", selectedPeriod?.id, "entries"],
    enabled: !!selectedPeriod && viewingEntries,
  });

  const { data: pendingPrizes = [] } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/admin/rewards/pending-prizes"],
  });

  const updateConfigMutation = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<RewardConfig> }) => {
      const res = await apiRequest("PATCH", `/api/admin/rewards/config/${data.id}`, data.updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rewards/config"] });
      toast({ title: "Reward configuration updated" });
      setEditDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
    },
  });

  const createLeaderboardMutation = useMutation({
    mutationFn: async (data: typeof newPeriod) => {
      const res = await apiRequest("POST", "/api/admin/leaderboards", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leaderboards"] });
      toast({ title: "Leaderboard period created" });
      setLeaderboardDialogOpen(false);
      setNewPeriod({
        name: "",
        periodType: "weekly",
        startDate: "",
        endDate: "",
        hasPrizes: false,
        prizeDescription: "",
        campaignTag: "",
      });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create", description: error.message, variant: "destructive" });
    },
  });

  const computeLeaderboardMutation = useMutation({
    mutationFn: async (periodId: number) => {
      const res = await apiRequest("POST", `/api/admin/leaderboards/${periodId}/compute`, {});
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leaderboards"] });
      toast({ title: "Leaderboard computed", description: `${data.entryCount} entries ranked` });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to compute", description: error.message, variant: "destructive" });
    },
  });

  const approvePrizeMutation = useMutation({
    mutationFn: async (data: { entryId: number; prizeWon: string }) => {
      const res = await apiRequest("POST", `/api/admin/leaderboards/entries/${data.entryId}/approve-prize`, {
        prizeWon: data.prizeWon,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rewards/pending-prizes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leaderboards"] });
      toast({ title: "Prize approved" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to approve", description: error.message, variant: "destructive" });
    },
  });

  const deliverPrizeMutation = useMutation({
    mutationFn: async (data: { entryId: number; prizeNotes?: string }) => {
      const res = await apiRequest("POST", `/api/admin/leaderboards/entries/${data.entryId}/deliver-prize`, {
        prizeNotes: data.prizeNotes,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rewards/pending-prizes"] });
      toast({ title: "Prize marked as delivered" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to deliver", description: error.message, variant: "destructive" });
    },
  });

  const manualAwardMutation = useMutation({
    mutationFn: async (data: { userId: number; amount: number; reason: string }) => {
      const res = await apiRequest("POST", "/api/admin/rewards/manual-award", data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rewards/stats"] });
      toast({ title: "Points Awarded", description: data.message });
      setManualAwardOpen(false);
      setSelectedUser(null);
      setAwardAmount("");
      setAwardReason("");
      setUserSearchQuery("");
    },
    onError: (error: Error) => {
      toast({ title: "Failed to award", description: error.message, variant: "destructive" });
    },
  });

  const groupedConfigs = rewardConfigs.reduce((acc, config) => {
    if (!acc[config.category]) acc[config.category] = [];
    acc[config.category].push(config);
    return acc;
  }, {} as Record<string, RewardConfig[]>);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Points & Rewards</h1>
          <p className="text-zinc-400">Manage HODLearn Points, leaderboards, and prizes</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Coins className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {formatSats(stats?.totalSatoshisEarned || 0)}
                  </p>
                  <p className="text-sm text-zinc-400">Total Sats Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats?.totalEarnings || 0}</p>
                  <p className="text-sm text-zinc-400">Total Transactions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Trophy className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{leaderboards.filter(l => l.isActive).length}</p>
                  <p className="text-sm text-zinc-400">Active Leaderboards</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Gift className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{pendingPrizes.length}</p>
                  <p className="text-sm text-zinc-400">Pending Prizes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-zinc-800 border-zinc-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="config">Reward Config</TabsTrigger>
            <TabsTrigger value="leaderboards">Leaderboards</TabsTrigger>
            <TabsTrigger value="prizes">Prizes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Crown className="w-5 h-5 text-orange-500" />
                    Top Earners
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                    </div>
                  ) : stats?.topEarners.length === 0 ? (
                    <p className="text-zinc-400 text-center py-8">No earnings yet</p>
                  ) : (
                    <div className="space-y-3">
                      {stats?.topEarners.map((earner, index) => (
                        <div key={earner.userId} className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-zinc-400 w-6">#{index + 1}</span>
                            <span className="text-white">{earner.username}</span>
                          </div>
                          <Badge variant="outline" className="border-orange-500/50 text-orange-400">
                            {formatSats(earner.totalSatoshis)} sats
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-blue-500" />
                    Earnings by Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                    </div>
                  ) : stats?.earningsByType.length === 0 ? (
                    <p className="text-zinc-400 text-center py-8">No earnings yet</p>
                  ) : (
                    <div className="space-y-3">
                      {stats?.earningsByType.map((earning) => (
                        <div key={earning.earningType} className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                          <span className="text-white capitalize">{earning.earningType.replace(/_/g, " ")}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-zinc-400 text-sm">{earning.count} times</span>
                            <Badge variant="outline" className="border-zinc-600">
                              {formatSats(earning.totalSatoshis)} sats
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            {configsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              </div>
            ) : (
              Object.entries(groupedConfigs).map(([category, configs]) => (
                <Card key={category} className="bg-zinc-800/50 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2 capitalize">
                      <Badge className={CATEGORY_COLORS[category] || "bg-zinc-600"}>
                        {category}
                      </Badge>
                      Rewards
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-zinc-700">
                          <TableHead className="text-zinc-400">Reward</TableHead>
                          <TableHead className="text-zinc-400 text-right">Base Sats</TableHead>
                          <TableHead className="text-zinc-400 text-center">Multiplier</TableHead>
                          <TableHead className="text-zinc-400 text-center">Daily Limit</TableHead>
                          <TableHead className="text-zinc-400 text-center">Status</TableHead>
                          <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {configs.map((config) => (
                          <TableRow key={config.id} className="border-zinc-700">
                            <TableCell>
                              <div>
                                <p className="text-white font-medium">{config.displayName}</p>
                                <p className="text-zinc-500 text-sm">{config.description}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right text-orange-400 font-mono">
                              {config.baseSatoshis.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-center">
                              {config.multiplierEligible ? (
                                <Badge className="bg-green-500/20 text-green-400">Yes</Badge>
                              ) : (
                                <Badge variant="outline" className="border-zinc-600 text-zinc-400">No</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-center text-zinc-400">
                              {config.maxPerDay || "∞"}
                            </TableCell>
                            <TableCell className="text-center">
                              {config.isActive ? (
                                <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                              ) : (
                                <Badge variant="outline" className="border-zinc-600 text-zinc-400">Inactive</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-zinc-600"
                                onClick={() => {
                                  setEditingConfig(config);
                                  setEditDialogOpen(true);
                                }}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="leaderboards" className="space-y-6">
            <div className="flex justify-end">
              <Button
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => setLeaderboardDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Leaderboard Period
              </Button>
            </div>

            {leaderboardsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              </div>
            ) : leaderboards.length === 0 ? (
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="py-12 text-center">
                  <Trophy className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-400">No leaderboard periods yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {leaderboards.map((period) => (
                  <Card key={period.id} className="bg-zinc-800/50 border-zinc-700">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white text-lg">{period.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="border-zinc-600 text-zinc-400">
                              {period.periodType}
                            </Badge>
                            {period.campaignTag && (
                              <Badge className="bg-purple-500/20 text-purple-400">
                                {period.campaignTag}
                              </Badge>
                            )}
                          </CardDescription>
                        </div>
                        {period.isActive ? (
                          <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="border-zinc-600 text-zinc-400">Ended</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-zinc-400 mb-4">
                        <p>{new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}</p>
                        {period.hasPrizes && (
                          <p className="text-orange-400 flex items-center gap-1 mt-1">
                            <Gift className="w-3 h-3" />
                            {period.prizeDescription}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-zinc-600 flex-1"
                          onClick={() => {
                            setSelectedPeriod(period);
                            setViewingEntries(true);
                          }}
                        >
                          View Rankings
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-orange-600 text-orange-400"
                          onClick={() => computeLeaderboardMutation.mutate(period.id)}
                          disabled={computeLeaderboardMutation.isPending}
                        >
                          <RefreshCw className={`w-4 h-4 ${computeLeaderboardMutation.isPending ? 'animate-spin' : ''}`} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="prizes" className="space-y-6">
            {/* Manual Award Section */}
            <Card className="bg-zinc-800/50 border-zinc-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      Manual Award Points
                    </CardTitle>
                    <CardDescription>Award bonus points to individual users</CardDescription>
                  </div>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() => setManualAwardOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Award Points
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <Card className="bg-zinc-800/50 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gift className="w-5 h-5 text-orange-500" />
                  Pending Prize Delivery
                </CardTitle>
                <CardDescription>Prizes approved but not yet delivered</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingPrizes.length === 0 ? (
                  <p className="text-zinc-400 text-center py-8">No pending prizes</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-zinc-700">
                        <TableHead className="text-zinc-400">User</TableHead>
                        <TableHead className="text-zinc-400">Rank</TableHead>
                        <TableHead className="text-zinc-400">Prize</TableHead>
                        <TableHead className="text-zinc-400">Sats</TableHead>
                        <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingPrizes.map((prize) => (
                        <TableRow key={prize.id} className="border-zinc-700">
                          <TableCell>
                            <div>
                              <p className="text-white">{prize.user.username}</p>
                              <p className="text-zinc-500 text-sm">{prize.user.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-orange-500/50 text-orange-400">
                              #{prize.rank}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white">{prize.prizeWon}</TableCell>
                          <TableCell className="text-orange-400">{formatSats(prize.totalSatoshis)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => deliverPrizeMutation.mutate({ entryId: prize.id })}
                              disabled={deliverPrizeMutation.isPending}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Mark Delivered
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Reward Configuration</DialogTitle>
          </DialogHeader>
          {editingConfig && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-zinc-400">Reward Type</Label>
                <p className="text-white font-medium">{editingConfig.displayName}</p>
              </div>
              <div>
                <Label className="text-zinc-400">Base Satoshis</Label>
                <Input
                  type="number"
                  value={editingConfig.baseSatoshis}
                  onChange={(e) => setEditingConfig({ ...editingConfig, baseSatoshis: parseInt(e.target.value) })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div>
                <Label className="text-zinc-400">Daily Limit (empty = unlimited)</Label>
                <Input
                  type="number"
                  value={editingConfig.maxPerDay || ""}
                  onChange={(e) => setEditingConfig({ ...editingConfig, maxPerDay: e.target.value ? parseInt(e.target.value) : null })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="Unlimited"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-zinc-400">Streak Multiplier Eligible</Label>
                <Switch
                  checked={editingConfig.multiplierEligible}
                  onCheckedChange={(checked) => setEditingConfig({ ...editingConfig, multiplierEligible: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-zinc-400">Active</Label>
                <Switch
                  checked={editingConfig.isActive}
                  onCheckedChange={(checked) => setEditingConfig({ ...editingConfig, isActive: checked })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => {
                if (editingConfig) {
                  updateConfigMutation.mutate({
                    id: editingConfig.id,
                    updates: {
                      baseSatoshis: editingConfig.baseSatoshis,
                      multiplierEligible: editingConfig.multiplierEligible,
                      maxPerDay: editingConfig.maxPerDay,
                      isActive: editingConfig.isActive,
                    },
                  });
                }
              }}
              disabled={updateConfigMutation.isPending}
            >
              {updateConfigMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={leaderboardDialogOpen} onOpenChange={setLeaderboardDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700">
          <DialogHeader>
            <DialogTitle className="text-white">Create Leaderboard Period</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-zinc-400">Name</Label>
              <Input
                value={newPeriod.name}
                onChange={(e) => setNewPeriod({ ...newPeriod, name: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="Week 1 Challenge"
              />
            </div>
            <div>
              <Label className="text-zinc-400">Period Type</Label>
              <Select
                value={newPeriod.periodType}
                onValueChange={(value) => setNewPeriod({ ...newPeriod, periodType: value })}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  {PERIOD_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-400">Start Date</Label>
                <Input
                  type="datetime-local"
                  value={newPeriod.startDate}
                  onChange={(e) => setNewPeriod({ ...newPeriod, startDate: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div>
                <Label className="text-zinc-400">End Date</Label>
                <Input
                  type="datetime-local"
                  value={newPeriod.endDate}
                  onChange={(e) => setNewPeriod({ ...newPeriod, endDate: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>
            <div>
              <Label className="text-zinc-400">Campaign Tag (optional)</Label>
              <Input
                value={newPeriod.campaignTag}
                onChange={(e) => setNewPeriod({ ...newPeriod, campaignTag: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="launch_week"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-zinc-400">Has Prizes</Label>
              <Switch
                checked={newPeriod.hasPrizes}
                onCheckedChange={(checked) => setNewPeriod({ ...newPeriod, hasPrizes: checked })}
              />
            </div>
            {newPeriod.hasPrizes && (
              <div>
                <Label className="text-zinc-400">Prize Description</Label>
                <Textarea
                  value={newPeriod.prizeDescription}
                  onChange={(e) => setNewPeriod({ ...newPeriod, prizeDescription: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="Top 10 win hardware wallets"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLeaderboardDialogOpen(false)}>Cancel</Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => createLeaderboardMutation.mutate(newPeriod)}
              disabled={createLeaderboardMutation.isPending || !newPeriod.name || !newPeriod.startDate || !newPeriod.endDate}
            >
              {createLeaderboardMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Period"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewingEntries} onOpenChange={setViewingEntries}>
        <DialogContent className="bg-zinc-900 border-zinc-700 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-white">{selectedPeriod?.name} Rankings</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {entriesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              </div>
            ) : entries.length === 0 ? (
              <p className="text-zinc-400 text-center py-8">No entries yet. Click refresh to compute rankings.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-700">
                    <TableHead className="text-zinc-400">Rank</TableHead>
                    <TableHead className="text-zinc-400">User</TableHead>
                    <TableHead className="text-zinc-400 text-right">Total</TableHead>
                    <TableHead className="text-zinc-400 text-right">Learning</TableHead>
                    <TableHead className="text-zinc-400 text-right">Streak</TableHead>
                    <TableHead className="text-zinc-400 text-right">Referral</TableHead>
                    <TableHead className="text-zinc-400 text-right">Community</TableHead>
                    <TableHead className="text-zinc-400 text-center">Prize</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.id} className="border-zinc-700">
                      <TableCell>
                        <span className={`font-bold ${entry.rank <= 3 ? 'text-orange-400' : 'text-zinc-400'}`}>
                          #{entry.rank}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-white">{entry.user.username}</p>
                          <p className="text-zinc-500 text-sm">{entry.user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-orange-400 font-mono">
                        {formatSats(entry.totalSatoshis)}
                      </TableCell>
                      <TableCell className="text-right text-blue-400 font-mono">
                        {formatSats(entry.learningSatoshis)}
                      </TableCell>
                      <TableCell className="text-right text-yellow-400 font-mono">
                        {formatSats(entry.streakSatoshis)}
                      </TableCell>
                      <TableCell className="text-right text-green-400 font-mono">
                        {formatSats(entry.referralSatoshis)}
                      </TableCell>
                      <TableCell className="text-right text-purple-400 font-mono">
                        {formatSats(entry.communitySatoshis)}
                      </TableCell>
                      <TableCell className="text-center">
                        {entry.prizeDelivered ? (
                          <Badge className="bg-green-500/20 text-green-400">Delivered</Badge>
                        ) : entry.prizeApproved ? (
                          <Badge className="bg-yellow-500/20 text-yellow-400">Approved</Badge>
                        ) : selectedPeriod?.hasPrizes && entry.rank <= 10 ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-orange-600 text-orange-400"
                            onClick={() => approvePrizeMutation.mutate({
                              entryId: entry.id,
                              prizeWon: `Rank #${entry.rank} Prize`
                            })}
                          >
                            Approve
                          </Button>
                        ) : (
                          <span className="text-zinc-500">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Manual Award Dialog */}
      <Dialog open={manualAwardOpen} onOpenChange={setManualAwardOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700">
          <DialogHeader>
            <DialogTitle className="text-white">Award Points to User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-zinc-400">Search User</Label>
              <Input
                value={userSearchQuery}
                onChange={(e) => {
                  setUserSearchQuery(e.target.value);
                  setSelectedUser(null);
                }}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="Search by username or email..."
              />
              {searchResults.length > 0 && !selectedUser && (
                <div className="mt-2 bg-zinc-800 border border-zinc-700 rounded-lg max-h-40 overflow-y-auto">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="p-2 hover:bg-zinc-700 cursor-pointer flex justify-between items-center"
                      onClick={() => {
                        setSelectedUser(user);
                        setUserSearchQuery(user.username);
                      }}
                    >
                      <span className="text-white">{user.username}</span>
                      <span className="text-zinc-500 text-sm">{user.email}</span>
                    </div>
                  ))}
                </div>
              )}
              {selectedUser && (
                <div className="mt-2 p-2 bg-green-900/20 border border-green-700/50 rounded-lg flex justify-between items-center">
                  <span className="text-green-400">Selected: {selectedUser.username}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-zinc-400 hover:text-white"
                    onClick={() => {
                      setSelectedUser(null);
                      setUserSearchQuery("");
                    }}
                  >
                    Change
                  </Button>
                </div>
              )}
            </div>
            <div>
              <Label className="text-zinc-400">Amount (sats)</Label>
              <Input
                type="number"
                value={awardAmount}
                onChange={(e) => setAwardAmount(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="e.g., 1000"
              />
            </div>
            <div>
              <Label className="text-zinc-400">Reason</Label>
              <Textarea
                value={awardReason}
                onChange={(e) => setAwardReason(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="e.g., Beta tester reward, Contest winner, Customer support gesture"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setManualAwardOpen(false)}>Cancel</Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => {
                if (selectedUser && awardAmount) {
                  manualAwardMutation.mutate({
                    userId: selectedUser.id,
                    amount: parseInt(awardAmount),
                    reason: awardReason,
                  });
                }
              }}
              disabled={!selectedUser || !awardAmount || manualAwardMutation.isPending}
            >
              {manualAwardMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Award Points"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

export default function PointsManagement() {
  return (
    <AdminAuthGuard>
      <PointsManagementContent />
    </AdminAuthGuard>
  );
}
