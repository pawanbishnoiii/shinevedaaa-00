import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Upload,
  Search,
  Filter,
  Grid3X3,
  List,
  Trash2,
  Download,
  Edit,
  Eye,
  Copy,
  Tag,
  Folder,
  Image,
  Video,
  File
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface MediaFile {
  id: string;
  filename: string;
  original_filename: string;
  file_url: string;
  file_type: string;
  file_size: number;
  mime_type: string;
  alt_text: string;
  caption: string;
  tags: string[];
  folder: string;
  created_at: string;
}

interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export function EnhancedMediaLibrary() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterFolder, setFilterFolder] = useState<string>('all');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [editingFile, setEditingFile] = useState<MediaFile | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch media files
  const { data: mediaFiles, isLoading } = useQuery({
    queryKey: ['media-files', searchQuery, filterType, filterFolder],
    queryFn: async () => {
      let query = supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`filename.ilike.%${searchQuery}%,original_filename.ilike.%${searchQuery}%,alt_text.ilike.%${searchQuery}%`);
      }

      if (filterType !== 'all') {
        query = query.eq('file_type', filterType);
      }

      if (filterFolder !== 'all') {
        query = query.eq('folder', filterFolder);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MediaFile[];
    }
  });

  // Get unique folders for filter
  const { data: folders } = useQuery({
    queryKey: ['media-folders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media')
        .select('folder')
        .not('folder', 'is', null);
      
      if (error) throw error;
      const uniqueFolders = [...new Set(data.map(item => item.folder))];
      return uniqueFolders.filter(Boolean);
    }
  });

  // Upload files to Supabase Storage
  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const results = [];
      
      for (const file of files) {
        try {
          // Update progress
          setUploadProgress(prev => [...prev, { file, progress: 0, status: 'uploading' }]);

          // Upload to Supabase Storage
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
          const filePath = `media-library/${fileName}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('media-library')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('media-library')
            .getPublicUrl(filePath);

          // Save to database
          const mediaData = {
            filename: fileName,
            original_filename: file.name,
            file_url: publicUrl,
            file_type: file.type.startsWith('image/') ? 'img' : file.type.startsWith('video/') ? 'vid' : 'docs',
            file_size: file.size,
            mime_type: file.type,
            folder: 'general'
          };

          const { data: dbData, error: dbError } = await supabase
            .from('media')
            .insert(mediaData)
            .select()
            .single();

          if (dbError) throw dbError;

          // Update progress to success
          setUploadProgress(prev => 
            prev.map(p => 
              p.file === file 
                ? { ...p, progress: 100, status: 'success' as const }
                : p
            )
          );

          results.push(dbData);
        } catch (error) {
          // Update progress to error
          setUploadProgress(prev => 
            prev.map(p => 
              p.file === file 
                ? { ...p, status: 'error' as const, error: error instanceof Error ? error.message : 'Upload failed' }
                : p
            )
          );
          console.error('Upload error:', error);
        }
      }

      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-files'] });
      toast({
        title: 'Files uploaded successfully',
        description: 'Your files have been uploaded to the media library.',
      });
      
      // Clear upload progress after 3 seconds
      setTimeout(() => {
        setUploadProgress([]);
      }, 3000);
    },
    onError: (error) => {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload files',
        variant: 'destructive',
      });
    }
  });

  // Delete files
  const deleteMutation = useMutation({
    mutationFn: async (fileIds: string[]) => {
      const { error } = await supabase
        .from('media')
        .delete()
        .in('id', fileIds);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-files'] });
      setSelectedFiles([]);
      toast({
        title: 'Files deleted',
        description: 'Selected files have been deleted.',
      });
    }
  });

  // Update file metadata
  const updateMutation = useMutation({
    mutationFn: async (file: Partial<MediaFile> & { id: string }) => {
      const { error } = await supabase
        .from('media')
        .update(file)
        .eq('id', file.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-files'] });
      setEditingFile(null);
      toast({
        title: 'File updated',
        description: 'File metadata has been updated.',
      });
    }
  });

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles: File[]) => {
    uploadMutation.mutate(acceptedFiles);
  }, [uploadMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt']
    },
    multiple: true
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string, mimeType: string) => {
    if (fileType === 'img' || mimeType.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    } else if (fileType === 'vid' || mimeType.startsWith('video/')) {
      return <Video className="h-4 w-4" />;
    } else {
      return <File className="h-4 w-4" />;
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied to clipboard',
        description: 'URL has been copied to clipboard.',
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy URL to clipboard.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Media Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-primary">Drop files here...</p>
            ) : (
              <div>
                <p className="text-foreground font-medium mb-2">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports images, videos, PDFs, and text files
                </p>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {uploadProgress.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadProgress.map((upload, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{upload.file.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {upload.status === 'success' ? '✓' : upload.status === 'error' ? '✗' : `${upload.progress}%`}
                      </span>
                    </div>
                    <Progress 
                      value={upload.progress} 
                      className={`h-2 ${
                        upload.status === 'success' ? 'bg-green-100' : 
                        upload.status === 'error' ? 'bg-red-100' : ''
                      }`}
                    />
                    {upload.error && (
                      <p className="text-xs text-destructive mt-1">{upload.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="img">Images</SelectItem>
                  <SelectItem value="vid">Videos</SelectItem>
                  <SelectItem value="docs">Documents</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterFolder} onValueChange={setFilterFolder}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Folders</SelectItem>
                  {folders?.map((folder) => (
                    <SelectItem key={folder} value={folder}>
                      {folder}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              {selectedFiles.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate(selectedFiles)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedFiles.length})
                </Button>
              )}
              
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Files Grid/List */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-8">Loading media files...</div>
          ) : !mediaFiles || mediaFiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No media files found. Upload some files to get started.
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mediaFiles.map((file) => (
                <div
                  key={file.id}
                  className={`group relative border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                    selectedFiles.includes(file.id) ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => {
                    setSelectedFiles(prev =>
                      prev.includes(file.id)
                        ? prev.filter(id => id !== file.id)
                        : [...prev, file.id]
                    );
                  }}
                >
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    {file.file_type === 'img' ? (
                      <img
                        src={file.file_url}
                        alt={file.alt_text || file.original_filename}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        {getFileIcon(file.file_type, file.mime_type)}
                        <span className="text-xs mt-2 px-2 text-center truncate w-full">
                          {file.original_filename}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {file.file_type.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingFile(file);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(file.file_url);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="p-2">
                    <p className="text-xs font-medium truncate">{file.original_filename}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.file_size)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {mediaFiles.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center gap-4 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 ${
                    selectedFiles.includes(file.id) ? 'bg-primary/5 border-primary' : ''
                  }`}
                  onClick={() => {
                    setSelectedFiles(prev =>
                      prev.includes(file.id)
                        ? prev.filter(id => id !== file.id)
                        : [...prev, file.id]
                    );
                  }}
                >
                  <div className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                    {file.file_type === 'img' ? (
                      <img
                        src={file.file_url}
                        alt={file.alt_text || file.original_filename}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      getFileIcon(file.file_type, file.mime_type)
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.original_filename}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatFileSize(file.file_size)}</span>
                      <Badge variant="outline" className="text-xs">
                        {file.file_type.toUpperCase()}
                      </Badge>
                      {file.folder && (
                        <span className="flex items-center gap-1">
                          <Folder className="h-3 w-3" />
                          {file.folder}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingFile(file);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(file.file_url);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit File Dialog */}
      <Dialog open={!!editingFile} onOpenChange={() => setEditingFile(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit File Details</DialogTitle>
            <DialogDescription>
              Update the metadata for this file.
            </DialogDescription>
          </DialogHeader>
          
          {editingFile && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="alt-text">Alt Text</Label>
                <Input
                  id="alt-text"
                  value={editingFile.alt_text || ''}
                  onChange={(e) => setEditingFile({...editingFile, alt_text: e.target.value})}
                  placeholder="Describe this file for accessibility"
                />
              </div>
              
              <div>
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  value={editingFile.caption || ''}
                  onChange={(e) => setEditingFile({...editingFile, caption: e.target.value})}
                  placeholder="Add a caption for this file"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="folder">Folder</Label>
                <Input
                  id="folder"
                  value={editingFile.folder || ''}
                  onChange={(e) => setEditingFile({...editingFile, folder: e.target.value})}
                  placeholder="Organize into folder"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingFile(null)}>
              Cancel
            </Button>
            <Button 
              onClick={() => editingFile && updateMutation.mutate(editingFile)}
              disabled={updateMutation.isPending}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}