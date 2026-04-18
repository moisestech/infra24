import Image from 'next/image';
import { cn } from '@/lib/utils';

export type SectionRightImage = {
  src: string;
  alt: string;
};

type SectionWithRightImageFadeProps = {
  id?: string;
  className?: string;
  image: SectionRightImage;
  children: React.ReactNode;
};

/**
 * Full-width section with a right-anchored photo and a left-edge fade into the section background
 * (readable text on the left).
 */
export function SectionWithRightImageFade({
  id,
  className,
  image,
  children,
}: SectionWithRightImageFadeProps) {
  return (
    <section id={id} className={cn('relative isolate overflow-hidden', className)}>
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-[min(58vw,780px)] min-h-[12rem] select-none"
        aria-hidden
      >
        <div className="relative h-full min-h-full w-full">
          <Image
            src={image.src}
            alt=""
            fill
            className="object-cover object-right"
            sizes="(max-width: 1024px) 60vw, 780px"
            priority={false}
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-white via-white/88 to-transparent dark:from-neutral-900 dark:via-neutral-900/90 dark:to-transparent"
            aria-hidden
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
