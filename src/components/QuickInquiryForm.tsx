import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Send, MessageSquare, Mail, Phone } from 'lucide-react';

const quickInquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  company_name: z.string().optional(),
  quantity: z.string().min(1, 'Quantity is required'),
  quantity_unit: z.string().min(1, 'Unit is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type QuickInquiryFormData = z.infer<typeof quickInquirySchema>;

interface QuickInquiryFormProps {
  product: {
    id: string;
    name: string;
    price_range?: string;
    minimum_order_quantity?: string;
  };
  onSuccess?: () => void;
}

const QuickInquiryForm: React.FC<QuickInquiryFormProps> = ({ product, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<QuickInquiryFormData>({
    resolver: zodResolver(quickInquirySchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company_name: '',
      quantity: '',
      quantity_unit: 'kg',
      message: `I am interested in ${product.name}. Please provide detailed quotation and availability.`,
    }
  });

  const submitInquiryMutation = useMutation({
    mutationFn: async (data: QuickInquiryFormData) => {
      const { error } = await supabase
        .from('inquiries')
        .insert([{
          name: data.name,
          email: data.email,
          phone: data.phone,
          company_name: data.company_name,
          product_id: product.id,
          product_name: product.name,
          quantity: data.quantity,
          quantity_unit: data.quantity_unit,
          message: data.message,
          inquiry_type: 'product_inquiry',
          priority: 'medium',
          country: 'India'
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Inquiry sent successfully! We will contact you soon.');
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error('Failed to send inquiry: ' + error.message);
    }
  });

  const onSubmit = (data: QuickInquiryFormData) => {
    setIsSubmitting(true);
    submitInquiryMutation.mutate(data);
    setIsSubmitting(false);
  };

  const handleWhatsAppInquiry = () => {
    const formData = form.getValues();
    const message = `Hi! I'm interested in ${product.name}.

Name: ${formData.name}
Company: ${formData.company_name || 'Individual'}
Email: ${formData.email}
Phone: ${formData.phone}
Quantity: ${formData.quantity} ${formData.quantity_unit}
Product: ${product.name}
Price Range: ${product.price_range || 'Please quote'}
MOQ: ${product.minimum_order_quantity || 'Please advise'}

Message: ${formData.message}

Address: Rajasthan, India

Please provide detailed quote and availability.`;

    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailInquiry = () => {
    const formData = form.getValues();
    const subject = `Product Inquiry: ${product.name}`;
    const body = `Dear Team,

I am interested in your product: ${product.name}

Contact Details:
Name: ${formData.name}
Company: ${formData.company_name || 'Individual'}
Email: ${formData.email}
Phone: ${formData.phone}

Requirement:
Quantity: ${formData.quantity} ${formData.quantity_unit}
Message: ${formData.message}

Please provide detailed quotation including:
- Price per unit
- Minimum order quantity
- Delivery timeline
- Payment terms
- Packaging details

Looking forward to your response.

Best regards,
${formData.name}`;

    const mailtoUrl = `mailto:contact@shineveda.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Quick Inquiry for {product.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Required Quantity *</FormLabel>
                    <FormControl>
                      <Input placeholder="1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="kg">KG</SelectItem>
                        <SelectItem value="ton">Ton</SelectItem>
                        <SelectItem value="pieces">Pieces</SelectItem>
                        <SelectItem value="liter">Liter</SelectItem>
                        <SelectItem value="gram">Gram</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message *</FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={3}
                      placeholder="Please provide details about your requirements..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-3 pt-2">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Inquiry
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                onClick={handleWhatsAppInquiry}
                className="w-full"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                onClick={handleEmailInquiry}
                className="w-full"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>

            <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
              📍 <strong>Our Address:</strong> Rajasthan, India
              <br />
              📞 <strong>Phone:</strong> +91 89551 58794 | ✉️ <strong>Email:</strong> help@shineveda.in
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default QuickInquiryForm;