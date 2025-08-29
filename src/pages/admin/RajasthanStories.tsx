import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save,
  BookOpen,
  MapPin,
  Camera,
  Play,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';

interface RajasthanStory {
  id: string;
  title: string;
  content?: string;
  village?: string;
  district?: string;
  hero_image_url?: string;
  video_url?: string;
  gallery?: any;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const DISTRICTS = [
  'Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara',
  'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur',
  'Hanumangarh', 'Jaipur', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu',
  'Jodhpur', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Pratapgarh', 'Rajsamand',
  'Sawai Madhopur', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur'
];

const RajasthanStories = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<RajasthanStory | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    village: '',
    district: '',
    hero_image_url: '',
    video_url: '',
    gallery: null,
    is_active: true,
    sort_order: 0
  });

  const queryClient = useQueryClient();

  // Fetch stories
  const { data: stories, isLoading } = useQuery({
    queryKey: ['rajasthan-stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rajasthan_stories')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as RajasthanStory[];
    }
  });

  // Create/Update mutation
  const saveStoryMutation = useMutation({
    mutationFn: async (storyData: typeof formData) => {
      if (editingStory) {
        const { error } = await supabase
          .from('rajasthan_stories')
          .update(storyData)
          .eq('id', editingStory.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('rajasthan_stories')
          .insert([storyData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rajasthan-stories'] });
      setIsDialogOpen(false);
      resetForm();
      toast.success(editingStory ? 'Story updated successfully' : 'Story created successfully');
    },
    onError: (error) => {
      toast.error('Failed to save story: ' + error.message);
    }
  });

  // Delete mutation
  const deleteStoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rajasthan_stories')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rajasthan-stories'] });
      toast.success('Story deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete story: ' + error.message);
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      village: '',
      district: '',
      hero_image_url: '',
      video_url: '',
      gallery: null,
      is_active: true,
      sort_order: 0
    });
    setEditingStory(null);
  };

  const handleEdit = (story: RajasthanStory) => {
    setEditingStory(story);
    setFormData({
      title: story.title,
      content: story.content || '',
      village: story.village || '',
      district: story.district || '',
      hero_image_url: story.hero_image_url || '',
      video_url: story.video_url || '',
      gallery: story.gallery,
      is_active: story.is_active,
      sort_order: story.sort_order
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    saveStoryMutation.mutate(formData);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rajasthan Stories</h2>
          <p className="text-muted-foreground">
            Farmer stories and agricultural success stories from Rajasthan
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Story
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingStory ? 'Edit Story' : 'Add New Story'}
              </DialogTitle>
              <DialogDescription>
                Share inspiring stories from farmers and villages across Rajasthan
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Story Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., From Traditional to Organic: A Farmer's Journey"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Select 
                    value={formData.district} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, district: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {DISTRICTS.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="village">Village</Label>
                <Input
                  id="village"
                  value={formData.village}
                  onChange={(e) => setFormData(prev => ({ ...prev, village: e.target.value }))}
                  placeholder="Village name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Story Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Tell the inspiring story..."
                  rows={8}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hero_image_url">Hero Image URL</Label>
                  <Input
                    id="hero_image_url"
                    value={formData.hero_image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, hero_image_url: e.target.value }))}
                    placeholder="https://example.com/hero-image.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="video_url">Video URL (Optional)</Label>
                  <Input
                    id="video_url"
                    value={formData.video_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Published</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saveStoryMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {saveStoryMutation.isPending ? 'Saving...' : 'Save Story'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Farmer Stories
          </CardTitle>
          <CardDescription>
            Inspiring stories from farmers and agricultural communities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading stories...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Story</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Media</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stories?.map((story) => (
                  <TableRow key={story.id}>
                    <TableCell>
                      <div className="flex items-start gap-3">
                        {story.hero_image_url && (
                          <img 
                            src={story.hero_image_url} 
                            alt={story.title}
                            className="w-16 h-12 rounded object-cover flex-shrink-0"
                          />
                        )}
                        <div>
                          <div className="font-medium">{story.title}</div>
                          {story.content && (
                            <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {story.content.substring(0, 100)}...
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {story.district && (
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            {story.district}
                          </div>
                        )}
                        {story.village && (
                          <div className="text-sm text-muted-foreground">
                            {story.village}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {story.hero_image_url && (
                          <Badge variant="secondary" className="text-xs">
                            <ImageIcon className="h-3 w-3 mr-1" />
                            Image
                          </Badge>
                        )}
                        {story.video_url && (
                          <Badge variant="secondary" className="text-xs">
                            <Play className="h-3 w-3 mr-1" />
                            Video
                          </Badge>
                        )}
                        {story.gallery && (
                          <Badge variant="secondary" className="text-xs">
                            <Camera className="h-3 w-3 mr-1" />
                            Gallery
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={story.is_active ? "default" : "secondary"}>
                        {story.is_active ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(story.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(story)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this story?')) {
                              deleteStoryMutation.mutate(story.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(!stories || stories.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No stories added yet. Share your first farmer success story!
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

export default RajasthanStories;