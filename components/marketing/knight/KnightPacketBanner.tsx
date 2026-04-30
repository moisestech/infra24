import Image from 'next/image';
import { knightPacketBannerAlt, knightPacketBannerImages } from '@/lib/marketing/knight-packet';

export function KnightPacketBanner() {
  return (
    <div className="relative w-full overflow-hidden border-b border-neutral-200/90 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="relative aspect-[21/9] min-h-[120px] w-full max-h-[min(32vw,260px)] sm:max-h-[min(28vw,280px)]">
        <Image
          src={knightPacketBannerImages.light}
          alt={knightPacketBannerAlt}
          fill
          priority
          className="object-cover object-center dark:hidden"
          sizes="100vw"
        />
        <Image
          src={knightPacketBannerImages.dark}
          alt=""
          fill
          priority
          className="hidden object-cover object-center dark:block"
          sizes="100vw"
          aria-hidden
        />
      </div>
    </div>
  );
}
