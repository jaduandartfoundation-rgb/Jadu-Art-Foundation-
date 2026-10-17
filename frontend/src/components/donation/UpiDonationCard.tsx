import React, { useState } from 'react';
import { QrCode, Maximize2, Download, Copy, Check, ShieldAlert, ArrowRight, ShieldCheck, X, Loader2 } from 'lucide-react';

interface UpiDonationCardProps {
  upiConfig: {
    isPublished?: boolean;
    upiId?: string | null;
    recipientName?: string;
    isClickable?: boolean;
    statusMessage?: string;
  };
  qrConfig: {
    isPublished?: boolean;
    qrImageUrl?: string | null;
    localFallbackUrl?: string;
    recipientName?: string;
    statusMessage?: string;
  };
  onScrollToConfirmation?: () => void;
}

const UpiDonationCard: React.FC<UpiDonationCardProps> = ({ upiConfig, qrConfig, onScrollToConfirmation }) => {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Official QR image url: cloud or local fallback
  const qrImageSrc = qrConfig.qrImageUrl || qrConfig.localFallbackUrl || '/official-pnb-qr.jpg';
  const recipientName = upiConfig.recipientName || qrConfig.recipientName || 'JADU AND ART FOUNDATION';
  const upiId = upiConfig.upiId;
  const isUpiVerified = upiConfig.isPublished === true && !!upiId;

  const copyUpiId = () => {
    if (!upiId) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(upiId).then(() => {
          setCopiedUpi(true);
          setCopyFeedback('UPI ID copied successfully.');
          setTimeout(() => {
            setCopiedUpi(false);
            setCopyFeedback(null);
          }, 3000);
        });
      } else {
        const ta = document.createElement('textarea');
        ta.value = upiId;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        setCopiedUpi(true);
        setCopyFeedback('UPI ID copied successfully.');
        setTimeout(() => {
          setCopiedUpi(false);
          setCopyFeedback(null);
        }, 3000);
      }
    } catch (err) {
      setCopyFeedback('Unable to copy UPI ID.');
      setTimeout(() => setCopyFeedback(null), 3000);
    }
  };

  const [downloadingQr, setDownloadingQr] = useState(false);

  const downloadQr = async () => {
    if (downloadingQr) return;
    setDownloadingQr(true);

    const filename = 'jadu-and-art-foundation-official-upi-qr.jpg';

    // Helper to trigger direct local download via an invisible link
    const triggerDownload = (url: string) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    try {
      // Primary Strategy: Fetch image and create a local Blob URL
      // Browser strictly enforces download attribute for blob: URLs without opening new tab
      const response = await fetch(qrImageSrc, { mode: 'cors' });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      triggerDownload(blobUrl);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 2000);
    } catch (err) {
      console.warn('Direct blob fetch failed, attempting canvas conversion:', err);
      // Secondary Strategy: Draw to canvas and export base64 data URL
      try {
        await new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = img.naturalWidth || 600;
              canvas.height = img.naturalHeight || 600;
              const ctx = canvas.getContext('2d');
              if (!ctx) throw new Error('Canvas 2D context unavailable');
              ctx.drawImage(img, 0, 0);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
              triggerDownload(dataUrl);
              resolve();
            } catch (canvasErr) {
              reject(canvasErr);
            }
          };
          img.onerror = () => reject(new Error('Image failed to load onto canvas'));
          img.src = qrImageSrc;
        });
      } catch (fallbackErr) {
        console.warn('Canvas conversion failed, applying attachment header fallback:', fallbackErr);
        // Tertiary Strategy: If Cloudinary URL, use fl_attachment transformation to force attachment disposition
        let targetUrl = qrImageSrc;
        if (targetUrl.includes('res.cloudinary.com') && targetUrl.includes('/upload/')) {
          targetUrl = targetUrl.replace('/upload/', '/upload/fl_attachment:jadu-art-official-qr/');
        }
        triggerDownload(targetUrl);
      }
    } finally {
      setDownloadingQr(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-emerald-900/10 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* Header Banner */}
      <div 
        className="bg-[#063F36] bg-gradient-to-r from-[#063F36] to-[#006B3C] p-5 sm:p-8 text-white relative overflow-hidden"
        style={{ backgroundColor: '#063F36', color: '#ffffff' }}
      >
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 rounded-full bg-white/5 pointer-events-none blur-xl" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-2 border border-white/20">
              <QrCode size={13} className="text-[#F47B20]" />
              <span>INSTANT ZERO-FEE DONATION</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              DONATE USING UPI
            </h3>
            <p className="text-emerald-100 font-medium text-xs sm:text-sm mt-0.5 hindi-text">
              UPI से दान करें (Google Pay, PhonePe, Paytm, BHIM)
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-[#C99020]/20 text-amber-200 border border-amber-300/30">
              <ShieldCheck size={14} className="text-[#C99020]" />
              <span>Official Merchant QR</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 sm:p-8 space-y-6">
        {/* Copy Toast Feedback */}
        {copyFeedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-2">
              <Check size={16} className="text-emerald-600 shrink-0" />
              <span>{copyFeedback}</span>
            </div>
            <span className="text-[10px] text-emerald-700 uppercase tracking-wider font-extrabold">Ready</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Column: Official QR Image Display */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative p-3.5 sm:p-5 bg-white rounded-3xl border-2 border-emerald-100 shadow-md hover:shadow-lg transition-all group max-w-[260px] sm:max-w-[320px] w-full text-center mx-auto">
              {/* Official Punjab National Bank Banner Header */}
              <div className="mb-3 border-b border-gray-100 pb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block">
                  PNB Official Merchant QR
                </span>
                <p className="text-xs font-black text-[#063F36] mt-1 truncate">
                  {recipientName}
                </p>
              </div>

              {/* QR Image with Automatic Local Fallback */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100 cursor-pointer" onClick={() => setIsModalOpen(true)}>
                <img
                  src={qrImageSrc}
                  alt="Jadu & Art Foundation Official UPI QR Code"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== (qrConfig.localFallbackUrl || '/official-pnb-qr.jpg')) {
                      target.src = qrConfig.localFallbackUrl || '/official-pnb-qr.jpg';
                    }
                  }}
                  className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-[#063F36] text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md flex items-center space-x-1.5">
                    <Maximize2 size={13} />
                    <span>Click to Enlarge</span>
                  </span>
                </div>
              </div>

              {/* Verified Merchant Tag */}
              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-center space-x-1.5 text-xs font-extrabold text-[#006B3C]">
                <ShieldCheck size={15} />
                <span>Verified Recipient: {recipientName}</span>
              </div>
            </div>

            {/* QR Quick Actions */}
            <div className="flex items-center space-x-2 mt-4 w-full max-w-[320px]">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex-1 py-2 px-3 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Maximize2 size={14} />
                <span>Enlarge QR</span>
              </button>

              <button
                type="button"
                onClick={downloadQr}
                disabled={downloadingQr}
                className="flex-1 py-2 px-3 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 disabled:opacity-60 text-[#006B3C] border border-emerald-200 rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                title="Download official QR code image"
              >
                {downloadingQr ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download size={14} />
                    <span>Download QR</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Step-by-Step Instructions & Verified ID */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <h4 className="text-base sm:text-lg font-black text-[#063F36] uppercase tracking-wide flex items-center space-x-2">
                <span>Scan with Any UPI Application</span>
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Supported apps: Google Pay, PhonePe, Paytm, BHIM, Amazon Pay, Cred & all mobile banking UPI apps.
              </p>
            </div>

            {/* Verified UPI ID Field or Status */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Official UPI Address
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                {isUpiVerified ? (
                  <>
                    <span className="text-sm sm:text-base font-mono font-extrabold text-[#063F36]">
                      {upiId}
                    </span>
                    <button
                      type="button"
                      onClick={copyUpiId}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm transition-all"
                    >
                      {copiedUpi ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                      <span>{copiedUpi ? 'Copied' : 'Copy UPI ID'}</span>
                    </button>
                  </>
                ) : (
                  <div className="space-y-1">
                    <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      <span>UPI ID Under Verification</span>
                    </div>
                    <p className="text-[11px] text-gray-600">
                      Direct text UPI link is disabled pending admin confirmation. Please scan the official Punjab National Bank QR code directly using your UPI app.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Numbered Scanning Steps */}
            <div className="space-y-2.5 text-xs text-gray-700">
              <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-gray-50/70">
                <span className="w-5 h-5 rounded-full bg-[#006B3C] text-white flex items-center justify-center font-black text-[11px] shrink-0 mt-0.5">1</span>
                <span>Open your preferred supported UPI application on your smartphone.</span>
              </div>
              <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-gray-50/70">
                <span className="w-5 h-5 rounded-full bg-[#006B3C] text-white flex items-center justify-center font-black text-[11px] shrink-0 mt-0.5">2</span>
                <span>Tap the "Scan QR" camera option and point it at the official code.</span>
              </div>
              <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-gray-50/70">
                <span className="w-5 h-5 rounded-full bg-[#006B3C] text-white flex items-center justify-center font-black text-[11px] shrink-0 mt-0.5">3</span>
                <span><strong>Verify the recipient name:</strong> Confirm that the merchant name appears as <span className="font-extrabold text-[#063F36]">"{recipientName}"</span> before proceeding.</span>
              </div>
              <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-gray-50/70">
                <span className="w-5 h-5 rounded-full bg-[#006B3C] text-white flex items-center justify-center font-black text-[11px] shrink-0 mt-0.5">4</span>
                <span>Enter your chosen donation amount and complete the payment in your UPI app.</span>
              </div>
              <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-gray-50/70">
                <span className="w-5 h-5 rounded-full bg-[#006B3C] text-white flex items-center justify-center font-black text-[11px] shrink-0 mt-0.5">5</span>
                <span><strong>Save your transaction reference:</strong> Note down the 12-digit UTR / UPI reference number from your payment confirmation screen.</span>
              </div>
            </div>

            {/* Mandatory Security Tip */}
            <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start space-x-2.5 text-xs text-amber-900">
              <ShieldAlert size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Security Notice: </strong>
                We will never request or collect your UPI PIN, OTP, passwords, or banking login credentials. Enter your UPI PIN only inside your verified bank UPI application.
              </div>
            </div>

            {onScrollToConfirmation && (
              <button
                type="button"
                onClick={onScrollToConfirmation}
                className="w-full py-3.5 px-6 rounded-xl font-extrabold text-sm bg-gradient-to-r from-[#F47B20] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/20 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Paid via UPI? Confirm Your Donation Here</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* High-Resolution QR Enlarge Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 text-center relative border border-white/20 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full inline-block mb-1">
                Official Punjab National Bank QR
              </span>
              <h3 className="text-lg font-black text-[#063F36]">{recipientName}</h3>
              <p className="text-xs text-gray-500">Scan using any UPI enabled app</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border-2 border-emerald-100 shadow-inner flex items-center justify-center aspect-square max-w-[320px] mx-auto">
              <img
                src={qrImageSrc}
                alt="Enlarged Official QR"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== (qrConfig.localFallbackUrl || '/official-pnb-qr.jpg')) {
                    target.src = qrConfig.localFallbackUrl || '/official-pnb-qr.jpg';
                  }
                }}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono font-bold text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                Merchant: {recipientName}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={downloadQr}
                  disabled={downloadingQr}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-black bg-[#006B3C] hover:bg-emerald-800 disabled:opacity-60 text-white transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  {downloadingQr ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download size={14} />
                      <span>Download Image</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-3 px-5 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpiDonationCard;
