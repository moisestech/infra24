/** Per-page hero banners for org directory routes (overrides tenant theme.banner). */
export type DirectoryBannerPage = 'residents' | 'alumni' | 'artists'

const OOLITE_DIRECTORY_BANNERS: Partial<Record<DirectoryBannerPage, string>> = {
  residents:
    'https://res.cloudinary.com/dkod1at3i/image/upload/v1780427475/oolite-arts-horizontal_empuot.jpg',
  alumni:
    'https://res.cloudinary.com/dkod1at3i/image/upload/v1780428226/The-Ellies-2026_Step-and-Repeat_0119-1030x687_z9vp2f.jpg',
}

export function getDirectoryBannerUrl(
  orgSlug: string,
  page: DirectoryBannerPage
): string | undefined {
  const slug = orgSlug.trim().toLowerCase()
  if (slug === 'oolite') {
    return OOLITE_DIRECTORY_BANNERS[page]
  }
  return undefined
}
