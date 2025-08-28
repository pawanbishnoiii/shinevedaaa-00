import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package, Share2, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import FavoriteButton from './FavoriteButton';
import { trackProductInteraction } from '@/utils/analytics';
import ShareButton from './ShareButton';

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
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  // Track product view when component mounts
  useEffect(() => {
    trackProductInteraction(product.id, 'view');
  }, [product.id]);

  const handleQuoteRequest = (productName: string) => {
    trackProductInteraction(product.id, 'inquiry', 3);
    const message = `Hello ShineVeda, I would like to get a quote for ${productName}. Please provide pricing and availability details.`;
    window.open(`https://wa.me/918955158794?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShare = async () => {
    trackProductInteraction(product.id, 'share', 2);
    const shareData = {
      title: `${product.name} - ShineVeda Exports`,
      text: `Check out this premium agricultural product: ${product.name}`,
      url: `${window.location.origin}/products/${product.slug}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Product link copied to clipboard!');
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareData.url);
      toast.success('Product link copied to clipboard!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index ? index * 0.1 : 0 }}
      className="h-full"
    >
      <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-card to-card/80 border-2 border-border/50 hover:border-primary/20">
        {/* Product Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={product.image_url || 'https://zlylzlmavxhgbjxuuseo.supabase.co/storage/v1/object/public/product-images/placeholder-product.jpg'}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Category Badge */}
          {product.categories?.name && (
            <Badge 
              variant="secondary" 
              className="absolute top-4 left-4 bg-white/90 text-foreground shadow-lg"
            >
              {product.categories.name}
            </Badge>
          )}

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <FavoriteButton productId={product.id} />
            <ShareButton
              productId={product.id}
              productName={product.name}
              productSlug={product.slug}
              className="h-10 w-10 rounded-full hover:bg-secondary/80"
            />
          </div>
        </div>

        {/* Product Content */}
        <CardContent className="p-6">
          <CardTitle className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
            {product.name}
          </CardTitle>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.features?.slice(0, 2).map((feature, idx) => (
              <Badge 
                key={idx} 
                variant="outline" 
                className="text-xs border-primary/30 text-primary/80"
              >
                {feature}
              </Badge>
            ))}
            {(!product.features || product.features.length === 0) && (
              <Badge variant="outline" className="text-xs border-primary/30 text-primary/80">
                Premium Quality
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Price Range:</span>
              <span className="font-medium text-primary">
                {product.price_range || 'Contact for pricing'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Min. Order:</span>
              <span className="font-medium">
                {product.minimum_order_quantity || 'Flexible'}
              </span>
            </div>

            {product.origin && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Origin:</span>
                <span className="font-medium">{product.origin}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-6">
            <Button 
              asChild
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105"
            >
              <Link to={`/products/${product.slug}`}>
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleQuoteRequest(product.name)}
              className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
            >
              <Package className="mr-2 h-4 w-4" />
              Quote
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;