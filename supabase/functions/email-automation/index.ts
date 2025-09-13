import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AutomationTrigger {
  trigger_type: 'user_signup' | 'inquiry_received' | 'subscription_confirmed' | 'order_placed' | 'time_based';
  trigger_data: Record<string, any>;
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

    const { trigger_type, trigger_data }: AutomationTrigger = await req.json();
    
    console.log('Processing automation trigger:', { trigger_type, trigger_data });

    // Get active automation rules for this trigger type
    const { data: rules, error: rulesError } = await supabase
      .from('email_automation_rules')
      .select('*')
      .eq('trigger_type', trigger_type)
      .eq('is_active', true);

    if (rulesError || !rules?.length) {
      console.log('No active automation rules found for trigger:', trigger_type);
      return new Response(
        JSON.stringify({ message: 'No automation rules found', trigger_type }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = [];

    for (const rule of rules) {
      try {
        // Check if conditions match (if any)
        const conditionsMet = checkTriggerConditions(rule.trigger_conditions, trigger_data);
        
        if (!conditionsMet) {
          console.log('Conditions not met for rule:', rule.name);
          continue;
        }

        // Get email template
        const { data: template, error: templateError } = await supabase
          .from('email_templates')
          .select('*')
          .eq('id', rule.template_id)
          .eq('is_active', true)
          .single();

        if (templateError || !template) {
          console.error('Template not found for rule:', rule.name, templateError);
          continue;
        }

        // Determine recipient email
        const recipientEmail = getRecipientEmail(trigger_type, trigger_data);
        
        if (!recipientEmail) {
          console.error('Could not determine recipient email for trigger:', trigger_type);
          continue;
        }

        // Calculate scheduled time (current time + delay)
        const scheduledFor = new Date();
        scheduledFor.setMinutes(scheduledFor.getMinutes() + (rule.delay_minutes || 0));

        // Prepare template variables
        const templateVariables = {
          ...trigger_data,
          user_name: trigger_data.name || trigger_data.user_name || 'User',
          site_url: 'https://shineveda.in',
          company_name: 'ShineVeda',
          support_email: 'help@shineveda.in'
        };

        // Add to email queue
        const { data: queueItem, error: queueError } = await supabase
          .from('email_queue')
          .insert({
            recipient_email: recipientEmail,
            subject: template.subject,
            content_html: template.body_html,
            content_text: template.body_text,
            template_variables: templateVariables,
            scheduled_for: scheduledFor.toISOString(),
            automation_rule_id: rule.id,
            priority: getPriority(trigger_type)
          })
          .select()
          .single();

        if (queueError) {
          console.error('Error adding to email queue:', queueError);
          results.push({ rule: rule.name, status: 'failed', error: queueError.message });
        } else {
          console.log('Email queued successfully:', { rule: rule.name, recipient: recipientEmail, scheduled_for: scheduledFor });
          results.push({ rule: rule.name, status: 'queued', queue_id: queueItem.id });

          // If no delay, send immediately
          if ((rule.delay_minutes || 0) === 0) {
            await sendQueuedEmail(supabase, queueItem.id);
          }
        }

      } catch (ruleError) {
        console.error('Error processing rule:', rule.name, ruleError);
        results.push({ rule: rule.name, status: 'failed', error: ruleError.message });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        trigger_type,
        processed_rules: results.length,
        results 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in email-automation function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

function checkTriggerConditions(conditions: any, triggerData: any): boolean {
  if (!conditions || Object.keys(conditions).length === 0) {
    return true; // No conditions means always trigger
  }

  // Implement condition checking logic
  for (const [key, expectedValue] of Object.entries(conditions)) {
    if (triggerData[key] !== expectedValue) {
      return false;
    }
  }

  return true;
}

function getRecipientEmail(triggerType: string, triggerData: any): string | null {
  switch (triggerType) {
    case 'user_signup':
      return triggerData.email || triggerData.user_email;
    case 'inquiry_received':
      return triggerData.email || triggerData.contact_email;
    case 'subscription_confirmed':
      return triggerData.email || triggerData.subscriber_email;
    case 'order_placed':
      return triggerData.customer_email || triggerData.email;
    default:
      return triggerData.email;
  }
}

function getPriority(triggerType: string): number {
  switch (triggerType) {
    case 'user_signup':
      return 1; // High priority
    case 'inquiry_received':
      return 1; // High priority
    case 'subscription_confirmed':
      return 3; // Medium priority
    case 'order_placed':
      return 2; // High-medium priority
    default:
      return 5; // Normal priority
  }
}

async function sendQueuedEmail(supabase: any, queueId: string) {
  try {
    // Call the send-email function
    const { error } = await supabase.functions.invoke('send-email', {
      body: { queue_id: queueId }
    });

    if (error) {
      console.error('Error sending queued email:', error);
    }
  } catch (error) {
    console.error('Error invoking send-email function:', error);
  }
}

serve(handler);