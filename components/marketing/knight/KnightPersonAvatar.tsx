import Image from 'next/image';
import { cn } from '@/lib/utils';

type KnightPersonAvatarProps = {
  name: string;
  initials: string;
  initialsClass: string;
  portraitSrc?: string;
  portraitAlt: string;
  size?: 'md' | 'lg' | 'xl';
};

export function KnightPersonAvatar({
  name,
  initials,
  initialsClass,
  portraitSrc,
  portraitAlt,
  size = 'lg',
}: KnightPersonAvatarProps) {
  const dim =
    size === 'xl'
      ? 'h-28 w-28 sm:h-32 sm:w-32'
      : size === 'lg'
        ? 'h-20 w-20 sm:h-24 sm:w-24'
        : 'h-16 w-16';
  const textSize = size === 'xl' ? 'text-2xl sm:text-3xl' : size === 'lg' ? 'text-xl sm:text-2xl' : 'text-lg';

  if (portraitSrc) {
    return (
      <div
        className={cn(
          'relative shrink-0 overflow-hidden rounded-full shadow-md',
          /* Light: neutral ring + white offset so faces stay visible on cards & gradients */
          'ring-neutral-300/95 ring-offset-white dark:ring-neutral-400 dark:ring-offset-2 dark:ring-offset-neutral-900',
          size === 'xl' ? 'ring-[3.5px] ring-offset-[6px] dark:ring-4 dark:ring-offset-2' : 'ring-2 ring-offset-2',
          dim
        )}
      >
        <Image
          src={portraitSrc}
          alt={portraitAlt}
          fill
          className="object-cover object-center"
          sizes={size === 'xl' ? '128px' : '96px'}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full ring-inset ring-[var(--cdc-border)] dark:ring-neutral-600',
        size === 'xl' ? 'ring-4' : 'ring-2',
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
