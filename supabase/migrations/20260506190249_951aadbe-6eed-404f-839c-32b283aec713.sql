-- Create VSL settings table
CREATE TABLE public.vsl_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    headline TEXT NOT NULL,
    subheadline TEXT,
    video_url TEXT NOT NULL,
    cta_text TEXT DEFAULT 'Quero Começar Agora',
    cta_delay_seconds INTEGER DEFAULT 0,
    autoplay BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for vsl_settings
ALTER TABLE public.vsl_settings ENABLE ROW LEVEL SECURITY;

-- Policies for vsl_settings
CREATE POLICY "Public can view active VSL settings" 
ON public.vsl_settings FOR SELECT 
USING (is_active = true);

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role::text = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Admins can manage VSL settings" 
ON public.vsl_settings FOR ALL 
USING (public.is_admin());

-- Create VSL analytics table
CREATE TABLE public.vsl_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vsl_id UUID REFERENCES public.vsl_settings(id),
    event_type TEXT NOT NULL, -- 'view', 'cta_click', 'scroll_depth', 'video_progress'
    session_id UUID NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for vsl_analytics
ALTER TABLE public.vsl_analytics ENABLE ROW LEVEL SECURITY;

-- Policies for vsl_analytics
CREATE POLICY "Public can insert analytics" 
ON public.vsl_analytics FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view analytics" 
ON public.vsl_analytics FOR SELECT 
USING (public.is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_vsl_settings_updated_at
BEFORE UPDATE ON public.vsl_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Insert initial default VSL settings
INSERT INTO public.vsl_settings (headline, subheadline, video_url, cta_text, cta_delay_seconds)
VALUES (
    'Como Escalar seu Negócio com o Only Shop',
    'A plataforma definitiva para quem busca liberdade financeira e resultados reais.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'Garantir Minha Vaga',
    10
);