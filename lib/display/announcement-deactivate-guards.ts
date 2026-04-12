import type { Announcement } from '@/types/announcement';
import { isClassOrWorkshopAnnouncement } from '@/lib/display/workshop-announcements-merge';

/**
 * Rows we do not auto-deactivate when bulk-hiding non-target display months
 * (workshop merge + artist-facing / resident listing announcements).
 */
export function isAnnouncementSkippedForNonTargetMonthDeactivation(a: Announcement): boolean {
  if (isClassOrWorkshopAnnouncement(a)) return true;
  const t = String(a.type || '').toLowerCase();
  if (t === 'attention_artists') return true;
  if (/^studio resident\b/i.test(String(a.title || '').trim())) return true;
  const tags = Array.isArray(a.tags) ? a.tags.map((x) => String(x).toLowerCase()) : [];
  if (
    tags.includes('artists') ||
    tags.includes('artist') ||
    tags.includes('residency') ||
    tags.includes('open-studios') ||
    tags.includes('open_studios') ||
    tags.includes('studio-resident')
  ) {
    return true;
  }
  return false;
}
