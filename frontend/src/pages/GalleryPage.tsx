import { useState, useEffect } from 'react';
import BilingualHeading from '../components/BilingualHeading';
import LightboxModal from '../components/LightboxModal';
import VideoPlayerModal from '../components/VideoPlayerModal';
import { galleryService } from '../services/api';
import { Play, Image as ImageIcon, Video } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface GalleryItem {
  _id?: string;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
  image?: string;          // legacy
  thumbnailUrl?: string;
  externalUrl?: string;
  title?: string;
  caption?: string;
  category?: string;
  altText?: string;
}

// ─── Static fallback items (shown before DB loads) ───────────────────────────
const defaultGallery: GalleryItem[] = [
  {
    mediaType: 'image',
    image: 'https://images.pexels.com/photos/20556421/pexels-photo-20556421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    caption: 'Indian students studying in a rural classroom with learning charts',
    category: 'education',
  },
  {
    mediaType: 'image',
    image: 'https://images.pexels.com/photos/14558556/pexels-photo-14558556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    caption: 'Free community healthcare & eye checkup camp in India',
    category: 'healthcare',
  },
  {
    mediaType: 'image',
    image: 'https://images.pexels.com/photos/12220839/pexels-photo-12220839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    caption: 'Daily green fodder feeding at local gaushala sanctuary',
    category: 'cow-welfare',
  },
  {
    mediaType: 'image',
    image: 'https://images.pexels.com/photos/5909876/pexels-photo-5909876.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    caption: 'Emergency flood relief food kit distribution drive in India',
    category: 'disaster-relief',
  },
  {
    mediaType: 'image',
    image: 'https://images.pexels.com/photos/39135359/pexels-photo-39135359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    caption: 'Community sanitation drive and outreach by Indian volunteers',
    category: 'community',
  },
  {
    mediaType: 'image',
    image: 'https://images.pexels.com/photos/15119089/pexels-photo-15119089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    caption: 'Rural Indian children actively participating in class',
    category: 'education',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getItemImage = (item: GalleryItem): string =>
  item.thumbnailUrl || item.mediaUrl || item.image || '';

const getItemVideo = (item: GalleryItem): string =>
  item.externalUrl || item.mediaUrl || '';

const isVideo = (item: GalleryItem): boolean =>
  (item.mediaType || 'image') === 'video';

// ─── Component ────────────────────────────────────────────────────────────────
const GalleryPage = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeMediaType, setActiveMediaType] = useState<'all' | 'image' | 'video'>('all');

  // Image lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImage, setActiveImage] = useState({ src: '', caption: '', category: '' });

  // Video player
  const [videoOpen, setVideoOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<GalleryItem | null>(null);

  useEffect(() => {
    galleryService
      .getGalleryItems()
      .then((res) => {
        if (res.data.data?.length) setItems(res.data.data);
      })
      .catch(() => {});
  }, []);

  const displayedGallery = items.length > 0 ? items : defaultGallery;

  const filtered = displayedGallery.filter((item) => {
    const catOk = activeCategory === 'all' || item.category === activeCategory;
    const typeOk = activeMediaType === 'all' || (item.mediaType || 'image') === activeMediaType;
    return catOk && typeOk;
  });

  const openLightbox = (item: GalleryItem) => {
    setActiveImage({
      src: getItemImage(item),
      caption: item.caption || item.title || '',
      category: item.category || '',
    });
    setLightboxOpen(true);
  };

  const openVideo = (item: GalleryItem) => {
    setActiveVideo(item);
    setVideoOpen(true);
  };

  const handleItemClick = (item: GalleryItem) => {
    if (isVideo(item)) {
      openVideo(item);
    } else {
      openLightbox(item);
    }
  };

  const hasVideos = displayedGallery.some(isVideo);

  return (
    <div className="bg-warm-off-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <BilingualHeading
          englishTitle="VISUAL GALLERY"
          hindiTitle="बदलाव की झलकियाँ"
          subtitle="Documentary photography and video capturing real moments of hope, relief and community care."
        />

        {/* Media Type Tabs (only shown if videos exist) */}
        {hasVideos && (
          <div className="flex flex-wrap justify-center gap-2 mb-5">
            {(['all', 'image', 'video'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveMediaType(t)}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  activeMediaType === t
                    ? 'bg-primary-navy text-white shadow-md'
                    : 'bg-white text-gray-700 border border-light-border hover:bg-gray-100'
                }`}
              >
                {t === 'image' && <ImageIcon size={13} />}
                {t === 'video' && <Video size={13} />}
                <span>{t === 'all' ? 'All Media' : `${t}s`}</span>
              </button>
            ))}
          </div>
        )}

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {['all', 'education', 'healthcare', 'cow-welfare', 'disaster-relief', 'community'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold capitalize transition-all ${
                activeCategory === cat
                  ? 'bg-primary-saffron text-white shadow-md'
                  : 'bg-white text-gray-700 border border-light-border hover:bg-gray-100'
              }`}
            >
              {cat.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 font-medium">
            No items match the selected filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, idx) => {
              const itemIsVideo = isVideo(item);
              const thumbSrc = getItemImage(item);
              const label = item.caption || item.title || '';

              return (
                <div
                  key={item._id || idx}
                  onClick={() => handleItemClick(item)}
                  className="group relative rounded-2xl overflow-hidden shadow-sm cursor-pointer border border-light-border h-72 bg-gray-900"
                  role="button"
                  tabIndex={0}
                  aria-label={`${itemIsVideo ? 'Play video' : 'View image'}: ${label}`}
                  onKeyDown={(e) => e.key === 'Enter' && handleItemClick(item)}
                >
                  {/* Thumbnail / Image */}
                  {thumbSrc ? (
                    <img
                      src={thumbSrc}
                      alt={item.altText || label || (itemIsVideo ? 'Video thumbnail' : 'Gallery image')}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                      <Video size={48} className="text-gray-600" />
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  {/* Video play button */}
                  {itemIsVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/40 group-hover:scale-110 transition-transform">
                        <Play size={26} className="text-white ml-1" fill="white" />
                      </div>
                    </div>
                  )}

                  {/* Media type indicator */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      itemIsVideo ? 'bg-blue-600/90 text-white' : 'bg-white/20 backdrop-blur-sm text-white'
                    }`}>
                      {itemIsVideo ? '▶ Video' : '🖼 Photo'}
                    </span>
                  </div>

                  {/* Caption */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    {item.category && (
                      <span className="text-[10px] uppercase font-bold bg-primary-saffron text-white px-2.5 py-0.5 rounded-full mb-1.5 inline-block">
                        {item.category.replace('-', ' ')}
                      </span>
                    )}
                    {label && (
                      <p className="text-sm font-medium line-clamp-2">{label}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Image Lightbox (existing component, preserved) */}
      <LightboxModal
        isOpen={lightboxOpen}
        imageSrc={activeImage.src}
        caption={activeImage.caption}
        category={activeImage.category}
        onClose={() => setLightboxOpen(false)}
      />

      {/* Video Player Modal (new) */}
      {activeVideo && (
        <VideoPlayerModal
          isOpen={videoOpen}
          onClose={() => { setVideoOpen(false); setActiveVideo(null); }}
          videoUrl={getItemVideo(activeVideo)}
          thumbnailUrl={activeVideo.thumbnailUrl}
          title={activeVideo.title || activeVideo.caption}
          caption={activeVideo.caption}
          category={activeVideo.category}
        />
      )}
    </div>
  );
};

export default GalleryPage;
