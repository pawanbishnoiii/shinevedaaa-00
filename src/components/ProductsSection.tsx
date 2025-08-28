import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import ProductCard from "./ProductCard";

const ProductsSection = () => {

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            categories!products_category_id_fkey (
              name,
              slug
            )
          `)
          .eq('is_active', true)
          .eq('is_featured', true)
          .order('featured_rank', { ascending: true })
          .order('sort_order', { ascending: true })
          .limit(3);
        
        if (error) {
          console.error('Featured products query error:', error);
          throw error;
        }
        return data || [];
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
        throw err;
      }
    },
    retry: 3,
    retryDelay: 1000
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
              {products.map((product, index) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
              {/* Fill remaining slots with skeletons if fewer than 3 */}
              {products.length < 3 && Array.from({ length: 3 - products.length }).map((_, index) => (
                <div
                  key={`skeleton-${products.length + index}`}
                  className="bg-card rounded-xl p-6 border animate-pulse"
                >
                  <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="text-center p-4 border-2 border-dashed rounded-lg">
                    <p className="text-sm text-muted-foreground">Available Slot</p>
                  </div>
                </div>
              ))}
            </>
          ) : (
            // Show skeletons and admin CTA if no featured products
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="bg-card rounded-xl p-6 border border-dashed"
                >
                  <div className="aspect-square bg-muted/50 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Featured Product Slot</p>
                    </div>
                  </div>
                  <div className="h-4 bg-muted/50 rounded mb-2"></div>
                  <div className="h-3 bg-muted/50 rounded w-3/4"></div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Admin CTA if no featured products */}
        {(!products || products.length === 0) && (
          <div className="text-center mt-8 p-8 border-2 border-dashed rounded-xl bg-muted/20">
            <h3 className="text-lg font-semibold mb-2">No Featured Products Yet</h3>
            <p className="text-muted-foreground mb-4">
              Add products and mark them as featured to showcase your best offerings here.
            </p>
            <Button asChild>
              <Link to="/admin/products">
                Manage Products
              </Link>
            </Button>
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