import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Target, Eye, Heart, CheckCircle, ShieldCheck, Sparkles, Wind, Droplets, Sun, Sprout, Building, UserCheck } from 'lucide-react';
import BilingualHeading from '../components/BilingualHeading';
import { contentService, teamService } from '../services/api';

const About: React.FC = () => {
  const [aboutData, setAboutData] = useState<any>({
    title: 'ABOUT JADU & ART FOUNDATION',
    hindiTitle: 'जादू एंड आर्ट फाउंडेशन के बारे में',
    subtitle: 'Spiritual Values | Social Impact | A Brighter India',
    storyHeading: 'Our Story & Mission',
    storyContent: 'Jadu & Art Foundation works towards the welfare of people, communities and animals through education, healthcare, cow welfare and humanitarian support.',
    mission: 'To empower underprivileged children with education, provide accessible healthcare, care for cows with dignity, and support communities during emergency crises.',
    vision: 'A compassionate, vibrant society rooted in Seva, Sanskar and Samriddh Bharat.',
    heroImage: 'https://images.pexels.com/photos/36848854/pexels-photo-36848854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  });

  const [cms, setCms] = useState<any>({});
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    contentService.getContentByKey('about')
      .then(res => { if (res.data.data) setAboutData((prev: any) => ({ ...prev, ...res.data.data })); })
      .catch(() => {});

    contentService.getContentByKey('homepage')
      .then(res => { if (res.data.data) setCms(res.data.data); })
      .catch(() => {});

    teamService.getTeamMembers()
      .then(res => { if (res.data.data?.length) setTeamMembers(res.data.data); })
      .catch(() => {});
  }, []);

  const valuesList = [
    { title: 'सेवा', english: 'Service', desc: 'Selfless ground action without intermediary overhead.' },
    { title: 'मानवता', english: 'Humanity', desc: 'Putting humanity above differences of caste, religion and status.' },
    { title: 'संस्कार', english: 'Values & Character', desc: 'Instilling moral education, duty, and respect in society.' },
    { title: 'प्रकृति संरक्षण', english: 'Nature & Environment', desc: 'Protecting clean air, pure water, healthy food, and nature.' },
    { title: 'करुणा', english: 'Compassion', desc: 'Empathy for underprivileged people, animals, and cattle.' },
    { title: 'जिम्मेदारी', english: 'Responsibility', desc: 'Ethical stewardship and long-term community empowerment.' },
    { title: 'पारदर्शिता', english: 'Transparency', desc: 'Complete financial, operational and public accountability.' }
  ];

  return (
    <div className="bg-brand-cream min-h-screen py-12 md:py-20 font-sans text-text-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* 1. HERO */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-brand-white px-4 py-2 rounded-full border border-brand-gold/30 shadow-sm">
            <Sparkles size={14} className="text-brand-orange" />
            <span className="text-xs font-bold text-brand-dark uppercase tracking-widest">
              OFFICIAL FOUNDATION PHILOSOPHY
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-brand-dark tracking-tight">
            {aboutData.title || "ABOUT JADU & ART FOUNDATION"}
          </h1>
          <p className="text-lg font-bold text-brand-orange hindi-text">
            {aboutData.hindiTitle || "जादू एंड आर्ट फाउंडेशन के बारे में"}
          </p>
          <p className="text-base text-text-secondary max-w-2xl mx-auto">
            {aboutData.subtitle || "Spiritual Values | Social Impact | A Brighter India"}
          </p>
        </div>

        {/* 2. ABOUT JADU & ART - STORY */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-border shadow-md grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <h3 className="text-2xl font-black text-brand-dark">
              {aboutData.storyHeading || "Our Story & Purpose"}
            </h3>
            <p className="text-text-secondary text-base leading-relaxed">
              {aboutData.storyContent || "Jadu & Art Foundation works towards the welfare of people, communities and animals through education, healthcare, cow welfare and humanitarian support."}
            </p>
            <div className="inline-block gold-badge">
              Seva • Sanskar • Samriddh Bharat
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-white">
              <img 
                src={aboutData.heroImage || "https://images.pexels.com/photos/36848854/pexels-photo-36848854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"} 
                alt="Jadu & Art Foundation Community Action in India" 
                className="w-full h-[320px] object-cover" 
              />
            </div>
          </div>
        </div>

        {/* 3. FOUNDER'S MESSAGE */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-border shadow-md space-y-8">
          <BilingualHeading 
            englishTitle={cms.founderMessageTitle || "FOUNDER'S MESSAGE"}
            hindiTitle={cms.founderMessageHindiTitle || "संस्थापक का संदेश"}
            subtitle="Philosophy of Life, Inner Purity & Social Elevation"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4">
              <div className="bg-brand-cream p-6 rounded-2xl border border-brand-gold/40 text-center space-y-3">
                {cms.founderImage ? (
                  <img src={cms.founderImage} alt="Founder" className="w-full h-72 object-cover rounded-xl shadow-sm" />
                ) : (
                  <div className="w-full h-72 bg-brand-dark/10 rounded-xl flex flex-col items-center justify-center p-4 text-center border-2 border-dashed border-brand-gold/30">
                    <UserCheck size={36} className="text-brand-green mb-2" />
                    <span className="text-xs font-bold text-brand-dark">FOUNDER PHOTOGRAPH</span>
                    <span className="text-[10px] text-text-secondary">Managed via Cloudinary CMS</span>
                  </div>
                )}
                <h4 className="text-lg font-black text-brand-dark">{cms.founderName || "Founder"}</h4>
                <p className="text-xs font-bold text-brand-orange">JADU & ART FOUNDATION</p>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <p className="text-base font-bold text-brand-dark hindi-text p-4 bg-brand-cream rounded-xl border-l-4 border-brand-gold">
                "{cms.founderGreeting || "पृथ्वी के सभी प्राणियों को मेरा सादर प्रणाम.... आपका हृदय से स्वागत है हमारे फाउंडेशन Jadu & Art Foundation में..."}"
              </p>
              <p className="text-sm text-text-primary hindi-text leading-relaxed">
                {cms.founderP1 || "ईश्वरीय शक्ति, माता-पिता और गुरुजनों की कृपा से जीवन जो मिला है, उसमें आत्मा है और आत्मा के लिए ध्यान करना बहुत जरूरी है।"}
              </p>
              <p className="text-sm text-text-primary hindi-text leading-relaxed">
                {cms.founderP2 || "शरीर को साबुन से धोया जा सकता है, परन्तु आत्मा की सफाई केवल ध्यान से संभव है। ध्यान से आध्यात्मिकता, शांति और ऊर्जा प्राप्त होती है।"}
              </p>
              <p className="text-sm text-text-primary hindi-text leading-relaxed">
                {cms.founderP3 || "जब ध्यान आपके जीवन में उतरेगा, तो परोपकार की भावना मन में आएगी। जन कल्याण के बारे में सोचा जाएगा और समाज कल्याण के लिए एक कदम आगे बढ़ेगा।"}
              </p>
              <div className="p-4 bg-brand-green/10 rounded-xl border border-brand-green/30 text-center">
                <p className="text-lg font-black text-brand-dark hindi-text">
                  "{cms.founderHighlight || "जीवन मिला है — इसे केवल जीना नहीं, सार्थक बनाना है।"}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. JADU PHILOSOPHY */}
        <div className="space-y-8">
          <BilingualHeading 
            englishTitle="JADU PHILOSOPHY"
            hindiTitle="हमारा दर्शन"
            subtitle="J — जीवन | A — आत्मा | D — ध्यान | U — उद्धार"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-border shadow-sm space-y-2">
              <span className="text-3xl font-black text-brand-green">J</span>
              <h4 className="text-xl font-bold text-brand-dark hindi-text">जीवन (Life)</h4>
              <p className="text-xs text-text-secondary leading-relaxed">ईश्वरीय शक्ति से मिला अमूल्य अवसर जिसे सेवा व सार्थक कार्यों में लगाना है।</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-border shadow-sm space-y-2">
              <span className="text-3xl font-black text-brand-gold">A</span>
              <h4 className="text-xl font-bold text-brand-dark hindi-text">आत्मा (Soul)</h4>
              <p className="text-xs text-text-secondary leading-relaxed">शरीर की आंतरिक पवित्रता और चेतन शक्ति जिसका शोधन केवल ध्यान से ही संभव है।</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-border shadow-sm space-y-2">
              <span className="text-3xl font-black text-brand-orange">D</span>
              <h4 className="text-xl font-bold text-brand-dark hindi-text">ध्यान (Meditation)</h4>
              <p className="text-xs text-text-secondary leading-relaxed">आत्मा की सफाई, शांति, ऊर्जा और दूसरों के प्रति करुणा का जाग्रत माध्यम।</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-border shadow-sm space-y-2">
              <span className="text-3xl font-black text-brand-dark">U</span>
              <h4 className="text-xl font-bold text-brand-dark hindi-text">उद्धार (Elevation)</h4>
              <p className="text-xs text-text-secondary leading-relaxed">जन कल्याण, समाज कल्याण और समृद्ध भारत का निर्माण।</p>
            </div>
          </div>
        </div>

        {/* 5. MISSION & VISION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-border shadow-md space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-green text-white flex items-center justify-center">
              <Target size={24} />
            </div>
            <h4 className="text-xl font-black text-brand-dark">OUR MISSION / हमारा उद्देश्य</h4>
            <p className="text-text-secondary text-sm leading-relaxed">
              {aboutData.mission}
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-border shadow-md space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-orange text-white flex items-center justify-center">
              <Eye size={24} />
            </div>
            <h4 className="text-xl font-black text-brand-dark">OUR VISION / हमारी दृष्टि</h4>
            <p className="text-text-secondary text-sm leading-relaxed">
              {aboutData.vision}
            </p>
          </div>
        </div>

        {/* 6. OUR VALUES */}
        <div className="space-y-8">
          <BilingualHeading 
            englishTitle="OUR VALUES"
            hindiTitle="हमारे मूल्य"
            subtitle="Seven Guiding Principles of Jadu & Art Foundation"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {valuesList.map((val, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-2">
                <div className="flex items-center space-x-2 text-brand-orange">
                  <CheckCircle size={18} />
                  <h4 className="text-base font-black text-brand-dark hindi-text">{val.title}</h4>
                </div>
                <p className="text-xs font-bold text-brand-green uppercase tracking-wider">{val.english}</p>
                <p className="text-xs text-text-secondary leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 7. HUMANITY ABOVE DIFFERENCES */}
        <div className="bg-brand-dark text-white p-8 sm:p-12 rounded-3xl text-center space-y-6">
          <h3 className="text-2xl sm:text-3xl font-black hindi-text">
            "उच्च-नीच, जाति, भेदभाव और धर्मों से हमारा संसार नहीं चलेगा। संसार चलेगा मानवता और इंसानियत से।"
          </h3>
          <p className="text-2xl sm:text-4xl font-black text-brand-orange hindi-text">
            "जिओ और जीने दो।"
          </p>
          <p className="text-sm text-gray-300">Live with humanity. Let others live with dignity.</p>
        </div>

        {/* 8. FUTURE GENERATIONS */}
        <div className="space-y-8">
          <BilingualHeading 
            englishTitle="A BETTER FUTURE FOR THE NEXT GENERATION"
            hindiTitle="आने वाली पीढ़ी के लिए बेहतर भविष्य"
            subtitle="Clean Air, Pure Water, Healthy Food & Prosperous Nation"
          />

          <div className="bg-white p-6 rounded-3xl border border-border text-center">
            <p className="text-base font-bold text-brand-dark hindi-text leading-relaxed">
              "मिली है जीवन तो आने वाली पीढ़ी को धन के साथ-साथ अच्छा वातावरण, शुद्ध अनाज, शुद्ध हवा, शुद्ध पानी, प्रकृति से भरा हुआ, नशा-मुक्त और समृद्ध देश दें।"
            </p>
          </div>
        </div>

        {/* 9. PRAYER */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-brand-gold/40 text-center space-y-6 shadow-lg">
          <BilingualHeading 
            englishTitle="OUR PRAYER"
            hindiTitle="हमारी प्रार्थना"
            subtitle="Universal Peace and Compassion"
          />
          <p className="text-xl sm:text-2xl font-black text-brand-dark hindi-text">
            "ऊपर वाले से सिर्फ एक ही प्रार्थना है — सबका कल्याण करना प्रभु, कोई भी भूखा ना रहे।"
          </p>
          <div className="pt-2">
            <Link 
              to="/donate" 
              className="bg-brand-orange text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-[#E05D00] shadow-md inline-flex items-center space-x-2"
            >
              <Heart size={16} className="fill-white" />
              <span>DONATE NOW — सेवा में अपना योगदान दें</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
