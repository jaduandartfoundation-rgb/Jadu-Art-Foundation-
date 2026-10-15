import React, { useState, useEffect } from 'react';
import { donationService, initiativeService } from '../../services/api';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  Calendar,
  DollarSign,
  Heart,
  Clock,
  Printer
} from 'lucide-react';

interface DonationConfirmationFormProps {
  className?: string;
}

const DonationConfirmationForm: React.FC<DonationConfirmationFormProps> = ({ className = '' }) => {
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    donorName: '',
    email: '',
    phone: '',
    amount: '1000',
    paymentMethod: 'UPI' as 'UPI' | 'NEFT' | 'IMPS' | 'Other',
    transactionRef: '',
    paymentDate: new Date().toISOString().split('T')[0],
    campaign: 'Wherever Needed Most',
    initiativeId: '',
    donorMessage: ''
  });

  const presetAmounts = [500, 1000, 2500, 5000, 10000];

  useEffect(() => {
    initiativeService.getInitiatives()
      .then(res => {
        if (res.data && res.data.data) {
          setInitiatives(res.data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInitiativeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (!selectedId || selectedId === 'Wherever Needed Most') {
      setFormData(prev => ({
        ...prev,
        campaign: 'Wherever Needed Most',
        initiativeId: ''
      }));
    } else {
      const init = initiatives.find(i => i._id === selectedId);
      setFormData(prev => ({
        ...prev,
        campaign: init?.title || 'General Support',
        initiativeId: selectedId
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Frontend validations
    if (!formData.donorName.trim() || formData.donorName.trim().length < 2) {
      setError('Please enter your full name (minimum 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }

    const numAmount = Number(formData.amount);
    if (!numAmount || isNaN(numAmount) || numAmount < 1) {
      setError('Please specify a valid donation amount of at least ₹1.');
      return;
    }

    const cleanRef = formData.transactionRef.trim();
    if (!cleanRef || cleanRef.length < 4) {
      setError('Please enter your transaction reference / UTR number (minimum 4 characters).');
      return;
    }

    setLoading(true);

    try {
      const res = await donationService.confirmDirectDonation({
        donorName: formData.donorName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        amount: numAmount,
        paymentMethod: formData.paymentMethod,
        transactionRef: cleanRef,
        paymentDate: formData.paymentDate,
        campaign: formData.campaign,
        initiativeId: formData.initiativeId || undefined,
        donorMessage: formData.donorMessage.trim()
      });

      if (res.data && res.data.success) {
        setSuccessData({
          ...res.data.data,
          message: res.data.message,
          paymentMethod: formData.paymentMethod,
          campaign: formData.campaign,
          email: formData.email,
          phone: formData.phone
        });
      } else {
        throw new Error(res.data?.message || 'Submission failed');
      }
    } catch (err: any) {
      const serverMsg = err.response?.data?.message || err.message || 'An error occurred while submitting your confirmation.';
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setSuccessData(null);
    setError(null);
    setFormData({
      donorName: '',
      email: '',
      phone: '',
      amount: '1000',
      paymentMethod: 'UPI',
      transactionRef: '',
      paymentDate: new Date().toISOString().split('T')[0],
      campaign: 'Wherever Needed Most',
      initiativeId: '',
      donorMessage: ''
    });
  };

  // Submission Success View
  if (successData) {
    return (
      <div className={`bg-white rounded-3xl border-2 border-emerald-900/10 shadow-xl p-6 sm:p-10 space-y-6 ${className}`}>
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-100 text-[#006B3C] rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 size={36} />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full inline-block">
            Confirmation Submitted
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#063F36] tracking-tight">
            THANK YOU FOR YOUR SUPPORT
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto hindi-text">
            आपकी दान की जानकारी सफलतापूर्वक दर्ज कर ली गई है।
          </p>
        </div>

        {/* Official Reconciliation Notice */}
        <div className="p-4 sm:p-5 bg-amber-50/90 border border-amber-200 rounded-2xl text-amber-950 space-y-2 text-xs sm:text-sm leading-relaxed">
          <div className="flex items-center space-x-2 font-bold text-amber-900">
            <Clock size={18} className="text-amber-700 shrink-0" />
            <span>Verification Process in Progress</span>
          </div>
          <p>
            "{successData.message || 'Submitting this form does not automatically confirm that your payment has been received. The foundation will verify the transaction against its bank records.'}"
          </p>
          <p className="text-[11px] text-amber-800">
            Our accounts team reconciles all submitted UTR numbers against Punjab National Bank statement credits before formal acknowledgement is recorded.
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3 text-xs sm:text-sm">
          <h4 className="font-extrabold text-[#063F36] uppercase tracking-wider text-xs border-b border-gray-200 pb-2">
            Submitted Transaction Summary
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
            <div>
              <span className="text-gray-500 block text-[11px] font-bold">Donor Name:</span>
              <span className="font-bold text-[#063F36]">{successData.donorName}</span>
            </div>

            <div>
              <span className="text-gray-500 block text-[11px] font-bold">Donation Amount:</span>
              <span className="font-black text-emerald-800 text-base">₹{Number(successData.amount).toLocaleString('en-IN')}</span>
            </div>

            <div>
              <span className="text-gray-500 block text-[11px] font-bold">Payment Method:</span>
              <span className="font-bold">{successData.paymentMethod}</span>
            </div>

            <div>
              <span className="text-gray-500 block text-[11px] font-bold">Transaction Reference / UTR:</span>
              <span className="font-mono font-bold text-[#063F36] bg-white px-2 py-0.5 rounded border border-gray-200 inline-block">{successData.transactionRef}</span>
            </div>

            <div>
              <span className="text-gray-500 block text-[11px] font-bold">Initiative / Cause:</span>
              <span>{successData.campaign}</span>
            </div>

            <div>
              <span className="text-gray-500 block text-[11px] font-bold">Submission Status:</span>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                <Clock size={11} />
                <span>Pending Bank Reconciliation</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 py-3 px-5 rounded-xl font-bold text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <Printer size={15} />
            <span>Print / Save Summary</span>
          </button>

          <button
            type="button"
            onClick={handleResetForm}
            className="flex-1 py-3 px-5 rounded-xl font-extrabold text-xs bg-[#006B3C] text-white hover:bg-emerald-800 flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <span>Submit Another Confirmation</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-3xl border-2 border-emerald-900/10 shadow-xl overflow-hidden transition-all duration-300 ${className}`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#063F36] to-[#006B3C] p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 rounded-full bg-white/5 pointer-events-none blur-xl" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-2 border border-white/20">
              <FileText size={13} className="text-[#F47B20]" />
              <span>PAYMENT RECONCILIATION</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              CONFIRM YOUR DONATION
            </h3>
            <p className="text-emerald-100 font-medium text-xs sm:text-sm mt-0.5 hindi-text">
              दान की जानकारी साझा करें (बैंक सत्यापन हेतु)
            </p>
          </div>

          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-[#C99020]/20 text-amber-200 border border-amber-300/30 self-start sm:self-auto">
            <ShieldCheck size={14} className="text-[#C99020]" />
            <span>Manual Bank Credit Check</span>
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Error Banner */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold flex items-start space-x-2.5">
            <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{error}</div>
          </div>
        )}

        {/* Mandatory Transparency Notice */}
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl text-amber-900 text-xs leading-relaxed space-y-1">
          <div className="font-extrabold text-[#063F36] uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
            <ShieldCheck size={14} className="text-[#006B3C]" />
            <span>Important Notice Regarding Direct Transfers</span>
          </div>
          <p>
            "Submitting this form does not automatically confirm that your payment has been received. The foundation will verify the transaction against its bank records."
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Amount Donated */}
          <div>
            <label className="block text-xs font-black text-[#063F36] uppercase tracking-wider mb-2">
              1. Amount Donated (₹) *
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
              {presetAmounts.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setFormData(prev => ({ ...prev, amount: amt.toString() }))}
                  className={`py-2 px-3 text-center rounded-xl text-xs font-bold border transition-all ${
                    Number(formData.amount) === amt
                      ? 'border-[#F47B20] bg-orange-50 text-[#F47B20] shadow-sm font-black'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50/60'
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
                name="amount"
                min="1"
                required
                value={formData.amount}
                onChange={handleChange}
                placeholder="Or enter custom amount in Rupees"
                className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006B3C] focus:border-[#006B3C] text-sm font-bold text-gray-800"
              />
            </div>
          </div>

          {/* Row 2: Payment Method */}
          <div>
            <label className="block text-xs font-black text-[#063F36] uppercase tracking-wider mb-2">
              2. Payment Method Used *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['UPI', 'NEFT', 'IMPS', 'Other'] as const).map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method }))}
                  className={`py-3 px-4 text-center rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                    formData.paymentMethod === method
                      ? 'border-[#006B3C] bg-emerald-50 text-[#006B3C] ring-2 ring-emerald-500/20'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50/70'
                  }`}
                >
                  {method === 'UPI' ? 'UPI QR / App' : method}
                </button>
              ))}
            </div>
          </div>

          {/* Row 3: Transaction Reference / UTR & Payment Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-[#063F36] uppercase tracking-wider mb-2">
                3. Transaction Reference / UTR Number *
              </label>
              <input
                type="text"
                name="transactionRef"
                required
                value={formData.transactionRef}
                onChange={handleChange}
                placeholder="e.g. 12-digit UTR or UPI Ref ID"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006B3C] focus:border-[#006B3C] text-xs sm:text-sm font-mono font-bold uppercase tracking-wider"
              />
              <span className="text-[11px] text-gray-500 mt-1 block">
                Found on your UPI success screen or bank transfer debit receipt.
              </span>
            </div>

            <div>
              <label className="block text-xs font-black text-[#063F36] uppercase tracking-wider mb-2">
                4. Payment Date *
              </label>
              <input
                type="date"
                name="paymentDate"
                required
                value={formData.paymentDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006B3C] focus:border-[#006B3C] text-xs sm:text-sm font-bold text-gray-800"
              />
            </div>
          </div>

          {/* Row 4: Donor Details */}
          <div>
            <label className="block text-xs font-black text-[#063F36] uppercase tracking-wider mb-2">
              5. Donor Contact Details
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                name="donorName"
                required
                value={formData.donorName}
                onChange={handleChange}
                placeholder="Full Name *"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006B3C] focus:border-[#006B3C] text-xs sm:text-sm font-medium"
              />

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address *"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006B3C] focus:border-[#006B3C] text-xs sm:text-sm font-medium"
              />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number (Optional)"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006B3C] focus:border-[#006B3C] text-xs sm:text-sm font-medium"
              />
            </div>
          </div>

          {/* Row 5: Initiative / Cause Selection */}
          <div>
            <label className="block text-xs font-black text-[#063F36] uppercase tracking-wider mb-2">
              6. Dedicate Donation to Specific Cause (Optional)
            </label>
            <select
              value={formData.initiativeId || 'Wherever Needed Most'}
              onChange={handleInitiativeSelect}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006B3C] focus:border-[#006B3C] text-xs sm:text-sm font-semibold bg-white"
            >
              <option value="Wherever Needed Most">Wherever Needed Most (General Fund)</option>
              {initiatives.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.title} ({item.category || 'Initiative'})
                </option>
              ))}
            </select>
          </div>

          {/* Row 6: Optional Message */}
          <div>
            <label className="block text-xs font-black text-[#063F36] uppercase tracking-wider mb-2">
              7. Optional Message / Donor Note
            </label>
            <textarea
              name="donorMessage"
              rows={2}
              value={formData.donorMessage}
              onChange={handleChange}
              placeholder="Any message, prayer, or specific note regarding your voluntary contribution..."
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006B3C] focus:border-[#006B3C] text-xs sm:text-sm font-medium"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-[#F47B20] to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-xl shadow-orange-500/20 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <Send size={16} />
            <span>{loading ? 'Submitting Confirmation...' : 'CONFIRM MY DONATION'}</span>
          </button>

          <p className="text-[11px] text-gray-500 text-center">
            Transactions are reconciled by foundation accounts against official Punjab National Bank records.
          </p>
        </form>
      </div>
    </div>
  );
};

export default DonationConfirmationForm;
