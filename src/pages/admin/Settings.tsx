import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Save, Globe, Mail, Phone, MapPin, Clock, Users } from 'lucide-react';

interface SettingGroup {
  [key: string]: any;
}

const Settings = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('general');

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*');
      
      if (error) throw error;
      
      // Transform array to object for easier access
      const settingsObj: SettingGroup = {};
      data?.forEach(setting => {
        settingsObj[setting.key] = setting.value;
      });
      
      return settingsObj;
    }
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value, description }: { key: string; value: any; description?: string }) => {
      const { error } = await supabase
        .from('company_settings')
        .upsert({ 
          key, 
          value, 
          description,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Settings updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
    },
    onError: () => {
      toast.error('Failed to update settings');
    }
  });

  const handleSave = (key: string, value: any, description?: string) => {
    updateSettingMutation.mutate({ key, value, description });
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your website and admin panel settings
          </p>
        </div>
        <Button 
          onClick={() => toast.success('Settings saved successfully!')}
          className="bg-primary hover:bg-primary/90"
        >
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Website Settings
              </CardTitle>
              <CardDescription>
                Basic website configuration and metadata
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Site Name</Label>
                  <Input
                    id="site_name"
                    defaultValue={settings?.site_name || 'ShineVeda'}
                    onBlur={(e) => handleSave('site_name', e.target.value, 'Website name displayed in header')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_tagline">Site Tagline</Label>
                  <Input
                    id="site_tagline"
                    defaultValue={settings?.site_tagline || 'Premium Agricultural Exports'}
                    onBlur={(e) => handleSave('site_tagline', e.target.value, 'Brief description of the business')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="site_description">Site Description</Label>
                <Textarea
                  id="site_description"
                  rows={3}
                  defaultValue={settings?.site_description || 'Leading exporter of premium agricultural commodities from Rajasthan to global markets.'}
                  onBlur={(e) => handleSave('site_description', e.target.value, 'Meta description for SEO')}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Feature Toggles</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable_blog">Enable Blog</Label>
                    <Switch
                      id="enable_blog"
                      checked={settings?.enable_blog || false}
                      onCheckedChange={(checked) => handleSave('enable_blog', checked, 'Show/hide blog section')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable_testimonials">Enable Testimonials</Label>
                    <Switch
                      id="enable_testimonials"
                      checked={settings?.enable_testimonials !== false}
                      onCheckedChange={(checked) => handleSave('enable_testimonials', checked, 'Show/hide testimonials section')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable_newsletter">Enable Newsletter</Label>
                    <Switch
                      id="enable_newsletter"
                      checked={settings?.enable_newsletter || false}
                      onCheckedChange={(checked) => handleSave('enable_newsletter', checked, 'Show/hide newsletter signup')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
                    <Switch
                      id="maintenance_mode"
                      checked={settings?.maintenance_mode || false}
                      onCheckedChange={(checked) => handleSave('maintenance_mode', checked, 'Enable maintenance mode for public site')}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Company Information
              </CardTitle>
              <CardDescription>
                Update company details and statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    defaultValue={settings?.company_name || 'ShineVeda Exports'}
                    onBlur={(e) => handleSave('company_name', e.target.value, 'Official company name')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founded_year">Founded Year</Label>
                  <Input
                    id="founded_year"
                    type="number"
                    defaultValue={settings?.founded_year || '2020'}
                    onBlur={(e) => handleSave('founded_year', e.target.value, 'Year company was established')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_mission">Mission Statement</Label>
                <Textarea
                  id="company_mission"
                  rows={3}
                  defaultValue={settings?.company_mission || 'To bridge global markets with premium agricultural commodities while supporting local farmers and sustainable practices.'}
                  onBlur={(e) => handleSave('company_mission', e.target.value, 'Company mission statement')}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Business Statistics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="total_exports">Total Exports (Tons)</Label>
                    <Input
                      id="total_exports"
                      type="number"
                      defaultValue={settings?.total_exports || '10000'}
                      onBlur={(e) => handleSave('total_exports', e.target.value, 'Total exports in tons')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="countries_served">Countries Served</Label>
                    <Input
                      id="countries_served"
                      type="number"
                      defaultValue={settings?.countries_served || '25'}
                      onBlur={(e) => handleSave('countries_served', e.target.value, 'Number of countries served')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="happy_clients">Happy Clients</Label>
                    <Input
                      id="happy_clients"
                      type="number"
                      defaultValue={settings?.happy_clients || '500'}
                      onBlur={(e) => handleSave('happy_clients', e.target.value, 'Number of satisfied clients')}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Manage contact details and business hours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primary_phone">Primary Phone</Label>
                  <Input
                    id="primary_phone"
                    defaultValue={settings?.primary_phone || '+91 89551 58794'}
                    onBlur={(e) => handleSave('primary_phone', e.target.value, 'Main contact phone number')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primary_email">Primary Email</Label>
                  <Input
                    id="primary_email"
                    type="email"
                    defaultValue={settings?.primary_email || 'help@shineveda.in'}
                    onBlur={(e) => handleSave('primary_email', e.target.value, 'Main contact email address')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_address">Business Address</Label>
                <Textarea
                  id="business_address"
                  rows={3}
                  defaultValue={settings?.business_address || 'Sri Ganganagar, Rajasthan, India\nAgricultural Hub of North Rajasthan'}
                  onBlur={(e) => handleSave('business_address', e.target.value, 'Complete business address')}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Business Hours</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weekday_hours">Weekday Hours</Label>
                    <Input
                      id="weekday_hours"
                      defaultValue={settings?.weekday_hours || '9:00 AM - 7:00 PM IST'}
                      onBlur={(e) => handleSave('weekday_hours', e.target.value, 'Monday to Friday business hours')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weekend_hours">Weekend Hours</Label>
                    <Input
                      id="weekend_hours"
                      defaultValue={settings?.weekend_hours || '10:00 AM - 4:00 PM IST'}
                      onBlur={(e) => handleSave('weekend_hours', e.target.value, 'Saturday and Sunday business hours')}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Manage your social media presence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook_url">Facebook</Label>
                  <Input
                    id="facebook_url"
                    placeholder="https://facebook.com/shineveda"
                    defaultValue={settings?.facebook_url || ''}
                    onBlur={(e) => handleSave('facebook_url', e.target.value, 'Facebook page URL')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram_url">Instagram</Label>
                  <Input
                    id="instagram_url"
                    placeholder="https://instagram.com/shineveda"
                    defaultValue={settings?.instagram_url || ''}
                    onBlur={(e) => handleSave('instagram_url', e.target.value, 'Instagram profile URL')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">LinkedIn</Label>
                  <Input
                    id="linkedin_url"
                    placeholder="https://linkedin.com/company/shineveda"
                    defaultValue={settings?.linkedin_url || ''}
                    onBlur={(e) => handleSave('linkedin_url', e.target.value, 'LinkedIn company page URL')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp_number">WhatsApp</Label>
                  <Input
                    id="whatsapp_number"
                    placeholder="+91 89551 58794"
                    defaultValue={settings?.whatsapp_number || '+91 89551 58794'}
                    onBlur={(e) => handleSave('whatsapp_number', e.target.value, 'WhatsApp business number')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Settings
              </CardTitle>
              <CardDescription>
                Configure email automation and notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="default_from_email">Default From Email</Label>
                  <Input
                    id="default_from_email"
                    type="email"
                    defaultValue={settings?.default_from_email || 'noreply@shineveda.in'}
                    onBlur={(e) => handleSave('default_from_email', e.target.value, 'Default email address for outgoing emails')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default_from_name">Default From Name</Label>
                  <Input
                    id="default_from_name"
                    defaultValue={settings?.default_from_name || 'ShineVeda Team'}
                    onBlur={(e) => handleSave('default_from_name', e.target.value, 'Default sender name for outgoing emails')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email_signature">Email Signature</Label>
                <Textarea
                  id="email_signature"
                  rows={4}
                  defaultValue={settings?.email_signature || 'Best regards,\nShineVeda Team\n\nPremium Agricultural Exports\nRajasthan, India\nPhone: +91 89551 58794\nWebsite: https://shineveda.in'}
                  onBlur={(e) => handleSave('email_signature', e.target.value, 'Default email signature')}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Email Notifications</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify_new_inquiry">New Inquiry Notifications</Label>
                    <Switch
                      id="notify_new_inquiry"
                      checked={settings?.notify_new_inquiry !== false}
                      onCheckedChange={(checked) => handleSave('notify_new_inquiry', checked, 'Send email when new inquiry is received')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify_new_subscriber">New Subscriber Notifications</Label>
                    <Switch
                      id="notify_new_subscriber"
                      checked={settings?.notify_new_subscriber !== false}
                      onCheckedChange={(checked) => handleSave('notify_new_subscriber', checked, 'Send email when someone subscribes to newsletter')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto_welcome_email">Auto Welcome Email</Label>
                    <Switch
                      id="auto_welcome_email"
                      checked={settings?.auto_welcome_email !== false}
                      onCheckedChange={(checked) => handleSave('auto_welcome_email', checked, 'Send welcome email to new subscribers')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="inquiry_auto_response">Inquiry Auto Response</Label>
                    <Switch
                      id="inquiry_auto_response"
                      checked={settings?.inquiry_auto_response !== false}
                      onCheckedChange={(checked) => handleSave('inquiry_auto_response', checked, 'Send auto response to new inquiries')}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Email Frequency Limits</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="daily_email_limit">Daily Email Limit</Label>
                    <Input
                      id="daily_email_limit"
                      type="number"
                      defaultValue={settings?.daily_email_limit || '1000'}
                      onBlur={(e) => handleSave('daily_email_limit', e.target.value, 'Maximum emails per day')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hourly_email_limit">Hourly Email Limit</Label>
                    <Input
                      id="hourly_email_limit"
                      type="number"
                      defaultValue={settings?.hourly_email_limit || '100'}
                      onBlur={(e) => handleSave('hourly_email_limit', e.target.value, 'Maximum emails per hour')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email_delay_seconds">Email Delay (seconds)</Label>
                    <Input
                      id="email_delay_seconds"
                      type="number"
                      defaultValue={settings?.email_delay_seconds || '1'}
                      onBlur={(e) => handleSave('email_delay_seconds', e.target.value, 'Delay between emails in seconds')}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Technical and SEO configurations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="google_analytics">Google Analytics ID</Label>
                <Input
                  id="google_analytics"
                  placeholder="G-XXXXXXXXXX"
                  defaultValue={settings?.google_analytics || ''}
                  onBlur={(e) => handleSave('google_analytics', e.target.value, 'Google Analytics tracking ID')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_keywords">Meta Keywords</Label>
                <Textarea
                  id="meta_keywords"
                  rows={2}
                  placeholder="agricultural exports, rajasthan, premium commodities"
                  defaultValue={settings?.meta_keywords || ''}
                  onBlur={(e) => handleSave('meta_keywords', e.target.value, 'SEO meta keywords')}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-lg font-semibold">System Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="items_per_page">Items Per Page</Label>
                    <Input
                      id="items_per_page"
                      type="number"
                      defaultValue={settings?.items_per_page || '10'}
                      onBlur={(e) => handleSave('items_per_page', parseInt(e.target.value), 'Default pagination size')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max_file_size">Max File Size (MB)</Label>
                    <Input
                      id="max_file_size"
                      type="number"
                      defaultValue={settings?.max_file_size || '10'}
                      onBlur={(e) => handleSave('max_file_size', parseInt(e.target.value), 'Maximum upload file size')}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;