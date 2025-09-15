-- Create org_team_members table with proper schema
CREATE TABLE public.org_team_members (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    department TEXT,
    bio TEXT,
    email TEXT,
    phone TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    image_url TEXT,
    specializations TEXT[],
    years_experience INTEGER DEFAULT 0,
    education TEXT,
    location TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.org_team_members ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin can manage org team members" 
ON public.org_team_members 
FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());

CREATE POLICY "Anyone can view active org team members" 
ON public.org_team_members 
FOR SELECT 
USING (is_active = true);

-- Add trigger for updated_at
CREATE TRIGGER update_org_team_members_updated_at
BEFORE UPDATE ON public.org_team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add SMTP configurations table
CREATE TABLE public.smtp_configurations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    provider_name TEXT NOT NULL,
    smtp_host TEXT NOT NULL,
    smtp_port INTEGER NOT NULL DEFAULT 587,
    smtp_username TEXT NOT NULL,
    smtp_password TEXT NOT NULL,
    from_email TEXT NOT NULL,
    from_name TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for SMTP (admin only)
ALTER TABLE public.smtp_configurations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage SMTP configurations" 
ON public.smtp_configurations 
FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());

-- Add trigger for updated_at
CREATE TRIGGER update_smtp_configurations_updated_at
BEFORE UPDATE ON public.smtp_configurations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default SMTP configuration
INSERT INTO public.smtp_configurations (
    provider_name, 
    smtp_host, 
    smtp_port, 
    smtp_username, 
    smtp_password, 
    from_email, 
    from_name, 
    is_default, 
    is_active
) VALUES (
    'Hostinger',
    'smtp.hostinger.com',
    587,
    'no-reply@shineveda.com',
    'password_placeholder',
    'no-reply@shineveda.com',
    'ShineVeda',
    true,
    true
);

-- Setup pg_cron for auto-refresh (every 8 hours)
SELECT cron.schedule(
    'auto-refresh-database',
    '0 */8 * * *',
    $$
    SELECT net.http_post(
        url := 'https://zlylzlmavxhgbjxuuseo.supabase.co/functions/v1/auto-refresh',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpseWx6bG1hdnhoZ2JqeHV1c2VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNTM2MTIsImV4cCI6MjA3MTkyOTYxMn0.2xX1w3cMr_bsRyPROFXE7UwcOr5rJsWA7CYjzBuCPXw"}'::jsonb,
        body := '{}'::jsonb
    );
    $$
);

-- Insert some sample team members
INSERT INTO public.org_team_members (name, position, department, bio, email, phone, location, years_experience, is_featured, sort_order) VALUES
('Rajesh Kumar', 'Chief Executive Officer', 'Leadership', 'Leading ShineVeda with over 15 years of experience in agricultural exports and sustainable farming practices.', 'rajesh@shineveda.com', '+91 98765 43210', 'Sri Ganganagar, Rajasthan', 15, true, 1),
('Priya Sharma', 'Quality Control Manager', 'Quality Control', 'Ensuring the highest quality standards in all our agricultural products with advanced testing and certification processes.', 'priya@shineveda.com', '+91 98765 43211', 'Sri Ganganagar, Rajasthan', 8, true, 2),
('Amit Singh', 'Operations Director', 'Operations', 'Overseeing all operational activities from procurement to export with focus on efficiency and sustainability.', 'amit@shineveda.com', '+91 98765 43212', 'Sri Ganganagar, Rajasthan', 12, true, 3);