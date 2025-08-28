import { ArrowRight, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";
import farmingHero from "@/assets/indian-farming-hero.jpg";
import rajasthanFarmers from "@/assets/rajasthan-farmers.jpg";

const HeroSection = () => {
  const { data: heroContent } = useQuery({
    queryKey: ['hero-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('key', 'hero_main')
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const handleQuoteRequest = () => {
    window.open('https://wa.me/918955158794?text=Hello%20ShineVeda,%20I%20would%20like%20to%20request%20a%20quote%20for%20your%20agricultural%20exports.', '_blank');
  };

  // Default content if database content is not available
  const defaultContent = {
    title: "From Sriganganagar Farms to Your Doorstep",
    content: "Premium agri-commodities from the heart of Rajasthan. Onions, Jeera, Peanuts, Carrots, Chickpeas, Mustard & Guar Gum - packaged and graded to the highest international standards.",
    data: {
      subtitle: "Premium agri-commodities from the heart of Rajasthan.",
      stats: [
        { number: "500+", label: "Global Shipments" },
        { number: "25+", label: "Countries Served" },
        { number: "99.8%", label: "Quality Score" },
        { number: "24/7", label: "Support" }
      ]
    }
  };

  const content = heroContent || defaultContent;
  const contentData = heroContent 
    ? (typeof heroContent.metadata === 'string' ? JSON.parse(heroContent.metadata) : heroContent.metadata)
    : defaultContent.data;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images with Parallax */}
      <div className="absolute inset-0">
        {/* Primary farming background */}
        <img 
          src={farmingHero}
          alt="Indian farmers working in agricultural fields" 
          className="w-full h-full object-cover"
        />
        {/* Secondary overlay image */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        
        {/* Rajasthan farmers overlay */}
        <div className="absolute inset-0 opacity-30">
          <img 
            src={rajasthanFarmers}
            alt="Rajasthan agricultural landscape" 
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>
      </div>
      
      {/* Floating Animation Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-brand-saffron/20 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-6 h-6 bg-primary/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-brand-saffron/30 rounded-full animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 mb-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium">
            <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
            Export Quality Since 2020
          </div>

          {/* Main Headlines */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            {content.title?.split(' ').slice(0, 1).join(' ')}{" "}
            <span className="text-gradient bg-gradient-to-r from-brand-saffron to-primary bg-clip-text text-transparent">
              {content.title?.split(' ').slice(1, 2).join(' ') || 'Sriganganagar'}
            </span>
            <br />
            {content.title?.split(' ').slice(2).join(' ') || 'Farms to Your Doorstep'}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
            {contentData?.subtitle || content.content}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              onClick={handleQuoteRequest}
              className="btn-premium text-foreground font-semibold px-8 py-6 text-lg rounded-xl group transition-bounce hover:scale-105"
            >
              Request a Quote
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-xl transition-premium"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Our Story
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
            {(contentData?.stats || defaultContent.data.stats).map((stat: any, index: number) => (
              <div key={index} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-white/70 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full p-1">
          <div className="w-1 h-3 bg-white/70 rounded-full mx-auto animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;