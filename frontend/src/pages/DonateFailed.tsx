import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const DonateFailed = () => {
  return (
    <div className="py-20 bg-warm-off-white min-h-screen flex items-center justify-center">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-light-border text-center p-12">
          <div className="flex justify-center mb-6">
            <XCircle className="w-20 h-20 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-primary-navy mb-4">Payment Could Not Be Completed</h1>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Your payment wasn't completed. No successful donation has been recorded.
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <Link to="/donate" className="bg-primary-saffron text-white px-8 py-3 rounded-md font-semibold hover:bg-orange-600 transition-colors">
              TRY AGAIN
            </Link>
            <Link to="/" className="bg-gray-200 text-gray-800 px-8 py-3 rounded-md font-semibold hover:bg-gray-300 transition-colors">
              BACK TO HOME
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonateFailed;
