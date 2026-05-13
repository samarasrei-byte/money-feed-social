-- Dynamic script to set search_path for all functions in public schema
DO $$ 
DECLARE 
    func RECORD;
BEGIN
    FOR func IN (
        SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p 
        JOIN pg_namespace n ON p.pronamespace = n.oid 
        WHERE n.nspname = 'public'
    ) LOOP
        EXECUTE 'ALTER FUNCTION ' || quote_ident(func.nspname) || '.' || quote_ident(func.proname) || '(' || func.args || ') SET search_path = public';
    END LOOP;
END $$;

-- Fix RLS for vsl_analytics
DROP POLICY IF EXISTS "Public can insert analytics" ON public.vsl_analytics;
CREATE POLICY "Authenticated users can insert analytics" 
ON public.vsl_analytics 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Ensure profiles and roles are correctly indexed
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON public.likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

-- Improve handle_new_user to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', 'Usuário'));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'viewer');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
