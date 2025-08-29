import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get base URL from request or environment
    const url = new URL(req.url)
    const baseUrl = `${url.protocol}//${url.host}`

    // Fetch all active products
    const { data: products } = await supabaseClient
      .from('products')
      .select('slug, updated_at')
      .eq('is_active', true)

    // Fetch all active categories
    const { data: categories } = await supabaseClient
      .from('categories')
      .select('slug, updated_at')
      .eq('is_active', true)

    // Fetch all active footer pages
    const { data: footerPages } = await supabaseClient
      .from('footer_pages')
      .select('slug, updated_at')
      .eq('is_active', true)

    // Define static pages
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: 'products', priority: '0.9', changefreq: 'daily' },
      { url: 'about', priority: '0.8', changefreq: 'monthly' },
      { url: 'contact', priority: '0.8', changefreq: 'monthly' },
      { url: 'faq', priority: '0.7', changefreq: 'monthly' },
      { url: 'rajasthan-portfolio', priority: '0.8', changefreq: 'weekly' },
      { url: 'auth', priority: '0.5', changefreq: 'yearly' }
    ]

    // Generate sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

    // Add static pages
    staticPages.forEach(page => {
      sitemap += `  <url>
    <loc>${baseUrl}/${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`
    })

    // Add product pages
    if (products) {
      products.forEach(product => {
        const lastmod = product.updated_at 
          ? new Date(product.updated_at).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
        
        sitemap += `  <url>
    <loc>${baseUrl}/products/${product.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`
      })
    }

    // Add category pages
    if (categories) {
      categories.forEach(category => {
        const lastmod = category.updated_at 
          ? new Date(category.updated_at).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
        
        sitemap += `  <url>
    <loc>${baseUrl}/categories/${category.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`
      })
    }

    // Add footer pages
    if (footerPages) {
      footerPages.forEach(page => {
        const lastmod = page.updated_at 
          ? new Date(page.updated_at).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
        
        sitemap += `  <url>
    <loc>${baseUrl}/page/${page.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`
      })
    }

    sitemap += `</urlset>`

    // Log sitemap generation
    await supabaseClient
      .from('activity_logs')
      .insert({
        activity_type: 'sitemap_generated',
        description: `Sitemap generated with ${(products?.length || 0) + (categories?.length || 0) + (footerPages?.length || 0) + staticPages.length} URLs`,
        metadata: {
          products_count: products?.length || 0,
          categories_count: categories?.length || 0,
          footer_pages_count: footerPages?.length || 0,
          static_pages_count: staticPages.length,
          generation_time: new Date().toISOString()
        }
      })

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      },
    })

  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    return new Response(
      JSON.stringify({ error: 'Failed to generate sitemap' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})