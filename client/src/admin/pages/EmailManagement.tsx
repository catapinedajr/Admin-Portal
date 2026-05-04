import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Mail, Send, Settings, FileText, Zap, BarChart3,
  Plus, Edit, Trash2, Power, PowerOff, Sparkles,
  CheckCircle, AlertCircle, Eye,
  Lock, Unlock, RotateCcw, Loader2, Save
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
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

// ============================================
// DEFAULT EMAIL AI INSTRUCTIONS
// ============================================

const DEFAULT_EMAIL_INSTRUCTIONS = `# HODLearn Email Generation Instructions

## BRAND VOICE
You are writing emails for HODLearn, the premier Bitcoin education platform. Your tone should be:
- **Educational**: Focus on teaching, not selling
- **Trustworthy**: Use facts and data, avoid hype
- **Encouraging**: Motivate continued learning
- **Professional**: Maintain credibility while being approachable

## EMAIL STRUCTURE

### Subject Lines
- Keep under 50 characters
- Create curiosity without clickbait
- Personalize when possible (use {{firstName}})
- Avoid spam trigger words (FREE, URGENT, ACT NOW)

### Email Body
1. **Opening Hook**: Engage immediately with value or relevance
2. **Core Content**: Deliver the main message clearly
3. **Call-to-Action**: One clear, compelling action
4. **Signature**: Warm close with HODLearn branding

## CONTENT GUIDELINES

**DO:**
- Reference specific lessons or features
- Use the learner's progress data when relevant
- Include educational value in every email
- Write for mobile-first (short paragraphs)
- Use {{firstName}} for personalization

**DON'T:**
- Make price predictions or financial advice
- Use overly salesy language
- Include too many CTAs (stick to one)
- Write walls of text
- Reference time-sensitive events without dates

## EMAIL TYPES

### Welcome Emails
- Warm, encouraging tone
- Set expectations for the learning journey
- Highlight the first lesson or quick win

### Streak/Engagement Emails
- Celebrate progress with specific milestones
- Gentle re-engagement, not guilt-tripping
- Offer easy "comeback" path

### Educational Newsletters
- Lead with an interesting Bitcoin fact
- Connect to relevant HODLearn lessons
- Encourage continued exploration

### Promotional Emails
- Focus on value, not discounts
- Highlight learning outcomes
- Social proof when available

## TEMPLATE VARIABLES
Available variables for personalization:
- {{firstName}} - User's first name
- {{lastName}} - User's last name  
- {{currentDay}} - Current lesson day
- {{streakCount}} - Current streak
- {{totalPoints}} - HODLearn points balance

## OUTPUT FORMAT
Generate both HTML and plain text versions.
HTML should use inline styles for email compatibility.`;

// ============================================
// EMAIL AI INSTRUCTIONS EDITOR
// ============================================

interface AiInstructionsData {
  type: string;
  name: string;
  instructions: string;
  isLocked: boolean;
  exists: boolean;
  updatedAt?: string;
}

function EmailAIInstructionsEditor() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editedInstructions, setEditedInstructions] = useState("");
  const [showUnlockConfirm, setShowUnlockConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: instructionsData, isLoading, error: instructionsError } = useQuery<AiInstructionsData>({
    queryKey: ["/api/admin/ai-instructions/email"],
  });

  useEffect(() => {
    if (instructionsData?.exists && instructionsData.instructions) {
      setEditedInstructions(instructionsData.instructions);
    } else {
      setEditedInstructions(DEFAULT_EMAIL_INSTRUCTIONS);
    }
    setHasChanges(false);
  }, [instructionsData]);

  const handleTextChange = (value: string) => {
    setEditedInstructions(value);
    const originalValue = instructionsData?.exists ? instructionsData.instructions : DEFAULT_EMAIL_INSTRUCTIONS;
    setHasChanges(value !== originalValue);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/ai-instructions/email", {
        name: "Email AI Instructions",
        instructions: editedInstructions
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ai-instructions/email"] });
      toast({ title: "Instructions saved successfully!" });
      setHasChanges(false);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to save", description: error.message, variant: "destructive" });
    }
  });

  const lockMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/ai-instructions/email/lock", {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ai-instructions/email"] });
      toast({ title: "Instructions locked" });
    }
  });

  const unlockMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/ai-instructions/email/unlock", { confirmed: true });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ai-instructions/email"] });
      toast({ title: "Instructions unlocked" });
      setShowUnlockConfirm(false);
    }
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/ai-instructions/email/reset", { confirmed: true });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ai-instructions/email"] });
      setEditedInstructions(DEFAULT_EMAIL_INSTRUCTIONS);
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
        data-testid="button-open-email-ai-instructions"
      >
        <Settings className="w-4 h-4 mr-2 text-orange-500" />
        Email AI Instructions
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
              Email AI Instructions
              {isUsingDefault && (
                <Badge className="bg-zinc-700 text-zinc-300 text-xs">Using Default</Badge>
              )}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Customize the AI instructions used when generating email content.
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
                        data-testid="button-unlock-email-instructions"
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
                          data-testid="button-reset-email-instructions"
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
                          data-testid="button-lock-email-instructions"
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
                  data-testid="input-email-ai-instructions"
                />
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-zinc-500">
                    These instructions guide AI when generating email content.
                  </div>
                  {!isLocked && hasChanges && (
                    <Button
                      onClick={() => saveMutation.mutate()}
                      disabled={saveMutation.isPending}
                      className="bg-orange-500 hover:bg-orange-600 text-xs"
                      data-testid="button-save-email-instructions"
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
              Are you sure you want to unlock these instructions for editing? Changes to AI instructions will affect all future email content generation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-700 text-zinc-300">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => unlockMutation.mutate()}
              className="bg-orange-500 hover:bg-orange-600"
              data-testid="button-confirm-unlock-email"
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
              data-testid="button-confirm-reset-email"
            >
              Yes, Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string | null;
  category: string;
  isActive: boolean;
  createdAt: string;
}

interface EmailCampaign {
  id: number;
  name: string;
  subject: string;
  htmlContent: string;
  targetAudience: string;
  status: string;
  recipientCount: number;
  sentCount: number;
  openCount: number;
  clickCount: number;
  scheduledAt: string | null;
  sentAt: string | null;
  createdAt: string;
}

interface TriggerConfig {
  delayMinutes?: number;
  streakDays?: number;
  inactiveDays?: number;
  lessonDay?: number;
  customEvent?: string;
}

interface AudienceFilter {
  subscriptionStatus?: 'all' | 'premium' | 'free' | 'trial';
  minDay?: number;
  maxDay?: number;
  hasStreak?: boolean;
  minStreak?: number;
}

interface EmailAutomation {
  id: number;
  name: string;
  triggerType: string;
  description: string | null;
  templateId: number | null;
  isEnabled: boolean;
  triggerConfig: TriggerConfig | null;
  audienceFilter: AudienceFilter | null;
  subjectOverride: string | null;
  sentCount: number;
  lastSentAt: string | null;
}

interface EmailStats {
  serviceStatus: {
    configured: boolean;
    fromEmail: string;
    provider: string;
    source: string;
  };
  stats: {
    totalSent: number;
    totalFailed: number;
    totalTemplates: number;
    totalCampaigns: number;
    enabledAutomations: number;
    totalAutomations: number;
  };
}

function EmailManagementContent() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("overview");
    
    // Dialog states
    const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
    const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
    const [automationDialogOpen, setAutomationDialogOpen] = useState(false);
    const [aiDialogOpen, setAiDialogOpen] = useState(false);
    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
    const [previewHtml, setPreviewHtml] = useState("");
    
    // Form states
    const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
    const [editingCampaign, setEditingCampaign] = useState<EmailCampaign | null>(null);
    const [editingAutomation, setEditingAutomation] = useState<EmailAutomation | null>(null);
    
    // Automation form state
    const [automationForm, setAutomationForm] = useState({
        name: "",
        triggerType: "welcome",
        description: "",
        templateId: null as number | null,
        isEnabled: false,
        subjectOverride: "",
        triggerConfig: {
        delayMinutes: 0,
        streakDays: 7,
        inactiveDays: 3,
        lessonDay: 1,
        },
        audienceFilter: {
        subscriptionStatus: "all" as 'all' | 'premium' | 'free' | 'trial',
        minDay: undefined as number | undefined,
        maxDay: undefined as number | undefined,
        hasStreak: false,
        minStreak: undefined as number | undefined,
        },
    });
    
    // AI generation form
    const [aiForm, setAiForm] = useState({
        purpose: "",
        tone: "friendly",
        keyPoints: "",
        templateType: "general",
    });

    // AI template assistant state
    const [showAiAssistant, setShowAiAssistant] = useState(false);
    const [templateAiForm, setTemplateAiForm] = useState({
        objective: "",
        subjectIdeas: "",
        notes: "",
        tone: "friendly",
    });
    const [generatedTemplate, setGeneratedTemplate] = useState<{
        name: string;
        subject: string;
        htmlContent: string;
        textContent: string;
    } | null>(null);

    // Queries
    const { data: stats, isLoading: statsLoading } = useQuery<EmailStats>({
        queryKey: ["/api/admin/email/stats"],
    });

    const { data: templates = [] } = useQuery<EmailTemplate[]>({
        queryKey: ["/api/admin/email/templates"],
    });

    const { data: campaigns = [] } = useQuery<EmailCampaign[]>({
        queryKey: ["/api/admin/email/campaigns"],
    });

    const { data: automations = [] } = useQuery<EmailAutomation[]>({
        queryKey: ["/api/admin/email/automations"],
    });

    // Mutations
    const createTemplateMutation = useMutation({
        mutationFn: (data: any) => apiRequest("POST", "/api/admin/email/templates", data),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/email/templates"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/email/stats"] });
        setTemplateDialogOpen(false);
        setEditingTemplate(null);
        toast({ title: "Template created" });
        },
        onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    });

    const updateTemplateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => 
        apiRequest("PATCH", `/api/admin/email/templates/${id}`, data),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/email/templates"] });
        setTemplateDialogOpen(false);
        setEditingTemplate(null);
        toast({ title: "Template updated" });
        },
        onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    });

    const deleteTemplateMutation = useMutation({
        mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/email/templates/${id}`),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/email/templates"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/email/stats"] });
        toast({ title: "Template deleted" });
        },
    });

    const createCampaignMutation = useMutation({
        mutationFn: (data: any) => apiRequest("POST", "/api/admin/email/campaigns", data),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/email/campaigns"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/email/stats"] });
        setCampaignDialogOpen(false);
        setEditingCampaign(null);
        toast({ title: "Campaign created" });
        },
        onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    });

    const sendCampaignMutation = useMutation({
        mutationFn: (id: number) => apiRequest("POST", `/api/admin/email/campaigns/${id}/send`),
        onSuccess: (data: any) => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/email/campaigns"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/email/stats"] });
        toast({ title: "Campaign sent", description: `Sent to ${data.sentCount} recipients` });
        },
        onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    });

    const createAutomationMutation = useMutation({
        mutationFn: (data: any) => apiRequest("POST", "/api/admin/email/automations", data),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/email/automations"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/email/stats"] });
        setAutomationDialogOpen(false);
        setEditingAutomation(null);
        toast({ title: "Automation created" });
        },
        onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    });

    const updateAutomationMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => 
        apiRequest("PATCH", `/api/admin/email/automations/${id}`, data),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/email/automations"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/email/stats"] });
        setAutomationDialogOpen(false);
        setEditingAutomation(null);
        toast({ title: "Automation updated" });
        },
        onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    });

    const deleteAutomationMutation = useMutation({
        mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/email/automations/${id}`),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/email/automations"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/email/stats"] });
        toast({ title: "Automation deleted" });
        },
        onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    });

    const generateEmailMutation = useMutation({
        mutationFn: (data: any) => apiRequest("POST", "/api/admin/email/generate", data),
        onSuccess: async (data: any) => {

            const json = await data.json();
            console.log("Generated email data:", json);

            setAiDialogOpen(false);
            // Open template dialog with generated content
            setEditingTemplate({
                id: 0,
                name: "",
                subject: json.subject,
                htmlContent: json.html,
                textContent: json.text,
                category: aiForm.templateType,
                isActive: true,
                createdAt: new Date().toISOString(),
            });
            setTemplateDialogOpen(true);
            toast({ title: "Email generated", description: "Review and save as a template" });
        },
        onError: (err: any) => toast({ title: "Generation failed", description: err.message, variant: "destructive" }),
    });

    const generateTemplateAiMutation = useMutation({
        mutationFn: (data: any) => apiRequest("POST", "/api/admin/email/generate", {
        purpose: data.objective,
        tone: data.tone,
        keyPoints: `Subject ideas: ${data.subjectIdeas}\n\nAdditional notes: ${data.notes}`,
        templateType: "general",
        }),
        onSuccess: (data: any) => {
        setGeneratedTemplate({
            name: templateAiForm.objective.slice(0, 50),
            subject: data.subject,
            htmlContent: data.html,
            textContent: data.text,
        });
        setShowAiAssistant(false);
        toast({ title: "Content generated", description: "Edit the content below and save" });
        },
        onError: (err: any) => toast({ title: "Generation failed", description: err.message, variant: "destructive" }),
    });

    const handleSaveTemplate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
        name: formData.get("name"),
        subject: formData.get("subject"),
        htmlContent: formData.get("htmlContent"),
        textContent: formData.get("textContent") || null,
        category: formData.get("category"),
        isActive: true,
        };

        if (editingTemplate?.id) {
        updateTemplateMutation.mutate({ id: editingTemplate.id, data });
        } else {
        createTemplateMutation.mutate(data);
        }
    };

    const handleSaveCampaign = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
        name: formData.get("name"),
        subject: formData.get("subject"),
        htmlContent: formData.get("htmlContent"),
        textContent: formData.get("textContent") || null,
        targetAudience: formData.get("targetAudience"),
        status: "draft",
        };

        createCampaignMutation.mutate(data);
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
        draft: "bg-zinc-600",
        scheduled: "bg-blue-600",
        sending: "bg-yellow-600",
        sent: "bg-green-600",
        failed: "bg-red-600",
        };
        return <Badge className={styles[status] || "bg-zinc-600"}>{status}</Badge>;
    };

    const openAutomationDialog = (automation?: EmailAutomation) => {
        if (automation) {
        setEditingAutomation(automation);
        setAutomationForm({
            name: automation.name,
            triggerType: automation.triggerType,
            description: automation.description || "",
            templateId: automation.templateId,
            isEnabled: automation.isEnabled,
            subjectOverride: automation.subjectOverride || "",
            triggerConfig: {
            delayMinutes: automation.triggerConfig?.delayMinutes || 0,
            streakDays: automation.triggerConfig?.streakDays || 7,
            inactiveDays: automation.triggerConfig?.inactiveDays || 3,
            lessonDay: automation.triggerConfig?.lessonDay || 1,
            },
            audienceFilter: {
            subscriptionStatus: automation.audienceFilter?.subscriptionStatus || "all",
            minDay: automation.audienceFilter?.minDay,
            maxDay: automation.audienceFilter?.maxDay,
            hasStreak: automation.audienceFilter?.hasStreak || false,
            minStreak: automation.audienceFilter?.minStreak,
            },
        });
        } else {
        setEditingAutomation(null);
        setAutomationForm({
            name: "",
            triggerType: "welcome",
            description: "",
            templateId: null,
            isEnabled: false,
            subjectOverride: "",
            triggerConfig: { delayMinutes: 0, streakDays: 7, inactiveDays: 3, lessonDay: 1 },
            audienceFilter: { subscriptionStatus: "all", hasStreak: false, minDay: undefined, maxDay: undefined, minStreak: undefined },
        });
        }
        setAutomationDialogOpen(true);
    };

    const handleSaveAutomation = () => {
        const data = {
        name: automationForm.name,
        triggerType: automationForm.triggerType,
        description: automationForm.description || null,
        templateId: automationForm.templateId,
        isEnabled: automationForm.isEnabled,
        subjectOverride: automationForm.subjectOverride || null,
        triggerConfig: automationForm.triggerConfig,
        audienceFilter: automationForm.audienceFilter,
        };

        if (editingAutomation?.id) {
        updateAutomationMutation.mutate({ id: editingAutomation.id, data });
        } else {
        createAutomationMutation.mutate(data);
        }
    };

    const getTriggerLabel = (type: string) => {
        const labels: Record<string, string> = {
        welcome: "New User Signup",
        streak_milestone: "Streak Milestone",
        inactivity: "User Inactivity",
        lesson_complete: "Lesson Completed",
        referral_success: "Successful Referral",
        custom: "Custom Event",
        };
        return labels[type] || type;
    };

    return (
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-2xl font-bold text-white">Email Management</h1>
            <p className="text-zinc-400">Manage email templates, campaigns, and automations</p>
            </div>
            <div className="flex gap-2">
            <EmailAIInstructionsEditor />
            <Button
                variant="outline"
                className="border-zinc-700"
                onClick={() => setAiDialogOpen(true)}
                data-testid="button-generate-ai-email"
            >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Generate
            </Button>
            </div>
        </div>

        {/* Service Status */}
        {stats && (
            <Card className={`${stats.serviceStatus.configured ? 'bg-green-900/20 border-green-700' : 'bg-yellow-900/20 border-yellow-700'}`}>
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                {stats.serviceStatus.configured ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                )}
                <div>
                    <p className={stats.serviceStatus.configured ? "text-green-400" : "text-yellow-400"}>
                    {stats.serviceStatus.configured 
                        ? `Email service connected via ${stats.serviceStatus.source}` 
                        : "Email service not configured"}
                    </p>
                    <p className="text-sm text-zinc-400">
                    {stats.serviceStatus.configured 
                        ? `Sending from: ${stats.serviceStatus.fromEmail}` 
                        : "Add RESEND_API_KEY in Settings > Integrations to enable sending"}
                    </p>
                </div>
                </div>
            </CardContent>
            </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Send className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-white">{stats?.stats.totalSent || 0}</p>
                    <p className="text-sm text-zinc-400">Emails Sent</p>
                </div>
                </div>
            </CardContent>
            </Card>

            <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                    <FileText className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-white">{stats?.stats.totalTemplates || 0}</p>
                    <p className="text-sm text-zinc-400">Templates</p>
                </div>
                </div>
            </CardContent>
            </Card>

            <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Mail className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-white">{stats?.stats.totalCampaigns || 0}</p>
                    <p className="text-sm text-zinc-400">Campaigns</p>
                </div>
                </div>
            </CardContent>
            </Card>

            <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                    <Zap className="w-5 h-5 text-green-500" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-white">
                    {stats?.stats.enabledAutomations || 0}/{stats?.stats.totalAutomations || 0}
                    </p>
                    <p className="text-sm text-zinc-400">Automations Active</p>
                </div>
                </div>
            </CardContent>
            </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-zinc-800 border-zinc-700">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="templates" data-testid="tab-templates">Templates</TabsTrigger>
            <TabsTrigger value="campaigns" data-testid="tab-campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="automations" data-testid="tab-automations">Automations</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Campaigns */}
                <Card className="bg-zinc-800/50 border-zinc-700">
                <CardHeader>
                    <CardTitle className="text-white">Recent Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                    {campaigns.length === 0 ? (
                    <p className="text-zinc-400 text-center py-4">No campaigns yet</p>
                    ) : (
                    <div className="space-y-3">
                        {campaigns.slice(0, 5).map((campaign) => (
                        <div key={campaign.id} className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                            <div>
                            <p className="text-white font-medium">{campaign.name}</p>
                            <p className="text-sm text-zinc-400">{campaign.subject}</p>
                            </div>
                            {getStatusBadge(campaign.status)}
                        </div>
                        ))}
                    </div>
                    )}
                </CardContent>
                </Card>

                {/* Automations Status */}
                <Card className="bg-zinc-800/50 border-zinc-700">
                <CardHeader>
                    <CardTitle className="text-white">Automations</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                    {automations.map((automation) => (
                        <div key={automation.id} className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                        <div>
                            <p className="text-white font-medium">{automation.name}</p>
                            <p className="text-sm text-zinc-400">{automation.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-zinc-400">{automation.sentCount} sent</span>
                            <Switch
                            checked={automation.isEnabled}
                            onCheckedChange={(checked) => 
                                updateAutomationMutation.mutate({ id: automation.id, data: { isEnabled: checked } })
                            }
                            />
                        </div>
                        </div>
                    ))}
                    </div>
                </CardContent>
                </Card>
            </div>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-4">
            <div className="flex justify-end">
                <Button
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => {
                    setEditingTemplate(null);
                    setTemplateDialogOpen(true);
                }}
                data-testid="button-new-template"
                >
                <Plus className="w-4 h-4 mr-2" />
                New Template
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                <Card key={template.id} className="bg-zinc-800/50 border-zinc-700">
                    <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                        <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.subject}</CardDescription>
                        </div>
                        <Badge variant="outline" className="border-zinc-600 text-zinc-400">
                        {template.category}
                        </Badge>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <div className="flex gap-2">
                        <Button
                        size="sm"
                        variant="outline"
                        className="border-zinc-600"
                        onClick={() => {
                            setPreviewHtml(template.htmlContent);
                            setPreviewDialogOpen(true);
                        }}
                        data-testid={`button-preview-template-${template.id}`}
                        >
                        <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                        size="sm"
                        variant="outline"
                        className="border-zinc-600"
                        onClick={() => {
                            setEditingTemplate(template);
                            setTemplateDialogOpen(true);
                        }}
                        data-testid={`button-edit-template-${template.id}`}
                        >
                        <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-900/20"
                        onClick={() => deleteTemplateMutation.mutate(template.id)}
                        data-testid={`button-delete-template-${template.id}`}
                        >
                        <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                    </CardContent>
                </Card>
                ))}
            </div>

            {templates.length === 0 && (
                <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="py-12 text-center">
                    <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-400">No templates yet. Create one or use AI to generate.</p>
                </CardContent>
                </Card>
            )}
            </TabsContent>

            {/* Campaigns Tab */}
            <TabsContent value="campaigns" className="space-y-4">
            <div className="flex justify-end">
                <Button
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => {
                    setEditingCampaign(null);
                    setCampaignDialogOpen(true);
                }}
                data-testid="button-new-campaign"
                >
                <Plus className="w-4 h-4 mr-2" />
                New Campaign
                </Button>
            </div>

            <div className="space-y-4">
                {campaigns.map((campaign) => (
                <Card key={campaign.id} className="bg-zinc-800/50 border-zinc-700">
                    <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h3 className="text-white font-semibold">{campaign.name}</h3>
                            {getStatusBadge(campaign.status)}
                        </div>
                        <p className="text-zinc-400 text-sm mt-1">{campaign.subject}</p>
                        <div className="flex gap-4 mt-2 text-sm text-zinc-500">
                            <span>Audience: {campaign.targetAudience}</span>
                            {campaign.sentAt && <span>Sent: {new Date(campaign.sentAt).toLocaleDateString()}</span>}
                            {campaign.sentCount > 0 && (
                            <>
                                <span>Recipients: {campaign.recipientCount}</span>
                                <span>Sent: {campaign.sentCount}</span>
                            </>
                            )}
                        </div>
                        </div>
                        <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-zinc-600"
                            onClick={() => {
                            setPreviewHtml(campaign.htmlContent);
                            setPreviewDialogOpen(true);
                            }}
                            data-testid={`button-preview-campaign-${campaign.id}`}
                        >
                            <Eye className="w-4 h-4" />
                        </Button>
                        {campaign.status === "draft" && (
                            <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => sendCampaignMutation.mutate(campaign.id)}
                            disabled={!stats?.serviceStatus.configured}
                            data-testid={`button-send-campaign-${campaign.id}`}
                            >
                            <Send className="w-4 h-4 mr-1" />
                            Send
                            </Button>
                        )}
                        </div>
                    </div>
                    </CardContent>
                </Card>
                ))}
            </div>

            {campaigns.length === 0 && (
                <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="py-12 text-center">
                    <Mail className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-400">No campaigns yet. Create your first email campaign.</p>
                </CardContent>
                </Card>
            )}
            </TabsContent>

            {/* Automations Tab */}
            <TabsContent value="automations" className="space-y-4">
            <div className="flex justify-end">
                <Button 
                onClick={() => openAutomationDialog()} 
                className="bg-orange-500 hover:bg-orange-600"
                data-testid="button-new-automation"
                >
                <Plus className="w-4 h-4 mr-2" />
                New Automation
                </Button>
            </div>

            <Card className="bg-zinc-800/50 border-zinc-700">
                <CardHeader>
                <CardTitle className="text-white">Email Automations</CardTitle>
                <CardDescription>Configure automatic emails triggered by user actions</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="space-y-4">
                    {automations.map((automation) => (
                    <div key={automation.id} className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-700">
                        <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${automation.isEnabled ? 'bg-green-500/20' : 'bg-zinc-700'}`}>
                            {automation.isEnabled ? (
                            <Power className="w-5 h-5 text-green-500" />
                            ) : (
                            <PowerOff className="w-5 h-5 text-zinc-400" />
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                            <h4 className="text-white font-medium">{automation.name}</h4>
                            <Badge className="bg-orange-500/20 text-orange-400 text-xs">{getTriggerLabel(automation.triggerType)}</Badge>
                            </div>
                            <p className="text-sm text-zinc-400">{automation.description}</p>
                            <div className="flex gap-4 mt-2 text-xs text-zinc-500">
                            <span>Sent: {automation.sentCount} emails</span>
                            {automation.audienceFilter?.subscriptionStatus && automation.audienceFilter.subscriptionStatus !== 'all' && (
                                <span>Audience: {automation.audienceFilter.subscriptionStatus}</span>
                            )}
                            {automation.triggerConfig?.delayMinutes && automation.triggerConfig.delayMinutes > 0 && (
                                <span>Delay: {automation.triggerConfig.delayMinutes}min</span>
                            )}
                            {automation.lastSentAt && (
                                <span>Last: {new Date(automation.lastSentAt).toLocaleDateString()}</span>
                            )}
                            </div>
                        </div>
                        </div>
                        <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openAutomationDialog(automation)}
                            className="border-zinc-600 hover:border-orange-500"
                            data-testid={`button-edit-automation-${automation.id}`}
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAutomationMutation.mutate(automation.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            data-testid={`button-delete-automation-${automation.id}`}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        <Switch
                            checked={automation.isEnabled}
                            onCheckedChange={(checked) => 
                            updateAutomationMutation.mutate({ id: automation.id, data: { isEnabled: checked } })
                            }
                            data-testid={`switch-automation-${automation.id}`}
                        />
                        </div>
                    </div>
                    ))}

                    {automations.length === 0 && (
                    <div className="py-12 text-center">
                        <Zap className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                        <p className="text-zinc-400">No automations yet. Create your first email automation.</p>
                    </div>
                    )}
                </div>
                </CardContent>
            </Card>

            {!stats?.serviceStatus.configured && (
                <Card className="bg-yellow-900/20 border-yellow-700">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <p className="text-yellow-400">
                        Automations require email service to be configured. Add RESEND_API_KEY in Integrations.
                    </p>
                    </div>
                </CardContent>
                </Card>
            )}
            </TabsContent>
        </Tabs>

        {/* Template Dialog */}
        <Dialog open={templateDialogOpen} onOpenChange={(open) => {
            setTemplateDialogOpen(open);
            if (!open) {
            setShowAiAssistant(false);
            setGeneratedTemplate(null);
            setTemplateAiForm({ objective: "", subjectIdeas: "", notes: "", tone: "friendly" });
            }
        }}>
            <DialogContent className="bg-zinc-900 border-zinc-700 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="text-white flex items-center justify-between">
                <span>{editingTemplate?.id ? "Edit Template" : "New Template"}</span>
                {!editingTemplate?.id && (
                    <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAiAssistant(!showAiAssistant)}
                    className={`border-zinc-600 ${showAiAssistant ? 'bg-orange-500/20 border-orange-500' : ''}`}
                    >
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Assistant
                    </Button>
                )}
                </DialogTitle>
            </DialogHeader>

            {/* AI Assistant Panel */}
            {showAiAssistant && !editingTemplate?.id && (
                <div className="p-4 bg-zinc-800/50 rounded-lg border border-orange-500/30 space-y-4">
                <div className="flex items-center gap-2 text-orange-400">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">AI Template Generator</span>
                </div>
                <div>
                    <Label className="text-zinc-400">Objective / Purpose</Label>
                    <Input
                    value={templateAiForm.objective}
                    onChange={(e) => setTemplateAiForm({ ...templateAiForm, objective: e.target.value })}
                    placeholder="e.g., Welcome new users and introduce HODLearn features"
                    className="bg-zinc-800 border-zinc-700 text-white"
                    data-testid="input-ai-objective"
                    />
                </div>
                <div>
                    <Label className="text-zinc-400">Subject Line Ideas</Label>
                    <Input
                    value={templateAiForm.subjectIdeas}
                    onChange={(e) => setTemplateAiForm({ ...templateAiForm, subjectIdeas: e.target.value })}
                    placeholder="e.g., Welcome to the Bitcoin journey, Start learning today"
                    className="bg-zinc-800 border-zinc-700 text-white"
                    data-testid="input-ai-subject-ideas"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <Label className="text-zinc-400">Tone</Label>
                    <Select value={templateAiForm.tone} onValueChange={(v) => setTemplateAiForm({ ...templateAiForm, tone: v })}>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700">
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="motivational">Motivational</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                    <div className="flex items-end">
                    <Button
                        type="button"
                        onClick={() => generateTemplateAiMutation.mutate(templateAiForm)}
                        disabled={generateTemplateAiMutation.isPending || !templateAiForm.objective}
                        className="w-full bg-orange-500 hover:bg-orange-600"
                        data-testid="button-generate-template"
                    >
                        {generateTemplateAiMutation.isPending ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Generating...
                        </>
                        ) : (
                        <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate
                        </>
                        )}
                    </Button>
                    </div>
                </div>
                <div>
                    <Label className="text-zinc-400">Additional Notes (optional)</Label>
                    <Textarea
                    value={templateAiForm.notes}
                    onChange={(e) => setTemplateAiForm({ ...templateAiForm, notes: e.target.value })}
                    placeholder="Any specific points, CTAs, or content to include..."
                    rows={2}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    data-testid="input-ai-notes"
                    />
                </div>
                </div>
            )}

            <form onSubmit={handleSaveTemplate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label className="text-zinc-400">Name</Label>
                    <Input
                    name="name"
                    defaultValue={generatedTemplate?.name || editingTemplate?.name}
                    key={generatedTemplate?.name || editingTemplate?.name || 'new'}
                    required
                    className="bg-zinc-800 border-zinc-700 text-white"
                    data-testid="input-template-name"
                    />
                </div>
                <div>
                    <Label className="text-zinc-400">Category</Label>
                    <Select name="category" defaultValue={editingTemplate?.category || "general"}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="welcome">Welcome</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="notification">Notification</SelectItem>
                        <SelectItem value="transactional">Transactional</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                </div>
                <div>
                <Label className="text-zinc-400">Subject</Label>
                <Input
                    name="subject"
                    defaultValue={generatedTemplate?.subject || editingTemplate?.subject}
                    key={generatedTemplate?.subject || editingTemplate?.subject || 'new'}
                    required
                    className="bg-zinc-800 border-zinc-700 text-white"
                    data-testid="input-template-subject"
                />
                </div>
                <div>
                <Label className="text-zinc-400">HTML Content</Label>
                <Textarea
                    name="htmlContent"
                    defaultValue={generatedTemplate?.htmlContent || editingTemplate?.htmlContent}
                    key={generatedTemplate?.htmlContent || editingTemplate?.htmlContent || 'new'}
                    required
                    rows={12}
                    className="bg-zinc-800 border-zinc-700 text-white font-mono text-sm"
                    data-testid="input-template-html"
                />
                </div>
                <div>
                <Label className="text-zinc-400">Plain Text (optional)</Label>
                <Textarea
                    name="textContent"
                    defaultValue={generatedTemplate?.textContent || editingTemplate?.textContent || ""}
                    key={generatedTemplate?.textContent || editingTemplate?.textContent || 'new'}
                    rows={4}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    data-testid="input-template-text"
                />
                </div>
                <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setTemplateDialogOpen(false)}>
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    className="bg-orange-500 hover:bg-orange-600"
                    disabled={createTemplateMutation.isPending || updateTemplateMutation.isPending}
                    data-testid="button-save-template"
                >
                    {editingTemplate?.id ? "Update" : "Create"} Template
                </Button>
                </DialogFooter>
            </form>
            </DialogContent>
        </Dialog>

        {/* Campaign Dialog */}
        <Dialog open={campaignDialogOpen} onOpenChange={setCampaignDialogOpen}>
            <DialogContent className="bg-zinc-900 border-zinc-700 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="text-white">New Campaign</DialogTitle>
                <DialogDescription>Create an email campaign to send to your users</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveCampaign} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label className="text-zinc-400">Campaign Name</Label>
                    <Input
                    name="name"
                    required
                    className="bg-zinc-800 border-zinc-700 text-white"
                    data-testid="input-campaign-name"
                    />
                </div>
                <div>
                    <Label className="text-zinc-400">Target Audience</Label>
                    <Select name="targetAudience" defaultValue="all">
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="active">Active Users (last 7 days)</SelectItem>
                        <SelectItem value="inactive">Inactive Users</SelectItem>
                        <SelectItem value="subscribers">Subscribers Only</SelectItem>
                        <SelectItem value="non_subscribers">Non-Subscribers</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                </div>
                <div>
                <Label className="text-zinc-400">Subject</Label>
                <Input
                    name="subject"
                    required
                    className="bg-zinc-800 border-zinc-700 text-white"
                    data-testid="input-campaign-subject"
                />
                </div>
                <div>
                <Label className="text-zinc-400">HTML Content</Label>
                <Textarea
                    name="htmlContent"
                    required
                    rows={12}
                    className="bg-zinc-800 border-zinc-700 text-white font-mono text-sm"
                    placeholder="Paste your HTML email content here..."
                    data-testid="input-campaign-html"
                />
                </div>
                <div>
                <Label className="text-zinc-400">Plain Text (optional)</Label>
                <Textarea
                    name="textContent"
                    rows={4}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    data-testid="input-campaign-text"
                />
                </div>
                <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCampaignDialogOpen(false)}>
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    className="bg-orange-500 hover:bg-orange-600"
                    disabled={createCampaignMutation.isPending}
                    data-testid="button-save-campaign"
                >
                    Create Campaign
                </Button>
                </DialogFooter>
            </form>
            </DialogContent>
        </Dialog>

        {/* AI Generation Dialog */}
        <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
            <DialogContent className="bg-zinc-900 border-zinc-700">
            <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                AI Email Generator
                </DialogTitle>
                <DialogDescription>Describe what you want and AI will draft an email for you</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
                <div>
                <Label className="text-zinc-400">Purpose</Label>
                <Textarea
                    value={aiForm.purpose}
                    onChange={(e) => setAiForm({ ...aiForm, purpose: e.target.value })}
                    placeholder="e.g., Re-engage users who haven't logged in for 7 days"
                    className="bg-zinc-800 border-zinc-700 text-white"
                    data-testid="input-ai-purpose"
                />
                </div>
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label className="text-zinc-400">Tone</Label>
                    <Select value={aiForm.tone} onValueChange={(v) => setAiForm({ ...aiForm, tone: v })}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="motivational">Motivational</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label className="text-zinc-400">Template Type</Label>
                    <Select value={aiForm.templateType} onValueChange={(v) => setAiForm({ ...aiForm, templateType: v })}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="welcome">Welcome</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="notification">Notification</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                </div>
                <div>
                <Label className="text-zinc-400">Key Points (optional)</Label>
                <Textarea
                    value={aiForm.keyPoints}
                    onChange={(e) => setAiForm({ ...aiForm, keyPoints: e.target.value })}
                    placeholder="Any specific points you want included..."
                    className="bg-zinc-800 border-zinc-700 text-white"
                    data-testid="input-ai-keypoints"
                />
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAiDialogOpen(false)}>
                Cancel
                </Button>
                <Button 
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => generateEmailMutation.mutate(aiForm)}
                disabled={generateEmailMutation.isPending || !aiForm.purpose}
                data-testid="button-generate-email"
                >
                {generateEmailMutation.isPending ? (
                    <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                    </>
                ) : (
                    <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Email
                    </>
                )}
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
            <DialogContent className="bg-zinc-900 border-zinc-700 max-w-3xl max-h-[90vh]">
            <DialogHeader>
                <DialogTitle className="text-white">Email Preview</DialogTitle>
            </DialogHeader>
            <div className="bg-white rounded-lg overflow-auto max-h-[70vh]">
                <iframe
                srcDoc={previewHtml}
                className="w-full h-[500px] border-0"
                title="Email Preview"
                />
            </div>
            </DialogContent>
        </Dialog>

        {/* Automation Dialog */}
        <Dialog open={automationDialogOpen} onOpenChange={setAutomationDialogOpen}>
            <DialogContent className="bg-zinc-900 border-zinc-700 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="text-white">
                {editingAutomation ? "Edit Automation" : "New Automation"}
                </DialogTitle>
                <DialogDescription>
                Configure when and to whom this automated email should be sent
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                <h3 className="text-sm font-medium text-orange-400">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <Label className="text-zinc-400">Name</Label>
                    <Input
                        value={automationForm.name}
                        onChange={(e) => setAutomationForm({ ...automationForm, name: e.target.value })}
                        placeholder="e.g., Welcome Email"
                        className="bg-zinc-800 border-zinc-700 text-white"
                        data-testid="input-automation-name"
                    />
                    </div>
                    <div>
                    <Label className="text-zinc-400">Template</Label>
                    <Select 
                        value={automationForm.templateId?.toString() || "none"} 
                        onValueChange={(v) => setAutomationForm({ ...automationForm, templateId: v === "none" ? null : parseInt(v) })}
                    >
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700">
                        <SelectItem value="none">No template</SelectItem>
                        {templates.map((t) => (
                            <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>
                </div>
                <div>
                    <Label className="text-zinc-400">Description</Label>
                    <Input
                    value={automationForm.description}
                    onChange={(e) => setAutomationForm({ ...automationForm, description: e.target.value })}
                    placeholder="Brief description of this automation"
                    className="bg-zinc-800 border-zinc-700 text-white"
                    data-testid="input-automation-description"
                    />
                </div>
                </div>

                {/* Trigger Configuration */}
                <div className="space-y-4">
                <h3 className="text-sm font-medium text-orange-400">Trigger Event</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <Label className="text-zinc-400">Trigger Type</Label>
                    <Select 
                        value={automationForm.triggerType} 
                        onValueChange={(v) => setAutomationForm({ ...automationForm, triggerType: v })}
                    >
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700">
                        <SelectItem value="welcome">New User Signup</SelectItem>
                        <SelectItem value="streak_milestone">Streak Milestone</SelectItem>
                        <SelectItem value="inactivity">User Inactivity</SelectItem>
                        <SelectItem value="lesson_complete">Lesson Completed</SelectItem>
                        <SelectItem value="referral_success">Successful Referral</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                    <div>
                    <Label className="text-zinc-400">Delay (minutes)</Label>
                    <Input
                        type="number"
                        min="0"
                        value={automationForm.triggerConfig.delayMinutes}
                        onChange={(e) => setAutomationForm({
                        ...automationForm,
                        triggerConfig: { ...automationForm.triggerConfig, delayMinutes: parseInt(e.target.value) || 0 }
                        })}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        data-testid="input-automation-delay"
                    />
                    </div>
                </div>
                
                {/* Conditional trigger params */}
                {automationForm.triggerType === "streak_milestone" && (
                    <div>
                    <Label className="text-zinc-400">Streak Days (trigger at this milestone)</Label>
                    <Input
                        type="number"
                        min="1"
                        value={automationForm.triggerConfig.streakDays}
                        onChange={(e) => setAutomationForm({
                        ...automationForm,
                        triggerConfig: { ...automationForm.triggerConfig, streakDays: parseInt(e.target.value) || 7 }
                        })}
                        className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    </div>
                )}
                {automationForm.triggerType === "inactivity" && (
                    <div>
                    <Label className="text-zinc-400">Days Inactive (before triggering)</Label>
                    <Input
                        type="number"
                        min="1"
                        value={automationForm.triggerConfig.inactiveDays}
                        onChange={(e) => setAutomationForm({
                        ...automationForm,
                        triggerConfig: { ...automationForm.triggerConfig, inactiveDays: parseInt(e.target.value) || 3 }
                        })}
                        className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    </div>
                )}
                {automationForm.triggerType === "lesson_complete" && (
                    <div>
                    <Label className="text-zinc-400">Lesson Day Number</Label>
                    <Input
                        type="number"
                        min="1"
                        max="336"
                        value={automationForm.triggerConfig.lessonDay}
                        onChange={(e) => setAutomationForm({
                        ...automationForm,
                        triggerConfig: { ...automationForm.triggerConfig, lessonDay: parseInt(e.target.value) || 1 }
                        })}
                        className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    </div>
                )}
                </div>

                {/* Audience Filter */}
                <div className="space-y-4">
                <h3 className="text-sm font-medium text-orange-400">Audience Filter</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <Label className="text-zinc-400">Subscription Status</Label>
                    <Select 
                        value={automationForm.audienceFilter.subscriptionStatus} 
                        onValueChange={(v: 'all' | 'premium' | 'free' | 'trial') => setAutomationForm({
                        ...automationForm,
                        audienceFilter: { ...automationForm.audienceFilter, subscriptionStatus: v }
                        })}
                    >
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700">
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="premium">Premium Only</SelectItem>
                        <SelectItem value="free">Free Users Only</SelectItem>
                        <SelectItem value="trial">Trial Users Only</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                    <div>
                    <Label className="text-zinc-400">Minimum Streak Days</Label>
                    <Input
                        type="number"
                        min="0"
                        value={automationForm.audienceFilter.minStreak || ""}
                        onChange={(e) => setAutomationForm({
                        ...automationForm,
                        audienceFilter: { ...automationForm.audienceFilter, minStreak: e.target.value ? parseInt(e.target.value) : undefined }
                        })}
                        placeholder="Any"
                        className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <Label className="text-zinc-400">Min Lesson Day</Label>
                    <Input
                        type="number"
                        min="1"
                        max="336"
                        value={automationForm.audienceFilter.minDay || ""}
                        onChange={(e) => setAutomationForm({
                        ...automationForm,
                        audienceFilter: { ...automationForm.audienceFilter, minDay: e.target.value ? parseInt(e.target.value) : undefined }
                        })}
                        placeholder="Any"
                        className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    </div>
                    <div>
                    <Label className="text-zinc-400">Max Lesson Day</Label>
                    <Input
                        type="number"
                        min="1"
                        max="336"
                        value={automationForm.audienceFilter.maxDay || ""}
                        onChange={(e) => setAutomationForm({
                        ...automationForm,
                        audienceFilter: { ...automationForm.audienceFilter, maxDay: e.target.value ? parseInt(e.target.value) : undefined }
                        })}
                        placeholder="Any"
                        className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Switch
                    checked={automationForm.audienceFilter.hasStreak}
                    onCheckedChange={(checked) => setAutomationForm({
                        ...automationForm,
                        audienceFilter: { ...automationForm.audienceFilter, hasStreak: checked }
                    })}
                    />
                    <Label className="text-zinc-400">Require Active Streak</Label>
                </div>
                </div>

                {/* Subject Override */}
                <div>
                <Label className="text-zinc-400">Subject Override (optional)</Label>
                <Input
                    value={automationForm.subjectOverride}
                    onChange={(e) => setAutomationForm({ ...automationForm, subjectOverride: e.target.value })}
                    placeholder="Leave blank to use template subject"
                    className="bg-zinc-800 border-zinc-700 text-white"
                />
                </div>

                {/* Enable Toggle */}
                <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                <div>
                    <p className="text-white font-medium">Enable Automation</p>
                    <p className="text-sm text-zinc-400">Automation will start sending when enabled</p>
                </div>
                <Switch
                    checked={automationForm.isEnabled}
                    onCheckedChange={(checked) => setAutomationForm({ ...automationForm, isEnabled: checked })}
                />
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAutomationDialogOpen(false)}>
                Cancel
                </Button>
                <Button 
                className="bg-orange-500 hover:bg-orange-600"
                onClick={handleSaveAutomation}
                disabled={createAutomationMutation.isPending || updateAutomationMutation.isPending || !automationForm.name || !automationForm.triggerType}
                data-testid="button-save-automation"
                >
                {editingAutomation ? "Update" : "Create"} Automation
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
        </div>
    );
}

export default function EmailManagement() {
  return (
    <AdminAuthGuard>
      <AdminLayout>
        <EmailManagementContent />
      </AdminLayout>
    </AdminAuthGuard>
  );
}
