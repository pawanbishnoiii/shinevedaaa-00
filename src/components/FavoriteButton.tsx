import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface FavoriteButtonProps {
  productId: string;
  productName: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  productId, 
  productName, 
  size = 'md',
  variant = 'ghost'
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Check if product is favorited
  const { data: isFavorited } = useQuery({
    queryKey: ['favorite', productId, user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data } = await supabase
        .from('product_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();
      
      return !!data;
    },
    enabled: !!user
  });

  // Toggle favorite mutation
  const toggleFavorite = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Please login to add favorites');

      if (isFavorited) {
        // Remove favorite
        await supabase
          .from('product_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
      } else {
        // Add favorite
        await supabase
          .from('product_favorites')
          .insert({
            user_id: user.id,
            product_id: productId
          });

        // Track interaction
        await supabase
          .from('product_interactions')
          .insert({
            user_id: user.id,
            product_id: productId,
            interaction_type: 'favorite',
            weight: 3
          });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite', productId, user?.id] });
      toast.success(
        isFavorited 
          ? `Removed ${productName} from favorites` 
          : `Added ${productName} to favorites`
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Please login to add favorites');
    }
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to add favorites');
      return;
    }
    
    toggleFavorite.mutate();
  };

  const getSize = () => {
    switch (size) {
      case 'sm': return 'h-3 w-3';
      case 'lg': return 'h-6 w-6';
      default: return 'h-4 w-4';
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm': return 'h-8 w-8';
      case 'lg': return 'h-12 w-12';
      default: return 'h-10 w-10';
    }
  };

  return (
    <Button
      variant={variant}
      size="icon"
      className={`${getButtonSize()} transition-all duration-200 hover:scale-110 ${
        isFavorited ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'
      }`}
      onClick={handleClick}
      disabled={toggleFavorite.isPending}
    >
      <Heart 
        className={`${getSize()} transition-all duration-200 ${
          isFavorited ? 'fill-current' : ''
        } ${toggleFavorite.isPending ? 'animate-pulse' : ''}`} 
      />
    </Button>
  );
};

export default FavoriteButton;