import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Ship, Plane, Truck, MapPin } from 'lucide-react';

const Shipping = () => {
  const shippingMethods = [
    {
      icon: Ship,
      title: "Sea Freight",
      description: "Cost-effective container shipping for bulk orders worldwide"
    },
    {
      icon: Plane,
      title: "Air Freight",
      description: "Fast delivery for urgent orders and perishable products"
    },
    {
      icon: Truck,
      title: "Land Transport",
      description: "Efficient ground transportation for regional deliveries"
    },
    {
      icon: MapPin,
      title: "Global Network",
      description: "Partnerships with major shipping lines and logistics providers"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Global Shipping — ShineVeda | Worldwide Agricultural Export Shipping</title>
        <meta name="description" content="ShineVeda global shipping services for agricultural exports. Sea freight, air freight, land transport with worldwide delivery network." />
        <meta name="keywords" content="global shipping, sea freight, air freight, agricultural exports, worldwide delivery" />
        <link rel="canonical" href={`${window.location.origin}/page/shipping`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-foreground mb-6">Global Shipping</h1>
            
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-muted-foreground text-lg">
                Reliable global shipping solutions for agricultural commodities. 
                We handle all logistics from farm to destination with proper 
                documentation, insurance, and real-time tracking.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {shippingMethods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card rounded-lg p-6 border border-border"
                >
                  <method.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {method.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {method.description}
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
              <h2 className="text-2xl font-semibold text-foreground mb-4">Shipping Coverage</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Major Markets:</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Middle East & GCC Countries</li>
                    <li>• Southeast Asia</li>
                    <li>• Europe & UK</li>
                    <li>• North America</li>
                    <li>• Africa</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Documentation:</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Export license & permits</li>
                    <li>• Phytosanitary certificates</li>
                    <li>• Origin certificates</li>
                    <li>• Bill of lading</li>
                    <li>• Insurance coverage</li>
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

export default Shipping;