import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Image as ImageIcon, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GalleryImage {
  id: string;
  title: string;
  alt_text: string;
  src: string;
  category: string;
  description?: string;
  photographer?: string;
  license_type?: string;
  license_url?: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
}

const GalleryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    alt_text: '',
    src: '',
    category: 'agriculture',
    description: '',
    photographer: '',
    license_type: 'CC BY',
    license_url: '',
    is_featured: false,
    is_active: true,
    sort_order: 0
  });

  const queryClient = useQueryClient();

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['gallery-images-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newImage: any) => {
      const { data, error } = await supabase
        .from('gallery_images')
        .insert([newImage])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images-admin'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      toast.success('Image added successfully');
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error('Failed to add image');
      console.error(error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from('gallery_images')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images-admin'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      toast.success('Image updated successfully');
      setEditingImage(null);
      resetForm();
    },
    onError: (error) => {
      toast.error('Failed to update image');
      console.error(error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images-admin'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      toast.success('Image deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete image');
      console.error(error);
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      alt_text: '',
      src: '',
      category: 'agriculture',
      description: '',
      photographer: '',
      license_type: 'CC BY',
      license_url: '',
      is_featured: false,
      is_active: true,
      sort_order: 0
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingImage) {
      updateMutation.mutate({ ...formData, id: editingImage.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const startEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      alt_text: image.alt_text,
      src: image.src,
      category: image.category,
      description: image.description || '',
      photographer: image.photographer || '',
      license_type: image.license_type || 'CC BY',
      license_url: image.license_url || '',
      is_featured: image.is_featured,
      is_active: image.is_active,
      sort_order: image.sort_order
    });
  };

  const filteredImages = images.filter((image: any) => 
    image.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.alt_text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gallery Management</h1>
        <Dialog open={isCreateOpen || !!editingImage} onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditingImage(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingImage ? 'Edit Image' : 'Add New Image'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agriculture">Agriculture</SelectItem>
                      <SelectItem value="farming">Farming</SelectItem>
                      <SelectItem value="crops">Crops</SelectItem>
                      <SelectItem value="harvest">Harvest</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="src">Image URL</Label>
                <Input
                  id="src"
                  value={formData.src}
                  onChange={(e) => setFormData(prev => ({ ...prev, src: e.target.value }))}
                  required
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <Label htmlFor="alt_text">Alt Text</Label>
                <Input
                  id="alt_text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
                  required
                  placeholder="Descriptive text for accessibility"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="photographer">Photographer</Label>
                  <Input
                    id="photographer"
                    value={formData.photographer}
                    onChange={(e) => setFormData(prev => ({ ...prev, photographer: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="license_type">License Type</Label>
                  <Select value={formData.license_type} onValueChange={(value) => setFormData(prev => ({ ...prev, license_type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CC BY">CC BY</SelectItem>
                      <SelectItem value="CC BY-SA">CC BY-SA</SelectItem>
                      <SelectItem value="CC BY-NC">CC BY-NC</SelectItem>
                      <SelectItem value="CC0">CC0 (Public Domain)</SelectItem>
                      <SelectItem value="All Rights Reserved">All Rights Reserved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="license_url">License URL</Label>
                  <Input
                    id="license_url"
                    value={formData.license_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, license_url: e.target.value }))}
                    placeholder="https://creativecommons.org/..."
                  />
                </div>
                <div>
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                  />
                  <Label htmlFor="is_featured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingImage(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingImage ? 'Update' : 'Create'} Image
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image: any) => (
          <Card key={image.id}>
            <CardContent className="p-4">
              <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-muted">
                <img
                  src={image.src}
                  alt={image.alt_text}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold truncate">{image.title}</h3>
                  <div className="flex gap-1">
                    {image.is_featured && <Badge variant="secondary">Featured</Badge>}
                    {!image.is_active && <Badge variant="destructive">Inactive</Badge>}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Category: {image.category}
                </p>
                {image.photographer && (
                  <p className="text-sm text-muted-foreground">
                    Photo by: {image.photographer}
                  </p>
                )}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-muted-foreground">
                    Order: {image.sort_order}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(image)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this image?')) {
                          deleteMutation.mutate(image.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GalleryManagement;