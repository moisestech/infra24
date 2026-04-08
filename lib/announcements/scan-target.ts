/**
 * Shared rules for smart-sign scan redirects and client-side "has QR target" checks.
 * Keep in sync with GET /o/[slug]/announcements/[id]/scan.
 */

function isBlockedHostname(host: string): boolean {
  const h = host.toLowerCase();
  if (h === 'localhost' || h.endsWith('.localhost')) return true;
  if (/^(10\.|192\.168\.|127\.|169\.254\.|0\.0\.0\.0$)/.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) return true;
  return false;
}

/**
 * Returns a normalized https? URL string safe to redirect to, or null.
 */
export function getValidatedAnnouncementRedirectTarget(
  raw: string | null | undefined
): string | null {
  if (raw == null || typeof raw !== 'string') return null;
  const t = raw.trim();
  if (!t || t === '#') return null;

  let u: URL;
  try {
    u = new URL(t);
  } catch {
    return null;
  }

  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
  if (u.username || u.password) return null;
  if (isBlockedHostname(u.hostname)) return null;

  return u.toString();
}

export function resolveScanDestination(
  qr_destination_url: string | null | undefined,
  primary_link: string | null | undefined
): string | null {
  return (
    getValidatedAnnouncementRedirectTarget(qr_destination_url) ??
    getValidatedAnnouncementRedirectTarget(primary_link)
  );
}

export function announcementHasScannableDestination(a: {
  qr_destination_url?: string | null;
  primary_link?: string | null;
}): boolean {
  return resolveScanDestination(a.qr_destination_url, a.primary_link) !== null;
}

export function buildAnnouncementScanPath(orgSlug: string, announcementId: string): string {
  return `/o/${orgSlug}/announcements/${announcementId}/scan`;
}
