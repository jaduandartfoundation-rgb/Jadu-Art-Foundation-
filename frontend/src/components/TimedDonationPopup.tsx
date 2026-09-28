import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, Heart, ShieldCheck } from 'lucide-react';
import { initiativeService } from '../services/api';

export const DONATION_POPUP_DELAY = 10000;
export const DONATION_POPUP_COOLDOWN = 7 * 24 * 60 * 60 * 1000;

const TimedDonationPopup: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [activeInitiative, setActiveInitiative] = useState<any>(null);
  const triggerButtonRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith('/donate') || path.startsWith('/admin')) {
      setIsOpen(false);
      return;
    }

    if (localStorage.getItem('hasDonated') === 'true' || sessionStorage.getItem('hasDonated') === 'true') {
      return;
    }

    if (sessionStorage.getItem('donationPopupDismissed') === 'true') {
      return;
    }

    let timer: ReturnType<typeof setTimeout>;

    import('../services/api').then(({ settingsService }) => {
      settingsService.getSettings()
        .then((res) => {
          const popupConfig = res.data?.data?.donationPopup || {};
          if (popupConfig.enabled === false) {
            return;
          }

          const popupDelay = (popupConfig.delay || 10) * 1000;
          const popupCooldown = (popupConfig.cooldown || 7) * 24 * 60 * 60 * 1000;

          const lastDismissedStr = localStorage.getItem('donationPopupDismissedAt');
          if (lastDismissedStr) {
            const lastDismissed = parseInt(lastDismissedStr, 10);
            if (Date.now() - lastDismissed < popupCooldown) {
              return;
            }
          }

          const initiativeMatch = path.match(/^\/initiatives\/([^\/]+)$/);
          if (initiativeMatch && initiativeMatch[1] !== 'all') {
            const slug = initiativeMatch[1];
            initiativeService.getInitiativeBySlug(slug)
              .then((iRes) => {
                if (iRes.data.success && iRes.data.data) {
                  setActiveInitiative(iRes.data.data);
                }
              })
              .catch(() => {});
          } else {
            setActiveInitiative(null);
          }

          timer = setTimeout(() => {
            triggerButtonRef.current = document.activeElement as HTMLElement;
            setIsOpen(true);
          }, popupDelay);
        })
        .catch(() => {
          const timerFallback = setTimeout(() => {
            triggerButtonRef.current = document.activeElement as HTMLElement;
            setIsOpen(true);
          }, DONATION_POPUP_DELAY);
          timer = timerFallback;
        });
    });

    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('donationPopupDismissed', 'true');
    localStorage.setItem('donationPopupDismissedAt', Date.now().toString());

    if (triggerButtonRef.current) {
      triggerButtonRef.current.focus();
    }
  };

  const handleDonateRedirect = () => {
    setIsOpen(false);
    sessionStorage.setItem('donationPopupDismissed', 'true');

    const initiativeParam = activeInitiative 
      ? `&initiative=${encodeURIComponent(activeInitiative._id || activeInitiative.slug)}` 
      : '';
    navigate(`/donate?amount=${selectedAmount}${initiativeParam}`);
  };

  if (!isOpen) return null;

  const amounts = [500, 1000, 2500, 5000];

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="donation-popup-title"
    >
      <div 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg bg-brand-cream rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-brand-gold/30 transform transition-all duration-300 relative"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close donation modal"
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/90 hover:bg-white text-gray-700 rounded-full flex items-center justify-center transition-colors shadow-md"
        >
          <X size={20} />
        </button>

        {/* Desktop Header Banner */}
        <div className="relative h-36 bg-brand-dark overflow-hidden flex items-center px-6">
          <img 
            src={activeInitiative?.image || 'https://images.pexels.com/photos/1183434/pexels-photo-1183434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
            alt="Support Jadu & Art Foundation" 
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-transparent"></div>
          
          <div className="relative z-10 space-y-1.5 text-white max-w-sm">
            <div className="inline-flex items-center space-x-1.5 bg-brand-gold/20 text-brand-gold text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-brand-gold/30">
              <Heart size={11} className="fill-brand-gold" />
              <span>JADU & ART FOUNDATION</span>
            </div>
            <h3 id="donation-popup-title" className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
              {activeInitiative ? `Support ${activeInitiative.title}` : 'DONATE NOW'}
            </h3>
            <p className="text-xs text-brand-orange font-bold hindi-text">
              आपका सहयोग महत्वपूर्ण है
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-5 bg-white">
          <div>
            <p className="text-gray-700 text-xs sm:text-sm leading-relaxed font-medium">
              "Your contribution can help us continue serving people, communities and animals in need."
            </p>
          </div>

          {/* Quick Amount Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-2">
              Select Amount (₹)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {amounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setSelectedAmount(amt)}
                  className={`py-2.5 text-center rounded-xl font-bold text-xs sm:text-sm border transition-all ${
                    selectedAmount === amt
                      ? 'border-brand-orange bg-brand-orange/10 text-brand-orange shadow-sm'
                      : 'border-border text-gray-700 bg-brand-cream hover:bg-gray-100'
                  }`}
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <button
              onClick={handleDonateRedirect}
              className="w-full bg-brand-orange text-white py-3.5 rounded-xl font-extrabold text-base shadow-lg hover:bg-[#E05D00] transition-all flex items-center justify-center space-x-2"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>DONATE ₹{selectedAmount.toLocaleString('en-IN')} NOW</span>
            </button>

            <button
              onClick={handleClose}
              className="w-full py-2 text-center text-xs font-bold text-text-secondary hover:text-brand-dark transition-colors"
            >
              Maybe later
            </button>
          </div>

          <div className="flex items-center justify-center space-x-1.5 text-[11px] text-text-secondary font-medium pt-2 border-t border-border">
            <ShieldCheck size={14} className="text-brand-green" />
            <span>Direct, transparent support via Razorpay</span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TimedDonationPopup;
