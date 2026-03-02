import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Course {
  id: string;
  brand_id: string;
  product_id: string | null;
  title: string;
  description: string | null;
  cover_url: string | null;
  access_type: "lifetime" | "subscription" | "installment";
  drip_type: "none" | "date" | "days_after_enrollment" | "progress" | "manual";
  published: boolean;
  students_count: number;
  created_at: string;
  updated_at: string;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  position: number;
  drip_date: string | null;
  drip_days: number | null;
  drip_progress_min: number | null;
  created_at: string;
}

export interface CourseLesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  lesson_type: "video" | "text" | "pdf" | "quiz";
  video_url: string | null;
  content: string | null;
  attachment_url: string | null;
  duration_seconds: number;
  position: number;
  is_free_preview: boolean;
  created_at: string;
}

export interface CourseEnrollment {
  id: string;
  course_id: string;
  user_id: string;
  progress_percent: number;
  completed_at: string | null;
  certificate_code: string | null;
  enrolled_at: string;
  last_accessed_at: string | null;
  streak_days: number;
  streak_last_date: string | null;
}

export interface LessonProgress {
  id: string;
  enrollment_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
  watch_seconds: number;
  notes: string | null;
}

// Hook for course creators (brand owners)
export function useCreatorCourses(brandId: string | undefined) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    if (!brandId) { setLoading(false); return; }
    const { data } = await supabase
      .from("courses")
      .select("*")
      .eq("brand_id", brandId)
      .order("created_at", { ascending: false });
    setCourses((data as any as Course[]) || []);
    setLoading(false);
  }, [brandId]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const createCourse = async (input: Partial<Course>) => {
    if (!brandId) return null;
    const { data, error } = await supabase
      .from("courses")
      .insert({ ...input, brand_id: brandId } as any)
      .select()
      .single();
    if (error) throw error;
    setCourses((prev) => [data as any as Course, ...prev]);
    return data;
  };

  const updateCourse = async (id: string, input: Partial<Course>) => {
    const { data, error } = await supabase
      .from("courses")
      .update(input as any)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    setCourses((prev) => prev.map((c) => (c.id === id ? (data as any as Course) : c)));
    return data;
  };

  const deleteCourse = async (id: string) => {
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) throw error;
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  return { courses, loading, createCourse, updateCourse, deleteCourse, refetch: fetchCourses };
}

// Hook for course structure (modules + lessons)
export function useCourseStructure(courseId: string | undefined) {
  const [modules, setModules] = useState<(CourseModule & { lessons: CourseLesson[] })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStructure = useCallback(async () => {
    if (!courseId) { setLoading(false); return; }
    
    const [{ data: mods }, { data: lessons }] = await Promise.all([
      supabase.from("course_modules").select("*").eq("course_id", courseId).order("position"),
      supabase.from("course_lessons").select("*").order("position"),
    ]);

    const modulesList = (mods as any as CourseModule[]) || [];
    const lessonsList = (lessons as any as CourseLesson[]) || [];

    const structured = modulesList.map((m) => ({
      ...m,
      lessons: lessonsList.filter((l) => l.module_id === m.id),
    }));

    setModules(structured);
    setLoading(false);
  }, [courseId]);

  useEffect(() => { fetchStructure(); }, [fetchStructure]);

  const createModule = async (input: { title: string; course_id: string; position: number }) => {
    const { data, error } = await supabase
      .from("course_modules")
      .insert(input as any)
      .select()
      .single();
    if (error) throw error;
    await fetchStructure();
    return data;
  };

  const createLesson = async (input: Partial<CourseLesson> & { module_id: string }) => {
    const { data, error } = await supabase
      .from("course_lessons")
      .insert(input as any)
      .select()
      .single();
    if (error) throw error;
    await fetchStructure();
    return data;
  };

  const updateLesson = async (id: string, input: Partial<CourseLesson>) => {
    const { data, error } = await supabase
      .from("course_lessons")
      .update(input as any)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    await fetchStructure();
    return data;
  };

  const deleteModule = async (id: string) => {
    const { error } = await supabase.from("course_modules").delete().eq("id", id);
    if (error) throw error;
    await fetchStructure();
  };

  const deleteLesson = async (id: string) => {
    const { error } = await supabase.from("course_lessons").delete().eq("id", id);
    if (error) throw error;
    await fetchStructure();
  };

  return { modules, loading, createModule, createLesson, updateLesson, deleteModule, deleteLesson, refetch: fetchStructure };
}

// Hook for student enrollment & progress
export function useStudentCourse(courseId: string | undefined) {
  const { user } = useAuth();
  const [enrollment, setEnrollment] = useState<CourseEnrollment | null>(null);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollment = useCallback(async () => {
    if (!user || !courseId) { setLoading(false); return; }

    const { data: enr } = await supabase
      .from("course_enrollments")
      .select("*")
      .eq("course_id", courseId)
      .eq("user_id", user.id)
      .maybeSingle();

    const enrollment = enr as any as CourseEnrollment | null;
    setEnrollment(enrollment);

    if (enrollment) {
      const { data: prog } = await supabase
        .from("course_lesson_progress")
        .select("*")
        .eq("enrollment_id", enrollment.id);
      setProgress((prog as any as LessonProgress[]) || []);
    }
    setLoading(false);
  }, [user, courseId]);

  useEffect(() => { fetchEnrollment(); }, [fetchEnrollment]);

  const enroll = async () => {
    if (!user || !courseId) return;
    const { data, error } = await supabase
      .from("course_enrollments")
      .insert({ course_id: courseId, user_id: user.id } as any)
      .select()
      .single();
    if (error) throw error;
    setEnrollment(data as any as CourseEnrollment);
  };

  const markLessonComplete = async (lessonId: string) => {
    if (!enrollment) return;
    const existing = progress.find((p) => p.lesson_id === lessonId);
    if (existing) {
      await supabase
        .from("course_lesson_progress")
        .update({ completed: true, completed_at: new Date().toISOString() } as any)
        .eq("id", existing.id);
    } else {
      await supabase
        .from("course_lesson_progress")
        .insert({
          enrollment_id: enrollment.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
        } as any);
    }
    await fetchEnrollment();
  };

  const saveNotes = async (lessonId: string, notes: string) => {
    if (!enrollment) return;
    const existing = progress.find((p) => p.lesson_id === lessonId);
    if (existing) {
      await supabase
        .from("course_lesson_progress")
        .update({ notes } as any)
        .eq("id", existing.id);
    } else {
      await supabase
        .from("course_lesson_progress")
        .insert({ enrollment_id: enrollment.id, lesson_id: lessonId, notes } as any);
    }
    await fetchEnrollment();
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress.some((p) => p.lesson_id === lessonId && p.completed);
  };

  const getLessonNotes = (lessonId: string) => {
    return progress.find((p) => p.lesson_id === lessonId)?.notes || "";
  };

  return {
    enrollment, progress, loading,
    enroll, markLessonComplete, saveNotes,
    isLessonCompleted, getLessonNotes,
    refetch: fetchEnrollment,
  };
}
