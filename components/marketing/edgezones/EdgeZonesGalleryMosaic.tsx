import Image from 'next/image'
import { EDGE_ZONES_GALLERY } from '@/lib/marketing/edgezones-media'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
}

/** Install / artwork mosaic for the exhibition section. */
export function EdgeZonesGalleryMosaic({ className }: Props) {
  if (EDGE_ZONES_GALLERY.length === 0) return null

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {EDGE_ZONES_GALLERY.map((photo) => (
        <figure
          key={photo.src}
          className="group overflow-hidden rounded-xl border border-[var(--cdc-border)] bg-white shadow-sm transition hover:border-teal-300/50 hover:shadow-[0_0_24px_rgba(13,148,136,0.2)] dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-teal-500/40"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 50vw, 25vw"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden
            />
          </div>
          <figcaption className="border-t border-[var(--cdc-border)] px-3 py-2 text-[11px] leading-snug text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
            {photo.caption ?? photo.alt}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
