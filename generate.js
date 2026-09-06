const fs = require('fs');
const code = \import React, { useRef, useEffect, useState } from 'react';

const AutoScrollContainer = ({ children, direction = 'left', speed = 0.5, className = '' }) => {
  const containerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let lastTime = performance.now();

    const scroll = (time) => {
      if (isPaused) {
        lastTime = time;
        rafRef.current = requestAnimationFrame(scroll);
        return;
      }

      const deltaTime = time - lastTime;
      lastTime = time;
      const movePixels = speed * (deltaTime / 16); 

      if (direction === 'left') {
        el.scrollLeft += movePixels;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
          el.scrollLeft = 0;
        }
      } else {
        if (el.scrollLeft <= 0) {
          el.scrollLeft = el.scrollWidth - el.clientWidth;
        }
        el.scrollLeft -= movePixels;
      }

      rafRef.current = requestAnimationFrame(scroll);
    };

    rafRef.current = requestAnimationFrame(scroll);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [direction, speed, isPaused]);

  return (
    <div 
      ref={containerRef}
      className={'overflow-x-auto scrollbar-none ' + className}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {children}
    </div>
  );
};

export default AutoScrollContainer;\;
fs.writeFileSync('src/components/AutoScrollContainer.jsx', code);

