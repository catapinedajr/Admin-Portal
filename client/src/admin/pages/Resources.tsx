import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Link2, Video, FileText, File, Plus, Trash2, 
  Edit, Eye, EyeOff, ExternalLink, GripVertical
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

interface ResourceLink {
    id: number;
    title: string;
    description: string | null;
    url: string;
    type: string;
    category: string | null;
    thumbnailUrl: string | null;
    sortOrder: number;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

const RESOURCE_TYPES = [
    { value: 'video', label: 'Video', icon: Video },
    { value: 'article', label: 'Article', icon: FileText },
    { value: 'document', label: 'Document', icon: File },
    { value: 'other', label: 'Other', icon: Link2 },
];

const CATEGORIES = [
    { value: 'bitcoin-basics', label: 'Bitcoin Basics' },
    { value: 'economics', label: 'Economics' },
    { value: 'security', label: 'Security' },
    { value: 'technical', label: 'Technical' },
    { value: 'history', label: 'History' },
    { value: 'reference', label: 'Reference' },
];

function getTypeIcon(type: string) {
    const typeConfig = RESOURCE_TYPES.find(t => t.value === type);
    return typeConfig?.icon || Link2;
}

function ResourcesPage() {
    const { toast } = useToast();
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingResource, setEditingResource] = useState<ResourceLink | null>(null);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        url: '',
        type: 'video',
        category: 'none',
        thumbnailUrl: '',
        isPublished: false,
    });

    const { data: resources = [], isLoading } = useQuery<ResourceLink[]>({
        
        queryKey: ["/api/admin/resources", typeFilter],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (typeFilter !== 'all') params.append('type', typeFilter);
            
            const token = localStorage.getItem('admin_session');
            const res = await fetch(`/api/admin/resources?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const json = await res.json();
            console.log('hit api with filter:', typeFilter, 'response:', json);
            return json;
        }
    });

    console.log('resources:', resources);

    const createMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            return apiRequest('POST', '/api/admin/resources', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/resources"] });
            setIsDialogOpen(false);
            resetForm();
            toast({ title: "Resource created successfully" });
        },
        onError: () => {
            toast({ title: "Failed to create resource", variant: "destructive" });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<typeof formData> }) => {
            return apiRequest('PATCH', `/api/admin/resources/${id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/resources"] });
            setIsDialogOpen(false);
            setEditingResource(null);
            resetForm();
            toast({ title: "Resource updated successfully" });
        },
        onError: () => {
            toast({ title: "Failed to update resource", variant: "destructive" });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            return apiRequest('DELETE', `/api/admin/resources/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/resources"] });
            toast({ title: "Resource deleted" });
        },
        onError: () => {
            toast({ title: "Failed to delete resource", variant: "destructive" });
        }
    });

    const togglePublishMutation = useMutation({
        mutationFn: async ({ id, isPublished }: { id: number; isPublished: boolean }) => {
            return apiRequest('PATCH', `/api/admin/resources/${id}`, { isPublished });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/resources"] });
        }
    });

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            url: '',
            type: 'video',
            category: 'none',
            thumbnailUrl: '',
            isPublished: false,
        });
    };

    const openCreateDialog = () => {
        setEditingResource(null);
        resetForm();
        setIsDialogOpen(true);
    };

    const openEditDialog = (resource: ResourceLink) => {
        setEditingResource(resource);
        setFormData({
            title: resource.title,
            description: resource.description || '',
            url: resource.url,
            type: resource.type,
            category: resource.category || 'none',
            thumbnailUrl: resource.thumbnailUrl || '',
            isPublished: resource.isPublished,
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = () => {

        if (!formData.title || !formData.url || !formData.type) {
            toast({ title: "Title, URL, and type are required", variant: "destructive" });
            return;
        }

        const submitData = {
            ...formData,
            category: formData.category === 'none' ? '' : formData.category,
        };

        if (editingResource) {
            updateMutation.mutate({ id: editingResource.id, data: submitData });
        } else {
            createMutation.mutate(submitData);
        }
    };

    const publishedCount = resources.filter(r => r.isPublished).length;
    const videoCount = resources.filter(r => r.type === 'video').length;
    const articleCount = resources.filter(r => r.type === 'article').length;
    const docCount = resources.filter(r => r.type === 'document').length;

    return (
        <AdminLayout>
        <div className="space-y-6">
            <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-white">Resources</h1>
                <p className="text-zinc-400">Manage educational videos, articles, and documents</p>
            </div>
            <Button onClick={openCreateDialog} className="bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Resource
            </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm text-zinc-400">Total Resources</p>
                    <p className="text-2xl font-bold text-white">{resources.length}</p>
                    </div>
                    <Link2 className="w-8 h-8 text-orange-500" />
                </div>
                </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm text-zinc-400">Published</p>
                    <p className="text-2xl font-bold text-green-400">{publishedCount}</p>
                    </div>
                    <Eye className="w-8 h-8 text-green-500" />
                </div>
                </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm text-zinc-400">Videos</p>
                    <p className="text-2xl font-bold text-blue-400">{videoCount}</p>
                    </div>
                    <Video className="w-8 h-8 text-blue-500" />
                </div>
                </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm text-zinc-400">Articles & Docs</p>
                    <p className="text-2xl font-bold text-purple-400">{articleCount + docCount}</p>
                    </div>
                    <FileText className="w-8 h-8 text-purple-500" />
                </div>
                </CardContent>
            </Card>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <div className="flex items-center justify-between">
                <CardTitle className="text-white">Resource Library</CardTitle>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-40 bg-zinc-800 border-zinc-700">
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {RESOURCE_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
                ) : resources.length === 0 ? (
                <div className="text-center py-12">
                    <Link2 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-400">No resources yet</p>
                    <p className="text-zinc-500 text-sm">Add videos, articles, and documents to your library</p>
                </div>
                ) : (
                <div className="space-y-3">
                    {resources.map((resource) => {
                    const TypeIcon = getTypeIcon(resource.type);
                    return (
                        <div
                        key={resource.id}
                        className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50 hover:border-zinc-600 transition-colors"
                        >
                        <div className="flex items-center gap-2 text-zinc-500">
                            <GripVertical className="w-4 h-4" />
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-zinc-700 flex items-center justify-center">
                            <TypeIcon className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                            <h3 className="font-medium text-white truncate">{resource.title}</h3>
                            {resource.category && (
                                <Badge variant="outline" className="text-xs border-zinc-600 text-zinc-400">
                                {resource.category}
                                </Badge>
                            )}
                            </div>
                            <p className="text-sm text-zinc-500 truncate">{resource.url}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => togglePublishMutation.mutate({ 
                                id: resource.id, 
                                isPublished: !resource.isPublished 
                            })}
                            className={resource.isPublished ? "text-green-400" : "text-zinc-500"}
                            >
                            {resource.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </Button>
                            <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(resource.url, '_blank')}
                            className="text-zinc-400 hover:text-white"
                            >
                            <ExternalLink className="w-4 h-4" />
                            </Button>
                            <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(resource)}
                            className="text-zinc-400 hover:text-white"
                            >
                            <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                if (confirm('Delete this resource?')) {
                                deleteMutation.mutate(resource.id);
                                }
                            }}
                            className="text-zinc-400 hover:text-red-400"
                            >
                            <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                        </div>
                    );
                    })}
                </div>
                )}
            </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg">
                <DialogHeader>
                <DialogTitle className="text-white">
                    {editingResource ? 'Edit Resource' : 'Add Resource'}
                </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-zinc-300">Title *</Label>
                    <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Bitcoin Whitepaper"
                    className="bg-zinc-800 border-zinc-700"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-zinc-300">URL *</Label>
                    <Input
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://bitcoin.org/bitcoin.pdf"
                    className="bg-zinc-800 border-zinc-700"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label className="text-zinc-300">Type *</Label>
                    <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700">
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        {RESOURCE_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>
                    <div className="space-y-2">
                    <Label className="text-zinc-300">Category</Label>
                    <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700">
                        <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {CATEGORIES.map(cat => (
                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-zinc-300">Description</Label>
                    <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="A brief description of this resource..."
                    className="bg-zinc-800 border-zinc-700 h-20"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-zinc-300">Thumbnail URL (optional)</Label>
                    <Input
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    placeholder="https://example.com/thumbnail.jpg"
                    className="bg-zinc-800 border-zinc-700"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Label className="text-zinc-300">Published</Label>
                    <Switch
                    checked={formData.isPublished}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                    />
                </div>
                </div>
                <DialogFooter>
                <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                </Button>
                <Button 
                    onClick={handleSubmit}
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="bg-orange-500 hover:bg-orange-600"
                >
                    {editingResource ? 'Save Changes' : 'Create Resource'}
                </Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
        </div>
        </AdminLayout>
    );
}

export default function Resources() {
    return (
        <AdminAuthGuard>
        <ResourcesPage />
        </AdminAuthGuard>
    );
}
