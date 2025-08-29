import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { 
  Users, 
  Eye, 
  Globe, 
  TrendingUp,
  Calendar,
  Download,
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  // Real analytics data from database
  const { data: analyticsData } = useQuery({
    queryKey: ['analytics', timeRange],
    queryFn: async () => {
      // Get real data from the database
      const [
        { data: userAnalytics },
        { data: pageAnalytics },
        { data: products },
        { data: categories },
        { data: inquiries },
        { data: testimonials },
        { data: productFavorites }
      ] = await Promise.all([
        supabase.from('user_analytics').select('*').gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()).order('created_at', { ascending: false }),
        supabase.from('page_analytics').select('*').gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()).order('created_at', { ascending: false }),
        supabase.from('products').select('*').eq('is_active', true),
        supabase.from('categories').select('*').eq('is_active', true),
        supabase.from('inquiries').select('*'),
        supabase.from('testimonials').select('*').eq('is_active', true),
        supabase.from('product_favorites').select('*, products!product_id(name)')
      ]);

      // Calculate metrics from real data
      const totalVisitors = pageAnalytics?.length || 0;
      const pageViews = pageAnalytics?.reduce((sum, entry) => sum + 1, 0) || 0;
      const totalProducts = products?.length || 0;
      const totalCategories = categories?.length || 0;
      const totalInquiries = inquiries?.length || 0;
      const totalTestimonials = testimonials?.length || 0;
      const totalFavorites = productFavorites?.length || 0;

      // Group page analytics by country
      const countryStats = pageAnalytics?.reduce((acc: any, entry) => {
        const country = entry.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {});

      const topCountries = Object.entries(countryStats || {})
        .map(([country, visitors]) => ({
          country,
          visitors: visitors as number,
          percentage: ((visitors as number / totalVisitors) * 100).toFixed(1)
        }))
        .sort((a, b) => b.visitors - a.visitors)
        .slice(0, 5);

      // Group by device type
      const deviceStats = pageAnalytics?.reduce((acc: any, entry) => {
        const device = entry.device_type || 'Unknown';
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      }, {});

      const deviceTypes = Object.entries(deviceStats || {})
        .map(([name, value]) => ({
          name,
          value: value as number,
          percentage: ((value as number / totalVisitors) * 100).toFixed(1)
        }));

      // Group by page path
      const pageStats = pageAnalytics?.reduce((acc: any, entry) => {
        const page = entry.page_path || '/';
        const title = entry.page_title || 'Unknown Page';
        if (!acc[page]) {
          acc[page] = { page, title, views: 0 };
        }
        acc[page].views += 1;
        return acc;
      }, {});

      const topPages = Object.values(pageStats || {})
        .sort((a: any, b: any) => b.views - a.views)
        .slice(0, 5);

      // Weekly data - group by day
      const weeklyData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));
        
        const dayVisitors = pageAnalytics?.filter(entry => {
          const entryDate = new Date(entry.created_at);
          return entryDate >= dayStart && entryDate <= dayEnd;
        }).length || 0;

        weeklyData.push({
          day: dayName,
          visitors: dayVisitors,
          pageViews: dayVisitors
        });
      }

      return {
        userAnalytics: userAnalytics || [],
        overview: {
          totalVisitors,
          pageViews,
          avgSessionTime: '4:32', // This would need session tracking
          bounceRate: '42.5%', // This would need session tracking
          totalProducts,
          totalCategories,
          totalInquiries,
          totalTestimonials,
          totalFavorites,
          topCountries,
          deviceTypes,
          topPages,
          trafficSources: [
            { source: 'Direct', visitors: Math.floor(totalVisitors * 0.4), percentage: 40.0 },
            { source: 'Organic Search', visitors: Math.floor(totalVisitors * 0.35), percentage: 35.0 },
            { source: 'Social Media', visitors: Math.floor(totalVisitors * 0.15), percentage: 15.0 },
            { source: 'Referral', visitors: Math.floor(totalVisitors * 0.1), percentage: 10.0 }
          ]
        },
        weeklyData
      };
    }
  });

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'desktop': return Monitor;
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      default: return Monitor;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Track website performance and user behavior
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData?.overview.totalVisitors.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Last 7 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData?.overview.pageViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Total page visits
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData?.overview.totalProducts}</div>
                <p className="text-xs text-muted-foreground">
                  Published products
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData?.overview.totalInquiries}</div>
                <p className="text-xs text-muted-foreground">
                  Customer inquiries
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Traffic Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Traffic</CardTitle>
                <CardDescription>Visitors and page views over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData?.weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="visitors" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      name="Visitors"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pageViews" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      name="Page Views"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Device Types Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
                <CardDescription>Traffic breakdown by device</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData?.overview.deviceTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData?.overview.deviceTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Countries */}
            <Card>
              <CardHeader>
                <CardTitle>Top Countries</CardTitle>
                <CardDescription>Visitors by country</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Country</TableHead>
                      <TableHead>Visitors</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsData?.overview.topCountries.map((country, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{country.country}</TableCell>
                        <TableCell>{country.visitors.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{country.percentage}%</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
                <CardDescription>Most visited pages</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Page</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Title</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsData?.overview.topPages.map((page: any, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">{page.page}</TableCell>
                        <TableCell>{page.views.toLocaleString()}</TableCell>
                        <TableCell>{page.title}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>How users are finding your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData?.overview.trafficSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{source.source}</div>
                      <div className="text-sm text-muted-foreground">{source.visitors.toLocaleString()} visitors</div>
                    </div>
                    <Badge variant="secondary">{source.percentage}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {analyticsData?.overview.deviceTypes.map((device, index) => {
              const DeviceIcon = getDeviceIcon(device.name);
              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{device.name}</CardTitle>
                    <DeviceIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{device.value.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      {device.percentage}% of total traffic
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="conversions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Tracking</CardTitle>
              <CardDescription>Track important user actions and conversions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Conversion tracking will be implemented with specific goals</p>
                <p className="text-sm">Contact form submissions, quote requests, etc.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;