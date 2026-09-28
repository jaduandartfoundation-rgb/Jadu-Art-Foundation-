import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Lock, Mail, Globe } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

const Footer = () => {
  const { settings } = useSiteSettings();

  const logo = settings.logo || '/logo.svg';
  const name = settings.foundationName || 'Jadu & Art Foundation';
  const email = settings.officialEmail || 'jaduandartfoundation@gmail.com';
  const tagline = settings.hindiTagline || settings.tagline || 'Seva • Sanskar • Samriddh Bharat';

  return (
    <footer className="bg-brand-dark text-white pt-16 pb-12 border-t-4 border-brand-orange">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          
          {/* Col 1 & 2: About Foundation */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white/95 p-3.5 rounded-2xl inline-block shadow-lg border border-brand-gold/30 max-w-xs">
              <img 
                src={logo} 
                alt={`${name} Official Logo`} 
                className="h-28 w-auto object-contain mx-auto" 
              />
            </div>
            <p className="text-gray-200 text-sm leading-relaxed max-w-md font-medium">
              {settings.metaDescription || `${name} works towards the welfare of people, communities and animals through education, healthcare, cow welfare and humanitarian support.`}
            </p>

            <div className="flex flex-col space-y-2 pt-1 text-sm text-gray-200">
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-brand-orange" />
                <a href={`mailto:${email}`} className="hover:text-brand-orange font-mono transition-colors">
                  {email}
                </a>
              </div>
            </div>

            <div className="inline-block bg-brand-green/30 text-brand-gold text-xs font-bold px-3.5 py-1.5 rounded-full border border-brand-gold/40">
              {tagline}
            </div>

            {/* Social Links if configured */}
            {(settings.facebookUrl || settings.instagramUrl || settings.youtubeUrl || settings.linkedinUrl || settings.whatsappNumber) && (
              <div className="pt-2 flex items-center space-x-3 text-sm text-gray-300">
                {settings.facebookUrl && (
                  <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors">
                    Facebook
                  </a>
                )}
                {settings.instagramUrl && (
                  <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors">
                    Instagram
                  </a>
                )}
                {settings.youtubeUrl && (
                  <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors">
                    YouTube
                  </a>
                )}
                {settings.linkedinUrl && (
                  <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors">
                    LinkedIn
                  </a>
                )}
                {settings.whatsappNumber && (
                  <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors font-bold text-emerald-400">
                    WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="text-sm font-bold mb-4 text-white uppercase tracking-wider border-b border-brand-gold/30 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-200">
              <li><Link to="/" className="hover:text-brand-orange transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-brand-orange transition-colors">About Us</Link></li>
              <li><Link to="/our-work" className="hover:text-brand-orange transition-colors">Our Work</Link></li>
              <li><Link to="/impact" className="hover:text-brand-orange transition-colors">Impact</Link></li>
              <li><Link to="/gallery" className="hover:text-brand-orange transition-colors">Gallery</Link></li>
              <li><Link to="/volunteer" className="hover:text-brand-orange transition-colors">Volunteer</Link></li>
              <li><Link to="/donate" className="hover:text-brand-orange transition-colors">Donate</Link></li>
              <li><Link to="/contact" className="hover:text-brand-orange transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Col 4: Work Areas */}
          <div>
            <h4 className="text-sm font-bold mb-4 text-white uppercase tracking-wider border-b border-brand-gold/30 pb-2">
              Our Work Areas
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-200">
              <li><Link to="/our-work/education" className="hover:text-brand-orange transition-colors">Education (शिक्षा)</Link></li>
              <li><Link to="/our-work/healthcare" className="hover:text-brand-orange transition-colors">Healthcare (स्वास्थ्य सेवा)</Link></li>
              <li><Link to="/our-work/cow-welfare" className="hover:text-brand-orange transition-colors">Cow Welfare (गौ सेवा)</Link></li>
              <li><Link to="/our-work/disaster-relief" className="hover:text-brand-orange transition-colors">Disaster Relief (आपदा राहत)</Link></li>
            </ul>
          </div>

          {/* Col 5: Governance & Action */}
          <div>
            <h4 className="text-sm font-bold mb-4 text-white uppercase tracking-wider border-b border-brand-gold/30 pb-2">
              Legal & Transparency
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-200 mb-6">
              <li>
                <Link to="/transparency" className="hover:text-brand-orange transition-colors flex items-center space-x-1.5">
                  <ShieldCheck size={15} className="text-brand-green" />
                  <span>Governance & Reports</span>
                </Link>
              </li>
              <li><Link to="/privacy-policy" className="hover:text-brand-orange transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="hover:text-brand-orange transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy" className="hover:text-brand-orange transition-colors">Donation Refund Policy</Link></li>
              <li><Link to="/contact" className="hover:text-brand-orange transition-colors">Contact & Grievances</Link></li>
            </ul>

            <Link 
              to="/donate"
              className="inline-flex items-center space-x-2 bg-brand-orange text-white px-5 py-3 rounded-xl font-bold text-xs hover:bg-[#E05D00] transition-colors shadow-md w-full justify-center"
            >
              <Heart size={14} className="fill-white" />
              <span>DONATE NOW</span>
            </Link>
          </div>

        </div>

        {/* Legal Disclaimer Note */}
        <div className="text-[11px] text-gray-400 text-center border-t border-white/10 pt-4 pb-2 italic max-w-3xl mx-auto">
          These policies are provided for transparency and general information. The Foundation should have them reviewed by qualified legal counsel before final publication.
        </div>

        {/* Bottom bar */}
        <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-300 gap-4">
          <p>&copy; {new Date().getFullYear()} {name}. All Rights Reserved.</p>
          <div className="flex items-center space-x-6">
            <span>Spiritual Values • Social Impact • A Brighter India</span>
            <Link to="/admin/login" className="hover:text-white flex items-center space-x-1 text-gray-400">
              <Lock size={12} />
              <span>Admin Panel</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
