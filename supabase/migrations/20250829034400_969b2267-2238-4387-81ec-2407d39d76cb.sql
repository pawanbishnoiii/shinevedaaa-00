-- Phase 1: Database optimizations and indexes for better performance
-- Add proper indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_products_active_featured ON products(is_active, is_featured, featured_rank, sort_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_inquiries_status_created ON inquiries(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_product ON inquiries(product_id) WHERE product_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active, sort_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_testimonials_active_featured ON testimonials(is_active, is_featured, sort_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_content_blocks_active ON content_blocks(is_active, key) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_footer_pages_active ON footer_pages(is_active, sort_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_analytics_created ON user_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_interactions_product ON product_interactions(product_id, created_at DESC);

-- Enable pg_cron extension for auto-refresh
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create cron job for database warmup (runs every 5 minutes)
SELECT cron.schedule(
    'database-warmup',
    '*/5 * * * *',
    'SELECT public.keep_database_warm();'
);

-- Create enhanced media tracking table for better file management
CREATE TABLE IF NOT EXISTS media_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_id UUID REFERENCES media(id) ON DELETE CASCADE,
    used_in_table TEXT NOT NULL,
    used_in_id UUID NOT NULL,
    used_in_field TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for media_usage
ALTER TABLE media_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage media usage" ON media_usage
    FOR ALL USING (is_admin());

CREATE POLICY "Anyone can view media usage" ON media_usage
    FOR SELECT USING (true);

-- Create product recommendation system table
CREATE TABLE IF NOT EXISTS product_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    recommended_product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    recommendation_type TEXT DEFAULT 'related' CHECK (recommendation_type IN ('related', 'complementary', 'similar')),
    confidence_score DECIMAL(3,2) DEFAULT 0.5 CHECK (confidence_score >= 0 AND confidence_score <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(product_id, recommended_product_id)
);

-- Add RLS policies for product recommendations
ALTER TABLE product_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage product recommendations" ON product_recommendations
    FOR ALL USING (is_admin());

CREATE POLICY "Anyone can view product recommendations" ON product_recommendations
    FOR SELECT USING (true);

-- Create enhanced analytics tracking
CREATE TABLE IF NOT EXISTS page_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_path TEXT NOT NULL,
    page_title TEXT,
    visitor_id TEXT,
    session_id TEXT,
    user_agent TEXT,
    referrer TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT,
    bounce_rate DECIMAL(5,2),
    time_on_page INTEGER, -- seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for page analytics
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can read page analytics" ON page_analytics
    FOR SELECT USING (is_admin());

CREATE POLICY "Anyone can insert page analytics" ON page_analytics
    FOR INSERT WITH CHECK (true);

-- Add indexes for analytics
CREATE INDEX IF NOT EXISTS idx_page_analytics_path_created ON page_analytics(page_path, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_analytics_session ON page_analytics(session_id, created_at DESC);

-- Create email templates table for automated responses
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_key TEXT UNIQUE NOT NULL,
    subject TEXT NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT NOT NULL,
    variables JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for email templates
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage email templates" ON email_templates
    FOR ALL USING (is_admin());

CREATE POLICY "Anyone can view active email templates" ON email_templates
    FOR SELECT USING (is_active = true);