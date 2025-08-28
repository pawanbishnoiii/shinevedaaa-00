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
  Clock,
  Leaf,
  Sun,
  Cloud,
  Thermometer,
  Heart,
  Users,
  Tractor,
  Droplets,
  TrendingUp,
  Package,
  Play,
  Eye,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import rajasthanFarmers from '@/assets/rajasthan-farmers.jpg';
import farmingFamily from '@/assets/farming-family.jpg';
import modernAgriculture from '@/assets/modern-agriculture.jpg';

const RajasthanPortfolio = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

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
    { value: 'all', label: 'All Crops', icon: Package, color: 'from-green-500 to-emerald-600' },
    { value: 'Rabi', label: 'Rabi (Winter)', icon: Sun, color: 'from-orange-500 to-yellow-600' },
    { value: 'Kharif', label: 'Kharif (Monsoon)', icon: Cloud, color: 'from-blue-500 to-indigo-600' },
    { value: 'Zaid', label: 'Zaid (Summer)', icon: Thermometer, color: 'from-red-500 to-pink-600' }
  ];

  const seasonStats = {
    'Rabi': { duration: '4-6 months', bestTime: 'Nov-Apr', waterReq: 'Moderate' },
    'Kharif': { duration: '3-5 months', bestTime: 'Jun-Oct', waterReq: 'High' },
    'Zaid': { duration: '2-4 months', bestTime: 'Mar-Jun', waterReq: 'Very High' }
  };

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

  const getCategoryGradient = (season: string) => {
    switch (season) {
      case 'Rabi': return 'from-orange-400 to-yellow-500';
      case 'Kharif': return 'from-blue-400 to-indigo-500';
      case 'Zaid': return 'from-red-400 to-pink-500';
      default: return 'from-green-400 to-emerald-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading Rajasthan's agricultural heritage...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Rajasthan Agriculture Portfolio - Premium Farming Heritage | ShineVeda Exports</title>
        <meta 
          name="description" 
          content="Explore Rajasthan's rich agricultural heritage featuring premium crops like onions, jeera, peanuts, and mustard. Discover farmer stories, seasonal cultivation, and export quality produce from Sri Ganganagar." 
        />
        <meta name="keywords" content="rajasthan agriculture, indian farmers, crop cultivation, onions jeera peanuts, agricultural exports, sri ganganagar farming, seasonal crops, indian agriculture heritage" />
        <link rel="canonical" href="https://shineveda.in/rajasthan-portfolio" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Rajasthan Agriculture Portfolio",
            "description": "Comprehensive showcase of Rajasthan's agricultural excellence and farmer heritage",
            "publisher": {
              "@type": "Organization",
              "name": "ShineVeda Exports",
              "url": "https://shineveda.in"
            },
            "mainEntity": {
              "@type": "ItemList",
              "name": "Rajasthan Agricultural Crops",
              "numberOfItems": crops?.length || 0,
              "itemListElement": crops?.map((crop, index) => ({
                "@type": "Product",
                "position": index + 1,
                "name": crop.name,
                "description": crop.description,
                "category": `${crop.season} Season Crop`,
                "offers": {
                  "@type": "Offer",
                  "availability": "https://schema.org/InStock"
                }
              })) || []
            }
          })}
        </script>
      </Helmet>

      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={rajasthanFarmers}
              alt="Rajasthan agricultural landscape with farmers" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white"
            >
              <Badge variant="secondary" className="mb-6 px-6 py-3 text-base font-semibold bg-white/20 backdrop-blur-sm border-white/30">
                <Tractor className="h-5 w-5 mr-2" />
                Rajasthan Agriculture Heritage
              </Badge>
              
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                Golden Land of{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Agriculture
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-12">
                From the fertile plains of Sri Ganganagar to the traditional farming villages, 
                discover the rich agricultural heritage that feeds the world with premium quality crops.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                {[
                  { number: `${crops?.length || 0}+`, label: "Premium Crops" },
                  { number: "10+", label: "Districts" },
                  { number: "1000+", label: "Farmer Families" },
                  { number: "25+", label: "Export Countries" }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                    <div className="text-white/80 text-sm md:text-base">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
          >
            <div className="w-6 h-10 border-2 border-white/50 rounded-full p-1">
              <div className="w-1 h-3 bg-white/70 rounded-full mx-auto animate-pulse" />
            </div>
          </motion.div>
        </section>

        {/* Main Content */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-12">
              {/* Category Navigation */}
              <div className="text-center space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                    Seasonal <span className="text-gradient bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Cultivation</span>
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Explore our diverse crop portfolio organized by India's three main agricultural seasons
                  </p>
                </motion.div>

                <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-transparent p-0 h-auto">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <TabsTrigger 
                        key={category.value} 
                        value={category.value}
                        className={`
                          flex-col gap-3 p-6 h-auto bg-gradient-to-br ${category.color} text-white 
                          data-[state=active]:bg-gradient-to-br data-[state=active]:${category.color}
                          data-[state=active]:scale-105 transition-all duration-300
                          hover:scale-102 rounded-xl border-0
                        `}
                      >
                        <Icon className="h-8 w-8" />
                        <span className="font-semibold text-base">{category.label}</span>
                        {category.value !== 'all' && seasonStats[category.value as keyof typeof seasonStats] && (
                          <span className="text-xs opacity-90">
                            {seasonStats[category.value as keyof typeof seasonStats].duration}
                          </span>
                        )}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              {/* Seasonal Information */}
              {activeCategory !== 'all' && seasonStats[activeCategory as keyof typeof seasonStats] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="space-y-2">
                      <Calendar className="h-8 w-8 text-primary mx-auto" />
                      <h3 className="font-semibold text-lg">Best Growing Period</h3>
                      <p className="text-muted-foreground">{seasonStats[activeCategory as keyof typeof seasonStats].bestTime}</p>
                    </div>
                    <div className="space-y-2">
                      <Clock className="h-8 w-8 text-primary mx-auto" />
                      <h3 className="font-semibold text-lg">Crop Duration</h3>
                      <p className="text-muted-foreground">{seasonStats[activeCategory as keyof typeof seasonStats].duration}</p>
                    </div>
                    <div className="space-y-2">
                      <Droplets className="h-8 w-8 text-primary mx-auto" />
                      <h3 className="font-semibold text-lg">Water Requirement</h3>
                      <p className="text-muted-foreground">{seasonStats[activeCategory as keyof typeof seasonStats].waterReq}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Crops Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCrops?.map((crop, index) => {
                  const CategoryIcon = getCategoryIcon(crop.season || '');
                  return (
                    <motion.div
                      key={crop.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-2xl transition-all duration-500 group overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-full bg-gradient-to-r ${getCategoryGradient(crop.season || '')}`}>
                                  <CategoryIcon className="h-5 w-5 text-white" />
                                </div>
                                <Badge 
                                  variant="outline" 
                                  className={`border-0 bg-gradient-to-r ${getCategoryGradient(crop.season || '')} text-white font-medium`}
                                >
                                  {crop.season}
                                </Badge>
                                {crop.region && (
                                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                    {crop.region}
                                  </Badge>
                                )}
                              </div>
                              <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-300">
                                {crop.name}
                              </CardTitle>
                            </div>
                            {crop.image_url && (
                              <div className="ml-4 relative group">
                                <img 
                                  src={crop.image_url} 
                                  alt={crop.name}
                                  className="w-20 h-20 rounded-xl object-cover shadow-lg group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </div>
                            )}
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                          <p className="text-muted-foreground leading-relaxed line-clamp-3">
                            {crop.description}
                          </p>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                              <Calendar className="h-5 w-5 text-green-600 flex-shrink-0" />
                              <div>
                                <div className="font-semibold text-green-800">Duration</div>
                                <div className="text-green-600">{crop.duration_days} days</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                              <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0" />
                              <div>
                                <div className="font-semibold text-blue-800">Region</div>
                                <div className="text-blue-600">{crop.region || 'Rajasthan'}</div>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-gray-100">
                            <Button 
                              variant="outline" 
                              className="w-full group-hover:bg-primary group-hover:text-white transition-all duration-300"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Learn More
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </Tabs>
          </div>
        </section>

        {/* Farmer Stories Section */}
        {stories && stories.length > 0 && (
          <section className="py-20 bg-gradient-to-b from-green-50 to-yellow-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <Badge variant="secondary" className="mb-6 px-6 py-3 text-base font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
                  <Heart className="h-5 w-5 mr-2" />
                  Stories from the Fields
                </Badge>
                
                <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
                  Meet Our{" "}
                  <span className="text-gradient bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Farming Heroes
                  </span>
                </h2>
                
                <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                  Discover the inspiring stories of farmers whose dedication and traditional knowledge create 
                  the premium agricultural products that reach global markets.
                </p>
              </motion.div>

              {/* Featured Story Highlight */}
              <div className="mb-16">
                <div className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src={farmingFamily}
                    alt="Indian farming family" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <Badge className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30">
                      <Users className="h-4 w-4 mr-2" />
                      Featured Story
                    </Badge>
                    <h3 className="text-3xl md:text-4xl font-bold mb-4">
                      Three Generations of Agricultural Excellence
                    </h3>
                    <p className="text-lg text-white/90 max-w-2xl mb-6">
                      The Kumar family from Hanumangarh has been cultivating premium onions and mustard for over 60 years, 
                      combining traditional wisdom with modern farming techniques to produce export-quality crops.
                    </p>
                    <Button className="bg-white text-primary hover:bg-white/90">
                      <Play className="h-4 w-4 mr-2" />
                      Watch Their Story
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-500 group overflow-hidden border-0">
                      {story.hero_image_url && (
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={story.hero_image_url} 
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="h-5 w-5 text-primary" />
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {story.village} • {story.district}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {story.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed line-clamp-4 mb-4">
                          {story.content}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t">
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                            Read Full Story
                          </Button>
                          {story.video_url && (
                            <Button variant="outline" size="sm">
                              <Play className="h-3 w-3 mr-1" />
                              Video
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Agricultural Innovation Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white border-0">
                  <Award className="h-4 w-4 mr-2" />
                  Innovation Excellence
                </Badge>
                
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                  Bridging <span className="text-gradient bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Tradition</span>
                  <br />& Technology
                </h2>
                
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Our farmers seamlessly blend age-old agricultural wisdom with cutting-edge farming technologies, 
                  ensuring sustainable practices while maximizing crop quality and yield.
                </p>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: TrendingUp, label: "25% Yield Increase", desc: "Through smart irrigation" },
                    { icon: Leaf, label: "Organic Certified", desc: "Zero harmful chemicals" },
                    { icon: Package, label: "Export Grade", desc: "International standards" },
                    { icon: Award, label: "Quality Assured", desc: "Premium certification" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{item.label}</div>
                        <div className="text-sm text-muted-foreground">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={modernAgriculture}
                    alt="Modern agriculture with traditional methods" 
                    className="w-full h-[500px] object-cover"
                  />
                </div>
                
                {/* Floating stats */}
                <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border">
                  <div className="text-3xl font-bold text-primary">95%</div>
                  <div className="text-sm text-muted-foreground">Export Quality</div>
                </div>
                
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl border">
                  <div className="text-3xl font-bold text-green-600">1000+</div>
                  <div className="text-sm text-muted-foreground">Farmer Partners</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default RajasthanPortfolio;