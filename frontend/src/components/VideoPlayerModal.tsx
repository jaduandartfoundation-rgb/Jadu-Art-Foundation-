import React, { useEffect, useRef } from 'react';
import { X, Maximize2 } from 'lucide-react';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  thumbnailUrl?: string;
  title?: string;
  caption?: string;
  category?: string;
}

/**
 * Converts a YouTube or Vimeo watch URL into an embeddable iframe URL.
 */
const getEmbedUrl = (url: string): { type: 'iframe' | 'native'; src: string } => {
  if (!url) return { type: 'native', src: url };

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, '');

    // YouTube
    if (hostname === 'youtube.com' || hostname === 'youtu.be') {
      let videoId = '';
      if (hostname === 'youtu.be') {
        videoId = parsed.pathname.slice(1);
      } else {
        videoId = parsed.searchParams.get('v') || '';
      }
      if (videoId) {
        return {
          type: 'iframe',
          src: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
        };
      }
    }

    // Vimeo
    if (hostname === 'vimeo.com') {
      const videoId = parsed.pathname.split('/').filter(Boolean).pop() || '';
      if (videoId) {
        return {
          type: 'iframe',
          src: `https://player.vimeo.com/video/${videoId}?autoplay=1`,
        };
      }
    }
  } catch {
    // fall through to native
  }

  // Direct video URL (mp4, webm, etc.)
  return { type: 'native', src: url };
};

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  thumbnailUrl,
  title,
  caption,
  category,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Pause & reset native video when modal closes
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const { type, src } = getEmbedUrl(videoUrl);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Video player'}
    >
      <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-black">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close video player"
          className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
        >
          <X size={18} />
        </button>

        {/* Video Area */}
        <div className="relative w-full" style={{ paddingTop: '56.25%' /* 16:9 */ }}>
          {type === 'iframe' ? (
            <iframe
              src={src}
              title={title || 'Video'}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            <video
              ref={videoRef}
              src={src}
              poster={thumbnailUrl}
              controls
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-contain bg-black"
              aria-label={title || 'Video'}
            >
              <p className="text-white text-center p-4">
                Your browser doesn&apos;t support video playback.
                <a href={src} target="_blank" rel="noopener noreferrer" className="underline ml-1">
                  Open video directly
                </a>
              </p>
            </video>
          )}
        </div>

        {/* Caption bar */}
        {(title || caption || category) && (
          <div className="px-5 py-4 bg-gray-950 text-white space-y-1">
            {category && (
              <span className="text-[10px] uppercase font-black tracking-wider text-orange-400">
                {category.replace('-', ' ')}
              </span>
            )}
            {title && <h3 className="text-sm font-bold leading-snug">{title}</h3>}
            {caption && caption !== title && (
              <p className="text-xs text-gray-400 font-medium">{caption}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayerModal;
