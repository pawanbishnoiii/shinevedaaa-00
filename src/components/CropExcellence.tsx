import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Wheat, 
  Droplets, 
  Award, 
  Package, 
  MapPin, 
  Calendar,
  Thermometer,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Crop {
  id: string;
  name: string;
  hindiName: string;
  region: string;
  season: string;
  description: string;
  features: string[];
  specifications: {
    moisture: string;
    purity: string;
    packaging: string;
    shelfLife: string;
  };
  exportGrades: string[];
  image: string;
  color: string;
  bgColor: string;
}

const crops: Crop[] = [
  {
    id: 'onions',
    name: 'Onions',
    hindiName: 'प्याज',
    region: 'Rajasthan (Sikar & surrounding)',
    season: 'Rabi (Nov-Apr)',
    description: 'Premium export-grade onions with excellent storage life and uniform size grading.',
    features: [
      'Export quality grading',
      '50kg mesh bag packing',
      'Cold storage facilities',
      'Uniform size sorting'
    ],
    specifications: {
      moisture: '12-14%',
      purity: '98%+',
      packaging: '50kg mesh bags',
      shelfLife: '6-8 months'
    },
    exportGrades: ['40-60mm', '60-80mm', '80mm+'],
    image: '/data/img/sikar-onion-harvest.jpg',
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900'
  },
  {
    id: 'jeera',
    name: 'Cumin (Jeera)',
    hindiName: 'जीरा',
    region: 'Sikar, Rajasthan',
    season: 'Rabi (Nov-May)',
    description: 'Premium Sikar jeera known for its superior aroma, oil content, and export quality.',
    features: [
      'High oil content',
      'Superior aroma profile',
      'Machine cleaned',
      'Moisture controlled'
    ],
    specifications: {
      moisture: '8-10%',
      purity: '99%+',
      packaging: '25kg jute bags',
      shelfLife: '2-3 years'
    },
    exportGrades: ['Singapore Quality', 'Europe Quality', 'Machine Clean'],
    image: '/data/img/sikar-jeera-seeds.jpg',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100 dark:bg-amber-900'
  },
  {
    id: 'guar',
    name: 'Guar Gum',
    hindiName: 'ग्वार गम',
    region: 'Rajasthan',
    season: 'Kharif (Jun-Oct)',
    description: 'High-purity guar gum for industrial and food applications with strict quality controls.',
    features: [
      'Food grade purity',
      'Industrial applications',
      'Viscosity tested',
      'Microbial control'
    ],
    specifications: {
      moisture: '12% max',
      purity: '85%+ viscosity',
      packaging: '25kg HDPE bags',
      shelfLife: '2 years'
    },
    exportGrades: ['Food Grade', 'Industrial Grade', 'Pharmaceutical Grade'],
    image: '/data/img/guar-gum-processing.jpg',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900'
  }
];

const CropExcellence: React.FC = () => {
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
          <Wheat className="h-4 w-4 mr-2" />
          Crop Excellence — Fasal Uttamta
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
          Premium Crop Portfolio
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Discover our diverse range of high-quality crops grown by partner farmers 
          across Rajasthan and Punjab, meeting international export standards.
        </p>
      </motion.div>

      {/* Crops Grid */}
      <div className="space-y-8">
        {crops.map((crop, index) => (
          <motion.div
            key={crop.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className={`grid md:grid-cols-2 gap-0 ${index % 2 === 1 ? 'md:grid-flow-col-dense' : ''}`}>
                {/* Image Section */}
                <div className={`aspect-video md:aspect-square overflow-hidden ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <img
                    src={crop.image}
                    alt={`${crop.name} — ${crop.region} export quality`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col justify-center">
                  <div className="space-y-6">
                    {/* Header */}
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className={`${crop.bgColor} ${crop.color} border-0`}>
                          <Wheat className="h-4 w-4 mr-1" />
                          Export Quality
                        </Badge>
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{crop.region}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-bold mb-2">
                        {crop.name}
                        <span className="text-lg font-normal text-muted-foreground ml-3">
                          {crop.hindiName}
                        </span>
                      </h3>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {crop.season}
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        {crop.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        Key Features
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {crop.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                            <span className="text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="bg-muted/30 rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Package className="h-4 w-4 text-primary" />
                        Specifications
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Moisture:</span>
                          <span className="font-medium ml-2">{crop.specifications.moisture}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Purity:</span>
                          <span className="font-medium ml-2">{crop.specifications.purity}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Packaging:</span>
                          <span className="font-medium ml-2">{crop.specifications.packaging}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Shelf Life:</span>
                          <span className="font-medium ml-2">{crop.specifications.shelfLife}</span>
                        </div>
                      </div>
                    </div>

                    {/* Export Grades */}
                    <div>
                      <h4 className="font-semibold mb-3">Export Grades Available</h4>
                      <div className="flex flex-wrap gap-2">
                        {crop.exportGrades.map((grade, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {grade}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/contact">
                        <Package className="h-4 w-4 mr-2" />
                        Inquire About {crop.name}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quality Promise */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-green-50 to-amber-50 dark:from-green-950/20 dark:to-amber-950/20 rounded-2xl p-8 md:p-12 text-center"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold">
            Quality Promise — गुणवत्ता की गारंटी
          </h3>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            Every crop in our portfolio undergoes rigorous quality testing and grading. 
            From soil health monitoring to post-harvest handling, we ensure that only 
            the finest produce reaches global markets under the ShineVeda name.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <Thermometer className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Quality Testing</h4>
              <p className="text-sm text-muted-foreground">Lab-certified quality parameters</p>
            </div>
            <div className="text-center">
              <Package className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Export Packaging</h4>
              <p className="text-sm text-muted-foreground">International packaging standards</p>
            </div>
            <div className="text-center">
              <Award className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Certifications</h4>
              <p className="text-sm text-muted-foreground">ISO & FSSAI certified processes</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CropExcellence;