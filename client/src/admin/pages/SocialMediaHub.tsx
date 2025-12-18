import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Plus, Calendar, Send, Eye, MousePointerClick, Users, TrendingUp,
  Twitter, Clock, BarChart3, ArrowRight, Edit2, Trash2, Image,
  AlertCircle, CheckCircle2, Loader2, Link as LinkIcon, Sparkles, RefreshCw,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "../components/AdminLayout";
import { format, addDays, startOfWeek, startOfMonth, endOfMonth, isSameDay, isSameMonth, parseISO, addMonths, subMonths, getDay, isValid } from "date-fns";

// Helper to safely parse dates that may be in different formats
function safeParseDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr) return null;
  
  // Try parseISO first (handles ISO format)
  let parsed = parseISO(dateStr);
  if (isValid(parsed)) return parsed;
  
  // Fall back to Date constructor (handles other formats like "2025-01-12 13:30:00")
  parsed = new Date(dateStr);
  if (isValid(parsed)) return parsed;
  
  return null;
}

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

interface SocialPost {
  id: number;
  platform: string;
  content: string;
  imageUrl: string | null;
  linkUrl: string | null;
  campaignId: number | null;
  linkedDayIndex: number | null;
  status: string;
  scheduledAt: string | null;
  publishedAt: string | null;
  externalPostId: string | null;
  utmContent: string | null;
  errorMessage: string | null;
  createdAt: string;
}

interface SocialPostWithMetrics extends SocialPost {
  metrics?: {
    impressions: number;
    clicks: number;
    engagements: number;
    likes: number;
    retweets: number;
    replies: number;
  };
  signups?: number;
}

interface SocialStats {
  planned: number;
  posted: number;
  totalClicks: number;
  totalSignups: number;
  avgEngagement: number;
}

interface Campaign {
  id: number;
  name: string;
}

interface ContentDay {
  id: number;
  dayIndex: number;
  title: string;
}

function StatCard({ title, value, icon: Icon, subtext, color = "orange" }: {
  title: string;
  value: string | number;
  icon: any;
  subtext?: string;
  color?: "orange" | "green" | "blue" | "purple";
}) {
  const colorClasses = {
    orange: "bg-orange-500/20 text-orange-500",
    green: "bg-green-500/20 text-green-400",
    blue: "bg-blue-500/20 text-blue-400",
    purple: "bg-purple-500/20 text-purple-400",
  };

  return (
    <Card className="bg-zinc-800/50 border-zinc-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
            {subtext && <p className="text-xs text-zinc-500 mt-1">{subtext}</p>}
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PostCard({ post, onEdit, onDelete, onMarkPosted }: { 
  post: SocialPostWithMetrics; 
  onEdit: () => void;
  onDelete: () => void;
  onMarkPosted?: () => void;
}) {
  const statusColors: Record<string, string> = {
    planned: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    posted: "bg-green-500/20 text-green-400 border-green-500/30",
    draft: "bg-zinc-600/20 text-zinc-400 border-zinc-500/30",
    scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    published: "bg-green-500/20 text-green-400 border-green-500/30",
  };

  const statusIcons: Record<string, any> = {
    planned: Clock,
    posted: CheckCircle2,
    draft: Edit2,
    scheduled: Clock,
    published: CheckCircle2,
  };

  const StatusIcon = statusIcons[post.status] || Clock;

  return (
    <Card className="bg-zinc-800/50 border-zinc-700 hover:border-zinc-600 transition-all" data-testid={`card-post-${post.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Twitter className="w-4 h-4 text-blue-400" />
              <Badge className={statusColors[post.status] || statusColors.planned}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {post.status}
              </Badge>
              {post.scheduledAt && safeParseDate(post.scheduledAt) && (
                <span className="text-xs text-zinc-500">
                  {format(safeParseDate(post.scheduledAt)!, "MMM d, h:mm a")}
                </span>
              )}
            </div>
            <p className="text-white text-sm line-clamp-2">{post.content}</p>
            {post.linkUrl && (
              <div className="flex items-center gap-1 mt-2 text-xs text-zinc-500">
                <LinkIcon className="w-3 h-3" />
                <span className="truncate">{post.linkUrl}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-700">
          <span className="text-xs text-zinc-500">
            Created {safeParseDate(post.createdAt) ? format(safeParseDate(post.createdAt)!, "MMM d, yyyy") : ""}
          </span>
          <div className="flex gap-2">
            {post.status !== 'posted' && post.status !== 'published' && onMarkPosted && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onMarkPosted}
                className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                data-testid={`button-mark-posted-${post.id}`}
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Mark Posted
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onEdit}
              className="text-zinc-400 hover:text-white"
              data-testid={`button-edit-post-${post.id}`}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDelete}
              className="text-zinc-400 hover:text-red-400"
              data-testid={`button-delete-post-${post.id}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PostComposer({ 
  open, 
  onOpenChange, 
  post,
  campaigns,
  contentDays 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  post?: SocialPost | null;
  campaigns: Campaign[];
  contentDays: ContentDay[];
}) {
  const { toast } = useToast();
  const maxChars = 280;
  
  const [formData, setFormData] = useState({
    content: "",
    platform: "twitter",
    imageUrl: "",
    linkUrl: "",
    campaignId: "",
    linkedDayIndex: "",
    scheduledAt: "",
    scheduledTime: "",
  });

  useEffect(() => {
    if (post) {
      setFormData({
        content: post.content,
        platform: post.platform,
        imageUrl: post.imageUrl || "",
        linkUrl: post.linkUrl || "",
        campaignId: post.campaignId?.toString() || "",
        linkedDayIndex: post.linkedDayIndex?.toString() || "",
        scheduledAt: post.scheduledAt && safeParseDate(post.scheduledAt) ? format(safeParseDate(post.scheduledAt)!, "yyyy-MM-dd") : "",
        scheduledTime: post.scheduledAt && safeParseDate(post.scheduledAt) ? format(safeParseDate(post.scheduledAt)!, "HH:mm") : "",
      });
    } else {
      setFormData({
        content: "",
        platform: "twitter",
        imageUrl: "",
        linkUrl: "",
        campaignId: "",
        linkedDayIndex: "",
        scheduledAt: "",
        scheduledTime: "",
      });
    }
  }, [post, open]);

  const charCount = formData.content.length;
  const charPercent = (charCount / maxChars) * 100;

  const generateDraftMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/social/generate-draft", {
        dayIndex: formData.linkedDayIndex,
        platform: formData.platform,
      });
      return res.json();
    },
    onSuccess: (data: { draft: string }) => {
      setFormData({ ...formData, content: data.draft });
      toast({ title: "Draft generated", description: "AI-generated content is ready for review" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to generate draft", description: error.message, variant: "destructive" });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const scheduledAt = formData.scheduledAt && formData.scheduledTime 
        ? new Date(`${formData.scheduledAt}T${formData.scheduledTime}`).toISOString()
        : null;

      const payload = {
        ...formData,
        status: 'planned',
        scheduledAt,
        campaignId: formData.campaignId && formData.campaignId !== "none" ? parseInt(formData.campaignId) : null,
        linkedDayIndex: formData.linkedDayIndex && formData.linkedDayIndex !== "none" ? parseInt(formData.linkedDayIndex) : null,
      };

      if (post) {
        const res = await apiRequest("PATCH", `/api/admin/social/posts/${post.id}`, payload);
        return res.json();
      } else {
        const res = await apiRequest("POST", "/api/admin/social/posts", payload);
        return res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social/stats"] });
      toast({ title: post ? "Post updated" : "Post saved" });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to save post", description: error.message, variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Twitter className="w-5 h-5 text-blue-400" />
            {post ? "Edit Post" : "Create Post"}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Compose and schedule your social media post
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-zinc-300">Content</Label>
              <div className="flex items-center gap-2">
                {formData.linkedDayIndex && formData.linkedDayIndex !== "none" && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => generateDraftMutation.mutate()}
                    disabled={generateDraftMutation.isPending}
                    className="h-7 text-xs border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                    data-testid="button-generate-draft"
                  >
                    {generateDraftMutation.isPending ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 mr-1" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                )}
                <span className={`text-xs ${charCount > maxChars ? 'text-red-400' : 'text-zinc-500'}`}>
                  {charCount}/{maxChars}
                </span>
              </div>
            </div>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white min-h-[100px] resize-none"
              placeholder={formData.linkedDayIndex && formData.linkedDayIndex !== "none" 
                ? "Click 'Generate with AI' to create a draft, or write your own..." 
                : "What's happening in Bitcoin today?"}
              data-testid="input-post-content"
            />
            <Progress 
              value={Math.min(charPercent, 100)} 
              className={`h-1 ${charCount > maxChars ? '[&>div]:bg-red-500' : '[&>div]:bg-orange-500'}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Link to Lesson</Label>
              <Select 
                value={formData.linkedDayIndex} 
                onValueChange={(v) => setFormData({ ...formData, linkedDayIndex: v })}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white" data-testid="select-linked-day">
                  <SelectValue placeholder="Select lesson" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="none">None</SelectItem>
                  {contentDays.map((day) => (
                    <SelectItem key={day.dayIndex} value={day.dayIndex.toString()}>
                      Day {day.dayIndex}: {day.title.slice(0, 30)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">Campaign</Label>
              <Select 
                value={formData.campaignId} 
                onValueChange={(v) => setFormData({ ...formData, campaignId: v })}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white" data-testid="select-campaign">
                  <SelectValue placeholder="Select campaign" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="none">None</SelectItem>
                  {campaigns.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id.toString()}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">Custom Link URL (optional)</Label>
            <Input
              value={formData.linkUrl}
              onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="https://hodlearn.com/..."
              data-testid="input-link-url"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Schedule Date</Label>
              <Input
                type="date"
                value={formData.scheduledAt}
                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                data-testid="input-schedule-date"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Time</Label>
              <Input
                type="time"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                data-testid="input-schedule-time"
              />
            </div>
          </div>

          {formData.linkedDayIndex && (
            <div className="bg-zinc-800/50 rounded-lg p-3 text-xs text-zinc-400">
              <span className="text-orange-400 font-medium">UTM tracking enabled:</span> Link will include 
              unique tracking code for attribution
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || !formData.content.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-white"
            data-testid="button-save-post"
          >
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Clock className="w-4 h-4 mr-2" />}
            {formData.scheduledAt ? 'Save & Schedule' : 'Save Post'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CalendarView({ posts, onEditPost }: { posts: SocialPostWithMetrics[], onEditPost: (post: SocialPost) => void }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  
  // Generate 6 weeks of days (42 days) to cover any month layout
  const calendarDays = Array.from({ length: 42 }, (_, i) => addDays(calendarStart, i));

  // Separate scheduled posts from unscheduled ones
  const scheduledPosts = posts.filter(post => post.scheduledAt && safeParseDate(post.scheduledAt));
  const unscheduledPosts = posts.filter(post => !post.scheduledAt && post.status !== 'posted');

  const getPostsForDay = (date: Date) => {
    return scheduledPosts.filter(post => {
      const postDate = safeParseDate(post.scheduledAt);
      return postDate && isSameDay(postDate, date);
    });
  };

  const selectedDayPosts = selectedDate ? getPostsForDay(selectedDate) : [];

  const goToPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => {
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  const statusColors: Record<string, string> = {
    planned: "bg-blue-500",
    posted: "bg-green-500",
    draft: "bg-zinc-600",
    scheduled: "bg-blue-500",
    published: "bg-green-500",
  };

  return (
    <div className="space-y-4">
      <Card className="bg-zinc-800/50 border-zinc-700">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              Content Calendar
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrevMonth}
                className="text-zinc-400 hover:text-white h-8 w-8 p-0"
                data-testid="button-prev-month"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToToday}
                className="text-zinc-400 hover:text-white text-sm px-2"
                data-testid="button-today"
              >
                Today
              </Button>
              <span className="text-white font-medium min-w-[140px] text-center">
                {format(currentMonth, "MMMM yyyy")}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNextMonth}
                className="text-zinc-400 hover:text-white h-8 w-8 p-0"
                data-testid="button-next-month"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-xs text-zinc-500 text-center font-medium py-1">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const dayPosts = getPostsForDay(day);
              const isToday = isSameDay(day, today);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const hasPlanned = dayPosts.some(p => p.status === 'planned' || p.status === 'scheduled' || p.status === 'draft');
              const hasPosted = dayPosts.some(p => p.status === 'posted' || p.status === 'published');
              
              return (
                <button 
                  key={day.toISOString()} 
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-[60px] p-2 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-orange-500/30 border-orange-500 ring-1 ring-orange-500'
                      : isToday 
                        ? 'bg-orange-500/10 border-orange-500/50 hover:bg-orange-500/20' 
                        : isCurrentMonth 
                          ? 'bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-500 hover:bg-zinc-700/50' 
                          : 'bg-zinc-900/30 border-transparent opacity-40'
                  }`}
                  data-testid={`calendar-day-${format(day, 'yyyy-MM-dd')}`}
                >
                  <div className={`text-sm font-medium ${
                    isSelected ? 'text-orange-400' : isToday ? 'text-orange-400' : isCurrentMonth ? 'text-white' : 'text-zinc-600'
                  }`}>
                    {format(day, "d")}
                  </div>
                  
                  {/* Event indicators */}
                  {dayPosts.length > 0 && (
                    <div className="flex items-center justify-center gap-1 mt-1">
                      {hasPosted && <div className="w-2 h-2 rounded-full bg-green-500" title="Posted"></div>}
                      {hasPlanned && <div className="w-2 h-2 rounded-full bg-blue-500" title="Planned"></div>}
                    </div>
                  )}
                  {dayPosts.length > 0 && (
                    <div className="text-xs text-zinc-400 text-center mt-0.5">
                      {dayPosts.length} post{dayPosts.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-zinc-700">
            <span className="text-xs text-zinc-500">Status:</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-xs text-zinc-400">Planned</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-zinc-400">Posted</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day Detail Panel */}
      {selectedDate && (
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg">
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDate(null)}
                className="text-zinc-400 hover:text-white"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {selectedDayPosts.length === 0 ? (
              <div className="text-center py-6 text-zinc-500">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No posts scheduled for this day</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDayPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={`${statusColors[post.status]} text-white text-xs`}>
                            {post.status}
                          </Badge>
                          {post.scheduledAt && (
                            <span className="text-xs text-zinc-500">
                              {safeParseDate(post.scheduledAt) ? format(safeParseDate(post.scheduledAt)!, "h:mm a") : ""}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-300 line-clamp-2">{post.content}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditPost(post)}
                        className="text-zinc-400 hover:text-orange-400"
                        data-testid={`button-edit-day-post-${post.id}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Unscheduled Posts */}
      {unscheduledPosts.length > 0 && (
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-zinc-500" />
              Unscheduled Posts ({unscheduledPosts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {unscheduledPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-300 truncate">{post.content}</p>
                    <span className="text-xs text-zinc-500">
                      Created {safeParseDate(post.createdAt) ? format(safeParseDate(post.createdAt)!, "MMM d, yyyy") : ""}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditPost(post)}
                    className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 shrink-0"
                    data-testid={`button-schedule-post-${post.id}`}
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    Add Date
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AttributionFunnel({ stats }: { stats: SocialStats | undefined }) {
  if (!stats) return null;

  const impressions = stats.posted * 1000; // Estimated
  const clicks = stats.totalClicks;
  const signups = stats.totalSignups;
  const dayOneComplete = Math.round(signups * 0.35); // Estimated 35% completion

  const clickRate = impressions > 0 ? ((clicks / impressions) * 100).toFixed(1) : "0";
  const signupRate = clicks > 0 ? ((signups / clicks) * 100).toFixed(1) : "0";
  const completionRate = signups > 0 ? ((dayOneComplete / signups) * 100).toFixed(1) : "0";

  return (
    <Card className="bg-zinc-800/50 border-zinc-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          Attribution Funnel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 text-center p-3 bg-zinc-800 rounded-lg">
            <div className="text-2xl font-bold text-white">{impressions.toLocaleString()}</div>
            <div className="text-xs text-zinc-500">Impressions</div>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-600" />
          <div className="flex-1 text-center p-3 bg-zinc-800 rounded-lg">
            <div className="text-2xl font-bold text-white">{clicks.toLocaleString()}</div>
            <div className="text-xs text-zinc-500">Clicks</div>
            <div className="text-xs text-orange-400">{clickRate}%</div>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-600" />
          <div className="flex-1 text-center p-3 bg-zinc-800 rounded-lg">
            <div className="text-2xl font-bold text-white">{signups.toLocaleString()}</div>
            <div className="text-xs text-zinc-500">Signups</div>
            <div className="text-xs text-orange-400">{signupRate}%</div>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-600" />
          <div className="flex-1 text-center p-3 bg-orange-500/20 rounded-lg border border-orange-500/30">
            <div className="text-2xl font-bold text-orange-400">{dayOneComplete}</div>
            <div className="text-xs text-zinc-500">Day 1 Complete</div>
            <div className="text-xs text-orange-400">{completionRate}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SocialMediaHubContent() {
  const { toast } = useToast();
  const [composerOpen, setComposerOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: posts = [], isLoading: postsLoading } = useQuery<SocialPostWithMetrics[]>({
    queryKey: ["/api/admin/social/posts"],
  });

  const { data: stats } = useQuery<SocialStats>({
    queryKey: ["/api/admin/social/stats"],
  });

  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ["/api/admin/marketing/campaigns"],
  });

  const { data: contentDays = [] } = useQuery<ContentDay[]>({
    queryKey: ["/api/admin/content/days"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (postId: number) => {
      await apiRequest("DELETE", `/api/admin/social/posts/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social/stats"] });
      toast({ title: "Post deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete post", description: error.message, variant: "destructive" });
    },
  });

  const markPostedMutation = useMutation({
    mutationFn: async (postId: number) => {
      await apiRequest("PATCH", `/api/admin/social/posts/${postId}`, { status: 'posted' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social/stats"] });
      toast({ title: "Marked as posted", description: "Post status updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update status", description: error.message, variant: "destructive" });
    },
  });

  const filteredPosts = statusFilter === "all" 
    ? posts 
    : posts.filter(p => p.status === statusFilter);

  const handleEdit = (post: SocialPost) => {
    setEditingPost(post);
    setComposerOpen(true);
  };

  const handleCloseComposer = (open: boolean) => {
    setComposerOpen(open);
    if (!open) setEditingPost(null);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Social Media Hub</h1>
            <p className="text-zinc-400 mt-1">Schedule posts and track attribution</p>
          </div>
          <Button 
            onClick={() => setComposerOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
            data-testid="button-new-post"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <StatCard
            title="Planned"
            value={stats?.planned || 0}
            icon={Clock}
            color="blue"
          />
          <StatCard
            title="Posted"
            value={stats?.posted || 0}
            icon={Send}
            color="green"
          />
          <StatCard
            title="Total Clicks"
            value={stats?.totalClicks?.toLocaleString() || 0}
            icon={MousePointerClick}
            color="purple"
          />
          <StatCard
            title="Signups"
            value={stats?.totalSignups || 0}
            icon={Users}
            subtext="From social"
            color="orange"
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <CalendarView posts={posts} onEditPost={handleEdit} />
            <AttributionFunnel stats={stats} />
          </div>
          
          <div className="space-y-4">
            <Card className="bg-zinc-800/50 border-zinc-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">Recent Posts</CardTitle>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32 bg-zinc-800 border-zinc-700 text-white text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="posted">Posted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
                {postsLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-orange-500 mx-auto" />
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500">
                    <Twitter className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No posts yet</p>
                    <Button 
                      variant="link" 
                      className="text-orange-400 mt-2"
                      onClick={() => setComposerOpen(true)}
                    >
                      Create your first post
                    </Button>
                  </div>
                ) : (
                  filteredPosts.slice(0, 10).map(post => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      onEdit={() => handleEdit(post)}
                      onDelete={() => deleteMutation.mutate(post.id)}
                      onMarkPosted={() => markPostedMutation.mutate(post.id)}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <PostComposer
        open={composerOpen}
        onOpenChange={handleCloseComposer}
        post={editingPost}
        campaigns={campaigns}
        contentDays={contentDays}
      />
    </AdminLayout>
  );
}

export default function SocialMediaHub() {
  return (
    <AdminAuthGuard>
      <SocialMediaHubContent />
    </AdminAuthGuard>
  );
}
