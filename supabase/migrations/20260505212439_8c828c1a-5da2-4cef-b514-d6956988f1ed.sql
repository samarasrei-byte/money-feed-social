-- Geo + matching fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS latitude numeric,
  ADD COLUMN IF NOT EXISTS longitude numeric,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS niches text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS categories text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS followers_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_sales integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_revenue numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS conversion_rate numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS performance_score numeric NOT NULL DEFAULT 0;

ALTER TABLE public.brands
  ADD COLUMN IF NOT EXISTS latitude numeric,
  ADD COLUMN IF NOT EXISTS longitude numeric,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS niches text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS target_categories text[] DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_niches ON public.profiles USING GIN(niches);
CREATE INDEX IF NOT EXISTS idx_brands_city ON public.brands(city);
CREATE INDEX IF NOT EXISTS idx_brands_niches ON public.brands USING GIN(niches);

-- Haversine distance (km)
CREATE OR REPLACE FUNCTION public.haversine_km(lat1 numeric, lon1 numeric, lat2 numeric, lon2 numeric)
RETURNS numeric
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  r numeric := 6371;
  dlat numeric;
  dlon numeric;
  a numeric;
BEGIN
  IF lat1 IS NULL OR lon1 IS NULL OR lat2 IS NULL OR lon2 IS NULL THEN
    RETURN NULL;
  END IF;
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  a := sin(dlat/2)^2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)^2;
  RETURN r * 2 * atan2(sqrt(a), sqrt(1-a));
END;
$$;

-- Match affiliates for a given brand
CREATE OR REPLACE FUNCTION public.match_affiliates_for_brand(_brand_id uuid, _limit integer DEFAULT 50)
RETURNS TABLE (
  user_id uuid,
  username text,
  display_name text,
  avatar_url text,
  city text,
  state text,
  niches text[],
  categories text[],
  followers_count integer,
  total_sales integer,
  total_revenue numeric,
  conversion_rate numeric,
  performance_score numeric,
  distance_km numeric,
  niche_overlap integer,
  match_score numeric
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  b_lat numeric;
  b_lon numeric;
  b_niches text[];
  b_cats text[];
BEGIN
  SELECT latitude, longitude, COALESCE(niches,'{}'), COALESCE(target_categories,'{}')
    INTO b_lat, b_lon, b_niches, b_cats
  FROM public.brands WHERE id = _brand_id;

  RETURN QUERY
  SELECT
    p.user_id,
    p.username,
    p.display_name,
    p.avatar_url,
    p.city,
    p.state,
    p.niches,
    p.categories,
    p.followers_count,
    p.total_sales,
    p.total_revenue,
    p.conversion_rate,
    p.performance_score,
    public.haversine_km(b_lat, b_lon, p.latitude, p.longitude) AS distance_km,
    cardinality(ARRAY(SELECT unnest(COALESCE(p.niches,'{}')) INTERSECT SELECT unnest(b_niches))) AS niche_overlap,
    (
      -- nicho (0-40)
      LEAST(40, cardinality(ARRAY(SELECT unnest(COALESCE(p.niches,'{}')) INTERSECT SELECT unnest(b_niches))) * 15)
      -- categoria (0-20)
      + LEAST(20, cardinality(ARRAY(SELECT unnest(COALESCE(p.categories,'{}')) INTERSECT SELECT unnest(b_cats))) * 10)
      -- proximidade (0-25): <50km=25, <200km=15, <1000=8, demais=2
      + CASE
          WHEN public.haversine_km(b_lat, b_lon, p.latitude, p.longitude) IS NULL THEN 5
          WHEN public.haversine_km(b_lat, b_lon, p.latitude, p.longitude) < 50 THEN 25
          WHEN public.haversine_km(b_lat, b_lon, p.latitude, p.longitude) < 200 THEN 15
          WHEN public.haversine_km(b_lat, b_lon, p.latitude, p.longitude) < 1000 THEN 8
          ELSE 2
        END
      -- performance (0-15)
      + LEAST(15, p.performance_score / 10.0)
    )::numeric AS match_score
  FROM public.profiles p
  JOIN public.user_roles ur ON ur.user_id = p.user_id
  WHERE ur.role IN ('affiliate','agency')
  ORDER BY match_score DESC NULLS LAST
  LIMIT _limit;
END;
$$;

-- Match brands/products for a given affiliate
CREATE OR REPLACE FUNCTION public.match_brands_for_affiliate(_user_id uuid, _limit integer DEFAULT 50)
RETURNS TABLE (
  brand_id uuid,
  name text,
  slug text,
  logo_url text,
  city text,
  state text,
  niches text[],
  verified boolean,
  distance_km numeric,
  niche_overlap integer,
  match_score numeric
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  a_lat numeric;
  a_lon numeric;
  a_niches text[];
  a_cats text[];
BEGIN
  SELECT latitude, longitude, COALESCE(niches,'{}'), COALESCE(categories,'{}')
    INTO a_lat, a_lon, a_niches, a_cats
  FROM public.profiles WHERE user_id = _user_id;

  RETURN QUERY
  SELECT
    b.id,
    b.name,
    b.slug,
    b.logo_url,
    b.city,
    b.state,
    b.niches,
    b.verified,
    public.haversine_km(a_lat, a_lon, b.latitude, b.longitude) AS distance_km,
    cardinality(ARRAY(SELECT unnest(COALESCE(b.niches,'{}')) INTERSECT SELECT unnest(a_niches))) AS niche_overlap,
    (
      LEAST(40, cardinality(ARRAY(SELECT unnest(COALESCE(b.niches,'{}')) INTERSECT SELECT unnest(a_niches))) * 15)
      + LEAST(20, cardinality(ARRAY(SELECT unnest(COALESCE(b.target_categories,'{}')) INTERSECT SELECT unnest(a_cats))) * 10)
      + CASE
          WHEN public.haversine_km(a_lat, a_lon, b.latitude, b.longitude) IS NULL THEN 5
          WHEN public.haversine_km(a_lat, a_lon, b.latitude, b.longitude) < 50 THEN 25
          WHEN public.haversine_km(a_lat, a_lon, b.latitude, b.longitude) < 200 THEN 15
          WHEN public.haversine_km(a_lat, a_lon, b.latitude, b.longitude) < 1000 THEN 8
          ELSE 2
        END
      + CASE WHEN b.verified THEN 15 ELSE 5 END
    )::numeric AS match_score
  FROM public.brands b
  WHERE b.status = 'active' OR b.status = 'pending'
  ORDER BY match_score DESC NULLS LAST
  LIMIT _limit;
END;
$$;