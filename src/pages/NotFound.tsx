import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Search, 
  Package2, 
  Phone, 
  ArrowLeft, 
  MapPin,
  Compass,
  RefreshCw 
} from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const quickLinks = [
    { 
      title: "Home", 
      href: "/", 
      icon: Home, 
      description: "Return to homepage",
      color: "bg-blue-50 text-blue-600 border-blue-200"
    },
    { 
      title: "Products", 
      href: "/products", 
      icon: Package2, 
      description: "Browse our products",
      color: "bg-green-50 text-green-600 border-green-200"
    },
    { 
      title: "About Us", 
      href: "/about", 
      icon: Compass, 
      description: "Learn about ShineVeda",
      color: "bg-purple-50 text-purple-600 border-purple-200"
    },
    { 
      title: "Contact", 
      href: "/contact", 
      icon: Phone, 
      description: "Get in touch with us",
      color: "bg-orange-50 text-orange-600 border-orange-200"
    }
  ];

  const popularProducts = [
    "Premium Onions",
    "Cumin Seeds (Jeera)", 
    "Raw Peanuts",
    "Fresh Carrots",
    "Guar Gum"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex items-center justify-center p-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23f59e0b&quot; fill-opacity=&quot;0.05&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;4&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      <div className="max-w-4xl mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* 404 Animation */}
          <div className="relative mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6, type: "spring", bounce: 0.3 }}
              className="text-8xl md:text-9xl font-bold text-gradient bg-gradient-to-r from-primary via-accent to-orange-500 bg-clip-text text-transparent mb-4"
            >
              404
            </motion.div>
            
            {/* Floating Elements */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-4 -left-8 md:-left-16"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
            </motion.div>

            <motion.div
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, -5, 5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -top-4 -right-8 md:-right-16"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <Search className="h-6 w-6 text-accent" />
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-8"
          >
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
              Page Not Found
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Oops! This page seems to be{" "}
              <span className="text-gradient">lost in the fields</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The page you're looking for doesn't exist or may have been moved. 
              Let's help you find what you need from our agricultural collection.
            </p>
          </motion.div>

          {/* Current Path Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-8"
          >
            <Card className="max-w-md mx-auto bg-destructive/5 border-destructive/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Requested path:</span>
                  <code className="font-mono text-destructive bg-destructive/10 px-2 py-1 rounded">
                    {location.pathname}
                  </code>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold text-foreground mb-6">Quick Navigation</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <motion.div
                    key={link.title}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="card-premium hover:shadow-lg cursor-pointer h-full">
                      <CardContent className="p-6 text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${link.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">{link.title}</h3>
                        <p className="text-xs text-muted-foreground">{link.description}</p>
                        <Button asChild variant="ghost" size="sm" className="mt-2 w-full">
                          <Link to={link.href}>
                            Go to {link.title}
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Popular Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Popular Products</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {popularProducts.map((product, index) => (
                <motion.div
                  key={product}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 + index * 0.1, duration: 0.4 }}
                >
                  <Link to="/products">
                    <Badge 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {product}
                    </Badge>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button asChild size="lg" className="btn-premium group">
              <Link to="/">
                <Home className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Back to Home
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link to="/products">
                <Package2 className="mr-2 h-5 w-5" />
                Browse Products
              </Link>
            </Button>

            <Button 
              variant="ghost" 
              size="lg"
              onClick={() => window.history.back()}
              className="group"
            >
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </Button>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="mt-12 pt-8 border-t border-border"
          >
            <p className="text-muted-foreground mb-4">
              Still can't find what you're looking for?
            </p>
            <Button asChild variant="outline" className="group">
              <Link to="/contact">
                <Phone className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                Contact Support
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;