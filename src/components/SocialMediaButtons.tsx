import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SocialMediaButtons = () => {
  const socialLinks = [
    {
      name: 'Instagram',
      username: '@shineveda',
      url: 'https://instagram.com/shineveda',
      icon: Instagram,
      color: 'from-pink-500 to-purple-600',
      hoverColor: 'hover:from-pink-600 hover:to-purple-700'
    },
    {
      name: 'X (Twitter)',
      username: '@shineveda',
      url: 'https://x.com/shineveda',
      icon: ({ className }: { className?: string }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: 'from-gray-700 to-black',
      hoverColor: 'hover:from-gray-800 hover:to-gray-900'
    },
    {
      name: 'YouTube',
      username: '@shine-veda',
      url: 'https://youtube.com/@shine-veda',
      icon: Youtube,
      color: 'from-red-500 to-red-600',
      hoverColor: 'hover:from-red-600 hover:to-red-700'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Connect With ShineVeda
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow us on social media for the latest updates, farmer stories, 
            and insights from the world of agricultural exports.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6">
          {socialLinks.map((link, index) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Button
                asChild
                className={`
                  bg-gradient-to-r ${link.color} ${link.hoverColor}
                  text-white border-0 shadow-lg hover:shadow-xl 
                  transition-all duration-300 transform hover:scale-105
                  px-8 py-6 h-auto rounded-xl group
                `}
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3"
                >
                  <link.icon className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                  <div className="text-left">
                    <div className="font-semibold text-sm">{link.name}</div>
                    <div className="text-xs opacity-90">{link.username}</div>
                  </div>
                </a>
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-muted-foreground">
            Join our community and stay updated with the latest agricultural insights and product updates.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialMediaButtons;