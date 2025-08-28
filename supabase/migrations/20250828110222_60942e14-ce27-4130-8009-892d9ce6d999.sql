-- Simple fix for product data to show both products in featured section
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