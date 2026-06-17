import type { AdFormat } from './types';

export const adFormats: AdFormat[] = [
  {
    id: 'display-rectangle',
    name: 'Medium Rectangle',
    type: 'display',
    description: 'Standard IAB in-content and sidebar display — foundation for text-heavy publishers.',
    rpmLiftPct: 0,
  },
  {
    id: 'display-sticky',
    name: 'Sticky Leaderboard',
    type: 'display',
    description: 'Cross-platform adhesive units with viewability-optimized refresh.',
    rpmLiftPct: 6,
  },
  {
    id: 'video-outstream',
    name: 'Outstream Video',
    type: 'video',
    description: 'In-article video without requiring a video-first content strategy.',
    rpmLiftPct: 12,
  },
  {
    id: 'flex-skin',
    name: 'Flex Skin',
    type: 'flex',
    description: 'Code-on-page skin placement — premium SOV, Flex-certified layouts.',
    rpmLiftPct: 18,
  },
  {
    id: 'flex-rail',
    name: 'Flex Rail',
    type: 'flex',
    description: 'Expandable mobile rail — high engagement, programmatic-ready via Magnite.',
    rpmLiftPct: 15,
  },
  {
    id: 'flex-leaderboard',
    name: 'Flex Leaderboard',
    type: 'flex',
    description: 'Cross-platform high-impact leaderboard with collision-safe injection.',
    rpmLiftPct: 14,
  },
  {
    id: 'native-infeed',
    name: 'Native In-Feed',
    type: 'native',
    description: 'Content-matched native units that preserve editorial UX.',
    rpmLiftPct: 8,
  },
];

export const flexFormats = adFormats.filter((f) => f.type === 'flex');
