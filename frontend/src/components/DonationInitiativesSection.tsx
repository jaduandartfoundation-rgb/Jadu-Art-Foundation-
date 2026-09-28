import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import BilingualHeading from './BilingualHeading';
import { initiativeService } from '../services/api';

export interface Initiative {
  _id: string;
  title: string;
  hindiTitle?: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  image?: string;
  targetAmount: number;
  raisedAmount: number;
  progress: number;
  isGoalReached?: boolean;
  status: string;
  featured?: boolean;
}

const fallbackInitiatives: Initiative[] = [
  {
    _id: 'init-1',
    title: 'Education for Every Child',
    hindiTitle: 'हर बच्चे के लिए शिक्षा',
    slug: 'education-for-every-child',
    category: 'Education',
    shortDescription: 'Support educational resources, learning materials and opportunities for children who need additional support.',
    description: 'Support educational resources, learning materials and opportunities for children who need additional support.',
    image: 'https://images.pexels.com/photos/15119089/pexels-photo-15119089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    targetAmount: 300000,
    raisedAmount: 135000,
    progress: 45,
    status: 'active'
  },
  {
    _id: 'init-2',
    title: 'Healthcare for Communities',
    hindiTitle: 'समुदायों के लिए स्वास्थ्य सेवा',
    slug: 'healthcare-for-communities',
    category: 'Healthcare',
    shortDescription: 'Help support healthcare initiatives and essential medical assistance for communities in need.',
    description: 'Help support healthcare initiatives and essential medical assistance for communities in need.',
    image: 'https://images.pexels.com/photos/14558557/pexels-photo-14558557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    targetAmount: 500000,
    raisedAmount: 210000,
    progress: 42,
    status: 'active'
  },
  {
    _id: 'init-3',
    title: 'Care & Shelter for Cows',
    hindiTitle: 'गौ सेवा और आश्रय',
    slug: 'care-shelter-for-cows',
    category: 'Cow Welfare',
    shortDescription: 'Support cow feeding, veterinary care and the development of safe shelters for animals.',
    description: 'Support cow feeding, veterinary care and the development of safe shelters for animals.',
    image: 'https://images.pexels.com/photos/30147593/pexels-photo-30147593.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    targetAmount: 400000,
    raisedAmount: 175000,
    progress: 44,
    status: 'active'
  },
  {
    _id: 'init-4',
    title: 'Support During Crisis',
    hindiTitle: 'संकट के समय सहायता',
    slug: 'support-during-crisis',
    category: 'Disaster Relief',
    shortDescription: 'Help provide essential support to communities affected by floods, natural disasters and other emergencies.',
    description: 'Help provide essential support to communities affected by floods, natural disasters and other emergencies.',
    image: 'https://images.pexels.com/photos/20989105/pexels-photo-20989105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    targetAmount: 750000,
    raisedAmount: 320000,
    progress: 43,
    status: 'active'
  }
];

const DonationInitiativesSection: React.FC = () => {
  const navigate = useNavigate();
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initiativeService.getFeaturedInitiatives()
      .then(res => {
        if (res.data.data && res.data.data.length > 0) {
          setInitiatives(res.data.data);
        } else {
          setInitiatives(fallbackInitiatives);
        }
      })
      .catch(() => {
        setInitiatives(fallbackInitiatives);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDonateClick = (e: React.MouseEvent, initiative: Initiative) => {
    e.stopPropagation();
    // Navigate to donate page with initiative preselected via query parameter
    navigate(`/donate?initiative=${encodeURIComponent(initiative._id || initiative.slug)}`);
  };

  const handleCardClick = (slug: string) => {
    navigate(`/initiatives/${slug}`);
  };

  const displayedInitiatives = initiatives.slice(0, 4);

  return (
    <section className="py-20 bg-warm-off-white border-b border-light-border" id="donation-initiatives">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <BilingualHeading 
          englishTitle="DONATION INITIATIVES"
          hindiTitle="दान अभियान"
          subtitle="Support the causes that need you most."
        />

        <div className="text-center -mt-6 mb-12">
          <p className="text-sm font-medium text-gray-600 italic">
            "उन पहलों का समर्थन करें जहाँ आपकी मदद सबसे अधिक ज़रूरी है।"
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl h-[480px] border border-light-border animate-pulse"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedInitiatives.map((item) => {
                const target = item.targetAmount || 1;
                const raised = item.raisedAmount || 0;
                const progressPct = item.progress !== undefined ? item.progress : Math.min(100, Math.round((raised / target) * 100));
                const isGoalReached = progressPct >= 100;

                return (
                  <div 
                    key={item._id}
                    onClick={() => handleCardClick(item.slug)}
                    className="bg-white rounded-2xl border border-light-border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      {/* Large Top Image */}
                      <div className="h-56 relative overflow-hidden bg-gray-100">
                        <img 
                          src={item.image || 'https://images.pexels.com/photos/8926543/pexels-photo-8926543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-primary-navy/90 backdrop-blur-md text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-primary-navy group-hover:text-primary-saffron transition-colors leading-snug">
                          {item.title}
                        </h3>

                        {item.hindiTitle && (
                          <p className="text-sm font-semibold text-primary-saffron mt-1">
                            {item.hindiTitle}
                          </p>
                        )}

                        <p className="text-gray-600 text-sm leading-relaxed mt-3 line-clamp-2 h-10">
                          {item.shortDescription}
                        </p>

                        {/* Financial Info & Progress Bar */}
                        <div className="mt-6 pt-4 border-t border-light-border space-y-2">
                          <div className="flex justify-between items-baseline">
                            <div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">RAISED</span>
                              <span className="text-xl font-black text-primary-navy">
                                ₹{raised.toLocaleString('en-IN')}
                              </span>
                              <span className="text-xs text-gray-500 font-medium ml-1.5">
                                of ₹{target.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div>
                              {isGoalReached ? (
                                <span className="bg-primary-green/15 text-primary-green text-xs font-black px-2.5 py-1 rounded-md tracking-wider">
                                  GOAL REACHED
                                </span>
                              ) : (
                                <span className="text-base font-extrabold text-primary-saffron">
                                  {progressPct}%
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-primary-saffron to-orange-500 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.max(2, progressPct))}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="p-6 pt-0">
                      <button
                        onClick={(e) => handleDonateClick(e, item)}
                        className="w-full bg-primary-saffron text-white py-3.5 px-4 rounded-xl font-extrabold text-sm hover:bg-orange-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                      >
                        <Heart className="w-4 h-4 fill-white" />
                        <span>SUPPORT THIS INITIATIVE</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View All Initiatives CTA */}
            <div className="mt-12 text-center">
              <Link 
                to="/initiatives" 
                className="inline-flex items-center space-x-2 bg-white text-primary-navy border-2 border-primary-navy/20 px-8 py-3.5 rounded-xl font-bold text-base hover:bg-primary-navy hover:text-white transition-all shadow-sm"
              >
                <span>VIEW ALL INITIATIVES</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </>
        )}

      </div>
    </section>
  );
};

export default DonationInitiativesSection;
