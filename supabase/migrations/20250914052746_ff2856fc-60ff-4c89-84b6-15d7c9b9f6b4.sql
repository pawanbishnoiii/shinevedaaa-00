-- Create team_members table for dynamic team management
CREATE TABLE public.team_members (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    department TEXT,
    bio TEXT,
    image_url TEXT,
    email TEXT,
    phone TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    specializations TEXT[],
    years_experience INTEGER,
    education TEXT,
    location TEXT,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    joined_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create policies for team members
CREATE POLICY "Admin can manage team members" 
ON public.team_members 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Anyone can view active team members" 
ON public.team_members 
FOR SELECT 
USING (is_active = true);

-- Create email_templates_advanced table for template builder
CREATE TABLE public.email_templates_advanced (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    template_key TEXT NOT NULL UNIQUE,
    category TEXT DEFAULT 'general',
    subject TEXT NOT NULL,
    preheader TEXT,
    html_content TEXT NOT NULL,
    text_content TEXT NOT NULL,
    thumbnail_url TEXT,
    design_config JSONB DEFAULT '{}',
    variables JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    is_system_template BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_templates_advanced ENABLE ROW LEVEL SECURITY;

-- Create policies for advanced email templates
CREATE POLICY "Admin can manage advanced email templates" 
ON public.email_templates_advanced 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Anyone can view active advanced email templates" 
ON public.email_templates_advanced 
FOR SELECT 
USING (is_active = true);

-- Create system_settings table for auto-refresh and dynamic configurations
CREATE TABLE public.system_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type TEXT DEFAULT 'text',
    category TEXT DEFAULT 'general',
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    validation_rules JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for system settings
CREATE POLICY "Admin can manage system settings" 
ON public.system_settings 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Anyone can view public system settings" 
ON public.system_settings 
FOR SELECT 
USING (is_public = true AND is_active = true);

-- Insert default system settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, category, description, is_active) VALUES
('auto_refresh_interval', '8', 'number', 'system', 'Auto-refresh interval in hours', true),
('enable_auto_refresh', 'true', 'boolean', 'system', 'Enable automatic database refresh', true),
('bulk_email_batch_size', '100', 'number', 'email', 'Batch size for bulk email sending', true),
('email_rate_limit', '1000', 'number', 'email', 'Email rate limit per hour', true),
('maintenance_mode', 'false', 'boolean', 'system', 'Enable maintenance mode', true),
('site_analytics_enabled', 'true', 'boolean', 'analytics', 'Enable site analytics tracking', true),
('max_upload_size', '10', 'number', 'media', 'Maximum file upload size in MB', true),
('allowed_file_types', 'jpg,jpeg,png,gif,pdf,doc,docx', 'text', 'media', 'Allowed file upload types', true);

-- Insert default team members
INSERT INTO public.team_members (name, position, department, bio, specializations, years_experience, is_featured, sort_order) VALUES
('Rajesh Kumar', 'Managing Director', 'Leadership', 'Visionary leader with over 15 years of experience in agricultural exports and international trade.', ARRAY['Agricultural Exports', 'International Trade', 'Business Development'], 15, true, 1),
('Priya Sharma', 'Quality Assurance Manager', 'Quality Control', 'Expert in food safety standards and quality management systems with international certifications.', ARRAY['Quality Control', 'Food Safety', 'HACCP', 'ISO Standards'], 12, true, 2),
('Vikram Singh', 'Operations Head', 'Operations', 'Streamlines logistics and supply chain operations to ensure timely and efficient deliveries.', ARRAY['Supply Chain', 'Logistics', 'Operations Management'], 10, true, 3),
('Anita Patel', 'Export Manager', 'Sales & Marketing', 'Specializes in international market development and maintains relationships with global clients.', ARRAY['Export Management', 'International Relations', 'Market Development'], 8, true, 4);

-- Insert default email templates
INSERT INTO public.email_templates_advanced (name, template_key, category, subject, html_content, text_content, design_config, variables) VALUES
('Welcome Email', 'welcome_subscriber', 'subscription', 'Welcome to ShineVeda Newsletter!', 
'<html><body><h1>Welcome {{name}}!</h1><p>Thank you for subscribing to our newsletter.</p></body></html>',
'Welcome {{name}}! Thank you for subscribing to our newsletter.',
'{"theme": "modern", "primaryColor": "#16a34a", "fontFamily": "Arial"}',
'{"name": "Subscriber Name", "email": "Subscriber Email"}'),

('Inquiry Confirmation', 'inquiry_confirmation', 'inquiry', 'We received your inquiry - {{inquiry_number}}',
'<html><body><h1>Inquiry Received</h1><p>Dear {{name}}, we have received your inquiry {{inquiry_number}} and will respond within 24 hours.</p></body></html>',
'Dear {{name}}, we have received your inquiry {{inquiry_number}} and will respond within 24 hours.',
'{"theme": "professional", "primaryColor": "#059669", "fontFamily": "Georgia"}',
'{"name": "Customer Name", "inquiry_number": "Inquiry Number", "product": "Product Name"}'),

('Monthly Newsletter', 'monthly_newsletter', 'newsletter', 'ShineVeda Monthly Newsletter - {{month}} {{year}}',
'<html><body><h1>Monthly Update</h1><p>Latest news and updates from ShineVeda for {{month}} {{year}}.</p></body></html>',
'Monthly Update: Latest news and updates from ShineVeda for {{month}} {{year}}.',
'{"theme": "newsletter", "primaryColor": "#16a34a", "fontFamily": "Arial"}',
'{"month": "Month Name", "year": "Year", "featured_products": "Product List"}');

-- Add updated_at trigger for team_members
CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON public.team_members
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add updated_at trigger for email_templates_advanced
CREATE TRIGGER update_email_templates_advanced_updated_at
    BEFORE UPDATE ON public.email_templates_advanced
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add updated_at trigger for system_settings
CREATE TRIGGER update_system_settings_updated_at
    BEFORE UPDATE ON public.system_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create auto refresh function for database maintenance
CREATE OR REPLACE FUNCTION public.auto_refresh_database()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Keep database connections active
    PERFORM public.keep_database_warm();
    
    -- Update system refresh time
    INSERT INTO public.system_settings (setting_key, setting_value, category, description)
    VALUES ('last_auto_refresh', NOW()::text, 'system', 'Last automatic database refresh time')
    ON CONFLICT (setting_key) 
    DO UPDATE SET 
        setting_value = NOW()::text,
        updated_at = NOW();
    
    -- Log the refresh activity
    INSERT INTO public.activity_logs (activity_type, description, metadata)
    VALUES ('auto_refresh', 'Scheduled database refresh completed', 
            jsonb_build_object('timestamp', NOW(), 'type', 'scheduled_refresh'));
END;
$$;

-- Create indexes for better performance
CREATE INDEX idx_team_members_active ON public.team_members(is_active);
CREATE INDEX idx_team_members_featured ON public.team_members(is_featured);
CREATE INDEX idx_team_members_sort_order ON public.team_members(sort_order);
CREATE INDEX idx_email_templates_advanced_category ON public.email_templates_advanced(category);
CREATE INDEX idx_email_templates_advanced_active ON public.email_templates_advanced(is_active);
CREATE INDEX idx_system_settings_category ON public.system_settings(category);
CREATE INDEX idx_system_settings_public ON public.system_settings(is_public);