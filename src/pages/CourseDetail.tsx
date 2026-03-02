import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users, Clock, PlayCircle, FileText, ChevronRight, Lock, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useStudentCourse, useCourseStructure } from "@/hooks/useCourses";
import { useToast } from "@/hooks/use-toast";
import type { Course } from "@/hooks/useCourses";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<(Course & { brand_name?: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [communityId, setCommunityId] = useState<string | null>(null);
  const { modules } = useCourseStructure(id);
  const { enrollment, enroll } = useStudentCourse(id);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("courses")
      .select("*, brands(name)")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) setCourse({ ...(data as any), brand_name: (data as any).brands?.name });
        setLoading(false);
      });
    // Check for linked community
    supabase.from("communities").select("id").eq("course_id", id).maybeSingle()
      .then(({ data }) => {
        if (data) setCommunityId(data.id);
      });
  }, [id]);

  const handleEnroll = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    try {
      await enroll();
      toast({ title: "Matrícula realizada!", description: "Você já pode começar a estudar." });
      navigate(`/courses/${id}/learn`);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erro", description: err.message });
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando...</div>;
  if (!course) return <div className="p-8 text-center text-muted-foreground">Curso não encontrado</div>;

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalDuration = modules.reduce((sum, m) => sum + m.lessons.reduce((s, l) => s + (l.duration_seconds || 0), 0), 0);

  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <div className="relative h-48 bg-gradient-primary overflow-hidden">
        {course.cover_url && (
          <img src={course.cover_url} alt={course.title} className="w-full h-full object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <Badge className="bg-white/20 backdrop-blur-md text-white border-0 text-[10px] mb-2">
            {course.access_type === "lifetime" ? "Acesso Vitalício" : course.access_type === "subscription" ? "Assinatura" : "Parcelado"}
          </Badge>
          <h1 className="text-xl font-bold text-white drop-shadow-lg">{course.title}</h1>
          {course.brand_name && <p className="text-white/80 text-sm">{course.brand_name}</p>}
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-4 relative z-10">
        <Card className="border-border/30">
          <CardContent className="p-3 flex justify-around">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-primary">
                <PlayCircle className="h-4 w-4" />
                <span className="font-bold text-sm">{totalLessons}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Aulas</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-primary">
                <Clock className="h-4 w-4" />
                <span className="font-bold text-sm">{Math.round(totalDuration / 60)}min</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Duração</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-primary">
                <Users className="h-4 w-4" />
                <span className="font-bold text-sm">{course.students_count}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Alunos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {course.description && (
        <div className="px-4 mt-4">
          <p className="text-sm text-muted-foreground">{course.description}</p>
        </div>
      )}

      {/* Community Link */}
      {communityId && enrollment && (
        <div className="px-4 mt-4">
          <Button
            variant="outline"
            className="w-full rounded-xl h-12 gap-2 border-border/30"
            onClick={() => navigate(`/communities/${communityId}`)}
          >
            <MessageCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Acessar Comunidade do Curso</span>
            <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
          </Button>
        </div>
      )}
      {communityId && !enrollment && (
        <div className="px-4 mt-4">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/20 border border-border/30 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            Matricule-se para acessar a comunidade exclusiva
          </div>
        </div>
      )}

      {/* Curriculum */}
      <div className="px-4 mt-6">
        <h2 className="font-semibold text-base mb-3">Conteúdo do curso</h2>
        <div className="space-y-3">
          {modules.map((mod, mi) => (
            <Card key={mod.id} className="border-border/30">
              <CardContent className="p-3">
                <h3 className="font-medium text-sm">
                  Módulo {mi + 1}: {mod.title}
                </h3>
                <div className="mt-2 space-y-1.5">
                  {mod.lessons.map((lesson, li) => (
                    <div key={lesson.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                      {lesson.is_free_preview ? (
                        <PlayCircle className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <Lock className="h-3.5 w-3.5" />
                      )}
                      <span className="flex-1">{lesson.title}</span>
                      {lesson.duration_seconds > 0 && (
                        <span>{Math.round(lesson.duration_seconds / 60)}min</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        {enrollment ? (
          <Button
            className="w-full bg-gradient-primary border-0 text-primary-foreground h-12 text-base font-semibold"
            onClick={() => navigate(`/courses/${id}/learn`)}
          >
            Continuar Estudando <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
        ) : (
          <Button
            className="w-full bg-gradient-primary border-0 text-primary-foreground h-12 text-base font-semibold"
            onClick={handleEnroll}
          >
            <GraduationCap className="h-5 w-5 mr-2" /> Matricular-se Grátis
          </Button>
        )}
      </div>
    </div>
  );
}
