-- Seed Affiliate Links for the demo affiliate
WITH inserted_links AS (
  INSERT INTO public.affiliate_links (id, user_id, name, destination_url, short_code, clicks_count, conversions_count)
  VALUES 
  (gen_random_uuid(), '021805bc-3826-4534-a4eb-b40841b4dfa7', 'Smartwatch Pro - TikTok Ads', 'https://example.com/smartwatch', 'SMARTWATCH', 842, 12),
  (gen_random_uuid(), '021805bc-3826-4534-a4eb-b40841b4dfa7', 'Kit Skincare - Instagram Feed', 'https://example.com/skincare', 'SKINCARE', 1240, 45)
  RETURNING id
),
inserted_sales AS (
  INSERT INTO public.sales (id, affiliate_link_id, product_name, amount, currency)
  SELECT gen_random_uuid(), id, 'Mock Product', 100.00, 'BRL'
  FROM inserted_links
  RETURNING id, id as sale_id -- actually returning sale_id for the next CTE
)
INSERT INTO public.commissions (user_id, sale_id, amount, percentage, status, created_at)
SELECT '021805bc-3826-4534-a4eb-b40841b4dfa7', id, 15.00, 15, 'paid', now() - interval '1 day'
FROM inserted_sales;

-- Seed Link Clicks (for chart)
DO $$
DECLARE
    link_id UUID;
    i INTEGER;
BEGIN
    SELECT id INTO link_id FROM public.affiliate_links WHERE user_id = '021805bc-3826-4534-a4eb-b40841b4dfa7' LIMIT 1;
    IF link_id IS NOT NULL THEN
        FOR i IN 1..14 LOOP
            INSERT INTO public.link_clicks (affiliate_link_id, clicked_at)
            VALUES (link_id, now() - (i || ' days')::interval);
        END LOOP;
    END IF;
END $$;
