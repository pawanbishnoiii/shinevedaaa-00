import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import QualitySection from "@/components/QualitySection";
import WhyShineVedaSection from "@/components/WhyShineVedaSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import StickyContact from "@/components/StickyContact";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Products Showcase */}
      <ProductsSection />
      
      {/* Quality Assurance Process */}
      <QualitySection />
      
      {/* Why Choose ShineVeda */}
      <WhyShineVedaSection />
      
      {/* Contact & Inquiry */}
      <ContactSection />
      
      {/* Footer */}
      <Footer />
      
      {/* Sticky Contact Widget */}
      <StickyContact />
      
      {/* Mobile Bottom Padding for Sticky Contact */}
      <div className="lg:hidden h-20" />
    </div>
  );
};

export default Index;
