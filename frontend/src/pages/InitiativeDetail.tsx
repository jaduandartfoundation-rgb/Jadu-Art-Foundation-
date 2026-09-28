import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Heart, 
  CheckCircle, 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  Target, 
  Calendar, 
  ArrowLeft,
  Sparkles,
  Share2
} from 'lucide-react';
import BilingualHeading from '../components/BilingualHeading';
import { initiativeService } from '../services/api';

const InitiativeDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [initiative, setInitiative] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError('');

    initiativeService.getInitiativeBySlug(slug)
      .then(res => {
        if (res.data.success && res.data.data) {
          setInitiative(res.data.data);
          setRelated(res.data.data.relatedInitiatives || []);
        } else {
          setError('Initiative not found.');
        }
      })
      .catch(() => {
        setError('Failed to load initiative details.');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleDonateNow = () => {
    if (initiative) {
      navigate(`/donate?initiative=${encodeURIComponent(initiative._id || initiative.slug)}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-off-white flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary-saffron border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-bold text-sm">Loading initiative details...</p>
        </div>
      </div>
    );
  }

  if (error || !initiative) {
    return (
      <div className="min-h-screen bg-warm-off-white py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-light-border space-y-4">
          <h2 className="text-2xl font-bold text-primary-navy">Initiative Not Found</h2>
          <p className="text-gray-600 text-sm">{error || 'The requested initiative does not exist or has been removed.'}</p>
          <Link 
            to="/initiatives" 
            className="inline-flex items-center space-x-2 bg-primary-navy text-white px-6 py-2.5 rounded-xl font-bold text-sm"
          >
            <ArrowLeft size={16} />
            <span>Back to All Initiatives</span>
          </Link>
        </div>
      </div>
    );
  }

  const raised = initiative.raisedAmount || 0;
  const target = initiative.targetAmount || 1;
  const progressPct = initiative.progress !== undefined ? initiative.progress : Math.min(100, Math.round((raised / target) * 100));
  const isGoalReached = progressPct >= 100;

  return (
    <div className="bg-warm-off-white min-h-screen font-sans text-dark-text">
      <Helmet>
        <title>{`${initiative.title} | Jadu & Art Foundation`}</title>
        <meta name="description" content={initiative.shortDescription || initiative.description} />
      </Helmet>

      {/* Breadcrumb & Navigation */}
      <div className="bg-white border-b border-light-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-sm font-bold text-gray-600 hover:text-primary-saffron transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-500">
            <span>Initiatives</span>
            <span>/</span>
            <span className="text-primary-navy truncate max-w-[200px]">{initiative.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Banner Section */}
      <section className="bg-white border-b border-light-border py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Main details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-primary-saffron/15 text-primary-saffron px-3.5 py-1.5 rounded-full border border-primary-saffron/30 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} />
                <span>{initiative.category} INITIATIVE</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary-navy tracking-tight leading-tight">
                {initiative.title}
              </h1>

              {initiative.hindiTitle && (
                <h2 className="text-xl sm:text-2xl font-bold text-primary-saffron">
                  {initiative.hindiTitle}
                </h2>
              )}

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal">
                {initiative.shortDescription}
              </p>

              <div className="flex flex-wrap gap-4 pt-2 text-xs font-bold text-gray-500">
                {initiative.location && (
                  <div className="flex items-center space-x-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
                    <MapPin size={14} className="text-primary-saffron" />
                    <span>{initiative.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
                  <Target size={14} className="text-primary-green" />
                  <span>Target: ₹{target.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
                  <ShieldCheck size={14} className="text-primary-navy" />
                  <span>Verified 80G Compliant</span>
                </div>
              </div>
            </div>

            {/* Right: Featured Hero Image */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative group">
                <img 
                  src={initiative.image || 'https://images.pexels.com/photos/15119089/pexels-photo-15119089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
                  alt={initiative.title} 
                  className="w-full h-[380px] object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="bg-primary-green text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                    {initiative.status}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Financial Overview & Main Body Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Narrative Content */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Detailed Description Card */}
              <div className="bg-white p-8 rounded-3xl border border-light-border shadow-sm space-y-4">
                <h3 className="text-2xl font-bold text-primary-navy">About This Initiative</h3>
                <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                  {initiative.description}
                </p>
              </div>

              {/* Why This Initiative Matters */}
              <div className="bg-white p-8 rounded-3xl border border-light-border shadow-sm space-y-4">
                <h3 className="text-2xl font-bold text-primary-navy">Why This Initiative Matters</h3>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  Every community action creates a ripple effect. This initiative addresses immediate hardship by delivering essential resources directly to people and animals in need without delay.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start space-x-3 p-4 bg-warm-off-white rounded-2xl border border-light-border">
                    <CheckCircle className="text-primary-green w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-primary-navy text-sm">Direct Distribution</h4>
                      <p className="text-xs text-gray-600">Resources reach ground zero through localized foundation teams.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-warm-off-white rounded-2xl border border-light-border">
                    <CheckCircle className="text-primary-saffron w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-primary-navy text-sm">100% Transparency</h4>
                      <p className="text-xs text-gray-600">Every contribution is logged and audited with complete receipts.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What The Initiative Supports */}
              <div className="bg-white p-8 rounded-3xl border border-light-border shadow-sm space-y-4">
                <h3 className="text-2xl font-bold text-primary-navy">What Your Contribution Supports</h3>
                <div className="p-4 bg-primary-navy/5 rounded-2xl border border-primary-navy/10">
                  <p className="text-primary-navy font-semibold text-sm leading-relaxed">
                    {initiative.impactDescription || 'Educational materials, healthcare kits, animal fodder, emergency dry rations, and direct beneficiary care.'}
                  </p>
                </div>
              </div>

              {/* Documentary Image Gallery */}
              <div className="bg-white p-8 rounded-3xl border border-light-border shadow-sm space-y-4">
                <h3 className="text-2xl font-bold text-primary-navy">Ground Action Gallery</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <img 
                    src={initiative.image || 'https://images.pexels.com/photos/15119089/pexels-photo-15119089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
                    alt="Ground activity photo 1" 
                    className="w-full h-48 object-cover rounded-2xl border border-light-border"
                  />
                  <img 
                    src="https://images.pexels.com/photos/14260022/pexels-photo-14260022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Ground activity photo 2" 
                    className="w-full h-48 object-cover rounded-2xl border border-light-border"
                  />
                </div>
              </div>

            </div>

            {/* Right Column: Donation Summary Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-8 rounded-3xl border-2 border-primary-saffron shadow-xl sticky top-24 space-y-6">
                
                <div className="space-y-1">
                  <span className="text-xs font-bold text-primary-saffron uppercase tracking-wider block">SUPPORT THIS CAUSE</span>
                  <h3 className="text-2xl font-black text-primary-navy">Financial Progress</h3>
                </div>

                <div className="space-y-3 p-4 bg-warm-off-white rounded-2xl border border-light-border">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-gray-500 uppercase">RAISED AMOUNT</span>
                    {isGoalReached ? (
                      <span className="text-xs font-black bg-primary-green text-white px-2 py-0.5 rounded uppercase">GOAL REACHED</span>
                    ) : (
                      <span className="text-sm font-extrabold text-primary-saffron">{progressPct}%</span>
                    )}
                  </div>

                  <div className="text-3xl font-black text-primary-navy">
                    ₹{raised.toLocaleString('en-IN')}
                  </div>

                  <div className="flex justify-between text-xs font-bold text-gray-500 pt-1">
                    <span>Target: ₹{target.toLocaleString('en-IN')}</span>
                    <span>Remaining: ₹{Math.max(0, target - raised).toLocaleString('en-IN')}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-primary-saffron to-orange-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(3, progressPct))}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={handleDonateNow}
                  className="w-full bg-primary-saffron text-white py-4 rounded-xl font-extrabold text-lg shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center space-x-2"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  <span>DONATE NOW</span>
                </button>

                <div className="space-y-3 pt-2 text-xs font-semibold text-gray-500 border-t border-light-border">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-primary-green flex-shrink-0" />
                    <span>Instant Razorpay Payment Receipt</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-primary-navy flex-shrink-0" />
                    <span>Eligible for tax exemption receipts</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Related Initiatives Section */}
      {related.length > 0 && (
        <section className="py-16 bg-white border-t border-light-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BilingualHeading 
              englishTitle="RELATED INITIATIVES"
              hindiTitle="संबंधित पहल"
              subtitle="Explore other active initiatives seeking support."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <div 
                  key={rel._id} 
                  onClick={() => navigate(`/initiatives/${rel.slug}`)}
                  className="bg-warm-off-white rounded-2xl border border-light-border p-6 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-extrabold bg-primary-navy text-white px-2.5 py-0.5 rounded-full uppercase">
                      {rel.category}
                    </span>
                    <h4 className="text-lg font-bold text-primary-navy mt-2 hover:text-primary-saffron transition-colors">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                      {rel.shortDescription}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-light-border flex justify-between items-center text-xs font-bold text-primary-navy">
                    <span>₹{(rel.raisedAmount || 0).toLocaleString('en-IN')} Raised</span>
                    <span className="flex items-center text-primary-saffron">
                      <span>View</span>
                      <ArrowRight size={12} className="ml-1" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default InitiativeDetail;
