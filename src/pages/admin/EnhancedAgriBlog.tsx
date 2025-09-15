import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Save,
  Image as ImageIcon,
  Video,
  Link,
  Bold,
  Italic,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function EnhancedAgriBlog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [blogData, setBlogData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'farmer-stories',
    author: 'Admin',
    author_type: 'admin',
    tags: [],
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    image_url: '',
    is_active: true,
    featured: false,
    read_time: '5 min read'
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const quillRef = useRef<ReactQuill>(null);

  // Rich text editor modules
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'align', 'link', 'image', 'video',
    'blockquote', 'code-block', 'color', 'background'
  ];

  // Fetch blog posts
  const { data: blogPosts = [], isLoading } = useQuery({
    queryKey: ['agri-blog-posts', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('agri_blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Create/Update post mutation
  const postMutation = useMutation({
    mutationFn: async (data: any) => {
      // Auto-generate slug from title if not provided
      if (!data.slug && data.title) {
        data.slug = data.title.toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
      }

      if (editingPost) {
        const { error } = await supabase
          .from('agri_blog_posts')
          .update(data)
          .eq('id', editingPost.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('agri_blog_posts')
          .insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agri-blog-posts'] });
      toast({
        title: editingPost ? "Post Updated" : "Post Created",
        description: "Blog post has been saved successfully.",
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('agri_blog_posts')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agri-blog-posts'] });
      toast({
        title: "Post Deleted",
        description: "Blog post has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setBlogData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'farmer-stories',
      author: 'Admin',
      author_type: 'admin',
      tags: [],
      seo_title: '',
      seo_description: '',
      seo_keywords: '',
      image_url: '',
      is_active: true,
      featured: false,
      read_time: '5 min read'
    });
    setEditingPost(null);
    setIsCreateOpen(false);
    setPreviewMode(false);
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setBlogData({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      category: post.category || 'farmer-stories',
      author: post.author || 'Admin',
      author_type: post.author_type || 'admin',
      tags: post.tags || [],
      seo_title: post.seo_title || '',
      seo_description: post.seo_description || '',
      seo_keywords: post.seo_keywords || '',
      image_url: post.image_url || '',
      is_active: post.is_active ?? true,
      featured: post.featured ?? false,
      read_time: post.read_time || '5 min read'
    });
    setIsCreateOpen(true);
  };

  const handleSubmit = () => {
    if (!blogData.title || !blogData.content) {
      toast({
        title: "Missing Information",
        description: "Please provide at least title and content.",
        variant: "destructive",
      });
      return;
    }

    postMutation.mutate(blogData);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !blogData.tags.includes(tag)) {
      setBlogData({...blogData, tags: [...blogData.tags, tag]});
    }
  };

  const removeTag = (tagToRemove: string) => {
    setBlogData({
      ...blogData, 
      tags: blogData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enhanced Blog Management</h1>
          <p className="text-muted-foreground">
            Create and manage rich content with advanced editor features.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsCreateOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
              </DialogTitle>
              <DialogDescription>
                Use the rich text editor below to create engaging content.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={blogData.title}
                      onChange={(e) => setBlogData({...blogData, title: e.target.value})}
                      placeholder="Blog post title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={blogData.slug}
                      onChange={(e) => setBlogData({...blogData, slug: e.target.value})}
                      placeholder="auto-generated-from-title"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={blogData.excerpt}
                    onChange={(e) => setBlogData({...blogData, excerpt: e.target.value})}
                    placeholder="Brief description of the post..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content *</Label>
                  <div className="border rounded-md">
                    <ReactQuill
                      ref={quillRef}
                      theme="snow"
                      value={blogData.content}
                      onChange={(content) => setBlogData({...blogData, content})}
                      modules={modules}
                      formats={formats}
                      style={{ minHeight: '300px' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={blogData.category} onValueChange={(value) => setBlogData({...blogData, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="farmer-stories">Farmer Stories</SelectItem>
                        <SelectItem value="agricultural-tips">Agricultural Tips</SelectItem>
                        <SelectItem value="market-trends">Market Trends</SelectItem>
                        <SelectItem value="sustainability">Sustainability</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="exports">Export News</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={blogData.author}
                      onChange={(e) => setBlogData({...blogData, author: e.target.value})}
                      placeholder="Author name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="read_time">Read Time</Label>
                    <Input
                      id="read_time"
                      value={blogData.read_time}
                      onChange={(e) => setBlogData({...blogData, read_time: e.target.value})}
                      placeholder="5 min read"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="image_url">Featured Image URL</Label>
                  <Input
                    id="image_url"
                    value={blogData.image_url}
                    onChange={(e) => setBlogData({...blogData, image_url: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {blogData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add tags (press Enter)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={blogData.is_active}
                      onCheckedChange={(checked) => setBlogData({...blogData, is_active: checked})}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={blogData.featured}
                      onCheckedChange={(checked) => setBlogData({...blogData, featured: checked})}
                    />
                    <Label htmlFor="featured">Featured</Label>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="seo" className="space-y-4">
                <div>
                  <Label htmlFor="seo_title">SEO Title</Label>
                  <Input
                    id="seo_title"
                    value={blogData.seo_title}
                    onChange={(e) => setBlogData({...blogData, seo_title: e.target.value})}
                    placeholder="SEO optimized title (60 chars max)"
                    maxLength={60}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {blogData.seo_title.length}/60 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="seo_description">SEO Description</Label>
                  <Textarea
                    id="seo_description"
                    value={blogData.seo_description}
                    onChange={(e) => setBlogData({...blogData, seo_description: e.target.value})}
                    placeholder="SEO meta description (160 chars max)"
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {blogData.seo_description.length}/160 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="seo_keywords">SEO Keywords</Label>
                  <Input
                    id="seo_keywords"
                    value={blogData.seo_keywords}
                    onChange={(e) => setBlogData({...blogData, seo_keywords: e.target.value})}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="space-y-4">
                <div className="border rounded-lg p-6 bg-background">
                  <div className="space-y-4">
                    {blogData.image_url && (
                      <img 
                        src={blogData.image_url} 
                        alt={blogData.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex gap-2">
                      <Badge variant="outline">{blogData.category}</Badge>
                      <Badge variant="secondary">{blogData.read_time}</Badge>
                      {blogData.featured && <Badge>Featured</Badge>}
                    </div>
                    <h1 className="text-3xl font-bold">{blogData.title || 'Blog Post Title'}</h1>
                    <p className="text-muted-foreground">By {blogData.author}</p>
                    {blogData.excerpt && (
                      <p className="text-lg text-muted-foreground">{blogData.excerpt}</p>
                    )}
                    <div className="flex gap-2">
                      {blogData.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: blogData.content || '<p>Blog content will appear here...</p>' }}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={postMutation.isPending}
              >
                {postMutation.isPending 
                  ? (editingPost ? "Updating..." : "Creating...") 
                  : (editingPost ? "Update Post" : "Create Post")
                }
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading blog posts...
                  </TableCell>
                </TableRow>
              ) : blogPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No blog posts found. Create your first post to get started.
                  </TableCell>
                </TableRow>
              ) : (
                blogPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{post.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {post.excerpt?.substring(0, 100)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.category}</Badge>
                    </TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge variant={post.is_active ? "default" : "secondary"}>
                          {post.is_active ? 'Active' : 'Draft'}
                        </Badge>
                        {post.featured && (
                          <Badge variant="outline">Featured</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.view_count || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(post)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(post.id, post.title)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}