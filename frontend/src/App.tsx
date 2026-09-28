import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <SiteSettingsProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-warm-off-white font-sans text-dark-text">
          <DynamicSEO />
        
        <Routes>
          {/* Admin Routes without main layout wrapper */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Public Routes with Navbar & Footer */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/initiatives" element={<InitiativesListPage />} />
                    <Route path="/initiatives/:slug" element={<InitiativeDetail />} />
                    <Route path="/our-work" element={<OurWork />} />
                    <Route path="/our-work/:slug" element={<ProgramDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/impact" element={<ImpactPage />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/volunteer" element={<VolunteerPage />} />
                    <Route path="/transparency" element={<TransparencyPage />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/donate" element={<Donate />} />
                    <Route path="/donate/success" element={<DonateSuccess />} />
                    <Route path="/donate/failed" element={<DonateFailed />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                  </Routes>
                </main>
                <Footer />

                {/* Timed Delayed Donation Popup */}
                <TimedDonationPopup />
                
                {/* Mobile Sticky Donate Button */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-gray-200 z-50 shadow-2xl">
                  <a 
                    href="/donate" 
                    className="flex items-center justify-center space-x-2 w-full bg-primary-saffron text-white text-center py-3 rounded-xl font-black text-base shadow-lg"
                  >
                    <Heart className="w-5 h-5 fill-white" />
                    <span>DONATE NOW</span>
                  </a>
                </div>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
    </SiteSettingsProvider>
  );
}

export default App;
