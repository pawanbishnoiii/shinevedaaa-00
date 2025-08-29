import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAnalytics } from '@/hooks/useAnalytics';

interface Product {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  short_description: string;
  price_range: string;
  currency: string;
}

interface RecommendationProps {
  productId: string;
  maxRecommendations?: number;
  title?: string;
}

export function ProductRecommendationEngine({ 
  productId, 
  maxRecommendations = 4,
  title = "Recommended Products"
}: RecommendationProps) {
  const { trackProductInteraction } = useAnalytics();

  // Fetch product recommendations
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['product-recommendations', productId],
    queryFn: async () => {
      // First try to get explicit recommendations
      const { data: explicitRecs } = await supabase
        .from('product_recommendations')
        .select(`
          recommended_product_id,
          recommendation_type,
          confidence_score,
          products!product_recommendations_recommended_product_id_fkey (
            id,
            name,
            slug,
            image_url,
            short_description,
            price_range,
            currency,
            is_active
          )
        `)
        .eq('product_id', productId)
        .eq('products.is_active', true)
        .order('confidence_score', { ascending: false })
        .limit(maxRecommendations);

      if (explicitRecs && explicitRecs.length > 0) {
        return explicitRecs
          .filter(rec => rec.products)
          .map(rec => ({
            ...rec.products,
            recommendation_type: rec.recommendation_type,
            confidence_score: rec.confidence_score
          }));
      }

      // Fallback to similar products from same category
      const { data: currentProduct } = await supabase
        .from('products')
        .select('category_id')
        .eq('id', productId)
        .single();

      if (!currentProduct) return [];

      const { data: similarProducts } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', currentProduct.category_id)
        .eq('is_active', true)
        .neq('id', productId)
        .limit(maxRecommendations);

      return similarProducts?.map(product => ({
        ...product,
        recommendation_type: 'similar',
        confidence_score: 0.7
      })) || [];
    },
    enabled: !!productId
  });

  const handleProductClick = (recommendedProductId: string) => {
    trackProductInteraction(recommendedProductId, 'click');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: maxRecommendations }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((product: any) => (
            <div key={product.id} className="group cursor-pointer">
              <Link
                to={`/products/${product.slug}`}
                onClick={() => handleProductClick(product.id)}
                className="block"
              >
                {/* Product Image */}
                <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4 relative">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                      <span className="text-muted-foreground font-medium">
                        {product.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  {/* Recommendation Badge */}
                  <div className="absolute top-2 right-2">
                    <Badge 
                      variant={
                        product.recommendation_type === 'related' ? 'default' :
                        product.recommendation_type === 'complementary' ? 'secondary' :
                        'outline'
                      }
                      className="text-xs"
                    >
                      {product.recommendation_type === 'related' ? '🔗 Related' :
                       product.recommendation_type === 'complementary' ? '🤝 Complementary' :
                       '📦 Similar'}
                    </Badge>
                  </div>

                  {/* Confidence Score */}
                  {product.confidence_score && product.confidence_score > 0.8 && (
                    <div className="absolute bottom-2 right-2">
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                        ⭐ Top Pick
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  {product.short_description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {product.short_description}
                    </p>
                  )}
                  
                  {product.price_range && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary">
                        {product.price_range} {product.currency || 'USD'}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* View More Button */}
        {recommendations.length >= maxRecommendations && (
          <div className="text-center mt-6">
            <Button variant="outline" asChild>
              <Link to="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Smart recommendation engine that learns from user interactions
export function useSmartRecommendations() {
  const generateRecommendations = async (productId: string) => {
    try {
      // Get user interaction patterns
      const { data: interactions } = await supabase
        .from('product_interactions')
        .select('product_id, interaction_type, weight')
        .neq('product_id', productId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (!interactions || interactions.length === 0) return [];

      // Calculate product scores based on interactions
      const productScores: { [key: string]: number } = {};
      interactions.forEach(interaction => {
        const score = interaction.weight || 1;
        productScores[interaction.product_id] = (productScores[interaction.product_id] || 0) + score;
      });

      // Get top recommended products
      const topProductIds = Object.entries(productScores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([id]) => id);

      // Save recommendations to database
      const recommendations = topProductIds.map(recommendedId => ({
        product_id: productId,
        recommended_product_id: recommendedId,
        recommendation_type: 'related',
        confidence_score: Math.min(productScores[recommendedId] / 10, 1)
      }));

      // Upsert recommendations
      await supabase
        .from('product_recommendations')
        .upsert(recommendations, { 
          onConflict: 'product_id,recommended_product_id',
          ignoreDuplicates: false 
        });

      return recommendations;
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      return [];
    }
  };

  return { generateRecommendations };
}