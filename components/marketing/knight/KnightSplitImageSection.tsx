import Image from 'next/image';
import type { ReactNode } from 'react';
import { Section } from '@/components/marketing/cdc';
import { cn } from '@/lib/utils';

type KnightSplitImageSectionProps = {
  id?: string;
  sectionClassName?: string;
  /**
   * `leading` — image first in reading order (left column on large screens).
   * `trailing` — copy first, image right on large screens.
   */
  imageSide: 'leading' | 'trailing';
  imageSrc: string;
  /** When set, shown in dark mode instead of `imageSrc` (light keeps `imageSrc`). */
  imageSrcDark?: string;
  imageAlt: string;
  caption: string;
  children: ReactNode;
  /** Full-width block below the two-column grid (e.g. service evidence carousel). */
  belowFold?: ReactNode;
};

export function KnightSplitImageSection({
  id,
  sectionClassName,
  imageSide,
  imageSrc,
  imageSrcDark,
  imageAlt,
  caption,
  children,
  belowFold,
}: KnightSplitImageSectionProps) {
  const aspectInner = imageSrcDark ? (
    <>
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover object-center dark:hidden"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <Image
        src={imageSrcDark}
        alt=""
        fill
        className="hidden object-cover object-center dark:block"
        sizes="(max-width: 1024px) 100vw, 50vw"
        aria-hidden
      />
    </>
  ) : (
    <Image
      src={imageSrc}
      alt={imageAlt}
      fill
      className="object-cover"
      sizes="(max-width: 1024px) 100vw, 50vw"
    />
  );

  const figure = (
    <figure className="relative overflow-hidden rounded-2xl border border-neutral-200/90 bg-neutral-100 shadow-md ring-1 ring-black/[0.04] dark:border-neutral-700 dark:bg-neutral-900 dark:ring-white/[0.06]">
      <div className="relative aspect-[4/3] w-full">
        {aspectInner}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-teal-900/10 via-transparent to-fuchsia-900/10 dark:from-teal-950/40 dark:to-fuchsia-950/35" />
      </div>
      <figcaption className="border-t border-neutral-200/80 bg-white/95 px-3 py-2.5 text-xs leading-snug text-neutral-600 dark:border-neutral-700 dark:bg-neutral-950/95 dark:text-neutral-400">
        {caption}
      </figcaption>
    </figure>
  );

  return (
    <Section id={id} className={cn('scroll-mt-28', sectionClassName)}>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {imageSide === 'leading' ? (
          <>
            <div className="min-w-0">{figure}</div>
            <div className="min-w-0">{children}</div>
          </>
        ) : (
          <>
            <div className="min-w-0">{children}</div>
            <div className="min-w-0">{figure}</div>
          </>
        )}
      </div>
      {belowFold ? (
        <div className="mt-12 border-t border-neutral-200/80 pt-12 dark:border-neutral-700">{belowFold}</div>
      ) : null}
    </Section>
  );
}
