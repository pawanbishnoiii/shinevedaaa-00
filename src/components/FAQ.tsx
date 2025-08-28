import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageCircle } from 'lucide-react';

const FAQ = () => {
  const faqData = [
    {
      question: "What agricultural commodities do you export?",
      answer: "We specialize in exporting premium quality Onions, Jeera (Cumin), Peanuts, Carrots, Chickpeas, Mustard seeds, and Guar Gum from Sri Ganganagar, Rajasthan. All our products meet international quality standards."
    },
    {
      question: "Which countries do you export to?",
      answer: "We export to multiple international markets including India, Singapore, UK, USA, Dubai (UAE), Australia, Qatar, Japan, China, and many other countries. Our global network ensures reliable delivery worldwide."
    },
    {
      question: "What is your minimum order quantity?",
      answer: "Minimum order quantities vary by product. Typically, we require orders of 20-25 tons for most commodities. However, we can accommodate smaller orders for specific markets and build long-term partnerships."
    },
    {
      question: "How do you ensure product quality?",
      answer: "We maintain strict quality control measures from farm to export. Our products undergo rigorous testing, proper cleaning, grading, and packaging. We provide quality certificates and comply with international food safety standards."
    },
    {
      question: "What packaging options are available?",
      answer: "We offer various packaging options including jute bags, PP bags, mesh bags, and custom packaging as per buyer requirements. All packaging is export-quality and designed to maintain product freshness during transit."
    },
    {
      question: "How can I get a price quote?",
      answer: "You can request a quote through our website contact form, WhatsApp (+91 89551 58794), or email. Please specify the product, quantity, destination, and any special requirements for accurate pricing."
    },
    {
      question: "What are your payment terms?",
      answer: "We offer flexible payment terms including Letter of Credit (L/C), Telegraphic Transfer (T/T), and other mutually agreed payment methods. Terms vary based on the buyer's profile and order volume."
    },
    {
      question: "How long does shipping take?",
      answer: "Shipping times depend on the destination and shipping method. Typically, sea freight takes 15-30 days, while air freight takes 3-7 days. We provide complete documentation and tracking information."
    },
    {
      question: "Do you provide samples?",
      answer: "Yes, we provide samples for quality evaluation. Sample costs and shipping charges are typically borne by the buyer, but may be adjusted against future orders based on mutual agreement."
    },
    {
      question: "Are you certified for organic products?",
      answer: "We can source certified organic products upon request. Our network includes farmers with organic certifications, and we can arrange for organic certification documents as required by international standards."
    }
  ];

  const handleWhatsApp = () => {
    const message = "Hello ShineVeda, I have a question about your export services. Please assist me.";
    window.open(`https://wa.me/918955158794?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
            Support Center
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Frequently Asked{" "}
            <span className="text-gradient">Questions</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about our agricultural export services, 
            quality standards, and international shipping processes.
          </p>
        </div>

        {/* FAQ Accordion */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Common Questions</CardTitle>
            <CardDescription>
              Everything you need to know about our export services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Still Have Questions?</CardTitle>
            <CardDescription>
              Our export team is ready to assist you with any specific queries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleWhatsApp}
                className="flex flex-col items-center gap-2 h-auto py-6 hover:bg-green-50 hover:border-green-200"
              >
                <MessageCircle className="h-6 w-6 text-green-600" />
                <div>
                  <div className="font-semibold">WhatsApp</div>
                  <div className="text-sm text-muted-foreground">+91 89551 58794</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                asChild
                className="flex flex-col items-center gap-2 h-auto py-6 hover:bg-blue-50 hover:border-blue-200"
              >
                <a href="tel:+918955158794">
                  <Phone className="h-6 w-6 text-blue-600" />
                  <div>
                    <div className="font-semibold">Call Us</div>
                    <div className="text-sm text-muted-foreground">+91 89551 58794</div>
                  </div>
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                asChild
                className="flex flex-col items-center gap-2 h-auto py-6 hover:bg-orange-50 hover:border-orange-200"
              >
                <a href="mailto:info@shineveda.com">
                  <Mail className="h-6 w-6 text-orange-600" />
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-sm text-muted-foreground">info@shineveda.com</div>
                  </div>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FAQ;