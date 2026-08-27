import type { LogoBandItem } from '@/lib/marketing/institutions/shared';
import { cn } from '@/lib/utils';

export function LogoBand({
  items,
  label,
  className,
}: {
  items: readonly LogoBandItem[];
  label: string;
  className?: string;
}) {
  return (
    <div className={cn('border-b border-[var(--cdc-border)] py-6 dark:border-neutral-800', className)}>
      <p className="cdc-font-mono-accent mb-4 text-[10px] uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
        {label}
      </p>
      <ul className="flex flex-wrap items-center gap-2">
        {items.map((item) => (
          <li
            key={item.alt}
            className="inline-flex min-h-9 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
          >
            {item.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.src} alt="" height={item.height ?? 20} className="h-5 w-auto" />
            ) : null}
            <span>{item.alt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
