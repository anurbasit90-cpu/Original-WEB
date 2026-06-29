import { Helmet } from 'react-helmet-async';
import { companyData } from '../constants/companyData';

export default function SEO({ title, description, keywords, lang, canonical, robots, ogImage, twitterImage, alternateLangs }) {
  const fullTitle = `${title} | ${companyData.name}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: companyData.name,
    alternateName: companyData.shortName,
    url: "https://aryatek.co.id",
    logo: "https://aryatek.co.id/logo.png",
    description,
    address: {
      "@type": "PostalAddress",
      streetAddress: companyData.address,
      addressLocality: "Cikarang Selatan",
      addressRegion: "Bekasi",
      postalCode: "17530",
      addressCountry: "ID",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: companyData.phone,
      contactType: "customer service",
      email: companyData.email,
      availableLanguage: ["Indonesian", "English"],
    },
    sameAs: [
      companyData.social.facebook,
      companyData.social.instagram,
      companyData.social.linkedin,
      companyData.social.youtube,
    ],
  };

  return (
    <Helmet>
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {robots && <meta name="robots" content={robots} />}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter Card */}
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}

      {/* Alternate hreflang */}
      {alternateLangs && Array.isArray(alternateLangs) && alternateLangs.map(({ hrefLang, href }) => (
        <link key={hrefLang} rel="alternate" hrefLang={hrefLang} href={href} />
      ))}

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json" id="structured-data">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
