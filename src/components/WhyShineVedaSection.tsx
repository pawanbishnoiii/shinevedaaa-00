import { useState, useEffect } from "react";
import { Globe, Users, Package, Star, ArrowRight, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
const stats = [{
  id: 1,
  number: 500,
  suffix: "+",
  label: "Global Shipments",
  description: "Successfully delivered worldwide",
  icon: Package
}, {
  id: 2,
  number: 25,
  suffix: "+",
  label: "Countries Served",
  description: "International market presence",
  icon: Globe
}, {
  id: 3,
  number: 99.8,
  suffix: "%",
  label: "Quality Score",
  description: "Customer satisfaction rate",
  icon: Star
}, {
  id: 4,
  number: 150,
  suffix: "+",
  label: "Partners Worldwide",
  description: "Trusted business relationships",
  icon: Users
}];
const testimonials = [{
  id: 1,
  name: "Ahmed Al-Rahman",
  company: "Gulf Trading Co.",
  country: "UAE",
  quote: "ShineVeda's quality consistency is remarkable. Their onions and cumin have become our premium line in the UAE market.",
  rating: 5,
  productLine: "Onions & Cumin"
}, {
  id: 2,
  name: "Maria Rodriguez",
  company: "European Imports Ltd.",
  country: "Spain",
  quote: "Exceptional packaging and timely delivery. The guar gum quality exceeded our industrial requirements.",
  rating: 5,
  productLine: "Guar Gum"
}, {
  id: 3,
  name: "James Wilson",
  company: "Premium Foods Inc.",
  country: "USA",
  quote: "Best peanuts we've sourced from India. The grading and processing standards are world-class.",
  rating: 5,
  productLine: "Peanuts"
}];
const CountUp = ({
  target,
  suffix = "",
  duration = 2000
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };
    requestAnimationFrame(animate);
  }, [target, duration]);
  return <span>{count}{suffix}</span>;
};
const WhyShineVedaSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const handleQuoteRequest = () => {
    window.open('https://wa.me/918955158794?text=Hello%20ShineVeda,%20I%20would%20like%20to%20discuss%20a%20potential%20partnership%20opportunity.', '_blank');
  };
  return <section className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
            Why Choose Us
          </Badge>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
            Trusted by{" "}
            <span className="text-gradient">Global</span>
            <br />
            Partners Worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From small-scale importers to multinational corporations, 
            our commitment to quality and reliability has earned us trust across continents.
          </p>
        </div>

        {/* Stats Counter */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => <Card key={stat.id} className="card-premium text-center group hover:scale-105 transition-all duration-300" style={{
          animationDelay: `${index * 150}ms`
        }}>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-brand-saffron rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                
                <div className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
                  <CountUp target={stat.number} suffix={stat.suffix} />
                </div>
                
                <div className="font-semibold text-primary mb-2">
                  {stat.label}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </CardContent>
            </Card>)}
        </div>

        {/* Testimonials */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Testimonials Carousel */}
          <div className="space-y-8">
            <div>
              <h3 className="font-display text-3xl font-bold text-foreground mb-4">
                What Our Partners Say
              </h3>
              <p className="text-muted-foreground">
                Real feedback from our valued international partners across different continents.
              </p>
            </div>

            <div className="relative">
              {testimonials.map((testimonial, index) => <Card key={testimonial.id} className={`card-premium transition-all duration-500 ${index === activeTestimonial ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 absolute inset-0'}`}>
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Quote className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex mb-2">
                          {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-brand-saffron text-brand-saffron" />)}
                        </div>
                        <p className="text-foreground leading-relaxed italic mb-4">
                          "{testimonial.quote}"
                        </p>
                        <div>
                          <div className="font-semibold text-foreground">
                            {testimonial.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {testimonial.company} • {testimonial.country}
                          </div>
                          <Badge variant="outline" className="mt-2 text-xs border-primary/20 text-primary">
                            {testimonial.productLine}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}

              {/* Testimonial Navigation */}
              <div className="flex gap-2 mt-6">
                {testimonials.map((_, index) => <button key={index} onClick={() => setActiveTestimonial(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeTestimonial ? 'bg-primary scale-125' : 'bg-primary/30 hover:bg-primary/50'}`} />)}
              </div>
            </div>
          </div>

          {/* World Map Visual */}
          <div className="relative">
            <Card className="card-premium">
              <CardContent className="p-8">
                <h4 className="font-display text-xl font-bold text-foreground mb-6 text-center">
                  Global Reach
                </h4>
                
                {/* Simple World Map Representation */}
                <div className="relative bg-gradient-to-br from-primary/5 to-brand-saffron/5 rounded-2xl p-8 h-64">
                  {/* Continent markers */}
                  <div className="absolute top-8 left-8 w-3 h-3 bg-primary rounded-full animate-pulse" />
                  <div className="absolute top-12 right-12 w-3 h-3 bg-brand-saffron rounded-full animate-pulse" style={{
                  animationDelay: '1s'
                }} />
                  <div className="absolute bottom-16 left-16 w-3 h-3 bg-primary rounded-full animate-pulse" style={{
                  animationDelay: '2s'
                }} />
                  <div className="absolute bottom-8 right-8 w-3 h-3 bg-brand-saffron rounded-full animate-pulse" style={{
                  animationDelay: '3s'
                }} />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full" />
                  
                  {/* Connection lines */}
                  <div className="absolute inset-0 opacity-20">
                    <svg className="w-full h-full">
                      <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                      <line x1="50%" y1="50%" x2="80%" y2="25%" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                      <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                      <line x1="50%" y1="50%" x2="75%" y2="80%" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                    </svg>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <div className="text-sm text-muted-foreground">
                      Shipping to 25+ countries across 5 continents
                    </div>
                  </div>
                </div>

                {/* Key Markets */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {["Middle East", "Europe", "North America", "Southeast Asia"].map((market, index) => <div key={index} className="text-center p-3 bg-secondary/50 rounded-lg">
                      <div className="font-semibold text-sm text-foreground">{market}</div>
                      <div className="text-xs text-muted-foreground">Active Market</div>
                    </div>)}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="card-premium max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                Ready to Partner with Us?
              </h3>
              <p className="text-muted-foreground mb-6">
                Join our global network of satisfied partners. Let's discuss how 
                ShineVeda can meet your agricultural commodity needs.
              </p>
              <Button size="lg" onClick={handleQuoteRequest} className="btn-premium px-8 py-6 font-semibold transition-bounce hover:scale-105 text-xs">
                Start Partnership Discussion
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>;
};
export default WhyShineVedaSection;