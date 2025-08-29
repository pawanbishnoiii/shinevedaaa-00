import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Globe, FileText, Shield, Truck } from 'lucide-react';

const ExportPolicy = () => {
  const policies = [
    {
      icon: Globe,
      title: "International Compliance",
      description: "Full compliance with international export regulations and import requirements"
    },
    {
      icon: FileText,
      title: "Documentation Standards",
      description: "Complete export documentation including certificates and permits"
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Rigorous quality control to meet destination country standards"
    },
    {
      icon: Truck,
      title: "Logistics Partnership",
      description: "Reliable shipping partners for safe and timely delivery worldwide"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Export Policy — ShineVeda | International Export Guidelines</title>
        <meta name="description" content="ShineVeda export policy for international agricultural commodity trading. Compliance, documentation, quality standards, and logistics." />
        <meta name="keywords" content="export policy, international trade, export compliance, documentation standards" />
        <link rel="canonical" href={`${window.location.origin}/page/export-policy`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-foreground mb-6">Export Policy</h1>
            
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-muted-foreground text-lg">
                ShineVeda is committed to maintaining the highest standards in international 
                trade. Our export policy ensures compliance with all regulations while 
                delivering quality agricultural products to global markets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {policies.map((policy, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card rounded-lg p-6 border border-border"
                >
                  <policy.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {policy.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {policy.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-8"
            >
              <div className="bg-primary/5 rounded-lg p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Export Requirements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Required Documents:</h3>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Export license</li>
                      <li>• Phytosanitary certificate</li>
                      <li>• Certificate of origin</li>
                      <li>• Quality analysis report</li>
                      <li>• Commercial invoice</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Quality Standards:</h3>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• ISO 22000:2018 compliance</li>
                      <li>• HACCP certification</li>
                      <li>• Pesticide residue testing</li>
                      <li>• Moisture content analysis</li>
                      <li>• Foreign matter inspection</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/5 rounded-lg p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Terms & Conditions</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    <strong>Delivery Terms:</strong> All exports are made on FOB (Free on Board) basis 
                    unless otherwise agreed. Risk transfers to buyer once goods are loaded on vessel.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Payment Terms:</strong> Letter of Credit (LC) at sight or advance payment 
                    as mutually agreed. All banking charges outside India to be borne by buyer.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Force Majeure:</strong> ShineVeda shall not be liable for delays or failures 
                    due to circumstances beyond reasonable control including natural disasters, 
                    government actions, or shipping delays.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ExportPolicy;