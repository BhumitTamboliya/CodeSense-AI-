import React, { useEffect, useRef, useState } from 'react';

/**
 * Reusable wrapper to trigger fade-in animations on scroll
 */
export default function ScrollReveal({ 
  children, 
  className = '', 
  activeClass = 'reveal-active', 
  threshold = 0.1, 
  delayClass = '' 
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold });

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`reveal-init ${isVisible ? activeClass : ''} ${delayClass} ${className}`}
    >
      {children}
    </div>
  );
}
