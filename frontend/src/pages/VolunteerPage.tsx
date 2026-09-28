import { useState } from 'react';
import BilingualHeading from '../components/BilingualHeading';
import { volunteerService } from '../services/api';
import { Send, CheckCircle, HeartHandshake, Users, Sparkles } from 'lucide-react';

const VolunteerPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    interest: 'Education',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await volunteerService.submitVolunteer(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', city: '', interest: 'Education', message: '' });
    } catch (err) {
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-warm-off-white min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <BilingualHeading 
          englishTitle="BECOME A VOLUNTEER"
          hindiTitle="स्वयंसेवक बनें"
          subtitle="Your time, skills, and energy can transform lives and build stronger communities."
        />

        <div className="bg-white rounded-3xl p-8 md:p-12 border border-light-border shadow-xl">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-primary-green/20 text-primary-green rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={36} />
              </div>
              <h3 className="text-2xl font-bold text-primary-navy">Volunteer Application Received!</h3>
              <p className="text-gray-600 max-w-md mx-auto text-sm">
                Thank you for offering your support. Our volunteer coordinator will contact you shortly.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-4 bg-primary-navy text-white px-6 py-2.5 rounded-xl font-bold text-sm"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-navy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email Address"
                    className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-navy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone Number"
                    className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-navy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">City / Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                    className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-navy"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Area of Interest *</label>
                <select
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-navy"
                >
                  <option value="Education">Education Support (शिक्षा)</option>
                  <option value="Healthcare">Healthcare Camps (स्वास्थ्य सेवा)</option>
                  <option value="Cow Welfare">Cow Welfare & Shelter Care (गौ सेवा)</option>
                  <option value="Disaster Relief">Disaster & Relief Operations (आपदा राहत)</option>
                  <option value="Field Support">Field Operations & Event Management</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Message / Experience (Optional)</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share any past NGO experience, skills or availability details..."
                  className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-navy"
                ></textarea>
              </div>

              <p className="text-xs text-gray-500 font-medium pt-1">
                By submitting this application, you acknowledge that your information will be processed as described in our{' '}
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary-navy font-bold underline hover:text-navy-900">
                  Privacy Policy
                </a>.
              </p>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-primary-navy text-white py-4 rounded-xl font-bold text-base shadow-lg hover:bg-navy-900 transition-colors flex items-center justify-center space-x-2 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <Send size={18} />
                <span>{loading ? 'Submitting Application...' : 'SUBMIT VOLUNTEER APPLICATION'}</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default VolunteerPage;
