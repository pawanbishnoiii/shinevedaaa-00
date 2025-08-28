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

  // Sample data - in real implementation, this would come from your analytics service
  const { data: analyticsData } = useQuery({
    queryKey: ['analytics', timeRange],
    queryFn: async () => {
      // TODO: Once user_analytics table types are available, uncomment this:
      // const { data: userAnalytics } = await supabase
      //   .from('user_analytics')
      //   .select('*')
      //   .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      //   .order('created_at', { ascending: false });

      return {
        userAnalytics: [], // userAnalytics || [],
        overview: {
          totalVisitors: 2847,
          pageViews: 8934,
          avgSessionTime: '4:32',
          bounceRate: '42.5%',
          topCountries: [
            { country: 'India', visitors: 1205, percentage: 42.3 },
            { country: 'UAE', visitors: 523, percentage: 18.4 },
            { country: 'Singapore', visitors: 341, percentage: 12.0 },
            { country: 'USA', visitors: 298, percentage: 10.5 },
            { country: 'UK', visitors: 234, percentage: 8.2 }
          ],
          deviceTypes: [
            { name: 'Desktop', value: 1654, percentage: 58.1 },
            { name: 'Mobile', value: 892, percentage: 31.3 },
            { name: 'Tablet', value: 301, percentage: 10.6 }
          ],
          topPages: [
            { page: '/', views: 3421, title: 'Home' },
            { page: '/products', views: 1876, title: 'Products' },
            { page: '/about', views: 1234, title: 'About Us' },
            { page: '/contact', views: 891, title: 'Contact' },
            { page: '/rajasthan-portfolio', views: 678, title: 'Rajasthan Portfolio' }
          ],
          trafficSources: [
            { source: 'Organic Search', visitors: 1423, percentage: 50.0 },
            { source: 'Direct', visitors: 712, percentage: 25.0 },
            { source: 'Social Media', visitors: 427, percentage: 15.0 },
            { source: 'Referral', visitors: 285, percentage: 10.0 }
          ]
        },
        weeklyData: [
          { day: 'Mon', visitors: 245, pageViews: 734 },
          { day: 'Tue', visitors: 312, pageViews: 891 },
          { day: 'Wed', visitors: 287, pageViews: 823 },
          { day: 'Thu', visitors: 398, pageViews: 1124 },
          { day: 'Fri', visitors: 445, pageViews: 1287 },
          { day: 'Sat', visitors: 523, pageViews: 1456 },
          { day: 'Sun', visitors: 637, pageViews: 1619 }
        ]
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
                  <span className="text-green-600">+12.5%</span> from last period
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
                  <span className="text-green-600">+8.2%</span> from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Session Time</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData?.overview.avgSessionTime}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+15.3%</span> from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData?.overview.bounceRate}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-600">-2.1%</span> from last period
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
                    {analyticsData?.overview.topPages.map((page, index) => (
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