import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Users, 
  Package, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin,
  Handshake,
  TrendingUp,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AgriCTA: React.FC = () => {
  return (
    <div className="relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4gPGcgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiPiA8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiLz4gPC9nPiA8L2c+IDwvc3ZnPg==')] opacity-20"></div>
      </div>

      <div className="relative z-10 text-center space-y-12">
        {/* Main CTA Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="flex justify-center">
            <Heart className="h-16 w-16 text-white/90 mb-4" />
          </div>
          
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
            <Handshake className="h-4 w-4 mr-2" />
            Partner With Excellence
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Join the ShineVeda
            <br />
            <span className="text-yellow-200">Agriculture Network</span>
          </h2>

          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
            हमारे साथ जुड़िए — Support Indian farmers, access premium agricultural products, 
            and be part of a sustainable farming revolution that benefits communities globally.
          </p>
        </motion.div>

        {/* CTA Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {/* Sell to Us Card */}
          <Card className="group bg-white/95 backdrop-blur hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-green-200 transition-colors">
                <Package className="h-8 w-8 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Sell to ShineVeda
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Are you a farmer with quality crops? Join our network for fair pricing, 
                  technical support, and direct access to global markets.
                </p>
              </div>
              
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <Award className="h-4 w-4 text-green-600" />
                  <span>Fair & transparent pricing</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span>Technical support & training</span>
                </div>
                <div className="flex items-center gap-3">
                  <Handshake className="h-4 w-4 text-green-600" />
                  <span>Long-term partnerships</span>
                </div>
              </div>
              
              <Button asChild size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold">
                <Link to="/contact">
                  <Users className="h-5 w-5 mr-2" />
                  Become a Partner Farmer
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Buy from Us Card */}
          <Card className="group bg-white/95 backdrop-blur hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-200 transition-colors">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Source Premium Products
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Looking for export-quality agricultural products? Discover our premium 
                  range directly sourced from trusted farmers.
                </p>
              </div>
              
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span>Export-grade quality assured</span>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-blue-600" />
                  <span>Professional packaging & logistics</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span>Competitive pricing & reliability</span>
                </div>
              </div>
              
              <Button asChild size="lg" variant="outline" className="w-full border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600 font-semibold">
                <Link to="/products">
                  <Package className="h-5 w-5 mr-2" />
                  View Our Products
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="text-white/90">
            <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
            <p className="text-white/80">
              Ready to start your journey with ShineVeda? Our team is here to help you every step of the way.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">Call Us</div>
                <div className="text-sm">+91-8955158794</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">Email Us</div>
                <div className="text-sm">info@shineveda.in</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">Visit Us</div>
                <div className="text-sm">Sri Ganganagar, Rajasthan</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-white/20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white/80">
            <div>
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-sm">Partner Farmers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">2,500+</div>
              <div className="text-sm">Tons Exported</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">30+</div>
              <div className="text-sm">Countries Reached</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">99%</div>
              <div className="text-sm">Quality Assured</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AgriCTA;