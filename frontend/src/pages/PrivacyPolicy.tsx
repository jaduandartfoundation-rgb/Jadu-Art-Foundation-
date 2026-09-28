import React, { useState } from 'react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import BilingualHeading from '../components/BilingualHeading';
import DynamicSEO from '../components/DynamicSEO';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  FileText, 
  Mail, 
  ExternalLink, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  UserCheck,
  AlertCircle
} from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const { settings } = useSiteSettings();
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  const email = settings.legalContactEmail || settings.officialEmail || 'jaduandartfoundation@gmail.com';
  const lastUpdated = settings.lastUpdatedDate || 'September 26, 2026';
  const foundationName = settings.foundationName || 'Jadu & Art Foundation';

  const sections = [
    { id: 'intro', label: '1. Introduction & Scope', hindiLabel: '1. परिचय एवं उद्देश्य' },
    { id: 'collect', label: '2. Information We Collect', hindiLabel: '2. हमारे द्वारा एकत्रित जानकारी' },
    { id: 'auto-collect', label: '3. Technical & Automated Info', hindiLabel: '3. स्वचालित तकनीकी जानकारी' },
    { id: 'use', label: '4. How We Use Information', hindiLabel: '4. जानकारी का उपयोग' },
    { id: 'consent', label: '5. Legal Basis & Consent', hindiLabel: '5. कानूनी आधार एवं सहमति' },
    { id: 'withdraw', label: '6. Withdrawal of Consent', hindiLabel: '6. सहमति वापस लेना' },
    { id: 'sharing', label: '7. Data Sharing & Service Providers', hindiLabel: '7. डेटा साझाकरण और सेवा प्रदाता' },
    { id: 'razorpay', label: '8. Razorpay Payment Gateway', hindiLabel: '8. रेजरपे (Razorpay) भुगतान प्रसंस्करण' },
    { id: 'retention', label: '9. Data Retention', hindiLabel: '9. डेटा प्रतिधारण (Retention)' },
    { id: 'security', label: '10. Data Security Controls', hindiLabel: '10. डेटा सुरक्षा उपाय' },
    { id: 'breaches', label: '11. Personal Data Breaches', hindiLabel: '11. डेटा उल्लंघन प्रक्रिया' },
    { id: 'rights', label: '12. User Rights under Indian Law', hindiLabel: '12. भारतीय कानून के तहत अधिकार' },
    { id: 'children', label: '13. Children\'s Personal Data', hindiLabel: '13. बच्चों के व्यक्तिगत डेटा की सुरक्षा' },
    { id: 'media', label: '14. Photographs, Stories & Media', hindiLabel: '14. तस्वीरें, कहानियां और मीडिया' },
    { id: 'cookies', label: '15. Cookies & Tracking', hindiLabel: '15. कुकीज़ और ट्रैकिंग' },
    { id: 'third-party', label: '16. External & Third-Party Links', hindiLabel: '16. तीसरे पक्ष के लिंक' },
    { id: 'grievance', label: '17. Privacy & Grievance Contact', hindiLabel: '17. गोपनीयता और शिकायत संपर्क' },
    { id: 'updates', label: '18. Policy Updates', hindiLabel: '18. नीति अपडेट' }
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
        title={`Privacy Policy | ${foundationName}`}
        description={`Read the official Privacy Policy of ${foundationName}. Learn how we collect, handle, protect, and process donor and visitor personal data in compliance with Indian data protection laws.`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <BilingualHeading 
            englishTitle="PRIVACY POLICY"
            hindiTitle="गोपनीयता नीति"
            subtitle={`Transparency, data protection, and visitor privacy governance at ${foundationName}.`}
          />

          {/* Language Switcher */}
          <div className="inline-flex items-center p-1 bg-white rounded-xl border border-border shadow-xs mt-2">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                language === 'en' ? 'bg-primary-navy text-white shadow-xs' : 'text-gray-600 hover:text-primary-navy'
              }`}
            >
              English Legal Policy
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                language === 'hi' ? 'bg-primary-navy text-white shadow-xs' : 'text-gray-600 hover:text-primary-navy'
              }`}
            >
              हिंदी गोपनीयता नीति
            </button>
          </div>

          <div className="mt-4 text-xs font-semibold text-gray-500 flex items-center justify-center space-x-3">
            <span>Last Updated: <strong className="text-primary-navy">{lastUpdated}</strong></span>
            <span>•</span>
            <span>Applicable Framework: <strong className="text-primary-green">DPDP Act 2023 / IT Act 2000 (India)</strong></span>
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
                <ShieldCheck className="text-primary-green" size={20} />
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
                <div className="font-bold text-gray-700">Privacy Officer Contact:</div>
                <a href={`mailto:${email}`} className="text-primary-saffron font-mono font-bold hover:underline block truncate">
                  {email}
                </a>
              </div>
            </div>
          </aside>

          {/* Legal Document Main Body */}
          <main className="lg:col-span-8 bg-white p-6 md:p-12 rounded-3xl border border-border shadow-xl space-y-10 text-sm leading-relaxed text-gray-700">
            
            {/* Custom Admin Overrides if provided */}
            {settings.privacyPolicyCustomText && (
              <div className="bg-amber-50 border-l-4 border-primary-saffron p-4 rounded-xl text-xs space-y-2">
                <div className="font-bold text-amber-900 uppercase tracking-wider">Official Organization Note</div>
                <div className="text-amber-800 whitespace-pre-line">{settings.privacyPolicyCustomText}</div>
              </div>
            )}

            {/* SECTION 1: Introduction */}
            <section id="intro" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-green/10 text-primary-green flex items-center justify-center text-xs font-bold">1</span>
                <span>{language === 'en' ? 'Introduction & Scope' : 'परिचय एवं उद्देश्य'}</span>
              </h2>
              <p>
                This Privacy Policy explains how <strong>{foundationName}</strong> collects, uses, stores, protects and handles personal information when you visit our website, contact us, volunteer, submit forms, or make a donation through our website.
              </p>
              <p>
                {foundationName} is committed to transparency, financial integrity, and safeguarding the personal data of our supporters, volunteers, donors, and website visitors in accordance with applicable Indian laws, including the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, the <strong>Digital Personal Data Protection Rules, 2025</strong>, and the <strong>Information Technology Act, 2000</strong>.
              </p>
              <p className="bg-brand-cream p-4 rounded-2xl border border-border font-medium text-xs text-gray-800">
                By using the website, you acknowledge that you have read and understood this Privacy Policy. Mere browsing of the website does not constitute unconditional consent to every form of data processing; specific consent is requested where required by law.
              </p>
            </section>

            {/* SECTION 2: Information We Collect */}
            <section id="collect" className="space-y-4 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-green/10 text-primary-green flex items-center justify-center text-xs font-bold">2</span>
                <span>{language === 'en' ? 'Information We Collect' : 'हमारे द्वारा एकत्रित जानकारी'}</span>
              </h2>
              <p>
                We only collect personal information that is relevant and necessary for the services and features offered on this website.
              </p>
              
              <div className="space-y-3 pl-2">
                <h3 className="font-bold text-gray-900 text-sm flex items-center space-x-2">
                  <CheckCircle2 size={16} className="text-primary-green" />
                  <span>A. Information Provided Directly by You</span>
                </h3>
                <ul className="list-disc list-inside text-xs space-y-1.5 pl-4 text-gray-600">
                  <li><strong>Contact Forms & Enquiries:</strong> Name, email address, phone number, subject, and message content.</li>
                  <li><strong>Volunteer Applications:</strong> Name, email address, phone number, city/location, area of interest, and background/skills.</li>
                  <li><strong>Newsletter & Communication Preferences:</strong> Email address provided for updates.</li>
                </ul>

                <h3 className="font-bold text-gray-900 text-sm flex items-center space-x-2 pt-2">
                  <CheckCircle2 size={16} className="text-primary-green" />
                  <span>B. Online Donation Information</span>
                </h3>
                <p className="text-xs">
                  When you make a donation through our website, {foundationName} receives information required to record and verify your donation, including:
                </p>
                <ul className="list-disc list-inside text-xs space-y-1.5 pl-4 text-gray-600">
                  <li>Donor Name</li>
                  <li>Email Address</li>
                  <li>Phone Number</li>
                  <li>Donation Amount and Selected Initiative</li>
                  <li>PAN (Permanent Account Number) if voluntarily provided for donation records</li>
                  <li>Transaction ID / Order Reference ID and Timestamp</li>
                </ul>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1 font-medium">
                  <strong>CRITICAL PAYMENT CREDENTIAL NOTICE:</strong>
                  <p>
                    Payment credentials such as complete credit/debit card numbers, CVV, UPI PINs, or net banking passwords are <strong>NEVER stored by {foundationName}</strong>. All online payments are securely processed through our authorized payment gateway partner, <strong>Razorpay</strong>.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 3: Technical Information */}
            <section id="auto-collect" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-green/10 text-primary-green flex items-center justify-center text-xs font-bold">3</span>
                <span>{language === 'en' ? 'Technical & Automated Information' : 'स्वचालित तकनीकी जानकारी'}</span>
              </h2>
              <p>
                When you visit our website, basic technical logs may be automatically generated by server and security infrastructure to maintain site operational integrity and prevent malicious cyber activity.
              </p>
              <ul className="list-disc list-inside text-xs space-y-1 text-gray-600 pl-2">
                <li>Internet Protocol (IP) address for server log diagnostics and firewall protection</li>
                <li>Browser type, operating system, and device category</li>
                <li>Pages visited and date/time of access</li>
              </ul>
              <p className="text-xs text-gray-500 italic">
                Note: We do not employ intrusive third-party cross-site trackers or ad pixel scripts without disclosure.
              </p>
            </section>

            {/* SECTION 4: How We Use Information */}
            <section id="use" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-green/10 text-primary-green flex items-center justify-center text-xs font-bold">4</span>
                <span>{language === 'en' ? 'How We Use Information' : 'जानकारी का उपयोग'}</span>
              </h2>
              <p>Personal data collected is strictly limited to specified, explicit, and legitimate purposes:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 font-semibold text-gray-800">
                  • Process donations and issue transaction confirmations
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 font-semibold text-gray-800">
                  • Maintain financial and donation records as required by law
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 font-semibold text-gray-800">
                  • Respond to public enquiries and volunteer applications
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 font-semibold text-gray-800">
                  • Ensure website security, audit trails, and prevent fraud
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 font-semibold text-gray-800">
                  • Fulfill statutory tax and legal obligations under Indian law
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 font-semibold text-gray-800">
                  • Communicate updates where users have consented
                </div>
              </div>
            </section>

            {/* SECTION 5: Legal Basis & Consent */}
            <section id="consent" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-green/10 text-primary-green flex items-center justify-center text-xs font-bold">5</span>
                <span>{language === 'en' ? 'Legal Basis & Consent' : 'कानूनी आधार एवं सहमति'}</span>
              </h2>
              <p>
                In compliance with the Digital Personal Data Protection Act, 2023, personal data is processed only for specified purposes and on an applicable lawful basis, including affirmative consent where required and other legal grounds under Indian law.
              </p>
              <ul className="list-disc list-inside text-xs space-y-1.5 text-gray-600 pl-2">
                <li>Consent requested on forms is clear, specific, informed, unambiguous, and requires an affirmative action.</li>
                <li>We do <strong>NOT</strong> use pre-checked marketing boxes or bundle unrelated consent into a single check box.</li>
              </ul>
            </section>

            {/* SECTION 6: Withdrawal of Consent */}
            <section id="withdraw" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-green/10 text-primary-green flex items-center justify-center text-xs font-bold">6</span>
                <span>{language === 'en' ? 'Withdrawal of Consent' : 'सहमति वापस लेना'}</span>
              </h2>
              <p>
                Where processing is based on consent, users may withdraw consent at any time by contacting our Privacy Officer at{' '}
                <a href={`mailto:${email}`} className="text-primary-saffron font-bold hover:underline">{email}</a>.
              </p>
              <p className="text-xs text-gray-500">
                Please note that withdrawal of consent does not affect processing carried out prior to withdrawal, nor does it automatically delete records where retention is mandated by law (such as statutory financial audit records).
              </p>
            </section>

            {/* SECTION 7: Data Sharing */}
            <section id="sharing" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-green/10 text-primary-green flex items-center justify-center text-xs font-bold">7</span>
                <span>{language === 'en' ? 'Data Sharing & Service Providers' : 'डेटा साझाकरण और सेवा प्रदाता'}</span>
              </h2>
              <p>
                Personal information is shared only with trusted infrastructure providers necessary for website operation, or where required by law:
              </p>
              <ul className="list-disc list-inside text-xs space-y-1 text-gray-600 pl-2">
                <li><strong>Razorpay:</strong> Payment processing infrastructure for online donations.</li>
                <li><strong>Cloudinary:</strong> Media asset hosting and image optimization infrastructure.</li>
                <li><strong>Database & Cloud Hosting:</strong> Secure cloud server database hosting.</li>
                <li><strong>Law Enforcement / Government Authorities:</strong> Shared only when mandated under valid legal process or court order.</li>
              </ul>
            </section>

            {/* SECTION 8: Razorpay Gateway */}
            <section id="razorpay" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-green/10 text-primary-green flex items-center justify-center text-xs font-bold">8</span>
                <span>{language === 'en' ? 'Payment Processing (Razorpay)' : 'रेजरपे (Razorpay) भुगतान प्रसंस्करण'}</span>
              </h2>
              <p>
                Online donations on this website are processed through <strong>Razorpay Software Private Limited</strong>, an authorized payment service provider.
              </p>
              <p className="text-xs">
                Payment transactions are subject to Razorpay’s own terms, privacy policies, and security practices. You may review Razorpay’s official privacy policy here:
              </p>
              <a 
                href="https://razorpay.com/privacy/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-primary-saffron font-bold hover:underline text-xs bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200"
              >
                <span>Read Official Razorpay Privacy Policy</span>
                <ExternalLink size={14} />
              </a>
            </section>

            {/* SECTION 9: Data Retention */}
            <section id="retention" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-green/10 text-primary-green flex items-center justify-center text-xs font-bold">9</span>
                <span>{language === 'en' ? 'Data Retention' : 'डेटा प्रतिधारण (Retention)'}</span>
              </h2>
              <p>
                Personal information is retained only for as long as reasonably necessary to fulfill the purpose for which it was collected, meet statutory accounting requirements, resolve disputes, enforce agreements, and satisfy security audit logs.
              </p>
            </section>

            {/* SECTION 10: Data Security */}
            <section id="security" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-green/10 text-primary-green flex items-center justify-center text-xs font-bold">10</span>
                <span>{language === 'en' ? 'Data Security Controls' : 'डेटा सुरक्षा उपाय'}</span>
              </h2>
              <p>
                We implement reasonable administrative, technical, and physical security measures to protect personal data against unauthorized access, loss, alteration, or disclosure.
              </p>
              <ul className="list-disc list-inside text-xs space-y-1 text-gray-600 pl-2">
                <li>HTTPS / SSL encrypted transport layers for web forms</li>
                <li>Role-based restricted access controls for backend admin database</li>
                <li>Hashed authentication credentials and JWT token safeguards</li>
              </ul>
              <p className="text-xs text-gray-500 italic">
                Note: While we apply strict security controls, no internet transmission or electronic storage system can be guaranteed to be 100% immune from sophisticated cyber risks.
              </p>
            </section>

            {/* SECTION 11: Data Breaches */}
            <section id="breaches" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-green/10 text-primary-green flex items-center justify-center text-xs font-bold">11</span>
                <span>{language === 'en' ? 'Personal Data Breaches' : 'डेटा उल्लंघन प्रक्रिया'}</span>
              </h2>
              <p>
                In the event of a verified personal data breach, {foundationName} will take prompt remedial measures and address notifications in accordance with applicable requirements under the DPDP Act 2023 and relevant regulations.
              </p>
            </section>

            {/* SECTION 12: User Rights */}
            <section id="rights" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-green/10 text-primary-green flex items-center justify-center text-xs font-bold">12</span>
                <span>{language === 'en' ? 'User Rights under Indian Law' : 'भारतीय कानून के तहत अधिकार'}</span>
              </h2>
              <p>As a Data Principal under Indian data protection law, you may have rights to:</p>
              <ul className="list-disc list-inside text-xs space-y-1.5 text-gray-600 pl-2">
                <li>Request information regarding the summary of personal data being processed</li>
                <li>Request correction, completion, or updating of inaccurate personal data</li>
                <li>Request erasure of personal data where retention is no longer required by law</li>
                <li>Seek grievance redressal regarding data handling</li>
                <li>Nominate an individual to exercise rights in case of death or incapacity</li>
              </ul>
            </section>

            {/* SECTION 13: Children's Data */}
            <section id="children" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-green/10 text-primary-green flex items-center justify-center text-xs font-bold">13</span>
                <span>{language === 'en' ? 'Children\'s Personal Data Safeguards' : 'बच्चों के व्यक्तिगत डेटा की सुरक्षा'}</span>
              </h2>
              <p>
                {foundationName} works extensively in education and social support for children. We handle children’s personal information with utmost sensitivity and in strict compliance with statutory safeguards.
              </p>
              <p className="text-xs text-gray-600">
                Where children's data or media is involved in foundation programs, appropriate parental/guardian consent and verification mechanisms are applied as required by law. We do not collect unnecessary information about children nor operate child account systems.
              </p>
            </section>

            {/* SECTION 14: Media */}
            <section id="media" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-green/10 text-primary-green flex items-center justify-center text-xs font-bold">14</span>
                <span>{language === 'en' ? 'Photographs, Stories & Media' : 'तस्वीरें, कहानियां और मीडिया'}</span>
              </h2>
              <p>
                The Foundation publishes photographs, impact stories, and activity media documenting community work. Identifiable individuals featured in project media are photographed with appropriate permissions and community consent where required.
              </p>
            </section>

            {/* SECTION 15: Cookies */}
            <section id="cookies" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-green/10 text-primary-green flex items-center justify-center text-xs font-bold">15</span>
                <span>{language === 'en' ? 'Cookies & Tracking' : 'कुकीज़ और ट्रैकिंग'}</span>
              </h2>
              <p>
                The website uses essential session technologies necessary for website security and navigation. Any additional analytics or non-essential tracking technologies implemented in the future will be disclosed and managed in accordance with applicable requirements.
              </p>
            </section>

            {/* SECTION 16: Third-Party Links */}
            <section id="third-party" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-green/10 text-primary-green flex items-center justify-center text-xs font-bold">16</span>
                <span>{language === 'en' ? 'External & Third-Party Links' : 'तीसरे पक्ष के लिंक'}</span>
              </h2>
              <p>
                Our website may contain links to third-party payment gateways, social media platforms, or external partner websites. {foundationName} is not responsible for the privacy practices or content of third-party sites. Users are encouraged to review third-party policies independently.
              </p>
            </section>

            {/* SECTION 17: Grievance Contact */}
            <section id="grievance" className="space-y-3 border-b border-gray-100 pb-8">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-green/10 text-primary-green flex items-center justify-center text-xs font-bold">17</span>
                <span>{language === 'en' ? 'Privacy & Grievance Contact' : 'गोपनीयता और शिकायत संपर्क'}</span>
              </h2>
              <p>
                For questions, data access, correction requests, consent withdrawal, or privacy grievances, please contact our designated Privacy Officer:
              </p>
              <div className="p-4 bg-brand-dark text-white rounded-2xl space-y-2 border border-brand-gold/30">
                <div className="font-bold text-brand-gold text-xs uppercase tracking-wider">Privacy & Data Redressal Desk</div>
                <div className="font-bold">{foundationName}</div>
                <div className="flex items-center space-x-2 text-xs font-mono">
                  <Mail size={14} className="text-primary-saffron" />
                  <a href={`mailto:${email}`} className="hover:underline">{email}</a>
                </div>
              </div>
            </section>

            {/* SECTION 18: Updates */}
            <section id="updates" className="space-y-3">
              <h2 className="text-xl font-extrabold text-primary-navy flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-primary-green/10 text-primary-green flex items-center justify-center text-xs font-bold">18</span>
                <span>{language === 'en' ? 'Policy Updates' : 'नीति अपडेट'}</span>
              </h2>
              <p>
                {foundationName} may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or services. Revised policies will be published on this page with an updated date.
              </p>
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

export default PrivacyPolicy;
