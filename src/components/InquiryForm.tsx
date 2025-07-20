import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Send, MessageSquare, Package, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface InquiryFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  inquiry_type: string;
  product_interest?: string;
  message: string;
}

const InquiryForm = () => {
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    inquiry_type: 'general',
    product_interest: '',
    message: ''
  });

  const submitInquiryMutation = useMutation({
    mutationFn: async (data: InquiryFormData) => {
      const { error } = await supabase
        .from('inquiries')
        .insert([{
          ...data,
          status: 'new',
          priority: 'normal'
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Inquiry submitted successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        country: '',
        inquiry_type: 'general',
        product_interest: '',
        message: ''
      });
    },
    onError: (error) => {
      toast.error('Failed to submit inquiry: ' + error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitInquiryMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof InquiryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="card-premium">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-brand-sage rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Send Us an Inquiry</CardTitle>
          <CardDescription className="text-lg">
            Get quotes, product information, or discuss your export requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Your company"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="Your country"
              />
            </div>

            {/* Inquiry Type */}
            <div className="space-y-2">
              <Label htmlFor="inquiry_type">Inquiry Type</Label>
              <Select 
                value={formData.inquiry_type} 
                onValueChange={(value) => handleInputChange('inquiry_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select inquiry type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      General Inquiry
                    </div>
                  </SelectItem>
                  <SelectItem value="product_quote">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Product Quote
                    </div>
                  </SelectItem>
                  <SelectItem value="partnership">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Partnership
                    </div>
                  </SelectItem>
                  <SelectItem value="bulk_order">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Bulk Order
                    </div>
                  </SelectItem>
                  <SelectItem value="technical_support">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Technical Support
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Product Interest */}
            <div className="space-y-2">
              <Label htmlFor="product_interest">Product Interest</Label>
              <Input
                id="product_interest"
                value={formData.product_interest}
                onChange={(e) => handleInputChange('product_interest', e.target.value)}
                placeholder="e.g., Basmati Rice, Wheat, Cumin Seeds"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Please provide details about your requirements, quantities, destination, etc."
                required
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full btn-premium"
              disabled={submitInquiryMutation.isPending}
            >
              <Send className="h-4 w-4 mr-2" />
              {submitInquiryMutation.isPending ? 'Sending...' : 'Send Inquiry'}
            </Button>
          </form>

          {/* Quick Contact Options */}
          <div className="pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground mb-4">
              Need immediate assistance?
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://wa.me/918955158794', '_blank')}
              >
                WhatsApp
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = 'tel:+918955158794'}
              >
                Call Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InquiryForm;