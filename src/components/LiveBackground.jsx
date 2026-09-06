import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function LiveBackground({ theme = 'gold-mesh', className = '' }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const cn = "absolute inset-0 pointer-events-none -z-10 overflow-hidden " + className;

  if (isMobile) {
    return (
      <div className={`${cn} bg-[#171717]`}>
        <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-br from-[#ef4444]/10 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-[40vh] bg-gradient-to-tl from-[#8B5E7A]/10 to-transparent" />
      </div>
    );
  }
  
  if (theme === 'gold-mesh') {
    return (
      <div className={`${cn} bg-[#171717]`}>
        <motion.div
          animate={{ x: [0, 50, -50, 0], y: [0, -50, 50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-[40vw] h-[40vw] bg-[#ef4444]/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -60, 40, 0], y: [0, 60, -40, 0], scale: [1, 1.5, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#b91c1c]/15 rounded-full blur-[120px]"
        />
      </div>
    );
  }

  if (theme === 'dark-particles') {
    return (
      <div className={`${cn} bg-[#171717]`}>
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              opacity: Math.random() * 0.5 + 0.1
            }}
            animate={{ 
              y: [null, Math.random() * -200],
              opacity: [null, 0.8, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-[#ef4444] rounded-full blur-[1px]"
          />
        ))}
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-[30vw] h-[30vw] bg-[#ef4444]/10 rounded-full blur-[100px]"
        />
      </div>
    );
  }

  if (theme === 'resin-flow') {
    return (
      <div className={`${cn} bg-[#171717]`}>
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] bg-[#8B5E7A]/20 rounded-full blur-[100px] origin-center"
        />
        <motion.div
          animate={{ rotate: -360, scale: [1, 1.3, 1] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] bg-[#ef4444]/15 rounded-[40%_60%_70%_30%] blur-[90px] origin-center"
        />
      </div>
    );
  }

  if (theme === 'cream-waves') {
    return (
      <div className={`${cn} bg-[#171717]`}>
        <motion.div
          animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-16 w-[70vw] h-[40vw] bg-[#ef4444]/5 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -30, 20, 0], y: [0, 30, -20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 -right-16 w-[60vw] h-[50vw] bg-[#C0737A]/5 rounded-full blur-[120px]"
        />
      </div>
    );
  }

  if (theme === 'brand-rich') {
    return (
      <div className={`${cn} bg-[#171717]`}>
        <motion.div
          animate={{ x: [0, 40, -40, 0], y: [0, -40, 40, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-[#8B5E7A]/30 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -50, 50, 0], y: [0, 50, -50, 0], scale: [1, 1.4, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[10%] right-[-10%] w-[40vw] h-[40vw] bg-[#ef4444]/25 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[40vw] bg-[#C0737A]/20 rounded-full blur-[100px]"
        />
      </div>
    );
  }

  if (theme === '3d-floating') {
    return (
      <div className={`${cn} [perspective:1000px] overflow-hidden`}>
        {/* Layer 1 - Deep Background Orbs */}
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 60, 0], scale: [1, 1.5, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute top-10 -left-10 w-[40vw] h-[40vw] bg-[#ef4444]/20 rounded-[40%] blur-[80px]"
        />
        
        {/* Layer 2 - Floating "3D" geometric blobs */}
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -80, 0], rotate: [0, 180, 360], scale: [1, 0.8, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 -right-10 w-[30vw] h-[30vw] bg-[#8B5E7A]/30 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] blur-[60px]"
        />

        {/* Layer 3 - Foreground fast particles (dust) */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: ['100%', '-100%'], 
              x: Math.sin(i) * 50,
              rotate: [0, 360],
              opacity: [0, 0.5, 0]
            }}
            transition={{ 
              duration: 10 + i * 2, 
              repeat: Infinity, 
              ease: 'linear',
              delay: i * 1.5
            }}
            className="absolute bg-[#ef4444]/40 blur-sm rounded-sm"
            style={{ 
              left: `${15 + i * 15}%`, 
              width: `${(i % 3 + 1) * 4}px`, 
              height: `${(i % 3 + 1) * 4}px`,
              bottom: '-10%'
            }}
          />
        ))}
      </div>
    );
  }

  if (theme === 'golden-cracks') {
    return (
      <div className={`${cn} bg-[#252525]`}>
        {/* Subtle grey wall noise texture */}
        <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

        {/* Golden Cracks SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-90" viewBox="0 0 1600 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gold-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#F0DFA0" stopOpacity="1" />
              <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.7" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <motion.path
            d="M -100 200 Q 150 250 200 400 T 450 350 T 600 500 T 850 400 T 1100 550 T 1300 450 T 1700 600"
            fill="transparent"
            stroke="url(#gold-glow)"
            strokeWidth="3"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0.5, 0], opacity: [0, 1, 1, 0.8, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M 300 -100 Q 350 150 250 300 T 400 500 T 350 900"
            fill="transparent"
            stroke="url(#gold-glow)"
            strokeWidth="2"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0.5, 0], opacity: [0, 1, 1, 0.8, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          />
          <motion.path
            d="M 850 900 Q 900 700 1000 650 T 1150 500 T 1350 550 T 1700 400"
            fill="transparent"
            stroke="url(#gold-glow)"
            strokeWidth="3.5"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0.5, 0], opacity: [0, 1, 1, 0.8, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
          <motion.path
            d="M 450 350 L 520 280 L 580 300"
            fill="transparent"
            stroke="url(#gold-glow)"
            strokeWidth="1.5"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0.5, 0], opacity: [0, 1, 1, 0.8, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          <motion.path
            d="M 1150 500 L 1100 350 L 1150 250"
            fill="transparent"
            stroke="url(#gold-glow)"
            strokeWidth="1.5"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0.5, 0], opacity: [0, 1, 1, 0.8, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          />
        </svg>

        {/* Ambient gold glow */}
        <motion.div
          animate={{ opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.15)_0%,transparent_80%)]"
        />
      </div>
    );
  }

  if (theme === 'festive-sparks') {
    return (
      <div className={`${cn} bg-gradient-to-br from-[#171717] via-[#2C2C2C] to-[#111111]`}>
        {/* Animated ambient gradients */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] bg-[#8B5E7A]/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-[#ef4444]/15 rounded-full blur-[120px]"
        />

        {/* Falling and floating golden sparks */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: ['-20vh', '120vh'], 
              x: [Math.sin(i) * 50, Math.sin(i) * 50 + (i % 2 === 0 ? 100 : -100)],
              rotate: [0, 360],
              opacity: [0, 1, 0],
              scale: [0, i % 3 === 0 ? 1.5 : 1, 0]
            }}
            transition={{ 
              duration: 5 + (i % 5) * 2, 
              repeat: Infinity, 
              ease: 'linear',
              delay: i * 0.4
            }}
            className="absolute rounded-full"
            style={{ 
              left: `${(i * 5) % 100}%`, 
              top: '-10%',
              width: `${(i % 3) * 2 + 2}px`, 
              height: `${(i % 3) * 2 + 2}px`,
              backgroundColor: i % 2 === 0 ? '#ef4444' : '#F0DFA0',
              boxShadow: `0 0 ${10 + (i % 3) * 5}px ${i % 2 === 0 ? '#ef4444' : '#F0DFA0'}`
            }}
          />
        ))}
        {/* Glowing floating rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`ring-${i}`}
            animate={{ 
              y: [0, -40, 0], 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 6 + i * 2, 
              repeat: Infinity, 
              ease: 'easeInOut',
              delay: i * 2
            }}
            className="absolute rounded-full border border-[#ef4444]/20"
            style={{ 
              left: `${20 + i * 30}%`, 
              top: `${20 + (i % 2) * 30}%`,
              width: `${150 + i * 50}px`, 
              height: `${150 + i * 50}px`,
            }}
          />
        ))}
      </div>
    );
  }

  if (theme === 'kintsugi-fluid') {
    return (
      <div className={`${cn} bg-[#111111]`}>
        {/* Swirling Smoke / Marble fluid base using hardware-accelerated radial gradients instead of expensive CSS blurs */}
        <motion.div
          animate={{ x: [0, 50, -30, 0], y: [0, -40, 20, 0], scale: [1, 1.3, 1], rotate: [0, 45, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full origin-center"
          style={{ background: 'radial-gradient(circle, rgba(42,42,42,0.8) 0%, rgba(17,17,17,0) 70%)', willChange: 'transform' }}
        />
        <motion.div
          animate={{ x: [0, -60, 40, 0], y: [0, 50, -30, 0], scale: [1, 1.4, 1], rotate: [0, -30, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[20%] -right-[20%] w-[80vw] h-[60vw] rounded-full origin-center"
          style={{ background: 'radial-gradient(circle, rgba(26,26,26,0.9) 0%, rgba(17,17,17,0) 70%)', willChange: 'transform' }}
        />
        <motion.div
          animate={{ x: [0, 40, -50, 0], y: [0, -60, 40, 0], scale: [1, 1.5, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-[30%] left-[10%] w-[90vw] h-[70vw] rounded-full origin-center"
          style={{ background: 'radial-gradient(circle, rgba(51,51,51,0.6) 0%, rgba(17,17,17,0) 70%)', willChange: 'transform' }}
        />
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(64,64,64,0.4) 0%, rgba(17,17,17,0) 70%)', willChange: 'transform, opacity' }}
        />

        {/* Vibrant Gold Kintsugi Veins SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-95 pointer-events-none" viewBox="0 0 1600 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="fluid-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="25%" stopColor="#F0DFA0" stopOpacity="1" />
              <stop offset="50%" stopColor="#b91c1c" stopOpacity="0.9" />
              <stop offset="75%" stopColor="#FFF2C8" stopOpacity="1" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
            </linearGradient>
            <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <g filter="url(#gold-glow)">
              {/* Main diagonal crack */}
              <motion.path
                d="M -100 100 Q 200 300 400 250 T 800 400 T 1200 350 T 1700 700"
                fill="transparent"
                stroke="url(#fluid-gold)"
                strokeWidth="4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 1, 0.5, 0], opacity: [0, 1, 1, 0.6, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Branching crack */}
              <motion.path
                d="M 400 250 Q 500 100 650 -50"
                fill="transparent"
                stroke="url(#fluid-gold)"
                strokeWidth="2.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 1, 0.5, 0], opacity: [0, 1, 1, 0.6, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              />
              {/* Secondary lower crack */}
              <motion.path
                d="M -50 600 Q 300 700 500 550 T 900 650 T 1300 500 T 1650 400"
                fill="transparent"
                stroke="url(#fluid-gold)"
                strokeWidth="3.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 1, 0.5, 0], opacity: [0, 1, 1, 0.6, 0] }}
                transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
              />
              {/* Connecting web */}
              <motion.path
                d="M 800 400 Q 850 550 900 650"
                fill="transparent"
                stroke="url(#fluid-gold)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 1, 0.5, 0], opacity: [0, 1, 1, 0.6, 0] }}
                transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
              />
              <motion.path
                d="M 1200 350 Q 1250 200 1400 100 T 1700 50"
                fill="transparent"
                stroke="url(#fluid-gold)"
                strokeWidth="3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 1, 0.5, 0], opacity: [0, 1, 1, 0.6, 0] }}
                transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
              />
          </g>
        </svg>

        {/* Ambient gold floating dust */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={'dust-' + i}
            animate={{ 
              y: ['-10vh', '110vh'], 
              x: Math.sin(i) * 100,
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.5, 0.5]
            }}
            transition={{ 
              duration: 15 + i * 2, 
              repeat: Infinity, 
              ease: 'linear',
              delay: i * 1.5
            }}
            className="absolute rounded-full bg-[#F0DFA0] blur-[2px]"
            style={{ 
              left: `${(i * 13) % 100}%`, 
              top: '-10%',
              width: `${(i % 3) + 3}px`, 
              height: `${(i % 3) + 3}px`,
              boxShadow: '0 0 10px 2px rgba(240, 223, 160, 0.6)'
            }}
          />
        ))}
      </div>
    );
  }

  return null;
}

