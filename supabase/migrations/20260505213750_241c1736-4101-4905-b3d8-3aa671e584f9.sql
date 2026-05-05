-- Trigger para manter followers_count em profiles
CREATE OR REPLACE FUNCTION public.update_followers_count()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles SET followers_count = followers_count + 1 WHERE user_id = NEW.following_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles SET followers_count = GREATEST(0, followers_count - 1) WHERE user_id = OLD.following_id;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_followers_count ON public.follows;
CREATE TRIGGER trg_update_followers_count
AFTER INSERT OR DELETE ON public.follows
FOR EACH ROW EXECUTE FUNCTION public.update_followers_count();

-- Recalcular contadores existentes
UPDATE public.profiles p
SET followers_count = COALESCE((SELECT COUNT(*) FROM public.follows f WHERE f.following_id = p.user_id), 0);

-- Permitir que afiliado/marca insira notificação para o outro lado quando responde convite
-- A policy atual já permite (auth.uid() = actor_id), então ok.