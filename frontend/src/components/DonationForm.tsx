import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { initiativeService } from '../services/api';
import { Heart, ShieldCheck, CheckCircle2, QrCode, Building2, ArrowRight } from 'lucide-react';

interface DonationFormProps {
  defaultCampaign?: string;
  className?: string;
}

const DonationForm: React.FC<DonationFormProps> = ({ defaultCampaign = 'Wherever Needed Most', className = '' }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [amount, setAmount] = useState<number | ''>(1000);
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>(defaultCampaign);
  const [selectedInitiativeId, setSelectedInitiativeId] = useState<string>('');

  const amounts = [500, 1000, 2500, 5000];

  useEffect(() => {
    // 1. Check URL parameters for amount & initiative
    const paramAmount = searchParams.get('amount');
    if (paramAmount && !isNaN(Number(paramAmount))) {
      setAmount(Number(paramAmount));
    }

    const paramInitiative = searchParams.get('initiative') || searchParams.get('campaign');

    // 2. Fetch initiatives from backend
    initiativeService.getInitiatives()
      .then(res => {
        if (res.data.success && res.data.data) {
          const list = res.data.data;
          setInitiatives(list);

          const targetParam = paramInitiative || defaultCampaign;
          if (targetParam && targetParam !== 'Wherever Needed Most') {
            const matched = list.find((item: any) => 
              item._id === targetParam || 
              item.slug === targetParam || 
              item.title?.toLowerCase() === targetParam.toLowerCase()
            );
            if (matched) {
              setSelectedCampaign(matched.title);
              setSelectedInitiativeId(matched._id);
            } else {
              setSelectedCampaign(targetParam);
            }
          }
        }
      })
      .catch(() => {});
  }, [searchParams, defaultCampaign]);

  const handleSelectInitiative = (item: any) => {
    if (item === 'Wherever Needed Most') {
      setSelectedCampaign('Wherever Needed Most');
      setSelectedInitiativeId('');
    } else {
      setSelectedCampaign(item.title || item);
      setSelectedInitiativeId(item._id || '');
    }
  };

  const handleProceedToDonate = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = amount && amount >= 100 ? amount : 1000;
    const initiativeParam = selectedInitiativeId 
      ? `&initiative=${encodeURIComponent(selectedInitiativeId)}` 
      : selectedCampaign && selectedCampaign !== 'Wherever Needed Most' 
        ? `&campaign=${encodeURIComponent(selectedCampaign)}` 
        : '';
    
    navigate(`/donate?amount=${finalAmount}${initiativeParam}`);
  };

  const defaultCategoryOptions = [
    { title: 'Education for Every Child', category: 'Education' },
    { title: 'Healthcare for Communities', category: 'Healthcare' },
    { title: 'Care & Shelter for Cows', category: 'Cow Welfare' },
    { title: 'Support During Crisis', category: 'Disaster Relief' }
  ];

  const displayedOptions = initiatives.length > 0 ? initiatives : defaultCategoryOptions;

  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-light-border overflow-hidden ${className}`}>
      {/* Header Banner */}
      <div className="bg-primary-navy p-6 md:p-8 text-white">
        <div className="inline-flex items-center space-x-2 bg-primary-saffron/20 text-primary-saffron text-xs font-semibold px-3 py-1 rounded-full mb-3">
          <Heart size={14} className="fill-primary-saffron" />
          <span>DIRECT SOCIAL IMPACT</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Support a Cause</h3>
        <p className="text-gray-300 text-sm md:text-base leading-relaxed">
          {selectedCampaign && selectedCampaign !== 'Wherever Needed Most'
            ? `Selected Initiative: ${selectedCampaign}`
            : 'Choose an initiative and contribute directly to transform lives.'}
        </p>
      </div>

      <div className="p-6 md:p-8">
        <form onSubmit={handleProceedToDonate} className="space-y-6">
          {/* Cause Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide mb-3">
              1. Select Initiative
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {displayedOptions.map((item: any, idx: number) => {
                const title = item.title || item;
                const isSelected = selectedCampaign === title;

                return (
                  <button
                    type="button"
                    key={item._id || idx}
                    onClick={() => handleSelectInitiative(item)}
                    className={`p-3.5 text-xs md:text-sm font-medium rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-primary-saffron bg-primary-saffron/10 text-primary-saffron font-bold shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate pr-1">{title}</span>
                      {isSelected && <CheckCircle2 size={16} className="text-primary-saffron flex-shrink-0" />}
                    </div>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => handleSelectInitiative('Wherever Needed Most')}
                className={`p-3.5 text-xs md:text-sm font-medium rounded-xl border text-left transition-all ${
                  selectedCampaign === 'Wherever Needed Most'
                    ? 'border-primary-saffron bg-primary-saffron/10 text-primary-saffron font-bold shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Wherever Needed Most</span>
                  {selectedCampaign === 'Wherever Needed Most' && <CheckCircle2 size={16} className="text-primary-saffron flex-shrink-0" />}
                </div>
              </button>
            </div>
          </div>

          {/* Amount Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide mb-3">
              2. Select Amount (₹)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-3">
              {amounts.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className={`py-3 px-4 text-center rounded-xl border transition-all ${
                    amount === amt
                      ? 'border-primary-saffron bg-primary-saffron/10 text-primary-saffron font-bold text-lg shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 text-gray-800 text-base font-semibold bg-gray-50/50'
                  }`}
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 font-bold">₹</span>
              <input
                type="number"
                placeholder="Or enter custom amount"
                value={amount === '' ? '' : amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full pl-9 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-primary-navy font-medium text-gray-800"
              />
            </div>
          </div>

          {/* Direct Donation Info Box */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4.5 space-y-2.5">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
              <span>Direct Transfer Options</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-gray-700">
              <div className="flex items-center space-x-2 bg-white/90 p-2.5 rounded-xl border border-emerald-100">
                <QrCode size={18} className="text-primary-saffron shrink-0" />
                <span className="font-medium">Official PNB UPI QR Code</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/90 p-2.5 rounded-xl border border-emerald-100">
                <Building2 size={18} className="text-primary-navy shrink-0" />
                <span className="font-medium">Direct Bank NEFT / IMPS</span>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed pt-0.5">
              100% of your donation directly reaches the foundation’s verified Punjab National Bank merchant account with zero intermediary commissions.
            </p>
          </div>

          {/* Action CTA Button */}
          <button
            type="submit"
            className="w-full bg-primary-saffron text-white py-4 rounded-xl font-extrabold text-lg shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center space-x-2 group cursor-pointer"
          >
            <Heart className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
            <span>DONATE {amount ? `₹${amount.toLocaleString('en-IN')}` : 'NOW'} VIA UPI / BANK</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Trust Verification Note */}
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 font-medium pt-1">
            <ShieldCheck className="w-4 h-4 text-primary-green" />
            <span>Punjab National Bank Official Account • Verified Seva Trust</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationForm;
