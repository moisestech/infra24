/**
 * Oolite / Infra24 constituent categories — stable slugs for metadata, smart sign, and DCC network.
 * `type_key` aligns with `org_member_types.type_key`; `constituent_type` in profile metadata matches it.
 */

export type ConstituentTypeKey =
  | 'studio_resident'
  | 'youth_resident'
  | 'cinematic_resident'
  | 'live_in_resident'
  | 'alumni'
  | 'staff'
  | 'affiliate';

export interface ConstituentTypeDefinition {
  type_key: ConstituentTypeKey;
  label: string;
  description: string;
  sort_order: number;
  is_staff?: boolean;
  /** Smart-sign artist grid filter token */
  display_filter?: 'studio_residents';
}

export const OOLITE_CONSTITUENT_TYPES: ConstituentTypeDefinition[] = [
  {
    type_key: 'studio_resident',
    label: 'Studio Resident',
    description: 'Year-round studio artist at Oolite Arts (Lincoln Road studios).',
    sort_order: 10,
    display_filter: 'studio_residents',
  },
  {
    type_key: 'youth_resident',
    label: 'Youth Resident',
    description: 'Youth studio and mentorship program resident.',
    sort_order: 20,
  },
  {
    type_key: 'cinematic_resident',
    label: 'Cinematic Resident',
    description: 'Film and cinematic arts residency.',
    sort_order: 30,
  },
  {
    type_key: 'live_in_resident',
    label: 'Live-in Resident',
    description: 'Live-in studio residency.',
    sort_order: 40,
  },
  {
    type_key: 'alumni',
    label: 'Alumni',
    description: 'Former Oolite studio or program participant.',
    sort_order: 50,
  },
  {
    type_key: 'staff',
    label: 'Staff',
    description: 'Oolite Arts staff.',
    sort_order: 90,
    is_staff: true,
  },
  {
    type_key: 'affiliate',
    label: 'Affiliate',
    description: 'Affiliate artist or partner participant.',
    sort_order: 95,
  },
];

const BY_KEY = new Map(OOLITE_CONSTITUENT_TYPES.map((t) => [t.type_key, t]));

export function getConstituentTypeDefinition(
  key: string | null | undefined
): ConstituentTypeDefinition | null {
  if (!key || typeof key !== 'string') return null;
  return BY_KEY.get(key.trim() as ConstituentTypeKey) ?? null;
}

export interface ArtistConstituentMetadata {
  /** Stable slug — primary key for filters and DCC graph bucketing */
  constituent_type?: ConstituentTypeKey | string;
  /** Human label (mirrors org_member_types.label) */
  constituent_label?: string;
  /** @deprecated Prefer constituent_type — kept for legacy rows */
  residency_type?: string;
  residency_cohort?: string;
  studio?: string;
  studio_resident?: boolean;
  headshot_url?: string;
  artwork_url?: string;
  /** Cloudinary studio portraits by frame (see lib/display/artist-portraits.ts) */
  portraits?: Partial<
    Record<
      'full_width_landscape' | 'full_width_vertical' | 'full_height_vertical',
      string[]
    >
  >;
  source?: string;
  [key: string]: unknown;
}

export function buildConstituentMetadata(
  typeKey: ConstituentTypeKey,
  extras: Record<string, unknown> = {}
): ArtistConstituentMetadata {
  const def = getConstituentTypeDefinition(typeKey);
  const label = def?.label ?? typeKey;
  return {
    constituent_type: typeKey,
    constituent_label: label,
    residency_type: label,
    ...extras,
  };
}

export function resolveConstituentTypeKey(
  metadata: unknown,
  memberTypeKey?: string | null,
  memberTypeLabel?: string | null
): ConstituentTypeKey | null {
  if (metadata && typeof metadata === 'object') {
    const meta = metadata as ArtistConstituentMetadata;
    const explicit = meta.constituent_type;
    if (typeof explicit === 'string' && BY_KEY.has(explicit as ConstituentTypeKey)) {
      return explicit as ConstituentTypeKey;
    }
    const legacy = String(meta.residency_type || '').toLowerCase();
    if (legacy.includes('studio resident')) return 'studio_resident';
    if (legacy.includes('youth')) return 'youth_resident';
    if (legacy.includes('cinematic')) return 'cinematic_resident';
    if (legacy.includes('live-in') || legacy.includes('live in')) return 'live_in_resident';
    if (legacy.includes('alumni')) return 'alumni';
    if (meta.studio_resident === true) return 'studio_resident';
  }
  if (memberTypeKey && BY_KEY.has(memberTypeKey as ConstituentTypeKey)) {
    return memberTypeKey as ConstituentTypeKey;
  }
  const label = String(memberTypeLabel || '').toLowerCase();
  if (label.includes('studio resident')) return 'studio_resident';
  if (label.includes('youth')) return 'youth_resident';
  if (label.includes('cinematic')) return 'cinematic_resident';
  return null;
}

export function resolveConstituentLabel(
  metadata: unknown,
  memberTypeLabel?: string | null
): string | null {
  if (metadata && typeof metadata === 'object') {
    const meta = metadata as ArtistConstituentMetadata;
    const label = meta.constituent_label || meta.residency_type;
    if (typeof label === 'string' && label.trim()) return label.trim();
  }
  if (memberTypeLabel?.trim()) return memberTypeLabel.trim();
  const key = resolveConstituentTypeKey(metadata, null, memberTypeLabel);
  return key ? getConstituentTypeDefinition(key)?.label ?? null : null;
}

export function artistMatchesConstituentFilter(
  metadata: unknown,
  memberTypeKey: string | null | undefined,
  filter: 'studio_residents' | 'all'
): boolean {
  if (filter === 'all') return true;
  if (filter === 'studio_residents') {
    return resolveConstituentTypeKey(metadata, memberTypeKey) === 'studio_resident';
  }
  return true;
}
