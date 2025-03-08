
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Users, 
  Shield 
} from 'lucide-react';

const features = [
  {
    icon: <Camera size={24} />,
    title: 'Photo Documentation',
    description: 'Take photos of potholes to provide clear visual evidence for faster assessment and repair.'
  },
  {
    icon: <MapPin size={24} />,
    title: 'Precise Location',
    description: 'Pinpoint the exact location of road hazards to help maintenance crews find and fix issues quickly.'
  },
  {
    icon: <Clock size={24} />,
    title: 'Real-time Updates',
    description: 'Get notifications as your reports move through the repair process from submission to resolution.'
  },
  {
    icon: <TrendingUp size={24} />,
    title: 'Progress Tracking',
    description: 'Track the status of reported potholes and follow the progress of repairs in your area.'
  },
  {
    icon: <Users size={24} />,
    title: 'Community Impact',
    description: 'Join a network of engaged citizens making a real difference in improving local infrastructure.'
  },
  {
    icon: <Shield size={24} />,
    title: 'Road Safety',
    description: 'Contribute to safer roads for everyone by helping identify and address dangerous conditions.'
  }
];

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <section className="py-20 md:py-32 px-6 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            Making road repairs <span className="text-gradient">faster & easier</span>
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Our platform empowers citizens to take an active role in maintaining their community infrastructure through simple yet powerful reporting tools.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass p-8 rounded-2xl transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-12 h-12 mb-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-foreground/75">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
