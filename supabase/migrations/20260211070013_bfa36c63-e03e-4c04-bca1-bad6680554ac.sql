
-- ============================================
-- BRANDS TABLE
-- ============================================
CREATE TABLE public.brands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brands are viewable by everyone" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Brand owners can insert" ON public.brands FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Brand owners can update" ON public.brands FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Brand owners can delete" ON public.brands FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON public.brands
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  video_url TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'BRL',
  commission_type TEXT NOT NULL DEFAULT 'percentage',
  commission_value NUMERIC NOT NULL DEFAULT 0,
  category TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  promo_materials JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Brand owners can insert products" ON public.products FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.brands WHERE id = brand_id AND user_id = auth.uid()));
CREATE POLICY "Brand owners can update products" ON public.products FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.brands WHERE id = brand_id AND user_id = auth.uid()));
CREATE POLICY "Brand owners can delete products" ON public.products FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.brands WHERE id = brand_id AND user_id = auth.uid()));

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- CAMPAIGNS TABLE
-- ============================================
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ends_at TIMESTAMP WITH TIME ZONE,
  bonus_percentage NUMERIC DEFAULT 0,
  max_affiliates INTEGER,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Campaigns are viewable by everyone" ON public.campaigns FOR SELECT USING (true);
CREATE POLICY "Brand owners can insert campaigns" ON public.campaigns FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.brands WHERE id = brand_id AND user_id = auth.uid()));
CREATE POLICY "Brand owners can update campaigns" ON public.campaigns FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.brands WHERE id = brand_id AND user_id = auth.uid()));
CREATE POLICY "Brand owners can delete campaigns" ON public.campaigns FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.brands WHERE id = brand_id AND user_id = auth.uid()));

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- CAMPAIGN AFFILIATES (join table)
-- ============================================
CREATE TABLE public.campaign_affiliates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(campaign_id, user_id)
);

ALTER TABLE public.campaign_affiliates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Campaign affiliates viewable by brand owner and self" ON public.campaign_affiliates FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.campaigns c JOIN public.brands b ON b.id = c.brand_id WHERE c.id = campaign_id AND b.user_id = auth.uid())
  );
CREATE POLICY "Affiliates can apply" ON public.campaign_affiliates FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Brand owners can update affiliate status" ON public.campaign_affiliates FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.campaigns c JOIN public.brands b ON b.id = c.brand_id WHERE c.id = campaign_id AND b.user_id = auth.uid()));
CREATE POLICY "Affiliates can withdraw" ON public.campaign_affiliates FOR DELETE
  USING (auth.uid() = user_id);
