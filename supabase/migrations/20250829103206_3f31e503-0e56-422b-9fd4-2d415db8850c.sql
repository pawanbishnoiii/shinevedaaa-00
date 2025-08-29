-- Create portfolio_videos table
CREATE TABLE public.portfolio_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  video_type TEXT DEFAULT 'youtube',
  duration INTEGER DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'general',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rajasthan_crops table
CREATE TABLE public.rajasthan_crops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  season TEXT NOT NULL,
  region TEXT NOT NULL,
  duration_days INTEGER NOT NULL DEFAULT 90,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create downloadable_resources table
CREATE TABLE public.downloadable_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'general',
  download_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create portfolio_analytics table
CREATE TABLE public.portfolio_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL,
  content_id UUID,
  action_type TEXT NOT NULL,
  session_id TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.portfolio_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rajasthan_crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloadable_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Portfolio videos are viewable by everyone" 
ON public.portfolio_videos 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Rajasthan crops are viewable by everyone" 
ON public.rajasthan_crops 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Public downloadable resources are viewable by everyone" 
ON public.downloadable_resources 
FOR SELECT 
USING (is_public = true AND is_active = true);

CREATE POLICY "Anyone can insert analytics data" 
ON public.portfolio_analytics 
FOR INSERT 
WITH CHECK (true);

-- Create admin policies (if authenticated user exists)
CREATE POLICY "Authenticated users can manage portfolio videos" 
ON public.portfolio_videos 
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage rajasthan crops" 
ON public.rajasthan_crops 
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage downloadable resources" 
ON public.downloadable_resources 
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Create functions for timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_portfolio_videos_updated_at
BEFORE UPDATE ON public.portfolio_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rajasthan_crops_updated_at
BEFORE UPDATE ON public.rajasthan_crops
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_downloadable_resources_updated_at
BEFORE UPDATE ON public.downloadable_resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for portfolio_videos
INSERT INTO public.portfolio_videos (title, description, video_url, category, is_featured, sort_order) VALUES
('Welcome to ShineVeda', 'Introduction to our premium agricultural products from Rajasthan', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'hero', true, 1),
('Farmer Success Story', 'Meet Ram Singh, a farmer who transformed his yield with our guidance', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'testimonial', true, 1),
('Modern Farming Techniques', 'Learn about sustainable farming practices in Rajasthan', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'tutorial', false, 1);

-- Insert sample data for rajasthan_crops
INSERT INTO public.rajasthan_crops (name, season, region, duration_days, description, sort_order) VALUES
('Bajra (Pearl Millet)', 'Kharif', 'Western Rajasthan', 75, 'Drought-resistant crop perfect for arid regions of Rajasthan', 1),
('Wheat', 'Rabi', 'Northern Rajasthan', 120, 'Premium quality wheat grown in fertile plains of northern Rajasthan', 2),
('Mustard', 'Rabi', 'Central Rajasthan', 90, 'High-quality mustard seeds for oil production', 3),
('Cumin', 'Rabi', 'Western Rajasthan', 110, 'World-renowned Rajasthani cumin with distinctive aroma', 4),
('Coriander', 'Rabi', 'Southern Rajasthan', 100, 'Premium coriander seeds with exceptional quality', 5);

-- Insert sample data for downloadable_resources
INSERT INTO public.downloadable_resources (title, description, file_url, file_type, file_size, category) VALUES
('Product Catalog 2024', 'Complete catalog of our premium agricultural products', '/placeholder.svg', 'pdf', 2048000, 'catalog'),
('Quality Certificates', 'ISO and organic certification documents', '/placeholder.svg', 'pdf', 1024000, 'certificates'),
('Company Profile', 'Detailed company profile and capabilities', '/placeholder.svg', 'pdf', 3072000, 'company');