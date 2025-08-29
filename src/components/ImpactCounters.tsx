import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MapPin, 
  Wheat, 
  Award,
  TrendingUp,
  Heart,
  Package,
  Globe
} from 'lucide-react';

const impactStats = [
  {
    icon: <Users className="h-8 w-8" />,
    number: '500+',
    label: 'Farmers Supported',
    description: 'Partner farmers across Rajasthan & Punjab',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900'
  },
  {
    icon: <Package className="h-8 w-8" />,
    number: '2,500+',
    label: 'Tons Exported',
    description: 'Premium quality agricultural products',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900'
  },
  {
    icon: <MapPin className="h-8 w-8" />,
    number: '15+',
    label: 'States Served',
    description: 'Across India with focus on Rajasthan',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900'
  },
  {
    icon: <Award className="h-8 w-8" />,
    number: '99%',
    label: 'Quality Assurance',
    description: 'Export grade quality maintained',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900'
  },
  {
    icon: <Wheat className="h-8 w-8" />,
    number: '25+',
    label: 'Crop Varieties',
    description: 'Diverse agricultural portfolio',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100 dark:bg-amber-900'
  },
  {
    icon: <Globe className="h-8 w-8" />,
    number: '30+',
    label: 'Countries Reached',
    description: 'Global export network',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900'
  }
];

const ImpactCounters: React.FC = () => {
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
          <TrendingUp className="h-4 w-4 mr-2" />
          Impact & Growth — प्रभाव और विकास
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
          Our Agricultural Impact
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Through partnerships with farmers across India, we're creating sustainable 
          agricultural value chains that benefit communities and deliver quality products globally.
        </p>
      </motion.div>

      {/* Impact Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {impactStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="group hover:shadow-lg transition-all duration-300 text-center h-full">
              <CardContent className="p-6 space-y-4">
                <div className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
                
                <div>
                  <motion.div
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold text-foreground mb-2"
                  >
                    {stat.number}
                  </motion.div>
                  
                  <h3 className="text-lg font-semibold mb-2">{stat.label}</h3>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Additional Impact Information */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-2xl p-8 md:p-12"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              Sustainable Growth Model
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Our farmer-first approach ensures that agricultural communities benefit 
                directly from global trade opportunities. We focus on building long-term 
                partnerships that create sustainable livelihoods.
              </p>
              <p>
                Through direct sourcing, fair pricing, and technical support, we've helped 
                increase farmer incomes by an average of 25-35% while maintaining the 
                highest quality standards for export markets.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 text-center bg-white/80 backdrop-blur">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">85%</div>
              <div className="text-sm text-muted-foreground">Farmer Satisfaction</div>
            </Card>
            
            <Card className="p-4 text-center bg-white/80 backdrop-blur">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">30%</div>
              <div className="text-sm text-muted-foreground">Income Increase</div>
            </Card>
            
            <Card className="p-4 text-center bg-white/80 backdrop-blur">
              <Package className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">95%</div>
              <div className="text-sm text-muted-foreground">On-time Delivery</div>
            </Card>
            
            <Card className="p-4 text-center bg-white/80 backdrop-blur">
              <Globe className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">98%</div>
              <div className="text-sm text-muted-foreground">Export Compliance</div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ImpactCounters;