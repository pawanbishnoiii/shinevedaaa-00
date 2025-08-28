import { supabase } from '@/integrations/supabase/client';

// Generate session ID for tracking
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get or create session ID
export const getSessionId = () => {
  let sessionId = localStorage.getItem('shineveda_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('shineveda_session_id', sessionId);
  }
  return sessionId;
};

// Track page view
export const trackPageView = async (pageUrl: string, pageTitle?: string) => {
  try {
    const sessionId = getSessionId();
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.from('user_analytics').insert({
      event_type: 'page_view',
      page_url: pageUrl,
      page_title: pageTitle || document.title,
      user_id: user?.id || null,
      session_id: sessionId,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      device: getMobileOperatingSystem()
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

// Track product interaction
export const trackProductInteraction = async (
  productId: string, 
  interactionType: 'view' | 'favorite' | 'share' | 'inquiry',
  weight: number = 1
) => {
  try {
    const sessionId = getSessionId();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Track in product_interactions table
    await supabase.from('product_interactions').insert({
      product_id: productId,
      interaction_type: interactionType === 'share' ? 'view' : interactionType as 'view' | 'favorite' | 'inquiry',
      user_id: user?.id || null,
      session_id: sessionId,
      weight: interactionType === 'share' ? 2 : weight
    });

    // Also track in user_analytics for general analytics
    await supabase.from('user_analytics').insert({
      event_type: `product_${interactionType}`,
      product_id: productId,
      user_id: user?.id || null,
      session_id: sessionId,
      page_url: window.location.href,
      user_agent: navigator.userAgent,
      device: getMobileOperatingSystem()
    });
  } catch (error) {
    console.error('Error tracking product interaction:', error);
  }
};

// Track custom event
export const trackEvent = async (eventType: string, metadata?: any) => {
  try {
    const sessionId = getSessionId();
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.from('user_analytics').insert({
      event_type: eventType,
      user_id: user?.id || null,
      session_id: sessionId,
      page_url: window.location.href,
      user_agent: navigator.userAgent,
      device: getMobileOperatingSystem(),
      // Store additional metadata as JSON if needed
      ...(metadata && { metadata })
    });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

// Get user's recommendations based on interaction history
export const getUserRecommendations = async (limit = 6) => {
  try {
    const sessionId = getSessionId();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.id) {
      // For anonymous users, get popular products
      const { data: popularProducts } = await supabase
        .from('products')
        .select(`
          *,
          categories:category_id (
            name,
            slug
          )
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .limit(limit);
      
      return popularProducts || [];
    }

    // Get user's interaction history to find preferences
    const { data: interactions } = await supabase
      .from('product_interactions')
      .select('product_id, interaction_type, weight')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!interactions || interactions.length === 0) {
      // No interaction history, return featured products
      const { data: featuredProducts } = await supabase
        .from('products')
        .select(`
          *,
          categories:category_id (
            name,
            slug
          )
        `)
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('sort_order', { ascending: true })
        .limit(limit);
      
      return featuredProducts || [];
    }

    // Calculate product scores based on interactions
    const productScores: { [key: string]: number } = {};
    interactions.forEach(interaction => {
      const baseScore = productScores[interaction.product_id] || 0;
      let scoreBonus = 0;
      
      switch (interaction.interaction_type) {
        case 'view': scoreBonus = 1; break;
        case 'favorite': scoreBonus = 5; break;
        case 'inquiry': scoreBonus = 10; break;
        default: scoreBonus = 1; break;
      }
      
      productScores[interaction.product_id] = baseScore + (scoreBonus * interaction.weight);
    });

    // Get top interacted product IDs
    const topProductIds = Object.entries(productScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, Math.ceil(limit / 2))
      .map(([productId]) => productId);

    // Get these products and their categories to find similar ones
      const { data: topProducts } = await supabase
        .from('products')
        .select(`
          *,
          categories:category_id (
            name,
            slug
          )
        `)
      .in('id', topProductIds)
      .eq('is_active', true);

    if (!topProducts || topProducts.length === 0) {
      return [];
    }

    // Get category IDs for finding similar products
    const categoryIds = topProducts
      .map(p => p.category_id)
      .filter(Boolean);

    // Get more products from same categories
      const { data: similarProducts } = await supabase
        .from('products')
        .select(`
          *,
          categories:category_id (
            name,
            slug
          )
        `)
      .in('category_id', categoryIds)
      .eq('is_active', true)
      .not('id', 'in', `(${topProductIds.join(',')})`)
      .limit(limit);

    // Combine and return unique products
    const combinedProducts = [...topProducts, ...(similarProducts || [])];
    const uniqueProducts = combinedProducts.filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    );

    return uniqueProducts.slice(0, limit);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return [];
  }
};

// Utility function to detect mobile OS
function getMobileOperatingSystem() {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return "iOS";
  }

  return "Desktop";
}