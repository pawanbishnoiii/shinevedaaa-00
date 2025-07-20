import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Edit, 
  Save, 
  RefreshCw,
  Globe,
  Layout,
  Users,
  MessageSquare,
  Image,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

const Content = () => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const queryClient = useQueryClient();

  const { data: contentBlocks, isLoading } = useQuery({
    queryKey: ['admin-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_blocks')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const { error } = await supabase
        .from('content_blocks')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-content'] });
      toast.success('Content updated successfully');
      setIsEditing(null);
    },
    onError: () => {
      toast.error('Failed to update content');
    }
  });

  const handleEdit = (block: any) => {
    setIsEditing(block.id);
    setFormData({
      title: block.title || '',
      content: block.content || '',
      data: typeof block.data === 'string' ? block.data : JSON.stringify(block.data, null, 2)
    });
  };

  const handleSave = (id: string) => {
    let parsedData = {};
    try {
      parsedData = JSON.parse(formData.data || '{}');
    } catch (error) {
      toast.error('Invalid JSON format in data field');
      return;
    }

    updateMutation.mutate({
      id,
      data: {
        title: formData.title,
        content: formData.content,
        data: parsedData,
        updated_at: new Date().toISOString()
      }
    });
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({});
  };

  const getBlockIcon = (key: string) => {
    if (key.includes('hero')) return Layout;
    if (key.includes('company')) return Users;
    if (key.includes('contact')) return MessageSquare;
    return FileText;
  };

  const HeroContentEditor = ({ block }: { block: any }) => {
    const data = typeof block.data === 'string' ? JSON.parse(block.data || '{}') : block.data;
    
    return (
      <div className="space-y-4">
        <div>
          <Label>Main Title</Label>
          <Input
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Hero section title"
          />
        </div>
        
        <div>
          <Label>Subtitle/Description</Label>
          <Textarea
            value={formData.content || ''}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Hero section description"
            rows={3}
          />
        </div>

        <div>
          <Label>Additional Data (JSON)</Label>
          <Textarea
            value={formData.data || ''}
            onChange={(e) => setFormData({ ...formData, data: e.target.value })}
            placeholder='{"subtitle": "...", "stats": []}'
            rows={6}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter JSON data for stats, buttons, and other dynamic content
          </p>
        </div>
      </div>
    );
  };

  const GenericContentEditor = ({ block }: { block: any }) => (
    <div className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Content title"
        />
      </div>
      
      <div>
        <Label>Content</Label>
        <Textarea
          value={formData.content || ''}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Content body"
          rows={4}
        />
      </div>

      <div>
        <Label>Additional Data (JSON)</Label>
        <Textarea
          value={formData.data || ''}
          onChange={(e) => setFormData({ ...formData, data: e.target.value })}
          placeholder='{}'
          rows={4}
          className="font-mono text-sm"
        />
      </div>
    </div>
  );

  const ContentBlockCard = ({ block }: { block: any }) => {
    const Icon = getBlockIcon(block.key);
    const isCurrentlyEditing = isEditing === block.id;

    return (
      <Card key={block.id} className="relative">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-lg">{block.title || block.key}</CardTitle>
                <CardDescription className="capitalize">
                  {block.key.replace(/_/g, ' ')} section
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={block.is_active ? "default" : "secondary"}>
                {block.is_active ? 'Active' : 'Inactive'}
              </Badge>
              {!isCurrentlyEditing && (
                <Button size="sm" onClick={() => handleEdit(block)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {isCurrentlyEditing ? (
            <div className="space-y-4">
              {block.key === 'hero_main' ? (
                <HeroContentEditor block={block} />
              ) : (
                <GenericContentEditor block={block} />
              )}
              
              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  onClick={() => handleSave(block.id)}
                  disabled={updateMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Content:</p>
                <p className="text-sm line-clamp-3">{block.content}</p>
              </div>
              
              {block.data && Object.keys(block.data).length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Data:</p>
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                    {JSON.stringify(block.data, null, 2)}
                  </pre>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground">
                Last updated: {new Date(block.updated_at).toLocaleString()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Content Management</h2>
          <p className="text-muted-foreground">
            Manage dynamic content for your website sections
          </p>
        </div>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-content'] })}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="website" className="space-y-6">
        <TabsList>
          <TabsTrigger value="website" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Website Content
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Media Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="website" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Website Sections</CardTitle>
              <CardDescription>
                Edit content for different sections of your website. Changes will be reflected immediately on the live site.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <FileText className="h-8 w-8 animate-pulse" />
                </div>
              ) : (
                <div className="space-y-6">
                  {contentBlocks?.map((block) => (
                    <ContentBlockCard key={block.id} block={block} />
                  ))}
                  
                  {(!contentBlocks || contentBlocks.length === 0) && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No content blocks found.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Media & Asset Settings</CardTitle>
              <CardDescription>
                Configure media settings and asset management options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Image Optimization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-compress images</span>
                      <Badge variant="outline">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Generate thumbnails</span>
                      <Badge variant="outline">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">WebP conversion</span>
                      <Badge variant="outline">Enabled</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Storage Usage</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Images</span>
                        <span>45 MB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Videos</span>
                        <span>128 MB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Documents</span>
                        <span>12 MB</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-medium">
                        <span>Total</span>
                        <span>185 MB</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Content;