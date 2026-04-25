import type { ImageAsset } from '@/lib/course/types'

/** Landscape placeholder when `Chapter.chapterBanner` is unset. */
export const DEFAULT_CHAPTER_BANNER: ImageAsset = {
  src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80&auto=format&fit=crop',
  alt: 'Abstract network and light trails — chapter banner placeholder.',
  caption: 'Replace with a chapter-specific still, slide crop, or work documentation when ready.',
}
