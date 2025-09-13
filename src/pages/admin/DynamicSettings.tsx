import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Save, Settings as SettingsIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function DynamicSettings() {
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
        .order('display_order', { ascending: true });
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
        title: "Settings Updated",
        description: "System settings have been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSettingChange = (id: string, value: string | boolean) => {
    updateSettingMutation.mutate({ 
      id, 
      value: typeof value === 'boolean' ? value.toString() : value 
    });
  };

  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, typeof settings>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <SettingsIcon className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">
          Configure system-wide settings and preferences.
        </p>
      </div>

      {Object.entries(groupedSettings).map(([category, categorySettings]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="capitalize">{category} Settings</CardTitle>
            <CardDescription>
              Configure {category} related system settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {categorySettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between space-x-4">
                <div className="flex-1">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </label>
                  {setting.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {setting.description}
                    </p>
                  )}
                </div>
                <div className="flex-1 max-w-sm">
                  {setting.setting_type === 'boolean' ? (
                    <Switch
                      checked={setting.setting_value === 'true'}
                      onCheckedChange={(checked) => 
                        handleSettingChange(setting.id, checked)
                      }
                    />
                  ) : setting.setting_type === 'text' || setting.setting_type === 'email' || setting.setting_type === 'url' ? (
                    <Textarea
                      value={setting.setting_value || ''}
                      onChange={(e) => 
                        handleSettingChange(setting.id, e.target.value)
                      }
                      placeholder={`Enter ${setting.setting_key.replace(/_/g, ' ')}`}
                      rows={setting.setting_value && setting.setting_value.length > 50 ? 3 : 1}
                    />
                  ) : (
                    <Input
                      type={setting.setting_type === 'number' ? 'number' : 'text'}
                      value={setting.setting_value || ''}
                      onChange={(e) => 
                        handleSettingChange(setting.id, e.target.value)
                      }
                      placeholder={`Enter ${setting.setting_key.replace(/_/g, ' ')}`}
                    />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}