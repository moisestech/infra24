/** In-page anchors for /knight (and cross-links from /knight/founders). */

export const knightPacketNavItems = [
  { href: '#knight-top', label: 'Overview' },
  { href: '#partners', label: 'Partners' },
  { href: '#narrative', label: 'Narrative' },
  { href: '#identity', label: 'DCC links' },
  { href: '#people', label: 'People' },
  { href: '#files', label: 'Files' },
  { href: '#contact', label: 'Contact' },
] as const;

/** Section `id`s — order matches jump nav (scroll-spy). */
export const knightPacketSectionIds: readonly string[] = knightPacketNavItems.map((item) =>
  item.href.slice(1)
);

/** Anchor for “Who this packet is for” → scrolls to partner cards within #partners. */
export const knightPartnersContentFragment = '#partners-content' as const;

/** Partner strip titles → in-packet sections (scroll targets on `/knight`). */
export const knightPacketPartnerTitleHref = {
  /** DCC overview, context cards, public identity */
  dccIdentity: '/knight#identity',
  /** Knight-aligned narrative block + link to long-form grant page */
  knightNarrative: '/knight#narrative',
} as const;
