
-- Trigger to auto-increment clicks_count on affiliate_links when a link_click is inserted
CREATE OR REPLACE FUNCTION public.increment_affiliate_clicks()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.affiliate_links 
  SET clicks_count = clicks_count + 1 
  WHERE id = NEW.affiliate_link_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_link_click_increment
AFTER INSERT ON public.link_clicks
FOR EACH ROW
EXECUTE FUNCTION public.increment_affiliate_clicks();
