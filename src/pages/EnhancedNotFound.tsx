import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet-async';
import { 
  Home, 
  Search, 
  Package, 
  Star, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin,
  MessageSquare
} from 'lucide-react';

const EnhancedNotFound = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [animationStep, setAnimationStep] = useState(0);

  // Fetch popular products for suggestions
  const { data: popularProducts } = useQuery({
    queryKey: ['popular-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, name, slug, short_description, price_range, image_url,
          categories!category_id (name)
        `)
        .eq('is_active', true)
        .eq('is_featured', true)
        .limit(6);
      
      if (error) throw error;
      return data;
    }
  });

  // Animation effect
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  const handleWhatsAppContact = () => {
    const message = "Hi! I was looking for something on your website but couldn't find it. Can you help me?";
    window.open(`https://wa.me/918955158794?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>Page Not Found - ShineVeda</title>
        <meta name="description" content="The page you're looking for couldn't be found. Explore our products or contact us for assistance." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 flex flex-col">
        {/* Animated 404 Section */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Animated 404 */}
            <div className="mb-8">
              <div className="text-9xl md:text-[12rem] font-bold text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-clip-text animate-pulse">
                4
                <span className={`inline-block transition-transform duration-500 ${
                  animationStep === 1 ? 'rotate-12' : 
                  animationStep === 2 ? '-rotate-12' : 
                  animationStep === 3 ? 'scale-110' : ''
                }`}>
                  0
                </span>
                4
              </div>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Oops! Page Not Found
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                The page you're looking for seems to have taken a detour through our virtual fields. 
                But don't worry, we'll help you find what you need!
              </p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search our products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-20 h-12 text-lg"
                />
                <Button 
                  type="submit" 
                  className="absolute right-1 top-1 bottom-1 px-4"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button asChild size="lg" className="h-12 px-6">
                <Link to="/">
                  <Home className="w-5 h-5 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6">
                <Link to="/products">
                  <Package className="w-5 h-5 mr-2" />
                  Browse Products
                </Link>
              </Button>
              <Button onClick={handleWhatsAppContact} variant="outline" size="lg" className="h-12 px-6">
                <MessageSquare className="w-5 h-5 mr-2" />
                Need Help?
              </Button>
            </div>
          </div>
        </div>

        {/* Popular Products Section */}
        {popularProducts && popularProducts.length > 0 && (
          <div className="bg-card/50 backdrop-blur border-t">
            <div className="container mx-auto px-4 py-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Popular Products
                </h2>
                <p className="text-muted-foreground">
                  Explore our most sought-after agricultural commodities
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {popularProducts.map((product, index) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img
                        src={product.image_url || '/placeholder.svg'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <Badge variant="secondary" className="mb-2">
                          {product.categories?.name}
                        </Badge>
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {product.short_description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">{product.price_range}</span>
                        <Button asChild size="sm">
                          <Link to={`/products/${product.slug}`}>
                            View Details
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="bg-primary/5 border-t">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Still Can't Find What You're Looking For?
              </h2>
              <p className="text-muted-foreground mb-8">
                Our team is here to help you find the perfect agricultural products for your needs.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center">
                  <CardContent className="p-6">
                    <Phone className="w-8 h-8 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">Call Us</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Speak directly with our experts
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="tel:+918955158794">+91 89551 58794</a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-6">
                    <Mail className="w-8 h-8 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">Email Us</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Get detailed product information
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="mailto:help@shineveda.in">help@shineveda.in</a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-6">
                    <MapPin className="w-8 h-8 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">Visit Us</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Sri Ganganagar, Rajasthan
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/contact">Get Directions</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnhancedNotFound;