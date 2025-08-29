import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Leaf, Globe, Users, Award } from 'lucide-react';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us — ShineVeda | Leading Agricultural Exporters</title>
        <meta name="description" content="Learn about ShineVeda - India's leading agricultural commodity exporter. Our mission, values, and commitment to quality farming and global trade." />
        <meta name="keywords" content="about shineveda, agricultural exporters india, company profile, farm to fork, sustainable agriculture" />
        <link rel="canonical" href={`${window.location.origin}/about`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-foreground mb-6">About ShineVeda</h1>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Our Story</h2>
                <p className="text-muted-foreground">
                  ShineVeda is a leading agricultural commodity exporter from India, specializing in premium 
                  quality onions, jeera (cumin), peanuts, carrots, chickpeas, mustard, and guar gum. Based in 
                  Sri Ganganagar, Rajasthan, we work directly with farmers to bring the finest Indian agricultural 
                  products to global markets.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                <div className="bg-card p-6 rounded-lg border">
                  <Globe className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
                  <p className="text-muted-foreground">
                    Exporting to Singapore, UK, USA, Dubai, Australia, Qatar, Japan, and China with 
                    international quality standards.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <Users className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Farmer Partnership</h3>
                  <p className="text-muted-foreground">
                    Direct partnerships with over 500+ farmers across Rajasthan and Punjab, 
                    ensuring fair pricing and quality produce.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <Award className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Quality Assurance</h3>
                  <p className="text-muted-foreground">
                    Rigorous quality control processes with international certifications 
                    and food safety standards compliance.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <Leaf className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Sustainable Farming</h3>
                  <p className="text-muted-foreground">
                    Promoting sustainable agricultural practices and supporting 
                    eco-friendly farming methods.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
                <p className="text-muted-foreground">
                  To bridge the gap between Indian farmers and global markets by providing premium 
                  quality agricultural commodities while ensuring fair trade practices and sustainable 
                  farming methods. We are committed to maintaining the highest standards of quality 
                  and delivering exceptional value to our international partners.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Our Values</h2>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Quality Excellence: Uncompromising commitment to product quality</li>
                  <li>• Fair Trade: Ensuring equitable benefits for farmers and partners</li>
                  <li>• Sustainability: Promoting environmentally responsible practices</li>
                  <li>• Innovation: Embracing technology and modern farming techniques</li>
                  <li>• Transparency: Open and honest business relationships</li>
                  <li>• Customer Focus: Delivering exceptional service and value</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
                <div className="bg-muted/50 rounded-lg p-6">
                  <p className="text-muted-foreground mb-2">
                    <strong>Email:</strong> help@shineveda.in
                  </p>
                  <p className="text-muted-foreground mb-2">
                    <strong>Phone:</strong> +91 89551 58794
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Location:</strong> Sri Ganganagar, Rajasthan, India
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default About;