import DonationForm from '../components/DonationForm';
import BilingualHeading from '../components/BilingualHeading';
import { ShieldCheck, Heart, Award } from 'lucide-react';

const Donate = () => {
  return (
    <div className="py-16 bg-warm-off-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <BilingualHeading 
          englishTitle="MAKE A DONATION"
          hindiTitle="योगदान दें"
          subtitle="Your contribution directly funds education kits, healthcare camps, cow fodder, and flood disaster relief."
        />

        <DonationForm />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-2xl border border-light-border shadow-sm space-y-2">
            <div className="w-10 h-10 bg-primary-navy/10 text-primary-navy rounded-xl flex items-center justify-center mx-auto">
              <ShieldCheck size={20} />
            </div>
            <h4 className="font-bold text-primary-navy text-sm">Server-Verified Gateway</h4>
            <p className="text-xs text-gray-600">HMAC-SHA256 signature verification via Razorpay.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-light-border shadow-sm space-y-2">
            <div className="w-10 h-10 bg-primary-saffron/10 text-primary-saffron rounded-xl flex items-center justify-center mx-auto">
              <Heart size={20} />
            </div>
            <h4 className="font-bold text-primary-navy text-sm">Direct Social Action</h4>
            <p className="text-xs text-gray-600">100% focused on initiative supplies and beneficiary care.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-light-border shadow-sm space-y-2">
            <div className="w-10 h-10 bg-primary-green/10 text-primary-green rounded-xl flex items-center justify-center mx-auto">
              <Award size={20} />
            </div>
            <h4 className="font-bold text-primary-navy text-sm">Transparent Accountability</h4>
            <p className="text-xs text-gray-600">Strict donation log management and legal compliance.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Donate;
