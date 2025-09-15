import { CheckCircle, Truck, Shield, Award, Thermometer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const qualitySteps = [
  {
    id: 1,
    title: "Farm Selection",
    description: "Handpicked from premium farms in Sri Ganganagar with ideal soil conditions",
    icon: CheckCircle,
    details: ["Soil quality assessment", "Farmer partnerships", "Organic certification"]
  },
  {
    id: 2,
    title: "Harvest Quality Check",
    description: "Rigorous quality control at the point of harvest with expert grading",
    icon: Award,
    details: ["Moisture content testing", "Visual inspection", "Size grading"]
  },
  {
    id: 3,
    title: "Processing & Cleaning",
    description: "Advanced cleaning and processing using state-of-the-art machinery",
    icon: Shield,
    details: ["Machine cleaning", "Foreign matter removal", "Quality sorting"]
  },
  {
    id: 4,
    title: "Premium Packaging",
    description: "Heavy-duty corrugated boxes and specialized packaging for international shipping",
    icon: Truck,
    details: ["Moisture-proof packaging", "Export-grade materials", "Custom labeling"]
  },
  {
    id: 5,
    title: "Cold Chain & Logistics",
    description: "Temperature-controlled storage and refrigerated container shipping",
    icon: Thermometer,
    details: ["Cold storage facilities", "Refrigerated transport", "Global logistics"]
  }
];

const certifications = [
  "ISO 22000:2018",
  "HACCP Certified",
  "FSSAI Licensed",
  "Export License",
  "Phytosanitary Certificate",
  "Origin Certificate"
];

const QualitySection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-secondary/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
            Quality Assurance
          </Badge>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
            Our 5-Point{" "}
            <span className="text-gradient">Quality</span>
            <br />
            Promise
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From farm to your doorstep, every product undergoes our rigorous 
            5-step quality assurance process, ensuring international standards at every stage.
          </p>
        </div>

        {/* Quality Process Timeline */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-20 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary via-brand-saffron to-primary opacity-30" />

          <div className="space-y-8 lg:space-y-16">
            {qualitySteps.map((step, index) => (
              <div 
                key={step.id}
                className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Content Card */}
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                  <Card className="card-premium max-w-md mx-auto lg:mx-0">
                    <CardContent className="p-8">
                      <div className={`flex items-center gap-4 mb-4 ${
                        index % 2 === 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'
                      }`}>
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-brand-saffron rounded-xl flex items-center justify-center">
                          <step.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Badge variant="outline" className="text-xs mb-2 border-primary/20 text-primary">
                            Step {step.id}
                          </Badge>
                          <h3 className="font-display text-xl font-bold text-foreground">
                            {step.title}
                          </h3>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {step.description}
                      </p>
                      
                      <ul className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Center Circle */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-brand-saffron rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">{step.id}</span>
                  </div>
                  {/* Pulse Animation */}
                  <div className="absolute inset-0 w-16 h-16 bg-primary/30 rounded-full animate-ping" />
                </div>

                {/* Visual Element */}
                <div className="flex-1">
                  <div className="max-w-md mx-auto lg:mx-0 p-8 bg-gradient-to-br from-card to-secondary/50 rounded-2xl border border-border">
                    <div className="w-full h-32 bg-gradient-to-br from-primary/10 to-brand-saffron/10 rounded-xl flex items-center justify-center">
                      <step.icon className="h-16 w-16 text-primary/60" />
                    </div>
                    <div className="mt-4 text-center">
                      <div className="font-semibold text-foreground">Quality Metric</div>
                      <div className="text-2xl font-bold text-primary">99.8%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-20 text-center">
          <h3 className="font-display text-2xl font-bold text-foreground mb-8">
            Certified & Compliant
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {certifications.map((cert, index) => (
              <div 
                key={index}
                className="p-4 bg-card border border-border rounded-xl text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div className="text-sm font-medium text-foreground">{cert}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QualitySection;