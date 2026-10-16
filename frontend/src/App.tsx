import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TimedDonationPopup from './components/TimedDonationPopup';
import DynamicSEO from './components/DynamicSEO';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import Home from './pages/Home';
import OurWork from './pages/OurWork';
import ProgramDetail from './pages/ProgramDetail';
import About from './pages/About';
import ImpactPage from './pages/ImpactPage';
import GalleryPage from './pages/GalleryPage';
import VolunteerPage from './pages/VolunteerPage';
import TransparencyPage from './pages/TransparencyPage';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import DonateSuccess from './pages/DonateSuccess';
import DonateFailed from './pages/DonateFailed';
import InitiativeDetail from './pages/InitiativeDetail';
import InitiativesListPage from './pages/InitiativesListPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import RefundPolicy from './pages/RefundPolicy';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import { Heart } from 'lucide-react';

// Public layout wrapper — renders Navbar, Footer, and shared UI around public pages
function PublicLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isDonationPage = location.pathname.startsWith('/donate');

  return (
    <>
      <Navbar />
      <main className={`flex-grow ${isDonationPage ? '' : 'pb-20 lg:pb-0'}`}>
        {children}
      </main>
      <Footer />

      {/* Timed Delayed Donation Popup */}
      <TimedDonationPopup />
      
      {/* Mobile Sticky Donate Button — hidden on /donate to avoid covering inputs and submission buttons */}
      {!isDonationPage && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] bg-white/95 backdrop-blur-md border-t border-gray-200 z-40 shadow-2xl">
          <Link 
            to="/donate" 
            className="flex items-center justify-center space-x-2 w-full bg-primary-saffron hover:bg-orange-600 active:scale-[0.99] text-white text-center py-3.5 rounded-xl font-black text-base shadow-lg transition-all"
          >
            <Heart className="w-5 h-5 fill-white" />
            <span>DONATE NOW</span>
          </Link>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <SiteSettingsProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-warm-off-white font-sans text-dark-text">
          <DynamicSEO />
          
          <Routes>
            {/* Admin Routes — no public layout */}
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Public Routes — with Navbar & Footer via PublicLayout */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/initiatives" element={<PublicLayout><InitiativesListPage /></PublicLayout>} />
            <Route path="/initiatives/:slug" element={<PublicLayout><InitiativeDetail /></PublicLayout>} />
            <Route path="/our-work" element={<PublicLayout><OurWork /></PublicLayout>} />
            <Route path="/our-work/:slug" element={<PublicLayout><ProgramDetail /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/impact" element={<PublicLayout><ImpactPage /></PublicLayout>} />
            <Route path="/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />
            <Route path="/volunteer" element={<PublicLayout><VolunteerPage /></PublicLayout>} />
            <Route path="/transparency" element={<PublicLayout><TransparencyPage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/donate" element={<PublicLayout><Donate /></PublicLayout>} />
            <Route path="/donate/success" element={<PublicLayout><DonateSuccess /></PublicLayout>} />
            <Route path="/donate/failed" element={<PublicLayout><DonateFailed /></PublicLayout>} />
            <Route path="/privacy-policy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
            <Route path="/terms-and-conditions" element={<PublicLayout><TermsAndConditions /></PublicLayout>} />
            <Route path="/refund-policy" element={<PublicLayout><RefundPolicy /></PublicLayout>} />
          </Routes>
        </div>
      </Router>
    </SiteSettingsProvider>
  );
}

export default App;
