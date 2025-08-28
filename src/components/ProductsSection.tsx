import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import ProductCard from "./ProductCard";

const ProductsSection = () => {

  const { data: products, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('sort_order', { ascending: true })
        .limit(3);
      
      if (error) throw error;
      return data;
    }
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
          {products?.map((product, index) => (
            <ProductCard 
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>

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