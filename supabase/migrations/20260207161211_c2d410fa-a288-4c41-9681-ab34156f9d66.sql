-- Fix 1: Add admin-only policies for user_roles management
CREATE POLICY "Admins can insert user roles"
ON public.user_roles
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update user roles"
ON public.user_roles
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete user roles"
ON public.user_roles
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Fix 2: Restrict affiliate_links SELECT to only own links (remove competitor visibility)
DROP POLICY IF EXISTS "Affiliates can view own links" ON public.affiliate_links;

CREATE POLICY "Users can view own affiliate links"
ON public.affiliate_links
FOR SELECT
USING (auth.uid() = user_id);

-- Fix 3: Add admin access to subscriptions for customer support
CREATE POLICY "Admins can view all subscriptions"
ON public.subscriptions
FOR SELECT
USING (has_role(auth.uid(), 'admin'));