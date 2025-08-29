import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Star, 
  Package, 
  Globe, 
  Shield, 
  Truck, 
  MessageSquare, 
  Phone,
  Mail,
  Download,
  Heart,
  Share2
} from 'lucide-react';
import { toast } from 'sonner';
import QuickInquiryForm from '@/components/QuickInquiryForm';
import CurrencyPrice from '@/components/CurrencyPrice';
import { Helmet } from 'react-helmet-async';
import FavoriteButton from '@/components/FavoriteButton';
import ShareButton from '@/components/ShareButton';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [quantity, setQuantity] = useState('1000');
  const [unit, setUnit] = useState('kg');

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories!category_id (
            name,
            slug
          )
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug
  });

  const handleWhatsAppInquiry = () => {
    if (!product) return;
    
    const message = `Hi! I'm interested in ${product.name}. 
    
Quantity: ${quantity} ${unit}
Product: ${product.name}
Price Range: ${product.price_range}
MOQ: ${product.minimum_order_quantity}

Please provide detailed quote and availability.`;

    const whatsappUrl = `https://wa.me/918955158794?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.short_description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product URL copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.seo_title || `${product.name} - Premium Agricultural Export | ShineVeda`}</title>
        <meta name="description" content={product.seo_description || `${product.short_description || product.name} - Direct from Sri Ganganagar, Rajasthan. Export quality agricultural products to India, Singapore, UK, USA, Dubai, Australia, Qatar, Japan, China and worldwide.`} />
        <meta name="keywords" content={product.seo_keywords || `${product.name}, agricultural export, B2B, ${product.categories?.name || 'agriculture'}, Sri Ganganagar, Rajasthan, India export, Singapore import, UK import, USA import, Dubai import, Australia import, Qatar import, Japan import, China import, wholesale, bulk order, premium quality, agricultural commodities, international trade, export business`} />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={`${product.name} - Premium Agricultural Export`} />
        <meta property="og:description" content={product.short_description || `Premium ${product.name} exported from Sri Ganganagar, Rajasthan`} />
        <meta property="og:image" content={product.image_url} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="ShineVeda" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} - ShineVeda`} />
        <meta name="twitter:description" content={product.short_description} />
        <meta name="twitter:image" content={product.image_url} />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="ShineVeda" />
        <meta name="geo.region" content="IN-RJ" />
        <meta name="geo.placename" content="Sri Ganganagar, Rajasthan" />
        <meta name="geo.position" content="29.9157;73.8772" />
        <meta name="ICBM" content="29.9157, 73.8772" />
        
        {/* Business Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "description": product.description || product.short_description,
            "image": product.image_url,
            "brand": {
              "@type": "Brand",
              "name": "ShineVeda"
            },
            "manufacturer": {
              "@type": "Organization",
              "name": "ShineVeda",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Sri Ganganagar",
                "addressRegion": "Rajasthan",
                "addressCountry": "IN"
              }
            },
            "offers": {
              "@type": "Offer",
              "price": product.price_range,
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": "ShineVeda"
              }
            },
            "category": product.categories?.name,
            "mpn": product.id,
            "additionalProperty": [
              {
                "@type": "PropertyValue",
                "name": "Origin",
                "value": product.origin || "Sri Ganganagar, Rajasthan"
              },
              {
                "@type": "PropertyValue", 
                "name": "Minimum Order Quantity",
                "value": product.minimum_order_quantity
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span>/</span>
              <Link to="/products" className="hover:text-primary">Products</Link>
              <span>/</span>
              <Link to={`/category/${product.categories?.slug}`} className="hover:text-primary">
                {product.categories?.name}
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">{product.name}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-muted">
                <img
                  src={product.image_url || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {product.gallery_images && product.gallery_images.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.gallery_images.map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer">
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary">{product.categories?.name}</Badge>
                  <div className="flex items-center space-x-2">
                    <ShareButton 
                      productId={product.id}
                      productName={product.name}
                      productSlug={product.slug}
                    />
                    <FavoriteButton productId={product.id} />
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                <p className="text-lg text-muted-foreground mb-6">{product.short_description}</p>

                {/* Key Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Price Range</Label>
                    <CurrencyPrice priceRange={product.price_range} />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">MOQ</Label>
                    <p className="text-lg font-semibold">{product.minimum_order_quantity}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Origin</Label>
                    <p className="text-lg">{product.origin}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Stock Status</Label>
                    <Badge variant={product.stock_status === 'in_stock' ? 'default' : 'destructive'}>
                      {product.stock_status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Quick Inquiry Form */}
              <QuickInquiryForm 
                product={{
                  id: product.id,
                  name: product.name,
                  price_range: product.price_range,
                  minimum_order_quantity: product.minimum_order_quantity
                }}
                onSuccess={() => toast.success('Thank you! We will contact you soon.')}
              />

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Key Features</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="certifications">Certifications</TabsTrigger>
                <TabsTrigger value="markets">Export Markets</TabsTrigger>
                <TabsTrigger value="packaging">Packaging</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="prose max-w-none">
                      <p className="text-muted-foreground leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specifications" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    {product.specifications && (
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(product.specifications as Record<string, string>).map(([key, value]) => (
                          <div key={key} className="border-b pb-2">
                            <Label className="text-sm font-medium text-muted-foreground">
                              {key.replace('_', ' ').toUpperCase()}
                            </Label>
                            <p className="font-medium">{value}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="certifications" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    {product.certifications && (
                      <div className="grid grid-cols-3 gap-4">
                        {product.certifications.map((cert, index) => (
                          <div key={index} className="text-center p-4 border rounded-lg">
                            <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                            <p className="font-medium">{cert}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="markets" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    {product.export_markets && (
                      <div className="grid grid-cols-3 gap-4">
                        {product.export_markets.map((market, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <Globe className="w-5 h-5 text-primary" />
                            <span className="font-medium">{market}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="packaging" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Package className="w-5 h-5 text-primary" />
                        <span className="font-medium">Packaging Details</span>
                      </div>
                      <p className="text-muted-foreground">{product.packaging_details}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Shelf Life</Label>
                          <p className="font-medium">{product.shelf_life}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Lead Time</Label>
                          <p className="font-medium">{product.lead_time || '7-14 days'}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

      </div>
    </>
  );
};

export default ProductDetail;