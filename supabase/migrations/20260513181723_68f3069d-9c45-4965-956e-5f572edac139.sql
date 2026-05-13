-- Tighten brand-assets upload policy
DROP POLICY IF EXISTS "Authenticated users can upload brand assets" ON storage.objects;
CREATE POLICY "Users can upload own brand assets" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'brand-assets' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- Tighten course-content upload policy
DROP POLICY IF EXISTS "Authenticated users can upload course content" ON storage.objects;
CREATE POLICY "Users can upload own course content" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'course-content' AND (auth.uid())::text = (storage.foldername(name))[1]);
