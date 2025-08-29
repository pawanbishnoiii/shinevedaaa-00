import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy — ShineVeda | Data Protection & Privacy</title>
        <meta name="description" content="ShineVeda Privacy Policy - Learn how we collect, use, and protect your personal information and data." />
        <meta name="keywords" content="privacy policy, data protection, personal information, GDPR compliance" />
        <link rel="canonical" href={`${window.location.origin}/page/privacy`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-foreground mb-6">Privacy Policy</h1>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
                <p className="text-muted-foreground">
                  We collect information you provide directly to us, such as when you create an account, 
                  make an inquiry, or contact us. This may include your name, email address, phone number, 
                  company information, and any other information you choose to provide.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
                <ul className="text-muted-foreground space-y-2">
                  <li>• To provide and maintain our services</li>
                  <li>• To process your inquiries and respond to your requests</li>
                  <li>• To send you updates about our products and services</li>
                  <li>• To comply with legal obligations</li>
                  <li>• To protect our rights and prevent fraud</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Information Sharing</h2>
                <p className="text-muted-foreground">
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  without your consent, except as described in this policy. We may share information with 
                  trusted partners who assist us in operating our website and conducting our business.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>
                <p className="text-muted-foreground">
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. However, no method of 
                  transmission over the internet is 100% secure.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
                <p className="text-muted-foreground">
                  You have the right to access, update, or delete your personal information. 
                  You may also opt out of receiving marketing communications from us at any time.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy, please contact us at 
                  help@shineveda.in or +91 89551 58794.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-6">
                <p className="text-sm text-muted-foreground">
                  <strong>Last updated:</strong> {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Privacy;