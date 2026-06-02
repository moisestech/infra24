import {
  getTakeoverMode,
  hasDisplayTakeover,
  isTakeoverMinimal,
  isVideoMediaUrl,
  resolveTakeoverDisplayCopy,
  resolveTakeoverOverlayConfig,
  resolveTakeoverQrMode,
  resolveTakeoverMedia,
  shouldShowTakeoverAppQr,
  shouldShowTakeoverViewDetails,
  sortAnnouncementsForSmartSignCarousel,
  getDisplayPinOrder,
  buildTakeoverAnnouncementProxy,
  excludeFromSmartSignCarousel,
  isCinematicSegmentAnnouncement,
  resolveCinematicSegmentTakeover,
} from '@/lib/display/announcement-display-mode';
import {
  buildDisplayMetadataPayload,
  displayMetadataFormFromAnnouncement,
} from '@/lib/display/announcement-display-metadata-form';
import {
  isAnnouncementEvergreenForDisplay,
  isAnnouncementRelevantForDisplay,
} from '@/lib/display/announcement-month';
import type { Announcement } from '@/types/announcement';

function ann(partial: Partial<Announcement> & Pick<Announcement, 'id' | 'title'>): Announcement {
  return {
    org_id: 'org-1',
    author_clerk_id: 'user-1',
    media: [],
    tags: [],
    status: 'published',
    priority: 0,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...partial,
  };
}

describe('announcement-display-mode', () => {
  it('detects display takeover flags', () => {
    expect(hasDisplayTakeover({ display_takeover: true })).toBe(true);
    expect(hasDisplayTakeover({ image_only: true })).toBe(true);
    expect(hasDisplayTakeover({})).toBe(false);
  });

  it('resolves takeover mode with legacy flags', () => {
    expect(getTakeoverMode({ display_takeover: true })).toBe('asset');
    expect(getTakeoverMode({ display_takeover: true, takeover_minimal: false })).toBe('overlay');
    expect(getTakeoverMode({ display_takeover: true, takeover_mode: 'overlay' })).toBe('overlay');
    expect(isTakeoverMinimal({ display_takeover: true, takeover_mode: 'overlay' })).toBe(false);
  });

  it('resolves image takeover media', () => {
    expect(
      resolveTakeoverMedia(
        ann({
          id: '1',
          title: 'Poster',
          image_url: 'https://cdn.example/poster.jpg',
          metadata: { display_takeover: true, media_type: 'image' },
        })
      )
    ).toEqual({ kind: 'image', url: 'https://cdn.example/poster.jpg' });
  });

  it('resolves video takeover from metadata.video_url', () => {
    expect(
      resolveTakeoverMedia(
        ann({
          id: '2',
          title: 'Reel',
          metadata: {
            display_takeover: true,
            media_type: 'video',
            video_url: 'https://cdn.example/loop.mp4',
          },
        })
      )
    ).toEqual({ kind: 'video', url: 'https://cdn.example/loop.mp4' });
  });

  it('resolves video from media[] when flagged', () => {
    expect(
      resolveTakeoverMedia(
        ann({
          id: '3',
          title: 'Clip',
          media: [{ url: 'https://cdn.example/promo.webm', type: 'video/webm' }],
          metadata: { display_takeover: true },
        })
      )
    ).toEqual({ kind: 'video', url: 'https://cdn.example/promo.webm' });
  });

  it('resolves display copy with metadata overrides', () => {
    const row = ann({
      id: 'copy',
      title: 'DB Title',
      body: 'DB body.',
      location: 'DB loc',
      metadata: {
        display_title: 'Override title',
        display_body: 'Override body',
      },
    });
    expect(resolveTakeoverDisplayCopy(row)).toEqual({
      title: 'Override title',
      body: 'Override body',
      location: 'DB loc',
    });
    const proxy = buildTakeoverAnnouncementProxy(row);
    expect(proxy.title).toBe('Override title');
    expect(proxy.body).toBe('Override body');
  });

  it('defaults overlay config blocks to on', () => {
    expect(resolveTakeoverOverlayConfig({ takeover_mode: 'overlay' })).toEqual({
      show_date: true,
      show_title: true,
      show_body: true,
      show_location: true,
      show_people: true,
      show_type_badge: true,
      show_qr: true,
      scrim: 'gradient',
    });
  });

  it('respects explicit overlay false flags', () => {
    expect(
      resolveTakeoverOverlayConfig({
        takeover_overlay: { show_body: false, scrim: 'none' },
      })
    ).toMatchObject({
      show_body: false,
      scrim: 'none',
      show_title: true,
    });
  });

  it('detects video URLs', () => {
    expect(isVideoMediaUrl('https://cdn.example/a.mp4')).toBe(true);
    expect(isVideoMediaUrl('https://cdn.example/a.jpg')).toBe(false);
  });

  it('resolves takeover QR modes', () => {
    expect(resolveTakeoverQrMode({ display_takeover: true, takeover_qr: 'embedded' })).toBe(
      'embedded'
    );
    expect(
      shouldShowTakeoverAppQr(
        { display_takeover: true, takeover_qr: 'embedded' },
        { hasScannableDestination: true }
      )
    ).toBe(false);
    expect(
      shouldShowTakeoverAppQr(
        { display_takeover: true, takeover_qr: 'app' },
        { hasScannableDestination: true }
      )
    ).toBe(true);
    expect(
      shouldShowTakeoverViewDetails({ display_takeover: true, takeover_qr: 'embedded' })
    ).toBe(false);
    expect(
      shouldShowTakeoverViewDetails({
        display_takeover: true,
        takeover_qr: 'embedded',
        show_view_details: true,
      })
    ).toBe(true);
    expect(
      resolveTakeoverQrMode({
        display_takeover: true,
        takeover_mode: 'overlay',
        takeover_overlay: { show_qr: false },
      })
    ).toBe('none');
  });
});

describe('announcement-month evergreen display', () => {
  const today = '2026-05-28';

  it('treats metadata.evergreen as always eligible', () => {
    const row = ann({
      id: 'e1',
      title: 'Always on',
      metadata: { evergreen: true, display_takeover: true, media_type: 'image' },
      image_url: 'https://cdn.example/sign.jpg',
    });
    expect(isAnnouncementEvergreenForDisplay(row)).toBe(true);
    expect(isAnnouncementRelevantForDisplay(row, today)).toBe(true);
  });

  it('treats undated display_takeover as evergreen', () => {
    const row = ann({
      id: 'e2',
      title: 'Lobby loop',
      metadata: { display_takeover: true },
      image_url: 'https://cdn.example/lobby.jpg',
    });
    expect(isAnnouncementEvergreenForDisplay(row)).toBe(true);
    expect(isAnnouncementRelevantForDisplay(row, today)).toBe(true);
  });

  it('keeps dated takeover inside the event window only', () => {
    const upcoming = ann({
      id: 'e3',
      title: 'Opening night',
      start_date: '2026-06-01',
      end_date: '2026-06-07',
      metadata: { display_takeover: true, media_type: 'video', video_url: 'https://cdn.example/open.mp4' },
    });
    expect(isAnnouncementEvergreenForDisplay(upcoming)).toBe(false);
    expect(isAnnouncementRelevantForDisplay(upcoming, today)).toBe(true);

    const past = ann({
      id: 'e4',
      title: 'Past show',
      start_date: '2026-01-01',
      end_date: '2026-01-07',
      metadata: { display_takeover: true },
      image_url: 'https://cdn.example/past.jpg',
    });
    expect(isAnnouncementRelevantForDisplay(past, today)).toBe(false);
  });

  it('still excludes undated standard announcements', () => {
    const row = ann({ id: 'e5', title: 'No dates' });
    expect(isAnnouncementEvergreenForDisplay(row)).toBe(false);
    expect(isAnnouncementRelevantForDisplay(row, today)).toBe(false);
  });
});

describe('sortAnnouncementsForSmartSignCarousel', () => {
  it('places pinned takeover slides before standard announcements', () => {
    const poster = ann({
      id: 'poster',
      title: 'Poster',
      created_at: '2026-01-01T00:00:00Z',
      image_url: 'https://cdn.example/poster.jpg',
      metadata: { display_takeover: true, pin_order: 0 },
    });
    const event = ann({
      id: 'event',
      title: 'Event',
      created_at: '2026-06-01T00:00:00Z',
      start_date: '2026-06-01',
    });
    const otherTakeover = ann({
      id: 'other',
      title: 'Other promo',
      created_at: '2026-05-01T00:00:00Z',
      image_url: 'https://cdn.example/other.jpg',
      metadata: { display_takeover: true, pin_order: 1 },
    });

    const sorted = sortAnnouncementsForSmartSignCarousel([event, otherTakeover, poster]);
    expect(sorted.map((a) => a.id)).toEqual(['poster', 'other', 'event']);
  });

  it('reads pin_order from metadata', () => {
    expect(getDisplayPinOrder({ pin_order: 0 })).toBe(0);
    expect(getDisplayPinOrder({})).toBeNull();
  });
});

describe('announcement-display-metadata-form', () => {
  it('hydrates and builds metadata payload for asset mode', () => {
    const form = displayMetadataFormFromAnnouncement({
      display_takeover: true,
      evergreen: true,
      pin_order: 0,
      workshop_slug: 'keep-me',
    });
    expect(form.display_takeover).toBe(true);
    expect(form.takeover_mode).toBe('asset');
    expect(form.pin_order).toBe('0');

    const payload = buildDisplayMetadataPayload(form, { workshop_slug: 'keep-me' });
    expect(payload.workshop_slug).toBe('keep-me');
    expect(payload.display_takeover).toBe(true);
    expect(payload.takeover_mode).toBe('asset');
    expect(payload.pin_order).toBe(0);
    expect(payload.takeover_overlay).toBeUndefined();
  });

  it('builds asset mode with embedded QR', () => {
    const form = {
      ...displayMetadataFormFromAnnouncement({ display_takeover: true }),
      takeover_qr: 'embedded' as const,
      show_view_details: false,
    };
    const payload = buildDisplayMetadataPayload(form);
    expect(payload.takeover_qr).toBe('embedded');
    expect(payload.show_view_details).toBeUndefined();
  });

  it('builds overlay mode payload with overrides and block toggles', () => {
    const form = displayMetadataFormFromAnnouncement({
      display_takeover: true,
      takeover_mode: 'overlay',
      display_title: 'Kiosk title',
      takeover_overlay: { show_body: false, scrim: 'dark' },
    });
    expect(form.takeover_mode).toBe('overlay');
    expect(form.display_title).toBe('Kiosk title');
    expect(form.overlay.show_body).toBe(false);
    expect(form.overlay.scrim).toBe('dark');

    const payload = buildDisplayMetadataPayload(form);
    expect(payload.takeover_mode).toBe('overlay');
    expect(payload.display_title).toBe('Kiosk title');
    expect(payload.takeover_overlay).toEqual({ show_body: false, scrim: 'dark' });
  });

  it('flags cinematic segment takeovers and excludes them from carousel', () => {
    const cinematic = ann({
      id: 'c1',
      title: 'Now Streaming',
      type: 'cinematic',
      metadata: {
        display_takeover: true,
        cinematic_segment: true,
        media_type: 'video',
        video_url: 'https://cdn.example/loop.mp4',
      },
    });
    expect(isCinematicSegmentAnnouncement(cinematic.metadata)).toBe(true);
    expect(excludeFromSmartSignCarousel(cinematic)).toBe(true);
    expect(resolveCinematicSegmentTakeover([cinematic])?.id).toBe('c1');
  });

  it('prefers video cinematic segment takeover over image', () => {
    const image = ann({
      id: 'img',
      title: 'Poster',
      image_url: 'https://cdn.example/poster.jpg',
      metadata: { display_takeover: true, cinematic_segment: true, media_type: 'image' },
    });
    const video = ann({
      id: 'vid',
      title: 'Loop',
      metadata: {
        display_takeover: true,
        cinematic_segment: true,
        media_type: 'video',
        video_url: 'https://cdn.example/loop.mp4',
      },
    });
    expect(resolveCinematicSegmentTakeover([image, video])?.id).toBe('vid');
  });
});
