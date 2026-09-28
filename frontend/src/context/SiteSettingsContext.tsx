import React, { createContext, useContext, useEffect, useState } from 'react';
import { settingsService } from '../services/api';

export interface SiteSettingsType {
  foundationName: string;
  logo: string;
  darkLogo: string;
  favicon: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  siteUrl: string;
  twitterHandle: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  whatsappNumber?: string;
  author: string;
  googleAnalyticsId: string;
  googleSearchConsoleVerification: string;
  officialEmail: string;
  primaryGreen: string;
  darkTeal: string;
  orange: string;
  gold: string;
  tagline: string;
  hindiTagline: string;
  visibleSections?: {
    heroSection?: boolean;
    impactStrip?: boolean;
    aboutSection?: boolean;
    initiativesSection?: boolean;
    workSection?: boolean;
    founderSection?: boolean;
    lifePhilosophySection?: boolean;
    futureGenerationsSection?: boolean;
    humanitySection?: boolean;
    storiesSection?: boolean;
    gallerySection?: boolean;
    testimonialsSection?: boolean;
    volunteerSection?: boolean;
  };
  donationPopup?: {
    enabled?: boolean;
    title?: string;
    hindiTitle?: string;
    description?: string;
    image?: string;
    buttonText?: string;
    delay?: number;
    cooldown?: number;
    defaultAmount?: number;
  };
  // Legal & Organization Details
  legalContactEmail?: string;
  lastUpdatedDate?: string;
  registeredAddress?: string;
  registrationType?: string;
  registrationNumber?: string;
  pan?: string;
  status12A?: string;
  status80G?: string;
  fcraStatus?: string;
  otherRegistrations?: string;
  privacyPolicyCustomText?: string;
  termsCustomText?: string;
  refundPolicyCustomText?: string;
}

const defaultSettings: SiteSettingsType = {
  foundationName: 'Jadu & Art Foundation',
  logo: '/logo.svg',
  darkLogo: '/logo-horizontal.svg',
  favicon: '/favicon.svg',
  metaTitle: 'Jadu & Art Foundation | Seva • Sanskar • Samriddh Bharat',
  metaDescription: 'Jadu & Art Foundation works towards education, healthcare, cow welfare and humanitarian support while promoting values of service, humanity and a better future for India.',
  metaKeywords: 'Jadu and Art, NGO, Social Impact, Education, Healthcare, Cow Welfare, Charity, India',
  ogImage: '/logo.svg',
  siteUrl: 'https://jaduandart.org',
  twitterHandle: '@jaduandart',
  facebookUrl: '',
  instagramUrl: '',
  youtubeUrl: '',
  linkedinUrl: '',
  whatsappNumber: '',
  author: 'Jadu & Art Foundation',
  googleAnalyticsId: '',
  googleSearchConsoleVerification: '',
  officialEmail: 'jaduandartfoundation@gmail.com',
  primaryGreen: '#006B3C',
  darkTeal: '#063F36',
  orange: '#F47B20',
  gold: '#C99020',
  tagline: 'Spiritual Values | Social Impact | A Brighter India',
  hindiTagline: 'Seva • Sanskar • Samriddh Bharat',
  legalContactEmail: 'jaduandartfoundation@gmail.com',
  lastUpdatedDate: 'September 26, 2026',
  registeredAddress: '[Registered Office Address to be added]',
  registrationType: '[Registration Type to be added]',
  registrationNumber: '[Registration Number to be added]',
  pan: '[PAN to be added]',
  status12A: '[12A Status to be added]',
  status80G: '[80G Status to be added]',
  fcraStatus: '[FCRA Status to be added]',
  otherRegistrations: '[Other verified registrations to be added]',
  privacyPolicyCustomText: '',
  termsCustomText: '',
  refundPolicyCustomText: '',
  visibleSections: {
    heroSection: true,
    impactStrip: true,
    aboutSection: true,
    initiativesSection: true,
    workSection: true,
    founderSection: true,
    lifePhilosophySection: true,
    futureGenerationsSection: true,
    humanitySection: true,
    storiesSection: true,
    gallerySection: true,
    testimonialsSection: true,
    volunteerSection: true
  }
};

const getInitialSettings = (): SiteSettingsType => {
  try {
    const cached = localStorage.getItem('cached_site_settings');
    if (cached) {
      return { ...defaultSettings, ...JSON.parse(cached) };
    }
  } catch (e) {}
  return defaultSettings;
};

interface SiteSettingsContextType {
  settings: SiteSettingsType;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: defaultSettings,
  loading: false,
  refreshSettings: async () => {},
});

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettingsType>(getInitialSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await settingsService.getSettings();
      if (res.data && res.data.data) {
        const merged = { ...defaultSettings, ...res.data.data };
        setSettings(merged);
        localStorage.setItem('cached_site_settings', JSON.stringify(merged));
      }
    } catch (err) {
      console.warn('Could not fetch site settings, using default settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
