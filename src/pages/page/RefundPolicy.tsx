import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const RefundPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Refund Policy — ShineVeda | Returns & Refunds</title>
        <meta name="description" content="ShineVeda Refund Policy - Learn about our return and refund procedures for agricultural commodity orders." />
        <meta name="keywords" content="refund policy, return policy, order cancellation, agricultural commodities" />
        <link rel="canonical" href={`${window.location.origin}/page/refund-policy`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-foreground mb-6">Refund Policy</h1>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Overview</h2>
                <p className="text-muted-foreground">
                  ShineVeda is committed to providing high-quality agricultural commodities. Due to the 
                  nature of agricultural products and international trade, our refund policy is designed 
                  to protect both buyers and sellers while ensuring fair business practices.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Order Cancellation</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Before Shipment</h3>
                    <p className="text-muted-foreground">
                      Orders can be cancelled without penalty if requested at least 48 hours before 
                      the scheduled shipment date. Full refund will be processed within 7-10 business days.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">After Production Start</h3>
                    <p className="text-muted-foreground">
                      Once production or packaging has begun, cancellation may incur charges up to 25% 
                      of the order value to cover processing and preparation costs.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Quality Issues</h2>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Claims must be reported within 48 hours of delivery</li>
                  <li>• Photographic evidence of quality issues required</li>
                  <li>• Third-party quality inspection may be arranged</li>
                  <li>• Replacement or partial refund based on assessment</li>
                  <li>• Perishable products have stricter claim timelines</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Shipping and Delivery</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Delayed Shipments</h3>
                    <p className="text-muted-foreground">
                      If shipment is delayed beyond agreed timelines due to our fault, buyers may 
                      request order cancellation with full refund or negotiate new delivery terms.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Damaged in Transit</h3>
                    <p className="text-muted-foreground">
                      Insurance claims for goods damaged during shipping will be processed according 
                      to carrier terms. We assist in filing claims and documentation.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Non-Refundable Items</h2>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Custom packaging or processing specifications</li>
                  <li>• Orders shipped and accepted without immediate quality claims</li>
                  <li>• Products damaged due to improper storage by buyer</li>
                  <li>• Orders cancelled after shipment has commenced</li>
                  <li>• Seasonal products near expiry of harvest season</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Refund Process</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Processing Time</h3>
                    <p className="text-muted-foreground">
                      Approved refunds are processed within 7-15 business days. International 
                      bank transfers may take additional time depending on banking systems.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Refund Method</h3>
                    <p className="text-muted-foreground">
                      Refunds are issued to the original payment method. Wire transfer fees may 
                      be deducted from refund amount for international transactions.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Dispute Resolution</h2>
                <p className="text-muted-foreground">
                  In case of disputes, we encourage direct communication to resolve issues amicably. 
                  If needed, disputes may be resolved through arbitration as per Indian commercial 
                  law or international trade regulations.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Contact for Refunds</h2>
                <div className="bg-muted/50 rounded-lg p-6">
                  <p className="text-muted-foreground mb-2">
                    For refund requests or questions, contact us immediately:
                  </p>
                  <p className="text-muted-foreground mb-2">
                    <strong>Email:</strong> help@shineveda.in
                  </p>
                  <p className="text-muted-foreground mb-2">
                    <strong>Phone:</strong> +91 89551 58794
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Business Hours:</strong> Monday to Saturday, 9:00 AM - 6:00 PM IST
                  </p>
                </div>
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

export default RefundPolicy;