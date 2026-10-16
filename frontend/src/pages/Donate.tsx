import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { donationService } from '../services/api';
import BilingualHeading from '../components/BilingualHeading';
import BankTransferCard from '../components/donation/BankTransferCard';
import UpiDonationCard from '../components/donation/UpiDonationCard';
import DonationConfirmationForm from '../components/donation/DonationConfirmationForm';
import RazorpayStatusCard from '../components/donation/RazorpayStatusCard';
import PaymentSupportSection from '../components/donation/PaymentSupportSection';
import DonationTrustSection from '../components/donation/DonationTrustSection';
import { 
  QrCode, 
  Building2, 
  CreditCard, 
  FileText, 
  ShieldCheck, 
  Heart, 
  Award,
  Sparkles 
} from 'lucide-react';

const Donate: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeMethod, setActiveMethod] = useState<'upi' | 'bank' | 'confirm' | 'gateway'>('upi');
  const [config, setConfig] = useState<any>({
    headingEnglish: 'SUPPORT OUR MISSION',
    headingHindi: 'आपका सहयोग, किसी के जीवन में बदलाव',
    description: 'Your contribution can support our efforts towards education, healthcare, cow welfare and humanitarian relief. Choose a donation method below.',
    supportContact: {
      phone: '95896 21753',
      whatsapp: '95896 21753',
      email: 'jaduandartfoundation@gmail.com'
    },
    methodsEnabled: {
      upi: true,
      bankTransfer: true,
      razorpay: false,
      razorpayStatus: 'pending_activation'
    },
    bankTransfer: {
      isPublished: true, // Default loaded state; API validates actual status
      accountHolder: 'Jadu and Art Foundation',
      bankName: 'Punjab National Bank',
      accountNumber: '1896102100000714',
      ifsc: 'PUNB0189610',
      branch: 'Janjgir (Janjgir - Champa)',
      statusMessage: 'Official Account'
    },
    upi: {
      isPublished: false,
      upiId: null,
      recipientName: 'JADU AND ART FOUNDATION',
      isClickable: false,
      statusMessage: 'Scan official QR code'
    },
    qr: {
      isPublished: true,
      qrImageUrl: 'https://res.cloudinary.com/urnn2fkr/image/upload/v1792096134/jadu-art/donations/iyiqks043w9he0q6exse.jpg',
      localFallbackUrl: '/official-pnb-qr.jpg',
      recipientName: 'JADU AND ART FOUNDATION'
    }
  });

  const [loading, setLoading] = useState(true);
  const confirmFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check url params for method or tab
    const tabParam = searchParams.get('tab');
    if (tabParam === 'bank') setActiveMethod('bank');
    else if (tabParam === 'confirm') setActiveMethod('confirm');
    else if (tabParam === 'gateway') setActiveMethod('gateway');

    // Fetch live public donation config from server
    donationService.getPublicConfig()
      .then(res => {
        if (res.data && res.data.success && res.data.data) {
          setConfig(res.data.data);
        }
      })
      .catch(err => {
        console.warn('Using default donation config:', err.message);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const scrollToConfirmation = () => {
    setActiveMethod('confirm');
    setTimeout(() => {
      confirmFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="py-12 sm:py-16 bg-[#FBF8F1] min-h-screen text-[#17201D]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        
        {/* Main Bilingual Page Heading */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-amber-100 text-[#063F36] border border-emerald-300/60 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase mb-1 shadow-sm">
            <Heart size={13} className="text-[#F47B20] fill-[#F47B20]" />
            <span>SEVA • SANSKAR • SAMRIDDH BHARAT</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#063F36] tracking-tight">
            {config.headingEnglish || 'SUPPORT OUR MISSION'}
          </h1>

          <p className="text-xl sm:text-2xl font-bold text-[#F47B20] hindi-text">
            {config.headingHindi || 'आपका सहयोग, किसी के जीवन में बदलाव'}
          </p>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[#5F6B66] leading-relaxed font-medium">
            "{config.description || 'Your contribution can support our efforts towards education, healthcare, cow welfare and humanitarian relief. Choose a donation method below.'}"
          </p>
        </div>

        {/* Payment Method Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 sm:flex sm:flex-wrap sm:justify-center sm:gap-3 bg-white/90 backdrop-blur-sm p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-[#E4E9E5] shadow-sm max-w-2xl mx-auto">
          <button
            type="button"
            onClick={() => setActiveMethod('upi')}
            className={`py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all flex flex-col sm:flex-row items-center justify-center sm:space-x-2 text-center cursor-pointer ${
              activeMethod === 'upi'
                ? 'bg-[#006B3C] text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <QrCode size={16} className={`shrink-0 mb-1 sm:mb-0 ${activeMethod === 'upi' ? 'text-[#F47B20]' : 'text-gray-500'}`} />
            <span className="leading-tight">UPI QR Code</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMethod('bank')}
            className={`py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all flex flex-col sm:flex-row items-center justify-center sm:space-x-2 text-center cursor-pointer ${
              activeMethod === 'bank'
                ? 'bg-[#006B3C] text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Building2 size={16} className={`shrink-0 mb-1 sm:mb-0 ${activeMethod === 'bank' ? 'text-[#F47B20]' : 'text-gray-500'}`} />
            <span className="leading-tight">Bank Transfer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMethod('confirm')}
            className={`py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all flex flex-col sm:flex-row items-center justify-center sm:space-x-2 text-center cursor-pointer ${
              activeMethod === 'confirm'
                ? 'bg-[#F47B20] text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FileText size={16} className="shrink-0 mb-1 sm:mb-0" />
            <span className="leading-tight">Confirm Donation</span>
          </button>

          {config.methodsEnabled?.razorpay === true && (
            <button
              type="button"
              onClick={() => setActiveMethod('gateway')}
              className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeMethod === 'gateway'
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <CreditCard size={15} />
              <span>Razorpay</span>
            </button>
          )}
        </div>

        {/* Selected Donation Method View */}
        <div className="space-y-8 animate-fadeIn">
          {activeMethod === 'upi' && (
            <UpiDonationCard
              upiConfig={config.upi || {}}
              qrConfig={config.qr || {}}
              onScrollToConfirmation={scrollToConfirmation}
            />
          )}

          {activeMethod === 'bank' && (
            <BankTransferCard
              bankConfig={config.bankTransfer || {}}
              onScrollToConfirmation={scrollToConfirmation}
            />
          )}

          {activeMethod === 'gateway' && (
            <RazorpayStatusCard
              onSelectUpi={() => setActiveMethod('upi')}
              onSelectBank={() => setActiveMethod('bank')}
            />
          )}

          {activeMethod === 'confirm' && (
            <div ref={confirmFormRef} className="pt-2 animate-fadeIn">
              <DonationConfirmationForm />
            </div>
          )}
        </div>

        {/* Visible Support Section */}
        <PaymentSupportSection supportContact={config.supportContact} />

        {/* Trust & Transparency Section */}
        <DonationTrustSection />

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-3xl border border-[#E4E9E5] shadow-sm space-y-2">
            <div className="w-12 h-12 bg-[#063F36]/10 text-[#063F36] rounded-2xl flex items-center justify-center mx-auto">
              <ShieldCheck size={24} />
            </div>
            <h4 className="font-extrabold text-[#063F36] text-sm">Direct Bank Account</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              100% direct deposit into Punjab National Bank official merchant current account.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E4E9E5] shadow-sm space-y-2">
            <div className="w-12 h-12 bg-[#F47B20]/10 text-[#F47B20] rounded-2xl flex items-center justify-center mx-auto">
              <Heart size={24} className="fill-[#F47B20]" />
            </div>
            <h4 className="font-extrabold text-[#063F36] text-sm">Zero Intermediary Fees</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Direct UPI and NEFT/IMPS transfers incur zero payment gateway commissions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E4E9E5] shadow-sm space-y-2">
            <div className="w-12 h-12 bg-[#006B3C]/10 text-[#006B3C] rounded-2xl flex items-center justify-center mx-auto">
              <Award size={24} />
            </div>
            <h4 className="font-extrabold text-[#063F36] text-sm">Verified Accountability</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Strict audit trail and bank reconciliation with transparent governance.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Donate;
