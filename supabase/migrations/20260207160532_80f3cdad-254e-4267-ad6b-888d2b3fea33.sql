-- Fix 1: Restrict profiles SELECT to authenticated users only
-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create a new policy that only allows authenticated users to view profiles
CREATE POLICY "Profiles are viewable by authenticated users"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Fix 2: Add INSERT policy for link_clicks table
-- Using public insert with validation (clicks are typically recorded from public traffic)
CREATE POLICY "Anyone can record clicks on valid affiliate links"
ON public.link_clicks
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.affiliate_links
    WHERE id = affiliate_link_id
  )
);