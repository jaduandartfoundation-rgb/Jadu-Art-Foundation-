import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import BilingualHeading from '../components/BilingualHeading';
import { initiativeService } from '../services/api';
import { Initiative } from '../components/DonationInitiativesSection';

const InitiativesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = ['all', 'Education', 'Healthcare', 'Cow Welfare', 'Disaster Relief'];

  useEffect(() => {
    setLoading(true);
    initiativeService.getInitiatives(selectedCategory === 'all' ? undefined : selectedCategory)
      .then(res => {
        if (res.data.success && res.data.data) {
          setInitiatives(res.data.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const handleDonateClick = (e: React.MouseEvent, item: Initiative) => {
    e.stopPropagation();
    navigate(`/donate?initiative=${encodeURIComponent(item._id || item.slug)}`);
  };

  return (
    <div className="bg-warm-off-white min-h-screen py-16 font-sans text-dark-text">
      <Helmet>
        <title>Donation Initiatives | Jadu & Art Foundation</title>
        <meta name="description" content="Support ongoing social donation initiatives for education, healthcare, cow welfare, and disaster relief." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <BilingualHeading 
          englishTitle="DONATION INITIATIVES"
          hindiTitle="दान अभियान"
          subtitle="Explore all verified initiatives needing your support."
        />

        {/* Filter Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-primary-navy text-white shadow-md'
                  : 'bg-white text-gray-700 border border-light-border hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Initiatives Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl h-96 border border-light-border animate-pulse"></div>
            ))}
          </div>
        ) : initiatives.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-light-border text-center max-w-md mx-auto space-y-4">
            <h3 className="text-xl font-bold text-primary-navy">No Initiatives Found</h3>
            <p className="text-gray-600 text-sm">No active initiatives found under "{selectedCategory}".</p>
            <button 
              onClick={() => setSelectedCategory('all')}
              className="bg-primary-navy text-white px-6 py-2.5 rounded-xl text-xs font-bold"
            >
              Show All Initiatives
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initiatives.map((item) => {
              const target = item.targetAmount || 1;
              const raised = item.raisedAmount || 0;
              const progressPct = item.progress !== undefined ? item.progress : Math.min(100, Math.round((raised / target) * 100));
              const isGoalReached = progressPct >= 100;

              return (
                <div 
                  key={item._id}
                  onClick={() => navigate(`/initiatives/${item.slug}`)}
                  className="bg-white rounded-2xl border border-light-border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="h-56 relative overflow-hidden bg-gray-100">
                      <img 
                        src={item.image || 'https://images.pexels.com/photos/15119089/pexels-photo-15119089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary-navy/90 backdrop-blur-md text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>
                    </div>

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

                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-primary-saffron to-orange-500 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(2, progressPct))}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={(e) => handleDonateClick(e, item)}
                      className="w-full bg-primary-saffron text-white py-3.5 px-4 rounded-xl font-extrabold text-sm hover:bg-orange-600 transition-all shadow-md flex items-center justify-center space-x-2"
                    >
                      <Heart className="w-4 h-4 fill-white" />
                      <span>SUPPORT THIS INITIATIVE</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default InitiativesListPage;
