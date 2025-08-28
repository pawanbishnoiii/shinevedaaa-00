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
  Mountain
} from 'lucide-react';
import { motion } from 'framer-motion';

const RajasthanPortfolio = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  // Mock data until migration is applied
  const mockCrops = [
    {
      id: '1',
      name: 'Onions',
      hindi_name: 'प्याज',
      scientific_name: 'Allium cepa',
      category: 'Rabi',
      sowing_season: 'October-December',
      harvesting_season: 'March-May',
      growing_months: 5,
      water_requirement: 'Medium (400-600mm)',
      soil_type: 'Well-drained loamy soil',
      yield_per_hectare: '200-300 quintals/hectare',
      market_price_range: '₹800-2000/quintal',
      description: 'High-quality export onions with excellent storage life and pungency levels ideal for international markets.',
      export_markets: ['Dubai', 'Singapore', 'Malaysia', 'Bangladesh'],
      is_major_crop: true,
      is_active: true,
      image_url: '/data/img/placeholder-product.jpg'
    },
    {
      id: '2',
      name: 'Jeera (Cumin)',
      hindi_name: 'जीरा',
      scientific_name: 'Cuminum cyminum',
      category: 'Rabi',
      sowing_season: 'November-December',
      harvesting_season: 'April-May',
      growing_months: 5,
      water_requirement: 'Low (200-400mm)',
      soil_type: 'Sandy loam',
      yield_per_hectare: '4-6 quintals/hectare',
      market_price_range: '₹15000-25000/quintal',
      description: 'Premium quality cumin seeds with high oil content and strong aroma, highly demanded in international spice markets.',
      export_markets: ['USA', 'Europe', 'Middle East', 'Japan'],
      is_major_crop: true,
      is_active: true,
      image_url: '/data/img/placeholder-product.jpg'
    }
  ];

  const mockRegions = [
    {
      id: '1',
      name: 'Sri Ganganagar',
      district_name: 'Sri Ganganagar',
      climate_zone: 'Arid',
      soil_type: 'Alluvial',
      major_crops: ['Wheat', 'Rice', 'Cotton', 'Onions', 'Carrots'],
      annual_rainfall: '200-400mm',
      temperature_range: '5°C to 48°C',
      specialties: ['Canal irrigation', 'Export hub', 'Food processing'],
      is_active: true
    }
  ];

  const crops = mockCrops;
  const regions = mockRegions;

  const categories = [
    { value: 'all', label: 'All Crops', icon: Package },
    { value: 'Rabi', label: 'Rabi Season', icon: Sun },
    { value: 'Kharif', label: 'Kharif Season', icon: Cloud },
    { value: 'Zaid', label: 'Zaid Season', icon: Thermometer }
  ];

  const filteredCrops = crops?.filter(crop => 
    activeCategory === 'all' || crop.category === activeCategory
  );

  const majorCrops = crops?.filter(crop => crop.is_major_crop);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Rabi': return Sun;
      case 'Kharif': return Cloud;
      case 'Zaid': return Thermometer;
      default: return Leaf;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Rabi': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Kharif': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Zaid': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
              "numberOfItems": crops?.length || 7,
              "itemListElement": majorCrops?.map((crop, index) => ({
                "@type": "Product",
                "position": index + 1,
                "name": crop.name,
                "description": crop.description,
                "category": crop.category
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
                  const CategoryIcon = getCategoryIcon(crop.category);
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
                                  className={getCategoryColor(crop.category)}
                                >
                                  {crop.category}
                                </Badge>
                                {crop.is_major_crop && (
                                  <Badge variant="default" className="bg-gold text-gold-foreground">
                                    Major Export
                                  </Badge>
                                )}
                              </div>
                              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                {crop.name}
                                {crop.hindi_name && (
                                  <span className="text-sm text-muted-foreground font-normal ml-2">
                                    ({crop.hindi_name})
                                  </span>
                                )}
                              </CardTitle>
                              {crop.scientific_name && (
                                <CardDescription className="italic">
                                  {crop.scientific_name}
                                </CardDescription>
                              )}
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
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {crop.description}
                          </p>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-green-600" />
                              <div>
                                <div className="font-medium">Growing Period</div>
                                <div className="text-muted-foreground">{crop.growing_months} months</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <div>
                                <div className="font-medium">Season</div>
                                <div className="text-muted-foreground">{crop.sowing_season}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Droplets className="h-4 w-4 text-cyan-600" />
                              <div>
                                <div className="font-medium">Water Need</div>
                                <div className="text-muted-foreground">{crop.water_requirement}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-orange-600" />
                              <div>
                                <div className="font-medium">Yield</div>
                                <div className="text-muted-foreground">{crop.yield_per_hectare}</div>
                              </div>
                            </div>
                          </div>

                          {crop.export_markets && crop.export_markets.length > 0 && (
                            <div>
                              <div className="text-sm font-medium mb-2 flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                Export Markets
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {crop.export_markets.slice(0, 4).map((market, idx) => (
                                  <Badge 
                                    key={idx} 
                                    variant="secondary" 
                                    className="text-xs bg-blue-50 text-blue-700"
                                  >
                                    {market}
                                  </Badge>
                                ))}
                                {crop.export_markets.length > 4 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{crop.export_markets.length - 4} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="pt-2 border-t">
                            <div className="text-sm font-medium text-primary">
                              Price Range: {crop.market_price_range}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
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