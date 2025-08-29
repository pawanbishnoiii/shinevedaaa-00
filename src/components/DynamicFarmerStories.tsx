import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, TrendingUp, Users, Heart, ArrowRight } from 'lucide-react';

interface FarmerStory {
  id: string;
  name: string;
  location: string;
  state: string;
  title: string;
  excerpt: string;
  full_story: string;
  before_metric: string;
  before_value: string;
  after_metric: string;
  after_value: string;
  improvement: string;
  image_url: string;
  category: string;
  is_featured: boolean;
  sort_order: number;
}

const DynamicFarmerStories: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<FarmerStory | null>(null);

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ['farmer-stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('farmer_stories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'innovation': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'community': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'success': return <TrendingUp className="h-4 w-4" />;
      case 'innovation': return <ArrowRight className="h-4 w-4" />;
      case 'community': return <Users className="h-4 w-4" />;
      default: return <Heart className="h-4 w-4" />;
    }
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-video bg-muted animate-pulse"></div>
              <CardContent className="p-6 space-y-4">
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                <div className="h-6 bg-muted rounded w-full animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No stories available</h3>
        <p className="text-muted-foreground">Check back later for inspiring farmer stories.</p>
      </div>
    );
  }

  return (
    <>
      <div id="farmer-stories" className="space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Badge variant="secondary" className="mb-4">
            <Heart className="h-4 w-4 mr-2" />
            Farmer Stories — Kisan Kahaniyan
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Inspiring Success Stories
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Meet the passionate farmers behind our premium agricultural products. 
            Their dedication and expertise ensure quality from farm to your table.
          </p>
        </motion.div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={story.image_url || '/placeholder.svg'}
                    alt={`${story.name} — ${story.location}, ${story.state}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-6 flex flex-col h-[calc(100%-200px)]">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {story.location}, {story.state}
                    </span>
                    <Badge className={`ml-auto ${getCategoryColor(story.category)}`}>
                      {getCategoryIcon(story.category)}
                      <span className="ml-1 capitalize">{story.category}</span>
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{story.name}</h3>
                  <h4 className="text-lg font-semibold mb-3 text-primary">{story.title}</h4>
                  <p className="text-muted-foreground text-sm mb-4 flex-grow">
                    {story.excerpt}
                  </p>
                  
                  {story.before_value && story.after_value && (
                    <div className="bg-muted/50 p-3 rounded-lg mb-4">
                      <div className="flex justify-between items-center">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">Before</div>
                          <div className="font-semibold">{story.before_value}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-primary" />
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">After</div>
                          <div className="font-semibold">{story.after_value}</div>
                        </div>
                      </div>
                      {story.improvement && (
                        <div className="text-center mt-2">
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            {story.improvement}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => setSelectedStory(story)}
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    Read Full Story
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Story Modal */}
      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedStory?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedStory && (
            <div className="space-y-6">
              <div className="aspect-video overflow-hidden rounded-lg">
                <img
                  src={selectedStory.image_url || '/placeholder.svg'}
                  alt={`${selectedStory.name} — ${selectedStory.location}, ${selectedStory.state}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Badge className={getCategoryColor(selectedStory.category)}>
                    {getCategoryIcon(selectedStory.category)}
                    <span className="ml-1 capitalize">{selectedStory.category}</span>
                  </Badge>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {selectedStory.location}, {selectedStory.state}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-primary">{selectedStory.title}</h3>
                
                {selectedStory.before_value && selectedStory.after_value && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Before</div>
                        <div className="font-semibold">{selectedStory.before_metric}</div>
                        <div className="text-lg font-bold">{selectedStory.before_value}</div>
                      </div>
                      <div className="flex items-center justify-center">
                        <ArrowRight className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">After</div>
                        <div className="font-semibold">{selectedStory.after_metric}</div>
                        <div className="text-lg font-bold">{selectedStory.after_value}</div>
                      </div>
                    </div>
                    {selectedStory.improvement && (
                      <div className="text-center mt-3">
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {selectedStory.improvement}
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="prose max-w-none">
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">{selectedStory.full_story}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DynamicFarmerStories;