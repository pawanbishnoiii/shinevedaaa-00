import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mail, 
  Send, 
  Users, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  BarChart
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

const EmailManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);

  // Email Statistics
  const { data: emailStats, isLoading: statsLoading } = useQuery({
    queryKey: ['email-stats'],
    queryFn: async () => {
      const [subscribers, campaigns, templates, automations] = await Promise.all([
        supabase.from('email_subscribers').select('id, status').eq('status', 'active'),
        supabase.from('email_campaigns').select('id, status, delivered_count, opened_count, clicked_count'),
        supabase.from('email_templates').select('id, is_active').eq('is_active', true),
        supabase.from('email_automation_rules').select('id, is_active').eq('is_active', true)
      ]);

      const totalDelivered = campaigns.data?.reduce((sum, c) => sum + (c.delivered_count || 0), 0) || 0;
      const totalOpened = campaigns.data?.reduce((sum, c) => sum + (c.opened_count || 0), 0) || 0;
      const totalClicked = campaigns.data?.reduce((sum, c) => sum + (c.clicked_count || 0), 0) || 0;

      return {
        subscribers: subscribers.data?.length || 0,
        campaigns: campaigns.data?.length || 0,
        templates: templates.data?.length || 0,
        automations: automations.data?.length || 0,
        openRate: totalDelivered > 0 ? ((totalOpened / totalDelivered) * 100).toFixed(1) : '0',
        clickRate: totalDelivered > 0 ? ((totalClicked / totalDelivered) * 100).toFixed(1) : '0'
      };
    }
  });

  // Recent Email Campaigns
  const { data: recentCampaigns } = useQuery({
    queryKey: ['recent-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  // Email Templates
  const { data: emailTemplates } = useQuery({
    queryKey: ['email-templates-management'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // SMTP Configurations
  const { data: smtpConfigs } = useQuery({
    queryKey: ['smtp-configs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('smtp_configurations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Send Test Email Mutation
  const sendTestEmailMutation = useMutation({
    mutationFn: async ({ to, subject, content }: { to: string; subject: string; content: string }) => {
      const { error } = await supabase.functions.invoke('send-email', {
        body: { to, subject, html: content, text: content }
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Test Email Sent",
        description: "Test email has been sent successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Bulk Email Mutation
  const bulkEmailMutation = useMutation({
    mutationFn: async (campaignData: any) => {
      const { error } = await supabase.functions.invoke('email-automation', {
        body: { 
          trigger_type: 'manual_campaign',
          campaign_data: campaignData 
        }
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Campaign Started",
        description: "Email campaign has been initiated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['email-stats'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendTestEmail = () => {
    const testData = {
      to: 'test@example.com',
      subject: 'Test Email from ShineVeda',
      content: '<h1>Test Email</h1><p>This is a test email from your SMTP configuration.</p>'
    };
    sendTestEmailMutation.mutate(testData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Management</h1>
          <p className="text-muted-foreground">
            Comprehensive email management system with SMTP, campaigns, and automation.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSendTestEmail} disabled={sendTestEmailMutation.isPending}>
            <Send className="w-4 h-4 mr-2" />
            Send Test Email
          </Button>
          <Button onClick={() => setIsCampaignDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="smtp">SMTP</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="text-lg font-bold">{emailStats?.subscribers || 0}</p>
                    <p className="text-xs text-muted-foreground">Subscribers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Send className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="text-lg font-bold">{emailStats?.campaigns || 0}</p>
                    <p className="text-xs text-muted-foreground">Campaigns</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-6 w-6 text-purple-500" />
                  <div>
                    <p className="text-lg font-bold">{emailStats?.templates || 0}</p>
                    <p className="text-xs text-muted-foreground">Templates</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Settings className="h-6 w-6 text-orange-500" />
                  <div>
                    <p className="text-lg font-bold">{emailStats?.automations || 0}</p>
                    <p className="text-xs text-muted-foreground">Automations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Eye className="h-6 w-6 text-cyan-500" />
                  <div>
                    <p className="text-lg font-bold">{emailStats?.openRate || 0}%</p>
                    <p className="text-xs text-muted-foreground">Open Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <BarChart className="h-6 w-6 text-pink-500" />
                  <div>
                    <p className="text-lg font-bold">{emailStats?.clickRate || 0}%</p>
                    <p className="text-xs text-muted-foreground">Click Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Campaigns</CardTitle>
              <CardDescription>Latest email campaigns and their performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCampaigns?.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>
                        <Badge variant={
                          campaign.status === 'sent' ? 'default' : 
                          campaign.status === 'scheduled' ? 'secondary' : 
                          'outline'
                        }>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{campaign.total_recipients || 0}</TableCell>
                      <TableCell>
                        {campaign.total_recipients > 0 ? 
                          ((campaign.opened_count / campaign.total_recipients) * 100).toFixed(1) + '%' : 
                          'N/A'
                        }
                      </TableCell>
                      <TableCell>{format(new Date(campaign.created_at), 'MMM dd, yyyy')}</TableCell>
                    </TableRow>
                  ))}
                  {(!recentCampaigns || recentCampaigns.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        No campaigns found. Create your first campaign to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="smtp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Configurations</CardTitle>
              <CardDescription>
                Manage SMTP settings for sending emails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {smtpConfigs?.map((config) => (
                  <div key={config.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{config.host}:{config.port}</div>
                      <div className="text-sm text-muted-foreground">
                        {config.from_email} • {config.encryption_type.toUpperCase()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {config.is_default && <Badge variant="default">Default</Badge>}
                      {config.is_active ? (
                        <Badge variant="outline">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="w-3 h-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {(!smtpConfigs || smtpConfigs.length === 0) && (
                  <div className="text-center py-8">
                    <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">No SMTP configurations found</p>
                    <p className="text-muted-foreground mb-4">
                      Configure SMTP settings in System Settings to start sending emails.
                    </p>
                    <Button variant="outline">
                      Configure SMTP
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs content can be added similarly */}
      </Tabs>
    </div>
  );
};

export default EmailManagement;
