import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  HelpCircle, 
  Truck, 
  FileText, 
  CreditCard, 
  Package, 
  Users,
  Award,
  Globe
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'export' | 'partnership' | 'quality' | 'support';
  icon: React.ReactNode;
}

const faqItems: FAQItem[] = [
  {
    id: 'export-process',
    question: 'What is the export process for agricultural products?',
    answer: 'Our export process involves quality assessment, grading, packaging to international standards, documentation preparation, and shipping through major ports like Kandla and Mundra. We handle all logistics including customs clearance, phytosanitary certificates, and quality compliance documentation.',
    category: 'export',
    icon: <Globe className="h-5 w-5" />
  },
  {
    id: 'farmer-partnership',
    question: 'How can I become a partner farmer with ShineVeda?',
    answer: 'To become a partner farmer, contact our team through the inquiry form or phone. We evaluate your farming practices, crop quality, and location. Once approved, we provide technical support, fair pricing agreements, and market access. We especially welcome small landholders and cooperative groups.',
    category: 'partnership',
    icon: <Users className="h-5 w-5" />
  },
  {
    id: 'quality-standards',
    question: 'What quality standards do you maintain for crops?',
    answer: 'We maintain strict quality standards including moisture content control, purity levels (98%+ for most crops), proper grading, and compliance with international food safety norms. All crops undergo laboratory testing for pesticide residues, aflatoxins, and other quality parameters before export.',
    category: 'quality',
    icon: <Award className="h-5 w-5" />
  },
  {
    id: 'pricing-payment',
    question: 'How do you determine pricing and payment terms?',
    answer: 'Our pricing is market-linked and transparent, based on current international rates and quality grades. We offer advance payment options, timely settlements within 7-15 days of delivery, and bonus payments for premium quality. No hidden charges or deductions are applied.',
    category: 'partnership',
    icon: <CreditCard className="h-5 w-5" />
  },
  {
    id: 'land-leasing',
    question: 'Do you provide guidance on land leasing arrangements?',
    answer: 'Yes, we provide comprehensive guidance on land leasing including legal documentation support, fair lease agreement templates, understanding of rights and responsibilities, and dispute resolution assistance. Our team helps small farmers navigate leasing arrangements safely.',
    category: 'support',
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 'packaging-training',
    question: 'What kind of packaging and grading training do you provide?',
    answer: 'We conduct regular training sessions on export-quality packaging, damage-free handling, proper grading techniques, storage best practices, and quality preservation methods. Training includes hands-on sessions at our facilities and on-farm guidance.',
    category: 'support',
    icon: <Package className="h-5 w-5" />
  },
  {
    id: 'crop-varieties',
    question: 'Which crops do you procure and from which regions?',
    answer: 'We primarily procure onions, cumin (jeera), guar gum, peanuts, and mustard from Rajasthan (especially Sikar district) and Punjab. We are expanding to other regions and crops based on quality and export demand. Contact us to discuss specific crop varieties.',
    category: 'export',
    icon: <Package className="h-5 w-5" />
  },
  {
    id: 'minimum-quantity',
    question: 'What is the minimum quantity required for partnership?',
    answer: 'We work with farmers of all scales. For individual farmers, the minimum quantity depends on the crop type (typically 1-2 tons for onions, 500kg for cumin). We encourage cooperative farming and group partnerships to meet larger quantities and better pricing.',
    category: 'partnership',
    icon: <Truck className="h-5 w-5" />
  },
  {
    id: 'seasonal-planning',
    question: 'How do you help with seasonal crop planning?',
    answer: 'Our agronomists provide seasonal planning guidance including crop selection based on market demand, soil suitability analysis, seed variety recommendations, irrigation planning, and harvest timing optimization to ensure maximum yields and quality.',
    category: 'support',
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 'certifications',
    question: 'What certifications and quality assurances do you provide?',
    answer: 'We are ISO 22000 certified for food safety management and FSSAI licensed. Our facilities meet HACCP standards. We provide phytosanitary certificates, quality analysis reports, and traceability documentation for all exported products.',
    category: 'quality',
    icon: <Award className="h-5 w-5" />
  }
];

const categories = [
  { id: 'export', label: 'Export Process', color: 'bg-blue-100 text-blue-800' },
  { id: 'partnership', label: 'Partnership', color: 'bg-green-100 text-green-800' },
  { id: 'quality', label: 'Quality Standards', color: 'bg-purple-100 text-purple-800' },
  { id: 'support', label: 'Farmer Support', color: 'bg-orange-100 text-orange-800' }
];

const AgriFAQ: React.FC = () => {
  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Badge variant="secondary" className="mb-4">
          <HelpCircle className="h-4 w-4 mr-2" />
          Frequently Asked Questions — सामान्य प्रश्न
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
          Everything You Need to Know
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Get answers to common questions about our export process, farmer partnerships, 
          quality standards, and support programs.
        </p>
      </motion.div>

      {/* FAQ Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {categories.map((category, index) => {
          const categoryFAQs = faqItems.filter(faq => faq.category === category.id);
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-muted/30 rounded-lg"
            >
              <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <HelpCircle className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">{category.label}</h3>
              <p className="text-sm text-muted-foreground">
                {categoryFAQs.length} questions
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* FAQ Accordion */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <Accordion type="single" collapsible className="space-y-4">
          {faqItems.map((faq, index) => {
            const categoryInfo = getCategoryInfo(faq.category);
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <AccordionItem 
                  value={faq.id}
                  className="border rounded-lg px-6 bg-card hover:bg-accent/50 transition-colors"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <div className="flex items-start gap-4 w-full">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-10 h-10 ${categoryInfo.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                          {faq.icon}
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-base">{faq.question}</h3>
                          <Badge variant="secondary" className="mt-2 text-xs">
                            {categoryInfo.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pt-2 pl-14">
                    <div className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            );
          })}
        </Accordion>
      </motion.div>

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 text-center"
      >
        <HelpCircle className="h-12 w-12 mx-auto text-primary mb-4" />
        <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Our team is here to help! Contact us directly for personalized guidance 
          about partnerships, export processes, or any other agricultural queries.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Badge variant="outline" className="py-2 px-4">
            📞 +91-8955158794
          </Badge>
          <Badge variant="outline" className="py-2 px-4">
            📧 info@shineveda.in
          </Badge>
          <Badge variant="outline" className="py-2 px-4">
            📍 Sri Ganganagar, Rajasthan
          </Badge>
        </div>
      </motion.div>
    </div>
  );
};

export default AgriFAQ;