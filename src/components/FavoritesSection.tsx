import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Package, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FavoritesSection = () => {
  const { user } = useAuth();

  const { data: favorites, isLoading, error } = useQuery({
    queryKey: ['user-favorites', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('product_favorites')
        .select(`
          id,
          created_at,
          product_id,
          products!product_favorites_product_id_fkey (
            id,
            name,
            slug,
            image_url,
            price_range,
            short_description,
            category_id,
            categories!products_category_id_fkey (
              name,
              slug
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Sign in to view favorites</h3>
          <p className="text-muted-foreground mb-4">
            Create an account to save your favorite products
          </p>
          <Button asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            My Favorites
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex gap-4 p-4 border rounded-lg">
                  <div className="w-16 h-16 bg-muted rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Failed to load favorites</h3>
          <p className="text-muted-foreground">Please try again later</p>
        </CardContent>
      </Card>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            My Favorites
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
          <p className="text-muted-foreground mb-4">
            Start exploring our products and add your favorites
          </p>
          <Button asChild>
            <Link to="/products">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Browse Products
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          My Favorites ({favorites.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((favorite, index) => {
            const product = favorite.products;
            if (!product) return null;

            return (
              <motion.div
                key={favorite.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={product.image_url || '/placeholder.svg'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                              {product.name}
                            </h4>
                            {product.categories?.name && (
                              <Badge variant="outline" className="text-xs mt-1">
                                {product.categories.name}
                              </Badge>
                            )}
                          </div>
                          <Heart className="h-4 w-4 text-red-500 fill-red-500 flex-shrink-0" />
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {product.short_description}
                        </p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm font-medium text-primary">
                            {product.price_range || 'Contact for pricing'}
                          </span>
                          <Button asChild size="sm" variant="outline">
                            <Link to={`/products/${product.slug}`}>
                              View
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FavoritesSection;