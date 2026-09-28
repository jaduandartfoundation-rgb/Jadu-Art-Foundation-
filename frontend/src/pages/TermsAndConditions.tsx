import React, { useState } from 'react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import BilingualHeading from '../components/BilingualHeading';
import DynamicSEO from '../components/DynamicSEO';
import { 
  FileText, 
  ShieldCheck, 
  Mail, 
  ExternalLink, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp,
  Lock,
  Scale
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsAndConditions: React.FC = () => {
  const { settings } = useSiteSettings();
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  const email = settings.legalContactEmail || settings.officialEmail || 'jaduandartfoundation@gmail.com';
  const lastUpdated = settings.lastUpdatedDate || 'September 26, 2026';
  const foundationName = settings.foundationName || 'Jadu & Art Foundation';

  const sections = [
    { id: 'intro', label: '1. Introduction & Acceptance', hindiLabel: '1. परिचय एवं स्वीकृति' },
    { id: 'use', label: '2. Lawful & Permissible Use', hindiLabel: '2. वेबसाइट का उपयोग' },
    { id: 'info', label: '3. Foundation Information', hindiLabel: '3. संस्था संबंधी जानकारी' },
    { id: 'donations', label: '4. Donation Terms', hindiLabel: '4. दान की शर्तें' },
    { id: 'tax', label: '5. Tax Benefit Disclaimer', hindiLabel: '5. कर लाभ संबंधी विवरण' },
    { id: 'failed', label: '6. Failed or Duplicate Payments', hindiLabel: '6. असफल या डुप्लिकेट भुगतान' },
    { id: 'razorpay', label: '7. Razorpay Payment Gateway', hindiLabel: '7. रेजरपे भुगतान गेटवे' },
    { id: 'ip', label: '8. Intellectual Property Rights', hindiLabel: '8. बौद्धिक संपदा अधिकार' },
    { id: 'volunteers', label: '9. Volunteer Applications', hindiLabel: '9. स्वयंसेवक आवेदन' },
    { id: 'accuracy', label: '10. Accuracy & Availability', hindiLabel: '10. जानकारी की सटीकता' },
    { id: 'third-party', label: '11. Third-Party Services', hindiLabel: '11. तीसरे पक्ष की सेवाएं' },
    { id: 'liability', label: '12. Limitation of Liability', hindiLabel: '12. दायित्व की सीमा' },
    { id: 'law', label: '13. Governing Law', hindiLabel: '13. लागू कानून एवं क्षेत्राधिकार' },
    { id: 'changes', label: '14. Changes to Terms', hindiLabel: '14. शर्तों में परिवर्तन' },
    { id: 'contact', label: '15. Contact Details', hindiLabel: '15. संपर्क विवरण' }
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
        title={`Terms & Conditions | ${foundationName}`}
        description={`Read the official Terms and Conditions governing the use of ${foundationName} website, online donation checkout, volunteer submissions, and platform guidelines.`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <BilingualHeading 
            englishTitle="TERMS & CONDITIONS"
            hindiTitle="नियम एवं शर्तें"
            subtitle={`Official terms governing website access, online donations, and interaction with ${foundationName}.`}
          />

          {/* Language Switcher */}
          <div className="inline-flex items-center p-1 bg-white rounded-xl border border-border shadow-xs mt-2">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                language === 'en' ? 'bg-primary-navy text-white shadow-xs' : 'text-gray-600 hover:text-primary-navy'
              }`}
            >
              English Terms
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                language === 'hi' ? 'bg-primary-navy text-white shadow-xs' : 'text-gray-600 hover:text-primary-navy'
              }`}
            >
              हिंदी नियम एवं शर्तें
            </button>
          </div>

          <div className="mt-4 text-xs font-semibold text-gray-500 flex items-center justify-center space-x-3">
            <span>Last Updated: <strong className="text-primary-navy">{lastUpdated}</strong></span>
            <span>•</span>
            <span>Governing Law: <strong className="text-primary-green">Laws Applicable in India</strong></span>
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
                <Scale className="text-primary-saffron" size={20} />
                <h3 className="font-extrabold text-sm text-primary-navy uppercase tracking-wider">
                  {language === 'en' ? 'Terms Navigation' : 'विषय सूची'}
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
                <div className="font-bold text-gray-700">Official Contact Email:</div>
                <a href={`mailto:${email}`} className="text-primary-saffron font-mono font-bold hover:underline block truncate">
                  {email}
                </a>
              </div>
            </div>
          </aside>

          {/* Legal Document Body */}
          <main className="lg:col-span-8 bg-white p-6 md:p-12 rounded-3xl border border-border shadow-xl space-y-10 text-sm leading-relaxed text-gray-700">
            
            {/* Custom Admin Overrides if provided */}
            {settings.termsCustomText && (
              <div className="bg-amber-50 border-l-4 border-primary-saffron p-4 rounded-xl text-xs space-y-2">
                <div className="font-bold text-amber-900 uppercase tracking-wider">Official Foundation Note</div>
                <div className="text-amber-800 whitespace-pre-line">{settings.termsCustomText}</div>
              </div>
            )}

            {/* SECTION 1: Introduction */}
            <section id="intro" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-saffron/10 text-primary-saffron flex items-center justify-center text-xs font-bold">1</span>
                <span>{language === 'en' ? 'Introduction & Acceptance' : 'परिचय एवं स्वीकृति'}</span>
              </h2>
              <p>
                These Terms & Conditions ("Terms") govern your use of the website operated by <strong>{foundationName}</strong>. By accessing, browsing, submitting forms, or making a donation through this website, you acknowledge that you have read, understood, and agreed to be bound by these Terms.
              </p>
              <p className="text-xs text-gray-600">
                If you do not agree with any part of these Terms, you should discontinue use of the website.
              </p>
            </section>

            {/* SECTION 2: Website Use */}
            <section id="use" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-saffron/10 text-primary-saffron flex items-center justify-center text-xs font-bold">2</span>
                <span>{language === 'en' ? 'Lawful & Permissible Use' : 'वेबसाइट का उपयोग'}</span>
              </h2>
              <p>Users agree to access and use the website responsibly and for lawful purposes only. You must NOT:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  • Use the website for any unlawful or fraudulent purpose
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  • Attempt unauthorized access to admin systems or databases
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  • Upload malicious code, viruses, or harmful scripts
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  • Abuse interactive forms or submit false contact information
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  • Attempt unauthorized or fraudulent payment transactions
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  • Scrape, duplicate, or misuse protected website content
                </div>
              </div>
            </section>

            {/* SECTION 3: Foundation Info */}
            <section id="info" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-saffron/10 text-primary-saffron flex items-center justify-center text-xs font-bold">3</span>
                <span>{language === 'en' ? 'Foundation Information' : 'संस्था संबंधी जानकारी'}</span>
              </h2>
              <p>
                This website provides public information regarding {foundationName}'s social welfare initiatives, education, healthcare, cow welfare programs, donation campaigns, volunteer opportunities, and community activities.
              </p>
              <p className="text-xs text-gray-600">
                Information is presented honestly and may be updated over time to reflect on-ground developments. The Foundation does not guarantee that every listed campaign or program will remain active indefinitely.
              </p>
            </section>

            {/* SECTION 4: Donation Terms */}
            <section id="donations" className="space-y-4 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-saffron/10 text-primary-saffron flex items-center justify-center text-xs font-bold">4</span>
                <span>{language === 'en' ? 'Donation Terms' : 'दान की शर्तें'}</span>
              </h2>
              <ul className="list-disc list-inside text-xs space-y-2 text-gray-700 pl-2">
                <li>All contributions made through the website are <strong>voluntary donations</strong> to support the Foundation’s charitable activities.</li>
                <li>Donors are requested to carefully verify the selected initiative and donation amount before completing checkout.</li>
                <li>Payment confirmation is dependent on successful processing by authorized payment gateways. Payment status reflection may take time depending on banking channels.</li>
                <li>Donor contact information is handled in accordance with our <Link to="/privacy-policy" className="text-primary-saffron font-bold hover:underline">Privacy Policy</Link>.</li>
                <li>The Foundation maintains financial and donation records as mandated by applicable Indian financial and tax laws.</li>
              </ul>
            </section>

            {/* SECTION 5: Tax Benefit Disclaimer */}
            <section id="tax" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-saffron/10 text-primary-saffron flex items-center justify-center text-xs font-bold">5</span>
                <span>{language === 'en' ? 'Tax Benefit Disclaimer' : 'कर लाभ संबंधी विवरण'}</span>
              </h2>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1 font-medium">
                <strong>TAX BENEFIT NOTICE:</strong>
                <p>
                  Tax benefits, receipts or deductions, if applicable, are subject to the Foundation's verified legal/tax status and applicable Indian laws. Please verify the Foundation's current eligibility before relying on any tax benefit claims.
                </p>
              </div>
            </section>

            {/* SECTION 6: Failed / Duplicate Payments */}
            <section id="failed" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-saffron/10 text-primary-saffron flex items-center justify-center text-xs font-bold">6</span>
                <span>{language === 'en' ? 'Failed or Duplicate Payments' : 'असफल या डुप्लिकेट भुगतान'}</span>
              </h2>
              <p>
                If money is debited from your account but the donation status does not reflect as successful, please contact the Foundation at{' '}
                <a href={`mailto:${email}`} className="text-primary-saffron font-bold hover:underline">{email}</a> with:
              </p>
              <ul className="list-disc list-inside text-xs space-y-1 text-gray-600 pl-2">
                <li>Payment Order ID / Transaction Reference ID</li>
                <li>Transaction Date and Time</li>
                <li>Debited Amount</li>
                <li>Registered Email Address or Phone Number</li>
              </ul>
              <div className="p-3 bg-red-50 text-red-900 rounded-xl text-xs font-bold flex items-center space-x-2 border border-red-200">
                <AlertTriangle size={16} className="text-red-600 shrink-0" />
                <span>NEVER share OTPs, card CVV, UPI PINs, or banking passwords with anyone. The Foundation will NEVER ask for these details.</span>
              </div>
              <p className="text-xs pt-1">
                For detailed refund procedure details, please review our dedicated <Link to="/refund-policy" className="text-primary-saffron font-bold hover:underline">Donation Refund & Cancellation Policy</Link>.
              </p>
            </section>

            {/* SECTION 7: Razorpay Payment Gateway */}
            <section id="razorpay" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-saffron/10 text-primary-saffron flex items-center justify-center text-xs font-bold">7</span>
                <span>{language === 'en' ? 'Razorpay Payment Gateway Disclaimer' : 'रेजरपे भुगतान गेटवे'}</span>
              </h2>
              <p>
                Online donations are processed through payment gateways integrated with the website (including Razorpay). Payment processing is subject to the payment provider's terms of service, privacy policy, and technical network availability.
              </p>
            </section>

            {/* SECTION 8: Intellectual Property */}
            <section id="ip" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-saffron/10 text-primary-saffron flex items-center justify-center text-xs font-bold">8</span>
                <span>{language === 'en' ? 'Intellectual Property Rights' : 'बौद्धिक संपदा अधिकार'}</span>
              </h2>
              <p>
                All content on this website—including the Foundation logo, brand identity, layout designs, original photographs, graphics, text, and videos—is protected by applicable intellectual property laws. Users may not reproduce, modify, or commercially exploit website assets without express written authorization.
              </p>
            </section>

            {/* SECTION 9: Volunteer Applications */}
            <section id="volunteers" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-saffron/10 text-primary-saffron flex items-center justify-center text-xs font-bold">9</span>
                <span>{language === 'en' ? 'Volunteer Applications' : 'स्वयंसेवक आवेदन'}</span>
              </h2>
              <p>
                Submitting a volunteer application does not guarantee automatic acceptance or engagement. Submitted information is evaluated by our team to align volunteer skillsets with field operations.
              </p>
            </section>

            {/* SECTION 10: Accuracy & Availability */}
            <section id="accuracy" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-saffron/10 text-primary-saffron flex items-center justify-center text-xs font-bold">10</span>
                <span>{language === 'en' ? 'Accuracy & Service Availability' : 'जानकारी की सटीकता'}</span>
              </h2>
              <p>
                While {foundationName} strives to keep information accurate and up to date, the website is provided on an "as is" and "as available" basis. We do not warrant uninterrupted access, complete error-free operation, or immediate availability during maintenance windows.
              </p>
            </section>

            {/* SECTION 11: Third-Party Services */}
            <section id="third-party" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-saffron/10 text-primary-saffron flex items-center justify-center text-xs font-bold">11</span>
                <span>{language === 'en' ? 'Third-Party Services' : 'तीसरे पक्ष की सेवाएं'}</span>
              </h2>
              <p>
                Integrated services (such as Razorpay payment processing and Cloudinary media distribution) operate under their respective service agreements and terms.
              </p>
            </section>

            {/* SECTION 12: Limitation of Liability */}
            <section id="liability" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-saffron/10 text-primary-saffron flex items-center justify-center text-xs font-bold">12</span>
                <span>{language === 'en' ? 'Limitation of Liability' : 'दायित्व की सीमा'}</span>
              </h2>
              <p>
                To the maximum extent permitted under applicable law, {foundationName} and its trustees, officers, and volunteers shall not be liable for any indirect, incidental, or consequential losses resulting from temporary website downtime, internet network failures, or unauthorized third-party interference despite reasonable security measures.
              </p>
            </section>

            {/* SECTION 13: Governing Law */}
            <section id="law" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-saffron/10 text-primary-saffron flex items-center justify-center text-xs font-bold">13</span>
                <span>{language === 'en' ? 'Governing Law' : 'लागू कानून एवं क्षेत्राधिकार'}</span>
              </h2>
              <p className="bg-brand-cream p-4 rounded-2xl border border-border font-bold text-xs text-primary-navy">
                These Terms shall be governed by and interpreted in accordance with the laws applicable in India.
              </p>
            </section>

            {/* SECTION 14: Changes to Terms */}
            <section id="changes" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-saffron/10 text-primary-saffron flex items-center justify-center text-xs font-bold">14</span>
                <span>{language === 'en' ? 'Changes to Terms' : 'शर्तों में परिवर्तन'}</span>
              </h2>
              <p>
                The Foundation reserves the right to modify these Terms from time to time. Continued use of the website following published updates constitutes acceptance of revised terms.
              </p>
            </section>

            {/* SECTION 15: Contact Details */}
            <section id="contact" className="space-y-3">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-saffron/10 text-primary-saffron flex items-center justify-center text-xs font-bold">15</span>
                <span>{language === 'en' ? 'Contact Details' : 'संपर्क विवरण'}</span>
              </h2>
              <p>For questions or formal correspondence regarding these Terms & Conditions:</p>
              <div className="p-4 bg-brand-dark text-white rounded-2xl space-y-1 font-mono text-xs border border-brand-gold/30">
                <div className="font-bold text-brand-gold">{foundationName}</div>
                <div>Official Email: <a href={`mailto:${email}`} className="text-primary-saffron hover:underline">{email}</a></div>
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

export default TermsAndConditions;
