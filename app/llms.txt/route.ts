import { caseStudyPreviews, marketingHomeMeta, navItems } from '@/lib/marketing/content';
import { getSiteUrl } from '@/lib/marketing/site-url';

export const dynamic = 'force-static';

export function GET() {
  const base = getSiteUrl();
  const lines = [
    '# Infra24',
    '',
    marketingHomeMeta.description,
    '',
    '## Key pages',
    ...navItems.map((item) => `- ${base}${item.href} (${item.label})`),
    `- ${base}/knight (Knight pilot packet — hub)`,
    `- ${base}/knight/founders (Founder bios — linked from packet)`,
    `- ${base}/grant/knight-foundation (Miami pilot, Knight Foundation — full narrative)`,
    `- ${base}/platform (platform login / overview)`,
    '',
    '## Case studies',
    ...caseStudyPreviews.map((cs) => `- ${base}/case-studies/${cs.slug} — ${cs.title}`),
    '',
    '## Contact',
    `- ${base}/contact`,
    `- ${base}/audit (Communication Infrastructure Audit)`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
