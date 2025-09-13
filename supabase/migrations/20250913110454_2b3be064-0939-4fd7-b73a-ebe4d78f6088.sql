-- Phase 1: Fix Critical Security Issues & Phase 2-7: Complete Email System Implementation

-- Fix function search paths for existing functions
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_blog_view_count(post_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.agri_blog_posts 
  SET view_count = view_count + 1 
  WHERE slug = post_slug AND is_active = true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_download_count(resource_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.downloadable_resources 
  SET download_count = download_count + 1 
  WHERE id = resource_id;
END;
$function$;

-- Enable RLS on tables that don't have it
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for orders
CREATE POLICY "Admin can manage orders" ON public.orders
  FOR ALL USING (is_admin());

CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policies for email_subscribers
CREATE POLICY "Admin can manage email subscribers" ON public.email_subscribers
  FOR ALL USING (is_admin());

CREATE POLICY "Anyone can subscribe" ON public.email_subscribers
  FOR INSERT WITH CHECK (true);

-- Email Campaign Management Tables
CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  template_id uuid REFERENCES email_templates(id),
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sending', 'sent', 'paused')),
  recipient_type text DEFAULT 'all' CHECK (recipient_type IN ('all', 'subscribers', 'users', 'custom')),
  recipient_filters jsonb DEFAULT '{}',
  scheduled_at timestamp with time zone,
  sent_at timestamp with time zone,
  total_recipients integer DEFAULT 0,
  delivered_count integer DEFAULT 0,
  opened_count integer DEFAULT 0,
  clicked_count integer DEFAULT 0,
  bounced_count integer DEFAULT 0,
  unsubscribed_count integer DEFAULT 0,
  created_by uuid REFERENCES profiles(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage campaigns" ON public.email_campaigns
  FOR ALL USING (is_admin());

-- Email Campaign Recipients Tracking
CREATE TABLE IF NOT EXISTS public.email_campaign_recipients (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id uuid NOT NULL REFERENCES email_campaigns(id) ON DELETE CASCADE,
  recipient_email text NOT NULL,
  recipient_type text NOT NULL,
  recipient_id uuid,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'unsubscribed')),
  sent_at timestamp with time zone,
  delivered_at timestamp with time zone,
  opened_at timestamp with time zone,
  clicked_at timestamp with time zone,
  bounced_at timestamp with time zone,
  unsubscribed_at timestamp with time zone,
  tracking_id uuid DEFAULT gen_random_uuid(),
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.email_campaign_recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage campaign recipients" ON public.email_campaign_recipients
  FOR ALL USING (is_admin());

-- Email Analytics Table
CREATE TABLE IF NOT EXISTS public.email_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id uuid REFERENCES email_campaigns(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES email_campaign_recipients(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'unsubscribed')),
  event_data jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.email_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage email analytics" ON public.email_analytics
  FOR ALL USING (is_admin());

-- SMTP Settings Table (encrypted)
CREATE TABLE IF NOT EXISTS public.smtp_configurations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL DEFAULT 'Default SMTP',
  host text NOT NULL,
  port integer NOT NULL,
  username text NOT NULL,
  password_encrypted text NOT NULL,
  encryption_type text NOT NULL CHECK (encryption_type IN ('SSL', 'TLS', 'NONE')),
  from_email text NOT NULL,
  from_name text NOT NULL,
  is_active boolean DEFAULT true,
  is_default boolean DEFAULT false,
  test_sent_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.smtp_configurations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage SMTP configurations" ON public.smtp_configurations
  FOR ALL USING (is_admin());

-- Newsletter Subscriptions with better tracking
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  name text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  subscription_source text DEFAULT 'website',
  preferences jsonb DEFAULT '{}',
  confirmed_at timestamp with time zone,
  unsubscribed_at timestamp with time zone,
  unsubscribe_token uuid DEFAULT gen_random_uuid(),
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage newsletter subscriptions" ON public.newsletter_subscriptions
  FOR ALL USING (is_admin());

CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscriptions
  FOR INSERT WITH CHECK (true);

-- Email Automation Rules
CREATE TABLE IF NOT EXISTS public.email_automation_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  trigger_type text NOT NULL CHECK (trigger_type IN ('user_signup', 'inquiry_received', 'subscription_confirmed', 'order_placed', 'time_based')),
  trigger_conditions jsonb DEFAULT '{}',
  template_id uuid REFERENCES email_templates(id),
  delay_minutes integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.email_automation_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage automation rules" ON public.email_automation_rules
  FOR ALL USING (is_admin());

-- Email Queue for processing
CREATE TABLE IF NOT EXISTS public.email_queue (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_email text NOT NULL,
  subject text NOT NULL,
  content_html text NOT NULL,
  content_text text,
  template_variables jsonb DEFAULT '{}',
  priority integer DEFAULT 5,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed', 'retrying')),
  scheduled_for timestamp with time zone DEFAULT now(),
  attempts integer DEFAULT 0,
  max_attempts integer DEFAULT 3,
  last_error text,
  campaign_id uuid REFERENCES email_campaigns(id),
  automation_rule_id uuid REFERENCES email_automation_rules(id),
  sent_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage email queue" ON public.email_queue
  FOR ALL USING (is_admin());

-- Enhanced email templates with versioning
ALTER TABLE public.email_templates 
ADD COLUMN IF NOT EXISTS version integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS parent_template_id uuid REFERENCES email_templates(id),
ADD COLUMN IF NOT EXISTS preview_text text,
ADD COLUMN IF NOT EXISTS preheader text,
ADD COLUMN IF NOT EXISTS category text DEFAULT 'general',
ADD COLUMN IF NOT EXISTS design_data jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS test_data jsonb DEFAULT '{}';

-- System settings for dynamic admin configuration
CREATE TABLE IF NOT EXISTS public.system_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL,
  setting_key text NOT NULL,
  setting_value text,
  setting_type text DEFAULT 'text' CHECK (setting_type IN ('text', 'number', 'boolean', 'json', 'email', 'url')),
  is_encrypted boolean DEFAULT false,
  description text,
  validation_rules jsonb DEFAULT '{}',
  is_public boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(category, setting_key)
);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage system settings" ON public.system_settings
  FOR ALL USING (is_admin());

CREATE POLICY "Anyone can view public settings" ON public.system_settings
  FOR SELECT USING (is_public = true);

-- Insert default SMTP configuration
INSERT INTO public.smtp_configurations (
  name, host, port, username, password_encrypted, encryption_type, 
  from_email, from_name, is_default
) VALUES (
  'Hostinger SMTP',
  'smtp.hostinger.com',
  465,
  'help@shineveda.in',
  'Bnoy@2900', -- This should be encrypted in production
  'SSL',
  'help@shineveda.in',
  'ShineVeda Support',
  true
) ON CONFLICT DO NOTHING;

-- Insert default system settings
INSERT INTO public.system_settings (category, setting_key, setting_value, setting_type, description, is_public) VALUES
('email', 'newsletter_enabled', 'true', 'boolean', 'Enable/disable newsletter subscriptions', true),
('email', 'welcome_email_enabled', 'true', 'boolean', 'Send welcome email to new subscribers', false),
('email', 'inquiry_notification_enabled', 'true', 'boolean', 'Send email notifications for new inquiries', false),
('email', 'max_emails_per_hour', '100', 'number', 'Maximum emails to send per hour', false),
('general', 'site_maintenance', 'false', 'boolean', 'Enable maintenance mode', true),
('general', 'allow_registrations', 'true', 'boolean', 'Allow new user registrations', false),
('seo', 'meta_title', 'ShineVeda - Premium Agricultural Products', 'text', 'Default meta title', true),
('seo', 'meta_description', 'Leading exporter of premium agricultural products from India', 'text', 'Default meta description', true)
ON CONFLICT (category, setting_key) DO NOTHING;

-- Create triggers for updated_at
CREATE TRIGGER update_email_campaigns_updated_at
  BEFORE UPDATE ON public.email_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_smtp_configurations_updated_at
  BEFORE UPDATE ON public.smtp_configurations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_newsletter_subscriptions_updated_at
  BEFORE UPDATE ON public.newsletter_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_email_automation_rules_updated_at
  BEFORE UPDATE ON public.email_automation_rules
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_email_queue_updated_at
  BEFORE UPDATE ON public.email_queue
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON public.email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_scheduled_at ON public.email_campaigns(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_email_campaign_recipients_campaign_id ON public.email_campaign_recipients(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_campaign_recipients_status ON public.email_campaign_recipients(status);
CREATE INDEX IF NOT EXISTS idx_email_analytics_campaign_id ON public.email_analytics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_analytics_event_type ON public.email_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_email ON public.newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_status ON public.newsletter_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON public.email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_scheduled_for ON public.email_queue(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON public.system_settings(category);
CREATE INDEX IF NOT EXISTS idx_system_settings_category_key ON public.system_settings(category, setting_key);