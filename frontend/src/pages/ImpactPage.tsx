import { useState, useEffect } from 'react';
import BilingualHeading from '../components/BilingualHeading';
import { impactService } from '../services/api';
import { BookOpen, HeartPulse, Leaf, Shield } from 'lucide-react';

const ImpactPage = () => {
  const [metrics, setMetrics] = useState<any[]>([
    { label: 'Children Supported', value: '500+', description: 'Access to textbooks and study kits' },
    { label: 'People Reached', value: '1,200+', description: 'Community medical checkups & care' },
    { label: 'Cows Supported', value: '300+', description: 'Daily green fodder & shelter care' },
    { label: 'Relief Initiatives', value: '15+', description: 'Emergency monsoon relief operations' }
  ]);

  useEffect(() => {
    impactService.getImpactMetrics()
      .then(res => { if (res.data.data?.length) setMetrics(res.data.data); })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-warm-off-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <BilingualHeading 
          englishTitle="OUR IMPACT"
          hindiTitle="हमारा प्रभाव"
          subtitle="Measurable, transparent outcomes created across our 4 core initiative areas."
        />

        {/* Counter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {metrics.map((m, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-light-border shadow-sm text-center space-y-2">
              <div className="text-4xl font-black text-primary-saffron">{m.value}</div>
              <h4 className="text-lg font-bold text-primary-navy uppercase tracking-wider">{m.label}</h4>
              <p className="text-xs text-gray-600">{m.description}</p>
            </div>
          ))}
        </div>

        {/* Deep Dive Breakdown */}
        <div className="space-y-8 mb-16">
          
          <div className="bg-white p-8 rounded-3xl border border-light-border shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-2 flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-navy/10 text-primary-navy flex items-center justify-center">
                <BookOpen size={32} />
              </div>
            </div>
            <div className="md:col-span-10 space-y-2">
              <h3 className="text-xl font-bold text-primary-navy">Educational Empowerment</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                By providing comprehensive stationery, textbooks, geometry tools, and uniform support to remote village schools, we prevent early dropouts and inspire children to continue learning.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-light-border shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-2 flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-green/10 text-primary-green flex items-center justify-center">
                <HeartPulse size={32} />
              </div>
            </div>
            <div className="md:col-span-10 space-y-2">
              <h3 className="text-xl font-bold text-primary-navy">Community Health Checkups</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Free health consultation camps, basic eye screening, diabetes checks, and distribution of essential hygiene kits to elderly individuals and low-income families.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-light-border shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-2 flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-saffron/10 text-primary-saffron flex items-center justify-center">
                <Leaf size={32} />
              </div>
            </div>
            <div className="md:col-span-10 space-y-2">
              <h3 className="text-xl font-bold text-primary-navy">Gau Seva & Animal Nourishment</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Regular supply of fresh green fodder, clean drinking water troughs, and on-call veterinary treatment for cattle rescued from urban street hazards.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-light-border shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-2 flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-navy/10 text-primary-navy flex items-center justify-center">
                <Shield size={32} />
              </div>
            </div>
            <div className="md:col-span-10 space-y-2">
              <h3 className="text-xl font-bold text-primary-navy">Rapid Crisis & Flood Relief</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Emergency response during seasonal floods delivering ration kits (rice, pulses, oil, spices), clean drinking water bottles, tarpaulin sheets, and blankets directly to affected families.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ImpactPage;
