import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  MapPin, 
  Users, 
  Sprout, 
  ArrowLeft,
  Calendar,
  Award,
  TrendingUp,
  Heart,
  Package
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Portfolio = () => {
  const [selectedStory, setSelectedStory] = useState<any>(null);

  // Fetch Indian farmers stories
  const { data: stories = [] } = useQuery({
    queryKey: ['indian-farmers-stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rajasthan_stories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch crop varieties
  const { data: crops = [] } = useQuery({
    queryKey: ['indian-crops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rajasthan_crops')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch portfolio sections
  const { data: portfolioSections = [] } = useQuery({
    queryKey: ['portfolio-sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rajasthan_portfolio_sections')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data;
    }
  });

  const StoryModal = ({ story, onClose }: { story: any; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {story.hero_image_url && (
            <img 
              src={story.hero_image_url} 
              alt={story.title}
              className="w-full h-64 object-cover rounded-t-xl"
            />
          )}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <Badge variant="secondary" className="mb-2">
              {story.district}
            </Badge>
            <h2 className="text-2xl font-bold mb-2">{story.title}</h2>
            <p className="text-muted-foreground">{story.village}</p>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed">{story.content}</p>
          </div>

          {story.gallery && (
            <div className="mt-6">
              <h3 className="font-semibold mb-4">Photo Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {story.gallery.map((image: string, index: number) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`${story.title} ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {story.video_url && (
            <div className="mt-6">
              <h3 className="font-semibold mb-4">Story Video</h3>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <Button onClick={() => window.open(story.video_url, '_blank')}>
                  <Play className="h-4 w-4 mr-2" />
                  Watch Video
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Indian Farmers Portfolio - ShineVeda</title>
        <meta name="description" content="Discover the inspiring stories of Indian farmers and their agricultural excellence. From traditional farming to modern techniques across India." />
        <meta name="keywords" content="Indian farmers, agriculture portfolio, farming stories, rural India, agricultural excellence" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/20 via-secondary/10 to-background border-b">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4 px-4 py-2">
                Our Portfolio
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Indian Farmers
                <br />
                <span className="text-gradient">Excellence Portfolio</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Celebrating the dedication, innovation, and excellence of Indian farmers 
                who bring you the finest agricultural commodities from across the nation.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <Tabs defaultValue="stories" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stories" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Farmer Stories
              </TabsTrigger>
              <TabsTrigger value="crops" className="flex items-center gap-2">
                <Sprout className="h-4 w-4" />
                Crop Excellence
              </TabsTrigger>
              <TabsTrigger value="impact" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Impact & Growth
              </TabsTrigger>
            </TabsList>

            {/* Farmer Stories Tab */}
            <TabsContent value="stories" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Inspiring Farmer Stories</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Meet the passionate farmers behind our premium agricultural products. 
                  Their dedication and expertise ensure quality from farm to your table.
                </p>
              </div>

              {stories.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Stories Coming Soon</h3>
                  <p className="text-muted-foreground">
                    We're gathering inspiring stories from our farmer partners.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {stories.map((story) => (
                    <Card key={story.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                          onClick={() => setSelectedStory(story)}>
                      <div className="aspect-video overflow-hidden bg-muted">
                        <img
                          src={story.hero_image_url || '/placeholder.svg'}
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {story.district}, {story.village}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 line-clamp-2">{story.title}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                          {story.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">Featured</Badge>
                          {story.video_url && (
                            <div className="flex items-center text-primary text-sm">
                              <Play className="h-3 w-3 mr-1" />
                              Video
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Crop Excellence Tab */}
            <TabsContent value="crops" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Crop Excellence</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Discover the diverse range of high-quality crops grown by our partner farmers 
                  across different regions of India.
                </p>
              </div>

              {crops.length === 0 ? (
                <div className="text-center py-12">
                  <Sprout className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Crop Information Coming Soon</h3>
                  <p className="text-muted-foreground">
                    We're compiling detailed information about our crop varieties.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {crops.map((crop) => (
                    <Card key={crop.id} className="group hover:shadow-md transition-shadow">
                      <div className="aspect-square overflow-hidden bg-muted">
                        <img
                          src={crop.image_url || '/placeholder.svg'}
                          alt={crop.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold mb-2">{crop.name}</h3>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Season:</span>
                            <span className="font-medium">{crop.season}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Region:</span>
                            <span className="font-medium">{crop.region}</span>
                          </div>
                          {crop.duration_days && (
                            <div className="flex justify-between">
                              <span>Duration:</span>
                              <span className="font-medium">{crop.duration_days} days</span>
                            </div>
                          )}
                        </div>
                        {crop.description && (
                          <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
                            {crop.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Impact & Growth Tab */}
            <TabsContent value="impact" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Our Impact & Growth</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Through partnerships with farmers across India, we're creating sustainable 
                  agricultural value chains that benefit communities and deliver quality products globally.
                </p>
              </div>

              {/* Impact Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center p-6">
                  <div className="text-3xl font-bold text-primary mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">Partner Farmers</div>
                </Card>
                <Card className="text-center p-6">
                  <div className="text-3xl font-bold text-primary mb-2">15+</div>
                  <div className="text-sm text-muted-foreground">States Covered</div>
                </Card>
                <Card className="text-center p-6">
                  <div className="text-3xl font-bold text-primary mb-2">25+</div>
                  <div className="text-sm text-muted-foreground">Crop Varieties</div>
                </Card>
                <Card className="text-center p-6">
                  <div className="text-3xl font-bold text-primary mb-2">99%</div>
                  <div className="text-sm text-muted-foreground">Quality Assurance</div>
                </Card>
              </div>

              {/* Portfolio Sections */}
              {portfolioSections.length > 0 && (
                <div className="grid gap-8">
                  {portfolioSections.map((section) => (
                    <Card key={section.id} className="overflow-hidden">
                      <div className="grid md:grid-cols-2 gap-6">
                        {section.image_url && (
                          <div className="aspect-video md:aspect-square overflow-hidden bg-muted">
                            <img
                              src={section.image_url}
                              alt={section.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-6 flex flex-col justify-center">
                          <Badge variant="outline" className="mb-3 w-fit">
                            {section.section_type.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <h3 className="text-2xl font-bold mb-4">{section.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {section.content}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Call to Action */}
          <div className="text-center mt-16 p-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
            <Heart className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-4">Partner With Excellence</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join us in supporting Indian farmers and accessing premium agricultural products 
              that meet the highest international standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/products">
                  <Package className="h-4 w-4 mr-2" />
                  View Products
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">
                  <Users className="h-4 w-4 mr-2" />
                  Become a Partner
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Story Modal */}
        {selectedStory && (
          <StoryModal story={selectedStory} onClose={() => setSelectedStory(null)} />
        )}
      </div>
    </>
  );
};

export default Portfolio;