import {
  artistArtworkUrl,
  artistHeadshotUrl,
  parseStudioSortKey,
  sortStudioResidents,
  spotlightDisplayBio,
  spotlightDurationMs,
} from '@/lib/display/artist-spotlight';
import type { ArtistGridItem } from '@/components/display/DisplayGrid';

describe('artist-spotlight', () => {
  const sample = (partial: Partial<ArtistGridItem> & Pick<ArtistGridItem, 'id' | 'name'>): ArtistGridItem =>
    ({
      bio: null,
      avatar_url: null,
      profile_image: null,
      studio_type: null,
      studio_number: null,
      metadata: null,
      ...partial,
    }) as ArtistGridItem;

  it('sorts residents by studio number', () => {
    const sorted = sortStudioResidents([
      sample({ id: '2', name: 'B', studio_number: '210' }),
      sample({ id: '1', name: 'A', studio_number: '101' }),
    ]);
    expect(sorted.map((a) => a.id)).toEqual(['1', '2']);
    expect(parseStudioSortKey('204A')).toBe(204);
  });

  it('reads headshot and artwork from metadata', () => {
    const item = sample({
      id: '1',
      name: 'Ana',
      metadata: {
        headshot_url: 'https://cdn.example/head.jpg',
        artwork_url: 'https://cdn.example/work.jpg',
      },
    });
    expect(artistHeadshotUrl(item)).toBe('https://cdn.example/head.jpg');
    expect(artistArtworkUrl(item)).toBe('https://cdn.example/work.jpg');
  });

  it('prefers full-height vertical on portrait kiosks', () => {
    const item = sample({
      id: '2',
      name: 'Sepideh',
      metadata: {
        headshot_url: 'https://cdn.example/head.jpg',
        portraits: {
          full_width_landscape: ['https://cdn.example/land.jpg'],
          full_height_vertical: ['https://cdn.example/tall.jpg'],
        },
      },
    });
    expect(artistArtworkUrl(item, 'portrait')).toBe('https://cdn.example/tall.jpg');
    expect(artistArtworkUrl(item, 'landscape')).toBe('https://cdn.example/land.jpg');
  });

  it('computes spotlight segment duration from rotation interval', () => {
    expect(spotlightDurationMs(13, 7000)).toBe(91_000);
  });

  it('hides seeded studio-resident boilerplate bios on spotlight slides', () => {
    expect(spotlightDisplayBio('Studio 204 · Oolite Arts studio resident.')).toBeNull();
    expect(spotlightDisplayBio('Painter working in mixed media.')).toBe(
      'Painter working in mixed media.'
    );
  });
});
