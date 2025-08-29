import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GripVertical, Star, Package, Save } from 'lucide-react';
import { toast } from 'sonner';

const FeaturedProducts = () => {
  const queryClient = useQueryClient();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  // Fetch all products
  const { data: allProducts = [] } = useQuery({
    queryKey: ['all-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch current featured products
  const { data: currentFeatured = [], isLoading } = useQuery({
    queryKey: ['featured-products-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('featured_rank', { ascending: true });
      
      if (error) throw error;
      setFeaturedProducts(data || []);
      return data || [];
    }
  });

  // Update featured products mutation
  const updateFeaturedMutation = useMutation({
    mutationFn: async (updates: { id: string; is_featured: boolean; featured_rank?: number }[]) => {
      const promises = updates.map(update => 
        supabase
          .from('products')
          .update({ 
            is_featured: update.is_featured, 
            featured_rank: update.featured_rank || 0 
          })
          .eq('id', update.id)
      );
      
      const results = await Promise.all(promises);
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error('Failed to update some products');
      }
    },
    onSuccess: () => {
      toast.success('Featured products updated successfully');
      queryClient.invalidateQueries({ queryKey: ['featured-products-admin'] });
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
    },
    onError: () => {
      toast.error('Failed to update featured products');
    }
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(featuredProducts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFeaturedProducts(items);
  };

  const addFeaturedProduct = (productId: string) => {
    const product = allProducts.find(p => p.id === productId);
    if (product && featuredProducts.length < 3) {
      setFeaturedProducts([...featuredProducts, product]);
    }
  };

  const removeFeaturedProduct = (productId: string) => {
    setFeaturedProducts(featuredProducts.filter(p => p.id !== productId));
  };

  const saveFeaturedProducts = () => {
    // First, clear all featured flags
    const clearUpdates = allProducts.map(product => ({
      id: product.id,
      is_featured: false,
      featured_rank: 0
    }));

    // Then set the featured products with their ranks
    const featuredUpdates = featuredProducts.map((product, index) => ({
      id: product.id,
      is_featured: true,
      featured_rank: index + 1
    }));

    updateFeaturedMutation.mutate([...clearUpdates, ...featuredUpdates]);
  };

  const availableProducts = allProducts.filter(
    product => !featuredProducts.find(fp => fp.id === product.id)
  );

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
          <p className="text-muted-foreground">
            Manage which products are featured on your homepage (maximum 3)
          </p>
        </div>
        <Button 
          onClick={saveFeaturedProducts}
          disabled={updateFeaturedMutation.isPending}
          className="bg-primary hover:bg-primary/90"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Featured Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Featured Products ({featuredProducts.length}/3)
            </CardTitle>
            <CardDescription>
              Drag to reorder. First position will be the primary featured product.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {featuredProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No featured products selected</p>
                <p className="text-sm">Add products from the available list</p>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="featured-products">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                      {featuredProducts.map((product, index) => (
                        <Draggable key={product.id} draggableId={product.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center gap-3 p-3 border rounded-lg ${
                                snapshot.isDragging ? 'shadow-lg' : ''
                              }`}
                            >
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                              </div>
                              
                              <Badge variant={index === 0 ? 'default' : 'secondary'}>
                                {index === 0 ? '1st' : index === 1 ? '2nd' : '3rd'}
                              </Badge>

                              {product.image_url && (
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  className="h-10 w-10 rounded object-cover"
                                />
                              )}

                              <div className="flex-1">
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {product.short_description}
                                </div>
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFeaturedProduct(product.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </CardContent>
        </Card>

        {/* Available Products */}
        <Card>
          <CardHeader>
            <CardTitle>Available Products</CardTitle>
            <CardDescription>
              Select products to feature on your homepage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select onValueChange={addFeaturedProduct} disabled={featuredProducts.length >= 3}>
                <SelectTrigger>
                  <SelectValue 
                    placeholder={
                      featuredProducts.length >= 3 
                        ? "Maximum 3 products featured" 
                        : "Select a product to feature"
                    } 
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      <div className="flex items-center gap-2">
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-6 w-6 rounded object-cover"
                          />
                        )}
                        {product.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {availableProducts.slice(0, 10).map((product) => (
                <div key={product.id} className="flex items-center gap-3 p-2 border rounded">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-8 w-8 rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-sm">{product.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {product.short_description}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addFeaturedProduct(product.id)}
                    disabled={featuredProducts.length >= 3}
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Homepage Preview</CardTitle>
          <CardDescription>
            This is how your featured products will appear on the homepage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className="border rounded-lg p-4 relative">
                <Badge className="absolute top-2 right-2" variant={index === 0 ? 'default' : 'secondary'}>
                  {index === 0 ? 'Primary' : `Position ${index + 1}`}
                </Badge>
                
                <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden">
                  <img
                    src={product.image_url || '/placeholder.svg'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {product.short_description}
                </p>
                
                {product.price_range && (
                  <div className="mt-2 text-sm font-medium text-primary">
                    {product.price_range}
                  </div>
                )}
              </div>
            ))}
            
            {/* Empty slots */}
            {Array.from({ length: 3 - featuredProducts.length }).map((_, index) => (
              <div key={`empty-${index}`} className="border-2 border-dashed rounded-lg p-4 text-center text-muted-foreground">
                <div className="aspect-square bg-muted/50 rounded-lg mb-3 flex items-center justify-center">
                  <Package className="h-8 w-8 opacity-50" />
                </div>
                <p className="text-sm">Featured Product Slot</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedProducts;