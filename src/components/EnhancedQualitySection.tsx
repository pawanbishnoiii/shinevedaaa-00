import { CheckCircle, Truck, Shield, Award, Thermometer, Sparkles, Zap, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

const qualitySteps = [
  {
    id: 1,
    title: "Farm Selection",
    description: "Handpicked from premium farms in Sri Ganganagar with ideal soil conditions and sustainable farming practices",
    icon: CheckCircle,
    details: ["Soil quality assessment", "Farmer partnerships", "Organic certification", "Sustainable practices"],
    color: "from-green-500 to-emerald-600",
    bgColor: "from-green-50 to-emerald-50",
    metric: "99.5%",
    metricLabel: "Farm Quality Score"
  },
  {
    id: 2,
    title: "Harvest Quality Check",
    description: "Rigorous quality control at the point of harvest with expert grading and advanced testing",
    icon: Award,
    details: ["Moisture content testing", "Visual inspection", "Size grading", "Nutritional analysis"],
    color: "from-blue-500 to-cyan-600",
    bgColor: "from-blue-50 to-cyan-50",
    metric: "99.8%",
    metricLabel: "Quality Pass Rate"
  },
  {
    id: 3,
    title: "Processing & Cleaning",
    description: "Advanced cleaning and processing using state-of-the-art machinery and AI-powered sorting",
    icon: Shield,
    details: ["Machine cleaning", "Foreign matter removal", "AI-powered sorting", "Contamination testing"],
    color: "from-purple-500 to-indigo-600",
    bgColor: "from-purple-50 to-indigo-50",
    metric: "99.9%",
    metricLabel: "Purity Level"
  },
  {
    id: 4,
    title: "Premium Packaging",
    description: "Heavy-duty corrugated boxes and specialized packaging for international shipping with traceability",
    icon: Truck,
    details: ["Moisture-proof packaging", "Export-grade materials", "Custom labeling", "QR code traceability"],
    color: "from-orange-500 to-red-600",
    bgColor: "from-orange-50 to-red-50",
    metric: "100%",
    metricLabel: "Packaging Quality"
  },
  {
    id: 5,
    title: "Cold Chain & Logistics",
    description: "Temperature-controlled storage and refrigerated container shipping with real-time monitoring",
    icon: Thermometer,
    details: ["Cold storage facilities", "Refrigerated transport", "Global logistics", "Real-time tracking"],
    color: "from-teal-500 to-blue-600",
    bgColor: "from-teal-50 to-blue-50",
    metric: "98.9%",
    metricLabel: "Delivery Success"
  }
];

const certifications = [
  { name: "ISO 22000:2018", icon: Shield },
  { name: "HACCP Certified", icon: CheckCircle },
  { name: "FSSAI Licensed", icon: Award },
  { name: "Export License", icon: Star },
  { name: "Phytosanitary", icon: Sparkles },
  { name: "Origin Certificate", icon: Zap }
];

const EnhancedQualitySection = () => {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateCards(true);
    }, 500);

    // Stagger animation for steps
    qualitySteps.forEach((_, index) => {
      setTimeout(() => {
        setVisibleSteps(prev => [...prev, index]);
      }, 800 + (index * 300));
    });

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-br from-background via-secondary/20 to-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-brand-saffron/5" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-brand-saffron/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-brand-saffron/10 rounded-full px-6 py-3 mb-6">
            <Sparkles className="h-5 w-5 text-primary animate-spin" />
            <Badge variant="secondary" className="bg-transparent border-0 text-primary font-semibold">
              Quality Excellence
            </Badge>
            <Sparkles className="h-5 w-5 text-brand-saffron animate-spin" />
          </div>
          
          <h2 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-8 tracking-tight">
            Our 5-Point{" "}
            <span className="bg-gradient-to-r from-primary via-brand-saffron to-primary bg-clip-text text-transparent animate-gradient">
              Quality
            </span>
            <br />
            <span className="text-4xl md:text-6xl">Promise</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
            From farm to your doorstep, every product undergoes our revolutionary 
            5-step quality assurance process, ensuring world-class standards and complete traceability.
          </p>
          
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
              <span>Real-time Monitoring</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-brand-saffron rounded-full animate-pulse delay-500" />
              <span>AI-Powered Quality Control</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-1000" />
              <span>100% Traceable</span>
            </div>
          </div>
        </div>

        {/* Quality Process */}
        <div className="relative">
          {/* Animated connection line */}
          <div className="hidden lg:block absolute top-32 left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-brand-saffron to-primary opacity-30">
            <div className="absolute inset-0 bg-gradient-to-b from-primary to-brand-saffron animate-pulse opacity-50" />
          </div>

          <div className="space-y-12 lg:space-y-20">
            {qualitySteps.map((step, index) => (
              <div 
                key={step.id}
                className={`relative transition-all duration-1000 ${
                  visibleSteps.includes(index) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-20'
                } ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex flex-col lg:flex-row items-center gap-8 lg:gap-16`}
              >
                {/* Content Card */}
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                  <Card className={`group relative overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25 max-w-lg mx-auto lg:mx-0 ${
                    animateCards ? 'animate-bounce-subtle' : ''
                  }`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.bgColor} opacity-50 transition-opacity group-hover:opacity-75`} />
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${step.color}`} />
                    
                    <CardContent className="p-8 relative">
                      <div className={`flex items-center gap-4 mb-6 ${
                        index % 2 === 0 ? 'lg:flex-row-reverse lg:justify-start' : 'lg:flex-row'
                      }`}>
                        <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                          <step.icon className="h-8 w-8 text-white drop-shadow-sm" />
                        </div>
                        <div>
                          <Badge variant="outline" className="text-xs mb-3 border-primary/30 text-primary bg-primary/10">
                            Step {step.id}
                          </Badge>
                          <h3 className="font-display text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {step.title}
                          </h3>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
                        {step.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {step.details.map((detail, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-foreground">
                            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>

                      {/* Quality Metric */}
                      <div className="text-center p-4 bg-card/50 rounded-xl border border-primary/20">
                        <div className="text-3xl font-bold text-primary mb-1">{step.metric}</div>
                        <div className="text-sm text-muted-foreground">{step.metricLabel}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Center Circle with Animation */}
                <div className="relative flex-shrink-0 z-10">
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 relative overflow-hidden`}>
                    <span className="text-white font-bold text-2xl relative z-10">{step.id}</span>
                    {/* Rotating border */}
                    <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-spin" />
                  </div>
                  {/* Multiple pulse rings */}
                  <div className="absolute inset-0 w-20 h-20 bg-primary/20 rounded-full animate-ping" />
                  <div className="absolute inset-0 w-20 h-20 bg-brand-saffron/20 rounded-full animate-ping delay-500" />
                  <div className="absolute inset-0 w-20 h-20 bg-green-500/20 rounded-full animate-ping delay-1000" />
                </div>

                {/* Visual Element with Enhanced Animation */}
                <div className="flex-1">
                  <div className={`group max-w-lg mx-auto lg:mx-0 p-8 bg-gradient-to-br from-card to-secondary/30 rounded-3xl border border-border/50 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-xl ${
                    animateCards ? 'animate-float' : ''
                  }`} style={{ animationDelay: `${index * 200}ms` }}>
                    <div className={`w-full h-40 bg-gradient-to-br ${step.bgColor} rounded-2xl flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
                      <step.icon className="h-20 w-20 text-primary/60 group-hover:text-primary transition-colors duration-300" />
                      {/* Floating particles */}
                      <div className="absolute top-2 left-2 w-2 h-2 bg-primary/30 rounded-full animate-bounce" />
                      <div className="absolute bottom-3 right-3 w-3 h-3 bg-brand-saffron/40 rounded-full animate-bounce delay-300" />
                      <div className="absolute top-1/2 right-2 w-1 h-1 bg-green-500/50 rounded-full animate-bounce delay-700" />
                    </div>
                    <div className="mt-6 text-center">
                      <div className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Quality Metric</div>
                      <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">{step.metric}</div>
                      <div className="text-sm text-muted-foreground">{step.metricLabel}</div>
                      
                      {/* Progress bar */}
                      <div className="mt-4 w-full bg-secondary rounded-full h-2">
                        <div 
                          className={`h-2 bg-gradient-to-r ${step.color} rounded-full transition-all duration-1000 delay-${index * 200}`}
                          style={{ width: step.metric }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Certifications */}
        <div className="mt-24 text-center">
          <h3 className="font-display text-3xl font-bold text-foreground mb-4">
            Certified & Compliant
          </h3>
          <p className="text-muted-foreground mb-12 text-lg">
            Internationally recognized certifications ensuring quality and safety
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
            {certifications.map((cert, index) => (
              <div 
                key={index}
                className={`group p-6 bg-gradient-to-br from-card to-secondary/30 border border-border rounded-2xl text-center hover:shadow-xl hover:shadow-primary/20 transition-all duration-500 hover:scale-110 cursor-pointer ${
                  animateCards ? 'animate-fade-in-up' : ''
                }`}
                style={{ animationDelay: `${1000 + (index * 100)}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-brand-saffron/20 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <cert.icon className="h-6 w-6 text-primary group-hover:text-brand-saffron transition-colors duration-300" />
                </div>
                <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {cert.name}
                </div>
                <div className="w-full h-1 bg-gradient-to-r from-primary to-brand-saffron rounded-full mt-3 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">10,000+</div>
              <div className="text-sm text-green-700">Successful Exports</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-sm text-blue-700">Countries Served</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">99.8%</div>
              <div className="text-sm text-purple-700">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedQualitySection;