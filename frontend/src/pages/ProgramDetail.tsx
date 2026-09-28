import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, HeartPulse, Leaf, Shield, CheckCircle } from 'lucide-react';
import DonationForm from '../components/DonationForm';
import { workService } from '../services/api';

const ICON_MAP: Record<string, any> = {
  education: BookOpen,
  healthcare: HeartPulse,
  'cow-welfare': Leaf,
  'disaster-relief': Shield,
};

const PROGRAM_DATA: Record<string, any> = {
  education: {
    title: 'Education Initiative',
    hindi: 'शिक्षा पहल',
    icon: BookOpen,
    color: 'bg-primary-navy',
    heroImage: 'https://images.pexels.com/photos/15119089/pexels-photo-15119089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    overview: 'Jadu & Art Foundation believes that every child deserves access to quality education. Our education initiative works across rural and semi-urban communities to break financial barriers and support children with essential learning tools.',
    whyItMatters: 'In many remote areas, families struggle to provide even basic study kits, textbooks, or notebooks. This leads to early school dropouts and restricted opportunities.',
    whatWeDo: [
      'Distribution of comprehensive learning & stationery kits.',
      'Providing textbooks, notebooks, and writing materials.',
      'Organizing community educational support workshops.',
      'Supporting schools with basic infrastructure assistance.'
    ],
    impact: 'Over 500 children supported with essential study resources across multiple local learning initiatives.',
    gallery: [
      'https://images.pexels.com/photos/15119089/pexels-photo-15119089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/20556421/pexels-photo-20556421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    campaignName: 'Education'
  },
  healthcare: {
    title: 'Healthcare Initiative',
    hindi: 'स्वास्थ्य सेवा पहल',
    icon: HeartPulse,
    color: 'bg-primary-green',
    heroImage: 'https://images.pexels.com/photos/14558557/pexels-photo-14558557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    overview: 'Access to basic healthcare is a fundamental right. Our healthcare initiative brings essential medical consultation, health awareness, and medical kits to underserved communities.',
    whyItMatters: 'Lack of local healthcare access often forces families to ignore early symptoms or incur heavy financial burdens for basic treatment.',
    whatWeDo: [
      'Organizing free health checkup and eye examination camps.',
      'Distributing essential medicine kits and hygiene supplies.',
      'Conducting health and nutrition awareness programs.',
      'Assisting vulnerable individuals with emergency medical aid.'
    ],
    impact: 'Over 1,200 individuals reached through community health camps and essential care drives.',
    gallery: [
      'https://images.pexels.com/photos/14558557/pexels-photo-14558557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/14558556/pexels-photo-14558556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    campaignName: 'Healthcare'
  },
  'cow-welfare': {
    title: 'Cow Welfare Initiative',
    hindi: 'गौ सेवा पहल',
    icon: Leaf,
    color: 'bg-primary-saffron',
    heroImage: 'https://images.pexels.com/photos/30147593/pexels-photo-30147593.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    overview: 'Cattle care is an integral part of Indian heritage and rural ecology. Our Gau Seva initiative ensures regular nutrition, safe shelter maintenance, and veterinary medical care for abandoned and injured cattle.',
    whyItMatters: 'Abandoned cattle frequently suffer from malnutrition, plastic ingestion, and lack of basic medical care on streets.',
    whatWeDo: [
      'Daily distribution of fresh green fodder and nutritious feed.',
      'Supporting animal shelters with safe housing infrastructure.',
      'Providing veterinary medical aid and wound treatments.',
      'Setting up clean drinking water troughs across shelters.'
    ],
    impact: 'Over 300 cows supported with daily fodder, shelter care, and medical treatment.',
    gallery: [
      'https://images.pexels.com/photos/30147593/pexels-photo-30147593.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/12220839/pexels-photo-12220839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    campaignName: 'Cow Welfare'
  },
  'disaster-relief': {
    title: 'Disaster Relief Initiative',
    hindi: 'आपदा राहत पहल',
    icon: Shield,
    color: 'bg-primary-navy',
    heroImage: 'https://images.pexels.com/photos/20989105/pexels-photo-20989105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    overview: 'When natural disasters or monsoon floods strike, immediate action saves lives. Our humanitarian relief team mobilizes quickly to provide emergency food packages, clean drinking water, and essential kits.',
    whyItMatters: 'Floods disrupt access to basic food and drinking water within hours, placing vulnerable families at immediate risk.',
    whatWeDo: [
      'Rapid deployment of dry ration and survival food packages.',
      'Distribution of clean drinking water and water purification tabs.',
      'Providing hygiene kits, blankets, and essential tarpaulins.',
      'Assisting local communities with post-disaster recovery.'
    ],
    impact: 'Over 15 emergency relief operations conducted across flood-affected regions.',
    gallery: [
      'https://images.pexels.com/photos/20989105/pexels-photo-20989105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/5909876/pexels-photo-5909876.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    campaignName: 'Disaster Relief'
  }
};

const ProgramDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const initialFallback = PROGRAM_DATA[slug || 'education'] || PROGRAM_DATA.education;
  const [program, setProgram] = useState<any>(initialFallback);

  useEffect(() => {
    if (!slug) return;
    workService.getWorkBySlug(slug)
      .then((res) => {
        if (res.data.success && res.data.data) {
          const item = res.data.data;
          setProgram({
            title: item.title,
            hindi: item.hindiTitle || item.title,
            icon: ICON_MAP[item.slug] || BookOpen,
            color: item.slug === 'healthcare' ? 'bg-primary-green' : item.slug === 'cow-welfare' ? 'bg-primary-saffron' : 'bg-primary-navy',
            heroImage: item.heroImage || item.image || initialFallback.heroImage,
            overview: item.overview || item.summary || initialFallback.overview,
            whyItMatters: item.whyItMatters || item.details || initialFallback.whyItMatters,
            whatWeDo: Array.isArray(item.whatWeDo) && item.whatWeDo.length > 0 ? item.whatWeDo : initialFallback.whatWeDo,
            impact: item.impact || initialFallback.impact,
            gallery: Array.isArray(item.gallery) && item.gallery.length > 0 ? item.gallery : initialFallback.gallery,
            campaignName: item.title
          });
        }
      })
      .catch(() => {});
  }, [slug]);
  const Icon = program.icon;

  return (
    <div className="bg-warm-off-white min-h-screen">
      
      {/* Hero */}
      <section className="relative bg-primary-navy text-white py-16 lg:py-24 overflow-hidden border-b-4 border-primary-saffron">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-primary-saffron text-white text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
                <span>{program.hindi}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                {program.title}
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
                {program.overview}
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
                <img 
                  src={program.heroImage} 
                  alt={program.title} 
                  className="w-full h-[320px] object-cover" 
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column - Detailed Breakdown */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Why It Matters */}
            <div className="bg-white p-8 rounded-3xl border border-light-border shadow-sm space-y-4">
              <h3 className="text-2xl font-bold text-primary-navy flex items-center space-x-2">
                <Icon className="text-primary-saffron" size={24} />
                <span>Why It Matters</span>
              </h3>
              <p className="text-gray-700 leading-relaxed font-normal text-base">
                {program.whyItMatters}
              </p>
            </div>

            {/* What We Do */}
            <div className="bg-white p-8 rounded-3xl border border-light-border shadow-sm space-y-4">
              <h3 className="text-2xl font-bold text-primary-navy">What We Do</h3>
              <div className="space-y-3">
                {program.whatWeDo.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-start space-x-3 text-gray-700">
                    <CheckCircle className="text-primary-green shrink-0 mt-1" size={18} />
                    <span className="text-base font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Impact */}
            <div className="bg-primary-navy text-white p-8 rounded-3xl space-y-3 shadow-md border-l-8 border-primary-saffron">
              <div className="text-xs uppercase tracking-widest text-primary-saffron font-bold">KEY INITIATIVE IMPACT</div>
              <p className="text-xl font-bold leading-snug">
                {program.impact}
              </p>
            </div>

            {/* High-res Photos */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-primary-navy">Initiative Visuals</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {program.gallery.map((img: string, idx: number) => (
                  <div key={idx} className="rounded-2xl overflow-hidden h-48 border border-light-border shadow-sm">
                    <img src={img} alt={`${program.title} photo`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column - Dedicated Donation Form */}
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <DonationForm defaultCampaign={program.campaignName} />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ProgramDetail;
