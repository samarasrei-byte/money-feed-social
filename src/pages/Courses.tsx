import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Users, GraduationCap, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import type { Course } from "@/hooks/useCourses";

export default function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<(Course & { brand_name?: string })[]>([]);
  const [enrollments, setEnrollments] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("courses")
        .select("*, brands(name)")
        .eq("published", true)
        .order("students_count", { ascending: false });

      const mapped = (data || []).map((c: any) => ({
        ...c,
        brand_name: c.brands?.name,
      }));
      setCourses(mapped);

      if (user) {
        const { data: enr } = await supabase
          .from("course_enrollments")
          .select("course_id, progress_percent")
          .eq("user_id", user.id);
        const map: Record<string, number> = {};
        (enr || []).forEach((e: any) => { map[e.course_id] = e.progress_percent; });
        setEnrollments(map);
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    (c.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-24 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Cursos</h1>
            <p className="text-xs text-muted-foreground">Aprenda com os melhores criadores</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/50 border-border/30"
          />
        </div>
      </div>

      {/* Course Grid */}
      <div className="px-4 grid grid-cols-1 md:grid-cols-2 gap-3 space-y-0">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-muted/30 animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/30" />
            <p className="text-muted-foreground">Nenhum curso disponível</p>
          </div>
        ) : (
          filtered.map((course) => {
            const enrolled = enrollments[course.id] !== undefined;
            const progressVal = enrollments[course.id] || 0;

            return (
              <Link key={course.id} to={enrolled ? `/courses/${course.id}/learn` : `/courses/${course.id}`}>
                <Card className="overflow-hidden border-border/30 hover:border-primary/30 transition-all group">
                  <div className="flex">
                    {/* Cover */}
                    <div className="w-28 h-28 flex-shrink-0 bg-gradient-primary/10 relative overflow-hidden">
                      {course.cover_url ? (
                        <img src={course.cover_url} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <GraduationCap className="h-8 w-8 text-primary/40" />
                        </div>
                      )}
                      {enrolled && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{progressVal}%</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <CardContent className="flex-1 p-3 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                        {course.brand_name && (
                          <p className="text-xs text-muted-foreground mt-0.5">{course.brand_name}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{course.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{course.students_count}</span>
                        </div>
                        <Badge variant="secondary" className="text-[10px] px-2 py-0">
                          {course.access_type === "lifetime" ? "Vitalício" : course.access_type === "subscription" ? "Assinatura" : "Parcelado"}
                        </Badge>
                      </div>
                      {enrolled && (
                        <Progress value={progressVal} className="h-1 mt-2" />
                      )}
                    </CardContent>
                  </div>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
