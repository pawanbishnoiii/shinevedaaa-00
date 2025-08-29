import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  PenTool,
  Sparkles,
  CheckCircle
} from 'lucide-react';

interface StoryFormData {
  farmer_name: string;
  contact_email: string;
  contact_phone: string;
  location: string;
  state: string;
  story_title: string;
  story_content: string;
  farming_experience: string;
  crop_types: string;
  success_metrics: string;
}

const SubmitStoryForm: React.FC = () => {
  const [formData, setFormData] = useState<StoryFormData>({
    farmer_name: '',
    contact_email: '',
    contact_phone: '',
    location: '',
    state: '',
    story_title: '',
    story_content: '',
    farming_experience: '',
    crop_types: '',
    success_metrics: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitMutation = useMutation({
    mutationFn: async (data: StoryFormData) => {
      const submissionData = {
        ...data,
        crop_types: data.crop_types.split(',').map(crop => crop.trim()).filter(Boolean),
        success_metrics: data.success_metrics ? JSON.parse(`{"metrics": "${data.success_metrics}"}`) : {}
      };

      const { error } = await supabase
        .from('story_submissions')
        .insert([submissionData]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Story submitted successfully! We will review it and get back to you.');
      setIsSubmitted(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          farmer_name: '',
          contact_email: '',
          contact_phone: '',
          location: '',
          state: '',
          story_title: '',
          story_content: '',
          farming_experience: '',
          crop_types: '',
          success_metrics: ''
        });
        setIsSubmitted(false);
      }, 3000);
    },
    onError: (error) => {
      console.error('Error submitting story:', error);
      toast.error('Failed to submit story. Please try again.');
    }
  });

  const handleInputChange = (field: keyof StoryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">
                Story Submitted Successfully!
              </h3>
              <p className="text-green-700 dark:text-green-300">
                Thank you for sharing your farming journey. Our team will review your story 
                and contact you within 2-3 business days.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Badge variant="secondary" className="mb-4">
          <PenTool className="h-4 w-4 mr-2" />
          Submit Your Story — अपनी कहानी साझा करें
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
          Share Your Farming Success
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Inspire other farmers by sharing your journey, challenges overcome, 
          and successes achieved. Your story could be featured on our platform.
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Tell Us Your Story
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="farmer_name">Full Name *</Label>
                    <Input
                      id="farmer_name"
                      value={formData.farmer_name}
                      onChange={(e) => handleInputChange('farmer_name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_email">Email Address *</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_phone">Phone Number</Label>
                    <Input
                      id="contact_phone"
                      type="tel"
                      value={formData.contact_phone}
                      onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                      placeholder="+91 12345 67890"
                    />
                  </div>
                  <div>
                    <Label htmlFor="farming_experience">Years of Farming Experience</Label>
                    <Input
                      id="farming_experience"
                      value={formData.farming_experience}
                      onChange={(e) => handleInputChange('farming_experience', e.target.value)}
                      placeholder="e.g., 15 years"
                    />
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Location Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Village/City *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Enter village or city name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="Enter state name"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Farming Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Farming Details</h3>
                <div>
                  <Label htmlFor="crop_types">Crops You Grow (comma-separated)</Label>
                  <Input
                    id="crop_types"
                    value={formData.crop_types}
                    onChange={(e) => handleInputChange('crop_types', e.target.value)}
                    placeholder="e.g., Onions, Cumin, Wheat, Guar"
                  />
                </div>
              </div>

              {/* Story Content */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Your Story</h3>
                <div>
                  <Label htmlFor="story_title">Story Title *</Label>
                  <Input
                    id="story_title"
                    value={formData.story_title}
                    onChange={(e) => handleInputChange('story_title', e.target.value)}
                    placeholder="Give your story an inspiring title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="story_content">Tell Your Story *</Label>
                  <Textarea
                    id="story_content"
                    value={formData.story_content}
                    onChange={(e) => handleInputChange('story_content', e.target.value)}
                    placeholder="Share your farming journey, challenges faced, techniques used, and success achieved. Include specific details about your experience with ShineVeda if applicable."
                    rows={8}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="success_metrics">Success Metrics (Optional)</Label>
                  <Textarea
                    id="success_metrics"
                    value={formData.success_metrics}
                    onChange={(e) => handleInputChange('success_metrics', e.target.value)}
                    placeholder="Share specific achievements: increased income, improved yield, land expansion, awards received, etc."
                    rows={3}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <Button
                  type="submit"
                  size="lg"
                  disabled={submitMutation.isPending}
                  className="min-w-48"
                >
                  {submitMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit My Story
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Information Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mt-8"
        >
          <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                  What Happens Next?
                </h4>
                <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <p>• Our team reviews all submissions within 2-3 business days</p>
                  <p>• Selected stories are featured on our website and social media</p>
                  <p>• Featured farmers receive recognition and potential collaboration opportunities</p>
                  <p>• All submissions help us understand farmer needs and improve our services</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SubmitStoryForm;