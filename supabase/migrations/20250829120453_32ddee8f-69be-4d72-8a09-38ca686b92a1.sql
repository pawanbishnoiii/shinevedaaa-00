-- Create farmer stories table for success stories management
CREATE TABLE public.farmer_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  full_story TEXT NOT NULL,
  before_metric TEXT,
  before_value TEXT,
  after_metric TEXT,
  after_value TEXT,
  improvement TEXT,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'success' CHECK (category IN ('success', 'innovation', 'community')),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create crop portfolio table for dynamic crop management  
CREATE TABLE public.crop_portfolio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  hindi_name TEXT,
  region TEXT NOT NULL,
  season TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  moisture TEXT,
  purity TEXT,
  packaging TEXT,
  shelf_life TEXT,
  export_grades TEXT[] DEFAULT '{}',
  image_url TEXT,
  color_class TEXT DEFAULT 'text-green-600',
  bg_color_class TEXT DEFAULT 'bg-green-100',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create gallery images table for dynamic image management
CREATE TABLE public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  src TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('farmers', 'crops', 'processing', 'community')),
  description TEXT,
  photographer TEXT,
  license_type TEXT DEFAULT 'CC BY',
  license_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create story submissions table for farmer story submissions
CREATE TABLE public.story_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  story_title TEXT NOT NULL,
  story_content TEXT NOT NULL,
  farming_experience TEXT,
  crop_types TEXT[] DEFAULT '{}',
  success_metrics JSONB,
  images JSONB DEFAULT '[]',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'published')),
  admin_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Create farmer network table for farmer registration
CREATE TABLE public.farmer_network (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  land_size_acres DECIMAL,
  farming_experience_years INTEGER,
  current_crops TEXT[] DEFAULT '{}',
  interested_crops TEXT[] DEFAULT '{}',
  farming_type TEXT DEFAULT 'traditional' CHECK (farming_type IN ('traditional', 'organic', 'mixed')),
  has_irrigation BOOLEAN DEFAULT false,
  has_storage BOOLEAN DEFAULT false,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verification_documents JSONB DEFAULT '[]',
  contract_status TEXT DEFAULT 'none' CHECK (contract_status IN ('none', 'interested', 'contracted')),
  notes TEXT,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.farmer_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_network ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for farmer_stories
CREATE POLICY "Anyone can view active farmer stories" 
ON public.farmer_stories FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admin can manage farmer stories" 
ON public.farmer_stories FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());

-- Create RLS policies for crop_portfolio
CREATE POLICY "Anyone can view active crops" 
ON public.crop_portfolio FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admin can manage crop portfolio" 
ON public.crop_portfolio FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());

-- Create RLS policies for gallery_images
CREATE POLICY "Anyone can view active gallery images" 
ON public.gallery_images FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admin can manage gallery images" 
ON public.gallery_images FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());

-- Create RLS policies for story_submissions
CREATE POLICY "Anyone can submit stories" 
ON public.story_submissions FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin can manage story submissions" 
ON public.story_submissions FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());

-- Create RLS policies for farmer_network
CREATE POLICY "Anyone can register as farmer" 
ON public.farmer_network FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin can manage farmer network" 
ON public.farmer_network FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());

-- Create triggers for updated_at columns
CREATE TRIGGER update_farmer_stories_updated_at
  BEFORE UPDATE ON public.farmer_stories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crop_portfolio_updated_at
  BEFORE UPDATE ON public.crop_portfolio
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gallery_images_updated_at
  BEFORE UPDATE ON public.gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for crop portfolio
INSERT INTO public.crop_portfolio (name, hindi_name, region, season, description, features, moisture, purity, packaging, shelf_life, export_grades, image_url, color_class, bg_color_class, is_featured, sort_order) VALUES
('Onions', 'प्याज', 'Rajasthan (Sikar & surrounding)', 'Rabi (Nov-Apr)', 'Premium export-grade onions with excellent storage life and uniform size grading.', 
 ARRAY['Export quality grading', '50kg mesh bag packing', 'Cold storage facilities', 'Uniform size sorting'], 
 '12-14%', '98%+', '50kg mesh bags', '6-8 months', 
 ARRAY['40-60mm', '60-80mm', '80mm+'], '/data/img/sikar-onion-harvest.jpg', 'text-red-600', 'bg-red-100 dark:bg-red-900', true, 1),
 
('Cumin (Jeera)', 'जीरा', 'Sikar, Rajasthan', 'Rabi (Nov-May)', 'Premium Sikar jeera known for its superior aroma, oil content, and export quality.',
 ARRAY['High oil content', 'Superior aroma profile', 'Machine cleaned', 'Moisture controlled'],
 '8-10%', '99%+', '25kg jute bags', '2-3 years',
 ARRAY['Singapore Quality', 'Europe Quality', 'Machine Clean'], '/data/img/sikar-jeera-seeds.jpg', 'text-amber-600', 'bg-amber-100 dark:bg-amber-900', true, 2),

('Guar Gum', 'ग्वार गम', 'Rajasthan', 'Kharif (Jun-Oct)', 'High-purity guar gum for industrial and food applications with strict quality controls.',
 ARRAY['Food grade purity', 'Industrial applications', 'Viscosity tested', 'Microbial control'],
 '12% max', '85%+ viscosity', '25kg HDPE bags', '2 years',
 ARRAY['Food Grade', 'Industrial Grade', 'Pharmaceutical Grade'], '/data/img/guar-gum-processing.jpg', 'text-green-600', 'bg-green-100 dark:bg-green-900', true, 3);

-- Insert sample data for farmer stories
INSERT INTO public.farmer_stories (name, location, state, title, excerpt, full_story, before_metric, before_value, after_metric, after_value, improvement, image_url, category, is_featured, sort_order) VALUES
('राम सिंह जी', 'Sikar', 'Rajasthan', 'From Leased Land to Prosperity', 'Small landholder transformed farming with drip irrigation and improved seeds, achieving 30% higher earnings.',
 'राम सिंह जी started with just 2 bigha of leased land in Sikar district. With ShineVeda''s guidance on modern farming techniques including drip irrigation and high-yield seed varieties, he not only improved his crop quality but also reduced water consumption by 40%. Today, he grows premium onions that meet export standards and has expanded to 5 bigha of land.',
 'Annual Income', '₹80,000', 'Annual Income', '₹1,04,000', '+30% increase', '/src/assets/rajasthan-farmers.jpg', 'success', true, 1),

('Harpreet Kaur', 'Ludhiana', 'Punjab', 'Diversification Success with Cumin', 'Punjab farmer diversified from traditional crops to cumin cultivation with ShineVeda support.',
 'Harpreet Kaur was growing traditional wheat and rice in Punjab when she learned about cumin cultivation opportunities through ShineVeda. Our agronomists provided technical guidance on soil preparation, seed selection, and harvesting techniques specific to cumin. She now supplies premium quality jeera to our export division.',
 'Crop Diversity', '2 crops', 'Crop Diversity', '4 crops', '100% diversification', '/src/assets/modern-agriculture.jpg', 'innovation', true, 2),

('सरिता देवी', 'Jhunjhunu', 'Rajasthan', 'Women-Led Farming Cooperative', 'Leading a women farmers cooperative with focus on organic packaging and direct market access.',
 'सरिता देवी organized 15 women farmers in her village to form a cooperative focused on organic farming and value-added packaging. Through ShineVeda''s partnership, they learned modern packaging techniques, quality grading, and now their produce reaches international markets directly. The cooperative has become a model for other villages.',
 'Farmers Involved', '1 individual', 'Farmers Involved', '15 cooperative', '1400% growth', '/src/assets/farming-family.jpg', 'community', true, 3);

-- Insert sample data for gallery images
INSERT INTO public.gallery_images (src, alt_text, title, category, description, photographer, license_type, license_url, is_featured, sort_order) VALUES
('/src/assets/rajasthan-farmers.jpg', 'Rajasthan farmer family in field — ShineVeda support', 'Farmer Family Partnership', 'farmers', 'Working directly with farming families in Rajasthan for sustainable agriculture', 'ShineVeda Team', 'CC BY', 'https://creativecommons.org/licenses/by/4.0/', true, 1),
('/data/img/sikar-onion-harvest.jpg', 'Sikar onion harvest — export grade onions', 'Premium Onion Harvest', 'crops', 'Export-quality onions from Sikar district, carefully graded and sorted', 'ShineVeda Team', 'CC BY', 'https://creativecommons.org/licenses/by/4.0/', true, 2),
('/data/img/sikar-jeera-seeds.jpg', 'Sikar jeera seeds closeup — premium cumin', 'Premium Cumin Seeds', 'crops', 'High-oil content jeera from Sikar, known for superior aroma and quality', 'ShineVeda Team', 'CC BY', 'https://creativecommons.org/licenses/by/4.0/', true, 3),
('/data/img/guar-gum-processing.jpg', 'Guar gum processing — export quality', 'Guar Gum Processing', 'processing', 'State-of-the-art processing facilities for food-grade guar gum', 'ShineVeda Team', 'CC BY', 'https://creativecommons.org/licenses/by/4.0/', true, 4),
('/data/img/packaging-grading.jpg', 'Packaging and grading for exports — ShineVeda', 'Export Packaging', 'processing', 'Professional packaging and grading facilities meeting international standards', 'ShineVeda Team', 'CC BY', 'https://creativecommons.org/licenses/by/4.0/', false, 5),
('/data/img/farmer-training.jpg', 'Farmer training session — small land yield improvement', 'Farmer Training Programs', 'community', 'Technical training sessions for yield improvement and modern farming techniques', 'ShineVeda Team', 'CC BY', 'https://creativecommons.org/licenses/by/4.0/', false, 6),
('/data/img/women-farmers-cooperative.jpg', 'Women farmers cooperative — Rajasthan', 'Women Farmers Cooperative', 'community', 'Supporting women-led farming cooperatives across rural Rajasthan', 'ShineVeda Team', 'CC BY', 'https://creativecommons.org/licenses/by/4.0/', false, 7),
('/data/img/punjab-farmer-portrait.jpg', 'Punjab farmer portrait — diversified crops', 'Punjab Partnership', 'farmers', 'Expanding partnerships with progressive farmers in Punjab', 'ShineVeda Team', 'CC BY', 'https://creativecommons.org/licenses/by/4.0/', false, 8);