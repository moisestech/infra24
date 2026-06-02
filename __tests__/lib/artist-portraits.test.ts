import {
  artistPortraitRotationPool,
  inferPortraitFrameFromUrl,
  primaryArtistPortraitUrl,
  resolveArtistPortraits,
  selectArtistPortraitAt,
  spotlightLayoutForFrame,
} from '@/lib/display/artist-portraits';

describe('artist-portraits', () => {
  it('infers frame from Cloudinary public id', () => {
    expect(
      inferPortraitFrameFromUrl(
        'https://res.cloudinary.com/x/upload/v1/foo_portrait-full-width-landscape-1.jpg'
      )
    ).toBe('full_width_landscape');
    expect(
      inferPortraitFrameFromUrl(
        'https://res.cloudinary.com/x/upload/v1/bar_portrait-full-height-vertical_z.jpg'
      )
    ).toBe('full_height_vertical');
  });

  it('reads structured portraits and legacy artwork_url', () => {
    const portraits = resolveArtistPortraits({
      portraits: {
        full_width_landscape: ['https://cdn.example/a.jpg'],
        full_height_vertical: ['https://cdn.example/b.jpg'],
      },
      artwork_url: 'https://cdn.example/legacy-landscape.jpg',
    });
    expect(portraits.full_width_landscape).toContain('https://cdn.example/a.jpg');
    expect(portraits.full_height_vertical).toContain('https://cdn.example/b.jpg');
    expect(primaryArtistPortraitUrl(portraits)).toBe('https://cdn.example/a.jpg');
  });

  it('prefers tall portraits on portrait kiosks', () => {
    const meta = {
      portraits: {
        full_width_landscape: ['https://cdn.example/l.jpg'],
        full_height_vertical: ['https://cdn.example/v.jpg'],
      },
    };
    expect(selectArtistPortraitAt(meta, 0, 'portrait')?.url).toBe('https://cdn.example/v.jpg');
    expect(selectArtistPortraitAt(meta, 0, 'landscape')?.url).toBe('https://cdn.example/l.jpg');
  });

  it('rotates through multiple landscapes', () => {
    const meta = {
      portraits: {
        full_width_landscape: ['https://cdn.example/1.jpg', 'https://cdn.example/2.jpg'],
      },
    };
    const pool = artistPortraitRotationPool(resolveArtistPortraits(meta), 'landscape');
    expect(pool.urls).toHaveLength(2);
    expect(selectArtistPortraitAt(meta, 1, 'landscape')?.url).toBe('https://cdn.example/2.jpg');
  });

  it('maps vertical frames to hero layout', () => {
    expect(spotlightLayoutForFrame('full_height_vertical')).toBe('hero_vertical');
    expect(spotlightLayoutForFrame('full_width_landscape')).toBe('dual');
  });
});
