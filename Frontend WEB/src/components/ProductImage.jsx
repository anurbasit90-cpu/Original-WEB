import React, { useState } from 'react';

const FALLBACK = 'https://placehold.co/600x400/E0E7FF/003366?text=Image+Not+Available';

function ImageWithReset({ src, alt, className }) {
  const [hasError, setHasError] = useState(false);
  const displayedSrc = hasError || !src ? FALLBACK : src;

  const handleError = () => {
    if (!hasError) setHasError(true);
  };

  return <img src={displayedSrc} alt={alt} className={className} onError={handleError} loading="lazy" />;
}

export default function ProductImage({ src, alt, className }) {
  // Gunakan key agar komponen image di-reset setiap kali src berubah (tanpa effect)
  return <ImageWithReset key={src || 'fallback'} src={src} alt={alt} className={className} />;
}
