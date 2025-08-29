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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Eye, 
  Save,
  AlertTriangle,
  FileText,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';

interface FooterPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  seo_title?: string;
  seo_description?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const FooterPages = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<FooterPage | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    seo_title: '',
    seo_description: '',
    is_active: true,
    sort_order: 0
  });

  const queryClient = useQueryClient();

  // Fetch footer pages
  const { data: pages, isLoading } = useQuery({
    queryKey: ['footer-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('footer_pages')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as FooterPage[];
    }
  });

  // Create/Update mutation
  const savePageMutation = useMutation({
    mutationFn: async (pageData: typeof formData) => {
      if (editingPage) {
        const { error } = await supabase
          .from('footer_pages')
          .update(pageData)
          .eq('id', editingPage.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('footer_pages')
          .insert([pageData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footer-pages'] });
      setIsDialogOpen(false);
      resetForm();
      toast.success(editingPage ? 'Page updated successfully' : 'Page created successfully');
    },
    onError: (error) => {
      toast.error('Failed to save page: ' + error.message);
    }
  });

  // Delete mutation
  const deletePageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('footer_pages')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footer-pages'] });
      toast.success('Page deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete page: ' + error.message);
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      seo_title: '',
      seo_description: '',
      is_active: true,
      sort_order: 0
    });
    setEditingPage(null);
  };

  const handleEdit = (page: FooterPage) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      seo_title: page.seo_title || '',
      seo_description: page.seo_description || '',
      is_active: page.is_active,
      sort_order: page.sort_order
    });
    setIsDialogOpen(true);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) return;
    savePageMutation.mutate(formData);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Footer Pages</h2>
          <p className="text-muted-foreground">
            Manage footer pages like About, Privacy Policy, Terms, etc.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Page
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPage ? 'Edit Page' : 'Create New Page'}
              </DialogTitle>
              <DialogDescription>
                Create or edit footer pages with proper SEO settings
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="seo">SEO & Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="content" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Page Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g., About Us"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">URL Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="e.g., about-us"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content">Page Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Enter the page content..."
                      rows={12}
                      className="min-h-[300px]"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="seo" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="seo_title">SEO Title</Label>
                    <Input
                      id="seo_title"
                      value={formData.seo_title}
                      onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                      placeholder="SEO optimized title (60 chars max)"
                      maxLength={60}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.seo_title.length}/60 characters
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="seo_description">SEO Description</Label>
                    <Textarea
                      id="seo_description"
                      value={formData.seo_description}
                      onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                      placeholder="SEO meta description (160 chars max)"
                      maxLength={160}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.seo_description.length}/160 characters
                    </p>
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
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={savePageMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {savePageMutation.isPending ? 'Saving...' : 'Save Page'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Footer Pages
          </CardTitle>
          <CardDescription>
            Manage static pages accessible from the website footer
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading pages...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages?.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">{page.title}</TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        /page/{page.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant={page.is_active ? "default" : "secondary"}>
                        {page.is_active ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>{page.sort_order}</TableCell>
                    <TableCell>
                      {new Date(page.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/page/${page.slug}`, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(page)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this page?')) {
                              deletePageMutation.mutate(page.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(!pages || pages.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No footer pages yet. Create your first one!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick Setup Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Quick Setup Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">About Us</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Company story, mission, and values
              </p>
              <Button size="sm" variant="outline" onClick={() => {
                setFormData({
                  title: 'About Us',
                  slug: 'about-us',
                  content: '',
                  seo_title: 'About ShineVeda - Leading Agricultural Exporter',
                  seo_description: 'Learn about ShineVeda\'s journey, mission, and commitment to quality agricultural exports from Rajasthan, India.',
                  is_active: true,
                  sort_order: 1
                });
                setIsDialogOpen(true);
              }}>
                Create Page
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Privacy Policy</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Data protection and privacy terms
              </p>
              <Button size="sm" variant="outline" onClick={() => {
                setFormData({
                  title: 'Privacy Policy',
                  slug: 'privacy-policy',
                  content: '',
                  seo_title: 'Privacy Policy - ShineVeda',
                  seo_description: 'ShineVeda\'s privacy policy outlining how we collect, use, and protect your personal information.',
                  is_active: true,
                  sort_order: 2
                });
                setIsDialogOpen(true);
              }}>
                Create Page
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Terms of Service</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Legal terms and conditions
              </p>
              <Button size="sm" variant="outline" onClick={() => {
                setFormData({
                  title: 'Terms of Service',
                  slug: 'terms-of-service',
                  content: '',
                  seo_title: 'Terms of Service - ShineVeda',
                  seo_description: 'Terms and conditions for using ShineVeda\'s services and website.',
                  is_active: true,
                  sort_order: 3
                });
                setIsDialogOpen(true);
              }}>
                Create Page
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Shipping Policy</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Shipping terms and delivery info
              </p>
              <Button size="sm" variant="outline" onClick={() => {
                setFormData({
                  title: 'Shipping Policy',
                  slug: 'shipping-policy',
                  content: '',
                  seo_title: 'Shipping Policy - ShineVeda',
                  seo_description: 'Learn about ShineVeda\'s shipping policies, delivery times, and international export procedures.',
                  is_active: true,
                  sort_order: 4
                });
                setIsDialogOpen(true);
              }}>
                Create Page
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FooterPages;