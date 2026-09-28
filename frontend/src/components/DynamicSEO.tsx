import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface DynamicSEOProps {
  title?: string;
  description?: string;
}

const DynamicSEO: React.FC<DynamicSEOProps> = ({ title: customTitle, description: customDescription }) => {
  const { settings } = useSiteSettings();

  const title = customTitle || settings.metaTitle || `${settings.foundationName} | ${settings.hindiTagline || settings.tagline}`;
  const description = customDescription || settings.metaDescription || `${settings.foundationName} works towards social service, education, healthcare and humanitarian relief.`;
  const favicon = settings.favicon || '/favicon.svg';
  const ogImage = settings.ogImage || settings.logo || '/logo.svg';

  useEffect(() => {
    if (favicon) {
      const existingIcons = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
      if (existingIcons.length > 0) {
        existingIcons.forEach(icon => {
          icon.href = favicon;
        });
      } else {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = favicon;
        document.head.appendChild(link);
      }
    }
  }, [favicon]);

  return (
    <Helmet>
      {/* Title */}
      <title>{title}</title>

      {/* Meta description & keywords */}
      <meta name="description" content={description} />
      {settings.metaKeywords && <meta name="keywords" content={settings.metaKeywords} />}
      {settings.author && <meta name="author" content={settings.author} />}

      {/* Favicon Icon */}
      <link rel="icon" type="image/svg+xml" href={favicon} />
      <link rel="shortcut icon" href={favicon} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {settings.siteUrl && <meta property="og:url" content={settings.siteUrl} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {settings.twitterHandle && <meta name="twitter:site" content={settings.twitterHandle} />}

      {/* Google Search Console Verification */}
      {settings.googleSearchConsoleVerification && (
        <meta name="google-site-verification" content={settings.googleSearchConsoleVerification} />
      )}
    </Helmet>
  );
};

export default DynamicSEO;
