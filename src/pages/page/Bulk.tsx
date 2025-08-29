import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Package, Truck, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Bulk = () => {
  const benefits = [
    {
      icon: Package,
      title: "Volume Discounts",
      description: "Competitive pricing for large quantity orders with flexible payment terms"
    },
    {
      icon: Truck,
      title: "Direct Shipping",
      description: "Container loads shipped directly from our processing facilities"
    },
    {
      icon: Globe,
      title: "Global Delivery",
      description: "Worldwide shipping with proper export documentation and insurance"
    },
    {
      icon: Shield,
      title: "Quality Guarantee",
      description: "Pre-shipment inspection and quality certificates for every bulk order"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Bulk Orders — ShineVeda | Wholesale Agricultural Exports</title>
        <meta name="description" content="ShineVeda bulk orders for agricultural commodities. Container loads, volume discounts, global shipping with quality guarantees." />
        <meta name="keywords" content="bulk orders, wholesale, container loads, agricultural exports, volume discounts" />
        <link rel="canonical" href={`${window.location.origin}/page/bulk`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-foreground mb-6">Bulk Orders</h1>
            
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-muted-foreground text-lg">
                Partner with ShineVeda for your bulk agricultural commodity needs. 
                We specialize in large-scale orders with competitive pricing, 
                reliable supply chains, and quality assurance for global markets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card rounded-lg p-6 border border-border"
                >
                  <benefit.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-primary/5 rounded-lg p-8 text-center"
            >
              <h2 className="text-2xl font-semibold text-foreground mb-4">Ready for Bulk Orders?</h2>
              <p className="text-muted-foreground mb-6">
                Contact our bulk sales team for custom quotations, container bookings, and supply agreements.
              </p>
              <Button size="lg" className="mr-4">
                Request Bulk Quote
              </Button>
              <Button variant="outline" size="lg">
                Download Catalog
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Bulk;