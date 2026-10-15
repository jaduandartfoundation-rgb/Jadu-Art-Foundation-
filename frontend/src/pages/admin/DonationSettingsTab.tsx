import React, { useState, useEffect } from 'react';
import { donationService, mediaService } from '../../services/api';
import { 
  Building2, 
  QrCode, 
  ShieldCheck, 
  ShieldAlert, 
  AlertCircle, 
  CheckCircle, 
  Upload, 
  Save, 
  Phone, 
  Mail, 
  Clock, 
  History, 
  ExternalLink,
  Lock,
  Eye,
  RefreshCw
} from 'lucide-react';

const DonationSettingsTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);

  const [settings, setSettings] = useState<any>({
    bankDetails: {
      accountHolder: 'Jadu and Art Foundation',
      bankName: 'Punjab National Bank',
      accountNumber: '1896102100000714',
      ifsc: 'PUNB0189610',
      branch: 'Janjgir (Janjgir - Champa)',
      verificationStatus: 'Awaiting Verification',
      verificationNotes: ''
    },
    upiDetails: {
      upiId: '79875 57650m3@pnb',
      recipientName: 'JADU AND ART FOUNDATION',
      verificationStatus: 'Awaiting Verification',
      verificationNotes: ''
    },
    qrDetails: {
      qrImageUrl: 'https://res.cloudinary.com/urnn2fkr/image/upload/v1792096134/jadu-art/donations/iyiqks043w9he0q6exse.jpg',
      localFallbackUrl: '/official-pnb-qr.jpg',
      verificationStatus: 'Verified',
      verificationNotes: ''
    },
    supportContact: {
      phone: '95896 21753',
      whatsapp: '95896 21753',
      email: 'jaduandartfoundation@gmail.com'
    },
    methodsEnabled: {
      upi: true,
      bankTransfer: true,
      razorpay: false,
      razorpayStatus: 'pending_activation',
      razorpayKeyId: ''
    },
    headingEnglish: 'SUPPORT OUR MISSION',
    headingHindi: 'आपका सहयोग, किसी के जीवन में बदलाव',
    description: 'Your contribution can support our efforts towards education, healthcare, cow welfare and humanitarian relief. Choose a donation method below.',
    transparencyMessage: 'Submitting this form does not automatically confirm that your payment has been received. The foundation will verify the transaction against its bank records.',
    acknowledgementTemplate: 'Thank you for your generous contribution to Jadu & Art Foundation. Your voluntary contribution has been verified against our Punjab National Bank records.',
    history: []
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await donationService.getAdminDonationSettings();
      if (res.data && res.data.success && res.data.data) {
        setSettings(res.data.data);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to load donation settings from backend.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveAllSettings = async () => {
    setSaveLoading(true);
    setMessage(null);
    try {
      const res = await donationService.updateDonationSettings(settings);
      if (res.data && res.data.success) {
        setSettings(res.data.data);
        if (res.data.invalidations && res.data.invalidations.length > 0) {
          setMessage({
            type: 'warning',
            text: res.data.invalidations.join(' ')
          });
        } else {
          setMessage({ type: 'success', text: 'All donation settings saved successfully.' });
        }
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || err.message || 'Error saving settings.' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleGateAction = async (target: 'bank' | 'upi' | 'qr', status: string, notes?: string) => {
    try {
      const res = await donationService.verifyDonationGate({
        target,
        status,
        notes: notes || settings[`${target}Details`]?.verificationNotes || ''
      });
      if (res.data && res.data.success) {
        setSettings(res.data.data);
        setMessage({ type: 'success', text: res.data.message });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Verification update failed.' });
    }
  };

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingQr(true);
    setMessage(null);

    try {
      const sigRes = await mediaService.getSignature('jadu-art/donations');
      const sigData = sigRes.data;

      const uploadResult = await mediaService.uploadDirectToCloudinary(file, sigData);
      const secureUrl = uploadResult.secure_url;

      setSettings((prev: any) => ({
        ...prev,
        qrDetails: {
          ...prev.qrDetails,
          qrImageUrl: secureUrl,
          verificationStatus: 'Awaiting Verification',
          verifiedAt: null,
          verifiedBy: null
        }
      }));

      setMessage({
        type: 'warning',
        text: 'New QR code image uploaded to Cloudinary. Previous verification has been invalidated; please verify against official merchant records.'
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to upload QR code image to Cloudinary.' });
    } finally {
      setUploadingQr(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Published':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">Published Live</span>;
      case 'Verified':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase bg-blue-100 text-blue-800 border border-blue-300">Verified (Not Published)</span>;
      case 'Awaiting Verification':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300">Awaiting Verification</span>;
      case 'Draft':
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase bg-gray-100 text-gray-700 border border-gray-300">Draft</span>;
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-xs text-gray-500 font-medium">Loading Donation Settings CMS...</div>;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="text-[#006B3C] w-6 h-6" />
            <h3 className="text-xl font-black text-[#063F36] uppercase tracking-wider">
              Donation Settings CMS & Verification Gate
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1 font-medium max-w-2xl">
            Configure official Punjab National Bank details, UPI ID, Cloudinary QR code, support numbers, and admin verification status before publishing to the live website.
          </p>
        </div>

        <button
          onClick={handleSaveAllSettings}
          disabled={saveLoading}
          className="bg-[#F47B20] text-white px-7 py-3 rounded-xl text-xs font-black shadow-md hover:bg-orange-600 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
        >
          <Save size={15} />
          <span>{saveLoading ? 'SAVING CHANGES...' : 'SAVE ALL SETTINGS'}</span>
        </button>
      </div>

      {/* Status Alert Banner */}
      {message && (
        <div className={`p-4 rounded-xl text-xs font-bold border flex items-start space-x-2.5 ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' :
          message.type === 'warning' ? 'bg-amber-50 border-amber-300 text-amber-900' :
          'bg-red-50 border-red-300 text-red-900'
        }`}>
          {message.type === 'success' ? <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" /> :
           message.type === 'warning' ? <ShieldAlert size={16} className="text-amber-600 shrink-0 mt-0.5" /> :
           <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />}
          <div className="leading-relaxed">{message.text}</div>
        </div>
      )}

      {/* SECTION 1: BANK DETAILS & VERIFICATION GATE */}
      <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50/50 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-extrabold text-sm text-[#063F36] uppercase tracking-wider">
                1. Official Bank Account Details
              </h4>
              {getStatusBadge(settings.bankDetails?.verificationStatus)}
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Current Account in Punjab National Bank. Never invent or silently alter details.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => handleGateAction('bank', 'Verified', 'Verified against official PNB bank records.')}
              className="px-3 py-1.5 bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-300 rounded-lg text-xs font-bold cursor-pointer"
            >
              Verify Against Records
            </button>
            <button
              type="button"
              onClick={() => handleGateAction('bank', 'Published', 'Published live on official website.')}
              className="px-3 py-1.5 bg-[#006B3C] text-white hover:bg-emerald-800 rounded-lg text-xs font-bold cursor-pointer"
            >
              Publish to Live
            </button>
            <button
              type="button"
              onClick={() => handleGateAction('bank', 'Draft', 'Unpublished back to Draft.')}
              className="px-2.5 py-1.5 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg text-xs font-bold cursor-pointer"
            >
              Set Draft
            </button>
          </div>
        </div>

        {/* Invalidation Rule Notice */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-center space-x-2">
          <ShieldAlert size={15} className="text-amber-600 shrink-0" />
          <span>
            <strong>Automatic Invalidation Rule:</strong> Changing Account Holder, Bank Name, Account Number, or IFSC code will immediately invalidate any previous verification and reset status to "Awaiting Verification".
          </span>
        </div>

        {/* Bank Input Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-medium">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Account Holder Name *</label>
            <input
              type="text"
              value={settings.bankDetails?.accountHolder || ''}
              onChange={(e) => setSettings({
                ...settings,
                bankDetails: { ...settings.bankDetails, accountHolder: e.target.value }
              })}
              className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Bank Name *</label>
            <input
              type="text"
              value={settings.bankDetails?.bankName || ''}
              onChange={(e) => setSettings({
                ...settings,
                bankDetails: { ...settings.bankDetails, bankName: e.target.value }
              })}
              className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Account Number *</label>
            <input
              type="text"
              value={settings.bankDetails?.accountNumber || ''}
              onChange={(e) => setSettings({
                ...settings,
                bankDetails: { ...settings.bankDetails, accountNumber: e.target.value }
              })}
              className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-mono font-bold text-emerald-900"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">IFSC Code *</label>
            <input
              type="text"
              value={settings.bankDetails?.ifsc || ''}
              onChange={(e) => setSettings({
                ...settings,
                bankDetails: { ...settings.bankDetails, ifsc: e.target.value }
              })}
              className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-mono font-bold uppercase text-emerald-900"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Branch Name</label>
            <input
              type="text"
              value={settings.bankDetails?.branch || ''}
              onChange={(e) => setSettings({
                ...settings,
                bankDetails: { ...settings.bankDetails, branch: e.target.value }
              })}
              className="w-full p-2.5 bg-white border border-gray-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Verification Status</label>
            <select
              value={settings.bankDetails?.verificationStatus || 'Draft'}
              onChange={(e) => setSettings({
                ...settings,
                bankDetails: { ...settings.bankDetails, verificationStatus: e.target.value }
              })}
              className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-bold"
            >
              <option value="Draft">Draft</option>
              <option value="Awaiting Verification">Awaiting Verification</option>
              <option value="Verified">Verified</option>
              <option value="Published">Published</option>
            </select>
          </div>
        </div>

        {/* Verification Metadata */}
        {settings.bankDetails?.verifiedBy && (
          <div className="p-3 bg-white rounded-xl border border-gray-200 text-[11px] text-gray-600 flex flex-wrap items-center gap-4">
            <div><span className="font-bold text-gray-500">Verified By:</span> {settings.bankDetails.verifiedBy.name} ({settings.bankDetails.verifiedBy.email})</div>
            <div><span className="font-bold text-gray-500">Timestamp:</span> {new Date(settings.bankDetails.verifiedAt).toLocaleString('en-IN')}</div>
          </div>
        )}
      </div>

      {/* SECTION 2: UPI ID & QR CODE VERIFICATION GATE */}
      <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50/50 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-extrabold text-sm text-[#063F36] uppercase tracking-wider">
                2. UPI Handle & Official QR Code
              </h4>
              {getStatusBadge(settings.upiDetails?.verificationStatus)}
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              The supplied UPI ID contains a space ("79875 57650m3@pnb"). Treat as UNVERIFIED until corrected.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => handleGateAction('upi', 'Verified', 'Verified UPI handle.')}
              className="px-3 py-1.5 bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-300 rounded-lg text-xs font-bold cursor-pointer"
            >
              Verify UPI
            </button>
            <button
              type="button"
              onClick={() => handleGateAction('upi', 'Published', 'Published UPI handle.')}
              className="px-3 py-1.5 bg-[#006B3C] text-white hover:bg-emerald-800 rounded-lg text-xs font-bold cursor-pointer"
            >
              Publish UPI
            </button>
            <button
              type="button"
              onClick={() => handleGateAction('upi', 'Awaiting Verification')}
              className="px-2.5 py-1.5 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg text-xs font-bold cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: UPI ID & Recipient */}
          <div className="lg:col-span-7 space-y-4 text-xs font-medium">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Supplied UPI ID (Verify exact address) *
              </label>
              <input
                type="text"
                value={settings.upiDetails?.upiId || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  upiDetails: { ...settings.upiDetails, upiId: e.target.value }
                })}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-mono font-bold text-gray-800"
              />
              <span className="text-[11px] text-gray-500 mt-1 block">
                {settings.upiDetails?.upiId?.includes(' ') ? (
                  <span className="text-amber-700 font-bold">⚠️ Notice: Contains space. Clickable UPI links remain disabled on the public site until verified.</span>
                ) : (
                  <span className="text-emerald-700 font-bold">✓ Clean format without spaces.</span>
                )}
              </span>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Verified Recipient Name (Appears on scan)</label>
              <input
                type="text"
                value={settings.upiDetails?.recipientName || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  upiDetails: { ...settings.upiDetails, recipientName: e.target.value }
                })}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">UPI Verification Status</label>
                <select
                  value={settings.upiDetails?.verificationStatus || 'Draft'}
                  onChange={(e) => setSettings({
                    ...settings,
                    upiDetails: { ...settings.upiDetails, verificationStatus: e.target.value }
                  })}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-bold"
                >
                  <option value="Draft">Draft</option>
                  <option value="Awaiting Verification">Awaiting Verification</option>
                  <option value="Verified">Verified</option>
                  <option value="Published">Published</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">QR Code Status</label>
                <div className="pt-2">
                  {getStatusBadge(settings.qrDetails?.verificationStatus)}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Cloudinary QR Image Preview & Replace */}
          <div className="lg:col-span-5 bg-white p-4 rounded-2xl border border-gray-200 text-center space-y-3">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Official QR Image Preview (Cloudinary)
            </span>

            <div className="w-40 h-40 mx-auto rounded-xl overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center p-2">
              <img
                src={settings.qrDetails?.qrImageUrl || '/official-pnb-qr.jpg'}
                alt="QR Preview"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-2">
              <label className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#006B3C] border border-emerald-300 rounded-xl text-xs font-bold cursor-pointer transition-colors">
                <Upload size={14} />
                <span>{uploadingQr ? 'Uploading...' : 'Replace QR Image (Cloudinary)'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleQrUpload}
                  disabled={uploadingQr}
                  className="hidden"
                />
              </label>

              <div className="flex justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleGateAction('qr', 'Verified', 'Verified QR image matches official bank issued QR.')}
                  className="px-2.5 py-1 text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 rounded-lg cursor-pointer"
                >
                  Verify QR
                </button>
                <button
                  type="button"
                  onClick={() => handleGateAction('qr', 'Published', 'Published official QR.')}
                  className="px-2.5 py-1 text-[11px] font-bold bg-[#006B3C] text-white rounded-lg cursor-pointer"
                >
                  Publish QR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: SUPPORT CONTACT INFORMATION */}
      <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50/50 space-y-4">
        <h4 className="font-extrabold text-sm text-[#063F36] uppercase tracking-wider border-b border-gray-200 pb-2">
          3. Payment Support Contact Information
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Support Phone Number *</label>
            <input
              type="text"
              value={settings.supportContact?.phone || ''}
              onChange={(e) => setSettings({
                ...settings,
                supportContact: { ...settings.supportContact, phone: e.target.value }
              })}
              className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">WhatsApp Number *</label>
            <input
              type="text"
              value={settings.supportContact?.whatsapp || ''}
              onChange={(e) => setSettings({
                ...settings,
                supportContact: { ...settings.supportContact, whatsapp: e.target.value }
              })}
              className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Support Email *</label>
            <input
              type="email"
              value={settings.supportContact?.email || ''}
              onChange={(e) => setSettings({
                ...settings,
                supportContact: { ...settings.supportContact, email: e.target.value }
              })}
              className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-bold"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: PAYMENT METHODS & RAZORPAY GATEWAY TOGGLES */}
      <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50/50 space-y-4">
        <h4 className="font-extrabold text-sm text-[#063F36] uppercase tracking-wider border-b border-gray-200 pb-2">
          4. Payment Methods & Gateway Activation Toggles
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
          {/* UPI Toggle */}
          <label className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-200 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.methodsEnabled?.upi !== false}
              onChange={(e) => setSettings({
                ...settings,
                methodsEnabled: { ...settings.methodsEnabled, upi: e.target.checked }
              })}
              className="w-4 h-4 text-[#006B3C] rounded focus:ring-emerald-500"
            />
            <div>
              <span className="font-bold text-[#063F36] block">Enable UPI QR Donations</span>
              <span className="text-[11px] text-gray-500">Show official QR code on donate page</span>
            </div>
          </label>

          {/* Bank Transfer Toggle */}
          <label className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-200 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.methodsEnabled?.bankTransfer !== false}
              onChange={(e) => setSettings({
                ...settings,
                methodsEnabled: { ...settings.methodsEnabled, bankTransfer: e.target.checked }
              })}
              className="w-4 h-4 text-[#006B3C] rounded focus:ring-emerald-500"
            />
            <div>
              <span className="font-bold text-[#063F36] block">Enable Bank Transfer</span>
              <span className="text-[11px] text-gray-500">Show Punjab National Bank details</span>
            </div>
          </label>

          {/* Razorpay Gateway Status */}
          <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-1.5">
            <span className="font-bold text-[#063F36] block">Razorpay Gateway Status</span>
            <select
              value={settings.methodsEnabled?.razorpayStatus || 'pending_activation'}
              onChange={(e) => setSettings({
                ...settings,
                methodsEnabled: {
                  ...settings.methodsEnabled,
                  razorpayStatus: e.target.value,
                  razorpay: e.target.value === 'active'
                }
              })}
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold"
            >
              <option value="pending_activation">Pending Activation (KYC Review)</option>
              <option value="disabled">Disabled</option>
              <option value="active">Active & Operational</option>
            </select>
            <span className="text-[10px] text-gray-500 block">Do not claim active while account activation is pending.</span>
          </div>
        </div>
      </div>

      {/* SECTION 5: TRANSPARENCY & ACKNOWLEDGEMENT TEMPLATES */}
      <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50/50 space-y-4 text-xs font-medium">
        <h4 className="font-extrabold text-sm text-[#063F36] uppercase tracking-wider border-b border-gray-200 pb-2">
          5. Instructions, Transparency & Acknowledgement Settings
        </h4>

        <div className="space-y-4">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Public Transparency Message</label>
            <textarea
              rows={2}
              value={settings.transparencyMessage || ''}
              onChange={(e) => setSettings({ ...settings, transparencyMessage: e.target.value })}
              className="w-full p-3 bg-white border border-gray-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Donor Acknowledgement Note Template (Non-80G)</label>
            <textarea
              rows={2}
              value={settings.acknowledgementTemplate || ''}
              onChange={(e) => setSettings({ ...settings, acknowledgementTemplate: e.target.value })}
              className="w-full p-3 bg-white border border-gray-300 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* SECTION 6: SETTINGS AUDIT TRAIL LOG */}
      {settings.history && settings.history.length > 0 && (
        <div className="border border-gray-200 rounded-2xl p-6 bg-white space-y-3">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-2">
            <History size={16} className="text-[#006B3C]" />
            <h4 className="font-extrabold text-sm text-[#063F36] uppercase tracking-wider">
              Verification & Settings Audit Log
            </h4>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto text-xs">
            {settings.history.map((item: any, idx: number) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between gap-1">
                <div>
                  <span className="font-extrabold text-gray-800">{item.action}</span>
                  <p className="text-gray-600 mt-0.5">{item.details}</p>
                </div>
                <div className="sm:text-right shrink-0 text-[11px] text-gray-500">
                  <div>{item.changedBy}</div>
                  <div>{new Date(item.changedAt).toLocaleString('en-IN')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Save Action */}
      <div className="pt-2 text-right">
        <button
          onClick={handleSaveAllSettings}
          disabled={saveLoading}
          className="bg-[#F47B20] text-white px-8 py-3.5 rounded-xl text-xs font-black shadow-md hover:bg-orange-600 transition-all cursor-pointer"
        >
          {saveLoading ? 'SAVING SETTINGS...' : 'SAVE ALL SETTINGS'}
        </button>
      </div>
    </div>
  );
};

export default DonationSettingsTab;
