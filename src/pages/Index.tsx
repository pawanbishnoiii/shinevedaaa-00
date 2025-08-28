import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import QualitySection from "@/components/QualitySection";
import WhyShineVedaSection from "@/components/WhyShineVedaSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import StickyContact from "@/components/StickyContact";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";

const Index = () => {
  const { user, isAdmin, signOut } = useAuth();

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
    </div>
  );
};

export default Index;
