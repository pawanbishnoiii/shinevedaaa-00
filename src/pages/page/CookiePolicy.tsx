import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const CookiePolicy = () => {
  return (
    <>
      <Helmet>
        <title>Cookie Policy — ShineVeda | Data Privacy & Cookies</title>
        <meta name="description" content="ShineVeda Cookie Policy - Learn how we use cookies and similar technologies on our website." />
        <meta name="keywords" content="cookie policy, data privacy, tracking cookies, website cookies" />
        <link rel="canonical" href={`${window.location.origin}/page/cookie-policy`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-foreground mb-6">Cookie Policy</h1>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">What Are Cookies</h2>
                <p className="text-muted-foreground">
                  Cookies are small text files that are placed on your computer or mobile device when you 
                  visit a website. They are widely used to make websites work more efficiently and provide 
                  information to website owners.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Cookies</h2>
                <p className="text-muted-foreground mb-4">
                  We use cookies for several purposes:
                </p>
                <ul className="text-muted-foreground space-y-2">
                  <li>• <strong>Essential Cookies:</strong> Required for basic website functionality</li>
                  <li>• <strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
                  <li>• <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                  <li>• <strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Types of Cookies We Use</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Strictly Necessary Cookies</h3>
                    <p className="text-muted-foreground">
                      These cookies are essential for the website to function properly. They enable core 
                      functionality such as security, network management, and accessibility.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Performance Cookies</h3>
                    <p className="text-muted-foreground">
                      These cookies collect anonymous information about how visitors use our website, 
                      helping us improve its performance and user experience.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Functionality Cookies</h3>
                    <p className="text-muted-foreground">
                      These cookies remember your preferences and choices to provide a more personalized 
                      browsing experience.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Advertising Cookies</h3>
                    <p className="text-muted-foreground">
                      We use Google AdSense to display advertisements. These cookies help deliver 
                      relevant ads and measure their effectiveness.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Cookies</h2>
                <p className="text-muted-foreground mb-4">
                  We work with third-party services that may set cookies on your device:
                </p>
                <ul className="text-muted-foreground space-y-2">
                  <li>• <strong>Google Analytics:</strong> For website traffic analysis</li>
                  <li>• <strong>Google AdSense:</strong> For displaying relevant advertisements</li>
                  <li>• <strong>Social Media Platforms:</strong> For social sharing functionality</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Managing Cookies</h2>
                <p className="text-muted-foreground mb-4">
                  You can control and manage cookies in various ways:
                </p>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Browser settings: You can set your browser to refuse cookies</li>
                  <li>• Delete existing cookies from your browser</li>
                  <li>• Opt-out tools provided by advertising networks</li>
                  <li>• Contact us directly to discuss your preferences</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Updates to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Cookie Policy from time to time. Any changes will be posted on 
                  this page with an updated effective date.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about our Cookie Policy, please contact us at 
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

export default CookiePolicy;