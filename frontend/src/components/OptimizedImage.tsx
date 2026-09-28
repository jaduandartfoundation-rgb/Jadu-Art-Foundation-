import React from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  widthTransform?: number;
  heightTransform?: number;
  cropTransform?: string;
  fallbackSrc?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  widthTransform,
  heightTransform,
  cropTransform = 'fill',
  fallbackSrc = 'https://images.pexels.com/photos/1183434/pexels-photo-1183434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  className = '',
  loading = 'lazy',
  ...rest
}) => {
  const getTransformedUrl = (originalUrl: string) => {
    if (!originalUrl) return fallbackSrc;

    // Check if it's a Cloudinary URL
    if (originalUrl.includes('res.cloudinary.com') && originalUrl.includes('/upload/')) {
      const parts = originalUrl.split('/upload/');
      if (parts.length === 2) {
        const transformations = ['f_auto', 'q_auto'];
        if (widthTransform) transformations.push(`w_${widthTransform}`);
        if (heightTransform) transformations.push(`h_${heightTransform}`);
        if (widthTransform && heightTransform && cropTransform) transformations.push(`c_${cropTransform}`);

        const transformString = transformations.join(',');
        return `${parts[0]}/upload/${transformString}/${parts[1]}`;
      }
    }

    return originalUrl;
  };

  const finalSrc = getTransformedUrl(src);

  return (
    <img
      src={finalSrc}
      alt={alt || 'Jadu & Art Foundation'}
      loading={loading}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        if (target.src !== fallbackSrc) {
          target.src = fallbackSrc;
        }
      }}
      {...rest}
    />
  );
};

export default OptimizedImage;
