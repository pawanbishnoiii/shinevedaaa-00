import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Plus, X, Image as ImageIcon } from 'lucide-react';

interface MediaUploadSectionProps {
  imageUrl: string;
  setImageUrl: (url: string) => void;
  galleryImages: string[];
  setGalleryImages: (images: string[]) => void;
}

const MediaUploadSection: React.FC<MediaUploadSectionProps> = ({
  imageUrl,
  setImageUrl,
  galleryImages,
  setGalleryImages,
}) => {
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);

  const { data: mediaFiles } = useQuery({
    queryKey: ['media-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('file_type', 'image')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const addGalleryImage = (url: string) => {
    if (url.trim() && !galleryImages.includes(url.trim())) {
      setGalleryImages([...galleryImages, url.trim()]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const selectFromMediaLibrary = (fileUrl: string, isMainImage: boolean = false) => {
    if (isMainImage) {
      setImageUrl(fileUrl);
    } else {
      addGalleryImage(fileUrl);
    }
    setMediaDialogOpen(false);
  };

  const MediaLibraryDialog = ({ isMainImage = false }: { isMainImage?: boolean }) => (
    <Dialog open={mediaDialogOpen} onOpenChange={setMediaDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ImageIcon className="h-4 w-4 mr-2" />
          Select from Media Library
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Image from Media Library</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 p-4">
          {mediaFiles?.map((file) => (
            <div 
              key={file.id}
              className="cursor-pointer border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              onClick={() => selectFromMediaLibrary(file.file_url || '', isMainImage)}
            >
              <img
                src={file.file_url || ''}
                alt={file.alt_text || file.original_filename}
                className="w-full h-32 object-cover"
              />
              <div className="p-2">
                <p className="text-xs truncate">{file.original_filename}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
        <CardDescription>Main product image and gallery from media library or URL</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Image */}
        <div>
          <Label htmlFor="imageUrl">Main Image</Label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL or select from media library"
              />
              <MediaLibraryDialog isMainImage={true} />
            </div>
            {imageUrl && (
              <div className="mt-2">
                <img 
                  src={imageUrl} 
                  alt="Main product preview" 
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>
        </div>

        {/* Gallery Images */}
        <div>
          <Label>Gallery Images</Label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Enter image URL"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addGalleryImage(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Enter image URL"]') as HTMLInputElement;
                  if (input && input.value) {
                    addGalleryImage(input.value);
                    input.value = '';
                  }
                }}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <MediaLibraryDialog isMainImage={false} />
            </div>
            
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {galleryImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={image} 
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeGalleryImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upload Instructions */}
        <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
          <p className="font-medium mb-1">📁 Image Storage:</p>
          <p>• Images uploaded via Media Library are stored in <code>data/img/</code></p>
          <p>• Videos are stored in <code>data/vid/</code></p>
          <p>• Documents are stored in <code>data/docs/</code></p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaUploadSection;