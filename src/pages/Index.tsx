import { lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { EmailSubscription } from "@/components/EmailSubscription";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load components for better performance
const HeroSection = lazy(() => import("@/components/HeroSection"));
const ProductsSection = lazy(() => import("@/components/ProductsSection"));
const WhyShineVedaSection = lazy(() => import("@/components/WhyShineVedaSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const Footer = lazy(() => import("@/components/Footer"));
const StickyContact = lazy(() => import("@/components/StickyContact"));

const Index = () => {

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <HeroSection />
      </Suspense>
      
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <ProductsSection />
      </Suspense>
      
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <WhyShineVedaSection />
      </Suspense>
      
      {/* Streamlined B2B CTA */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Partner with <span className="text-primary">ShineVeda</span> for Premium Agricultural Exports
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join global buyers who trust us for consistent quality, competitive pricing, and reliable international shipping from India's agricultural heartland.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/products">Browse Our Catalog</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Request Bulk Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <ContactSection />
      </Suspense>
      
      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <Footer />
      </Suspense>
      
      <Suspense fallback={null}>
        <StickyContact />
      </Suspense>
    </div>
  );
};

export default Index;
