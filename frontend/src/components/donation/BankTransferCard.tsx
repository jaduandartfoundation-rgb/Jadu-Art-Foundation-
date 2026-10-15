import React, { useState } from 'react';
import { Building2, Copy, Check, ShieldCheck, AlertCircle, ExternalLink, ArrowRight } from 'lucide-react';

interface BankTransferCardProps {
  bankConfig: {
    isPublished?: boolean;
    accountHolder?: string | null;
    bankName?: string | null;
    accountNumber?: string | null;
    ifsc?: string | null;
    branch?: string | null;
    statusMessage?: string;
  };
  onScrollToConfirmation?: () => void;
}

const BankTransferCard: React.FC<BankTransferCardProps> = ({ bankConfig, onScrollToConfirmation }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Fallback values from official foundation records if published
  const accountHolder = bankConfig.accountHolder || 'Jadu and Art Foundation';
  const bankName = bankConfig.bankName || 'Punjab National Bank';
  const accountNumber = bankConfig.accountNumber || '1896102100000714';
  const ifsc = bankConfig.ifsc || 'PUNB0189610';
  const branch = bankConfig.branch || 'Janjgir (Janjgir - Champa)';
  const isPublished = bankConfig.isPublished !== false;

  const copyToClipboard = (text: string, label: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          setCopiedField(label);
          setCopyFeedback(`${label} copied successfully.`);
          setTimeout(() => {
            setCopiedField(null);
            setCopyFeedback(null);
          }, 3000);
        });
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopiedField(label);
        setCopyFeedback(`${label} copied successfully.`);
        setTimeout(() => {
          setCopiedField(null);
          setCopyFeedback(null);
        }, 3000);
      }
    } catch (err) {
      setCopyFeedback('Failed to copy to clipboard. Please copy manually.');
      setTimeout(() => setCopyFeedback(null), 3500);
    }
  };

  const copyAllDetails = () => {
    const allText = [
      `Beneficiary Name: ${accountHolder}`,
      `Bank: ${bankName}`,
      `Account Number: ${accountNumber}`,
      `IFSC Code: ${ifsc}`,
      `Branch: ${branch}`,
      `Account Type: Current Account (Foundation / Trust)`
    ].join('\n');

    copyToClipboard(allText, 'All bank details');
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-emerald-900/10 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#063F36] to-[#006B3C] p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 rounded-full bg-white/5 pointer-events-none blur-xl" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-2 border border-white/20">
              <Building2 size={13} className="text-[#F47B20]" />
              <span>DIRECT BANK TRANSFER</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              DONATE THROUGH BANK TRANSFER
            </h3>
            <p className="text-emerald-100 font-medium text-xs sm:text-sm mt-0.5 hindi-text">
              बैंक ट्रांसफर द्वारा दान करें (NEFT / RTGS / IMPS)
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-[#C99020]/20 text-amber-200 border border-amber-300/30">
              <ShieldCheck size={14} className="text-[#C99020]" />
              <span>{isPublished ? 'Official Bank Account' : 'Verification Pending'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Copy Feedback Toast */}
        {copyFeedback && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-2">
              <Check size={16} className="text-emerald-600 shrink-0" />
              <span>{copyFeedback}</span>
            </div>
            <span className="text-[10px] text-emerald-700 uppercase tracking-wider font-extrabold">Copied</span>
          </div>
        )}

        {!isPublished ? (
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-sm">
              <AlertCircle size={18} className="text-amber-600 shrink-0" />
              <span>Official Account Details Under Verification</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              {bankConfig.statusMessage || 'The official bank account information has been supplied by the foundation and is currently undergoing administrative verification against bank records before public activation.'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              You can transfer donations directly from your mobile banking app or net banking portal via <strong className="text-gray-900">IMPS, NEFT, or RTGS</strong>. Please save your transaction reference number (UTR) to share with us.
            </p>

            {/* Bank Details Field Grid */}
            <div className="space-y-3.5">
              {/* Account Holder */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:border-emerald-300 transition-colors gap-2">
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Account Holder / Beneficiary Name</span>
                  <span className="text-sm sm:text-base font-extrabold text-[#063F36]">{accountHolder}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(accountHolder, 'Account Holder Name')}
                  className="self-start sm:self-center inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm transition-all"
                  title="Copy Account Holder Name"
                >
                  {copiedField === 'Account Holder Name' ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                  <span>{copiedField === 'Account Holder Name' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Bank Name */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:border-emerald-300 transition-colors gap-2">
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Bank Name</span>
                  <span className="text-sm sm:text-base font-extrabold text-[#063F36]">{bankName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(bankName, 'Bank Name')}
                  className="self-start sm:self-center inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm transition-all"
                  title="Copy Bank Name"
                >
                  {copiedField === 'Bank Name' ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                  <span>{copiedField === 'Bank Name' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Account Number */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-emerald-50/60 border-2 border-emerald-200 hover:border-emerald-400 transition-colors gap-2">
                <div>
                  <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block">Account Number</span>
                  <span className="text-base sm:text-lg font-mono font-black text-[#063F36] tracking-wider">{accountNumber}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(accountNumber, 'Account number')}
                  className="self-start sm:self-center inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#006B3C] text-white hover:bg-emerald-800 shadow-sm transition-all"
                  title="Copy Account Number"
                >
                  {copiedField === 'Account number' ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedField === 'Account number' ? 'Copied' : 'Copy Number'}</span>
                </button>
              </div>

              {/* IFSC Code */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-emerald-50/60 border-2 border-emerald-200 hover:border-emerald-400 transition-colors gap-2">
                <div>
                  <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block">IFSC Code</span>
                  <span className="text-base sm:text-lg font-mono font-black text-[#063F36] tracking-wider">{ifsc}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(ifsc, 'IFSC Code')}
                  className="self-start sm:self-center inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#006B3C] text-white hover:bg-emerald-800 shadow-sm transition-all"
                  title="Copy IFSC Code"
                >
                  {copiedField === 'IFSC Code' ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedField === 'IFSC Code' ? 'Copied' : 'Copy IFSC'}</span>
                </button>
              </div>

              {/* Branch */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:border-emerald-300 transition-colors gap-2">
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Branch Location</span>
                  <span className="text-sm sm:text-base font-extrabold text-[#063F36]">{branch}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(branch, 'Branch')}
                  className="self-start sm:self-center inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm transition-all"
                  title="Copy Branch"
                >
                  {copiedField === 'Branch' ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                  <span>{copiedField === 'Branch' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={copyAllDetails}
                className="flex-1 py-3.5 px-6 rounded-xl font-extrabold text-sm bg-gradient-to-r from-[#F47B20] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/20 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Copy size={16} />
                <span>COPY ALL BANK DETAILS</span>
              </button>

              {onScrollToConfirmation && (
                <button
                  type="button"
                  onClick={onScrollToConfirmation}
                  className="py-3.5 px-6 rounded-xl font-bold text-sm bg-emerald-50 hover:bg-emerald-100 text-[#006B3C] border border-emerald-300 flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                >
                  <span>Already Transferred? Confirm</span>
                  <ArrowRight size={15} />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BankTransferCard;
