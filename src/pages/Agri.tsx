import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import AgriHero from '@/components/AgriHero';
import DynamicFarmerStories from '@/components/DynamicFarmerStories';
import DynamicCropExcellence from '@/components/DynamicCropExcellence';
import FarmerSupport from '@/components/FarmerSupport';
import ImpactCounters from '@/components/ImpactCounters';
import DynamicAgriImageGallery from '@/components/DynamicAgriImageGallery';
import AgriBlog from '@/components/AgriBlog';
import AgriFAQ from '@/components/AgriFAQ';
import AgriCTA from '@/components/AgriCTA';
import SubmitStoryForm from '@/components/SubmitStoryForm';

const Agri: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "WebPage",
    "name": "Agri — ShineVeda",
    "description": "Rajasthan & Punjab farmers ke saath — seed se global market tak. Direct sourcing, fair pricing, and technical support for small landholders.",
    "url": `${window.location.origin}/agri`,
    "publisher": {
      "@type": "Organization",
      "name": "ShineVeda",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/logo.png`
      }
    },
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does ShineVeda support farmers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We provide contract pricing guidance, grading & packaging training, land leasing best practices, micro-loan referrals, and post-harvest handling support."
          }
        }
      ]
    }
  };

  return (
    <>
      <Helmet>
        <title>Agri — ShineVeda | Rajasthan & Punjab Farmers, Exports (Onion, Jeera, Guar Gum)</title>
        <meta name="description" content="Agri page of ShineVeda.in — Directly sourcing from Rajasthan and Punjab farmers. Learn about our farmer support, export-ready crops (onion, jeera, guar gum), grading & packaging, and read farmer success stories." />
        <meta name="keywords" content="Rajasthan onion export, Sikar jeera export, guar gum supplier India, ShineVeda farmers, farmers support Rajasthan, Punjab agriculture, direct sourcing farmers" />
        <link rel="canonical" href={`${window.location.origin}/agri`} />
        
        <meta property="og:title" content="Agri — ShineVeda | Rajasthan & Punjab Farmers Partnership" />
        <meta property="og:description" content="Directly sourcing from Rajasthan and Punjab farmers. Premium export crops with farmer support programs." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/agri`} />
        <meta property="og:image" content={`${window.location.origin}/data/img/rajasthan-farmer-family.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Rajasthan farmer family in field — ShineVeda support" />
        
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <AgriHero />

        {/* Farmer Stories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <DynamicFarmerStories />
          </div>
        </section>

        {/* Farmer Support */}
        <section className="py-16 bg-gradient-to-br from-green-50 to-amber-50 dark:from-green-950/20 dark:to-amber-950/20">
          <div className="container mx-auto px-4">
            <FarmerSupport />
          </div>
        </section>

        {/* Crop Excellence */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <DynamicCropExcellence />
          </div>
        </section>

        {/* Impact Counters */}
        <section className="py-16 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
          <div className="container mx-auto px-4">
            <ImpactCounters />
          </div>
        </section>

        {/* Image Gallery */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <DynamicAgriImageGallery />
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <AgriBlog />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <AgriFAQ />
          </div>
        </section>

        {/* Submit Story Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <SubmitStoryForm />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-primary via-primary/90 to-secondary">
          <div className="container mx-auto px-4">
            <AgriCTA />
          </div>
        </section>
      </div>
    </>
  );
};

export default Agri;