-- Affiliate invites
CREATE TABLE IF NOT EXISTS public.affiliate_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL,
  affiliate_user_id uuid NOT NULL,
  campaign_id uuid,
  message text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  responded_at timestamptz,
  UNIQUE (brand_id, affiliate_user_id, campaign_id)
);

ALTER TABLE public.affiliate_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brand owners can create invites"
  ON public.affiliate_invites FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.brands b WHERE b.id = brand_id AND b.user_id = auth.uid()));

CREATE POLICY "Brand owners and invitee can view"
  ON public.affiliate_invites FOR SELECT
  USING (
    auth.uid() = affiliate_user_id
    OR EXISTS (SELECT 1 FROM public.brands b WHERE b.id = brand_id AND b.user_id = auth.uid())
  );

CREATE POLICY "Invitee can update own invite"
  ON public.affiliate_invites FOR UPDATE
  USING (auth.uid() = affiliate_user_id);

CREATE POLICY "Brand owners can delete own invites"
  ON public.affiliate_invites FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.brands b WHERE b.id = brand_id AND b.user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_invites_affiliate ON public.affiliate_invites(affiliate_user_id, status);
CREATE INDEX IF NOT EXISTS idx_invites_brand ON public.affiliate_invites(brand_id, status);

-- Trending products function
CREATE OR REPLACE FUNCTION public.get_trending_products(
  _period_days integer DEFAULT 7,
  _category text DEFAULT NULL,
  _state text DEFAULT NULL,
  _limit integer DEFAULT 30
)
RETURNS TABLE (
  product_id uuid,
  brand_id uuid,
  name text,
  description text,
  image_url text,
  price numeric,
  currency text,
  commission_value numeric,
  commission_type text,
  category text,
  brand_name text,
  brand_logo text,
  brand_state text,
  recent_sales bigint,
  recent_clicks bigint,
  trend_score numeric
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  _since timestamptz := now() - (_period_days || ' days')::interval;
BEGIN
  RETURN QUERY
  WITH sales_agg AS (
    SELECT oi.product_id, COUNT(*)::bigint AS sales
    FROM public.order_items oi
    JOIN public.orders o ON o.id = oi.order_id
    WHERE o.created_at >= _since AND o.status IN ('paid','completed')
    GROUP BY oi.product_id
  ),
  clicks_agg AS (
    SELECT al.id AS link_id, COUNT(lc.id)::bigint AS clicks
    FROM public.affiliate_links al
    LEFT JOIN public.link_clicks lc ON lc.affiliate_link_id = al.id AND lc.clicked_at >= _since
    GROUP BY al.id
  )
  SELECT
    p.id,
    p.brand_id,
    p.name,
    p.description,
    p.image_url,
    p.price,
    p.currency,
    p.commission_value,
    p.commission_type,
    p.category,
    b.name,
    b.logo_url,
    b.state,
    COALESCE(s.sales, 0),
    0::bigint AS recent_clicks,
    (COALESCE(s.sales, 0) * 3.0 + COALESCE(p.commission_value, 0) * 0.1)::numeric AS trend_score
  FROM public.products p
  JOIN public.brands b ON b.id = p.brand_id
  LEFT JOIN sales_agg s ON s.product_id = p.id
  WHERE p.active = true
    AND (_category IS NULL OR p.category = _category)
    AND (_state IS NULL OR b.state = _state)
  ORDER BY trend_score DESC, p.created_at DESC
  LIMIT _limit;
END;
$$;