
-- Create storage bucket for product/brand images
INSERT INTO storage.buckets (id, name, public) VALUES ('brand-assets', 'brand-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to brand-assets
CREATE POLICY "Authenticated users can upload brand assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'brand-assets');

-- Public read access
CREATE POLICY "Brand assets are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'brand-assets');

-- Users can update their own uploads
CREATE POLICY "Users can update own brand assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'brand-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own uploads
CREATE POLICY "Users can delete own brand assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'brand-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
