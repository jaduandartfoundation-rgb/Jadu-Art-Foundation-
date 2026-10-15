import React from 'react';
import { Printer, X, ShieldCheck, Heart, Building2, CheckCircle2 } from 'lucide-react';

interface DonationAcknowledgementModalProps {
  donation: any;
  onClose: () => void;
  onMarkAcknowledgementSent?: (sent: boolean) => void;
}

const DonationAcknowledgementModal: React.FC<DonationAcknowledgementModalProps> = ({
  donation,
  onClose,
  onMarkAcknowledgementSent
}) => {
  if (!donation) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(donation.paymentDate || donation.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-10 space-y-6 shadow-2xl relative border border-gray-200 my-8">
        {/* Action Header */}
        <div className="flex justify-between items-center border-b pb-4 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-[#006B3C] flex items-center justify-center font-bold">
              <CheckCircle2 size={18} />
            </span>
            <h3 className="text-lg font-black text-[#063F36] uppercase tracking-wide">
              Official Donation Acknowledgement
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Printable Voucher Area */}
        <div className="p-6 sm:p-8 bg-[#FBF8F1] rounded-2xl border-2 border-emerald-900/10 space-y-6 text-[#17201D] print:border-none print:p-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-[#063F36]/20 pb-5 gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#063F36] tracking-tight">
                JADU & ART FOUNDATION
              </h2>
              <p className="text-xs text-gray-600 font-bold uppercase tracking-wider mt-0.5">
                Seva • Sanskar • Samriddh Bharat
              </p>
              <p className="text-[11px] text-gray-500">
                Official Account: Punjab National Bank • Janjgir Branch
              </p>
            </div>
            <div className="sm:text-right">
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#063F36] text-white px-3 py-1 rounded-md inline-block">
                ACKNOWLEDGEMENT SLIP
              </span>
              <p className="text-[11px] font-mono text-gray-500 mt-1">
                Ref ID: {donation._id?.toString().slice(-8).toUpperCase()}
              </p>
            </div>
          </div>

          {/* Acknowledgement Statement */}
          <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-gray-800">
            <p>
              We gratefully acknowledge receipt of voluntary contribution from <strong className="text-[#063F36] font-black text-sm">{donation.donorName}</strong>.
            </p>
          </div>

          {/* Details Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden text-xs">
            <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
              <div className="p-3 bg-gray-50/70 font-bold text-gray-500">Amount Received</div>
              <div className="p-3 font-black text-[#006B3C] text-base">₹{(donation.amount || 0).toLocaleString('en-IN')}</div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
              <div className="p-3 bg-gray-50/70 font-bold text-gray-500">Payment Channel</div>
              <div className="p-3 font-bold">{donation.paymentMethod || donation.paymentType || 'Direct Transfer'}</div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
              <div className="p-3 bg-gray-50/70 font-bold text-gray-500">Transaction Reference / UTR</div>
              <div className="p-3 font-mono font-bold text-[#063F36]">{donation.transactionRef || donation.cashfreePaymentId || 'N/A'}</div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
              <div className="p-3 bg-gray-50/70 font-bold text-gray-500">Transaction / Receipt Date</div>
              <div className="p-3 font-medium">{formattedDate}</div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
              <div className="p-3 bg-gray-50/70 font-bold text-gray-500">Cause / Initiative</div>
              <div className="p-3 font-medium">{donation.campaign || 'Wherever Needed Most'}</div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-gray-200">
              <div className="p-3 bg-gray-50/70 font-bold text-gray-500">Reconciliation Status</div>
              <div className="p-3 font-bold text-emerald-800 flex items-center space-x-1">
                <CheckCircle2 size={13} className="text-emerald-600" />
                <span>Verified against Punjab National Bank statement credit</span>
              </div>
            </div>
          </div>

          {/* Legal Non-80G Clarification Banner (Requirement 10 & 11) */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-950 leading-relaxed space-y-1">
            <div className="font-extrabold text-amber-900 uppercase tracking-wider text-[10px] flex items-center space-x-1.5">
              <ShieldCheck size={13} className="text-amber-700" />
              <span>Statutory Compliance Notice</span>
            </div>
            <p>
              This document is an administrative acknowledgement of receipt of voluntary contribution. <strong>This document is NOT a tax exemption certificate under Section 80G of the Income Tax Act.</strong> Official 12A/80G status documentation is undergoing statutory administrative verification.
            </p>
          </div>

          {/* Footer Sign-off */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pt-4 border-t border-gray-200 gap-4 text-xs">
            <div>
              <span className="text-[11px] text-gray-500 block">Contact & Inquiries:</span>
              <span className="font-bold text-gray-800">Phone: 95896 21753 • jaduandartfoundation@gmail.com</span>
            </div>

            <div className="text-left sm:text-right">
              <span className="font-bold text-[#063F36] block">Authorized Accounts Signatory</span>
              <span className="text-[10px] text-gray-500 block">Jadu & Art Foundation</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 print:hidden">
          <div className="flex items-center space-x-2">
            {onMarkAcknowledgementSent && (
              <button
                type="button"
                onClick={() => onMarkAcknowledgementSent(!donation.acknowledgementSent)}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  donation.acknowledgementSent
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                }`}
              >
                {donation.acknowledgementSent ? '✓ Acknowledgement Sent' : 'Mark as Sent'}
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl text-xs font-extrabold bg-[#006B3C] text-white hover:bg-emerald-800 flex items-center justify-center space-x-1.5 shadow-md transition-colors cursor-pointer"
            >
              <Printer size={14} />
              <span>Print Acknowledgement</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationAcknowledgementModal;
