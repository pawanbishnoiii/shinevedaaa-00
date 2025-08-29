import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service — ShineVeda | Terms & Conditions</title>
        <meta name="description" content="ShineVeda Terms of Service - Terms and conditions for using our website and services." />
        <meta name="keywords" content="terms of service, terms and conditions, legal terms, service agreement" />
        <link rel="canonical" href={`${window.location.origin}/page/terms`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-foreground mb-6">Terms of Service</h1>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Agreement to Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using this website, you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, 
                  please do not use this service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Use License</h2>
                <p className="text-muted-foreground">
                  Permission is granted to temporarily download one copy of the materials on 
                  ShineVeda's website for personal, non-commercial transitory viewing only.
                </p>
                <ul className="text-muted-foreground space-y-2 mt-4">
                  <li>• This is the grant of a license, not a transfer of title</li>
                  <li>• This license shall automatically terminate if you violate any restrictions</li>
                  <li>• Upon termination, you must destroy any downloaded materials</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Product Information</h2>
                <p className="text-muted-foreground">
                  We strive to provide accurate product information, but we do not warrant that 
                  product descriptions or other content is accurate, complete, reliable, current, 
                  or error-free. Products are subject to availability.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Pricing and Orders</h2>
                <p className="text-muted-foreground">
                  All prices are subject to change without notice. We reserve the right to refuse 
                  or cancel orders at our discretion. Order acceptance is subject to product 
                  availability and credit approval.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  In no event shall ShineVeda or its suppliers be liable for any damages arising 
                  out of the use or inability to use the materials on this website, even if 
                  ShineVeda or an authorized representative has been notified of the possibility 
                  of such damage.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Governing Law</h2>
                <p className="text-muted-foreground">
                  These terms and conditions are governed by and construed in accordance with 
                  the laws of India, and you irrevocably submit to the exclusive jurisdiction 
                  of the courts in that state or location.
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

export default Terms;