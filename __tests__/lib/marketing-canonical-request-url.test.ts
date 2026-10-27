import { getDccCanonicalRedirectUrl } from '@/lib/marketing/canonical-request-url';

describe('DCC production hostname canonicalization', () => {
  it('redirects generated Vercel production URLs to the public DCC domain', () => {
    const result = getDccCanonicalRedirectUrl(
      new URL('https://infra24-abc123-moises-sanabrias-projects.vercel.app/network?view=people'),
      'production'
    );

    expect(result?.toString()).toBe('https://www.dcc.miami/network?view=people');
  });

  it('does not redirect the public DCC production domain', () => {
    const result = getDccCanonicalRedirectUrl(
      new URL('https://www.dcc.miami/network'),
      'production'
    );

    expect(result).toBeNull();
  });

  it('does not redirect preview deployments', () => {
    const result = getDccCanonicalRedirectUrl(
      new URL('https://infra24-git-feature-moises-sanabrias-projects.vercel.app/network'),
      'preview'
    );

    expect(result).toBeNull();
  });
});
