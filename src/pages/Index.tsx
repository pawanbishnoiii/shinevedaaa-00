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
      {/* Auth Navigation */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        {user ? (
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  Admin Panel
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        ) : (
          <Link to="/auth">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Login
            </Button>
          </Link>
        )}
      </div>

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
