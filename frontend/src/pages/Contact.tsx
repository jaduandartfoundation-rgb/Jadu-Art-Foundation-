import React, { useState, useEffect } from 'react';
import BilingualHeading from '../components/BilingualHeading';
import { enquiryService, contentService } from '../services/api';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

const Contact: React.FC = () => {
  const { settings } = useSiteSettings();
  const logo = settings.darkLogo || settings.logo || '/logo-horizontal.svg';

  const [contactInfo, setContactInfo] = useState<any>({
    email: 'jaduandartfoundation@gmail.com',
    phone: '',
    address: 'Jadu & Art Foundation, India'
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await enquiryService.submitEnquiry(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-cream min-h-screen py-16 md:py-20 font-sans text-text-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title Header */}
        <BilingualHeading 
          englishTitle="GET IN TOUCH"
          hindiTitle="हमसे संपर्क करें"
          subtitle="Reach out with your enquiries, feedback, partnerships or volunteer questions."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-10">
          
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-brand-dark text-white p-8 rounded-3xl space-y-6 shadow-xl border border-brand-gold/30">
              <div className="bg-white/95 p-3 rounded-2xl inline-block border border-brand-gold/40">
                <img src={logo} alt={`${settings.foundationName || 'Official'} Logo`} className="h-12 w-auto object-contain" />
              </div>

              <h3 className="text-2xl font-black text-white">Official Foundation Contact</h3>
              <p className="text-gray-200 text-sm leading-relaxed">
                {settings.foundationName || 'Jadu & Art Foundation'} welcomes community involvement, donor enquiries, and ground initiative partnerships.
              </p>

              <div className="space-y-4 text-sm pt-2">
                <div className="flex items-start space-x-3 text-gray-200">
                  <Mail className="text-brand-orange shrink-0 mt-1" size={20} />
                  <div>
                    <div className="font-bold text-white text-xs uppercase tracking-wider">Official Email</div>
                    <a href="mailto:jaduandartfoundation@gmail.com" className="font-mono text-brand-gold hover:underline">
                      {contactInfo.email || 'jaduandartfoundation@gmail.com'}
                    </a>
                  </div>
                </div>

                {contactInfo.phone && (
                  <div className="flex items-start space-x-3 text-gray-200">
                    <Phone className="text-brand-orange shrink-0 mt-1" size={20} />
                    <div>
                      <div className="font-bold text-white text-xs uppercase tracking-wider">Verified Support</div>
                      <div>{contactInfo.phone}</div>
                    </div>
                  </div>
                )}

                {contactInfo.address && (
                  <div className="flex items-start space-x-3 text-gray-200">
                    <MapPin className="text-brand-orange shrink-0 mt-1" size={20} />
                    <div>
                      <div className="font-bold text-white text-xs uppercase tracking-wider">Location</div>
                      <div>{contactInfo.address}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-border shadow-md">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-brand-green/20 text-brand-green rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={36} />
                  </div>
                  <h3 className="text-2xl font-black text-brand-dark">Enquiry Sent Successfully!</h3>
                  <p className="text-text-secondary text-sm max-w-sm mx-auto">
                    Thank you for reaching out to Jadu & Art Foundation. Your enquiry has been received.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-4 bg-brand-dark text-white px-6 py-2.5 rounded-xl font-bold text-xs"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your Name"
                        className="w-full p-3.5 bg-brand-cream border border-border rounded-xl text-sm focus:ring-2 focus:ring-brand-green"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Your Email"
                        className="w-full p-3.5 bg-brand-cream border border-border rounded-xl text-sm focus:ring-2 focus:ring-brand-green"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Phone Number"
                        className="w-full p-3.5 bg-brand-cream border border-border rounded-xl text-sm focus:ring-2 focus:ring-brand-green"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">Subject *</label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Subject"
                        className="w-full p-3.5 bg-brand-cream border border-border rounded-xl text-sm focus:ring-2 focus:ring-brand-green"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your message here..."
                      className="w-full p-3.5 bg-brand-cream border border-border rounded-xl text-sm focus:ring-2 focus:ring-brand-green"
                    ></textarea>
                  </div>

                  <p className="text-xs text-gray-500 font-medium pt-1">
                    By submitting this form, you acknowledge that your information will be processed as described in our{' '}
                    <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand-orange font-bold underline hover:text-[#E05D00]">
                      Privacy Policy
                    </a>.
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-brand-orange text-white py-4 rounded-xl font-bold text-base shadow-md hover:bg-[#E05D00] transition-colors flex items-center justify-center space-x-2 ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    <Send size={18} />
                    <span>{loading ? 'Sending Message...' : 'SEND ENQUIRY'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
