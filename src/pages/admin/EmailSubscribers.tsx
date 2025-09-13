import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Mail, Users, UserCheck, UserX, Download, Send } from 'lucide-react';
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

export default function EmailSubscribers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [emailTemplate, setEmailTemplate] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch subscribers
  const { data: subscribers = [], isLoading: loadingSubscribers } = useQuery({
    queryKey: ['newsletter-subscribers', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`email.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`);
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

  // Statistics
  const stats = {
    total: subscribers.length,
    active: subscribers.filter(s => s.status === 'active').length,
    unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length,
    bounced: subscribers.filter(s => s.status === 'bounced').length,
  };

  // Send email mutation
  const sendEmailMutation = useMutation({
    mutationFn: async ({ recipients, subject, content, template_id }: {
      recipients: string[];
      subject: string;
      content: string;
      template_id?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: recipients,
          subject,
          html: content,
          template_id,
        }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Email Sent Successfully!",
        description: `Sent to ${data.total_sent} subscribers. ${data.total_failed} failed.`,
      });
      setIsComposeOpen(false);
      setEmailSubject('');
      setEmailContent('');
      setEmailTemplate('');
      setSelectedSubscribers([]);
    },
    onError: (error) => {
      toast({
        title: "Email Sending Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update subscriber status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update({ 
          status,
          unsubscribed_at: status === 'unsubscribed' ? new Date().toISOString() : null
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-subscribers'] });
      toast({
        title: "Status Updated",
        description: "Subscriber status has been updated successfully.",
      });
    },
  });

  const handleSendEmail = () => {
    if (!emailSubject || !emailContent) {
      toast({
        title: "Missing Information",
        description: "Please provide both subject and content for the email.",
        variant: "destructive",
      });
      return;
    }

    const recipients = selectedSubscribers.length > 0 
      ? selectedSubscribers 
      : subscribers.filter(s => s.status === 'active').map(s => s.email);

    if (recipients.length === 0) {
      toast({
        title: "No Recipients",
        description: "No active subscribers to send emails to.",
        variant: "destructive",
      });
      return;
    }

    sendEmailMutation.mutate({
      recipients,
      subject: emailSubject,
      content: emailContent,
      template_id: emailTemplate || undefined,
    });
  };

  const handleExportSubscribers = () => {
    const csvContent = [
      ['Email', 'Name', 'Status', 'Subscription Date', 'Source'].join(','),
      ...subscribers.map(sub => [
        sub.email,
        sub.name || '',
        sub.status,
        new Date(sub.created_at).toLocaleDateString(),
        sub.subscription_source || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      unsubscribed: 'secondary',
      bounced: 'destructive',
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
          <h1 className="text-3xl font-bold tracking-tight">Email Subscribers</h1>
          <p className="text-muted-foreground">
            Manage your newsletter subscribers and send email campaigns.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportSubscribers}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
            <DialogTrigger asChild>
              <Button>
                <Send className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Compose Email</DialogTitle>
                <DialogDescription>
                  Send an email to {selectedSubscribers.length > 0 ? `${selectedSubscribers.length} selected subscribers` : 'all active subscribers'}.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email Template (Optional)</label>
                  <Select value={emailTemplate} onValueChange={setEmailTemplate}>
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
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Email subject"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    placeholder="Email content (HTML supported)"
                    rows={10}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSendEmail}
                    disabled={sendEmailMutation.isPending}
                  >
                    {sendEmailMutation.isPending ? "Sending..." : "Send Email"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unsubscribed</CardTitle>
            <UserX className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.unsubscribed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounced</CardTitle>
            <Mail className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.bounced}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search subscribers by email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {selectedSubscribers.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {selectedSubscribers.length} selected
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedSubscribers.length === subscribers.length && subscribers.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSubscribers(subscribers.map(s => s.email));
                      } else {
                        setSelectedSubscribers([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscribed</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingSubscribers ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading subscribers...
                  </TableCell>
                </TableRow>
              ) : subscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No subscribers found.
                  </TableCell>
                </TableRow>
              ) : (
                subscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedSubscribers.includes(subscriber.email)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSubscribers([...selectedSubscribers, subscriber.email]);
                          } else {
                            setSelectedSubscribers(selectedSubscribers.filter(e => e !== subscriber.email));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{subscriber.email}</TableCell>
                    <TableCell>{subscriber.name || '-'}</TableCell>
                    <TableCell>{getStatusBadge(subscriber.status)}</TableCell>
                    <TableCell>{new Date(subscriber.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{subscriber.subscription_source || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {subscriber.status === 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatusMutation.mutate({
                              id: subscriber.id,
                              status: 'unsubscribed'
                            })}
                          >
                            Unsubscribe
                          </Button>
                        )}
                        {subscriber.status === 'unsubscribed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatusMutation.mutate({
                              id: subscriber.id,
                              status: 'active'
                            })}
                          >
                            Reactivate
                          </Button>
                        )}
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