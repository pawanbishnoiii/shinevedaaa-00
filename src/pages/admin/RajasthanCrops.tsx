import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save,
  Wheat,
  MapPin,
  Calendar,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface RajasthanCrop {
  id: string;
  name: string;
  description?: string;
  season?: string;
  region?: string;
  duration_days?: number;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const SEASONS = [
  { value: 'Kharif', label: 'Kharif (Monsoon)' },
  { value: 'Rabi', label: 'Rabi (Winter)' },
  { value: 'Zaid', label: 'Zaid (Summer)' },
  { value: 'Perennial', label: 'Perennial (Year-round)' }
];

const REGIONS = [
  'Jaipur', 'Jodhpur', 'Udaipur', 'Ajmer', 'Bikaner', 'Kota', 
  'Bharatpur', 'Alwar', 'Sikar', 'Pali', 'Nagaur', 'Chittorgarh',
  'Jhunjhunu', 'Tonk', 'Bundi', 'Sawai Madhopur', 'Dausa', 'Karauli',
  'Rajsamand', 'Bhilwara', 'Banswara', 'Dungarpur', 'Pratapgarh'
];

const RajasthanCrops = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<RajasthanCrop | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    season: '',
    region: '',
    duration_days: 0,
    image_url: '',
    is_active: true,
    sort_order: 0
  });

  const queryClient = useQueryClient();

  // Fetch crops
  const { data: crops, isLoading } = useQuery({
    queryKey: ['rajasthan-crops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rajasthan_crops')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as RajasthanCrop[];
    }
  });

  // Create/Update mutation
  const saveCropMutation = useMutation({
    mutationFn: async (cropData: typeof formData) => {
      if (editingCrop) {
        const { error } = await supabase
          .from('rajasthan_crops')
          .update(cropData)
          .eq('id', editingCrop.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('rajasthan_crops')
          .insert([cropData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rajasthan-crops'] });
      setIsDialogOpen(false);
      resetForm();
      toast.success(editingCrop ? 'Crop updated successfully' : 'Crop created successfully');
    },
    onError: (error) => {
      toast.error('Failed to save crop: ' + error.message);
    }
  });

  // Delete mutation
  const deleteCropMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rajasthan_crops')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rajasthan-crops'] });
      toast.success('Crop deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete crop: ' + error.message);
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      season: '',
      region: '',
      duration_days: 0,
      image_url: '',
      is_active: true,
      sort_order: 0
    });
    setEditingCrop(null);
  };

  const handleEdit = (crop: RajasthanCrop) => {
    setEditingCrop(crop);
    setFormData({
      name: crop.name,
      description: crop.description || '',
      season: crop.season || '',
      region: crop.region || '',
      duration_days: crop.duration_days || 0,
      image_url: crop.image_url || '',
      is_active: crop.is_active,
      sort_order: crop.sort_order
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    saveCropMutation.mutate(formData);
  };

  const getSeasonBadge = (season?: string) => {
    if (!season) return null;
    const colors = {
      'Kharif': 'bg-green-500',
      'Rabi': 'bg-blue-500',
      'Zaid': 'bg-orange-500',
      'Perennial': 'bg-purple-500'
    };
    
    return (
      <Badge className={`${colors[season as keyof typeof colors]} text-white`}>
        {season}
      </Badge>
    );
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rajasthan Crops</h2>
          <p className="text-muted-foreground">
            Manage agricultural crops grown across Rajasthan regions
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Crop
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCrop ? 'Edit Crop' : 'Add New Crop'}
              </DialogTitle>
              <DialogDescription>
                Add information about crops grown in Rajasthan
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Crop Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Wheat, Bajra, Mustard"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="season">Growing Season</Label>
                  <Select 
                    value={formData.season} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, season: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select season" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEASONS.map((season) => (
                        <SelectItem key={season.value} value={season.value}>
                          {season.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region">Primary Region</Label>
                  <Select 
                    value={formData.region} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {REGIONS.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration_days">Growing Duration (Days)</Label>
                  <Input
                    id="duration_days"
                    type="number"
                    value={formData.duration_days}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration_days: parseInt(e.target.value) || 0 }))}
                    placeholder="e.g., 120"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the crop, its characteristics, and farming practices..."
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/crop-image.jpg"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saveCropMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {saveCropMutation.isPending ? 'Saving...' : 'Save Crop'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wheat className="h-5 w-5" />
            Crops Database
          </CardTitle>
          <CardDescription>
            Agricultural crops grown across different regions of Rajasthan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading crops...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Crop Name</TableHead>
                  <TableHead>Season</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {crops?.map((crop) => (
                  <TableRow key={crop.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {crop.image_url && (
                          <img 
                            src={crop.image_url} 
                            alt={crop.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{crop.name}</div>
                          {crop.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {crop.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getSeasonBadge(crop.season)}
                    </TableCell>
                    <TableCell>
                      {crop.region && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {crop.region}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {crop.duration_days && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {crop.duration_days} days
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={crop.is_active ? "default" : "secondary"}>
                        {crop.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(crop)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this crop?')) {
                              deleteCropMutation.mutate(crop.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(!crops || crops.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No crops added yet. Create your first crop entry!
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

export default RajasthanCrops;