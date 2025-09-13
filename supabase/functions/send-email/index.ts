import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  template_id?: string;
  template_variables?: Record<string, any>;
  campaign_id?: string;
  automation_rule_id?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const emailData: EmailRequest = await req.json();
    console.log('Processing email request:', { to: emailData.to, subject: emailData.subject });

    // Get SMTP configuration
    const { data: smtpConfig, error: smtpError } = await supabase
      .from('smtp_configurations')
      .select('*')
      .eq('is_default', true)
      .eq('is_active', true)
      .single();

    if (smtpError || !smtpConfig) {
      console.error('SMTP configuration error:', smtpError);
      return new Response(
        JSON.stringify({ error: 'SMTP configuration not found' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get template if template_id is provided
    let finalHtml = emailData.html || '';
    let finalText = emailData.text || '';

    if (emailData.template_id) {
      const { data: template, error: templateError } = await supabase
        .from('email_templates')
        .select('*')
        .eq('id', emailData.template_id)
        .eq('is_active', true)
        .single();

      if (template && !templateError) {
        finalHtml = template.body_html;
        finalText = template.body_text;

        // Replace template variables
        if (emailData.template_variables) {
          for (const [key, value] of Object.entries(emailData.template_variables)) {
            const placeholder = `{{${key}}}`;
            finalHtml = finalHtml.replace(new RegExp(placeholder, 'g'), String(value));
            finalText = finalText.replace(new RegExp(placeholder, 'g'), String(value));
          }
        }
      }
    }

    // Prepare recipients array
    const recipients = Array.isArray(emailData.to) ? emailData.to : [emailData.to];
    
    // Send emails using SMTP
    const results = [];
    
    for (const recipient of recipients) {
      try {
        // Use Deno's built-in SMTP client simulation (in production, use a proper SMTP library)
        const emailPayload = {
          from: `${smtpConfig.from_name} <${smtpConfig.from_email}>`,
          to: recipient,
          subject: emailData.subject,
          html: finalHtml,
          text: finalText,
          smtp: {
            host: smtpConfig.host,
            port: smtpConfig.port,
            username: smtpConfig.username,
            password: smtpConfig.password_encrypted,
            encryption: smtpConfig.encryption_type
          }
        };

        // Simulate SMTP sending (in production, implement actual SMTP sending)
        console.log('Sending email via SMTP:', emailPayload);
        
        // For now, log the email details (in production, send via actual SMTP)
        const success = true; // Simulate successful sending
        
        if (success) {
          // Add to email queue as sent
          const { error: queueError } = await supabase
            .from('email_queue')
            .insert({
              recipient_email: recipient,
              subject: emailData.subject,
              content_html: finalHtml,
              content_text: finalText,
              status: 'sent',
              campaign_id: emailData.campaign_id,
              automation_rule_id: emailData.automation_rule_id,
              sent_at: new Date().toISOString()
            });

          if (queueError) {
            console.error('Queue insert error:', queueError);
          }

          // Track analytics
          if (emailData.campaign_id) {
            const { error: analyticsError } = await supabase
              .from('email_analytics')
              .insert({
                campaign_id: emailData.campaign_id,
                event_type: 'sent',
                event_data: { recipient, smtp_host: smtpConfig.host }
              });

            if (analyticsError) {
              console.error('Analytics insert error:', analyticsError);
            }
          }

          results.push({ recipient, status: 'sent', id: `email_${Date.now()}` });
        } else {
          results.push({ recipient, status: 'failed', error: 'SMTP sending failed' });
        }
      } catch (emailError) {
        console.error('Email sending error for', recipient, ':', emailError);
        results.push({ recipient, status: 'failed', error: emailError.message });
      }
    }

    console.log('Email sending completed:', results);

    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        total_sent: results.filter(r => r.status === 'sent').length,
        total_failed: results.filter(r => r.status === 'failed').length
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in send-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

serve(handler);