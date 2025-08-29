import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Package, Clock, Globe, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Samples = () => {
  const sampleBenefits = [
    {
      icon: Package,
      title: "Free Samples",
      description: "Complimentary product samples for quality evaluation and testing"
    },
    {
      icon: Clock,
      title: "Quick Dispatch",
      description: "Sample orders processed and shipped within 24-48 hours"
    },
    {
      icon: Globe,
      title: "Worldwide Shipping",
      description: "Sample delivery to any location globally via express courier"
    },
    {
      icon: CheckCircle,
      title: "Quality Guarantee",
      description: "Samples represent actual production quality and specifications"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Sample Orders — ShineVeda | Free Agricultural Product Samples</title>
        <meta name="description" content="Order free samples of ShineVeda agricultural products. Quick dispatch, worldwide shipping, quality guaranteed samples for evaluation." />
        <meta name="keywords" content="free samples, product samples, agricultural samples, quality evaluation, express shipping" />
        <link rel="canonical" href={`${window.location.origin}/page/samples`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-foreground mb-6">Sample Orders</h1>
            
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-muted-foreground text-lg">
                Experience ShineVeda quality first-hand with our complimentary sample service. 
                Evaluate our products before placing bulk orders to ensure they meet 
                your exact specifications and quality requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {sampleBenefits.map((benefit, index) => (
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
              className="bg-primary/5 rounded-lg p-8"
            >
              <h2 className="text-2xl font-semibold text-foreground mb-4">How to Order Samples</h2>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Select Products</h3>
                    <p className="text-muted-foreground">Choose up to 3 products for sampling</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Provide Details</h3>
                    <p className="text-muted-foreground">Share your contact and shipping information</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Receive Samples</h3>
                    <p className="text-muted-foreground">Get samples delivered within 3-5 business days</p>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <Button size="lg" className="mr-4">
                  Request Samples
                </Button>
                <Button variant="outline" size="lg">
                  View Products
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Samples;