-- Ensure profiles.user_id is unique
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);

-- Add foreign keys to profiles
ALTER TABLE public.notifications 
ADD CONSTRAINT notifications_user_id_profiles_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.notifications 
ADD CONSTRAINT notifications_actor_id_profiles_fkey 
FOREIGN KEY (actor_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.posts 
ADD CONSTRAINT posts_user_id_profiles_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.likes 
ADD CONSTRAINT likes_user_id_profiles_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.comments 
ADD CONSTRAINT comments_user_id_profiles_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
