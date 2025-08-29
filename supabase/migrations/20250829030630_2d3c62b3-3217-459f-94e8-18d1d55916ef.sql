-- Phase 1: Database Optimization - Add proper indexes for faster queries
-- Add indexes for product queries
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured, featured_rank) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || coalesce(description, '') || ' ' || coalesce(short_description, '')));

-- Add indexes for categories
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active, sort_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug) WHERE is_active = true;

-- Add indexes for user analytics
CREATE INDEX IF NOT EXISTS idx_user_analytics_product ON user_analytics(product_id, created_at);
CREATE INDEX IF NOT EXISTS idx_user_analytics_session ON user_analytics(session_id, created_at);

-- Add indexes for favorites
CREATE INDEX IF NOT EXISTS idx_product_favorites_user ON product_favorites(user_id, created_at);

-- Add indexes for inquiries
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status, created_at);
CREATE INDEX IF NOT EXISTS idx_inquiries_product ON inquiries(product_id, created_at);

-- Add proper foreign key constraints if missing
DO $$ 
BEGIN
    -- Add foreign key constraint for products.category_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'products_category_id_fkey' 
        AND table_name = 'products'
    ) THEN
        ALTER TABLE products 
        ADD CONSTRAINT products_category_id_fkey 
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
    END IF;
    
    -- Add foreign key constraint for product_favorites.product_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'product_favorites_product_id_fkey' 
        AND table_name = 'product_favorites'
    ) THEN
        ALTER TABLE product_favorites 
        ADD CONSTRAINT product_favorites_product_id_fkey 
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
    END IF;
END $$;