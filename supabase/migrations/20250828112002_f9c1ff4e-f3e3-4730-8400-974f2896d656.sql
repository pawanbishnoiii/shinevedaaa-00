-- Fix the products query by ensuring proper foreign key relationships
-- and adding missing columns for featured ranking

-- Add featured_rank column to products for proper ordering
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS featured_rank INTEGER DEFAULT 0;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_featured_rank ON public.products(featured_rank, is_featured, is_active);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);

-- Ensure we have proper foreign key relationship
DO $$ 
BEGIN
    -- Check if foreign key exists, if not create it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'products_category_id_fkey'
    ) THEN
        ALTER TABLE public.products 
        ADD CONSTRAINT products_category_id_fkey 
        FOREIGN KEY (category_id) REFERENCES public.categories(id);
    END IF;
END $$;

-- Add Storage migration for media library
-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('product-images', 'product-images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('media-library', 'media-library', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for product images
CREATE POLICY "Public product images access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admin can upload product images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' AND 
  is_admin()
);

CREATE POLICY "Admin can update product images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-images' AND 
  is_admin()
);

CREATE POLICY "Admin can delete product images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' AND 
  is_admin()
);

-- Storage policies for media library
CREATE POLICY "Public media library access" ON storage.objects
FOR SELECT USING (bucket_id = 'media-library');

CREATE POLICY "Admin can upload to media library" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'media-library' AND 
  is_admin()
);

CREATE POLICY "Admin can update media library" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'media-library' AND 
  is_admin()
);

CREATE POLICY "Admin can delete from media library" ON storage.objects
FOR DELETE USING (
  bucket_id = 'media-library' AND 
  is_admin()
);

-- Create auto-refresh function
CREATE OR REPLACE FUNCTION auto_refresh_app()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log the refresh activity
  INSERT INTO public.activity_logs (activity_type, description)
  VALUES ('system', 'Auto-refresh function executed');
  
  -- Update a dummy setting to trigger database activity
  INSERT INTO public.site_settings (setting_key, setting_value)
  VALUES ('last_auto_refresh', NOW()::text)
  ON CONFLICT (setting_key) 
  DO UPDATE SET 
    setting_value = NOW()::text,
    updated_at = NOW();
END;
$$;

-- Schedule auto-refresh every 12 hours using pg_cron
-- This will help keep the free trial active
SELECT cron.schedule(
  'auto-refresh-app',
  '0 */12 * * *', -- Every 12 hours
  'SELECT auto_refresh_app();'
) WHERE NOT EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'auto-refresh-app'
);