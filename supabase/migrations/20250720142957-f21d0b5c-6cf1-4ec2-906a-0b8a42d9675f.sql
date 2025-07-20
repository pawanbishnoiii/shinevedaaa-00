-- Add sample products data
INSERT INTO public.products (name, slug, category_id, description, short_description, specifications, features, price_range, minimum_order_quantity, image_url, is_featured, is_active) VALUES
(
  'Premium Red Onions',
  'premium-red-onions',
  (SELECT id FROM public.categories WHERE slug = 'fresh-produce'),
  'High-quality red onions sourced directly from farms in Sriganganagar, Rajasthan. These onions are known for their deep red color, strong flavor, and excellent storage life.',
  'Premium quality red onions with deep color and strong flavor',
  '{"size": ["Small (25-40mm)", "Medium (40-60mm)", "Large (60-80mm)"], "moisture": "12-14%", "shelf_life": "6-8 months", "origin": "Sriganganagar, Rajasthan"}',
  ARRAY['Rich red color', 'Strong pungent flavor', 'Excellent storage life', 'High dry matter content', 'Uniform size grading'],
  '$200-300 per MT',
  '25 MT minimum',
  'https://images.unsplash.com/photo-1580201092675-a0a6a4d4c6b5?w=400',
  true,
  true
),
(
  'Cumin Seeds (Jeera)',
  'cumin-seeds-jeera',
  (SELECT id FROM public.categories WHERE slug = 'spices'),
  'Premium quality cumin seeds with high oil content and rich aroma. Carefully selected and processed to maintain freshness and natural flavor.',
  'High-quality cumin seeds with rich aroma and flavor',
  '{"purity": "99.5%", "moisture": "8-10%", "oil_content": "2.5-4.5%", "grade": "Machine Clean"}',
  ARRAY['High oil content', 'Rich aroma', 'Machine cleaned', 'Uniform color', 'Export quality'],
  '$3500-4000 per MT',
  '5 MT minimum',
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
  true,
  true
),
(
  'Raw Peanuts',
  'raw-peanuts',
  (SELECT id FROM public.categories WHERE slug = 'nuts-seeds'),
  'Fresh raw peanuts with high oil content and excellent taste. Perfect for oil extraction and direct consumption.',
  'Fresh raw peanuts with high oil content',
  '{"moisture": "7-9%", "oil_content": "48-52%", "admixture": "1% max", "damage": "2% max"}',
  ARRAY['High oil content', 'Bold size', 'Natural flavor', 'Machine sorted', 'Export grade'],
  '$800-1200 per MT',
  '20 MT minimum',
  'https://images.unsplash.com/photo-1605813885747-5b9c0f6ffed5?w=400',
  false,
  true
);

-- Add sample testimonials
INSERT INTO public.testimonials (client_name, client_company, client_position, content, rating, country, is_featured, is_active) VALUES
(
  'Ahmed Al-Rahman',
  'Gulf Trading LLC',
  'Procurement Manager',
  'ShineVeda has been our trusted partner for agricultural exports. Their quality is consistently excellent and delivery is always on time. The red onions we receive are of premium grade and our customers are very satisfied.',
  5,
  'UAE',
  true,
  true
),
(
  'Maria Rodriguez',
  'European Spice Co.',
  'Quality Director',
  'The cumin seeds from ShineVeda exceed our quality standards. The aroma and oil content are outstanding. We have been working with them for 2 years and never faced any quality issues.',
  5,
  'Spain',
  true,
  true
),
(
  'Raj Patel',
  'Indo-American Foods',
  'CEO',
  'Excellent quality products and professional service. ShineVeda understands international market requirements and delivers accordingly.',
  4,
  'USA',
  false,
  true
);

-- Add sample inquiries
INSERT INTO public.inquiries (name, email, phone, company, country, product_interest, message, inquiry_type, status, priority) VALUES
(
  'John Smith',
  'john.smith@globaltrading.com',
  '+44-20-1234-5678',
  'Global Trading Ltd',
  'United Kingdom',
  'Cumin Seeds',
  'We are interested in importing 50 MT of premium cumin seeds. Please provide detailed quotation including FOB and CIF prices.',
  'quote',
  'new',
  'high'
),
(
  'Lisa Chen',
  'lisa.chen@asiaimports.sg',
  '+65-9123-4567',
  'Asia Imports Pte Ltd',
  'Singapore',
  'Red Onions',
  'Looking for regular supplier of red onions. Need 100 MT monthly supply. Please share your best rates and terms.',
  'partnership',
  'new',
  'normal'
),
(
  'Hassan Ibrahim',
  'hassan@middleeastfoods.ae',
  '+971-50-123-4567',
  'Middle East Foods Trading',
  'UAE',
  'Mixed Spices',
  'Require bulk quantities of various spices including cumin, coriander, and fennel. Please contact for detailed requirements.',
  'bulk_order',
  'in_progress',
  'high'
);