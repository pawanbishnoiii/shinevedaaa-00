import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Globe, Package } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

interface Stat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: React.ComponentType<any>;
  color: string;
}

const defaultStats: Stat[] = [
  {
    id: 'exports',
    label: 'Countries Served',
    value: 25,
    suffix: '+',
    icon: Globe,
    color: 'text-blue-500'
  },
  {
    id: 'farmers',
    label: 'Partner Farmers',
    value: 1500,
    suffix: '+',
    icon: Users,
    color: 'text-green-500'
  },
  {
    id: 'products',
    label: 'Quality Products',
    value: 50,
    suffix: '+',
    icon: Package,
    color: 'text-purple-500'
  },
  {
    id: 'growth',
    label: 'Annual Growth',
    value: 35,
    suffix: '%',
    icon: TrendingUp,
    color: 'text-orange-500'
  }
];

interface AnimatedStatisticsProps {
  stats?: Stat[];
  title?: string;
  subtitle?: string;
}

const AnimatedStatistics: React.FC<AnimatedStatisticsProps> = ({
  stats = defaultStats,
  title = "Our Impact in Numbers",
  subtitle = "Connecting Rajasthan's agricultural excellence with global markets"
}) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});

  useEffect(() => {
    if (inView) {
      stats.forEach((stat) => {
        let start = 0;
        const end = stat.value;
        const duration = 2000; // 2 seconds
        const increment = end / (duration / 16); // 60fps

        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            start = end;
            clearInterval(timer);
          }
          setAnimatedValues(prev => ({
            ...prev,
            [stat.id]: Math.floor(start)
          }));
        }, 16);
      });
    }
  }, [inView, stats]);

  return (
    <section ref={ref} className="py-16 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const animatedValue = animatedValues[stat.id] || 0;
            
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="relative">
                      {/* Background Icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-5">
                        <Icon className="w-24 h-24" />
                      </div>
                      
                      {/* Main Icon */}
                      <div className="relative z-10 mb-4">
                        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                          <Icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                      </div>
                      
                      {/* Animated Number */}
                      <div className="relative z-10">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={animatedValue}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-3xl md:text-4xl font-bold mb-2"
                          >
                            {animatedValue.toLocaleString()}{stat.suffix}
                          </motion.div>
                        </AnimatePresence>
                        
                        <h3 className="text-lg font-semibold text-muted-foreground">
                          {stat.label}
                        </h3>
                      </div>
                    </div>
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="px-4 py-2">
              🏆 ISO Certified
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              🌱 Organic Products
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              🚚 Global Shipping
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              ⚡ Fast Delivery
            </Badge>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedStatistics;