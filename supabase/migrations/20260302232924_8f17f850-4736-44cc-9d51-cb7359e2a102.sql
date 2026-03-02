
-- ============================================
-- ONLY SHOP COURSES - Database Schema
-- ============================================

-- Access type enum
CREATE TYPE public.course_access_type AS ENUM ('lifetime', 'subscription', 'installment');

-- Drip type enum
CREATE TYPE public.course_drip_type AS ENUM ('none', 'date', 'days_after_enrollment', 'progress', 'manual');

-- Lesson type enum
CREATE TYPE public.course_lesson_type AS ENUM ('video', 'text', 'pdf', 'quiz');

-- ============================================
-- COURSES TABLE
-- ============================================
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  access_type course_access_type NOT NULL DEFAULT 'lifetime',
  drip_type course_drip_type NOT NULL DEFAULT 'none',
  published BOOLEAN NOT NULL DEFAULT false,
  students_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Courses viewable by everyone" ON public.courses
  FOR SELECT USING (true);

CREATE POLICY "Brand owners can insert courses" ON public.courses
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.brands WHERE id = courses.brand_id AND user_id = auth.uid())
  );

CREATE POLICY "Brand owners can update courses" ON public.courses
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.brands WHERE id = courses.brand_id AND user_id = auth.uid())
  );

CREATE POLICY "Brand owners can delete courses" ON public.courses
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.brands WHERE id = courses.brand_id AND user_id = auth.uid())
  );

-- ============================================
-- COURSE MODULES TABLE
-- ============================================
CREATE TABLE public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  drip_date TIMESTAMPTZ,
  drip_days INTEGER,
  drip_progress_min INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Modules viewable by everyone" ON public.course_modules
  FOR SELECT USING (true);

CREATE POLICY "Brand owners can insert modules" ON public.course_modules
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.courses c
      JOIN public.brands b ON b.id = c.brand_id
      WHERE c.id = course_modules.course_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Brand owners can update modules" ON public.course_modules
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      JOIN public.brands b ON b.id = c.brand_id
      WHERE c.id = course_modules.course_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Brand owners can delete modules" ON public.course_modules
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      JOIN public.brands b ON b.id = c.brand_id
      WHERE c.id = course_modules.course_id AND b.user_id = auth.uid()
    )
  );

-- ============================================
-- COURSE LESSONS TABLE
-- ============================================
CREATE TABLE public.course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  lesson_type course_lesson_type NOT NULL DEFAULT 'video',
  video_url TEXT,
  content TEXT,
  attachment_url TEXT,
  duration_seconds INTEGER DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  is_free_preview BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lessons viewable by everyone" ON public.course_lessons
  FOR SELECT USING (true);

CREATE POLICY "Brand owners can insert lessons" ON public.course_lessons
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.course_modules m
      JOIN public.courses c ON c.id = m.course_id
      JOIN public.brands b ON b.id = c.brand_id
      WHERE m.id = course_lessons.module_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Brand owners can update lessons" ON public.course_lessons
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.course_modules m
      JOIN public.courses c ON c.id = m.course_id
      JOIN public.brands b ON b.id = c.brand_id
      WHERE m.id = course_lessons.module_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Brand owners can delete lessons" ON public.course_lessons
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.course_modules m
      JOIN public.courses c ON c.id = m.course_id
      JOIN public.brands b ON b.id = c.brand_id
      WHERE m.id = course_lessons.module_id AND b.user_id = auth.uid()
    )
  );

-- ============================================
-- COURSE ENROLLMENTS TABLE
-- ============================================
CREATE TABLE public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  progress_percent INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  certificate_code TEXT UNIQUE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_accessed_at TIMESTAMPTZ DEFAULT now(),
  streak_days INTEGER NOT NULL DEFAULT 0,
  streak_last_date DATE,
  UNIQUE(course_id, user_id)
);

ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own enrollments" ON public.course_enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Brand owners can view enrollments" ON public.course_enrollments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      JOIN public.brands b ON b.id = c.brand_id
      WHERE c.id = course_enrollments.course_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can enroll" ON public.course_enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollment" ON public.course_enrollments
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- COURSE LESSON PROGRESS TABLE
-- ============================================
CREATE TABLE public.course_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES public.course_enrollments(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  watch_seconds INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(enrollment_id, lesson_id)
);

ALTER TABLE public.course_lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress" ON public.course_lesson_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.course_enrollments e
      WHERE e.id = course_lesson_progress.enrollment_id AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own progress" ON public.course_lesson_progress
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.course_enrollments e
      WHERE e.id = course_lesson_progress.enrollment_id AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own progress" ON public.course_lesson_progress
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.course_enrollments e
      WHERE e.id = course_lesson_progress.enrollment_id AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "Brand owners can view lesson progress" ON public.course_lesson_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.course_enrollments e
      JOIN public.courses c ON c.id = e.course_id
      JOIN public.brands b ON b.id = c.brand_id
      WHERE e.id = course_lesson_progress.enrollment_id AND b.user_id = auth.uid()
    )
  );

-- ============================================
-- TRIGGERS
-- ============================================
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_lesson_progress_updated_at
  BEFORE UPDATE ON public.course_lesson_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Function to update enrollment progress
CREATE OR REPLACE FUNCTION public.update_enrollment_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
  new_progress INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_lessons
  FROM public.course_lesson_progress
  WHERE enrollment_id = NEW.enrollment_id;

  SELECT COUNT(*) INTO completed_lessons
  FROM public.course_lesson_progress
  WHERE enrollment_id = NEW.enrollment_id AND completed = true;

  IF total_lessons > 0 THEN
    new_progress := (completed_lessons * 100) / total_lessons;
  ELSE
    new_progress := 0;
  END IF;

  UPDATE public.course_enrollments
  SET progress_percent = new_progress,
      completed_at = CASE WHEN new_progress = 100 THEN now() ELSE NULL END,
      certificate_code = CASE 
        WHEN new_progress = 100 AND certificate_code IS NULL 
        THEN encode(gen_random_bytes(16), 'hex')
        ELSE certificate_code 
      END
  WHERE id = NEW.enrollment_id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER update_progress_on_completion
  AFTER INSERT OR UPDATE ON public.course_lesson_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_enrollment_progress();

-- Function to update students count
CREATE OR REPLACE FUNCTION public.update_course_students_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.courses SET students_count = students_count + 1 WHERE id = NEW.course_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.courses SET students_count = students_count - 1 WHERE id = OLD.course_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER update_students_count
  AFTER INSERT OR DELETE ON public.course_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.update_course_students_count();

-- Storage bucket for course content
INSERT INTO storage.buckets (id, name, public) VALUES ('course-content', 'course-content', true);

CREATE POLICY "Authenticated users can upload course content"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'course-content' AND auth.uid() IS NOT NULL);

CREATE POLICY "Course content is publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'course-content');

CREATE POLICY "Users can delete own course content"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'course-content' AND auth.uid()::text = (storage.foldername(name))[1]);
