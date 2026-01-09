import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Plus, Calendar, Send, MousePointerClick, Users, TrendingUp,
  Twitter, Linkedin, Instagram, Facebook, Clock, ArrowRight, Edit2, Trash2,
  AlertCircle, CheckCircle2, Loader2, Link as LinkIcon, Sparkles,
  ChevronLeft, ChevronRight, X, Settings, Lock, Unlock, Save, RotateCcw,
  Copy, Info, FileEdit, CalendarCheck, ExternalLink, Power, Zap, Image, Wand2, Upload
} from "lucide-react";
import { useIntegrationManager } from "../hooks/useIntegrationManager";
import S3ImageUpload from "../components/S3ImageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "../components/AdminLayout";
import { format, addDays, startOfWeek, startOfMonth, isSameDay, isSameMonth, parseISO, addMonths, subMonths } from "date-fns";

// ============================================
// TYPES
// ============================================

interface SocialPost {
  id: number;
  platform: string;
  content: string;
  imageUrl: string | null;
  linkUrl: string | null;
  campaignId: number | null;
  linkedDayIndex: number | null;
  contentStatus: 'drafted' | 'approved';
  publishStatus: 'planned' | 'posted';
  scheduledAt: string | null;
  publishedAt: string | null;
  createdAt: string;
}

interface SocialPostWithMetrics extends SocialPost {
  metrics?: {
    impressions: number;
    clicks: number;
    engagements: number;
  } | null;
  signups?: number;
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

interface SocialStats {
  planned: number;
  posted: number;
  drafted: number;
  approved: number;
  totalClicks: number;
  totalSignups: number;
}

// ============================================
// AUTH GUARD
// ============================================

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

// ============================================
// AI INSTRUCTIONS DEFAULTS
// ============================================

const DEFAULT_SOCIAL_AI_INSTRUCTIONS = `You are a social media content creator for HODLearn, a Bitcoin education platform targeting working professionals.

## CONTENT PHILOSOPHY
**Target**: Working professionals interested in learning about Bitcoin
**Approach**: Curiosity-driven hooks that lead to educational content
**Tone**: Professional, engaging, and never preachy or "moon-bro" culture

## PLATFORM GUIDELINES
**Twitter/X**: 
- Hook in first line (under 40 characters)
- Clear call-to-action
- Use relevant Bitcoin hashtags sparingly
- Link to HODLearn lesson when relevant

## EVERGREEN CONTENT GUIDELINES (CRITICAL)
Your content must remain relevant for months or years. Follow these rules strictly:

**DO:**
- Focus on timeless Bitcoin principles and fundamentals
- Use curiosity hooks that don't reference current events
- Ask thought-provoking questions about money and financial freedom
- Reference historical Bitcoin milestones with context
- Promote educational content over price speculation

**DON'T:**
- Reference specific Bitcoin prices or "ATH" (all-time high)
- Mention current events, regulations, or news
- Use time-sensitive language ("today", "this week", "recently")
- Include specific years for recent events
- Make price predictions or speculation

## OUTPUT REQUIREMENTS
Create social posts that:
- Spark curiosity without clickbait
- Drive traffic to HODLearn lessons
- Build the HODLearn brand as the trusted Bitcoin education source
- Include appropriate hashtags for discoverability

## QUALITY CHECKLIST
- Hook under 40 characters that creates curiosity
- Clear value proposition for the reader
- EVERGREEN: No prices, dates, or current events
- Call-to-action that drives engagement`;

// ============================================
// AI INSTRUCTIONS EDITOR
// ============================================

interface AiInstructionsData {
  type: string;
  name: string;
  instructions: string;
  isLocked: boolean;
  exists: boolean;
  updatedAt?: string;
}

function AIInstructionsEditor({ type, defaultInstructions }: { type: 'content' | 'social'; defaultInstructions: string }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editedInstructions, setEditedInstructions] = useState("");
  const [showUnlockConfirm, setShowUnlockConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: instructionsData, isLoading, error: instructionsError } = useQuery<AiInstructionsData>({
    queryKey: [`/api/admin/ai-instructions/${type}`],
  });

  useEffect(() => {
    if (instructionsData?.exists) {
      setEditedInstructions(instructionsData.instructions);
    } else {
      setEditedInstructions(defaultInstructions);
    }
    setHasChanges(false);
  }, [instructionsData, defaultInstructions]);

  const handleTextChange = (value: string) => {
    setEditedInstructions(value);
    const originalValue = instructionsData?.exists ? instructionsData.instructions : defaultInstructions;
    setHasChanges(value !== originalValue);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/admin/ai-instructions/${type}`, {
        name: type === 'content' ? 'Content AI Instructions' : 'Social AI Instructions',
        instructions: editedInstructions
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/ai-instructions/${type}`] });
      toast({ title: "Instructions saved successfully!" });
      setHasChanges(false);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to save", description: error.message, variant: "destructive" });
    }
  });

  const lockMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/admin/ai-instructions/${type}/lock`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/ai-instructions/${type}`] });
      toast({ title: "Instructions locked" });
    }
  });

  const unlockMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/admin/ai-instructions/${type}/unlock`, { confirmed: true });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/ai-instructions/${type}`] });
      toast({ title: "Instructions unlocked" });
      setShowUnlockConfirm(false);
    }
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/admin/ai-instructions/${type}/reset`, { confirmed: true });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/ai-instructions/${type}`] });
      setEditedInstructions(defaultInstructions);
      toast({ title: "Instructions reset to default" });
      setShowResetConfirm(false);
      setHasChanges(false);
    }
  });

  const isLocked = instructionsData?.isLocked ?? true;
  const isUsingDefault = !instructionsData?.exists;

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        data-testid={`button-open-${type}-ai-instructions`}
      >
        <Settings className="w-4 h-4 mr-2 text-orange-500" />
        Social AI Instructions
        {isLocked ? (
          <Badge className="ml-2 bg-red-500/20 text-red-400 text-xs"><Lock className="w-3 h-3 mr-1" />Locked</Badge>
        ) : (
          <Badge className="ml-2 bg-green-500/20 text-green-400 text-xs"><Unlock className="w-3 h-3 mr-1" />Unlocked</Badge>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-orange-500" />
              Social AI Instructions
              {isUsingDefault && (
                <Badge className="bg-zinc-700 text-zinc-300 text-xs">Using Default</Badge>
              )}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Customize the AI instructions used when generating social media posts.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
              </div>
            ) : instructionsError ? (
              <div className="p-4 border border-red-500/30 bg-red-500/10 rounded-md">
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  Failed to load AI instructions. Please refresh the page.
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-zinc-500">
                    {instructionsData?.updatedAt && `Last updated: ${new Date(instructionsData.updatedAt).toLocaleDateString()}`}
                  </div>
                  <div className="flex gap-2">
                    {isLocked ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowUnlockConfirm(true)}
                        className="border-zinc-700 text-zinc-300 text-xs"
                        data-testid="button-unlock-social-instructions"
                      >
                        <Unlock className="w-3 h-3 mr-1" />
                        Unlock to Edit
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowResetConfirm(true)}
                          className="border-zinc-700 text-zinc-300 text-xs"
                          data-testid="button-reset-social-instructions"
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Reset to Default
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => lockMutation.mutate()}
                          disabled={lockMutation.isPending}
                          className="border-zinc-700 text-zinc-300 text-xs"
                          data-testid="button-lock-social-instructions"
                        >
                          <Lock className="w-3 h-3 mr-1" />
                          Lock
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <Textarea
                  value={editedInstructions}
                  onChange={(e) => handleTextChange(e.target.value)}
                  disabled={isLocked}
                  className={`bg-zinc-800 border-zinc-700 text-white font-mono text-xs min-h-[350px] ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                  placeholder="AI Instructions..."
                  data-testid="input-social-ai-instructions"
                />
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-zinc-500">
                    These instructions guide AI when generating social media posts.
                  </div>
                  {!isLocked && hasChanges && (
                    <Button
                      onClick={() => saveMutation.mutate()}
                      disabled={saveMutation.isPending}
                      className="bg-orange-500 hover:bg-orange-600 text-xs"
                      data-testid="button-save-social-instructions"
                    >
                      {saveMutation.isPending ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Save className="w-3 h-3 mr-1" />}
                      Save Changes
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showUnlockConfirm} onOpenChange={setShowUnlockConfirm}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Unlock AI Instructions?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to unlock these instructions for editing? Changes to AI instructions will affect all future social media content generation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-700 text-zinc-300">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => unlockMutation.mutate()}
              className="bg-orange-500 hover:bg-orange-600"
              data-testid="button-confirm-unlock-social"
            >
              Yes, Unlock
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Reset to Default Instructions?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to reset to the default AI instructions? This will delete all custom changes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-700 text-zinc-300">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => resetMutation.mutate()}
              className="bg-red-500 hover:bg-red-600"
              data-testid="button-confirm-reset-social"
            >
              Yes, Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ============================================
// STAT CARD
// ============================================

function StatCard({ title, value, icon: Icon, color, subtext }: { 
  title: string; 
  value: number | string; 
  icon: any; 
  color: string;
  subtext?: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-500/20 text-blue-400",
    green: "bg-green-500/20 text-green-400",
    purple: "bg-purple-500/20 text-purple-400",
    orange: "bg-orange-500/20 text-orange-400",
    zinc: "bg-zinc-600/20 text-zinc-400",
  };

  return (
    <Card className="bg-zinc-800/50 border-zinc-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {subtext && <p className="text-xs text-zinc-500">{subtext}</p>}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// POST CARD (for list view)
// ============================================

function PostCard({ 
  post, 
  onEdit, 
  onDelete, 
  onMarkPosted,
  onApprove
}: { 
  post: SocialPostWithMetrics; 
  onEdit: () => void;
  onDelete: () => void;
  onMarkPosted: (livePostUrl?: string) => void;
  onApprove: () => void;
}) {
  const { toast } = useToast();
  const [showMarkPostedDialog, setShowMarkPostedDialog] = useState(false);
  const [livePostUrl, setLivePostUrl] = useState("");
  
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(post.content);
      toast({ title: "Copied to clipboard!", description: "Ready to paste into your social platform" });
    } catch (err) {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  const handleMarkPosted = () => {
    onMarkPosted(livePostUrl || undefined);
    setShowMarkPostedDialog(false);
    setLivePostUrl("");
  };

  // Content status styles: drafted (gray), approved (purple)
  const contentStatusStyles: Record<string, string> = {
    drafted: "bg-zinc-600/20 text-zinc-400 border-zinc-500/30",
    approved: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };
  
  // Publish status styles: planned (blue), posted (green)
  const publishStatusStyles: Record<string, string> = {
    planned: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    posted: "bg-green-500/20 text-green-400 border-green-500/30",
  };

  const scheduledDate = post.scheduledAt ? parseISO(post.scheduledAt) : null;
  const createdDate = parseISO(post.createdAt);
  const contentStatus = post.contentStatus || 'drafted';
  const publishStatus = post.publishStatus || 'planned';
  const canMarkPosted = publishStatus !== 'posted';
  const canApprove = contentStatus !== 'approved';

  // Get platform icon component
  const getPlatformIcon = () => {
    const iconMap: Record<string, { icon: any; color: string }> = {
      twitter: { icon: Twitter, color: "text-blue-400" },
      linkedin: { icon: Linkedin, color: "text-blue-600" },
      instagram: { icon: Instagram, color: "text-pink-500" },
      facebook: { icon: Facebook, color: "text-blue-500" },
    };
    return iconMap[post.platform] || iconMap.twitter;
  };
  const { icon: PlatformIcon, color: platformColor } = getPlatformIcon();

  return (
    <Card className="bg-zinc-800/50 border-zinc-700 hover:border-zinc-600 transition-all" data-testid={`card-post-${post.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <PlatformIcon className={`w-4 h-4 ${platformColor}`} />
              <Badge className={contentStatusStyles[contentStatus] || contentStatusStyles.drafted}>
                {contentStatus === 'approved' ? (
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                ) : (
                  <Edit2 className="w-3 h-3 mr-1" />
                )}
                {contentStatus}
              </Badge>
              <Badge className={publishStatusStyles[publishStatus] || publishStatusStyles.planned}>
                {publishStatus === 'posted' ? (
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                ) : (
                  <Clock className="w-3 h-3 mr-1" />
                )}
                {publishStatus}
              </Badge>
              {scheduledDate && (
                <span className="text-xs text-zinc-500">
                  {format(scheduledDate, "MMM d, h:mm a")}
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
            {(post as any).livePostUrl && (
              <a 
                href={(post as any).livePostUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 mt-2 text-xs text-green-400 hover:text-green-300"
              >
                <ExternalLink className="w-3 h-3" />
                <span className="truncate">View live post</span>
              </a>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-500">
              Created {format(createdDate, "MMM d, yyyy")}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCopyToClipboard}
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-8 px-2"
              data-testid={`button-copy-${post.id}`}
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
            {canApprove && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onApprove}
                className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 h-8 px-2"
                data-testid={`button-approve-${post.id}`}
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Approve
              </Button>
            )}
            {canMarkPosted && (
              <Popover open={showMarkPostedDialog} onOpenChange={setShowMarkPostedDialog}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-green-400 hover:text-green-300 hover:bg-green-500/10 h-8 px-2"
                    data-testid={`button-mark-posted-${post.id}`}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Posted
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-zinc-800 border-zinc-700" align="end">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-zinc-300 text-sm">Live Post URL (optional)</Label>
                      <Input
                        value={livePostUrl}
                        onChange={(e) => setLivePostUrl(e.target.value)}
                        className="bg-zinc-900 border-zinc-700 text-white text-sm"
                        placeholder="https://x.com/yourhandle/status/..."
                        data-testid={`input-live-url-${post.id}`}
                      />
                      <p className="text-xs text-zinc-500">Paste the link to your published post</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowMarkPostedDialog(false)}
                        className="flex-1 border-zinc-700 text-zinc-300"
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm"
                        onClick={handleMarkPosted}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        data-testid={`button-confirm-posted-${post.id}`}
                      >
                        Confirm Posted
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onEdit}
              className="text-zinc-400 hover:text-white h-8 px-2"
              data-testid={`button-edit-post-${post.id}`}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDelete}
              className="text-zinc-400 hover:text-red-400 h-8 px-2"
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

// ============================================
// POST COMPOSER DIALOG
// ============================================

// Platform configuration with icons and limits
const PLATFORM_CONFIG: Record<string, { icon: any; label: string; maxChars: number; color: string }> = {
  twitter: { icon: Twitter, label: "Twitter/X", maxChars: 280, color: "text-blue-400" },
  linkedin: { icon: Linkedin, label: "LinkedIn", maxChars: 3000, color: "text-blue-600" },
  instagram: { icon: Instagram, label: "Instagram", maxChars: 2200, color: "text-pink-500" },
  facebook: { icon: Facebook, label: "Facebook", maxChars: 63206, color: "text-blue-500" },
};

function PostComposer({ 
  open, 
  onClose, 
  post,
  campaigns,
  contentDays 
}: { 
  open: boolean; 
  onClose: () => void;
  post?: SocialPost | null;
  campaigns: Campaign[];
  contentDays: ContentDay[];
}) {
  const { toast } = useToast();
  
  // Dynamic max chars based on platform
  const getMaxChars = (platform: string) => PLATFORM_CONFIG[platform]?.maxChars || 280;
  
  const [formData, setFormData] = useState({
    content: "",
    platform: "twitter",
    linkUrl: "",
    campaignId: "",
    linkedDayIndex: "",
    scheduledDate: "",
    scheduledTime: "",
    notes: "",
    ctaGoal: "",
  });
  
  // Image generation state
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageKey, setImageKey] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageStyle, setImageStyle] = useState("professional");
  const [imageSize, setImageSize] = useState("1024x1024");
  const [showImageGenerator, setShowImageGenerator] = useState(false);

  // Reset form when dialog opens/closes or post changes
  useEffect(() => {
    if (open) {
      if (post) {
        const scheduledDate = post.scheduledAt ? parseISO(post.scheduledAt) : null;
        setFormData({
          content: post.content,
          platform: post.platform,
          linkUrl: post.linkUrl || "",
          campaignId: post.campaignId?.toString() || "",
          linkedDayIndex: post.linkedDayIndex?.toString() || "",
          scheduledDate: scheduledDate ? format(scheduledDate, "yyyy-MM-dd") : "",
          scheduledTime: scheduledDate ? format(scheduledDate, "HH:mm") : "",
          notes: (post as any).notes || "",
          ctaGoal: (post as any).ctaGoal || "",
        });
        setImageUrl(post.imageUrl || null);
        setImageKey((post as any).imageKey || null);
      } else {
        setFormData({
          content: "",
          platform: "twitter",
          linkUrl: "",
          campaignId: "",
          linkedDayIndex: "",
          scheduledDate: "",
          scheduledTime: "",
          notes: "",
          ctaGoal: "",
        });
        setImageUrl(null);
        setImageKey(null);
        setImagePrompt("");
        setShowImageGenerator(false);
      }
    }
  }, [open, post]);

  const maxChars = getMaxChars(formData.platform);
  const charCount = formData.content.length;
  const isOverLimit = charCount > maxChars;
  const currentPlatformConfig = PLATFORM_CONFIG[formData.platform] || PLATFORM_CONFIG.twitter;

  const saveMutation = useMutation({
    mutationFn: async () => {
      // Build scheduledAt from date + time
      let scheduledAt: string | null = null;
      if (formData.scheduledDate) {
        const timeStr = formData.scheduledTime || "12:00";
        scheduledAt = new Date(`${formData.scheduledDate}T${timeStr}`).toISOString();
      }

      const payload = {
        content: formData.content,
        platform: formData.platform,
        linkUrl: formData.linkUrl || null,
        imageUrl: imageUrl || null,
        imageKey: imageKey || null,
        campaignId: formData.campaignId ? parseInt(formData.campaignId) : null,
        linkedDayIndex: formData.linkedDayIndex ? parseInt(formData.linkedDayIndex) : null,
        scheduledAt,
        notes: formData.notes || null,
        ctaGoal: formData.ctaGoal || null,
        contentStatus: 'drafted', // New posts start as drafted
        publishStatus: 'planned', // New posts start as planned
      };

      if (post) {
        await apiRequest("PATCH", `/api/admin/social/posts/${post.id}`, payload);
      } else {
        await apiRequest("POST", "/api/admin/social/posts", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social/stats"] });
      toast({ title: post ? "Post updated" : "Post created" });
      onClose();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to save post", description: error.message, variant: "destructive" });
    },
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/social/generate-draft", {
        linkedDayIndex: formData.linkedDayIndex ? parseInt(formData.linkedDayIndex) : null,
        campaignId: formData.campaignId ? parseInt(formData.campaignId) : null,
        platform: formData.platform,
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.draft) {
        setFormData(prev => ({ ...prev, content: data.draft }));
        toast({ title: "Draft generated!" });
      }
    },
    onError: (error: Error) => {
      toast({ title: "Failed to generate draft", description: error.message, variant: "destructive" });
    },
  });
  
  // Image generation mutation
  const generateImageMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/social/generate-image", {
        prompt: imagePrompt,
        style: imageStyle,
        size: imageSize,
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
        toast({ title: "Image generated!", description: "You can now save the post with this image." });
      }
    },
    onError: (error: Error) => {
      toast({ title: "Failed to generate image", description: error.message, variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">{post ? "Edit Post" : "Create New Post"}</DialogTitle>
          <DialogDescription className="text-zinc-400">
            {post ? "Update your social media post" : "Compose a new post for your chosen platform"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Platform Selector */}
          <div className="space-y-2">
            <Label className="text-zinc-300">Platform</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(PLATFORM_CONFIG).map(([key, config]) => {
                const Icon = config.icon;
                const isSelected = formData.platform === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFormData({ ...formData, platform: key })}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                      isSelected 
                        ? 'border-orange-500 bg-orange-500/10 text-white' 
                        : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600'
                    }`}
                    data-testid={`button-platform-${key}`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? config.color : ''}`} />
                    <span className="text-sm">{config.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-zinc-500">
              {formData.platform === 'twitter' && 'Short, punchy content with hashtags. Max 280 characters.'}
              {formData.platform === 'linkedin' && 'Professional thought leadership. Max 3,000 characters.'}
              {formData.platform === 'instagram' && 'Visual-focused caption with emojis. Max 2,200 characters.'}
              {formData.platform === 'facebook' && 'Community engagement style. Longer content allowed.'}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-zinc-300">Content</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => generateMutation.mutate()}
                  disabled={generateMutation.isPending}
                  className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 h-7"
                  data-testid="button-generate-draft"
                >
                  {generateMutation.isPending ? (
                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                  ) : (
                    <Sparkles className="w-3 h-3 mr-1" />
                  )}
                  AI Draft
                </Button>
                <span className={`text-xs ${isOverLimit ? "text-red-400" : "text-zinc-500"}`}>
                  {charCount}/{maxChars}
                </span>
              </div>
            </div>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className={`bg-zinc-800 border-zinc-700 text-white min-h-[120px] ${isOverLimit ? "border-red-500" : ""}`}
              placeholder="What's happening?"
              data-testid="textarea-content"
            />
            {isOverLimit && (
              <p className="text-xs text-red-400">Content exceeds {maxChars} character limit</p>
            )}
          </div>

          {/* Image Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-zinc-300 flex items-center gap-2">
                <Image className="w-4 h-4" />
                Image
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImageGenerator(!showImageGenerator)}
                className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 h-7"
                data-testid="button-toggle-image-generator"
              >
                <Wand2 className="w-3 h-3 mr-1" />
                {showImageGenerator ? "Hide Generator" : "AI Generate"}
              </Button>
            </div>
            
            {/* Image Preview */}
            {imageUrl && (
              <div className="relative">
                <img 
                  src={imageUrl} 
                  alt="Generated post image" 
                  className="w-full max-h-48 object-cover rounded-lg border border-zinc-700"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setImageUrl(null);
                    setImageKey(null);
                  }}
                  className="absolute top-2 right-2 bg-zinc-900/80 hover:bg-zinc-800 text-white h-7 px-2"
                  data-testid="button-remove-image"
                >
                  <X className="w-3 h-3 mr-1" />
                  Remove
                </Button>
              </div>
            )}
            
            {/* Image Generator Panel */}
            {showImageGenerator && (
              <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3 border border-zinc-700">
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-sm">Image Prompt</Label>
                  <Textarea
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Describe the image you want to generate... e.g., 'A Bitcoin coin glowing with orange light on a dark background'"
                    className="bg-zinc-800 border-zinc-600 text-white min-h-[80px] text-sm"
                    data-testid="textarea-image-prompt"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-sm">Style</Label>
                    <Select value={imageStyle} onValueChange={setImageStyle}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-600 text-white h-9" data-testid="select-image-style">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="educational">Educational</SelectItem>
                        <SelectItem value="dynamic">Dynamic</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-sm">Size</Label>
                    <Select value={imageSize} onValueChange={setImageSize}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-600 text-white h-9" data-testid="select-image-size">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        <SelectItem value="1024x1024">Square (1:1)</SelectItem>
                        <SelectItem value="1792x1024">Landscape (16:9)</SelectItem>
                        <SelectItem value="1024x1792">Portrait (9:16)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button
                  onClick={() => generateImageMutation.mutate()}
                  disabled={generateImageMutation.isPending || !imagePrompt.trim()}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                  data-testid="button-generate-image"
                >
                  {generateImageMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Image
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-zinc-500 text-center">
                  Images are generated using DALL-E 3. Standard quality, ~$0.04 per image.
                </p>
              </div>
            )}
            
            {/* Manual Image Upload Option */}
            {!showImageGenerator && !imageUrl && (
              <div className="pt-2">
                <S3ImageUpload
                  value={imageUrl || ""}
                  onChange={(url, key) => {
                    setImageUrl(url || null);
                    setImageKey(key || null);
                  }}
                  category="social-media"
                  label=""
                  placeholder="Enter image URL or upload from device"
                />
              </div>
            )}
          </div>

          {/* Schedule Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Schedule Date</Label>
              <Input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
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

          {/* Link Day & Campaign */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Link to Day</Label>
              <Select 
                value={formData.linkedDayIndex} 
                onValueChange={(v) => setFormData({ ...formData, linkedDayIndex: v })}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white" data-testid="select-day">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700 max-h-[200px]">
                  <SelectItem value="none">None</SelectItem>
                  {contentDays.slice(0, 30).map((day) => (
                    <SelectItem key={day.id} value={day.dayIndex.toString()}>
                      Day {day.dayIndex}: {day.title}
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

          {/* Link URL */}
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

          {/* CTA Goal */}
          <div className="space-y-2">
            <Label className="text-zinc-300">CTA Goal (optional)</Label>
            <Select
              value={formData.ctaGoal}
              onValueChange={(value) => setFormData({ ...formData, ctaGoal: value })}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white" data-testid="select-cta-goal">
                <SelectValue placeholder="Select goal..." />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="awareness">Brand Awareness</SelectItem>
                <SelectItem value="app_signup">App Signup</SelectItem>
                <SelectItem value="newsletter">Newsletter Subscribe</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="traffic">Website Traffic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-zinc-300">Internal Notes (optional)</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white min-h-[60px]"
              placeholder="Notes for your team..."
              data-testid="input-notes"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
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
            {saveMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Clock className="w-4 h-4 mr-2" />
            )}
            {formData.scheduledDate ? 'Save & Schedule' : 'Save Post'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// CALENDAR COMPONENT
// ============================================

function SocialCalendar({ 
  posts, 
  selectedDate, 
  onSelectDate,
  onEditPost 
}: { 
  posts: SocialPostWithMetrics[];
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
  onEditPost: (post: SocialPost) => void;
}) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);

  const monthStart = startOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  
  // Generate 6 weeks of days (42 days)
  const calendarDays = useMemo(() => 
    Array.from({ length: 42 }, (_, i) => addDays(calendarStart, i)),
    [calendarStart.getTime()]
  );

  // Build a map of date string -> posts for fast lookup
  const postsByDate = useMemo(() => {
    const map: Record<string, SocialPostWithMetrics[]> = {};
    posts.forEach(post => {
      if (post.scheduledAt) {
        try {
          const date = parseISO(post.scheduledAt);
          const key = format(date, "yyyy-MM-dd");
          if (!map[key]) map[key] = [];
          map[key].push(post);
        } catch (e) {
          // Skip invalid dates
        }
      }
    });
    return map;
  }, [posts]);

  // Posts without scheduled dates
  const unscheduledPosts = useMemo(() => 
    posts.filter(p => !p.scheduledAt && p.publishStatus !== 'posted'),
    [posts]
  );

  // Posts for selected date
  const selectedDayPosts = useMemo(() => {
    if (!selectedDate) return [];
    const key = format(selectedDate, "yyyy-MM-dd");
    return postsByDate[key] || [];
  }, [selectedDate, postsByDate]);

  const goToPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => {
    setCurrentMonth(today);
    onSelectDate(today);
  };

  return (
    <div className="space-y-4">
      {/* Calendar Card */}
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
              const dateKey = format(day, "yyyy-MM-dd");
              const dayPosts = postsByDate[dateKey] || [];
              const isToday = isSameDay(day, today);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              
              const hasPlanned = dayPosts.some(p => p.publishStatus === 'planned');
              const hasPosted = dayPosts.some(p => p.publishStatus === 'posted');
              
              return (
                <button 
                  key={dateKey}
                  onClick={() => onSelectDate(day)}
                  className={`min-h-[60px] p-2 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-orange-500/30 border-orange-500 ring-1 ring-orange-500'
                      : isToday 
                        ? 'bg-orange-500/10 border-orange-500/50 hover:bg-orange-500/20' 
                        : isCurrentMonth 
                          ? 'bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-500 hover:bg-zinc-700/50' 
                          : 'bg-zinc-900/30 border-transparent opacity-40'
                  }`}
                  data-testid={`calendar-day-${dateKey}`}
                >
                  <div className={`text-sm font-medium ${
                    isSelected ? 'text-orange-400' : isToday ? 'text-orange-400' : isCurrentMonth ? 'text-white' : 'text-zinc-600'
                  }`}>
                    {format(day, "d")}
                  </div>
                  
                  {/* Platform & Status indicators */}
                  {dayPosts.length > 0 && (
                    <>
                      {/* Platform icons row */}
                      <div className="flex items-center justify-center gap-0.5 mt-1">
                        {Array.from(new Set(dayPosts.map(p => p.platform))).map(platform => {
                          const iconConfig: Record<string, { icon: any; color: string }> = {
                            twitter: { icon: Twitter, color: "text-blue-400" },
                            linkedin: { icon: Linkedin, color: "text-blue-600" },
                            instagram: { icon: Instagram, color: "text-pink-500" },
                            facebook: { icon: Facebook, color: "text-blue-500" },
                          };
                          const { icon: Icon, color } = iconConfig[platform] || iconConfig.twitter;
                          return <Icon key={platform} className={`w-3 h-3 ${color}`} />;
                        })}
                      </div>
                      {/* Status dots */}
                      <div className="flex items-center justify-center gap-1 mt-0.5">
                        {hasPosted && <div className="w-1.5 h-1.5 rounded-full bg-green-500" title="Posted"></div>}
                        {hasPlanned && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" title="Planned"></div>}
                      </div>
                    </>
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

      {/* Selected Day Detail Panel */}
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
                onClick={() => onSelectDate(null)}
                className="text-zinc-400 hover:text-white h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
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
                          <Badge className={`text-xs ${
                            post.contentStatus === 'approved' 
                              ? 'bg-purple-500/20 text-purple-400' 
                              : 'bg-zinc-600/20 text-zinc-400'
                          }`}>
                            {post.contentStatus || 'drafted'}
                          </Badge>
                          <Badge className={`text-xs ${
                            post.publishStatus === 'posted' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {post.publishStatus || 'planned'}
                          </Badge>
                          {post.scheduledAt && (
                            <span className="text-xs text-zinc-500">
                              {format(parseISO(post.scheduledAt), "h:mm a")}
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
                      Created {format(parseISO(post.createdAt), "MMM d, yyyy")}
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

// ============================================
// ATTRIBUTION FUNNEL
// ============================================

function AttributionFunnel({ stats }: { stats: SocialStats | undefined }) {
  if (!stats) return null;

  const impressions = stats.posted * 1000;
  const clicks = stats.totalClicks;
  const signups = stats.totalSignups;
  const dayOneComplete = Math.round(signups * 0.35);

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

// ============================================
// MAIN PAGE COMPONENT
// ============================================

function SocialMediaHubContent() {
  const { toast } = useToast();
  const [composerOpen, setComposerOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Integration manager for feature gating
  const integrations = useIntegrationManager();

  // Data queries
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

  // Mutations
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
    mutationFn: async ({ postId, livePostUrl }: { postId: number; livePostUrl?: string }) => {
      await apiRequest("PATCH", `/api/admin/social/posts/${postId}`, { 
        publishStatus: 'posted',
        livePostUrl: livePostUrl || null
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social/stats"] });
      toast({ title: "Marked as posted" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update status", description: error.message, variant: "destructive" });
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (postId: number) => {
      await apiRequest("PATCH", `/api/admin/social/posts/${postId}`, { contentStatus: 'approved' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social/stats"] });
      toast({ title: "Content approved" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to approve", description: error.message, variant: "destructive" });
    },
  });

  // Filter posts for list view (by publish status)
  const filteredPosts = useMemo(() => {
    if (statusFilter === "all") return posts;
    return posts.filter(p => p.publishStatus === statusFilter);
  }, [posts, statusFilter]);

  const handleEditPost = (post: SocialPost) => {
    setEditingPost(post);
    setComposerOpen(true);
  };

  const handleCloseComposer = () => {
    setComposerOpen(false);
    setEditingPost(null);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Social Media Hub</h1>
            <p className="text-zinc-400 mt-1">Schedule posts and track attribution</p>
          </div>
          <div className="flex gap-2">
            <AIInstructionsEditor type="social" defaultInstructions={DEFAULT_SOCIAL_AI_INSTRUCTIONS} />
            <Button 
              onClick={() => setComposerOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white"
              data-testid="button-new-post"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard title="Drafts" value={stats?.drafted || 0} icon={FileEdit} color="zinc" subtext="Need review" />
          <StatCard title="Approved" value={stats?.approved || 0} icon={CheckCircle2} color="purple" subtext="Ready to post" />
          <StatCard title="Scheduled" value={stats?.planned || 0} icon={CalendarCheck} color="blue" />
          <StatCard title="Posted" value={stats?.posted || 0} icon={Send} color="green" />
        </div>

        {/* Mode Status Banner */}
        {integrations.hasAnyActiveIntegration ? (
          <div className="flex items-start gap-3 p-4 bg-green-900/20 border border-green-700 rounded-lg">
            <Zap className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-300">
                  <span className="font-medium text-green-400">API Mode Active</span> — Connected platforms: {integrations.getConnectedPlatforms().map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}
                </p>
                <a href="/admin/settings" className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1">
                  Manage <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Auto-posting and live analytics are available for connected platforms.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-300">
                  <span className="font-medium text-white">Manual Mode Active</span> — Use this hub to plan, draft, and organize your social content.
                </p>
                <a href="/admin/settings" className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1">
                  Connect APIs <Power className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Copy posts to clipboard and publish manually. Connect social APIs in Settings to unlock auto-posting.
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Calendar (2 cols) */}
          <div className="col-span-2">
            <SocialCalendar 
              posts={posts} 
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onEditPost={handleEditPost}
            />
          </div>

          {/* Post List (1 col) */}
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
                      onEdit={() => handleEditPost(post)}
                      onDelete={() => deleteMutation.mutate(post.id)}
                      onMarkPosted={(livePostUrl) => markPostedMutation.mutate({ postId: post.id, livePostUrl })}
                      onApprove={() => approveMutation.mutate(post.id)}
                    />
                  ))
                )}
              </CardContent>
            </Card>

            <AttributionFunnel stats={stats} />
          </div>
        </div>
      </div>

      {/* Post Composer Dialog */}
      <PostComposer
        open={composerOpen}
        onClose={handleCloseComposer}
        post={editingPost}
        campaigns={campaigns}
        contentDays={contentDays}
      />
    </AdminLayout>
  );
}

// ============================================
// EXPORT
// ============================================

export default function SocialMediaHub() {
  return (
    <AdminAuthGuard>
      <SocialMediaHubContent />
    </AdminAuthGuard>
  );
}
