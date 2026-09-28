import React, { useState } from 'react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import BilingualHeading from '../components/BilingualHeading';
import DynamicSEO from '../components/DynamicSEO';
import { 
  RefreshCw, 
  ShieldCheck, 
  Mail, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const RefundPolicy: React.FC = () => {
  const { settings } = useSiteSettings();
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  const email = settings.legalContactEmail || settings.officialEmail || 'jaduandartfoundation@gmail.com';
  const lastUpdated = settings.lastUpdatedDate || 'September 26, 2026';
  const foundationName = settings.foundationName || 'Jadu & Art Foundation';

  const sections = [
    { id: 'nature', label: '1. Voluntary Contribution Nature', hindiLabel: '1. ऐच्छिक अंशदान की प्रकृति' },
    { id: 'erroneous', label: '2. Erroneous & Duplicate Transactions', hindiLabel: '2. त्रुटिपूर्ण या डुप्लिकेट लेनदेन' },
    { id: 'process', label: '3. Step-by-Step Refund Request Process', hindiLabel: '3. रिफंड आवेदन प्रक्रिया' },
    { id: 'verification', label: '4. Gateway Verification & Resolution', hindiLabel: '4. गेटवे सत्यापन और समाधान' },
    { id: 'security', label: '5. Critical Anti-Fraud Security Notice', hindiLabel: '5. धोखाधड़ी रोधी सुरक्षा निर्देश' },
    { id: 'contact', label: '6. Official Refund Contact Desk', hindiLabel: '6. आधिकारिक रिफंड सहायता डेस्क' }
  ];

  const scrollToSection = (id: string) => {
    setMobileTocOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-brand-cream min-h-screen py-12 md:py-16 font-sans text-text-primary">
      <DynamicSEO 
        title={`Donation Refund Policy | ${foundationName}`}
        description={`Official Donation Refund and Cancellation Policy of ${foundationName}. Guidelines for resolving duplicate transactions, payment verification, and refund requests.`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <BilingualHeading 
            englishTitle="DONATION REFUND & CANCELLATION POLICY"
            hindiTitle="दान वापसी एवं रद्दीकरण नीति"
            subtitle={`Transparent process for handling erroneous or duplicate online donations at ${foundationName}.`}
          />

          {/* Language Switcher */}
          <div className="inline-flex items-center p-1 bg-white rounded-xl border border-border shadow-xs mt-2">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                language === 'en' ? 'bg-primary-navy text-white shadow-xs' : 'text-gray-600 hover:text-primary-navy'
              }`}
            >
              English Policy
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                language === 'hi' ? 'bg-primary-navy text-white shadow-xs' : 'text-gray-600 hover:text-primary-navy'
              }`}
            >
              हिंदी नीति
            </button>
          </div>

          <div className="mt-4 text-xs font-semibold text-gray-500 flex items-center justify-center space-x-3">
            <span>Last Updated: <strong className="text-primary-navy">{lastUpdated}</strong></span>
            <span>•</span>
            <span>Gateway: <strong className="text-primary-green">Razorpay Verified Integration</strong></span>
          </div>
        </div>

        {/* Mobile TOC Accordion */}
        <div className="lg:hidden mb-8 bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          <button 
            onClick={() => setMobileTocOpen(!mobileTocOpen)}
            className="w-full p-4 flex justify-between items-center bg-brand-dark text-white font-bold text-sm"
          >
            <span className="flex items-center space-x-2">
              <FileText size={16} className="text-primary-saffron" />
              <span>On This Page (Table of Contents)</span>
            </span>
            {mobileTocOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {mobileTocOpen && (
            <div className="p-4 bg-gray-50 divide-y divide-gray-200 text-xs font-medium space-y-2">
              {sections.map(sec => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className="block w-full text-left py-2 text-gray-700 hover:text-primary-navy hover:font-bold transition-colors"
                >
                  {language === 'en' ? sec.label : sec.hindiLabel}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Desktop Sticky Table of Contents */}
          <aside className="hidden lg:block lg:col-span-4 space-y-6">
            <div className="sticky top-28 bg-white p-6 rounded-3xl border border-border shadow-md space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center space-x-2 border-b border-border pb-3">
                <RefreshCw className="text-primary-green" size={20} />
                <h3 className="font-extrabold text-sm text-primary-navy uppercase tracking-wider">
                  {language === 'en' ? 'Policy Navigation' : 'विषय सूची'}
                </h3>
              </div>
              <nav className="space-y-1 text-xs">
                {sections.map(sec => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className="w-full text-left px-3 py-2 rounded-xl text-gray-700 hover:bg-brand-cream hover:text-primary-navy font-medium transition-colors truncate block"
                  >
                    {language === 'en' ? sec.label : sec.hindiLabel}
                  </button>
                ))}
              </nav>

              <div className="pt-3 border-t border-border text-[11px] text-gray-500 space-y-2">
                <div className="font-bold text-gray-700">Official Support Desk:</div>
                <a href={`mailto:${email}`} className="text-primary-saffron font-mono font-bold hover:underline block truncate">
                  {email}
                </a>
              </div>
            </div>
          </aside>

          {/* Legal Document Body */}
          <main className="lg:col-span-8 bg-white p-6 md:p-12 rounded-3xl border border-border shadow-xl space-y-10 text-sm leading-relaxed text-gray-700">
            
            {/* Custom Admin Overrides if provided */}
            {settings.refundPolicyCustomText && (
              <div className="bg-amber-50 border-l-4 border-primary-saffron p-4 rounded-xl text-xs space-y-2">
                <div className="font-bold text-amber-900 uppercase tracking-wider">Official Foundation Note</div>
                <div className="text-amber-800 whitespace-pre-line">{settings.refundPolicyCustomText}</div>
              </div>
            )}

            {/* SECTION 1: Voluntary Contribution Nature */}
            <section id="nature" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-green/10 text-primary-green flex items-center justify-center text-xs font-bold">1</span>
                <span>{language === 'en' ? 'Voluntary Contribution Nature' : 'ऐच्छिक अंशदान की प्रकृति'}</span>
              </h2>
              <p>
                Donations made to <strong>{foundationName}</strong> are voluntary charitable contributions intended to support social welfare, education, healthcare, cow welfare, and community initiatives. Because donations are immediately allocated toward operational programs, refunds are generally handled according to the specific circumstances outlined in this policy.
              </p>
            </section>

            {/* SECTION 2: Erroneous & Duplicate Transactions */}
            <section id="erroneous" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-green/10 text-primary-green flex items-center justify-center text-xs font-bold">2</span>
                <span>{language === 'en' ? 'Erroneous & Duplicate Transactions' : 'त्रुटिपूर्ण या डुप्लिकेट लेनदेन'}</span>
              </h2>
              <p>
                The Foundation recognizes that technical glitches or accidental multiple clicks may occasionally cause duplicate payments or erroneous debits.
              </p>
              <div className="p-4 bg-brand-cream rounded-2xl border border-border text-xs space-y-2 font-medium text-gray-800">
                <div className="font-bold text-primary-navy uppercase tracking-wide">Clarification & Refund Request Guidelines:</div>
                <p>
                  To request clarification or a refund regarding an erroneous, accidental, or duplicate transaction, donors should contact our official support desk at{' '}
                  <a href={`mailto:${email}`} className="text-primary-saffron font-bold hover:underline">{email}</a> within <strong>7 working days</strong> of the transaction date.
                </p>
              </div>
            </section>

            {/* SECTION 3: Step-by-Step Request Process */}
            <section id="process" className="space-y-4 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-green/10 text-primary-green flex items-center justify-center text-xs font-bold">3</span>
                <span>{language === 'en' ? 'Step-by-Step Refund Request Process' : 'रिफंड आवेदन प्रक्रिया'}</span>
              </h2>
              <p>When sending your refund request via email to {email}, please provide the following details for verification:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 font-semibold text-gray-800">
                  1. Donor Full Name & Contact Phone Number
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 font-semibold text-gray-800">
                  2. Registered Email Address used during checkout
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 font-semibold text-gray-800">
                  3. Exact Donation Amount (₹) and Transaction Date
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 font-semibold text-gray-800">
                  4. Razorpay Payment Order ID / Payment Reference ID
                </div>
              </div>
            </section>

            {/* SECTION 4: Gateway Verification & Resolution */}
            <section id="verification" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-green/10 text-primary-green flex items-center justify-center text-xs font-bold">4</span>
                <span>{language === 'en' ? 'Gateway Verification & Resolution' : 'गेटवे सत्यापन और समाधान'}</span>
              </h2>
              <p>
                Upon receiving your written request, the Foundation will verify the transaction with our payment gateway partner (Razorpay).
              </p>
              <ul className="list-disc list-inside text-xs space-y-1.5 text-gray-600 pl-2">
                <li>If a duplicate debit or technical error is confirmed, approved refunds will be credited back to the original payment source (bank account, credit card, or UPI wallet).</li>
                <li>Processing times depend on banking and payment gateway settlement timelines (typically 5 to 10 business days after verification).</li>
              </ul>
            </section>

            {/* SECTION 5: Anti-Fraud Security Notice */}
            <section id="security" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-green/10 text-primary-green flex items-center justify-center text-xs font-bold">5</span>
                <span>{language === 'en' ? 'Critical Anti-Fraud Security Notice' : 'धोखाधड़ी रोधी सुरक्षा निर्देश'}</span>
              </h2>
              <div className="p-4 bg-red-50 text-red-950 rounded-2xl border border-red-200 text-xs space-y-2 font-medium">
                <div className="flex items-center space-x-2 text-red-700 font-extrabold text-sm uppercase tracking-wide">
                  <AlertTriangle size={18} />
                  <span>PROTECT YOUR FINANCIAL CREDENTIALS</span>
                </div>
                <p>
                  During the refund verification process, {foundationName} staff will <strong>NEVER</strong> ask you to provide:
                </p>
                <ul className="list-disc list-inside text-red-900 pl-2 space-y-1 font-bold">
                  <li>One-Time Passwords (OTPs)</li>
                  <li>Credit or Debit Card CVV / Passwords</li>
                  <li>UPI PINs or Net Banking Passwords</li>
                  <li>Full 16-digit Card Numbers</li>
                </ul>
                <p className="text-[11px] text-red-800">
                  Do not share banking security credentials with anyone claiming to represent the Foundation.
                </p>
              </div>
            </section>

            {/* SECTION 6: Official Refund Contact Desk */}
            <section id="contact" className="space-y-3">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-green/10 text-primary-green flex items-center justify-center text-xs font-bold">6</span>
                <span>{language === 'en' ? 'Official Refund Contact Desk' : 'आधिकारिक रिफंड सहायता डेस्क'}</span>
              </h2>
              <p>For any donation refund queries or transaction verification requests:</p>
              <div className="p-4 bg-brand-dark text-white rounded-2xl space-y-1 font-mono text-xs border border-brand-gold/30">
                <div className="font-bold text-brand-gold">{foundationName}</div>
                <div>Official Support Email: <a href={`mailto:${email}`} className="text-primary-saffron hover:underline">{email}</a></div>
                <div className="text-gray-400 text-[11px] pt-1">Response time: Within 24 to 48 business hours</div>
              </div>
            </section>

            {/* Footer Disclaimer Note */}
            <div className="mt-12 pt-6 border-t border-gray-200 text-center text-[11px] text-gray-500 italic max-w-xl mx-auto">
              These policies are provided for transparency and general information. The Foundation should have them reviewed by qualified legal counsel before final publication.
            </div>

          </main>

        </div>

      </div>
    </div>
  );
};

export default RefundPolicy;
