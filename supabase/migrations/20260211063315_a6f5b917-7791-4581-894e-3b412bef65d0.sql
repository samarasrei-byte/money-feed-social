
-- Add label and label_metadata columns to posts table
ALTER TABLE public.posts 
ADD COLUMN label text DEFAULT NULL,
ADD COLUMN label_metadata jsonb DEFAULT NULL;

-- Add comment explaining valid label values
COMMENT ON COLUMN public.posts.label IS 'Post label type: verified_result, active_offer, sponsored, or NULL for regular posts';
COMMENT ON COLUMN public.posts.label_metadata IS 'JSON metadata for labels. verified_result: {amount, period}. active_offer: {product_name, commission_percent, offer_url}. sponsored: {brand_name}';

-- Create index for filtering labeled posts
CREATE INDEX idx_posts_label ON public.posts(label) WHERE label IS NOT NULL;
