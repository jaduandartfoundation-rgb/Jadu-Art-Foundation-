import React, { useState, useEffect } from 'react';
import { X, Search, Image as ImageIcon, Check, Loader2 } from 'lucide-react';
import { mediaService } from '../services/api';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: { secureUrl: string; publicId: string; altText?: string }) => void;
}

const MediaPickerModal: React.FC<MediaPickerModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen, search]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await mediaService.getMediaList({ search, limit: 30 });
      if (res.data.success) {
        setMediaList(res.data.data);
      }
    } catch (err) {
      console.error('Error loading media library:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-primary-navy text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <ImageIcon size={22} className="text-primary-saffron" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Select from Media Library</h3>
              <p className="text-xs text-gray-300">Reuse previously uploaded Cloudinary assets without uploading again</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search images by filename, alt text, or ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-navy bg-white"
            />
          </div>
        </div>

        {/* Media Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-2 text-gray-400">
              <Loader2 className="animate-spin text-primary-navy" size={28} />
              <span className="text-xs font-semibold">Loading assets...</span>
            </div>
          ) : mediaList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-2 text-gray-400">
              <ImageIcon size={36} className="opacity-30" />
              <p className="text-sm font-medium">No media assets found in Cloudinary library.</p>
              <p className="text-xs text-gray-400">Upload a new image directly from the uploader box.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mediaList.map((item) => {
                const isSelected = selectedId === item._id;
                return (
                  <div
                    key={item._id}
                    onClick={() => setSelectedId(item._id)}
                    className={`group relative rounded-xl border-2 overflow-hidden cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary-saffron ring-2 ring-primary-saffron/20 shadow-md scale-[1.02]'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="h-32 bg-gray-100 relative">
                      <img
                        src={item.secureUrl}
                        alt={item.altText || item.filename}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary-saffron text-white flex items-center justify-center shadow-md">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 bg-white">
                      <p className="text-xs font-bold text-gray-800 truncate">{item.filename}</p>
                      <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium mt-1">
                        <span>{item.width ? `${item.width}×${item.height}` : 'Image'}</span>
                        <span>{item.bytes ? `${(item.bytes / 1024).toFixed(0)} KB` : ''}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">
            {selectedId ? '1 item selected' : 'Select an image to use'}
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!selectedId}
              onClick={() => {
                const target = mediaList.find((m) => m._id === selectedId);
                if (target) {
                  onSelect({
                    secureUrl: target.secureUrl,
                    publicId: target.cloudinaryPublicId,
                    altText: target.altText,
                  });
                  onClose();
                }
              }}
              className="px-5 py-2 bg-primary-saffron text-white rounded-xl text-xs font-extrabold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors shadow-sm flex items-center space-x-1.5"
            >
              <Check size={14} />
              <span>Use Selected Image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPickerModal;
