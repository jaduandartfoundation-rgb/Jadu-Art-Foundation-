import React from 'react';
import { Phone, Mail, MessageSquare, HeadphonesIcon, HelpCircle } from 'lucide-react';

interface PaymentSupportSectionProps {
  supportContact?: {
    phone?: string;
    whatsapp?: string;
    email?: string;
  };
}

const PaymentSupportSection: React.FC<PaymentSupportSectionProps> = ({ supportContact }) => {
  const phone = supportContact?.phone || '95896 21753';
  const cleanPhone = phone.replace(/\D/g, '');
  const email = supportContact?.email || 'jaduandartfoundation@gmail.com';
  const whatsappNumber = supportContact?.whatsapp || phone;
  const cleanWhatsapp = whatsappNumber.replace(/\D/g, '');

  return (
    <div className="bg-gradient-to-br from-[#063F36] to-[#006B3C] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
      <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-2xl" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 bg-white/15 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-[#F47B20] border border-white/20">
              <HeadphonesIcon size={13} />
              <span>DONOR ASSISTANCE</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              NEED HELP WITH YOUR DONATION?
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              Having trouble making a donation or need help confirming your payment? Contact our support team.
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[11px] font-bold text-emerald-200 block">Support Hours</span>
            <span className="text-xs font-black text-white">Mon – Sat: 9:00 AM – 7:00 PM IST</span>
          </div>
        </div>

        {/* Contact Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Phone Call */}
          <a
            href={`tel:+91${cleanPhone}`}
            className="p-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-sm transition-all transform hover:-translate-y-0.5 group block text-white"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F47B20] text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
              <Phone size={18} />
            </div>
            <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider block">Call Foundation Support</span>
            <span className="text-base font-black tracking-tight block mt-0.5">{phone}</span>
            <span className="text-[11px] text-emerald-200/80 mt-1 block">Click to call directly →</span>
          </a>

          {/* Email Support */}
          <a
            href={`mailto:${email}?subject=Donation%20Support%20Enquiry`}
            className="p-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-sm transition-all transform hover:-translate-y-0.5 group block text-white"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
              <Mail size={18} />
            </div>
            <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider block">Email Support</span>
            <span className="text-sm font-black tracking-tight truncate block mt-0.5">{email}</span>
            <span className="text-[11px] text-emerald-200/80 mt-1 block">Click to compose email →</span>
          </a>

          {/* WhatsApp Chat */}
          <a
            href={`https://wa.me/91${cleanWhatsapp}?text=Hello%20Jadu%20%26%20Art%20Foundation,%20I%20need%20assistance%20regarding%20my%20donation.`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-sm transition-all transform hover:-translate-y-0.5 group block text-white"
          >
            <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
              <MessageSquare size={18} />
            </div>
            <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider block">WhatsApp Support</span>
            <span className="text-base font-black tracking-tight block mt-0.5">{whatsappNumber}</span>
            <span className="text-[11px] text-emerald-200/80 mt-1 block">Chat on WhatsApp →</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentSupportSection;
