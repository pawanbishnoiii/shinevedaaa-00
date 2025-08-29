import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  MessageSquare, 
  Eye, 
  TrendingUp, 
  Users, 
  Activity,
  Plus,
  ArrowUpRight,
  BarChart3,
  Globe,
  Heart,
  FileText,
  Database,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  // Fetch comprehensive dashboard metrics
  const { data: metrics } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: async () => {
      const [
        products, inquiries, testimonials, categories, 
        footerPages, rajasthanStories, rajasthanCrops,
        mediaFiles, productFavorites, userAnalytics
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact' }),
        supabase.from('inquiries').select('*', { count: 'exact' }),
        supabase.from('testimonials').select('*', { count: 'exact' }),
        supabase.from('categories').select('*', { count: 'exact' }),
        supabase.from('footer_pages').select('*', { count: 'exact' }),
        supabase.from('rajasthan_stories').select('*', { count: 'exact' }),
        supabase.from('rajasthan_crops').select('*', { count: 'exact' }),
        supabase.from('media').select('*', { count: 'exact' }),
        supabase.from('product_favorites').select('*', { count: 'exact' }),
        supabase.from('user_analytics').select('*', { count: 'exact' })
      ]);

      return {
        totalProducts: products.count || 0,
        activeProducts: products.data?.filter(p => p.is_active).length || 0,
        featuredProducts: products.data?.filter(p => p.is_featured).length || 0,
        totalInquiries: inquiries.count || 0,
        newInquiries: inquiries.data?.filter(i => i.status === 'new').length || 0,
        totalTestimonials: testimonials.count || 0,
        totalCategories: categories.count || 0,
        totalFooterPages: footerPages.count || 0,
        totalRajasthanStories: rajasthanStories.count || 0,
        totalRajasthanCrops: rajasthanCrops.count || 0,
        totalMediaFiles: mediaFiles.count || 0,
        totalFavorites: productFavorites.count || 0,
        totalPageViews: userAnalytics.count || 0,
        recentInquiries: inquiries.data?.slice(0, 5) || []
      };
    }
  });

  // Fetch recent inquiries
  // Fetch analytics data for charts
  const { data: analyticsData } = useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: async () => {
      // Get page views for the last 7 days
      const { data: pageViews } = await supabase
        .from('user_analytics')
        .select('created_at, event_type')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });

      // Get product interactions
      const { data: productInteractions } = await supabase
        .from('product_interactions')
        .select('interaction_type, created_at')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      // Get inquiry status distribution
      const { data: inquiryStatus } = await supabase
        .from('inquiries')
        .select('status');

      return {
        pageViews: pageViews || [],
        productInteractions: productInteractions || [],
        inquiryStatus: inquiryStatus || []
      };
    }
  });

  // Process analytics data for charts
  const chartData = React.useMemo(() => {
    if (!analyticsData) return { daily: [], interactions: [], inquiryDistribution: [] };

    // Daily page views
    const dailyViews = analyticsData.pageViews.reduce((acc: any, view) => {
      const date = new Date(view.created_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const daily = Object.entries(dailyViews).map(([date, views]) => ({
      date,
      views
    }));

    // Interaction types
    const interactionTypes = analyticsData.productInteractions.reduce((acc: any, interaction) => {
      acc[interaction.interaction_type] = (acc[interaction.interaction_type] || 0) + 1;
      return acc;
    }, {});

    const interactions = Object.entries(interactionTypes).map(([type, count]) => ({
      type,
      count
    }));

    // Inquiry status distribution
    const statusCounts = analyticsData.inquiryStatus.reduce((acc: any, inquiry) => {
      acc[inquiry.status] = (acc[inquiry.status] || 0) + 1;
      return acc;
    }, {});

    const inquiryDistribution = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      fill: status === 'new' ? '#ff6b6b' : status === 'in_progress' ? '#ffd93d' : '#6bcf7f'
    }));

    return { daily, interactions, inquiryDistribution };
  }, [analyticsData]);

  const statsCards = [
    {
      title: 'Total Products',
      value: metrics?.totalProducts || 0,
      icon: Package,
      description: `${metrics?.activeProducts || 0} active, ${metrics?.featuredProducts || 0} featured`,
      href: '/admin/products',
      color: 'text-blue-600'
    },
    {
      title: 'New Inquiries',
      value: metrics?.newInquiries || 0,
      icon: MessageSquare,
      description: `${metrics?.totalInquiries || 0} total inquiries`,
      href: '/admin/inquiries',
      color: 'text-green-600'
    },
    {
      title: 'Page Views',
      value: metrics?.totalPageViews || 0,
      icon: BarChart3,
      description: 'Total website analytics',
      href: '/admin/analytics',
      color: 'text-purple-600'
    },
    {
      title: 'Media Files',
      value: metrics?.totalMediaFiles || 0,
      icon: FileText,
      description: 'Images, videos & documents',
      href: '/admin/media',
      color: 'text-orange-600'
    },
    {
      title: 'Rajasthan Stories',
      value: metrics?.totalRajasthanStories || 0,
      icon: Globe,
      description: 'Farmer & village stories',
      href: '/admin/rajasthan/stories',
      color: 'text-indigo-600'
    },
    {
      title: 'Crop Varieties',
      value: metrics?.totalRajasthanCrops || 0,
      icon: Database,
      description: 'Regional crop information',
      href: '/admin/rajasthan/crops',
      color: 'text-emerald-600'
    },
    {
      title: 'User Favorites',
      value: metrics?.totalFavorites || 0,
      icon: Heart,
      description: 'Product favorites saved',
      href: '/admin/favorites',
      color: 'text-red-600'
    },
    {
      title: 'Footer Pages',
      value: metrics?.totalFooterPages || 0,
      icon: FileText,
      description: 'Dynamic content pages',
      href: '/admin/footer-pages',
      color: 'text-gray-600'
    }
  ];

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

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Complete overview of your ShineVeda agricultural export platform
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link to="/admin/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Link>
          </Button>
          <Button asChild>
            <Link to="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="hover:shadow-md transition-all duration-200 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{card.value.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
                <Link to={card.href} className="inline-flex items-center text-xs text-primary hover:underline mt-2">
                  View details <ArrowUpRight className="h-3 w-3 ml-1" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Charts Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Daily Page Views Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Daily Page Views (Last 7 Days)
            </CardTitle>
            <CardDescription>
              Website traffic overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.daily}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Inquiry Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Inquiry Status
            </CardTitle>
            <CardDescription>
              Current inquiry distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.inquiryDistribution}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                  >
                    {chartData.inquiryDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Inquiries */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recent Inquiries
            </CardTitle>
            <CardDescription>
              Latest customer inquiries and requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics?.recentInquiries?.map((inquiry) => (
                <div key={inquiry.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-none">
                        {inquiry.name}
                      </p>
                      {inquiry.product_name && (
                        <Badge variant="secondary" className="text-xs">
                          {inquiry.product_name}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {inquiry.email}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {inquiry.message}
                    </p>
                    {inquiry.inquiry_number && (
                      <p className="text-xs font-mono text-muted-foreground">
                        #{inquiry.inquiry_number}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {getStatusBadge(inquiry.status)}
                    <p className="text-xs text-muted-foreground">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {inquiry.priority}
                    </Badge>
                  </div>
                </div>
              ))}
              {(!metrics?.recentInquiries || metrics.recentInquiries.length === 0) && (
                <div className="text-center text-muted-foreground py-8">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No inquiries yet</p>
                  <p className="text-xs">Customer inquiries will appear here</p>
                </div>
              )}
            </div>
            {metrics?.recentInquiries && metrics.recentInquiries.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/admin/inquiries">
                    View All Inquiries ({metrics.totalInquiries})
                    <ArrowUpRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              <Link to="/admin/products/new" className="block">
                <Button variant="outline" className="w-full justify-start h-12">
                  <Package className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Add New Product</div>
                    <div className="text-xs text-muted-foreground">Create product listing</div>
                  </div>
                </Button>
              </Link>
              
              <Link to="/admin/rajasthan/stories" className="block">
                <Button variant="outline" className="w-full justify-start h-12">
                  <Globe className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Add Farmer Story</div>
                    <div className="text-xs text-muted-foreground">Share agricultural stories</div>
                  </div>
                </Button>
              </Link>

              <Link to="/admin/media" className="block">
                <Button variant="outline" className="w-full justify-start h-12">
                  <FileText className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Upload Media</div>
                    <div className="text-xs text-muted-foreground">Images & documents</div>
                  </div>
                </Button>
              </Link>

              <Link to="/admin/footer-pages" className="block">
                <Button variant="outline" className="w-full justify-start h-12">
                  <FileText className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Manage Pages</div>
                    <div className="text-xs text-muted-foreground">About, Privacy, Terms</div>
                  </div>
                </Button>
              </Link>

              <Link to="/admin/analytics" className="block">
                <Button variant="outline" className="w-full justify-start h-12">
                  <BarChart3 className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">View Analytics</div>
                    <div className="text-xs text-muted-foreground">Traffic & performance</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;