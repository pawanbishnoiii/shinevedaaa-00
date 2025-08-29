import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: page, isLoading, error } = useQuery({
    queryKey: ['footer-page', slug],
    queryFn: async () => {
      if (!slug) throw new Error('No slug provided');
      
      const { data, error } = await supabase
        .from('footer_pages')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mb-4"></div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Convert content to HTML if it's markdown (simple implementation)
  const formatContent = (content: string) => {
    // Basic markdown-to-HTML conversion
    return content
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>');
  };

  return (
    <>
      <Helmet>
        <title>{page.seo_title || page.title} | ShineVeda</title>
        <meta name="description" content={page.seo_description || `${page.title} - ShineVeda`} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${window.location.origin}/page/${page.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={page.seo_title || page.title} />
        <meta property="og:description" content={page.seo_description || page.title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${window.location.origin}/page/${page.slug}`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={page.seo_title || page.title} />
        <meta name="twitter:description" content={page.seo_description || page.title} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                <Link to="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
                <span>/</span>
                <span className="text-foreground">{page.title}</span>
              </nav>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {page.title}
              </h1>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Updated {new Date(page.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>ShineVeda Team</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <article className="prose prose-lg max-w-none">
              <div 
                className="text-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: `<p>${formatContent(page.content || '')}</p>`
                }}
              />
            </article>

            {/* Back to Home */}
            <div className="mt-12 pt-8 border-t">
              <Button asChild variant="outline">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default DynamicPage;