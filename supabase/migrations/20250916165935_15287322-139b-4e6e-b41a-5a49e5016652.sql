-- Enable pg_cron and pg_net extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create default automation rule for subscription_confirmed if none exists
INSERT INTO public.email_automation_rules (
  name,
  trigger_type,
  template_id,
  delay_minutes,
  is_active,
  trigger_conditions
)
SELECT 
  'Welcome Email for New Subscribers',
  'subscription_confirmed',
  (SELECT id FROM public.email_templates WHERE template_key = 'welcome_subscriber' AND is_active = true LIMIT 1),
  0,
  true,
  '{}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.email_automation_rules 
  WHERE trigger_type = 'subscription_confirmed' AND is_active = true
);

-- Create welcome email template if none exists
INSERT INTO public.email_templates (
  template_key,
  subject,
  body_html,
  body_text,
  category,
  is_active,
  variables
)
SELECT 
  'welcome_subscriber',
  'Welcome to ShineVeda - Premium Agricultural Exports',
  '<h1>Welcome to ShineVeda!</h1>
  <p>Dear {{user_name}},</p>
  <p>Thank you for subscribing to our newsletter. You will now receive the latest updates about our premium agricultural products and farming insights.</p>
  <p>We export high-quality agricultural commodities from Sri Ganganagar, Rajasthan to markets worldwide.</p>
  <p>If you have any questions, feel free to contact us at {{support_email}}</p>
  <p>Best regards,<br>The ShineVeda Team</p>',
  'Dear {{user_name}},

Thank you for subscribing to our newsletter. You will now receive the latest updates about our premium agricultural products and farming insights.

We export high-quality agricultural commodities from Sri Ganganagar, Rajasthan to markets worldwide.

If you have any questions, feel free to contact us at {{support_email}}

Best regards,
The ShineVeda Team',
  'automation',
  true,
  '{"user_name": "Subscriber name", "support_email": "Support email address"}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.email_templates 
  WHERE template_key = 'welcome_subscriber'
);

-- Schedule auto-refresh cron job for every 8 hours (replace existing if any)
SELECT cron.unschedule('auto-refresh-8h');
SELECT cron.schedule(
  'auto-refresh-8h',
  '0 */8 * * *',
  $$
  SELECT net.http_post(
    url := 'https://zlylzlmavxhgbjxuuseo.supabase.co/functions/v1/auto-refresh',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpseWx6bG1hdnhoZ2JqeHV1c2VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNTM2MTIsImV4cCI6MjA3MTkyOTYxMn0.2xX1w3cMr_bsRyPROFXE7UwcOr5rJsWA7CYjzBuCPXw"}'::jsonb,
    body := '{}'::jsonb
  ) as request_id;
  $$
);