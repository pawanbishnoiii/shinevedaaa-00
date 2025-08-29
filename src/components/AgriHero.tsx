import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, Wheat, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const AgriHero: React.FC = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-amber-800 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/src/assets/rajasthan-farmers.jpg"
          alt="Rajasthan farmer family in field — ShineVeda support"
          className="w-full h-full object-cover opacity-40"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 via-green-800/60 to-transparent"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Heart className="h-4 w-4 mr-2" />
              Farmers First Initiative
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Agri — ShineVeda
            </h1>
            
            <div className="mb-8 space-y-2">
              <p className="text-xl md:text-2xl text-green-100 font-medium">
                Rajasthan & Punjab farmers ke saath
              </p>
              <p className="text-lg md:text-xl text-amber-100">
                Seed se global market tak
              </p>
            </div>

            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl leading-relaxed">
              Direct sourcing, fair pricing, and technical support for small landholders. 
              Building sustainable agricultural value chains from the heart of India.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button asChild size="lg" className="bg-white text-green-800 hover:bg-white/90 font-semibold">
                <Link to="/contact">
                  <Users className="h-5 w-5 mr-2" />
                  Sell to ShineVeda
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-green-800 font-semibold"
              >
                <a href="#farmer-stories">
                  <Wheat className="h-5 w-5 mr-2" />
                  Read Farmer Stories
                </a>
              </Button>
            </div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="grid grid-cols-3 gap-4 pt-8 border-t border-white/20"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-white/80">Farmers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">15+</div>
                <div className="text-sm text-white/80">States</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">25+</div>
                <div className="text-sm text-white/80">Crops</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Additional visual element */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <img
                src="/src/assets/farming-family.jpg"
                alt="Indian farming community — ShineVeda partnership"
                className="w-full max-w-md rounded-2xl shadow-2xl"
                loading="lazy"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Wheat className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-green-800">Premium Quality</div>
                    <div className="text-sm text-gray-600">Export Grade Crops</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
      >
        <div className="text-center">
          <div className="text-sm mb-2">Scroll to explore</div>
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AgriHero;