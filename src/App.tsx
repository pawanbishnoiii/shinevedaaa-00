import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/ui/smooth-scroll";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import Categories from "./pages/admin/Categories";
import Inquiries from "./pages/admin/Inquiries";
import Testimonials from "./pages/admin/Testimonials";
import Media from "./pages/admin/Media";
import Content from "./pages/admin/Content";
import Settings from "./pages/admin/Settings";
import ProductForm from "./pages/admin/ProductForm";
import SEOManager from "./pages/admin/SEO";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HelmetProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <SmoothScroll>
              <Routes>
                <Route path="/" element={<><Navbar /><Index /></>} />
                <Route path="/products" element={<><Navbar /><Products /></>} />
                <Route path="/products/:slug" element={<><Navbar /><ProductDetail /></>} />
                <Route path="/profile" element={<><Navbar /><Profile /></>} />
                <Route path="/about" element={<><Navbar /><About /></>} />
                <Route path="/contact" element={<><Navbar /><Contact /></>} />
                <Route path="/faq" element={<><Navbar /><FAQ /></>} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="content" element={<Content />} />
                  <Route path="inquiries" element={<Inquiries />} />
                  <Route path="testimonials" element={<Testimonials />} />
                  <Route path="media" element={<Media />} />
                  <Route path="seo" element={<SEOManager />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="products/new" element={<ProductForm />} />
                  <Route path="products/:id" element={<ProductForm />} />
                  <Route path="products/:id/edit" element={<ProductForm />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SmoothScroll>
          </AuthProvider>
        </BrowserRouter>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
