import {
  announcementImageForContext,
  collectAnnouncementImageCandidates,
  inferImageShapeFromUrl,
} from '@/lib/display/announcement-images';

const LANDSCAPE_HERO =
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1779991700/HERO_IMAGES_DUVAL_RTQ-1500x630_yhshus.png';
const PORTRAIT_POSTER =
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1775570009/april-Oolite-Arts-Conversations_fo6v2s.jpg';

describe('announcement-images', () => {
  it('infers landscape from 1500x630 hero filenames', () => {
    expect(inferImageShapeFromUrl(LANDSCAPE_HERO)).toBe('landscape');
  });

  it('infers square from 705x705 headshots', () => {
    expect(
      inferImageShapeFromUrl(
        'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993350/Diego-Gabaldon-705x705_nfpjhw.jpg'
      )
    ).toBe('square');
  });

  it('prefers landscape for list/card when both shapes exist', () => {
    const announcement = {
      image_url: PORTRAIT_POSTER,
      metadata: {
        images: {
          landscape: LANDSCAPE_HERO,
          portrait: PORTRAIT_POSTER,
        },
      },
      media: [],
    };

    expect(announcementImageForContext(announcement, 'list').url).toBe(LANDSCAPE_HERO);
    expect(announcementImageForContext(announcement, 'card').url).toBe(LANDSCAPE_HERO);
    expect(announcementImageForContext(announcement, 'display').url).toBe(PORTRAIT_POSTER);
  });

  it('collects explicit, image_url, and portrait metadata', () => {
    const candidates = collectAnnouncementImageCandidates({
      image_url: LANDSCAPE_HERO,
      metadata: {
        images: { portrait: PORTRAIT_POSTER },
        portraits: {
          full_width_landscape: ['https://cdn.example/extra-landscape.jpg'],
        },
      },
      media: [],
    });

    expect(candidates.map((c) => c.url)).toEqual(
      expect.arrayContaining([LANDSCAPE_HERO, PORTRAIT_POSTER, 'https://cdn.example/extra-landscape.jpg'])
    );
  });

  it('Duval June 25 record picks landscape hero for list when configured', () => {
    const duval = {
      title: 'Edouard Duval-Carrié in Conversation with Guillermina De Ferrari',
      image_url: PORTRAIT_POSTER,
      metadata: {
        images: {
          landscape: LANDSCAPE_HERO,
          portrait: PORTRAIT_POSTER,
        },
        display_takeover: true,
      },
      media: [],
    };

    expect(announcementImageForContext(duval, 'list')).toEqual({
      url: LANDSCAPE_HERO,
      shape: 'landscape',
    });
  });
});
