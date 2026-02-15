
-- Table to store TikTok OAuth connections per user
CREATE TABLE public.tiktok_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tiktok_user_id text,
  tiktok_username text,
  display_name text,
  avatar_url text,
  access_token text,
  refresh_token text,
  token_expires_at timestamp with time zone,
  scopes text[] DEFAULT '{}',
  followers_count integer DEFAULT 0,
  following_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  video_count integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  last_synced_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(tiktok_user_id)
);

-- Enable RLS
ALTER TABLE public.tiktok_connections ENABLE ROW LEVEL SECURITY;

-- Users can only see their own connection
CREATE POLICY "Users can view own tiktok connection"
ON public.tiktok_connections FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own connection
CREATE POLICY "Users can insert own tiktok connection"
ON public.tiktok_connections FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own connection
CREATE POLICY "Users can update own tiktok connection"
ON public.tiktok_connections FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own connection
CREATE POLICY "Users can delete own tiktok connection"
ON public.tiktok_connections FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_tiktok_connections_updated_at
BEFORE UPDATE ON public.tiktok_connections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Table to log TikTok video posts from the platform
CREATE TABLE public.tiktok_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tiktok_video_id text,
  caption text,
  status text NOT NULL DEFAULT 'pending',
  views_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  affiliate_link_id uuid REFERENCES public.affiliate_links(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.tiktok_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tiktok posts"
ON public.tiktok_posts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tiktok posts"
ON public.tiktok_posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tiktok posts"
ON public.tiktok_posts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tiktok posts"
ON public.tiktok_posts FOR DELETE
USING (auth.uid() = user_id);

CREATE TRIGGER update_tiktok_posts_updated_at
BEFORE UPDATE ON public.tiktok_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();
