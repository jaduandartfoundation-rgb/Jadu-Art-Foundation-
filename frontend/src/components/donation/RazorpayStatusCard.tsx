import React from 'react';
import { CreditCard, Clock, QrCode, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';

interface RazorpayStatusCardProps {
  onSelectUpi: () => void;
  onSelectBank: () => void;
}

const RazorpayStatusCard: React.FC<RazorpayStatusCardProps> = ({ onSelectUpi, onSelectBank }) => {
  return (
    <div className="bg-white rounded-3xl border-2 border-emerald-900/10 shadow-xl overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-white/10 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-2 border border-white/20">
              <CreditCard size={13} className="text-amber-400" />
              <span>PAYMENT GATEWAY STATUS</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              ONLINE CARD / GATEWAY DONATIONS
            </h3>
            <p className="text-slate-300 font-medium text-xs sm:text-sm mt-0.5">
              Razorpay Payment Gateway Account Activation in Progress
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <Clock size={14} className="text-amber-400" />
              <span>Pending Merchant Activation</span>
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-950 space-y-3">
          <div className="flex items-center space-x-2 font-bold text-sm text-amber-900">
            <Clock size={18} className="text-amber-700 shrink-0" />
            <span>Razorpay Activation Notice</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-amber-900">
            The Foundation’s official Razorpay merchant account is currently undergoing standard institutional compliance and KYC activation. In accordance with our transparency standards, online card payments will be enabled once onboarding is fully operational.
          </p>
          <div className="text-[11px] text-amber-800 font-semibold flex items-center space-x-1.5">
            <ShieldCheck size={14} className="text-amber-700" />
            <span>Zero-fee direct donations are currently live via Official UPI QR and Bank Transfer.</span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#063F36]">
            Please Use Our Active Verified Channels:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={onSelectUpi}
              className="p-5 rounded-2xl border-2 border-emerald-100 hover:border-[#006B3C] bg-emerald-50/40 hover:bg-emerald-50 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#006B3C] text-white flex items-center justify-center shadow-sm">
                  <QrCode size={20} />
                </div>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Recommended
                </span>
              </div>
              <h5 className="font-extrabold text-[#063F36] text-sm group-hover:text-[#006B3C] transition-colors">
                Instant UPI QR Code
              </h5>
              <p className="text-xs text-gray-600 leading-relaxed">
                Scan with GPay, PhonePe, Paytm, or BHIM. Zero payment gateway deduction; 100% reaches the mission.
              </p>
            </div>

            <div 
              onClick={onSelectBank}
              className="p-5 rounded-2xl border-2 border-emerald-100 hover:border-[#006B3C] bg-emerald-50/40 hover:bg-emerald-50 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#063F36] text-white flex items-center justify-center shadow-sm">
                  <Building2 size={20} />
                </div>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Direct Bank
                </span>
              </div>
              <h5 className="font-extrabold text-[#063F36] text-sm group-hover:text-[#006B3C] transition-colors">
                Punjab National Bank Transfer
              </h5>
              <p className="text-xs text-gray-600 leading-relaxed">
                Direct NEFT / IMPS / RTGS transfer to the official Jadu & Art Foundation current account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RazorpayStatusCard;
