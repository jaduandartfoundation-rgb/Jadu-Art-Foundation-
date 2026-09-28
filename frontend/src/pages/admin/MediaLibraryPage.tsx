import React, { useState, useEffect } from 'react';
import { Search, Image as ImageIcon, Trash2, Edit3, Eye, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { mediaService } from '../../services/api';

const MediaLibraryPage: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  // Detail / Usage Modal state
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [usageData, setUsageData] = useState<any>(null);
  const [loadingUsage, setLoadingUsage] = useState(false);
  const [deleteWarning, setDeleteWarning] = useState<any>(null);
  const [editingMetadata, setEditingMetadata] = useState<any>(null);

  useEffect(() => {
    fetchMedia();
  }, [search, page]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await mediaService.getMediaList({ search, page, limit: 20 });
      if (res.data.success) {
        setMediaItems(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching media:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInspectUsage = async (item: any) => {
    setSelectedMedia(item);
    setLoadingUsage(true);
    try {
      const res = await mediaService.getMediaUsage(item._id);
      if (res.data.success) {
        setUsageData(res.data.data);
      }
    } catch (err) {
      console.error('Error checking media usage:', err);
    } finally {
      setLoadingUsage(false);
    }
  };

  const handleDeleteAttempt = async (item: any) => {
    try {
      // First attempt standard delete
      const res = await mediaService.deleteMedia(item._id, false);
      if (res.data.success) {
        fetchMedia();
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        // Usage conflict
        setDeleteWarning({
          item,
          usages: err.response.data.data.usages,
          usageCount: err.response.data.data.usageCount,
        });
      } else {
        alert(err.response?.data?.message || 'Failed to delete media asset.');
      }
    }
  };

  const handleConfirmForceDelete = async () => {
    if (!deleteWarning) return;
    try {
      await mediaService.deleteMedia(deleteWarning.item._id, true);
      setDeleteWarning(null);
      fetchMedia();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Force delete failed.');
    }
  };

  const handleSaveMetadata = async () => {
    if (!editingMetadata) return;
    try {
      await mediaService.updateMedia(editingMetadata._id, {
        altText: editingMetadata.altText,
        caption: editingMetadata.caption,
        filename: editingMetadata.filename,
      });
      setEditingMetadata(null);
      fetchMedia();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update metadata.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-primary-navy tracking-tight">Cloudinary Media Library</h2>
          <p className="text-xs text-gray-500 font-medium">
            Centralized hub for all image assets, usage tracking across pages, and metadata optimization.
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[280px]">
          <Search className="absolute left-3.5 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search filename, alt text, public ID..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-navy"
          />
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-3">
          <Loader2 className="animate-spin text-primary-navy" size={32} />
          <span className="text-xs font-semibold text-gray-500">Loading Cloudinary Media Assets...</span>
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-gray-200 text-center space-y-3">
          <ImageIcon className="mx-auto text-gray-300" size={48} />
          <h3 className="text-base font-bold text-gray-700">No Media Assets Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Upload images from any CMS editor form or drag & drop files directly to populate your Cloudinary library.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mediaItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-44 bg-gray-100 relative overflow-hidden">
                  <img
                    src={item.secureUrl}
                    alt={item.altText || item.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                    {item.format || 'IMAGE'}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="text-xs font-black text-primary-navy truncate">{item.filename}</h4>
                  <p className="text-[11px] text-gray-500 italic line-clamp-1">
                    Alt: {item.altText || 'No alt text set'}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-semibold pt-1 border-t border-gray-100">
                    <span>{item.width ? `${item.width}×${item.height}px` : 'Dynamic'}</span>
                    <span>{item.bytes ? `${(item.bytes / 1024).toFixed(0)} KB` : ''}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => handleInspectUsage(item)}
                  className="px-2.5 py-1.5 bg-white border border-gray-200 hover:border-primary-navy text-primary-navy rounded-lg text-[11px] font-bold transition-colors flex items-center space-x-1"
                >
                  <Eye size={12} />
                  <span>Inspect Usage</span>
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setEditingMetadata({ ...item })}
                    className="p-1.5 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                    title="Edit Alt Text & Caption"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteAttempt(item)}
                    className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    title="Delete Asset"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Usage Inspection Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="p-5 bg-primary-navy text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Media Usage Details</h3>
              <button onClick={() => setSelectedMedia(null)} className="text-white hover:opacity-80">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedMedia.secureUrl}
                  alt={selectedMedia.filename}
                  className="w-20 h-20 rounded-xl object-cover border border-gray-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-gray-800">{selectedMedia.filename}</h4>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{selectedMedia.cloudinaryPublicId}</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">
                    Uploaded {new Date(selectedMedia.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Active Database References</h5>
                {loadingUsage ? (
                  <div className="flex items-center space-x-2 text-xs text-gray-400 py-4">
                    <Loader2 className="animate-spin" size={16} />
                    <span>Scanning MongoDB collections...</span>
                  </div>
                ) : usageData?.usages?.length === 0 ? (
                  <p className="text-xs text-gray-500 py-2">No active database records currently reference this image.</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {usageData?.usages?.map((ref: any, idx: number) => (
                      <div key={idx} className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                        <span className="font-bold text-primary-navy">{ref.name}</span>
                        <span className="text-[10px] bg-primary-saffron/10 text-primary-saffron font-bold px-2 py-0.5 rounded-full uppercase">
                          {ref.collection}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Conflict Warning Modal */}
      {deleteWarning && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-red-200">
            <div className="p-5 bg-red-600 text-white flex items-center space-x-3">
              <AlertTriangle size={24} />
              <h3 className="text-base font-bold">Image Currently In Use</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                This image <strong className="text-black">{deleteWarning.item.filename}</strong> is currently being used in{' '}
                <span className="text-red-600 font-extrabold">{deleteWarning.usageCount} location(s)</span> across the site:
              </p>

              <div className="p-3 bg-red-50 rounded-xl space-y-1.5 border border-red-100 max-h-36 overflow-y-auto">
                {deleteWarning.usages.map((u: any, idx: number) => (
                  <div key={idx} className="text-xs text-red-800 font-semibold">
                    • {u.name} ({u.collection})
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-gray-500">
                Deleting this image will remove it from Cloudinary and may cause broken image links on public website pages.
              </p>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => setDeleteWarning(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmForceDelete}
                  className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 shadow-md"
                >
                  Delete Anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metadata Edit Modal */}
      {editingMetadata && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="p-5 bg-primary-navy text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Edit Media Metadata</h3>
              <button onClick={() => setEditingMetadata(null)} className="text-white hover:opacity-80">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Filename</label>
                <input
                  type="text"
                  value={editingMetadata.filename || ''}
                  onChange={(e) => setEditingMetadata({ ...editingMetadata, filename: e.target.value })}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Alt Text (Accessibility & SEO)</label>
                <input
                  type="text"
                  value={editingMetadata.altText || ''}
                  onChange={(e) => setEditingMetadata({ ...editingMetadata, altText: e.target.value })}
                  placeholder="Describe image subject..."
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Caption</label>
                <input
                  type="text"
                  value={editingMetadata.caption || ''}
                  onChange={(e) => setEditingMetadata({ ...editingMetadata, caption: e.target.value })}
                  placeholder="Optional caption text..."
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-navy"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => setEditingMetadata(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMetadata}
                  className="px-5 py-2 bg-primary-saffron text-white text-xs font-extrabold rounded-xl hover:bg-orange-600 shadow-md flex items-center space-x-1.5"
                >
                  <CheckCircle size={14} />
                  <span>Save Metadata</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibraryPage;
