import React from 'react';

interface BilingualHeadingProps {
  englishTitle: string;
  hindiTitle: string;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
}

const BilingualHeading: React.FC<BilingualHeadingProps> = ({
  englishTitle,
  hindiTitle,
  subtitle,
  align = 'center',
  className = ''
}) => {
  const alignClass = align === 'center' ? 'text-center' : 'text-left';

  return (
    <div className={`mb-12 ${alignClass} ${className}`}>
      <div className="inline-flex items-center space-x-2 bg-primary-saffron/10 text-primary-saffron px-3.5 py-1 rounded-full border border-primary-saffron/20 mb-3 text-sm font-semibold tracking-wide">
        <span>{hindiTitle}</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-extrabold text-primary-navy tracking-tight leading-tight">
        {englishTitle}
      </h2>
      {subtitle && (
        <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default BilingualHeading;
