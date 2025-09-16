import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/ui/smooth-scroll";
import { usePageTracking } from "@/hooks/useAnalytics";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import EnhancedPortfolio from "./pages/EnhancedPortfolio";
import Agri from "./pages/Agri";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Overview from "./pages/admin/Overview";
import FeaturedProducts from "./pages/admin/FeaturedProducts";
import AdminProducts from "./pages/admin/Products";
import Categories from "./pages/admin/Categories";
import Inquiries from "./pages/admin/Inquiries";
import Testimonials from "./pages/admin/Testimonials";
import Favorites from "./pages/admin/Favorites";
import Media from "./pages/admin/Media";
import Content from "./pages/admin/Content";
import Settings from "./pages/admin/Settings";
import ProductForm from "./pages/admin/ProductForm";
import SEOManager from "./pages/admin/SEO";
import Analytics from "./pages/admin/Analytics";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import EnhancedNotFound from "./pages/EnhancedNotFound";
import DynamicPage from "./pages/DynamicPage";
import EnhancedMedia from "./pages/admin/EnhancedMedia";
import FooterPages from "./pages/admin/FooterPages";
import PortfolioVideosAdmin from "./pages/admin/PortfolioVideos";
import RajasthanCrops from "./pages/admin/RajasthanCrops";
import RajasthanStories from "./pages/admin/IndianFarmers";
import EnhancedAgriBlog from "./pages/admin/EnhancedAgriBlog";
import Users from "./pages/admin/Users";
import Quality from "./pages/page/Quality";
import Bulk from "./pages/page/Bulk";
import Packaging from "./pages/page/Packaging";
import Shipping from "./pages/page/Shipping";
import Testing from "./pages/page/Testing";
import Samples from "./pages/page/Samples";
import Privacy from "./pages/page/Privacy";
import Terms from "./pages/page/Terms";
import CookiePolicy from "./pages/page/CookiePolicy";
import RefundPolicy from "./pages/page/RefundPolicy";
import SecurityPolicy from "./pages/page/SecurityPolicy";
import JoinFarmerNetwork from "./components/JoinFarmerNetwork";
import ExportPolicy from "./pages/page/ExportPolicy";
import BlogPost from "./components/BlogPost";
import CropPortfolio from "./pages/admin/CropPortfolio";
import FarmerStories from "./pages/admin/FarmerStories";
import GalleryManagement from "./pages/admin/GalleryManagement";
import EmailSubscribers from "./pages/admin/EmailSubscribers";
import EmailCampaigns from "./pages/admin/EmailCampaigns";
import EmailTemplateBuilder from "./pages/admin/EmailTemplateBuilder";
import TeamManagement from "./pages/admin/TeamManagement";
import SystemSettings from "./pages/admin/SystemSettings";
import DynamicSettings from "./pages/admin/DynamicSettings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  usePageTracking(); // Auto-track page views
  
  return (
    <SmoothScroll>
              <Routes>
                <Route path="/" element={<><Navbar /><Index /></>} />
                <Route path="/products" element={<><Navbar /><Products /></>} />
                <Route path="/products/:slug" element={<><Navbar /><ProductDetail /></>} />
                <Route path="/product/:slug" element={<><Navbar /><ProductDetail /></>} />
                <Route path="/profile" element={<><Navbar /><Profile /></>} />
                <Route path="/about" element={<><Navbar /><About /></>} />
                <Route path="/contact" element={<><Navbar /><Contact /></>} />
                <Route path="/faq" element={<><Navbar /><FAQ /></>} />
                <Route path="/portfolio" element={<><Navbar /><EnhancedPortfolio /></>} />
                <Route path="/agri" element={<><Navbar /><Agri /></>} />
                <Route path="/agri/blog/:slug" element={<><Navbar /><BlogPost /></>} />
                
                <Route path="/enhanced-portfolio" element={<><Navbar /><EnhancedPortfolio /></>} />
                <Route path="/page/quality" element={<><Navbar /><Quality /></>} />
                <Route path="/page/bulk" element={<><Navbar /><Bulk /></>} />
                <Route path="/page/packaging" element={<><Navbar /><Packaging /></>} />
                <Route path="/page/shipping" element={<><Navbar /><Shipping /></>} />
                <Route path="/page/testing" element={<><Navbar /><Testing /></>} />
                <Route path="/page/samples" element={<><Navbar /><Samples /></>} />
                <Route path="/page/privacy" element={<><Navbar /><Privacy /></>} />
                <Route path="/page/terms" element={<><Navbar /><Terms /></>} />
                <Route path="/page/cookie-policy" element={<><Navbar /><CookiePolicy /></>} />
                <Route path="/page/refund-policy" element={<><Navbar /><RefundPolicy /></>} />
                <Route path="/page/security-policy" element={<><Navbar /><SecurityPolicy /></>} />
                <Route path="/page/about" element={<><Navbar /><About /></>} />
                <Route path="/page/join-farmer-network" element={<><Navbar /><JoinFarmerNetwork /></>} />
                <Route path="/page/export-policy" element={<><Navbar /><ExportPolicy /></>} />
                <Route path="/page/:slug" element={<><Navbar /><DynamicPage /></>} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Overview />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/new" element={<ProductForm />} />
                  <Route path="products/:id" element={<ProductForm />} />
                  <Route path="products/:id/edit" element={<ProductForm />} />
                  <Route path="featured-products" element={<FeaturedProducts />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="content" element={<Content />} />
                  <Route path="inquiries" element={<Inquiries />} />
                  <Route path="favorites" element={<Favorites />} />
                  <Route path="testimonials" element={<Testimonials />} />
                  <Route path="media" element={<EnhancedMedia />} />
                  <Route path="footer-pages" element={<FooterPages />} />
                  <Route path="rajasthan-crops" element={<RajasthanCrops />} />
                  <Route path="indian-farmers" element={<RajasthanStories />} />
                  <Route path="portfolio-videos" element={<PortfolioVideosAdmin />} />
                  <Route path="agri-blog" element={<EnhancedAgriBlog />} />
                  <Route path="users" element={<Users />} />
                  <Route path="crop-portfolio" element={<CropPortfolio />} />
                  <Route path="farmer-stories" element={<FarmerStories />} />
                  <Route path="gallery-management" element={<GalleryManagement />} />
                  <Route path="seo" element={<SEOManager />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="email-subscribers" element={<EmailSubscribers />} />
                  <Route path="email-campaigns" element={<EmailCampaigns />} />
                  <Route path="email-templates" element={<EmailTemplateBuilder />} />
                  <Route path="team-management" element={<TeamManagement />} />
                  <Route path="system-settings" element={<SystemSettings />} />
                  <Route path="dynamic-settings" element={<DynamicSettings />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<EnhancedNotFound />} />
              </Routes>
            </SmoothScroll>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HelmetProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
