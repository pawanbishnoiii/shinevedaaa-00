import { useEffect } from 'react';
import { trackPageView as trackPageViewUtil, trackProductInteraction as trackProductInteractionUtil } from '@/utils/analytics';

export const useAnalytics = () => {
  const trackPageView = async (data: { page_path: string; page_title?: string }) => {
    await trackPageViewUtil(data.page_path, data.page_title);
  };

  const trackProductInteraction = async (productId: string, interactionType: 'view' | 'favorite' | 'click' | 'share' | 'inquiry') => {
    // Map click to view for database compatibility
    const mappedType = interactionType === 'click' ? 'view' : interactionType;
    const weight = interactionType === 'view' ? 1 : interactionType === 'click' ? 2 : interactionType === 'favorite' ? 3 : interactionType === 'share' ? 2 : 5;
    
    await trackProductInteractionUtil(productId, mappedType as 'view' | 'favorite' | 'share' | 'inquiry', weight);
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