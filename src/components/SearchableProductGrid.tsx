import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Grid3X3, 
  List,
  ArrowUpDown,
  Heart,
  Share2,
  ExternalLink
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import ProductCard from './ProductCard';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  image_url: string;
  price_range: string;
  currency: string;
  origin: string;
  certifications: string[];
  export_markets: string[];
  category_id: string;
  created_at?: string;
  categories?: {
    name: string;
    slug: string;
  } | null;
}

interface SearchableProductGridProps {
  showFilters?: boolean;
  showSearch?: boolean;
  defaultViewMode?: 'grid' | 'list';
  maxProducts?: number;
  categoryFilter?: string;
}

export function SearchableProductGrid({
  showFilters = true,
  showSearch = true,
  defaultViewMode = 'grid',
  maxProducts,
  categoryFilter
}: SearchableProductGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(defaultViewMode);
  const [sortBy, setSortBy] = useState('name_asc');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const { trackProductInteraction } = useAnalytics();
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch products with filters
  const { data: products, isLoading } = useQuery({
    queryKey: ['searchable-products', searchQuery, selectedCategories, selectedOrigins, selectedCertifications, categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('is_active', true);

      // Apply category filter if provided
      if (categoryFilter) {
        query = query.eq('category_id', categoryFilter);
      }

      // Apply search query
      if (searchQuery) {
        query = query.or(`
          name.ilike.%${searchQuery}%,
          short_description.ilike.%${searchQuery}%,
          description.ilike.%${searchQuery}%,
          origin.ilike.%${searchQuery}%
        `);
      }

      // Apply category filters
      if (selectedCategories.length > 0) {
        query = query.in('category_id', selectedCategories);
      }

      // Apply origin filters
      if (selectedOrigins.length > 0) {
        query = query.in('origin', selectedOrigins);
      }

      // Limit results if specified
      if (maxProducts) {
        query = query.limit(maxProducts);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as any[];
    }
  });

  // Fetch filter options
  const { data: filterOptions } = useQuery({
    queryKey: ['product-filter-options'],
    queryFn: async () => {
      const [categoriesData, originsData, certificationsData] = await Promise.all([
        supabase.from('categories').select('id, name').eq('is_active', true),
        supabase.from('products').select('origin').not('origin', 'is', null),
        supabase.from('products').select('certifications').not('certifications', 'is', null)
      ]);

      const uniqueOrigins = [...new Set(originsData.data?.map(p => p.origin).filter(Boolean))];
      const allCertifications = certificationsData.data?.flatMap(p => p.certifications || []) || [];
      const uniqueCertifications = [...new Set(allCertifications)];

      return {
        categories: categoriesData.data || [],
        origins: uniqueOrigins,
        certifications: uniqueCertifications
      };
    }
  });

  // Apply sorting and filtering
  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products.filter(product => {
      // Apply certification filter
      if (selectedCertifications.length > 0) {
        const hasSelectedCert = selectedCertifications.some(cert => 
          product.certifications?.includes(cert)
        );
        if (!hasSelectedCert) return false;
      }

      return true;
    });

    // Apply sorting
    switch (sortBy) {
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime());
        break;
      default:
        break;
    }

    return filtered;
  }, [products, selectedCertifications, sortBy]);

  const handleProductClick = (productId: string) => {
    trackProductInteraction(productId, 'click');
  };

  const handleFavorite = async (productId: string) => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please login to save favorites',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('product_favorites')
        .insert({ product_id: productId, user_id: user.id });

      if (error) throw error;

      trackProductInteraction(productId, 'favorite');
      toast({
        title: 'Added to favorites',
        description: 'Product saved to your favorites list'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add to favorites',
        variant: 'destructive'
      });
    }
  };

  const handleShare = async (product: Product) => {
    const shareData = {
      title: product.name,
      text: product.short_description,
      url: `${window.location.origin}/products/${product.slug}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: 'Link copied',
          description: 'Product link copied to clipboard'
        });
      }
      trackProductInteraction(product.id, 'share');
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedOrigins([]);
    setSelectedCertifications([]);
    setPriceRange([0, 1000]);
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {showSearch && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Sort Controls */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name_asc">Name (A-Z)</SelectItem>
              <SelectItem value="name_desc">Name (Z-A)</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter Sheet */}
          {showFilters && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {(selectedCategories.length + selectedOrigins.length + selectedCertifications.length) > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedCategories.length + selectedOrigins.length + selectedCertifications.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Products</SheetTitle>
                  <SheetDescription>
                    Narrow down products by category, origin, and certifications
                  </SheetDescription>
                </SheetHeader>

                <div className="py-6 space-y-6">
                  {/* Categories */}
                  <div>
                    <h4 className="font-medium mb-3">Categories</h4>
                    <div className="space-y-2">
                      {filterOptions?.categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={category.id}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCategories([...selectedCategories, category.id]);
                              } else {
                                setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                              }
                            }}
                          />
                          <label htmlFor={category.id} className="text-sm font-medium">
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Origins */}
                  <div>
                    <h4 className="font-medium mb-3">Origin</h4>
                    <div className="space-y-2">
                      {filterOptions?.origins.map((origin) => (
                        <div key={origin} className="flex items-center space-x-2">
                          <Checkbox
                            id={origin}
                            checked={selectedOrigins.includes(origin)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedOrigins([...selectedOrigins, origin]);
                              } else {
                                setSelectedOrigins(selectedOrigins.filter(o => o !== origin));
                              }
                            }}
                          />
                          <label htmlFor={origin} className="text-sm font-medium">
                            {origin}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <h4 className="font-medium mb-3">Certifications</h4>
                    <div className="space-y-2">
                      {filterOptions?.certifications.map((cert) => (
                        <div key={cert} className="flex items-center space-x-2">
                          <Checkbox
                            id={cert}
                            checked={selectedCertifications.includes(cert)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCertifications([...selectedCertifications, cert]);
                              } else {
                                setSelectedCertifications(selectedCertifications.filter(c => c !== cert));
                              }
                            }}
                          />
                          <label htmlFor={cert} className="text-sm font-medium">
                            {cert}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    Clear All Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}

          {/* View Mode Toggle */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedCategories.length > 0 || selectedOrigins.length > 0 || selectedCertifications.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map(catId => {
            const category = filterOptions?.categories.find(c => c.id === catId);
            return category ? (
              <Badge key={catId} variant="secondary" className="gap-1">
                Category: {category.name}
                <button
                  onClick={() => setSelectedCategories(selectedCategories.filter(id => id !== catId))}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ) : null;
          })}
          {selectedOrigins.map(origin => (
            <Badge key={origin} variant="secondary" className="gap-1">
              Origin: {origin}
              <button
                onClick={() => setSelectedOrigins(selectedOrigins.filter(o => o !== origin))}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          ))}
          {selectedCertifications.map(cert => (
            <Badge key={cert} variant="secondary" className="gap-1">
              {cert}
              <button
                onClick={() => setSelectedCertifications(selectedCertifications.filter(c => c !== cert))}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {filteredAndSortedProducts.length} products found
      </div>

      {/* Products Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
          {(selectedCategories.length > 0 || selectedOrigins.length > 0 || selectedCertifications.length > 0 || searchQuery) && (
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear all filters
            </Button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProducts.map((product, index) => (
            <div key={product.id} className="group">
              <ProductCard 
                product={product} 
                index={index}
              />
              
              {/* Additional Actions */}
              <div className="flex items-center justify-between mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleFavorite(product.id)}
                    disabled={!user}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleShare(product)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                <Button size="sm" variant="ghost" asChild>
                  <Link to={`/products/${product.slug}`}>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center text-xs font-medium">
                        {product.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link 
                          to={`/products/${product.slug}`}
                          onClick={() => handleProductClick(product.id)}
                          className="font-semibold text-lg hover:text-primary transition-colors"
                        >
                          {product.name}
                        </Link>
                        <p className="text-muted-foreground mt-1 line-clamp-2">
                          {product.short_description}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-3">
                          {product.price_range && (
                            <span className="font-medium text-primary">
                              {product.price_range} {product.currency || 'USD'}
                            </span>
                          )}
                          {product.origin && (
                            <Badge variant="outline">
                              📍 {product.origin}
                            </Badge>
                          )}
                          {product.categories && (
                            <Badge variant="secondary">
                              {product.categories.name}
                            </Badge>
                          )}
                        </div>

                        {product.certifications && product.certifications.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {product.certifications.slice(0, 3).map((cert) => (
                              <Badge key={cert} variant="outline" className="text-xs">
                                ✓ {cert}
                              </Badge>
                            ))}
                            {product.certifications.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{product.certifications.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleFavorite(product.id)}
                          disabled={!user}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleShare(product)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" asChild>
                          <Link to={`/products/${product.slug}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}