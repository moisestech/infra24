import { DEFAULT_DCC_SITE_URL, getSiteUrl } from '@/lib/marketing/site-url';

const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const originalVercelUrl = process.env.VERCEL_URL;
const originalVercelEnv = process.env.VERCEL_ENV;

afterEach(() => {
  if (originalSiteUrl === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;

  if (originalVercelUrl === undefined) delete process.env.VERCEL_URL;
  else process.env.VERCEL_URL = originalVercelUrl;

  if (originalVercelEnv === undefined) delete process.env.VERCEL_ENV;
  else process.env.VERCEL_ENV = originalVercelEnv;
});

describe('DCC canonical site URL', () => {
  it('uses the explicit site URL and strips a trailing slash', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://www.dcc.miami/';
    expect(getSiteUrl()).toBe('https://www.dcc.miami');
  });

  it('never promotes a Vercel deployment hostname to the canonical public origin', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.VERCEL_ENV = 'production';
    process.env.VERCEL_URL = 'infra24-example-moises-sanabrias-projects.vercel.app';

    expect(getSiteUrl()).toBe(DEFAULT_DCC_SITE_URL);
    expect(getSiteUrl()).toBe('https://www.dcc.miami');
  });
});
