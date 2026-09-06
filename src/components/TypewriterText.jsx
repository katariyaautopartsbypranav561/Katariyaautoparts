import React from 'react';
import { motion } from 'framer-motion';

export default function TypewriterText({ text, className = "", delay = 0 }) {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.05, 
        delayChildren: delay / 1000,
      },
    },
  };

  const child = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 5 },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      style={{ display: 'inline-block' }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {Array.from(word).map((char, charIndex) => (
            <motion.span 
              variants={child} 
              key={charIndex}
              style={{ display: 'inline-block' }}
            >
              {char}
            </motion.span>
          ))}
          {wordIndex !== words.length - 1 && (
            <motion.span variants={child} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
              {" "}
            </motion.span>
          )}
        </span>
      ))}
    </motion.span>
  );
}
