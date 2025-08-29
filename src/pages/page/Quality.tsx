import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Shield, Award, CheckCircle, FileCheck } from 'lucide-react';

const Quality = () => {
  const qualityStandards = [
    {
      icon: Shield,
      title: "ISO 22000:2018",
      description: "Food Safety Management System certification ensuring highest quality standards"
    },
    {
      icon: Award,
      title: "HACCP Certified",
      description: "Hazard Analysis Critical Control Points system for food safety"
    },
    {
      icon: CheckCircle,
      title: "FSSAI Licensed",
      description: "Food Safety and Standards Authority of India licensing"
    },
    {
      icon: FileCheck,
      title: "Export License",
      description: "Government approved export licensing for international trade"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Quality Assurance — ShineVeda | ISO 22000:2018, HACCP Certified</title>
        <meta name="description" content="ShineVeda's quality assurance process includes ISO 22000:2018, HACCP certification, FSSAI licensing, and rigorous quality control for agricultural exports." />
        <meta name="keywords" content="ISO 22000, HACCP, FSSAI, quality assurance, food safety, export quality, agricultural standards" />
        <link rel="canonical" href={`${window.location.origin}/page/quality`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-foreground mb-6">Quality Assurance</h1>
            
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-muted-foreground text-lg">
                At ShineVeda, quality is not just a promise—it's our commitment to excellence. 
                Every product undergoes rigorous quality control processes to ensure we deliver 
                only the finest agricultural commodities to our global partners.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {qualityStandards.map((standard, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card rounded-lg p-6 border border-border"
                >
                  <standard.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {standard.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {standard.description}
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
              <h2 className="text-2xl font-semibold text-foreground mb-4">Our Quality Process</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground">Source Verification</h3>
                    <p className="text-muted-foreground">Direct sourcing from verified farmers with quality assurance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground">Processing Standards</h3>
                    <p className="text-muted-foreground">State-of-the-art processing facilities with automated quality control</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground">Testing & Certification</h3>
                    <p className="text-muted-foreground">Comprehensive testing for pesticides, moisture, and quality parameters</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground">Packaging & Shipping</h3>
                    <p className="text-muted-foreground">Export-grade packaging with proper documentation and tracking</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Quality;