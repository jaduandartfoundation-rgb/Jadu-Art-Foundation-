import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  BookOpen, 
  HeartPulse, 
  Leaf, 
  Shield, 
  CheckCircle, 
  Send, 
  Users, 
  Sparkles,
  Heart,
  Wind,
  Droplets,
  Sprout,
  ShieldCheck,
  Building,
  UserCheck,
  Sun,
  Flame
} from 'lucide-react';
import BilingualHeading from '../components/BilingualHeading';
import LightboxModal from '../components/LightboxModal';
import DonationInitiativesSection from '../components/DonationInitiativesSection';
import { impactService, storyService, galleryService, volunteerService, contentService, workService } from '../services/api';
import { useSiteSettings } from '../context/SiteSettingsContext';

const Home: React.FC = () => {
  const { settings } = useSiteSettings();

  // Impact Metrics State
  const [metrics, setMetrics] = useState<any[]>([
    { label: 'Children Supported', hindiLabel: 'बच्चों को सहायता', value: '500+', description: 'Educational kits and learning support' },
    { label: 'People Reached', hindiLabel: 'लोगों तक पहुँच', value: '1,200+', description: 'Healthcare camps and emergency relief' },
    { label: 'Cows Supported', hindiLabel: 'गौ सेवा व आश्रय', value: '300+', description: 'Daily feeding & veterinary care' },
    { label: 'Relief Initiatives', hindiLabel: 'आपदा सहायता अभियान', value: '15+', description: 'Emergency disaster response' }
  ]);

  // Content States
  const [stories, setStories] = useState<any[]>([]);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [works, setWorks] = useState<any[]>([]);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImage, setActiveImage] = useState({ src: '', caption: '', category: '' });

  // Volunteer Form State
  const [volunteerData, setVolunteerData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    interest: 'Education',
    message: ''
  });
  const [volunteerSubmitted, setVolunteerSubmitted] = useState(false);
  const [volunteerLoading, setVolunteerLoading] = useState(false);

  // Dynamic CMS State with localStorage caching
  const [cms, setCms] = useState<any>(() => {
    const defaultCmsObj = {
      heroBadge: 'Seva • Sanskar • Samriddh Bharat',
      heroTitle: 'Creating Change.',
      heroTitleHighlight: 'One Life at a Time.',
      heroHindiText: 'सेवा, संस्कार और मानवता के साथ एक बेहतर भारत की ओर।',
      heroDescription: 'Jadu & Art Foundation works towards the welfare of people, communities and animals through education, healthcare, cow welfare and humanitarian support.',
      heroImage: 'https://images.pexels.com/photos/14260022/pexels-photo-14260022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      heroCtaText: 'DONATE NOW',
      secondaryCtaText: 'OUR WORK',
      
      // Founder content
      founderName: 'Founder',
      founderImage: '',
      founderMessageTitle: "FOUNDER'S MESSAGE",
      founderMessageHindiTitle: 'संस्थापक का संदेश',
      founderGreeting: 'पृथ्वी के सभी प्राणियों को मेरा सादर प्रणाम.... आपका हृदय से स्वागत है हमारे फाउंडेशन Jadu & Art Foundation में...',
      founderP1: 'ईश्वरीय शक्ति, माता-पिता और गुरुजनों की कृपा से जीवन जो मिला है, उसमें आत्मा है और आत्मा के लिए ध्यान करना बहुत जरूरी है।',
      founderP2: 'शरीर को साबुन से धोया जा सकता है, परन्तु आत्मा की सफाई केवल ध्यान से संभव है। ध्यान से आध्यात्मिकता, शांति और ऊर्जा प्राप्त होती है।',
      founderP3: 'जब ध्यान आपके जीवन में उतरेगा, तो परोपकार की भावना मन में आएगी। जन कल्याण के बारे में सोचा जाएगा और समाज कल्याण के लिए एक कदम आगे बढ़ेगा।',
      founderP4: 'समाज का कल्याण होगा, राष्ट्र का कल्याण होगा और हमारा देश विकसित होकर समृद्ध भारत के रूप में उभरेगा।',
      founderHighlight: 'जीवन मिला है — इसे केवल जीना नहीं, सार्थक बनाना है।',

      // Life Philosophy
      lifeTitle: 'MAKE LIFE MEANINGFUL',
      lifeHindiTitle: 'जीवन को सार्थक बनाएं',
      lifeText: 'जो जीवन मिला है और हर रोज़ मिल रहा है, उसका आनंद लो क्योंकि मौत सिर्फ एक बार मिलती है। तभी जीवन का उद्धार संभव है।',
      lifeHighlight: 'आओ, मौत की तैयारी बेहतर करें।',

      // Future Generations
      futureTitle: 'A BETTER FUTURE FOR THE NEXT GENERATION',
      futureHindiTitle: 'आने वाली पीढ़ी के लिए बेहतर भविष्य',
      futureText: 'मिली है जीवन तो आने वाली पीढ़ी को धन के साथ-साथ अच्छा वातावरण, शुद्ध अनाज, शुद्ध हवा, शुद्ध पानी, प्रकृति से भरा हुआ, नशा-मुक्त और समृद्ध देश दें।',

      // Humanity Section
      humanityTitle: 'HUMANITY ABOVE DIFFERENCES',
      humanityHindiTitle: 'मानवता सबसे ऊपर',
      humanityText: 'उच्च-नीच, जाति, भेदभाव और धर्मों से हमारा संसार नहीं चलेगा। संसार चलेगा मानवता और इंसानियत से।',
      humanityHighlight: 'जिओ और जीने दो।',
      humanityEnglishText: 'Live with humanity. Let others live with dignity.',

      // Our Prayer
      prayerTitle: 'OUR PRAYER',
      prayerHindiTitle: 'हमारी प्रार्थना',
      prayerText: 'ऊपर वाले से सिर्फ एक ही प्रार्थना है — सबका कल्याण करना प्रभु, कोई भी भूखा ना रहे।',
      prayerCta: 'DONATE NOW',
      prayerCtaHindi: 'सेवा में अपना योगदान दें',

      // Transition Connection
      transitionQuote: 'विचार तभी सार्थक है जब वह सेवा में बदलता है।',
      transitionSubtext: 'हमारे कार्य में सहयोग करें',

      // About section (Homepage)
      aboutSectionImage: ''
    };

    try {
      const cached = localStorage.getItem('cached_cms_homepage');
      if (cached) return { ...defaultCmsObj, ...JSON.parse(cached) };
    } catch (e) {}
    return defaultCmsObj;
  });

  useEffect(() => {
    contentService.getContentByKey('homepage')
      .then(res => { if (res.data.data) setCms((prev: any) => ({ ...prev, ...res.data.data })); })
      .catch(() => {});

    workService.getWorks()
      .then(res => { if (res.data.data?.length) setWorks(res.data.data); })
      .catch(() => {});

    impactService.getImpactMetrics()
      .then(res => { if (res.data.data?.length) setMetrics(res.data.data); })
      .catch(() => {});

    storyService.getStories()
      .then(res => { if (res.data.data) setStories(res.data.data); })
      .catch(() => {});

    galleryService.getGalleryItems()
      .then(res => { if (res.data.data) setGalleryItems(res.data.data); })
      .catch(() => {});
  }, []);

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVolunteerLoading(true);
    try {
      await volunteerService.submitVolunteer(volunteerData);
      setVolunteerSubmitted(true);
      setVolunteerData({ name: '', email: '', phone: '', city: '', interest: 'Education', message: '' });
    } catch (err) {
      alert('Failed to submit application. Please try again.');
    } finally {
      setVolunteerLoading(false);
    }
  };

  const openLightbox = (src: string, caption: string, category: string) => {
    setActiveImage({ src, caption, category });
    setLightboxOpen(true);
  };

  const defaultGallery = [
    { _id: '1', title: 'Education Support', category: 'Education', image: 'https://images.pexels.com/photos/20556421/pexels-photo-20556421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { _id: '2', title: 'Community Health Checkup', category: 'Healthcare', image: 'https://images.pexels.com/photos/14558556/pexels-photo-14558556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { _id: '3', title: 'Gau Seva & Fodder Feeding', category: 'Cow Welfare', image: 'https://images.pexels.com/photos/12220839/pexels-photo-12220839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { _id: '4', title: 'Disaster Relief Drive', category: 'Disaster Relief', image: 'https://images.pexels.com/photos/5909876/pexels-photo-5909876.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }
  ];

  const displayGallery = galleryItems.length > 0 ? galleryItems : defaultGallery;
  const filteredGallery = activeCategory === 'all' 
    ? displayGallery 
    : displayGallery.filter(item => item.category?.toLowerCase() === activeCategory.toLowerCase());

  // Default works fallback if API is empty
  const defaultWorks = [
    {
      _id: 'work-1',
      slug: 'education',
      title: 'Education & Child Empowerment',
      hindiTitle: 'शिक्षा और बाल सशक्तिकरण',
      shortDescription: 'Supporting children through educational kits, notebooks, and learning opportunities.',
      image: 'https://images.pexels.com/photos/15119089/pexels-photo-15119089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      icon: 'BookOpen'
    },
    {
      _id: 'work-2',
      slug: 'healthcare',
      title: 'Community Healthcare & Medical Care',
      hindiTitle: 'स्वास्थ्य सेवा व चिकित्सा सहायता',
      shortDescription: 'Free health checkup camps, essential medicine distribution, and emergency care.',
      image: 'https://images.pexels.com/photos/14558557/pexels-photo-14558557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      icon: 'HeartPulse'
    },
    {
      _id: 'work-3',
      slug: 'cow-welfare',
      title: 'Cow Welfare & Safe Shelter Sanctuary',
      hindiTitle: 'गौ सेवा और सुरक्षित आश्रय',
      shortDescription: 'Daily green fodder, veterinary medical treatment, and protective shelter support.',
      image: 'https://images.pexels.com/photos/30147593/pexels-photo-30147593.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      icon: 'Leaf'
    },
    {
      _id: 'work-4',
      slug: 'disaster-relief',
      title: 'Humanitarian & Flood Disaster Relief',
      hindiTitle: 'मानवीय व बाढ़ आपदा राहत',
      shortDescription: 'Rapid deployment of dry ration kits, clean water, and shelter during emergencies.',
      image: 'https://images.pexels.com/photos/20989105/pexels-photo-20989105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      icon: 'Shield'
    }
  ];

  const displayWorks = works.length > 0 ? works : defaultWorks;

  return (
    <div className="bg-brand-cream min-h-screen font-sans text-text-primary">

      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      {(settings.visibleSections?.heroSection !== false) && (
      <section className="relative bg-brand-white border-b border-border py-12 md:py-20 overflow-hidden">
        {/* Subtle Background Organic Curves */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-brand-cream px-4 py-2 rounded-full border border-brand-gold/30 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-pulse"></span>
                <span className="text-xs font-extrabold text-brand-dark uppercase tracking-widest hindi-text">
                  {cms.heroBadge || "Seva • Sanskar • Samriddh Bharat"}
                </span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-brand-dark tracking-tight leading-tight">
                  {cms.heroTitle || "Creating Change."}{" "}
                  <span className="text-brand-green block sm:inline">
                    {cms.heroTitleHighlight || "One Life at a Time."}
                  </span>
                </h1>
                <p className="text-lg sm:text-xl font-bold text-brand-orange hindi-text pt-1">
                  {cms.heroHindiText || "सेवा, संस्कार और मानवता के साथ एक बेहतर भारत की ओर।"}
                </p>
              </div>

              {/* Gold Accent Bar */}
              <div className="w-20 h-1 bg-brand-gold rounded-full"></div>

              {/* Paragraph */}
              <p className="text-text-secondary text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                {cms.heroDescription || "Jadu & Art Foundation works towards the welfare of people, communities and animals through education, healthcare, cow welfare and humanitarian support."}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/donate"
                  className="bg-brand-orange text-white px-8 py-4 rounded-2xl font-extrabold text-base hover:bg-[#E05D00] transition-all shadow-lg hover:shadow-xl flex items-center space-x-2.5 group"
                >
                  <Heart className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
                  <span>{cms.heroCtaText || "DONATE NOW"}</span>
                </Link>

                <Link
                  to="/our-work"
                  className="bg-brand-cream text-brand-dark border border-brand-green/30 px-8 py-4 rounded-2xl font-bold text-base hover:bg-brand-green/10 transition-all flex items-center space-x-2"
                >
                  <span>{cms.secondaryCtaText || "OUR WORK"}</span>
                  <ArrowRight className="w-4 h-4 text-brand-green" />
                </Link>
              </div>

              {/* Trust Subtext */}
              <div className="flex items-center space-x-6 pt-3 text-xs font-semibold text-text-secondary">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck size={16} className="text-brand-green" />
                  <span>Transparent Stewardship</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Heart size={16} className="text-brand-orange" />
                  <span>Direct Ground Action</span>
                </div>
              </div>

            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-brand-white bg-brand-white">
                <img
                  src={cms.heroImage || "https://images.pexels.com/photos/1183434/pexels-photo-1183434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
                  alt="Jadu & Art Foundation Ground Work"
                  className="w-full h-[420px] sm:h-[480px] object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent"></div>

                {/* Floating Logo Badge on Hero Image */}
                <div className="absolute bottom-6 left-6 right-6 bg-brand-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-brand-gold/40 flex items-center space-x-4">
                  <img src={settings.logo || settings.darkLogo || '/logo-mark.svg'} alt="Official Logo Emblem" className="w-12 h-12 object-contain" />
                  <div>
                    <h4 className="text-sm font-black text-brand-dark">{settings.foundationName || 'JADU & ART FOUNDATION'}</h4>
                    <p className="text-[11px] font-bold text-brand-orange hindi-text">{settings.hindiTagline || 'Spiritual Values • Social Impact'}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      )}

      {/* ========================================================================= */}
      {/* IMPACT STRIP */}
      {/* ========================================================================= */}
      {(settings.visibleSections?.impactStrip !== false) && (
      <section className="bg-brand-dark text-white py-10 border-b border-brand-gold/20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {metrics.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-gold/40 transition-all">
                <p className="text-3xl sm:text-4xl font-black text-brand-orange tracking-tight">{item.value}</p>
                <h4 className="text-sm font-bold text-white mt-1">{item.label}</h4>
                {item.hindiLabel && (
                  <p className="text-xs text-brand-gold font-semibold hindi-text">{item.hindiLabel}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ========================================================================= */}
      {/* 2. ABOUT JADU & ART SECTION */}
      {/* ========================================================================= */}
      {(settings.visibleSections?.aboutSection !== false) && (
      <section className="py-16 md:py-20 bg-brand-cream border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BilingualHeading 
            englishTitle="ABOUT JADU & ART FOUNDATION"
            hindiTitle="जादू एंड आर्ट फाउंडेशन के बारे में"
            subtitle="Spiritual Values • Social Impact • A Brighter India"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mt-10">
            {/* Left Column: Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <img 
                  src={cms.aboutSectionImage || "https://images.pexels.com/photos/7090333/pexels-photo-7090333.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"} 
                  alt="About Jadu and Art Foundation"
                  className="w-full h-[380px] object-cover" 
                />
                <div className="absolute inset-0 bg-brand-dark/20"></div>
                <div className="absolute top-4 left-4 bg-brand-white p-3 rounded-2xl shadow-md border border-brand-gold/30">
                  <img src={settings.darkLogo || settings.logo || '/logo-horizontal.svg'} alt="Official Logo" className="h-10 w-auto" />
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Introduction */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-block gold-badge">
                <Sparkles size={14} />
                <span>FOUNDATION OVERVIEW</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-brand-dark leading-snug">
                Dedicated to human welfare, community dignity & animal care.
              </h3>
              <p className="text-text-secondary text-base leading-relaxed">
                Jadu & Art Foundation was created with a vision to combine spiritual values, moral responsibility and ground-level action for social improvement across India.
              </p>
              <p className="text-text-secondary text-base leading-relaxed">
                Our programs focus on four pillar areas: empowering underprivileged children through education, providing community healthcare assistance, maintaining cow shelters with daily green fodder & medical aid, and offering rapid emergency relief during floods and humanitarian crises.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-border space-y-1">
                  <h4 className="text-sm font-bold text-brand-dark flex items-center space-x-2">
                    <CheckCircle size={16} className="text-brand-green" />
                    <span>Direct Community Action</span>
                  </h4>
                  <p className="text-xs text-text-secondary">On-ground assistance with complete transparency.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-border space-y-1">
                  <h4 className="text-sm font-bold text-brand-dark flex items-center space-x-2">
                    <CheckCircle size={16} className="text-brand-green" />
                    <span>Value-Driven Service</span>
                  </h4>
                  <p className="text-xs text-text-secondary">Rooted in Seva, Sanskar and Samriddh Bharat.</p>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/about" className="inline-flex items-center space-x-2 font-bold text-brand-green hover:text-brand-dark text-sm">
                  <span>Read complete foundation story</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
      )}

      {/* ========================================================================= */}
      {/* 3. OUR WORK */}
      {/* ========================================================================= */}
      {(settings.visibleSections?.workSection !== false) && (
      <section className="py-16 md:py-24 bg-brand-cream border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BilingualHeading 
            englishTitle={cms.ourWorkTitle || "OUR WORK"}
            hindiTitle={cms.ourWorkHindiTitle || "हमारे कार्य"}
            subtitle={cms.ourWorkSubtitle || "Education • Healthcare • Cow Welfare • Disaster Relief"}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {displayWorks.map((work) => (
              <div 
                key={work._id || work.slug} 
                className="bg-white rounded-3xl overflow-hidden border border-border shadow-md hover:shadow-xl transition-all flex flex-col group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={work.image || 'https://images.pexels.com/photos/8926543/pexels-photo-8926543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
                    alt={work.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-brand-orange text-white p-2.5 rounded-xl shadow-md">
                    {work.slug === 'education' && <BookOpen size={20} />}
                    {work.slug === 'healthcare' && <HeartPulse size={20} />}
                    {work.slug === 'cow-welfare' && <Leaf size={20} />}
                    {work.slug === 'disaster-relief' && <Shield size={20} />}
                    {['education', 'healthcare', 'cow-welfare', 'disaster-relief'].indexOf(work.slug) === -1 && <Sparkles size={20} />}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-lg font-black text-brand-dark group-hover:text-brand-orange transition-colors">
                      {work.title}
                    </h4>
                    {work.hindiTitle && (
                      <p className="text-xs font-bold text-brand-green hindi-text">{work.hindiTitle}</p>
                    )}
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                      {work.shortDescription}
                    </p>
                  </div>

                  <Link 
                    to={`/our-work/${work.slug}`}
                    className="inline-flex items-center space-x-1.5 text-xs font-extrabold text-brand-orange hover:text-brand-dark transition-colors pt-2"
                  >
                    <span>EXPLORE INITIATIVE</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-10">
            <Link 
              to="/our-work"
              className="inline-flex items-center space-x-2 bg-brand-dark text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-brand-green transition-colors shadow-md"
            >
              <span>VIEW ALL WORK AREAS</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* ========================================================================= */}
      {/* 4. JADU PHILOSOPHY SECTION */}
      {/* ========================================================================= */}
      {(settings.visibleSections?.initiativesSection !== false) && (
      <section className="py-16 md:py-20 bg-brand-cream border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BilingualHeading 
            englishTitle={cms.jaduTitle || "OUR PHILOSOPHY"}
            hindiTitle={cms.jaduHindiTitle || "हमारा दर्शन"}
            subtitle="J — जीवन | A — आत्मा | D — ध्यान | U — उद्धार"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            
            {/* Card 1: J - Jivan */}
            <div className="bg-white rounded-3xl p-6 border border-border shadow-md hover:shadow-xl transition-all space-y-3 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-brand-green/10 rounded-bl-full flex items-center justify-center font-black text-2xl text-brand-green">
                J
              </div>
              <div className="w-12 h-12 rounded-2xl bg-brand-green text-white flex items-center justify-center font-extrabold text-xl">
                J
              </div>
              <div className="pt-2">
                <h4 className="text-2xl font-black text-brand-dark hindi-text">जीवन</h4>
                <p className="text-xs font-bold text-brand-orange uppercase tracking-wider">LIFE</p>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed hindi-text">
                ईश्वरीय शक्ति, माता-पिता और गुरुजनों की कृपा से प्राप्त अमूल्य अवसर जिसे सेवा व सार्थक कार्यों में लगाना है।
              </p>
            </div>

            {/* Card 2: A - Atma */}
            <div className="bg-white rounded-3xl p-6 border border-border shadow-md hover:shadow-xl transition-all space-y-3 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-brand-gold/10 rounded-bl-full flex items-center justify-center font-black text-2xl text-brand-gold">
                A
              </div>
              <div className="w-12 h-12 rounded-2xl bg-brand-gold text-white flex items-center justify-center font-extrabold text-xl">
                A
              </div>
              <div className="pt-2">
                <h4 className="text-2xl font-black text-brand-dark hindi-text">आत्मा</h4>
                <p className="text-xs font-bold text-brand-orange uppercase tracking-wider">SOUL</p>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed hindi-text">
                शरीर की आंतरिक पवित्रता और चेतन शक्ति जिसका शोधन केवल ध्यान, सत्य और परोपकार से ही संभव है।
              </p>
            </div>

            {/* Card 3: D - Dhyan */}
            <div className="bg-white rounded-3xl p-6 border border-border shadow-md hover:shadow-xl transition-all space-y-3 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-brand-orange/10 rounded-bl-full flex items-center justify-center font-black text-2xl text-brand-orange">
                D
              </div>
              <div className="w-12 h-12 rounded-2xl bg-brand-orange text-white flex items-center justify-center font-extrabold text-xl">
                D
              </div>
              <div className="pt-2">
                <h4 className="text-2xl font-black text-brand-dark hindi-text">ध्यान</h4>
                <p className="text-xs font-bold text-brand-orange uppercase tracking-wider">MEDITATION</p>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed hindi-text">
                आत्मा की सफाई, मानसिक शांति, सकारात्मक ऊर्जा और दूसरों के प्रति करुणा का जाग्रत माध्यम।
              </p>
            </div>

            {/* Card 4: U - Uddhar */}
            <div className="bg-white rounded-3xl p-6 border border-border shadow-md hover:shadow-xl transition-all space-y-3 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-brand-dark/10 rounded-bl-full flex items-center justify-center font-black text-2xl text-brand-dark">
                U
              </div>
              <div className="w-12 h-12 rounded-2xl bg-brand-dark text-white flex items-center justify-center font-extrabold text-xl">
                U
              </div>
              <div className="pt-2">
                <h4 className="text-2xl font-black text-brand-dark hindi-text">उद्धार</h4>
                <p className="text-xs font-bold text-brand-orange uppercase tracking-wider">ELEVATION & SERVICE</p>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed hindi-text">
                जन कल्याण, समाज कल्याण और समृद्ध भारत का निर्माण — जीवन को पूर्णता और सार्थकता की ओर ले जाना।
              </p>
            </div>

          </div>
        </div>
      </section>
      )}

      {/* ========================================================================= */}
      {/* 5. MAKE LIFE MEANINGFUL (LIFE PHILOSOPHY) */}
      {/* ========================================================================= */}
      {(settings.visibleSections?.lifePhilosophySection !== false) && (
      <section className="py-16 bg-brand-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <BilingualHeading 
            englishTitle={cms.lifeTitle || "MAKE LIFE MEANINGFUL"}
            hindiTitle={cms.lifeHindiTitle || "जीवन को सार्थक बनाएं"}
            subtitle="Understanding Purpose, Service & Living Worthily"
          />

          <div className="bg-brand-cream p-8 sm:p-12 rounded-3xl border border-brand-gold/40 shadow-lg space-y-6">
            <p className="text-lg sm:text-xl font-bold text-brand-dark hindi-text leading-relaxed">
              "{cms.lifeText || "जो जीवन मिला है और हर रोज़ मिल रहा है, उसका आनंद लो क्योंकि मौत सिर्फ एक बार मिलती है। तभी जीवन का उद्धार संभव है।"}"
            </p>

            <div className="gold-divider max-w-xs mx-auto"></div>

            <div className="inline-block bg-brand-orange text-white px-8 py-3.5 rounded-full font-black text-base sm:text-lg shadow-md hindi-text tracking-wide">
              {cms.lifeHighlight || "आओ, मौत की तैयारी बेहतर करें।"}
            </div>

            <p className="text-xs text-text-secondary max-w-lg mx-auto leading-relaxed pt-2">
              Preparing for life's ultimate truth means filling each day with selfless service, kindness, nature protection, and helping those who cannot help themselves.
            </p>
          </div>
        </div>
      </section>
      )}

      {/* ========================================================================= */}
      {/* 6. DONATION INITIATIVES SECTION */}
      {/* ========================================================================= */}
      {(settings.visibleSections?.initiativesSection !== false) && (
        <DonationInitiativesSection />
      )}

      {/* ========================================================================= */}
      {/* 7. A BETTER FUTURE FOR THE NEXT GENERATION */}
      {/* ========================================================================= */}
      {(settings.visibleSections?.futureGenerationsSection !== false) && (
      <section className="py-16 md:py-24 bg-brand-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BilingualHeading 
            englishTitle={cms.futureTitle || "A BETTER FUTURE FOR THE NEXT GENERATION"}
            hindiTitle={cms.futureHindiTitle || "आने वाली पीढ़ी के लिए बेहतर भविष्य"}
            subtitle="Preserving Environment, Health & Values for Tomorrow"
          />

          {/* Banner message */}
          <div className="bg-brand-cream p-6 sm:p-8 rounded-3xl border border-brand-gold/40 text-center max-w-4xl mx-auto mt-8 mb-12 shadow-sm">
            <p className="text-base sm:text-lg font-bold text-brand-dark hindi-text leading-relaxed">
              "{cms.futureText || "मिली है जीवन तो आने वाली पीढ़ी को धन के साथ-साथ अच्छा वातावरण, शुद्ध अनाज, शुद्ध हवा, शुद्ध पानी, प्रकृति से भरा हुआ, नशा-मुक्त और समृद्ध देश दें।"}"
            </p>
          </div>

          {/* 6 Visual Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Clean Air */}
            <div className="bg-brand-cream rounded-3xl p-6 border border-border shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-green/15 text-brand-green flex items-center justify-center">
                <Wind size={24} />
              </div>
              <div>
                <h4 className="text-lg font-black text-brand-dark hindi-text">शुद्ध हवा</h4>
                <p className="text-xs font-bold text-brand-orange uppercase tracking-wider">SHUDDH HAWA</p>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Tree plantation, environmental preservation and clean air initiatives to safeguard future breath.
              </p>
            </div>

            {/* Card 2: Pure Water */}
            <div className="bg-brand-cream rounded-3xl p-6 border border-border shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-dark/15 text-brand-dark flex items-center justify-center">
                <Droplets size={24} />
              </div>
              <div>
                <h4 className="text-lg font-black text-brand-dark hindi-text">शुद्ध पानी</h4>
                <p className="text-xs font-bold text-brand-orange uppercase tracking-wider">SHUDDH PAANI</p>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Water conservation, pond restoration and accessible clean drinking water programs.
              </p>
            </div>

            {/* Card 3: Pure Grain */}
            <div className="bg-brand-cream rounded-3xl p-6 border border-border shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold/20 text-brand-gold flex items-center justify-center">
                <Sun size={24} />
              </div>
              <div>
                <h4 className="text-lg font-black text-brand-dark hindi-text">शुद्ध अनाज</h4>
                <p className="text-xs font-bold text-brand-orange uppercase tracking-wider">SHUDDH ANAAJ</p>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Promoting natural farming, nutrition kits for children, and chemical-free sustainable food.
              </p>
            </div>

            {/* Card 4: Nature */}
            <div className="bg-brand-cream rounded-3xl p-6 border border-border shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-green/20 text-brand-green flex items-center justify-center">
                <Sprout size={24} />
              </div>
              <div>
                <h4 className="text-lg font-black text-brand-dark hindi-text">प्रकृति</h4>
                <p className="text-xs font-bold text-brand-orange uppercase tracking-wider">PRAKRITI</p>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Ecological conservation, protection of flora & fauna, and living in harmony with nature.
              </p>
            </div>

            {/* Card 5: Addiction-Free Society */}
            <div className="bg-brand-cream rounded-3xl p-6 border border-border shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-orange/20 text-brand-orange flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-lg font-black text-brand-dark hindi-text">नशा-मुक्त समाज</h4>
                <p className="text-xs font-bold text-brand-orange uppercase tracking-wider">NASHA-MUKT SAMAJ</p>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Empowering youth with purpose, moral education, health awareness, and addiction-free living.
              </p>
            </div>

            {/* Card 6: Prosperous India */}
            <div className="bg-brand-cream rounded-3xl p-6 border border-border shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-dark text-white flex items-center justify-center">
                <Building size={24} />
              </div>
              <div>
                <h4 className="text-lg font-black text-brand-dark hindi-text">समृद्ध भारत</h4>
                <p className="text-xs font-bold text-brand-orange uppercase tracking-wider">SAMRIDDH BHARAT</p>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Building a self-reliant, compassionate and value-driven nation through Seva and Sanskar.
              </p>
            </div>

          </div>
        </div>
      </section>
      )}

      {/* HUMANITY ABOVE DIFFERENCES */}
      {(settings.visibleSections?.humanitySection !== false) && (
      <section className="py-16 md:py-20 bg-brand-dark text-white border-b border-brand-gold/20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          
          <div className="inline-block bg-white/10 text-brand-gold text-xs font-bold px-4 py-1.5 rounded-full border border-brand-gold/30">
            HUMANITY FIRST / मानवता सबसे ऊपर
          </div>

          <h3 className="text-2xl sm:text-4xl font-black text-white hindi-text leading-snug max-w-3xl mx-auto">
            "{cms.humanityText || "उच्च-नीच, जाति, भेदभाव और धर्मों से हमारा संसार नहीं चलेगा। संसार चलेगा मानवता और इंसानियत से।"}"
          </h3>

          <div className="py-4">
            <span className="text-3xl sm:text-5xl font-black text-brand-orange hindi-text bg-white/5 px-8 py-4 rounded-3xl border border-brand-orange/40 inline-block shadow-xl">
              "{cms.humanityHighlight || "जिओ और जीने दो।"}"
            </span>
          </div>

          <p className="text-sm sm:text-base text-gray-300 font-medium">
            {cms.humanityEnglishText || "Live with humanity. Let others live with dignity."}
          </p>

        </div>
      </section>
      )}

      {/* ========================================================================= */}
      {/* 8. FOUNDER'S MESSAGE */}
      {/* ========================================================================= */}
      {(settings.visibleSections?.founderSection !== false) && (
      <section className="py-16 md:py-24 bg-brand-white border-b border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <BilingualHeading 
            englishTitle={cms.founderMessageTitle || "FOUNDER'S MESSAGE"}
            hindiTitle={cms.founderMessageHindiTitle || "संस्थापक का संदेश"}
            subtitle="Philosophy of Service, Inner Purity & Social Welfare"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-12">
            
            {/* Left Column: Founder Photo Card */}
            <div className="lg:col-span-5">
              <div className="bg-brand-cream rounded-3xl p-6 border-2 border-brand-gold/30 shadow-xl text-center space-y-4 relative">
                {cms.founderImage ? (
                  <img 
                    src={cms.founderImage} 
                    alt="Founder Jadu & Art Foundation" 
                    className="w-full h-80 sm:h-96 object-cover rounded-2xl shadow-md"
                  />
                ) : (
                  <div className="w-full h-80 sm:h-96 bg-brand-dark/10 rounded-2xl flex flex-col items-center justify-center p-6 border-2 border-dashed border-brand-gold/40 text-center">
                    <div className="w-20 h-20 rounded-full bg-brand-green/20 text-brand-green flex items-center justify-center mb-3">
                      <UserCheck size={36} />
                    </div>
                    <p className="text-sm font-bold text-brand-dark">FOUNDER PHOTOGRAPH</p>
                    <p className="text-xs text-text-secondary mt-1">Official photograph managed via Cloudinary CMS.</p>
                  </div>
                )}
                
                <div className="pt-2">
                  <h4 className="text-xl font-black text-brand-dark">{cms.founderName || "Founder"}</h4>
                  <p className="text-xs font-bold text-brand-orange uppercase tracking-wider">JADU & ART FOUNDATION</p>
                  <p className="text-xs text-text-secondary italic hindi-text pt-1">"सेवा, ध्यान और लोक कल्याण"</p>
                </div>
              </div>
            </div>

            {/* Right Column: Founder's Content */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Greeting */}
              <div className="p-5 rounded-2xl bg-brand-cream border-l-4 border-brand-gold shadow-sm">
                <p className="text-base sm:text-lg font-extrabold text-brand-dark hindi-text leading-relaxed">
                  "{cms.founderGreeting || "पृथ्वी के सभी प्राणियों को मेरा सादर प्रणाम.... आपका हृदय से स्वागत है हमारे फाउंडेशन Jadu & Art Foundation में..."}"
                </p>
              </div>

              {/* Message Paragraphs */}
              <div className="space-y-4 text-text-primary text-base leading-relaxed font-normal">
                <p className="hindi-text">
                  {cms.founderP1 || "ईश्वरीय शक्ति, माता-पिता और गुरुजनों की कृपा से जीवन जो मिला है, उसमें आत्मा है और आत्मा के लिए ध्यान करना बहुत जरूरी है।"}
                </p>
                
                <p className="hindi-text">
                  {cms.founderP2 || "शरीर को साबुन से धोया जा सकता है, परन्तु आत्मा की सफाई केवल ध्यान से संभव है। ध्यान से आध्यात्मिकता, शांति और ऊर्जा प्राप्त होती है।"}
                </p>
                
                <p className="hindi-text">
                  {cms.founderP3 || "जब ध्यान आपके जीवन में उतरेगा, तो परोपकार की भावना मन में आएगी। जन कल्याण के बारे में सोचा जाएगा और समाज कल्याण के लिए एक कदम आगे बढ़ेगा।"}
                </p>

                <p className="hindi-text">
                  {cms.founderP4 || "समाज का कल्याण होगा, राष्ट्र का कल्याण होगा और हमारा देश विकसित होकर समृद्ध भारत के रूप में उभरेगा।"}
                </p>
              </div>

              {/* Highlighted Quote Box */}
              <div className="p-6 rounded-2xl bg-brand-green/10 border border-brand-green/30 text-center space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-green">FOUNDER'S CORE HIGHLIGHT</p>
                <p className="text-xl font-black text-brand-dark hindi-text">
                  "{cms.founderHighlight || "जीवन मिला है — इसे केवल जीना नहीं, सार्थक बनाना है।"}"
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>
      )}

      {/* ========================================================================= */}
      {/* 9. GALLERY */}
      {/* ========================================================================= */}
      {(settings.visibleSections?.storiesSection !== false) && stories.length > 0 && (
        <section className="py-16 md:py-24 bg-brand-cream border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BilingualHeading 
              englishTitle="STORIES OF CHANGE"
              hindiTitle="बदलाव की कहानियाँ"
              subtitle="Verified stories from ground initiatives."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {stories.slice(0, 3).map((story) => (
                <div key={story._id} className="bg-white rounded-3xl overflow-hidden border border-border shadow-md space-y-4 p-6 flex flex-col justify-between">
                  <div className="space-y-3">
                    <img 
                      src={story.image || 'https://images.pexels.com/photos/8926543/pexels-photo-8926543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
                      alt={story.title} 
                      className="w-full h-48 object-cover rounded-2xl"
                    />
                    <div className="inline-block bg-brand-green/10 text-brand-green text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {story.category || 'Impact Story'}
                    </div>
                    <h4 className="text-lg font-black text-brand-dark">{story.title}</h4>
                    {story.hindiTitle && <p className="text-xs font-bold text-brand-orange hindi-text">{story.hindiTitle}</p>}
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">{story.summary || story.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {(settings.visibleSections?.gallerySection !== false) && (
      <section className="py-16 md:py-24 bg-brand-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BilingualHeading 
            englishTitle="MOMENTS OF CHANGE"
            hindiTitle="बदलाव की झलकियाँ"
            subtitle="Authentic documentary photography from foundation initiatives."
          />

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8 mb-10">
            {['all', 'Education', 'Healthcare', 'Cow Welfare', 'Disaster Relief'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-brand-orange text-white shadow-md'
                    : 'bg-brand-cream text-text-secondary hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'All Gallery' : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGallery.slice(0, 8).map((item, idx) => (
              <div 
                key={item._id || idx}
                onClick={() => openLightbox(item.image, item.title, item.category)}
                className="bg-brand-cream rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all cursor-pointer group relative"
              >
                <div className="h-56 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <div className="p-4 bg-white">
                  <h4 className="text-xs font-bold text-brand-dark group-hover:text-brand-orange transition-colors truncate">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-text-secondary">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ========================================================================= */}
      {/* 10. BECOME A VOLUNTEER */}
      {/* ========================================================================= */}
      {(settings.visibleSections?.volunteerSection !== false) && (
      <section className="py-16 md:py-24 bg-brand-cream border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-white rounded-3xl border border-border p-8 md:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <BilingualHeading 
                englishTitle="BE PART OF THE CHANGE"
                hindiTitle="बदलाव का हिस्सा बनें"
                subtitle="Your time, skills and dedication bring hope to lives in need."
                align="left"
              />
              <p className="text-text-secondary text-sm leading-relaxed">
                Whether organizing local awareness sessions, assisting during healthcare camps, aiding cow feeding drives, or coordinating emergency relief, volunteers are the heartbeat of Jadu & Art Foundation.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-3 text-xs font-bold text-brand-dark">
                  <CheckCircle size={18} className="text-brand-green" />
                  <span>Participate in direct community welfare initiatives</span>
                </div>
                <div className="flex items-center space-x-3 text-xs font-bold text-brand-dark">
                  <CheckCircle size={18} className="text-brand-green" />
                  <span>Receive official volunteer certificate & experience</span>
                </div>
                <div className="flex items-center space-x-3 text-xs font-bold text-brand-dark">
                  <CheckCircle size={18} className="text-brand-green" />
                  <span>Join a compassionate community of change-makers</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              {volunteerSubmitted ? (
                <div className="bg-brand-cream p-8 rounded-2xl text-center space-y-4 border border-brand-green/30">
                  <div className="w-16 h-16 rounded-full bg-brand-green text-white flex items-center justify-center mx-auto">
                    <CheckCircle size={32} />
                  </div>
                  <h4 className="text-xl font-black text-brand-dark">Application Received!</h4>
                  <p className="text-xs text-text-secondary">
                    Thank you for applying to volunteer with Jadu & Art Foundation. Our team will contact you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleVolunteerSubmit} className="bg-brand-cream p-6 sm:p-8 rounded-2xl border border-border space-y-4">
                  <h4 className="text-lg font-black text-brand-dark">Volunteer Application</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-dark mb-1">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={volunteerData.name}
                        onChange={(e) => setVolunteerData({ ...volunteerData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-xs text-text-primary focus:outline-none focus:border-brand-green"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-dark mb-1">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={volunteerData.email}
                        onChange={(e) => setVolunteerData({ ...volunteerData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-xs text-text-primary focus:outline-none focus:border-brand-green"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-dark mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        required
                        value={volunteerData.phone}
                        onChange={(e) => setVolunteerData({ ...volunteerData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-xs text-text-primary focus:outline-none focus:border-brand-green"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-dark mb-1">City / Region</label>
                      <input 
                        type="text" 
                        required
                        value={volunteerData.city}
                        onChange={(e) => setVolunteerData({ ...volunteerData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-xs text-text-primary focus:outline-none focus:border-brand-green"
                        placeholder="Your city"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-dark mb-1">Primary Area of Interest</label>
                    <select
                      value={volunteerData.interest}
                      onChange={(e) => setVolunteerData({ ...volunteerData, interest: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-xs text-text-primary focus:outline-none focus:border-brand-green"
                    >
                      <option value="Education">Education (शिक्षा)</option>
                      <option value="Healthcare">Healthcare (स्वास्थ्य सेवा)</option>
                      <option value="Cow Welfare">Cow Welfare (गौ सेवा)</option>
                      <option value="Disaster Relief">Disaster Relief (आपदा राहत)</option>
                      <option value="General Volunteer">General Operations</option>
                    </select>
                  </div>

                  <button 
                    type="submit"
                    disabled={volunteerLoading}
                    className="w-full bg-brand-orange text-white py-3.5 rounded-xl font-bold text-sm shadow-md hover:bg-[#E05D00] transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send size={16} />
                    <span>{volunteerLoading ? 'Submitting...' : 'SUBMIT APPLICATION'}</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
      )}

      {/* ========================================================================= */}
      {/* 11. TRANSPARENCY (YOUR TRUST MATTERS) */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-20 bg-brand-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <BilingualHeading 
            englishTitle={cms.transparencyTitle || "YOUR TRUST MATTERS"}
            hindiTitle={cms.transparencyHindiTitle || "आपका विश्वास महत्वपूर्ण है"}
            subtitle="Transparent stewardship & community accountability."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
            <div className="bg-brand-cream p-6 rounded-2xl border border-border space-y-2">
              <ShieldCheck size={28} className="text-brand-green mx-auto" />
              <h4 className="text-base font-bold text-brand-dark">Verified Stewardship</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Direct deployment of funds directly into active food, medical, and learning initiatives.
              </p>
            </div>

            <div className="bg-brand-cream p-6 rounded-2xl border border-border space-y-2">
              <Users size={28} className="text-brand-orange mx-auto" />
              <h4 className="text-base font-bold text-brand-dark">Community Impact</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Ground documentary evidence, clear beneficiary updates, and transparent reporting.
              </p>
            </div>

            <div className="bg-brand-cream p-6 rounded-2xl border border-border space-y-2">
              <Heart size={28} className="text-brand-gold mx-auto" />
              <h4 className="text-base font-bold text-brand-dark">Ethical Purpose</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Rooted in genuine human compassion, animal care, and national empowerment.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Link to="/transparency" className="inline-flex items-center space-x-2 text-xs font-bold text-brand-green hover:underline">
              <span>View Foundation Governance & Transparency Page</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. OUR PRAYER SECTION */}
      {/* ========================================================================= */}
      <section className="py-20 bg-brand-cream border-b border-border text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
          
          <BilingualHeading 
            englishTitle={cms.prayerTitle || "OUR PRAYER"}
            hindiTitle={cms.prayerHindiTitle || "हमारी प्रार्थना"}
            subtitle="Universal Well-being & Compassion for All"
          />

          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-brand-gold/40 shadow-xl space-y-6">
            <p className="text-xl sm:text-3xl font-black text-brand-dark hindi-text leading-snug">
              "{cms.prayerText || "ऊपर वाले से सिर्फ एक ही प्रार्थना है — सबका कल्याण करना प्रभु, कोई भी भूखा ना रहे।"}"
            </p>

            <div className="gold-divider max-w-xs mx-auto"></div>

            {/* Founder Message -> Donation Connection */}
            <div className="space-y-2 pt-2">
              <p className="text-sm font-bold text-brand-orange hindi-text">
                "{cms.transitionQuote || "विचार तभी सार्थक है जब वह सेवा में बदलता है।"}"
              </p>
              <p className="text-xs text-text-secondary font-semibold">
                {cms.transitionSubtext || "हमारे कार्य में सहयोग करें"}
              </p>
            </div>

            <div className="pt-4">
              <Link 
                to="/donate" 
                className="bg-brand-orange text-white px-10 py-4 rounded-2xl font-black text-base hover:bg-[#E05D00] transition-all shadow-lg inline-flex items-center space-x-2.5"
              >
                <Heart size={20} className="fill-white" />
                <span>{cms.prayerCta || "DONATE NOW"} — {cms.prayerCtaHindi || "सेवा में अपना योगदान दें"}</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13. FINAL CTA BANNER */}
      {/* ========================================================================= */}
      <section className="py-16 bg-brand-dark text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {cms.finalCtaTitle || "TOGETHER, WE CAN MAKE A DIFFERENCE"}
          </h3>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {cms.finalCtaDescription || "Join hands with Jadu & Art Foundation today to support education, healthcare, cow welfare and humanitarian relief."}
          </p>
          <div className="pt-2">
            <Link 
              to="/donate" 
              className="bg-brand-orange text-white px-10 py-4 rounded-2xl font-extrabold text-base hover:bg-[#E05D00] transition-all shadow-xl inline-flex items-center space-x-2"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>{cms.finalCtaButtonText || "DONATE NOW"}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <LightboxModal 
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        imageSrc={activeImage.src}
        caption={activeImage.caption}
        category={activeImage.category}
      />

    </div>
  );
};

export default Home;
