import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Plus,
  ArrowUpRight,
  BarChart3,
  Globe,
  Heart,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Overview = () => {
  // Fetch key metrics
  const { data: metrics } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: async () => {
      const [
        products, inquiries, testimonials, analytics
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact' }),
        supabase.from('inquiries').select('*', { count: 'exact' }),
        supabase.from('testimonials').select('*', { count: 'exact' }),
        supabase.from('user_analytics').select('*', { count: 'exact' })
      ]);

      return {
        totalProducts: products.count || 0,
        activeProducts: products.data?.filter(p => p.is_active).length || 0,
        featuredProducts: products.data?.filter(p => p.is_featured).length || 0,
        totalInquiries: inquiries.count || 0,
        newInquiries: inquiries.data?.filter(i => i.status === 'new').length || 0,
        totalTestimonials: testimonials.count || 0,
        totalPageViews: analytics.count || 0,
        recentInquiries: inquiries.data?.slice(0, 3) || []
      };
    }
  });

  const overviewCards = [
    {
      title: 'Products',
      value: metrics?.totalProducts || 0,
      subValue: `${metrics?.activeProducts || 0} active`,
      icon: Package,
      href: '/admin/products',
      color: 'text-blue-600'
    },
    {
      title: 'New Inquiries',
      value: metrics?.newInquiries || 0,
      subValue: `${metrics?.totalInquiries || 0} total`,
      icon: MessageSquare,
      href: '/admin/inquiries',
      color: 'text-green-600'
    },
    {
      title: 'Page Views',
      value: metrics?.totalPageViews || 0,
      subValue: 'This month',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'text-purple-600'
    },
    {
      title: 'Featured',
      value: metrics?.featuredProducts || 0,
      subValue: 'products highlighted',
      icon: Star,
      href: '/admin/products?filter=featured',
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground">
            Quick insights into your business performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link to="/admin/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Full Analytics
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

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((card) => {
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
                  {card.subValue}
                </p>
                <Link to={card.href} className="inline-flex items-center text-xs text-primary hover:underline mt-2">
                  View details <ArrowUpRight className="h-3 w-3 ml-1" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Inquiries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recent Inquiries
            </CardTitle>
            <CardDescription>
              Latest customer inquiries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics?.recentInquiries?.map((inquiry) => (
                <div key={inquiry.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="text-sm font-medium">{inquiry.name}</p>
                    <p className="text-xs text-muted-foreground">{inquiry.email}</p>
                    {inquiry.product_name && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        {inquiry.product_name}
                      </Badge>
                    )}
                  </div>
                  <Badge variant={inquiry.status === 'new' ? 'default' : 'secondary'}>
                    {inquiry.status}
                  </Badge>
                </div>
              ))}
              {(!metrics?.recentInquiries || metrics.recentInquiries.length === 0) && (
                <div className="text-center text-muted-foreground py-4">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No recent inquiries</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/admin/products/new" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Package className="h-4 w-4 mr-3" />
                Add New Product
              </Button>
            </Link>
            
            <Link to="/admin/indian-farmers" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Globe className="h-4 w-4 mr-3" />
                Manage Portfolio
              </Button>
            </Link>

            <Link to="/admin/media" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Heart className="h-4 w-4 mr-3" />
                Upload Media
              </Button>
            </Link>

            <Link to="/admin/settings" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-3" />
                Site Settings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;