
-- Create admin detection functions first
CREATE OR REPLACE FUNCTION public.is_admin_by_email(email_to_check text DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT COALESCE(email_to_check, '') = 'bnoy.studios@gmail.com';
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_email()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT COALESCE(
        (SELECT email FROM auth.users WHERE id = auth.uid()),
        ''
    );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_session()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT public.is_admin_by_email(public.get_current_user_email());
$$;

-- Users table for profile management
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories for organizing products
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table with comprehensive fields
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    description TEXT,
    short_description TEXT,
    specifications JSONB DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    origin TEXT DEFAULT 'Sriganganagar, Rajasthan',
    packaging_options TEXT[] DEFAULT '{}',
    shelf_life TEXT,
    price_range TEXT,
    minimum_order_quantity TEXT,
    image_url TEXT,
    gallery_images TEXT[] DEFAULT '{}',
    video_url TEXT,
    seo_title TEXT,
    seo_description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content blocks for dynamic content management
CREATE TABLE public.content_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    title TEXT,
    content TEXT,
    data JSONB DEFAULT '{}',
    image_url TEXT,
    video_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials management
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_company TEXT,
    client_position TEXT,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    client_image_url TEXT,
    country TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inquiries and lead management
CREATE TABLE public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    country TEXT,
    product_interest TEXT,
    message TEXT NOT NULL,
    inquiry_type TEXT DEFAULT 'general' CHECK (inquiry_type IN ('general', 'quote', 'partnership', 'bulk_order')),
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'responded', 'in_progress', 'closed')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    admin_notes TEXT,
    response_sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts for content marketing
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image_url TEXT,
    author_id UUID REFERENCES public.users(id),
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    seo_title TEXT,
    seo_description TEXT,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media files management
CREATE TABLE public.media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT NOT NULL,
    alt_text TEXT,
    caption TEXT,
    category TEXT DEFAULT 'general',
    uploaded_by UUID REFERENCES public.users(id),
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin settings
CREATE TABLE public.admin_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Users
CREATE POLICY "Admin can manage all users" ON public.users 
FOR ALL TO authenticated 
USING (public.is_admin_session()) 
WITH CHECK (public.is_admin_session());

CREATE POLICY "Users can view own profile" ON public.users 
FOR SELECT TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users 
FOR UPDATE TO authenticated 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- RLS Policies for Categories (Public read, Admin write)
CREATE POLICY "Anyone can view active categories" ON public.categories 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admin can manage categories" ON public.categories 
FOR ALL TO authenticated 
USING (public.is_admin_session()) 
WITH CHECK (public.is_admin_session());

-- RLS Policies for Products (Public read, Admin write)
CREATE POLICY "Anyone can view active products" ON public.products 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admin can manage products" ON public.products 
FOR ALL TO authenticated 
USING (public.is_admin_session()) 
WITH CHECK (public.is_admin_session());

-- RLS Policies for Content Blocks (Public read, Admin write)
CREATE POLICY "Anyone can view active content" ON public.content_blocks 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admin can manage content" ON public.content_blocks 
FOR ALL TO authenticated 
USING (public.is_admin_session()) 
WITH CHECK (public.is_admin_session());

-- RLS Policies for Testimonials (Public read, Admin write)
CREATE POLICY "Anyone can view active testimonials" ON public.testimonials 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admin can manage testimonials" ON public.testimonials 
FOR ALL TO authenticated 
USING (public.is_admin_session()) 
WITH CHECK (public.is_admin_session());

-- RLS Policies for Inquiries (Admin only)
CREATE POLICY "Admin can manage inquiries" ON public.inquiries 
FOR ALL TO authenticated 
USING (public.is_admin_session()) 
WITH CHECK (public.is_admin_session());

CREATE POLICY "Anyone can create inquiries" ON public.inquiries 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for Blog Posts (Public read published, Admin write)
CREATE POLICY "Anyone can view published posts" ON public.blog_posts 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admin can manage blog posts" ON public.blog_posts 
FOR ALL TO authenticated 
USING (public.is_admin_session()) 
WITH CHECK (public.is_admin_session());

-- RLS Policies for Media Files (Public read, Admin write)
CREATE POLICY "Anyone can view public media" ON public.media_files 
FOR SELECT 
USING (is_public = true);

CREATE POLICY "Admin can manage media" ON public.media_files 
FOR ALL TO authenticated 
USING (public.is_admin_session()) 
WITH CHECK (public.is_admin_session());

-- RLS Policies for Admin Settings (Admin only)
CREATE POLICY "Admin can manage settings" ON public.admin_settings 
FOR ALL TO authenticated 
USING (public.is_admin_session()) 
WITH CHECK (public.is_admin_session());

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('product-images', 'product-images', true),
('hero-media', 'hero-media', true),
('testimonial-images', 'testimonial-images', true),
('blog-images', 'blog-images', true),
('documents', 'documents', true);

-- Storage policies for admin management
CREATE POLICY "Admin can manage product images" ON storage.objects 
FOR ALL TO authenticated 
USING (bucket_id = 'product-images' AND public.is_admin_session());

CREATE POLICY "Public can view product images" ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Admin can manage hero media" ON storage.objects 
FOR ALL TO authenticated 
USING (bucket_id = 'hero-media' AND public.is_admin_session());

CREATE POLICY "Public can view hero media" ON storage.objects 
FOR SELECT 
USING (bucket_id = 'hero-media');

CREATE POLICY "Admin can manage testimonial images" ON storage.objects 
FOR ALL TO authenticated 
USING (bucket_id = 'testimonial-images' AND public.is_admin_session());

CREATE POLICY "Public can view testimonial images" ON storage.objects 
FOR SELECT 
USING (bucket_id = 'testimonial-images');

CREATE POLICY "Admin can manage blog images" ON storage.objects 
FOR ALL TO authenticated 
USING (bucket_id = 'blog-images' AND public.is_admin_session());

CREATE POLICY "Public can view blog images" ON storage.objects 
FOR SELECT 
USING (bucket_id = 'blog-images');

CREATE POLICY "Admin can manage documents" ON storage.objects 
FOR ALL TO authenticated 
USING (bucket_id = 'documents' AND public.is_admin_session());

CREATE POLICY "Public can view documents" ON storage.objects 
FOR SELECT 
USING (bucket_id = 'documents');

-- Insert initial data
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
('Fresh Produce', 'fresh-produce', 'Fresh agricultural produce from Rajasthan farms', 1),
('Spices', 'spices', 'Premium quality spices and seasonings', 2),
('Nuts & Seeds', 'nuts-seeds', 'High-quality nuts and seeds for export', 3),
('Pulses', 'pulses', 'Protein-rich pulses and legumes', 4),
('Industrial', 'industrial', 'Industrial grade agricultural products', 5);

-- Insert initial content blocks
INSERT INTO public.content_blocks (key, title, content, data) VALUES
('hero_main', 'From Sriganganagar Farms to Your Doorstep', 'Premium agri-commodities from the heart of Rajasthan', '{"subtitle": "Onions, Jeera, Peanuts, Carrots, Chickpeas, Mustard & Guar Gum - packaged and graded to the highest international standards.", "stats": [{"number": "500+", "label": "Global Shipments"}, {"number": "25+", "label": "Countries Served"}, {"number": "99.8%", "label": "Quality Score"}, {"number": "24/7", "label": "Support"}]}'),
('company_info', 'About ShineVeda', 'Leading exporter of premium agricultural commodities', '{"founded": "2020", "location": "Sriganganagar, Rajasthan", "specialization": "Agricultural Exports"}'),
('contact_info', 'Contact Information', 'Get in touch with our export team', '{"phone": "+91 89551 58794", "email": "help@shineveda.in", "whatsapp": "+91 89551 58794"}');

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$;

-- Trigger to create user profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
