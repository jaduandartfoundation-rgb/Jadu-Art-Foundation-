import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, HeartPulse, Leaf, Shield, ArrowRight } from 'lucide-react';
import BilingualHeading from '../components/BilingualHeading';
import { workService } from '../services/api';

const ICON_MAP: Record<string, any> = {
  education: BookOpen,
  healthcare: HeartPulse,
  'cow-welfare': Leaf,
  'disaster-relief': Shield,
};

const DEFAULT_WORKS = [
  {
    slug: 'education',
    title: 'Education',
    hindi: 'शिक्षा',
    icon: BookOpen,
    color: 'bg-primary-navy',
    badgeColor: 'bg-primary-navy/10 text-primary-navy',
    image: 'https://images.pexels.com/photos/15119089/pexels-photo-15119089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    summary: 'Supporting children and communities through educational resources, learning assistance and school supplies.',
    details: 'Education creates sustainable opportunities. Our efforts provide textbooks, stationery, uniform support, and guidance to underprivileged rural students.'
  },
  {
    slug: 'healthcare',
    title: 'Healthcare',
    hindi: 'स्वास्थ्य सेवा',
    icon: HeartPulse,
    color: 'bg-primary-green',
    badgeColor: 'bg-primary-green/10 text-primary-green',
    image: 'https://images.pexels.com/photos/14558557/pexels-photo-14558557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    summary: 'Supporting access to essential healthcare, medical assistance and community health checkup camps.',
    details: 'Preventive healthcare saves lives. We organize periodic medical camps, distribute essential medicines, and offer emergency healthcare support.'
  },
  {
    slug: 'cow-welfare',
    title: 'Cow Welfare',
    hindi: 'गौ सेवा',
    icon: Leaf,
    color: 'bg-primary-saffron',
    badgeColor: 'bg-primary-saffron/10 text-primary-saffron',
    image: 'https://images.pexels.com/photos/30147593/pexels-photo-30147593.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    summary: 'Supporting cow feeding, safe shelter care and veterinary assistance for abandoned cattle.',
    details: 'Cattle play a fundamental role in rural ecology. Our Gau Seva initiative supplies daily nutritious green fodder, clean water, and medical care.'
  },
  {
    slug: 'disaster-relief',
    title: 'Disaster Relief',
    hindi: 'आपदा राहत',
    icon: Shield,
    color: 'bg-primary-navy',
    badgeColor: 'bg-primary-navy/10 text-primary-navy',
    image: 'https://images.pexels.com/photos/20989105/pexels-photo-20989105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    summary: 'Standing with communities affected by monsoon floods, natural disasters and emergencies.',
    details: 'Immediate relief during crises saves lives. We deliver emergency food ration packages, clean drinking water, hygiene kits, and temporary shelter support.'
  }
];

const OurWork = () => {
  const [initiatives, setInitiatives] = useState<any[]>(DEFAULT_WORKS);

  useEffect(() => {
    workService.getWorks()
      .then((res) => {
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          const mapped = res.data.data.map((item: any) => ({
            slug: item.slug,
            title: item.title,
            hindi: item.hindiTitle || item.title,
            icon: ICON_MAP[item.slug] || BookOpen,
            color: item.slug === 'healthcare' ? 'bg-primary-green' : item.slug === 'cow-welfare' ? 'bg-primary-saffron' : 'bg-primary-navy',
            badgeColor: item.slug === 'healthcare' ? 'bg-primary-green/10 text-primary-green' : item.slug === 'cow-welfare' ? 'bg-primary-saffron/10 text-primary-saffron' : 'bg-primary-navy/10 text-primary-navy',
            image: item.heroImage || item.image,
            summary: item.summary || item.overview,
            details: item.details || item.whyItMatters
          }));
          setInitiatives(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="py-16 bg-warm-off-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <BilingualHeading 
          englishTitle="OUR INITIATIVES"
          hindiTitle="हमारे कार्य"
          subtitle="Four core pillars of practical social action serving people, communities and animals."
        />

        <div className="space-y-12">
          {initiatives.map((item, idx) => {
            const Icon = item.icon;
            const isEven = idx % 2 === 0;

            return (
              <div 
                key={item.slug} 
                className="bg-white rounded-3xl overflow-hidden border border-light-border shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12"
              >
                <div className={`lg:col-span-5 relative ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full min-h-[300px] object-cover" 
                  />
                  <span className={`absolute top-4 left-4 ${item.color} text-white font-bold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider`}>
                    {item.hindi}
                  </span>
                </div>

                <div className={`lg:col-span-7 p-8 md:p-12 flex flex-col justify-between ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.badgeColor}`}>
                        <Icon size={24} />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-extrabold text-primary-navy">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-gray-700 font-medium text-lg leading-relaxed">
                      {item.summary}
                    </p>

                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.details}
                    </p>
                  </div>

                  <div className="pt-6">
                    <Link 
                      to={`/our-work/${item.slug}`} 
                      className="inline-flex items-center space-x-2 bg-primary-navy text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary-saffron transition-colors shadow-md"
                    >
                      <span>Explore Initiative Details</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default OurWork;
