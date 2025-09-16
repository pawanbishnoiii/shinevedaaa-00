import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import WhyShineVedaSection from "@/components/WhyShineVedaSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import StickyContact from "@/components/StickyContact";
import { SocialTooltip } from "@/components/ui/social-media";
import { EmailSubscription } from "@/components/EmailSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";

const Index = () => {
  const { user, isAdmin, signOut } = useAuth();

  const socialLinks = [
    {
      href: "https://www.facebook.com/shineveda",
      ariaLabel: "Facebook",
      tooltip: "Follow us on Facebook",
      color: "#1877f2",
      svgUrl: "https://svgl.app/library/facebook.svg",
    },
    {
      href: "https://twitter.com/shineveda",
      ariaLabel: "Twitter",
      tooltip: "Follow us on Twitter",
      color: "#1da1f2",
      svgUrl: "https://svgl.app/library/twitter.svg",
    },
    {
      href: "https://www.linkedin.com/company/shineveda",
      ariaLabel: "LinkedIn",
      tooltip: "Connect on LinkedIn",
      color: "#0077b5",
      svgUrl: "https://svgl.app/library/linkedin.svg",
    },
    {
      href: "https://www.instagram.com/shineveda",
      ariaLabel: "Instagram",
      tooltip: "Follow us on Instagram",
      color: "#e4405f",
      svgUrl: "https://svgl.app/library/instagram.svg",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* Hero Section */}
      <HeroSection />
      
      {/* Products Showcase */}
      <ProductsSection />
      
      {/* Why Choose ShineVeda */}
      <WhyShineVedaSection />
      
      {/* B2B Call-to-Action Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Partner with <span className="text-primary">ShineVeda</span> for Premium Agricultural Exports
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join global buyers who trust us for consistent quality, competitive pricing, and reliable international shipping from India's agricultural heartland.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/products">Browse Our Catalog</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Request Bulk Quote</Link>
              </Button>
            </div>
            
            {/* Newsletter Signup */}
            <div className="max-w-2xl mx-auto border-t border-border pt-8">
              <h3 className="text-xl font-semibold mb-4">Stay Updated on Market Trends</h3>
              <p className="text-muted-foreground mb-6">
                Get insights on pricing, harvest forecasts, and export opportunities.
              </p>
              <EmailSubscription 
                className="max-w-md mx-auto"
                placeholder="Enter your business email"
                buttonText="Subscribe"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact & Inquiry */}
      <ContactSection />
      
      {/* Social Media */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-8">Connect With Us</h3>
          <SocialTooltip items={socialLinks} />
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
