import Image from 'next/image';
import { cn } from '@/lib/utils';

type KnightPersonAvatarProps = {
  name: string;
  initials: string;
  initialsClass: string;
  portraitSrc?: string;
  portraitAlt: string;
  size?: 'md' | 'lg';
};

export function KnightPersonAvatar({
  name,
  initials,
  initialsClass,
  portraitSrc,
  portraitAlt,
  size = 'lg',
}: KnightPersonAvatarProps) {
  const dim = size === 'lg' ? 'h-20 w-20 sm:h-24 sm:w-24' : 'h-16 w-16';
  const textSize = size === 'lg' ? 'text-xl sm:text-2xl' : 'text-lg';

  if (portraitSrc) {
    return (
      <div
        className={cn(
          'relative shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-md dark:ring-neutral-800',
          dim
        )}
      >
        <Image src={portraitSrc} alt={portraitAlt} fill className="object-cover" sizes="96px" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full ring-2 ring-inset ring-white/80 dark:ring-neutral-700/80',
        initialsClass,
        dim,
        textSize,
        'font-semibold tracking-tight'
      )}
      aria-label={`${name} avatar placeholder`}
    >
      {initials}
    </div>
  );
}
