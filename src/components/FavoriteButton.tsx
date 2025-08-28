import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { trackProductInteraction } from '@/utils/analytics';

interface FavoriteButtonProps {
  productId: string;
}

const FavoriteButton = ({ productId }: FavoriteButtonProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);

  // Check if product is favorited
  const { data: isFavorited, isLoading } = useQuery({
    queryKey: ['favorite', productId, user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      const { data, error } = await supabase
        .from('product_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    },
    enabled: !!user?.id
  });

  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        toast.error('Please sign in to save favorites');
        return;
      }

      if (isFavorited) {
        // Remove favorite
        const { error } = await supabase
          .from('product_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
        
        if (error) throw error;
        return false;
      } else {
        // Add favorite
        const { error } = await supabase
          .from('product_favorites')
          .insert({
            user_id: user.id,
            product_id: productId
          });
        
        if (error) throw error;
        return true;
      }
    },
    onSuccess: (newFavoriteStatus) => {
      queryClient.invalidateQueries({ queryKey: ['favorite', productId, user?.id] });
      
      if (newFavoriteStatus) {
        toast.success('Added to favorites!');
        trackProductInteraction(productId, 'favorite', 2);
      } else {
        toast.success('Removed from favorites');
      }
    },
    onError: (error) => {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  });

  const handleToggleFavorite = () => {
    if (!user) {
      toast.error('Please sign in to save favorites');
      return;
    }
    toggleFavoriteMutation.mutate();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleFavorite}
      disabled={isLoading || toggleFavoriteMutation.isPending}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-10 w-10 rounded-full hover:bg-red-50 group transition-all duration-200"
    >
      <Heart 
        className={`h-4 w-4 transition-all duration-200 ${
          isFavorited 
            ? 'fill-red-500 text-red-500' 
            : isHovered 
              ? 'fill-red-200 text-red-500' 
              : 'text-gray-500 group-hover:text-red-500'
        }`} 
      />
    </Button>
  );
};

export default FavoriteButton;