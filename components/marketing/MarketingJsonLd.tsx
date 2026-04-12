import { DCC_MIAMI_LOGO_URL_SCHEMA } from '@/lib/marketing/cdc-brand';
import { getSiteUrl } from '@/lib/marketing/site-url';
import { dccSiteMeta, marketingHomeMeta } from '@/lib/marketing/content';

export function MarketingJsonLd() {
  const base = getSiteUrl();
  const logoUrl = DCC_MIAMI_LOGO_URL_SCHEMA;
  const orgName = dccSiteMeta.organizationName;

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: orgName,
    alternateName: dccSiteMeta.shortName,
    url: base,
    description: marketingHomeMeta.description,
    logo: logoUrl,
    slogan: dccSiteMeta.poweredByLine,
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: orgName,
    url: base,
    description: marketingHomeMeta.description,
    publisher: { '@type': 'Organization', name: orgName, url: base, logo: logoUrl },
  };

  const payload = [organization, website];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
