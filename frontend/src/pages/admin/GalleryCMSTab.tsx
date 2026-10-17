import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Trash2, Edit2, Eye, EyeOff, Image as ImageIcon,
  Video, UploadCloud, Link, X, CheckCircle, AlertCircle,
  RefreshCw, Play, GripVertical, Film
} from 'lucide-react';
import { galleryService, mediaService } from '../../services/api';
import ImageUploader from '../../components/ImageUploader';
import VideoPlayerModal from '../../components/VideoPlayerModal';

// ─── Types ────────────────────────────────────────────────────────────────────
type MediaType = 'image' | 'video';
type VideoSource = 'upload' | 'url';
type PublishStatus = 'draft' | 'published';

interface GalleryItemData {
  _id: string;
  mediaType: MediaType;
  mediaUrl?: string;
  image?: string; // legacy
  thumbnailUrl?: string;
  cloudinaryPublicId?: string;
  title?: string;
  caption?: string;
  description?: string;
  altText?: string;
  category?: string;
  videoSource?: VideoSource;
  externalUrl?: string;
  published: boolean;
  displayOrder?: number;
  createdAt?: string;
}

interface FormState {
  mediaType: MediaType;
  videoSource: VideoSource;
  // image upload
  mediaUrl: string;
  cloudinaryPublicId: string;
  altText: string;
  // video url
  externalUrl: string;
  // shared
  title: string;
  caption: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  thumbnailPublicId: string;
  published: boolean;
  displayOrder: number;
}

const BLANK_FORM: FormState = {
  mediaType: 'image',
  videoSource: 'upload',
  mediaUrl: '',
  cloudinaryPublicId: '',
  altText: '',
  externalUrl: '',
  title: '',
  caption: '',
  description: '',
  category: '',
  thumbnailUrl: '',
  thumbnailPublicId: '',
  published: false,
  displayOrder: 0,
};

const CATEGORIES = ['education', 'healthcare', 'cow-welfare', 'disaster-relief', 'community', 'general'];

// ─────────────────────────────────────────────────────────────────────────────

const GalleryCMSTab: React.FC = () => {
  const [items, setItems] = useState<GalleryItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMediaType, setFilterMediaType] = useState<'all' | MediaType>('all');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ ...BLANK_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Video upload state
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoUploadError, setVideoUploadError] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Video preview modal
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<GalleryItemData | null>(null);

  // Toast notifications
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await galleryService.getAllGalleryItems();
      setItems(res.data.data || []);
    } catch {
      showToast('error', 'Failed to load gallery items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ── Toast helper ──────────────────────────────────────────────────────────
  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Modal helpers ─────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingId(null);
    setForm({ ...BLANK_FORM });
    setFormError(null);
    setVideoUploadError(null);
    setModalOpen(true);
  };

  const openEdit = (item: GalleryItemData) => {
    setEditingId(item._id);
    setForm({
      mediaType: item.mediaType || 'image',
      videoSource: item.videoSource || 'upload',
      mediaUrl: item.mediaUrl || item.image || '',
      cloudinaryPublicId: item.cloudinaryPublicId || '',
      altText: item.altText || '',
      externalUrl: item.externalUrl || '',
      title: item.title || item.caption || '',
      caption: item.caption || '',
      description: item.description || '',
      category: item.category || '',
      thumbnailUrl: item.thumbnailUrl || '',
      thumbnailPublicId: '',
      published: item.published,
      displayOrder: item.displayOrder || 0,
    });
    setFormError(null);
    setVideoUploadError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm({ ...BLANK_FORM });
    setFormError(null);
    setVideoUploadError(null);
  };

  // ── Video file upload ─────────────────────────────────────────────────────
  const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
  const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200MB

  const handleVideoFileSelected = async (file: File) => {
    setVideoUploadError(null);

    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      setVideoUploadError('Invalid file type. Only MP4, WebM, and MOV videos are allowed.');
      return;
    }
    if (file.size > MAX_VIDEO_SIZE) {
      setVideoUploadError(`File size is ${(file.size / (1024 * 1024)).toFixed(0)}MB. Maximum is 200MB.`);
      return;
    }

    setVideoUploading(true);
    setVideoProgress(0);

    try {
      // Get video-specific signature
      const sigRes = await mediaService.getSignature('jadu-art/gallery/videos', 'video');
      const sigData = sigRes.data.data;

      const cloudRes = await mediaService.uploadDirectToCloudinary(
        file,
        sigData,
        (pct) => setVideoProgress(pct),
        'video',
      );

      // Register in Media library too
      await mediaService.registerMedia({
        filename: file.name,
        originalFilename: file.name,
        cloudinaryPublicId: cloudRes.public_id,
        secureUrl: cloudRes.secure_url,
        resourceType: 'video',
        format: cloudRes.format || file.name.split('.').pop(),
        bytes: cloudRes.bytes || file.size,
        folder: sigData.folder,
        altText: form.altText || file.name.split('.')[0].replace(/[-_]/g, ' '),
      });

      setForm((prev) => ({
        ...prev,
        mediaUrl: cloudRes.secure_url,
        cloudinaryPublicId: cloudRes.public_id,
      }));

      showToast('success', 'Video uploaded successfully!');
    } catch (err: any) {
      setVideoUploadError(err.response?.data?.message || err.message || 'Video upload failed.');
    } finally {
      setVideoUploading(false);
    }
  };

  // ── Form submit (create or update) ────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Client-side validation
    if (!form.title.trim()) {
      setFormError('Title is required.');
      return;
    }
    if (form.mediaType === 'video') {
      if (form.videoSource === 'upload' && !form.mediaUrl) {
        setFormError('Please upload a video file before saving.');
        return;
      }
      if (form.videoSource === 'url' && !form.externalUrl.trim()) {
        setFormError('Please enter a video URL.');
        return;
      }
    } else {
      if (!form.mediaUrl) {
        setFormError('Please upload an image before saving.');
        return;
      }
    }

    const payload = {
      mediaType: form.mediaType,
      mediaUrl: form.videoSource === 'url' ? form.externalUrl : form.mediaUrl,
      cloudinaryPublicId: form.cloudinaryPublicId,
      thumbnailUrl: form.thumbnailUrl,
      thumbnailPublicId: form.thumbnailPublicId,
      title: form.title.trim(),
      caption: form.caption.trim() || form.title.trim(),
      description: form.description.trim(),
      altText: form.altText.trim(),
      category: form.category,
      videoSource: form.mediaType === 'video' ? form.videoSource : undefined,
      externalUrl: form.mediaType === 'video' && form.videoSource === 'url' ? form.externalUrl.trim() : undefined,
      published: form.published,
      displayOrder: Number(form.displayOrder),
    };

    setSubmitting(true);
    try {
      if (editingId) {
        const res = await galleryService.updateGalleryItem(editingId, payload);
        setItems((prev) => prev.map((it) => (it._id === editingId ? res.data.data : it)));
        showToast('success', 'Gallery item updated successfully!');
      } else {
        const res = await galleryService.createGalleryItem(payload);
        setItems((prev) => [res.data.data, ...prev]);
        showToast('success', 'Gallery item created successfully!');
      }
      closeModal();
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.message || 'Save failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Toggle publish ────────────────────────────────────────────────────────
  const handleTogglePublish = async (item: GalleryItemData) => {
    try {
      const res = await galleryService.togglePublish(item._id);
      setItems((prev) => prev.map((it) => (it._id === item._id ? res.data.data : it)));
      showToast('success', `Item ${res.data.data.published ? 'published' : 'unpublished'}.`);
    } catch {
      showToast('error', 'Failed to toggle publish status.');
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (item: GalleryItemData) => {
    if (!window.confirm(`Delete "${item.title || 'this item'}"? This cannot be undone.`)) return;
    try {
      await galleryService.deleteGalleryItem(item._id);
      setItems((prev) => prev.filter((it) => it._id !== item._id));
      showToast('success', 'Gallery item deleted.');
    } catch {
      showToast('error', 'Failed to delete gallery item.');
    }
  };

  // ── Filtered display ──────────────────────────────────────────────────────
  const displayed = filterMediaType === 'all'
    ? items
    : items.filter((it) => (it.mediaType || 'image') === filterMediaType);

  const effectiveUrl = (item: GalleryItemData) =>
    item.mediaUrl || item.image || item.thumbnailUrl || '';

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-5 z-[999] flex items-center space-x-2 px-4 py-3 rounded-2xl shadow-xl text-sm font-bold text-white transition-all ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <Film className="text-primary-saffron w-6 h-6" />
            <h3 className="text-xl font-black text-primary-navy uppercase tracking-wider">Gallery CMS</h3>
          </div>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Manage image and video gallery items. Only published items appear on the public gallery.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center space-x-2 bg-primary-saffron text-white px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-md hover:bg-orange-600 transition-colors shrink-0"
          id="btn-add-gallery-item"
        >
          <Plus size={16} />
          <span>Add Media</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'image', 'video'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterMediaType(t)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              filterMediaType === t
                ? 'bg-primary-navy text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t === 'image' && <ImageIcon size={12} className="inline mr-1 -mt-0.5" />}
            {t === 'video' && <Video size={12} className="inline mr-1 -mt-0.5" />}
            {t === 'all' ? 'All Media' : `${t}s`}
            <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">
              {t === 'all' ? items.length : items.filter((i) => (i.mediaType || 'image') === t).length}
            </span>
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="py-16 text-center text-sm text-gray-400">Loading gallery items...</div>
      ) : displayed.length === 0 ? (
        <div className="py-16 text-center">
          <Film className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-medium">No gallery items yet. Click "Add Media" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayed.map((item) => {
            const isVideo = (item.mediaType || 'image') === 'video';
            const thumbSrc = item.thumbnailUrl || (isVideo ? '' : effectiveUrl(item));
            return (
              <div
                key={item._id}
                className="group relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Thumbnail */}
                <div className="relative h-44 bg-gray-900">
                  {thumbSrc ? (
                    <img
                      src={thumbSrc}
                      alt={item.altText || item.title || ''}
                      className="w-full h-full object-cover opacity-90"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                      <Video size={32} className="text-gray-600" />
                    </div>
                  )}

                  {/* Media type badge */}
                  <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    isVideo ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                  }`}>
                    {isVideo ? 'VIDEO' : 'IMAGE'}
                  </span>

                  {/* Publish badge */}
                  <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    item.published ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-300'
                  }`}>
                    {item.published ? 'Live' : 'Draft'}
                  </span>

                  {/* Play overlay for video */}
                  {isVideo && (
                    <button
                      onClick={() => { setPreviewItem(item); setPreviewOpen(true); }}
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40"
                      aria-label="Preview video"
                    >
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Play size={24} className="text-white ml-1" fill="white" />
                      </div>
                    </button>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 space-y-1">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {item.title || item.caption || 'Untitled'}
                  </p>
                  {item.category && (
                    <span className="text-[10px] text-gray-500 capitalize">{item.category.replace('-', ' ')}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="px-3 pb-3 flex items-center space-x-1.5">
                  <button
                    onClick={() => openEdit(item)}
                    title="Edit"
                    className="flex-1 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-bold flex items-center justify-center space-x-1 hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 size={12} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleTogglePublish(item)}
                    title={item.published ? 'Unpublish' : 'Publish'}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center space-x-1 transition-colors ${
                      item.published
                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {item.published ? <EyeOff size={12} /> : <Eye size={12} />}
                    <span>{item.published ? 'Unpublish' : 'Publish'}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    title="Delete"
                    className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add / Edit Modal ─────────────────────────────────────────────── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 border border-gray-200">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h4 className="text-lg font-black text-primary-navy uppercase tracking-wider">
                  {editingId ? 'Edit Gallery Item' : 'Add Gallery Item'}
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5 font-medium">
                  Fill in the details. Draft items won't appear publicly until published.
                </p>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* Media Type Toggle */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-2">
                  Media Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['image', 'video'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, mediaType: t, mediaUrl: '', cloudinaryPublicId: '', externalUrl: '' }))}
                      disabled={!!editingId}
                      className={`flex items-center space-x-2.5 p-3.5 rounded-xl border-2 font-bold text-sm transition-all ${
                        form.mediaType === t
                          ? 'border-primary-saffron bg-primary-saffron/5 text-primary-saffron'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {t === 'image' ? <ImageIcon size={18} /> : <Video size={18} />}
                      <span className="capitalize">{t}</span>
                    </button>
                  ))}
                </div>
                {editingId && (
                  <p className="text-[11px] text-amber-600 mt-1.5 font-medium">
                    ⚠ Media type cannot be changed when editing. Create a new item to change type.
                  </p>
                )}
              </div>

              {/* ── IMAGE: Upload Zone ──────────────────────────────────── */}
              {form.mediaType === 'image' && (
                <ImageUploader
                  label="Gallery Image *"
                  value={form.mediaUrl}
                  publicId={form.cloudinaryPublicId}
                  altText={form.altText}
                  folder="jadu-art/gallery"
                  aspectRatioHint="JPG, PNG, WEBP · Max 5MB"
                  onChange={(data) => setForm((prev) => ({
                    ...prev,
                    mediaUrl: data.secureUrl,
                    cloudinaryPublicId: data.publicId,
                    altText: data.altText || prev.altText,
                  }))}
                  onRemove={() => setForm((prev) => ({ ...prev, mediaUrl: '', cloudinaryPublicId: '' }))}
                />
              )}

              {/* ── VIDEO: Source Selector ──────────────────────────────── */}
              {form.mediaType === 'video' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-2">
                      Video Source *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['upload', 'url'] as const).map((vs) => (
                        <button
                          key={vs}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, videoSource: vs, mediaUrl: '', externalUrl: '' }))}
                          className={`flex items-center space-x-2 p-3 rounded-xl border-2 font-bold text-xs transition-all ${
                            form.videoSource === vs
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          {vs === 'upload' ? <UploadCloud size={15} /> : <Link size={15} />}
                          <span>{vs === 'upload' ? 'Upload File' : 'External URL'}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Upload video file */}
                  {form.videoSource === 'upload' && (
                    <div className="space-y-3">
                      {videoUploadError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start space-x-2">
                          <AlertCircle size={14} className="shrink-0 mt-0.5" />
                          <span>{videoUploadError}</span>
                        </div>
                      )}

                      {videoUploading ? (
                        <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl space-y-3 text-center">
                          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 mx-auto flex items-center justify-center animate-bounce">
                            <UploadCloud size={22} />
                          </div>
                          <p className="text-xs font-bold text-blue-800">Uploading video to Cloudinary…</p>
                          <div className="w-full bg-blue-100 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                              style={{ width: `${videoProgress}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-blue-600">{videoProgress}%</span>
                        </div>
                      ) : form.mediaUrl ? (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start space-x-3">
                          <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-green-800">Video uploaded successfully!</p>
                            <p className="text-[11px] text-green-700 truncate mt-0.5">{form.mediaUrl}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, mediaUrl: '', cloudinaryPublicId: '' }))}
                            className="p-1 hover:bg-green-100 rounded-lg transition-colors text-green-700"
                          >
                            <RefreshCw size={14} />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all"
                          onClick={() => videoInputRef.current?.click()}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files?.[0];
                            if (file) handleVideoFileSelected(file);
                          }}
                        >
                          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-3">
                            <Video size={24} />
                          </div>
                          <p className="text-xs font-extrabold text-gray-800">
                            Drag & Drop Video or{' '}
                            <span className="text-blue-600 underline">Browse File</span>
                          </p>
                          <p className="text-[11px] text-gray-400 mt-1">
                            MP4, WebM, MOV · Max 200MB
                          </p>
                        </div>
                      )}

                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/mp4,video/webm,video/ogg,video/quicktime"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleVideoFileSelected(e.target.files[0])}
                      />
                    </div>
                  )}

                  {/* External URL */}
                  {form.videoSource === 'url' && (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Video URL * <span className="text-gray-400 font-normal">(YouTube, Vimeo, or direct .mp4/.webm)</span>
                      </label>
                      <input
                        type="url"
                        value={form.externalUrl}
                        onChange={(e) => setForm((prev) => ({ ...prev, externalUrl: e.target.value }))}
                        placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                        className="w-full p-3 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-[11px] text-gray-400 mt-1">
                        Supported: YouTube, Vimeo, or direct video file URLs. No arbitrary embed HTML accepted.
                      </p>
                    </div>
                  )}

                  {/* Thumbnail for video */}
                  <div className="pt-2 border-t border-gray-100">
                    <ImageUploader
                      label="Video Poster / Thumbnail (Optional)"
                      value={form.thumbnailUrl}
                      publicId={form.thumbnailPublicId}
                      folder="jadu-art/gallery/thumbnails"
                      aspectRatioHint="JPG, PNG, WEBP · Recommended 16:9 · Max 5MB"
                      onChange={(data) => setForm((prev) => ({
                        ...prev,
                        thumbnailUrl: data.secureUrl,
                        thumbnailPublicId: data.publicId,
                      }))}
                      onRemove={() => setForm((prev) => ({ ...prev, thumbnailUrl: '', thumbnailPublicId: '' }))}
                    />
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  required
                  placeholder={form.mediaType === 'video' ? 'e.g. Foundation Annual Event 2025' : 'e.g. Children at Community School'}
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-navy focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                  Description <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Short description of this media item..."
                  className="w-full p-3 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-navy resize-none"
                />
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                  Alt Text / Accessibility Description <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={form.altText}
                  onChange={(e) => setForm((prev) => ({ ...prev, altText: e.target.value }))}
                  placeholder="Describe the content for screen readers..."
                  className="w-full p-3 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-navy"
                />
              </div>

              {/* Category + Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-navy bg-white"
                  >
                    <option value="">Select category...</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c.replace('-', ' ')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.displayOrder}
                    onChange={(e) => setForm((prev) => ({ ...prev, displayOrder: Number(e.target.value) }))}
                    className="w-full p-3 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-navy"
                  />
                </div>
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, published: !prev.published }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    form.published ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
                  role="switch"
                  aria-checked={form.published}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                      form.published ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <div>
                  <span className="text-xs font-extrabold text-gray-800">
                    {form.published ? 'Published (Visible on public gallery)' : 'Draft (Hidden from public)'}
                  </span>
                  <p className="text-[11px] text-gray-500">
                    You can publish/unpublish at any time.
                  </p>
                </div>
              </div>

              {/* Form error */}
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start space-x-2">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || videoUploading}
                  className="px-6 py-2.5 bg-primary-saffron text-white rounded-xl text-xs font-extrabold shadow-sm hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center space-x-1.5"
                >
                  {submitting ? (
                    <><RefreshCw size={14} className="animate-spin" /><span>Saving...</span></>
                  ) : (
                    <><CheckCircle size={14} /><span>{editingId ? 'Save Changes' : 'Create Item'}</span></>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ── Video Preview Modal ──────────────────────────────────────────── */}
      {previewItem && (
        <VideoPlayerModal
          isOpen={previewOpen}
          onClose={() => { setPreviewOpen(false); setPreviewItem(null); }}
          videoUrl={previewItem.externalUrl || previewItem.mediaUrl || ''}
          thumbnailUrl={previewItem.thumbnailUrl}
          title={previewItem.title}
          caption={previewItem.caption}
          category={previewItem.category}
        />
      )}

    </div>
  );
};

export default GalleryCMSTab;
