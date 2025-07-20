import { useState } from "react";
import { MessageCircle, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const StickyContact = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleWhatsApp = () => {
    window.open('https://wa.me/918955158794?text=Hello%20ShineVeda,%20I%20would%20like%20to%20get%20in%20touch%20regarding%20your%20agricultural%20exports.', '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+918955158794';
  };

  const handleEmail = () => {
    window.location.href = 'mailto:help@shineveda.in?subject=Export Inquiry';
  };

  return (
    <>
      {/* Desktop Floating Contact */}
      <div className="hidden lg:block fixed bottom-6 right-6 z-50">
        {isExpanded ? (
          <Card className="card-premium animate-slide-up">
            <CardContent className="p-6 w-80">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Quick Contact</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleWhatsApp}
                  className="w-full bg-green-500 hover:bg-green-600 text-white justify-start"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp: +91 89551 58794
                </Button>
                
                <Button 
                  onClick={handleCall}
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground justify-start"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call: +91 89551 58794
                </Button>
                
                <Button 
                  onClick={handleEmail}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  help@shineveda.in
                </Button>
              </div>
              
              <div className="mt-4 text-xs text-muted-foreground text-center">
                Available Mon-Sat, 9 AM - 7 PM IST
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button
            onClick={() => setIsExpanded(true)}
            className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border p-4">
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={handleWhatsApp}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            WhatsApp
          </Button>
          
          <Button 
            onClick={handleCall}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Phone className="mr-2 h-4 w-4" />
            Call
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground text-center mt-2">
          Quick response guaranteed • Available 9 AM - 7 PM IST
        </div>
      </div>
    </>
  );
};

export default StickyContact;