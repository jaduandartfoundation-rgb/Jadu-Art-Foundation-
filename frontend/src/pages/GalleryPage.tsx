import { useState, useEffect } from 'react';
import BilingualHeading from '../components/BilingualHeading';
import LightboxModal from '../components/LightboxModal';
import { galleryService } from '../services/api';

const GalleryPage = () => {
  const [items, setItems] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImage, setActiveImage] = useState({ src: '', caption: '', category: '' });

  const defaultGallery = [
    {
      image: 'https://images.pexels.com/photos/20556421/pexels-photo-20556421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      caption: 'Indian students studying in a rural classroom with learning charts',
      category: 'education'
    },
    {
      image: 'https://images.pexels.com/photos/14558556/pexels-photo-14558556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      caption: 'Free community healthcare & eye checkup camp in India',
      category: 'healthcare'
    },
    {
      image: 'https://images.pexels.com/photos/12220839/pexels-photo-12220839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      caption: 'Daily green fodder feeding at local gaushala sanctuary',
      category: 'cow-welfare'
    },
    {
      image: 'https://images.pexels.com/photos/5909876/pexels-photo-5909876.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      caption: 'Emergency flood relief food kit distribution drive in India',
      category: 'disaster-relief'
    },
    {
      image: 'https://images.pexels.com/photos/39135359/pexels-photo-39135359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      caption: 'Community sanitation drive and outreach by Indian volunteers',
      category: 'community'
    },
    {
      image: 'https://images.pexels.com/photos/15119089/pexels-photo-15119089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      caption: 'Rural Indian children actively participating in class',
      category: 'education'
    }
  ];

  useEffect(() => {
    galleryService.getGalleryItems()
      .then(res => { if (res.data.data?.length) setItems(res.data.data); })
      .catch(() => {});
  }, []);

  const displayedGallery = items.length > 0 ? items : defaultGallery;
  const filtered = activeCategory === 'all'
    ? displayedGallery
    : displayedGallery.filter(i => i.category === activeCategory);

  const openLightbox = (src: string, caption: string, category: string) => {
    setActiveImage({ src, caption, category });
    setLightboxOpen(true);
  };

  return (
    <div className="bg-warm-off-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <BilingualHeading 
          englishTitle="VISUAL GALLERY"
          hindiTitle="बदलाव की झलकियाँ"
          subtitle="Documentary photography capturing real moments of hope, relief and community care."
        />

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {['all', 'education', 'healthcare', 'cow-welfare', 'disaster-relief', 'community'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold capitalize transition-all ${
                activeCategory === cat
                  ? 'bg-primary-navy text-white shadow-md'
                  : 'bg-white text-gray-700 border border-light-border hover:bg-gray-100'
              }`}
            >
              {cat.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => (
            <div 
              key={idx}
              onClick={() => openLightbox(item.image, item.caption, item.category)}
              className="group relative rounded-2xl overflow-hidden shadow-sm cursor-pointer border border-light-border h-72 bg-gray-200"
            >
              <img 
                src={item.image} 
                alt={item.caption || 'Gallery Image'} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase font-bold bg-primary-saffron text-white px-2.5 py-0.5 rounded-full mb-1.5 inline-block">
                  {item.category?.replace('-', ' ')}
                </span>
                <p className="text-sm font-medium line-clamp-2">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      <LightboxModal
        isOpen={lightboxOpen}
        imageSrc={activeImage.src}
        caption={activeImage.caption}
        category={activeImage.category}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};

export default GalleryPage;
