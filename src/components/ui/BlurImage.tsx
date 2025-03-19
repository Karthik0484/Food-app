import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface BlurImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export const BlurImage = ({
  src,
  alt,
  className,
  containerClassName,
}: BlurImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Placeholder image URL to use if the main image fails to load
  const placeholderUrl = "/placeholder.svg";

  useEffect(() => {
    if (!imgRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(imgRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    console.error(`Failed to load image: ${src}`);
    setHasError(true);
    setIsLoaded(true); // Mark as loaded to remove the blur effect
  };

  return (
    <div
      className={cn(
        "overflow-hidden relative",
        containerClassName
      )}
    >
      {/* Low quality image placeholder */}
      <div
        className={cn(
          "absolute inset-0 bg-gray-200 blur-lg transform scale-110",
          isLoaded ? "animate-fade-out opacity-0" : "opacity-100"
        )}
      />
      
      {/* Main image */}
      {isInView && (
        <img
          ref={imgRef}
          src={hasError ? placeholderUrl : src}
          alt={alt}
          className={cn(
            "transition-opacity duration-500 ease-in-out",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
      )}
    </div>
  );
};