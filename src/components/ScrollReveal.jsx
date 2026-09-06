import React, { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({ children, className = "", delay = 0, animation = "fade-up" }) {
  const [isVisible, setIsVisible] = useState(() => {
    return (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') ||
           (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'test');
  });
  const domRef = useRef();

  useEffect(() => {
    if (isVisible) return;

    if ((typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') || (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'test')) {
      setIsVisible(true);
      return;
    }

    // Fail-safe timer to ensure content is never permanently hidden/blank
    const fallbackTimer = setTimeout(() => {
      setIsVisible(true);
    }, 600 + delay);

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (domRef.current) {
            observer.unobserve(domRef.current);
          }
          clearTimeout(fallbackTimer);
        }
      });
    }, {
      threshold: 0.001,
      rootMargin: "250px 0px 250px 0px"
    });

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => {
      clearTimeout(fallbackTimer);
      if (domRef.current) {
        observer.unobserve(domRef.current);
      }
    };
  }, [delay, isVisible]);

  const getAnimationClass = () => {
    switch (animation) {
      case 'fade-left': return 'reveal-fade-left';
      case 'fade-right': return 'reveal-fade-right';
      case 'scale-up': return 'reveal-scale-up';
      case 'fade-down': return 'reveal-fade-down';
      default: return 'reveal-fade-up';
    }
  };

  return (
    <div
      ref={domRef}
      className={`${getAnimationClass()} ${isVisible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

