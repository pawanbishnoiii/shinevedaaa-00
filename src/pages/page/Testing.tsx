import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Microscope, FileText, Shield, Award } from 'lucide-react';

const Testing = () => {
  const testingServices = [
    {
      icon: Microscope,
      title: "Laboratory Testing",
      description: "Comprehensive analysis for pesticide residues, mycotoxins, and contaminants"
    },
    {
      icon: FileText,
      title: "Quality Certificates",
      description: "Detailed quality reports and certificates for every batch"
    },
    {
      icon: Shield,
      title: "Safety Standards",
      description: "Testing according to international food safety standards"
    },
    {
      icon: Award,
      title: "Third-Party Verification",
      description: "Independent testing and verification by accredited laboratories"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Quality Testing — ShineVeda | Agricultural Product Testing & Certification</title>
        <meta name="description" content="ShineVeda quality testing services for agricultural exports. Laboratory testing, quality certificates, safety standards, third-party verification." />
        <meta name="keywords" content="quality testing, laboratory testing, quality certificates, food safety, pesticide testing" />
        <link rel="canonical" href={`${window.location.origin}/page/testing`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-foreground mb-6">Quality Testing</h1>
            
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-muted-foreground text-lg">
                Rigorous quality testing ensures every product meets international 
                standards. Our comprehensive testing protocols guarantee product 
                safety, quality, and compliance with global regulations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {testingServices.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card rounded-lg p-6 border border-border"
                >
                  <service.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {service.description}
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
              <h2 className="text-2xl font-semibold text-foreground mb-4">Testing Parameters</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Physical Tests:</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Moisture content analysis</li>
                    <li>• Size and grade classification</li>
                    <li>• Color and appearance</li>
                    <li>• Foreign matter detection</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Chemical Tests:</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Pesticide residue analysis</li>
                    <li>• Heavy metals testing</li>
                    <li>• Mycotoxin detection</li>
                    <li>• Nutritional content analysis</li>
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

export default Testing;