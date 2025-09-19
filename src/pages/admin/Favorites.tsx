import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Heart, Search, Users, Package, Calendar, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const Favorites = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');

  const { data: favoritesData, isLoading } = useQuery({
    queryKey: ['admin-favorites', searchTerm, categoryFilter, sortBy],
    queryFn: async () => {
      let query = supabase
        .from('product_favorites')
        .select(`
          id,
          created_at,
          user_id,
          products!product_id (
            id,
            name,
            slug,
            image_url,
            price_range,
            currency,
            stock_status,
            categories!category_id (
              name,
              slug
            )
          )
        `)
        .order(sortBy === 'created_at' ? 'created_at' : 'created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      // Filter by search term and category on client side for simplicity
      let filtered = data || [];
      
      if (searchTerm) {
        filtered = filtered.filter(item => 
          item.products?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.user_id?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (categoryFilter && categoryFilter !== 'all') {
        filtered = filtered.filter(item => 
          item.products?.categories?.slug === categoryFilter
        );
      }

      // Sort data
      if (sortBy === 'user_name') {
        filtered.sort((a, b) => (a.user_id || '').localeCompare(b.user_id || ''));
      } else if (sortBy === 'product_name') {
        filtered.sort((a, b) => (a.products?.name || '').localeCompare(b.products?.name || ''));
      }

      return filtered;
    }
  });

  const { data: categories } = useQuery({
    queryKey: ['categories-for-filter'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('name, slug')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  // Calculate stats
  const totalFavorites = favoritesData?.length || 0;
  const uniqueUsers = new Set(favoritesData?.map(f => f.user_id)).size;
  const uniqueProducts = new Set(favoritesData?.map(f => f.products?.id).filter(Boolean)).size;

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Favorites</h2>
          <p className="text-muted-foreground">
            Monitor which products users are favoriting
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{totalFavorites}</p>
                <p className="text-sm text-muted-foreground">Total Favorites</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{uniqueUsers}</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{uniqueProducts}</p>
                <p className="text-sm text-muted-foreground">Favorited Products</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by product name, user name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.slug} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Latest First</SelectItem>
                <SelectItem value="user_name">User Name</SelectItem>
                <SelectItem value="product_name">Product Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Favorites Table */}
      <Card>
        <CardHeader>
          <CardTitle>Favorites List</CardTitle>
          <CardDescription>
            All user favorites with product and user details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Heart className="h-8 w-8 animate-pulse text-red-500" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>User Details</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock & Price</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {favoritesData?.map((favorite) => (
                  <TableRow key={favorite.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {favorite.products?.image_url && (
                          <img
                            src={favorite.products.image_url}
                            alt={favorite.products.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">
                            {favorite.products?.name || 'Unknown Product'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {favorite.products?.price_range || 'Contact for pricing'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">User ID</div>
                        <div className="text-sm text-muted-foreground">
                          {favorite.user_id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {favorite.products?.categories?.name && (
                        <Badge variant="outline">
                          {favorite.products.categories.name}
                        </Badge>
                      )}
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {favorite.products?.price_range || 'Contact for pricing'}
                        </div>
                        {favorite.products?.currency && (
                          <div className="text-sm text-muted-foreground">
                            Currency: {favorite.products.currency}
                          </div>
                        )}
                        {favorite.products?.stock_status && (
                          <Badge variant={
                            favorite.products.stock_status === 'in_stock' ? 'default' :
                            favorite.products.stock_status === 'limited' ? 'secondary' : 'destructive'
                          }>
                            {favorite.products.stock_status.replace('_', ' ')}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {format(new Date(favorite.created_at), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/products/${favorite.products?.slug}`}>
                          View Product
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(!favoritesData || favoritesData.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">No favorites found</p>
                      <p className="text-muted-foreground">
                        {searchTerm || categoryFilter !== 'all' 
                          ? 'Try adjusting your filters' 
                          : 'Users haven\'t favorited any products yet'
                        }
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Favorites;