import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DynamicAboutTeam } from '@/components/DynamicAboutTeam';
import { 
  Award,
  Users,
  Globe,
  Truck,
  Shield,
  CheckCircle,
  Star,
  Target,
  Heart,
  Zap
} from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Globe, value: '15+', label: 'Countries Served' },
    { icon: Users, value: '500+', label: 'Happy Clients' },
    { icon: Truck, value: '1000+', label: 'Shipments Delivered' },
    { icon: Award, value: '5+', label: 'Years Experience' },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Quality First',
      description: 'Every product undergoes rigorous quality checks to ensure international standards'
    },
    {
      icon: Heart,
      title: 'Customer-Centric',
      description: 'Building lasting relationships through personalized service and support'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Leveraging technology and modern practices for efficient operations'
    },
    {
      icon: Target,
      title: 'Reliability',
      description: 'Consistent delivery and transparent communication you can count on'
    }
  ];

  const certifications = [
    'ISO 22000:2018 - Food Safety Management',
    'HACCP Certified - Hazard Analysis',
    'FSSAI Licensed - Food Safety Standards',
    'Export License - Government Approved',
    'Phytosanitary Certificate - Plant Health'
  ];

  return (
    <>
      <Helmet>
        <title>About ShineVeda - Premium Agricultural Exports from India</title>
        <meta name="description" content="Learn about ShineVeda's journey, values, and commitment to delivering premium agricultural commodities from Rajasthan to global markets." />
        <meta name="keywords" content="ShineVeda, agricultural exports, company story, quality assurance, certifications" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <Badge variant="secondary" className="mb-4">About ShineVeda</Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Cultivating <span className="text-primary">Global</span> Trust
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                From the fertile lands of Rajasthan to international markets worldwide, 
                ShineVeda has been a trusted partner in premium agricultural exports.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            >
              {stats.map((stat, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-6">
                    <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                    <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-muted-foreground text-sm">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Badge variant="outline" className="mb-4">Our Story</Badge>
                <h2 className="text-4xl font-bold mb-6">
                  Rooted in <span className="text-primary">Tradition</span>, 
                  <br />Growing with <span className="text-primary">Innovation</span>
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Founded in the agricultural heartland of Sri Ganganagar, Rajasthan, ShineVeda began 
                  with a simple mission: to share the finest quality agricultural products from India 
                  with the world. What started as a local farming initiative has grown into a trusted 
                  international export company.
                </p>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Our journey has been guided by the principles of quality, integrity, and customer 
                  satisfaction. Today, we serve clients across 15+ countries, delivering everything 
                  from premium onions and spices to guar gum and raw peanuts.
                </p>
                <Button size="lg" className="group">
                  Get In Touch
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.div>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=600&fit=crop"
                  alt="Agricultural fields in Rajasthan"
                  className="rounded-lg shadow-lg w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-secondary/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge variant="secondary" className="mb-4">Our Values</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                What Drives Us <span className="text-primary">Forward</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our core values shape every decision we make and every relationship we build
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="pt-6 text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                        <value.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Badge variant="outline" className="mb-4">Quality Assurance</Badge>
                <h2 className="text-4xl font-bold mb-6">
                  <span className="text-primary">Certified</span> Excellence
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Our commitment to quality is backed by international certifications and 
                  rigorous quality control processes. Every product that leaves our facility 
                  meets or exceeds global standards.
                </p>

                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">{cert}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-4"
              >
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
                  alt="Quality control laboratory"
                  className="rounded-lg shadow-lg h-48 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop"
                  alt="Agricultural inspection"
                  className="rounded-lg shadow-lg h-48 object-cover mt-8"
                />
                <img
                  src="https://images.unsplash.com/photo-1566140967404-b8b3c277f95b?w=400&h=300&fit=crop"
                  alt="Packaging facility"
                  className="rounded-lg shadow-lg h-48 object-cover -mt-8"
                />
                <img
                  src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop"
                  alt="Export documentation"
                  className="rounded-lg shadow-lg h-48 object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Partner with <span className="text-primary">ShineVeda</span>?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join hundreds of satisfied clients worldwide who trust us for their agricultural import needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="px-8">
                  Start Your Order
                </Button>
                <Button size="lg" variant="outline" className="px-8">
                  Download Catalog
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;