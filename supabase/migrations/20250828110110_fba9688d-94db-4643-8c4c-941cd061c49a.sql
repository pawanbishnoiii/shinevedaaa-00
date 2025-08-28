-- Fix data issues and add sample data for testing

-- Update onion product to be featured and have image
UPDATE public.products 
SET 
  is_featured = true,
  image_url = CASE 
    WHEN image_url IS NULL OR image_url = '' 
    THEN 'https://zlylzlmavxhgbjxuuseo.supabase.co/storage/v1/object/public/media-library/data/img/placeholder-product.jpg'
    ELSE image_url 
  END,
  sort_order = CASE 
    WHEN slug = 'guar-gum-powder' THEN 1
    WHEN slug = 'onion' THEN 2
    ELSE sort_order
  END
WHERE slug IN ('onion', 'guar-gum-powder');

-- Insert sample data for Rajasthan Portfolio if not exists
INSERT INTO public.rajasthan_crops (
  name, hindi_name, scientific_name, category, sowing_season, harvesting_season,
  growing_months, water_requirement, soil_type, yield_per_hectare, market_price_range,
  description, export_markets, is_major_crop, is_active, image_url
) VALUES 
(
  'Onions', 'प्याज', 'Allium cepa', 'Rabi', 'October-December', 'March-May',
  5, 'Medium (400-600mm)', 'Well-drained loamy soil', '200-300 quintals/hectare', 
  '₹800-2000/quintal', 'High-quality export onions with excellent storage life and pungency levels ideal for international markets.',
  ARRAY['Dubai', 'Singapore', 'Malaysia', 'Bangladesh'], true, true,
  'https://zlylzlmavxhgbjxuuseo.supabase.co/storage/v1/object/public/media-library/data/img/placeholder-product.jpg'
),
(
  'Jeera (Cumin)', 'जीरा', 'Cuminum cyminum', 'Rabi', 'November-December', 'April-May',
  5, 'Low (200-400mm)', 'Sandy loam', '4-6 quintals/hectare', 
  '₹15000-25000/quintal', 'Premium quality cumin seeds with high oil content and strong aroma, highly demanded in international spice markets.',
  ARRAY['USA', 'Europe', 'Middle East', 'Japan'], true, true,
  'https://zlylzlmavxhgbjxuuseo.supabase.co/storage/v1/object/public/media-library/data/img/placeholder-product.jpg'
),
(
  'Peanuts (Groundnuts)', 'मूंगफली', 'Arachis hypogaea', 'Kharif', 'June-July', 'October-November',
  4, 'Medium (500-750mm)', 'Sandy loam with good drainage', '15-25 quintals/hectare',
  '₹4000-8000/quintal', 'High-quality groundnuts with excellent oil content, perfect for both domestic consumption and export markets.',
  ARRAY['Europe', 'USA', 'Southeast Asia', 'Middle East'], true, true,
  'https://zlylzlmavxhgbjxuuseo.supabase.co/storage/v1/object/public/media-library/data/img/placeholder-product.jpg'
)
ON CONFLICT (name) DO NOTHING;

-- Insert sample regional data
INSERT INTO public.rajasthan_portfolio_sections (
  name, district_name, climate_zone, soil_type, major_crops, annual_rainfall,
  temperature_range, specialties, is_active
) VALUES 
(
  'Sri Ganganagar', 'Sri Ganganagar', 'Arid', 'Alluvial', 
  ARRAY['Wheat', 'Rice', 'Cotton', 'Onions', 'Carrots'],
  '200-400mm', '5°C to 48°C',
  ARRAY['Canal irrigation', 'Export hub', 'Food processing'], true
),
(
  'Hanumangarh', 'Hanumangarh', 'Semi-Arid', 'Sandy Loam',
  ARRAY['Mustard', 'Wheat', 'Gram', 'Bajra', 'Guar'],
  '300-500mm', '8°C to 46°C',
  ARRAY['Organic farming', 'Livestock', 'Traditional crops'], true
)
ON CONFLICT (name) DO NOTHING;

-- Insert sample farmer stories
INSERT INTO public.rajasthan_stories (
  title, story_content, farmer_name, village_name, crop_focus, story_image_url,
  impact_description, is_featured, is_active
) VALUES 
(
  'From Struggle to Success: Ramesh''s Onion Journey', 
  'Ramesh Kumar from Padampur village transformed his 5-acre farm from traditional wheat cultivation to high-yield onion farming with ShineVeda''s guidance and fair pricing guarantee.',
  'Ramesh Kumar', 'Padampur', 'Onions',
  'https://zlylzlmavxhgbjxuuseo.supabase.co/storage/v1/object/public/media-library/data/img/placeholder-product.jpg',
  'Increased annual income by 300% through premium onion cultivation and direct export partnerships',
  true, true
),
(
  'Sustainable Cumin Cultivation Success',
  'Sita Devi pioneered organic cumin farming in her region, achieving premium prices and sustainable farming practices that other farmers now follow.',
  'Sita Devi', 'Suratgarh', 'Cumin',
  'https://zlylzlmavxhgbjxuuseo.supabase.co/storage/v1/object/public/media-library/data/img/placeholder-product.jpg',
  'Leading organic farming initiative benefiting 50+ families in the region',
  true, true
)
ON CONFLICT (title) DO NOTHING;