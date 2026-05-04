import type { Metadata } from 'next';
import {
  Building2,
  CalendarDays,
  DoorOpen,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Palette,
  Rocket,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import { PageHero, Section, CardGrid, type CardGridItem, type PartnerCardAmbient } from '@/components/marketing/cdc';
import { getCdcBreadcrumbs, getCdcPageByPath, getPartnerSegmentSlugs } from '@/lib/cdc/routes';
import type { MarketingGradientId } from '@/lib/marketing/marketing-gradients';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const path = '/partners';

const DCC_PARTNER_INBOX = 'dccmiami@gmail.com';

export const metadata: Metadata = cdcPageMetadata(path);

function partnerInterestMailto(title: string, slug: string): string {
  const subject = `DCC partnership — ${title}`;
  const body = `Hi DCC,\n\nI'm interested in learning more about: ${title}\n(Partners · /partners/${slug})\n\n`;
  return `mailto:${DCC_PARTNER_INBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const PARTNER_CARD_VISUAL: Record<
  string,
  { icon: LucideIcon; gradientId: MarketingGradientId; alt: string; ambient: PartnerCardAmbient }
> = {
  'cultural-organizations': {
    icon: Landmark,
    gradientId: 'stackTeal',
    alt: 'Teal gradient cover for cultural organizations.',
    ambient: { hueA: 168, hueB: 198, hueC: 152, gridAngle: 96, gridPeriod: 10 },
  },
  artists: {
    icon: Palette,
    gradientId: 'fieldViolet',
    alt: 'Violet gradient cover for artists.',
    ambient: { hueA: 285, hueB: 320, hueC: 265, gridAngle: 118, gridPeriod: 9 },
  },
  'schools-and-education': {
    icon: GraduationCap,
    gradientId: 'signalCyan',
    alt: 'Cyan gradient cover for schools and education.',
    ambient: { hueA: 188, hueB: 225, hueC: 205, gridAngle: 72, gridPeriod: 12 },
  },
  'civic-and-neighborhood': {
    icon: UsersRound,
    gradientId: 'roseMist',
    alt: 'Rose mist gradient cover for civic and neighborhood partners.',
    ambient: { hueA: 348, hueB: 32, hueC: 12, gridAngle: 108, gridPeriod: 11 },
  },
  'space-partners': {
    icon: Building2,
    gradientId: 'warmAmber',
    alt: 'Warm amber gradient cover for space partners.',
    ambient: { hueA: 42, hueB: 88, hueC: 28, gridAngle: 84, gridPeriod: 13 },
  },
  'host-a-workshop': {
    icon: CalendarDays,
    gradientId: 'columnCoral',
    alt: 'Coral gradient cover for hosting a workshop.',
    ambient: { hueA: 22, hueB: 48, hueC: 8, gridAngle: 126, gridPeriod: 8 },
  },
  'host-a-pilot': {
    icon: Rocket,
    gradientId: 'pulseMagenta',
    alt: 'Magenta gradient cover for hosting a pilot.',
    ambient: { hueA: 318, hueB: 275, hueC: 340, gridAngle: 63, gridPeriod: 10 },
  },
  'become-a-space-partner': {
    icon: DoorOpen,
    gradientId: 'meshSlate',
    alt: 'Slate mesh gradient cover for space partner onboarding.',
    ambient: { hueA: 215, hueB: 245, hueC: 195, gridAngle: 99, gridPeriod: 14 },
  },
  'sponsor-a-program': {
    icon: HeartHandshake,
    gradientId: 'indigoHaze',
    alt: 'Indigo gradient cover for program sponsors.',
    ambient: { hueA: 258, hueB: 292, hueC: 230, gridAngle: 111, gridPeriod: 9 },
  },
};

export default function PartnersIndexPage() {
  const items: CardGridItem[] = getPartnerSegmentSlugs()
    .map((slug) => {
      const def = getCdcPageByPath(`/partners/${slug}`);
      if (!def) return null;
      const visual = PARTNER_CARD_VISUAL[slug];
      const href = partnerInterestMailto(def.title, slug);
      const base: CardGridItem = {
        href,
        title: def.title,
        description: def.description,
      };
      if (!visual) return base;
      return {
        ...base,
        icon: visual.icon,
        cover: { gradientId: visual.gradientId, alt: visual.alt },
        partnerAmbient: visual.ambient,
      };
    })
    .filter(Boolean) as CardGridItem[];

  return (
    <>
      <section className="cdc-mesh-hero-bg cdc-webcore-hero-shell scroll-mt-14 border-b border-[var(--cdc-border)]">
        <PageHero
          surface="mesh"
          eyebrow="Partners"
          title="Collaborate on pilots and programs"
          description="We work with cultural organizations, artists, schools, civic partners, and space sponsors to host workshops, public interfaces, and Miami-focused experiments."
          breadcrumbs={getCdcBreadcrumbs(path)}
        />
      </section>
      <Section className="border-b border-[var(--cdc-border)] bg-[#fafafa] pb-16 dark:border-neutral-800 dark:bg-neutral-950">
        <CardGrid items={items} variant="partners" />
      </Section>
    </>
  );
}
