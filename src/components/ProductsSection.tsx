import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Truck, Shield, Loader2 } from "lucide-react";

const ProductsSection = () => {
  const [activeProduct, setActiveProduct] = useState<string | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
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
        .limit(8);
      
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
            From farm to international markets, our seven premium product lines represent 
            the finest quality agricultural exports from Rajasthan's fertile lands.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products?.map((product, index) => (
            <Card 
              key={product.id}
              className={`card-premium group cursor-pointer transition-all duration-500 ${
                activeProduct === product.id ? 'ring-2 ring-primary scale-105' : ''
              }`}
              onMouseEnter={() => setActiveProduct(product.id)}
              onMouseLeave={() => setActiveProduct(null)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-xl">
                  <img 
                    src={product.image_url || "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&h=600&fit=crop"}
                    alt={product.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Category Badge */}
                  <Badge 
                    variant="secondary" 
                    className="absolute top-3 left-3 bg-white/90 text-foreground"
                  >
                    {product.categories?.name || 'General'}
                  </Badge>

                  {/* Quick Actions */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <Button 
                      size="sm"
                      onClick={() => handleQuoteRequest(product.name)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Quote
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.features?.slice(0, 2).map((feature, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className="text-xs border-primary/20 text-primary"
                      >
                        {feature}
                      </Badge>
                    )) || (
                      <Badge variant="outline" className="text-xs border-primary/20 text-primary">
                        Premium Quality
                      </Badge>
                    )}
                  </div>

                  {/* Key Specs */}
                  {activeProduct === product.id && (
                    <div className="space-y-3 animate-slide-up">
                      <div className="border-t border-border pt-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Package className="h-3 w-3 mr-1" />
                            Price Range
                          </div>
                          <div className="text-foreground font-medium text-xs">
                            {product.price_range || 'Contact for pricing'}
                          </div>
                          
                          <div className="flex items-center text-muted-foreground">
                            <Shield className="h-3 w-3 mr-1" />
                            Min. Order
                          </div>
                          <div className="text-foreground font-medium text-xs">
                            {product.minimum_order_quantity || 'Flexible'}
                          </div>
                          
                          <div className="flex items-center text-muted-foreground">
                            <Truck className="h-3 w-3 mr-1" />
                            Origin
                          </div>
                          <div className="text-foreground font-medium text-xs">
                            {product.origin}
                          </div>
                        </div>
                      </div>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleQuoteRequest(product.name)}
                        className="w-full transition-bounce hover:scale-105"
                      >
                        Get Detailed Quote
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
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