import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, TrendingUp, Users, Heart, ArrowRight, X } from 'lucide-react';

interface FarmerStory {
  id: string;
  name: string;
  location: string;
  state: string;
  title: string;
  excerpt: string;
  fullStory: string;
  beforeStats: { metric: string; value: string };
  afterStats: { metric: string; value: string };
  improvement: string;
  image: string;
  category: 'success' | 'innovation' | 'community';
}

const farmerStories: FarmerStory[] = [
  {
    id: '1',
    name: 'राम सिंह जी',
    location: 'Sikar',
    state: 'Rajasthan',
    title: 'From Leased Land to Prosperity',
    excerpt: 'Small landholder transformed farming with drip irrigation and improved seeds, achieving 30% higher earnings.',
    fullStory: 'राम सिंह जी started with just 2 bigha of leased land in Sikar district. With ShineVeda\'s guidance on modern farming techniques including drip irrigation and high-yield seed varieties, he not only improved his crop quality but also reduced water consumption by 40%. Today, he grows premium onions that meet export standards and has expanded to 5 bigha of land.',
    beforeStats: { metric: 'Annual Income', value: '₹80,000' },
    afterStats: { metric: 'Annual Income', value: '₹1,04,000' },
    improvement: '+30% increase',
    image: '/src/assets/rajasthan-farmers.jpg',
    category: 'success'
  },
  {
    id: '2',
    name: 'Harpreet Kaur',
    location: 'Ludhiana',
    state: 'Punjab',
    title: 'Diversification Success with Cumin',
    excerpt: 'Punjab farmer diversified from traditional crops to cumin cultivation with ShineVeda support.',
    fullStory: 'Harpreet Kaur was growing traditional wheat and rice in Punjab when she learned about cumin cultivation opportunities through ShineVeda. Our agronomists provided technical guidance on soil preparation, seed selection, and harvesting techniques specific to cumin. She now supplies premium quality jeera to our export division.',
    beforeStats: { metric: 'Crop Diversity', value: '2 crops' },
    afterStats: { metric: 'Crop Diversity', value: '4 crops' },
    improvement: '100% diversification',
    image: '/src/assets/modern-agriculture.jpg',
    category: 'innovation'
  },
  {
    id: '3',
    name: 'सरिता देवी',
    location: 'Jhunjhunu',
    state: 'Rajasthan',
    title: 'Women-Led Farming Cooperative',
    excerpt: 'Leading a women farmers cooperative with focus on organic packaging and direct market access.',
    fullStory: 'सरिता देवी organized 15 women farmers in her village to form a cooperative focused on organic farming and value-added packaging. Through ShineVeda\'s partnership, they learned modern packaging techniques, quality grading, and now their produce reaches international markets directly. The cooperative has become a model for other villages.',
    beforeStats: { metric: 'Farmers Involved', value: '1 individual' },
    afterStats: { metric: 'Farmers Involved', value: '15 cooperative' },
    improvement: '1400% growth',
    image: '/src/assets/farming-family.jpg',
    category: 'community'
  }
];

const FarmerStories: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<FarmerStory | null>(null);

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
          {farmerStories.map((story, index) => (
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
                    src={story.image}
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
                  
                  <div className="bg-muted/50 p-3 rounded-lg mb-4">
                    <div className="flex justify-between items-center">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Before</div>
                        <div className="font-semibold">{story.beforeStats.value}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-primary" />
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">After</div>
                        <div className="font-semibold">{story.afterStats.value}</div>
                      </div>
                    </div>
                    <div className="text-center mt-2">
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {story.improvement}
                      </Badge>
                    </div>
                  </div>
                  
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
                  src={selectedStory.image}
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
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Before</div>
                      <div className="font-semibold">{selectedStory.beforeStats.metric}</div>
                      <div className="text-lg font-bold">{selectedStory.beforeStats.value}</div>
                    </div>
                    <div className="flex items-center justify-center">
                      <ArrowRight className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">After</div>
                      <div className="font-semibold">{selectedStory.afterStats.metric}</div>
                      <div className="text-lg font-bold">{selectedStory.afterStats.value}</div>
                    </div>
                  </div>
                  <div className="text-center mt-3">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {selectedStory.improvement}
                    </Badge>
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  <p className="text-lg leading-relaxed">{selectedStory.fullStory}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FarmerStories;