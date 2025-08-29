import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Eye, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  video_type: string;
  duration: number;
  category: string;
  created_at: string;
}

interface VideoGalleryProps {
  category?: string;
  featured?: boolean;
  limit?: number;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ 
  category, 
  featured = false, 
  limit 
}) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const { data: videos, isLoading } = useQuery({
    queryKey: ['portfolio-videos', category, featured, limit],
    queryFn: async () => {
      let query = supabase
        .from('portfolio_videos')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (category) query = query.eq('category', category);
      if (featured) query = query.eq('is_featured', true);
      if (limit) query = query.limit(limit);

      const { data, error } = await query;
      if (error) throw error;
      return data as Video[];
    }
  });

  const categories = ['all', 'hero', 'testimonial', 'tutorial', 'showcase'];

  const filteredVideos = videos?.filter(video => 
    filter === 'all' || video.category === filter
  ) || [];

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-video bg-muted animate-pulse" />
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      {!category && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? "default" : "outline"}
              onClick={() => setFilter(cat)}
              className="capitalize"
            >
              {cat === 'all' ? 'All Videos' : cat}
            </Button>
          ))}
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
              <div 
                className="relative aspect-video bg-muted"
                onClick={() => setSelectedVideo(video)}
              >
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                    <Play className="w-12 h-12 text-primary" />
                  </div>
                )}
                
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-12 h-12 text-white" />
                </div>

                {/* Duration Badge */}
                {video.duration && (
                  <Badge className="absolute bottom-2 right-2 bg-black/80 text-white">
                    {formatDuration(video.duration)}
                  </Badge>
                )}

                {/* Category Badge */}
                <Badge 
                  variant="secondary" 
                  className="absolute top-2 left-2 capitalize"
                >
                  {video.category}
                </Badge>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                  {video.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(video.created_at)}
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    {Math.floor(Math.random() * 1000)} views
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="aspect-video">
              <ReactPlayer
                url={selectedVideo.video_url}
                width="100%"
                height="100%"
                controls
                playing
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedVideo.title}</h2>
                  <Badge variant="secondary" className="capitalize">
                    {selectedVideo.category}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedVideo(null)}
                >
                  Close
                </Button>
              </div>
              <p className="text-muted-foreground">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGallery;