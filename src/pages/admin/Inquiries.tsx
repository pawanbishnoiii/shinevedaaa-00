import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MessageSquare, 
  Search, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download,
  Clock,
  User,
  Building,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';

const Inquiries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  const queryClient = useQueryClient();

  const { data: inquiries, isLoading } = useQuery({
    queryKey: ['admin-inquiries', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { error } = await supabase
        .from('inquiries')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
      toast.success('Inquiry status updated');
    },
    onError: () => {
      toast.error('Failed to update inquiry status');
    }
  });

  const updateNotesMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string, notes: string }) => {
      const { error } = await supabase
        .from('inquiries')
        .update({ admin_notes: notes, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
      toast.success('Notes updated');
    },
    onError: () => {
      toast.error('Failed to update notes');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('inquiries').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
      toast.success('Inquiry deleted');
    },
    onError: () => {
      toast.error('Failed to delete inquiry');
    }
  });

  const getStatusBadge = (status: string) => {
    const statusColors = {
      new: 'bg-blue-500',
      responded: 'bg-green-500', 
      in_progress: 'bg-yellow-500',
      closed: 'bg-gray-500'
    };
    
    return (
      <Badge variant="secondary" className={`${statusColors[status as keyof typeof statusColors]} text-white`}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityColors = {
      low: 'bg-green-100 text-green-800',
      normal: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge variant="outline" className={priorityColors[priority as keyof typeof priorityColors]}>
        {priority}
      </Badge>
    );
  };

  const handleStatusChange = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete inquiry from "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const InquiryDetail = ({ inquiry }: { inquiry: any }) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {inquiry.name}
            </CardTitle>
            <CardDescription>{inquiry.email}</CardDescription>
          </div>
          <Button variant="outline" onClick={() => setViewMode('list')}>
            Back to List
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Contact Information</Label>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {inquiry.name}
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                {inquiry.email}
              </div>
              {inquiry.phone && (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 text-center">📞</span>
                  {inquiry.phone}
                </div>
              )}
              {inquiry.company && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {inquiry.company}
                </div>
              )}
              {inquiry.country && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {inquiry.country}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Inquiry Details</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                {getStatusBadge(inquiry.status)}
                {getPriorityBadge(inquiry.priority)}
              </div>
              <div className="text-sm text-muted-foreground">
                Type: {inquiry.inquiry_type.replace('_', ' ')}
              </div>
              {inquiry.product_interest && (
                <div className="text-sm text-muted-foreground">
                  Product Interest: {inquiry.product_interest}
                </div>
              )}
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(inquiry.created_at).toLocaleDateString()} at {new Date(inquiry.created_at).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Message</Label>
          <div className="p-3 bg-muted rounded-md">
            {inquiry.message}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Admin Notes</Label>
          <Textarea
            placeholder="Add your notes about this inquiry..."
            defaultValue={inquiry.admin_notes || ''}
            onBlur={(e) => {
              if (e.target.value !== inquiry.admin_notes) {
                updateNotesMutation.mutate({ id: inquiry.id, notes: e.target.value });
              }
            }}
          />
        </div>

        <div className="flex gap-2">
          <Select onValueChange={(value) => handleStatusChange(inquiry.id, value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Change Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="responded">Responded</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Send Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (viewMode === 'detail' && selectedInquiry) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <InquiryDetail inquiry={selectedInquiry} />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inquiries</h2>
          <p className="text-muted-foreground">
            Manage customer inquiries and communications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Inquiry Management</CardTitle>
              <CardDescription>
                Track and respond to customer inquiries
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inquiries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <MessageSquare className="h-8 w-8 animate-pulse" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries?.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{inquiry.name}</div>
                        <div className="text-sm text-muted-foreground">{inquiry.email}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {inquiry.message}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {inquiry.company && <div className="font-medium">{inquiry.company}</div>}
                        {inquiry.country && <div className="text-sm text-muted-foreground">{inquiry.country}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {inquiry.inquiry_type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                    <TableCell>{getPriorityBadge(inquiry.priority)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(inquiry.created_at).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedInquiry(inquiry);
                              setViewMode('detail');
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(inquiry.id, 'responded')}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Mark Responded
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(inquiry.id, inquiry.name)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {(!inquiries || inquiries.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No inquiries found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Inquiries;