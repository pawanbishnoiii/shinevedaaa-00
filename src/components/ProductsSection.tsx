import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Truck, Shield } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Premium Onions",
    category: "Fresh Produce",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&h=600&fit=crop",
    specs: {
      varieties: ["Red Onions", "White Onions", "Yellow Onions"],
      packaging: "10kg, 25kg, 50kg mesh bags",
      shelfLife: "6-8 months",
      origin: "Sriganganagar, Rajasthan"
    },
    features: ["Hand-sorted", "Premium Grade A", "Export Quality", "Minimal Processing"]
  },
  {
    id: 2,
    name: "Cumin Seeds (Jeera)",
    category: "Spices",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=600&fit=crop",
    specs: {
      varieties: ["Whole Cumin", "Cumin Powder"],
      packaging: "25kg, 50kg PP bags",
      shelfLife: "24 months",
      origin: "Sriganganagar, Rajasthan"
    },
    features: ["99% Purity", "Steam Sterilized", "Machine Cleaned", "Premium Quality"]
  },
  {
    id: 3,
    name: "Raw Peanuts",
    category: "Nuts & Seeds",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&h=600&fit=crop",
    specs: {
      varieties: ["Bold Peanuts", "Java Peanuts", "Red Skin"],
      packaging: "25kg, 50kg jute bags",
      shelfLife: "12 months",
      origin: "Sriganganagar, Rajasthan"
    },
    features: ["Hand-picked", "Well Dried", "Uniform Size", "Export Grade"]
  },
  {
    id: 4,
    name: "Fresh Carrots",
    category: "Fresh Produce",
    image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=800&h=600&fit=crop",
    specs: {
      varieties: ["Orange Carrots", "Baby Carrots"],
      packaging: "10kg, 20kg cartons",
      shelfLife: "3-4 months",
      origin: "Sriganganagar, Rajasthan"
    },
    features: ["Cold Storage", "Washed & Graded", "Premium Quality", "Fresh Harvest"]
  },
  {
    id: 5,
    name: "Chickpeas (Chana)",
    category: "Pulses",
    image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800&h=600&fit=crop",
    specs: {
      varieties: ["Kabuli Chana", "Desi Chana"],
      packaging: "25kg, 50kg PP bags",
      shelfLife: "18 months",
      origin: "Sriganganagar, Rajasthan"
    },
    features: ["Machine Cleaned", "Uniform Size", "High Protein", "Premium Grade"]
  },
  {
    id: 6,
    name: "Mustard Seeds",
    category: "Spices",
    image: "https://images.unsplash.com/photo-1609501676725-7186f202aa35?w=800&h=600&fit=crop",
    specs: {
      varieties: ["Black Mustard", "Yellow Mustard"],
      packaging: "25kg, 50kg bags",
      shelfLife: "24 months",
      origin: "Sriganganagar, Rajasthan"
    },
    features: ["99% Purity", "Oil Rich", "Machine Cleaned", "Export Quality"]
  },
  {
    id: 7,
    name: "Guar Gum",
    category: "Industrial",
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=600&fit=crop",
    specs: {
      varieties: ["Food Grade", "Industrial Grade"],
      packaging: "25kg kraft bags",
      shelfLife: "36 months",
      origin: "Sriganganagar, Rajasthan"
    },
    features: ["High Viscosity", "Food Safe", "Multi-Purpose", "International Standards"]
  }
];

const ProductsSection = () => {
  const [activeProduct, setActiveProduct] = useState<number | null>(null);

  const handleQuoteRequest = (productName: string) => {
    const message = `Hello ShineVeda, I would like to get a quote for ${productName}. Please provide pricing and availability details.`;
    window.open(`https://wa.me/918955158794?text=${encodeURIComponent(message)}`, '_blank');
  };

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
          {products.map((product, index) => (
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
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Category Badge */}
                  <Badge 
                    variant="secondary" 
                    className="absolute top-3 left-3 bg-white/90 text-foreground"
                  >
                    {product.category}
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
                    {product.features.slice(0, 2).map((feature, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className="text-xs border-primary/20 text-primary"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Key Specs */}
                  {activeProduct === product.id && (
                    <div className="space-y-3 animate-slide-up">
                      <div className="border-t border-border pt-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Package className="h-3 w-3 mr-1" />
                            Packaging
                          </div>
                          <div className="text-foreground font-medium text-xs">
                            {product.specs.packaging}
                          </div>
                          
                          <div className="flex items-center text-muted-foreground">
                            <Shield className="h-3 w-3 mr-1" />
                            Shelf Life
                          </div>
                          <div className="text-foreground font-medium text-xs">
                            {product.specs.shelfLife}
                          </div>
                          
                          <div className="flex items-center text-muted-foreground">
                            <Truck className="h-3 w-3 mr-1" />
                            Origin
                          </div>
                          <div className="text-foreground font-medium text-xs">
                            {product.specs.origin}
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