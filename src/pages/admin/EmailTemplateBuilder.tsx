import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Mail, 
  Eye,
  Copy,
  Send,
  Palette,
  Type,
  Image as ImageIcon
} from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function EmailTemplateBuilder() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  const [templateData, setTemplateData] = useState({
    name: '',
    template_key: '',
    category: 'general',
    subject: '',
    preheader: '',
    html_content: '',
    text_content: '',
    thumbnail_url: '',
    design_config: {
      theme: 'modern',
      primaryColor: '#16a34a',
      fontFamily: 'Arial',
      backgroundColor: '#ffffff',
      textColor: '#333333'
    },
    variables: {},
    is_system_template: false
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch email templates
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['email-templates', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`template_key.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Create/Update template mutation
  const templateMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        template_key: data.template_key,
        subject: data.subject,
        body_html: data.html_content,
        body_text: data.text_content,
        category: data.category,
        design_data: data.design_config,
        variables: data.variables,
        is_active: true
      };

      if (editingTemplate) {
        const { error } = await supabase
          .from('email_templates')
          .update(payload)
          .eq('id', editingTemplate.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('email_templates')
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast({
        title: editingTemplate ? "Template Updated" : "Template Created",
        description: "Email template has been saved successfully.",
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete template mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast({
        title: "Template Deleted",
        description: "Email template has been deleted successfully.",
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

  const resetForm = () => {
    setTemplateData({
      name: '',
      template_key: '',
      category: 'general',
      subject: '',
      preheader: '',
      html_content: '',
      text_content: '',
      thumbnail_url: '',
      design_config: {
        theme: 'modern',
        primaryColor: '#16a34a',
        fontFamily: 'Arial',
        backgroundColor: '#ffffff',
        textColor: '#333333'
      },
      variables: {},
      is_system_template: false
    });
    setEditingTemplate(null);
    setIsCreateOpen(false);
  };

  const handleEdit = (template: any) => {
    setEditingTemplate(template);
    setTemplateData({
      name: template.name || '',
      template_key: template.template_key || '',
      category: template.category || 'general',
      subject: template.subject || '',
      preheader: template.preheader || '',
      html_content: template.html_content || '',
      text_content: template.text_content || '',
      thumbnail_url: template.thumbnail_url || '',
        design_config: template.design_data || {},
      variables: template.variables || {},
      is_system_template: template.is_system_template || false
    });
    setIsCreateOpen(true);
  };

  const handleSubmit = () => {
    if (!templateData.name || !templateData.template_key || !templateData.subject) {
      toast({
        title: "Missing Information",
        description: "Please provide name, template key, and subject.",
        variant: "destructive",
      });
      return;
    }

    templateMutation.mutate(templateData);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const generateTemplateKey = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');
  };

  const getDefaultHtmlTemplate = () => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
    <style>
        body { font-family: ${templateData.design_config.fontFamily}, sans-serif; margin: 0; padding: 0; background-color: ${templateData.design_config.backgroundColor}; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: ${templateData.design_config.primaryColor}; color: white; padding: 20px; text-align: center; }
        .content { background-color: white; padding: 30px; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; }
        .button { background-color: ${templateData.design_config.primaryColor}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{company_name}}</h1>
        </div>
        <div class="content">
            <h2>{{title}}</h2>
            <p>{{content}}</p>
            <a href="{{cta_url}}" class="button">{{cta_text}}</a>
        </div>
        <div class="footer">
            <p>&copy; 2024 ShineVeda. All rights reserved.</p>
            <p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>
        </div>
    </div>
</body>
</html>`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Template Builder</h1>
          <p className="text-muted-foreground">
            Create and manage email templates for campaigns and automation.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsCreateOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Edit Email Template' : 'Create Email Template'}
              </DialogTitle>
              <DialogDescription>
                Design and customize email templates for your campaigns.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="variables">Variables</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Template Name *</Label>
                    <Input
                      id="name"
                      value={templateData.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setTemplateData({
                          ...templateData, 
                          name,
                          template_key: templateData.template_key || generateTemplateKey(name)
                        });
                      }}
                      placeholder="Welcome Email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="template_key">Template Key *</Label>
                    <Input
                      id="template_key"
                      value={templateData.template_key}
                      onChange={(e) => setTemplateData({...templateData, template_key: e.target.value})}
                      placeholder="welcome_email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={templateData.category} onValueChange={(value) => setTemplateData({...templateData, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="subscription">Subscription</SelectItem>
                        <SelectItem value="inquiry">Inquiry</SelectItem>
                        <SelectItem value="newsletter">Newsletter</SelectItem>
                        <SelectItem value="transactional">Transactional</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_system"
                      checked={templateData.is_system_template}
                      onCheckedChange={(checked) => setTemplateData({...templateData, is_system_template: checked})}
                    />
                    <Label htmlFor="is_system">System Template</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Email Subject *</Label>
                  <Input
                    id="subject"
                    value={templateData.subject}
                    onChange={(e) => setTemplateData({...templateData, subject: e.target.value})}
                    placeholder="Welcome to ShineVeda!"
                  />
                </div>

                <div>
                  <Label htmlFor="preheader">Preheader Text</Label>
                  <Input
                    id="preheader"
                    value={templateData.preheader}
                    onChange={(e) => setTemplateData({...templateData, preheader: e.target.value})}
                    placeholder="Preview text that appears in email clients"
                  />
                </div>
              </TabsContent>

              <TabsContent value="design" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <Select 
                      value={templateData.design_config.theme} 
                      onValueChange={(value) => setTemplateData({
                        ...templateData, 
                        design_config: {...templateData.design_config, theme: value}
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="newsletter">Newsletter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fontFamily">Font Family</Label>
                    <Select 
                      value={templateData.design_config.fontFamily} 
                      onValueChange={(value) => setTemplateData({
                        ...templateData, 
                        design_config: {...templateData.design_config, fontFamily: value}
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Helvetica">Helvetica</SelectItem>
                        <SelectItem value="Times">Times</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <Input
                      id="primaryColor"
                      type="color"
                      value={templateData.design_config.primaryColor}
                      onChange={(e) => setTemplateData({
                        ...templateData, 
                        design_config: {...templateData.design_config, primaryColor: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="backgroundColor">Background Color</Label>
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={templateData.design_config.backgroundColor}
                      onChange={(e) => setTemplateData({
                        ...templateData, 
                        design_config: {...templateData.design_config, backgroundColor: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="textColor">Text Color</Label>
                    <Input
                      id="textColor"
                      type="color"
                      value={templateData.design_config.textColor}
                      onChange={(e) => setTemplateData({
                        ...templateData, 
                        design_config: {...templateData.design_config, textColor: e.target.value}
                      })}
                    />
                  </div>
                </div>

                <div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setTemplateData({
                      ...templateData, 
                      html_content: getDefaultHtmlTemplate()
                    })}
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    Generate Template with Current Design
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div>
                  <Label htmlFor="html_content">HTML Content</Label>
                  <Textarea
                    id="html_content"
                    value={templateData.html_content}
                    onChange={(e) => setTemplateData({...templateData, html_content: e.target.value})}
                    placeholder="HTML email content..."
                    rows={12}
                    className="font-mono text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="text_content">Plain Text Content</Label>
                  <Textarea
                    id="text_content"
                    value={templateData.text_content}
                    onChange={(e) => setTemplateData({...templateData, text_content: e.target.value})}
                    placeholder="Plain text version of the email..."
                    rows={6}
                  />
                </div>
              </TabsContent>

              <TabsContent value="variables" className="space-y-4">
                <div>
                  <Label>Available Variables</Label>
                  <div className="text-sm text-muted-foreground mb-4">
                    Use these variables in your email content with double curly braces, e.g., {`{{name}}`}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Common Variables:</h4>
                      <div className="space-y-1 text-sm">
                        <div><code>{`{{name}}`}</code> - Recipient name</div>
                        <div><code>{`{{email}}`}</code> - Recipient email</div>
                        <div><code>{`{{company_name}}`}</code> - Company name</div>
                        <div><code>{`{{date}}`}</code> - Current date</div>
                        <div><code>{`{{unsubscribe_url}}`}</code> - Unsubscribe link</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Template Specific:</h4>
                      <Textarea
                        value={JSON.stringify(templateData.variables, null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            setTemplateData({...templateData, variables: parsed});
                          } catch (error) {
                            // Invalid JSON, ignore
                          }
                        }}
                        placeholder='{\n  "custom_variable": "Default value"\n}'
                        rows={6}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={templateMutation.isPending}
              >
                {templateMutation.isPending 
                  ? (editingTemplate ? "Updating..." : "Creating...") 
                  : (editingTemplate ? "Update Template" : "Create Template")
                }
              </Button>
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
              placeholder="Search email templates..."
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
                <TableHead>Template</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading templates...
                  </TableCell>
                </TableRow>
              ) : templates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No templates found. Create your first email template to get started.
                  </TableCell>
                </TableRow>
              ) : (
                templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{template.template_key}</div>
                        <div className="text-sm text-muted-foreground">
                          Key: {template.template_key}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {template.subject}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{template.category}</Badge>
                    </TableCell>
                    <TableCell>0 times</TableCell>
                    <TableCell>
                      <Badge variant={template.is_active ? "default" : "secondary"}>
                        {template.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(template.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(template)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(template.id, template.template_key)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
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