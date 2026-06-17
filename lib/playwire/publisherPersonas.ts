import type { PublisherPersona } from './types';

export const publisherPersonas: PublisherPersona[] = [
  {
    id: 'studyHub',
    name: 'StudyHub',
    vertical: 'Education',
    monthlyPageviews: 2_100_000,
    primaryFormats: ['display', 'native'],
    currentStack: 'adsense',
    painPoints: ['AdSense ceiling on display-heavy pages', 'No header bidding visibility', 'Delayed reporting'],
    description: 'SparkNotes-style study guides — text-heavy, minimal video, high session depth.',
  },
  {
    id: 'arenaNews',
    name: 'Arena News Group',
    vertical: 'News & media',
    monthlyPageviews: 8_000_000,
    primaryFormats: ['display', 'flex', 'native'],
    currentStack: 'header-bidding',
    painPoints: ['Fragmented ad stack', 'Flex/high-impact not programmatic-ready', 'Yield ops bandwidth'],
    description: 'Multi-brand news portfolio — premium inventory, direct sales potential, editorial trust.',
  },
  {
    id: 'gameGrid',
    name: 'GameGrid',
    vertical: 'Gaming community',
    monthlyPageviews: 4_500_000,
    primaryFormats: ['display', 'video', 'flex'],
    currentStack: 'header-bidding',
    painPoints: ['Fill rate volatility', 'Video + display format collision', 'Mobile viewability gaps'],
    description: 'Community-driven gaming site — mixed display, outstream video, and high-impact units.',
  },
];

export function getPublisherPersona(id: string): PublisherPersona | undefined {
  return publisherPersonas.find((p) => p.id === id);
}
