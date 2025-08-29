import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { 
  Camera, 
  ZoomIn, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Share2,
  ExternalLink
} from 'lucide-react';

interface GalleryImage {
  id: string;
  src: string;
  alt_text: string;
  title: string;
  category: string;
  description: string;
  photographer?: string;
  license_type?: string;
  license_url?: string;
  is_featured: boolean;
  sort_order: number;
}

const categories = [
  { id: 'all', label: 'All Images', icon: <Camera className="h-4 w-4" /> },
  { id: 'farmers', label: 'Farmers', icon: <Camera className="h-4 w-4" /> },
  { id: 'crops', label: 'Crops', icon: <Camera className="h-4 w-4" /> },
  { id: 'processing', label: 'Processing', icon: <Camera className="h-4 w-4" /> },
  { id: 'community', label: 'Community', icon: <Camera className="h-4 w-4" /> }
];

const DynamicAgriImageGallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter((img: GalleryImage) => img.category === selectedCategory);

  const openLightbox = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const currentIndex = filteredImages.findIndex((img: GalleryImage) => img.id === selectedImage?.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
    } else {
      newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedImage(filteredImages[newIndex]);
    setSelectedIndex(newIndex);
  };

  if (isLoading) {
    return (
      <div className="space-y-12">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-48 mx-auto mb-4"></div>
            <div className="h-10 bg-muted rounded w-96 mx-auto mb-6"></div>
            <div className="h-6 bg-muted rounded w-full max-w-3xl mx-auto"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="aspect-square bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <Camera className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No images available</h3>
        <p className="text-muted-foreground">Check back later for gallery updates.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Badge variant="secondary" className="mb-4">
            <Camera className="h-4 w-4 mr-2" />
            Image Gallery — तस्वीर गैलरी
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Agricultural Excellence in Pictures
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore our visual journey showcasing farmers, crops, processing facilities, 
            and community initiatives across Rajasthan and Punjab.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2"
        >
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              {category.icon}
              {category.label}
            </Button>
          ))}
        </motion.div>

        {/* Image Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filteredImages.map((image: GalleryImage, index: number) => (
            <motion.div
              key={`${selectedCategory}-${image.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer bg-muted"
              onClick={() => openLightbox(image, index)}
            >
              <img
                src={image.src}
                alt={image.alt_text}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn className="h-8 w-8 text-white" />
                </div>
              </div>
              
              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-semibold text-sm">{image.title}</h3>
                <p className="text-xs text-white/80 mt-1 line-clamp-2">{image.description}</p>
                {image.license_type && (
                  <Badge variant="outline" className="mt-2 text-xs border-white/20 text-white/80">
                    {image.license_type}
                  </Badge>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No images found</h3>
            <p className="text-muted-foreground">
              Try selecting a different category to view more images.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={!!selectedImage} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-6xl max-h-[95vh] p-0 overflow-hidden">
          {selectedImage && (
            <div className="relative">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10 p-0"
              >
                <X className="h-5 w-5" />
              </Button>

              {/* Navigation Buttons */}
              {filteredImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateImage('prev')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full w-12 h-12 p-0"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateImage('next')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full w-12 h-12 p-0"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}

              {/* Image */}
              <div className="max-h-[80vh] overflow-hidden">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt_text}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Image Info */}
              <div className="p-6 bg-background">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{selectedImage.title}</h3>
                    <p className="text-muted-foreground mb-3">{selectedImage.description}</p>
                    <div className="flex gap-2 mb-3">
                      <Badge variant="secondary" className="capitalize">
                        {selectedImage.category}
                      </Badge>
                      {selectedImage.license_type && (
                        <Badge variant="outline">
                          {selectedImage.license_type}
                        </Badge>
                      )}
                    </div>
                    {selectedImage.photographer && (
                      <p className="text-sm text-muted-foreground">
                        Photo by: {selectedImage.photographer}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    {selectedImage.license_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={selectedImage.license_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          License
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
                
                {filteredImages.length > 1 && (
                  <div className="text-sm text-muted-foreground mt-4">
                    Image {selectedIndex + 1} of {filteredImages.length}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DynamicAgriImageGallery;