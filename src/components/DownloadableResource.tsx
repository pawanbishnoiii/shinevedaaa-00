import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Image, Video, File, Eye } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Resource {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  file_size: number;
  category: string;
  download_count: number;
}

interface DownloadableResourceProps {
  category?: string;
  limit?: number;
  showPreview?: boolean;
}

const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return FileText;
    case 'image':
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'webp':
      return Image;
    case 'video':
    case 'mp4':
    case 'avi':
    case 'mov':
      return Video;
    default:
      return File;
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const DownloadableResource: React.FC<DownloadableResourceProps> = ({
  category,
  limit,
  showPreview = true
}) => {
  const queryClient = useQueryClient();

  const { data: resources, isLoading } = useQuery({
    queryKey: ['downloadable-resources', category, limit],
    queryFn: async () => {
      let query = supabase
        .from('downloadable_resources')
        .select('*')
        .eq('is_public', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (category) query = query.eq('category', category);
      if (limit) query = query.limit(limit);

      const { data, error } = await query;
      if (error) throw error;
      return data as Resource[];
    }
  });

  const downloadMutation = useMutation({
    mutationFn: async (resourceId: string) => {
      // Track download analytics
      await supabase
        .from('portfolio_analytics')
        .insert({
          content_type: 'resource',
          content_id: resourceId,
          action_type: 'download',
          session_id: crypto.randomUUID()
        });

      // Simple increment without using rpc
      const { data: current } = await supabase
        .from('downloadable_resources')
        .select('download_count')
        .eq('id', resourceId)
        .single();
      
      const { error } = await supabase
        .from('downloadable_resources')
        .update({ download_count: (current?.download_count || 0) + 1 })
        .eq('id', resourceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['downloadable-resources'] });
      toast.success('Download started successfully!');
    },
    onError: () => {
      toast.error('Failed to track download');
    }
  });

  const handleDownload = async (resource: Resource) => {
    // Track the download
    downloadMutation.mutate(resource.id);
    
    // Initiate download
    const link = document.createElement('a');
    link.href = resource.file_url;
    link.download = resource.title;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (resource: Resource) => {
    if (resource.file_type === 'pdf' || resource.file_type.startsWith('image/')) {
      window.open(resource.file_url, '_blank');
    } else {
      toast.info('Preview not available for this file type');
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-muted rounded animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                </div>
              </div>
              <div className="h-16 bg-muted rounded animate-pulse mb-4" />
              <div className="h-10 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const categories = [...new Set(resources?.map(r => r.category) || [])];

  return (
    <div className="space-y-6">
      {/* Category Pills */}
      {!category && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <Badge key={cat} variant="outline" className="capitalize">
              {cat.replace('_', ' ')}
            </Badge>
          ))}
        </div>
      )}

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources?.map((resource, index) => {
          const FileIcon = getFileIcon(resource.file_type);
          
          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <FileIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                        {resource.title}
                      </h3>
                      <Badge variant="secondary" className="capitalize">
                        {resource.category.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {resource.description}
                  </p>

                  {/* File Info */}
                  <div className="flex justify-between items-center text-xs text-muted-foreground mb-4">
                    <span className="uppercase font-medium">
                      {resource.file_type}
                    </span>
                    <span>{formatFileSize(resource.file_size)}</span>
                    <span>{resource.download_count} downloads</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleDownload(resource)}
                      className="flex-1"
                      disabled={downloadMutation.isPending}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    
                    {showPreview && (
                      <Button
                        variant="outline"
                        onClick={() => handlePreview(resource)}
                        className="px-3"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {resources?.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Resources Available</h3>
          <p className="text-muted-foreground">
            {category 
              ? `No resources found in the ${category} category.`
              : 'No downloadable resources are currently available.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default DownloadableResource;