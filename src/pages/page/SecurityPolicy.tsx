import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, AlertTriangle } from 'lucide-react';

const SecurityPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Security Policy — ShineVeda | Data Security & Protection</title>
        <meta name="description" content="ShineVeda Security Policy - Learn about our data security measures and how we protect your information." />
        <meta name="keywords" content="security policy, data protection, information security, cyber security" />
        <link rel="canonical" href={`${window.location.origin}/page/security-policy`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Security Policy</h1>
            </div>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Our Commitment to Security</h2>
                <p className="text-muted-foreground">
                  At ShineVeda, we take the security of your personal and business information seriously. 
                  This Security Policy outlines the measures we implement to protect your data and 
                  maintain the confidentiality, integrity, and availability of our systems.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div className="bg-card p-6 rounded-lg border">
                  <Lock className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Data Encryption</h3>
                  <p className="text-muted-foreground">
                    All sensitive data is encrypted both in transit and at rest using industry-standard 
                    encryption protocols.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <Eye className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Access Control</h3>
                  <p className="text-muted-foreground">
                    Strict access controls ensure only authorized personnel can access sensitive 
                    information on a need-to-know basis.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Technical Security Measures</h2>
                <ul className="text-muted-foreground space-y-2">
                  <li>• <strong>SSL/TLS Encryption:</strong> All data transmission secured with HTTPS</li>
                  <li>• <strong>Firewalls:</strong> Advanced firewall protection on all network endpoints</li>
                  <li>• <strong>Regular Updates:</strong> Systems and software regularly updated with security patches</li>
                  <li>• <strong>Secure Hosting:</strong> Data hosted on secure, monitored cloud infrastructure</li>
                  <li>• <strong>Backup Systems:</strong> Regular encrypted backups with disaster recovery procedures</li>
                  <li>• <strong>Intrusion Detection:</strong> 24/7 monitoring for suspicious activities</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Organizational Security</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Employee Training</h3>
                    <p className="text-muted-foreground">
                      All employees receive regular security awareness training and are bound by 
                      confidentiality agreements to protect customer information.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Access Management</h3>
                    <p className="text-muted-foreground">
                      Multi-factor authentication and role-based access controls ensure that employees 
                      only access information necessary for their job functions.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Third-Party Security</h3>
                    <p className="text-muted-foreground">
                      All third-party service providers are thoroughly vetted and must meet our 
                      security standards before integration.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Data Protection Measures</h2>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Personal data collected only for legitimate business purposes</li>
                  <li>• Data retention policies to minimize storage of unnecessary information</li>
                  <li>• Secure data disposal procedures for end-of-lifecycle data</li>
                  <li>• Regular security audits and vulnerability assessments</li>
                  <li>• Incident response procedures for potential security breaches</li>
                </ul>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                      Security Incident Reporting
                    </h3>
                    <p className="text-yellow-700 dark:text-yellow-300">
                      If you suspect any security incident or unauthorized access to your account, 
                      please contact us immediately at security@shineveda.in or +91 89551 58794.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Compliance and Standards</h2>
                <p className="text-muted-foreground">
                  We comply with applicable data protection regulations including Indian Information 
                  Technology Act, and international standards where relevant. Our security practices 
                  are regularly reviewed and updated to maintain compliance with evolving regulations.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Your Role in Security</h2>
                <p className="text-muted-foreground mb-4">
                  Security is a shared responsibility. You can help protect your information by:
                </p>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Using strong, unique passwords for your accounts</li>
                  <li>• Keeping your login credentials confidential</li>
                  <li>• Logging out of your account when finished</li>
                  <li>• Reporting suspicious activities immediately</li>
                  <li>• Keeping your contact information updated</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Security Updates</h2>
                <p className="text-muted-foreground">
                  This Security Policy is reviewed regularly and updated as needed to reflect 
                  changes in our security practices and regulatory requirements. Material changes 
                  will be communicated to users through our website and direct communications.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
                <div className="bg-muted/50 rounded-lg p-6">
                  <p className="text-muted-foreground mb-2">
                    For security-related questions or to report security concerns:
                  </p>
                  <p className="text-muted-foreground mb-2">
                    <strong>Security Email:</strong> security@shineveda.in
                  </p>
                  <p className="text-muted-foreground mb-2">
                    <strong>General Contact:</strong> help@shineveda.in
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Phone:</strong> +91 89551 58794
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-6">
                <p className="text-sm text-muted-foreground">
                  <strong>Last updated:</strong> {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SecurityPolicy;