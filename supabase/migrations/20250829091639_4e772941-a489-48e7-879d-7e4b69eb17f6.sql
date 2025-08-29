-- Phase 2 & 4: Enhanced Portfolio Database Setup
-- Add portfolio videos table
CREATE TABLE IF NOT EXISTS public.portfolio_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  video_type TEXT DEFAULT 'youtube', -- youtube, vimeo, direct
  duration INTEGER, -- in seconds
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  category TEXT DEFAULT 'general', -- hero, testimonial, tutorial, showcase
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add downloadable resources table
CREATE TABLE IF NOT EXISTS public.downloadable_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL, -- pdf, doc, image, video
  file_size INTEGER, -- in bytes
  category TEXT DEFAULT 'general', -- certificate, brochure, datasheet, catalog
  download_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add portfolio analytics table
CREATE TABLE IF NOT EXISTS public.portfolio_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL, -- video, resource, gallery, story
  content_id UUID,
  action_type TEXT NOT NULL, -- view, download, share, like
  user_id UUID,
  session_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Extend media table with video metadata
ALTER TABLE public.media 
ADD COLUMN IF NOT EXISTS video_duration INTEGER,
ADD COLUMN IF NOT EXISTS video_thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS is_video BOOLEAN DEFAULT false;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_videos_category ON public.portfolio_videos(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_videos_active ON public.portfolio_videos(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_downloadable_resources_category ON public.downloadable_resources(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_analytics_content ON public.portfolio_analytics(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_media_video ON public.media(is_video);

-- Enable RLS
ALTER TABLE public.portfolio_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloadable_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for portfolio_videos
CREATE POLICY "Anyone can view active videos" ON public.portfolio_videos
FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage videos" ON public.portfolio_videos
FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- RLS Policies for downloadable_resources
CREATE POLICY "Anyone can view public resources" ON public.downloadable_resources
FOR SELECT USING (is_public = true AND is_active = true);

CREATE POLICY "Admin can manage resources" ON public.downloadable_resources
FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- RLS Policies for portfolio_analytics
CREATE POLICY "Anyone can insert analytics" ON public.portfolio_analytics
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can read analytics" ON public.portfolio_analytics
FOR SELECT USING (is_admin());

-- Add sample portfolio content
INSERT INTO public.portfolio_videos (title, description, video_url, thumbnail_url, video_type, category, is_featured) VALUES
('ShineVeda Agricultural Excellence', 'Showcase of our premium agricultural products and export capabilities', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '/placeholder.svg', 'youtube', 'hero', true),
('Farmer Success Stories', 'Real stories from our partner farmers in Rajasthan', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '/placeholder.svg', 'youtube', 'testimonial', false),
('Modern Farming Techniques', 'Advanced agricultural practices we promote', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '/placeholder.svg', 'youtube', 'tutorial', false);

INSERT INTO public.downloadable_resources (title, description, file_url, file_type, category) VALUES
('Quality Certificates', 'ISO, HACCP, and other quality certifications', '/placeholder.pdf', 'pdf', 'certificate'),
('Product Catalog 2024', 'Complete catalog of our agricultural products', '/placeholder.pdf', 'pdf', 'catalog'),
('Company Brochure', 'ShineVeda company overview and capabilities', '/placeholder.pdf', 'pdf', 'brochure');

-- Update timestamps trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_portfolio_videos_updated_at
  BEFORE UPDATE ON public.portfolio_videos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_downloadable_resources_updated_at
  BEFORE UPDATE ON public.downloadable_resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();