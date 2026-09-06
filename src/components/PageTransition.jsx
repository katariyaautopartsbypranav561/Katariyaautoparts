import { motion } from 'framer-motion';
import React from 'react';

const transitionVariants = {
  initial: {
    opacity: 0,
    y: 24,
    scale: 0.98,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    }
  },
  exit: {
    opacity: 0,
    y: -16,
    scale: 0.99,
    filter: "blur(4px)",
    transition: {
      duration: 0.25,
      ease: 'easeIn',
    }
  }
};

export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={transitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full min-h-screen"
    >
      {/* Top golden shimmer accent indicator on page change */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#171717] via-red-400 to-[#dc2626] z-[999] origin-left shadow-[0_0_12px_rgba(245,158,11,0.8)]"
      />
      {children}
    </motion.div>
  );
}
