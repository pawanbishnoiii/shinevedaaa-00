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
import { Switch } from '@/components/ui/switch';
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
import { toast } from 'sonner';
import { 
  Search, 
  Globe, 
  TrendingUp, 
  FileText, 
  Settings,
  RefreshCw,
  Download,
  Upload,
  Eye,
  BarChart3,
  Target
} from 'lucide-react';

const SEOManager = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const queryClient = useQueryClient();

  // SEO Settings State
  const [seoSettings, setSeoSettings] = useState({
    site_title: 'ShineVeda Exports - Premium Agricultural Commodities',
    site_description: 'Export quality agricultural commodities from Sri Ganganagar, Rajasthan to global markets.',
    meta_keywords: 'agricultural exports, onions, jeera, peanuts, carrots, chickpeas, mustard, guar gum',
    canonical_url: 'https://yourdomain.com',
    robots_meta: 'index, follow',
    google_analytics_id: 'GTM-58CGQB67',
    google_search_console_id: '',
    schema_org_enabled: true,
    sitemap_enabled: true,
    auto_refresh_enabled: true
  });

  // Country targeting for international SEO
  const targetCountries = [
    { code: 'IN', name: 'India', priority: 1 },
    { code: 'SG', name: 'Singapore', priority: 2 },
    { code: 'GB', name: 'United Kingdom', priority: 3 },
    { code: 'US', name: 'United States', priority: 4 },
    { code: 'AE', name: 'UAE (Dubai)', priority: 5 },
    { code: 'AU', name: 'Australia', priority: 6 },
    { code: 'QA', name: 'Qatar', priority: 7 },
    { code: 'JP', name: 'Japan', priority: 8 },
    { code: 'CN', name: 'China', priority: 9 }
  ];

  // Keywords tracking
  const keywords = [
    { keyword: 'onions export', position: 15, volume: 1200, difficulty: 45 },
    { keyword: 'jeera export india', position: 8, volume: 800, difficulty: 52 },
    { keyword: 'peanuts export rajasthan', position: 12, volume: 600, difficulty: 38 },
    { keyword: 'agricultural commodities export', position: 25, volume: 2200, difficulty: 65 },
    { keyword: 'sri ganganagar exports', position: 3, volume: 450, difficulty: 25 }
  ];

  const generateSitemap = async () => {
    try {
      // Fetch all active products
      const { data: products } = await supabase
        .from('products')
        .select('slug, updated_at')
        .eq('is_active', true);

      // Generate sitemap XML
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${seoSettings.canonical_url}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${seoSettings.canonical_url}/products</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${seoSettings.canonical_url}/about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${seoSettings.canonical_url}/contact</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${seoSettings.canonical_url}/faq</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  ${products?.map(product => `
  <url>
    <loc>${seoSettings.canonical_url}/products/${product.slug}</loc>
    <lastmod>${product.updated_at?.split('T')[0] || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

      // Download sitemap
      const blob = new Blob([sitemap], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sitemap.xml';
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Sitemap generated and downloaded successfully');
    } catch (error) {
      toast.error('Failed to generate sitemap');
    }
  };

  const refreshSEOData = async () => {
    try {
      // Simulate SEO data refresh
      await new Promise(resolve => setTimeout(resolve, 2000));
      queryClient.invalidateQueries({ queryKey: ['seo-data'] });
      toast.success('SEO data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh SEO data');
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">SEO Manager</h2>
          <p className="text-muted-foreground">
            Manage SEO settings, monitor rankings, and optimize for international markets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={refreshSEOData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button onClick={generateSitemap} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Generate Sitemap
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="international">International</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Organic Traffic</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12.5%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Position</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.2</div>
                <p className="text-xs text-muted-foreground">-1.3 positions improved</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Click Through Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.8%</div>
                <p className="text-xs text-muted-foreground">+0.4% improvement</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Indexed Pages</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-muted-foreground">All pages indexed</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Performance</CardTitle>
              <CardDescription>Track your keyword rankings and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Keyword</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keywords.map((kw, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{kw.keyword}</TableCell>
                      <TableCell>
                        <Badge variant={kw.position <= 10 ? "default" : kw.position <= 20 ? "secondary" : "destructive"}>
                          #{kw.position}
                        </Badge>
                      </TableCell>
                      <TableCell>{kw.volume.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={kw.difficulty <= 40 ? "default" : kw.difficulty <= 60 ? "secondary" : "destructive"}>
                          {kw.difficulty}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="international" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>International SEO Targeting</CardTitle>
              <CardDescription>Configure geo-targeting for global markets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {targetCountries.map((country, index) => (
                  <Card key={index} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{country.name}</div>
                          <div className="text-sm text-muted-foreground">Priority {country.priority}</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Technical SEO Status</CardTitle>
                <CardDescription>Monitor technical SEO health</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Sitemap Status</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Robots.txt</span>
                  <Badge variant="default">Configured</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>SSL Certificate</span>
                  <Badge variant="default">Valid</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Page Speed</span>
                  <Badge variant="secondary">Good</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Mobile Friendly</span>
                  <Badge variant="default">Yes</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schema Markup</CardTitle>
                <CardDescription>Structured data implementation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Organization Schema</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Product Schema</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>FAQ Schema</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Breadcrumb Schema</span>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Configuration</CardTitle>
              <CardDescription>Configure global SEO settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="site_title">Site Title</Label>
                    <Input
                      id="site_title"
                      value={seoSettings.site_title}
                      onChange={(e) => setSeoSettings({...seoSettings, site_title: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="canonical_url">Canonical URL</Label>
                    <Input
                      id="canonical_url"
                      value={seoSettings.canonical_url}
                      onChange={(e) => setSeoSettings({...seoSettings, canonical_url: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="google_analytics">Google Tag Manager ID</Label>
                    <Input
                      id="google_analytics"
                      value={seoSettings.google_analytics_id}
                      onChange={(e) => setSeoSettings({...seoSettings, google_analytics_id: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="site_description">Site Description</Label>
                    <Textarea
                      id="site_description"
                      value={seoSettings.site_description}
                      onChange={(e) => setSeoSettings({...seoSettings, site_description: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="meta_keywords">Meta Keywords</Label>
                    <Textarea
                      id="meta_keywords"
                      value={seoSettings.meta_keywords}
                      onChange={(e) => setSeoSettings({...seoSettings, meta_keywords: e.target.value})}
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={seoSettings.auto_refresh_enabled}
                      onCheckedChange={(checked) => setSeoSettings({...seoSettings, auto_refresh_enabled: checked})}
                    />
                    <Label>Auto-refresh SEO data every 12 hours</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={seoSettings.schema_org_enabled}
                      onCheckedChange={(checked) => setSeoSettings({...seoSettings, schema_org_enabled: checked})}
                    />
                    <Label>Enable Schema.org structured data</Label>
                  </div>
                </div>
                
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SEOManager;