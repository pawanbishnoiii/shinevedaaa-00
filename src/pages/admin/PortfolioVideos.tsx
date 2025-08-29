import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Play, Pause } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  video_type: string;
  duration: number;
  category: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

const PortfolioVideosAdmin: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingVideo, setEditingVideo] = React.useState<Video | null>(null);
  const queryClient = useQueryClient();

  const { data: videos, isLoading } = useQuery({
    queryKey: ['admin-portfolio-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_videos')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as Video[];
    }
  });

  const createVideoMutation = useMutation({
    mutationFn: async (videoData: Partial<Video>) => {
      const { data, error } = await supabase
        .from('portfolio_videos')
        .insert([videoData as any])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio-videos'] });
      toast.success('Video added successfully!');
      setIsFormOpen(false);
    },
    onError: () => {
      toast.error('Failed to add video');
    }
  });

  const updateVideoMutation = useMutation({
    mutationFn: async ({ id, ...videoData }: Partial<Video> & { id: string }) => {
      const { data, error } = await supabase
        .from('portfolio_videos')
        .update(videoData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio-videos'] });
      toast.success('Video updated successfully!');
      setEditingVideo(null);
    },
    onError: () => {
      toast.error('Failed to update video');
    }
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('portfolio_videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio-videos'] });
      toast.success('Video deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete video');
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const videoData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      video_url: formData.get('video_url') as string,
      thumbnail_url: formData.get('thumbnail_url') as string,
      video_type: formData.get('video_type') as string,
      category: formData.get('category') as string,
      duration: parseInt(formData.get('duration') as string) || 0,
      is_featured: formData.get('is_featured') === 'true',
      is_active: formData.get('is_active') === 'true',
      sort_order: parseInt(formData.get('sort_order') as string) || 0,
    };

    if (editingVideo) {
      updateVideoMutation.mutate({ id: editingVideo.id, ...videoData });
    } else {
      createVideoMutation.mutate(videoData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Videos</h1>
          <p className="text-muted-foreground">Manage video content for your portfolio</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Video
        </Button>
      </div>

      {/* Video Form */}
      {(isFormOpen || editingVideo) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingVideo ? 'Edit Video' : 'Add New Video'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingVideo?.title}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="video_type">Video Type</Label>
                  <Select name="video_type" defaultValue={editingVideo?.video_type || 'youtube'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="vimeo">Vimeo</SelectItem>
                      <SelectItem value="direct">Direct URL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingVideo?.description}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="video_url">Video URL</Label>
                  <Input
                    id="video_url"
                    name="video_url"
                    type="url"
                    defaultValue={editingVideo?.video_url}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                  <Input
                    id="thumbnail_url"
                    name="thumbnail_url"
                    type="url"
                    defaultValue={editingVideo?.thumbnail_url}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" defaultValue={editingVideo?.category || 'general'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hero">Hero</SelectItem>
                      <SelectItem value="testimonial">Testimonial</SelectItem>
                      <SelectItem value="tutorial">Tutorial</SelectItem>
                      <SelectItem value="showcase">Showcase</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration (seconds)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    defaultValue={editingVideo?.duration}
                  />
                </div>
                <div>
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    name="sort_order"
                    type="number"
                    defaultValue={editingVideo?.sort_order || 0}
                  />
                </div>
                <div>
                  <Label htmlFor="is_featured">Featured</Label>
                  <Select name="is_featured" defaultValue={editingVideo?.is_featured ? 'true' : 'false'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="is_active">Status</Label>
                <Select name="is_active" defaultValue={editingVideo?.is_active ? 'true' : 'false'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingVideo(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createVideoMutation.isPending || updateVideoMutation.isPending}
                >
                  {editingVideo ? 'Update' : 'Create'} Video
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Videos Table */}
      <Card>
        <CardHeader>
          <CardTitle>Videos ({videos?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Sort</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videos?.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{video.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {video.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {video.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {video.video_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={video.is_active ? 'default' : 'destructive'}>
                        {video.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {video.is_featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                    </TableCell>
                    <TableCell>{video.sort_order}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingVideo(video)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteVideoMutation.mutate(video.id)}
                          disabled={deleteVideoMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioVideosAdmin;