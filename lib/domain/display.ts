/** Shared enums for display / control plane */

export const SLIDE_KINDS = [
  'announcement',
  'media',
  'workshop_promo',
  'workshop_digest',
  'artist_spotlight',
  'empty',
] as const

export type SlideKind = (typeof SLIDE_KINDS)[number]

export const PLAYLIST_ITEM_KINDS = [
  'announcement',
  'media',
  'dynamic_announcements',
  'workshop_promo',
  'workshop_digest',
  'artist_spotlight',
] as const

export type PlaylistItemKind = (typeof PLAYLIST_ITEM_KINDS)[number]
