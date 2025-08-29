-- Create footer pages with default content for all footer links
INSERT INTO footer_pages (title, slug, content, seo_title, seo_description, sort_order, is_active) VALUES
  ('Privacy Policy', 'privacy', 
   '<h1>Privacy Policy</h1>
   <p>At ShineVeda Exports, we are committed to protecting your privacy and personal information.</p>
   <h2>Information We Collect</h2>
   <p>We collect information necessary for business transactions and communications.</p>
   <h2>How We Use Information</h2>
   <p>Your information is used solely for business purposes and order fulfillment.</p>', 
   'Privacy Policy - ShineVeda Exports', 
   'Learn about our privacy practices and how we protect your personal information.', 
   1, true),
   
  ('Terms of Service', 'terms', 
   '<h1>Terms of Service</h1>
   <p>These terms govern your use of ShineVeda Exports services and products.</p>
   <h2>Acceptance of Terms</h2>
   <p>By using our services, you agree to these terms and conditions.</p>
   <h2>Product Information</h2>
   <p>All product specifications are subject to availability and verification.</p>', 
   'Terms of Service - ShineVeda Exports', 
   'Review our terms and conditions for using ShineVeda Exports services.', 
   2, true),
   
  ('Export Policy', 'export-policy', 
   '<h1>Export Policy</h1>
   <p>ShineVeda Exports follows all international trade regulations and standards.</p>
   <h2>Export Compliance</h2>
   <p>We comply with all applicable export laws and regulations of India and destination countries.</p>
   <h2>Documentation</h2>
   <p>All necessary export documentation is provided with shipments.</p>', 
   'Export Policy - ShineVeda Exports', 
   'Understand our export policies and international trade compliance standards.', 
   3, true),
   
  ('Quality Assurance', 'quality', 
   '<h1>Quality Assurance</h1>
   <p>Quality is at the heart of everything we do at ShineVeda Exports.</p>
   <h2>Quality Standards</h2>
   <p>We maintain the highest quality standards through rigorous testing and inspection.</p>
   <h2>Certifications</h2>
   <p>Our products are certified by recognized international quality bodies.</p>', 
   'Quality Assurance - ShineVeda Exports', 
   'Learn about our comprehensive quality assurance processes and certifications.', 
   4, true),
   
  ('Bulk Orders', 'bulk', 
   '<h1>Bulk Orders</h1>
   <p>ShineVeda Exports specializes in large-scale agricultural commodity supply.</p>
   <h2>Minimum Order Quantities</h2>
   <p>We offer competitive pricing for bulk orders with flexible quantities.</p>
   <h2>Custom Requirements</h2>
   <p>Special packaging and processing available for bulk orders.</p>', 
   'Bulk Orders - ShineVeda Exports', 
   'Get the best rates on bulk agricultural commodities from trusted suppliers.', 
   5, true),
   
  ('Custom Packaging', 'packaging', 
   '<h1>Custom Packaging</h1>
   <p>Tailored packaging solutions for your specific requirements.</p>
   <h2>Packaging Options</h2>
   <p>Various packaging sizes and materials available to meet international standards.</p>
   <h2>Branding</h2>
   <p>Private labeling and custom branding options available.</p>', 
   'Custom Packaging - ShineVeda Exports', 
   'Explore our custom packaging options for agricultural exports.', 
   6, true),
   
  ('Global Shipping', 'shipping', 
   '<h1>Global Shipping</h1>
   <p>Worldwide shipping with reliable logistics partners.</p>
   <h2>Shipping Methods</h2>
   <p>Sea freight, air freight, and express shipping options available.</p>
   <h2>Delivery Timeline</h2>
   <p>Transparent shipping schedules and tracking information provided.</p>', 
   'Global Shipping - ShineVeda Exports', 
   'Learn about our worldwide shipping services and logistics capabilities.', 
   7, true),
   
  ('Quality Testing', 'testing', 
   '<h1>Quality Testing</h1>
   <p>Comprehensive testing ensures product quality and safety.</p>
   <h2>Testing Procedures</h2>
   <p>Multi-stage quality testing from source to final packaging.</p>
   <h2>Certification</h2>
   <p>Third-party testing and certification available upon request.</p>', 
   'Quality Testing - ShineVeda Exports', 
   'Understand our rigorous quality testing procedures and standards.', 
   8, true),
   
  ('Sample Orders', 'samples', 
   '<h1>Sample Orders</h1>
   <p>Request product samples to verify quality before bulk orders.</p>
   <h2>Sample Availability</h2>
   <p>Most products available for sampling with minimal charges.</p>
   <h2>Sample Process</h2>
   <p>Quick sampling process with express shipping options.</p>', 
   'Sample Orders - ShineVeda Exports', 
   'Order product samples to verify quality before placing bulk orders.', 
   9, true);

-- Update footer links in the Footer component to use dynamic pages
UPDATE footer_pages SET is_active = true WHERE slug IN ('privacy', 'terms', 'export-policy', 'quality', 'bulk', 'packaging', 'shipping', 'testing', 'samples');