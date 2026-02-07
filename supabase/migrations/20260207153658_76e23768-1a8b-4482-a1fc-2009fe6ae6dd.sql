-- Create feature_flags table for managing platform features
CREATE TABLE public.feature_flags (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  enabled boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Only admins can read feature flags (for management)
CREATE POLICY "Feature flags are viewable by admins"
ON public.feature_flags
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update feature flags
CREATE POLICY "Admins can update feature flags"
ON public.feature_flags
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert feature flags
CREATE POLICY "Admins can insert feature flags"
ON public.feature_flags
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete feature flags
CREATE POLICY "Admins can delete feature flags"
ON public.feature_flags
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_feature_flags_updated_at
BEFORE UPDATE ON public.feature_flags
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Insert default feature flags
INSERT INTO public.feature_flags (key, name, description, enabled) VALUES
  ('video_posts', 'Posts em Vídeo', 'Permite usuários fazerem upload de vídeos no feed', true),
  ('affiliate_links', 'Links de Afiliado', 'Habilita o sistema de links de afiliado', true),
  ('communities', 'Comunidades', 'Habilita o sistema de comunidades', true),
  ('verified_earnings', 'Ganhos Verificados', 'Mostra badges de ganhos verificados nos perfis', true),
  ('dark_mode', 'Modo Escuro', 'Permite usuários alternar para tema escuro', true),
  ('push_notifications', 'Notificações Push', 'Habilita notificações push para o PWA', false),
  ('ai_captions', 'Legendas com IA', 'Gera legendas automáticas para vídeos usando IA', false),
  ('live_streaming', 'Lives', 'Permite usuários fazerem transmissões ao vivo', false);