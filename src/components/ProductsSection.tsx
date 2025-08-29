import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, Star } from "lucide-react";
import ProductCard from "./ProductCard";

const ProductsSection = () => {

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      try {
        // Fetch products and categories separately for better performance
        const [productsResponse, categoriesResponse] = await Promise.all([
          supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .eq('is_featured', true)
            .order('featured_rank', { ascending: true })
            .limit(3),
          supabase
            .from('categories')
            .select('*')
        ]);
        
        if (productsResponse.error) {
          console.error('Featured products query error:', productsResponse.error);
          throw productsResponse.error;
        }
        
        if (categoriesResponse.error) {
          console.error('Categories query error:', categoriesResponse.error);
          throw categoriesResponse.error;
        }

        const productsData = productsResponse.data || [];
        const categoriesData = categoriesResponse.data || [];
        
        // Create category map for joining
        const categoryMap = new Map(categoriesData.map(cat => [cat.id, cat]));
        
        // Join products with categories
        const productsWithCategories = productsData.map(product => ({
          ...product,
          categories: product.category_id ? categoryMap.get(product.category_id) : null
        }));
        
        console.log('Featured products loaded:', productsWithCategories.length);
        return productsWithCategories;
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
        throw err;
      }
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });

  const handleQuoteRequest = (productName: string) => {
    const message = `Hello ShineVeda, I would like to get a quote for ${productName}. Please provide pricing and availability details.`;
    window.open(`https://wa.me/918955158794?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
            Our Premium Products
          </Badge>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
            World-Class{" "}
            <span className="text-gradient">Agricultural</span>
            <br />
            Commodities
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From farm to international markets, discover our premium agricultural 
            commodities directly sourced from Sri Ganganagar, Rajasthan's fertile lands.
          </p>
        </div>

        {/* Featured Products Section */}
        <div className="mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
            Featured Products
          </Badge>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            Premium <span className="text-gradient">Selections</span>
          </h3>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products && products.length > 0 ? (
            <>
              {/* Show featured products */}
              {products.map((product, index) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
              
              {/* Fill remaining slots with placeholders if fewer than 3 featured products */}
              {products.length < 3 && Array.from({ length: 3 - products.length }).map((_, index) => (
                <div
                  key={`placeholder-${products.length + index}`}
                  className="bg-card rounded-xl p-6 border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors"
                >
                  <div className="aspect-square bg-muted/50 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-2xl font-bold text-muted-foreground">
                          {products.length + index + 1}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">
                        {index === 0 ? 'Second' : 'Third'} Featured Product
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Set in admin panel
                      </p>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Available Slot</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Manage in Featured Products
                    </p>
                  </div>
                </div>
              ))}
            </>
          ) : (
            // Show placeholders when no featured products are set
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="bg-card rounded-xl p-6 border-2 border-dashed border-muted-foreground/30"
                >
                  <div className="aspect-square bg-muted/20 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-2xl font-bold text-muted-foreground">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">
                        {index === 0 ? 'First' : index === 1 ? 'Second' : 'Third'} Position
                      </p>
                    </div>
                  </div>
                  <div className="h-4 bg-muted/30 rounded mb-2"></div>
                  <div className="h-3 bg-muted/30 rounded w-3/4 mb-4"></div>
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <p className="text-xs text-primary font-medium">Featured Product Slot</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Admin CTA if no featured products */}
        {(!products || products.length === 0) && (
          <div className="text-center mt-8 p-8 border-2 border-dashed rounded-xl bg-primary/5">
            <h3 className="text-lg font-semibold mb-2">No Featured Products Set</h3>
            <p className="text-muted-foreground mb-4">
              Use the Featured Products manager to select and arrange your top 3 products for the homepage.
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild>
                <Link to="/admin/featured-products">
                  <Star className="h-4 w-4 mr-2" />
                  Manage Featured Products
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin/products">
                  View All Products
                </Link>
              </Button>
            </div>
          </div>
        )}
        
        {/* Quick link for admin if products exist but fewer than 3 */}
        {products && products.length > 0 && products.length < 3 && (
          <div className="text-center mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              You have {products.length} featured product{products.length === 1 ? '' : 's'}. 
              <Link to="/admin/featured-products" className="font-medium text-amber-900 hover:underline ml-1">
                Add more to fill all 3 slots
              </Link>
            </p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Button 
            size="lg"
            onClick={() => handleQuoteRequest("custom requirements")}
            className="btn-premium px-8 py-6 text-lg font-semibold transition-bounce hover:scale-105"
          >
            Request Custom Quote for All Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Bulk discounts available • Custom packaging options • International shipping
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;