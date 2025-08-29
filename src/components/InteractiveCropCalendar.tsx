import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Droplets, Sun, Thermometer, Sprout } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Crop {
  id: string;
  name: string;
  image_url: string;
  season: string;
  region: string;
  duration_days: number;
  description: string;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const seasons = {
  'Rabi': { months: [10, 11, 0, 1, 2, 3], color: 'bg-blue-500', icon: Droplets },
  'Kharif': { months: [5, 6, 7, 8, 9], color: 'bg-green-500', icon: Sun },
  'Zaid': { months: [1, 2, 3, 4, 5], color: 'bg-yellow-500', icon: Thermometer },
  'Year-round': { months: [0,1,2,3,4,5,6,7,8,9,10,11], color: 'bg-purple-500', icon: Sprout }
};

const InteractiveCropCalendar: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedSeason, setSelectedSeason] = useState<string>('all');

  const { data: crops, isLoading } = useQuery({
    queryKey: ['rajasthan-crops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rajasthan_crops')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as Crop[];
    }
  });

  const getCropsForMonth = (monthIndex: number) => {
    return crops?.filter(crop => {
      const season = crop.season;
      const seasonData = seasons[season as keyof typeof seasons];
      return seasonData?.months.includes(monthIndex);
    }) || [];
  };

  const filteredCrops = selectedSeason === 'all' 
    ? getCropsForMonth(selectedMonth)
    : crops?.filter(crop => crop.season === selectedSeason) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-32 bg-muted animate-pulse" />
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Interactive Crop Calendar</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore the seasonal farming patterns of Rajasthan. Click on any month to see which crops are cultivated during that period.
        </p>
      </div>

      {/* Season Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant={selectedSeason === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedSeason('all')}
        >
          All Seasons
        </Button>
        {Object.entries(seasons).map(([season, data]) => {
          const Icon = data.icon;
          return (
            <Button
              key={season}
              variant={selectedSeason === season ? 'default' : 'outline'}
              onClick={() => setSelectedSeason(season)}
              className="flex items-center space-x-2"
            >
              <Icon className="w-4 h-4" />
              <span>{season}</span>
            </Button>
          );
        })}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-3">
        {months.map((month, index) => {
          const cropsCount = getCropsForMonth(index).length;
          const isSelected = selectedMonth === index;
          
          return (
            <motion.button
              key={month}
              onClick={() => setSelectedMonth(index)}
              className={`relative p-4 rounded-lg border-2 transition-all ${
                isSelected 
                  ? 'border-primary bg-primary/10 shadow-lg scale-105' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
                <h3 className="font-medium text-sm">{month}</h3>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {cropsCount} crops
                </Badge>
              </div>
              
              {/* Season Indicators */}
              <div className="absolute top-1 right-1 flex space-x-1">
                {Object.entries(seasons).map(([season, data]) => {
                  if (data.months.includes(index)) {
                    return (
                      <div
                        key={season}
                        className={`w-2 h-2 rounded-full ${data.color}`}
                        title={season}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Month Info */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span>{months[selectedMonth]} Crops</span>
            <Badge variant="outline">{filteredCrops.length} varieties</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCrops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCrops.map((crop, index) => (
                <motion.div
                  key={crop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video relative">
                      <img
                        src={crop.image_url || '/placeholder.svg'}
                        alt={crop.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className={seasons[crop.season as keyof typeof seasons]?.color || 'bg-gray-500'}>
                          {crop.season}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{crop.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {crop.description}
                      </p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>📍 {crop.region}</span>
                        <span>⏱️ {crop.duration_days} days</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Sprout className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No crops available for {months[selectedMonth]} in the selected season.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveCropCalendar;