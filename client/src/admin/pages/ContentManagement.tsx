import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Plus, 
  Edit, 
  Trash2, 
  ChevronRight, 
  BookOpen,
  HelpCircle,
  CheckCircle,
  Clock,
  Search,
  Eye
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
    <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
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
            <h3 className="text-white font-medium truncate">{day.title}</h3>
            <p className="text-sm text-zinc-500 mt-1">{day.theme}</p>
            
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
            onClick={onEdit}
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
  const [selectedDay, setSelectedDay] = useState<ContentDay | null>(null);
  
  const { data: lesson } = useQuery<ContentLesson>({
    queryKey: ["/api/admin/content/lessons", day?.id],
    enabled: !!day?.id,
  });
  
  const { data: quizzes } = useQuery<ContentQuiz[]>({
    queryKey: ["/api/admin/content/quizzes", day?.id],
    enabled: !!day?.id,
  });
  
  const { data: questions } = useQuery<ContentQuestion[]>({
    queryKey: ["/api/admin/content/questions", day?.id],
    enabled: !!day?.id,
  });

  const updateDayMutation = useMutation({
    mutationFn: async (data: Partial<ContentDay>) => {
      const res = await apiRequest("PATCH", `/api/admin/content/days/${day?.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/days"] });
      toast({ title: "Content day updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
    },
  });

  useEffect(() => {
    if (day) setSelectedDay(day);
  }, [day]);

  if (!selectedDay) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Day {selectedDay.dayIndex}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Title</Label>
              <Input 
                value={selectedDay.title}
                onChange={(e) => setSelectedDay({ ...selectedDay, title: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Theme</Label>
              <Input 
                value={selectedDay.theme}
                onChange={(e) => setSelectedDay({ ...selectedDay, theme: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-zinc-300">
              <input 
                type="checkbox" 
                checked={selectedDay.isActive}
                onChange={(e) => setSelectedDay({ ...selectedDay, isActive: e.target.checked })}
                className="rounded"
              />
              Active
            </label>
            <label className="flex items-center gap-2 text-zinc-300">
              <input 
                type="checkbox" 
                checked={selectedDay.isApproved}
                onChange={(e) => setSelectedDay({ ...selectedDay, isApproved: e.target.checked })}
                className="rounded"
              />
              Approved
            </label>
          </div>

          {lesson && (
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-zinc-300 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Lesson
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h4 className="font-medium text-white mb-2">{lesson.title}</h4>
                <p className="text-sm text-zinc-400 line-clamp-3">{lesson.content}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
                  <Clock className="w-3 h-3" />
                  {lesson.estimatedReadTime} min read
                </div>
              </CardContent>
            </Card>
          )}

          {quizzes && quizzes.length > 0 && (
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-zinc-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Quiz Questions ({quizzes.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quizzes.map((quiz, idx) => (
                  <div key={quiz.id} className="p-3 bg-zinc-900 rounded-lg">
                    <p className="text-sm text-white">Q{idx + 1}: {quiz.question}</p>
                    <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                      {quiz.options.map((opt, i) => (
                        <div 
                          key={i} 
                          className={`p-1 rounded ${i === quiz.correctAnswer ? 'bg-green-500/20 text-green-400' : 'text-zinc-400'}`}
                        >
                          {String.fromCharCode(65 + i)}. {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-zinc-700 text-zinc-300">
              Cancel
            </Button>
            <Button 
              onClick={() => {
                updateDayMutation.mutate({
                  title: selectedDay.title,
                  theme: selectedDay.theme,
                  isActive: selectedDay.isActive,
                  isApproved: selectedDay.isApproved,
                });
                onOpenChange(false);
              }}
              className="bg-orange-500 hover:bg-orange-600"
              disabled={updateDayMutation.isPending}
            >
              {updateDayMutation.isPending ? "Saving..." : "Save Changes"}
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

  const { data: contentDays, isLoading } = useQuery<ContentDay[]>({
    queryKey: ["/api/admin/content/days"],
  });

  const filteredDays = contentDays?.filter(day => 
    day.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    day.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
    day.dayIndex.toString().includes(searchQuery)
  );

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
              <p className="text-zinc-400">Manage daily curriculum content</p>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600" data-testid="button-add-day">
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
                {searchQuery ? "No content days match your search" : "No content days found"}
              </div>
            )}
          </div>

          <EditDayDialog 
            day={editingDay} 
            open={editDialogOpen} 
            onOpenChange={setEditDialogOpen}
          />
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}
