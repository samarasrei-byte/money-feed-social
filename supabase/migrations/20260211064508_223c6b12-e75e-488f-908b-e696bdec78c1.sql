
-- Add community_id to posts for community feeds
ALTER TABLE public.posts 
ADD COLUMN community_id uuid REFERENCES public.communities(id) ON DELETE SET NULL;

-- Index for fast community feed queries
CREATE INDEX idx_posts_community_id ON public.posts(community_id) WHERE community_id IS NOT NULL;

-- Add theme/category to communities
ALTER TABLE public.communities 
ADD COLUMN theme text DEFAULT NULL;

-- Add pinned post support
ALTER TABLE public.communities
ADD COLUMN pinned_post_id uuid REFERENCES public.posts(id) ON DELETE SET NULL;

-- Add rules field
ALTER TABLE public.communities
ADD COLUMN rules text DEFAULT NULL;

-- Update members_count trigger for accuracy
CREATE OR REPLACE FUNCTION public.update_community_members_count()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.communities SET members_count = members_count + 1 WHERE id = NEW.community_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.communities SET members_count = members_count - 1 WHERE id = OLD.community_id;
  END IF;
  RETURN NULL;
END;
$function$;

CREATE TRIGGER update_community_members_count_trigger
AFTER INSERT OR DELETE ON public.community_members
FOR EACH ROW
EXECUTE FUNCTION public.update_community_members_count();
