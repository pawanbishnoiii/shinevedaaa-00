import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, Leaf, TrendingUp, Shield, Phone, Mail, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const JoinFarmerNetwork = () => {
  const [formData, setFormData] = useState({
    farmer_name: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    land_size_acres: '',
    farming_experience_years: '',
    farming_type: 'traditional',
    current_crops: '',
    interested_crops: '',
    has_irrigation: false,
    has_storage: false,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        land_size_acres: formData.land_size_acres ? parseFloat(formData.land_size_acres) : null,
        farming_experience_years: formData.farming_experience_years ? parseInt(formData.farming_experience_years) : null,
        current_crops: formData.current_crops.split(',').map(crop => crop.trim()).filter(Boolean),
        interested_crops: formData.interested_crops.split(',').map(crop => crop.trim()).filter(Boolean)
      };

      const { error } = await supabase
        .from('farmer_network')
        .insert([submitData]);

      if (error) throw error;

      toast.success('Application submitted successfully! We will contact you soon.');
      
      // Reset form
      setFormData({
        farmer_name: '',
        contact_email: '',
        contact_phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        land_size_acres: '',
        farming_experience_years: '',
        farming_type: 'traditional',
        current_crops: '',
        interested_crops: '',
        has_irrigation: false,
        has_storage: false,
        notes: ''
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16 bg-gradient-to-br from-green-50 to-amber-50 dark:from-green-950/20 dark:to-amber-950/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Join Our Farmer Network
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Partner with ShineVeda and connect your farm to global markets. Get fair pricing, 
            technical support, and access to international buyers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="text-center h-full">
              <CardContent className="pt-6">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Better Prices</h3>
                <p className="text-muted-foreground">
                  Get fair market prices for your produce with direct access to international buyers.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="text-center h-full">
              <CardContent className="pt-6">
                <Leaf className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Technical Support</h3>
                <p className="text-muted-foreground">
                  Access to modern farming techniques, quality standards, and best practices.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="text-center h-full">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure Contracts</h3>
                <p className="text-muted-foreground">
                  Long-term partnerships with guaranteed procurement and transparent pricing.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Farmer Registration Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="farmer_name">Full Name *</Label>
                    <Input
                      id="farmer_name"
                      value={formData.farmer_name}
                      onChange={(e) => handleInputChange('farmer_name', e.target.value)}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Phone Number *</Label>
                    <Input
                      id="contact_phone"
                      value={formData.contact_phone}
                      onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                      required
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">Email Address *</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => handleInputChange('contact_email', e.target.value)}
                    required
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Farm Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                    placeholder="Enter your complete farm address"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      required
                      placeholder="State"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      required
                      placeholder="Pincode"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="land_size_acres">Farm Size (Acres)</Label>
                    <Input
                      id="land_size_acres"
                      type="number"
                      step="0.1"
                      value={formData.land_size_acres}
                      onChange={(e) => handleInputChange('land_size_acres', e.target.value)}
                      placeholder="Enter farm size in acres"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="farming_experience_years">Farming Experience (Years)</Label>
                    <Input
                      id="farming_experience_years"
                      type="number"
                      value={formData.farming_experience_years}
                      onChange={(e) => handleInputChange('farming_experience_years', e.target.value)}
                      placeholder="Years of farming experience"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="farming_type">Farming Type</Label>
                  <Select value={formData.farming_type} onValueChange={(value) => handleInputChange('farming_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select farming type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="traditional">Traditional</SelectItem>
                      <SelectItem value="organic">Organic</SelectItem>
                      <SelectItem value="modern">Modern/Scientific</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="current_crops">Current Crops (comma separated)</Label>
                    <Textarea
                      id="current_crops"
                      value={formData.current_crops}
                      onChange={(e) => handleInputChange('current_crops', e.target.value)}
                      placeholder="e.g., Onion, Wheat, Jeera, Mustard"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interested_crops">Interested in Growing (comma separated)</Label>
                    <Textarea
                      id="interested_crops"
                      value={formData.interested_crops}
                      onChange={(e) => handleInputChange('interested_crops', e.target.value)}
                      placeholder="e.g., Peanuts, Chickpeas, Guar"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="has_irrigation"
                      checked={formData.has_irrigation}
                      onCheckedChange={(checked) => handleInputChange('has_irrigation', checked)}
                    />
                    <Label htmlFor="has_irrigation">Have Irrigation Facility</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="has_storage"
                      checked={formData.has_storage}
                      onCheckedChange={(checked) => handleInputChange('has_storage', checked)}
                    />
                    <Label htmlFor="has_storage">Have Storage Facility</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Information</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any additional information you'd like to share..."
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default JoinFarmerNetwork;