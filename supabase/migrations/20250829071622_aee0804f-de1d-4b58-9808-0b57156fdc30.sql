-- Update products with comprehensive SEO data and descriptions
UPDATE products SET 
  short_description = CASE 
    WHEN name = 'Onion' THEN 'Premium export quality fresh onions from Rajasthan. Available in red and white varieties with excellent storage life.'
    WHEN name = 'Pomegranate' THEN 'Fresh, juicy pomegranates from the finest orchards. Rich in antioxidants and perfect for international markets.'
    WHEN name = 'Cumin Seeds (Jeera)' THEN 'Aromatic premium cumin seeds from Rajasthan. Perfect for culinary and pharmaceutical applications.'
    WHEN name = 'Guar Gum Powder' THEN 'Premium quality guar gum powder for industrial and food applications'
    ELSE short_description
  END,
  description = CASE 
    WHEN name = 'Onion' THEN 'Our premium export-grade onions are sourced from the finest farms in Rajasthan, India. These onions are known for their exceptional quality, longer shelf life, and rich flavor profile. Available in both red and white varieties, our onions undergo rigorous quality checks to ensure they meet international standards. Perfect for B2B buyers looking for consistent supply and competitive pricing. We offer flexible packaging options and ensure proper cold chain management for international shipping to maintain freshness and quality throughout the supply chain.'
    WHEN name = 'Pomegranate' THEN 'Experience the finest pomegranates from India, cultivated in the ideal climate of Rajasthan. Our pomegranates are hand-selected for their superior quality, vibrant color, and exceptional taste. Rich in antioxidants, vitamins, and minerals, these fruits are perfect for health-conscious consumers worldwide. We ensure careful harvesting, proper grading, and premium packaging to deliver the best quality fruit to international markets. Our pomegranates have excellent keeping quality and are ideal for both fresh consumption and processing industries.'
    WHEN name = 'Cumin Seeds (Jeera)' THEN 'Premium quality cumin seeds sourced directly from the spice capital of India, Rajasthan. Our cumin seeds are known for their strong aroma, rich flavor, and high oil content. Carefully cleaned, sorted, and processed using advanced machinery to ensure purity and quality. These seeds are perfect for culinary applications, pharmaceutical uses, and food processing industries. We maintain strict quality standards and provide complete traceability from farm to export. Available in various packaging options suitable for international shipping and long-term storage.'
    ELSE description
  END,
  seo_title = CASE 
    WHEN name = 'Onion' THEN 'Fresh Export Quality Onions from India | ShineVeda'
    WHEN name = 'Pomegranate' THEN 'Premium Fresh Pomegranates Export | ShineVeda'
    WHEN name = 'Cumin Seeds (Jeera)' THEN 'Premium Cumin Seeds Export from Rajasthan | ShineVeda'
    ELSE seo_title
  END,
  seo_description = CASE 
    WHEN name = 'Onion' THEN 'Export quality fresh onions from Rajasthan, India. Premium red & white varieties with excellent storage life. Competitive B2B pricing, international shipping. Contact for bulk orders.'
    WHEN name = 'Pomegranate' THEN 'Premium fresh pomegranates from India. Rich in antioxidants, perfect for international markets. Export quality, competitive pricing, reliable shipping worldwide.'
    WHEN name = 'Cumin Seeds (Jeera)' THEN 'Aromatic premium cumin seeds from Rajasthan. High oil content, perfect for culinary & pharmaceutical use. Export quality, competitive pricing, international shipping.'
    ELSE seo_description
  END,
  seo_keywords = CASE 
    WHEN name = 'Onion' THEN 'onion export, fresh onions India, Rajasthan onions, red onion export, white onion export, onion supplier, B2B onion trade, international onion shipping, export quality onions, Indian agricultural export'
    WHEN name = 'Pomegranate' THEN 'pomegranate export, fresh pomegranates India, Rajasthan pomegranate, antioxidant fruit, premium pomegranate, international fruit trade, B2B fruit export, healthy fruit export, pomegranate supplier'
    WHEN name = 'Cumin Seeds (Jeera)' THEN 'cumin seeds export, jeera export India, Rajasthan cumin, premium spices, cumin supplier, spice export, aromatic cumin, pharmaceutical cumin, culinary spices, Indian spice export'
    ELSE seo_keywords
  END,
  price_range = CASE 
    WHEN name = 'Onion' AND price_range IS NULL THEN '$200 - $400 per MT'
    WHEN name = 'Pomegranate' AND price_range IS NULL THEN '$800 - $1200 per MT'
    WHEN name = 'Cumin Seeds (Jeera)' AND price_range IS NULL THEN '$1500 - $2500 per MT'
    ELSE price_range
  END,
  minimum_order_quantity = CASE 
    WHEN name = 'Onion' AND minimum_order_quantity IS NULL THEN '20 MT'
    WHEN name = 'Pomegranate' AND minimum_order_quantity IS NULL THEN '5 MT'
    WHEN name = 'Cumin Seeds (Jeera)' AND minimum_order_quantity IS NULL THEN '1 MT'
    ELSE minimum_order_quantity
  END,
  origin = CASE 
    WHEN origin IS NULL THEN 'Sri Ganganagar, Rajasthan, India'
    ELSE origin
  END,
  packaging_details = CASE 
    WHEN name = 'Onion' AND packaging_details IS NULL THEN 'Mesh bags (25kg, 50kg), Cartons (10kg, 15kg), or custom packaging as per buyer requirements'
    WHEN name = 'Pomegranate' AND packaging_details IS NULL THEN 'Cartons (4kg, 5kg), Trays with individual fruit wrapping, Temperature controlled packaging'
    WHEN name = 'Cumin Seeds (Jeera)' AND packaging_details IS NULL THEN 'Jute bags (25kg, 50kg), PP bags, Cartons (1kg, 5kg, 10kg), Custom packaging available'
    ELSE packaging_details
  END,
  shelf_life = CASE 
    WHEN name = 'Onion' AND shelf_life IS NULL THEN '4-6 months (proper storage)'
    WHEN name = 'Pomegranate' AND shelf_life IS NULL THEN '2-3 months (refrigerated)'
    WHEN name = 'Cumin Seeds (Jeera)' AND shelf_life IS NULL THEN '24 months (dry storage)'
    ELSE shelf_life
  END,
  certifications = CASE 
    WHEN certifications IS NULL THEN ARRAY['ISO 22000:2018', 'HACCP', 'FSSAI', 'Phytosanitary Certificate', 'Certificate of Origin']
    ELSE certifications
  END,
  export_markets = CASE 
    WHEN export_markets IS NULL THEN ARRAY['Singapore', 'UAE', 'Qatar', 'Saudi Arabia', 'USA', 'UK', 'Australia', 'Malaysia', 'Bangladesh', 'Nepal']
    ELSE export_markets
  END,
  features = CASE 
    WHEN name = 'Onion' AND features IS NULL THEN ARRAY['Export Grade Quality', 'Long Storage Life', 'Rich Flavor Profile', 'Available Year Round', 'Competitive Pricing', 'Reliable Supply Chain']
    WHEN name = 'Pomegranate' AND features IS NULL THEN ARRAY['Rich in Antioxidants', 'Premium Grade', 'Excellent Keeping Quality', 'Vibrant Color', 'Sweet & Juicy', 'Health Benefits']
    WHEN name = 'Cumin Seeds (Jeera)' AND features IS NULL THEN ARRAY['High Oil Content', 'Strong Aroma', 'Rich Flavor', 'Machine Cleaned', 'Export Grade', 'Premium Quality']
    ELSE features
  END,
  specifications = CASE 
    WHEN name = 'Onion' AND specifications IS NULL THEN '{"Size": "Medium to Large (50-80mm)", "Moisture": "Max 12%", "Color": "Uniform", "Purity": "99% min", "Packaging": "As per buyer requirement"}'::jsonb
    WHEN name = 'Pomegranate' AND specifications IS NULL THEN '{"Size": "Medium to Large", "Color": "Deep Red", "Taste": "Sweet", "Seeds": "Ruby Red", "Brix": "14-16%"}'::jsonb
    WHEN name = 'Cumin Seeds (Jeera)' AND specifications IS NULL THEN '{"Purity": "99% min", "Moisture": "Max 10%", "Oil Content": "2.5-4%", "Color": "Natural Brown", "Foreign Matter": "Max 1%"}'::jsonb
    ELSE specifications
  END
WHERE name IN ('Onion', 'Pomegranate', 'Cumin Seeds (Jeera)', 'Guar Gum Powder');