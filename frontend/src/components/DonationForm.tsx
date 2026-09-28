import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { donationService, initiativeService } from '../services/api';
import { Heart, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface DonationFormProps {
  defaultCampaign?: string;
  className?: string;
}

const DonationForm: React.FC<DonationFormProps> = ({ defaultCampaign = 'Wherever Needed Most', className = '' }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [amount, setAmount] = useState<number | ''>(1000);
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [selectedInitiative, setSelectedInitiative] = useState<any>(null);

  const [formData, setFormData] = useState({
    donorName: '',
    email: '',
    phone: '',
    pan: '',
    campaign: defaultCampaign,
    initiativeId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const amounts = [500, 1000, 2500, 5000];

  useEffect(() => {
    // 1. Check URL parameters for amount & initiative
    const paramAmount = searchParams.get('amount');
    if (paramAmount && !isNaN(Number(paramAmount))) {
      setAmount(Number(paramAmount));
    }

    const paramInitiative = searchParams.get('initiative');

    // 2. Fetch initiatives from backend
    initiativeService.getInitiatives()
      .then(res => {
        if (res.data.success && res.data.data) {
          const list = res.data.data;
          setInitiatives(list);

          if (paramInitiative) {
            // Find initiative by _id or slug
            const matched = list.find((item: any) => 
              item._id === paramInitiative || item.slug === paramInitiative || item.title === paramInitiative
            );
            if (matched) {
              setSelectedInitiative(matched);
              setFormData(prev => ({
                ...prev,
                campaign: matched.title,
                initiativeId: matched._id
              }));
            }
          }
        }
      })
      .catch(() => {});
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectInitiative = (item: any) => {
    if (item === 'Wherever Needed Most') {
      setSelectedInitiative(null);
      setFormData(prev => ({
        ...prev,
        campaign: 'Wherever Needed Most',
        initiativeId: ''
      }));
    } else {
      setSelectedInitiative(item);
      setFormData(prev => ({
        ...prev,
        campaign: item.title,
        initiativeId: item._id
      }));
    }
  };

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setError('Please agree to the Donation Terms and Privacy Policy before proceeding.');
      return;
    }
    if (!amount || amount < 100) {
      setError('Minimum donation amount is ₹100');
      return;
    }
    setError('');
    setLoading(true);

    try {
      // 1. Create order on backend
      const { data } = await donationService.createOrder({
        amount: Number(amount),
        ...formData
      });

      if (!data.success) {
        throw new Error(data.message || 'Failed to create payment order');
      }

      const { orderId, amount: orderAmount, currency, donationId } = data.data;

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YourKeyId',
        amount: orderAmount,
        currency: currency,
        name: 'Jadu & Art Foundation',
        description: `Donation for ${formData.campaign}`,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            // 3. Verify payment server-side
            const verifyRes = await donationService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              donationId: donationId
            });

            if (verifyRes.data.success) {
              // Store donation flag to prevent popup
              sessionStorage.setItem('hasDonated', 'true');
              localStorage.setItem('hasDonated', 'true');

              navigate('/donate/success', { 
                state: { 
                  amount, 
                  campaign: formData.campaign, 
                  ref: response.razorpay_payment_id 
                } 
              });
            } else {
              navigate('/donate/failed');
            }
          } catch (err) {
            navigate('/donate/failed');
          }
        },
        prefill: {
          name: formData.donorName,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#FF9933' // Brand Saffron
        }
      };

      if ((window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function () {
          navigate('/donate/failed');
        });
        rzp.open();
      } else {
        // Fallback simulation mode
        sessionStorage.setItem('hasDonated', 'true');
        localStorage.setItem('hasDonated', 'true');
        
        alert('Simulation mode: Razorpay payment simulation order created successfully. ID: ' + orderId);
        navigate('/donate/success', { 
          state: { amount, campaign: formData.campaign, ref: 'SIMULATED_PAYMENT_' + Date.now() } 
        });
      }

    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
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
      <div className="bg-primary-navy p-6 md:p-8 text-white">
        <div className="inline-flex items-center space-x-2 bg-primary-saffron/20 text-primary-saffron text-xs font-semibold px-3 py-1 rounded-full mb-3">
          <Heart size={14} className="fill-primary-saffron" />
          <span>DIRECT SOCIAL IMPACT</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Support a Cause</h3>
        <p className="text-gray-300 text-sm md:text-base leading-relaxed">
          {formData.campaign && formData.campaign !== 'Wherever Needed Most'
            ? `Selected Initiative: ${formData.campaign}`
            : 'Choose an initiative and contribute securely to transform lives.'}
        </p>
      </div>

      <div className="p-6 md:p-8">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm font-medium border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleDonate} className="space-y-6">
          {/* Cause Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide mb-3">
              1. Select Initiative
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {displayedOptions.map((item: any, idx: number) => {
                const title = item.title || item;
                const isSelected = formData.campaign === title;

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
                  formData.campaign === 'Wherever Needed Most'
                    ? 'border-primary-saffron bg-primary-saffron/10 text-primary-saffron font-bold shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Wherever Needed Most</span>
                  {formData.campaign === 'Wherever Needed Most' && <CheckCircle2 size={16} className="text-primary-saffron flex-shrink-0" />}
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

          {/* Donor Information */}
          <div>
            <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide mb-3">
              3. Donor Details
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="donorName"
                value={formData.donorName}
                onChange={handleInputChange}
                placeholder="Full Name *"
                required
                className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-primary-navy text-sm font-medium"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address *"
                required
                className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-primary-navy text-sm font-medium"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone Number *"
                required
                className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-primary-navy text-sm font-medium"
              />
              <input
                type="text"
                name="pan"
                value={formData.pan}
                onChange={handleInputChange}
                placeholder="PAN Number (Optional)"
                className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-primary-navy uppercase text-sm font-medium"
              />
            </div>
          </div>

          {/* Legal Acknowledgement Notice & Un-prechecked Checkbox */}
          <div className="space-y-2 pt-1 bg-gray-50/80 p-4 rounded-xl border border-gray-200">
            <label className="flex items-start space-x-2.5 text-xs text-gray-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-primary-saffron border-gray-300 focus:ring-primary-saffron shrink-0 cursor-pointer"
              />
              <span>
                I have read and agree to the{' '}
                <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-primary-saffron font-bold underline hover:text-orange-700">
                  Donation Terms
                </a>{' '}
                and{' '}
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary-saffron font-bold underline hover:text-orange-700">
                  Privacy Policy
                </a>
                .
              </span>
            </label>
            <p className="text-[11px] text-gray-500 pl-6">
              By proceeding with this donation, you acknowledge the <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-primary-navy font-semibold underline">Donation Terms</a> and <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary-navy font-semibold underline">Privacy Policy</a>.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary-saffron text-white py-4 rounded-xl font-extrabold text-lg shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center space-x-2 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <Heart className="w-5 h-5 fill-white" />
            <span>{loading ? 'Processing Order...' : `DONATE ${amount ? `₹${amount.toLocaleString('en-IN')}` : 'NOW'}`}</span>
          </button>

          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 font-medium pt-2">
            <ShieldCheck className="w-4 h-4 text-primary-green" />
            <span>256-bit Encrypted & Server Verified via Razorpay</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationForm;
