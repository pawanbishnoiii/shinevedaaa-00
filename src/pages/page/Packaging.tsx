import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Package2, Shield, Recycle, Truck } from 'lucide-react';

const Packaging = () => {
  const packagingOptions = [
    {
      icon: Package2,
      title: "Export Standard Packaging",
      description: "Multi-layer jute bags, PP bags, and cartons designed for international shipping"
    },
    {
      icon: Shield,
      title: "Moisture Protection",
      description: "Advanced moisture barrier technology to maintain product quality during transit"
    },
    {
      icon: Recycle,
      title: "Eco-Friendly Materials",
      description: "Sustainable packaging materials that meet international environmental standards"
    },
    {
      icon: Truck,
      title: "Custom Branding",
      description: "Private label packaging with your brand specifications and requirements"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Custom Packaging — ShineVeda | Export Standard Agricultural Packaging</title>
        <meta name="description" content="ShineVeda custom packaging solutions for agricultural exports. Export standard, moisture protection, eco-friendly materials, and private labeling." />
        <meta name="keywords" content="custom packaging, export packaging, agricultural packaging, private label, moisture protection" />
        <link rel="canonical" href={`${window.location.origin}/page/packaging`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-foreground mb-6">Custom Packaging</h1>
            
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-muted-foreground text-lg">
                Our custom packaging solutions ensure your agricultural products reach 
                global markets in perfect condition. From standard export packaging 
                to branded private label solutions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {packagingOptions.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card rounded-lg p-6 border border-border"
                >
                  <option.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {option.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {option.description}
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
              <h2 className="text-2xl font-semibold text-foreground mb-4">Packaging Specifications</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Standard Sizes Available:</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• 25 kg, 50 kg jute bags</li>
                    <li>• 5 kg, 10 kg, 20 kg retail packaging</li>
                    <li>• Bulk bags (500 kg - 1000 kg)</li>
                    <li>• Custom sizes on request</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Quality Features:</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Food-grade materials certified</li>
                    <li>• Moisture-resistant inner lining</li>
                    <li>• UV protection for outdoor storage</li>
                    <li>• Easy handling and stacking design</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Packaging;