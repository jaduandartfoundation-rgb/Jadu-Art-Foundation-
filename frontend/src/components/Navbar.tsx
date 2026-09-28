import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, ShieldCheck, Mail } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSiteSettings();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Work', path: '/our-work' },
    { name: 'About Us', path: '/about' },
    { name: 'Impact', path: '/impact' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Volunteer', path: '/volunteer' },
    { name: 'Transparency', path: '/transparency' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const headerLogo = settings.darkLogo || settings.logo || '/logo-horizontal.svg';
  const tagline = settings.hindiTagline || settings.tagline || 'Seva • Sanskar • Samriddh Bharat';
  const email = settings.officialEmail || 'jaduandartfoundation@gmail.com';

  return (
    <header className="bg-brand-white shadow-sm sticky top-0 z-50 border-b border-border">
      {/* Top Banner */}
      <div className="bg-brand-dark text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="bg-brand-orange text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide">
              SOCIAL IMPACT
            </span>
            <span className="hidden sm:inline text-gray-200 font-medium">
              {tagline}
            </span>
          </div>
          <div className="flex items-center space-x-5 text-xs text-gray-200">
            <a href={`mailto:${email}`} className="hover:text-brand-orange transition-colors flex items-center space-x-1.5">
              <Mail size={13} className="text-brand-gold" />
              <span className="hidden md:inline font-mono">{email}</span>
            </a>
            <Link to="/transparency" className="hover:text-brand-orange transition-colors flex items-center space-x-1">
              <ShieldCheck size={13} className="text-brand-green" />
              <span>Transparency</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-22">
          {/* Logo */}
          <Link to="/" className="flex items-center group py-2">
            <img 
              src={headerLogo} 
              alt={`${settings.foundationName || 'Jadu & Art Foundation'} Official Logo`} 
              className="h-14 sm:h-16 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.01]" 
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-colors py-1 border-b-2 ${
                  isActive(link.path)
                    ? 'border-brand-orange text-brand-dark font-bold'
                    : 'border-transparent text-text-secondary hover:text-brand-green hover:border-brand-green/40'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden xl:flex items-center space-x-4">
            <Link
              to="/donate"
              className="bg-brand-orange text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#E05D00] transition-all shadow-md hover:shadow-lg flex items-center space-x-2 text-sm"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>DONATE NOW</span>
            </Link>
          </div>

          {/* Mobile / Laptop Menu Button */}
          <div className="xl:hidden flex items-center space-x-3">
            <Link
              to="/donate"
              className="bg-brand-orange text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center space-x-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>DONATE</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-text-primary hover:text-brand-green hover:bg-brand-cream transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-border px-4 pt-3 pb-6 space-y-2.5 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                isActive(link.path)
                  ? 'bg-brand-green/10 text-brand-green font-bold'
                  : 'text-text-primary hover:bg-brand-cream hover:text-brand-dark'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3">
            <Link
              to="/donate"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full bg-brand-orange text-white text-center py-3.5 rounded-xl font-bold text-base shadow-md"
            >
              DONATE NOW
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
