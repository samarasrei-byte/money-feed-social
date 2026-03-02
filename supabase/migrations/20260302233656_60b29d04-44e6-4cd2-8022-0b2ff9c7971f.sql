
-- Add course_id to communities to link courses to their communities
ALTER TABLE public.communities 
ADD COLUMN course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL;

-- Add unique constraint so each course has at most one community
CREATE UNIQUE INDEX idx_communities_course_id ON public.communities(course_id) WHERE course_id IS NOT NULL;

-- Add is_private flag for enrollment-gated communities
ALTER TABLE public.communities 
ADD COLUMN is_private boolean NOT NULL DEFAULT false;

-- Update RLS: members of private course communities must be enrolled
-- Add SELECT policy for private course communities (enrolled students can view)
CREATE OR REPLACE FUNCTION public.is_enrolled_in_course(_user_id uuid, _course_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.course_enrollments
    WHERE user_id = _user_id AND course_id = _course_id
  )
$$;
