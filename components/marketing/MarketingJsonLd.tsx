import { getSiteUrl } from '@/lib/marketing/site-url';
import { cdcSiteMeta, marketingFaq, marketingHomeMeta } from '@/lib/marketing/content';

export function MarketingJsonLd() {
  const base = getSiteUrl();
  const logoUrl = `${base}/file.svg`;
  const orgName = cdcSiteMeta.organizationName;

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: orgName,
    alternateName: cdcSiteMeta.shortName,
    url: base,
    description: marketingHomeMeta.description,
    logo: logoUrl,
    slogan: cdcSiteMeta.poweredByLine,
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: orgName,
    url: base,
    description: marketingHomeMeta.description,
    publisher: { '@type': 'Organization', name: orgName, url: base, logo: logoUrl },
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: marketingFaq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const payload = [organization, website, faqPage];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
