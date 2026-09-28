import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, RefreshCw, FolderOpen, AlertCircle } from 'lucide-react';
import { mediaService } from '../services/api';
import MediaPickerModal from './MediaPickerModal';

interface ImageUploaderProps {
  value?: string;
  publicId?: string;
  altText?: string;
  caption?: string;
  onChange: (data: { secureUrl: string; publicId: string; altText?: string; caption?: string }) => void;
  onRemove?: () => void;
  folder?: string;
  label?: string;
  aspectRatioHint?: string;
  allowBulk?: boolean;
  onBulkUploaded?: (items: Array<{ secureUrl: string; publicId: string; altText?: string; caption?: string }>) => void;
}

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'image/avif',
  'image/svg+xml',
  'image/x-icon',
  'image/vnd.microsoft.icon',
  'image/ico'
];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  publicId = '',
  altText = '',
  caption = '',
  onChange,
  onRemove,
  folder = 'jadu-art',
  label = 'Image',
  aspectRatioHint = 'JPG, PNG, WEBP (Max 5MB)',
  allowBulk = false,
  onBulkUploaded,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Local state for Alt Text & Caption metadata
  const [alt, setAlt] = useState(altText);
  const [cap, setCap] = useState(caption);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate file format and size
  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      return 'Invalid file type. Only JPG, PNG, and WEBP images are allowed (SVG, GIF, PDF rejected).';
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `File size is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum allowed limit is 5MB.`;
    }
    return null;
  };

  const handleFilesSelected = async (files: FileList | File[]) => {
    setError(null);

    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    // Handle Bulk upload mode
    if (allowBulk && fileArray.length > 1 && onBulkUploaded) {
      setUploading(true);
      const uploadedResults: Array<{ secureUrl: string; publicId: string; altText?: string; caption?: string }> = [];

      try {
        const sigRes = await mediaService.getSignature(folder);
        const sigData = sigRes.data.data;

        for (let i = 0; i < fileArray.length; i++) {
          const file = fileArray[i];
          const err = validateFile(file);
          if (err) continue;

          setProgress(Math.round(((i + 0.5) / fileArray.length) * 100));

          const cloudRes = await mediaService.uploadDirectToCloudinary(file, sigData);
          const secureUrl = cloudRes.secure_url;
          const pubId = cloudRes.public_id;

          // Register in MongoDB
          await mediaService.registerMedia({
            filename: file.name,
            originalFilename: file.name,
            cloudinaryPublicId: pubId,
            secureUrl,
            resourceType: cloudRes.resource_type || 'image',
            format: cloudRes.format || file.name.split('.').pop(),
            width: cloudRes.width || 0,
            height: cloudRes.height || 0,
            bytes: cloudRes.bytes || file.size,
            folder: sigData.folder,
            altText: file.name.split('.')[0].replace(/[-_]/g, ' '),
          });

          uploadedResults.push({
            secureUrl,
            publicId: pubId,
            altText: file.name.split('.')[0].replace(/[-_]/g, ' '),
          });
        }

        setProgress(100);
        onBulkUploaded(uploadedResults);
      } catch (err: any) {
        setError(err.message || 'Bulk upload failed. Please try again.');
      } finally {
        setUploading(false);
      }
      return;
    }

    // Single upload mode
    const file = fileArray[0];
    const validationErr = validateFile(file);
    if (validationErr) {
      setError(validationErr);
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Step 1: Get backend signature
      const sigRes = await mediaService.getSignature(folder);
      const sigData = sigRes.data.data;

      // Step 2: Upload to Cloudinary with progress tracking
      const cloudRes = await mediaService.uploadDirectToCloudinary(file, sigData, (pct) => {
        setProgress(pct);
      });

      const secureUrl = cloudRes.secure_url;
      const pubId = cloudRes.public_id;
      const defaultAlt = alt || file.name.split('.')[0].replace(/[-_]/g, ' ');

      // Step 3: Register in MongoDB Media Collection
      await mediaService.registerMedia({
        filename: file.name,
        originalFilename: file.name,
        cloudinaryPublicId: pubId,
        secureUrl,
        resourceType: cloudRes.resource_type || 'image',
        format: cloudRes.format || file.name.split('.').pop(),
        width: cloudRes.width || 0,
        height: cloudRes.height || 0,
        bytes: cloudRes.bytes || file.size,
        folder: sigData.folder,
        altText: defaultAlt,
        caption: cap,
      });

      setAlt(defaultAlt);
      onChange({
        secureUrl,
        publicId: pubId,
        altText: defaultAlt,
        caption: cap,
      });
    } catch (err: any) {
      setError(err.message || 'Image upload failed. Check connection & try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleAltBlur = () => {
    if (value) {
      onChange({ secureUrl: value, publicId, altText: alt, caption: cap });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          className="inline-flex items-center space-x-1 text-xs font-bold text-primary-navy hover:text-primary-saffron transition-colors"
        >
          <FolderOpen size={14} />
          <span>Choose from Media Library</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2 animate-shake">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* State A: Upload Progress Bar */}
      {uploading ? (
        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-3 text-center">
          <div className="w-12 h-12 rounded-full bg-primary-saffron/10 text-primary-saffron mx-auto flex items-center justify-center animate-bounce">
            <UploadCloud size={24} />
          </div>
          <p className="text-xs font-bold text-gray-700">Uploading image to Cloudinary...</p>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-primary-saffron h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-xs font-semibold text-gray-500">{progress}%</span>
        </div>
      ) : value ? (
        /* State B: Uploaded Image Preview & Metadata Edit */
        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 shadow-sm relative group">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-4 h-36 bg-gray-100 rounded-xl overflow-hidden relative border border-gray-200">
              <img src={value} alt={alt || 'Uploaded image'} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                CLOUDINARY
              </div>
            </div>

            <div className="sm:col-span-8 space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Alt Text (Accessibility & SEO)</label>
                <input
                  type="text"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  onBlur={handleAltBlur}
                  placeholder="Describe image context (e.g. Children in classroom)..."
                  className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-navy bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Caption (Optional)</label>
                <input
                  type="text"
                  value={cap}
                  onChange={(e) => setCap(e.target.value)}
                  onBlur={handleAltBlur}
                  placeholder="Optional caption..."
                  className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-navy bg-gray-50"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1"
                >
                  <RefreshCw size={12} />
                  <span>Replace Image</span>
                </button>

                {onRemove && (
                  <button
                    type="button"
                    onClick={onRemove}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1"
                  >
                    <X size={12} />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* State C: Drag & Drop Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-primary-saffron bg-primary-saffron/5 scale-[1.01]'
              : 'border-gray-300 hover:border-primary-navy hover:bg-gray-50/80 bg-white'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-500 mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <UploadCloud size={24} className="text-primary-navy" />
          </div>
          <p className="text-xs font-extrabold text-gray-800 tracking-tight">
            Drag & Drop Image Here or <span className="text-primary-saffron underline">Browse Files</span>
          </p>
          <p className="text-[11px] text-gray-400 font-medium mt-1">{aspectRatioHint}</p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={allowBulk}
        accept="image/jpeg,image/png,image/webp,image/jpg,image/avif,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,image/ico"
        onChange={(e) => e.target.files && handleFilesSelected(e.target.files)}
        className="hidden"
      />

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(selected) => {
          setAlt(selected.altText || '');
          onChange({
            secureUrl: selected.secureUrl,
            publicId: selected.publicId,
            altText: selected.altText || '',
            caption: cap,
          });
        }}
      />
    </div>
  );
};

export default ImageUploader;
