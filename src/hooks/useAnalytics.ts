import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsEvent {
  page_path: string;
  page_title?: string;
  visitor_id?: string;
  session_id?: string;
  user_agent?: string;
  referrer?: string;
  country?: string;
  city?: string;
  device_type?: string;
  time_on_page?: number;
}

export const useAnalytics = () => {
  const trackPageView = async (data: AnalyticsEvent) => {
    try {
      // Generate session ID if not provided
      if (!data.session_id) {
        data.session_id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }

      // Get device type from user agent
      if (!data.device_type && navigator.userAgent) {
        const ua = navigator.userAgent;
        if (/Mobile|Android|iPhone|iPad/.test(ua)) {
          data.device_type = 'mobile';
        } else if (/Tablet|iPad/.test(ua)) {
          data.device_type = 'tablet';
        } else {
          data.device_type = 'desktop';
        }
      }

      // Set default values
      const analyticsData = {
        ...data,
        page_title: data.page_title || document.title,
        user_agent: data.user_agent || navigator.userAgent,
        referrer: data.referrer || document.referrer,
        visitor_id: data.visitor_id || localStorage.getItem('visitor_id') || `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      // Store visitor ID in localStorage
      if (!localStorage.getItem('visitor_id')) {
        localStorage.setItem('visitor_id', analyticsData.visitor_id);
      }

      await supabase
        .from('page_analytics')
        .insert(analyticsData);
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  };

  const trackProductInteraction = async (productId: string, interactionType: 'view' | 'favorite') => {
    try {
      const sessionId = localStorage.getItem('session_id') || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('session_id', sessionId);

      await supabase
        .from('product_interactions')
        .insert({
          product_id: productId,
          interaction_type: interactionType,
          session_id: sessionId,
          weight: interactionType === 'view' ? 1 : interactionType === 'click' ? 2 : interactionType === 'favorite' ? 3 : 2
        });
    } catch (error) {
      console.error('Failed to track product interaction:', error);
    }
  };

  return {
    trackPageView,
    trackProductInteraction
  };
};

// Auto-track page views
export const usePageTracking = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    const trackCurrentPage = () => {
      trackPageView({
        page_path: window.location.pathname,
        page_title: document.title
      });
    };

    // Track initial page load
    trackCurrentPage();

    // Track page changes (for SPA)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(trackCurrentPage, 100);
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(trackCurrentPage, 100);
    };

    window.addEventListener('popstate', trackCurrentPage);

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', trackCurrentPage);
    };
  }, [trackPageView]);
};