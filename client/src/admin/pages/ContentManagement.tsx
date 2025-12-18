import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Plus, 
  Edit, 
  BookOpen,
  HelpCircle,
  CheckCircle,
  Clock,
  Search,
  GraduationCap,
  Users,
  Sparkles
} from "lucide-react";

interface ContentDay {
  id: number;
  dayIndex: number;
  title: string;
  readingLevel: string;
  culturalStage: string;
  theme: string;
  isActive: boolean;
  isApproved: boolean;
  questionsCount: number;
  lessonsCount: number;
  quizzesCount: number;
}

interface ContentLesson {
  id: number;
  dayId: number;
  title: string;
  content: string;
  keyTakeaways: string[];
  whyItMatters: string | null;
  estimatedReadTime: number;
}

interface ContentQuiz {
  id: number;
  dayId: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ContentQuestion {
  id: number;
  dayId: number;
  title: string;
  content: string;
  category: string;
  icon: string;
  orderIndex: number;
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

function ContentDayCard({ day, onEdit }: { day: ContentDay; onEdit: () => void }) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer" onClick={onEdit}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-orange-500 font-bold">Day {day.dayIndex}</span>
              {day.isApproved ? (
                <Badge className="bg-green-500/20 text-green-400 border-0">Approved</Badge>
              ) : (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-0">Pending</Badge>
              )}
              {!day.isActive && (
                <Badge className="bg-zinc-700 text-zinc-400 border-0">Inactive</Badge>
              )}
            </div>
            <h3 className="text-white font-medium">{day.title}</h3>
            
            <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500 flex-wrap">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {day.theme}
              </span>
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3 h-3" />
                {day.readingLevel}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {day.culturalStage}
              </span>
            </div>
            
            <div className="flex items-center gap-4 mt-3 text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                {day.questionsCount} questions
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {day.lessonsCount} lesson
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {day.quizzesCount} quizzes
              </span>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="text-zinc-400 hover:text-white"
            data-testid={`button-edit-day-${day.dayIndex}`}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EditDayDialog({ day, open, onOpenChange }: { 
  day: ContentDay | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    theme: "",
    readingLevel: "",
    culturalStage: "",
    isActive: true,
    isApproved: false,
  });
  
  const { data: lesson, isLoading: lessonLoading } = useQuery<ContentLesson>({
    queryKey: ["/api/admin/content/lessons", day?.id],
    enabled: !!day?.id && open,
  });
  
  const { data: quizzes, isLoading: quizzesLoading } = useQuery<ContentQuiz[]>({
    queryKey: ["/api/admin/content/quizzes", day?.id],
    enabled: !!day?.id && open,
  });
  
  const { data: questions, isLoading: questionsLoading } = useQuery<ContentQuestion[]>({
    queryKey: ["/api/admin/content/questions", day?.id],
    enabled: !!day?.id && open,
  });

  const updateDayMutation = useMutation({
    mutationFn: async (data: Partial<ContentDay>) => {
      const res = await apiRequest("PATCH", `/api/admin/content/days/${day?.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/days"] });
      toast({ title: "Content day updated successfully" });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
    },
  });

  useEffect(() => {
    if (day) {
      setFormData({
        title: day.title,
        theme: day.theme,
        readingLevel: day.readingLevel,
        culturalStage: day.culturalStage,
        isActive: day.isActive,
        isApproved: day.isApproved,
      });
    }
  }, [day]);

  if (!day) return null;

  const isLoading = lessonLoading || quizzesLoading || questionsLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Day {day.dayIndex}</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Manage content for this curriculum day
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="bg-zinc-800 border-zinc-700">
            <TabsTrigger value="details" className="data-[state=active]:bg-orange-500">Details</TabsTrigger>
            <TabsTrigger value="lesson" className="data-[state=active]:bg-orange-500">Lesson</TabsTrigger>
            <TabsTrigger value="questions" className="data-[state=active]:bg-orange-500">Questions</TabsTrigger>
            <TabsTrigger value="quizzes" className="data-[state=active]:bg-orange-500">Quizzes</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Title</Label>
                <Input 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Theme</Label>
                <Input 
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Reading Level</Label>
                <Input 
                  value={formData.readingLevel}
                  onChange={(e) => setFormData({ ...formData, readingLevel: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="e.g., 8th grade"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Cultural Stage</Label>
                <Input 
                  value={formData.culturalStage}
                  onChange={(e) => setFormData({ ...formData, culturalStage: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="e.g., Normie → Pre-coiner"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-zinc-300">
                <input 
                  type="checkbox" 
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded"
                />
                Active
              </label>
              <label className="flex items-center gap-2 text-zinc-300">
                <input 
                  type="checkbox" 
                  checked={formData.isApproved}
                  onChange={(e) => setFormData({ ...formData, isApproved: e.target.checked })}
                  className="rounded"
                />
                Approved
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="border-zinc-700 text-zinc-300">
                Cancel
              </Button>
              <Button 
                onClick={() => updateDayMutation.mutate(formData)}
                className="bg-orange-500 hover:bg-orange-600"
                disabled={updateDayMutation.isPending}
              >
                {updateDayMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="lesson" className="mt-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              </div>
            ) : lesson ? (
              <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-orange-500" />
                    {lesson.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-zinc-400">
                    <Clock className="w-4 h-4" />
                    {lesson.estimatedReadTime} min read
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-zinc-400 text-xs uppercase">Content</Label>
                    <p className="text-zinc-300 mt-1 whitespace-pre-wrap text-sm leading-relaxed">{lesson.content}</p>
                  </div>
                  
                  {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
                    <div>
                      <Label className="text-zinc-400 text-xs uppercase">Key Takeaways</Label>
                      <ul className="mt-1 space-y-1">
                        {lesson.keyTakeaways.map((takeaway, i) => (
                          <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {takeaway}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {lesson.whyItMatters && (
                    <div>
                      <Label className="text-zinc-400 text-xs uppercase">Why It Matters</Label>
                      <p className="text-zinc-300 mt-1 text-sm">{lesson.whyItMatters}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-8 text-zinc-400">No lesson content for this day</div>
            )}
          </TabsContent>

          <TabsContent value="questions" className="mt-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              </div>
            ) : questions && questions.length > 0 ? (
              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <Card key={q.id} className="bg-zinc-800 border-zinc-700">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-500 font-bold text-sm">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{q.title}</h4>
                          <p className="text-sm text-zinc-400 mt-1">{q.content}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500">
                            <Badge variant="outline" className="border-zinc-600 text-zinc-400">{q.category}</Badge>
                            <span>{q.icon}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-400">No questions for this day</div>
            )}
          </TabsContent>

          <TabsContent value="quizzes" className="mt-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              </div>
            ) : quizzes && quizzes.length > 0 ? (
              <div className="space-y-4">
                {quizzes.map((quiz, idx) => (
                  <Card key={quiz.id} className="bg-zinc-800 border-zinc-700">
                    <CardContent className="p-4">
                      <p className="text-white font-medium mb-3">Q{idx + 1}: {quiz.question}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {quiz.options.map((opt, i) => (
                          <div 
                            key={i} 
                            className={`p-2 rounded text-sm ${i === quiz.correctAnswer ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-zinc-900 text-zinc-400'}`}
                          >
                            <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                            {opt}
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 p-2 bg-zinc-900 rounded text-xs text-zinc-400">
                        <span className="text-zinc-500">Explanation:</span> {quiz.explanation}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-400">No quizzes for this day</div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function CreateDayDialog({ open, onOpenChange, nextDayIndex }: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  nextDayIndex: number;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    dayIndex: nextDayIndex,
    title: "",
    theme: "",
    readingLevel: "8th grade",
    culturalStage: "Normie → Pre-coiner",
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, dayIndex: nextDayIndex }));
  }, [nextDayIndex]);

  const createDayMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/admin/content/days", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/days"] });
      toast({ title: "Content day created successfully" });
      onOpenChange(false);
      setFormData({
        dayIndex: nextDayIndex + 1,
        title: "",
        theme: "",
        readingLevel: "8th grade",
        culturalStage: "Normie → Pre-coiner",
      });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create", description: error.message, variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Day</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Add a new curriculum day to your content
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Day Number</Label>
              <Input 
                type="number"
                value={formData.dayIndex}
                onChange={(e) => setFormData({ ...formData, dayIndex: parseInt(e.target.value) || nextDayIndex })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Theme</Label>
              <Input 
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="e.g., Bitcoin basics"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-zinc-300">Title</Label>
            <Input 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Enter a compelling title for this day"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Reading Level</Label>
              <Input 
                value={formData.readingLevel}
                onChange={(e) => setFormData({ ...formData, readingLevel: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="e.g., 8th grade"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Cultural Stage</Label>
              <Input 
                value={formData.culturalStage}
                onChange={(e) => setFormData({ ...formData, culturalStage: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="e.g., Normie → Pre-coiner"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-zinc-700 text-zinc-300">
              Cancel
            </Button>
            <Button 
              onClick={() => createDayMutation.mutate(formData)}
              className="bg-orange-500 hover:bg-orange-600"
              disabled={createDayMutation.isPending || !formData.title || !formData.theme}
            >
              {createDayMutation.isPending ? "Creating..." : "Create Day"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ContentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingDay, setEditingDay] = useState<ContentDay | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: contentDays, isLoading } = useQuery<ContentDay[]>({
    queryKey: ["/api/admin/content/days"],
  });

  const filteredDays = contentDays?.filter(day => 
    day.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    day.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
    day.dayIndex.toString().includes(searchQuery)
  );

  const nextDayIndex = contentDays ? Math.max(...contentDays.map(d => d.dayIndex), 0) + 1 : 1;

  const handleEdit = (day: ContentDay) => {
    setEditingDay(day);
    setEditDialogOpen(true);
  };

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Content Management</h1>
              <p className="text-zinc-400">Manage daily curriculum content ({contentDays?.length || 0} days)</p>
            </div>
            <Button 
              className="bg-orange-500 hover:bg-orange-600" 
              onClick={() => setCreateDialogOpen(true)}
              data-testid="button-add-day"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Day
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Search by title, theme, or day number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-800 text-white"
              data-testid="input-search-content"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : filteredDays && filteredDays.length > 0 ? (
              filteredDays.map((day) => (
                <ContentDayCard 
                  key={day.id} 
                  day={day} 
                  onEdit={() => handleEdit(day)}
                />
              ))
            ) : (
              <div className="text-center py-12 text-zinc-400">
                {searchQuery ? "No content days match your search" : "No content days found. Click 'Add Day' to create your first one."}
              </div>
            )}
          </div>

          <EditDayDialog 
            day={editingDay} 
            open={editDialogOpen} 
            onOpenChange={setEditDialogOpen}
          />
          
          <CreateDayDialog 
            open={createDialogOpen} 
            onOpenChange={setCreateDialogOpen}
            nextDayIndex={nextDayIndex}
          />
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}
