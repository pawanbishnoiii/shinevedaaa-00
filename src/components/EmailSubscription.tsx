import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, CheckCircle } from 'lucide-react';

interface EmailSubscriptionProps {
  className?: string;
  placeholder?: string;
  buttonText?: string;
  showIcon?: boolean;
}

export const EmailSubscription: React.FC<EmailSubscriptionProps> = ({
  className = "",
  placeholder = "Enter your email address",
  buttonText = "Subscribe",
  showIcon = true
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check if email already exists
      const { data: existing } = await supabase
        .from('newsletter_subscriptions')
        .select('id, status')
        .eq('email', email)
        .single();

      if (existing) {
        if (existing.status === 'active') {
          toast({
            title: "Already Subscribed",
            description: "This email is already subscribed to our newsletter.",
            variant: "default",
          });
          setIsSubscribed(true);
          return;
        }
      }

      // Subscribe to newsletter
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .upsert({
          email,
          status: 'active',
          subscription_source: 'website',
          confirmed_at: new Date().toISOString(),
          metadata: {
            subscribed_from_page: window.location.pathname,
            user_agent: navigator.userAgent
          }
        });

      if (error) {
        throw error;
      }

      // Trigger welcome email automation
      try {
        await supabase.functions.invoke('email-automation', {
          body: {
            trigger_type: 'subscription_confirmed',
            trigger_data: {
              email,
              subscription_source: 'website',
              subscribed_at: new Date().toISOString()
            }
          }
        });
      } catch (automationError) {
        console.error('Automation trigger failed:', automationError);
        // Don't fail the subscription if automation fails
      }

      setIsSubscribed(true);
      setEmail('');
      
      toast({
        title: "Successfully Subscribed!",
        description: "Thank you for subscribing to our newsletter. You'll receive updates about our latest products and farming insights.",
        variant: "default",
      });

    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription Failed",
        description: "There was an error subscribing you to our newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className={`flex items-center justify-center p-6 bg-primary/5 rounded-lg border border-primary/20 ${className}`}>
        <CheckCircle className="w-5 h-5 text-primary mr-2" />
        <span className="text-primary font-medium">Thank you for subscribing!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubscribe} className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          {showIcon && (
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          )}
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className={showIcon ? "pl-10" : ""}
            required
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || !email}
          className="whitespace-nowrap"
        >
          {isLoading ? "Subscribing..." : buttonText}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        By subscribing, you agree to receive marketing emails from ShineVeda. 
        You can unsubscribe at any time.
      </p>
    </form>
  );
};