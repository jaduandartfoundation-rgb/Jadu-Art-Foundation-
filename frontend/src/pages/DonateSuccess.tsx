import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const DonateSuccess = () => {
  const location = useLocation();
  const state = location.state as { amount?: number, campaign?: string, ref?: string } | null;

  return (
    <div className="py-20 bg-warm-off-white min-h-screen flex items-center justify-center">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-light-border text-center p-12">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-primary-green" />
          </div>
          <h1 className="text-3xl font-bold text-primary-navy mb-4">Thank You for Supporting Jadu & Art</h1>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Your support helps us continue working with communities, people and animals who need assistance.
          </p>

          {state && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 text-left max-w-sm mx-auto">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-gray-500 font-medium">Donation Amount:</div>
                <div className="font-bold text-gray-800">₹{state.amount?.toLocaleString('en-IN') || 'N/A'}</div>
                
                <div className="text-gray-500 font-medium">Campaign:</div>
                <div className="font-bold text-gray-800">{state.campaign || 'N/A'}</div>
                
                <div className="text-gray-500 font-medium">Transaction ID:</div>
                <div className="font-bold text-gray-800 truncate" title={state.ref}>{state.ref || 'N/A'}</div>
                
                <div className="text-gray-500 font-medium">Date:</div>
                <div className="font-bold text-gray-800">{new Date().toLocaleDateString('en-IN')}</div>
              </div>
            </div>
          )}

          <Link to="/" className="inline-block bg-primary-navy text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-900 transition-colors">
            BACK TO HOME
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DonateSuccess;
