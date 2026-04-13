import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  MessageSquare, Shield, AlertTriangle, CheckCircle, XCircle,
  Search, Filter, Eye, Trash2, Flag, Users, TrendingUp,
  Clock, RefreshCw
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
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

interface ModerationStats {
  totalPosts: number;
  pendingPosts: number;
  flaggedPosts: number;
  removedPosts: number;
  totalReplies: number;
  reportedContent: number;
}

interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  categoryId: number;
  flair: string | null;
  replyCount: number;
  moderationStatus: string;
  moderatedBy: number | null;
  moderatedAt: string | null;
  moderationNote: string | null;
  reportCount: number;
  dateCreated: string;
  user?: { id: number; username: string; email: string };
  category?: { id: number; name: string };
}

interface Reply {
  id: number;
  postId: number;
  content: string;
  userId: number;
  moderationStatus: string;
  moderatedBy: number | null;
  moderatedAt: string | null;
  reportCount: number;
  createdAt: string;
  user?: { id: number; username: string };
  post?: { id: number; title: string };
}

interface AbuseReport {
  id: number;
  reporterId: number;
  contentType: 'post' | 'reply' | 'user';
  contentId: number;
  reportType: string;
  description: string | null;
  status: string;
  reviewedBy: number | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  actionTaken: string | null;
  createdAt: string;
  reporter?: { id: number; username: string };
  contentPreview?: string;
}

function StatsCard({ title, value, icon: Icon, variant = 'default' }: { 
  title: string; 
  value: number; 
  icon: any;
  variant?: 'default' | 'warning' | 'danger' | 'success';
}) {
  const colors = {
    default: 'bg-zinc-500/20 text-zinc-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    danger: 'bg-red-500/20 text-red-400',
    success: 'bg-green-500/20 text-green-400',
  };
  
  return (
    <Card className="bg-zinc-800/50 border-zinc-700">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-zinc-400">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[variant]}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ModerationStatusBadge({ status }: { status: string }) {
  const variants: Record<string, { color: string; label: string }> = {
    pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Pending' },
    approved: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Approved' },
    flagged: { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', label: 'Flagged' },
    removed: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Removed' },
  };
  
  const variant = variants[status] || variants.pending;
  
  return (
    <Badge className={`${variant.color} border`}>
      {variant.label}
    </Badge>
  );
}

function PostCard({ 
  post, 
  isSelected, 
  onSelect, 
  onModerate, 
  onView 
}: { 
  post: Post; 
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onModerate: (status: string) => void;
  onView: () => void;
}) {
  return (
    <Card className={`bg-zinc-800/50 border-zinc-700 ${isSelected ? 'border-orange-500' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox 
            checked={isSelected} 
            onCheckedChange={onSelect}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{post.title}</h3>
                <p className="text-sm text-zinc-400 line-clamp-2 mt-1">{post.content}</p>
              </div>
              <ModerationStatusBadge status={post.moderationStatus} />
            </div>
            
            <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500">
              <span>By @{post.user?.username || 'Unknown'}</span>
              <span>in {post.category?.name || 'Uncategorized'}</span>
              <span>{post.replyCount} replies</span>
              {post.reportCount > 0 && (
                <span className="text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {post.reportCount} reports
                </span>
              )}
              <span>{new Date(post.dateCreated).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center gap-2 mt-3">
              <Button size="sm" variant="ghost" onClick={onView}>
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              {post.moderationStatus !== 'approved' && (
                <Button size="sm" variant="ghost" className="text-green-400" onClick={() => onModerate('approved')}>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
              )}
              {post.moderationStatus !== 'flagged' && (
                <Button size="sm" variant="ghost" className="text-orange-400" onClick={() => onModerate('flagged')}>
                  <Flag className="w-4 h-4 mr-1" />
                  Flag
                </Button>
              )}
              {post.moderationStatus !== 'removed' && (
                <Button size="sm" variant="ghost" className="text-red-400" onClick={() => onModerate('removed')}>
                  <XCircle className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CommunityModerationContent() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [moderationNote, setModerationNote] = useState('');
  const [activeTab, setActiveTab] = useState('posts');
  
  const { data: stats, isLoading: statsLoading } = useQuery<ModerationStats>({
    queryKey: ['/api/admin/community/stats'],
  });
  
  const { data: posts = [], isLoading: postsLoading, refetch: refetchPosts } = useQuery<Post[]>({
    queryKey: ['/api/admin/community/posts', statusFilter],
  });
  
  const { data: replies = [], isLoading: repliesLoading } = useQuery<Reply[]>({
    queryKey: ['/api/admin/community/replies', statusFilter],
  });
  
  const [reportFilter, setReportFilter] = useState('pending');
  const { data: reports = [], isLoading: reportsLoading } = useQuery<AbuseReport[]>({
    queryKey: ['/api/admin/community/reports', reportFilter],
  });
  
  const reviewReportMutation = useMutation({
    mutationFn: async ({ reportId, status, reviewNote, actionTaken }: { 
      reportId: number; 
      status: string; 
      reviewNote?: string; 
      actionTaken?: string;
    }) => {
      return apiRequest('POST', `/api/admin/community/reports/${reportId}/review`, { status, reviewNote, actionTaken });
    },
    onSuccess: () => {
      toast({ title: "Report reviewed successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/community/reports'] });
    },
    onError: () => {
      toast({ title: "Failed to review report", variant: "destructive" });
    },
  });
  
  const moderateMutation = useMutation({
    mutationFn: async ({ postId, status, note }: { postId: number; status: string; note?: string }) => {
      return apiRequest('POST', `/api/admin/community/posts/${postId}/moderate`, { status, note });
    },
    onSuccess: () => {
      toast({ title: "Post moderated successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/community/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/community/stats'] });
    },
    onError: () => {
      toast({ title: "Failed to moderate post", variant: "destructive" });
    },
  });
  
  const bulkModerateMutation = useMutation({
    mutationFn: async ({ postIds, status, note }: { postIds: number[]; status: string; note?: string }) => {
      return apiRequest('POST', '/api/admin/community/posts/bulk-moderate', { postIds, status, note });
    },
    onSuccess: () => {
      toast({ title: "Posts moderated successfully" });
      setSelectedPosts([]);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/community/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/community/stats'] });
    },
    onError: () => {
      toast({ title: "Failed to moderate posts", variant: "destructive" });
    },
  });
  
  const moderateReplyMutation = useMutation({
    mutationFn: async ({ replyId, status }: { replyId: number; status: string }) => {
        console.log("Moderating reply", { replyId, status });
      return apiRequest('POST', `/api/admin/community/replies/${replyId}/moderate`, { status });
    },
    onSuccess: () => {
      toast({ title: "Reply moderated successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/community/replies'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/community/stats'] });
    },
    onError: () => {
      toast({ title: "Failed to moderate reply", variant: "destructive" });
    },
  });
  
  const filteredPosts = posts.filter(post => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return post.title.toLowerCase().includes(query) || 
             post.content.toLowerCase().includes(query) ||
             post.user?.username.toLowerCase().includes(query);
    }
    return true;
  });
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPosts(filteredPosts.map(p => p.id));
    } else {
      setSelectedPosts([]);
    }
  };
  
  const handleSelectPost = (postId: number, checked: boolean) => {
    if (checked) {
      setSelectedPosts([...selectedPosts, postId]);
    } else {
      setSelectedPosts(selectedPosts.filter(id => id !== postId));
    }
  };
  
  const handleBulkModerate = (status: string) => {
    if (selectedPosts.length === 0) return;
    bulkModerateMutation.mutate({ postIds: selectedPosts, status });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Community Moderation</h1>
          <p className="text-zinc-400 mt-1">Review and moderate forum posts and replies</p>
        </div>
        <Button variant="outline" onClick={() => refetchPosts()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard 
          title="Total Posts" 
          value={stats?.totalPosts || 0} 
          icon={MessageSquare} 
        />
        <StatsCard 
          title="Pending Review" 
          value={stats?.pendingPosts || 0} 
          icon={Clock}
          variant="warning"
        />
        <StatsCard 
          title="Flagged" 
          value={stats?.flaggedPosts || 0} 
          icon={Flag}
          variant="warning"
        />
        <StatsCard 
          title="Removed" 
          value={stats?.removedPosts || 0} 
          icon={XCircle}
          variant="danger"
        />
        <StatsCard 
          title="Total Replies" 
          value={stats?.totalReplies || 0} 
          icon={Users}
        />
        <StatsCard 
          title="Reported" 
          value={stats?.reportedContent || 0} 
          icon={AlertTriangle}
          variant="danger"
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-zinc-800">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="replies">Replies</TabsTrigger>
          <TabsTrigger value="reports">
            Reports
            {reports.filter(r => r.status === 'pending').length > 0 && (
              <Badge className="ml-2 bg-red-500/20 text-red-400 border-red-500/30" variant="outline">
                {reports.filter(r => r.status === 'pending').length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="space-y-4">
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <Input
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-zinc-900 border-zinc-700"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 bg-zinc-900 border-zinc-700">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                    <SelectItem value="removed">Removed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {selectedPosts.length > 0 && (
                <div className="flex items-center gap-4 mt-4 p-3 bg-zinc-900 rounded-lg">
                  <span className="text-sm text-zinc-400">{selectedPosts.length} selected</span>
                  <Button size="sm" variant="ghost" className="text-green-400" onClick={() => handleBulkModerate('approved')}>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve All
                  </Button>
                  <Button size="sm" variant="ghost" className="text-orange-400" onClick={() => handleBulkModerate('flagged')}>
                    <Flag className="w-4 h-4 mr-1" />
                    Flag All
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-400" onClick={() => handleBulkModerate('removed')}>
                    <XCircle className="w-4 h-4 mr-1" />
                    Remove All
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setSelectedPosts([])}>
                    Clear Selection
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {postsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <Card className="bg-zinc-800/50 border-zinc-700">
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white">No posts found</h3>
                <p className="text-zinc-400 mt-1">No posts match your current filters</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-4">
                <Checkbox 
                  checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-zinc-400">Select all</span>
              </div>
              {filteredPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  isSelected={selectedPosts.includes(post.id)}
                  onSelect={(checked) => handleSelectPost(post.id, checked)}
                  onModerate={(status) => moderateMutation.mutate({ postId: post.id, status })}
                  onView={() => setSelectedPost(post)}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="replies" className="space-y-4">
          {repliesLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : replies.length === 0 ? (
            <Card className="bg-zinc-800/50 border-zinc-700">
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white">No replies found</h3>
                <p className="text-zinc-400 mt-1">No replies match your current filters</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {replies.map(reply => (
                <Card key={reply.id} className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-white line-clamp-2">{reply.content}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                          <span>By @{reply.user?.username || 'Unknown'}</span>
                          <span>on "{reply.post?.title || 'Unknown Post'}"</span>
                          {reply.reportCount > 0 && (
                            <span className="text-red-400 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              {reply.reportCount} reports
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ModerationStatusBadge status={reply.moderationStatus} />
                        <div className="flex gap-1">
                          {reply.moderationStatus !== 'approved' && (
                            <Button size="sm" variant="ghost" className="text-green-400" onClick={() => moderateReplyMutation.mutate({ replyId: reply.id, status: 'approved' })}>
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          {reply.moderationStatus !== 'removed' && (
                            <Button size="sm" variant="ghost" className="text-red-400" onClick={() => moderateReplyMutation.mutate({ replyId: reply.id, status: 'removed' })}>
                              <XCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Select value={reportFilter} onValueChange={setReportFilter}>
                  <SelectTrigger className="w-40 bg-zinc-700 border-zinc-600">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="dismissed">Dismissed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          {reportsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : reports.length === 0 ? (
            <Card className="bg-zinc-800/50 border-zinc-700">
              <CardContent className="p-8 text-center">
                <Flag className="w-12 h-12 mx-auto text-zinc-600 mb-4" />
                <h3 className="text-lg font-semibold text-white">No Reports</h3>
                <p className="text-zinc-400 mt-1">No abuse reports match your current filter</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {reports.map(report => (
                <Card key={report.id} className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-zinc-700">{report.contentType}</Badge>
                          <Badge className={`${
                            report.reportType === 'spam' ? 'bg-yellow-500/20 text-yellow-400' :
                            report.reportType === 'harassment' ? 'bg-red-500/20 text-red-400' :
                            report.reportType === 'misinformation' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-zinc-500/20 text-zinc-400'
                          }`}>{report.reportType}</Badge>
                          <Badge className={`${
                            report.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                            report.status === 'resolved' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            report.status === 'dismissed' ? 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' :
                            'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          } border`}>{report.status}</Badge>
                        </div>
                        {report.contentPreview && (
                          <p className="text-zinc-300 text-sm line-clamp-2 mb-2">"{report.contentPreview}"</p>
                        )}
                        {report.description && (
                          <p className="text-zinc-400 text-sm italic">Reason: {report.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                          <span>Reported by @{report.reporter?.username || 'Unknown'}</span>
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {report.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-green-400"
                            onClick={() => reviewReportMutation.mutate({ 
                              reportId: report.id, 
                              status: 'resolved',
                              actionTaken: 'content_removed'
                            })}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Resolve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-zinc-400"
                            onClick={() => reviewReportMutation.mutate({ 
                              reportId: report.id, 
                              status: 'dismissed',
                              actionTaken: 'no_action'
                            })}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Dismiss
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">{selectedPost?.title}</DialogTitle>
            <DialogDescription>
              Posted by @{selectedPost?.user?.username} in {selectedPost?.category?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-zinc-800 rounded-lg">
              <p className="text-zinc-300 whitespace-pre-wrap">{selectedPost?.content}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400">Current status:</span>
              {selectedPost && <ModerationStatusBadge status={selectedPost.moderationStatus} />}
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Moderation Note (optional)</label>
              <Textarea
                value={moderationNote}
                onChange={(e) => setModerationNote(e.target.value)}
                placeholder="Add a note about this moderation action..."
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="ghost" onClick={() => setSelectedPost(null)}>
              Cancel
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                if (selectedPost) {
                  moderateMutation.mutate({ postId: selectedPost.id, status: 'approved', note: moderationNote });
                  setSelectedPost(null);
                  setModerationNote('');
                }
              }}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button 
              className="bg-orange-600 hover:bg-orange-700"
              onClick={() => {
                if (selectedPost) {
                  moderateMutation.mutate({ postId: selectedPost.id, status: 'flagged', note: moderationNote });
                  setSelectedPost(null);
                  setModerationNote('');
                }
              }}
            >
              <Flag className="w-4 h-4 mr-2" />
              Flag
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (selectedPost) {
                  moderateMutation.mutate({ postId: selectedPost.id, status: 'removed', note: moderationNote });
                  setSelectedPost(null);
                  setModerationNote('');
                }
              }}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CommunityModeration() {
  return (
    <AdminAuthGuard>
      <AdminLayout>
        <CommunityModerationContent />
      </AdminLayout>
    </AdminAuthGuard>
  );
}
