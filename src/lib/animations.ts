
import { type MotionProps } from "framer-motion";

// Animation variants for elements that fade in
export const fadeIn: MotionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.4, ease: "easeOut" }
};

// Animation variants for elements that slide up
export const slideUp: MotionProps = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
};

// Animation variants for elements that slide in from left
export const slideInLeft: MotionProps = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
};

// Animation variants for elements that slide in from right
export const slideInRight: MotionProps = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
};

// Animation variants for staggered elements (used with children)
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Scale animation for buttons and interactive elements
export const scaleOnHover = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.97 },
  transition: { duration: 0.2 }
};

// Custom loading spinner animation
export const spinAnimation = {
  animate: { 
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: "linear"
    }
  }
};
