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
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Fetch dashboard metrics
  const { data: metrics } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: async () => {
      const [products, inquiries, testimonials, categories] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact' }),
        supabase.from('inquiries').select('*', { count: 'exact' }),
        supabase.from('testimonials').select('*', { count: 'exact' }),
        supabase.from('categories').select('*', { count: 'exact' })
      ]);

      return {
        totalProducts: products.count || 0,
        totalInquiries: inquiries.count || 0,
        totalTestimonials: testimonials.count || 0,
        totalCategories: categories.count || 0,
        recentInquiries: inquiries.data?.slice(0, 5) || []
      };
    }
  });

  // Fetch recent inquiries
  const { data: recentInquiries } = useQuery({
    queryKey: ['recent-inquiries'],
    queryFn: async () => {
      const { data } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    }
  });

  const statsCards = [
    {
      title: 'Total Products',
      value: metrics?.totalProducts || 0,
      icon: Package,
      description: 'Active products in catalog',
      href: '/admin/products'
    },
    {
      title: 'New Inquiries',
      value: metrics?.totalInquiries || 0,
      icon: MessageSquare,
      description: 'Customer inquiries received',
      href: '/admin/inquiries'
    },
    {
      title: 'Testimonials',
      value: metrics?.totalTestimonials || 0,
      icon: Users,
      description: 'Customer testimonials',
      href: '/admin/testimonials'
    },
    {
      title: 'Categories',
      value: metrics?.totalCategories || 0,
      icon: Activity,
      description: 'Product categories',
      href: '/admin/categories'
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
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back to ShineVeda Admin Panel
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link to="/admin/products/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
                <Link to={card.href} className="inline-flex items-center text-xs text-primary hover:underline mt-1">
                  View all <ArrowUpRight className="h-3 w-3 ml-1" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Inquiries */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Inquiries</CardTitle>
            <CardDescription>
              Latest customer inquiries and requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInquiries?.map((inquiry) => (
                <div key={inquiry.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {inquiry.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {inquiry.email}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {inquiry.message}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {getStatusBadge(inquiry.status)}
                    <p className="text-xs text-muted-foreground">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {(!recentInquiries || recentInquiries.length === 0) && (
                <p className="text-center text-muted-foreground py-8">
                  No inquiries yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/admin/products/new" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Package className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
            </Link>
            <Link to="/admin/content" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                Edit Website Content
              </Button>
            </Link>
            <Link to="/admin/media" className="block">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Media Library
              </Button>
            </Link>
            <Link to="/admin/inquiries" className="block">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Manage Inquiries
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;