
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      heroRef.current.style.setProperty('--mouse-x', `${x}`);
      heroRef.current.style.setProperty('--mouse-y', `${y}`);
    };

    const elem = heroRef.current;
    if (elem) {
      elem.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (elem) {
        elem.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div 
      ref={heroRef}
      className="min-h-screen relative flex items-center pt-16 overflow-hidden"
      style={{ 
        '--mouse-x': '0.5', 
        '--mouse-y': '0.5'
      } as React.CSSProperties}
    >
      {/* Background gradient */}
      <div 
        className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent opacity-70"
        style={{
          backgroundPosition: 'calc(var(--mouse-x) * 100%) calc(var(--mouse-y) * 100%)'
        }}
      />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOHY2YzYuNjMgMCAxMiA1LjM3IDEyIDEyaC02YzAgNi42MyA1LjM3IDEyIDEyIDEydi02YzAgNi42MyA1LjM3IDEyIDEyIDEydjZjOS45NCAwIDE4LTguMDYgMTgtMThoLTZjMCA2LjYzLTUuMzcgMTItMTIgMTJ2LTZjLTYuNjMgMC0xMi01LjM3LTEyLTEyeiIgZmlsbD0iI2I0Y2VmZiIgZmlsbC1vcGFjaXR5PSIwLjAyIi8+PC9nPjwvc3ZnPg==')] opacity-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center px-3 py-1.5 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium"
          >
            <MapPin size={14} className="mr-1" />
            <span>Crowdsourced Road Reporting</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl leading-tight tracking-tight"
          >
            Make your <span className="text-gradient">community safer</span> by reporting road hazards
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-foreground/80 max-w-2xl mb-10"
          >
            Join thousands of citizens who are helping to fix their roads by reporting potholes and hazards in real-time. Together, we can create safer streets for everyone.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/report" className="group">
                Report a Pothole
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8">
              <Link to="/dashboard">
                View Reports
              </Link>
            </Button>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 text-center"
          >
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold text-primary mb-2">4,500+</span>
              <span className="text-sm text-foreground/70">Potholes Reported</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold text-primary mb-2">72%</span>
              <span className="text-sm text-foreground/70">Resolution Rate</span>
            </div>
            <div className="flex flex-col items-center col-span-2 md:col-span-1">
              <span className="text-3xl md:text-4xl font-bold text-primary mb-2">2,300+</span>
              <span className="text-sm text-foreground/70">Active Citizens</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
