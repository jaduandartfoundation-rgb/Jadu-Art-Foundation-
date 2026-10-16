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
    <div 
      className="bg-[#063F36] bg-gradient-to-br from-[#063F36] to-[#006B3C] rounded-3xl p-5 sm:p-10 text-white shadow-xl relative overflow-hidden border border-emerald-800/40"
      style={{ backgroundColor: '#063F36', color: '#ffffff' }}
    >
      <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-2xl" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 bg-black/30 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase text-[#F47B20] border border-white/20">
              <HeadphonesIcon size={13} className="text-[#F47B20]" />
              <span>DONOR ASSISTANCE</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              NEED HELP WITH YOUR DONATION?
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl leading-relaxed font-medium">
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
            style={{ backgroundColor: '#042822' }}
            className="p-5 rounded-2xl bg-[#042822] hover:bg-[#031d19] border border-emerald-600/30 transition-all transform hover:-translate-y-0.5 group block text-white shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F47B20] text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
              <Phone size={18} />
            </div>
            <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider block">Call Foundation Support</span>
            <span className="text-base font-black tracking-tight block mt-0.5 text-white">{phone}</span>
            <span className="text-[11px] text-emerald-300 font-bold mt-1.5 block">Click to call directly →</span>
          </a>

          {/* Email Support */}
          <a
            href={`mailto:${email}?subject=Donation%20Support%20Enquiry`}
            style={{ backgroundColor: '#042822' }}
            className="p-5 rounded-2xl bg-[#042822] hover:bg-[#031d19] border border-emerald-600/30 transition-all transform hover:-translate-y-0.5 group block text-white shadow-lg overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
              <Mail size={18} />
            </div>
            <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider block">Email Support</span>
            <span className="text-xs sm:text-sm font-black tracking-tight break-all block mt-0.5 text-white">{email}</span>
            <span className="text-[11px] text-emerald-300 font-bold mt-1.5 block">Click to compose email →</span>
          </a>

          {/* WhatsApp Chat */}
          <a
            href={`https://wa.me/91${cleanWhatsapp}?text=Hello%20Jadu%20%26%20Art%20Foundation,%20I%20need%20assistance%20regarding%20my%20donation.`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: '#042822' }}
            className="p-5 rounded-2xl bg-[#042822] hover:bg-[#031d19] border border-emerald-600/30 transition-all transform hover:-translate-y-0.5 group block text-white shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
              <MessageSquare size={18} />
            </div>
            <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider block">WhatsApp Support</span>
            <span className="text-base font-black tracking-tight block mt-0.5 text-white">{whatsappNumber}</span>
            <span className="text-[11px] text-emerald-300 font-bold mt-1.5 block">Chat on WhatsApp →</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentSupportSection;
