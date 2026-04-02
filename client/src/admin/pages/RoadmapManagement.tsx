import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Plus, Lightbulb, Rocket, CheckCircle, Clock, ArrowUp, ArrowRight,
  Edit2, Trash2, Calendar, Tag, Users, BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface RoadmapIdea {
  id: number;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  status: string;
  votes: number;
  effort: string | null;
  impact: string | null;
  targetRelease: string | null;
  targetQuarter: string | null;
  requestedBy: string | null;
  assignedTo: string | null;
  createdAt: string;
}

interface RoadmapRelease {
  id: number;
  version: string;
  name: string;
  description: string | null;
  status: string;
  targetDate: string | null;
  releaseDate: string | null;
  createdAt: string;
}

interface RoadmapStats {
  totalIdeas: number;
  backlogIdeas: number;
  inProgressIdeas: number;
  completedIdeas: number;
  totalReleases: number;
}

const IDEA_STATUSES = [
  { value: 'backlog', label: 'Backlog', color: 'bg-zinc-600' },
  { value: 'planned', label: 'Planned', color: 'bg-blue-600' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-600' },
  { value: 'review', label: 'In Review', color: 'bg-purple-600' },
  { value: 'completed', label: 'Completed', color: 'bg-green-600' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-600' },
];

const CATEGORIES = [
  { value: 'feature', label: 'New Feature' },
  { value: 'improvement', label: 'Improvement' },
  { value: 'bug', label: 'Bug Fix' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'content', label: 'Content' },
  { value: 'design', label: 'Design' },
];

const PRIORITIES = [
  { value: 'critical', label: 'Critical', color: 'text-red-500' },
  { value: 'high', label: 'High', color: 'text-orange-500' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-500' },
  { value: 'low', label: 'Low', color: 'text-green-500' },
];

const EFFORTS = [
  { value: 'xs', label: 'XS (hours)' },
  { value: 's', label: 'S (1-2 days)' },
  { value: 'm', label: 'M (3-5 days)' },
  { value: 'l', label: 'L (1-2 weeks)' },
  { value: 'xl', label: 'XL (2+ weeks)' },
];

const IMPACTS = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const generateQuarterOptions = () => {
  const currentYear = new Date().getFullYear();
  const quarters = [];
  for (let year = currentYear; year <= currentYear + 2; year++) {
    for (let q = 1; q <= 4; q++) {
      quarters.push({ value: `Q${q} ${year}`, label: `Q${q} ${year}` });
    }
  }
  return quarters;
};

const QUARTERS = generateQuarterOptions();

function RoadmapManagementContent() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("kanban");
  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [editingIdea, setEditingIdea] = useState<RoadmapIdea | null>(null);
  const [editingRelease, setEditingRelease] = useState<RoadmapRelease | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterQuarter, setFilterQuarter] = useState<string>("all");

  const [ideaForm, setIdeaForm] = useState({
    title: '',
    description: '',
    category: 'feature',
    priority: 'medium',
    status: 'backlog',
    effort: '',
    impact: '',
    targetRelease: '',
    targetQuarter: '',
    requestedBy: '',
    assignedTo: '',
  });

  const [releaseForm, setReleaseForm] = useState({
    version: '',
    name: '',
    description: '',
    status: 'planned',
    targetDate: '',
  });

  const { data: stats } = useQuery<RoadmapStats>({
    queryKey: ["/api/admin/roadmap/stats"],
  });

  const { data: ideas = [] } = useQuery<RoadmapIdea[]>({
    queryKey: ["/api/admin/roadmap/ideas"],
  });

  const { data: releases = [] } = useQuery<RoadmapRelease[]>({
    queryKey: ["/api/admin/roadmap/releases"],
  });

  const createIdeaMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/roadmap/ideas", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/roadmap/ideas"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/roadmap/stats"] });
      setShowIdeaModal(false);
      resetIdeaForm();
      toast({ title: "Idea created successfully" });
    },
  });

  const updateIdeaMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiRequest("PATCH", `/api/admin/roadmap/ideas/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/roadmap/ideas"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/roadmap/stats"] });
      setShowIdeaModal(false);
      setEditingIdea(null);
      resetIdeaForm();
      toast({ title: "Idea updated successfully" });
    },
  });

  const updateIdeaStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiRequest("PATCH", `/api/admin/roadmap/ideas/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/roadmap/ideas"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/roadmap/stats"] });
    },
  });

  const deleteIdeaMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/roadmap/ideas/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/roadmap/ideas"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/roadmap/stats"] });
      toast({ title: "Idea deleted" });
    },
  });

  const createReleaseMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/roadmap/releases", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/roadmap/releases"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/roadmap/stats"] });
      setShowReleaseModal(false);
      resetReleaseForm();
      toast({ title: "Release created successfully" });
    },
  });

  const updateReleaseMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiRequest("PATCH", `/api/admin/roadmap/releases/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/roadmap/releases"] });
      setShowReleaseModal(false);
      setEditingRelease(null);
      resetReleaseForm();
      toast({ title: "Release updated successfully" });
    },
  });

  const deleteReleaseMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/roadmap/releases/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/roadmap/releases"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/roadmap/stats"] });
      toast({ title: "Release deleted" });
    },
  });

  const resetIdeaForm = () => {
    setIdeaForm({
      title: '', description: '', category: 'feature', priority: 'medium',
      status: 'backlog', effort: '', impact: '', targetRelease: '',
      targetQuarter: '', requestedBy: '', assignedTo: '',
    });
  };

  const resetReleaseForm = () => {
    setReleaseForm({
      version: '', name: '', description: '', status: 'planned', targetDate: '',
    });
  };

  const openEditIdea = (idea: RoadmapIdea) => {
    setEditingIdea(idea);
    setIdeaForm({
      title: idea.title,
      description: idea.description || '',
      category: idea.category,
      priority: idea.priority,
      status: idea.status,
      effort: idea.effort || '',
      impact: idea.impact || '',
      targetRelease: idea.targetRelease || '',
      targetQuarter: idea.targetQuarter || '',
      requestedBy: idea.requestedBy || '',
      assignedTo: idea.assignedTo || '',
    });
    setShowIdeaModal(true);
  };

  const openEditRelease = (release: RoadmapRelease) => {
    setEditingRelease(release);
    setReleaseForm({
      version: release.version,
      name: release.name,
      description: release.description || '',
      status: release.status,
      targetDate: release.targetDate?.split('T')[0] || '',
    });
    setShowReleaseModal(true);
  };

  const handleIdeaSubmit = () => {
    const data = {
      ...ideaForm,
      description: ideaForm.description || null,
      effort: ideaForm.effort || null,
      impact: ideaForm.impact || null,
      targetRelease: ideaForm.targetRelease || null,
      targetQuarter: ideaForm.targetQuarter || null,
      requestedBy: ideaForm.requestedBy || null,
      assignedTo: ideaForm.assignedTo || null,
    };

    if (editingIdea) {
      updateIdeaMutation.mutate({ id: editingIdea.id, data });
    } else {
      createIdeaMutation.mutate(data);
    }
  };

  const handleReleaseSubmit = () => {
    const data = {
      ...releaseForm,
      description: releaseForm.description || null,
      targetDate: releaseForm.targetDate || null,
    };

    if (editingRelease) {
      updateReleaseMutation.mutate({ id: editingRelease.id, data });
    } else {
      createReleaseMutation.mutate(data);
    }
  };

  const filteredIdeas = ideas.filter(idea => {
    if (filterCategory !== 'all' && idea.category !== filterCategory) return false;
    if (filterPriority !== 'all' && idea.priority !== filterPriority) return false;
    if (filterQuarter !== 'all' && idea.targetQuarter !== filterQuarter) return false;
    return true;
  });

  const getStatusIdeas = (status: string) => filteredIdeas.filter(i => i.status === status);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Product Roadmap</h1>
            <p className="text-zinc-400 mt-1">Manage product ideas and releases</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => { resetReleaseForm(); setEditingRelease(null); setShowReleaseModal(true); }}
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              data-testid="button-add-release"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Add Release
            </Button>
            <Button
              onClick={() => { resetIdeaForm(); setEditingIdea(null); setShowIdeaModal(true); }}
              className="bg-orange-500 hover:bg-orange-600"
              data-testid="button-add-idea"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Idea
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats?.totalIdeas || 0}</p>
                  <p className="text-sm text-zinc-400">Total Ideas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats?.backlogIdeas || 0}</p>
                  <p className="text-sm text-zinc-400">Backlog</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <ArrowRight className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats?.inProgressIdeas || 0}</p>
                  <p className="text-sm text-zinc-400">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats?.completedIdeas || 0}</p>
                  <p className="text-sm text-zinc-400">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Rocket className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats?.totalReleases || 0}</p>
                  <p className="text-sm text-zinc-400">Releases</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="kanban" className="data-[state=active]:bg-zinc-800">
              Kanban Board
            </TabsTrigger>
            <TabsTrigger value="list" className="data-[state=active]:bg-zinc-800">
              All Ideas
            </TabsTrigger>
            <TabsTrigger value="releases" className="data-[state=active]:bg-zinc-800">
              Releases
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="mt-4">
            <div className="flex items-center gap-4 mb-4 p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
              <span className="text-sm text-zinc-400">Filters:</span>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40 bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-40 bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="all">All Priorities</SelectItem>
                  {PRIORITIES.map(p => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterQuarter} onValueChange={setFilterQuarter}>
                <SelectTrigger className="w-40 bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Quarter" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="all">All Quarters</SelectItem>
                  {QUARTERS.map(q => (
                    <SelectItem key={q.value} value={q.value}>{q.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(filterCategory !== 'all' || filterPriority !== 'all' || filterQuarter !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setFilterCategory('all'); setFilterPriority('all'); setFilterQuarter('all'); }}
                  className="text-zinc-400 hover:text-white"
                >
                  Clear Filters
                </Button>
              )}
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4">
              {IDEA_STATUSES.filter(s => s.value !== 'cancelled').map(status => (
                <div key={status.value} className="flex-shrink-0 w-72">
                  <div className={`${status.color} rounded-t-lg px-3 py-2`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">{status.label}</span>
                      <span className="text-sm text-white/80">{getStatusIdeas(status.value).length}</span>
                    </div>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 border-t-0 rounded-b-lg p-2 min-h-[400px] space-y-2">
                    {getStatusIdeas(status.value).map(idea => (
                      <Card
                        key={idea.id}
                        className="bg-zinc-800 border-zinc-700 cursor-pointer hover:border-orange-500/50 transition-colors"
                        onClick={() => openEditIdea(idea)}
                        data-testid={`idea-card-${idea.id}`}
                      >
                        <CardContent className="p-3">
                          <h4 className="font-medium text-white text-sm">{idea.title}</h4>
                          {idea.targetQuarter && (
                            <span className="text-xs text-orange-400 mt-1 block">{idea.targetQuarter}</span>
                          )}
                          <div className="flex flex-wrap items-center gap-1 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {CATEGORIES.find(c => c.value === idea.category)?.label}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-xs ${PRIORITIES.find(p => p.value === idea.priority)?.color}`}
                            >
                              {idea.priority}
                            </Badge>
                          </div>
                          {idea.effort && idea.impact && (
                            <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400">
                              <span>Effort: {idea.effort.toUpperCase()}</span>
                              <span>•</span>
                              <span>Impact: {idea.impact}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-4">
            <div className="space-y-3">
              {filteredIdeas.map(idea => (
                <Card key={idea.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-semibold text-white">{idea.title}</h3>
                          {idea.description && (
                            <p className="text-sm text-zinc-400 mt-1 line-clamp-1">{idea.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">{CATEGORIES.find(c => c.value === idea.category)?.label}</Badge>
                            <Badge className={IDEA_STATUSES.find(s => s.value === idea.status)?.color}>
                              {IDEA_STATUSES.find(s => s.value === idea.status)?.label}
                            </Badge>
                            <Badge variant="outline" className={PRIORITIES.find(p => p.value === idea.priority)?.color}>
                              {idea.priority}
                            </Badge>
                            {idea.targetQuarter && (
                              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                                {idea.targetQuarter}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditIdea(idea)}
                          className="text-zinc-400 hover:text-white"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteIdeaMutation.mutate(idea.id)}
                          className="text-zinc-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredIdeas.length === 0 && (
                <div className="text-center py-12 text-zinc-500">
                  <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No ideas yet. Add your first product idea to get started.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="releases" className="mt-4">
            <div className="space-y-3">
              {releases.map(release => (
                <Card key={release.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">{release.name}</h3>
                          <Badge variant="outline" className="text-orange-400 border-orange-400/50">
                            v{release.version}
                          </Badge>
                        </div>
                        {release.description && (
                          <p className="text-sm text-zinc-400 mt-1">{release.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-zinc-500">
                          {release.targetDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Target: {new Date(release.targetDate).toLocaleDateString()}
                            </span>
                          )}
                          <Badge className={
                            release.status === 'released' ? 'bg-green-600' :
                            release.status === 'in_progress' ? 'bg-yellow-600' : 'bg-blue-600'
                          }>
                            {release.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditRelease(release)}
                          className="text-zinc-400 hover:text-white"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteReleaseMutation.mutate(release.id)}
                          className="text-zinc-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {releases.length === 0 && (
                <div className="text-center py-12 text-zinc-500">
                  <Rocket className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No releases yet. Plan your first release.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showIdeaModal} onOpenChange={setShowIdeaModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingIdea ? 'Edit Idea' : 'New Idea'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-zinc-300">Title *</Label>
              <Input
                value={ideaForm.title}
                onChange={(e) => setIdeaForm(f => ({ ...f, title: e.target.value }))}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="Feature title"
                data-testid="input-idea-title"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Description</Label>
              <Textarea
                value={ideaForm.description}
                onChange={(e) => setIdeaForm(f => ({ ...f, description: e.target.value }))}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                rows={3}
                placeholder="Describe the idea..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-300">Category</Label>
                <Select value={ideaForm.category} onValueChange={(v) => setIdeaForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-zinc-300">Priority</Label>
                <Select value={ideaForm.priority} onValueChange={(v) => setIdeaForm(f => ({ ...f, priority: v }))}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {PRIORITIES.map(p => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-300">Status</Label>
                <Select value={ideaForm.status} onValueChange={(v) => setIdeaForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {IDEA_STATUSES.map(s => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-zinc-300">Target Quarter</Label>
                <Select value={ideaForm.targetQuarter || "none"} onValueChange={(v) => setIdeaForm(f => ({ ...f, targetQuarter: v === "none" ? "" : v }))}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-1">
                    <SelectValue placeholder="Select quarter" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="none">Not scheduled</SelectItem>
                    {QUARTERS.map(q => (
                      <SelectItem key={q.value} value={q.value}>{q.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-300">Effort</Label>
                <Select value={ideaForm.effort || "none"} onValueChange={(v) => setIdeaForm(f => ({ ...f, effort: v === "none" ? "" : v }))}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-1">
                    <SelectValue placeholder="Estimate effort" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="none">Not estimated</SelectItem>
                    {EFFORTS.map(e => (
                      <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-zinc-300">Impact</Label>
                <Select value={ideaForm.impact || "none"} onValueChange={(v) => setIdeaForm(f => ({ ...f, impact: v === "none" ? "" : v }))}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-1">
                    <SelectValue placeholder="Expected impact" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="none">Not assessed</SelectItem>
                    {IMPACTS.map(i => (
                      <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-300">Requested By</Label>
                <Input
                  value={ideaForm.requestedBy}
                  onChange={(e) => setIdeaForm(f => ({ ...f, requestedBy: e.target.value }))}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="Customer or team"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Assigned To</Label>
                <Input
                  value={ideaForm.assignedTo}
                  onChange={(e) => setIdeaForm(f => ({ ...f, assignedTo: e.target.value }))}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="Team member"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setShowIdeaModal(false)}>Cancel</Button>
              <Button
                onClick={handleIdeaSubmit}
                disabled={!ideaForm.title || createIdeaMutation.isPending || updateIdeaMutation.isPending}
                className="bg-orange-500 hover:bg-orange-600"
                data-testid="button-save-idea"
              >
                {editingIdea ? 'Update' : 'Create'} Idea
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showReleaseModal} onOpenChange={setShowReleaseModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingRelease ? 'Edit Release' : 'New Release'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-300">Version *</Label>
                <Input
                  value={releaseForm.version}
                  onChange={(e) => setReleaseForm(f => ({ ...f, version: e.target.value }))}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="1.0.0"
                  data-testid="input-release-version"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Name *</Label>
                <Input
                  value={releaseForm.name}
                  onChange={(e) => setReleaseForm(f => ({ ...f, name: e.target.value }))}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="Release name"
                />
              </div>
            </div>
            <div>
              <Label className="text-zinc-300">Description</Label>
              <Textarea
                value={releaseForm.description}
                onChange={(e) => setReleaseForm(f => ({ ...f, description: e.target.value }))}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-300">Status</Label>
                <Select value={releaseForm.status} onValueChange={(v) => setReleaseForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="released">Released</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-zinc-300">Target Date</Label>
                <Input
                  type="date"
                  value={releaseForm.targetDate}
                  onChange={(e) => setReleaseForm(f => ({ ...f, targetDate: e.target.value }))}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setShowReleaseModal(false)}>Cancel</Button>
              <Button
                onClick={handleReleaseSubmit}
                disabled={!releaseForm.version || !releaseForm.name || createReleaseMutation.isPending || updateReleaseMutation.isPending}
                className="bg-orange-500 hover:bg-orange-600"
                data-testid="button-save-release"
              >
                {editingRelease ? 'Update' : 'Create'} Release
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

export default function RoadmapManagement() {
  return (
    <AdminAuthGuard>
      <RoadmapManagementContent />
    </AdminAuthGuard>
  );
}
