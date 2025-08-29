import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  HandHeart, 
  GraduationCap, 
  FileText, 
  CreditCard, 
  Thermometer, 
  Users,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const supportPrograms = [
  {
    icon: <HandHeart className="h-8 w-8" />,
    title: 'Contract Pricing Guidance',
    description: 'Fair price agreements with transparent terms and timely payments for your crops.',
    details: [
      'Market-linked pricing',
      'Advance payment options',
      'Transparent grading system',
      'No hidden charges'
    ],
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900'
  },
  {
    icon: <GraduationCap className="h-8 w-8" />,
    title: 'Grading & Packaging Training',
    description: 'Learn professional techniques for crop grading, packaging, and quality maintenance.',
    details: [
      'Export quality standards',
      'Damage-free packaging',
      'Storage best practices',
      'Quality certification'
    ],
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900'
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: 'Land Leasing Best Practices',
    description: 'Legal guidance and best practices for land leasing arrangements and documentation.',
    details: [
      'Legal documentation help',
      'Fair lease agreements',
      'Rights and responsibilities',
      'Dispute resolution support'
    ],
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900'
  },
  {
    icon: <CreditCard className="h-8 w-8" />,
    title: 'Micro-loan & Credit Referrals',
    description: 'Connect with trusted financial partners for agricultural credit and micro-loans.',
    details: [
      'Partner bank connections',
      'Low-interest loan options',
      'Quick approval process',
      'Flexible repayment terms'
    ],
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900'
  },
  {
    icon: <Thermometer className="h-8 w-8" />,
    title: 'Post-harvest Handling',
    description: 'Cold chain basics and proper storage techniques to minimize post-harvest losses.',
    details: [
      'Temperature management',
      'Humidity control',
      'Storage infrastructure',
      'Quality preservation'
    ],
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900'
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Community Development',
    description: 'Building farmer cooperatives and community networks for collective growth.',
    details: [
      'Cooperative formation',
      'Group farming initiatives',
      'Knowledge sharing',
      'Market access improvement'
    ],
    color: 'text-pink-600',
    bgColor: 'bg-pink-100 dark:bg-pink-900'
  }
];

const FarmerSupport: React.FC = () => {
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
          <HandHeart className="h-4 w-4 mr-2" />
          Farmer Support — Kisan Sahayata
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
          Comprehensive Farmer Support Programs
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          From seed to market, we provide end-to-end support to help farmers succeed. 
          Our programs focus on technical knowledge, financial assistance, and market access.
        </p>
      </motion.div>

      {/* Support Programs Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {supportPrograms.map((program, index) => (
          <motion.div
            key={program.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="group hover:shadow-lg transition-all duration-300 h-full">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 ${program.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={program.color}>
                    {program.icon}
                  </div>
                </div>
                <CardTitle className="text-xl">{program.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-center">
                  {program.description}
                </p>
                
                <div className="space-y-2">
                  {program.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{detail}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* What We Do Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              About Our Support Model
            </h3>
            <div className="prose prose-lg text-muted-foreground space-y-4">
              <p>
                ShineVeda believes in empowering farmers through direct purchase programs, 
                comprehensive grading & packing services, and efficient export logistics 
                through major ports like Kandla and Mundra.
              </p>
              <p>
                Our empowerment programs include lease guidance, yield-improvement training, 
                and connections to financial partners. We focus on small landholders, 
                helping them access global markets while maintaining fair pricing.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card className="p-6 bg-white/80 backdrop-blur">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <HandHeart className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Direct Purchasing</h4>
                  <p className="text-muted-foreground">Fair prices, no middlemen</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-white/80 backdrop-blur">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Technical Training</h4>
                  <p className="text-muted-foreground">Modern farming techniques</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-white/80 backdrop-blur">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Community Building</h4>
                  <p className="text-muted-foreground">Farmer cooperatives & networks</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/contact">
              <Users className="h-5 w-5 mr-2" />
              Join Our Farmer Network
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default FarmerSupport;