-- Adjust profiles RLS: Allow public reading of non-sensitive profile fields
-- This is necessary for a social platform where posts are public

-- Drop the current restrictive policy
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;

-- Create policy that allows anyone to view profiles
-- Note: The profiles table only contains public information (username, display_name, avatar_url, bio, website)
-- No sensitive data like email, phone, or passwords is stored here
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles
FOR SELECT
USING (true);