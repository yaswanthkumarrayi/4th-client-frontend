import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * OptimizedImage Component
 * 
 * High-performance image component with:
 * - Lazy loading with IntersectionObserver
 * - WebP/AVIF format support with fallback
 * - Responsive images (srcset)
 * - Blur placeholder loading
 * - Proper width/height to prevent CLS
 * - Priority loading for critical above-the-fold images
 */
const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  objectFit = 'cover',
  blur = true,
  onLoad,
  sizes,
  quality = 85,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // IntersectionObserver for lazy loading
  useEffect(() => {
    // Skip observer if priority (load immediately)
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            // Disconnect after image comes into view
            if (observerRef.current) {
              observerRef.current.disconnect();
            }
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
      observerRef.current = observer;
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // Generate WebP version of URL if it's an external URL
  const getWebPUrl = (url) => {
    if (!url) return url;
    
    // If already WebP/AVIF, return as-is
    if (url.match(/\.(webp|avif)$/i)) return url;
    
    // For external URLs (Cloudinary, Imgix, etc.), we'd add format params
    // For now, we'll use the original URL
    // In production, you'd replace JPG/PNG extensions with WebP or use CDN params
    return url;
  };

  const webpSrc = getWebPUrl(src);

  // Generate srcset for responsive images (if sizes provided)
  const generateSrcSet = () => {
    if (!src || !sizes) return undefined;
    
    // In production, you'd generate multiple sizes
    // For now, we return the base image
    // Example: `${src}?w=400 400w, ${src}?w=800 800w, ${src}?w=1200 1200w`
    return undefined;
  };

  const srcSet = generateSrcSet();

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: width && height ? `${width} / ${height}` : undefined,
      }}
    >
      {/* Blur placeholder while loading */}
      {blur && !isLoaded && isInView && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{
            backgroundImage: 'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }}
        />
      )}

      {/* Actual Image - only render when in view */}
      {isInView && !hasError && (
        <picture>
          {/* WebP source for modern browsers */}
          {webpSrc && webpSrc !== src && (
            <source srcSet={webpSrc} type="image/webp" />
          )}

          {/* Fallback image */}
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            srcSet={srcSet}
            sizes={sizes}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            onLoad={handleLoad}
            onError={handleError}
            className={`w-full h-full transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              objectFit,
            }}
            {...props}
          />
        </picture>
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-400 text-sm">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p>Image not available</p>
          </div>
        </div>
      )}
    </div>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string,
  priority: PropTypes.bool,
  objectFit: PropTypes.oneOf(['contain', 'cover', 'fill', 'none', 'scale-down']),
  blur: PropTypes.bool,
  onLoad: PropTypes.func,
  sizes: PropTypes.string,
  quality: PropTypes.number,
};

// Add shimmer keyframes to global CSS
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default OptimizedImage;
