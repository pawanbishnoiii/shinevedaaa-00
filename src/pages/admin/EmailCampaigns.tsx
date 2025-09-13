import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Send, Play, Pause, BarChart3, Mail } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function EmailCampaigns() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignContent, setCampaignContent] = useState('');
  const [recipientType, setRecipientType] = useState('all');
  const [templateId, setTemplateId] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch campaigns
  const { data: campaigns = [], isLoading: loadingCampaigns } = useQuery({
    queryKey: ['email-campaigns', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,subject.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Fetch email templates
  const { data: templates = [] } = useQuery({
    queryKey: ['email-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('is_active', true)
        .order('template_key');
      if (error) throw error;
      return data;
    },
  });

  // Create campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: async (campaignData: {
      name: string;
      subject: string;
      content: string;
      recipient_type: string;
      template_id?: string;
    }) => {
      const { data, error } = await supabase
        .from('email_campaigns')
        .insert({
          ...campaignData,
          template_id: campaignData.template_id || null,
          status: 'draft'
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-campaigns'] });
      toast({
        title: "Campaign Created",
        description: "Email campaign has been created successfully.",
      });
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Campaign Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Send campaign mutation
  const sendCampaignMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      // Get campaign details
      const { data: campaign, error: campaignError } = await supabase
        .from('email_campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (campaignError) throw campaignError;

      // Get recipients based on recipient_type
      let recipients: string[] = [];
      
      if (campaign.recipient_type === 'subscribers') {
        const { data: subscribers, error: subscribersError } = await supabase
          .from('newsletter_subscriptions')
          .select('email')
          .eq('status', 'active');
        
        if (subscribersError) throw subscribersError;
        recipients = subscribers.map(s => s.email);
      } else if (campaign.recipient_type === 'users') {
        const { data: users, error: usersError } = await supabase
          .from('profiles')
          .select('email');
        
        if (usersError) throw usersError;
        recipients = users.map(u => u.email);
      } else {
        // Get all emails (subscribers + users)
        const [subscribersResult, usersResult] = await Promise.all([
          supabase.from('newsletter_subscriptions').select('email').eq('status', 'active'),
          supabase.from('profiles').select('email')
        ]);

        const allEmails = [
          ...(subscribersResult.data || []).map(s => s.email),
          ...(usersResult.data || []).map(u => u.email)
        ];
        recipients = [...new Set(allEmails)]; // Remove duplicates
      }

      if (recipients.length === 0) {
        throw new Error('No recipients found for this campaign');
      }

      // Update campaign status
      await supabase
        .from('email_campaigns')
        .update({ 
          status: 'sending',
          total_recipients: recipients.length,
          sent_at: new Date().toISOString()
        })
        .eq('id', campaignId);

      // Send emails
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: recipients,
          subject: campaign.subject,
          html: campaign.content,
          template_id: campaign.template_id,
          campaign_id: campaignId
        }
      });

      if (error) throw error;

      // Update campaign with results
      await supabase
        .from('email_campaigns')
        .update({ 
          status: 'sent',
          delivered_count: data.total_sent
        })
        .eq('id', campaignId);

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['email-campaigns'] });
      toast({
        title: "Campaign Sent!",
        description: `Campaign sent to ${data.total_sent} recipients. ${data.total_failed} failed.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Campaign Send Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setCampaignName('');
    setCampaignSubject('');
    setCampaignContent('');
    setRecipientType('all');
    setTemplateId('');
  };

  const handleCreateCampaign = () => {
    if (!campaignName || !campaignSubject || !campaignContent) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createCampaignMutation.mutate({
      name: campaignName,
      subject: campaignSubject,
      content: campaignContent,
      recipient_type: recipientType,
      template_id: templateId || undefined,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'outline',
      sending: 'default',
      sent: 'secondary',
      paused: 'destructive',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage email marketing campaigns.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Email Campaign</DialogTitle>
              <DialogDescription>
                Create a new email campaign to send to your subscribers and users.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Campaign Name</label>
                <Input
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g., Monthly Newsletter - November 2024"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email Template (Optional)</label>
                <Select value={templateId} onValueChange={setTemplateId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Template</SelectItem>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.template_key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Recipients</label>
                <Select value={recipientType} onValueChange={setRecipientType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All (Subscribers + Users)</SelectItem>
                    <SelectItem value="subscribers">Newsletter Subscribers Only</SelectItem>
                    <SelectItem value="users">Registered Users Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  value={campaignSubject}
                  onChange={(e) => setCampaignSubject(e.target.value)}
                  placeholder="Email subject line"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={campaignContent}
                  onChange={(e) => setCampaignContent(e.target.value)}
                  placeholder="Email content (HTML supported)"
                  rows={12}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateCampaign}
                  disabled={createCampaignMutation.isPending}
                >
                  {createCampaignMutation.isPending ? "Creating..." : "Create Campaign"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Delivered</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingCampaigns ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading campaigns...
                  </TableCell>
                </TableRow>
              ) : campaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No campaigns found. Create your first campaign to get started.
                  </TableCell>
                </TableRow>
              ) : (
                campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>{campaign.subject}</TableCell>
                    <TableCell>{campaign.recipient_type}</TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell>{campaign.total_recipients || 0}</TableCell>
                    <TableCell>{campaign.delivered_count || 0}</TableCell>
                    <TableCell>{new Date(campaign.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {campaign.status === 'draft' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => sendCampaignMutation.mutate(campaign.id)}
                            disabled={sendCampaignMutation.isPending}
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Send
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Analytics
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}