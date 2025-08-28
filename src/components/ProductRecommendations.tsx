import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';
import { getUserRecommendations } from '@/utils/analytics';

interface ProductRecommendationsProps {
  title?: string;
  limit?: number;
  excludeProductId?: string;
}

const ProductRecommendations = ({ 
  title = "Recommended for You", 
  limit = 6,
  excludeProductId 
}: ProductRecommendationsProps) => {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['product-recommendations', limit, excludeProductId],
    queryFn: async () => {
      const products = await getUserRecommendations(limit + (excludeProductId ? 1 : 0));
      
      // Filter out the current product if specified
      return excludeProductId 
        ? products.filter(p => p.id !== excludeProductId).slice(0, limit)
        : products.slice(0, limit);
    }
  });

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-lg h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 mr-2" />
            Personalized Selection
          </Badge>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Curated based on your interests and browsing patterns
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.map((product, index) => (
            <ProductCard 
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductRecommendations;