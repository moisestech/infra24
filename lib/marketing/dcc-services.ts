/**
 * Data for the homepage “service evidence” gallery: tabs + Embla carousel slides.
 * Images reference `dccHomePhotos` (Cloudinary) so the section ships with real photography.
 */

import { dccHomePhotos } from '@/lib/marketing/dcc-home-photography';

export type DccServiceIconId = 'globe' | 'monitor' | 'presentation' | 'briefcase' | 'network';

export type DccServiceSlide = {
  id: string;
  image: string;
  alt: string;
  caption: string;
  meta?: string;
};

export type DccServiceItem = {
  id: string;
  shortLabel: string;
  title: string;
  descriptor: string;
  description: string;
  iconId: DccServiceIconId;
  accentClass: string;
  panelClass: string;
  badges: string[];
  ctaLabel: string;
  ctaHref: string;
  slides: DccServiceSlide[];
};

export const dccServices: DccServiceItem[] = [
  {
    id: 'website-presence',
    shortLabel: 'WEB',
    title: 'Artist Website & Digital Presence',
    descriptor:
      'Helping artists build clearer, stronger public-facing identities online.',
    description:
      'DCC supports artists with the digital structures that shape first impressions, public understanding, and long-term visibility. This includes websites, portfolio organization, project pages, bios, navigation, and audience-facing clarity. Whether an artist is starting from scratch or refining an existing site, the goal is to make their work easier to discover, understand, and share.',
    iconId: 'globe',
    accentClass: 'text-cyan-600 dark:text-cyan-400',
    panelClass:
      'border-cyan-500/15 bg-gradient-to-br from-cyan-500/[0.07] via-cyan-500/[0.03] to-transparent dark:from-cyan-500/10 dark:via-cyan-500/5',
    badges: ['1:1 Support', 'Website Review', 'Visibility', 'Portfolio Strategy'],
    ctaLabel: 'Explore website support',
    ctaHref: '/what-we-do',
    slides: [
      {
        id: 'web-1',
        image: dccHomePhotos.fabiolaGemsOfObsolescence.src,
        alt: dccHomePhotos.fabiolaGemsOfObsolescence.alt,
        caption: 'Portfolio organization and project-page clarity',
        meta: 'Digital presence / Public-facing',
      },
      {
        id: 'web-2',
        image: dccHomePhotos.fabiolaEwaste2022.src,
        alt: dccHomePhotos.fabiolaEwaste2022.alt,
        caption: 'Artist documentation and installation context online',
        meta: 'Miami / Artist support',
      },
      {
        id: 'web-3',
        image: dccHomePhotos.fabiolaEyeseeyouWatch.src,
        alt: dccHomePhotos.fabiolaEyeseeyouWatch.alt,
        caption: 'Public-facing visibility for practice-led digital work',
        meta: 'Web audit / Strategy',
      },
      {
        id: 'web-4',
        image: dccHomePhotos.fabiolaSurveillanceCutie2024.src,
        alt: dccHomePhotos.fabiolaSurveillanceCutie2024.alt,
        caption: 'Bio, navigation, and homepage feedback in context',
        meta: '1:1 Support / Visibility',
      },
    ],
  },
  {
    id: 'technical-excellence',
    shortLabel: 'TECH',
    title: 'Technical Excellence for Artwork Presentation',
    descriptor:
      'Support for the screens, systems, and setups behind contemporary cultural work.',
    description:
      'DCC helps artists and cultural organizations strengthen the technical side of how work is presented in public. This includes screens, projections, QR systems, livestreams, documentation workflows, digital displays, and installation support. The goal is not just troubleshooting, but helping artists and partners present work with greater clarity, reliability, and confidence.',
    iconId: 'monitor',
    accentClass: 'text-emerald-600 dark:text-emerald-400',
    panelClass:
      'border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.07] via-emerald-500/[0.03] to-transparent dark:from-emerald-500/10 dark:via-emerald-500/5',
    badges: ['Technical Support', 'Installation', 'Display Systems', 'Public Presentation'],
    ctaLabel: 'Explore technical support',
    ctaHref: '/infra24',
    slides: [
      {
        id: 'tech-1',
        image: dccHomePhotos.galleryInteractiveStations.src,
        alt: dccHomePhotos.galleryInteractiveStations.alt,
        caption: 'Technical setup for public-facing digital artwork',
        meta: 'Exhibition support / Miami',
      },
      {
        id: 'tech-2',
        image: dccHomePhotos.digitalDivinities.src,
        alt: dccHomePhotos.digitalDivinities.alt,
        caption: 'Screens, devices, and display workflow support',
        meta: 'Technical systems / Display',
      },
      {
        id: 'tech-3',
        image: dccHomePhotos.touchgrassTreadmillWide.src,
        alt: dccHomePhotos.touchgrassTreadmillWide.alt,
        caption: 'QR, signage, and audience interaction systems',
        meta: 'Public interface / Pilot tool',
      },
      {
        id: 'tech-4',
        image: dccHomePhotos.babyAgi.src,
        alt: dccHomePhotos.babyAgi.alt,
        caption: 'Documentation and presentation planning for exhibitions',
        meta: 'Technical guidance / Planning',
      },
    ],
  },
  {
    id: 'workshops-learning',
    shortLabel: 'LEARN',
    title: 'Workshops & Public Learning',
    descriptor:
      'Hands-on learning for artists, cultural workers, and public-facing creative communities.',
    description:
      'DCC develops workshops that translate digital and technical knowledge into practical tools for artists and cultural organizations. Topics may include visibility, documentation, artist websites, audience engagement, publishing, AI workflows, and digital culture. These sessions are designed to build confidence, share useful systems, and create public learning that extends beyond one-time events.',
    iconId: 'presentation',
    accentClass: 'text-amber-600 dark:text-amber-400',
    panelClass:
      'border-amber-500/15 bg-gradient-to-br from-amber-500/[0.08] via-amber-500/[0.03] to-transparent dark:from-amber-500/10 dark:via-amber-500/5',
    badges: ['Workshops', 'Public Learning', 'Curriculum', 'Community Support'],
    ctaLabel: 'Explore workshops',
    ctaHref: '/workshops',
    slides: [
      {
        id: 'learn-1',
        image: dccHomePhotos.vrHug.src,
        alt: dccHomePhotos.vrHug.alt,
        caption: 'Public learning at the intersection of bodies, screens, and culture',
        meta: 'Public learning / Miami',
      },
      {
        id: 'learn-2',
        image: dccHomePhotos.galleryCrowdOpening.src,
        alt: dccHomePhotos.galleryCrowdOpening.alt,
        caption: 'Shared learning environment with artists and visitors',
        meta: 'Workshop / Community',
      },
      {
        id: 'learn-3',
        image: dccHomePhotos.smartShoppers.src,
        alt: dccHomePhotos.smartShoppers.alt,
        caption: 'Digital culture in the room—documentation and discourse',
        meta: 'Curriculum / Practice',
      },
      {
        id: 'learn-4',
        image: dccHomePhotos.meditationBattlestation.src,
        alt: dccHomePhotos.meditationBattlestation.alt,
        caption: 'Hybrid moments: online aesthetics, offline gathering',
        meta: 'Peer learning / Public program',
      },
    ],
  },
  {
    id: 'opportunity-readiness',
    shortLabel: 'FIELD',
    title: 'Career & Opportunity Readiness',
    descriptor:
      'Helping artists prepare stronger materials for opportunities, applications, and visibility.',
    description:
      'DCC supports artists in preparing the materials that shape how they are read by curators, institutions, residency programs, and public opportunities. This includes portfolio feedback, artist packets, statements, documentation selection, and strategic presentation guidance. The focus is on making artists more legible, confident, and ready to move through the cultural field with stronger materials in hand.',
    iconId: 'briefcase',
    accentClass: 'text-violet-600 dark:text-violet-400',
    panelClass:
      'border-violet-500/15 bg-gradient-to-br from-violet-500/[0.07] via-violet-500/[0.03] to-transparent dark:from-violet-500/10 dark:via-violet-500/5',
    badges: ['Opportunity Support', 'Portfolio Review', 'Applications', 'Artist Materials'],
    ctaLabel: 'Explore opportunity support',
    ctaHref: '/programs/artist-support/digital-audits',
    slides: [
      {
        id: 'field-1',
        image: dccHomePhotos.touchgrassTreadmillFigure.src,
        alt: dccHomePhotos.touchgrassTreadmillFigure.alt,
        caption: 'Portfolio and application readiness in public-facing form',
        meta: '1:1 support / Career',
      },
      {
        id: 'field-2',
        image: dccHomePhotos.galleryInteractiveStations.src,
        alt: dccHomePhotos.galleryInteractiveStations.alt,
        caption: 'Documentation selection and how work reads in space',
        meta: 'Artist materials / Readiness',
      },
      {
        id: 'field-3',
        image: dccHomePhotos.digitalDivinities.src,
        alt: dccHomePhotos.digitalDivinities.alt,
        caption: 'Artist statement and presentation feedback in context',
        meta: 'Writing / Positioning',
      },
      {
        id: 'field-4',
        image: dccHomePhotos.galleryCrowdOpening.src,
        alt: dccHomePhotos.galleryCrowdOpening.alt,
        caption: 'Career guidance aligned with how publics encounter work',
        meta: 'Strategy / Opportunity',
      },
    ],
  },
  {
    id: 'partner-support',
    shortLabel: 'PARTNER',
    title: 'Partner Infrastructure Support',
    descriptor:
      'Lightweight systems for cultural organizations, public programs, and artist-facing workflows.',
    description:
      'DCC supports small cultural organizations and community-facing partners with practical digital systems that improve communication, visibility, artist support, and public interface. This may include event pages, signage, public-facing displays, workflows, outreach structures, and simple tools that help organizations operate more clearly. The goal is to create small but meaningful layers of infrastructure that strengthen public cultural life.',
    iconId: 'network',
    accentClass: 'text-sky-600 dark:text-sky-400',
    panelClass:
      'border-sky-500/15 bg-gradient-to-br from-sky-500/[0.07] via-sky-500/[0.03] to-transparent dark:from-sky-500/10 dark:via-sky-500/5',
    badges: ['Partner Support', 'Public Interface', 'Signage', 'Workflow Design'],
    ctaLabel: 'Explore partner support',
    ctaHref: '/partners',
    slides: [
      {
        id: 'partner-1',
        image: dccHomePhotos.touchgrassTreadmillWide.src,
        alt: dccHomePhotos.touchgrassTreadmillWide.alt,
        caption: 'Public-facing signage and device ecosystems',
        meta: 'Cultural partner / Public interface',
      },
      {
        id: 'partner-2',
        image: dccHomePhotos.digitalDivinities.src,
        alt: dccHomePhotos.digitalDivinities.alt,
        caption: 'Artist-support workflow design for cultural partners',
        meta: 'Systems / Operations',
      },
      {
        id: 'partner-3',
        image: dccHomePhotos.galleryCrowdOpening.src,
        alt: dccHomePhotos.galleryCrowdOpening.alt,
        caption: 'Event visibility and outreach infrastructure',
        meta: 'Public program / Communications',
      },
      {
        id: 'partner-4',
        image: dccHomePhotos.galleryInteractiveStations.src,
        alt: dccHomePhotos.galleryInteractiveStations.alt,
        caption: 'Lightweight digital tools for public cultural programs',
        meta: 'Pilot tool / Support layer',
      },
    ],
  },
];
