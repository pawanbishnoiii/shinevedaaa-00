-- ShineVeda B2B Export Platform Database Schema
-- Phase 1: Complete Database Foundation

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table for product organization
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table for B2B export products
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category_id UUID REFERENCES public.categories(id),
    short_description TEXT,
    description TEXT,
    specifications JSONB,
    features TEXT[],
    image_url TEXT,
    gallery_images TEXT[],
    price_range TEXT,
    currency TEXT DEFAULT 'USD',
    minimum_order_quantity TEXT,
    unit_type TEXT, -- kg, ton, pieces, etc.
    origin TEXT,
    export_markets TEXT[],
    certifications TEXT[],
    packaging_details TEXT,
    shelf_life TEXT,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    stock_status TEXT DEFAULT 'in_stock', -- in_stock, out_of_stock, pre_order
    lead_time TEXT,
    
    -- SEO fields
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT,
    
    -- B2B specific fields
    hsn_code TEXT,
    export_grade TEXT,
    quality_standards TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content blocks for dynamic website content
CREATE TABLE public.content_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    title TEXT,
    content TEXT,
    subtitle TEXT,
    image_url TEXT,
    metadata JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT,
    company_name TEXT,
    phone TEXT,
    country TEXT,
    role TEXT DEFAULT 'user', -- user, admin, manager
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inquiries table for lead tracking
CREATE TABLE public.inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inquiry_number TEXT GENERATED ALWAYS AS ('INQ-' || EXTRACT(YEAR FROM created_at) || '-' || LPAD(EXTRACT(MONTH FROM created_at)::TEXT, 2, '0') || '-' || LPAD((ROW_NUMBER() OVER (ORDER BY created_at))::TEXT, 4, '0')) STORED,
    
    -- Contact information
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    country TEXT,
    
    -- Inquiry details
    inquiry_type TEXT NOT NULL, -- quote_request, general_inquiry, bulk_order, sample_request
    product_id UUID REFERENCES public.products(id),
    product_name TEXT,
    quantity TEXT,
    quantity_unit TEXT,
    target_price TEXT,
    message TEXT,
    
    -- Business fields
    status TEXT DEFAULT 'new', -- new, in_progress, quoted, converted, closed
    priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
    source TEXT DEFAULT 'website', -- website, email, phone, referral
    assigned_to UUID REFERENCES public.profiles(id),
    
    -- Follow-up
    follow_up_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    internal_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name TEXT NOT NULL,
    client_company TEXT,
    client_position TEXT,
    client_country TEXT,
    testimonial_text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    client_image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media library table
CREATE TABLE public.media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL, -- image, document, video
    mime_type TEXT,
    file_size INTEGER,
    alt_text TEXT,
    caption TEXT,
    tags TEXT[],
    folder TEXT DEFAULT 'general',
    uploaded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company settings table
CREATE TABLE public.company_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value TEXT,
    data_type TEXT DEFAULT 'text', -- text, number, boolean, json
    category TEXT DEFAULT 'general',
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('product-images', 'product-images', true),
    ('media-library', 'media-library', true),
    ('documents', 'documents', false);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

-- Create admin detection functions
CREATE OR REPLACE FUNCTION public.is_admin(user_email TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT COALESCE(user_email, (SELECT email FROM auth.users WHERE id = auth.uid())) = 'bnoy.studios@gmail.com';
$$;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT COALESCE(
        (SELECT role FROM public.profiles WHERE id = auth.uid()),
        CASE 
            WHEN public.is_admin() THEN 'admin'
            ELSE 'user'
        END
    );
$$;

-- RLS Policies for Categories
CREATE POLICY "Anyone can view active categories" ON public.categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage categories" ON public.categories
    FOR ALL USING (public.is_admin());

-- RLS Policies for Products  
CREATE POLICY "Anyone can view active products" ON public.products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage products" ON public.products
    FOR ALL USING (public.is_admin());

-- RLS Policies for Content Blocks
CREATE POLICY "Anyone can view active content" ON public.content_blocks
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage content" ON public.content_blocks
    FOR ALL USING (public.is_admin());

-- RLS Policies for Profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles" ON public.profiles
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin can manage all profiles" ON public.profiles
    FOR ALL USING (public.is_admin());

-- RLS Policies for Inquiries
CREATE POLICY "Anyone can create inquiries" ON public.inquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view all inquiries" ON public.inquiries
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin can manage inquiries" ON public.inquiries
    FOR ALL USING (public.is_admin());

-- RLS Policies for Testimonials
CREATE POLICY "Anyone can view active testimonials" ON public.testimonials
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage testimonials" ON public.testimonials
    FOR ALL USING (public.is_admin());

-- RLS Policies for Media
CREATE POLICY "Admin can manage media" ON public.media
    FOR ALL USING (public.is_admin());

CREATE POLICY "Anyone can view media" ON public.media
    FOR SELECT USING (true);

-- RLS Policies for Company Settings
CREATE POLICY "Anyone can view public settings" ON public.company_settings
    FOR SELECT USING (is_public = true);

CREATE POLICY "Admin can manage settings" ON public.company_settings
    FOR ALL USING (public.is_admin());

-- Storage Policies
CREATE POLICY "Public can view product images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admin can upload product images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admin can manage media library" ON storage.objects
    FOR ALL USING (bucket_id = 'media-library' AND public.is_admin());

CREATE POLICY "Admin can manage documents" ON storage.objects
    FOR ALL USING (bucket_id = 'documents' AND public.is_admin());

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER content_blocks_updated_at BEFORE UPDATE ON public.content_blocks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER inquiries_updated_at BEFORE UPDATE ON public.inquiries FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER company_settings_updated_at BEFORE UPDATE ON public.company_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        CASE 
            WHEN NEW.email = 'bnoy.studios@gmail.com' THEN 'admin'
            ELSE 'user'
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert initial data
-- Categories
INSERT INTO public.categories (name, slug, description, is_active, sort_order, seo_title, seo_description) VALUES 
    ('Agricultural Products', 'agricultural-products', 'Premium quality agricultural products for international export', true, 1, 'Agricultural Products - ShineVeda Exports', 'High-quality agricultural products including guar gum, spices, and grains for global B2B buyers'),
    ('Gums & Derivatives', 'gums-derivatives', 'Natural gums and their derivatives for industrial applications', true, 2, 'Gums & Derivatives - ShineVeda', 'Industrial grade gums including guar gum powder and derivatives for various applications'),
    ('Spices & Herbs', 'spices-herbs', 'Premium spices and herbs from India', true, 3, 'Indian Spices & Herbs Export - ShineVeda', 'Authentic Indian spices and herbs for international markets');

-- Products (Starting with Guar Gum as flagship product)
INSERT INTO public.products (
    name, slug, category_id, short_description, description, 
    specifications, features, image_url, price_range, minimum_order_quantity,
    unit_type, origin, export_markets, certifications, packaging_details,
    shelf_life, is_active, is_featured, seo_title, seo_description,
    hsn_code, export_grade, quality_standards
) VALUES (
    'Guar Gum Powder',
    'guar-gum-powder',
    (SELECT id FROM public.categories WHERE slug = 'gums-derivatives'),
    'Premium quality guar gum powder for industrial and food applications',
    'Our premium guar gum powder is derived from high-quality guar beans sourced directly from Indian farms. Known for its excellent thickening, stabilizing, and binding properties, our guar gum powder meets international quality standards and is perfect for various industrial applications including food processing, textile printing, paper manufacturing, and oil drilling operations.',
    '{"viscosity": "4000-6000 cps", "mesh_size": "200 mesh", "moisture": "Max 12%", "protein": "4-6%", "ash": "Max 1.5%", "ph": "6.0-8.0"}',
    ARRAY['High viscosity', 'Food grade quality', 'Industrial applications', 'Natural thickening agent', 'Gluten-free', 'Non-GMO', 'Excellent binding properties', 'Cold water soluble'],
    '/placeholder.svg',
    '$2.50 - $4.00 per kg',
    '1000 kg',
    'kg',
    'Rajasthan, India',
    ARRAY['USA', 'Europe', 'Middle East', 'Southeast Asia', 'Africa'],
    ARRAY['ISO 22000', 'HACCP', 'Halal', 'Kosher', 'FSSAI'],
    '25kg PP bags, 500kg jumbo bags, or as per customer requirement',
    '24 months',
    true,
    true,
    'Guar Gum Powder Export - Premium Quality | ShineVeda',
    'High-quality guar gum powder for industrial & food applications. ISO certified, competitive pricing, reliable international shipping. Contact for bulk orders.',
    '13023000',
    'Food Grade / Industrial Grade',
    ARRAY['ASTA', 'BRC', 'FDA Approved']
);

-- Content blocks for dynamic website content
INSERT INTO public.content_blocks (key, title, content, subtitle, metadata) VALUES 
    ('hero_main', 'Premium Agricultural Exports from India', 'Your trusted partner for high-quality agricultural products and industrial raw materials. We specialize in bulk B2B exports with international quality standards.', 'Connecting Indian Agriculture with Global Markets', '{"cta_primary": "Request Quote", "cta_secondary": "View Products", "stats": [{"label": "Countries Served", "value": "25+"}, {"label": "Export Experience", "value": "10+ Years"}, {"label": "Quality Certifications", "value": "15+"}, {"label": "Happy Clients", "value": "200+"}]}'),
    ('about_company', 'About ShineVeda', 'ShineVeda is a leading exporter of premium agricultural products from India. With over a decade of experience in international trade, we have built strong relationships with suppliers and customers worldwide.', 'Excellence in Agricultural Exports', '{"established": "2012", "headquarters": "Mumbai, India", "specialization": "Agricultural Products Export"}'),
    ('why_choose_us', 'Why Choose ShineVeda?', 'We ensure quality at every step - from sourcing to delivery. Our commitment to excellence and customer satisfaction has made us a preferred partner for businesses worldwide.', 'Your Success is Our Priority', '{"points": ["Quality Assurance", "Competitive Pricing", "Timely Delivery", "Global Reach", "Expert Support"]}');

-- Company settings
INSERT INTO public.company_settings (key, value, category, description, is_public) VALUES 
    ('company_name', 'ShineVeda', 'company', 'Company name', true),
    ('company_email', 'info@shineveda.com', 'contact', 'Primary contact email', true),
    ('company_phone', '+91-98765-43210', 'contact', 'Primary contact phone', true),
    ('whatsapp_number', '+91-98765-43210', 'contact', 'WhatsApp business number', true),
    ('company_address', 'Mumbai, Maharashtra, India', 'company', 'Company address', true),
    ('website_url', 'https://shineveda.com', 'company', 'Website URL', true),
    ('social_linkedin', 'https://linkedin.com/company/shineveda', 'social', 'LinkedIn profile', true),
    ('social_facebook', 'https://facebook.com/shineveda', 'social', 'Facebook page', true);

-- Sample testimonials
INSERT INTO public.testimonials (client_name, client_company, client_position, client_country, testimonial_text, rating, is_featured, is_active) VALUES 
    ('John Smith', 'Global Foods Inc.', 'Procurement Manager', 'USA', 'ShineVeda has been our reliable partner for guar gum supply. Their quality consistency and timely delivery have helped us maintain our production schedules without any issues.', 5, true, true),
    ('Ahmed Hassan', 'Middle East Trading Co.', 'Director', 'UAE', 'Excellent service and competitive pricing. The team at ShineVeda understands our requirements and always delivers beyond expectations.', 5, true, true),
    ('Maria Rodriguez', 'European Ingredients Ltd.', 'Senior Buyer', 'Spain', 'Professional approach and high-quality products. We have been working with ShineVeda for 3 years and they never disappoint.', 5, false, true);