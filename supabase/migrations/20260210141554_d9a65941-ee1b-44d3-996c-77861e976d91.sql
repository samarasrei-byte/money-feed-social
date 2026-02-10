
-- Create storage bucket for post media (images and videos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post-media', 
  'post-media', 
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime']
);

-- Allow authenticated users to upload their own media
CREATE POLICY "Users can upload post media"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'post-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow anyone to view post media (public feed)
CREATE POLICY "Post media is publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'post-media');

-- Allow users to delete their own media
CREATE POLICY "Users can delete own post media"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'post-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own media
CREATE POLICY "Users can update own post media"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'post-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
