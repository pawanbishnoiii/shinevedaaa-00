import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Search, 
  Calendar, 
  User, 
  ArrowRight, 
  Tag,
  Clock,
  Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'farmer-stories' | 'agri-tips' | 'export-insights' | 'packaging' | 'govt-schemes';
  author: string;
  authorType: 'farmer' | 'agronomist' | 'expert';
  publishDate: string;
  readTime: string;
  image: string;
  tags: string[];
  featured: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Modern Drip Irrigation Techniques for Small Land Holdings',
    excerpt: 'Learn how small farmers in Rajasthan are increasing yields by 40% using efficient drip irrigation systems.',
    content: 'Detailed guide on implementing drip irrigation...',
    category: 'agri-tips',
    author: 'Dr. Rajesh Kumar',
    authorType: 'agronomist',
    publishDate: '2024-08-15',
    readTime: '5 min read',
    image: '/data/img/drip-irrigation-rajasthan.jpg',
    tags: ['irrigation', 'water-conservation', 'small-farmers', 'rajasthan'],
    featured: true
  },
  {
    id: '2',
    title: 'From 2 Bigha to Prosperity: राम सिंह जी की कहानी',
    excerpt: 'How Ram Singh transformed his farming with modern techniques and achieved 30% income increase.',
    content: 'Detailed farmer success story...',
    category: 'farmer-stories',
    author: 'राम सिंह',
    authorType: 'farmer',
    publishDate: '2024-08-10',
    readTime: '7 min read',
    image: '/src/assets/rajasthan-farmers.jpg',
    tags: ['success-story', 'sikar', 'income-increase', 'modern-farming'],
    featured: true
  },
  {
    id: '3',
    title: 'Export Quality Standards for Indian Onions',
    excerpt: 'Understanding international quality parameters and grading systems for onion exports.',
    content: 'Comprehensive guide on export standards...',
    category: 'export-insights',
    author: 'Priya Sharma',
    authorType: 'expert',
    publishDate: '2024-08-05',
    readTime: '6 min read',
    image: '/data/img/onion-quality-grading.jpg',
    tags: ['export', 'quality-standards', 'onions', 'grading'],
    featured: false
  },
  {
    id: '4',
    title: 'Proper Storage Techniques for Jeera (Cumin)',
    excerpt: 'Maintain oil content and aroma of cumin with these post-harvest storage methods.',
    content: 'Storage and preservation techniques...',
    category: 'packaging',
    author: 'Harinder Singh',
    authorType: 'expert',
    publishDate: '2024-07-28',
    readTime: '4 min read',
    image: '/data/img/jeera-storage-facility.jpg',
    tags: ['storage', 'jeera', 'post-harvest', 'quality-preservation'],
    featured: false
  },
  {
    id: '5',
    title: 'PM-KISAN Scheme Benefits for Small Farmers',
    excerpt: 'Complete guide to government schemes and subsidies available for agricultural development.',
    content: 'Government schemes overview...',
    category: 'govt-schemes',
    author: 'Agricultural Officer',
    authorType: 'expert',
    publishDate: '2024-07-20',
    readTime: '8 min read',
    image: '/data/img/government-scheme-benefits.jpg',
    tags: ['government', 'subsidies', 'pm-kisan', 'small-farmers'],
    featured: false
  },
  {
    id: '6',
    title: 'Women-Led Farming Cooperatives: A Success Model',
    excerpt: 'How women farmers in Jhunjhunu are creating sustainable agricultural businesses.',
    content: 'Women empowerment in agriculture...',
    category: 'farmer-stories',
    author: 'सरिता देवी',
    authorType: 'farmer',
    publishDate: '2024-07-15',
    readTime: '6 min read',
    image: '/data/img/women-farmers-cooperative.jpg',
    tags: ['women-farmers', 'cooperative', 'empowerment', 'jhunjhunu'],
    featured: true
  }
];

const categories = [
  { id: 'all', label: 'All Posts', color: 'bg-gray-100 text-gray-800' },
  { id: 'farmer-stories', label: 'Farmer Stories', color: 'bg-green-100 text-green-800' },
  { id: 'agri-tips', label: 'Agri Tips', color: 'bg-blue-100 text-blue-800' },
  { id: 'export-insights', label: 'Export Insights', color: 'bg-purple-100 text-purple-800' },
  { id: 'packaging', label: 'Packaging & Grading', color: 'bg-orange-100 text-orange-800' },
  { id: 'govt-schemes', label: 'Govt Schemes', color: 'bg-red-100 text-red-800' }
];

const AgriBlog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  const getAuthorIcon = (authorType: string) => {
    switch (authorType) {
      case 'farmer': return '🌾';
      case 'agronomist': return '🔬';
      case 'expert': return '🎓';
      default: return '👤';
    }
  };

  return (
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
          <BookOpen className="h-4 w-4 mr-2" />
          Knowledge Hub — ज्ञान केंद्र
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
          Agricultural Insights & Stories
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Discover the latest insights in agriculture, farmer success stories, export guidance, 
          and practical tips for modern farming techniques.
        </p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="text-xs"
            >
              <Tag className="h-3 w-3 mr-1" />
              {category.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-center">Featured Articles</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getCategoryInfo(post.category).color}>
                        {getCategoryInfo(post.category).label}
                      </Badge>
                      <Badge variant="secondary">Featured</Badge>
                    </div>
                    <h3 className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-4">
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{getAuthorIcon(post.authorType)} {post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </div>
                      
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        Read More
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Regular Posts */}
      {regularPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-center">Latest Articles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {regularPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group hover:shadow-md transition-all duration-300 overflow-hidden">
                  <div className="grid md:grid-cols-3 gap-0">
                    <div className="aspect-video md:aspect-square overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    
                    <CardContent className="md:col-span-2 p-6 flex flex-col justify-center">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryInfo(post.category).color}>
                            {getCategoryInfo(post.category).label}
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{getAuthorIcon(post.authorType)} {post.author}</span>
                            <span>•</span>
                            <span>{post.readTime}</span>
                          </div>
                          
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 p-0">
                            <Share2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center py-12"
        >
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No articles found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or category filters to find what you're looking for.
          </p>
          <Button variant="outline" onClick={() => {setSearchQuery(''); setSelectedCategory('all');}}>
            Clear Filters
          </Button>
        </motion.div>
      )}

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 text-center"
      >
        <BookOpen className="h-12 w-12 mx-auto text-primary mb-4" />
        <h3 className="text-2xl font-bold mb-4">Share Your Story</h3>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Are you a farmer with an inspiring success story? We'd love to feature your journey 
          and help other farmers learn from your experience.
        </p>
        <Button asChild size="lg">
          <Link to="/contact">
            <User className="h-5 w-5 mr-2" />
            Submit Your Story
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default AgriBlog;