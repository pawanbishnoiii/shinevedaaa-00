import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmailSubscription } from "@/components/EmailSubscription";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    products: [
      { name: "Premium Onions", href: "/products" },
      { name: "Cumin Seeds (Jeera)", href: "/products" },
      { name: "Raw Peanuts", href: "/products" },
      { name: "Fresh Carrots", href: "/products" },
      { name: "Chickpeas (Chana)", href: "/products" },
      { name: "Mustard Seeds", href: "/products" },
      { name: "Guar Gum", href: "/products" }
    ],
    company: [
      { name: "About ShineVeda", href: "/about" },
      { name: "Quality Assurance", href: "/page/quality" },
      { name: "Our Process", href: "/about#process" },
      { name: "Certifications", href: "/about#certifications" },
      { name: "Export License", href: "/about#license" }
    ],
    services: [
      { name: "Bulk Orders", href: "/page/bulk" },
      { name: "Custom Packaging", href: "/page/packaging" },
      { name: "Global Shipping", href: "/page/shipping" },
      { name: "Quality Testing", href: "/page/testing" },
      { name: "Sample Orders", href: "/page/samples" }
    ],
    support: [
      { name: "Contact Us", href: "/contact" },
      { name: "Request Quote", href: "/contact#quote" },
      { name: "WhatsApp Support", href: "https://wa.me/918955158794" },
      { name: "Track Shipment", href: "/contact#track" },
      { name: "Export Documentation", href: "/contact#docs" }
    ]
  };

  const handleQuickContact = () => {
    window.open('https://wa.me/918955158794?text=Hello%20ShineVeda,%20I%20have%20a%20quick%20question%20about%20your%20services.', '_blank');
  };

  return (
    <footer className="bg-gradient-to-b from-background to-primary/10 border-t border-border">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                ShineVeda Exports
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Premium agricultural commodities from the fertile lands of India. 
                Trusted by global partners for quality, consistency, and reliable international shipping.
              </p>
            </div>

            {/* Quick Contact */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <a href="tel:+918955158794" className="text-foreground hover:text-primary transition-colors">
                  +91 89551 58794
                </a>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <a href="mailto:help@shineveda.in" className="text-foreground hover:text-primary transition-colors">
                  help@shineveda.in
                </a>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div className="text-foreground">
                  Rajasthan, India
                </div>
              </div>
            </div>

            <Button 
              onClick={handleQuickContact}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Quick WhatsApp
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Products Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Products</h4>
            <ul className="space-y-2">
              {footerLinks.products.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">About ShineVeda</a>
              </li>
              <li>
                <a href="/agri" className="text-muted-foreground hover:text-primary transition-colors text-sm">Agri Portfolio</a>
              </li>
              <li>
                <a href="/page/quality" className="text-muted-foreground hover:text-primary transition-colors text-sm">Quality Assurance</a>
              </li>
              <li>
                <a href="/about#process" className="text-muted-foreground hover:text-primary transition-colors text-sm">Our Process</a>
              </li>
              <li>
                <a href="/about#certifications" className="text-muted-foreground hover:text-primary transition-colors text-sm">Certifications</a>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <a href="/page/bulk" className="text-muted-foreground hover:text-primary transition-colors text-sm">Bulk Orders</a>
              </li>
              <li>
                <a href="/page/packaging" className="text-muted-foreground hover:text-primary transition-colors text-sm">Custom Packaging</a>
              </li>
              <li>
                <a href="/page/shipping" className="text-muted-foreground hover:text-primary transition-colors text-sm">Global Shipping</a>
              </li>
              <li>
                <a href="/page/testing" className="text-muted-foreground hover:text-primary transition-colors text-sm">Quality Testing</a>
              </li>
              <li>
                <a href="/page/samples" className="text-muted-foreground hover:text-primary transition-colors text-sm">Sample Orders</a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact Us</a>
              </li>
              <li>
                <a href="/faq" className="text-muted-foreground hover:text-primary transition-colors text-sm">FAQ</a>
              </li>
              <li>
                <a href="https://wa.me/918955158794" className="text-muted-foreground hover:text-primary transition-colors text-sm" target="_blank" rel="noopener noreferrer">WhatsApp Support</a>
              </li>
              <li>
                <a href="/contact#quote" className="text-muted-foreground hover:text-primary transition-colors text-sm">Request Quote</a>
              </li>
              <li>
                <a href="/contact#docs" className="text-muted-foreground hover:text-primary transition-colors text-sm">Export Documentation</a>
              </li>
            </ul>
          </div>

            {/* Newsletter Subscription */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get market insights and product updates.
            </p>
            <EmailSubscription 
              className=""
              placeholder="Your email"
              buttonText="Subscribe"
              showIcon={false}
            />
          </div>
        </div>

        {/* Certifications Bar */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="text-center mb-6">
            <h4 className="font-semibold text-foreground mb-4">Certified & Compliant</h4>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="px-3 py-1 bg-secondary rounded-full">ISO 22000:2018</span>
              <span className="px-3 py-1 bg-secondary rounded-full">HACCP Certified</span>
              <span className="px-3 py-1 bg-secondary rounded-full">FSSAI Licensed</span>
              <span className="px-3 py-1 bg-secondary rounded-full">Export License</span>
              <span className="px-3 py-1 bg-secondary rounded-full">Phytosanitary Certificate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © {currentYear} ShineVeda Exports. All rights reserved.
            </div>
            
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="/page/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="/page/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="/page/export-policy" className="hover:text-primary transition-colors">
                Export Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;