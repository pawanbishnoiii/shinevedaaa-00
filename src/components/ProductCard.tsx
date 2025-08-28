import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package, Truck, Shield, Share2 } from 'lucide-react';
import FavoriteButton from './FavoriteButton';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Product {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  price_range?: string;
  minimum_order_quantity?: string;
  origin?: string;
  features?: string[];
  categories?: {
    name: string;
    slug: string;
  };
}

interface ProductCardProps {
  product: Product;
  index?: number;
  onView?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0, onView }) => {
  const [activeProduct, setActiveProduct] = useState<string | null>(null);
  const { user } = useAuth();

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = `${window.location.origin}/products/${product.slug}`;
    const text = `Check out ${product.name} from ShineVeda Exports - Premium agricultural commodities from Rajasthan`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: text,
          url: url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        toast.success('Link copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy link');
      }
    }
  };

  const handleView = async () => {
    // Track product view interaction
    try {
      await supabase
        .from('product_interactions')
        .insert({
          user_id: user?.id || null,
          product_id: product.id,
          interaction_type: 'view',
          weight: 1
        });

      // Also track in analytics
      await supabase
        .from('user_analytics')
        .insert({
          user_id: user?.id || null,
          event_type: 'product_view',
          page_url: `/products/${product.slug}`,
          page_title: product.name,
          product_id: product.id
        });
    } catch (error) {
      console.error('Error tracking view:', error);
    }

    if (onView) {
      onView(product.id);
    }
  };

  return (
    <Card 
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

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <FavoriteButton 
              productId={product.id} 
              productName={product.name}
              size="sm"
              variant="outline"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-white/90 hover:bg-white"
              onClick={handleShare}
            >
              <Share2 className="h-3 w-3" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <Button 
              size="sm"
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleView}
            >
              <a href={`/products/${product.slug}`}>
                View Details
                <ArrowRight className="ml-1 h-3 w-3" />
              </a>
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
                asChild
                className="w-full transition-bounce hover:scale-105"
              >
                <a href={`/products/${product.slug}`}>
                  View Details
                  <ArrowRight className="ml-2 h-3 w-3" />
                </a>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;