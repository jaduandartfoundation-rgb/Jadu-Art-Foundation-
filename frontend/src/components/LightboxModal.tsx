import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  imageSrc: string;
  caption?: string;
  category?: string;
  onClose: () => void;
}

const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  imageSrc,
  caption,
  category,
  onClose
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/60 text-white p-2 rounded-full hover:bg-black transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="max-h-[75vh] overflow-hidden flex items-center justify-center bg-black">
          <img
            src={imageSrc}
            alt={caption || 'Gallery Image'}
            className="w-full h-full object-contain max-h-[75vh]"
          />
        </div>

        {(caption || category) && (
          <div className="p-6 bg-white border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <p className="text-gray-800 font-medium text-base">{caption}</p>
            {category && (
              <span className="capitalize text-xs font-semibold px-3 py-1 bg-primary-navy/10 text-primary-navy rounded-full">
                {category.replace('-', ' ')}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LightboxModal;
