import type { Announcement, AnnouncementDisplayMetadata, TakeoverOverlayConfig } from '@/types/announcement';
import {
  getTakeoverMode,
  hasDisplayTakeover,
  parseAnnouncementDisplayMetadata,
} from '@/lib/display/announcement-display-mode';

export type TakeoverModeForm = 'asset' | 'overlay';
export type TakeoverScrimForm = 'gradient' | 'dark' | 'light' | 'none';
export type TakeoverQrForm = 'app' | 'embedded' | 'none';

export interface TakeoverOverlayFormState {
  show_date: boolean;
  show_title: boolean;
  show_body: boolean;
  show_location: boolean;
  show_people: boolean;
  show_type_badge: boolean;
  show_qr: boolean;
  scrim: TakeoverScrimForm;
}

export interface DisplayMetadataFormState {
  display_takeover: boolean;
  evergreen: boolean;
  media_type: '' | 'image' | 'video';
  video_url: string;
  takeover_mode: TakeoverModeForm;
  display_title: string;
  display_body: string;
  display_location: string;
  overlay: TakeoverOverlayFormState;
  takeover_qr: TakeoverQrForm;
  show_view_details: boolean;
  /** Empty string = no explicit pin; lower numbers show first among takeover slides */
  pin_order: string;
}

export const DEFAULT_OVERLAY_FORM: TakeoverOverlayFormState = {
  show_date: true,
  show_title: true,
  show_body: true,
  show_location: true,
  show_people: true,
  show_type_badge: true,
  show_qr: true,
  scrim: 'gradient',
};

export const DEFAULT_DISPLAY_METADATA_FORM: DisplayMetadataFormState = {
  display_takeover: false,
  evergreen: false,
  media_type: '',
  video_url: '',
  takeover_mode: 'asset',
  display_title: '',
  display_body: '',
  display_location: '',
  overlay: DEFAULT_OVERLAY_FORM,
  takeover_qr: 'embedded',
  show_view_details: false,
  pin_order: '',
};

function overlayFromMetadata(overlay?: TakeoverOverlayConfig): TakeoverOverlayFormState {
  if (!overlay || typeof overlay !== 'object') return { ...DEFAULT_OVERLAY_FORM };
  return {
    show_date: overlay.show_date !== false,
    show_title: overlay.show_title !== false,
    show_body: overlay.show_body !== false,
    show_location: overlay.show_location !== false,
    show_people: overlay.show_people !== false,
    show_type_badge: overlay.show_type_badge !== false,
    show_qr: overlay.show_qr !== false,
    scrim:
      overlay.scrim === 'dark' ||
      overlay.scrim === 'light' ||
      overlay.scrim === 'none' ||
      overlay.scrim === 'gradient'
        ? overlay.scrim
        : 'gradient',
  };
}

export function displayMetadataFormFromAnnouncement(
  metadata: Announcement['metadata']
): DisplayMetadataFormState {
  const meta = parseAnnouncementDisplayMetadata(metadata);
  const pin =
    typeof meta.pin_order === 'number' && Number.isFinite(meta.pin_order)
      ? String(meta.pin_order)
      : '';
  return {
    display_takeover: hasDisplayTakeover(metadata),
    evergreen: meta.evergreen === true,
    media_type: meta.media_type === 'image' || meta.media_type === 'video' ? meta.media_type : '',
    video_url: meta.video_url?.trim() ?? '',
    takeover_mode: getTakeoverMode(metadata),
    display_title: meta.display_title?.trim() ?? '',
    display_body: meta.display_body?.trim() ?? '',
    display_location: meta.display_location?.trim() ?? '',
    overlay: overlayFromMetadata(meta.takeover_overlay),
    takeover_qr:
      meta.takeover_qr === 'app' || meta.takeover_qr === 'embedded' || meta.takeover_qr === 'none'
        ? meta.takeover_qr
        : 'app',
    show_view_details: meta.show_view_details === true,
    pin_order: pin,
  };
}

function buildTakeoverOverlayPayload(
  overlay: TakeoverOverlayFormState
): TakeoverOverlayConfig | undefined {
  const allDefault =
    overlay.show_date &&
    overlay.show_title &&
    overlay.show_body &&
    overlay.show_location &&
    overlay.show_people &&
    overlay.show_type_badge &&
    overlay.show_qr &&
    overlay.scrim === 'gradient';
  if (allDefault) return undefined;

  const payload: TakeoverOverlayConfig = {};
  if (!overlay.show_date) payload.show_date = false;
  if (!overlay.show_title) payload.show_title = false;
  if (!overlay.show_body) payload.show_body = false;
  if (!overlay.show_location) payload.show_location = false;
  if (!overlay.show_people) payload.show_people = false;
  if (!overlay.show_type_badge) payload.show_type_badge = false;
  if (!overlay.show_qr) payload.show_qr = false;
  if (overlay.scrim !== 'gradient') payload.scrim = overlay.scrim;
  return Object.keys(payload).length > 0 ? payload : undefined;
}

/** Merge smart-sign display fields into existing metadata (preserves workshop keys, etc.). */
export function buildDisplayMetadataPayload(
  form: DisplayMetadataFormState,
  existingMetadata?: Announcement['metadata']
): AnnouncementDisplayMetadata {
  const base =
    existingMetadata && typeof existingMetadata === 'object'
      ? { ...(existingMetadata as AnnouncementDisplayMetadata) }
      : ({} as AnnouncementDisplayMetadata);

  delete base.image_only;
  delete base.takeover_minimal;

  if (form.display_takeover) {
    base.display_takeover = true;
  } else {
    delete base.display_takeover;
    delete base.takeover_mode;
    delete base.display_title;
    delete base.display_body;
    delete base.display_location;
    delete base.takeover_overlay;
    delete base.takeover_qr;
    delete base.show_view_details;
  }

  if (form.display_takeover && form.evergreen) {
    base.evergreen = true;
  } else {
    delete base.evergreen;
  }

  if (form.display_takeover && form.media_type) {
    base.media_type = form.media_type;
  } else {
    delete base.media_type;
  }

  const video = form.video_url.trim();
  if (form.display_takeover && video) {
    base.video_url = video;
  } else {
    delete base.video_url;
  }

  if (form.display_takeover) {
    base.takeover_mode = form.takeover_mode;

    if (form.takeover_mode === 'asset') {
      base.takeover_qr = form.takeover_qr;
      if (form.show_view_details) base.show_view_details = true;
      else delete base.show_view_details;
      delete base.display_title;
      delete base.display_body;
      delete base.display_location;
      delete base.takeover_overlay;
    } else {
      delete base.takeover_qr;
      delete base.show_view_details;
      const title = form.display_title.trim();
      const body = form.display_body.trim();
      const location = form.display_location.trim();
      if (title) base.display_title = title;
      else delete base.display_title;
      if (body) base.display_body = body;
      else delete base.display_body;
      if (location) base.display_location = location;
      else delete base.display_location;

      const overlayPayload = buildTakeoverOverlayPayload(form.overlay);
      if (overlayPayload) base.takeover_overlay = overlayPayload;
      else delete base.takeover_overlay;
    }
  }

  const pinTrim = form.pin_order.trim();
  if (form.display_takeover && pinTrim !== '') {
    const pin = Number.parseInt(pinTrim, 10);
    if (Number.isFinite(pin)) base.pin_order = pin;
    else delete base.pin_order;
  } else {
    delete base.pin_order;
  }

  return base;
}
