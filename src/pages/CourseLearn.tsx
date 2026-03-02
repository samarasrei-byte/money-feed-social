import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2, Circle, PlayCircle, FileText, ChevronLeft, ChevronRight,
  BookOpen, Award, Maximize2, Minimize2, Download, StickyNote,
} from "lucide-react";
import { useStudentCourse, useCourseStructure } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Course, CourseLesson } from "@/hooks/useCourses";

export default function CourseLearn() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { modules, loading: structLoading } = useCourseStructure(id);
  const { enrollment, isLessonCompleted, markLessonComplete, getLessonNotes, saveNotes, loading: enrLoading } = useStudentCourse(id);

  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<CourseLesson | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesText, setNotesText] = useState("");
  const [playbackRate, setPlaybackRate] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!id) return;
    supabase.from("courses").select("*").eq("id", id).single()
      .then(({ data }) => { if (data) setCourse(data as any as Course); });
  }, [id]);

  // Auto-select first lesson
  useEffect(() => {
    if (modules.length > 0 && !activeLesson) {
      const firstLesson = modules[0]?.lessons?.[0];
      if (firstLesson) {
        setActiveLesson(firstLesson);
        setNotesText(getLessonNotes(firstLesson.id));
      }
    }
  }, [modules]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackRate;
  }, [playbackRate, activeLesson]);

  if (!user) { navigate("/auth"); return null; }
  if (enrLoading || structLoading) return <div className="p-8 text-center text-muted-foreground">Carregando...</div>;
  if (!enrollment) { navigate(`/courses/${id}`); return null; }

  const allLessons = modules.flatMap((m) => m.lessons);
  const currentIdx = allLessons.findIndex((l) => l.id === activeLesson?.id);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;
  const completedCount = allLessons.filter((l) => isLessonCompleted(l.id)).length;
  const progressPercent = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

  const selectLesson = (lesson: CourseLesson) => {
    setActiveLesson(lesson);
    setNotesText(getLessonNotes(lesson.id));
    setSidebarOpen(false);
  };

  const handleComplete = async () => {
    if (!activeLesson) return;
    await markLessonComplete(activeLesson.id);
    toast({ title: "Aula concluída! ✅" });
    if (nextLesson) selectLesson(nextLesson);
  };

  const handleSaveNotes = async () => {
    if (!activeLesson) return;
    await saveNotes(activeLesson.id, notesText);
    toast({ title: "Notas salvas!" });
  };

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className={`flex flex-col min-h-screen ${fullscreen ? "fixed inset-0 z-50 bg-background" : ""}`}>
      {/* Top bar */}
      {!fullscreen && (
        <div className="flex items-center gap-2 p-3 border-b border-border/30 bg-card">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/courses/${id}`)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{course?.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Progress value={progressPercent} className="h-1.5 flex-1" />
              <span className="text-[10px] text-muted-foreground font-medium">{progressPercent}%</span>
            </div>
          </div>
          {progressPercent === 100 && enrollment.certificate_code && (
            <Badge className="bg-gradient-primary text-primary-foreground border-0 text-[10px]">
              <Award className="h-3 w-3 mr-1" /> Certificado
            </Badge>
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Video / Content area */}
          <div className="relative bg-black aspect-video">
            {activeLesson?.video_url ? (
              <video
                ref={videoRef}
                src={activeLesson.video_url}
                controls
                className="w-full h-full"
                key={activeLesson.id}
              />
            ) : activeLesson?.lesson_type === "text" ? (
              <div className="w-full h-full overflow-auto p-6 bg-card text-foreground">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {activeLesson.content || "Sem conteúdo"}
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <BookOpen className="h-12 w-12" />
              </div>
            )}

            {/* Fullscreen toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setFullscreen(!fullscreen)}
            >
              {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>

          {/* Lesson info + actions */}
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-semibold text-base">{activeLesson?.title}</h2>
                {activeLesson?.description && (
                  <p className="text-xs text-muted-foreground mt-1">{activeLesson.description}</p>
                )}
              </div>
            </div>

            {/* Speed + Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {activeLesson?.video_url && (
                <div className="flex items-center gap-1">
                  {speeds.map((s) => (
                    <Button
                      key={s}
                      variant={playbackRate === s ? "default" : "outline"}
                      size="sm"
                      className={`h-7 text-[10px] px-2 ${playbackRate === s ? "bg-primary text-primary-foreground" : ""}`}
                      onClick={() => setPlaybackRate(s)}
                    >
                      {s}x
                    </Button>
                  ))}
                </div>
              )}

              <div className="flex-1" />

              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setNotesOpen(!notesOpen)}>
                <StickyNote className="h-3 w-3 mr-1" /> Notas
              </Button>

              {activeLesson?.attachment_url && (
                <a href={activeLesson.attachment_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <Download className="h-3 w-3 mr-1" /> Material
                  </Button>
                </a>
              )}
            </div>

            {/* Notes */}
            {notesOpen && (
              <div className="space-y-2 p-3 rounded-xl bg-muted/30 border border-border/30">
                <Textarea
                  placeholder="Suas anotações para esta aula..."
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  rows={3}
                  className="bg-background/50"
                />
                <Button size="sm" className="h-8 text-xs" onClick={handleSaveNotes}>
                  Salvar Notas
                </Button>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="flex-1 h-10"
                disabled={!prevLesson}
                onClick={() => prevLesson && selectLesson(prevLesson)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
              </Button>

              {activeLesson && !isLessonCompleted(activeLesson.id) ? (
                <Button
                  className="flex-1 h-10 bg-gradient-primary border-0 text-primary-foreground font-semibold"
                  onClick={handleComplete}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Concluir
                </Button>
              ) : (
                <Button
                  className="flex-1 h-10 bg-gradient-primary border-0 text-primary-foreground"
                  disabled={!nextLesson}
                  onClick={() => nextLesson && selectLesson(nextLesson)}
                >
                  Próxima <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>

            {/* Mobile: Module list toggle */}
            <Button
              variant="outline"
              className="w-full lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <BookOpen className="h-4 w-4 mr-2" /> Ver módulos ({completedCount}/{allLessons.length})
            </Button>
          </div>
        </div>

        {/* Sidebar - modules list */}
        <div className={`
          ${sidebarOpen ? "block" : "hidden"} lg:block
          w-full lg:w-80 border-l border-border/30 bg-card
        `}>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="p-3 space-y-3">
              {modules.map((mod, mi) => (
                <div key={mod.id}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Módulo {mi + 1}: {mod.title}
                  </p>
                  <div className="space-y-1">
                    {mod.lessons.map((lesson) => {
                      const completed = isLessonCompleted(lesson.id);
                      const isActive = activeLesson?.id === lesson.id;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => selectLesson(lesson)}
                          className={`w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-colors
                            ${isActive ? "bg-primary/10 text-primary" : "hover:bg-muted/50"}
                          `}
                        >
                          {completed ? (
                            <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )}
                          <span className="flex-1 truncate">{lesson.title}</span>
                          {lesson.lesson_type === "video" && <PlayCircle className="h-3 w-3 text-muted-foreground" />}
                          {lesson.lesson_type === "pdf" && <FileText className="h-3 w-3 text-muted-foreground" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
