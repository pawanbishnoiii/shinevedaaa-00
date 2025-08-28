import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Upload, 
  Search, 
  MoreHorizontal,
  Eye,
  Trash2,
  Download,
  Image,
  Video,
  FileText,
  Filter,
  Grid,
  List,
  FolderOpen
} from 'lucide-react';
import { toast } from 'sonner';

const Media = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const queryClient = useQueryClient();

  const { data: mediaFiles, isLoading } = useQuery({
    queryKey: ['admin-media', searchTerm, categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`filename.ilike.%${searchTerm}%,alt_text.ilike.%${searchTerm}%`);
      }

      if (categoryFilter !== 'all') {
        query = query.eq('folder', categoryFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('media').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
      toast.success('File deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete file');
    }
  });

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        
        // Determine local path based on file type
        let category = 'general';
        let localPath = '/data/';
        
        if (file.type.startsWith('image/')) {
          category = 'image';
          localPath = '/data/img/';
        } else if (file.type.startsWith('video/')) {
          category = 'video';
          localPath = '/data/vid/';
        } else {
          category = 'document';
          localPath = '/data/docs/';
        }
        
        const fullPath = localPath + fileName;
        const localUrl = window.location.origin + fullPath;

        // Save to database with local path
        const { error: dbError } = await supabase
          .from('media')
          .insert({
            filename: fileName,
            original_filename: file.name,
            file_url: localUrl,
            file_size: file.size,
            mime_type: file.type,
            file_type: file.type.split('/')[0],
            folder: category,
            uploaded_by: (await supabase.auth.getUser()).data.user?.id
          });

        if (dbError) throw dbError;

        // Update progress
        setUploadProgress(((i + 1) / files.length) * 100);
      }

      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
      toast.success(`${files.length} file(s) uploaded to local storage successfully`);
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset input
      event.target.value = '';
    }
  }, [queryClient]);

  const handleDelete = (id: string, filename: string) => {
    if (confirm(`Are you sure you want to delete "${filename}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType.startsWith('video/')) return Video;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryBadge = (category: string) => {
    const categoryColors = {
      image: 'bg-green-100 text-green-800',
      video: 'bg-blue-100 text-blue-800',
      document: 'bg-purple-100 text-purple-800',
      general: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge variant="outline" className={categoryColors[category as keyof typeof categoryColors] || categoryColors.general}>
        {category}
      </Badge>
    );
  };

  const GridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {mediaFiles?.map((file) => {
        const FileIcon = getFileIcon(file.mime_type || 'application/octet-stream');
        return (
          <Card key={file.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="aspect-square mb-2 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                {file.mime_type?.startsWith('image/') ? (
                  <img
                    src={file.file_url || ''}
                    alt={file.alt_text || file.original_filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FileIcon className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium truncate" title={file.original_filename}>
                  {file.original_filename}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.file_size || 0)}
                </p>
                <div className="flex items-center justify-between">
                  {getCategoryBadge(file.folder || 'general')}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        <a href={file.file_url} download={file.original_filename}>
                          Download
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(file.id, file.original_filename)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const ListView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>File</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Uploaded</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mediaFiles?.map((file) => {
          const FileIcon = getFileIcon(file.mime_type || 'application/octet-stream');
          return (
            <TableRow key={file.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                    {file.mime_type?.startsWith('image/') ? (
                      <img
                        src={file.file_url || ''}
                        alt={file.alt_text || file.original_filename}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <FileIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{file.original_filename}</div>
                    <div className="text-sm text-muted-foreground">{file.filename}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{file.mime_type}</TableCell>
              <TableCell>{getCategoryBadge(file.folder || 'general')}</TableCell>
              <TableCell>{formatFileSize(file.file_size || 0)}</TableCell>
              <TableCell>{new Date(file.created_at).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      <a href={file.file_url} download={file.original_filename}>
                        Download
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(file.id, file.original_filename)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
        {(!mediaFiles || mediaFiles.length === 0) && (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No files found. Upload your first file to get started.</p>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Media Library</h2>
          <p className="text-muted-foreground">
            Manage your images, videos, and documents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="file-upload">
            <Button asChild disabled={isUploading}>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </span>
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
          />
        </div>
      </div>

      {isUploading && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Uploading files...</span>
              <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Media Files</CardTitle>
              <CardDescription>
                Browse and manage your uploaded files
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Upload className="h-8 w-8 animate-pulse" />
            </div>
          ) : viewMode === 'grid' ? (
            <GridView />
          ) : (
            <ListView />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Media;