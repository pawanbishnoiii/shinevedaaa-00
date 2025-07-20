import { Phone, Mail, MessageCircle, MapPin, Clock, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ContactSection = () => {
  const handleWhatsApp = () => {
    window.open('https://wa.me/918955158794?text=Hello%20ShineVeda,%20I%20would%20like%20to%20get%20in%20touch%20regarding%20your%20agricultural%20exports.', '_blank');
  };

  const handleEmail = () => {
    window.location.href = 'mailto:help@shineveda.in?subject=Export Inquiry&body=Hello ShineVeda Team,%0D%0A%0D%0AI would like to inquire about your agricultural export services.%0D%0A%0D%0APlease provide me with more information.%0D%0A%0D%0AThank you.';
  };

  const handleCall = () => {
    window.location.href = 'tel:+918955158794';
  };

  return (
    <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
            Get In Touch
          </Badge>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
            Let's Start Your{" "}
            <span className="text-gradient">Export</span>
            <br />
            Journey Today
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ready to source premium agricultural commodities from Rajasthan? 
            Our team is here to help you with quotes, samples, and shipping arrangements.
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* WhatsApp */}
          <Card className="card-premium group hover:scale-105 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                WhatsApp
              </h3>
              <p className="text-muted-foreground mb-4">
                Quick responses and instant communication for urgent inquiries
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="font-semibold text-foreground">+91 89551 58794</div>
                <Badge variant="outline" className="text-xs border-green-500/20 text-green-600">
                  Usually responds within 1 hour
                </Badge>
              </div>

              <Button 
                onClick={handleWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white transition-all duration-300"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat on WhatsApp
              </Button>
            </CardContent>
          </Card>

          {/* Email */}
          <Card className="card-premium group hover:scale-105 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-brand-sage rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Mail className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Email
              </h3>
              <p className="text-muted-foreground mb-4">
                Detailed inquiries and formal communication for business proposals
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="font-semibold text-foreground">help@shineveda.in</div>
                <Badge variant="outline" className="text-xs border-primary/20 text-primary">
                  Response within 24 hours
                </Badge>
              </div>

              <Button 
                onClick={handleEmail}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300"
              >
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </CardContent>
          </Card>

          {/* Phone */}
          <Card className="card-premium group hover:scale-105 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-saffron to-orange-500 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Phone className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Phone Call
              </h3>
              <p className="text-muted-foreground mb-4">
                Direct conversation for complex requirements and bulk orders
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="font-semibold text-foreground">+91 89551 58794</div>
                <Badge variant="outline" className="text-xs border-orange-500/20 text-orange-600">
                  Mon-Sat, 9 AM - 7 PM IST
                </Badge>
              </div>

              <Button 
                onClick={handleCall}
                className="w-full bg-brand-saffron hover:bg-orange-500 text-foreground transition-all duration-300"
              >
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Company Info & Address */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Company Information */}
          <Card className="card-premium">
            <CardContent className="p-8">
              <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                ShineVeda Exports
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground mb-1">Headquarters</div>
                    <div className="text-muted-foreground">
                      Sriganganagar, Rajasthan, India
                      <br />
                      Agricultural Hub of North Rajasthan
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground mb-1">Business Hours</div>
                    <div className="text-muted-foreground">
                      Monday - Saturday: 9:00 AM - 7:00 PM IST
                      <br />
                      Sunday: 10:00 AM - 4:00 PM IST
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground mb-1">24/7 Support</div>
                    <div className="text-muted-foreground">
                      Emergency shipment support available
                      <br />
                      For urgent international orders
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Quote Form */}
          <Card className="card-premium">
            <CardContent className="p-8">
              <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                Quick Quote Request
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <div className="font-semibold text-foreground mb-2">What we need from you:</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Product(s) you're interested in</li>
                    <li>• Quantity requirements</li>
                    <li>• Destination country</li>
                    <li>• Preferred delivery timeline</li>
                  </ul>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="font-semibold text-foreground mb-2">What you'll get:</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Competitive pricing</li>
                    <li>• Detailed product specifications</li>
                    <li>• Shipping cost breakdown</li>
                    <li>• Sample availability information</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={handleWhatsApp}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
                
                <Button 
                  onClick={handleEmail}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
              </div>

              <div className="mt-6 text-center">
                <div className="text-sm text-muted-foreground">
                  Average response time: <span className="font-semibold text-primary">2 hours</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;