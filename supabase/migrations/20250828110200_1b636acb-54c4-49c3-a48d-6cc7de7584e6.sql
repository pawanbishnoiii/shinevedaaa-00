-- Fix product data to show both products in featured section
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

-- Insert sample crops data with correct schema
INSERT INTO public.rajasthan_crops (
  name, description, season, region, image_url, duration_days, is_active, sort_order
) VALUES 
(
  'Onions', 
  'High-quality export onions with excellent storage life and pungency levels ideal for international markets.',
  'Rabi', 'Sri Ganganagar',
  'https://zlylzlmavxhgbjxuuseo.supabase.co/storage/v1/object/public/media-library/data/img/placeholder-product.jpg',
  150, true, 1
),
(
  'Jeera (Cumin)', 
  'Premium quality cumin seeds with high oil content and strong aroma, highly demanded in international spice markets.',
  'Rabi', 'Sri Ganganagar',
  'https://zlylzlmavxhgbjxuuseo.supabase.co/storage/v1/object/public/media-library/data/img/placeholder-product.jpg',
  150, true, 2
),
(
  'Peanuts (Groundnuts)', 
  'High-quality groundnuts with excellent oil content, perfect for both domestic consumption and export markets.',
  'Kharif', 'Hanumangarh',
  'https://zlylzlmavxhgbjxuuseo.supabase.co/storage/v1/object/public/media-library/data/img/placeholder-product.jpg',
  120, true, 3
)
ON CONFLICT (name) DO NOTHING;

-- Insert sample stories data with correct schema
INSERT INTO public.rajasthan_stories (
  title, content, village, district, hero_image_url, is_active, sort_order
) VALUES 
(
  'From Struggle to Success: Ramesh''s Onion Journey', 
  'Ramesh Kumar from Padampur village transformed his 5-acre farm from traditional wheat cultivation to high-yield onion farming with ShineVeda''s guidance and fair pricing guarantee. His journey represents the success of thousands of farmers in the region who have improved their livelihoods through modern agricultural practices.',
  'Padampur', 'Sri Ganganagar',
  'https://zlylzlmavxhgbjxuuseo.supabase.co/storage/v1/object/public/media-library/data/img/placeholder-product.jpg',
  true, 1
),
(
  'Sustainable Cumin Cultivation Success',
  'Sita Devi pioneered organic cumin farming in her region, achieving premium prices and sustainable farming practices that other farmers now follow. Her story inspires women farmers across Rajasthan to take up leadership roles in agriculture.',
  'Suratgarh', 'Sri Ganganagar',
  'https://zlylzlmavxhgbjxuuseo.supabase.co/storage/v1/object/public/media-library/data/img/placeholder-product.jpg',
  true, 2
)
ON CONFLICT (title) DO NOTHING;

-- Insert sample portfolio sections with correct schema
INSERT INTO public.rajasthan_portfolio_sections (
  section_type, title, content, image_url, is_active, sort_order
) VALUES 
(
  'region', 'Sri Ganganagar - Agricultural Hub',
  'Known as the food basket of Rajasthan, Sri Ganganagar is the primary agricultural region with canal irrigation supporting year-round cultivation.',
  'https://zlylzlmavxhgbjxuuseo.supabase.co/storage/v1/object/public/media-library/data/img/placeholder-product.jpg',
  true, 1
),
(
  'farming', 'Modern Farming Techniques',
  'Our partner farmers use modern irrigation, organic fertilizers, and sustainable farming practices to ensure the highest quality produce.',
  'https://zlylzlmavxhgbjxuuseo.supabase.co/storage/v1/object/public/media-library/data/img/placeholder-product.jpg',
  true, 2
)
ON CONFLICT (title) DO NOTHING;