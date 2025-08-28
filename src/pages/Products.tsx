import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  Package, 
  Globe,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    featured: false,
    inStock: false,
    exportMarkets: [] as string[]
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', searchTerm, selectedCategory, sortBy, filters],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories:category_id (
            name,
            slug
          )
        `)
        .eq('is_active', true);

      // Apply filters
      if (selectedCategory !== 'all') {
        query = query.eq('categories.slug', selectedCategory);
      }

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      if (filters.featured) {
        query = query.eq('is_featured', true);
      }

      if (filters.inStock) {
        query = query.eq('stock_status', 'in_stock');
      }

      // Apply sorting
      const sortField = sortBy === 'name' ? 'name' : 
                       sortBy === 'price' ? 'price_range' : 
                       'created_at';
      
      query = query.order(sortField);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const handleWhatsAppInquiry = (productName: string) => {
    const message = `Hi! I'm interested in ${productName}. Please provide more details and pricing.`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const ProductCard = ({ product }: { product: any }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="aspect-square overflow-hidden bg-muted">
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
          {product.is_featured && (
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          )}
        </div>
        <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.short_description}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Price Range</span>
            <span className="font-semibold text-primary">{product.price_range}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">MOQ</span>
            <span className="font-medium">{product.minimum_order_quantity}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Origin</span>
            <span className="font-medium">{product.origin}</span>
          </div>

          <div className="flex space-x-2 mt-4">
            <Button
              size="sm"
              onClick={() => handleWhatsAppInquiry(product.name)}
              className="flex-1"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Quick Inquiry
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/product/${product.slug}`}>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProductListItem = ({ product }: { product: any }) => (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex space-x-6">
          <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={product.image_url || '/placeholder.svg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant="secondary">{product.categories?.name}</Badge>
                  {product.is_featured && (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  )}
                </div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {product.short_description}
                </p>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-primary">{product.price_range}</div>
                <div className="text-sm text-muted-foreground">MOQ: {product.minimum_order_quantity}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <Globe className="w-4 h-4 mr-1" />
                  {product.origin}
                </span>
                <span className="flex items-center">
                  <Package className="w-4 h-4 mr-1" />
                  {product.stock_status === 'in_stock' ? 'In Stock' : 'Pre-order'}
                </span>
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleWhatsAppInquiry(product.name)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Quick Inquiry
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/product/${product.slug}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>Agricultural Products Export - ShineVeda</title>
        <meta name="description" content="Browse our premium agricultural products for B2B export. High-quality guar gum, spices, and agricultural raw materials from India." />
        <meta name="keywords" content="agricultural products, export, B2B, guar gum, spices, India, bulk orders" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Our Products</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our premium range of agricultural products for international export. 
                Quality assured, competitively priced, and ready for bulk orders.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="flex-1 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap gap-4 items-center">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Sort by Name</SelectItem>
                    <SelectItem value="price">Sort by Price</SelectItem>
                    <SelectItem value="newest">Sort by Newest</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={filters.featured}
                    onCheckedChange={(checked) => 
                      setFilters(prev => ({ ...prev, featured: !!checked }))
                    }
                  />
                  <label htmlFor="featured" className="text-sm">Featured Only</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="instock"
                    checked={filters.inStock}
                    onCheckedChange={(checked) => 
                      setFilters(prev => ({ ...prev, inStock: !!checked }))
                    }
                  />
                  <label htmlFor="instock" className="text-sm">In Stock</label>
                </div>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {products.length} products
              {searchTerm && ` for "${searchTerm}"`}
              {selectedCategory !== 'all' && ` in ${categories.find(c => c.slug === selectedCategory)?.name}`}
            </p>
          </div>

          {/* Products Grid/List */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted"></div>
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-6 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or browse our categories.
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <ProductListItem key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Products;