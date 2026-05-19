import Image from 'next/image'

export function IpAgeOfAiModuleTopicBanner({
  src,
  alt = '',
}: {
  src: string
  /** Decorative banner — empty alt when purely ornamental */
  alt?: string
}) {
  return (
    <div className="relative mb-4 aspect-[21/9] w-full overflow-hidden rounded-xl border border-border bg-muted">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover opacity-95 dark:opacity-85"
        sizes="(max-width: 768px) 100vw, 896px"
        priority={false}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/20 to-transparent dark:from-background/90" />
    </div>
  )
}
