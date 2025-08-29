import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Wheat } from 'lucide-react';
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

interface Crop {
  id: string;
  name: string;
  hindi_name: string;
  region: string;
  season: string;
  description: string;
  features: string[];
  moisture: string;
  purity: string;
  packaging: string;
  shelf_life: string;
  export_grades: string[];
  image_url: string;
  color_class: string;
  bg_color_class: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
}

const CropPortfolio = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    hindi_name: '',
    region: '',
    season: '',
    description: '',
    features: '',
    moisture: '',
    purity: '',
    packaging: '',
    shelf_life: '',
    export_grades: '',
    image_url: '',
    color_class: 'text-green-600',
    bg_color_class: 'bg-green-100',
    is_featured: false,
    is_active: true,
    sort_order: 0
  });

  const queryClient = useQueryClient();

  const { data: crops = [], isLoading } = useQuery({
    queryKey: ['crop-portfolio-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crop_portfolio')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newCrop: any) => {
      const { data, error } = await supabase
        .from('crop_portfolio')
        .insert([{
          ...newCrop,
          features: newCrop.features.split(',').map((f: string) => f.trim()).filter(Boolean),
          export_grades: newCrop.export_grades.split(',').map((g: string) => g.trim()).filter(Boolean)
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crop-portfolio-admin'] });
      queryClient.invalidateQueries({ queryKey: ['crop-portfolio'] });
      toast.success('Crop created successfully');
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error('Failed to create crop');
      console.error(error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from('crop_portfolio')
        .update({
          ...updates,
          features: updates.features.split(',').map((f: string) => f.trim()).filter(Boolean),
          export_grades: updates.export_grades.split(',').map((g: string) => g.trim()).filter(Boolean)
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crop-portfolio-admin'] });
      queryClient.invalidateQueries({ queryKey: ['crop-portfolio'] });
      toast.success('Crop updated successfully');
      setEditingCrop(null);
      resetForm();
    },
    onError: (error) => {
      toast.error('Failed to update crop');
      console.error(error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('crop_portfolio')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crop-portfolio-admin'] });
      queryClient.invalidateQueries({ queryKey: ['crop-portfolio'] });
      toast.success('Crop deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete crop');
      console.error(error);
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      hindi_name: '',
      region: '',
      season: '',
      description: '',
      features: '',
      moisture: '',
      purity: '',
      packaging: '',
      shelf_life: '',
      export_grades: '',
      image_url: '',
      color_class: 'text-green-600',
      bg_color_class: 'bg-green-100',
      is_featured: false,
      is_active: true,
      sort_order: 0
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCrop) {
      updateMutation.mutate({ ...formData, id: editingCrop.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const startEdit = (crop: Crop) => {
    setEditingCrop(crop);
    setFormData({
      ...crop,
      features: crop.features?.join(', ') || '',
      export_grades: crop.export_grades?.join(', ') || ''
    });
  };

  const filteredCrops = crops.filter((crop: any) => 
    crop.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crop.hindi_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crop.region?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Crop Portfolio Management</h1>
        <Dialog open={isCreateOpen || !!editingCrop} onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditingCrop(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Crop
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCrop ? 'Edit Crop' : 'Add New Crop'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="hindi_name">Hindi Name</Label>
                  <Input
                    id="hindi_name"
                    value={formData.hindi_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, hindi_name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="season">Season</Label>
                  <Input
                    id="season"
                    value={formData.season}
                    onChange={(e) => setFormData(prev => ({ ...prev, season: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="features">Features (comma separated)</Label>
                  <Textarea
                    id="features"
                    value={formData.features}
                    onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="export_grades">Export Grades (comma separated)</Label>
                  <Textarea
                    id="export_grades"
                    value={formData.export_grades}
                    onChange={(e) => setFormData(prev => ({ ...prev, export_grades: e.target.value }))}
                    rows={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="moisture">Moisture</Label>
                  <Input
                    id="moisture"
                    value={formData.moisture}
                    onChange={(e) => setFormData(prev => ({ ...prev, moisture: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="purity">Purity</Label>
                  <Input
                    id="purity"
                    value={formData.purity}
                    onChange={(e) => setFormData(prev => ({ ...prev, purity: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="packaging">Packaging</Label>
                  <Input
                    id="packaging"
                    value={formData.packaging}
                    onChange={(e) => setFormData(prev => ({ ...prev, packaging: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="shelf_life">Shelf Life</Label>
                  <Input
                    id="shelf_life"
                    value={formData.shelf_life}
                    onChange={(e) => setFormData(prev => ({ ...prev, shelf_life: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="color_class">Color Class</Label>
                  <Input
                    id="color_class"
                    value={formData.color_class}
                    onChange={(e) => setFormData(prev => ({ ...prev, color_class: e.target.value }))}
                    placeholder="e.g., text-red-600"
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
                    setEditingCrop(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingCrop ? 'Update' : 'Create'} Crop
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
            placeholder="Search crops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredCrops.map((crop: any) => (
          <Card key={crop.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={crop.image_url || '/placeholder.svg'}
                      alt={crop.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{crop.name}</h3>
                      {crop.hindi_name && (
                        <span className="text-muted-foreground">({crop.hindi_name})</span>
                      )}
                      {crop.is_featured && <Badge variant="secondary">Featured</Badge>}
                      {!crop.is_active && <Badge variant="destructive">Inactive</Badge>}
                    </div>
                    <p className="text-muted-foreground mb-2">{crop.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{crop.region}</span>
                      <span>{crop.season}</span>
                      <span>Order: {crop.sort_order}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(crop)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this crop?')) {
                        deleteMutation.mutate(crop.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CropPortfolio;