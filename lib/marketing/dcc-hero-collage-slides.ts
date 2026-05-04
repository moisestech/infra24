import { dccHomePhotos } from '@/lib/marketing/dcc-home-photography';

/** Anchor for the “Digital culture, in plain language” keyword block on the homepage. */
export const dccHeroPlainLanguageAnchor = '#hero-expanded' as const;

export type DccHeroCollageSlide = {
  readonly id: string;
  /** Short label aligned with homepage keyword vocabulary. */
  readonly term: string;
  readonly blurb: string;
  readonly href: string;
  readonly photo: { readonly src: string; readonly alt: string };
};

/** Homepage hero collage carousel — each slide links deeper into the pilot story. */
export const dccHeroCollageSlides: readonly DccHeroCollageSlide[] = [
  {
    id: 'miami-field',
    term: 'Miami-based',
    blurb:
      "Rooted in Miami's artists, neighborhoods, institutions, and public corridors.",
    href: '/about',
    photo: dccHomePhotos.galleryInteractiveStations,
  },
  {
    id: 'artists',
    term: 'Artists',
    blurb:
      'Support for artists working with software, screens, hardware, networks, and online culture.',
    href: '/for-artists',
    photo: dccHomePhotos.digitalDivinities,
  },
  {
    id: 'workshops',
    term: 'Workshops',
    blurb: 'Hands-on learning that helps artists build digital capacity and public visibility.',
    href: '/workshops',
    photo: dccHomePhotos.moisesArtec2024Talk,
  },
  {
    id: 'public-programs',
    term: 'Public programs',
    blurb: 'Events, talks, clinics, and gatherings that make digital culture accessible.',
    href: '/programs',
    photo: dccHomePhotos.galleryCrowdOpening,
  },
  {
    id: 'civic-facing',
    term: 'Civic-facing',
    blurb: 'Interfaces and programs the public can encounter in real spaces.',
    href: '/projects',
    photo: dccHomePhotos.vrHug,
  },
  {
    id: 'interfaces',
    term: 'Updateable interfaces',
    blurb: 'Signs, maps, kiosks, portals, and workflows designed to stay current.',
    href: '/powered-by-infra24',
    photo: dccHomePhotos.fabiolaSurveillanceCutie2024,
  },
] as const;
