import { useState } from 'react';
import { Package } from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function ProductImage({ src, alt, className = '' }: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-stone-100 via-stone-50 to-teal-50/60 text-slate-500 p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Package className="w-8 h-8 text-teal-700/60 mb-2" aria-hidden="true" />
        <span className="text-xs font-medium text-slate-600 line-clamp-2 max-w-[180px]">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
