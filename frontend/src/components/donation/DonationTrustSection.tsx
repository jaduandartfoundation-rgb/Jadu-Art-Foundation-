import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle, 
  FileCheck, 
  FileText, 
  AlertTriangle, 
  ArrowRight,
  ExternalLink 
} from 'lucide-react';

const DonationTrustSection: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-10 space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full inline-block">
          Trust & Accountability
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-[#063F36] tracking-tight">
          OUR TRANSPARENT DONATION PROCESS
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          How voluntary donations are received, verified against official Punjab National Bank records, and formally acknowledged.
        </p>
      </div>

      {/* 5-Step Process */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Step 1 */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 relative">
          <div className="w-8 h-8 rounded-xl bg-[#006B3C] text-white flex items-center justify-center font-black text-xs">
            1
          </div>
          <h4 className="font-extrabold text-sm text-[#063F36]">Verify Recipient</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Ensure the recipient name appears as <strong>"JADU AND ART FOUNDATION"</strong> before completing payment.
          </p>
        </div>

        {/* Step 2 */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 relative">
          <div className="w-8 h-8 rounded-xl bg-[#006B3C] text-white flex items-center justify-center font-black text-xs">
            2
          </div>
          <h4 className="font-extrabold text-sm text-[#063F36]">Save Reference</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Note down your 12-digit UTR or transaction reference number from your bank or UPI payment receipt.
          </p>
        </div>

        {/* Step 3 */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 relative">
          <div className="w-8 h-8 rounded-xl bg-[#006B3C] text-white flex items-center justify-center font-black text-xs">
            3
          </div>
          <h4 className="font-extrabold text-sm text-[#063F36]">Submit Details</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Fill the "Confirm Your Donation" form with your transaction UTR so our accounts team can trace it.
          </p>
        </div>

        {/* Step 4 */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 relative">
          <div className="w-8 h-8 rounded-xl bg-[#006B3C] text-white flex items-center justify-center font-black text-xs">
            4
          </div>
          <h4 className="font-extrabold text-sm text-[#063F36]">Bank Reconciliation</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Our finance team reconciles the transaction against actual bank account credits in Punjab National Bank.
          </p>
        </div>

        {/* Step 5 */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 relative">
          <div className="w-8 h-8 rounded-xl bg-[#006B3C] text-white flex items-center justify-center font-black text-xs">
            5
          </div>
          <h4 className="font-extrabold text-sm text-[#063F36]">Acknowledgement</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Formal voluntary contribution acknowledgement is recorded and issued according to configured foundation process.
          </p>
        </div>
      </div>

      {/* Statutory & Tax-Benefit Disclosure */}
      <div className="p-5 bg-amber-50/90 border border-amber-200 rounded-2xl text-amber-950 space-y-2 text-xs leading-relaxed">
        <div className="flex items-center space-x-2 font-black text-amber-900 text-sm">
          <AlertTriangle size={17} className="text-amber-700 shrink-0" />
          <span>Statutory Registration & Tax Status Disclosure</span>
        </div>
        <p>
          The Foundation’s official registration and tax exemption status (such as 12A, 80G, or FCRA) are currently under administrative verification against official government records. In strict adherence to truth in non-profit communication, <strong>tax-benefit and 80G deduction claims are kept disabled</strong> until certified documentation is formally verified and uploaded.
        </p>
        <p className="text-[11px] text-amber-800">
          All donations made during this period are voluntary direct contributions towards the Foundation’s education, healthcare, and cow welfare initiatives.
        </p>
      </div>

      {/* Official Legal Policy Links */}
      <div className="pt-2 border-t border-gray-200">
        <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3">
          Foundation Legal Governance & Policies
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/privacy-policy"
            className="p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 text-xs font-bold text-[#063F36] flex items-center justify-between transition-colors"
          >
            <span>Privacy Policy</span>
            <ArrowRight size={13} className="text-gray-400" />
          </Link>

          <Link
            to="/terms-and-conditions"
            className="p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 text-xs font-bold text-[#063F36] flex items-center justify-between transition-colors"
          >
            <span>Terms & Conditions</span>
            <ArrowRight size={13} className="text-gray-400" />
          </Link>

          <Link
            to="/refund-policy"
            className="p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 text-xs font-bold text-[#063F36] flex items-center justify-between transition-colors"
          >
            <span>Refund Policy</span>
            <ArrowRight size={13} className="text-gray-400" />
          </Link>

          <Link
            to="/contact"
            className="p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 text-xs font-bold text-[#063F36] flex items-center justify-between transition-colors"
          >
            <span>Contact Us</span>
            <ArrowRight size={13} className="text-gray-400" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DonationTrustSection;
