import React, { useEffect, useState } from 'react';
import Icons from './Icons';

export default function BackToTopButton({ t }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.pageYOffset > 300);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-40 bg-[#003366] text-white p-3 rounded-full shadow-lg hover:bg-blue-800 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'
      }`}
      title={t.backToTop}
      aria-label={t.backToTop}
    >
      {Icons.chevronUp}
    </button>
  );
}
