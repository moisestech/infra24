/**
 * Shared org accent for /o/:slug listings: static tenant config wins, then API theme.
 * Tenant values are repo-controlled so Oolite cyan etc. are not overridden by stale DB themes.
 */

export const ORG_PRIMARY_FALLBACK = '#47abc4';

export function resolveOrgPrimary(
  tenantPrimary?: string | null,
  apiPrimary?: string | null
): string {
  const t = (tenantPrimary ?? '').trim();
  if (t) return t;
  const a = (apiPrimary ?? '').trim();
  if (a) return a;
  return ORG_PRIMARY_FALLBACK;
}

export interface OrgChrome {
  primary: string;
  solid: string;
  solidHover: string;
  gradient135: string;
  gradient135Hover: string;
  softSurface: string;
  softBorder: string;
  text: string;
  textMuted: string;
  iconTileBg: string;
  onSolid: string;
}

export function orgChromeFromPrimary(primary: string): OrgChrome {
  const solid = primary.trim() || ORG_PRIMARY_FALLBACK;
  const solidHover = `color-mix(in srgb, ${solid} 82%, black)`;
  return {
    primary: solid,
    solid,
    solidHover,
    gradient135: `linear-gradient(135deg, ${solid}, ${solidHover})`,
    gradient135Hover: `linear-gradient(135deg, ${solidHover}, ${solid})`,
    softSurface: `color-mix(in srgb, ${solid} 14%, white)`,
    softBorder: `color-mix(in srgb, ${solid} 28%, white)`,
    text: solid,
    textMuted: `color-mix(in srgb, ${solid} 52%, #64748b)`,
    iconTileBg: `color-mix(in srgb, ${solid} 10%, white)`,
    onSolid: '#ffffff',
  };
}
