import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Clock, 
  Mail, 
  Database, 
  Monitor,
  Save,
  RefreshCw,
  Shield,
  Activity
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SystemSettings() {
  const [activeCategory, setActiveCategory] = useState('system');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch system settings
  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('category', { ascending: true })
        .order('setting_key', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Update setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: string }) => {
      const { error } = await supabase
        .from('system_settings')
        .update({ setting_value: value })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast({
        title: "Setting Updated",
        description: "System setting has been updated successfully.",
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

  // Trigger auto refresh mutation
  const autoRefreshMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('keep_database_warm');
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Auto Refresh Triggered",
        description: "Database auto-refresh has been triggered successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSettingChange = (id: string, value: string) => {
    updateSettingMutation.mutate({ id, value });
  };

  const renderSettingInput = (setting: any) => {
    const handleChange = (value: string) => {
      handleSettingChange(setting.id, value);
    };

    switch (setting.setting_type) {
      case 'boolean':
        return (
          <Switch
            checked={setting.setting_value === 'true'}
            onCheckedChange={(checked) => handleChange(checked ? 'true' : 'false')}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={setting.setting_value || ''}
            onChange={(e) => handleChange(e.target.value)}
            className="w-32"
          />
        );
      case 'textarea':
        return (
          <Textarea
            value={setting.setting_value || ''}
            onChange={(e) => handleChange(e.target.value)}
            rows={3}
          />
        );
      default:
        return (
          <Input
            value={setting.setting_value || ''}
            onChange={(e) => handleChange(e.target.value)}
            className="max-w-md"
          />
        );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'system': return Clock;
      case 'email': return Mail;
      case 'database': return Database;
      case 'analytics': return Monitor;
      case 'media': return Shield;
      default: return Settings;
    }
  };

  const categories = [
    { id: 'system', label: 'System', icon: Clock },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'analytics', label: 'Analytics', icon: Monitor },
    { id: 'media', label: 'Media', icon: Shield },
  ];

  const getSettingsByCategory = (category: string) => {
    return settings.filter(setting => setting.category === category);
  };

  const getLastRefreshTime = () => {
    const lastRefresh = settings.find(s => s.setting_key === 'last_auto_refresh');
    if (lastRefresh?.setting_value) {
      return new Date(lastRefresh.setting_value).toLocaleString();
    }
    return 'Never';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Settings className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">
            Configure system-wide settings and manage automated processes.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => autoRefreshMutation.mutate()}
            disabled={autoRefreshMutation.isPending}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefreshMutation.isPending ? 'animate-spin' : ''}`} />
            Trigger Auto Refresh
          </Button>
        </div>
      </div>

      {/* Auto Refresh Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Auto Refresh Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <div className="flex items-center gap-2 mt-1">
                {settings.find(s => s.setting_key === 'enable_auto_refresh')?.setting_value === 'true' ? (
                  <Badge variant="default">Enabled</Badge>
                ) : (
                  <Badge variant="secondary">Disabled</Badge>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Interval</Label>
              <div className="mt-1">
                {settings.find(s => s.setting_key === 'auto_refresh_interval')?.setting_value || 8} hours
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Last Refresh</Label>
              <div className="mt-1 text-sm text-muted-foreground">
                {getLastRefreshTime()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings by Category */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {category.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="w-5 h-5" />
                  {category.label} Settings
                </CardTitle>
                <CardDescription>
                  Configure {category.label.toLowerCase()} related settings for your application.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {getSettingsByCategory(category.id).map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">
                          {setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Label>
                        {setting.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {setting.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {renderSettingInput(setting)}
                        {setting.is_public && (
                          <Badge variant="outline" className="text-xs">
                            Public
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {getSettingsByCategory(category.id).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No settings found for this category.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm font-medium">Database Status</Label>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="default">Active</Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Email System</Label>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="default">Connected</Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Analytics</Label>
              <div className="flex items-center gap-2 mt-1">
                {settings.find(s => s.setting_key === 'site_analytics_enabled')?.setting_value === 'true' ? (
                  <Badge variant="default">Enabled</Badge>
                ) : (
                  <Badge variant="secondary">Disabled</Badge>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Maintenance Mode</Label>
              <div className="flex items-center gap-2 mt-1">
                {settings.find(s => s.setting_key === 'maintenance_mode')?.setting_value === 'true' ? (
                  <Badge variant="destructive">Active</Badge>
                ) : (
                  <Badge variant="default">Inactive</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}