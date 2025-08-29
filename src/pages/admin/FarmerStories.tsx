import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Heart, MapPin } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface FarmerStory {
  id: string;
  name: string;
  location: string;
  state: string;
  title: string;
  excerpt: string;
  full_story: string;
  before_metric: string;
  before_value: string;
  after_metric: string;
  after_value: string;
  improvement: string;
  image_url: string;
  category: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
}

const categories = [
  { value: 'success', label: 'Success Story' },
  { value: 'innovation', label: 'Innovation' },
  { value: 'community', label: 'Community Impact' }
];

const FarmerStories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<FarmerStory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    state: '',
    title: '',
    excerpt: '',
    full_story: '',
    before_metric: '',
    before_value: '',
    after_metric: '',
    after_value: '',
    improvement: '',
    image_url: '',
    category: 'success',
    is_featured: false,
    is_active: true,
    sort_order: 0
  });

  const queryClient = useQueryClient();

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ['farmer-stories-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('farmer_stories')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newStory: any) => {
      const { data, error } = await supabase
        .from('farmer_stories')
        .insert([newStory])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer-stories-admin'] });
      queryClient.invalidateQueries({ queryKey: ['farmer-stories'] });
      toast.success('Farmer story created successfully');
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error('Failed to create story');
      console.error(error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from('farmer_stories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer-stories-admin'] });
      queryClient.invalidateQueries({ queryKey: ['farmer-stories'] });
      toast.success('Farmer story updated successfully');
      setEditingStory(null);
      resetForm();
    },
    onError: (error) => {
      toast.error('Failed to update story');
      console.error(error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('farmer_stories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer-stories-admin'] });
      queryClient.invalidateQueries({ queryKey: ['farmer-stories'] });
      toast.success('Farmer story deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete story');
      console.error(error);
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      state: '',
      title: '',
      excerpt: '',
      full_story: '',
      before_metric: '',
      before_value: '',
      after_metric: '',
      after_value: '',
      improvement: '',
      image_url: '',
      category: 'success',
      is_featured: false,
      is_active: true,
      sort_order: 0
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingStory) {
      updateMutation.mutate({ ...formData, id: editingStory.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const startEdit = (story: FarmerStory) => {
    setEditingStory(story);
    setFormData(story);
  };

  const filteredStories = stories.filter((story: any) => {
    const matchesSearch = story.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || story.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Farmer Stories Management</h1>
        <Dialog open={isCreateOpen || !!editingStory} onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditingStory(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Story
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingStory ? 'Edit Farmer Story' : 'Add New Farmer Story'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Farmer Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="title">Story Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="full_story">Full Story</Label>
                <Textarea
                  id="full_story"
                  value={formData.full_story}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_story: e.target.value }))}
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="before_metric">Before Metric</Label>
                  <Input
                    id="before_metric"
                    value={formData.before_metric}
                    onChange={(e) => setFormData(prev => ({ ...prev, before_metric: e.target.value }))}
                    placeholder="e.g., Annual Income"
                  />
                </div>
                <div>
                  <Label htmlFor="before_value">Before Value</Label>
                  <Input
                    id="before_value"
                    value={formData.before_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, before_value: e.target.value }))}
                    placeholder="e.g., ₹80,000"
                  />
                </div>
                <div>
                  <Label htmlFor="after_metric">After Metric</Label>
                  <Input
                    id="after_metric"
                    value={formData.after_metric}
                    onChange={(e) => setFormData(prev => ({ ...prev, after_metric: e.target.value }))}
                    placeholder="e.g., Annual Income"
                  />
                </div>
                <div>
                  <Label htmlFor="after_value">After Value</Label>
                  <Input
                    id="after_value"
                    value={formData.after_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, after_value: e.target.value }))}
                    placeholder="e.g., ₹1,04,000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="improvement">Improvement</Label>
                  <Input
                    id="improvement"
                    value={formData.improvement}
                    onChange={(e) => setFormData(prev => ({ ...prev, improvement: e.target.value }))}
                    placeholder="e.g., +30% increase"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                />
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
                    setEditingStory(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingStory ? 'Update' : 'Create'} Story
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
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {filteredStories.map((story: any) => (
          <Card key={story.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={story.image_url || '/placeholder.svg'}
                      alt={story.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{story.name}</h3>
                      {story.is_featured && <Badge variant="secondary">Featured</Badge>}
                      {!story.is_active && <Badge variant="destructive">Inactive</Badge>}
                      <Badge variant="outline" className="capitalize">
                        {story.category}
                      </Badge>
                    </div>
                    <h4 className="text-md font-medium text-primary mb-2">{story.title}</h4>
                    <p className="text-muted-foreground mb-2 line-clamp-2">{story.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {story.location}, {story.state}
                      </div>
                      <span>Order: {story.sort_order}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(story)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this story?')) {
                        deleteMutation.mutate(story.id);
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

export default FarmerStories;