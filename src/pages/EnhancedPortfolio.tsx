import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import EnhancedHeroSection from '@/components/EnhancedHeroSection';
import VideoGallery from '@/components/VideoGallery';
import InteractiveCropCalendar from '@/components/InteractiveCropCalendar';
import AnimatedStatistics from '@/components/AnimatedStatistics';
import DownloadableResource from '@/components/DownloadableResource';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

const EnhancedPortfolio: React.FC = () => {
  const { data: heroVideos } = useQuery({
    queryKey: ['hero-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_videos')
        .select('*')
        .eq('category', 'hero')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  const { data: testimonialVideos } = useQuery({
    queryKey: ['testimonial-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_videos')
        .select('*')
        .eq('category', 'testimonial')
        .eq('is_active', true)
        .limit(6);

      if (error) throw error;
      return data;
    }
  });

  return (
    <>
      <Helmet>
        <title>Agricultural Excellence Portfolio | ShineVeda - Premium Export from Rajasthan</title>
        <meta name="description" content="Discover ShineVeda's comprehensive agricultural portfolio showcasing premium products from Rajasthan. Interactive crop calendar, farmer stories, certifications, and global export capabilities." />
        <meta name="keywords" content="agricultural portfolio, Rajasthan agriculture, crop calendar, farmer stories, export agriculture, organic farming, sustainable agriculture, quality certifications, global food trade" />
        
        <meta property="og:title" content="Agricultural Excellence Portfolio | ShineVeda" />
        <meta property="og:description" content="Explore our comprehensive agricultural portfolio with interactive features, crop calendar, and success stories from Rajasthan's finest farms." />
        <meta property="og:type" content="website" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Organization",
            "name": "ShineVeda",
            "description": "Premium agricultural products export from Rajasthan, India",
            "url": window.location.href,
            "logo": "/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-8955158794",
              "contactType": "Business"
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Sri Ganganagar",
              "addressRegion": "Rajasthan",
              "addressCountry": "IN"
            },
            "sameAs": [
              "https://www.linkedin.com/company/shineveda",
              "https://www.instagram.com/shineveda"
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen">
        {/* Enhanced Hero Section */}
        <EnhancedHeroSection
          videos={heroVideos || []}
          title="Premium Agricultural Excellence"
          subtitle="From the fertile lands of Rajasthan to global markets"
          ctaText="Explore Our Products"
          onCtaClick={() => {
            document.getElementById('products-section')?.scrollIntoView({ 
              behavior: 'smooth' 
            });
          }}
        />

        {/* Animated Statistics */}
        <AnimatedStatistics />

        <Separator className="my-16" />

        {/* Interactive Crop Calendar */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <InteractiveCropCalendar />
            </motion.div>
          </div>
        </section>

        <Separator className="my-16" />

        {/* Success Stories / Testimonials */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Success Stories & Testimonials
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Hear from our partners and customers about their experience with ShineVeda's premium agricultural products.
              </p>
            </motion.div>

            <VideoGallery category="testimonial" limit={6} />
          </div>
        </section>

        <Separator className="my-16" />

        {/* Farming Techniques Hub */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Modern Farming Techniques
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Discover the innovative agricultural practices and techniques we employ to ensure the highest quality products.
              </p>
            </motion.div>

            <VideoGallery category="tutorial" />
          </div>
        </section>

        <Separator className="my-16" />

        {/* Quality Certifications & Resources */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Quality Certifications & Resources
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Download our quality certificates, product catalogs, and company resources.
              </p>
            </motion.div>

            <DownloadableResource />
          </div>
        </section>

        <Separator className="my-16" />

        {/* Agricultural Innovation Showcase */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Agricultural Innovation Center
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Explore our latest innovations in sustainable farming and agricultural technology.
              </p>
            </motion.div>

            <VideoGallery category="showcase" />
          </div>
        </section>
      </div>
    </>
  );
};

export default EnhancedPortfolio;