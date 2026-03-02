import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Plus, Trash2, ChevronLeft, GripVertical, PlayCircle, FileText, Save,
  GraduationCap, Eye, Users, Loader2,
} from "lucide-react";
import { useCourseStructure } from "@/hooks/useCourses";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/brands/ImageUpload";
import type { Course } from "@/hooks/useCourses";

export default function CourseBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { modules, createModule, createLesson, deleteModule, deleteLesson, refetch } = useCourseStructure(id);

  const [course, setCourse] = useState<Course | null>(null);
  const [form, setForm] = useState({ title: "", description: "", cover_url: "", published: false });
  const [saving, setSaving] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [addingLessonTo, setAddingLessonTo] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState({ title: "", lesson_type: "video" as const, video_url: "", content: "" });
  const [communityEnabled, setCommunityEnabled] = useState(false);
  const [communityId, setCommunityId] = useState<string | null>(null);
  const [togglingCommunity, setTogglingCommunity] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from("courses").select("*").eq("id", id).single()
      .then(({ data }) => {
        if (data) {
          const c = data as any as Course;
          setCourse(c);
          setForm({ title: c.title, description: c.description || "", cover_url: c.cover_url || "", published: c.published });
        }
      });
    // Check if course has a linked community
    supabase.from("communities").select("id").eq("course_id", id).maybeSingle()
      .then(({ data }) => {
        if (data) {
          setCommunityEnabled(true);
          setCommunityId(data.id);
        }
      });
  }, [id]);

  const saveCourse = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await supabase.from("courses").update({
        title: form.title,
        description: form.description || null,
        cover_url: form.cover_url || null,
        published: form.published,
      } as any).eq("id", id);
      toast({ title: "Curso salvo!" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erro", description: err.message });
    } finally {
      setSaving(false);
    }
  };

  const toggleCommunity = async () => {
    if (!id || !course) return;
    setTogglingCommunity(true);
    try {
      if (communityEnabled && communityId) {
        // Delete linked community
        await supabase.from("communities").delete().eq("id", communityId);
        setCommunityEnabled(false);
        setCommunityId(null);
        toast({ title: "Comunidade desativada" });
      } else {
        // Create linked community
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error("Não autenticado");
        const { data, error } = await supabase.from("communities").insert({
          name: `Comunidade: ${form.title || course.title}`,
          description: `Comunidade exclusiva dos alunos de ${form.title || course.title}`,
          creator_id: userData.user.id,
          course_id: id,
          is_private: true,
        } as any).select().single();
        if (error) throw error;
        // Auto-join creator
        await supabase.from("community_members").insert({
          community_id: data.id,
          user_id: userData.user.id,
        });
        setCommunityEnabled(true);
        setCommunityId(data.id);
        toast({ title: "Comunidade ativada! 🎉", description: "Alunos terão acesso automaticamente." });
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erro", description: err.message });
    } finally {
      setTogglingCommunity(false);
    }
  };

  const handleAddModule = async () => {
    if (!newModuleTitle.trim() || !id) return;
    try {
      await createModule({ title: newModuleTitle, course_id: id, position: modules.length });
      setNewModuleTitle("");
      toast({ title: "Módulo criado!" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erro", description: err.message });
    }
  };

  const handleAddLesson = async (moduleId: string) => {
    if (!lessonForm.title.trim()) return;
    try {
      const mod = modules.find((m) => m.id === moduleId);
      await createLesson({
        module_id: moduleId,
        title: lessonForm.title,
        lesson_type: lessonForm.lesson_type as any,
        video_url: lessonForm.video_url || null,
        content: lessonForm.content || null,
        position: mod?.lessons.length || 0,
      });
      setLessonForm({ title: "", lesson_type: "video", video_url: "", content: "" });
      setAddingLessonTo(null);
      toast({ title: "Aula adicionada!" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erro", description: err.message });
    }
  };

  if (!course) return <div className="p-8 text-center text-muted-foreground">Carregando...</div>;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-border/30">
        <Button variant="ghost" size="icon" onClick={() => navigate("/brands")}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-bold">Editor de Curso</h1>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(`/courses/${id}`)}>
          <Eye className="h-4 w-4 mr-1" /> Preview
        </Button>
        <Button size="sm" className="bg-gradient-primary border-0 text-primary-foreground" onClick={saveCourse} disabled={saving}>
          <Save className="h-4 w-4 mr-1" /> {saving ? "Salvando..." : "Salvar"}
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {/* Course info */}
        <Card className="border-border/30">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" /> Informações do Curso
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            <ImageUpload
              value={form.cover_url || null}
              onChange={(url) => setForm((p) => ({ ...p, cover_url: url || "" }))}
              folder="courses"
              aspectRatio="aspect-video"
              placeholder="Capa do curso"
            />
            <div className="space-y-2">
              <Label className="text-xs">Título</Label>
              <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Descrição</Label>
              <Textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30">
              <Label className="text-xs">Publicado</Label>
              <Switch checked={form.published} onCheckedChange={(v) => setForm((p) => ({ ...p, published: v }))} />
            </div>
            {/* Community toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <div>
                  <Label className="text-xs font-medium">Comunidade de Alunos</Label>
                  <p className="text-[10px] text-muted-foreground">Crie uma comunidade exclusiva para matriculados</p>
                </div>
              </div>
              {togglingCommunity ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <Switch checked={communityEnabled} onCheckedChange={toggleCommunity} />
              )}
            </div>
            {communityEnabled && communityId && (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => navigate(`/communities/${communityId}`)}
              >
                <Users className="h-3.5 w-3.5 mr-1" /> Ver Comunidade
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Modules */}
        <div className="space-y-3">
          <h2 className="font-semibold text-sm">Módulos & Aulas</h2>

          {modules.map((mod, mi) => (
            <Card key={mod.id} className="border-border/30">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-bold text-primary">M{mi + 1}</span>
                  <span className="font-medium text-sm flex-1">{mod.title}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteModule(mod.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>

                {/* Lessons */}
                <div className="space-y-1.5 ml-6">
                  {mod.lessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/20 text-xs">
                      {lesson.lesson_type === "video" ? (
                        <PlayCircle className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <FileText className="h-3.5 w-3.5 text-accent" />
                      )}
                      <span className="flex-1">{lesson.title}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteLesson(lesson.id)}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  ))}

                  {addingLessonTo === mod.id ? (
                    <div className="p-3 rounded-xl bg-muted/30 border border-border/30 space-y-2">
                      <Input
                        placeholder="Título da aula"
                        value={lessonForm.title}
                        onChange={(e) => setLessonForm((p) => ({ ...p, title: e.target.value }))}
                        className="h-8 text-xs"
                      />
                      <Input
                        placeholder="URL do vídeo (opcional)"
                        value={lessonForm.video_url}
                        onChange={(e) => setLessonForm((p) => ({ ...p, video_url: e.target.value }))}
                        className="h-8 text-xs"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" className="h-7 text-xs flex-1 bg-gradient-primary border-0 text-primary-foreground" onClick={() => handleAddLesson(mod.id)}>
                          Adicionar
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setAddingLessonTo(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-primary w-full justify-start"
                      onClick={() => setAddingLessonTo(mod.id)}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Adicionar aula
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add module */}
          <div className="flex gap-2">
            <Input
              placeholder="Nome do módulo"
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleAddModule()}
            />
            <Button onClick={handleAddModule} className="bg-gradient-primary border-0 text-primary-foreground">
              <Plus className="h-4 w-4 mr-1" /> Módulo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
