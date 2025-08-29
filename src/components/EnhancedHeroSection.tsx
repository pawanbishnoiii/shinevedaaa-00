import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ReactPlayer from 'react-player';
import { Button } from '@/components/ui/button';
import { ArrowDown, Play, Pause } from 'lucide-react';

interface HeroVideo {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url: string;
}

interface EnhancedHeroSectionProps {
  videos?: HeroVideo[];
  title?: string;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

const EnhancedHeroSection: React.FC<EnhancedHeroSectionProps> = ({
  videos = [],
  title = "Premium Agricultural Excellence",
  subtitle = "From the fertile lands of Rajasthan to global markets",
  ctaText = "Explore Our Products",
  onCtaClick
}) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.3 });

  const currentVideo = videos[currentVideoIndex];

  useEffect(() => {
    if (videos.length > 1) {
      const interval = setInterval(() => {
        setCurrentVideoIndex(prev => (prev + 1) % videos.length);
      }, 15000); // Change video every 15 seconds
      return () => clearInterval(interval);
    }
  }, [videos.length]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        {currentVideo ? (
          <ReactPlayer
            url={currentVideo.video_url}
            playing={isPlaying}
            loop
            muted
            width="100%"
            height="100%"
            className="object-cover"
            onReady={() => setIsVideoLoaded(true)}
            config={{
              youtube: {
                playerVars: {
                  autoplay: 1,
                  controls: 0,
                  rel: 0,
                  showinfo: 0,
                  mute: 1,
                  loop: 1
                }
              }
            }}
          />
        ) : (
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('/placeholder.svg')` }}
          />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {title}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {subtitle}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg"
              onClick={onCtaClick}
            >
              {ctaText}
            </Button>
            
            {currentVideo && (
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg"
                onClick={togglePlayPause}
              >
                {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                {isPlaying ? 'Pause Video' : 'Play Video'}
              </Button>
            )}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="cursor-pointer"
          >
            <ArrowDown className="w-6 h-6 text-white/70" />
          </motion.div>
        </motion.div>
      </div>

      {/* Video Controls */}
      {videos.length > 1 && (
        <div className="absolute bottom-4 right-4 z-20">
          <div className="flex space-x-2">
            {videos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentVideoIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentVideoIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default EnhancedHeroSection;