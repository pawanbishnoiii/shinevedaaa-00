import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Calendar, 
  Droplets, 
  Thermometer, 
  TrendingUp,
  Globe,
  Package,
  Clock,
  Leaf,
  Sun,
  Cloud,
  Mountain,
  Heart,
  Users,
  Tractor,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';

const RajasthanPortfolio = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  // Fetch dynamic data from Supabase
  const { data: crops, isLoading: cropsLoading } = useQuery({
    queryKey: ['rajasthan-crops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rajasthan_crops')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: stories, isLoading: storiesLoading } = useQuery({
    queryKey: ['rajasthan-stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rajasthan_stories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: portfolioSections, isLoading: sectionsLoading } = useQuery({
    queryKey: ['rajasthan-portfolio-sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rajasthan_portfolio_sections')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  const categories = [
    { value: 'all', label: 'All Crops', icon: Package },
    { value: 'Rabi', label: 'Rabi Season', icon: Sun },
    { value: 'Kharif', label: 'Kharif Season', icon: Cloud },
    { value: 'Zaid', label: 'Zaid Season', icon: Thermometer }
  ];

  const filteredCrops = crops?.filter(crop => 
    activeCategory === 'all' || crop.season === activeCategory
  );

  const isLoading = cropsLoading || storiesLoading || sectionsLoading;

  const getCategoryIcon = (season: string) => {
    switch (season) {
      case 'Rabi': return Sun;
      case 'Kharif': return Cloud;
      case 'Zaid': return Thermometer;
      default: return Leaf;
    }
  };

  const getCategoryColor = (season: string) => {
    switch (season) {
      case 'Rabi': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Kharif': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Zaid': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Rajasthan Agriculture Portfolio - ShineVeda Exports | Crop Information & Export Data</title>
        <meta 
          name="description" 
          content="Comprehensive guide to Rajasthan's agricultural crops including onions, jeera, peanuts, carrots, chickpeas, mustard, and guar gum. Growing seasons, export markets, and cultivation details from Sri Ganganagar." 
        />
        <meta name="keywords" content="rajasthan agriculture, sri ganganagar crops, onions cultivation, jeera farming, peanuts growing, carrots export, chickpeas farming, mustard cultivation, guar gum production, rabi kharif crops, rajasthan farming" />
        <link rel="canonical" href="https://yourdomain.com/rajasthan-portfolio" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Rajasthan Agriculture Portfolio",
            "description": "Comprehensive information about agricultural crops grown in Rajasthan for export",
            "publisher": {
              "@type": "Organization",
              "name": "ShineVeda Exports"
            },
            "mainEntity": {
              "@type": "ItemList",
              "name": "Rajasthan Crops",
              "numberOfItems": crops?.length || 0,
              "itemListElement": crops?.map((crop, index) => ({
                "@type": "Product",
                "position": index + 1,
                "name": crop.name,
                "description": crop.description,
                "category": crop.season
              })) || []
            }
          })}
        </script>
      </Helmet>

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23f59e0b&quot; fill-opacity=&quot;0.1&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;4&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <Badge variant="secondary" className="mb-4 px-6 py-2 text-lg font-medium bg-orange-100 text-orange-800">
                <Mountain className="h-4 w-4 mr-2" />
                Rajasthan Agriculture Portfolio
              </Badge>
              
              <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6">
                Golden Land of{" "}
                <span className="text-gradient bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Agriculture
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
                Discover the rich agricultural heritage of Rajasthan - from the fertile plains of Sri Ganganagar 
                to the diverse crop varieties that feed the world.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{crops?.length || 7}+</div>
                  <div className="text-sm text-muted-foreground">Major Crops</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Globe className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">25+</div>
                  <div className="text-sm text-muted-foreground">Export Markets</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{regions?.length || 3}+</div>
                  <div className="text-sm text-muted-foreground">Growing Regions</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">95%</div>
                  <div className="text-sm text-muted-foreground">Export Quality</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-8">
              {/* Category Tabs */}
              <div className="flex justify-center">
                <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-muted/50">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <TabsTrigger 
                        key={category.value} 
                        value={category.value}
                        className="flex items-center gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{category.label}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              {/* Crops Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCrops?.map((crop, index) => {
                  const CategoryIcon = getCategoryIcon(crop.season || '');
                  return (
                    <motion.div
                      key={crop.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <CategoryIcon className="h-5 w-5 text-primary" />
                                <Badge 
                                  variant="outline" 
                                  className={getCategoryColor(crop.season || '')}
                                >
                                  {crop.season}
                                </Badge>
                                <Badge variant="default" className="bg-primary">
                                  {crop.region}
                                </Badge>
                              </div>
                              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                {crop.name}
                              </CardTitle>
                            </div>
                            {crop.image_url && (
                              <img 
                                src={crop.image_url} 
                                alt={crop.name}
                                className="w-16 h-16 rounded-lg object-cover ml-4"
                              />
                            )}
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {crop.description}
                          </p>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-green-600" />
                              <div>
                                <div className="font-medium">Duration</div>
                                <div className="text-muted-foreground">{crop.duration_days} days</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-blue-600" />
                              <div>
                                <div className="font-medium">Region</div>
                                <div className="text-muted-foreground">{crop.region}</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Farmer Stories Section */}
              {stories && stories.length > 0 && (
                <section className="mt-20 pt-16 border-t">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                  >
                    <Badge variant="secondary" className="mb-4 px-6 py-2 text-lg font-medium bg-green-100 text-green-800">
                      <Heart className="h-4 w-4 mr-2" />
                      Farmer Stories
                    </Badge>
                    
                    <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
                      Stories from the{" "}
                      <span className="text-gradient bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        Fields
                      </span>
                    </h2>
                    
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                      Meet the farmers whose dedication and hard work make our agricultural success possible.
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {stories.map((story, index) => (
                      <motion.div
                        key={story.id}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                      >
                        <Card className="h-full hover:shadow-xl transition-all duration-500 group overflow-hidden">
                          {story.hero_image_url && (
                            <div className="h-64 overflow-hidden">
                              <img 
                                src={story.hero_image_url} 
                                alt={story.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}
                          
                          <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="h-4 w-4 text-primary" />
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                {story.village} • {story.district}
                              </Badge>
                            </div>
                            <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                              {story.title}
                            </CardTitle>
                          </CardHeader>

                          <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                              {story.content}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Portfolio Sections */}
              {portfolioSections && portfolioSections.length > 0 && (
                <section className="mt-20 pt-16 border-t">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                  >
                    <Badge variant="secondary" className="mb-4 px-6 py-2 text-lg font-medium bg-purple-100 text-purple-800">
                      <Award className="h-4 w-4 mr-2" />
                      Our Impact
                    </Badge>
                    
                    <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
                      Transforming{" "}
                      <span className="text-gradient bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Agriculture
                      </span>
                    </h2>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {portfolioSections.map((section, index) => (
                      <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                          {section.image_url && (
                            <div className="h-48 overflow-hidden rounded-t-lg">
                              <img 
                                src={section.image_url} 
                                alt={section.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          
                          <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                              <Tractor className="h-4 w-4 text-primary" />
                              <Badge variant="outline" className="capitalize">
                                {section.section_type}
                              </Badge>
                            </div>
                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                              {section.title}
                            </CardTitle>
                          </CardHeader>

                          <CardContent>
                            <p className="text-muted-foreground">
                              {section.content}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}
            </Tabs>

            {/* Regions Section */}
            <section className="mt-20 pt-16 border-t">
              <div className="text-center mb-16">
                <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
                  Growing Regions
                </Badge>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Agricultural{" "}
                  <span className="text-gradient">Heartlands</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Explore the diverse agricultural regions of Rajasthan, each with unique 
                  climatic conditions and specialties.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regions?.map((region, index) => (
                  <motion.div
                    key={region.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <MapPin className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle>{region.name}</CardTitle>
                            <CardDescription>{region.district_name} District</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Climate:</span>
                            <div className="text-muted-foreground">{region.climate_zone}</div>
                          </div>
                          <div>
                            <span className="font-medium">Soil Type:</span>
                            <div className="text-muted-foreground">{region.soil_type}</div>
                          </div>
                          <div>
                            <span className="font-medium">Rainfall:</span>
                            <div className="text-muted-foreground">{region.annual_rainfall}</div>
                          </div>
                          <div>
                            <span className="font-medium">Temperature:</span>
                            <div className="text-muted-foreground">{region.temperature_range}</div>
                          </div>
                        </div>

                        {region.major_crops && region.major_crops.length > 0 && (
                          <div>
                            <div className="text-sm font-medium mb-2">Major Crops:</div>
                            <div className="flex flex-wrap gap-1">
                              {region.major_crops.map((crop, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {crop}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {region.specialties && region.specialties.length > 0 && (
                          <div>
                            <div className="text-sm font-medium mb-2">Specialties:</div>
                            <div className="text-sm text-muted-foreground">
                              {region.specialties.join(', ')}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
};

export default RajasthanPortfolio;