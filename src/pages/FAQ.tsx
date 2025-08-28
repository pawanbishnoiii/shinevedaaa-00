import React from 'react';
import { Helmet } from 'react-helmet-async';
import FAQ from '@/components/FAQ';

const FAQPage = () => {
  return (
    <>
      <Helmet>
        <title>FAQ - ShineVeda Exports | Agricultural Commodities Export Questions</title>
        <meta 
          name="description" 
          content="Frequently asked questions about ShineVeda Exports agricultural commodities export services. Learn about quality standards, shipping, payment terms, and international trade from Sri Ganganagar, Rajasthan." 
        />
        <meta name="keywords" content="export FAQ, agricultural commodities questions, onions export query, jeera export info, peanuts export help, international shipping FAQ, sri ganganagar exports, rajasthan agricultural exports" />
        <link rel="canonical" href="https://yourdomain.com/faq" />
        
        {/* Open Graph */}
        <meta property="og:title" content="FAQ - ShineVeda Exports | Agricultural Export Questions" />
        <meta property="og:description" content="Get answers to common questions about our premium agricultural export services from Sri Ganganagar, Rajasthan." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/faq" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="FAQ - ShineVeda Exports" />
        <meta name="twitter:description" content="Get answers to common questions about our premium agricultural export services." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What agricultural commodities do you export?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We specialize in exporting premium quality Onions, Jeera (Cumin), Peanuts, Carrots, Chickpeas, Mustard seeds, and Guar Gum from Sri Ganganagar, Rajasthan."
                }
              },
              {
                "@type": "Question", 
                "name": "Which countries do you export to?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We export to India, Singapore, UK, USA, Dubai (UAE), Australia, Qatar, Japan, China, and many other international markets."
                }
              },
              {
                "@type": "Question",
                "name": "What is your minimum order quantity?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Minimum order quantities vary by product. Typically, we require orders of 20-25 tons for most commodities."
                }
              }
            ]
          })}
        </script>
      </Helmet>
      
      <main>
        <FAQ />
      </main>
    </>
  );
};

export default FAQPage;